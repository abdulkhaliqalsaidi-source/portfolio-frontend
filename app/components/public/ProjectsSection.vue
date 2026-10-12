<template>
  <section class="section" id="projects" v-if="store.projects.length">
    <div class="container">

      <!-- Section Header Matching emanjameel.pro & Screenshot -->
      <div class="em-proj-head text-center">
        <div class="em-title-wrap">
          <h2 class="em-title s-title">
            {{ isRtl ? (store.settings.projects_section_title || 'أعمال تصنع') : t('projects.title') }}
            <span class="g-text">{{ isRtl ? (store.settings.projects_section_title_span || 'فَرْقًا.') : t('projects.titleHighlight') }}</span>
          </h2>
          <div class="em-title-glow-line" />
        </div>
        <p class="em-sub">
          {{ isRtl ? (store.settings.projects_section_sub || 'اختر إحدى فئات الأعمال التالية لاستكشاف جميع المشاريع والتصاميم الخاصة بها') : t('projects.sub') }}
        </p>

        <!-- Put real work first; category browsing stays one click away. -->
        <div class="proj-view-modes">
          <button
            class="view-mode-pill"
            :class="{ active: viewMode === 'all' || selectedCategory !== null }"
            @click="viewMode = 'all'; selectedCategory = null"
          >
            <v-icon icon="mdi-view-grid-outline" size="16" aria-hidden="true" />
            <span>{{ t('projects.viewAllProjects') }}</span>
          </button>
          <button
            class="view-mode-pill"
            :class="{ active: viewMode === 'deck' && !selectedCategory }"
            @click="viewMode = 'deck'; selectedCategory = null"
          >
            <v-icon icon="mdi-cards-outline" size="16" aria-hidden="true" />
            <span>{{ t('projects.browseByCategory') }}</span>
          </button>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════
           VIEW 1: 3D STACKED CATEGORIES DECK (EXACT MATCH TO PICTURE)
           ══════════════════════════════════════════════════════════ -->
      <div v-if="viewMode === 'deck' && !selectedCategory" class="categories-deck-grid anim" :class="{ 'is-light-theme': !isDark }">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-deck-item"
          type="button"
          :aria-label="`${t('projects.browseByCategory')}: ${cat.displayName}`"
          @click="selectCategory(cat)"
        >
          <!-- 3D Stack Stage -->
          <div class="deck-stage">
            <!-- Back Card Left -->
            <div class="deck-card deck-card-back-left">
              <img v-if="cat.projects[1]?.image" :src="cat.projects[1].image" class="deck-bg-img" alt="" loading="lazy" />
              <div v-else class="deck-card-mock-wireframe">
                <div class="wireframe-header">
                  <span class="wf-dot" /><span class="wf-dot" /><span class="wf-dot" />
                </div>
                <div class="wf-lines">
                  <div class="wf-line short" />
                  <div class="wf-line med" />
                </div>
              </div>
            </div>

            <!-- Back Card Right -->
            <div class="deck-card deck-card-back-right">
              <img v-if="cat.projects[2]?.image" :src="cat.projects[2].image" class="deck-bg-img" alt="" loading="lazy" />
              <div v-else class="deck-card-mock-wireframe">
                <div class="wireframe-header">
                  <span class="wf-dot" /><span class="wf-dot" /><span class="wf-dot" />
                </div>
                <div class="wf-lines">
                  <div class="wf-line short" />
                  <div class="wf-line med" />
                </div>
              </div>
            </div>

            <!-- Main Front Card -->
            <div class="deck-card deck-card-front">
              <!-- Top bar: Project Name + Pill Badge -->
              <div class="deck-front-header">
                <span class="deck-front-title" :title="cat.topProject?.title">
                  {{ getCleanProjectTitle(cat.topProject?.title) }}
                </span>
                <div class="deck-count-badge">
                  <span class="deck-badge-dot" />
                  <span>{{ getCountLabel(cat.count) }}</span>
                </div>
              </div>

              <!-- Media Preview Frame -->
              <div class="deck-front-media">
                <img
                  v-if="cat.topProject?.image"
                  :src="cat.topProject.image"
                  :alt="cat.topProject?.title"
                  class="deck-front-img"
                  loading="lazy"
                  @error="handleImgFallback"
                />
                <div v-else class="fallback-media">
                  <v-icon icon="mdi-laptop" size="48" color="var(--primary)" />
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Meta & Action Link -->
          <h3 class="deck-cat-title">{{ cat.displayName }}</h3>
          <span class="deck-explore-btn">
            <span>{{ t('projects.exploreCategory') }}</span>
            <v-icon icon="mdi-arrow-left" size="16" class="arrow-icon" />
          </span>
        </button>
      </div>

      <!-- ══════════════════════════════════════════════════════════
           VIEW 2: CATEGORY / ALL PROJECTS SHOWCASE EXPLORER
           ══════════════════════════════════════════════════════════ -->
      <div v-else class="category-explorer-view anim">
        <!-- Navigation & Filter Bar -->
        <div class="explorer-nav-bar">
          <button class="back-to-deck-btn" @click="selectedCategory = null; viewMode = 'deck'">
            <v-icon icon="mdi-arrow-right" size="18" />
            <span>{{ t('projects.backToCategories') }}</span>
          </button>

          <!-- Category Quick Selector Tabs -->
          <div class="explorer-tabs">
            <button
              class="filter-tab"
              :class="{ active: !selectedCategory }"
              @click="selectedCategory = null; viewMode = 'all'"
            >
              {{ t('projects.viewAllProjects') }} ({{ projects.length }})
            </button>
            <button
              v-for="c in categories"
              :key="c.id"
              class="filter-tab"
              :class="{ active: selectedCategory === c.rawName }"
              @click="selectCategory(c)"
            >
              {{ c.displayName }} ({{ c.count }})
            </button>
          </div>
        </div>

        <!-- Selected Category Header Banner -->
        <div class="active-category-banner" v-if="currentSelectedCategory">
          <div class="acb-content">
            <span class="acb-badge"><span class="deck-badge-dot"/> {{ getCountLabel(currentSelectedCategory.count) }}</span>
            <h3 class="acb-title">{{ currentSelectedCategory.displayName }}</h3>
            <p class="acb-desc" v-if="currentSelectedCategory.arName && currentSelectedCategory.enName">
              {{ currentSelectedCategory.arName }}
            </p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="displayedProjects.length === 0" class="empty-projects text-center py-12">
          <v-icon icon="mdi-folder-open-outline" size="48" color="var(--t3)" class="mb-3" />
          <h4 style="color:var(--t2)">{{ t('projects.emptyCategory') }}</h4>
        </div>

        <!-- Projects Grid -->
        <div v-else class="editorial-grid">
          <article
            class="grid-proj-card anim"
            v-for="p in displayedProjects"
            :key="p.id"
            :style="{ '--proj-accent': p.accent_color || 'var(--primary)' }"
          >
            <div class="gpc-window">
              <div class="gpc-chrome">
                <span class="gpc-dot" /><span class="gpc-dot" /><span class="gpc-dot" />
                <span class="chrome-url">{{ p.demo_url || p.title }}</span>
              </div>
              <div class="gpc-img">
                <img :src="p.image" :alt="p.title" loading="lazy" @error="handleImgFallback" />
              </div>
            </div>

            <div class="gpc-body">
              <div class="gpc-tags" v-if="p.tags?.length">
                <span class="tag" v-for="t in p.tags.slice(0, 3)" :key="t">{{ t }}</span>
              </div>
              <h3 class="gpc-title">{{ p.title }}</h3>
              <p class="gpc-desc">{{ p.short_description || p.full_description }}</p>

              <div class="grid-quote-snippet mt-2" v-if="p.testimonial_quote">
                <v-icon icon="mdi-format-quote-open" size="13" color="var(--accent)" class="ml-1" />
                <span class="gq-text">"{{ p.testimonial_quote }}"</span>
              </div>

              <div class="gpc-footer">
                <button class="gpc-view-btn" @click="openCaseStudy(p)">
                  <span>{{ t('projects.readCaseStudy') }}</span>
                  <v-icon :icon="isRtl ? 'mdi-arrow-left' : 'mdi-arrow-right'" size="14" class="mr-1" aria-hidden="true" />
                </button>
                <div class="d-flex align-center gap-1">
                  <a v-if="p.github_url" :href="p.github_url" target="_blank" rel="noopener noreferrer" class="icon-action-btn" :aria-label="getLinkLabel(p.github_url)">
                    <v-icon :icon="getLinkIcon(p.github_url)" size="14" />
                  </a>
                  <a v-if="p.demo_url" :href="p.demo_url" target="_blank" rel="noopener noreferrer" class="icon-action-btn" :aria-label="isRtl ? 'معاينة حية' : 'Live preview'">
                    <v-icon icon="mdi-open-in-new" size="14" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

    </div>

    <!-- Interactive Case Study Drawer Modal -->
    <ClientOnly>
      <ProjectCaseStudyDrawer
        v-model="caseStudyOpen"
        :project="selectedProject"
        @contact="handleContactFromProject"
      />
    </ClientOnly>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'
