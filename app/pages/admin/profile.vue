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
              <button type="button" @click="previewCurrentResume" class="btn-preview-resume flex-1">
                <v-icon icon="mdi-open-in-new" size="15" />
                معاينة الملف الحالي
              </button>
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

      <section class="admin-card background-settings-card" aria-labelledby="background-settings-title">
        <div class="background-settings-heading">
          <div>
            <h2 id="background-settings-title" class="card-section-title mb-1">الخلفية المتحركة للموقع</h2>
            <p class="text-caption text-secondary mb-0">اختر الحركة التي تظهر خلف واجهة الصفحة الرئيسية. يمكنك معاينتها قبل حفظها.</p>
          </div>
          <button class="btn btn-primary background-save-button" type="button" :disabled="savingBackground || !backgroundDirty" @click="saveBackground">
            <v-progress-circular v-if="savingBackground" indeterminate size="17" width="2" />
            <v-icon v-else :icon="backgroundDirty ? 'mdi-content-save-outline' : 'mdi-check-circle-outline'" size="18" />
            <span>{{ savingBackground ? 'جارٍ الحفظ...' : (backgroundDirty ? 'حفظ الخلفية' : 'تم الحفظ') }}</span>
          </button>
        </div>

        <div class="background-options" role="group" aria-label="اختيار الخلفية المتحركة">
          <button
            v-for="option in backgroundOptions"
            :key="option.id"
            class="background-option"
            :class="{ selected: selectedBackground === option.id }"
            type="button"
            :aria-pressed="selectedBackground === option.id"
            @click="selectedBackground = option.id"
          >
            <span class="background-preview" :class="`preview-${option.id}`" aria-hidden="true">
              <span class="preview-orb preview-orb-one" />
              <span class="preview-orb preview-orb-two" />
              <span class="preview-line" />
              <span class="preview-dots" />
            </span>
            <span class="background-option-copy">
              <span class="background-option-title">{{ option.title }}</span>
              <span class="background-option-description">{{ option.description }}</span>
            </span>
            <v-icon class="background-selected-icon" :icon="selectedBackground === option.id ? 'mdi-check-circle' : 'mdi-circle-outline'" size="19" />
          </button>
        </div>
      </section>

      <!-- Hero Avatar Frame Style Selector -->
      <section class="admin-card mb-6 hero-model-settings-card" aria-labelledby="hero-model-settings-title">
        <div class="hero-model-settings-heading">
          <div>
            <div class="d-flex align-center gap-2 mb-1 flex-wrap">
              <v-icon icon="mdi-card-account-details-outline" color="primary" size="22" />
              <h2 id="hero-model-settings-title" class="card-section-title mb-0">نماذج وتصاميم إطار الصورة في واجهة الموقع</h2>
              <span class="badge-models-count">6 نماذج عالمية فاخرة</span>
            </div>
            <p class="text-caption text-secondary mb-0">اختر النمط الجمالي الفاخر والمؤثرات البصرية التي تناسبك لعرض صورتك الشخصية في قسم الهيرو بالصفحة الرئيسية.</p>
          </div>
          <button class="btn btn-primary hero-model-save-button" type="button" :disabled="savingHeroModel" @click="saveHeroModel">
            <v-progress-circular v-if="savingHeroModel" indeterminate size="17" width="2" />
            <v-icon v-else :icon="heroModelDirty ? 'mdi-content-save-outline' : 'mdi-check-circle-outline'" size="18" />
            <span>{{ savingHeroModel ? 'جارٍ الحفظ والتطبيق...' : (heroModelDirty ? 'تطبيق وحفظ النموذج' : 'النموذج مفعل حالياً') }}</span>
          </button>
        </div>

        <div class="hero-models-layout mt-4">
          <!-- Models Grid (6 Cards) -->
          <div class="hero-models-grid">
            <button
              v-for="model in heroModelOptions"
              :key="model.id"
              class="hero-model-card"
              :class="{ selected: selectedHeroModel === model.id }"
              type="button"
              @click="selectHeroModel(model.id)"
            >
              <div class="model-card-head">
                <div class="model-icon-box" :style="{ background: model.color + '18', color: model.color, borderColor: model.color + '40' }">
                  <v-icon :icon="model.icon" size="20" />
                </div>
                <span class="model-tag-pill" :style="{ color: model.color, borderColor: model.color + '30', background: model.color + '10' }">
                  {{ model.tag }}
                </span>
                <v-icon
                  class="model-selected-check"
                  :icon="selectedHeroModel === model.id ? 'mdi-check-circle' : 'mdi-circle-outline'"
                  size="20"
                  :color="selectedHeroModel === model.id ? 'var(--primary)' : 'rgba(255,255,255,0.2)'"
                />
              </div>

              <div class="model-card-body">
                <div class="model-title">{{ model.title }}</div>
                <div class="model-desc">{{ model.desc }}</div>
              </div>
            </button>
          </div>

          <!-- Real-Time Live Preview & Options Column -->
          <div class="hero-model-preview-sidebar">
            <div class="preview-sidebar-header">
              <span class="text-caption font-weight-bold" style="color: var(--t1)">معاينة حية ومباشرة لصورتك:</span>
              <span class="badge-live-pulse">
                <span class="pulse-dot" />
                <span>مباشر</span>
              </span>
            </div>

            <div class="preview-frame-wrapper my-3">
              <HeroAvatarFrame
                :dev="profile"
                :model="selectedHeroModel"
                :showGlow="enableHeroGlow"
                :showBadges="enableHeroBadges"
                :previewMode="true"
              />
            </div>

            <!-- Toggles for Glow and Badges -->
            <div class="preview-toggles-box">
              <div class="d-flex align-center justify-space-between py-1">
                <span class="text-caption font-weight-medium" style="color: var(--t1)">تفعيل الهالة الضوئية (Ambient Glow)</span>
                <v-switch v-model="enableHeroGlow" color="primary" hide-details density="compact" />
              </div>
              <div class="d-flex align-center justify-space-between py-1 border-t">
                <span class="text-caption font-weight-medium" style="color: var(--t1)">إظهار الشارات التفاعلية (Floating Badges)</span>
                <v-switch v-model="enableHeroBadges" color="primary" hide-details density="compact" />
              </div>
            </div>

            <button
              class="btn btn-primary w-100 mt-3 btn-apply-model"
              type="button"
              :disabled="savingHeroModel"
              @click="saveHeroModel"
            >
              <v-progress-circular v-if="savingHeroModel" indeterminate size="16" width="2" />
              <v-icon v-else icon="mdi-rocket-launch-outline" size="16" />
              <span>تطبيق هذا النموذج على الموقع الآن</span>
            </button>
          </div>
        </div>
      </section>

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

