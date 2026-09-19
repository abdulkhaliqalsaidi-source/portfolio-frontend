<template>
  <footer class="footer">
    <div class="footer-line" />
    <div class="container">
      <div class="footer-grid">

        <!-- Brand Info -->
        <div class="footer-brand">
          <div class="brand-row">
            <div class="brand-mark">
              <v-icon icon="mdi-star-four-points" size="18" color="var(--primary)" />
            </div>
            <span class="brand-name">{{ dev.name || dev.full_name }}</span>
          </div>
          <p class="brand-desc">{{ dev.tagline || dev.bio || dev.title }}</p>
          <div class="brand-socials">
            <a v-for="s in socials" :key="s.icon" :href="s.href" target="_blank" class="social-btn" :title="s.label" :aria-label="s.label">
              <v-icon :icon="s.icon" size="16" />
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div v-for="col in cols" :key="col.title" class="footer-col">
          <h4 class="col-title">{{ col.title }}</h4>
          <div class="col-links">
            <a v-for="l in col.links" :key="l.label" :href="l.href" class="col-link" @click.prevent="nav(l.href)">
              {{ l.label }}
            </a>
          </div>
        </div>

      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <span class="copy">© {{ year }} {{ dev.name || dev.full_name }} — {{ t('footer.rights') }}</span>
        <span class="made">
          {{ t('footer.builtWith') }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const dev = computed(() => store.developer || {})
const year = new Date().getFullYear()

const socials = computed(() => {
  const list = []
  if (dev.value.email) list.push({ label: 'Email', icon: 'mdi-email-outline', href: `mailto:${dev.value.email}` })
  if (dev.value.phone) list.push({ label: 'WhatsApp', icon: 'mdi-whatsapp', href: `https://wa.me/${dev.value.whatsapp || dev.value.phone.replace(/[^0-9]/g, '')}` })
  if (dev.value.linkedin) list.push({ label: 'LinkedIn', icon: 'mdi-linkedin', href: dev.value.linkedin })
  if (dev.value.behance) list.push({ label: 'Behance', icon: 'mdi-behance', href: dev.value.behance })
  if (dev.value.dribbble) list.push({ label: 'Dribbble', icon: 'mdi-dribbble', href: dev.value.dribbble })
  if (dev.value.instagram) list.push({ label: 'Instagram', icon: 'mdi-instagram', href: dev.value.instagram })
  if (dev.value.twitter) list.push({ label: 'X', icon: 'mdi-twitter', href: dev.value.twitter })
  if (dev.value.youtube) list.push({ label: 'YouTube', icon: 'mdi-youtube', href: dev.value.youtube })
  if (dev.value.website) list.push({ label: 'Website', icon: 'mdi-web', href: dev.value.website })
  if (dev.value.github) list.push({ label: 'GitHub', icon: 'mdi-github', href: dev.value.github })
  return list
})

const siteLinks = computed(() => {
  const list = []
  if (dev.value?.bio || dev.value?.tagline || (store.stats && store.stats.length > 0)) {
    list.push({ label: t('nav.about'), href: '#stats' })
  }
  if (Array.isArray(store.services) && store.services.length > 0 && store.settings.enable_services !== false) {
    list.push({ label: t('nav.services'), href: '#services' })
  }
  if (((store.techStack && Object.keys(store.techStack).length > 0) || (store.skillCategories && store.skillCategories.length > 0)) && store.settings.enable_skills !== false) {
    list.push({ label: t('nav.skills'), href: '#stack' })
  }
  if (Array.isArray(store.projects) && store.projects.length > 0 && store.settings.enable_projects !== false) {
    list.push({ label: t('nav.projects'), href: '#projects' })
  }
  if (Array.isArray(store.testimonials) && store.testimonials.length > 0 && store.settings.enable_testimonials !== false) {
    list.push({ label: t('nav.testimonials'), href: '#testimonials' })
  }
  if (Array.isArray(store.timeline) && store.timeline.length > 0 && store.settings.enable_timeline !== false) {
    list.push({ label: t('nav.experience'), href: '#timeline' })
  }
  return list
})

const cols = computed(() => [
  { title: isRtl.value ? 'أقسام الموقع' : 'Navigation', links: siteLinks.value },
  { title: isRtl.value ? 'روابط وتواصل' : 'Connect', links: [
    { label: t('nav.contactMe'), href: '#contact' },
    { label: t('nav.downloadCv'), href: store.resumeUrl },
    { label: t('nav.adminPanel'), href: '/admin' },
  ]},
])

function nav(href) {
  if (href.startsWith('#')) {
    if (window.location.pathname !== '/') {
      window.location.href = '/' + href
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  } else if (href.startsWith('/')) {
    window.location.href = href
  } else {
    window.open(href, '_blank')
  }
}
</script>

<style scoped>
.footer {
  background: var(--bg);
  position: relative;
  overflow: hidden;
}
.footer-line {
  height: 1px;
  background: var(--border);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: clamp(24px, 4vw, 48px);
  padding: clamp(48px, 6vw, 64px) 0 clamp(24px, 3vw, 36px);
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: var(--r-sm, 6px);
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}
.brand-name {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--t1);
}
.brand-desc {
  font-size: 0.86rem;
  color: var(--t3);
  line-height: 1.8;
  max-width: 340px;
  font-family: var(--f-body, 'Cairo', sans-serif);
  margin-bottom: 18px;
}
.brand-socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.social-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--r-xs, 4px);
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  text-decoration: none;
  transition: all var(--t-fast);
}
.social-btn:hover {
  color: var(--primary);
  border-color: var(--border-h);
  background: var(--primary-subtle);
  transform: translateY(-1px);
}

.col-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 16px;
}
.col-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.col-link {
  font-size: 0.84rem;
  color: var(--t3);
  text-decoration: none;
  font-family: var(--f-body, 'Cairo', sans-serif);
  transition: color var(--t-fast);
  cursor: pointer;
}
.col-link:hover {
  color: var(--primary);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 12px;
}
.copy, .made {
  font-size: 0.82rem;
  color: var(--t3);
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Theme Overrides */
[data-theme="light"] .social-btn {
  background: #F8FAFC;
  border-color: #E2E8F0;
  color: #64748B;
}
[data-theme="light"] .social-btn:hover {
  background: #EFF6FF;
  border-color: #BFDBFE;
  color: #1D4ED8;
}
[data-theme="light"] .footer-bottom {
  border-top-color: #E2E8F0;
}

@media (max-width: 960px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: span 2; }
}

@media (max-width: 600px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-brand { grid-column: span 1; }
  .footer-bottom { flex-direction: column; text-align: center; justify-content: center; }
}
</style>
