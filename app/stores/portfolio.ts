import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {
  const isLoading = ref(false)
  const isInitialized = ref(false)
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
    const isDev = process.env.NODE_ENV !== 'production'
    if (isDev) {
      return url.replace(/^http:\/\/localhost:8000/i, 'http://127.0.0.1:8000')
    }
    if (typeof window !== 'undefined') {
      const host = window.location.hostname
      if (host === 'localhost' || host === '127.0.0.1') {
        return url.replace(/^http:\/\/localhost:8000/i, 'http://127.0.0.1:8000')
      }
    }
    return url.replace(/^http:\/\/localhost:8000/i, 'https://portfolio-backend-1kar.onrender.com')
              .replace(/^http:\/\/127\.0\.0\.1:8000/i, 'https://portfolio-backend-1kar.onrender.com')
  }

  function sanitizeLogo(logo: any): string {
    if (!logo || typeof logo !== 'string') return 'mdi-star-four-points'
    const trimmed = logo.trim()
    if (!trimmed) return 'mdi-star-four-points'
    if (trimmed.startsWith('mdi-')) return trimmed
    return sanitizeMediaUrl(trimmed)
  }

  function setPublicContent(data: any) {
    if (!data) return
    if (data.profile || data.developer) {
      const prof = data.profile || data.developer
      developer.value = {
        ...prof,
        name: prof.full_name || prof.name || '',
        avatar: sanitizeMediaUrl(prof.avatar),
        resume: sanitizeMediaUrl(prof.resume),
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

  async function fetchPublicContent() {
    isLoading.value = true
    error.value = null
    try {
      const baseURL = getApiBaseUrl()
      const data = await $fetch<any>(`${baseURL}/public/content/`, { timeout: 4000 })
      setPublicContent(data)
      return data
    } catch (err: any) {
      console.warn('[PortfolioStore] Primary API warning, attempting fallback:', err)
      try {
        const fallbackData = await $fetch<any>('http://127.0.0.1:8000/api/public/content/', { timeout: 3000 })
        setPublicContent(fallbackData)
        return fallbackData
      } catch (fallbackErr) {
        error.value = err.message
        isInitialized.value = true
      }
    } finally {
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
    error,
    setPublicContent,
    fetchPublicContent,
    getProjectByIdOrSlug,
    getBlogPostBySlug,
    recordPostView,
    likePost,
    submitContact,
  }
})
