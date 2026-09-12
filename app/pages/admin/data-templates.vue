<template>
  <div class="admin-page" dir="rtl">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-info">
        <div class="header-badge-row">
          <div class="header-icon-badge">
            <v-icon icon="mdi-database-import-outline" color="#7B6EF6" size="22" />
          </div>
          <h1 class="page-title">قوالب بيانات الموقع (Data Templates)</h1>
        </div>
        <p class="page-subtitle">
          تصدير قالب JSON شامل لتعبئة بيانات البورتفوليو خارجياً، أو فحص واستيراد ملف JSON جاهز مع التحقق المسبق (Dry Run) وحفظ العمليات في قاعدة البيانات.
        </p>
      </div>

      <div class="page-header-actions">
        <button class="btn btn-ghost" @click="activeTab = 'history'; store.fetchHistory()">
          <v-icon icon="mdi-history" size="18" class="ml-1" />
          <span>سجل الاستيراد</span>
          <span class="history-badge" v-if="store.historyList.length">{{ store.historyList.length }}</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs (Export / Import / History) -->
    <div class="template-tabs-bar mb-6">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'export' }"
        @click="activeTab = 'export'"
      >
        <v-icon icon="mdi-cloud-download-outline" size="18" class="ml-2" />
        <span>تصدير قالب البيانات (Export Template)</span>
      </button>

      <button
        class="tab-btn"
        :class="{ active: activeTab === 'import' }"
        @click="activeTab = 'import'"
      >
        <v-icon icon="mdi-cloud-upload-outline" size="18" class="ml-2" />
        <span>استيراد ومعاينة البيانات (Import Data)</span>
      </button>

      <button
        class="tab-btn"
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'; store.fetchHistory()"
      >
        <v-icon icon="mdi-clipboard-text-clock-outline" size="18" class="ml-2" />
        <span>سجل العمليات (History Logs)</span>
      </button>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════════════
         TAB 1: EXPORT TEMPLATE
         ═════════════════════════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'export'" class="tab-content-fade">
      <v-row>
        <!-- Entities Selection Card (Right in RTL) -->
        <v-col cols="12" lg="8" md="12">
          <div class="admin-card mb-6">
            <div class="card-header-flex mb-4">
              <div>
                <h3 class="card-section-title mb-1 border-0 pb-0">اختيار الأقسام والكيانات للتصدير</h3>
                <p class="section-desc">حدد الأقسام التي ترغب في تضمينها داخل ملف الـ JSON المصدّر.</p>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-ghost btn-sm" @click="selectAllEntities">تحديد الكل</button>
                <button class="btn btn-ghost btn-sm" @click="clearAllEntities">إلغاء التحديد</button>
              </div>
            </div>

            <!-- Entities Grid Checkboxes -->
            <div class="entities-grid">
              <div
                v-for="ent in availableEntities"
                :key="ent.key"
                class="entity-checkbox-card"
                :class="{ checked: selectedEntities.includes(ent.key) }"
                @click="toggleEntity(ent.key)"
              >
                <div class="d-flex align-center gap-3">
                  <div class="custom-chk" :class="{ active: selectedEntities.includes(ent.key) }">
                    <v-icon v-if="selectedEntities.includes(ent.key)" icon="mdi-check" size="14" color="#fff" />
                  </div>
                  <div class="ent-icon-wrap" :style="{ '--icon-col': ent.color }">
                    <v-icon :icon="ent.icon" size="20" />
                  </div>
                  <div class="flex-1">
                    <div class="ent-title">{{ ent.title }}</div>
                    <div class="ent-desc">{{ ent.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Export Options & Action (Left in RTL) -->
        <v-col cols="12" lg="4" md="12">
          <div class="admin-card mb-6">
            <h3 class="card-section-title">خيارات محتوى القالب</h3>

            <div class="export-type-radio mb-4">
              <label class="radio-option-card" :class="{ active: exportType === 'live' }" @click="exportType = 'live'">
                <div class="d-flex align-start gap-3">
                  <div class="custom-radio" :class="{ active: exportType === 'live' }">
                    <div class="radio-dot" v-if="exportType === 'live'" />
                  </div>
                  <div>
                    <div class="radio-title">تصدير البيانات الحالية</div>
                    <div class="radio-desc">نسخة مطابقة للبيانات المسجلة بقاعدة البيانات الآن.</div>
                  </div>
                </div>
              </label>

              <label class="radio-option-card mt-3" :class="{ active: exportType === 'examples' }" @click="exportType = 'examples'">
                <div class="d-flex align-start gap-3">
                  <div class="custom-radio" :class="{ active: exportType === 'examples' }">
                    <div class="radio-dot" v-if="exportType === 'examples'" />
                  </div>
                  <div>
                    <div class="radio-title">قالب مع أمثلة توضيحية</div>
                    <div class="radio-desc">قالب منظم يحتوي على أمثلة شارحة لطريقة تعبئة الحقول.</div>
                  </div>
                </div>
              </label>
            </div>

            <!-- Export Summary Box -->
            <div class="export-summary-box mb-4">
              <div class="summary-row">
                <span>الكيانات المختارة:</span>
                <span class="val-pill">{{ selectedEntities.length }} من {{ availableEntities.length }}</span>
              </div>
              <div class="summary-row">
                <span>صيغة الملف:</span>
                <span class="val-mono text-cyan">JSON (.json)</span>
              </div>
              <div class="summary-row">
                <span>إصدار الـ Schema:</span>
                <span class="val-mono text-purple">v1.0.0</span>
              </div>
            </div>

            <button
              class="btn-primary-action w-100"
              :disabled="selectedEntities.length === 0 || exporting"
              @click="handleExportDownload"
            >
              <v-progress-circular v-if="exporting" indeterminate size="18" class="ml-2" color="#fff" />
              <v-icon v-else icon="mdi-download" size="18" class="ml-2" />
              <span>{{ exporting ? 'جاري تجهيز القالب...' : 'تصدير وتحميل ملف الـ JSON' }}</span>
            </button>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════════════
         TAB 2: IMPORT & DRY RUN PREVIEW
         ═════════════════════════════════════════════════════════════════════════ -->
    <!-- ═════════════════════════════════════════════════════════════════════════
         TAB 2: IMPORT & DRY RUN PREVIEW (WITH JSON EDITOR & AUTO FIX)
         ═════════════════════════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'import'" class="tab-content-fade">
      <!-- Input Method Toggle (Upload File vs JSON Editor) -->
      <div class="input-method-switch mb-4">
        <button
          type="button"
          class="im-btn"
          :class="{ active: inputMethod === 'file' }"
          @click="inputMethod = 'file'"
        >
          <v-icon icon="mdi-cloud-upload-outline" size="18" class="ml-1" />
          <span>رفع ملف JSON من جهازك</span>
          <span class="file-loaded-pill" v-if="store.selectedFile && !store.fileError">
            <v-icon icon="mdi-check" size="12" />
            {{ store.selectedFile.name }}
          </span>
        </button>

        <button
          type="button"
          class="im-btn"
          :class="{ active: inputMethod === 'editor' }"
          @click="inputMethod = 'editor'"
        >
          <v-icon icon="mdi-code-json" size="18" color="#38BDF8" class="ml-1" />
          <span>محرر وتعديل كود الـ JSON التفاعلي</span>
          <span class="editor-indicator-badge" v-if="store.rawJsonText">
            <span class="pulse-dot" />
            محتوى جاهز للتعديل
          </span>
        </button>
      </div>

      <v-row>
        <!-- Left: Upload or JSON Editor & Mode Selection -->
        <v-col cols="12" :lg="inputMethod === 'editor' ? (editorWide ? 12 : 7) : 5" md="12">
          <!-- ── FILE UPLOAD MODE ── -->
          <div class="admin-card mb-6" v-if="inputMethod === 'file'">
            <div class="card-header-flex mb-3">
              <h3 class="card-section-title mb-0 border-0 pb-0">رفع ملف القالب (JSON File)</h3>
              <button
                v-if="store.selectedFile"
                class="btn btn-ghost btn-sm"
                @click="inputMethod = 'editor'"
                title="فتح هذا الملف في المحرر"
              >
                <v-icon icon="mdi-pencil-box-outline" size="15" class="ml-1" />
                <span>تعديل في المحرر</span>
              </button>
            </div>

            <!-- Dropzone Area -->
            <div
              class="dropzone-area text-center"
              :class="{ 'is-dragging': isDragging, 'has-file': store.selectedFile }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
            >
              <input
                type="file"
                ref="fileInput"
                class="d-none"
                accept=".json,application/json"
                @change="handleFileSelect"
              />

              <div v-if="!store.selectedFile">
                <div class="drop-icon-wrap">
                  <v-icon icon="mdi-cloud-upload-outline" size="36" color="#7B6EF6" />
                </div>
                <div class="drop-title">اسحب وأفلت ملف الـ JSON هنا</div>
                <div class="drop-sub">أو اضغط لتصفح واختيار الملف من جهازك (حتى 5 ميغابايت)</div>
              </div>

              <div v-else class="selected-file-view">
                <div class="file-icon-wrap">
                  <v-icon icon="mdi-file-code-outline" size="36" :color="store.fileError ? '#EF4444' : '#10B981'" />
                </div>
                <div class="file-name">{{ store.selectedFile.name }}</div>
                <div class="file-meta">
                  {{ formatBytes(store.selectedFile.size) }} •
                  <span v-if="store.fileError" class="text-danger">يحتوي على أخطاء</span>
                  <span v-else-if="store.parsedJson" class="text-success">✓ بنية JSON صالحة</span>
                  <span v-else>جاري الفحص...</span>
                </div>

                <div class="d-flex align-center justify-center gap-2 mt-3 flex-wrap">
                  <button class="btn btn-primary btn-sm" @click.stop="inputMethod = 'editor'">
                    <v-icon icon="mdi-code-json" size="15" class="ml-1" />
                    فتح في محرر JSON
                  </button>
                  <button class="btn-remove-file" @click.stop="store.clearFile">
                    <v-icon icon="mdi-trash-can-outline" size="14" class="ml-1" />
                    إلغاء الملف
                  </button>
                </div>
              </div>
            </div>

            <!-- Client File Error Alert with Quick Fix Action -->
            <div v-if="store.fileError" class="custom-alert error-alert mt-4">
              <div class="d-flex align-start gap-2">
                <v-icon icon="mdi-alert-octagon" size="20" color="#EF4444" class="ml-1 flex-shrink-0 mt-1" />
                <div class="flex-1">
                  <strong class="text-danger font-weight-bold">تنبيه في بنية ملف الـ JSON:</strong>
                  <p class="error-detail-text mt-1 mb-2">{{ store.fileError }}</p>
                  <button class="btn-open-editor-danger" @click="inputMethod = 'editor'">
                    <v-icon icon="mdi-auto-fix" size="16" class="ml-1" />
                    <span>فتح الملف في محرر الـ JSON وإصلاح الخطأ الآن</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Import Mode Selection -->
            <div class="mt-6" v-if="store.selectedFile && !store.fileError">
              <label class="field-label mb-2">طريقة تطبيق الاستيراد (Import Mode)</label>

              <div class="import-mode-options">
                <label class="mode-card" :class="{ active: importMode === 'UPSERT' }" @click="importMode = 'UPSERT'">
                  <div class="d-flex align-start gap-3">
                    <div class="custom-radio" :class="{ active: importMode === 'UPSERT' }">
                      <div class="radio-dot" v-if="importMode === 'UPSERT'" />
                    </div>
                    <div>
                      <div class="mode-name">تحديث أو إنشاء (Upsert) — موصى به</div>
                      <div class="mode-desc">يقوم بإنشاء السجلات الجديدة وتحديث السجلات الموجودة مسبقاً بناءً على المفاتيح الطبيعية.</div>
                    </div>
                  </div>
                </label>

                <label class="mode-card mt-2" :class="{ active: importMode === 'CREATE_ONLY' }" @click="importMode = 'CREATE_ONLY'">
                  <div class="d-flex align-start gap-3">
                    <div class="custom-radio" :class="{ active: importMode === 'CREATE_ONLY' }">
                      <div class="radio-dot" v-if="importMode === 'CREATE_ONLY'" />
                    </div>
                    <div>
                      <div class="mode-name">إنشاء الجديد فقط (Create Only)</div>
                      <div class="mode-desc">يقوم بإضافة السجلات غير الموجودة وتخطي أي عنصر موجود في قاعدة البيانات دون تعديله.</div>
                    </div>
                  </div>
                </label>

                <label class="mode-card mt-2" :class="{ active: importMode === 'SKIP_EXISTING' }" @click="importMode = 'SKIP_EXISTING'">
                  <div class="d-flex align-start gap-3">
                    <div class="custom-radio" :class="{ active: importMode === 'SKIP_EXISTING' }">
                      <div class="radio-dot" v-if="importMode === 'SKIP_EXISTING'" />
                    </div>
                    <div>
                      <div class="mode-name">تجاهل الموجود (Skip Existing)</div>
                      <div class="mode-desc">تجاهل تام لأي عنصر مسجل مسبقاً وإنشاء ما هو جديد فقط.</div>
                    </div>
                  </div>
                </label>

                <label class="mode-card mode-replace mt-2" :class="{ active: importMode === 'REPLACE' }" @click="importMode = 'REPLACE'">
                  <div class="d-flex align-start gap-3">
                    <div class="custom-radio radio-danger" :class="{ active: importMode === 'REPLACE' }">
                      <div class="radio-dot danger-dot" v-if="importMode === 'REPLACE'" />
                    </div>
                    <div>
                      <div class="mode-name text-danger">استبدال شامل (Replace All) ⚠️</div>
                      <div class="mode-desc">حذف السجلات القديمة للأقسام الموجودة في الملف واستبدالها بالكامل بالقالب الجديد.</div>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Action: Analyze & Validate Button -->
              <div class="mt-5">
                <button
                  class="btn-primary-action w-100"
                  :disabled="!store.selectedFile || !!store.fileError || store.validating"
                  @click="handleAnalyze"
                >
                  <v-progress-circular v-if="store.validating" indeterminate size="18" class="ml-2" color="#fff" />
                  <v-icon v-else icon="mdi-magnify-scan" size="18" class="ml-2" />
                  <span>{{ store.validating ? 'جاري فحص القالب وتحليله...' : 'فحص وتحليل القالب (Analyze & Validate)' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- ── INTERACTIVE JSON CODE EDITOR MODE ── -->
          <div class="admin-card mb-6" v-else>
            <div class="card-header-flex mb-3">
              <div>
                <h3 class="card-section-title mb-1 border-0 pb-0">محرر ومصحح كود الـ JSON</h3>
                <p class="section-desc">يمكنك لصق كود JSON مباشرة، أو تعديل الملف المرفوع وتصحيح أي أخطاء صياغة أو قيم غير متطابقة ثم إعادة الفحص فوراً.</p>
              </div>
              <div class="d-flex align-center gap-2">
                <button
                  class="btn btn-ghost btn-sm"
                  @click="editorWide = !editorWide"
                  :title="editorWide ? 'عرض مقسم جانبي' : 'توسيع العرض للحد الأقصى'"
                >
                  <v-icon :icon="editorWide ? 'mdi-view-split-vertical' : 'mdi-arrow-expand-horizontal'" size="15" class="ml-1" />
                  <span>{{ editorWide ? 'عرض مقسم' : 'توسيع العرض' }}</span>
                </button>
                <button class="btn btn-ghost btn-sm" @click="inputMethod = 'file'">
                  <v-icon icon="mdi-cloud-upload-outline" size="15" class="ml-1" />
                  <span>نافذة رفع الملف</span>
                </button>
              </div>
            </div>

            <!-- Embedded JSON Code Editor Component -->
            <JsonCodeEditor
              v-model="store.rawJsonText"
              :file-name="store.selectedFile?.name || 'custom-template.json'"
              @update:model-value="store.setRawJson"
              class="mb-4"
            />

            <!-- Import Mode Selection inside Editor View -->
            <div class="mt-4">
              <label class="field-label mb-2">طريقة تطبيق الاستيراد (Import Mode)</label>

              <div class="import-mode-options">
                <label class="mode-card" :class="{ active: importMode === 'UPSERT' }" @click="importMode = 'UPSERT'">
                  <div class="d-flex align-start gap-3">
                    <div class="custom-radio" :class="{ active: importMode === 'UPSERT' }">
                      <div class="radio-dot" v-if="importMode === 'UPSERT'" />
                    </div>
                    <div>
                      <div class="mode-name">تحديث أو إنشاء (Upsert) — موصى به</div>
                      <div class="mode-desc">يقوم بإنشاء السجلات وتحديث الموجود مسبقاً.</div>
                    </div>
                  </div>
                </label>

                <label class="mode-card mt-2" :class="{ active: importMode === 'CREATE_ONLY' }" @click="importMode = 'CREATE_ONLY'">
                  <div class="d-flex align-start gap-3">
                    <div class="custom-radio" :class="{ active: importMode === 'CREATE_ONLY' }">
                      <div class="radio-dot" v-if="importMode === 'CREATE_ONLY'" />
                    </div>
                    <div>
                      <div class="mode-name">إنشاء الجديد فقط (Create Only)</div>
                      <div class="mode-desc">إضافة العناصر الجديدة وتخطي ما هو موجود.</div>
                    </div>
                  </div>
                </label>

                <label class="mode-card mode-replace mt-2" :class="{ active: importMode === 'REPLACE' }" @click="importMode = 'REPLACE'">
                  <div class="d-flex align-start gap-3">
                    <div class="custom-radio radio-danger" :class="{ active: importMode === 'REPLACE' }">
                      <div class="radio-dot danger-dot" v-if="importMode === 'REPLACE'" />
                    </div>
                    <div>
                      <div class="mode-name text-danger">استبدال شامل (Replace All) ⚠️</div>
                      <div class="mode-desc">حذف السجلات القديمة للأقسام الموجودة في الملف واستبدالها.</div>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Action: Analyze & Validate Button -->
              <div class="mt-5 d-flex gap-3">
                <button
                  class="btn-primary-action flex-1"
                  :disabled="!store.rawJsonText || !!store.fileError || store.validating"
                  @click="handleAnalyze"
                >
                  <v-progress-circular v-if="store.validating" indeterminate size="18" class="ml-2" color="#fff" />
                  <v-icon v-else icon="mdi-magnify-scan" size="18" class="ml-2" />
                  <span>{{ store.validating ? 'جاري فحص الكود المعدل...' : 'فحص وتحليل الكود المعدل (Re-Validate)' }}</span>
                </button>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Right: Dry-Run Preview & Confirmation -->
        <v-col cols="12" :lg="inputMethod === 'editor' ? (editorWide ? 12 : 5) : 7" md="12">
          <div class="admin-card" v-if="store.validationReport">
            <!-- Header Status -->
            <div class="card-header-flex mb-4">
              <div>
                <h3 class="card-section-title mb-1 border-0 pb-0">تقرير الفحص المسبق (Dry Run Preview)</h3>
                <span class="section-desc">
                  إصدار القالب: <strong>{{ store.validationReport.version || 'v1.0' }}</strong> • النمط: <strong class="text-purple">{{ store.validationReport.import_mode }}</strong>
                </span>
              </div>

              <div class="status-pill" :class="store.validationReport.valid ? 'success' : 'danger'">
                <v-icon :icon="store.validationReport.valid ? 'mdi-check-decagram' : 'mdi-alert-circle'" size="16" class="ml-1" />
                <span>{{ store.validationReport.valid ? 'القالب صالح للاستيراد' : 'يحتوي على أخطاء' }}</span>
              </div>
            </div>

            <!-- Forecast Metrics Bento -->
            <div class="forecast-grid mb-5">
              <div class="forecast-card fc-create">
                <div class="fc-val">+{{ store.validationReport.forecast?.to_create || 0 }}</div>
                <div class="fc-label">سجلات جديدة ستُنشأ</div>
              </div>
              <div class="forecast-card fc-update">
                <div class="fc-val">~{{ store.validationReport.forecast?.to_update || 0 }}</div>
                <div class="fc-label">سجلات ستُحدَّث</div>
              </div>
              <div class="forecast-card fc-skip">
                <div class="fc-val">{{ store.validationReport.forecast?.to_skip || 0 }}</div>
                <div class="fc-label">سجلات ستُتخطى</div>
              </div>
              <div class="forecast-card fc-total">
                <div class="fc-val">{{ store.validationReport.total_records || 0 }}</div>
                <div class="fc-label">إجمالي السجلات</div>
              </div>
            </div>

            <!-- Discovered Entities Breakdown Chips -->
            <div class="mb-5">
              <div class="field-label mb-2">توزيع الكيانات المكتشفة في الملف:</div>
              <div class="d-flex flex-wrap gap-2">
                <div
                  v-for="(count, entName) in store.validationReport.summary"
                  :key="entName"
                  class="entity-count-chip"
                >
                  <span class="ec-name">{{ formatEntityName(entName) }}</span>
                  <span class="ec-count">{{ count }}</span>
                </div>
              </div>
            </div>

            <!-- Errors Alert List with Quick Jump to Editor Button -->
            <div v-if="store.validationReport.errors?.length" class="validation-errors-box mb-4">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center gap-2 text-danger font-weight-bold">
                  <v-icon icon="mdi-alert-octagon" size="18" color="#EF4444" />
                  <span>الأخطاء المكتشفة (يجب تصحيحها قبل الاستيراد):</span>
                </div>
                <button
                  v-if="inputMethod !== 'editor'"
                  class="btn-inline-fix"
                  @click="inputMethod = 'editor'"
                >
                  <v-icon icon="mdi-code-json" size="14" class="ml-1" />
                  تصحيح في المحرر
                </button>
              </div>

              <div class="error-item" v-for="(err, idx) in store.validationReport.errors" :key="idx">
                <span class="err-num">{{ idx + 1 }}</span>
                <div class="flex-1">
                  <span class="err-ent" v-if="err.entity">[{{ formatEntityName(err.entity) }}]</span>
                  <span class="err-field" v-if="err.field">{{ err.field }}:</span>
                  <span class="err-msg">{{ err.message }}</span>
                </div>
              </div>

              <!-- Action button inside error box -->
              <button
                v-if="inputMethod !== 'editor'"
                class="btn-open-editor-from-errors w-100 mt-3"
                @click="inputMethod = 'editor'"
              >
                <v-icon icon="mdi-pencil-box-outline" size="16" class="ml-1" />
                <span>تعديل القالب في محرر الـ JSON لتصحيح هذه الأخطاء وإعادة الفحص</span>
              </button>
            </div>

            <!-- Warnings Alert List -->
            <div v-if="store.validationReport.warnings?.length" class="validation-warnings-box mb-4">
              <div class="d-flex align-center gap-2 mb-2 text-warning font-weight-bold">
                <v-icon icon="mdi-alert" size="18" color="#F59E0B" />
                <span>تنبيهات وملاحظات:</span>
              </div>
              <div class="warning-item" v-for="(warn, idx) in store.validationReport.warnings" :key="idx">
                <span class="warn-num">{{ idx + 1 }}</span>
                <div class="flex-1">
                  <span class="warn-ent" v-if="warn.entity">[{{ formatEntityName(warn.entity) }}]</span>
                  <span class="warn-msg">{{ warn.message }}</span>
                </div>
              </div>
            </div>

            <!-- Action: Confirm Import Button -->
            <div class="pt-4 border-top-dark">
              <button
                class="btn-primary-action w-100"
                :disabled="!store.validationReport.valid || store.importing"
                @click="handleConfirmImport"
              >
                <v-progress-circular v-if="store.importing" indeterminate size="18" class="ml-2" color="#fff" />
                <v-icon v-else icon="mdi-database-check-outline" size="18" class="ml-2" />
                <span>{{ store.importing ? 'جاري تنفيذ الاستيراد الذري في قاعدة البيانات...' : 'تأكيد وتنفيذ الاستيراد الآن (Confirm Import)' }}</span>
              </button>
            </div>
          </div>

          <!-- Empty State for Preview -->
          <div v-else class="admin-card empty-preview-card text-center py-12">
            <div class="empty-icon-wrap mb-3">
              <v-icon icon="mdi-file-find-outline" size="40" color="#7B6EF6" />
            </div>
            <h4 class="empty-title">قم باختيار ملف القالب أو تعديل الكود ثم اضغط "فحص وتحليل" لعرض المعاينة المسبقة هنا</h4>
            <p class="empty-desc">
              سيتم فحص وتدقيق كل حقل في الملف ومقارنته مع قاعدة البيانات دون إجراء أي تعديل فعلي (Dry Run).
            </p>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════════════
         TAB 3: IMPORT HISTORY TABLE
         ═════════════════════════════════════════════════════════════════════════ -->
    <div v-if="activeTab === 'history'" class="tab-content-fade">
      <div class="admin-card">
        <div class="card-header-flex mb-4">
          <div>
            <h3 class="card-section-title mb-1 border-0 pb-0">سجل عمليات استيراد القوالب (Import History)</h3>
            <p class="section-desc">تتبع زمني دقيق لكل عملية استيراد مع تفاصيل العناصر المنشأة والمحدثة والأخطاء.</p>
          </div>
          <button class="btn btn-ghost btn-sm" @click="store.fetchHistory">
            <v-icon icon="mdi-refresh" size="16" class="ml-1" />
            تحديث السجل
          </button>
        </div>

        <div v-if="store.loadingHistory" class="text-center py-8">
          <v-progress-circular indeterminate color="#7B6EF6" />
        </div>

        <div v-else-if="store.historyList.length === 0" class="text-center py-12">
          <div class="empty-icon-wrap mb-2">
            <v-icon icon="mdi-clipboard-text-outline" size="36" color="#7B6EF6" />
          </div>
          <h4 class="empty-title">لا توجد عمليات استيراد مسجلة حتى الآن</h4>
        </div>

        <div v-else class="table-responsive">
          <table class="dark-admin-table">
            <thead>
              <tr>
                <th>اسم الملف</th>
                <th>التاريخ والتوقيت</th>
                <th>المستخدم</th>
                <th>النمط</th>
                <th>المنشأ</th>
                <th>المحدث</th>
                <th>المتخطى</th>
                <th>الأخطاء</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in store.historyList" :key="h.id">
                <td>
                  <div class="d-flex align-center gap-2">
                    <v-icon icon="mdi-file-code-outline" size="18" color="#7B6EF6" />
                    <span class="font-weight-bold font-mono">{{ h.filename }}</span>
                  </div>
                </td>
                <td class="font-mono text-muted">
                  {{ formatDateTime(h.created_at) }}
                </td>
                <td>{{ h.imported_by_username || 'Admin' }}</td>
                <td><span class="mode-tag">{{ h.import_mode_display || h.import_mode }}</span></td>
                <td class="text-emerald font-weight-bold">+{{ h.created_count }}</td>
                <td class="text-sky font-weight-bold">~{{ h.updated_count }}</td>
                <td class="text-muted">{{ h.skipped_count }}</td>
                <td>
                  <span v-if="h.error_count > 0" class="text-danger font-weight-bold">{{ h.error_count }}</span>
                  <span v-else class="text-muted">0</span>
                </td>
                <td>
                  <span class="status-pill" :class="h.status === 'SUCCESS' ? 'success' : 'danger'">
                    {{ h.status_display || h.status }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-center gap-2">
                    <button class="action-btn" @click="viewHistoryDetail(h)" title="عرض التفاصيل">
                      <v-icon icon="mdi-eye-outline" size="16" />
                    </button>
                    <button class="action-btn btn-delete" @click="deleteHistoryItem(h)" title="حذف السجل">
                      <v-icon icon="mdi-delete-outline" size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ═════════════════════════════════════════════════════════════════════════
         MODAL: REPLACE CONFIRMATION DIALOG
         ═════════════════════════════════════════════════════════════════════════ -->
    <v-dialog v-model="replaceConfirmModal" max-width="500">
      <div class="dark-modal-card">
        <div class="d-flex align-center gap-2 mb-3 text-danger">
          <v-icon icon="mdi-alert-octagon" size="28" color="#EF4444" />
          <h3 class="modal-title mb-0 text-danger">تأكيد الاستبدال الشامل (Replace All)</h3>
        </div>

        <p class="modal-body-text">
          أنت على وشك تنفيذ استبدال كامل للبيانات المسجلة بالأقسام الواردة في هذا الملف.
          <strong>سيتم حذف السجلات السابقة نهائياً واستبدالها بمحتوى القالب المرفوع.</strong>
        </p>

        <p class="modal-hint">
          للأمان، يرجى كتابة كلمة <strong>تأكيد</strong> في الحقل أدناه للمتابعة:
        </p>

        <input
          type="text"
          v-model="replaceConfirmWord"
          placeholder="اكتب: تأكيد"
          class="dark-input mb-4"
        />

        <div class="d-flex gap-3 justify-end">
          <button class="btn btn-ghost" @click="replaceConfirmModal = false">إلغاء</button>
          <button
            class="btn-danger-action"
            :disabled="replaceConfirmWord.trim() !== 'تأكيد'"
            @click="proceedReplaceImport"
          >
            تأكيد وحذف القديم واستيراد الجديد
          </button>
        </div>
      </div>
    </v-dialog>

    <!-- ═════════════════════════════════════════════════════════════════════════
         MODAL: SUCCESS IMPORT REPORT DIALOG
         ═════════════════════════════════════════════════════════════════════════ -->
    <v-dialog v-model="successResultModal" max-width="560">
      <div class="dark-modal-card text-center" v-if="store.importResult">
        <div class="success-icon-wrap mb-3">
          <v-icon icon="mdi-check-circle" size="48" color="#10B981" />
        </div>

        <h3 class="modal-title text-emerald mb-1">اكتمل الاستيراد بنجاح!</h3>
        <p class="modal-body-text mb-4">
          تم تحديث قاعدة البيانات وتحديث محتوى موقع البورتفوليو بالكامل.
        </p>

        <!-- Stats Grid in Result Modal -->
        <div class="forecast-grid mb-5">
          <div class="forecast-card fc-create">
            <div class="fc-val">+{{ store.importResult.created_count }}</div>
            <div class="fc-label">تم إنشاؤها</div>
          </div>
          <div class="forecast-card fc-update">
            <div class="fc-val">~{{ store.importResult.updated_count }}</div>
            <div class="fc-label">تم تحديثها</div>
          </div>
          <div class="forecast-card fc-skip">
            <div class="fc-val">{{ store.importResult.skipped_count }}</div>
            <div class="fc-label">تم تخطيها</div>
          </div>
          <div class="forecast-card fc-total">
            <div class="fc-val font-mono">{{ store.importResult.duration_ms }}ms</div>
            <div class="fc-label">المدة الزمنية</div>
          </div>
        </div>

        <button class="btn-primary-action w-100" @click="successResultModal = false; store.clearFile()">
          إغلاق ومتابعة
        </button>
      </div>
    </v-dialog>

    <!-- ═════════════════════════════════════════════════════════════════════════
         MODAL: HISTORY DETAIL DIALOG
         ═════════════════════════════════════════════════════════════════════════ -->
    <v-dialog v-model="historyDetailModal" max-width="600">
      <div class="dark-modal-card" v-if="activeHistoryItem">
        <div class="d-flex align-center justify-between mb-4">
          <h3 class="modal-title mb-0">تفاصيل عملية الاستيراد</h3>
          <span class="status-pill" :class="activeHistoryItem.status === 'SUCCESS' ? 'success' : 'danger'">
            {{ activeHistoryItem.status_display || activeHistoryItem.status }}
          </span>
        </div>

        <div class="export-summary-box mb-4">
          <div class="summary-row">
            <span>اسم الملف:</span>
            <span class="val-mono">{{ activeHistoryItem.filename }}</span>
          </div>
          <div class="summary-row">
            <span>التاريخ:</span>
            <span class="val-mono">{{ formatDateTime(activeHistoryItem.created_at) }}</span>
          </div>
          <div class="summary-row">
            <span>النمط:</span>
            <span class="text-purple font-weight-bold">{{ activeHistoryItem.import_mode_display || activeHistoryItem.import_mode }}</span>
          </div>
          <div class="summary-row">
            <span>المدة:</span>
            <span class="val-mono">{{ activeHistoryItem.duration_ms }} ms</span>
          </div>
        </div>

        <!-- Errors Log if any -->
        <div v-if="activeHistoryItem.errors_log?.length" class="validation-errors-box mb-4">
          <div class="font-weight-bold text-danger mb-2">سجل الأخطاء:</div>
          <div class="error-item" v-for="(err, idx) in activeHistoryItem.errors_log" :key="idx">
            <span>{{ err.message || err }}</span>
          </div>
        </div>

        <!-- Warnings Log if any -->
        <div v-if="activeHistoryItem.warnings_log?.length" class="validation-warnings-box mb-4">
          <div class="font-weight-bold text-warning mb-2">سجل الملاحظات:</div>
          <div class="warning-item" v-for="(w, idx) in activeHistoryItem.warnings_log" :key="idx">
            <span>{{ w.message || w }}</span>
          </div>
        </div>

        <div class="text-left mt-4">
          <button class="btn btn-ghost" @click="historyDetailModal = false">إغلاق</button>
        </div>
      </div>
    </v-dialog>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteConfirmOpen"
      title="تأكيد حذف سجل العملية"
      :item-name="historyItemToDelete?.filename"
      item-type="سجل استيراد"
      warning-text="تنبيه: سيتم مسح هذا السجل وإحصائياته نهائياً من سجل العمليات."
      :loading="deletingHistory"
      @confirm="executeDeleteHistory"
    />

    <!-- Global Snackbar -->
    <v-snackbar v-model="snack" :color="snackColor" location="bottom left" :timeout="4000">
      {{ snackText }}
    </v-snackbar>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

import { ref, onMounted } from 'vue'
import { useDataTemplateStore } from '~/stores/dataTemplate'
import JsonCodeEditor from '~/components/admin/JsonCodeEditor.vue'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'

const store = useDataTemplateStore()

// Tabs
const activeTab = ref('export')

// Import / Editor Method Switcher
const inputMethod = ref('file') // 'file' or 'editor'
const editorWide = ref(false) // Toggle full width vs split view

// Delete history state
const deleteConfirmOpen = ref(false)
const historyItemToDelete = ref(null)
const deletingHistory = ref(false)

// Export State
const exportType = ref('live')
const exporting = ref(false)
const selectedEntities = ref([
  'profile', 'skill_categories', 'services', 'projects',
  'experiences', 'testimonials', 'statistics', 'settings'
])

const availableEntities = [
  { key: 'profile', title: 'الملف الشخصي (Profile)', desc: 'الاسم، النبذة، روابط التواصل، والموقع', icon: 'mdi-account-circle-outline', color: '#7B6EF6' },
  { key: 'skill_categories', title: 'المهارات والتصنيفات (Skills)', desc: 'مجموعات المهارات ونسب الإتقان', icon: 'mdi-code-tags-check', color: '#38BDF8' },
  { key: 'services', title: 'الخدمات (Services)', desc: 'الخدمات المقدمة والمميزات التنافسية', icon: 'mdi-monitor-dashboard', color: '#10B981' },
  { key: 'projects', title: 'المشاريع ودراسات الحالة (Projects)', desc: 'أبرز الأعمال، المعمارية، والأهداف', icon: 'mdi-folder-multiple-outline', color: '#F59E0B' },
  { key: 'experiences', title: 'الخط الزمني والخبرة (Timeline)', desc: 'محطات المسيرة المهنية والمناصب', icon: 'mdi-timeline-clock-outline', color: '#EC4899' },
  { key: 'testimonials', title: 'آراء العملاء (Testimonials)', desc: 'التقييمات والتوصيات المعتمدة', icon: 'mdi-comment-quote-outline', color: '#8B5CF6' },
  { key: 'statistics', title: 'الأرقام والإحصائيات (Statistics)', desc: 'المؤشرات الرقمية البارزة', icon: 'mdi-chart-bell-curve', color: '#06B6D4' },
  { key: 'settings', title: 'إعدادات الموقع (Site Settings)', desc: 'عناوين الأقسام ونصوص الهيدر', icon: 'mdi-cog-outline', color: '#94A3B8' },
]

// Import State
const isDragging = ref(false)
const importMode = ref('UPSERT')
const replaceConfirmModal = ref(false)
const replaceConfirmWord = ref('')
const successResultModal = ref(false)

// History State
const historyDetailModal = ref(false)
const activeHistoryItem = ref(null)

// Snack
const snack = ref(false)
const snackText = ref('')
const snackColor = ref('success')

function notify(text, color = 'success') {
  snackText.value = text
  snackColor.value = color
  snack.value = true
}

// ═════════════════════════════════════════════════════════════════════════
// Export Functions
// ═════════════════════════════════════════════════════════════════════════
function toggleEntity(key) {
  const idx = selectedEntities.value.indexOf(key)
  if (idx > -1) {
    selectedEntities.value.splice(idx, 1)
  } else {
    selectedEntities.value.push(key)
  }
}

function selectAllEntities() {
  selectedEntities.value = availableEntities.map(e => e.key)
}

function clearAllEntities() {
  selectedEntities.value = []
}

async function handleExportDownload() {
  if (selectedEntities.value.length === 0) {
    notify('يرجى تحديد كيان واحد على الأقل للتصدير', 'error')
    return
  }
  exporting.value = true
  try {
    const withExamples = exportType.value === 'examples'
    await store.exportTemplateAndDownload(selectedEntities.value, withExamples)
    notify('تم تصدير وتحميل ملف القالب بنجاح!')
  } catch (err) {
    notify('فشل تصدير القالب: ' + err.message, 'error')
  } finally {
    exporting.value = false
  }
}

// ═════════════════════════════════════════════════════════════════════════
// Import Functions
// ═════════════════════════════════════════════════════════════════════════
function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) {
    store.selectFile(file)
  }
}

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    store.selectFile(file)
  }
}

async function handleAnalyze() {
  const report = await store.validate(importMode.value)
  if (report?.valid) {
    notify('تم فحص القالب بنجاح، يمكنك مراجعة المعاينة وتأكيد الاستيراد.')
  } else {
    notify('تم فحص القالب وتوجد ملاحظات أو أخطاء موضحة.', 'warning')
  }
}

async function handleConfirmImport() {
  if (importMode.value === 'REPLACE') {
    replaceConfirmWord.value = ''
    replaceConfirmModal.value = true
    return
  }

  const res = await store.performImport(importMode.value, false)
  if (res?.success) {
    successResultModal.value = true
  } else {
    notify(res?.message || 'فشلت عملية الاستيراد', 'error')
  }
}

async function proceedReplaceImport() {
  replaceConfirmModal.value = false
  const res = await store.performImport('REPLACE', true)
  if (res?.success) {
    successResultModal.value = true
  } else {
    notify(res?.message || 'فشلت عملية الاستبدال', 'error')
  }
}

// ═════════════════════════════════════════════════════════════════════════
// History Functions
// ═════════════════════════════════════════════════════════════════════════
function viewHistoryDetail(item) {
  activeHistoryItem.value = item
  historyDetailModal.value = true
}

function deleteHistoryItem(item) {
  historyItemToDelete.value = item
  deleteConfirmOpen.value = true
}

async function executeDeleteHistory() {
  if (!historyItemToDelete.value) return
  deletingHistory.value = true
  try {
    await store.deleteHistoryItem(historyItemToDelete.value.id)
    notify('تم حذف السجل بنجاح')
    deleteConfirmOpen.value = false
    historyItemToDelete.value = null
  } catch (err) {
    notify('فشل حذف السجل', 'error')
  } finally {
    deletingHistory.value = false
  }
}

// ═════════════════════════════════════════════════════════════════════════
// Helpers
// ═════════════════════════════════════════════════════════════════════════
function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDateTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })
}

