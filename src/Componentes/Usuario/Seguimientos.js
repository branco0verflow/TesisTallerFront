import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import MenuNavBar from "./MenuNavBar";
import { useSeguimiento } from "../SeguimientoContext";
import { API_BASE_URL } from "../../config/apiConfig";

export default function Seguimientos() {
  const { seguimientoData, updateSeguimiento } = useSeguimiento();

  const [cedula, setCedula] = useState(seguimientoData.cedula || "");
  const [email, setEmail]   = useState(seguimientoData.email || "");

  const [cliente, setCliente] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosConReservaActiva, setVehiculosConReservaActiva] = useState({});
  const [reservas, setReservas] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [mostrar, setMostrar] = useState(false);

  const navigate = useNavigate();

  /* -------------  BUSCAR ------------- */
  const handleBuscar = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}seguimiento?documento=${cedula}&email=${email}`
      );
      if (!res.ok) throw new Error("No se encontró el cliente o hubo un error en la búsqueda");
      const data = await res.json();

      if (data.length === 0) {
        setError("No se encontraron reservas para este cliente.");
        setCliente(null);
        setVehiculos([]);
        return;
      }

      const { nombreCliente, apellidoCliente } = data[0];
      setCliente({ nombre: nombreCliente, apellido: apellidoCliente });

      /* --- Agrupar vehículos --- */
      const agrupado = {};
      data.forEach((r) => {
        if (!agrupado[r.idVehiculo]) {
          agrupado[r.idVehiculo] = {
            idVehiculo: r.idVehiculo,
            idCliente : r.idCliente,
            marca     : r.marcaVehiculo,
            modelo    : r.modeloVehiculo,
            matricula : r.matricula,
            cantidad  : 0,
          };
        }
        agrupado[r.idVehiculo].cantidad += 1;
      });

      const listaVehiculos = Object.values(agrupado);
      setVehiculos(listaVehiculos);

      /* --- Consulta si cada vehículo tiene reserva futura --- */
      const checks = await Promise.all(
        listaVehiculos.map(async (v) => {
          try {
            const resp = await fetch(
              `${API_BASE_URL}reserva/verificarReservaActiva?idVehiculo=${v.idVehiculo}`
            );
            const tiene = await resp.json();
            return { idVehiculo: v.idVehiculo, tiene };
          } catch {
            return { idVehiculo: v.idVehiculo, tiene: false };
          }
        })
      );
      const map = {};
      checks.forEach((c) => (map[c.idVehiculo] = c.tiene));
      setVehiculosConReservaActiva(map);
    } catch (err) {
      setError(err.message);
      setCliente(null);
      setVehiculos([]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------  RESERVAS POR VEHÍCULO ------------- */
  const obtenerReservas = async (idVehiculo) => {
    try {
      const res = await fetch(`${API_BASE_URL}reserva/vehiculo/${idVehiculo}`);
      if (!res.ok) throw new Error();
      setReservas(await res.json());
      setMostrar(true);
    } catch {
      alert("Error al obtener reservas");
    }
  };

  const comenzarReserva = (idVehiculo, idCliente) => {
    updateSeguimiento({ cedula, email, idCliente, idVehiculo });
    navigate("/seguimiento/crear-reserva");
  };

  const handleCancelarReserva = async (idReserva) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta reserva?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_BASE_URL}reserva/${idReserva}/cancelar`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Reserva cancelada correctamente.");
        setReservas(reservas.filter(r => r.idReserva !== idReserva));
        handleBuscar();
      } else {
        alert("Ocurrió un error al cancelar la reserva.");
      }
    } catch (error) {
      console.error("Error cancelando la reserva:", error);
    }
  };
  
  useEffect(() => {
    if (seguimientoData.cedula && seguimientoData.email) handleBuscar();
    
  }, []);

  
  return (
    <>
      <MenuNavBar />

      <main className="px-4 py-8 max-w-4xl mx-auto">
        
        <section className="bg-white/60 backdrop-blur rounded-xl shadow-lg p-6 mb-8">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-blue-900 mb-4">
            <MagnifyingGlassIcon className="w-7 h-7" />
            Seguimiento de Reservas
          </h1>

          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="border px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-4 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleBuscar}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Buscar
            </button>
          </div>

          {loading && <p className="mt-3 text-sm text-gray-500">Buscando reservas…</p>}
          {error   && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </section>

        
        {cliente && (
          <section className="mb-6">
            <div className="animate-fade-in-up flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-4 shadow">
              <UserCircleIcon className="w-10 h-10" />
              <p className="text-lg font-semibold">
                Hola {cliente.nombre} {cliente.apellido}, estos son tus vehículos registrados:
              </p>
            </div>
          </section>
        )}

        
        {vehiculos.length > 0 && (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehiculos.map((v) => {
              const tieneReservaFutura = vehiculosConReservaActiva[v.idVehiculo];

              return (
                <article
                  key={v.idVehiculo}
                  className="animate-fade-in flex flex-col justify-between bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
                >
                  
                  <header className="mb-3">
                    <h3 className="text-lg font-medium text-gray-800">
                      {v.marca} {v.modelo}
                    </h3>
                    <p className="text-sm text-gray-500">Matrícula: {v.matricula}</p>
                  </header>

                  
                  <div className="mt-auto space-y-2">
                    <button
                      onClick={() => obtenerReservas(v.idVehiculo)}
                      className="w-full flex items-center justify-center gap-2 py-2 text-blue-700 border border-blue-700 rounded hover:bg-blue-50 transition"
                    >
                      <ClipboardDocumentListIcon className="w-5 h-5" />
                      Ver reservas
                    </button>

                    {!tieneReservaFutura ? (
                      <button
                        onClick={() => comenzarReserva(v.idVehiculo, v.idCliente)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        Reservar un turno
                      </button>
                    ) : (
                      <p className="flex items-center gap-2 text-sm text-red-600">
                        <ExclamationCircleIcon className="w-4 h-4" />
                        Este vehículo ya tiene una reserva activa o futura
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        
        {mostrar && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-2xl p-6 flex flex-col">
              <button
                onClick={() => setMostrar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold leading-none"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
                {reservas[0]?.vehiculo?.modelo?.marca?.nombreMarca ?? "Vehículo"}{" "}
                {reservas[0]?.vehiculo?.modelo?.nombreModelo ?? ""}
              </h2>

              <div className="overflow-y-auto space-y-4 pr-2">
                {reservas.length === 0 ? (
                  <p className="text-center text-gray-600">No hay reservas asociadas al vehículo.</p>
                ) : (
                  reservas.map((r) => {
                    const fechaCita = new Date(r.fechaCitaReserva);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    const esFutura = fechaCita > hoy;

                    return (
                      <div key={r.idReserva} className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                        <p className="text-gray-700">
                          <strong>Fecha cita:</strong> {r.fechaCitaReserva}
                        </p>
                        <p className="text-gray-700">
                          <strong>Hora:</strong> {r.horaInicioReserva.slice(0, 5)} – {r.horaFinReserva.slice(0, 5)}
                        </p>

                        <p className="mt-2 font-semibold text-gray-800">Motivo:</p>
                        <ul className="list-disc ml-5 text-gray-700">
                          {r.tipoTarea?.map((t) => (
                            <li key={t.idTipoTarea}>{t.nombreTipoTarea}</li>
                          ))}
                        </ul>

                        <p className="mt-2 text-gray-700">
                          <strong>Comentarios:</strong>{" "}
                          {r.comentariosReserva || <span className="italic text-gray-500">Sin comentarios</span>}
                        </p>

                        {esFutura && (
                          <button
                            onClick={() => handleCancelarReserva(r.idReserva)}
                            className="mt-4 w-full py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          >
                            Cancelar Reserva
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
