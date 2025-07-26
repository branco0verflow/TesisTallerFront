import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function ModalCalendario({ diasDisponibles, onClose, onDiaSeleccionado }) {
    // Corrige desfase horario al parsear fechas
    const parseFechaLocal = (fechaStr) => {
        const [year, month, day] = fechaStr.split("-").map(Number);
        return new Date(year, month - 1, day); // mes es 0-indexado
    };

    const fechasDisponibles = diasDisponibles.map(parseFechaLocal);

    const hoy = new Date();
    const dia1 = new Date(hoy);
    dia1.setDate(hoy.getDate() + 1);

    const dia2 = new Date(hoy);
    dia2.setDate(hoy.getDate() + 2);

    const diaLimite = new Date(hoy);
    diaLimite.setDate(hoy.getDate() + 35);

    const esFechaHabilitada = (date) => {
        const stringDate = date.toDateString();
        return fechasDisponibles.some(f => f.toDateString() === stringDate);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-2">Selecciona un día</h2>
                <p className="text-sm text-gray-600 mb-4">* Próximos 35 días disponibles</p>

                <DayPicker
                    mode="single"
                    fromDate={hoy}
                    toDate={diaLimite}
                    onSelect={onDiaSeleccionado}
                    selected={null}
                    modifiers={{
                        disabled: [
                            { dayOfWeek: [0, 6] },        // fines de semana
                            { before: dia2 },             // deshabilita hoy, mañana y pasado mañana
                            (date) => !esFechaHabilitada(date) // los que no están en la lista de disponibilidad
                        ]
                    }}
                    modifiersClassNames={{
                        disabled: 'opacity-40 cursor-not-allowed',
                        selected: 'bg-green-600 text-white'
                    }}
                />

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
