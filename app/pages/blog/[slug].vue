<template>
  <div class="blog-post-page" dir="rtl">
    <!-- Reading Progress Bar -->
    <div class="reading-progress-track">
      <div class="reading-progress-fill" :style="{ width: scrollProgress + '%' }" />
    </div>

    <main class="article-main" v-if="post">
      <!-- ══════════════════════════════════════════
           ARTICLE HEADER HERO
           ══════════════════════════════════════════ -->
      <section class="article-header-section">
        <div class="container">
          <!-- Breadcrumbs -->
          <nav class="article-breadcrumbs mb-6">
            <NuxtLink to="/" class="bc-link">الرئيسية</NuxtLink>
            <span class="bc-sep">/</span>
            <NuxtLink to="/blog" class="bc-link">المدونة</NuxtLink>
            <span class="bc-sep">/</span>
            <span class="bc-curr text-truncate">{{ post.title }}</span>
          </nav>

          <!-- Badges & Reading Meta -->
          <div class="d-flex align-center gap-3 flex-wrap mb-4">
            <span class="category-pill">{{ post.category }}</span>
            <span class="reading-time-badge">
              <v-icon icon="mdi-clock-outline" size="14" class="ml-1" />
              <span>{{ post.reading_time_minutes || calculateReadingTime(post.content) }} دقائق قراءة</span>
            </span>
            <span class="post-date-badge">
              <v-icon icon="mdi-calendar-month-outline" size="14" class="ml-1" />
              <span>{{ formatDate(post.published_at) }}</span>
            </span>
          </div>

          <!-- Main Title -->
          <h1 class="article-h1">{{ post.title }}</h1>

          <!-- Excerpt -->
          <p class="article-lead-excerpt" v-if="post.excerpt">
            {{ post.excerpt }}
          </p>

          <!-- Author & Interaction Bar -->
          <div class="article-author-bar mt-6">
            <div class="author-info-flex">
              <div class="author-avatar-wrap">
                <img
                  :src="developer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'"
                  :alt="developer.name || 'الكاتب'"
                  class="author-avatar-img"
                  @error="handleImgFallback"
                />
              </div>
              <div>
                <div class="author-name">{{ developer.name || developer.full_name || 'عبد الخالق الصايدي' }}</div>
                <div class="author-role">{{ developer.title || 'مهندس برمجيات وحلول رقمية' }}</div>
              </div>
            </div>

            <!-- Stats & Like Action -->
            <div class="article-actions-cluster">
              <span class="views-count-pill" title="عدد المشاهدات">
                <v-icon icon="mdi-eye-outline" size="16" class="ml-1" />
                <span>{{ post.views_count || 1 }} مشاهدة</span>
              </span>

              <button
                class="like-post-btn"
                :class="{ 'has-liked': hasLiked }"
                @click="handleLikePost"
                :title="hasLiked ? 'أعجبك هذا المقال' : 'تسجيل إعجاب'"
              >
                <v-icon :icon="hasLiked ? 'mdi-heart' : 'mdi-heart-outline'" size="18" class="ml-1" :color="hasLiked ? '#EF4444' : undefined" />
                <span>{{ post.likes_count || 0 }}</span>
              </button>

              <button class="share-trigger-btn" @click="copyShareLink" title="نسخ رابط المقال">
                <v-icon :icon="copiedLink ? 'mdi-check' : 'mdi-share-variant-outline'" size="18" />
                <span class="d-none d-sm-inline">{{ copiedLink ? 'تم النسخ!' : 'مشاركة' }}</span>
              </button>
            </div>
          </div>

          <!-- Featured Cover Image -->
          <div class="article-cover-frame mt-8" v-if="post.cover_image">
            <img
              :src="post.cover_image"
              :alt="post.title"
              class="article-cover-img"
              @error="handleImgFallback"
            />
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           ARTICLE BODY & STICKY SIDEBAR (TOC + SHARES)
           ══════════════════════════════════════════ -->
      <section class="container my-12">
        <div class="article-layout-grid">
          <!-- Main Markdown Content -->
          <div class="article-prose-container">
            <div
              ref="contentContainerRef"
              class="markdown-rendered-body"
              v-html="renderedHtmlContent"
              @click="handleContentClick"
            />

            <!-- Tags List -->
            <div class="article-tags-box mt-10" v-if="post.tags?.length">
              <span class="tags-box-label">الكلمات المفتاحية:</span>
              <div class="d-flex align-center gap-2 flex-wrap mt-2">
                <span class="article-keyword-chip" v-for="tag in post.tags" :key="tag">
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- Share Bar Box -->
            <div class="article-share-card mt-8">
              <h4 class="share-card-title">هل أعجبك المقال أو استفدت منه؟</h4>
              <p class="share-card-sub">شاركه مع شبكتك المهنية لدعم ونشر المعرفة:</p>
              
              <div class="share-buttons-grid mt-4">
                <a :href="shareUrls.twitter" target="_blank" class="share-social-btn btn-twitter" title="مشاركة على منصة X">
                  <v-icon icon="mdi-twitter" size="18" class="ml-1" />
                  <span>منصة X</span>
                </a>

                <a :href="shareUrls.linkedin" target="_blank" class="share-social-btn btn-linkedin" title="مشاركة على LinkedIn">
                  <v-icon icon="mdi-linkedin" size="18" class="ml-1" />
                  <span>LinkedIn</span>
                </a>

                <a :href="shareUrls.whatsapp" target="_blank" class="share-social-btn btn-whatsapp" title="مشاركة عبر واتساب">
                  <v-icon icon="mdi-whatsapp" size="18" class="ml-1" />
                  <span>WhatsApp</span>
                </a>

                <button class="share-social-btn btn-copylink" @click="copyShareLink">
                  <v-icon :icon="copiedLink ? 'mdi-check' : 'mdi-link-variant'" size="18" class="ml-1" />
                  <span>{{ copiedLink ? 'تم نسخ الرابط!' : 'نسخ الرابط' }}</span>
                </button>
              </div>
            </div>

            <!-- Author Box Card -->
            <div class="author-bio-card mt-8">
              <div class="author-bio-avatar">
                <img :src="developer.avatar" :alt="developer.name" @error="handleImgFallback" />
              </div>
              <div class="author-bio-text">
                <h5>{{ developer.name || developer.full_name || 'عبد الخالق الصايدي' }}</h5>
                <p>{{ developer.bio || developer.tagline || 'شغوف ببناء حلول برمجية وتصميمية متكاملة وتوثيق التجارب العملية في مساحة المعرفة.' }}</p>
                <a href="#contact" class="author-cta-btn" @click.prevent="goToContact">
                  <v-icon icon="mdi-email-fast-outline" size="16" class="ml-1" />
                  <span>تواصل معي لمناقشة فكرة أو مشروع</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Sticky Sidebar: Table of Contents (TOC) -->
          <aside class="article-sidebar">
            <div class="sticky-sidebar-inner">
              <!-- TOC Box (Only if headings exist) -->
              <div class="sidebar-card toc-card mb-6" v-if="tocList.length">
                <div class="toc-header">
                  <v-icon icon="mdi-format-list-bulleted" size="18" color="var(--primary)" class="ml-2" />
                  <span>فهرس المحتويات</span>
                </div>
                <nav class="toc-nav">
                  <a
                    v-for="(item, idx) in tocList"
                    :key="idx"
                    :href="`#${item.id}`"
                    class="toc-nav-link"
                    :class="[`level-${item.level}`, { active: activeTocId === item.id }]"
                    @click.prevent="scrollToHeading(item.id)"
                  >
                    <span>{{ item.text }}</span>
                  </a>
                </nav>
              </div>

              <!-- Quick CTA Box -->
              <div class="sidebar-card cta-card">
                <div class="cta-icon-bubble">
                  <v-icon icon="mdi-lightbulb-on-outline" size="24" color="#F59E0B" />
                </div>
                <h5 class="cta-title">هل لديك فكرة أو تحدٍ تقني؟</h5>
                <p class="cta-desc">أنا متاح دائماً للتعاون والاستشارات وتقديم الحلول المبتكرة.</p>
                <NuxtLink to="/#contact" class="btn btn-primary w-100 mt-3 btn-sm">
                  <span>طلب استشارة أو عمل</span>
                </NuxtLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           RELATED POSTS
           ══════════════════════════════════════════ -->
      <section class="related-posts-section py-16" v-if="relatedPosts.length">
        <div class="container">
          <div class="section-head mb-8">
            <div class="eyebrow">المزيد من المعرفة</div>
            <h3 class="s-title">مقالات ورؤى <span class="g-text">ذات صلة</span></h3>
          </div>

          <div class="related-grid">
            <article
              v-for="rel in relatedPosts"
              :key="rel.id"
              class="rel-card"
              @click="goToOtherPost(rel)"
            >
              <div class="rel-cover-wrap">
                <img :src="rel.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80'" :alt="rel.title" />
                <span class="rel-cat">{{ rel.category }}</span>
              </div>
              <div class="rel-body">
                <span class="rel-date">{{ formatDate(rel.published_at) }}</span>
                <h4 class="rel-title">{{ rel.title }}</h4>
                <div class="rel-read-link mt-3">
                  <span>قراءة المقال</span>
                  <v-icon icon="mdi-arrow-left" size="14" class="mr-1" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <!-- Loading / Error Fallback -->
    <div v-else class="article-loading-state py-20 text-center container">
      <v-icon icon="mdi-loading" size="48" color="#3B82F6" class="spin mb-4" />
      <h3>جاري تجهيز وقراءة المقال...</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioStore } from '~/stores/portfolio'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

