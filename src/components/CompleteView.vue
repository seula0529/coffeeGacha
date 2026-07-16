<script setup>
defineProps({
  prize: { type: Object, required: true },
  bean: { type: Object, required: true },
  form: { type: Object, required: true },
})

const receiptLabel = {
  pickup: '직접 수령',
  delivery: '택배 배송',
}
</script>

<template>
  <section class="complete-view">
    <div class="badge">
      <span class="badge-emoji">✅</span>
    </div>

    <p class="eyebrow">응모 완료</p>
    <h1 class="title">{{ form.name }}님, 접수됐어요!</h1>
    <p class="subtitle">당첨 결과는 연락처로 안내드릴게요</p>

    <div class="summary-card">
      <div class="summary-row">
        <span class="row-label">당첨 선물</span>
        <span class="row-value">{{ prize.emoji }} {{ prize.name }}</span>
      </div>
      <div class="summary-row">
        <span class="row-label">추천 원두</span>
        <span class="row-value">{{ bean.emoji }} {{ bean.name }}</span>
      </div>
      <div class="summary-row">
        <span class="row-label">연락처</span>
        <span class="row-value">{{ form.contact }}</span>
      </div>
      <div class="summary-row">
        <span class="row-label">수령 방법</span>
        <span class="row-value">{{ receiptLabel[form.receiptMethod] }}</span>
      </div>
      <div class="summary-row" v-if="form.receiptMethod === 'delivery'">
        <span class="row-label">배송지</span>
        <span class="row-value">{{ form.address }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.complete-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  text-align: center;
}

.badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #F3F6EE;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.4); }
  70% { opacity: 1; transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
}

.badge-emoji {
  font-size: 2rem;
}

.eyebrow {
  margin-top: 1.2rem;
  font-family: var(--font-num);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  color: var(--sage-d);
}

.title {
  font-family: var(--font-head);
  font-size: 1.6rem;
  margin-top: 0.35rem;
}

.subtitle {
  font-size: 0.88rem;
  color: var(--mocha-d);
  margin-top: 0.5rem;
}

.summary-card {
  width: 100%;
  max-width: 340px;
  margin-top: 1.8rem;
  background: var(--milk);
  border: 1.5px solid var(--line);
  border-radius: 18px;
  padding: 1.2rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
}

.row-label {
  color: var(--mocha-d);
}

.row-value {
  font-weight: 600;
  color: var(--espresso);
}

@media (prefers-reduced-motion: reduce) {
  .badge {
    animation: none;
  }
}
</style>
