<template>
  <section class="hero grid-bg" id="hero">
    <ClientOnly>
      <ThreeBackground v-if="isThreeJsEnabled" />
    </ClientOnly>

    <div class="container hero-inner">
      <v-row align="center" justify="space-between" class="hero-row">

        <!-- Left: Editorial Content -->
        <v-col cols="12" lg="7" md="7" class="hero-text-col">
          <!-- Availability Badge -->
          <div class="hero-badge" ref="elBadge" v-if="dev.available_for_work">
            <span class="badge-dot" />
            <span>{{ store.settings.availability_badge_text || 'متاح لاستقبال المشاريع والاستشارات الجديدة' }}</span>
          </div>

          <!-- Main Editorial Heading -->
          <h1 class="hero-h1" ref="elH1" v-if="(dev.name || dev.full_name) || dev.title || typed">
            <span class="hero-greeting" v-if="dev.name || dev.full_name">{{ t('hero.greeting') }}</span>
            <span class="hero-name" v-if="dev.name || dev.full_name">{{ dev.name || dev.full_name }}</span>
            <span class="hero-role" v-if="dev.title || typed">
              <span class="typed-wrap">
                <span class="typed-text">{{ typed || dev.title }}</span><span class="typed-cur">_</span>
              </span>
            </span>
          </h1>

          <!-- Confident Positioning Statement -->
          <p class="hero-sub" ref="elSub" v-if="dev.tagline || dev.bio">
            {{ isRtl ? (dev.tagline || dev.bio) : t('hero.tagline') }}
          </p>

          <!-- Action Buttons -->
          <div class="hero-ctas" ref="elCtas">
            <button class="btn btn-primary btn-lg" @click="go('#projects')">
              <span>{{ t('hero.exploreProjects') }}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-lg" @click="go('#contact')">
              <span>{{ t('hero.contactMe') }}</span>
            </button>
          </div>

          <!-- Architecture & Stack Spec Tags -->
          <div class="hero-spec-row" ref="elSocial" v-if="heroSpecSkills.length">
            <div class="spec-pill" v-for="skill in heroSpecSkills" :key="skill.id || skill.name">
              <v-icon :icon="skill.icon || 'mdi-check-decagram-outline'" size="15" :color="skill.color || '#38BDF8'" />
              <span>{{ skill.name }}</span>
            </div>
          </div>

          <!-- Verified Production Metrics -->
          <div class="hero-stats" ref="elStats" v-if="heroStats.length">
            <div class="hstat" v-for="s in heroStats" :key="s.label">
              <span class="hstat-val">{{ s.val }}</span>
              <span class="hstat-label">{{ s.label }}</span>
            </div>
          </div>
        </v-col>

        <!-- Right: Prominent Developer Photo & Identity Frame -->
        <v-col cols="12" lg="5" md="5" class="hero-avatar-col">
          <div class="avatar-wrap" ref="elAvatar">
            <!-- Main Portrait Frame -->
            <div class="avatar-frame">
              <img
                v-if="dev.avatar && !avatarLoadError"
                :src="dev.avatar"
                :alt="dev.name || dev.full_name"
                class="avatar-img"
                @error="avatarLoadError = true"
              />
              <div v-else class="d-flex align-center justify-center h-100 w-100 fallback-avatar">
                <v-icon icon="mdi-account-tie" size="110" color="var(--primary)" />
              </div>
            </div>

            <!-- Floating Stat Badge Top: Projects -->
            <div class="float-card fc-top" v-if="activeStats[0]">
              <div class="fc-icon-wrap" :style="{ '--badge-color': activeStats[0].color || '#3B82F6' }">
                <v-icon :icon="activeStats[0].icon || 'mdi-rocket-launch'" size="20" />
              </div>
              <div class="fc-content">
                <div class="fc-val">{{ activeStats[0].value }}{{ activeStats[0].suffix || '+' }}</div>
                <div class="fc-lbl">{{ activeStats[0].label }}</div>
              </div>
            </div>

            <!-- Floating Stat Badge Bottom: Clients / Statistics -->
            <div class="float-card fc-bottom" v-if="activeStats[1]">
              <div class="fc-icon-wrap" :style="{ '--badge-color': activeStats[1].color || '#10B981' }">
                <v-icon :icon="activeStats[1].icon || 'mdi-account-group-outline'" size="20" />
              </div>
              <div class="fc-content">
                <div class="fc-val">{{ activeStats[1].value }}{{ activeStats[1].suffix || '+' }}</div>
                <div class="fc-lbl">{{ activeStats[1].label }}</div>
              </div>
            </div>

            <!-- Live Availability Pill -->
            <div class="avail-badge" v-if="dev.available_for_work">
              <span class="avail-dot" />
              <span class="avail-text">{{ t('hero.liveBadgeText') }}</span>
            </div>
          </div>
        </v-col>

      </v-row>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'
