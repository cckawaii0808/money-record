import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
// SelectOption 本地定義取代 naive-ui 的版本
interface SelectOption { label: string; value: string | number; }

import { EARLIEST_SELECTABLE_MONTH } from "../constants";
import type { Account, AccountType, Currency, Holding, InvestmentSnapshotPoint, MonthlyRecord } from "../types";
import { formatCurrency, formatDecimal, formatPct } from "../utils/formatters";
import {
  getCurrentMonth,
  monthToEndTimestamp,
  monthToTimestamp,
  monthToValue,
  timestampToMonth
} from "../utils/monthUtils";
import { resolveBankIcon } from "../features/asset-manager/utils/bankIcons";
import { isMockMode } from "../firebase";
import { useAuth } from "../composables/useAuth";
import { getLeaderboard, updateMyProfile, type LeaderboardData } from "../services/leaderboardApi";
import { seedAccounts, seedRecords, seedInvestments } from "../data";
import axios from "axios";
import {
  getHoldings as apiGetHoldings,
  createHolding as apiCreateHolding,
  updateHolding as apiUpdateHolding,
  deleteHolding as apiDeleteHolding,
  takeSnapshot as apiTakeSnapshot,
  getSnapshots as apiGetSnapshots
} from "../services/holdingsApi";
import {
  bulkUpsertMonthlyRecords as apiBulkUpsertMonthlyRecords,
  createAccount as apiCreateAccount,
  deleteAccount as apiDeleteAccount,
  getAccounts as apiGetAccounts,
  getMonthlyRecords as apiGetMonthlyRecords,
  reorderAccounts as apiReorderAccounts,
  updateAccount as apiUpdateAccount,
} from "../services/accountsApi";

// --- 介面定義 (Interfaces) ---

export interface CurrencySummaryRow {
  key: string;
  currency: Currency;
  asset: number;
  liability: number;
  net: number;
}

export interface TrendRow {
  key: string;
  month: string;
  assetTwd: number;
  liabilityTwd: number;
  netTwd: number;
  delta: number;
  pct: number | null;
}

export interface AccountSnapshotRow {
  key: string;
  accountName: string;
  category: string;
  type: AccountType;
  currency: Currency;
  current: number;
  delta: number;
  deltaTwd: number;
  pct: number | null;
  netImpactTwd: number;
}

export interface SingleAccountTrendRow {
  key: string;
  month: string;
  amount: number;
  delta: number;
  pct: number | null;
}

export interface CombinedWaterPoint {
  key: string;
  month: string;
  totalTwd: number;
}

export interface CombinedWaterBreakdownRow {
  accountId: string;
  accountName: string;
  type: AccountType;
  currency: Currency;
  amount: number;
  signedTwd: number;
}

export interface CombinedWaterPointDetail extends CombinedWaterPoint {
  breakdown: CombinedWaterBreakdownRow[];
}

export interface ActionResult {
  type: "success" | "error";
  message: string;
}

