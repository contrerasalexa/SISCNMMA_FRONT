import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, UserIcon, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar sesión
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirigir según el rol
        switch (data.user.rol) {
          case 1: navigate('/dashboard'); break; // Admin
          case 2: navigate('/dashboard'); break; // Nutriólogo
          case 3: navigate('/dashboard'); break; // Atleta
          default: setErrorMessage('Rol no válido');
        }
      } else {
        setErrorMessage(data.error || 'Credenciales inválidas');
      }
    } catch (error) {
      setErrorMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-teal-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full shadow-lg mb-6">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-16 h-16 rounded-full object-cover" 
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-500 mt-2">Ingresa tus datos para continuar</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Correo */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mensaje de error */}
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}

          {/* Checkbox y link */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mr-2 text-blue-500 border-gray-300 rounded" />
              Recordarme
            </label>
            <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
