import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from 'react-hot-toast';

export default function ModalModificarTarea({ idTarea, isOpen, onClose, mecanicos, setTareaModificada, estados }) {
    const [loading, setLoading] = useState(true);
    const [tarea, setTarea] = useState(null);

    useEffect(() => {
        if (idTarea && isOpen) {
            fetch(`http://localhost:8081/sgc/api/v1/tarea/${idTarea}`)
                .then(res => res.json())
                .then(data => {
                    setTarea({
                        ...data,
                        idMecanico: data.mecanico?.idMecanico ?? null,
                        idEstado: data.estado?.idEstado ?? null,
                        idAdmin: data.administrador?.idAdmin ?? null,
                        idReserva: data.reserva?.idReserva ?? null,
                    });
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

        // Convertir a número si es un ID
        const isIdField = ["idMecanico", "idEstado", "idAdmin", "idReserva"].includes(name);
        const parsedValue = isIdField ? parseInt(value) : value;

        // agrego :00 a la hora (si se cambió)
        const finalValue =
            (name === "horaIngresoTarea" || name === "horaFinTarea") && value.length === 5
                ? `${parsedValue}:00`
                : parsedValue;

        setTarea((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };



    const modificarTarea = () => {

        const tareaDTO = {
            idTarea: tarea.idTarea,
            fechaCreadaTarea: tarea.fechaCreadaTarea,
            fechaTarea: tarea.fechaTarea,
            horaIngresoTarea: tarea.horaIngresoTarea,
            horaFinTarea: tarea.horaFinTarea,
            descripcionTarea: tarea.descripcionTarea,
            esReservaTarea: tarea.esReservaTarea,
            idReserva: tarea.idReserva,
            idMecanico: tarea.idMecanico,
            idEstado: tarea.idEstado,
            idAdmin: tarea.idAdmin,
        };



        fetch(`http://localhost:8081/sgc/api/v1/tarea/${idTarea}`, {
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
                    console.log(tarea, idTarea);
                }
            })
            .catch(err => {
                toast.error("Error en el servidor");
                console.error(err);
            });
    };

    const getHoraSinSegundos = (hora) => {
        return hora?.slice(0, 5); // toma solo "HH:mm" de "HH:mm:ss"
    };

    const formatearFecha = (fecha) => {
        const f = new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' });
        return f.charAt(0).toUpperCase() + f.slice(1);
    };




    if (!isOpen) return null; // necesario
    if (loading) return <div className="p-4">Cargando tarea...</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <Toaster position="top-right" />
            <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
                <div className="flex gap-4 mb-4 items-center justify-between">
                    <h2 className="text-lg font-bold">Modificar Tarea</h2>
                    <h3 className="flex text-sm text-gray-700">Creada el {formatearFecha(tarea.fechaCreadaTarea)} por <strong className="ml-1">{tarea.administrador.nombreAdmin}</strong></h3>
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

                <div className="flex gap-4 mb-4">
                    <label className="flex flex-col text-sm w-40">
                        Hora Ingreso:
                        <input
                            name="horaIngresoTarea"
                            type="time"
                            value={getHoraSinSegundos(tarea.horaIngresoTarea) || ""}
                            onChange={handleChange}
                            className="border px-2 py-1 mt-1 rounded"
                        />
                    </label>

                    <label className="flex flex-col text-sm w-40">
                        Hora Fin:
                        <input
                            name="horaFinTarea"
                            type="time"
                            value={getHoraSinSegundos(tarea.horaFinTarea) || ""}
                            onChange={handleChange}
                            className="border px-2 py-1 mt-1 rounded"
                        />
                    </label>

                    <label className="block mb-2">
                    Estado:
                    <select
                        name="idEstado"
                        value={tarea.idEstado || ""}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 mt-1 rounded"
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
                        <option value="">{tarea.mecanico.nombreMecanico} {tarea.mecanico.apellidoMecanico}</option>
                        {mecanicos.map((m) => (
                            <option key={m.idMecanico} value={m.idMecanico}>
                                {m.nombreMecanico} {m.apellidoMecanico}
                            </option>
                        ))}
                    </select>
                </label>



                <div className="flex justify-end mt-4 space-x-2">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancelar</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={modificarTarea}>Guardar</button>
                </div>
            </div>
        </div>
    );
}
