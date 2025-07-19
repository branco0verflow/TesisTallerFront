import React, { useEffect, useState } from "react";
import ModalTipoTarea from "./ModalTipoTarea";

export default function ListaTipoTareas() {
  const [tipoTareas, settipoTareas] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoTareaSeleccionada, setTipoTareaSeleccionada] = useState(null);
  const [tipoTareaModificada, setTipoTareaModificada] = useState(false);

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
      const response = await fetch("http://localhost:8081/sgc/api/v1/tipotarea");
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Listado de Tipos de Tarea</h1>
      <button
        onClick={() => abrirModalCrear()}
        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Crear
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Tipo de Tarea</th>
              <th className="px-4 py-2 text-left">Minutos</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipoTareas.map((tipoTarea) => (
              <tr key={tipoTarea.idTipoTarea} className="border-t">
                <td className="px-4 py-2">{tipoTarea.nombreTipoTarea}</td>
                <td className="px-4 py-2">{tipoTarea.tiempoMinutosTipoTarea}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => abrirModalVer(tipoTarea.idTipoTarea)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModalEditar(tipoTarea.idTipoTarea)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ModalTipoTarea
          idTipoTarea={tipoTareaSeleccionada}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setTipoTareaModificada={setTipoTareaModificada}
          modo={modoModal}
        />
      </div>
    </div>
  );
}