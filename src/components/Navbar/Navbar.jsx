import { Link } from "react-router-dom"
import { ToastContainer } from "react-toastify"

export const Navbar = ({handleLogout})=>{


    return <>
        <nav className="h-16 my-2 overflow-hidden text-center w-screen flex items-center justify-center text-xl py-10 border-b border-white">
            <Link className="p-4" to="/">Hour Count</Link>
            <Link className="p-4" to="/hourqt">Cant. de horas</Link>
            <button onClick={handleLogout} className=" bg-black p-2 m-2 rounded text-white">
        Cerrar Sesión
      </button>
      <ToastContainer position="top-center"/>
        </nav>
    </>
}