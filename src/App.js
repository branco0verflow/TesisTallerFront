import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import VisorDeTareas from "./Componentes/Admin/VisorDeTareas";
import UHome from "./Componentes/Usuario/UHome";
import CrearReserva from "./Componentes/Usuario/CrearReserva";
import PasoDatosAgenda from "./Componentes/Usuario/PasoDatosAgenda";


function App() {
  return (
    <Router>
      

      <Routes>
        <Route path="/" element={<UHome />}/>
        <Route path="/crearReserva" element={<CrearReserva />}/>

        
        <Route path="/AVisordeTarea" element={<VisorDeTareas />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>


     
    </Router>
  );
}

export default App;
