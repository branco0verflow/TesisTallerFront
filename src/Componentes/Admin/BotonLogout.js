import { useAdmin } from "../../AdminContext";
import { useMecanico } from "../../MecanicoContext";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { API_BASE_URL } from "../../config/apiConfig";

function BotonLogout({ tipoUsuario = "admin" }) {
  const navigate = useNavigate();
  const { logout: logoutAdmin } = useAdmin();
  const { logout: logoutMecanico } = useMecanico();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error cerrando sesión en backend", error);
    }

    if (tipoUsuario === "admin") {
      logoutAdmin();
      navigate("/admin/login");
    } else if (tipoUsuario === "mecanico") {
      logoutMecanico();
      navigate("/mecanico/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full shadow hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      <span className="text-sm font-medium">Cerrar sesión</span>
    </button>
  );
}

export default BotonLogout;