import { useScrollReveal } from '~/composables/useScrollReveal'
import ProjectCaseStudyDrawer from '~/components/public/ProjectCaseStudyDrawer.vue'
import { useTheme } from '~/composables/useTheme'

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const router = useRouter()
const { isDark } = useTheme()

// View Modes: 'deck' (Default 3D Stacked Cards) or 'all'
const viewMode = ref('all')
const selectedCategory = ref(null)

// Interactive Case Study Drawer State
const caseStudyOpen = ref(false)
const selectedProject = ref(null)

function openCaseStudy(p) {
  if (!p) return
  selectedProject.value = p
  caseStudyOpen.value = true
}

function handleContactFromProject(p) {
  const el = document.getElementById('contact')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

useScrollReveal('.anim')

const activeFilter = ref('الكل')
const projects = computed(() => store.projects || [])

// Group projects by category for the 3D card deck
const categories = computed(() => {
  const map = new Map()

  projects.value.forEach(p => {
    const rawCat = (p.category && p.category.trim()) || (p.tags?.[0]) || 'تطوير البرمجيات'

    if (!map.has(rawCat)) {
      let arName = rawCat
      let enName = ''
      const match = rawCat.match(/^(.*?)\s*[\(\[]\s*(.*?)\s*[\)\]]$/)
      if (match) {
        arName = match[1].trim()
        enName = match[2].trim()
      }

      map.set(rawCat, {
        id: rawCat,
        rawName: rawCat,
        displayName: enName || arName,
        arName,
        enName,
        count: 0,
        projects: [],
        topProject: null
      })
    }

    const cat = map.get(rawCat)
    cat.projects.push(p)
    cat.count++
    if (!cat.topProject || p.is_featured) {
      cat.topProject = p
    }
  })

  return Array.from(map.values())
})

const currentSelectedCategory = computed(() => {
  if (!selectedCategory.value) return null
  return categories.value.find(c => c.rawName === selectedCategory.value) || null
})

const displayedProjects = computed(() => {
  if (selectedCategory.value) {
    return projects.value.filter(p => {
      const rawCat = (p.category && p.category.trim()) || (p.tags?.[0]) || 'تطوير البرمجيات'
      return rawCat === selectedCategory.value
    })
  }
  if (activeFilter.value && activeFilter.value !== 'الكل') {
    return projects.value.filter(p => Array.isArray(p.tags) && p.tags.includes(activeFilter.value))
  }
  return projects.value
})

function selectCategory(cat) {
  selectedCategory.value = cat.rawName
  viewMode.value = 'category'
  const el = document.getElementById('projects')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function getCleanProjectTitle(title) {
  if (!title) return 'مشروع متميز'
  const match = title.match(/\(([^)]+)\)$/)
  if (match) return match[1]
  if (title.length > 24) return title.slice(0, 22) + '...'
  return title
}

function getCountLabel(count) {
  if (count === 1) return '1 عمل'
  if (count === 2) return 'عملان'
  if (count >= 3 && count <= 10) return `${count} أعمال`
  return `${count} عمل`
}

function getLinkIcon(url) {
  if (!url) return 'mdi-open-in-new'
  const u = url.toLowerCase()
  if (u.includes('github.com')) return 'mdi-github'
  if (u.includes('behance.net')) return 'mdi-behance'
  if (u.includes('dribbble.com')) return 'mdi-dribbble'
  if (u.includes('figma.com')) return 'mdi-vector-selection'
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'mdi-youtube'
  return 'mdi-link-variant'
}

function getLinkLabel(url) {
  if (!url) return 'رابط خارجي'
  const u = url.toLowerCase()
  if (u.includes('github.com')) return 'المستودع'
  if (u.includes('behance.net')) return 'Behance'
  if (u.includes('dribbble.com')) return 'Dribbble'
  if (u.includes('figma.com')) return 'Figma'
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'فيديو'
  return 'الملف / الرابط'
}

function handleImgFallback(e) {
  e.target.style.opacity = '0.7'
  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%23111827"/><circle cx="400" cy="225" r="40" fill="%2338BDF8" opacity="0.2"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="%2364748B" font-family="sans-serif" font-size="16">Showcase</text></svg>'
}
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════════
   SECTION HEADER (MATCHING emanjameel.pro & SCREENSHOT)
   ══════════════════════════════════════════════════════════════ */
.em-proj-head {
  text-align: center;
  margin-bottom: clamp(32px, 5vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.em-title-wrap {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.em-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(2.2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--t1) !important;
  letter-spacing: normal !important;
  margin: 0;
  padding: 0 1rem;
  text-shadow: none;
}

.em-title-glow-line {
  width: 140px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  border-radius: 999px;
  margin-top: 10px;
  box-shadow: 0 0 12px color-mix(in srgb, var(--primary) 35%, transparent);
}

.em-sub {
  color: var(--t2);
  font-size: 0.95rem;
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.7;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* View Mode Pills */
.proj-view-modes {
  display: inline-flex;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 4px;
  border-radius: 999px;
  margin-top: 20px;
  box-shadow: var(--shadow-sm);
}

.view-mode-pill {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--f-body, 'Cairo', sans-serif);
  color: var(--t2);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
}

.view-mode-pill:hover {
  color: var(--primary);
}

.view-mode-pill.active {
  background: var(--primary-subtle);
  color: var(--primary);
  border: 1px solid var(--primary-border);
}

/* ══════════════════════════════════════════════════════════════
   VIEW 1: 3D STACKED CATEGORIES DECK (EXACT MATCH TO PICTURE)
   ══════════════════════════════════════════════════════════════ */
.categories-deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(28px, 4vw, 44px);
  max-width: 1220px;
  margin: 0 auto;
  padding: 12px 0 24px;
}

.category-deck-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 0;
  padding: 0;
  width: 100%;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: inherit;
  text-decoration: none;
  transition: transform 0.35s ease;
}

.category-deck-item:focus-visible,
.view-mode-pill:focus-visible,
.filter-tab:focus-visible,
.gpc-view-btn:focus-visible,
.icon-action-btn:focus-visible,
.back-to-deck-btn:focus-visible {
  outline: 3px solid var(--border-focus);
  outline-offset: 3px;
}

/* Stage container with 3D perspective */
.deck-stage {
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 250px;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Base Card styling */
.deck-card {
  position: absolute;
  border-radius: 20px;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s ease, border-color 0.45s ease;
  will-change: transform;
  overflow: hidden;
}

/* Back-left card: fanned out rotated to the left in dark obsidian glass */
.deck-card-back-left {
  z-index: 1;
  width: 95%;
  height: 96%;
  transform: rotate(-8deg) translateY(-8px) translateX(-6px) scale(0.96);
  transform-origin: bottom center;
  background: linear-gradient(155deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  opacity: 0.95;
}

/* Back-right card: fanned out rotated to the right in dark obsidian glass */
.deck-card-back-right {
  z-index: 2;
  width: 95%;
  height: 96%;
  transform: rotate(8deg) translateY(-8px) translateX(6px) scale(0.96);
  transform-origin: bottom center;
  background: linear-gradient(155deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7);
  opacity: 0.95;
}

.deck-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.35;
}

.deck-card-mock-wireframe {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.wireframe-header {
  display: flex;
  gap: 5px;
  margin-bottom: 12px;
}

.wf-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.5);
}

.wf-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-line {
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
}

.wf-line.short { width: 40%; }
.wf-line.med { width: 70%; }

/* Front card: Deep obsidian slate chassis matching dark theme */
.deck-card-front {
  z-index: 3;
  width: 94%;
  height: 96%;
  transform: translateY(0);
  background: linear-gradient(180deg, #171E2D 0%, #0F1422 100%);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  display: flex;
  flex-direction: column;
  padding: 12px 14px 12px;
}

/* Hover effect on category item fans out the cards */
.category-deck-item:hover .deck-card-front {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.85), 0 0 25px rgba(56, 189, 248, 0.25);
  border-color: rgba(56, 189, 248, 0.55);
}

.category-deck-item:hover .deck-card-back-left {
  transform: rotate(-13deg) translateY(-14px) translateX(-18px) scale(0.98);
  opacity: 1;
  border-color: rgba(56, 189, 248, 0.3);
}

.category-deck-item:hover .deck-card-back-right {
  transform: rotate(13deg) translateY(-14px) translateX(18px) scale(0.98);
  opacity: 1;
  border-color: rgba(56, 189, 248, 0.3);
}

/* Front card Header: Title in Solid Pure White + Translucent Pill Badge */
.deck-front-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  padding: 0 4px;
  z-index: 2;
}

