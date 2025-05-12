import React, { useEffect, useState } from "react";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Atletas() {
  const [atletas, setAtletas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;

  useEffect(() => {
    fetch(`${API}/api/atletas/listado`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAtletas(data.atletas);
      })
      .catch((err) => console.error("Error al obtener atletas:", err))
      .finally(() => setIsLoading(false));
  }, []);

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

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <User className="mr-2 text-blue-600 h-8 w-8" />
            Atletas Registrados
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Listado de Atletas Vinculados</h2>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sexo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha de Nacimiento</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {atletas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-500 italic">No hay atletas registrados.</td>
                    </tr>
                  ) : (
                    atletas.map((a) => (
                      <tr key={a.id}>
                        <td className="px-6 py-4">{a.nombre_completo}</td>
                        <td className="px-6 py-4">{a.email}</td>
                        <td className="px-6 py-4 capitalize">{a.sexo}</td>
                        <td className="px-6 py-4">{a.fecha_nacimiento}</td>
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
}