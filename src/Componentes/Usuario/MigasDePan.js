export default function MigasDePan({ paso }) {
  const pasos = [
    { id: 1, label: "Datos" },
    { id: 2, label: "Vehículo" },
    { id: 3, label: "Agenda" },
  ];

  return (
    <div className="flex items-center justify-center gap-8 w-full max-w-2xl mx-auto mb-10 px-4">
      {pasos.map((p, index) => (
        <div key={p.id} className="flex-1 flex flex-col items-center relative">
          {/* Línea hacia el paso siguiente */}
          {index < pasos.length - 1 && (
            <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-300 z-0">
              <div
                className={`absolute h-0.5 bg-green-700 transition-all duration-500 ${
                  paso > p.id ? "w-full left-0" : paso === p.id ? "w-1/2 left-0" : "w-0 left-0"
                }`}
              />
            </div>
          )}

          {/* Círculo */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 border-2 transition ${
              paso === p.id
                ? "bg-green-600 text-white border-green-700"
                : paso > p.id
                ? "bg-green-100 text-green-700 border-green-700"
                : "bg-white text-gray-400 border-gray-300"
            }`}
          >
            {p.id}
          </div>

          {/* Etiqueta */}
          <div
            className={`mt-2 text-sm font-medium ${
              paso === p.id
                ? "text-green-700"
                : paso > p.id
                ? "text-green-700"
                : "text-gray-600"
            }`}
          >
            {p.label}
          </div>
        </div>
      ))}
    </div>
  );
}
