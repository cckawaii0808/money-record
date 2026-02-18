<script setup lang="ts">
import { computed, ref } from "vue";
import type { CombinedWaterPoint, CombinedWaterPointDetail } from "../composables/useAssetManager";
import { formatCurrency, formatInteger, formatTwd } from "../../../utils/formatters";

const props = defineProps<{
  points: CombinedWaterPoint[];
  details?: CombinedWaterPointDetail[];
  showBreakdown?: boolean;
  maxBreakdownRows?: number;
  chartHeight?: number;
  showPointValues?: boolean;
  preset?: "default" | "dashboard";
}>();

const width = 980;
const defaultHeight = 280;
const isDashboardPreset = computed(() => props.preset === "dashboard");
const padding = computed(() => {
  if (isDashboardPreset.value) {
    return {
      top: 28,
      right: 168,
      bottom: 78,
      left: 84
    };
  }
  return {
    top: 20,
    right: 92,
    bottom: 52,
    left: 28
  };
});
const chartHeight = computed(() => Math.max(240, props.chartHeight ?? defaultHeight));
const baselineY = computed(() => chartHeight.value - padding.value.bottom);
const dotHitRadius = computed(() => (isDashboardPreset.value ? 13 : 9));
const dotRadius = computed(() => (isDashboardPreset.value ? 5.2 : 3.8));
const valueOffsetY = computed(() => (isDashboardPreset.value ? 16 : 11));
const xLabelOffsetY = computed(() => (isDashboardPreset.value ? 32 : 22));

const values = computed(() => props.points.map((item) => item.totalTwd));
const hoveredIndex = ref<number | null>(null);

const domain = computed(() => {
  if (values.value.length === 0) {
    return { min: 0, max: 100, step: 20 };
  }

  const minData = Math.min(...values.value);
  const maxData = Math.max(...values.value);

  if (minData === maxData) {
    if (minData === 0) return { min: 0, max: 100, step: 20 };
    const step = Math.pow(10, Math.floor(Math.log10(Math.abs(minData)))) || 10;
    return {
      min: Math.floor(minData / step) * step - step,
      max: Math.ceil(maxData / step) * step + step,
      step
    };
  }

  // Calculate "nice" scale
  const targetTickCount = 5;
  const roughRange = (maxData - minData) * 1.25; // Add vertical breathing room
  const roughStep = roughRange / targetTickCount;

  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalizedStep = roughStep / magnitude;

  let niceStep = magnitude;
  if (normalizedStep <= 1) niceStep = 1 * magnitude;
  else if (normalizedStep <= 2) niceStep = 2 * magnitude;
  else if (normalizedStep <= 5) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;

  // Enforce integer steps
  niceStep = Math.max(1, Math.round(niceStep));

  // Determine min/max based on nice step
  const niceMin = Math.floor(minData / niceStep) * niceStep;
  const niceMax = Math.ceil(maxData / niceStep) * niceStep;
  
  // Add extra padding if data points are too close to the edge
  const finalMin = (minData - niceMin) < niceStep * 0.1 ? niceMin - niceStep : niceMin;
  const finalMax = (niceMax - maxData) < niceStep * 0.1 ? niceMax + niceStep : niceMax;

  return { min: finalMin, max: finalMax, step: niceStep };
});

function xAt(index: number): number {
  const chartWidth = width - padding.value.left - padding.value.right;
  if (props.points.length <= 1) {
    return padding.value.left + chartWidth / 2;
  }
  return padding.value.left + (chartWidth * index) / (props.points.length - 1);
}

function yAt(value: number): number {
  const chartAreaHeight = chartHeight.value - padding.value.top - padding.value.bottom;
  const d = domain.value;
  const ratio = (value - d.min) / (d.max - d.min);
  return padding.value.top + chartAreaHeight - ratio * chartAreaHeight;
}

const polyline = computed(() => {
  return props.points
    .map((item, index) => `${xAt(index)},${yAt(item.totalTwd)}`)
    .join(" ");
});

const areaPath = computed(() => {
  if (chartPoints.value.length === 0) {
    return "";
  }
  const first = chartPoints.value[0];
  const head = `M ${first.x} ${baselineY.value}`;
  const line = chartPoints.value.map((point) => `L ${point.x} ${point.y}`).join(" ");
  const tail = `L ${chartPoints.value[chartPoints.value.length - 1].x} ${baselineY.value} Z`;
  return `${head} ${line} ${tail}`;
});

const chartPoints = computed(() => {
  return props.points.map((point, index) => ({
    ...point,
    index,
    x: xAt(index),
    y: yAt(point.totalTwd)
  }));
});

