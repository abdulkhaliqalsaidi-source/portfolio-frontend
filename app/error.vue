<template>
  <div class="error-page" dir="rtl">
    <div class="error-container">
      <div class="error-badge">خطأ {{ error.statusCode }}</div>
      <h1 class="error-title">{{ error.statusCode === 404 ? 'الصفحة غير موجودة' : 'حدث خطأ غير متوقع' }}</h1>
      <p class="error-desc">
        {{ error.statusCode === 404 
          ? 'عذراً، الرابط الذي تحاول الوصول إليه غير متاح أو ربما تم نقله أو حذفه.' 
          : 'حدث خطأ في معالجة طلبك، يرجى المحاولة مرة أخرى لاحقاً.' }}
      </p>
      <div class="error-actions">
        <button class="btn btn-primary" @click="handleClearError">
          العودة للرئيسية
        </button>
        <NuxtLink to="/projects" class="btn btn-secondary">
          استعراض المشاريع
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({ statusCode: 404, message: 'Not Found' })
  }
})

useSeoMeta({
  title: `خطأ ${props.error.statusCode} | الصفحة غير موجودة`,
  robots: 'noindex, nofollow'
})

function handleClearError() {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg, #0B0F19);
  color: var(--t1, #F8FAFC);
  font-family: var(--f-body, sans-serif);
}

.error-container {
  max-width: 520px;
  text-align: center;
}

.error-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(239, 68, 68, 0.12);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.error-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.error-desc {
  color: var(--t2, #94A3B8);
  line-height: 1.7;
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary, #3B82F6);
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-hover, #2563EB);
}

.btn-secondary {
  background: var(--bg-card, #0F172A);
  color: var(--t1, #F8FAFC);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
}

.btn-secondary:hover {
  border-color: var(--border-h, rgba(255, 255, 255, 0.25));
}
</style>
