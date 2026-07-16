<script setup>
import { ref } from 'vue'

const emit = defineEmits(['drawn'])

const stage = ref('idle') // idle | cranking | shaking | dispensing
const drawing = ref(false)

function handleDraw() {
  if (drawing.value) return
  drawing.value = true
  stage.value = 'cranking'

  setTimeout(() => {
    stage.value = 'shaking'
  }, 500)

  setTimeout(() => {
    stage.value = 'dispensing'
  }, 900)

  setTimeout(() => {
    emit('drawn')
  }, 1700)
}
</script>

<template>
  <section class="gacha-view">
    <p class="eyebrow">오늘의 커피 선물</p>
    <h1 class="title">캡슐을 뽑아보세요</h1>
    <p class="subtitle">응모하면 누구나 커피 선물이 당첨돼요</p>

    <div class="machine-stage">
      <div class="machine" :class="{ shake: stage === 'shaking' }">
        <div class="machine-window">
          <div
            v-for="n in 8"
            :key="n"
            class="capsule-mini"
            :class="[`c-${(n % 2) + 1}`, `pos-${n}`]"
          ></div>
        </div>

        <div class="machine-face">
          <div class="machine-handle" :class="{ turn: stage === 'cranking' }">
            <span class="handle-knob"></span>
          </div>
          <div class="machine-label">COFFEE GACHA</div>
        </div>

        <div class="machine-slot">
          <div class="capsule-dispensed" :class="{ show: stage === 'dispensing' }"></div>
        </div>

        <div class="machine-legs">
          <span></span><span></span>
        </div>
      </div>
    </div>

    <button class="cta" :class="{ pulsing: !drawing }" :disabled="drawing" @click="handleDraw">
      {{ drawing ? '뽑는 중...' : '지금 뽑기' }}
    </button>
  </section>
</template>

<style scoped>
.gacha-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1.5rem 2rem;
  text-align: center;
}

.eyebrow {
  font-family: var(--font-num);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--caramel-d);
  text-transform: uppercase;
}

.title {
  font-family: var(--font-head);
  font-size: 1.9rem;
  color: var(--espresso);
  margin-top: 0.4rem;
}

.subtitle {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--mocha-d);
  margin-top: 0.5rem;
}

.machine-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.machine {
  position: relative;
  width: 220px;
  background: linear-gradient(180deg, var(--mocha) 0%, var(--mocha-d) 100%);
  border-radius: 28px 28px 18px 18px;
  padding: 18px 16px 26px;
  box-shadow: 0 18px 30px -12px rgba(63, 45, 34, 0.4);
}

.machine.shake {
  animation: machine-shake 0.4s ease-in-out;
}

@keyframes machine-shake {
  0%, 100% { transform: translateX(0) rotate(0); }
  20% { transform: translateX(-4px) rotate(-1deg); }
  40% { transform: translateX(4px) rotate(1deg); }
  60% { transform: translateX(-3px) rotate(-0.5deg); }
  80% { transform: translateX(3px) rotate(0.5deg); }
}

.machine-window {
  position: relative;
  width: 100%;
  height: 130px;
  background: radial-gradient(circle at 50% 30%, var(--milk) 0%, var(--cream-2) 100%);
  border-radius: 20px;
  border: 5px solid var(--mocha-d);
  overflow: hidden;
}

.capsule-mini {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  animation: jiggle 2.6s ease-in-out infinite;
}

.capsule-mini.c-1 {
  background: linear-gradient(180deg, var(--caramel) 50%, var(--caramel-d) 50%);
}

.capsule-mini.c-2 {
  background: linear-gradient(180deg, var(--sage) 50%, var(--sage-d) 50%);
}

.pos-1 { top: 12px; left: 18px; animation-delay: 0s; }
.pos-2 { top: 30px; left: 55px; animation-delay: 0.3s; }
.pos-3 { top: 10px; left: 95px; animation-delay: 0.6s; }
.pos-4 { top: 34px; left: 135px; animation-delay: 0.1s; }
.pos-5 { top: 14px; left: 168px; animation-delay: 0.5s; }
.pos-6 { top: 58px; left: 30px; animation-delay: 0.8s; }
.pos-7 { top: 62px; left: 78px; animation-delay: 0.2s; }
.pos-8 { top: 60px; left: 148px; animation-delay: 0.4s; }

@keyframes jiggle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(6deg); }
}

.machine-face {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding: 0 4px;
}

.machine-label {
  font-family: var(--font-num);
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--cream);
}

.machine-handle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid var(--caramel);
  display: flex;
  align-items: center;
  justify-content: center;
}

.machine-handle.turn {
  animation: crank-turn 0.5s linear;
}

@keyframes crank-turn {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.handle-knob {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--caramel);
}

.machine-slot {
  margin-top: 12px;
  height: 34px;
  background: var(--espresso);
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.capsule-dispensed {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(180deg, var(--caramel) 50%, var(--sage) 50%);
  transform: translateY(-40px);
  opacity: 0;
}

.capsule-dispensed.show {
  animation: drop-bounce 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes drop-bounce {
  0% { transform: translateY(-40px); opacity: 0; }
  60% { transform: translateY(0); opacity: 1; }
  80% { transform: translateY(-6px); }
  100% { transform: translateY(0); opacity: 1; }
}

.machine-legs {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: -6px;
}

.machine-legs span {
  width: 14px;
  height: 10px;
  background: var(--mocha-d);
  border-radius: 0 0 6px 6px;
}

.cta {
  font-family: var(--font-head);
  font-size: 1.1rem;
  color: var(--milk);
  background: linear-gradient(180deg, var(--caramel) 0%, var(--caramel-d) 100%);
  padding: 0.95rem 2.6rem;
  border-radius: 999px;
  box-shadow: 0 6px 0 0 #a8701f, 0 10px 18px -6px rgba(196, 131, 47, 0.5);
  transition: transform 0.08s ease, box-shadow 0.08s ease;
  width: 100%;
  max-width: 280px;
}

.cta:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 0 #a8701f, 0 6px 12px -6px rgba(196, 131, 47, 0.5);
}

.cta:disabled {
  opacity: 0.7;
}

.cta.pulsing {
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 6px 0 0 #a8701f, 0 10px 18px -6px rgba(196, 131, 47, 0.5); }
  50% { box-shadow: 0 6px 0 0 #a8701f, 0 10px 26px -4px rgba(196, 131, 47, 0.75); }
}

@media (prefers-reduced-motion: reduce) {
  .capsule-mini,
  .cta.pulsing {
    animation: none;
  }
}
</style>
