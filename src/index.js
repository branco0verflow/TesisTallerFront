import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AdminProvider } from './AdminContext';
import { MecanicoProvider } from './MecanicoContext';
import { SeguimientoProvider } from './Componentes/SeguimientoContext'; // 👈 Asegurate de importar esto

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AdminProvider>
      <MecanicoProvider>
        <SeguimientoProvider> 
          <App />
        </SeguimientoProvider>
      </MecanicoProvider>
    </AdminProvider>
  </React.StrictMode>
);
