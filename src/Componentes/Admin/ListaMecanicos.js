import React, { useEffect, useState } from "react";
import ModalMecanico from "./ModalMecanico";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import Loading2 from "../Loading2";

export default function ListaMecanicos() {
  const [mecanicos, setMecanicos] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState(null);
  const [mecanicoModificado, setMecanicoModificado] = useState(false);
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}mecanico/DTO`);
      const data = await res.json();
      setMecanicos(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener mecánicos", err);
      setLoading(false);
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
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-xl">
      {loading && <Loading2 />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Mecánicos</h1>
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
            + Crear Mecánico
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mecanicos.map((mecanico) => (
              <tr key={mecanico.idMecanico}>
                <td className="px-6 py-4 text-gray-800">{mecanico.nombreMecanico}</td>
                <td className="px-6 py-4 text-gray-800">{mecanico.apellidoMecanico}</td>
                <td className="px-6 py-4 text-gray-800">{mecanico.activoMecanico ? "Sí" : "No"}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => abrirModalVer(mecanico.idMecanico)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModalEditar(mecanico.idMecanico)}
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

      <ModalMecanico
        idMecanico={mecanicoSeleccionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setMecanicoModificado={setMecanicoModificado}
        modo={modoModal}
      />
    </div>

  );
}