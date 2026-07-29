import axios from 'axios'

// Base Axios instance pointing to Django REST Framework backend
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : ''),
  timeout: 40000, // 40 seconds to allow for LLM API responses
})

// Request interceptor to automatically attach JWT Access Token if present
api.interceptors.request.use(
  (config) => {
    const rawTokens = localStorage.getItem('inkwell-tokens')
    if (rawTokens) {
      try {
        const tokens = JSON.parse(rawTokens)
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`
        }
      } catch (e) {
        // invalid JSON format in storage
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for clear error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customErrorMsg = error.response?.data?.message || error.message || 'An error occurred'
    const errorDetails = error.response?.data?.errors || null
    return Promise.reject({ message: customErrorMsg, errors: errorDetails, originalError: error })
  }
)

/**
 * Register new user API
 */
export async function registerUser({ username, email, password }) {
  const response = await api.post('/api/register/', { username, email, password })
  const resData = response.data
  if (resData.success) {
    localStorage.setItem('inkwell-tokens', JSON.stringify(resData.data.tokens))
    localStorage.setItem('inkwell-user', JSON.stringify(resData.data.user))
    return resData.data.user
  }
  throw new Error(resData.message || 'Registration failed')
}

/**
 * Login user API
 */
export async function loginUser({ email, password }) {
  const response = await api.post('/api/login/', { email, password })
  const resData = response.data
  if (resData.success) {
    localStorage.setItem('inkwell-tokens', JSON.stringify(resData.data.tokens))
    localStorage.setItem('inkwell-user', JSON.stringify(resData.data.user))
    return resData.data.user
  }
  throw new Error(resData.message || 'Login failed')
}

/**
 * Fetch profile API
 */
export async function fetchProfile() {
  const response = await api.get('/api/profile/')
  const resData = response.data
  if (resData.success) {
    localStorage.setItem('inkwell-user', JSON.stringify(resData.data))
    return resData.data
  }
  throw new Error(resData.message || 'Failed to fetch profile')
}

/**
 * Generate Content API
 */
export async function generateContent(payload) {
  const { topic, contentType, tone, instructions, length } = payload

  const backendPayload = {
    topic: topic,
    content_type: contentType,
    tone: tone,
    length: length,
    additional_instruction: instructions || '',
  }

  const response = await api.post('/api/content/generate/', backendPayload)
  const resData = response.data

  if (resData.success) {
    const item = resData.data
    return {
      id: item.id,
      title: `${item.topic} — a ${item.tone} ${item.content_type}`,
      content: item.generated_text,
      createdAt: item.created_at,
    }
  }
  throw new Error(resData.message || 'Failed to generate content')
}

/**
 * Fetch History API
 */
export async function fetchHistory() {
  const response = await api.get('/api/content/history/')
  const resData = response.data

  if (resData.success) {
    return resData.data.map((item) => ({
      id: item.id,
      title: `${item.topic} — a ${item.tone} ${item.content_type}`,
      contentType: item.content_type,
      tone: item.tone,
      snippet: item.generated_text.slice(0, 120) + (item.generated_text.length > 120 ? '...' : ''),
      content: item.generated_text,
      createdAt: item.created_at,
    }))
  }
  return []
}

/**
 * Delete History Item API
 */
/**
 * Fetch Dashboard Stats API
 */
export async function fetchDashboard() {
  const response = await api.get('/api/content/dashboard/')
  const resData = response.data
  if (resData.success) {
    return resData.data
  }
  throw new Error(resData.message || 'Failed to fetch dashboard stats')
}

export async function deleteHistory(id) {
  const response = await api.delete(`/api/content/${id}/`)
  const resData = response.data
  return { success: resData.success }
}

// Backwards-compatible named export expected by the UI
export async function deleteHistoryItem(id) {
  return deleteHistory(id)
}
