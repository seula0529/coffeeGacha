<template>
  <div class="slide result-slide" :class="slideClass">
    <span class="result-icon">☕</span>
    <p class="result-label">Your Coffee Type</p>
    <h2 class="result-title">{{ result.title }}</h2>
    <p class="result-desc">{{ result.desc }}</p>

    <div class="prize-recap">
      <span class="prize-emoji">{{ prize.emoji }}</span>
      <span>당첨 선물 · {{ prize.name }}</span>
    </div>

    <div class="result-answers">
      <h4>내 답변 요약</h4>
      <div
        v-for="(row, i) in answerSummary"
        :key="i"
        class="ans-row"
      >
        <span class="ans-q">{{ row.q }}</span>
        <span class="ans-a">{{ row.a }}</span>
      </div>
    </div>

    <button class="btn-primary btn-enter" @click="$emit('enter-form')">
      문자 보내고 응모하기 →
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass:    String,
  result:        Object,  // { title, desc }
  answerSummary: Array,   // [{ q, a }]
  prize:         Object,  // { emoji, name }
})
defineEmits(['enter-form'])
</script>

<style scoped>
.result-slide {
  text-align: center;
  /* 결과가 길면 스크롤 */
  justify-content: flex-start;
  overflow-y: auto;
  padding-top: max(env(safe-area-inset-top), 80px);
}

.result-icon {
  font-size: 44px;
  margin-bottom: 18px;
  display: block;
}

.result-label {
  font-family: var(--font-num);
  font-size: 11px;
  letter-spacing: 0.3em;
  color: var(--caramel-d);
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.85;
}

.result-title {
  font-family: var(--font-head);
  font-size: clamp(24px, 7vw, 36px);
  font-weight: 400;
  color: var(--espresso);
  line-height: 1.2;
  margin-bottom: 14px;
}

.result-desc {
  font-family: var(--font-body);
  color: var(--mocha-d);
  font-size: 14px;
  line-height: 1.75;
  max-width: 320px;
  margin: 0 auto 20px;
  word-break: keep-all;
}

.prize-recap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--caramel-d);
  font-weight: 600;
  margin-bottom: 24px;
}

/* ── 답변 요약 카드 ── */
.result-answers {
  background: var(--milk);
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 18px 20px;
  max-width: 400px;
  width: 100%;
  margin: 0 auto 24px;
  text-align: left;
}

.result-answers h4 {
  font-family: var(--font-num);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--caramel-d);
  text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0.85;
}

.ans-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-body);
  font-size: 13px;
}
.ans-row:last-child { border-bottom: none; }
.ans-q { color: var(--mocha-d); flex: 1; }
.ans-a { color: var(--espresso); font-weight: 700; text-align: right; max-width: 55%; word-break: keep-all; }

/* ── 응모하기 버튼 ── */
.btn-enter { margin-bottom: 32px; }
</style>