function formatEntityName(key) {
  const map = {
    profile: 'الملف الشخصي',
    skill_categories: 'تصنيفات المهارات',
    skills: 'المهارات',
    services: 'الخدمات',
    projects: 'المشاريع',
    experiences: 'الخط الزمني',
    testimonials: 'آراء العملاء',
    statistics: 'الإحصائيات',
    settings: 'الإعدادات',
  }
  return map[key] || key
}

onMounted(() => {
  store.fetchHistory()
})
</script>

<style scoped>
/* Page Layout */
.admin-page {
  max-width: 1350px;
  margin: 0 auto;
  font-family: var(--f-display, 'Tajawal', sans-serif);
}

/* Page Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.header-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.header-icon-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(123, 110, 246, 0.12);
  border: 1px solid rgba(123, 110, 246, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-title {
  font-size: 1.55rem;
  font-weight: 900;
  color: var(--t1);
  line-height: 1.2;
}
.page-subtitle {
  font-size: 0.86rem;
  color: var(--t2);
  max-width: 800px;
  line-height: 1.6;
}

/* Button & History Badge */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 16px;
}
.btn-ghost {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
}
.btn-ghost:hover {
  background: var(--bg-3);
  color: var(--t1);
  border-color: var(--primary);
}
.btn-sm {
  padding: 6px 12px;
  font-size: 0.78rem;
}
.history-badge {
  background: var(--primary);
  color: #fff;
  border-radius: 99px;
  padding: 2px 7px;
  font-size: 0.72rem;
  font-family: var(--f-mono, monospace);
  margin-right: 6px;
}

