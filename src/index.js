import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AdminProvider } from './AdminContext';
import { MecanicoProvider } from './MecanicoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <AdminProvider>
      <MecanicoProvider>
        <App />
      </MecanicoProvider>
    </AdminProvider>

  </React.StrictMode>
);
