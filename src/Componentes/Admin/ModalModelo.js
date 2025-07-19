import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function ModalModelo({ idModelo, isOpen, onClose, setModeloModificado, modo }) {
  const [loading, setLoading] = useState(true);
  const [modelo, setModelo] = useState(null);
  const [marcas, setMarcas] = useState([]);

  let tituloModal = "Modificar Modelo";
  if (modo === "view") tituloModal = "Ver Modelo";
  else if (modo === "create") tituloModal = "Agregar Modelo";

  useEffect(() => {
    if (modo === "create") {
      setModelo({ nombreModelo: "" });
      setLoading(false);
    } else if (idModelo && isOpen) {
      fetch(`http://localhost:8081/sgc/api/v1/modelo/${idModelo}`)
        .then(res => res.json())
        .then(data => {
          setModelo({
            ...data,
            idMarca: data.marca?.idMarca || ""
          });
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener el modelo:", error);
          setLoading(false);
        });
    }
  }, [idModelo, isOpen, modo]);

  useEffect(() => {
    fetch(`http://localhost:8081/sgc/api/v1/marca`)
      .then(res => res.json())
      .then(data => setMarcas(data))
      .catch(err => console.error("Error al obtener marcas:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModelo(prev => ({ ...prev, [name]: value }));
  };

  const crearModelo = () => {
    console.log("modelo: ", modelo)
    fetch(`http://localhost:8081/sgc/api/v1/modelo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modelo),

    })
      .then(res => {
        if (res.ok) {
          toast.success("Modelo creado");
          setModeloModificado(true);
          onClose();
        } else {
          toast.error("Error al crear el modelo");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  const modificarModelo = () => {
    fetch(`http://localhost:8081/sgc/api/v1/modelo/${idModelo}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modelo),
    })
      .then(res => {
        console.log("Respuesta del servidor:", res);
        if (res.ok) {
          toast.success("Modelo actualizado");
          setModeloModificado(true);
          onClose();
        } else {
          toast.error("Error al modificar el modelo");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  const eliminarModelo = () => {
    if (!window.confirm("¿Estás seguro de eliminar este modelo?")) return;

    fetch(`http://localhost:8081/sgc/api/v1/modelo/${idModelo}`, {
      method: "DELETE",
    })
      .then(res => {
        if (res.ok) {
          toast.success("Modelo eliminado");
          setModeloModificado(true);
          onClose();
        } else {
          toast.error("No se pudo eliminar el modelo");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  if (!isOpen) return null;
  if (loading) return <div className="p-4">Cargando modelo...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{tituloModal}</h2>

        <label className="block mb-4">
          Nombre:
          <input
            name="nombreModelo"
            value={modelo?.nombreModelo || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1 mt-1 rounded"
            required
            disabled={modo === "view"}
          />
        </label>

        <label className="block mb-4">
          Marca:
          {modo === "view" ? (
            <p className="mb-4">{modelo?.marca?.nombreMarca}</p>
          ) : (
            <select
              name="idMarca"
              value={modelo?.idMarca || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 mt-1 rounded"
              disabled={modo === "view"}
              required
            >
              <option value="">Selecciona una marca</option>
              {marcas.map((marca) => (
                <option key={marca.idMarca} value={marca.idMarca}>
                  {marca.nombreMarca}
                </option>
              ))}
            </select>)}
        </label>

        <div className="flex justify-between items-center mt-6">
          {modo === "edit" && (
            <button
              onClick={eliminarModelo}
              className="p-2 rounded-full bg-red-400 hover:bg-red-600 text-white transition"
              title="Eliminar Modelo"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}

          <div className="flex space-x-2">
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancelar
            </button>
            {modo !== "view" && (
              <button
                onClick={modo === "edit" ? modificarModelo : crearModelo}
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