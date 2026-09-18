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

  function sanitizeMediaUrl(url: any): string {
    if (!url || typeof url !== 'string') return ''
    return url.replace(/^http:\/\/localhost:8000/i, 'https://portfolio-backend-1kar.onrender.com')
  }

  function setPublicContent(data: any) {
    if (!data) return
    if (data.profile || data.developer) {
      const prof = data.profile || data.developer
      developer.value = {
        ...prof,
        name: prof.full_name || prof.name || '',
        avatar: sanitizeMediaUrl(prof.avatar),
        resume: sanitizeMediaUrl(prof.resume)
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

  async function fetchPublicContent() {
    isLoading.value = true
    error.value = null
    try {
      const config = useRuntimeConfig()
      const baseURL = import.meta.server
        ? (config.apiServerUrl || config.public.apiBaseUrl)
        : config.public.apiBaseUrl

      const data = await $fetch<any>(`${baseURL}/public/content/`)
      setPublicContent(data)
      return data
    } catch (err: any) {
      console.warn('[PortfolioStore] Backend connection warning:', err)
      error.value = err.message
      isInitialized.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function getProjectByIdOrSlug(idOrSlug: string | number) {
    const existing = projects.value.find(p => p.id === idOrSlug || p.slug === idOrSlug || String(p.id) === String(idOrSlug))
    try {
      const config = useRuntimeConfig()
      const baseURL = import.meta.server
        ? (config.apiServerUrl || config.public.apiBaseUrl)
        : config.public.apiBaseUrl

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
      const config = useRuntimeConfig()
      const baseURL = import.meta.server
        ? (config.apiServerUrl || config.public.apiBaseUrl)
        : config.public.apiBaseUrl

      const data = await $fetch<any>(`${baseURL}/public/posts/by-slug/${encodeURIComponent(slug)}/`)
      return data
    } catch (err) {
      if (existing) return existing
      throw err
    }
  }

  async function recordPostView(id: number) {
    try {
      const config = useRuntimeConfig()
      return await $fetch(`${config.public.apiBaseUrl}/public/posts/${id}/increment_view/`, { method: 'POST' })
    } catch (e) {
      console.warn('Could not record view:', e)
    }
  }

  async function likePost(id: number) {
    try {
      const config = useRuntimeConfig()
      const res: any = await $fetch(`${config.public.apiBaseUrl}/public/posts/${id}/toggle_like/`, { method: 'POST' })
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
    const config = useRuntimeConfig()
    return await $fetch(`${config.public.apiBaseUrl}/public/contact/`, {
      method: 'POST',
      body: payload
    })
  }

  return {
    developer,
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
