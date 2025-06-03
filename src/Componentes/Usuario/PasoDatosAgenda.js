import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";

export default function MotivoCita({ formData, setFormData, errores, setErrores }) {
    const [tareasDisponibles, setTareasDisponibles] = useState([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState("");

    useEffect(() => {
        fetch("http://localhost:8081/sgc/api/v1/tareas")
            .then(res => res.json())
            .then(data => setTareasDisponibles(data))
            .catch(err => console.error("Error al cargar tareas:", err));
    }, []);

    const agregarTarea = () => {
        const tareaObj = tareasDisponibles.find(t => t.nombre === tareaSeleccionada);
        if (!tareaObj || formData.tareas.find(t => t.id === tareaObj.id)) return;

        const nuevasTareas = [...formData.tareas, tareaObj];
        setFormData({ ...formData, tareas: nuevasTareas });
        setErrores({ ...errores, tareas: "" });
    };

    const quitarTarea = (id) => {
        const nuevasTareas = formData.tareas.filter(t => t.id !== id);
        setFormData({ ...formData, tareas: nuevasTareas });

        if (nuevasTareas.length === 0) {
            setErrores({ ...errores, tareas: "Debe seleccionar al menos una tarea" });
        }
    };

    const validar = () => {
        if (!formData.tareas || formData.tareas.length === 0) {
            setErrores({ ...errores, tareas: "Debe seleccionar al menos una tarea" });
            return false;
        }
        return true;
    };

    return (
        <div className="space-y-4">
            <label htmlFor="tarea" className="block text-sm font-medium text-gray-700">
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
                        <option key={tarea.id} value={tarea.nombre}>
                            {tarea.nombre}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={agregarTarea}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Agregar
                </button>
            </div>

            {errores.tareas && (
                <p className="text-red-500 text-sm">{errores.tareas}</p>
            )}

            <ul className="flex flex-wrap gap-2 mt-2">
                {formData.tareas.map((tarea) => (
                    <li
                        key={tarea.id}
                        className="flex items-center bg-gray-100 border rounded-full px-3 py-1"
                    >
                        {tarea.nombre}
                        <button
                            type="button"
                            onClick={() => quitarTarea(tarea.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                            <XCircleIcon className="h-5 w-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
