<template>
  <div class="admin-seo-view" dir="rtl">
    <!-- Header -->
    <div class="page-header d-flex align-center justify-space-between flex-wrap gap-4 mb-6">
      <div>
        <h1 class="page-title d-flex align-center gap-2">
          <v-icon icon="mdi-google" color="primary" size="28" />
          <span>مدير تحسين محركات البحث (SEO Suite)</span>
        </h1>
        <p class="page-subtitle">إدارة وسوم الـ Meta، المعاينة الحية لنتائج البحث، ومراقبة مؤشر الجودة العام</p>
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
          حفظ إعدادات الـ SEO
        </v-btn>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="primary" class="mb-6">
      <v-tab value="global">
        <v-icon icon="mdi-earth" class="ml-2" />
        التهيئة العامة والـ Meta
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
                  placeholder="عبد الخالق الصايدي | مهندس برمجيات متكامل"
                  variant="outlined"
                  density="comfortable"
                  counter="65"
                  hide-details="auto"
                />
                <span class="hint-text">يظهر كعنوان للصفحة الرئيسية وعند تعذر العثور على عنوان فرعي.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">قالب العناوين الفرعية (Title Template)</label>
                <v-text-field
                  v-model="form.title_template"
                  placeholder="%s | عبد الخالق الصايدي"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <span class="hint-text">يُستبدل <code>%s</code> بعنوان المشروع أو المقال تلقائياً.</span>
              </div>

              <div class="mb-4">
                <label class="field-label">الوصف العام للموقع (Meta Description)</label>
                <v-textarea
                  v-model="form.site_description"
                  rows="3"
                  counter="160"
                  variant="outlined"
                  placeholder="معرض أعمال عبد الخالق الصايدي - Senior Full Stack Software Engineer..."
                  hide-details="auto"
                />
                <span class="hint-text">المقتطف التعريفي الذي يظهر تحت العنوان في نتائج بحث Google (120 - 160 حرف).</span>
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
                  placeholder="/avatar.jpg أو رابط خارجي"
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
              <span>إرشادات تحسين محركات البحث</span>
            </v-card-title>
            <v-card-text class="guide-text">
              <div class="guide-item d-flex gap-3 mb-3">
                <v-icon icon="mdi-check-circle-outline" color="success" size="20" />
                <div>
                  <strong>عناوين فريدة:</strong>
                  <p class="text-caption text-medium-emphasis">تأكد من أن كل مشروع ومقال يملك عنواناً واضحاً ومختلفاً عن غيره.</p>
                </div>
              </div>
              <div class="guide-item d-flex gap-3 mb-3">
                <v-icon icon="mdi-check-circle-outline" color="success" size="20" />
                <div>
                  <strong>الأوصاف الجاذبة:</strong>
                  <p class="text-caption text-medium-emphasis">اكتب أوصافاً تركز على المشكلة والحل والتقنيات لتشجيع النقر (CTR).</p>
                </div>
              </div>
              <div class="guide-item d-flex gap-3 mb-3">
                <v-icon icon="mdi-check-circle-outline" color="success" size="20" />
                <div>
                  <strong>الروابط اللطيفة (Slugs):</strong>
                  <p class="text-caption text-medium-emphasis">تجنب الرموز المعقدة واستخدم كلمات مفتاحية تعبر عن المشروع.</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Tab 2: Live SERP & Social Previews -->
    <div v-show="activeTab === 'preview'" class="tab-content">
      <v-row>
        <!-- Google Search Preview -->
        <v-col cols="12" md="6">
          <v-card class="admin-card" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-google" color="#4285F4" class="ml-2" />
              <span>معاينة نتيجة بحث Google</span>
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
                <h3 class="serp-title">{{ form.site_title || 'عبد الخالق الصايدي | مهندس برمجيات متكامل' }}</h3>
                <p class="serp-snippet">{{ form.site_description || 'معرض أعمال ومشاريع عبد الخالق الصايدي...' }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Social Media Card Preview -->
        <v-col cols="12" md="6">
          <v-card class="admin-card" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-share-variant" color="accent" class="ml-2" />
              <span>معاينة المشاركة (OpenGraph & X)</span>
            </v-card-title>
            <v-card-text>
              <div class="social-preview-box">
                <div class="social-preview-image">
                  <img :src="form.og_image || '/avatar.jpg'" alt="معاينة الصورة" />
                </div>
                <div class="social-preview-body">
                  <span class="social-preview-domain">{{ (form.site_domain || 'EXAMPLE.COM').replace(/^https?:\/\//, '').toUpperCase() }}</span>
                  <h4 class="social-preview-title">{{ form.site_title || 'عبد الخالق الصايدي | مهندس برمجيات متكامل' }}</h4>
                  <p class="social-preview-desc">{{ form.site_description || 'معرض أعمال عبد الخالق الصايدي...' }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Tab 3: SEO Quality Audit -->
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

    <!-- Tab 4: Sitemap & Robots -->
    <div v-show="activeTab === 'sitemap'" class="tab-content">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="admin-card mb-4" rounded="xl">
            <v-card-title class="card-header">
              <v-icon icon="mdi-sitemap" color="primary" class="ml-2" />
              <span>خريطة الموقع (Sitemap.xml)</span>
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-4">يتم توليد خريطة الموقع تلقائياً من خادم Nitro، وتتضمن المشاريع والمقالات المنشورة فقط.</p>
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
              <p class="text-body-2 mb-4">يسمح للعناكب بالوصول للموقع العام ويحظر لوحة التحكم الإدارية ومسارات التوثيق.</p>
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
  site_title: 'عبد الخالق الصايدي | مهندس برمجيات متكامل',
  title_template: '%s | عبد الخالق الصايدي',
  site_description: 'معرض أعمال عبد الخالق الصايدي - Senior Full Stack Software Engineer متخصص في بناء الأنظمة السحابية وتطبيقات الويب عالية الأداء والأمان.',
  site_domain: 'https://example.com',
  og_image: '/avatar.jpg'
})

const auditResults = reactive({
  healthyCount: 0,
  warningCount: 0,
  totalPages: 0,
  items: []
})

async function loadSettings() {
  try {
    const config = useRuntimeConfig()
    const token = localStorage.getItem('access_token')
    const settings: any = await $fetch(`${config.public.apiBaseUrl}/admin/settings/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    const map: Record<string, string> = {}
    if (Array.isArray(settings)) {
      settings.forEach((s: any) => { map[s.key] = s.value })
    } else if (settings.results) {
      settings.results.forEach((s: any) => { map[s.key] = s.value })
    }

    if (map['site_title']) form.site_title = map['site_title']
    if (map['title_template']) form.title_template = map['title_template']
    if (map['site_description']) form.site_description = map['site_description']
    if (map['site_domain']) form.site_domain = map['site_domain']
    if (map['og_image']) form.og_image = map['og_image']
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
          { key: 'site_domain', value: form.site_domain, group_name: 'seo' },
          { key: 'og_image', value: form.og_image, group_name: 'seo' },
        ]
      }
    })
    adminStore.notify('تم حفظ إعدادات الـ SEO بنجاح', 'success')
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
      const titleOk = titleLen >= 15 && titleLen <= 70
      const descOk = descLen >= 60 && descLen <= 250
      let score = 50
      if (titleOk) score += 25
      if (descOk) score += 25
      if (score >= 80) healthy++
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
      const titleOk = titleLen >= 15 && titleLen <= 70
      const descOk = descLen >= 60 && descLen <= 250
      let score = 50
      if (titleOk) score += 25
      if (descOk) score += 25
      if (score >= 80) healthy++
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
  } catch (e) {
    console.error('Audit failed:', e)
  } finally {
    auditing.value = false
  }
}

onMounted(async () => {
  await loadSettings()
  await runAudit()
})
</script>

<style scoped>
.admin-seo-view {
  padding: 24px;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--t1, #F8FAFC);
  margin-bottom: 4px;
}

.page-subtitle {
  color: var(--t2, #94A3B8);
  font-size: 0.9rem;
}

.admin-card {
  background: var(--bg-card, #0F172A) !important;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08)) !important;
  color: var(--t1, #F8FAFC) !important;
}

.card-header {
  font-size: 1.05rem;
  font-weight: 700;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  padding: 16px 20px;
}

.field-label {
  display: block;
  font-weight: 600;
  font-size: 0.88rem;
  margin-bottom: 6px;
  color: var(--t1, #F8FAFC);
}

.hint-text {
  display: block;
  font-size: 0.78rem;
  color: var(--t3, #64748B);
  margin-top: 4px;
}

/* Google Preview */
.google-preview-box {
  background: #ffffff;
  color: #202124;
  padding: 18px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  text-align: right;
  direction: rtl;
}

.serp-favicon {
  width: 24px;
  height: 24px;
  background: #f1f3f4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.serp-domain {
  font-size: 0.8rem;
  color: #202124;
}

.serp-title {
  color: #1a0dab;
  font-size: 1.15rem;
  font-weight: 500;
  line-height: 1.3;
  margin: 6px 0 4px;
  cursor: pointer;
}

.serp-snippet {
  color: #4d5156;
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0;
}

/* Social Preview */
.social-preview-box {
  background: var(--bg-2, #111827);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  overflow: hidden;
}

.social-preview-image {
  width: 100%;
  height: 180px;
  background: #000;
}

.social-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.social-preview-body {
  padding: 14px;
}

.social-preview-domain {
  font-size: 0.75rem;
  color: var(--t3, #64748B);
  text-transform: uppercase;
}

.social-preview-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 4px 0;
  color: var(--t1, #F8FAFC);
}

.social-preview-desc {
  font-size: 0.82rem;
  color: var(--t2, #94A3B8);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Audit summary strip */
.audit-summary-strip {
  display: flex;
}

.audit-metric-box {
  flex: 1;
  min-width: 140px;
  padding: 16px;
  background: var(--bg-subtle, #161F30);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 12px;
  text-align: center;
}

.audit-metric-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
}

.audit-metric-label {
  font-size: 0.8rem;
  color: var(--t2, #94A3B8);
}

.audit-table {
  background: transparent !important;
  color: var(--t1, #F8FAFC) !important;
}
</style>
