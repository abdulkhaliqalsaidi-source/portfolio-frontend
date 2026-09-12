<template>
  <div class="admin-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="page-header-info">
        <h1 class="page-title">إدارة المدونة والمقالات</h1>
        <p class="page-subtitle">كتابة ونشر المقالات والرؤى المتخصصة في كافة المجالات بمحرر مرئي سهل ومحرر Markdown متقدم.</p>
      </div>
      <div class="page-header-actions d-flex align-center gap-3">
        <router-link to="/blog" target="_blank" class="btn btn-ghost btn-sm">
          <v-icon icon="mdi-open-in-new" size="16" class="ml-1" />
          <span>معاينة المدونة</span>
        </router-link>
        <button class="btn btn-primary" @click="openCreateModal">
          <v-icon icon="mdi-plus" size="18" class="ml-1" />
          <span>كتابة مقال جديد</span>
        </button>
      </div>
    </div>

    <!-- Stats Overview Cards -->
    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="3">
        <div class="admin-card stat-summary-card">
          <div class="stat-icon-wrap blue">
            <v-icon icon="mdi-newspaper-variant-multiple" size="24" color="#3B82F6" />
          </div>
          <div>
            <div class="stat-number">{{ posts.length }}</div>
            <div class="stat-title">إجمالي المقالات</div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="admin-card stat-summary-card">
          <div class="stat-icon-wrap green">
            <v-icon icon="mdi-check-decagram" size="24" color="#10B981" />
          </div>
          <div>
            <div class="stat-number">{{ publishedCount }}</div>
            <div class="stat-title">المقالات المنشورة</div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="admin-card stat-summary-card">
          <div class="stat-icon-wrap amber">
            <v-icon icon="mdi-star" size="24" color="#F59E0B" />
          </div>
          <div>
            <div class="stat-number">{{ featuredCount }}</div>
            <div class="stat-title">مقالات مميزة</div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="admin-card stat-summary-card">
          <div class="stat-icon-wrap purple">
            <v-icon icon="mdi-eye" size="24" color="#8B5CF6" />
          </div>
          <div>
            <div class="stat-number">{{ totalViews }}</div>
            <div class="stat-title">إجمالي المشاهدات</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Filters & Search Toolbar -->
    <div class="admin-card mb-6">
      <v-row align="center">
        <v-col cols="12" sm="6" md="5">
          <v-text-field
            v-model="searchQuery"
            placeholder="بحث بالعنوان، التصنيف، أو الكلمات المفتاحية..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
          />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="filterCategory"
            :items="['الكل', ...uniqueCategories]"
            variant="outlined"
            density="compact"
            hide-details
            label="التصنيف والتخصص"
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="filterStatus"
            :items="[
              { title: 'جميع الحالات', value: 'ALL' },
              { title: 'منشور فقط', value: 'PUBLISHED' },
              { title: 'مسودة فقط', value: 'DRAFT' }
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            hide-details
            label="حالة النشر"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Posts Table -->
    <div class="admin-card">
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" class="mb-2" />
        <div class="text-secondary">جاري تحميل المقالات...</div>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
        <v-icon icon="mdi-file-document-outline" size="48" color="primary" class="mb-2 opacity-50" />
        <h4 class="text-secondary">لا توجد مقالات مطابقة</h4>
        <p class="text-caption text-secondary mt-1">اضغط على "كتابة مقال جديد" للبدء في نشر أول تدوينة.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="width:70px">الغلاف</th>
              <th>عنوان المقال</th>
              <th>التصنيف / التخصص</th>
              <th>وقت القراءة</th>
              <th>المشاهدات</th>
              <th>الحالة</th>
              <th>تاريخ النشر</th>
              <th style="width:130px; text-align:center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in filteredPosts" :key="post.id">
              <td>
                <div class="table-thumb-wrap">
                  <img :src="post.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&auto=format&fit=crop&q=80'" class="table-thumb" />
                </div>
              </td>
              <td>
                <div class="table-title">{{ post.title }}</div>
                <div class="table-slug font-mono text-caption text-secondary">/blog/{{ post.slug }}</div>
              </td>
              <td>
                <span class="badge-tag font-weight-bold">{{ post.category }}</span>
              </td>
              <td>
                <span class="text-caption font-weight-bold">{{ post.reading_time_minutes || 3 }} د</span>
              </td>
              <td>
                <span class="text-caption font-weight-bold">{{ post.views_count || 0 }}</span>
              </td>
              <td>
                <div class="d-flex align-center gap-1">
                  <v-chip size="x-small" :color="post.is_published ? 'success' : 'grey'" variant="tonal">
                    {{ post.is_published ? 'منشور' : 'مسودة' }}
                  </v-chip>
                  <v-chip v-if="post.is_featured" size="x-small" color="warning" variant="flat">
                    ★ مميز
                  </v-chip>
                </div>
              </td>
              <td>
                <span class="text-caption text-secondary">{{ formatDate(post.published_at) }}</span>
              </td>
              <td>
                <div class="d-flex align-center justify-center gap-2">
                  <router-link :to="`/blog/${post.slug || post.id}`" target="_blank" class="table-action-icon" title="معاينة">
                    <v-icon icon="mdi-eye-outline" size="16" />
                  </router-link>
                  <button class="table-action-icon edit" @click="openEditModal(post)" title="تعديل">
                    <v-icon icon="mdi-pencil-outline" size="16" />
                  </button>
                  <button class="table-action-icon delete" @click="confirmDelete(post)" title="حذف">
                    <v-icon icon="mdi-delete-outline" size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         MODAL: CREATE / EDIT BLOG POST
         ══════════════════════════════════════════ -->
    <v-dialog
      v-model="modalOpen"
      max-width="1150"
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card class="admin-dialog-card" rounded="xl" dir="rtl">
        <!-- Modal Head -->
        <v-card-title class="dialog-header d-flex align-center justify-between pa-4">
          <div class="d-flex align-center gap-2">
            <v-icon :icon="isEditing ? 'mdi-file-edit-outline' : 'mdi-plus-box-outline'" color="primary" size="24" />
            <span class="font-weight-bold text-h6">{{ isEditing ? 'تعديل المقال' : 'كتابة مقال جديد' }}</span>
          </div>
          <button class="close-btn" @click="modalOpen = false">
            <v-icon icon="mdi-close" size="20" />
          </button>
        </v-card-title>

        <!-- Modal Tabs Bar -->
        <div class="dialog-tabs-bar">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'content' }"
            @click="activeTab = 'content'"
          >
            <v-icon icon="mdi-text-box-edit-outline" size="16" class="ml-1" />
            <span>1. المحتوى والتحرير</span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: activeTab === 'media' }"
            @click="activeTab = 'media'"
          >
            <v-icon icon="mdi-image-outline" size="16" class="ml-1" />
            <span>2. الغلاف والوسائط</span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: activeTab === 'seo' }"
            @click="activeTab = 'seo'"
          >
            <v-icon icon="mdi-google" size="16" class="ml-1" />
            <span>3. تحسين محركات البحث (SEO)</span>
          </button>

          <button
            class="tab-btn"
            :class="{ active: activeTab === 'settings' }"
            @click="activeTab = 'settings'"
          >
            <v-icon icon="mdi-cog-outline" size="16" class="ml-1" />
            <span>4. الإعدادات والوسوم</span>
          </button>
        </div>

        <!-- Modal Body (Tabs Content) -->
        <v-card-text class="pa-6">
          
          <!-- TAB 1: CONTENT & DUAL-MODE SMART EDITOR -->
          <div v-show="activeTab === 'content'">
            <v-row>
              <v-col cols="12">
                <label class="field-label">عنوان المقال *</label>
                <v-text-field
                  v-model="form.title"
                  placeholder="مثال: دليلك الشامل لبناء وتصميم بنية الأنظمة السحابية"
                  variant="outlined"
                  density="comfortable"
                  @input="autoGenerateSlug"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">الرابط الدائم (Slug) *</label>
                <v-text-field
                  v-model="form.slug"
                  placeholder="cloud-architecture-guide"
                  variant="outlined"
                  density="comfortable"
                  class="font-mono text-ltr"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">التصنيف / التخصص *</label>
                <v-combobox
                  v-model="form.category"
                  :items="[
                    'هندسة البرمجيات والتطوير',
                    'تصميم واجهات وتجربة المستخدم UI/UX',
                    'إدارة واستراتيجيات الأعمال',
                    'استشارات وطب وصحة',
                    'الذكاء الاصطناعي وعلوم البيانات',
                    'تسويق رقمي وصناعة محتوى',
                    'دروس وشروحات عملية'
                  ]"
                  placeholder="اختر أو اكتب التخصص..."
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <label class="field-label">المقتطف / النبذة المختصرة (Lead Excerpt)</label>
                <v-textarea
                  v-model="form.excerpt"
                  rows="2"
                  placeholder="مقدمة مشوقة تلخص فكرة المقال وتظهر في الكروت وبداية الصفحة..."
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <!-- ═════════════════════════════════════════════════════════════════
                 DUAL-MODE SMART RICH TEXT & MARKDOWN EDITOR
                 ═════════════════════════════════════════════════════════════════ -->
            <div class="smart-editor-container mt-4">
              <!-- Mode Switch Header -->
              <div class="editor-mode-switcher-bar">
                <div class="d-flex align-center gap-2">
                  <button
                    type="button"
                    class="mode-pill-btn"
                    :class="{ active: editorMode === 'visual' }"
                    @click="switchEditorMode('visual')"
                  >
                    <v-icon icon="mdi-draw" size="16" class="ml-1" />
                    <span>✍️ المحرر المرئي (سهل ومباشر مثل Word)</span>
                  </button>

                  <button
                    type="button"
                    class="mode-pill-btn"
                    :class="{ active: editorMode === 'markdown' }"
                    @click="switchEditorMode('markdown')"
                  >
                    <v-icon icon="mdi-code-braces" size="16" class="ml-1" />
                    <span>💻 نمط Markdown (للمطورين والرموز)</span>
                  </button>
                </div>

                <div class="d-flex align-center gap-3">
                  <span class="text-caption text-secondary">
                    {{ wordCount }} كلمة • ~{{ estimatedMins }} دقيقة قراءة
                  </span>
                  <button
                    v-if="editorMode === 'markdown'"
                    type="button"
                    class="btn-split-toggle"
                    :class="{ active: previewSplit }"
                    @click="previewSplit = !previewSplit"
                  >
                    <v-icon icon="mdi-view-split-vertical" size="15" class="ml-1" />
                    <span>معاينة حية</span>
                  </button>
                </div>
              </div>

              <!-- ══════════════════════════════════════════
                   A) VISUAL WYSIWYG TOOLBAR (Rich & Intuitive)
                   ══════════════════════════════════════════ -->
              <div v-if="editorMode === 'visual'" class="visual-rich-toolbar">
                <div class="toolbar-group">
                  <button type="button" class="vt-btn" @click="execFormat('formatBlock', '<h2>')" title="عنوان رئيسي كبير">
                    <b>H2</b>
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('formatBlock', '<h3>')" title="عنوان فرعي متوسط">
                    <b>H3</b>
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('formatBlock', '<p>')" title="نص فقرة عادي">
                    <v-icon icon="mdi-format-paragraph" size="16" />
                  </button>
                </div>

                <div class="toolbar-divider" />

                <div class="toolbar-group">
                  <button type="button" class="vt-btn" @click="execFormat('bold')" title="خط عريض (Bold)">
                    <v-icon icon="mdi-format-bold" size="16" />
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('italic')" title="خط مائل (Italic)">
                    <v-icon icon="mdi-format-italic" size="16" />
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('underline')" title="تسطير أسفل النص">
                    <v-icon icon="mdi-format-underline" size="16" />
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('strikeThrough')" title="يتوسطه خط">
                    <v-icon icon="mdi-format-strikethrough" size="16" />
                  </button>
                  <button type="button" class="vt-btn highlight" @click="execFormat('hiliteColor', '#fef08a')" title="تمييز بلون أصفر">
                    <v-icon icon="mdi-marker" size="16" />
                  </button>
                </div>

                <div class="toolbar-divider" />

                <div class="toolbar-group">
                  <button type="button" class="vt-btn" @click="execFormat('insertUnorderedList')" title="قائمة نقطية">
                    <v-icon icon="mdi-format-list-bulleted" size="16" />
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('insertOrderedList')" title="قائمة مرقمة 1. 2. 3.">
                    <v-icon icon="mdi-format-list-numbered" size="16" />
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('formatBlock', '<blockquote>')" title="اقتباس مميز">
                    <v-icon icon="mdi-format-quote-close" size="16" />
                  </button>
                  <button type="button" class="vt-btn" @click="execFormat('insertHorizontalRule')" title="خط فاصل">
                    <v-icon icon="mdi-minus" size="16" />
                  </button>
                </div>

                <div class="toolbar-divider" />

                <div class="toolbar-group">
                  <button type="button" class="vt-btn special" @click="insertVisualTable" title="إدراج جدول مقارنة منظم">
                    <v-icon icon="mdi-table-plus" size="16" class="ml-1" />
                    <span>جدول</span>
                  </button>
                  <button type="button" class="vt-btn special" @click="openInsertCodeDialog" title="إدراج كود برمجي منسق">
                    <v-icon icon="mdi-code-tags" size="16" class="ml-1" />
                    <span>كود</span>
                  </button>
                  <button type="button" class="vt-btn special" @click="openInsertImageDialog" title="إدراج صورة داخل المقال">
                    <v-icon icon="mdi-image-plus" size="16" class="ml-1" />
                    <span>صورة</span>
                  </button>
                  <button type="button" class="vt-btn special" @click="openInsertCalloutDialog" title="صندوق تنبيه أو نصيحة">
                    <v-icon icon="mdi-alert-circle-outline" size="16" class="ml-1" />
                    <span>تنبيه</span>
                  </button>
                  <button type="button" class="vt-btn" @click="insertVisualLink" title="إدراج رابط">
                    <v-icon icon="mdi-link-variant" size="16" />
                  </button>
                </div>
              </div>

              <!-- ══════════════════════════════════════════
                   B) MARKDOWN TOOLBAR (For Tech & Advanced)
                   ══════════════════════════════════════════ -->
              <div v-else class="md-toolbar">
                <div class="d-flex align-center gap-1 flex-wrap">
                  <button type="button" class="md-tool-btn" @click="insertMd('## ')" title="عنوان H2"><b>H2</b></button>
                  <button type="button" class="md-tool-btn" @click="insertMd('### ')" title="عنوان H3"><b>H3</b></button>
                  <button type="button" class="md-tool-btn" @click="insertMd('**نص عريض**')"><v-icon icon="mdi-format-bold" size="16" /></button>
                  <button type="button" class="md-tool-btn" @click="insertMd('*نص مائل*')"><v-icon icon="mdi-format-italic" size="16" /></button>
                  <button type="button" class="md-tool-btn" @click="insertMdCodeBlock"><v-icon icon="mdi-code-braces" size="16" /></button>
                  <button type="button" class="md-tool-btn" @click="insertMd('> اقتباس مميز\n')"><v-icon icon="mdi-format-quote-close" size="16" /></button>
                  <button type="button" class="md-tool-btn" @click="insertMd('- عنصر قائمة\n')"><v-icon icon="mdi-format-list-bulleted" size="16" /></button>
                  <button type="button" class="md-tool-btn" @click="insertMdTable"><v-icon icon="mdi-table" size="16" /></button>
                  <button type="button" class="md-tool-btn" @click="insertMd('![وصف الصورة](https://example.com/image.jpg)\n')"><v-icon icon="mdi-image-plus" size="16" /></button>
                </div>
              </div>

              <!-- ══════════════════════════════════════════
                   EDITOR STAGE
                   ══════════════════════════════════════════ -->
              <!-- Visual Canvas -->
              <div v-if="editorMode === 'visual'" class="visual-canvas-stage">
                <div
                  ref="visualEditorRef"
                  class="visual-editable-canvas markdown-rendered-body"
                  contenteditable="true"
                  placeholder="ابدأ بكتابة نص المقال هنا مباشرة كأنك تكتب في مستند Word... يمكنك تظليل أي نص واستخدام شريط الأدوات بالأعلى لتنسيقه فوراً."
                  @input="handleVisualInput"
                ></div>
              </div>

              <!-- Markdown Split Stage -->
              <div v-else class="md-editor-split-stage" :class="{ 'is-split': previewSplit }">
                <div class="md-textarea-pane">
                  <textarea
                    ref="textareaRef"
                    v-model="form.content"
                    placeholder="اكتب محتوى المقال هنا بصيغة Markdown... يمكنك استخدام العناوين ## والأكواد ``` والجداول والصور."
                    class="md-code-input"
                  ></textarea>
                </div>

                <div v-if="previewSplit" class="md-preview-pane">
                  <div class="preview-pane-header">
                    <v-icon icon="mdi-eye-outline" size="14" class="ml-1" />
                    <span>المعاينة المباشرة للمقال</span>
                  </div>
                  <div class="preview-pane-body" v-html="previewHtml"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: COVER & MEDIA -->
          <div v-show="activeTab === 'media'">
            <div class="cover-uploader-box">
              <label class="field-label font-weight-bold">صورة غلاف المقال الرئيسية</label>
              <p class="text-caption text-secondary mb-4">اختر صورة جذابة عالية الجودة تعبر عن محتوى وتخصص المقال.</p>

              <!-- Upload Button -->
              <div class="d-flex align-center gap-3 flex-wrap mb-4">
                <input
                  type="file"
                  ref="coverFileInputRef"
                  accept="image/*"
                  class="d-none"
                  @change="handleCoverFileUpload"
                />
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  :disabled="uploadingCover"
                  @click="coverFileInputRef.click()"
                >
                  <v-icon :icon="uploadingCover ? 'mdi-loading spin' : 'mdi-upload'" size="16" class="ml-1" />
                  <span>{{ uploadingCover ? 'جاري الرفع...' : 'رفع صورة الغلاف من الكمبيوتر' }}</span>
                </button>
                <span class="text-caption text-secondary">أو الصق رابط الصورة مباشرة بالأسفل:</span>
              </div>

              <v-text-field
                v-model="form.cover_image"
                placeholder="https://images.unsplash.com/..."
                variant="outlined"
                density="comfortable"
                class="mb-4 text-ltr"
              />

              <!-- Cover Preview Card -->
              <div class="cover-preview-card" v-if="form.cover_image">
                <img :src="form.cover_image" alt="معاينة الغلاف" />
                <button type="button" class="remove-cover-btn" @click="form.cover_image = ''" title="إزالة الصورة">
                  <v-icon icon="mdi-trash-can-outline" size="16" />
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 3: SEO & GOOGLE PREVIEW -->
          <div v-show="activeTab === 'seo'">
            <v-row>
              <v-col cols="12">
                <label class="field-label">عنوان الـ SEO (Meta Title)</label>
                <v-text-field
                  v-model="form.meta_title"
                  :placeholder="form.title || 'عنوان الصفحة في محركات البحث'"
                  variant="outlined"
                  density="comfortable"
                  messages="يُفضل أن لا يتجاوز 60 حرفاً."
                />
              </v-col>

              <v-col cols="12">
                <label class="field-label">وصف الـ SEO (Meta Description)</label>
                <v-textarea
                  v-model="form.meta_description"
                  rows="3"
                  :placeholder="form.excerpt || 'الوصف الذي يظهر أسفل الرابط في نتائج بحث Google...'"
                  variant="outlined"
                  density="comfortable"
                  messages="يُفضل بين 120 إلى 160 حرفاً."
                />
              </v-col>

              <v-col cols="12">
                <label class="field-label">الكلمات المفتاحية للـ SEO (Keywords)</label>
                <v-text-field
                  v-model="form.meta_keywords"
                  placeholder="مثال: هندسة البرمجيات, تطوير ويب, تصميم واجهات, حلول سحابية"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <!-- Google Search Result Live Simulator -->
            <div class="google-serp-simulator mt-6">
              <div class="serp-sim-header">
                <v-icon icon="mdi-google" size="18" color="#4285F4" class="ml-1" />
                <span>محاكي نتيجة البحث في Google (SERP Preview)</span>
              </div>
              <div class="serp-sim-body">
                <div class="serp-url-row">
                  <span class="serp-favicon">●</span>
                  <span class="serp-domain">https://portfolio.app › blog › {{ form.slug || 'post-url' }}</span>
                </div>
                <h3 class="serp-title">{{ form.meta_title || form.title || 'عنوان المقال كما سيظهر في محرك البحث' }}</h3>
                <p class="serp-snippet">{{ form.meta_description || form.excerpt || 'نبذة وصفية عن المقال تظهر في نتائج البحث لمساعدة القراء والزوار على فهم محتوى الصفحة...' }}</p>
              </div>
            </div>
          </div>

          <!-- TAB 4: SETTINGS & TAGS -->
          <div v-show="activeTab === 'settings'">
            <v-row>
              <!-- Tags Builder -->
              <v-col cols="12">
                <label class="field-label">الوسوم والكلمات المفتاحية (Tags)</label>
                <div class="d-flex align-center gap-2 mb-3">
                  <v-text-field
                    v-model="newTagInput"
                    placeholder="اكتب الوسم واضغط إضافة أو Enter (مثال: Vue, Python, UI/UX, Business)..."
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    @keydown.enter.prevent="addTag"
                  />
                  <button type="button" class="btn btn-secondary" @click="addTag">إضافة</button>
                </div>
                <div class="tags-chips-flex" v-if="form.tags?.length">
                  <span class="tag-editable-chip" v-for="(t, idx) in form.tags" :key="t">
                    #{{ t }}
                    <v-icon icon="mdi-close" size="14" class="mr-1 cursor-pointer" @click="removeTag(idx)" />
                  </span>
                </div>
              </v-col>

              <!-- Estimated Reading Time -->
              <v-col cols="12" sm="6">
                <label class="field-label">وقت القراءة المقدر (بالدقائق)</label>
                <div class="d-flex align-center gap-2">
                  <v-text-field
                    type="number"
                    v-model.number="form.reading_time_minutes"
                    min="1"
                    max="60"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  />
                  <button type="button" class="btn btn-ghost btn-sm text-nowrap" @click="form.reading_time_minutes = estimatedMins">
                    حساب تلقائي ({{ estimatedMins }} د)
                  </button>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">ترتيب العرض (Sort Order)</label>
                <v-text-field
                  type="number"
                  v-model.number="form.sort_order"
                  min="0"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>

              <!-- Checkboxes -->
              <v-col cols="12" class="d-flex align-center gap-6 flex-wrap mt-2">
                <v-switch
                  v-model="form.is_published"
                  color="success"
                  label="نشر المقال فوراً في الموقع"
                  hide-details
                />

                <v-switch
                  v-model="form.is_featured"
                  color="warning"
                  label="تثبيت كمقال مميز في الصفحة الرئيسية وأعلى المدونة"
                  hide-details
                />
              </v-col>
            </v-row>
          </div>
