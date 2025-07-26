import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ModalMarca({ idMarca, isOpen, onClose, setMarcaModificada, modo }) {
  const [loading, setLoading] = useState(true);
  const [marca, setMarca] = useState(null);

  let tituloModal = "Modificar Marca";
  if (modo === "view") tituloModal = "Ver Marca";
  else if (modo === "create") tituloModal = "Agregar Marca";

  useEffect(() => {
    if (modo === "create") {
      setMarca({ nombreMarca: "" });
      setLoading(false);
    } else if (idMarca && isOpen) {
      fetch(`${API_BASE_URL}marca/${idMarca}`)
        .then(res => res.json())
        .then(data => {
          setMarca(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener la marca:", error);
          setLoading(false);
        });
    }
  }, [idMarca, isOpen, modo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarca(prev => ({ ...prev, [name]: value }));
  };

  const crearMarca = () => {
    fetch(`${API_BASE_URL}marca`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(marca),
    })
      .then(res => {
        if (res.ok) {
          toast.success("Marca creada");
          setMarcaModificada(true);
          onClose();
        } else {
          toast.error("Error al crear la marca");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  const modificarMarca = () => {
    fetch(`${API_BASE_URL}marca/${idMarca}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(marca),
    })
      .then(res => {
        if (res.ok) {
          toast.success("Marca actualizada");
          setMarcaModificada(true);
          onClose();
        } else {
          toast.error("Error al modificar la marca");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  if (!isOpen) return null;
  if (loading) return <div className="p-4">Cargando marca...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{tituloModal}</h2>

        <label className="block mb-4">
          Nombre:
          <input
            name="nombreMarca"
            value={marca?.nombreMarca || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1 mt-1 rounded"
            required
            disabled={modo === "view"}
          />
        </label>

        <div className="flex justify-between items-center mt-6">

          <div className="flex space-x-2">
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancelar
            </button>
            {modo !== "view" && (
              <button
                onClick={modo === "edit" ? modificarMarca : crearMarca}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {modo === "edit" ? "Guardar" : "Crear"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}