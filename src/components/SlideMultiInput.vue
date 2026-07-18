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

    <div v-if="question.consent" class="consent-box">
      <p class="consent-desc">{{ question.consent.text }}</p>
      <label class="consent-label">
        <input
          type="checkbox"
          class="consent-checkbox"
          :checked="!!modelValue.agree"
          @change="$emit('update:modelValue', { ...modelValue, agree: $event.target.checked })"
        >
        <span>{{ question.consent.label }}</span>
      </label>
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

.consent-box {
  width: 100%;
  max-width: 340px;
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.consent-desc {
  font-family: var(--font-body);
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--mocha-d);
  word-break: keep-all;
}

.consent-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--espresso);
  cursor: pointer;
}

.consent-checkbox {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  accent-color: var(--sage);
  cursor: pointer;
}

.btn-next { margin-top: 24px; }
</style>
