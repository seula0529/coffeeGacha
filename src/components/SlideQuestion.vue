<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <p v-if="isMulti" class="multi-hint">중복 선택 가능해요</p>

    <div class="choices">
      <button
        v-for="(opt, i) in question.options"
        :key="opt.value"
        class="choice-btn"
        :class="{ selected: isSelected(opt.value) }"
        @click="handleClick(opt.value)"
      >
        <span class="choice-key">
          <template v-if="isMulti">{{ isSelected(opt.value) ? '✓' : String.fromCharCode(65 + i) }}</template>
          <template v-else>{{ String.fromCharCode(65 + i) }}</template>
        </span>
        {{ opt.label }}
      </button>
    </div>

    <button
      class="btn-primary btn-next"
      :disabled="!isMulti && !modelValue"
      @click="$emit('next')"
    >
      {{ isMulti && !hasAnswer ? '건너뛰기' : '다음 →' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  slideClass: String,
  question:   Object,          // { label, text, options: [{ label, value }], type: 'choice' | 'multi-choice' }
  modelValue: [String, Array], // 단일선택: String, 복수선택: Array
})
const emit = defineEmits(['update:modelValue', 'next'])

const isMulti = computed(() => props.question.type === 'multi-choice')

function isSelected(value) {
  if (isMulti.value) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value)
  }
  return props.modelValue === value
}

function handleClick(value) {
  if (isMulti.value) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(value)
    if (idx === -1) current.push(value)
    else current.splice(idx, 1)
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', value)
  }
}

const hasAnswer = computed(() => {
  if (isMulti.value) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return !!props.modelValue
})
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

.multi-hint {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--caramel-d);
  opacity: 0.85;
  margin-bottom: 16px;
  letter-spacing: 0.04em;
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
