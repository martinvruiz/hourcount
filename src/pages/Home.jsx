
import { HourCounter } from "../components/HourCounter/HourCounter"


export const Home = ()=>{

    return <>
    
    <div className="flex flex-col items-center justify-center py-4">
        <h3 className="py-4 text-xl lg:text-4xl">Ingresa tu horario</h3>
        <HourCounter/>
    </div>
    
    </>
}