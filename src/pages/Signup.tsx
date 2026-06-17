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

  const handleSignup = async () => {
    if (!email || !password || !name) { setError('Fill in all fields'); return }
    setLoading(true)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert([{ user_id: data.user.id, full_name: name, email, plan: 'free' }])
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const s = {
    page: { backgroundColor: '#0F172A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' },
    box: { backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '20px', padding: '3rem', width: '100%', maxWidth: '420px' },
    logo: { fontSize: '1.5rem', fontWeight: '900', color: '#3B82F6', marginBottom: '2rem', textAlign: 'center' as const },
    title: { fontSize: '1.75rem', fontWeight: '800', color: '#F8FAFC', marginBottom: '0.5rem', textAlign: 'center' as const },
    sub: { color: '#94A3B8', fontSize: '0.9rem', textAlign: 'center' as const, marginBottom: '2rem' },
    label: { color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' },
    input: { width: '100%', padding: '0.85rem 1rem', backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '10px', color: '#F8FAFC', fontSize: '1rem', outline: 'none', marginBottom: '1.25rem', boxSizing: 'border-box' as const },
    btn: { width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '0.5rem' },
    err: { color: '#EF4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' as const },
    link: { color: '#94A3B8', fontSize: '0.85rem', textAlign: 'center' as const, marginTop: '1.5rem' }
  }

  return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={s.logo}>ClientFlow</div>
        <div style={s.title}>Create your account</div>
        <div style={s.sub}>Start managing clients like a pro</div>
        {error && <div style={s.err}>{error}</div>}
        <label style={s.label}>Full name</label>
        <input style={s.input} placeholder="Dhiren Sharma" value={name} onChange={e => setName(e.target.value)} />
        <label style={s.label}>Email</label>
        <input style={s.input} placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <label style={s.label}>Password</label>
        <input style={s.input} type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={s.btn} onClick={handleSignup} disabled={loading}>{loading ? 'Creating account...' : 'Create account →'}</button>
        <div style={s.link}>Already have an account? <Link to="/login" style={{ color: '#3B82F6' }}>Sign in</Link></div>
      </div>
    </div>
  )
}
