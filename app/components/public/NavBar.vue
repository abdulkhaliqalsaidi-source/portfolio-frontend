<template>
  <header class="nav" :class="{ scrolled }">
    <div class="nav-inner">

      <!-- Brand & Status Group -->
      <div class="nav-brand-group">
        <router-link to="/" class="nav-logo">
          <div class="logo-mark">
            <img v-if="isImageLogo(dev.logo) && !imageLoadError" :src="dev.logo" class="brand-logo-img" alt="Logo" @error="imageLoadError = true" />
            <v-icon v-else :icon="dev.logo || 'mdi-star-four-points'" size="18" color="var(--primary)" />
          </div>
          <div class="logo-text">
            <span class="logo-name" v-if="dev.name || dev.full_name">{{ dev.name || dev.full_name }}</span>
            <span class="logo-name" v-else>Portfolio</span>
            <span class="logo-role d-none d-sm-block" v-if="dev.title">{{ dev.title }}</span>
          </div>
        </router-link>

        <!-- Live Availability Badge (Interactive WOW) -->
        <div
          class="nav-availability-badge"
          :class="{ 'is-busy': dev.available_for_work === false }"
          :title="dev.available_for_work !== false ? t('nav.availableTooltip') : t('nav.busyTooltip')"
        >
          <span class="radar-pulse">
            <span class="radar-ring" />
            <span class="radar-dot" />
          </span>
          <span class="badge-label d-none d-md-inline">{{ dev.available_for_work !== false ? t('nav.availableForWork') : t('nav.currentlyBusy') }}</span>
        </div>
      </div>

      <!-- Desktop Nav Links -->
      <nav class="nav-links" v-show="!isMobileMenu" aria-label="التنقل الرئيسي">
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
      <div class="nav-actions" v-show="!isMobileMenu">

        <!-- Language Switcher Button (AR / EN) -->
        <button
          class="lang-toggle-btn"
          @click="toggleLocale"
          :title="locale === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'"
          aria-label="تبديل لغة الموقع"
        >
          <v-icon icon="mdi-translate" size="16" />
          <span>{{ locale === 'ar' ? 'EN' : 'عربي' }}</span>
        </button>

        <!-- Theme Toggle Button (Dark / Light) -->
        <button
          class="theme-toggle-btn"
          @click="toggleTheme"
          :class="{ 'is-light': !isDark }"
          :title="isDark ? t('nav.switchThemeLight') : t('nav.switchThemeDark')"
          aria-label="تبديل الوضع النهاري والليلي"
        >
          <span class="theme-sun-moon">
            <v-icon
              :icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
              size="17"
              :class="['theme-icon-animated', isDark ? 'icon-moon' : 'icon-sun']"
              :color="isDark ? '#A78BFA' : '#F59E0B'"
            />
          </span>
        </button>

        <button
          class="nav-icon-btn email-copy-btn"
          @click="copyEmail"
          :class="{ copied }"
          :title="copied ? t('nav.copied') : t('nav.copyEmail')"
          aria-label="نسخ البريد الإلكتروني"
          v-if="dev.email"
        >
          <v-icon :icon="copied ? 'mdi-check' : 'mdi-email-outline'" size="16" />
          <span v-if="copied" class="copy-tooltip">{{ t('nav.copied') }}</span>
        </button>

        <a v-if="dev.email" :href="`mailto:${dev.email}`" class="btn btn-ghost btn-sm nav-btn nav-contact-btn">
          {{ t('nav.contactMe') }}
        </a>

        <!-- PDF Resume Direct Download Action Button -->
        <a
          v-if="store.resumeUrl"
          :href="store.resumeUrl"
          :download="cvFileName"
          target="_blank"
          class="btn btn-primary btn-sm nav-btn cv-download-btn"
          :title="t('nav.downloadCv')"
        >
          <span class="pdf-pill font-mono">PDF</span>
          <span>{{ t('nav.resumePdf') }}</span>
          <v-icon icon="mdi-download" size="15" class="download-icon" />
        </a>

        <router-link to="/admin" class="admin-quick-btn" :title="t('nav.adminPanel')">
          <v-icon icon="mdi-shield-lock-outline" size="16" />
        </router-link>
      </div>

      <!-- Mobile Right Controls (Lang + Theme + Hamburger) -->
      <div class="mobile-controls" v-show="isMobileMenu">
        <button
          class="lang-toggle-btn mobile-lang-toggle"
          @click="toggleLocale"
          aria-label="تبديل لغة الموقع"
        >
          <span>{{ locale === 'ar' ? 'EN' : 'عربي' }}</span>
        </button>

        <button
          class="theme-toggle-btn mobile-theme-toggle"
          @click="toggleTheme"
          :class="{ 'is-light': !isDark }"
          :title="isDark ? t('nav.switchThemeLight') : t('nav.switchThemeDark')"
          :aria-label="isDark ? t('nav.switchThemeLight') : t('nav.switchThemeDark')"
        >
          <div class="theme-icon-slot">
            <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" size="16" />
          </div>
        </button>

        <!-- Mobile Hamburger Button -->
        <button
          class="nav-toggle"
          @click="open = !open"
          :aria-expanded="open"
          aria-label="القائمة"
        >
          <span class="bar" :class="{ open }" />
          <span class="bar" :class="{ open }" />
          <span class="bar" :class="{ open }" />
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
                <img v-if="isImageLogo(dev.logo) && !imageLoadError" :src="dev.logo" class="brand-logo-img" alt="Logo" @error="imageLoadError = true" />
                <v-icon v-else :icon="dev.logo || 'mdi-star-four-points'" color="#3B82F6" size="18" />
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
                <span class="text-caption font-weight-bold">{{ isDark ? t('nav.switchThemeLight') : t('nav.switchThemeDark') }}</span>
              </div>
              <span class="theme-mode-tag">{{ isDark ? (locale === 'ar' ? 'داكن' : 'Dark') : (locale === 'ar' ? 'فاتح' : 'Light') }}</span>
            </button>
          </div>

          <div class="mobile-sheet-footer">
            <a
              v-if="store.resumeUrl"
              :href="store.resumeUrl"
              :download="cvFileName"
              target="_blank"
              class="btn btn-primary w-100 mb-2 cv-mobile-download-btn"
              :title="t('nav.downloadCv')"
            >
              <span class="pdf-pill font-mono">PDF</span>
              <span>{{ t('nav.downloadCv') }}</span>
              <v-icon icon="mdi-download" size="16" class="download-icon" />
            </a>
            <div class="d-flex gap-2">
              <a v-if="dev.email" :href="`mailto:${dev.email}`" class="btn btn-ghost flex-1">
                <v-icon icon="mdi-email-outline" size="16" class="ml-1" />
                <span>{{ t('nav.contactMe') }}</span>
              </a>
              <router-link to="/admin" class="btn btn-ghost" @click="open = false">
                <v-icon icon="mdi-shield-lock-outline" size="16" class="ml-1" />
                <span>{{ t('nav.adminPanel') }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useTheme } from '~/composables/useTheme'
