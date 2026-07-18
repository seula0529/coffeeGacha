<template>
  <div class="slide" :class="slideClass">
    <p class="q-number">{{ question.label }}</p>
    <p class="q-text">{{ question.text }}</p>

    <div class="input-list">
      <input
        v-for="f in question.fields"
        :key="f.key"
        class="form-input"
        :type="f.type || 'text'"
        :inputmode="f.inputmode"
        :value="modelValue[f.key]"
        :placeholder="f.placeholder"
        @input="$emit('update:modelValue', { ...modelValue, [f.key]: $event.target.value })"
      >
    </div>

    <button
      class="btn-primary btn-next"
      :disabled="disabled"
      @click="$emit('next')"
    >
      다음 →
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,
  question:   Object,   // { label, text, fields: [{ key, placeholder, type, inputmode, required }] }
  modelValue: Object,   // { [field.key]: string }
  disabled:   { type: Boolean, default: false },
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

.input-list {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  background: var(--milk);
  border: 1.5px solid var(--line);
  border-radius: 12px;
  padding: 0.85rem 0.95rem;
  color: var(--espresso);
  font-family: var(--font-body);
  /* iOS zoom 방지: 16px 미만이면 자동 zoom 됨 */
  font-size: 16px;
  font-weight: 400;
  outline: none;
  transition: border-color 0.15s ease;
  -webkit-appearance: none;
}
.form-input::placeholder {
  font-family: var(--font-body);
  color: var(--mocha-d);
  opacity: 0.45;
}
.form-input:focus { border-color: var(--caramel); }

.btn-next { margin-top: 24px; }
</style>
