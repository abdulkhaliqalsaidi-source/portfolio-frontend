<template>
  <div class="admin-layout" dir="rtl">
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="mobileMenuOpen"
      class="sidebar-backdrop"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ open: mobileMenuOpen }">
      <div class="sidebar-header">
        <router-link to="/admin" class="sidebar-logo">
          <div class="logo-badge">
            <v-icon icon="mdi-shield-crown" color="#3B82F6" size="20" />
          </div>
          <div class="logo-text">
            <span class="logo-title">لوحة التحكم</span>
            <span class="logo-subtitle">إدارة البورتفوليو</span>
          </div>
        </router-link>
        <button class="close-sidebar" @click="mobileMenuOpen = false" title="إغلاق القائمة">
          <v-icon icon="mdi-close" size="20" />
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <div class="nav-group-title">الرئيسية والإحصاءات</div>
        <router-link to="/admin/dashboard" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-view-dashboard-outline" class="link-icon" />
          <span>لوحة المعلومات</span>
        </router-link>

        <div class="nav-group-title mt-4">إدارة المحتوى</div>
        <router-link to="/admin/profile" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-account-edit-outline" class="link-icon" />
          <span>الملف الشخصي</span>
        </router-link>

        <router-link to="/admin/projects" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-folder-multiple-outline" class="link-icon" />
          <span>المشاريع</span>
          <span class="badge" v-if="adminStore.metrics.total_projects">{{ adminStore.metrics.total_projects }}</span>
        </router-link>

        <router-link to="/admin/blog" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-newspaper-variant-multiple-outline" class="link-icon" />
          <span>المدونة والمقالات</span>
          <span class="badge" v-if="adminStore.metrics.total_posts">{{ adminStore.metrics.total_posts }}</span>
        </router-link>

        <router-link to="/admin/services" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-monitor-dashboard" class="link-icon" />
          <span>الخدمات</span>
        </router-link>

        <router-link to="/admin/skills" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-code-tags-check" class="link-icon" />
          <span>المهارات والتصنيفات</span>
        </router-link>

        <router-link to="/admin/timeline" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-timeline-clock-outline" class="link-icon" />
          <span>الخط الزمني والخبرة</span>
        </router-link>

        <router-link to="/admin/testimonials" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-comment-quote-outline" class="link-icon" />
          <span>آراء العملاء</span>
        </router-link>

        <router-link to="/admin/statistics" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-chart-bell-curve" class="link-icon" />
          <span>الأرقام والإحصائيات</span>
        </router-link>

        <div class="nav-group-title mt-4">التواصل والملفات</div>
        <router-link to="/admin/messages" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-email-outline" class="link-icon" />
          <span>رسائل التواصل</span>
          <span class="badge-unread" v-if="adminStore.metrics.unread_messages">
            {{ adminStore.metrics.unread_messages }}
          </span>
        </router-link>

        <router-link to="/admin/media" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-image-multiple-outline" class="link-icon" />
          <span>مكتبة الوسائط</span>
        </router-link>

        <div class="nav-group-title mt-4">النظام والأمان</div>

                <router-link to="/admin/seo" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-google" class="link-icon" />
          <span>مدير الـ SEO</span>
        </router-link>

        <router-link to="/admin/settings" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-cog-outline" class="link-icon" />
          <span>إعدادات الموقع</span>
        </router-link>

        <router-link to="/admin/data-templates" class="sidebar-link" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-database-import-outline" class="link-icon" />
          <span>قوالب البيانات (Import/Export)</span>
        </router-link>

        <router-link to="/admin/users" class="sidebar-link" v-if="authStore.isSuperUser" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-account-group-outline" class="link-icon" />
          <span>المستخدمون والصلاحيات</span>
        </router-link>

        <router-link to="/admin/audit-logs" class="sidebar-link" v-if="authStore.isSuperUser" @click="mobileMenuOpen = false">
          <v-icon icon="mdi-history" class="link-icon" />
          <span>سجل الرقابة والأمان</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="user-brief">
          <div class="user-avatar">
            <v-icon icon="mdi-account" color="#7B6EF6" size="18" />
          </div>
          <div class="user-meta">
            <span class="user-name">{{ authStore.displayName }}</span>
            <span class="user-role">{{ authStore.isSuperUser ? 'مدير عام (Super Admin)' : 'محرر (Editor)' }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="admin-main-wrap">
      <!-- Admin Topbar -->
      <header class="admin-topbar" dir="rtl">
        <!-- Start / Right in RTL -->
        <div class="topbar-start">
          <button class="menu-toggle d-md-none" @click="mobileMenuOpen = true" title="فتح القائمة">
            <v-icon icon="mdi-menu" size="20" />
          </button>
          
          <!-- Breadcrumb Trail -->
          <div class="breadcrumb-trail">
            <router-link to="/admin/dashboard" class="breadcrumb-item home-link">
              <v-icon icon="mdi-shield-crown-outline" size="17" color="primary" />
              <span class="d-none d-sm-inline">لوحة التحكم</span>
            </router-link>
            <v-icon icon="mdi-chevron-left" size="14" class="breadcrumb-sep" />
            <span class="breadcrumb-item current">{{ pageTitle }}</span>
          </div>

          <a href="/" target="_blank" class="preview-btn d-none d-lg-inline-flex" title="فتح الموقع في علامة تبويب جديدة">
            <v-icon icon="mdi-open-in-new" size="14" class="ml-1" />
            <span>عرض الموقع العام</span>
          </a>
        </div>

        <!-- End / Left in RTL -->
        <div class="topbar-end">
          <!-- Theme Toggle Switcher -->
          <button
            class="topbar-icon-btn theme-toggle-btn"
            @click="toggleTheme"
            :title="isDark ? 'التحويل إلى الوضع النهاري' : 'التحويل إلى الوضع الليلي'"
          >
            <v-icon :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" size="18" :color="isDark ? '#F59E0B' : '#3B82F6'" />
          </button>

          <!-- Quick Messages Icon -->
          <router-link to="/admin/messages" class="topbar-icon-btn" title="الرسائل الواردة">
            <v-icon icon="mdi-email-outline" size="18" />
            <span class="dot-unread pulse-dot" v-if="adminStore.metrics.unread_messages"></span>
          </router-link>

          <!-- Password Dialog Button -->
          <button class="topbar-icon-btn" @click="changePasswordDialog = true" title="تغيير كلمة المرور">
            <v-icon icon="mdi-lock-reset" size="18" />
          </button>

          <!-- User Quick Menu -->
          <div class="user-pill d-none d-sm-flex">
            <div class="user-pill-avatar">
              <v-icon icon="mdi-account" size="16" />
            </div>
            <span class="user-pill-name">{{ authStore.displayName }}</span>
          </div>

          <button class="logout-btn" @click="handleLogout" title="تسجيل الخروج">
            <v-icon icon="mdi-logout" size="15" class="ml-1" />
            <span class="d-none d-sm-inline">خروج</span>
          </button>
        </div>
      </header>

      <!-- Body router view -->
      <main class="admin-content-body">
        <slot />
      </main>
    </div>

    <!-- Password Change Modal -->
    <v-dialog v-model="changePasswordDialog" max-width="460">
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-lock-reset" color="primary" size="22" />
            <span class="font-weight-bold">تغيير كلمة المرور</span>
          </div>
          <button class="close-btn" @click="changePasswordDialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form ref="passForm" @submit.prevent="submitPasswordChange">
            <label class="field-label mb-1">كلمة المرور الحالية</label>
            <v-text-field
              v-model="oldPass"
              placeholder="أدخل كلمة المرور الحالية"
              type="password"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'مطلوب']"
              class="mb-3"
              hide-details="auto"
            />
            <label class="field-label mb-1">كلمة المرور الجديدة (6 أحرف على الأقل)</label>
            <v-text-field
              v-model="newPass"
              placeholder="أدخل كلمة المرور الجديدة"
              type="password"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'مطلوب', v => (v && v.length >= 6) || 'يجب أن لا تقل عن 6 أحرف']"
              class="mb-3"
              hide-details="auto"
            />
            <label class="field-label mb-1">تأكيد كلمة المرور الجديدة</label>
            <v-text-field
              v-model="confirmPass"
              placeholder="أعد إدخال كلمة المرور"
              type="password"
              variant="outlined"
              density="comfortable"
              :rules="[v => v === newPass || 'كلمات المرور غير متطابقة']"
              hide-details="auto"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="changePasswordDialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="passLoading" @click="submitPasswordChange" class="px-5">
            حفظ التغييرات
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <!-- Global Admin Notifications Snackbar -->
    <v-snackbar
      v-model="adminStore.snackbar.show"
      :color="adminStore.snackbar.color"
      :timeout="adminStore.snackbar.timeout"
      location="top right"
      rounded="lg"
      elevation="8"
    >
      <div class="d-flex align-center">
        <v-icon
          :icon="adminStore.snackbar.color === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'"
          class="ml-2"
        />
        <span>{{ adminStore.snackbar.text }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore } from '~/stores/admin'
