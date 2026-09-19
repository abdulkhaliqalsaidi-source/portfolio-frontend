<template>
  <transition name="loader-fade">
    <div v-if="visible" class="loader">
      <div class="loader-content">
        <div class="loader-logo">
          <svg viewBox="0 0 80 80" class="loader-svg">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
            <circle cx="40" cy="40" r="36" fill="none" stroke="#3B82F6" stroke-width="2"
              stroke-dasharray="226" :stroke-dashoffset="dashOffset"
              stroke-linecap="round" transform="rotate(-90 40 40)"/>
          </svg>
          <span class="loader-letter">{{ firstLetter }}</span>
        </div>

        <div class="loader-name" v-if="devName">{{ devName }}</div>
        <div class="loader-role" v-if="devRole">{{ devRole }}</div>

        <div class="loader-bar-wrap">
          <div class="loader-bar" :style="{ width: progress + '%' }" />
        </div>
        <div class="loader-percent">{{ progress }}%</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'

const store = usePortfolioStore()
const devName = computed(() => store.developer?.full_name || store.developer?.name || '')
const devRole = computed(() => store.developer?.title || '')
const firstLetter = computed(() => devName.value ? devName.value.trim().charAt(0) : '✦')

const visible = ref(true)
const progress = ref(0)
const dashOffset = computed(() => 226 - (226 * progress.value) / 100)


onMounted(() => {
  const interval = setInterval(() => {
    progress.value += Math.random() * 25 + 15
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(interval)
      setTimeout(() => { visible.value = false }, 250)
    }
  }, 60)
})
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}
.loader-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.loader-logo {
  position: relative;
  width: 64px; height: 64px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.loader-svg {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  transition: stroke-dashoffset 0.15s ease;
}
.loader-letter {
  font-family: var(--f-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary);
  position: relative;
  z-index: 1;
}
.loader-name {
  font-family: var(--f-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--t1);
}
.loader-role {
  font-size: 0.75rem;
  color: var(--t3);
  font-family: var(--f-mono);
  letter-spacing: 0.5px;
}
.loader-bar-wrap {
  width: 140px;
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}
.loader-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.15s ease;
}
.loader-percent {
  font-size: 0.72rem;
  color: var(--t3);
  font-family: var(--f-mono);
  font-weight: 600;
}

.loader-fade-leave-active { transition: opacity 0.4s ease; }
.loader-fade-leave-to { opacity: 0; }
</style>
