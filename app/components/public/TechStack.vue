<template>
  <section class="section" id="stack" v-if="Object.keys(displayTechStack).length > 0">
    <div class="container">
      <div class="section-head">
        <div class="eyebrow">{{ eyebrow }}</div>
        <h2 class="s-title">{{ title }} <span class="g-text">{{ titleHighlight }}</span></h2>
        <p class="s-sub">{{ sub }}</p>
      </div>

      <div class="stack-grid">
        <div
          class="stack-card anim"
          :class="`d-${i+1}`"
          v-for="(techs, cat, i) in displayTechStack" :key="cat"
        >
          <!-- Symmetrical Header Row -->
          <div class="stack-header">
            <div class="stack-header-right">
              <div class="stack-cat-icon">
                <v-icon :icon="getCatIcon(cat)" size="20" color="#3B82F6" />
              </div>
              <h3 class="stack-cat-title">{{ cat }}</h3>
            </div>
            <div class="tech-count-badge">
              <span>{{ techs.length }}</span>
              <span class="count-label">{{ t('stack.skillsCount') }}</span>
            </div>
          </div>

          <!-- Balanced Tech Chips -->
          <div class="chips-container">
            <div
              class="tech-chip"
              v-for="t in techs" :key="t.name"
            >
              <v-icon :icon="t.icon || 'mdi-star-four-points-outline'" size="15" :color="t.color || '#38BDF8'" class="tech-icon flex-shrink-0" />
              <span class="tech-name">{{ t.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Architecture / Quality Standard Note -->
      <div class="architecture-note anim d-4 mt-6" v-if="archNoteTitle || archNoteDesc">
        <div class="d-flex align-center gap-2 mb-2">
          <v-icon icon="mdi-shield-check-outline" size="18" color="#10B981" />
          <span class="an-title">{{ archNoteTitle }}</span>
        </div>
        <p class="an-desc">
          {{ archNoteDesc }}
        </p>
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
  if (locale.value === 'en') return t('stack.eyebrow')
  return store.settings.skills_section_eyebrow || t('stack.eyebrow')
})

const title = computed(() => {
  if (locale.value === 'en') return t('stack.title')
  return store.settings.skills_section_title || t('stack.title')
})

const titleHighlight = computed(() => {
  if (locale.value === 'en') return t('stack.titleHighlight')
  return store.settings.skills_section_title_span || t('stack.titleHighlight')
})

const sub = computed(() => {
  if (locale.value === 'en') return t('stack.sub')
  return store.settings.skills_section_sub || t('stack.sub')
})

const displayTechStack = computed(() => {
  if (store.techStack && Object.keys(store.techStack).length) {
    return store.techStack
  }
  // If techStack object is empty, also check if skillCategories can be transformed
  if (store.skillCategories?.length) {
    const map = {}
    store.skillCategories.forEach(cat => {
      if (Array.isArray(cat.skills) && cat.skills.length) {
        map[cat.name] = cat.skills
      }
    })
    return map
  }
  return {}
})

const archNoteTitle = computed(() => {
  if (locale.value === 'en') return 'Quality Standards & Delivery Methodology:'
  return store.settings.architecture_note_title || 'معايير الجودة ومنهجية العمل المعتمدة:'
})

const archNoteDesc = computed(() => {
  if (locale.value === 'en') return 'Committed to rigorous engineering practices, continuous integration, responsive communication, punctual delivery, and maximum business impact.'
  return store.settings.architecture_note_desc || 'الالتزام بأعلى معايير الدقة والاحترافية، المتابعة المستمرة لمتطلبات العمل، تسليم المخرجات في المواعيد المحددة، وضمان تحقيق أفضل قيمة مضافة وتجربة متكاملة للعميل.'
})

function getCatIcon(categoryName) {
  const name = categoryName.toLowerCase()
  if (name.includes('تصميم') || name.includes('design') || name.includes('art')) return 'mdi-palette'
  if (name.includes('تسويق') || name.includes('market') || name.includes('seo')) return 'mdi-bullhorn'
  if (name.includes('إدارة') || name.includes('manage') || name.includes('business')) return 'mdi-briefcase-check'
  if (name.includes('تحليل') || name.includes('data') || name.includes('finan')) return 'mdi-chart-areaspline'
  if (name.includes('أمامية') || name.includes('front')) return 'mdi-monitor'
  if (name.includes('خلفية') || name.includes('back')) return 'mdi-server'
  if (name.includes('بيئة') || name.includes('devops') || name.includes('أدوات') || name.includes('tools')) return 'mdi-tools'
  return 'mdi-star-four-points-outline'
}
</script>

<style scoped>
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: clamp(20px, 2.5vw, 28px);
}

.stack-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl, 12px);
  padding: clamp(20px, 2.5vw, 26px);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-base), border-color var(--t-base), box-shadow var(--t-base);
}

.stack-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-h);
  box-shadow: var(--shadow-md);
}

.stack-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.stack-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.stack-cat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--r-sm, 6px);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stack-cat-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--t1);
  margin: 0;
  line-height: 1.3;
  text-align: right;
}

.tech-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--r-xs, 4px);
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  color: var(--primary);
  white-space: nowrap;
  flex-shrink: 0;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.count-label {
  font-size: 0.72rem;
  opacity: 0.85;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  align-content: flex-start;
  flex: 1;
}

.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: var(--r-xs, 6px);
  font-size: 0.84rem;
  font-weight: 600;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
  font-family: var(--f-body, 'Cairo', sans-serif);
  white-space: nowrap;
  transition: all var(--t-fast);
  cursor: default;
}

.tech-chip:hover {
  background: var(--primary-subtle);
  border-color: var(--primary-border);
  color: var(--primary);
  transform: translateY(-1px);
}

.architecture-note {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: var(--r-lg, 10px);
  padding: 18px 22px;
  box-shadow: var(--shadow-sm);
}

.an-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #10B981;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.an-desc {
  font-size: 0.86rem;
  color: var(--t2);
  line-height: 1.75;
  font-family: var(--f-body, 'Cairo', sans-serif);
  margin-top: 4px;
}

/* Light Theme Overrides */
[data-theme="light"] .stack-card {
  background: #FFFFFF;
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

[data-theme="light"] .stack-cat-title {
  color: var(--t1);
}

[data-theme="light"] .stack-header {
  border-bottom-color: #E2E8F0;
}

[data-theme="light"] .tech-chip {
  background: #F8FAFC;
  border-color: #E2E8F0;
  color: #334155;
}

[data-theme="light"] .tech-chip:hover {
  background: #EFF6FF;
  border-color: #BFDBFE;
  color: #1D4ED8;
}

[data-theme="light"] .tech-count-badge {
  background: #EFF6FF;
  border-color: #BFDBFE;
  color: #2563EB;
}

[data-theme="light"] .architecture-note {
  background: #F0FDF4;
  border-color: #BBF7D0;
}

[data-theme="light"] .an-title {
  color: #059669;
}

[data-theme="light"] .an-desc {
  color: #334155;
}

@media (max-width: 960px) {
  .stack-grid { grid-template-columns: 1fr; }
}
</style>
