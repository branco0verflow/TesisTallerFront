import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  UserIcon,
  IdentificationIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";

const paises = [
  { pais: "Uruguay", codigo: "+598", emoji: "🇺🇾" },
  { pais: "Argentina", codigo: "+54", emoji: "🇦🇷" },
  { pais: "Brasil", codigo: "+55", emoji: "🇧🇷" },
  { pais: "Chile", codigo: "+56", emoji: "🇨🇱" },
  { pais: "Estados Unidos", codigo: "+1", emoji: "🇺🇸" },
];

export default function DatosPersonales({ formData, setFormData, onNext }) {
  const [errores, setErrores] = useState({});
  const [formValido, setFormValido] = useState(false);
  const [codigoTelefono, setCodigoTelefono] = useState("+598");

  const validar = () => {
    const e = {};

    if (!formData.NombreCliente?.trim()) e.NombreCliente = "*";
    if (!formData.ApellidoCliente?.trim()) e.ApellidoCliente = "*";

    if (!formData.CedulaCliente?.trim()) {
      e.CedulaCliente = "*";
    } else if (!/^\d{1,8}$/.test(formData.CedulaCliente)) {
      e.CedulaCliente = "Máximo 8 dígitos numéricos";
    }

    if (!formData.EmailCliente?.trim()) {
      e.EmailCliente = "*";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.EmailCliente)) {
      e.EmailCliente = "Email inválido";
    }

    if (!formData.TelefonoCliente?.trim()) {
      e.TelefonoCliente = "*";
    } else if (!/^\d{7,15}$/.test(formData.TelefonoCliente)) {
      e.TelefonoCliente = "Teléfono inválido";
    }

    if (!formData.DireccionCliente?.trim()) e.DireccionCliente = "*";

    setErrores(e);
    setFormValido(Object.keys(e).length === 0);
  };

  useEffect(() => {
    validar();
  }, [formData]);

  const campos = [
    {
      name: "NombreCliente",
      label: "Nombre",
      icon: <UserIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      name: "ApellidoCliente",
      label: "Apellido",
      icon: <UserIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      name: "CedulaCliente",
      label: "Cédula",
      icon: <IdentificationIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      name: "EmailCliente",
      label: "Email",
      icon: <EnvelopeIcon className="h-5 w-5 text-gray-400" />,
    },
    {
      name: "DireccionCliente",
      label: "Dirección",
      icon: <HomeIcon className="h-5 w-5 text-gray-400" />,
    },
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-3 text-blue-800">Datos personales</h2>
      <h4 className="text-sm text-gray-600 mb-4">
        Tus datos estarán protegidos y se guardarán para seguimientos o futuras reservas.
      </h4>
      <div className="grid gap-5">
        {campos.map((campo) => {
          const valor = formData[campo.name];
          const error = errores[campo.name];
          const isValid = !error && valor?.trim();

          return (
            <div key={campo.name} className="relative">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  {campo.icon}
                </span>
                <input
                  type="text"
                  placeholder={campo.label}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, [campo.name]: e.target.value })
                  }
                  className={`w-full pl-10 pr-10 border p-2 rounded ${
                    error
                      ? "border-red-500"
                      : isValid
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                />
                {error && (
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500 absolute top-3 right-3"
                    title={error}
                  />
                )}
                {isValid && (
                  <CheckCircleIcon
                    className="h-5 w-5 text-green-500 absolute top-3 right-3"
                    title="Campo válido"
                  />
                )}
              </div>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          );
        })}

        <div className="relative">
          <label className="block text-sm mb-1 text-gray-600 font-medium">Teléfono</label>
          <div className="flex">
            <select
              value={codigoTelefono}
              onChange={(e) => setCodigoTelefono(e.target.value)}
              className="rounded-l border border-gray-300 px-2 py-2 bg-white text-sm"
            >
              {paises.map((p) => (
                <option key={p.codigo} value={p.codigo}>
                  {p.emoji} {p.pais} ({p.codigo})
                </option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="Número sin prefijo"
              value={formData.TelefonoCliente}
              onChange={(e) =>
                setFormData({ ...formData, TelefonoCliente: e.target.value })
              }
              className={`w-full border p-2 rounded-r ${
                errores.TelefonoCliente
                  ? "border-red-500"
                  : formData.TelefonoCliente?.trim()
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          {errores.TelefonoCliente && (
            <p className="text-sm text-red-500 mt-1">{errores.TelefonoCliente}</p>
          )}
        </div>

        <button
          disabled={!formValido}
          onClick={() => {
            if (formValido) onNext(),
            console.log(formData);
            else toast.error("Por favor corregí los errores antes de continuar");
          }}
          className={`mt-4 px-4 py-2 rounded text-white font-semibold transition ${
            formValido
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
