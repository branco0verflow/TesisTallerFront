import { useEffect, useState } from "react";
import { useMecanico } from "../../MecanicoContext";
import { EyeIcon } from "@heroicons/react/24/outline";
import ReservaDetalle from "../Admin/ReservaDetalle";
import BotonLogout from "../Admin/BotonLogout";
import { API_BASE_URL } from "../../config/apiConfig";

const GRID_START = 8;
const GRID_END = 17;
const HOUR_HEIGHT = 64; // alto de bloque horario px
const HEADER_H = 40; // alto de cabecera px
const HOUR_COL_W_SM = 44; // ancho px col horas en pantallas
const HOUR_COL_W_LG = 80; // ancho px col horas en pantallas 

const hours = Array.from({ length: GRID_END - GRID_START }, (_, i) => GRID_START + i);

function timeToDecimal(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
}

function tareaBg(t) {
  return t.esReservaTarea ? "bg-indigo-600" : "bg-blue-600";
}

export default function VisorTareasMecanico() {
  const { mecanico } = useMecanico();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [tareas, setTareas] = useState([]);
  const [fechaCapitalizada, setFechaCapitalizada] = useState("");
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [modalTareaVisible, setModalTareaVisible] = useState(false);
  const [mostrarDetalleReserva, setMostrarDetalleReserva] = useState(false);

  const { reserva, loading, error } = ReservaDetalle(
    tareaSeleccionada?.idReserva,
    mostrarDetalleReserva
  );


  const opcionesFecha = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Montevideo",
  };

  const cambiarDia = (dias) => {
    const nueva = new Date(fechaSeleccionada);
    nueva.setDate(nueva.getDate() + dias);
    setFechaSeleccionada(nueva);
  };


  useEffect(() => {
    const fetchTareasDelDia = async () => {
      try {
        const fechaIso = fechaSeleccionada.toISOString().split("T")[0];
        const res = await fetch(
          `${API_BASE_URL}tarea/fecha/${fechaIso}`
        );
        const data = await res.json();
        setTareas(data);
      } catch (err) {
        console.error("Error al cargar tareas:", err);
      }
    };

    fetchTareasDelDia();


    const fechaIso = fechaSeleccionada.toISOString().split("T")[0];
    const fechaMuestra = new Date(`${fechaIso}T12:00:00`);
    const str = fechaMuestra.toLocaleDateString("es-ES", opcionesFecha);
    setFechaCapitalizada(str.charAt(0).toUpperCase() + str.slice(1));
  }, [fechaSeleccionada]);

  const tareasMec = tareas.filter((t) => t.idMecanico === mecanico?.idMecanico);


  return (
    <div className="p-4 w-full max-w-full overflow-x-auto">

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => cambiarDia(-1)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Ayer
        </button>
        <button
          onClick={() => setFechaSeleccionada(new Date())}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Hoy
        </button>
        <button
          onClick={() => cambiarDia(1)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Mañana
        </button>

        <BotonLogout tipoUsuario="mecanico" />

      </div>

      <div className="text-center text-xl font-semibold text-gray-700 mb-4">
        {fechaCapitalizada}
      </div>


      <div
        className="grid border border-gray-300 rounded shadow bg-white grid-cols-[44px_1fr] sm:grid-cols-[80px_1fr] grid-rows-[40px_1fr]"
      >

        <div className="row-start-1 col-start-1" />


        <div className="row-start-1 col-start-2 hidden sm:flex items-center justify-center bg-gray-100 border-l border-b text-gray-700 font-semibold px-2">
          {mecanico?.nombreMecanico || "Mecánico"}
        </div>


        <div className="row-start-2 col-start-1 flex flex-col w-11 sm:w-20 border-r bg-gray-50/40 overflow-hidden">
          {hours.map((h) => (
            <div
              key={h}
              className="h-16 border-b text-right pr-1 sm:pr-2 pt-[2px] text-gray-500 text-[10px] sm:text-xs leading-none tracking-tighter"
            >
              {h}:00
            </div>
          ))}
        </div>

        <div className="row-start-2 col-start-2 overflow-y-auto relative border-l">
          <div
            className="relative"
            style={{ height: `${hours.length * HOUR_HEIGHT}px` }}
          >
            {tareasMec.map((t) => {
              const top =
                (timeToDecimal(t.horaIngresoTarea) - GRID_START) * HOUR_HEIGHT;
              const height =
                (timeToDecimal(t.horaFinTarea) -
                  timeToDecimal(t.horaIngresoTarea)) * HOUR_HEIGHT;

              return (
                <div
                  key={t.idTarea}
                  onClick={() => {
                    setTareaSeleccionada(t);
                    setModalTareaVisible(true);
                  }}
                  className={`absolute left-1 right-1 rounded px-2 py-1 shadow-md border border-gray-700 text-white text-[10px] sm:text-xs md:text-sm cursor-pointer ${tareaBg(t)}`}
                  style={{ top, height }}
                >
                  <div className="font-semibold truncate">
                    {t.descripcionTarea || "Tarea"}
                  </div>
                  
                  <div className="text-[8px] sm:text-[10px] leading-tight mt-1 select-none">
                    Estado: {t.nombreEstado}
                    <br />
                    Admin: {t.nombreAdmin}
                    {t.esReservaTarea && (
                      <EyeIcon className="w-3 h-3 inline-block ml-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {modalTareaVisible && tareaSeleccionada && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-800 p-6 rounded shadow-lg w-full max-w-lg mx-auto">
            <header className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-cyan-900">
                {tareaSeleccionada.horaIngresoTarea.slice(0, 5)} –
                {" "}
                {tareaSeleccionada.horaFinTarea.slice(0, 5)}
              </h2>
              <button
                className="text-red-600 hover:underline text-sm"
                onClick={() => {
                  setMostrarDetalleReserva(false);
                  setModalTareaVisible(false);
                }}
              >
                Cerrar
              </button>
            </header>

            <p>{tareaSeleccionada.descripcionTarea || "No especificada"}</p>
            <p className="text-right text-sm text-gray-900 mt-2">
              {tareaSeleccionada.nombreEstado}
            </p>


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
                {loading && <p>Cargando detalles de la reserva…</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {reserva && (
                  <>
                  {reserva?.tipoTarea?.length > 0 && (
                    <div className="mb-4 text-sm text-gray-700 border border-blue-200 bg-blue-50 p-3 rounded">
                      <p className="font-semibold text-blue-800 mb-1">Tipos de tarea de la reserva:</p>
                      <ul className="list-disc list-inside text-gray-800">
                        {reserva.tipoTarea.map((tipo) => (
                          <li key={tipo.idTipoTarea}>{tipo.nombreTipoTarea}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                    <h3 className="font-bold">
                      {reserva.cliente.nombreCliente} {" "}
                      {reserva.cliente.apellidoCliente}
                    </h3>

                    <h3 className="font-bold mt-4">
                      {reserva.vehiculo.modelo.marca.nombreMarca} {" "}
                      {reserva.vehiculo.modelo.nombreModelo}
                    </h3>

                    <p>Matrícula: {reserva.vehiculo.matriculaVehiculo}</p>
                    <p>Chasis: {reserva.vehiculo.nroChasisVehiculo}</p>
                    <p>Motor: {reserva.vehiculo.nroMotorVehiculo}</p>
                    <p>Cilindrada: {reserva.vehiculo.cilindradaVehiculo}</p>
                    <p>Año: {reserva.vehiculo.anoVehiculo}</p>
                  </>
                )}
              </div>
            )}

            {mostrarDetalleReserva && (
              <button
                onClick={() => setMostrarDetalleReserva(false)}
                className="mt-4 text-sm text-gray-600 hover:underline"
              >
                Ocultar reserva
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
