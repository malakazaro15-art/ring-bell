
import { BellSchedule, HolidayRange, SpecificHoliday } from './types';

export const BELL_SCHEDULE: BellSchedule[] = [
  { hour: 8, minute: 30, label: "Entrada" },
  { hour: 9, minute: 20, label: "Cambio Clase" },
  { hour: 10, minute: 15, label: "Cambio Clase" },
  { hour: 11, minute: 10, label: "Recreo Inicio" },
  { hour: 11, minute: 40, label: "Recreo Fin" },
  { hour: 12, minute: 30, label: "Cambio Clase" },
  { hour: 13, minute: 25, label: "Cambio Clase" },
  { hour: 14, minute: 20, label: "Salida" }
];

export const HOLIDAY_RANGES: HolidayRange[] = [
  { start: new Date(2025, 11, 20), end: new Date(2026, 0, 7), name: "Navidad" },
  { start: new Date(2026, 1, 16), end: new Date(2026, 1, 17), name: "Carnaval" },
  { start: new Date(2026, 2, 27), end: new Date(2026, 3, 6), name: "Semana Santa" }
];

export const SPECIFIC_HOLIDAYS: SpecificHoliday[] = [
  { day: 12, month: 9, year: 2025, name: "Hispanidad" }, // Octubre is index 9
  { day: 13, month: 9, year: 2025, name: "Puente" },
  { day: 31, month: 9, year: 2025, name: "Puente" },
  { day: 1, month: 10, year: 2025, name: "Todos los Santos" },
  { day: 6, month: 11, year: 2025, name: "Constitución" },
  { day: 8, month: 11, year: 2025, name: "Inmaculada" },
  { day: 23, month: 3, year: 2026, name: "Día Comunidad" },
  { day: 24, month: 3, year: 2026, name: "Puente" },
  { day: 1, month: 4, year: 2026, name: "Día del Trabajo" }
];

export const DURACION_TIMBRE_MS = 5000;
