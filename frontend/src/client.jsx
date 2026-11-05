import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import './style.css';
if(!JSON.parse(document.getElementById('site-data').textContent).preview)document.addEventListener('click',e=>{const link=e.target.closest?.('a');if(link?.hostname==='wa.me')fetch('/api/whatsapp-tap',{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({page:location.pathname.replace(/\/$/,'')||'/'})}).catch(()=>{})});
hydrateRoot(document.getElementById('root'),<App path={location.pathname.replace(/\/$/,'')||'/'} search={JSON.parse(document.getElementById('site-data').textContent).preview?'':location.search} content={JSON.parse(document.getElementById('site-data').textContent)}/>);
