import React, { useEffect, useState } from "react";
import ModalAdmin from "./ModalAdmin";
import { useNavigate } from "react-router-dom";
import { PlusIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import BotonLogout from "./BotonLogout";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ListaAdministradores() {
  const [administradores, setAdministrador] = useState([]);
  const [modoModal, setModoModal] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [administradorSeleccionado, setAdministradorSeleccionado] = useState(null);
  const [administradorModificado, setAdministradorModificado] = useState(false);

  

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdministradores();
  }, []);

  useEffect(() => {
    if (administradorModificado) {
      fetchAdministradores();
      setAdministradorModificado(false);
    }
  }, [administradorModificado]);

  const fetchAdministradores = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}administrador`);
      const data = await res.json();
      setAdministrador(data.filter((admin) => admin.nombreAdmin !== "Sistema"));
    } catch (err) {
      console.error("Error al obtener administrador", err);
    }
  };

  const abrirModal = (modo, id = null) => {
    setModoModal(modo);
    setAdministradorSeleccionado(id);
    setIsModalOpen(true);
  };

  const botonesNavegacion = [
    { texto: "Marcas", ruta: "/ListaMarcas" },
    { texto: "Modelos", ruta: "/ListaModelos" },
    { texto: "Tipo de Tareas", ruta: "/ListaTipoTarea" },
    { texto: "Mecánicos", ruta: "/ListaMecanicos" },
    { texto: "Crear Retenes", ruta: "/crear-retenes" },
    { texto: "Inhabilitar feriados", ruta: "/excepciones-no-laborables" },
  ];

  return (
    <>
    < div className="bg-white shadow-sm h-12 rounded-md flex items-center justify-between px-4" >
            <div className="text-gray-700 font-semibold">Panel de Control</div>
            <div className="flex gap-3">

                
                <button
                    onClick={() => navigate("/ListaAdmin")}
                    className="flex items-center gap-2 px-3 py-2 ml-10 bg-white text-gray-700 border border-purple-300 rounded-md shadow-sm"
                >
                    <Cog6ToothIcon className="h-5 w-5" />
                </button>

                <div className="ml-10">
                    <BotonLogout tipoUsuario="admin" />
                </div>


            </div>

        </div>
    <div className="p-6 max-w-6xl mx-auto mt-10">

        <button
          onClick={() => navigate("/AVisordeTarea")}
          className=" text-blue-600 hover:underline text-sm"
        >
          ← Volver
        </button>

      <div className="animate-fade-in flex justify-center gap-3 mt-10 mb-6">
        {botonesNavegacion.map((btn) => (
          <button
            key={btn.texto}
            onClick={() => navigate(btn.ruta)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-900 text-white rounded-md shadow hover:bg-sky-700"
          >
            <Cog6ToothIcon className="h-5 w-5" /> {btn.texto}
          </button>
        ))}
      </div>

      {mostrarContenido && (
        <div className="animate-fade-in bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Administradores</h1>
            <button
              onClick={() => abrirModal("create")}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <PlusIcon className="h-5 w-5" /> Crear
            </button>
          </div>

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Apellido</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {administradores.map((admin) => (
                <tr key={admin.idAdmin} className="border-t">
                  <td className="px-4 py-2">{admin.nombreAdmin}</td>
                  <td className="px-4 py-2">{admin.apellidoAdmin}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => abrirModal("view", admin.idAdmin)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => abrirModal("edit", admin.idAdmin)}
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
      )}

      {/* Botón flotante */}
      {!mostrarContenido && (
        <button
          onClick={() => setMostrarContenido(true)}
          className="fixed bottom-6 right-6 bg-white text-gray-600 rounded-full p-4 hover:bg-gray-300"
          title="Mostrar listado"
        >
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      )}

      <ModalAdmin
        idAdmin={administradorSeleccionado}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setAdministradorModificado={setAdministradorModificado}
        modo={modoModal}
      />
    </div>
    </>
    
  );
}
