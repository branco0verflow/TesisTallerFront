import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/20/solid";
import ModalCalendario from "./ModalCalendario";
import ModalHorarios from "./ModalHorarios";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { API_BASE_URL } from "../../config/apiConfig";
import Loading2 from "../Loading2";


export default function PasoDatosAgenda({ formData, setFormData, onNext }) {
    const [tareasDisponibles, setTareasDisponibles] = useState([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState("");
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [mostrarHorarios, setMostrarHorarios] = useState(false);
    const [horarios, setHorarios] = useState([]);
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [formValido, setFormValido] = useState(false);
    const [DisponibilidadButtonVisible, setDisponibilidadButtonVisible] = useState(false);
    const [cargando, setCargando] = useState(false);


    const fecha = new Date(`${formData.fechaSeleccionada}T12:00:00`);

    const opciones = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Montevideo'
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);


    const tareasSeleccionadas = Array.isArray(formData?.tareas)
        ? formData.tareas
        : [];

    useEffect(() => {
        fetch(`${API_BASE_URL}tipotarea`)
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

    const corroborarFuncionamiento = () => {
        console.log(formData);
    }

    useEffect(() => {
        if (Array.isArray(formData.tareas) && formData.tareas.length > 0) {
            setDisponibilidadButtonVisible(true);
        } else {
            setDisponibilidadButtonVisible(false);
        }
    }, [formData.tareas]);


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
        setCargando(true);
        const ids = formData.tareas.map(t => t.idTipoTarea);
        const queryParams = new URLSearchParams({
            ids: ids.join(","),
            limiteDias: "35"
        });

        fetch(`${API_BASE_URL}disponibilidad?${queryParams}`)
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text(); // porque no es JSON
                    throw new Error(text); // lo captura el catch
                }
                return res.json();
            })
            .then(data => {
                setDiasDisponibles(data);
                setCargando(false);
                setMostrarCalendario(true);
            })
            .catch(err => {
                setCargando(false);
                console.error("Error al consultar disponibilidad:", err.message);
                alert("Ocurrió un error al consultar disponibilidad:\n" + err.message);
            });

    };

    const handleSeleccionDia = (fecha) => {
        if (!fecha) return; // para prevenir un estado nulo da problemas resolver BB

        setMostrarCalendario(false);
        setCargando(true);

        setFormData(prev => ({
            ...prev,
            fechaSeleccionada: fecha.toISOString().split("T")[0] // Año mes y día es necesario ese orden en todo momento BB
        }));

        const ids = formData.tareas.map(t => t.idTipoTarea);
        const queryParams = new URLSearchParams({
            ids: ids.join(","),
            fecha: fecha.toISOString().split("T")[0]
        });

        fetch(`${API_BASE_URL}disponibilidad/horas?${queryParams}`)
            .then(res => res.json())
            .then(data => {
                setHorarios(data);
                setCargando(false);
                setMostrarHorarios(true);
            })
            .catch(err => console.error("Error al consultar horarios:", err));
    };

    const handleSeleccionHorario = (horario) => {
        setMostrarHorarios(false);

        setFormData(prev => {
            const nuevoFormData = {
                ...prev,
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
                IdMecanico: horario.idMecanico
            };
            console.log("Horario seleccionado y formData actualizado:", nuevoFormData);
            return nuevoFormData;
        });
    };


    useEffect(() => {
        if (formData.horaInicio && formData.fechaSeleccionada) {
            setFormValido(true);
        } else {
            setFormValido(false);
        }
    }, [formData.horaInicio, formData.fechaSeleccionada]);

    return (
        <div className="animate-fade-in max-w-2xl mx-auto px-4 py-6 space-y-6">
            {(cargando && 
                <Loading2 />
            )}
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
                        <option value="">Motivos de cita</option>
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



            {/* Botón Ver Disponibilidad */}
            {DisponibilidadButtonVisible && (
                <div className="animate-fade-in text-center">


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


                    <button
                        onClick={consultarDisponibilidad}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <CalendarIcon className="w-5 h-5" />
                            Ver disponibilidad
                        </span>
                    </button>


                    {mostrarCalendario && (
                        <ModalCalendario
                            diasDisponibles={diasDisponibles}
                            onClose={() => setMostrarCalendario(false)}
                            onDiaSeleccionado={handleSeleccionDia}
                        />
                    )}

                    {mostrarHorarios && (
                        <ModalHorarios
                            horarios={horarios}
                            onClose={() => setMostrarHorarios(false)}
                            onSeleccionHorario={handleSeleccionHorario}
                        />
                    )}
                </div>


            )}

            {formData.fechaSeleccionada && (
                <div className="animate-fade-in mt-4 w-full max-w-2xl mx-auto bg-green-100 border border-green-300 text-green-900 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-2">
                    <strong className="text-green-800">Cita para el:</strong>
                    <span>
                        {fechaCapitalizada}, ingresa a las {formData.horaInicio.slice(0, 5)}.
                    </span>
                </div>
            )}


            <div className="flex justify-end">
                <button
                    disabled={!formValido}
                    onClick={() => {
                        if (formValido) {
                            onNext();
                            console.log(formData);
                            console.log(formData.horaInicio + formData.horaFin);
                        } else {
                            toast.error("Por favor corregí los errores antes de continuar");
                        }
                    }}
                    className={`mt-4 px-4 py-2 rounded text-white font-semibold transition ${formValido
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    Siguiente
                </button>
            </div>

        </div>
    );
}
