import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Cliento() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const navigate = useNavigate()

  const loadProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/login'); return }
    const { data } = await supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  useEffect(() => { loadProjects() }, [])

  const createProject = async () => {
    if (!title || !clientName) return
    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('projects').insert([{
      user_id: user.id,
      title,
      client_name: clientName,
      client_email: clientEmail,
      status: 'active'
    }])
    setTitle(''); setClientName(''); setClientEmail('')
    setShowForm(false)
    await loadProjects()
    setCreating(false)
  }

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/portal/${token}`)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    await loadProjects()
  }

  if (loading) return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>

      <nav style={{ padding: '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, backgroundColor: 'rgba(6,9,16,0.9)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>← Dashboard</button>
          <div style={{ color: '#1E293B' }}>|</div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#F8FAFC' }}>📁 Cliento</div>
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: '0.55rem 1.25rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
          + New Project
        </button>
      </nav>

      <div style={{ padding: '3rem 2.5rem', maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Client Projects</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Create a project and send your client one professional link.</p>
        </div>

        {showForm && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>New Project</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'PROJECT TITLE', value: title, setter: setTitle, placeholder: 'Website Redesign' },
                { label: 'CLIENT NAME', value: clientName, setter: setClientName, placeholder: 'John Smith' },
                { label: 'CLIENT EMAIL', value: clientEmail, setter: setClientEmail, placeholder: 'john@company.com' },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>{field.label}</label>
                  <input placeholder={field.placeholder} value={field.value} onChange={e => field.setter(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '0.7rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={createProject} disabled={creating || !title || !clientName} style={{ padding: '0.7rem 1.75rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', opacity: creating || !title || !clientName ? 0.6 : 1 }}>
                {creating ? 'Creating...' : 'Create Project →'}
              </button>
            </div>
          </div>
        )}

        {projects.length === 0 && !showForm ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>No projects yet</h3>
            <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '0.9rem' }}>Create your first project and send your client a professional portal link.</p>
            <button onClick={() => setShowForm(true)} style={{ padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>
              Create first project →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {projects.map(project => (
              <div key={project.id}
                onClick={() => navigate(`/cliento/${project.id}`)}
                style={{ cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', transition: 'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '0.25rem' }}>{project.title}</div>
                    <div style={{ color: '#475569', fontSize: '0.85rem' }}>{project.client_name} {project.client_email && `· ${project.client_email}`}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => copyLink(project.unique_token)} style={{ padding: '0.5rem 1rem', backgroundColor: copied === project.unique_token ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', border: `1px solid ${copied === project.unique_token ? 'rgba(34,197,94,0.25)' : 'rgba(59,130,246,0.25)'}`, color: copied === project.unique_token ? '#4ADE80' : '#60A5FA', borderRadius: '8px', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' }}>
                      {copied === project.unique_token ? '✓ Copied!' : '🔗 Copy link'}
                    </button>
                    <button onClick={() => deleteProject(project.id)} style={{ padding: '0.5rem 0.75rem', backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444', borderRadius: '8px', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer' }}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}