</v-card-text>

        <!-- Modal Footer Actions -->
        <v-card-actions class="dialog-actions pa-4 d-flex justify-space-between">
          <button class="btn btn-secondary btn-sm" @click="modalOpen = false">إلغاء</button>
          <button class="btn btn-primary" :disabled="saving" @click="savePost">
            <v-icon :icon="saving ? 'mdi-loading spin' : 'mdi-content-save-check'" size="18" class="ml-1" />
            <span>{{ saving ? 'جاري الحفظ...' : (isEditing ? 'حفظ التعديلات' : 'نشر المقال') }}</span>
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ══════════════════════════════════════════
         HELPER MODALS: INSERT CODE / IMAGE
         ══════════════════════════════════════════ -->
    <!-- Insert Code Dialog -->
    <v-dialog v-model="codeDialog" max-width="580">
      <v-card class="admin-dialog-card pa-4" rounded="xl" dir="rtl">
        <v-card-title class="dialog-header d-flex justify-space-between align-center">
          <span class="font-weight-bold">إدراج كود برمجي منسق</span>
          <button class="close-btn" @click="codeDialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-select
            v-model="codeSnippet.lang"
            :items="['javascript', 'python', 'html', 'css', 'sql', 'bash', 'json', 'typescript', 'php', 'plaintext']"
            label="لغة البرمجة"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          <v-textarea
            v-model="codeSnippet.code"
            rows="6"
            placeholder="الصق أو اكتب الكود البرمجي هنا..."
            variant="outlined"
            density="comfortable"
            class="font-mono text-ltr"
          />
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between pa-4">
          <button class="btn btn-secondary btn-sm" @click="codeDialog = false">إلغاء</button>
          <button class="btn btn-primary btn-sm" @click="confirmInsertCode">إدراج الكود</button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Insert Image In Content Dialog -->
    <v-dialog v-model="imageDialog" max-width="580">
      <v-card class="admin-dialog-card pa-4" rounded="xl" dir="rtl">
        <v-card-title class="dialog-header d-flex justify-space-between align-center">
          <span class="font-weight-bold">إدراج صورة داخل المقال</span>
          <button class="close-btn" @click="imageDialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-card-text class="pa-4">
          <input type="file" ref="inlineImageFileInputRef" accept="image/*" class="d-none" @change="handleInlineImageUpload" />
          <button type="button" class="btn btn-secondary w-100 mb-4" :disabled="uploadingInlineImg" @click="inlineImageFileInputRef.click()">
            <v-icon :icon="uploadingInlineImg ? 'mdi-loading spin' : 'mdi-upload'" size="16" class="ml-1" />
            <span>{{ uploadingInlineImg ? 'جاري الرفع...' : 'رفع صورة من جهاز الكمبيوتر' }}</span>
          </button>
          <v-text-field v-model="imageSnippet.url" placeholder="أو الصق رابط الصورة: https://..." label="رابط الصورة" variant="outlined" density="compact" class="mb-3 text-ltr" />
          <v-text-field v-model="imageSnippet.alt" placeholder="وصف توضيحي للصورة" label="وصف الصورة (Alt Text)" variant="outlined" density="compact" />
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between pa-4">
          <button class="btn btn-secondary btn-sm" @click="imageDialog = false">إلغاء</button>
          <button class="btn btn-primary btn-sm" :disabled="!imageSnippet.url" @click="confirmInsertImage">إدراج الصورة</button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      v-model="deleteModalOpen"
      title="تأكيد حذف المقال"
      :message="`هل أنت متأكد من حذف المقال '${postToDelete?.title}'؟ لا يمكن التراجع عن هذه العملية.`"
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

