<template>
  <section class="section stats-section-wrap" id="stats" v-if="hasStatsContent">
    <div class="container">
      <div class="section-head text-center">
        <div class="eyebrow">{{ isRtl ? (store.settings.stats_section_eyebrow || t('stats.eyebrow')) : t('stats.eyebrow') }}</div>
        <div class="title-with-beam">
          <h2 class="s-title">{{ isRtl ? (store.settings.stats_section_title || t('stats.title')) : t('stats.title') }} <span class="g-text">{{ isRtl ? (store.settings.stats_section_title_span || t('stats.titleHighlight')) : t('stats.titleHighlight') }}</span></h2>
          <div class="title-glow-beam" />
        </div>
        <p class="s-sub">{{ isRtl ? (store.settings.stats_section_sub || t('stats.sub')) : t('stats.sub') }}</p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="bento-grid">

        <!-- Bento 1: Philosophy & Bio Card (Spans 2 cols on desktop) -->
        <div class="bento-card bento-bio anim">
          <div class="bio-inner">
            <div class="bio-header">
              <div class="bio-avatar-wrap">
                <img v-if="dev.avatar" :src="dev.avatar" :alt="dev.name || dev.full_name" class="bio-avatar-img" />
                <v-icon v-else icon="mdi-account" size="28" color="var(--primary)" />
                <span class="bio-status-dot" v-if="dev.available_for_work" />
              </div>
              <div class="bio-title-wrap">
                <h3 class="bio-name">{{ dev.name || dev.full_name }}</h3>
                <div class="bio-role">
                  <v-icon icon="mdi-code-tags" size="14" class="ml-1" />
                  <span>{{ dev.title || t('stats.role') }}</span>
                </div>
              </div>
            </div>

            <div class="bio-quote-box" v-if="(dev.bio || dev.tagline) && dev.bio !== dev.tagline">
              <v-icon icon="mdi-format-quote-open" size="24" class="quote-icon" />
              <p class="bio-text">
                {{ isRtl ? (dev.bio || dev.tagline) : t('hero.tagline') }}
              </p>
            </div>

            <div class="bio-actions mt-5">
              <a v-if="store.resumeUrl" :href="store.resumeUrl" :download="cvFileName" @click.prevent="store.downloadResume(cvFileName)" class="btn btn-primary btn-sm">
                <v-icon icon="mdi-file-pdf-box" size="18" color="#EF4444" class="ml-1" />
                <span>{{ t('stats.downloadCv') }}</span>
              </a>
              <a href="#contact" class="btn btn-ghost btn-sm" @click.prevent="go('#contact')">
                <v-icon icon="mdi-send-outline" size="15" class="ml-1" />
                <span>{{ t('stats.requestConsultation') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Bento Numerical Metrics (Stat cards) -->
        <div
          v-for="(s, i) in statCards"
          :key="s.id || s.label"
          class="bento-card bento-stat anim"
          :class="`d-${(i % 4) + 1}`"
          :style="{ '--card-accent': s.color || '#3B82F6' }"
        >
          <div class="stat-inner">
            <div class="stat-top">
              <div class="stat-icon-wrap">
                <v-icon :icon="s.icon || 'mdi-star-outline'" size="20" />
              </div>
              <span class="stat-badge">
                <span class="badge-point" />
                <span>{{ t('stats.verifiedAchievement') }}</span>
              </span>
            </div>
            
            <div class="stat-number-wrap">
              <div class="stat-number">
                <CountUp :end="s.value" :suffix="s.suffix || ''" />
              </div>
              <div class="stat-label">{{ s.label }}</div>
            </div>

            <div class="stat-desc" v-if="s.description">{{ s.description }}</div>
          </div>
        </div>

        <!-- Bento Skills: Core Competencies (Spans full width) -->
        <div id="stack" class="bento-card bento-skills anim d-4" v-if="allSkills.length">
          <div class="skills-inner">
            <div class="skills-head">
              <div class="skills-heading">
                <span class="skills-kicker">{{ isRtl ? 'الخبرات التقنية' : 'CAPABILITIES' }}</span>
                <h4 class="skills-title">{{ isRtl ? (store.settings.skills_box_title || t('stats.coreCompetencies')) : t('stats.coreCompetencies') }}</h4>
                <p class="skills-subtitle">{{ isRtl ? 'مجموعة من الأدوات والتقنيات التي أستخدمها لبناء منتجات رقمية متكاملة.' : t('stats.competenciesDesc') }}</p>
              </div>
              <div class="skills-count">
                <v-icon icon="mdi-layers-triple-outline" size="18" />
                <span>{{ allSkills.length }}</span>
                <small>{{ isRtl ? 'مهارة' : 'skills' }}</small>
              </div>
            </div>

            <div class="skills-filters" role="tablist" :aria-label="isRtl ? 'تصفية المهارات حسب المجال' : 'Filter skills by category'">
              <button
                v-for="category in skillCategoriesForDisplay"
                :key="category.key"
                type="button"
                class="skills-filter"
                :class="{ 'is-active': activeSkillCategory === category.key }"
                role="tab"
                :aria-selected="activeSkillCategory === category.key"
                @click="activeSkillCategory = category.key; showAllSkills = false"
              >
                <bdi dir="auto">{{ category.name }}</bdi>
              </button>
            </div>

            <div class="skills-groups">
              <section
                v-for="category in displayedSkillCategories"
                :key="category.key"
                class="skill-category"
                :style="{ '--category-accent': category.color }"
              >
                <header class="skill-category-head">
                  <div class="skill-category-title-wrap">
                    <span class="skill-category-icon">
                      <v-icon :icon="category.icon || 'mdi-shape-outline'" size="19" />
                    </span>
                    <div>
                      <h5 class="skill-category-title"><bdi dir="auto">{{ category.name }}</bdi></h5>
                      <p class="skill-category-caption">
                        {{ isRtl ? 'تقنيات وأدوات المجال' : 'Technologies and tools' }}
                      </p>
                    </div>
                  </div>
                  <span class="skill-category-count">{{ category.skills.length }} {{ isRtl ? 'مهارات' : 'skills' }}</span>
                </header>

                <div class="skill-chips">
                  <div class="skill-chip" v-for="s in getVisibleCategorySkills(category)" :key="s.id || `${category.key}-${s.name}`">
                    <v-icon v-if="s.icon" :icon="s.icon" size="15" :style="{ color: s.color || category.color }" />
                    <span class="skill-chip-name">{{ s.name }}</span>
                    <span class="skill-chip-score">{{ getPct(s) }}%</span>
                  </div>
                </div>
                <p class="skill-category-foot">{{ isRtl ? 'مستوى الإتقان لكل مهارة' : 'Proficiency by skill' }}</p>
              </section>
            </div>

            <button v-if="hasHiddenCategorySkills" class="skills-expand" type="button" @click="showAllSkills = !showAllSkills">
              <span>{{ showAllSkills ? (isRtl ? 'إظهار أقل' : 'Show fewer') : (isRtl ? 'عرض كل المهارات' : 'View all skills') }}</span>
              <v-icon :icon="showAllSkills ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="18" />
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'
import CountUp from './CountUp.vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const dev = computed(() => store.developer || {})
const showAllSkills = ref(false)
const skillsPerCategoryPreview = 4
const activeSkillCategory = ref('all')

const cvFileName = computed(() => {
  const name = dev.value?.name || dev.value?.full_name || 'Resume'
  return `${name.replace(/\s+/g, '_')}_CV.pdf`
})
const animated = ref(true)

useScrollReveal('.anim')

function getPct(s) {
  const val = s?.proficiency_percentage ?? s?.proficiency ?? s?.pct ?? 85
  return Math.min(100, Math.max(15, Number(val) || 85))
}

const hasStatsContent = computed(() => {
  return !!(
    dev.value?.bio ||
    dev.value?.tagline ||
    (store.stats && store.stats.length) ||
    (allSkills.value && allSkills.value.length)
  )
})

const statCards = computed(() => {
  return (store.stats || [])
    .filter((s) => s && s.is_active !== false)
    .map((s) => ({
      ...s,
      icon: s.icon || 'mdi-rocket-launch',
      color: s.color || '#3B82F6',
      description: s.description || ''
    }))
})

const allSkills = computed(() => {
  const skillsList = []
  if (store.skillCategories?.length) {
    store.skillCategories.forEach(cat => {
      if (Array.isArray(cat.skills)) {
        cat.skills.filter(s => s.is_visible !== false).forEach(s => skillsList.push(s))
      }
    })
  } else if (store.techStack && Object.keys(store.techStack).length) {
    Object.values(store.techStack).forEach(skillList => {
      if (Array.isArray(skillList)) {
        skillList.filter(s => s.is_visible !== false).forEach(s => skillsList.push(s))
      }
    })
  }

  return skillsList.sort((a, b) => (b.proficiency_percentage || 0) - (a.proficiency_percentage || 0))
})

const skillGroups = computed(() => {
  if (store.skillCategories?.length) {
    return store.skillCategories
      .map((category, index) => ({
        key: String(category.id || category.name || `category-${index}`),
        name: localizeCategoryName(category.name || (isRtl.value ? 'مهارات أخرى' : 'Other skills')),
        icon: category.icon,
        color: category.color || ['#42B883', '#4C87D8', '#C28A4A', '#8A79C8'][index % 4],
        skills: (Array.isArray(category.skills) ? category.skills : []).filter(skill => skill?.is_visible !== false)
      }))
      .filter(category => category.skills.length)
  }

  return Object.entries(store.techStack || {})
    .map(([name, skills], index) => ({
      key: name,
      name: localizeCategoryName(name),
      icon: '',
      color: ['#42B883', '#4C87D8', '#C28A4A', '#8A79C8'][index % 4],
      skills: (Array.isArray(skills) ? skills : []).filter(skill => skill?.is_visible !== false)
    }))
    .filter(category => category.skills.length)
})

function localizeCategoryName(name) {
  const value = String(name || '').trim()
  if (isRtl.value) {
    if (/\p{Script=Arabic}/u.test(value)) return value
    if (/front.?end/i.test(value) || /الواجهات الأمامية/.test(value)) return 'الواجهات الأمامية'
    if (/back.?end|database/i.test(value) || /الواجهات الخلفية|قواعد البيانات/.test(value)) return 'الخلفية والبيانات'
    if (/network|system|server/i.test(value) || /الشبكات|السيرفرات/.test(value)) return 'الشبكات والأنظمة'
    if (/mobile|cms|design|tool/i.test(value) || /التطبيقات|المحتوى|التصميم/.test(value)) return 'التطبيقات والأدوات'
    if (/language/i.test(value) || /اللغات/.test(value)) return 'اللغات'
    if (/\p{Script=Arabic}/u.test(value)) return value.replace(/\s*\([^)]*\)\s*$/, '').trim()
  } else {
    const englishLabel = value.match(/\(([^)]*)\)/)?.[1]
    if (englishLabel) return englishLabel
  }
  return value
}

