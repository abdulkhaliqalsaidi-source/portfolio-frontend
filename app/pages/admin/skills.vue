<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة المهارات والأدوات المهنية</h1>
        <p class="page-subtitle">إدارة مجموعات المهارات والتصنيفات وإضافة أدوات العمل ونسب الإتقان لأي تخصص.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-ghost" @click="openCategoryDialog">
          <v-icon icon="mdi-folder-plus-outline" size="18" />
          <span>إضافة تصنيف</span>
        </button>
        <button class="btn btn-primary" @click="openSkillDialog">
          <v-icon icon="mdi-plus" size="18" />
          <span>إضافة مهارة جديدة</span>
        </button>
      </div>
    </div>

    <!-- Categories and Skills display -->
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else class="categories-container">
      <div v-for="cat in categories" :key="cat.id" class="admin-card mb-6">
        <!-- Category Header with Clean Space-Between Alignment -->
        <div class="cat-header">
          <div class="cat-info-wrap">
            <div class="cat-icon-badge">
              <v-icon :icon="cat.icon || 'mdi-folder-outline'" color="primary" size="20" />
            </div>
            <div>
              <h3 class="cat-title">{{ cat.name }}</h3>
              <span class="cat-count">
                {{ (cat.skills || []).length }} مهارات مضافة
              </span>
            </div>
          </div>

          <!-- Category Actions (Edit & Delete on the Left) -->
          <div class="cat-actions-wrap">
            <button class="table-action-icon edit" @click="editCategory(cat)" title="تعديل التصنيف">
              <v-icon icon="mdi-pencil-outline" size="16" />
            </button>
            <button class="table-action-icon delete" @click="deleteCategory(cat)" title="حذف التصنيف">
              <v-icon icon="mdi-delete-outline" size="16" />
            </button>
          </div>
        </div>

        <!-- Skills Grid inside Category -->
        <div v-if="cat.skills?.length" class="skills-grid">
          <div v-for="s in cat.skills" :key="s.id" class="skill-admin-card" :style="{ '--sc': s.color || '#7B6EF6' }">
            <!-- Top Header Row -->
            <div class="skill-card-top mb-3">
              <div class="skill-main-info">
                <div class="skill-icon-pill" :style="{ background: s.color ? `color-mix(in srgb, ${s.color} 15%, transparent)` : 'rgba(123,110,246,0.14)' }">
                  <v-icon :icon="s.icon || 'mdi-code-tags'" :color="s.color || '#7B6EF6'" size="18" />
                </div>
                <div class="skill-name-wrap">
                  <span class="skill-name" :title="s.name">{{ s.name }}</span>
                </div>
              </div>
              <span class="skill-pct-badge" :style="{ color: s.color || '#7B6EF6', background: s.color ? `color-mix(in srgb, ${s.color} 12%, transparent)` : 'rgba(123,110,246,0.12)' }">
                {{ s.proficiency_percentage }}%
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="skill-bar-wrap mb-3">
              <div class="skill-bar-fill" :style="{ width: s.proficiency_percentage + '%', background: s.color || '#7B6EF6' }" />
            </div>

            <!-- Footer: Status Pill & Actions -->
            <div class="skill-card-footer">
              <span class="skill-status-tag" :class="s.is_visible ? 'status-visible' : 'status-hidden'">
                <span class="status-dot"></span>
                <span>{{ s.is_visible ? 'ظاهرة' : 'مخفية' }}</span>
              </span>
              <div class="d-flex align-center gap-1">
                <button class="mini-icon-btn edit" @click="editSkill(s)" title="تعديل المهارة">
                  <v-icon icon="mdi-pencil-outline" size="14" />
                </button>
                <button class="mini-icon-btn delete" @click="deleteSkill(s)" title="حذف المهارة">
                  <v-icon icon="mdi-delete-outline" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6">
          <v-icon icon="mdi-code-tags" size="32" color="primary" class="mb-2 opacity-50" />
          <p class="text-caption text-secondary">لا توجد مهارات مضافة في هذا التصنيف بعد.</p>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <v-dialog v-model="categoryDialog" max-width="450" scrollable>
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="isEditingCat ? 'mdi-pencil-box-outline' : 'mdi-folder-plus-outline'" color="primary" />
            <span>{{ isEditingCat ? 'تعديل تصنيف المهارات' : 'إضافة تصنيف مهارات جديد' }}</span>
          </div>
          <button class="close-btn" @click="categoryDialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="catForm">
            <div class="mb-4">
              <label class="field-label">اسم التصنيف *</label>
              <v-text-field
                v-model="categoryFormData.name"
                placeholder="مثال: الإدارة والقيادة أو التصميم الإبداعي أو التحليل المالي"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'اسم التصنيف مطلوب']"
              />
            </div>
            <div class="mb-4">
              <label class="field-label">أيقونة التصنيف (MDI Icon)</label>
              <v-text-field
                v-model="categoryFormData.icon"
                placeholder="mdi-folder-star-outline"
                variant="outlined"
                density="comfortable"
              />
            </div>
            <div>
              <label class="field-label">الترتيب</label>
              <v-text-field
                v-model.number="categoryFormData.sort_order"
                type="number"
                variant="outlined"
                density="comfortable"
              />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn variant="text" @click="categoryDialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveCategory">
            {{ isEditingCat ? 'حفظ التعديلات' : 'إضافة التصنيف' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Skill Modal -->
    <v-dialog v-model="skillDialog" max-width="480" scrollable>
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="isEditingSkill ? 'mdi-pencil-box-outline' : 'mdi-star-plus-outline'" color="primary" />
            <span>{{ isEditingSkill ? 'تعديل مهارة: ' + skillForm.name : 'إضافة مهارة جديدة' }}</span>
          </div>
          <button class="close-btn" @click="skillDialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="skillFormRef">
            <div class="mb-4">
              <label class="field-label">التصنيف التابع له *</label>
              <v-select
                v-model="skillForm.category"
                :items="categories"
                item-title="name"
                item-value="id"
                placeholder="اختر التصنيف"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'التصنيف مطلوب']"
              />
            </div>
            <div class="mb-4">
              <label class="field-label">اسم المهارة / الأداة *</label>
              <v-text-field
                v-model="skillForm.name"
                placeholder="مثال: إدارة المشاريع أو Adobe Photoshop أو التحليل المالي"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'اسم المهارة مطلوب']"
              />
            </div>
            <div class="mb-4">
              <label class="field-label">الأيقونة (MDI)</label>
              <v-text-field
                v-model="skillForm.icon"
                placeholder="mdi-star-four-points-outline"
                variant="outlined"
                density="comfortable"
              />
            </div>
            <div class="mb-4">
              <ColorPickerInput
                v-model="skillForm.color"
                label="اللون التمييزي (Hex Code)"
              />
            </div>
            <div class="d-flex gap-4">
              <div class="flex-grow-1">
                <label class="field-label">نسبة الإتقان (%)</label>
                <v-text-field v-model.number="skillForm.proficiency_percentage" type="number" variant="outlined" density="compact" hide-details />
              </div>
              <div style="width: 100px">
                <label class="field-label">الترتيب</label>
                <v-text-field v-model.number="skillForm.sort_order" type="number" variant="outlined" density="compact" hide-details />
              </div>
            </div>
            <div class="mt-4">
              <v-switch v-model="skillForm.is_visible" color="success" label="ظاهرة في الموقع" hide-details />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn variant="text" @click="skillDialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveSkill">
            {{ isEditingSkill ? 'حفظ التعديلات' : 'إضافة المهارة' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      :title="deleteType === 'category' ? 'تأكيد حذف تصنيف المهارات' : 'تأكيد حذف المهارة'"
      :item-name="itemToDelete?.name"
      :item-type="deleteType === 'category' ? 'تصنيف مهارات' : 'مهارة برمجية'"
      :warning-text="deleteType === 'category' ? 'تنبيه: سيتم حذف هذا التصنيف وكافة المهارات المندرجة تحته نهائياً من قاعدة البيانات.' : 'تنبيه: سيتم حذف هذه المهارة ومؤشر إتقانها نهائياً.'"
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
const categories = ref([])

// Delete state
const deleteConfirmOpen = ref(false)
const itemToDelete = ref(null)
const deleteType = ref('') // 'category' or 'skill'

const categoryDialog = ref(false)
const isEditingCat = ref(false)
const editCatId = ref(null)
const catForm = ref(null)
const categoryFormData = ref({ name: '', icon: 'mdi-folder-star-outline', sort_order: 0 })

const skillDialog = ref(false)
const isEditingSkill = ref(false)
const editSkillId = ref(null)
const skillFormRef = ref(null)
const skillForm = ref({
  category: null,
  name: '',
  icon: 'mdi-code-tags',
  color: '#7B6EF6',
  proficiency_percentage: 85,
  sort_order: 0,
  is_visible: true
})

async function fetchCategories() {
  loading.value = true
  try {
    const data = await adminService.getSkillCategories()
    categories.value = Array.isArray(data) ? data : (data.results || [])
  } catch (e) {
    adminStore.notify('فشل تحميل التصنيفات', 'error')
  } finally {
    loading.value = false
  }
}

function openCategoryDialog() {
  isEditingCat.value = false
  editCatId.value = null
  categoryFormData.value = { name: '', icon: 'mdi-code-braces', sort_order: 0 }
  categoryDialog.value = true
}

function editCategory(cat) {
  isEditingCat.value = true
  editCatId.value = cat.id
  categoryFormData.value = { name: cat.name, icon: cat.icon, sort_order: cat.sort_order }
  categoryDialog.value = true
}

async function saveCategory() {
  const { valid } = await catForm.value.validate()
  if (!valid) return
  saving.value = true
  try {
    if (isEditingCat.value) {
      await adminService.updateSkillCategory(editCatId.value, categoryFormData.value)
      adminStore.notify('تم تحديث التصنيف بنجاح', 'success')
    } else {
      await adminService.createSkillCategory(categoryFormData.value)
      adminStore.notify('تمت إضافة التصنيف بنجاح', 'success')
    }
    categoryDialog.value = false
    await fetchCategories()
    await portfolioStore.fetchPublicContent()
  } catch (e) {
    adminStore.notify(e.message || 'فشل حفظ التصنيف', 'error')
  } finally {
    saving.value = false
  }
}

function deleteCategory(cat) {
  itemToDelete.value = cat
  deleteType.value = 'category'
  deleteConfirmOpen.value = true
}

function deleteSkill(s) {
  itemToDelete.value = s
  deleteType.value = 'skill'
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    if (deleteType.value === 'category') {
      await adminService.deleteSkillCategory(itemToDelete.value.id)
      adminStore.notify('تم حذف التصنيف وكافة مهاراته بنجاح', 'info')
    } else {
      await adminService.deleteSkill(itemToDelete.value.id)
      adminStore.notify('تم حذف المهارة بنجاح', 'info')
    }
    deleteConfirmOpen.value = false
    itemToDelete.value = null
    await fetchCategories()
    await portfolioStore.fetchPublicContent()
  } catch (e) {
    adminStore.notify(e.message || 'فشل تنفيذ عملية الحذف', 'error')
  } finally {
    deleting.value = false
  }
}

function openSkillDialog() {
  isEditingSkill.value = false
  editSkillId.value = null
  skillForm.value = {
    category: categories.value[0]?.id || null,
    name: '',
    icon: 'mdi-code-tags',
    color: '#7B6EF6',
    proficiency_percentage: 85,
    sort_order: 0,
    is_visible: true
  }
  skillDialog.value = true
}

function editSkill(s) {
  isEditingSkill.value = true
  editSkillId.value = s.id
  skillForm.value = {
    category: s.category,
    name: s.name,
    icon: s.icon,
    color: s.color,
    proficiency_percentage: s.proficiency_percentage,
    sort_order: s.sort_order,
    is_visible: s.is_visible
  }
  skillDialog.value = true
}

async function saveSkill() {
  const { valid } = await skillFormRef.value.validate()
  if (!valid) return
  saving.value = true
  try {
    if (isEditingSkill.value) {
      await adminService.updateSkill(editSkillId.value, skillForm.value)
      adminStore.notify('تم تحديث المهارة بنجاح', 'success')
    } else {
      await adminService.createSkill(skillForm.value)
      adminStore.notify('تمت إضافة المهارة بنجاح', 'success')
    }
    skillDialog.value = false
    await fetchCategories()
    await portfolioStore.fetchPublicContent()
  } catch (e) {
    adminStore.notify(e.message || 'فشل حفظ المهارة', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.admin-page { max-width: 1300px; margin: 0 auto; }

.admin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 24px;
}

/* Category Header Layout */
.cat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 16px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--border);
  gap: 16px;
}
.cat-info-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.cat-icon-badge {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(123,110,246,0.12);
  border: 1px solid rgba(123,110,246,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cat-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--t1);
  line-height: 1.3;
  margin-bottom: 2px;
}
.cat-count {
  font-size: 0.75rem;
  color: var(--t3);
  display: block;
}

.cat-actions-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.table-action-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--t2);
  cursor: pointer;
  transition: all 0.2s ease;
}
.table-action-icon:hover {
  color: var(--t1);
  background: var(--bg-3);
  border-color: var(--primary);
  transform: translateY(-2px);
}
.table-action-icon.edit:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: rgba(59, 130, 246, 0.1);
}
.table-action-icon.delete:hover {
  color: #EF4444;
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.1);
}

