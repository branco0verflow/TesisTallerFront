import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSeguimiento } from "../SeguimientoContext";
import { API_BASE_URL } from "../../config/apiConfig";
import Loading2 from "../Loading2";
import { useState } from "react";

export default function ModalVerificarDatos({ formData, onClose, onConfirm }) {

    const { updateSeguimiento } = useSeguimiento();
    const [loading, setLoading] = useState(false);

    const fecha = new Date(`${formData.fechaSeleccionada}T12:00:00`);

    const navigate = useNavigate();

    const opciones = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Montevideo'
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);


    const handleSubmitReserva = async () => {
        setLoading(true);

        const padTime = (str) => (str.length === 5 ? str + ":00" : str); // SpringBoot no interpreta las horas sin ser time.SQL 8:00:00

        const todosLosDatosReserva = {
            fechaCitaReserva: formData.fechaSeleccionada,
            horaInicioReserva: padTime(formData.horaInicio),
            horaFinReserva: padTime(formData.horaFin),
            comentariosReserva: formData.comentario,
            cliente: {
                nombreCliente: formData.NombreCliente.trim(),
                apellidoCliente: formData.ApellidoCliente.trim(),
                documentoCliente: formData.CedulaCliente.trim(),
                emailCliente: formData.EmailCliente.trim(),
                telefonoCliente: formData.TelefonoCliente.trim(),
                direccionCliente: formData.DireccionCliente.trim()
            },
            vehiculo: {
                idModelo: formData.IdModelo,
                nroChasisVehiculo: formData.NroChasisVehiculo.trim(),
                nroMotorVehiculo: formData.NroMotorVehiculo.trim(),
                anoVehiculo: parseInt(formData.AnoVehiculo),
                cilindradaVehiculo: parseInt(formData.CilindradaVehiculo),
                kilometrajeVehiculo: parseInt(formData.KilometrajeVehiculo),
                matriculaVehiculo: formData.NroMatricula.trim()
            },
            idsTipoTarea: formData.tareas.map(t => t.idTipoTarea),
            idEstado: 1,
            idMecanico: formData.IdMecanico
        };


        try {

            if (!formData.NombreCliente || !formData.fechaSeleccionada) {
                setLoading(false);
                toast.error("Faltan datos importantes");
                return;
            }

            const cedula = formData.CedulaCliente;
            const email = formData.EmailCliente;

            updateSeguimiento({ cedula, email });


            const response = await fetch(`${API_BASE_URL}reserva`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todosLosDatosReserva)
            });




            if (!response.ok) {
                setLoading(false);
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                toast.error("Error al crear la reserva");

            } else {
                setLoading(false);
                toast.success("Reserva creada con éxito");
                setTimeout(() => navigate("/seguimiento"), 2000);
            }

        } catch (error) {
            setLoading(false);
            console.error("Error de red:", error);
            toast.error("No se pudo conectar con el servidor");
            console.log("Datos que se envían:", todosLosDatosReserva);

        }
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
            {loading && <Loading2 />}

            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                    ¡Hola {formData.NombreCliente}!
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Por favor, revisa y confirma los datos antes de agendar tu cita.
                </p>

                <div className="space-y-4 text-sm sm:text-base text-gray-700">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <p><strong>Cita:</strong> {fechaCapitalizada} a las {formData.horaInicio}</p>
                        <p><strong>Motivo:</strong> {formData.tareas.map(t => t.nombreTipoTarea).join(", ")}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <p><strong>Contacto:</strong> {formData.TelefonoCliente}</p>
                        <p><strong>Cédula:</strong> {formData.CedulaCliente}</p>
                        <p><strong>Email:</strong> {formData.EmailCliente}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <p><strong>Marca:</strong> {formData.NombreMarca}</p>
                        <p><strong>Modelo:</strong> {formData.NombreModelo}</p>
                        <p><strong>Matrícula:</strong> {formData.NroMatricula}</p>
                        <p><strong>Chasis:</strong> {formData.NroChasisVehiculo}</p>
                        <p><strong>Motor:</strong> {formData.NroMotorVehiculo}</p>
                        <p><strong>Año:</strong> {formData.AnoVehiculo}</p>
                        <p><strong>Cilindrada:</strong> {formData.CilindradaVehiculo} cc</p>
                        <p><strong>Kilometraje:</strong> {formData.KilometrajeVehiculo} km</p>
                        {formData.comentario && (
                            <p className="italic text-gray-500 mt-2">Comentario: {formData.comentario}</p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                        Modificar datos
                    </button>
                    <button
                        onClick={handleSubmitReserva}
                        className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Confirmar y reservar
                    </button>
                </div>
            </div>
        </div>

    );
}
