import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper dark:bg-ink-800">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-signal border-r-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}