import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'
import { marked } from 'marked'
import TurndownService from 'turndown'

const adminStore = useAdminStore()

// Turndown for HTML -> Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
})

// Keep raw pre/code classes
turndownService.addRule('fencedCodeBlock', {
  filter: function (node) {
    return node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE'
  },
  replacement: function (content, node) {
    const code = node.firstChild
    const className = code.getAttribute('class') || ''
    const lang = (className.match(/language-(\w+)/) || [])[1] || ''
    return '\n\n```' + lang + '\n' + code.textContent.trim() + '\n```\n\n'
  }
})

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const posts = ref([])

// Filters
const searchQuery = ref('')
const filterCategory = ref('الكل')
const filterStatus = ref('ALL')

// Modals
const modalOpen = ref(false)
const isEditing = ref(false)
const activeTab = ref('content')
const editorMode = ref('visual') // 'visual' | 'markdown'
const previewSplit = ref(true)
const deleteModalOpen = ref(false)
const postToDelete = ref(null)

const visualEditorRef = ref(null)
const textareaRef = ref(null)
const coverFileInputRef = ref(null)
const uploadingCover = ref(false)
const inlineImageFileInputRef = ref(null)
const uploadingInlineImg = ref(false)
const newTagInput = ref('')

// Helpers dialogs
const codeDialog = ref(false)
const codeSnippet = ref({ lang: 'javascript', code: '' })
const imageDialog = ref(false)
const imageSnippet = ref({ url: '', alt: '' })

