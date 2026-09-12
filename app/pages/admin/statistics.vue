<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة الأرقام والإحصائيات</h1>
        <p class="page-subtitle">تعديل العدادات الرقمية وسنوات الخبرة وعدد المشاريع والعملاء في واجهة الموقع.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" @click="openCreateDialog">
          <v-icon icon="mdi-plus" size="18" />
          <span>إضافة بطاقة إحصائية</span>
        </button>
      </div>
    </div>

    <!-- Stats Grid Preview -->
    <div class="admin-card mb-6">
      <h3 class="card-section-title">معاينة بطاقات الأرقام الحية</h3>
      <v-row class="mt-2">
        <v-col cols="12" sm="6" md="3" v-for="s in statsList" :key="s.id">
          <div class="stat-preview-card" :style="{ '--sc': s.color || '#7B6EF6' }">
            <div class="stat-preview-icon" :style="{ background: (s.color || '#7B6EF6') + '18', color: s.color || '#7B6EF6' }">
              <v-icon :icon="s.icon || 'mdi-rocket-launch'" size="20" />
            </div>
            <div class="stat-preview-val">{{ s.value }}{{ s.suffix || '' }}</div>
            <div class="stat-preview-lbl">{{ s.label }}</div>
            <div class="stat-preview-desc" v-if="s.description">{{ s.description }}</div>
            <div class="d-flex justify-between align-center mt-3 pt-2 border-top">
              <v-chip size="x-small" :color="s.is_active ? 'success' : 'grey'" variant="tonal">
                {{ s.is_active ? 'مفعل' : 'معطل' }}
              </v-chip>
              <div class="d-flex gap-1">
                <button class="mini-icon-btn" @click="openEditDialog(s)"><v-icon icon="mdi-pencil" size="14" /></button>
                <button class="mini-icon-btn text-error" @click="deleteStat(s)"><v-icon icon="mdi-delete" size="14" /></button>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Modal Dialog -->
    <v-dialog v-model="dialog" max-width="480" scrollable>
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <span>{{ isEditing ? 'تعديل الإحصائية' : 'إضافة إحصائية جديدة' }}</span>
          <button class="close-btn" @click="dialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="statForm">
            <v-row>
              <v-col cols="12">
                <label class="field-label">العنوان التوضيحي *</label>
                <v-text-field v-model="form.label" placeholder="مشروع منجز / سنوات خبرة" variant="outlined" density="comfortable" :rules="[v => !!v || 'العنوان مطلوب']" />
              </v-col>
              <v-col cols="12">
                <label class="field-label">الوصف التوضيحي (يظهر أسفل الرقم في قسم الفلسفة)</label>
                <v-textarea v-model="form.description" placeholder="مثال: أنظمة ويب وتطبيقات متكاملة تم شحنها للمستخدمين." variant="outlined" density="comfortable" rows="2" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">القيمة الرقمية *</label>
                <v-text-field v-model.number="form.value" type="number" variant="outlined" density="comfortable" :rules="[v => v !== null && v !== '' || 'القيمة مطلوبة']" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">اللاحقة (مثل + أو %)</label>
                <v-text-field v-model="form.suffix" placeholder="+" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">الأيقونة (MDI)</label>
                <v-text-field v-model="form.icon" placeholder="mdi-rocket-launch" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6">
                <ColorPickerInput
                  v-model="form.color"
                  label="اللون المميز (Hex)"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-switch v-model="form.is_active" color="success" label="مفعلة وتظهر في الموقع" hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">الترتيب</label>
                <v-text-field v-model.number="form.sort_order" type="number" variant="outlined" density="compact" hide-details />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveStat">حفظ الإحصائية</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      title="تأكيد حذف الإحصائية"
      :item-name="statToDelete?.label"
      item-type="مؤشر إحصائي"
      warning-text="تنبيه: سيتم حذف هذا المؤشر الإحصائي نهائياً من الموقع وقاعدة البيانات."
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

import { ref, onMounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'
import ColorPickerInput from '~/components/admin/ColorPickerInput.vue'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'

const portfolioStore = usePortfolioStore()
const adminStore = useAdminStore()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const statsList = ref([])

// Delete state
const deleteConfirmOpen = ref(false)
const statToDelete = ref(null)

const dialog = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const statForm = ref(null)

const defaultForm = () => ({
  label: '',
  description: '',
  value: 0,
  suffix: '+',
  icon: 'mdi-rocket-launch',
  color: '#7B6EF6',
  sort_order: 1,
  is_active: true,
})

const form = ref(defaultForm())

async function fetchStats() {
  loading.value = true
  try {
    const data = await adminService.getStatistics()
    statsList.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل الإحصائيات', 'error')
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

function openEditDialog(s) {
  isEditing.value = true
  editId.value = s.id
  form.value = { ...s }
  dialog.value = true
}

async function saveStat() {
  const { valid } = await statForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEditing.value) {
      await adminService.updateStatistic(editId.value, form.value)
      adminStore.notify('تم تحديث الإحصائية بنجاح!', 'success')
    } else {
      await adminService.createStatistic(form.value)
      adminStore.notify('تمت إضافة الإحصائية بنجاح!', 'success')
    }
    dialog.value = false
    await fetchStats()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ الإحصائية', 'error')
  } finally {
    saving.value = false
  }
}

function deleteStat(s) {
  statToDelete.value = s
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  if (!statToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteStatistic(statToDelete.value.id)
    adminStore.notify('تم حذف الإحصائية بنجاح', 'info')
    deleteConfirmOpen.value = false
    statToDelete.value = null
    await fetchStats()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حذف الإحصائية', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchStats()
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
.card-section-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.05rem; font-weight: 800; color: var(--t1);
  padding-bottom: 12px; border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}

.stat-preview-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  transition: all 0.25s ease;
  border-radius: 14px;
}
.stat-preview-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.stat-preview-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
}
.stat-preview-val {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.9rem; font-weight: 900; color: var(--t1); line-height: 1; margin-bottom: 4px;
}
.stat-preview-lbl { font-size: 0.84rem; color: var(--t3); font-weight: 600; }
.border-top { border-top: 1px solid var(--border); }
.mini-icon-btn {
  width: 28px; height: 28px; border-radius: 6px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  color: var(--t3); cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
}
.mini-icon-btn:hover { color: var(--t1); background: var(--bg-3); border-color: var(--primary); transform: translateY(-1px); }

.field-label { font-size: 0.8rem; font-weight: 700; color: var(--t2); margin-bottom: 6px; display: block; }
.close-btn { background: transparent; border: none; color: var(--t3); cursor: pointer; padding: 4px; border-radius: 6px; }
.close-btn:hover { color: var(--t1); background: var(--bg-subtle); }
</style>
