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
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg, 10px);
  padding: clamp(20px, 2.5vw, 26px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-base), border-color var(--t-base), box-shadow var(--t-base);
}

.service-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-h);
  box-shadow: var(--shadow-md);
}

.s-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.s-icon-box {
  width: 42px;
  height: 42px;
  border-radius: var(--r-sm, 6px);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--t-fast);
}

.service-card:hover .s-icon-box {
  border-color: var(--border-h);
}

.s-num {
  font-size: 0.8rem;
  color: var(--t3);
  font-weight: 700;
  font-family: var(--f-mono);
  padding: 2px 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--r-xs, 4px);
}

.s-card-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.05rem, 1.3vw, 1.2rem);
  font-weight: 700;
  color: var(--t1);
  margin-bottom: 8px;
  line-height: 1.35;
}

.s-card-desc {
  font-size: 0.88rem;
  color: var(--t2);
  line-height: 1.75;
  margin-bottom: 18px;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.s-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.s-feature-item {
  display: flex;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--t2);
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Mode Overrides */
[data-theme="light"] .service-card {
  background: #FFFFFF;
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

[data-theme="light"] .s-card-title {
  color: var(--t1);
}

[data-theme="light"] .s-card-desc {
  color: var(--t2);
}

[data-theme="light"] .s-feature-item {
  color: var(--t2);
}

[data-theme="light"] .s-features {
  border-top-color: var(--border);
}

[data-theme="light"] .s-num {
  background: var(--bg-subtle);
  border-color: var(--border);
  color: var(--t3);
}

@media (max-width: 600px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
