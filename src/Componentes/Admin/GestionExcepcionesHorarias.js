import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate } from 'react-router-dom';


const GestionExcepcionesHorarias = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [excepciones, setExcepciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarExcepciones();
  }, []);

  const cargarExcepciones = () => {
    fetch(`${API_BASE_URL}excepciones`)
      .then(res => res.json())
      .then(data => setExcepciones(data))
      .catch(err => console.error("Error al cargar excepciones:", err));
  };

  const agregarExcepcion = () => {
    if (!fechaSeleccionada) return;

    const payload = {
      fecha: fechaSeleccionada.toISOString().split("T")[0]
    };

    fetch(`${API_BASE_URL}excepciones`, {
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
    fetch(`${API_BASE_URL}excepciones/${id}`, {
      method: "DELETE"
    })
      .then(() => cargarExcepciones())
      .catch(err => console.error("Error al eliminar excepción:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 relative">

        {/* Botón volver */}
        <button
          onClick={() => navigate("/ListaAdmin")}
          className="absolute top-4 left-4 text-sm text-gray-600 hover:text-blue-600 hover:underline"
        >
          ← Volver
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Gestión de Excepciones Horarias
        </h2>

        {/* Calendario y botón agregar */}
        <div className="flex flex-col items-center">
          <div className="mb-4 border rounded-md shadow-sm p-2 bg-gray-50">
            <DayPicker
              mode="single"
              selected={fechaSeleccionada}
              onSelect={setFechaSeleccionada}
            />
          </div>

          <button
            onClick={agregarExcepcion}
            disabled={!fechaSeleccionada}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition disabled:bg-gray-400"
          >
            Agregar excepción
          </button>
        </div>

        {/* Lista de excepciones */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Días con excepción:</h3>

          {excepciones.length === 0 ? (
            <p className="text-gray-500">No hay excepciones registradas.</p>
          ) : (
            <ul className="space-y-2">
              {excepciones.map((e) => (
                <li
                  key={e.id}
                  className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md shadow-sm"
                >
                  <span className="text-gray-800">{e.fecha}</span>
                  <button
                    onClick={() => eliminarExcepcion(e.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

  );
};

export default GestionExcepcionesHorarias;
