<template>
  <div class="home-view">
    <HeroSection />
    <ProjectsSection />
    <StatsSection />
    <ServicesSection />
    <TestimonialsSection />
    <TimelineSection />
    <BlogSection />
    <ContactSection />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useSeoEngine } from '~/composables/useSeoEngine'
import { useJsonLd } from '~/composables/useJsonLd'
import HeroSection from '~/components/public/HeroSection.vue'
import StatsSection from '~/components/public/StatsSection.vue'
import ServicesSection from '~/components/public/ServicesSection.vue'
import ProjectsSection from '~/components/public/ProjectsSection.vue'
import TestimonialsSection from '~/components/public/TestimonialsSection.vue'
import TimelineSection from '~/components/public/TimelineSection.vue'
import BlogSection from '~/components/public/BlogSection.vue'
import ContactSection from '~/components/public/ContactSection.vue'

const portfolioStore = usePortfolioStore()

await useAsyncData('home-content', async () => {
  if (!portfolioStore.hasContent) await portfolioStore.fetchPublicContent()
  return true
})

// شبكة أمان: إذا فشل الـ SSR (السيرفر نائم) أعد المحاولة من المتصفح
onMounted(() => {
  if (!portfolioStore.hasContent) portfolioStore.fetchPublicContent(true)
})

const dev = computed(() => portfolioStore.developer || {})
const settings = computed(() => portfolioStore.settings || {})

const devName = computed(() => dev.value?.name || dev.value?.full_name || 'الملف المهني الشخصي')
const devTitle = computed(() => dev.value?.title || dev.value?.role || 'خبير وممارس مهني')

// Professional Dynamic SEO setup
const seo = useSeoEngine({
  title: settings.value?.site_title || `${devName.value} | ${devTitle.value}`,
  description: settings.value?.site_description || dev.value?.tagline || dev.value?.bio || `الموقع الرسمي والملف المهني لـ ${devName.value} - ${devTitle.value}.`,
  image: settings.value?.og_image || dev.value?.avatar || '/avatar.jpg',
  slug: '',
  type: 'website',
  devName: devName.value,
  devTitle: devTitle.value,
  keywords: settings.value?.meta_keywords,
  author: settings.value?.site_author || devName.value,
  geoPlacename: settings.value?.geo_placename,
  googleVerification: settings.value?.google_site_verification
})

// Structured JSON-LD Schema
const { setPersonSchema, addSchema } = useJsonLd()
setPersonSchema(portfolioStore.developer, [], portfolioStore.services)
addSchema({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${seo.canonicalUrl}/#website`,
  name: devName.value,
  alternateName: `موقع ${devName.value} الشخصي | Portfolio`,
  url: seo.canonicalUrl,
  description: seo.pageDesc,
  inLanguage: ['ar', 'en'],
  publisher: {
    '@id': `${seo.canonicalUrl}/#person`
  }
})
</script>
