import { Navigate } from "react-router-dom";
import { useAdmin } from "../../AdminContext";

export default function RutaProtegidaAdmin({ children }) {
  const { admin } = useAdmin();

  if (!admin || !admin.idAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