import { useSeoEngine } from '~/composables/useSeoEngine'
import { useJsonLd } from '~/composables/useJsonLd'

const route = useRoute()
const router = useRouter()
const store = usePortfolioStore()
const slug = route.params.slug

const { data: postData, error } = await useAsyncData(`blog-${slug}`, async () => {
  if (!store.isInitialized) {
    await store.fetchPublicContent()
  }
  return await store.getBlogPostBySlug(slug)
})

if (error.value || !postData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'المقال المطلوب غير موجود أو تم حذفه.'
  })
}

const post = ref(postData.value)

// Professional SEO & Schema.org Setup
useSeoEngine({
  title: post.value.meta_title || post.value.title,
  description: post.value.meta_description || post.value.excerpt || post.value.title,
  image: post.value.cover_image,
  slug: `blog/${post.value.slug}`,
  type: 'article',
  publishedTime: post.value.published_at,
  modifiedTime: post.value.updated_at,
  tags: post.value.tags
})

const { setArticleSchema, setBreadcrumbsSchema } = useJsonLd()
setArticleSchema(post.value)
setBreadcrumbsSchema([
  { name: 'الرئيسية', path: '/' },
  { name: 'المدونة', path: '/blog' },
  { name: post.value.title, path: `/blog/${post.value.slug}` }
])

