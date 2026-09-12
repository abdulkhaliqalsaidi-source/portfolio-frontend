<template>
  <div class="json-editor-container" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- Editor Header / Toolbar -->
    <div class="editor-toolbar">
      <div class="toolbar-start">
        <div class="d-flex align-center gap-2">
          <div class="editor-badge">
            <v-icon icon="mdi-code-json" size="18" color="#38BDF8" />
            <span>محرر JSON التفاعلي</span>
          </div>
          <span class="file-name-tag" v-if="fileName">{{ fileName }}</span>
        </div>

        <!-- Syntax Status Indicator -->
        <div class="syntax-status-pill" :class="isJsonValid ? 'valid' : 'invalid'">
          <v-icon :icon="isJsonValid ? 'mdi-check-circle' : 'mdi-alert-circle'" size="14" class="ml-1" />
          <span>{{ isJsonValid ? 'بنية JSON صالحة' : syntaxErrorTitle }}</span>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="toolbar-actions">
        <button
          type="button"
          class="tool-btn"
          @click="formatJson"
          title="تنسيق وترتيب الكود (Format JSON)"
        >
          <v-icon icon="mdi-auto-fix" size="16" />
          <span>تنسيق الكود</span>
        </button>

        <button
          type="button"
          class="tool-btn"
          @click="copyCode"
          :title="copied ? 'تم النسخ!' : 'نسخ الكود'"
        >
          <v-icon :icon="copied ? 'mdi-check' : 'mdi-content-copy'" size="15" />
          <span>{{ copied ? 'تم النسخ' : 'نسخ' }}</span>
        </button>

        <button
          type="button"
          class="tool-btn"
          @click="downloadJson"
          title="تحميل كملف JSON"
        >
          <v-icon icon="mdi-download" size="16" />
          <span>تحميل</span>
        </button>

        <button
          type="button"
          class="tool-btn"
          :class="{ 'btn-active-tool': isFullscreen }"
          @click="isFullscreen = !isFullscreen"
          :title="isFullscreen ? 'إنهاء وضع ملء الشاشة' : 'توسيع المحرر بملء الشاشة'"
        >
          <v-icon :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" size="17" />
          <span>{{ isFullscreen ? 'تصغير' : 'ملء الشاشة' }}</span>
        </button>

        <button
          type="button"
          class="tool-btn text-danger-hover"
          @click="clearCode"
          title="مسح المحرر"
        >
          <v-icon icon="mdi-trash-can-outline" size="15" />
          <span>مسح</span>
        </button>
      </div>
    </div>

    <!-- Syntax Error Banner if any -->
    <div v-if="!isJsonValid && syntaxErrorDetails" class="syntax-error-banner">
      <div class="d-flex align-center gap-2">
        <v-icon icon="mdi-alert-octagon" size="18" color="#EF4444" />
        <strong class="font-weight-bold">تنبيه صياغة الـ JSON:</strong>
        <span class="error-msg-text">{{ syntaxErrorDetails }}</span>
      </div>
      <button v-if="canAutoFix" class="btn-fix-quick" @click="tryAutoFix">
        <v-icon icon="mdi-wrench" size="13" class="ml-1" />
        محاولة الإصلاح التلقائي
      </button>
    </div>

    <!-- Main Editor Body with Line Numbers & Textarea -->
    <div class="editor-body">
      <!-- Line Numbers Gutter -->
      <div class="line-numbers" ref="gutterRef">
        <div
          v-for="n in totalLines"
          :key="n"
          class="line-num"
          :class="{ 'error-line': errorLineNum === n }"
        >
          {{ n }}
        </div>
      </div>

      <!-- Code Textarea -->
      <textarea
        ref="textareaRef"
        v-model="codeText"
        class="code-textarea"
        dir="ltr"
        spellcheck="false"
        placeholder="الصق أو عدل كود الـ JSON هنا..."
        @scroll="syncScroll"
        @keydown.tab.prevent="handleTab"
        @input="handleInput"
      />
    </div>

    <!-- Editor Footer Stats -->
    <div class="editor-footer">
      <div class="footer-stats">
        <span>السطور: <strong>{{ totalLines }}</strong></span>
        <span>•</span>
        <span>الأحرف: <strong>{{ codeText.length }}</strong></span>
        <span>•</span>
        <span>الحجم: <strong>{{ formatSize(codeText.length) }}</strong></span>
      </div>
      <div class="footer-hint">
        <v-icon icon="mdi-keyboard-outline" size="14" class="ml-1" />
        <span>اضغط <strong>Tab</strong> للمسافات البادئة • اضغط <strong>تنسيق الكود</strong> لإعادة الترتيب التلقائي</span>
      </div>
    </div>

    <!-- Confirm Clear Modal -->
    <ConfirmDeleteModal
      v-model="clearModalOpen"
      title="تأكيد مسح محتوى المحرر"
      subtitle="سيتم إفراغ كافة النصوص والأكواد المكتوبة في المحرر."
      item-name="محتوى محرر كود JSON"
      item-type="كود برمجي"
      warning-text="تنبيه: سيتم مسح الكود الحالي. إذا لم تقم بتحميله أو حفظه فلن تتمكن من استرجاعه."
      confirm-text="نعم، مسح المحرر"
      @confirm="executeClear"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: 'data-template.json'
  }
})

