<template>
  <div>
    <!-- Top Reading / Scroll Progress Bar -->
    <div class="global-progress-bar" :style="{ width: progress + '%' }" />

    <!-- Circular Back to Top Floating Button -->
    <transition name="pop-scale">
      <button
        v-if="show"
        class="back-to-top-btn"
        @click="scrollTop"
        aria-label="العودة للأعلى"
        title="العودة للأعلى"
      >
        <!-- Circular Progress Ring SVG -->
        <svg class="progress-ring" width="46" height="46" viewBox="0 0 46 46">
          <circle
            class="progress-ring-bg"
            cx="23"
            cy="23"
            r="19"
          />
          <circle
            class="progress-ring-circle"
            cx="23"
            cy="23"
            r="19"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
          />
        </svg>

        <!-- Arrow Icon -->
        <div class="arrow-wrap">
          <v-icon icon="mdi-arrow-up" size="18" />
        </div>

        <span class="top-tooltip">للأعلى</span>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const show = ref(false)
const progress = ref(0)
const radius = 19
const circumference = 2 * Math.PI * radius

const strokeDashoffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

function onScroll() {
  const scrolled = window.scrollY
  const total = document.documentElement.scrollHeight - window.innerHeight
  progress.value = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0
  show.value = scrolled > 350
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.global-progress-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  z-index: 99999;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  transition: width 0.1s linear;
  transform-origin: right;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
}

.back-to-top-btn {
  position: fixed;
  bottom: 88px;
  left: 28px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #F8FAFC;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8999;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.progress-ring {
  position: absolute;
  top: -1px;
  left: -1px;
  transform: rotate(-90deg);
  pointer-events: none;
}

.progress-ring-bg {
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 2.5;
}

.progress-ring-circle {
  fill: transparent;
  stroke: #3B82F6;
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.15s linear;
}

.arrow-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.back-to-top-btn:hover {
  transform: translateY(-3px) scale(1.05);
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(59, 130, 246, 0.5);
  color: #38BDF8;
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.3);
}

.back-to-top-btn:hover .arrow-wrap {
  transform: translateY(-2px);
}

.top-tooltip {
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(-6px);
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--f-body, 'Cairo', sans-serif);
  padding: 4px 10px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.back-to-top-btn:hover .top-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* Animations */
.pop-scale-enter-active,
.pop-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-scale-enter-from,
.pop-scale-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(16px);
}

/* Light Theme */
:global([data-theme="light"] .back-to-top-btn) {
  background: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  color: #0F172A !important;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.03) !important;
}

:global([data-theme="light"] .progress-ring-bg) {
  stroke: #E2E8F0 !important;
}

:global([data-theme="light"] .progress-ring-circle) {
  stroke: #2563EB !important;
}

:global([data-theme="light"] .back-to-top-btn:hover) {
  background: #F8FAFC !important;
  border-color: #BFDBFE !important;
  color: #2563EB !important;
  box-shadow: 0 12px 30px -5px rgba(37, 99, 235, 0.18) !important;
}

:global([data-theme="light"] .top-tooltip) {
  background: #0F172A !important;
  color: #FFFFFF !important;
}

@media (max-width: 600px) {
  .back-to-top-btn {
    bottom: 80px;
    left: 20px;
    width: 42px;
    height: 42px;
  }
}
</style>
