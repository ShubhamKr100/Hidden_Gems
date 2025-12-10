// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.jsx';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- Router ko yahan import karein
import App from './App.jsx'
import './index.css' // Ya App.css, jo bhi aapki main CSS file hai

// --- YEH DO LINES ADD KAREIN ---
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
// ---------------------------------


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Router ko <App /> ke baahar yahan rakhein */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)