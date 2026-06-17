import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, useParams } from 'react-router-dom'

export default function ClientoProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([])
  const [newMilestone, setNewMilestone] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<any[]>([])
  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [invoiceDue, setInvoiceDue] = useState('')
  const [invoiceNote, setInvoiceNote] = useState('')
  const [addingInvoice, setAddingInvoice] = useState(false)
  const isMobile = window.innerWidth < 768

  const load = async () => {
    const { data: proj } = await supabase.from('projects').select('*').eq('id', id).single()
    setProject(proj)
    const { data: ms } = await supabase.from('milestones').select('*').eq('project_id', id).order('created_at', { ascending: true })
    setMilestones(ms || [])
    const { data: inv } = await supabase.from('invoices').select('*').eq('project_id', id).order('created_at', { ascending: false })
    setInvoices(inv || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const addMilestone = async () => {
    if (!newMilestone) return
    setAdding(true)
    await supabase.from('milestones').insert([{ project_id: id, title: newMilestone, status: 'pending', due_date: dueDate || null }])
    setNewMilestone(''); setDueDate('')
    await load(); setAdding(false)
  }

  const toggleMilestone = async (ms: any) => {
    await supabase.from('milestones').update({ status: ms.status === 'completed' ? 'pending' : 'completed' }).eq('id', ms.id)
    await load()
  }

  const deleteMilestone = async (msId: string) => {
    await supabase.from('milestones').delete().eq('id', msId)
    await load()
  }

  const addInvoice = async () => {
    if (!invoiceAmount) return
    setAddingInvoice(true)
    await supabase.from('invoices').insert([{
      project_id: id,
      amount: parseFloat(invoiceAmount),
      status: 'unpaid',
      due_date: invoiceDue || null,
      note: invoiceNote || null
    }])
    setInvoiceAmount(''); setInvoiceDue(''); setInvoiceNote('')
    await load(); setAddingInvoice(false)
  }

  const toggleInvoice = async (inv: any) => {
    await supabase.from('invoices').update({ status: inv.status === 'paid' ? 'unpaid' : 'paid' }).eq('id', inv.id)
    await load()
  }

  const deleteInvoice = async (invId: string) => {
    await supabase.from('invoices').delete().eq('id', invId)
    await load()
  }

  const updateStatus = async (status: string) => {
    await supabase.from('projects').update({ status }).eq('id', id)
    await load()
  }

  const copyPortalLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/portal/${project?.unique_token}`)
    alert('Portal link copied!')
  }

  if (loading) return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>Loading...</div>
  )

  return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <nav style={{ padding: isMobile ? '1rem 1.25rem' : '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(6,9,16,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/cliento')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>← Back</button>
          <div style={{ color: '#1E293B' }}>|</div>
          <div style={{ fontSize: '1rem', fontWeight: '800' }}>{project?.title}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={project?.status} onChange={e => updateStatus(e.target.value)} style={{ padding: '0.4rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}>
            <option value="active">Active</option>
            <option value="in review">In Review</option>
            <option value="completed">Completed</option>
            <option value="on hold">On Hold</option>
          </select>
          <button onClick={copyPortalLink} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
            🔗 Copy Client Link
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '2rem 1.25rem' : '3rem 2rem', position: 'relative', zIndex: 1 }}>

        {/* CLIENT INFO */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div><div style={{ color: '#475569', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>CLIENT</div><div style={{ fontWeight: '700' }}>{project?.client_name}</div></div>
          <div><div style={{ color: '#475569', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>EMAIL</div><div style={{ fontWeight: '700' }}>{project?.client_email || '—'}</div></div>
          <div><div style={{ color: '#475569', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>STATUS</div><div style={{ fontWeight: '700', color: '#60A5FA' }}>{project?.status}</div></div>
          <div><div style={{ color: '#475569', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>MILESTONES</div><div style={{ fontWeight: '700' }}>{milestones.filter(m => m.status === 'completed').length}/{milestones.length} done</div></div>
        </div>

        {/* MILESTONES */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem' }}>📍 Milestones</h2>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input placeholder="Milestone title..." value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMilestone()}
              style={{ flex: 1, minWidth: '180px', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none' }} />
            <button onClick={addMilestone} disabled={adding || !newMilestone} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', opacity: !newMilestone ? 0.5 : 1 }}>
              {adding ? 'Adding...' : '+ Add'}
            </button>
          </div>
          {milestones.length === 0 ? (
            <p style={{ color: '#475569', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No milestones yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {milestones.map(ms => (
                <div key={ms.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <button onClick={() => toggleMilestone(ms)} style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: ms.status === 'completed' ? '#22C55E' : 'transparent', border: `2px solid ${ms.status === 'completed' ? '#22C55E' : 'rgba(255,255,255,0.2)'}`, cursor: 'pointer', color: 'white', fontSize: '0.7rem', flexShrink: 0 }}>
                    {ms.status === 'completed' ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', textDecoration: ms.status === 'completed' ? 'line-through' : 'none', color: ms.status === 'completed' ? '#475569' : '#F8FAFC' }}>{ms.title}</div>
                    {ms.due_date && <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '0.1rem' }}>Due {new Date(ms.due_date).toLocaleDateString()}</div>}
                  </div>
                  <button onClick={() => deleteMilestone(ms.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.5 }}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INVOICES */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem' }}>💰 Invoices</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input placeholder="Amount (USD)" value={invoiceAmount} onChange={e => setInvoiceAmount(e.target.value)} type="number"
                style={{ flex: 1, minWidth: '130px', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              <input type="date" value={invoiceDue} onChange={e => setInvoiceDue(e.target.value)}
                style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.9rem', outline: 'none' }} />
              <button onClick={addInvoice} disabled={addingInvoice || !invoiceAmount} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', opacity: !invoiceAmount ? 0.5 : 1 }}>
                {addingInvoice ? 'Adding...' : '+ Add'}
              </button>
            </div>
            <input placeholder="Payment instructions (e.g. Pay via UPI: 9999@upi or PayPal: you@email.com)" value={invoiceNote} onChange={e => setInvoiceNote(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' as const }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          </div>
          {invoices.length === 0 ? (
            <p style={{ color: '#475569', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No invoices yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {invoices.map(inv => (
                <div key={inv.id} style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: inv.note ? '0.75rem' : 0 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#4ADE80' }}>${inv.amount}</div>
                      {inv.due_date && <div style={{ color: '#475569', fontSize: '0.78rem' }}>Due {new Date(inv.due_date).toLocaleDateString()}</div>}
                    </div>
                    <button onClick={() => toggleInvoice(inv)} style={{ padding: '0.35rem 0.875rem', backgroundColor: inv.status === 'paid' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${inv.status === 'paid' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`, color: inv.status === 'paid' ? '#4ADE80' : '#EF4444', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
                      {inv.status === 'paid' ? '✓ Paid' : '✗ Unpaid'}
                    </button>
                    <button onClick={() => deleteInvoice(inv.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.5 }}>🗑</button>
                  </div>
                  {inv.note && (
                    <div style={{ backgroundColor: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '8px', padding: '0.625rem 0.875rem', fontSize: '0.82rem', color: '#94A3B8' }}>
                      💳 {inv.note}
                    </div>
                  )}
                </div>
              ))}
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#475569', fontSize: '0.85rem' }}>Total paid</span>
                <span style={{ color: '#4ADE80', fontWeight: '800' }}>${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* FILES */}
        <FileSection projectId={id!} />

      </div>
    </div>
  )
}

