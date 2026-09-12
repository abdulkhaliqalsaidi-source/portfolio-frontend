<template>
  <header class="nav" :class="{ scrolled }">
    <div class="nav-inner">

      <!-- Brand Logo -->
      <router-link to="/" class="nav-logo">
        <div class="logo-mark">
          <v-icon icon="mdi-star-four-points" size="18" color="var(--primary)" />
        </div>
        <div class="logo-text">
          <span class="logo-name" v-if="dev.name || dev.full_name">{{ dev.name || dev.full_name }}</span>
          <span class="logo-name" v-else>Portfolio</span>
          <span class="logo-role d-none d-sm-block" v-if="dev.title">{{ dev.title }}</span>
        </div>
      </router-link>

      <!-- Desktop Nav Links -->
      <nav class="nav-links" aria-label="التنقل الرئيسي">
        <a
          v-for="item in links" :key="item.label"
          class="nav-link" :href="item.href"
          :class="{ active: activeSection === item.href.slice(1) }"
          @click.prevent="go(item.href)"
        >
          {{ item.label }}
        </a>
      </nav>

      <!-- Desktop Actions -->
      <div class="nav-actions">

        <!-- Theme Toggle Button (Dark / Light) -->
        <button
          class="nav-icon-btn theme-toggle-btn"
          @click="toggleTheme"
          :title="isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'"
          aria-label="تبديل الوضع النهاري والليلي"
        >
          <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" size="18" :color="isDark ? '#F59E0B' : '#2563EB'" />
        </button>

        <button
          class="nav-icon-btn"
          @click="copyEmail"
          :class="{ copied }"
          :title="copied ? 'تم نسخ البريد!' : 'نسخ البريد الإلكتروني'"
          aria-label="نسخ البريد الإلكتروني"
          v-if="dev.email"
        >
          <v-icon :icon="copied ? 'mdi-check' : 'mdi-email-outline'" size="16" />
          <span v-if="copied" class="copy-tooltip">تم النسخ!</span>
        </button>

        <a v-if="dev.email" :href="`mailto:${dev.email}`" class="btn btn-ghost btn-sm nav-btn">
          تواصل معي
        </a>

        <a v-if="dev.resume" :href="dev.resume" target="_blank" class="btn btn-primary btn-sm nav-btn">
          <span>السيرة الذاتية</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </a>

        <router-link to="/admin" class="admin-quick-btn" title="لوحة التحكم الإدارية">
          <v-icon icon="mdi-shield-lock-outline" size="16" />
        </router-link>
      </div>

      <!-- Mobile Right Controls (Theme + Hamburger) -->
      <div class="mobile-controls">
        <button
          class="nav-icon-btn"
          @click="toggleTheme"
          aria-label="تبديل الوضع"
        >
          <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" size="18" :color="isDark ? '#F59E0B' : '#2563EB'" />
        </button>

        <!-- Mobile Hamburger Button -->
        <button class="burger" @click="open = !open" :class="{ active: open }" aria-label="القائمة">
          <span/><span/><span/>
        </button>
      </div>

    </div>

    <!-- Mobile Drawer Menu -->
    <transition name="mobile-menu">
      <div v-if="open" class="nav-mobile-overlay" @click.self="open = false">
        <div class="nav-mobile-sheet">
          <div class="mobile-sheet-head">
            <div class="d-flex align-center gap-2">
              <div class="logo-mark">
                <v-icon icon="mdi-star-four-points" color="#3B82F6" size="18" />
              </div>
              <span class="font-weight-bold" style="color:var(--t1)">{{ dev.name || dev.full_name }}</span>
            </div>
            <button class="close-mobile-btn" @click="open = false" aria-label="إغلاق">
              <v-icon icon="mdi-close" size="20" />
            </button>
          </div>

          <div class="mobile-nav-links">
            <a
              v-for="item in links" :key="item.label"
              class="mobile-link" :href="item.href"
              :class="{ active: activeSection === item.href.slice(1) }"
              @click.prevent="go(item.href); open=false"
            >
              {{ item.label }}
              <v-icon icon="mdi-chevron-left" size="16" class="text-caption" />
            </a>
          </div>

          <!-- Mobile Theme Switcher Row -->
          <div class="mobile-theme-row my-3">
            <button class="mobile-theme-btn" @click="toggleTheme">
              <div class="d-flex align-center gap-2">
                <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" size="18" :color="isDark ? '#F59E0B' : '#2563EB'" />
                <span class="text-caption font-weight-bold">{{ isDark ? 'التبديل للوضع النهاري' : 'التبديل للوضع الليلي' }}</span>
              </div>
              <span class="theme-mode-tag">{{ isDark ? 'داكن' : 'فاتح' }}</span>
            </button>
          </div>

          <div class="mobile-sheet-footer">
            <a v-if="dev.resume" :href="dev.resume" target="_blank" class="btn btn-primary w-100 mb-2">
              <v-icon icon="mdi-file-document-outline" size="16" class="ml-1" />
              تحميل السيرة الذاتية (CV)
            </a>
            <div class="d-flex gap-2">
              <a v-if="dev.email" :href="`mailto:${dev.email}`" class="btn btn-ghost flex-1">
                <v-icon icon="mdi-email-outline" size="16" class="ml-1" />
                راسلني
              </a>
              <router-link to="/admin" class="btn btn-ghost" @click="open = false">
                <v-icon icon="mdi-shield-lock-outline" size="16" class="ml-1" />
                لوحة التحكم
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useTheme } from '~/composables/useTheme'
import { useRouter } from 'vue-router'

