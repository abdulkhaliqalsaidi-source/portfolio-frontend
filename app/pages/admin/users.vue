<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة المستخدمين والصلاحيات</h1>
        <p class="page-subtitle">إضافة وتعديل مدراء النظام وتحديد الصلاحيات وتغيير كلمات المرور.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" @click="openCreateDialog">
          <v-icon icon="mdi-account-plus-outline" size="18" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الصلاحيات والرتبة</th>
              <th>الحالة</th>
              <th>تاريخ الانضمام</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usersList" :key="u.id">
              <td>
                <div class="d-flex align-center gap-2">
                  <div class="user-table-avatar">
                    <v-icon icon="mdi-account" color="#7B6EF6" size="18" />
                  </div>
                  <div class="user-cell-meta">
                    <strong>{{ u.username }}</strong>
                    <div class="text-caption text-secondary">{{ u.first_name }} {{ u.last_name }}</div>
                  </div>
                </div>
              </td>
              <td>{{ u.email || '—' }}</td>
              <td>
                <v-chip size="x-small" :color="u.is_superuser ? 'primary' : 'cyan'" variant="tonal">
                  {{ u.is_superuser ? 'مدير عام (Superuser)' : 'محرر (Staff)' }}
                </v-chip>
              </td>
              <td>
                <v-chip size="x-small" :color="u.is_active ? 'success' : 'error'" variant="tonal">
                  {{ u.is_active ? 'نشط' : 'معطل' }}
                </v-chip>
              </td>
              <td class="text-caption">{{ formatDate(u.date_joined) }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button class="table-action-icon edit" @click="openEditDialog(u)" title="تعديل">
                    <v-icon icon="mdi-pencil-outline" size="16" />
                  </button>
                  <button class="table-action-icon delete" v-if="!u.is_superuser || usersList.length > 1" @click="deleteUser(u)" title="حذف">
                    <v-icon icon="mdi-delete-outline" size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <v-dialog v-model="dialog" max-width="520" scrollable>
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <span>{{ isEditing ? 'تعديل بيانات المستخدم: ' + form.username : 'إضافة مستخدم جديد' }}</span>
          <button class="close-btn" @click="dialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="userForm">
            <v-row>
              <v-col cols="12" sm="6">
                <label class="field-label">اسم المستخدم *</label>
                <v-text-field v-model="form.username" placeholder="editor_ali" variant="outlined" density="comfortable" :rules="[v => !!v || 'اسم المستخدم مطلوب']" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">البريد الإلكتروني</label>
                <v-text-field v-model="form.email" placeholder="user@example.com" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">الاسم الأول</label>
                <v-text-field v-model="form.first_name" placeholder="علي" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">الاسم الأخير</label>
                <v-text-field v-model="form.last_name" placeholder="محمد" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12">
                <label class="field-label">{{ isEditing ? 'كلمة المرور الجديدة (اتركها فارغة لعدم التغيير)' : 'كلمة المرور *' }}</label>
                <v-text-field v-model="form.password" type="password" placeholder="••••••••" variant="outlined" density="comfortable" :rules="isEditing ? [] : [v => !!v || 'كلمة المرور مطلوبة']" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-switch v-model="form.is_superuser" color="primary" label="صلاحيات مدير عام (Superuser)" hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <v-switch v-model="form.is_active" color="success" label="حساب نشط" hide-details />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveUser">
            {{ isEditing ? 'حفظ التعديلات' : 'إضافة المستخدم' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      title="تأكيد حذف المستخدم"
      :item-name="userToDelete?.username"
      item-type="حساب مستخدم"
      warning-text="تنبيه: سيتم مسح هذا الحساب نهائياً ولن يتمكن صاحبه من تسجيل الدخول للوحة التحكم."
      :loading="deleting"
      @confirm="executeDelete"
    />
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
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'

const adminStore = useAdminStore()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const usersList = ref([])

// Delete state
const deleteConfirmOpen = ref(false)
const userToDelete = ref(null)

const dialog = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const userForm = ref(null)

const defaultForm = () => ({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  is_superuser: false,
  is_staff: true,
  is_active: true,
})

const form = ref(defaultForm())

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function fetchUsers() {
  loading.value = true
  try {
    const data = await adminService.getUsers()
    usersList.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل قائمة المستخدمين', 'error')
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  isEditing.value = false
  editId.value = null
  form.value = defaultForm()
  dialog.value = true
}

function openEditDialog(u) {
  isEditing.value = true
  editId.value = u.id
  form.value = {
    username: u.username,
    email: u.email,
    first_name: u.first_name,
    last_name: u.last_name,
    password: '',
    is_superuser: u.is_superuser,
    is_staff: u.is_staff,
    is_active: u.is_active
  }
  dialog.value = true
}

async function saveUser() {
  const { valid } = await userForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const payload = { ...form.value }
    if (!payload.password) delete payload.password

    if (isEditing.value) {
      await adminService.updateUser(editId.value, payload)
      adminStore.notify('تم تحديث بيانات المستخدم بنجاح!', 'success')
    } else {
      await adminService.createUser(payload)
      adminStore.notify('تم إنشاء المستخدم الجديد بنجاح!', 'success')
    }
    dialog.value = false
    await fetchUsers()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ المستخدم', 'error')
  } finally {
    saving.value = false
  }
}

function deleteUser(u) {
  userToDelete.value = u
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  if (!userToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteUser(userToDelete.value.id)
    adminStore.notify('تم حذف المستخدم بنجاح', 'info')
    deleteConfirmOpen.value = false
    userToDelete.value = null
    await fetchUsers()
  } catch (e) {
    adminStore.notify(e.message || 'فشل حذف المستخدم', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchUsers()
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

.user-table-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.25);
  display: flex; align-items: center; justify-content: center;
}

.table-action-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--t2); cursor: pointer; transition: all 0.2s ease;
}
.table-action-icon:hover { color: var(--t1); background: var(--bg-3); border-color: var(--primary); transform: translateY(-2px); }
.table-action-icon.edit:hover { color: var(--primary); border-color: var(--primary); background: rgba(59, 130, 246, 0.1); }
.table-action-icon.delete:hover { color: #EF4444; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1); }

.field-label { font-size: 0.8rem; font-weight: 700; color: var(--t2); margin-bottom: 6px; display: block; }
.close-btn { background: transparent; border: none; color: var(--t3); cursor: pointer; padding: 4px; border-radius: 6px; }
.close-btn:hover { color: var(--t1); background: var(--bg-subtle); }
</style>
