import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  User,
  FileText,
  LogOut,
  Settings,
  BarChart2,
  ClipboardList,
  Users,
  LineChart,
  Droplet,
  CheckSquare
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  const userRole = user.rol;
  const userName = user.nombre || user.nombre_usuario || "Invitado";

  const roleMenus = {
    1: [
      {
        id: "atletas",
        title: "Registrar Atletas",
        icon: <Users className="w-6 h-6" />,
        color: "blue",
        description: "Registro de atletas con su información básica",
        path: "/registrar-atleta"
      },
      {
        id: "nutriologos",
        title: "Registrar Nutriólogos",
        icon: <User className="w-6 h-6" />,
        color: "green",
        description: "Registro de nutriólogos con cédula y perfil profesional",
        path: "/registrar-nutriologo"
      },
      {
        id: "usuarios",
        title: "Crear Usuarios del Sistema",
        icon: <Settings className="w-6 h-6" />,
        color: "purple",
        description: "Asignación de cuentas de acceso a atletas y nutriólogos",
        path: "/usuarios"
      }
    ],    
    2: [
      { id: "patients", title: "Pacientes", icon: <Users className="w-6 h-6" />, color: "blue", description: "Consulta y seguimiento de pacientes" },
      { id: "plans", title: "Planes Alimenticios", icon: <CheckSquare className="w-6 h-6" />, color: "green", description: "Control y edición de planes nutricionales" },
      { id: "hydration", title: "Hidratación", icon: <Droplet className="w-6 h-6" />, color: "cyan", description: "Tasas de sudoración y recomendaciones" },
      { id: "profile", title: "Mi Perfil", icon: <User className="w-6 h-6" />, color: "purple", description: "Gestión de perfil profesional" }
    ],
    3: [
      { id: "myPlan", title: "Mi Plan Nutricional", icon: <FileText className="w-6 h-6" />, color: "green", description: "Visualiza tus comidas y calorías" },
      { id: "myHydration", title: "Mi Hidratación", icon: <Droplet className="w-6 h-6" />, color: "blue", description: "Recomendaciones de hidratación" },
      { id: "progress", title: "Mi Historial", icon: <LineChart className="w-6 h-6" />, color: "orange", description: "Formulario para contestar preguntas sobre mi historial", path: "/mi-historial" },
      { id: "myProfile", title: "Mi Perfil", icon: <User className="w-6 h-6" />, color: "purple", description: "Actualiza tus datos personales" }
    ]
  };

  const roleTitles = {
    1: "Panel de Administrador",
    2: "Panel de Nutriólogo",
    3: "Panel del Atleta"
  };

  const menuItems = roleMenus[userRole] || [];

  const handleLogout = () => {
    Swal.fire({
      title: `¿${userName}, deseas cerrar sesión?`,
      text: "Se cerrará tu sesión actual",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1d4ed8",
      cancelButtonColor: "#6b7280"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        navigate("/");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-blue-800">SISCNMMA</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-6 mt-2">
              <div className="bg-blue-100 rounded-full p-2">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {roleTitles[userRole]}
                </p>
              </div>
            </div>
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${activeMenu === item.id
                          ? `bg-blue-600 text-white`
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => setActiveMenu(item.id)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </button>
                  </li>
                ))}
                <li className="pt-4 mt-4 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-left"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="ml-3">Cerrar sesión</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {roleTitles[userRole]}
            </h1>
            <p className="text-gray-500">Bienvenido de nuevo, {userName}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer border border-gray-100 ${activeMenu === item.id ? "ring-2 ring-blue-500" : ""
                  }`}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  } else {
                    setActiveMenu(item.id);
                  }
                }}

              >
                <div
                  className={`h-2 ${item.color === "blue"
                      ? "bg-blue-500"
                      : item.color === "green"
                        ? "bg-green-500"
                        : item.color === "indigo"
                          ? "bg-indigo-500"
                          : item.color === "red"
                            ? "bg-red-500"
                            : item.color === "gray"
                              ? "bg-gray-600"
                              : item.color === "purple"
                                ? "bg-purple-500"
                                : item.color === "cyan"
                                  ? "bg-cyan-500"
                                  : "bg-orange-500"
                    }`}
                ></div>
                <div className="p-6">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : item.color === "green"
                          ? "bg-green-100 text-green-600"
                          : item.color === "indigo"
                            ? "bg-indigo-100 text-indigo-600"
                            : item.color === "red"
                              ? "bg-red-100 text-red-600"
                              : item.color === "gray"
                                ? "bg-gray-100 text-gray-600"
                                : item.color === "purple"
                                  ? "bg-purple-100 text-purple-600"
                                  : item.color === "cyan"
                                    ? "bg-cyan-100 text-cyan-600"
                                    : "bg-orange-100 text-orange-600"
                      } mb-4`}
                  >
                    {item.icon}
                  </div>
                  <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {activeMenu && (
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">
                {menuItems.find((item) => item.id === activeMenu)?.title}
              </h2>
              <p className="text-gray-600">
                Panel de contenido para{" "}
                {menuItems.find((item) => item.id === activeMenu)?.title}.
                Aquí se mostraría la funcionalidad correspondiente.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
