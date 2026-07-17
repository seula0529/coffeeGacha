<script setup>
import { ref, computed } from 'vue'
import { useFormState } from '../composables/useFormState.js'
import SlideCover from './SlideCover.vue'
import SlideQuestion from './SlideQuestion.vue'
import SlideImageQuestion from './SlideImageQuestion.vue'
import SlideTextInput from './SlideTextInput.vue'
import SlideLoading from './SlideLoading.vue'
import SlideResult from './SlideResult.vue'

const props = defineProps({
  prize: { type: Object, required: true },
})

const emit = defineEmits(['submit'])

const step = ref('diagnosis') // diagnosis | entry

const {
  currentStep,
  answers,
  progressPercent,
  QUESTIONS,
  LOADING_STEP,
  RESULT_STEP,
  slideClass,
  startForm,
  goNext,
  goBack,
  result,
  answerSummary,
} = useFormState()

function enterForm() {
  step.value = 'entry'
}

// ── 응모자 정보 입력 (SlideTextInput 슬라이드 이어붙이기) ──────────────────
const ENTRY_FIELDS = [
  { key: 'name',    label: 'Step 01', text: '이름을 알려주세요',         placeholder: '이름을 입력해주세요',   required: true },
  { key: 'age',     label: 'Step 02', text: '나이가 어떻게 되시나요?',    placeholder: '나이를 입력해주세요',   type: 'text', inputmode: 'numeric' },
  { key: 'mbti',    label: 'Step 03', text: 'MBTI가 궁금해요',          placeholder: '예: INFP' },
  { key: 'contact', label: 'Step 04', text: '문자 받으실 연락처를 입력해주세요', placeholder: '010-0000-0000', type: 'tel', inputmode: 'tel', required: true },
]

const entryStep    = ref(0)
const entryAnswers = ref({ name: '', age: '', mbti: '', contact: '' })

const entrySlideClass = (i) => {
  if (i === entryStep.value) return 'active'
  return i < entryStep.value ? 'above' : 'below'
}

const currentEntryField = computed(() => ENTRY_FIELDS[entryStep.value])
const isLastEntryField  = computed(() => entryStep.value === ENTRY_FIELDS.length - 1)
const currentEntryValid = computed(() => {
  const f = currentEntryField.value
  if (!f.required) return true
  return !!entryAnswers.value[f.key].trim()
})

function entryBack() {
  if (entryStep.value > 0) entryStep.value--
  else step.value = 'diagnosis'
}

function entryNext() {
  if (!currentEntryValid.value) return
  if (isLastEntryField.value) {
    sendSms()
  } else {
    entryStep.value++
  }
}

function sendSms() {
  const { name, age, mbti, contact } = entryAnswers.value
  const lines = [
    `[커피 가챠] ${name}님의 진단 결과`,
    result.value.title,
    result.value.desc,
    `나이: ${age || '-'} / MBTI: ${mbti || '-'}`,
    `당첨 선물: ${props.prize.name}`,
  ]
  const body = encodeURIComponent(lines.join('\n'))
  const to = contact.replace(/[^0-9+]/g, '')
  window.location.href = `sms:${to}?&body=${body}`

  emit('submit', {
    result: result.value,
    form: { ...entryAnswers.value },
  })
}
</script>

<template>
  <section class="diagnosis-view">
    <template v-if="step === 'diagnosis'">
      <button
        v-if="currentStep > 0 && currentStep < RESULT_STEP"
        class="btn-back"
        @click="goBack"
      >
        ←
      </button>

      <div
        v-if="currentStep > 0 && currentStep < RESULT_STEP"
        class="step-counter"
      >
        {{ currentStep }} / {{ QUESTIONS.length }}
      </div>

      <div class="progress-bar" :style="{ width: progressPercent + '%' }" />

      <div class="slides-wrapper">
        <SlideCover :slide-class="slideClass(0)" @start="startForm" />

        <template v-for="(q, i) in QUESTIONS" :key="i">
          <SlideQuestion
            v-if="q.type === 'choice'"
            :slide-class="slideClass(i + 1)"
            :question="q"
            v-model="answers[i]"
            @next="goNext"
          />
          <SlideImageQuestion
            v-else-if="q.type === 'image'"
            :slide-class="slideClass(i + 1)"
            :question="q"
            v-model="answers[i]"
            @next="goNext"
          />
          <SlideTextInput
            v-else-if="q.type === 'input'"
            :slide-class="slideClass(i + 1)"
            :question="q"
            v-model="answers[i]"
            @next="goNext"
          />
        </template>

        <SlideLoading :slide-class="slideClass(LOADING_STEP)" />

        <SlideResult
          :slide-class="slideClass(RESULT_STEP)"
          :result="result"
          :answer-summary="answerSummary"
          :prize="prize"
          @enter-form="enterForm"
        />
      </div>
    </template>

    <template v-else>
      <button class="btn-back" @click="entryBack">←</button>

      <div class="step-counter">{{ entryStep + 1 }} / {{ ENTRY_FIELDS.length }}</div>

      <div
        class="progress-bar"
        :style="{ width: ((entryStep + 1) / ENTRY_FIELDS.length) * 100 + '%' }"
      />

      <div class="slides-wrapper">
        <SlideTextInput
          v-for="(f, i) in ENTRY_FIELDS"
          :key="f.key"
          :slide-class="entrySlideClass(i)"
          :question="f"
          v-model="entryAnswers[f.key]"
          :disabled="i === entryStep && !currentEntryValid"
          :next-label="i === ENTRY_FIELDS.length - 1 ? '문자 보내기 →' : '다음 →'"
          @next="entryNext"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.diagnosis-view {
  position: relative;
  height: 100%;
  overflow: hidden;
}

/* ── 상단 고정 UI (설문 진행 중에만 표시) ── */
.btn-back {
  position: absolute;
  top: max(env(safe-area-inset-top), 14px);
  left: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--milk);
  border: 1.5px solid var(--line);
  color: var(--mocha-d);
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: background 0.2s;
}
.btn-back:active {
  background: var(--cream-2);
}

.step-counter {
  position: absolute;
  top: max(env(safe-area-inset-top), 14px);
  right: 16px;
  height: 44px;
  display: flex;
  align-items: center;
  font-family: var(--font-num);
  font-size: 13px;
  color: var(--mocha-d);
  letter-spacing: 0.04em;
  z-index: 50;
}

/* ── 진행 바 ── */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2.5px;
  background: linear-gradient(to right, var(--caramel), var(--caramel-d));
  transition: width 0.55s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 100;
}

/* ── 슬라이드 컨테이너 ── */
.slides-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

</style>
