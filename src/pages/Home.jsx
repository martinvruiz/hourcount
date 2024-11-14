
import { HourCounter } from "../components/HourCounter/HourCounter"
import supabase from "../supabase/supabaseClient"
import { useEffect, useState } from "react"

export const Home = ()=>{
    const [userName, setUserName] = useState("")

    const getUserDisplayName = async () => {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error("Error obteniendo el usuario:", error);
            return null;
        }
    
        const displayName = data?.user?.user_metadata?.display_name;
        setUserName(displayName || "usuario")
    };

    useEffect(()=>{
        getUserDisplayName()
    },[])

    return <>
    
    <div className="flex flex-col items-center justify-center py-4">
        <h3 className="py-4 text-xl lg:text-4xl">Bienvenido, {userName}!</h3>
        <h4 className="pb-3 text-lg lg:text-3xl">Ingresa tu horario</h4>
        <HourCounter/>
    </div>
    
    </>
}