import React from "react";

const mechanics = ["Alvaro", "Leandro", "Fernando", "Jose"];
const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 8 a 17

// Datos de prueba para las tareas
const tasks = [
  { id: 1, mechanic: "Alvaro", start: "08:00", end: "12:30", desc: "Cambio de aceite", color: "bg-red-300" },
  { id: 2, mechanic: "Alvaro", start: "13:00", end: "15:00", desc: "Revisión de frenos", color: "bg-red-400" },
  { id: 3, mechanic: "Leandro", start: "08:00", end: "10:00", desc: "Alineación", color: "bg-green-300" },
  { id: 4, mechanic: "Leandro", start: "10:00", end: "12:00", desc: "Balanceo", color: "bg-green-400" },
  { id: 5, mechanic: "Fernando", start: "08:30", end: "12:00", desc: "Diagnóstico", color: "bg-orange-300" },
  { id: 6, mechanic: "Fernando", start: "14:00", end: "16:00", desc: "Cambio de bujías", color: "bg-orange-400" },
  { id: 7, mechanic: "Jose", start: "09:00", end: "12:00", desc: "Reparación eléctrica", color: "bg-purple-300" },
  { id: 8, mechanic: "Jose", start: "13:00", end: "17:00", desc: "Cambio de batería", color: "bg-purple-400" },
];

// Convierte una hora a un número decimal (por ejemplo, "08:30" → 8.5)
function timeToDecimal(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
}

export default function App() {
  return (
    
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Agenda Taller</h1>

      <div className="grid grid-cols-[80px_repeat(4,minmax(0,1fr))] border border-gray-300 rounded shadow overflow-hidden bg-white">
        {/* Horas al costado */}
        <div className="flex flex-col">
          {hours.map((hour) => (
            <div key={hour} className="h-16 border-b border-gray-200 text-sm text-right pr-2 pt-4 text-gray-500">
              {hour}:00
            </div>
          ))}
        </div>

        {/* Columnas de mecánicos */}
        {mechanics.map((name) => {
          const tasksForMechanic = tasks.filter((t) => t.mechanic === name);

          return (
            <div key={name} className="border-l border-gray-200 relative">
              {/* Nombre del mecánico */}
              <div className="h-10 font-semibold text-center border-b border-gray-200 bg-gray-100 text-gray-700 flex items-center justify-center">
                {name}
              </div>

              {/* Espacio total de tareas */}
              <div className="relative" style={{ height: `${hours.length * 64}px` }}>
                {tasksForMechanic.map((task) => {
                  const startDecimal = timeToDecimal(task.start);
                  const endDecimal = timeToDecimal(task.end);
                  const top = (startDecimal - 8) * 64;
                  const height = (endDecimal - startDecimal) * 64;

                  return (
                    <div
                      key={task.id}
                      className={`absolute left-2 right-2 ${task.color} rounded shadow-md text-white text-xs px-2 py-1 overflow-hidden whitespace-pre-line`}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      {task.desc}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
