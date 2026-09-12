import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePortfolioStore } from './portfolio'

export const useDataTemplateStore = defineStore('dataTemplate', () => {
  const portfolioStore = usePortfolioStore()

  const selectedFile = ref<File | null>(null)
  const rawJsonText = ref('')
  const parsedJson = ref<any>(null)
  const fileError = ref<string | null>(null)

  const validating = ref(false)
  const validationReport = ref<any>(null)

  const importing = ref(false)
  const importResult = ref<any>(null)

  const historyList = ref<any[]>([])
  const loadingHistory = ref(false)

  function getHeaders() {
    const token = import.meta.client ? localStorage.getItem('access_token') : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function selectFile(file: File | null) {
    clearFile()
    if (!file) return

    selectedFile.value = file

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      fileError.value = 'الملف المختار ليس بصيغة JSON صالحة (.json)'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      fileError.value = 'حجم الملف يتجاوز 5 ميغابايت'
      return
    }

    try {
      const text = await file.text()
      rawJsonText.value = text
      setRawJson(text)
    } catch (e: any) {
      fileError.value = `تعذر قراءة محتوى الملف: ${e.message}`
      parsedJson.value = null
    }
  }

  function setRawJson(text: string) {
    rawJsonText.value = text
    if (!text || text.trim() === '') {
      parsedJson.value = null
      fileError.value = null
      return
    }

    try {
      parsedJson.value = JSON.parse(text)
      fileError.value = null
    } catch (e: any) {
      fileError.value = `الملف يحتوي على خطأ في صياغة الـ JSON: ${e.message}`
      parsedJson.value = null
    }
  }

  function clearFile() {
    selectedFile.value = null
    rawJsonText.value = ''
    parsedJson.value = null
    fileError.value = null
    validationReport.value = null
    importResult.value = null
  }

  async function validate(importMode = 'UPSERT') {
    if (!selectedFile.value && !parsedJson.value && !rawJsonText.value) return null
    validating.value = true
    validationReport.value = null
    try {
      const config = useRuntimeConfig()
      let body: any

      if (selectedFile.value) {
        const formData = new FormData()
        formData.append('file', selectedFile.value)
        formData.append('import_mode', importMode)
        body = formData
      } else {
        const payload = parsedJson.value || JSON.parse(rawJsonText.value)
        body = { payload, import_mode: importMode }
      }

      const report: any = await $fetch(`${config.public.apiBaseUrl}/admin/data-template/validate/`, {
        method: 'POST',
        headers: getHeaders(),
        body
      })
      validationReport.value = report
      return report
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.data?.errors?.[0]?.message || 'فشل فحص القالب'
      validationReport.value = {
        valid: false,
        summary: {},
        errors: [{ message: errorMsg }],
        warnings: []
      }
      return validationReport.value
    } finally {
      validating.value = false
    }
  }

  async function performImport(importMode = 'UPSERT', replaceConfirmed = false) {
    if (!selectedFile.value && !parsedJson.value && !rawJsonText.value) return null
    importing.value = true
    importResult.value = null
    try {
      const config = useRuntimeConfig()
      let body: any

      if (selectedFile.value) {
        const formData = new FormData()
        formData.append('file', selectedFile.value)
        formData.append('import_mode', importMode)
        formData.append('replace_confirmed', String(replaceConfirmed))
        body = formData
      } else {
        const payload = parsedJson.value || JSON.parse(rawJsonText.value)
        body = {
          payload,
          import_mode: importMode,
          replace_confirmed: replaceConfirmed
        }
      }

      const res: any = await $fetch(`${config.public.apiBaseUrl}/admin/data-template/import/`, {
        method: 'POST',
        headers: getHeaders(),
        body
      })
      importResult.value = res

      await portfolioStore.fetchPublicContent()
      await fetchHistory()
      return res
    } catch (err: any) {
      const errorMsg = err?.data?.message || 'فشلت عملية الاستيراد في الخادم'
      importResult.value = {
        success: false,
        status: 'FAILED',
        message: errorMsg,
        errors: err?.data?.errors || [{ message: errorMsg }]
      }
      await fetchHistory()
      return importResult.value
    } finally {
      importing.value = false
    }
  }

  async function fetchHistory() {
    loadingHistory.value = true
    try {
      const config = useRuntimeConfig()
      const data: any = await $fetch(`${config.public.apiBaseUrl}/admin/data-template/history/`, {
        headers: getHeaders()
      })
      historyList.value = Array.isArray(data) ? data : (data.results || [])
    } catch (err) {
      console.error('Failed to load template history:', err)
    } finally {
      loadingHistory.value = false
    }
  }

  async function deleteHistoryItem(id: number) {
    try {
      const config = useRuntimeConfig()
      await $fetch(`${config.public.apiBaseUrl}/admin/data-template/history/${id}/`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      historyList.value = historyList.value.filter(h => h.id !== id)
    } catch (err) {
      console.error('Failed to delete history item:', err)
    }
  }

  async function exportTemplateAndDownload(entities = 'all', withExamples = false) {
    if (!import.meta.client) return
    const config = useRuntimeConfig()
    const entParam = Array.isArray(entities) ? entities.join(',') : entities
    const data = await $fetch<any>(`${config.public.apiBaseUrl}/admin/data-template/export/?entities=${entParam}&examples=${withExamples}`, {
      headers: getHeaders()
    })
    if (!data) return

    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const dateStr = new Date().toISOString().split('T')[0]
    const filename = `portfolio-template-${withExamples ? 'examples-' : ''}${dateStr}.json`

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    selectedFile,
    rawJsonText,
    parsedJson,
    fileError,
    validating,
    validationReport,
    importing,
    importResult,
    historyList,
    loadingHistory,
    selectFile,
    setRawJson,
    clearFile,
    validate,
    performImport,
    fetchHistory,
    deleteHistoryItem,
    exportTemplateAndDownload
  }
})
