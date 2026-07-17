<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="input-wrap">
      <input
        class="form-input"
        :type="question.type || 'text'"
        :inputmode="question.inputmode"
        :value="modelValue"
        :placeholder="question.placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter="!disabled && $emit('next')"
      >
    </div>

    <button
      class="btn-primary btn-next"
      :disabled="disabled"
      @click="$emit('next')"
    >
      {{ nextLabel }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  question:   Object,   // { label, text, placeholder, type, inputmode }
  modelValue: String,
  disabled:   { type: Boolean, default: false },
  nextLabel:  { type: String, default: '다음 →' },
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

.input-wrap {
  width: 100%;
  max-width: 440px;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 16px 4px;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid var(--line);
  color: var(--espresso);
  font-family: var(--font-body);
  /* iOS zoom 방지: 16px 미만이면 자동 zoom 됨 */
  font-size: max(16px, 18px);
  font-weight: 400;
  outline: none;
  caret-color: var(--caramel-d);
  border-radius: 0;
  transition: border-color 0.2s;
  -webkit-appearance: none;
}
.form-input::placeholder {
  font-family: var(--font-body);
  color: var(--mocha-d);
  opacity: 0.4;
}
.form-input:focus { border-bottom-color: var(--caramel-d); }

.btn-next { margin-top: 24px; }
</style>
