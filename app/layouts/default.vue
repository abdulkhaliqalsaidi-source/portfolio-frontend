<template>
  <v-app :theme="isDark ? 'dark' : 'light'" class="portfolio-app">
    <NavBar />
    <WhatsAppButton />
    <BackToTop />

    <v-main class="public-main">
      <slot />
    </v-main>

    <FooterSection />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePortfolioStore } from '~/stores/portfolio'
import { useTheme } from '~/composables/useTheme'
import NavBar from '~/components/public/NavBar.vue'
import FooterSection from '~/components/public/FooterSection.vue'
import WhatsAppButton from '~/components/public/WhatsAppButton.vue'
import BackToTop from '~/components/public/BackToTop.vue'

const { isDark, init: initTheme } = useTheme()
const portfolioStore = usePortfolioStore()

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.portfolio-app {
  background: var(--bg, #0B0F19);
  color: var(--t1, #F8FAFC);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.public-main {
  flex: 1;
  padding: 0 !important;
}
</style>
