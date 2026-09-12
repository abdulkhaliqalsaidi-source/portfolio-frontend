<template>
  <div class="blog-archive-page" dir="rtl">
    <main class="blog-main-content">
      <!-- ══════════════════════════════════════════
           HERO HEADER SECTION
           ══════════════════════════════════════════ -->
      <section class="blog-hero-section">
        <div class="container">
          <div class="hero-center-box text-center">
            <div class="eyebrow-pill">
              <v-icon icon="mdi-book-open-page-variant-outline" size="16" class="ml-1" />
              <span>المدونة ومساحة المعرفة • Insights Hub</span>
            </div>
            <h1 class="blog-main-title">
              مقالات، تجارب، ورؤى <span class="g-text">متخصصة</span>
            </h1>
            <p class="blog-main-sub">
              مكتبة شاملة من الدروس العملية، التحليلات المعمقة، وأفضل الممارسات عبر مختلف مجالات التقنية والتصميم والأعمال.
            </p>

            <!-- Search & Filter Input -->
            <div class="blog-search-bar">
              <v-icon icon="mdi-magnify" size="20" color="#94A3B8" class="search-icon" />
              <input
                type="text"
                v-model="searchQuery"
                placeholder="ابحث في المقالات، العناوين، أو الكلمات المفتاحية..."
                class="search-input"
              />
              <button
                v-if="searchQuery"
                class="search-clear-btn"
                @click="searchQuery = ''"
                title="مسح البحث"
              >
                <v-icon icon="mdi-close" size="16" />
              </button>
            </div>

            <!-- Categories Pill Bar -->
            <div class="categories-filter-bar" v-if="categoriesList.length > 1">
              <button
                v-for="cat in categoriesList"
                :key="cat"
                class="cat-filter-btn"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
              >
                <span>{{ cat }}</span>
                <span class="cat-count">{{ getCategoryCount(cat) }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           FEATURED POST HERO (If exists and on 'All' category)
           ══════════════════════════════════════════ -->
      <section class="container mb-12" v-if="featuredPost && selectedCategory === 'الكل' && !searchQuery">
        <div class="featured-hero-card" @click="goToPost(featuredPost)">
          <div class="fh-img-wrap">
            <img
              :src="featuredPost.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80'"
              :alt="featuredPost.title"
              class="fh-img"
            />
            <div class="fh-overlay" />
            <span class="fh-badge">مقال مميز • Featured Insight</span>
          </div>

          <div class="fh-content">
            <div class="d-flex align-center gap-3 mb-3 flex-wrap">
              <span class="category-badge">{{ featuredPost.category }}</span>
              <span class="meta-time">
                <v-icon icon="mdi-clock-outline" size="14" class="ml-1" />
                {{ featuredPost.reading_time_minutes || 5 }} دقائق قراءة
              </span>
              <span class="meta-time">
                <v-icon icon="mdi-calendar-outline" size="14" class="ml-1" />
                {{ formatDate(featuredPost.published_at) }}
              </span>
            </div>

            <h2 class="fh-title">{{ featuredPost.title }}</h2>
            <p class="fh-excerpt">{{ featuredPost.excerpt || getExcerptFromContent(featuredPost.content) }}</p>

            <div class="d-flex align-center justify-between mt-6 pt-4 border-top">
              <div class="d-flex align-center gap-2">
                <span class="tag-pill" v-for="tag in (featuredPost.tags || []).slice(0, 3)" :key="tag">
                  #{{ tag }}
                </span>
              </div>
              <div class="read-more-link">
                <span>قراءة المقال بالكامل</span>
                <v-icon icon="mdi-arrow-left" size="18" class="read-arrow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           ARTICLES GRID
           ══════════════════════════════════════════ -->
      <section class="container mb-16">
        <!-- Empty Results -->
        <div v-if="filteredPosts.length === 0" class="empty-state-box text-center py-16">
          <v-icon icon="mdi-book-search-outline" size="56" color="var(--t3)" class="mb-4" />
          <h3>لم يتم العثور على مقالات مطابقة</h3>
          <p class="text-caption mt-1" style="color:var(--t2)">جرب البحث بكلمات مختلفة أو اختر تصنيفاً آخر.</p>
          <button class="btn btn-primary mt-4" @click="resetFilters">
            <span>عرض كافة المقالات</span>
          </button>
        </div>

        <!-- Grid Cards -->
        <div v-else class="blog-grid">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            class="blog-card"
            @click="goToPost(post)"
          >
            <div class="card-glow" />
            
            <div class="blog-cover-wrap">
              <img
                :src="post.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'"
                :alt="post.title"
                class="blog-cover-img"
                loading="lazy"
              />
              <div class="cover-overlay" />
              <div class="cover-badges">
                <span class="category-badge">{{ post.category }}</span>
              </div>
              <div class="reading-time-chip">
                <v-icon icon="mdi-clock-outline" size="13" class="ml-1" />
                <span>{{ post.reading_time_minutes || 4 }} د قراءة</span>
              </div>
            </div>

            <div class="blog-card-body">
              <div class="post-meta-row">
                <span class="post-date">
                  <v-icon icon="mdi-calendar-month-outline" size="14" class="ml-1" />
                  {{ formatDate(post.published_at) }}
                </span>
                <div class="post-stats-group">
                  <span class="meta-stat" v-if="post.views_count">
                    <v-icon icon="mdi-eye-outline" size="14" class="ml-1" />
                    {{ post.views_count }}
                  </span>
                  <span class="meta-stat" v-if="post.likes_count">
                    <v-icon icon="mdi-heart-outline" size="14" class="ml-1" />
                    {{ post.likes_count }}
                  </span>
                </div>
              </div>

              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt || getExcerptFromContent(post.content) }}</p>

              <div class="post-footer">
                <div class="post-tags-flex" v-if="post.tags?.length">
                  <span class="post-tag-item" v-for="tag in post.tags.slice(0, 3)" :key="tag">
                    #{{ tag }}
                  </span>
                </div>
                <div class="read-more-link">
                  <span>قراءة</span>
                  <v-icon icon="mdi-arrow-left" size="16" class="read-arrow" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useSeoEngine } from '~/composables/useSeoEngine'