/* Tabs Bar */
.template-tabs-bar {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  overflow-x: auto;
}
.tab-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--t2);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
}
.tab-btn:hover {
  background: var(--bg-3);
  color: var(--t1);
  border-color: var(--primary);
}
.tab-btn.active {
  background: linear-gradient(135deg, var(--primary) 0%, #2563EB 100%);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

/* Card Styles */
.admin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}
.card-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.card-section-title {
  font-size: 1.12rem;
  font-weight: 800;
  color: var(--t1);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.section-desc {
  font-size: 0.8rem;
  color: var(--t3);
  margin-top: 2px;
}

/* Entities Grid */
.entities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}
.entity-checkbox-card {
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.entity-checkbox-card:hover {
  background: var(--bg-3);
  border-color: var(--primary);
  transform: translateY(-2px);
}
.entity-checkbox-card.checked {
  background: rgba(37, 99, 235, 0.08);
  border-color: var(--primary);
}

/* Custom Checkbox */
.custom-chk {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid var(--border);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.custom-chk.active {
  background: var(--primary);
  border-color: var(--primary);
}

.ent-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--icon-col, var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ent-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--t1);
}
.ent-desc {
  font-size: 0.74rem;
  color: var(--t3);
  margin-top: 2px;
}

/* Radio Option Cards */
.radio-option-card {
  display: block;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}
.radio-option-card:hover {
  background: var(--bg-3);
  border-color: var(--primary);
}
.radio-option-card.active {
  background: rgba(123, 110, 246, 0.1);
  border-color: var(--primary);
}

.custom-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.2s ease;
}
.custom-radio.active {
  border-color: var(--primary);
}
.custom-radio.radio-danger.active {
  border-color: #EF4444;
}
.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
}
.danger-dot {
  background: #EF4444;
}

