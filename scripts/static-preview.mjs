import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {render} from '../dist/server/server.js';
const content=JSON.parse(readFileSync('content/site.json','utf8'));
const template=readFileSync('dist/client/index.html','utf8');
writeFileSync('dist/client/template.html',template);
const pages=['/','/routes','/plan','/about','/privacy','/terms','/admin',...content.routes.map(r=>'/routes/'+r.slug)];
const data={...content,preview:true};
for(const path of [...pages,'/404']){
 const title=(content.routes.find(r=>path==='/routes/'+r.slug)?.title||({'/':'Sri Lanka, at your own pace','/routes':'Thoughtful routes around Sri Lanka','/plan':'Plan your journey','/about':'Our approach','/admin':'Owner dashboard'}[path])||'Serendib Local')+' | Serendib Local';
 const html=template.replace('<!--site-head-->','<title>'+title.replaceAll('&','&amp;')+'</title><meta name="robots" content="noindex,nofollow"><meta name="description" content="Private car and driver journeys in Sri Lanka. Flexible routes and clear transport guide prices.">').replace('<!--site-html-->',render(path,data)).replace('<!--site-data-->','<script type="application/json" id="site-data">'+JSON.stringify(data).replaceAll('<','\\u003c')+'</script>');
 const dest=path==='/404'?'dist/client/404.html':resolve('dist/client','.'+path,'index.html');mkdirSync(resolve(dest,'..'),{recursive:true});writeFileSync(dest,html);
}
mkdirSync('dist/client/fonts',{recursive:true});
for(const [source,target] of [['@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2','dm-sans.woff2'],['@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2','dm-serif.woff2'],['@fontsource-variable/dm-sans/LICENSE','DM-Sans-LICENSE.txt'],['@fontsource/dm-serif-display/LICENSE','DM-Serif-Display-LICENSE.txt']])copyFileSync('node_modules/'+source,'dist/client/fonts/'+target);
writeFileSync('dist/client/robots.txt','User-agent: *\nDisallow: /\n');
console.log('Built '+pages.length+' private preview pages.');