const emit = defineEmits(['update:modelValue', 'validity-change'])

const codeText = ref(props.modelValue || '')
const textareaRef = ref(null)
const gutterRef = ref(null)
const copied = ref(false)
const isFullscreen = ref(false)
const clearModalOpen = ref(false)

const syntaxError = ref(null)
const errorLineNum = ref(null)

const isJsonValid = computed(() => !syntaxError.value && codeText.value.trim().length > 0)

const syntaxErrorTitle = computed(() => {
  if (!codeText.value.trim()) return 'المحرر فارغ'
  return 'خطأ في صياغة الـ JSON'
})

const syntaxErrorDetails = computed(() => {
  return syntaxError.value || ''
})

const totalLines = computed(() => {
  if (!codeText.value) return 1
  return codeText.value.split('\n').length
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== codeText.value) {
    codeText.value = newVal || ''
    validateSyntax()
  }
})

function validateSyntax() {
  const text = codeText.value.trim()
  if (!text) {
    syntaxError.value = null
    errorLineNum.value = null
    emit('validity-change', { valid: false, error: 'المحرر فارغ' })
    return
  }

  try {
    JSON.parse(text)
    syntaxError.value = null
    errorLineNum.value = null
    emit('validity-change', { valid: true, error: null })
  } catch (e) {
    syntaxError.value = e.message
    errorLineNum.value = extractLineNumber(e.message, text)
    emit('validity-change', { valid: false, error: e.message })
  }
}

function extractLineNumber(errorMsg, text) {
  // Try to find line or position in error message
  const lineMatch = errorMsg.match(/line\s+(\d+)/i)
  if (lineMatch) return parseInt(lineMatch[1], 10)

  const posMatch = errorMsg.match(/position\s+(\d+)/i)
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10)
    const lines = text.slice(0, pos).split('\n')
    return lines.length
  }
  return null
}

function handleInput() {
  emit('update:modelValue', codeText.value)
  validateSyntax()
}

function handleTab(e) {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Insert 2 spaces
  codeText.value = codeText.value.substring(0, start) + '  ' + codeText.value.substring(end)
  handleInput()

  nextTick(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2
  })
}

