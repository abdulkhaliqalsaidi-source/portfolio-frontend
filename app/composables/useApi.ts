import type { UseFetchOptions } from 'nuxt/app'

/**
 * Universal API Client for Nuxt 4 SSR & Client
 * Resolves internal network URL in SSR and public URL in Browser.
 */
export function useApi<T>(endpoint: string, opts: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()

  const baseURL = import.meta.server
    ? (config.apiServerUrl || config.public.apiBaseUrl)
    : config.public.apiBaseUrl

  return useFetch<T>(endpoint, {
    baseURL,
    timeout: 20000,
    ...opts,
    onRequest({ options }) {
      if (import.meta.client && endpoint.includes('/admin/')) {
        const token = localStorage.getItem('access_token')
        if (token) {
          options.headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`
          }
        }
      }
    },
    onResponseError({ response }) {
      if (import.meta.client && response.status === 401 && endpoint.includes('/admin/')) {
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }
    }
  })
}

/**
 * Direct $fetch wrapper for imperative calls (e.g. mutations, forms, logins)
 */
export async function apiFetch<T>(endpoint: string, opts: any = {}): Promise<T> {
  const config = useRuntimeConfig()
  const baseURL = import.meta.server
    ? (config.apiServerUrl || config.public.apiBaseUrl)
    : config.public.apiBaseUrl

  const headers: Record<string, string> = { ...(opts.headers || {}) }

  if (import.meta.client && (endpoint.includes('/admin/') || opts.requiresAuth)) {
    const token = localStorage.getItem('access_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  try {
    return await $fetch<T>(endpoint, {
      baseURL,
      ...opts,
      headers
    })
  } catch (err: any) {
    if (import.meta.client && err?.response?.status === 401 && endpoint.includes('/admin/')) {
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    throw err
  }
}
