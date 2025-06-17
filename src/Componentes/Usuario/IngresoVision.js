import { useState, useEffect } from "react";

export default function IngresoVision({ onNext, onVolver, formData, setFormData }) {
  const [imagen, setImagen] = useState(null);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setImagen(event.target.files[0]);
    setDatos(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!imagen) {
      alert("Por favor selecciona una imagen.");
      return;
    }

    setCargando(true);
    setError(null);
    setDatos(null);

    const formDataToSend = new FormData();
    formDataToSend.append("imagen", imagen);

    try {
      const response = await fetch("http://localhost:3001/detectar-texto", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setDatos(data);
      }
    } catch (err) {
      console.error("Error al enviar la imagen:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!datos) return;

    setFormData((prev) => ({
      ...prev,
      NombreMarca: datos.marca || "",
      NombreModelo: datos.modelo || "",
      NroChasisVehiculo: datos.chasis || "",
      NroMotorVehiculo: datos.motor?.toUpperCase() || "",
      NroMatricula: datos.matricula?.toUpperCase() || "",
      CilindradaVehiculo: datos.cilindrada || "",
      AnoVehiculo: datos.anio || "",
    }));

    onVolver();
  }, [datos]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-4">
      <h2 className="text-2xl font-bold mb-3 text-blue-800">Escanear libreta</h2>
      <p className="text-sm text-gray-600 mb-6">
        Tomá una foto de la libreta del vehículo y extraeremos los datos automáticamente.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <p className="text-gray-500 mb-4">(Google Vision)</p>
        {!imagen ? <p className="text-blue-900">Selecciona una imágen de la galería para escanear.</p> : <>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={handleUpload}>
            Detectar datos
          </button></>}
      </div>

      {cargando && <p className="mt-4 text-yellow-600">Procesando imagen...</p>}
      {error && <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>}

      <div className="mt-6 flex justify-between">
        <button onClick={onVolver} className="py-2 px-4 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700">
          Volver al ingreso manual
        </button>
        <button
          onClick={onNext}
          className="py-2 px-4 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
