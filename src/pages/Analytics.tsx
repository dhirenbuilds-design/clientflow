import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Analytics() {
  const [projects, setProjects] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }

      const { data: proj } = await supabase.from('projects').select('*').eq('user_id', user.id)
      const { data: inv } = await supabase.from('invoices').select('*').eq('user_id', user.id)
      const { data: ms } = await supabase.from('milestones').select('*')

      setProjects(proj || [])
      setInvoices(inv || [])
      setMilestones(ms || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ color: '#334155', fontSize: '0.9rem' }}>Loading analytics...</div>
    </div>
  )

  // ── Calculations ──
  const totalProjects = projects.length
  const approved = projects.filter(p => p.approval_status === 'approved').length
  const revisions = projects.filter(p => p.approval_status === 'revision').length
  const pending = projects.filter(p => !p.approval_status || p.approval_status === 'pending').length
  const approvalRate = totalProjects > 0 ? Math.round((approved / totalProjects) * 100) : 0

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0)
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0)
  const totalUnpaid = totalInvoiced - totalPaid

  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const milestoneRate = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0

  // Projects per month (last 6 months)
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const label = d.toLocaleString('default', { month: 'short' })
    const count = projects.filter(p => {
      const created = new Date(p.created_at)
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear()
    }).length
    return { label, count }
  })
  const maxMonthly = Math.max(...monthlyData.map(m => m.count), 1)

  // Approval breakdown bar widths
  const approvedPct = totalProjects > 0 ? (approved / totalProjects) * 100 : 0
  const revisionPct = totalProjects > 0 ? (revisions / totalProjects) * 100 : 0
  const pendingPct = totalProjects > 0 ? (pending / totalProjects) * 100 : 0

  return (
    <div style={{ backgroundColor: '#060910', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#F8FAFC' }}>

      {/* GLOW */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '30%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* NAV */}
      <nav style={{ padding: isMobile ? '1rem 1.25rem' : '1rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, backgroundColor: 'rgba(6,9,16,0.9)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ fontSize: '1.2rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ClientFlow</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.45rem 1rem', backgroundColor: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}>
            ← Dashboard
          </button>
        </div>
      </nav>

      <div style={{ padding: isMobile ? '2rem 1.25rem' : '3rem 2.5rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Analytics 📊</h1>
          <p style={{ color: '#475569', fontSize: '0.95rem' }}>Your ClientFlow performance at a glance</p>
        </div>

        {/* TOP STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Projects', value: totalProjects, color: '#3B82F6', icon: '📁', sub: `${pending} pending` },
            { label: 'Approval Rate', value: `${approvalRate}%`, color: '#22C55E', icon: '✅', sub: `${approved} approved` },
            { label: 'Total Invoiced', value: `$${totalInvoiced.toLocaleString()}`, color: '#F59E0B', icon: '💰', sub: `$${totalPaid.toLocaleString()} paid` },
            { label: 'Milestones Done', value: `${milestoneRate}%`, color: '#8B5CF6', icon: '🎯', sub: `${completedMilestones} of ${milestones.length}` },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
              <div style={{ fontSize: isMobile ? '1.4rem' : '1.9rem', fontWeight: '900', color: stat.color, letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>{stat.value}</div>
              <div style={{ color: '#475569', fontSize: '0.78rem', fontWeight: '600', marginBottom: '0.25rem' }}>{stat.label}</div>
              <div style={{ color: '#334155', fontSize: '0.72rem' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

          {/* PROJECTS PER MONTH */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1.75rem' }}>PROJECTS PER MONTH</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px' }}>
              {monthlyData.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.65rem', color: '#475569', fontWeight: '700' }}>{m.count > 0 ? m.count : ''}</div>
                  <div style={{
                    width: '100%',
                    height: m.count === 0 ? '4px' : `${Math.max((m.count / maxMonthly) * 100, 8)}px`,
                    background: i === 5 ? 'linear-gradient(180deg, #3B82F6, #6366F1)' : 'rgba(255,255,255,0.06)',
                    borderRadius: '6px 6px 0 0',
                    border: i === 5 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                    transition: 'height 0.3s ease'
                  }} />
                  <div style={{ fontSize: '0.65rem', color: '#334155', fontWeight: '600' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* APPROVAL BREAKDOWN */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1.75rem' }}>APPROVAL BREAKDOWN</h3>
            {totalProjects === 0 ? (
              <div style={{ color: '#334155', fontSize: '0.85rem', textAlign: 'center', paddingTop: '2rem' }}>No projects yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[
                  { label: 'Approved', pct: approvedPct, count: approved, color: '#22C55E' },
                  { label: 'Revision', pct: revisionPct, count: revisions, color: '#F59E0B' },
                  { label: 'Pending', pct: pendingPct, count: pending, color: '#475569' },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: '600' }}>{row.label}</span>
                      <span style={{ fontSize: '0.82rem', color: row.color, fontWeight: '700' }}>{row.count} ({Math.round(row.pct)}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${row.pct}%`, backgroundColor: row.color, borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>

          {/* INVOICE SUMMARY */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1.75rem' }}>INVOICE SUMMARY</h3>
            {invoices.length === 0 ? (
              <div style={{ color: '#334155', fontSize: '0.85rem', textAlign: 'center', paddingTop: '2rem' }}>No invoices yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Total Invoiced', value: `$${totalInvoiced.toLocaleString()}`, color: '#F8FAFC' },
                  { label: 'Paid', value: `$${totalPaid.toLocaleString()}`, color: '#22C55E' },
                  { label: 'Outstanding', value: `$${totalUnpaid.toLocaleString()}`, color: '#F59E0B' },
                  { label: 'Total Invoices', value: invoices.length, color: '#60A5FA' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#475569', fontSize: '0.88rem' }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: '800', fontSize: '0.95rem' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT ACTIVITY */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', letterSpacing: '0.1em', marginBottom: '1.75rem' }}>RECENT PROJECTS</h3>
            {projects.length === 0 ? (
              <div style={{ color: '#334155', fontSize: '0.85rem', textAlign: 'center', paddingTop: '2rem' }}>No projects yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {projects.slice(0, 5).map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.88rem', marginBottom: '0.1rem' }}>{p.title}</div>
                      <div style={{ color: '#475569', fontSize: '0.75rem' }}>{p.client_name}</div>
                    </div>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '999px',
                      backgroundColor: p.approval_status === 'approved' ? 'rgba(34,197,94,0.1)' : p.approval_status === 'revision' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                      color: p.approval_status === 'approved' ? '#4ADE80' : p.approval_status === 'revision' ? '#FCD34D' : '#60A5FA',
                      border: `1px solid ${p.approval_status === 'approved' ? 'rgba(34,197,94,0.2)' : p.approval_status === 'revision' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'}`
                    }}>
                      {p.approval_status || p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}