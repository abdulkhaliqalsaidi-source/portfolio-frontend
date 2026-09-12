import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const isLoading = ref(false)
  const metrics = ref({
    total_projects: 0,
    total_services: 0,
    total_skills: 0,
    total_messages: 0,
    unread_messages: 0,
    total_testimonials: 0,
    total_posts: 0
  })
  const latestMessages = ref<any[]>([])
  const latestProjects = ref<any[]>([])
  const latestPosts = ref<any[]>([])
  const recentAuditLogs = ref<any[]>([])

  const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
    timeout: 3500,
  })

  function notify(text: string, color = 'success') {
    snackbar.value = {
      show: true,
      text,
      color,
      timeout: 3500,
    }
  }

  async function fetchDashboardSummary() {
    isLoading.value = true
    try {
      const config = useRuntimeConfig()
      const token = import.meta.client ? localStorage.getItem('access_token') : null
      const data: any = await $fetch(`${config.public.apiBaseUrl}/admin/dashboard-summary/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (data.metrics) metrics.value = data.metrics
      if (data.latest_messages) latestMessages.value = data.latest_messages
      if (data.latest_projects) latestProjects.value = data.latest_projects
      if (data.latest_posts) latestPosts.value = data.latest_posts
      if (data.recent_audit_logs) recentAuditLogs.value = data.recent_audit_logs
      return data
    } catch (err: any) {
      notify(err?.message || 'فشل تحميل بيانات لوحة التحكم', 'error')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    metrics,
    latestMessages,
    latestProjects,
    latestPosts,
    recentAuditLogs,
    snackbar,
    notify,
    fetchDashboardSummary,
  }
})
