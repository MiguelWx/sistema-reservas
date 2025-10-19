import { describe, it, expect, beforeEach } from 'vitest';
import { addReservation, listReservations } from '../services/reservationService.js';

beforeEach(() => {
  // Polyfill simple de localStorage para el entorno de tests (Node)
  globalThis.localStorage = {
    _data: {},
    setItem(key, value) { this._data[key] = String(value); },
    getItem(key) { return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null; },
    removeItem(key) { delete this._data[key]; },
    clear() { this._data = {}; }
  };
});

describe('SErvicio reserva - intervalos y duracion', () => {
  it('calcula duration y evita solapamientos', () => {
    const r1 = { id: 'r1', name: 'Miguel', date: '2025-10-29', timeStart: '00:40', timeEnd: '02:00', spaceId: 'aula-1' };
    const added = addReservation(r1);
    // duration debe calcularse ~ 1.33 horas (80 minutos -> 1.33)
    expect(added.duration).toBeCloseTo(1.33, 2);

    // intentar reservar solapado (01:30 - 02:30) en la misma aula -> debe lanzar
    const r2 = { id: 'r2', name: 'Ana', date: '2025-10-29', timeStart: '01:30', timeEnd: '02:30', spaceId: 'aula-1' };
    expect(() => addReservation(r2)).toThrow();

    // reservar en otra aula a la misma hora debe funcionar
    const r3 = { id: 'r3', name: 'Pedro', date: '2025-10-29', timeStart: '01:30', timeEnd: '02:30', spaceId: 'aula-2' };
    addReservation(r3);
    const all = listReservations();
    expect(all.length).toBe(2);
  });
});