<template>
  <section class="hero grid-bg" id="hero">
    <AnimatedBackground :variant="backgroundVariant" :particles-enabled="isThreeJsEnabled" />

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
          <h1 class="hero-h1" ref="elH1" v-if="(dev.name || dev.full_name) || dev.title">
            <span class="hero-greeting" v-if="dev.name || dev.full_name">{{ t('hero.greeting') }}</span>
            <span class="hero-name" v-if="dev.name || dev.full_name">{{ dev.name || dev.full_name }}</span>
            <span class="hero-role" v-if="dev.title">{{ dev.title }}</span>
          </h1>
          <div class="hero-skeleton-wrapper mb-4" v-else-if="store.isLoading || store.isWakingUp">
            <div class="skeleton-pill mb-2" style="width: 140px; height: 18px;" />
            <div class="skeleton-pill mb-2" style="width: min(320px, 80%); height: 42px;" />
            <div class="skeleton-pill" style="width: min(220px, 60%); height: 28px;" />
          </div>

          <!-- Confident Positioning Statement -->
          <p class="hero-sub" ref="elSub" v-if="dev.tagline || dev.bio">
            {{ isRtl ? (dev.tagline || dev.bio) : t('hero.tagline') }}
          </p>
          <div class="hero-skeleton-sub mb-4" v-else-if="store.isLoading || store.isWakingUp">
            <div class="skeleton-pill mb-2" style="width: min(480px, 95%); height: 16px;" />
            <div class="skeleton-pill" style="width: min(360px, 75%); height: 16px;" />
          </div>

          <!-- Action Buttons -->
          <div class="hero-ctas" ref="elCtas">
            <button class="btn btn-primary btn-lg" @click="go('#projects')">
              <span>{{ t('hero.exploreProjects') }}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
            <button class="btn btn-ghost btn-lg" @click="go('#contact')">
              <span>{{ t('hero.contactMe') }}</span>
            </button>
          </div>

        </v-col>

        <!-- Right: Prominent Developer Photo & Identity Frame -->
        <v-col cols="12" lg="5" md="5" class="hero-avatar-col">
          <div ref="elAvatar" class="d-flex justify-center w-100">
            <HeroAvatarFrame :dev="dev" />
          </div>
        </v-col>

      </v-row>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'
import HeroAvatarFrame from './HeroAvatarFrame.vue'
import AnimatedBackground from './AnimatedBackground.vue'

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const dev = computed(() => store.developer || {})
const elBadge = ref(null), elH1 = ref(null), elSub = ref(null)
const elCtas = ref(null), elAvatar = ref(null)
const avatarLoadError = ref(false)

const isThreeJsEnabled = computed(() => {
  return store.settings.enable_particles_bg !== false && store.settings.enable_particles_bg !== 'false'
})
const backgroundVariant = computed(() => {
  const allowed = ['constellation', 'aurora', 'orbit', 'horizon']
  const configured = store.settings.hero_background
  return allowed.includes(configured) ? configured : 'constellation'
})

const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.from([elBadge.value, elH1.value, elSub.value, elCtas.value].filter(Boolean),
    { y: 10, opacity: 0, duration: 0.36, stagger: 0.045, ease: 'power2.out' })
  if (elAvatar.value) gsap.from(elAvatar.value, { y: 12, opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.08 })
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: min(820px, 86svh);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--bg);
  padding-top: 40px;
}

.hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-row {
  padding: clamp(80px, 10vw, 120px) 0 clamp(44px, 6vw, 68px);
}

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
  line-height: 1.3;
  color: var(--t1);
  margin-bottom: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: 8px;
  letter-spacing: normal !important;
}

.hero-greeting {
  font-size: 0.42em;
  font-weight: 500;
  color: var(--t3);
  letter-spacing: normal !important;
}

.hero-name {
  font-size: 1em;
  font-weight: 800;
  color: var(--t1) !important;
  background: none !important;
  -webkit-background-clip: unset !important;
  -webkit-text-fill-color: var(--t1) !important;
  line-height: 1.3;
  letter-spacing: normal !important;
  word-spacing: 0.12em;
}

.hero-role {
  display: block;
  font-size: 0.52em;
  font-weight: 600;
  color: var(--t2);
  margin-top: 14px;
  margin-bottom: 12px;
  line-height: 1.6;
  min-height: 2em;
}

.typed-wrap {
  display: inline-block;
  color: var(--primary);
  font-weight: 800;
  padding: 4px 0;
  line-height: 1.6;
  word-break: break-word;
}

.typed-cur {
  display: inline-block;
  animation: cursor-blink 1s infinite;
  color: var(--primary);
  font-weight: 900;
  margin-inline-start: 2px;
}

.hero-sub {
  font-size: clamp(0.94rem, 1.4vw, 1.1rem);
  color: var(--t2);
  line-height: 1.85;
  max-width: 600px;
  margin-bottom: var(--sp-6);
  font-family: var(--f-body);
}

