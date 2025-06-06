import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";

export default function PasoDatosAgenda({ formData, setFormData }) {
    const [tareasDisponibles, setTareasDisponibles] = useState([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState("");

    const tareasSeleccionadas = Array.isArray(formData?.tareas)
        ? formData.tareas
        : [];

    useEffect(() => {
        fetch("http://localhost:8081/sgc/api/v1/tipotarea")
            .then(res => res.json())
            .then(data => setTareasDisponibles(data))
            .catch(err => console.error("Error al cargar tareas:", err));
    }, []);

    const agregarTarea = () => {
        if (!Array.isArray(formData?.tareas)) {
            setFormData(prev => ({ ...prev, tareas: [] }));
            return;
        }

        const tareaObj = tareasDisponibles.find(
            t => t.nombreTipoTarea === tareaSeleccionada
        );
        if (!tareaObj) return;

        const yaAgregada = formData.tareas.some(
            t => t.idTipoTarea === tareaObj.idTipoTarea
        );
        if (yaAgregada) return;

        const nuevasTareas = [
            ...formData.tareas,
            {
                idTipoTarea: tareaObj.idTipoTarea,
                nombreTipoTarea: tareaObj.nombreTipoTarea
            }
        ];

        setFormData(prev => ({ ...prev, tareas: nuevasTareas }));
        setTareaSeleccionada("");
    };

    const quitarTarea = (id) => {
        const nuevasTareas = formData.tareas.filter(
            t => t.idTipoTarea !== id
        );
        setFormData(prev => ({ ...prev, tareas: nuevasTareas }));
    };

    const handleComentarioChange = (e) => {
        setFormData(prev => ({ ...prev, comentario: e.target.value }));
    };

    const consultarDisponibilidad = () => {
        fetch("http://localhost:8081/sgc/api/v1/disponibilidad")
            .then(res => res.json())
            .then(data => {
                console.log("Fechas disponibles:", data);
                // Aquí puedes mostrar el calendario si deseas
            })
            .catch(err => console.error("Error al consultar disponibilidad:", err));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {/* Sección Tareas */}
            <div>
                <label htmlFor="tarea" className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de la cita (seleccione al menos una tarea)
                </label>

                <div className="flex gap-2">
                    <select
                        id="tarea"
                        value={tareaSeleccionada}
                        onChange={(e) => setTareaSeleccionada(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">-- Selecciona una tarea --</option>
                        {tareasDisponibles.map((tarea) => (
                            <option
                                key={tarea.idTipoTarea}
                                value={tarea.nombreTipoTarea}
                            >
                                {tarea.nombreTipoTarea}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={agregarTarea}
                        disabled={!tareaSeleccionada}
                        className={`px-4 py-2 rounded-md text-white ${!tareaSeleccionada
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        Agregar
                    </button>
                </div>

                <ul className="flex flex-wrap gap-2 mt-4">
                    {tareasSeleccionadas.map((tarea) => (
                        <li
                            key={tarea.idTipoTarea}
                            className="flex items-center bg-gray-100 border rounded-full px-3 py-1"
                        >
                            {tarea.nombreTipoTarea}
                            <button
                                type="button"
                                onClick={() => quitarTarea(tarea.idTipoTarea)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                <XCircleIcon className="h-5 w-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Comentarios */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentarios o consultas adicionales
                </label>
                <textarea
                    value={formData.comentario || ""}
                    onChange={handleComentarioChange}
                    rows={4}
                    placeholder="Escriba aquí cualquier observación sobre la reserva..."
                    className="w-full border border-gray-300 rounded-md p-3"
                />
            </div>

            {/* Botón Ver Disponibilidad */}
            <div className="text-center">
                <button
                    onClick={consultarDisponibilidad}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
                >
                    Ver disponibilidad
                </button>
            </div>
        </div>
    );
}
