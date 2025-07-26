import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/apiConfig";

export default function useReservaDetalle(idReserva, mostrar) {
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idReserva || !mostrar) return;

    const fetchReserva = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}reserva/${idReserva}`);
        if (!res.ok) throw new Error("No se pudo obtener la reserva");
        const data = await res.json();
        setReserva(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReserva();
  }, [idReserva, mostrar]);

  return { reserva, loading, error };
}
