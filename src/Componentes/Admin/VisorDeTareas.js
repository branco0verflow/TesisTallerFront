import { useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ReservaDetalle from "./ReservaDetalle";
import { EyeIcon, PlusIcon, CalendarIcon } from "@heroicons/react/24/solid";
import ModalCrearTarea from "./ModalCrearTarea";
import toast from "react-hot-toast";
import { Toaster } from 'react-hot-toast';
import ModalModificarTarea from "./ModalModificarTarea";
import BotonLogout from "./BotonLogout";

export default function CalendarioTareas() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
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
    fetch("http://localhost:8081/sgc/api/v1/mecanico")
      .then(res => res.json())
      .then(data => setMecanicos(data))
      .catch(err => console.error("Error al cargar mecánicos:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/sgc/api/v1/estado")
      .then(res => res.json())
      .then(data => setEstados(data))
      .catch(err => console.error("Error al cargar estados:", err));
  }, []);

  useEffect(() => {
    if (fechaSeleccionada) {
      const fecha = fechaSeleccionada.toISOString().split("T")[0];
      fetch(`http://localhost:8081/sgc/api/v1/tarea/fecha/${fecha}`)
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


  return (
    <div className="p-4">
      <Toaster position="top-right" />

      <div className="flex mb-4 items-center justify-center gap-4">
        <button
          onClick={toggleCalendario}
          className="rounded-full p-5 bg-blue-600 hover:bg-blue-700  text-white shadow-md shadow-gray-400 mr-2"
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


        <BotonLogout tipoUsuario="admin" />


      </div>




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
            <div className="h-full flex items-center justify-center bg-gray-100 border-l border-b text-gray-700 font-semibold px-2">
              {m.nombreMecanico}
              <button
                onClick={() => { setMecanicoSeleccionado(m.idMecanico); setModalCrearVisible(true); }}
                className="ml-2 p-1 rounded-full bg-green-600 hover:bg-green-700 text-white shadow"
                title="Nueva tarea"
              >
                <PlusIcon className="w-4 h-4" />
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
                        className="absolute top-1 right-1 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full"
                        title="Ver detalles"
                      >
                        Ver detalles
                      </button>

                      <div className="font-semibold truncate">{t.descripcionTarea || "Tarea"}</div>
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
          fetch("http://localhost:8081/sgc/api/v1/tarea", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaTarea)
          })
            .then(res => {
              if (!res.ok) throw new Error("Error al crear tarea");
              return res.json(); // ✅ Ahora esto no rompe porque backend devuelve JSON
            })
            .then(() => {
              const fecha = fechaSeleccionada.toISOString().split("T")[0];
              return fetch(`http://localhost:8081/sgc/api/v1/tarea/fecha/${fecha}`);
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

                    <h3 className="font-bold mt-4">{reserva.vehiculo.modelo.marca.nombreMarca} {reserva.vehiculo.modelo.nombreModelo}</h3>
                    <p>Matrícula: {reserva.vehiculo.matriculaVehiculo}</p>
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


  );
}
