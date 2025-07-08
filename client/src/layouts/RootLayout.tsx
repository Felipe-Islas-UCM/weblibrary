import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";


//Layout principal de la aplicación
//Contiene el topbar y el outlet para las rutas hijas
export default function RootLayout() {
    return (
        <div>
            <TopBar />
            <Outlet />
        </div>
    )
}