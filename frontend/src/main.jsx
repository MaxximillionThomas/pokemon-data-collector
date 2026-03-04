/**
 * Project:       Pokemon Data Collector
 * File:          main.jsx
 * @description   Mounts the App component to the DOM.
 * @author        Maxximillion Thomas
 * @date          February 28, 2026
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);