const defaultForm = () => ({
  id: null,
  title: '',
  slug: '',
  category: 'هندسة البرمجيات والتطوير',
  excerpt: '',
  content: '<h2>مقدمة حول الموضوع</h2><p>اكتب محتوى المقال هنا بكل سهولة وسلاسة...</p><blockquote>اقتباس ملهم أو نصيحة ذهبية تلخص التجربة.</blockquote><h3>أهم الحلول والممارسات</h3><ul><li>نقطة أولى وأساسية</li><li>نقطة ثانية وملاحظة عملية</li></ul>',
  cover_image: '',
  tags: [],
  reading_time_minutes: 4,
  is_featured: false,
  is_published: true,
  sort_order: 0,
  meta_title: '',
  meta_description: '',
  meta_keywords: ''
})

const form = ref(defaultForm())

onMounted(fetchPosts)

async function fetchPosts() {
  loading.value = true
  try {
    const res = await adminService.getBlogPosts()
    posts.value = Array.isArray(res) ? res : (res.results || [])
  } catch (err) {
    adminStore.notify('فشل تحميل المقالات', 'error')
  } finally {
    loading.value = false
  }
}

// Metrics
const publishedCount = computed(() => posts.value.filter(p => p.is_published).length)
const featuredCount = computed(() => posts.value.filter(p => p.is_featured).length)
const totalViews = computed(() => posts.value.reduce((acc, p) => acc + (p.views_count || 0), 0))

