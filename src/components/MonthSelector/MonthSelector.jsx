import { useState, useEffect, useCallback } from "react";
import supabase from "../../supabase/supabaseClient";

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
            console.log("Datos obtenidos en móvil:", data);
            setRecords(data);
            console.log("Fetched records:", data);
            calculateTotalHours(data);
        }
    }, []);

    const calculateTotalHours = (records) => {
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
    console.log("Valor limpio:", cleanedValue);

    const [monthName, year] = cleanedValue.split(" ");
    console.log("Mes y Año extraídos:", monthName, year);

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
        <div className="flex w-screen flex-col items justify-center items-center">
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

                {records.length > 0 ? (
                <div className="py-4 w-3/4 flex flex-col items-center justify-center">
                    <h3 className="lg:text-xl py-2">Registros del mes {month}:</h3>
                    <ul>
                        {records.map(({date, hours}, index) => (
                        <div className="grid grid-cols-2 items-center justify-center w-full" key={index}>
                            <div>{date}</div>
                            <div>{hours}</div>
                        </div>
                        ))}
                    </ul>
                    <h4 className="lg:text-xl">Total: {totalHours.hours} horas {totalHours.minutes} minutos</h4>
                </div>
                ) : (
                    <p className="lg:text-xl py-4">No hay registros para este mes</p>
                )}
        </div>
            )
        }