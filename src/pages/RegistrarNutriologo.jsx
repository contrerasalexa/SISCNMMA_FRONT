import React, { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function RegistrarNutriologo() {
  const [form, setForm] = useState({
    nombre_completo: "",
    fecha_nacimiento: "",
    cedula_profesional: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombre_completo) newErrors.nombre_completo = "El nombre es obligatorio";
    if (!form.fecha_nacimiento) newErrors.fecha_nacimiento = "La fecha es obligatoria";
    if (!form.cedula_profesional) newErrors.cedula_profesional = "La cédula es obligatoria";
    if (!form.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Formato de email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API}/api/nutriologos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        setNotification({
          type: "success",
          message: "Nutriólogo registrado exitosamente"
        });
        setForm({
          nombre_completo: "",
          fecha_nacimiento: "",
          cedula_profesional: "",
          email: ""
        });
      } else {
        setNotification({
          type: "error",
          message: data.error || "Error al registrar nutriólogo"
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: "error",
        message: "Error de conexión con el servidor"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Registro de Nutriólogo</h2>

      {notification && (
        <div className={`mb-4 p-3 rounded-md flex items-center ${
          notification.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {notification.type === "success" ? 
            <CheckCircle className="mr-2 h-5 w-5" /> : 
            <AlertCircle className="mr-2 h-5 w-5" />
          }
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="space-y-1">
          <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700">
            Nombre Completo
          </label>
          <input 
            type="text"
            id="nombre_completo"
            name="nombre_completo"
            value={form.nombre_completo}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.nombre_completo ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.nombre_completo && <p className="text-red-500 text-xs">{errors.nombre_completo}</p>}
        </div>

        {/* Fecha de Nacimiento */}
        <div className="space-y-1">
          <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
            Fecha de Nacimiento
          </label>
          <input 
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.fecha_nacimiento ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.fecha_nacimiento && <p className="text-red-500 text-xs">{errors.fecha_nacimiento}</p>}
        </div>

        {/* Cédula Profesional */}
        <div className="space-y-1">
          <label htmlFor="cedula_profesional" className="block text-sm font-medium text-gray-700">
            Cédula Profesional
          </label>
          <input 
            type="text"
            id="cedula_profesional"
            name="cedula_profesional"
            value={form.cedula_profesional}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.cedula_profesional ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.cedula_profesional && <p className="text-red-500 text-xs">{errors.cedula_profesional}</p>}
        </div>
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input 
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        {/* Botón */}
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Registrar Nutriólogo"}
          </button>
        </div>
      </form>
    </div>
  );
}
