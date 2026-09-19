import {test} from 'node:test';
import {request} from 'node:http';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {defaults} from '../backend/store.mjs';
import {createApp} from '../backend/server.mjs';
import {render} from '../dist/server/server.js';
import {publicPaths,pageMeta,breadcrumbs,buildHead,structuredData,sitemap,servicePaths,guidePath} from '../shared/seo.mjs';
import {planningGuides,planningPaths,guideHub} from '../shared/guides.mjs';
import {imageSources} from '../shared/images.mjs';
const origin='https://travel.example.com';

test('all indexable pages have unique, relevant metadata and visible content',()=>{
 const titles=new Set(),descriptions=new Set();
 for(const path of publicPaths(defaults)){
  const meta=pageMeta(path,defaults),html=render(path,defaults);
  assert.equal(meta.known,true,path);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path);
  if(meta.indexable){assert.ok(!titles.has(meta.title),'Duplicate title: '+path);assert.ok(!descriptions.has(meta.description),'Duplicate description: '+path);assert.ok(meta.description.length>80,path);titles.add(meta.title);descriptions.add(meta.description);}
  for(const b of breadcrumbs(path,defaults))assert.ok(html.includes(b.name.replaceAll('&','&amp;')),path+' has a visible breadcrumb');
 }
 for(const path of [...servicePaths,guidePath])assert.ok(render(path,defaults).replace(/<[^>]*>/g,' ').split(/\s+/).length>400,path+' has substantive content');
});

