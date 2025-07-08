import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="min-h-screen">
      <AuthProvider>
        {/* Rutas de la aplicación */}
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
