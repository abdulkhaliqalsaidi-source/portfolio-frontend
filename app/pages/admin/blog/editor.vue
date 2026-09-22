<template>
  <div class="world-class-editor" dir="rtl">
    <!-- ═════════════════════════════════════════════════════════
         1. FIXED TOPBAR (MEDIUM / GHOST STYLE)
         ═════════════════════════════════════════════════════════ -->
    <header class="editor-header">
      <div class="header-left">
        <button class="header-btn back-btn" @click="confirmGoBack" title="العودة للمدونة">
          <v-icon icon="mdi-arrow-right" size="18" />
          <span class="d-none d-sm-inline">المقالات</span>
        </button>
        <div class="header-v-divider" />
        <div class="post-state-badge" :class="form.is_published ? 'published' : 'draft'">
          <span class="state-dot" />
          <span>{{ form.is_published ? 'منشور للعامة' : 'مسودة خاصة' }}</span>
        </div>
        <div class="editor-meta-stats d-none d-md-flex align-center gap-2">
          <span>{{ wordCount }} كلمة</span>
          <span>•</span>
          <span>~{{ estimatedMins }} د قراءة</span>
          <span v-if="lastSavedAt" class="saved-time text-success">
            <v-icon icon="mdi-check" size="14" />
            حُفظ {{ lastSavedTimeStr }}
          </span>
        </div>
      </div>

      <div class="header-right">
        <!-- AI Quick Prompt Button -->
        <button
          class="header-btn ai-magic-btn"
          @click="aiModalOpen = true"
          title="توليد المقال كاملاً بضغطة زر باستخدام الذكاء الاصطناعي"
        >
          <span class="magic-sparkle">✨</span>
          <span class="btn-text">توليد بالذكاء الاصطناعي</span>
          <span class="ai-badge-pulse">AI</span>
        </button>

        <!-- Toggle AI Assistant Drawer -->
        <button
          class="header-btn ai-drawer-btn"
          :class="{ active: aiAssistantOpen }"
          @click="aiAssistantOpen = !aiAssistantOpen"
          title="مساعد الذكاء الاصطناعي الجانبي"
        >
          <v-icon icon="mdi-robot-outline" size="16" />
          <span class="d-none d-lg-inline">المساعد</span>
        </button>

        <!-- Preview on Public Site -->
        <a
          v-if="form.id && form.slug"
          :href="`/blog/${form.slug}`"
          target="_blank"
          class="header-btn preview-site-btn d-none d-sm-inline-flex"
          title="معاينة في الموقع"
        >
          <v-icon icon="mdi-open-in-new" size="16" />
        </a>

        <!-- Settings Drawer Toggle -->
        <button
          class="header-btn settings-toggle-btn"
          :class="{ active: sidebarOpen }"
          @click="sidebarOpen = !sidebarOpen"
          title="إعدادات المقال والنشر"
        >
          <v-icon icon="mdi-cog-outline" size="18" />
          <span>الإعدادات</span>
        </button>

        <!-- Save Button -->
        <button
          class="header-btn save-draft-btn"
          :disabled="saving"
          @click="savePost(false)"
        >
          <v-icon :icon="saving ? 'mdi-loading spin' : 'mdi-content-save-outline'" size="16" class="ml-1" />
          <span>{{ saving ? 'جاري الحفظ...' : 'حفظ' }}</span>
        </button>

        <!-- Publish / Unpublish Button -->
        <button
          class="header-btn publish-action-btn"
          :class="{ 'is-pub': form.is_published }"
          :disabled="saving"
          @click="togglePublish"
        >
          <v-icon :icon="form.is_published ? 'mdi-eye-off-outline' : 'mdi-send'" size="16" class="ml-1" />
          <span>{{ form.is_published ? 'إلغاء النشر' : 'نشر المقال' }}</span>
        </button>
      </div>
    </header>

    <!-- ═════════════════════════════════════════════════════════
         2. MAIN WRITING STAGE + SIDEBAR
         ═════════════════════════════════════════════════════════ -->
    <div class="editor-body-wrapper">
      <!-- CENTER WRITING CANVAS -->
      <main class="editor-canvas-container" :class="{ 'with-sidebar': sidebarOpen }">
        <div class="editor-inner-document">
          
          <!-- COVER IMAGE SECTION (NOTION / GHOST STYLE) -->
          <div class="cover-hero-banner" v-if="form.cover_image">
            <img :src="form.cover_image" alt="غلاف المقال" class="cover-image-preview" />
            <div class="cover-image-actions">
              <button class="cover-action-btn" @click="coverFileInputRef?.click()">
                <v-icon icon="mdi-camera-outline" size="15" class="ml-1" />
                تغيير الغلاف
              </button>
              <button class="cover-action-btn remove" @click="form.cover_image = ''">
                <v-icon icon="mdi-close" size="15" />
              </button>
            </div>
          </div>
          <div class="cover-trigger-bar" v-else>
            <button class="add-cover-pill" @click="coverFileInputRef?.click()">
              <v-icon icon="mdi-image-plus-outline" size="16" class="ml-1" />
              <span>إضافة صورة غلاف</span>
            </button>
            <button class="add-cover-pill ai-suggest" @click="suggestCoverImage">
              <span>🎨 توليد رابط غلاف جاهز</span>
            </button>
          </div>
          <input
            type="file"
            ref="coverFileInputRef"
            accept="image/*"
            class="d-none"
            @change="handleCoverUpload"
          />

          <!-- TITLE (LARGE, BORDERLESS, AUTO-EXPANDING) -->
          <div class="title-container">
            <textarea
              ref="titleInputRef"
              v-model="form.title"
              class="seamless-title-input"
              placeholder="عنوان المقال..."
              rows="1"
              @input="onTitleInput"
              @keydown.enter.prevent="focusExcerpt"
            />
          </div>

          <!-- EXCERPT / SUBTITLE (CLEAN LEAD) -->
          <div class="excerpt-container">
            <textarea
              ref="excerptInputRef"
              v-model="form.excerpt"
              class="seamless-excerpt-input"
              placeholder="اكتب نبذة أو مقدمة موجزة تلخص فكرة المقال وتجذب القارئ..."
              rows="2"
              @input="adjustExcerptHeight"
            />
          </div>

          <!-- FLOATING / STICKY TOOLBAR (GHOST / MEDIUM STYLE) -->
          <div class="floating-editor-toolbar">
            <div class="toolbar-mode-switcher">
              <button
                type="button"
                class="t-mode-btn"
                :class="{ active: editorMode === 'visual' }"
                @click="switchEditorMode('visual')"
                title="محرر مرئي سهل وسريع كأنك تكتب في Word"
              >
                ✍️ مرئي
              </button>
              <button
                type="button"
                class="t-mode-btn"
                :class="{ active: editorMode === 'markdown' }"
                @click="switchEditorMode('markdown')"
                title="محرر Markdown للمطورين"
              >
                💻 Markdown
              </button>
            </div>

            <div class="t-divider" />

            <!-- VISUAL FORMAT TOOLS -->
            <template v-if="editorMode === 'visual'">
              <button type="button" class="t-btn" @click="execFmt('formatBlock', '<h2>')" title="عنوان رئيسي (H2)">
                <b>H2</b>
              </button>
              <button type="button" class="t-btn" @click="execFmt('formatBlock', '<h3>')" title="عنوان فرعي (H3)">
                <b>H3</b>
              </button>
              <button type="button" class="t-btn" @click="execFmt('formatBlock', '<p>')" title="نص عادي">
                <v-icon icon="mdi-format-paragraph" size="16" />
              </button>

              <div class="t-divider" />

              <button type="button" class="t-btn" @click="execFmt('bold')" title="عريض (Bold)">
                <v-icon icon="mdi-format-bold" size="16" />
              </button>
              <button type="button" class="t-btn" @click="execFmt('italic')" title="مائل (Italic)">
                <v-icon icon="mdi-format-italic" size="16" />
              </button>
              <button type="button" class="t-btn" @click="execFmt('underline')" title="تسطير">
                <v-icon icon="mdi-format-underline" size="16" />
              </button>

              <div class="t-divider" />

              <button type="button" class="t-btn" @click="execFmt('insertUnorderedList')" title="قائمة نقطية">
                <v-icon icon="mdi-format-list-bulleted" size="16" />
              </button>
              <button type="button" class="t-btn" @click="execFmt('insertOrderedList')" title="قائمة مرقمة">
                <v-icon icon="mdi-format-list-numbered" size="16" />
              </button>
              <button type="button" class="t-btn" @click="execFmt('formatBlock', '<blockquote>')" title="اقتباس">
                <v-icon icon="mdi-format-quote-close" size="16" />
              </button>

              <div class="t-divider" />

              <button type="button" class="t-btn pill" @click="openInsertCode" title="إدراج كود">
                <v-icon icon="mdi-code-tags" size="15" class="ml-1" />
                <span>كود</span>
              </button>
              <button type="button" class="t-btn pill" @click="openInsertImage" title="إدراج صورة">
                <v-icon icon="mdi-image-plus-outline" size="15" class="ml-1" />
                <span>صورة</span>
              </button>
              <button type="button" class="t-btn pill" @click="insertCallout" title="صندوق نصيحة / تنبيه">
                <v-icon icon="mdi-lightbulb-on-outline" size="15" class="ml-1" />
                <span>نصيحة</span>
              </button>
              <button type="button" class="t-btn" @click="insertLink" title="إدراج رابط">
                <v-icon icon="mdi-link-variant" size="16" />
              </button>
            </template>

            <!-- MARKDOWN TOOLS -->
            <template v-else>
              <button type="button" class="t-btn" @click="insertMdSyntax('## ')"><b>H2</b></button>
              <button type="button" class="t-btn" @click="insertMdSyntax('### ')"><b>H3</b></button>
              <button type="button" class="t-btn" @click="insertMdSyntax('**نص عريض**')"><v-icon icon="mdi-format-bold" size="16" /></button>
              <button type="button" class="t-btn" @click="insertMdSyntax('*نص مائل*')"><v-icon icon="mdi-format-italic" size="16" /></button>
              <button type="button" class="t-btn" @click="insertMdSyntax('- عنصر\n')"><v-icon icon="mdi-format-list-bulleted" size="16" /></button>
              <button type="button" class="t-btn" @click="insertMdSyntax('> اقتباس مميز\n')"><v-icon icon="mdi-format-quote-close" size="16" /></button>
              <button type="button" class="t-btn pill" @click="openInsertCode"><v-icon icon="mdi-code-tags" size="15" class="ml-1" /><span>كود</span></button>
              <button type="button" class="t-btn pill" @click="openInsertImage"><v-icon icon="mdi-image-plus-outline" size="15" class="ml-1" /><span>صورة</span></button>

              <div class="t-divider" />
              <button
                type="button"
                class="t-btn pill"
                :class="{ active: previewSplit }"
                @click="previewSplit = !previewSplit"
              >
                <v-icon icon="mdi-view-split-vertical" size="15" class="ml-1" />
                <span>معاينة حية</span>
              </button>
            </template>
          </div>

          <!-- WRITING CANVAS BODY -->
          <div class="content-canvas-stage">
            <!-- VISUAL CONTENTEDITABLE CANVAS -->
            <div
              v-show="editorMode === 'visual'"
              ref="visualEditorRef"
              class="world-class-visual-canvas markdown-rendered-body"
              contenteditable="true"
              placeholder="اكتب المقال بحرية تامة هنا... اكتب الفقرات، استخدم العناوين، ونسّق النص بسهولة عبر شريط الأدوات أعلاه."
              @input="onVisualInput"
            />

            <!-- MARKDOWN SPLIT CANVAS -->
            <div v-if="editorMode === 'markdown'" class="markdown-split-container" :class="{ 'is-split': previewSplit }">
              <div class="md-editor-column">
                <textarea
                  ref="markdownTextareaRef"
                  v-model="form.content"
                  class="markdown-source-textarea"
                  placeholder="اكتب بلغة Markdown هنا..."
                />
              </div>
              <div v-if="previewSplit" class="md-preview-column">
                <div class="preview-header">
                  <v-icon icon="mdi-eye-outline" size="14" class="ml-1" />
                  معاينة حية
                </div>
                <div class="preview-body markdown-rendered-body" v-html="previewHtml" />
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- ═════════════════════════════════════════════════════════
           3. SLIDE-OUT SETTINGS DRAWER (GHOST / HASHNODE STYLE)
           ═════════════════════════════════════════════════════════ -->
      <aside class="editor-settings-drawer" :class="{ open: sidebarOpen }">
        <div class="drawer-header">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-tune-vertical" size="18" color="primary" />
            <span class="drawer-title">إعدادات ونشر المقال</span>
          </div>
          <button class="drawer-close-btn" @click="sidebarOpen = false" title="إغلاق">
            <v-icon icon="mdi-close" size="18" />
          </button>
        </div>

        <div class="drawer-scroll-content">
          <!-- CATEGORY -->
          <div class="drawer-section">
            <label class="drawer-label">التصنيف / المجال</label>
            <v-combobox
              v-model="form.category"
              :items="categories"
              placeholder="اختر أو اكتب التصنيف..."
              variant="outlined"
              density="compact"
              hide-details
            />
          </div>

          <!-- SLUG / URL -->
          <div class="drawer-section">
            <label class="drawer-label">رابط المقال الدائم (Slug)</label>
            <v-text-field
              v-model="form.slug"
              placeholder="post-url-slug"
              variant="outlined"
              density="compact"
              prefix="/blog/"
              hide-details
              class="font-mono text-ltr"
            />
            <div class="slug-preview-text">
              الرابط النهائي: <span class="text-primary font-mono">https://portfolio.app/blog/{{ form.slug || 'slug' }}</span>
            </div>
          </div>

          <!-- TAGS -->
          <div class="drawer-section">
            <label class="drawer-label">الوسوم والكلمات الدلالية (Tags)</label>
            <div class="tag-input-row mb-2">
              <v-text-field
                v-model="tagInput"
                placeholder="اكتب الوسم واضغط Enter..."
                variant="outlined"
                density="compact"
                hide-details
                @keydown.enter.prevent="addTag"
              />
              <button class="btn btn-secondary btn-sm" @click="addTag">إضافة</button>
            </div>
            <div class="tags-chips-container" v-if="form.tags?.length">
              <span class="tag-chip" v-for="(t, i) in form.tags" :key="t">
                #{{ t }}
                <v-icon icon="mdi-close" size="12" class="remove-tag" @click="removeTag(i)" />
              </span>
            </div>
          </div>

          <!-- PUBLISH CONTROLS -->
          <div class="drawer-section">
            <label class="drawer-label">حالة النشر والظهور</label>
            
            <div class="setting-toggle-row">
              <div class="toggle-text">
                <div class="toggle-title">نشر المقال للجمهور</div>
                <div class="toggle-desc">{{ form.is_published ? 'المقال مرئي للزوار في المدونة' : 'المقال محفوظ كمسودة خاصة' }}</div>
              </div>
              <v-switch v-model="form.is_published" color="success" hide-details density="compact" />
            </div>

            <div class="setting-toggle-row mt-3">
              <div class="toggle-text">
                <div class="toggle-title">مقال مميز (Featured) ⭐</div>
                <div class="toggle-desc">تثبيته في واجهة المدونة والصفحة الرئيسية</div>
              </div>
              <v-switch v-model="form.is_featured" color="warning" hide-details density="compact" />
            </div>
          </div>

          <!-- SEO SECTION -->
          <div class="drawer-section">
            <div class="d-flex align-center justify-between mb-2">
              <label class="drawer-label mb-0">تحسين محركات البحث (SEO)</label>
              <button class="ai-seo-btn" @click="generateSeoWithAi">
                <span>✨ توليد SEO بـ AI</span>
              </button>
            </div>

            <label class="drawer-sub-label">عنوان الـ SEO (Meta Title)</label>
            <v-text-field
              v-model="form.meta_title"
              :placeholder="form.title || 'عنوان الصفحة في Google'"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />

            <label class="drawer-sub-label">وصف الـ SEO (Meta Description)</label>
            <v-textarea
              v-model="form.meta_description"
              :placeholder="form.excerpt || 'الوصف الذي يظهر أسفل الرابط في محركات البحث...'"
              rows="2"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
            />

            <label class="drawer-sub-label">الكلمات المفتاحية (Keywords)</label>
            <v-text-field
              v-model="form.meta_keywords"
              placeholder="مثال: هندسة البرمجيات، ذكاء اصطناعي، ويب"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            />

            <!-- LIVE GOOGLE SERP PREVIEW -->
            <div class="serp-live-box">
              <div class="serp-box-header">
                <v-icon icon="mdi-google" size="14" color="#4285F4" class="ml-1" />
                معاينة نتيجة البحث في Google
              </div>
              <div class="serp-box-url">https://portfolio.app › blog › {{ form.slug || 'url' }}</div>
              <div class="serp-box-title">{{ form.meta_title || form.title || 'عنوان المقال في نتائج البحث' }}</div>
              <div class="serp-box-desc">{{ form.meta_description || form.excerpt || 'مقتطف ووصف المقال في محرك بحث جوجل يوضح فكرة المقال للقارئ...' }}</div>
            </div>
          </div>

          <!-- DANGER ZONE: DELETE -->
          <div class="drawer-section danger-section" v-if="form.id">
            <button class="delete-post-btn" @click="deleteConfirmModal = true">
              <v-icon icon="mdi-delete-outline" size="16" class="ml-1" />
              حذف هذا المقال نهائياً
            </button>
          </div>

        </div>
      </aside>
    </div>

    <!-- ═════════════════════════════════════════════════════════
         4. ONE-CLICK FULL AI ARTICLE GENERATOR MODAL
         ═════════════════════════════════════════════════════════ -->
    <v-dialog v-model="aiModalOpen" max-width="640">
      <v-card class="admin-dialog-card ai-generator-modal pa-6" rounded="xl" dir="rtl">
        <div class="d-flex align-center justify-between mb-4">
          <div class="d-flex align-center gap-2">
            <div class="ai-modal-icon-badge">✨</div>
            <div>
              <h3 class="font-weight-bold text-h6">توليد مقال كامل متكامل بالذكاء الاصطناعي</h3>
              <p class="text-caption text-secondary mb-0">اكتب فكرة المقال فقط وسيقوم الذكاء الاصطناعي بكتابة العنوان والمحتوى والمقتطف والـ SEO فوراً!</p>
            </div>
          </div>
          <button class="close-btn" @click="aiModalOpen = false"><v-icon icon="mdi-close" size="20" /></button>
        </div>

        <div class="ai-modal-form">
          <label class="field-label font-weight-bold">موضوع أو فكرة المقال *</label>
          <v-textarea
            v-model="aiPromptTopic"
            rows="3"
            placeholder="مثال: أهم الممارسات لبناء تطبيقات ويب عالية الأداء وقابلة للتوسع في 2025 مع التركيز على الواجهات الأمامية والتحسين السحابي..."
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />

          <div class="d-flex align-center gap-3 mb-4">
            <v-select
              v-model="aiArticleTone"
              :items="['احترافي ومتخصص', 'تعليمي ومبسط', 'تحليلي ومستقبلي', 'ملهم وقصصي']"
              label="أسلوب وطابع الكتابة"
              variant="outlined"
              density="compact"
              hide-details
              style="flex: 1"
            />
            <v-select
              v-model="aiArticleLength"
              :items="['شامل ومفصل (~800 كلمة)', 'متوسط ومركّز (~500 كلمة)', 'سريع ومقتضب (~300 كلمة)']"
              label="طول المقال"
              variant="outlined"
              density="compact"
              hide-details
              style="flex: 1"
            />
          </div>

          <div class="quick-topics-chips mb-4">
            <span class="quick-topic-title text-caption text-secondary ml-2">أفكار سريعة مقترحة:</span>
            <button
              v-for="topic in suggestedTopics"
              :key="topic"
              class="quick-topic-chip"
              @click="aiPromptTopic = topic"
            >
              {{ topic }}
            </button>
          </div>

          <div v-if="aiGenerating" class="ai-generating-status text-center py-6">
            <v-progress-circular indeterminate color="purple" size="44" class="mb-3" />
            <div class="font-weight-bold text-purple">جاري كتابة وتنسيق المقال بالذكاء الاصطناعي...</div>
            <div class="text-caption text-secondary mt-1">يتم صياغة العنوان، المقدمة، الأقسام الفرعية، الكود، وبيانات الـ SEO</div>
          </div>

          <div class="d-flex justify-between align-center mt-4">
            <button class="btn btn-secondary" @click="aiModalOpen = false">إلغاء</button>
            <button
              class="btn btn-ai-generate"
              :disabled="aiGenerating || !aiPromptTopic.trim()"
              @click="generateFullArticleWithAi"
            >
              <v-icon :icon="aiGenerating ? 'mdi-loading spin' : 'mdi-creation'" size="18" class="ml-1" />
              <span>{{ aiGenerating ? 'جاري التوليد...' : 'توليد وتطبيق على المقال فوراً ✨' }}</span>
            </button>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- ═════════════════════════════════════════════════════════
         5. AI BLOG ASSISTANT DRAWER
         ═════════════════════════════════════════════════════════ -->
    <AiBlogAssistant
      v-model:is-open="aiAssistantOpen"
      :post="form"
      @apply-content="onAiApplyContent"
      @apply-excerpt="(exc) => { form.excerpt = exc; notify('تم تطبيق المقتطف بنجاح! ✅') }"
      @apply-seo="onAiApplySeo"
      @apply-title="onAiApplyTitle"
    />

    <!-- ═════════════════════════════════════════════════════════
         6. HELPER MODALS: CODE & IMAGE INSERTION
         ═════════════════════════════════════════════════════════ -->
    <!-- Code Dialog -->
    <v-dialog v-model="codeDialog" max-width="540">
      <v-card class="admin-dialog-card pa-4" rounded="xl" dir="rtl">
        <v-card-title class="d-flex justify-between align-center pa-0 mb-3">
          <span class="font-weight-bold">إدراج كود برمجي منسق</span>
          <button class="close-btn" @click="codeDialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <v-select
          v-model="codeSnippet.lang"
          :items="['javascript', 'python', 'html', 'css', 'typescript', 'bash', 'sql', 'json', 'vue']"
          label="لغة البرمجة"
          variant="outlined"
          density="compact"
          class="mb-3"
        />
        <v-textarea
          v-model="codeSnippet.code"
          rows="6"
          placeholder="الصق الكود هنا..."
          variant="outlined"
          class="font-mono text-ltr"
        />
        <div class="d-flex justify-between mt-3">
          <button class="btn btn-secondary btn-sm" @click="codeDialog = false">إلغاء</button>
          <button class="btn btn-primary btn-sm" @click="confirmInsertCode">إدراج الكود</button>
        </div>
      </v-card>
    </v-dialog>

    <!-- Image Dialog -->
    <v-dialog v-model="imageDialog" max-width="520">
      <v-card class="admin-dialog-card pa-4" rounded="xl" dir="rtl">
        <v-card-title class="d-flex justify-between align-center pa-0 mb-3">
          <span class="font-weight-bold">إدراج صورة داخل المقال</span>
          <button class="close-btn" @click="imageDialog = false"><v-icon icon="mdi-close" size="18" /></button>
        </v-card-title>
        <input type="file" ref="inlineImageFileRef" accept="image/*" class="d-none" @change="handleInlineImageUpload" />
        <button
          type="button"
          class="btn btn-secondary w-100 mb-3"
          :disabled="uploadingInline"
          @click="inlineImageFileRef?.click()"
        >
          <v-icon :icon="uploadingInline ? 'mdi-loading spin' : 'mdi-upload'" size="16" class="ml-1" />
          <span>{{ uploadingInline ? 'جاري رفع الصورة...' : 'رفع صورة من الكمبيوتر' }}</span>
        </button>
        <v-text-field
          v-model="imageSnippet.url"
          placeholder="https://..."
          label="أو الصق رابط صورة خارجي (URL)"
          variant="outlined"
          density="compact"
          class="mb-2 text-ltr"
        />
        <v-text-field
          v-model="imageSnippet.alt"
          placeholder="نص وصفي للصورة"
          label="وصف الصورة (Alt Text)"
          variant="outlined"
          density="compact"
        />
        <div class="d-flex justify-between mt-3">
          <button class="btn btn-secondary btn-sm" @click="imageDialog = false">إلغاء</button>
          <button class="btn btn-primary btn-sm" :disabled="!imageSnippet.url" @click="confirmInsertImage">إدراج الصورة</button>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Modal -->
    <v-dialog v-model="deleteConfirmModal" max-width="440">
      <v-card class="admin-dialog-card pa-6 text-center" rounded="xl" dir="rtl">
        <v-icon icon="mdi-alert-circle-outline" size="52" color="error" class="mb-3" />
        <h3 class="font-weight-bold text-h6 mb-2">تأكيد حذف المقال</h3>
        <p class="text-secondary text-body-2 mb-4">هل أنت متأكد من رغبتك في حذف هذا المقال نهائياً؟ لن تتمكن من استرجاعه لاحقاً.</p>
        <div class="d-flex justify-center gap-3">
          <button class="btn btn-secondary" @click="deleteConfirmModal = false">تراجع</button>
          <button class="btn btn-danger" :disabled="deleting" @click="executeDeletePost">
            <v-icon :icon="deleting ? 'mdi-loading spin' : 'mdi-delete'" size="16" class="ml-1" />
            <span>{{ deleting ? 'جاري الحذف...' : 'نعم، احذف المقال' }}</span>
          </button>
        </div>
      </v-card>
    </v-dialog>

    <!-- SNACKBAR NOTIFICATIONS -->
    <v-snackbar v-model="toast.show" :color="toast.color" :timeout="3500" location="bottom left">
      <div class="d-flex align-center gap-2">
        <v-icon :icon="toast.icon" size="18" />
        <span>{{ toast.text }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false, // World-class full-screen distraction-free layout (Ghost / Medium style)
  middleware: ['auth']
})

