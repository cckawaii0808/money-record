<script setup lang="ts">
/**
 * 右下角浮動 AI 助手「小錢包」
 *
 * - 滑鼠 hover 顯示選單（桌面）；點擊主按鈕切換選單（手機）
 * - 目前只提供「最近消費分析」：點名 3 個變動最大帳戶並上色
 * - 手機版自動避開底部導覽列（70px + safe-area）
 */
import { ref, computed, onBeforeUnmount } from "vue";
import { useAssetManagerStore } from "../stores/assetManager";
import { askGemini, isAiAvailable, GeminiError } from "../services/geminiApi";
import {
  pickTopMovers,
  buildSpendingAnalysisPrompt,
  parseAnalysisReply,
  type AnalysisResult
} from "../services/financialSummary";

const store = useAssetManagerStore();

const menuOpen = ref(false);
const chatOpen = ref(false);
const loading = ref(false);
const analysis = ref<AnalysisResult | null>(null);
const rawFallback = ref("");
const errorText = ref("");

let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;

function clearHoverTimer() {
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer);
    hoverCloseTimer = null;
  }
}

function onHoverEnter() {
  clearHoverTimer();
  menuOpen.value = true;
}

function onHoverLeave() {
  clearHoverTimer();
  hoverCloseTimer = setTimeout(() => {
    menuOpen.value = false;
  }, 180);
}

function toggleMenuClick() {
  menuOpen.value = !menuOpen.value;
}

onBeforeUnmount(clearHoverTimer);

const aiReady = computed(() => isAiAvailable());

