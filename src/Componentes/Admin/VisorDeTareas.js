import { useEffect, useState } from "react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ReservaDetalle from "./ReservaDetalle";
import { EyeIcon, PlusIcon } from "@heroicons/react/24/solid";
import ModalCrearTarea from "./ModalCrearTarea";

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

  const [mostrarDetalleReserva, setMostrarDetalleReserva] = useState(false);
  const { reserva, loading, error } = ReservaDetalle(tareaSeleccionada?.idReserva, mostrarDetalleReserva);


  const handleVerTarea = (tarea) => {
    setTareaSeleccionada(tarea);
    setModalTareaVisible(true);
  };



  useEffect(() => {
    fetch("http://localhost:8081/sgc/api/v1/mecanico")
      .then(res => res.json())
      .then(data => setMecanicos(data))
      .catch(err => console.error("Error al cargar mecánicos:", err));
  }, []);

  useEffect(() => {
    if (fechaSeleccionada) {
      const fecha = fechaSeleccionada.toISOString().split("T")[0];
      fetch(`http://localhost:8081/sgc/api/v1/tarea/fecha/${fecha}`)
        .then(res => res.json())
        .then(data => setTareas(data))
        .catch(err => console.error("Error al cargar tareas:", err));
    }
  }, [fechaSeleccionada]);

  const timeToDecimal = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 8 a 17






  return (
    <div className="p-4">

      <div className="flex mb-4 space-row">
        <DayPicker mode="single" selected={fechaSeleccionada} onSelect={setFechaSeleccionada} />
      </div>

      <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(200px,1fr))] border border-gray-300 rounded shadow overflow-hidden bg-white">
        <div className="flex flex-col">
          {hours.map((hour) => (
            <div key={hour} className="h-16 border-b text-right pr-2 pt-4 text-gray-500 text-sm">
              {hour}:00
            </div>
          ))}
        </div>

        {mecanicos.map(m => {
          const tareasMecanico = tareas.filter(t => t.idMecanico === m.idMecanico);
          return (
            <div key={m.idMecanico} className="border-l relative">
              <div className="h-10 font-semibold text-center border-b bg-gray-100 text-gray-700 flex items-center justify-center px-2">
                {m.nombreMecanico}
                <button
                  onClick={() => { setMecanicoSeleccionado(m.idMecanico); setModalCrearVisible(true); }}
                  className="bg-green-600 text-white p-2 rounded ml-2 hover:bg-green-700"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="relative" style={{ height: `${hours.length * 64}px` }}>
                {tareasMecanico.map((t) => {
                  const top = (timeToDecimal(t.horaIngresoTarea) - 8) * 64;
                  const height = (timeToDecimal(t.horaFinTarea) - timeToDecimal(t.horaIngresoTarea)) * 64;
                  return (
                    <div
                      key={t.idTarea}
                      onClick={() => handleVerTarea(t)} // <-- click para abrir el modal
                      className="absolute left-1 right-1 bg-blue-500 text-white text-xs rounded px-2 py-1 shadow-md border border-gray-700 cursor-pointer hover:brightness-110 transition"
                      style={{ top, height }}
                    >
                      {t.descripcionTarea || "Tarea"}
                      <div className="text-[10px]">
                        Estado: {t.nombreEstado} <br />
                        Admin: {t.nombreAdmin} <br />
                        {t.esReservaTarea && (

                          <button onClick={(() => {
                            <ModalReservaDetalle idReserva={t.idReserva} visible={(() => setModalVisible(true))} onClose={() => setModalVisible(false)} />
                          })}>
                            <EyeIcon className="w-3 h-3 inline-block ml-1" />
                          </button>
                        )}
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


      {modalTareaVisible && tareaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex row gap-5 mb-4">
              <h2 className="text-lg font-bold">Detalle de Tarea</h2>
              {tareaSeleccionada.horaIngresoTarea.slice(0, 5)} a {tareaSeleccionada.horaFinTarea.slice(0, 5)}
            </div>

            <p>{tareaSeleccionada.descripcionTarea || "No especificada"}</p>
            <p>{tareaSeleccionada.nombreEstado}</p>

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