.deck-front-title {
  font-family: var(--f-display, 'Alexandria', 'Tajawal', sans-serif);
  font-size: 0.98rem;
  font-weight: 800;
  color: #FFFFFF !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 62%;
  letter-spacing: normal !important;
}

.deck-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #F8FAFC;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  font-family: var(--f-body, 'Cairo', sans-serif);
  letter-spacing: normal !important;
}

.deck-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38BDF8;
  box-shadow: 0 0 6px rgba(56, 189, 248, 0.8);
}

/* Front card Media Area: Sleek Dark Container */
.deck-front-media {
  flex: 1;
  width: 100%;
  border-radius: 13px;
  overflow: hidden;
  background: #0B0E17;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
}

.deck-front-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.5s ease;
}

.category-deck-item:hover .deck-front-img {
  transform: scale(1.05);
}

.fallback-media {
  width: 100%;
  height: 100%;
  background: #0F172A;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Below Deck: Title & Explore Link */
.deck-cat-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.25rem;
  font-weight: 800;
  color: #FFFFFF !important;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 6px;
  letter-spacing: normal !important;
  transition: color 0.25s ease;
}

.category-deck-item:hover .deck-cat-title {
  color: #38BDF8 !important;
}

.deck-explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #E2E8F0;
  font-size: 0.86rem;
  font-weight: 600;
  font-family: var(--f-body, 'Cairo', sans-serif);
  transition: all 0.25s ease;
}

