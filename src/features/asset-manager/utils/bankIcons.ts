const iconModules = import.meta.glob("../../../assets/banks/*.svg", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const iconByName = Object.fromEntries(
  Object.entries(iconModules).map(([path, url]) => {
    const filename = path.split("/").pop() ?? "";
    const key = filename.replace(".svg", "");
    return [key, url];
  })
) as Record<string, string>;

const bankIconRules: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /郵局|post/i, key: "post-office" },
  { pattern: /中信|中國信託|ctbc/i, key: "ctbc" },
  { pattern: /台新/i, key: "taishin" },
  { pattern: /玉山|esun/i, key: "esun" },
  { pattern: /彰銀|彰化|chang/i, key: "chang-hwa" },
  { pattern: /國泰|cathay/i, key: "cathay" },
  { pattern: /將來|future/i, key: "future" },
  { pattern: /富邦|fubon/i, key: "fubon" },
  { pattern: /firstrade|ft\s|ft$/i, key: "firstrade" },
  { pattern: /信貸|貸款|loan/i, key: "loan" }
];

export function resolveBankIcon(bankName: string): string {
  for (const rule of bankIconRules) {
    if (rule.pattern.test(bankName)) {
      return iconByName[rule.key] ?? iconByName.default;
    }
  }
  return iconByName.default;
}