import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '~/stores/admin'
import adminService from '~/services/adminService'
import geminiService from '~/services/geminiService'
import AiBlogAssistant from '~/components/admin/AiBlogAssistant.vue'
import { marked } from 'marked'
import TurndownService from 'turndown'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

// ─── STATE ─────────────────────────────────────────────────────────────
const saving = ref(false)
const deleting = ref(false)
const lastSavedAt = ref(null)
const sidebarOpen = ref(false)
const aiAssistantOpen = ref(false)
const editorMode = ref('visual') // 'visual' | 'markdown'
const previewSplit = ref(true)

// Modals
const aiModalOpen = ref(false)
const codeDialog = ref(false)
const imageDialog = ref(false)
const deleteConfirmModal = ref(false)

// Refs
const visualEditorRef = ref(null)
const markdownTextareaRef = ref(null)
const titleInputRef = ref(null)
const excerptInputRef = ref(null)
const coverFileInputRef = ref(null)
const inlineImageFileRef = ref(null)
const uploadingInline = ref(false)

// Tags
const tagInput = ref('')

// Snippets
const codeSnippet = ref({ lang: 'javascript', code: '' })
const imageSnippet = ref({ url: '', alt: '' })

// AI Generator Modal
const aiPromptTopic = ref('')
const aiArticleTone = ref('احترافي ومتخصص')
const aiArticleLength = ref('شامل ومفصل (~800 كلمة)')
const aiGenerating = ref(false)