const skillCategoriesForDisplay = computed(() => [
  { key: 'all', name: isRtl.value ? 'الكل' : 'All skills' },
  ...skillGroups.value.map(({ key, name }) => ({ key, name }))
])

const selectedSkillGroups = computed(() => activeSkillCategory.value === 'all'
  ? skillGroups.value
  : skillGroups.value.filter(category => category.key === activeSkillCategory.value))

const displayedSkillCategories = computed(() => selectedSkillGroups.value)

const hiddenSkillCount = computed(() => selectedSkillGroups.value.reduce(
  (total, category) => total + Math.max(0, category.skills.length - skillsPerCategoryPreview),
  0
))

const hasHiddenCategorySkills = computed(() => hiddenSkillCount.value > 0)

function getVisibleCategorySkills(category) {
  return showAllSkills.value ? category.skills : category.skills.slice(0, skillsPerCategoryPreview)
}

const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

onMounted(async () => {
  await nextTick()
  animated.value = true
})
</script>

<style scoped>
.stats-section-wrap {
  position: relative;
  overflow: hidden;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(16px, 2vw, 24px);
}

/* Base Bento Card */
.bento-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl, 12px);
  padding: clamp(20px, 2.5vw, 26px);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-base), border-color var(--t-base), box-shadow var(--t-base);
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-h);
  box-shadow: var(--shadow-lg);
}

