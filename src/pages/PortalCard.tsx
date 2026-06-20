function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246'
}

type PortalCardProps = {
  brandColor: string
  brandSecondary: string
  logoUrl: string
  businessName: string
  theme: 'light' | 'dark'
  isPro?: boolean
  projectTitle?: string
  clientName?: string
  status?: string
  milestoneLabel?: string
  milestoneNote?: string
  invoiceLabel?: string
  invoicePrice?: string
  onApprove?: () => void
  onRequestRevision?: () => void
  onViewInvoice?: () => void
}

export default function PortalCard({
  brandColor,
  brandSecondary,
  logoUrl,
  businessName,
  theme,
  isPro = true,
  projectTitle = 'Website Redesign',
  clientName = 'Your Client',
  status = 'ACTIVE',
  milestoneLabel = 'Milestone 2 of 4 · Due Jun 30',
  milestoneNote = 'Home page and about page designs attached for your review.',
  invoiceLabel = 'Invoice #001',
  invoicePrice = '$1,500 · Pending',
  onApprove,
  onRequestRevision,
  onViewInvoice,
}: PortalCardProps) {
  const isLight = theme === 'light'
  const rgb = hexToRgb(brandColor)

  const colors = isLight
    ? {
        cardBg: '#ffffff',
        cardBorder: 'rgba(20,20,30,0.06)',
        text: '#15161a',
        textMuted: '#6b6f76',
        innerBg: '#fafafb',
        innerBorder: 'rgba(20,20,30,0.05)',
        shadow: `0 1px 2px rgba(20,20,30,0.04), 0 12px 32px -8px rgba(20,20,30,0.10), 0 2px 8px -2px rgba(${rgb}, 0.08)`,
      }
    : {
        cardBg: 'rgba(255,255,255,0.025)',
        cardBorder: 'rgba(255,255,255,0.07)',
        text: '#F8FAFC',
        textMuted: '#7A8699',
        innerBg: 'rgba(255,255,255,0.025)',
        innerBorder: 'rgba(255,255,255,0.05)',
        shadow: '0 1px 2px rgba(0,0,0,0.2), 0 16px 40px -8px rgba(0,0,0,0.5)',
      }

  return (
    <div
      style={{
        background: colors.cardBg,
        borderRadius: '20px',
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: colors.shadow,
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${brandSecondary} 100%)`,
          padding: '28px 28px 30px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-60%',
            right: '-10%',
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
          {logoUrl ? (
            <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: '12px', padding: '6px', backdropFilter: 'blur(8px)' }}>
              <img src={logoUrl} alt="Logo" style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
            </div>
          ) : (
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '18px', letterSpacing: '-0.02em' }}>
              {businessName ? businessName[0].toUpperCase() : '?'}
            </div>
          )}
          <div>
            <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px', letterSpacing: '-0.01em' }}>
              {businessName || 'Your Business Name'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: '12px', fontWeight: '500', marginTop: '1px' }}>Client Portal</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px' }}>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: isLight ? `rgba(${rgb}, 0.09)` : `rgba(${rgb}, 0.14)`,
            color: brandColor,
            padding: '5px 12px 5px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.04em',
            marginBottom: '16px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: brandColor, display: 'inline-block' }} />
          {status?.toUpperCase()}
        </div>

        <h2 style={{ color: colors.text, fontSize: '22px', fontWeight: 750 as any, letterSpacing: '-0.02em', margin: '0 0 5px', lineHeight: 1.2 }}>
          {projectTitle}
        </h2>
        <p style={{ color: colors.textMuted, fontSize: '13px', margin: '0 0 22px', fontWeight: 450 as any }}>
          Prepared for <span style={{ fontWeight: 650 as any, color: isLight ? '#3a3d44' : '#C2C9D6' }}>{clientName}</span>
        </p>

        <div
          style={{
            background: colors.innerBg,
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '14px',
            border: `1px solid ${colors.innerBorder}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '15px' }}>🎯</span>
            <div style={{ fontWeight: 650 as any, color: colors.text, fontSize: '14.5px', letterSpacing: '-0.005em' }}>{projectTitle}</div>
          </div>
          <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '14px', marginLeft: '23px', fontWeight: 500 as any }}>{milestoneLabel}</div>
          <div
            style={{
              background: isLight ? '#ffffff' : 'rgba(255,255,255,0.025)',
              border: `1px solid ${colors.innerBorder}`,
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '16px',
              fontSize: '13px',
              color: colors.textMuted,
              lineHeight: 1.5,
            }}
          >
            {milestoneNote}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onApprove}
              style={{
                background: `linear-gradient(135deg, ${brandColor}, ${brandSecondary})`,
                color: '#fff',
                padding: '9px 18px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 650 as any,
                border: 'none',
                cursor: onApprove ? 'pointer' : 'default',
                boxShadow: `0 4px 12px -2px rgba(${rgb}, 0.4)`,
                letterSpacing: '-0.005em',
              }}
            >
              ✓ Approve
            </button>
            <button
              onClick={onRequestRevision}
              style={{
                border: `1.5px solid ${isLight ? 'rgba(20,20,30,0.12)' : 'rgba(255,255,255,0.14)'}`,
                color: colors.text,
                padding: '9px 18px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 650 as any,
                background: 'transparent',
                cursor: onRequestRevision ? 'pointer' : 'default',
                letterSpacing: '-0.005em',
              }}
            >
              Request Revision
            </button>
          </div>
        </div>

        <div
          style={{
            background: colors.innerBg,
            borderRadius: '14px',
            padding: '16px 18px',
            border: `1px solid ${colors.innerBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 650 as any, color: colors.text, fontSize: '13.5px', letterSpacing: '-0.005em' }}>{invoiceLabel}</div>
            <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '2px', fontWeight: 500 as any }}>{invoicePrice}</div>
          </div>
          <button
            onClick={onViewInvoice}
            style={{
              background: isLight ? '#ffffff' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isLight ? 'rgba(20,20,30,0.1)' : 'rgba(255,255,255,0.1)'}`,
              color: brandColor,
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 650 as any,
              cursor: onViewInvoice ? 'pointer' : 'default',
            }}
          >
            View
          </button>
        </div>

      </div>
    </div>
  )
}