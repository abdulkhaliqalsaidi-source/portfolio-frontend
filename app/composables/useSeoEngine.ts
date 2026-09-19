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
  const siteUrl = config.public.siteUrl || 'https://portfolio-frontend-pink-mu.vercel.app'
  const defaultTitle = 'عبد الخالق علي محمد الصايدي | مطور واجهات أمامية وبرمجيات'
  const defaultDesc = 'الموقع الشخصي ومعرض أعمال عبد الخالق علي محمد الصايدي - مطور واجهات ومصمم برمجيات متخصص في بناء واجهات مستخدم تفاعلية وعالية الأداء بـ Vue.js و Vuetify والربط مع Django REST APIs وإدارة قواعد البيانات Oracle و MySQL.'
  const defaultImage = `${siteUrl}/avatar.jpg`
  const defaultKeywords = 'عبد الخالق علي محمد الصايدي, عبد الخالق الصايدي, مطور واجهات أمامية, مطور برمجيات, مطور واجهات أمامية وبرمجيات, مطور Vue.js في اليمن, مبرمج واجهات صنعاء, مهندس واجهات, Frontend Developer Yemen, Abdulkhaliq Alsaidi, Vue.js Developer, Vuetify Specialist, Django REST Framework, Oracle Database, MySQL, MCSA, CCNA, تطوير واجهات المستخدم, تصميم مواقع ويب صنعاء'

  const pageTitle = options.title
    ? (options.title.includes('عبد الخالق') ? options.title : `${options.title} | عبد الخالق علي محمد الصايدي`)
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
    ogSiteName: 'عبد الخالق علي محمد الصايدي | Frontend & Software Developer',
    ogLocale: 'ar_SA',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title || pageTitle,
    twitterDescription: pageDesc,
    twitterImage: pageImage,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    articlePublishedTime: options.publishedTime,
    articleModifiedTime: options.modifiedTime,
    articleAuthor: options.author ? [options.author] : ['عبد الخالق علي محمد الصايدي'],
    articleTag: options.tags
  })

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
    meta: [
      { name: 'keywords', content: options.tags?.length ? options.tags.join(', ') + ', ' + defaultKeywords : defaultKeywords },
      { name: 'author', content: 'عبد الخالق علي محمد الصايدي' },
      { name: 'geo.region', content: 'YE-SN' },
      { name: 'geo.placename', content: 'صنعاء، اليمن' },
      { name: 'geo.position', content: '15.3694;44.1910' },
      { name: 'ICBM', content: '15.3694, 44.1910' },
      { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }
    ]
  })

  return {
    pageTitle,
    pageDesc,
    pageImage,
    canonicalUrl
  }
}
