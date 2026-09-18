<template>
  <div id="__portfolio">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useLocale } from '~/composables/useLocale'

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
