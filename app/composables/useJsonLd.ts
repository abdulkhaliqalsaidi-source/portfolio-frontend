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
    addSchema({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.full_name || profile.name || 'عبد الخالق الصايدي',
      jobTitle: profile.title || 'Senior Full-Stack Engineer',
      description: profile.bio || profile.tagline || '',
      url: siteUrl,
      image: profile.avatar || `${siteUrl}/avatar.jpg`,
      email: profile.email ? `mailto:${profile.email}` : undefined,
      sameAs: [
        profile.github,
        profile.linkedin,
        profile.twitter,
        profile.website
      ].filter(Boolean)
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
