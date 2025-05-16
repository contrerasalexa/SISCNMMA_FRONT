import React, { useEffect, useState } from "react";
import AlimentoSelector from "./AlimentoSelector";

const tiemposComida = [
  "Desayuno",
  "Colación",
  "Comida",
  "Pre-Entrenamiento",
  "Post-Entrenamiento",
  "Cena",
];

const PlanForm = ({ onSubmit, initialData = {}, atletas = [], alimentos = [] }) => {
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", id_atleta: "" });
  const [detalles, setDetalles] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetalleChange = (tiempo, nuevoAlimento) => {
    if (!nuevoAlimento || !nuevoAlimento.id_alimento || !nuevoAlimento.cantidad) return;

    setDetalles((prev) => {
      const anteriores = prev[tiempo] || [];
      const existe = anteriores.find((a) => a.id_alimento === nuevoAlimento.id_alimento);
      if (existe) return prev; // evitar duplicados

      return {
        ...prev,
        [tiempo]: [...anteriores, nuevoAlimento],
      };
    });
  };

  const handleCantidadChange = (tiempo, idx, nuevaCantidad) => {
    setDetalles((prev) => {
      const copia = [...(prev[tiempo] || [])];
      copia[idx].cantidad = nuevaCantidad;
      return { ...prev, [tiempo]: copia };
    });
  };

  const handleEliminar = (tiempo, idx) => {
    setDetalles((prev) => {
      const copia = [...(prev[tiempo] || [])];
      copia.splice(idx, 1);
      return { ...prev, [tiempo]: copia };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tieneAlimentos = Object.values(detalles).some((arr) => arr.length > 0);
    if (!tieneAlimentos) {
      alert("Debes agregar al menos un alimento al plan.");
      return;
    }

    onSubmit({ ...formData, detalles });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del Plan</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full border rounded px-4 py-2"></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Seleccionar Atleta</label>
        <select name="id_atleta" value={formData.id_atleta} onChange={handleChange} className="w-full border rounded px-4 py-2" required>
          <option value="">-- Selecciona un atleta --</option>
          {atletas.map((a) => (
            <option key={a.id} value={a.id}>{a.nombre_completo}</option>
          ))}
        </select>
      </div>

      <hr className="my-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Tiempos de Comida</h3>
      {tiemposComida.map((tiempo) => (
        <div key={tiempo} className="border p-4 rounded-md mb-6">
          <h4 className="text-blue-700 font-semibold mb-2">{tiempo}</h4>
          <AlimentoSelector
            alimentos={alimentos}
            selectedTipo={tiempo}
            onAdd={(alimento) => handleDetalleChange(tiempo, alimento)}
          />

          {(detalles[tiempo] || []).map((a, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2">
              <span className="text-sm text-gray-700 w-32">{a.nombre}</span>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={a.cantidad || 1}
                onChange={(e) => handleCantidadChange(tiempo, idx, parseFloat(e.target.value))}
                className="w-16 border rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={() => handleEliminar(tiempo, idx)}
                className="text-red-500 text-sm hover:underline"
              >Eliminar</button>
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Guardar Plan</button>
      </div>
    </form>
  );
};

export default PlanForm;
