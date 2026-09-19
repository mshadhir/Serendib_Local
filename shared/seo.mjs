import {guideHub,planningGuides,planningPaths} from './guides.mjs';
// One page registry for server rendering, static previews, breadcrumbs and sitemap.
export const servicePaths = ['/sri-lanka-private-driver', '/colombo-airport-transfers', '/sri-lanka-driver-cost'];
export const guidePath = '/sri-lanka-itinerary-guide';
export const publicPaths = c => ['/', '/routes', ...servicePaths, guidePath, ...planningPaths, '/plan', '/about', '/privacy', '/terms', ...c.routes.map(r => '/routes/' + r.slug)];
export const escapeHTML = v => String(v).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[x]);
export const safeJSON = v => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

export function pageMeta(path, c) {
  const rate = c.vehicles.find(v => v.id === 'sedan').price;
  const pages = {
    '/': ['Sri Lanka Private Car & Driver', 'Plan your Sri Lanka journey with a private car and driver. Explore flexible 5, 7 and 10 day routes, transport guide prices and request a written quote.', 'Home'],
    '/routes': ['Sri Lanka Itineraries: 5, 7 & 10 Days', 'Compare three Sri Lanka itineraries by private car: the south coast, culture and tea country, or a 10 day island loop. Transport estimates; hotels separate.', 'Sri Lanka itineraries'],
    '/sri-lanka-private-driver': ['Hire a Private Driver in Sri Lanka', 'Plan a private driver hire in Sri Lanka: compare vehicles, understand the daily allowance, choose a manageable route and request availability and a quote.', 'Private driver hire'],
    '/colombo-airport-transfers': ['Colombo Airport Transfers (CMB)', 'Request a private Colombo airport transfer to your accommodation or next destination. Share your flight, luggage and drop-off for a written transport quote.', 'Colombo airport transfers'],
    '/sri-lanka-driver-cost': ['Sri Lanka Private Driver Cost & Guide Prices', 'See Sri Lanka car-and-driver planning rates from USD ' + rate + ' per vehicle per day, sample trip totals, inclusions and costs to check before accepting a quote.', 'Driver costs & prices'],
    [guidePath]: ['5, 7 or 10 Days in Sri Lanka? Itinerary Guide', 'Choose a realistic Sri Lanka itinerary for 5, 7 or 10 days. Compare coastal stays, culture and tea hills, hotel changes and time on the road.', 'Choosing your itinerary'],
    '/about': ['About Us: Sri Lanka Travel Planning', 'Meet Serendib Local, a new Sri Lanka travel business focused on private transport, realistic routes and clear written quotes before booking.', 'Our approach'],
    '/plan': ['Request a Sri Lanka Car & Driver Quote', 'Tell Serendib Local your route, dates, group size and luggage. Request a private car-and-driver or airport-transfer quote with no payment required.', 'Plan your journey'],
    '/privacy': ['Privacy Policy', 'How Serendib Local uses enquiry details, protects access to requests and handles correction or deletion requests.', 'Privacy'],
    '/terms': ['Booking Information & Transport Inclusions', 'Understand Serendib Local planning estimates, transport inclusions, optional activities and written booking, payment and cancellation conditions.', 'Booking information'],
    '/admin': ['Private Owner Dashboard', 'Private sign-in for the Serendib Local owner dashboard.', 'Owner dashboard'],
  };
  const route = c.routes.find(r => path === '/routes/' + r.slug);
  const routeDescriptions = {
    'south-coast-slowly': 'Explore a 5 day Sri Lanka south coast itinerary through Galle and Mirissa, with two coastal bases and a private transport guide. Hotels and activities separate.',
    'culture-and-tea-country': 'Plan 7 days in Sri Lanka with Sigiriya, Kandy and Nuwara Eliya. Two nights at each base, a flexible driving itinerary and a clear transport estimate.',
    'island-at-your-pace': 'Plan a 10 day Sri Lanka itinerary through Sigiriya, Kandy, Nuwara Eliya, Ella and Galle. See overnight stops and private car-and-driver estimates.',
  };
  const routeTitles = {'south-coast-slowly':'5 Day Sri Lanka South Coast Itinerary','culture-and-tea-country':'7 Day Sri Lanka Itinerary: Culture & Tea Country','island-at-your-pace':'10 Day Sri Lanka Itinerary: Culture, Hills & Coast'};
  const guide = planningGuides.find(g => g.path === path);
  pages[guideHub] = ['Sri Lanka Travel Guide: Routes, Drivers & Airport Pickups', 'Plan your Sri Lanka holiday with practical guides for visitors from the UK, Australia and India, family transport advice and CMB airport transfer routes.', 'Travel guides'];
  if(guide) pages[path] = [guide.title, guide.description, guide.label];
  const values = route ? [routeTitles[route.slug], routeDescriptions[route.slug], route.days + ' day itinerary'] : pages[path];
  const known = !!values;
  const [title, description, label] = values || ['Page Not Found', 'This page could not be found. Explore Serendib Local routes or plan a private Sri Lanka journey.', 'Page not found'];
  return {title: title + ' | Serendib Local', description, label, known, image: route?.image || '/images/hero.webp', imageAlt: route?.imageAlt || 'A village surrounded by Sri Lankan tea hills', indexable: known && !['/admin','/plan','/privacy','/terms'].includes(path)};
}

