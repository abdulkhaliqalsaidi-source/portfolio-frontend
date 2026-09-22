<template>
  <div class="admin-page">
    <!-- Page Header with Clean Responsive Save Button -->
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة الملف الشخصي والسيرة الذاتية</h1>
        <p class="page-subtitle">تعديل بيانات المهندس والمعلومات الأساسية والروابط وحالة التفرغ للعمل ورفع الصورة والسيرة الذاتية.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" :disabled="saving" @click="saveProfile">
          <v-progress-circular v-if="saving" indeterminate size="18" width="2" />
          <v-icon v-else icon="mdi-content-save-outline" size="18" />
          <span>حفظ كافة التعديلات</span>
        </button>
      </div>
    </div>

    <v-form ref="form" @submit.prevent="saveProfile">
      <v-row>
        <!-- Left: Basic Info -->
        <v-col cols="12" md="8">
          <div class="admin-card mb-6">
            <h3 class="card-section-title">المعلومات الأساسية</h3>

            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <label class="field-label">الاسم الكامل *</label>
                <v-text-field
                  v-model="profile.full_name"
                  placeholder="مثال: د. سارة الأحمدي أو م. خالد العلي"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'الاسم مطلوب']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">المسمى المهني / الوظيفي *</label>
                <v-text-field
                  v-model="profile.title"
                  placeholder="مثال: مصمم هويات بصرية أو مستشار أعمال أو طبيب استشاري"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'المسمى مطلوب']"
                />
              </v-col>
              <v-col cols="12">
                <label class="field-label">العبارة التعريفية (Tagline) *</label>
                <v-text-field
                  v-model="profile.tagline"
                  placeholder="مثال: تقديم حلول إبداعية واستشارات متخصصة بمعايير عالمية."
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'العبارة التعريفية مطلوبة']"
                />
              </v-col>
              <v-col cols="12">
                <label class="field-label">النبذة التعريفية الكاملة (Bio)</label>
                <v-textarea
                  v-model="profile.bio"
                  placeholder="اكتب نبذة مهنية شاملة عن خبراتك ومجالات تخصصك..."
                  variant="outlined"
                  rows="4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">سنوات الخبرة</label>
                <v-text-field
                  v-model.number="profile.years_of_experience"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">الموقع الجغرافي</label>
                <v-text-field
                  v-model="profile.location"
                  placeholder="مثال: الرياض، المملكة العربية السعودية"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>
          </div>

          <div class="admin-card">
            <h3 class="card-section-title">بيانات التواصل والشبكات الاجتماعية</h3>

            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <label class="field-label">البريد الإلكتروني الأساسي *</label>
                <v-text-field
                  v-model="profile.email"
                  placeholder="contact@example.com"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-email-outline"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رقم الهاتف الظاهر</label>
                <v-text-field
                  v-model="profile.phone"
                  placeholder="+966 50 000 0000"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-phone-outline"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رقم WhatsApp (بدون + أو مسافات)</label>
                <v-text-field
                  v-model="profile.whatsapp"
                  placeholder="966500000000"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-whatsapp"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط حساب LinkedIn</label>
                <v-text-field
                  v-model="profile.linkedin"
                  placeholder="https://linkedin.com/in/..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-linkedin"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط حساب Behance (للمصممين والفنانين)</label>
                <v-text-field
                  v-model="profile.behance"
                  placeholder="https://behance.net/..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-behance"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط حساب Dribbble</label>
                <v-text-field
                  v-model="profile.dribbble"
                  placeholder="https://dribbble.com/..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-dribbble"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط حساب Instagram</label>
                <v-text-field
                  v-model="profile.instagram"
                  placeholder="https://instagram.com/..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-instagram"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط قناة YouTube</label>
                <v-text-field
                  v-model="profile.youtube"
                  placeholder="https://youtube.com/@..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-youtube"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط منصة X / Twitter</label>
                <v-text-field
                  v-model="profile.twitter"
                  placeholder="https://x.com/..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-twitter"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط الموقع أو المعرض الشخصي (Website)</label>
                <v-text-field
                  v-model="profile.website"
                  placeholder="https://mywebsite.com"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-web"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">رابط GitHub / المستودع الخارجي</label>
                <v-text-field
                  v-model="profile.github"
                  placeholder="https://github.com/..."
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-github"
                />
              </v-col>
            </v-row>
          </div>
        </v-col>

        <!-- Right: Status, Media & Resume Uploads -->
        <v-col cols="12" md="4">
          <!-- Work Status Toggle Card -->
          <div class="admin-card mb-6">
            <div class="d-flex align-center justify-between gap-3">
              <div>
                <h3 class="card-section-title mb-0 border-0 pb-0">حالة العمل والتوظيف</h3>
                <div class="text-caption mt-1" :style="{ color: profile.available_for_work ? '#10B981' : 'rgba(255,255,255,0.45)' }">
                  {{ profile.available_for_work ? 'متاح للعمل والمشاريع (نشط)' : 'غير متاح حالياً' }}
                </div>
              </div>
              <v-switch
                v-model="profile.available_for_work"
                color="success"
                hide-details
                density="compact"
              />
            </div>
            <p class="text-caption mt-3 text-secondary">
              عند التفعيل، ستظهر شارة خضراء نابضة في الصفحة الرئيسية توضح جاهزيتك لاستقبال عروض العمل.
            </p>
          </div>

          <!-- Site Brand Logo / Icon Card -->
          <div class="admin-card mb-6">
            <div class="d-flex align-center justify-space-between mb-2">
              <h3 class="card-section-title mb-0">أيقونة وشعار الموقع (Brand Logo)</h3>
              <v-btn
                v-if="profile.logo && profile.logo !== 'mdi-star-four-points'"
                variant="text"
                size="x-small"
                color="primary"
                prepend-icon="mdi-restore"
                :loading="savingLogo"
                @click="resetLogoToDefault"
              >
                استعادة الافتراضي
              </v-btn>
            </div>
            <p class="text-caption mb-3 text-secondary">
              الشعار أو الأيقونة التي تظهر بجانب اسمك في شريط الموقع وتذييل الصفحات. يمكنك اختيار أيقونة جاهزة أو كتابة اسم أيقونة MDI أو رفع صورة شعار مخصصة.
            </p>

            <!-- Live Preview of Header Brand Badge -->
            <div class="logo-live-preview-box mb-4">
              <div class="preview-badge-header">
                <span class="preview-badge-label">معاينة مباشرة في شريط الموقع:</span>
              </div>
              <div class="preview-brand-item">
                <div class="preview-logo-mark">
                  <img v-if="isImageLogo(profile.logo)" :src="profile.logo" class="preview-logo-img" alt="Logo" />
                  <v-icon v-else :icon="profile.logo || 'mdi-star-four-points'" size="20" color="#3B82F6" />
                </div>
                <div class="preview-logo-text">
                  <span class="preview-logo-name">{{ profile.full_name || 'م/ عبد الخالق الصايدي' }}</span>
                  <span class="preview-logo-role">{{ profile.title || 'مطور برمجيات' }}</span>
                </div>
              </div>
            </div>

            <!-- Preset Icons Grid -->
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="field-label mb-0">اختر أيقونة سريعة:</label>
              <span class="text-caption text-secondary">تُحفظ تلقائياً فور النقر</span>
            </div>
            <div class="preset-icons-grid mb-4">
              <button
                v-for="item in presetIcons"
                :key="item.icon"
                type="button"
                class="preset-icon-btn"
                :class="{ active: profile.logo === item.icon }"
                :title="item.label"
                :disabled="savingLogo"
                @click="selectPresetIcon(item.icon)"
              >
                <v-icon :icon="item.icon" size="20" />
              </button>
            </div>

            <!-- Custom Icon Name Input -->
            <label class="field-label">اسم أيقونة MDI مخصصة</label>
            <v-text-field
              v-model="profile.logo"
              placeholder="mdi-star-four-points"
              variant="outlined"
              density="compact"
              class="mb-3"
              hint="يمكنك كتابة أي أيقونة من مكتبة Material Design Icons (مثل: mdi-code-tags)"
              persistent-hint
            >
              <template #prepend-inner>
                <v-icon
                  v-if="!isImageLogo(profile.logo)"
                  :icon="profile.logo || 'mdi-star-four-points'"
                  size="18"
                  color="primary"
                />
                <v-icon v-else icon="mdi-image-outline" size="18" color="primary" />
              </template>
            </v-text-field>

            <!-- Dedicated Save Logo Button -->
            <div class="mt-3 mb-4">
              <button
                type="button"
                class="btn-save-logo"
                :disabled="savingLogo"
                @click="saveLogoDirectly()"
              >
                <v-progress-circular v-if="savingLogo" indeterminate size="16" width="2" color="white" />
                <v-icon v-else icon="mdi-content-save-check-outline" size="18" />
                <span>{{ savingLogo ? 'جاري حفظ الأيقونة وتحديث الموقع...' : 'حفظ الأيقونة والشعار الآن' }}</span>
              </button>
            </div>

            <!-- Custom Image / SVG Logo Upload -->
            <div class="logo-upload-section mt-4 pt-3 border-t">
              <div class="d-flex align-center justify-space-between mb-2">
                <span class="text-caption font-weight-bold" style="color: var(--t1)">أو ارفع صورة / SVG للشعار:</span>
                <span v-if="isImageLogo(profile.logo)" class="badge-custom-img">صورة مفعلة</span>
              </div>

              <input
                type="file"
                ref="logoFileInput"
                class="d-none"
                accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
                @change="handleLogoUpload"
              />

              <div class="d-flex gap-2">
                <button
                  type="button"
                  class="btn-upload-logo flex-1"
                  :disabled="uploadingLogo || savingLogo"
                  @click="$refs.logoFileInput.click()"
                >
                  <v-progress-circular v-if="uploadingLogo" indeterminate size="16" width="2" />
                  <v-icon v-else icon="mdi-cloud-upload-outline" size="16" />
                  <span>{{ uploadingLogo ? 'جاري رفع الشعار...' : 'رفع صورة شعار (PNG / SVG)' }}</span>
                </button>

                <v-btn
                  v-if="isImageLogo(profile.logo)"
                  color="error"
                  variant="outlined"
                  density="compact"
                  height="38"
                  :loading="savingLogo"
                  @click="resetLogoToDefault"
                  title="إلغاء الصورة والعودة للأيقونة"
                >
                  <v-icon icon="mdi-close" size="16" />
                </v-btn>
              </div>
            </div>
          </div>

          <!-- Avatar Upload Box -->
          <div class="admin-card mb-6">
            <h3 class="card-section-title">صورة الملف الشخصي</h3>

            <div class="avatar-upload-area text-center my-4">
              <div class="avatar-preview-box">
                <img v-if="profile.avatar" :src="profile.avatar" class="profile-preview-img" alt="Avatar" />
                <div v-else class="d-flex align-center justify-center h-100 w-100" style="background: var(--bg-subtle);">
                  <v-icon icon="mdi-account" size="48" color="primary" class="opacity-50" />
                </div>
                <div v-if="uploadingAvatar" class="avatar-upload-overlay">
                  <v-progress-circular indeterminate color="primary" size="32" />
                </div>
              </div>

              <input
                type="file"
                ref="avatarFileInput"
                class="d-none"
                accept="image/*"
                @change="handleAvatarUpload"
              />

              <button
                type="button"
                class="btn-upload mt-4"
                :disabled="uploadingAvatar"
                @click="$refs.avatarFileInput.click()"
              >
                <v-progress-circular v-if="uploadingAvatar" indeterminate size="16" width="2" />
                <v-icon v-else icon="mdi-camera-outline" size="16" />
                <span>{{ uploadingAvatar ? 'جاري رفع وحفظ الصورة...' : 'اختر صورة من جهازك' }}</span>
              </button>
            </div>

            <label class="field-label mt-2">رابط الصورة المحفوظة</label>
            <v-text-field
              v-model="profile.avatar"
              placeholder="/avatar.jpg أو https://..."
              variant="outlined"
              density="compact"
              hide-details
            />
          </div>

          <!-- Resume PDF Upload Box -->
          <div class="admin-card">
            <div class="d-flex align-center justify-space-between mb-2">
              <h3 class="card-section-title mb-0">السيرة الذاتية (CV / Resume)</h3>
              <v-btn
                v-if="profile.resume"
                color="error"
                variant="tonal"
                size="x-small"
                prepend-icon="mdi-trash-can-outline"
                :loading="deletingResume"
                @click="deleteResume"
              >
                حذف السيرة الذاتية
              </v-btn>
            </div>
            <p class="text-caption mb-3 text-secondary">
              ملف الـ PDF الذي سيتم تحميله عند ضغط الزوار على زر "السيرة الذاتية". في حال عدم وجود ملف، لن تظهر أزرار تحميل السيرة في الموقع نهائياً.
            </p>

            <div class="resume-upload-area mb-3">
              <input
                type="file"
                ref="resumeFileInput"
                class="d-none"
                accept=".pdf"
                @change="handleResumeUpload"
              />

              <div
                class="resume-drop-box text-center p-3"
                :class="{ 'has-file': !!profile.resume }"
                @click="$refs.resumeFileInput.click()"
              >
                <v-progress-circular v-if="uploadingResume" indeterminate color="primary" size="28" class="mb-2" />
                <v-icon v-else icon="mdi-file-pdf-box" size="36" :color="profile.resume ? '#10B981' : '#EF4444'" class="mb-1" />
                <div class="text-caption font-weight-bold">
                  {{ uploadingResume ? 'جاري رفع وحفظ الملف...' : (profile.resume ? 'تم رفع ملف السيرة (اضغط لاستبداله)' : 'اضغط لاختيار ملف PDF من جهازك') }}
                </div>
                <div class="text-caption text-secondary">حتى 10 ميغابايت (ملفات PDF فقط)</div>
              </div>
            </div>

            <label class="field-label">مسار أو رابط ملف السيرة الذاتية</label>
            <v-text-field
              v-model="profile.resume"
              placeholder="لا توجد سيرة ذاتية مرفوعة حالياً"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-link"
              clearable
              hide-details
              class="mb-3"
              @click:clear="profile.resume = ''"
            />

            <div v-if="profile.resume" class="d-flex align-center gap-2">
              <a :href="profile.resume" target="_blank" class="btn-preview-resume flex-1">
                <v-icon icon="mdi-open-in-new" size="15" />
                معاينة الملف الحالي
              </a>
              <v-btn
                color="error"
                variant="outlined"
                density="compact"
                height="34"
                prepend-icon="mdi-trash-can-outline"
                :loading="deletingResume"
                @click="deleteResume"
              >
                حذف
              </v-btn>
            </div>
            <div v-else class="text-caption text-secondary py-1">
              <v-icon icon="mdi-information-outline" size="14" class="ml-1" />
              لا توجد سيرة ذاتية مرفوعة حالياً (أزرار التحميل مخفية تلقائياً في الموقع).
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Bottom Save Action Bar -->
      <div class="bottom-save-bar mt-6 d-flex align-center justify-space-between admin-card">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-shield-check-outline" color="success" size="22" />
          <span class="text-body-2 font-weight-medium" style="color: var(--t1)">تأكد من حفظ التعديلات بعد إتمام البيانات</span>
        </div>
        <button type="submit" class="btn btn-primary px-6" :disabled="saving">
          <v-progress-circular v-if="saving" indeterminate size="18" width="2" />
          <v-icon v-else icon="mdi-content-save-outline" size="18" />
          <span>حفظ كافة التعديلات</span>
        </button>
      </div>
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

