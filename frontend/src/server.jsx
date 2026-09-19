import React from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.jsx';
export const render=(path,content,search='')=>renderToString(<App path={path} search={search} content={content}/>);
