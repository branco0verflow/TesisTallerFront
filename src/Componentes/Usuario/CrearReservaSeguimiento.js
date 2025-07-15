import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalCalendario from "./ModalCalendario";
import ModalHorarios from "./ModalHorarios";
import { CalendarIcon } from "@heroicons/react/24/solid";
import MenuNavBar from "./MenuNavBar";
import { useSeguimiento } from "../SeguimientoContext";
import toast, { Toaster } from "react-hot-toast";

export default function CrearReservaSeguimiento({ onReservaCreada }) {

    const { seguimientoData } = useSeguimiento();
    const { cedula, email, idVehiculo, idCliente } = seguimientoData;

    const [cliente, setCliente] = useState(null);
    const [vehiculo, setVehiculo] = useState(null);
    const [telefono, setTelefono] = useState("");
    const [kilometraje, setKilometraje] = useState("");
    const [loading, setLoading] = useState(false);
    const [tareasDisponibles, setTareasDisponibles] = useState([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState("");
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [mostrarHorarios, setMostrarHorarios] = useState(false);
    const [horarios, setHorarios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [tieneReservaFutura, setTieneReservaFutura] = useState(false);
    const navigate = useNavigate();

    const [nuevaReserva, setNuevaReserva] = useState({
        fechaSeleccionada: "",
        kilometrajeActualizado: "",
        horaInicio: "",
        horaFin: "",
        comentario: "",
        tareas: [],
        IdMecanico: "",
    });

    useEffect(() => {
        fetch("http://localhost:8081/sgc/api/v1/tipotarea")
            .then(res => res.json())
            .then(data => setTareasDisponibles(data))
            .catch(err => console.error("Error al cargar tareas:", err));
    }, []);

    useEffect(() => {
        if (!idCliente) return;
        fetch(`http://localhost:8081/sgc/api/v1/cliente/${idCliente}`)
            .then(res => {
                if (!res.ok) throw new Error("No se encontró el cliente");
                return res.json();
            })
            .then(data => {
                setCliente(data);
                setTelefono(data.telefonoCliente);
            })
            .catch(() => toast.error("Error al buscar cliente"));
    }, [idCliente]);

    useEffect(() => {
        if (!idVehiculo) return;

        fetch(`http://localhost:8081/sgc/api/v1/vehiculo/${idVehiculo}`)
            .then(res => {
                if (!res.ok) throw new Error("No se encontró el vehículo");
                return res.json();
            })
            .then(data => {
                setVehiculo(data);
                setKilometraje(data.kilometrajeVehiculo);
            })
            .catch(() => toast.error("Error al buscar vehículo"));
    }, [idVehiculo]);







    const agregarTarea = () => {
        const tareaObj = tareasDisponibles.find(t => t.nombreTipoTarea === tareaSeleccionada);
        if (!tareaObj || nuevaReserva.tareas.some(t => t.idTipoTarea === tareaObj.idTipoTarea)) return;

        setNuevaReserva(prev => ({
            ...prev,
            tareas: [...prev.tareas, {
                idTipoTarea: tareaObj.idTipoTarea,
                nombreTipoTarea: tareaObj.nombreTipoTarea
            }]
        }));
        setTareaSeleccionada("");
    };

    const quitarTarea = (id) => {
        const nuevasTareas = nuevaReserva.tareas.filter(t => t.idTipoTarea !== id);
        setNuevaReserva(prev => ({ ...prev, tareas: nuevasTareas }));
    };

    const handleComentarioChange = (e) => {
        setNuevaReserva(prev => ({ ...prev, comentario: e.target.value }));
    };

    const consultarDisponibilidad = () => {
        const ids = nuevaReserva.tareas.map(t => t.idTipoTarea);
        const queryParams = new URLSearchParams({
            ids: ids.join(","),
            limiteDias: "20"
        });

        fetch(`http://localhost:8081/sgc/api/v1/disponibilidad?${queryParams}`)
            .then(res => res.json())
            .then(data => {
                setDiasDisponibles(data);
                setMostrarCalendario(true);
            })
            .catch(err => console.error("Error al consultar disponibilidad:", err));
    };

    const handleSeleccionDia = (fecha) => {
        if (!fecha) return;

        setMostrarCalendario(false);

        const fechaISO = fecha.toISOString().split("T")[0];
        setNuevaReserva(prev => ({ ...prev, fechaSeleccionada: fechaISO }));

        const ids = nuevaReserva.tareas.map(t => t.idTipoTarea);
        const queryParams = new URLSearchParams({
            ids: ids.join(","),
            fecha: fechaISO
        });

        fetch(`http://localhost:8081/sgc/api/v1/disponibilidad/horas?${queryParams}`)
            .then(res => res.json())
            .then(data => {
                setHorarios(data);
                setMostrarHorarios(true);
            })
            .catch(err => console.error("Error al consultar horarios:", err));
    };

    const handleSeleccionHorario = (horario) => {
        setMostrarHorarios(false);
        setNuevaReserva(prev => ({
            ...prev,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            IdMecanico: horario.idMecanico
        }));
    };

    const handleConfirmarReserva = () => {
        if (!telefono || !kilometraje) {
            toast.error("Debe ingresar el teléfono y el kilometraje actualizado");
            return;
        }

        setLoading(true);

        const payload = {
            fechaCitaReserva: nuevaReserva.fechaSeleccionada,
            horaInicioReserva: nuevaReserva.horaInicio,
            horaFinReserva: nuevaReserva.horaFin,
            comentariosReserva: nuevaReserva.comentario || "",
            idCliente: idCliente,
            idVehiculo: idVehiculo,
            idsTipoTarea: nuevaReserva.tareas.map(t => t.idTipoTarea),
            idEstado: 1,
            idMecanico: nuevaReserva.IdMecanico,
        };

        const actualizarCliente = fetch(`http://localhost:8081/sgc/api/v1/cliente/nuevoPhone/${idCliente}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefonoCliente: telefono })
        });

        const actualizarVehiculo = fetch(`http://localhost:8081/sgc/api/v1/vehiculo/nuevoKilometraje/${idVehiculo}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kilometrajeVehiculo: Number(kilometraje) })
        });

        Promise.all([actualizarCliente, actualizarVehiculo])
            .then(() => {
                return fetch("http://localhost:8081/sgc/api/v1/reserva/nuevaReservaSeguimiento", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            })
            .then(async res => {
                if (!res.ok) {
                    const mensaje = await res.text();
                    throw new Error(`Error al crear la reserva: ${mensaje}`);
                }
                return res.json();
            })
            .then(data => {
                onReservaCreada?.(data);
                toast.success("Reserva creada exitosamente");
                setTimeout(() => navigate("/seguimiento"), 2000);
                
            })
            .catch(err => {
                console.error(err);
                toast.error(err.message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <MenuNavBar />
            
                <Toaster position="top-right" />
                <div className="max-w-xl mx-auto space-y-6 p-4">
                    <h2 className="text-xl font-semibold text-center">Crear nueva reserva</h2>

                    <button
                        onClick={() => navigate("/seguimiento")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        ← Volver
                    </button>


                    {cliente && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono de contacto</label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    )}

                    {vehiculo && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kilometraje actual</label>
                            <input
                                type="number"
                                value={kilometraje}
                                onChange={(e) => setKilometraje(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Seleccionar tareas</label>
                        <div className="flex gap-2">
                            <select
                                value={tareaSeleccionada}
                                onChange={(e) => setTareaSeleccionada(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Motivos de cita</option>
                                {tareasDisponibles.map(tarea => (
                                    <option key={tarea.idTipoTarea} value={tarea.nombreTipoTarea}>{tarea.nombreTipoTarea}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={agregarTarea}
                                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Agregar
                            </button>
                        </div>
                        <ul className="flex flex-wrap gap-2 mt-4">
                            {nuevaReserva.tareas.map(t => (
                                <li key={t.idTipoTarea} className="bg-gray-100 border rounded-full px-3 py-1 flex items-center">
                                    {t.nombreTipoTarea}
                                    <button onClick={() => quitarTarea(t.idTipoTarea)} className="ml-2 text-red-500 hover:text-red-700">X</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comentarios</label>
                        <textarea
                            value={nuevaReserva.comentario || ""}
                            onChange={handleComentarioChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <button
                        onClick={consultarDisponibilidad}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    >
                        Ver disponibilidad
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

                    <button
                        onClick={handleConfirmarReserva}
                        disabled={loading || !telefono || !kilometraje || tieneReservaFutura}
                        className={`w-full py-2 px-4 rounded text-white font-semibold ${loading || tieneReservaFutura ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {tieneReservaFutura ? "Ya hay una reserva activa" : loading ? "Confirmando..." : "Confirmar Reserva"}
                    </button>

                    {nuevaReserva.fechaSeleccionada && nuevaReserva.horaInicio && (
                        <div className="mt-4 text-center text-green-700">
                            <p><strong>Fecha:</strong> {nuevaReserva.fechaSeleccionada}</p>
                            <p><strong>Horario:</strong> {nuevaReserva.horaInicio} a {nuevaReserva.horaFin}</p>
                        </div>
                    )}
                </div>
            
        </>
    );
}
