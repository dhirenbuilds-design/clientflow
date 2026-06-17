import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useParams } from 'react-router-dom'

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

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('projects').select('*').eq('unique_token', token).single()
      if (!data) { setNotFound(true); setLoading(false); return }
      setProject(data)
      if (data.approval_status) setApproved(data.approval_status)

      const { data: profile } = await supabase.from('profiles').select('email').eq('user_id', data.user_id).single()
      if (profile) setFreelancerEmail(profile.email)

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
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <nav style={{ padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(6,9,16,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#3B82F6' }}>ClientFlow</div>
        <div style={{ fontSize: '0.8rem', color: '#475569' }}>Client Portal</div>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA', padding: '0.3rem 0.9rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '1rem' }}>
            {project.status?.toUpperCase()}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{project.title}</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Prepared for <span style={{ color: '#94A3B8', fontWeight: '600' }}>{project.client_name}</span></p>
        </div>

        {milestones.length > 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em' }}>OVERALL PROGRESS</h3>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3B82F6' }}>{progress}%</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', borderRadius: '999px', transition: 'width 0.5s ease' }} />
            </div>
            <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '0.75rem' }}>{completedCount} of {milestones.length} milestones completed</p>
          </div>
        )}

        {milestones.length > 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>MILESTONES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {milestones.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: m.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', border: `2px solid ${m.status === 'completed' ? '#22C55E' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                    {m.status === 'completed' ? '✓' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: m.status === 'completed' ? '#94A3B8' : '#F8FAFC', textDecoration: m.status === 'completed' ? 'line-through' : 'none' }}>{m.title}</div>
                    {m.due_date && <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '0.1rem' }}>Due {new Date(m.due_date).toLocaleDateString()}</div>}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '999px', backgroundColor: m.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', color: m.status === 'completed' ? '#4ADE80' : '#60A5FA', border: `1px solid ${m.status === 'completed' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)'}` }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>FILES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {files.map(file => (
                <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '1.5rem' }}>{file.type === 'link' ? '🔗' : '📄'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{file.name}</div>
                    <div style={{ color: '#475569', fontSize: '0.78rem' }}>{file.type === 'link' ? 'External link' : `${(file.size / 1024).toFixed(1)} KB`}</div>
                  </div>
                  <a href={file.url} target="_blank" rel="noreferrer" style={{ padding: '0.4rem 0.9rem', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'none' }}>
                    {file.type === 'link' ? 'Open →' : 'Download'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1rem' }}>DELIVERABLE APPROVAL</h3>
          {approved === 'approved' ? (
            <div style={{ color: '#22C55E', fontWeight: '800', fontSize: '1.1rem' }}>✅ You've approved this project!</div>
          ) : approved === 'revision' ? (
            <div style={{ color: '#F59E0B', fontWeight: '800', fontSize: '1.1rem' }}>🔄 Revision requested! We'll get back to you soon.</div>
          ) : !showRevision ? (
            <>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Happy with the work? Approve it or request a revision.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => handleApproval('approved')} style={{ padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
                  ✓ Approve Project
                </button>
                <button onClick={() => setShowRevision(true)} style={{ padding: '0.85rem 2rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' }}>
                  ✏️ Request Revision
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <textarea
                placeholder="What would you like us to change or improve?"
                value={revisionNote}
                onChange={e => setRevisionNote(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' as const, marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowRevision(false)} style={{ padding: '0.7rem 1.5rem', backgroundColor: 'transparent', color: '#475569', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={() => handleApproval('revision')} disabled={!revisionNote} style={{ padding: '0.7rem 1.5rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', opacity: !revisionNote ? 0.5 : 1 }}>
                  Send Revision Request
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>YOUR DETAILS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569', fontSize: '0.9rem' }}>Name</span>
              <span style={{ color: '#F8FAFC', fontWeight: '600', fontSize: '0.9rem' }}>{project.client_name}</span>
            </div>
            {project.client_email && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569', fontSize: '0.9rem' }}>Email</span>
                <span style={{ color: '#F8FAFC', fontWeight: '600', fontSize: '0.9rem' }}>{project.client_email}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#1E293B', fontSize: '0.8rem' }}>
          Powered by <span style={{ color: '#3B82F6', fontWeight: '700' }}>ClientFlow</span>
        </div>

      </div>
    </div>
  )
}