const hoveredPoint = computed(() => {
  if (hoveredIndex.value === null) {
    return null;
  }
  return chartPoints.value[hoveredIndex.value] ?? null;
});

const detailMap = computed(() => {
  const map = new Map<string, CombinedWaterPointDetail>();
  for (const item of props.details ?? []) {
    map.set(item.key, item);
  }
  return map;
});

const hoveredDetail = computed(() => {
  const point = hoveredPoint.value;
  if (!point) {
    return null;
  }
  return detailMap.value.get(point.key) ?? null;
});

const breakdownRows = computed(() => {
  if (!props.showBreakdown || !hoveredDetail.value) {
    return [];
  }
  const limit = Math.max(1, props.maxBreakdownRows ?? 6);
  return hoveredDetail.value.breakdown.slice(0, limit);
});

const breakdownHiddenCount = computed(() => {
  if (!props.showBreakdown || !hoveredDetail.value) {
    return 0;
  }
  const limit = Math.max(1, props.maxBreakdownRows ?? 6);
  return Math.max(0, hoveredDetail.value.breakdown.length - limit);
});

const yTicks = computed(() => {
  const d = domain.value;
  const output: { y: number; value: number }[] = [];
  
  // Generate ticks from max down to min by step
  // Using Math.round to avoid floating point errors
  for (let val = d.max; val >= d.min; val -= d.step) {
    output.push({ y: yAt(val), value: val });
  }
  return output;
});

const xLabelStep = computed(() => {
  if (props.points.length <= 8) {
    return 1;
  }
  return Math.ceil(props.points.length / 8);
});

function formatAxisValue(value: number): string {
  return formatInteger(value);
}

function formatXAxisLabel(month: string): string {
  const [year, mon] = month.split("-");
  if (!year || !mon) {
    return month;
  }
  return `${year}/${mon}`;
}

function edgeLabelX(index: number, x: number, total: number): number {
  if (total <= 1) {
    return x;
  }
  if (index === 0) {
    return x + (isDashboardPreset.value ? 8 : 6);
  }
  if (index === total - 1) {
    return x - (isDashboardPreset.value ? 10 : 6);
  }
  return x;
}

function edgeLabelAnchor(index: number, total: number): "start" | "middle" | "end" {
  if (total <= 1) {
    return "middle";
  }
  if (index === 0) {
    return "start";
  }
  if (index === total - 1) {
    return "end";
  }
  return "middle";
}

const tooltipStyle = computed(() => {
  if (!hoveredPoint.value) {
    return {};
  }
  return {
    left: `${(hoveredPoint.value.x / width) * 100}%`,
    top: `${(hoveredPoint.value.y / chartHeight.value) * 100}%`
  };
});

const tooltipClass = computed(() => {
  if (!hoveredPoint.value) {
    return "";
  }
  return hoveredPoint.value.x > width * 0.62 ? "tip-left" : "tip-right";
});
</script>

<template>
  <div :class="['chart-shell', { 'preset-dashboard': isDashboardPreset }]">
    <div v-if="points.length === 0" class="empty">目前區間沒有資料</div>

    <svg
      v-else
      :viewBox="`0 0 ${width} ${chartHeight}`"
      class="chart-svg"
      role="img"
      aria-label="選取帳戶加總水位折線圖"
      @mouseleave="hoveredIndex = null"
    >
      <line
        :x1="padding.left"
        :y1="baselineY"
        :x2="width - padding.right"
        :y2="baselineY"
        class="axis"
      />
      <line
        :x1="width - padding.right"
        :y1="padding.top"
        :x2="width - padding.right"
        :y2="baselineY"
        class="axis"
      />

      <g v-for="tick in yTicks" :key="tick.y">
        <line :x1="padding.left" :y1="tick.y" :x2="width - padding.right" :y2="tick.y" class="grid-line" />
        <text :x="width - padding.right + 16" :y="tick.y + 6" class="y-label">{{ formatAxisValue(tick.value) }}</text>
      </g>

      <path v-if="areaPath" :d="areaPath" class="area-fill" />
      <polyline :points="polyline" class="trend-line" />

      <g v-for="point in chartPoints" :key="point.key">
        <circle
          :cx="point.x"
          :cy="point.y"
          :r="dotHitRadius"
          class="dot-hit"
          @mouseenter="hoveredIndex = point.index"
        />
        <circle
          :cx="point.x"
          :cy="point.y"
          :r="dotRadius"
          :class="['dot', { 'dot-active': hoveredIndex === point.index }]"
        >
          <title>{{ point.month }} {{ formatTwd(point.totalTwd) }}</title>
        </circle>

        <text
          v-if="hoveredIndex === point.index"
          :x="edgeLabelX(point.index, point.x, chartPoints.length)"
          :y="point.y - valueOffsetY"
          :text-anchor="edgeLabelAnchor(point.index, chartPoints.length)"
          class="edge-value"
        >
          {{ formatTwd(point.totalTwd) }}
        </text>
      </g>

      <text
        v-for="(point, index) in points"
        v-show="index % xLabelStep === 0 || index === points.length - 1"
        :key="`label-${point.key}`"
        :x="xAt(index)"
        :y="baselineY + xLabelOffsetY"
        class="x-label"
      >
        {{ formatXAxisLabel(point.month) }}
      </text>
    </svg>

    <div
      v-if="hoveredPoint"
      class="hover-tip"
      :class="tooltipClass"
      :style="tooltipStyle"
    >
      <div class="tip-head">
        <span>{{ hoveredPoint.month }}</span>
        <strong>{{ formatTwd(hoveredPoint.totalTwd) }}</strong>
      </div>

      <div v-if="showBreakdown && breakdownRows.length > 0" class="tip-list">
        <div v-for="row in breakdownRows" :key="`${hoveredPoint.key}-${row.accountId}`" class="tip-row">
          <span class="tip-name">{{ row.accountName }}</span>
          <span class="tip-impact" :class="row.type === 'asset' ? 'is-up' : 'is-down'">
            {{ formatTwd(row.signedTwd) }}
          </span>
        </div>
        <div v-if="breakdownHiddenCount > 0" class="tip-more">+{{ breakdownHiddenCount }} 個帳戶</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-shell {
  position: relative;
  width: 100%;
  min-height: 0;
}

