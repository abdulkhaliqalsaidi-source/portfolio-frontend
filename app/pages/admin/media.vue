<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">مكتبة الوسائط والملفات</h1>
        <p class="page-subtitle">رفع الصور وملفات الـ PDF والوسائط ونسخ روابطها لاستخدامها في المشاريع والملف الشخصي.</p>
      </div>
      <div class="page-header-actions">
        <input type="file" ref="fileInputRef" class="d-none" @change="handleFileUpload" accept="image/*,.pdf" />
        <button class="btn btn-primary" :disabled="uploading" @click="openFileDialog">
          <v-progress-circular v-if="uploading" indeterminate size="18" width="2" />
          <v-icon v-else icon="mdi-cloud-upload-outline" size="18" />
          <span>رفع ملف جديد</span>
        </button>
      </div>
    </div>

    <!-- Drag & Drop Dropzone -->
    <div
      class="upload-dropzone mb-6 text-center"
      :class="{ dragging: isDragging }"
      @dragenter="handleDragEnter"
      @dragover.prevent
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="openFileDialog"
    >
      <v-icon icon="mdi-cloud-upload" size="48" color="#7B6EF6" class="mb-2" />
      <h3 class="font-weight-bold mb-1">اسحب الملفات هنا أو اضغط للاختيار من جهازك</h3>
      <p class="text-caption text-secondary">
        يدعم الصور (PNG, JPG, WebP, SVG) وملفات الـ PDF حتى 10MB
      </p>
    </div>

    <!-- Media Grid -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="!mediaFiles || mediaFiles.length === 0" class="text-center py-12">
        <v-icon icon="mdi-image-multiple-outline" size="56" color="rgba(255,255,255,0.2)" class="mb-3" />
        <h3 style="color:var(--t2)">لا توجد ملفات وسائط مرفوعة بعد</h3>
      </div>
      <div v-else class="media-grid">
        <div v-for="m in mediaFiles" :key="m.id" class="media-card">
          <div class="media-preview">
            <img
              v-if="isImage(m)"
              :src="m.file || m.file_url"
              :alt="m.title || m.original_name || 'صورة'"
              loading="lazy"
              @error="handleImgError"
            />
            <div v-else class="pdf-preview d-flex align-center justify-center">
              <v-icon icon="mdi-file-pdf-box" size="54" color="#EF4444" />
            </div>
          </div>
          <div class="media-info">
            <div class="media-name" :title="m.original_name || m.title">{{ m.original_name || m.title || 'ملف' }}</div>
            <div class="d-flex align-center justify-between mt-2">
              <span class="media-size">{{ formatBytes(m.file_size) }}</span>
              <div class="d-flex gap-1">
                <button class="mini-icon-btn" @click.stop="copyUrl(m.file || m.file_url)" title="نسخ الرابط"><v-icon icon="mdi-content-copy" size="14" /></button>
                <a :href="m.file || m.file_url" target="_blank" class="mini-icon-btn" title="معاينة" @click.stop><v-icon icon="mdi-open-in-new" size="14" /></a>
                <button class="mini-icon-btn text-error" @click.stop="deleteFile(m)" title="حذف"><v-icon icon="mdi-delete" size="14" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      title="تأكيد حذف الملف من المكتبة"
      :item-name="fileToDelete?.original_name || fileToDelete?.title"
      item-type="ملف وسائط"
      warning-text="تنبيه: سيتم حذف هذا الملف نهائياً من خادم الوسائط. إذا كان مستخدماً في أحد المشاريع أو الخدمات فقد لا تظهر صورته."
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
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'

const adminStore = useAdminStore()

const loading = ref(false)
const uploading = ref(false)
const deleting = ref(false)
const isDragging = ref(false)
const mediaFiles = ref([])
const fileInputRef = ref(null)
let dragCounter = 0

// Delete state
const deleteConfirmOpen = ref(false)
const fileToDelete = ref(null)

function openFileDialog() {
  fileInputRef.value?.click()
}

