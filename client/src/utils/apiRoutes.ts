const API_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:4200'
).replace(/\/+$/, '')

const API_PREFIX = '/api'

const API_ROUTES = {
  ENCODE_URL: `${API_BASE_URL}${API_PREFIX}/encode`,
  DECODE_URL: `${API_BASE_URL}${API_PREFIX}/decode`,
  GET_STATISTICS: (shortCode: string) =>
    `${API_BASE_URL}${API_PREFIX}/statistic/${shortCode}`,
  LIST_URLS: `${API_BASE_URL}${API_PREFIX}/list`,
  REDIRECT_URL: (shortCode: string) => `${API_BASE_URL}/${shortCode}`
}

export default API_ROUTES
