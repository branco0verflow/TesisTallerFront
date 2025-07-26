import React, { useEffect, useState } from "react";
import ModalTipoTarea from "./ModalTipoTarea";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ListaTipoTareas() {
  const [tipoTareas, settipoTareas] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoTareaSeleccionada, setTipoTareaSeleccionada] = useState(null);
  const [tipoTareaModificada, setTipoTareaModificada] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTipotarea();
  }, []);

  useEffect(() => {
    if (tipoTareaModificada) {
      fetchTipotarea();
      setTipoTareaModificada(false);
    }
  }, [tipoTareaModificada]);

  const fetchTipotarea = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}tipotarea`);
      const data = await response.json();
      settipoTareas(data);
    } catch (error) {
      console.error("Error al obtener tipos de tareas:", error);
    }
  };

  const abrirModalEditar = (id) => {
    setTipoTareaSeleccionada(id);
    setModoModal("edit");
    setIsModalOpen(true);
  };
  const abrirModalCrear = () => {
    setTipoTareaSeleccionada(null);
    setModoModal("create");
    setIsModalOpen(true);
  };
  const abrirModalVer = (id) => {
    setTipoTareaSeleccionada(id);
    setModoModal("view");
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Tipos de Tarea</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/ListaAdmin")}
            className="text-sm text-gray-600 hover:text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Volver al Panel
          </button>
          <button
            onClick={() => abrirModalCrear()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            + Crear Tipo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Tarea</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutos</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tipoTareas.map((tipoTarea) => (
              <tr key={tipoTarea.idTipoTarea}>
                <td className="px-6 py-4 text-gray-800">{tipoTarea.nombreTipoTarea}</td>
                <td className="px-6 py-4 text-gray-800">{tipoTarea.tiempoMinutosTipoTarea}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => abrirModalVer(tipoTarea.idTipoTarea)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModalEditar(tipoTarea.idTipoTarea)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalTipoTarea
        idTipoTarea={tipoTareaSeleccionada}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setTipoTareaModificada={setTipoTareaModificada}
        modo={modoModal}
      />
    </div>
  );
}