// src/pages/PlanDetalle.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PlanDetalle = () => {
  const { id } = useParams();
  const [detalles, setDetalles] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const API = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const exportRef = useRef();

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

  const handleExportPDF = async () => {
    const element = exportRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const finalHeight = imgHeight > pageHeight ? pageHeight : imgHeight;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, finalHeight);
    pdf.save(`plan-${id}.pdf`);
  };

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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Detalle del Plan #{id}</h1>
        <button
          onClick={handleExportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Descargar PDF
        </button>
      </div>

      <div ref={exportRef} className="bg-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{planInfo?.nombre}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Atleta: {planInfo?.atleta} | Fecha: {new Date(planInfo?.fecha).toLocaleDateString()}
        </p>

        {Object.keys(agrupados).map((tiempo) => (
          <div key={tiempo} className="mb-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-3">{tiempo}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {agrupados[tiempo].map((a, idx) => (
                <div key={idx} className="bg-white rounded shadow p-4 text-center">
                  <img
                    src={`${API}${a.imagen}`}
                    alt={a.nombre}
                    className="h-24 mx-auto object-contain mb-2"
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
    </div>
  );
};

export default PlanDetalle;
