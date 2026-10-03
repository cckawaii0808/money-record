<script setup lang="ts">
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import { useAssetManagerStore } from "../../stores";
import { isMockMode } from "../../firebase";

const store = useAssetManagerStore();
const { leaderboard, leaderboardLoading, leaderboardError, leaderboardOffset, myRank } = storeToRefs(store);
const amountFormatter = new Intl.NumberFormat("zh-TW", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
</script>

<template>
  <section class="workspace-panel leaderboard-panel" aria-labelledby="leaderboard-title" :aria-busy="leaderboardLoading">
    <div class="leaderboard-heading">
      <div>
        <h2 id="leaderboard-title" class="section-heading">淨資產排行榜</h2>
        <p class="leaderboard-note">當月 {{ leaderboard?.balanceMonth ?? '—' }}・固定當月，不受上方月份切換影響</p>
      </div>
      <Button label="刷新" icon="pi pi-refresh" size="small" severity="secondary" :disabled="leaderboardLoading" @click="store.fetchLeaderboard()" />
    </div>
    <p v-if="isMockMode" class="demo-note">僅本地示範資料：只有一筆虛構的自己，不連線同步暱稱或取得排行榜。</p>
    <div class="leaderboard-summary">
      <span>總人數 <strong>{{ leaderboard?.totalUsers ?? '—' }}</strong></span>
      <span>我的名次 <strong>{{ myRank === null ? '尚無名次' : `第 ${myRank} 名` }}</strong></span>
    </div>
    <p class="leaderboard-note">以 TWD 計算：資產帳戶總額減負債，無當月紀錄時沿用先前紀錄。股票須先同步至資產帳戶，不另外加計持倉市值。</p>
    <p v-if="leaderboardLoading" class="leaderboard-state" role="status">排行榜載入中…</p>
    <p v-if="leaderboardError" class="leaderboard-error" role="alert">{{ leaderboardError }} 請按刷新重試。</p>
    <template v-if="leaderboard && !leaderboardLoading && !leaderboardError">
      <p v-if="!leaderboard.entries.length" class="leaderboard-state">目前此頁沒有排行榜資料。</p>
      <div v-else class="leaderboard-table-wrap">
        <table class="leaderboard-table">
          <thead><tr><th scope="col">名次</th><th scope="col">暱稱</th><th scope="col" class="amount">淨資產（TWD）</th><th scope="col">更新時間</th></tr></thead>
          <tbody>
            <tr v-for="entry in leaderboard.entries" :key="entry.publicId" :class="{ 'current-user': entry.isCurrentUser }">
              <td data-label="名次">{{ entry.rank }}</td>
              <td data-label="暱稱" class="nickname">{{ entry.displayName }} <span v-if="entry.isCurrentUser" class="self-badge">自己</span></td>
              <td data-label="淨資產（TWD）" class="amount">{{ amountFormatter.format(entry.netWorthTwd) }}</td>
              <td data-label="更新時間" class="updated-at">{{ entry.updatedAt ?? '尚無更新紀錄' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="leaderboard-note fx-details">
        <span v-if="!isMockMode && leaderboard.fx.isStale" class="stale-note">匯率已過期或尚無可用匯率</span>
        <span v-if="leaderboard.fx.USD > 0">1 USD = {{ leaderboard.fx.USD }} TWD</span>
        <span v-else>USD {{ isMockMode ? '本地示範未提供匯率' : '暫無可用匯率（本次無非零外幣餘額）' }}</span>
        <span v-if="leaderboard.fx.JPY > 0">1 JPY = {{ leaderboard.fx.JPY }} TWD</span>
        <span v-else>JPY {{ isMockMode ? '本地示範未提供匯率' : '暫無可用匯率（本次無非零外幣餘額）' }}</span>
        <span>匯率更新：{{ leaderboard.fx.updatedAt ?? '尚無更新時間' }}</span>
        <span>排行榜產生：{{ leaderboard.generatedAt }}</span>
      </div>
    </template>
    <p v-if="!leaderboard && !leaderboardLoading && !leaderboardError" class="leaderboard-state">登入後載入排行榜。</p>
    <div class="leaderboard-pagination">
      <Button label="上一頁" icon="pi pi-angle-left" size="small" severity="secondary" :disabled="leaderboardLoading || leaderboardOffset === 0" @click="store.fetchLeaderboard(Math.max(0, leaderboardOffset - store.leaderboardLimit))" />
      <span>第 {{ Math.floor(leaderboardOffset / store.leaderboardLimit) + 1 }} 頁</span>
      <Button label="下一頁" icon="pi pi-angle-right" icon-pos="right" size="small" severity="secondary" :disabled="leaderboardLoading || !leaderboard || leaderboardOffset + store.leaderboardLimit >= leaderboard.totalUsers" @click="store.fetchLeaderboard(leaderboardOffset + store.leaderboardLimit)" />
    </div>
  </section>
</template>

<style scoped>
.leaderboard-panel { margin-top: 18px; padding: 18px; color: var(--text-main); min-width: 0; }
.leaderboard-heading, .leaderboard-summary, .leaderboard-pagination { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.leaderboard-summary { justify-content: flex-start; gap: 24px; margin: 14px 0; font-size: 14px; }
.leaderboard-summary strong { margin-left: 6px; font-variant-numeric: tabular-nums; }
.leaderboard-note { margin: 8px 0; font-size: 12px; line-height: 1.7; color: var(--text-sub); }
.demo-note, .stale-note { color: var(--primary); font-size: 13px; font-weight: 600; }
.leaderboard-state { padding: 18px 0; color: var(--text-sub); }
.leaderboard-error { color: var(--negative); overflow-wrap: anywhere; }
.leaderboard-table-wrap { overflow-x: auto; }
.leaderboard-table { width: 100%; border-collapse: collapse; font-size: 14px; }
th, td { padding: 12px 10px; border-bottom: 1px solid var(--line-soft); text-align: left; }
th { color: var(--text-sub); font-size: 12px; font-weight: 500; }
.amount { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.nickname { overflow-wrap: anywhere; }
.updated-at { color: var(--text-sub); font-size: 12px; overflow-wrap: anywhere; }
.current-user { background: var(--app-bg); }
.current-user td:first-child { border-left: 3px solid var(--primary); }
.self-badge { display: inline-block; color: var(--primary); font-size: 11px; margin-left: 6px; white-space: nowrap; }
.fx-details { display: flex; flex-wrap: wrap; gap: 4px 16px; overflow-wrap: anywhere; }
.leaderboard-pagination { justify-content: flex-end; margin-top: 16px; font-size: 12px; color: var(--text-sub); }
@media (max-width: 600px) {
  .leaderboard-panel { padding: 14px; }
  .leaderboard-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .leaderboard-table, tbody, tr, td { display: block; }
  tr { padding: 8px 0; border-bottom: 1px solid var(--line-soft); }
  td { display: flex; justify-content: space-between; gap: 12px; padding: 6px 10px; border: 0; text-align: right; }
  td::before { content: attr(data-label); color: var(--text-sub); font-size: 12px; flex-shrink: 0; }
  .nickname { flex-wrap: wrap; }
  .amount { white-space: normal; overflow-wrap: anywhere; }
  .current-user { border-left: 3px solid var(--primary); }
  .current-user td:first-child { border-left: 0; }
  .leaderboard-pagination { justify-content: space-between; gap: 6px; }
}
</style>