const uniqueCategories = computed(() => {
  const set = new Set()
  posts.value.forEach(p => { if (p.category) set.add(p.category) })
  return Array.from(set)
})

const filteredPosts = computed(() => {
  return posts.value.filter(p => {
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const mTitle = (p.title || '').toLowerCase().includes(q)
      const mCat = (p.category || '').toLowerCase().includes(q)
      const mTags = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q))
      if (!mTitle && !mCat && !mTags) return false
    }
    if (filterCategory.value !== 'الكل' && p.category !== filterCategory.value) return false
    if (filterStatus.value === 'PUBLISHED' && !p.is_published) return false
    if (filterStatus.value === 'DRAFT' && p.is_published) return false
    return true
  })
})

const wordCount = computed(() => {
  const text = (form.value.content || '').replace(/<[^>]+>/g, ' ')
  return text.split(/\s+/).filter(Boolean).length
})

const estimatedMins = computed(() => {
  return Math.max(1, Math.round(wordCount.value / 180))
})

const previewHtml = computed(() => {
  if (!form.value.content) return '<p style="color:var(--t3)">لا يوجد محتوى للمعاينة بعد...</p>'
  try {
    return marked.parse(form.value.content)
  } catch (e) {
    return form.value.content
  }
})

// ══════════════════════════════════════════
// DUAL MODE SWITCHING & SYNC
// ══════════════════════════════════════════
function switchEditorMode(newMode) {
  if (editorMode.value === newMode) return

  if (newMode === 'visual') {
    // Markdown -> Visual HTML
    form.value.content = marked.parse(form.value.content || '')
    editorMode.value = 'visual'
    nextTick(() => {
      if (visualEditorRef.value) {
        visualEditorRef.value.innerHTML = form.value.content
      }
    })
  } else {
    // Visual HTML -> Markdown
    syncVisualToModel()
    try {
      form.value.content = turndownService.turndown(form.value.content || '')
    } catch (e) {
      // keep html fallback
    }
    editorMode.value = 'markdown'
  }
}