const form = ref(null)
const saving = ref(false)
const savingLogo = ref(false)
const uploadingAvatar = ref(false)
const uploadingResume = ref(false)
const uploadingLogo = ref(false)
const deletingResume = ref(false)
const avatarFileInput = ref(null)
const resumeFileInput = ref(null)
const logoFileInput = ref(null)

const presetIcons = [
  { icon: 'mdi-star-four-points', label: 'نجمة التميز (الافتراضي)' },
  { icon: 'mdi-code-tags', label: 'كود وبرمجة' },
  { icon: 'mdi-laptop-code', label: 'مطور برمجيات' },
  { icon: 'mdi-rocket-launch-outline', label: 'صاروخ وإطلاق' },
  { icon: 'mdi-lightning-bolt', label: 'طاقة وسرعة' },
  { icon: 'mdi-xml', label: 'وسوم برمجية' },
  { icon: 'mdi-source-branch', label: 'تفرع Git' },
  { icon: 'mdi-terminal', label: 'تيرمينال' },
  { icon: 'mdi-database', label: 'قواعد بيانات' },
  { icon: 'mdi-cube-outline', label: 'مكعب تقني' },
  { icon: 'mdi-shield-check-outline', label: 'أمان وجودة' },
  { icon: 'mdi-crown-outline', label: 'تاج احترافي' }
]