function FileSection({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [linkName, setLinkName] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [addingLink, setAddingLink] = useState(false)

  const loadFiles = async () => {
    const { data } = await supabase.from('files').select('*').eq('project_id', projectId).order('created_at', { ascending: false })
    setFiles(data || [])
  }

  useEffect(() => { loadFiles() }, [projectId])

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      alert('File too large. Max 50MB. Use Add Link for bigger files via Google Drive or Dropbox.')
      return
    }
    setUploading(true)
    const fileName = `${projectId}/${Date.now()}-${file.name}`
    const { data: upload } = await supabase.storage.from('project-files').upload(fileName, file)
    if (upload) {
      const { data: urlData } = supabase.storage.from('project-files').getPublicUrl(fileName)
      await supabase.from('files').insert([{ project_id: projectId, name: file.name, url: urlData.publicUrl, size: file.size, type: 'upload' }])
      await loadFiles()
    }
    setUploading(false)
  }

  const addLink = async () => {
    if (!linkName || !linkUrl) return
    setAddingLink(true)
    let url = linkUrl
    if (!url.startsWith('http')) url = 'https://' + url
    await supabase.from('files').insert([{ project_id: projectId, name: linkName, url, size: 0, type: 'link' }])
    setLinkName(''); setLinkUrl(''); setShowLinkForm(false)
    await loadFiles()
    setAddingLink(false)
  }

  const deleteFile = async (fileId: string, url: string, type: string) => {
    if (type === 'upload') {
      const path = url.split('project-files/')[1]
      if (path) await supabase.storage.from('project-files').remove([path])
    }
    await supabase.from('files').delete().eq('id', fileId)
    await loadFiles()
  }

  const getLinkIcon = (url: string) => {
    if (url.includes('drive.google')) return '🟡'
    if (url.includes('dropbox')) return '🔵'
    if (url.includes('wetransfer')) return '🟢'
    if (url.includes('figma')) return '🎨'
    if (url.includes('notion')) return '⬛'
    return '🔗'
  }

  return (
    <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem' }}>📎 Files & Links</h2>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: showLinkForm ? '1rem' : '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'inline-block', padding: '0.7rem 1.25rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}>
          {uploading ? 'Uploading...' : '⬆ Upload File'}
          <input type="file" onChange={uploadFile} style={{ display: 'none' }} disabled={uploading} />
        </label>
        <button onClick={() => setShowLinkForm(!showLinkForm)} style={{ padding: '0.7rem 1.25rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}>
          🔗 Add Link
        </button>
        <span style={{ color: '#334155', fontSize: '0.75rem' }}>Max 50MB · Use links for Google Drive, Dropbox, Figma etc.</span>
      </div>

      {showLinkForm && (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '1rem' }}>Paste any link — Google Drive, Dropbox, WeTransfer, Figma, Notion, anything</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input placeholder="Name (e.g. Final Designs v2)" value={linkName} onChange={e => setLinkName(e.target.value)}
              style={{ flex: 1, minWidth: '160px', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.875rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <input placeholder="https://drive.google.com/..." value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
              style={{ flex: 2, minWidth: '200px', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#F8FAFC', fontSize: '0.875rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            <button onClick={addLink} disabled={addingLink || !linkName || !linkUrl} style={{ padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', opacity: !linkName || !linkUrl ? 0.5 : 1 }}>
              {addingLink ? 'Adding...' : 'Add →'}
            </button>
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <p style={{ color: '#475569', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No files or links yet</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {files.map(file => (
            <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '1.4rem' }}>{file.type === 'link' ? getLinkIcon(file.url) : '📄'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{file.name}</div>
                <div style={{ color: '#475569', fontSize: '0.75rem' }}>{file.type === 'link' ? 'External link' : `${(file.size / 1024).toFixed(1)} KB`}</div>
              </div>
              <a href={file.url} target="_blank" rel="noreferrer" style={{ padding: '0.4rem 0.9rem', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600', textDecoration: 'none' }}>
                {file.type === 'link' ? 'Open →' : 'Download'}
              </a>
              <button onClick={() => deleteFile(file.id, file.url, file.type || 'upload')} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', opacity: 0.5 }}>🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}