const store = usePortfolioStore()
const router = useRouter()
const dev = computed(() => store.developer)
const { isDark, toggle: toggleTheme } = useTheme()

const scrolled = ref(false)
const open = ref(false)
const activeSection = ref('hero')
const copied = ref(false)

async function copyEmail() {
  const email = dev.value.email
  if (!email) return
  try {
    await navigator.clipboard.writeText(email)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('Failed to copy email:', e)
  }
}

const hasStats = computed(() => {
  return !!(
    dev.value?.bio ||
    dev.value?.tagline ||
    (store.stats && store.stats.length > 0) ||
    (store.skillCategories && store.skillCategories.length > 0) ||
    (store.techStack && Object.keys(store.techStack).length > 0)
  ) && store.settings.enable_stats !== false
})

const hasServices = computed(() => {
  return Array.isArray(store.services) && store.services.length > 0 && store.settings.enable_services !== false
})

const hasSkills = computed(() => {
  return (
    (Array.isArray(store.skillCategories) && store.skillCategories.length > 0) ||
    (store.techStack && Object.keys(store.techStack).length > 0)
  ) && store.settings.enable_skills !== false
})

const hasProjects = computed(() => {
  return Array.isArray(store.projects) && store.projects.length > 0 && store.settings.enable_projects !== false
})

const hasTestimonials = computed(() => {
  return Array.isArray(store.testimonials) && store.testimonials.length > 0 && store.settings.enable_testimonials !== false
})

const hasTimeline = computed(() => {
  return Array.isArray(store.timeline) && store.timeline.length > 0 && store.settings.enable_timeline !== false
})

const hasBlog = computed(() => {
  return Array.isArray(store.blogPosts) && store.blogPosts.length > 0 && store.settings.enable_blog !== false
})

const links = computed(() => {
  const list = []
  if (hasStats.value) {
    list.push({ label: 'عني', href: '#stats' })
  }
  if (hasServices.value) {
    list.push({ label: 'الخدمات', href: '#services' })
  }
  if (hasSkills.value) {
    list.push({ label: 'المهارات', href: '#stack' })
  }
  if (hasProjects.value) {
    list.push({ label: 'الأعمال', href: '#projects' })
  }
  if (hasBlog.value) {
    list.push({ label: 'المدونة', href: '#blog' })
  }
  if (hasTestimonials.value) {
    list.push({ label: 'آراء العملاء', href: '#testimonials' })
  }
  if (hasTimeline.value) {
    list.push({ label: 'المسار المهني', href: '#timeline' })
  }
  if (store.settings.enable_contact !== false) {
    list.push({ label: 'تواصل', href: '#contact' })
  }
  return list
})

const onScroll = () => {
  scrolled.value = window.scrollY > 20
  const ids = links.value.map(l => l.href.slice(1))
  for (const id of [...ids].reverse()) {
    const el = document.getElementById(id)
    if (el && window.scrollY >= el.offsetTop - 120) {
      activeSection.value = id
      break
    }
  }
}