const suggestedTopics = [
  'دليل بناء واجهات فائقة السرعة بـ Vue و Nuxt',
  'أفضل ممارسات تصميم تجربة المستخدم UI/UX لعام 2025',
  'كيفية توظيف نماذج الذكاء الاصطناعي في الأتمتة البرمجية',
  'استراتيجيات تصميم البنى السحابية والأنظمة الموزعة'
]

const categories = [
  'هندسة البرمجيات والتطوير',
  'تصميم واجهات وتجربة المستخدم UI/UX',
  'الذكاء الاصطناعي وعلوم البيانات',
  'إدارة واستراتيجيات الأعمال',
  'تسويق رقمي وصناعة محتوى',
  'استشارات وطب وصحة',
  'دروس وشروحات عملية'
]

// ─── POST MODEL ────────────────────────────────────────────────────────
const defaultForm = () => ({
  id: null,
  title: '',
  slug: '',
  category: 'هندسة البرمجيات والتطوير',
  excerpt: '',
  content: '<h2>مقدمة حول الموضوع</h2><p>اكتب هنا بكل سلاسة، واستمتع بتجربة تحرير عالمية خالية من أي تشتت...</p>',
  cover_image: '',
  tags: [],
  reading_time_minutes: 4,
  is_featured: false,
  is_published: false,
  sort_order: 0,
  meta_title: '',
  meta_description: '',
  meta_keywords: ''
})