/* CTAs */
.hero-ctas {
  display: flex;
  gap: var(--sp-3);
  flex-wrap: wrap;
  margin-bottom: var(--sp-5);
}

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

.hstat {
  display: flex;
  flex-direction: column;
  min-width: 90px;
}

.hstat-val {
  font-family: var(--f-mono);
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--t1);
}

.hstat-label {
  font-size: 0.8rem;
  color: var(--t3);
  font-family: var(--f-body);
  margin-top: 4px;
}

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
  background: radial-gradient(circle at 40% 35%, rgba(56, 189, 248, 0.16), rgba(14, 165, 233, 0.08) 50%, transparent 75%);
  box-shadow: 0 0 60px rgba(56, 189, 248, 0.18);
  opacity: 0.85;
  z-index: 1;
  pointer-events: none;
  animation: aura-pulse 8s ease-in-out infinite alternate;
}

@keyframes aura-pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }

  100% {
    transform: scale(1.05);
    opacity: 1;
    filter: blur(48px);
  }
}

.avatar-glow-ring {
  position: absolute;
  inset: -5px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(129, 140, 248, 0.12) 50%, rgba(56, 189, 248, 0.18));
  opacity: 0.65;
  z-index: 1;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
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
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(56, 189, 248, 0.22);
  background: linear-gradient(180deg, rgba(18, 24, 38, 0.85) 0%, rgba(10, 13, 20, 0.95) 100%);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
}

.avatar-wrap:hover .avatar-frame {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 35px 65px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.22);
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
  background: linear-gradient(180deg, transparent 55%, rgba(10, 13, 20, 0.6) 85%, rgba(10, 13, 20, 0.9) 100%);
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
  background: rgba(15, 23, 42, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  font-family: var(--f-body, 'Cairo', sans-serif);
  z-index: 5;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.float-card:hover {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.75), 0 0 20px var(--badge-color, rgba(56, 189, 248, 0.3));
  border-color: rgba(56, 189, 248, 0.35);
}

.fc-top {
  top: -30px;
  right: -30Px;
  animation: float-badge-1 5s ease-in-out infinite alternate;
}

.fc-bottom {
  bottom: 24px;
  left: -30px;
  animation: float-badge-2 6s ease-in-out infinite alternate;
}

@keyframes float-badge-1 {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(1deg);
  }

  100% {
    transform: translateY(-3px) rotate(-1deg);
  }
}

@keyframes float-badge-2 {
  0% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(8px) rotate(-1deg);
  }

  100% {
    transform: translateY(3px) rotate(1deg);
  }
}

.fc-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid var(--badge-color, rgba(56, 189, 248, 0.25));
  color: var(--badge-color, #38BDF8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.12);
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
  background: rgba(11, 15, 23, 0.94);
  border: 1px solid rgba(16, 185, 129, 0.28);
  box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(16, 185, 129, 0.12);
  white-space: nowrap;
  z-index: 6;
  transition: all 0.3s ease;
}

.avail-badge:hover {
  transform: translateX(50%) translateY(-2px);
  box-shadow: 0 16px 35px -5px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.25);
  border-color: rgba(16, 185, 129, 0.50);
}

.avail-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse-dot 1.8s infinite;
}

