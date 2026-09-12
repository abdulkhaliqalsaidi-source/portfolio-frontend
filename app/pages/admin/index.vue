<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  middleware: [
    () => navigateTo('/admin/dashboard')
  ]
})
</script>
