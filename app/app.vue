<template>
  <div id="__portfolio">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useLocale } from '~/composables/useLocale'
import { usePortfolioStore } from '~/stores/portfolio'

const portfolioStore = usePortfolioStore()

// Globally pre-fetch public content on SSR root level before layout/pages render
await useAsyncData('portfolio-public-content', async () => {
  await portfolioStore.fetchPublicContent()
  return true
})

const theme = useCookie('theme', { default: () => 'dark' })
const { locale, dir } = useLocale()

useHead({
  htmlAttrs: {
    'data-theme': () => theme.value,
    lang: () => locale.value,
    dir: () => dir.value
  }
})
</script>
