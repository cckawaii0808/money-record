<script setup lang="ts">
import { computed, ref } from "vue";
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
  months // 基於此計算前後月
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
    .filter(r => r.type === "asset" && r.netImpactTwd > 0)
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
        pct: pctValue.toFixed(1)
      });
    }
  });

  if (otherTwd > 0) {
    result.push({
      id: 'other-small-assets',
      accountName: '其他小額資產',
      netImpactTwd: otherTwd,
      currency: 'TWD',
      pct: total > 0 ? ((otherTwd / total) * 100).toFixed(1) : "0.0"
    });
  }

  return result;
});

// --- KPI ---
const latestTrend = computed(() => trendRows.value[trendRows.value.length - 1] ?? null);
const netWorth   = computed(() => Math.round(latestTrend.value?.netTwd ?? 0));
const totalAsset = computed(() => Math.round(latestTrend.value?.assetTwd ?? 0));
const totalLiab  = computed(() => Math.round(latestTrend.value?.liabilityTwd ?? 0));
const delta      = computed(() => Math.round(latestTrend.value?.delta ?? 0));
const deltaPct   = computed(() => latestTrend.value?.pct ?? null);
const deltaPos   = computed(() => delta.value >= 0);
const deltaSign  = (v: number) => v > 0 ? "+" : "";

// --- 綜合明細列表 (<1% 合併) ---
const detailedSnapshotRows = computed(() => {
  const assets = accountSnapshotRows.value.filter(r => r.type === "asset" && r.current > 0).sort((a,b) => b.netImpactTwd - a.netImpactTwd);
  const liabs = accountSnapshotRows.value.filter(r => r.type === "liability" && r.current > 0).sort((a,b) => Math.abs(b.netImpactTwd) - Math.abs(a.netImpactTwd));

  const totalAssetVal = assets.reduce((sum, r) => sum + r.netImpactTwd, 0);
  const totalLiabVal = liabs.reduce((sum, r) => sum + Math.abs(r.netImpactTwd), 0);

  const result: any[] = [];
  
  // -- 資產 --
  let otherAssetCurrent = 0;
  let otherAssetDelta = 0;
  
  assets.forEach(r => {
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
      key: 'other-small-assets',
      accountName: '其他小額資產',
      type: 'asset',
      currency: 'TWD',
      current: otherAssetCurrent,
      delta: otherAssetDelta
    });
  }

  // -- 負債 --
  let otherLiabCurrent = 0;
  let otherLiabDelta = 0;

  liabs.forEach(r => {
    const absVal = Math.abs(r.netImpactTwd);
    const pct = totalLiabVal > 0 ? (absVal / totalLiabVal) * 100 : 0;
    if (pct < 1.0) {
      otherLiabCurrent += absVal;
      otherLiabDelta += (r.deltaTwd * -1); 
    } else {
      result.push(r);
    }
  });

  if (otherLiabCurrent > 0) {
    result.push({
      key: 'other-small-liabs',
      accountName: '其他小額負債',
      type: 'liability',
      currency: 'TWD',
      current: otherLiabCurrent,
      delta: otherLiabDelta
    });
  }

  // 把餘額為 0 且有異動的也加回來（例如剛全部結清的帳戶），保持明細完整性
  const zeroAccounts = accountSnapshotRows.value.filter(r => r.current === 0 && r.delta !== 0);
  
  return [...result, ...zeroAccounts];
});

// --- 趨勢折線（近 6 個月）---
const trendData = computed(() => {
  const rows = trendRows.value.slice(-6);
  return {
    labels: rows.map(r => r.month),
    datasets: [{
      label: "淨值",
      data: rows.map(r => r.netTwd),
      borderColor: "#0f766e",
      backgroundColor: "rgba(15,118,110,0.08)",
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: "#0f766e",
      borderWidth: 2.5
    }]
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
      titleFont: { size: 14, weight: 'bold' },
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
        }
      }
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: {
        font: { size: 11 },
        callback: (v: number) => {
          if (Math.abs(v) >= 1000000) return `${(v/1000000).toFixed(1)}M`;
          if (Math.abs(v) >= 10000)   return `${(v/10000).toFixed(0)}萬`;
          return v;
        }
      }
    }
  }
};

// --- 佔比圓餅 ---
const donutData = computed(() => {
  return {
    labels: assetAllocationList.value.map(r => `${r.accountName} (${r.pct}%)`),
    datasets: [{
      data: assetAllocationList.value.map(r => r.netImpactTwd),
      backgroundColor: assetAllocationList.value.map((_, i) => ALLOCATION_PALETTE[i % ALLOCATION_PALETTE.length]),
      hoverOffset: 10,
      borderWidth: 2,
      borderColor: "transparent"
    }]
  };
});

const donutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  layout: {
    padding: 15 // 在圖表繪製區域增加內距，徹底解決邊緣被切掉的問題
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  onHover: (event: any, elements: any) => {
    if (elements && elements.length > 0) {
      hoveredAssetIdx.value = elements[0].index;
    } else {
      hoveredAssetIdx.value = null;
    }
  }
}));
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 pt-6 pb-24 transition-all">
    <!-- 原標題區 -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-[var(--text-main)] tracking-tight m-0">資產總覽</h1>
    </div>

    <!-- 頂部數據列 -->
    <!-- 數據面板：整合日期導覽與 KPI -->
    <div v-if="isLoading" class="mb-8">
      <Skeleton height="150px" borderRadius="16px" />
    </div>

    <div v-else class="rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] shadow-sm mb-8 overflow-hidden">
      <!-- 上半部：日期切換區 (極簡純文字風格) -->
      <div class="flex items-center justify-center p-6 border-b border-[var(--line-soft)] bg-transparent">
        <div class="flex items-center gap-8">
          <Button 
            icon="pi pi-chevron-left" 
            text 
            rounded 
            @click="goToPreviousMonth" 
            :disabled="!hasPreviousMonth"
            class="text-[var(--primary)] !p-2 transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[var(--primary)]/5"
          />
          <Select 
            v-model="selectedMonth" 
            :options="monthOptions" 
            optionLabel="label" 
            optionValue="value" 
            class="flex-1 border-none shadow-none focus:ring-0 bg-transparent cursor-pointer" 
            :pt="{
              root: { class: 'bg-transparent border-none p-0' },
              label: { class: 'text-center p-0 text-2xl font-black text-[var(--text-main)] hover:text-[var(--primary)] transition-all' },
              dropdown: { class: 'hidden' },
              pcOverlay: { class: 'shadow-2xl rounded-2xl border border-[var(--line-soft)]' },
              option: { class: 'flex justify-center p-4 font-bold' }
            }"
          />
          <Button 
            icon="pi pi-chevron-right" 
            text 
            rounded 
            @click="goToNextMonth" 
            :disabled="!hasNextMonth"
            class="text-[var(--primary)] !p-2 transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[var(--primary)]/5"
          />
        </div>
      </div>

      <!-- 下半部：KPI 數據 (三格置中立線) -->
      <div class="flex items-stretch divide-x divide-[var(--line-soft)]">
        <!-- 淨值 -->
        <div class="flex-1 flex flex-col items-center py-5 gap-0.5">
          <span class="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-wider">本月淨值</span>
          <span class="text-xl md:text-2xl font-bold tabular-nums text-[var(--primary)]">{{ formatTwd(netWorth) }}</span>
          <div v-if="deltaPct != null" class="flex gap-2 items-center">
            <span class="text-[11px] font-bold tabular-nums" :class="deltaPos ? 'text-green-600' : 'text-red-500'">
              {{ deltaSign(deltaPct) }}{{ deltaPct.toFixed(1) }}%
            </span>
          </div>
        </div>
        
        <!-- 資產 -->
        <div class="flex-1 flex flex-col items-center py-5 gap-0.5">
          <span class="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-wider">資產合計</span>
          <span class="text-xl md:text-2xl font-bold tabular-nums text-[var(--positive)]">{{ formatTwd(totalAsset) }}</span>
        </div>
        
        <!-- 負債 -->
        <div class="flex-1 flex flex-col items-center py-5 gap-0.5">
          <span class="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-wider">負債合計</span>
          <span class="text-xl md:text-2xl font-bold tabular-nums text-[var(--negative)]">{{ formatTwd(totalLiab) }}</span>
        </div>
      </div>
    </div>

    <!-- 儀表板網格系統 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- 左側主視窗 (手機版排在第 2) -->
      <div class="lg:col-span-8 flex flex-col gap-8 order-2 lg:order-1">
        
        <!-- 趨勢折線圖 -->
        <Card class="shadow-sm border border-[var(--line-soft)]" :pt="{ content: { class: 'p-0' } }">
          <template #title>
            <div class="px-6 pt-4 flex items-center justify-between">
              <span class="text-lg font-bold text-[var(--text-main)]">近 6 個月趨勢</span>
            </div>
          </template>
          <template #content>
            <Skeleton v-if="isLoading" height="300px" borderRadius="10px" />
            <div v-else class="h-[300px] w-full">
              <Chart type="line" :data="trendData" :options="trendOptions" @select="onTrendSelect" class="h-full" />
            </div>
          </template>
        </Card>

        <!-- 本月明細 (使用 DataTable 取代手動寫) -->
        <Card class="shadow-sm border border-[var(--line-soft)] overflow-hidden" :pt="{ body: { class: 'p-0' } }">
          <template #title>
            <div class="p-6 border-b border-[var(--line-soft)] bg-[var(--app-bg)]/30">
              <span class="text-lg font-bold text-[var(--text-main)]">本月綜合明細</span>
            </div>
          </template>
          <template #content>
            <DataTable 
              :value="detailedSnapshotRows" 
              class="w-full text-sm" 
              dataKey="key" 
              :loading="isLoading"
              stripedRows
              responsiveLayout="scroll"
            >
              <Column header="帳戶" class="w-full">
                <template #body="{ data }">
                  <div class="flex items-center gap-3 min-w-0">
                    <Tag
                      :value="data.type === 'asset' ? '資' : '債'"
                      :severity="data.type === 'asset' ? 'success' : 'warn'"
                      class="text-[10px] py-0.5 px-2 shrink-0 rounded-md shadow-sm"
                    />
                    <span class="text-base font-bold text-[var(--text-main)] truncate">{{ data.accountName }}</span>
                  </div>
                </template>
              </Column>
              <Column header="餘額" class="text-right">
                <template #body="{ data }">
                  <div class="text-right shrink-0">
                    <div class="text-base font-black tabular-nums text-[var(--text-main)] whitespace-nowrap">
                      {{ formatCurrency(data.current, data.currency) }}
                    </div>
                    <div
                      v-if="data.delta !== 0"
                      class="text-xs font-bold tabular-nums mt-0.5"
                      :class="data.delta > 0 ? 'text-green-600' : 'text-red-500'"
                    >
                      {{ data.delta > 0 ? '+' : '' }}{{ formatCurrency(data.delta, data.currency) }}
                    </div>
                  </div>
                </template>
              </Column>
              <template #empty>
                <div class="p-8 text-center text-sub">目前沒有記錄</div>
              </template>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- 右側資訊欄 (手機版排在第 1) - Sticky -->
      <div class="lg:col-span-4 sticky top-6 order-1 lg:order-2">
        
        <!-- 資產佈局圓餅 -->
        <Card class="shadow-sm border border-[var(--line-soft)]">
          <template #title>
            <div class="flex items-center justify-between mb-8">
              <span class="text-lg font-bold text-[var(--text-main)]">資產佈局</span>
              <Tag :value="selectedMonth" severity="info" class="text-[10px] uppercase font-bold tracking-widest" />
            </div>
          </template>
          <template #content>
            <Skeleton v-if="isLoading" height="240px" borderRadius="14px" />
            <div v-else-if="!assetAllocationList.length" class="py-12 text-center text-sm text-[var(--text-sub)]">
              本月無資產資料
            </div>
            
            <div v-else class="flex flex-col items-center">
              <!-- 圓餅圖容器 (使用 aspect-ratio 確保正圓且不被切割) -->
              <div class="relative w-full max-w-[280px] aspect-square flex items-center justify-center mb-8 shrink-0">
                <Chart type="doughnut" :data="donutData" :options="donutOptions" class="w-full h-full" />
                
                <!-- 中央文字 (整合金額與百分比) -->
                <div class="absolute flex flex-col items-center justify-center pointer-events-none text-center w-32">
                  <template v-if="hoveredAssetIdx !== null">
                    <span class="text-[15px] uppercase tracking-widest text-[var(--text-sub)] font-bold mb-1 truncate w-full">
                      {{ assetAllocationList[hoveredAssetIdx].accountName }}
                    </span>
                    <span class="text-[15px] font-black text-[var(--primary)] tabular-nums leading-none mb-1">
                      {{ assetAllocationList[hoveredAssetIdx].pct }}%
                    </span>
                    <span class="text-[15px] font-bold text-[var(--text-main)] opacity-70">
                      {{ formatCurrency(assetAllocationList[hoveredAssetIdx].netImpactTwd, assetAllocationList[hoveredAssetIdx].currency) }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="text-[15px] uppercase tracking-widest text-[var(--text-sub)] font-bold mb-1">總資產</span>
                    <span class="text-[15px] font-black text-[var(--text-main)] tabular-nums leading-none mb-1">100%</span>
                    <span class="text-[15px] font-bold text-[var(--positive)]">
                      {{ formatTwd(totalAsset) }}
                    </span>
                  </template>
                </div>
              </div>

              <!-- 垂直圖例清單 -->
              <div class="w-full">
                <div class="flex flex-col gap-1">
                  <div 
                    v-for="(item, idx) in assetAllocationList" 
                    :key="item.id"
                    class="flex items-center justify-between group cursor-default p-2 rounded-xl hover:bg-[var(--app-bg)] transition-all"
                    @mouseenter="hoveredAssetIdx = idx"
                    @mouseleave="hoveredAssetIdx = null"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-3 h-3 rounded-full shrink-0 shadow-sm" :style="{ background: ALLOCATION_PALETTE[idx % ALLOCATION_PALETTE.length] }" />
                      <span class="text-[15px] font-bold text-[var(--text-main)] truncate group-hover:text-[var(--primary)] transition-colors">
                        {{ item.accountName }}
                      </span>
                    </div>
                    
                    <div class="flex items-center gap-4 shrink-0 text-right">
                      <span class="text-sm font-semibold text-[var(--text-sub)] tabular-nums">
                        {{ formatCurrency(item.netImpactTwd, item.currency) }}
                      </span>
                      <span class="text-sm font-black text-[var(--text-main)] tabular-nums w-[45px] text-right">
                        {{ item.pct }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

      </div>
    </div>
  </div>
</template>
