import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MiHistorial = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    // Datos del Atleta
    fecha_nacimiento: "",
    sexo: "",
    id_deporte: 1,


    // Datos de Evaluación Clínica
    peso: "",
    altura: "",
    imc: "",

    // Antecedentes Heredofamiliares
    antecedentes: [{ familiar: "", enfermedad: "" }],

    // Datos originales
    objetivo: "",
    alimentos_frecuentes: "",
    alimentos_que_no_gustan: "",
    alimentos_por_malestar: "",
    suplementos: "",
    consumo_fuera_casa: "",
    bebidas_frecuentes: "",
    suenio: "",
    rutina: Array(7).fill({ dia: "", descripcion: "" }),
    entrenamiento: Array(7).fill({ dia: "", horario: "", actividad: "" })
  });

  // Tabs del formulario
  const tabs = [
    { id: 0, name: "Evaluación Clínica", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { id: 1, name: "Antecedentes", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" },
    { id: 2, name: "Preferencias Dietéticas", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
    { id: 3, name: "Rutina Diaria", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: 4, name: "Entrenamiento", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
  ];

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.rol !== 3) navigate("/");
      setUser(parsedUser);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRutinaChange = (index, field, value) => {
    const nuevaRutina = [...formData.rutina];
    nuevaRutina[index] = { ...nuevaRutina[index], [field]: value };
    setFormData((prev) => ({ ...prev, rutina: nuevaRutina }));
  };

  const handleEntrenamientoChange = (index, field, value) => {
    const nuevoEntrenamiento = [...formData.entrenamiento];
    nuevoEntrenamiento[index] = { ...nuevoEntrenamiento[index], [field]: value };
    setFormData((prev) => ({ ...prev, entrenamiento: nuevoEntrenamiento }));
  };

  const handleAntecedenteChange = (index, field, value) => {
    const nuevosAntecedentes = [...formData.antecedentes];
    nuevosAntecedentes[index] = { ...nuevosAntecedentes[index], [field]: value };
    setFormData((prev) => ({ ...prev, antecedentes: nuevosAntecedentes }));
  };

  const addAntecedente = () => {
    setFormData((prev) => ({
      ...prev,
      antecedentes: [...prev.antecedentes, { familiar: "", enfermedad: "" }]
    }));
  };

  const removeAntecedente = (index) => {
    if (formData.antecedentes.length > 1) {
      const nuevosAntecedentes = [...formData.antecedentes];
      nuevosAntecedentes.splice(index, 1);
      setFormData((prev) => ({ ...prev, antecedentes: nuevosAntecedentes }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/historial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          id_atleta: user?.id,
          email: user?.email,
          nombre_completo: formData.nombre_completo,
          fecha_nacimiento: formData.fecha_nacimiento,
          sexo: formData.sexo,
          id_deporte: formData.id_deporte

        }),



      });
      const data = await response.json();
      if (data.success) {
        // Mostrar notificación de éxito en lugar de alert
        showNotification("¡Formulario enviado exitosamente!", "success");
      } else {
        showNotification("Error al guardar: " + data.error, "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error al enviar el formulario", "error");
    }
  };

  // Función para mostrar notificaciones en la UI
  const [notification, setNotification] = useState({ message: "", type: "", show: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification({ message: "", type: "", show: false });
    }, 3000);
  };

  if (!user) return null;

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Calculadora de IMC
  const calcularIMC = () => {
    if (formData.peso && formData.altura) {
      const peso = parseFloat(formData.peso);
      const altura = parseFloat(formData.altura) / 100; // Convertir cm a metros
      if (peso > 0 && altura > 0) {
        const imc = (peso / (altura * altura)).toFixed(2);
        setFormData(prev => ({ ...prev, imc }));
      }
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return;
  
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
  
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
  
    setFormData((prev) => ({ ...prev, edad }));
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notificación */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Botón para regresar */}
      <div className="max-w-6xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Regresar
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Historial del Atleta</h1>
          <p className="text-blue-100 mt-1">Complete su información para recibir un programa personalizado</p>
        </div>

        {/* Pestañas de navegación */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-6 whitespace-nowrap ${activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-500 hover:text-blue-500"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tab 1: Evaluación Clínica */}
            {activeTab === 0 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Evaluación Clínica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                      <input
                        type="date"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={(e) => {
                          handleInputChange(e);
                          calcularEdad(e.target.value); // <-- Calcula edad automáticamente
                        }}
                        className="w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                      <input
                        type="text"
                        value={formData.edad || ""}
                        readOnly
                        className="w-full rounded-md bg-gray-50 border-gray-300 shadow-sm"
                        placeholder="Calculado automáticamente"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                      <select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm"
                      >
                        <option value="">Selecciona</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                      </select>
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso actual (kg)</label>
                    <input
                      type="number"
                      name="peso"
                      value={formData.peso}
                      onChange={handleInputChange}
                      onBlur={calcularIMC}
                      className="w-full rounded-md border-gray-300 shadow-sm"
                      placeholder="Ej: 70.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      name="altura"
                      value={formData.altura}
                      onChange={handleInputChange}
                      onBlur={calcularIMC}
                      className="w-full rounded-md border-gray-300 shadow-sm"
                      placeholder="Ej: 175"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IMC</label>
                    <input
                      type="text"
                      name="imc"
                      value={formData.imc}
                      readOnly
                      className="w-full rounded-md bg-gray-50 border-gray-300 shadow-sm"
                      placeholder="Calculado automáticamente"
                    />
                    {formData.imc && (
                      <p className="text-sm mt-1 text-gray-600">
                        Estado: {
                          formData.imc < 18.5 ? "Bajo peso" :
                            formData.imc < 25 ? "Peso normal" :
                              formData.imc < 30 ? "Sobrepeso" : "Obesidad"
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Antecedentes Heredofamiliares */}
            {activeTab === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Antecedentes Heredofamiliares</h2>

                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-blue-700">
                    Es importante conocer su historial familiar para identificar posibles factores de riesgo.
                  </p>
                </div>

                {formData.antecedentes.map((antecedente, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-700">Antecedente #{index + 1}</h3>
                      {formData.antecedentes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAntecedente(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Familiar</label>
                        <input
                          type="text"
                          value={antecedente.familiar}
                          onChange={(e) => handleAntecedenteChange(index, "familiar", e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                          placeholder="Ej: Padre, Madre, Abuelo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enfermedad o condición</label>
                        <input
                          type="text"
                          value={antecedente.enfermedad}
                          onChange={(e) => handleAntecedenteChange(index, "enfermedad", e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                          placeholder="Ej: Diabetes, Hipertensión"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAntecedente}
                  className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Agregar antecedente
                </button>
              </div>
            )}

            {/* Tab 3: Preferencias Dietéticas */}
            {activeTab === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferencias Dietéticas</h2>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    Sus preferencias alimentarias son fundamentales para diseñar un plan personalizado y sostenible.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo nutricional</label>
                    <textarea
                      name="objetivo"
                      value={formData.objetivo}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      placeholder="Ej: Aumentar masa muscular, perder grasa, mejorar rendimiento..."
                      rows="2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alimentos que consumes frecuentemente</label>
                      <textarea
                        name="alimentos_frecuentes"
                        value={formData.alimentos_frecuentes}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alimentos que no te gustan</label>
                      <textarea
                        name="alimentos_que_no_gustan"
                        value={formData.alimentos_que_no_gustan}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alimentos que evitas por malestar</label>
                      <textarea
                        name="alimentos_por_malestar"
                        value={formData.alimentos_por_malestar}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Suplementos que consumes</label>
                      <textarea
                        name="suplementos"
                        value={formData.suplementos}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consumo de comida fuera de casa</label>
                      <textarea
                        name="consumo_fuera_casa"
                        value={formData.consumo_fuera_casa}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows="3"
                        placeholder="Frecuencia, tipos de establecimientos..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bebidas frecuentes</label>
                      <textarea
                        name="bebidas_frecuentes"
                        value={formData.bebidas_frecuentes}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Rutina Diaria */}
            {activeTab === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Rutina Diaria</h2>

                <div className="bg-yellow-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-yellow-800">
                    Conocer su rutina diaria nos ayuda a adaptar el plan a su estilo de vida.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hábitos de sueño</label>
                  <textarea
                    name="suenio"
                    value={formData.suenio}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    rows="2"
                    placeholder="Horarios, calidad, problemas de sueño..."
                  />
                </div>

                <div className="space-y-4">
                  {diasSemana.map((dia, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <h3 className="font-medium text-gray-700 mb-3">{dia}</h3>
                      <textarea
                        placeholder="Describa su rutina general para este día"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={formData.rutina[i].descripcion}
                        onChange={(e) => handleRutinaChange(i, "descripcion", e.target.value)}
                        rows="3"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Esquema de Entrenamiento */}
            {activeTab === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Esquema de Entrenamiento</h2>

                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-sm text-blue-700">
                    Detalle su plan actual de entrenamiento para cada día de la semana.
                  </p>
                </div>

                <div className="space-y-4">
                  {diasSemana.map((dia, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <h3 className="font-medium text-gray-700 mb-3">{dia}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                          <input
                            type="text"
                            placeholder="Ej: 7:00 - 8:30"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={formData.entrenamiento[i].horario}
                            onChange={(e) => handleEntrenamientoChange(i, "horario", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Actividad</label>
                          <input
                            type="text"
                            placeholder="Ej: Entrenamiento de fuerza, Natación"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            value={formData.entrenamiento[i].actividad}
                            onChange={(e) => handleEntrenamientoChange(i, "actividad", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de navegación y envío */}
            <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
              <div>
                {activeTab > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab - 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    Anterior
                  </button>
                )}
              </div>

              <div>
                {activeTab < tabs.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Historial
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="max-w-6xl mx-auto mt-6 px-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Progreso</span>
          <span className="text-sm text-gray-600">{Math.round((activeTab + 1) / tabs.length * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(activeTab + 1) / tabs.length * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MiHistorial;