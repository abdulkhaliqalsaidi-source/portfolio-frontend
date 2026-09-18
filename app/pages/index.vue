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
  title: settings?.site_title || (dev.name ? `${dev.name} | مهندس برمجيات متكامل` : 'عبد الخالق الصايدي | مهندس برمجيات متكامل'),
  description: settings?.site_description || dev.tagline || dev.bio || 'معرض أعمال عبد الخالق الصايدي - Senior Full Stack Software Engineer متخصص في بناء الأنظمة السحابية وتطبيقات الويب عالية الأداء والأمان.',
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
  name: dev.name || 'عبد الخالق الصايدي',
  url: seo.canonicalUrl,
  description: seo.pageDesc
})
</script>
