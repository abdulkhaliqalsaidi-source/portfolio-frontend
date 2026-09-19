<template>
  <div class="admin-seo-view" dir="rtl">
    <!-- Header -->
    <div class="page-header d-flex align-center justify-space-between flex-wrap gap-4 mb-6">
      <div>
        <h1 class="page-title d-flex align-center gap-2">
          <v-icon icon="mdi-google" color="primary" size="28" />
          <span>مدير تحسين محركات البحث والذكاء الاصطناعي (SEO & GEO Suite)</span>
        </h1>
        <p class="page-subtitle">التحكم الكامل في ظهور موقعك بقوقل، الكلمات المفتاحية، وكيفية قراءة وتلخيص الذكاء الاصطناعي لبياناتك</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="saving"
          @click="saveSeoSettings"
          rounded="lg"
        >
          حفظ كافة الإعدادات
        </v-btn>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="primary" class="mb-6">
      <v-tab value="global">
        <v-icon icon="mdi-earth" class="ml-2" />
        التهيئة العامة وقوقل (Google SEO)
      </v-tab>
      <v-tab value="ai">
        <v-icon icon="mdi-robot-outline" class="ml-2" />
        تهيئة الذكاء الاصطناعي (GEO / AI)
      </v-tab>
      <v-tab value="preview">
        <v-icon icon="mdi-eye-outline" class="ml-2" />
        المعاينة الحية (SERP & Social)
      </v-tab>
      <v-tab value="audit">
        <v-icon icon="mdi-check-decagram-outline" class="ml-2" />
        مؤشر الجودة والتدقيق الداخلي
      </v-tab>
      <v-tab value="sitemap">
        <v-icon icon="mdi-sitemap" class="ml-2" />
        خريطة الموقع والروبوتات
      </v-tab>
    </v-tabs>

    <!-- Tab 1: Global SEO Settings -->
    <div v-show="activeTab === 'global'" class="tab-content">
      <v-row>
        <v-col cols="12" md="7">
          <v-card class="admin-card mb-4" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-tune" color="primary" class="ml-2" />
              <span>الثوابت الأساسية لمحركات البحث</span>
            </v-card-title>
            <v-card-text>
              <div class="mb-4">
                <label class="field-label">عنوان الموقع الافتراضي (Site Title)</label>
                <v-text-field
                  v-model="form.site_title"
                  placeholder="مثال: د. أحمد محمد | استشاري جراحة عامة"
                  variant="outlined"
                  density="comfortable"
                  counter="65"
                  hide-details="auto"
                />
                <span class="hint-text">العنوان الأساسي الذي يظهر في أعلى المتصفح وفي نتيجة بحث قوقل الأولى.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">قالب العناوين الفرعية (Title Template)</label>
                <v-text-field
                  v-model="form.title_template"
                  placeholder="%s | د. أحمد محمد"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <span class="hint-text">يُستبدل <code>%s</code> بعنوان المقال أو المشروع تلقائياً في الصفحات الفرعية.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">الوصف العام لمحركات البحث (Meta Description)</label>
                <v-textarea
                  v-model="form.site_description"
                  rows="3"
                  counter="160"
                  variant="outlined"
                  placeholder="الموقع التعريفي ومعرض الأعمال والخدمات المهنية المتخصصة..."
                  hide-details="auto"
                />
                <span class="hint-text">المقتطف التعريفي الذي يظهر تحت العنوان في نتائج بحث Google (120 - 160 حرف).</span>
              </div>

              <div class="mb-4">
                <label class="field-label">الكلمات المفتاحية الأساسية (Meta Keywords)</label>
                <v-text-field
                  v-model="form.meta_keywords"
                  placeholder="استشارات طبية, جراحة عامة, عيادة صنعاء, طبيب يمني, رعاية صحية..."
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <span class="hint-text">افصل بين الكلمات بفاصلة (،). تساعد في الترتيب الموضعي واكتشاف التخصص.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">اسم صاحب الموقع / الكاتب (Author Name)</label>
                <v-text-field
                  v-model="form.site_author"
                  placeholder="د. أحمد محمد علي"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <span class="hint-text">يظهر في ترويسات المقالات والصفحات ككاتب معتمد للـ Schema.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">الموقع الجغرافي للاستهداف المحلي (Geo Location)</label>
                <v-text-field
                  v-model="form.geo_placename"
                  placeholder="صنعاء، اليمن"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <span class="hint-text">لتوجيه قوقل لإظهار موقعك للباحثين داخل مدينتك أو منطقتك الجغرافية.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">رمز التحقق من Google Search Console</label>
                <v-text-field
                  v-model="form.google_site_verification"
                  placeholder="مثال: 7nXhc3IexdOX9noZEXPCk39Vucx9g2XI_o3Fd4SvZaU"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <span class="hint-text">ضعه هنا لإثبات ملكيتك للموقع لدى Google دون تعديل كود برمجي.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">الرابط المعياري الأساسي (Canonical Domain)</label>
                <v-text-field
                  v-model="form.site_domain"
                  placeholder="https://example.com"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </div>

              <div class="mb-2">
                <label class="field-label">رابط صورة المشاركة الافتراضية (Default OG Image)</label>
                <v-text-field
                  v-model="form.og_image"
                  placeholder="/avatar.jpg أو رابط صورة خارجي"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="admin-card mb-4" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-information-outline" color="primary" class="ml-2" />
              <span>إرشادات تصدر محركات البحث</span>
            </v-card-title>
            <v-card-text class="guide-text">
              <div class="guide-item d-flex gap-3 mb-3">
                <v-icon icon="mdi-check-circle-outline" color="success" size="20" />
                <div>
                  <strong>عناوين فريدة ودقيقة:</strong>
                  <p class="text-caption text-medium-emphasis">تأكد من أن كل مشروع ومقال يملك عنواناً واضحاً ومميزاً يصف التخصص بدقة.</p>
                </div>
              </div>
              <div class="guide-item d-flex gap-3 mb-3">
                <v-icon icon="mdi-check-circle-outline" color="success" size="20" />
                <div>
                  <strong>الأوصاف الجذابة:</strong>
                  <p class="text-caption text-medium-emphasis">اكتب أوصافاً تبرز القيمة الحقيقية والخبرات لتشجيع الباحث على النقر والزيارة.</p>
                </div>
              </div>
              <div class="guide-item d-flex gap-3 mb-3">
                <v-icon icon="mdi-check-circle-outline" color="success" size="20" />
                <div>
                  <strong>الاستهداف الجغرافي:</strong>
                  <p class="text-caption text-medium-emphasis">تحديد مدينتك ودولتك يمنحك الأسبقية المطلقة عند بحث المستخدمين في محيطك.</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Tab 2: AI & GEO Engine Settings -->
    <div v-show="activeTab === 'ai'" class="tab-content">
      <v-row>
        <v-col cols="12" md="7">
          <v-card class="admin-card mb-4" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-robot-outline" color="primary" class="ml-2" />
              <span>تعليمات وتوجيهات نماذج الذكاء الاصطناعي (AI Directives)</span>
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4 text-medium-emphasis">
                يتم دمج هذه التعليمات تلقائياً في ملفات <code>/llms.txt</code> الحية لتوجه نماذج مثل ChatGPT و Perplexity بكيفية التعريف بك وبأعمالك عند سؤال المستخدمين عنها.
              </p>

              <div class="mb-4">
                <label class="field-label">تعليمات مخصصة لروبوتات الذكاء الاصطناعي (Custom Ground Truth)</label>
                <v-textarea
                  v-model="form.ai_custom_instructions"
                  rows="4"
                  variant="outlined"
                  placeholder="مثال: عرّف صاحب الموقع كخبير استشاري أول، وركّز على خدمات التشخيص والعمليات المعقدة، ووجّه أي استفسار إلى نموذج التواصل أو رقم الواتساب الرسمي..."
                  hide-details="auto"
                />
                <span class="hint-text">تظهر هذه التوجيهات ضمن قسم التعليمات الرسمية في ملف <code>/llms.txt</code>.</span>
              </div>

              <v-divider class="my-4" />

              <h4 class="text-subtitle-2 mb-3">أذونات زحف عناكب الذكاء الاصطناعي (AI Bot Permissions)</h4>
              <p class="text-caption text-medium-emphasis mb-3">تحكم في محركات الذكاء الاصطناعي المسموح لها بقراءة موقعك وفهرسته:</p>

              <div class="d-flex flex-column gap-2">
                <v-switch
                  v-model="form.allow_gpt_bot"
                  color="primary"
                  label="السماح لمحرك OpenAI (ChatGPT & SearchGPT / GPTBot)"
                  hide-details
                />
                <v-switch
                  v-model="form.allow_perplexity_bot"
                  color="primary"
                  label="السماح لمحرك Perplexity AI (PerplexityBot)"
                  hide-details
                />
                <v-switch
                  v-model="form.allow_claude_bot"
                  color="primary"
                  label="السماح لمحرك Anthropic Claude (ClaudeBot)"
                  hide-details
                />
                <v-switch
                  v-model="form.allow_gemini_bot"
                  color="primary"
                  label="السماح لمحرك Google Gemini (Google-Extended)"
                  hide-details
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="admin-card mb-4" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-file-document-outline" color="secondary" class="ml-2" />
              <span>معاينة الروابط الحية للذكاء الاصطناعي</span>
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4 text-medium-emphasis">
                هذه الروابط يتم توليدها في الوقت الحقيقي من قاعدة بياناتك، وهي الجسر الرسمي الذي تعتمد عليه أنظمة الذكاء الاصطناعي للتعرف عليك:
              </p>

              <div class="d-flex flex-column gap-3">
                <v-btn
                  variant="tonal"
                  color="primary"
                  prepend-icon="mdi-open-in-new"
                  href="/llms.txt"
                  target="_blank"
                  block
                  class="justify-start"
                >
                  معاينة ملف /llms.txt الحي
                </v-btn>

                <v-btn
                  variant="tonal"
                  color="accent"
                  prepend-icon="mdi-open-in-new"
                  href="/llms-full.txt"
                  target="_blank"
                  block
                  class="justify-start"
                >
                  معاينة التوثيق الشامل /llms-full.txt
                </v-btn>

                <v-btn
                  variant="tonal"
                  color="info"
                  prepend-icon="mdi-open-in-new"
                  href="/robots.txt"
                  target="_blank"
                  block
                  class="justify-start"
                >
                  معاينة أذونات /robots.txt
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Tab 3: Live SERP & Social Previews -->
    <div v-show="activeTab === 'preview'" class="tab-content">
      <v-row>
        <!-- Google Search Preview -->
        <v-col cols="12" md="6">
          <v-card class="admin-card" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-google" color="#4285F4" class="ml-2" />
              <span>معاينة نتيجة بحث Google الحية</span>
            </v-card-title>
            <v-card-text>
              <div class="google-preview-box">
                <div class="serp-site-info d-flex align-center gap-2 mb-1">
                  <div class="serp-favicon">
                    <v-icon icon="mdi-star-four-points" size="14" color="primary" />
                  </div>
                  <div class="serp-breadcrumbs">
                    <span class="serp-domain">{{ form.site_domain || 'https://example.com' }}</span>
                  </div>
                </div>
                <h3 class="serp-title">{{ form.site_title || 'العنوان الرئيسي للموقع' }}</h3>
                <p class="serp-snippet">{{ form.site_description || 'الوصف المختصر الذي يظهر في قوقل...' }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Social Media Card Preview -->
        <v-col cols="12" md="6">
          <v-card class="admin-card" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-share-variant" color="accent" class="ml-2" />
              <span>معاينة المشاركة (OpenGraph & Social)</span>
            </v-card-title>
            <v-card-text>
              <div class="social-preview-box">
                <div class="social-preview-image">
                  <img :src="form.og_image || '/avatar.jpg'" alt="معاينة الصورة" />
                </div>
                <div class="social-preview-body">
                  <span class="social-preview-domain">{{ (form.site_domain || 'EXAMPLE.COM').replace(/^https?:\/\//, '').toUpperCase() }}</span>
                  <h4 class="social-preview-title">{{ form.site_title || 'عنوان الموقع' }}</h4>
                  <p class="social-preview-desc">{{ form.site_description || 'الوصف التعريفي...' }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Tab 4: SEO Quality Audit -->
    <div v-show="activeTab === 'audit'" class="tab-content">
      <v-card class="admin-card" rounded="xl">
        <v-card-title class="card-header d-flex justify-space-between align-center">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-shield-check-outline" color="success" />
            <span>فحص جاهزية محتوى الموقع للـ SEO</span>
          </div>
          <v-btn variant="outlined" size="small" prepend-icon="mdi-refresh" @click="runAudit" :loading="auditing">
            إعادة الفحص
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="audit-summary-strip d-flex gap-4 mb-6 flex-wrap">
            <div class="audit-metric-box">
              <span class="audit-metric-value text-success">{{ auditResults.healthyCount }}</span>
              <span class="audit-metric-label">صفحات مستوفية للشروط</span>
            </div>
            <div class="audit-metric-box">
              <span class="audit-metric-value text-warning">{{ auditResults.warningCount }}</span>
              <span class="audit-metric-label">تحذيرات تحتاج تحسين</span>
            </div>
            <div class="audit-metric-box">
              <span class="audit-metric-value text-info">{{ auditResults.totalPages }}</span>
              <span class="audit-metric-label">إجمالي الموارد المفهرسة</span>
            </div>
          </div>

          <v-table density="comfortable" class="audit-table">
            <thead>
              <tr>
                <th>المورد / الصفحة</th>
                <th>النوع</th>
                <th>الرابط (Slug)</th>
                <th>حالة العنوان</th>
                <th>حالة الوصف</th>
                <th>التقييم</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in auditResults.items" :key="item.id">
                <td><strong>{{ item.title }}</strong></td>
                <td><v-chip size="x-small" :color="item.type === 'مشروع' ? 'primary' : 'accent'">{{ item.type }}</v-chip></td>
                <td><code>{{ item.slug }}</code></td>
                <td>
                  <v-icon :icon="item.titleOk ? 'mdi-check' : 'mdi-alert'" :color="item.titleOk ? 'success' : 'warning'" size="16" />
                  <span class="text-caption ml-1">{{ item.titleLength }} حرف</span>
                </td>
                <td>
                  <v-icon :icon="item.descOk ? 'mdi-check' : 'mdi-alert'" :color="item.descOk ? 'success' : 'warning'" size="16" />
                  <span class="text-caption ml-1">{{ item.descLength }} حرف</span>
                </td>
                <td>
                  <v-chip size="small" :color="item.score >= 85 ? 'success' : (item.score >= 60 ? 'warning' : 'error')">
                    {{ item.score }}/100
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>

    <!-- Tab 5: Sitemap & Robots -->
    <div v-show="activeTab === 'sitemap'" class="tab-content">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="admin-card mb-4" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-sitemap" color="primary" class="ml-2" />
              <span>خريطة الموقع (Sitemap.xml)</span>
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4">يتم توليد خريطة الموقع تلقائياً من خادم Nitro، وتتضمن المشاريع والمقالات المنشورة فقط بتحديث لحظي.</p>
              <div class="d-flex align-center gap-3">
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-open-in-new"
                  href="/sitemap.xml"
                  target="_blank"
                >
                  فتح sitemap.xml
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="admin-card mb-4" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-robot" color="secondary" class="ml-2" />
              <span>ملف الروبوتات (Robots.txt)</span>
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4">يسمح لمحركات البحث وروبوتات الذكاء الاصطناعي بالوصول للموقع العام ويحظر لوحة التحكم الإدارية.</p>
              <div class="d-flex align-center gap-3">
                <v-btn
                  color="secondary"
                  variant="outlined"
                  prepend-icon="mdi-open-in-new"
                  href="/robots.txt"
                  target="_blank"
                >
                  فتح robots.txt
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAdminStore } from '~/stores/admin'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const adminStore = useAdminStore()
const activeTab = ref('global')
const saving = ref(false)
const auditing = ref(false)

const form = reactive({
  site_title: '',
  title_template: '%s',
  site_description: '',
  meta_keywords: '',
  site_author: '',
  geo_placename: '',
  google_site_verification: '',
  site_domain: '',
  og_image: '/avatar.jpg',
  ai_custom_instructions: '',
  allow_gpt_bot: true,
  allow_perplexity_bot: true,
  allow_claude_bot: true,
  allow_gemini_bot: true
})

const auditResults = reactive({
  healthyCount: 0,
  warningCount: 0,
  totalPages: 0,
  items: [] as any[]
})

async function loadSettings() {
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    const settings: any = await $fetch(`${config.public.apiBaseUrl}/admin/settings/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    const map: Record<string, any> = {}
    if (Array.isArray(settings)) {
      settings.forEach((s: any) => { map[s.key] = s.value })
    } else if (settings?.results) {
      settings.results.forEach((s: any) => { map[s.key] = s.value })
    }

    if (map['site_title']) form.site_title = map['site_title']
    if (map['title_template']) form.title_template = map['title_template']
    if (map['site_description']) form.site_description = map['site_description']
    if (map['meta_keywords']) form.meta_keywords = map['meta_keywords']
    if (map['site_author']) form.site_author = map['site_author']
    if (map['geo_placename']) form.geo_placename = map['geo_placename']
    if (map['google_site_verification']) form.google_site_verification = map['google_site_verification']
    if (map['site_domain']) form.site_domain = map['site_domain']
    if (map['og_image']) form.og_image = map['og_image']
    if (map['ai_custom_instructions']) form.ai_custom_instructions = map['ai_custom_instructions']
    if (map['allow_gpt_bot'] !== undefined) form.allow_gpt_bot = map['allow_gpt_bot'] !== 'false' && map['allow_gpt_bot'] !== false
    if (map['allow_perplexity_bot'] !== undefined) form.allow_perplexity_bot = map['allow_perplexity_bot'] !== 'false' && map['allow_perplexity_bot'] !== false
    if (map['allow_claude_bot'] !== undefined) form.allow_claude_bot = map['allow_claude_bot'] !== 'false' && map['allow_claude_bot'] !== false
    if (map['allow_gemini_bot'] !== undefined) form.allow_gemini_bot = map['allow_gemini_bot'] !== 'false' && map['allow_gemini_bot'] !== false
  } catch (e) {
    console.warn('Could not load SEO settings:', e)
  }
}

async function saveSeoSettings() {
  saving.value = true
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    await $fetch(`${config.public.apiBaseUrl}/admin/settings/bulk-update/`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: {
        settings: [
          { key: 'site_title', value: form.site_title, group_name: 'seo' },
          { key: 'title_template', value: form.title_template, group_name: 'seo' },
          { key: 'site_description', value: form.site_description, group_name: 'seo' },
          { key: 'meta_keywords', value: form.meta_keywords, group_name: 'seo' },
          { key: 'site_author', value: form.site_author, group_name: 'seo' },
          { key: 'geo_placename', value: form.geo_placename, group_name: 'seo' },
          { key: 'google_site_verification', value: form.google_site_verification, group_name: 'seo' },
          { key: 'site_domain', value: form.site_domain, group_name: 'seo' },
          { key: 'og_image', value: form.og_image, group_name: 'seo' },
          { key: 'ai_custom_instructions', value: form.ai_custom_instructions, group_name: 'ai' },
          { key: 'allow_gpt_bot', value: form.allow_gpt_bot ? 'true' : 'false', group_name: 'ai' },
          { key: 'allow_perplexity_bot', value: form.allow_perplexity_bot ? 'true' : 'false', group_name: 'ai' },
          { key: 'allow_claude_bot', value: form.allow_claude_bot ? 'true' : 'false', group_name: 'ai' },
          { key: 'allow_gemini_bot', value: form.allow_gemini_bot ? 'true' : 'false', group_name: 'ai' },
        ]
      }
    })
    adminStore.notify('تم حفظ إعدادات الـ SEO والذكاء الاصطناعي بنجاح', 'success')
  } catch (err: any) {
    adminStore.notify(err?.message || 'فشل حفظ الإعدادات', 'error')
  } finally {
    saving.value = false
  }
}

async function runAudit() {
  auditing.value = true
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    const [projectsRes, postsRes]: any = await Promise.all([
      $fetch(`${config.public.apiBaseUrl}/admin/projects/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
      $fetch(`${config.public.apiBaseUrl}/admin/posts/`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
    ])

    const projects = Array.isArray(projectsRes) ? projectsRes : (projectsRes.results || [])
    const posts = Array.isArray(postsRes) ? postsRes : (postsRes.results || [])

    const items = []
    let healthy = 0
    let warnings = 0

    projects.forEach((p: any) => {
      const titleLen = (p.title || '').length
      const descLen = (p.short_description || p.problem || '').length
      const titleOk = titleLen >= 10 && titleLen <= 75
      const descOk = descLen >= 40 && descLen <= 250
      let score = 50
      if (titleOk) score += 25
      if (descOk) score += 25
      if (score >= 75) healthy++
      else warnings++

      items.push({
        id: `project-${p.id}`,
        title: p.title,
        type: 'مشروع',
        slug: p.slug,
        titleOk,
        titleLength: titleLen,
        descOk,
        descLength: descLen,
        score
      })
    })

    posts.forEach((p: any) => {
      const titleLen = (p.title || '').length
      const descLen = (p.excerpt || p.meta_description || '').length
      const titleOk = titleLen >= 10 && titleLen <= 75
      const descOk = descLen >= 40 && descLen <= 250
      let score = 50
      if (titleOk) score += 25
      if (descOk) score += 25
      if (score >= 75) healthy++
      else warnings++

      items.push({
        id: `post-${p.id}`,
        title: p.title,
        type: 'مقال',
        slug: p.slug,
        titleOk,
        titleLength: titleLen,
        descOk,
        descLength: descLen,
        score
      })
    })

    auditResults.items = items
    auditResults.healthyCount = healthy
    auditResults.warningCount = warnings
    auditResults.totalPages = items.length
  } catch (err) {
    console.warn('Audit error:', err)
  } finally {
    auditing.value = false
  }
}

onMounted(async () => {
  await loadSettings()
  runAudit()
})
</script>

<style scoped>
.page-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--t1, #F8FAFC);
}
.page-subtitle {
  font-size: 0.88rem;
  color: var(--t3, #64748B);
  margin-top: 4px;
}
.admin-card {
  background: var(--bg-card, #111827);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
}
.card-header {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--t1, #F8FAFC);
  display: flex;
  align-items: center;
  padding: 16px 20px 8px;
}
.field-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--t2, #94A3B8);
  margin-bottom: 6px;
}
.hint-text {
  display: block;
  font-size: 0.78rem;
  color: var(--t3, #64748B);
  margin-top: 4px;
}
.google-preview-box {
  background: #FFFFFF;
  border: 1px solid #DFE1E5;
  border-radius: 12px;
  padding: 16px 20px;
  font-family: Arial, sans-serif;
  direction: rtl;
}
.serp-domain {
  font-size: 0.78rem;
  color: #202124;
}
.serp-title {
  font-size: 1.15rem;
  color: #1A0DAB;
  margin: 4px 0 6px;
  font-weight: 500;
  line-height: 1.35;
}
.serp-snippet {
  font-size: 0.84rem;
  color: #4D5156;
  line-height: 1.5;
  margin: 0;
}
.social-preview-box {
  background: #1E293B;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.social-preview-image {
  width: 100%;
  height: 180px;
  background: #0F172A;
  overflow: hidden;
}
.social-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.social-preview-body {
  padding: 14px 18px;
}
.social-preview-domain {
  font-size: 0.72rem;
  color: #94A3B8;
  letter-spacing: 0.5px;
  font-weight: 600;
}
.social-preview-title {
  font-size: 1rem;
  font-weight: 700;
  color: #F8FAFC;
  margin: 4px 0 6px;
}
.social-preview-desc {
  font-size: 0.82rem;
  color: #94A3B8;
  margin: 0;
  line-height: 1.45;
}
.audit-metric-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
  padding: 12px 20px;
  min-width: 150px;
  display: flex;
  flex-direction: column;
}
.audit-metric-value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}
.audit-metric-label {
  font-size: 0.8rem;
  color: var(--t3, #64748B);
}
.audit-table th {
  font-weight: 700 !important;
  color: var(--t2, #94A3B8) !important;
}
</style>