function isImageLogo(val) {
  if (!val || typeof val !== 'string') return false
  const v = val.trim()
  return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/') || v.startsWith('data:image/') || /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(v)
}

async function saveLogoDirectly(customLogoVal = null) {
  const logoValue = (typeof customLogoVal === 'string' ? customLogoVal : profile.value.logo) || 'mdi-star-four-points'
  profile.value.logo = logoValue
  savingLogo.value = true
  try {
    const updated = await adminService.updateProfile({ logo: logoValue })
    if (updated) {
      profile.value.logo = updated.logo || logoValue
      portfolioStore.developer.logo = updated.logo || logoValue
    } else {
      portfolioStore.developer.logo = logoValue
    }
    await portfolioStore.fetchPublicContent()
    await refreshNuxtData('portfolio-public-content')
    adminStore.notify('تم حفظ الأيقونة وتحديث الموقع بنجاح!', 'success')
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ الأيقونة', 'error')
  } finally {
    savingLogo.value = false
  }
}

function selectPresetIcon(iconName) {
  profile.value.logo = iconName
  saveLogoDirectly(iconName)
}

function resetLogoToDefault() {
  profile.value.logo = 'mdi-star-four-points'
  saveLogoDirectly('mdi-star-four-points')
}

const profile = ref({
  full_name: '',
  title: '',
  tagline: '',
  bio: '',
  email: '',
  phone: '',
  whatsapp: '',
  github: '',
  linkedin: '',
  behance: '',
  dribbble: '',
  instagram: '',
  youtube: '',
  website: '',
  twitter: '',
  location: '',
  avatar: '',
  resume: '',
  logo: 'mdi-star-four-points',
  available_for_work: true,
  years_of_experience: 0,
})


