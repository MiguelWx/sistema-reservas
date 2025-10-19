import { loadReservations, saveReservations } from "../utils/storage.js";

// helpers
const toMinutes = (t) => {
  if (!t || typeof t !== "string") return NaN;
  const parts = t.split(":");
  if (parts.length < 2) return NaN;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
  return h * 60 + m;
};
const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
};
const round2 = (v) => Math.round(v * 100) / 100;

// Normaliza reserva y asegura duration (horas, con 2 decimales)
const normalizeReservation = (r) => {
  const copy = { ...r };

  // si tiene timeStart & timeEnd -> calcular duration si falta
  if (copy.timeStart && copy.timeEnd) {
    const s = toMinutes(copy.timeStart);
    const e = toMinutes(copy.timeEnd);
    if (!Number.isNaN(s) && !Number.isNaN(e) && e > s) {
      const durHours = (e - s) / 60;
      copy.duration = typeof copy.duration === "number" && !Number.isNaN(copy.duration)
        ? copy.duration
        : round2(durHours);
      return copy;
    }
  }

  // caso antiguo: tiene `time` (instante) -> convertir a intervalo de 1h ó usar duration si viene
  if (copy.time) {
    const start = copy.time;
    const duration = copy.duration ? Number(copy.duration) : 1;
    const startMin = toMinutes(start);
    if (!Number.isNaN(startMin)) {
      copy.timeStart = start;
      copy.duration = Number(duration) || 1;
      copy.timeEnd = minutesToTime(startMin + (Number(duration) || 1) * 60);
      // asegurar duración en horas con 2 decimales
      copy.duration = round2((toMinutes(copy.timeEnd) - toMinutes(copy.timeStart)) / 60);
      return copy;
    }
  }

  // si no hay nada, poner un intervalo por defecto para no romper
  if (!copy.timeStart || !copy.timeEnd) {
    copy.timeStart = copy.timeStart || "00:00";
    copy.timeEnd = copy.timeEnd || "01:00";
    const s = toMinutes(copy.timeStart);
    const e = toMinutes(copy.timeEnd);
    copy.duration = !Number.isNaN(s) && !Number.isNaN(e) && e > s ? round2((e - s) / 60) : 1;
  }

  return copy;
};

export const listReservations = () => {
  try {
    const raw = loadReservations() || [];
    return raw.map(normalizeReservation);
  } catch (err) {
    console.error("Error reading reservations:", err);
    return [];
  }
};

export const addReservation = (reservation) => {
  if (!reservation || !reservation.spaceId || !reservation.date) {
    throw new Error("Reserva inválida: falta espacio o fecha.");
  }

  const res = normalizeReservation(reservation);
  const listRaw = loadReservations() || [];
  const list = listRaw.map(normalizeReservation);

  const bStart = toMinutes(res.timeStart);
  const bEnd = toMinutes(res.timeEnd);
  if (Number.isNaN(bStart) || Number.isNaN(bEnd) || bStart >= bEnd) {
    throw new Error("Formato de hora inválido en la reserva (timeStart/timeEnd).");
  }

  const dup = list.find((r) => {
    if (r.spaceId !== res.spaceId) return false;
    if (r.date !== res.date) return false;
    const aStart = toMinutes(r.timeStart);
    const aEnd = toMinutes(r.timeEnd);
    if (Number.isNaN(aStart) || Number.isNaN(aEnd)) return false;
    return aStart < bEnd && bStart < aEnd;
  });

  if (dup) {
    throw new Error("Reserva solapada: ese espacio ya está ocupado en ese rango de tiempo.");
  }

  // Guardamos la versión normalizada (que contiene duration)
  const toSave = [...listRaw, { ...res }];
  saveReservations(toSave);
  return res;
};

export const removeReservation = (id) => {
  try {
    const list = loadReservations() || [];
    const filtered = list.filter((r) => r.id !== id);
    saveReservations(filtered);
  } catch (err) {
    console.error("Error al eliminar reserva:", err);
  }
};