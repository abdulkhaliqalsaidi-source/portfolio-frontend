import api from './api'

export const authService = {
  /**
   * Log in user with credentials and store tokens
   */
  async login(username, password) {
    const data = await api.post('/auth/login/', { username, password })
    if (data.access) {
      localStorage.setItem('access_token', data.access)
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },

  /**
   * Fetch current authenticated user
   */
  async getMe() {
    return await api.get('/auth/me/')
  },

  /**
   * Change password
   */
  async changePassword(old_password, new_password) {
    return await api.post('/auth/change-password/', { old_password, new_password })
  },

  /**
   * Log out user and clean up local storage
   */
  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  /**
   * Check if user is currently logged in
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  /**
   * Get cached user object
   */
  getUser() {
    const userStr = localStorage.getItem('user')
    try {
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }
}

export default authService
