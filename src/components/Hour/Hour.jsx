

export const Hour = ({startDateTime, setStartDateTime, endDateTime, setEndDateTime, handleSubmit})=>{

    const onSubmit = (e)=>{
        e.preventDefault()
        handleSubmit(startDateTime,endDateTime)
    }
    
    return <>
    
        <div className="w-96 border border-white py-4 flex flex-col items-center justify-center">
            <form className="w-full flex flex-col items-center justify-center" onSubmit={onSubmit}>
                <label className="flex flex-col items-center w-full" htmlFor="">
                    <p className="py-1">Hora de Entrada:</p>
                    <input className="p-1 rounded-md border-2 border-black" type="datetime-local" value={startDateTime} onChange={(e)=> setStartDateTime(e.target.value)}/>
                </label>
                <label className="flex flex-col items-center" htmlFor="">
                    <p className="py-1">Hora de Salida:</p>
                    <input className="p-1 rounded-md border-2 border-black" type="datetime-local" value={endDateTime} onChange={(e)=> setEndDateTime(e.target.value)}/>
                </label>
                <button className="border border-white p-4 my-4 bg-black text-white rounded-lg" type="submit">Calcular y guardar</button>
            </form>
        </div>
    
    </>
}