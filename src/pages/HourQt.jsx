import { MonthSelector } from "../components/MonthSelector/MonthSelector"


export const HourQt = ()=>{
    return <>
    
        <div className="py-4 overflow-hidden flex flex-col items-center justify-center">
            <h3 className="text-xl lg:text-3xl py-4">Cantidad de horas trabajadas</h3>
            <MonthSelector/>
        </div>

    </>
}