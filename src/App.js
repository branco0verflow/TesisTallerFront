import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import VisorDeTareas from "./Componentes/Admin/VisorDeTareas";
import UHome from "./Componentes/Usuario/UHome";
import CrearReserva from "./Componentes/Usuario/CrearReserva";
import PasoDatosAgenda from "./Componentes/Usuario/PasoDatosAgenda";
import SobreNosotros from "./Componentes/SobreNosotros";
import Terminos from "./Componentes/Terminos";
import PoliticaPrivacidad from "./Componentes/PoliticaDePrivacidad";
import Contacto from "./Componentes/Contacto";
import ScrollToTop from "./Componentes/ScrollToTop";
import LoginAdmin from "./Componentes/Admin/LoginAdmin";
import RutaProtegida from "./Componentes/Admin/RutaProtegidaAdmin";
import RutaProtegidaMecanico from "./Componentes/Mecanico/RutaProtegidaMecanico";
import VisorTareasMecanico from "./Componentes/Mecanico/VisorTareasMecanico";
import LoginMecanico from "./Componentes/Mecanico/LoginMecanico";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/mecanico/login" element={<LoginMecanico />} />
        <Route path="/" element={<UHome />} />
        <Route path="/crearReserva" element={<CrearReserva />} />
        <Route path="/sobreNosotros" element={<SobreNosotros />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/politicaDePrivacidad" element={<PoliticaPrivacidad />} />

        <Route
          path="/AVisordeTarea"
          element={
            <RutaProtegida>
              <VisorDeTareas />
            </RutaProtegida>
          }
        />

        <Route
          path="/mecanico/tareas"
          element={
            <RutaProtegidaMecanico>
              <VisorTareasMecanico />
            </RutaProtegidaMecanico>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
