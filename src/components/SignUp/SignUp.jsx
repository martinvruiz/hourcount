import React, { useState } from 'react';
import supabase from '../../supabase/supabaseClient';

export const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('')
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
  
    const handleRegister = async (e) => {
      e.preventDefault();
      setError(null);
      try {
        const {  error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: userName },
          },
        });
  
        if (error) {
          setError("Error al registrar el usuario: " + error.message);
        } else {
          setSuccess("Usuario registrado con éxito, revisa tu correo para confirmar la cuenta. (Puede tardar hasta 6 horas)");
        }
      } catch (err) {
        setError("Error en el registro: " + err.message);
      }
    };
  
    return (
      <form onSubmit={handleRegister} className="flex flex-col justify-center items-center m-4 p-4 w-full border-2 rounded-xl border-white">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-3/4 m-1 p-1'
        />
        <input
          type="name"
          placeholder="Nombre de usuario"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className='w-3/4 m-1 p-1'
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='w-3/4 m-1 p-1'
        />
        <button className='w-3/4 p-2 m-2 bg-black text-white border border-white' type="submit">Registrarse</button>
        {error && <p className='text-center p-1'>{error}</p>}
        {success && <p className='text-center p-1'>{success}</p>}
      </form>
    );
  };