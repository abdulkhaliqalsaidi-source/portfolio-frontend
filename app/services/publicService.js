import api from './api'

export const publicService = {
  /**
   * Fetch all public content in a single fast call
   */
  async getPublicContent() {
    return await api.get('/public/content/')
  },

  /**
   * Fetch project details with case study
   */
  async getProjectDetail(idOrSlug) {
    return await api.get(`/public/project/${idOrSlug}/`)
  },

  /**
   * Submit contact form
   */
  async sendContactMessage(payload) {
    return await api.post('/public/contact/', payload)
  },

  /**
   * Fetch all published blog posts
   */
  async getBlogPosts(params = {}) {
    return await api.get('/public/posts/', { params })
  },

  /**
   * Fetch single blog post by slug or ID
   */
  async getBlogPostBySlug(slug) {
    return await api.get(`/public/posts/by-slug/${encodeURIComponent(slug)}/`)
  },

  /**
   * Increment blog post view count
   */
  async incrementPostView(id) {
    return await api.post(`/public/posts/${id}/increment_view/`)
  },

  /**
   * Like blog post
   */
  async likeBlogPost(id) {
    return await api.post(`/public/posts/${id}/toggle_like/`)
  }
}

export default publicService
