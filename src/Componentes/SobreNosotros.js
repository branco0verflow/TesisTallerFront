import MenuNavBar from "./Usuario/MenuNavBar";
import Footer from "./Usuario/Footer";

export default function SobreNosotros() {
    return (
    <div className="flex flex-col min-h-screen">
      <MenuNavBar />

      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto text-gray-800">
        <h1 className="text-4xl font-bold text-gray-700 mb-6">Sobre Nosotros</h1>

        <section className="space-y-6 text-md">
          <p>
            Somos un taller mecánico con 52 años de experiencia ofreciendo servicios de mantenimiento y reparación de vehículos. Nuestra misión es brindar soluciones confiables, rápidas y a precios justos.
          </p>

          <p>
            Trabajamos con marcas reconocidas internacionalmente como Citröen, Peugeot, Renault, Nissan, Subaru, BYD y Riddara.
          </p>

          <p>
            Nuestro equipo está compuesto por profesionales apasionados por la mecánica automotriz, comprometidos con la excelencia y la atención personalizada.
          </p>

          <p>
            Contamos con tecnología de última generación para diagnósticos precisos y un sistema de gestión que nos permite organizar turnos, tareas y clientes de forma eficiente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Nuestra Visión</h2>
              <p>Ser líderes en servicios mecánicos en la región, integrando innovación, tecnología y confianza.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Nuestros Valores</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Transparencia</li>
                <li>Responsabilidad</li>
                <li>Calidad</li>
                <li>Respeto al cliente</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>);
}