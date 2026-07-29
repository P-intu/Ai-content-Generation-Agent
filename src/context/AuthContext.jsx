import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, fetchProfile } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('inkwell-user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  // Verify session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const tokens = localStorage.getItem('inkwell-tokens')
      if (tokens) {
        try {
          const profileData = await fetchProfile()
          setUser(profileData)
        } catch (e) {
          // Token expired or invalid
          localStorage.removeItem('inkwell-tokens')
          localStorage.removeItem('inkwell-user')
          setUser(null)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const userObj = await loginUser({ email, password })
    setUser(userObj)
    return userObj
  }

  const register = async (formData) => {
    const username = formData.username || (formData.email ? formData.email.split('@')[0] : 'user')
    const userObj = await registerUser({
      username: username,
      email: formData.email,
      password: formData.password,
    })
    setUser(userObj)
    return userObj
  }

  const logout = () => {
    localStorage.removeItem('inkwell-tokens')
    localStorage.removeItem('inkwell-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
