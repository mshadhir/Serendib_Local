import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {render} from '../dist/server/server.js';
import {publicPaths,buildHead,safeJSON,sitemap} from '../shared/seo.mjs';
const content=JSON.parse(readFileSync('content/site.json','utf8'));
const template=readFileSync('dist/client/index.html','utf8');
writeFileSync('dist/client/template.html',template);
const pages=[...publicPaths(content),'/admin'];
const previewOrigin='https://serendib-local-preview.ausgpt-11.chatgpt.site';
const data={...content,preview:true};
for(const path of [...pages,'/404']){
 const html=template.replace('<!--site-head-->',buildHead(path,data,{origin:previewOrigin,indexing:false})).replace('<!--site-html-->',render(path,data)).replace('<!--site-data-->','<script type="application/json" id="site-data">'+safeJSON(data)+'</script>');
 const dest=path==='/404'?'dist/client/404.html':resolve('dist/client','.'+path,'index.html');mkdirSync(resolve(dest,'..'),{recursive:true});writeFileSync(dest,html);
}
mkdirSync('dist/client/fonts',{recursive:true});
for(const [source,target] of [['@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2','dm-sans.woff2'],['@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2','dm-serif.woff2'],['@fontsource-variable/dm-sans/LICENSE','DM-Sans-LICENSE.txt'],['@fontsource/dm-serif-display/LICENSE','DM-Serif-Display-LICENSE.txt']])copyFileSync('node_modules/'+source,'dist/client/fonts/'+target);
writeFileSync('dist/client/robots.txt','User-agent: *\nDisallow: /\n');
writeFileSync('dist/client/sitemap.xml',sitemap(data,previewOrigin));
console.log('Built '+pages.length+' private preview pages.');
