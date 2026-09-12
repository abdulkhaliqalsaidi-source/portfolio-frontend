import api from './api'

export const dataTemplateService = {
  /**
   * Export Template as JSON
   * @param {string|Array} entities - Comma separated entity names or array
   * @param {boolean} withExamples - Whether to include example placeholder data
   */
  async exportTemplate(entities = 'all', withExamples = false) {
    const entParam = Array.isArray(entities) ? entities.join(',') : entities
    return await api.get('/admin/data-template/export/', {
      entities: entParam,
      examples: withExamples
    })
  },

  /**
   * Validate JSON file or payload (Dry-run preview)
   * @param {File|Object} fileOrPayload
   * @param {string} importMode
   */
  async validateTemplate(fileOrPayload, importMode = 'UPSERT') {
    if (fileOrPayload instanceof File) {
      const formData = new FormData()
      formData.append('file', fileOrPayload)
      formData.append('import_mode', importMode)
      return await api.post('/admin/data-template/validate/', formData)
    } else {
      return await api.post('/admin/data-template/validate/', {
        payload: fileOrPayload,
        import_mode: importMode
      })
    }
  },

  /**
   * Import template into database
   * @param {File|Object} fileOrPayload
   * @param {string} importMode - CREATE_ONLY, UPSERT, SKIP_EXISTING, REPLACE
   * @param {boolean} replaceConfirmed - Required if mode is REPLACE
   */
  async importTemplate(fileOrPayload, importMode = 'UPSERT', replaceConfirmed = false) {
    if (fileOrPayload instanceof File) {
      const formData = new FormData()
      formData.append('file', fileOrPayload)
      formData.append('import_mode', importMode)
      formData.append('replace_confirmed', String(replaceConfirmed))
      return await api.post('/admin/data-template/import/', formData)
    } else {
      return await api.post('/admin/data-template/import/', {
        payload: fileOrPayload,
        import_mode: importMode,
        replace_confirmed: replaceConfirmed
      })
    }
  },

  /**
   * Fetch Import History logs
   */
  async getHistory() {
    return await api.get('/admin/data-template/history/')
  },

  /**
   * Delete History entry
   * @param {number} id
   */
  async deleteHistory(id) {
    return await api.delete(`/admin/data-template/history/${id}/`)
  }
}

export default dataTemplateService
