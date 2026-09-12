<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة آراء وشهادات العملاء</h1>
        <p class="page-subtitle">إضافة وتعديل واعتماد تقييمات العملاء وأقوالهم ودرجات التقييم (النجوم).</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" @click="openCreateDialog">
          <v-icon icon="mdi-plus" size="18" />
          <span>إضافة رأي عميل</span>
        </button>
      </div>
    </div>

    <!-- Testimonials Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="testimonialsList.length === 0" class="text-center py-10">
        <v-icon icon="mdi-comment-quote-outline" size="48" color="primary" class="mb-2 opacity-50" />
        <p class="text-secondary">لا توجد آراء عملاء مضافة حالياً</p>
      </div>
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>العميل</th>
              <th>المنصب والشركة</th>
              <th>نص الشهادة</th>
              <th>التقييم</th>
              <th>الحالة</th>
              <th>الترتيب</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in testimonialsList" :key="t.id">
              <td>
                <div class="d-flex align-center gap-2">
                  <div class="t-table-avatar" :style="{ background: t.color || 'rgba(123,110,246,0.2)' }">
                    {{ (t.client_name || 'ع')[0] }}
                  </div>
                  <strong>{{ t.client_name }}</strong>
                </div>
              </td>
              <td>{{ t.client_role }} <span v-if="t.client_company">({{ t.client_company }})</span></td>
              <td style="max-width:320px; font-style:italic">"{{ t.feedback_text }}"</td>
              <td>
                <div class="d-flex gap-1">
                  <v-icon v-for="s in (t.rating || 5)" :key="s" icon="mdi-star" size="14" color="#F59E0B" />
                </div>
              </td>
              <td>
                <v-chip size="x-small" :color="t.is_published ? 'success' : 'grey'" variant="tonal">
                  {{ t.is_published ? 'منشور' : 'مخفي' }}
                </v-chip>
              </td>
              <td>{{ t.sort_order }}</td>
              <td>
                <div class="d-flex gap-2">
                  <button class="table-action-icon edit" @click="openEditDialog(t)" title="تعديل">
                    <v-icon icon="mdi-pencil-outline" size="16" />
                  </button>
                  <button class="table-action-icon delete" @click="deleteTestimonial(t)" title="حذف">
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
          <span>{{ isEditing ? 'تعديل رأي العميل' : 'إضافة رأي عميل جديد' }}</span>
          <button class="close-btn" @click="dialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="testiForm">
            <v-row>
              <v-col cols="12" sm="6">
                <label class="field-label">اسم العميل *</label>
                <v-text-field v-model="form.client_name" placeholder="محمد العمري" variant="outlined" density="comfortable" :rules="[v => !!v || 'اسم العميل مطلوب']" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">المنصب / الدور *</label>
                <v-text-field v-model="form.client_role" placeholder="المدير التنفيذي" variant="outlined" density="comfortable" :rules="[v => !!v || 'المنصب مطلوب']" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">اسم الشركة أو المؤسسة</label>
                <v-text-field v-model="form.client_company" placeholder="شركة التصنيع المتقدم" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">التقييم بالنجوم (1 إلى 5)</label>
                <v-rating v-model="form.rating" color="#F59E0B" density="compact" />
              </v-col>
              <v-col cols="12">
                <label class="field-label">نص الشهادة والرأي *</label>
                <v-textarea v-model="form.feedback_text" placeholder="اكتب نص تقييم العميل..." variant="outlined" rows="3" :rules="[v => !!v || 'نص الشهادة مطلوب']" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">حالة النشر</label>
                <div class="d-flex align-center" style="height: 48px;">
                  <v-switch v-model="form.is_published" color="success" label="منشور ويظهر في الموقع" hide-details />
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
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveTestimonial">حفظ التقييم</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      title="تأكيد حذف رأي العميل"
      :item-name="testiToDelete?.client_name"
      item-type="تقييم وشهادة عميل"
      warning-text="تنبيه: سيتم حذف تقييم وشهادة هذا العميل نهائياً من الموقع وقاعدة البيانات."
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
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'

const portfolioStore = usePortfolioStore()
const adminStore = useAdminStore()

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const testimonialsList = ref([])

// Delete state
const deleteConfirmOpen = ref(false)
const testiToDelete = ref(null)

const dialog = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const testiForm = ref(null)

const defaultForm = () => ({
  client_name: '',
  client_role: '',
  client_company: '',
  feedback_text: '',
  rating: 5,
  color: 'rgba(123,110,246,0.2)',
  sort_order: 1,
  is_published: true,
})

const form = ref(defaultForm())


async function fetchTestimonials() {
  loading.value = true
  try {
    const data = await adminService.getTestimonials()
    testimonialsList.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل آراء العملاء', 'error')
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

function openEditDialog(t) {
  isEditing.value = true
  editId.value = t.id
  form.value = {
    ...defaultForm(),
    ...t
  }
  dialog.value = true
}

async function saveTestimonial() {
  const { valid } = await testiForm.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEditing.value) {
      await adminService.updateTestimonial(editId.value, form.value)
      adminStore.notify('تم تحديث رأي العميل بنجاح!', 'success')
    } else {
      await adminService.createTestimonial(form.value)
      adminStore.notify('تمت إضافة الرأي بنجاح!', 'success')
    }
    dialog.value = false
    await fetchTestimonials()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ الرأي', 'error')
  } finally {
    saving.value = false
  }
}

function deleteTestimonial(t) {
  testiToDelete.value = t
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  if (!testiToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteTestimonial(testiToDelete.value.id)
    adminStore.notify('تم حذف الرأي بنجاح', 'info')
    deleteConfirmOpen.value = false
    testiToDelete.value = null
    await fetchTestimonials()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حذف الرأي', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchTestimonials()
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

.t-table-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; color: var(--primary); font-size: 0.88rem;
  border: 1px solid var(--border);
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
