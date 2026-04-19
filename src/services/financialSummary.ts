/**
 * 從 assetManager store 抽出「對淨值影響最大的幾個帳戶」，
 * 並組裝給 AI 的 prompt。回應格式固定為 JSON，讓前端能結構化顯示。
 */

import type { useAssetManagerStore } from "../stores/assetManager";

type Store = ReturnType<typeof useAssetManagerStore>;
type AccountType = "asset" | "liability";
type Direction = "positive" | "negative";

export interface TopMover {
  accountId: string;
  accountName: string;
  type: AccountType;
  currency: string;
  delta: number;           // 原幣別變化（可正可負，未套 type sign）
  deltaTwd: number;        // 同上但已換算 TWD
  netImpactTwd: number;    // 對整體淨值的影響（正向 > 0、負向 < 0）
  direction: Direction;
}

export interface AnalysisResult {
  summary: string;
  highlights: Array<
    TopMover & {
      note: string;
    }
  >;
  advice: string;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("zh-TW");
}

/**
 * 產出「給 AI 的完整財務快照」：整體淨值/資產/負債、幣別分佈、近期趨勢、
 * 所有帳戶本月 vs 上月的對照。讓 AI 能基於全貌判斷而非只看三大變動。
 */
export function buildFullSnapshot(store: Store): string {
  const month = store.selectedMonth;
  const prevMonth = store.previousMonth;
  const trend = store.trendRows;
  const curr = trend.find((r) => r.month === month) ?? null;
  const prev = prevMonth ? trend.find((r) => r.month === prevMonth) ?? null : null;

  const lines: string[] = [];
  lines.push(
    `【時間】本月 = ${month}` +
      (prevMonth ? `；上月 = ${prevMonth}` : "（無上月資料）")
  );

  if (curr) {
    lines.push("");
    lines.push("【整體（TWD）】");
    lines.push(
      `  本月：淨值 ${fmt(curr.netTwd)}｜資產 ${fmt(curr.assetTwd)}｜負債 ${fmt(curr.liabilityTwd)}`
    );
    if (prev) {
      const netDelta = curr.netTwd - prev.netTwd;
      const pct = prev.netTwd !== 0 ? (netDelta / prev.netTwd) * 100 : null;
      lines.push(
        `  上月：淨值 ${fmt(prev.netTwd)}｜資產 ${fmt(prev.assetTwd)}｜負債 ${fmt(prev.liabilityTwd)}`
      );
      lines.push(
        `  淨值變化：${netDelta >= 0 ? "+" : ""}${fmt(netDelta)}` +
          (pct === null ? "" : `（${pct.toFixed(1)}%）`)
      );
    }
  }

  const byCurrency = store.currencySummaryRows.filter(
    (r) => r.asset !== 0 || r.liability !== 0
  );
  if (byCurrency.length) {
    lines.push("");
    lines.push("【幣別分佈（本月原幣別）】");
    for (const r of byCurrency) {
      lines.push(
        `  ${r.currency}：資產 ${fmt(r.asset)}｜負債 ${fmt(r.liability)}｜淨值 ${fmt(r.net)}`
      );
    }
  }

  const recent = trend.slice(-6);
  if (recent.length > 1) {
    lines.push("");
    lines.push("【近期淨值趨勢（TWD）】");
    for (const r of recent) {
      lines.push(`  ${r.month}: ${fmt(r.netTwd)}`);
    }
  }

  const snapshots = store.accountSnapshotRows;
  if (snapshots.length) {
    lines.push("");
    lines.push("【所有帳戶本月快照 (名稱｜類型 幣別｜本月｜上月｜變化)】");
    for (const s of snapshots) {
      const prevAmt = s.current - s.delta;
      const typeText = s.type === "asset" ? "資產" : "負債";
      const deltaStr =
        s.delta === 0
          ? "持平"
          : `${s.delta > 0 ? "+" : "-"}${fmt(Math.abs(s.delta))}`;
      const pctStr =
        s.pct === null ? "" : `（${s.pct >= 0 ? "+" : ""}${s.pct.toFixed(1)}%）`;
      lines.push(
        `  - ${s.accountName}｜${typeText} ${s.currency}｜${fmt(s.current)}｜${fmt(prevAmt)}｜${deltaStr}${pctStr}`
      );
    }
  }

  return lines.join("\n");
}

