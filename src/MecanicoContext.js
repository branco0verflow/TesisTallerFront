import React, { createContext, useContext, useState, useEffect } from "react";

const MecanicoContext = createContext();

export const MecanicoProvider = ({ children }) => {
  const [mecanico, setMecanico] = useState(null);

  useEffect(() => {
    const storedMecanico = localStorage.getItem("mecanico");
    if (storedMecanico) {
      setMecanico(JSON.parse(storedMecanico));
    }
  }, []);

  const login = (mecanicoData) => {
    setMecanico(mecanicoData);
    localStorage.setItem("mecanico", JSON.stringify(mecanicoData));
  };

  const logout = () => {
    setMecanico(null);
    localStorage.removeItem("mecanico");
  };

  return (
    <MecanicoContext.Provider value={{ mecanico, login, logout }}>
      {children}
    </MecanicoContext.Provider>
  );
};

export const useMecanico = () => {
  const context = useContext(MecanicoContext);
  if (!context) {
    throw new Error("useMecanico debe usarse dentro de MecanicoProvider");
  }
  return context;
};
