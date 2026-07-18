<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const emit = defineEmits(['drawn'])

const stage = ref('idle') // idle | cranking | dispensing | done
const drawing = ref(false)
const coinDropped = ref(false)
const flapOpen = ref(false)
const capsuleOut = ref(false)

const knobEl = ref(null)
const knobAngle = ref(0)
const dragging = ref(false)
const turnProgress = ref(0)
let lastPointerAngle = 0
let rafId = 0

const capsules = [
  { c: 1, size: 46, x: 14, y: 10, d: 0 },
  { c: 2, size: 42, x: 62, y: 6, d: 0.3 },
  { c: 3, size: 44, x: 106, y: 12, d: 0.55 },
  { c: 2, size: 38, x: 148, y: 8, d: 0.15 },
  { c: 1, size: 40, x: 38, y: 44, d: 0.2 },
  { c: 3, size: 44, x: 84, y: 40, d: 0.7 },
  { c: 2, size: 36, x: 128, y: 48, d: 0.45 },
  { c: 1, size: 32, x: 10, y: 52, d: 0.8 },
  { c: 3, size: 30, x: 64, y: 82, d: 0.6 },
  { c: 2, size: 28, x: 108, y: 86, d: 0.35 },
]

const isCranking = computed(() => stage.value === 'cranking' || dragging.value)

const hint = computed(() => {
  if (stage.value === 'done') return '캡슐을 눌러 열어보세요!'
  if (stage.value === 'dispensing') return '덜컹! 캡슐이 나오고 있어요'
  if (isCranking.value) return '드르륵... 돌리는 중!'
  return '코인은 서비스! 손잡이를 돌리거나 버튼을 누르세요'
})

const ctaLabel = computed(() => {
  if (stage.value === 'done') return '캡슐 열기'
  if (drawing.value) return '뽑는 중...'
  return '지금 뽑기'
})

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

function autoTurn(total = 720, duration = 1100) {
  return new Promise((res) => {
    const start = performance.now()
    const from = knobAngle.value
    const frame = (t) => {
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      knobAngle.value = from + total * eased
      if (p < 1) rafId = requestAnimationFrame(frame)
      else res()
    }
    rafId = requestAnimationFrame(frame)
  })
}

async function dispense() {
  stage.value = 'dispensing'
  flapOpen.value = true
  await wait(180)
  capsuleOut.value = true
  await wait(850)
  flapOpen.value = false
  stage.value = 'done'
}

async function handleDraw() {
  if (stage.value === 'done') {
    emit('drawn')
    return
  }
  if (drawing.value) return
  drawing.value = true
  coinDropped.value = true
  await wait(550)
  stage.value = 'cranking'
  await autoTurn()
  dispense()
}

function pointerAngle(e) {
  const r = knobEl.value.getBoundingClientRect()
  return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
}

function onKnobDown(e) {
  if (drawing.value || stage.value !== 'idle') return
  dragging.value = true
  coinDropped.value = true
  lastPointerAngle = pointerAngle(e)
  e.currentTarget.setPointerCapture(e.pointerId)
}

async function onKnobMove(e) {
  if (!dragging.value) return
  const a = pointerAngle(e)
  let d = a - lastPointerAngle
  if (d > 180) d -= 360
  if (d < -180) d += 360
  lastPointerAngle = a
  if (d > 0) {
    knobAngle.value += d
    turnProgress.value += d
  }
  if (turnProgress.value >= 320 && !drawing.value) {
    dragging.value = false
    drawing.value = true
    stage.value = 'cranking'
    await autoTurn(180, 350)
    dispense()
  }
}

function onKnobUp() {
  dragging.value = false
}

function openCapsule() {
  if (stage.value === 'done') emit('drawn')
}

onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <section class="gacha-view">
    <p class="eyebrow">오늘의 커피 선물</p>
    <h1 class="title">캡슐을 뽑아보세요</h1>
    <p class="subtitle">응모하면 누구나 커피 선물이 당첨돼요</p>

    <div class="machine-stage">
      <div class="machine" :class="{ vibrate: isCranking, bump: stage === 'dispensing' }">
        <!-- 유리 돔 -->
        <div class="dome">
          <div class="dome-pit"></div>
          <div
            v-for="(cap, i) in capsules"
            :key="i"
            class="cap3d"
            :class="[`c-${cap.c}`, { tumble: isCranking }]"
            :style="{
              width: cap.size + 'px',
              height: cap.size + 'px',
              left: cap.x + 'px',
              bottom: cap.y + 'px',
              animationDelay: cap.d + 's',
            }"
          ></div>
          <div class="dome-glass"></div>
        </div>

        <div class="collar"></div>

        <!-- 본체 -->
        <div class="body">
          <div class="plate">COFFEE GACHA</div>

          <div class="knob-area">
            <div class="coin" :class="{ drop: coinDropped }"></div>
            <div
              ref="knobEl"
              class="knob"
              :class="{ grabbable: stage === 'idle' && !drawing }"
              :style="{ transform: `rotate(${knobAngle}deg)` }"
              @pointerdown="onKnobDown"
              @pointermove="onKnobMove"
              @pointerup="onKnobUp"
              @pointercancel="onKnobUp"
            >
              <span class="knob-slot"></span>
              <span class="knob-bar"></span>
            </div>
            <p class="knob-tag">TURN</p>
          </div>
        </div>

        <!-- 배출구 -->
        <div class="outlet">
          <div class="outlet-hole">
            <div class="flap" :class="{ open: flapOpen }"></div>
          </div>
        </div>

        <div class="base"></div>
      </div>

      <button
        class="capsule-out"
        :class="{ show: capsuleOut, ready: stage === 'done' }"
        :disabled="stage !== 'done'"
        aria-label="캡슐 열기"
        @click="openCapsule"
      ></button>

      <div class="ground-shadow"></div>
    </div>

    <p class="hint" :key="hint">{{ hint }}</p>

    <button class="cta" :class="{ pulsing: !drawing || stage === 'done' }" :disabled="drawing && stage !== 'done'" @click="handleDraw">
      {{ ctaLabel }}
    </button>
  </section>
</template>

<style scoped>
.gacha-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 1.5rem 1.8rem;
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
  margin-top: 0.4rem;
}

.machine-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  min-height: 0;
}

/* ───────── 머신 전체 ───────── */
.machine {
  position: relative;
  width: 232px;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 22px 26px rgba(63, 45, 34, 0.32));
}

.machine.vibrate {
  animation: vibrate 0.14s linear infinite;
}

@keyframes vibrate {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(-1.5px, 0.5px) rotate(-0.4deg); }
  50% { transform: translate(1px, -0.5px) rotate(0.3deg); }
  75% { transform: translate(-1px, 0.5px) rotate(-0.2deg); }
}

.machine.bump {
  animation: bump 0.5s ease;
}

@keyframes bump {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(4px); }
  55% { transform: translateY(-2px); }
}

/* ───────── 유리 돔 ───────── */
.dome {
  position: relative;
  width: 200px;
  height: 178px;
  border-radius: 100px 100px 26px 26px;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 32% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(252, 248, 241, 0.55) 32%, rgba(226, 213, 192, 0.55) 68%, rgba(160, 138, 112, 0.6) 100%);
  box-shadow:
    inset 0 -22px 32px rgba(94, 66, 50, 0.22),
    inset 10px 16px 28px rgba(255, 255, 255, 0.85),
    inset -12px -8px 22px rgba(122, 86, 66, 0.14);
  border: 5px solid rgba(255, 255, 255, 0.5);
  z-index: 2;
}

/* 돔 안쪽 바닥 그림자 */
.dome-pit {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: -14px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 50%, rgba(63, 45, 34, 0.28) 0%, rgba(63, 45, 34, 0) 70%);
}

/* 유리 반사광 오버레이 */
.dome-glass {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.dome-glass::before {
  content: '';
  position: absolute;
  top: 14px;
  left: 22px;
  width: 64px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  filter: blur(6px);
  transform: rotate(-24deg);
}

.dome-glass::after {
  content: '';
  position: absolute;
  top: 52px;
  left: 12px;
  width: 14px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  filter: blur(4px);
  transform: rotate(-18deg);
}

/* ───────── 3D 캡슐 ───────── */
.cap3d {
  position: absolute;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 32%),
    radial-gradient(circle at 72% 84%, rgba(63, 45, 34, 0.28) 0%, rgba(63, 45, 34, 0) 48%),
    linear-gradient(180deg, var(--cap-top) 0%, var(--cap-top) 45%, #fdfaf3 45%, #fdfaf3 52%, #eee3cd 100%);
  box-shadow:
    inset -3px -5px 8px rgba(63, 45, 34, 0.22),
    0 6px 8px -3px rgba(63, 45, 34, 0.4);
  animation: jiggle 2.6s ease-in-out infinite;
}

.cap3d.c-1 { --cap-top: var(--caramel); }
.cap3d.c-2 { --cap-top: var(--sage); }
.cap3d.c-3 { --cap-top: #c9724a; }

@keyframes jiggle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-3px) rotate(5deg); }
}