function handleVisualInput() {
  if (visualEditorRef.value) {
    form.value.content = visualEditorRef.value.innerHTML
  }
}

function syncVisualToModel() {
  if (editorMode.value === 'visual' && visualEditorRef.value) {
    form.value.content = visualEditorRef.value.innerHTML
  }
}

function execFormat(command, value = null) {
  document.execCommand(command, false, value)
  handleVisualInput()
  visualEditorRef.value?.focus()
}

function insertVisualTable() {
  const tableHtml = `
    <table style="width:100%; border-collapse:collapse; margin:20px 0; border:1px solid #cbd5e1;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="padding:10px; border:1px solid #cbd5e1;">المعيار / الخاصية</th>
          <th style="padding:10px; border:1px solid #cbd5e1;">الوضع السابق</th>
          <th style="padding:10px; border:1px solid #cbd5e1;">الحل المبتكر</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:10px; border:1px solid #cbd5e1;">السرعة والأداء</td>
          <td style="padding:10px; border:1px solid #cbd5e1;">بطيء ومحدود</td>
          <td style="padding:10px; border:1px solid #cbd5e1;">فائق السرعة وقابل للتوسع</td>
        </tr>
      </tbody>
    </table>
    <p><br></p>
  `
  document.execCommand('insertHTML', false, tableHtml)
  handleVisualInput()
}

function insertVisualLink() {
  const url = prompt('أدخل رابط الموقع (URL):', 'https://')
  if (url) {
    document.execCommand('createLink', false, url)
    handleVisualInput()
  }
}

function openInsertCalloutDialog() {
  const calloutHtml = `
    <div style="padding:16px 20px; margin:20px 0; background:rgba(59,130,246,0.08); border-right:4px solid #3b82f6; border-radius:8px;">
      <strong style="color:#2563eb; display:block; margin-bottom:4px;">💡 معلومة أو نصيحة هامة:</strong>
      <span>اكتب النصيحة أو التنبيه هنا...</span>
    </div>
    <p><br></p>
  `
  document.execCommand('insertHTML', false, calloutHtml)
  handleVisualInput()
}