import ThreeBackground from './ThreeBackground.vue'

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const dev = computed(() => store.developer || {})
const stats = computed(() => store.stats || [])
const activeStats = computed(() => {
  return stats.value.filter(s => s && s.is_active !== false)
})

const elBadge = ref(null), elH1 = ref(null), elSub = ref(null)
const elCtas = ref(null), elSocial = ref(null), elStats = ref(null), elAvatar = ref(null)
const avatarLoadError = ref(false)

const typed = ref('')
const roles = computed(() => {
  const custom = store.settings.hero_role_typing || store.settings.typing_roles
  if (custom) return custom.split(',').map(s => s.trim()).filter(Boolean)
  if (dev.value.title) return [dev.value.title]
  return []
})

let rIdx = 0, cIdx = 0, timer

function typeNext() {
  const currentRoles = roles.value
  if (!currentRoles.length) return
  const r = currentRoles[rIdx % currentRoles.length]
  if (cIdx <= r.length) { typed.value = r.slice(0, cIdx++); timer = setTimeout(typeNext, 70) }
  else timer = setTimeout(eraseNext, 2200)
}

function eraseNext() {
  const currentRoles = roles.value
  if (!currentRoles.length) return
  if (cIdx > 0) { typed.value = currentRoles[rIdx % currentRoles.length].slice(0, --cIdx); timer = setTimeout(eraseNext, 30) }
  else { rIdx = (rIdx + 1) % currentRoles.length; timer = setTimeout(typeNext, 250) }
}

const heroSpecSkills = computed(() => {
  const list = []
  if (store.skillCategories?.length) {
    store.skillCategories.forEach(cat => {
      if (Array.isArray(cat.skills)) {
        cat.skills.slice(0, 1).forEach(s => list.push(s))
      }
    })
  }
  return list.slice(0, 3)
})

const heroStats = computed(() => {
  if (activeStats.value.length) {
    return activeStats.value.slice(0, 3).map(s => ({
      val: `${s.value}${s.suffix || ''}`,
      label: s.label
    }))
  }
  return []
})

const isThreeJsEnabled = computed(() => {
  return store.settings.enable_particles_bg !== false && store.settings.enable_particles_bg !== 'false'
})

const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

onMounted(() => {
  gsap.from([elBadge.value, elH1.value, elSub.value, elCtas.value, elSocial.value, elStats.value].filter(Boolean),
    { y: 16, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.1 })
  if (elAvatar.value) {
    gsap.from(elAvatar.value, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 })
  }
  timer = setTimeout(typeNext, 500)
})

onUnmounted(() => clearTimeout(timer))
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--bg);
  padding-top: 40px;
}
.hero-inner { position: relative; z-index: 2; width: 100%; }
.hero-row { padding: clamp(80px, 10vw, 120px) 0 clamp(44px, 6vw, 68px); }

