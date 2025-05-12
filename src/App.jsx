import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from "./pages/Usuarios";
import MiHistorial from './pages/MiHistorial'
import RegistrarAtleta from './pages/RegistrarAtleta';
import RegistrarNutriologo from './pages/RegistrarNutriologo'
import Nutriologos from './pages/Nutriologos';
import Atletas from './pages/Atletas';
/*import UserPanel from './pages/UserPanel'
import PlanAlimenticio from './pages/PlanAlimenticio'
import Hidratacion from './pages/Hidratacion'
import TasaSudoracion from './pages/TasaSudoracion'*/

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/mi-historial" element={<MiHistorial />} />
      <Route path="/registrar-atleta" element={<RegistrarAtleta />} />
      <Route path="/registrar-nutriologo" element={<RegistrarNutriologo />} />
      <Route path="/nutriologos" element={<Nutriologos />} />
      <Route path="/atletas" element={<Atletas />} />
      
    </Routes>
  )
}