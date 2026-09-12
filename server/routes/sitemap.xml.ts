import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://example.com'
  const apiUrl = config.apiServerUrl || 'http://127.0.0.1:8000/api'

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  let projects: any[] = []
  let posts: any[] = []

  try {
    const content = await $fetch<any>(`${apiUrl}/public/content/`)
    projects = Array.isArray(content.projects) ? content.projects : []
    posts = Array.isArray(content.posts) ? content.posts : []
  } catch (err) {
    console.warn('[Sitemap] Could not fetch data from Django API:', err)
  }

  const currentDate = new Date().toISOString().split('T')[0]

  const staticUrls = [
    { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0', lastmod: currentDate },
    { loc: `${siteUrl}/projects`, changefreq: 'weekly', priority: '0.9', lastmod: currentDate },
    { loc: `${siteUrl}/blog`, changefreq: 'daily', priority: '0.9', lastmod: currentDate },
  ]

  const projectUrls = projects
    .filter(p => p.is_published && p.slug)
    .map(p => ({
      loc: `${siteUrl}/projects/${encodeURIComponent(p.slug)}`,
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : currentDate
    }))

  const blogUrls = posts
    .filter(p => p.is_published && p.slug)
    .map(p => ({
      loc: `${siteUrl}/blog/${encodeURIComponent(p.slug)}`,
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : currentDate
    }))

  const allUrls = [...staticUrls, ...projectUrls, ...blogUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return xml
})
