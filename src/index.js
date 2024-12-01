import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './UserContext';  // Import UserProvider

import png1 from '../src/images/image (2).png';
import png2 from '../src/images/image (4).png';
import png3 from '../src/images/image (5).png';
import png4 from '../src/images/image (6).png';

export { png1, png2, png3, png4 };

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <UserProvider> {/* Wrap your app with the UserProvider */}
      <App />
    </UserProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
