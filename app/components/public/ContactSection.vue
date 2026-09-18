<template>
  <section class="section" id="contact">
    <div class="container">

      <div class="contact-layout">

        <!-- Info & Channels Column -->
        <div class="contact-info-col anim-left">
          <div class="eyebrow">{{ isRtl ? (store.settings.contact_section_eyebrow || t('contact.eyebrow')) : t('contact.eyebrow') }}</div>
          <h2 class="s-title">{{ isRtl ? (store.settings.contact_section_title || t('contact.title')) : t('contact.title') }} <span class="g-text">{{ isRtl ? 'أو عملك القادم' : t('contact.titleHighlight') }}</span></h2>
          <p class="s-sub">{{ isRtl ? (store.settings.contact_section_sub || t('contact.sub')) : t('contact.sub') }}</p>

          <!-- Featured Direct Channels (Email & WhatsApp) -->
          <div class="primary-channels" v-if="primaryContacts.length">
            <a
              v-for="c in primaryContacts"
              :key="c.label"
              :href="c.href"
              target="_blank"
              class="primary-channel-card"
              :style="{ '--accent-c': c.color }"
            >
              <div class="channel-icon-wrap" :style="{ background: c.color + '15', color: c.color }">
                <v-icon :icon="c.icon" size="22" />
              </div>
              <div class="channel-meta">
                <span class="channel-label">{{ c.label }}</span>
                <span class="channel-val" :dir="c.isRtl ? 'rtl' : 'ltr'">{{ c.val }}</span>
              </div>
              <div class="channel-arrow">
                <v-icon icon="mdi-arrow-top-left" size="18" />
              </div>
            </a>
          </div>

          <!-- Social & Professional Networks Bento Grid -->
          <div class="social-channels-block" v-if="socialContacts.length">
            <div class="social-block-title">المنصات والشبكات المهنية</div>
            <div class="social-grid">
              <a
                v-for="s in socialContacts"
                :key="s.label"
                :href="s.href"
                target="_blank"
                class="social-chip-card"
                :title="s.label"
              >
                <div class="social-icon-box" :style="{ color: s.color }">
                  <v-icon :icon="s.icon" size="18" />
                </div>
                <div class="social-chip-info">
                  <span class="social-name">{{ s.label }}</span>
                  <span class="social-handle" dir="ltr">{{ s.handle }}</span>
                </div>
                <v-icon icon="mdi-open-in-new" size="14" class="social-external-icon" />
              </a>
            </div>
          </div>

          <!-- Live Availability Status -->
          <div class="avail-card" v-if="dev.available_for_work">
            <div class="avail-ring"><span class="avail-dot" /></div>
            <div class="avail-content">
              <div class="avail-title">متاح لاستقبال المشاريع والاستشارات</div>
              <div class="avail-sub">{{ dev.title ? `تنفيذ وإدارة أعمال متخصصة في ${dev.title}` : 'تنفيذ أعمال واستشارات احترافية بأعلى معايير الجودة' }}</div>
            </div>
          </div>
        </div>

        <!-- Direct Message Form Column -->
        <div class="contact-form-col anim-right">
          <div class="form-card">
            <div class="form-card-header">
              <div class="form-badge">
                <v-icon icon="mdi-message-draw" size="16" color="var(--primary)" class="ml-1" />
                <span>نموذج التواصل السريع</span>
              </div>
              <h3 class="form-title">إرسال رسالة مباشرة</h3>
              <p class="form-sub">سيتم استلام رسالتك والرد عليك خلال 24 ساعة كحد أقصى.</p>
            </div>

            <v-alert v-if="submitError" type="error" variant="tonal" class="mb-4" closable @click:close="submitError = null">
              {{ submitError }}
            </v-alert>

            <v-form ref="form" @submit.prevent="submit">
              <div class="field-row">
                <div class="field-wrap">
                  <label class="field-label">{{ t('contact.nameLabel') }}</label>
                  <v-text-field
                    v-model="f.sender_name"
                    :placeholder="t('contact.namePlaceholder')"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :rules="[v => !!v || 'الاسم مطلوب', v => (v && v.length >= 2) || 'الاسم يجب أن لا يقل عن حرفين']"
                  />
                </div>
                <div class="field-wrap">
                  <label class="field-label">{{ t('contact.emailLabel') }}</label>
                  <v-text-field
                    v-model="f.sender_email"
                    :placeholder="t('contact.emailPlaceholder')"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    dir="ltr"
                    :rules="[v => !!v || 'البريد مطلوب', v => /.+@.+\..+/.test(v) || 'يرجى إدخال بريد صحيح']"
                  />
                </div>
              </div>

              <div class="field-row">
                <div class="field-wrap">
                  <label class="field-label">{{ t('contact.subjectLabel') }}</label>
                  <v-text-field
                    v-model="f.subject"
                    :placeholder="t('contact.subjectPlaceholder')"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :rules="[v => !!v || 'الموضوع مطلوب']"
                  />
                </div>
                <div class="field-wrap">
                  <label class="field-label">{{ t('contact.phoneLabel') }}</label>
                  <v-text-field
                    v-model="f.sender_phone"
                    :placeholder="t('contact.phonePlaceholder')"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    dir="ltr"
                  />
                </div>
              </div>

              <div class="field-wrap mb-4">
                <label class="field-label">{{ t('contact.messageLabel') }}</label>
                <v-textarea
                  v-model="f.message"
                  :placeholder="t('contact.messagePlaceholder')"
                  variant="outlined"
                  rows="4"
                  color="primary"
                  :rules="[v => !!v || 'نص الرسالة مطلوب', v => (v && v.length >= 10) || 'يرجى كتابة 10 أحرف على الأقل']"
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 btn-lg submit-btn"
                :disabled="submitting"
              >
                <v-progress-circular v-if="submitting" indeterminate size="18" class="ml-2" />
                <v-icon v-else icon="mdi-send-outline" size="18" class="ml-2" />
                <span>{{ submitting ? t('contact.sending') : t('contact.sendBtn') }}</span>
              </button>
            </v-form>
          </div>
        </div>

      </div>
    </div>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snack" color="#10B981" location="bottom left" :timeout="4000">
      <div class="d-flex align-center gap-2">
        <v-icon icon="mdi-check-circle" size="20" color="#fff" />
        <span>{{ successMessage }}</span>
      </div>
    </v-snackbar>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useLocale } from '~/composables/useLocale'
