import { useState } from "react";
import { useAdmin } from "../../AdminContext";

export default function ModalCrearTarea({ isOpen, onClose, onCrear, fecha, idMecanico }) {
    const [form, setForm] = useState({
        horaInicio: "08:00",
        horaFin: "09:00",
        descripcion: ""
    });

    if (!fecha) {
    alert("No se ha seleccionado una fecha válida.");
    return;
}


    const { admin } = useAdmin(); 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const nuevaTarea = {
            fechaTarea: fecha.toISOString().split("T")[0],
            horaIngresoTarea: form.horaInicio + ":00",
            horaFinTarea: form.horaFin + ":00",
            descripcionTarea: form.descripcion,
            esReservaTarea: false,
            idMecanico,
            idEstado: 2,
            idAdmin: admin?.idAdmin
            
        };
        onCrear(nuevaTarea);
        onClose();
        console.log(nuevaTarea);
        console.log("fecha es null: " + fecha);
    };

    if (!isOpen) return null;




    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                >
                    X
                </button>
                <h2 className="text-lg font-bold mb-4">Nueva tarea</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Hora de inicio</label>
                        <input
                            type="time"
                            name="horaInicio"
                            value={form.horaInicio}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Hora de fin</label>
                        <input
                            type="time"
                            name="horaFin"
                            value={form.horaFin}
                            onChange={handleChange}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Crear tarea
                    </button>
                </div>
            </div>
        </div>
    );
}

