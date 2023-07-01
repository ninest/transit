import { parse as parseCSV } from "papaparse";

export async function readCSV(filepath: string): Promise<unknown[]> {
  const file = Bun.file(filepath);
  const csv = (await file.text()).trim();
  const object = parseCSV(csv, { header: true });
  return object.data;
}
