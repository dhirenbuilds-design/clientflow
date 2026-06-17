import { useState } from 'react'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(localStorage.getItem('clientflow_unlocked') === 'true')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const checkPassword = () => {
    if (password === 'dhiren2026') {
      localStorage.setItem('clientflow_unlocked', 'true')
      setUnlocked(true)
    } else {
      setError('Wrong password')
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.3rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1.5rem' }}>ClientFlow</div>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This area is locked until launch</p>
        {error && <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkPassword()}
          style={{ width: '100%', padding: '0.85rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.95rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box' as const }}
        />
        <button onClick={checkPassword} style={{ width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
          Unlock
        </button>
      </div>
    </div>
  )
}