import { useTheme } from '~/composables/useTheme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const adminStore = useAdminStore()
const { isDark, toggle: toggleTheme } = useTheme()

const mobileMenuOpen = ref(false)
const changePasswordDialog = ref(false)
const oldPass = ref('')
const newPass = ref('')
const confirmPass = ref('')
const passLoading = ref(false)
const passForm = ref(null)

const pageTitlesMap = {
  '/admin': 'لوحة المعلومات',
  '/admin/dashboard': 'لوحة المعلومات',
  '/admin/profile': 'الملف الشخصي',
  '/admin/projects': 'المشاريع',
  '/admin/services': 'الخدمات',
  '/admin/skills': 'المهارات والتصنيفات',
  '/admin/timeline': 'الخط الزمني والخبرة',
  '/admin/testimonials': 'آراء العملاء',
  '/admin/statistics': 'الأرقام والإحصائيات',
  '/admin/messages': 'رسائل التواصل',
  '/admin/media': 'مكتبة الوسائط',
  '/admin/settings': 'إعدادات الموقع',
  '/admin/data-templates': 'قوالب واستيراد البيانات',
  '/admin/users': 'المستخدمون والصلاحيات',
  '/admin/audit-logs': 'سجل الرقابة والأمان'
}

const pageTitle = computed(() => {
  return pageTitlesMap[route.path] || 'لوحة التحكم'
})

