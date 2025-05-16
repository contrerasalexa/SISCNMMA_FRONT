import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanForm from "../components/PlanForm";

const NuevoPlan = () => {
  const [alimentos, setAlimentos] = useState([]);
  const [atletas, setAtletas] = useState([]);
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAlimentos, resAtletas] = await Promise.all([
          fetch(`${API}/api/alimentos`),
          fetch(`${API}/api/atletas/opciones`)
        ]);

        const dataAlimentos = await resAlimentos.json();
        const dataAtletas = await resAtletas.json();

        if (dataAlimentos.success) setAlimentos(dataAlimentos.alimentos);
        if (dataAtletas.success) setAtletas(dataAtletas.atletas);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    fetchData();
  }, [API]);

  const handleSubmit = async (form) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const detallesArray = [];

    for (const tiempo in form.detalles) {
      const alimentosTiempo = form.detalles[tiempo];
      for (const alimento of alimentosTiempo) {
        if (!alimento.cantidad || alimento.cantidad <= 0) continue;
        detallesArray.push({
            id_alimento: alimento.id_alimento,
            tiempo_comida: tiempo,
            cantidad: alimento.cantidad || 1,
            unidad: alimento.unidad || "",
            es_proteina: alimento.es_proteina || false,
            es_carbohidrato: alimento.es_carbohidrato || false,
            es_grasa: alimento.es_grasa || false
          });
          
      }
    }

    if (detallesArray.length === 0) {
      return alert("Debes agregar al menos un alimento con cantidad válida.");
    }

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      id_atleta: form.id_atleta,
      id_nutriologo: user.id,
      detalles: detallesArray,
    };

    try {
      const res = await fetch(`${API}/api/planes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        navigate("/planes");
      } else {
        console.error("Error del servidor:", data.error);
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error al enviar plan:", err);
      alert("Error al enviar el plan alimenticio.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">
        ← Regresar
      </button>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Nuevo Plan Alimenticio
        </h1>
        <PlanForm
          onSubmit={handleSubmit}
          atletas={atletas}
          alimentos={alimentos}
        />
      </div>
    </div>
  );
};

export default NuevoPlan;
