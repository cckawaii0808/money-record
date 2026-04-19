import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
// SelectOption 本地定義取代 naive-ui 的版本
interface SelectOption { label: string; value: string | number; }

import { EARLIEST_SELECTABLE_MONTH } from "../constants";
import type { Account, AccountType, Currency, Holding, MonthlyRecord } from "../types";
import { formatCurrency, formatPct } from "../utils/formatters";
import {
  getCurrentMonth,
  monthToEndTimestamp,
  monthToTimestamp,
  monthToValue,
  timestampToMonth
} from "../utils/monthUtils";
import { resolveBankIcon } from "../features/asset-manager/utils/bankIcons";
import { db, auth, isMockMode } from "../firebase";
import { collection, doc, query, orderBy, where, getDocs, setDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { seedAccounts, seedRecords, seedInvestments } from "../data";
import axios from "axios";

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

  /** 從 Firebase 讀取帳戶列表 */
  async function fetchAccounts() {
    if (isMockMode) {
      accounts.value = seedAccounts;
      // 更新選取的帳戶列表，預設全選
      if (selectedAccountIds.value.length === 0) {
        selectedAccountIds.value = accounts.value.map(a => a.id);
      }
      return;
    }

    const user = auth?.currentUser;
    if (!user || !db) return;
    try {
      const q = query(collection(db, "accounts"), where("user_id", "==", user.uid), orderBy("sort_order", "asc"), orderBy("created_at", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as Account);

      accounts.value = data;
      // 更新選取的帳戶列表，預設全選
      if (selectedAccountIds.value.length === 0) {
        selectedAccountIds.value = accounts.value.map(a => a.id);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  }

  /** 從 Firebase 讀取每月紀錄 */
  async function fetchRecords() {
    if (isMockMode) {
      records.value = seedRecords;
      return;
    }

    const user = auth?.currentUser;
    if (!user || !db) return;
    try {
      const q = query(collection(db, "monthly_records"), where("user_id", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());

      // 轉換欄位名稱 (snake_case -> camelCase) 以符合前端型別
      records.value = data.map((item: any) => ({
        accountId: item.account_id,
        month: item.month,
        amount: Number(item.amount)
      }));
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }

  /** 從 Firebase 讀取投資部位 */
  async function fetchHoldings() {
    if (isMockMode) {
      holdings.value = seedInvestments.map(h => ({ ...h }));
      return;
    }

    const user = auth?.currentUser;
    if (!user || !db) return;

    try {
      const q = query(collection(db, "holdings"), where("user_id", "==", user.uid), orderBy("sort_order", "asc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());

      holdings.value = data.map(row => ({
        id: row.id,
        symbol: row.symbol,
        market: row.market,
        name: row.name,
        shares: row.shares,
        loaned_shares: row.loaned_shares,
        cost_basis: row.cost_basis,
        current_price: row.current_price,
        currency: row.currency,
      }));
    } catch (error) {
       console.error("Error fetching holdings:", error);
    }
  }

  /** 新增投資部位 */
  async function addHolding(payload: Omit<Holding, "id">): Promise<ActionResult> {
    if (isMockMode) {
      holdings.value.push({ ...payload, id: "inv-" + Date.now() });
      return { type: "success", message: "已新增部位。" };
    }

    const user = auth?.currentUser;
    if (!user || !db) return { type: "error", message: "請先登入。" };

    try {
      const newDocRef = doc(collection(db, "holdings"));
      const docData = {
        id: newDocRef.id,
        user_id: user.uid,
        symbol: payload.symbol,
        market: payload.market,
        name: payload.name,
        shares: payload.shares ?? 0,
        loaned_shares: payload.loaned_shares ?? 0,
        cost_basis: payload.cost_basis ?? 0,
        current_price: payload.current_price,
        currency: payload.currency,
        sort_order: holdings.value.length
      };

      await setDoc(newDocRef, docData);

      holdings.value.push({
        id: docData.id,
        symbol: docData.symbol,
        market: docData.market,
        name: docData.name,
        shares: docData.shares,
        loaned_shares: docData.loaned_shares,
        cost_basis: docData.cost_basis,
        current_price: docData.current_price,
        currency: docData.currency,
      });
      return { type: "success", message: "已新增部位。" };
    } catch (error: any) {
      return { type: "error", message: `新增失敗: ${error.message}` };
    }
  }

  /** 更新投資部位 */
  async function updateHolding(id: string, updates: Partial<Omit<Holding, "id">>): Promise<ActionResult> {
    if (isMockMode) {
      const idx = holdings.value.findIndex(h => h.id === id);
      if (idx !== -1) holdings.value[idx] = { ...holdings.value[idx], ...updates };
      return { type: "success", message: "已更新部位。" };
    }

    if (!db) return { type: "error", message: "尚未連線資料庫" };

    try {
      await updateDoc(doc(db, "holdings", id), updates as any);
      const idx = holdings.value.findIndex(h => h.id === id);
      if (idx !== -1) holdings.value[idx] = { ...holdings.value[idx], ...updates };
      return { type: "success", message: "已更新部位。" };
    } catch (error: any) {
      return { type: "error", message: `更新失敗: ${error.message}` };
    }
  }

  /** 刪除投資部位 */
  async function deleteHolding(id: string): Promise<ActionResult> {
    if (isMockMode) {
      holdings.value = holdings.value.filter(h => h.id !== id);
      return { type: "success", message: "已刪除部位。" };
    }

    if (!db) return { type: "error", message: "尚未連線資料庫" };

    try {
      await deleteDoc(doc(db, "holdings", id));
      holdings.value = holdings.value.filter(h => h.id !== id);
      return { type: "success", message: "已刪除部位。" };
    } catch (error: any) {
      return { type: "error", message: `刪除失敗: ${error.message}` };
    }
  }

  /** 批次更新報價快取（更新本地狀態，並非同步寫回 DB） */
  function batchCacheHoldingPrices(prices: Record<string, number>) {
    holdings.value.forEach(h => {
      if (prices[h.symbol] !== undefined) {
        h.current_price = prices[h.symbol];
      }
    });

    // 非同步寫回 DB（fire-and-forget，不阻塞 UI）
    if (!isMockMode && db) {
      const batch = writeBatch(db);
      holdings.value
        .filter(h => prices[h.symbol] !== undefined)
        .forEach(h => {
          batch.update(doc(db!, "holdings", h.id), { current_price: prices[h.symbol] });
        });
      void batch.commit().catch(e => console.error("Batch update failed:", e));
    }
  }

  /** 初始化資料 (應用程式啟動時呼叫) */
  async function initData() {
    if (dataInitialized) return;
    isLoading.value = true;
    await Promise.all([fetchAccounts(), fetchRecords(), fetchHoldings(), refreshFxRates()]);
    isLoading.value = false;
    dataInitialized = true;
  }

  /** 更新匯率 (從外部 API) */
  async function refreshFxRates(): Promise<ActionResult> {
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
    const usd = fxRates.value.USD.toFixed(2);
    const jpy = fxRates.value.JPY.toFixed(4);
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

  /** 新增帳戶到 Firebase */
  async function addAccount(): Promise<ActionResult> {
    if (!newAccount.value.name.trim()) {
      return { type: "error", message: "請先填入帳戶名稱。" };
    }
    
    const user = auth?.currentUser;
    if (!user || !db) {
       return { type: "error", message: "請先登入才能新增帳戶。" };
    }

    // 計算新的排序順序 (放在最後)
    const maxSortOrder = accounts.value.length > 0 
      ? Math.max(...accounts.value.map(a => a.sort_order || 0)) 
      : 0;

    try {
      const newDocRef = doc(collection(db, "accounts"));
      const payload: any = {
        id: newDocRef.id,
        user_id: user.uid,
        name: newAccount.value.name.trim(),
        category: newAccount.value.category.trim() || "未分類",
        currency: newAccount.value.currency,
        type: newAccount.value.type,
        sort_order: maxSortOrder + 1,
        created_at: new Date().toISOString()
      };

      await setDoc(newDocRef, payload);
      
      // 更新本地狀態
      accounts.value.push(payload as Account);
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

  /** 批次儲存/更新每月紀錄到 Firebase */
  async function bulkUpsertMonthlyRecords(
    month: string,
    entries: Array<{
      accountId: string;
      amount: number;
    }>
  ): Promise<ActionResult> {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return { type: "error", message: "月份格式錯誤，請用 YYYY-MM。" };
    }

    if (entries.length === 0) {
      return { type: "error", message: "目前沒有可儲存的帳戶資料。" };
    }
    
    const user = auth?.currentUser;
    if (!user || !db) {
       return { type: "error", message: "請先登入。" };
    }

    try {
      const batch = writeBatch(db);
      entries.forEach(entry => {
        const docId = `${entry.accountId}_${month}`;
        const data = {
          user_id: user.uid,
          account_id: entry.accountId,
          month: month,
          amount: Math.max(0, entry.amount)
        };
        batch.set(doc(db!, "monthly_records", docId), data, { merge: true });
      });

      await batch.commit();

      // 重新讀取資料以同步本地狀態 (最保險的做法)
      await fetchRecords();

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

  /** 更新帳戶資訊到 Firebase */
  async function updateAccountById(accountId: string, updates: Partial<Pick<Account, "name" | "category" | "currency">>): Promise<ActionResult> {
    const account = accounts.value.find((item) => item.id === accountId);
    if (!account) {
      return { type: "error", message: "找不到帳戶。" };
    }
    if (!db) return { type: "error", message: "尚未連線資料庫。" };

    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.category !== undefined) payload.category = updates.category.trim();
    if (updates.currency !== undefined) payload.currency = updates.currency;

    try {
      await updateDoc(doc(db, "accounts", accountId), payload);

      // 更新本地狀態
      const index = accounts.value.findIndex((item) => item.id === accountId);
      if (index >= 0) {
        accounts.value[index] = { ...accounts.value[index], ...payload };
      }
      
      return { type: "success", message: `已更新帳戶：${payload.name ?? account.name}` };
    } catch (error: any) {
      return { type: "error", message: `更新失敗: ${error.message}` };
    }
  }

  /** 更新帳戶資訊到 Firebase（接受完整帳戶物件，失敗時拋出例外） */
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

  /** 更新帳戶排序到 Firebase */
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

    if (!db) return { type: "error", message: "尚未連線資料庫" };

    // 準備批次更新資料
    try {
      const batch = writeBatch(db);
      list.forEach((acc, index) => {
         batch.update(doc(db!, "accounts", acc.id), { sort_order: index });
      });
      await batch.commit();
      return { type: "success", message: "排序已更新" };
    } catch (err) {
      console.error("Sorting error:", err);
      // 如果失敗，理論上應該 rollback 本地狀態，但這裡暫不處理，下次重新整理會同步
      return { type: "error", message: "排序儲存失敗" };
    }
  }

  /** 刪除帳戶及其相關紀錄 */
  async function deleteAccount(accountId: string): Promise<ActionResult> {
    const account = accounts.value.find((item) => item.id === accountId);
    if (!account) {
      return { type: "error", message: "找不到要刪除的帳戶。" };
    }
    if (!db) return { type: "error", message: "尚未連線資料庫。" };

    try {
      const batch = writeBatch(db);
      
      // 先查詢並刪除關聯的 monthly_records
      const q = query(collection(db, "monthly_records"), where("account_id", "==", accountId));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(d => {
         batch.delete(d.ref);
      });

      // 再刪除 accounts
      batch.delete(doc(db, "accounts", accountId));
      await batch.commit();

      // 更新本地狀態
      accounts.value = accounts.value.filter((item) => item.id !== accountId);
      selectedAccountIds.value = selectedAccountIds.value.filter((id) => id !== accountId);
      records.value = records.value.filter((r) => r.accountId !== accountId);

      return { type: "success", message: `已刪除帳戶：${account.name}` };
    } catch (error: any) {
      return { type: "error", message: `刪除帳戶失敗: ${error.message}` };
    }
  }

  // 自動初始化資料
  if (!dataInitialized) {
    void initData();
  }

  return {
    accounts,
    records,
    holdings,
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
    deleteAccount,
    fetchHoldings,
    addHolding,
    updateHolding,
    deleteHolding,
    batchCacheHoldingPrices,
    initData
  };
});
