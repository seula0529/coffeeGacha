<script setup>
import { ref, computed } from 'vue'
import { questions } from '../data/quiz.js'
import { pickBean } from '../data/beans.js'

const props = defineProps({
  prize: { type: Object, required: true },
})

const emit = defineEmits(['submit'])

const step = ref('quiz') // quiz | form
const questionIndex = ref(0)
const answers = ref([])

const currentQuestion = computed(() => questions[questionIndex.value])
const resultBean = ref(null)

function selectOption(tag) {
  answers.value.push(tag)
  if (questionIndex.value < questions.length - 1) {
    setTimeout(() => {
      questionIndex.value += 1
    }, 220)
  } else {
    setTimeout(() => {
      resultBean.value = pickBean(answers.value)
      step.value = 'form'
    }, 320)
  }
}

const form = ref({
  name: '',
  contact: '',
  receiptMethod: 'pickup',
  address: '',
})

const isValid = computed(() => {
  if (!form.value.name.trim() || !form.value.contact.trim()) return false
  if (form.value.receiptMethod === 'delivery' && !form.value.address.trim()) return false
  return true
})

function handleSubmit() {
  if (!isValid.value) return
  emit('submit', {
    bean: resultBean.value,
    form: { ...form.value },
  })
}
</script>

<template>
  <section class="diagnosis-view">
    <template v-if="step === 'quiz'">
      <p class="eyebrow">성향 진단</p>
      <h1 class="title">나에게 맞는 원두는?</h1>

      <div class="progress-dots">
        <span
          v-for="(q, i) in questions"
          :key="q.id"
          class="dot"
          :class="{ filled: i < questionIndex, active: i === questionIndex }"
        ></span>
      </div>

      <div class="question-card" :key="currentQuestion.id">
        <p class="question-text">{{ currentQuestion.text }}</p>
        <div class="options">
          <button
            v-for="opt in currentQuestion.options"
            :key="opt.tag"
            class="option"
            @click="selectOption(opt.tag)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bean-reveal">
        <div class="bean-card">
          <div class="bean-emoji">{{ resultBean.emoji }}</div>
          <p class="bean-tag">추천 원두</p>
          <h2 class="bean-name">{{ resultBean.name }}</h2>
          <p class="bean-desc">{{ resultBean.desc }}</p>
        </div>

        <div class="prize-recap">
          <span class="prize-emoji">{{ prize.emoji }}</span>
          <span>당첨 선물 · {{ prize.name }}</span>
        </div>
      </div>

      <form class="entry-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span class="field-label">이름</span>
          <input
            v-model="form.name"
            type="text"
            placeholder="이름을 입력해주세요"
            required
          />
        </label>

        <label class="field">
          <span class="field-label">연락처</span>
          <input
            v-model="form.contact"
            type="tel"
            placeholder="010-0000-0000"
            required
          />
        </label>

        <div class="field">
          <span class="field-label">수령 방법</span>
          <div class="radio-group">
            <label class="radio-option" :class="{ active: form.receiptMethod === 'pickup' }">
              <input type="radio" value="pickup" v-model="form.receiptMethod" />
              직접 수령
            </label>
            <label class="radio-option" :class="{ active: form.receiptMethod === 'delivery' }">
              <input type="radio" value="delivery" v-model="form.receiptMethod" />
              택배 배송
            </label>
          </div>
        </div>

        <label class="field" v-if="form.receiptMethod === 'delivery'">
          <span class="field-label">배송지</span>
          <input
            v-model="form.address"
            type="text"
            placeholder="배송받으실 주소를 입력해주세요"
            required
          />
        </label>

        <button class="submit-btn" type="submit" :disabled="!isValid">
          응모 완료하기
        </button>
      </form>
    </template>
  </section>
</template>

<style scoped>
.diagnosis-view {
  height: 100%;
  overflow-y: auto;
  padding: 2.2rem 1.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.eyebrow {
  font-family: var(--font-num);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  color: var(--sage-d);
}

.title {
  font-family: var(--font-head);
  font-size: 1.7rem;
  margin-top: 0.35rem;
}

.progress-dots {
  display: flex;
  gap: 0.5rem;
  margin: 1.4rem 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--line);
  transition: background 0.2s ease, transform 0.2s ease;
}

.dot.filled {
  background: var(--sage);
}

.dot.active {
  background: var(--sage-d);
  transform: scale(1.3);
}

.question-card {
  width: 100%;
  max-width: 340px;
  animation: fade-in 0.3s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.question-text {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 1.2rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.option {
  background: var(--milk);
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 0.9rem 1rem;
  font-size: 0.92rem;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.08s ease;
}

.option:active {
  transform: scale(0.98);
  border-color: var(--sage);
  background: #F3F6EE;
}

.bean-reveal {
  width: 100%;
  max-width: 340px;
  animation: expand-in 0.45s cubic-bezier(0.34, 1.2, 0.64, 1);
}

@keyframes expand-in {
  from { opacity: 0; transform: scale(0.9) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.bean-card {
  background: var(--milk);
  border: 1.5px solid var(--line);
  border-radius: 20px;
  padding: 1.6rem 1.4rem;
}

.bean-emoji {
  font-size: 2.6rem;
}

.bean-tag {
  font-family: var(--font-num);
  font-weight: 600;
  font-size: 0.75rem;
  color: var(--sage-d);
  letter-spacing: 0.05em;
  margin-top: 0.4rem;
}

.bean-name {
  font-family: var(--font-head);
  font-size: 1.4rem;
  margin-top: 0.2rem;
}

.bean-desc {
  font-size: 0.85rem;
  color: var(--mocha-d);
  margin-top: 0.5rem;
}

.prize-recap {
  margin-top: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--caramel-d);
  font-weight: 600;
}

.entry-form {
  width: 100%;
  max-width: 340px;
  margin-top: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
  animation: fade-in 0.4s ease 0.1s both;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--mocha-d);
}

.field input[type='text'],
.field input[type='tel'] {
  background: var(--milk);
  border: 1.5px solid var(--line);
  border-radius: 12px;
  padding: 0.8rem 0.9rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.field input:focus {
  border-color: var(--caramel);
}

.radio-group {
  display: flex;
  gap: 0.6rem;
}

.radio-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.7rem 0.5rem;
  border-radius: 12px;
  border: 1.5px solid var(--line);
  background: var(--milk);
  font-size: 0.85rem;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.radio-option.active {
  border-color: var(--sage);
  background: #F3F6EE;
  color: var(--sage-d);
  font-weight: 600;
}

.radio-option input {
  display: none;
}

.submit-btn {
  margin-top: 0.4rem;
  font-family: var(--font-head);
  font-size: 1.05rem;
  color: var(--milk);
  background: linear-gradient(180deg, var(--caramel) 0%, var(--caramel-d) 100%);
  padding: 0.95rem 1rem;
  border-radius: 999px;
  box-shadow: 0 6px 0 0 #a8701f, 0 10px 18px -6px rgba(196, 131, 47, 0.5);
  transition: transform 0.08s ease, box-shadow 0.08s ease, opacity 0.15s ease;
}

.submit-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 0 #a8701f, 0 6px 12px -6px rgba(196, 131, 47, 0.5);
}

.submit-btn:disabled {
  opacity: 0.5;
  box-shadow: none;
}

@media (prefers-reduced-motion: reduce) {
  .question-card,
  .bean-reveal,
  .entry-form {
    animation: none;
  }
}
</style>
