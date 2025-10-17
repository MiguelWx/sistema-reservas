const KEY = 'reservas_v1';
export const loadReservations = () => {
  const raw = localStorage.getItem(KEY);
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
};
export const saveReservations = (list) => {
  localStorage.setItem(KEY, JSON.stringify(list));
};