function openInsertCodeDialog() {
  codeSnippet.value = { lang: 'javascript', code: '' }
  codeDialog.value = true
}

function confirmInsertCode() {
  const code = codeSnippet.value.code
  const lang = codeSnippet.value.lang
  if (editorMode.value === 'visual') {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const blockHtml = `<pre><code class="language-${lang}">${escaped}</code></pre><p><br></p>`
    document.execCommand('insertHTML', false, blockHtml)
    handleVisualInput()
  } else {
    insertMd(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`)
  }
  codeDialog.value = false
}

function openInsertImageDialog() {
  imageSnippet.value = { url: '', alt: '' }
  imageDialog.value = true
}

async function handleInlineImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadingInlineImg.value = true
  try {
    const res = await adminService.uploadMedia(file, imageSnippet.value.alt || 'صورة داخل المقال')
    imageSnippet.value.url = res.file_url || res.file
    adminStore.notify('تم رفع الصورة بنجاح!')
  } catch (err) {
    adminStore.notify('فشل رفع الصورة', 'error')
  } finally {
    uploadingInlineImg.value = false
  }
}

function confirmInsertImage() {
  const url = imageSnippet.value.url
  const alt = imageSnippet.value.alt || 'صورة توضيحية'
  if (editorMode.value === 'visual') {
    const imgHtml = `<img src="${url}" alt="${alt}" style="max-width:100%; border-radius:12px; margin:16px 0;" /><p><br></p>`
    document.execCommand('insertHTML', false, imgHtml)
    handleVisualInput()
  } else {
    insertMd(`\n![${alt}](${url})\n`)
  }
  imageDialog.value = false
}

function insertMd(syntax) {
  const textarea = textareaRef.value
  if (!textarea) {
    form.value.content += '\n' + syntax
    return
  }
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.value.content
  form.value.content = text.substring(0, start) + syntax + text.substring(end)
}

function insertMdCodeBlock() {
  insertMd('\n```javascript\n// اكتب كود توضيحي هنا\nconsole.log("Hello World");\n```\n')
}

function insertMdTable() {
  insertMd('\n| الميزة | الوضع السابق | الحل المبتكر |\n|---|---|---|\n| السرعة | بطيء | فائق السرعة |\n| التجربة | معقدة | سلسة ومريحة |\n')
}

// ══════════════════════════════════════════
// MODAL OPEN / EDIT
// ══════════════════════════════════════════
function openCreateModal() {
  form.value = defaultForm()
  isEditing.value = false
  activeTab.value = 'content'
  editorMode.value = 'visual'
  modalOpen.value = true
  nextTick(() => {
    if (visualEditorRef.value) {
      visualEditorRef.value.innerHTML = form.value.content
    }
  })
}

function openEditModal(post) {
  form.value = {
    ...post,
    tags: Array.isArray(post.tags) ? [...post.tags] : []}
  isEditing.value = true
  activeTab.value = 'content'
  editorMode.value = 'visual'
  modalOpen.value = true
  nextTick(() => {
    if (visualEditorRef.value) {
      // If content is Markdown, convert to HTML for visual editor
      let html = form.value.content || ''
      if (!html.startsWith('<') || html.includes('## ')) {
        html = marked.parse(html)
      }
      visualEditorRef.value.innerHTML = html
      form.value.content = html
    }
  })
}


function autoGenerateSlug() {
  if (!isEditing.value || !form.value.slug) {
    const cleaned = (form.value.title || '')
      .replace(/[^\w\s\u0600-\u06FF-]/g, '')
      .trim()
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
    form.value.slug = cleaned
  }
}

async function handleCoverFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadingCover.value = true
  try {
    const res = await adminService.uploadMedia(file, form.value.title || 'غلاف المقال')
    form.value.cover_image = res.file_url || res.file
    adminStore.notify('تم رفع صورة الغلاف بنجاح!')
  } catch (err) {
    adminStore.notify('فشل رفع الصورة', 'error')
  } finally {
    uploadingCover.value = false
  }
}

function addTag() {
  const val = newTagInput.value.trim().replace(/^#/, '')
  if (val && !form.value.tags.includes(val)) {
    form.value.tags.push(val)
    newTagInput.value = ''
  }
}

function removeTag(idx) {
  form.value.tags.splice(idx, 1)
}

async function savePost() {
  if (!form.value.title.trim()) {
    adminStore.notify('يرجى كتابة عنوان المقال', 'error')
    activeTab.value = 'content'
    return
  }

  syncVisualToModel()

  saving.value = true
  try {
    if (!form.value.reading_time_minutes) {
      form.value.reading_time_minutes = estimatedMins.value
    }

    if (isEditing.value && form.value.id) {
      await adminService.updateBlogPost(form.value.id, form.value)
      adminStore.notify('تم حفظ التعديلات بنجاح!')
    } else {
      await adminService.createBlogPost(form.value)
      adminStore.notify('تم نشر المقال بنجاح!')
    }
    modalOpen.value = false
    await fetchPosts()
  } catch (err) {
    adminStore.notify(err.message || 'فشل حفظ المقال', 'error')
  } finally {
    saving.value = false
  }
}

function confirmDelete(post) {
  postToDelete.value = post
  deleteModalOpen.value = true
}

async function executeDelete() {
  if (!postToDelete.value?.id) return
  deleting.value = true
  try {
    await adminService.deleteBlogPost(postToDelete.value.id)
    adminStore.notify('تم حذف المقال بنجاح.')
    deleteModalOpen.value = false
    await fetchPosts()
  } catch (err) {
    adminStore.notify('فشل حذف المقال', 'error')
  } finally {
    deleting.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    return dateStr
  }
}
</script>

<style scoped>
/* Stat Cards */
.stat-summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px !important;
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrap.blue { background: rgba(59, 130, 246, 0.12); }
.stat-icon-wrap.green { background: rgba(16, 185, 129, 0.12); }
.stat-icon-wrap.amber { background: rgba(245, 158, 11, 0.12); }
.stat-icon-wrap.purple { background: rgba(139, 92, 246, 0.12); }

.stat-number {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--t1);
  line-height: 1.2;
}

.stat-title {
  font-size: 0.8rem;
  color: var(--t3);
  margin-top: 2px;
}

/* Table elements */
.table-thumb-wrap {
  width: 52px;
  height: 38px;
  border-radius: 8px;
  overflow: hidden;
}

.table-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dialog Tabs Bar */
.dialog-tabs-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle, rgba(0, 0, 0, 0.03));
  overflow-x: auto;
}

