import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  const handleLogin = async () => {
    if (!email || !password) { setError('Fill in all fields'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* GLOW */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        
        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>ClientFlow</div>
          </Link>
        </div>

        {/* CARD */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '2.75rem', backdropFilter: 'blur(20px)' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem', color: '#F8FAFC' }}>Welcome back</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '2rem' }}>Sign in to your ClientFlow account</p>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#FCA5A5', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>EMAIL</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#F8FAFC', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>PASSWORD</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '0.9rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#F8FAFC', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', fontWeight: '700', fontSize: '0.95rem', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 0 30px rgba(99,102,241,0.3)', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#818CF8', fontWeight: '600', textDecoration: 'none' }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}