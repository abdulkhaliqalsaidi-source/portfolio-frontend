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
            <h3 class="card-section-title">السيرة الذاتية (CV / Resume)</h3>
            <p class="text-caption mb-3 text-secondary">
              ملف الـ PDF الذي سيتم تحميله عند ضغط الزوار على زر "السيرة الذاتية".
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
                @click="$refs.resumeFileInput.click()"
              >
                <v-progress-circular v-if="uploadingResume" indeterminate color="primary" size="28" class="mb-2" />
                <v-icon v-else icon="mdi-file-pdf-box" size="36" color="#EF4444" class="mb-1" />
                <div class="text-caption font-weight-bold">
                  {{ uploadingResume ? 'جاري رفع وحفظ الملف...' : 'اضغط لاختيار ملف PDF من جهازك' }}
                </div>
                <div class="text-caption text-secondary">حتى 10 ميغابايت</div>
              </div>
            </div>

            <label class="field-label">مسار أو رابط ملف السيرة الذاتية</label>
            <v-text-field
              v-model="profile.resume"
              placeholder="/resume.pdf"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-link"
              hide-details
              class="mb-3"
            />

            <a :href="profile.resume || '/resume.pdf'" target="_blank" class="btn-preview-resume">
              <v-icon icon="mdi-open-in-new" size="15" />
              معاينة الملف الحالي
            </a>
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

const form = ref(null)
const saving = ref(false)
const uploadingAvatar = ref(false)
const uploadingResume = ref(false)
const avatarFileInput = ref(null)
const resumeFileInput = ref(null)

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

async function handleAvatarUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    const res = await adminService.uploadMedia(file, `avatar_${file.name}`)
    const uploadedUrl = res?.file_url || res?.file
    if (uploadedUrl) {
      profile.value.avatar = uploadedUrl
      // Instantly save to Django database so it persists permanently on refresh!
      const updated = await adminService.updateProfile(profile.value)
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
      // Instantly save to Django database so it persists permanently on refresh!
      const updated = await adminService.updateProfile(profile.value)
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

async function saveProfile() {
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const updated = await adminService.updateProfile(profile.value)
    profile.value = { ...profile.value, ...updated }
    adminStore.notify('تم حفظ وتحديث كافة بيانات الملف الشخصي بنجاح!', 'success')
    // Refresh public store
    await portfolioStore.fetchPublicContent()
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
</style>
