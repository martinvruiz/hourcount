import supabase from './supabaseClient';

export const registerUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Error en el registro: ', error);
    return null;
  }
  return user;
};


export const loginUser = async (email, password) => {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Error al iniciar sesión: ', error);
    return null;
  }
  return user;
};


export const logoutUser = async () => {
  await supabase.auth.signOut();
};