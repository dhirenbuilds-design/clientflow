import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useParams } from 'react-router-dom'
import PortalCard from './PortalCard'

export default function Portal() {
  const { token } = useParams()
  const [project, setProject] = useState<any>(null)
  const [freelancerEmail, setFreelancerEmail] = useState('')
  const [milestones, setMilestones] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [approved, setApproved] = useState('')
  const [showRevision, setShowRevision] = useState(false)
  const [revisionNote, setRevisionNote] = useState('')

  const [brandColor, setBrandColor] = useState('#3B82F6')
  const [brandSecondary, setBrandSecondary] = useState('#6366F1')
  const [logoUrl, setLogoUrl] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [isPro, setIsPro] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('projects').select('*').eq('unique_token', token).single()
      if (!data) { setNotFound(true); setLoading(false); return }
      setProject(data)
      if (data.approval_status) setApproved(data.approval_status)

      const { data: profile } = await supabase
        .from('profiles')
        .select('email, logo_url, brand_color, brand_secondary, business_name, plan, portal_theme')
        .eq('user_id', data.user_id)
        .single()

      if (profile) {
        setFreelancerEmail(profile.email)
        if (profile.brand_color) setBrandColor(profile.brand_color)
        if (profile.brand_secondary) setBrandSecondary(profile.brand_secondary)
        if (profile.logo_url) setLogoUrl(profile.logo_url)
        if (profile.business_name) setBusinessName(profile.business_name)
        setIsPro(profile.plan === 'pro')
        setTheme(profile.portal_theme === 'light' ? 'light' : 'dark')
      }

      const { data: ms } = await supabase.from('milestones').select('*').eq('project_id', data.id).order('created_at', { ascending: true })
      setMilestones(ms || [])
      const { data: fs } = await supabase.from('files').select('*').eq('project_id', data.id)
      setFiles(fs || [])
      setLoading(false)
    }
    load()
  }, [token])

  const sendNotificationEmail = async (type: string, note: string) => {
    if (!freelancerEmail) return
    const subject = type === 'approved'
      ? `✅ ${project.client_name} approved "${project.title}"`
      : `🔄 ${project.client_name} requested a revision on "${project.title}"`
    const message = type === 'approved'
      ? `<h2>Great news!</h2><p><b>${project.client_name}</b> just approved the project <b>"${project.title}"</b> on ClientFlow.</p>`
      : `<h2>Revision requested</h2><p><b>${project.client_name}</b> requested a revision on <b>"${project.title}"</b>:</p><p style="background:#f3f4f6;padding:12px;border-radius:8px;">${note}</p>`
    try {
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        body: JSON.stringify({ to: freelancerEmail, subject, message })
      })
    } catch (e) {
      console.log('Email failed silently', e)
    }
  }

  const handleApproval = async (type: string) => {
    await supabase.from('projects').update({
      approval_status: type,
      revision_note: type === 'revision' ? revisionNote : null
    }).eq('id', project.id)
    setApproved(type)
    setShowRevision(false)
    sendNotificationEmail(type, revisionNote)
  }

  const isLight = theme === 'light'
  const pageColors = isLight
    ? { bg: '#f7f7f9', cardBg: '#ffffff', cardBorder: 'rgba(20,20,30,0.06)', text: '#15161a', textMuted: '#6b6f76', textFaint: '#c5c8ce', navBg: 'rgba(255,255,255,0.85)', innerBg: '#fafafb' }
    : { bg: '#060910', cardBg: 'rgba(255,255,255,0.02)', cardBorder: 'rgba(255,255,255,0.06)', text: '#F8FAFC', textMuted: '#475569', textFaint: '#1E293B', navBg: 'rgba(6,9,16,0.9)', innerBg: 'rgba(255,255,255,0.03)' }

  if (loading) return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>
      Loading your portal...
    </div>
  )

  if (notFound) return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#F8FAFC', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Portal not found</h2>
        <p style={{ color: '#475569' }}>This link may be invalid or expired.</p>
      </div>
    </div>
  )

  const completedCount = milestones.filter(m => m.status === 'completed').length
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

  return (
    <div style={{ backgroundColor: pageColors.bg, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: pageColors.text }}>

      {/* NAV */}
      <nav style={{ padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${pageColors.cardBorder}`, backgroundColor: pageColors.navBg, backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>

        {/* Logo: Pro = their brand, Free = ClientFlow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isPro && logoUrl ? (
            <>
              <img src={logoUrl} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
              {businessName && <span style={{ fontSize: '1rem', fontWeight: '800', color: pageColors.text }}>{businessName}</span>}
            </>
          ) : isPro && businessName ? (
            <div style={{ fontSize: '1.1rem', fontWeight: '900', color: brandColor }}>{businessName}</div>
          ) : (
            <div style={{ fontSize: '1.1rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ClientFlow
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', borderRadius: '999px', cursor: 'pointer', border: `1px solid ${pageColors.cardBorder}`, backgroundColor: pageColors.cardBg, color: pageColors.textMuted, fontSize: '0.78rem', fontWeight: '600' }}
          >
            {isLight ? '🌙 Dark' : '☀️ Light'}
          </button>
          <div style={{ fontSize: '0.8rem', color: pageColors.textMuted }}>Client Portal</div>
        </div>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <PortalCard
            brandColor={brandColor}
            brandSecondary={brandSecondary}
            logoUrl={logoUrl}
            businessName={businessName}
            theme={theme}
            isPro={isPro}
            projectTitle={project.title}
            clientName={project.client_name}
            status={project.status}
            milestoneLabel={`${completedCount} of ${milestones.length} milestones completed (${progress}%)`}
            onApprove={approved === 'approved' || approved === 'revision' ? undefined : () => handleApproval('approved')}
            onRequestRevision={approved === 'approved' || approved === 'revision' ? undefined : () => setShowRevision(true)}
          />
        </div>

        {(approved === 'approved' || approved === 'revision' || showRevision) && (
          <div style={{ backgroundColor: pageColors.cardBg, border: `1px solid ${pageColors.cardBorder}`, borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            {approved === 'approved' ? (
              <div style={{ color: '#22C55E', fontWeight: '800', fontSize: '1.1rem' }}>✅ You've approved this project!</div>
            ) : approved === 'revision' ? (
              <div style={{ color: '#F59E0B', fontWeight: '800', fontSize: '1.1rem' }}>🔄 Revision requested! We'll get back to you soon.</div>
            ) : showRevision ? (
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: pageColors.textMuted, letterSpacing: '0.1em', marginBottom: '1rem' }}>REQUEST REVISION</h3>
                <textarea
                  placeholder="What would you like us to change or improve?"
                  value={revisionNote}
                  onChange={e => setRevisionNote(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '1rem', backgroundColor: pageColors.innerBg, border: `1px solid ${pageColors.cardBorder}`, borderRadius: '12px', color: pageColors.text, fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' as const, marginBottom: '1rem' }}
                />
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowRevision(false)} style={{ padding: '0.7rem 1.5rem', backgroundColor: 'transparent', color: pageColors.textMuted, border: `1px solid ${pageColors.cardBorder}`, borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={() => handleApproval('revision')} disabled={!revisionNote} style={{ padding: '0.7rem 1.5rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', opacity: !revisionNote ? 0.5 : 1 }}>
                    Send Revision Request
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {milestones.length > 0 && (
          <div style={{ backgroundColor: pageColors.cardBg, border: `1px solid ${pageColors.cardBorder}`, borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: pageColors.textMuted, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>MILESTONES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {milestones.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: m.status === 'completed' ? 'rgba(34,197,94,0.15)' : (isLight ? '#f0f0f0' : 'rgba(255,255,255,0.05)'), border: `2px solid ${m.status === 'completed' ? '#22C55E' : pageColors.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                    {m.status === 'completed' ? '✓' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: m.status === 'completed' ? pageColors.textMuted : pageColors.text, textDecoration: m.status === 'completed' ? 'line-through' : 'none' }}>{m.title}</div>
                    {m.due_date && <div style={{ color: pageColors.textMuted, fontSize: '0.78rem', marginTop: '0.1rem' }}>Due {new Date(m.due_date).toLocaleDateString()}</div>}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '999px', backgroundColor: m.status === 'completed' ? 'rgba(34,197,94,0.1)' : `${brandColor}18`, color: m.status === 'completed' ? '#4ADE80' : brandColor, border: `1px solid ${m.status === 'completed' ? 'rgba(34,197,94,0.2)' : `${brandColor}35`}` }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div style={{ backgroundColor: pageColors.cardBg, border: `1px solid ${pageColors.cardBorder}`, borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: pageColors.textMuted, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>FILES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {files.map(file => (
                <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: pageColors.innerBg, borderRadius: '12px', border: `1px solid ${pageColors.cardBorder}` }}>
                  <div style={{ fontSize: '1.5rem' }}>{file.type === 'link' ? '🔗' : '📄'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{file.name}</div>
                    <div style={{ color: pageColors.textMuted, fontSize: '0.78rem' }}>{file.type === 'link' ? 'External link' : `${(file.size / 1024).toFixed(1)} KB`}</div>
                  </div>
                  <a href={file.url} target="_blank" rel="noreferrer" style={{ padding: '0.4rem 0.9rem', backgroundColor: `${brandColor}18`, border: `1px solid ${brandColor}35`, color: brandColor, borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'none' }}>
                    {file.type === 'link' ? 'Open →' : 'Download'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ backgroundColor: pageColors.cardBg, border: `1px solid ${pageColors.cardBorder}`, borderRadius: '20px', padding: '2rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: pageColors.textMuted, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>YOUR DETAILS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: pageColors.textMuted, fontSize: '0.9rem' }}>Name</span>
              <span style={{ color: pageColors.text, fontWeight: '600', fontSize: '0.9rem' }}>{project.client_name}</span>
            </div>
            {project.client_email && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: pageColors.textMuted, fontSize: '0.9rem' }}>Email</span>
                <span style={{ color: pageColors.text, fontWeight: '600', fontSize: '0.9rem' }}>{project.client_email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Powered by — Free plan only */}
        {!isPro && (
          <div style={{ textAlign: 'center', padding: '2rem 0 0.5rem', fontSize: '0.78rem', color: pageColors.textMuted }}>
            Powered by <span style={{ color: '#3B82F6', fontWeight: '700' }}>ClientFlow</span>
          </div>
        )}

      </div>
    </div>
  )
}