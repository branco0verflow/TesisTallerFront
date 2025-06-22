export default function ModalHorarios({ horarios, onClose, onSeleccionHorario }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl text-blue-900 font-bold mb-4">Horarios disponibles</h2>
                <p className="text-gray-700 mb-4">*Asistir al taller 30 minutos antes del ingreso</p>

                {horarios.length === 0 ? (
                    <p className="text-gray-500">No hay horarios disponibles para este día.</p>
                ) : (
                    <ul className="space-y-2">
                        {horarios.map((h, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => onSeleccionHorario(h)}
                                    className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded flex items-center gap-2"
                                >
                                    <span className="text-green-900">Ingreso:</span> {h.inicio} →
                                    <span className="text-green-900">Salida estimada:</span> {h.fin}
                                </button>
                            </li>
                        ))}
                    </ul>

                )}

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
