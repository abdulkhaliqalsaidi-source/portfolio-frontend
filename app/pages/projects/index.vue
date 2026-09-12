<template>
  <div class="projects-page py-12" dir="rtl">
    <div class="container">
      <!-- Breadcrumb navigation -->
      <nav class="breadcrumb-nav mb-6" aria-label="مسار التصفح">
        <NuxtLink to="/" class="breadcrumb-link">الرئيسية</NuxtLink>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">المشاريع</span>
      </nav>

      <!-- Page Header -->
      <div class="projects-header mb-8 text-center">
        <div class="page-badge mb-3">سجل الإنجازات</div>
        <h1 class="page-h1 mb-4">معرض المشاريع ودراسات الحالة الهندسية</h1>
        <p class="page-lead mx-auto">
          استعراض شامل لأبرز الأنظمة السحابية والمنصات الرقمية التي قمت بتصميمها وهندستها وتطويرها في بيئات الإنتاج الفعلية.
        </p>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="projects-toolbar mb-8 d-flex flex-wrap align-center justify-space-between gap-4">
        <!-- Categories Filters -->
        <div class="category-filters d-flex flex-wrap gap-2">
          <button
            class="filter-chip"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
          >
            الكل ({{ projects.length }})
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter-chip"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Search input -->
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ابحث عن مشروع أو تقنية..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid" v-if="filteredProjects.length">
        <article
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
        >
          <div class="card-media">
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              loading="lazy"
              class="card-img"
            />
            <div v-else class="card-img-placeholder">
              <v-icon icon="mdi-code-braces" size="48" color="primary" />
            </div>
            <div class="card-category-badge">{{ project.category || 'نظام سحابي' }}</div>
          </div>

          <div class="card-body">
            <div class="card-meta mb-2 d-flex align-center justify-space-between text-caption">
              <span>{{ project.year || '2024' }}</span>
              <span class="card-role">{{ project.role || 'Full Stack Engineer' }}</span>
            </div>

            <h2 class="card-title mb-2">
              <NuxtLink :to="`/projects/${project.slug}`" class="title-link">
                {{ project.title }}
              </NuxtLink>
            </h2>

            <p class="card-desc mb-4">
              {{ project.short_description || project.problem || '' }}
            </p>

            <div class="card-tags mb-5 d-flex flex-wrap gap-1" v-if="project.tags?.length">
              <span class="tech-tag" v-for="tag in project.tags.slice(0, 4)" :key="tag">
                {{ tag }}
              </span>
            </div>

            <div class="card-footer d-flex align-center justify-space-between pt-3">
              <NuxtLink :to="`/projects/${project.slug}`" class="details-btn">
                <span>استكشف دراسة الحالة</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </NuxtLink>
              <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="demo-link" title="معاينة حية">
                <v-icon icon="mdi-open-in-new" size="16" />
              </a>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-state text-center py-16">
        <v-icon icon="mdi-folder-search-outline" size="48" color="secondary" class="mb-3" />
        <h3 class="text-h6 font-weight-bold">لا توجد مشاريع تطابق البحث</h3>
        <p class="text-caption text-medium-emphasis">جرب تغيير الكلمات المفتاحية أو اختيار تصنيف آخر.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useSeoEngine } from '~/composables/useSeoEngine'
import { useJsonLd } from '~/composables/useJsonLd'

const portfolioStore = usePortfolioStore()

await useAsyncData('projects-list', async () => {
  if (!portfolioStore.isInitialized) {
    await portfolioStore.fetchPublicContent()
  }
  return true
})

const projects = computed(() => portfolioStore.projects || [])
const selectedCategory = ref('all')
const searchQuery = ref('')

const categories = computed(() => {
  const set = new Set()
  projects.value.forEach(p => {
    if (p.category) set.add(p.category)
  })
  return Array.from(set)
})

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const matchesCat = selectedCategory.value === 'all' || p.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase().trim()
    const matchesQuery = !q ||
      p.title?.toLowerCase().includes(q) ||
      p.short_description?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    return matchesCat && matchesQuery
  })
})

useSeoEngine({
  title: 'معرض المشاريع ودراسات الحالة البرمجية',
  description: 'استكشف دراسات الحالة المتخصصة والمشاريع البرمجية التي قام بتطويرها عبد الخالق الصايدي - Senior Full Stack Engineer.',
  slug: 'projects',
  type: 'website'
})

const { setBreadcrumbsSchema } = useJsonLd()
setBreadcrumbsSchema([
  { name: 'الرئيسية', path: '/' },
  { name: 'المشاريع', path: '/projects' }
])
</script>

<style scoped>
.projects-page {
  min-height: 80vh;
}

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

.page-badge {
  display: inline-block;
  padding: 4px 14px;
  background: var(--primary-subtle, rgba(59, 130, 246, 0.1));
  color: var(--primary, #3B82F6);
  border: 1px solid var(--primary-border, rgba(59, 130, 246, 0.28));
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.page-h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--t1, #F8FAFC);
}

.page-lead {
  max-width: 680px;
  font-size: 1.05rem;
  color: var(--t2, #94A3B8);
  line-height: 1.7;
}

.filter-chip {
  padding: 8px 18px;
  border-radius: 8px;
  background: var(--bg-card, #0F172A);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  color: var(--t2, #94A3B8);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover, .filter-chip.active {
  background: var(--primary, #3B82F6);
  color: #fff;
  border-color: var(--primary, #3B82F6);
}

.search-input {
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--bg-card, #0F172A);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  color: var(--t1, #F8FAFC);
  font-size: 0.9rem;
  min-width: 260px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary, #3B82F6);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.project-card {
  background: var(--bg-card, #0F172A);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-h, rgba(255, 255, 255, 0.2));
}

.card-media {
  position: relative;
  height: 200px;
  background: #000;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-img-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-subtle, #161F30);
}

.card-category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  background: rgba(11, 15, 25, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary, #3B82F6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-role {
  color: var(--primary, #3B82F6);
  font-weight: 600;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.4;
}

.title-link {
  color: var(--t1, #F8FAFC);
  text-decoration: none;
}

.title-link:hover {
  color: var(--primary, #3B82F6);
}

.card-desc {
  font-size: 0.88rem;
  color: var(--t2, #94A3B8);
  line-height: 1.6;
  flex: 1;
}

.tech-tag {
  padding: 2px 8px;
  background: var(--bg-subtle, #161F30);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--t2, #94A3B8);
}

.card-footer {
  border-top: 1px solid var(--border, rgba(255, 255, 255, 0.08));
}

.details-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary, #3B82F6);
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
}

.details-btn:hover {
  color: var(--primary-hover, #2563EB);
}
</style>
