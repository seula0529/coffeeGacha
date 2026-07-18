// composables/useFormState.js
// 폼 전체 상태·로직을 담당하는 composable
// DiagnosisForm.vue에서 한 번 호출하고 각 슬라이드 컴포넌트에 props/emit으로 전달

import { ref, computed } from 'vue'

// ── 질문 데이터 ──────────────────────────────────────────────────────────────
// 질문을 추가하려면 이 배열에만 항목을 추가하면 됩니다.
export const QUESTIONS = [
  {
    type: 'choice',                                  // 텍스트 선택형
    label: 'Question 01',
    text: "커피, 왜 마시게 됐나요?",
    options: [
      { label: "☀️  눈 뜨려고 (각성 효과)", value: "각성" },
      { label: "💬  누군가와 함께하는 시간에", value: "소통" },
      { label: "☕  그냥 맛이 좋아서", value: "맛" },
      { label: "😌  혼자만의 여유가 필요해서", value: "여유" },
      { label: "🚫  커피는 잘 안 마셔요", value: "비음용" },
    ],
  },
  {
    type: 'choice',
    label: 'Question 02',
   text: "어떤 향의 커피가 끌리나요?",
    options: [
      { label: "🍋  상큼하고 과일향 나는 커피", value: "과일향" },
      {
        label: "🌸  은은한 꽃향기가 마치 차를 마시는 것같은 커피",
        value: "플로럴",
      },
      {
        label: "🌰  구수하고 묵직한 견과류·다크 초콜릿향 커피",
        value: "견과류향",
      },
      { label: "🤷  잘 모르겠고 그냥 탄 맛만 아니면 되요", value: "모름" },
    ],
  },
  {
    type: 'image',
    label: 'Question 03',
    text: "나의 카페 최애 음료는?",
    options: [
      {
        label: "커피",
        value: "커피",
        img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=300&h=300&auto=format&fit=crop",
      },
      {
        label: "논카페인 라떼",
        value: "논카페인 라떼",
        img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        label: "프라페, 스무디",
        value: "프라페, 스무디",
        img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=300&h=300",
      },
      {
        label: "아이스티, 에이드",
        value: "아이스티, 에이드",
        img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=300&h=300",
      },
    ],
  },
  {
    type: 'multi-choice',                                   // 이미지 선택형
    label: 'Question 04',
    text: '어떤 컨셉의 카페를 찾아가나요?',
    options: [
      { label: '🎨  체험·공방형 (드로잉, 베이킹 등)', value: '체험형' },
      { label: '🍽️  카페 오마카세·취향 큐레이션',     value: '오마카세' },
      { label: '🐾  테마형 (애견, 식물, 보드게임 등)', value: '테마형' },
      { label: '📚  조용한 작업·독서 카페',            value: '작업형' },
      { label: '✨  분위기·인테리어 감성 카페',         value: '감성형' },
    ],
  },
  {
    type: 'multi-choice',
    label: 'Question 05',
    text: '카페는 주로 누구와 함께 가나요?',
    options: [
      { label: '🧍  혼자',          value: '혼자' },
      { label: '👫  연인과',        value: '연인' },
      { label: '👯  친구와',        value: '친구' },
      { label: '💼  동료·비즈니스', value: '동료' },
      { label: '👨‍👩‍👧  가족과',   value: '가족' },
    ],
  },
  {
    type: 'multi-input',                              // 여러 입력칸이 한 화면에 있는 입력형
    label: 'Question 06',
    text: '마지막으로, 응모를 위해 알려주세요',
    fields: [
      { key: 'name',    placeholder: '이름',                    required: true },
      { key: 'contact', placeholder: '연락처 (010-0000-0000)',  type: 'tel', inputmode: 'tel', required: true },
      { key: 'mbti',    placeholder: 'MBTI (선택)' },
      { key: 'age',     placeholder: '나이 (선택)',              inputmode: 'numeric' },
    ],
    consent: {
      text: '입력하신 이름, 연락처, 나이, MBTI는 응모 및 당첨자 안내 목적으로만 사용되며, 경품 발송 완료 후 즉시 파기됩니다. 본 개인정보 수집·이용에 동의하지 않으실 수 있으나, 미동의 시 응모 참여가 제한될 수 있습니다.',
      label: '개인정보 수집 및 이용에 동의합니다.',
    },
  },
]

