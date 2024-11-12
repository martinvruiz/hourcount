import supabase from "./supabaseClient";

export const saveHoursRecord = async (userId, date, hours) => {
  if (!userId) {
    console.error("Error: userId no está definido.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('workhours')
      .insert([{ user_id:userId, date, hours }]);

    if (error) {
      console.error("Error al guardar el registro de horas: ", error);
    } else {
      console.log("Registro guardado exitosamente: ", data);
    }
    return data;
  } catch (err) {
    console.error('Error al guardar horas:', err);
    throw err;
  }
};

export const getUserRecords = async (userId) => {
  const { data, error } = await supabase
    .from('workhours')
    .select('date, hours')
    .eq('user_id', userId);
  if (error) console.error("Error al obtener los registros: ", error);
  return data;
};