import { useLocale } from '~/composables/useLocale'
import { useRouter } from 'vue-router'

const store = usePortfolioStore()
const router = useRouter()
const dev = computed(() => store.developer)
const { isDark, toggle: toggleTheme } = useTheme()
const { locale, isRtl, toggleLocale, t } = useLocale()

const cvFileName = computed(() => {
  const name = dev.value?.name || dev.value?.full_name || 'Resume'
  return `${name.replace(/\s+/g, '_')}_CV.pdf`
})

const scrolled = ref(false)
const open = ref(false)
const activeSection = ref('hero')
const copied = ref(false)
const isMobileMenu = ref(false)
const imageLoadError = ref(false)

watch(() => dev.value?.logo, () => {
  imageLoadError.value = false
})

function checkMobile() {
  isMobileMenu.value = window.innerWidth <= 1080
}

function isImageLogo(val) {
  if (!val || typeof val !== 'string') return false
  const v = val.trim()
  return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/') || v.startsWith('data:image/') || /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(v)
}

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
    list.push({ label: t('nav.about'), href: '#stats' })
  }
  if (hasServices.value) {
    list.push({ label: t('nav.services'), href: '#services' })
  }
  if (hasSkills.value) {
    list.push({ label: t('nav.skills'), href: '#stack' })
  }
  if (hasProjects.value) {
    list.push({ label: t('nav.projects'), href: '#projects' })
  }
  if (hasBlog.value) {
    list.push({ label: t('nav.blog'), href: '#blog' })
  }
  if (hasTestimonials.value) {
    list.push({ label: t('nav.testimonials'), href: '#testimonials' })
  }
  if (hasTimeline.value) {
    list.push({ label: t('nav.experience'), href: '#timeline' })
  }
  if (store.settings.enable_contact !== false) {
    list.push({ label: t('nav.contact'), href: '#contact' })
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

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  checkMobile()
  window.addEventListener('resize', checkMobile, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', checkMobile)
})
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
  width: 100%;
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--container-px);
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  flex-wrap: nowrap;
}

