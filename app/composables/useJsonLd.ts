export function useJsonLd() {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://portfolio-frontend-pink-mu.vercel.app'

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

  function setPersonSchema(profile: any = {}, extraSkills: string[] = [], servicesList: any[] = []) {
    const fullName = profile.full_name || profile.name || 'الملف المهني الشخصي'
    const jobTitle = profile.title || profile.role || 'خبير وممارس مهني'
    const bioText = profile.bio || profile.tagline || `الموقع الرسمي والملف المهني لـ ${fullName} - ${jobTitle}.`
    const location = profile.location || 'صنعاء، اليمن'
    const locality = location.includes('،') ? location.split('،')[0].trim() : (location.includes(',') ? location.split(',')[0].trim() : location)
    const country = location.includes('اليمن') || location.toLowerCase().includes('yemen') ? 'اليمن' : 'اليمن'

    const schema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': ['Person', 'ProfilePage'],
      '@id': `${siteUrl}/#person`,
      name: fullName,
      alternateName: [fullName].filter(Boolean),
      jobTitle: jobTitle,
      description: bioText,
      url: siteUrl,
      image: profile.avatar ? (profile.avatar.startsWith('http') ? profile.avatar : `${siteUrl}${profile.avatar.startsWith('/') ? '' : '/'}${profile.avatar}`) : `${siteUrl}/avatar.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: locality,
        addressCountry: country
      },
      hasOccupation: {
        '@type': 'Occupation',
        name: jobTitle,
        occupationLocation: {
          '@type': 'City',
          name: location
        }
      },
      sameAs: [
        profile.github,
        profile.linkedin,
        profile.twitter,
        profile.website,
        profile.instagram
      ].filter(Boolean)
    }

    if (profile.email) {
      schema.email = `mailto:${profile.email}`
    }
    if (profile.phone || profile.whatsapp) {
      schema.telephone = profile.phone || profile.whatsapp
    }

    if (extraSkills.length > 0) {
      schema.knowsAbout = extraSkills
      schema.hasOccupation.skills = extraSkills.join(', ')
    }

    addSchema(schema)

    // Dynamic services definition based on user's actual profession and offerings
    const serviceNames = servicesList && servicesList.length > 0
      ? servicesList.map(s => typeof s === 'string' ? s : s.title)
      : ['استشارات تخصصية', 'خدمات مهنية احترافية', 'تنفيذ ومتابعة الأعمال']

    addSchema({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#service`,
      name: `خدمات ${fullName}`,
      url: siteUrl,
      image: schema.image,
      telephone: schema.telephone || undefined,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: locality,
        addressCountry: country
      },
      areaServed: [
        'محلياً',
        'إقليمياً',
        'دولياً وعن بُعد'
      ],
      serviceType: serviceNames
    })
  }

  function setArticleSchema(post: any, authorName?: string) {
    if (!post) return
    const postUrl = `${siteUrl}/blog/${post.slug}`
    const author = authorName || post.author_name || 'الكاتب'
    addSchema({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt || post.meta_description || post.title,
      image: post.cover_image || `${siteUrl}/avatar.jpg`,
      datePublished: post.published_at || new Date().toISOString(),
      dateModified: post.updated_at || post.published_at || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: author,
        url: siteUrl
      },
      publisher: {
        '@type': 'Person',
        name: author,
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

  function setProjectSchema(project: any, authorName?: string) {
    if (!project) return
    const author = authorName || 'صاحب العمل'
    addSchema({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.short_description || project.title,
      url: `${siteUrl}/projects/${project.slug}`,
      image: project.image || `${siteUrl}/avatar.jpg`,
      author: {
        '@type': 'Person',
        name: author
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