.chart-svg {
  width: 100%;
  margin: 0 auto;
  height: auto;
  display: block;
}

.empty {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-sub);
  border: 1px dashed var(--line-soft);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface) 90%, var(--primary) 10%);
}

.axis {
  stroke: color-mix(in srgb, var(--line-strong) 70%, transparent);
  stroke-width: 1.4;
}

.grid-line {
  stroke: color-mix(in srgb, var(--line-soft) 76%, transparent);
  stroke-width: 1;
  stroke-dasharray: 4 5;
}

.area-fill {
  fill: color-mix(in srgb, var(--primary) 18%, transparent);
}

.trend-line {
  fill: none;
  stroke: var(--primary);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dot {
  fill: var(--primary);
  transition: transform 0.12s ease, fill 0.12s ease;
  transform-origin: center;
}

.dot-active {
  fill: var(--accent);
  transform: scale(1.2);
}

.dot-hit {
  fill: transparent;
}

.y-label {
  font-size: 14px;
  fill: var(--text-sub);
  text-anchor: start;
  font-weight: 700;
}

.x-label {
  font-size: 14px;
  fill: var(--text-sub);
  text-anchor: middle;
  font-weight: 700;
}

.edge-value {
  font-size: 14px;
  fill: var(--text-main);
  paint-order: stroke;
  stroke: var(--surface);
  stroke-width: 3.2px;
  font-weight: 800;
}

.hover-tip {
  position: absolute;
  min-width: 220px;
  max-width: 300px;
  border-radius: 12px;
  border: 1px solid var(--line-soft);
  background: color-mix(in srgb, var(--surface) 94%, var(--primary) 6%);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--text-main) 16%, transparent);
  pointer-events: none;
  z-index: 4;
}

.tip-left {
  transform: translate(-104%, -88%);
}

.tip-right {
  transform: translate(12px, -88%);
}

.tip-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  color: var(--text-main);
  border-bottom: 1px solid var(--line-soft);
  background: color-mix(in srgb, var(--accent) 9%, transparent);
}

.tip-head span {
  font-size: 14px;
  color: var(--text-sub);
}

.tip-head strong {
  font-size: 18px;
}

.tip-list {
  padding: 8px 10px;
  display: grid;
  gap: 6px;
}

.tip-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.tip-name {
  color: var(--text-main);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tip-amount {
  color: var(--text-sub);
}

.tip-impact {
  font-weight: 700;
}

.is-up {
  color: var(--positive);
}

.is-down {
  color: var(--negative);
}

.tip-more {
  padding-top: 2px;
  font-size: 14px;
  color: var(--text-sub);
}

.preset-dashboard .chart-svg {
  width: 92%;
}

.preset-dashboard .trend-line {
  stroke-width: 4.5;
}

.preset-dashboard .y-label {
  font-size: 20px;
}

.preset-dashboard .x-label {
  font-size: 18px;
}

.preset-dashboard .edge-value {
  font-size: 20px;
  stroke-width: 4px;
}

@media (max-width: 900px) {
  .preset-dashboard .chart-svg {
    width: 100%;
  }
}
</style>
