import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './pages/Home';
import { useState, useEffect } from 'react';
import supabase from './supabase/supabaseClient';
import { Login } from './components/Login/Login';
import { SignUp } from './components/SignUp/SignUp';
import { HourQt } from './pages/HourQt';
import {  toast } from 'react-toastify';
import "react-toastify/ReactToastify.css"

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getSession();
      setUser(user || null);
    };

    getCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const askLogout = () => {
    toast.warn(
      <div className='text-black'>
        <span>¿Cerrar sesión?</span>
        <div>
          <button
            onClick={() => {
              handleLogout();
              toast.dismiss();
            }}
            className=' bg-black text-white rounded-md my-2 mx-6 px-2'
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss()}
            className=' bg-black text-white rounded-md my-2 mx-6 px-2'
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error al cerrar sesión:", error);
    } else {
      setUser(null);
    }
  };


  return (
    <div className="font-ubuntu flex flex-col items-center min-h-screen overflow-hidden bg-gradient-to-r from-teal-700 to-orange-400">
      {!user ? (
        <div className='lg:w-2/5 pt-8 flex flex-col items-center'>
          <h2 className='text-xl lg:text-3xl'>Iniciar sesión</h2>
          <Login setUser={setUser} />

          <h2 className='text-xl lg:text-3xl'>Registrarse</h2>
          <SignUp setUser={setUser} />
        </div>
      )  : (
        <BrowserRouter>
          <Navbar  handleLogout={askLogout}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hourqt" element={<HourQt />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;