/* Availability Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 5px 12px;
  border-radius: var(--r-xs);
  background: var(--accent-subtle);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: var(--sp-4);
  font-family: var(--f-body);
}
.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse-dot 2s infinite;
  flex-shrink: 0;
}

/* Heading */
.hero-h1 {
  font-family: var(--f-display);
  font-size: clamp(2rem, 4.4vw, 3.4rem);
  font-weight: 800;
  line-height: 1.25;
  color: var(--t1);
  margin-bottom: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hero-greeting { font-size: 0.42em; font-weight: 500; color: var(--t3); }
.hero-name { font-size: 1em; font-weight: 800; color: var(--t1); }
.hero-role { font-size: 0.52em; font-weight: 600; color: var(--t2); }
.typed-wrap { color: var(--primary); font-weight: 700; }
.typed-cur { animation: cursor-blink 1s infinite; color: var(--primary); }

.hero-sub {
  font-size: clamp(0.94rem, 1.4vw, 1.1rem);
  color: var(--t2);
  line-height: 1.85;
  max-width: 600px;
  margin-bottom: var(--sp-6);
  font-family: var(--f-body);
}

/* CTAs */
.hero-ctas { display: flex; gap: var(--sp-3); flex-wrap: wrap; margin-bottom: var(--sp-5); }

/* Quick Spec Row */
.hero-spec-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  flex-wrap: wrap;
  margin-bottom: var(--sp-6);
}
.spec-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--r-xs);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
  font-size: 0.78rem;
  font-family: var(--f-mono);
}

/* Highlights */
.hero-stats {
  display: flex;
  gap: clamp(16px, 4vw, 36px);
  padding-top: var(--sp-5);
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}
.hstat { display: flex; flex-direction: column; min-width: 90px; }
.hstat-val {
  font-family: var(--f-mono);
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--t1);
}
.hstat-label { font-size: 0.8rem; color: var(--t3); font-family: var(--f-body); margin-top: 4px; }

.hero-avatar-col {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

@media (max-width: 960px) {
  .hero-avatar-col {
    margin-top: 48px;
  }
}

/* Avatar Frame & Identity Presentation */
.avatar-wrap {
  position: relative;
  width: clamp(290px, 28vw, 370px);
  height: clamp(370px, 36vw, 470px);
  margin: 0 auto;
  z-index: 2;
}

.avatar-frame {
  width: 100%;
  height: 100%;
  border-radius: var(--r-xl, 14px);
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border);
  background: var(--bg-card);
  box-shadow: var(--shadow-lg);
  z-index: 2;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.avatar-wrap:hover .avatar-frame {
  transform: translateY(-3px);
  border-color: var(--border-h);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.4s ease;
}

.avatar-wrap:hover .avatar-img {
  transform: scale(1.02);
}

.fallback-avatar {
  min-height: 370px;
  background: var(--bg-card);
}

/* Stationary Metric Badges */
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--r-lg, 10px);
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  font-family: var(--f-body, 'Cairo', sans-serif);
  z-index: 5;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.float-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-h);
  box-shadow: var(--shadow-lg);
}

.fc-top {
  top: 24px;
  right: -16px;
}

.fc-bottom {
  bottom: 24px;
  left: -16px;
}

.fc-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: var(--r-sm, 6px);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--badge-color, var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fc-content {
  display: flex;
  flex-direction: column;
}

.fc-val {
  font-size: 1.12rem;
  font-weight: 800;
  color: var(--t1);
  line-height: 1.2;
  font-family: var(--f-display, 'Tajawal', sans-serif);
  letter-spacing: -0.01em;
}

.fc-lbl {
  font-size: 0.74rem;
  color: var(--t3);
  font-weight: 600;
  margin-top: 1px;
}

/* Live Availability Status Pill */
.avail-badge {
  position: absolute;
  bottom: -14px;
  right: 50%;
  transform: translateX(50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 9999px;
  background: var(--bg-card);
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
  z-index: 6;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.avail-badge:hover {
  transform: translateX(50%) translateY(-1px);
  border-color: rgba(16, 185, 129, 0.6);
}

.avail-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
}

.avail-text {
  font-size: 0.78rem;
  font-weight: 700;
  color: #10B981;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Theme Overrides */
[data-theme="light"] .avatar-frame {
  border-color: var(--border);
  background: #FFFFFF;
  box-shadow: var(--shadow-md);
}

[data-theme="light"] .float-card {
  background: #FFFFFF;
  border-color: var(--border);
  box-shadow: var(--shadow-sm);
}

[data-theme="light"] .fc-val {
  color: var(--t1);
}

[data-theme="light"] .fc-lbl {
  color: var(--t3);
}

[data-theme="light"] .avail-badge {
  background: #FFFFFF;
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: var(--shadow-sm);
}

[data-theme="light"] .avail-text {
  color: #059669;
}

@media (max-width: 600px) {
  .hero-ctas { flex-direction: column; }
  .hero-ctas .btn { width: 100%; }
}
</style>
