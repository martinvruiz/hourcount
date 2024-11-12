import { Link } from "react-router-dom"

export const Navbar = ({handleLogout})=>{


    return <>
        <nav className="h-16 w-screen flex items-center justify-center top-0 text-xl border-b border-white">
            <Link className="px-4" to="/">Hour Count</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
        Cerrar Sesión
      </button>
        </nav>
    </>
}