.nav-brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

@media (max-width: 1080px) {
  .nav-inner {
    height: 62px;
    padding: 0 clamp(16px, 3vw, 24px);
    gap: 0;
  }
}
@media (max-width: 640px) {
  .nav-inner {
    height: 58px;
    padding: 0 12px;
  }
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
  overflow: hidden;
}
.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
  border-radius: inherit;
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

/* Live Availability Badge */
.nav-availability-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #10B981;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  white-space: nowrap;
}

@media (max-width: 1080px) {
  .nav-availability-badge {
    display: none !important;
  }
}

[data-theme="light"] .nav-availability-badge {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #059669;
}

.nav-availability-badge.is-busy {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.25);
  color: #F59E0B;
}

.radar-pulse {
  position: relative;
  width: 9px;
  height: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: #10B981;
  opacity: 0.5;
  animation: radar-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.is-busy .radar-ring {
  background: #F59E0B;
}

.radar-dot {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
}

.is-busy .radar-dot {
  background: #F59E0B;
}

@keyframes radar-ping {
  75%, 100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* Enhanced Theme Toggle Button */
.theme-toggle-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--bg-subtle, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--t1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.theme-toggle-btn:hover {
  background: var(--primary-subtle, rgba(99, 102, 241, 0.15));
  border-color: var(--primary, #6366F1);
  transform: translateY(-1px);
}

.theme-sun-moon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-toggle-btn:active .theme-sun-moon {
  transform: scale(0.85);
}

.theme-icon-animated.icon-sun {
  animation: rotate-sun 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-icon-animated.icon-moon {
  animation: rotate-moon 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes rotate-sun {
  from { transform: rotate(-90deg) scale(0.6); opacity: 0; }
  to { transform: rotate(0) scale(1); opacity: 1; }
}

@keyframes rotate-moon {
  from { transform: rotate(90deg) scale(0.6); opacity: 0; }
  to { transform: rotate(0) scale(1); opacity: 1; }
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

/* Nav Actions (Desktop) */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Mobile Controls (Theme + Burger) - Strictly hidden on desktop */
.mobile-controls {
  display: none !important;
}

@media (min-width: 1081px) {
  .mobile-controls {
    display: none !important;
  }
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE TIERS: LAPTOPS, TABLETS & MOBILE
   ═══════════════════════════════════════════════════════════ */

/* Tier 1: Small Laptops & Large Tablets in Landscape (1081px - 1280px) */
@media (max-width: 1280px) and (min-width: 1081px) {
  .nav-inner {
    padding: 0 16px;
    gap: 6px;
  }
  .nav-links {
    gap: 1px;
  }
  .nav-link {
    padding: 5px 8px !important;
    font-size: 0.81rem !important;
  }
  .logo-role {
    display: none !important;
  }
  .logo-name {
    max-width: 170px !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .nav-availability-badge .badge-label {
    display: none !important;
  }
  .nav-availability-badge {
    padding: 5px 8px;
  }
  .nav-contact-btn {
    display: none !important;
  }
  .cv-download-btn {
    padding: 5px 10px !important;
    font-size: 0.8rem !important;
    gap: 4px !important;
  }
  .cv-download-btn .pdf-pill {
    display: none !important;
  }
  .nav-actions {
    gap: 6px;
  }
}

/* Tier 2: Narrow Small Desktop Viewports (1081px - 1180px) */
@media (max-width: 1180px) and (min-width: 1081px) {
  .nav-availability-badge {
    display: none !important;
  }
  .email-copy-btn {
    display: none !important;
  }
  .nav-link {
    padding: 5px 6px !important;
    font-size: 0.78rem !important;
  }
  .lang-toggle-btn {
    padding: 0 8px;
    font-size: 0.78rem;
  }
}

/* Tier 3: Tablets in Portrait & Standard Landscape, and Small Screens (<= 1080px) */
@media (max-width: 1080px) {
  .nav-links {
    display: none !important;
  }
  .nav-actions {
    display: none !important;
  }
  .nav-availability-badge {
    display: none !important;
  }
  .mobile-controls {
    display: flex !important;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  /* Mobile lang toggle */
  .mobile-lang-toggle {
    height: 36px;
    min-width: 52px;
    padding: 0 10px;
    font-size: 0.8rem;
    border-radius: var(--r-sm);
    background: var(--bg-subtle, rgba(255,255,255,0.06));
    border: 1px solid var(--border);
    color: var(--t1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  .mobile-lang-toggle:hover {
    border-color: var(--primary-border);
    background: var(--primary-subtle);
    color: var(--primary);
  }

  /* Mobile theme toggle */
  .mobile-theme-toggle {
    width: 36px;
    height: 36px;
    border-radius: var(--r-sm);
    flex-shrink: 0;
  }

  /* Hamburger button */
  .nav-toggle {
    width: 38px;
    height: 38px;
    border-radius: var(--r-sm);
    flex-shrink: 0;
  }

  /* Logo name truncate on tablets */
  .logo-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .logo-role {
    display: none !important;
  }
}

/* Tier 4: Compact Mobile Phones (<= 640px) */
@media (max-width: 640px) {
  .logo-name {
    max-width: 130px !important;
    font-size: 0.88rem;
  }
  .mobile-controls {
    gap: 6px;
  }
  .mobile-lang-toggle {
    height: 34px;
    min-width: 46px;
    padding: 0 8px;
    font-size: 0.76rem;
  }
  .mobile-theme-toggle {
    width: 34px;
    height: 34px;
  }
  .nav-toggle {
    width: 36px;
    height: 36px;
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
  white-space: nowrap !important; /* CRITICAL: Ensures Arabic links like المسار المهني NEVER wrap! */
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

/* Hamburger nav-toggle (actual class used) */
.nav-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 38px;
  height: 38px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s;
}
.nav-toggle:hover {
  border-color: var(--primary-border);
  background: var(--primary-subtle);
}
.bar {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--t1);
  border-radius: 1px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}
.bar:nth-child(1).open { transform: translateY(7px) rotate(45deg); }
.bar:nth-child(2).open { opacity: 0; transform: scaleX(0); }
.bar:nth-child(3).open { transform: translateY(-7px) rotate(-45deg); }

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

/* ═══════════════════════════════════════════════════════════
   CV DIRECT PDF DOWNLOAD BUTTON ENHANCEMENTS
   ═══════════════════════════════════════════════════════════ */
.cv-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--primary);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: var(--shadow-sm);
  font-weight: 700;
  color: #FFFFFF !important;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: var(--r-xs, 6px);
  transition: all var(--t-fast);
}

.cv-download-btn:hover {
  transform: translateY(-1px);
  background: var(--primary-hover);
  box-shadow: var(--shadow-md);
  color: #FFFFFF !important;
}

.pdf-pill {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #EF4444;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 3px;
  letter-spacing: 0.4px;
  display: inline-flex;
  align-items: center;
  line-height: 1.2;
}

.download-icon {
  transition: transform 0.2s ease;
}

.cv-download-btn:hover .download-icon,
.cv-mobile-download-btn:hover .download-icon {
  transform: translateY(1px);
}

.cv-mobile-download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--primary);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-weight: 700;
  color: #FFFFFF !important;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: var(--r-xs, 6px);
  box-shadow: var(--shadow-sm);
}

.cv-mobile-download-btn:hover {
  background: var(--primary-hover);
  color: #FFFFFF !important;
}

[data-theme="light"] .cv-download-btn,
[data-theme="light"] .cv-mobile-download-btn {
  background: var(--primary) !important;
  color: #FFFFFF !important;
  border-color: rgba(37, 99, 235, 0.2) !important;
}
</style>
