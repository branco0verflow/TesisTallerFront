import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import IngresoVision from "./IngresoVision";
import escanearImg from "../../Images/ScanerModee.png";
import ModalVerificarDatos from "./ModalVerificarDatos";
import VideoLibreta from "../../Video/VideoLibreta.mp4";
import { API_BASE_URL } from "../../config/apiConfig";

export default function PasoDatosVehiculo({
    formData = {
        NombreMarca: "",
        IdMarca: "",
        NombreModelo: "",
        IdModelo: "",
        NroChasisVehiculo: "",
        NroMotorVehiculo: "",
        NroMatricula: "",
        CilindradaVehiculo: "",
        AnoVehiculo: "",
        KilometrajeVehiculo: ""
    },
    setFormData = () => { },
    onNext,
    onBack,
    datos
}) {
    const [errores, setErrores] = useState({});
    const [formValido, setFormValido] = useState(false);
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [usarVision, setUsarVision] = useState(false);
    const [highlightedModeloIndex, setHighlightedModeloIndex] = useState(-1);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showModal, setShowModal] = useState(false);
    const listaRef = useRef(null);
    const [mostrarVideo, setMostrarVideo] = useState(false);
    const videoRef = useRef(null);




    const manejarTeclado = (e) => {
        if (marcas.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev + 1) % marcas.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev - 1 + marcas.length) % marcas.length);
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            e.preventDefault();
            const seleccionada = marcas[highlightedIndex];
            setFormData({
                ...formData,
                IdMarca: seleccionada.idMarca,
                NombreMarca: seleccionada.nombreMarca,
                IdModelo: "",
            });
            setMarcas([]);
            setHighlightedIndex(-1);
        } else if (e.key === "Escape") {
            setMarcas([]);
            setHighlightedIndex(-1);
        }
    };

    const manejarTecladoModelo = (e) => {
        if (modelos.length === 0) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedModeloIndex((prev) => (prev + 1) % modelos.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedModeloIndex((prev) => (prev - 1 + modelos.length) % modelos.length);
        } else if (e.key === "Enter" && highlightedModeloIndex >= 0) {
            e.preventDefault();
            const seleccionada = modelos[highlightedModeloIndex];
            setFormData({
                ...formData,
                IdModelo: seleccionada.idModelo,
                NombreModelo: seleccionada.nombreModelo,
            });
            setModelos([]);
            setHighlightedModeloIndex(-1);
        } else if (e.key === "Escape") {
            setModelos([]);
            setHighlightedModeloIndex(-1);
        }
    };



    const buscarMarcas = async (query) => {
        try {
            const res = await fetch(`${API_BASE_URL}marca/buscar/${query}`);
            if (!res.ok) throw new Error("Error al buscar marcas");
            const data = await res.json();
            setMarcas(data);
            console.log(formData);
        } catch (error) {
            console.error(error);
            toast.error("No se pudieron cargar las marcas");
        }
    };


    const buscarModelos = (nombre) => {
        if (!formData.IdMarca) {
            setModelos([]);
            return;
        }
        fetch(`${API_BASE_URL}modelo/buscar?nombre=${encodeURIComponent(nombre)}&idMarca=${formData.IdMarca}`)
            .then((res) => res.json())
            .then((data) => {
                setModelos(data);
                setHighlightedModeloIndex(-1);
            })
            .catch(() => toast.error("Error al buscar modelos"));
    };






    const validar = () => {
        const e = {};

        if (!formData.IdMarca) e.IdMarca = "Seleccione una marca";
        if (!formData.IdModelo) e.NombreModelo = "Seleccione un modelo";

        if (!formData.NroChasisVehiculo?.trim()) {
            e.NroChasisVehiculo = "Requerido";
        } else if (!/^[A-Z0-9]{17,}$/i.test(formData.NroChasisVehiculo)) {
            e.NroChasisVehiculo = "Chasis inválido (mín. 17 caracteres)";
        }

        if (!formData.NroMotorVehiculo?.trim()) {
            e.NroMotorVehiculo = "Requerido";
        } else if (!/^[A-Z0-9]{6,}$/i.test(formData.NroMotorVehiculo)) {
            e.NroMotorVehiculo = "Motor inválido (mín. 6 caracteres)";
        }

        if (!formData.NroMatricula?.trim()) {
            e.NroMatricula = "Requerido";
        } else if (!/^[A-Z0-9\s]{6,}$/i.test(formData.NroMatricula)) {
            e.NroMatricula = "Matrícula inválida (mín. 6 caracteres, puede incluir espacios)";
        }


        if (!formData.AnoVehiculo) {
            e.AnoVehiculo = "Requerido";
        } else if (formData.AnoVehiculo < 1990 || formData.AnoVehiculo > 2035) {
            e.AnoVehiculo = "Año inválido";
        }

        if (!formData.CilindradaVehiculo?.trim()) {
            e.CilindradaVehiculo = "Requerido";
        } else if (!/^\d{1,4}(\.\d{1,2})?$/.test(formData.CilindradaVehiculo)) {
            e.CilindradaVehiculo = "Cilindrada inválida";
        }

        if (!formData.KilometrajeVehiculo) {
            e.KilometrajeVehiculo = "Requerido";
        } else if (formData.KilometrajeVehiculo < 5 || formData.KilometrajeVehiculo > 1000000) {
            e.KilometrajeVehiculo = "Kilometraje inválido";
        }

        setErrores(e);
        setFormValido(Object.keys(e).length === 0);

    };

    useEffect(() => {
        validar();
    }, [formData]);



    return (
        <div className="animate-fade-in max-w-3xl mx-auto px-6 py-4">
            <Toaster position="top-right" />
            {!usarVision ? (
                <>
                    <div className="flex flex-col md:justify-between md:flex-row gap-4 mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-800">Datos del vehículo</h2>
                            <p className="text-sm text-gray-600">Completá la información del vehículo.</p>
                        </div>

                        <button
                            onClick={() => setUsarVision(true)}
                            className="flex flex-col items-center justify-center  border-purple-300 hover:bg-purple-200 transition shadow-lg rounded-xl px-4 py-3 w-full max-w-[180px] mx-auto md:mx-0"
                        >
                            <img
                                src={escanearImg}
                                alt="Escanear libreta"
                                className="w-15 h-15 mb-1 object-contain"
                            />
                            <span className="text-purple-800 font-semibold text-sm">Escanear libreta</span>
                        </button>
                    </div>


                    <div>
                        <button
                            onClick={() => setMostrarVideo(true)}
                            className="text-blue-600 hover:underline text-sm flex items-center gap-1 mb-4"
                        >
                            ¿Como ingreso estos datos?
                        </button>
                    </div>

                    <div className="grid gap-5">

                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">Marca</label>
                            <input
                                type="text"
                                placeholder="Buscar marca..."
                                value={formData.NombreMarca || ""}
                                onChange={(e) => {
                                    const nombre = e.target.value;
                                    setFormData({ ...formData, NombreMarca: nombre, IdMarca: "" });
                                    setHighlightedIndex(-1);
                                    if (nombre.length >= 1) {
                                        buscarMarcas(nombre);
                                    } else {
                                        setMarcas([]);
                                    }

                                }}
                                onKeyDown={manejarTeclado}
                                className={`w-full border p-2 rounded ${errores.IdMarca
                                    ? "border-red-500"
                                    : formData.IdMarca
                                        ? "border-green-500"
                                        : "border-gray-300"
                                    }`}
                            />


                            {marcas.length > 0 && (
                                <ul className="absolute z-50 bg-white text-blue-800 border rounded shadow mt-1 max-h-48 overflow-y-auto w-full">
                                    {marcas.map((marca, index) => (
                                        <li
                                            key={marca.idMarca}
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    IdMarca: marca.idMarca,
                                                    NombreMarca: marca.nombreMarca,
                                                    IdModelo: "",
                                                });
                                                setMarcas([]);
                                                setHighlightedIndex(-1);
                                            }}
                                            className={`px-3 py-2 cursor-pointer ${highlightedIndex === index ? "bg-blue-200" : "hover:bg-blue-100"}`}
                                        >
                                            {marca.nombreMarca}
                                        </li>
                                    ))}
                                </ul>


                            )}

                            {errores.IdMarca && (
                                <p className="text-sm text-red-500 mt-1">{errores.IdMarca}</p>
                            )}
                        </div>



                        {/* Modelo con input */}
                        <div className="relative">
                            <label className="block text-sm font-medium mb-1">Modelo</label>
                            <input
                                type="text"
                                disabled={!formData.IdMarca}
                                value={formData.NombreModelo || ""}
                                onChange={(e) => {
                                    const nombre = e.target.value;
                                    setFormData({
                                        ...formData,
                                        NombreModelo: nombre,
                                        IdModelo: "",
                                    });
                                    buscarModelos(nombre);
                                }}

                                onKeyDown={manejarTecladoModelo}
                                className={`w-full border p-2 rounded ${errores.NombreModelo
                                    ? "border-red-500"
                                    : formData.IdModelo
                                        ? "border-green-500"
                                        : "border-gray-300"
                                    }`}
                                placeholder={
                                    !formData.IdMarca
                                        ? "Seleccione una marca primero"
                                        : "Escriba para buscar"
                                }
                            />
                            {errores.NombreModelo && (
                                <p className="text-sm text-red-500 mt-1">{errores.NombreModelo}</p>
                            )}
                            {modelos.length > 0 && (
                                <ul className="border rounded bg-white mt-1 shadow-md max-h-40 overflow-auto">
                                    {modelos.map((m, index) => (
                                        <li
                                            key={m.idModelo}
                                            className={`px-3 py-1 cursor-pointer ${highlightedModeloIndex === index
                                                ? "bg-blue-200"
                                                : "hover:bg-blue-100"
                                                }`}
                                            onClick={() => {
                                                setFormData({
                                                    ...formData,
                                                    IdModelo: m.idModelo,
                                                    NombreModelo: m.nombreModelo,
                                                });
                                                setModelos([]);
                                                setHighlightedModeloIndex(-1);
                                            }}
                                        >
                                            {m.nombreModelo}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                        <div className="grid gap-5">
                            {/* Nro. de chasis */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Nro. de chasis</label>
                                <input
                                    type="text"
                                    placeholder="Ej: 93YJKZ377V04251"
                                    value={formData.NroChasisVehiculo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, NroChasisVehiculo: e.target.value.toUpperCase() })
                                    }
                                    className={`w-full border p-2 rounded ${errores.NroChasisVehiculo
                                        ? "border-red-500"
                                        : formData.NroChasisVehiculo
                                            ? "border-green-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errores.NroChasisVehiculo && (
                                    <p className="text-sm text-red-500 mt-1">{errores.NroChasisVehiculo}</p>
                                )}
                            </div>

                            {/* Nro. de MATRICULA */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Nro. de matricula</label>
                                <input
                                    type="text"
                                    placeholder="Ej: LAA 0777"
                                    value={formData.NroMatricula}

                                    onChange={(e) =>
                                        setFormData({ ...formData, NroMatricula: e.target.value.toUpperCase() })

                                    }
                                    className={`w-full border p-2 rounded ${errores.NroMatricula
                                        ? "border-red-500"
                                        : formData.NroMatricula
                                            ? "border-green-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errores.NroMatricula && (
                                    <p className="text-sm text-red-500 mt-1">{errores.NroMatricula}</p>
                                )}
                            </div>

                            {/* Nro. de motor */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Nro. de motor</label>
                                <input
                                    type="text"
                                    placeholder="Ej: ABC123456"
                                    value={formData.NroMotorVehiculo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, NroMotorVehiculo: e.target.value.toUpperCase() })
                                    }
                                    className={`w-full border p-2 rounded ${errores.NroMotorVehiculo
                                        ? "border-red-500"
                                        : formData.NroMotorVehiculo
                                            ? "border-green-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errores.NroMotorVehiculo && (
                                    <p className="text-sm text-red-500 mt-1">{errores.NroMotorVehiculo}</p>
                                )}
                            </div>

                            {/* Año */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Año</label>
                                <input
                                    type="number"
                                    placeholder="Ej: 2021"
                                    value={formData.AnoVehiculo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, AnoVehiculo: e.target.value })
                                    }
                                    className={`w-full border p-2 rounded ${errores.AnoVehiculo
                                        ? "border-red-500"
                                        : formData.AnoVehiculo
                                            ? "border-green-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errores.AnoVehiculo && (
                                    <p className="text-sm text-red-500 mt-1">{errores.AnoVehiculo}</p>
                                )}
                            </div>

                            {/* Cilindrada */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Cilindrada</label>
                                <input
                                    type="text"
                                    placeholder="Ej: 1.6"
                                    value={formData.CilindradaVehiculo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, CilindradaVehiculo: e.target.value })
                                    }
                                    className={`w-full border p-2 rounded ${errores.CilindradaVehiculo
                                        ? "border-red-500"
                                        : formData.CilindradaVehiculo
                                            ? "border-green-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errores.CilindradaVehiculo && (
                                    <p className="text-sm text-red-500 mt-1">{errores.CilindradaVehiculo}</p>
                                )}
                            </div>

                            {/* Kilometraje */}
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Kilometraje actual</label>
                                <input
                                    type="number"
                                    placeholder="Ej: 85000"
                                    value={formData.KilometrajeVehiculo}
                                    onChange={(e) =>
                                        setFormData({ ...formData, KilometrajeVehiculo: e.target.value })
                                    }
                                    className={`w-full border p-2 rounded ${errores.KilometrajeVehiculo
                                        ? "border-red-500"
                                        : formData.KilometrajeVehiculo
                                            ? "border-green-500"
                                            : "border-gray-300"
                                        }`}
                                />
                                {errores.KilometrajeVehiculo && (
                                    <p className="text-sm text-red-500 mt-1">{errores.KilometrajeVehiculo}</p>
                                )}
                            </div>
                        </div>


                        {/* Botones */}
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={onBack}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 px-4 font-semibold"
                            >
                                Atrás
                            </button>
                            <div>
                                <button
                                    disabled={!formValido}
                                    onClick={() => {
                                        if (formValido) {
                                            setShowModal(true);
                                        } else {
                                            toast.error("Corregí los campos antes de continuar");
                                        }
                                    }}
                                    className={`py-2 px-4 rounded text-white font-semibold transition ${formValido
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Verificar datos
                                </button>

                                {showModal && (
                                    <ModalVerificarDatos
                                        formData={formData}
                                        onClose={() => setShowModal(false)}
                                        onConfirm={() => {
                                            setShowModal(false);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <IngresoVision onVolver={() => setUsarVision(false)} onNext={onNext} formData={formData} setFormData={setFormData} />
            )}


            {mostrarVideo && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full mx-4 flex flex-col overflow-hidden animate-fade-in">
                        {/* Encabezado */}
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-800 mb-1">1. Toma tu libreta del vehículo</h2>
                            <p className="text-gray-700">2. Copia los datos que se indican</p>
                        </div>

                        {/* Video */}
                        <div className="p-4">
                            <video
                                ref={(el) => {
                                    if (el && el.paused && el.readyState >= 3) el.play();
                                    videoRef.current = el;
                                }}
                                autoPlay
                                muted
                                playsInline
                                onEnded={() => videoRef.current && videoRef.current.pause()}
                                className="w-full rounded"
                            >
                                <source src={VideoLibreta} type="video/mp4" />
                                Tu navegador no soporta video HTML5.
                            </video>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-between items-center px-6 py-4 border-t flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setMostrarVideo(false);
                                    setUsarVision(true);
                                }}
                                className="bg-purple-700 text-white px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg font-semibold transition"
                            >
                                Quiero escanear los datos
                            </button>
                            <button
                                onClick={() => setMostrarVideo(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}





        </div>
    );
}
