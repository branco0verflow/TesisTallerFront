import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/24/outline";
import ReservaDetalle from "./ReservaDetalle";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../config/apiConfig";

const GRID_START = 8;
const GRID_END = 17;
const HOUR_HEIGHT = 64;
const hours = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i);

function timeToDecimal(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
}

function tareaBg(t) {
    return t.esReservaTarea ? "bg-indigo-600" : "bg-blue-600";
}

export default function VisionMecanicoCompleta() {
    const [searchParams] = useSearchParams();
    const idMecanico = parseInt(searchParams.get("id"));
    const fechaStr = searchParams.get("fecha");
    const [tareas, setTareas] = useState([]);
    const [mecanico, setMecanico] = useState(null);
    const [fechaCapitalizada, setFechaCapitalizada] = useState("");
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [modalTareaVisible, setModalTareaVisible] = useState(false);
    const [mostrarDetalleReserva, setMostrarDetalleReserva] = useState(false);
    const navigate = useNavigate();
    const fecha = searchParams.get("fecha");

    const { reserva, loading, error } = ReservaDetalle(
        tareaSeleccionada?.idReserva,
        mostrarDetalleReserva
    );

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}tarea/fecha/${fechaStr}`);
                const data = await res.json();
                setTareas(data);
            } catch (e) {
                console.error(e);
            }
        };

        const fetchMecanico = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}mecanico/${idMecanico}`);
                const data = await res.json();
                setMecanico(data);
            } catch (e) {
                console.error(e);
            }
        };

        const fechaMuestra = new Date(`${fechaStr}T12:00:00`);
        const opcionesFecha = {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
            timeZone: "America/Montevideo",
        };
        const str = fechaMuestra.toLocaleDateString("es-ES", opcionesFecha);
        setFechaCapitalizada(str.charAt(0).toUpperCase() + str.slice(1));

        fetchTareas();
        fetchMecanico();
    }, [idMecanico, fechaStr]);

    const tareasMec = tareas.filter(t => t.idMecanico === idMecanico);

    return (
        <div className="p-4 max-w-full">
            {/* Botón flotante de volver */}
            <button
                onClick={() => navigate(`/AVisordeTarea?fecha=${fecha}`)}
                className="fixed top-4 left-4 z-50 bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 border border-gray-300 transition"
            >
                ← Volver al panel
            </button>

            <h2 className="text-center text-xl font-bold text-gray-700 mb-4">{fechaCapitalizada}</h2>
            <div className="grid border border-gray-300 rounded shadow bg-white grid-cols-[44px_1fr] sm:grid-cols-[80px_1fr] grid-rows-[40px_1fr]">
                <div className="row-start-1 col-start-1" />
                <div className="row-start-1 col-start-2 flex items-center justify-center bg-gray-100 border-l border-b text-gray-700 font-semibold px-2">
                    {mecanico?.nombreMecanico || "Mecánico"}
                </div>
                <div className="row-start-2 col-start-1 flex flex-col border-r bg-gray-50/40">
                    {hours.map(h => (
                        <div key={h} className="h-16 border-b text-right pr-2 pt-[2px] text-gray-500 text-sm">{h}:00</div>
                    ))}
                </div>
                <div className="row-start-2 col-start-2 relative border-l">
                    <div className="relative" style={{ height: `${hours.length * HOUR_HEIGHT}px` }}>
                        {tareasMec.map(t => {
                            const top = (timeToDecimal(t.horaIngresoTarea) - GRID_START) * HOUR_HEIGHT;
                            const height = (timeToDecimal(t.horaFinTarea) - timeToDecimal(t.horaIngresoTarea)) * HOUR_HEIGHT;
                            return (
                                <div
                                    key={t.idTarea}
                                    onClick={() => { setTareaSeleccionada(t); setModalTareaVisible(true); }}
                                    className={`absolute left-1 right-1 rounded px-2 py-1 shadow-md border border-gray-700 text-white text-xs cursor-pointer ${tareaBg(t)}`}
                                    style={{ top, height }}
                                >
                                    <div className="font-semibold truncate">{t.descripcionTarea || "Tarea"}</div>
                                    <div className="text-[10px] leading-tight mt-1">
                                        Estado: {t.nombreEstado}<br />
                                        Admin: {t.nombreAdmin}
                                        {t.esReservaTarea && <EyeIcon className="w-3 h-3 inline ml-1" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal tarea */}
            {modalTareaVisible && tareaSeleccionada && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                        <header className="flex justify-between mb-4">
                            <h2 className="font-bold text-cyan-900">
                                {tareaSeleccionada.horaIngresoTarea} – {tareaSeleccionada.horaFinTarea}
                            </h2>
                            <button
                                onClick={() => { setModalTareaVisible(false); setMostrarDetalleReserva(false); }}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Cerrar
                            </button>
                        </header>
                        <p>{tareaSeleccionada.descripcionTarea || "No especificada"}</p>
                        <p className="text-right text-sm text-gray-900 mt-2">{tareaSeleccionada.nombreEstado}</p>

                        {tareaSeleccionada.esReservaTarea && !mostrarDetalleReserva && (
                            <button
                                onClick={() => setMostrarDetalleReserva(true)}
                                className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-4"
                            >
                                <EyeIcon className="w-4 h-4" />
                                Ver detalles de la reserva
                            </button>
                        )}

                        {mostrarDetalleReserva && (
                            <div className="mt-4 bg-gray-100 p-4 rounded text-sm space-y-2">
                                {loading && <p>Cargando detalles…</p>}
                                {error && <p className="text-red-500">{error}</p>}
                                {reserva && (
                                    <>
                                        <h3 className="font-bold">{reserva.cliente.nombreCliente} {reserva.cliente.apellidoCliente}</h3>
                                        <p>{reserva.vehiculo.modelo.marca.nombreMarca} {reserva.vehiculo.modelo.nombreModelo}</p>
                                        <p>Matrícula: {reserva.vehiculo.matriculaVehiculo}</p>
                                        {/* ...otros datos... */}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