.deck-explore-btn .arrow-icon {
  transition: transform 0.25s ease;
}

.category-deck-item:hover .deck-explore-btn {
  color: #38BDF8;
}

.category-deck-item:hover .deck-explore-btn .arrow-icon {
  transform: translateX(-5px);
}

/* ══════════════════════════════════════════════════════════════
   VIEW 2: CATEGORY SHOWCASE EXPLORER
   ══════════════════════════════════════════════════════════════ */
.category-explorer-view {
  width: 100%;
}

.explorer-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.back-to-deck-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.7);
  color: #F8FAFC;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.84rem;
  font-weight: 700;
  font-family: var(--f-body, 'Cairo', sans-serif);
  cursor: pointer;
  transition: all 0.25s ease;
}

.back-to-deck-btn:hover {
  background: var(--primary-subtle);
  border-color: var(--primary-border);
  color: var(--primary);
  transform: translateX(4px);
}

.explorer-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  min-height: 44px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--f-body, 'Cairo', sans-serif);
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-2);
  color: var(--t2);
  transition: all 0.25s ease;
}

.filter-tab:hover {
  color: var(--t1);
  border-color: var(--border-h);
}

.filter-tab.active {
  background: var(--primary-subtle);
  border-color: var(--primary-border);
  color: var(--primary);
  font-weight: 700;
}

