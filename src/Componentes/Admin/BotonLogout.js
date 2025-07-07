import { useAdmin } from "../../AdminContext";
import { useNavigate } from "react-router-dom";

function BotonLogout() {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 👉 Opción para destruir la sesión en backend (opcional pero recomendable)
      await fetch("http://localhost:8081/sgc/api/v1/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error cerrando sesión en el backend", error);
    }

    // 👉 Limpieza del contexto y redirección
    logout(); // limpia el contexto y localStorage
    navigate("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:underline mt-4"
    >
      Cerrar sesión
    </button>
  );
}

export default BotonLogout;
