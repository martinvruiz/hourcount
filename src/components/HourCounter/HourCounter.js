import { useState, useEffect } from "react";
import { saveHoursRecord, getUserRecords } from '../../supabase/db';
import supabase from "../../supabase/supabaseClient";
import {Hour} from "../Hour/Hour"

export const HourCounter = () => {
  const [userId, setUserId] = useState(null);
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [dailyHours, setDailyHours] = useState([]);
  const [error, setError] = useState('');


  const loadUserRecords = async (userId) => {
    try {
      const records = await getUserRecords(userId);
      setDailyHours(records || []);
    } catch (err) {
      setError('Error al cargar los registros.');
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data && data.user) {
        setUserId(data.user.id);
        loadUserRecords(data.user.id);
      } else {
        setError("No iniciaste sesión");
      }
    };

    loadUserData();
  }, []);


  const handleSubmit = async () => {
    if (!startDateTime || !endDateTime) return setError('Por favor, ingresa ambas fechas.');

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    const hours = ((endDate - startDate) / (1000 * 60 * 60)).toFixed(2);

    try {
      await saveHoursRecord(userId, new Date().toISOString().split('T')[0], `${hours} horas`);
      await loadUserRecords(userId)
    } catch {
      setError('Hubo un error al guardar las horas.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-2/5">
      <Hour
        startDateTime={startDateTime}
        setStartDateTime={setStartDateTime}     
        endDateTime={endDateTime}
        setEndDateTime={setEndDateTime}         
        handleSubmit={handleSubmit}
      />
      <h3 className="my-4 w-96 text-center text-xl lg:text-3xl">Total de horas registradas</h3>
      <div className="w-96 text-center">
      {dailyHours.length > 0 ? (
          <ul>
            {dailyHours.map((entry, index) => (
              <li key={index}>
                {entry.date}: {entry.hours}
              </li>
            ))}
          </ul>
        ) : (
          <p>{error || "No hay Registros"}</p>
        )}
      </div>
    </div>
  );
};