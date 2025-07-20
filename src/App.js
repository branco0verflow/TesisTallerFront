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
import Seguimiento from "./Componentes/Usuario/Seguimientos";
import CrearReservaSeguimiento from "./Componentes/Usuario/CrearReservaSeguimiento";
import ListaMecanicos from "./Componentes/Admin/ListaMecanicos";
import ListaAdmin from "./Componentes/Admin/ListaAdmin";
import ListaMarcas from "./Componentes/Admin/ListaMarcas";
import ListaModelos from "./Componentes/Admin/ListaModelos";
import ListaTipoTarea from "./Componentes/Admin/ListaTipoTarea";
import CrearRetenes from "./Componentes/Admin/FormularioTareasReten";
import ExcepcionesHorarias from "./Componentes/Admin/GestionExcepcionesHorarias";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<UHome />} />
        <Route path="/crearReserva" element={<CrearReserva />} />
        <Route path="/sobreNosotros" element={<SobreNosotros />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/politicaDePrivacidad" element={<PoliticaPrivacidad />} />

        {/* Login */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/mecanico/login" element={<LoginMecanico />} />

        <Route path="/seguimiento" element={<Seguimiento />} />
        <Route path="/seguimiento/crear-reserva" element={<CrearReservaSeguimiento />} />

        {/* Rutas protegidas */}
        <Route
          path="/AVisordeTarea"
          element={
            <RutaProtegida>
              <VisorDeTareas />
            </RutaProtegida>
          }
        />
        <Route
          path="/ListaAdmin"
          element={
            <RutaProtegida>
              <ListaAdmin />
            </RutaProtegida>
          }
        />

        <Route
          path="/ListaMarcas"
          element={
            <RutaProtegida>
              <ListaMarcas />
            </RutaProtegida>
          }
        />

        <Route
          path="/ListaModelos"
          element={
            <RutaProtegida>
              <ListaModelos />
            </RutaProtegida>
          }
        />

        <Route
          path="/ListaTipoTarea"
          element={
            <RutaProtegida>
              <ListaTipoTarea />
            </RutaProtegida>
          }
        />

        <Route
          path="/ListaMecanicos"
          element={
            <RutaProtegida>
              <ListaMecanicos />
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
        <Route
          path="/crear-retenes"
          element={
            <RutaProtegida>
              <CrearRetenes />
            </RutaProtegida>
          }
        />
        <Route
          path="/excepciones-no-laborables"
          element={
            <RutaProtegida>
              <ExcepcionesHorarias />
            </RutaProtegida>
          }
        />

        {/* Redirección 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
