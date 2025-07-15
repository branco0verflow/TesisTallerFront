import { createContext, useContext, useState } from "react";

const SeguimientoContext = createContext();

export const SeguimientoProvider = ({ children }) => {
  const [seguimientoData, setSeguimientoData] = useState({
    cedula: "",
    email: "",
    idCliente: null,
    idVehiculo: null,
  });

  const updateSeguimiento = (data) => {
    setSeguimientoData(prev => ({ ...prev, ...data }));
  };

  return (
    <SeguimientoContext.Provider value={{ seguimientoData, updateSeguimiento }}>
      {children}
    </SeguimientoContext.Provider>
  );
};

export const useSeguimiento = () => useContext(SeguimientoContext);
