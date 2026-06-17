import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cliento from './pages/Cliento'
import ClientoProject from './pages/ClientoProject'
import Portal from './pages/portal'
import AuthGate from './AuthGate'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<AuthGate><Signup /></AuthGate>} />
      <Route path="/login" element={<AuthGate><Login /></AuthGate>} />
      <Route path="/dashboard" element={<AuthGate><Dashboard /></AuthGate>} />
      <Route path="/cliento" element={<AuthGate><Cliento /></AuthGate>} />
      <Route path="/cliento/:id" element={<AuthGate><ClientoProject /></AuthGate>} />
      <Route path="/portal/:token" element={<Portal />} />
    </Routes>
  )
}