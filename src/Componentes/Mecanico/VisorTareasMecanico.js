import { useEffect, useState } from "react";
import { useMecanico } from "../../MecanicoContext";
import { EyeIcon } from "@heroicons/react/24/outline";

const GRID_START = 8;
const GRID_END = 17;
const HOUR_HEIGHT = 64;
const HEADER_H = 40;

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

  const cambiarDia = (dias) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
  };

  useEffect(() => {
    if (fechaSeleccionada) {
      const fecha = fechaSeleccionada.toISOString().split("T")[0];
      fetch(`http://localhost:8081/sgc/api/v1/tarea/fecha/${fecha}`)
        .then(res => res.json())
        .then(data => setTareas(data))
        .catch(err => console.error("Error al cargar tareas:", err));
    }
  }, [fechaSeleccionada]);

  const tareasMec = tareas.filter(t => t.idMecanico === mecanico?.idMecanico);

  return (
    <div className="p-4">
      <div className="flex justify-center gap-2 mb-4">
        <button onClick={() => cambiarDia(-1)} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Ayer</button>
        <button onClick={() => cambiarDia(0)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Hoy</button>
        <button onClick={() => cambiarDia(1)} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Mañana</button>
      </div>

      <div className="grid border border-gray-300 rounded shadow overflow-hidden bg-white"
        style={{
          gridTemplateColumns: '80px 1fr',
          gridTemplateRows: `${HEADER_H}px 1fr`
        }}>

        <div className="row-start-1 col-start-1"></div>
        <div className="row-start-1 col-start-2">
          <div className="h-full flex items-center justify-center bg-gray-100 border-l border-b text-gray-700 font-semibold px-2">
            {mecanico?.nombreMecanico || "Mecánico"}
          </div>
        </div>

        <div className="row-start-2 col-start-1 relative flex flex-col">
          {hours.map((h) => (
            <div key={h} className="h-16 border-b text-right pr-2 pt-[2px] text-gray-500 text-sm">
              {h}:00
            </div>
          ))}
        </div>

        <div className="row-start-2 col-start-2 border-l relative">
          <div className="relative" style={{ height: `${hours.length * HOUR_HEIGHT}px` }}>
            {tareasMec.map((t) => {
              const top = (timeToDecimal(t.horaIngresoTarea) - GRID_START) * HOUR_HEIGHT;
              const height = (timeToDecimal(t.horaFinTarea) - timeToDecimal(t.horaIngresoTarea)) * HOUR_HEIGHT;
              return (
                <div
                  key={t.idTarea}
                  className={`absolute left-1 right-1 text-white text-xs rounded px-2 py-1 shadow-md border border-gray-700 ${tareaBg(t)}`}
                  style={{ top, height }}
                >
                  <div className="font-semibold truncate">{t.descripcionTarea || "Tarea"}</div>
                  <div className="text-[10px] leading-tight mt-1">
                    Estado: {t.nombreEstado}<br />
                    Admin: {t.nombreAdmin}
                    {t.esReservaTarea && <EyeIcon className="w-3 h-3 inline-block ml-1" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