/* Skills Grid inside Category */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.skill-admin-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px 18px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}
.skill-admin-card:hover {
  border-color: var(--primary);
  background: var(--bg-3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.25);
}

.skill-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.skill-main-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0; /* Prevents flex child from overflowing */
}

.skill-icon-pill {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.skill-name-wrap {
  flex: 1;
  min-width: 0;
}

.skill-name {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--t1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  line-height: 1.3;
}

.skill-pct-badge {
  font-size: 0.78rem;
  font-weight: 900;
  font-family: var(--f-display, 'Tajawal', sans-serif);
  padding: 3px 8px;
  border-radius: 8px;
  flex-shrink: 0;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

.skill-bar-wrap {
  height: 6px;
  background: var(--bg-3);
  border-radius: 4px;
  overflow: hidden;
}
.skill-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.skill-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: auto;
  border-top: 1px solid var(--border);
  gap: 8px;
}

.skill-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}

.skill-status-tag.status-visible {
  background: rgba(16, 185, 129, 0.12);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.skill-status-tag.status-hidden {
  background: rgba(148, 163, 184, 0.1);
  color: #94A3B8;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.mini-icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.mini-icon-btn:hover {
  color: var(--t1);
  background: var(--bg-3);
}
.mini-icon-btn.edit:hover {
  color: var(--primary);
  border-color: rgba(123, 110, 246, 0.3);
  background: rgba(123, 110, 246, 0.1);
}
.mini-icon-btn.delete:hover {
  color: #EF4444;
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
}

.field-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--t2);
  margin-bottom: 6px;
  display: block;
}
</style>
