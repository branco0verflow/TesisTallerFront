import React, { useState } from "react";
import MenuNavBar from "./Usuario/MenuNavBar";
import Footer from "./Usuario/Footer";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí podrías integrar una API para enviar los datos
    alert("¡Gracias por contactarnos!");
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MenuNavBar />

      <main className="flex-grow px-6 py-12 max-w-3xl mx-auto text-gray-800">
        <h1 className="text-4xl font-bold text-gray-700 mb-6">Contacto</h1>
        <p className="mb-8 text-gray-600">
          ¿Tenés alguna consulta o querés agendar un turno? ¡Escribinos y te
          responderemos a la brevedad!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              rows="5"
              value={formData.mensaje}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-medium px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Enviar mensaje
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
