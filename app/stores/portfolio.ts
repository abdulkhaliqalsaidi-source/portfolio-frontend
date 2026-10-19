import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const isWakingUp = ref(false)
  const retryAttempt = ref(0)
  const error = ref<string | null>(null)

  const developer = ref<any>({
    name: '',
    full_name: '',
    title: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    whatsapp: '',
    github: '',
    linkedin: '',
    behance: '',
    dribbble: '',
    instagram: '',
    youtube: '',
    website: '',
    twitter: '',
    location: '',
    avatar: '',
    resume: '',
    logo: 'mdi-star-four-points',
    available_for_work: true,
    years_of_experience: 0,
  })

  const stats = ref<any[]>([])
  const services = ref<any[]>([])
  const techStack = ref<Record<string, any[]>>({})
  const skillCategories = ref<any[]>([])
  const projects = ref<any[]>([])
  const testimonials = ref<any[]>([])
  const timeline = ref<any[]>([])
  const blogPosts = ref<any[]>([])
  const settings = ref<Record<string, any>>({})

  const hasContent = computed(() => {
    return !!(
      developer.value?.name ||
      developer.value?.full_name ||
      developer.value?.title ||
      projects.value?.length > 0 ||
      services.value?.length > 0
    )
  })

  const featuredProject = computed(() => {
    return projects.value.find(p => p.is_featured) || projects.value[0] || null
  })

  const featuredBlogPost = computed(() => {
    return blogPosts.value.find(p => p.is_featured) || blogPosts.value[0] || null
  })

  const recentBlogPosts = computed(() => {
    return blogPosts.value.slice(0, 3)
  })

  const resumeUrl = computed(() => {
    const r = (developer.value.resume || '').trim()
    if (!r) return ''
    return sanitizeMediaUrl(r)
  })

  function sanitizeMediaUrl(url: any): string {
    if (!url || typeof url !== 'string') return ''
    const trimmed = url.trim()
    if (trimmed.startsWith('data:')) {
      return trimmed
    }
    const isDev = process.env.NODE_ENV !== 'production'
    if (isDev) {
      return trimmed.replace(/^http:\/\/localhost:8000/i, 'http://127.0.0.1:8000')
    }
    if (typeof window !== 'undefined') {
      const host = window.location.hostname
      if (host === 'localhost' || host === '127.0.0.1') {
        return trimmed.replace(/^http:\/\/localhost:8000/i, 'http://127.0.0.1:8000')
      }
    }
    return trimmed.replace(/^http:\/\/localhost:8000/i, 'https://portfolio-backend-1kar.onrender.com')
                  .replace(/^http:\/\/127\.0\.0\.1:8000/i, 'https://portfolio-backend-1kar.onrender.com')
  }

  function sanitizeLogo(logo: any): string {
    if (!logo || typeof logo !== 'string') return 'mdi-star-four-points'
    const trimmed = logo.trim()
    if (!trimmed) return 'mdi-star-four-points'
    if (trimmed.startsWith('mdi-')) return trimmed
    if (trimmed.startsWith('data:')) return trimmed
    return sanitizeMediaUrl(trimmed)
  }

  function downloadResume(customFileName?: string) {
    const url = resumeUrl.value
    if (!url) return
    const fallbackName = `${developer.value.name || developer.value.full_name || 'Resume'}_CV.pdf`
    const fileName = customFileName || fallbackName

    if (url.startsWith('data:')) {
      try {
        const parts = url.split(',')
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf'
        const binaryStr = atob(parts[1])
        const len = binaryStr.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: mime })
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000)
        return
      } catch (err) {
        console.error('Error downloading base64 resume:', err)
      }
    }

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  function setPublicContent(data: any) {
    if (!data) return
    if (data.profile || data.developer) {
      const prof = data.profile || data.developer
      let cleanAvatar = prof.avatar || ''
      if (cleanAvatar && (cleanAvatar.includes('11.png') || cleanAvatar.includes('127.0.0.1:8000'))) {
        cleanAvatar = ''
      }
      let cleanResume = prof.resume || ''
      if (cleanResume && cleanResume.includes('Abdulkhaliq_Alsaidi_CV.pdf')) {
        cleanResume = ''
      }
      developer.value = {
        ...prof,
        name: prof.full_name || prof.name || '',
        avatar: sanitizeMediaUrl(cleanAvatar),
        resume: sanitizeMediaUrl(cleanResume),
        logo: sanitizeLogo(prof.logo)
      }
    }
    stats.value = Array.isArray(data.stats) ? data.stats : []
    services.value = Array.isArray(data.services) ? data.services : []
    techStack.value = data.tech_stack || data.techStack || {}
    skillCategories.value = Array.isArray(data.skill_categories) ? data.skill_categories : (Array.isArray(data.skillCategories) ? data.skillCategories : [])
    projects.value = (Array.isArray(data.projects) ? data.projects : []).map((p: any) => ({
      ...p,
      image: sanitizeMediaUrl(p.image),
      before_image: sanitizeMediaUrl(p.before_image),
      after_image: sanitizeMediaUrl(p.after_image),
      gallery: Array.isArray(p.gallery)
        ? p.gallery.map((g: any) => typeof g === 'string' ? sanitizeMediaUrl(g) : { ...g, image: sanitizeMediaUrl(g.image) })
        : p.gallery
    }))
    testimonials.value = Array.isArray(data.testimonials) ? data.testimonials : []
    timeline.value = Array.isArray(data.timeline) ? data.timeline : []
    blogPosts.value = (Array.isArray(data.posts) ? data.posts : []).map((b: any) => ({
      ...b,
      cover_image: sanitizeMediaUrl(b.cover_image)
    }))
    settings.value = data.settings || {}
    isInitialized.value = true
  }

  function getApiBaseUrl(): string {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname
      if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://127.0.0.1:8000/api'
      }
    }
    const config = useRuntimeConfig()
    if (import.meta.server && config.apiServerUrl) {
      return config.apiServerUrl
    }
    return config.public?.apiBaseUrl || 'http://127.0.0.1:8000/api'
  }

  async function fetchPublicContent(force = false) {
    if (isInitialized.value && !force && hasContent.value) {
      return
    }

    isLoading.value = true
    error.value = null

    const isClient = import.meta.client
    const maxRetries = isClient ? 3 : 1
    // 25s timeout on client to wait for Render cold starts; 4.5s on SSR so Vercel doesn't exceed serverless function limits
    const timeoutMs = isClient ? 25000 : 4500
    const baseURL = getApiBaseUrl()

    // Show waking indicator if request takes > 1.8s on client and content is missing
    let wakingTimer: any = null
    if (isClient && !hasContent.value) {
      wakingTimer = setTimeout(() => {
        if (isLoading.value && !hasContent.value) {
          isWakingUp.value = true
        }
      }, 1800)
    }

    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        retryAttempt.value = attempt
        try {
          const data = await $fetch<any>(`${baseURL}/public/content/`, {
            timeout: timeoutMs,
            headers: { 'Cache-Control': 'no-cache' }
          })
          if (data && (data.profile || data.developer || data.projects)) {
            setPublicContent(data)
            isWakingUp.value = false
            if (wakingTimer) clearTimeout(wakingTimer)
            return data
          }
        } catch (err: any) {
          console.warn(`[PortfolioStore] Attempt ${attempt}/${maxRetries} failed:`, err?.message || err)
          if (isClient && !hasContent.value) {
            isWakingUp.value = true
          }

          if (attempt < maxRetries) {
            // Wait 2.5 seconds before retrying to let the backend finish waking up
            await new Promise(resolve => setTimeout(resolve, 2500))
          } else {
            // Final fallback to local development port if running locally
            if (baseURL !== 'http://127.0.0.1:8000/api') {
              try {
                const fallbackData = await $fetch<any>('http://127.0.0.1:8000/api/public/content/', { timeout: 2000 })
                if (fallbackData) {
                  setPublicContent(fallbackData)
                  isWakingUp.value = false
                  if (wakingTimer) clearTimeout(wakingTimer)
                  return fallbackData
                }
              } catch (fallbackErr) {}
            }
            error.value = err?.message || 'Could not fetch public content'
          }
        }
      }
    } finally {
      if (wakingTimer) clearTimeout(wakingTimer)
      isWakingUp.value = false
      isLoading.value = false
    }
  }

  async function getProjectByIdOrSlug(idOrSlug: string | number) {
    const existing = projects.value.find(p => p.id === idOrSlug || p.slug === idOrSlug || String(p.id) === String(idOrSlug))
    try {
      const baseURL = getApiBaseUrl()
      const data = await $fetch<any>(`${baseURL}/public/project/${idOrSlug}/`)
      return data
    } catch (err) {
      if (existing) return { project: existing, other_projects: projects.value.filter(p => p.id !== existing.id) }
      throw err
    }
  }

  async function getBlogPostBySlug(slug: string) {
    const existing = blogPosts.value.find(p => p.slug === slug || String(p.id) === String(slug))
    try {
      const baseURL = getApiBaseUrl()
      const data = await $fetch<any>(`${baseURL}/public/posts/by-slug/${encodeURIComponent(slug)}/`)
      return data
    } catch (err) {
      if (existing) return existing
      throw err
    }
  }

  async function recordPostView(id: number) {
    try {
      const baseURL = getApiBaseUrl()
      return await $fetch(`${baseURL}/public/posts/${id}/increment_view/`, { method: 'POST' })
    } catch (e) {
      console.warn('Could not record view:', e)
    }
  }

  async function likePost(id: number) {
    try {
      const baseURL = getApiBaseUrl()
      const res: any = await $fetch(`${baseURL}/public/posts/${id}/toggle_like/`, { method: 'POST' })
      const target = blogPosts.value.find(p => p.id === id)
      if (target && res?.likes_count !== undefined) {
        target.likes_count = res.likes_count
      }
      return res
    } catch (e) {
      console.warn('Could not like post:', e)
    }
  }

  async function submitContact(payload: any) {
    const baseURL = getApiBaseUrl()
    return await $fetch(`${baseURL}/public/contact/`, {
      method: 'POST',
      body: payload
    })
  }

  return {
    developer,
    resumeUrl,
    stats,
    services,
    techStack,
    skillCategories,
    projects,
    featuredProject,
    testimonials,
    timeline,
    blogPosts,
    featuredBlogPost,
    recentBlogPosts,
    settings,
    isLoading,
    isInitialized,
    isWakingUp,
    retryAttempt,
    hasContent,
    error,
    setPublicContent,
    fetchPublicContent,
    getProjectByIdOrSlug,
    getBlogPostBySlug,
    recordPostView,
    likePost,
    submitContact,
    downloadResume,
  }
})
