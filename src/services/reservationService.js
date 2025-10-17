import { loadReservations, saveReservations } from '../utils/storage.js';

export const listReservations = () => loadReservations();

export const addReservation = (reservation) => {
  const list = loadReservations();
  // evitar duplicados: mismo espacio + misma fecha + misma hora
  const dup = list.find(r => r.spaceId === reservation.spaceId && r.date === reservation.date && r.time === reservation.time);
  if (dup) throw new Error('Reserva duplicada para ese espacio, fecha y hora');
  list.push(reservation);
  saveReservations(list);
  return reservation;
};

export const removeReservation = (id) => {
  const list = loadReservations().filter(r => r.id !== id);
  saveReservations(list);
};
