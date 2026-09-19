<template>
  <section class="section" id="timeline" v-if="displayTimeline.length">
    <div class="container">
      <div class="tl-layout">

        <!-- Left Column: Sticky Title & Quick Summary -->
        <div class="tl-left anim-left">
          <div class="eyebrow">{{ eyebrow }}</div>
          <h2 class="s-title">{{ title }} <span class="g-text">{{ titleHighlight }}</span></h2>
          <p class="s-sub">{{ sub }}</p>

          <div class="tl-summary d-none d-md-flex">
            <div class="tls-header">
              <v-icon icon="mdi-history" size="18" color="#3B82F6" />
              <span>{{ locale === 'en' ? 'Chronological Milestones' : 'تسلسل المحطات الزمنية' }}</span>
            </div>
            <div class="tls-row" v-for="item in displayTimeline" :key="item.year">
              <span
                class="tls-year"
                :style="{
                  color: item.color || '#38BDF8',
                  background: `color-mix(in srgb, ${item.color || '#3B82F6'} 12%, transparent)`,
                  borderColor: `color-mix(in srgb, ${item.color || '#3B82F6'} 30%, transparent)`
                }"
              >
                {{ item.year }}
              </span>
              <span class="tls-title">{{ item.title }}</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Timeline Cards with Connectors -->
        <div class="tl-right">
          <div
            class="tl-item anim"
            :class="`d-${(i % 4) + 1}`"
            v-for="(item, i) in displayTimeline"
            :key="item.id || i"
            :style="{ '--tl-color': item.color || '#3B82F6' }"
          >
            <div class="tli-connector">
              <div class="tli-icon-box">
                <v-icon :icon="item.icon || 'mdi-briefcase-outline'" size="18" :color="item.color || '#38BDF8'" />
              </div>
              <div class="tli-track" v-if="i < displayTimeline.length - 1" />
            </div>

            <div class="tli-card">
              <div class="d-flex align-center justify-space-between gap-2 mb-3 flex-wrap">
                <span class="tli-year">{{ item.year }}</span>
                <span class="tli-org" v-if="item.organization">
                  <v-icon icon="mdi-domain" size="13" class="ml-1" />
                  <span>{{ item.organization }}</span>
                </span>
              </div>
              <h3 class="tli-title">{{ item.title }}</h3>
              <p class="tli-desc">{{ item.description }}</p>
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
useScrollReveal('.anim, .anim-left')

const eyebrow = computed(() => {
  if (locale.value === 'en') return t('timeline.eyebrow')
  return store.settings.timeline_section_eyebrow || t('timeline.eyebrow')
})

const title = computed(() => {
  if (locale.value === 'en') return t('timeline.title')
  return store.settings.timeline_section_title || t('timeline.title')
})

const titleHighlight = computed(() => {
  if (locale.value === 'en') return t('timeline.titleHighlight')
  return store.settings.timeline_section_title_span || t('timeline.titleHighlight')
})

const sub = computed(() => {
  if (locale.value === 'en') return t('timeline.sub')
  return store.settings.timeline_section_sub || t('timeline.sub')
})

const displayTimeline = computed(() => {
  return store.timeline || []
})
</script>

<style scoped>
.tl-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
}
.tl-left {
  position: sticky;
  top: 100px;
}

.tl-summary {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg, 10px);
  box-shadow: var(--shadow-sm);
}

.tls-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--primary);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.tls-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tls-year {
  font-size: 0.76rem;
  font-weight: 700;
  font-family: var(--f-mono);
  color: var(--primary);
  min-width: 60px;
  padding: 2px 6px;
  border-radius: var(--r-xs, 4px);
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  text-align: center;
}

.tls-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--t2);
  font-family: var(--f-body, 'Cairo', sans-serif);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tl-right {
  display: flex;
  flex-direction: column;
}

.tl-item {
  display: flex;
  gap: clamp(14px, 3vw, 24px);
  align-items: stretch;
}

.tli-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.tli-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--r-sm, 6px);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--tl-color, var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: border-color var(--t-fast);
}

.tl-item:hover .tli-icon-box {
  border-color: var(--border-h);
}

.tli-track {
  width: 2px;
  flex: 1;
  min-height: 40px;
  background: var(--border);
  margin: 6px 0;
}

.tli-card {
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg, 10px);
  padding: clamp(18px, 2.2vw, 24px);
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-base), border-color var(--t-base), box-shadow var(--t-base);
}

.tli-card:hover {
  border-color: var(--border-h);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tli-year {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  font-family: var(--f-mono);
  padding: 2px 8px;
  border-radius: var(--r-xs, 4px);
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
}

.tli-org {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--t3);
  font-family: var(--f-body, 'Cairo', sans-serif);
  background: var(--bg-subtle);
  padding: 2px 8px;
  border-radius: var(--r-xs, 4px);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
}

.tli-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.05rem, 1.3vw, 1.2rem);
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 6px;
}

.tli-desc {
  font-size: 0.88rem;
  color: var(--t2);
  line-height: 1.75;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Theme Overrides */
[data-theme="light"] .tl-summary,
[data-theme="light"] .tli-card {
  background: #FFFFFF;
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

[data-theme="light"] .tli-title {
  color: var(--t1);
}

[data-theme="light"] .tli-desc,
[data-theme="light"] .tls-title {
  color: #475569;
}

[data-theme="light"] .tli-org {
  background: #F1F5F9;
  border-color: #E2E8F0;
  color: #64748B;
}

[data-theme="light"] .tls-header {
  border-bottom-color: #E2E8F0;
}

@media (max-width: 960px) {
  .tl-layout { grid-template-columns: 1fr; }
  .tl-left { position: static; }
}
</style>
