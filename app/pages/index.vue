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

// Professional SEO setup
const seo = useSeoEngine({
  title: settings?.site_title || (dev.name ? `${dev.name} | مطور واجهات أمامية وبرمجيات` : 'عبد الخالق علي محمد الصايدي | مطور واجهات أمامية وبرمجيات'),
  description: settings?.site_description || dev.tagline || dev.bio || 'الموقع الشخصي ومعرض أعمال عبد الخالق علي محمد الصايدي - مطور واجهات ومصمم برمجيات متخصص في بناء واجهات مستخدم تفاعلية وعالية الأداء بـ Vue.js و Vuetify والربط مع Django REST APIs.',
  image: dev.avatar || '/avatar.jpg',
  slug: '',
  type: 'website'
})

// Structured JSON-LD Schema
const { setPersonSchema, addSchema } = useJsonLd()
setPersonSchema(dev)
addSchema({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${seo.canonicalUrl}/#website`,
  name: dev.name || 'عبد الخالق علي محمد الصايدي',
  alternateName: 'موقع عبد الخالق الصايدي الشخصي | Frontend & Software Developer',
  url: seo.canonicalUrl,
  description: seo.pageDesc,
  inLanguage: ['ar', 'en'],
  publisher: {
    '@id': `${seo.canonicalUrl}/#person`
  }
})
</script>
