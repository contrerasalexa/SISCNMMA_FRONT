import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, FileText } from "lucide-react";

const PlanesAlimenticios = () => {
  const [planes, setPlanes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user || ![2, 3].includes(user.rol)) return navigate("/");

    const fetchPlanes = async () => {
      try {
        const url =
          user.rol === 2 
            ? `${API}/api/planes/nutriologo/${user.id}`
            : `${API}/api/planes/atleta/${user.id}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) setPlanes(data.planes);
      } catch (err) {
        console.error("Error al obtener planes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanes();
  }, [API, user, navigate]);

  const crearNuevoPlan = () => navigate("/planes/nuevo");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
        ← Regresar
      </button>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="w-8 h-8 mr-2 text-green-600" />
            {user.rol === 2 || user.rol === 3 ? "Planes Alimenticios" : "Mis Planes"}
          </h1>
          {user.rol === 2 && (
            <button
              onClick={crearNuevoPlan}
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              <PlusCircle className="w-5 h-5 mr-2" /> Crear Plan
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Listado</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atleta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {planes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                        No hay planes registrados.
                      </td>
                    </tr>
                  ) : (
                    planes.map((plan) => (
                      <tr key={plan.id_plan}>
                        <td className="px-6 py-4 font-medium text-gray-800">{plan.nombre}</td>
                        <td className="px-6 py-4">{plan.nombre_atleta}</td>
                        <td className="px-6 py-4">{new Date(plan.fecha_creacion).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/planes/${plan.id_plan}`)}
                            className="text-blue-600 hover:underline"
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanesAlimenticios;