const go = (href) => {
  if (href === '#blog') {
    const el = document.querySelector('#blog')
    if (el && window.location.pathname === '/') {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/blog')
    }
    return
  }

  if (window.location.pathname !== '/') {
    window.location.href = '/' + href
  } else {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  transition: background var(--t-base), border-color var(--t-base), box-shadow var(--t-base);
  border-bottom: 1px solid transparent;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.nav.scrolled {
  background: color-mix(in srgb, var(--bg) 95%, transparent);
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

.nav-inner {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--container-px);
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-decoration: none;
  flex-shrink: 0;
}
.logo-mark {
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--t-fast);
}
.nav-logo:hover .logo-mark {
  background: var(--primary);
  color: #fff;
}
.logo-text { display: flex; flex-direction: column; }
.logo-name {
  font-family: var(--f-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--t1);
  line-height: 1.2;
  white-space: nowrap;
}
.logo-role {
  font-size: 0.72rem;
  color: var(--t3);
  font-family: var(--f-mono);
  line-height: 1.2;
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* Nav Actions (Desktop) */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Mobile Controls (Theme + Burger) */
.mobile-controls {
  display: none;
}

@media (max-width: 880px) {
  .nav-links {
    display: none !important;
  }
  .nav-actions {
    display: none !important;
  }
  .mobile-controls {
    display: flex !important;
    align-items: center;
    gap: 8px;
  }
}

.nav-link {
  padding: 6px 12px;
  border-radius: var(--r-xs);
  font-size: 0.86rem;
  font-weight: 500;
  color: var(--t2);
  text-decoration: none;
  transition: all var(--t-fast);
  font-family: var(--f-body);
  position: relative;
}
.nav-link:hover {
  color: var(--t1);
  background: rgba(125, 125, 125, 0.08);
}
.nav-link.active {
  color: var(--primary);
  font-weight: 600;
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 12px;
  left: 12px;
  height: 2px;
  background: var(--primary);
  border-radius: 1px;
}

/* Actions */
.nav-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: var(--bg-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  transition: all var(--t-fast);
}
.nav-icon-btn:hover {
  color: var(--t1);
  border-color: var(--border-h);
  background: rgba(125, 125, 125, 0.08);
}
.nav-icon-btn.copied {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-subtle);
}

.copy-tooltip {
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translateX(50%) translateY(6px);
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--t1);
  font-size: 0.72rem;
  font-weight: 600;
  font-family: var(--f-body);
  padding: 3px 8px;
  border-radius: var(--r-xs);
  white-space: nowrap;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
}

.admin-quick-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: var(--bg-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--t3);
  text-decoration: none;
  transition: all var(--t-fast);
}
.admin-quick-btn:hover {
  border-color: var(--primary-border);
  color: var(--primary);
  background: var(--primary-subtle);
}

/* Hamburger */
.burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  cursor: pointer;
  padding: 8px;
}
.burger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--t1);
  border-radius: 1px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.burger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.burger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile Menu Sheet */
.nav-mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  justify-content: flex-end;
}
.nav-mobile-sheet {
  width: 100%;
  max-width: 320px;
  height: 100%;
  background: var(--bg-2);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.mobile-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}
.close-mobile-btn {
  background: transparent;
  border: none;
  color: var(--t2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav-links {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--r-xs);
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--t2);
  text-decoration: none;
  transition: all var(--t-fast);
}
.mobile-link:hover, .mobile-link.active {
  color: var(--primary);
  background: var(--primary-subtle);
}

.mobile-theme-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: var(--r-xs);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t1);
  cursor: pointer;
  font-family: var(--f-body);
}
.theme-mode-tag {
  font-size: 0.7rem;
  font-family: var(--f-mono);
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: var(--r-xs);
  color: var(--t2);
}

.mobile-sheet-footer {
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: opacity 0.25s ease;
}
.mobile-menu-enter-active .nav-mobile-sheet, .mobile-menu-leave-active .nav-mobile-sheet {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0;
}
.mobile-menu-enter-from .nav-mobile-sheet, .mobile-menu-leave-to .nav-mobile-sheet {
  transform: translateX(100%);
}
</style>
