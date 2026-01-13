
import { HOLIDAY_RANGES, SPECIFIC_HOLIDAYS } from '../constants';

export const isDateInRange = (now: Date, start: Date, end: Date): boolean => {
  // Normalize to start and end of day
  const s = new Date(start); s.setHours(0,0,0,0);
  const e = new Date(end); e.setHours(23,59,59,999);
  return now >= s && now <= e;
};

export const isNonSchoolDay = (now: Date): boolean => {
  const dayOfWeek = now.getDay();
  const d = now.getDate();
  const m = now.getMonth();
  const a = now.getFullYear();

  // Fin de semana (0=Domingo, 6=Sábado)
  if (dayOfWeek === 0 || dayOfWeek === 6) return true;

  // Rangos de vacaciones
  for (const range of HOLIDAY_RANGES) {
    if (isDateInRange(now, range.start, range.end)) return true;
  }

  // Festivos específicos
  for (const holiday of SPECIFIC_HOLIDAYS) {
    if (d === holiday.day && m === holiday.month && a === holiday.year) return true;
  }

  return false;
};

export const formatTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};
