import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const GestionExcepcionesHorarias = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [excepciones, setExcepciones] = useState([]);

  useEffect(() => {
    cargarExcepciones();
  }, []);

  const cargarExcepciones = () => {
    fetch("http://localhost:8081/sgc/api/v1/excepciones")
      .then(res => res.json())
      .then(data => setExcepciones(data))
      .catch(err => console.error("Error al cargar excepciones:", err));
  };

  const agregarExcepcion = () => {
    if (!fechaSeleccionada) return;

    const payload = {
      fecha: fechaSeleccionada.toISOString().split("T")[0]
    };

    fetch("http://localhost:8081/sgc/api/v1/excepciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(() => {
        setFechaSeleccionada(null);
        cargarExcepciones();
      })
      .catch(err => console.error("Error al agregar excepción:", err));
  };

  const eliminarExcepcion = (id) => {
    fetch(`http://localhost:8081/sgc/api/v1/excepciones/${id}`, {
      method: "DELETE"
    })
      .then(() => cargarExcepciones())
      .catch(err => console.error("Error al eliminar excepción:", err));
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Gestión de Excepciones Horarias</h2>

      <DayPicker
        mode="single"
        selected={fechaSeleccionada}
        onSelect={setFechaSeleccionada}
      />

      <button
        onClick={agregarExcepcion}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!fechaSeleccionada}
      >
        Agregar excepción
      </button>

      <h3 className="mt-6 text-lg font-semibold">Días con excepción:</h3>
      <ul className="mt-2 space-y-2">
        {excepciones.map((e) => (
          <li key={e.id} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
            <span>{e.fecha}</span>
            <button
              onClick={() => eliminarExcepcion(e.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionExcepcionesHorarias;