test('canonical URLs and structured data agree; no invented local business details or review scores',()=>{
 for(const path of publicPaths(defaults).filter(p=>pageMeta(p,defaults).indexable)){
  const head=buildHead(path,defaults,{origin,indexing:true});
  assert.match(head,/content="index,follow,max-image-preview:large"/);
  assert.ok(head.includes('rel="canonical" href="'+origin+path+'"'));
  assert.ok(head.includes('property="og:url" content="'+origin+path+'"'));
  const json=JSON.parse(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(json['@context'],'https://schema.org');
  assert.deepEqual(json,structuredData(path,defaults,origin));
  assert.doesNotMatch(JSON.stringify(json),/aggregateRating|reviewCount|streetAddress|foundingDate|LocalBusiness|priceValidUntil/);
  const b=json['@graph'].find(g=>g['@type']==='BreadcrumbList');
  if(path!=='/')assert.deepEqual(b.itemListElement.map(i=>i.item),breadcrumbs(path,defaults).map(i=>origin+i.path));
 }
 const changed=structuredClone(defaults);changed.vehicles[0].price=64;
 assert.match(buildHead('/sri-lanka-driver-cost',changed,{origin,indexing:true}),/USD 64/);
 assert.match(render('/sri-lanka-driver-cost',changed),/\$448/);
});

test('sitemap contains only canonical indexable pages and indexing keeps admin, forms and preview out',()=>{
 const xml=sitemap(defaults,origin),expected=publicPaths(defaults).filter(p=>pageMeta(p,defaults).indexable);
 assert.equal((xml.match(/<url>/g)||[]).length,expected.length);
 for(const path of expected)assert.ok(xml.includes('<loc>'+origin+path+'</loc>'));
 for(const path of ['/admin','/plan','/privacy','/terms','/missing']){
  assert.ok(!xml.includes('<loc>'+origin+path+'</loc>'));
  assert.match(buildHead(path,defaults,{origin,indexing:true}),/noindex,follow/);
 }
 assert.match(buildHead('/',{...defaults,preview:true},{origin,indexing:true}),/noindex,follow/);
 assert.doesNotMatch(buildHead('/',defaults,{origin,indexing:true}),/google-site-verification/);
 assert.match(buildHead('/',defaults,{origin,indexing:true,verification:'ownerProvidedToken_12345'}),/google-site-verification/);
 assert.doesNotMatch(buildHead('/',{...defaults,preview:true},{origin,indexing:true,verification:'ownerProvidedToken_12345'}),/google-site-verification/);
});

test('search metadata remains safe with special characters and malicious configuration strings',()=>{
 const c=structuredClone(defaults);c.brand='A </script><script>alert(1)</script> & B';
 const head=buildHead('/',c,{origin,indexing:true,verification:'"><script>alert(1)</script>'});
 assert.doesNotMatch(head,/<script>alert\(1\)<\/script>/);
 assert.doesNotMatch(head,/google-site-verification/);
 const json=head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
 assert.equal(JSON.parse(json)['@graph'][0].name,c.brand);
});

test('production server redirects duplicate URLs, serves SEO pages and exposes no search-visible admin page',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'serendib-seo-'));process.env.APP_ORIGIN=origin;process.env.INDEXING_ENABLED='true';
 const app=createApp({database:join(dir,'test.sqlite'),renderer:render,template:readFileSync('dist/client/template.html','utf8')});
 await new Promise(r=>app.server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+app.server.address().port;
 const get=(path,host='travel.example.com')=>new Promise((resolve,reject)=>{const req=request(base+path,{headers:{Host:host}},res=>{const chunks=[];res.on('data',b=>chunks.push(b));res.on('end',()=>resolve(new Response(Buffer.concat(chunks),{status:res.statusCode,headers:res.headers})));});req.on('error',reject);req.end();});
 try{
  for(const [path,target] of [['/routes/','/routes'],['/routes/index.html','/routes'],['/index.html','/'],['/sri-lanka-driver-cost/?utm_source=test','/sri-lanka-driver-cost?utm_source=test']]){const r=await get(path);assert.equal(r.status,308,path);assert.equal(r.headers.get('location'),origin+target)}
  assert.equal((await get('/','alternate.example.com')).headers.get('location'),origin+'/');
  for(const path of [...servicePaths,guidePath,...planningPaths]){const r=await get(path);assert.equal(r.status,200,path);const html=await r.text();assert.match(html,/<script type="application\/ld\+json">/);assert.equal(r.headers.get('x-robots-tag'),null);for(const [,href] of html.matchAll(/href="(\/[^"#?]*)[^\"]*"/g)){const target=href||'/';const linked=await get(target);assert.ok([200,308].includes(linked.status),path+' → '+target);}}
  assert.match((await get('/admin')).headers.get('x-robots-tag'),/noindex/);
  assert.equal((await get('/not-a-real-destination')).status,404);
  assert.equal((await get('/blog/missing-article')).status,404);
  assert.equal((await get('/blog')).status,301);
  assert.match(await (await get('/robots.txt')).text(),/Sitemap: https:\/\/travel.example.com\/sitemap.xml/);
 }finally{await app.close();rmSync(dir,{recursive:true,force:true});delete process.env.INDEXING_ENABLED;delete process.env.APP_ORIGIN;}
});

test('responsive image candidates are bundled and lighter than the original hero',()=>{
 for(const src of ['/images/hero.webp','/images/coast.webp','/images/train.webp'])for(const item of imageSources(src).split(', ')){const path=item.split(' ')[0];assert.ok(existsSync('dist/client'+path),path)}
 assert.ok(readFileSync('dist/client/images/hero-640.webp').length<readFileSync('dist/client/images/hero.webp').length);
 const html=render('/',defaults);assert.match(html,/srcSet=/);assert.match(html,/fetchPriority="high"/);
 for(const path of [...servicePaths,guidePath]){const html=readFileSync('dist/client'+path+'/index.html','utf8');assert.match(html,/noindex,follow/);assert.match(html,/<title>/);}
});


test('new guides are discoverable, have working section anchors and preserve editable guide prices',()=>{
 const hub=render(guideHub,defaults);
 for(const guide of planningGuides){
  assert.ok(hub.includes('href="'+guide.path+'"'),guide.path);
  const html=render(guide.path,defaults);
  assert.ok(html.replace(/<[^>]*>/g,' ').split(/\s+/).length>350,guide.path);
  for(const [,id] of html.matchAll(/href="#(section-\d+)"/g))assert.ok(html.includes('id="'+id+'"'),guide.path+' '+id);
  assert.ok(html.includes('/plan?service='+(guide.service||'multi-day')));
  assert.ok(structuredData(guide.path,defaults,origin)['@graph'].some(g=>g['@type']==='Article'));
 }
 const changed=structuredClone(defaults);changed.vehicles[0].price=123;
 assert.match(render('/sri-lanka-holidays-from-uk',changed).replace(/<!--[\s\S]*?-->/g,''),/USD 123/);
 assert.doesNotMatch(render('/colombo-airport-to-galle',changed).replace(/<!--[\s\S]*?-->/g,''),/USD 123/);
 assert.equal(publicPaths(defaults).filter(p=>pageMeta(p,defaults).indexable).length,17);
});