import { ref, computed, onMounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'
import HeroAvatarFrame from '~/components/public/HeroAvatarFrame.vue'


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
const selectedBackground = ref('constellation')
const savedBackground = ref('constellation')
const savingBackground = ref(false)

const backgroundOptions = [
  { id: 'constellation', title: 'شبكة الجسيمات', description: 'جسيمات مترابطة تستجيب لحركة المؤشر.' },
  { id: 'aurora', title: 'ستائر الشفق', description: 'ستائر ضوئية تنساب بحركة هادئة.' },
  { id: 'orbit', title: 'المدارات الكوكبية', description: 'أجرام مضيئة تدور حول مركز متوهج.' },
  { id: 'horizon', title: 'تموجات الأفق', description: 'خطوط شبكية تتموج فوق أفق مضيء.' }
]

const backgroundDirty = computed(() => selectedBackground.value !== savedBackground.value)

async function fetchBackgroundSetting() {
  try {
    const data = await adminService.getSettings()
    const items = Array.isArray(data) ? data : (data?.results || [])
    const setting = items.find(item => item.key === 'hero_background')
    const value = setting?.value
    const choice = backgroundOptions.some(option => option.id === value) ? value : 'constellation'
    selectedBackground.value = choice
    savedBackground.value = choice
  } catch {
    adminStore.notify('تعذر تحميل إعداد الخلفية المتحركة', 'error')
  }
}


const heroModelOptions = [
  { id: 'royal-glass', title: 'الزجاج البلوري الملكي (Royal Crystal Glass)', tag: 'فخامة ملكية • Apple Glass', icon: 'mdi-shield-star', color: '#38BDF8', desc: 'زجاج أكريليكي مثلج فائق النقاء مستوحى من لغة Apple مع لمعان علوي وشارات متناسقة.' },
  { id: 'cinematic-aura', title: 'الهالة السينمائية الفاخرة (Cinematic Aura)', tag: 'توهج سينمائي • Ambient Glow', icon: 'mdi-shimmer', color: '#10B981', desc: 'إطار أوبسيديان فاحم مع هالة ضوئية زمردية وسماوية ناعمة تنبض في الخلفية بنقاء تام.' },
  { id: 'cyber-pulse', title: 'إطار النيون السيبراني النقي (Cyber Pulse HUD)', tag: 'تقني دقيق • Cyber Edge', icon: 'mdi-radar', color: '#06B6D4', desc: 'تصميم تكنولوجي مستقبلي مع محيط نيون هادئ وعلامات زوايا هندسية تقنية دقيقة على أطراف الإطار.' },
  { id: 'golden-luxury', title: 'الإطار الهندسي الذهبي (Architectural Imperial Gold)', tag: 'طراز معماري • Imperial Gold', icon: 'mdi-crown', color: '#F59E0B', desc: 'انحناء هندسي راقٍ محاط بإطار ذهبي معدني وهالة دافئة تعكس الفخامة والاحترافية العالية.' },
  { id: '3d-perspective', title: 'المجسم ثلاثي الأبعاد التفاعلي (3D Holographic Perspective)', tag: 'حركة تفاعلية • 3D Tilt', icon: 'mdi-cube-scan', color: '#A855F7', desc: 'تفاعل حي ومباشر مع حركة مؤشر الفأرة بزاوية عمق ثلاثية الأبعاد ولمسة طيفية ناعمة.' },
  { id: 'minimal-monolith', title: 'استوديو المونوكروم الفاخر (Swiss Minimalist Monolith)', tag: 'بساطة سويسرية • Swiss Studio', icon: 'mdi-palette-swatch-outline', color: '#E2E8F0', desc: 'بساطة تحريرية مونوكرومية هادئة ونقية تعكس أرقى معايير الاستوديوهات العالمية الفاخرة.' }
]

const selectedHeroModel = ref('royal-glass')
const savedHeroModel = ref('royal-glass')
const enableHeroGlow = ref(true)
const enableHeroBadges = ref(true)
const savingHeroModel = ref(false)

const heroModelDirty = computed(() => {
  return selectedHeroModel.value !== savedHeroModel.value
})

function selectHeroModel(id) {
  selectedHeroModel.value = id
}

async function fetchHeroModelSetting() {
  try {
    const data = await adminService.getSettings()
    const items = Array.isArray(data) ? data : (data?.results || [])
    const modelSetting = items.find(item => item.key === 'hero_avatar_style')
    if (modelSetting?.value && heroModelOptions.some(m => m.id === modelSetting.value)) {
      selectedHeroModel.value = modelSetting.value
      savedHeroModel.value = modelSetting.value
    } else if (portfolioStore.settings?.hero_avatar_style) {
      selectedHeroModel.value = portfolioStore.settings.hero_avatar_style
      savedHeroModel.value = portfolioStore.settings.hero_avatar_style
    }
    const glowSetting = items.find(item => item.key === 'hero_avatar_glow')
    if (glowSetting !== undefined) {
      enableHeroGlow.value = glowSetting.value === 'true' || glowSetting.value === true
    }
    const badgesSetting = items.find(item => item.key === 'hero_avatar_badges')
    if (badgesSetting !== undefined) {
      enableHeroBadges.value = badgesSetting.value === 'true' || badgesSetting.value === true
    }
  } catch {
    if (portfolioStore.settings?.hero_avatar_style) {
      selectedHeroModel.value = portfolioStore.settings.hero_avatar_style
      savedHeroModel.value = portfolioStore.settings.hero_avatar_style
    }
  }
}

async function saveHeroModel() {
  savingHeroModel.value = true
  try {
    await adminService.updateSettingsBulk({
      hero_avatar_style: selectedHeroModel.value,
      hero_avatar_glow: enableHeroGlow.value ? 'true' : 'false',
      hero_avatar_badges: enableHeroBadges.value ? 'true' : 'false'
    })
    savedHeroModel.value = selectedHeroModel.value
    if (portfolioStore.settings) {
      portfolioStore.settings.hero_avatar_style = selectedHeroModel.value
      portfolioStore.settings.hero_avatar_glow = enableHeroGlow.value
      portfolioStore.settings.hero_avatar_badges = enableHeroBadges.value
    }
    await portfolioStore.fetchPublicContent()
    await refreshNuxtData('portfolio-public-content')
    adminStore.notify('تم حفظ وتطبيق نموذج إطار الصورة على الواجهة الرئيسية بنجاح!', 'success')
  } catch (err) {
    adminStore.notify(err.message || 'تعذر حفظ نموذج إطار الصورة', 'error')
  } finally {
    savingHeroModel.value = false
  }
}

async function saveBackground() {
  if (!backgroundDirty.value || savingBackground.value) return
  savingBackground.value = true
  try {
    await adminService.updateSettingsBulk({ hero_background: selectedBackground.value })
    await portfolioStore.fetchPublicContent()
    savedBackground.value = selectedBackground.value
    adminStore.notify('تم حفظ الخلفية المتحركة وتطبيقها على الموقع', 'success')
  } catch (err) {
    adminStore.notify(err.message || 'تعذر حفظ الخلفية المتحركة', 'error')
  } finally {
    savingBackground.value = false
  }
}

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
      if (data.avatar && (data.avatar.includes('11.png') || data.avatar.includes('127.0.0.1:8000'))) {
        data.avatar = ''
      }
      if (data.resume && data.resume.includes('Abdulkhaliq_Alsaidi_CV.pdf')) {
        data.resume = ''
      }
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

function compressImageToBase64(file, maxWidth = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxWidth) / height)
            height = maxWidth
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        let dataUrl = ''
        try {
          dataUrl = canvas.toDataURL('image/webp', quality)
        } catch (err) {}

        if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        resolve(dataUrl)
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function previewCurrentResume() {
  const url = profile.value.resume
  if (!url) return
  if (url.startsWith('data:')) {
    try {
      const parts = url.split(',')
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf'
      const binaryStr = atob(parts[1])
      const len = binaryStr.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: mime })
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank')
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
      return
    } catch (err) {
      console.error('Error previewing base64 resume:', err)
    }
  }
  window.open(url, '_blank')
}