async function fetchProfile() {
  try {
    const data = await adminService.getProfile()
    if (data) {
      profile.value = { ...profile.value, ...data }
    }
  } catch (err) {
    adminStore.notify('فشل جلب بيانات الملف الشخصي', 'error')
  }
}

function getCleanProfilePayload() {
  const p = { ...profile.value }
  // Ensure string fields are never null/undefined
  const stringKeys = [
    'full_name', 'title', 'tagline', 'bio', 'email', 'phone', 'whatsapp',
    'github', 'linkedin', 'twitter', 'instagram', 'behance', 'dribbble',
    'youtube', 'website', 'location', 'avatar', 'resume', 'logo'
  ]
  stringKeys.forEach(k => {
    p[k] = p[k] ? String(p[k]).trim() : ''
  })
  return p
}

async function handleAvatarUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    const res = await adminService.uploadMedia(file, `avatar_${file.name}`)
    const uploadedUrl = res?.file_url || res?.file
    if (uploadedUrl) {
      profile.value.avatar = uploadedUrl
      const payload = getCleanProfilePayload()
      payload.avatar = uploadedUrl
      const updated = await adminService.updateProfile(payload)
      if (updated) {
        profile.value = { ...profile.value, ...updated }
      }
      await portfolioStore.fetchPublicContent()
      adminStore.notify('تم رفع وحفظ صورة الملف الشخصي بنجاح وتحديث الموقع!', 'success')
    }
  } catch (err) {
    adminStore.notify(err.message || 'فشل رفع الصورة', 'error')
  } finally {
    uploadingAvatar.value = false
    if (avatarFileInput.value) avatarFileInput.value.value = ''
  }
}

