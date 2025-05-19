import React, { useEffect, useState } from "react";
import { Droplet } from "lucide-react";

const API = import.meta.env.VITE_API;

const HistorialSudoracion = () => {
  const [historial, setHistorial] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch(`${API}/api/atletas/byUser/${user.id}`);
        const atleta = await res.json();
        if (!atleta.success) throw new Error("No se encontró el atleta");

        const id_atleta = atleta.id_atleta;

        const sudoracionRes = await fetch(`${API}/api/sudoracion/historial/${id_atleta}`);
        const data = await sudoracionRes.json();

        if (data.success) {
          setHistorial(data.historial);
        }
      } catch (err) {
        console.error("Error al obtener historial de sudoración:", err);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Droplet className="text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Historial de Tasa de Sudoración</h1>
      </div>

      {historial.length === 0 ? (
        <p className="text-gray-500 italic">No hay registros aún.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Fecha</th>
              <th className="px-4 py-2 text-left text-sm">Peso Antes</th>
              <th className="px-4 py-2 text-left text-sm">Peso Después</th>
              <th className="px-4 py-2 text-left text-sm">Líquido (ml)</th>
              <th className="px-4 py-2 text-left text-sm">Duración (min)</th>
              <th className="px-4 py-2 text-left text-sm">Tasa (ml/h)</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{new Date(r.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-2">{r.peso_antes} kg</td>
                <td className="px-4 py-2">{r.peso_despues} kg</td>
                <td className="px-4 py-2">{r.liquido_ingesta_ml} ml</td>
                <td className="px-4 py-2">{r.duracion_ejercicio_min} min</td>
                <td className="px-4 py-2 font-semibold">{r.tasa_resultado_ml_hora.toFixed(2)} ml/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistorialSudoracion;
