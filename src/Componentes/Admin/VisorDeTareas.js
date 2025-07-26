import { useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ReservaDetalle from "./ReservaDetalle";
import { EyeIcon, PlusIcon, CalendarIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { BellIcon } from "@heroicons/react/24/outline";
import ModalCrearTarea from "./ModalCrearTarea";
import toast from "react-hot-toast";
import { Toaster } from 'react-hot-toast';
import ModalModificarTarea from "./ModalModificarTarea";
import BotonLogout from "./BotonLogout";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";


export default function CalendarioTareas() {
  const [searchParams] = useSearchParams();
const fechaParam = searchParams.get("fecha");
const [fechaSeleccionada, setFechaSeleccionada] = useState(() =>
  fechaParam ? new Date(fechaParam) : new Date()
);
  const [tareas, setTareas] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [idReservaSeleccionada, setIdReservaSeleccionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState(null);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [modalTareaVisible, setModalTareaVisible] = useState(false);
  const [calendarioVisible, setCalendarioVisible] = useState(false);
  const [modalModificar, setModalModificar] = useState(false);
  const [tareaModificada, setTareaModificada] = useState(false);
  const [estados, setEstados] = useState([]);
  const [mostrarDetalleReserva, setMostrarDetalleReserva] = useState(false);
  const { reserva, loading, error } = ReservaDetalle(tareaSeleccionada?.idReserva, mostrarDetalleReserva);
  const navigate = useNavigate();
  const [minutos, setMinutos] = useState('');
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
  if (fechaParam) {
    window.history.replaceState({}, "", "/AVisordeTarea");
  }
}, []);


  const consultarProximaDisponibilidad = () => {
    if (!minutos || isNaN(minutos)) return;

    fetch(`${API_BASE_URL}disponibilidad/proxima-disponibilidad?minutosRequeridos=${minutos}&limiteDias=20`)
      .then(res => res.json())
      .then(data => {
        setDisponibilidad(data);
        setMostrarModal(true);
      })
      .catch(err => {
        console.error("Error al consultar próxima disponibilidad:", err);
        alert("Error al consultar disponibilidad.");
      });
  };

  const toggleCalendario = () => {
    setCalendarioVisible(prev => !prev);
  };



  const handleVerTarea = (tarea) => {
    setTareaSeleccionada(tarea);
    setModalTareaVisible(true);
  };

  const handleModificarTarea = (tarea) => {
    setTareaSeleccionada(tarea);
    setModalModificar(true);
  };


  useEffect(() => {
    if (tareaModificada) {
      toast.success("Modificación exitosa");
      setTimeout(() => setTareaModificada(false), 2000); // más tiempo para que se vea bien
    }
  }, [tareaModificada]);


  useEffect(() => {
    fetch(`${API_BASE_URL}mecanico`)
      .then(res => res.json())
      .then(data => setMecanicos(data))
      .catch(err => console.error("Error al cargar mecánicos:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}estado`)
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => console.error("Error al cargar estados:", err));
  }, []);

  const toAdmin = () => {
    navigate('/ListaAdmin');
  }

  useEffect(() => {
    if (fechaSeleccionada) {
      const fecha = fechaSeleccionada.toISOString().split("T")[0];
      fetch(`${API_BASE_URL}tarea/fecha/${fecha}`)
        .then(res => res.json())
        .then(data => setTareas(data))
        .catch(err => console.error("Error al cargar tareas:", err));
    }
  }, [fechaSeleccionada, tareaModificada]);

  const timeToDecimal = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 8 a 17


  const HOUR_HEIGHT = 64;          // 64 px por hora
  const GRID_START = 8;           // 08:00
  const HEADER_H = 40;          // altura de cabecera (h-10)
  const isConfirmada = (t) => t.nombreEstado?.toLowerCase() === "confirmado" || t.nombreEstado?.toLowerCase() === "terminado";
  const tareaBg = (t) =>
    isConfirmada(t) ? "bg-green-900/80 hover:bg-green-900" : "bg-cyan-900/80 hover:bg-cyan-900";

  const fetchTareasPendientes = async () => {
    const res = await fetch(`${API_BASE_URL}tarea/pendientes`);
    const data = await res.json();
    setTareasPendientes(data);
  };

  useEffect(() => {
    fetchTareasPendientes();
    const intervalo = setInterval(fetchTareasPendientes, 30000); // actualiza cada 30 seg
    return () => clearInterval(intervalo);
  }, []);


  return (
    <>
      < div className="bg-white shadow-sm h-12 rounded-md flex items-center justify-between px-4" >
        <div className="text-gray-700 font-semibold">Panel de Control</div>
        <div className="flex gap-3">


          <div className="relative inline-block">
            <button
              onClick={() => setMostrarLista(!mostrarLista)}
              className="relative p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BellIcon className="w-6 h-6" />
              {tareasPendientes.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {tareasPendientes.length}
                </span>
              )}
            </button>

            {mostrarLista && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-3 z-10">
                <h3 className="font-semibold mb-2">Tareas pendientes:</h3>
                {tareasPendientes.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay tareas pendientes</p>
                ) : (
                  <ul className="text-sm space-y-1 max-h-60 overflow-y-auto">
                    {tareasPendientes.map(t => (
                      <li key={t.idTarea} className="border-b pb-1">
                        📅 {t.fecha} 🕒 {t.hora.slice(0, 5)}
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            )}
          </div>


          <div className="flex items-center justify-end gap-2">
            <input
              value={minutos}
              onChange={e => setMinutos(e.target.value)}
              placeholder="Min"
              className="w-20 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={consultarProximaDisponibilidad}
              className="bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition-all"
            >
              Disponibilidad
            </button>
          </div>



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
      <div className="p-4">

        <Toaster position="top-right" />

        {/* Resto del contenido que ya tenés */}
        <div className="flex mb-4 items-center justify-center gap-4">

          <button
            onClick={toggleCalendario}
            className="rounded-full p-5 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-gray-400"
            title={calendarioVisible ? "Ocultar calendario" : "Mostrar calendario"}
          >
            <CalendarIcon className="h-7 w-7" />
          </button>



          {calendarioVisible && (
            <div className="animate-fade-in">
              <DayPicker
                mode="single"
                selected={fechaSeleccionada}
                onSelect={setFechaSeleccionada}
              />
            </div>
          )}



        </div>


        {mostrarModal && (
          <>
            {/* Overlay oscuro */}
            <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setMostrarModal(false)} />

            {/* Modal */}
            <div className="fixed z-50 top-1/2 left-1/2 w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Próxima disponibilidad por mecánico</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {disponibilidad.length > 0 ? (
                  disponibilidad.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-gray-50 shadow-sm">
                      <p className="text-gray-800 font-semibold">{d.nombreMecanico}</p>
                      <p className="text-gray-600"> {d.fecha}</p>
                      <p className="text-gray-600"> {d.horaInicio.slice(0, 5)} - {d.horaFin.slice(0, 5)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No hay disponibilidad.</p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </>
        )}




        <div
          className="grid border border-gray-300 rounded shadow overflow-hidden bg-white"
          style={{
            gridTemplateColumns: '80px repeat(auto-fit, minmax(200px,1fr))',
            gridTemplateRows: `${HEADER_H}px 1fr`
          }}
        >


          <div className="row-start-1 col-start-1"></div> {/* celda vacía sobre la columna de horas */}

          {mecanicos.map((m, idx) => (
            <div
              key={`head-${m.idMecanico}`}
              className="row-start-1"
              style={{ gridColumnStart: idx + 2 }}
            >
              <div className="h-full flex items-center justify-center bg-gray-100 border-l border-b text-gray-700 font-semibold px-2 gap-2">
                {m.nombreMecanico}
                <button
                  onClick={() => {
                    setMecanicoSeleccionado(m.idMecanico);
                    setModalCrearVisible(true);
                  }}
                  className="p-1 rounded-full bg-green-600 hover:bg-green-700 text-white shadow"
                  title="Nueva tarea"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>

                {/* Botón para ir a la vista completa */}
                <button
                  onClick={() => {
                    const fechaHoy = fechaSeleccionada.toISOString().split("T")[0];
                    navigate(`/vision-mecanico?id=${m.idMecanico}&fecha=${fechaHoy}`);
                  }}
                  className="p-1 rounded-full bg-violet-600 hover:bg-sky-700 text-white shadow"
                  title="Ver en pantalla completa"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}


          {/* ── Columna de horas ───────────── */}
          <div className="row-start-2 col-start-1 relative flex flex-col">
            {hours.map((h) => (
              <div key={h} className="h-16 border-b text-right pr-2 pt-[2px] text-gray-500 text-sm">
                {h}:00
              </div>
            ))}

            {/* líneas :00 y :30 */}
            {hours.flatMap((h) => [
              <div key={`${h}-00`} className="absolute left-0 right-0 border-t border-gray-300"
                style={{ top: (h - GRID_START) * HOUR_HEIGHT }} />,
              <div key={`${h}-30`} className="absolute left-0 right-0 border-t border-gray-200"
                style={{ top: (h - GRID_START) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />,
            ])}
          </div>

          {/* ── Columnas de tareas por mecánico ─ */}
          {mecanicos.map((m, idx) => {
            const tareasMec = tareas.filter(t => t.idMecanico === m.idMecanico);
            return (
              <div
                key={m.idMecanico}
                className="row-start-2 border-l relative"
                style={{ gridColumnStart: idx + 2 }}
              >
                {/* Contenedor relativo para líneas y tareas */}
                <div className="relative" style={{ height: `${hours.length * HOUR_HEIGHT}px` }}>

                  {/* líneas :00 y :30 (mismas que en columna de horas) */}
                  {hours.flatMap((h) => [
                    <div key={`${m.idMecanico}-${h}-00`} className="absolute left-0 right-0 border-t border-gray-300"
                      style={{ top: (h - GRID_START) * HOUR_HEIGHT }} />,
                    <div key={`${m.idMecanico}-${h}-30`} className="absolute left-0 right-0 border-t border-gray-200"
                      style={{ top: (h - GRID_START) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />,
                  ])}

                  {/* tareas */}
                  {tareasMec.map((t) => {
                    const top = (timeToDecimal(t.horaIngresoTarea) - GRID_START) * HOUR_HEIGHT;
                    const height = (timeToDecimal(t.horaFinTarea) - timeToDecimal(t.horaIngresoTarea)) * HOUR_HEIGHT;
                    return (
                      <div
                        key={t.idTarea}
                        onClick={() => handleModificarTarea(t)}
                        className={`absolute left-1 right-1 text-white text-xs rounded px-2 py-1 shadow-md border border-gray-700 cursor-pointer transition ${tareaBg(t)}`}
                        style={{ top, height }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); handleVerTarea(t); }}
                          className="absolute bottom-1 right-1 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full"
                          title="Ver detalles"
                        >
                          Ver
                        </button>


                        <div className="font-semibold text-xs break-words overflow-hidden">
                          {t.descripcionTarea || "Tarea"}
                        </div>
                        <div className="text-[10px] leading-tight mt-1">
                          Estado : {t.nombreEstado}<br />
                          Admin : {t.nombreAdmin}
                          {t.esReservaTarea && <EyeIcon className="w-3 h-3 inline-block ml-1" />}
                        </div>
                      </div>

                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>



        <ModalCrearTarea
          isOpen={modalCrearVisible}
          onClose={() => setModalCrearVisible(false)}
          onCrear={(nuevaTarea) => {
            fetch(`${API_BASE_URL}tarea`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(nuevaTarea)
            })
              .then(res => {
                if (!res.ok) throw new Error("Error al crear tarea");
                return res.json();
              })
              .then(() => {
                const fecha = fechaSeleccionada.toISOString().split("T")[0];
                return fetch(`${API_BASE_URL}tarea/fecha/${fecha}`);
              })
              .then(res => res.json())
              .then(data => {
                setTareas(data);
                setModalCrearVisible(false);
              })
              .catch(err => {
                console.error("Error al crear tarea:", err);
                alert("Hubo un error al crear la tarea.");
              });
          }}
          fecha={fechaSeleccionada}
          idMecanico={mecanicoSeleccionado}
        />

        <ModalModificarTarea
          idTarea={tareaSeleccionada?.idTarea}
          isOpen={modalModificar}
          onClose={() => setModalModificar(false)}
          mecanicos={mecanicos}
          setTareaModificada={setTareaModificada}
          estados={estados}
        />



        {modalTareaVisible && tareaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white text-gray-800 p-6 rounded shadow-lg w-[700px]">
              <div className="flex row gap-5 mb-4 items-center justify-between">
                <h2 className="text-lg font-bold">Detalle de Tarea</h2>
                <div className="font-bold text-cyan-900 mt-1">
                  {tareaSeleccionada.horaIngresoTarea.slice(0, 5)} - {tareaSeleccionada.horaFinTarea.slice(0, 5)}
                </div>

              </div>

              <p>{tareaSeleccionada.descripcionTarea || "No especificada"}</p>
              <p className="text-right text-sm text-gray-900 mt-2">{tareaSeleccionada.nombreEstado}</p>

              {tareaSeleccionada.esReservaTarea && reserva?.tipoTarea?.length > 0 && (
                <div className="mb-4 text-sm text-gray-700 border border-blue-200 bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-blue-800 mb-1">Tipos de tarea de la reserva:</p>
                  <ul className="list-disc list-inside text-gray-800">
                    {reserva.tipoTarea.map((tipo) => (
                      <li key={tipo.idTipoTarea}>{tipo.nombreTipoTarea}</li>
                    ))}
                  </ul>
                </div>
              )}


              {tareaSeleccionada.esReservaTarea && !mostrarDetalleReserva && (
                <button
                  onClick={() => setMostrarDetalleReserva(true)}
                  className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  Ver detalles de la reserva
                </button>
              )}

              {mostrarDetalleReserva && (
                <div className="mt-4 bg-gray-100 p-4 rounded text-sm">
                  {loading && <p>Cargando detalles de la reserva...</p>}
                  {error && <p className="text-red-500">Error: {error}</p>}
                  {reserva && (
                    <div className="space-y-2">
                      <h3 className="font-bold">{reserva.cliente.nombreCliente} {reserva.cliente.apellidoCliente}</h3>
                      <p>Teléfono: {reserva.cliente.telefonoCliente}</p>
                      <p>Email: {reserva.cliente.emailCliente}</p>
                      <p>Documento: {reserva.cliente.documentoCliente}</p>
                      <p>Dirección: {reserva.cliente.direccionCliente}</p>

                      <h3 className="font-bold mt-4">{reserva.vehiculo.modelo.marca.nombreMarca} {reserva.vehiculo.modelo.nombreModelo}</h3>
                      <p>Matrícula: {reserva.vehiculo.matriculaVehiculo}</p>
                      <p>Kilometraje: {reserva.vehiculo.kilometrajeVehiculo}</p>
                      <p>Chasis: {reserva.vehiculo.nroChasisVehiculo}</p>
                      <p>Motor: {reserva.vehiculo.nroMotorVehiculo}</p>
                      <p>Cilindrada: {reserva.vehiculo.cilindradaVehiculo}</p>
                      <p>Año: {reserva.vehiculo.anoVehiculo}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 text-right flex justify-between">
                {mostrarDetalleReserva && (
                  <button
                    onClick={() => setMostrarDetalleReserva(false)}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Ocultar reserva
                  </button>
                )}

                <button
                  onClick={() => {
                    setMostrarDetalleReserva(false);
                    setModalTareaVisible(false);
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>

  );
}
