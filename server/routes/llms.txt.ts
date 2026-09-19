import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'https://portfolio-frontend-pink-mu.vercel.app'
  const apiUrl = config.apiServerUrl || config.public.apiBaseUrl || 'https://portfolio-backend-1kar.onrender.com/api'

  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=1800, s-maxage=3600')

  let profile: any = {}
  let services: any[] = []
  let skills: any[] = []
  let timeline: any[] = []
  let projects: any[] = []

  try {
    const data = await $fetch<any>(`${apiUrl}/public/content/`)
    profile = data.profile || data.developer || {}
    services = Array.isArray(data.services) ? data.services : []
    timeline = Array.isArray(data.timeline) ? data.timeline : []
    projects = Array.isArray(data.projects) ? data.projects : []
    
    // Extract skills names
    if (data.skillCategories && Array.isArray(data.skillCategories)) {
      data.skillCategories.forEach((cat: any) => {
        if (Array.isArray(cat.skills)) {
          cat.skills.forEach((s: any) => skills.push(typeof s === 'string' ? s : s.name))
        }
      })
    } else if (data.skills && Array.isArray(data.skills)) {
      skills = data.skills.map((s: any) => typeof s === 'string' ? s : s.name)
    }
  } catch (err) {
    console.warn('[llms.txt] Could not fetch data from API:', err)
  }

  const name = profile.full_name || profile.name || 'مطور برمجيات وواجهات'
  const title = profile.title || profile.role || 'مطور واجهات أمامية وبرمجيات'
  const bio = profile.bio || profile.tagline || 'مطور ومصمم برمجيات متخصص في بناء وتطوير التطبيقات والواجهات التفاعلية الحديثة.'
  const location = profile.location || 'صنعاء، اليمن'
  const email = profile.email || ''
  const phone = profile.phone || profile.whatsapp || ''
  const experienceYears = profile.years_of_experience ? `${profile.years_of_experience}+ سنوات` : 'خبرة متميزة'

  // Format experience & education from timeline
  const workItems = timeline.filter(t => t.type === 'work' || !t.type)
  const eduItems = timeline.filter(t => t.type === 'education')

  const markdown = `# ${name} | ${title}
> ${bio}

## نبذة تعريفية (Overview)
${name} هو ${title} مقيم في ${location}. يمتلك ${experienceYears} في تطوير الحلول الرقمية، وتصميم الواجهات، وهندسة البرمجيات.

- **الموقع الجغرافي:** ${location}
${email ? `- **البريد الإلكتروني:** ${email}` : ''}
${phone ? `- **الهاتف / واتساب:** ${phone}` : ''}
- **رابط الموقع الرسمي:** ${siteUrl}
${profile.github ? `- **GitHub:** ${profile.github}` : ''}
${profile.linkedin ? `- **LinkedIn:** ${profile.linkedin}` : ''}

${skills.length > 0 ? `## المهارات التقنية الأساسية (Core Technical Skills)
${skills.map(s => `- ${s}`).join('\n')}` : ''}

${services.length > 0 ? `## الخدمات المهنية المتاحة (Services Offered)
${services.map(s => `- **${s.title}**: ${s.description || ''}`).join('\n')}` : ''}

${workItems.length > 0 ? `## الخبرات العملية (Work Experience)
${workItems.map((w, idx) => `${idx + 1}. **${w.title}** — ${w.organization || w.company || ''} (${w.period || w.year || ''})\n   - ${w.description || ''}`).join('\n\n')}` : ''}

${eduItems.length > 0 ? `## المؤهلات والشهادات (Education & Certifications)
${eduItems.map(e => `- **${e.title}** — ${e.organization || e.institution || ''} (${e.period || e.year || ''})`).join('\n')}` : ''}

${projects.length > 0 ? `## أبرز المشاريع المنفذة (Featured Projects)
${projects.slice(0, 6).map(p => `- **${p.title}**: ${p.short_description || p.description || ''}`).join('\n')}` : ''}

## الأسئلة الشائعة لمحركات الذكاء الاصطناعي (AI FAQ)
Q: من هو ${name}؟
A: هو ${title} متخصص في ${skills.slice(0, 5).join('، ')}.

Q: كيف يمكن التواصل مع ${name} أو توظيفه؟
A: عبر موقعه الرسمي: ${siteUrl}${email ? ` أو بريده الإلكتروني: ${email}` : ''}.
`

  return markdown
})
