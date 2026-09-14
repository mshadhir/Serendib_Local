import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {existsSync,readFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {openStore,checkPassword,inquirySchema,settingsSchema,statusSchema,estimate} from './store.mjs';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const safeJSON=v=>JSON.stringify(v).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const token=req=>(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('sl_session='))?.slice(11);
const mime={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.ico':'image/x-icon'};
class HttpError extends Error{constructor(status,message){super(message);this.status=status}}
async function jsonBody(req){if(!req.headers['content-type']?.startsWith('application/json'))throw new HttpError(415,'Send JSON.');const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>16384)throw new HttpError(413,'Request is too large.');chunks.push(chunk)}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new HttpError(400,'Invalid JSON.')}}
const emailConfigured=()=>!!(process.env.RESEND_API_KEY&&process.env.EMAIL_FROM&&process.env.NOTIFICATION_TO);
async function notify(store,id,service,origin){if(!emailConfigured())return;let status='failed';try{const r=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(12000),headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':id},body:JSON.stringify({from:process.env.EMAIL_FROM,to:[process.env.NOTIFICATION_TO],subject:'New Serendib Local enquiry '+id.slice(0,8),text:'A new enquiry is waiting in your private dashboard.\nReference: '+id+'\nService: '+service+'\nOpen: '+origin+'/admin'})});if(r.ok)status='sent'}catch{}store.db.prepare('UPDATE inquiries SET notification=? WHERE id=?').run(status,id)}
export function createApp({database=process.env.DATABASE_PATH||resolve(ROOT,'data/serendib.sqlite'),renderer=null,template=null}={}){
 const origin=(process.env.APP_ORIGIN||'http://localhost:'+(process.env.PORT||3000)).replace(/\/$/,'');if(new URL(origin).origin!==origin)throw Error('APP_ORIGIN must contain only the scheme and hostname (and port for local use).');
 const store=openStore(database),secure=origin.startsWith('https://'),indexing=process.env.INDEXING_ENABLED==='true',pending=new Set();
 const cookie=(value,clear=false)=>'sl_session='+value+'; HttpOnly; SameSite=Strict; Path=/; Max-Age='+(clear?'0':'43200')+(secure?'; Secure':'');
 const server=createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");if(secure)res.setHeader('Strict-Transport-Security','max-age=31536000');if(!indexing)res.setHeader('X-Robots-Tag','noindex, nofollow');
  const send=(status,value,type='application/json; charset=utf-8')=>{res.statusCode=status;res.setHeader('Content-Type',type);if(!res.hasHeader('Cache-Control'))res.setHeader('Cache-Control','no-store');res.end(type.startsWith('application/json')?JSON.stringify(value):value)};
  try{
   const url=new URL(req.url,origin);let path;try{path=decodeURIComponent(url.pathname).replace(/\/$/,'')||'/'}catch{throw new HttpError(400,'Invalid path.')}
   const ip=process.env.TRUST_PROXY==='1'?String(req.headers['x-forwarded-for']||req.socket.remoteAddress).split(',').at(-1).trim():req.socket.remoteAddress;
   const auth=()=>{const session=store.auth(token(req));if(!session)throw new HttpError(401,'Please sign in.');if(!['GET','HEAD'].includes(req.method)&&req.headers['x-csrf-token']!==session.csrf)throw new HttpError(403,'Please refresh and try again.');return session};
   if(!['GET','HEAD'].includes(req.method)&&req.headers.origin!==origin)throw new HttpError(403,'This request must come from this website.');
   if(path==='/api/health'&&req.method==='GET'){store.db.prepare('SELECT 1').get();return send(200,{ok:true})}
   if(path==='/api/site'&&req.method==='GET')return send(200,store.content());
   if(path==='/api/estimate'&&req.method==='GET'){try{return send(200,estimate(store.content(),url.searchParams.get('vehicle'),Number(url.searchParams.get('days'))))}catch{throw new HttpError(400,'Choose a vehicle and 1–30 days.')}}
   if(path==='/api/inquiries'&&req.method==='POST'){
    if(!store.limit('enquiry:'+ip,8,3600000))throw new HttpError(429,'Too many requests. Please try later or use WhatsApp.');const payload=inquirySchema.parse(await jsonBody(req));if(payload.website)throw new HttpError(422,'Unable to submit this request.');const id=randomUUID(),guide=payload.service==='airport'?null:estimate(store.content(),payload.vehicle,payload.days);const{website,...details}=payload;
    store.db.prepare('INSERT INTO inquiries VALUES(?,?,?,?,?,?)').run(id,new Date().toISOString(),'new',JSON.stringify(details),guide?JSON.stringify(guide):null,emailConfigured()?'pending':'not-configured');
    const notification=notify(store,id,payload.service,origin);pending.add(notification);notification.catch(()=>{}).finally(()=>pending.delete(notification));return send(201,{reference:id,message:'Your enquiry is saved. A booking is confirmed only after the details are agreed in writing.'});
   }
   if(path==='/api/admin/login'&&req.method==='POST'){if(!store.limit('login:'+ip,6,900000))throw new HttpError(429,'Too many sign-in attempts. Try again in 15 minutes.');const b=await jsonBody(req);if(typeof b.password!=='string'||b.password.length>200||!process.env.ADMIN_PASSWORD_HASH||!checkPassword(b.password,process.env.ADMIN_PASSWORD_HASH))throw new HttpError(401,'Unable to sign in.');const s=store.session();res.setHeader('Set-Cookie',cookie(s.token));return send(200,{csrf:s.csrf})}
   if(path==='/api/admin/session'&&req.method==='GET')return send(200,{csrf:auth().csrf,emailConfigured:emailConfigured()});
   if(path==='/api/admin/logout'&&req.method==='POST'){auth();store.logout(token(req));res.setHeader('Set-Cookie',cookie('',true));return send(200,{ok:true})}
   if(path==='/api/admin/inquiries'&&req.method==='GET'){auth();const offset=Number(url.searchParams.get('offset')||0);if(!Number.isInteger(offset)||offset<0||offset>1000000)throw new HttpError(400,'Invalid page.');const rows=store.db.prepare('SELECT * FROM inquiries ORDER BY created DESC LIMIT 100 OFFSET ?').all(offset);return send(200,{items:rows.map(r=>({...r,payload:JSON.parse(r.payload),estimate:r.estimate?JSON.parse(r.estimate):null})),total:store.db.prepare('SELECT COUNT(*) AS n FROM inquiries').get().n})}
   if(path.startsWith('/api/admin/inquiries/')&&req.method==='PATCH'){auth();const{status}=statusSchema.parse(await jsonBody(req));const r=store.db.prepare('UPDATE inquiries SET status=? WHERE id=?').run(status,path.split('/').at(-1));if(!r.changes)throw new HttpError(404,'Enquiry not found.');return send(200,{ok:true})}
   if(path.startsWith('/api/admin/inquiries/')&&req.method==='DELETE'){auth();store.db.prepare('DELETE FROM inquiries WHERE id=?').run(path.split('/').at(-1));return send(200,{ok:true})}
   if(path==='/api/admin/settings'&&req.method==='PUT'){auth();store.saveSettings(settingsSchema.parse(await jsonBody(req)));return send(200,{ok:true,content:store.content()})}
   if(path==='/api/bookings/create-checkout'||path.startsWith('/api/payments/'))return send(410,{error:'Online checkout is unavailable. Please request a written quote.'});
   if(path.startsWith('/api/'))throw new HttpError(404,'Not found.');
   if(!['GET','HEAD'].includes(req.method))throw new HttpError(405,'Method not allowed.');
   const c=store.content(),pages=['/','/routes','/plan','/about','/privacy','/terms',...c.routes.map(r=>'/routes/'+r.slug)];
   if(path==='/robots.txt')return send(200,indexing?'User-agent: *\nDisallow: /admin\nDisallow: /api/\nSitemap: '+origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n','text/plain; charset=utf-8');
   if(path==='/sitemap.xml')return send(200,'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(p=>'<url><loc>'+escape(origin+p)+'</loc></url>').join('')+'</urlset>','application/xml; charset=utf-8');
   if(['/blog','/booking-confirmed'].includes(path)||path.startsWith('/blog/')){res.writeHead(302,{Location:path.startsWith('/blog')?'/routes':'/plan'});return res.end()}
   const staticRoot=resolve(ROOT,'dist/client'),file=resolve(staticRoot,'.'+path);
   if(file.startsWith(staticRoot+sep)&&mime[extname(file)]){try{if((await stat(file)).isFile()){res.setHeader('Cache-Control',path.startsWith('/assets/')?'public, max-age=31536000, immutable':'public, max-age=86400');return send(200,await readFile(file),mime[extname(file)])}}catch{}throw new HttpError(404,'File not found.')}
   const known=pages.includes(path)||path==='/admin';if(!renderer||!template)throw new HttpError(503,'Website build is missing. Run npm run build.');const route=c.routes.find(r=>path==='/routes/'+r.slug);
   const titles={'/':'Sri Lanka, at your own pace','/routes':'Thoughtful routes around Sri Lanka','/plan':'Plan your Sri Lanka journey','/about':'Our approach','/privacy':'Privacy','/terms':'Booking information','/admin':'Private dashboard'},title=(route?.title||titles[path]||'Page not found')+' | Serendib Local',description=route?.summary||'Private car and driver requests in Sri Lanka. Flexible routes, clear guide prices and a journey planned around you.';
   const head='<title>'+escape(title)+'</title><meta name="description" content="'+escape(description)+'"><link rel="canonical" href="'+escape(origin+path)+'"><meta property="og:title" content="'+escape(title)+'"><meta property="og:description" content="'+escape(description)+'"><meta property="og:type" content="website"><meta property="og:image" content="'+escape(origin+'/images/hero.webp')+'">'+(!indexing||!known||path==='/admin'?'<meta name="robots" content="noindex,nofollow">':'');
   if(path==='/admin')res.setHeader('X-Robots-Tag','noindex,nofollow');return send(known?200:404,template.replace('<!--site-head-->',head).replace('<!--site-html-->',renderer(path,c,url.search)).replace('<!--site-data-->','<script type="application/json" id="site-data">'+safeJSON(c)+'</script>'),'text/html; charset=utf-8');
  }catch(e){const validation=Array.isArray(e.issues),status=e.status||(validation?422:500);if(status===500)console.error('Request failed:',e.name);return send(status,{error:validation?e.issues[0]?.message||'Check your details.':status===500?'Something went wrong. Please try again.':e.message})}
 });return {server,store,async close(){await new Promise(resolve=>server.close(resolve));await Promise.allSettled([...pending]);store.close()}};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const entry=resolve(ROOT,'dist/server/server.js');if(!existsSync(entry))throw Error('Run npm run build first.');const app=createApp({renderer:(await import(entry)).render,template:readFileSync(resolve(ROOT,'dist/client/template.html'),'utf8')});app.server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Serendib Local is listening on port '+(process.env.PORT||3000)));const stop=async()=>{await app.close();process.exit(0)};process.on('SIGTERM',stop);process.on('SIGINT',stop)}