function syncScroll() {
  if (textareaRef.value && gutterRef.value) {
    gutterRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

function formatJson() {
  try {
    const parsed = JSON.parse(codeText.value)
    codeText.value = JSON.stringify(parsed, null, 2)
    handleInput()
  } catch (e) {
    // If not valid JSON, try light cleanup
    tryAutoFix()
  }
}

const canAutoFix = computed(() => {
  return !isJsonValid.value && codeText.value.length > 5
})

function tryAutoFix() {
  let text = codeText.value
  // Fix single quotes to double quotes
  text = text.replace(/'/g, '"')
  // Fix trailing commas before } or ]
  text = text.replace(/,\s*([}\]])/g, '$1')

  try {
    const parsed = JSON.parse(text)
    codeText.value = JSON.stringify(parsed, null, 2)
    handleInput()
  } catch (e) {
    // Still invalid, validate to update error
    validateSyntax()
  }
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(codeText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error('Copy failed:', e)
  }
}

function downloadJson() {
  if (!codeText.value) return
  const blob = new Blob([codeText.value], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = props.fileName || 'edited-template.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function clearCode() {
  clearModalOpen.value = true
}

function executeClear() {
  codeText.value = ''
  clearModalOpen.value = false
  handleInput()
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

onMounted(() => {
  validateSyntax()
})
</script>

<style scoped>
.json-editor-container {
  display: flex;
  flex-direction: column;
  background: #0B0F19;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.6);
  font-family: var(--f-body, 'Cairo', sans-serif);
  transition: all 0.25s ease;
}

.json-editor-container.is-fullscreen {
  position: fixed;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  z-index: 99999;
  border-radius: 18px;
  border: 1.5px solid rgba(56, 189, 248, 0.4);
  box-shadow: 0 25px 90px rgba(0, 0, 0, 0.95);
}

.tool-btn.btn-active-tool {
  background: rgba(56, 189, 248, 0.2);
  border-color: rgba(56, 189, 248, 0.5);
  color: #38BDF8;
}

/* Editor Body */
.editor-body {
  display: flex;
  min-height: 520px;
  height: 580px;
  background: #080C16;
  position: relative;
  overflow: hidden;
}

.json-editor-container.is-fullscreen .editor-body {
  height: calc(100vh - 145px);
  min-height: auto;
  max-height: none;
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar-start {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.editor-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 0.88rem;
  font-weight: 800;
  color: #FFFFFF;
}

.file-name-tag {
  font-family: var(--f-mono, monospace);
  font-size: 0.76rem;
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  direction: ltr;
}

.syntax-status-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 100px;
  transition: all 0.2s ease;
}

.syntax-status-pill.valid {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
}

.syntax-status-pill.invalid {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tool-btn {
  height: 32px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #E2E8F0;
  font-size: 0.78rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background: rgba(59, 130, 246, 0.18);
  border-color: rgba(59, 130, 246, 0.4);
  color: #FFFFFF;
}

.tool-btn.text-danger-hover:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.4);
  color: #EF4444;
}

/* Syntax Error Banner */
.syntax-error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.12);
  border-bottom: 1px solid rgba(239, 68, 68, 0.25);
  color: #FCA5A5;
  font-size: 0.8rem;
  flex-wrap: wrap;
  gap: 8px;
}

.error-msg-text {
  direction: ltr;
  font-family: var(--f-mono, monospace);
  font-size: 0.78rem;
}

.btn-fix-quick {
  background: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 0.74rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s ease;
}

.btn-fix-quick:hover {
  opacity: 0.9;
}

.line-numbers {
  width: 48px;
  background: #050811;
  color: #475569;
  font-family: var(--f-mono, 'JetBrains Mono', 'Fira Code', monospace);
  font-size: 0.82rem;
  line-height: 1.55;
  padding: 14px 6px 14px 0;
  text-align: center;
  user-select: none;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: hidden;
  flex-shrink: 0;
}

.line-num {
  height: 21.08px;
}

.line-num.error-line {
  color: #EF4444;
  font-weight: 800;
  background: rgba(239, 68, 68, 0.15);
}

.code-textarea {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 14px 16px;
  background: transparent;
  color: #E2E8F0;
  font-family: var(--f-mono, 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace);
  font-size: 0.84rem;
  line-height: 1.55;
  border: none;
  outline: none;
  resize: none;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
  overflow-y: auto;
  tab-size: 2;
}

.code-textarea::placeholder {
  color: #475569;
}

/* Footer Stats */
.editor-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.74rem;
  color: #64748B;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--f-mono, monospace);
}

.footer-stats strong {
  color: #CBD5E1;
}

.footer-hint {
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-hint strong {
  color: #94A3B8;
}

/* Light Theme Overrides */
[data-theme="light"] .json-editor-container {
  background: #FFFFFF;
  border-color: #E2E8F0;
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .editor-toolbar,
[data-theme="light"] .editor-footer {
  background: #F8FAFC;
  border-color: #E2E8F0;
}

[data-theme="light"] .editor-badge,
[data-theme="light"] .footer-stats strong {
  color: #0F172A;
}

[data-theme="light"] .editor-body {
  background: #F1F5F9;
}

[data-theme="light"] .line-numbers {
  background: #E2E8F0;
  color: #64748B;
  border-left-color: #CBD5E1;
}

[data-theme="light"] .code-textarea {
  color: #0F172A;
}

[data-theme="light"] .tool-btn {
  background: #FFFFFF;
  border-color: #CBD5E1;
  color: #334155;
}
</style>
