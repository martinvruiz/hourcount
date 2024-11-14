import { useState, useEffect, useCallback } from "react";
import supabase from "../../supabase/supabaseClient";
import { ToastContainer,toast } from "react-toastify";

export const MonthSelector = () => {
    const [month, setMonth] = useState(null);
    const [months, setMonths] = useState([]); 
    const [records, setRecords] = useState([]);
    const [totalHours, setTotalHours] = useState({ hours: 0, minutes: 0 })

    const getAvailableMonths = async () => {
        try {
            const { data, error } = await supabase
            .from('workhours')
            .select('date');

        if (error) {
            console.error('Error fetching valid records:', error);
            return;
        }

        const monthsList = data
            .filter(record => record.date)
            .map(record => new Date(record.date).toLocaleString('default', { month: 'long', year: 'numeric' }));

        const uniqueMonths = [...new Set(monthsList)];
            setMonths(uniqueMonths);
        } catch (error) {
            console.error('Error fetching months:', error);
    }
};


    const getRecordsByMonth = useCallback(async (selectedMonth) => {
        if (!selectedMonth) {
            setRecords([]);
            setTotalHours({hours:0, minutes:0})
            return;
        }

        console.log("Mes seleccionado para búsqueda:", selectedMonth);

        const { data, error } = await supabase
            .rpc('filter_by_month', { selected_month: selectedMonth });

        
        if (error) {
            console.error('Error fetching records:', error);
        } else {
            setRecords(data);
            console.log("Fetched records:", data);
            calculateTotalHours(data);
        }
    }, []);

    const calculateTotalHours = (records) => {
        if (!Array.isArray(records)) {
            console.warn("records no es un arreglo válido");
            return;
        }


        let totalMinutes = 0;

        records.forEach(record => {
            const { hours } = record; 

            if (!hours) {
                console.warn('Campo hours vacío o inválido:', record);
                return;
            }

            const hoursMatch = hours.match(/(\d+)\s*h/);
            const minutesMatch = hours.match(/(\d+)\s*m/); 

            const hoursValue = hoursMatch ? parseInt(hoursMatch[1]) : 0;
            const minutesValue = minutesMatch ? parseInt(minutesMatch[1]) : 0; 
        
            totalMinutes += (hoursValue * 60) + minutesValue;
        });

        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60; 

        setTotalHours({ hours: totalHours, minutes: remainingMinutes });
};


const askDelete = (id) => {
    toast.warning(
        <div className='text-black'>
            <span>¿Desea eliminar el registro?</span>
            <div>
                <button
                onClick={() => {
                handleDelete(id);
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


const handleDelete = async (id) => {

    try {
        console.log("Eliminando registro con ID:", id);

        const { error } = await supabase
            .from('workhours')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error al eliminar el registro:", error);
            return;
        }

        console.log("Registro eliminado con éxito");

        
        const updatedRecords = records.filter((record) => record.id !== id);
        setRecords(updatedRecords);

        calculateTotalHours(updatedRecords);


    } catch (error) {
        console.error("Error al eliminar el registro:", error);
    }
};

const handleMonth = (e) => {
    const selected = e.target.value;
    console.log("Valor seleccionado en el dropdown:", selected);

    setRecords([]); 
    setTotalHours({ hours: 0, minutes: 0 });

    if (!selected) {
        console.error("No se seleccionó un mes.");
        return;
    }

    const cleanedValue = selected.replace(" de", "");

    const [monthName, year] = cleanedValue.split(" ");

    if (monthName && year) {
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth(); //
        if (monthIndex === -1) {
            console.error("Mes no válido:", monthName);
            return;
        }

        const formattedMonth = `${year}-${(monthIndex + 1).toString().padStart(2, "0")}`;
        console.log("Mes formateado para la búsqueda:", formattedMonth);

        getRecordsByMonth(formattedMonth);
    } else {
        console.error("Formato de mes inválido:", selected);
    }
};

    useEffect(() => {
        getAvailableMonths();
    }, []);

    useEffect(() => {
    const loadData = async () => {
        await getAvailableMonths();
        if (month) {
            await getRecordsByMonth(month);
        }
    };
    loadData();
}, []);

    return (
        <div className="flex overflow-hidden w-screen flex-col items justify-center items-center">
            <label htmlFor="month-select" className="py-2 lg:text-xl">Selecciona un mes:</label>
            <select
                id="month-select"
                value={month}
                onChange={handleMonth}
                className="py-3 p-2 border rounded"
            >
                <option value="">Selecciona un mes</option>
                    {months.length > 0 &&
                        months.map((month, index) => (
                        <option key={index} value={month}>
                        {month}
                </option>
                ))}
            </select>

                {Array.isArray(records) && records.length > 0 ? (
                <div className="py-4 overflow-hidden flex flex-col items-center justify-center">
                    <h4 className="lg:text-xl font-semibold py-2">Total: {totalHours.hours} horas {totalHours.minutes} minutos</h4>
                    <h3 className="lg:text-xl py-2">Registros del mes {month}:</h3>
                    <ul>
                        {records.map(({id,date, hours}, index) => (
                        <div className= " text-center grid border border-white px-4 py-2 grid-cols-3 items-center justify-center w-full max-w-full" key={index}>
                            <div className="my-1">{date}</div>
                            <div className="my-1">{hours}</div>
                            <button className="border rounded-md p-2 m-3 flex items-center justify-center bg-red-500" onClick={()=>askDelete(id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-white bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </div>
                        ))}
                        <ToastContainer position="top-center" className="text-center"/>
                    </ul>
                </div>
                ) : (
                    <p className="lg:text-xl py-4">No hay registros para este mes</p>
                )}
        </div>
            )
        }