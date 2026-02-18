<script setup lang="ts">
import { computed, h } from "vue";
import type { DataTableColumns } from "naive-ui";
import { NButton, NCard, NDataTable, NDatePicker, NForm, NFormItem, NGrid, NGi, NSpace, NTag, NText, useMessage } from "naive-ui";
import { ALLOCATION_PALETTE, DATE_PICKER_YEAR_RANGE, TYPE_LABELS } from "../constants";
import AssetAllocationDonutChart from "../features/asset-manager/components/AssetAllocationDonutChart.vue";
import AssetFilters from "../features/asset-manager/components/AssetFilters.vue";
import CombinedWaterLineChart from "../features/asset-manager/components/CombinedWaterLineChart.vue";
import {
  useAssetManager,
  type AccountSnapshotRow,
  type SingleAccountTrendRow,
  type TrendRow
} from "../features/asset-manager/composables/useAssetManager";

const message = useMessage();
const {
  formatCurrency,
  formatPct,
  accountDisplayName,
  monthRangeValue,
  combinedWaterPoints,
  combinedWaterPointDetails,
  trendRows,
  accountSnapshotRows,
  selectedAccounts,
  selectedMonth,
  selectedAccount,
  singleAccountTrendRows,
  isMonthOutOfRange
} = useAssetManager();

const trendColumns: DataTableColumns<TrendRow> = [
  { title: "月份", key: "month" },
  {
    title: "資產",
    key: "assetTwd",
    render: (row) => formatCurrency(row.assetTwd, "TWD")
  },
  {
    title: "負債",
    key: "liabilityTwd",
    render: (row) => formatCurrency(row.liabilityTwd, "TWD")
  },
  {
    title: "淨值",
    key: "netTwd",
    render: (row) => formatCurrency(row.netTwd, "TWD")
  },
  {
    title: "月差",
    key: "delta",
    render: (row) => formatCurrency(row.delta, "TWD")
  },
  {
    title: "變動%",
    key: "pct",
    render: (row) => formatPct(row.pct)
  }
];

const snapshotColumns: DataTableColumns<AccountSnapshotRow> = [
  { title: "帳戶名稱", key: "accountName" },
  { title: "分類", key: "category" },
  {
    title: "資產/負債",
    key: "type",
    render: (row) => {
      const tagType = row.type === "asset" ? "success" : "warning";
      return h(NTag, { type: tagType, bordered: false }, { default: () => TYPE_LABELS[row.type] });
    }
  },
  { title: "幣別", key: "currency" },
  {
    title: "本月",
    key: "current",
    render: (row) => formatCurrency(row.current, row.currency)
  },
  {
    title: "月差",
    key: "delta",
    render: (row) => formatCurrency(row.delta, row.currency)
  },
  {
    title: "變動%",
    key: "pct",
    render: (row) => formatPct(row.pct)
  },
  {
    title: "影響(TWD)",
    key: "netImpactTwd",
    render: (row) => formatCurrency(row.netImpactTwd, "TWD")
  }
];

const singleAccountTrendColumns: DataTableColumns<SingleAccountTrendRow> = [
  { title: "月份", key: "month" },
  {
    title: "金額",
    key: "amount",
    render: (row) => {
      if (!selectedAccount.value) {
        return "N/A";
      }
      return formatCurrency(row.amount, selectedAccount.value.currency);
    }
  },
  {
    title: "月差",
    key: "delta",
    render: (row) => {
      if (!selectedAccount.value) {
        return "N/A";
      }
      return formatCurrency(row.delta, selectedAccount.value.currency);
    }
  },
  {
    title: "變動%",
    key: "pct",
    render: (row) => formatPct(row.pct)
  }
];

