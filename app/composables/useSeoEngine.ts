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
  devName?: string
  devTitle?: string
  keywords?: string
  geoPlacename?: string
  googleVerification?: string
}

export function useSeoEngine(options: SeoOptions = {}) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://portfolio-frontend-pink-mu.vercel.app'
  
  // Dynamic identity resolution
  const devName = options.devName || options.author || 'الملف المهني الشخصي'
  const devTitle = options.devTitle || 'خبير وممارس مهني'
  
  const defaultTitle = `${devName} | ${devTitle}`
  const defaultDesc = `الموقع التعريفي ومعرض الأعمال لـ ${devName} - ${devTitle}.`
  const defaultImage = `${siteUrl}/avatar.jpg`
  const defaultKeywords = options.keywords || `${devName}, ${devTitle}, أعمال, خدمات, استشارات, معرض أعمال, Portfolio`

  const pageTitle = options.title
    ? (options.title.includes(devName) ? options.title : `${options.title} | ${devName}`)
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
    ogSiteName: `${devName} | Portfolio`,
    ogLocale: 'ar_SA',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title || pageTitle,
    twitterDescription: pageDesc,
    twitterImage: pageImage,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    articlePublishedTime: options.publishedTime,
    articleModifiedTime: options.modifiedTime,
    articleAuthor: [options.author || devName],
    articleTag: options.tags
  })

  const authorName = options.author || devName
  const geoPlace = options.geoPlacename || 'صنعاء، اليمن'
  const metaList: any[] = [
    { name: 'keywords', content: options.keywords || (options.tags?.length ? options.tags.join(', ') + ', ' + defaultKeywords : defaultKeywords) },
    { name: 'author', content: authorName },
    { name: 'geo.region', content: 'YE-SN' },
    { name: 'geo.placename', content: geoPlace },
    { name: 'geo.position', content: '15.3694;44.1910' },
    { name: 'ICBM', content: '15.3694, 44.1910' },
    { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    { name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }
  ]

  if (options.googleVerification) {
    metaList.push({ name: 'google-site-verification', content: options.googleVerification })
  }

  // Canonical link tag & Geo / Search Engine meta
  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl
      },
      {
        rel: 'alternate',
        hreflang: 'ar',
        href: canonicalUrl
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: canonicalUrl
      }
    ],
    meta: metaList
  })

  return {
    pageTitle,
    pageDesc,
    pageImage,
    canonicalUrl
  }
}
