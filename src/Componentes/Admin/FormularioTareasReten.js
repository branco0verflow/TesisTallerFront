import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConfig";
import Loading2 from "../Loading2";

export default function FormularioTareasReten() {
    const [mecanicos, setMecanicos] = useState([]);
    const [mecanicosSeleccionados, setMecanicosSeleccionados] = useState([]);
    const [fechaDesde, setFechaDesde] = useState(null);
    const [fechaHasta, setFechaHasta] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE_URL}mecanico`)
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
        setLoading(true);

        fetch(`${API_BASE_URL}tarea/reten`, {
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
                    setLoading(false);
                } else {
                    setLoading(false);
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
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6">
            <Toaster />
            {loading && <Loading2 />}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Crear tareas retén</h2>
                <button
                    onClick={() => navigate("/ListaAdmin")}
                    className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
                >
                    ← Volver al Panel
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desde:</label>
                    <div className="border rounded-md shadow-sm p-2 bg-gray-50">
                        <DayPicker mode="single" selected={fechaDesde} onSelect={setFechaDesde} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasta:</label>
                    <div className="border rounded-md shadow-sm p-2 bg-gray-50">
                        <DayPicker mode="single" selected={fechaHasta} onSelect={setFechaHasta} />
                    </div>
                </div>
            </div>

            <div>
                <label className="block font-medium text-sm text-gray-700 mb-2">
                    Selecciona hasta 2 mecánicos activos:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mecanicos.map((mecanico) => (
                        <button
                            key={mecanico.idMecanico}
                            className={`p-2 border rounded-md transition-all duration-200 font-medium ${mecanicosSeleccionados.includes(mecanico.idMecanico)
                                    ? "bg-blue-600 text-white shadow"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                }`}
                            onClick={() => toggleSeleccion(mecanico.idMecanico)}
                        >
                            {mecanico.nombreMecanico}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={enviarTareasReten}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow"
                >
                    Crear tareas retén
                </button>
            </div>
        </div>

    );
}
