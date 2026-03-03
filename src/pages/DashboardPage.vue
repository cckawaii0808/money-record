<script setup lang="ts">
import { computed, ref } from "vue";
import { useIsDesktop } from "../composables/useIsDesktop";
const { isDesktop } = useIsDesktop();
import Chart from "primevue/chart";
import Skeleton from "primevue/skeleton";
import Tag from "primevue/tag";
import Card from "primevue/card";
import Select from "primevue/select";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useAssetManagerStore } from "../stores";
import { storeToRefs } from "pinia";
import { formatTwd } from "../utils/formatters";
import { ALLOCATION_PALETTE } from "../constants";

const assetManager = useAssetManagerStore();
const {
  isLoading,
  trendRows,
  accountSnapshotRows,
  selectedMonth,
  monthOptions,
  months, // 基於此計算前後月
} = storeToRefs(assetManager);
const { selectLatestMonth, formatCurrency } = assetManager;

selectLatestMonth();

// --- 月份導航邏輯 ---
const hasPreviousMonth = computed(() => {
  const idx = months.value.indexOf(selectedMonth.value);
  return idx > 0;
});

const hasNextMonth = computed(() => {
  const idx = months.value.indexOf(selectedMonth.value);
  return idx < months.value.length - 1 && months.value.length > 0;
});

function goToPreviousMonth() {
  const idx = months.value.indexOf(selectedMonth.value);
  if (idx > 0) {
    selectedMonth.value = months.value[idx - 1];
  }
}

function goToNextMonth() {
  const idx = months.value.indexOf(selectedMonth.value);
  if (idx < months.value.length - 1) {
    selectedMonth.value = months.value[idx + 1];
  }
}

// 點擊趨勢圖切換月份
function onTrendSelect(event: any) {
  const { index } = event;
  const recentRows = trendRows.value.slice(-6);
  if (recentRows[index]) {
    selectedMonth.value = recentRows[index].month;
  }
}

const hoveredAssetIdx = ref<number | null>(null);

// 資產佔比計算，為了讓中央文字與 Legend 同步
const assetAllocationList = computed(() => {
  const assets = accountSnapshotRows.value
    .filter((r) => r.type === "asset" && r.netImpactTwd > 0)
    .sort((a, b) => b.netImpactTwd - a.netImpactTwd);
  const total = assets.reduce((sum, r) => sum + r.netImpactTwd, 0);

  const result: any[] = [];
  let otherTwd = 0;

  assets.forEach((r) => {
    const pctValue = total > 0 ? (r.netImpactTwd / total) * 100 : 0;
    // 將小於 1% 的帳戶合併至「其他」
    if (pctValue < 1.0) {
      otherTwd += r.netImpactTwd;
    } else {
      result.push({
        ...r,
        pct: pctValue.toFixed(1),
      });
    }
  });

  if (otherTwd > 0) {
    result.push({
      id: "other-small-assets",
      accountName: "其他小額資產",
      netImpactTwd: otherTwd,
      currency: "TWD",
      pct: total > 0 ? ((otherTwd / total) * 100).toFixed(1) : "0.0",
    });
  }

  return result;
});

// --- KPI ---
const selectedTrend = computed(
  () => trendRows.value.find((r) => r.month === selectedMonth.value) ?? null,
);
const netWorth = computed(() => Math.round(selectedTrend.value?.netTwd ?? 0));
const totalAsset = computed(() =>
  Math.round(selectedTrend.value?.assetTwd ?? 0),
);
const totalLiab = computed(() =>
  Math.round(selectedTrend.value?.liabilityTwd ?? 0),
);
const delta = computed(() => Math.round(selectedTrend.value?.delta ?? 0));
const deltaPct = computed(() => selectedTrend.value?.pct ?? null);
const deltaPos = computed(() => delta.value >= 0);
const deltaSign = (v: number) => (v > 0 ? "+" : "");

