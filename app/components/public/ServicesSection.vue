<template>
  <section class="section" id="services" v-if="displayServices.length">
    <div class="container">

      <div class="section-head">
        <div class="eyebrow">{{ eyebrow }}</div>
        <h2 class="s-title">{{ title }} <span class="g-text">{{ titleHighlight }}</span></h2>
        <p class="s-sub">{{ sub }}</p>
      </div>

      <!-- Dynamic Services Grid -->
      <div class="services-grid">
        <div
          v-for="(s, i) in displayServices"
          :key="s.id || s.title"
          class="service-card anim"
          :class="`d-${(i % 4) + 1}`"
          :style="{ '--sc': s.color || 'var(--primary)' }"
        >
          <div class="s-top">
            <div class="s-icon-box" :style="{ color: s.color || 'var(--primary)' }">
              <v-icon :icon="s.icon || 'mdi-monitor-dashboard'" size="22" />
            </div>
            <span class="s-num font-mono">0{{ i + 1 }}</span>
          </div>

          <h3 class="s-card-title">{{ s.title }}</h3>
          <p class="s-card-desc">{{ s.description }}</p>

          <div class="s-features" v-if="s.features && s.features.length">
            <div class="s-feature-item" v-for="f in (Array.isArray(s.features) ? s.features : [s.features])" :key="f">
              <v-icon icon="mdi-check-circle-outline" size="15" color="var(--primary)" class="ml-2 flex-shrink-0" />
              <span>{{ f }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useLocale } from '~/composables/useLocale'

const store = usePortfolioStore()
const { t, locale } = useLocale()
useScrollReveal('.anim')

const eyebrow = computed(() => {
  if (locale.value === 'en') return t('services.eyebrow')
  return store.settings.services_section_eyebrow || t('services.eyebrow')
})

const title = computed(() => {
  if (locale.value === 'en') return t('services.title')
  return store.settings.services_section_title || t('services.title')
})

const titleHighlight = computed(() => {
  if (locale.value === 'en') return t('services.titleHighlight')
  return store.settings.services_section_title_span || t('services.titleHighlight')
})

const sub = computed(() => {
  if (locale.value === 'en') return t('services.sub')
  return store.settings.services_section_sub || t('services.sub')
})

const displayServices = computed(() => {
  return store.services || []
})
</script>

<style scoped>
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(18px, 2.5vw, 26px);
}

.service-card {
  position: relative;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  padding: clamp(22px, 2.8vw, 30px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.service-card:hover {
  transform: translateY(-6px);
  border-color: var(--sc, rgba(59, 130, 246, 0.5));
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px var(--sc, rgba(59, 130, 246, 0.2));
}

.s-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.s-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.03));
  border: 1px solid var(--sc, rgba(59, 130, 246, 0.35));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.service-card:hover .s-icon-box {
  transform: scale(1.1) rotate(6deg);
  box-shadow: 0 0 25px var(--sc, rgba(59, 130, 246, 0.4));
}

.s-num {
  font-size: 0.84rem;
  color: var(--t3);
  font-weight: 800;
  font-family: var(--f-mono, 'Tajawal', sans-serif);
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
}

.s-card-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.1rem, 1.4vw, 1.25rem);
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 10px;
  line-height: 1.35;
}

.s-card-desc {
  font-size: 0.9rem;
  color: #94A3B8;
  line-height: 1.8;
  margin-bottom: 20px;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.s-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.s-feature-item {
  display: flex;
  align-items: center;
  font-size: 0.84rem;
  font-weight: 600;
  color: #CBD5E1;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Mode Overrides */
[data-theme="light"] .service-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

[data-theme="light"] .s-card-title {
  color: #0F172A;
}

[data-theme="light"] .s-card-desc {
  color: #475569;
}

[data-theme="light"] .s-feature-item {
  color: #334155;
}

[data-theme="light"] .s-features {
  border-top-color: #E2E8F0;
}

[data-theme="light"] .s-num {
  background: #F1F5F9;
  border-color: #E2E8F0;
  color: #64748B;
}

@media (max-width: 600px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