.cap3d.tumble {
  animation: tumble 0.45s ease-in-out infinite;
}

@keyframes tumble {
  0% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(-7px, -22px) rotate(-38deg); }
  50% { transform: translate(6px, -6px) rotate(22deg); }
  75% { transform: translate(-4px, -16px) rotate(-14deg); }
  100% { transform: translate(0, 0) rotate(0); }
}

/* ───────── 돔-본체 연결 링 ───────── */
.collar {
  width: 216px;
  height: 16px;
  margin-top: -8px;
  border-radius: 8px;
  background: linear-gradient(180deg, #9a7157 0%, var(--mocha) 40%, var(--mocha-d) 100%);
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.4),
    inset 0 -3px 4px rgba(0, 0, 0, 0.3);
  z-index: 3;
}

/* ───────── 본체 ───────── */
.body {
  position: relative;
  width: 232px;
  padding: 12px 0 16px;
  border-radius: 18px 18px 8px 8px;
  background: linear-gradient(100deg, #9a7157 0%, var(--mocha) 28%, var(--mocha-d) 72%, #4a3327 100%);
  box-shadow:
    inset 0 5px 8px rgba(255, 255, 255, 0.28),
    inset 0 -10px 16px rgba(0, 0, 0, 0.32),
    inset 6px 0 12px rgba(255, 255, 255, 0.1),
    inset -6px 0 12px rgba(0, 0, 0, 0.2);
}

/* 본체 곡면 하이라이트 */
.body::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 10px;
  left: 22px;
  width: 20px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.05));
  filter: blur(3px);
  pointer-events: none;
}

.plate {
  display: inline-block;
  font-family: var(--font-num);
  font-weight: 700;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: var(--espresso);
  background: linear-gradient(180deg, #f7edd9 0%, var(--cream-2) 60%, #d8c9ac 100%);
  padding: 3px 14px;
  border-radius: 999px;
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.9),
    inset 0 -2px 3px rgba(122, 86, 66, 0.35),
    0 2px 4px rgba(0, 0, 0, 0.25);
}

