import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TrashIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function ModalModificarTarea({ idTarea, isOpen, onClose, mecanicos, setTareaModificada, estados }) {
  const [loading, setLoading] = useState(true);
  const [tarea, setTarea] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [calendarioVisible, setCalendarioVisibleModal] = useState(false);


  const toggleCalendario = () => {
    setCalendarioVisibleModal(prev => !prev);
  };

  useEffect(() => {
    if (idTarea && isOpen) {
      fetch(`${API_BASE_URL}tarea/${idTarea}`)
        .then(res => res.json())
        .then(data => {
          setTarea({
            ...data,
            idMecanico: data.mecanico?.idMecanico ?? null,
            idEstado: data.estado?.idEstado ?? null,
            idAdmin: data.administrador?.idAdmin ?? null,
            idReserva: data.reserva?.idReserva ?? null,
          });
          setFechaSeleccionada(new Date(data.fechaTarea));
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener tarea:", error);
          setLoading(false);
        });
    }
  }, [idTarea, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isIdField = ["idMecanico", "idEstado", "idAdmin", "idReserva"].includes(name);
    const parsedValue = isIdField ? parseInt(value) : value;

    const finalValue =
      (name === "horaIngresoTarea" || name === "horaFinTarea") && value.length === 5
        ? `${parsedValue}:00`
        : parsedValue;

    setTarea((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // formato yyyy-MM-dd
  };

  const modificarTarea = () => {
    const tareaDTO = {
      idTarea: tarea.idTarea,
      fechaCreadaTarea: tarea.fechaCreadaTarea,
      fechaTarea: formatDate(fechaSeleccionada),
      horaIngresoTarea: tarea.horaIngresoTarea,
      horaFinTarea: tarea.horaFinTarea,
      descripcionTarea: tarea.descripcionTarea,
      esReservaTarea: tarea.esReservaTarea,
      idReserva: tarea.idReserva,
      idMecanico: tarea.idMecanico,
      idEstado: tarea.idEstado,
      idAdmin: tarea.idAdmin,
    };

    fetch(`${API_BASE_URL}tarea/${idTarea}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tareaDTO),
    })
      .then(res => {
        if (res.ok) {
          setTareaModificada(true);
          onClose();
        } else {
          toast.error("No se pudo modificar la tarea");
        }
      })
      .catch(err => {
        toast.error("Error en el servidor");
        console.error(err);
      });
  };

  const eliminarTarea = (idTarea) => {
    fetch(`${API_BASE_URL}tarea/${idTarea}`, {
      method: "DELETE",
    })
      .then(res => {
        if (res.ok) {
          setTareaModificada(true);
          onClose();
        } else {
          toast.error("No se pudo eliminar la tarea");
        }
      })
      .catch(err => {
        toast.error("Error en el servidor");
        console.error(err);
      });
  };

  const confirmarYEliminar = (idTarea) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      eliminarTarea(idTarea);
    }
  };

  const getHoraSinSegundos = (hora) => hora?.slice(0, 5);

  const formatearFecha = (fecha) => {
    const f = new Date(fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "long" });
    return f.charAt(0).toUpperCase() + f.slice(1);
  };

  if (!isOpen) return null;
  if (loading) return <div className="p-4">Cargando tarea...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex gap-4 mb-4 items-center justify-between">
          <h2 className="text-lg font-bold">Modificar Tarea</h2>
          <h3 className="flex text-sm text-gray-700">
            Creada el {formatearFecha(tarea.fechaCreadaTarea)} por
            <strong className="ml-1">{tarea.administrador.nombreAdmin}</strong>
          </h3>
        </div>

        <div className="flex items-start gap-4 mb-4 flex-wrap">
          {/* Botón toggle */}
          <button
            onClick={toggleCalendario}
            className="rounded-full p-3 bg-blue-600 hover:bg-blue-700 text-white"
            title={calendarioVisible ? "Ocultar calendario" : "Mostrar calendario"}
          >
            <CalendarIcon className="h-6 w-6" />
          </button>

          {/* Calendario visible al togglear */}
          {calendarioVisible && (
            <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
              <DayPicker
                mode="single"
                selected={fechaSeleccionada}
                onSelect={setFechaSeleccionada}
              />
            </div>
          )}
        </div>


        <label className="block mb-2">
          Descripción:
          <textarea
            name="descripcionTarea"
            value={tarea.descripcionTarea || ""}
            onChange={handleChange}
            rows={6}
            className="w-full border px-2 py-1 mt-1 rounded"
          />
        </label>

        {tarea.esReservaTarea && tarea.reserva?.tipoTarea?.length > 0 && (
          <div className="mb-4 text-sm text-gray-700 border border-blue-200 bg-blue-50 p-3 rounded">
            <p className="font-semibold text-blue-800 mb-1">Tipos de tarea de la reserva:</p>
            <ul className="list-disc list-inside text-gray-800">
              {tarea.reserva.tipoTarea.map((tipo) => (
                <li key={tipo.idTipoTarea}>{tipo.nombreTipoTarea}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4 mb-4">
          <label className="flex flex-col text-sm w-30">
            Ingreso
            <input
              name="horaIngresoTarea"
              type="time"
              value={getHoraSinSegundos(tarea.horaIngresoTarea) || ""}
              onChange={handleChange}
              className="border px-2 py-1 mt-1 rounded"
            />
          </label>

          <label className="flex flex-col text-sm w-30">
            Fin
            <input
              name="horaFinTarea"
              type="time"
              value={getHoraSinSegundos(tarea.horaFinTarea) || ""}
              onChange={handleChange}
              className="border px-2 py-1 mt-1 rounded"
            />
          </label>

          <label className="flex flex-col text-sm w-30">
            Estado
            <select
              name="idEstado"
              value={tarea.idEstado || ""}
              onChange={handleChange}
              className="border px-2 py-1 mt-1 rounded"
            >
              <option value="">{tarea.estado.nombreEstado}</option>
              {estados.map((es) => (
                <option key={es.idEstado} value={es.idEstado}>
                  {es.nombreEstado}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block mb-2">
          Mecánico:
          <select
            name="idMecanico"
            value={tarea.idMecanico || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1 mt-1 rounded"
          >
            <option value="">
              {tarea.mecanico.nombreMecanico} {tarea.mecanico.apellidoMecanico}
            </option>
            {mecanicos.map((m) => (
              <option key={m.idMecanico} value={m.idMecanico}>
                {m.nombreMecanico} {m.apellidoMecanico}
              </option>
            ))}
          </select>
        </label>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => confirmarYEliminar(idTarea)}
            className="p-3 rounded-full bg-red-300 hover:bg-red-500 text-white shadow transition"
            title="Eliminar tarea"
          >
            <TrashIcon className="w-5 h-5" />
          </button>

          <div className="flex justify-end gap-2">
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
              Cancelar
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={modificarTarea}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