function formatDelta(n: number, currency: string): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${Math.abs(Math.round(n)).toLocaleString("zh-TW")} ${currency}`;
}

async function runSpendingAnalysis() {
  menuOpen.value = false;
  chatOpen.value = true;
  analysis.value = null;
  rawFallback.value = "";
  errorText.value = "";

  if (!aiReady.value) {
    errorText.value = "尚未設定 AI 金鑰（VITE_GEMINI_API_KEY），請到 .env 補上後重啟 dev server。";
    return;
  }

  if (store.isLoading) {
    await store.initData();
  }

  loading.value = true;
  try {
    const movers = pickTopMovers(store, 3);
    if (movers.length === 0) {
      analysis.value = {
        summary: "這個月各帳戶都很穩，沒什麼波動欸 😌",
        highlights: [],
        advice: "趁風平浪靜，可以把下個月的預算先規劃好～"
      };
      return;
    }

    const prompt = buildSpendingAnalysisPrompt(store, movers);
    const raw = await askGemini(prompt);
    try {
      analysis.value = parseAnalysisReply(raw, movers);
    } catch {
      // JSON 解析失敗 → 降級為純文字顯示
      rawFallback.value = raw;
    }
  } catch (e) {
    if (e instanceof GeminiError) {
      errorText.value = e.message;
    } else {
      errorText.value = `分析失敗：${String(e)}`;
    }
  } finally {
    loading.value = false;
  }
}

function closeChat() {
  chatOpen.value = false;
  analysis.value = null;
  rawFallback.value = "";
  errorText.value = "";
}
</script>

<template>
  <div
    class="ai-assistant-root fixed z-[120] flex flex-col items-end gap-2"
    @mouseenter="onHoverEnter"
    @mouseleave="onHoverLeave"
  >
    <!-- ── 聊天回應泡泡 ──────────────────────────────────────── -->
    <transition name="ai-pop">
      <div
        v-if="chatOpen"
        class="ai-chat-bubble w-[min(340px,calc(100vw-32px))] rounded-2xl p-4 shadow-xl"
      >
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="ai-avatar-sm">
              <i class="pi pi-sparkles text-white text-xs" />
            </span>
            <span class="font-bold text-sm text-[var(--text-main)]">
              小錢包的分析
            </span>
          </div>
          <button
            class="w-6 h-6 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer text-[var(--text-muted)] hover:bg-[var(--sidebar-active-bg)]"
            aria-label="關閉"
            @click="closeChat"
          >
            <i class="pi pi-times text-xs" />
          </button>
        </div>

        <!-- 載入中 -->
        <div
          v-if="loading"
          class="text-sm min-h-[40px] flex items-center"
        >
          <span class="ai-dot" />
          <span class="ai-dot" />
          <span class="ai-dot" />
          <span class="ml-2 text-[var(--text-sub)]">分析中…</span>
        </div>

        <!-- 錯誤 -->
        <div
          v-else-if="errorText"
          class="text-sm text-[var(--negative)] leading-relaxed"
        >
          {{ errorText }}
        </div>

        <!-- 結構化結果 -->
        <div v-else-if="analysis" class="text-sm leading-relaxed">
          <p class="font-semibold text-[var(--text-main)] mb-3">
            {{ analysis.summary }}
          </p>

          <div v-if="analysis.highlights.length" class="space-y-2.5 mb-3">
            <div
              v-for="h in analysis.highlights"
              :key="h.accountId"
              class="flex items-start gap-2.5"
            >
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-[var(--text-main)] text-[13px]">
                  {{ h.accountName }}
                </div>
                <div v-if="h.note" class="text-xs text-[var(--text-sub)] mt-0.5">
                  {{ h.note }}
                </div>
              </div>
              <span
                class="mover-tag shrink-0"
                :class="h.direction === 'positive' ? 'is-positive' : 'is-negative'"
              >
                <i
                  :class="[
                    h.direction === 'positive' ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right',
                    'text-[10px] mr-1'
                  ]"
                />
                {{ formatDelta(h.delta, h.currency) }}
              </span>
            </div>
          </div>

          <div
            v-if="analysis.advice"
            class="text-xs leading-relaxed rounded-lg px-3 py-2 ai-advice"
          >
            <i class="pi pi-lightbulb text-xs mr-1 text-[var(--ai-accent)]" />
            {{ analysis.advice }}
          </div>
        </div>

        <!-- JSON 解析失敗時的純文字降級 -->
        <div
          v-else-if="rawFallback"
          class="text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-wrap"
        >
          {{ rawFallback }}
        </div>

        <div
          v-if="!loading && !errorText && (analysis || rawFallback)"
          class="mt-3 flex justify-end"
        >
          <button
            class="px-2.5 py-1 text-xs rounded-lg border border-[var(--line-soft)] bg-transparent cursor-pointer text-[var(--text-sub)] hover:bg-[var(--sidebar-active-bg)]"
            @click="runSpendingAnalysis"
          >
            <i class="pi pi-refresh text-xs mr-1" />重新分析
          </button>
        </div>
      </div>
    </transition>

    <!-- ── Hover 選單 ──────────────────────────────────────── -->
    <transition name="ai-pop">
      <div
        v-if="menuOpen && !chatOpen"
        class="ai-menu rounded-2xl p-1.5 shadow-xl min-w-[180px]"
      >
        <div class="px-3 py-1.5 text-xs text-[var(--text-sub)] font-medium">
          嗨！想看點什麼？
        </div>
        <button
          class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-left bg-transparent border-none cursor-pointer text-[var(--text-main)] hover:bg-[var(--sidebar-active-bg)] transition-colors font-[inherit]"
          @click="runSpendingAnalysis"
        >
          <i class="pi pi-chart-pie text-base text-[var(--ai-accent)]" />
          <span>最近消費分析</span>
        </button>
      </div>
    </transition>

    <!-- ── 主按鈕（機器人） ─────────────────────────────────── -->
    <button
      class="ai-fab"
      aria-label="AI 助手"
      :class="{ 'is-active': menuOpen || chatOpen }"
      @click="toggleMenuClick"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="3.2" r="1.1" fill="#ffffff" />
        <line x1="12" y1="4.3" x2="12" y2="6" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" />
        <rect x="4.5" y="6" width="15" height="12" rx="4" fill="#ffffff" />
        <circle cx="9" cy="12" r="1.4" fill="var(--ai-accent)" />
        <circle cx="15" cy="12" r="1.4" fill="var(--ai-accent)" />
        <path d="M9.5 15 Q12 16.5 14.5 15" stroke="var(--ai-accent)" stroke-width="1.3" stroke-linecap="round" fill="none" />
        <rect x="3" y="10" width="1.6" height="4" rx="0.8" fill="#ffffff" />
        <rect x="19.4" y="10" width="1.6" height="4" rx="0.8" fill="#ffffff" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.ai-assistant-root {
  --ai-accent: #0ea5e9;
  --ai-accent-soft: #7dd3fc;
  right: 20px;
  bottom: 20px;
}

@media (max-width: 1023px) {
  .ai-assistant-root {
    bottom: calc(78px + env(safe-area-inset-bottom));
  }
}

.ai-fab {
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7dd3fc 0%, #38bdf8 60%, #0ea5e9 100%);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.35), 0 2px 6px rgba(14, 165, 233, 0.2);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  animation: ai-float 3.2s ease-in-out infinite;
}
.ai-fab:hover,
.ai-fab.is-active {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 12px 28px rgba(14, 165, 233, 0.45), 0 3px 8px rgba(14, 165, 233, 0.25);
}
.ai-fab:active {
  transform: translateY(0) scale(0.97);
}

@keyframes ai-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.ai-menu,
.ai-chat-bubble {
  background: var(--surface);
  border: 1px solid var(--line-soft);
}

.ai-avatar-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #7dd3fc 0%, #0ea5e9 100%);
}

/* 金額色標：正向綠、負向紅（對淨值影響） */
.mover-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1;
}
.mover-tag.is-positive {
  background: rgba(16, 185, 129, 0.12);
  color: var(--positive);
}
.mover-tag.is-negative {
  background: rgba(244, 63, 94, 0.12);
  color: var(--negative);
}

.ai-advice {
  background: var(--primary-soft);
  color: var(--text-main);
}

/* 三點載入動畫 */
.ai-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 3px;
  border-radius: 9999px;
  background: var(--ai-accent);
  animation: ai-blink 1.2s infinite ease-in-out;
}
.ai-dot:nth-child(2) { animation-delay: 0.2s; }
.ai-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes ai-blink {
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.ai-pop-enter-active,
.ai-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.ai-pop-enter-from,
.ai-pop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
</style>