.bento-bio:hover,
.bento-skills:hover {
  border-color: var(--primary);
  box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.65), 0 0 30px color-mix(in srgb, var(--primary) 28%, transparent);
}

/* Bio Card */
.bento-bio {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.bio-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bio-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.bio-avatar-wrap {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: var(--r-md, 8px);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  flex-shrink: 0;
}

.bio-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.bio-status-dot {
  position: absolute;
  bottom: 2px;
  left: 2px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10B981;
  border: 2px solid var(--bg-card);
}

.bio-name {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--t1);
  line-height: 1.2;
}

.bio-role {
  font-size: 0.8rem;
  color: var(--primary);
  font-family: var(--f-mono, 'Tajawal', sans-serif);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  margin-top: 3px;
}

.bio-quote-box {
  position: relative;
  background: var(--bg-subtle);
  border-right: 3px solid var(--primary);
  border-radius: var(--r-md, 8px);
  padding: 14px 16px;
  margin-bottom: 16px;
}

.quote-icon {
  color: var(--primary);
  opacity: 0.5;
  margin-bottom: 4px;
}

.bio-text {
  font-size: 0.9rem;
  color: var(--t2);
  line-height: 1.75;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.bio-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.bio-tag {
  font-size: 0.76rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--r-xs, 4px);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
  font-family: var(--f-body, 'Cairo', sans-serif);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all var(--t-fast);
}

