<template>
  <div class="dashboard-view">
    <!-- Welcome Header -->
    <div class="dash-welcome-card mb-6">
      <div class="welcome-text">
        <div class="welcome-badge">نظام البورتفوليو الحي</div>
        <h1 class="welcome-title">مرحباً بك، {{ authStore.displayName }} 👋</h1>
        <p class="welcome-desc">
          يمكنك من هنا إدارة كافة محتويات الموقع ومتابعة رسائل العملاء وتحديث المشاريع لحظياً.
        </p>
      </div>
      <div class="welcome-actions">
        <router-link to="/admin/projects" class="btn btn-primary">
          <v-icon icon="mdi-plus" size="18" />
          <span>إضافة مشروع</span>
        </router-link>
        <router-link to="/admin/messages" class="btn btn-ghost">
          <v-icon icon="mdi-email-outline" size="18" />
          <span>صندوق الرسائل ({{ adminStore.metrics.unread_messages || 0 }})</span>
        </router-link>
      </div>
    </div>

    <!-- Metric Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="m in metricCards" :key="m.title">
        <div class="dash-metric-card" :style="{ '--mc': m.color }">
          <div class="metric-top">
            <span class="metric-label">{{ m.title }}</span>
            <div class="metric-icon" :style="{ background: m.color + '15', color: m.color }">
              <v-icon :icon="m.icon" size="20" />
            </div>
          </div>
          <div class="metric-value">{{ m.value }}</div>
          <div class="metric-foot">
            <span class="metric-note" :style="{ color: m.color }">{{ m.note }}</span>
            <router-link :to="m.link" class="metric-link">إدارة ←</router-link>
          </div>
          <div class="metric-bar" :style="{ background: m.color }" />
        </div>
      </v-col>
    </v-row>

    <!-- Main Grid: Recent Messages & Recent Projects -->
    <v-row>
      <!-- Recent Messages -->
      <v-col cols="12" lg="7">
        <div class="dash-card">
          <div class="dash-card-head">
            <div class="d-flex align-center gap-2">
              <v-icon icon="mdi-email-outline" color="#7B6EF6" size="20" />
              <h3 class="dash-card-title">آخر رسائل التواصل الواردة</h3>
            </div>
            <router-link to="/admin/messages" class="dash-more-link">عرض كل الرسائل ←</router-link>
          </div>

          <div v-if="adminStore.latestMessages?.length" class="messages-list">
            <div
              v-for="msg in adminStore.latestMessages" :key="msg.id"
              class="msg-item" :class="{ unread: !msg.is_read }"
              @click="openMessageModal(msg)"
            >
              <div class="msg-avatar">
                {{ msg.sender_name ? msg.sender_name[0] : 'ز' }}
              </div>
              <div class="msg-body">
                <div class="msg-header-row">
                  <span class="msg-sender">{{ msg.sender_name }}</span>
                  <span class="msg-time">{{ formatDate(msg.created_at) }}</span>
                </div>
                <div class="msg-subject">{{ msg.subject }}</div>
                <div class="msg-preview">{{ msg.message }}</div>
              </div>
              <div class="msg-status-dot" v-if="!msg.is_read" title="رسالة جديدة" />
            </div>
          </div>
          <div v-else class="dash-empty text-center py-8">
            <v-icon icon="mdi-email-check-outline" size="40" color="primary" class="mb-2 opacity-50" />
            <p class="text-secondary">لا توجد رسائل واردة حالياً</p>
          </div>
        </div>
      </v-col>

      <!-- Recent Projects -->
      <v-col cols="12" lg="5">
        <div class="dash-card">
          <div class="dash-card-head">
            <div class="d-flex align-center gap-2">
              <v-icon icon="mdi-folder-multiple-outline" color="#06B6D4" size="20" />
              <h3 class="dash-card-title">أحدث المشاريع</h3>
            </div>
            <router-link to="/admin/projects" class="dash-more-link">إدارة المشاريع ←</router-link>
          </div>

          <div v-if="adminStore.latestProjects?.length" class="projects-mini-list">
            <div v-for="proj in adminStore.latestProjects" :key="proj.id" class="proj-mini-item">
              <img :src="proj.image" :alt="proj.title" class="proj-mini-img" />
              <div class="proj-mini-body">
                <h4 class="proj-mini-title">{{ proj.title }}</h4>
                <div class="proj-mini-tags">
                  <span v-for="t in (proj.tags || []).slice(0, 2)" :key="t" class="tag-xs">{{ t }}</span>
                  <span v-if="proj.is_featured" class="tag-featured">مميز</span>
                </div>
              </div>
              <router-link :to="`/projects/${proj.slug || proj.id}`" target="_blank" class="proj-mini-view" title="عرض في الموقع">
                <v-icon icon="mdi-open-in-new" size="16" />
              </router-link>
            </div>
          </div>
          <div v-else class="dash-empty text-center py-8">
            <p class="text-secondary">لا توجد مشاريع مضافة</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Message Detail Modal -->
    <v-dialog v-model="messageModal" max-width="580" scrollable>
      <v-card class="admin-dialog-card" rounded="xl" v-if="selectedMsg">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-email-open-outline" color="primary" />
            <span>تفاصيل الرسالة</span>
          </div>
          <v-chip size="small" :color="selectedMsg.is_read ? 'success' : 'error'" variant="tonal">
            {{ selectedMsg.is_read ? 'مقروءة' : 'جديدة' }}
          </v-chip>
        </v-card-title>
        <v-card-text class="pt-4">
          <div class="msg-meta-grid mb-4">
            <div><strong>المرسل:</strong> {{ selectedMsg.sender_name }}</div>
            <div><strong>البريد:</strong> <a :href="`mailto:${selectedMsg.sender_email}`" class="text-primary">{{ selectedMsg.sender_email }}</a></div>
            <div v-if="selectedMsg.sender_phone"><strong>الهاتف:</strong> {{ selectedMsg.sender_phone }}</div>
            <div><strong>التاريخ:</strong> {{ formatDate(selectedMsg.created_at) }}</div>
          </div>
          <div class="msg-modal-subject mb-3">
            <strong>الموضوع:</strong> {{ selectedMsg.subject }}
          </div>
          <div class="msg-modal-content">
            {{ selectedMsg.message }}
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <a :href="`mailto:${selectedMsg.sender_email}?subject=رد على: ${selectedMsg.subject}`" class="btn btn-primary">
            <v-icon icon="mdi-reply" size="16" class="ml-1" />
            الرد عبر البريد
          </a>
          <v-spacer />
          <v-btn variant="text" @click="messageModal = false">إغلاق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'

