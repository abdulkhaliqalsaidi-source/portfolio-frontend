<template>
  <div class="login-page" dir="rtl">
    <div class="login-bg-glow" />
    <div class="login-grid grid-bg" />

    <div class="login-card">
      <div class="login-header text-center">
        <div class="login-icon-box">
          <v-icon icon="mdi-shield-lock" color="#7B6EF6" size="28" />
        </div>
        <h1 class="login-title">تسجيل الدخول للإدارة</h1>
        <p class="login-subtitle">أدخل بيانات الاعتماد للوصول إلى لوحة التحكم</p>
      </div>

      <v-alert v-if="authStore.error" type="error" variant="tonal" class="mb-5" rounded="lg">
        {{ authStore.error }}
      </v-alert>

      <v-form ref="form" @submit.prevent="handleLogin">
        <div class="field-wrap mb-4">
          <label class="field-label">اسم المستخدم أو البريد الإلكتروني</label>
          <v-text-field
            v-model="username"
            placeholder="admin"
            variant="outlined"
            density="comfortable"
            color="primary"
            prepend-inner-icon="mdi-account-outline"
            :rules="[v => !!v || 'اسم المستخدم مطلوب']"
            autofocus
          />
        </div>

        <div class="field-wrap mb-6">
          <label class="field-label">كلمة المرور</label>
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            variant="outlined"
            density="comfortable"
            color="primary"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPassword = !showPassword"
            :rules="[v => !!v || 'كلمة المرور مطلوبة']"
          />
        </div>

        <button type="submit" class="btn btn-primary login-btn" :disabled="authStore.isLoading">
          <v-progress-circular v-if="authStore.isLoading" indeterminate size="20" width="2" class="ml-2" />
          <span v-else>
            دخول للوحة التحكم
            <v-icon icon="mdi-arrow-left" size="16" class="mr-1" />
          </span>
        </button>
      </v-form>

      <div class="login-footer text-center mt-6">
        <router-link to="/" class="back-link">
          <v-icon icon="mdi-arrow-right" size="14" class="ml-1" />
          العودة للموقع العام
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore } from '~/stores/admin'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const adminStore = useAdminStore()

const form = ref(null)
const username = ref('admin')
const password = ref('admin123456')
const showPassword = ref(false)

async function handleLogin() {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    await authStore.login(username.value, password.value)
    adminStore.notify('مرحباً بك! تم تسجيل الدخول بنجاح.', 'success')
    const redirectPath = route.query.redirect || '/admin/dashboard'
    router.push(redirectPath)
  } catch (err) {
    // handled in store
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.login-bg-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(123,110,246,0.15) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(60px);
  pointer-events: none;
}
.login-grid {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 32px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  position: relative;
  z-index: 2;
}

.login-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(123,110,246,0.12);
  border: 1px solid rgba(123,110,246,0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.login-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--t1);
  margin-bottom: 6px;
}
.login-subtitle {
  font-size: 0.85rem;
  color: var(--t2);
  margin-bottom: 24px;
}

.field-wrap { display: flex; flex-direction: column; }
.field-label { font-size: 0.78rem; font-weight: 700; color: var(--t2); margin-bottom: 6px; }

.login-btn {
  width: 100%;
  justify-content: center;
  padding: 13px 24px;
  font-size: 0.95rem;
  font-weight: 800;
}

.back-link {
  font-size: 0.82rem;
  color: var(--t3);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}
.back-link:hover { color: var(--primary); }
</style>
