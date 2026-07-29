import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Generate from './pages/Generate/Generate.jsx'
import History from './pages/History/History.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
