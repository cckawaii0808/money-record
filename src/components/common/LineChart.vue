<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import Chart from "chart.js/auto";
import type { ChartData, ChartOptions } from "chart.js";

const props = defineProps<{
  type?: string;
  data: ChartData<"line">;
  options: ChartOptions<"line">;
  canvasProps?: Record<string, unknown>;
}>();
const canvas = ref<HTMLCanvasElement | null>(null);
// 不將 Chart 實例放入響應式代理，避免內部控制器失去實例參照。
let chart: Chart<"line"> | undefined;
function renderChart() {
  if (!canvas.value) return;
  chart?.destroy();
  chart = new Chart(canvas.value, { type: "line", data: props.data, options: { ...props.options, animation: false } });
}
onMounted(renderChart);
watch([() => props.data, () => props.options], renderChart, { flush: "post" });
onBeforeUnmount(() => { chart?.destroy(); chart = undefined; });
</script>

<template>
  <div class="line-chart"><canvas ref="canvas" role="img" aria-label="資產水位折線圖" v-bind="canvasProps" /></div>
</template>

<style scoped>
.line-chart { position: relative; min-width: 0; height: 100%; width: 100%; }
</style>
