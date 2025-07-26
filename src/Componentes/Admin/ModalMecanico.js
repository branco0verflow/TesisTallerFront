import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/solid";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ModalMecanico({ idMecanico, isOpen, onClose, setMecanicoModificado, modo }) {
    const [loading, setLoading] = useState(true);
    const [mecanico, setMecanico] = useState(null);
    const [tipoTareas, setTipoTareas] = useState([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState("");

    let tituloModal = "Modificar Mecanico";
    if (modo === "view") tituloModal = "Ver Mecanico";
    else if (modo === "create") tituloModal = "Agregar Mecanico";

    useEffect(() => {
        if (modo === "create") {
            setMecanico({
                nombre: "",
                apellido: "",
                tipoTareaIds: [],
            });
            setLoading(false);
        } else if (idMecanico && isOpen) {
            fetch(`${API_BASE_URL}mecanico/DTO/${idMecanico}`)
                .then(res => res.json())
                .then(data => {
                    setMecanico({
                        ...data,
                        tipoTareaIds: data.tipoTareaIds || [],
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error al obtener el mecánico:", error);
                    setLoading(false);
                });
        }
    }, [idMecanico, isOpen, modo]);

    useEffect(() => {
        fetch(`${API_BASE_URL}tipotarea`)
            .then(res => res.json())
            .then(data => setTipoTareas(data))
            .catch(err => console.error("Error al obtener tipo de tareas:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMecanico(prev => ({ ...prev, [name]: value }));
    };

    const handleAgregarTarea = (id) => {
        if (!mecanico.tipoTareaIds.includes(id)) {
            setMecanico(prev => ({
                ...prev,
                tipoTareaIds: [...prev.tipoTareaIds, id]
            }));
        }
    };

    const handleEliminarTarea = (id) => {
        setMecanico(prev => ({
            ...prev,
            tipoTareaIds: prev.tipoTareaIds.filter(tid => tid !== id)
        }));
    };

    const crearMecanico = () => {
        fetch(`${API_BASE_URL}mecanico`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mecanico),
        })
            .then(res => {
                if (res.ok) {
                    toast.success("Mecanico creado");
                    setMecanicoModificado(true);
                    onClose();
                } else {
                    toast.error("Error al crear el mecanico");
                }
            })
            .catch(err => {
                console.error("Error en el servidor:", err);
                toast.error("Error de red");
            });
    };

    const modificarMecanico = () => {
        fetch(`${API_BASE_URL}mecanico/${idMecanico}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mecanico),
        })
            .then(res => {
                if (res.ok) {
                    toast.success("Mecanico actualizado");
                    setMecanicoModificado(true);
                    onClose();
                } else {
                    toast.error("Error al modificar el mecanico");
                }
            })
            .catch(err => {
                console.error("Error en el servidor:", err);
                toast.error("Error de red");
            });
    };

    const eliminarMecanico = () => {
        if (!window.confirm("¿Estás seguro de eliminar este mecanico?")) return;

        fetch(`${API_BASE_URL}mecanico/${idMecanico}`, {
            method: "DELETE",
        })
            .then(res => {
                if (res.ok) {
                    toast.success("Mecanico eliminado");
                    setMecanicoModificado(true);
                    onClose();
                } else {
                    toast.error("No se pudo eliminar el mecanico");
                }
            })
            .catch(err => {
                console.error("Error en el servidor:", err);
                toast.error("Error de red");
            });
    };

    if (!isOpen) return null;
    if (loading) return <div className="p-4">Cargando Mecanico...</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <Toaster position="top-right" />
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">{tituloModal}</h2>

                <label className="block mb-4">
                    Nombre:
                    <input
                        name="nombreMecanico"
                        value={mecanico?.nombreMecanico || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>

                <label className="block mb-4">
                    Apellido:
                    <input
                        name="apellidoMecanico"
                        value={mecanico?.apellidoMecanico || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>

                <label className="block mb-4">
                    Email:
                    <input
                        name="emailMecanico"
                        value={mecanico?.emailMecanico || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>

                <label className="block mb-4">
                    Activo:
                    <select
                        name="activoMecanico"
                        value={mecanico?.activoMecanico ? "true" : "false"}
                        onChange={(e) =>
                            setMecanico((prev) => ({
                                ...prev,
                                activoMecanico: e.target.value === "true",
                            }))
                        }
                        className="w-full border px-2 py-1 mt-1 rounded"
                        disabled={modo === "view"}
                    >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                    </select>
                </label>

                <label className="block mb-4">
                    Contraseña:
                    <input
                        name="passwordMecanico"
                        value={mecanico?.passwordMecanico || ""}
                        onChange={handleChange}
                        type="password"
                        className="w-full border px-2 py-1 mt-1 rounded"
                        required
                        disabled={modo === "view"}
                    />
                </label>

                <div className="mb-4">
                    <label className="block font-semibold">Tipo de Tareas asignados:</label>
                    <ul className="list-disc pl-5">
                        {mecanico?.tipoTareaIds?.map((id) => {
                            const tarea = tipoTareas.find(t => t.idTipoTarea === id);
                            return (
                                <li key={id} className="flex justify-between items-center">
                                    {tarea?.nombreTipoTarea}
                                    {modo !== "view" && (
                                        <button
                                            onClick={() => handleEliminarTarea(id)}
                                            className="text-red-500 hover:text-red-700 ml-2 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {modo !== "view" && (
                    <div className="mb-4">
                        <label className="block">Agregar tipo de tarea:</label>
                        <select
                            className="w-full border mt-1 px-2 py-1 rounded"
                            value={tareaSeleccionada}
                            onChange={e => {
                                const id = Number(e.target.value);
                                handleAgregarTarea(id);
                                setTareaSeleccionada(""); // Resetear selección
                            }}
                        >
                            <option value="" disabled>Seleccionar tipo de tarea</option>
                            {tipoTareas
                                .filter(t => !mecanico.tipoTareaIds.includes(t.idTipoTarea))
                                .map(t => (
                                    <option key={t.idTipoTarea} value={t.idTipoTarea}>
                                        {t.nombreTipoTarea}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}

                <div className="flex justify-between items-center mt-6">
                    {modo === "edit" && (
                        <button
                            onClick={eliminarMecanico}
                            className="p-2 rounded-full bg-red-400 hover:bg-red-600 text-white transition"
                            title="Eliminar Mecanico"
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
                                onClick={modo === "edit" ? modificarMecanico : crearMecanico}
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