async function handleResumeUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploadingResume.value = true
  try {
    const res = await adminService.uploadMedia(file, `resume_${file.name}`)
    const uploadedUrl = res?.file_url || res?.file
    if (uploadedUrl) {
      profile.value.resume = uploadedUrl
      const payload = getCleanProfilePayload()
      payload.resume = uploadedUrl
      const updated = await adminService.updateProfile(payload)
      if (updated) {
        profile.value = { ...profile.value, ...updated }
      }
      await portfolioStore.fetchPublicContent()
      adminStore.notify('تم رفع وحفظ السيرة الذاتية بنجاح وتحديث الموقع!', 'success')
    }
  } catch (err) {
    adminStore.notify(err.message || 'فشل رفع السيرة الذاتية', 'error')
  } finally {
    uploadingResume.value = false
    if (resumeFileInput.value) resumeFileInput.value.value = ''
  }
}

async function handleLogoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploadingLogo.value = true
  try {
    const res = await adminService.uploadMedia(file, `logo_${file.name}`)
    const uploadedUrl = res?.file_url || res?.file
    if (uploadedUrl) {
      profile.value.logo = uploadedUrl
      const updated = await adminService.updateProfile({ logo: uploadedUrl })
      if (updated) {
        profile.value.logo = updated.logo || uploadedUrl
        portfolioStore.developer.logo = updated.logo || uploadedUrl
      } else {
        portfolioStore.developer.logo = uploadedUrl
      }
      // Immediately update logo in public store for instant navbar update
      await portfolioStore.fetchPublicContent()
      await refreshNuxtData('portfolio-public-content')
      adminStore.notify('تم رفع وحفظ شعار الموقع بنجاح وتحديث الموقع!', 'success')
    }
  } catch (err) {
    adminStore.notify(err.message || 'فشل رفع الشعار', 'error')
  } finally {
    uploadingLogo.value = false
    if (logoFileInput.value) logoFileInput.value.value = ''
  }
}

