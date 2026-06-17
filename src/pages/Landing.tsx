import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(32px)', transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s` }}>
      {children}
    </div>
  )
}

export default function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleWaitlist = async () => {
    if (!email || !email.includes('@')) { setError('Enter a valid email'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.from('waitlist').insert([{ email }])
    if (err) { setError(err.code === '23505' ? 'Already on the list!' : 'Try again.') }
    else setSubmitted(true)
    setLoading(false)
  }

  const isMobile = window.innerWidth < 768

  return (
    <div style={{ backgroundColor: '#060910', color: '#F8FAFC', fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* GLOW BG */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', left: '10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '50%', right: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* NAV */}
      <nav style={{
        padding: isMobile ? '1rem 1.25rem' : '1rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: scrollY > 40 ? 'rgba(6,9,16,0.9)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(24px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.4s ease'
      }}>
        <div style={{ fontSize: '1.3rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ClientFlow
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {['Products', 'How it works', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}>
                {item}
              </a>
            ))}
          </div>
        )}
        <a href="/signup" style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', padding: '0.55rem 1.25rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
          Get started free
        </a>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: isMobile ? '5rem 1.25rem 4rem' : '9rem 2rem 6rem', maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.78rem', color: '#60A5FA', marginBottom: '2.5rem', fontWeight: '600', letterSpacing: '0.02em' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#3B82F6', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Early Bird — First 20 customers lock in $25/mo forever
        </div>

        <h1 style={{ fontSize: isMobile ? '2.6rem' : '5.5rem', fontWeight: '900', lineHeight: '1.05', letterSpacing: '-0.04em', marginBottom: '1.75rem' }}>
          Client work, finally{' '}
          <span style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            under control
          </span>
        </h1>

        <p style={{ color: '#94A3B8', fontSize: isMobile ? '1.05rem' : '1.3rem', maxWidth: '580px', margin: '0 auto 3.5rem', lineHeight: '1.8', fontWeight: '400' }}>
          One link for your client to see everything. One link to onboard them. Zero confusion. You look like a $10k/month agency from day one.
        </p>

        {/* WAITLIST */}
        <div id="waitlist" style={{ maxWidth: '480px', margin: '0 auto' }}>
          {!submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleWaitlist()}
                style={{ padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#F8FAFC', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const, backdropFilter: 'blur(10px)' }}
              />
              <button onClick={handleWaitlist} disabled={loading}
                style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 0 40px rgba(99,102,241,0.4)', width: '100%', transition: 'opacity 0.2s' }}>
                {loading ? 'Joining...' : 'Join the waitlist →'}
              </button>
              {error && <p style={{ color: '#EF4444', fontSize: '0.82rem', margin: 0 }}>{error}</p>}
              <p style={{ color: '#475569', fontSize: '0.78rem', margin: 0 }}>Free to join. No credit card. Unsubscribe anytime.</p>
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.1))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.25rem' }}>You're in!</div>
              <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>We'll email you the moment ClientFlow launches.</div>
            </div>
          )}
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '2rem' : '5rem', marginTop: '5rem', flexWrap: 'wrap' }}>
          {[['Zero', 'Client logins needed'], ['1 link', 'For everything'], ['10 min', 'To set up'], ['100%', 'Free to start']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
              <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem 0', overflow: 'hidden', position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', gap: '4rem', color: '#334155', fontSize: '0.82rem', fontWeight: '600', letterSpacing: '0.12em', whiteSpace: 'nowrap', animation: 'none', justifyContent: 'center', flexWrap: 'wrap', padding: '0 2rem' }}>
          {['WEB DESIGNERS', 'VIDEO EDITORS', 'COPYWRITERS', 'DEVELOPERS', 'BRAND STRATEGISTS', 'SOCIAL MEDIA MANAGERS', 'PHOTOGRAPHERS', 'UI/UX DESIGNERS'].map(r => (
            <span key={r}>{r}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{ padding: isMobile ? '5rem 1.25rem' : '9rem 2rem', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ color: '#6366F1', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.15em', marginBottom: '1rem' }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Up and running in 10 minutes</h2>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>No complicated setup. No tutorials. Just results.</p>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { n: '01', t: 'Create your project or onboarding', d: 'Add client name, project details, milestones, or questionnaire. Takes 2 minutes.' },
            { n: '02', t: 'Get a unique link instantly', d: 'ClientFlow generates a secure link for your client. Copy it, paste it anywhere.' },
            { n: '03', t: 'Client opens it — no login needed', d: 'They see a beautiful, professional page. No accounts. No confusion. No friction.' },
            { n: '04', t: 'Get paid. Stay professional.', d: 'Clients approve deliverables, sign contracts, pay deposits, upload assets. All in one.' },
          ].map((item, i) => (
            <Reveal key={item.n} delay={i * 0.1}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', transition: 'border-color 0.3s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}>
                <div style={{ minWidth: '48px', height: '48px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: '800', color: '#6366F1' }}>{item.n}</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>{item.t}</h3>
                  <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>{item.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" style={{ padding: isMobile ? '5rem 1.25rem' : '9rem 2rem', backgroundColor: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <div style={{ color: '#6366F1', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.15em', marginBottom: '1rem' }}>THE PRODUCTS</div>
              <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Two tools. One platform.</h2>
              <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>Everything you need. Nothing you don't.</p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {[
              {
                icon: '📁', tag: 'CLIENTO', color: '#3B82F6',
                title: 'Client Portal Tool',
                desc: 'Stop answering "what\'s the update?" forever. Send one link. Your client sees project status, milestones, files, and invoices — no login needed.',
                features: ['Real-time project & milestone tracking', 'File sharing & invoice management', 'One-click deliverable approval', 'Zero client login required', 'Custom branding on Pro']
              },
              {
                icon: '🚀', tag: 'ONBOARDKIT', color: '#8B5CF6',
                title: 'Client Onboarding Tool',
                desc: 'Stop chasing clients for contracts and payments. One link to sign, pay, fill questionnaire, and upload brand assets. Done in minutes.',
                features: ['Contract signing & e-signature', 'Deposit collection built-in', 'Custom questionnaire forms', 'Brand asset uploads', 'Zero client login required']
              }
            ].map((p, i) => (
              <Reveal key={p.tag} delay={i * 0.15}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '2.5rem', height: '100%', boxSizing: 'border-box' as const, transition: 'border-color 0.3s, transform 0.3s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}40`; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div style={{ width: '56px', height: '56px', background: `linear-gradient(135deg, ${p.color}20, ${p.color}10)`, border: `1px solid ${p.color}30`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{p.icon}</div>
                  <div style={{ color: p.color, fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>{p.tag}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{p.title}</h3>
                  <p style={{ color: '#64748B', lineHeight: '1.8', marginBottom: '2rem', fontSize: '0.95rem' }}>{p.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: '0.75rem', color: '#94A3B8', fontSize: '0.875rem', alignItems: 'center' }}>
                        <span style={{ color: p.color, fontSize: '0.75rem', fontWeight: '900' }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: isMobile ? '5rem 1.25rem' : '9rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ color: '#6366F1', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.15em', marginBottom: '1rem' }}>WHY CLIENTFLOW</div>
            <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Built for how freelancers actually work</h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { icon: '⚡', t: 'Set up in 10 minutes', d: 'Create a project, get a link, send it. No complicated setup. No tutorials needed.' },
            { icon: '🔒', t: 'No client login ever', d: 'Clients just open a link. No passwords, no accounts, no friction. They love it.' },
            { icon: '💰', t: 'Look like a $10k agency', d: 'Professional portals make clients trust you more and pay faster.' },
            { icon: '📱', t: 'Works on any device', d: 'Clients can view on phone, tablet, or desktop. Always looks perfect.' },
            { icon: '🎨', t: 'Your brand, not ours', d: 'Add your logo and colors on Pro. Clients see your brand everywhere.' },
            { icon: '🚀', t: 'Built for solo freelancers', d: 'Not bloated agency software. Just the tools you actually need.' },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 0.06}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.75rem', transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem' }}>{item.t}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.7', margin: 0 }}>{item.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: isMobile ? '5rem 1.25rem' : '9rem 2rem', backgroundColor: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <div style={{ color: '#6366F1', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.15em', marginBottom: '1rem' }}>PRICING</div>
              <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Start free. Scale when ready.</h2>
              <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', padding: '0.4rem 1.25rem', fontSize: '0.82rem', color: '#818CF8', fontWeight: '600' }}>
                🔥 Code EARLYBIRD — Bundle Pro $25/mo forever (first 20 only)
              </div>
            </div>
          </Reveal>

          <Reveal><p style={{ color: '#475569', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>📁 CLIENTO — CLIENT PORTAL</p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['1 active client', 'Basic client portal', 'Project status', 'No credit card'], hot: false },
              { name: 'Starter', price: '$15', period: '/month', features: ['5 active clients', 'File uploads', 'Milestone tracking', 'Invoice management', ], hot: false },
              { name: 'Pro', price: '$25', period: '/month', features: ['Unlimited clients', 'Everything in Starter', 'Custom branding', 'Priority support', 'Analytics'], hot: true },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div style={{ backgroundColor: plan.hot ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${plan.hot ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '20px', padding: '2rem', position: 'relative' }}>
                  {plan.hot && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', fontSize: '0.68rem', fontWeight: '700', padding: '0.25rem 0.875rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.75rem' }}>{plan.name}</div>
                  <div style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.04em' }}>{plan.price}</div>
                  <div style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '1.75rem' }}>{plan.period}</div>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '0.6rem', color: '#64748B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#3B82F6' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal><p style={{ color: '#475569', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>🚀 ONBOARDKIT — CLIENT ONBOARDING</p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['1 active onboarding', 'Basic onboarding page', 'Client questionnaire', 'No credit card'], hot: false },
              { name: 'Starter', price: '$10', period: '/month', features: ['5 active onboardings', 'Contract templates', 'Payment collection', 'Asset uploads'], hot: false },
              { name: 'Pro', price: '$20', period: '/month', features: ['Unlimited onboardings', 'Everything in Starter', 'E-signature', 'Custom branding', 'Priority support'], hot: true },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.1}>
                <div style={{ backgroundColor: plan.hot ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${plan.hot ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '20px', padding: '2rem', position: 'relative' }}>
                  {plan.hot && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', color: 'white', fontSize: '0.68rem', fontWeight: '700', padding: '0.25rem 0.875rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.75rem' }}>{plan.name}</div>
                  <div style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.04em' }}>{plan.price}</div>
                  <div style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '1.75rem' }}>{plan.period}</div>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '0.6rem', color: '#64748B', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#8B5CF6' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          {/* BUNDLE */}
          <Reveal>
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '24px', padding: isMobile ? '2.5rem 1.5rem' : '3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)', borderRadius: '50%' }} />
              <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', fontSize: '0.72rem', fontWeight: '700', padding: '0.3rem 1.25rem', borderRadius: '999px', marginBottom: '2rem' }}>BEST VALUE — SAVE $10/MONTH</div>
              <h3 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Bundle Pro</h3>
              <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>Cliento Pro + OnboardKit Pro</p>
              <div style={{ fontSize: isMobile ? '3rem' : '4rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                $35<span style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: '400' }}>/month</span>
              </div>
              <div style={{ color: '#4ADE80', fontWeight: '700', marginBottom: '2.5rem', fontSize: '0.95rem' }}>🔥 Early Bird: $25/mo with code EARLYBIRD</div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '0.75rem', maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
                {['Everything in Cliento Pro', 'Everything in OnboardKit Pro', 'Save $10 every month', 'Single dashboard', 'One subscription', 'Priority support'].map(f => (
                  <div key={f} style={{ color: '#94A3B8', fontSize: '0.875rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#6366F1' }}>✓</span>{f}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: isMobile ? '5rem 1.25rem' : '9rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Reveal>
          <h2 style={{ fontSize: isMobile ? '2.2rem' : '3.5rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            Ready to look like a pro?
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '3rem' }}>Join the waitlist. Be first when we launch.</p>
          <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!submitted ? (
              <>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#F8FAFC', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const }} />
                <button onClick={handleWaitlist} disabled={loading}
                  style={{ padding: '1rem', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 0 40px rgba(99,102,241,0.35)', width: '100%' }}>
                  {loading ? 'Joining...' : 'Get early access →'}
                </button>
              </>
            ) : (
              <div style={{ color: '#4ADE80', fontSize: '1.1rem', fontWeight: '700' }}>🎉 You're on the list!</div>
            )}
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: isMobile ? '2rem 1.25rem' : '3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.25rem' }}>ClientFlow</div>
            <p style={{ color: '#334155', fontSize: '0.8rem', margin: 0 }}>Professional client management for freelancers.</p>
          </div>
          <div style={{ color: '#1E293B', fontSize: '0.78rem', textAlign: 'right' as const }}>
            Made with 🔥 by <span style={{ color: '#6366F1', fontWeight: '600' }}>Dhiren Sharma</span> · 15 · India 🇮🇳<br />
            <span>© 2026 ClientFlow. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  )
}