const allocationRows = computed(() => {
  const accountLabelMap = new Map(selectedAccounts.value.map((account) => [account.id, accountDisplayName(account)]));
  const assets = accountSnapshotRows.value
    .filter((row) => row.type === "asset" && row.netImpactTwd > 0)
    .sort((a, b) => b.netImpactTwd - a.netImpactTwd);
  const total = assets.reduce((sum, row) => sum + row.netImpactTwd, 0);

  if (total <= 0) {
    return [];
  }

  return assets.map((row, index) => ({
    key: row.key,
    label: accountLabelMap.get(row.key) ?? row.accountName,
    valueTwd: row.netImpactTwd,
    share: (row.netImpactTwd / total) * 100,
    color: ALLOCATION_PALETTE[index % ALLOCATION_PALETTE.length]
  }));
});

function handleExportTrend() {
  if (trendRows.value.length === 0) {
    message.warning("沒有資料可匯出");
    return;
  }

  const header = "\uFEFF月份,資產,負債,淨值,月差,變動%";
  const limitWrap = (s: number) => `"${s}"`; // wrap in quotes just in case, though numbers usually fine
  
  const csvContent = trendRows.value.map(row => {
    return [
      row.month,
      row.assetTwd,
      row.liabilityTwd,
      row.netTwd,
      row.delta,
      row.pct ? row.pct.toFixed(2) + "%" : "-"
    ].join(",");
  }).join("\n");

  const blob = new Blob([header + "\n" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `trend_export_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div class="page-container">
    <NGrid :x-gap="16" :y-gap="16" cols="1 s:1 m:2 xl:4" responsive="screen">
      <!-- 篩選器 -->
      <NGi span="1 m:2 xl:4">
        <AssetFilters />
      </NGi>

      <!-- 水位圖 -->
      <NGi span="1 m:2 xl:4">
        <NCard title="水位（TWD）" bordered>
          <NSpace vertical :size="12">
            <div class="range-panel">
              <NForm inline>
                <NFormItem label="日期區間" :show-feedback="false">
                  <NDatePicker
                    v-model:value="monthRangeValue"
                    type="daterange"
                    :clearable="false"
                    :year-range="DATE_PICKER_YEAR_RANGE"
                    :is-date-disabled="isMonthOutOfRange"
                    format="yyyy/MM/dd"
                    style="min-width: 280px"
                  />
                </NFormItem>
              </NForm>
            </div>

            <CombinedWaterLineChart
              :points="combinedWaterPoints"
              :details="combinedWaterPointDetails"
              :show-breakdown="true"
              :max-breakdown-rows="8"
            />
          </NSpace>
        </NCard>
      </NGi>

      <!-- 月度總覽表格 -->
      <NGi span="1 m:2 xl:4">
        <NCard title="月度總覽（TWD）" bordered>
          <template #header-extra>
            <NButton size="small" secondary @click="handleExportTrend">匯出 CSV</NButton>
          </template>
          <NDataTable :columns="trendColumns" :data="trendRows" :pagination="{ pageSize: 12 }" size="small" />
        </NCard>
      </NGi>

      <!-- 明細表格 (左側) -->
      <NGi span="1 m:2 xl:3">
        <NCard :title="`明細（${selectedMonth}）`" bordered>
          <NDataTable :columns="snapshotColumns" :data="accountSnapshotRows" :pagination="false" size="small" />
        </NCard>
      </NGi>

      <!-- 佔比圖 (右側) -->
      <NGi span="1 m:2 xl:1">
        <NCard :title="`佔比（${selectedMonth}）`" bordered>
          <AssetAllocationDonutChart :rows="allocationRows" />
        </NCard>
      </NGi>

      <!-- 單一帳戶趨勢 (選中時顯示) -->
      <NGi v-if="selectedAccount" span="1 m:2 xl:4">
        <NCard :title="`單帳戶：${accountDisplayName(selectedAccount)}`" bordered>
          <NDataTable :columns="singleAccountTrendColumns" :data="singleAccountTrendRows" :pagination="false" size="small" />
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.range-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
