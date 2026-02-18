<script setup lang="ts">
import { computed, ref } from "vue";
import { formatTwd } from "../../../utils/formatters";

interface AllocationSlice {
  key: string;
  label: string;
  valueTwd: number;
  share: number;
  color: string;
}

const props = defineProps<{
  rows: AllocationSlice[];
}>();

const hoveredKey = ref<string | null>(null);
const size = 220;
const center = size / 2;
const strokeWidth = 30;
const radius = center - strokeWidth / 2 - 4;
const circumference = 2 * Math.PI * radius;

const totalTwd = computed(() => {
  return props.rows.reduce((sum, row) => sum + row.valueTwd, 0);
});

const donutSegments = computed(() => {
  let accumLength = 0;
  return props.rows.map((row) => {
    const ratio = Math.max(0, row.share) / 100;
    const segmentLength = circumference * ratio;
    const segment = {
      ...row,
      dasharray: `${segmentLength} ${Math.max(0, circumference - segmentLength)}`,
      dashoffset: -accumLength
    };
    accumLength += segmentLength;
    return segment;
  });
});

const activeSlice = computed(() => {
  if (!hoveredKey.value) {
    return null;
  }
  return props.rows.find((row) => row.key === hoveredKey.value) ?? null;
});



function formatShare(value: number): string {
  return `${Math.round(value)}%`;
}
</script>

<template>
  <div class="allocation-wrap">
    <div v-if="rows.length > 0" class="allocation-layout">
      <div class="donut-shell" @mouseleave="hoveredKey = null">
        <svg
          :viewBox="`0 0 ${size} ${size}`"
          class="donut-svg"
          role="img"
          aria-label="資產佔比圖"
        >
          <circle :cx="center" :cy="center" :r="radius" :stroke-width="strokeWidth" class="donut-track" />

          <g :transform="`rotate(-90 ${center} ${center})`">
            <circle
              v-for="segment in donutSegments"
              :key="segment.key"
              :cx="center"
              :cy="center"
              :r="radius"
              class="donut-segment"
              :class="{ 'is-active': hoveredKey === segment.key }"
              :stroke="segment.color"
              :stroke-width="strokeWidth"
              :stroke-dasharray="segment.dasharray"
              :stroke-dashoffset="segment.dashoffset"
              @mouseenter="hoveredKey = segment.key"
            />
          </g>
        </svg>

        <div class="donut-core">
          <div class="core-label">{{ activeSlice ? activeSlice.label : "資產佔比" }}</div>
          <div class="core-value">{{ formatTwd(activeSlice ? activeSlice.valueTwd : totalTwd) }}</div>
          <div v-if="activeSlice" class="core-share">{{ formatShare(activeSlice.share) }}</div>
        </div>

      </div>

      <div class="side-panel">
        <div class="legend" @mouseleave="hoveredKey = null">
          <div
            v-for="row in rows"
            :key="row.key"
            class="legend-row"
            :class="{ 'legend-active': hoveredKey === row.key }"
            @mouseenter="hoveredKey = row.key"
          >
            <span class="legend-dot" :style="{ background: row.color }" />
            <span class="legend-name">{{ row.label }}</span>
            <span class="legend-share">{{ Math.round(row.share) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty">本月沒有可用資產資料</div>
  </div>
</template>

<style scoped>
.allocation-wrap {
  width: 100%;
}

.allocation-layout {
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.donut-shell {
  display: grid;
  place-items: center;
  position: relative;
  min-height: 250px;
}

.donut-svg {
  width: min(240px, 100%);
  height: auto;
  display: block;
}

.donut-track {
  fill: none;
  stroke: color-mix(in srgb, var(--line-soft) 70%, var(--surface) 30%);
}

.donut-segment {
  fill: none;
  stroke-linecap: butt;
  opacity: 0.9;
  cursor: pointer;
  transition: opacity 0.2s ease, filter 0.2s ease;
}

.donut-segment:hover,
.donut-segment.is-active {
  opacity: 1;
  filter: brightness(1.05);
}

.donut-core {
  position: absolute;
  width: 122px;
  height: 122px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--line-soft);
  display: grid;
  place-items: center;
  align-content: center;
  padding: 8px;
  text-align: center;
}

.core-label {
  font-size: 12px;
  color: var(--text-sub);
  font-weight: 700;
}

.core-value {
  font-size: 14px;
  line-height: 1.2;
  color: var(--text-main);
  font-weight: 800;
}

.core-share {
  margin-top: 2px;
  font-size: 12px;
  color: var(--primary);
  font-weight: 800;
}

.side-panel {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.legend {
  display: grid;
  gap: 4px;
  max-height: 320px;
  overflow: auto;
  padding-right: 4px;
}

.legend-row {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 8px;
  align-items: center;
  border-radius: 8px;
  padding: 8px 8px;
  transition: background-color 0.2s ease;
}

.legend-row:hover,
.legend-active {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.legend-name {
  color: var(--text-main);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-share {
  color: var(--text-sub);
  font-size: 12px;
  font-weight: 700;
}

.empty {
  min-height: 160px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--line-soft);
  border-radius: 10px;
  color: var(--text-sub);
}

@media (max-width: 960px) {
  .allocation-layout {
    grid-template-columns: 1fr;
  }

  .donut-shell {
    min-height: 220px;
  }
}
</style>
