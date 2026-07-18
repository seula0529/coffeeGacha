<script setup>
import { ref, onMounted } from 'vue'
import ConfettiCanvas from './ConfettiCanvas.vue'

const props = defineProps({
  prize: { type: Object, required: true },
})

const emit = defineEmits(['next'])

const stage = ref('closed') // closed | cracking | revealed
const confettiRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    stage.value = 'cracking'
  }, 300)

  setTimeout(() => {
    stage.value = 'revealed'
    confettiRef.value?.burst()
  }, 900)
})
</script>

<template>
  <section class="reveal-view">
    <ConfettiCanvas ref="confettiRef" />

    <div class="reveal-stage">
      <div class="capsule-shell" :class="stage">
        <div class="half top"></div>
        <div class="half bottom"></div>
      </div>

      <div class="prize-pop" :class="{ show: stage === 'revealed' }">
        <div class="prize-emoji">{{ prize.emoji }}</div>
      </div>
    </div>

    <div class="reveal-copy" :class="{ show: stage === 'revealed' }">
      <p class="eyebrow">축하합니다!</p>
      <h1 class="title">{{ prize.name }}</h1>
      <p class="desc">{{ prize.desc }}</p>
      <p class="hint">당첨! 아래 버튼을 눌러 응모를 완료해주세요</p>
    </div>

    <button
      class="cta"
      :class="{ show: stage === 'revealed' }"
      @click="emit('next')"
    >
      응모하기
    </button>
  </section>
</template>

<style scoped>
.reveal-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  text-align: center;
  position: relative;
}

.reveal-stage {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capsule-shell {
  position: absolute;
  inset: 0;
}

.half {
  position: absolute;
  left: 10%;
  width: 80%;
  height: 50%;
  background:
    radial-gradient(circle at 32% 30%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 38%),
    radial-gradient(120% 160% at 50% 100%, var(--caramel-d) 0%, var(--caramel) 55%, #f2cf96 100%);
  box-shadow:
    inset -5px 6px 12px rgba(255, 255, 255, 0.45),
    inset 5px -8px 14px rgba(63, 45, 34, 0.3),
    0 10px 18px -6px rgba(63, 45, 34, 0.4);
  transition: transform 0.5s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.5s ease;
}

.half.top {
  top: 0;
  border-radius: 80px 80px 8px 8px;
}

.half.bottom {
  bottom: 0;
  background:
    radial-gradient(circle at 32% 40%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 40%),
    radial-gradient(120% 160% at 50% 0%, #d9cfb8 0%, #fdfaf3 55%, #ffffff 100%);
  box-shadow:
    inset 5px 8px 12px rgba(255, 255, 255, 0.7),
    inset -5px -8px 14px rgba(122, 86, 66, 0.35),
    0 12px 20px -6px rgba(63, 45, 34, 0.4);
  border-radius: 8px 8px 80px 80px;
}

.capsule-shell.cracking .half.top,
.capsule-shell.revealed .half.top {
  transform: translateY(-70px) rotate(-18deg);
}

.capsule-shell.cracking .half.bottom,
.capsule-shell.revealed .half.bottom {
  transform: translateY(70px) rotate(18deg);
}

.capsule-shell.revealed .half {
  opacity: 0;
}

.prize-pop {
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: scale(0.3);
}

.prize-pop.show {
  animation: pop-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes pop-in {
  0% { opacity: 0; transform: scale(0.3); }
  70% { opacity: 1; transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
}

.prize-emoji {
  font-size: 4.5rem;
  filter: drop-shadow(0 8px 14px rgba(63, 45, 34, 0.25));
}

.reveal-copy {
  margin-top: 1.8rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s;
}

.reveal-copy.show {
  opacity: 1;
  transform: translateY(0);
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
  font-size: 1.8rem;
  margin-top: 0.35rem;
}

.desc {
  font-size: 0.9rem;
  color: var(--mocha-d);
  margin-top: 0.5rem;
}

.hint {
  font-size: 0.8rem;
  color: var(--mocha);
  margin-top: 0.9rem;
}

.cta {
  margin-top: 1.6rem;
  font-family: var(--font-head);
  font-size: 1.1rem;
  color: var(--milk);
  background: linear-gradient(180deg, var(--caramel) 0%, var(--caramel-d) 100%);
  padding: 0.95rem 2.6rem;
  border-radius: 999px;
  box-shadow: 0 6px 0 0 #a8701f, 0 10px 18px -6px rgba(196, 131, 47, 0.5);
  width: 100%;
  max-width: 280px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s, box-shadow 0.08s ease;
  pointer-events: none;
}

.cta.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.cta:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 0 #a8701f, 0 6px 12px -6px rgba(196, 131, 47, 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .half,
  .prize-pop,
  .reveal-copy,
  .cta {
    transition: none !important;
    animation: none !important;
  }
  .capsule-shell.revealed .half {
    opacity: 0;
  }
  .prize-pop.show,
  .reveal-copy.show,
  .cta.show {
    opacity: 1;
    transform: none;
  }
}
</style>
