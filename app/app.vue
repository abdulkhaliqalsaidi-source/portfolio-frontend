<template>
  <div id="__portfolio">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const theme = useCookie('theme', { default: () => 'dark' })

useHead({
  htmlAttrs: {
    'data-theme': () => theme.value,
    lang: 'ar',
    dir: 'rtl'
  }
})
</script>
