<template>
  <div class="ai-assistant-wrapper" :class="{ 'is-open': isOpen }" dir="rtl">
    <!-- Overlay for mobile/small screens -->
    <div v-if="isOpen" class="ai-backdrop" @click="$emit('update:isOpen', false)" />

    <!-- AI Side Panel -->
    <aside class="ai-drawer" :class="{ open: isOpen }">
      <!-- Header -->
      <div class="ai-drawer-header">
        <div class="d-flex align-center gap-2">
          <div class="ai-header-icon-glow">
            <v-icon icon="mdi-creation" size="18" color="#a855f7" />
          </div>
          <div>
            <div class="ai-header-title">المساعد الذكي للمدونة</div>
            <div class="ai-header-status">
              <span class="status-dot" :class="{ active: hasApiKey }"></span>
              <span>{{ hasApiKey ? 'متصل بـ Gemini' : 'يتطلب مفتاح API' }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex align-center gap-1">
          <button
            type="button"
            class="ai-icon-btn"
            :class="{ active: showKeyConfig }"
            @click="showKeyConfig = !showKeyConfig"
            title="إعدادات مفتاح Google Gemini"
          >
            <v-icon icon="mdi-cog-outline" size="18" />
          </button>
          <button
            type="button"
            class="ai-icon-btn"
            @click="$emit('update:isOpen', false)"
            title="إغلاق اللوحة"
          >
            <v-icon icon="mdi-close" size="18" />
          </button>
        </div>
      </div>

      <!-- API Key Setup Banner (Expandable or when no key) -->
      <div v-if="showKeyConfig || !hasApiKey" class="ai-key-config-box">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="font-weight-bold text-caption text-purple-light">
            <v-icon icon="mdi-key-variant" size="14" class="ml-1" />
            مفتاح Google Gemini API
          </span>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            class="free-key-link"
          >
            <span>احصل على مفتاح مجاني</span>
            <v-icon icon="mdi-open-in-new" size="12" class="mr-1" />
          </a>
        </div>

        <div class="d-flex align-center gap-2 mb-2">
          <v-text-field
            v-model="apiKeyInput"
            :type="showKeyText ? 'text' : 'password'"
            placeholder="AIzaSy..."
            variant="outlined"
            density="compact"
            hide-details
            class="key-input font-mono"
            :append-inner-icon="showKeyText ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showKeyText = !showKeyText"
          />
          <button
            type="button"
            class="btn btn-primary btn-sm px-3"
            :disabled="!apiKeyInput"
            @click="saveApiKey"
          >
            حفظ
          </button>
        </div>

        <!-- Model selection -->
        <div class="d-flex align-center justify-space-between text-caption mt-2">
          <span class="text-secondary">النموذج:</span>
          <div class="d-flex align-center gap-1">
            <select v-model="selectedModel" class="model-select" @change="saveModel">
              <option
                v-for="opt in availableModelOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
            <button
              type="button"
              class="model-refresh-btn"
              :class="{ 'is-refreshing': loadingModels }"
              :disabled="loadingModels || !hasApiKey"
              @click="refreshModelsList(false)"
              title="تحديث قائمة النماذج المتاحة لمفتاحك من Google"
            >
              <v-icon :icon="loadingModels ? 'mdi-loading spin' : 'mdi-refresh'" size="14" />
            </button>
          </div>
        </div>
        <div v-if="modelsStatusText" class="text-caption text-purple-light mt-1" style="font-size: 0.7rem;">
          {{ modelsStatusText }}
        </div>

        <p class="text-caption text-secondary mt-2 mb-0" style="font-size: 0.72rem; line-height: 1.4;">
          يتم حفظ المفتاح بأمان داخل متصفحك (localStorage) ويستخدم فقط لتوليد وتنسيق مقالاتك عبر خوادم Google الرسمية.
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="ai-tabs">
        <button
          type="button"
          class="ai-tab-btn"
          :class="{ active: activeTab === 'actions' }"
          @click="activeTab = 'actions'"
        >
          <v-icon icon="mdi-lightning-bolt" size="15" class="ml-1" />
          <span>مهام سريعة</span>
        </button>

        <button
          type="button"
          class="ai-tab-btn"
          :class="{ active: activeTab === 'chat' }"
          @click="activeTab = 'chat'"
        >
          <v-icon icon="mdi-chat-processing-outline" size="15" class="ml-1" />
          <span>محادثة حرة</span>
        </button>

        <button
          v-if="currentOutput || seoDataOutput || titlesOutput.length"
          type="button"
          class="ai-tab-btn result-tab"
          :class="{ active: activeTab === 'result' }"
          @click="activeTab = 'result'"
        >
          <v-icon icon="mdi-file-document-check-outline" size="15" class="ml-1" />
          <span>النتيجة الأخيرة</span>
        </button>
      </div>

      <!-- Body Content -->
      <div class="ai-drawer-body">
        <!-- ══════════════════════════════════════════
             TAB 1: QUICK ACTIONS
             ══════════════════════════════════════════ -->
        <div v-show="activeTab === 'actions'" class="tab-pane">
          <!-- Quick Action: Full Article -->
          <div class="action-card">
            <div class="action-card-header">
              <div class="action-card-title">
                <span class="action-emoji">🔮</span>
                <span>توليد مقال كامل متكامل</span>
              </div>
              <span class="action-badge">شامل</span>
            </div>
            <p class="action-card-desc">
              كتابة مقال غني ومفصل بالاعتماد على العنوان والتصنيف الحالي، منظم بعناوين وفقرات وخاتمة.
            </p>

            <div class="action-inputs mb-3">
              <v-select
                v-model="articleTone"
                :items="[
                  { title: 'أسلوب احترافي وشيق (موصى به)', value: 'احترافي وشيق ومقنع' },
                  { title: 'أسلوب تقني وعملي متعمق', value: 'تقني ودقيق مع أمثلة عملية' },
                  { title: 'أسلوب تسويقي وإلهامي', value: 'تسويقي حماسي ومحفز للعمل' },
                  { title: 'أسلوب مبسط وممتع للمبتدئين', value: 'تعليمي مبسط وواضح جداً' }
                ]"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                label="نبرة وأسلوب المقال"
                hide-details
                class="mb-2"
              />

              <v-text-field
                v-model="articleAudience"
                placeholder="مثال: رواد الأعمال، مطورو الواجهات، الطلاب..."
                variant="outlined"
                density="compact"
                label="الجمهور المستهدف (اختياري)"
                hide-details
                class="mb-2"
              />

              <v-textarea
                v-model="articleNotes"
                placeholder="أي أفكار خاصة، نقاط تريد تضمينها، أو أسماء أدوات..."
                variant="outlined"
                density="compact"
                rows="2"
                label="ملاحظات أو نقاط إضافية (اختياري)"
                hide-details
              />
            </div>

            <button
              type="button"
              class="btn-ai-action primary"
              :disabled="loading || !postTitle"
              @click="handleGenerateFullArticle"
            >
              <v-icon :icon="loadingTask === 'full' ? 'mdi-loading spin' : 'mdi-sparkles'" size="16" class="ml-1" />
              <span>{{ loadingTask === 'full' ? 'جاري الصياغة والتأليف...' : 'توليد المقال الآن' }}</span>
            </button>
            <div v-if="!postTitle" class="text-caption text-warning mt-1">
              ⚠️ يرجى كتابة عنوان المقال أولاً لتوليد المحتوى بناءً عليه.
            </div>
          </div>

          <!-- Quick Action: Improve & Polish -->
          <div class="action-card">
            <div class="action-card-header">
              <div class="action-card-title">
                <span class="action-emoji">✍️</span>
                <span>تحسين وإعادة صياغة المحتوى</span>
              </div>
            </div>
            <p class="action-card-desc">
              تدقيق الأخطاء الإملائية، تحسين البلاغة والأسلوب، وجعل المحتوى الحالي أكثر جاذبية واحترافية.
            </p>
            <button
              type="button"
              class="btn-ai-action"
              :disabled="loading || !hasContent"
              @click="handleImproveContent"
            >
              <v-icon :icon="loadingTask === 'improve' ? 'mdi-loading spin' : 'mdi-auto-fix'" size="16" class="ml-1" />
              <span>{{ loadingTask === 'improve' ? 'جاري التدقيق والتحسين...' : 'تحسين لغة المقال الحالية' }}</span>
            </button>
          </div>

          <!-- Quick Action: Format & Structure -->
          <div class="action-card">
            <div class="action-card-header">
              <div class="action-card-title">
                <span class="action-emoji">🎨</span>
                <span>تنسيق وتنظيم المحتوى (Markdown)</span>
              </div>
            </div>
            <p class="action-card-desc">
              تحويل النصوص العادية إلى بنية مقال احترافية تحتوي على عناوين H2 و H3 ونقاط واقتباسات.
            </p>
            <button
              type="button"
              class="btn-ai-action"
              :disabled="loading || !hasContent"
              @click="handleFormatContent"
            >
              <v-icon :icon="loadingTask === 'format' ? 'mdi-loading spin' : 'mdi-format-align-right'" size="16" class="ml-1" />
              <span>{{ loadingTask === 'format' ? 'جاري تنظيم وهيكلة النص...' : 'تنظيم وتنسيق النص' }}</span>
            </button>
          </div>

          <!-- Quick Action: Catchy Excerpt & Intro -->
          <div class="action-card">
            <div class="action-card-header">
              <div class="action-card-title">
                <span class="action-emoji">🎯</span>
                <span>مقدمة ومقتطف جذاب (Excerpt)</span>
              </div>
            </div>
            <p class="action-card-desc">
              صياغة مقتطف خاطف من سطرين لكروت المقالات + مقدمة مشوقة تشد انتباه الزائر من اللحظة الأولى.
            </p>
            <button
              type="button"
              class="btn-ai-action"
              :disabled="loading || !postTitle"
              @click="handleGenerateExcerptIntro"
            >
              <v-icon :icon="loadingTask === 'excerpt' ? 'mdi-loading spin' : 'mdi-text-box-search-outline'" size="16" class="ml-1" />
              <span>{{ loadingTask === 'excerpt' ? 'جاري الابتكار...' : 'توليد المقتطف والمقدمة' }}</span>
            </button>
          </div>

          <!-- Quick Action: SEO Optimization -->
          <div class="action-card">
            <div class="action-card-header">
              <div class="action-card-title">
                <span class="action-emoji">🔍</span>
                <span>تحسين محركات البحث (SEO)</span>
              </div>
              <span class="action-badge green">Google</span>
            </div>
            <p class="action-card-desc">
              توليد عنوان سيو، وصف ميتا مشوق، كلمات مفتاحية، وسوم مقترحة، ورابط دائم مخصص.
            </p>
            <button
              type="button"
              class="btn-ai-action"
              :disabled="loading || !postTitle"
              @click="handleGenerateSeo"
            >
              <v-icon :icon="loadingTask === 'seo' ? 'mdi-loading spin' : 'mdi-google'" size="16" class="ml-1" />
              <span>{{ loadingTask === 'seo' ? 'جاري تحليل وتوليد السيو...' : 'توليد حقول الـ SEO والوسوم' }}</span>
            </button>
          </div>

          <!-- Quick Action: Catchy Titles -->
          <div class="action-card">
            <div class="action-card-header">
              <div class="action-card-title">
                <span class="action-emoji">💡</span>
                <span>اقتراح عناوين بديلة وجذابة</span>
              </div>
            </div>
            <p class="action-card-desc">
              اقتراح 6 خيارات عناوين متنوعة (قوائم، أسئلة، مباشرة، إلهامية) لزيادة معدل النقر والقراءة.
            </p>
            <button
              type="button"
              class="btn-ai-action"
              :disabled="loading || !postTitle"
              @click="handleSuggestTitles"
            >
              <v-icon :icon="loadingTask === 'titles' ? 'mdi-loading spin' : 'mdi-format-header-pound'" size="16" class="ml-1" />
              <span>{{ loadingTask === 'titles' ? 'جاري ابتكار العناوين...' : 'اقتراح عناوين مميزة' }}</span>
            </button>
          </div>

          <!-- Quick Action: Translate -->
          <div class="action-card">
            <div class="action-card-header">
              <div class="action-card-title">
                <span class="action-emoji">🌐</span>
                <span>ترجمة المقال إلى الإنجليزية</span>
              </div>
            </div>
            <p class="action-card-desc">
              ترجمة احترافية تحافظ على التنسيق والرموز البرمجية وروابط المقال.
            </p>
            <button
              type="button"
              class="btn-ai-action"
              :disabled="loading || !hasContent"
              @click="handleTranslate"
            >
              <v-icon :icon="loadingTask === 'translate' ? 'mdi-loading spin' : 'mdi-translate'" size="16" class="ml-1" />
              <span>{{ loadingTask === 'translate' ? 'جاري الترجمة الدقيقة...' : 'ترجمة إلى الإنجليزية' }}</span>
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════════════════
             TAB 2: FREE CHAT & PROMPTING
             ══════════════════════════════════════════ -->
        <div v-show="activeTab === 'chat'" class="tab-pane">
          <!-- Quick prompt ideas -->
          <div class="prompt-ideas-section mb-3">
            <div class="text-caption font-weight-bold mb-2 text-secondary">أفكار سريعة يمكنك طلبها:</div>
            <div class="d-flex flex-wrap gap-1">
              <button
                v-for="chip in quickChips"
                :key="chip"
                type="button"
                class="prompt-chip"
                @click="customPrompt = chip"
              >
                {{ chip }}
              </button>
            </div>
          </div>

          <div class="chat-input-box mb-3">
            <v-textarea
              v-model="customPrompt"
              placeholder="اكتب طلبك للمساعد الذكي هنا... (مثال: أضف فقرة عن أفضل الممارسات، اجعل المقال أكثر تشويقاً، لخصه في 5 نقاط)"
              variant="outlined"
              rows="4"
              auto-grow
              hide-details
              class="custom-prompt-textarea"
            />

            <div class="d-flex align-center justify-space-between mt-2">
              <span class="text-caption text-secondary">
                يتعرف المساعد تلقائياً على عنوان ومحتوى مقالك الحالي.
              </span>
              <button
                type="button"
                class="btn-ai-action primary"
                style="width: auto; padding: 6px 16px;"
                :disabled="loading || !customPrompt.trim()"
                @click="handleCustomChat"
              >
                <v-icon :icon="loadingTask === 'chat' ? 'mdi-loading spin' : 'mdi-send'" size="15" class="ml-1" />
                <span>إرسال</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════
             TAB 3 / RESULT DISPLAY
             ══════════════════════════════════════════ -->
        <div v-show="activeTab === 'result'" class="tab-pane">
          <!-- Titles Result -->
          <div v-if="titlesOutput.length" class="result-box mb-4">
            <div class="result-header">
              <span class="result-tag">💡 العناوين المقترحة (اضغط للتطبيق)</span>
            </div>
            <div class="titles-list mt-2">
              <div
                v-for="(titleOption, idx) in titlesOutput"
                :key="idx"
                class="title-option-item"
                @click="applyTitle(titleOption)"
              >
                <div class="title-option-num">{{ idx + 1 }}</div>
                <div class="title-option-text">{{ titleOption }}</div>
                <v-icon icon="mdi-check-circle-outline" size="18" class="title-apply-icon" />
              </div>
            </div>
          </div>

          <!-- SEO Data Result -->
          <div v-if="seoDataOutput" class="result-box mb-4">
            <div class="result-header">
              <span class="result-tag">🔍 بيانات الـ SEO المولدة</span>
              <button
                type="button"
                class="btn-apply-action primary"
                @click="applySeoData"
              >
                <v-icon icon="mdi-check-all" size="15" class="ml-1" />
                <span>تطبيق كافة حقول الـ SEO</span>
              </button>
            </div>

            <div class="seo-data-preview mt-3">
              <div class="seo-item">
                <span class="seo-label">عنوان الـ SEO:</span>
                <span class="seo-val">{{ seoDataOutput.meta_title }}</span>
              </div>
              <div class="seo-item">
                <span class="seo-label">وصف الـ SEO:</span>
                <span class="seo-val">{{ seoDataOutput.meta_description }}</span>
              </div>
              <div class="seo-item" v-if="seoDataOutput.meta_keywords">
                <span class="seo-label">الكلمات المفتاحية:</span>
                <span class="seo-val">{{ seoDataOutput.meta_keywords }}</span>
              </div>
              <div class="seo-item" v-if="seoDataOutput.suggested_slug">
                <span class="seo-label">الرابط الدائم (Slug):</span>
                <span class="seo-val font-mono text-ltr">{{ seoDataOutput.suggested_slug }}</span>
              </div>
              <div class="seo-item" v-if="seoDataOutput.suggested_tags?.length">
                <span class="seo-label">الوسوم المقترحة:</span>
                <div class="d-flex flex-wrap gap-1 mt-1">
                  <span v-for="tag in seoDataOutput.suggested_tags" :key="tag" class="seo-tag-pill">
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Excerpt Result -->
          <div v-if="excerptOutput" class="result-box mb-4">
            <div class="result-header">
              <span class="result-tag">🎯 المقتطف المقترح (Lead Excerpt)</span>
              <button
                type="button"
                class="btn-apply-action"
                @click="applyExcerpt"
              >
                <v-icon icon="mdi-content-save-edit" size="14" class="ml-1" />
                <span>تطبيق على حقل المقتطف</span>
              </button>
            </div>
            <p class="excerpt-preview-text mt-2">{{ excerptOutput }}</p>
          </div>

          <!-- Main Text Output -->
          <div v-if="currentOutput" class="result-box">
            <div class="result-header">
              <span class="result-tag">📄 النتيجة والمحتوى</span>
              <div class="d-flex align-center gap-1">
                <button
                  type="button"
                  class="btn-view-toggle"
                  :class="{ active: viewRawOutput }"
                  @click="viewRawOutput = !viewRawOutput"
                >
                  <v-icon :icon="viewRawOutput ? 'mdi-eye-outline' : 'mdi-code-braces'" size="14" class="ml-1" />
                  <span>{{ viewRawOutput ? 'معاينة' : 'كود Markdown' }}</span>
                </button>
                <button
                  type="button"
                  class="btn-copy"
                  @click="copyOutput"
                  title="نسخ إلى الحافظة"
                >
                  <v-icon :icon="copied ? 'mdi-check' : 'mdi-content-copy'" size="14" />
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="result-content-wrap">
              <div
                v-if="!viewRawOutput"
                class="result-rendered markdown-rendered-body"
                v-html="renderedOutput"
              ></div>
              <pre v-else class="result-raw font-mono">{{ currentOutput }}</pre>
            </div>

            <!-- Apply Actions -->
            <div class="result-actions-bar mt-3">
              <button
                type="button"
                class="btn-apply-action primary flex-grow-1"
                @click="applyContent('replace')"
              >
                <v-icon icon="mdi-swap-horizontal" size="16" class="ml-1" />
                <span>استبدال محتوى المقال كاملاً</span>
              </button>

              <button
                type="button"
                class="btn-apply-action secondary"
                @click="applyContent('append')"
              >
                <v-icon icon="mdi-plus" size="16" class="ml-1" />
                <span>إدراج في نهاية المقال</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State Overlay -->
        <div v-if="loading" class="ai-loading-overlay">
          <div class="ai-sparkle-loader">
            <div class="sparkle-orbit">
              <v-icon icon="mdi-creation" size="28" color="#c084fc" class="sparkle-center" />
            </div>
          </div>
          <div class="ai-loading-title">الذكاء الاصطناعي يعمل الآن...</div>
          <div class="ai-loading-sub">{{ loadingStatusText }}</div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="ai-error-banner mt-3">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-alert-circle-outline" size="18" color="#ef4444" />
            <span class="font-weight-bold text-caption">حدث خطأ</span>
          </div>
          <p class="error-text mb-0 mt-1">{{ errorMessage }}</p>
          <button
            v-if="errorMessage.includes('مفتاح')"
            type="button"
            class="btn btn-ghost btn-xs mt-2 text-purple-light"
            @click="showKeyConfig = true"
          >
            إدخال أو تعديل مفتاح API
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import geminiService from '~/services/geminiService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  post: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'update:isOpen',
  'apply-content',
  'apply-excerpt',
  'apply-intro',
  'apply-seo',
  'apply-title'
])

