/**
 * Gemini AI Service for Blog Content Generation & Formatting
 * Uses Google Gemini Generative Language API
 */

const DEFAULT_MODEL = 'gemini-2.0-flash'
const FALLBACK_MODELS = [
  'gemini-2.0-flash',
  'gemini-3.6-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-latest'
]

export const geminiService = {
  /**
   * Helper to sanitize model name and strip 'models/' prefix
   */
  cleanModelName(model) {
    if (!model) return DEFAULT_MODEL
    let cleaned = String(model).replace(/^models\//, '').trim()
    // If deprecated model known to throw 404, map to default
    if (cleaned === 'gemini-1.5-pro' || cleaned === 'gemini-pro' || cleaned === 'gemini-2.5-flash') {
      return DEFAULT_MODEL
    }
    return cleaned || DEFAULT_MODEL
  },

  /**
   * Get the saved API Key from localStorage
   */
  getApiKey() {
    if (process.client) {
      return localStorage.getItem('portfolio_gemini_api_key') || ''
    }
    return ''
  },

  /**
   * Save API Key to localStorage
   */
  setApiKey(key) {
    if (process.client) {
      if (key && key.trim()) {
        localStorage.setItem('portfolio_gemini_api_key', key.trim())
      } else {
        localStorage.removeItem('portfolio_gemini_api_key')
      }
    }
  },

  /**
   * Get preferred model, automatically migrating deprecated models
   */
  getModel() {
    if (process.client) {
      const saved = localStorage.getItem('portfolio_gemini_model')
      if (saved) {
        const cleaned = this.cleanModelName(saved)
        if (cleaned !== saved) {
          localStorage.setItem('portfolio_gemini_model', cleaned)
        }
        return cleaned
      }
      return DEFAULT_MODEL
    }
    return DEFAULT_MODEL
  },

  /**
   * Set preferred model
   */
  setModel(model) {
    if (process.client && model) {
      const cleaned = this.cleanModelName(model)
      localStorage.setItem('portfolio_gemini_model', cleaned)
    }
  },

  /**
   * Get cached models list from localStorage
   */
  getCachedModels() {
    if (process.client) {
      try {
        const cached = localStorage.getItem('portfolio_gemini_cached_models')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
          }
        }
      } catch (e) {}
    }
    return []
  },

  /**
   * Dynamically query Google API for all models available to this key that support generateContent
   */
  async listAvailableModels(apiKey = '') {
    const key = (apiKey || this.getApiKey()).trim()
    if (!key) return []

    // Try both v1beta and v1
    for (const version of ['v1beta', 'v1']) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/${version}/models?key=${key}`)
        if (!res.ok) continue
        const data = await res.json()
        if (Array.isArray(data.models)) {
          const validModels = data.models
            .filter(m => {
              const methods = m.supportedGenerationMethods || []
              return methods.includes('generateContent')
            })
            .map(m => {
              const id = m.name.replace(/^models\//, '')
              return {
                id,
                name: m.name,
                displayName: m.displayName || id,
                description: m.description || '',
                version
              }
            })

          if (validModels.length > 0) {
            // Sort: prioritize flash 3.6 / 2.0 / 1.5 at top
            validModels.sort((a, b) => {
              const score = id => {
                if (id.includes('3.6-flash')) return 1
                if (id.includes('3.')) return 2
                if (id.includes('2.0-flash')) return 3
                if (id.includes('2.0')) return 4
                if (id.includes('1.5-flash')) return 5
                return 6
              }
              return score(a.id) - score(b.id)
            })

            if (process.client) {
              localStorage.setItem('portfolio_gemini_cached_models', JSON.stringify(validModels))
            }
            return validModels
          }
        }
      } catch (err) {
        // Continue to next version
      }
    }

    return []
  },

  /**
   * Core request to Gemini REST API with automatic fallback and multi-model failover
   */
  async generate(options, legacyOptions = {}) {
    let prompt = ''
    let systemInstruction = ''
    let apiKey = ''
    let model = ''
    let temperature = 0.7

    if (typeof options === 'string') {
      prompt = options
      if (legacyOptions && typeof legacyOptions === 'object') {
        systemInstruction = legacyOptions.systemInstruction || ''
        apiKey = legacyOptions.apiKey || ''
        model = legacyOptions.model || ''
        temperature = typeof legacyOptions.temperature === 'number' ? legacyOptions.temperature : 0.7
      }
    } else if (options && typeof options === 'object') {
      prompt = options.prompt || ''
      systemInstruction = options.systemInstruction || ''
      apiKey = options.apiKey || ''
      model = options.model || ''
      temperature = typeof options.temperature === 'number' ? options.temperature : 0.7
    }

    prompt = String(prompt || '').trim()
    if (!prompt) {
      throw new Error('يرجى كتابة أو تحديد موضوع المقال أولاً قبل بدء التوليد.')
    }

    const key = (apiKey || this.getApiKey()).trim()
    if (!key) {
      throw new Error('يرجى إدخال مفتاح Google Gemini API أولاً للاستفادة من المساعد الذكي.')
    }

    // Try to get cached models or fetch live list if empty
    let availableList = this.getCachedModels().map(m => m.id)
    if (!availableList.length) {
      try {
        const live = await this.listAvailableModels(key)
        if (live && live.length > 0) {
          availableList = live.map(m => m.id)
        }
      } catch (e) {}
    }

    let requestedModel = this.cleanModelName(model || this.getModel() || DEFAULT_MODEL)
    if (availableList.length > 0 && !availableList.includes(requestedModel)) {
      requestedModel = availableList[0]
    }

    // Build prioritized candidate list
    const candidateList = [
      requestedModel,
      ...availableList,
      ...FALLBACK_MODELS
    ]
    const modelsToTry = Array.from(new Set(candidateList))

    let lastError = null

    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i]
      // Try both v1beta and v1 if needed
      for (const apiVersion of ['v1beta', 'v1']) {
        try {
          const result = await this._executeRequest({
            apiKey: key,
            model: currentModel,
            apiVersion,
            prompt,
            systemInstruction,
            temperature
          })
          // On success, save working model
          this.setModel(currentModel)
          return result
        } catch (err) {
          lastError = err

          // 1. Permanent fatal errors: Invalid API Key or Permission Denied (403)
          const isInvalidKey = err.status === 400 && (err.detail || err.message || '').includes('API key not valid')
          const isForbidden = err.status === 403

          if (isInvalidKey || isForbidden) {
            throw err
          }

          // 2. Model-specific retryable errors:
          // - 503: Service Unavailable / High demand on this specific model
          // - 429: Too Many Requests / Rate limit on this model
          // - 404: Model not found or retired
          // - 500/502/504: Temporary server / gateway issues
          const isRetryableModelError =
            err.status === 503 ||
            err.status === 429 ||
            err.status === 404 ||
            err.status === 500 ||
            err.status === 502 ||
            err.status === 504 ||
            (err.message && (
              err.message.includes('503') ||
              err.message.includes('429') ||
              err.message.includes('404') ||
              err.message.includes('high demand') ||
              err.message.includes('demand') ||
              err.message.includes('overloaded') ||
              err.message.includes('unavailable') ||
              err.message.includes('not found') ||
              err.message.includes('no longer available') ||
              err.message.includes('not supported') ||
              err.message.includes('غير متوفر')
            ))

          if (isRetryableModelError) {
            // Check if Google returned a suggestion for a newer model (e.g. models/gemini-3.6-flash)
            const textToScan = `${err.detail || ''} ${err.message || ''}`
            const suggestedMatch = textToScan.match(/models\/([a-zA-Z0-9._-]+)/)
            if (suggestedMatch && suggestedMatch[1]) {
              const suggested = this.cleanModelName(suggestedMatch[1])
              if (!modelsToTry.includes(suggested)) {
                // Insert right after current model so it is tried next!
                modelsToTry.splice(i + 1, 0, suggested)
              }
            }
            // Small pause before trying next model
            await new Promise(r => setTimeout(r, 300))
            continue
          }

          throw err
        }
      }
    }

    throw lastError || new Error('تعذر توليد المحتوى. يرجى التحقق من صلاحية مفتاح Gemini API.')
  },

  /**
   * Internal HTTP call to Google Gemini endpoint
   */
  async _executeRequest({ apiKey, model, apiVersion = 'v1beta', prompt, systemInstruction, temperature }) {
    const cleanModel = this.cleanModelName(model)
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${cleanModel}:generateContent?key=${apiKey}`

    const trimmedPrompt = String(prompt || '').trim()
    if (!trimmedPrompt) {
      throw new Error('النص المطلوب إرساله إلى الذكاء الاصطناعي فارغ.')
    }

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: trimmedPrompt }]
        }
      ],
      generationConfig: {
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192
      }
    }

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      }
    }

    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
    } catch (networkErr) {
      throw new Error('فشل الاتصال بالإنترنت أو تعذر الوصول إلى خوادم Google Gemini.')
    }

    if (!response.ok) {
      let errorMsg = `خطأ ${response.status}: `
      let detail = ''
      try {
        const errorData = await response.json()
        detail = errorData.error?.message || ''
        if (response.status === 400 && detail.includes('API key not valid')) {
          errorMsg = 'مفتاح Google Gemini API غير صالح. يرجى التحقق من صحة المفتاح المُدخل.'
        } else if (response.status === 429) {
          errorMsg = `تم تجاوز حد الطلبات للنموذج (${cleanModel}). سيتم تجربة نموذج بديل تلقائياً.`
        } else if (response.status === 503) {
          errorMsg = `النموذج (${cleanModel}) يواجه ضغطاً كبيراً ومؤقتاً لدى Google (503 High Demand). سيتم التبديل لنموذج بديل تلقائياً.`
        } else if (response.status === 403) {
          errorMsg = 'غير مصرح بالوصول. تأكد من تفعيل خدمة Generative Language API لمفتاحك في Google AI Studio.'
        } else if (response.status === 404) {
          errorMsg = `خطأ 404: النموذج (${cleanModel}) غير متوفر في الإصدار ${apiVersion}. (${detail})`
        } else {
          errorMsg += detail || response.statusText
        }
      } catch (e) {
        errorMsg += response.statusText
      }
      const err = new Error(errorMsg)
      err.status = response.status
      err.detail = detail
      throw err
    }

    const data = await response.json()
    const candidate = data.candidates?.[0]

    if (!candidate) {
      throw new Error('لم يتم إرجاع أي رد من نموذج الذكاء الاصطناعي.')
    }

    if (candidate.finishReason === 'SAFETY') {
      throw new Error('تم حجب الرد بسبب معايير السلامة والأمان.')
    }

    const text = candidate.content?.parts?.map(p => p.text).join('') || ''
    return text.trim()
  },

  /**
   * 1. Generate full blog post from title & category
   */
  async generateFullPost({ title, category, audience = '', tone = 'احترافي وشيق', extraInstructions = '', apiKey = '', model = '' }) {
    const systemInstruction = `أنت كاتب مقالات وخبير محتوى رقمي متمرس باللغة العربية. مهمتك كتابة مقالات حصرية، متعمقة، ومصوغة بأسلوب سلس ومشوق يجذب القارئ ويحقق أعلى معايير الـ SEO وقابلية القراءة.
استخدم تنسيق Markdown الغني:
- عناوين رئيسية H2 وعناوين فرعية H3 واضحة ومقنعة
- مقدمة خاطفة مع خطاف (hook) يشوق القارئ
- نقاط وتعدادات نقطية سهلة القراءة
- أمثلة عملية أو اقتباسات مميزة باستخدام >
- جداول مقارنة أو كتل برمجية منسقة إذا كان الموضوع تقنياً
- خاتمة قوية وخلاصة مع دعوة للتفاعل (CTA)
- لا تضع العنوان الرئيسي H1 في بداية المقال لأن العنوان موجود بالفعل في رأس الصفحة، ابدأ مباشرة بالمقدمة ثم العناوين الفرعية.`

    const prompt = `اكتب مقالاً متكاملاً واحترافياً بالعنوان التالي:
عنوان المقال: "${title}"
التخصص / التصنيف: ${category || 'عام'}
نبرة الأسلوب: ${tone}
${audience ? `الجمهور المستهدف: ${audience}` : ''}
${extraInstructions ? `تعليمات وتفاصيل إضافية: ${extraInstructions}` : ''}

يرجى كتابة محتوى ثري ومكتمل، منظم بعناوين واضحة H2 و H3، غني بالمعلومات والأمثلة العملية.`

    return await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.75 })
  },

  /**
   * 2. Improve and polish existing text
   */
  async improveContent({ content, goal = 'تحسين الصياغة والتدقيق اللغوي', tone = 'احترافي', apiKey = '', model = '' }) {
    const systemInstruction = `أنت مدقق لغوي ومحرر مقالات محترف. مهمتك تحسين النص المُعطى:
- تصحيح أي أخطاء إملائية أو نحوية
- تحسين تدفق الجمل والأسلوب وجعله أكثر إقناعاً وبلاغة
- الحفاظ على جوهر المعنى والتنسيق (Markdown / HTML)
- إرجاع النص المحسن مباشرة بدون تعليقات مقدمة أو خاتمة.`

    const prompt = `الهدف: ${goal}
النبرة المطلوبة: ${tone}

يرجى تحسين وتدقيق النص التالي:
---
${content}
---`

    return await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.4 })
  },

  /**
   * 3. Format and organize raw plain text into structured Markdown
   */
  async formatAndStructure({ text, apiKey = '', model = '' }) {
    const systemInstruction = `أنت منسق محتوى محترف. مهمتك أخذ الأفكار أو النصوص الخام غير المنسقة وتحويلها إلى مقال مدونة منظم وجميل بتنسيق Markdown:
- وضع عناوين H2 و H3 مناسبة
- تحويل الفقرات الطويلة إلى نقاط واضحة حيث يلزم
- إضافة اقتباسات مميزة >
- تنظيم الجداول إن وجدت بيانات مقارنة
- إرجاع المقال المنسق فقط.`

    const prompt = `قم بإعادة تنظيم وتنسيق النص الخام التالي ليصبح مقالاً جذاباً ومنسقاً بعناية:
---
${text}
---`

    return await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.5 })
  },

  /**
   * 4. Generate compelling excerpt and introduction
   */
  async generateExcerptAndIntro({ title, content = '', category = '', apiKey = '', model = '' }) {
    const systemInstruction = `أنت كاتب تسويقي متخصص في صياغة المقدمات والمقتطفات المغناطيسية لمقالات المدونة.
أرجع النتيجة بصيغة JSON حصراً بالشكل التالي:
{
  "excerpt": "مقتطف من سطرين يصف المقال بشكل مشوق ومختصر جداً ويصلح لكروت المقالات ومحركات البحث",
  "intro": "فقرة افتتاحية مشوقة من 3-4 أسطر تبدأ بخطاف يخاطب القارئ وتوضح ما سيتعلمه من هذا المقال"
}`

    const prompt = `قم بصياغة مقتطف ومقدمة جذابة للمقال التالي:
العنوان: "${title}"
التصنيف: ${category}
${content ? `محتوى أو مسودة المقال:\n${content.substring(0, 1500)}` : ''}`

    const raw = await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.7 })
    try {
      const cleaned = raw.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim()
      return JSON.parse(cleaned)
    } catch (e) {
      return { excerpt: raw.slice(0, 200), intro: raw }
    }
  },

  /**
   * 5. Generate SEO Metadata (Title, Description, Keywords, Tags, Slug)
   */
  async generateSeoData({ title, content = '', category = '', apiKey = '', model = '' }) {
    const systemInstruction = `أنت خبير سيو (SEO Specialist) لمحركات البحث وخاصة Google.
قم بتحليل المقال وتوليد أفضل بيانات سيو تساعد على تصدر نتائج البحث.
أرجع النتيجة بصيغة JSON فقط:
{
  "meta_title": "عنوان سيو جذاب ومحسن لا يتجاوز 60 حرفاً",
  "meta_description": "وصف جذاب وغني بالكلمات المفتاحية بين 130 و 155 حرفاً يشجع على النقر",
  "meta_keywords": "كلمات مفتاحية مفصولة بفواصل (مثال: تطوير ويب, ذكاء اصطناعي, بايثون)",
  "suggested_tags": ["وسم1", "وسم2", "وسم3", "وسم4", "وسم5"],
  "suggested_slug": "english-slug-with-hyphens"
}`

    const prompt = `ولد بيانات السيو للمقال التالي:
العنوان: "${title}"
التصنيف: ${category}
${content ? `المحتوى:\n${content.substring(0, 2000)}` : ''}`

    const raw = await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.4 })
    try {
      const cleaned = raw.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim()
      return JSON.parse(cleaned)
    } catch (e) {
      return {
        meta_title: title.slice(0, 60),
        meta_description: content.replace(/<[^>]+>/g, '').slice(0, 150),
        meta_keywords: category,
        suggested_tags: [category],
        suggested_slug: ''
      }
    }
  },

  /**
   * 6. Suggest catchy title alternatives
   */
  async suggestTitles({ currentTitle, category = '', apiKey = '', model = '' }) {
    const systemInstruction = `أنت خبير عناوين ومعدلات نقر (CTR Expert). اقترح 6 عناوين بديلة ومميزة للمقال، متنوعة في أسلوبها (عنوان عملي مباشر، عنوان فضولي، عنوان قائمة مرقمة، عنوان احترافي، عنوان تساؤلي).
أرجع النتيجة بصيغة JSON فقط:
{
  "titles": [
    "العنوان 1",
    "العنوان 2",
    "العنوان 3",
    "العنوان 4",
    "العنوان 5",
    "العنوان 6"
  ]
}`

    const prompt = `اقترح 6 عناوين جذابة للمقال:
العنوان الحالي: "${currentTitle}"
التصنيف: ${category}`

    const raw = await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.8 })
    try {
      const cleaned = raw.replace(/```json\s*/i, '').replace(/```\s*$/i, '').trim()
      return JSON.parse(cleaned).titles || []
    } catch (e) {
      return [currentTitle]
    }
  },

  /**
   * 7. Translate article to English or Arabic
   */
  async translateContent({ content, targetLang = 'en', apiKey = '', model = '' }) {
    const langName = targetLang === 'en' ? 'الإنجليزية' : 'العربية'
    const systemInstruction = `أنت مترجم محترف للمقالات التقنية والمهنية. ترجم المحتوى التالي بدقة عالية وأسلوب طبيعي إلى اللغة ${langName}، مع الحفاظ الكامل على تنسيقات Markdown (عناوين، كتل برمجية، روابط، إلخ). أرجع الترجمة فقط.`

    const prompt = `ترجم النص التالي بدقة مع الحفاظ على التنسيق:
---
${content}
---`

    return await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.3 })
  },

  /**
   * 8. Free Custom Chat / Instruction with blog context
   */
  async chatWithContext({ prompt, blogContext, apiKey = '', model = '' }) {
    const systemInstruction = `أنت مساعد ذكي مدمج داخل محرر مقالات المدونة.
المقال الحالي:
- العنوان: ${blogContext.title || 'غير محدد بعد'}
- التصنيف: ${blogContext.category || 'عام'}
- المقتطف: ${blogContext.excerpt || 'لا يوجد'}

مهمتك مساعدة المستخدم في أي طلب يخص كتابة، تلخيص، تعديل، أو تنسيق المقال. أجب بأسلوب مباشر ومفيد ومنسق بـ Markdown.`

    return await this.generate({ prompt, systemInstruction, apiKey, model, temperature: 0.7 })
  }
}

export default geminiService
