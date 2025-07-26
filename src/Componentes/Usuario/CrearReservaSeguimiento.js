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
    const [kilometraje, setKilometraje] = useState("");
    const [loading, setLoading] = useState(false);
    const [tareasDisponibles, setTareasDisponibles] = useState([]);
    const [tareaSeleccionada, setTareaSeleccionada] = useState("");
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [mostrarCalendario, setMostrarCalendario] = useState(false);
    const [mostrarHorarios, setMostrarHorarios] = useState(false);
    const [horarios, setHorarios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const navigate = useNavigate();
    const [DisponibilidadButtonVisible, setDisponibilidadButtonVisible] = useState(false);
    const [formValido, setFormValido] = useState(false);
    const [kilometrajeGrabado, setKilometrajeGrabado] = useState("");
    const [editandoTel, setEditandoTel] = useState(false);
    const [telefono, setTelefono] = useState("");
    const [telefonoEditado, setTelefonoEditado] = useState("");

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
        if (Array.isArray(nuevaReserva.tareas) && nuevaReserva.tareas.length > 0) {
            setDisponibilidadButtonVisible(true);
        } else {
            setDisponibilidadButtonVisible(false);
        }
    }, [nuevaReserva.tareas]);

    useEffect(() => {
        if (nuevaReserva.horaInicio && nuevaReserva.fechaSeleccionada) {
            setFormValido(true);
        } else {
            setFormValido(false);
        }
    }, [nuevaReserva.horaInicio, nuevaReserva.fechaSeleccionada]);

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
                setKilometrajeGrabado(data.kilometrajeVehiculo);
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
            limiteDias: "35"
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
        if (!telefono || kilometraje <= kilometrajeGrabado) {
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

    const maskPhone = (tel) => {
        return tel.replace(/^(\+\d{5})\d+(\d{3})$/, "$1***$2");
    };



    return (
        <>
            <MenuNavBar />
            <Toaster position="top-right" />

            {/* — Contenedor — */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Encabezado */}
                <header className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-blue-800 text-center w-full sm:w-auto">
                        Crear nueva reserva
                    </h2>
                    <button
                        onClick={() => navigate("/seguimiento")}
                        className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                    >
                        ← Volver
                    </button>
                </header>

                {/* — Formulario — */}
                <div className="animate-fade-in bg-white/70 backdrop-blur rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 space-y-6">
                    {/* Teléfono */}
                    {cliente && (
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                ¿Este sigue siendo tu Nro. de teléfono?
                            </label>

                            {!editandoTel ? (
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-2 rounded-md border border-gray-300 bg-gray-50 flex-1">
                                        {maskPhone(telefono)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditandoTel(true);
                                            setTelefonoEditado(""); // ← vaciar el input al editar
                                        }}
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Editar
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="tel"
                                    placeholder="Ingresá un nuevo teléfono"
                                    value={telefonoEditado}
                                    onChange={(e) => setTelefonoEditado(e.target.value)}
                                    className="animate-fade-in w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    onBlur={() => {
                                        if (telefonoEditado.trim()) {
                                            setTelefono(telefonoEditado);
                                        }
                                        setEditandoTel(false);
                                    }}
                                />
                            )}
                        </div>
                    )}


                    {/* Kilometraje */}
                    {vehiculo && (
                        <div className="space-y-1">
                            <p className="text-xs text-purple-700">
                                Último registro: <span className="font-semibold">{kilometrajeGrabado}</span> km
                            </p>
                            <label className="block text-sm font-medium text-gray-700">
                                Kilometraje actual
                            </label>
                            <input
                                type="number"
                                value={kilometraje}
                                onChange={(e) => setKilometraje(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    {/* Tareas */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Seleccionar tareas
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={tareaSeleccionada}
                                onChange={(e) => setTareaSeleccionada(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Motivos de cita</option>
                                {tareasDisponibles.map((t) => (
                                    <option key={t.idTipoTarea} value={t.nombreTipoTarea}>
                                        {t.nombreTipoTarea}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={agregarTarea}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Agregar
                            </button>
                        </div>

                        {/* Chips tareas seleccionadas */}
                        <ul className="flex flex-wrap gap-2">
                            {nuevaReserva.tareas.map((t) => (
                                <li
                                    key={t.idTipoTarea}
                                    className="flex items-center gap-2 bg-gray-100 text-sm border rounded-full px-3 py-1"
                                >
                                    {t.nombreTipoTarea}
                                    <button
                                        onClick={() => quitarTarea(t.idTipoTarea)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* — Comentarios + Disponibilidad — */}
                    {DisponibilidadButtonVisible && (
                        <>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Comentarios o consultas adicionales
                                </label>
                                <textarea
                                    value={nuevaReserva.comentario || ""}
                                    onChange={handleComentarioChange}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <button
                                onClick={consultarDisponibilidad}
                                className="w-full py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition"
                            >
                                Ver disponibilidad
                            </button>
                        </>
                    )}

                    {/* — Resumen fecha/horario — */}
                    {nuevaReserva.fechaSeleccionada && nuevaReserva.horaInicio && (
                        <div className="text-center text-green-700 space-y-1">
                            <p>
                                <strong>Fecha:</strong> {nuevaReserva.fechaSeleccionada}
                            </p>
                            <p>
                                <strong>Horario:</strong>{" "}
                                {nuevaReserva.horaInicio.slice(0, 5)} – {nuevaReserva.horaFin.slice(0, 5)}
                            </p>
                        </div>
                    )}

                    {/* — Confirmar — */}
                    {formValido && (
                        <button
                            onClick={handleConfirmarReserva}
                            className="w-full py-3 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition"
                        >
                            Confirmar reserva
                        </button>
                    )}
                </div>
            </section>

            {/* — Modales — */}
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
        </>

    );
}
