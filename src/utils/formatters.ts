import type { Currency } from "../types";

const LOCALE_MAP: Record<Currency, string> = {
  TWD: "zh-TW",
  USD: "en-US",
  JPY: "ja-JP"
};

const intFormatter = new Intl.NumberFormat("zh-TW", {
  maximumFractionDigits: 0
});

const twdCurrencyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(LOCALE_MAP[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(amount));
}

export function formatTwd(value: number): string {
  return twdCurrencyFormatter.format(Math.round(value));
}

export function formatInteger(value: number): string {
  return intFormatter.format(Math.round(value));
}

export function formatPct(value: number | null): string {
  if (value === null) {
    return "N/A";
  }
  return `${Math.round(value)}%`;
}
