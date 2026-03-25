import Papa from 'papaparse';

export function parseCsv(content: string) {
  const result = Papa.parse(content, { header: true, skipEmptyLines: true });
  if (result.errors.length) throw new Error('CSV parse error');
  return result.data as any[];
}

export function toCsv(rows: any[]) {
  return Papa.unparse(rows);
}