// --- 綜合明細列表 (<1% 合併) ---
const detailedSnapshotRows = computed(() => {
  const assets = accountSnapshotRows.value
    .filter((r) => r.type === "asset" && r.current > 0)
    .sort((a, b) => b.netImpactTwd - a.netImpactTwd);
  const liabs = accountSnapshotRows.value
    .filter((r) => r.type === "liability" && r.current > 0)
    .sort((a, b) => Math.abs(b.netImpactTwd) - Math.abs(a.netImpactTwd));

  const totalAssetVal = assets.reduce((sum, r) => sum + r.netImpactTwd, 0);
  const totalLiabVal = liabs.reduce(
    (sum, r) => sum + Math.abs(r.netImpactTwd),
    0,
  );

  const result: any[] = [];

  // -- 資產 --
  let otherAssetCurrent = 0;
  let otherAssetDelta = 0;

  assets.forEach((r) => {
    const pct = totalAssetVal > 0 ? (r.netImpactTwd / totalAssetVal) * 100 : 0;
    if (pct < 1.0) {
      otherAssetCurrent += r.netImpactTwd;
      otherAssetDelta += r.deltaTwd;
    } else {
      result.push(r);
    }
  });

  if (otherAssetCurrent > 0) {
    result.push({
      key: "other-small-assets",
      accountName: "其他小額資產",
      type: "asset",
      currency: "TWD",
      current: otherAssetCurrent,
      delta: otherAssetDelta,
    });
  }

  // -- 負債 --
  let otherLiabCurrent = 0;
  let otherLiabDelta = 0;

  liabs.forEach((r) => {
    const absVal = Math.abs(r.netImpactTwd);
    const pct = totalLiabVal > 0 ? (absVal / totalLiabVal) * 100 : 0;
    if (pct < 1.0) {
      otherLiabCurrent += absVal;
      otherLiabDelta += r.deltaTwd * -1;
    } else {
      result.push(r);
    }
  });

  if (otherLiabCurrent > 0) {
    result.push({
      key: "other-small-liabs",
      accountName: "其他小額負債",
      type: "liability",
      currency: "TWD",
      current: otherLiabCurrent,
      delta: otherLiabDelta,
    });
  }

  // 把餘額為 0 且有異動的也加回來（例如剛全部結清的帳戶），保持明細完整性
  const zeroAccounts = accountSnapshotRows.value.filter(
    (r) => r.current === 0 && r.delta !== 0,
  );

  return [...result, ...zeroAccounts];
});

// --- 趨勢折線（近 6 個月）---
const trendData = computed(() => {
  const rows = trendRows.value.slice(-6);
  return {
    labels: rows.map((r) => r.month),
    datasets: [
      {
        label: "淨值",
        data: rows.map((r) => r.netTwd),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15,118,110,0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#0f766e",
        borderWidth: 2.5,
      },
    ],
  };
});

const trendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      titleColor: "#1e293b",
      titleFont: { size: 14, weight: "bold" },
      bodyColor: "#475569",
      bodyFont: { size: 13 },
      borderColor: "rgba(0, 0, 0, 0.1)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      displayColors: true,
      callbacks: {
        label: (ctx: any) => ` 淨值: ${formatTwd(ctx.parsed.y)}`,
        footer: (items: any) => {
          const idx = items[0].dataIndex;
          // 這裡我們要從歷史資料中找出對應月份的 breakdown
          // 注意：trendData 只取最後 6 個月，所以要對應好索引
          const rows = trendRows.value.slice(-6);
          const targetMonth = rows[idx]?.month;

          // 從目前的 snapshot 邏輯很難直接抓歷史 breakdown，
          // 但我們可以顯示該點與前一點的差異，或者如果 store 支援則抓該月資料
          return targetMonth ? `點擊可切換至 ${targetMonth} 詳情` : "";
        },
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: {
        font: { size: 11 },
        callback: (v: number) => {
          if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
          if (Math.abs(v) >= 10000) return `${(v / 10000).toFixed(0)}萬`;
          return v;
        },
      },
    },
  },
};

