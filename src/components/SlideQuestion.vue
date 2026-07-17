<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="choices">
      <button
        v-for="(opt, i) in question.options"
        :key="opt.value"
        class="choice-btn"
        :class="{ selected: modelValue === opt.value }"
        @click="$emit('update:modelValue', opt.value)"
      >
        <span class="choice-key">{{ String.fromCharCode(65 + i) }}</span>
        {{ opt.label }}
      </button>
    </div>

    <button
      class="btn-primary btn-next"
      :disabled="!modelValue"
      @click="$emit('next')"
    >
      다음 →
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  question:   Object,   // { label, text, options: [{ label, value }] }
  modelValue: String,   // 현재 선택된 값 (v-model 지원)
})
defineEmits(['update:modelValue', 'next'])
</script>

<style scoped>
.q-number {
  font-family: var(--font-num);
  font-size: 12px;
  letter-spacing: 0.22em;
  color: var(--caramel-d);
  opacity: 0.85;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.q-text {
  font-family: var(--font-body);
  font-size: clamp(17px, 4.8vw, 24px);
  font-weight: 700;
  color: var(--espresso);
  text-align: center;
  line-height: 1.6;
  max-width: 340px;
  margin-bottom: 28px;
  letter-spacing: -0.01em;
  word-break: keep-all;
}

/* ── 선택지 목록 ── */
.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 440px;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  min-height: 52px;
  width: 100%;
  background: var(--milk);
  border: 1.5px solid var(--line);
  border-radius: 14px;
  color: var(--espresso);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  line-height: 1.5;
  word-break: keep-all;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.08s ease;
  -webkit-appearance: none;
}

.choice-btn:active { transform: scale(0.98); }
.choice-btn.selected {
  background: #F3F6EE;
  border-color: var(--sage);
}

.choice-key {
  flex-shrink: 0;
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--line);
  border-radius: 8px;
  font-family: var(--font-num);
  font-size: 12px;
  font-weight: 600;
  color: var(--mocha-d);
  transition: all 0.15s;
}
.choice-btn.selected .choice-key {
  background: var(--sage);
  border-color: var(--sage);
  color: white;
}

.btn-next { margin-top: 24px; }
</style>
