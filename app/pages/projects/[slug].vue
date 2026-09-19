<template>
  <div class="project-detail-page py-12" dir="rtl" v-if="project">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumb-nav mb-6" aria-label="مسار التصفح">
        <NuxtLink to="/" class="breadcrumb-link">الرئيسية</NuxtLink>
        <span class="breadcrumb-sep">/</span>
        <NuxtLink to="/projects" class="breadcrumb-link">المشاريع</NuxtLink>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ project.title }}</span>
      </nav>

      <!-- Case Study Hero Header -->
      <header class="cs-hero mb-12">
        <div class="cs-badges mb-3 d-flex align-center gap-2 flex-wrap">
          <span class="badge-cat">{{ project.category || 'دراسة حالة هندسية' }}</span>
          <span class="badge-year" v-if="project.year">{{ project.year }}</span>
          <span class="badge-role" v-if="project.role">{{ project.role }}</span>
        </div>

        <h1 class="cs-title mb-4">{{ project.title }}</h1>
        <p class="cs-lead mb-6">{{ project.short_description }}</p>

        <!-- CTA Action Buttons -->
        <div class="cs-actions d-flex align-center gap-3 flex-wrap">
          <a
            v-if="project.demo_url"
            :href="project.demo_url"
            target="_blank"
            class="btn btn-primary"
            rel="noopener noreferrer"
          >
            <v-icon icon="mdi-open-in-new" size="18" class="ml-1" />
            <span>معاينة حية للمشروع</span>
          </a>
          <a
            v-if="project.github_url"
            :href="project.github_url"
            target="_blank"
            class="btn btn-secondary"
            rel="noopener noreferrer"
          >
            <v-icon icon="mdi-github" size="18" class="ml-1" />
            <span>مستودع الكود</span>
          </a>
        </div>
      </header>

      <!-- Main Project Visual Showcase -->
      <section class="cs-showcase mb-12">
        <div class="showcase-frame">
          <img
            v-if="project.image"
            :src="project.image"
            :alt="project.title"
            fetchpriority="high"
            class="showcase-img"
          />
        </div>
      </section>

      <!-- Key Impact Metrics Strip -->
      <section class="cs-metrics-strip mb-12" v-if="project.metrics?.length">
        <h2 class="sr-only">النتائج والقياس الفعلي</h2>
        <div class="metrics-grid">
          <div class="metric-box" v-for="(m, idx) in project.metrics" :key="idx">
            <span class="metric-val text-primary">{{ m.value || m.val || m }}</span>
            <span class="metric-label">{{ m.label || m.name || 'مؤشر أداء' }}</span>
          </div>
        </div>
      </section>

      <!-- Editorial Case Study Content Columns -->
      <div class="cs-content-grid">
        <!-- Main Column -->
        <main class="cs-main-col">
          <!-- The Problem -->
          <article class="cs-section mb-10" v-if="project.problem">
            <h2 class="section-h2 mb-4 d-flex align-center gap-2">
              <v-icon icon="mdi-alert-circle-outline" color="error" size="24" />
              <span>المشكلة والتحدي الهندسي</span>
            </h2>
            <div class="section-body" v-html="formatParagraphs(project.problem)"></div>

            <div class="before-notes-box mt-4" v-if="project.before_notes?.length">
              <h3 class="notes-title mb-2">تحديات الوضع السابق:</h3>
              <ul class="notes-list">
                <li v-for="(note, i) in project.before_notes" :key="i">{{ note }}</li>
              </ul>
            </div>
          </article>

          <!-- The Architecture & Solution -->
          <article class="cs-section mb-10" v-if="project.architecture">
            <h2 class="section-h2 mb-4 d-flex align-center gap-2">
              <v-icon icon="mdi-layers-triple-outline" color="primary" size="24" />
              <span>المعمارية والحل الهندسي</span>
            </h2>
            <div class="section-body" v-html="formatParagraphs(project.architecture)"></div>

            <div class="after-notes-box mt-4" v-if="project.after_notes?.length">
              <h3 class="notes-title mb-2">مخرجات التطوير والتحسين:</h3>
              <ul class="notes-list">
                <li v-for="(note, i) in project.after_notes" :key="i">{{ note }}</li>
              </ul>
            </div>
          </article>

          <!-- Architecture Stages -->
          <article class="cs-section mb-10" v-if="project.architecture_stages?.length">
            <h2 class="section-h2 mb-4">مراحل التنفيذ والمعمارية</h2>
            <div class="stages-timeline">
              <div class="stage-item" v-for="(stage, sIdx) in project.architecture_stages" :key="sIdx">
                <div class="stage-num">{{ sIdx + 1 }}</div>
                <div class="stage-body">
                  <h3 class="stage-title">{{ stage.title || stage.name || stage }}</h3>
                  <p class="stage-desc" v-if="stage.description">{{ stage.description }}</p>
                </div>
              </div>
            </div>
          </article>

          <!-- Core Features -->
          <article class="cs-section mb-10" v-if="project.features?.length">
            <h2 class="section-h2 mb-4">أبرز المميزات والوظائف</h2>
            <div class="features-grid">
              <div class="feature-item" v-for="(feat, fIdx) in project.features" :key="fIdx">
                <v-icon icon="mdi-check-decagram" color="success" size="18" class="mt-1" />
                <span>{{ feat }}</span>
              </div>
            </div>
          </article>

          <!-- Client Testimonial -->
          <article class="cs-testimonial-box mb-10" v-if="project.testimonial_quote">
            <v-icon icon="mdi-format-quote-open" size="36" color="primary" class="mb-2" />
            <blockquote class="testimonial-quote mb-4">
              "{{ project.testimonial_quote }}"
            </blockquote>
            <cite class="testimonial-client" v-if="project.client_name">
              — {{ project.client_name }}
            </cite>
          </article>
        </main>

        <!-- Sidebar Meta Column -->
        <aside class="cs-sidebar-col">
          <div class="sidebar-card mb-6">
            <h3 class="sidebar-card-title mb-4">تفاصيل المشروع</h3>
            <dl class="meta-dl">
              <dt>العميل / الشريك:</dt>
              <dd>{{ project.client_name || 'مشروع مستقل' }}</dd>

              <dt>الدور الهندسي:</dt>
              <dd>{{ project.role || 'Full Stack Engineer' }}</dd>

              <dt>سنة التنفيذ:</dt>
              <dd>{{ project.year || '2024' }}</dd>

              <dt>التصنيف:</dt>
              <dd>{{ project.category || 'نظام سحابي' }}</dd>
            </dl>
          </div>

          <div class="sidebar-card mb-6" v-if="project.tags?.length">
            <h3 class="sidebar-card-title mb-3">حزمة التقنيات المستخدمة</h3>
            <div class="d-flex flex-wrap gap-2">
              <span class="tech-chip" v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </aside>
      </div>

      <!-- Related / Other Projects -->
      <section class="cs-related pt-12 mt-12" v-if="otherProjects?.length">
        <h2 class="section-h2 mb-6 text-center">مشاريع هندسية أخرى مقترحة</h2>
        <div class="related-grid">
          <article v-for="op in otherProjects" :key="op.id" class="related-card">
            <NuxtLink :to="`/projects/${op.slug}`" class="related-link">
              <h3 class="related-title mb-1">{{ op.title }}</h3>
              <p class="related-desc text-caption">{{ op.short_description }}</p>
            </NuxtLink>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useSeoEngine } from '~/composables/useSeoEngine'
