import { Navigate } from "react-router-dom";
import { useMecanico } from "../../MecanicoContext";

export default function RutaProtegidaMecanico({ children }) {
  const { mecanico } = useMecanico();

  if (!mecanico || !mecanico.idMecanico) {
    return <Navigate to="/mecanico/login" replace />;
  }

  return children;
}