.avail-text {
  font-size: 0.82rem;
  font-weight: 700;
  color: #34D399;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Light Theme Overrides */
:deep([data-theme="light"]) .hero-name,
:deep(html[data-theme="light"]) .hero-name,
:deep(.v-theme--light) .hero-name {
  color: var(--t1) !important;
  -webkit-text-fill-color: var(--t1) !important;
  text-shadow: none !important;
}

:deep([data-theme="light"]) .hero-greeting,
:deep(html[data-theme="light"]) .hero-greeting,
:deep(.v-theme--light) .hero-greeting {
  color: var(--t3) !important;
  -webkit-text-fill-color: var(--t3) !important;
}

:deep([data-theme="light"]) .typed-wrap,
:deep(html[data-theme="light"]) .typed-wrap,
:deep(.v-theme--light) .typed-wrap,
:deep([data-theme="light"]) .typed-cur,
:deep(html[data-theme="light"]) .typed-cur,
:deep(.v-theme--light) .typed-cur {
  color: var(--primary) !important;
  -webkit-text-fill-color: var(--primary) !important;
}

:deep([data-theme="light"]) .avatar-frame,
:deep(html[data-theme="light"]) .avatar-frame,
:deep(.v-theme--light) .avatar-frame {
  border-color: var(--border-h) !important;
  background: var(--bg-2) !important;
  box-shadow: var(--shadow-lg) !important;
}

:deep([data-theme="light"]) .avatar-shine,
:deep(html[data-theme="light"]) .avatar-shine,
:deep(.v-theme--light) .avatar-shine {
  display: none !important;
}

:deep([data-theme="light"]) .float-card,
:deep(html[data-theme="light"]) .float-card,
:deep(.v-theme--light) .float-card {
  background: var(--bg-card) !important;
  border-color: var(--border) !important;
  box-shadow: var(--shadow-md) !important;
}

:deep([data-theme="light"]) .float-card:hover,
:deep(html[data-theme="light"]) .float-card:hover,
:deep(.v-theme--light) .float-card:hover {
  background: var(--bg-card) !important;
  border-color: var(--border-h) !important;
  box-shadow: var(--shadow-lg) !important;
}

:deep([data-theme="light"]) .fc-val,
:deep(html[data-theme="light"]) .fc-val,
:deep(.v-theme--light) .fc-val {
  color: var(--t1) !important;
}

:deep([data-theme="light"]) .fc-lbl,
:deep(html[data-theme="light"]) .fc-lbl,
:deep(.v-theme--light) .fc-lbl {
  color: var(--t2) !important;
}

:deep([data-theme="light"]) .fc-icon-wrap,
:deep(html[data-theme="light"]) .fc-icon-wrap,
:deep(.v-theme--light) .fc-icon-wrap {
  background: var(--primary-subtle) !important;
  border-color: var(--primary-border) !important;
  box-shadow: var(--shadow-sm) !important;
}

:deep([data-theme="light"]) .avail-badge,
:deep(html[data-theme="light"]) .avail-badge,
:deep(.v-theme--light) .avail-badge {
  background: var(--bg-card) !important;
  border-color: rgba(16, 185, 129, 0.35) !important;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08), 0 0 15px rgba(16, 185, 129, 0.12) !important;
}

:deep([data-theme="light"]) .avail-text,
:deep(html[data-theme="light"]) .avail-text,
:deep(.v-theme--light) .avail-text {
  color: #059669 !important;
}

:deep([data-theme="light"]) .spec-pill,
:deep(html[data-theme="light"]) .spec-pill,
:deep(.v-theme--light) .spec-pill {
  background: var(--bg-card) !important;
  border-color: var(--border) !important;
  color: var(--t2) !important;
  box-shadow: var(--shadow-sm) !important;
}

@media (max-width: 880px) {

  /* إظهار بطاقة سنوات الخبرة في أعلى الصورة بشكل عائم ومتناسق */
  .float-card.fc-top {
    display: flex !important;
    top: -24px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    animation: float-badge-mobile-top 4s ease-in-out infinite alternate;
    padding: 8px 16px;
    border-radius: 14px;
    gap: 10px;
    z-index: 10;
    white-space: nowrap;
    box-shadow: 0 12px 28px -5px rgba(0, 0, 0, 0.65), 0 0 18px var(--badge-color, rgba(59, 130, 246, 0.25));
  }

  .float-card.fc-top .fc-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }

  .float-card.fc-top .fc-val {
    font-size: 1.05rem;
  }

  .float-card.fc-top .fc-lbl {
    font-size: 0.72rem;
  }

  /* إخفاء البطاقة السفلية فقط حتى لا تتداخل مع شارة التوفر وصورة المطور */
  .float-card.fc-bottom {
    display: none !important;
  }

  .avatar-wrap {
    width: clamp(260px, 72vw, 340px);
    height: clamp(330px, 88vw, 430px);
    margin: 32px auto 0 auto;
    /* مساحة علوية لإبراز البطاقة في أعلى الصورة */
  }
}

@keyframes float-badge-mobile-top {
  0% {
    transform: translateX(-50%) translateY(0px);
  }

  50% {
    transform: translateX(-50%) translateY(-5px);
  }

  100% {
    transform: translateX(-50%) translateY(-2px);
  }
}

@media (max-width: 600px) {
  .hero {
    min-height: auto;
  }

  .hero-ctas {
    flex-direction: column;
  }

  .hero-ctas .btn {
    width: 100%;
  }

  .float-card.fc-top {
    top: -22px;
    padding: 6px 12px;
    gap: 8px;
  }

  .float-card.fc-top .fc-icon-wrap {
    width: 30px;
    height: 30px;
    border-radius: 8px;
  }

  .float-card.fc-top .fc-val {
    font-size: 0.96rem;
  }

  .float-card.fc-top .fc-lbl {
    font-size: 0.68rem;
  }

  .avail-badge {
    padding: 6px 14px;
    bottom: -14px;
  }

  .avail-text {
    font-size: 0.76rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .badge-dot,
  .avatar-ambient-glow {
    animation: none !important;
  }
}

.skeleton-pill {
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.04) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.04) 75%);
  background-size: 200% 100%;
  animation: hero-skeleton-shimmer 1.5s ease-in-out infinite;
}

[data-theme="light"] .skeleton-pill {
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 25%, rgba(0, 0, 0, 0.08) 50%, rgba(0, 0, 0, 0.04) 75%);
}

@keyframes hero-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
