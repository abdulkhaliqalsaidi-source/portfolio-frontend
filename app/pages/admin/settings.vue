<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إعدادات النظام والموقع</h1>
        <p class="page-subtitle">تخصيص عنوان الموقع وسيو محركات البحث ونصوص الكتابة التلقائية وإعدادات الأمان.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" :disabled="saving" @click="saveSettings">
          <v-progress-circular v-if="saving" indeterminate size="18" width="2" />
          <v-icon v-else icon="mdi-content-save-outline" size="18" />
          <span>حفظ كافة الإعدادات</span>
        </button>
      </div>
    </div>

    <v-form ref="form" @submit.prevent="saveSettings">
      <v-row>
        <!-- General & SEO -->
        <v-col cols="12" md="7">
          <div class="admin-card mb-6">
            <h3 class="card-section-title">العناوين ومحركات البحث (SEO)</h3>

            <div class="mb-4">
              <label class="field-label">عنوان الموقع الرئيسي (Site Title) *</label>
              <v-text-field
                v-model="settings.site_title"
                placeholder="مثال: معرض الأعمال الشخصي والمحفظة المهنية"
                variant="outlined"
                density="comfortable"
              />
            </div>

            <div class="mb-4">
              <label class="field-label">الوصف لمحركات البحث (Meta Description)</label>
              <v-textarea
                v-model="settings.meta_description"
                placeholder="مثال: الموقع التعريفي ومعرض الأعمال والخدمات المهنية المتخصصة..."
                variant="outlined"
                rows="3"
              />
            </div>

            <div class="mb-4">
              <label class="field-label">الكلمات المفتاحية (Meta Keywords)</label>
              <v-text-field
                v-model="settings.meta_keywords"
                placeholder="تصميم جرافيك, استشارات إدارية, تسويق رقمي, هندسة, تخطيط استراتيجي..."
                variant="outlined"
                density="comfortable"
              />
            </div>
          </div>

          <div class="admin-card mb-6">
            <h3 class="card-section-title">نصوص الكتابة التلقائية في الواجهة (Typing Effect)</h3>
            <p class="text-caption mb-3 text-secondary">
              الأدوار والمسميات التي تظهر بحركة الكتابة في قسم الهيدر (افصل بينها بفاصلة).
            </p>
            <v-textarea
              v-model="settings.typing_roles"
              placeholder="مصمم هويات بصرية, مستشار استراتيجي, مدير مشاريع, خبير تسويق رقمي"
              variant="outlined"
              rows="2"
            />
          </div>

          <div class="admin-card">
            <h3 class="card-section-title">ملاحظة منهجية ومعايير العمل (Quality & Methodology Note)</h3>
            <div class="mb-3">
              <label class="field-label">عنوان الملاحظة</label>
              <v-text-field
                v-model="settings.architecture_note_title"
                placeholder="معايير الجودة ومنهجية العمل المعتمدة:"
                variant="outlined"
                density="comfortable"
              />
            </div>
            <div>
              <label class="field-label">نص الملاحظة والمنهجية</label>
              <v-textarea
                v-model="settings.architecture_note_desc"
                placeholder="الالتزام بأعلى معايير الدقة والاحترافية، المتابعة المستمرة لمتطلبات العمل، تسليم المخرجات في المواعيد المحددة، وضمان تحقيق أفضل قيمة مضافة وتجربة متكاملة للعميل."
                variant="outlined"
                rows="3"
              />
            </div>
          </div>
        </v-col>

        <!-- Switches & Controls -->
        <v-col cols="12" md="5">
          <div class="admin-card mb-6">
            <h3 class="card-section-title">حالة النظام والوضع الفني</h3>

            <v-switch
              v-model="settings.maintenance_mode"
              color="warning"
              label="وضع الصيانة (Maintenance Mode)"
              hide-details
              class="mb-3"
            />

            <v-switch
              v-model="settings.enable_particles_bg"
              color="primary"
              label="تفعيل خلفية الجسيمات التفاعلية (Three.js Particles)"
              hide-details
              class="mb-3"
            />

            <v-switch
              v-model="settings.enable_contact_form"
              color="success"
              label="تفعيل نموذج التواصل في الموقع"
              hide-details
              class="mb-3"
            />

            <v-switch
              v-model="settings.enable_testimonials"
              color="primary"
              label="إظهار قسم آراء العملاء"
              hide-details
            />
          </div>

          <div class="admin-card">
            <h3 class="card-section-title">أرقام التواصل السريع</h3>
            <div class="mb-3">
              <label class="field-label">رقم WhatsApp للزر العائم</label>
              <v-text-field
                v-model="settings.whatsapp_number"
                placeholder="967771523243"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-whatsapp"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

import { ref, onMounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'

const portfolioStore = usePortfolioStore()
const adminStore = useAdminStore()

const saving = ref(false)
const settings = ref({
  site_title: '',
  meta_description: '',
  meta_keywords: '',
  typing_roles: '',
  architecture_note_title: '',
  architecture_note_desc: '',
  maintenance_mode: false,
  enable_particles_bg: true,
  enable_contact_form: true,
  enable_testimonials: true,
  whatsapp_number: '',
})

async function fetchSettings() {
  try {
    const data = await adminService.getSettings()
    const items = Array.isArray(data) ? data : (data?.results || [])
    if (Array.isArray(items) && items.length > 0) {
      items.forEach(item => {
        let val = item.value
        if (item.setting_type === 'boolean' || item.value_type === 'boolean' || val === 'true' || val === 'True' || val === 'false' || val === 'False') {
          val = (val === 'true' || val === 'True' || val === true)
        } else if (item.setting_type === 'integer' || item.value_type === 'integer') {
          val = parseInt(item.value, 10)
        }
        settings.value[item.key] = val
      })
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      Object.entries(data).forEach(([key, value]) => {
        let val = value
        if (val === 'true' || val === 'True' || val === 'false' || val === 'False') {
          val = (val === 'true' || val === 'True' || val === true)
        }
        settings.value[key] = val
      })
    }
  } catch (err) {
    adminStore.notify('فشل تحميل إعدادات الموقع', 'error')
  }
}

async function saveSettings() {
  saving.value = true
  try {
    const payload = {}
    Object.keys(settings.value).forEach(key => {
      payload[key] = settings.value[key]
    })
    await adminService.updateSettingsBulk(payload)
    adminStore.notify('تم حفظ وتطبيق الإعدادات بنجاح!', 'success')
    await fetchSettings()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ الإعدادات', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.admin-page { max-width: 1300px; margin: 0 auto; }
.page-title { font-family: var(--f-display, 'Tajawal', sans-serif); font-size: 1.6rem; font-weight: 900; color: var(--t1); margin-bottom: 4px; }
.page-subtitle { font-size: 0.85rem; color: var(--t2); }

.admin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
}
.admin-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}
.card-section-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.08rem; font-weight: 800; color: var(--t1);
  padding-bottom: 12px; border-bottom: 1px solid var(--border);
  margin-bottom: 18px;
}
.field-label { font-size: 0.8rem; font-weight: 700; color: var(--t2); margin-bottom: 6px; display: block; }
</style>
