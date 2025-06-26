import { useState } from "react";
import PasoDatosPersonales from "./PasoDatosPersonales";
import PasoDatosVehiculo from "./PasoDatosVehiculo";
import PasoDatosAgenda from "./PasoDatosAgenda";
import MigasDePan from "./MigasDePan";
import MenuNavBar from "./MenuNavBar";
import Footer from "./Footer";
import FullScreen from "../FullScreen";
import fullScreen1 from "../../Images/fulScreen3.png";
import fullScreen2 from "../../Images/fulScreen1.png";
import fullScreen3 from "../../Images/fulScreen2.png";

export default function CrearReserva() {
    const [pasoActual, setPasoActual] = useState(1);
    const [formData, setFormData] = useState({
        NombreCliente: "",
        ApellidoCliente: "",
        CedulaCliente: "",
        EmailCliente: "",
        TelefonoCliente: "",
        DireccionCliente: "",
        IdMarca: "",
        NombreMarca: "",
        IdModelo: "",
        NombreModelo: "",
        NroChasisVehiculo: "",
        NroMatricula: "",
        NroMotorVehiculo: "",
        AnoVehiculo: "",
        CilindradaVehiculo: "",
        KilometrajeVehiculo: "",
        tareas: [],
        fechaSeleccionada: null,
        IdMecanico: "",
        horaInicio: "",
        horaFin: "",
        comentario: ""

    });


    const handleNext = () => setPasoActual((prev) => prev + 1);
    const handleBack = () => setPasoActual((prev) => prev - 1);

    const backgrounds = {1: fullScreen1, 2: fullScreen2, 3: fullScreen3 };




    return (
        <div>
            <MenuNavBar />
            <FullScreen background={backgrounds[pasoActual]}>

                <div className="w-full px-4">

                    <MigasDePan paso={pasoActual} />

                    {pasoActual === 1 && (
                        <PasoDatosAgenda formData={formData} setFormData={setFormData} onNext={handleNext} />
                    )}
                    {pasoActual === 2 && (
                        <PasoDatosPersonales formData={formData} setFormData={setFormData} onBack={handleBack} onNext={handleNext} />
                    )}
                    {pasoActual === 3 && (
                        <PasoDatosVehiculo formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
                    )}
                    
                </div>

            </FullScreen>

            <Footer />
        </div>

    );
}