import { useJsonLd } from '~/composables/useJsonLd'

const portfolioStore = usePortfolioStore()

await useAsyncData('blog-list', async () => {
  if (!portfolioStore.isInitialized) {
    await portfolioStore.fetchPublicContent()
  }
  return true
})

useSeoEngine({
  title: 'المدونة ومساحة المعرفة التقنية',
  description: 'مكتبة شاملة من الدروس العملية، التحليلات المعمقة، وأفضل الممارسات عبر مختلف مجالات التقنية وهندسة البرمجيات.',
  slug: 'blog',
  type: 'website'
})

const { setBreadcrumbsSchema } = useJsonLd()
setBreadcrumbsSchema([
  { name: 'الرئيسية', path: '/' },
  { name: 'المدونة', path: '/blog' }
])

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '~/stores/portfolio'

const store = usePortfolioStore()
const router = useRouter()

const searchQuery = ref('')
const selectedCategory = ref('الكل')

onMounted(async () => {
  if (!store.isInitialized) {
    await store.fetchPublicContent()
  }
})

const allPosts = computed(() => store.blogPosts || [])

const featuredPost = computed(() => {
  return allPosts.value.find(p => p.is_featured) || null
})

const categoriesList = computed(() => {
  const set = new Set()
  allPosts.value.forEach(p => {
    if (p.category) set.add(p.category)
  })
  return ['الكل', ...Array.from(set)]
})

function getCategoryCount(cat) {
  if (cat === 'الكل') return allPosts.value.length
  return allPosts.value.filter(p => p.category === cat).length
}

const filteredPosts = computed(() => {
  let list = allPosts.value

  // If we have a featured post shown in hero, exclude it from regular grid unless searching/filtering
  if (featuredPost.value && selectedCategory.value === 'الكل' && !searchQuery.value) {
    list = list.filter(p => p.id !== featuredPost.value.id)
  }

  if (selectedCategory.value !== 'الكل') {
    list = list.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(p => {
      const matchTitle = (p.title || '').toLowerCase().includes(q)
      const matchExcerpt = (p.excerpt || '').toLowerCase().includes(q)
      const matchContent = (p.content || '').toLowerCase().includes(q)
      const matchCat = (p.category || '').toLowerCase().includes(q)
      const matchTags = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q))
      return matchTitle || matchExcerpt || matchContent || matchCat || matchTags
    })
  }

  return list
})

function goToPost(post) {
  router.push(`/blog/${post.slug || post.id}`)
}

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'الكل'
}

function formatDate(dateStr) {
  if (!dateStr) return 'مؤخراً'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return dateStr
  }
}

function getExcerptFromContent(content) {
  if (!content) return ''
  const clean = content.replace(/#+\s+|[*_`[\]]/g, '').replace(/\n+/g, ' ').trim()
  return clean.length > 130 ? clean.substring(0, 130) + '...' : clean
}
</script>

<style scoped>
.blog-archive-page {
  min-height: 100vh;
  background: var(--bg-root, #060913);
  color: var(--t1, #F8FAFC);
  display: flex;
  flex-direction: column;
}

.blog-main-content {
  flex: 1;
  padding-top: 110px;
}

.blog-hero-section {
  padding: 40px 0 50px;
}

.hero-center-box {
  max-width: 800px;
  margin: 0 auto;
}

.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 800;
  padding: 6px 16px;
  border-radius: 100px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #38BDF8;
  margin-bottom: 20px;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.blog-main-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 16px;
  color: #FFFFFF;
}

.blog-main-sub {
  font-size: 1.05rem;
  color: #94A3B8;
  line-height: 1.8;
  margin-bottom: 32px;
}

.blog-search-bar {
  position: relative;
  max-width: 580px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  right: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 44px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  color: #FFFFFF;
  font-size: 0.95rem;
  font-family: var(--f-body, 'Cairo', sans-serif);
  transition: all 0.25s ease;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
}

.search-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2), 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.search-clear-btn {
  position: absolute;
  left: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  cursor: pointer;
}

.categories-filter-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94A3B8;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--f-body, 'Cairo', sans-serif);
  transition: all 0.25s ease;
  cursor: pointer;
}

