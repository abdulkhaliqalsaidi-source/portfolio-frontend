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
              <div class="d-flex align-center justify-space-between gap-2 mb-3 flex-wrap tli-header-row">
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
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl, 14px);
  box-shadow: var(--shadow-sm);
}

.tls-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  font-weight: 800;
  color: var(--primary);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.tls-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.25s ease, transform 0.25s ease;
  cursor: default;
}

.tls-row:hover {
  background: var(--bg-subtle);
  transform: translateX(-4px);
}

[dir="ltr"] .tls-row:hover,
html[lang="en"] .tls-row:hover {
  transform: translateX(4px);
}

.tls-year {
  font-size: 0.78rem;
  font-weight: 800;
  font-family: var(--f-mono, 'Tajawal', sans-serif);
  color: var(--primary);
  min-width: 65px;
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  text-align: center;
}

.tls-title {
  font-size: 0.84rem;
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
  gap: clamp(16px, 3vw, 24px);
  align-items: stretch;
}

.tli-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.tli-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--tl-color, #3B82F6) 20%, transparent), color-mix(in srgb, var(--tl-color, #3B82F6) 5%, transparent));
  border: 1.5px solid color-mix(in srgb, var(--tl-color, #3B82F6) 40%, var(--border));
  color: var(--tl-color, var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px color-mix(in srgb, var(--tl-color, #3B82F6) 22%, transparent);
  z-index: 2;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease, border-color 0.35s ease;
}

.tl-item:hover .tli-icon-box {
  transform: scale(1.12) rotate(6deg);
  border-color: var(--tl-color, #3B82F6);
  box-shadow: 0 0 25px color-mix(in srgb, var(--tl-color, #3B82F6) 55%, transparent);
}

.tli-track {
  width: 3px;
  flex: 1;
  min-height: 48px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--tl-color, #3B82F6) 60%, var(--border)) 0%, color-mix(in srgb, var(--tl-color, #3B82F6) 15%, var(--border)) 100%);
  margin: 8px 0;
  border-radius: 3px;
  transition: background 0.35s ease, box-shadow 0.35s ease;
}

.tl-item:hover .tli-track {
  background: linear-gradient(180deg, var(--tl-color, #3B82F6) 0%, color-mix(in srgb, var(--tl-color, #3B82F6) 30%, transparent) 100%);
  box-shadow: 0 0 12px color-mix(in srgb, var(--tl-color, #3B82F6) 50%, transparent);
}

.tli-card {
  position: relative;
  flex: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl, 14px);
  padding: clamp(20px, 2.5vw, 28px);
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.35s ease, box-shadow 0.35s ease;
}

.tli-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 10% 0%, color-mix(in srgb, var(--tl-color, #3B82F6) 18%, transparent) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  z-index: 1;
}

.tl-item:hover .tli-card {
  border-color: var(--tl-color, #3B82F6);
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px color-mix(in srgb, var(--tl-color, #3B82F6) 35%, transparent);
}

.tl-item:hover .tli-card::before {
  opacity: 1;
}

.tli-header-row,
.tli-title,
.tli-desc {
  position: relative;
  z-index: 2;
}

.tli-year {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--tl-color, #38BDF8);
  font-family: var(--f-mono, 'Tajawal', sans-serif);
  padding: 3px 12px;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--tl-color, #3B82F6) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--tl-color, #3B82F6) 30%, transparent);
}

.tli-org {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--t2);
  font-family: var(--f-body, 'Cairo', sans-serif);
  background: var(--bg-subtle);
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
}

.tli-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.1rem, 1.4vw, 1.25rem);
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 8px;
}

.tli-desc {
  font-size: 0.9rem;
  color: var(--t2);
  line-height: 1.8;
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
