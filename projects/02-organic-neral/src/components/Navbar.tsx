import React, { useState } from 'react';

interface NavbarProps {
  activeTab: 'marketing' | 'workspace' | 'component';
  onSelectTab: (tab: 'marketing' | 'workspace' | 'component') => void;
  scrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Brand NERAL wordmark */}
        <button
          onClick={() => onSelectTab('marketing')}
          style={{
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: 'var(--ink-primary)',
          }}
        >
          NERAL
        </button>

        {/* Center: Platform, Method, Security */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav-links"
        >
          <button
            onClick={() => onSelectTab('workspace')}
            style={{
              fontSize: '14px',
              color: activeTab === 'workspace' ? 'var(--ink-primary)' : 'var(--ink-secondary)',
              fontWeight: 400,
            }}
          >
            Platform
          </button>
          <a
            href="#method"
            onClick={(e) => {
              if (activeTab !== 'marketing') {
                e.preventDefault();
                onSelectTab('marketing');
                setTimeout(() => {
                  document.getElementById('method')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            style={{
              fontSize: '14px',
              color: 'var(--ink-secondary)',
              fontWeight: 400,
            }}
          >
            Method
          </a>
          <button
            onClick={() => onSelectTab('component')}
            style={{
              fontSize: '14px',
              color: activeTab === 'component' ? 'var(--ink-primary)' : 'var(--ink-secondary)',
              fontWeight: 400,
            }}
          >
            Security & Sign-off
          </button>
        </nav>

        {/* Right: Sign in + Open workspace */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => onSelectTab('workspace')}
            style={{
              fontSize: '14px',
              color: 'var(--ink-primary)',
            }}
            className="desktop-signin"
          >
            Sign in
          </button>

          <button
            onClick={() => onSelectTab('workspace')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--ink-primary)',
              color: '#FFFFFF',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 400,
            }}
            className="desktop-open-btn"
          >
            Open workspace
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              fontSize: '14px',
              color: 'var(--ink-primary)',
              alignItems: 'center',
              gap: '6px',
            }}
            className="mobile-nav-toggle"
          >
            <span>Menu</span>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--rule-base)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            onClick={() => {
              onSelectTab('marketing');
              setMobileMenuOpen(false);
            }}
            style={{ textAlign: 'left', fontSize: '14px', color: 'var(--ink-primary)' }}
          >
            Overview
          </button>
          <button
            onClick={() => {
              onSelectTab('workspace');
              setMobileMenuOpen(false);
            }}
            style={{ textAlign: 'left', fontSize: '14px', color: 'var(--ink-primary)' }}
          >
            Open workspace (EV-024)
          </button>
          <button
            onClick={() => {
              onSelectTab('component');
              setMobileMenuOpen(false);
            }}
            style={{ textAlign: 'left', fontSize: '14px', color: 'var(--ink-primary)' }}
          >
            Evidence sign-off specimen
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .desktop-signin {
            display: block !important;
          }
          .desktop-open-btn {
            display: block !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav-links {
            display: none !important;
          }
          .desktop-signin {
            display: none !important;
          }
          .desktop-open-btn {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