.bio-tag:hover {
  background: var(--primary-subtle);
  border-color: var(--primary-border);
  color: var(--primary);
}

.tag-bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--primary);
}

.bio-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Stat Cards */
.bento-stat {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: start;
  min-height: 184px;
  max-height: 210px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.35s ease, box-shadow 0.35s ease;
}

.bento-stat::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--card-accent, #3B82F6) 20%, transparent) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  z-index: 1;
}

.bento-stat:hover {
  transform: translateY(-6px);
  border-color: var(--card-accent, #3B82F6);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 32px color-mix(in srgb, var(--card-accent, #3B82F6) 35%, transparent);
}

.bento-stat:hover::before {
  opacity: 1;
}

.stat-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--r-sm, 10px);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--card-accent, var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.bento-stat:hover .stat-icon-wrap {
  transform: scale(1.1) rotate(6deg);
  border-color: var(--card-accent, #3B82F6);
  box-shadow: 0 0 20px color-mix(in srgb, var(--card-accent, #3B82F6) 45%, transparent);
}

.stat-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  font-family: var(--f-body, 'Cairo', sans-serif);
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  padding: 3px 8px;
  border-radius: var(--r-xs, 4px);
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.badge-point {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--primary);
}

.stat-number-wrap {
  margin-top: auto;
  margin-bottom: 6px;
}

.stat-number {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(2.2rem, 3vw, 2.8rem);
  font-weight: 900;
  color: var(--t1);
  line-height: 1;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--t2);
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.stat-desc {
  font-size: 0.78rem;
  color: var(--t3);
  font-family: var(--f-body, 'Cairo', sans-serif);
  line-height: 1.5;
  margin-top: 4px;
}

/* Skills Bento Card */
.bento-skills {
  grid-column: span 4;
}

.skills-inner {
  position: relative;
  z-index: 2;
}

.skills-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.skills-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skills-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: var(--r-sm, 6px);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.skills-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 2px;
}

.skills-subtitle {
  font-size: 0.78rem;
  color: var(--t3);
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.skills-badge {
  font-size: 0.74rem;
  font-weight: 700;
  color: #10B981;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 4px 10px;
  border-radius: var(--r-xs, 4px);
  display: inline-flex;
  align-items: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 28px;
}

.skill-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sr-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.sr-name-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.sr-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sr-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--t1);
  font-family: var(--f-body, 'Cairo', sans-serif);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sr-pct {
  font-size: 0.82rem;
  font-weight: 700;
  font-family: var(--f-mono);
  color: var(--primary);
  flex-shrink: 0;
  white-space: nowrap;
}

.sr-track {
  height: 6px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--r-xs, 3px);
  overflow: hidden;
  position: relative;
}

.sr-fill {
  height: 100%;
  border-radius: var(--r-xs, 3px);
  position: relative;
  min-width: 8px;
  transition: width 1s ease;
}

