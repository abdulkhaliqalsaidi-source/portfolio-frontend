<template>
  <ClientOnly>
    <div v-if="variant !== 'constellation' || particlesEnabled" class="animated-background" :class="`animated-background--${variant}`" aria-hidden="true">
      <span class="animated-background__fallback" />
      <ThreeBackground :variant="variant" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import ThreeBackground from './ThreeBackground.vue'

withDefaults(defineProps<{
  variant: string
  particlesEnabled: boolean
}>(), {
  variant: 'constellation',
  particlesEnabled: true
})
</script>

<style scoped>
.animated-background {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  contain: paint;
  background: radial-gradient(ellipse at 50% 78%, rgba(24, 75, 65, .15), transparent 62%);
}
.animated-background__fallback { position: absolute; inset: -24%; background: radial-gradient(ellipse at 28% 38%, rgba(61, 145, 119, .14), transparent 42%), radial-gradient(ellipse at 70% 56%, rgba(108, 123, 187, .13), transparent 39%); filter: blur(34px); animation: ambient-shift 24s ease-in-out infinite alternate; }
.animated-background--aurora .animated-background__fallback { inset: -35% -20%; background: linear-gradient(126deg, transparent 26%, rgba(57, 163, 129, .2) 42%, rgba(103, 123, 192, .16) 58%, rgba(190, 171, 112, .1) 71%, transparent 84%); filter: blur(48px); }
.animated-background--orbit .animated-background__fallback { background: radial-gradient(ellipse at 56% 42%, rgba(99, 131, 128, .2), transparent 44%); }
.animated-background--horizon .animated-background__fallback { inset: 38% -20% -42%; background: linear-gradient(0deg, rgba(66, 139, 115, .17), transparent 76%); }
@keyframes ambient-shift { to { transform: translate(5%, -4%) scale(1.08); } }
@media (prefers-reduced-motion: reduce) { .animated-background__fallback { animation: none; } }
</style>
