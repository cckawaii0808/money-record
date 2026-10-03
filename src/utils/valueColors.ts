/** 變動值依影響方向判色；零、缺資料與無法計算皆為中性。 */
export function changeColor(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value) || value === 0) return "text-sub";
  return value > 0 ? "text-positive" : "text-negative";
}

/** 一般金額不代表獲利或虧損，負值仍使用主文字色。 */
export function amountColor(value: number | null | undefined): string {
  return value == null || !Number.isFinite(value) || value === 0 ? "text-sub" : "text-main";
}
