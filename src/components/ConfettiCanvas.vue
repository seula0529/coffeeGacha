<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let ctx = null
let particles = []
let rafId = null
let width = 0
let height = 0

const COLORS = ['#DDA15E', '#C4832F', '#97A97C', '#7C8E63', '#FCF8F1', '#5E4232']

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  width = canvas.width = parent.clientWidth
  height = canvas.height = parent.clientHeight
}

function spawnBurst() {
  const count = 90
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) - Math.PI / 2 - Math.PI / 4
    const speed = 4 + Math.random() * 7
    particles.push({
      x: width / 2,
      y: height * 0.4,
      vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1),
      vy: Math.sin(angle) * speed - 4,
      size: 4 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      life: 0,
      maxLife: 70 + Math.random() * 40,
      shape: Math.random() < 0.5 ? 'rect' : 'circle',
    })
  }
}

function tick() {
  ctx.clearRect(0, 0, width, height)
  particles = particles.filter((p) => p.life < p.maxLife)
  for (const p of particles) {
    p.life++
    p.vy += 0.18
    p.x += p.vx
    p.y += p.vy
    p.rotation += p.rotSpeed
    const fade = Math.max(0, 1 - p.life / p.maxLife)
    ctx.save()
    ctx.globalAlpha = fade
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)
    ctx.fillStyle = p.color
    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
  if (particles.length > 0) {
    rafId = requestAnimationFrame(tick)
  } else {
    rafId = null
  }
}

function burst() {
  if (reduceMotion) return
  resize()
  spawnBurst()
  if (!rafId) rafId = requestAnimationFrame(tick)
}

defineExpose({ burst })

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <canvas ref="canvasRef" class="confetti-canvas" aria-hidden="true"></canvas>
</template>

<style scoped>
.confetti-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}
</style>
