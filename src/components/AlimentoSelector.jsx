// ✅ src/components/AlimentoSelector.jsx
import React, { useState } from "react";

const AlimentoSelector = ({ alimentos = [], selectedTipo = "", onAdd }) => {
  const API = (import.meta.env.VITE_API || '').replace(/\/$/, '');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({});

  const handleClick = (alimento) => {
    const cantidad = parseFloat(cantidadSeleccionada[alimento.id_alimento] || 1);
    if (typeof onAdd === "function") {
      onAdd({ ...alimento, cantidad });
    }
  };

  const handleCantidadChange = (id, value) => {
    setCantidadSeleccionada((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800">{selectedTipo}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {alimentos.map((alimento) => (
          <div
            key={alimento.id_alimento}
            className="border p-3 rounded-lg bg-white shadow hover:shadow-md transition"
          >
            <img
              src={`${API}${alimento.imagen}`}
              alt={alimento.nombre}
              className="h-24 w-full object-contain mb-2"
            />
            <p className="text-sm text-center font-medium text-gray-700">{alimento.nombre}</p>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={cantidadSeleccionada[alimento.id_alimento] || ""}
              onChange={(e) => handleCantidadChange(alimento.id_alimento, e.target.value)}
              placeholder="Cantidad"
              className="w-full mt-2 px-2 py-1 border rounded text-sm"
            />
            <button
                type="button"
              onClick={() => handleClick(alimento)}
              className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm"
            >
              Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlimentoSelector;
