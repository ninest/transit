import { readCSV } from "./utils/file.js";

const calendar = await readCSV("./data/MBTA_GTFS/calendar.txt");

export interface DaysOperating {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export function getDaysOperating(serviceId: string) {
  const row = calendar.find((r) => r.service_id === serviceId);
  const operatingDays: DaysOperating = {
    // Might be "1" or 1
    monday: row.monday == 1,
    tuesday: row.tuesday == 1,
    wednesday: row.wednesday == 1,
    thursday: row.thursday == 1,
    friday: row.friday == 1,
    saturday: row.saturday == 1,
    sunday: row.sunday == 1,
  };
  return operatingDays;
}
