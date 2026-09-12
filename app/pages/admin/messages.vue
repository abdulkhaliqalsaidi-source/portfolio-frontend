<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">صندوق رسائل التواصل</h1>
        <p class="page-subtitle">استعراض وإدارة جميع الرسائل الواردة من نموذج التواصل في الموقع العام.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-ghost" :disabled="loading" @click="fetchMessages">
          <v-progress-circular v-if="loading" indeterminate size="16" width="2" />
          <v-icon v-else icon="mdi-refresh" size="18" />
          <span>تحديث الرسائل</span>
        </button>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="admin-card mb-6">
      <v-row align="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            placeholder="بحث بالاسم، البريد، أو الموضوع..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-btn-toggle v-model="tabFilter" mandatory density="compact" color="primary" variant="outlined" rounded="lg">
            <v-btn value="all">الكل ({{ messagesList.length }})</v-btn>
            <v-btn value="new">الجديدة ({{ unreadCount }})</v-btn>
            <v-btn value="archived">المؤرشفة</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </div>

    <!-- Messages List / Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="filteredMessages.length === 0" class="text-center py-12">
        <v-icon icon="mdi-email-check-outline" size="56" color="rgba(255,255,255,0.2)" class="mb-3" />
        <h3 style="color:var(--t2)">لا توجد رسائل في هذا القسم حالياً</h3>
      </div>
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>المرسل</th>
              <th>الموضوع والرسالة</th>
              <th>الهاتف</th>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="msg in filteredMessages" :key="msg.id"
              :class="{ 'unread-row': !msg.is_read }"
              @click="openMessage(msg)"
              style="cursor:pointer"
            >
              <td>
                <div class="d-flex align-center gap-2">
                  <div class="msg-sender-avatar">{{ msg.sender_name ? msg.sender_name[0] : 'ز' }}</div>
                  <div>
                    <strong>{{ msg.sender_name }}</strong>
                    <div class="text-caption text-secondary">{{ msg.sender_email }}</div>
                  </div>
                </div>
              </td>
              <td style="max-width:320px">
                <div class="msg-sub-text">{{ msg.subject }}</div>
                <div class="msg-body-preview">{{ msg.message }}</div>
              </td>
              <td>{{ msg.sender_phone || '—' }}</td>
              <td class="text-caption" style="white-space:nowrap">{{ formatDate(msg.created_at) }}</td>
              <td>
                <v-chip size="x-small" :color="!msg.is_read ? 'error' : msg.status === 'archived' ? 'grey' : 'success'" variant="tonal">
                  {{ !msg.is_read ? 'جديدة' : msg.status === 'archived' ? 'مؤرشفة' : 'مقروءة' }}
                </v-chip>
              </td>
              <td @click.stop>
                <div class="d-flex gap-2">
                  <button class="table-action-icon" :title="msg.is_read ? 'تحديد كغير مقروءة' : 'تحديد كمقروءة'" @click="toggleRead(msg)">
                    <v-icon :icon="msg.is_read ? 'mdi-email-outline' : 'mdi-email-open-outline'" size="16" />
                  </button>
                  <button class="table-action-icon" title="أرشفة" @click="archiveMsg(msg)">
                    <v-icon icon="mdi-archive-arrow-down-outline" size="16" />
                  </button>
                  <button class="table-action-icon delete" title="حذف" @click="deleteMsg(msg)">
                    <v-icon icon="mdi-delete-outline" size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <v-dialog v-model="detailModal" max-width="600" scrollable>
      <v-card class="admin-dialog-card" rounded="xl" v-if="selectedMsg">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-email-open" color="primary" />
            <span>رسالة من: {{ selectedMsg.sender_name }}</span>
          </div>
          <button class="close-btn" @click="detailModal = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="msg-info-box mb-4">
            <div class="d-flex justify-between py-1 border-b">
              <span class="text-caption">البريد الإلكتروني:</span>
              <a :href="`mailto:${selectedMsg.sender_email}`" class="text-primary font-weight-bold">{{ selectedMsg.sender_email }}</a>
            </div>
            <div class="d-flex justify-between py-1 border-b" v-if="selectedMsg.sender_phone">
              <span class="text-caption">رقم الهاتف:</span>
              <span>{{ selectedMsg.sender_phone }}</span>
            </div>
            <div class="d-flex justify-between py-1 border-b">
              <span class="text-caption">تاريخ الإرسال:</span>
              <span>{{ formatDate(selectedMsg.created_at) }}</span>
            </div>
            <div class="d-flex justify-between py-1" v-if="selectedMsg.ip_address">
              <span class="text-caption">عنوان IP:</span>
              <span class="text-caption font-mono">{{ selectedMsg.ip_address }}</span>
            </div>
          </div>

          <div class="mb-2">
            <strong>الموضوع:</strong> {{ selectedMsg.subject }}
          </div>

          <div class="msg-full-text">
            {{ selectedMsg.message }}
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-2">
          <a :href="`mailto:${selectedMsg.sender_email}?subject=رد على: ${selectedMsg.subject}`" class="btn btn-primary">
            <v-icon icon="mdi-reply" size="16" class="ml-1" />
            الرد عبر البريد الإلكتروني
          </a>
          <v-spacer />
          <v-btn variant="text" @click="detailModal = false">إغلاق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      title="تأكيد حذف الرسالة"
      :item-name="msgToDelete ? `رسالة: ${msgToDelete.subject} (${msgToDelete.sender_name})` : ''"
      item-type="رسالة تواصل"
      warning-text="تنبيه: سيتم مسح هذه الرسالة نهائياً من قاعدة البيانات ولا يمكن استرجاعها."
      :loading="deleting"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'