/** 挑出對淨值影響絕對值最大的 N 個帳戶 */
export function pickTopMovers(store: Store, limit = 3): TopMover[] {
  return [...store.accountSnapshotRows]
    .filter((s) => s.delta !== 0)
    .map<TopMover>((s) => {
      const netImpactTwd = s.type === "asset" ? s.deltaTwd : -s.deltaTwd;
      return {
        accountId: s.key,
        accountName: s.accountName,
        type: s.type,
        currency: s.currency,
        delta: s.delta,
        deltaTwd: s.deltaTwd,
        netImpactTwd,
        direction: netImpactTwd >= 0 ? "positive" : "negative"
      };
    })
    .sort((a, b) => Math.abs(b.netImpactTwd) - Math.abs(a.netImpactTwd))
    .slice(0, limit);
}

export function buildSpendingAnalysisPrompt(store: Store, movers: TopMover[]): string {
  const snapshot = buildFullSnapshot(store);

  const moversText = movers.length
    ? movers
        .map((m, i) => {
          const sign = m.delta >= 0 ? "+" : "";
          const typeText = m.type === "asset" ? "資產" : "負債";
          const dirText = m.direction === "positive" ? "對淨值正向" : "對淨值負向";
          return `${i + 1}. ${m.accountName}（${typeText}）：${sign}${fmt(m.delta)} ${m.currency} → ${dirText}`;
        })
        .join("\n")
    : "（本月沒有帳戶變動）";

  const highlightsSchema = movers.length
    ? movers
        .map(
          (m) =>
            `    { "account": "${m.accountName}", "note": "針對這個帳戶的一句話評論（18 字內）" }`
        )
        .join(",\n")
    : `    /* 無帳戶變動時 highlights 請回傳空陣列 [] */`;

  return (
    `你是台灣用戶的個人記帳 AI 助理「小錢包」，個性活潑親切、說話有溫度。\n\n` +
    `以下是使用者完整的財務快照，請仔細看完整體脈絡再分析：\n\n` +
    `${snapshot}\n\n` +
    `【系統已計算：對整體淨值影響最大的 ${movers.length} 個帳戶】\n${moversText}\n\n` +
    `請綜合「整體變化」「幣別分佈」「近期趨勢」「所有帳戶快照」去判斷，` +
    `不要只盯著三大變動看。例如若某資產大跌但同幣別另一帳戶大漲，可能只是內部轉移；` +
    `若淨值整體下滑但有長期投資持續加碼，語氣應鼓勵而非警告。\n\n` +
    `請只回傳純 JSON（嚴禁用 \`\`\` 包起來、嚴禁任何說明文字），格式：\n` +
    `{\n` +
    `  "summary": "基於整體的一句話總結（32 字內，活潑且有洞察，不要只說『資產增加』這種廢話）",\n` +
    `  "highlights": [\n${highlightsSchema}\n  ],\n` +
    `  "advice": "一個具體可執行的小建議（34 字內，扣緊資料，不要空泛）"\n` +
    `}\n\n` +
    `撰寫守則：\n` +
    `- note 呼應該帳戶方向：負向溫柔提醒（如「下個月收斂一下～」）；正向鼓勵（如「繼續保持！」）。\n` +
    `- 全程繁體中文（台灣用語），嚴禁簡體字或純英文句子。\n` +
    `- 可以偶爾搭配 1 個 emoji，不要每句都加。`
  );
}

/**
 * 解析 AI 回傳的 JSON，合併前端已知的金額/方向（以前端為主，避免 AI 亂講）。
 * 解析失敗時丟出錯誤，呼叫端可降級為純文字顯示。
 */
export function parseAnalysisReply(raw: string, movers: TopMover[]): AnalysisResult {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("回應不是 JSON 格式");
  }
  const parsed = JSON.parse(match[0]);

  const aiHighlights: Array<{ account?: string; note?: string }> = Array.isArray(
    parsed?.highlights
  )
    ? parsed.highlights
    : [];

  const merged = movers.map((m) => {
    const hit = aiHighlights.find((h) => h?.account === m.accountName);
    return {
      ...m,
      note: typeof hit?.note === "string" ? hit.note : ""
    };
  });

  return {
    summary: typeof parsed?.summary === "string" ? parsed.summary : "",
    highlights: merged,
    advice: typeof parsed?.advice === "string" ? parsed.advice : ""
  };
}
