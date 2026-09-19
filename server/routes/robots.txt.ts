import { defineEventHandler, setResponseHeader, getRequestHost, getRequestProtocol } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const host = getRequestHost(event)
  const protocol = getRequestProtocol(event)
  const fallbackUrl = 'https://portfolio-frontend-pink-mu.vercel.app'
  const siteUrl = (config.public.siteUrl && !config.public.siteUrl.includes('render.com') && !config.public.siteUrl.includes('example.com'))
    ? config.public.siteUrl
    : (host ? `${protocol}://${host}` : fallbackUrl)
  const apiUrl = config.apiServerUrl || config.public.apiBaseUrl || 'https://portfolio-backend-1kar.onrender.com/api'

  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600')

  let allowGpt = true
  let allowPerplexity = true
  let allowClaude = true
  let allowGemini = true

  try {
    const data = await $fetch<any>(`${apiUrl}/public/content/`)
    const settings = data.settings || {}
    if (settings.allow_gpt_bot !== undefined) allowGpt = settings.allow_gpt_bot !== 'false' && settings.allow_gpt_bot !== false
    if (settings.allow_perplexity_bot !== undefined) allowPerplexity = settings.allow_perplexity_bot !== 'false' && settings.allow_perplexity_bot !== false
    if (settings.allow_claude_bot !== undefined) allowClaude = settings.allow_claude_bot !== 'false' && settings.allow_claude_bot !== false
    if (settings.allow_gemini_bot !== undefined) allowGemini = settings.allow_gemini_bot !== 'false' && settings.allow_gemini_bot !== false
  } catch (err) {
    // Keep defaults
  }

  return `# AI Search Crawlers & LLM Agents
User-agent: GPTBot
${allowGpt ? 'Allow: /' : 'Disallow: /'}

User-agent: ChatGPT-User
${allowGpt ? 'Allow: /' : 'Disallow: /'}

User-agent: PerplexityBot
${allowPerplexity ? 'Allow: /' : 'Disallow: /'}

User-agent: ClaudeBot
${allowClaude ? 'Allow: /' : 'Disallow: /'}

User-agent: anthropic-ai
${allowClaude ? 'Allow: /' : 'Disallow: /'}

User-agent: Google-Extended
${allowGemini ? 'Allow: /' : 'Disallow: /'}

User-agent: CCBot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Search Engine Crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: *
Allow: /
Allow: /projects/
Allow: /blog/

Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/auth/

Sitemap: ${siteUrl}/sitemap.xml
`
})
