export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 border-t">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Taller Videsol. Todos los derechos reservados.
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="/politicaDePrivacidad" className="hover:underline">Política de privacidad</a>
          <a href="/terminos" className="hover:underline">Términos</a>
          <a href="/contacto" className="hover:underline">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