.active-category-banner {
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-2) 100%);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.acb-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--primary-subtle);
  color: var(--primary);
  border: 1px solid var(--primary-border);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 6px;
}

.acb-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--t1);
  margin: 0;
  letter-spacing: normal !important;
}

.acb-desc {
  color: var(--t2);
  font-size: 0.88rem;
  margin: 4px 0 0;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.empty-projects {
  background: var(--bg-2);
  border: 1px dashed var(--border);
  border-radius: var(--r-md);
}

/* ══════════════════════════════════════════
   EDITORIAL GRID
   ══════════════════════════════════════════ */
.editorial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(18px, 2.5vw, 26px);
}

.grid-proj-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg, 12px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  transition: transform 0.24s ease, border-color 0.24s ease, box-shadow 0.24s ease;
}

.grid-proj-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--proj-accent, var(--primary)) 12%, transparent) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 0.24s ease;
  pointer-events: none;
  z-index: 1;
}

.grid-proj-card:hover {
  border-color: var(--proj-accent, var(--primary));
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.grid-proj-card:hover::before {
  opacity: 1;
}

.gpc-window {
  position: relative;
  z-index: 2;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}

.gpc-chrome {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-3);
  border-bottom: 1px solid var(--border);
}

.gpc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--t3);
}

.chrome-url {
  font-size: 0.72rem;
  color: var(--t3);
  font-family: var(--f-mono);
  direction: ltr;
  margin-right: auto;
}

