<template>
  <div
    class="hero-avatar-root"
    :class="[
      `model-${activeModel}`,
      { 'is-interactive': interactive && !previewMode, 'is-preview': previewMode }
    ]"
    ref="rootEl"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :style="cardTransformStyle"
  >
    <!-- ══════════════════════════════════════════════════════════════
         MODEL 1: ROYAL CRYSTAL GLASS (الزجاج الكريستالي الملكي الفاخر)
         ══════════════════════════════════════════════════════════════ -->
    <template v-if="activeModel === 'royal-glass'">
      <div v-if="enableGlow" class="royal-ambient-glow" />
      <div class="royal-outer-chamfer" />

      <div class="frame-container royal-frame">
        <div class="royal-specular-sheen" />

        <div class="img-wrapper">
          <img
            v-if="dev.avatar && !imageError"
            :src="dev.avatar"
            :alt="dev.name || dev.full_name || 'Avatar'"
            class="main-portrait"
            @error="imageError = true"
          />
          <div v-else class="fallback-portrait">
            <v-icon icon="mdi-account-tie" size="90" color="var(--primary, #38BDF8)" />
          </div>
        </div>

        <div class="frame-inner-overlay royal-overlay" />
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════════
         MODEL 2: CINEMATIC AMBIENT AURA (الهالة السينمائية المتوهجة)
         ══════════════════════════════════════════════════════════════ -->
    <template v-else-if="activeModel === 'cinematic-aura'">
      <div v-if="enableGlow" class="cinematic-bloom" />
      <div class="cinematic-edge-rim" />

      <div class="frame-container cinematic-frame">
        <div class="img-wrapper">
          <img
            v-if="dev.avatar && !imageError"
            :src="dev.avatar"
            :alt="dev.name || dev.full_name || 'Avatar'"
            class="main-portrait"
            @error="imageError = true"
          />
          <div v-else class="fallback-portrait">
            <v-icon icon="mdi-account-tie" size="90" color="var(--primary, #38BDF8)" />
          </div>
        </div>

        <div class="frame-inner-overlay cinematic-overlay" />
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════════
         MODEL 3: CYBER NEON EDGE (الهيكل السيبراني النيوني المتقن)
         ══════════════════════════════════════════════════════════════ -->
    <template v-else-if="activeModel === 'cyber-pulse'">
      <div v-if="enableGlow" class="cyber-pulse-aura" />
      <div class="cyber-running-border" />

      <div class="frame-container cyber-frame">
        <!-- Clean Corner Reticles (Outside the face, on frame border) -->
        <span class="cyber-corner tl" />
        <span class="cyber-corner tr" />
        <span class="cyber-corner bl" />
        <span class="cyber-corner br" />

        <div class="img-wrapper">
          <img
            v-if="dev.avatar && !imageError"
            :src="dev.avatar"
            :alt="dev.name || dev.full_name || 'Avatar'"
            class="main-portrait"
            @error="imageError = true"
          />
          <div v-else class="fallback-portrait">
            <v-icon icon="mdi-account-tie" size="90" color="var(--primary, #38BDF8)" />
          </div>
        </div>

        <div class="frame-inner-overlay cyber-overlay" />
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════════
         MODEL 4: ARCHITECTURAL IMPERIAL GOLD (الإطار الذهبي الملكي المعماري)
         ══════════════════════════════════════════════════════════════ -->
    <template v-else-if="activeModel === 'golden-luxury'">
      <div v-if="enableGlow" class="gold-warm-aura" />
      <div class="gold-metallic-rim" />

      <div class="frame-container gold-frame">
        <div class="img-wrapper gold-img-wrap">
          <img
            v-if="dev.avatar && !imageError"
            :src="dev.avatar"
            :alt="dev.name || dev.full_name || 'Avatar'"
            class="main-portrait"
            @error="imageError = true"
          />
          <div v-else class="fallback-portrait">
            <v-icon icon="mdi-account-tie" size="90" color="#F59E0B" />
          </div>
        </div>

        <div class="frame-inner-overlay gold-overlay" />
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════════
         MODEL 5: 3D INTERACTIVE PERSPECTIVE (المجسم ثلاثي الأبعاد التفاعلي)
         ══════════════════════════════════════════════════════════════ -->
    <template v-else-if="activeModel === '3d-perspective'">
      <div v-if="enableGlow" class="perspective-ambient-glow" />
      <div class="perspective-foil-rim" />

      <div class="frame-container perspective-frame">
        <div class="perspective-rainbow-sheen" />

        <div class="img-wrapper">
          <img
            v-if="dev.avatar && !imageError"
            :src="dev.avatar"
            :alt="dev.name || dev.full_name || 'Avatar'"
            class="main-portrait perspective-portrait"
            @error="imageError = true"
          />
          <div v-else class="fallback-portrait">
            <v-icon icon="mdi-account-tie" size="90" color="var(--primary, #38BDF8)" />
          </div>
        </div>

        <div class="frame-inner-overlay perspective-overlay" />
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════════
         MODEL 6: SWISS MINIMALIST STUDIO (استوديو المونوكروم السويسري الفاخر)
         ══════════════════════════════════════════════════════════════ -->
    <template v-else>
      <div v-if="enableGlow" class="minimal-diffuse-glow" />

      <div class="frame-container minimal-frame">
        <div class="minimal-mono-border" />
        
        <!-- Precision Corner Accents -->
        <div class="mono-notch n-tl" />
        <div class="mono-notch n-br" />

        <div class="img-wrapper">
          <img
            v-if="dev.avatar && !imageError"
            :src="dev.avatar"
            :alt="dev.name || dev.full_name || 'Avatar'"
            class="main-portrait"
            @error="imageError = true"
          />
          <div v-else class="fallback-portrait">
            <v-icon icon="mdi-account-tie" size="90" color="var(--primary, #38BDF8)" />
          </div>
        </div>

        <div class="frame-inner-overlay minimal-overlay" />
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════════
         UNIFIED FIXED DEFAULT FLOATING BADGES (الجمل والعناصر الثابتة)
         Guaranteed: Identical fixed texts & positioning across ALL models!
         ══════════════════════════════════════════════════════════════ -->
    <template v-if="enableBadges && !previewMode">
      <!-- 1. Top Floating Stat Badge (المشاريع / سنوات الخبرة) -->
      <div class="float-card fc-top" :class="`badge-theme-${activeModel}`">
        <div class="fc-icon-wrap" :style="{ '--badge-color': statTop.color }">
          <v-icon :icon="statTop.icon" size="20" />
        </div>
        <div class="fc-content">
          <div class="fc-val">{{ statTop.value }}</div>
          <div class="fc-lbl">{{ statTop.label }}</div>
        </div>
      </div>

      <!-- 2. Bottom Floating Stat Badge (العملاء / نسبة الإتقان) -->
      <div class="float-card fc-bottom" :class="`badge-theme-${activeModel}`">
        <div class="fc-icon-wrap" :style="{ '--badge-color': statBottom.color }">
          <v-icon :icon="statBottom.icon" size="20" />
        </div>
        <div class="fc-content">
          <div class="fc-val">{{ statBottom.value }}</div>
          <div class="fc-lbl">{{ statBottom.label }}</div>
        </div>
      </div>

      <!-- 3. Live Availability Pill (شارة التوفر المباشرة) -->
      <div class="avail-badge" :class="`badge-theme-${activeModel}`" v-if="dev.available_for_work !== false">
        <span class="avail-dot" />
        <span class="avail-text">{{ liveBadgeText }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'

const props = defineProps({
  dev: {
    type: Object,
    default: () => ({})
  },
  model: {
    type: String,
    default: ''
  },
  interactive: {
    type: Boolean,
    default: true
  },
  showBadges: {
    type: Boolean,
    default: null
  },
  showGlow: {
    type: Boolean,
    default: null
  },
  previewMode: {
    type: Boolean,
    default: false
  }
})

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const rootEl = ref(null)
const imageError = ref(false)

watch(() => props.dev?.avatar, () => {
  imageError.value = false
})

// Resolve active model: prop > store setting > default 'royal-glass'
const validModels = ['royal-glass', 'cinematic-aura', 'cyber-pulse', 'golden-luxury', '3d-perspective', 'minimal-monolith']

const activeModel = computed(() => {
  if (props.model) {
    if (validModels.includes(props.model)) return props.model
    // Migration alias for old names
    if (props.model === 'cyber-neon') return 'cyber-pulse'
    if (props.model === '3d-holo') return '3d-perspective'
    if (props.model === 'bento-beam') return 'cinematic-aura'
    if (props.model === 'architectural') return 'golden-luxury'
    if (props.model === 'minimal-studio') return 'minimal-monolith'
  }
  const setModel = store.settings?.hero_avatar_style
  if (setModel) {
    if (validModels.includes(setModel)) return setModel
    if (setModel === 'cyber-neon') return 'cyber-pulse'
    if (setModel === '3d-holo') return '3d-perspective'
    if (setModel === 'bento-beam') return 'cinematic-aura'
    if (setModel === 'architectural') return 'golden-luxury'
    if (setModel === 'minimal-studio') return 'minimal-monolith'
  }
  return 'royal-glass'
})

const enableGlow = computed(() => {
  if (props.showGlow !== null) return props.showGlow
  return store.settings?.hero_avatar_glow !== false && store.settings?.hero_avatar_glow !== 'false'
})

const enableBadges = computed(() => {
  if (props.showBadges !== null) return props.showBadges
  return store.settings?.hero_avatar_badges !== false && store.settings?.hero_avatar_badges !== 'false'
})

/* ══════════════════════════════════════════════════════════════
   UNIFIED FIXED DATA FOR FLOATING BADGES
   Guarantees that the texts & stats NEVER change between models!
   ══════════════════════════════════════════════════════════════ */
const stats = computed(() => store.stats || [])
const activeStats = computed(() => {
  return stats.value.filter(s => s && s.is_active !== false)
})

const statTop = computed(() => {
  if (activeStats.value[0]) {
    return {
      value: `${activeStats.value[0].value}${activeStats.value[0].suffix || '+'}`,
      label: activeStats.value[0].label,
      icon: activeStats.value[0].icon || 'mdi-rocket-launch',
      color: activeStats.value[0].color || '#3B82F6'
    }
  }
  return {
    value: `${props.dev?.years_of_experience || 5}+`,
    label: isRtl.value ? 'سنوات الخبرة والإنجاز' : 'Years of Experience',
    icon: 'mdi-rocket-launch',
    color: '#3B82F6'
  }
})

const statBottom = computed(() => {
  if (activeStats.value[1]) {
    return {
      value: `${activeStats.value[1].value}${activeStats.value[1].suffix || '+'}`,
      label: activeStats.value[1].label,
      icon: activeStats.value[1].icon || 'mdi-account-group-outline',
      color: activeStats.value[1].color || '#10B981'
    }
  }
  return {
    value: '100%',
    label: isRtl.value ? 'رضا العملاء والشركاء' : 'Client Satisfaction',
    icon: 'mdi-account-group-outline',
    color: '#10B981'
  }
})

const liveBadgeText = computed(() => {
  if (props.dev?.available_for_work === false) {
    return isRtl.value ? 'مشغول حالياً بمشاريع' : 'Currently Booked'
  }
  return t('hero.liveBadgeText', isRtl.value ? 'متاح لاستقبال الاستشارات والتعاقدات الآن' : 'Available for Engagements')
})

// Interactive 3D Perspective Tilt Logic
const tiltX = ref(0)
const tiltY = ref(0)

function handleMouseMove(e) {
  if (!props.interactive || props.previewMode || !rootEl.value) return
  const rect = rootEl.value.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  
  const maxTilt = activeModel.value === '3d-perspective' ? 12 : 5
  tiltX.value = (-y / (rect.height / 2)) * maxTilt
  tiltY.value = (x / (rect.width / 2)) * maxTilt
}

function handleMouseLeave() {
  tiltX.value = 0
  tiltY.value = 0
}

const cardTransformStyle = computed(() => {
  if (!props.interactive || props.previewMode || (tiltX.value === 0 && tiltY.value === 0)) {
    return {}
  }
  return {
    transform: `perspective(1000px) rotateX(${tiltX.value.toFixed(2)}deg) rotateY(${tiltY.value.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
    transition: 'transform 0.12s ease-out'
  }
})
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════════
   GLOBAL FRAME CONTAINER ARCHITECTURE
   ══════════════════════════════════════════════════════════════ */
.hero-avatar-root {
  position: relative;
  width: clamp(290px, 28vw, 370px);
  height: clamp(370px, 36vw, 470px);
  margin: 0 auto;
  z-index: 2;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hero-avatar-root.is-preview {
  width: 100% !important;
  max-width: 280px !important;
  height: 330px !important;
}

.frame-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  z-index: 2;
  transform-style: preserve-3d;
}

.img-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #0B0F19;
}

.main-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hero-avatar-root:hover .main-portrait {
  transform: scale(1.04);
}

.fallback-portrait {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
}

.frame-inner-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

/* ══════════════════════════════════════════════════════════════
   MODEL 1: ROYAL CRYSTAL GLASS
   ══════════════════════════════════════════════════════════════ */
.royal-frame {
  border-radius: 32px;
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow:
    0 30px 65px -15px rgba(0, 0, 0, 0.75),
    inset 0 1px 1px rgba(255, 255, 255, 0.35),
    inset 0 -1px 2px rgba(0, 0, 0, 0.4);
}

.royal-ambient-glow {
  position: absolute;
  inset: -24px;
  border-radius: 44px;
  background: radial-gradient(circle at 30% 20%, rgba(56, 189, 248, 0.25) 0%, transparent 55%),
              radial-gradient(circle at 75% 85%, rgba(129, 140, 248, 0.22) 0%, transparent 55%);
  filter: blur(34px);
  z-index: 1;
  pointer-events: none;
  animation: aura-breathe 7s ease-in-out infinite alternate;
}

@keyframes aura-breathe {
  0% { transform: scale(0.96); opacity: 0.7; }
  100% { transform: scale(1.05); opacity: 1; }
}

.royal-outer-chamfer {
  position: absolute;
  inset: -6px;
  border-radius: 38px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.02) 45%, rgba(56, 189, 248, 0.16) 100%);
  z-index: 1;
  pointer-events: none;
}

.royal-specular-sheen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, transparent 100%);
  border-radius: 32px 32px 0 0;
  pointer-events: none;
  z-index: 4;
}

.royal-overlay {
  background: linear-gradient(180deg, transparent 60%, rgba(10, 15, 29, 0.85) 100%);
}

/* ══════════════════════════════════════════════════════════════
   MODEL 2: CINEMATIC AMBIENT AURA
   ══════════════════════════════════════════════════════════════ */
.cinematic-frame {
  border-radius: 28px;
  border: 1.5px solid rgba(56, 189, 248, 0.35);
  background: #080C14;
  box-shadow:
    0 35px 75px -15px rgba(0, 0, 0, 0.9),
    0 0 40px rgba(56, 189, 248, 0.25);
}

.cinematic-bloom {
  position: absolute;
  inset: -32px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(16, 185, 129, 0.26) 0%, rgba(56, 189, 248, 0.22) 45%, transparent 70%);
  filter: blur(40px);
  z-index: 1;
  pointer-events: none;
  animation: cinematic-pulse 6s ease-in-out infinite alternate;
}

@keyframes cinematic-pulse {
  0% { transform: scale(0.94); opacity: 0.7; }
  100% { transform: scale(1.06); opacity: 1; filter: blur(46px); }
}

.cinematic-edge-rim {
  position: absolute;
  inset: -4px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, transparent 50%, rgba(56, 189, 248, 0.35) 100%);
  z-index: 1;
  pointer-events: none;
}

.cinematic-overlay {
  background: linear-gradient(180deg, transparent 55%, rgba(8, 12, 20, 0.9) 100%);
}

/* ══════════════════════════════════════════════════════════════
   MODEL 3: CYBER NEON EDGE
   ══════════════════════════════════════════════════════════════ */
.cyber-frame {
  border-radius: 24px;
  border: 1.5px solid rgba(56, 189, 248, 0.45);
  background: #060911;
  box-shadow:
    0 30px 65px -15px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(56, 189, 248, 0.25);
}

.cyber-pulse-aura {
  position: absolute;
  inset: -26px;
  border-radius: 34px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.26) 0%, rgba(168, 85, 247, 0.16) 50%, transparent 70%);
  filter: blur(34px);
  z-index: 1;
  pointer-events: none;
}

.cyber-running-border {
  position: absolute;
  inset: -3px;
  border-radius: 27px;
  background: conic-gradient(from 0deg, #38BDF8, #818CF8, #34D399, #38BDF8);
  opacity: 0.4;
  filter: blur(4px);
  z-index: 1;
  animation: spin-conic 8s linear infinite;
}

@keyframes spin-conic {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cyber-corner {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid #38BDF8;
  z-index: 6;
  pointer-events: none;
}
.cyber-corner.tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
.cyber-corner.tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }
.cyber-corner.bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }
.cyber-corner.br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

.cyber-overlay {
  background: linear-gradient(180deg, transparent 60%, rgba(6, 9, 17, 0.92) 100%);
}

/* ══════════════════════════════════════════════════════════════
         MODEL 4: ARCHITECTURAL IMPERIAL GOLD
         ══════════════════════════════════════════════════════════════ */
.gold-frame {
  border-radius: 38px 16px 38px 16px;
  border: 1.5px solid rgba(245, 158, 11, 0.45);
  background: #0B0E14;
  box-shadow:
    0 30px 65px -15px rgba(0, 0, 0, 0.85),
    0 0 35px rgba(245, 158, 11, 0.2);
}

.gold-img-wrap {
  border-radius: 36px 14px 36px 14px;
}

.gold-warm-aura {
  position: absolute;
  inset: -25px;
  border-radius: 46px 20px 46px 20px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.12) 50%, transparent 70%);
  filter: blur(36px);
  z-index: 1;
  pointer-events: none;
}

.gold-metallic-rim {
  position: absolute;
  inset: -5px;
  border-radius: 43px 21px 43px 21px;
  background: linear-gradient(135deg, rgba(253, 230, 138, 0.4) 0%, transparent 40%, rgba(245, 158, 11, 0.35) 100%);
  z-index: 1;
  pointer-events: none;
}

.gold-overlay {
  background: linear-gradient(180deg, transparent 60%, rgba(11, 14, 20, 0.95) 100%);
}

/* ══════════════════════════════════════════════════════════════
         MODEL 5: 3D INTERACTIVE PERSPECTIVE
         ══════════════════════════════════════════════════════════════ */
.perspective-frame {
  border-radius: 28px;
  border: 1.5px solid rgba(168, 85, 247, 0.38);
  background: #090B12;
  box-shadow:
    0 35px 75px -15px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(168, 85, 247, 0.22);
}

.perspective-ambient-glow {
  position: absolute;
  inset: -25px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(59, 130, 246, 0.18) 50%, transparent 70%);
  filter: blur(38px);
  z-index: 1;
  pointer-events: none;
}

.perspective-foil-rim {
  position: absolute;
  inset: -4px;
  border-radius: 32px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(56, 189, 248, 0.25) 100%);
  z-index: 1;
  pointer-events: none;
}

.perspective-rainbow-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 35%,
    rgba(255, 255, 255, 0.08) 48%,
    rgba(168, 85, 247, 0.15) 52%,
    transparent 65%
  );
  z-index: 4;
  pointer-events: none;
  animation: holo-sweep 7s ease-in-out infinite;
}

@keyframes holo-sweep {
  0% { transform: translateX(-100%); }
  45% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

.perspective-portrait {
  transform: translateZ(15px);
}

.perspective-overlay {
  background: linear-gradient(180deg, transparent 60%, rgba(9, 11, 18, 0.95) 100%);
}

/* ══════════════════════════════════════════════════════════════
         MODEL 6: SWISS MINIMALIST STUDIO
         ══════════════════════════════════════════════════════════════ */
.minimal-frame {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #07090D;
  box-shadow: 0 28px 65px -15px rgba(0, 0, 0, 0.9);
}

.minimal-diffuse-glow {
  position: absolute;
  inset: -16px;
  border-radius: 24px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.09) 0%, transparent 65%);
  filter: blur(28px);
  z-index: 1;
  pointer-events: none;
}

.mono-notch {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  z-index: 5;
  pointer-events: none;
}
.mono-notch.n-tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
.mono-notch.n-br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

.minimal-overlay {
  background: linear-gradient(180deg, transparent 65%, rgba(7, 9, 13, 0.95) 100%);
}

/* ══════════════════════════════════════════════════════════════
   UNIFIED FIXED FLOATING BADGES (THE ORIGINAL DEFAULT DESIGN)
   Identical sentences & positioning across all 6 models!
   ══════════════════════════════════════════════════════════════ */
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.88);
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
  box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.75), 0 0 25px var(--badge-color, rgba(59, 130, 246, 0.4));
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
  background: color-mix(in srgb, var(--badge-color, #3B82F6) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--badge-color, #3B82F6) 35%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--badge-color, #3B82F6);
  flex-shrink: 0;
  transition: all var(--t-fast);
}

.fc-content {
  display: flex;
  flex-direction: column;
}

.fc-val {
  font-family: var(--f-display, sans-serif);
  font-size: 1.25rem;
  font-weight: 800;
  color: #F8FAFC;
  line-height: 1.1;
}

.fc-lbl {
  font-size: 0.74rem;
  color: var(--t2, #94A3B8);
  white-space: nowrap;
}

/* Model-Themed Accents for Badges */
.float-card.badge-theme-cyber-pulse {
  border-color: rgba(56, 189, 248, 0.35);
  box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.7), 0 0 18px rgba(56, 189, 248, 0.2);
}

.float-card.badge-theme-cinematic-aura {
  border-color: rgba(16, 185, 129, 0.35);
  box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.2);
}

.float-card.badge-theme-3d-perspective {
  transform: translateZ(35px);
  border-color: rgba(168, 85, 247, 0.35);
}

.float-card.badge-theme-golden-luxury {
  border-radius: 20px 8px 20px 8px;
  border-color: rgba(245, 158, 11, 0.35);
}

.float-card.badge-theme-minimal-monolith {
  border-radius: 8px;
  border-color: rgba(255, 255, 255, 0.16);
}

/* Live Availability Pill */
.avail-badge {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.94);
  border: 1px solid rgba(16, 185, 129, 0.35);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(16, 185, 129, 0.2);
  z-index: 6;
  white-space: nowrap;
}

.avail-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 10px #10B981, 0 0 20px #10B981;
  animation: radar-ping 2s infinite;
}

.avail-text {
  font-size: 0.82rem;
  font-weight: 700;
  color: #6EE7B7;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

@keyframes radar-ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Light Theme Overrides */
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

/* Mobile Responsive */
@media (max-width: 880px) {
  .float-card.fc-top {
    display: flex !important;
    top: -24px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
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

  .float-card.fc-bottom {
    display: none !important;
  }

  .hero-avatar-root {
    width: clamp(260px, 72vw, 340px);
    height: clamp(330px, 88vw, 430px);
    margin: 32px auto 0 auto;
  }
}
</style>
