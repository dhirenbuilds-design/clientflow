import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>
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
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWaitlist = async () => {
    if (!email || !email.includes('@')) { setError('Please enter a valid email'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.from('waitlist').insert([{ email }])
    if (err) {
      if (err.code === '23505') setError('Already on the waitlist!')
      else setError('Something went wrong. Try again.')
    } else { setSubmitted(true) }
    setLoading(false)
  }

  return (
    <div style={{ backgroundColor: '#0F172A', color: '#F8FAFC', fontFamily: 'Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ANIMATED BG GLOW */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '600px', height: '600px', backgroundColor: '#3B82F6', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '500px', height: '500px', backgroundColor: '#8B5CF6', borderRadius: '50%', filter: 'blur(180px)', opacity: 0.05 }} />
      </div>

      {/* NAV */}
      <nav style={{
        padding: '1.25rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: scrollY > 50 ? 'rgba(15,23,42,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid #1E293B' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#3B82F6', letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
          ClientFlow
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <a href="#products" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Products</a>
          <a href="#howitworks" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>How it works</a>
          <a href="#pricing" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Pricing</a>
          <a href="#waitlist" style={{ backgroundColor: '#3B82F6', color: 'white', padding: '0.55rem 1.35rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', transition: 'background 0.2s' }}>Get Early Access</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '8rem 2rem 6rem', maxWidth: '950px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ opacity: 1, animation: 'fadeUp 0.8s ease forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '999px', padding: '0.45rem 1.1rem', fontSize: '0.8rem', color: '#3B82F6', marginBottom: '2.5rem', fontWeight: '600' }}>
            🔥 Early Bird — First 20 get Bundle Pro for $25/mo forever
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: '900', lineHeight: '1.06', marginBottom: '1.75rem', letterSpacing: '-0.04em' }}>
          Your clients deserve<br />
          <span style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            better than WhatsApp
          </span>
        </h1>

        <p style={{ color: '#94A3B8', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3.5rem', lineHeight: '1.8' }}>
          ClientFlow gives freelancers a professional client portal and onboarding system. One link. Zero confusion. Look like a $10k/month agency from day one.
        </p>

        {/* WAITLIST */}
        <div id="waitlist">
          {!submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleWaitlist()}
                  style={{ padding: '1rem 1.5rem', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#F8FAFC', fontSize: '1rem', width: '300px', outline: 'none' }}
                />
                <button onClick={handleWaitlist} disabled={loading} style={{ padding: '1rem 2.25rem', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}>
                  {loading ? 'Joining...' : 'Join Waitlist →'}
                </button>
              </div>
              {error && <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>{error}</p>}
              <p style={{ color: '#475569', fontSize: '0.82rem' }}>No spam. No credit card. Unsubscribe anytime.</p>
            </div>
          ) : (
            <div style={{ backgroundColor: '#0F2A1A', border: '1px solid #22C55E', borderRadius: '16px', padding: '2rem 3rem', display: 'inline-block' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.25rem' }}>You're in!</div>
              <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>We'll email you the moment ClientFlow launches.</div>
            </div>
          )}
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '5rem', flexWrap: 'wrap' }}>
          {[['100%', 'Free to start'], ['0', 'Client logins needed'], ['1', 'Link for everything'], ['10 min', 'To set up']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#3B82F6', letterSpacing: '-0.03em' }}>{num}</div>
              <div style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ borderTop: '1px solid #1E293B', padding: '2.5rem', textAlign: 'center', backgroundColor: '#080E1A', position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#334155', fontSize: '0.8rem', letterSpacing: '0.15em', fontWeight: '600', marginBottom: '1.5rem' }}>BUILT FOR FREELANCERS WHO ARE SERIOUS ABOUT THEIR BUSINESS</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {['Web Designers', 'Video Editors', 'Copywriters', 'Developers', 'Social Media Managers', 'Brand Strategists'].map(r => (
            <span key={r} style={{ color: '#475569', fontSize: '0.875rem', fontWeight: '500' }}>{r}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="howitworks" style={{ padding: '8rem 2rem', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <h2 style={{ textAlign: 'center', fontSize: '2.8rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.03em' }}>How it works</h2>
          <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '5rem', fontSize: '1.1rem' }}>Set up in 10 minutes. Impress clients immediately.</p>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {[
            { step: '01', title: 'Create your project or onboarding', desc: 'Add your client name, project details, milestones, or questionnaire. Takes 2 minutes.' },
            { step: '02', title: 'Send one unique link', desc: 'ClientFlow generates a secure, unique link for each client. Just copy and paste into any message.' },
            { step: '03', title: 'Your client opens it — no login needed', desc: 'They see a beautiful, professional page with everything they need. No accounts. No confusion.' },
            { step: '04', title: 'Get paid. Stay professional.', desc: 'Clients approve deliverables, sign contracts, pay deposits, and upload assets — all in one place.' },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.1}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '64px', height: '64px', backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '800', color: '#3B82F6', letterSpacing: '0.05em' }}>
                  {item.step}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{item.title}</h3>
                  <p style={{ color: '#94A3B8', lineHeight: '1.7', fontSize: '1rem' }}>{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" style={{ padding: '8rem 2rem', backgroundColor: '#080E1A', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeIn>
            <h2 style={{ textAlign: 'center', fontSize: '2.8rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Two tools. One platform.</h2>
            <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '5rem', fontSize: '1.1rem' }}>Everything you need. Nothing you don't.</p>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: '📁', tag: 'CLIENTO — CLIENT PORTAL',
                title: 'Your client always knows what\'s happening',
                desc: 'Stop answering "what\'s the update?" messages. Send one link. Client sees everything — project status, milestones, files, invoices. No login needed.',
                features: ['Real-time project status & milestones', 'File sharing & invoice management', 'One-click deliverable approval', 'Zero login required for clients', 'Custom branding on Pro plan']
              },
              {
                icon: '🚀', tag: 'ONBOARDKIT — CLIENT ONBOARDING',
                title: 'Onboard new clients in minutes, not days',
                desc: 'Stop chasing clients for contracts, payments, and brand assets. Send one link. They do everything in one sitting.',
                features: ['Contract signing & e-signature', 'Deposit collection built-in', 'Custom questionnaire forms', 'Brand asset uploads', 'Zero login required for clients']
              }
            ].map((product, i) => (
              <FadeIn key={product.tag} delay={i * 0.15}>
                <div style={{ backgroundColor: '#1E293B', border: '1px solid #1E293B', borderRadius: '24px', padding: '3rem', height: '100%', transition: 'border-color 0.3s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#3B82F6')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E293B')}>
                  <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.75rem' }}>{product.icon}</div>
                  <div style={{ color: '#3B82F6', fontWeight: '700', fontSize: '0.72rem', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>{product.tag}</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.3', letterSpacing: '-0.02em' }}>{product.title}</h3>
                  <p style={{ color: '#94A3B8', lineHeight: '1.8', marginBottom: '2rem', fontSize: '0.95rem' }}>{product.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    {product.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                        <span style={{ color: '#3B82F6', fontWeight: '900', fontSize: '1rem' }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CLIENTFLOW */}
      <section style={{ padding: '8rem 2rem', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <h2 style={{ textAlign: 'center', fontSize: '2.8rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Why freelancers love ClientFlow</h2>
          <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '5rem', fontSize: '1.1rem' }}>Built by a freelancer who got tired of looking unprofessional.</p>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '⚡', title: 'Set up in 10 minutes', desc: 'No complicated setup. Create a project, get a link, send it. That\'s it.' },
            { icon: '🔒', title: 'No client login headaches', desc: 'Clients open a link and see everything. No accounts, passwords, or app downloads.' },
            { icon: '💰', title: 'Look like a $10k agency', desc: 'Professional portals and onboarding that make clients trust you more and pay faster.' },
            { icon: '📱', title: 'Works on any device', desc: 'Your clients can access their portal from phone, tablet, or desktop. Always looks perfect.' },
            { icon: '🎨', title: 'Custom branding', desc: 'Add your logo and colors on Pro. Your clients see YOUR brand, not ClientFlow.' },
            { icon: '🚀', title: 'Built for freelancers', desc: 'Not bloated agency software. Just the tools solo freelancers actually need to win clients.' },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div style={{ backgroundColor: '#1E293B', border: '1px solid #1E293B', borderRadius: '16px', padding: '2rem', transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E293B'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '8rem 2rem', backgroundColor: '#080E1A', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeIn>
            <h2 style={{ textAlign: 'center', fontSize: '2.8rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.03em' }}>Simple, honest pricing</h2>
            <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Start free. Upgrade when you're ready.</p>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <span style={{ backgroundColor: '#1E293B', border: '1px solid #3B82F6', borderRadius: '999px', padding: '0.4rem 1.25rem', fontSize: '0.82rem', color: '#3B82F6', fontWeight: '600' }}>
                🔥 Code EARLYBIRD — Bundle Pro for $25/mo forever (first 20 customers only)
              </span>
            </div>
          </FadeIn>

          <FadeIn><h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#475569', letterSpacing: '0.1em' }}>📁 CLIENTO — CLIENT PORTAL</h3></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['1 active client', 'Basic client portal', 'Project status tracking', 'No credit card needed'], highlight: false },
              { name: 'Starter', price: '$15', period: '/month', features: ['5 active clients', 'File uploads', 'Milestone tracking', 'Invoice management', 'Email notifications'], highlight: false },
              { name: 'Pro', price: '$25', period: '/month', features: ['Unlimited clients', 'Everything in Starter', 'Custom branding', 'Priority support', 'Advanced analytics'], highlight: true },
            ].map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div style={{ backgroundColor: plan.highlight ? '#172554' : '#1E293B', border: `2px solid ${plan.highlight ? '#3B82F6' : '#334155'}`, borderRadius: '20px', padding: '2.25rem', position: 'relative', height: '100%' }}>
                  {plan.highlight && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '0.3rem 1rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ fontWeight: '700', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{plan.name}</div>
                  <div style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '0.1rem' }}>{plan.price}</div>
                  <div style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '2rem' }}>{plan.period}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: '0.6rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                        <span style={{ color: '#3B82F6', fontWeight: '700' }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn><h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#475569', letterSpacing: '0.1em' }}>🚀 ONBOARDKIT — CLIENT ONBOARDING</h3></FadeIn>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['1 active onboarding', 'Basic onboarding page', 'Client questionnaire', 'No credit card needed'], highlight: false },
              { name: 'Starter', price: '$10', period: '/month', features: ['5 active onboardings', 'Contract templates', 'Payment collection', 'Asset uploads'], highlight: false },
              { name: 'Pro', price: '$20', period: '/month', features: ['Unlimited onboardings', 'Everything in Starter', 'E-signature', 'Custom branding', 'Priority support'], highlight: true },
            ].map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div style={{ backgroundColor: plan.highlight ? '#172554' : '#1E293B', border: `2px solid ${plan.highlight ? '#3B82F6' : '#334155'}`, borderRadius: '20px', padding: '2.25rem', position: 'relative', height: '100%' }}>
                  {plan.highlight && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '0.3rem 1rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ fontWeight: '700', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{plan.name}</div>
                  <div style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '0.1rem' }}>{plan.price}</div>
                  <div style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '2rem' }}>{plan.period}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: '0.6rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                        <span style={{ color: '#3B82F6', fontWeight: '700' }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* BUNDLE */}
          <FadeIn>
            <div style={{ background: 'linear-gradient(135deg, #172554 0%, #1E1B4B 100%)', border: '2px solid #3B82F6', borderRadius: '24px', padding: '3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', backgroundColor: '#3B82F6', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />
              <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '0.35rem 1.25rem', borderRadius: '999px', marginBottom: '2rem' }}>BEST VALUE — SAVE $10/MONTH</div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Bundle Pro</h3>
              <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1rem' }}>Cliento Pro + OnboardKit Pro — everything in one</p>
              <div style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
                $35<span style={{ fontSize: '1.2rem', color: '#94A3B8', fontWeight: '400' }}>/month</span>
              </div>
              <div style={{ color: '#22C55E', fontWeight: '700', marginBottom: '2.5rem', fontSize: '1rem' }}>🔥 Early Bird: $25/mo forever with code EARLYBIRD</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'left', maxWidth: '700px', margin: '0 auto' }}>
                {['Everything in Cliento Pro', 'Everything in OnboardKit Pro', 'Save $10 every single month', 'Single unified dashboard', 'One subscription, two products', 'Priority support'].map(f => (
                  <div key={f} style={{ color: '#94A3B8', fontSize: '0.9rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#3B82F6' }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Ready to look like a pro?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', marginBottom: '3rem' }}>Join the waitlist. Be the first to know when we launch.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!submitted ? (
              <>
                <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleWaitlist()}
                  style={{ padding: '1rem 1.5rem', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1E293B', color: '#F8FAFC', fontSize: '1rem', width: '300px', outline: 'none' }} />
                <button onClick={handleWaitlist} disabled={loading}
                  style={{ padding: '1rem 2.25rem', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}>
                  {loading ? 'Joining...' : 'Get Early Access →'}
                </button>
              </>
            ) : (
              <div style={{ color: '#22C55E', fontSize: '1.1rem', fontWeight: '700' }}>🎉 You're on the list!</div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1E293B', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#3B82F6', marginBottom: '0.35rem' }}>ClientFlow</div>
            <p style={{ color: '#334155', fontSize: '0.82rem' }}>The professional client management platform for freelancers.</p>
          </div>
          <div style={{ color: '#334155', fontSize: '0.82rem', textAlign: 'right' }}>
            Made with 🔥 by <span style={{ color: '#3B82F6', fontWeight: '600' }}>Dhiren Sharma</span> · 15 · India 🇮🇳<br />
            <span style={{ fontSize: '0.75rem' }}>© 2026 ClientFlow. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  )
}