const authStore = useAuthStore()
const adminStore = useAdminStore()

const messageModal = ref(false)
const selectedMsg = ref(null)

const metricCards = computed(() => [
  {
    title: 'المشاريع المنشورة',
    value: adminStore.metrics.total_projects || 0,
    icon: 'mdi-folder-multiple',
    color: '#7B6EF6',
    note: 'معارض دراسة الحالة',
    link: '/admin/projects'
  },
  {
    title: 'الرسائل الجديدة',
    value: adminStore.metrics.unread_messages || 0,
    icon: 'mdi-email-alert',
    color: '#EF4444',
    note: `إجمالي: ${adminStore.metrics.total_messages || 0}`,
    link: '/admin/messages'
  },
  {
    title: 'الخدمات النشطة',
    value: adminStore.metrics.total_services || 0,
    icon: 'mdi-monitor-dashboard',
    color: '#06B6D4',
    note: 'بطاقات الخدمات',
    link: '/admin/services'
  },
  {
    title: 'المهارات والتقنيات',
    value: adminStore.metrics.total_skills || 0,
    icon: 'mdi-code-tags-check',
    color: '#10B981',
    note: 'ضمن التصنيفات',
    link: '/admin/skills'
  },
])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function openMessageModal(msg) {
  selectedMsg.value = msg
  messageModal.value = true
  if (!msg.is_read) {
    try {
      await adminService.toggleMessageRead(msg.id)
      msg.is_read = true
      adminStore.metrics.unread_messages = Math.max(0, (adminStore.metrics.unread_messages || 1) - 1)
    } catch (e) {
      // ignore
    }
  }
}
</script>

<style scoped>
.dashboard-view { max-width: 1300px; margin: 0 auto; }

/* Welcome Card */
.dash-welcome-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}
.dash-welcome-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  pointer-events: none;
}
.welcome-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  background: rgba(59, 130, 246, 0.12);
  color: var(--primary);
  font-size: 0.74rem;
  font-weight: 800;
  margin-bottom: 10px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}
.welcome-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.4rem, 2.5vw, 1.85rem);
  font-weight: 900;
  color: var(--t1);
  margin-bottom: 8px;
  line-height: 1.3;
}
.welcome-desc {
  font-size: 0.92rem;
  color: var(--t2);
  max-width: 560px;
  line-height: 1.6;
}
.welcome-actions { display: flex; gap: 12px; flex-wrap: wrap; }

