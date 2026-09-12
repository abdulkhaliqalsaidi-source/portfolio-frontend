<template>
  <section class="section" id="timeline" v-if="displayTimeline.length">
    <div class="container">
      <div class="tl-layout">

        <!-- Left Column: Sticky Title & Quick Summary -->
        <div class="tl-left anim-left">
          <div class="eyebrow">{{ store.settings.timeline_section_eyebrow || 'المسيرة والمحطات • Career & Milestones' }}</div>
          <h2 class="s-title">{{ store.settings.timeline_section_title || 'الخبرة المهنية' }} <span class="g-text">والمسار الوظيفي</span></h2>
          <p class="s-sub">{{ store.settings.timeline_section_sub || 'أبرز المحطات والإنجازات المهنية والأنظمة والمشاريع البرمجية التي ساهمت في إنجازها بنجاح.' }}</p>

          <div class="tl-summary d-none d-md-flex">
            <div class="tls-header">
              <v-icon icon="mdi-history" size="18" color="#3B82F6" />
              <span>تسلسل المحطات الزمنية</span>
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

const store = usePortfolioStore()
useScrollReveal('.anim, .anim-left')

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
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
}

.tls-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #38BDF8;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.tls-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tls-year {
  font-size: 0.78rem;
  font-weight: 800;
  font-family: var(--f-mono, 'Tajawal', sans-serif);
  color: #38BDF8;
  min-width: 65px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  text-align: center;
}

.tls-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #CBD5E1;
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
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--tl-color, #3B82F6) 22%, transparent), color-mix(in srgb, var(--tl-color, #3B82F6) 6%, transparent));
  border: 1.5px solid color-mix(in srgb, var(--tl-color, #3B82F6) 45%, transparent);
  color: var(--tl-color, #38BDF8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 18px color-mix(in srgb, var(--tl-color, #3B82F6) 25%, transparent);
  z-index: 2;
  transition: all 0.3s ease;
}

.tl-item:hover .tli-icon-box {
  transform: scale(1.1);
  box-shadow: 0 0 25px color-mix(in srgb, var(--tl-color, #3B82F6) 50%, transparent);
  border-color: var(--tl-color, #3B82F6);
}

.tli-track {
  width: 2px;
  flex: 1;
  min-height: 40px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--tl-color, #3B82F6) 45%, transparent), rgba(255, 255, 255, 0.05));
  margin: 8px 0;
}

.tli-card {
  flex: 1;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  padding: clamp(20px, 2.5vw, 28px);
  margin-bottom: 24px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tli-card:hover {
  border-color: color-mix(in srgb, var(--tl-color, #3B82F6) 50%, transparent);
  transform: translateY(-4px);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px color-mix(in srgb, var(--tl-color, #3B82F6) 18%, transparent);
}

.tli-year {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--tl-color, #38BDF8);
  font-family: var(--f-mono, 'Tajawal', sans-serif);
  padding: 3px 10px;
  border-radius: 100px;
  background: color-mix(in srgb, var(--tl-color, #3B82F6) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--tl-color, #3B82F6) 30%, transparent);
}

.tli-org {
  font-size: 0.76rem;
  font-weight: 700;
  color: #94A3B8;
  font-family: var(--f-body, 'Cairo', sans-serif);
  background: rgba(255, 255, 255, 0.04);
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: inline-flex;
  align-items: center;
}

.tli-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.1rem, 1.4vw, 1.25rem);
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.tli-desc {
  font-size: 0.9rem;
  color: #94A3B8;
  line-height: 1.8;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Theme Overrides */
[data-theme="light"] .tl-summary,
[data-theme="light"] .tli-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

[data-theme="light"] .tli-title {
  color: #0F172A;
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
