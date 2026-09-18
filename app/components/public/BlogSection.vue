<template>
  <section class="section" id="blog" v-if="blogPosts.length > 0">
    <div class="container">
      <div class="section-head">
        <div class="eyebrow">{{ eyebrow }}</div>
        <h2 class="s-title">{{ title }} <span class="g-text">{{ titleHighlight }}</span></h2>
        <p class="s-sub">{{ sub }}</p>
      </div>

      <!-- Blog Posts Grid -->
      <div class="blog-grid">
        <article
          v-for="(post, index) in displayPosts"
          :key="post.id"
          class="blog-card anim"
          :class="`d-${index + 1}`"
          @click="navigateToPost(post)"
        >
          <div class="card-glow" />
          
          <!-- Post Cover Image -->
          <div class="blog-cover-wrap">
            <img
              :src="post.cover_image || getFallbackCover(post.category)"
              :alt="post.title"
              class="blog-cover-img"
              loading="lazy"
              @error="handleImgFallback"
            />
            <div class="cover-overlay" />
            <div class="cover-badges">
              <span class="category-badge">{{ post.category }}</span>
              <span class="featured-badge" v-if="post.is_featured">
                <v-icon icon="mdi-star-four-points" size="12" class="ml-1" />
                <span>{{ t('blog.featured') }}</span>
              </span>
            </div>
            <div class="reading-time-chip">
              <v-icon icon="mdi-clock-outline" size="13" class="ml-1" />
              <span>{{ post.reading_time_minutes || 4 }} {{ t('blog.minRead') }}</span>
            </div>
          </div>

          <!-- Post Content -->
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
                <span>{{ t('blog.readMore') }}</span>
                <v-icon :icon="locale === 'en' ? 'mdi-arrow-right' : 'mdi-arrow-left'" size="16" class="read-arrow" />
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- View All Blog CTA -->
      <div class="blog-all-cta text-center mt-10 anim d-4" v-if="blogPosts.length >= 3">
        <router-link to="/blog" class="btn btn-secondary btn-lg">
          <v-icon icon="mdi-newspaper-variant-multiple-outline" size="18" class="mx-2" />
          <span>{{ t('blog.allArticles') }} ({{ blogPosts.length }})</span>
          <v-icon :icon="locale === 'en' ? 'mdi-arrow-right' : 'mdi-arrow-left'" size="18" class="mx-2" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '~/stores/portfolio'
import { useScrollReveal } from '~/composables/useScrollReveal'
import { useLocale } from '~/composables/useLocale'

const store = usePortfolioStore()
const router = useRouter()
const { t, locale } = useLocale()
useScrollReveal('.anim')

const eyebrow = computed(() => {
  if (locale.value === 'en') return t('blog.eyebrow')
  return store.settings.blog_section_eyebrow || t('blog.eyebrow')
})

const title = computed(() => {
  if (locale.value === 'en') return t('blog.title')
  return store.settings.blog_section_title || t('blog.title')
})

const titleHighlight = computed(() => {
  if (locale.value === 'en') return t('blog.titleHighlight')
  return store.settings.blog_section_title_span || t('blog.titleHighlight')
})

const sub = computed(() => {
  if (locale.value === 'en') return t('blog.sub')
  return store.settings.blog_section_sub || t('blog.sub')
})

const blogPosts = computed(() => store.blogPosts || [])
const displayPosts = computed(() => blogPosts.value.slice(0, 3))

function navigateToPost(post) {
  router.push(`/blog/${post.slug || post.id}`)
}

function formatDate(dateStr) {
  if (!dateStr) return locale.value === 'en' ? 'Recent' : 'مؤخراً'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return dateStr
  }
}

function getExcerptFromContent(content) {
  if (!content) return ''
  // Strip markdown symbols and return first 130 chars
  const clean = content.replace(/#+\s+|[*_`[\]]/g, '').replace(/\n+/g, ' ').trim()
  return clean.length > 130 ? clean.substring(0, 130) + '...' : clean
}

function getFallbackCover(cat = '') {
  return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
}

function handleImgFallback(e) {
  e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
}
</script>

<style scoped>
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: clamp(20px, 2.5vw, 28px);
}

.blog-card {
  position: relative;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(59, 130, 246, 0.2);
}

.blog-card:hover .card-glow {
  opacity: 1;
}

.blog-cover-wrap {
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  background: #0F172A;
}

.blog-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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

.featured-badge {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #FBBF24;
  display: inline-flex;
  align-items: center;
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

.post-date {
  display: inline-flex;
  align-items: center;
}

.post-stats-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-stat {
  display: inline-flex;
  align-items: center;
}

.post-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.18rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.45;
  margin-bottom: 10px;
  transition: color 0.2s ease;
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
  transition: all 0.2s ease;
  white-space: nowrap;
}

.read-arrow {
  transition: transform 0.25s ease;
}

.blog-card:hover .read-arrow {
  transform: translateX(-4px);
}

/* ═══════════════════════════════════════════════════════════
   LIGHT THEME ROBUST OVERRIDES
   ═══════════════════════════════════════════════════════════ */
:global([data-theme="light"] .blog-card) {
  background: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08) !important;
}

:global([data-theme="light"] .post-title) {
  color: #0F172A !important;
}

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

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