.cat-filter-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.35);
  color: #FFFFFF;
}

.cat-filter-btn.active {
  background: #2563EB;
  border-color: #3B82F6;
  color: #FFFFFF;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.cat-count {
  font-size: 0.72rem;
  padding: 2px 7px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.cat-filter-btn.active .cat-count {
  background: rgba(255, 255, 255, 0.25);
}

/* Featured Hero Card */
.featured-hero-card {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.35s ease;
}

.featured-hero-card:hover {
  transform: translateY(-5px);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.2);
}

.fh-img-wrap {
  position: relative;
  min-height: 320px;
  overflow: hidden;
}

.fh-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.featured-hero-card:hover .fh-img {
  transform: scale(1.05);
}

.fh-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.6) 0%, transparent 100%);
}

.fh-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(245, 158, 11, 0.9);
  color: #000000;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

.fh-content {
  padding: 36px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fh-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.65rem;
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1.4;
  margin-bottom: 14px;
}

.fh-excerpt {
  font-size: 0.95rem;
  color: #94A3B8;
  line-height: 1.8;
}

.meta-time {
  font-size: 0.8rem;
  color: #94A3B8;
  display: inline-flex;
  align-items: center;
}

.tag-pill {
  font-size: 0.76rem;
  color: #64748B;
  font-family: var(--f-mono, 'Tajawal', sans-serif);
}

/* Grid & Cards */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: clamp(20px, 2.5vw, 28px);
}

.blog-card {
  position: relative;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.blog-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.2);
}

.blog-cover-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #0F172A;
}

.blog-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.blog-card:hover .blog-cover-img {
  transform: scale(1.06);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%);
}

.cover-badges {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-badge {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 100px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60A5FA;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.reading-time-chip {
  position: absolute;
  bottom: 12px;
  left: 14px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #CBD5E1;
  display: inline-flex;
  align-items: center;
}

.blog-card-body {
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.post-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.78rem;
  color: #94A3B8;
}

.post-stats-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.45;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card:hover .post-title {
  color: #60A5FA;
}

.post-excerpt {
  font-size: 0.88rem;
  color: #94A3B8;
  line-height: 1.7;
  margin-bottom: 18px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}

.post-tags-flex {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.post-tag-item {
  font-size: 0.72rem;
  color: #64748B;
  font-family: var(--f-mono, 'Tajawal', sans-serif);
}

.read-more-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #38BDF8;
  white-space: nowrap;
}

.read-arrow {
  transition: transform 0.25s ease;
}

.blog-card:hover .read-arrow,
.featured-hero-card:hover .read-arrow {
  transform: translateX(-4px);
}

/* ═══════════════════════════════════════════════════════════
   LIGHT THEME ROBUST OVERRIDES
   ═══════════════════════════════════════════════════════════ */
:global([data-theme="light"] .blog-archive-page) {
  background: #F8FAFC !important;
  color: #0F172A !important;
}

:global([data-theme="light"] .blog-main-title) {
  color: #0F172A !important;
}

:global([data-theme="light"] .blog-main-sub) {
  color: #475569 !important;
}

:global([data-theme="light"] .blog-search-bar input) {
  background: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  color: #0F172A !important;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.04) !important;
}

:global([data-theme="light"] .cat-filter-btn) {
  background: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  color: #475569 !important;
}

:global([data-theme="light"] .cat-filter-btn.active) {
  background: #2563EB !important;
  border-color: #2563EB !important;
  color: #FFFFFF !important;
}

:global([data-theme="light"] .featured-hero-card),
:global([data-theme="light"] .blog-card) {
  background: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08) !important;
}

:global([data-theme="light"] .fh-title),
:global([data-theme="light"] .post-title) {
  color: #0F172A !important;
}

:global([data-theme="light"] .fh-excerpt),
:global([data-theme="light"] .post-excerpt) {
  color: #475569 !important;
}

:global([data-theme="light"] .post-footer) {
  border-top-color: #E2E8F0 !important;
}

:global([data-theme="light"] .category-badge) {
  background: #FFFFFF !important;
  border-color: #BFDBFE !important;
  color: #1D4ED8 !important;
}

:global([data-theme="light"] .reading-time-chip) {
  background: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  color: #475569 !important;
}

@media (max-width: 900px) {
  .featured-hero-card {
    grid-template-columns: 1fr;
  }
  .fh-img-wrap {
    min-height: 220px;
  }
}
</style>