const form = ref(defaultForm())

// Toast Notification
const toast = ref({ show: false, text: '', color: 'success', icon: 'mdi-check' })
function notify(text, color = 'success', icon = 'mdi-check') {
  toast.value = { show: true, text, color, icon }
}

// ─── COMPUTED STATS ────────────────────────────────────────────────────
const wordCount = computed(() => {
  const text = (form.value.content || '').replace(/<[^>]+>/g, ' ')
  return text.split(/\s+/).filter(Boolean).length
})

const estimatedMins = computed(() => Math.max(1, Math.round(wordCount.value / 180)))

const previewHtml = computed(() => {
  if (!form.value.content) return '<p class="text-secondary">لا يوجد محتوى بعد...</p>'
  try { return marked.parse(form.value.content) } catch (e) { return form.value.content }
})

const lastSavedTimeStr = computed(() => {
  if (!lastSavedAt.value) return ''
  return lastSavedAt.value.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
})

// ─── INITIALIZATION ────────────────────────────────────────────────────
onMounted(async () => {
  const postId = route.query.id
  if (postId && postId !== 'new') {
    try {
      const post = await adminService.getBlogPost(postId)
      form.value = { ...defaultForm(), ...post, tags: Array.isArray(post.tags) ? [...post.tags] : [] }
      initCanvasContent()
      lastSavedAt.value = new Date()
    } catch (e) {
      notify('فشل تحميل المقال المطلوب', 'error', 'mdi-alert')
      router.push('/admin/blog')
    }
  } else {
    initCanvasContent()
  }
})

