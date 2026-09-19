<template>
  <div class="home-view">
    <HeroSection />
    <StatsSection />
    <ServicesSection />
    <TechStack />
    <ProjectsSection />
    <TestimonialsSection />
    <TimelineSection />
    <ContactSection />
  </div>
</template>

<script setup>
import { usePortfolioStore } from '~/stores/portfolio'
import { useSeoEngine } from '~/composables/useSeoEngine'
import { useJsonLd } from '~/composables/useJsonLd'
import HeroSection from '~/components/public/HeroSection.vue'
import StatsSection from '~/components/public/StatsSection.vue'
import ServicesSection from '~/components/public/ServicesSection.vue'
import TechStack from '~/components/public/TechStack.vue'
import ProjectsSection from '~/components/public/ProjectsSection.vue'
import TestimonialsSection from '~/components/public/TestimonialsSection.vue'
import TimelineSection from '~/components/public/TimelineSection.vue'
import { onMounted } from 'vue'
import ContactSection from '~/components/public/ContactSection.vue'

const portfolioStore = usePortfolioStore()

// Server-side data pre-fetch for instant SSR HTML rendering
await useAsyncData('home-content', async () => {
  await portfolioStore.fetchPublicContent()
  return true
})

// Ensure client-side always receives newest live content
onMounted(() => {
  portfolioStore.fetchPublicContent()
})

const dev = portfolioStore.developer
const settings = portfolioStore.settings

const devName = dev?.name || dev?.full_name || 'الملف المهني الشخصي'
const devTitle = dev?.title || dev?.role || 'خبير وممارس مهني'

// Professional Dynamic SEO setup
const seo = useSeoEngine({
  title: settings?.site_title || `${devName} | ${devTitle}`,
  description: settings?.site_description || dev?.tagline || dev?.bio || `الموقع الرسمي والملف المهني لـ ${devName} - ${devTitle}.`,
  image: dev?.avatar || '/avatar.jpg',
  slug: '',
  type: 'website',
  devName: devName,
  devTitle: devTitle
})

// Structured JSON-LD Schema
const { setPersonSchema, addSchema } = useJsonLd()
setPersonSchema(dev, [], portfolioStore.services)
addSchema({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${seo.canonicalUrl}/#website`,
  name: devName,
  alternateName: `موقع ${devName} الشخصي | Portfolio`,
  url: seo.canonicalUrl,
  description: seo.pageDesc,
  inLanguage: ['ar', 'en'],
  publisher: {
    '@id': `${seo.canonicalUrl}/#person`
  }
})
</script>
