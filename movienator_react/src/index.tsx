import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/*
The root DOM element
 */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

