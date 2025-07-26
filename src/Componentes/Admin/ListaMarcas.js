import React, { useEffect, useState } from "react";
import ModalMarca from "./ModalMarca";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ListaMarcas() {
  const [marcas, setMarcas] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [marcaModificada, setMarcaModificada] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarcas();
  }, []);

  useEffect(() => {
    if (marcaModificada) {
      fetchMarcas();
      setMarcaModificada(false);
    }
  }, [marcaModificada]);

  const fetchMarcas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}marca`);
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  };

  const abrirModalEditar = (id) => {
    setMarcaSeleccionada(id);
    setModoModal("edit");
    setIsModalOpen(true);
  };
  const abrirModalCrear = () => {
    setMarcaSeleccionada(null);
    setModoModal("create");
    setIsModalOpen(true);
  };
  const abrirModalVer = (id) => {
    setMarcaSeleccionada(id);
    setModoModal("view");
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Marcas</h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3">

            <button
              onClick={() => navigate("/ListaAdmin")}
              className="text-sm text-gray-600 hover:text-blue-600 hover:underline flex items-center mr-3"
            >
              ← Volver al Panel
            </button>
          </div>
          <button
            onClick={() => abrirModalCrear()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            + Crear Marca
          </button>
        </div>

      </div>



      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {marcas.map((marca) => (
              <tr key={marca.idMarca}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {marca.nombreMarca}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => abrirModalVer(marca.idMarca)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModalEditar(marca.idMarca)}
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

      <ModalMarca
        idMarca={marcaSeleccionada}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setMarcaModificada={setMarcaModificada}
        modo={modoModal}
      />
    </div>

  );
}