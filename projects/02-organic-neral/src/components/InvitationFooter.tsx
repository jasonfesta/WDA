import React from 'react';

interface InvitationFooterProps {
  onCreateWorkspace: () => void;
  onOpenDoc: (topic: string) => void;
}

export const InvitationFooter: React.FC<InvitationFooterProps> = ({
  onCreateWorkspace,
  onOpenDoc,
}) => {
  return (
    <>
      {/* Pale Warm-Gray Invitation Band with fine vertical divider */}
      <section
        style={{
          backgroundColor: '#F3F2EE',
          borderTop: '1px solid var(--rule-base)',
          borderBottom: '1px solid var(--rule-base)',
          padding: '60px 24px',
        }}
        className="invitation-band"
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 440px) 1px 1fr auto',
            gap: '40px',
            alignItems: 'center',
          }}
          className="invitation-grid"
        >
          {/* Left Headline */}
          <h2
            style={{
              fontSize: 'clamp(28px, 3.2vw, 38px)',
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: 'var(--ink-primary)',
            }}
          >
            Bring your next evaluation<br />into focus.
          </h2>

          {/* Thin vertical rule */}
          <div
            style={{
              height: '56px',
              backgroundColor: 'var(--rule-base)',
            }}
            className="invitation-divider"
          />

          {/* Right Serif Subtext */}
          <p
            className="font-serif"
            style={{
              fontSize: '20px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.45,
            }}
          >
            Start with a dataset and a question.
          </p>

          {/* Right Button */}
          <button
            onClick={onCreateWorkspace}
            style={{
              backgroundColor: 'var(--ink-primary)',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 400,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#151515')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ink-primary)')}
          >
            <span>Create a workspace</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* Complete Custom Minimal Footer */}
      <footer
        style={{
          backgroundColor: 'var(--bg-canvas)',
          padding: '52px 24px 44px 24px',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Top Row: NERAL left, "Evidence, shared." below it; right Contact the team → */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: 'var(--ink-primary)',
                  marginBottom: '2px',
                }}
              >
                NERAL
              </div>
              <div
                className="font-serif"
                style={{
                  fontSize: '13.5px',
                  color: 'var(--ink-secondary)',
                }}
              >
                Evidence, shared.
              </div>
            </div>

            <div>
              <a
                href="mailto:inquiries@neral.eval"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Contact Neral team: inquiries@neral.eval');
                }}
                style={{
                  fontSize: '14px',
                  color: 'var(--ink-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Contact the team</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Fine Divider */}
          <div
            style={{
              height: '1px',
              backgroundColor: 'var(--rule-light)',
              marginBottom: '28px',
            }}
          />

          {/* Final Single Utility Row: Documentation, Privacy, Security, Status left; ©2026 NERAL right */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '13px',
              color: 'var(--ink-secondary)',
            }}
            className="footer-bottom-row"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="footer-links">
              <button
                onClick={() => onOpenDoc('Documentation')}
                style={{ color: 'var(--ink-secondary)', fontSize: '13px' }}
              >
                Documentation
              </button>
              <button
                onClick={() => onOpenDoc('Privacy')}
                style={{ color: 'var(--ink-secondary)', fontSize: '13px' }}
              >
                Privacy
              </button>
              <button
                onClick={() => onOpenDoc('Security')}
                style={{ color: 'var(--ink-secondary)', fontSize: '13px' }}
              >
                Security
              </button>
              <button
                onClick={() => onOpenDoc('Status')}
                style={{ color: 'var(--ink-secondary)', fontSize: '13px' }}
              >
                Status
              </button>
            </div>

            <div className="font-mono" style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>
              ©2026 NERAL
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .invitation-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .invitation-divider {
            display: none !important;
          }
        }
        @media (max-width: 540px) {
          .footer-bottom-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .footer-links {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px 24px !important;
          }
        }
      `}</style>
    </>
  );
};
