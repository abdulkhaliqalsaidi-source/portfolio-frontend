<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :fullscreen="isFullscreen"
    :max-width="isFullscreen ? undefined : '1240'"
    scrollable
    transition="dialog-bottom-transition"
  >
    <div
      v-if="project"
      class="case-study-drawer"
      :class="{ 'is-fullscreen': isFullscreen }"
      :style="{ '--cs-accent': project.accent_color || '#3B82F6' }"
      dir="rtl"
    >
      <!-- Top Bar -->
      <div class="cs-topbar">
        <div class="cs-topbar-left">
          <div class="cs-badge-pill" v-if="project.category || project.role">
            <v-icon icon="mdi-tag-outline" size="15" class="ml-1" />
            <span>{{ project.category || project.role }}</span>
          </div>
          <span class="cs-top-title text-truncate">{{ project.title }}</span>
          <span class="cs-top-year" v-if="project.year">{{ project.year }}</span>
        </div>

        <div class="cs-topbar-actions">
          <!-- Demo Link -->
          <a
            v-if="project.demo_url"
            :href="project.demo_url"
            target="_blank"
            class="cs-tool-btn"
            title="فتح في نافذة جديدة"
          >
            <v-icon icon="mdi-open-in-new" size="16" class="ml-1" />
            <span class="d-none d-sm-inline">زيارة الرابط</span>
          </a>

          <!-- Repo Link -->
          <a
            v-if="project.github_url"
            :href="project.github_url"
            target="_blank"
            class="cs-tool-btn"
            title="المستودع / الملفات"
          >
            <v-icon :icon="getRepoIcon(project.github_url)" size="16" class="ml-1" />
            <span class="d-none d-sm-inline">{{ getRepoLabel(project.github_url) }}</span>
          </a>

          <!-- Fullscreen -->
          <button
            type="button"
            class="cs-tool-btn icon-only"
            @click="isFullscreen = !isFullscreen"
            :title="isFullscreen ? 'تصغير النافذة' : 'ملء الشاشة'"
          >
            <v-icon :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" size="18" />
          </button>

          <!-- Close -->
          <button
            type="button"
            class="cs-close-btn"
            @click="close"
            title="إغلاق النافذة (Esc)"
          >
            <v-icon icon="mdi-close" size="20" />
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="cs-tabs-header">
        <div class="cs-tabs-track">

          <button
            class="cs-tab-btn"
            :class="{ active: activeTab === 'preview' }"
            @click="activeTab = 'preview'"
          >
            <v-icon icon="mdi-devices" size="17" class="ml-1" />
            <span>المعاينة والأجهزة</span>
          </button>


          <button
            class="cs-tab-btn"
            :class="{ active: activeTab === 'details' }"
            @click="activeTab = 'details'"
          >
            <v-icon icon="mdi-text-box-search-outline" size="17" class="ml-1" />
            <span>دراسة الحالة والحلول</span>
          </button>


          <button
            v-if="hasMetrics"
            class="cs-tab-btn"
            :class="{ active: activeTab === 'metrics' }"
            @click="activeTab = 'metrics'"
          >
            <v-icon icon="mdi-chart-timeline-variant-shimmer" size="17" class="ml-1" />
            <span>مؤشرات الأثر ({{ metricsList.length }})</span>
          </button>


          <button
            v-if="hasComparison"
            class="cs-tab-btn"
            :class="{ active: activeTab === 'comparison' }"
            @click="activeTab = 'comparison'"
          >
            <v-icon icon="mdi-compare" size="17" class="ml-1" />
            <span>مقارنة قبل وبعد</span>
          </button>


          <button
            v-if="hasArchitecture"
            class="cs-tab-btn"
            :class="{ active: activeTab === 'architecture' }"
            @click="activeTab = 'architecture'"
          >
            <v-icon icon="mdi-sitemap" size="17" class="ml-1" />
            <span>مخطط المعمارية والمسار</span>
          </button>


          <button
            class="cs-tab-btn"
            :class="{ active: activeTab === 'gallery' }"
            @click="activeTab = 'gallery'"
            v-if="galleryImages.length"
          >
            <v-icon icon="mdi-image-multiple-outline" size="17" class="ml-1" />
            <span>معرض الصور</span>
            <span class="tab-count">{{ galleryImages.length }}</span>
          </button>


          <button
            v-if="hasClientTestimonial"
            class="cs-tab-btn"
            :class="{ active: activeTab === 'testimonial' }"
            @click="activeTab = 'testimonial'"
          >
            <v-icon icon="mdi-comment-quote-outline" size="17" class="ml-1" color="#F59E0B" />
            <span>شهادة العميل</span>
          </button>
        </div>
      </div>

      <!-- Scrollable Body -->
      <div class="cs-content-body">

        <!-- TAB: Preview -->
        <div v-show="activeTab === 'preview'" class="tab-pane anim-fade">
          <div class="device-mockup-wrapper">
            <!-- Device Switcher Controls -->
            <div class="mockup-control-bar">
              <div class="device-buttons-group">
                <button
                  type="button"
                  class="device-btn"
                  :class="{ active: currentDevice === 'desktop' }"
                  @click="currentDevice = 'desktop'"
                >
                  <v-icon icon="mdi-laptop" size="17" class="ml-1" />
                  <span>كمبيوتر (Desktop)</span>
                </button>

                <button
                  type="button"
                  class="device-btn"
                  :class="{ active: currentDevice === 'tablet' }"
                  @click="currentDevice = 'tablet'"
                >
                  <v-icon icon="mdi-tablet" size="17" class="ml-1" />
                  <span>تابلت (Tablet)</span>
                </button>

                <button
                  type="button"
                  class="device-btn"
                  :class="{ active: currentDevice === 'mobile' }"
                  @click="currentDevice = 'mobile'"
                >
                  <v-icon icon="mdi-cellphone" size="17" class="ml-1" />
                  <span>موبايل (Mobile)</span>
                </button>
              </div>

              <!-- View Mode Toggle (Live iframe vs High-Res Visual) -->
              <div class="view-mode-toggles" v-if="project.demo_url">
                <button
                  class="mode-toggle-pill"
                  :class="{ active: previewMode === 'visual' }"
                  @click="previewMode = 'visual'"
                >
                  <v-icon icon="mdi-image-outline" size="14" class="ml-1" />
                  <span>واجهة بصرية</span>
                </button>
                <button
                  class="mode-toggle-pill"
                  :class="{ active: previewMode === 'iframe' }"
                  @click="previewMode = 'iframe'"
                >
                  <v-icon icon="mdi-web" size="14" class="ml-1" />
                  <span>متصفح حي (Live)</span>
                </button>
              </div>
            </div>

            <!-- Device Hardware Frame Container -->
            <div class="device-stage" :class="`stage-${currentDevice}`">
              <!-- Desktop Frame -->
              <div v-if="currentDevice === 'desktop'" class="device-frame frame-desktop">
                <div class="browser-chrome-bar">
                  <div class="chrome-traffic-lights">
                    <span class="light red" />
                    <span class="light yellow" />
                    <span class="light green" />
                  </div>
                  <div class="browser-omnibox">
                    <v-icon icon="mdi-lock" size="13" color="#10B981" class="ml-1 flex-shrink-0" />
                    <span class="url-text text-truncate">{{ project.demo_url || `https://portfolio.app/projects/${project.slug || project.id}` }}</span>
                    <button class="mini-copy-btn" v-if="project.demo_url" @click="copyUrl(project.demo_url)" title="نسخ الرابط">
                      <v-icon icon="mdi-content-copy" size="12" />
                    </button>
                  </div>
                  <div class="chrome-actions">
                    <span class="status-live-dot" />
                    <span class="text-caption font-weight-bold" style="color:var(--t2)">جاهز للمعاينة</span>
                  </div>
                </div>

                <div class="device-screen-viewport">
                  <iframe
                    v-if="previewMode === 'iframe' && project.demo_url"
                    :src="project.demo_url"
                    class="live-iframe"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                  <div v-else class="visual-img-wrap">
                    <img :src="project.image" :alt="project.title" class="preview-img" @error="handleImgFallback" />
                  </div>
                </div>
              </div>

              <!-- Tablet Frame -->
              <div v-else-if="currentDevice === 'tablet'" class="device-frame frame-tablet">
                <div class="tablet-camera-notch" />
                <div class="device-screen-viewport">
                  <iframe
                    v-if="previewMode === 'iframe' && project.demo_url"
                    :src="project.demo_url"
                    class="live-iframe"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                  <div v-else class="visual-img-wrap">
                    <img :src="project.image" :alt="project.title" class="preview-img" @error="handleImgFallback" />
                  </div>
                </div>
                <div class="tablet-home-indicator" />
              </div>

              <!-- Mobile Phone Frame -->
              <div v-else class="device-frame frame-mobile">
                <div class="mobile-speaker-island">
                  <span class="island-camera" />
                </div>
                <div class="device-screen-viewport">
                  <iframe
                    v-if="previewMode === 'iframe' && project.demo_url"
                    :src="project.demo_url"
                    class="live-iframe"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                  <div v-else class="visual-img-wrap">
                    <img :src="project.image" :alt="project.title" class="preview-img" @error="handleImgFallback" />
                  </div>
                </div>
                <div class="mobile-home-bar" />
              </div>
            </div>

            <!-- Preview Footer Specs -->
            <div class="preview-footer-meta mt-4" v-if="project.role || project.category || project.tags?.length">
              <div class="d-flex align-center justify-between flex-wrap gap-3">
                <div class="d-flex align-center gap-2">
                  <span class="badge-accent" v-if="project.role">{{ project.role }}</span>
                  <span class="badge-subtle" v-if="project.category">{{ project.category }}</span>
                </div>
                <div class="d-flex align-center gap-2" v-if="project.tags?.length">
                  <span class="tech-pill" v-for="tag in project.tags.slice(0, 6)" :key="tag">{{ tag }}</span>
                </div>
              </div>

              <!-- Quick Highlights Strip -->
              <div class="preview-highlights-strip mt-4" v-if="hasClientTestimonial">
                <div class="ph-item ph-quote" @click="activeTab = 'testimonial'">
                  <div class="ph-icon">
                    <v-icon icon="mdi-format-quote-open" size="18" color="#F59E0B" />
                  </div>
                  <div class="ph-text">
                    <span class="ph-label">شهادة {{ project.client_name || 'العميل' }}:</span>
                    <span class="ph-val">"{{ project.testimonial_quote || 'عرض تقييم ورأي العميل' }}"</span>
                  </div>
                  <v-icon icon="mdi-chevron-left" size="16" color="var(--t3)" class="flex-shrink-0" />
                </div>
              </div>
            </div><!-- end preview-footer-meta -->
          </div><!-- end device-mockup-wrapper -->
        </div><!-- end tab-pane preview -->


        <!-- TAB: Case Study Details -->
        <div v-show="activeTab === 'details'" class="tab-pane anim-fade">
          <div class="details-narrative-section">
            <div class="narrative-grid">
              <!-- Main Column -->
              <div class="narrative-main">
                <div class="narrative-card mb-6" v-if="project.full_description || project.short_description">
                  <h4 class="narrative-title">
                    <v-icon icon="mdi-information-outline" size="20" color="var(--cs-accent)" class="ml-2" />
                    <span>نظرة عامة على دراسة الحالة</span>
                  </h4>
                  <p class="narrative-p">{{ project.full_description || project.short_description }}</p>
                </div>

                <div class="narrative-card card-problem mb-6" v-if="project.problem">
                  <h4 class="narrative-title text-danger">
                    <v-icon icon="mdi-alert-decagram-outline" size="20" color="#EF4444" class="ml-2" />
                    <span>التحدي والمشكلة الأساسية</span>
                  </h4>
                  <p class="narrative-p">{{ project.problem }}</p>
                </div>

                <div class="narrative-card mb-6" v-if="project.features?.length">
                  <h4 class="narrative-title">
                    <v-icon icon="mdi-star-shooting-outline" size="20" color="#F59E0B" class="ml-2" />
                    <span>أبرز المميزات والمخرجات المسلمة</span>
                  </h4>
                  <div class="features-list-grid mt-3">
                    <div
                      v-for="(f, i) in project.features"
                      :key="i"
                      class="feature-row"
                    >
                      <v-icon icon="mdi-check-circle" size="16" color="#10B981" class="ml-2 flex-shrink-0" />
                      <span>{{ typeof f === 'string' ? f : (f.title || f.name || f) }}</span>
                    </div>
                  </div>
                </div>

                <div class="narrative-card mb-6" v-if="project.objectives?.length">
                  <h4 class="narrative-title">
                    <v-icon icon="mdi-target" size="20" color="var(--cs-accent)" class="ml-2" />
                    <span>الأهداف المحددة للمشروع</span>
                  </h4>
                  <div class="features-list-grid mt-3">
                    <div
                      v-for="(obj, i) in project.objectives"
                      :key="i"
                      class="feature-row"
                    >
                      <v-icon icon="mdi-checkbox-marked-circle-outline" size="16" color="#10B981" class="ml-2 flex-shrink-0" />
                      <span>{{ typeof obj === 'string' ? obj : (obj.title || obj.name || obj) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sidebar -->
              <div class="narrative-sidebar">
                <div class="client-quote-card mb-6" v-if="project.testimonial_quote || project.client_name">
                  <div class="quote-icon">“</div>
                  <p class="quote-text" v-if="project.testimonial_quote">
                    {{ project.testimonial_quote }}
                  </p>
                  <div class="quote-author-wrap mt-4" v-if="project.client_name">
                    <div class="author-avatar">
                      <v-icon icon="mdi-domain" size="20" color="var(--cs-accent)" />
                    </div>
                    <div>
                      <div class="author-name">{{ project.client_name }}</div>
                      <div class="author-role" v-if="project.category">{{ project.category }}</div>
                    </div>
                  </div>
                </div>

                <!-- Project Specs Quick Card -->
                <div class="specs-summary-card mb-6">
                  <h5 class="specs-card-title">بطاقة مواصفات العمل</h5>
                  <div class="spec-row" v-if="project.year">
                    <span class="s-label">سنة الإنجاز:</span>
                    <span class="s-val">{{ project.year }}</span>
                  </div>
                  <div class="spec-row" v-if="project.role">
                    <span class="s-label">الدور والمسؤولية:</span>
                    <span class="s-val">{{ project.role }}</span>
                  </div>
                  <div class="spec-row" v-if="project.category">
                    <span class="s-label">نطاق العمل:</span>
                    <span class="s-val">{{ project.category }}</span>
                  </div>
                  <div class="spec-row">
                    <span class="s-label">حالة المشروع:</span>
                    <span class="s-val text-success">✓ تم التسليم بنجاح</span>
                  </div>
                </div>
              </div><!-- end narrative-sidebar -->
            </div><!-- end narrative-grid -->
          </div><!-- end details-narrative-section -->
        </div><!-- end tab-pane details -->

        <!-- TAB: Metrics -->
        <div v-show="activeTab === 'metrics'" class="tab-pane anim-fade" v-if="hasMetrics">
          <div class="metrics-bento-section">
            <div class="section-intro mb-6">
              <div class="eyebrow-mini">الأثر الفعلي والنتائج</div>
              <h3 class="section-title-lg">مؤشرات الأداء المحققة (Measurable Impact)</h3>
            </div>


            <div class="metrics-grid" v-if="metricsList.length">
              <div
                v-for="(m, idx) in metricsList"
                :key="idx"
                class="metric-bento-card"
                :class="`mc-${(idx % 4) + 1}`"
              >
                <div class="metric-card-glow" />
                <div class="metric-top-flex">
                  <div class="metric-icon-wrap">
                    <v-icon :icon="m.icon || 'mdi-trending-up'" size="20" />
                  </div>
                  <span class="metric-change-tag" v-if="m.badge || m.change">
                    {{ m.badge || m.change }}
                  </span>
                </div>

                <div class="metric-val-num">{{ m.value }}</div>
                <div class="metric-val-label">{{ m.label }}</div>
                <p class="metric-val-desc" v-if="m.desc">{{ m.desc }}</p>
              </div>
            </div>


            <div class="achievements-card mt-6" v-if="project.objectives?.length">
              <h4 class="achievements-title">
                <v-icon icon="mdi-checkbox-marked-circle-outline" size="20" color="#10B981" class="ml-2" />
                <span>الأهداف المنجزة</span>
              </h4>
              <div class="achievements-grid mt-4">
                <div
                  v-for="(item, idx) in project.objectives"
                  :key="idx"
                  class="achievement-item"
                >
                  <v-icon icon="mdi-check-decagram" size="18" color="var(--cs-accent)" class="ml-2 flex-shrink-0" />
                  <span>{{ typeof item === 'string' ? item : (item.title || item.name || item) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Comparison -->
        <div v-show="activeTab === 'comparison'" class="tab-pane anim-fade" v-if="hasComparison">
          <div class="comparison-section">
            <div class="section-intro mb-6">
              <div class="eyebrow-mini">التحول والتطوير</div>
              <h3 class="section-title-lg">مقارنة تفاعلية: قبل البدء vs بعد الإنجاز والتحسين</h3>
            </div>


            <div
              v-if="beforeImage && afterImage"
              class="comparison-container"
              ref="compareContainerRef"
              @mousemove="handleCompareDrag"
              @touchmove="handleCompareTouch"
            >

              <div class="compare-layer compare-after">
                <img :src="afterImage" :alt="`${project.title} - بعد التحسين`" @error="handleImgFallback" />
                <span class="compare-badge badge-after">بعد الإنجاز والتحسين ✨</span>
              </div>


              <div class="compare-layer compare-before" :style="{ width: comparePos + '%' }">
                <img
                  :src="beforeImage"
                  :alt="`${project.title} - قبل التحسين`"
                  :style="{ width: containerWidth ? containerWidth + 'px' : '100%' }"
                  @error="handleImgFallback"
                />
                <span class="compare-badge badge-before">قبل البدء والتطوير ⏳</span>
              </div>


              <div class="compare-handle" :style="{ left: comparePos + '%' }">
                <div class="handle-line" />
                <div class="handle-circle">
                  <v-icon icon="mdi-code-tags" size="16" color="#FFFFFF" />
                </div>
                <div class="handle-line" />
              </div>
            </div>


            <div class="comparison-notes-grid mt-6" v-if="beforeNotesList.length || afterNotesList.length">
              <div class="comp-note-col before-col" v-if="beforeNotesList.length">
                <div class="comp-col-header">
                  <v-icon icon="mdi-alert-circle-outline" size="18" color="#EF4444" class="ml-2" />
                  <span>الوضع السابق والتحديات</span>
                </div>
                <ul class="comp-list">
                  <li v-for="(note, i) in beforeNotesList" :key="i">{{ note }}</li>
                </ul>
              </div>

              <div class="comp-note-col after-col" v-if="afterNotesList.length">
                <div class="comp-col-header">
                  <v-icon icon="mdi-check-circle-outline" size="18" color="#10B981" class="ml-2" />
                  <span>النتيجة بعد التطوير والحلول</span>
                </div>
                <ul class="comp-list">
                  <li v-for="(note, i) in afterNotesList" :key="i">{{ note }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Architecture -->
        <div v-show="activeTab === 'architecture'" class="tab-pane anim-fade" v-if="hasArchitecture">
          <div class="architecture-section">
            <div class="section-intro mb-6">
              <div class="eyebrow-mini">مخطط العمل</div>
              <h3 class="section-title-lg">مخطط المعمارية ومنهجية التنفيذ</h3>
            </div>


            <div class="architecture-flow-wrapper" v-if="architectureStages.length">
              <div
                v-for="(layer, idx) in architectureStages"
                :key="idx"
                class="arch-stage-card"
                :class="{ active: selectedArchIndex === idx }"
                @click="selectedArchIndex = idx"
              >
                <div class="stage-step-num">0{{ idx + 1 }}</div>
                <div class="stage-header-row">
                  <div class="stage-icon-wrap" :style="{ color: layer.color || 'var(--cs-accent)' }">
                    <v-icon :icon="layer.icon || 'mdi-layers-outline'" size="22" />
                  </div>
                  <div>
                    <h4 class="stage-title">{{ layer.title }}</h4>
                    <span class="stage-subtitle" v-if="layer.subtitle">{{ layer.subtitle }}</span>
                  </div>
                </div>

                <p class="stage-description mt-3" v-if="layer.description">{{ layer.description }}</p>


                <div class="stage-tech-tags mt-3" v-if="layer.tools?.length">
                  <span class="st-tag" v-for="t in layer.tools" :key="t">{{ t }}</span>
                </div>
              </div>
            </div>


            <div class="arch-code-box mt-6" v-if="project.architecture">
              <div class="arch-code-head">
                <div class="d-flex align-center gap-2">
                  <v-icon icon="mdi-file-tree" size="18" color="var(--cs-accent)" />
                  <span class="font-weight-bold">تفاصيل منهجية البناء والمعمارية المعتمدة</span>
                </div>
              </div>
              <div class="arch-code-body">
                <pre>{{ project.architecture }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Gallery -->
        <div v-show="activeTab === 'gallery'" class="tab-pane anim-fade" v-if="galleryImages.length">
          <div class="gallery-section">
            <div class="section-intro mb-6">
              <div class="eyebrow-mini">معرض واجهات العمل</div>
              <h3 class="section-title-lg">معرض الصور والشاشات التوضيحية (Gallery Showcase)</h3>
            </div>

            <div class="gallery-grid">
              <div
                v-for="(img, idx) in galleryImages"
                :key="idx"
                class="gallery-item"
                @click="openLightbox(img.image_url || img)"
              >
                <img :src="img.image_url || img" :alt="img.caption || project.title" loading="lazy" />
                <div class="gallery-overlay">
                  <v-icon icon="mdi-magnify-plus-outline" size="24" color="#FFFFFF" />
                  <span class="gallery-caption" v-if="img.caption">{{ img.caption }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: Testimonial -->
        <div v-show="activeTab === 'testimonial'" class="tab-pane anim-fade" v-if="hasClientTestimonial">
          <div class="drawer-testimonial-view">
            <div class="section-intro mb-6">
              <div class="eyebrow-mini">رأي الشريك والعميل</div>
              <h3 class="section-title-lg">شهادة العميل وتقييمه للعمل (Client Testimonial)</h3>
            </div>

            <div class="drawer-testimonial-card">
              <div class="dt-decor-blur" />

              <div class="d-flex align-center justify-between mb-4">
                <div class="dt-quote-symbol">
                  <v-icon icon="mdi-format-quote-open" size="42" color="var(--cs-accent)" />
                </div>
                <div class="d-flex align-center gap-1">
                  <v-icon v-for="i in 5" :key="i" icon="mdi-star" size="20" color="#F59E0B" />
                </div>
              </div>

              <blockquote class="dt-quote-body" v-if="project.testimonial_quote">
                "{{ project.testimonial_quote }}"
              </blockquote>

              <div class="dt-client-footer mt-6">
                <div class="dt-avatar-box">
                  <v-icon icon="mdi-domain" size="28" color="var(--cs-accent)" />
                </div>
                <div class="dt-info">
                  <h4 class="dt-client-title">{{ project.client_name || 'العميل أو المؤسسة المستفيدة' }}</h4>
                  <div class="dt-client-meta">
                    <span v-if="project.category">{{ project.category }} • </span>
                    <span class="text-success font-weight-bold">
                      <v-icon icon="mdi-check-decagram" size="15" color="#10B981" class="ml-1" />
                      عمل معتمد ومكتمل بنجاح
                    </span>
                  </div>
                </div>
              </div>
            </div>


            <div class="drawer-testimonial-cta mt-6">
              <div class="d-flex align-center justify-between flex-wrap gap-3">
                <div>
                  <h5 class="font-weight-bold mb-1" style="color:var(--t1)">هل ترغب في تحقيق نتائج مماثلة لمشروعك؟</h5>
                  <p class="text-caption text-secondary mb-0">يمكننا مناقشة متطلباتك وبدء العمل على تنفيذها بأعلى معايير الجودة.</p>
                </div>
                <a href="#contact" class="btn btn-primary" @click="handleGoContact">
                  <v-icon icon="mdi-email-fast-outline" size="16" class="ml-1" />
                  <span>طلب استشارة أو عمل مماثل</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Bar -->
      <div class="cs-footer-bar">
        <div class="d-flex align-center gap-2">
          <a v-if="project.demo_url" :href="project.demo_url" target="_blank" class="btn btn-primary btn-sm">
            <v-icon icon="mdi-open-in-new" size="15" class="ml-1" />
            <span>معاينة الرابط الحي</span>
          </a>
          <a v-if="project.github_url" :href="project.github_url" target="_blank" class="btn btn-ghost btn-sm">
            <v-icon :icon="getRepoIcon(project.github_url)" size="15" class="ml-1" />
            <span>{{ getRepoLabel(project.github_url) }}</span>
          </a>
        </div>

        <div class="d-flex align-center gap-2">
          <a href="#contact" class="btn btn-ghost btn-sm" @click="handleGoContact">
            <span>تواصل لتنفيذ مشروع</span>
          </a>
          <button class="btn btn-secondary btn-sm" @click="close">
            <span>إغلاق</span>
          </button>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'contact'])

const isFullscreen = ref(false)
const activeTab = ref('preview')
const currentDevice = ref('desktop') // 'desktop' | 'tablet' | 'mobile'
const previewMode = ref('visual') // 'visual' | 'iframe'
const selectedArchIndex = ref(0)

// Comparison slider state
const comparePos = ref(50)
const compareContainerRef = ref(null)
const containerWidth = ref(800)

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleGoContact() {
  close()
  emit('contact', props.project)
}

function copyUrl(url) {
  if (!url) return
  navigator.clipboard?.writeText(url)
}

function handleImgFallback(e) {
  e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'
}

function getRepoIcon(url = '') {
  if (url.includes('github')) return 'mdi-github'
  if (url.includes('gitlab')) return 'mdi-gitlab'
  if (url.includes('figma')) return 'mdi-vector-circle'
  if (url.includes('behance')) return 'mdi-behance'
  if (url.includes('dribbble')) return 'mdi-dribbble'
  return 'mdi-source-repository'
}

function getRepoLabel(url = '') {
  if (url.includes('github')) return 'GitHub'
  if (url.includes('gitlab')) return 'GitLab'
  if (url.includes('figma')) return 'Figma Design'
  if (url.includes('behance')) return 'Behance'
  return 'المستودع'
}

// ═══════════════════════════════════════════════════════════════════════════
// DYNAMIC DASHBOARD DATA COMPUTED PROPERTIES (100% Dynamic from Dashboard)
// ═══════════════════════════════════════════════════════════════════════════

// Metrics list directly from project.metrics
const metricsList = computed(() => {
  const p = props.project
  if (!p || !Array.isArray(p.metrics)) return []
  return p.metrics.map(m => {
    if (typeof m === 'string') {
      return {
        value: m.match(/(\+?\d+%?|\d+x|\d+\.\d+%?)/)?.[0] || m,
        label: m,
        badge: '',
        icon: 'mdi-trending-up',
        desc: ''
      }
    }
    return {
      value: m.value || '',
      label: m.label || '',
      badge: m.badge || m.change || '',
      desc: m.desc || m.description || '',
      icon: m.icon || 'mdi-trending-up'
    }
  }).filter(m => !!m.value || !!m.label)
})

const hasMetrics = computed(() => {
  return metricsList.value.length > 0 || (Array.isArray(props.project?.objectives) && props.project.objectives.length > 0)
})

// Before & After Images & Notes
const beforeImage = computed(() => props.project?.before_image || '')
const afterImage = computed(() => props.project?.after_image || props.project?.image || '')

const beforeNotesList = computed(() => {
  const p = props.project
  return Array.isArray(p?.before_notes) ? p.before_notes.filter(n => typeof n === 'string' && n.trim()) : []
})

const afterNotesList = computed(() => {
  const p = props.project
  return Array.isArray(p?.after_notes) ? p.after_notes.filter(n => typeof n === 'string' && n.trim()) : []
})

const hasComparison = computed(() => {
  return (!!beforeImage.value && !!afterImage.value) || beforeNotesList.value.length > 0 || afterNotesList.value.length > 0
})

function handleCompareDrag(e) {
  if (!compareContainerRef.value) return
  const rect = compareContainerRef.value.getBoundingClientRect()
  containerWidth.value = rect.width
  const x = e.clientX - rect.left
  const pct = Math.max(5, Math.min(95, (x / rect.width) * 100))
  comparePos.value = pct
}

function handleCompareTouch(e) {
  if (!compareContainerRef.value || !e.touches[0]) return
  const rect = compareContainerRef.value.getBoundingClientRect()
  containerWidth.value = rect.width
  const x = e.touches[0].clientX - rect.left
  const pct = Math.max(5, Math.min(95, (x / rect.width) * 100))
  comparePos.value = pct
}

// Architecture Stages directly from project.architecture_stages or project.architecture
const architectureStages = computed(() => {
  const p = props.project
  if (!p || !Array.isArray(p.architecture_stages)) return []
  return p.architecture_stages.map((st, i) => ({
    title: st.title || `المرحلة ${i + 1}`,
    subtitle: st.subtitle || '',
    description: st.description || st.desc || '',
    icon: st.icon || 'mdi-layers-outline',
    color: st.color || '#38BDF8',
    tools: Array.isArray(st.tools) ? st.tools : (st.tools ? [st.tools] : [])
  })).filter(st => !!st.title)
})

const hasArchitecture = computed(() => {
  return architectureStages.value.length > 0 || !!props.project?.architecture
})

// Gallery Images
const galleryImages = computed(() => {
  const p = props.project
  if (!p) return []
  if (Array.isArray(p.gallery) && p.gallery.length) return p.gallery
  if (p.image) return [{ image_url: p.image, caption: p.title }]
  return []
})

function openLightbox(url) {
  window.open(url, '_blank')
}

// Client testimonial availability
const hasClientTestimonial = computed(() => {
  const p = props.project
  return !!(p?.testimonial_quote || p?.client_name)
})


// Watch project changes to reset tab if current tab is not available
watch(() => props.project, (newP) => {
  if (!newP) return
  activeTab.value = 'preview'
}, { immediate: true })
</script>

<style scoped>
/* ═════════════════════════════════════════════════════════════════════════
   WORLD-CLASS INTERACTIVE CASE STUDY DRAWER
   ═════════════════════════════════════════════════════════════════════════ */
.case-study-drawer {
  background: #0B0F19;
  color: #F8FAFC;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  height: 90vh;
  max-height: 900px;
  box-shadow: 0 25px 80px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(59, 130, 246, 0.1);
  font-family: var(--f-body, 'Cairo', sans-serif);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-study-drawer.is-fullscreen {
  height: 100vh !important;
  max-height: 100vh !important;
  border-radius: 0 !important;
  border: none !important;
}

/* ═════════════════════════════════════════════════════════════════════════
   TOP BAR
   ═════════════════════════════════════════════════════════════════════════ */
.cs-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 16px;
  flex-shrink: 0;
}

.cs-topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.cs-badge-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--cs-accent, #38BDF8);
  background: color-mix(in srgb, var(--cs-accent, #3B82F6) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--cs-accent, #3B82F6) 30%, transparent);
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.cs-top-title {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFFFFF;
}

.cs-top-year {
  font-size: 0.78rem;
  font-family: var(--f-mono, monospace);
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 8px;
  border-radius: 6px;
}

.cs-topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.cs-tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #E2E8F0;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.cs-tool-btn.icon-only {
  width: 34px;
  padding: 0;
}

.cs-tool-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.2);
}

.cs-close-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cs-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

/* ═════════════════════════════════════════════════════════════════════════
   TABS HEADER
   ═════════════════════════════════════════════════════════════════════════ */
.cs-tabs-header {
  background: #0D1322;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 20px;
  overflow-x: auto;
  flex-shrink: 0;
}

.cs-tabs-track {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: max-content;
}

.cs-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #94A3B8;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.cs-tab-btn:hover {
  color: #F1F5F9;
  background: rgba(255, 255, 255, 0.03);
}

.cs-tab-btn.active {
  color: var(--cs-accent, #38BDF8);
  border-bottom-color: var(--cs-accent, #38BDF8);
}

.tab-count {
  font-size: 0.72rem;
  font-family: var(--f-mono, monospace);
  background: rgba(255, 255, 255, 0.08);
  padding: 1px 6px;
  border-radius: 10px;
  color: #CBD5E1;
}

/* ═════════════════════════════════════════════════════════════════════════
   SCROLLABLE BODY
   ═════════════════════════════════════════════════════════════════════════ */
.cs-content-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 24px;
}

.tab-pane {
  max-width: 1140px;
  margin: 0 auto;
}

.anim-fade {
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-intro .eyebrow-mini {
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--cs-accent, #38BDF8);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.section-intro .section-title-lg {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 1.35rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.section-intro .section-desc-p {
  font-size: 0.88rem;
  color: #94A3B8;
  max-width: 800px;
  line-height: 1.6;
  margin: 0;
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 1: DEVICE MOCKUPS
   ═════════════════════════════════════════════════════════════════════════ */
.device-mockup-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mockup-control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 960px;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.device-buttons-group {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}

.device-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #94A3B8;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--f-body, 'Cairo', sans-serif);
}

.device-btn:hover {
  color: #FFFFFF;
}

.device-btn.active {
  background: var(--cs-accent, #3B82F6);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.view-mode-toggles {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 3px;
}

.mode-toggle-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: #94A3B8;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mode-toggle-pill.active {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

/* Device Frames */
.device-stage {
  display: flex;
  justify-content: center;
  width: 100%;
  perspective: 1200px;
}

.device-frame {
  background: #1E293B;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* Desktop */
.frame-desktop {
  width: 100%;
  max-width: 980px;
}

.browser-chrome-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #0F172A;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 12px;
}

.chrome-traffic-lights {
  display: flex;
  align-items: center;
  gap: 6px;
}

.light {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.light.red { background: #EF4444; }
.light.yellow { background: #F59E0B; }
.light.green { background: #10B981; }

.browser-omnibox {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 4px 10px;
  flex: 1;
  max-width: 500px;
  gap: 6px;
}

.url-text {
  font-size: 0.78rem;
  font-family: var(--f-mono, monospace);
  color: #CBD5E1;
  flex: 1;
  direction: ltr;
}

.mini-copy-btn {
  background: transparent;
  border: none;
  color: #94A3B8;
  cursor: pointer;
  padding: 2px;
}
.mini-copy-btn:hover { color: #FFFFFF; }

.status-live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
  display: inline-block;
  margin-left: 6px;
}

/* Tablet */
.frame-tablet {
  width: 680px;
  max-width: 90vw;
  border: 12px solid #1E293B;
  border-radius: 28px;
}

.tablet-camera-notch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin: 6px auto;
}

.tablet-home-indicator {
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
  margin: 8px auto 4px;
}

/* Mobile */
.frame-mobile {
  width: 360px;
  max-width: 90vw;
  border: 10px solid #1E293B;
  border-radius: 36px;
}

.mobile-speaker-island {
  width: 100px;
  height: 20px;
  border-radius: 12px;
  background: #0F172A;
  margin: 6px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.island-camera {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1E293B;
}

.mobile-home-bar {
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  margin: 8px auto 4px;
}

/* Screen Viewport */
.device-screen-viewport {
  background: #020617;
  height: 460px;
  overflow-y: auto;
  position: relative;
}

.live-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #FFFFFF;
}

.visual-img-wrap {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.preview-img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.badge-accent {
  font-size: 0.78rem;
  font-weight: 800;
  color: #FFFFFF;
  background: var(--cs-accent, #3B82F6);
  padding: 4px 12px;
  border-radius: 8px;
}

.badge-subtle {
  font-size: 0.78rem;
  font-weight: 700;
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.06);
  padding: 4px 10px;
  border-radius: 8px;
}

.tech-pill {
  font-size: 0.72rem;
  font-family: var(--f-mono, monospace);
  color: #CBD5E1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 6px;
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 2: METRICS BENTO GRID
   ═════════════════════════════════════════════════════════════════════════ */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.metric-bento-card {
  position: relative;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 22px;
  overflow: hidden;
  transition: all 0.25s ease;
}

.metric-bento-card:hover {
  transform: translateY(-3px);
  border-color: var(--cs-accent, #38BDF8);
  box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.25);
}

.metric-top-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.metric-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--cs-accent, #3B82F6) 15%, transparent);
  color: var(--cs-accent, #38BDF8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-change-tag {
  font-size: 0.74rem;
  font-weight: 800;
  color: #10B981;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 2px 8px;
  border-radius: 6px;
}

.metric-val-num {
  font-family: var(--f-display, 'Tajawal', sans-serif);
  font-size: 2rem;
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1.2;
  margin-bottom: 4px;
}

.metric-val-label {
  font-size: 0.92rem;
  font-weight: 800;
  color: #E2E8F0;
  margin-bottom: 6px;
}

.metric-val-desc {
  font-size: 0.8rem;
  color: #94A3B8;
  line-height: 1.5;
  margin: 0;
}

.achievements-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 22px;
}

.achievements-title {
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  font-size: 0.88rem;
  color: #CBD5E1;
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  line-height: 1.5;
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 3: COMPARISON SLIDER
   ═════════════════════════════════════════════════════════════════════════ */
.comparison-container {
  position: relative;
  width: 100%;
  max-width: 960px;
  height: 480px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.8);
  cursor: ew-resize;
  user-select: none;
  touch-action: none;
}

.compare-layer {
  position: absolute;
  top: 0;
  bottom: 0;
  overflow: hidden;
}

.compare-after {
  left: 0;
  right: 0;
  width: 100%;
}

.compare-after img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.compare-before {
  left: 0;
  z-index: 2;
  border-right: 2px solid #FFFFFF;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.5);
}

.compare-before img {
  height: 100%;
  object-fit: cover;
  display: block;
}

.compare-badge {
  position: absolute;
  bottom: 20px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  backdrop-filter: blur(8px);
  z-index: 5;
}

.badge-before {
  left: 20px;
  background: rgba(239, 68, 68, 0.85);
  color: #FFFFFF;
}

.badge-after {
  right: 20px;
  background: rgba(16, 185, 129, 0.85);
  color: #FFFFFF;
}

.compare-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  margin-left: -20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.handle-line {
  flex: 1;
  width: 2px;
  background: #FFFFFF;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}

.handle-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--cs-accent, #3B82F6);
  border: 3px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

.comparison-notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.comp-note-col {
  border-radius: 16px;
  padding: 20px;
  border: 1px solid transparent;
}

.before-col {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.after-col {
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.2);
}

.comp-col-header {
  display: flex;
  align-items: center;
  font-size: 0.96rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #FFFFFF;
}

.comp-list {
  padding-right: 20px;
  margin: 0;
  font-size: 0.86rem;
  color: #CBD5E1;
  line-height: 1.7;
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 4: ARCHITECTURE FLOW
   ═════════════════════════════════════════════════════════════════════════ */
.architecture-flow-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.arch-stage-card {
  position: relative;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.arch-stage-card:hover, .arch-stage-card.active {
  background: rgba(30, 41, 59, 0.8);
  border-color: var(--cs-accent, #38BDF8);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.25);
}

.stage-step-num {
  position: absolute;
  top: 16px;
  left: 16px;
  font-family: var(--f-mono, monospace);
  font-size: 1.1rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.15);
}

.stage-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stage-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stage-title {
  font-size: 0.94rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 2px;
}

.stage-subtitle {
  font-size: 0.74rem;
  color: #94A3B8;
}

.stage-description {
  font-size: 0.82rem;
  color: #CBD5E1;
  line-height: 1.6;
  margin: 0;
}

.stage-tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.st-tag {
  font-size: 0.72rem;
  font-family: var(--f-mono, monospace);
  background: rgba(255, 255, 255, 0.06);
  color: #E2E8F0;
  padding: 2px 8px;
  border-radius: 6px;
}

.arch-code-box {
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
}

.arch-code-head {
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.86rem;
  color: #FFFFFF;
}

.arch-code-body pre {
  padding: 18px;
  margin: 0;
  font-family: var(--f-mono, monospace);
  font-size: 0.85rem;
  color: #93C5FD;
  white-space: pre-wrap;
  line-height: 1.6;
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 5: DEEP CASE STUDY DETAILS
   ═════════════════════════════════════════════════════════════════════════ */
.narrative-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

@media (max-width: 900px) {
  .narrative-grid { grid-template-columns: 1fr; }
}

.narrative-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 22px;
}

.narrative-title {
  display: flex;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 12px;
}

.narrative-p {
  font-size: 0.9rem;
  color: #CBD5E1;
  line-height: 1.7;
  margin: 0;
}

.card-problem {
  background: rgba(239, 68, 68, 0.04);
  border-color: rgba(239, 68, 68, 0.2);
}

.features-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
}

.feature-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.86rem;
  color: #E2E8F0;
}

.client-quote-card {
  position: relative;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(123, 110, 246, 0.05));
  border: 1px solid color-mix(in srgb, var(--cs-accent, #3B82F6) 30%, transparent);
  border-radius: 18px;
  padding: 22px;
}

.quote-icon {
  font-size: 3rem;
  font-family: serif;
  color: var(--cs-accent, #38BDF8);
  line-height: 1;
  opacity: 0.4;
}

.quote-text {
  font-size: 0.86rem;
  font-style: italic;
  color: #F1F5F9;
  line-height: 1.6;
  margin: 0;
}

.quote-author-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-name {
  font-size: 0.88rem;
  font-weight: 800;
  color: #FFFFFF;
}

.author-role {
  font-size: 0.74rem;
  color: #94A3B8;
}

.specs-summary-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px;
}

.specs-card-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 8px;
}

.spec-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  padding: 6px 0;
}

.s-label { color: #94A3B8; }
.s-val { font-weight: 700; color: #FFFFFF; }

.drawer-cta-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 20px;
}

.drawer-cta-card h5 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.drawer-cta-card p {
  font-size: 0.8rem;
  color: #94A3B8;
  line-height: 1.5;
  margin: 0;
}

/* ═════════════════════════════════════════════════════════════════════════
   TAB 6: GALLERY
   ═════════════════════════════════════════════════════════════════════════ */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 220px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.gallery-caption {
  font-size: 0.82rem;
  font-weight: 700;
  color: #FFFFFF;
}

.gallery-item:hover img {
  transform: scale(1.06);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

/* ═════════════════════════════════════════════════════════════════════════
   FOOTER BAR
   ═════════════════════════════════════════════════════════════════════════ */
.cs-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: #0D1322;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 12px;
}

/* ═════════════════════════════════════════════════════════════════════════
   LIGHT THEME SUPPORT
   ═════════════════════════════════════════════════════════════════════════ */
[data-theme="light"] .case-study-drawer {
  background: #FFFFFF;
  color: #0F172A;
  border-color: #E2E8F0;
  box-shadow: 0 25px 80px -15px rgba(15, 23, 42, 0.25);
}

[data-theme="light"] .cs-topbar {
  background: #F8FAFC;
  border-bottom-color: #E2E8F0;
}

[data-theme="light"] .cs-top-title {
  color: #0F172A;
}

[data-theme="light"] .cs-tool-btn {
  background: #FFFFFF;
  border-color: #CBD5E1;
  color: #475569;
}

[data-theme="light"] .cs-tabs-header {
  background: #F1F5F9;
  border-bottom-color: #E2E8F0;
}

[data-theme="light"] .cs-tab-btn {
  color: #64748B;
}

[data-theme="light"] .cs-tab-btn:hover {
  color: #0F172A;
  background: #E2E8F0;
}

[data-theme="light"] .device-buttons-group,
[data-theme="light"] .view-mode-toggles {
  background: #F1F5F9;
  border-color: #E2E8F0;
}

[data-theme="light"] .device-btn {
  color: #64748B;
}

[data-theme="light"] .browser-chrome-bar {
  background: #E2E8F0;
  border-bottom-color: #CBD5E1;
}

[data-theme="light"] .browser-omnibox {
  background: #FFFFFF;
  border-color: #CBD5E1;
}

[data-theme="light"] .url-text {
  color: #334155;
}

[data-theme="light"] .metric-bento-card,
[data-theme="light"] .achievements-card,
[data-theme="light"] .arch-stage-card,
[data-theme="light"] .narrative-card,
[data-theme="light"] .specs-summary-card,
[data-theme="light"] .drawer-cta-card {
  background: #F8FAFC;
  border-color: #E2E8F0;
}

[data-theme="light"] .section-title-lg,
[data-theme="light"] .metric-val-num,
[data-theme="light"] .metric-val-label,
[data-theme="light"] .achievements-title,
[data-theme="light"] .stage-title,
[data-theme="light"] .narrative-title,
[data-theme="light"] .author-name,
[data-theme="light"] .specs-card-title,
[data-theme="light"] .drawer-cta-card h5,
[data-theme="light"] .comp-col-header,
[data-theme="light"] .s-val {
  color: #0F172A;
}

[data-theme="light"] .metric-val-desc,
[data-theme="light"] .section-desc-p,
[data-theme="light"] .stage-description,
[data-theme="light"] .narrative-p,
[data-theme="light"] .comp-list,
[data-theme="light"] .quote-text,
[data-theme="light"] .drawer-cta-card p {
  color: #475569;
}

/* Preview Highlights Strip */
.preview-highlights-strip {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.ph-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
}

.ph-item:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(-3px);
}

.ph-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ph-text {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.82rem;
}

.ph-label {
  font-weight: 700;
  color: var(--t2, #94A3B8);
  white-space: nowrap;
}

.ph-val {
  color: #FFFFFF;
  font-weight: 600;
  font-style: italic;
}

/* Drawer Testimonial View */
.drawer-testimonial-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px 0;
}

.drawer-testimonial-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.4), 0 0 20px -5px rgba(245, 158, 11, 0.1);
  backdrop-filter: blur(14px);
}

.dt-decor-blur {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.dt-quote-symbol {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dt-quote-body {
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.85;
  color: #F8FAFC;
  font-style: italic;
  font-family: var(--f-body, 'Cairo', sans-serif);
  margin: 0;
}

.dt-client-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.dt-avatar-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dt-client-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 2px;
}

.dt-client-meta {
  font-size: 0.84rem;
  color: #94A3B8;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.drawer-testimonial-cta {
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px 24px;
}


[data-theme="light"] .ph-item {
  background: #FFFFFF;
  border-color: #E2E8F0;
}

[data-theme="light"] .ph-val {
  color: #0F172A;
}

[data-theme="light"] .drawer-testimonial-card {
  background: #FFFFFF;
  border-color: #FED7AA;
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.1);
}

[data-theme="light"] .dt-quote-body {
  color: #1E293B;
}

[data-theme="light"] .dt-client-title {
  color: #0F172A;
}

[data-theme="light"] .dt-client-footer {
  border-top-color: #E2E8F0;
}

[data-theme="light"] .drawer-testimonial-cta,

[data-theme="light"] .cs-footer-bar {
  background: #F8FAFC;
  border-top-color: #E2E8F0;
}
</style>
