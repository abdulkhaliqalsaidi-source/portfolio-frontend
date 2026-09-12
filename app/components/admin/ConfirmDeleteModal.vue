<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="480"
    persistent
    transition="dialog-transition"
  >
    <div class="enterprise-modal" dir="rtl">
      <!-- Top Close Button -->
      <button
        type="button"
        class="modal-close-btn"
        :disabled="loading"
        @click="handleCancel"
        title="إغلاق"
      >
        <v-icon icon="mdi-close" size="18" />
      </button>

      <div class="modal-body-wrap">
        <!-- Header: Icon & Titles -->
        <div class="modal-header-row">
          <div class="danger-badge-icon">
            <v-icon :icon="icon" size="22" color="#EF4444" />
          </div>

          <div class="modal-title-group">
            <h3 class="modal-main-title">{{ title || 'تأكيد عملية الحذف' }}</h3>
            <p class="modal-sub-title">
              {{ subtitle || 'يرجى التأكد قبل المتابعة، هذه العملية تتطلب تأكيدك الصريح.' }}
            </p>
          </div>
        </div>

        <!-- Item Target Box -->
        <div class="target-item-card" v-if="itemName">
          <div class="target-type-pill" v-if="itemType">
            {{ itemType }}
          </div>
          <div class="target-name-val" :title="itemName">
            {{ itemName }}
          </div>
        </div>

        <!-- Warning Callout -->
        <div class="danger-callout">
          <div class="callout-icon-col">
            <v-icon icon="mdi-alert-circle-outline" size="16" color="#F87171" />
          </div>
          <div class="callout-text-col">
            <span>{{ warningText || 'تنبيه: هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم مسح العنصر وكافة البيانات التابعة له بشكل دائم من النظام.' }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Actions (Enterprise Layout) -->
      <div class="modal-footer-bar">
        <button
          type="button"
          class="btn-action-cancel"
          :disabled="loading"
          @click="handleCancel"
        >
          <span>{{ cancelText || 'إلغاء' }}</span>
        </button>

        <button
          type="button"
          class="btn-action-danger"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          <v-progress-circular v-if="loading" indeterminate size="16" width="2" color="#fff" class="ml-2" />
          <v-icon v-else icon="mdi-delete" size="16" class="ml-1" />
          <span>{{ confirmText || 'نعم، احذف نهائياً' }}</span>
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'تأكيد عملية الحذف'
  },
  subtitle: {
    type: String,
    default: 'يرجى التأكد قبل المتابعة، هذه العملية تتطلب تأكيدك الصريح.'
  },
  itemName: {
    type: String,
    default: ''
  },
  itemType: {
    type: String,
    default: ''
  },
  warningText: {
    type: String,
    default: 'تنبيه: هذا الإجراء نهائي ولا يمكن التراجع عنه. سيتم مسح العنصر وكافة البيانات التابعة له بشكل دائم من النظام.'
  },
  confirmText: {
    type: String,
    default: 'نعم، احذف نهائياً'
  },
  cancelText: {
    type: String,
    default: 'إلغاء'
  },
  icon: {
    type: String,
    default: 'mdi-alert-octagon-outline'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<style scoped>
/* ═════════════════════════════════════════════════════════════════════════
   ENTERPRISE DESTRUCTIVE MODAL (Linear / Vercel / GitHub UI Standards)
   ═════════════════════════════════════════════════════════════════════════ */
.enterprise-modal {
  position: relative;
  background: #0F172A;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 20px 50px -12px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  font-family: var(--f-body, 'Cairo', system-ui, sans-serif);
  color: #F8FAFC;
}

/* Close Button */
.modal-close-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 10;
}

.modal-close-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}

/* Inner Body Wrap */
.modal-body-wrap {
  padding: 24px 24px 20px;
}

/* Header Row */
.modal-header-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding-left: 28px; /* space for close button */
}

.danger-badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title-group {
  flex: 1;
  min-width: 0;
}

.modal-main-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.18rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 4px;
  line-height: 1.35;
}

.modal-sub-title {
  font-size: 0.83rem;
  color: #94A3B8;
  margin: 0;
  line-height: 1.45;
}

/* Target Item Box */
.target-item-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 16px;
}

.target-type-pill {
  font-size: 0.72rem;
  font-weight: 700;
  color: #F87171;
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.25);
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

.target-name-val {
  font-size: 0.9rem;
  font-weight: 700;
  color: #F1F5F9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-family: var(--f-mono, monospace, sans-serif);
  direction: ltr;
  text-align: right;
}

/* Callout Notice */
.danger-callout {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.8rem;
  color: #FECACA;
  line-height: 1.5;
}

.callout-icon-col {
  flex-shrink: 0;
  margin-top: 1px;
}

.callout-text-col {
  flex: 1;
}

/* Footer Bar */
.modal-footer-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.25);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-action-cancel {
  height: 38px;
  padding: 0 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #CBD5E1;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.btn-action-cancel:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-action-danger {
  height: 38px;
  padding: 0 20px;
  background: #DC2626;
  border: 1px solid #EF4444;
  border-radius: 10px;
  color: #FFFFFF;
  font-size: 0.86rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px -2px rgba(220, 38, 38, 0.45);
  transition: all 0.15s ease;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.btn-action-danger:hover:not(:disabled) {
  background: #B91C1C;
  border-color: #DC2626;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px -2px rgba(220, 38, 38, 0.6);
}

.btn-action-danger:active:not(:disabled) {
  transform: translateY(0);
}

.btn-action-cancel:disabled,
.btn-action-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ═════════════════════════════════════════════════════════════════════════
   LIGHT THEME SUPPORT
   ═════════════════════════════════════════════════════════════════════════ */
[data-theme="light"] .enterprise-modal {
  background: #FFFFFF;
  border-color: #E2E8F0;
  box-shadow: 
    0 20px 50px -12px rgba(15, 23, 42, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.06);
  color: #0F172A;
}

[data-theme="light"] .modal-close-btn {
  background: #F1F5F9;
  border-color: #E2E8F0;
  color: #64748B;
}

[data-theme="light"] .modal-close-btn:hover:not(:disabled) {
  background: #E2E8F0;
  color: #0F172A;
}

[data-theme="light"] .modal-main-title {
  color: #0F172A;
}

[data-theme="light"] .modal-sub-title {
  color: #64748B;
}

[data-theme="light"] .target-item-card {
  background: #F8FAFC;
  border-color: #E2E8F0;
}

[data-theme="light"] .target-name-val {
  color: #0F172A;
}

[data-theme="light"] .danger-callout {
  background: #FEF2F2;
  border-color: #FECACA;
  color: #991B1B;
}

[data-theme="light"] .modal-footer-bar {
  background: #F8FAFC;
  border-top-color: #E2E8F0;
}

[data-theme="light"] .btn-action-cancel {
  background: #FFFFFF;
  border-color: #CBD5E1;
  color: #475569;
}

[data-theme="light"] .btn-action-cancel:hover:not(:disabled) {
  background: #F1F5F9;
  color: #0F172A;
}
</style>
