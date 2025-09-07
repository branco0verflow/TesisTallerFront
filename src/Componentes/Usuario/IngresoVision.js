import { useState, useEffect } from "react";

export default function IngresoVision({ onNext, onVolver, formData, setFormData }) {
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImagen(file);
    setPreviewUrl(URL.createObjectURL(file));
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
      const response = await fetch("https://googlevisiontesis.onrender.com", {
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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-800">Escanear libreta</h2>
      <p className="text-sm text-gray-600 mb-4">
        Tomá una foto o seleccioná una imagen de la libreta del vehículo. Extraeremos los datos automáticamente.
      </p>

      {/* Input oculto con botón custom */}
      <label className="block w-full mb-4">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id="fotoInput"
        />
        <span className="cursor-pointer inline-block w-full text-center bg-white border border-blue-500 text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-50 transition">
          {imagen ? "Cambiar imagen" : "Tomar o subir una foto"}
        </span>
      </label>

      {/* Previsualización de la imagen */}
      {previewUrl && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Imagen seleccionada:</p>
          <img
            src={previewUrl}
            alt="Previsualización"
            className="max-h-64 mx-auto rounded border border-gray-300 shadow"
          />
        </div>
      )}

      {/* Zona de acción */}
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <p className="text-gray-500 mb-4">(Usando Google Vision)</p>
        {!imagen ? (
          <p className="text-blue-900">Aún no seleccionaste una imagen.</p>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            onClick={handleUpload}
          >
            Detectar datos
          </button>
        )}
      </div>

      {cargando && <p className="mt-4 text-yellow-600">Procesando imagen...</p>}
      {error && <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>}

      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={onVolver}
          className="w-full sm:w-auto py-2 px-4 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700"
        >
          Volver al ingreso manual
        </button>
      </div>
    </div>
  );
}