.gpc-img {
  height: 200px;
  overflow: hidden;
}

.gpc-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.32s ease;
}

.grid-proj-card:hover .gpc-img img {
  transform: scale(1.04);
}

@media (prefers-reduced-motion: reduce) {
  .category-deck-item,
  .deck-card,
  .grid-proj-card,
  .gpc-img img,
  .grid-proj-card::before {
    transition: none !important;
  }

  .category-deck-item:hover,
  .grid-proj-card:hover {
    transform: none;
  }
}

.gpc-body {
  position: relative;
  z-index: 2;
  padding: clamp(18px, 2.5vw, 24px);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.gpc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.gpc-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.12rem;
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 8px;
  letter-spacing: normal !important;
}

.gpc-desc {
  font-size: 0.86rem;
  color: var(--t2);
  line-height: 1.7;
  margin-bottom: 18px;
  font-family: var(--f-body, 'Cairo', sans-serif);
  flex: 1;
}

.grid-quote-snippet {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--t2);
  background: var(--bg-subtle);
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.gq-text {
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gpc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.gpc-view-btn {
  min-height: 44px;
  color: var(--primary);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--f-body);
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s ease;
}

.gpc-view-btn:hover {
  color: var(--primary-hover);
}

.icon-action-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--r-xs);
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--t3);
  text-decoration: none;
  transition: all var(--t-fast);
}

.icon-action-btn:hover {
  color: var(--t1);
  border-color: var(--border-h);
  background: var(--bg-2);
}

/* ══════════════════════════════════════════
   LIGHT THEME OVERRIDES
   ══════════════════════════════════════════ */
[data-theme="light"] .em-title,
html[data-theme="light"] .em-title {
  color: var(--t1) !important;
  text-shadow: none !important;
}

[data-theme="light"] .em-sub,
html[data-theme="light"] .em-sub {
  color: var(--t2) !important;
}

[data-theme="light"] .deck-cat-title,
html[data-theme="light"] .deck-cat-title {
  color: var(--t1) !important;
}

[data-theme="light"] .deck-explore-btn,
html[data-theme="light"] .deck-explore-btn {
  color: var(--t2) !important;
}

[data-theme="light"] .deck-explore-btn:hover,
html[data-theme="light"] .deck-explore-btn:hover {
  color: var(--primary) !important;
}

[data-theme="light"] .grid-proj-card,
html[data-theme="light"] .grid-proj-card {
  background: var(--bg-card) !important;
  border-color: var(--border) !important;
  box-shadow: var(--shadow-sm) !important;
}

[data-theme="light"] .gpc-window,
html[data-theme="light"] .gpc-window {
  background: var(--bg-2) !important;
  border-color: var(--border) !important;
}

[data-theme="light"] .gpc-chrome,
html[data-theme="light"] .gpc-chrome {
  background: var(--bg-3) !important;
  border-bottom-color: var(--border) !important;
}

[data-theme="light"] .gpc-title,
html[data-theme="light"] .gpc-title {
  color: var(--t1) !important;
}

[data-theme="light"] .gpc-desc,
html[data-theme="light"] .gpc-desc {
  color: var(--t2) !important;
}

[data-theme="light"] .tag,
html[data-theme="light"] .tag {
  background: var(--bg-3) !important;
  border-color: var(--border) !important;
  color: var(--t2) !important;
}

[data-theme="light"] .gpc-footer,
html[data-theme="light"] .gpc-footer {
  border-top-color: var(--border) !important;
}

[data-theme="light"] .icon-action-btn,
html[data-theme="light"] .icon-action-btn {
  background: var(--bg-2) !important;
  border-color: var(--border) !important;
  color: var(--t2) !important;
}

[data-theme="light"] .filter-tab,
html[data-theme="light"] .filter-tab {
  background: var(--bg-2) !important;
  border-color: var(--border) !important;
  color: var(--t2) !important;
}

[data-theme="light"] .filter-tab:hover,
html[data-theme="light"] .filter-tab:hover {
  background: var(--bg-3) !important;
  color: var(--t1) !important;
}

[data-theme="light"] .filter-tab.active,
html[data-theme="light"] .filter-tab.active {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  color: var(--on-primary) !important;
}

@media (max-width: 960px) {
  .categories-deck-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
  }
}

