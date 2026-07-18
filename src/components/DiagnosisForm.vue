<script setup>
import { computed } from 'vue'
import { useFormState } from '../composables/useFormState.js'
import SlideQuestion from './SlideQuestion.vue'
import SlideImageQuestion from './SlideImageQuestion.vue'
import SlideMultiInput from './SlideMultiInput.vue'
import SlideLoading from './SlideLoading.vue'
import SlideResult from './SlideResult.vue'

const props = defineProps({
  prize: { type: Object, required: true },
})

const emit = defineEmits(['submit'])

const {
  currentStep,
  answers,
  progressPercent,
  QUESTIONS,
  LOADING_STEP,
  RESULT_STEP,
  slideClass,
  goNext,
  goBack,
  result,
  answerSummary,
} = useFormState()

// '시작하기' 커버를 거치지 않고 Q1부터 바로 시작
currentStep.value = 1

// 뒤로가기 버튼: Q1(첫 화면)에서는 더 갈 곳이 없으므로 숨김
const showBackButton = computed(() => currentStep.value > 1 && currentStep.value < RESULT_STEP)

const infoIndex = QUESTIONS.findIndex((q) => q.type === 'multi-input')

function isMultiInputValid(question, value) {
  return question.fields.every((f) => !f.required || !!value[f.key].trim())
}

function sendSms() {
  const info = answers.value[infoIndex]
  const rawPhone = info.contact.replace(/[^0-9]/g, '')

  const lines = [
    `[커피 가챠]`,
    `- 예약자명 : ${info.name}`,
    `- 일시 : `,
    `- 장소 : `,
    ``,
    `[당첨 선물]`,
    `${props.prize.emoji} ${props.prize.name}`,
    ``,
    `문자 확인 시 회신 부탁드립니다.`,
    `회신 시 예약이 확정됩니다.`,
  ]
  const text = lines.join('\n')
  const encoded = encodeURIComponent(text)
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

  if (isIos) {
    // iOS: sms://번호?body=내용 (슬래시 두 개가 수신자 번호 인식에 필수)
    window.location.href = `sms://${rawPhone}?body=${encoded}`
  } else {
    // Android: smsto:번호:내용
    window.location.href = `smsto:${rawPhone}:${text}`
  }

  emit('submit', {
    result: result.value,
    form: { ...info },
  })
}
</script>

<template>
  <section class="diagnosis-view">
    <button v-if="showBackButton" class="btn-back" @click="goBack">←</button>

    <div v-if="currentStep > 0 && currentStep < RESULT_STEP" class="step-counter">
      {{ currentStep }} / {{ QUESTIONS.length }}
    </div>

    <div class="progress-bar" :style="{ width: progressPercent + '%' }" />

    <div class="slides-wrapper">
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
        <SlideMultiInput
          v-else-if="q.type === 'multi-input'"
          :slide-class="slideClass(i + 1)"
          :question="q"
          v-model="answers[i]"
          :disabled="currentStep === i + 1 && !isMultiInputValid(q, answers[i])"
          @next="goNext"
        />
      </template>

      <SlideLoading :slide-class="slideClass(LOADING_STEP)" />

      <SlideResult
        :slide-class="slideClass(RESULT_STEP)"
        :result="result"
        :answer-summary="answerSummary"
        :prize="prize"
        @enter-form="sendSms"
      />
    </div>
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
