import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import App from './App.jsx';
import './style.css';
hydrateRoot(document.getElementById('root'),<App path={location.pathname.replace(/\/$/,'')||'/'} search={JSON.parse(document.getElementById('site-data').textContent).preview?'':location.search} content={JSON.parse(document.getElementById('site-data').textContent)}/>);