async function deleteResume() {
  if (!confirm('هل أنت متأكد من رغبتك في حذف ملف السيرة الذاتية؟ لن يظهر زر تحميل السيرة في الموقع للزوار.')) {
    return
  }
  deletingResume.value = true
  try {
    profile.value.resume = ''
    const payload = getCleanProfilePayload()
    payload.resume = ''
    const updated = await adminService.updateProfile(payload)
    if (updated) {
      profile.value = { ...profile.value, ...updated, resume: '' }
    } else {
      profile.value.resume = ''
    }
    await portfolioStore.fetchPublicContent()
    adminStore.notify('تم حذف السيرة الذاتية بنجاح وإخفاء أزرار التحميل من الموقع!', 'success')
  } catch (err) {
    adminStore.notify(err.message || 'فشل حذف السيرة الذاتية', 'error')
  } finally {
    deletingResume.value = false
    if (resumeFileInput.value) resumeFileInput.value.value = ''
  }
}

async function saveProfile() {
  if (form.value) {
    try {
      const res = await form.value.validate()
      if (res && res.valid === false) {
        adminStore.notify('يرجى التحقق من الحقول الإلزامية أولاً (الاسم، المسمى، والعبارة التعريفية)', 'error')
        return
      }
    } catch (valErr) {
      console.warn('Validation error bypassed:', valErr)
    }
  }

  saving.value = true
  try {
    const payload = getCleanProfilePayload()
    payload.logo = profile.value.logo || 'mdi-star-four-points'
    const updated = await adminService.updateProfile(payload)
    if (updated) {
      profile.value = { ...profile.value, ...updated }
      // Immediately sync logo (and other fields) to public store for instant navbar update
      portfolioStore.developer.logo = updated.logo || profile.value.logo || 'mdi-star-four-points'
      portfolioStore.developer.name = updated.full_name || updated.name || profile.value.full_name || ''
      portfolioStore.developer.full_name = updated.full_name || profile.value.full_name || ''
      portfolioStore.developer.title = updated.title || profile.value.title || ''
    }
    adminStore.notify('تم حفظ وتحديث كافة بيانات الملف الشخصي بنجاح!', 'success')
    // Refresh public store from backend + invalidate Nuxt cache
    await portfolioStore.fetchPublicContent()
    await refreshNuxtData('portfolio-public-content')
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ الملف الشخصي', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.admin-page { max-width: 1300px; margin: 0 auto; }

.admin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px;
}
.card-section-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.02rem; font-weight: 800; color: var(--t1);
  padding-bottom: 10px; border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
}