/* Light Theme Overrides */
[data-theme="light"] .bento-card {
  background: #FFFFFF;
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

[data-theme="light"] .bio-name,
[data-theme="light"] .stat-number,
[data-theme="light"] .skills-title,
[data-theme="light"] .sr-name {
  color: #0F172A !important;
}

[data-theme="light"] .bio-quote-box {
  background: #F8FAFC;
  border-color: var(--primary);
}

[data-theme="light"] .bio-text {
  color: #334155;
}

[data-theme="light"] .bio-tag {
  background: #EFF6FF;
  border-color: #BFDBFE;
  color: #1D4ED8;
}

[data-theme="light"] .stat-label {
  color: #475569;
}

[data-theme="light"] .stat-desc,
[data-theme="light"] .skills-subtitle {
  color: #64748B;
}

[data-theme="light"] .sr-track {
  background: #E2E8F0;
  border-color: #CBD5E1;
}

[data-theme="light"] .skills-head {
  border-bottom-color: #E2E8F0;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bento-bio {
    grid-column: span 2;
  }
  .bento-skills {
    grid-column: span 2;
  }
}

@media (max-width: 680px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-bio {
    grid-column: span 1;
  }
  .bento-stat {
    grid-column: span 1;
  }
  .bento-skills {
    grid-column: span 1;
  }
  .skills-grid {
    grid-template-columns: 1fr;
  }
  .skills-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* Modern capabilities panel */
.bento-skills {
  padding: clamp(22px, 3.5vw, 42px);
  border-radius: 26px;
  background:
    radial-gradient(ellipse at 92% 0%, color-mix(in srgb, var(--primary) 9%, transparent), transparent 38%),
    var(--bg-card);
  box-shadow: 0 22px 60px rgba(0, 0, 0, .12);
}
.bento-skills:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
  box-shadow: 0 24px 60px rgba(0, 0, 0, .18);
}
.skills-head {
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 26px;
  padding-bottom: 22px;
  border-bottom-color: color-mix(in srgb, var(--border) 72%, transparent);
}
.skills-heading { min-width: 0; }
.skills-kicker {
  display: inline-flex;
  margin-bottom: 8px;
  color: var(--primary);
  font-size: .68rem;
  line-height: 1;
  font-weight: 800;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.skills-title { font-size: clamp(1.25rem, 2vw, 1.65rem); margin-bottom: 6px; }
.skills-subtitle { display: block; max-width: 62ch; line-height: 1.75; font-size: .84rem; }
.skills-count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  padding: 9px 13px;
  color: var(--t1);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.skills-count .v-icon { color: var(--primary); }
.skills-count small { color: var(--t3); font-size: .7rem; font-weight: 600; }
.skills-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.skill-tile {
  min-width: 0;
  padding: 16px 17px 14px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--bg-subtle) 76%, transparent);
  transition: transform .2s ease, border-color .2s ease, background-color .2s ease, box-shadow .2s ease;
}
.skill-tile:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--skill-accent) 50%, var(--border));
  background: color-mix(in srgb, var(--skill-accent) 6%, var(--bg-subtle));
  box-shadow: 0 12px 24px rgba(0, 0, 0, .12);
}
.skill-tile-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.skill-icon-wrap {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: var(--skill-accent);
  background: color-mix(in srgb, var(--skill-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--skill-accent) 22%, transparent);
  font-weight: 800;
}
.skill-score { color: var(--skill-accent); font-size: 1rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.skill-score span { margin-inline-start: 1px; font-size: .72rem; }
.skill-tile-name {
  min-height: 2.7em;
  display: flex;
  align-items: center;
  margin: 9px 0 11px;
  color: var(--t1);
  font-size: .88rem;
  font-weight: 700;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.skill-tile .sr-track { height: 4px; border: 0; background: color-mix(in srgb, var(--t1) 10%, transparent); }
.skill-tile .sr-fill { border-radius: 999px; min-width: 3px; box-shadow: 0 0 12px color-mix(in srgb, var(--skill-accent) 30%, transparent); }
.skills-expand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  margin: 20px auto 0;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--t2);
  background: transparent;
  font: 700 .82rem var(--f-body, 'Cairo', sans-serif);
  cursor: pointer;
  transition: color .2s ease, border-color .2s ease, background .2s ease;
}
.skills-expand:hover { color: var(--primary); border-color: var(--primary); background: color-mix(in srgb, var(--primary) 7%, transparent); }
[data-theme="light"] .bento-skills { background: radial-gradient(ellipse at 92% 0%, color-mix(in srgb, var(--primary) 9%, transparent), transparent 38%), var(--bg-card); }
[data-theme="light"] .skill-tile { background: var(--bg-card); border-color: var(--border); }
[data-theme="light"] .skill-tile:hover { background: color-mix(in srgb, var(--skill-accent) 6%, var(--bg-card)); }

