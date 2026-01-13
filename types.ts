
export interface BellSchedule {
  hour: number;
  minute: number;
  label: string;
}

export interface HolidayRange {
  start: Date;
  end: Date;
  name: string;
}

export interface SpecificHoliday {
  day: number;
  month: number;
  year: number;
  name: string;
}