import { useJsonLd } from '~/composables/useJsonLd'

const route = useRoute()
const slug = route.params.slug
const portfolioStore = usePortfolioStore()

const { data, error } = await useAsyncData(`project-${slug}`, async () => {
  return await portfolioStore.getProjectByIdOrSlug(slug)
})

if (error.value || !data.value?.project) {
  throw createError({
    statusCode: 404,
    statusMessage: 'عذراً، المشروع المطلوب غير موجود أو تم نقله.'
  })
}

const project = computed(() => data.value?.project)
const otherProjects = computed(() => data.value?.other_projects || [])

const dev = portfolioStore.developer

// SEO Setup
useSeoEngine({
  title: project.value.title,
  description: project.value.short_description || project.value.problem,
  image: project.value.image,
  slug: `projects/${project.value.slug}`,
  type: 'website',
  devName: dev?.name || dev?.full_name,
  devTitle: dev?.title || dev?.role
})

// Schema.org Structured Data
const { setProjectSchema, setBreadcrumbsSchema } = useJsonLd()
setProjectSchema(project.value, dev?.name || dev?.full_name)
setBreadcrumbsSchema([
  { name: 'الرئيسية', path: '/' },
  { name: 'المشاريع', path: '/projects' },
  { name: project.value.title, path: `/projects/${project.value.slug}` }
])

