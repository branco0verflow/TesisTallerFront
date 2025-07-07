import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMecanico } from "../../MecanicoContext";
import logoLogin from '../../Images/LogoTallerLogin.png';
import MenuNavBar from "../Usuario/MenuNavBar";

function LoginMecanico() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useMecanico();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await fetch("http://localhost:8081/sgc/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
        credentials: "include",
      });

      if (!loginResponse.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const meResponse = await fetch("http://localhost:8081/sgc/api/v1/mecanico/me", {
        method: "GET",
        credentials: "include",
      });

      const text = await meResponse.text();

      if (!meResponse.ok) {
        alert("Error al obtener datos del mecánico");
        return;
      }

      const data = JSON.parse(text);
      login({ idMecanico: data.idMecanico });
      navigate("/mecanico/tareas");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error en la conexión");
    }
  };

  return (
    <>
      <MenuNavBar />
      <div className="p-5 max-w-sm mx-auto mt-10">
        <div className="flex justify-center h-20">
          <img src={logoLogin} alt="Logo de la empresa" className="h-16 w-auto object-contain" />
        </div>

        <h2 className="text-2xl text-gray-700 mb-4 mt-5 flex justify-center">Mecánico</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginMecanico;
