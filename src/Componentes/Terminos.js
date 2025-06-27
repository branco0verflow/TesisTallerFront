import MenuNavBar from "./Usuario/MenuNavBar";
import Footer from "./Usuario/Footer";

export default function Terminos() {
    return (
    <div className="flex flex-col min-h-screen">
      <MenuNavBar />

      <main className="flex-grow px-6 py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Términos y Condiciones</h1>

        <section className="space-y-6 text-gray-700 text-sm">
          <p>
            Bienvenido a nuestro sitio web. Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones. Te recomendamos leerlos cuidadosamente.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">1. Uso del sitio</h2>
          <p>
            El uso de este sitio está sujeto a las leyes vigentes. No se permite usar el sitio para fines ilegales o no autorizados.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">2. Propiedad intelectual</h2>
          <p>
            Todo el contenido del sitio, incluyendo textos, imágenes y logotipos, es propiedad de la empresa y está protegido por derechos de autor.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">3. Responsabilidad</h2>
          <p>
            No nos hacemos responsables por daños derivados del uso o la imposibilidad de uso del sitio.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">4. Cambios</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos una vez publicados.
          </p>

          <p className="italic text-xs mt-6">Última actualización: 23 de junio de 2025</p>
        </section>
      </main>
      <Footer />
    </div>);
}