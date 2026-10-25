import React, { useLayoutEffect, useRef, useState } from 'react';
import { INITIAL_RELEASE } from './data/initialState';
import { CheckItem } from './types/index';

type ActiveView = 'desktop' | 'mobile' | 'app' | 'component';
type CompareMode = 'off' | 'side' | 'overlay';

function ScaledStage({
  width,
  height,
  maxScale = 1,
  bg = '#FCFDFC',
  children,
}: {
  width: number;
  height: number;
  maxScale?: number;
  bg?: string;
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const update = () => {
      const avail = node.clientWidth;
      const next = Math.min(maxScale, avail / width);
      setScale(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [width, maxScale]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: bg,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: width * scale,
          height: height * scale,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: bg,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const CheckCircleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="10" fill="#2B683E" />
    <path
      d="M6 10.3L8.6 12.9L14.2 7.3"
      stroke="#FFFFFF"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoCircleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="8.2" stroke="#2D3630" strokeWidth="1.5" />
    <path d="M10 9.2V13.6" stroke="#2D3630" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="6.6" r="1" fill="#2D3630" />
  </svg>
);

const ClockIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="10" cy="10" r="7.5" stroke="#4D5550" strokeWidth="1.4" />
    <path d="M10 6.2V10.2L12.6 11.8" stroke="#4D5550" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('desktop');
  const [compareMode, setCompareMode] = useState<CompareMode>('off');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);

  const [release, setRelease] = useState(INITIAL_RELEASE);
  const [selectedDay, setSelectedDay] = useState<'TUE' | 'WED' | 'THU' | 'FRI'>('THU');
  const [activeCheckDrawer, setActiveCheckDrawer] = useState<boolean>(false);
  const [selectedCheck, setSelectedCheck] = useState<CheckItem>(INITIAL_RELEASE.checks[0]);
  const [changeRequestOpen, setChangeRequestOpen] = useState<boolean>(false);
  const [changeReason, setChangeReason] = useState<string>('');
  const [newReleaseModalOpen, setNewReleaseModalOpen] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactTeam, setContactTeam] = useState<string>('');
  const [contactSent, setContactSent] = useState<boolean>(false);
  const [activeSidebarNav, setActiveSidebarNav] = useState<string>('Schedule');

  const isApproved = release.status === 'APPROVED & LOCKED';

  const handleApproveWindow = () => {
    setRelease((prev) => ({
      ...prev,
      status: 'APPROVED & LOCKED',
      notes: 'Rollout authorized. Rowan Park approved at 13:46 UTC.',
      approvals: prev.approvals.map((a) =>
        a.initials === 'RP'
          ? { ...a, status: 'approved', timestamp: '13:46 UTC' }
          : a
      ),
    }));
  };

  const handleResetApproval = () => {
    setRelease(INITIAL_RELEASE);
  };

  const openCheckByName = (name: string) => {
    const found = release.checks.find((c) => c.name.toLowerCase() === name.toLowerCase()) || release.checks[0];
    setSelectedCheck(found);
    setActiveCheckDrawer(true);
  };

  const referenceImageForView: Record<ActiveView, string> = {
    desktop: '/reference/desktop-homepage.png',
    mobile: '/reference/mobile-homepage.png',
    app: '/reference/app.png',
    component: '/reference/component.png',
  };

  const stageDims: Record<ActiveView, { w: number; h: number }> = {
    desktop: { w: 1390, h: 3122 },
    mobile: { w: 855, h: 7067 },
    app: { w: 1536, h: 1024 },
    component: { w: 1176, h: 1337 },
  };

  /* ============================================================================
   * 1. DESKTOP HOMEPAGE STAGE (1390 × 3122)
   * ========================================================================== */
  const renderDesktopStage = () => (
    <ScaledStage width={1390} height={3122} maxScale={1} bg="#FCFDFC">
      <div style={{ width: 1390, height: 3122, position: 'relative', color: '#111412', fontFamily: 'var(--font-sans)' }}>
        {/* HEADER (y: 0..84) */}
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 38,
            width: 1314,
            height: 84,
            borderBottom: '1px solid #E2E5E3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('desktop');
            }}
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: '#0D100E',
              textDecoration: 'none',
            }}
          >
            Avenor
          </a>

          <nav
            style={{
              position: 'absolute',
              left: 432,
              display: 'flex',
              alignItems: 'center',
              gap: 50,
              fontSize: 15,
              color: '#202622',
              fontWeight: 400,
            }}
          >
            <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Product</a>
            <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Workflow</a>
            <a href="#permissions" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a>
            <a href="#readiness" style={{ color: 'inherit', textDecoration: 'none' }}>Resources</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <button
              onClick={() => setActiveView('app')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 15,
                color: '#181D1A',
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                height: 44,
                padding: '0 20px',
                border: '1px solid #CFD5D1',
                borderRadius: 7,
                backgroundColor: '#FCFDFC',
                color: '#141916',
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              <span>Talk to us</span>
              <span style={{ fontSize: 16 }}>→</span>
            </a>
          </div>
        </header>

        {/* HERO LEFT COLUMN */}
        <div style={{ position: 'absolute', top: 214, left: 50, width: 560 }}>
          <div
            className="font-mono"
            style={{
              fontSize: 13,
              letterSpacing: '0.16em',
              color: '#5B625D',
              marginBottom: 34,
            }}
          >
            RELEASE COORDINATION
          </div>

          <h1
            style={{
              fontSize: 58,
              lineHeight: 1.11,
              fontWeight: 600,
              letterSpacing: '-0.026em',
              color: '#0B0E0C',
              marginBottom: 28,
            }}
          >
            A CLEAR WINDOW
            <br />
            FOR EVERY RELEASE.
          </h1>

          <p
            style={{
              fontSize: 22,
              lineHeight: 1.48,
              color: '#4E5550',
              fontWeight: 400,
              marginBottom: 40,
            }}
          >
            Coordinate environments, checks and people
            <br />
            around one release plan.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 32 }}>
            <button
              onClick={() => setActiveView('component')}
              className="av-interactive"
              style={{
                width: 219,
                height: 63,
                borderRadius: 8,
                backgroundColor: '#E5EFE3',
                border: '1px solid #ADC2AF',
                color: '#111913',
                fontSize: 18,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
              }}
            >
              <span>Plan a release</span>
              <span style={{ fontSize: 19 }}>→</span>
            </button>

            <button
              onClick={() => setActiveView('app')}
              className="av-interactive"
              style={{
                width: 247,
                height: 63,
                borderRadius: 8,
                backgroundColor: '#FCFDFC',
                border: '1px solid #CFD5D1',
                color: '#111613',
                fontSize: 18,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}
            >
              <span>See the workspace</span>
              <span style={{ fontSize: 17 }}>↗</span>
            </button>
          </div>

          <div style={{ fontSize: 14.5, color: '#585F5A' }}>
            Built for infrastructure teams.
          </div>
        </div>

        {/* HERO RIGHT COLUMN: RELEASE CALENDAR CARD (x: 636..1350, y: 138..799) */}
        <div
          style={{
            position: 'absolute',
            left: 636,
            top: 138,
            width: 714,
            height: 661,
            backgroundColor: '#FFFFFF',
            border: '1px solid #DCE0DD',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {/* Card Header (height 62px) */}
          <div
            style={{
              height: 62,
              padding: '0 26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #EFF1F3',
            }}
          >
            <span style={{ fontSize: 19, fontWeight: 600, color: '#111513', letterSpacing: '-0.015em' }}>
              Release calendar
            </span>
            <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 13.5, color: '#454C48' }}>
              <span>03 – 06 NOV 2026</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#3B423E', fontSize: 13 }}>
                UTC <span style={{ fontSize: 11 }}>⌄</span>
              </span>
            </div>
          </div>

          {/* 5-Column Calendar Matrix (y: 62..410 inside card) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '109px 147px 148px 162px 146px',
              gridTemplateRows: '58px 80px 64px 70px 76px',
            }}
          >
            {/* Header Row */}
            <div style={{ borderBottom: '1px solid #F0F2F4', borderRight: '1px solid #F0F2F4' }} />
            {(
              [
                { d: 'TUE', n: '03 NOV', w: 147, sage: false },
                { d: 'WED', n: '04 NOV', w: 148, sage: false },
                { d: 'THU', n: '05 NOV', w: 162, sage: true },
                { d: 'FRI', n: '06 NOV', w: 146, sage: false },
              ] as const
            ).map((col, idx) => (
              <div
                key={col.d}
                onClick={() => setSelectedDay(col.d)}
                className="font-mono av-interactive"
                style={{
                  padding: '12px 18px',
                  backgroundColor: col.sage ? '#EEF7F0' : '#FFFFFF',
                  borderBottom: '1px solid #EEF1F3',
                  borderRight: idx < 3 ? '1px solid #EEF1F3' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2E3631' }}>{col.d}</div>
                <div style={{ fontSize: 12.5, color: '#58605B' }}>{col.n}</div>
              </div>
            ))}

            {/* Row 1: Environments */}
            <div
              style={{
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                color: '#3F4641',
                borderBottom: '1px solid #F0F2F4',
                borderRight: '1px solid #F0F2F4',
              }}
            >
              Environments
            </div>
            <div style={{ padding: '12px 10px', borderBottom: '1px solid #F0F2F4', borderRight: '1px solid #F0F2F4' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#F1F3F5',
                  borderRadius: 6,
                  padding: '9px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2521' }}>Scope locked</div>
                <div className="font-mono" style={{ fontSize: 12, color: '#59615C' }}>stage-eu-west</div>
              </div>
            </div>
            <div style={{ padding: '12px 10px', borderBottom: '1px solid #F0F2F4', borderRight: '1px solid #F0F2F4' }}>
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#F1F3F5',
                  borderRadius: 6,
                  padding: '9px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2521' }}>Staging checks</div>
                <div className="font-mono" style={{ fontSize: 12, color: '#59615C' }}>prod-eu-west</div>
              </div>
            </div>
            <div
              style={{
                padding: '12px 10px',
                backgroundColor: '#EEF7F0',
                borderBottom: '1px solid #E6F0E8',
                borderRight: '1px solid #E6F0E8',
              }}
            >
              <div
                onClick={() => setActiveView('component')}
                className="av-interactive"
                style={{
                  height: '100%',
                  backgroundColor: '#DCECDD',
                  borderRadius: 6,
                  padding: '9px 11px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#142418', whiteSpace: 'nowrap' }}>Edge gateway 2.8.1</div>
                <div className="font-mono" style={{ fontSize: 12, color: '#2F4735' }}>14:00 – 14:30</div>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid #F0F2F4' }} />

            {/* Row 2: Verification */}
            <div
              style={{
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                color: '#3F4641',
                borderBottom: '1px solid #F0F2F4',
                borderRight: '1px solid #F0F2F4',
              }}
            >
              Verification
            </div>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', fontSize: 13.5, color: '#39403C', borderBottom: '1px solid #F0F2F4', borderRight: '1px solid #F0F2F4' }}>
              Plan ready
            </div>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', fontSize: 13.5, color: '#39403C', borderBottom: '1px solid #F0F2F4', borderRight: '1px solid #F0F2F4' }}>
              All checks passing
            </div>
            <div
              style={{
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13.5,
                color: '#2A382E',
                backgroundColor: '#EEF7F0',
                borderBottom: '1px solid #E6F0E8',
                borderRight: '1px solid #E6F0E8',
              }}
            >
              {isApproved ? 'Window approved' : 'Ready for approval'}
            </div>
            <div style={{ borderBottom: '1px solid #F0F2F4' }} />

            {/* Row 3: Window */}
            <div
              style={{
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                color: '#3F4641',
                borderBottom: '1px solid #F0F2F4',
                borderRight: '1px solid #F0F2F4',
              }}
            >
              Window
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4B9B6', borderBottom: '1px solid #F0F2F4', borderRight: '1px solid #F0F2F4' }}>
              —
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4B9B6', borderBottom: '1px solid #F0F2F4', borderRight: '1px solid #F0F2F4' }}>
              —
            </div>
            <div
              style={{
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#EEF7F0',
                borderBottom: '1px solid #E6F0E8',
                borderRight: '1px solid #E6F0E8',
              }}
            >
              {/* Vertical dark-green pin with dot on top */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 42, justifyContent: 'center' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#1E5A32' }} />
                <div style={{ width: 2, height: 32, backgroundColor: '#1E5A32' }} />
              </div>
              <div
                className="font-mono"
                style={{
                  backgroundColor: '#DCECDD',
                  borderRadius: 5,
                  padding: '6px 12px',
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: '#1F3A26',
                }}
              >
                14:00 – 14:30
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4B9B6', borderBottom: '1px solid #F0F2F4' }}>
              —
            </div>

            {/* Row 4: Owners */}
            <div
              style={{
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                color: '#3F4641',
                borderRight: '1px solid #F0F2F4',
              }}
            >
              Owners
            </div>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', fontSize: 13.5, color: '#2F3632', borderRight: '1px solid #F0F2F4' }}>
              Platform team
            </div>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', fontSize: 13.5, color: '#2F3632', borderRight: '1px solid #F0F2F4' }}>
              Release team
            </div>
            <div
              style={{
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                fontSize: 13.5,
                color: '#1F2C23',
                backgroundColor: '#EEF7F0',
                borderRight: '1px solid #E6F0E8',
              }}
            >
              Edge team
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B4B9B6' }}>
              —
            </div>
          </div>

          {/* Inner Sub-Card (x: 16..698 inside card, y: 410..644 inside card => 682x234) */}
          <div
            style={{
              margin: '0 15px 15px',
              height: 234,
              border: '1px solid #EBEEEF',
              borderRadius: 8,
              backgroundColor: '#FFFFFF',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Top Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: 14,
                borderBottom: '1px solid #F1F2F4',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, color: '#121614' }}>{release.id}</span>
                  <span className={`av-pill ${isApproved ? 'av-pill-green' : 'av-pill-amber'}`}>
                    {release.status}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: '#535A55' }}>Edge gateway 2.8.1</div>
              </div>

              <span
                className="av-pill"
                style={{
                  backgroundColor: '#F3F7F4',
                  border: '1px solid #D3E0D5',
                  color: '#2B4231',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 12.5,
                  padding: '6px 12px',
                  borderRadius: 6,
                }}
              >
                <span className="av-dot-green" />
                Window reserved
              </span>
            </div>

            {/* Middle 4-col Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 305px 138px 1fr',
                paddingBottom: 14,
                borderBottom: '1px solid #F1F2F4',
                alignItems: 'start',
              }}
            >
              <div
                onClick={() => setActiveCheckDrawer(true)}
                className="av-interactive"
                style={{ borderRight: '1px solid #F0F1F3', paddingRight: 12, height: '100%' }}
              >
                <div style={{ fontSize: 12.5, color: '#616863', marginBottom: 6 }}>Checks</div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: '#1F6A34' }}>6 / 6 passed</div>
              </div>

              <div style={{ borderRight: '1px solid #F0F1F3', padding: '0 14px', height: '100%' }}>
                <div style={{ fontSize: 12.5, color: '#616863', marginBottom: 4 }}>Approvals</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#272E29' }}>
                    {isApproved ? '2 / 2' : '1 / 2'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#DCECDD',
                        color: '#1F522B',
                        fontSize: 10.5,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      MC
                    </span>
                    <div style={{ fontSize: 11, lineHeight: 1.28, color: '#454C47' }}>
                      <div style={{ fontWeight: 500, color: '#1C221E' }}>Maya Chen</div>
                      <div>Approved</div>
                      <div className="font-mono" style={{ fontSize: 10, color: '#6B726D' }}>13:42 UTC</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: '#EBEEEF',
                        color: '#343A36',
                        fontSize: 10.5,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      RP
                    </span>
                    <div style={{ fontSize: 11, lineHeight: 1.28, color: '#454C47' }}>
                      <div style={{ fontWeight: 500, color: '#1C221E' }}>Rowan Park</div>
                      <div>{isApproved ? 'Approved' : 'Pending'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderRight: '1px solid #F0F1F3', padding: '0 14px', height: '100%' }}>
                <div style={{ fontSize: 12.5, color: '#616863', marginBottom: 6 }}>Current reviewer</div>
                <div style={{ fontSize: 14.5, fontWeight: 500, color: '#1D2420' }}>Rowan Park</div>
              </div>

              <div style={{ paddingLeft: 14, height: '100%' }}>
                <div style={{ fontSize: 12.5, color: '#616863', marginBottom: 6 }}>Current time</div>
                <div className="font-mono" style={{ fontSize: 14, fontWeight: 500, color: '#1D2420' }}>13:46 UTC</div>
              </div>
            </div>

            {/* Bottom Environments Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, paddingTop: 2 }}>
              <span style={{ fontSize: 12.5, color: '#484F4A' }}>Environments</span>
              <div style={{ display: 'flex', gap: 10 }}>
                {['stage-eu-west', 'prod-eu-west', 'prod-us-east'].map((env) => (
                  <span
                    key={env}
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      color: '#373E3A',
                      backgroundColor: '#F4F6F7',
                      border: '1px solid #E5E8EA',
                      borderRadius: 5,
                      padding: '4px 10px',
                    }}
                  >
                    {env}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PROMISE STRIP (y: 842..986) */}
        <section
          style={{
            position: 'absolute',
            top: 842,
            left: 38,
            width: 1314,
            height: 144,
            borderTop: '1px solid #DFE2E0',
            borderBottom: '1px solid #DFE2E0',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Col 1 */}
            <div style={{ position: 'absolute', left: 36, top: 38 }}>
              <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.02em', color: '#121613', marginBottom: 4 }}>
                The window.
              </div>
              <div style={{ fontSize: 17, color: '#555C57' }}>A shared schedule.</div>
            </div>

            {/* Divider 1 at x=480-38=442 */}
            <div style={{ position: 'absolute', left: 442, top: 35, width: 1, height: 74, backgroundColor: '#E2E5E3' }} />

            {/* Col 2 at x=548-38=510 */}
            <div style={{ position: 'absolute', left: 510, top: 38 }}>
              <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.02em', color: '#121613', marginBottom: 4 }}>
                The checks.
              </div>
              <div style={{ fontSize: 17, color: '#555C57' }}>Evidence before execution.</div>
            </div>

            {/* Divider 2 at x=940-38=902 */}
            <div style={{ position: 'absolute', left: 902, top: 35, width: 1, height: 74, backgroundColor: '#E2E5E3' }} />

            {/* Col 3 at x=970-38=932 */}
            <div style={{ position: 'absolute', left: 970, top: 38 }}>
              <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.02em', color: '#121613', marginBottom: 4 }}>
                The people.
              </div>
              <div style={{ fontSize: 17, color: '#555C57' }}>Clear release ownership.</div>
            </div>
          </div>
        </section>

        {/* SECTION 02 / WORKFLOW (y: 986..1505) */}
        <section id="workflow" style={{ position: 'absolute', top: 986, left: 0, width: 1390, height: 520 }}>
          {/* Left Side */}
          <div style={{ position: 'absolute', left: 55, top: 60, width: 500 }}>
            <div className="font-mono" style={{ fontSize: 13.5, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 24 }}>
              02 / WORKFLOW
            </div>
            <h2
              style={{
                fontSize: 46,
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: '#0D110E',
                marginBottom: 40,
              }}
            >
              A release plan people
              <br />
              can follow.
            </h2>

            {/* 3 Connected Numbered Steps */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 36 }}>
              {/* Vertical connector line */}
              <div
                style={{
                  position: 'absolute',
                  left: 19,
                  top: 38,
                  bottom: 38,
                  width: 1.5,
                  backgroundColor: '#D6DDD7',
                }}
              />

              {[
                {
                  n: '01',
                  title: 'Reserve the window.',
                  desc: 'Choose a time that works across environments.',
                },
                {
                  n: '02',
                  title: 'Bring the checks together.',
                  desc: 'See the evidence before the deadline.',
                },
                {
                  n: '03',
                  title: 'Put an owner on the decision.',
                  desc: 'Make the next action clear to everyone.',
                },
              ].map((s) => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 22, position: 'relative' }}>
                  <div
                    className="font-mono"
                    style={{
                      width: 39,
                      height: 39,
                      borderRadius: '50%',
                      backgroundColor: '#E5EFE4',
                      color: '#1F3624',
                      fontSize: 13,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div style={{ fontSize: 21, fontWeight: 500, color: '#121614', marginBottom: 4, letterSpacing: '-0.015em' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 16, color: '#5A625D' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: REL-211 / Cache layer 4.2 (x: 610..1335, y: 59..474 inside section => abs y: 1045..1460) */}
          <div
            style={{
              position: 'absolute',
              left: 610,
              top: 59,
              width: 725,
              height: 415,
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCE0DE',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {/* Header Row (height 72px) */}
            <div
              style={{
                height: 72,
                padding: '0 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #EFF1F4',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#111513' }}>REL-211</span>
                <span style={{ color: '#A5ACA7', fontSize: 19 }}>/</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#111513' }}>Cache layer 4.2</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <div style={{ width: 1, height: 34, backgroundColor: '#EAEDEF' }} />
                <div className="font-mono" style={{ fontSize: 12.5, lineHeight: 1.4, color: '#454C47' }}>
                  <div>TUE 03 NOV 2026</div>
                  <div>09:00 – 09:20 UTC</div>
                </div>
                <span
                  className="av-pill"
                  style={{
                    backgroundColor: '#F4F8F4',
                    border: '1px solid #C6DAC8',
                    color: '#25422B',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    padding: '8px 14px',
                    borderRadius: 6,
                  }}
                >
                  <span className="av-dot-green" />
                  Owners confirmed
                </span>
              </div>
            </div>

            {/* 3-Column Table (TIME, ACTION, OWNER) */}
            <div style={{ borderBottom: '1px solid #EFF1F4' }}>
              <div
                className="font-mono"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '172px 305px 1fr',
                  height: 44,
                  alignItems: 'center',
                  borderBottom: '1px solid #EFF1F4',
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  color: '#5F6661',
                }}
              >
                <div style={{ paddingLeft: 26, borderRight: '1px solid #EFF1F4', height: '100%', display: 'flex', alignItems: 'center' }}>
                  TIME (UTC)
                </div>
                <div style={{ paddingLeft: 22, borderRight: '1px solid #EFF1F4', height: '100%', display: 'flex', alignItems: 'center' }}>
                  ACTION
                </div>
                <div style={{ paddingLeft: 22, height: '100%', display: 'flex', alignItems: 'center' }}>
                  OWNER
                </div>
              </div>

              {[
                { t: '08:15', a: 'Validation', o: 'Nadia Bell' },
                { t: '08:35', a: 'Backout rehearsal', o: 'Eli Morris' },
                { t: '08:50', a: 'Window confirmation', o: 'Rowan Park' },
              ].map((r, idx) => (
                <div
                  key={r.t}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '172px 305px 1fr',
                    height: 46,
                    alignItems: 'center',
                    borderBottom: idx < 2 ? '1px solid #EFF1F4' : 'none',
                    fontSize: 14.5,
                  }}
                >
                  <div
                    className="font-mono"
                    style={{
                      paddingLeft: 26,
                      borderRight: '1px solid #EFF1F4',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 500,
                      color: '#19201C',
                    }}
                  >
                    {r.t}
                  </div>
                  <div
                    style={{
                      paddingLeft: 22,
                      borderRight: '1px solid #EFF1F4',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#2B322E',
                    }}
                  >
                    {r.a}
                  </div>
                  <div
                    style={{
                      paddingLeft: 22,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#2B322E',
                    }}
                  >
                    {r.o}
                  </div>
                </div>
              ))}
            </div>

            {/* ENVIRONMENT HANDOFF Footer */}
            <div style={{ padding: '20px 26px' }}>
              <div
                className="font-mono"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  color: '#5B625D',
                  marginBottom: 14,
                }}
              >
                ENVIRONMENT HANDOFF
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {['stage-eu-west', 'prod-eu-west', 'prod-us-east'].map((env, i) => (
                  <React.Fragment key={env}>
                    <div
                      className="font-mono"
                      style={{
                        width: 192,
                        height: 46,
                        border: '1px solid #DCE0E3',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        color: '#222824',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {env}
                    </div>
                    {i < 2 && (
                      <span style={{ color: '#8A928D', fontSize: 22, fontWeight: 300 }}>⟶</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Section Bottom Rule at y=1505 (519 inside section) */}
          <div style={{ position: 'absolute', left: 55, bottom: 0, width: 1280, height: 1, backgroundColor: '#E2E4E6' }} />
        </section>

        {/* SECTION 03 / READINESS (y: 1506..2134) */}
        <section id="readiness" style={{ position: 'absolute', top: 1506, left: 0, width: 1390, height: 628 }}>
          <div style={{ position: 'absolute', left: 55, top: 44 }}>
            <div className="font-mono" style={{ fontSize: 13.5, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 22 }}>
              03 / READINESS
            </div>
            <h2
              style={{
                fontSize: 47,
                lineHeight: 1.08,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: '#0D110E',
                marginBottom: 16,
              }}
            >
              One view before anything moves.
            </h2>
            <p style={{ fontSize: 20, color: '#505752' }}>
              Check readiness across environments, then make the release decision.
            </p>
          </div>

          {/* Panoramic Readiness Card (x: 56..1336, y: 1697..2109 => top: 191, height: 412) */}
          <div
            style={{
              position: 'absolute',
              left: 56,
              top: 191,
              width: 1280,
              height: 412,
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCE0DE',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {/* Card Header (height 66px) */}
            <div
              style={{
                height: 66,
                padding: '0 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #EEF0F4',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.03em', color: '#0E1210' }}>Avenor</span>
                <div style={{ width: 1, height: 26, backgroundColor: '#E4E7E9' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 600, color: '#111513' }}>{release.id}</span>
                  <span style={{ color: '#A5ACA7', fontSize: 19 }}>/</span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: '#111513' }}>Edge gateway 2.8.1</span>
                </div>
                <span className={`av-pill ${isApproved ? 'av-pill-green' : 'av-pill-amber'}`} style={{ marginLeft: 4 }}>
                  {release.status}
                </span>
              </div>

              <div style={{ textAlign: 'right', fontSize: 13.5, lineHeight: 1.35, color: '#454C47' }}>
                <div style={{ fontWeight: 500, color: '#2B322E' }}>Thu 05 Nov 2026</div>
                <div className="font-mono" style={{ fontSize: 12.5, color: '#5A615C' }}>14:00 – 14:30 UTC</div>
              </div>
            </div>

            {/* 4-Column Readiness Table */}
            <div>
              <div
                className="font-mono"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '355px 257px 257px 1fr',
                  height: 39,
                  borderBottom: '1px solid #EEF0F4',
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  color: '#5B625D',
                }}
              >
                <div style={{ paddingLeft: 28, borderRight: '1px solid #EEF0F4', display: 'flex', alignItems: 'center' }}>ENVIRONMENT</div>
                <div style={{ paddingLeft: 20, borderRight: '1px solid #EEF0F4', display: 'flex', alignItems: 'center' }}>CURRENT</div>
                <div style={{ paddingLeft: 20, borderRight: '1px solid #EEF0F4', display: 'flex', alignItems: 'center' }}>PROPOSED</div>
                <div style={{ paddingLeft: 20, display: 'flex', alignItems: 'center' }}>READINESS</div>
              </div>

              {[
                { env: 'stage-eu-west', cur: '2.8.1', prop: '2.8.1', st: 'Validated', color: '#1D5E31' },
                { env: 'prod-eu-west', cur: '2.8.0', prop: '2.8.1', st: 'Window reserved', color: '#1D522D' },
                { env: 'prod-us-east', cur: '2.8.0', prop: '2.8.1', st: 'Window reserved', color: '#1D522D' },
              ].map((r) => (
                <div
                  key={r.env}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '355px 257px 257px 1fr',
                    height: 37,
                    borderBottom: '1px solid #EEF0F4',
                    fontSize: 14,
                  }}
                >
                  <div className="font-mono" style={{ paddingLeft: 28, borderRight: '1px solid #EEF0F4', display: 'flex', alignItems: 'center', color: '#1C221E' }}>
                    {r.env}
                  </div>
                  <div className="font-mono" style={{ paddingLeft: 20, borderRight: '1px solid #EEF0F4', display: 'flex', alignItems: 'center', color: '#333A36' }}>
                    {r.cur}
                  </div>
                  <div className="font-mono" style={{ paddingLeft: 20, borderRight: '1px solid #EEF0F4', display: 'flex', alignItems: 'center', color: '#1C221E' }}>
                    {r.prop}
                  </div>
                  <div style={{ paddingLeft: 20, display: 'flex', alignItems: 'center', gap: 10, color: r.color, fontWeight: 500 }}>
                    <span className="av-dot-green" style={{ backgroundColor: '#2B723E', width: 8, height: 8 }} />
                    {r.st}
                  </div>
                </div>
              ))}
            </div>

            {/* 3-Column Summary Strip (height 81px) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '422px 395px 1fr',
                height: 81,
                borderBottom: '1px solid #EEF0F4',
                backgroundColor: '#FAFBFB',
              }}
            >
              <div
                onClick={() => setActiveCheckDrawer(true)}
                className="av-interactive"
                style={{ padding: '16px 28px', borderRight: '1px solid #EAECF0' }}
              >
                <div className="font-mono" style={{ fontSize: 12, letterSpacing: '0.08em', color: '#5A615C', marginBottom: 6 }}>
                  CHECKS
                </div>
                <div style={{ fontSize: 19, fontWeight: 600, color: '#216634' }}>6 / 6 passed</div>
              </div>

              <div style={{ padding: '16px 26px', borderRight: '1px solid #EAECF0' }}>
                <div className="font-mono" style={{ fontSize: 12, letterSpacing: '0.08em', color: '#5A615C', marginBottom: 6 }}>
                  APPROVALS
                </div>
                <div style={{ fontSize: 19, fontWeight: 500, color: '#1B211D' }}>
                  {isApproved ? '2 / 2' : '1 / 2'}
                </div>
              </div>

              <div style={{ padding: '16px 26px' }}>
                <div className="font-mono" style={{ fontSize: 12, letterSpacing: '0.08em', color: '#5A615C', marginBottom: 6 }}>
                  RELEASE WINDOW
                </div>
                <div className="font-mono" style={{ fontSize: 16, fontWeight: 500, color: '#1F2622' }}>
                  Thu 05 Nov 2026, 14:00 – 14:30 UTC
                </div>
              </div>
            </div>

            {/* Bottom Timeline Bar & Caption */}
            <div style={{ padding: '20px 28px' }}>
              <div
                style={{
                  height: 11,
                  borderRadius: 4,
                  backgroundColor: '#EFF1F3',
                  border: '1px solid #E2E5E8',
                  display: 'grid',
                  gridTemplateColumns: '411px 395px 1fr',
                  overflow: 'hidden',
                  marginBottom: 8,
                }}
              >
                <div style={{ borderRight: '1px solid #D9DFE2' }} />
                <div style={{ backgroundColor: '#D8E9D8', borderRight: '1px solid #C6DAC7' }} />
                <div />
              </div>

              <div
                className="font-mono"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '411px 395px 1fr',
                  fontSize: 12,
                  color: '#4E5550',
                  marginBottom: 14,
                }}
              >
                <div>13:30</div>
                <div>14:00</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>14:30</span>
                  <span>15:00</span>
                </div>
              </div>

              <div style={{ fontSize: 14, color: '#4E5550' }}>
                {release.notes}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04 / PERMISSIONS (y: 2134..2568) */}
        <section id="permissions" style={{ position: 'absolute', top: 2134, left: 0, width: 1390, height: 435 }}>
          {/* Left Column */}
          <div style={{ position: 'absolute', left: 53, top: 38, width: 580 }}>
            <div className="font-mono" style={{ fontSize: 13.5, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 24 }}>
              04 / PERMISSIONS
            </div>
            <h2
              style={{
                fontSize: 46,
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: '#0D110E',
                marginBottom: 24,
              }}
            >
              Clear responsibility
              <br />
              at every boundary.
            </h2>
            <p style={{ fontSize: 20, lineHeight: 1.48, color: '#505752', marginBottom: 42 }}>
              Give each team the access it needs.
              <br />
              Keep changes and decisions visible.
            </p>

            {/* 3 Bottom Columns with Vertical Hairlines */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 217px 1fr',
                alignItems: 'start',
              }}
            >
              <div style={{ paddingRight: 16, borderRight: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 16.5, fontWeight: 600, color: '#141916', marginBottom: 6 }}>Scoped roles</div>
                <div style={{ fontSize: 14, lineHeight: 1.42, color: '#58605B' }}>
                  Right access
                  <br />
                  for the right work.
                </div>
              </div>

              <div style={{ padding: '0 22px', borderRight: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 16.5, fontWeight: 600, color: '#141916', marginBottom: 6 }}>Recorded decisions</div>
                <div style={{ fontSize: 14, lineHeight: 1.42, color: '#58605B' }}>
                  Track who approved
                  <br />
                  and when.
                </div>
              </div>

              <div style={{ paddingLeft: 22 }}>
                <div style={{ fontSize: 16.5, fontWeight: 600, color: '#141916', marginBottom: 6 }}>Shared visibility</div>
                <div style={{ fontSize: 14, lineHeight: 1.42, color: '#58605B' }}>
                  Everyone sees the
                  <br />
                  same plan and status.
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Role permissions (x: 668..1342, y: 2180..2523 => top: 46, width: 674, height: 343) */}
          <div
            style={{
              position: 'absolute',
              left: 668,
              top: 46,
              width: 674,
              height: 343,
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCE0DE',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {/* Header (height 70px) */}
            <div
              style={{
                height: 70,
                padding: '0 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #EFF1F4',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 500, color: '#121614' }}>Role permissions</span>
              <span
                className="av-pill"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9E2DC',
                  color: '#2B352E',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  padding: '8px 14px',
                  borderRadius: 6,
                }}
              >
                <span className="av-dot-green" />
                Audit trail available
              </span>
            </div>

            {/* Table Header (height 47px) */}
            <div
              className="font-mono"
              style={{
                display: 'grid',
                gridTemplateColumns: '208px 243px 1fr',
                height: 47,
                borderBottom: '1px solid #EDEFF3',
                fontSize: 12,
                letterSpacing: '0.08em',
                color: '#5C635E',
              }}
            >
              <div style={{ paddingLeft: 26, borderRight: '1px solid #F0F1F5', display: 'flex', alignItems: 'center' }}>ROLE</div>
              <div style={{ paddingLeft: 22, borderRight: '1px solid #F0F1F5', display: 'flex', alignItems: 'center' }}>CAN MANAGE</div>
              <div style={{ paddingLeft: 22, display: 'flex', alignItems: 'center' }}>CAN APPROVE</div>
            </div>

            {/* 4 Rows */}
            {[
              { role: 'Platform owner', manage: 'Environments', approve: '—' },
              { role: 'Service owner', manage: 'Release plans', approve: '—' },
              { role: 'Release lead', manage: 'Windows', approve: 'Yes', green: true },
              { role: 'Viewer', manage: 'Read only', approve: '—' },
            ].map((r, i) => (
              <div
                key={r.role}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '208px 243px 1fr',
                  height: 56,
                  borderBottom: i < 3 ? '1px solid #EDEFF3' : 'none',
                  fontSize: 15,
                  color: '#212723',
                }}
              >
                <div style={{ paddingLeft: 26, borderRight: '1px solid #F0F1F5', display: 'flex', alignItems: 'center' }}>
                  {r.role}
                </div>
                <div style={{ paddingLeft: 22, borderRight: '1px solid #F0F1F5', display: 'flex', alignItems: 'center' }}>
                  {r.manage}
                </div>
                <div
                  style={{
                    paddingLeft: 22,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: r.green ? '#EDF5EE' : '#FFFFFF',
                    color: r.green ? '#1F4B2B' : '#9AA19C',
                    fontWeight: r.green ? 600 : 400,
                  }}
                >
                  {r.approve}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Rule at y=2568 */}
          <div style={{ position: 'absolute', left: 48, bottom: 0, width: 1294, height: 1, backgroundColor: '#DCE0E3' }} />
        </section>

        {/* SECTION 05 / LET'S TALK (y: 2595..2932) */}
        <section
          id="contact"
          style={{
            position: 'absolute',
            left: 40,
            top: 2595,
            width: 1310,
            height: 337,
            backgroundColor: '#F2F5F2',
            borderRadius: 12,
          }}
        >
          {/* Left Copy */}
          <div style={{ position: 'absolute', left: 26, top: 34, width: 640 }}>
            <div className="font-mono" style={{ fontSize: 13.5, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 30 }}>
              05 / LET’S TALK
            </div>
            <h2
              style={{
                fontSize: 47,
                lineHeight: 1.08,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: '#0D110E',
                marginBottom: 20,
              }}
            >
              Bring us your next release.
            </h2>
            <p style={{ fontSize: 20, lineHeight: 1.48, color: '#4E5550' }}>
              Show us how your team coordinates a release.
              <br />
              We’ll help you see where Avenor fits.
            </p>
          </div>

          {/* Right Form Card (abs x: 763..1323 => left: 723, top: 25, width: 560, height: 292) */}
          <div
            style={{
              position: 'absolute',
              left: 723,
              top: 25,
              width: 560,
              height: 292,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E5E4',
              borderRadius: 10,
              padding: '22px 30px',
            }}
          >
            {contactSent ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#216634' }}>✓ Conversation request received</div>
                <p style={{ fontSize: 14.5, color: '#4E5550' }}>
                  We’ll reply by email to {contactEmail || 'name@company.com'} shortly.
                </p>
                <button
                  onClick={() => setContactSent(false)}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: '1px solid #D5DBD7',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: 13.5,
                  }}
                >
                  Reset form
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSent(true);
                }}
              >
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: '#272E2A', marginBottom: 6 }}>
                    Work email
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    style={{
                      width: '100%',
                      height: 41,
                      padding: '0 14px',
                      border: '1px solid #DFE1E6',
                      borderRadius: 6,
                      fontSize: 14.5,
                      color: '#1A201C',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: '#272E2A', marginBottom: 6 }}>
                    Team
                  </label>
                  <input
                    type="text"
                    placeholder="Infrastructure team"
                    value={contactTeam}
                    onChange={(e) => setContactTeam(e.target.value)}
                    style={{
                      width: '100%',
                      height: 41,
                      padding: '0 14px',
                      border: '1px solid #DFE1E6',
                      borderRadius: 6,
                      fontSize: 14.5,
                      color: '#1A201C',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="av-interactive"
                  style={{
                    width: '100%',
                    height: 46,
                    backgroundColor: '#E6F0E6',
                    border: '1px solid #9CB3A1',
                    borderRadius: 6,
                    color: '#141D16',
                    fontSize: 15,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <span>Request a conversation</span>
                  <span>→</span>
                </button>

                <div style={{ fontSize: 13, color: '#616863' }}>We’ll reply by email.</div>
              </form>
            )}
          </div>
        </section>

        {/* FOOTER (y: 2965..3122) */}
        <footer
          style={{
            position: 'absolute',
            top: 2965,
            left: 39,
            width: 1312,
            height: 157,
            borderTop: '1px solid #D5D8DC',
          }}
        >
          {/* Upper Footer Row (height 88px) */}
          <div
            style={{
              height: 88,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F0F1F4',
              padding: '0 14px',
            }}
          >
            <div>
              <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-0.03em', color: '#0D110E', marginBottom: 2 }}>
                Avenor
              </div>
              <div style={{ fontSize: 14, color: '#616863' }}>
                Release coordination for infrastructure teams.
              </div>
            </div>

            <a
              href="mailto:hello@avenor.example"
              style={{
                fontSize: 18,
                color: '#151B17',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span>hello@avenor.example</span>
              <span>→</span>
            </a>
          </div>

          {/* Lower Footer Row */}
          <div
            style={{
              height: 68,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              fontSize: 14,
              color: '#464D48',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
              <span>Product</span>
              <span>Workflow</span>
              <span>Security</span>
              <span>Docs</span>
              <span>Contact</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 13, color: '#58605B' }}>
              <span>Privacy</span>
              <span style={{ color: '#D8DCE0' }}>|</span>
              <span>Terms</span>
              <span style={{ color: '#D8DCE0' }}>|</span>
              <span>Status</span>
              <span style={{ marginLeft: 18 }}>© Avenor 2026</span>
              <span className="font-mono" style={{ marginLeft: 14 }}>UTC</span>
            </div>
          </div>
        </footer>
      </div>
    </ScaledStage>
  );

  /* ============================================================================
   * 2. MOBILE HOMEPAGE STAGE (855 × 7067, scaled nicely for mobile frame)
   * ========================================================================== */
  const renderMobileStage = () => (
    <div style={{ padding: '20px 0 80px', backgroundColor: '#F3F5F2', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          width: 428,
          maxWidth: '100%',
          boxShadow: '0 10px 36px rgba(0,0,0,0.08)',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #D7DDD8',
          backgroundColor: '#FEFFFF',
        }}
      >
        <ScaledStage width={855} height={7067} maxScale={1} bg="#FEFFFF">
          <div style={{ width: 855, height: 7067, position: 'relative', color: '#111412', fontFamily: 'var(--font-sans)', backgroundColor: '#FEFFFF' }}>
            {/* HEADER (y: 0..101) */}
            <header
              style={{
                position: 'absolute',
                top: 0,
                left: 57,
                width: 742,
                height: 101,
                borderBottom: '1px solid #D6D9DD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', color: '#0D110E' }}>
                Avenor
              </span>
              <button
                onClick={() => setActiveView('app')}
                aria-label="Menu"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <span style={{ width: 38, height: 2.5, backgroundColor: '#3A403C', display: 'block' }} />
                <span style={{ width: 38, height: 2.5, backgroundColor: '#3A403C', display: 'block' }} />
                <span style={{ width: 38, height: 2.5, backgroundColor: '#3A403C', display: 'block' }} />
              </button>
            </header>

            {/* HERO */}
            <div style={{ position: 'absolute', top: 148, left: 57, width: 742 }}>
              <div className="font-mono" style={{ fontSize: 18, letterSpacing: '0.16em', color: '#58605B', marginBottom: 34 }}>
                RELEASE COORDINATION
              </div>
              <h1
                style={{
                  fontSize: 66,
                  lineHeight: 1.13,
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  color: '#0B0E0C',
                  marginBottom: 28,
                }}
              >
                A CLEAR WINDOW
                <br />
                FOR EVERY RELEASE.
              </h1>
              <p style={{ fontSize: 31, lineHeight: 1.44, color: '#4E5550', marginBottom: 38 }}>
                Coordinate environments, checks and people around one release plan.
              </p>

              <button
                onClick={() => setActiveView('component')}
                className="av-interactive"
                style={{
                  width: 742,
                  height: 84,
                  borderRadius: 10,
                  backgroundColor: '#E5EFE4',
                  border: '1px solid #9CB7A2',
                  color: '#111813',
                  fontSize: 27,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 18,
                  marginBottom: 16,
                }}
              >
                <span>Plan a release</span>
                <span>→</span>
              </button>

              <button
                onClick={() => setActiveView('app')}
                className="av-interactive"
                style={{
                  width: 742,
                  height: 84,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #C2C5C8',
                  color: '#111613',
                  fontSize: 27,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  marginBottom: 34,
                }}
              >
                <span>See the workspace</span>
                <span>↗</span>
              </button>

              <div style={{ fontSize: 22, color: '#5A625D' }}>
                Built for infrastructure teams.
              </div>
            </div>

            {/* MOBILE RELEASE CALENDAR CARD (y: 789..1526, x: 57..799) */}
            <div
              style={{
                position: 'absolute',
                top: 789,
                left: 57,
                width: 742,
                height: 737,
                backgroundColor: '#FFFFFF',
                border: '1px solid #D5D8DA',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              {/* Header (height 88px) */}
              <div
                style={{
                  height: 88,
                  padding: '0 30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #EEF0F3',
                }}
              >
                <span style={{ fontSize: 29, fontWeight: 600, color: '#111513' }}>Release calendar</span>
                <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 20, color: '#4A514D' }}>
                  <span>03 – 06 NOV 2026</span>
                  <span>UTC ⌄</span>
                </div>
              </div>

              {/* 4-Day Strip (height 85px) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  height: 85,
                  borderBottom: '1px solid #ECEEF0',
                }}
              >
                {[
                  { d: 'TUE', n: '03 NOV' },
                  { d: 'WED', n: '04 NOV' },
                  { d: 'THU', n: '05 NOV', active: true },
                  { d: 'FRI', n: '06 NOV' },
                ].map((item, i) => (
                  <div
                    key={item.d}
                    onClick={() => setSelectedDay(item.d as any)}
                    className="font-mono av-interactive"
                    style={{
                      padding: '16px 24px',
                      backgroundColor: item.active ? '#EDF6EE' : '#FFFFFF',
                      borderRight: i < 3 ? '1px solid #ECEEF0' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#2B322E' }}>{item.d}</div>
                    <div style={{ fontSize: 19, color: '#4E5550' }}>{item.n}</div>
                  </div>
                ))}
              </div>

              {/* Green Tinted Inner Window Box (x: 20..722, y: 187..454 => height 267) */}
              <div
                style={{
                  margin: '14px 20px 0',
                  height: 267,
                  backgroundColor: '#EFF7F0',
                  border: '1px solid #DFECE2',
                  borderRadius: 12,
                  padding: '22px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 600, color: '#141B16', marginBottom: 4 }}>Thu 05 Nov 2026</div>
                    <div className="font-mono" style={{ fontSize: 22, color: '#4B544E' }}>14:00 – 14:30 UTC</div>
                  </div>
                  <span
                    className="av-pill"
                    style={{
                      backgroundColor: '#F7FAF7',
                      border: '1px solid #C6D8C9',
                      color: '#233B28',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 19,
                      padding: '10px 18px',
                      borderRadius: 8,
                    }}
                  >
                    <span className="av-dot-green" style={{ width: 10, height: 10 }} />
                    Window reserved
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: 31, fontWeight: 600, color: '#111613', marginBottom: 8 }}>Edge gateway 2.8.1</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <span className="font-mono" style={{ fontSize: 23, color: '#4E5650' }}>REL-214</span>
                    <span
                      className="font-mono"
                      style={{
                        backgroundColor: '#FDF6E4',
                        border: '1px solid #E8D5A5',
                        color: '#5B4310',
                        fontSize: 17,
                        fontWeight: 600,
                        padding: '6px 14px',
                        borderRadius: 6,
                      }}
                    >
                      {release.status}
                    </span>
                  </div>
                </div>

                {/* Inner Pale Sage Time Bar with Pin Bookends */}
                <div
                  style={{
                    height: 44,
                    backgroundColor: '#E1EFE3',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 4px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1E5B32' }} />
                    <div style={{ width: 2.5, height: 30, backgroundColor: '#1E5B32' }} />
                  </div>
                  <span className="font-mono" style={{ fontSize: 20, fontWeight: 500, color: '#1F3A26' }}>
                    14:00 – 14:30
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#1E5B32' }} />
                    <div style={{ width: 2.5, height: 30, backgroundColor: '#1E5B32' }} />
                  </div>
                </div>
              </div>

              {/* 3 Stacked Chevron Rows */}
              <div style={{ padding: '0 22px' }}>
                <div
                  onClick={() => setActiveCheckDrawer(true)}
                  className="av-interactive"
                  style={{
                    height: 68,
                    borderBottom: '1px solid #EAECEF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <CheckCircleIcon size={28} />
                    <span style={{ fontSize: 23, fontWeight: 600, color: '#1F6332' }}>6 / 6 checks passed</span>
                  </div>
                  <span style={{ fontSize: 28, color: '#616863' }}>›</span>
                </div>

                <div
                  style={{
                    height: 116,
                    borderBottom: '1px solid #EAECEF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                    <span style={{ fontSize: 24, color: '#454C47', marginTop: 2 }}>👥</span>
                    <div>
                      <div style={{ fontSize: 23, fontWeight: 600, color: '#181E1A', marginBottom: 4 }}>
                        {isApproved ? '2 / 2 approvals' : '1 / 2 approvals'}
                      </div>
                      <div style={{ fontSize: 20, lineHeight: 1.35, color: '#58605B' }}>
                        Maya Chen approved 13:42 UTC
                        <br />
                        Rowan Park {isApproved ? 'approved' : 'pending'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 28, color: '#616863' }}>›</span>
                </div>

                <div
                  style={{
                    height: 96,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                    <span style={{ fontSize: 24, color: '#454C47', marginTop: 2 }}>⬡</span>
                    <div>
                      <div style={{ fontSize: 23, fontWeight: 500, color: '#181E1A', marginBottom: 4 }}>Environments</div>
                      <div className="font-mono" style={{ fontSize: 19, color: '#58605B' }}>
                        stage-eu-west, prod-eu-west, prod-us-east
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 28, color: '#616863' }}>›</span>
                </div>
              </div>
            </div>

            {/* PROMISE ACCORDION STRIP (y: 1555..1845) */}
            <div style={{ position: 'absolute', top: 1555, left: 57, width: 742, borderTop: '1px solid #D5D9DD' }}>
              {[
                { t: 'The window.', s: 'A shared schedule.' },
                { t: 'The checks.', s: 'Evidence before execution.' },
                { t: 'The people.', s: 'Clear release ownership.' },
              ].map((p, idx) => (
                <div
                  key={p.t}
                  style={{
                    height: 98,
                    borderBottom: idx < 2 ? '1px solid #D7DADF' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 600, color: '#111613', marginBottom: 2 }}>{p.t}</div>
                    <div style={{ fontSize: 22, color: '#58605B' }}>{p.s}</div>
                  </div>
                  <span style={{ fontSize: 30, color: '#58605B' }}>›</span>
                </div>
              ))}
            </div>

            {/* SECTION 02 / WORKFLOW (y: 1880..3363) */}
            <div style={{ position: 'absolute', top: 1880, left: 68, width: 720 }}>
              <div className="font-mono" style={{ fontSize: 19, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 30 }}>
                02 / WORKFLOW
              </div>
              <h2 style={{ fontSize: 60, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.025em', color: '#0B0E0C', marginBottom: 48 }}>
                A release plan people
                <br />
                can follow.
              </h2>

              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 44 }}>
                <div style={{ position: 'absolute', left: 26, top: 44, bottom: 44, width: 2, backgroundColor: '#D5DDD7' }} />
                {[
                  { n: '01', t: 'Reserve the window.', d: 'Choose a time that works across environments.' },
                  { n: '02', t: 'Bring the checks together.', d: 'See the evidence before the deadline.' },
                  { n: '03', t: 'Put an owner on the decision.', d: 'Make the next action clear to everyone.' },
                ].map((s) => (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 28, position: 'relative' }}>
                    <div
                      className="font-mono"
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        backgroundColor: '#E5EFE4',
                        color: '#1F3624',
                        fontSize: 18,
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 600, color: '#121614', marginBottom: 4 }}>{s.t}</div>
                      <div style={{ fontSize: 22, color: '#58605B' }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Card REL-211 (y: 2488..3362, x: 64..791) */}
            <div
              style={{
                position: 'absolute',
                top: 2488,
                left: 64,
                width: 727,
                height: 874,
                backgroundColor: '#FFFFFF',
                border: '1px solid #C2CAC8',
                borderRadius: 14,
                padding: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 26 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 600, color: '#111513' }}>REL-211</span>
                    <span style={{ color: '#A5ACA7', fontSize: 26 }}>/</span>
                    <span style={{ fontSize: 28, fontWeight: 600, color: '#111513' }}>Cache layer 4.2</span>
                  </div>
                  <div style={{ fontSize: 21, lineHeight: 1.35, color: '#535B56' }}>
                    <div>Tue 03 Nov 2026</div>
                    <div className="font-mono">09:00 – 09:20 UTC</div>
                  </div>
                </div>

                <span
                  className="av-pill"
                  style={{
                    backgroundColor: '#F4F8F4',
                    border: '1px solid #C6DAC8',
                    color: '#25422B',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 19,
                    padding: '12px 18px',
                    borderRadius: 8,
                  }}
                >
                  <span className="av-dot-green" style={{ width: 10, height: 10 }} />
                  Owners confirmed
                </span>
              </div>

              {/* 3 Stacked Action Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 34 }}>
                {[
                  { t: '08:15 UTC', a: 'Validation', o: 'Nadia Bell' },
                  { t: '08:35 UTC', a: 'Backout rehearsal', o: 'Eli Morris' },
                  { t: '08:50 UTC', a: 'Window confirmation', o: 'Rowan Park' },
                ].map((r) => (
                  <div
                    key={r.t}
                    style={{
                      height: 100,
                      border: '1px solid #D3D7DF',
                      borderRadius: 8,
                      display: 'grid',
                      gridTemplateColumns: '190px 1fr',
                      alignItems: 'center',
                      padding: '0 24px',
                    }}
                  >
                    <div className="font-mono" style={{ fontSize: 21, fontWeight: 500, color: '#1C221E', borderRight: '1px solid #E2E5EA', height: 64, display: 'flex', alignItems: 'center' }}>
                      {r.t}
                    </div>
                    <div style={{ paddingLeft: 28 }}>
                      <div style={{ fontSize: 23, fontWeight: 500, color: '#181E1A', marginBottom: 2 }}>{r.a}</div>
                      <div style={{ fontSize: 21, color: '#58605B' }}>{r.o}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Environment Handoff Vertical Chain */}
              <div>
                <div className="font-mono" style={{ fontSize: 17, letterSpacing: '0.08em', color: '#58605B', marginBottom: 14 }}>
                  ENVIRONMENT HANDOFF
                </div>
                {['stage-eu-west', 'prod-eu-west', 'prod-us-east'].map((env, i) => (
                  <React.Fragment key={env}>
                    <div
                      className="font-mono"
                      style={{
                        height: 66,
                        border: '1px solid #D3D7DF',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        color: '#1C221E',
                      }}
                    >
                      {env}
                    </div>
                    {i < 2 && (
                      <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#616863', fontSize: 22 }}>
                        ↓
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* SECTION 03 / READINESS (y: 3430..4412) */}
            <div style={{ position: 'absolute', top: 3430, left: 57, width: 742 }}>
              <div className="font-mono" style={{ fontSize: 19, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 28 }}>
                03 / READINESS
              </div>
              <h2 style={{ fontSize: 58, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.025em', color: '#0B0E0C', marginBottom: 22 }}>
                One view before anything moves.
              </h2>
              <p style={{ fontSize: 27, lineHeight: 1.42, color: '#505752' }}>
                Check readiness across environments, then make the release decision.
              </p>
            </div>

            {/* Mobile Readiness Card (y: 3736..4411, x: 57..799) */}
            <div
              style={{
                position: 'absolute',
                top: 3736,
                left: 57,
                width: 742,
                height: 675,
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCE1E3',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              {/* Top Row (height 94px) */}
              <div
                style={{
                  height: 94,
                  padding: '0 28px',
                  borderBottom: '1px solid #ECEEF3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                  <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', color: '#0E1210' }}>Avenor</span>
                  <div style={{ width: 1, height: 38, backgroundColor: '#E2E5E9' }} />
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: '#181E1A' }}>REL-214</div>
                    <div style={{ fontSize: 20, color: '#4B524E' }}>Edge gateway 2.8.1</div>
                  </div>
                </div>
                <span
                  className="font-mono"
                  style={{
                    backgroundColor: '#FDF6E4',
                    border: '1px solid #E8D5A5',
                    color: '#5B4310',
                    fontSize: 17,
                    fontWeight: 600,
                    padding: '10px 14px',
                    borderRadius: 6,
                  }}
                >
                  {release.status}
                </span>
              </div>

              {/* 3 Environment Rows */}
              {[
                { env: 'stage-eu-west', v: '2.8.1 → 2.8.1', st: 'Validated' },
                { env: 'prod-eu-west', v: '2.8.0 → 2.8.1', st: 'Window reserved' },
                { env: 'prod-us-east', v: '2.8.0 → 2.8.1', st: 'Window reserved' },
              ].map((r) => (
                <div
                  key={r.env}
                  style={{
                    height: 97,
                    padding: '0 28px',
                    borderBottom: '1px solid #ECEEF3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div className="font-mono" style={{ fontSize: 23, fontWeight: 500, color: '#181E1A', marginBottom: 4 }}>{r.env}</div>
                    <div className="font-mono" style={{ fontSize: 20, color: '#58605B' }}>{r.v}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, fontWeight: 500, color: '#1F5C30' }}>
                    <span className="av-dot-green" style={{ width: 11, height: 11, backgroundColor: '#2B723E' }} />
                    {r.st}
                  </div>
                </div>
              ))}

              {/* 3-Col Summary Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '228px 245px 1fr',
                  height: 118,
                  padding: '18px 28px',
                  borderBottom: '1px solid #ECEEF3',
                }}
              >
                <div style={{ borderRight: '1px solid #EAECF0' }}>
                  <div className="font-mono" style={{ fontSize: 16, color: '#58605B', marginBottom: 6 }}>CHECKS</div>
                  <div style={{ fontSize: 23, fontWeight: 600, color: '#1F6332' }}>6 / 6 passed</div>
                </div>
                <div style={{ paddingLeft: 24, borderRight: '1px solid #EAECF0' }}>
                  <div className="font-mono" style={{ fontSize: 16, color: '#58605B', marginBottom: 6 }}>APPROVALS</div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#181E1A' }}>{isApproved ? '2 / 2' : '1 / 2'}</div>
                </div>
                <div style={{ paddingLeft: 24 }}>
                  <div className="font-mono" style={{ fontSize: 16, color: '#58605B', marginBottom: 4 }}>RELEASE WINDOW</div>
                  <div className="font-mono" style={{ fontSize: 19, lineHeight: 1.3, fontWeight: 500, color: '#181E1A' }}>
                    Thu 05 Nov 2026
                    <br />
                    14:00 – 14:30 UTC
                  </div>
                </div>
              </div>

              {/* Timeline & Caption */}
              <div style={{ padding: '22px 28px' }}>
                <div
                  style={{
                    height: 18,
                    borderRadius: 5,
                    backgroundColor: '#EFF1F3',
                    border: '1px solid #DFE3E6',
                    display: 'grid',
                    gridTemplateColumns: '215px 250px 1fr',
                    overflow: 'hidden',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ borderRight: '1px solid #D5DBE0' }} />
                  <div style={{ backgroundColor: '#D2E7D5', borderRight: '1px solid #B8D7C1' }} />
                  <div />
                </div>
                <div className="font-mono" style={{ display: 'grid', gridTemplateColumns: '215px 250px 1fr', fontSize: 18, color: '#4E5550', marginBottom: 18 }}>
                  <span>13:30</span>
                  <span>14:00</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>14:30</span>
                    <span>15:00</span>
                  </div>
                </div>
                <div style={{ fontSize: 20, color: '#4E5550' }}>{release.notes}</div>
              </div>
            </div>

            {/* Divider rule at y=4451 */}
            <div style={{ position: 'absolute', top: 4451, left: 56, width: 744, height: 1, backgroundColor: '#D1D6DF' }} />

            {/* SECTION 04 / PERMISSIONS (y: 4480..5220) */}
            <div style={{ position: 'absolute', top: 4484, left: 57, width: 742 }}>
              <div className="font-mono" style={{ fontSize: 19, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 28 }}>
                04 / PERMISSIONS
              </div>
              <h2 style={{ fontSize: 58, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.025em', color: '#0B0E0C', marginBottom: 22 }}>
                Clear responsibility
                <br />
                at every boundary.
              </h2>
              <p style={{ fontSize: 27, lineHeight: 1.42, color: '#505752' }}>
                Give each team the access it needs.
                <br />
                Keep changes and decisions visible.
              </p>
            </div>

            {/* Mobile Role Permissions Card (y: 4786..5219, x: 57..799) */}
            <div
              style={{
                position: 'absolute',
                top: 4786,
                left: 57,
                width: 742,
                height: 433,
                backgroundColor: '#FFFFFF',
                border: '1px solid #DFE4E7',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: 82,
                  padding: '0 28px',
                  borderBottom: '1px solid #E4E8ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 600, color: '#111513' }}>Role permissions</span>
                <span
                  className="av-pill"
                  style={{
                    backgroundColor: '#F5FAF6',
                    border: '1px solid #C6DAC8',
                    color: '#25422B',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 18,
                    padding: '10px 16px',
                    borderRadius: 8,
                  }}
                >
                  <span className="av-dot-green" style={{ width: 9, height: 9 }} />
                  Audit trail available
                </span>
              </div>

              {[
                { r: 'Platform owner', d: 'Manage environments' },
                { r: 'Service owner', d: 'Manage release plans' },
                { r: 'Release lead', d: 'Manage windows, can approve' },
                { r: 'Viewer', d: 'Read only' },
              ].map((item, i) => (
                <div
                  key={item.r}
                  style={{
                    height: 88,
                    padding: '0 28px',
                    borderBottom: i < 3 ? '1px solid #EAEDF2' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 23, fontWeight: 600, color: '#181E1A', marginBottom: 2 }}>{item.r}</div>
                    <div style={{ fontSize: 20, color: '#58605B' }}>{item.d}</div>
                  </div>
                  <span style={{ fontSize: 28, color: '#58605B' }}>›</span>
                </div>
              ))}
            </div>

            {/* SECTION 05 / LET'S TALK (y: 5338..6328) */}
            <div style={{ position: 'absolute', top: 5338, left: 54, width: 748 }}>
              <div className="font-mono" style={{ fontSize: 19, letterSpacing: '0.12em', color: '#4E5550', marginBottom: 42 }}>
                05 / LET’S TALK
              </div>
              <h2 style={{ fontSize: 58, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.025em', color: '#0B0E0C', marginBottom: 32 }}>
                Bring us your next release.
              </h2>
              <p style={{ fontSize: 28, lineHeight: 1.44, color: '#505752' }}>
                Show us how your team coordinates a release.
                <br />
                We’ll help you see where Avenor fits.
              </p>
            </div>

            {/* Lets Talk Sage Container (y: 5672..6328, x: 48..808) */}
            <div
              style={{
                position: 'absolute',
                top: 5672,
                left: 48,
                width: 760,
                height: 656,
                backgroundColor: '#F3F6F3',
                borderRadius: 16,
                padding: '56px 36px',
              }}
            >
              <div style={{ marginBottom: 34 }}>
                <label style={{ display: 'block', fontSize: 24, fontWeight: 500, color: '#1C221E', marginBottom: 14 }}>
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{
                    width: '100%',
                    height: 80,
                    padding: '0 24px',
                    borderRadius: 8,
                    border: '1px solid #CDD1D8',
                    backgroundColor: '#FFFFFF',
                    fontSize: 24,
                  }}
                />
              </div>

              <div style={{ marginBottom: 44 }}>
                <label style={{ display: 'block', fontSize: 24, fontWeight: 500, color: '#1C221E', marginBottom: 14 }}>
                  Team
                </label>
                <input
                  type="text"
                  placeholder="Infrastructure team"
                  value={contactTeam}
                  onChange={(e) => setContactTeam(e.target.value)}
                  style={{
                    width: '100%',
                    height: 80,
                    padding: '0 24px',
                    borderRadius: 8,
                    border: '1px solid #CDD1D8',
                    backgroundColor: '#FFFFFF',
                    fontSize: 24,
                  }}
                />
              </div>

              <button
                onClick={() => setContactSent(true)}
                className="av-interactive"
                style={{
                  width: '100%',
                  height: 108,
                  borderRadius: 10,
                  backgroundColor: '#E5EEE6',
                  border: '1px solid #6E8975',
                  color: '#111813',
                  fontSize: 28,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  marginBottom: 36,
                }}
              >
                <span>{contactSent ? 'Conversation requested ✓' : 'Request a conversation'}</span>
                <span>→</span>
              </button>

              <div style={{ fontSize: 24, color: '#4E5550' }}>We’ll reply by email.</div>
            </div>

            {/* MOBILE FOOTER (y: 6411..7067) */}
            <footer
              style={{
                position: 'absolute',
                top: 6411,
                left: 50,
                width: 755,
                borderTop: '1px solid #CCD0D7',
                paddingTop: 68,
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.03em', color: '#0B0E0C', marginBottom: 14 }}>
                Avenor
              </div>
              <div style={{ fontSize: 26, color: '#505752', marginBottom: 44 }}>
                Release coordination for infrastructure teams.
              </div>

              <a
                href="mailto:hello@avenor.example"
                style={{
                  fontSize: 34,
                  color: '#111613',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 24,
                  marginBottom: 62,
                }}
              >
                <span>hello@avenor.example</span>
                <span>→</span>
              </a>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  rowGap: 26,
                  fontSize: 25,
                  color: '#39403C',
                  paddingBottom: 46,
                  borderBottom: '1px solid #E2E4E9',
                  marginBottom: 38,
                }}
              >
                <span>Product</span>
                <span>Docs</span>
                <span>Workflow</span>
                <span>Contact</span>
                <span>Security</span>
              </div>

              <div style={{ display: 'flex', gap: 44, fontSize: 22, color: '#4E5550', marginBottom: 28 }}>
                <span>Privacy</span>
                <span>Terms</span>
                <span>Status</span>
              </div>

              <div style={{ display: 'flex', gap: 38, fontSize: 22, color: '#58605B' }}>
                <span>© Avenor 2026</span>
                <span className="font-mono">UTC</span>
              </div>
            </footer>
          </div>
        </ScaledStage>
      </div>
    </div>
  );

  /* ============================================================================
   * 3. WEB APP STAGE (1536 × 1024 — 1:1 with app.png)
   * ========================================================================== */
  const renderAppStage = () => (
    <ScaledStage width={1536} height={1024} maxScale={1} bg="#FFFFFF">
      <div style={{ width: 1536, height: 1024, position: 'relative', backgroundColor: '#FFFFFF', color: '#111412', fontFamily: 'var(--font-sans)' }}>
        {/* LEFT SIDEBAR (x: 0..237, y: 0..1024) */}
        <aside
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 237,
            height: 1024,
            backgroundColor: '#F2F5F2',
            borderRight: '1px solid #E5E9E6',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => setActiveView('desktop')}
            className="av-interactive"
            style={{
              position: 'absolute',
              left: 33,
              top: 28,
              fontSize: 31,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: '#0D110E',
            }}
          >
            Avenor
          </div>

          {/* Region Selector */}
          <div
            style={{
              position: 'absolute',
              left: 33,
              top: 94,
              width: 178,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 15,
              color: '#2B322E',
              cursor: 'pointer',
            }}
          >
            <span>North region</span>
            <span style={{ fontSize: 13, color: '#555C57' }}>⌄</span>
          </div>

          {/* Nav Items */}
          <nav style={{ position: 'absolute', left: 14, top: 150, width: 211, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { id: 'Schedule', icon: '📅' },
              { id: 'Environments', icon: '🥞' },
              { id: 'Checks', icon: '☑️' },
              { id: 'People', icon: '👥' },
              { id: 'Audit', icon: '📋' },
            ].map((item) => {
              const active = activeSidebarNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSidebarNav(item.id);
                    if (item.id === 'Checks') setActiveCheckDrawer(true);
                  }}
                  style={{
                    height: 48,
                    padding: '0 18px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: active ? '#DCE9DD' : 'transparent',
                    color: active ? '#111813' : '#262D28',
                    fontWeight: active ? 500 : 400,
                    fontSize: 15.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 16, width: 20, textAlign: 'center', opacity: 0.85 }}>
                    {item.id === 'Schedule' ? '🗓' : item.id === 'Environments' ? '⬡' : item.id === 'Checks' ? '☑' : item.id === 'People' ? '👤' : '☰'}
                  </span>
                  <span>{item.id}</span>
                </button>
              );
            })}
          </nav>

          {/* Divider above New release */}
          <div style={{ position: 'absolute', left: 16, top: 438, width: 204, height: 1, backgroundColor: '#E3E7E4' }} />

          {/* New release + button (y: 465..515, x: 21..219) */}
          <button
            onClick={() => setNewReleaseModalOpen(true)}
            className="av-interactive"
            style={{
              position: 'absolute',
              left: 21,
              top: 465,
              width: 198,
              height: 50,
              borderRadius: 7,
              border: '1px solid #BCC4BE',
              backgroundColor: '#F7FAF7',
              color: '#141A16',
              fontSize: 15,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <span>New release</span>
            <span style={{ fontSize: 18, fontWeight: 400 }}>+</span>
          </button>

          {/* Bottom User & Settings */}
          <div style={{ position: 'absolute', left: 26, top: 906, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: '#DFE4E6',
                color: '#2B322E',
                fontSize: 13,
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              RP
            </span>
            <span style={{ fontSize: 14.5, color: '#272E2A' }}>Rowan Park</span>
          </div>

          <div
            onClick={() => setChangeRequestOpen(true)}
            className="av-interactive"
            style={{
              position: 'absolute',
              left: 31,
              top: 960,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 14.5,
              color: '#2B322E',
            }}
          >
            <span style={{ fontSize: 18 }}>⚙</span>
            <span>Settings</span>
          </div>
        </aside>

        {/* TOP BAR (x: 271..1503, y: 0..83) */}
        <div
          style={{
            position: 'absolute',
            left: 271,
            top: 0,
            width: 1232,
            height: 83,
            borderBottom: '1px solid #E2E6E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 15, color: '#484F4A' }}>
            <span>Platform</span>
            <span style={{ color: '#9DA4A0' }}>/</span>
            <span>Release windows</span>
            <span style={{ color: '#9DA4A0' }}>/</span>
            <span style={{ color: '#141916', fontWeight: 500 }}>REL-214</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div
              onClick={() => setActiveCheckDrawer(true)}
              className="av-interactive"
              style={{
                width: 408,
                height: 44,
                borderRadius: 7,
                border: '1px solid #DCDFE0',
                backgroundColor: '#FFFFFF',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14.5,
                color: '#5A615C',
              }}
            >
              <span style={{ fontSize: 16 }}>🔍</span>
              <span>Search releases, environments, people...</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#39403C' }}>
              <span>Help</span>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1.4px solid #58605B',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                }}
              >
                ?
              </span>
            </div>
          </div>
        </div>

        {/* PAGE HEADER ROW (y: 112..190) */}
        <div
          style={{
            position: 'absolute',
            left: 271,
            top: 112,
            width: 1232,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
              <h1 style={{ fontSize: 42, fontWeight: 600, letterSpacing: '-0.025em', color: '#0B0E0C', lineHeight: 1.05 }}>
                Edge gateway 2.8.1
              </h1>
              <span
                className="font-mono"
                style={{
                  backgroundColor: isApproved ? '#EBF5ED' : '#FDF6E4',
                  border: `1px solid ${isApproved ? '#C4DFCA' : '#E8D5A5'}`,
                  color: isApproved ? '#276738' : '#5B4310',
                  fontSize: 12.5,
                  fontWeight: 600,
                  padding: '7px 14px',
                  borderRadius: 6,
                  letterSpacing: '0.03em',
                }}
              >
                {release.status}
              </span>
            </div>
            <div style={{ fontSize: 17.5, color: '#4B524E', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Thu 05 Nov 2026</span>
              <span>·</span>
              <span className="font-mono" style={{ fontSize: 16.5 }}>14:00 – 14:30 UTC</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 22, paddingTop: 4 }}>
            <span className="font-mono" style={{ fontSize: 15, color: '#484F4A' }}>13:46 UTC</span>
            <button
              onClick={() => {
                setShareToast(true);
                setTimeout(() => setShareToast(false), 2500);
              }}
              className="av-interactive"
              style={{
                width: 152,
                height: 48,
                borderRadius: 7,
                border: '1px solid #CFD5D2',
                backgroundColor: '#FFFFFF',
                color: '#161C18',
                fontSize: 15,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <span>↑</span>
              <span>{shareToast ? 'Link copied!' : 'Share plan'}</span>
            </button>
          </div>
        </div>

        {/* LEFT MAIN CARD (x: 270..1011, y: 214..1000 => width: 741, height: 786) */}
        <div
          style={{
            position: 'absolute',
            left: 270,
            top: 214,
            width: 741,
            height: 786,
            backgroundColor: '#FFFFFF',
            border: '1px solid #DCE2DE',
            borderRadius: 10,
            padding: '22px 18px',
          }}
        >
          {/* Section 1: Environment readiness */}
          <div style={{ fontSize: 20, fontWeight: 600, color: '#111513', marginBottom: 18 }}>
            Environment readiness
          </div>

          {/* Bordered Table (x: 288..993 => width 705, y: 275..462 => height 187) */}
          <div
            style={{
              border: '1px solid #DFE5E1',
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 22,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '190px 146px 159px 1fr',
                height: 42,
                backgroundColor: '#FAFBFB',
                borderBottom: '1px solid #E7EAE9',
                fontSize: 13.5,
                color: '#464D48',
              }}
            >
              <div style={{ paddingLeft: 16, borderRight: '1px solid #E7EAE9', display: 'flex', alignItems: 'center', fontWeight: 500 }}>Environment</div>
              <div style={{ paddingLeft: 16, borderRight: '1px solid #E7EAE9', display: 'flex', alignItems: 'center' }}>Current</div>
              <div style={{ paddingLeft: 16, borderRight: '1px solid #E7EAE9', display: 'flex', alignItems: 'center' }}>Proposed</div>
              <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center' }}>State</div>
            </div>

            {[
              { env: 'stage-eu-west', cur: '2.8.1', prop: '2.8.1', st: 'Validated', validated: true, tint: false },
              { env: 'prod-eu-west', cur: '2.8.0', prop: '2.8.1', st: 'Window reserved', validated: false, tint: true },
              { env: 'prod-us-east', cur: '2.8.0', prop: '2.8.1', st: 'Window reserved', validated: false, tint: true },
            ].map((r, i) => (
              <div
                key={r.env}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '190px 146px 159px 1fr',
                  height: 48,
                  backgroundColor: r.tint ? '#EDF5EE' : '#FFFFFF',
                  borderBottom: i < 2 ? '1px solid #E3EAE4' : 'none',
                  fontSize: 14.5,
                  color: '#171D19',
                }}
              >
                <div className="font-mono" style={{ paddingLeft: 16, borderRight: '1px solid #E1E7E3', display: 'flex', alignItems: 'center' }}>
                  {r.env}
                </div>
                <div className="font-mono" style={{ paddingLeft: 16, borderRight: '1px solid #E1E7E3', display: 'flex', alignItems: 'center' }}>
                  {r.cur}
                </div>
                <div className="font-mono" style={{ paddingLeft: 16, borderRight: '1px solid #E1E7E3', display: 'flex', alignItems: 'center' }}>
                  {r.prop}
                </div>
                <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {r.validated ? (
                    <CheckCircleIcon size={18} />
                  ) : (
                    <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#78A682', display: 'inline-block', marginLeft: 3 }} />
                  )}
                  <span>{r.st}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, backgroundColor: '#E9ECEB', marginBottom: 22 }} />

          {/* Section 2: Verification 6 / 6 passed */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: '#111513' }}>Verification</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#216634' }}>6 / 6 passed</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '332px 1fr',
              columnGap: 30,
              marginBottom: 22,
            }}
          >
            {[
              ['Image signed', 'Backout plan'],
              ['Change reviewed', 'On-call coverage'],
              ['Staging smoke', 'Window conflict'],
            ].map((pair, rIdx) => (
              <React.Fragment key={rIdx}>
                {pair.map((name) => (
                  <div
                    key={name}
                    onClick={() => openCheckByName(name)}
                    className="av-interactive"
                    style={{
                      height: 47,
                      borderBottom: rIdx < 2 ? '1px solid #F2F4F4' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      fontSize: 14.5,
                      color: '#1E2420',
                    }}
                  >
                    <CheckCircleIcon size={21} />
                    <span>{name}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div style={{ height: 1, backgroundColor: '#E9ECEB', marginBottom: 20 }} />

          {/* Section 3: Reserved window */}
          <div style={{ fontSize: 19, fontWeight: 600, color: '#111513', marginBottom: 18 }}>
            Reserved window
          </div>

          {/* Timeline Chart */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            {/* Time Labels */}
            <div
              className="font-mono"
              style={{
                display: 'grid',
                gridTemplateColumns: '107px 179px 185px 179px 1fr',
                fontSize: 12,
                color: '#4E5550',
                marginBottom: 8,
              }}
            >
              <div />
              <div>13:30 UTC</div>
              <div>14:00 UTC</div>
              <div>14:30 UTC</div>
              <div>15:00 UTC</div>
            </div>

            {/* Two Environment Timeline Rows */}
            {['prod-eu-west', 'prod-us-east'].map((env, idx) => (
              <div
                key={env}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '125px 179px 185px 179px 1fr',
                  height: 42,
                  alignItems: 'center',
                }}
              >
                <div className="font-mono" style={{ fontSize: 13, color: '#434A45', paddingLeft: 10 }}>
                  {env}
                </div>
                <div
                  style={{
                    height: '100%',
                    borderLeft: '1px solid #DCE2DE',
                    borderRight: '1px dashed #B5C6B8',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: '#ECEEEF' }} />
                </div>
                <div
                  style={{
                    height: '100%',
                    borderRight: '1px dashed #B5C6B8',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 0',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 32,
                      backgroundColor: '#E1EFE2',
                      border: '1px solid #C8DDCA',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: '#1E3924',
                    }}
                  >
                    Edge gateway 2.8.1
                  </div>
                </div>
                <div
                  style={{
                    height: '100%',
                    borderRight: '1px solid #DCE2DE',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: '#ECEEEF' }} />
                </div>
                <div style={{ height: '100%', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: '#ECEEEF' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 14, color: '#4E5550', marginBottom: 18 }}>
            {isApproved ? 'Rollout armed for 14:00 UTC.' : 'Rollout not started.'}
          </div>

          <div style={{ height: 1, backgroundColor: '#E9ECEB', marginBottom: 16 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#3F4641' }}>
            <ClockIcon size={18} />
            <span className="font-mono" style={{ fontSize: 13.5 }}>13:42</span>
            <span>·</span>
            <span>Maya Chen approved the window.</span>
          </div>
        </div>

        {/* RIGHT DECISION CARD (x: 1028..1512, y: 214..1000 => width: 484, height: 786) */}
        <div
          style={{
            position: 'absolute',
            left: 1028,
            top: 214,
            width: 484,
            height: 786,
            backgroundColor: '#FFFFFF',
            border: '1px solid #DCE2DE',
            borderRadius: 10,
            padding: '22px 20px',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 600, color: '#111513', paddingBottom: 18, borderBottom: '1px solid #EEF0F2', marginBottom: 16 }}>
            Release decision
          </div>

          <div style={{ fontSize: 15, fontWeight: 500, color: '#1B211D', marginBottom: 18 }}>
            {isApproved ? '2 of 2 approvals' : '1 of 2 approvals'}
          </div>

          {/* Maya Chen Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 20,
              borderBottom: '1px solid #F0F2F3',
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  backgroundColor: '#E5F0E6',
                  color: '#1E4627',
                  fontSize: 15,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                MC
              </span>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 600, color: '#141A16', marginBottom: 2 }}>Maya Chen</div>
                <div style={{ fontSize: 14, color: '#58605B' }}>Infrastructure</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#EDF6EE',
                  border: '1px solid #C5DEC8',
                  color: '#215B30',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '4px 14px',
                  borderRadius: 5,
                  marginBottom: 4,
                }}
              >
                Approved
              </div>
              <div className="font-mono" style={{ fontSize: 12.5, color: '#4E5550' }}>13:42 UTC</div>
            </div>
          </div>

          {/* Rowan Park Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 22,
              borderBottom: '1px solid #F0F2F3',
              marginBottom: 22,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  backgroundColor: '#EBEEF0',
                  color: '#232925',
                  fontSize: 15,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                RP
              </span>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 600, color: '#141A16', marginBottom: 2 }}>Rowan Park</div>
                <div style={{ fontSize: 14, color: '#58605B' }}>Release lead</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: isApproved ? '#EDF6EE' : '#FDF6E4',
                border: `1px solid ${isApproved ? '#C5DEC8' : '#E8D5A5'}`,
                color: isApproved ? '#215B30' : '#4E390D',
                fontSize: 13,
                fontWeight: 500,
                padding: '5px 18px',
                borderRadius: 5,
              }}
            >
              {isApproved ? 'Approved' : 'Pending'}
            </div>
          </div>

          {/* Key-Value Metadata List */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr',
              rowGap: 14,
              fontSize: 14,
              paddingBottom: 22,
              borderBottom: '1px solid #E9EBEE',
              marginBottom: 18,
            }}
          >
            <div style={{ color: '#4E5550' }}>Release</div>
            <div style={{ fontWeight: 500, color: '#141A16' }}>REL-214</div>

            <div style={{ color: '#4E5550' }}>Service</div>
            <div style={{ color: '#1E2420' }}>Edge gateway</div>

            <div style={{ color: '#4E5550' }}>Window</div>
            <div style={{ color: '#1E2420' }}>Thu 05 Nov 2026 · 14:00 – 14:30 UTC</div>

            <div style={{ color: '#4E5550' }}>Environments</div>
            <div className="font-mono" style={{ fontSize: 13, color: '#2B322E' }}>
              stage-eu-west, prod-eu-west, prod-us-east
            </div>

            <div style={{ color: '#4E5550' }}>Checks</div>
            <div style={{ fontWeight: 600, color: '#216634' }}>6 / 6 passed</div>
          </div>

          {/* Info Box */}
          <div
            style={{
              height: 55,
              backgroundColor: '#F7F9F8',
              border: '1px solid #EAECEC',
              borderRadius: 6,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 14,
              color: '#2B322E',
              marginBottom: 20,
            }}
          >
            <InfoCircleIcon size={20} />
            <span>
              {isApproved ? 'Window confirmed. Rollout armed for 14:00 UTC.' : 'Your approval confirms the reserved window.'}
            </span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={isApproved ? handleResetApproval : handleApproveWindow}
            className="av-interactive"
            style={{
              width: '100%',
              height: 51,
              borderRadius: 6,
              backgroundColor: '#E3EFE2',
              border: '1px solid #A5BDAA',
              color: '#111813',
              fontSize: 16,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <span>{isApproved ? 'Approved ✓ (Click to reset)' : 'Approve window'}</span>
            {!isApproved && <span>→</span>}
          </button>

          <button
            onClick={() => setChangeRequestOpen(true)}
            className="av-interactive"
            style={{
              width: '100%',
              height: 51,
              borderRadius: 6,
              backgroundColor: '#FFFFFF',
              border: '1px solid #C5C7C9',
              color: '#161C18',
              fontSize: 15.5,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 28,
            }}
          >
            Request change
          </button>

          <div style={{ textAlign: 'center', fontSize: 13.5, color: '#58605B' }}>
            Rollout starts only at the scheduled time.
          </div>
        </div>
      </div>
    </ScaledStage>
  );

  /* ============================================================================
   * 4. COMPONENT STAGE (1176 × 1337 — 1:1 with component.png)
   * ========================================================================== */
  const renderComponentStage = () => (
    <ScaledStage width={1176} height={1337} maxScale={1} bg="#FEFEFF">
      <div style={{ width: 1176, height: 1337, position: 'relative', backgroundColor: '#FEFEFF', color: '#111412', fontFamily: 'var(--font-sans)' }}>
        {/* OUTER CENTERED CARD (x: 96..1079, y: 24..1332 => width: 983, height: 1308) */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 24,
            width: 983,
            height: 1308,
            backgroundColor: '#FFFFFF',
            border: '1px solid #DCE0DF',
            borderRadius: 12,
          }}
        >
          {/* Top Header Bar (y: 0..67 inside card, x: 28..955) */}
          <div
            style={{
              margin: '0 28px',
              height: 67,
              borderBottom: '1px solid #E2E5E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              onClick={() => setActiveView('desktop')}
              className="av-interactive"
              style={{ fontSize: 29, fontWeight: 600, letterSpacing: '-0.03em', color: '#0E1210' }}
            >
              Avenor
            </span>

            <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 15.5, letterSpacing: '0.06em' }}>
              <span style={{ color: '#4E5550' }}>RELEASE WINDOW</span>
              <span style={{ color: '#8A918C' }}>/</span>
              <span style={{ fontWeight: 600, color: '#141A16' }}>REL-214</span>
            </div>
          </div>

          {/* Title + Badge + Date Row */}
          <div style={{ padding: '26px 28px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 10 }}>
              <h1 style={{ fontSize: 47, fontWeight: 600, letterSpacing: '-0.026em', color: '#0B0E0C', lineHeight: 1.05 }}>
                Edge gateway 2.8.1
              </h1>
              <span
                className="font-mono"
                style={{
                  backgroundColor: isApproved ? '#EBF5ED' : '#FDF6E4',
                  border: `1px solid ${isApproved ? '#C4DFCA' : '#E8D5A5'}`,
                  color: isApproved ? '#276738' : '#4E390D',
                  fontSize: 15,
                  fontWeight: 600,
                  padding: '9px 16px',
                  borderRadius: 6,
                  letterSpacing: '0.03em',
                }}
              >
                {release.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 22, color: '#4B524E', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span>Thu 05 Nov 2026</span>
                <span>·</span>
                <span className="font-mono" style={{ fontSize: 21 }}>14:00 – 14:30 UTC</span>
              </div>

              <span
                className="av-pill"
                style={{
                  backgroundColor: '#F5FAF6',
                  border: '1px solid #BDD1C0',
                  color: '#233B28',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15.5,
                  padding: '10px 18px',
                  borderRadius: 7,
                }}
              >
                <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#5B9468', display: 'inline-block' }} />
                Window reserved
              </span>
            </div>
          </div>

          {/* 4-Tick Timeline Strip (y: 230..315) */}
          <div style={{ padding: '4px 28px 22px' }}>
            <div
              className="font-mono"
              style={{
                display: 'grid',
                gridTemplateColumns: '290px 264px 292px 1fr',
                fontSize: 14.5,
                color: '#464D48',
                marginBottom: 10,
              }}
            >
              <div>13:30 UTC</div>
              <div style={{ textAlign: 'center' }}>14:00 UTC</div>
              <div style={{ textAlign: 'center' }}>14:30 UTC</div>
              <div style={{ textAlign: 'right' }}>15:00 UTC</div>
            </div>

            <div
              style={{
                position: 'relative',
                height: 54,
                display: 'grid',
                gridTemplateColumns: '68px 290px 264px 292px 1fr',
                alignItems: 'center',
              }}
            >
              {/* Horizontal center line */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, backgroundColor: '#E2E5E7' }} />

              <div />
              <div style={{ height: '100%', borderLeft: '1px solid #DCE0E2', borderRight: '1px dashed #9EB6A3', position: 'relative' }} />
              <div
                style={{
                  height: '100%',
                  borderRight: '1px dashed #9EB6A3',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 36,
                    backgroundColor: '#E1EFE2',
                    borderTop: '1px solid #DCE9DD',
                    borderBottom: '1px solid #DCE9DD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#142217',
                  }}
                >
                  Edge gateway 2.8.1
                </div>
              </div>
              <div style={{ height: '100%', borderRight: '1px solid #DCE0E2', position: 'relative' }} />
              <div />
            </div>
          </div>

          {/* INNER SUB-CARD (x: 18..965 inside card => abs x: 114..1061, abs y: 326..1318 => width: 947, height: 992) */}
          <div
            style={{
              margin: '0 18px',
              width: 947,
              height: 992,
              border: '1px solid #E7EAEB',
              borderRadius: 10,
              padding: '20px 16px',
            }}
          >
            {/* Section 1: Environment readiness */}
            <div style={{ fontSize: 22, fontWeight: 600, color: '#111513', marginBottom: 16 }}>
              Environment readiness
            </div>

            {/* Bordered Table (width 915, height 186) */}
            <div
              style={{
                border: '1px solid #E3E8E7',
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '234px 194px 214px 1fr',
                  height: 45,
                  backgroundColor: '#FAFBFB',
                  borderBottom: '1px solid #ECEFF1',
                  fontSize: 15,
                  color: '#464D48',
                }}
              >
                <div style={{ paddingLeft: 18, borderRight: '1px solid #EEF0F2', display: 'flex', alignItems: 'center' }}>Environment</div>
                <div style={{ paddingLeft: 18, borderRight: '1px solid #EEF0F2', display: 'flex', alignItems: 'center' }}>Current</div>
                <div style={{ paddingLeft: 18, borderRight: '1px solid #EEF0F2', display: 'flex', alignItems: 'center' }}>Proposed</div>
                <div style={{ paddingLeft: 18, display: 'flex', alignItems: 'center' }}>State</div>
              </div>

              {[
                { env: 'stage-eu-west', cur: '2.8.1', prop: '2.8.1', st: 'Validated', validated: true, tint: false },
                { env: 'prod-eu-west', cur: '2.8.0', prop: '2.8.1', st: 'Window reserved', validated: false, tint: true },
                { env: 'prod-us-east', cur: '2.8.0', prop: '2.8.1', st: 'Window reserved', validated: false, tint: true },
              ].map((r, i) => (
                <div
                  key={r.env}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '234px 194px 214px 1fr',
                    height: 47,
                    backgroundColor: r.tint ? '#ECF4ED' : '#FFFFFF',
                    borderBottom: i < 2 ? '1px solid #E2EAE4' : 'none',
                    fontSize: 16,
                    color: '#161C18',
                  }}
                >
                  <div className="font-mono" style={{ paddingLeft: 18, borderRight: '1px solid #E0E8E2', display: 'flex', alignItems: 'center' }}>
                    {r.env}
                  </div>
                  <div className="font-mono" style={{ paddingLeft: 18, borderRight: '1px solid #E0E8E2', display: 'flex', alignItems: 'center' }}>
                    {r.cur}
                  </div>
                  <div className="font-mono" style={{ paddingLeft: 18, borderRight: '1px solid #E0E8E2', display: 'flex', alignItems: 'center' }}>
                    {r.prop}
                  </div>
                  <div style={{ paddingLeft: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                    {r.validated ? (
                      <CheckCircleIcon size={22} />
                    ) : (
                      <span style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#8BB394', display: 'inline-block', marginLeft: 4 }} />
                    )}
                    <span>{r.st}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, backgroundColor: '#E5E9ED', marginBottom: 20 }} />

            {/* Section 2: Verification 6 / 6 checks passed */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 14 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#111513' }}>Verification</span>
              <span style={{ fontSize: 18, fontWeight: 500, color: '#1F6332' }}>6 / 6 checks passed</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '444px 1fr',
                columnGap: 28,
                marginBottom: 22,
              }}
            >
              {[
                ['Image signed', 'Backout plan'],
                ['Change reviewed', 'On-call coverage'],
                ['Staging smoke', 'Window conflict'],
              ].map((pair, rIdx) => (
                <React.Fragment key={rIdx}>
                  {pair.map((name) => (
                    <div
                      key={name}
                      onClick={() => openCheckByName(name)}
                      className="av-interactive"
                      style={{
                        height: 50,
                        borderBottom: rIdx < 2 ? '1px solid #EAECEF' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        fontSize: 16,
                        color: '#1E2420',
                      }}
                    >
                      <CheckCircleIcon size={25} />
                      <span>{name}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div style={{ height: 1, backgroundColor: '#EAECF0', marginBottom: 20 }} />

            {/* Section 3: Approvals */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 14 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#111513' }}>Approvals</span>
              <span style={{ fontSize: 17, color: '#4E5550' }}>
                {isApproved ? '2 of 2 approvals' : '1 of 2 approvals'}
              </span>
            </div>

            {/* Maya Chen Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0 16px',
                borderBottom: '1px solid #E8EBF0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#E5F0E6',
                    color: '#1E4627',
                    fontSize: 16,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  MC
                </span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#141A16', marginBottom: 2 }}>Maya Chen</div>
                  <div style={{ fontSize: 15, color: '#58605B' }}>Infrastructure</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#EDF6EE',
                    border: '1px solid #BDD6C0',
                    color: '#215B30',
                    fontSize: 14,
                    fontWeight: 500,
                    padding: '4px 16px',
                    borderRadius: 5,
                    marginBottom: 4,
                  }}
                >
                  Approved
                </div>
                <div className="font-mono" style={{ fontSize: 13.5, color: '#4E5550' }}>13:42 UTC</div>
              </div>
            </div>

            {/* Rowan Park Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0 16px',
                borderBottom: '1px solid #EEF0F3',
                marginBottom: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#EBEEF0',
                    color: '#232925',
                    fontSize: 16,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  RP
                </span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#141A16', marginBottom: 2 }}>Rowan Park</div>
                  <div style={{ fontSize: 15, color: '#58605B' }}>Release lead</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: isApproved ? '#EDF6EE' : '#FDF6E4',
                  border: `1px solid ${isApproved ? '#BDD6C0' : '#E8D5A5'}`,
                  color: isApproved ? '#215B30' : '#4E390D',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '5px 20px',
                  borderRadius: 5,
                }}
              >
                {isApproved ? 'Approved' : 'Pending'}
              </div>
            </div>

            {/* 2-Column Metadata Grid (separated by vertical rule at x=654) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '522px 1fr',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '128px 1fr',
                  rowGap: 11,
                  fontSize: 15,
                  borderRight: '1px solid #ECEFF2',
                  paddingRight: 20,
                }}
              >
                <div style={{ color: '#58605B' }}>Release</div>
                <div style={{ fontWeight: 500, color: '#141A16' }}>REL-214</div>

                <div style={{ color: '#58605B' }}>Service</div>
                <div style={{ color: '#1E2420' }}>Edge gateway</div>

                <div style={{ color: '#58605B' }}>Window</div>
                <div style={{ color: '#1E2420' }}>Thu 05 Nov 2026 · 14:00 – 14:30 UTC</div>

                <div style={{ color: '#58605B' }}>Environments</div>
                <div className="font-mono" style={{ fontSize: 14, color: '#2B322E' }}>
                  stage-eu-west, prod-eu-west, prod-us-east
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  rowGap: 11,
                  fontSize: 15,
                  paddingLeft: 32,
                  alignContent: 'start',
                }}
              >
                <div style={{ color: '#58605B' }}>Current reviewer</div>
                <div style={{ fontWeight: 500, color: '#141A16' }}>Rowan Park</div>

                <div style={{ color: '#58605B' }}>Current time</div>
                <div className="font-mono" style={{ fontSize: 14.5, color: '#1E2420' }}>13:46 UTC</div>

                <div style={{ color: '#58605B' }}>Rollout status</div>
                <div style={{ color: '#1E2420' }}>
                  {isApproved ? 'Rollout armed.' : 'Rollout not started.'}
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div
              style={{
                height: 41,
                backgroundColor: '#F7F9F8',
                border: '1px solid #E6E8EA',
                borderRadius: 6,
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14.5,
                color: '#2B322E',
                marginBottom: 15,
              }}
            >
              <InfoCircleIcon size={20} />
              <span>
                {isApproved ? 'Window confirmed. Click below to reset demo state.' : 'Your approval confirms the reserved window.'}
              </span>
            </div>

            {/* Full-Width Approve & Request Change Buttons */}
            <button
              onClick={isApproved ? handleResetApproval : handleApproveWindow}
              className="av-interactive"
              style={{
                width: '100%',
                height: 42,
                borderRadius: 6,
                backgroundColor: '#E5EFE4',
                border: '1px solid #8EB296',
                color: '#111813',
                fontSize: 16,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginBottom: 9,
              }}
            >
              <span>{isApproved ? 'Approved ✓ (Reset demo state)' : 'Approve window'}</span>
              {!isApproved && <span>→</span>}
            </button>

            <button
              onClick={() => setChangeRequestOpen(true)}
              className="av-interactive"
              style={{
                width: '100%',
                height: 41,
                borderRadius: 6,
                backgroundColor: '#FFFFFF',
                border: '1px solid #B9BDBF',
                color: '#161C18',
                fontSize: 15.5,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Request change
            </button>
          </div>
        </div>
      </div>
    </ScaledStage>
  );

  const activeStage =
    activeView === 'desktop'
      ? renderDesktopStage()
      : activeView === 'mobile'
      ? renderMobileStage()
      : activeView === 'app'
      ? renderAppStage()
      : renderComponentStage();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#FAFBF9' }}>
      {compareMode === 'side' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16, alignItems: 'start' }}>
          <div style={{ border: '1px solid #D5DBD7', borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
            <div className="font-mono" style={{ padding: '8px 14px', borderBottom: '1px solid #E8ECE9', fontSize: 11, color: '#454C47' }}>
              LIVE INTERACTIVE STAGE ({activeView} · {stageDims[activeView].w}×{stageDims[activeView].h})
            </div>
            {activeStage}
          </div>
          <div style={{ border: '1px solid #D5DBD7', borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF', position: 'sticky', top: 16 }}>
            <div className="font-mono" style={{ padding: '8px 14px', borderBottom: '1px solid #E8ECE9', fontSize: 11, color: '#454C47' }}>
              CANONICAL REFERENCE PNG ({referenceImageForView[activeView]})
            </div>
            <img
              src={referenceImageForView[activeView]}
              alt="Reference PNG"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {activeStage}
          {compareMode === 'overlay' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 400,
                display: 'flex',
                justifyContent: 'center',
                paddingTop: activeView === 'mobile' ? 20 : 0,
              }}
            >
              <img
                src={referenceImageForView[activeView]}
                alt="Reference Overlay"
                style={{
                  width: activeView === 'mobile' ? 428 : '100%',
                  maxWidth: stageDims[activeView].w,
                  height: 'auto',
                  opacity: overlayOpacity / 100,
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* CHECKS GATE DRAWER MODAL */}
      {activeCheckDrawer && (
        <div
          onClick={() => setActiveCheckDrawer(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17,20,18,0.32)',
            zIndex: 700,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520,
              maxWidth: '92vw',
              height: '100%',
              backgroundColor: '#FFFFFF',
              borderLeft: '1px solid #D5DBD7',
              padding: 24,
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid #EBEEEC', marginBottom: 16 }}>
              <div>
                <div className="font-mono" style={{ fontSize: 11, color: '#616863' }}>VERIFICATION EVIDENCE GATE</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#111513' }}>REL-214 · Automated Checks</div>
              </div>
              <button
                onClick={() => setActiveCheckDrawer(false)}
                style={{
                  padding: '5px 10px',
                  border: '1px solid #D5DBD7',
                  borderRadius: 5,
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {release.checks.map((chk) => (
                <button
                  key={chk.id}
                  onClick={() => setSelectedCheck(chk)}
                  style={{
                    textAlign: 'left',
                    padding: '9px 11px',
                    borderRadius: 6,
                    border: selectedCheck.id === chk.id ? '1px solid #9CB7A2' : '1px solid #E5E8E6',
                    backgroundColor: selectedCheck.id === chk.id ? '#EDF6EE' : '#FAFBFB',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#141A16' }}>✓ {chk.name}</div>
                  <div className="font-mono" style={{ fontSize: 10.5, color: '#616863' }}>{chk.validator}</div>
                </button>
              ))}
            </div>

            <div className="font-mono" style={{ padding: 14, backgroundColor: '#161A17', color: '#E2EAE4', borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: '#8FB096', marginBottom: 8 }}>
                {selectedCheck.name} — {selectedCheck.validator} ({selectedCheck.timestamp})
              </div>
              {selectedCheck.logTrace.map((line, i) => (
                <div key={i} style={{ fontSize: 11, lineHeight: 1.5, marginBottom: 4 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CHANGE MODAL */}
      {changeRequestOpen && (
        <div
          onClick={() => setChangeRequestOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17,20,18,0.32)',
            zIndex: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D5DBD7',
              borderRadius: 10,
              padding: 24,
              maxWidth: 440,
              width: '100%',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#111513' }}>Request window change</h3>
            <p style={{ fontSize: 13.5, color: '#58605B', marginBottom: 12 }}>
              Notify Maya Chen and the Edge team before the 14:00 UTC window starts.
            </p>
            <textarea
              rows={3}
              placeholder="Reason or proposed window adjustment..."
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1px solid #D5DBD7',
                borderRadius: 6,
                marginBottom: 14,
                fontSize: 13.5,
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setChangeRequestOpen(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: '1px solid #CFD5D1',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: 13.5,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setChangeRequestOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #9CB7A2',
                  backgroundColor: '#E5EFE4',
                  color: '#111813',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: 13.5,
                }}
              >
                Submit request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW RELEASE MODAL */}
      {newReleaseModalOpen && (
        <div
          onClick={() => setNewReleaseModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17,20,18,0.32)',
            zIndex: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D5DBD7',
              borderRadius: 10,
              padding: 24,
              maxWidth: 460,
              width: '100%',
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: '#111513' }}>Reserve a release window</h3>
            <p style={{ fontSize: 13.5, color: '#58605B', marginBottom: 14 }}>
              Coordinate environments, automated checks, and required approvers around one window.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <input
                type="text"
                defaultValue="Edge gateway 2.8.2"
                style={{ padding: '8px 12px', border: '1px solid #D5DBD7', borderRadius: 6, fontSize: 13.5 }}
              />
              <input
                type="text"
                defaultValue="Fri 06 Nov 2026 · 10:00 – 10:30 UTC"
                style={{ padding: '8px 12px', border: '1px solid #D5DBD7', borderRadius: 6, fontSize: 13.5 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setNewReleaseModalOpen(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: '1px solid #CFD5D1',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: 13.5,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setNewReleaseModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #9CB7A2',
                  backgroundColor: '#E5EFE4',
                  color: '#111813',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: 13.5,
                }}
              >
                Reserve window →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM-RIGHT SWITCHER & 1:1 COMPARE BAR */}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 800,
          backgroundColor: 'rgba(255,255,255,0.96)',
          border: '1px solid #D5DBD7',
          borderRadius: 999,
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 6px 24px rgba(0,0,0,0.09)',
          backdropFilter: 'blur(8px)',
          flexWrap: 'wrap',
        }}
      >
        {(
          [
            { id: 'desktop', label: 'Desktop' },
            { id: 'mobile', label: 'Mobile' },
            { id: 'app', label: 'Web App' },
            { id: 'component', label: 'Component' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '5px 11px',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              backgroundColor: activeView === tab.id ? '#E3EDE0' : 'transparent',
              color: activeView === tab.id ? '#1B3621' : '#515852',
            }}
          >
            {tab.label}
          </button>
        ))}

        <span style={{ color: '#D5DBD7' }}>|</span>

        <span className="font-mono" style={{ fontSize: 10.5, color: '#616863', marginLeft: 2 }}>
          1:1 Compare:
        </span>
        {(['off', 'side', 'overlay'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCompareMode(m)}
            className="font-mono"
            style={{
              border: '1px solid #DFE3E0',
              borderRadius: 999,
              padding: '4px 9px',
              fontSize: 10.5,
              cursor: 'pointer',
              backgroundColor: compareMode === m ? '#111412' : '#FFFFFF',
              color: compareMode === m ? '#FFFFFF' : '#515852',
            }}
          >
            {m === 'off' ? 'Off' : m === 'side' ? 'Side-by-Side' : 'Overlay'}
          </button>
        ))}

        {compareMode === 'overlay' && (
          <input
            type="range"
            min={0}
            max={100}
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            style={{ width: 68 }}
            title={`Overlay opacity: ${overlayOpacity}%`}
          />
        )}
      </div>
    </div>
  );
}
