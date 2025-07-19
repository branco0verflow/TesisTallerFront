import React, { useEffect, useState } from "react";
import ModalModelo from "./ModalModelo";

export default function ListaModelos() {
  const [modelos, setModelos] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [modeloModificado, setModeloModificado] = useState(false);

  useEffect(() => {
    fetchModelos();
  }, []);

  useEffect(() => {
    if (modeloModificado) {
      fetchModelos();
      setModeloModificado(false);
    }
  }, [modeloModificado]);

  const fetchModelos = async () => {
    try {
      const res = await fetch("http://localhost:8081/sgc/api/v1/modelo");
      const data = await res.json();
      setModelos(data);
    } catch (err) {
      console.error("Error al obtener modelos:", err);
    }
  };

  const abrirModalEditar = (id) => {
    setModeloSeleccionado(id);
    setModoModal("edit");
    setIsModalOpen(true);
  };
  const abrirModalCrear = () => {
    setModeloSeleccionado(null);
    setModoModal("create");
    setIsModalOpen(true);
  };
  const abrirModalVer = (id) => {
    setModeloSeleccionado(id);
    setModoModal("view");
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Listado de Modelos</h1>
      </div>
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
              <th className="px-4 py-2 text-left">Marca</th>
              <th className="px-4 py-2 text-left">Modelo</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {modelos.map((modelo) => (
              <tr key={modelo.idModelo} className="border-t">
                <td className="px-4 py-2">{modelo.marca?.nombreMarca || "Sin Marca"}</td>
                <td className="px-4 py-2">{modelo.nombreModelo}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => abrirModalVer(modelo.idModelo)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModalEditar(modelo.idModelo)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalModelo
        idModelo={modeloSeleccionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setModeloModificado={setModeloModificado}
        modo={modoModal}
      />
    </div>
  );
}