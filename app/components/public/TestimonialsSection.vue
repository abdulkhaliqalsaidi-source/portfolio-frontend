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
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl, 12px);
  padding: clamp(20px, 2.5vw, 26px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-base), border-color var(--t-base), box-shadow var(--t-base);
}

.t-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-h);
  box-shadow: var(--shadow-md);
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
  padding: 3px 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--r-xs, 4px);
}

.t-verified-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: #10B981;
  font-family: var(--f-body, 'Cairo', sans-serif);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.08);
  padding: 3px 8px;
  border-radius: var(--r-xs, 4px);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.t-text {
  font-size: 0.9rem;
  color: var(--t2);
  line-height: 1.8;
  font-family: var(--f-body, 'Cairo', sans-serif);
  flex: 1;
  margin-bottom: 18px;
}

.t-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.t-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--r-sm, 6px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1rem;
  font-weight: 800;
  color: var(--primary);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
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
  font-size: 0.96rem;
  font-weight: 700;
  color: var(--t1);
}

.t-role {
  font-family: var(--f-body, 'Cairo', sans-serif);
  font-size: 0.76rem;
  color: var(--t3);
  margin-top: 2px;
}

/* Light Theme Overrides */
[data-theme="light"] .t-card {
  background: #FFFFFF;
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

[data-theme="light"] .t-text {
  color: var(--t2);
}

[data-theme="light"] .t-name {
  color: var(--t1);
}

[data-theme="light"] .t-role {
  color: var(--t3);
}

[data-theme="light"] .t-author {
  border-top-color: var(--border);
}

@media (max-width: 600px) {
  .testimonials-grid { grid-template-columns: 1fr; }
}
</style>
