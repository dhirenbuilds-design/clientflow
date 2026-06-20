import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [onboardings, setOnboardings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      setProfile(prof)
      const { data: proj } = await supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setProjects(proj || [])
      const { data: onb } = await supabase.from('onboardings').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setOnboardings(onb || [])
      setLoading(false)
    }
    load()
  }, [])

  const logout = async () => { await supabase.auth.signOut(); navigate('/') }

  if (loading) return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>ClientFlow</div>
        <div style={{ color: '#334155', fontSize: '0.9rem' }}>Loading your dashboard...</div>
      </div>
    </div>
  )

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '30%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <nav style={{ padding: isMobile ? '1rem 1.25rem' : '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, backgroundColor: 'rgba(6,9,16,0.9)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ClientFlow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isMobile && <span style={{ color: '#334155', fontSize: '0.85rem' }}>{profile?.email}</span>}

          <Link to="/analytics" style={{ padding: '0.45rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', fontWeight: '600', fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            📊 Analytics
          </Link>

          <Link to="/branding" style={{ padding: '0.45rem 1rem', backgroundColor: profile?.plan === 'pro' ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)', color: profile?.plan === 'pro' ? '#A78BFA' : '#64748B', border: `1px solid ${profile?.plan === 'pro' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '8px', fontWeight: '600', fontSize: '0.82rem', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
            {profile?.plan === 'pro' ? '🎨 Branding' : '🔒 Branding'}
          </Link>

          <button onClick={logout} style={{ padding: '0.45rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ padding: isMobile ? '2rem 1.25rem' : '3rem 2.5rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Good to see you, {firstName} 👋
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>Here's your ClientFlow overview</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { label: 'Active Projects', value: projects.length, color: '#3B82F6', icon: '📁' },
            { label: 'Active Onboardings', value: onboardings.length, color: '#8B5CF6', icon: '🚀' },
            { label: 'Current Plan', value: (profile?.plan || 'free').toUpperCase(), color: '#6366F1', icon: '⚡' },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
              <div style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: '900', color: stat.color, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ color: '#475569', fontSize: '0.82rem', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {profile?.plan === 'free' && (
          <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: '800', marginBottom: '0.25rem' }}>🔥 Early Bird offer — $25/mo forever</div>
              <div style={{ color: '#64748B', fontSize: '0.85rem' }}>First 20 customers get Bundle Pro locked in. Use code EARLYBIRD.</div>
            </div>
            <button style={{ padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
              Upgrade now →
            </button>
          </div>
        )}

        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Your Tools</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: '1.25rem' }}>
            {[
              { icon: '📁', tag: 'CLIENTO', color: '#3B82F6', title: 'Client Portal', desc: 'Create projects and send clients a beautiful portal link. They see status, files, invoices — no login needed.', link: '/cliento', count: projects.length, countLabel: 'active projects' },
              { icon: '🚀', tag: 'ONBOARDKIT', color: '#8B5CF6', title: 'Client Onboarding', desc: 'Create onboarding pages for new clients to sign contracts, pay deposits, and upload brand assets.', link: '/onboardkit', count: onboardings.length, countLabel: 'active onboardings' },
            ].map(tool => (
              <div key={tool.tag} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${tool.color}40`; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
                onClick={() => navigate(tool.link)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: '52px', height: '52px', background: `linear-gradient(135deg, ${tool.color}20, ${tool.color}10)`, border: `1px solid ${tool.color}25`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{tool.icon}</div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '999px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                    {tool.count} {tool.countLabel}
                  </div>
                </div>
                <div style={{ color: tool.color, fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>{tool.tag}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{tool.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>{tool.desc}</p>
                <div style={{ color: tool.color, fontSize: '0.875rem', fontWeight: '700' }}>Open {tool.title} →</div>
              </div>
            ))}
          </div>
        </div>

        {projects.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Recent Projects</h2>
              <Link to="/cliento" style={{ color: '#6366F1', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projects.slice(0, 4).map(p => (
                <div key={p.id} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{p.title}</div>
                    <div style={{ color: '#475569', fontSize: '0.82rem' }}>{p.client_name} · {p.client_email}</div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA', padding: '0.2rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && onboardings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>Ready to impress your first client?</h3>
            <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '0.95rem' }}>Create your first project or onboarding page and send your client a professional link.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/cliento')} style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
                Create first project →
              </button>
              <button onClick={() => navigate('/onboardkit')} style={{ padding: '0.75rem 1.75rem', backgroundColor: 'rgba(255,255,255,0.04)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>
                Create onboarding →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}