function handleImgError(e) {
  e.target.style.display = 'none'
  const parent = e.target.parentElement
  if (parent && !parent.querySelector('.img-fallback-icon')) {
    const icon = document.createElement('div')
    icon.className = 'img-fallback-icon d-flex align-center justify-center'
    icon.style.cssText = 'width:100%;height:100%;background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.3);'
    icon.innerHTML = '<span style="font-size:12px;">تعذر تحميل المعاينة</span>'
    parent.appendChild(icon)
  }
}

function isImage(m) {
  if (!m) return false
  if (m.file_type === 'image') return true
  const url = typeof m === 'string' ? m : (m.file || m.file_url)
  if (!url) return false
  return /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(url)
}

function formatBytes(bytes) {
  const b = Number(bytes)
  if (!b || isNaN(b) || b <= 0) return '0 B'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), sizes.length - 1)
  return (b / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

async function fetchMedia() {
  loading.value = true
  try {
    const data = await adminService.getMedia()
    mediaFiles.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    console.error('Error fetching media:', err)
    adminStore.notify(err.message || 'فشل تحميل مكتبة الوسائط', 'error')
  } finally {
    loading.value = false
  }
}

async function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (file) {
    await uploadFile(file)
    e.target.value = ''
  }
}

function handleDragEnter(e) {
  e.preventDefault()
  dragCounter++
  isDragging.value = true
}

function handleDragLeave(e) {
  e.preventDefault()
  dragCounter--
  if (dragCounter <= 0) {
    dragCounter = 0
    isDragging.value = false
  }
}

async function handleDrop(e) {
  e.preventDefault()
  dragCounter = 0
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) await uploadFile(file)
}

async function uploadFile(file) {
  uploading.value = true
  try {
    await adminService.uploadMedia(file, file.name)
    adminStore.notify('تم رفع الملف بنجاح!', 'success')
    await fetchMedia()
  } catch (err) {
    adminStore.notify(err.message || 'فشل رفع الملف', 'error')
  } finally {
    uploading.value = false
  }
}

async function copyUrl(url) {
  if (!url) return
  const fullUrl = url.startsWith('http') ? url : window.location.origin + url
  try {
    await navigator.clipboard.writeText(fullUrl)
    adminStore.notify('تم نسخ رابط الملف إلى الحافظة!', 'success')
  } catch {
    adminStore.notify(fullUrl, 'info')
  }
}

function deleteFile(m) {
  fileToDelete.value = m
  deleteConfirmOpen.value = true
}

async function executeDelete() {
  if (!fileToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteMedia(fileToDelete.value.id)
    adminStore.notify('تم حذف الملف بنجاح', 'info')
    mediaFiles.value = mediaFiles.value.filter(f => f.id !== fileToDelete.value.id)
    deleteConfirmOpen.value = false
    fileToDelete.value = null
  } catch (e) {
    adminStore.notify(e.message || 'فشل حذف الملف', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchMedia()
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

.upload-dropzone {
  background: rgba(59, 130, 246, 0.04);
  border: 2px dashed rgba(59, 130, 246, 0.3);
  border-radius: 18px;
  padding: 38px 24px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.upload-dropzone * {
  pointer-events: none;
}
.upload-dropzone:hover, .upload-dropzone.dragging {
  background: rgba(59, 130, 246, 0.08);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
}
.media-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
}
.media-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.media-preview {
  height: 145px;
  background: var(--bg-3);
  position: relative;
  overflow: hidden;
}
.media-preview img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.3s ease;
}
.media-card:hover .media-preview img {
  transform: scale(1.05);
}
.pdf-preview { width: 100%; height: 100%; background: rgba(239,68,68,0.08); }

.media-info { padding: 14px; }
.media-name {
  font-size: 0.84rem; font-weight: 800; color: var(--t1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 2px;
}
.media-size { font-size: 0.72rem; color: var(--t3); }

.mini-icon-btn {
  width: 28px; height: 28px; border-radius: 6px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  color: var(--t3); cursor: pointer;
  text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
}
.mini-icon-btn:hover { color: var(--t1); background: var(--bg-3); border-color: var(--primary); transform: translateY(-1px); }
</style>
