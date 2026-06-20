import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'
import PortalCard from './PortalCard'

const COLOR_THEMES = [
  { name: 'Ocean Blue',      primary: '#3B82F6', secondary: '#1D4ED8', emoji: '🌊' },
  { name: 'Forest Green',    primary: '#10B981', secondary: '#065F46', emoji: '🌿' },
  { name: 'Midnight Purple', primary: '#8B5CF6', secondary: '#4C1D95', emoji: '🌙' },
  { name: 'Sunset Orange',   primary: '#F59E0B', secondary: '#B45309', emoji: '🌅' },
  { name: 'Rose Pink',       primary: '#EC4899', secondary: '#9D174D', emoji: '🌸' },
]

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246'
}

export default function Branding() {
  const [profile, setProfile]           = useState<any>(null)
  const [logoUrl, setLogoUrl]           = useState('')
  const [brandColor, setBrandColor]     = useState('#3B82F6')
  const [brandSecondary, setBrandSecondary] = useState('#1D4ED8')
  const [businessName, setBusinessName] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<number | null>(0)
  const [portalTheme, setPortalTheme]   = useState<'light' | 'dark'>('dark')
  const [uploading, setUploading]       = useState(false)
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)
  const [loading, setLoading]           = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (data) {
      setProfile(data)
      setLogoUrl(data.logo_url || '')
      setBrandColor(data.brand_color || '#3B82F6')
      setBrandSecondary(data.brand_secondary || '#1D4ED8')
      setBusinessName(data.business_name || data.full_name || '')
      setPortalTheme(data.portal_theme === 'light' ? 'light' : 'dark')
    }
    setLoading(false)
  }

  async function uploadLogo(file: File) {
    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setUploading(false); return }
    const ext = file.name.split('.').pop()
    const path = `${user.id}/logo.${ext}`
    const { error } = await supabase.storage
      .from('logos')
      .upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('logos').getPublicUrl(path)
      setLogoUrl(data.publicUrl)
    }
    setUploading(false)
  }

  function pickTheme(index: number) {
    setSelectedTheme(index)
    setBrandColor(COLOR_THEMES[index].primary)
    setBrandSecondary(COLOR_THEMES[index].secondary)
  }

  async function saveBranding() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { error } = await supabase.from('profiles').update({
      logo_url: logoUrl,
      brand_color: brandColor,
      brand_secondary: brandSecondary,
      business_name: businessName,
      portal_theme: portalTheme,
    }).eq('user_id', user.id)
    setSaving(false)
    if (error) {
      alert('Save failed: ' + error.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>Loading...</p>
      </div>
    )
  }

  if (profile?.plan !== 'pro') {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '60px', textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '52px', marginBottom: '20px' }}>✨</div>
          <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Custom Branding is Pro only</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', marginBottom: '32px' }}>
            Upgrade to Pro to white-label your client portal — your logo, your colors, zero ClientFlow branding.
          </p>
          <a href="/pricing" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
            Upgrade to Pro →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Inter, sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Custom Branding</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>Your clients will see your brand, not ClientFlow's. Customize everything below.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <label style={{ color: '#fff', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '12px' }}>
                Business Name
              </label>
              <input
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Dhiren Studio"
                style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>
                Appears in the browser tab and portal header your client sees
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <label style={{ color: '#fff', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '12px' }}>
                Your Logo
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `2px dashed ${logoUrl ? brandColor : 'rgba(255,255,255,0.15)'}`, borderRadius: '12px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
              >
                {uploading ? (
                  <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Uploading...</p>
                ) : logoUrl ? (
                  <img src={logoUrl} alt="Your logo" style={{ maxHeight: '80px', maxWidth: '220px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>🖼️</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 4px' }}>Click to upload your logo</p>
                    <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', margin: 0 }}>PNG, JPG or SVG · max 2MB</p>
                  </>
                )}
              </div>
              {logoUrl && (
                <button
                  onClick={() => setLogoUrl('')}
                  style={{ marginTop: '10px', background: 'transparent', border: '1px solid rgba(255,80,80,0.35)', color: '#ff6060', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Remove logo
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <label style={{ color: '#fff', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '16px' }}>
                Color Theme
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                {COLOR_THEMES.map((theme, i) => (
                  <div
                    key={i}
                    onClick={() => pickTheme(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                      border: selectedTheme === i ? `2px solid ${theme.primary}` : '2px solid transparent',
                      background: selectedTheme === i ? `rgba(${hexToRgb(theme.primary)}, 0.12)` : 'rgba(255,255,255,0.04)',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: theme.primary }} />
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: theme.secondary }} />
                    </div>
                    <span style={{ color: '#fff', fontSize: '14px' }}>{theme.emoji} {theme.name}</span>
                    {selectedTheme === i && (
                      <span style={{ marginLeft: 'auto', color: theme.primary, fontWeight: '700' }}>✓</span>
                    )}
                  </div>
                ))}

                <div
                  onClick={() => setSelectedTheme(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    border: selectedTheme === null ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent',
                    background: 'rgba(255,255,255,0.04)',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={brandColor}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { setBrandColor(e.target.value); setSelectedTheme(null) }}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: 'none' }}
                    />
                    <input
                      type="color"
                      value={brandSecondary}
                      onClick={e => e.stopPropagation()}
                      onChange={e => { setBrandSecondary(e.target.value); setSelectedTheme(null) }}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: 'none' }}
                    />
                  </div>
                  <span style={{ color: '#fff', fontSize: '14px' }}>🎨 Custom colors</span>
                  <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>click swatches</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <label style={{ color: '#fff', fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                Portal Appearance
              </label>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: 0, marginBottom: '16px' }}>
                Choose the background style your client's portal uses.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  onClick={() => setPortalTheme('light')}
                  style={{
                    flex: 1, cursor: 'pointer', borderRadius: '12px',
                    border: portalTheme === 'light' ? `2px solid ${brandColor}` : '2px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden', background: '#f5f6fa'
                  }}
                >
                  <div style={{ height: '60px', background: `linear-gradient(135deg, ${brandColor}, ${brandSecondary})` }} />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ height: '8px', width: '70%', background: '#ddd', borderRadius: '4px', marginBottom: '6px' }} />
                    <div style={{ height: '8px', width: '40%', background: '#eee', borderRadius: '4px' }} />
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px 0', fontSize: '12px', fontWeight: '700', color: portalTheme === 'light' ? brandColor : '#888', background: portalTheme === 'light' ? 'rgba(0,0,0,0.03)' : 'transparent' }}>
                    {portalTheme === 'light' && '✓ '}☀️ Light
                  </div>
                </div>

                <div
                  onClick={() => setPortalTheme('dark')}
                  style={{
                    flex: 1, cursor: 'pointer', borderRadius: '12px',
                    border: portalTheme === 'dark' ? `2px solid ${brandColor}` : '2px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden', background: '#0a0d14'
                  }}
                >
                  <div style={{ height: '60px', background: `linear-gradient(135deg, ${brandColor}22, ${brandSecondary}22)`, borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ height: '8px', width: '70%', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', marginBottom: '6px' }} />
                    <div style={{ height: '8px', width: '40%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px 0', fontSize: '12px', fontWeight: '700', color: portalTheme === 'dark' ? brandColor : 'rgba(255,255,255,0.4)', background: portalTheme === 'dark' ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
                    {portalTheme === 'dark' && '✓ '}🌙 Dark
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={saveBranding}
              disabled={saving}
              style={{
                background: saving ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${brandColor}, ${brandSecondary})`,
                color: '#fff', border: 'none', padding: '16px', borderRadius: '12px',
                fontSize: '16px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s', letterSpacing: '0.01em'
              }}
            >
              {saving ? 'Saving...' : saved ? '✓ Branding Saved!' : 'Save Branding'}
            </button>
          </div>

          {/* ── RIGHT: Live Preview — now uses the SAME PortalCard component as the real portal ── */}
          <div style={{ position: 'sticky', top: '40px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px', marginTop: 0 }}>
              ⚡ Live Preview — exactly what your client sees ({portalTheme === 'light' ? 'Light' : 'Dark'} mode)
            </p>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

              <div style={{ background: '#2a2a3a', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', padding: '4px 12px', marginLeft: '8px', flex: 1, color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                  clientflow.space/portal/abc123
                </div>
              </div>

              <PortalCard
                brandColor={brandColor}
                brandSecondary={brandSecondary}
                logoUrl={logoUrl}
                businessName={businessName}
                theme={portalTheme}
                isPro={true}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}