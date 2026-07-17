<template>
  <div class="slide slide-cover" :class="slideClass">
    <p class="cover-eyebrow">☕ &nbsp;Coffee Survey</p>

    <h1 class="cover-title">
      Favorite
      <em>COFFEE</em>
    </h1>

    <div class="cover-divider" />

    <p class="cover-sub">나만의 커피 취향을 알아봐요</p>

    <button class="btn-primary btn-start" @click="$emit('start')">
      시작하기 &nbsp;›
    </button>
  </div>
</template>

<script setup>
defineProps({
  slideClass: String,   // 'active' | 'above' | 'below'
})
defineEmits(['start'])
</script>

<style scoped>
.slide-cover { text-align: center; }

.cover-eyebrow {
  font-family: var(--font-num);
  font-size: 13px;
  letter-spacing: 0.22em;
  color: var(--caramel-d);
  text-transform: uppercase;
  margin-bottom: 22px;
  opacity: 0.85;
}

.cover-title {
  font-family: var(--font-head);
  font-size: clamp(46px, 15vw, 80px);
  font-weight: 400;
  line-height: 0.92;
  color: var(--espresso);
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}
.cover-title em {
  font-style: normal;
  color: var(--caramel-d);
  display: block;
  font-size: 0.88em;
}

.cover-divider {
  width: 36px;
  height: 1px;
  background: var(--caramel);
  opacity: 0.6;
  margin: 20px auto;
}

.cover-sub {
  font-family: var(--font-body);
  color: var(--mocha-d);
  font-size: 14px;
  margin-bottom: 44px;
  letter-spacing: 0.02em;
  line-height: 1.7;
}

.btn-start {
  padding: 15px 38px;
  font-size: 15px;
}
</style>
