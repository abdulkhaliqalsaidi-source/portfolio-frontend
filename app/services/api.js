/**
 * Core API Client with automatic JWT handling, token refresh, timeout resilience, and error formatting.
 */

const DEFAULT_TIMEOUT_MS = 25000

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api'
    }
  }
  if (typeof useRuntimeConfig === 'function') {
    try {
      const config = useRuntimeConfig()
      if (typeof window === 'undefined' && config.apiServerUrl) return config.apiServerUrl
      if (config.public?.apiBaseUrl) return config.public.apiBaseUrl
    } catch (e) {}
  }
  return 'http://127.0.0.1:8000/api'
}

class ApiClient {
  constructor() {
    this._baseUrl = null
    this.isRefreshing = false
    this.failedQueue = []
  }

  get baseUrl() {
    return this._baseUrl || getBaseUrl()
  }

  set baseUrl(val) {
    this._baseUrl = val
  }

  getAuthHeader() {
    if (typeof window === 'undefined') return {}
    try {
      const token = localStorage.getItem('access_token')
      return token ? { Authorization: `Bearer ${token}` } : {}
    } catch (e) {
      return {}
    }
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    this.failedQueue = []
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) throw new Error('No refresh token')

    const response = await fetch(`${this.baseUrl}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    })

    if (!response.ok) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      throw new Error('Refresh token expired')
    }

    const data = await response.json()
    localStorage.setItem('access_token', data.access)
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh)
    return data.access
  }

  async handleResponse(response) {
    if (response.status === 204) return null

    let responseData = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json()
      } catch {
        responseData = null
      }
    } else {
      try {
        responseData = await response.text()
      } catch {
        responseData = null
      }
    }

    if (!response.ok) {
      const errorMessage = this.extractErrorMessage(responseData) || response.statusText || 'حدث خطأ في الاتصال بالخادم.'
      const error = new Error(errorMessage)
      error.status = response.status
      error.data = responseData
      throw error
    }

    return responseData
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    
    const headers = {
      ...this.getAuthHeader(),
      ...options.headers,
    }

    // If body is not FormData, set JSON header
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
      if (typeof options.body === 'object') {
        options.body = JSON.stringify(options.body)
      }
    }

    // Request Timeout
    const timeout = options.timeout || DEFAULT_TIMEOUT_MS
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      let response = await fetch(url, {
        ...options,
        headers,
        signal: options.signal || controller.signal
      })
      clearTimeout(timeoutId)

      // Handle 401 Unauthorized (Token expired)
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        if (!this.isRefreshing) {
          this.isRefreshing = true
          try {
            const newToken = await this.refreshToken()
            this.isRefreshing = false
            this.processQueue(null, newToken)
            headers.Authorization = `Bearer ${newToken}`
            const retried = await fetch(url, { ...options, headers })
            return await this.handleResponse(retried)
          } catch (refreshErr) {
            this.isRefreshing = false
            this.processQueue(refreshErr, null)
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:expired'))
            }
            throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.')
          }
        }

        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          this.failedQueue.push({
            resolve: async (token) => {
              try {
                headers.Authorization = `Bearer ${token}`
                const res = await fetch(url, { ...options, headers })
                resolve(await this.handleResponse(res))
              } catch (e) {
                reject(e)
              }
            },
            reject
          })
        })
      }

      return await this.handleResponse(response)
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('استغرق الخادم وقتاً أطول من المعتاد للاستجابة. يرجى التحقق من اتصال الإنترنت.')
        timeoutErr.status = 408
        throw timeoutErr
      }
      console.error(`[API Error] ${endpoint}:`, err)
      throw err
    }
  }

  extractErrorMessage(data) {
    if (!data) return 'حدث خطأ غير متوقع.'
    if (typeof data === 'string') return data
    if (data.detail) return data.detail
    if (data.error) return data.error
    if (data.message) return data.message
    if (Array.isArray(data)) return data.join(' ')
    if (typeof data === 'object') {
      const messages = []
      for (const [key, val] of Object.entries(data)) {
        const fieldName = key === 'non_field_errors' ? '' : `${key}: `
        const valMsg = Array.isArray(val) ? val.join(', ') : (typeof val === 'object' ? JSON.stringify(val) : val)
        messages.push(`${fieldName}${valMsg}`)
      }
      return messages.join(' | ') || 'حدث خطأ غير متوقع.'
    }
    return String(data)
  }

  // Convenience methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body })
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body })
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient()
export default api
