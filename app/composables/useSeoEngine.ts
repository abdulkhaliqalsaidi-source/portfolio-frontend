export interface SeoOptions {
  title?: string
  description?: string
  image?: string
  slug?: string
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}

export function useSeoEngine(options: SeoOptions = {}) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://example.com'
  const defaultTitle = 'عبد الخالق الصايدي | مهندس برمجيات متكامل'
  const defaultDesc = 'معرض أعمال ومشاريع عبد الخالق الصايدي - Senior Full Stack Software Engineer متخصص في بناء الأنظمة السحابية وتطبيقات الويب عالية الأداء والأمان.'
  const defaultImage = `${siteUrl}/avatar.jpg`

  const pageTitle = options.title
    ? (options.title.includes('عبد الخالق الصايدي') ? options.title : `${options.title} | عبد الخالق الصايدي`)
    : defaultTitle
  const pageDesc = options.description?.trim() || defaultDesc
  const pageImage = options.image?.startsWith('http')
    ? options.image
    : (options.image ? `${siteUrl}${options.image.startsWith('/') ? '' : '/'}${options.image}` : defaultImage)

  const canonicalUrl = options.slug !== undefined
    ? `${siteUrl}/${options.slug.replace(/^\//, '')}`
    : siteUrl

  // Set Head Meta via Nuxt type-safe useSeoMeta
  useSeoMeta({
    title: pageTitle,
    ogTitle: options.title || pageTitle,
    description: pageDesc,
    ogDescription: pageDesc,
    ogImage: pageImage,
    ogUrl: canonicalUrl,
    ogType: options.type || 'website',
    ogSiteName: 'عبد الخالق الصايدي | Portfolio & Engineering Hub',
    ogLocale: 'ar_SA',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title || pageTitle,
    twitterDescription: pageDesc,
    twitterImage: pageImage,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    articlePublishedTime: options.publishedTime,
    articleModifiedTime: options.modifiedTime,
    articleAuthor: options.author ? [options.author] : ['عبد الخالق الصايدي'],
    articleTag: options.tags
  })

  // Canonical link tag
  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl
      }
    ]
  })

  return {
    pageTitle,
    pageDesc,
    pageImage,
    canonicalUrl
  }
}