// --- 佔比圓餅 ---
const donutData = computed(() => {
  return {
    labels: assetAllocationList.value.map(
      (r) => `${r.accountName} (${r.pct}%)`,
    ),
    datasets: [
      {
        data: assetAllocationList.value.map((r) => r.netImpactTwd),
        backgroundColor: assetAllocationList.value.map(
          (_, i) => ALLOCATION_PALETTE[i % ALLOCATION_PALETTE.length],
        ),
        hoverOffset: 10,
        borderWidth: 2,
        borderColor: "transparent",
      },
    ],
  };
});

const donutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  layout: {
    padding: 15, // 在圖表繪製區域增加內距，徹底解決邊緣被切掉的問題
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  onHover: (event: any, elements: any) => {
    if (elements && elements.length > 0) {
      hoveredAssetIdx.value = elements[0].index;
    } else {
      hoveredAssetIdx.value = null;
    }
  },
}));
</script>

<template>
  <div
    class="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-24 transition-all relative"
  >
    <!-- 標題與月份選擇器：桌面版 Teleport 到 App.vue header，手機版 sticky -->
    <Teleport defer to="#app-header-slot" :disabled="!isDesktop">
      <div
        :class="
          isDesktop
            ? 'flex items-center justify-between w-full gap-4'
            : 'flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sticky top-0 z-[50] bg-[var(--app-bg)]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-4 sm:py-4 sm:rounded-b-2xl transition-all'
        "
      >
        <h1 class="text-2xl font-bold text-[var(--text-main)] m-0">資產總覽</h1>
        <div
          class="flex items-center bg-[var(--surface)] px-2 py-1.5 rounded-xl shadow-sm border border-[var(--line-soft)]"
        >
          <Button
            icon="pi pi-chevron-left"
            text
            rounded
            @click="goToPreviousMonth"
            :disabled="!hasPreviousMonth"
            class="text-[var(--text-sub)] !p-2 h-8 w-8"
          />
          <Select
            v-model="selectedMonth"
            :options="monthOptions"
            optionLabel="label"
            optionValue="value"
            class="w-36 text-center border-none shadow-none focus:ring-0 bg-transparent text-sm font-bold text-[var(--text-main)]"
            :pt="{ root: { class: 'bg-transparent border-none p-0' } }"
          />
          <Button
            icon="pi pi-chevron-right"
            text
            rounded
            @click="goToNextMonth"
            :disabled="!hasNextMonth"
            class="text-[var(--text-sub)] !p-2 h-8 w-8"
          />
        </div>
      </div>
    </Teleport>

    <!-- 頂部數據列 -->
    <!-- 頂部數據列：四個獨立的 Apollo Card -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <Skeleton v-for="i in 4" :key="i" height="142px" borderRadius="16px" />
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      <!-- Card 1: 淨值 -->
      <div class="apollo-card flex flex-col justify-between h-[142px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-2">
            <span class="text-sm font-bold text-[var(--text-main)]"
              >本月淨值</span
            >
            <span
              class="text-3xl font-black text-[var(--text-main)] tabular-nums tracking-tight"
              >{{ formatTwd(netWorth) }}</span
            >
          </div>
          <!-- 示意小圖或空白 -->
        </div>
        <div>
          <span
            v-if="deltaPct != null"
            class="text-sm font-bold tabular-nums"
            :class="
              delta >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
            "
          >
            {{ deltaPct.toFixed(1) }}%
            <i
              :class="delta >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              class="text-[10px]"
            ></i>
          </span>
          <span
            v-else
            class="text-sm font-bold tabular-nums text-[var(--text-sub)]"
            >N/A</span
          >
        </div>
      </div>

      <!-- Card 2: 本月異動 -->
      <div class="apollo-card flex flex-col justify-between h-[142px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-2">
            <span class="text-sm font-bold text-[var(--text-main)]"
              >本月異動</span
            >
            <span
              class="text-3xl font-black tabular-nums tracking-tight text-[var(--text-main)]"
            >
              {{ formatTwd(delta) }}
            </span>
          </div>
        </div>
        <div>
          <span
            class="text-sm font-bold tabular-nums flex items-center gap-1"
            :class="
              delta >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
            "
          >
            {{ delta >= 0 ? "+" : "" }}{{ formatTwd(delta) }}
            <i
              :class="delta >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              class="text-[10px]"
            ></i>
          </span>
        </div>
      </div>

      <!-- Card 3: 總資產 -->
      <div class="apollo-card flex flex-col justify-between h-[142px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-2">
            <span class="text-sm font-bold text-[var(--text-main)]"
              >總資產</span
            >
            <span
              class="text-3xl font-black text-[var(--text-main)] tabular-nums tracking-tight"
              >{{ formatTwd(totalAsset) }}</span
            >
          </div>
        </div>
        <div>
          <span class="text-sm font-bold text-[var(--text-sub)]">資產總計</span>
        </div>
      </div>

      <!-- Card 4: 總負債 -->
      <div class="apollo-card flex flex-col justify-between h-[142px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-2">
            <span class="text-sm font-bold text-[var(--text-main)]"
              >總負債</span
            >
            <span
              class="text-3xl font-black text-[var(--text-main)] tabular-nums tracking-tight"
              >{{ formatTwd(totalLiab) }}</span
            >
          </div>
          <div
            class="w-[60px] h-[60px] rounded-full border-[3px] border-[var(--primary)] flex items-center justify-center"
          >
            <span class="text-xs font-bold text-[var(--text-sub)]">負債</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 儀表板圖表網格：趨勢與比例 -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 items-start">
      <!-- Trend Chart (Spans 2 columns) -->
      <div class="xl:col-span-2 apollo-card flex flex-col h-[400px]">
        <div class="flex items-center justify-between mb-6">
          <span class="text-[17px] font-bold text-[var(--text-main)]"
            >近 6 個月趨勢</span
          >
          <div class="flex gap-2">
            <button
              class="bg-[var(--app-bg)] text-[var(--text-sub)] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[var(--line-soft)] transition-colors"
            >
              近半年
            </button>
          </div>
        </div>
        <div class="flex-1 w-full min-h-0 relative">
          <Skeleton v-if="isLoading" width="100%" height="100%" />
          <Chart
            v-else
            type="line"
            :data="trendData"
            :options="trendOptions"
            @select="onTrendSelect"
            class="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      <!-- Donut Chart -->
      <div class="xl:col-span-1 apollo-card flex flex-col min-h-[400px]">
        <div class="flex items-center justify-between mb-6">
          <span class="text-[17px] font-bold text-[var(--text-main)]"
            >資產落點</span
          >
          <Tag
            :value="selectedMonth"
            severity="secondary"
            class="shadow-none bg-[var(--app-bg)] text-[var(--text-sub)] font-bold text-[10px]"
          />
        </div>

        <div class="flex-1 flex flex-col justify-center relative min-h-0">
          <Skeleton v-if="isLoading" width="100%" height="200px" />
          <div
            v-else-if="!assetAllocationList.length"
            class="text-center text-[var(--text-sub)] text-sm"
          >
            暫無資料
          </div>
          <template v-else>
            <div
              class="relative w-full max-h-[220px] mx-auto mb-6 shrink-0 aspect-square flex items-center justify-center"
            >
              <Chart
                type="doughnut"
                :data="donutData"
                :options="donutOptions"
                class="w-full h-full"
              />
              <div
                class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center"
              >
                <template v-if="hoveredAssetIdx !== null">
                  <span
                    class="text-[14px] uppercase tracking-widest text-[var(--text-sub)] font-bold mb-1 truncate w-[100px]"
                    >{{
                      assetAllocationList[hoveredAssetIdx].accountName
                    }}</span
                  >
                  <span
                    class="text-[18px] font-black text-[var(--primary)] tabular-nums leading-none"
                    >{{ assetAllocationList[hoveredAssetIdx].pct }}%</span
                  >
                </template>
                <template v-else>
                  <span
                    class="text-[14px] uppercase tracking-widest text-[var(--text-sub)] font-bold mb-1"
                    >總資產</span
                  >
                  <span
                    class="text-[18px] font-black text-[var(--text-main)] tabular-nums leading-none mb-1"
                    >100%</span
                  >
                </template>
              </div>
            </div>

            <div
              class="flex-1 overflow-y-auto w-full px-2"
              style="scrollbar-width: none"
            >
              <div class="flex flex-col gap-2">
                <div
                  v-for="(item, idx) in assetAllocationList"
                  :key="item.id"
                  class="flex items-center justify-between py-1.5 cursor-default hover:bg-[var(--app-bg)] rounded-lg px-2 transition-colors"
                  @mouseenter="hoveredAssetIdx = idx"
                  @mouseleave="hoveredAssetIdx = null"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <div
                      class="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
                      :style="{
                        background:
                          ALLOCATION_PALETTE[idx % ALLOCATION_PALETTE.length],
                      }"
                    ></div>
                    <span
                      class="text-[13px] font-bold text-[var(--text-main)] truncate max-w-[120px]"
                      >{{ item.accountName }}</span
                    >
                  </div>
                  <div class="flex flex-col items-end whitespace-nowrap">
                    <span
                      class="text-[14px] font-black tabular-nums text-[var(--text-main)] leading-tight"
                      >{{ formatTwd(item.netImpactTwd) }}</span
                    >
                    <span
                      class="text-[11px] font-bold tabular-nums text-[var(--text-sub)]"
                      >{{ item.pct }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Data Table Area -->
    <div class="apollo-card p-0 overflow-hidden mt-6 mb-8">
      <div
        class="p-6 border-b border-[var(--line-soft)] flex items-center justify-between"
      >
        <span class="text-[17px] font-bold text-[var(--text-main)]"
          >本月綜合明細</span
        >
        <button
          class="w-8 h-8 rounded-full hover:bg-[var(--app-bg)] flex items-center justify-center text-[var(--text-sub)] transition-colors"
        >
          <i class="pi pi-ellipsis-v text-sm"></i>
        </button>
      </div>
      <div class="p-0">
        <DataTable
          :value="detailedSnapshotRows"
          class="w-full text-sm"
          dataKey="key"
          :loading="isLoading"
          tableStyle="width: 100%; table-layout: fixed;"
          :pt="{
            root: { class: 'border-none' },
            wrapper: { class: 'border-none w-full overflow-hidden' },
          }"
        >
          <Column
            header="帳戶"
            class="py-4 px-3 sm:px-6 border-b border-[var(--line-soft)] w-[40%] sm:w-1/2"
          >
            <template #body="{ data }">
              <div class="flex items-center gap-2 sm:gap-3 overflow-hidden">
                <Tag
                  :value="data.type === 'asset' ? '資' : '債'"
                  :severity="data.type === 'asset' ? 'success' : 'warn'"
                  class="text-[10px] py-1 px-1.5 sm:px-2 rounded font-bold shadow-none shrink-0"
                />
                <span
                  class="text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate"
                  >{{ data.accountName }}</span
                >
              </div>
            </template>
          </Column>
          <!-- 順序調整：先顯示餘額 -->
          <Column
            header="餘額"
            class="py-4 px-3 sm:px-6 border-b border-[var(--line-soft)] text-right w-[35%] sm:w-[25%]"
          >
            <template #body="{ data }">
              <div
                class="text-[14px] sm:text-[15px] font-black tabular-nums text-[var(--text-main)] truncate"
              >
                {{ formatCurrency(data.current, data.currency) }}
              </div>
            </template>
          </Column>
          <!-- 接著顯示異動 -->
          <Column
            header="異動"
            class="py-4 px-3 sm:px-6 border-b border-[var(--line-soft)] text-right w-[25%]"
          >
            <template #body="{ data }">
              <div
                class="text-[13px] sm:text-[14px] font-bold tabular-nums truncate"
                :class="
                  data.delta > 0
                    ? 'text-[var(--positive)]'
                    : data.delta < 0
                      ? 'text-[var(--negative)]'
                      : 'text-[var(--text-sub)]'
                "
              >
                {{ data.delta > 0 ? "+" : ""
                }}{{ formatCurrency(data.delta, data.currency) }}
              </div>
            </template>
          </Column>
          <template #empty>
            <div
              class="py-12 text-center text-[14px] font-semibold text-[var(--text-sub)]"
            >
              暫無資料
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>
