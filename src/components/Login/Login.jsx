import { useState } from 'react';
import supabase from '../../supabase/supabaseClient'; // Asegúrate de que se importe correctamente

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        setError('Error al iniciar sesión: ' + error.message);
    } else {
        console.log('Usuario autenticado:', user);
    }
};

    return (
        <div className='flex flex-col justify-center items-center p-8 w-full border-2 rounded-xl border-white'>
            <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Correo electrónico"
            className='w-3/4 m-1 p-1'
        />
        <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Contraseña"
            className='w-3/4 m-1 p-1'
        />
        <button className='w-3/4 p-2 m-2 bg-black text-white border border-white' onClick={handleLogin}>Iniciar sesión</button>
        {error && <p>{error}</p>}
    </div>
    );
};

