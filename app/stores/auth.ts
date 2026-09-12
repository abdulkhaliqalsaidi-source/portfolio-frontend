import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const accessToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize from client storage
  if (import.meta.client) {
    accessToken.value = localStorage.getItem('access_token')
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) user.value = JSON.parse(storedUser)
    } catch (e) {}
  }

  const isAuthenticated = computed(() => !!accessToken.value)
  const isSuperUser = computed(() => !!user.value?.is_superuser)
  const isStaff = computed(() => !!user.value?.is_staff || !!user.value?.is_superuser)
  const displayName = computed(() => {
    if (!user.value) return 'المدير'
    if (user.value.first_name || user.value.last_name) {
      return `${user.value.first_name} ${user.value.last_name}`.trim()
    }
    return user.value.username
  })

  async function login(username: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const config = useRuntimeConfig()
      const data: any = await $fetch(`${config.public.apiBaseUrl}/auth/login/`, {
        method: 'POST',
        body: { username, password }
      })
      accessToken.value = data.access
      user.value = data.user
      if (import.meta.client) {
        localStorage.setItem('access_token', data.access)
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh)
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      }
      return data
    } catch (err: any) {
      const msg = err?.data?.detail || err?.data?.error || 'فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.'
      error.value = msg
      throw new Error(msg)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return null
    try {
      const config = useRuntimeConfig()
      const data: any = await $fetch(`${config.public.apiBaseUrl}/auth/me/`, {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      })
      user.value = data
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(data))
      }
      return data
    } catch (err: any) {
      if (err?.response?.status === 401) {
        logout()
      }
      throw err
    }
  }

  async function changePassword(oldPassword: string, newPassword: string) {
    isLoading.value = true
    try {
      const config = useRuntimeConfig()
      return await $fetch(`${config.public.apiBaseUrl}/auth/change-password/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: { old_password: oldPassword, new_password: newPassword }
      })
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    accessToken.value = null
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  // Session expired event handler
  if (import.meta.client) {
    window.addEventListener('auth:expired', () => {
      logout()
    })
  }

  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    isSuperUser,
    isStaff,
    displayName,
    login,
    fetchMe,
    changePassword,
    logout,
  }
})
