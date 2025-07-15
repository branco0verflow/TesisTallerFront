import React from "react";
import { Link } from "react-router-dom";
import MenuNavBar from "./MenuNavBar";
import LogosBar from "./LogosBar";
import Footer from "./Footer";
import MigasDePan from "./MigasDePan";
import VideoPrincipal from "../../Video/videoPrincipal.mp4";

export default function Home() {
    return (
        <div>
            <MenuNavBar />


            <div className="relative w-full h-[55vh] overflow-hidden shadow-lg">

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={VideoPrincipal} type="video/mp4" />
                    Tu navegador no soporta video HTML5.
                </video>

                {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />*/}
                <div className="absolute inset-0 bg-black/70 z-10" />

                {/* 🧾 Contenido encima del video */}
                <div className="relative z-20 flex flex-col justify-center items-center h-full px-6 text-center text-white">
                    <h1 className="text-4xl font-extrabold font-sans">
                        Solicitá tu servicio mecánico en 3 pasos
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-gray-200">
                        Elegí el servicio, seleccioná el horario y recibí confirmación sin demoras.
                    </p>
                    <Link
                        to="/crearReserva"
                        className="mt-6 inline-block border border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-3 px-6 rounded transition"
                    >
                        Reserva rápida
                    </Link>
                    <p className="text-sm text-gray-300 mt-4 max-w-md">
                        Tu próximo turno en el taller, a un clic.
                    </p>
                </div>
            </div>

            <LogosBar />

            <div>

                <Link
                    to="/seguimiento"
                    className="mt-6 inline-block border border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-3 px-6 rounded transition"
                >
                    Seguimientos
                </Link>
            </div>


            <div>
                <Footer />
            </div>
        </div>
    );
}
