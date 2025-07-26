import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/solid";
import { API_BASE_URL } from "../../config/apiConfig";

export default function ModalTipoTarea({ idTipoTarea, isOpen, onClose, setTipoTareaModificada, modo }) {
  const [loading, setLoading] = useState(true);
  const [tipoTarea, setTipoTarea] = useState(null);

  let tituloModal = "Modificar Tipo de Tarea";
  if (modo === "view") tituloModal = "Ver Tipo de Tarea";
  else if (modo === "create") tituloModal = "Agregar Tipo de Tarea";

  useEffect(() => {
    if (modo === "create") {
      setTipoTarea({ nombreTipoTarea: "" });
      setLoading(false);
    } else if (idTipoTarea && isOpen) {
      fetch(`${API_BASE_URL}tipotarea/${idTipoTarea}`)
        .then(res => res.json())
        .then(data => {
          setTipoTarea(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al obtener el Tipo de Tarea:", error);
          setLoading(false);
        });
    }
  }, [idTipoTarea, isOpen, modo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTipoTarea(prev => ({ ...prev, [name]: value }));
  };

  const crearTipoTarea = () => {
    fetch(`${API_BASE_URL}tipotarea`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tipoTarea),
    })
      .then(res => {
        if (res.ok) {
          toast.success("Tipo de Tarea creada");
          setTipoTareaModificada(true);
          onClose();
        } else {
          toast.error("Error al crear el Tipo de Tarea");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  const modificarTipoTarea = () => {
    fetch(`${API_BASE_URL}tipotarea/${idTipoTarea}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tipoTarea),
    })
      .then(res => {
        if (res.ok) {
          toast.success("Tipo de Tarea actualizada");
          setTipoTareaModificada(true);
          onClose();
        } else {
          toast.error("Error al modificar el Tipo de Tarea");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  const eliminarTipoTarea = () => {
    if (!window.confirm("¿Estás seguro de eliminar este Tipo de Tarea?")) return;

    fetch(`${API_BASE_URL}tipotarea/${idTipoTarea}`, {
      method: "DELETE",
    })
      .then(res => {
        if (res.ok) {
          toast.success("Tipo de Tarea eliminada");
          setTipoTareaModificada(true);
          onClose();
        } else {
          toast.error("No se pudo eliminar el Tipo de Tarea");
        }
      })
      .catch(err => {
        console.error("Error en el servidor:", err);
        toast.error("Error de red");
      });
  };

  if (!isOpen) return null;
  if (loading) return <div className="p-4">Cargando Tipo de Tarea...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{tituloModal}</h2>

        <label className="block mb-4">
          Nombre:
          <input
            name="nombreTipoTarea"
            value={tipoTarea?.nombreTipoTarea || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1 mt-1 rounded"
            required
            disabled={modo === "view"}
          />
        </label>

        <label className="block mb-4">
          Minutos:
          <input
            name="tiempoMinutosTipoTarea"
            value={tipoTarea?.tiempoMinutosTipoTarea || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1 mt-1 rounded"
            required
            disabled={modo === "view"}
          />
        </label>

        <div className="flex justify-between items-center mt-6">
          {modo === "edit" && (
            <button
              onClick={eliminarTipoTarea}
              className="p-2 rounded-full bg-red-400 hover:bg-red-600 text-white transition"
              title="Eliminar Tipo de Tarea"
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
                onClick={modo === "edit" ? modificarTipoTarea : crearTipoTarea}
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