/* Metric Card */
.dash-metric-card {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 22px 24px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.dash-metric-card:hover {
  border-color: var(--mc);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}
.metric-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.metric-label { font-size: 0.84rem; font-weight: 700; color: var(--t2); }
.metric-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.2s ease;
}
.dash-metric-card:hover .metric-icon {
  transform: scale(1.08);
}
.metric-value {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 2.3rem; font-weight: 900; color: var(--t1); line-height: 1; margin-bottom: 12px;
}
.metric-foot { display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; }
.metric-note { font-weight: 700; }
.metric-link { color: var(--t3); text-decoration: none; font-weight: 700; transition: all 0.2s; }
.metric-link:hover { color: var(--primary); transform: translateX(-3px); }
.metric-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; opacity: 0.8; }

/* Dash Card */
.dash-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  height: 100%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
}
.dash-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}
.dash-card-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 16px; margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.dash-card-title { font-family: var(--f-display, 'Tajawal', sans-serif); font-size: 1.08rem; font-weight: 800; color: var(--t1); }
.dash-more-link { font-size: 0.8rem; font-weight: 700; color: var(--primary); text-decoration: none; transition: all 0.2s; }
.dash-more-link:hover { text-decoration: underline; transform: translateX(-3px); }

/* Messages List */
.messages-list { display: flex; flex-direction: column; gap: 10px; }
.msg-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 16px; border-radius: 14px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  cursor: pointer; position: relative; transition: all 0.2s ease;
}
.msg-item:hover {
  background: var(--bg-3);
  border-color: var(--primary);
  transform: translateX(-3px);
}
.msg-item.unread {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}
.msg-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.25);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; color: var(--primary); flex-shrink: 0; font-size: 0.9rem;
}
.msg-body { flex: 1; min-width: 0; }
.msg-header-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
.msg-sender { font-size: 0.88rem; font-weight: 800; color: var(--t1); }
.msg-time { font-size: 0.72rem; color: var(--t3); }
.msg-subject { font-size: 0.82rem; font-weight: 600; color: var(--t2); margin-bottom: 3px; }
.msg-preview {
  font-size: 0.76rem; color: var(--t3);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.msg-status-dot {
  position: absolute; top: 14px; left: 14px;
  width: 8px; height: 8px; border-radius: 50%;
  background: #EF4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}

/* Projects Mini List */
.projects-mini-list { display: flex; flex-direction: column; gap: 10px; }
.proj-mini-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 14px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  transition: all 0.2s ease;
}
.proj-mini-item:hover {
  background: var(--bg-3);
  border-color: var(--primary);
  transform: translateX(-3px);
}
.proj-mini-img {
  width: 60px; height: 46px; border-radius: 10px;
  object-fit: cover; flex-shrink: 0;
  border: 1px solid var(--border);
}
.proj-mini-body { flex: 1; min-width: 0; }
.proj-mini-title {
  font-size: 0.88rem; font-weight: 800; color: var(--t1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px;
}
.proj-mini-tags { display: flex; gap: 5px; }
.tag-xs {
  font-size: 0.68rem; padding: 2px 7px; border-radius: 6px;
  background: var(--bg-3); color: var(--t2); border: 1px solid var(--border);
}
.tag-featured {
  font-size: 0.68rem; padding: 2px 7px; border-radius: 6px;
  background: rgba(16, 185, 129, 0.12); color: #10B981; font-weight: 800;
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.proj-mini-view {
  color: var(--t3); text-decoration: none; padding: 7px;
  border-radius: 8px; transition: all 0.2s;
  background: var(--bg-subtle); border: 1px solid var(--border);
  display: inline-flex; align-items: center; justify-content: center;
}
.proj-mini-view:hover { color: var(--primary); background: var(--bg-3); border-color: var(--primary); }

/* Modal Content */
.msg-meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  padding: 14px; background: var(--bg-subtle); border-radius: 12px; font-size: 0.86rem;
  border: 1px solid var(--border);
}
.msg-modal-subject { font-size: 0.98rem; color: var(--t1); font-weight: 800; }
.msg-modal-content {
  background: var(--bg-subtle); border: 1px solid var(--border);
  border-radius: 12px; padding: 18px; font-size: 0.9rem; line-height: 1.8;
  color: var(--t1); white-space: pre-wrap;
}

@media (max-width: 768px) {
  .dash-welcome-card { padding: 22px 20px; }
  .welcome-actions { width: 100%; flex-direction: column; }
  .welcome-actions .btn { width: 100%; justify-content: center; }
}
</style>
