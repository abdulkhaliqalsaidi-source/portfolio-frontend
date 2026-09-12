import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/admin/login',
      query: { redirect: to.fullPath }
    })
  }

  if (to.meta.requiresSuperuser && !authStore.isSuperUser) {
    return navigateTo('/admin/dashboard')
  }
})