/* ───────── 코인 & 손잡이 ───────── */
.knob-area {
  position: relative;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coin {
  position: absolute;
  top: -46px;
  left: 50%;
  width: 30px;
  height: 30px;
  margin-left: -15px;
  border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, #ffe9b8 0%, var(--caramel) 45%, var(--caramel-d) 80%, #96621b 100%);
  box-shadow:
    inset 0 0 0 3px rgba(255, 255, 255, 0.25),
    0 4px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  z-index: 6;
}

.coin.drop {
  animation: coin-drop 0.55s cubic-bezier(0.5, 0, 0.8, 0.4) forwards;
}

@keyframes coin-drop {
  0% { opacity: 0; transform: translateY(-26px) rotate(-20deg); }
  25% { opacity: 1; }
  80% { opacity: 1; transform: translateY(38px) rotate(10deg) scaleX(0.6); }
  100% { opacity: 0; transform: translateY(46px) rotate(10deg) scaleX(0.15); }
}

.knob {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 34% 28%, #f4cf96 0%, var(--caramel) 42%, var(--caramel-d) 74%, #8f5c17 100%);
  box-shadow:
    0 7px 12px rgba(0, 0, 0, 0.4),
    inset 0 3px 5px rgba(255, 255, 255, 0.65),
    inset 0 -6px 10px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
}

.knob.grabbable {
  cursor: grab;
}

.knob.grabbable:active {
  cursor: grabbing;
}

/* 코인 투입 슬롯 (세로 홈) */
.knob-slot {
  position: absolute;
  width: 6px;
  height: 34px;
  border-radius: 3px;
  background: linear-gradient(90deg, #6d4a12 0%, #3a2708 50%, #8f5c17 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6);
}

/* 가로 손잡이 바 */
.knob-bar {
  position: absolute;
  width: 58px;
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(180deg, #f4cf96 0%, var(--caramel) 45%, #a06a1c 100%);
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.6),
    inset 0 -3px 4px rgba(0, 0, 0, 0.35),
    0 2px 4px rgba(0, 0, 0, 0.3);
}

.knob-tag {
  margin-top: 6px;
  font-family: var(--font-num);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.22em;
  color: rgba(252, 248, 241, 0.65);
}

/* ───────── 배출구 ───────── */
.outlet {
  width: 232px;
  padding: 10px 0 12px;
  background: linear-gradient(100deg, #7d5a45 0%, var(--mocha-d) 55%, #443023 100%);
  border-radius: 0 0 6px 6px;
  box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
}

.outlet-hole {
  width: 108px;
  height: 58px;
  border-radius: 14px;
  background: radial-gradient(120% 130% at 50% 0%, #241812 0%, #120b07 70%);
  box-shadow:
    inset 0 6px 12px rgba(0, 0, 0, 0.85),
    inset 0 -2px 3px rgba(255, 255, 255, 0.08),
    0 1px 2px rgba(255, 255, 255, 0.15);
  overflow: hidden;
  perspective: 220px;
}

.flap {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(252, 248, 241, 0.28) 0%, rgba(252, 248, 241, 0.1) 100%);
  border: 2px solid rgba(252, 248, 241, 0.22);
  transform-origin: top center;
  transition: transform 0.35s cubic-bezier(0.5, 0, 0.5, 1);
}

.flap.open {
  transform: rotateX(-58deg);
}

/* ───────── 받침대 ───────── */
.base {
  width: 248px;
  height: 22px;
  margin-top: 2px;
  border-radius: 10px 10px 14px 14px;
  background: linear-gradient(180deg, #59402f 0%, var(--espresso) 70%, #2c1f16 100%);
  box-shadow:
    inset 0 3px 4px rgba(255, 255, 255, 0.18),
    inset 0 -4px 6px rgba(0, 0, 0, 0.5);
}

.ground-shadow {
  position: absolute;
  bottom: calc(50% - 218px);
  left: 50%;
  width: 250px;
  height: 30px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(63, 45, 34, 0.3) 0%, rgba(63, 45, 34, 0) 68%);
  z-index: -1;
}

/* ───────── 배출된 캡슐 ───────── */
.capsule-out {
  position: absolute;
  left: 50%;
  bottom: calc(50% - 212px);
  width: 58px;
  height: 58px;
  margin-left: -29px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 32%),
    radial-gradient(circle at 72% 84%, rgba(63, 45, 34, 0.3) 0%, rgba(63, 45, 34, 0) 48%),
    linear-gradient(180deg, var(--caramel) 0%, var(--caramel) 45%, #fdfaf3 45%, #fdfaf3 52%, #eee3cd 100%);
  box-shadow:
    inset -4px -6px 10px rgba(63, 45, 34, 0.25),
    0 10px 14px -4px rgba(63, 45, 34, 0.5);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.capsule-out.show {
  opacity: 1;
  animation: cap-drop 0.9s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
}

@keyframes cap-drop {
  0% { opacity: 0; transform: translateY(-90px) scale(0.55) rotate(-30deg); }
  30% { opacity: 1; }
  55% { transform: translateY(0) scale(1) rotate(8deg); }
  72% { transform: translateY(-16px) rotate(-6deg); }
  86% { transform: translateY(0) rotate(3deg); }
  100% { opacity: 1; transform: translateY(0) rotate(0); }
}

.capsule-out.ready {
  pointer-events: auto;
  cursor: pointer;
  animation: cap-invite 1.4s ease-in-out infinite;
}

@keyframes cap-invite {
  0%, 100% {
    transform: translateY(0) scale(1);
    filter: drop-shadow(0 0 0 rgba(221, 161, 94, 0));
  }
  50% {
    transform: translateY(-6px) scale(1.06);
    filter: drop-shadow(0 0 14px rgba(221, 161, 94, 0.8));
  }
}

/* ───────── 힌트 & 버튼 ───────── */
.hint {
  font-size: 0.82rem;
  color: var(--mocha);
  margin: 0.7rem 0 0.9rem;
  animation: hint-in 0.35s ease;
}

@keyframes hint-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
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
  flex-shrink: 0;
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

@media (max-height: 720px) {
  .machine {
    transform: scale(0.86);
    transform-origin: center;
  }

  .machine.vibrate {
    animation: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cap3d,
  .cta.pulsing,
  .machine.vibrate,
  .capsule-out.ready {
    animation: none;
  }
}
</style>
