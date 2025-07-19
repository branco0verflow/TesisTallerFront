import React, { useEffect, useState } from "react";
import ModalAdmin from "./ModalAdmin";
import { useNavigate } from 'react-router-dom';

export default function ListaAdministradores() {
    const [administradores, setAdministrador] = useState([]);
    const [modoModal, setModoModal] = useState("view");
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            const res = await fetch("http://localhost:8081/sgc/api/v1/administrador");
            const data = await res.json();
            setAdministrador(data);
        } catch (err) {
            console.error("Error al obtener administrador", err);
        }
    };

    const toMarca = () => {
        navigate('/ListaMarcas');
    }

    const toModelo = () => {
        navigate('/ListaModelos');
    }

    const toTipoTarea = () => {
        navigate('/ListaTipoTarea');
    }

    const toMecanico = () => {
        navigate('/ListaMecanicos');
    }


    const abrirModalEditar = (id) => {
        setAdministradorSeleccionado(id);
        setModoModal("edit");
        setIsModalOpen(true);
    };
    const abrirModalCrear = () => {
        setAdministradorSeleccionado(null);
        setModoModal("create");
        setIsModalOpen(true);
    };
    const abrirModalVer = (id) => {
        setAdministradorSeleccionado(id);
        setModoModal("view");
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Listado de Administradores</h1>
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
                            <th className="px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {administradores.map((administrador) => (
                            <tr key={administrador.idAdmin} className="border-t">
                                <td className="px-4 py-2">{administrador.nombreAdmin}</td>
                                <td className="px-4 py-2">{administrador.apellidoAdmin}</td>
                                <td className="px-4 py-2 flex gap-2 justify-center">
                                    <button
                                        onClick={() => abrirModalVer(administrador.idAdmin)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Ver
                                    </button>
                                    <button
                                        onClick={() => abrirModalEditar(administrador.idAdmin)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Modificar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    
                </table>

<button
                        onClick={() => toMarca()}
                        className="rounded-full p-5 bg-blue-600 hover:bg-blue-700  text-white shadow-md shadow-gray-400 mr-2"
                    >
                        Marcas
                    </button>

                    <button
                        onClick={() => toModelo()}
                        className="rounded-full p-5 bg-blue-600 hover:bg-blue-700  text-white shadow-md shadow-gray-400 mr-2"
                    >
                        Modelos
                    </button>

                    <button
                        onClick={() => toTipoTarea()}
                        className="rounded-full p-5 bg-blue-600 hover:bg-blue-700  text-white shadow-md shadow-gray-400 mr-2"
                    >
                        Tipo de Tareas
                    </button>
                    <button
                        onClick={() => toMecanico()}
                        className="rounded-full p-5 bg-blue-600 hover:bg-blue-700  text-white shadow-md shadow-gray-400 mr-2"
                    >
                        Mecanicos
                    </button>
                    
                <ModalAdmin
                    idAdmin={administradorSeleccionado}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    setAdministradorModificado={setAdministradorModificado}
                    modo={modoModal}
                />
            </div>
        </div>
    );
}