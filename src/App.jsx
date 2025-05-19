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
import PlanesAlimenticios from './pages/PlanesAlimenticios'
import NuevoPlan from './pages/NuevoPlan';
import PlanDetalle from './pages/PlanDetalle';
import RegistrarSudoracion from './pages/RegistrarSudoracion';
import HistorialSudoracion from './pages/HistorialSudoracion';

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
      <Route path="/planes" element={<PlanesAlimenticios />} />
      <Route path="/planes/nuevo" element={<NuevoPlan />} />
      <Route path="/planes/:id" element={<PlanDetalle />} />
      <Route path="/registrar-sudoracion" element={<RegistrarSudoracion />} />
      <Route path="/historial-sudoracion" element={<HistorialSudoracion />} />
      
    </Routes>
  )
}