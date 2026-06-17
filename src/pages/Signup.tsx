import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  const handleSignup = async () => {
    if (!email || !password || !name) { setError('Fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert([{ user_id: data.user.id, full_name: name, email, plan: 'free' }])
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>

      {/* GLOW */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>ClientFlow</div>
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '999px', padding: '0.3rem 0.875rem', fontSize: '0.75rem', color: '#60A5FA', marginTop: '0.75rem', fontWeight: '600' }}>
            🔥 Early Bird spots filling fast
          </div>
        </div>

        {/* CARD */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: isMobile ? '2rem 1.5rem' : '2.75rem', backdropFilter: 'blur(20px)' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem', color: '#F8FAFC' }}>Create your account</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '2rem' }}>Start managing clients like a $10k/month agency</p>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#FCA5A5', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {[
            { label: 'FULL NAME', value: name, setter: setName, placeholder: 'Dhiren Sharma', type: 'text' },
            { label: 'EMAIL', value: email, setter: setEmail, placeholder: 'you@email.com', type: 'email' },
            { label: 'PASSWORD', value: password, setter: setPassword, placeholder: 'Min 6 characters', type: 'password' },
          ].map((field, i) => (
            <div key={field.label} style={{ marginBottom: i === 2 ? '2rem' : '1.25rem' }}>
              <label style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                style={{ width: '100%', padding: '0.9rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#F8FAFC', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          ))}

          <button
            onClick={handleSignup}
            disabled={loading}
            style={{ width: '100%', padding: '0.95rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', fontWeight: '700', fontSize: '0.95rem', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 0 30px rgba(99,102,241,0.3)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account...' : 'Create free account →'}
          </button>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818CF8', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#1E293B', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  )
}