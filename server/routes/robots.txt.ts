import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://example.com'

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')

  return `User-agent: *
Allow: /
Allow: /projects/
Allow: /blog/
Allow: /media/

Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/auth/

Sitemap: ${siteUrl}/sitemap.xml
`
})