const scrollProgress = ref(0)
const hasLiked = ref(false)
const copiedLink = ref(false)
const tocList = ref([])
const activeTocId = ref('')
const contentContainerRef = ref(null)

const developer = computed(() => store.developer || {})
const allPosts = computed(() => store.blogPosts || [])

const relatedPosts = computed(() => {
  if (!post.value) return []
  return allPosts.value
    .filter(p => p.id !== post.value.id && (p.category === post.value.category || p.is_featured))
    .slice(0, 3)
})



// Configure Marked with Highlight.js
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: false,
  smartypants: false,
  xhtml: false
})

// Rendered HTML content with code block headers & ids for headings
const renderedHtmlContent = computed(() => {
  if (!post.value || !post.value.content) return ''
  
  let rawHtml = marked.parse(post.value.content)

  // Add IDs to h2 and h3 for Table of Contents
  let headingIndex = 0
  rawHtml = rawHtml.replace(/<(h[2-3])>(.*?)<\/\1>/gi, (match, tag, text) => {
    headingIndex++
    const cleanText = text.replace(/<[^>]+>/g, '').trim()
    const id = `heading-${headingIndex}-${encodeURIComponent(cleanText.replace(/\s+/g, '-').toLowerCase())}`
    return `<${tag} id="${id}" class="prose-heading">${text}</${tag}>`
  })

  // Wrap pre/code blocks with copy header
  rawHtml = rawHtml.replace(/<pre><code class="(.*?)">([\s\S]*?)<\/code><\/pre>/gi, (match, classes, codeContent) => {
    const lang = (classes.match(/language-(\w+)/) || [])[1] || 'code'
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-tag">${lang}</span>
          <button class="code-copy-btn" data-code="${encodeURIComponent(codeContent)}" title="نسخ الكود">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>نسخ</span>
          </button>
        </div>
        <pre><code class="${classes}">${codeContent}</code></pre>
      </div>
    `
  })

  return rawHtml
})

// Share URLs
const shareUrls = computed(() => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const title = post.value?.title || ''
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + currentUrl)}`
  }
})

// Extract Table of Contents headings
function extractToc() {
  if (!post.value?.content) {
    tocList.value = []
    return
  }
  const lines = post.value.content.split('\n')
  const list = []
  let hIndex = 0

  lines.forEach(line => {
    const h2Match = line.match(/^##\s+(.+)$/)
    const h3Match = line.match(/^###\s+(.+)$/)
    if (h2Match) {
      hIndex++
      const text = h2Match[1].trim()
      list.push({
        id: `heading-${hIndex}-${encodeURIComponent(text.replace(/\s+/g, '-').toLowerCase())}`,
        text,
        level: 2
      })
    } else if (h3Match) {
      hIndex++
      const text = h3Match[1].trim()
      list.push({
        id: `heading-${hIndex}-${encodeURIComponent(text.replace(/\s+/g, '-').toLowerCase())}`,
        text,
        level: 3
      })
    }
  })
  tocList.value = list
}

async function loadPost() {
  const slug = route.params.slug
  if (!slug) return

  try {
    if (!store.isInitialized) {
      await store.fetchPublicContent()
    }
    post.value = await store.getBlogPostBySlug(slug)
    extractToc()
    
    // Increment view count in background
    if (post.value?.id) {
      store.recordPostView(post.value.id)
    }

    // Set page title for SEO
    if (post.value?.meta_title || post.value?.title) {
      document.title = `${post.value.meta_title || post.value.title} | ${developer.value?.name || 'المدونة'}`
    }
  } catch (err) {
    console.error('Failed to load post:', err)
  }
}

function handleScroll() {
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  if (docHeight > 0) {
    scrollProgress.value = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
  }

  // Active TOC highlight
  if (tocList.value.length) {
    for (const item of [...tocList.value].reverse()) {
      const el = document.getElementById(item.id)
      if (el && window.scrollY >= el.offsetTop - 140) {
        activeTocId.value = item.id
        break
      }
    }
  }
}

function scrollToHeading(id) {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -100
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

function handleContentClick(e) {
  const copyBtn = e.target.closest('.code-copy-btn')
  if (copyBtn) {
    const rawCode = decodeURIComponent(copyBtn.getAttribute('data-code') || '')
    // Extract text from HTML entities
    const textarea = document.createElement('textarea')
    textarea.innerHTML = rawCode
    navigator.clipboard?.writeText(textarea.value)
    
    const span = copyBtn.querySelector('span')
    if (span) {
      const orig = span.textContent
      span.textContent = 'تم النسخ!'
      copyBtn.classList.add('copied')
      setTimeout(() => {
        span.textContent = orig
        copyBtn.classList.remove('copied')
      }, 2000)
    }
  }
}

async function handleLikePost() {
  if (hasLiked.value || !post.value?.id) return
  hasLiked.value = true
  try {
    const res = await store.likePost(post.value.id)
    if (res?.likes_count) {
      post.value.likes_count = res.likes_count
    }
  } catch (e) {
    console.warn('Like failed:', e)
  }
}

function copyShareLink() {
  navigator.clipboard?.writeText(window.location.href)
  copiedLink.value = true
  setTimeout(() => { copiedLink.value = false }, 2500)
}

function goToOtherPost(rel) {
  router.push(`/blog/${rel.slug || rel.id}`)
}

function goToContact() {
  router.push({ path: '/', hash: '#contact' })
}

function calculateReadingTime(content = '') {
  const words = (content || '').split(/\s+/).length
  return Math.max(1, Math.round(words / 180))
}

function formatDate(dateStr) {
  if (!dateStr) return 'مؤخراً'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    return dateStr
  }
}

function handleImgFallback(e) {
  e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80'
}

watch(() => route.params.slug, () => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  loadPost()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  loadPost()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.blog-post-page {
  min-height: 100vh;
  background: var(--bg-root, #060913);
  color: var(--t1, #F8FAFC);
  display: flex;
  flex-direction: column;
}

/* Reading Progress Bar */
.reading-progress-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 9999;
}

.reading-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);
  transition: width 0.1s linear;
}

.article-main {
  flex: 1;
  padding-top: 110px;
}

/* Breadcrumbs */
.article-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: #94A3B8;
}

.bc-link {
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.2s;
}

.bc-link:hover {
  color: #38BDF8;
}

.bc-curr {
  color: #E2E8F0;
  font-weight: 700;
  max-width: 350px;
}

/* Badges */
.category-pill {
  font-size: 0.78rem;
  font-weight: 800;
  padding: 5px 14px;
  border-radius: 100px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #60A5FA;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.reading-time-badge,
.post-date-badge {
  font-size: 0.8rem;
  color: #94A3B8;
  display: inline-flex;
  align-items: center;
}

.article-h1 {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  font-weight: 900;
  line-height: 1.3;
  color: #FFFFFF;
  margin: 16px 0;
}

.article-lead-excerpt {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #CBD5E1;
  max-width: 860px;
}

/* Author Bar */
.article-author-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  flex-wrap: wrap;
  gap: 16px;
}

.author-info-flex {
  display: flex;
  align-items: center;
  gap: 14px;
}

.author-avatar-wrap {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(59, 130, 246, 0.4);
}

.author-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-weight: 800;
  font-size: 0.95rem;
  color: #FFFFFF;
}

.author-role {
  font-size: 0.78rem;
  color: #94A3B8;
}

.article-actions-cluster {
  display: flex;
  align-items: center;
  gap: 10px;
}

.views-count-pill {
  font-size: 0.8rem;
  color: #94A3B8;
  padding: 6px 12px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: inline-flex;
  align-items: center;
}

.like-post-btn,
.share-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #E2E8F0;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
}

