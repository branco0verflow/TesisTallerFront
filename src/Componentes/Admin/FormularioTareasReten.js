import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast, Toaster } from "react-hot-toast";

export default function FormularioTareasReten() {
    const [mecanicos, setMecanicos] = useState([]);
    const [mecanicosSeleccionados, setMecanicosSeleccionados] = useState([]);
    const [fechaDesde, setFechaDesde] = useState(null);
    const [fechaHasta, setFechaHasta] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8081/sgc/api/v1/mecanico")
            .then((res) => res.json())
            .then((data) => setMecanicos(data.filter(m => m.activoMecanico)))
            .catch((err) => console.error("Error al cargar mecánicos:", err));
    }, []);

    const toggleSeleccion = (idMecanico) => {
        setMecanicosSeleccionados((prev) =>
            prev.includes(idMecanico)
                ? prev.filter((id) => id !== idMecanico)
                : prev.length < 2
                    ? [...prev, idMecanico]
                    : prev // no permitir más de 2, sino se complica innecesariamente la lógica
        );
    };

    const enviarTareasReten = () => {
        if (!fechaDesde || !fechaHasta || mecanicosSeleccionados.length === 0) {
            toast.error("Selecciona fechas válidas y al menos un mecánico");
            return;
        }

        fetch("http://localhost:8081/sgc/api/v1/tarea/reten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idsMecanicos: mecanicosSeleccionados,
                desde: fechaDesde.toISOString().split("T")[0],
                hasta: fechaHasta.toISOString().split("T")[0],

            })
            ,
        })
            .then((res) => {
                if (res.ok) {
                    toast.success("Tareas retén creadas correctamente");
                    setMecanicosSeleccionados([]);
                    setFechaDesde(null);
                    setFechaHasta(null);
                } else {
                    toast.error("Error al crear tareas retén");
                    console.log("Enviando:", {
                        idMecanicos: mecanicosSeleccionados,
                        fechaDesde: fechaDesde.toISOString().split("T")[0],
                        fechaHasta: fechaHasta.toISOString().split("T")[0],
                    });

                }
            })
            .catch(() => toast.error("Fallo en la conexión con el servidor"));
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <Toaster />

            <h2 className="text-xl font-bold mb-4 text-gray-700">Crear tareas retén</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="font-semibold text-sm text-gray-600">Desde:</label>
                    <DayPicker
                        mode="single"
                        selected={fechaDesde}
                        onSelect={setFechaDesde}
                    />
                </div>
                <div>
                    <label className="font-semibold text-sm text-gray-600">Hasta:</label>
                    <DayPicker
                        mode="single"
                        selected={fechaHasta}
                        onSelect={setFechaHasta}
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="block font-semibold text-sm text-gray-600 mb-2">
                    Selecciona hasta 2 mecánicos activos:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mecanicos.map((mecanico) => (
                        <button
                            key={mecanico.idMecanico}
                            className={`p-2 border rounded-md ${mecanicosSeleccionados.includes(mecanico.idMecanico)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                                }`}
                            onClick={() => toggleSeleccion(mecanico.idMecanico)}
                        >
                            {mecanico.nombreMecanico}
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-right">
                <button
                    onClick={enviarTareasReten}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Crear tareas retén
                </button>
            </div>
        </div>
    );
}
