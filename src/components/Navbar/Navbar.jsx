import { Link } from "react-router-dom"

export const Navbar = ({handleLogout})=>{


    return <>
        <nav className="h-16 my-2 text-center w-screen flex items-center justify-center text-xl py-10 border-b border-white">
            <Link className="m-4" to="/">Hour Count</Link>
            <Link className="m-4" to="/hourqt">Cant. de horas</Link>
            <button onClick={handleLogout} className=" bg-red-500 m-4 rounded text-white">
        Cerrar Sesión
      </button>
        </nav>
    </>
}