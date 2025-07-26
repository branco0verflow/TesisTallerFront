import React, { useEffect, useState } from "react";
import ModalModelo from "./ModalModelo";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ListaModelos() {
  const [modelos, setModelos] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [modeloModificado, setModeloModificado] = useState(false);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");

  const modelosPorPagina = 20;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarcas();
  }, []);

  useEffect(() => {
    setPaginaActual(1); // reiniciar a la página 1
    fetchModelos(0, modelosPorPagina, marcaSeleccionada);
  }, [marcaSeleccionada]);

  useEffect(() => {
    if (modeloModificado) {
      setModeloModificado(false);

      const marcaReset = "";
      setMarcaSeleccionada(marcaReset);

      fetchModelos(0, modelosPorPagina, marcaReset);
      setPaginaActual(1);
    }
  }, [modeloModificado]);

  const fetchMarcas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}marca`);
      const data = await res.json();
      setMarcas(data);
    } catch (err) {
      console.error("Error al obtener marcas:", err);
    }
  };

  const fetchModelos = async (pagina = 0, size = 20, marcaId = "") => {
    try {
      const url = marcaId
        ? `${API_BASE_URL}modelo/marca/${marcaId}?page=${pagina}&size=${size}`
        : `${API_BASE_URL}modelo?page=${pagina}&size=${size}`;

      const res = await fetch(url);
      const data = await res.json();
      setModelos(data.content);
      setTotalPaginas(data.totalPages);
    } catch (err) {
      console.error("Error al obtener modelos paginados:", err);
    }
  };
  const abrirModal = (modo, id = null) => {
    setModoModal(modo);
    setModeloSeleccionado(id);
    setIsModalOpen(true);
  };

  const handleMarcaChange = (e) => {
    setMarcaSeleccionada(e.target.value);
    setPaginaActual(1); // Reiniciar a la primera página al cambiar filtro
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Listado de Modelos</h1>
        <div className="mb-4">
          <label htmlFor="marcaFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Marca:
          </label>
          <select
            id="marcaFilter"
            value={marcaSeleccionada}
            onChange={handleMarcaChange}
            className="mt-1 block w-full max-w-xs rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((marca) => (
              <option key={marca.idMarca} value={marca.idMarca}>
                {marca.nombreMarca}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/ListaAdmin")}
            className="text-sm text-gray-600 hover:text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Volver al Panel
          </button>
          <button
            onClick={() => abrirModal("create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition"
          >
            + Crear Modelo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {modelos.map((modelo) => (
              <tr key={modelo.idModelo}>
                <td className="px-6 py-4 text-gray-800">{modelo.marca?.nombreMarca || "Sin Marca"}</td>
                <td className="px-6 py-4 text-gray-800">{modelo.nombreModelo}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => abrirModal("view", modelo.idModelo)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-300"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModal("edit", modelo.idModelo)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => {
              const nuevaPagina = Math.max(paginaActual - 1, 1);
              setPaginaActual(nuevaPagina);
              fetchModelos(nuevaPagina - 1, modelosPorPagina, marcaSeleccionada);
            }}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">{paginaActual}</span>
          <button
            onClick={() => {
              const nuevaPagina = paginaActual + 1;
              setPaginaActual(nuevaPagina);
              fetchModelos(nuevaPagina - 1, modelosPorPagina, marcaSeleccionada);
            }}
            disabled={paginaActual >= totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
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