function initCanvasContent() {
  nextTick(() => {
    adjustTitleHeight()
    adjustExcerptHeight()
    if (visualEditorRef.value) {
      let html = form.value.content || ''
      if (!html.startsWith('<') || html.includes('## ')) {
        html = marked.parse(html)
      }
      visualEditorRef.value.innerHTML = html
      form.value.content = html
    }
  })
}

// ─── EDITOR MODE SWITCHING ─────────────────────────────────────────────
function switchEditorMode(newMode) {
  if (editorMode.value === newMode) return

  if (newMode === 'visual') {
    form.value.content = marked.parse(form.value.content || '')
    editorMode.value = 'visual'
    nextTick(() => {
      if (visualEditorRef.value) visualEditorRef.value.innerHTML = form.value.content
    })
  } else {
    syncVisualToModel()
    try {
      form.value.content = turndown.turndown(form.value.content || '')
    } catch (e) {}
    editorMode.value = 'markdown'
  }
}

function onVisualInput() {
  if (visualEditorRef.value) {
    form.value.content = visualEditorRef.value.innerHTML
  }
}

function syncVisualToModel() {
  if (editorMode.value === 'visual' && visualEditorRef.value) {
    form.value.content = visualEditorRef.value.innerHTML
  }
}

// ─── FORMATTING TOOLS ──────────────────────────────────────────────────
function execFmt(command, value = null) {
  document.execCommand(command, false, value)
  onVisualInput()
  visualEditorRef.value?.focus()
}

function insertLink() {
  const url = prompt('أدخل رابط الموقع (URL):', 'https://')
  if (url) execFmt('createLink', url)
}

function insertCallout() {
  const html = `
    <div style="padding:16px 20px; margin:20px 0; background:rgba(59,130,246,0.08); border-right:4px solid #3b82f6; border-radius:10px;">
      <strong style="color:#2563eb; display:block; margin-bottom:4px; font-size:1.05rem;">💡 معلومة هامة / نصيحة:</strong>
      <span>اكتب النصيحة أو الفكرة المحورية هنا بأسلوب ملهم وواضح...</span>
    </div>
    <p><br></p>
  `
  document.execCommand('insertHTML', false, html)
  onVisualInput()
}

function openInsertCode() {
  codeSnippet.value = { lang: 'javascript', code: '' }
  codeDialog.value = true
}