.tab-btn {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--t3);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--t1);
  background: rgba(59, 130, 246, 0.08);
}

.tab-btn.active {
  background: var(--primary, #2563EB);
  color: #FFFFFF;
}

/* ═══════════════════════════════════════════════════════════
   SMART DUAL-MODE EDITOR STYLES
   ═══════════════════════════════════════════════════════════ */
.smart-editor-container {
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.editor-mode-switcher-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--bg-3, #F8FAFC);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 12px;
}

.mode-pill-btn {
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--t2);
  background: var(--bg-card, #FFFFFF);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.mode-pill-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.mode-pill-btn.active {
  background: var(--primary, #2563EB);
  color: #FFFFFF;
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.btn-split-toggle {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--t2);
  cursor: pointer;
}

.btn-split-toggle.active {
  background: rgba(59, 130, 246, 0.12);
  color: var(--primary);
  border-color: var(--primary);
}

/* Visual Rich Toolbar */
.visual-rich-toolbar {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  background: var(--bg-card, #FFFFFF);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
  margin: 0 4px;
}

.vt-btn {
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--bg-subtle, #F8FAFC);
  border: 1px solid var(--border);
  color: var(--t1);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 32px;
}

.vt-btn:hover {
  background: rgba(59, 130, 246, 0.12);
  color: var(--primary);
  border-color: var(--primary);
}

.vt-btn.special {
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.06);
  color: var(--primary);
  border-color: rgba(59, 130, 246, 0.2);
}

.vt-btn.special:hover {
  background: var(--primary);
  color: #FFFFFF;
}

.vt-btn.highlight {
  color: #ca8a04;
}

/* Visual Editable Canvas */
.visual-canvas-stage {
  min-height: 420px;
  max-height: 540px;
  overflow-y: auto;
  background: var(--bg-card, #FFFFFF);
}

.visual-editable-canvas {
  min-height: 420px;
  padding: 24px 28px;
  outline: none;
  font-family: var(--f-body, 'Cairo', sans-serif);
  font-size: 1.05rem;
  line-height: 1.9;
  color: var(--t1, #0F172A);
  direction: rtl;
  text-align: right;
}

.visual-editable-canvas:empty:before {
  content: attr(placeholder);
  color: var(--t3, #94A3B8);
  pointer-events: none;
  display: block;
}

/* Markdown Split Editor */
.md-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 8px;
}

.md-tool-btn {
  padding: 5px 10px;
  border-radius: 6px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--t2);
  font-size: 0.78rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.md-tool-btn:hover { background: rgba(59, 130, 246, 0.15); color: var(--primary); }

.md-editor-split-stage {
  display: flex;
  height: 420px;
}

.md-editor-split-stage.is-split .md-textarea-pane {
  width: 50%;
  border-left: 1px solid var(--border);
}

.md-editor-split-stage.is-split .md-preview-pane {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.md-textarea-pane {
  width: 100%;
  height: 100%;
}

.md-code-input {
  width: 100%;
  height: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--t1);
  font-family: var(--f-mono, monospace);
  font-size: 0.9rem;
  line-height: 1.7;
  resize: none;
}

.md-preview-pane {
  height: 100%;
  background: var(--bg-subtle, rgba(0, 0, 0, 0.02));
}

.preview-pane-header {
  padding: 8px 16px;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--t3);
  border-bottom: 1px solid var(--border);
}

.preview-pane-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  font-size: 0.88rem;
  line-height: 1.8;
  color: var(--t2);
}

/* Cover Uploader */
.cover-uploader-box {
  background: var(--bg-subtle, rgba(0, 0, 0, 0.02));
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
}

.cover-preview-card {
  position: relative;
  max-width: 500px;
  height: 240px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.cover-preview-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-cover-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(239, 68, 68, 0.85);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #FFFFFF;
  cursor: pointer;
}

/* Google SERP Simulator */
.google-serp-simulator {
  background: #FFFFFF;
  color: #202124;
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  padding: 20px;
}

.serp-sim-header {
  font-size: 0.82rem;
  font-weight: 800;
  color: #5F6368;
  border-bottom: 1px solid #E8EAED;
  padding-bottom: 10px;
  margin-bottom: 14px;
}

.serp-url-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #202124;
  margin-bottom: 4px;
}

.serp-favicon { color: #4285F4; font-size: 0.7rem; }
.serp-domain { color: #5F6368; }

.serp-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1A0DAB;
  line-height: 1.3;
  margin-bottom: 4px;
  cursor: pointer;
}

.serp-title:hover { text-decoration: underline; }

.serp-snippet {
  font-size: 0.88rem;
  color: #4D5156;
  line-height: 1.5;
}

/* Tags Builder */
.tags-chips-flex {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-editable-chip {
  display: inline-flex;
  align-items: center;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: var(--primary, #2563EB);
  font-weight: 700;
}
</style>
