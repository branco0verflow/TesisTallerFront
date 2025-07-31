import React from "react";
import { Link } from "react-router-dom";
import MenuNavBar from "./MenuNavBar";
import LogosBar from "./LogosBar";
import Footer from "./Footer";
import MigasDePan from "./MigasDePan";
import VideoPrincipal from "../../Video/videoPrincipal.mp4";
import bgSeguimiento from '../../Images/HomeSeguimiento2.png';

export default function Home() {
    return (
        <div>
            <MenuNavBar />


            <div className="relative w-full h-[55vh] overflow-hidden">

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/poster.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                >

                    <source src={VideoPrincipal} type="video/mp4" />
                    Tu navegador no soporta video HTML5.
                </video>

                {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />*/}
                <div className="absolute inset-0 bg-black/70 z-10" />

                {/* 🧾 Contenido encima del video */}
                <div className="relative z-20 flex flex-col justify-center items-center h-full px-6 text-center text-white">
                    <h1 className="animate-fade-in-up text-4xl font-extrabold font-sans">
                        Solicitá tu servicio mecánico en 3 pasos
                    </h1>
                    <p className="animate-fade-in-up mt-4 max-w-xl text-lg text-gray-200">
                        Elegí el servicio, seleccioná el horario y recibí confirmación sin demoras.
                    </p>
                    <Link
                        to="/crearReserva"
                        className="mt-6 inline-block border border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-3 px-6 rounded transition"
                    >
                        Reserva rápida
                    </Link>
                    <p className="animate-fade-in-up text-sm text-gray-300 mt-4 max-w-md">
                        Tu próximo turno en el taller, a un clic.
                    </p>
                </div>
            </div>

            <LogosBar />

            <section
                className="relative bg-cover bg-center bg-no-repeat py-16 px-6 text-white text-center"
                style={{
                    backgroundImage: `url(${bgSeguimiento})`,
                }}
            >
                {/* Overlay oscuro para mejorar legibilidad */}
                <div className="absolute inset-0 z-0" />

                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    {/* Título con entrada animada */}
                    <h2 className="animate-fade-in-up text-3xl sm:text-4xl font-extrabold tracking-wide leading-tight text-gray-600 drop-shadow-md">
                        Hacé <span className="text-sky-800">seguimiento</span> de tu cita
                    </h2>

                    {/* Párrafo con delay */}
                    <p className="text-gray-600 text-base sm:text-lg drop-shadow-sm animate-fade-in-up delay-150">
                        Consultá el estado de tu reserva, cancelá o agendá un nuevo turno.
                    </p>

                    {/* Botón con delay extra */}
                    <Link
                        to="/seguimiento"
                        className="inline-block animate-bounce bg-sky-200 text-sky-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-100 transition transform duration-200"
                    >
                        Mis Reservas
                    </Link>
                </div>
            </section>







            <div>
                <Footer />
            </div>
        </div >
    );
}
