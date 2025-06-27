import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import VisorDeTareas from "./Componentes/Admin/VisorDeTareas";
import UHome from "./Componentes/Usuario/UHome";
import CrearReserva from "./Componentes/Usuario/CrearReserva";
import PasoDatosAgenda from "./Componentes/Usuario/PasoDatosAgenda";
import SobreNosotros from "./Componentes/SobreNosotros";
import Terminos from "./Componentes/Terminos";
import PoliticaPrivacidad from "./Componentes/PoliticaDePrivacidad";
import Contacto from "./Componentes/Contacto";

function App() {
  return (
    <Router>
      

      <Routes>
        <Route path="/" element={<UHome />}/>
        <Route path="/crearReserva" element={<CrearReserva />}/>

        <Route path="/sobreNosotros" element={<SobreNosotros />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/politicaDePrivacidad" element={<PoliticaPrivacidad />} />
        <Route path="/AVisordeTarea" element={<VisorDeTareas />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>


     
    </Router>
  );
}

export default App;
