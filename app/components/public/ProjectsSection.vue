<template>
  <section class="section" id="projects" v-if="store.projects.length">
    <div class="container">

      <!-- Section Header -->
      <div class="proj-head">
        <div>
          <div class="eyebrow">{{ isRtl ? (store.settings.projects_section_eyebrow || t('projects.eyebrow')) : t('projects.eyebrow') }}</div>
          <h2 class="s-title">{{ isRtl ? (store.settings.projects_section_title || t('projects.title')) : t('projects.title') }} <span class="g-text">{{ isRtl ? 'وقصص النجاح' : t('projects.titleHighlight') }}</span></h2>
          <p class="s-sub">{{ isRtl ? (store.settings.projects_section_sub || t('projects.sub')) : t('projects.sub') }}</p>
        </div>
        <a href="#contact" class="btn btn-ghost" @click.prevent="go('#contact')">
          <span>{{ isRtl ? 'طلب تنفيذ عمل جديد' : 'Request a Project' }}</span>
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path d="M2 11L11 2M11 2H5M11 2V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </a>
      </div>

      <!-- Filter tabs -->
      <div class="filter-tabs-wrapper" v-if="filterTags.length > 1">
        <div class="filter-tabs">
          <button
            v-for="tag in filterTags" :key="tag"
            class="filter-tab" :class="{ active: activeFilter === tag }"
            @click="activeFilter = tag"
          >{{ tag }}</button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="empty-projects text-center py-12">
        <v-icon icon="mdi-folder-open-outline" size="48" color="var(--t3)" class="mb-3" />
        <h4 style="color:var(--t2)">لا توجد أعمال مضافة حالياً في هذا التصنيف</h4>
      </div>

      <div v-else class="showcase-stream">

        <!-- ══════════════════════════════════════════
             LAYOUT 1: PANORAMIC FEATURED HERO SYSTEM
             ══════════════════════════════════════════ -->
        <div
          v-if="featuredProject"
          class="hero-case-study anim"
          :style="{ '--proj-accent': featuredProject.accent_color || '#3B82F6' }"
          @click="openCaseStudy(featuredProject)"
        >
          <div class="hcs-preview">
            <div class="window-chrome">
              <div class="chrome-dots">
                <span class="c-dot red" />
                <span class="c-dot yellow" />
                <span class="c-dot green" />
              </div>
              <span class="chrome-url">{{ featuredProject.demo_url || featuredProject.title }}</span>
              <span class="chrome-status"><span class="c-live-dot"/> تم الإنجاز والإطلاق</span>
            </div>
            <div class="hcs-img-wrap">
              <img :src="featuredProject.image" :alt="featuredProject.title" loading="lazy" @error="handleImgFallback" />
            </div>
          </div>

          <div class="hcs-body">
            <div class="hcs-meta-bar">
              <div class="hcs-badge" :style="{ color: featuredProject.accent_color || '#38BDF8', borderColor: `color-mix(in srgb, ${featuredProject.accent_color || '#3B82F6'} 30%, transparent)`, background: `color-mix(in srgb, ${featuredProject.accent_color || '#3B82F6'} 12%, transparent)` }">
                <v-icon icon="mdi-star-four-points" size="14" :color="featuredProject.accent_color || 'var(--primary)'" class="ml-1" />
                <span>عمل مميز • Featured Work</span>
              </div>
              <div class="hcs-year" v-if="featuredProject.year">
                {{ featuredProject.year }}
              </div>
            </div>

            <h3 class="hcs-title">{{ featuredProject.title }}</h3>
            <p class="hcs-desc">{{ featuredProject.short_description || featuredProject.full_description }}</p>

            <!-- Case Study Specs Grid -->
            <div class="hcs-specs-grid" v-if="featuredProject.role || featuredProject.category">
              <div class="hcs-spec-item" v-if="featuredProject.role">
                <span class="hcs-spec-label">الدور المهني</span>
                <span class="hcs-spec-val">{{ featuredProject.role }}</span>
              </div>
              <div class="hcs-spec-item" v-if="featuredProject.category">
                <span class="hcs-spec-label">نطاق العمل</span>
                <span class="hcs-spec-val">{{ featuredProject.category }}</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="hcs-tags" v-if="featuredProject.tags?.length">
              <span class="tag" v-for="t in featuredProject.tags" :key="t">{{ t }}</span>
            </div>

            <!-- Client Quote Snippet -->
            <div class="hcs-quote-snippet mt-3" v-if="featuredProject.testimonial_quote" @click.stop="openCaseStudy(featuredProject)">
              <v-icon icon="mdi-format-quote-open" size="16" color="#F59E0B" class="ml-1" />
              <span class="hcs-quote-text">"{{ featuredProject.testimonial_quote }}"</span>
              <span class="hcs-quote-author" v-if="featuredProject.client_name">— {{ featuredProject.client_name }}</span>
            </div>

            <!-- Action CTAs -->
            <div class="hcs-actions" @click.stop>
              <button class="btn btn-primary" @click="openCaseStudy(featuredProject)">
                <span>قراءة دراسة الحالة التفاعلية</span>
                <v-icon icon="mdi-arrow-left" size="15" class="mr-1" />
              </button>
              <a v-if="featuredProject.demo_url" :href="featuredProject.demo_url" target="_blank" class="btn btn-ghost">
                <v-icon icon="mdi-open-in-new" size="15" class="ml-1" />
                <span>معاينة العمل</span>
              </a>
              <a v-if="featuredProject.github_url" :href="featuredProject.github_url" target="_blank" class="btn btn-ghost">
                <v-icon :icon="getLinkIcon(featuredProject.github_url)" size="15" class="ml-1" />
                <span>{{ getLinkLabel(featuredProject.github_url) }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════
             LAYOUT 2: HORIZONTAL SPLIT CASE STUDIES
             ══════════════════════════════════════════ -->
        <div class="horizontal-projects" v-if="splitProjects.length">
          <div
            v-for="(p, i) in splitProjects" :key="p.id"
            class="split-card anim" :class="[`d-${i+1}`, { 'reverse-split': i % 2 === 1 }]"
            :style="{ '--proj-accent': p.accent_color || '#3B82F6' }"
            @click="openCaseStudy(p)"
          >
            <div class="split-preview">
              <div class="window-chrome">
                <div class="chrome-dots">
                  <span class="c-dot red" /><span class="c-dot yellow" /><span class="c-dot green" />
                </div>
                <span class="chrome-url">{{ p.demo_url || p.title }}</span>
              </div>
              <div class="split-img-box">
                <img :src="p.image" :alt="p.title" loading="lazy" @error="handleImgFallback" />
              </div>
            </div>

            <div class="split-content">
              <div class="d-flex align-center justify-between gap-2 mb-2">
                <span class="tag-primary">{{ p.category || 'مشروع متخصص' }}</span>
                <span class="split-year font-mono text-caption" v-if="p.year">{{ p.year }}</span>
              </div>

              <h3 class="split-title">{{ p.title }}</h3>
              <p class="split-desc">{{ p.short_description || p.full_description }}</p>

              <div class="split-tags" v-if="p.tags?.length">
                <span class="tag" v-for="t in p.tags.slice(0, 4)" :key="t">{{ t }}</span>
              </div>

              <!-- Client Quote Snippet -->
              <div class="split-quote-snippet mt-2" v-if="p.testimonial_quote" @click.stop="openCaseStudy(p)">
                <v-icon icon="mdi-format-quote-open" size="14" color="#F59E0B" class="ml-1" />
                <span class="sq-text">"{{ p.testimonial_quote }}"</span>
              </div>

              <div class="split-actions" @click.stop>
                <button class="btn btn-ghost btn-sm" @click="openCaseStudy(p)">
                  <span>دراسة الحالة</span>
                  <v-icon icon="mdi-arrow-left" size="14" class="mr-1" />
                </button>
                <a v-if="p.demo_url" :href="p.demo_url" target="_blank" class="icon-action-btn" title="معاينة العمل">
                  <v-icon icon="mdi-open-in-new" size="14" />
                </a>
                <a v-if="p.github_url" :href="p.github_url" target="_blank" class="icon-action-btn" :title="getLinkLabel(p.github_url)">
                  <v-icon :icon="getLinkIcon(p.github_url)" size="14" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════
             LAYOUT 3: EDITORIAL GRID FOR OTHER PROJECTS
             ══════════════════════════════════════════ -->
        <div class="editorial-grid" v-if="gridProjects.length">
          <div
            class="grid-proj-card anim" :class="`d-${i+1}`"
            v-for="(p, i) in gridProjects" :key="p.id"
            :style="{ '--proj-accent': p.accent_color || '#3B82F6' }"
            @click="openCaseStudy(p)"
          >
            <div class="gpc-window">
              <div class="gpc-chrome">
                <span class="gpc-dot" /><span class="gpc-dot" /><span class="gpc-dot" />
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
              <p class="gpc-desc">{{ p.short_description || p.description }}</p>

              <!-- Client Quote Snippet -->
              <div class="grid-quote-snippet mt-2" v-if="p.testimonial_quote" @click.stop="openCaseStudy(p)">
                <v-icon icon="mdi-format-quote-open" size="13" color="#F59E0B" class="ml-1" />
                <span class="gq-text">"{{ p.testimonial_quote }}"</span>
              </div>

              <div class="gpc-footer" @click.stop>
                <button class="gpc-view-btn" @click="openCaseStudy(p)">
                  <span>دراسة الحالة التفاعلية</span>
                  <v-icon icon="mdi-arrow-left" size="14" class="mr-1" />
                </button>
                <div class="d-flex align-center gap-1">
                  <a v-if="p.github_url" :href="p.github_url" target="_blank" class="icon-action-btn" title="الكود">
                    <v-icon icon="mdi-github" size="14" />
                  </a>
                  <a v-if="p.demo_url" :href="p.demo_url" target="_blank" class="icon-action-btn" title="معاينة حية">
                    <v-icon icon="mdi-open-in-new" size="14" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- ══════════════════════════════════════════════════════════════════
         INTERACTIVE CASE STUDY DRAWER MODAL
         ══════════════════════════════════════════════════════════════════ -->
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

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const router = useRouter()

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

const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
const go2 = (p) => {
  if (typeof p === 'object' && p !== null) {
    openCaseStudy(p)
  } else {
    const found = projects.value.find(item => item.slug === p || item.id === p)
    if (found) openCaseStudy(found)
    else router.push(`/projects/${p}`)
  }
}

useScrollReveal('.anim')

const activeFilter = ref('الكل')

const projects = computed(() => store.projects || [])

const filterTags = computed(() => {
  const tagsSet = new Set()
  projects.value.forEach(p => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach(t => tagsSet.add(t))
    }
  })
  return ['الكل', ...Array.from(tagsSet)]
})

