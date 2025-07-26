import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../AdminContext";
import logoLogin from '../../Images/LogoTallerLogin.png';
import MenuNavBar from "../Usuario/MenuNavBar";
import { API_BASE_URL } from "../../config/apiConfig";

function LoginAdmin() {
  const [emailAdmin, setEmail] = useState("");
  const [passwordAdmin, setPassword] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch(`${API_BASE_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: emailAdmin,
          password: passwordAdmin,
        }),
        credentials: "include",
      });

      if (!loginResponse.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const meResponse = await fetch(`${API_BASE_URL}admin/me`, {
        method: "GET",
        credentials: "include",
      });

      const text = await meResponse.text();

      if (!meResponse.ok) {
        alert("Error al obtener datos del administrador");
        return;
      }

      const data = JSON.parse(text);

      login({ idAdmin: data.idAdmin });
      navigate("/AVisordeTarea");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error en la conexión");
    }
  };


  return (
    <>
      <MenuNavBar />
      <div className="p-5 max-w-sm mx-auto mt-10">

        <div className="animate-fade-in flex justify-center h-20">
          <img src={logoLogin} alt="Logo de la empresa" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-2xl  text-gray-700 mb-4 mt-5 flex justify-center">Administrador</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={emailAdmin}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="animate-fade-in w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="password"
            value={passwordAdmin}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="animate-fade-in w-full mb-4 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="animate-fade-in bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="animate-fade-in flex justify-center items-center mt-5 mb-3">
          <button className="text-blue-900" onClick={() => navigate("/mecanico/login")}>¿Eres mecánico?</button>
        </div>
      </div>
    </>

  );
}

export default LoginAdmin;