// API key & Model
const apiKeyInput = ref('')
const hasApiKey = ref(false)
const showKeyConfig = ref(false)
const showKeyText = ref(false)
const selectedModel = ref('gemini-2.0-flash')
const loadingModels = ref(false)
const modelsList = ref([])
const modelsStatusText = ref('')

const defaultModelOptions = [
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (سريع ومستقر جداً - موصى به)' },
  { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (الجيل الجديد - قد يواجه ضغطاً مؤقتاً)' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite (سريع وخفيف جداً)' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (مستقر)' }
]

const availableModelOptions = computed(() => {
  if (!modelsList.value.length) return defaultModelOptions

  const dynamic = modelsList.value.map(m => ({
    value: m.id,
    label: `${m.displayName || m.id} (متاح لحسابك)`
  }))

  if (selectedModel.value && !dynamic.some(d => d.value === selectedModel.value)) {
    dynamic.unshift({
      value: selectedModel.value,
      label: selectedModel.value
    })
  }

  return dynamic
})

// UI Tabs
const activeTab = ref('actions') // 'actions' | 'chat' | 'result'
const loading = ref(false)
const loadingTask = ref('')
const loadingStatusText = ref('')
const errorMessage = ref('')
const copied = ref(false)
const viewRawOutput = ref(false)

// Action form states
const articleTone = ref('احترافي وشيق ومقنع')
const articleAudience = ref('')
const articleNotes = ref('')
const customPrompt = ref('')

// Results
const currentOutput = ref('')
const excerptOutput = ref('')
const introOutput = ref('')
const seoDataOutput = ref(null)
const titlesOutput = ref([])

const quickChips = [
  'أضف خاتمة قوية وخلاصة عملية للمقال',
  'اقترح أمثلة تطبيقية وحالات دراسة من واقع السوق',
  'أعد كتابة المقال بأسلوب قصصي ملهم',
  'لخّص المقال في 5 نقاط رئيسية للمبتدئين',
  'أضف جدول مقارنة يوضح المزايا والعيوب',
  'أضف أسئلة شائعة وإجاباتها (FAQ) في نهاية المقال'
]

const postTitle = computed(() => (props.post?.title || '').trim())
const hasContent = computed(() => {
  const content = props.post?.content || ''
  return content.replace(/<[^>]+>/g, '').trim().length > 20
})

const renderedOutput = computed(() => {
  if (!currentOutput.value) return ''
  try {
    return marked.parse(currentOutput.value)
  } catch (e) {
    return currentOutput.value
  }
})

onMounted(() => {
  const key = geminiService.getApiKey()
  if (key) {
    apiKeyInput.value = key
    hasApiKey.value = true
  } else {
    showKeyConfig.value = true
  }

  const current = geminiService.getModel()
  // Clean deprecated models
  if (current === 'gemini-1.5-pro' || current === 'gemini-pro' || current === 'gemini-2.5-flash') {
    selectedModel.value = 'gemini-3.6-flash'
    geminiService.setModel('gemini-3.6-flash')
  } else {
    selectedModel.value = current || 'gemini-3.6-flash'
  }

  // Load cached models
  const cached = geminiService.getCachedModels()
  if (cached.length > 0) {
    modelsList.value = cached
  }

  // Silently refresh available models in background
  if (hasApiKey.value) {
    refreshModelsList(true)
  }
})

async function refreshModelsList(silent = false) {
  const key = (apiKeyInput.value || geminiService.getApiKey()).trim()
  if (!key) return

  loadingModels.value = true
  if (!silent) modelsStatusText.value = 'جاري استكشاف النماذج المتاحة لمفتاحك من Google...'

  try {
    const list = await geminiService.listAvailableModels(key)
    if (list && list.length > 0) {
      modelsList.value = list
      if (!silent) {
        modelsStatusText.value = `تم العثور على ${list.length} نموذج متاح لمفتاحك بنجاح ✨`
      }
      // If current selectedModel is invalid or deprecated, switch to first working model
      if (selectedModel.value === 'gemini-1.5-pro' || !list.some(m => m.id === selectedModel.value)) {
        selectedModel.value = list[0].id
        geminiService.setModel(list[0].id)
      }
      if (!silent) {
        setTimeout(() => { modelsStatusText.value = '' }, 4000)
      }
    } else if (!silent) {
      modelsStatusText.value = 'تم الاعتماد على النماذج القياسية المستقرة.'
      setTimeout(() => { modelsStatusText.value = '' }, 3000)
    }
  } catch (err) {
    if (!silent) {
      modelsStatusText.value = 'تعذر استدعاء قائمة النماذج، تم تفعيل النماذج الافتراضية.'
      setTimeout(() => { modelsStatusText.value = '' }, 3000)
    }
  } finally {
    loadingModels.value = false
  }
}

function saveApiKey() {
  geminiService.setApiKey(apiKeyInput.value)
  hasApiKey.value = !!apiKeyInput.value.trim()
  if (hasApiKey.value) {
    showKeyConfig.value = false
    errorMessage.value = ''
    refreshModelsList(false)
  }
}

function saveModel() {
  geminiService.setModel(selectedModel.value)
}

function resetErrors() {
  errorMessage.value = ''
}

// ══════════════════════════════════════════
// ACTION HANDLERS
// ══════════════════════════════════════════
async function handleGenerateFullArticle() {
  if (!postTitle.value) return
  resetErrors()
  loading.value = true
  loadingTask.value = 'full'
  loadingStatusText.value = 'جاري التفكير وصياغة المقال بالعناوين والتفاصيل...'

  try {
    const text = await geminiService.generateFullPost({
      title: props.post.title,
      category: props.post.category,
      audience: articleAudience.value,
      tone: articleTone.value,
      extraInstructions: articleNotes.value,
      model: selectedModel.value
    })
    currentOutput.value = text
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل توليد المقال'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

async function handleImproveContent() {
  const content = (props.post?.content || '').replace(/<[^>]+>/g, ' ').trim()
  if (!content) {
    errorMessage.value = 'يرجى كتابة بعض المحتوى في المقال أولاً ليتمكن الذكاء الاصطناعي من تحسينه.'
    return
  }
  resetErrors()
  loading.value = true
  loadingTask.value = 'improve'
  loadingStatusText.value = 'جاري التدقيق اللغوي وإعادة الصياغة البلاغية...'

  try {
    const text = await geminiService.improveContent({
      content: props.post.content || '',
      tone: articleTone.value,
      model: selectedModel.value
    })
    currentOutput.value = text
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل تحسين المحتوى'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

async function handleFormatContent() {
  const content = (props.post?.content || '').replace(/<[^>]+>/g, ' ').trim()
  if (!content) {
    errorMessage.value = 'يرجى كتابة بعض النصوص أو الأفكار في المقال أولاً ليتمكن الذكاء الاصطناعي من تنسيقها.'
    return
  }
  resetErrors()
  loading.value = true
  loadingTask.value = 'format'
  loadingStatusText.value = 'جاري إعادة هيكلة النص وتنسيقه بـ Markdown...'

  try {
    const text = await geminiService.formatAndStructure({
      text: props.post.content || '',
      model: selectedModel.value
    })
    currentOutput.value = text
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل تنسيق المحتوى'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

async function handleGenerateExcerptIntro() {
  resetErrors()
  loading.value = true
  loadingTask.value = 'excerpt'
  loadingStatusText.value = 'جاري صياغة مقتطف ومقدمة جذابة...'

  try {
    const res = await geminiService.generateExcerptAndIntro({
      title: props.post.title,
      category: props.post.category,
      content: props.post.content || '',
      model: selectedModel.value
    })
    excerptOutput.value = res.excerpt || ''
    introOutput.value = res.intro || ''
    if (res.intro) {
      currentOutput.value = `### مقدمة مقترحة:\n\n${res.intro}\n\n### مقتطف (Excerpt):\n\n> ${res.excerpt}`
    }
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل توليد المقتطف'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

async function handleGenerateSeo() {
  resetErrors()
  loading.value = true
  loadingTask.value = 'seo'
  loadingStatusText.value = 'جاري تحليل الكلمات المفتاحية وبيانات السيو...'

  try {
    const res = await geminiService.generateSeoData({
      title: props.post.title,
      category: props.post.category,
      content: props.post.content || '',
      model: selectedModel.value
    })
    seoDataOutput.value = res
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل توليد بيانات السيو'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

async function handleSuggestTitles() {
  resetErrors()
  loading.value = true
  loadingTask.value = 'titles'
  loadingStatusText.value = 'جاري ابتكار عناوين جذابة...'

  try {
    const titles = await geminiService.suggestTitles({
      currentTitle: props.post.title,
      category: props.post.category,
      model: selectedModel.value
    })
    titlesOutput.value = titles
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل اقتراح العناوين'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

async function handleTranslate() {
  resetErrors()
  loading.value = true
  loadingTask.value = 'translate'
  loadingStatusText.value = 'جاري الترجمة الاحترافية إلى الإنجليزية...'

  try {
    const translated = await geminiService.translateContent({
      content: props.post.content || '',
      targetLang: 'en',
      model: selectedModel.value
    })
    currentOutput.value = translated
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل الترجمة'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

async function handleCustomChat() {
  if (!customPrompt.value.trim()) return
  resetErrors()
  loading.value = true
  loadingTask.value = 'chat'
  loadingStatusText.value = 'جاري معالجة طلبك وإعداد الإجابة...'

  try {
    const text = await geminiService.chatWithContext({
      prompt: customPrompt.value,
      blogContext: {
        title: props.post.title,
        category: props.post.category,
        excerpt: props.post.excerpt
      },
      model: selectedModel.value
    })
    currentOutput.value = text
    activeTab.value = 'result'
  } catch (err) {
    errorMessage.value = err.message || 'فشل تنفيذ الطلب'
  } finally {
    loading.value = false
    loadingTask.value = ''
  }
}

// ══════════════════════════════════════════
// APPLY TO BLOG POST EMITS
// ══════════════════════════════════════════
function applyContent(mode) {
  if (!currentOutput.value) return
  emit('apply-content', { content: currentOutput.value, mode })
}

function applyExcerpt() {
  if (!excerptOutput.value) return
  emit('apply-excerpt', excerptOutput.value)
}

function applyTitle(title) {
  emit('apply-title', title)
}

function applySeoData() {
  if (!seoDataOutput.value) return
  emit('apply-seo', seoDataOutput.value)
}

async function copyOutput() {
  if (!currentOutput.value) return
  try {
    await navigator.clipboard.writeText(currentOutput.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {}
}
</script>

<style scoped>
.ai-assistant-wrapper {
  position: relative;
}

/* Backdrop for responsive / overlay */
.ai-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 998;
}

/* AI Drawer */
.ai-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0; /* in RTL, drawer sits on the left or right */
  width: 440px;
  max-width: 92vw;
  background: var(--bg-card, #111827);
  border-right: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  box-shadow: 10px 0 35px rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  flex-direction: column;
  transform: translateX(-105%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ai-drawer.open {
  transform: translateX(0);
}

/* Header */
.ai-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  background: rgba(168, 85, 247, 0.04);
}

.ai-header-icon-glow {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(99, 102, 241, 0.25));
  border: 1px solid rgba(168, 85, 247, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-header-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--t1, #f8fafc);
}

.ai-header-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: var(--t3, #94a3b8);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
}

.status-dot.active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}

.ai-icon-btn {
  background: transparent;
  border: none;
  color: var(--t2, #cbd5e1);
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.ai-icon-btn:hover,
.ai-icon-btn.active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--t1, #fff);
}

/* API Key Config Box */
.ai-key-config-box {
  background: rgba(168, 85, 247, 0.08);
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
  padding: 12px 18px;
}

.free-key-link {
  color: #c084fc;
  text-decoration: none;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
}

.free-key-link:hover {
  text-decoration: underline;
}

.text-purple-light {
  color: #c084fc;
}

.model-select {
  background: var(--bg-surface, #1e293b);
  color: var(--t1, #fff);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  outline: none;
  max-width: 250px;
}

.model-refresh-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
  color: var(--t2, #cbd5e1);
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.model-refresh-btn:hover:not(:disabled) {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border-color: rgba(168, 85, 247, 0.4);
}

.model-refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.model-refresh-btn.is-refreshing .v-icon {
  animation: spin 1s linear infinite;
}

/* Navigation Tabs */
.ai-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  padding: 6px 12px;
  gap: 6px;
}

.ai-tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--t3, #94a3b8);
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.ai-tab-btn:hover {
  color: var(--t1, #fff);
  background: rgba(255, 255, 255, 0.04);
}

.ai-tab-btn.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.2));
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.ai-tab-btn.result-tab {
  color: #38bdf8;
}

.ai-tab-btn.result-tab.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.3);
  color: #38bdf8;
}

/* Drawer Body */
.ai-drawer-body {
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* Action Cards */
.action-card {
  background: var(--bg-surface, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 14px;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: rgba(168, 85, 247, 0.35);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
}

.action-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.action-card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  font-size: 0.88rem;
  color: var(--t1, #fff);
}

.action-badge {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 20px;
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  font-weight: 700;
}

.action-badge.green {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.action-card-desc {
  font-size: 0.78rem;
  color: var(--t3, #94a3b8);
  margin-bottom: 10px;
  line-height: 1.45;
}

.btn-ai-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
  background: rgba(255, 255, 255, 0.04);
  color: var(--t1, #fff);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ai-action:hover:not(:disabled) {
  background: rgba(168, 85, 247, 0.18);
  border-color: rgba(168, 85, 247, 0.4);
  color: #e9d5ff;
}

.btn-ai-action.primary {
  background: linear-gradient(135deg, #9333ea, #6366f1);
  border: none;
  color: #fff;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
}

.btn-ai-action.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #a855f7, #4f46e5);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.45);
}

.btn-ai-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Prompt Chips */
.prompt-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  color: var(--t2, #cbd5e1);
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.15s;
}

.prompt-chip:hover {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border-color: rgba(168, 85, 247, 0.3);
}

/* Result Box */
.result-box {
  background: var(--bg-surface, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  padding: 14px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.result-tag {
  font-size: 0.82rem;
  font-weight: 800;
  color: #c084fc;
}

.btn-view-toggle,
.btn-copy {
  background: transparent;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  color: var(--t2, #cbd5e1);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  cursor: pointer;
}

.btn-view-toggle.active {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
}

.result-content-wrap {
  max-height: 340px;
  overflow-y: auto;
  padding: 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.result-raw {
  white-space: pre-wrap;
  font-size: 0.78rem;
  color: #e2e8f0;
}

.btn-apply-action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
  background: rgba(255, 255, 255, 0.06);
  color: var(--t1, #fff);
  transition: all 0.2s;
}

.btn-apply-action.primary {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  color: #fff;
}

.btn-apply-action.primary:hover {
  background: linear-gradient(135deg, #34d399, #10b981);
}

.result-actions-bar {
  display: flex;
  gap: 8px;
}

/* Titles list */
.titles-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.title-option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.title-option-item:hover {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.4);
}

.title-option-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.25);
  color: #c084fc;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-option-text {
  flex: 1;
  font-size: 0.82rem;
  color: var(--t1, #fff);
}

.title-apply-icon {
  color: var(--t3, #94a3b8);
  opacity: 0;
  transition: opacity 0.15s;
}

.title-option-item:hover .title-apply-icon {
  opacity: 1;
  color: #10b981;
}

/* SEO Preview */
.seo-item {
  margin-bottom: 8px;
  font-size: 0.78rem;
}

.seo-label {
  font-weight: 700;
  color: #a855f7;
  display: block;
  margin-bottom: 2px;
}

.seo-val {
  color: var(--t1, #fff);
  word-break: break-word;
}

.seo-tag-pill {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.72rem;
}

.excerpt-preview-text {
  font-size: 0.82rem;
  color: var(--t1, #fff);
  line-height: 1.5;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
}

/* Loading Overlay */
.ai-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.92);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 20px;
  text-align: center;
}

.ai-sparkle-loader {
  margin-bottom: 14px;
}

.sparkle-orbit {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px dashed #a855f7;
  animation: spin 6s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-loading-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
}

.ai-loading-sub {
  font-size: 0.78rem;
  color: #c084fc;
}

/* Error banner */
.ai-error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
}

.error-text {
  font-size: 0.78rem;
  color: #fca5a5;
  line-height: 1.4;
}
</style>