export function breadcrumbs(path, c) {
  if (path === '/' || !pageMeta(path,c).known || path === '/admin') return [];
  return [{name:'Home',path:'/'}, ...(planningGuides.some(g=>g.path===path)?[{name:'Travel guides',path:guideHub}]:[]), ...(path.startsWith('/routes/') ? [{name:'Sri Lanka itineraries',path:'/routes'}] : []), {name:pageMeta(path,c).label,path}];
}

export function structuredData(path,c,origin) {
  const meta=pageMeta(path,c); if(!meta.indexable) return null;
  const url=origin+path, org=origin+'/#organization', site=origin+'/#website';
  const graph=[{'@type':'Organization','@id':org,name:c.brand,url:origin+'/'}, {'@type':'WebSite','@id':site,url:origin+'/',name:c.brand,inLanguage:'en',publisher:{'@id':org}}];
  const crumbs=breadcrumbs(path,c);
  graph.push({'@type':(path==='/routes'||path===guideHub)?'CollectionPage':path==='/about'?'AboutPage':'WebPage','@id':url+'#webpage',url,name:meta.title,description:meta.description,inLanguage:'en',isPartOf:{'@id':site},...(crumbs.length?{breadcrumb:{'@id':url+'#breadcrumb'}}:{})});
  if(crumbs.length)graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((b,i)=>({'@type':'ListItem',position:i+1,name:b.name,item:origin+b.path}))});
  if(servicePaths.slice(0,2).includes(path))graph.push({'@type':'Service','@id':url+'#service',name:path==='/colombo-airport-transfers'?'Colombo airport transfer requests':'Sri Lanka private car and driver requests',url,description:meta.description,provider:{'@id':org},areaServed:{'@type':'Country',name:'Sri Lanka'}});
  const guide=planningGuides.find(g=>g.path===path);
  if(guide)graph.push({'@type':'Article','@id':url+'#article',headline:guide.title,description:guide.description,inLanguage:'en',dateModified:'2026-09-18',author:{'@id':org},publisher:{'@id':org},mainEntityOfPage:{'@id':url+'#webpage'}});
  if(guide?.service==='airport')graph.push({'@type':'Service','@id':url+'#service',name:guide.title,url,description:guide.description,provider:{'@id':org},areaServed:{'@type':'Country',name:'Sri Lanka'}});
  if(path===guideHub)graph.push({'@type':'ItemList',itemListElement:planningGuides.map((g,i)=>({'@type':'ListItem',position:i+1,name:g.title,url:origin+g.path}))});
  if(path==='/routes')graph.push({'@type':'ItemList',itemListElement:c.routes.map((r,i)=>({'@type':'ListItem',position:i+1,name:r.days+' day Sri Lanka itinerary: '+r.title,url:origin+'/routes/'+r.slug}))});
  return {'@context':'https://schema.org','@graph':graph};
}

export function buildHead(path,c,{origin,indexing=false,verification=''}={}) {
  origin=new URL(origin).origin;
  const meta=pageMeta(path,c),canonical=origin+path;
  const index=indexing&&!c.preview&&meta.indexable;
  const schema=structuredData(path,c,origin);
  const fields=[['description',meta.description],['robots',index?'index,follow,max-image-preview:large':'noindex,follow'],['twitter:card','summary_large_image'],['twitter:title',meta.title],['twitter:description',meta.description],['twitter:image',origin+meta.image]];
  const properties=[['og:title',meta.title],['og:description',meta.description],['og:url',canonical],['og:site_name',c.brand],['og:type','website'],['og:locale','en_GB'],['og:image',origin+meta.image],['og:image:alt',meta.imageAlt]];
  return '<title>'+escapeHTML(meta.title)+'</title>'+fields.map(([name,value])=>'<meta name="'+name+'" content="'+escapeHTML(value)+'">').join('')+properties.map(([name,value])=>'<meta property="'+name+'" content="'+escapeHTML(value)+'">').join('')+'<link rel="canonical" href="'+escapeHTML(canonical)+'">'+
    '<link rel="preload" href="/fonts/dm-serif.woff2" as="font" type="font/woff2" crossorigin>'+ 
    (path==='/'&&!c.preview&&/^[A-Za-z0-9_-]{10,200}$/.test(verification)?'<meta name="google-site-verification" content="'+escapeHTML(verification)+'">':'')+
    (schema?'<script type="application/ld+json">'+safeJSON(schema)+'</script>':'');
}

export function sitemap(c,origin) {
  origin=new URL(origin).origin;
  return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+publicPaths(c).filter(p=>pageMeta(p,c).indexable).map(path=>'<url><loc>'+escapeHTML(origin+path)+'</loc></url>').join('')+'</urlset>';
}