async function handleLogout() {
  authStore.logout()
  adminStore.notify('تم تسجيل الخروج بنجاح', 'info')
  router.push('/admin/login')
}

async function submitPasswordChange() {
  const { valid } = await passForm.value.validate()
  if (!valid) return

  passLoading.value = true
  try {
    await authStore.changePassword(oldPass.value, newPass.value)
    adminStore.notify('تم تحديث كلمة المرور بنجاح!', 'success')
    changePasswordDialog.value = false
    oldPass.value = ''
    newPass.value = ''
    confirmPass.value = ''
  } catch (err) {
    adminStore.notify(err.message || 'فشل تغيير كلمة المرور', 'error')
  } finally {
    passLoading.value = false
  }
}

onMounted(async () => {
  try {
    await adminStore.fetchDashboardSummary()
  } catch (e) {
    // handled in store
  }
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
  color: var(--t1);
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Sidebar */
.admin-sidebar {
  width: 260px;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid var(--border);
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-badge {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(123,110,246,0.12);
  border: 1px solid rgba(123,110,246,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-text { display: flex; flex-direction: column; }
.logo-title { font-size: 0.95rem; font-weight: 800; color: var(--t1); line-height: 1.2; }
.logo-subtitle { font-size: 0.68rem; color: var(--t3); }

.close-sidebar {
  display: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t1);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.close-sidebar:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.sidebar-backdrop {
  display: none;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.nav-group-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--t3);
  padding: 8px 12px 4px;
  letter-spacing: 0.05em;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  color: var(--t2);
  font-size: 0.86rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}
.sidebar-link:hover {
  background: var(--bg-subtle);
  color: var(--t1);
  transform: translateX(-2px);
}
.sidebar-link.router-link-active {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
  font-weight: 800;
  border: 1px solid rgba(59, 130, 246, 0.25);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
}
.sidebar-link.router-link-active::before {
  content: '';
  position: absolute;
  right: -12px;
  top: 6px;
  bottom: 6px;
  width: 4px;
  border-radius: 4px 0 0 4px;
  background: var(--primary);
}
.link-icon {
  font-size: 19px !important;
  opacity: 0.85;
}
.sidebar-link.router-link-active .link-icon {
  opacity: 1;
}

.badge {
  margin-right: auto;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
}
.badge-unread {
  margin-right: auto;
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 100px;
  background: #EF4444;
  color: #fff;
  font-weight: 800;
}

.sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid var(--border);
  background: var(--bg-subtle);
}
.user-brief { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(123,110,246,0.15); border: 1px solid rgba(123,110,246,0.3);
  display: flex; align-items: center; justify-content: center;
}
.user-meta { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-size: 0.8rem; font-weight: 700; color: var(--t1); }
.user-role { font-size: 0.65rem; color: #10B981; }

/* Main wrap */
.admin-main-wrap {
  flex: 1;
  margin-right: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-topbar {
  height: 64px;
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(14px, 2vw, 24px);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.25s ease;
  direction: rtl;
}

.topbar-start {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-end {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-toggle {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--t1);
  cursor: pointer;
  transition: all 0.2s ease;
}
.menu-toggle:hover {
  background: var(--bg-3);
  border-color: var(--primary);
}

/* Breadcrumb Trail */
.breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
}
.breadcrumb-item {
  color: var(--t3);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease;
}
.breadcrumb-item.home-link:hover {
  color: var(--primary);
}
.breadcrumb-item.current {
  color: var(--t1);
  font-weight: 800;
}
.breadcrumb-sep {
  color: var(--t3);
  opacity: 0.6;
}

.preview-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 9px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--t2);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: all 0.2s ease;
}
.preview-btn:hover {
  background: var(--bg-3);
  color: var(--t1);
  border-color: var(--primary);
  transform: translateY(-1px);
}

/* User Pill */
.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 6px;
  border-radius: 100px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
}
.user-pill-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-pill-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--t1);
}

