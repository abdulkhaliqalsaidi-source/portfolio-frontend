<template>
  <section class="section" id="testimonials" v-if="displayTestimonials.length">
    <div class="container">

      <div class="section-head text-center">
        <div class="eyebrow">{{ eyebrow }}</div>
        <h2 class="s-title">{{ title }} <span class="g-text">{{ titleHighlight }}</span></h2>
        <p class="s-sub">{{ sub }}</p>
      </div>

      <div class="testimonials-grid">
        <div
          v-for="(tItem, i) in displayTestimonials" :key="i"
          class="t-card anim" :class="`d-${(i % 4) + 1}`"
        >
          <!-- Top Row: Stars Rating & Verified Badge -->
          <div class="t-stars-wrap">
            <div class="t-stars">
              <v-icon v-for="s in (tItem.rating || 5)" :key="s" icon="mdi-star" size="16" color="#F59E0B" />
            </div>
            <span class="t-verified-tag">
              <v-icon icon="mdi-check-decagram" size="13" color="#10B981" />
              <span>{{ locale === 'en' ? 'Verified Client' : 'عميل موثق' }}</span>
            </span>
          </div>

          <!-- Quote Text -->
          <p class="t-text">"{{ tItem.feedback_text || tItem.text }}"</p>

          <!-- Author Info -->
          <div class="t-author">
            <div class="t-avatar">
              <img v-if="tItem.avatar" :src="tItem.avatar" :alt="tItem.client_name || tItem.name" class="t-avatar-img" />
              <span v-else>{{ (tItem.client_name || tItem.name || 'ع')[0] }}</span>
            </div>
            <div class="t-info">
              <div class="t-name">{{ tItem.client_name || tItem.name }}</div>
              <div class="t-role">{{ tItem.client_role || tItem.role }} {{ tItem.client_company ? `— ${tItem.client_company}` : '' }}</div>
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
  if (locale.value === 'en') return t('testimonials.eyebrow')
  return store.settings.testimonials_section_eyebrow || t('testimonials.eyebrow')
})

const title = computed(() => {
  if (locale.value === 'en') return t('testimonials.title')
  return store.settings.testimonials_section_title || t('testimonials.title')
})

const titleHighlight = computed(() => {
  if (locale.value === 'en') return t('testimonials.titleHighlight')
  return store.settings.testimonials_section_title_span || t('testimonials.titleHighlight')
})

const sub = computed(() => {
  if (locale.value === 'en') return t('testimonials.sub')
  return store.settings.testimonials_section_sub || t('testimonials.sub')
})

const displayTestimonials = computed(() => {
  return store.testimonials || []
})
</script>

<style scoped>
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(18px, 2.5vw, 26px);
}

.t-card {
  position: relative;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: clamp(22px, 3vw, 30px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.t-card:hover {
  transform: translateY(-5px);
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15);
}

.t-stars-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.t-stars {
  display: inline-flex;
  gap: 3px;
  padding: 4px 10px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 100px;
}

.t-verified-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: #34D399;
  font-family: var(--f-body, 'Cairo', sans-serif);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.08);
  padding: 3px 8px;
  border-radius: 100px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.t-text {
  font-size: 0.92rem;
  color: #E2E8F0;
  line-height: 1.85;
  font-family: var(--f-body, 'Cairo', sans-serif);
  flex: 1;
  margin-bottom: 20px;
}

.t-author {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.t-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.1rem;
  font-weight: 800;
  color: #38BDF8;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05));
  border: 1.5px solid rgba(59, 130, 246, 0.35);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.2);
  flex-shrink: 0;
  overflow: hidden;
}

.t-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.t-name {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.02rem;
  font-weight: 800;
  color: #FFFFFF;
}

.t-role {
  font-family: var(--f-body, 'Cairo', sans-serif);
  font-size: 0.78rem;
  color: #94A3B8;
  margin-top: 2px;
}

/* Light Theme Overrides */
[data-theme="light"] .t-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

[data-theme="light"] .t-text {
  color: #334155;
}

[data-theme="light"] .t-name {
  color: #0F172A;
}

[data-theme="light"] .t-role {
  color: #64748B;
}

[data-theme="light"] .t-author {
  border-top-color: #E2E8F0;
}

@media (max-width: 600px) {
  .testimonials-grid { grid-template-columns: 1fr; }
}
</style>