const filteredProjects = computed(() => {
  if (activeFilter.value === 'الكل') return projects.value
  return projects.value.filter(p => Array.isArray(p.tags) && p.tags.includes(activeFilter.value))
})

const featuredProject = computed(() => {
  if (!filteredProjects.value.length) return null
  return filteredProjects.value.find(p => p.is_featured) || filteredProjects.value[0]
})

const otherProjects = computed(() => {
  if (!featuredProject.value) return []
  return filteredProjects.value.filter(p => p.id !== featuredProject.value.id)
})

// Layout division: first 2 go to Split Horizontal, remaining go to Editorial Grid
const splitProjects = computed(() => otherProjects.value.slice(0, 2))
const gridProjects = computed(() => otherProjects.value.slice(2))

function getLinkIcon(url) {
  if (!url) return 'mdi-open-in-new'
  const u = url.toLowerCase()
  if (u.includes('github.com')) return 'mdi-github'
  if (u.includes('behance.net')) return 'mdi-behance'
  if (u.includes('dribbble.com')) return 'mdi-dribbble'
  if (u.includes('figma.com')) return 'mdi-vector-selection'
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'mdi-youtube'
  if (u.includes('drive.google.com') || u.includes('dropbox.com')) return 'mdi-cloud-download-outline'
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
  // If the image cannot be found, provide a sleek dark gradient placeholder
  e.target.style.opacity = '0.7'
  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%23111827"/><circle cx="400" cy="225" r="40" fill="%233B82F6" opacity="0.2"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="%2364748B" font-family="sans-serif" font-size="16">Showcase</text></svg>'
}
</script>

