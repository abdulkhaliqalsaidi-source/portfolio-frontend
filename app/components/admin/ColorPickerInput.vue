<template>
  <div class="color-picker-wrapper">
    <label v-if="label" class="field-label">{{ label }}</label>

    <v-menu
      v-model="menuOpen"
      :close-on-content-click="false"
      location="bottom start"
      transition="scale-transition"
      offset="8"
    >
      <template #activator="{ props: menuProps }">
        <button
          type="button"
          class="color-trigger-btn"
          v-bind="menuProps"
          :disabled="disabled"
          :style="{ '--active-color': currentColor }"
        >
          <!-- Color Preview Swatch -->
          <div class="color-preview-box">
            <span class="color-swatch-circle" :style="{ backgroundColor: currentColor }">
              <span class="swatch-glow" />
            </span>
          </div>

          <!-- Color Hex Text -->
          <span class="color-hex-text">{{ currentColor }}</span>

          <!-- Trailing Palette Icon -->
          <div class="color-btn-actions">
            <v-icon icon="mdi-palette" size="18" class="palette-icon" />
            <v-icon :icon="menuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="16" class="chevron-icon" />
          </div>
        </button>
      </template>

      <!-- Dropdown Popup Card -->
      <div class="color-picker-popover">
        <!-- Popover Header -->
        <div class="popover-header">
          <div class="d-flex align-center gap-2">
            <span class="swatch-badge" :style="{ backgroundColor: currentColor }" />
            <span class="popover-title">اختيار اللون</span>
          </div>
          <span class="hex-badge">{{ currentColor }}</span>
        </div>

        <!-- Preset Swatches Grid -->
        <div class="palette-presets-wrap">
          <span class="presets-sub">ألوان متناسقة مقترحة:</span>
          <div class="presets-grid">
            <button
              v-for="c in defaultPresets"
              :key="c"
              type="button"
              class="preset-circle-btn"
              :class="{ selected: currentColor.toLowerCase() === c.toLowerCase() }"
              :style="{ backgroundColor: c }"
              :title="c"
              @click="selectColor(c)"
            >
              <v-icon
                v-if="currentColor.toLowerCase() === c.toLowerCase()"
                icon="mdi-check"
                size="14"
                :color="isLightColor(c) ? '#0F172A' : '#FFFFFF'"
              />
            </button>
          </div>
        </div>

        <!-- Full Spectrum Color Picker (Vuetify) -->
        <div class="advanced-picker-wrap">
          <span class="presets-sub mb-2 d-block">أو اختر بحرية من اللوحة:</span>
          <v-color-picker
            v-model="internalColor"
            mode="hex"
            elevation="0"
            rounded="lg"
            class="custom-vuetify-picker"
            @update:model-value="onColorChange"
          />
        </div>

        <!-- Popover Footer -->
        <div class="popover-footer">
          <div class="manual-input-wrap">
            <input
              type="text"
              v-model="internalColor"
              maxlength="9"
              placeholder="#3B82F6"
              class="manual-hex-input"
              @input="onColorChange(internalColor)"
            />
          </div>
          <button type="button" class="btn-done" @click="menuOpen = false">
            <v-icon icon="mdi-check" size="14" class="ml-1" />
            <span>تأكيد</span>
          </button>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '#3B82F6'
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const menuOpen = ref(false)
const internalColor = ref(props.modelValue || '#3B82F6')

const currentColor = computed(() => {
  if (!props.modelValue || props.modelValue.trim() === '') return '#3B82F6'
  return props.modelValue
})

watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal !== internalColor.value) {
    internalColor.value = newVal
  }
})

const defaultPresets = [
  '#3B82F6', '#2563EB', '#1D4ED8', '#60A5FA', // Blues
  '#06B6D4', '#0EA5E9', '#38BDF8', '#0891B2', // Sky & Cyan
  '#10B981', '#059669', '#22C55E', '#16A34A', // Emerald & Green
  '#7B6EF6', '#8B5CF6', '#6366F1', '#A855F7', // Violet & Indigo
  '#F59E0B', '#D97706', '#F97316', '#EA580C', // Amber & Orange
  '#EF4444', '#F43F5E', '#E11D48', '#DC2626', // Red & Rose
  '#EC4899', '#D946EF', '#C026D3', '#9333EA', // Pink & Purple
  '#64748B', '#475569', '#94A3B8', '#E2E8F0', // Slates
]

function selectColor(hex) {
  internalColor.value = hex
  emit('update:modelValue', hex)
}

function onColorChange(val) {
  if (val) {
    const formatted = typeof val === 'string' ? val : (val.hex || '#3B82F6')
    emit('update:modelValue', formatted)
  }
}

