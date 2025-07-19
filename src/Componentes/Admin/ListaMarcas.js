import React, { useEffect, useState } from "react";
import ModalMarca from "./ModalMarca";

export default function ListaMarcas() {
  const [marcas, setMarcas] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [marcaModificada, setMarcaModificada] = useState(false);

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
      const response = await fetch("http://localhost:8081/sgc/api/v1/marca");
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Listado de Marcas</h1>
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
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((marca) => (
              <tr key={marca.idMarca} className="border-t">
                <td className="px-4 py-2">{marca.nombreMarca}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => abrirModalVer(marca.idMarca)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => abrirModalEditar(marca.idMarca)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ModalMarca
          idMarca={marcaSeleccionada}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setMarcaModificada={setMarcaModificada}
          modo={modoModal}
        />
      </div>
    </div>
  );
}