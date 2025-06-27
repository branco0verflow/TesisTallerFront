import React from "react";
import MenuNavBar from "./Usuario/MenuNavBar";
import Footer from "./Usuario/Footer";

export default function PoliticaPrivacidad() {
  return (
    <div className="flex flex-col min-h-screen">
      <MenuNavBar />

      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto text-gray-800">
        <h1 className="text-4xl font-bold text-gray-700 mb-6">Política de Privacidad</h1>

        <section className="space-y-6 text-md leading-relaxed">
          <p>
            En nuestro taller mecánico, valoramos la privacidad de nuestros clientes y usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">1. Información que recopilamos</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Nombre y apellido</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>Datos del vehículo</li>
            <li>Historial de reservas o tareas</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-700">2. Cómo usamos tus datos</h2>
          <p>Utilizamos la información personal únicamente para:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Agendar turnos</li>
            <li>Gestionar tareas y servicios</li>
            <li>Enviar notificaciones sobre el estado de tu vehículo</li>
            <li>Ofrecer soporte o asistencia</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-700">3. Protección de datos</h2>
          <p>
            Implementamos medidas de seguridad para evitar el acceso no autorizado, modificación o destrucción de tu información. Los datos no son compartidos con terceros sin tu consentimiento.
          </p>

          <h2 className="text-xl font-semibold text-gray-700">4. Derechos del usuario</h2>
          <p>Podés:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Acceder a tus datos personales</li>
            <li>Solicitar correcciones o actualizaciones</li>
            <li>Solicitar la eliminación de tus datos</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-700">5. Cambios en esta política</h2>
          <p>
            Nos reservamos el derecho de modificar esta política en cualquier momento. Se notificará a los usuarios mediante el sitio web en caso de cambios importantes.
          </p>

          <p className="text-sm text-gray-500">
            Última actualización: 26 de junio de 2025
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
