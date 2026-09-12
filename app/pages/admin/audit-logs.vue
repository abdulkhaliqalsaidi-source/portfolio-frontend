<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">سجل الرقابة والعمليات الأمنية (Audit Logs)</h1>
        <p class="page-subtitle">سجل تفصيلي لجميع العمليات الحساسة التي تمت في النظام مع التوقيت والآي بي والمستخدم.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-ghost" :disabled="loading" @click="fetchLogs">
          <v-progress-circular v-if="loading" indeterminate size="16" width="2" />
          <v-icon v-else icon="mdi-refresh" size="18" />
          <span>تحديث السجل</span>
        </button>
      </div>
    </div>

    <!-- Logs Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="logs.length === 0" class="text-center py-12">
        <v-icon icon="mdi-shield-check" size="56" color="rgba(255,255,255,0.2)" class="mb-3" />
        <h3 style="color:var(--t2)">لا توجد سجلات أمنية مسجلة بعد</h3>
      </div>
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>العملية / الإجراء</th>
              <th>المستخدم</th>
              <th>النموذج المتأثر</th>
              <th>المعرف</th>
              <th>عنوان IP</th>
              <th>التاريخ والوقت</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td>
                <v-chip size="x-small" :color="getActionColor(log.action)" variant="tonal">
                  {{ log.action }}
                </v-chip>
              </td>
              <td>
                <strong class="font-weight-bold">{{ log.username || 'System' }}</strong>
              </td>
              <td>{{ log.model_name || '—' }}</td>
              <td class="font-mono text-caption">{{ log.object_id || '—' }}</td>
              <td class="font-mono text-caption">{{ log.ip_address || '—' }}</td>
              <td class="text-caption">{{ formatDate(log.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  requiresSuperuser: true
})

import { ref, onMounted } from 'vue'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'

const adminStore = useAdminStore()
const loading = ref(false)
const logs = ref([])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function getActionColor(action) {
  if (!action) return 'grey'
  const act = action.toUpperCase()
  if (act.includes('CREATE') || act.includes('ADD')) return 'success'
  if (act.includes('UPDATE') || act.includes('EDIT')) return 'primary'
  if (act.includes('DELETE')) return 'error'
  if (act.includes('LOGIN')) return 'cyan'
  return 'grey'
}

async function fetchLogs() {
  loading.value = true
  try {
    const data = await adminService.getAuditLogs()
    logs.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل سجل الرقابة والأمان', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
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
}

.table-responsive { overflow-x: auto; border-radius: 12px; }
.admin-table { width: 100%; border-collapse: collapse; text-align: right; }
.admin-table th {
  padding: 14px 16px; font-size: 0.78rem; font-weight: 800; color: var(--t3);
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}
.admin-table td { padding: 15px 16px; font-size: 0.88rem; color: var(--t1); border-bottom: 1px solid var(--border); vertical-align: middle; }
.admin-table tr:hover td { background: var(--bg-subtle); }
.font-mono { font-family: var(--f-mono, monospace); font-size: 0.82rem; }
</style>