.field-label { font-size: 0.78rem; font-weight: 700; color: var(--t2); margin-bottom: 6px; display: block; }

.avatar-preview-box {
  width: 120px; height: 120px;
  border-radius: 50%;
  border: 3px solid rgba(123,110,246,0.35);
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
.profile-preview-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-upload-overlay {
  position: absolute; inset: 0;
  background: rgba(6,6,16,0.75);
  display: flex; align-items: center; justify-content: center;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  border-radius: 9px;
  font-size: 0.84rem;
  font-weight: 700;
  font-family: var(--f-body, 'Cairo', sans-serif);
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
  border: 1px solid rgba(59, 130, 246, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-upload:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.18);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.btn-preview-resume {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 38px;
  border-radius: 9px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--t2);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: all 0.2s ease;
}
.btn-preview-resume:hover {
  background: var(--bg-3);
  color: var(--t1);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.resume-drop-box {
  background: var(--bg-subtle);
  border: 1px dashed var(--border);
  border-radius: 14px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.resume-drop-box:hover {
  background: rgba(59, 130, 246, 0.06);
  border-color: var(--primary);
  transform: translateY(-1px);
}

/* Site Brand Logo Card Styles */
.logo-live-preview-box {
  background: var(--bg-subtle, rgba(255,255,255,0.03));
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  border-radius: 12px;
  padding: 12px 14px;
}
.preview-badge-header {
  margin-bottom: 8px;
}
.preview-badge-label {
  font-size: 0.75rem;
  color: var(--t3, rgba(255,255,255,0.45));
  font-weight: 600;
}
.preview-brand-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card, #111827);
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid var(--border, rgba(255,255,255,0.1));
}
.preview-logo-mark {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.preview-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}
.preview-logo-text {
  display: flex;
  flex-direction: column;
}
.preview-logo-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--t1, #ffffff);
  line-height: 1.2;
}
.preview-logo-role {
  font-size: 0.72rem;
  color: var(--t3, rgba(255,255,255,0.5));
  line-height: 1.2;
  margin-top: 2px;
}
.preset-icons-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}
.preset-icon-btn {
  height: 40px;
  border-radius: 8px;
  background: var(--bg-subtle, rgba(255,255,255,0.03));
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  color: var(--t2, rgba(255,255,255,0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.preset-icon-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary, #3B82F6);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}
.preset-icon-btn.active {
  background: rgba(59, 130, 246, 0.18);
  color: var(--primary, #3B82F6);
  border-color: var(--primary, #3B82F6);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.25);
}
.btn-upload-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.08);
  color: var(--primary, #3B82F6);
  border: 1px solid rgba(59, 130, 246, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-upload-logo:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.16);
  border-color: var(--primary, #3B82F6);
}
.badge-custom-img {
  font-size: 0.7rem;
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}
.btn-save-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: #ffffff;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  transition: all 0.2s ease;
}
.btn-save-logo:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
}
.btn-save-logo:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.bottom-save-bar {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px 24px;
}
</style>
