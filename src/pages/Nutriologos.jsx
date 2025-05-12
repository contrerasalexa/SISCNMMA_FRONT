import React, { useEffect, useState } from "react";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Nutriologos = () => {
  const [nutriologos, setNutriologos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();

  useEffect(() => {
    fetchNutriologos();
  }, []);

  const fetchNutriologos = () => {
    setIsLoading(true);
    fetch(`${API}/api/nutriologos/ver-nutriologos`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setNutriologos(data.nutriologos);
      })
      .catch((error) => console.error("Error al obtener nutriólogos:", error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Regresar</span>
          </button>
          <span className="text-blue-700 font-bold text-lg">SISCNMMA</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-4">
          <UserPlus className="mr-2 text-blue-600 h-8 w-8" />
          Nutriólogos Registrados
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Lista de Nutriólogos</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nacimiento</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nutriologos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-500 italic">No hay nutriólogos registrados.</td>
                    </tr>
                  ) : (
                    nutriologos.map((n) => (
                      <tr key={n.id}>
                        <td className="px-6 py-4">{n.nombre_completo}</td>
                        <td className="px-6 py-4">{n.email}</td>
                        <td className="px-6 py-4">{n.cedula_profesional}</td>
                        <td className="px-6 py-4">{new Date(n.fecha_nacimiento).toLocaleDateString()}</td>
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

export default Nutriologos;