<style scoped>
.proj-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--sp-5);
  flex-wrap: wrap;
  gap: var(--sp-4);
}

/* Filter tabs */
.filter-tabs-wrapper {
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: var(--sp-6);
  -webkit-overflow-scrolling: touch;
}
.filter-tabs {
  display: flex;
  gap: 6px;
  min-width: max-content;
}
.filter-tab {
  padding: 6px 14px;
  border-radius: var(--r-xs);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--f-body);
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--bg-2);
  color: var(--t3);
  transition: all var(--t-fast);
  white-space: nowrap;
}
.filter-tab:hover { color: var(--t1); border-color: var(--border-h); background: var(--bg-subtle); }
.filter-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.showcase-stream {
  display: flex;
  flex-direction: column;
  gap: var(--sp-7);
}

/* Window Chrome */
.window-chrome {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border);
}
.chrome-dots { display: flex; gap: 5px; }
.c-dot { width: 9px; height: 9px; border-radius: 50%; }
.c-dot.red { background: #EF4444; }
.c-dot.yellow { background: #F59E0B; }
.c-dot.green { background: #10B981; }
.chrome-url {
  font-size: 0.72rem;
  color: var(--t3);
  font-family: var(--f-mono);
  direction: ltr;
}
.chrome-status {
  margin-right: auto;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--f-body);
}
.c-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse-dot 2s infinite;
}

/* ══════════════════════════════════════════
   LAYOUT 1: HERO CASE STUDY
   ══════════════════════════════════════════ */
.hero-case-study {
  position: relative;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl, 16px);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.4s ease, box-shadow 0.4s ease;
}

