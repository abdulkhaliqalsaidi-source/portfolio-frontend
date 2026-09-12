<template>
  <section class="section" id="stack" v-if="Object.keys(displayTechStack).length > 0">
    <div class="container">
      <div class="section-head">
        <div class="eyebrow">{{ store.settings.skills_section_eyebrow || 'المهارات والخبرات' }}</div>
        <h2 class="s-title">{{ store.settings.skills_section_title || 'المهارات والخبرات' }} <span class="g-text">التخصصية</span></h2>
        <p class="s-sub">{{ store.settings.skills_section_sub || 'المهارات والقدرات والمناهج المعتمدة في تنفيذ الأعمال وتحقيق الأهداف بأعلى مستويات الجودة.' }}</p>
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
              <span class="count-label">مهارات</span>
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

const store = usePortfolioStore()
useScrollReveal('.anim')

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
  return store.settings.architecture_note_title || 'معايير الجودة ومنهجية العمل المعتمدة:'
})

const archNoteDesc = computed(() => {
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
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  padding: clamp(22px, 2.8vw, 28px);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stack-card:hover {
  transform: translateY(-5px);
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.18);
}

.stack-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.stack-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.stack-cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.2);
  flex-shrink: 0;
}

.stack-cat-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.3;
  text-align: right;
}

.tech-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 20px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #38BDF8;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.count-label {
  font-size: 0.74rem;
  opacity: 0.85;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  align-content: flex-start;
  flex: 1;
}

.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 12px;
  font-size: 0.86rem;
  font-weight: 700;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #E2E8F0;
  font-family: var(--f-body, 'Cairo', sans-serif);
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}

.tech-chip:hover {
  background: rgba(59, 130, 246, 0.18);
  border-color: rgba(59, 130, 246, 0.45);
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.25);
}

.architecture-note {
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 18px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
}

.an-title {
  font-size: 0.94rem;
  font-weight: 800;
  color: #34D399;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.an-desc {
  font-size: 0.88rem;
  color: #CBD5E1;
  line-height: 1.8;
  font-family: var(--f-body, 'Cairo', sans-serif);
  margin-top: 4px;
}

/* Light Mode Overrides */
[data-theme="light"] .stack-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

[data-theme="light"] .stack-cat-title {
  color: #0F172A;
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