export const useAssetManagerStore = defineStore("assetManager", () => {
  // --- 狀態管理 (State) ---
  const accounts = ref<Account[]>([]);
  const records = ref<MonthlyRecord[]>([]);
  const holdings = ref<Holding[]>([]);
  const investmentSnapshots = ref<InvestmentSnapshotPoint[]>([]);
  const isLoading = ref(false); // 資料載入中狀態

  // 匯率相關狀態
  const fxRates = ref<Record<Exclude<Currency, "TWD">, number>>({
    USD: 31.25,
    JPY: 0.21
  });
  const fxLoading = ref(false);
  const fxError = ref("");
  const fxUpdatedAt = ref("");
  const fxSource = "open.er-api.com";
  let dataInitialized = false; // 是否已初始化資料
  let dataInitializing = false;
  let sessionSeq = 0;
  const { user } = useAuth();
  let activeUid: string | null = null;
  let investmentSnapshotsRequestSeq = 0;

  const leaderboard = ref<LeaderboardData | null>(null);
  const leaderboardLoading = ref(false);
  const leaderboardError = ref("");
  const leaderboardOffset = ref(0);
  const leaderboardLimit = 20;
  const myRank = computed(() => leaderboard.value?.myRank ?? null);
  let leaderboardRequestSeq = 0;
  // 成功同步的 UID 保留紀錄；失敗僅於下一次載入重試。
  const profileRequests = new Map<string, Promise<void>>();
  const profileDisplayNames = new Map<string, string>();

  function syncLeaderboardProfile(uid: string): Promise<void> | undefined {
    if (isMockMode) return;
    const existing = profileRequests.get(uid);
    if (existing) return existing;
    const name = profileDisplayNames.get(uid);
    if (!name) return;
    let sent = false;
    const request = Promise.resolve().then(() => {
      if (uid !== activeUid) return;
      sent = true;
      return updateMyProfile(name);
    }).then(() => {
      // 尚未送出就切換 UID，不能視為已成功同步。
      if (!sent && profileRequests.get(uid) === request) profileRequests.delete(uid);
    }).catch((error) => {
      if (profileRequests.get(uid) === request) profileRequests.delete(uid);
      console.warn("排行榜暱稱同步失敗，仍會載入排行榜：", error);
    });
    profileRequests.set(uid, request);
    return request;
  }

  function resetSession(uid: string | null) {
    activeUid = uid;
    sessionSeq++;
    investmentSnapshotsRequestSeq++;
    leaderboardRequestSeq++;
    accounts.value = [];
    records.value = [];
    holdings.value = [];
    investmentSnapshots.value = [];
    selectedAccountIds.value = [];
    selectedMonth.value = getCurrentMonth();
    rangeStartMonth.value = EARLIEST_SELECTABLE_MONTH;
    rangeEndMonth.value = getCurrentMonth();
    newAccount.value = { name: "", category: "", type: "asset", currency: "TWD" };
    dataInitialized = false;
    dataInitializing = false;
    isLoading.value = false;
    leaderboard.value = null;
    leaderboardError.value = "";
    leaderboardLoading.value = false;
    leaderboardOffset.value = 0;
  }

  async function initializeLeaderboard(uid: string | null, displayName?: string | null) {
    if (!activeUid || (!isMockMode && uid !== activeUid)) return;
    if (!isMockMode && uid) {
      const name = (displayName?.trim() || "使用者").slice(0, 50).trim();
      profileDisplayNames.set(uid, name);
    }
    await fetchLeaderboard(0);
  }

  async function fetchLeaderboard(offset = leaderboardOffset.value) {
    const uid = activeUid;
    if (!uid) return;
    const requestSeq = ++leaderboardRequestSeq;
    leaderboardLoading.value = true;
    leaderboardError.value = "";
    try {
      await syncLeaderboardProfile(uid);
      if (requestSeq !== leaderboardRequestSeq || uid !== activeUid) return;
      const data: LeaderboardData = isMockMode ? {
        entries: [{ rank: 1, publicId: "local-demo", displayName: "示範使用者", netWorthTwd: 123456.78, updatedAt: null, isCurrentUser: true }],
        totalUsers: 1, myRank: 1, balanceMonth: getCurrentMonth(), generatedAt: "本地示範資料",
        fx: { USD: 0, JPY: 0, updatedAt: null, isStale: true },
      } : await getLeaderboard(leaderboardLimit, offset);
      if (requestSeq !== leaderboardRequestSeq || uid !== activeUid) return;
      leaderboard.value = data;
      leaderboardOffset.value = offset;
    } catch (error) {
      if (requestSeq !== leaderboardRequestSeq || uid !== activeUid) return;
      leaderboardError.value = error instanceof Error ? error.message : "無法載入排行榜，請稍後重試。";
    } finally {
      if (requestSeq === leaderboardRequestSeq) leaderboardLoading.value = false;
    }
  }

  const currentMonth = ref(getCurrentMonth());

  // --- 計算屬性 (Computed) ---

  // 根據現有紀錄計算出所有相關月份
  const monthsRaw = computed(() => {
    const unique = new Set(records.value.map((item) => item.month));
    // 總是包含當前月份，避免新使用者完全沒月份可選
    unique.add(currentMonth.value);
    return [...unique].sort((a, b) => a.localeCompare(b));
  });

  // 過濾掉未來的月份（僅用於選擇器顯示）
  const months = computed(() => {
    return monthsRaw.value.filter((month) => month <= currentMonth.value);
  });

  // 選取狀態
  const selectedMonth = ref<string>(currentMonth.value);
  const selectedAccountIds = ref<string[]>([]);
  const rangeStartMonth = ref<string>(EARLIEST_SELECTABLE_MONTH);
  const rangeEndMonth = ref<string>(currentMonth.value);

  // 新增帳戶表單狀態
  const newAccount = ref<{
    name: string;
    category: string;
    type: AccountType;
    currency: Currency;
  }>({
    name: "",
    category: "",
    type: "asset",
    currency: "TWD"
  });

  // 將紀錄依照帳戶分組，並按月份排序，加速查詢
  const recordsByAccount = computed(() => {
    const map = new Map<string, MonthlyRecord[]>();
    for (const item of records.value) {
      const current = map.get(item.accountId) ?? [];
      current.push(item);
      map.set(item.accountId, current);
    }
    for (const item of map.values()) {
      item.sort((a, b) => a.month.localeCompare(b.month));
    }
    return map;
  });

  const accountMap = computed(() => {
    return new Map(accounts.value.map((item) => [item.id, item]));
  });

  // 下拉選單選項
  const monthOptions = computed<SelectOption[]>(() => {
    return [...months.value]
      .reverse()
      .map((month) => ({
        label: month,
        value: month
      }));
  });

  const accountOptions = computed<SelectOption[]>(() => {
    return accounts.value.map((item) => ({
      label: item.name,
      value: item.id,
      iconUrl: resolveBankIcon(item.name)
    }));
  });

  const currencyOptions: SelectOption[] = [
    { label: "TWD", value: "TWD" },
    { label: "USD", value: "USD" },
    { label: "JPY", value: "JPY" }
  ];

  const accountTypeOptions: SelectOption[] = [
    { label: "正資產", value: "asset" },
    { label: "負資產", value: "liability" }
  ];

  const categoryOptions = computed<SelectOption[]>(() => {
    const categories = new Set(accounts.value.map((item) => item.category));
    return [...categories].map((cat) => ({ label: cat, value: cat }));
  });

  // 根據 ID 過濾出選取的帳戶物件
  const selectedAccounts = computed(() => {
    const selected = new Set(selectedAccountIds.value);
    // 保持原始 accounts 的順序
    return accounts.value.filter((item) => selected.has(item.id));
  });

  const selectedAccount = computed(() => {
    if (selectedAccounts.value.length !== 1) {
      return null;
    }
    return selectedAccounts.value[0];
  });

  const selectedMonthIndex = computed(() => {
    return months.value.findIndex((item) => item === selectedMonth.value);
  });

  const previousMonth = computed<string | null>(() => {
    const idx = months.value.indexOf(selectedMonth.value);
    if (idx <= 0) {
      return null;
    }
    return months.value[idx - 1];
  });

  // 監聽月份列表變更，確保選取月份有效
  watch(
    months,
    (list) => {
      if (!list.length) {
        selectedMonth.value = currentMonth.value;
        rangeStartMonth.value = EARLIEST_SELECTABLE_MONTH;
        rangeEndMonth.value = currentMonth.value;
        return;
      }

      selectedMonth.value = clampMonth(selectedMonth.value);
      rangeStartMonth.value = clampMonth(rangeStartMonth.value);
      rangeEndMonth.value = clampMonth(rangeEndMonth.value);

      // 確保範圍邏輯正確 (開始 <= 結束)
      if (monthToValue(rangeStartMonth.value) > monthToValue(rangeEndMonth.value)) {
        rangeStartMonth.value = clampMonth(EARLIEST_SELECTABLE_MONTH);
        rangeEndMonth.value = clampMonth(currentMonth.value);
      }
      
      // 如果尚未選擇任何月份，預設選最後一個
      if (!list.includes(selectedMonth.value)) {
         selectedMonth.value = list[list.length - 1];
      }
    },
    { immediate: true }
  );

  // --- 核心邏輯函式 (Functions) ---

  /** 取得特定帳戶在特定月份的金額 (若無該月資料，則往前尋找最近一次的紀錄) */
  function amountAtMonth(accountId: string, month: string): number {
    const list = recordsByAccount.value.get(accountId) ?? [];
    const currentValue = monthToValue(month);
    let output = 0;
    // 列表已按月份排序，由前往後找，找到最後一個小於等於目標月份的紀錄
    // 優化：倒著找可能更快，但在此資料量下差異不大
    for (const item of list) {
      if (monthToValue(item.month) <= currentValue) {
        output = item.amount;
        continue;
      }
      break;
    }
    return output;
  }

  function fxRate(currency: Currency): number {
    if (currency === "TWD") {
      return 1;
    }
    return fxRates.value[currency as Exclude<Currency, "TWD">];
  }

  function toTwd(amount: number, currency: Currency): number {
    return amount * fxRate(currency);
  }

  function accountDisplayName(account: Account): string {
    return account.name;
  }

  /** 從 Worker API 讀取帳戶列表 */
  async function fetchAccounts(): Promise<boolean> {
    const seq = sessionSeq;
    if (isMockMode) {
      accounts.value = seedAccounts;
      // 更新選取的帳戶列表，預設全選
      if (selectedAccountIds.value.length === 0) {
        selectedAccountIds.value = accounts.value.map(a => a.id);
      }
      return true;
    }

    try {
      const data = await apiGetAccounts();
      if (seq !== sessionSeq) return false;
      accounts.value = data;
      // 更新選取的帳戶列表，預設全選
      if (selectedAccountIds.value.length === 0) {
        selectedAccountIds.value = accounts.value.map(a => a.id);
      }
      return true;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return false;
    }
  }

  /** 從 Worker API 讀取每月紀錄 */
  async function fetchRecords(): Promise<boolean> {
    const seq = sessionSeq;
    if (isMockMode) {
      records.value = seedRecords;
      return true;
    }

    try {
      const data = await apiGetMonthlyRecords();
      if (seq !== sessionSeq) return false;
      records.value = data;
      return true;
    } catch (error) {
      console.error("Error fetching records:", error);
      return false;
    }
  }

  /** 從 Worker API 讀取投資部位 */
  async function fetchHoldings(): Promise<boolean> {
    const seq = sessionSeq;
    if (isMockMode) {
      holdings.value = seedInvestments.map(h => ({ ...h })) as Holding[];
      return true;
    }

    try {
      const data = await apiGetHoldings();
      if (seq !== sessionSeq) return false;
      holdings.value = data;
      return true;
    } catch (error) {
      console.error("Error fetching holdings:", error);
      return false;
    }
  }

  /** 新增投資部位 */
  async function addHolding(payload: Omit<Holding, "id">): Promise<ActionResult> {
    const seq = sessionSeq;
    if (isMockMode) {
      holdings.value.push({ ...payload, id: Date.now() });
      return { type: "success", message: "已新增部位。" };
    }

    try {
      const newHolding = await apiCreateHolding({
        symbol: payload.symbol,
        market: payload.market,
        name: payload.name,
        quantity: payload.quantity,
        avg_cost: payload.avgCost,
        currency: payload.currency
      });
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };
      holdings.value.push(newHolding);
      return { type: "success", message: "已新增部位。" };
    } catch (error: any) {
      return { type: "error", message: `新增失敗: ${error.message}` };
    }
  }

  /** 更新投資部位 */
  async function updateHolding(id: number, updates: Partial<Omit<Holding, "id">>): Promise<ActionResult> {
    const seq = sessionSeq;
    if (isMockMode) {
      const idx = holdings.value.findIndex(h => h.id === id);
      if (idx !== -1) holdings.value[idx] = { ...holdings.value[idx], ...updates };
      return { type: "success", message: "已更新部位。" };
    }

    try {
      const updated = await apiUpdateHolding(id, {
        quantity: updates.quantity,
        avg_cost: updates.avgCost
      });
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };
      const idx = holdings.value.findIndex(h => h.id === id);
      if (idx !== -1) holdings.value[idx] = updated;
      return { type: "success", message: "已更新部位。" };
    } catch (error: any) {
      return { type: "error", message: `更新失敗: ${error.message}` };
    }
  }

  /** 刪除投資部位 */
  async function deleteHolding(id: number): Promise<ActionResult> {
    const seq = sessionSeq;
    if (isMockMode) {
      holdings.value = holdings.value.filter(h => h.id !== id);
      return { type: "success", message: "已刪除部位。" };
    }

    try {
      const data = await apiDeleteHolding(id);
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };
      holdings.value = data;
      return { type: "success", message: "已刪除部位。" };
    } catch (error: any) {
      return { type: "error", message: `刪除失敗: ${error.message}` };
    }
  }

  /** 觸發每日快照（記錄今日持倉市值） */
  async function takeSnapshot(): Promise<ActionResult> {
    const seq = sessionSeq;
    if (isMockMode) {
      recordCurrentInvestmentSnapshot();
      return { type: "success", message: "快照建立成功 (mock)。" };
    }

    try {
      const result = await apiTakeSnapshot();
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };
      // 先即時把本次更新反映到畫面；後續再由 API 歷史資料覆蓋。
      recordCurrentInvestmentSnapshot();
      return { type: "success", message: `已建立 ${result.date} 的快照，共 ${result.snapshotCount} 筆。` };
    } catch (error: any) {
      return { type: "error", message: `快照失敗: ${error.message}` };
    }
  }

  function formatLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  /** 以目前畫面上的持倉資料建立一筆即時快照，避免等待後端歷史資料時圖表看起來沒有更新。 */
  function recordCurrentInvestmentSnapshot(): void {
    const now = new Date();
    const date = formatLocalDateTime(now).slice(0, 10);
    const capturedAt = formatLocalDateTime(now);
    const twHoldings = holdings.value.filter((h) => h.market === "TW");
    const usHoldings = holdings.value.filter((h) => h.market === "US");
    const twValue = twHoldings.reduce((sum, h) => sum + h.marketValue, 0);
    const usValue = usHoldings.reduce((sum, h) => sum + h.marketValue, 0);
    const twCost = twHoldings.reduce((sum, h) => sum + h.quantity * h.avgCost, 0);
    const usCost = usHoldings.reduce((sum, h) => sum + h.quantity * h.avgCost, 0);

    investmentSnapshots.value = [
      ...investmentSnapshots.value,
      {
        date,
        capturedAt,
        twValue,
        usValue,
        twCost,
        usCost,
        totalValue: twValue + usValue,
        totalCost: twCost + usCost,
      },
    ];
  }

  /** 取得股票資產變化快照 */
  async function fetchInvestmentSnapshots(
    startDate?: string,
    endDate?: string,
    options: { preserveCurrentOnEmpty?: boolean } = {}
  ) {
    const requestSeq = ++investmentSnapshotsRequestSeq;

    if (isMockMode) {
      if (investmentSnapshots.value.length === 0) {
        const today = new Date();
        investmentSnapshots.value = Array.from({ length: 8 }, (_, index) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (7 - index));
          const factor = 0.94 + index * 0.012;
          const twValue = seedInvestments
            .filter((h) => h.market === "TW")
            .reduce((sum, h) => sum + h.marketValue * factor, 0);
          const usValue = seedInvestments
            .filter((h) => h.market === "US")
            .reduce((sum, h) => sum + h.marketValue * factor, 0);
          return {
            date: d.toISOString().slice(0, 10),
            capturedAt: d.toLocaleString("zh-TW", { hour12: false }),
            twValue,
            usValue,
            twCost: 0,
            usCost: 0,
            totalValue: twValue + usValue,
            totalCost: 0,
          };
        });
      }
      return;
    }

    try {
      const data = await apiGetSnapshots(startDate, endDate);
      if (requestSeq !== investmentSnapshotsRequestSeq) return;
      if (data.length === 0 && options.preserveCurrentOnEmpty && investmentSnapshots.value.length > 0) {
        return;
      }
      investmentSnapshots.value = data;
    } catch (error) {
      console.error("Error fetching investment snapshots:", error);
    }
  }

  /** 初始化資料 (應用程式啟動時呼叫) */
  async function initData() {
    if (!activeUid || dataInitialized || dataInitializing) return;
    const seq = sessionSeq;
    dataInitializing = true;
    isLoading.value = true;
    try {
      const [accountsLoaded, recordsLoaded, holdingsLoaded] = await Promise.all([
        fetchAccounts(), fetchRecords(), fetchHoldings(), refreshFxRates(),
      ]);
      if (seq !== sessionSeq) return;
      dataInitialized = accountsLoaded && recordsLoaded && holdingsLoaded;
    } finally {
      if (seq === sessionSeq) {
        isLoading.value = false;
        dataInitializing = false;
      }
    }
  }

  /** 更新匯率 (從外部 API) */
  async function refreshFxRates(): Promise<ActionResult> {
    if (isMockMode) return { type: "success", message: "本地示範使用固定匯率。" };
    if (fxLoading.value) {
      return { type: "error", message: "匯率更新中，請稍候" };
    }
    fxLoading.value = true;
    fxError.value = "";

    try {
      const response = await axios.get("https://open.er-api.com/v6/latest/TWD");

      const data = response.data as {
        rates?: Record<string, number>;
        time_last_update_utc?: string;
      };

      const usdPerTwd = data.rates?.USD;
      const jpyPerTwd = data.rates?.JPY;
      if (!usdPerTwd || !jpyPerTwd) {
        throw new Error("回傳資料不完整");
      }

      const usdToTwd = 1 / usdPerTwd;
      const jpyToTwd = 1 / jpyPerTwd;
      if (!Number.isFinite(usdToTwd) || !Number.isFinite(jpyToTwd)) {
        throw new Error("匯率格式錯誤");
      }

      fxRates.value = {
        USD: usdToTwd,
        JPY: jpyToTwd
      };
      fxUpdatedAt.value = data.time_last_update_utc ?? new Date().toISOString();
      return { type: "success", message: "匯率已更新" };
    } catch (error) {
      fxError.value = error instanceof Error ? error.message : "無法更新匯率";
      return { type: "error", message: `匯率更新失敗：${fxError.value}` };
    } finally {
      fxLoading.value = false;
    }
  }

  const fxUpdatedLabel = computed(() => {
    if (!fxUpdatedAt.value) {
      return "-";
    }
    return new Intl.DateTimeFormat("zh-TW", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(fxUpdatedAt.value));
  });

  const fxDisplayLabel = computed(() => {
    const usd = formatDecimal(fxRates.value.USD);
    const jpy = formatDecimal(fxRates.value.JPY);
    return `USD ${usd} / JPY ${jpy}`;
  });

  // 各幣別資產負債總覽
  const currencySummaryRows = computed<CurrencySummaryRow[]>(() => {
    const output: Record<Currency, CurrencySummaryRow> = {
      TWD: { key: "TWD", currency: "TWD", asset: 0, liability: 0, net: 0 },
      USD: { key: "USD", currency: "USD", asset: 0, liability: 0, net: 0 },
      JPY: { key: "JPY", currency: "JPY", asset: 0, liability: 0, net: 0 }
    };

    for (const account of selectedAccounts.value) {
      const current = amountAtMonth(account.id, selectedMonth.value);
      const row = output[account.currency];
      if (account.type === "asset") {
        row.asset += current;
      } else {
        row.liability += current;
      }
      row.net = row.asset - row.liability;
    }
    return Object.values(output);
  });

  // 選取帳戶的總淨值 (TWD)
  const selectedNetTwd = computed(() => {
    let total = 0;
    for (const account of selectedAccounts.value) {
      const current = amountAtMonth(account.id, selectedMonth.value);
      const signed = account.type === "asset" ? current : -current;
      total += toTwd(signed, account.currency);
    }
    return total;
  });

  // 範圍內的月份列表
  const selectedRangeMonths = computed<string[]>(() => {
    if (months.value.length === 0) {
      return [];
    }
    const startValue = monthToValue(rangeStartMonth.value);
    const endValue = monthToValue(rangeEndMonth.value);
    const lower = Math.min(startValue, endValue);
    const upper = Math.max(startValue, endValue);
    return months.value.filter((item) => {
      const value = monthToValue(item);
      return value >= lower && value <= upper;
    });
  });

  const minMonth = computed(() => months.value[0] ?? currentMonth.value);
  const maxMonth = computed(() => months.value[months.value.length - 1] ?? currentMonth.value);
  const minSelectableTimestamp = computed(() => monthToTimestamp(EARLIEST_SELECTABLE_MONTH));
  const maxSelectableTimestamp = computed(() => Date.now());

  function clampMonth(month: string): string {
    const value = monthToValue(month);
    const min = monthToValue(EARLIEST_SELECTABLE_MONTH);
    const max = monthToValue(currentMonth.value);
    if (value < min) {
      return EARLIEST_SELECTABLE_MONTH;
    }
    if (value > max) {
      return currentMonth.value;
    }
    return month;
  }

  const monthRangeValue = computed<[number, number] | null>({
    get() {
      if (!rangeStartMonth.value || !rangeEndMonth.value) {
        return null;
      }
      const startTs = monthToTimestamp(rangeStartMonth.value);
      const endTs = Math.min(monthToEndTimestamp(rangeEndMonth.value), maxSelectableTimestamp.value);
      return [startTs, endTs];
    },
    set(value) {
      if (!value) {
        return;
      }
      const [startTs, endTs] = value;
      rangeStartMonth.value = clampMonth(timestampToMonth(startTs));
      rangeEndMonth.value = clampMonth(timestampToMonth(endTs));
    }
  });

  function isMonthOutOfRange(timestamp: number): boolean {
    return timestamp < minSelectableTimestamp.value || timestamp > maxSelectableTimestamp.value;
  }

  const combinedWaterPointDetails = computed<CombinedWaterPointDetail[]>(() => {
    return selectedRangeMonths.value.map((month) => {
      const breakdown = selectedAccounts.value
        .map((account) => {
          const amount = amountAtMonth(account.id, month);
          const signed = account.type === "asset" ? amount : -amount;
          const signedTwd = toTwd(signed, account.currency);
          return {
            accountId: account.id,
            accountName: account.name,
            type: account.type,
            currency: account.currency,
            amount,
            signedTwd
          };
        })
        .sort((a, b) => Math.abs(b.signedTwd) - Math.abs(a.signedTwd));

      const totalTwd = breakdown.reduce((sum, item) => sum + item.signedTwd, 0);
      return {
        key: month,
        month,
        totalTwd,
        breakdown
      };
    });
  });

  const combinedWaterPoints = computed<CombinedWaterPoint[]>(() => {
    return combinedWaterPointDetails.value.map(({ key, month, totalTwd }) => ({
      key,
      month,
      totalTwd
    }));
  });

  const trendRows = computed<TrendRow[]>(() => {
    const output: TrendRow[] = [];
    let previousNet = 0;

    for (const month of months.value) {
      let assetTwd = 0;
      let liabilityTwd = 0;

      for (const account of selectedAccounts.value) {
        const amount = amountAtMonth(account.id, month);
        if (account.type === "asset") {
          assetTwd += toTwd(amount, account.currency);
        } else {
          liabilityTwd += toTwd(amount, account.currency);
        }
      }

      const netTwd = assetTwd - liabilityTwd;
      const delta = output.length === 0 ? 0 : netTwd - previousNet;
      const pct = output.length === 0 || previousNet === 0 ? null : (delta / previousNet) * 100;
      output.push({
        key: month,
        month,
        assetTwd,
        liabilityTwd,
        netTwd,
        delta,
        pct
      });
      previousNet = netTwd;
    }

    return output;
  });

  const accountSnapshotRows = computed<AccountSnapshotRow[]>(() => {
    return selectedAccounts.value.map((account) => {
      const current = amountAtMonth(account.id, selectedMonth.value);
      const previous = previousMonth.value ? amountAtMonth(account.id, previousMonth.value) : 0;
      const delta = current - previous;
      const pct = previous === 0 ? null : (delta / previous) * 100;
      const sign = account.type === "asset" ? 1 : -1;

      return {
        key: account.id,
        accountName: account.name,
        category: account.category,
        type: account.type,
        currency: account.currency,
        current,
        delta,
        deltaTwd: toTwd(delta, account.currency),
        pct,
        netImpactTwd: toTwd(current * sign, account.currency)
      };
    });
  });

  const singleAccountTrendRows = computed<SingleAccountTrendRow[]>(() => {
    if (!selectedAccount.value) {
      return [];
    }
    const output: SingleAccountTrendRow[] = [];
    let previousAmount = 0;
    for (const month of months.value) {
      const amount = amountAtMonth(selectedAccount.value.id, month);
      const delta = output.length === 0 ? 0 : amount - previousAmount;
      const pct = output.length === 0 || previousAmount === 0 ? null : (delta / previousAmount) * 100;
      output.push({
        key: month,
        month,
        amount,
        delta,
        pct
      });
      previousAmount = amount;
    }
    return output;
  });

  /** 新增帳戶到 Worker API */
  async function addAccount(): Promise<ActionResult> {
    const seq = sessionSeq;
    if (!newAccount.value.name.trim()) {
      return { type: "error", message: "請先填入帳戶名稱。" };
    }
    
    // 計算新的排序順序 (放在最後)
    const maxSortOrder = accounts.value.length > 0 
      ? Math.max(...accounts.value.map(a => a.sort_order || 0)) 
      : 0;

    try {
      const payload = await apiCreateAccount({
        name: newAccount.value.name.trim(),
        category: newAccount.value.category.trim() || "未分類",
        currency: newAccount.value.currency,
        type: newAccount.value.type,
        sort_order: maxSortOrder + 1,
      });
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };
      
      // 更新本地狀態
      accounts.value.push(payload);
      selectedAccountIds.value = [...selectedAccountIds.value, payload.id];

      // 重置表單
      newAccount.value = {
        name: "",
        category: "",
        type: "asset",
        currency: "TWD"
      };
      return { type: "success", message: `已新增帳戶：${payload.name}` };
    } catch (error: any) {
      return { type: "error", message: `新增失敗: ${error.message}` };
    }
  }

  /** 批次儲存/更新每月紀錄到 Worker API */
  async function bulkUpsertMonthlyRecords(
    month: string,
    entries: Array<{
      accountId: string;
      amount: number;
    }>
  ): Promise<ActionResult> {
    const seq = sessionSeq;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return { type: "error", message: "月份格式錯誤，請用 YYYY-MM。" };
    }

    if (entries.length === 0) {
      return { type: "error", message: "目前沒有可儲存的帳戶資料。" };
    }
    
    try {
      const result = await apiBulkUpsertMonthlyRecords(month, entries);
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };
      records.value = result.data;

      selectedMonth.value = clampMonth(month);
      return { type: "success", message: `已儲存 ${month} 的資料。` };
    } catch (error: any) {
      return { type: "error", message: `儲存失敗: ${error.message}` };
    }
  }

  function selectAllAccounts(): void {
    selectedAccountIds.value = accounts.value.map((item) => item.id);
  }

  function selectLatestMonth(): void {
    // 如果 months 為空，預設使用當前月份
    const latest = months.value.length > 0 ? months.value[months.value.length - 1] : currentMonth.value;
    selectedMonth.value = latest;
  }

  /** 更新帳戶資訊到 Worker API */
  async function updateAccountById(accountId: string, updates: Partial<Pick<Account, "name" | "category" | "currency">>): Promise<ActionResult> {
    const seq = sessionSeq;
    const account = accounts.value.find((item) => item.id === accountId);
    if (!account) {
      return { type: "error", message: "找不到帳戶。" };
    }
    try {
      const payload: Partial<Account> = {};
      if (updates.name !== undefined) payload.name = updates.name.trim();
      if (updates.category !== undefined) payload.category = updates.category.trim();
      if (updates.currency !== undefined) payload.currency = updates.currency;
      const updated = await apiUpdateAccount(accountId, payload);
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };

      // 更新本地狀態
      const index = accounts.value.findIndex((item) => item.id === accountId);
      if (index >= 0) {
        accounts.value[index] = updated;
      }
      
      return { type: "success", message: `已更新帳戶：${payload.name ?? account.name}` };
    } catch (error: any) {
      return { type: "error", message: `更新失敗: ${error.message}` };
    }
  }

  /** 更新帳戶資訊到 Worker API（接受完整帳戶物件，失敗時拋出例外） */
  async function updateAccount(account: Account): Promise<void> {
    const result = await updateAccountById(account.id, {
      name: account.name,
      category: account.category,
      currency: account.currency
    });
    if (result.type === "error") {
      throw new Error(result.message);
    }
  }

  /** 更新帳戶排序到 Worker API */
  async function reorderAccount(fromIndex: number, toIndex: number): Promise<ActionResult> {
    const list = [...accounts.value]; // 複製一份
    if (
      fromIndex < 0 || fromIndex >= list.length ||
      toIndex < 0 || toIndex >= list.length ||
      fromIndex === toIndex
    ) {
      return { type: "success", message: "無需變更" };
    }
    
    // 本地先更新 UI，讓使用者覺得很快
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    accounts.value = list;

    try {
      await apiReorderAccounts(list.map((acc, index) => ({ id: acc.id, sort_order: index })));
      return { type: "success", message: "排序已更新" };
    } catch (err) {
      console.error("Sorting error:", err);
      // 如果失敗，理論上應該 rollback 本地狀態，但這裡暫不處理，下次重新整理會同步
      return { type: "error", message: "排序儲存失敗" };
    }
  }

  /** 批次更新所有帳戶的排序到 Worker API */
  async function reorderAllAccounts(newList: Account[]): Promise<ActionResult> {
    accounts.value = [...newList];
    try {
      await apiReorderAccounts(newList.map((acc, index) => ({ id: acc.id, sort_order: index })));
      return { type: "success", message: "排序已更新" };
    } catch (err) {
      console.error("Sorting error:", err);
      return { type: "error", message: "排序儲存失敗" };
    }
  }

  /** 刪除帳戶及其相關紀錄 */
  async function deleteAccount(accountId: string): Promise<ActionResult> {
    const seq = sessionSeq;
    const account = accounts.value.find((item) => item.id === accountId);
    if (!account) {
      return { type: "error", message: "找不到要刪除的帳戶。" };
    }
    try {
      const data = await apiDeleteAccount(accountId);
      if (seq !== sessionSeq) return { type: "error", message: "帳戶已切換，已忽略舊請求結果。" };
      accounts.value = data;
      selectedAccountIds.value = selectedAccountIds.value.filter((id) => id !== accountId);
      records.value = records.value.filter((r) => r.accountId !== accountId);

      return { type: "success", message: `已刪除帳戶：${account.name}` };
    } catch (error: any) {
      return { type: "error", message: `刪除帳戶失敗: ${error.message}` };
    }
  }

  // 所有頁面共用 UID 切換清理，包含 Dashboard 未掛載時的登出。
  watch(() => isMockMode ? "local-demo" : user.value?.uid ?? null, (uid) => {
    resetSession(uid);
    if (uid) void initData();
  }, { immediate: true, flush: "sync" });

  return {
    leaderboard,
    leaderboardLoading,
    leaderboardError,
    leaderboardOffset,
    leaderboardLimit,
    myRank,
    initializeLeaderboard,
    fetchLeaderboard,
    accounts,
    records,
    holdings,
    investmentSnapshots,
    isLoading,
    fxRates,
    fxLoading,
    fxError,
    fxUpdatedAt,
    fxUpdatedLabel,
    fxDisplayLabel,
    fxSource,
    months,
    selectedMonth,
    selectedAccountIds,
    rangeStartMonth,
    rangeEndMonth,
    minMonth,
    maxMonth,
    monthRangeValue,
    newAccount,
    monthOptions,
    accountOptions,
    currencyOptions,
    accountTypeOptions,
    categoryOptions,
    selectedAccounts,
    selectedAccount,
    previousMonth,
    selectedRangeMonths,
    currencySummaryRows,
    selectedNetTwd,
    combinedWaterPoints,
    combinedWaterPointDetails,
    trendRows,
    accountSnapshotRows,
    singleAccountTrendRows,
    accountMap,
    amountAtMonth,
    toTwd,
    formatCurrency,
    formatPct,
    accountDisplayName,
    isMonthOutOfRange,
    refreshFxRates,
    addAccount,
    bulkUpsertMonthlyRecords,
    selectAllAccounts,
    selectLatestMonth,
    updateAccountById,
    updateAccount,
    reorderAccount,
    reorderAllAccounts,
    deleteAccount,
    fetchHoldings,
    addHolding,
    updateHolding,
    deleteHolding,
    takeSnapshot,
    fetchInvestmentSnapshots,
    recordCurrentInvestmentSnapshot,
    initData
  };
});
