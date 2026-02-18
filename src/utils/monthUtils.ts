export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function monthToValue(month: string): number {
  const [year, mon] = month.split("-").map((item) => Number(item));
  return year * 100 + mon;
}

export function monthToTimestamp(month: string): number {
  const [year, mon] = month.split("-").map((item) => Number(item));
  return new Date(year, mon - 1, 1).getTime();
}

export function monthToEndTimestamp(month: string): number {
  const [year, mon] = month.split("-").map((item) => Number(item));
  return new Date(year, mon, 0, 23, 59, 59, 999).getTime();
}

export function timestampToMonth(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}