function formatParagraphs(text) {
  if (!text) return ''
  return text
    .split('\n\n')
    .map(p => `<p class="mb-3">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('')
}
</script>

<style scoped>
.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--t3, #64748B);
}

.breadcrumb-link {
  color: var(--t2, #94A3B8);
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: var(--primary, #3B82F6);
}

.breadcrumb-current {
  color: var(--t1, #F8FAFC);
  font-weight: 600;
}

.cs-hero {
  max-width: 900px;
}

.badge-cat, .badge-year, .badge-role {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.badge-cat {
  background: var(--primary-subtle, rgba(59, 130, 246, 0.1));
  color: var(--primary, #3B82F6);
  border: 1px solid var(--primary-border, rgba(59, 130, 246, 0.25));
}

.badge-year, .badge-role {
  background: var(--bg-card, #0F172A);
  color: var(--t2, #94A3B8);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
}

.cs-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.25;
  color: var(--t1, #F8FAFC);
}

.cs-lead {
  font-size: 1.15rem;
  color: var(--t2, #94A3B8);
  line-height: 1.8;
}

.showcase-frame {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  background: #000;
}

.showcase-img {
  width: 100%;
  max-height: 600px;
  object-fit: cover;
  display: block;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-box {
  padding: 20px;
  background: var(--bg-card, #0F172A);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
  text-align: center;
}

.metric-val {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--t2, #94A3B8);
}

.cs-content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
}

@media (max-width: 960px) {
  .cs-content-grid {
    grid-template-columns: 1fr;
  }
}

.section-h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--t1, #F8FAFC);
}

.section-body {
  color: var(--t2, #94A3B8);
  line-height: 1.8;
  font-size: 1rem;
}

.before-notes-box, .after-notes-box {
  padding: 16px 20px;
  border-radius: 10px;
  margin-top: 16px;
}

.before-notes-box {
  background: rgba(239, 68, 68, 0.08);
  border-right: 3px solid #EF4444;
}

.after-notes-box {
  background: rgba(16, 185, 129, 0.08);
  border-right: 3px solid #10B981;
}

.notes-title {
  font-size: 0.95rem;
  font-weight: 700;
}

.notes-list {
  padding-right: 20px;
  margin: 0;
  color: var(--t2, #94A3B8);
  font-size: 0.9rem;
}

.stages-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stage-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.stage-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary, #3B82F6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
}

.stage-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--t1, #F8FAFC);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-card, #0F172A);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--t1, #F8FAFC);
}

.cs-testimonial-box {
  padding: 24px 28px;
  background: var(--bg-subtle, #161F30);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  border-radius: 14px;
}

.testimonial-quote {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--t1, #F8FAFC);
  line-height: 1.7;
}

.testimonial-client {
  font-size: 0.9rem;
  color: var(--primary, #3B82F6);
  font-weight: 700;
}

.sidebar-card {
  padding: 20px;
  background: var(--bg-card, #0F172A);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
}

.sidebar-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--t1, #F8FAFC);
}

.meta-dl dt {
  font-size: 0.8rem;
  color: var(--t3, #64748B);
  margin-top: 8px;
}

.meta-dl dd {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--t1, #F8FAFC);
  margin-bottom: 8px;
}

.tech-chip {
  padding: 4px 10px;
  background: var(--bg-subtle, #161F30);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 6px;
  font-size: 0.78rem;
  color: var(--t2, #94A3B8);
}

.cs-related {
  border-top: 1px solid var(--border, rgba(255, 255, 255, 0.08));
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.related-card {
  padding: 16px;
  background: var(--bg-card, #0F172A);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 10px;
}

.related-link {
  text-decoration: none;
}

.related-title {
  font-size: 1rem;
  color: var(--t1, #F8FAFC);
}

.related-title:hover {
  color: var(--primary, #3B82F6);
}

.btn {
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary, #3B82F6);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-hover, #2563EB);
}

.btn-secondary {
  background: var(--bg-card, #0F172A);
  color: var(--t1, #F8FAFC);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
}

.btn-secondary:hover {
  border-color: var(--border-h, rgba(255, 255, 255, 0.25));
}
</style>
