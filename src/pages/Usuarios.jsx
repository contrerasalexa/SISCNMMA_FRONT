import React, { useEffect, useState } from "react";
import {
  PlusCircle, Pencil, User, Mail, Shield, ToggleRight, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState(null);
  const [atletasDisponibles, setAtletasDisponibles] = useState([]);
  const [nutriologosDisponibles, setNutriologosDisponibles] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre_usuario: "",
    email: "",
    password: "",
    rol: 1
  });

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (!usuarioEnEdicion) {
      if (nuevoUsuario.rol === 2) {
        fetch(`${API}/api/nutriologos/opciones`)
          .then(res => res.json())
          .then(data => setNutriologosDisponibles(data.nutriologos));
      } else if (nuevoUsuario.rol === 3) {
        fetch(`${API}/api/atletas/opciones`)
          .then(res => res.json())
          .then(data => setAtletasDisponibles(data.atletas));
      }
    }
  }, [nuevoUsuario.rol]);

  const fetchUsuarios = () => {
    setIsLoading(true);
    fetch(`${API}/api/usuarios`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsuarios(data.usuarios);
      })
      .catch((error) => console.error("Error cargando usuarios:", error))
      .finally(() => setIsLoading(false));
  };

  const toggleEstatus = async (id, estatusActual) => {
    const nuevoEstatus = estatusActual === 1 ? 2 : 1;
    try {
      const response = await fetch(`${API}/api/usuarios/estatus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevoEstatus })
      });

      if (response.ok) {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id_usuario === id ? { ...u, estatus: nuevoEstatus } : u
          )
        );
      } else {
        console.error("Error al cambiar estatus");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const abrirModalNuevo = () => {
    setUsuarioEnEdicion(null);
    setNuevoUsuario({
      nombre_usuario: "",
      email: "",
      password: "",
      rol: 1,
      id: ""
    });
    setShowModal(true);
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioEnEdicion(usuario);
    setNuevoUsuario({
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
      id: usuario.id_usuario
    });
    setShowModal(true);
    if (data.success) {
      let mensaje = "Usuario registrado correctamente.";
      if (!usuarioEnEdicion && (nuevoUsuario.rol === 2 || nuevoUsuario.rol === 3)) {
        mensaje += `\n\n📧 Correo: ${nuevoUsuario.email}\n🔑 Contraseña: ${nuevoUsuario.password}`;
      }
    
      alert(mensaje);
      fetchUsuarios();
      setShowModal(false);
      setNuevoUsuario({ nombre_usuario: "", email: "", password: "", rol: 1, id: "" });
      setUsuarioEnEdicion(null);
    }
    
  };

  const generarPasswordDesdeFecha = (fecha) => {
    const date = new Date(fecha);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}${mm}${yyyy}`;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const payload = {
      nombre_usuario: nuevoUsuario.nombre_usuario,
      email: nuevoUsuario.email,
      rol: nuevoUsuario.rol,
      password: nuevoUsuario.password,
      id: nuevoUsuario.id

    };
    if (nuevoUsuario.rol === 2 || nuevoUsuario.rol === 3) {
      payload.id = nuevoUsuario.id;
    }
    const url = usuarioEnEdicion
      ? `${API}/api/usuarios/${usuarioEnEdicion.id_usuario}`
      : `${API}/api/usuarios`;

    const method = usuarioEnEdicion ? "PUT" : "POST";

    if (usuarioEnEdicion && !nuevoUsuario.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        let mensaje = "Usuario registrado correctamente.";
        if (!usuarioEnEdicion && (nuevoUsuario.rol === 2 || nuevoUsuario.rol === 3)) {
          mensaje += `\n\n📧 Correo: ${nuevoUsuario.email}\n🔑 Contraseña: ${nuevoUsuario.password}`;
        }
      
        alert(mensaje);
      
        fetchUsuarios();
        setShowModal(false);
        setNuevoUsuario({ nombre_usuario: "", email: "", password: "", rol: 1, id: "" });
        setUsuarioEnEdicion(null);      
      } else {
        alert(data.error || "Error al guardar");
      }
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }

    
  };

  const getBadgeColor = (rol) => {
    switch (rol) {
      case 1: return "bg-purple-100 text-purple-800";
      case 2: return "bg-blue-100 text-blue-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getRolName = (rol) => {
    switch (rol) {
      case 1: return "Administrador";
      case 2: return "Nutriólogo";
      default: return "Atleta";
    }
  };

  const eliminarUsuario = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirm) return;
  
    try {
      const response = await fetch(`${API}/api/usuarios/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
  
      if (data.success) {
        fetchUsuarios(); // recargar lista
      } else {
        alert("Error al eliminar: " + data.error);
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Regresar</span>
          </button>
          <span className="text-blue-700 font-bold text-lg">SISCNMMA</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <User className="mr-2 text-blue-600 h-8 w-8" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-500 mt-1">Administra las cuentas de los usuarios del sistema</p>
          </div>
          <button
            onClick={abrirModalNuevo}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Usuarios Registrados</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-gray-500 italic">No hay usuarios registrados.</td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                      <tr key={usuario.id_usuario}>
                        <td className="px-6 py-4">{usuario.nombre_usuario}</td>
                        <td className="px-6 py-4">{usuario.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(usuario.rol)}`}>
                            {getRolName(usuario.rol)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={usuario.estatus === 1}
                              onChange={() => toggleEstatus(usuario.id_usuario, usuario.estatus)}
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
                            <span className={`ml-3 text-sm ${usuario.estatus === 1 ? "text-green-600" : "text-red-600"}`}>
                              {usuario.estatus === 1 ? "Activo" : "Bloqueado"}
                            </span>
                          </label>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-3 justify-end">
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => abrirModalEdicion(usuario)}
                            >
                              Editar
                            </button>
                            <button
                              className="text-red-600 hover:underline"
                              onClick={() => eliminarUsuario(usuario.id_usuario)}
                            >
                              Eliminar
                            </button>
                          </div>


                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                {usuarioEnEdicion ? "Editar Usuario" : "Registrar Nuevo Usuario"}
              </h2>
              <form onSubmit={handleGuardar} className="space-y-4">
                {nuevoUsuario.rol === 2 && !usuarioEnEdicion && (
                  <select className="w-full border rounded px-4 py-2" onChange={(e) => {
                    const selected = nutriologosDisponibles.find(n => n.id === parseInt(e.target.value));
                    if (selected) {
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        id: selected.id,
                        nombre_usuario: selected.nombre_completo,
                        email: selected.email,
                        password: generarPasswordDesdeFecha(selected.fecha_nacimiento)
                      });
                    }
                  }}>
                    <option value="">Selecciona un nutriólogo</option>
                    {nutriologosDisponibles.map(n => (
                      <option key={n.id} value={n.id}>{n.nombre_completo}</option>
                    ))}
                  </select>
                )}

                {nuevoUsuario.rol === 3 && !usuarioEnEdicion && (
                  <select className="w-full border rounded px-4 py-2" onChange={(e) => {
                    const selected = atletasDisponibles.find(a => a.id === parseInt(e.target.value));
                    if (selected) {
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        id: selected.id,
                        nombre_usuario: selected.nombre_completo,
                        email: selected.email,
                        password: generarPasswordDesdeFecha(selected.fecha_nacimiento)
                      });
                    }
                  }}>
                    <option value="">Selecciona un atleta</option>
                    {atletasDisponibles.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre_completo}</option>
                    ))}
                  </select>
                )}

                {/* Campos manuales para Administrador o edición */}
                {(nuevoUsuario.rol === 1 || usuarioEnEdicion) && (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      className="w-full border rounded px-4 py-2"
                      value={nuevoUsuario.nombre_usuario}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre_usuario: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      className="w-full border rounded px-4 py-2"
                      value={nuevoUsuario.email}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      className="w-full border rounded px-4 py-2"
                      value={nuevoUsuario.password}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
                    />
                  </>
                )}

                <select
                  className="w-full border rounded px-4 py-2"
                  value={nuevoUsuario.rol}
                  onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: parseInt(e.target.value) })}
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Nutriólogo</option>
                  <option value={3}>Atleta</option>
                </select>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => {
                      setShowModal(false);
                      setUsuarioEnEdicion(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