const adminStore = useAdminStore()

const loading = ref(false)
const deleting = ref(false)
const messagesList = ref([])
const search = ref('')
const tabFilter = ref('all')

const detailModal = ref(false)
const selectedMsg = ref(null)

// Delete state
const deleteConfirmOpen = ref(false)
const msgToDelete = ref(null)

const unreadCount = computed(() => {
  return messagesList.value.filter(m => !m.is_read).length
})

const filteredMessages = computed(() => {
  return messagesList.value.filter(m => {
    const matchesSearch = !search.value ||
      m.sender_name.toLowerCase().includes(search.value.toLowerCase()) ||
      m.sender_email.toLowerCase().includes(search.value.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.value.toLowerCase()) ||
      m.message.toLowerCase().includes(search.value.toLowerCase())

    let matchesTab = true
    if (tabFilter.value === 'new') matchesTab = !m.is_read
    else if (tabFilter.value === 'archived') matchesTab = m.status === 'archived'

    return matchesSearch && matchesTab
  })
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function fetchMessages() {
  loading.value = true
  try {
    const data = await adminService.getMessages()
    messagesList.value = Array.isArray(data) ? data : (data.results || [])
    adminStore.metrics.unread_messages = unreadCount.value
  } catch (err) {
    adminStore.notify('فشل تحميل الرسائل', 'error')
  } finally {
    loading.value = false
  }
}

async function openMessage(msg) {
  selectedMsg.value = msg
  detailModal.value = true
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

async function toggleRead(msg) {
  try {
    await adminService.toggleMessageRead(msg.id)
    msg.is_read = !msg.is_read
    adminStore.metrics.unread_messages = unreadCount.value
    adminStore.notify(msg.is_read ? 'تم تحديد الرسالة كمقروءة' : 'تم تحديد الرسالة كغير مقروءة', 'info')
  } catch (e) {
    adminStore.notify('فشل تحديث حالة الرسالة', 'error')
  }
}

async function archiveMsg(msg) {
  try {
    await adminService.archiveMessage(msg.id)
    msg.status = 'archived'
    adminStore.notify('تمت أرشفة الرسالة بنجاح', 'success')
  } catch (e) {
    adminStore.notify('فشل أرشفة الرسالة', 'error')
  }
}

function deleteMsg(msg) {
  msgToDelete.value = msg
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  if (!msgToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteMessage(msgToDelete.value.id)
    messagesList.value = messagesList.value.filter(m => m.id !== msgToDelete.value.id)
    adminStore.notify('تم حذف الرسالة بنجاح', 'info')
    deleteConfirmOpen.value = false
    msgToDelete.value = null
  } catch (e) {
    adminStore.notify('فشل حذف الرسالة', 'error')
  }
}

onMounted(() => {
  fetchMessages()
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
.unread-row td { background: rgba(59, 130, 246, 0.05) !important; }
.unread-row td:first-child { border-right: 3px solid var(--primary); }

.msg-sender-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(59, 130, 246, 0.12); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.88rem; flex-shrink: 0;
  border: 1px solid rgba(59, 130, 246, 0.2);
}
.msg-sub-text { font-weight: 800; color: var(--t1); margin-bottom: 2px; }
.msg-body-preview {
  font-size: 0.76rem; color: var(--t3);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.table-action-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--t2); cursor: pointer; transition: all 0.2s ease;
}
.table-action-icon:hover { color: var(--t1); background: var(--bg-3); border-color: var(--primary); transform: translateY(-2px); }
.table-action-icon.delete:hover { color: #EF4444; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1); }

.msg-info-box { background: var(--bg-subtle); border-radius: 12px; padding: 14px 18px; border: 1px solid var(--border); color: var(--t2); }
.border-b { border-bottom: 1px solid var(--border); }
.msg-full-text {
  background: var(--bg-subtle); border: 1px solid var(--border);
  border-radius: 14px; padding: 20px; font-size: 0.92rem; line-height: 1.8;
  color: var(--t1); white-space: pre-wrap; margin-top: 12px;
}

.close-btn { background: transparent; border: none; color: var(--t3); cursor: pointer; padding: 4px; border-radius: 6px; }
.close-btn:hover { color: var(--t1); background: var(--bg-subtle); }
</style>
