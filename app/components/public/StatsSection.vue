<template>
  <section class="section stats-section-wrap" id="stats" v-if="hasStatsContent">
    <div class="container">
      <div class="section-head text-center">
        <div class="eyebrow">{{ isRtl ? (store.settings.stats_section_eyebrow || t('stats.eyebrow')) : t('stats.eyebrow') }}</div>
        <h2 class="s-title">{{ isRtl ? (store.settings.stats_section_title || t('stats.title')) : t('stats.title') }} <span class="g-text">{{ isRtl ? 'تخدم الأهداف بكفاءة' : t('stats.titleHighlight') }}</span></h2>
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

            <div class="bio-quote-box" v-if="dev.bio || dev.tagline">
              <v-icon icon="mdi-format-quote-open" size="24" class="quote-icon" />
              <p class="bio-text">
                {{ isRtl ? (dev.bio || dev.tagline) : t('hero.tagline') }}
              </p>
            </div>

            <div class="bio-tags" v-if="bioTags.length">
              <span class="bio-tag" v-for="tag in bioTags" :key="tag">
                <span class="tag-bullet" />
                <span>{{ tag }}</span>
              </span>
            </div>

            <div class="bio-actions mt-5">
              <a v-if="store.resumeUrl" :href="store.resumeUrl" :download="cvFileName" target="_blank" class="btn btn-primary btn-sm">
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
        <div class="bento-card bento-skills anim d-4" v-if="allSkills.length">
          <div class="skills-inner">
            <div class="skills-head">
              <div class="skills-title-wrap">
                <div class="skills-icon-wrap">
                  <v-icon icon="mdi-lightning-bolt" size="20" color="#F59E0B" />
                </div>
                <div>
                  <h4 class="skills-title">{{ isRtl ? (store.settings.skills_box_title || t('stats.coreCompetencies')) : t('stats.coreCompetencies') }}</h4>
                  <span class="skills-subtitle">{{ isRtl ? 'تقييم الكفاءة ومستوى الاحتراف البرمجي لجميع الأدوات والتقنيات' : t('stats.competenciesDesc') }}</span>
                </div>
              </div>
              <span class="skills-badge">
                <v-icon icon="mdi-check-all" size="14" class="ml-1" />
                <span>{{ allSkills.length }} {{ t('stats.verifiedSkills') }}</span>
              </span>
            </div>

            <div class="skills-grid">
              <div class="skill-row" v-for="s in allSkills" :key="s.id || s.name">
                <div class="sr-info">
                  <div class="sr-name-wrap">
                    <v-icon v-if="s.icon" :icon="s.icon" size="17" :color="s.color || '#38BDF8'" class="ml-1 flex-shrink-0" />
                    <span v-else class="sr-bullet" :style="{ background: s.color || 'var(--primary)' }" />
                    <span class="sr-name">{{ s.name }}</span>
                  </div>
                  <span class="sr-pct" :style="{ color: s.color || '#38BDF8' }">{{ getPct(s) }}%</span>
                </div>
                <div class="sr-track">
                  <div
                    class="sr-fill"
                    :style="{
                      width: getPct(s) + '%',
                      background: s.color || 'var(--primary)'
                    }"
                  />
                </div>
              </div>
            </div>
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
    (allSkills.value && allSkills.value.length) ||
    (bioTags.value && bioTags.value.length)
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

const bioTags = computed(() => {
  if (store.skillCategories?.length) {
    const list = []
    store.skillCategories.forEach(c => {
      if (Array.isArray(c.skills) && c.skills.length) {
        c.skills.slice(0, 2).forEach(s => list.push(s.name))
      } else {
        list.push(c.name)
      }
    })
    return list.slice(0, 6)
  }
  return []
})

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
</style>