@media (max-width: 1024px) {
  .skills-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 680px) {
  .bento-skills { padding: 22px 17px; border-radius: 21px; }
  .skills-head { flex-direction: row; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
  .skills-count { gap: 6px; padding: 7px 9px; font-size: .86rem; }
  .skills-count .v-icon { display: none; }
  .skills-grid { grid-template-columns: 1fr; gap: 9px; }
  .skill-tile { padding: 12px 14px; }
  .skill-tile-top { flex-direction: row-reverse; justify-content: flex-end; }
  .skill-tile-name { min-height: 0; flex: 1; margin: 0 0 0 12px; }
  .skill-tile .sr-track { margin-top: 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .skill-tile, .skills-expand { transition: none; }
  .skill-tile:hover { transform: none; }
}

.skills-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: -3px 0 20px;
}

.skills-filter {
  min-height: 44px;
  padding: 7px 15px;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--t2);
  background: transparent;
  font: 700 .78rem var(--f-body, 'Cairo', sans-serif);
  cursor: pointer;
  transition: color .18s ease, border-color .18s ease, background-color .18s ease;
}

.skills-filter:hover,
.skills-filter.is-active {
  color: var(--primary);
  border-color: var(--primary-border);
  background: var(--primary-subtle);
}

.skills-filter:focus-visible,
.skills-expand:focus-visible {
  outline: 3px solid var(--border-focus);
  outline-offset: 3px;
}

.skills-groups {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 16px;
}

.skill-category {
  min-width: 0;
  padding: clamp(17px, 2vw, 23px);
  border: 1px solid var(--border);
  border-radius: 17px;
  background: color-mix(in srgb, var(--bg-subtle) 74%, transparent);
}

.skill-category-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 17px;
}

.skill-category-title-wrap {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
}

.skill-category-icon {
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  color: var(--category-accent);
  background: color-mix(in srgb, var(--category-accent) 12%, transparent);
}

.skill-category-title {
  color: var(--t1);
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: .98rem;
  font-weight: 800;
  line-height: 1.45;
}

.skill-category-caption {
  margin-top: 2px;
  color: var(--t3);
  font-size: .7rem;
  line-height: 1.5;
}

.skill-category-count {
  flex: 0 0 auto;
  color: var(--category-accent);
  font-size: .68rem;
  font-weight: 800;
  white-space: nowrap;
}

.skill-chips {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  gap: 9px;
  min-height: 84px;
  padding: 15px 0 17px;
  border-bottom: 1px solid var(--border);
}

.skill-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-height: 38px;
  gap: 8px;
  padding: 7px 10px;
  border: 1px solid color-mix(in srgb, var(--category-accent) 22%, var(--border));
  border-radius: 11px;
  color: var(--t1);
  background: color-mix(in srgb, var(--category-accent) 5%, var(--bg-card));
}

.skill-chip-name {
  overflow: hidden;
  font-size: .73rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skill-chip-score {
  padding-inline-start: 8px;
  border-inline-start: 1px solid var(--border);
  color: var(--category-accent);
  font-family: var(--f-mono, monospace);
  font-size: .68rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.skill-category-foot {
  margin-top: 13px;
  color: var(--t3);
  font-size: .72rem;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .skills-groups { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 680px) {
  .skills-filters { flex-wrap: nowrap; overflow-x: auto; padding: 3px 2px 8px; scrollbar-width: thin; }
  .skills-filter { flex: 0 0 auto; }
  .skills-groups { grid-template-columns: 1fr; gap: 11px; }
  .skill-category { padding: 17px; }
}

@media (prefers-reduced-motion: reduce) {
  .skills-filter { transition: none; }
}
</style>