import { useScrollReveal } from '~/composables/useScrollReveal'

const store = usePortfolioStore()
const { t, isRtl } = useLocale()
const dev = computed(() => store.developer || {})

useScrollReveal('.anim, .anim-left, .anim-right')

const form = ref(null)
const submitting = ref(false)
const snack = ref(false)
const submitError = ref(null)
const successMessage = computed(() => t('contact.successMsg'))

const f = ref({
  sender_name: '',
  sender_email: '',
  sender_phone: '',
  subject: '',
  message: ''
})

function cleanHandle(url) {
  if (!url) return ''
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

// 1. Primary direct channels (Email, WhatsApp)
const primaryContacts = computed(() => {
  const list = []
  if (dev.value.email) {
    list.push({
      label: 'البريد الإلكتروني',
      val: dev.value.email,
      href: `mailto:${dev.value.email}`,
      icon: 'mdi-email-outline',
      color: '#3B82F6',
      isRtl: false
    })
  }
  if (dev.value.phone || dev.value.whatsapp) {
    const rawNum = dev.value.whatsapp || dev.value.phone
    const cleanNum = String(rawNum).replace(/[^0-9]/g, '')
    list.push({
      label: 'محادثة WhatsApp مباشرة',
      val: dev.value.phone || dev.value.whatsapp,
      href: `https://wa.me/${cleanNum}`,
      icon: 'mdi-whatsapp',
      color: '#10B981',
      isRtl: false
    })
  }
  return list
})

// 2. Secondary & Social Networks
const socialContacts = computed(() => {
  const list = []
  if (dev.value.linkedin) {
    list.push({ label: 'LinkedIn', handle: cleanHandle(dev.value.linkedin), href: dev.value.linkedin, icon: 'mdi-linkedin', color: '#0A66C2' })
  }
  if (dev.value.behance) {
    list.push({ label: 'Behance', handle: cleanHandle(dev.value.behance), href: dev.value.behance, icon: 'mdi-behance', color: '#0057FF' })
  }
  if (dev.value.dribbble) {
    list.push({ label: 'Dribbble', handle: cleanHandle(dev.value.dribbble), href: dev.value.dribbble, icon: 'mdi-dribbble', color: '#EA4C89' })
  }
  if (dev.value.github) {
    list.push({ label: 'GitHub', handle: cleanHandle(dev.value.github), href: dev.value.github, icon: 'mdi-github', color: '#94A3B8' })
  }
  if (dev.value.instagram) {
    list.push({ label: 'Instagram', handle: cleanHandle(dev.value.instagram), href: dev.value.instagram, icon: 'mdi-instagram', color: '#E1306C' })
  }
  if (dev.value.twitter) {
    list.push({ label: 'منصة X', handle: cleanHandle(dev.value.twitter), href: dev.value.twitter, icon: 'mdi-twitter', color: '#CBD5E1' })
  }
  if (dev.value.youtube) {
    list.push({ label: 'YouTube', handle: cleanHandle(dev.value.youtube), href: dev.value.youtube, icon: 'mdi-youtube', color: '#EF4444' })
  }
  if (dev.value.website) {
    list.push({ label: 'الموقع الشخصي', handle: cleanHandle(dev.value.website), href: dev.value.website, icon: 'mdi-web', color: '#8B5CF6' })
  }
  return list
})

async function submit() {
  submitError.value = null
  const { valid } = await form.value.validate()
  if (!valid) return

  submitting.value = true
  try {
    const res = await store.submitContact({
      sender_name: f.value.sender_name,
      sender_email: f.value.sender_email,
      sender_phone: f.value.sender_phone,
      subject: f.value.subject,
      message: f.value.message
    })

    if (res?.message) {
      successMessage.value = res.message
    }
    snack.value = true
    f.value = { sender_name: '', sender_email: '', sender_phone: '', subject: '', message: '' }
    form.value.reset()
  } catch (err) {
    submitError.value = err.message || 'تعذر إرسال الرسالة، يرجى المحاولة مرة أخرى أو التواصل عبر البريد/الواتساب.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: minmax(320px, 440px) 1fr;
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
}

.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Primary Direct Channels */
.primary-channels {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.primary-channel-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.4);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.primary-channel-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: var(--accent-c, var(--primary));
  opacity: 0;
  transition: opacity 0.25s ease;
}

.primary-channel-card:hover {
  border-color: var(--accent-c, rgba(59, 130, 246, 0.5));
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.6), 0 0 25px var(--accent-c, rgba(59, 130, 246, 0.2));
}

