import { defineEventHandler, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || ''

  // Catch legacy routes: /project/<id_or_slug>
  const match = url.match(/^\/project\/([a-zA-Z0-9_\u0600-\u06FF-]+)\/?$/)
  if (match) {
    const identifier = match[1]
    const config = useRuntimeConfig()
    const apiUrl = config.apiServerUrl || 'http://127.0.0.1:8000/api'

    // If identifier is numeric ID, lookup the slug from Django API
    if (/^\d+$/.test(identifier)) {
      try {
        const data = await $fetch<{ project: { slug: string } }>(`${apiUrl}/public/project/${identifier}/`)
        if (data?.project?.slug) {
          return sendRedirect(event, `/projects/${encodeURIComponent(data.project.slug)}`, 301)
        }
      } catch (e) {
        return sendRedirect(event, '/projects', 301)
      }
    } else {
      // Identifier is already a slug, redirect directly
      return sendRedirect(event, `/projects/${encodeURIComponent(identifier)}`, 301)
    }
  }
})
