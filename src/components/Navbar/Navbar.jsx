import { Link } from "react-router-dom"

export const Navbar = ({handleLogout})=>{


    return <>
        <nav className="h-16 w-screen flex items-center justify-center top-0 text-xl border-b border-white">
            <Link className="px-4" to="/">Hour Count</Link>
            <Link className="px-4" to="/hourqt">Cant. de horas</Link>
            <button onClick={handleLogout} className="border-4 border-red-500 p-1 rounded">
        Cerrar Sesión
      </button>
        </nav>
    </>
}