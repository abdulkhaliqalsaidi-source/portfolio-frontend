import api from './api'

export const adminService = {
  // Dashboard
  async getDashboardSummary() {
    return await api.get('/admin/dashboard-summary/')
  },

  // Profile
  async getProfile() {
    return await api.get('/admin/profile/')
  },
  async updateProfile(data) {
    return await api.post('/admin/profile/', data)
  },

  // Projects
  async getProjects(params = {}) {
    return await api.get('/admin/projects/', params)
  },
  async getProject(id) {
    return await api.get(`/admin/projects/${id}/`)
  },
  async createProject(data) {
    return await api.post('/admin/projects/', data)
  },
  async updateProject(id, data) {
    return await api.put(`/admin/projects/${id}/`, data)
  },
  async deleteProject(id) {
    return await api.delete(`/admin/projects/${id}/`)
  },

  // Skill Categories
  async getSkillCategories() {
    return await api.get('/admin/skill-categories/')
  },
  async createSkillCategory(data) {
    return await api.post('/admin/skill-categories/', data)
  },
  async updateSkillCategory(id, data) {
    return await api.put(`/admin/skill-categories/${id}/`, data)
  },
  async deleteSkillCategory(id) {
    return await api.delete(`/admin/skill-categories/${id}/`)
  },

  // Skills
  async getSkills() {
    return await api.get('/admin/skills/')
  },
  async createSkill(data) {
    return await api.post('/admin/skills/', data)
  },
  async updateSkill(id, data) {
    return await api.put(`/admin/skills/${id}/`, data)
  },
  async deleteSkill(id) {
    return await api.delete(`/admin/skills/${id}/`)
  },

  // Services
  async getServices() {
    return await api.get('/admin/services/')
  },
  async createService(data) {
    return await api.post('/admin/services/', data)
  },
  async updateService(id, data) {
    return await api.put(`/admin/services/${id}/`, data)
  },
  async deleteService(id) {
    return await api.delete(`/admin/services/${id}/`)
  },

  // Timeline / Experience
  async getTimeline() {
    return await api.get('/admin/timeline/')
  },
  async createExperience(data) {
    return await api.post('/admin/timeline/', data)
  },
  async updateExperience(id, data) {
    return await api.put(`/admin/timeline/${id}/`, data)
  },
  async deleteExperience(id) {
    return await api.delete(`/admin/timeline/${id}/`)
  },

  // Testimonials
  async getTestimonials() {
    return await api.get('/admin/testimonials/')
  },
  async createTestimonial(data) {
    return await api.post('/admin/testimonials/', data)
  },
  async updateTestimonial(id, data) {
    return await api.put(`/admin/testimonials/${id}/`, data)
  },
  async deleteTestimonial(id) {
    return await api.delete(`/admin/testimonials/${id}/`)
  },

  // Statistics
  async getStatistics() {
    return await api.get('/admin/statistics/')
  },
  async createStatistic(data) {
    return await api.post('/admin/statistics/', data)
  },
  async updateStatistic(id, data) {
    return await api.patch(`/admin/statistics/${id}/`, data)
  },
  async deleteStatistic(id) {
    return await api.delete(`/admin/statistics/${id}/`)
  },

  // Contact Messages
  async getMessages(params = {}) {
    return await api.get('/admin/messages/', params)
  },
  async toggleMessageRead(id) {
    return await api.post(`/admin/messages/${id}/toggle-read/`)
  },
  async archiveMessage(id) {
    return await api.post(`/admin/messages/${id}/archive/`)
  },
  async deleteMessage(id) {
    return await api.delete(`/admin/messages/${id}/`)
  },

  // Settings
  async getSettings() {
    return await api.get('/admin/settings/')
  },
  async updateSettings(bulkData) {
    return await api.post('/admin/settings/bulk-update/', bulkData)
  },
  async updateSettingsBulk(bulkData) {
    return await api.post('/admin/settings/bulk-update/', bulkData)
  },

  // Users
  async getUsers() {
    return await api.get('/admin/users/')
  },
  async createUser(data) {
    return await api.post('/admin/users/', data)
  },
  async updateUser(id, data) {
    return await api.put(`/admin/users/${id}/`, data)
  },
  async deleteUser(id) {
    return await api.delete(`/admin/users/${id}/`)
  },

  // Audit Logs
  async getAuditLogs(params = {}) {
    return await api.get('/admin/audit-logs/', params)
  },

  // Media
  async getMedia() {
    return await api.get('/admin/media/')
  },
  async getMediaFiles() {
    return await api.get('/admin/media/')
  },
  async uploadMedia(fileOrFormData, title = '') {
    if (fileOrFormData instanceof FormData) {
      return await api.post('/admin/media/', fileOrFormData)
    }
    const formData = new FormData()
    formData.append('file', fileOrFormData)
    if (title) formData.append('title', title)
    return await api.post('/admin/media/', formData)
  },
  async deleteMedia(id) {
    return await api.delete(`/admin/media/?id=${id}`)
  },

  // Blog Posts
  async getBlogPosts(params = {}) {
    return await api.get('/admin/posts/', { params })
  },
  async getBlogPost(id) {
    return await api.get(`/admin/posts/${id}/`)
  },
  async createBlogPost(data) {
    return await api.post('/admin/posts/', data)
  },
  async updateBlogPost(id, data) {
    return await api.put(`/admin/posts/${id}/`, data)
  },
  async deleteBlogPost(id) {
    return await api.delete(`/admin/posts/${id}/`)
  }
}

export default adminService
