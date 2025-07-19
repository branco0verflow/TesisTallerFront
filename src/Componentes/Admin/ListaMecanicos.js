import React, { useEffect, useState } from "react";
import ModalMecanico from "./ModalMecanico";

export default function ListaMecanicos() {
  const [mecanicos, setMecanicos] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState(null);
  const [mecanicoModificado, setMecanicoModificado] = useState(false);

  useEffect(() => {
    fetchMecanicos();
  }, []);

  useEffect(() => {
    if (mecanicoModificado) {
      fetchMecanicos();
      setMecanicoModificado(false);
    }
  }, [mecanicoModificado]);

  const fetchMecanicos = async () => {
    try {
      const res = await fetch("http://localhost:8081/sgc/api/v1/mecanico");
      const data = await res.json();
      setMecanicos(data);
    } catch (err) {
      console.error("Error al obtener mecánicos", err);
    }
  };

  const handleActivarDesactivar = async (id, estadoActual) => {
    try {
      await fetch(`http://localhost:8081/sgc/api/v1/mecanico/${id}/estado`, {
        method: "PATCH"
      });
      fetchMecanicos();
    } catch (err) {
      console.error("Error al cambiar el estado del mecánico", err);
    }
  };

  const abrirModalEditar = (id) => {
    setMecanicoSeleccionado(id);
    setModoModal("edit");
    setIsModalOpen(true);
  };
  const abrirModalCrear = () => {
    setMecanicoSeleccionado(null);
    setModoModal("create");
    setIsModalOpen(true);
  };
  const abrirModalVer = (id) => {
    setMecanicoSeleccionado(id);
    setModoModal("view");
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Listado de Mecánicos</h1>
        <button
          onClick={() => abrirModalCrear()}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Crear
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Apellido</th>
              <th className="px-4 py-2 text-left">Activo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mecanicos.map((mecanico) => (
              <tr key={mecanico.idMecanico} className="border-t">
                <td className="px-4 py-2">{mecanico.nombreMecanico}</td>
                <td className="px-4 py-2">{mecanico.apellidoMecanico}</td>
                <td className="px-4 py-2">
                  {mecanico.activoMecanico ? "Sí" : "No"}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => abrirModalVer(mecanico.idMecanico)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModalEditar(mecanico.idMecanico)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Modificar
                  </button>
                  <button
                    onClick={() => handleActivarDesactivar(mecanico.idMecanico)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    {mecanico.activoMecanico ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ModalMecanico
          idMecanico={mecanicoSeleccionado}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setMecanicoModificado={setMecanicoModificado}
          modo={modoModal}
        />
      </div>
    </div>
  );
}