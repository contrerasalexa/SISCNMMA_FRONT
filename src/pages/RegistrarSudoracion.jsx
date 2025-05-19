import React, { useEffect, useState } from "react";
import { Check, Droplet, Timer, Scale, X } from "lucide-react";

const API = import.meta.env.VITE_API;

const RegistrarSudoracion = () => {
  const [form, setForm] = useState({
    peso_antes: "",
    peso_despues: "",
    liquido_ingesta_ml: "",
    duracion_ejercicio_min: ""
  });
  const [idAtleta, setIdAtleta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [errors, setErrors] = useState({});

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchIdAtleta = async () => {
      try {
        const res = await fetch(`${API}/api/atletas/byUser/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setIdAtleta(data.id_atleta);
        } else {
          console.error("No se encontró el atleta");
        }
      } catch (error) {
        console.error("Error al obtener id_atleta:", error);
      }
    };

    if (user.rol === 3) {
      fetchIdAtleta();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.peso_antes || parseFloat(form.peso_antes) <= 0) newErrors.peso_antes = "Ingrese un peso válido";
    if (!form.peso_despues || parseFloat(form.peso_despues) <= 0) newErrors.peso_despues = "Ingrese un peso válido";
    if (!form.liquido_ingesta_ml || parseInt(form.liquido_ingesta_ml) < 0) newErrors.liquido_ingesta_ml = "Ingrese una cantidad válida";
    if (!form.duracion_ejercicio_min || parseInt(form.duracion_ejercicio_min) <= 0) newErrors.duracion_ejercicio_min = "Ingrese una duración válida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!idAtleta) {
      return showNotification("No se ha podido identificar al atleta", "error");
    }

    setIsLoading(true);

    try {
        const payload = {
            ...form,
            id_usuario: user.id, // ✅ El backend espera id_usuario
            fecha: new Date().toISOString().split("T")[0],
          };
          

      const res = await fetch(`${API}/api/sudoracion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        showNotification(`Tasa de sudoración: ${data.tasa.toFixed(2)} ml/hora`, "success");
        setForm({
          peso_antes: "",
          peso_despues: "",
          liquido_ingesta_ml: "",
          duracion_ejercicio_min: ""
        });
      } else {
        showNotification("Error al registrar datos", "error");
      }
    } catch (error) {
      showNotification("Error de conexión", "error");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldConfigs = [
    { name: "peso_antes", label: "Peso antes del ejercicio (kg)", icon: <Scale className="text-blue-500" size={20} /> },
    { name: "peso_despues", label: "Peso después del ejercicio (kg)", icon: <Scale className="text-blue-500" size={20} /> },
    { name: "liquido_ingesta_ml", label: "Líquido ingerido (ml)", icon: <Droplet className="text-blue-500" size={20} /> },
    { name: "duracion_ejercicio_min", label: "Duración del ejercicio (min)", icon: <Timer className="text-blue-500" size={20} /> }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 -mx-6 -mt-6 px-6 py-4 mb-6 rounded-t-lg">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Droplet size={24} className="mr-2" />
          Registrar Tasa de Sudoración
        </h2>
        <p className="text-blue-50 text-sm mt-1">
          Ingresa los datos para calcular tu tasa de sudoración
        </p>
      </div>

      {notification.show && (
        <div className={`mb-4 p-3 rounded-md flex items-center justify-between ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          <div className="flex items-center">
            {notification.type === "success" ? <Check size={18} className="mr-2" /> : <X size={18} className="mr-2" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification({ ...notification, show: false })} className="text-gray-600 hover:text-gray-800">
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fieldConfigs.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              {field.icon}
              <span className="ml-2">{field.label}</span>
            </label>
            <input
              type="number"
              name={field.name}
              value={form[field.name]}
              step="0.1"
              className={`w-full border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition ${errors[field.name] ? "border-red-300" : "border-gray-300"}`}
              onChange={handleChange}
              placeholder={`Ingrese ${field.label.toLowerCase()}`}
            />
            {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            <>Calcular tasa de sudoración</>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2">¿Cómo se calcula?</h3>
        <p className="text-xs text-blue-600">
          La tasa de sudoración se calcula considerando el cambio de peso,
          el líquido ingerido y el tiempo de ejercicio.
          <br />
          <strong>Fórmula:</strong> (Peso antes - Peso después + Líquido ingerido) / Tiempo
        </p>
      </div>
    </div>
  );
};

export default RegistrarSudoracion;