.radio-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--t1);
}
.radio-desc {
  font-size: 0.76rem;
  color: var(--t3);
  margin-top: 2px;
  line-height: 1.5;
}

/* Summary Box */
.export-summary-box {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--t2);
  margin-bottom: 8px;
}
.summary-row:last-child {
  margin-bottom: 0;
}
.val-pill {
  color: var(--t1);
  font-weight: 700;
}
.val-mono {
  font-family: var(--f-mono, monospace);
  font-weight: 700;
}
.text-cyan { color: #06B6D4; }
.text-purple { color: #8B5CF6; }
.text-emerald { color: #10B981; }
.text-sky { color: #0EA5E9; }
.text-danger { color: #EF4444; }
.text-warning { color: #F59E0B; }
.text-muted { color: var(--t3); }

/* Primary Action Button */
.btn-primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7B6EF6 0%, #6366F1 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.92rem;
  border-radius: 12px;
  padding: 12px 20px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(123, 110, 246, 0.35);
  transition: all 0.25s ease;
}
.btn-primary-action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(123, 110, 246, 0.55);
}
.btn-primary-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Dropzone Area */
.dropzone-area {
  border: 2px dashed var(--border);
  border-radius: 16px;
  padding: 36px 20px;
  background: var(--bg-subtle);
  transition: all 0.2s ease;
  cursor: pointer;
}
.dropzone-area:hover, .dropzone-area.is-dragging {
  border-color: var(--primary);
  background: rgba(123, 110, 246, 0.06);
}
.dropzone-area.has-file {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.06);
}
.drop-icon-wrap, .file-icon-wrap, .empty-icon-wrap {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.drop-title { font-size: 0.98rem; font-weight: 700; color: var(--t1); margin-bottom: 4px; }
.drop-sub { font-size: 0.78rem; color: var(--t3); }
.file-name { font-size: 0.92rem; font-weight: 700; color: #10B981; font-family: var(--f-mono, monospace); }
.file-meta { font-size: 0.76rem; color: var(--t3); margin-top: 4px; }
.btn-remove-file {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #EF4444;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-remove-file:hover { background: rgba(239, 68, 68, 0.18); color: #DC2626; }

/* Custom Alert */
.custom-alert {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.82rem;
}
.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
}

/* Import Mode Options */
.mode-card {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}
.mode-card:hover { border-color: var(--primary); }
.mode-card.active {
  background: rgba(123, 110, 246, 0.1);
  border-color: var(--primary);
}
.mode-card.mode-replace.active {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.45);
}
.mode-name { font-size: 0.88rem; font-weight: 700; color: var(--t1); }
.mode-desc { font-size: 0.74rem; color: var(--t3); margin-top: 2px; line-height: 1.5; }
.field-label { font-size: 0.82rem; font-weight: 700; color: var(--t2); display: block; }

/* Status Pill */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.76rem;
  font-weight: 700;
}
.status-pill.success {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #10B981;
}
.status-pill.danger {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #EF4444;
}

/* Forecast Grid */
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.forecast-card {
  padding: 14px 10px;
  border-radius: 14px;
  text-align: center;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
}
.fc-val { font-size: 1.45rem; font-weight: 900; font-family: var(--f-mono, monospace); line-height: 1.2; }
.fc-label { font-size: 0.72rem; color: var(--t3); margin-top: 4px; font-weight: 600; }
.fc-create .fc-val { color: #10B981; }
.fc-update .fc-val { color: #0EA5E9; }
.fc-skip .fc-val   { color: #F59E0B; }
.fc-total .fc-val  { color: #8B5CF6; }

/* Entity Count Chip */
.entity-count-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  font-size: 0.78rem;
}
.ec-name { color: var(--t2); }
.ec-count {
  background: rgba(123, 110, 246, 0.15);
  color: var(--primary);
  font-weight: 800;
  font-family: var(--f-mono, monospace);
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 0.72rem;
}

/* Validation Boxes */
.validation-errors-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 12px 14px;
}
.error-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.8rem;
  color: #EF4444;
  margin-bottom: 6px;
  line-height: 1.5;
}
.err-num {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.validation-warnings-box {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  padding: 12px 14px;
}
.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.8rem;
  color: #D97706;
  margin-bottom: 6px;
  line-height: 1.5;
}
.warn-num {
  background: rgba(245, 158, 11, 0.2);
  color: #F59E0B;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
}
.border-top-dark {
  border-top: 1px solid var(--border);
}

/* Empty State */
.empty-preview-card {
  border: 1px dashed var(--border);
}
.empty-title {
  color: var(--t1);
  font-size: 0.95rem;
  font-weight: 700;
}
.empty-desc {
  font-size: 0.78rem;
  color: var(--t3);
  margin-top: 4px;
}

/* History Dark Table */
.dark-admin-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.dark-admin-table th {
  background: var(--bg-subtle);
  color: var(--t3);
  padding: 12px 14px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: right;
  border-bottom: 1px solid var(--border);
}
.dark-admin-table td {
  padding: 14px;
  border-bottom: 1px solid var(--border);
  color: var(--t1);
  font-size: 0.84rem;
}
.dark-admin-table tr:hover td {
  background: var(--bg-subtle);
}
.mode-tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
}
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.action-btn:hover {
  background: var(--bg-3);
  color: var(--t1);
}
.action-btn.btn-delete:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
  border-color: rgba(239, 68, 68, 0.3);
}

/* Modals */
.dark-modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}
.modal-title { font-size: 1.1rem; font-weight: 800; color: var(--t1); }
.modal-body-text { font-size: 0.86rem; color: var(--t2); line-height: 1.7; }
.modal-hint { font-size: 0.78rem; color: var(--t3); margin-bottom: 8px; }
.dark-input {
  width: 100%;
  background: var(--bg-subtle);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--t1);
  font-size: 0.9rem;
  outline: none;
}
.dark-input:focus {
  border-color: #EF4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.25);
}
.btn-danger-action {
  background: #EF4444;
  color: #ffffff;
  border: none;
  padding: 9px 18px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-danger-action:hover:not(:disabled) { background: #DC2626; }
.btn-danger-action:disabled { opacity: 0.5; cursor: not-allowed; }

/* Input Method Switcher */
.input-method-switch {
  display: flex;
  gap: 10px;
  background: var(--bg-card);
  padding: 6px;
  border-radius: 14px;
  border: 1px solid var(--border);
  width: fit-content;
}

.im-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--t2);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.im-btn:hover {
  color: var(--t1);
  background: var(--bg-subtle);
}

.im-btn.active {
  background: rgba(123, 110, 246, 0.15);
  border-color: rgba(123, 110, 246, 0.4);
  color: #FFFFFF;
}

[data-theme="light"] .im-btn.active {
  background: #7B6EF6;
  color: #FFFFFF;
}

.file-loaded-pill {
  font-size: 0.72rem;
  background: rgba(16, 185, 129, 0.2);
  color: #10B981;
  padding: 2px 8px;
  border-radius: 6px;
  font-family: var(--f-mono, monospace);
  direction: ltr;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.editor-indicator-badge {
  font-size: 0.7rem;
  background: rgba(56, 189, 248, 0.18);
  color: #38BDF8;
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38BDF8;
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}

.error-detail-text {
  font-size: 0.8rem;
  color: #FCA5A5;
  font-family: var(--f-mono, monospace);
  direction: ltr;
  text-align: right;
  line-height: 1.5;
}

.btn-open-editor-danger {
  background: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.btn-open-editor-danger:hover {
  background: #DC2626;
  transform: translateY(-1px);
}

.btn-inline-fix {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #EF4444;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-inline-fix:hover {
  background: #EF4444;
  color: #FFFFFF;
}

.btn-open-editor-from-errors {
  background: rgba(239, 68, 68, 0.15);
  border: 1.5px dashed rgba(239, 68, 68, 0.5);
  color: #FCA5A5;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.btn-open-editor-from-errors:hover {
  background: #EF4444;
  color: #FFFFFF;
  border-style: solid;
}

@media (max-width: 768px) {
  .forecast-grid { grid-template-columns: repeat(2, 1fr); }
  .entities-grid { grid-template-columns: 1fr; }
  .input-method-switch { width: 100%; flex-direction: column; }
  .im-btn { width: 100%; justify-content: center; }
}
</style>