.primary-channel-card:hover::before {
  opacity: 1;
}

.channel-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.2);
  transition: transform 0.3s ease;
}

.primary-channel-card:hover .channel-icon-wrap {
  transform: scale(1.1) rotate(5deg);
}

.channel-meta {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  text-align: right;
}

.channel-label {
  font-size: 0.78rem;
  color: #94A3B8;
  font-weight: 600;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.channel-val {
  font-size: 0.96rem;
  color: #FFFFFF;
  font-weight: 800;
  font-family: var(--f-display, 'Tajawal', sans-serif);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

.channel-arrow {
  color: #64748B;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.primary-channel-card:hover .channel-arrow {
  transform: translate(-3px, -3px);
  color: var(--accent-c, #FFFFFF);
}

/* Social & Professional Networks Block */
.social-channels-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 6px;
}

.social-block-title {
  font-size: 0.84rem;
  font-weight: 800;
  color: #94A3B8;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.social-chip-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 0;
}

.social-chip-card:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.4);
}

.social-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.social-chip-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  text-align: right;
}

.social-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #F1F5F9;
  font-family: var(--f-body, 'Cairo', sans-serif);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.social-handle {
  font-size: 0.72rem;
  color: #94A3B8;
  font-family: var(--f-mono, 'Tajawal', sans-serif);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.social-external-icon {
  color: #64748B;
  opacity: 0.6;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.social-chip-card:hover .social-external-icon {
  opacity: 1;
  color: #38BDF8;
  transform: translate(-2px, -2px);
}

/* Availability Badge */
.avail-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 20px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.15);
  margin-top: 6px;
}

.avail-ring {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avail-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 10px #10B981;
  animation: pulse-dot 2s infinite;
}

.avail-content {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.avail-title {
  font-size: 0.88rem;
  font-weight: 800;
  color: #34D399;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.avail-sub {
  font-size: 0.78rem;
  color: #CBD5E1;
  margin-top: 2px;
  line-height: 1.5;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

/* Form Column */
.form-card {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: clamp(26px, 4vw, 44px);
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.35s ease;
}

.form-card:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.75), 0 0 30px rgba(59, 130, 246, 0.12);
}

.form-card-header {
  margin-bottom: 26px;
  text-align: right;
}

.form-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.76rem;
  font-weight: 800;
  color: #38BDF8;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 12px;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.form-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: clamp(1.3rem, 2.2vw, 1.65rem);
  font-weight: 900;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.form-sub {
  font-size: 0.88rem;
  color: #94A3B8;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field-wrap {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 0.84rem;
  font-weight: 700;
  color: #CBD5E1;
  margin-bottom: 6px;
  text-align: right;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.submit-btn {
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 800;
  padding: 16px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563EB, #3B82F6) !important;
  color: #FFFFFF !important;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.7);
}

@keyframes pulse-dot {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

/* Light Theme Overrides */
[data-theme="light"] .primary-channel-card,
[data-theme="light"] .social-chip-card,
[data-theme="light"] .form-card {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
}

[data-theme="light"] .channel-val,
[data-theme="light"] .social-name,
[data-theme="light"] .form-title {
  color: #0F172A;
}

[data-theme="light"] .channel-label,
[data-theme="light"] .form-sub,
[data-theme="light"] .field-label {
  color: #475569;
}

[data-theme="light"] .social-handle {
  color: #64748B;
}

[data-theme="light"] .social-icon-box {
  background: #F1F5F9;
}

[data-theme="light"] .avail-card {
  background: #F0FDF4;
  border-color: #BBF7D0;
}

[data-theme="light"] .avail-sub {
  color: #334155;
}

@media (max-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 600px) {
  .field-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .social-grid {
    grid-template-columns: 1fr;
  }
}
</style>
