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
            <span class="hero-greeting" v-if="dev.name || dev.full_name">مرحباً بك، أنا</span>
            <span class="hero-name" v-if="dev.name || dev.full_name">{{ dev.name || dev.full_name }}</span>
            <span class="hero-role" v-if="dev.title || typed">
              <span class="typed-wrap">
                <span class="typed-text">{{ typed || dev.title }}</span><span class="typed-cur">_</span>
              </span>
            </span>
          </h1>

          <!-- Confident Positioning Statement -->
          <p class="hero-sub" ref="elSub" v-if="dev.tagline || dev.bio">
            {{ dev.tagline || dev.bio }}
          </p>

          <!-- Action Buttons -->
          <div class="hero-ctas" ref="elCtas">
            <button class="btn btn-primary btn-lg" @click="go('#projects')">
              <span>استكشف الأعمال والإنجازات</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="btn btn-ghost btn-lg" @click="go('#contact')">
              <span>تواصل مباشر</span>
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
            <!-- Dynamic 3D Ambient Aura & Glow Mesh -->
            <div class="avatar-ambient-glow" />
            <div class="avatar-glow-ring" />

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
              <div class="avatar-shine" />
              <div class="avatar-border-glow" />
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
              <span class="avail-text">متاح لاستقبال المشاريع الآن</span>
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
import ThreeBackground from './ThreeBackground.vue'

const store = usePortfolioStore()
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

/* Ambient Aura & Rings */
.avatar-ambient-glow {
  position: absolute;
  inset: -20px;
  border-radius: 40px;
  background: radial-gradient(circle at 35% 30%, rgba(59, 130, 246, 0.45), rgba(123, 110, 246, 0.35) 45%, rgba(16, 185, 129, 0.25) 75%, transparent 90%);
  filter: blur(40px);
  opacity: 0.85;
  z-index: 1;
  pointer-events: none;
  animation: aura-pulse 8s ease-in-out infinite alternate;
}
@keyframes aura-pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  100% { transform: scale(1.05); opacity: 1; filter: blur(48px); }
}

.avatar-glow-ring {
  position: absolute;
  inset: -5px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(123, 110, 246, 0.3) 50%, rgba(16, 185, 129, 0.4));
  opacity: 0.65;
  z-index: 1;
  filter: blur(8px);
}

/* Avatar Frame */
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
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
}

.avatar-wrap:hover .avatar-frame {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 35px 65px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.3);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.avatar-wrap:hover .avatar-img {
  transform: scale(1.04);
}

.fallback-avatar {
  min-height: 370px;
  background: linear-gradient(135deg, var(--bg-subtle), var(--bg-2));
}

.avatar-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(10, 15, 29, 0.6) 85%, rgba(10, 15, 29, 0.9) 100%);
  pointer-events: none;
}

.avatar-border-glow {
  position: absolute;
  inset: 0;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

/* Floating Bento Badges */
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
  font-family: var(--f-body, 'Cairo', sans-serif);
  z-index: 5;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.float-card:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(59, 130, 246, 0.3);
  border-color: rgba(255, 255, 255, 0.25);
}

.fc-top {
  top: 24px;
  right: -24px;
  animation: float-badge-1 5s ease-in-out infinite alternate;
}

.fc-bottom {
  bottom: 30px;
  left: -24px;
  animation: float-badge-2 6s ease-in-out infinite alternate;
}

@keyframes float-badge-1 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
  100% { transform: translateY(-3px) rotate(-1deg); }
}

@keyframes float-badge-2 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(8px) rotate(-1deg); }
  100% { transform: translateY(3px) rotate(1deg); }
}

.fc-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05));
  border: 1px solid var(--badge-color, rgba(59, 130, 246, 0.4));
  color: var(--badge-color, #3B82F6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.25);
  flex-shrink: 0;
}

.fc-content {
  display: flex;
  flex-direction: column;
}

.fc-val {
  font-size: 1.18rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.2;
  font-family: var(--f-display, 'Tajawal', sans-serif);
  letter-spacing: -0.02em;
}

.fc-lbl {
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  margin-top: 1px;
}

/* Live Availability Status Pill */
.avail-badge {
  position: absolute;
  bottom: -16px;
  right: 50%;
  transform: translateX(50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 100px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.45);
  box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.25);
  white-space: nowrap;
  z-index: 6;
  transition: all 0.3s ease;
}

.avail-badge:hover {
  transform: translateX(50%) translateY(-2px);
  box-shadow: 0 16px 35px -5px rgba(0, 0, 0, 0.7), 0 0 25px rgba(16, 185, 129, 0.4);
  border-color: rgba(16, 185, 129, 0.7);
}

.avail-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 10px #10B981;
  animation: pulse-dot 1.8s infinite;
}

.avail-text {
  font-size: 0.82rem;
  font-weight: 800;
  color: #34D399;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Theme Overrides */
[data-theme="light"] .avatar-frame {
  border-color: rgba(255, 255, 255, 0.9);
  background: linear-gradient(180deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.95));
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.8);
}

[data-theme="light"] .float-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

[data-theme="light"] .fc-val {
  color: #0F172A;
}

[data-theme="light"] .fc-lbl {
  color: #64748B;
}

[data-theme="light"] .avail-badge {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 12px 30px -5px rgba(16, 185, 129, 0.18);
}

[data-theme="light"] .avail-text {
  color: #059669;
}

@media (max-width: 600px) {
  .hero-ctas { flex-direction: column; }
  .hero-ctas .btn { width: 100%; }
}
</style>
