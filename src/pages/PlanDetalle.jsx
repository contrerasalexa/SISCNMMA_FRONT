// src/pages/PlanDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PlanDetalle = () => {
  const { id } = useParams();
  const [detalles, setDetalles] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const res = await fetch(`${API}/api/planes/${id}`);
        const data = await res.json();
        if (data.success) {
          setDetalles(data.detalles);
          if (data.detalles.length > 0) {
            setPlanInfo({
              nombre: data.detalles[0].nombre_plan,
              fecha: data.detalles[0].fecha_creacion,
              atleta: data.detalles[0].nombre_atleta,
            });
          }
        }
      } catch (err) {
        console.error("Error al obtener detalle:", err);
      }
    };

    fetchDetalle();
  }, [id]);

  const agrupados = detalles.reduce((acc, actual) => {
    const grupo = actual.tiempo_comida;
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(actual);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
        ← Regresar
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">{planInfo?.nombre}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Atleta: {planInfo?.atleta} | Fecha: {new Date(planInfo?.fecha).toLocaleDateString()}
      </p>

      {Object.keys(agrupados).map((tiempo) => (
        <div key={tiempo} className="mb-8">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">{tiempo}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {agrupados[tiempo].map((a, idx) => (
              <div key={idx} className="bg-white rounded shadow p-4">
                <img
                  src={`${API}${a.imagen}`}
                  alt={a.nombre}
                  className="h-24 object-contain w-full mb-2"
                />
                <h3 className="font-bold text-gray-800">{a.nombre}</h3>
                <p className="text-sm text-gray-600">Cantidad: {a.cantidad}</p>
                <p className="text-sm text-gray-600">Energía: {a.energia_kcal} kcal</p>
                <p className="text-sm text-gray-600">Proteína: {a.proteina} g</p>
                <p className="text-sm text-gray-600">Carbohidrato: {a.carbohidrato} g</p>
                <p className="text-sm text-gray-600">Grasa: {a.grasa} g</p>
                {a.observaciones && (
                  <p className="text-sm mt-1 italic text-gray-500">📝 {a.observaciones}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanDetalle;