.topbar-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  position: relative;
  text-decoration: none;
  transition: all 0.2s ease;
}
.topbar-icon-btn:hover {
  color: var(--t1);
  background: var(--bg-3);
  border-color: var(--primary);
  transform: translateY(-1px);
}
.dot-unread {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #EF4444;
}
.pulse-dot {
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  animation: pulse 1.6s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 9px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}
.logout-btn:hover {
  background: rgba(239, 68, 68, 0.18);
  transform: translateY(-1px);
}

.admin-content-body {
  padding: clamp(16px, 3vw, 32px);
  flex: 1;
}

/* Global Admin Component Styles */
:deep(.page-header),
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

:deep(.page-header > div:first-child),
.page-header > div:first-child {
  flex: 1;
  min-width: 240px;
}

:deep(.page-title),
.page-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.2rem, 2.2vw, 1.55rem);
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 4px;
  line-height: 1.3;
}

:deep(.page-subtitle),
.page-subtitle {
  font-size: 0.82rem;
  color: var(--t2);
  line-height: 1.5;
}

:deep(.btn-primary),
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 9px;
  font-size: 0.86rem;
  font-weight: 700;
  font-family: var(--f-body, 'Cairo', sans-serif);
  background: linear-gradient(135deg, #7B6EF6 0%, #6352E8 100%);
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 10px rgba(123, 110, 246, 0.25);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
}

:deep(.btn-primary:hover:not(:disabled)),
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #8A7EFF 0%, #6F5FF5 100%);
  box-shadow: 0 4px 16px rgba(123, 110, 246, 0.38);
  transform: translateY(-1px);
  color: #fff !important;
}

:deep(.btn-primary:active:not(:disabled)),
.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(123, 110, 246, 0.2);
}

:deep(.btn-ghost),
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  min-height: 40px;
  padding: 0 18px;
  border-radius: 9px;
  font-size: 0.86rem;
  font-weight: 700;
  font-family: var(--f-body, 'Cairo', sans-serif);
  background: var(--bg-subtle);
  color: var(--t2) !important;
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
}

:deep(.btn-ghost:hover:not(:disabled)),
.btn-ghost:hover:not(:disabled) {
  background: var(--bg-3);
  border-color: var(--primary);
  color: var(--t1) !important;
  transform: translateY(-1px);
}

:deep(.btn-ghost:active:not(:disabled)),
.btn-ghost:active:not(:disabled) {
  transform: translateY(0);
}

:deep(.btn:disabled),
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.admin-dialog-card {
  background: var(--bg-card) !important;
  border: 1px solid var(--border) !important;
}
.dialog-header {
  border-bottom: 1px solid var(--border);
  padding: 16px 20px;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--t1);
}

@media (max-width: 860px) {
  .admin-sidebar {
    transform: translateX(100%);
  }
  .admin-sidebar.open {
    transform: translateX(0);
    box-shadow: -10px 0 35px rgba(0, 0, 0, 0.45);
  }
  .admin-main-wrap {
    margin-right: 0 !important;
  }
  .menu-toggle {
    display: inline-flex !important;
  }
  .close-sidebar {
    display: inline-flex !important;
  }
  .sidebar-backdrop {
    display: block !important;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 1050;
  }
}

@media (max-width: 600px) {
  .admin-topbar {
    padding: 0 12px;
  }
  :deep(.page-header),
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  :deep(.page-header .btn-primary),
  .page-header .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