.like-post-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #EF4444;
}

.like-post-btn.has-liked {
  background: rgba(239, 68, 68, 0.2);
  border-color: #EF4444;
  color: #EF4444;
}

.share-trigger-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #38BDF8;
}

/* Cover Image Frame */
.article-cover-frame {
  width: 100%;
  max-height: 480px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.7);
}

.article-cover-img {
  width: 100%;
  height: 100%;
  max-height: 480px;
  object-fit: cover;
}

/* Layout Grid */
.article-layout-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: clamp(24px, 3.5vw, 48px);
  align-items: start;
}

.article-prose-container {
  min-width: 0;
}

/* Markdown Rendered Content Styles */
:deep(.markdown-rendered-body) {
  font-size: 1.05rem;
  line-height: 2;
  color: var(--t2, #E2E8F0);
  font-family: var(--f-body, 'Cairo', sans-serif);
}

:deep(.markdown-rendered-body h1),
:deep(.markdown-rendered-body h2),
:deep(.markdown-rendered-body h3),
:deep(.markdown-rendered-body h4) {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-weight: 800;
  color: var(--t1, #FFFFFF);
  margin-top: 36px;
  margin-bottom: 16px;
  line-height: 1.4;
  scroll-margin-top: 100px;
}

:deep(.markdown-rendered-body h2) {
  font-size: 1.65rem;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  padding-bottom: 10px;
}

:deep(.markdown-rendered-body h3) {
  font-size: 1.35rem;
}

:deep(.markdown-rendered-body p),
:deep(.markdown-rendered-body li),
:deep(.markdown-rendered-body ul),
:deep(.markdown-rendered-body ol),
:deep(.markdown-rendered-body span) {
  color: var(--t2, #CBD5E1);
}

:deep(.markdown-rendered-body p) {
  margin-bottom: 20px;
}

:deep(.markdown-rendered-body strong) {
  color: var(--t1, #FFFFFF);
  font-weight: 800;
}

:deep(.markdown-rendered-body ul),
:deep(.markdown-rendered-body ol) {
  padding-right: 24px;
  margin-bottom: 24px;
}

:deep(.markdown-rendered-body li) {
  margin-bottom: 10px;
  line-height: 1.8;
}

:deep(.markdown-rendered-body blockquote) {
  margin: 28px 0;
  padding: 16px 24px;
  background: rgba(59, 130, 246, 0.08);
  border-right: 4px solid #3B82F6;
  border-radius: 0 14px 14px 0;
  color: var(--t2, #CBD5E1);
  font-style: italic;
}

:deep(.markdown-rendered-body table) {
  width: 100%;
  margin: 28px 0;
  border-collapse: collapse;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  overflow: hidden;
}

:deep(.markdown-rendered-body th),
:deep(.markdown-rendered-body td) {
  padding: 12px 16px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  text-align: right;
}

:deep(.markdown-rendered-body th) {
  background: rgba(30, 41, 59, 0.8);
  font-weight: 800;
  color: var(--t1, #FFFFFF);
}

:deep(.markdown-rendered-body img) {
  max-width: 100%;
  border-radius: 16px;
  margin: 24px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Syntax Highlight Code Blocks */
:deep(.code-block-wrapper) {
  position: relative;
  margin: 28px 0;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.6);
  direction: ltr;
}

:deep(.code-block-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #1F2937;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.code-lang-tag) {
  font-family: var(--f-mono, monospace);
  font-size: 0.74rem;
  font-weight: 700;
  color: #9CA3AF;
  text-transform: uppercase;
}

:deep(.code-copy-btn) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  color: #9CA3AF;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.code-copy-btn:hover) {
  color: #FFFFFF;
  background: rgba(59, 130, 246, 0.2);
  border-color: #3B82F6;
}

:deep(.code-copy-btn.copied) {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10B981;
  color: #10B981;
}

:deep(pre) {
  margin: 0;
  padding: 18px 20px;
  overflow-x: auto;
  font-family: var(--f-mono, 'Fira Code', monospace);
  font-size: 0.9rem;
  line-height: 1.6;
}

:deep(code) {
  font-family: inherit;
}

/* Tags & Share */
.article-tags-box {
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.tags-box-label {
  font-size: 0.84rem;
  font-weight: 800;
  color: var(--t3, #94A3B8);
}

.article-keyword-chip {
  font-size: 0.8rem;
  color: #38BDF8;
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 12px;
  border-radius: 100px;
}

.article-share-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.share-card-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-weight: 800;
  color: var(--t1, #FFFFFF);
}

.share-card-sub {
  font-size: 0.88rem;
  color: var(--t3, #94A3B8);
  margin-top: 4px;
}

.share-buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
}

.share-social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.84rem;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.btn-twitter {
  background: rgba(29, 155, 240, 0.15);
  color: #38BDF8;
  border-color: rgba(29, 155, 240, 0.3);
}

.btn-linkedin {
  background: rgba(10, 102, 194, 0.15);
  color: #60A5FA;
  border-color: rgba(10, 102, 194, 0.3);
}

.btn-whatsapp {
  background: rgba(37, 211, 102, 0.15);
  color: #4ADE80;
  border-color: rgba(37, 211, 102, 0.3);
}

.btn-copylink {
  background: rgba(255, 255, 255, 0.08);
  color: var(--t2, #E2E8F0);
  border-color: rgba(255, 255, 255, 0.12);
  cursor: pointer;
}

.share-social-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
}

/* Author Bio Card */
.author-bio-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
}

.author-bio-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(59, 130, 246, 0.4);
}

.author-bio-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-bio-text h5 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--t1, #FFFFFF);
  margin-bottom: 4px;
}

.author-bio-text p {
  font-size: 0.88rem;
  color: var(--t3, #94A3B8);
  line-height: 1.7;
  margin-bottom: 12px;
}

.author-cta-btn {
  display: inline-flex;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 800;
  color: #38BDF8;
  text-decoration: none;
}

/* Sidebar & TOC */
.sticky-sidebar-inner {
  position: sticky;
  top: 90px;
}

.sidebar-card {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
}

.toc-header {
  display: flex;
  align-items: center;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--t1, #FFFFFF);
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 14px;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 380px;
  overflow-y: auto;
}

.toc-nav-link {
  font-size: 0.82rem;
  color: var(--t3, #94A3B8);
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  border-right: 2px solid transparent;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.toc-nav-link.level-3 {
  padding-right: 20px;
  font-size: 0.78rem;
  opacity: 0.85;
}

.toc-nav-link:hover {
  color: var(--t1, #FFFFFF);
  background: rgba(255, 255, 255, 0.04);
}

.toc-nav-link.active {
  color: #38BDF8;
  background: rgba(59, 130, 246, 0.12);
  border-right-color: #3B82F6;
  font-weight: 700;
}

.cta-card {
  text-align: center;
}

.cta-icon-bubble {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.cta-title {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--t1, #FFFFFF);
}

.cta-desc {
  font-size: 0.82rem;
  color: var(--t3, #94A3B8);
  line-height: 1.6;
  margin-top: 4px;
}

/* Related Posts */
.related-posts-section {
  background: rgba(15, 23, 42, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.rel-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rel-card:hover {
  transform: translateY(-5px);
  border-color: rgba(59, 130, 246, 0.4);
}

.rel-cover-wrap {
  position: relative;
  height: 140px;
}

.rel-cover-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rel-cat {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 100px;
  background: rgba(15, 23, 42, 0.85);
  color: #60A5FA;
}

.rel-body {
  padding: 16px;
}

.rel-date {
  font-size: 0.72rem;
  color: var(--t3, #94A3B8);
}

.rel-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--t1, #FFFFFF);
  margin-top: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rel-read-link {
  display: inline-flex;
  align-items: center;
  font-size: 0.78rem;
  font-weight: 800;
  color: #38BDF8;
}

/* ═══════════════════════════════════════════════════════════
   LIGHT THEME ROBUST OVERRIDES (High Contrast & Clean Text)
   ═══════════════════════════════════════════════════════════ */
:global([data-theme="light"] .blog-post-page) {
  background: #F8FAFC !important;
  color: #0F172A !important;
}

:global([data-theme="light"] .article-h1) {
  color: #0F172A !important;
}

:global([data-theme="light"] .article-lead-excerpt) {
  color: #334155 !important;
}

:global([data-theme="light"] .article-author-bar),
:global([data-theme="light"] .sidebar-card),
:global([data-theme="light"] .article-tags-box),
:global([data-theme="light"] .article-share-card),
:global([data-theme="light"] .author-bio-card),
:global([data-theme="light"] .rel-card) {
  background: #FFFFFF !important;
  border-color: #E2E8F0 !important;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.08) !important;
}

:global([data-theme="light"] .author-name),
:global([data-theme="light"] .author-bio-text h5),
:global([data-theme="light"] .share-card-title),
:global([data-theme="light"] .toc-header),
:global([data-theme="light"] .cta-title),
:global([data-theme="light"] .rel-title) {
  color: #0F172A !important;
}

:global([data-theme="light"] .author-bio-text p),
:global([data-theme="light"] .cta-desc),
:global([data-theme="light"] .share-card-sub),
:global([data-theme="light"] .tags-box-label) {
  color: #475569 !important;
}

:global([data-theme="light"] .toc-nav-link) {
  color: #475569 !important;
}

:global([data-theme="light"] .toc-nav-link:hover) {
  color: #1D4ED8 !important;
  background: #EFF6FF !important;
}

:global([data-theme="light"] .toc-nav-link.active) {
  color: #2563EB !important;
  background: #EFF6FF !important;
  border-right-color: #2563EB !important;
}

:global([data-theme="light"] .like-post-btn),
:global([data-theme="light"] .share-trigger-btn),
:global([data-theme="light"] .btn-copylink) {
  background: #F1F5F9 !important;
  border-color: #E2E8F0 !important;
  color: #1E293B !important;
}

:global([data-theme="light"] .views-count-pill) {
  background: #F1F5F9 !important;
  border-color: #E2E8F0 !important;
  color: #64748B !important;
}

:global([data-theme="light"] .article-keyword-chip) {
  background: #EFF6FF !important;
  color: #2563EB !important;
}

:global([data-theme="light"] .related-posts-section) {
  background: #F1F5F9 !important;
  border-top-color: #E2E8F0 !important;
}

/* Rendered Markdown Light Mode Content */
:global([data-theme="light"] .markdown-rendered-body) {
  color: #1E293B !important;
}

:global([data-theme="light"] .markdown-rendered-body p),
:global([data-theme="light"] .markdown-rendered-body li),
:global([data-theme="light"] .markdown-rendered-body ul),
:global([data-theme="light"] .markdown-rendered-body ol),
:global([data-theme="light"] .markdown-rendered-body span) {
  color: #1E293B !important;
}

:global([data-theme="light"] .markdown-rendered-body h1),
:global([data-theme="light"] .markdown-rendered-body h2),
:global([data-theme="light"] .markdown-rendered-body h3),
:global([data-theme="light"] .markdown-rendered-body h4),
:global([data-theme="light"] .markdown-rendered-body strong) {
  color: #0F172A !important;
}

:global([data-theme="light"] .markdown-rendered-body h2) {
  border-bottom-color: #E2E8F0 !important;
}

:global([data-theme="light"] .markdown-rendered-body blockquote) {
  background: #EFF6FF !important;
  border-right-color: #2563EB !important;
  color: #1E3A8A !important;
}

:global([data-theme="light"] .markdown-rendered-body table) {
  border-color: #E2E8F0 !important;
}

:global([data-theme="light"] .markdown-rendered-body th) {
  background: #F1F5F9 !important;
  color: #0F172A !important;
  border-color: #E2E8F0 !important;
}

:global([data-theme="light"] .markdown-rendered-body td) {
  color: #334155 !important;
  border-color: #E2E8F0 !important;
}

@media (max-width: 960px) {
  .article-layout-grid {
    grid-template-columns: 1fr;
  }
  .sticky-sidebar-inner {
    position: static;
  }
}
</style>
