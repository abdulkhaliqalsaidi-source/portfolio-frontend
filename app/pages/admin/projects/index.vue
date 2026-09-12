<template>
  <div class="admin-page">
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة المشاريع ودراسات الحالة</h1>
        <p class="page-subtitle">إضافة وتعديل وحذف المشاريع ورفع الصور المباشرة من جهازك وتفاصيل دراسة الحالة.</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" @click="openCreateDialog">
          <v-icon icon="mdi-plus" size="18" />
          <span>إضافة مشروع جديد</span>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="admin-card mb-6">
      <v-row align="center">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            placeholder="بحث بالاسم أو الوصف أو التقنية..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="statusFilter"
            :items="['الكل', 'المنشورة', 'المسودات', 'المميزة فقط']"
            variant="outlined"
            density="compact"
            hide-details
            label="حالة النشر"
          />
        </v-col>
        <v-col cols="12" md="4" class="text-left text-sm-right">
          <span class="text-caption text-secondary">
            إجمالي المشاريع: {{ filteredProjects.length }}
          </span>
        </v-col>
      </v-row>
    </div>

    <!-- Projects Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="filteredProjects.length === 0" class="text-center py-10">
        <v-icon icon="mdi-folder-open-outline" size="48" color="primary" class="mb-2 opacity-50" />
        <p class="text-secondary">لم يتم العثور على مشاريع تطابق البحث</p>
      </div>
      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>المشروع</th>
              <th>الوسوم والتقنيات</th>
              <th>الحالة</th>
              <th>المعاينة والكود</th>
              <th>الترتيب</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredProjects" :key="p.id">
              <td>
                <div class="d-flex align-center gap-3">
                  <img :src="p.image" :alt="p.title" class="table-thumb" />
                  <div>
                    <div class="table-title">{{ p.title }}</div>
                    <div class="table-slug">/project/{{ p.slug }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span v-for="t in (p.tags || []).slice(0, 3)" :key="t" class="badge-tag">{{ t }}</span>
                  <span v-if="(p.tags || []).length > 3" class="badge-tag">+{{ p.tags.length - 3 }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-column gap-1">
                  <v-chip size="x-small" :color="p.is_published ? 'success' : 'grey'" variant="tonal">
                    {{ p.is_published ? 'منشور' : 'مسودة' }}
                  </v-chip>
                  <v-chip v-if="p.is_featured" size="x-small" color="primary" variant="flat">
                    ★ مميز
                  </v-chip>
                </div>
              </td>
              <td>
                <div class="d-flex gap-2">
                  <a v-if="p.demo_url" :href="p.demo_url" target="_blank" class="table-action-icon" title="معاينة حية">
                    <v-icon icon="mdi-open-in-new" size="16" />
                  </a>
                  <a v-if="p.github_url" :href="p.github_url" target="_blank" class="table-action-icon" title="GitHub">
                    <v-icon icon="mdi-github" size="16" />
                  </a>
                </div>
              </td>
              <td>{{ p.sort_order }}</td>
              <td>
                <div class="d-flex gap-2">
                  <router-link :to="`/projects/${p.slug || p.id}`" target="_blank" class="table-action-icon" title="صفحة المشروع">
                    <v-icon icon="mdi-eye-outline" size="16" />
                  </router-link>
                  <button class="table-action-icon edit" @click="openEditDialog(p)" title="تعديل">
                    <v-icon icon="mdi-pencil-outline" size="16" />
                  </button>
                  <button class="table-action-icon delete" @click="confirmDelete(p)" title="حذف">
                    <v-icon icon="mdi-delete-outline" size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal with Tabbed Case Study Builder -->
    <v-dialog v-model="dialog" max-width="960" scrollable>
      <v-card class="admin-dialog-card" rounded="xl">
        <v-card-title class="dialog-header d-flex align-center justify-between">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="isEditing ? 'mdi-pencil-box-outline' : 'mdi-plus-box-outline'" color="primary" />
            <span class="font-weight-bold">{{ isEditing ? 'تعديل دراسة الحالة: ' + form.title : 'إضافة مشروع ودراسة حالة جديدة' }}</span>
          </div>
          <button class="close-btn" @click="dialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>

        <!-- Dialog Tabs Navigation -->
        <div class="dialog-tabs-bar">
          <button
            type="button"
            class="d-tab-btn"
            :class="{ active: activeFormTab === 'basic' }"
            @click="activeFormTab = 'basic'"
          >
            <v-icon icon="mdi-information-outline" size="18" class="ml-1" />
            <span>1. البيانات الأساسية</span>
          </button>
          <button
            type="button"
            class="d-tab-btn"
            :class="{ active: activeFormTab === 'casestudy' }"
            @click="activeFormTab = 'casestudy'"
          >
            <v-icon icon="mdi-file-document-edit-outline" size="18" class="ml-1" />
            <span>2. دراسة الحالة والحلول</span>
          </button>
          <button
            type="button"
            class="d-tab-btn"
            :class="{ active: activeFormTab === 'comparison' }"
            @click="activeFormTab = 'comparison'"
          >
            <v-icon icon="mdi-compare" size="18" class="ml-1" />
            <span>3. مقارنة قبل وبعد</span>
          </button>
          <button
            type="button"
            class="d-tab-btn"
            :class="{ active: activeFormTab === 'metrics' }"
            @click="activeFormTab = 'metrics'"
          >
            <v-icon icon="mdi-chart-line" size="18" class="ml-1" />
            <span>4. مؤشرات الأثر ({{ form.metrics?.length || 0 }})</span>
          </button>
          <button
            type="button"
            class="d-tab-btn"
            :class="{ active: activeFormTab === 'architecture' }"
            @click="activeFormTab = 'architecture'"
          >
            <v-icon icon="mdi-sitemap" size="18" class="ml-1" />
            <span>5. مخطط المعمارية والمسار</span>
          </button>
          <button
            type="button"
            class="d-tab-btn"
            :class="{ active: activeFormTab === 'client' }"
            @click="activeFormTab = 'client'"
          >
            <v-icon icon="mdi-comment-quote-outline" size="18" class="ml-1" />
            <span>6. شهادة العميل</span>
          </button>
        </div>

        <v-card-text class="pa-6">
          <v-form ref="projectForm">

            <!-- ═══════════════════════════════════════════
                 TAB 1: BASIC INFO & MEDIA
                 ═══════════════════════════════════════════ -->
            <div v-show="activeFormTab === 'basic'">
              <v-row>
                <v-col cols="12" md="8">
                  <label class="field-label">عنوان المشروع *</label>
                  <v-text-field
                    v-model="form.title"
                    placeholder="نظام إدارة المستودعات واللوجستيات"
                    variant="outlined"
                    density="comfortable"
                    :rules="[v => !!v || 'العنوان مطلوب']"
                    @update:model-value="autoGenerateSlug"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">المعرف اللطيف (Slug) *</label>
                  <v-text-field
                    v-model="form.slug"
                    placeholder="logistics-system"
                    variant="outlined"
                    density="comfortable"
                    :rules="[v => !!v || 'الـ Slug مطلوب']"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <label class="field-label">نطاق/تصنيف العمل (يدعم أي تخصص)</label>
                  <v-text-field
                    v-model="form.category"
                    placeholder="مثال: هندسة برمجيات / تصميم UI/UX / استشارات / رعاية صحية"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">الدور المهني</label>
                  <v-text-field
                    v-model="form.role"
                    placeholder="مثال: Lead Full Stack Engineer / Senior UI Designer"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">سنة الإنجاز</label>
                  <v-text-field
                    v-model="form.year"
                    placeholder="مثال: 2024 - 2025"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>

                <!-- Main Image Upload -->
                <v-col cols="12">
                  <div class="project-image-box p-4">
                    <label class="field-label mb-2">الصورة الرئيسية للعمل (تظهر في الكروت والمحاكي)</label>
                    <div class="d-flex align-center gap-4 flex-wrap">
                      <div class="proj-img-preview">
                        <img :src="form.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'" alt="Preview" />
                        <div v-if="uploadingProjectImg" class="img-upload-overlay">
                          <v-progress-circular indeterminate color="primary" size="28" />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <input
                          type="file"
                          ref="projFileInput"
                          class="d-none"
                          accept="image/*"
                          @change="handleProjectImageUpload($event, 'image')"
                        />
                        <button
                          type="button"
                          class="btn btn-primary btn-sm mb-2"
                          :disabled="uploadingProjectImg"
                          @click="$refs.projFileInput.click()"
                        >
                          <v-icon icon="mdi-cloud-upload-outline" size="16" class="ml-1" />
                          رفع الصورة من جهازك
                        </button>
                        <v-text-field
                          v-model="form.image"
                          placeholder="أو الصق رابط الصورة مباشرة..."
                          variant="outlined"
                          density="compact"
                          hide-details
                        />
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="4">
                  <ColorPickerInput
                    v-model="form.accent_color"
                    label="اللون التمييزي للمشروع"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">رابط المعاينة الحية (Live Demo)</label>
                  <v-text-field
                    v-model="form.demo_url"
                    placeholder="https://demo.example.com"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-open-in-new"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <label class="field-label">رابط المستودع / الملفات (GitHub/Behance)</label>
                  <v-text-field
                    v-model="form.github_url"
                    placeholder="https://github.com/..."
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-github"
                  />
                </v-col>

                <v-col cols="12" sm="4">
                  <v-switch v-model="form.is_published" color="success" label="منشور في الموقع" hide-details />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-switch v-model="form.is_featured" color="primary" label="مشروع مميز (Featured)" hide-details />
                </v-col>
                <v-col cols="12" sm="4">
                  <label class="field-label">الترتيب في العرض</label>
                  <v-text-field v-model.number="form.sort_order" type="number" variant="outlined" density="compact" hide-details />
                </v-col>
              </v-row>
            </div>

            <!-- ═══════════════════════════════════════════
                 TAB 2: CASE STUDY & PROBLEM / SOLUTION
                 ═══════════════════════════════════════════ -->
            <div v-show="activeFormTab === 'casestudy'">
              <v-row>
                <v-col cols="12">
                  <label class="field-label">الوصف المختصر (يظهر في الكروت والبطاقات) *</label>
                  <v-textarea
                    v-model="form.short_description"
                    placeholder="نبذة مركزة عن المشروع أو العمل..."
                    variant="outlined"
                    rows="2"
                    :rules="[v => !!v || 'الوصف المختصر مطلوب']"
                  />
                </v-col>

                <v-col cols="12">
                  <label class="field-label">الوصف الكامل والموسع</label>
                  <v-textarea
                    v-model="form.full_description"
                    placeholder="شرح تفصيلي لدراسة الحالة والنتائج المحققة..."
                    variant="outlined"
                    rows="3"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <label class="field-label">السياق وتحدي المشروع (Problem & Challenge)</label>
                  <v-textarea
                    v-model="form.problem"
                    placeholder="ما هي المشكلة الأساسية التي واجهت العميل أو المؤسسة؟"
                    variant="outlined"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <label class="field-label">منهجية التنفيذ والحل (Approach & Solution)</label>
                  <v-textarea
                    v-model="form.architecture"
                    placeholder="كيف تم حل المشكلة وما هي الآلية والحلول المطبقة؟"
                    variant="outlined"
                    rows="3"
                  />
                </v-col>

                <!-- Objectives -->
                <v-col cols="12">
                  <label class="field-label">الأهداف المحددة (Objectives)</label>
                  <div class="d-flex gap-2 mb-2">
                    <v-text-field
                      v-model="newObjective"
                      placeholder="اكتب هدفاً ثم اضغط إضافة..."
                      variant="outlined"
                      density="compact"
                      hide-details
                      @keydown.enter.prevent="addObjective"
                    />
                    <v-btn color="success" variant="tonal" @click="addObjective">إضافة</v-btn>
                  </div>
                  <div class="d-flex flex-wrap gap-2 mt-2">
                    <v-chip
                      v-for="(obj, idx) in form.objectives" :key="idx"
                      closable
                      size="small"
                      color="success"
                      variant="tonal"
                      @click:close="removeObjective(idx)"
                    >
                      {{ obj }}
                    </v-chip>
                  </div>
                </v-col>

                <!-- Features -->
                <v-col cols="12">
                  <label class="field-label">أبرز المخرجات والمميزات (Features)</label>
                  <div class="d-flex gap-2 mb-2">
                    <v-text-field
                      v-model="newFeature"
                      placeholder="اكتب ميزة أو مخرجاً تم تسليمه..."
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
                      @click:close="removeFeature(idx)"
                    >
                      {{ f }}
                    </v-chip>
                  </div>
                </v-col>

                <!-- Tags -->
                <v-col cols="12">
                  <label class="field-label">المهارات والأدوات المستخدمة (Tags)</label>
                  <div class="d-flex gap-2 mb-2">
                    <v-text-field
                      v-model="newTag"
                      placeholder="أضف مهارة أو تقنية (مثال: Vue 3, Django, Figma, Photoshop, Strategic Planning...)"
                      variant="outlined"
                      density="compact"
                      hide-details
                      @keydown.enter.prevent="addTag"
                    />
                    <v-btn color="cyan" variant="tonal" @click="addTag">إضافة</v-btn>
                  </div>
                  <div class="d-flex flex-wrap gap-2 mt-2">
                    <v-chip
                      v-for="(t, idx) in form.tags" :key="idx"
                      closable
                      size="small"
                      color="cyan"
                      variant="tonal"
                      @click:close="removeTag(idx)"
                    >
                      {{ t }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- ═══════════════════════════════════════════
                 TAB 3: BEFORE & AFTER COMPARISON
                 ═══════════════════════════════════════════ -->
            <div v-show="activeFormTab === 'comparison'">
              <v-row>
                <!-- Before Image Upload -->
                <v-col cols="12" md="6">
                  <div class="project-image-box p-3">
                    <label class="field-label mb-2 text-danger">صورة ما قبل التنفيذ (Before Image)</label>
                    <div class="d-flex align-center gap-3 flex-wrap">
                      <div class="proj-img-preview mini">
                        <img :src="form.before_image || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80'" alt="Before Preview" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <input
                          type="file"
                          ref="beforeFileInput"
                          class="d-none"
                          accept="image/*"
                          @change="handleProjectImageUpload($event, 'before_image')"
                        />
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm mb-2"
                          @click="$refs.beforeFileInput.click()"
                        >
                          <v-icon icon="mdi-cloud-upload-outline" size="14" class="ml-1" />
                          رفع صورة قبل البدء
                        </button>
                        <v-text-field
                          v-model="form.before_image"
                          placeholder="رابط صورة قبل البدء..."
                          variant="outlined"
                          density="compact"
                          hide-details
                        />
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- After Image Upload -->
                <v-col cols="12" md="6">
                  <div class="project-image-box p-3">
                    <label class="field-label mb-2 text-success">صورة بعد الإنجاز (After Image)</label>
                    <div class="d-flex align-center gap-3 flex-wrap">
                      <div class="proj-img-preview mini">
                        <img :src="form.after_image || form.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'" alt="After Preview" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <input
                          type="file"
                          ref="afterFileInput"
                          class="d-none"
                          accept="image/*"
                          @change="handleProjectImageUpload($event, 'after_image')"
                        />
                        <button
                          type="button"
                          class="btn btn-primary btn-sm mb-2"
                          @click="$refs.afterFileInput.click()"
                        >
                          <v-icon icon="mdi-cloud-upload-outline" size="14" class="ml-1" />
                          رفع صورة بعد الإنجاز
                        </button>
                        <v-text-field
                          v-model="form.after_image"
                          placeholder="رابط صورة بعد الإنجاز..."
                          variant="outlined"
                          density="compact"
                          hide-details
                        />
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Before Notes (Challenges) -->
                <v-col cols="12" md="6">
                  <label class="field-label text-danger">نقاط وتحديات الوضع السابق (قبل البدء)</label>
                  <div class="d-flex gap-2 mb-2">
                    <v-text-field
                      v-model="newBeforeNote"
                      placeholder="مثال: بطء النظام وتكرار الأخطاء..."
                      variant="outlined"
                      density="compact"
                      hide-details
                      @keydown.enter.prevent="addBeforeNote"
                    />
                    <v-btn color="error" variant="tonal" @click="addBeforeNote">إضافة</v-btn>
                  </div>
                  <div class="notes-list-box">
                    <div v-for="(n, i) in form.before_notes" :key="i" class="note-chip-row before">
                      <span>{{ n }}</span>
                      <button type="button" class="del-note-btn" @click="removeBeforeNote(i)">✕</button>
                    </div>
                  </div>
                </v-col>

                <!-- After Notes (Results) -->
                <v-col cols="12" md="6">
                  <label class="field-label text-success">مخرجات وحلول الوضع بعد الإنجاز (بعد التحسين)</label>
                  <div class="d-flex gap-2 mb-2">
                    <v-text-field
                      v-model="newAfterNote"
                      placeholder="مثال: واجهات سريعة وتجاوب كامل..."
                      variant="outlined"
                      density="compact"
                      hide-details
                      @keydown.enter.prevent="addAfterNote"
                    />
                    <v-btn color="success" variant="tonal" @click="addAfterNote">إضافة</v-btn>
                  </div>
                  <div class="notes-list-box">
                    <div v-for="(n, i) in form.after_notes" :key="i" class="note-chip-row after">
                      <span>{{ n }}</span>
                      <button type="button" class="del-note-btn" @click="removeAfterNote(i)">✕</button>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- ═══════════════════════════════════════════
                 TAB 4: METRICS & IMPACT BUILDER
                 ═══════════════════════════════════════════ -->
            <div v-show="activeFormTab === 'metrics'">
              <div class="d-flex align-center justify-between mb-4">
                <div>
                  <h4 class="font-weight-bold" style="color:var(--t1)">مؤشرات الأداء والنتائج المحققة</h4>
                  <p class="text-caption text-secondary">أضف كروت إحصائية مخصصة تظهر في دراسة الحالة بأرقام واقعية.</p>
                </div>
                <button type="button" class="btn btn-primary btn-sm" @click="addMetricItem">
                  <v-icon icon="mdi-plus" size="16" class="ml-1" />
                  <span>إضافة مؤشر قياسي جديد</span>
                </button>
              </div>

              <div v-if="!form.metrics || form.metrics.length === 0" class="empty-metrics-box text-center py-6">
                <v-icon icon="mdi-chart-bell-curve-cumulative" size="36" color="primary" class="mb-2 opacity-50" />
                <p class="text-secondary text-caption mb-3">لم تتم إضافة مؤشرات مخصصة (سيتم عرض المؤشرات الافتراضية الذكية).</p>
                <button type="button" class="btn btn-ghost btn-sm" @click="populateDefaultMetrics">
                  <v-icon icon="mdi-auto-fix" size="14" class="ml-1" />
                  <span>تعبئة مؤشرات نموذجية جاهزة</span>
                </button>
              </div>

              <div v-else class="metrics-builder-grid">
                <div v-for="(m, idx) in form.metrics" :key="idx" class="metric-builder-card">
                  <div class="d-flex align-center justify-between mb-2">
                    <span class="font-weight-bold text-caption text-primary">المؤشر #{{ idx + 1 }}</span>
                    <button type="button" class="del-note-btn" @click="removeMetricItem(idx)" title="حذف المؤشر">✕</button>
                  </div>
                  <v-row dense>
                    <v-col cols="12" sm="4">
                      <v-text-field v-model="m.value" label="القيمة (مثال: +55% أو 99.9%)" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12" sm="8">
                      <v-text-field v-model="m.label" label="اسم المؤشر (مثال: سرعة التحميل)" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field v-model="m.badge" label="الشارة (مثال: ↑ نمو مضاعف)" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12" sm="8">
                      <v-text-field v-model="m.desc" label="الشرح المختصر للمؤشر" variant="outlined" density="compact" />
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════
                 TAB 5: ARCHITECTURE & WORKFLOW STAGES
                 ═══════════════════════════════════════════ -->
            <div v-show="activeFormTab === 'architecture'">
              <div class="d-flex align-center justify-between mb-4">
                <div>
                  <h4 class="font-weight-bold" style="color:var(--t1)">مراحل المعمارية أو مسار العمل المخصص</h4>
                  <p class="text-caption text-secondary">خصص مراحل العمل من أبحاث، تصميم، خوادم، أو بروتوكولات.</p>
                </div>
                <button type="button" class="btn btn-primary btn-sm" @click="addArchitectureStage">
                  <v-icon icon="mdi-plus" size="16" class="ml-1" />
                  <span>إضافة مرحلة / طبقة جديدة</span>
                </button>
              </div>

              <div v-if="!form.architecture_stages || form.architecture_stages.length === 0" class="empty-metrics-box text-center py-6">
                <v-icon icon="mdi-sitemap" size="36" color="primary" class="mb-2 opacity-50" />
                <p class="text-secondary text-caption mb-3">لم يتم تحديد مراحل مخصصة (يتم تكييف المراحل تلقائياً حسب تصنيف المشروع).</p>
                <button type="button" class="btn btn-ghost btn-sm" @click="populateDefaultStages">
                  <v-icon icon="mdi-auto-fix" size="14" class="ml-1" />
                  <span>تعبئة مراحل نموذجية</span>
                </button>
              </div>

              <div v-else class="stages-builder-grid">
                <div v-for="(st, idx) in form.architecture_stages" :key="idx" class="stage-builder-card">
                  <div class="d-flex align-center justify-between mb-2">
                    <span class="font-weight-bold text-caption text-primary">المرحلة / الطبقة #0{{ idx + 1 }}</span>
                    <button type="button" class="del-note-btn" @click="removeArchitectureStage(idx)" title="حذف">✕</button>
                  </div>
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="st.title" label="عنوان المرحلة (مثال: طبقة الواجهات أو أبحاث المستخدم)" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="st.subtitle" label="العنوان الفرعي (مثال: المرحلة الأولى)" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="st.description" label="شرح تفاصيل هذه المرحلة" variant="outlined" rows="2" density="compact" />
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════════════════
                 TAB 6: CLIENT TESTIMONIAL
                 ═══════════════════════════════════════════ -->
            <div v-show="activeFormTab === 'client'">
              <v-row>
                <v-col cols="12" md="6">
                  <label class="field-label">اسم العميل أو المؤسسة المستفيدة</label>
                  <v-text-field
                    v-model="form.client_name"
                    placeholder="مثال: شركة التطوير اللوجستي المتقدمة"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-domain"
                  />
                </v-col>
                <v-col cols="12">
                  <label class="field-label">اقتباس أو شهادة العميل عن المشروع</label>
                  <v-textarea
                    v-model="form.testimonial_quote"
                    placeholder="اكتب شهادة العميل أو تقييمه لجودة العمل والالتزام بالمواعيد..."
                    variant="outlined"
                    rows="4"
                  />
                </v-col>
              </v-row>
            </div>
</v-form>
        </v-card-text>

        <v-card-actions class="px-6 pb-6 pt-2 dialog-footer">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" :loading="saving" @click="saveProject">
            {{ isEditing ? 'حفظ التعديلات' : 'إضافة المشروع' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unified Confirm Delete Modal -->
    <ConfirmDeleteModal
      v-model="deleteDialog"
      title="تأكيد حذف المشروع"
      :item-name="projectToDelete?.title"
      item-type="مشروع ودراسة حالة"
      warning-text="تنبيه: سيتم حذف هذا المشروع وكافة صوره وتفاصيله ومعماريته نهائياً من الموقع."
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

import { ref, computed, onMounted } from 'vue'
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
const uploadingProjectImg = ref(false)
const projFileInput = ref(null)
const beforeFileInput = ref(null)
const afterFileInput = ref(null)

const activeFormTab = ref('basic')

const projectsList = ref([])
const search = ref('')
const statusFilter = ref('الكل')

const dialog = ref(false)
const isEditing = ref(false)
const editId = ref(null)

const newFeature = ref('')
const newObjective = ref('')
const newTag = ref('')
const newBeforeNote = ref('')
const newAfterNote = ref('')

const deleteDialog = ref(false)
const projectToDelete = ref(null)
const projectForm = ref(null)

const defaultForm = () => ({
  title: '',
  slug: '',
  category: '',
  role: '',
  year: '',
  short_description: '',
  full_description: '',
  problem: '',
  architecture: '',
  features: [],
  objectives: [],
  metrics: [],
  tags: [],
  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
  before_image: '',
  after_image: '',
  client_name: '',
  testimonial_quote: '',
  before_notes: [],
  after_notes: [],
  architecture_stages: [],
  demo_url: '',
  github_url: '',
  accent_color: '#7B6EF6',
  sort_order: 1,
  is_featured: false,
  is_published: true,
})

const form = ref(defaultForm())

function autoGenerateSlug(val) {
  if (!isEditing.value && val) {
    form.value.slug = val.trim().toLowerCase().replace(/[\s\W-]+/g, '-')
  }
}

function addFeature() {
  if (newFeature.value.trim()) {
    form.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}
function removeFeature(idx) {
  form.value.features.splice(idx, 1)
}

function addObjective() {
  if (newObjective.value.trim()) {
    form.value.objectives.push(newObjective.value.trim())
    newObjective.value = ''
  }
}
function removeObjective(idx) {
  form.value.objectives.splice(idx, 1)
}

function addTag() {
  if (newTag.value.trim()) {
    form.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}
function removeTag(idx) {
  form.value.tags.splice(idx, 1)
}

function addBeforeNote() {
  if (newBeforeNote.value.trim()) {
    if (!Array.isArray(form.value.before_notes)) form.value.before_notes = []
    form.value.before_notes.push(newBeforeNote.value.trim())
    newBeforeNote.value = ''
  }
}
function removeBeforeNote(idx) {
  form.value.before_notes.splice(idx, 1)
}

function addAfterNote() {
  if (newAfterNote.value.trim()) {
    if (!Array.isArray(form.value.after_notes)) form.value.after_notes = []
    form.value.after_notes.push(newAfterNote.value.trim())
    newAfterNote.value = ''
  }
}
function removeAfterNote(idx) {
  form.value.after_notes.splice(idx, 1)
}

// Metrics builders
function addMetricItem() {
  if (!Array.isArray(form.value.metrics)) form.value.metrics = []
  form.value.metrics.push({
    value: '+50%',
    label: 'مؤشر أداء جديد',
    badge: '↑ نمو ملحوظ',
    desc: 'وصف التحسين والأثر الفعلي',
    icon: 'mdi-trending-up'
  })
}
function removeMetricItem(idx) {
  form.value.metrics.splice(idx, 1)
}
function populateDefaultMetrics() {
  form.value.metrics = [
    { value: '+55%', label: 'سرعة الاستجابة والمعالجة', badge: '↑ أداء مضاعف', desc: 'تقليل زمن التحميل بنسبة 55%', icon: 'mdi-rocket-launch-outline' },
    { value: '+70%', label: 'معدل التفاعل والإنجاز', badge: '↑ نمو مستمر', desc: 'زيادة إنتاجية المستخدمين وتفاعلهم', icon: 'mdi-account-group-outline' },
    { value: '99.98%', label: 'استقرار النظام والموثوقية', badge: 'استقرار كامل', desc: 'جاهزية تامة دون انقطاع للخدمة', icon: 'mdi-shield-check-outline' },
    { value: '-35%', label: 'تقليل التكاليف التشغيلية', badge: '↓ توفير فعال', desc: 'أتمتة المهام وتوفير الجهد البشري', icon: 'mdi-cash-fast' }
  ]
}

// Architecture Stages builders
function addArchitectureStage() {
  if (!Array.isArray(form.value.architecture_stages)) form.value.architecture_stages = []
  form.value.architecture_stages.push({
    title: 'مرحلة عمل جديدة',
    subtitle: `المرحلة ${form.value.architecture_stages.length + 1}`,
    description: 'شرح تفاصيل هذه المرحلة والأدوات المعتمدة',
    icon: 'mdi-layers-outline',
    color: '#38BDF8',
    tools: []
  })
}
function removeArchitectureStage(idx) {
  form.value.architecture_stages.splice(idx, 1)
}
function populateDefaultStages() {
  form.value.architecture_stages = [
    { title: 'طبقة الواجهات وتجربة المستخدم', subtitle: 'المرحلة 01: Client Layer', description: 'واجهات تفاعلية متجاوبة بأحدث المعايير', icon: 'mdi-laptop-account', color: '#38BDF8', tools: ['Vue.js 3', 'Vite', 'Pinia'] },
    { title: 'طبقة خادم المنطق ومعالجة الـ API', subtitle: 'المرحلة 02: Backend Logic', description: 'خوادم REST API مؤمنة تعتمد معمارية نظيفة', icon: 'mdi-server-network', color: '#818CF8', tools: ['Django', 'Python', 'JWT'] },
    { title: 'قواعد البيانات والتخزين المؤقت', subtitle: 'المرحلة 03: Database & Cache', description: 'قواعد بيانات سريعة مع كاش متقدم', icon: 'mdi-database-check-outline', color: '#F59E0B', tools: ['PostgreSQL', 'Redis'] },
    { title: 'البنية السحابية والنشر المؤتمت', subtitle: 'المرحلة 04: Cloud & DevOps', description: 'نشر تلقائي عبر CI/CD وحماية SSL', icon: 'mdi-cloud-lock-outline', color: '#10B981', tools: ['Docker', 'Nginx', 'GitHub Actions'] }
  ]
}

async function handleProjectImageUpload(e, targetField = 'image') {
  const file = e.target.files?.[0]
  if (!file) return

  uploadingProjectImg.value = true
  try {
    const res = await adminService.uploadMedia(file, `proj_${targetField}_${file.name}`)
    const uploadedUrl = res?.file_url || res?.file
    if (uploadedUrl) {
      form.value[targetField] = uploadedUrl
      adminStore.notify('تم رفع الصورة بنجاح!', 'success')
    }
  } catch (err) {
    adminStore.notify(err.message || 'فشل رفع الصورة', 'error')
  } finally {
    uploadingProjectImg.value = false
    if (e.target) e.target.value = ''
  }
}

const filteredProjects = computed(() => {
  return projectsList.value.filter(p => {
    const matchesSearch = !search.value ||
      p.title.toLowerCase().includes(search.value.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(search.value.toLowerCase()) ||
      (p.tags || []).some(t => t.toLowerCase().includes(search.value.toLowerCase()))

    let matchesStatus = true
    if (statusFilter.value === 'المنشورة') matchesStatus = p.is_published
    else if (statusFilter.value === 'المسودات') matchesStatus = !p.is_published
    else if (statusFilter.value === 'المميزة فقط') matchesStatus = p.is_featured

    return matchesSearch && matchesStatus
  })
})

async function fetchProjects() {
  loading.value = true
  try {
    const data = await adminService.getProjects()
    projectsList.value = Array.isArray(data) ? data : (data.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل قائمة المشاريع', 'error')
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  isEditing.value = false
  editId.value = null
  form.value = defaultForm()
  activeFormTab.value = 'basic'
  dialog.value = true
}

function openEditDialog(p) {
  isEditing.value = true
  editId.value = p.id
  activeFormTab.value = 'basic'
  form.value = {
    ...defaultForm(),
    ...p,
    features: Array.isArray(p.features) ? [...p.features] : [],
    objectives: Array.isArray(p.objectives) ? [...p.objectives] : [],
    metrics: Array.isArray(p.metrics) ? [...p.metrics] : [],
    tags: Array.isArray(p.tags) ? [...p.tags] : [],
    before_notes: Array.isArray(p.before_notes) ? [...p.before_notes] : [],
    after_notes: Array.isArray(p.after_notes) ? [...p.after_notes] : [],
    architecture_stages: Array.isArray(p.architecture_stages) ? [...p.architecture_stages] : []}
  dialog.value = true
}


async function saveProject() {
  const { valid } = await projectForm.value.validate()
  if (!valid) {
    activeFormTab.value = 'basic'
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      await adminService.updateProject(editId.value, form.value)
      adminStore.notify('تم تحديث دراسة حالة المشروع بنجاح!', 'success')
    } else {
      await adminService.createProject(form.value)
      adminStore.notify('تمت إضافة المشروع الجديد بنجاح!', 'success')
    }
    dialog.value = false
    await fetchProjects()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ المشروع', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(p) {
  projectToDelete.value = p
  deleteDialog.value = true
}

async function executeDelete() {
  if (!projectToDelete.value) return
  deleting.value = true
  try {
    await adminService.deleteProject(projectToDelete.value.id)
    adminStore.notify('تم حذف المشروع بنجاح', 'info')
    deleteDialog.value = false
    await fetchProjects()
    await portfolioStore.fetchPublicContent()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حذف المشروع', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchProjects()
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
  padding: 14px 16px;
  font-size: 0.78rem; font-weight: 800; color: var(--t3);
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
  letter-spacing: 0.02em;
}
.admin-table td {
  padding: 15px 16px;
  font-size: 0.88rem;
  color: var(--t1);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.admin-table tr:hover td {
  background: var(--bg-subtle);
}

.table-thumb {
  width: 54px; height: 40px; border-radius: 8px;
  object-fit: cover; border: 1px solid var(--border);
  transition: transform 0.2s ease;
}
.table-thumb:hover {
  transform: scale(1.08);
}
.table-title { font-weight: 800; color: var(--t1); font-size: 0.92rem; }
.table-slug { font-size: 0.72rem; color: var(--t3); font-family: monospace; direction: ltr; text-align: right; }

.badge-tag {
  font-size: 0.7rem; padding: 3px 8px; border-radius: 6px;
  background: var(--bg-subtle); color: var(--t2); border: 1px solid var(--border);
  font-weight: 600;
}

.table-action-icon {
  width: 34px; height: 34px; border-radius: 9px;
  background: var(--bg-subtle); border: 1px solid var(--border);
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--t2); cursor: pointer; text-decoration: none;
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

.field-label { font-size: 0.8rem; font-weight: 700; color: var(--t2); margin-bottom: 6px; display: block; }
.close-btn { background: transparent; border: none; color: var(--t3); cursor: pointer; padding: 4px; border-radius: 6px; }
.close-btn:hover { color: var(--t1); background: var(--bg-subtle); }

.project-image-box {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.proj-img-preview {
  width: 100px; height: 75px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border-h);
  background: var(--bg-3);
  flex-shrink: 0;
}
.proj-img-preview.mini {
  width: 80px; height: 60px;
}
.proj-img-preview img { width: 100%; height: 100%; object-fit: cover; }
.img-upload-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
}

/* Modal Tabs Navigation */
.dialog-tabs-bar {
  display: flex;
  background: var(--bg-subtle, #0F172A);
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.1));
  padding: 8px 16px;
  overflow-x: auto;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 10;
}
.d-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: 10px;
  color: var(--t2, #94A3B8);
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--f-body, 'Cairo', sans-serif);
  transition: all 0.2s ease;
}
.d-tab-btn:hover {
  color: var(--t1, #FFFFFF);
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-h, rgba(255, 255, 255, 0.2));
}
.d-tab-btn.active {
  color: #FFFFFF;
  background: var(--primary, #3B82F6);
  border-color: var(--primary, #3B82F6);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Notes & Builders */
.notes-list-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.note-chip-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.84rem;
  line-height: 1.4;
}
.note-chip-row.before {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #EF4444;
}
.note-chip-row.after {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10B981;
}
.del-note-btn {
  background: transparent;
  border: none;
  color: var(--t3);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.del-note-btn:hover {
  color: #EF4444;
}

.metrics-builder-grid, .stages-builder-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.metric-builder-card, .stage-builder-card {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.empty-metrics-box {
  border: 1px dashed var(--border);
  border-radius: 12px;
  background: var(--bg-subtle);
}
</style>
