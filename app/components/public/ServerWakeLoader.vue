<template>
  <transition name="server-wake">
    <div
      v-if="store.isWakingUp"
      class="server-wake-banner"
      role="status"
      aria-live="polite"
    >
      <div class="wake-card">
        <!-- Animated Pulse Beacon -->
        <div class="wake-icon-wrapper">
          <span class="beacon-ring" />
          <span class="beacon-dot" />
          <svg class="wake-spinner" viewBox="0 0 24 24" fill="none">
            <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" />
            <circle class="spinner-head" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </div>

        <!-- Text Info -->
        <div class="wake-content">
          <div class="wake-title">
            <span>{{ isRtl ? 'جاري الاتصال بالسيرفر وتجهيز البيانات...' : 'Connecting to server & preparing data...' }}</span>
            <span v-if="store.retryAttempt > 1" class="wake-attempt-tag">
              {{ isRtl ? `المحاولة ${store.retryAttempt}/3` : `Attempt ${store.retryAttempt}/3` }}
            </span>
          </div>
          <div class="wake-desc">
            {{ isRtl
              ? 'الاستضافة السحابية المجانية في وضع بدء التشغيل (قد يستغرق 10-25 ثانية لأول مرة)'
              : 'Waking up cloud backend from idle (may take 10-25s on first visit)' }}
          </div>
        </div>

        <!-- Progress shimmer line at bottom -->
        <div class="wake-progress-bar">
          <div class="wake-progress-indicator" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'

const store = usePortfolioStore()
const { isRtl } = useLocale()
</script>

<style scoped>
.server-wake-banner {
  position: fixed;
  bottom: 24px;
  inset-inline-end: 24px;
  z-index: 9999;
  max-width: 440px;
  width: calc(100vw - 48px);
  pointer-events: auto;
}

.wake-card {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px 18px 18px;
  background: rgba(18, 28, 32, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(118, 217, 195, 0.28);
  border-radius: 16px;
  box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.5), 0 0 24px rgba(118, 217, 195, 0.15);
  color: #F8FAFC;
}

[data-theme="light"] .wake-card {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(11, 112, 101, 0.25);
  box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.12), 0 0 20px rgba(11, 112, 101, 0.1);
  color: #101E21;
}

/* Pulse Beacon */
.wake-icon-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.beacon-dot {
  width: 10px;
  height: 10px;
  background: #76D9C3;
  border-radius: 50%;
  box-shadow: 0 0 10px #76D9C3;
}

[data-theme="light"] .beacon-dot {
  background: #0B7065;
  box-shadow: 0 0 10px #0B7065;
}

.beacon-ring {
  position: absolute;
  inset: 2px;
  border-radius: 50%;
  border: 2px solid #76D9C3;
  animation: beacon-pulse 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
}

[data-theme="light"] .beacon-ring {
  border-color: #0B7065;
}

@keyframes beacon-pulse {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.wake-spinner {
  position: absolute;
  inset: 0;
  width: 36px;
  height: 36px;
  animation: spin 1.2s linear infinite;
  color: #76D9C3;
}

[data-theme="light"] .wake-spinner {
  color: #0B7065;
}

.spinner-track {
  opacity: 0.2;
}

.spinner-head {
  stroke-dasharray: 40;
  stroke-dashoffset: 20;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Content */
.wake-content {
  flex: 1;
  min-width: 0;
}

.wake-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.4;
}

.wake-attempt-tag {
  font-size: 0.72rem;
  padding: 1px 7px;
  border-radius: 12px;
  background: rgba(118, 217, 195, 0.15);
  color: #76D9C3;
  font-family: monospace;
}

[data-theme="light"] .wake-attempt-tag {
  background: rgba(11, 112, 101, 0.12);
  color: #0B7065;
}

.wake-desc {
  font-size: 0.75rem;
  color: rgba(248, 250, 252, 0.72);
  margin-top: 3px;
  line-height: 1.35;
}

[data-theme="light"] .wake-desc {
  color: rgba(16, 30, 33, 0.7);
}

/* Shimmer Progress bar at bottom */
.wake-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.wake-progress-indicator {
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, transparent, #76D9C3, transparent);
  animation: wake-shimmer 1.8s ease-in-out infinite;
}

[data-theme="light"] .wake-progress-indicator {
  background: linear-gradient(90deg, transparent, #0B7065, transparent);
}

@keyframes wake-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

/* Transition */
.server-wake-enter-active,
.server-wake-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.server-wake-enter-from,
.server-wake-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

@media (max-width: 600px) {
  .server-wake-banner {
    bottom: 16px;
    inset-inline-end: 16px;
    width: calc(100vw - 32px);
  }
}
</style>
