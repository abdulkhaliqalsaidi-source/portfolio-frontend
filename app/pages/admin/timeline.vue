<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة الخبرات والخط الزمني</h1>
        <p class="page-subtitle">إضافة وتعديل المحطات المهنية والسنوات والإنجازات في مسيرتك البرمجية.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" @click="openCreateDialog">
          <v-icon icon="mdi-plus" size="18" />
          <span>إضافة محطة زمنية</span>
        </button>
      </div>
    </div>

    <!-- Timeline List Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="timelineList.length === 0" class="text-center py-10">
        <v-icon icon="mdi-timeline-clock-outline" size="48" color="primary" class="mb-2 opacity-50" />
        <p class="text-secondary">لا توجد محطات زمنية مضافة حالياً</p>
      </div>
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>السنة / الفترة</th>
              <th>المسمى والمحطة</th>
              <th>الجهة / المنظمة</th>
              <th>الوصف والإنجاز</th>
              <th>الحالة</th>
              <th>الترتيب</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in timelineList" :key="item.id">
              <td>
                <span class="year-chip" :style="{ color: item.color || '#7B6EF6' }">{{ item.year }}</span>
              </td>
              <td>
                <div class="d-flex align-center gap-2">
                  <v-icon :icon="item.icon || 'mdi-briefcase'" :color="item.color || '#7B6EF6'" size="16" />
                  <strong>{{ item.title }}</strong>
                </div>
              </td>
              <td>{{ item.organization || '—' }}</td>
              <td style="max-width:320px">{{ item.description }}</td>
              <td>
                <v-chip size="x-small" :color="item.is_active ? 'success' : 'grey'" variant="tonal">
                  {{ item.is_active ? 'مفعلة' : 'معطلة' }}
                </v-chip>
              </td>
              <td>{{ item.sort_order }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button class="table-action-icon edit" @click="openEditDialog(item)" title="تعديل">
                    <v-icon icon="mdi-pencil-outline" size="16" />
                  </button>
                  <button class="table-action-icon delete" @click="deleteItem(item)" title="حذف">
                    <v-icon icon="mdi-delete-outline" size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Dialog -->
    <v-dialog v-model="dialog" max-width="580" scrollable>
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <span>{{ isEditing ? 'تعديل المحطة الزمنية' : 'إضافة محطة زمنية جديدة' }}</span>
          <button class="close-btn" @click="dialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="timelineForm">
            <v-row>
              <v-col cols="12" sm="6">
                <label class="field-label">السنة أو الفترة *</label>
                <v-text-field v-model="form.year" placeholder="مثال: 2025 - الآن" variant="outlined" density="comfortable" :rules="[v => !!v || 'السنة مطلوبة']" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">المسمى / العنوان *</label>
                <v-text-field v-model="form.title" placeholder="مثال: تأسيس وإدارة قسم المشاريع أو قيادة فريق التصميم" variant="outlined" density="comfortable" :rules="[v => !!v || 'المسمى مطلوب']" />
              </v-col>
              <v-col cols="12">
                <label class="field-label">الجهة أو المنظمة أو نوع المشروع</label>
                <v-text-field v-model="form.organization" placeholder="مثال: اسم المؤسسة أو الشركة أو جهة العمل" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12">
                <label class="field-label">التفاصيل والإنجاز *</label>
                <v-textarea v-model="form.description" placeholder="اشرح ما حققته في هذه المرحلة..." variant="outlined" rows="3" :rules="[v => !!v || 'التفاصيل مطلوبة']" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">الأيقونة (MDI)</label>
                <v-text-field v-model="form.icon" placeholder="mdi-briefcase-outline" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6">
                <ColorPickerInput
                  v-model="form.color"
                  label="اللون المميز (Hex)"
                />
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
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveTimeline">حفظ المحطة</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      title="تأكيد حذف المحطة الزمنية"
      :item-name="itemToDelete?.title"
      item-type="محطة ومسار مهني"
      warning-text="تنبيه: سيتم حذف هذه المحطة المهنية نهائياً ولن تظهر في الخط الزمني بالموقع."
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
const timelineList = ref([])

// Delete state
const deleteConfirmOpen = ref(false)
const itemToDelete = ref(null)

const dialog = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const timelineForm = ref(null)

const defaultForm = () => ({
  year: '2025',
  title: '',
  organization: '',
  description: '',
  icon: 'mdi-briefcase',
  color: '#7B6EF6',
  sort_order: 1,
  is_active: true,
})

const form = ref(defaultForm())


async function fetchTimeline() {
  loading.value = true
  try {
    const data = await adminService.getTimeline()
    timelineList.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل بيانات الخط الزمني', 'error')
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

function openEditDialog(item) {
  isEditing.value = true
  editId.value = item.id
  form.value = {
    ...defaultForm(),
    ...item
  }
  dialog.value = true
}

async function saveTimeline() {
  const { valid } = await timelineForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEditing.value) {
      await adminService.updateExperience(editId.value, form.value)
      adminStore.notify('تم تحديث المحطة الزمنية بنجاح!', 'success')
    } else {
      await adminService.createExperience(form.value)
      adminStore.notify('تمت إضافة المحطة بنجاح!', 'success')
    }
    dialog.value = false
    await fetchTimeline()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ المحطة', 'error')
  } finally {
    saving.value = false
  }
}

function deleteItem(item) {
  itemToDelete.value = item
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteExperience(itemToDelete.value.id)
    adminStore.notify('تم حذف المحطة بنجاح', 'info')
    deleteConfirmOpen.value = false
    itemToDelete.value = null
    await fetchTimeline()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حذف المحطة', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchTimeline()
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

.table-responsive { overflow-x: auto; }
.table-responsive { overflow-x: auto; border-radius: 12px; }
.admin-table { width: 100%; border-collapse: collapse; text-align: right; }
.admin-table th {
  padding: 14px 16px; font-size: 0.78rem; font-weight: 800; color: var(--t3);
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}
.admin-table td { padding: 15px 16px; font-size: 0.88rem; color: var(--t1); border-bottom: 1px solid var(--border); vertical-align: middle; }
.admin-table tr:hover td { background: var(--bg-subtle); }

.year-chip {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-weight: 900; font-size: 0.88rem;
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
