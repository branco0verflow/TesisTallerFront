import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function ModalVerificarDatos({ formData, onClose, onConfirm }) {

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
                toast.error("Faltan datos importantes");
                return;
            }


            const response = await fetch("http://localhost:8081/sgc/api/v1/reserva", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todosLosDatosReserva)
            });




            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                toast.error("Error al crear la reserva");

            } else {
                toast.success("Reserva creada con éxito");
                setTimeout(() => navigate("/"), 1000);
            }

        } catch (error) {
            console.error("Error de red:", error);
            toast.error("No se pudo conectar con el servidor");
            console.log("Datos que se envían:", todosLosDatosReserva);

        }
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 relative">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {formData.NombreCliente}, necesitamos que confirmes los datos.
                </h2>
                <p className="mb-2 text-gray-700"><strong>Cita para el:</strong> {fechaCapitalizada}, ingresa a las {formData.horaInicio}.</p>

                <p className="mb-6 text-gray-700"><strong>Motivo:</strong> {formData.tareas.map(t => t.nombreTipoTarea).join(", ")}.</p>


                <p className="mb-1"><strong>Contacto:</strong> {formData.TelefonoCliente}</p>
                <p className="mb-1"><strong>Nro Cédula:</strong> {formData.CedulaCliente}</p>
                <p className="mb-1"><strong>Email:</strong> {formData.EmailCliente}</p>

                <div className="mt-4 border-t pt-4">
                    <p className="mb-1"><strong>Marca:</strong> {formData.NombreMarca}</p>
                    <p className="mb-1"><strong>Modelo:</strong> {formData.NombreModelo}</p>
                    <p className="mb-1"><strong>Matrícula:</strong> {formData.NroMatricula}</p>
                    <p className="mb-1"><strong>Chasis:</strong> {formData.NroChasisVehiculo}</p>
                    <p className="mb-1"><strong>Motor:</strong> {formData.NroMotorVehiculo}</p>
                    <p className="mb-1"><strong>Año:</strong> {formData.AnoVehiculo}</p>
                    <p className="mb-1"><strong>Cilindrada:</strong> {formData.CilindradaVehiculo} cc</p>
                    <p className="mb-1"><strong>Kilometraje:</strong> {formData.KilometrajeVehiculo} km</p>
                    {formData.comentario && (
                        <p className="mt-2 italic text-gray-600">Comentario: {formData.comentario}</p>
                    )}
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                        Modificar datos
                    </button>
                    <button
                        onClick={handleSubmitReserva}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        Todo listo
                    </button>
                </div>
            </div>
        </div>
    );
}