function confirmInsertCode() {
  const { lang, code } = codeSnippet.value
  if (editorMode.value === 'visual') {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    document.execCommand('insertHTML', false, `<pre><code class="language-${lang}">${escaped}</code></pre><p><br></p>`)
    onVisualInput()
  } else {
    insertMdSyntax(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`)
  }
  codeDialog.value = false
}

function openInsertImage() {
  imageSnippet.value = { url: '', alt: '' }
  imageDialog.value = true
}

function confirmInsertImage() {
  const { url, alt } = imageSnippet.value
  if (editorMode.value === 'visual') {
    document.execCommand('insertHTML', false, `<figure><img src="${url}" alt="${alt}" style="max-width:100%; border-radius:12px; margin:16px 0;" /><figcaption style="text-align:center; color:#94a3b8; font-size:0.85rem; margin-top:4px;">${alt}</figcaption></figure><p><br></p>`)
    onVisualInput()
  } else {
    insertMdSyntax(`\n![${alt}](${url})\n`)
  }
  imageDialog.value = false
}

async function handleInlineImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadingInline.value = true
  try {
    const res = await adminService.uploadMedia(file, imageSnippet.value.alt || 'صورة المقال')
    imageSnippet.value.url = res.file_url || res.file
    notify('تم رفع الصورة بنجاح!')
  } catch (err) {
    notify('فشل رفع الصورة', 'error')
  } finally {
    uploadingInline.value = false
  }
}

function insertMdSyntax(syntax) {
  const ta = markdownTextareaRef.value
  if (!ta) { form.value.content += '\n' + syntax; return }
  const s = ta.selectionStart
  const e = ta.selectionEnd
  const txt = form.value.content
  form.value.content = txt.substring(0, s) + syntax + txt.substring(e)
}

// ─── COVER HANDLING ────────────────────────────────────────────────────
async function handleCoverUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const res = await adminService.uploadMedia(file, form.value.title || 'غلاف المقال')
    form.value.cover_image = res.file_url || res.file
    notify('تم رفع صورة الغلاف بنجاح! 🖼️')
  } catch (err) {
    notify('فشل رفع صورة الغلاف', 'error')
  }
}

function suggestCoverImage() {
  const query = encodeURIComponent(form.value.category || 'technology')
  form.value.cover_image = `https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80`
  notify('تم تعيين صورة غلاف متناسقة! يمكنك تغييرها في أي وقت.')
}

// ─── AUTO GENERATE SLUG & AUTO GROW ────────────────────────────────────
function onTitleInput(e) {
  adjustTitleHeight()
  if (!form.value.id || !form.value.slug) {
    autoGenerateSlug()
  }
}

function autoGenerateSlug() {
  const cleaned = (form.value.title || '')
    .replace(/[^\w\s\u0600-\u06FF-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
  form.value.slug = cleaned
}

function adjustTitleHeight() {
  const el = titleInputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.max(72, el.scrollHeight + 18) + 'px'
}

function adjustExcerptHeight() {
  const el = excerptInputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.max(56, el.scrollHeight + 12) + 'px'
}

watch(() => form.value.title, () => {
  nextTick(adjustTitleHeight)
})

watch(() => form.value.excerpt, () => {
  nextTick(adjustExcerptHeight)
})

function autoGrowTextarea(event) {
  adjustTitleHeight()
  adjustExcerptHeight()
}

function focusExcerpt() {
  excerptInputRef.value?.focus()
}

// ─── TAGS ──────────────────────────────────────────────────────────────
function addTag() {
  const val = tagInput.value.trim().replace(/^#/, '')
  if (val && !form.value.tags.includes(val)) {
    form.value.tags.push(val)
    tagInput.value = ''
  }
}

function removeTag(i) {
  form.value.tags.splice(i, 1)
}

// ─── SAVE & PUBLISH ────────────────────────────────────────────────────
async function savePost(silent = false) {
  if (!form.value.title.trim()) {
    notify('يرجى كتابة عنوان المقال أولاً', 'error', 'mdi-alert')
    titleInputRef.value?.focus()
    return false
  }

  syncVisualToModel()
  saving.value = true

  try {
    form.value.reading_time_minutes = estimatedMins.value

    if (form.value.id) {
      await adminService.updateBlogPost(form.value.id, form.value)
      if (!silent) notify('تم حفظ التعديلات بنجاح! 💾')
    } else {
      const res = await adminService.createBlogPost(form.value)
      form.value.id = res.id
      router.replace({ query: { id: res.id } })
      if (!silent) notify('تم إنشاء وحفظ المقال بنجاح! 💾')
    }
    lastSavedAt.value = new Date()
    return true
  } catch (err) {
    notify(err.message || 'فشل حفظ المقال', 'error', 'mdi-alert')
    return false
  } finally {
    saving.value = false
  }
}

async function togglePublish() {
  form.value.is_published = !form.value.is_published
  const ok = await savePost(true)
  if (ok) {
    if (form.value.is_published) {
      notify('🚀 تم نشر المقال بنجاح! أصبح متاحاً الآن للزوار في المدونة.')
    } else {
      notify('تم تحويل المقال إلى مسودة خاصة.')
    }
  }
}

async function executeDeletePost() {
  if (!form.value.id) return
  deleting.value = true
  try {
    await adminService.deleteBlogPost(form.value.id)
    notify('تم حذف المقال بنجاح.')
    deleteConfirmModal.value = false
    router.push('/admin/blog')
  } catch (e) {
    notify('فشل حذف المقال', 'error')
  } finally {
    deleting.value = false
  }
}

function confirmGoBack() {
  router.push('/admin/blog')
}

// ─── FULL AI ARTICLE GENERATION ────────────────────────────────────────
async function generateFullArticleWithAi() {
  if (!aiPromptTopic.value.trim()) return

  aiGenerating.value = true
  try {
    const prompt = `
أنت كاتب مقالات وخبير محتوى عالمي مرموق (مثل كبار كتاب Medium و Hacker Noon).
المطلوب منك كتابة مقال كامل متكامل باللغة العربية حول الموضوع التالي:
"${aiPromptTopic.value}"

أسلوب الكتابة: ${aiArticleTone.value}
الحجم المستهدف: ${aiArticleLength.value}

أجب بصيغة JSON فقط متوافقة مع هذا الهيكل تماماً:
{
  "title": "عنوان المقال الرئيسي (جذاب وقوي وبدون كليشيهات)",
  "slug": "english-slug-like-this",
  "category": "تصنيف مناسب من التصنيفات التقنية أو التصميمية",
  "excerpt": "مقدمة مشوقة وموجزة (سردية وجذابة من 2 إلى 3 أسطر)",
  "content_markdown": "محتوى المقال كاملاً ومنسقاً بصيغة Markdown الغنية، يتضمن: ## عناوين رئيسية، ### عناوين فرعية، فقرات غنية، - قوائم نقطية، > اقتباسات مميزة، أمثلة عملية أو كود توضيحي إذا لزم الأمر، وخاتمة قوية.",
  "tags": ["وسم1", "وسم2", "وسم3", "وسم4"],
  "meta_title": "عنوان سيو مميز أقل من 60 حرف",
  "meta_description": "وصف ميتا سيو جذاب بين 120 و 160 حرف",
  "meta_keywords": "كلمات مفتاحية مفصولة بفواصل"
}
تأكد من إرجاع JSON صالح ونظيف فقط.
`

    const responseText = await geminiService.generate({ prompt, temperature: 0.7 })

    let jsonStr = responseText.trim()
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonMatch) jsonStr = jsonMatch[0]

    const parsed = JSON.parse(jsonStr)

    // Apply to form
    if (parsed.title) form.value.title = parsed.title
    if (parsed.slug && (!form.value.id || !form.value.slug)) form.value.slug = parsed.slug
    if (parsed.category) form.value.category = parsed.category
    if (parsed.excerpt) form.value.excerpt = parsed.excerpt
    if (Array.isArray(parsed.tags)) form.value.tags = parsed.tags
    if (parsed.meta_title) form.value.meta_title = parsed.meta_title
    if (parsed.meta_description) form.value.meta_description = parsed.meta_description
    if (parsed.meta_keywords) form.value.meta_keywords = parsed.meta_keywords

    // Apply Content
    if (parsed.content_markdown) {
      form.value.content = marked.parse(parsed.content_markdown)
      if (editorMode.value === 'visual' && visualEditorRef.value) {
        visualEditorRef.value.innerHTML = form.value.content
      }
    }

    aiModalOpen.value = false
    notify('✨ تم توليد المقال بالكامل وتطبيقه بنجاح! يمكنك الآن مراجعته ونشره.')
  } catch (err) {
    notify(err.message || 'حدث خطأ أثناء توليد المقال بالذكاء الاصطناعي', 'error')
  } finally {
    aiGenerating.value = false
  }
}

async function generateSeoWithAi() {
  if (!form.value.title || !form.value.title.trim()) {
    notify('اكتب عنوان المقال أولاً لتوليد SEO متناسق معه', 'warning')
    return
  }

  notify('جاري توليد بيانات الـ SEO...')
  try {
    const prompt = `بناءً على هذا العنوان: "${form.value.title.trim()}" والمحتوى: "${(form.value.excerpt || '').trim()}"، ولد بيانات SEO باللغة العربية كـ JSON حصراً:
    {"meta_title": "...", "meta_description": "...", "meta_keywords": "...", "suggested_tags": ["..."]}`

    const res = await geminiService.generate({ prompt })
    const jsonMatch = res.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      if (data.meta_title) form.value.meta_title = data.meta_title
      if (data.meta_description) form.value.meta_description = data.meta_description
      if (data.meta_keywords) form.value.meta_keywords = data.meta_keywords
      if (Array.isArray(data.suggested_tags)) {
        form.value.tags = Array.from(new Set([...form.value.tags, ...data.suggested_tags]))
      }
      notify('تم تحديث بيانات الـ SEO بنجاح! 🔍')
    }
  } catch (e) {
    notify('فشل توليد SEO', 'error')
  }
}

// ─── AI ASSISTANT CALLBACKS ────────────────────────────────────────────
function onAiApplyContent({ content, mode }) {
  let html = content
  if (!html.startsWith('<') || html.includes('## ')) {
    html = marked.parse(content)
  }

  if (editorMode.value === 'visual') {
    if (mode === 'replace') {
      form.value.content = html
      if (visualEditorRef.value) visualEditorRef.value.innerHTML = html
    } else {
      form.value.content = (form.value.content || '') + '<br>' + html
      if (visualEditorRef.value) visualEditorRef.value.innerHTML = form.value.content
    }
  } else {
    form.value.content = mode === 'replace' ? content : ((form.value.content || '') + '\n\n' + content)
  }
  notify(mode === 'replace' ? 'تم استبدال المحتوى بنجاح! ✨' : 'تم إدراج المحتوى في المقال! ✨')
}

function onAiApplyTitle(newTitle) {
  form.value.title = newTitle
  autoGenerateSlug()
  notify('تم تطبيق العنوان الجديد بنجاح!')
}

function onAiApplySeo(seoData) {
  if (seoData.meta_title) form.value.meta_title = seoData.meta_title
  if (seoData.meta_description) form.value.meta_description = seoData.meta_description
  if (seoData.meta_keywords) form.value.meta_keywords = seoData.meta_keywords
  if (Array.isArray(seoData.suggested_tags)) {
    form.value.tags = Array.from(new Set([...form.value.tags, ...seoData.suggested_tags]))
  }
  notify('تم تطبيق بيانات الـ SEO والوسوم المقترحة!')
}
</script>

<style scoped>
/* ═════════════════════════════════════════════════════════════════
   WORLD-CLASS EDITOR STYLING (GHOST / MEDIUM / HASHNODE LEVEL)
   ═════════════════════════════════════════════════════════════════ */
.world-class-editor {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #0B0F19; /* Deep modern dark tone */
  color: #F8FAFC;
  font-family: var(--f-body, 'Cairo', sans-serif);
  overflow-x: hidden;
}

/* 1. FIXED TOPBAR */
.editor-header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 60px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-v-divider {
  width: 1px;
  height: 22px;
  background: rgba(255, 255, 255, 0.1);
}

.post-state-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}
.post-state-badge.published {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.post-state-badge.draft {
  background: rgba(148, 163, 184, 0.12);
  color: #94A3B8;
  border: 1px solid rgba(148, 163, 184, 0.2);
}
.state-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.editor-meta-stats {
  font-size: 0.8rem;
  color: #64748B;
  margin-right: 8px;
}
.saved-time {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #10B981 !important;
}

/* Header Buttons */
.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.back-btn {
  background: transparent;
  color: #94A3B8;
  border-color: rgba(255, 255, 255, 0.08);
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}

/* AI MAGIC BUTTON */
.ai-magic-btn {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.2));
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #C084FC;
  position: relative;
  overflow: hidden;
}
.ai-magic-btn:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(99, 102, 241, 0.35));
  border-color: #A855F7;
  color: #FFFFFF;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.3);
}
.magic-sparkle {
  font-size: 1rem;
}
.ai-badge-pulse {
  font-size: 0.65rem;
  font-weight: 900;
  padding: 1px 5px;
  border-radius: 4px;
  background: #9333EA;
  color: #FFFFFF;
}

.ai-drawer-btn {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #CBD5E1;
}
.ai-drawer-btn:hover, .ai-drawer-btn.active {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.4);
  color: #C084FC;
}

.preview-site-btn {
  background: rgba(255, 255, 255, 0.04);
  color: #94A3B8;
  border-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}
.preview-site-btn:hover {
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.2);
}

.settings-toggle-btn {
  background: rgba(255, 255, 255, 0.04);
  color: #CBD5E1;
  border-color: rgba(255, 255, 255, 0.1);
}
.settings-toggle-btn:hover, .settings-toggle-btn.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #60A5FA;
}

.save-draft-btn {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  color: #E2E8F0;
}
.save-draft-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

.publish-action-btn {
  background: linear-gradient(135deg, #2563EB, #1D4ED8);
  color: #FFFFFF;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}
.publish-action-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.5);
  transform: translateY(-1px);
}
.publish-action-btn.is-pub {
  background: rgba(239, 68, 68, 0.15);
  color: #F87171;
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: none;
}
.publish-action-btn.is-pub:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.25);
  color: #EF4444;
}

/* 2. BODY WRAPPER */
.editor-body-wrapper {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.editor-canvas-container {
  flex: 1;
  overflow-y: auto;
  padding: 40px 24px 120px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  justify-content: center;
}
.editor-canvas-container.with-sidebar {
  margin-left: 360px; /* Leave room for the drawer */
}

.editor-inner-document {
  width: 100%;
  max-width: 860px; /* Classic Medium / Ghost optimal reading width */
}

/* Cover Image Hero */
.cover-hero-banner {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
.cover-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-image-actions {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  gap: 8px;
}
.cover-action-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.cover-action-btn:hover {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.3);
}
.cover-action-btn.remove:hover {
  background: rgba(239, 68, 68, 0.8);
}

.cover-trigger-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.add-cover-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: #94A3B8;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.add-cover-pill:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3B82F6;
  color: #60A5FA;
}
.add-cover-pill.ai-suggest {
  border-style: solid;
  border-color: rgba(168, 85, 247, 0.3);
  color: #C084FC;
}
.add-cover-pill.ai-suggest:hover {
  background: rgba(168, 85, 247, 0.15);
  border-color: #A855F7;
}

/* Seamless Title Input */
.title-container {
  margin-bottom: 12px;
  overflow: visible;
}
.seamless-title-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--f-head, 'Cairo', sans-serif);
  font-size: 2.4rem;
  font-weight: 900;
  line-height: 1.5; /* Prevents Arabic descenders from being cut off */
  color: #FFFFFF;
  resize: none;
  overflow: hidden;
  direction: rtl;
  text-align: right;
  padding: 6px 4px 18px 4px; /* Generous bottom spacing for Arabic glyphs */
  min-height: 72px;
  box-sizing: border-box;
}
.seamless-title-input::placeholder {
  color: #334155;
}

/* Seamless Excerpt Input */
.excerpt-container {
  margin-bottom: 24px;
  overflow: visible;
}
.seamless-excerpt-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--f-body, 'Cairo', sans-serif);
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1.7;
  color: #94A3B8;
  resize: none;
  overflow: hidden;
  direction: rtl;
  text-align: right;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 4px 18px 4px;
  min-height: 60px;
  box-sizing: border-box;
}
.seamless-excerpt-input::placeholder {
  color: #334155;
}

/* FLOATING TOOLBAR */
.floating-editor-toolbar {
  position: sticky;
  top: 70px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.toolbar-mode-switcher {
  display: flex;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.t-mode-btn {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  background: transparent;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.2s;
}
.t-mode-btn.active {
  background: #2563EB;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.t-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}

.t-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid transparent;
  color: #CBD5E1;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}
.t-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
}
.t-btn.pill {
  padding: 0 8px;
  font-size: 0.78rem;
  font-weight: 700;
}
.t-btn.pill.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #60A5FA;
}

/* CONTENTEDITABLE CANVAS (WORLD CLASS VISUAL) */
.world-class-visual-canvas {
  min-height: 480px;
  outline: none;
  font-family: var(--f-body, 'Cairo', sans-serif);
  font-size: 1.15rem;
  line-height: 1.95;
  color: #E2E8F0;
  direction: rtl;
  text-align: right;
}
.world-class-visual-canvas:empty::before {
  content: attr(placeholder);
  color: #334155;
  pointer-events: none;
  display: block;
}

/* MARKDOWN SPLIT CANVAS */
.markdown-split-container {
  display: flex;
  min-height: 480px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: #0F172A;
}
.markdown-split-container.is-split .md-editor-column {
  width: 50%;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
.markdown-split-container.is-split .md-preview-column {
  width: 50%;
  display: flex;
  flex-direction: column;
}
.md-editor-column {
  width: 100%;
}
.markdown-source-textarea {
  width: 100%;
  height: 100%;
  min-height: 480px;
  padding: 24px;
  background: transparent;
  border: none;
  outline: none;
  color: #F8FAFC;
  font-family: var(--f-mono, monospace);
  font-size: 0.95rem;
  line-height: 1.8;
  resize: none;
}
.md-preview-column {
  background: rgba(15, 23, 42, 0.6);
  overflow-y: auto;
}
.preview-header {
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748B;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.preview-body {
  padding: 24px;
  font-size: 1.05rem;
  line-height: 1.85;
}

/* 3. SETTINGS DRAWER */
.editor-settings-drawer {
  position: fixed;
  top: 60px;
  left: -360px;
  bottom: 0;
  width: 360px;
  background: #111827;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 45;
  display: flex;
  flex-direction: column;
  transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 6px 0 24px rgba(0, 0, 0, 0.4);
}
.editor-settings-drawer.open {
  left: 0;
}

.drawer-header {
  height: 54px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.drawer-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #F1F5F9;
}
.drawer-close-btn {
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  padding: 4px;
}
.drawer-close-btn:hover { color: #FFFFFF; }

.drawer-scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
}

.drawer-section {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.drawer-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: #94A3B8;
  margin-bottom: 8px;
}
.drawer-sub-label {
  display: block;
  font-size: 0.74rem;
  color: #64748B;
  margin-bottom: 4px;
}
.slug-preview-text {
  font-size: 0.72rem;
  color: #64748B;
  margin-top: 6px;
  word-break: break-all;
}

/* Tags in Drawer */
.tag-input-row {
  display: flex;
  gap: 8px;
}
.tags-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(59, 130, 246, 0.12);
  color: #60A5FA;
  font-size: 0.75rem;
  font-weight: 700;
}
.remove-tag {
  cursor: pointer;
  opacity: 0.7;
}
.remove-tag:hover { opacity: 1; }

/* Toggles */
.setting-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.toggle-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #F1F5F9;
}
.toggle-desc {
  font-size: 0.72rem;
  color: #64748B;
}

/* Google SERP Live Box */
.serp-live-box {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 12px;
  direction: ltr;
  text-align: left;
  margin-top: 12px;
}
.serp-box-header {
  font-size: 0.68rem;
  font-weight: 700;
  color: #5F6368;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}
.serp-box-url {
  font-size: 0.72rem;
  color: #202124;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.serp-box-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1A0DAB;
  line-height: 1.3;
  margin: 3px 0;
}
.serp-box-desc {
  font-size: 0.75rem;
  color: #4D5156;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ai-seo-btn {
  background: transparent;
  border: none;
  color: #C084FC;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
}
.ai-seo-btn:hover { text-decoration: underline; }

/* Danger Delete */
.danger-section {
  border-bottom: none;
}
.delete-post-btn {
  width: 100%;
  padding: 9px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #EF4444;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.delete-post-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* 4. AI FULL GENERATOR MODAL */
.ai-generator-modal {
  background: #111827 !important;
  border: 1px solid rgba(168, 85, 247, 0.3) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6) !important;
}
.ai-modal-icon-badge {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #9333EA, #4F46E5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.quick-topics-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.quick-topic-chip {
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #CBD5E1;
  font-size: 0.74rem;
  cursor: pointer;
  transition: all 0.2s;
}
.quick-topic-chip:hover {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.4);
  color: #C084FC;
}
.btn-ai-generate {
  background: linear-gradient(135deg, #9333EA, #6366F1);
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(147, 51, 234, 0.4);
  transition: all 0.2s;
}
.btn-ai-generate:hover:not(:disabled) {
  background: linear-gradient(135deg, #A855F7, #4F46E5);
  box-shadow: 0 6px 22px rgba(147, 51, 234, 0.6);
  transform: translateY(-1px);
}
.btn-ai-generate:disabled { opacity: 0.5; cursor: not-allowed; }

/* Responsive adjustments */
@media (max-width: 900px) {
  .editor-canvas-container.with-sidebar {
    margin-left: 0;
  }
  .editor-settings-drawer.open {
    left: 0;
    right: 0;
    width: 100%;
  }
  .seamless-title-input {
    font-size: 1.85rem;
  }
}
</style>