async function handleAvatarUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    const base64Url = await compressImageToBase64(file, 800, 0.85)
    if (base64Url) {
      profile.value.avatar = base64Url
      const payload = getCleanProfilePayload()
      payload.avatar = base64Url
      const updated = await adminService.updateProfile(payload)
      if (updated) {
        profile.value = { ...profile.value, ...updated }
      }
      portfolioStore.developer.avatar = base64Url
      await portfolioStore.fetchPublicContent(true)
      await refreshNuxtData('portfolio-public-content')
      adminStore.notify('تم تحويل وتخزين صورة الملف الشخصي كبيانات دائمة في قاعدة البيانات وتحديث الموقع بنجاح!', 'success')
    }
  } catch (err) {
    adminStore.notify(err.message || 'فشل معالجة ورفع الصورة', 'error')
  } finally {
    uploadingAvatar.value = false
    if (avatarFileInput.value) avatarFileInput.value.value = ''
  }
}

async function handleResumeUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    adminStore.notify(`حجم ملف السيرة الذاتية (${(file.size / (1024 * 1024)).toFixed(1)} ميغابايت) كبير جداً. الحد الأقصى المسموح به هو 5 ميغابايت لضمان سرعة التحميل.`, 'error')
    if (resumeFileInput.value) resumeFileInput.value.value = ''
    return
  }

  uploadingResume.value = true
  try {
    const base64Url = await readFileAsBase64(file)
    if (base64Url) {
      profile.value.resume = base64Url
      const payload = getCleanProfilePayload()
      payload.resume = base64Url
      const updated = await adminService.updateProfile(payload)
      if (updated) {
        profile.value = { ...profile.value, ...updated }
      }
      portfolioStore.developer.resume = base64Url
      await portfolioStore.fetchPublicContent(true)
      await refreshNuxtData('portfolio-public-content')
      adminStore.notify('تم تحويل وحفظ السيرة الذاتية كبيانات دائمة في قاعدة البيانات وتحديث الموقع بنجاح!', 'success')
    }
  } catch (err) {
    adminStore.notify(err.message || 'فشل معالجة ورفع السيرة الذاتية', 'error')
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
    const base64Url = await compressImageToBase64(file, 300, 0.85)
    if (base64Url) {
      profile.value.logo = base64Url
      const updated = await adminService.updateProfile({ logo: base64Url })
      if (updated) {
        profile.value.logo = updated.logo || base64Url
        portfolioStore.developer.logo = updated.logo || base64Url
      } else {
        portfolioStore.developer.logo = base64Url
      }
      await portfolioStore.fetchPublicContent(true)
      await refreshNuxtData('portfolio-public-content')
      adminStore.notify('تم حفظ وتحديث شعار الموقع بنجاح!', 'success')
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
  fetchBackgroundSetting()
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
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
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

.background-settings-card { margin-top: 24px; }
.background-settings-heading { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 20px; }
.background-settings-heading .card-section-title { border: 0; padding: 0; margin-bottom: 4px; }
.background-options { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.background-option {
  position: relative; display: flex; flex-direction: column; padding: 8px; gap: 11px; min-width: 0; text-align: right;
  color: var(--t1); background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 13px;
  cursor: pointer; transition: border-color .18s ease, background-color .18s ease, transform .18s ease;
}
.background-option:hover { border-color: color-mix(in srgb, var(--primary) 55%, var(--border)); transform: translateY(-2px); }
.background-option:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.background-option.selected { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 8%, var(--bg-card)); }
.background-preview { position: relative; display: block; width: 100%; height: 86px; overflow: hidden; border-radius: 8px; background: #10251f; isolation: isolate; }
.background-preview::before, .background-preview::after { content: ''; position: absolute; inset: -55%; z-index: -1; }
.background-preview::before { background: radial-gradient(ellipse at 28% 40%, rgba(89, 173, 152, .78), transparent 38%), radial-gradient(ellipse at 76% 60%, rgba(127, 139, 210, .62), transparent 36%); filter: blur(10px); animation: preview-drift 7s ease-in-out infinite alternate; }
.background-preview::after { background: linear-gradient(130deg, transparent 40%, rgba(231, 208, 139, .22), transparent 62%); animation: preview-glide 5s linear infinite; }
.preview-orb { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #e9dcac; box-shadow: 0 0 12px 3px rgba(194, 213, 202, .55); animation: preview-float 3s ease-in-out infinite alternate; }
.preview-orb-one { top: 30%; left: 26%; }.preview-orb-two { top: 64%; left: 72%; animation-delay: -1.4s; }
.preview-line { position: absolute; inset: 18% 24%; border: 1px solid rgba(209, 223, 217, .26); border-radius: 50%; transform: rotate(-24deg); }
.preview-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(215, 231, 222, .68) 1px, transparent 1.5px); background-size: 23px 21px; opacity: .38; }
.preview-aurora::before { background: linear-gradient(125deg, transparent 18%, rgba(69, 186, 149, .74) 36%, rgba(115, 145, 216, .68) 55%, rgba(199, 183, 117, .45) 68%, transparent 82%); filter: blur(13px); }
.preview-aurora .preview-line, .preview-aurora .preview-dots { display: none; }
.preview-orbit::before { background: radial-gradient(ellipse at center, rgba(25, 116, 101, .58), transparent 65%); }
.preview-orbit .preview-line { inset: 14% 20%; border-radius: 50%; transform: rotate(-32deg); box-shadow: 0 0 0 10px rgba(190, 209, 195, .08), 0 0 0 21px rgba(190, 209, 195, .06); animation: preview-rotate 12s linear infinite; }
.preview-orbit .preview-dots { opacity: .12; }
.preview-horizon::before { inset: 48% -20% -60%; background: linear-gradient(0deg, rgba(89, 173, 152, .5), transparent 72%); filter: blur(8px); }
.preview-horizon .preview-line { inset: 44% -10% auto; height: 70%; border: 0; border-top: 1px solid rgba(190, 218, 206, .45); border-radius: 50%; transform: rotate(-7deg); box-shadow: 0 -9px 0 -1px rgba(190, 218, 206, .18), 0 -19px 0 -1px rgba(190, 218, 206, .13); animation: preview-wave 4s ease-in-out infinite alternate; }
.preview-horizon .preview-dots { display: none; }
.background-option-copy { display: flex; flex-direction: column; gap: 3px; padding: 0 3px 4px; }
.background-option-title { font-size: .82rem; font-weight: 800; }
.background-option-description { min-height: 2.6em; color: var(--t2); font-size: .7rem; line-height: 1.45; }
.background-selected-icon { position: absolute; top: 15px; inset-inline-end: 15px; color: var(--primary); filter: drop-shadow(0 1px 3px rgba(0,0,0,.5)); }
@keyframes preview-drift { to { transform: translate(10%, -8%) rotate(10deg); } }
@keyframes preview-glide { to { transform: translateX(34%) rotate(12deg); } }
@keyframes preview-float { to { transform: translate(9px, -7px); opacity: .62; } }
@keyframes preview-rotate { to { transform: rotate(328deg); } }
@keyframes preview-wave { to { transform: translateY(7px) rotate(5deg); } }

@media (prefers-reduced-motion: reduce) {
  .background-preview *, .background-preview::before, .background-preview::after { animation: none !important; }
}

@media (max-width: 768px) {
  .background-settings-heading { align-items: flex-start; flex-direction: column; }
  .background-save-button { width: 100%; justify-content: center; }
  .background-options { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .preview-brand-item {
    width: 100%;
  }
  .bottom-save-bar {
    padding: 12px 16px;
  }
  .bottom-save-bar .btn,
  .bottom-save-bar button {
    width: 100%;
    justify-content: center;
  }
}

/* ══════════════════════════════════════════════════════════════
   HERO AVATAR MODEL SELECTOR STYLES
   ══════════════════════════════════════════════════════════════ */
.badge-models-count {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
  background: var(--primary-subtle, rgba(56, 189, 248, 0.12));
  border: 1px solid var(--primary-border, rgba(56, 189, 248, 0.3));
  color: var(--primary, #38BDF8);
}

.hero-model-settings-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.hero-models-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.hero-models-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.hero-model-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
  background: var(--bg-subtle, rgba(255, 255, 255, 0.03));
  border: 1.5px solid var(--border);
  cursor: pointer;
  text-align: right;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
}

.hero-model-card:hover {
  border-color: var(--primary-border, rgba(56, 189, 248, 0.4));
  transform: translateY(-2px);
  background: var(--primary-subtle, rgba(56, 189, 248, 0.05));
}

.hero-model-card.selected {
  border-color: var(--primary, #38BDF8);
  background: color-mix(in srgb, var(--primary) 10%, var(--bg-card));
  box-shadow: 0 0 0 1px var(--primary), 0 8px 24px -6px color-mix(in srgb, var(--primary) 25%, transparent);
}

.model-card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  width: 100%;
}

.model-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.model-tag-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  white-space: nowrap;
}

.model-selected-check {
  margin-inline-start: auto;
}

.model-card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-title {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--t1);
}

.model-desc {
  font-size: 0.74rem;
  color: var(--t2);
  line-height: 1.45;
}

/* Preview Sidebar */
.hero-model-preview-sidebar {
  background: var(--bg-subtle, rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 18px;
}

.preview-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-live-pulse {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
  font-size: 0.68rem;
  font-weight: 700;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
  animation: radar-ping 1.8s infinite;
}

.preview-frame-wrapper {
  background: #060911;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  min-height: 270px;
}

.preview-toggles-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
}

@media (max-width: 960px) {
  .hero-models-layout {
    grid-template-columns: 1fr;
  }
  .hero-models-grid {
    grid-template-columns: 1fr;
  }
}

</style>
