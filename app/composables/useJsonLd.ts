export function useJsonLd() {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://example.com'

  function addSchema(schemaObj: Record<string, any>) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schemaObj)
        }
      ]
    })
  }

  function setPersonSchema(profile: any = {}) {
    const fullName = profile.full_name || profile.name || 'عبد الخالق علي محمد الصايدي'
    const jobTitle = profile.title || 'مطور واجهات أمامية وبرمجيات | Frontend & Software Developer'
    const bioText = profile.bio || profile.tagline || 'مطور واجهات ومصمم برمجيات متخصص في بناء واجهات مستخدم تفاعلية وعالية الأداء باستخدام Vue.js و Vuetify والربط مع RESTful APIs وإدارة قواعد البيانات.'

    addSchema({
      '@context': 'https://schema.org',
      '@type': ['Person', 'ProfilePage'],
      '@id': `${siteUrl}/#person`,
      name: fullName,
      alternateName: [
        'عبد الخالق الصايدي',
        'عبد الخالق علي محمد الصايدي',
        'Abdulkhaliq Al-Saidi',
        'Abdulkhaliq Ali Mohammed Al-Saidi',
        'Abdulkhaliq Alsaidi'
      ],
      jobTitle: jobTitle,
      description: bioText,
      url: siteUrl,
      image: profile.avatar || `${siteUrl}/avatar.jpg`,
      email: profile.email ? `mailto:${profile.email}` : 'mailto:abdulkhaliq.al.saidi@gmail.com',
      telephone: profile.phone || '+967 771523243',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'صنعاء',
        addressRegion: 'صنعاء',
        addressCountry: 'اليمن'
      },
      worksFor: {
        '@type': 'Organization',
        name: 'شركة أوبن سوفت (OpenSoft)',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'صنعاء',
          addressCountry: 'اليمن'
        }
      },
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'جامعة آزال للتنمية البشرية (Azal University for Human Development)'
      },
      hasOccupation: {
        '@type': 'Occupation',
        name: 'مطور واجهات أمامية وبرمجيات (Frontend & Software Developer)',
        occupationLocation: {
          '@type': 'City',
          name: 'صنعاء، اليمن'
        },
        skills: 'Vue.js, Vuetify, JavaScript ES6+, HTML5, CSS3, Django REST Framework, Oracle Database, MySQL, MCSA, CCNA'
      },
      knowsAbout: [
        'تطوير الواجهات الأمامية (Frontend Development)',
        'Vue.js (Vue 3 / Vue 2)',
        'Vuetify Framework',
        'JavaScript (ES6+)',
        'TypeScript',
        'HTML5 & CSS3',
        'RESTful APIs Integration',
        'Django REST Framework',
        'Oracle Database',
        'MySQL',
        'MCSA (Server Administration)',
        'CCNA (Networking)',
        'الدعم الفني وصيانة الأنظمة البرمجية',
        'Flutter',
        'WordPress',
        'Git & GitHub'
      ],
      sameAs: [
        profile.github,
        profile.linkedin,
        profile.twitter,
        profile.website,
        'https://github.com/abdulkhaliqalsaidi-source'
      ].filter(Boolean)
    })

    // Add ProfessionalService schema for local & remote search discovery
    addSchema({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#service`,
      name: `خدمات ${fullName} لتطوير البرمجيات والواجهات`,
      url: siteUrl,
      image: profile.avatar || `${siteUrl}/avatar.jpg`,
      telephone: profile.phone || '+967 771523243',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'صنعاء',
        addressCountry: 'اليمن'
      },
      areaServed: [
        'اليمن',
        'المملكة العربية السعودية',
        'الخليج العربي',
        'عالمياً (عن بُعد / Remote)'
      ],
      serviceType: [
        'تطوير واجهات المستخدم التفاعلية (Frontend Web Development)',
        'الربط مع واجهات برمجة التطبيقات (RESTful APIs Integration)',
        'تطوير وإدارة قواعد البيانات (Oracle Database & MySQL)',
        'إدارة السيرفرات والشبكات والدعم الفني (Server Admin & IT Support)'
      ]
    })
  }

  function setArticleSchema(post: any) {
    if (!post) return
    const postUrl = `${siteUrl}/blog/${post.slug}`
    addSchema({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: post.title,
      description: post.excerpt || post.meta_description || post.title,
      image: post.cover_image || `${siteUrl}/avatar.jpg`,
      datePublished: post.published_at || new Date().toISOString(),
      dateModified: post.updated_at || post.published_at || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: 'عبد الخالق الصايدي',
        url: siteUrl
      },
      publisher: {
        '@type': 'Person',
        name: 'عبد الخالق الصايدي',
        url: siteUrl
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl
      }
    })
  }

  function setBreadcrumbsSchema(crumbs: Array<{ name: string; path: string }>) {
    addSchema({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.path.startsWith('http') ? crumb.path : `${siteUrl}${crumb.path.startsWith('/') ? '' : '/'}${crumb.path}`
      }))
    })
  }

  function setProjectSchema(project: any) {
    if (!project) return
    addSchema({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.title,
      description: project.short_description || project.title,
      applicationCategory: 'WebApplication',
      operatingSystem: 'All',
      url: `${siteUrl}/projects/${project.slug}`,
      image: project.image || `${siteUrl}/avatar.jpg`,
      author: {
        '@type': 'Person',
        name: 'عبد الخالق الصايدي'
      }
    })
  }

  return {
    addSchema,
    setPersonSchema,
    setArticleSchema,
    setBreadcrumbsSchema,
    setProjectSchema
  }
}