.hero-case-study::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 35% 0%, color-mix(in srgb, var(--proj-accent, #3B82F6) 18%, transparent) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.hero-case-study:hover {
  border-color: var(--proj-accent, #3B82F6);
  transform: translateY(-6px);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px color-mix(in srgb, var(--proj-accent, #3B82F6) 35%, transparent);
}

.hero-case-study:hover::before {
  opacity: 1;
}

.hcs-preview {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  background: #0B1120;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}
.hcs-img-wrap {
  height: 100%;
  min-height: 320px;
  max-height: 480px;
  overflow: hidden;
}
.hcs-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.hero-case-study:hover .hcs-img-wrap img { transform: scale(1.04); }

.hcs-body {
  position: relative;
  z-index: 2;
  padding: clamp(24px, 4vw, 40px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hcs-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-3);
  flex-wrap: wrap;
  gap: 8px;
}
.hcs-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  padding: 4px 10px;
  border-radius: var(--r-xs, 4px);
  font-family: var(--f-body, 'Cairo', sans-serif);
}
.hcs-year {
  font-size: 0.78rem;
  font-weight: 700;
  color: #94A3B8;
  font-family: var(--f-mono, 'Tajawal', sans-serif);
}

.hcs-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  font-weight: 900;
  color: #FFFFFF;
  margin-bottom: 12px;
  line-height: 1.3;
}
.hcs-desc {
  font-size: 0.92rem;
  color: #94A3B8;
  line-height: 1.8;
  margin-bottom: 20px;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.hcs-specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 14px 18px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--r-md, 8px);
  margin-bottom: 20px;
}
.hcs-spec-item { display: flex; flex-direction: column; }
.hcs-spec-label { font-size: 0.72rem; color: #64748B; font-family: var(--f-body, 'Cairo', sans-serif); margin-bottom: 2px; }
.hcs-spec-val { font-size: 0.86rem; font-weight: 800; color: #E2E8F0; font-family: var(--f-body, 'Cairo', sans-serif); }

.hcs-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.hcs-actions { display: flex; gap: 12px; flex-wrap: wrap; }

/* Quote Snippets in Cards */
.hcs-quote-snippet {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  font-size: 0.82rem;
  color: #F8FAFC;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 100%;
  margin-bottom: 18px;
}

.hcs-quote-snippet:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
}

.hcs-quote-text {
  font-style: italic;
  font-weight: 600;
}

.hcs-quote-author {
  color: #F59E0B;
  font-weight: 700;
}

.split-quote-snippet,
.grid-quote-snippet {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  font-size: 0.76rem;
  color: #F8FAFC;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 100%;
}

.split-quote-snippet:hover,
.grid-quote-snippet:hover {
  background: rgba(245, 158, 11, 0.14);
}

.sq-text, .gq-text {
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
}

/* ══════════════════════════════════════════
   LAYOUT 2: HORIZONTAL SPLIT CARDS
   ══════════════════════════════════════════ */
.horizontal-projects {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.split-card {
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-xl, 14px);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.35s ease, box-shadow 0.35s ease;
}
.split-card.reverse-split {
  grid-template-columns: 1fr 1.1fr;
}
.split-card.reverse-split .split-preview {
  order: 2;
  border-left: none;
  border-right: 1px solid var(--border);
}

.split-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 35% 0%, color-mix(in srgb, var(--proj-accent, #3B82F6) 16%, transparent) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  z-index: 1;
}

.split-card:hover {
  border-color: var(--proj-accent, #3B82F6);
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px color-mix(in srgb, var(--proj-accent, #3B82F6) 30%, transparent);
}

.split-card:hover::before {
  opacity: 1;
}

.split-preview {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  background: var(--bg-subtle);
  border-left: 1px solid var(--border);
}
.split-img-box {
  height: 100%;
  min-height: 240px;
  max-height: 340px;
  overflow: hidden;
}
.split-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.split-card:hover .split-img-box img { transform: scale(1.02); }

.split-content {
  position: relative;
  z-index: 2;
  padding: clamp(20px, 3vw, 30px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tag-primary {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--primary);
  font-family: var(--f-body, 'Cairo', sans-serif);
}
.split-year { color: var(--t3); font-weight: 600; }

.split-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.15rem, 1.6vw, 1.4rem);
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 8px;
  line-height: 1.3;
}
.split-desc {
  font-size: 0.88rem;
  color: var(--t2);
  line-height: 1.75;
  margin-bottom: 16px;
  font-family: var(--f-body, 'Cairo', sans-serif);
}
.split-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.split-actions { display: flex; align-items: center; gap: 10px; }

/* ══════════════════════════════════════════
   LAYOUT 3: EDITORIAL GRID
   ══════════════════════════════════════════ */
.editorial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(18px, 2.5vw, 26px);
}
.grid-proj-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg, 12px);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.35s ease, box-shadow 0.35s ease;
}

.grid-proj-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--proj-accent, #3B82F6) 16%, transparent) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  z-index: 1;
}

.grid-proj-card:hover {
  border-color: var(--proj-accent, #3B82F6);
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.65), 0 0 28px color-mix(in srgb, var(--proj-accent, #3B82F6) 30%, transparent);
}

.grid-proj-card:hover::before {
  opacity: 1;
}

.gpc-window { position: relative; z-index: 2; background: #0B1120; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.gpc-chrome { display: flex; gap: 6px; padding: 8px 14px; background: rgba(30, 41, 59, 0.5); border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.gpc-dot { width: 8px; height: 8px; border-radius: 50%; background: #475569; }

.gpc-img { height: 200px; overflow: hidden; }
.gpc-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
.grid-proj-card:hover .gpc-img img { transform: scale(1.04); }

.gpc-body { position: relative; z-index: 2; padding: clamp(18px, 2.5vw, 24px); display: flex; flex-direction: column; flex: 1; }
.gpc-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.gpc-title { font-family: var(--f-display, 'Tajawal', sans-serif); font-size: 1.12rem; font-weight: 800; color: #FFFFFF; margin-bottom: 8px; }
.gpc-desc  { font-size: 0.86rem; color: #94A3B8; line-height: 1.7; margin-bottom: 18px; font-family: var(--f-body, 'Cairo', sans-serif); flex: 1; }

.gpc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.gpc-view-btn {
  color: var(--primary);
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--f-body);
}
.gpc-view-btn:hover { color: var(--primary-hover); }

.icon-action-btn {
  width: 30px;
  height: 30px;
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

.empty-projects {
  background: var(--bg-2);
  border: 1px dashed var(--border);
  border-radius: var(--r-md);
}

/* Light Theme Overrides */
[data-theme="light"] .hero-case-study,
html[data-theme="light"] .hero-case-study,
[data-theme="light"] .split-card,
html[data-theme="light"] .split-card,
[data-theme="light"] .grid-proj-card,
html[data-theme="light"] .grid-proj-card {
  background: #FFFFFF !important;
  border-color: rgba(226, 232, 240, 0.9) !important;
  box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9) inset !important;
}

[data-theme="light"] .hcs-preview,
html[data-theme="light"] .hcs-preview,
[data-theme="light"] .split-preview,
html[data-theme="light"] .split-preview,
[data-theme="light"] .gpc-window,
html[data-theme="light"] .gpc-window {
  background: #F8FAFC !important;
  border-color: #E2E8F0 !important;
}

[data-theme="light"] .window-chrome,
html[data-theme="light"] .window-chrome,
[data-theme="light"] .gpc-chrome,
html[data-theme="light"] .gpc-chrome {
  background: #F1F5F9 !important;
  border-bottom-color: #E2E8F0 !important;
}

[data-theme="light"] .chrome-url,
html[data-theme="light"] .chrome-url {
  color: #64748B !important;
}

[data-theme="light"] .hcs-title,
html[data-theme="light"] .hcs-title,
[data-theme="light"] .split-title,
html[data-theme="light"] .split-title,
[data-theme="light"] .gpc-title,
html[data-theme="light"] .gpc-title {
  color: #0F172A !important;
}

[data-theme="light"] .hcs-desc,
html[data-theme="light"] .hcs-desc,
[data-theme="light"] .split-desc,
html[data-theme="light"] .split-desc,
[data-theme="light"] .gpc-desc,
html[data-theme="light"] .gpc-desc {
  color: #475569 !important;
}

[data-theme="light"] .hcs-specs-grid,
html[data-theme="light"] .hcs-specs-grid {
  background: #F8FAFC !important;
  border-color: #E2E8F0 !important;
}

[data-theme="light"] .hcs-spec-label,
html[data-theme="light"] .hcs-spec-label {
  color: #64748B !important;
}

[data-theme="light"] .hcs-spec-val,
html[data-theme="light"] .hcs-spec-val {
  color: #0F172A !important;
}

[data-theme="light"] .hcs-badge,
html[data-theme="light"] .hcs-badge {
  background: #EFF6FF !important;
  border-color: #BFDBFE !important;
  color: #1D4ED8 !important;
}

[data-theme="light"] .hcs-year,
html[data-theme="light"] .hcs-year,
[data-theme="light"] .split-year,
html[data-theme="light"] .split-year {
  color: #64748B !important;
}

[data-theme="light"] .tag,
html[data-theme="light"] .tag,
[data-theme="light"] .tag-xs,
html[data-theme="light"] .tag-xs {
  background: #F1F5F9 !important;
  border-color: #E2E8F0 !important;
  color: #334155 !important;
}

[data-theme="light"] .gpc-footer,
html[data-theme="light"] .gpc-footer {
  border-top-color: #E2E8F0 !important;
}

[data-theme="light"] .icon-action-btn,
html[data-theme="light"] .icon-action-btn {
  background: #F8FAFC !important;
  border-color: #E2E8F0 !important;
  color: #64748B !important;
}

[data-theme="light"] .filter-tab,
html[data-theme="light"] .filter-tab {
  background: #F8FAFC !important;
  border-color: #E2E8F0 !important;
  color: #475569 !important;
}

[data-theme="light"] .filter-tab:hover,
html[data-theme="light"] .filter-tab:hover {
  background: #F1F5F9 !important;
  color: #0F172A !important;
}

[data-theme="light"] .filter-tab.active,
html[data-theme="light"] .filter-tab.active {
  background: #2563EB !important;
  border-color: #2563EB !important;
  color: #FFFFFF !important;
}

@media (max-width: 960px) {
  .hero-case-study { grid-template-columns: 1fr; }
  .hcs-preview { border-left: none; border-bottom: 1px solid var(--border); }
  .split-card, .split-card.reverse-split { grid-template-columns: 1fr; }
  .split-card.reverse-split .split-preview { order: 0; border-right: none; border-bottom: 1px solid var(--border); }
  .split-preview { border-left: none; border-bottom: 1px solid var(--border); }
}

@media (max-width: 600px) {
  .hcs-specs-grid { grid-template-columns: 1fr; }
  .editorial-grid { grid-template-columns: 1fr; }
}
</style>
