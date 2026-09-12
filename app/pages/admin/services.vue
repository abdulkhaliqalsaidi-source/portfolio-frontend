<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة الخدمات والحلول</h1>
        <p class="page-subtitle">إضافة وتعديل الخدمات المقدمة ومميزات كل خدمة وألوانها وأيقوناتها.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" @click="openCreateDialog">
          <v-icon icon="mdi-plus" size="18" />
          <span>إضافة خدمة جديدة</span>
        </button>
      </div>
    </div>

    <!-- Services Grid / Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="servicesList.length === 0" class="text-center py-10">
        <v-icon icon="mdi-monitor-dashboard" size="48" color="rgba(255,255,255,0.2)" class="mb-2" />
        <p class="text-secondary">لا توجد خدمات مضافة حالياً</p>
      </div>
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>الخدمة</th>
              <th>الوصف</th>
              <th>المميزات</th>
              <th>الحالة</th>
              <th>الترتيب</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in servicesList" :key="s.id">
              <td>
                <div class="d-flex align-center gap-3">
                  <div class="service-table-icon" :style="{ background: (s.color || '#7B6EF6') + '18', color: s.color || '#7B6EF6' }">
                    <v-icon :icon="s.icon || 'mdi-monitor-dashboard'" size="20" />
                  </div>
                  <strong>{{ s.title }}</strong>
                </div>
              </td>
              <td style="max-width:300px">{{ s.description }}</td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span v-for="f in (s.features || [])" :key="f" class="badge-tag">{{ f }}</span>
                </div>
              </td>
              <td>
                <v-chip size="x-small" :color="s.is_active ? 'success' : 'grey'" variant="tonal">
                  {{ s.is_active ? 'نشطة' : 'معطلة' }}
                </v-chip>
              </td>
              <td>{{ s.sort_order }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button class="table-action-icon edit" @click="openEditDialog(s)" title="تعديل">
                    <v-icon icon="mdi-pencil-outline" size="16" />
                  </button>
                  <button class="table-action-icon delete" @click="confirmDelete(s)" title="حذف">
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
    <v-dialog v-model="dialog" max-width="640" scrollable>
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="isEditing ? 'mdi-pencil-box-outline' : 'mdi-plus-box-outline'" color="primary" />
            <span>{{ isEditing ? 'تعديل الخدمة: ' + form.title : 'إضافة خدمة جديدة' }}</span>
          </div>
          <button class="close-btn" @click="dialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="serviceForm">
            <v-row>
              <v-col cols="12">
                <label class="field-label">عنوان الخدمة *</label>
                <v-text-field
                  v-model="form.title"
                  placeholder="مثال: الاستشارات الاستراتيجية أو تصميم الهويات أو تطوير الحلول"
                  variant="outlined"
                  density="comfortable"
                  :rules="[v => !!v || 'العنوان مطلوب']"
                />
              </v-col>
              <v-col cols="12">
                <label class="field-label">وصف الخدمة *</label>
                <v-textarea
                  v-model="form.description"
                  placeholder="وصف تفصيلي لما تقدمه في هذه الخدمة..."
                  variant="outlined"
                  rows="3"
                  :rules="[v => !!v || 'الوصف مطلوب']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label class="field-label">الأيقونة (MDI Icon)</label>
                <v-text-field
                  v-model="form.icon"
                  placeholder="mdi-star-shooting-outline"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-image-filter-vintage"
                />
              </v-col>
              <v-col cols="12" md="6">
                <ColorPickerInput
                  v-model="form.color"
                  label="اللون المميز (Hex Code)"
                />
              </v-col>
              <v-col cols="12">
                <label class="field-label">أبرز مميزات الخدمة</label>
                <div class="d-flex gap-2 mb-2">
                  <v-text-field
                    v-model="newFeature"
                    placeholder="أضف ميزة (مثل: تصميم متجاوب، دعم كامل...)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @keydown.enter.prevent="addFeature"
                  />
                  <v-btn color="primary" variant="tonal" @click="addFeature">إضافة</v-btn>
                </div>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <v-chip
                    v-for="(f, idx) in form.features" :key="idx"
                    closable
                    size="small"
                    color="primary"
                    variant="tonal"
                    @click:close="form.features.splice(idx, 1)"
                  >
                    {{ f }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">حالة النشر</label>
                <div class="d-flex align-center" style="height: 48px;">
                  <v-switch v-model="form.is_active" color="success" label="مفعلة وتظهر في الموقع" hide-details />
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">ترتيب العرض</label>
                <v-text-field v-model.number="form.sort_order" type="number" variant="outlined" density="comfortable" hide-details />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveService">
            {{ isEditing ? 'حفظ التعديلات' : 'إضافة الخدمة' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteDialog"
      title="تأكيد حذف الخدمة"
      :item-name="serviceToDelete?.title"
      item-type="خدمة متخصصة"
      warning-text="تنبيه: سيتم حذف هذه الخدمة ومميزاتها نهائياً من الموقع وقاعدة البيانات."
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
const servicesList = ref([])

const dialog = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const newFeature = ref('')

const deleteDialog = ref(false)
const serviceToDelete = ref(null)
const serviceForm = ref(null)

const defaultForm = () => ({
  title: '',
  description: '',
  icon: 'mdi-monitor-dashboard',
  color: '#7B6EF6',
  features: [],
  sort_order: 1,
  is_active: true,
})

const form = ref(defaultForm())


function addFeature() {
  if (newFeature.value.trim()) {
    form.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

async function fetchServices() {
  loading.value = true
  try {
    const data = await adminService.getServices()
    servicesList.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل قائمة الخدمات', 'error')
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
  form.value = {
    ...defaultForm(),
    ...s,
    features: Array.isArray(s.features) ? [...s.features] : []
  }
  dialog.value = true
}

async function saveService() {
  const { valid } = await serviceForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEditing.value) {
      await adminService.updateService(editId.value, form.value)
      adminStore.notify('تم تحديث الخدمة بنجاح!', 'success')
    } else {
      await adminService.createService(form.value)
      adminStore.notify('تمت إضافة الخدمة بنجاح!', 'success')
    }
    dialog.value = false
    await fetchServices()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ الخدمة', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(s) {
  serviceToDelete.value = s
  deleteDialog.value = true
}

async function executeDelete() {
  if (!serviceToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteService(serviceToDelete.value.id)
    adminStore.notify('تم حذف الخدمة بنجاح', 'info')
    deleteDialog.value = false
    await fetchServices()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حذف الخدمة', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchServices()
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
.admin-table {
  width: 100%; border-collapse: collapse; text-align: right;
}
.admin-table th {
  padding: 14px 16px; font-size: 0.78rem; font-weight: 800; color: var(--t3);
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}
.admin-table td { padding: 15px 16px; font-size: 0.88rem; color: var(--t1); border-bottom: 1px solid var(--border); vertical-align: middle; }
.admin-table tr:hover td { background: var(--bg-subtle); }

.service-table-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.badge-tag {
  font-size: 0.7rem; padding: 3px 8px; border-radius: 6px;
  background: var(--bg-subtle); color: var(--t2); border: 1px solid var(--border);
  font-weight: 600;
}

.table-action-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--t2); cursor: pointer;
  transition: all 0.2s ease;
}
.table-action-icon:hover { color: var(--t1); background: var(--bg-3); border-color: var(--primary); transform: translateY(-2px); }
.table-action-icon.edit:hover { color: var(--primary); border-color: var(--primary); background: rgba(59, 130, 246, 0.1); }
.table-action-icon.delete:hover { color: #EF4444; border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1); }

.field-label { font-size: 0.8rem; font-weight: 700; color: var(--t2); margin-bottom: 6px; display: block; }
.close-btn { background: transparent; border: none; color: var(--t3); cursor: pointer; padding: 4px; border-radius: 6px; }
.close-btn:hover { color: var(--t1); background: var(--bg-subtle); }
</style>