// ── 결과 계산 ────────────────────────────────────────────────────────────────
function calcResult(answers) {
  const drink = answers[2] // Q3: 나의 카페 최애 음료는?

  const titleMap = {
    '커피':          '블랙 커피 마스터 ☕',
    '논카페인 라떼': '밀키 러버 🥛',
    '프라페, 스무디': '달콤한 하루 🍓',
    '아이스티, 에이드': '여유로운 티 러버 🍵',
  }
  const descMap = {
    '커피':          '커피 본연의 맛을 사랑하는 당신. 블랙으로 마셔야 진짜 커피죠.',
    '논카페인 라떼': '부드럽고 고소한 밀크 커피가 잘 어울리는 당신. 카페인 부담 없이 편안하게 즐겨요.',
    '프라페, 스무디': '달달하고 시원한 음료가 취향인 당신. 카페는 즐거운 공간이에요!',
    '아이스티, 에이드': '차 한 잔의 여유를 아는 당신. 시원하고 산뜻한 음료로 하루를 채워요.',
  }

  return {
    title: titleMap[drink] ?? '커피 탐험가 🗺️',
    desc:  descMap[drink]  ?? '다양한 커피를 즐기는 탐험가형이에요!',
  }
}

// ── Composable ───────────────────────────────────────────────────────────────
export function useFormState() {
  // 슬라이드 인덱스 구조:
  //  0          → Cover
  //  1 ~ Q수    → 질문 슬라이드 (QUESTIONS 배열 길이만큼 자동 생성)
  //  Q수 + 1    → Loading
  //  Q수 + 2    → Result
  const LOADING_STEP = QUESTIONS.length + 1
  const RESULT_STEP  = QUESTIONS.length + 2
  const TOTAL_STEPS  = QUESTIONS.length + 3   // cover + questions + loading + result

  const initialAnswers = () =>
    QUESTIONS.map((q) => {
      if (q.type === 'multi-input') {
        const value = Object.fromEntries(q.fields.map((f) => [f.key, '']))
        if (q.consent) value.agree = false
        return value
      }
      if (q.type === 'multi-choice') return []
      return ''
    })

  const currentStep = ref(0)
  const answers     = ref(initialAnswers())

  // 진행률 (cover=0%, result=100%)
  const progressPercent = computed(() => {
    if (currentStep.value === 0) return 0
    if (currentStep.value >= RESULT_STEP) return 100
    return Math.round((currentStep.value / (TOTAL_STEPS - 2)) * 100)
  })

  // 슬라이드 위치 클래스
  const slideClass = (index) => {
    if (index === currentStep.value) return 'active'
    return index < currentStep.value ? 'above' : 'below'
  }

  // 현재 질문 인덱스 (슬라이드 1 → 질문 0)
  const currentQuestionIndex = computed(() => currentStep.value - 1)

  function startForm() { currentStep.value = 1 }

  function selectAnswer(qIndex, value) {
    answers.value[qIndex] = value
  }

  function goNext() {
    if (currentStep.value >= TOTAL_STEPS - 1) return
    currentStep.value++
    if (currentStep.value === LOADING_STEP) {
      setTimeout(() => { currentStep.value = RESULT_STEP }, 1800)
    }
  }

  function goBack() {
    if (currentStep.value > 0) currentStep.value--
  }

  function restart() {
    answers.value  = initialAnswers()
    currentStep.value = 0
  }

  // 결과
  const result = computed(() => calcResult(answers.value))

  // 응모자 개인정보(이름/연락처 등)를 받는 multi-input 문항은 요약에서 제외
  const answerSummary = computed(() =>
    QUESTIONS
      .map((q, i) => ({ q, a: answers.value[i] }))
      .filter(({ q }) => q.type !== 'multi-input')
      .map(({ q, a }) => ({
        q: q.text.length > 16 ? q.text.slice(0, 16) + '…' : q.text,
        a: Array.isArray(a) ? (a.join(', ') || '—') : (a || '—'),
      }))
  )

  return {
    // 상태
    currentStep,answers,progressPercent,
    // 상수
    QUESTIONS,LOADING_STEP,RESULT_STEP,TOTAL_STEPS,
    // 메서드
    slideClass,currentQuestionIndex,startForm,selectAnswer,goNext,goBack,restart,
    // 결과
    result,answerSummary,
  }
}
