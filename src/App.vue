<script setup>
import { ref } from 'vue'
import GachaView from './components/GachaView.vue'
import RevealOverlay from './components/RevealOverlay.vue'
import DiagnosisForm from './components/DiagnosisForm.vue'
import CompleteView from './components/CompleteView.vue'
import { drawPrize } from './data/prizes.js'

const view = ref('gacha') // gacha | reveal | entry | complete
const prize = ref(null)
const result = ref(null)
const entry = ref(null)

function handleDrawn() {
  prize.value = drawPrize()
  view.value = 'reveal'
}

function handleEnter() {
  view.value = 'entry'
}

function handleSubmit(payload) {
  result.value = payload.result
  entry.value = payload.form
  view.value = 'complete'
}
</script>

<template>
  <div class="app-shell">
    <Transition name="fade" mode="out-in">
      <GachaView v-if="view === 'gacha'" key="gacha" @drawn="handleDrawn" />
      <RevealOverlay v-else-if="view === 'reveal'" key="reveal" :prize="prize" @next="handleEnter" />
      <DiagnosisForm v-else-if="view === 'entry'" key="entry" :prize="prize" @submit="handleSubmit" />
      <CompleteView
        v-else-if="view === 'complete'"
        key="complete"
        :prize="prize"
        :result="result"
        :form="entry"
      />
    </Transition>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100%;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
