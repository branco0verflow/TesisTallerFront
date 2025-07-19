import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function ModalAdmin({ idAdmin, isOpen, onClose, setAdministradorModificado, modo }) {
    const [loading, setLoading] = useState(true);
    const [administrador, setAdministrador] = useState(null);

    let tituloModal = "Modificar Administrador";
    if (modo === "view") tituloModal = "Ver Administrador";
    else if (modo === "create") tituloModal = "Agregar Administrador";

    useEffect(() => {
        if (modo === "create") {
            setAdministrador({ nombreAdmin: "" });
            setLoading(false);
        } else if (idAdmin && isOpen) {
            fetch(`http://localhost:8081/sgc/api/v1/administrador/${idAdmin}`)
                .then(res => res.json())
                .then(data => {
                    setAdministrador({
                        ...data,
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error al obtener el administrador:", error);
                    setLoading(false);
                });
        }
    }, [idAdmin, isOpen, modo]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdministrador(prev => ({ ...prev, [name]: value }));
    };

    const crearAdministrador = () => {
        fetch(`http://localhost:8081/sgc/api/v1/administrador`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(administrador),
        })
            .then(res => {
                if (res.ok) {
                    toast.success("Administrador creado");
                    setAdministradorModificado(true);
                    onClose();
                } else {
                    toast.error("Error al crear el Administrador");
                }
            })
            .catch(err => {
                console.error("Error en el servidor:", err);
                toast.error("Error de red");
            });
    };

    const modificarAdministrador = () => {
        fetch(`http://localhost:8081/sgc/api/v1/administrador/${idAdmin}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(administrador),
        })
            .then(res => {
                console.log("Respuesta del servidor:", res);
                if (res.ok) {
                    toast.success("Administrador actualizado");
                    setAdministradorModificado(true);
                    onClose();
                } else {
                    toast.error("Error al modificar el Administrador");
                }
            })
            .catch(err => {
                console.error("Error en el servidor:", err);
                toast.error("Error de red");
            });
    };

    const eliminarAdministrador = () => {
        if (!window.confirm("¿Estás seguro de eliminar este Administrador?")) return;

        fetch(`http://localhost:8081/sgc/api/v1/administrador/${idAdmin}`, {
            method: "DELETE",
        })
            .then(res => {
                if (res.ok) {
                    toast.success("Administrador eliminado");
                    setAdministradorModificado(true);
                    onClose();
                } else {
                    toast.error("No se pudo eliminar el Administrador");
                }
            })
            .catch(err => {
                console.error("Error en el servidor:", err);
                toast.error("Error de red");
            });
    };

    if (!isOpen) return null;
    if (loading) return <div className="p-4">Cargando Administrador...</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <Toaster position="top-right" />
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">{tituloModal}</h2>

                <label className="block mb-4">
                    Nombre:
                    <input
                        name="nombreAdmin"
                        value={administrador?.nombreAdmin || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>

                <label className="block mb-4">
                    Apellido:
                    <input
                        name="apellidoAdmin"
                        value={administrador?.apellidoAdmin || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>

                <label className="block mb-4">
                    Email:
                    <input
                        name="emailAdmin"
                        value={administrador?.emailAdmin || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>

                <label className="block mb-4">
                    Contraseña:
                    <input
                        name="passwordAdmin"
                        value={administrador?.passwordAdmin || ""}
                        onChange={handleChange}
                        type="password"
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>


                <div className="flex justify-between items-center mt-6">
                    {modo === "edit" && (
                        <button
                            onClick={eliminarAdministrador}
                            className="p-2 rounded-full bg-red-400 hover:bg-red-600 text-white transition"
                            title="Eliminar Administrador"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex space-x-2">
                        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                            Cancelar
                        </button>
                        {modo !== "view" && (
                            <button
                                onClick={modo === "edit" ? modificarAdministrador : crearAdministrador}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {modo === "edit" ? "Guardar" : "Crear"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}