@media (max-width: 600px) {
  .editorial-grid { grid-template-columns: 1fr; }
  .deck-stage { max-width: 320px; height: 230px; }
  .categories-deck-grid { grid-template-columns: 1fr; }
}

/* ══════════════════════════════════════════════════════════════
   LIGHT THEME GUARANTEED ADAPTATION (VUE REF + ATTRIBUTES)
   ══════════════════════════════════════════════════════════════ */
.is-light-theme .deck-card-front,
:deep([data-theme="light"]) .deck-card-front,
:deep(html[data-theme="light"]) .deck-card-front,
:deep(.v-theme--light) .deck-card-front {
  background: var(--bg-card) !important;
  border-color: var(--border) !important;
  box-shadow: var(--shadow-sm) !important;
}

.is-light-theme .deck-front-title,
:deep([data-theme="light"]) .deck-front-title,
:deep(html[data-theme="light"]) .deck-front-title,
:deep(.v-theme--light) .deck-front-title {
  color: var(--t1) !important;
}

.is-light-theme .deck-count-badge,
:deep([data-theme="light"]) .deck-count-badge,
:deep(html[data-theme="light"]) .deck-count-badge,
:deep(.v-theme--light) .deck-count-badge {
  background: var(--bg-3) !important;
  border-color: var(--border) !important;
  color: var(--t1) !important;
}

.is-light-theme .deck-badge-dot,
:deep([data-theme="light"]) .deck-badge-dot,
:deep(html[data-theme="light"]) .deck-badge-dot,
:deep(.v-theme--light) .deck-badge-dot {
  background: var(--primary) !important;
  box-shadow: 0 0 6px color-mix(in srgb, var(--primary) 40%, transparent) !important;
}

.is-light-theme .deck-front-media,
:deep([data-theme="light"]) .deck-front-media,
:deep(html[data-theme="light"]) .deck-front-media,
:deep(.v-theme--light) .deck-front-media {
  background: var(--bg-2) !important;
  border-color: var(--border) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04) !important;
}

.is-light-theme .deck-card-back-left,
.is-light-theme .deck-card-back-right,
:deep([data-theme="light"]) .deck-card-back-left,
:deep([data-theme="light"]) .deck-card-back-right,
:deep(html[data-theme="light"]) .deck-card-back-left,
:deep(html[data-theme="light"]) .deck-card-back-right,
:deep(.v-theme--light) .deck-card-back-left,
:deep(.v-theme--light) .deck-card-back-right {
  background: linear-gradient(155deg, var(--bg-card) 0%, var(--bg-3) 100%) !important;
  border-color: var(--border) !important;
  box-shadow: var(--shadow-sm) !important;
}

.is-light-theme .deck-card-mock-wireframe,
:deep([data-theme="light"]) .deck-card-mock-wireframe,
:deep(html[data-theme="light"]) .deck-card-mock-wireframe,
:deep(.v-theme--light) .deck-card-mock-wireframe {
  background: radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--primary) 7%, transparent) 0%, var(--bg-2) 100%) !important;
}

.is-light-theme .wf-dot,
:deep([data-theme="light"]) .wf-dot,
:deep(html[data-theme="light"]) .wf-dot,
:deep(.v-theme--light) .wf-dot {
  background: color-mix(in srgb, var(--primary) 45%, transparent) !important;
}

.is-light-theme .wf-line,
:deep([data-theme="light"]) .wf-line,
:deep(html[data-theme="light"]) .wf-line,
:deep(.v-theme--light) .wf-line {
  background: var(--border) !important;
}

.is-light-theme .deck-cat-title,
:deep([data-theme="light"]) .deck-cat-title,
:deep(html[data-theme="light"]) .deck-cat-title,
:deep(.v-theme--light) .deck-cat-title {
  color: var(--t1) !important;
}

.is-light-theme .deck-explore-btn,
:deep([data-theme="light"]) .deck-explore-btn,
:deep(html[data-theme="light"]) .deck-explore-btn,
:deep(.v-theme--light) .deck-explore-btn {
  color: var(--primary) !important;
}

.is-light-theme .deck-explore-btn .arrow-icon,
:deep([data-theme="light"]) .deck-explore-btn .arrow-icon,
:deep(html[data-theme="light"]) .deck-explore-btn .arrow-icon,
:deep(.v-theme--light) .deck-explore-btn .arrow-icon {
  color: var(--primary) !important;
}

</style>
