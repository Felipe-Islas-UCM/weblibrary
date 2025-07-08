import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import PrestamosView from "../pages/PrestamosView";
import MultasView from "../pages/MultasView";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Login";
import NewLibro from "../pages/NewLibro";
import NewPrestamo from "../pages/NewPrestamo";
import SearchLector from "../pages/SearchLector";
import Devoluciones from "../pages/Devoluciones";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Registro from "../pages/Registro";
import About from "../pages/About";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registro",
    element: <Registro />,  
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        // Rutas protegidas para LECTOR
        element: <ProtectedRoute allowedRoles={['LECTOR']} />,
        children: [
          {
            path: "/my-prestamos",
            element: <PrestamosView />,
          },
          {
            path: "/my-multas",
            element: <MultasView />,
          },
        ],
      },
      {
        // Rutas protegidas para ADMIN
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            path: "/new-libro",
            element: <NewLibro />,
          },
          {
            path: "/new-prestamo",
            element: <NewPrestamo />,
          },
          {
            path: "/lector",
            element: <SearchLector />,
          },
          {
            path: "/devoluciones",
            element: <Devoluciones />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);