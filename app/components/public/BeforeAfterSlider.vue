<template>
  <div
    class="before-after-container"
    ref="containerRef"
    :style="{ '--accent-color': accentColor || '#3B82F6' }"
    @pointerdown="handlePointerDown"
    @keydown="handleKeyDown"
    tabindex="0"
    role="slider"
    :aria-valuenow="position"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="'مقارنة الصور قبل وبعد: ' + position + '%'"
  >
    <!-- Base Layer: AFTER Image (Underneath) -->
    <div class="layer after-layer">
      <img
        :src="afterImage"
        :alt="afterLabel"
        class="slider-image"
        loading="lazy"
        draggable="false"
        @error="handleImgFallback"
      />
      <div class="slider-badge badge-after" :style="{ opacity: position > 85 ? '0.2' : '1' }">
        <span class="badge-dot green-dot" />
        <span>{{ afterLabel }}</span>
      </div>
    </div>

    <!-- Top Layer: BEFORE Image (Clipped) -->
    <div
      class="layer before-layer"
      :style="{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }"
    >
      <img
        :src="beforeImage"
        :alt="beforeLabel"
        class="slider-image"
        :class="{ 'wireframe-filter': isIdentical }"
        loading="lazy"
        draggable="false"
        @error="handleImgFallback"
      />
      <div class="slider-badge badge-before" :style="{ opacity: position < 15 ? '0.2' : '1' }">
        <span class="badge-dot orange-dot" />
        <span>{{ isIdentical ? 'النموذج الأولي / Wireframe' : beforeLabel }}</span>
      </div>
    </div>

    <!-- Draggable Divider Line & Handle -->
    <div
      class="divider-line"
      :style="{ left: `${position}%` }"
    >
      <div class="handle-glow" />
      <div class="handle-knob" title="اسحب يميناً أو يساراً للمقارنة">
        <svg class="handle-arrows" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Quick Hint Tag -->
    <div class="drag-hint" v-if="showHint">
      <v-icon icon="mdi-gesture-swipe-horizontal" size="16" class="ml-1" />
      <span>اسحب للمقارنة</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  accentColor?: string
  initialPosition?: number
}>(), {
  beforeLabel: 'قبل التطوير (Before)',
  afterLabel: 'بعد التطوير والحل (After)',
  accentColor: '#3B82F6',
  initialPosition: 50
})

const position = ref(props.initialPosition)
const isDragging = ref(false)
const showHint = ref(true)
const containerRef = ref<HTMLElement | null>(null)

const isIdentical = computed(() => {
  return !props.beforeImage || props.beforeImage === props.afterImage
})

function handleImgFallback(e: Event) {
  const target = e.target as HTMLImageElement
  if (target) {
    target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
  }
}

function updatePosition(clientX: number) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = clientX - rect.left
  const rawPercent = (x / rect.width) * 100
  position.value = Math.max(0, Math.min(100, Math.round(rawPercent)))
  showHint.value = false
}

function handlePointerDown(e: PointerEvent) {
  isDragging.value = true
  updatePosition(e.clientX)
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
}

function handlePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  updatePosition(e.clientX)
}

function handlePointerUp() {
  isDragging.value = false
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    position.value = Math.max(0, position.value - 5)
    showHint.value = false
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    position.value = Math.min(100, position.value + 5)
    showHint.value = false
  }
}

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }
})
</script>

<style scoped>
.before-after-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 280px;
  max-height: 600px;
  border-radius: 16px;
  overflow: hidden;
  user-select: none;
  touch-action: pan-y;
  cursor: ew-resize;
  background: #0B0F19;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.before-after-container:focus-visible {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slider-image.wireframe-filter {
  filter: grayscale(100%) contrast(125%) brightness(80%);
}

/* Badges */
.slider-badge {
  position: absolute;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: opacity 0.25s ease;
  z-index: 5;
}

.badge-before {
  left: 16px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #FBBF24;
}

.badge-after {
  right: 16px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34D399;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.orange-dot {
  background: #F59E0B;
  box-shadow: 0 0 8px #F59E0B;
}

.green-dot {
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
}

/* Divider Line */
.divider-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #FFFFFF;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.handle-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.25;
  filter: blur(12px);
  pointer-events: none;
}

.handle-knob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0B0F19;
  border: 2px solid #FFFFFF;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  pointer-events: auto;
  cursor: grab;
}

.before-after-container:active .handle-knob {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.8), 0 0 0 6px rgba(255, 255, 255, 0.25);
}

.handle-arrows {
  width: 18px;
  height: 18px;
}

/* Drag Hint */
.drag-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(11, 15, 25, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--t2, #E2E8F0);
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 6;
  pointer-events: none;
  animation: pulse-hint 2s infinite ease-in-out;
}

@keyframes pulse-hint {
  0%, 100% { opacity: 0.9; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.4; transform: translateX(-50%) scale(0.97); }
}

@media (max-width: 600px) {
  .before-after-container {
    aspect-ratio: 4 / 3;
    border-radius: 12px;
  }
  .handle-knob {
    width: 34px;
    height: 34px;
  }
  .handle-arrows {
    width: 15px;
    height: 15px;
  }
  .slider-badge {
    padding: 4px 10px;
    font-size: 0.7rem;
    top: 10px;
  }
  .badge-before { left: 10px; }
  .badge-after { right: 10px; }
}
</style>