function isLightColor(hex) {
  if (!hex || typeof hex !== 'string') return false
  const c = hex.replace('#', '')
  if (c.length < 6) return false
  const r = parseInt(c.substr(0, 2), 16)
  const g = parseInt(c.substr(2, 2), 16)
  const b = parseInt(c.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 160
}
</script>

<style scoped>
.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.field-label {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 0.84rem;
  font-weight: 700;
  color: #94A3B8;
  margin-bottom: 6px;
  display: block;
}

/* Trigger Button */
.color-trigger-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;
  padding: 0 14px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: right;
  position: relative;
  overflow: hidden;
}

.color-trigger-btn:hover:not(:disabled) {
  border-color: var(--active-color, #3B82F6);
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.15);
}

.color-trigger-btn:focus-visible {
  outline: 2px solid var(--active-color, #3B82F6);
  outline-offset: 2px;
}

.color-trigger-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Swatch Preview inside Trigger */
.color-preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.color-swatch-circle {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  display: block;
}

.swatch-glow {
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  background: inherit;
  filter: blur(4px);
  opacity: 0.5;
  z-index: -1;
}

.color-hex-text {
  font-family: var(--f-mono, 'Tajawal', monospace);
  font-size: 0.95rem;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0.05em;
  direction: ltr;
}

.color-btn-actions {
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94A3B8;
}

.palette-icon {
  color: var(--active-color, #3B82F6);
}

.chevron-icon {
  transition: transform 0.2s ease;
}

/* Popover Content Container */
.color-picker-popover {
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  padding: 16px;
  width: 320px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(59, 130, 246, 0.15);
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.swatch-badge {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: inline-block;
  box-shadow: 0 0 6px currentColor;
}

.popover-title {
  font-size: 0.88rem;
  font-weight: 800;
  color: #FFFFFF;
}

.hex-badge {
  font-family: var(--f-mono, monospace);
  font-size: 0.8rem;
  font-weight: 800;
  color: #38BDF8;
  background: rgba(56, 189, 248, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.25);
  direction: ltr;
}

.presets-sub {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94A3B8;
  margin-bottom: 8px;
  display: block;
}

/* Presets Grid */
.palette-presets-wrap {
  margin-bottom: 14px;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
}

.preset-circle-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.preset-circle-btn:hover {
  transform: scale(1.18);
  z-index: 2;
  box-shadow: 0 0 10px currentColor;
  border-color: #FFFFFF;
}

.preset-circle-btn.selected {
  transform: scale(1.12);
  border-color: #FFFFFF;
  box-shadow: 0 0 12px currentColor, 0 0 0 2px rgba(255, 255, 255, 0.4);
}

/* Advanced Picker */
.advanced-picker-wrap {
  margin-bottom: 12px;
}

:deep(.v-color-picker) {
  background: transparent !important;
}

:deep(.v-color-picker-canvas) {
  border-radius: 10px !important;
  overflow: hidden;
}

:deep(.v-color-picker-edit) {
  margin-top: 8px;
}

:deep(.v-color-picker-edit .v-color-picker-edit__input input) {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #FFFFFF !important;
  border-radius: 8px !important;
  text-align: center;
  font-family: var(--f-mono, monospace) !important;
}

/* Popover Footer */
.popover-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.manual-input-wrap {
  flex: 1;
}

.manual-hex-input {
  width: 100%;
  height: 36px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #FFFFFF;
  font-family: var(--f-mono, monospace);
  font-size: 0.88rem;
  font-weight: 700;
  padding: 0 10px;
  direction: ltr;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}

.manual-hex-input:focus {
  border-color: #3B82F6;
}

.btn-done {
  height: 36px;
  padding: 0 16px;
  background: linear-gradient(135deg, var(--primary, #3B82F6), #2563EB);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.2s, transform 0.2s;
}

.btn-done:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Light Theme Overrides */
[data-theme="light"] .color-trigger-btn {
  background: #FFFFFF;
  border-color: #E2E8F0;
}

[data-theme="light"] .color-trigger-btn:hover:not(:disabled) {
  background: #F8FAFC;
}

[data-theme="light"] .color-hex-text {
  color: #0F172A;
}

[data-theme="light"] .color-picker-popover {
  background: #FFFFFF;
  border-color: #E2E8F0;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
}

[data-theme="light"] .popover-title {
  color: #0F172A;
}

[data-theme="light"] .manual-hex-input {
  background: #F1F5F9;
  border-color: #CBD5E1;
  color: #0F172A;
}

[data-theme="light"] :deep(.v-color-picker-edit .v-color-picker-edit__input input) {
  background: #F1F5F9 !important;
  border-color: #CBD5E1 !important;
  color: #0F172A !important;
}
</style>
