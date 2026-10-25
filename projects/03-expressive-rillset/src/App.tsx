import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { SCHEMA_FIELDS, SchemaField } from './data';

type ActiveView = 'desktop' | 'mobile' | 'workspace' | 'component';
type CompareMode = 'off' | 'side' | 'overlay';

/* Responsive Native-Coordinate Scaling Stage (matches reference PNG dimensions 1:1) */
function ScaledStage({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const cw = node.clientWidth;
      if (cw > 0) setScale(cw / width);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        margin: '0 auto',
        position: 'relative',
        height: `${height * scale}px`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          backgroundColor: '#FCFCFD',
          color: '#171717',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Interactive Halftone Dot-Matrix Margin Canvas for Hero Section */
function HeroHalftoneCanvas({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    const spacing = 14;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const ptr = mouseRef.current;
      for (let y = 14; y < height; y += spacing) {
        const yFade = y < 120 ? y / 120 : y > height - 180 ? Math.max(0, (height - y) / 180) : 1;
        if (yFade <= 0.02) continue;
        for (let x = 14; x < width; x += spacing) {
          const distFromCenter = Math.abs(x - width / 2);
          const innerClear = width * 0.28;
          if (distFromCenter < innerClear) continue;
          const xFactor = Math.min(1, (distFromCenter - innerClear) / (width * 0.22));
          let alpha = xFactor * yFade * 0.26;
          let r = 1.15;

          if (ptr) {
            const dx = x - ptr.x;
            const dy = y - ptr.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
              const boost = (1 - d / 120);
              alpha = Math.min(0.65, alpha + boost * 0.35);
              r = 1.15 + boost * 1.1;
            }
          }

          ctx.fillStyle = `rgba(210, 88, 45, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      mouseRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(render);
    };

    const onLeave = () => {
      mouseRef.current = null;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'none',
      }}
    />
  );
}

/* Shared SVG Icons */
const UsersIcon = ({ size = 14, color = '#6E6E6A' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="5.5" r="2.3" />
    <path d="M2 13c0-2.1 1.8-3.6 4-3.6s4 1.5 4 3.6" />
    <circle cx="11.3" cy="5.8" r="1.9" />
    <path d="M11.5 9.6c1.6.2 2.8 1.3 2.8 3.1" />
  </svg>
);

const GreenCheckCircle = ({ size = 20 }: { size?: number }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: '#16A34A',
      color: '#FFFFFF',
      flexShrink: 0,
    }}
  >
    <svg width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} viewBox="0 0 12 12" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 6.2L5 8.6L9.5 3.6" />
    </svg>
  </span>
);

const BarChartIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#8C8C88" strokeWidth="1.7" strokeLinecap="round">
    <line x1="3" y1="14" x2="3" y2="10" />
    <line x1="7" y1="14" x2="7" y2="6" />
    <line x1="11" y1="14" x2="11" y2="8.5" />
    <line x1="15" y1="14" x2="15" y2="4" />
  </svg>
);

const InfoCircleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="#646872" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="9" r="7.2" />
    <line x1="9" y1="8.2" x2="9" y2="12.5" />
    <circle cx="9" cy="5.6" r="0.6" fill="#646872" />
  </svg>
);

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('desktop');
  const [compareMode, setCompareMode] = useState<CompareMode>('off');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);

  const [selectedField, setSelectedField] = useState<SchemaField>(SCHEMA_FIELDS[0]);
  const [activeTab, setActiveTab] = useState<'Changes' | 'Schema' | 'Activity'>('Changes');
  const [fieldFilter, setFieldFilter] = useState<'All fields' | 'Added only' | 'Unchanged'>('All fields');
  const [activeDataset, setActiveDataset] = useState('Harbor routes');

  const [releaseNote, setReleaseNote] = useState('Adds regional grouping and the October routes.');
  const [audience, setAudience] = useState<'Team only' | 'Public'>('Team only');
  const [keepHistory, setKeepHistory] = useState(true);
  const [published, setPublished] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDone, setSignupDone] = useState(false);

  const referenceImageForView: Record<ActiveView, string> = {
    desktop: '/reference/desktop-homepage.png',
    mobile: '/reference/mobile-homepage.png',
    workspace: '/reference/app.png',
    component: '/reference/component.png',
  };

  const stageDims: Record<ActiveView, { width: number; height: number }> = {
    desktop: { width: 1536, height: 3072 },
    mobile: { width: 819, height: 5120 },
    workspace: { width: 1536, height: 1024 },
    component: { width: 1135, height: 1386 },
  };

  const filteredFields = SCHEMA_FIELDS.slice(0, 4).filter((f) => {
    if (fieldFilter === 'Added only') return f.change === 'Added';
    if (fieldFilter === 'Unchanged') return f.change === 'Unchanged';
    return true;
  });

  /* ============================================================================
   * 1. DESKTOP HOMEPAGE (1536 × 3072) — 1:1 WITH desktop-homepage.png
   * ============================================================================ */
  const renderDesktopHomepage = () => (
    <ScaledStage width={1536} height={3072}>
      {/* Hero Halftone Dot Margins */}
      <HeroHalftoneCanvas width={1536} height={820} />

      {/* Header (y: 0..73) */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1536px',
          height: '73px',
          borderBottom: '1px solid #E7E8EC',
          backgroundColor: 'rgba(252,252,253,0.9)',
        }}
      >
        <div
          onClick={() => setActiveView('desktop')}
          style={{
            position: 'absolute',
            left: '130px',
            top: '21px',
            fontSize: '28px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#141414',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          Rillset
        </div>

        <nav
          style={{
            position: 'absolute',
            left: '589px',
            top: '27px',
            display: 'flex',
            alignItems: 'center',
            gap: '48px',
            fontSize: '16px',
            fontWeight: 400,
            color: '#2A2A2A',
          }}
        >
          <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none' }}>Workflow</a>
          <a href="#ownership" style={{ color: 'inherit', textDecoration: 'none' }}>Teams</a>
          <a href="#cta" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
        </nav>

        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            left: '1148px',
            top: '26px',
            background: 'none',
            border: 'none',
            fontSize: '16px',
            fontWeight: 400,
            color: '#2A2A2A',
            cursor: 'pointer',
          }}
        >
          Sign in
        </button>

        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            left: '1228px',
            top: '13px',
            width: '180px',
            height: '46px',
            backgroundColor: '#FB4416',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Start a workspace
        </button>
      </header>

      {/* Section 1: Hero + Version Card + 3-Step Strip (y: 73..992) */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          top: '129px',
          left: 0,
          width: '1536px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: '#6C6C68',
        }}
      >
        DATASET PUBLICATION
      </div>

      <h1
        style={{
          position: 'absolute',
          top: '166px',
          left: 0,
          width: '1536px',
          textAlign: 'center',
          fontSize: '68px',
          fontWeight: 500,
          lineHeight: 1.07,
          letterSpacing: '-0.032em',
          color: '#141414',
        }}
      >
        A clear next version.
        <br />
        Ready for everyone.
      </h1>

      <p
        style={{
          position: 'absolute',
          top: '332px',
          left: 0,
          width: '1536px',
          textAlign: 'center',
          fontSize: '21px',
          fontWeight: 400,
          color: '#666662',
          letterSpacing: '-0.01em',
        }}
      >
        Prepare tables, review what changed, and publish a dataset your team can trust.
      </p>

      {/* Hero CTA Buttons */}
      <button
        onClick={() => setActiveView('workspace')}
        style={{
          position: 'absolute',
          left: '557px',
          top: '387px',
          width: '209px',
          height: '53px',
          backgroundColor: '#FC4213',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '17px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Start a workspace
      </button>

      <button
        onClick={() => setActiveView('workspace')}
        style={{
          position: 'absolute',
          left: '808px',
          top: '401px',
          background: 'none',
          border: 'none',
          fontSize: '17px',
          fontWeight: 500,
          color: '#1C1C1C',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span>See the workflow</span>
        <span style={{ color: '#FC4213', fontSize: '20px', lineHeight: 1 }}>→</span>
      </button>

      {/* Hero Showcase Card (x: 237..1299, y: 473..776) */}
      <div
        style={{
          position: 'absolute',
          left: '237px',
          top: '473px',
          width: '1062px',
          height: '303px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E6E7EA',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.015)',
        }}
      >
        {/* Card Header (h: 81px) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '29px',
            right: '29px',
            height: '81px',
            borderBottom: '1px solid #EEEEF1',
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: '18px', fontSize: '22px', fontWeight: 500, color: '#141414', letterSpacing: '-0.02em' }}>
            Harbor routes
          </div>
          <div style={{ position: 'absolute', left: 0, top: '48px', fontSize: '15px', color: '#767672' }}>
            Fieldworks workspace
          </div>

          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '25px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '16px',
              backgroundColor: '#F7F7F8',
              border: '1px solid #EAECEF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '13px',
              color: '#5C5C58',
            }}
          >
            <UsersIcon size={14} color="#767672" />
            <span>Team only</span>
          </div>
        </div>

        {/* Middle Comparison (y: 81..219) */}
        <div style={{ position: 'absolute', top: '81px', left: 0, right: 0, height: '138px' }}>
          {/* Left: PUBLISHED v1.3 */}
          <div style={{ position: 'absolute', left: '220px', top: '24px' }}>
            <div className="font-mono" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', color: '#787874', marginBottom: '4px' }}>
              PUBLISHED
            </div>
            <div className="font-mono" style={{ fontSize: '42px', fontWeight: 500, color: '#141414', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              v1.3
            </div>
            <div className="font-mono" style={{ fontSize: '15px', color: '#6E6E6A', marginTop: '6px' }}>
              8,420 rows · 12 fields
            </div>
          </div>

          {/* Center Arrow */}
          <div style={{ position: 'absolute', left: '511px', top: '60px', fontSize: '28px', color: '#8A8A86', fontWeight: 300 }}>
            →
          </div>

          {/* Right: READY TO PUBLISH v1.4 */}
          <div
            onClick={() => setActiveView('component')}
            style={{ position: 'absolute', left: '614px', top: '24px', cursor: 'pointer' }}
          >
            <div className="font-mono" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', color: '#FC4213', marginBottom: '4px' }}>
              READY TO PUBLISH
            </div>
            <div className="font-mono" style={{ fontSize: '42px', fontWeight: 500, color: '#FC4213', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              v1.4
            </div>
            <div className="font-mono" style={{ fontSize: '15px', color: '#6E6E6A', marginTop: '6px' }}>
              8,540 rows · 13 fields
            </div>
          </div>
        </div>

        {/* Bottom Bar (y: 219..303) */}
        <div
          style={{
            position: 'absolute',
            top: '219px',
            left: '29px',
            right: '29px',
            height: '83px',
            borderTop: '1px solid #EEEEF1',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15.5px', color: '#1E1E1E' }}>
            <BarChartIcon size={20} />
            <div>
              <strong style={{ fontWeight: 500 }}>120 rows added</strong>
              <span style={{ margin: '0 8px', color: '#8A8A86' }}>·</span>
              <span className="font-mono" style={{ fontSize: '14.5px', color: '#4A4A46' }}>service_region</span>
              <span style={{ color: '#6E6E6A' }}> added</span>
            </div>
          </div>

          {/* Vertical Divider at x=778 (relative to page -> 778 - 266 = 512) */}
          <div style={{ position: 'absolute', left: '512px', top: '24px', width: '1px', height: '34px', backgroundColor: '#E6E7EA' }} />

          {/* Right Avatars + Review Complete */}
          <div style={{ position: 'absolute', left: '576px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                color: '#484844',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              MC
            </span>
            <span
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                color: '#484844',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 500,
                marginRight: '10px',
              }}
            >
              TP
            </span>
            <GreenCheckCircle size={22} />
            <span style={{ fontSize: '15.5px', color: '#666662', marginLeft: '2px' }}>Review complete</span>
          </div>
        </div>
      </div>

      {/* 3-Step Pipeline (y: 838..935) */}
      <div id="workflow">
        {/* Step 01 */}
        <div style={{ position: 'absolute', left: '134px', top: '838px' }}>
          <div className="font-mono" style={{ fontSize: '14px', fontWeight: 500, color: '#FC4213', marginBottom: '8px' }}>
            01
          </div>
          <div style={{ fontSize: '23px', fontWeight: 500, color: '#141414', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Prepare
          </div>
          <div style={{ fontSize: '16.5px', color: '#6E6E6A' }}>Bring your tables together.</div>
        </div>

        {/* Connector 1 */}
        <div style={{ position: 'absolute', left: '375px', top: '871px', width: '258px', height: '1px', backgroundColor: '#EBECEE' }}>
          <span
            style={{
              position: 'absolute',
              left: '82px',
              top: '-10px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '1px solid #EDEFF2',
              backgroundColor: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FC4213' }} />
          </span>
        </div>

        {/* Step 02 */}
        <div style={{ position: 'absolute', left: '660px', top: '838px' }}>
          <div className="font-mono" style={{ fontSize: '14px', fontWeight: 500, color: '#FC4213', marginBottom: '8px' }}>
            02
          </div>
          <div style={{ fontSize: '23px', fontWeight: 500, color: '#141414', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Review
          </div>
          <div style={{ fontSize: '16.5px', color: '#6E6E6A' }}>Make every change visible.</div>
        </div>

        {/* Connector 2 */}
        <div style={{ position: 'absolute', left: '905px', top: '871px', width: '275px', height: '1px', backgroundColor: '#EBECEE' }}>
          <span
            style={{
              position: 'absolute',
              left: '110px',
              top: '-10px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '1px solid #EDEFF2',
              backgroundColor: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FC4213' }} />
          </span>
        </div>

        {/* Step 03 */}
        <div style={{ position: 'absolute', left: '1205px', top: '838px' }}>
          <div className="font-mono" style={{ fontSize: '14px', fontWeight: 500, color: '#FC4213', marginBottom: '8px' }}>
            03
          </div>
          <div style={{ fontSize: '23px', fontWeight: 500, color: '#141414', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Publish
          </div>
          <div style={{ fontSize: '16.5px', color: '#6E6E6A' }}>Share a stable version.</div>
        </div>
      </div>

      {/* Section 1 Bottom Hairline (y: 992) */}
      <div style={{ position: 'absolute', top: '992px', left: 0, width: '1536px', height: '1px', backgroundColor: '#EAECEF' }} />

      {/* ========================================================================
       * Section 2: BEFORE YOU PUBLISH (y: 993..2080)
       * ======================================================================== */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: '75px',
          top: '1221px',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: '#FC4213',
        }}
      >
        BEFORE YOU PUBLISH
      </div>

      <h2
        style={{
          position: 'absolute',
          left: '75px',
          top: '1262px',
          fontSize: '58px',
          fontWeight: 500,
          lineHeight: 1.08,
          letterSpacing: '-0.032em',
          color: '#141414',
        }}
      >
        See what changed.
        <br />
        Know what ships.
      </h2>

      <p
        style={{
          position: 'absolute',
          left: '75px',
          top: '1422px',
          fontSize: '21px',
          lineHeight: 1.45,
          color: '#666662',
          letterSpacing: '-0.01em',
        }}
      >
        Review new fields and changed rows together.
        <br />
        Keep the decision beside the data.
      </p>

      <button
        onClick={() => setActiveView('workspace')}
        style={{
          position: 'absolute',
          left: '75px',
          top: '1531px',
          background: 'none',
          border: 'none',
          fontSize: '18.5px',
          fontWeight: 500,
          color: '#141414',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span>Explore version reviews</span>
        <span style={{ color: '#FC4213', fontSize: '20px' }}>→</span>
      </button>

      {/* Left Quiet Hairline (y: 1691) */}
      <div style={{ position: 'absolute', left: '75px', top: '1691px', width: '486px', height: '1px', backgroundColor: '#E5E7EB' }} />

      <div
        style={{
          position: 'absolute',
          left: '75px',
          top: '1731px',
          fontSize: '15.5px',
          lineHeight: 1.48,
          color: '#767672',
        }}
      >
        The published version stays available
        <br />
        until the next one is approved.
      </div>

      {/* Right Interactive Changes Showcase Card (x: 610..1467, y: 1133..1948) */}
      <div
        style={{
          position: 'absolute',
          left: '610px',
          top: '1133px',
          width: '857px',
          height: '815px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E6E7EA',
          borderRadius: '14px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.015)',
        }}
      >
        {/* Card Header */}
        <div style={{ position: 'absolute', left: '33px', top: '26px', fontSize: '31px', fontWeight: 500, color: '#141414', letterSpacing: '-0.025em' }}>
          Harbor routes
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: '35px',
            top: '68px',
            fontSize: '23px',
            color: '#141414',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>v1.3</span>
          <span style={{ color: '#8A8A86', fontWeight: 300 }}>→</span>
          <span>v1.4</span>
        </div>

        {/* Team only pill */}
        <div
          style={{
            position: 'absolute',
            right: '33px',
            top: '28px',
            height: '34px',
            padding: '0 14px',
            borderRadius: '17px',
            backgroundColor: '#F7F7F8',
            border: '1px solid #EAECEF',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '14px',
            color: '#5C5C58',
          }}
        >
          <UsersIcon size={15} color="#767672" />
          <span>Team only</span>
        </div>

        {/* Tabs Row (y: 1299 - 1133 = 166) */}
        <div
          style={{
            position: 'absolute',
            left: '33px',
            right: '31px',
            top: '128px',
            height: '38px',
            borderBottom: '1px solid #E7E9ED',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '38px',
            fontSize: '16px',
          }}
        >
          {(['Changes', 'Schema', 'Activity'] as const).map((tab) => {
            const isAct = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 4px 12px',
                  fontSize: '16px',
                  fontWeight: isAct ? 500 : 400,
                  color: isAct ? '#FC4213' : '#6A6A66',
                  borderBottom: isAct ? '2px solid #FC4213' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Gray Summary Box (x: 33..826, y: 189..279) */}
        <div
          style={{
            position: 'absolute',
            left: '33px',
            right: '31px',
            top: '189px',
            height: '90px',
            backgroundColor: '#F8F9FA',
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
          }}
        >
          <div style={{ paddingLeft: '38px', borderRight: '1px solid #E7E9ED' }}>
            <div style={{ fontSize: '26px', color: '#141414', letterSpacing: '-0.02em' }}>
              <strong style={{ fontWeight: 600 }}>+120</strong> rows
            </div>
            <div className="font-mono" style={{ fontSize: '14.5px', color: '#6E6E6A', marginTop: '2px' }}>
              8,420 → 8,540
            </div>
          </div>
          <div style={{ paddingLeft: '38px' }}>
            <div style={{ fontSize: '26px', color: '#141414', letterSpacing: '-0.02em' }}>
              <strong style={{ fontWeight: 600 }}>+1</strong> field
            </div>
            <div className="font-mono" style={{ fontSize: '14.5px', color: '#6E6E6A', marginTop: '2px' }}>
              12 → 13
            </div>
          </div>
        </div>

        {/* Field Table / Tab View (y: 306..576) */}
        {activeTab === 'Activity' ? (
          <div style={{ position: 'absolute', left: '33px', right: '31px', top: '306px' }}>
            <div
              className="font-mono"
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr 150px',
                padding: '0 22px 12px',
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: '#787874',
                borderBottom: '1px solid #FBE3D7',
              }}
            >
              <span>TIME</span>
              <span>EVENT</span>
              <span>ACTOR</span>
            </div>
            {[
              { time: '14:22 UTC', event: 'Approved v1.4 publication readiness', actor: 'Theo Park', highlight: true },
              { time: '14:15 UTC', event: 'Approved schema addition (service_region)', actor: 'Maya Chen', highlight: false },
              { time: '13:58 UTC', event: '3 automated quality checks passed (8,540 rows)', actor: 'Rillset CI', highlight: false },
              { time: '13:49 UTC', event: 'Prepared harbor-routes-oct.csv (+120 rows)', actor: 'Data operations', highlight: false },
            ].map((act) => (
              <div
                key={act.time}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr 150px',
                  alignItems: 'center',
                  height: '60px',
                  padding: '0 22px',
                  backgroundColor: act.highlight ? '#FDF1EB' : 'transparent',
                  borderBottom: '1px solid #ECEEF1',
                  borderRadius: act.highlight ? '6px' : '0',
                }}
              >
                <span className="font-mono" style={{ fontSize: '14.5px', color: '#646460' }}>{act.time}</span>
                <span style={{ fontSize: '15.5px', fontWeight: 500, color: '#141414' }}>{act.event}</span>
                <span style={{ fontSize: '15px', color: '#4A4A46' }}>{act.actor}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ position: 'absolute', left: '33px', right: '31px', top: '306px' }}>
            {/* Table Header */}
            <div
              className="font-mono"
              style={{
                display: 'grid',
                gridTemplateColumns: '290px 250px 1fr',
                padding: '0 22px 12px',
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: '#787874',
                borderBottom: '1px solid #FBE3D7',
              }}
            >
              <span>FIELD</span>
              <span>TYPE</span>
              <span>{activeTab === 'Schema' ? 'NULLABLE / INDEX' : 'CHANGE'}</span>
            </div>

            {/* 4 Rows */}
            {SCHEMA_FIELDS.slice(0, 4).map((f) => {
              const isAdded = f.change === 'Added';
              const isSel = selectedField.name === f.name;
              return (
                <div
                  key={f.name}
                  onClick={() => setSelectedField(f)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '290px 250px 1fr',
                    alignItems: 'center',
                    height: '60px',
                    padding: '0 22px',
                    backgroundColor: isAdded ? '#FDF1EB' : isSel ? '#F6F7F9' : 'transparent',
                    borderBottom: '1px solid #ECEEF1',
                    borderRadius: isAdded || isSel ? '6px' : '0',
                    cursor: 'pointer',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '17px', fontWeight: 500, color: '#141414' }}>
                    {f.name}
                  </span>
                  <span className="font-mono" style={{ fontSize: '16px', color: '#646460' }}>
                    {f.type}
                  </span>
                  <div>
                    {activeTab === 'Schema' ? (
                      <span className="font-mono" style={{ fontSize: '14px', color: '#5A5C62' }}>
                        {f.name === 'route_id' ? 'NOT NULL · PRIMARY' : 'NOT NULL'}
                      </span>
                    ) : isAdded ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '14px',
                          backgroundColor: '#FADCD0',
                          color: '#D94618',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      >
                        Added
                      </span>
                    ) : (
                      <span style={{ fontSize: '15.5px', color: '#6E6E6A' }}>Unchanged</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Field Gray Box (y: 599..707) */}
        <div
          style={{
            position: 'absolute',
            left: '33px',
            right: '31px',
            top: '599px',
            height: '108px',
            backgroundColor: '#F8F9FA',
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: '405px 1fr',
            alignItems: 'center',
          }}
        >
          <div style={{ paddingLeft: '24px', borderRight: '1px solid #EAECEF' }}>
            <div className="font-mono" style={{ fontSize: '16.5px', fontWeight: 500, color: '#141414', marginBottom: '6px' }}>
              {selectedField.name}
            </div>
            <div style={{ fontSize: '15px', color: '#6E6E6A' }}>{selectedField.description}</div>
          </div>

          <div style={{ paddingLeft: '28px' }}>
            <div className="font-mono" style={{ fontSize: '11.5px', letterSpacing: '0.06em', color: '#787874', marginBottom: '10px' }}>
              SAMPLE VALUES
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedField.sampleValues.map((val) => (
                <span
                  key={val}
                  style={{
                    padding: '4px 16px',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E6EA',
                    fontSize: '14px',
                    color: '#2A2A28',
                  }}
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer (y: 731..815) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '731px',
            height: '84px',
            borderTop: '1px solid #E6E7EA',
            padding: '0 33px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px', color: '#6E6E6A' }}>
            <GreenCheckCircle size={22} />
            <div>
              <strong style={{ color: '#141414', fontWeight: 600 }}>3 checks passed</strong>
              <span style={{ margin: '0 6px' }}>·</span>
              <span>Route IDs unique</span>
              <span style={{ margin: '0 6px' }}>·</span>
              <span>Required values present</span>
              <span style={{ margin: '0 6px' }}>·</span>
              <span>Dates valid</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #EAECEF', paddingLeft: '18px' }}>
            <UsersIcon size={18} color="#767672" />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#141414', lineHeight: 1.2 }}>
                2 reviewers approved
              </div>
              <div style={{ fontSize: '12px', color: '#767672', marginTop: '2px' }}>
                Maya Chen, Theo Park
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
       * Section 3: CLEAR OWNERSHIP (y: 2205..2563)
       * ======================================================================== */}
      <div id="ownership">
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: '130px',
            top: '2209px',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: '#FC4213',
          }}
        >
          CLEAR OWNERSHIP
        </div>

        <h2
          style={{
            position: 'absolute',
            left: '130px',
            top: '2242px',
            fontSize: '56px',
            fontWeight: 500,
            lineHeight: 1.09,
            letterSpacing: '-0.03em',
            color: '#141414',
          }}
        >
          A stable handoff,
          <br />
          with the right access.
        </h2>

        <p
          style={{
            position: 'absolute',
            left: '130px',
            top: '2408px',
            fontSize: '22px',
            lineHeight: 1.45,
            color: '#6E6E6A',
            letterSpacing: '-0.01em',
          }}
        >
          Each published version keeps its owner,
          <br />
          review history, and audience in one place.
        </p>

        {/* Right 3-Row Ownership Table (x: 808..1408, y: 2240..2470) */}
        <div style={{ position: 'absolute', left: '808px', top: '2238px', width: '600px' }}>
          {/* Row 1: Owner */}
          <div
            style={{
              height: '68px',
              borderBottom: '1px solid #E4E6EA',
              display: 'grid',
              gridTemplateColumns: '172px 1fr auto',
              alignItems: 'center',
              fontSize: '18px',
            }}
          >
            <span style={{ fontWeight: 500, color: '#141414' }}>Owner</span>
            <span style={{ color: '#2A2A28' }}>Data operations</span>
            <span />
          </div>

          {/* Row 2: Review */}
          <div
            style={{
              height: '87px',
              borderBottom: '1px solid #E4E6EA',
              display: 'grid',
              gridTemplateColumns: '172px 1fr auto',
              alignItems: 'center',
              fontSize: '18px',
            }}
          >
            <span style={{ fontWeight: 500, color: '#141414' }}>Review</span>
            <span style={{ fontWeight: 500, color: '#141414' }}>Maya Chen · Theo Park</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#6E6E6A' }}>
              <GreenCheckCircle size={22} />
              <span>Approved</span>
            </div>
          </div>

          {/* Row 3: Audience */}
          <div
            style={{
              height: '87px',
              display: 'grid',
              gridTemplateColumns: '172px 1fr auto',
              alignItems: 'center',
              fontSize: '18px',
            }}
          >
            <span style={{ fontWeight: 500, color: '#141414' }}>Audience</span>
            <span style={{ fontWeight: 500, color: '#141414' }}>Fieldworks team</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#6E6E6A' }}>
              <UsersIcon size={18} color="#767672" />
              <span>Team only</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
       * Section 4: CTA ROW (y: 2563..2872)
       * ======================================================================== */}
      <div id="cta">
        <div style={{ position: 'absolute', left: '77px', top: '2563px', width: '1385px', height: '1px', backgroundColor: '#EAECEF' }} />

        <h2
          style={{
            position: 'absolute',
            left: '130px',
            top: '2658px',
            fontSize: '46px',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#141414',
          }}
        >
          Make your next version clear.
        </h2>

        <p
          style={{
            position: 'absolute',
            left: '130px',
            top: '2722px',
            fontSize: '22px',
            color: '#6E6E6A',
            letterSpacing: '-0.01em',
          }}
        >
          Start with one table. Publish when it is ready.
        </p>

        {/* Form Input + Button (x: 808..1408, y: 2665..2728) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSignupDone(true);
          }}
          style={{ position: 'absolute', left: '808px', top: '2665px' }}
        >
          <div style={{ display: 'flex', gap: '14px' }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              style={{
                width: '375px',
                height: '63px',
                padding: '0 22px',
                borderRadius: '8px',
                border: '1px solid #DFE1E6',
                backgroundColor: '#FFFFFF',
                fontSize: '17px',
                color: '#141414',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                width: '211px',
                height: '63px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#FC4213',
                color: '#FFFFFF',
                fontSize: '17.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {signupDone ? 'Workspace ready ✓' : 'Create workspace'}
            </button>
          </div>
          <div style={{ fontSize: '14px', color: '#787874', marginTop: '14px' }}>
            No card required.
          </div>
        </form>
      </div>

      {/* ========================================================================
       * Footer (y: 2872..3072)
       * ======================================================================== */}
      <div style={{ position: 'absolute', left: 0, top: '2872px', width: '1536px', height: '1px', backgroundColor: '#EAECEF' }} />

      <div
        style={{
          position: 'absolute',
          left: '130px',
          top: '2908px',
          fontSize: '28px',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          color: '#141414',
        }}
      >
        Rillset
      </div>

      <div
        style={{
          position: 'absolute',
          right: '128px',
          top: '2916px',
          display: 'flex',
          gap: '48px',
          fontSize: '16px',
          color: '#6E6E6A',
        }}
      >
        <span>Workflow</span>
        <span>Pricing</span>
        <span>Documentation</span>
        <span>Contact</span>
      </div>

      <div style={{ position: 'absolute', left: '130px', top: '2971px', width: '1278px', height: '1px', backgroundColor: '#E3E5EA' }} />

      <div style={{ position: 'absolute', left: '130px', top: '2998px', fontSize: '14.5px', color: '#787874' }}>
        © 2026 Rillset
      </div>

      <div style={{ position: 'absolute', right: '128px', top: '2998px', fontSize: '14.5px', color: '#787874', display: 'flex', gap: '12px' }}>
        <span>Privacy</span>
        <span>·</span>
        <span>Terms</span>
      </div>
    </ScaledStage>
  );

  /* ============================================================================
   * 2. MOBILE HOMEPAGE (819 × 5120) — 1:1 WITH mobile-homepage.png
   * ============================================================================ */
  const renderMobileHomepage = () => (
    <ScaledStage width={819} height={5120}>
      {/* Header (y: 0..109) */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '819px',
          height: '109px',
          borderBottom: '1px solid #EAECEF',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '64px',
            top: '32px',
            fontSize: '39px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#141414',
          }}
        >
          Rillset
        </div>

        <button
          onClick={() => setActiveView('workspace')}
          aria-label="Open menu"
          style={{
            position: 'absolute',
            left: '717px',
            top: '41px',
            width: '42px',
            height: '30px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ display: 'block', width: '42px', height: '2.5px', backgroundColor: '#1E1E1E' }} />
          <span style={{ display: 'block', width: '42px', height: '2.5px', backgroundColor: '#1E1E1E' }} />
          <span style={{ display: 'block', width: '42px', height: '2.5px', backgroundColor: '#1E1E1E' }} />
        </button>
      </header>

      {/* Hero Section */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          top: '173px',
          left: 0,
          width: '819px',
          textAlign: 'center',
          fontSize: '19px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: '#6E6E6A',
        }}
      >
        DATASET PUBLICATION
      </div>

      <h1
        style={{
          position: 'absolute',
          top: '230px',
          left: 0,
          width: '819px',
          textAlign: 'center',
          fontSize: '68px',
          fontWeight: 500,
          lineHeight: 1.12,
          letterSpacing: '-0.03em',
          color: '#141414',
        }}
      >
        A clear next version.
        <br />
        Ready for everyone.
      </h1>

      <p
        style={{
          position: 'absolute',
          top: '412px',
          left: '70px',
          width: '679px',
          textAlign: 'center',
          fontSize: '27px',
          lineHeight: 1.45,
          color: '#666662',
        }}
      >
        Prepare tables, review what changed, and publish
        <br />
        a dataset your team can trust.
      </p>

      <button
        onClick={() => setActiveView('workspace')}
        style={{
          position: 'absolute',
          left: '61px',
          top: '537px',
          width: '697px',
          height: '82px',
          backgroundColor: '#F45123',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '12px',
          fontSize: '27px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Start a workspace
      </button>

      <button
        onClick={() => setActiveView('workspace')}
        style={{
          position: 'absolute',
          left: 0,
          top: '654px',
          width: '819px',
          background: 'none',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          fontSize: '26px',
          fontWeight: 500,
          color: '#141414',
          cursor: 'pointer',
        }}
      >
        <span>See the workflow</span>
        <span style={{ color: '#F45123', fontSize: '28px' }}>→</span>
      </button>

      {/* Mobile Hero Card (x: 48..772, y: 747..1547) */}
      <div
        style={{
          position: 'absolute',
          left: '48px',
          top: '747px',
          width: '724px',
          height: '800px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E6EA',
          borderRadius: '18px',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            position: 'absolute',
            left: '35px',
            right: '35px',
            top: 0,
            height: '134px',
            borderBottom: '1px solid #EAECEF',
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: '28px', fontSize: '34px', fontWeight: 500, color: '#141414' }}>
            Harbor routes
          </div>
          <div style={{ position: 'absolute', left: 0, top: '76px', fontSize: '24px', color: '#767672' }}>
            Fieldworks workspace
          </div>

          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '35px',
              height: '52px',
              padding: '0 20px',
              borderRadius: '26px',
              backgroundColor: '#F7F7F8',
              border: '1px solid #EAECEF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '21px',
              color: '#5C5C58',
            }}
          >
            <UsersIcon size={22} color="#767672" />
            <span>Team only</span>
          </div>
        </div>

        {/* Stacked v1.3 -> v1.4 */}
        <div style={{ position: 'absolute', left: '141px', top: '176px' }}>
          <div className="font-mono" style={{ fontSize: '19px', fontWeight: 500, letterSpacing: '0.08em', color: '#767672' }}>
            PUBLISHED
          </div>
          <div className="font-mono" style={{ fontSize: '58px', fontWeight: 500, color: '#141414', lineHeight: 1.12, marginTop: '4px' }}>
            v1.3
          </div>
          <div className="font-mono" style={{ fontSize: '24px', color: '#6E6E6A', marginTop: '4px' }}>
            8,420 rows · 12 fields
          </div>
        </div>

        <div style={{ position: 'absolute', left: '350px', top: '326px', fontSize: '42px', color: '#787874', fontWeight: 300 }}>
          ↓
        </div>

        <div
          onClick={() => setActiveView('component')}
          style={{ position: 'absolute', left: '141px', top: '402px', cursor: 'pointer' }}
        >
          <div className="font-mono" style={{ fontSize: '19px', fontWeight: 500, letterSpacing: '0.08em', color: '#F45123' }}>
            READY TO PUBLISH
          </div>
          <div className="font-mono" style={{ fontSize: '58px', fontWeight: 500, color: '#F45123', lineHeight: 1.12, marginTop: '4px' }}>
            v1.4
          </div>
          <div className="font-mono" style={{ fontSize: '24px', color: '#6E6E6A', marginTop: '4px' }}>
            8,540 rows · 13 fields
          </div>
        </div>

        {/* Row 1 of Footer: 120 rows added (y: 568..699) */}
        <div
          style={{
            position: 'absolute',
            left: '35px',
            right: '35px',
            top: '568px',
            height: '131px',
            borderTop: '1px solid #EAECEF',
            borderBottom: '1px solid #EAECEF',
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
        >
          <BarChartIcon size={34} />
          <div>
            <div style={{ fontSize: '24px', fontWeight: 500, color: '#141414' }}>
              <span className="font-mono">120</span> rows added
            </div>
            <div style={{ fontSize: '24px', color: '#6E6E6A', marginTop: '4px' }}>
              <span className="font-mono">service_region</span> added
            </div>
          </div>
        </div>

        {/* Row 2 of Footer: MC TP | Review complete (y: 699..800) */}
        <div
          style={{
            position: 'absolute',
            left: '35px',
            right: '35px',
            top: '699px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '21px',
              fontWeight: 500,
              color: '#484844',
            }}
          >
            MC
          </span>
          <span
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '21px',
              fontWeight: 500,
              color: '#484844',
            }}
          >
            TP
          </span>

          <div style={{ width: '1px', height: '46px', backgroundColor: '#E4E6EA', margin: '0 14px' }} />

          <GreenCheckCircle size={36} />
          <span style={{ fontSize: '23px', color: '#666662', marginLeft: '4px' }}>Review complete</span>
        </div>
      </div>

      {/* Divider at y: 1587 */}
      <div style={{ position: 'absolute', left: '51px', top: '1587px', width: '718px', height: '1px', backgroundColor: '#E9EBEE' }} />

      {/* Mobile 3-Step Vertical Pipeline (y: 1666..2045) */}
      {[
        { num: '01', title: 'Prepare', desc: 'Bring your tables together.', y: 1666, line: true },
        { num: '02', title: 'Review', desc: 'Make every change visible.', y: 1812, line: true },
        { num: '03', title: 'Publish', desc: 'Share a stable version.', y: 1958, line: false },
      ].map((st) => (
        <div key={st.num} style={{ position: 'absolute', left: '76px', top: `${st.y}px` }}>
          <div
            className="font-mono"
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#FDF1EB',
              color: '#F45123',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '21px',
              fontWeight: 500,
            }}
          >
            {st.num}
          </div>
          {st.line && (
            <div style={{ position: 'absolute', left: '27px', top: '62px', width: '1px', height: '76px', backgroundColor: '#E4E6EA' }} />
          )}
          <div style={{ position: 'absolute', left: '94px', top: '2px', width: '500px' }}>
            <div style={{ fontSize: '33px', fontWeight: 500, color: '#141414', lineHeight: 1.15 }}>{st.title}</div>
            <div style={{ fontSize: '25px', color: '#6E6E6A', marginTop: '6px' }}>{st.desc}</div>
          </div>
        </div>
      ))}

      {/* Mobile BEFORE YOU PUBLISH */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: '63px',
          top: '2128px',
          fontSize: '19px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: '#F45123',
        }}
      >
        BEFORE YOU PUBLISH
      </div>

      <h2
        style={{
          position: 'absolute',
          left: '63px',
          top: '2166px',
          fontSize: '64px',
          fontWeight: 500,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#141414',
        }}
      >
        See what changed.
        <br />
        Know what ships.
      </h2>

      <p
        style={{
          position: 'absolute',
          left: '63px',
          top: '2324px',
          fontSize: '27px',
          lineHeight: 1.42,
          color: '#666662',
        }}
      >
        Review new fields and changed rows together.
        <br />
        Keep the decision beside the data.
      </p>

      <button
        onClick={() => setActiveView('workspace')}
        style={{
          position: 'absolute',
          left: '63px',
          top: '2434px',
          background: 'none',
          border: 'none',
          fontSize: '26px',
          fontWeight: 500,
          color: '#141414',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
        }}
      >
        <span>Explore version reviews</span>
        <span style={{ color: '#F45123', fontSize: '28px' }}>→</span>
      </button>

      {/* Mobile Changes Card (x: 43..776, y: 2508..3374) */}
      <div
        style={{
          position: 'absolute',
          left: '43px',
          top: '2508px',
          width: '733px',
          height: '866px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E5EA',
          borderRadius: '18px',
        }}
      >
        <div style={{ position: 'absolute', left: '34px', top: '26px', fontSize: '34px', fontWeight: 500, color: '#141414' }}>
          Harbor routes
        </div>
        <div className="font-mono" style={{ position: 'absolute', left: '36px', top: '74px', fontSize: '25px', color: '#141414' }}>
          v1.3 <span style={{ color: '#8A8A86' }}>→</span> v1.4
        </div>

        <div
          style={{
            position: 'absolute',
            right: '32px',
            top: '30px',
            height: '46px',
            padding: '0 18px',
            borderRadius: '23px',
            backgroundColor: '#F7F7F8',
            border: '1px solid #EAECEF',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '19px',
            color: '#5C5C58',
          }}
        >
          <UsersIcon size={19} color="#767672" />
          <span>Team only</span>
        </div>

        {/* Tabs */}
        <div
          style={{
            position: 'absolute',
            left: '30px',
            right: '30px',
            top: '132px',
            height: '44px',
            borderBottom: '1px solid #E4E7EC',
            display: 'flex',
            gap: '44px',
            fontSize: '20px',
          }}
        >
          <span style={{ color: '#F45123', fontWeight: 500, borderBottom: '3px solid #F45123', paddingBottom: '10px' }}>Changes</span>
          <span style={{ color: '#6E6E6A' }}>Schema</span>
          <span style={{ color: '#6E6E6A' }}>Activity</span>
        </div>

        {/* Gray Summary Box */}
        <div
          style={{
            position: 'absolute',
            left: '30px',
            right: '30px',
            top: '194px',
            height: '104px',
            backgroundColor: '#F8F9FA',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
          }}
        >
          <div style={{ paddingLeft: '36px', borderRight: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '30px', color: '#141414' }}>
              <strong style={{ fontWeight: 600 }}>+120</strong> rows
            </div>
            <div className="font-mono" style={{ fontSize: '18px', color: '#6E6E6A', marginTop: '2px' }}>
              8,420 → 8,540
            </div>
          </div>
          <div style={{ paddingLeft: '36px' }}>
            <div style={{ fontSize: '30px', color: '#141414' }}>
              <strong style={{ fontWeight: 600 }}>+1</strong> field
            </div>
            <div className="font-mono" style={{ fontSize: '18px', color: '#6E6E6A', marginTop: '2px' }}>
              12 → 13
            </div>
          </div>
        </div>

        {/* Mobile Table */}
        <div style={{ position: 'absolute', left: '30px', right: '30px', top: '326px' }}>
          <div
            className="font-mono"
            style={{
              display: 'grid',
              gridTemplateColumns: '285px 210px 1fr',
              padding: '0 20px 14px',
              fontSize: '15px',
              letterSpacing: '0.06em',
              color: '#787874',
              borderBottom: '1px solid #FBE3D7',
            }}
          >
            <span>FIELD</span>
            <span>TYPE</span>
            <span>CHANGE</span>
          </div>

          {SCHEMA_FIELDS.slice(0, 4).map((f) => {
            const isAdded = f.change === 'Added';
            return (
              <div
                key={f.name}
                onClick={() => setSelectedField(f)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '285px 210px 1fr',
                  alignItems: 'center',
                  height: '62px',
                  padding: '0 20px',
                  backgroundColor: isAdded ? '#FDF1EB' : 'transparent',
                  borderBottom: '1px solid #EAECEF',
                  cursor: 'pointer',
                }}
              >
                <span className="font-mono" style={{ fontSize: '21px', fontWeight: 500, color: '#141414' }}>
                  {f.name}
                </span>
                <span className="font-mono" style={{ fontSize: '20px', color: '#646460' }}>
                  {f.type}
                </span>
                <div>
                  {isAdded ? (
                    <span
                      style={{
                        padding: '5px 18px',
                        borderRadius: '16px',
                        backgroundColor: '#FADCD0',
                        color: '#D94618',
                        fontSize: '18px',
                        fontWeight: 500,
                      }}
                    >
                      Added
                    </span>
                  ) : (
                    <span style={{ fontSize: '19px', color: '#6E6E6A' }}>Unchanged</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Field Box */}
        <div
          style={{
            position: 'absolute',
            left: '30px',
            right: '30px',
            top: '634px',
            height: '116px',
            backgroundColor: '#F8F9FA',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            alignItems: 'center',
          }}
        >
          <div style={{ paddingLeft: '22px', borderRight: '1px solid #EAECEF' }}>
            <div className="font-mono" style={{ fontSize: '20px', fontWeight: 600, color: '#141414', marginBottom: '6px' }}>
              {selectedField.name}
            </div>
            <div style={{ fontSize: '18px', color: '#6E6E6A' }}>{selectedField.description}</div>
          </div>
          <div style={{ paddingLeft: '22px' }}>
            <div className="font-mono" style={{ fontSize: '14px', letterSpacing: '0.06em', color: '#787874', marginBottom: '10px' }}>
              SAMPLE VALUES
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedField.sampleValues.map((v) => (
                <span
                  key={v}
                  style={{
                    padding: '4px 16px',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E6EA',
                    fontSize: '17px',
                    color: '#1E1E1E',
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div
          style={{
            position: 'absolute',
            left: '30px',
            right: '30px',
            top: '766px',
            height: '98px',
            borderTop: '1px solid #E6E9ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <GreenCheckCircle size={38} />
            <strong style={{ fontSize: '21px', fontWeight: 600, color: '#141414' }}>3 checks passed</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '1px solid #EAECEF', paddingLeft: '26px' }}>
            <UsersIcon size={26} color="#767672" />
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: '#141414' }}>2 reviewers approved</div>
              <div style={{ fontSize: '17px', color: '#767672', marginTop: '2px' }}>Maya Chen, Theo Park</div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption under card */}
      <div style={{ position: 'absolute', left: '64px', top: '3402px', fontSize: '20px', lineHeight: 1.4, color: '#767672' }}>
        The published version stays available
        <br />
        until the next one is approved.
      </div>

      <div style={{ position: 'absolute', left: '63px', top: '3487px', width: '693px', height: '1px', backgroundColor: '#DFE1E7' }} />

      {/* Mobile CLEAR OWNERSHIP */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: '65px',
          top: '3654px',
          fontSize: '19px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: '#F45123',
        }}
      >
        CLEAR OWNERSHIP
      </div>

      <h2
        style={{
          position: 'absolute',
          left: '65px',
          top: '3702px',
          fontSize: '64px',
          fontWeight: 500,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#141414',
        }}
      >
        A stable handoff,
        <br />
        with the right access.
      </h2>

      <p
        style={{
          position: 'absolute',
          left: '65px',
          top: '3876px',
          fontSize: '29px',
          lineHeight: 1.45,
          color: '#6E6E6A',
        }}
      >
        Each published version keeps its owner,
        <br />
        review history, and audience in one place.
      </p>

      {/* 3 Ownership Rows (y: 4015..4290) */}
      <div style={{ position: 'absolute', left: '65px', top: '4010px', width: '689px' }}>
        <div
          style={{
            height: '86px',
            borderBottom: '1px solid #E6E8EB',
            display: 'grid',
            gridTemplateColumns: '180px 1fr auto',
            alignItems: 'center',
            fontSize: '24px',
          }}
        >
          <span style={{ fontWeight: 500, color: '#141414' }}>Owner</span>
          <span style={{ color: '#2A2A28' }}>Data operations</span>
          <span />
        </div>

        <div
          style={{
            height: '102px',
            borderBottom: '1px solid #E6E8EB',
            display: 'grid',
            gridTemplateColumns: '180px 1fr auto',
            alignItems: 'center',
            fontSize: '24px',
          }}
        >
          <span style={{ fontWeight: 500, color: '#141414' }}>Review</span>
          <span style={{ fontWeight: 500, color: '#141414' }}>Maya Chen · Theo Park</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '22px', color: '#767672' }}>
            <GreenCheckCircle size={32} />
            <span>Approved</span>
          </div>
        </div>

        <div
          style={{
            height: '96px',
            display: 'grid',
            gridTemplateColumns: '180px 1fr auto',
            alignItems: 'center',
            fontSize: '24px',
          }}
        >
          <span style={{ fontWeight: 500, color: '#141414' }}>Audience</span>
          <span style={{ fontWeight: 500, color: '#141414' }}>Fieldworks team</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '22px', color: '#767672' }}>
            <UsersIcon size={26} color="#767672" />
            <span>Team only</span>
          </div>
        </div>
      </div>

      {/* Divider at y: 4355 */}
      <div style={{ position: 'absolute', left: '65px', top: '4355px', width: '689px', height: '1px', backgroundColor: '#DCDEE5' }} />

      {/* Mobile CTA Row */}
      <h2
        style={{
          position: 'absolute',
          left: '65px',
          top: '4422px',
          fontSize: '52px',
          fontWeight: 500,
          letterSpacing: '-0.03em',
          color: '#141414',
        }}
      >
        Make your next version clear.
      </h2>

      <p
        style={{
          position: 'absolute',
          left: '65px',
          top: '4494px',
          fontSize: '28px',
          color: '#6E6E6A',
        }}
      >
        Start with one table. Publish when it is ready.
      </p>

      <input
        type="email"
        placeholder="you@company.com"
        value={signupEmail}
        onChange={(e) => setSignupEmail(e.target.value)}
        style={{
          position: 'absolute',
          left: '65px',
          top: '4567px',
          width: '689px',
          height: '77px',
          padding: '0 28px',
          borderRadius: '10px',
          border: '1px solid #DADCE4',
          backgroundColor: '#FFFFFF',
          fontSize: '25px',
        }}
      />

      <button
        onClick={() => setSignupDone(true)}
        style={{
          position: 'absolute',
          left: '65px',
          top: '4664px',
          width: '689px',
          height: '77px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: '#EC5227',
          color: '#FFFFFF',
          fontSize: '25px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {signupDone ? 'Workspace ready ✓' : 'Create workspace'}
      </button>

      <div style={{ position: 'absolute', left: '65px', top: '4758px', fontSize: '20px', color: '#787874' }}>
        No card required.
      </div>

      {/* Footer (y: 4849..5120) */}
      <div style={{ position: 'absolute', left: '40px', top: '4849px', width: '739px', height: '1px', backgroundColor: '#E6E8ED' }} />

      <div style={{ position: 'absolute', left: '65px', top: '4896px', fontSize: '36px', fontWeight: 600, color: '#141414' }}>
        Rillset
      </div>

      <div
        style={{
          position: 'absolute',
          left: '65px',
          top: '4960px',
          display: 'grid',
          gridTemplateColumns: '210px 200px',
          rowGap: '14px',
          fontSize: '22px',
          color: '#6E6E6A',
        }}
      >
        <span>Workflow</span>
        <span>Pricing</span>
        <span>Documentation</span>
        <span>Contact</span>
      </div>

      <div style={{ position: 'absolute', left: '65px', top: '5048px', width: '689px', height: '1px', backgroundColor: '#E5E8EC' }} />

      <div style={{ position: 'absolute', left: '65px', top: '5068px', fontSize: '20px', color: '#787874' }}>
        © 2026 Rillset
      </div>

      <div style={{ position: 'absolute', right: '65px', top: '5068px', fontSize: '20px', color: '#787874', display: 'flex', gap: '14px' }}>
        <span>Privacy</span>
        <span>·</span>
        <span>Terms</span>
      </div>
    </ScaledStage>
  );

  /* ============================================================================
   * 3. WORKSPACE APP VIEW (1536 × 1024) — 1:1 WITH app.png
   * ============================================================================ */
  const renderWorkspace = () => (
    <ScaledStage width={1536} height={1024}>
      {/* Top Bar (y: 0..74) */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1536px',
          height: '74px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EAECEF',
        }}
      >
        <div
          onClick={() => setActiveView('desktop')}
          style={{
            position: 'absolute',
            left: '42px',
            top: '20px',
            fontSize: '29px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#141414',
            cursor: 'pointer',
          }}
        >
          Rillset
        </div>

        {/* Fieldworks Dropdown */}
        <div
          style={{
            position: 'absolute',
            left: '264px',
            top: '15px',
            width: '156px',
            height: '44px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '16px',
            color: '#1E1E1E',
          }}
        >
          <span>Fieldworks</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#525250" strokeWidth="1.6">
            <path d="M3.5 5.2L7 8.8L10.5 5.2" />
          </svg>
        </div>

        {/* Right Help + MC Avatar */}
        <span style={{ position: 'absolute', left: '1377px', top: '26px', fontSize: '16px', color: '#2A2A28' }}>
          Help
        </span>
        <div
          style={{
            position: 'absolute',
            left: '1451px',
            top: '15px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            backgroundColor: '#F1F2F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 500,
            color: '#2A2A28',
          }}
        >
          MC
        </div>
      </header>

      {/* Left Sidebar (x: 0..258, y: 74..1024) */}
      <aside
        style={{
          position: 'absolute',
          left: 0,
          top: '74px',
          width: '258px',
          height: '950px',
          backgroundColor: '#FCFCFD',
          borderRight: '1px solid #EDEFF1',
        }}
      >
        {/* Datasets Active Pill */}
        <div
          style={{
            position: 'absolute',
            left: '25px',
            top: '33px',
            width: '215px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: '#FDF1EB',
            borderLeft: '4px solid #FC4213',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            paddingLeft: '16px',
            color: '#D94315',
            fontSize: '17px',
            fontWeight: 500,
          }}
        >
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="#FC4213" strokeWidth="1.6">
            <path d="M3 2h8l4 4v12H3V2z" />
            <path d="M11 2v4h4" />
            <line x1="6" y1="10" x2="12" y2="10" />
            <line x1="6" y1="14" x2="12" y2="14" />
          </svg>
          <span>Datasets</span>
        </div>

        {/* Sub-items vertical guide line */}
        <div style={{ position: 'absolute', left: '53px', top: '91px', width: '1px', height: '108px', backgroundColor: '#E5E7EB' }} />

        {/* Dataset Sub-items */}
        {[
          { name: 'Harbor routes', top: 91 },
          { name: 'Service calendar', top: 132 },
          { name: 'Stop inventory', top: 170 },
        ].map((item) => {
          const isAct = activeDataset === item.name;
          return (
            <div
              key={item.name}
              onClick={() => setActiveDataset(item.name)}
              style={{
                position: 'absolute',
                left: '68px',
                top: `${item.top}px`,
                width: '172px',
                height: '34px',
                borderRadius: '6px',
                backgroundColor: isAct ? '#FDF1EB' : 'transparent',
                color: isAct ? '#D94315' : '#4E5056',
                fontWeight: isAct ? 500 : 400,
                fontSize: '15.5px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '20px',
                cursor: 'pointer',
              }}
            >
              {item.name}
            </div>
          );
        })}

        {/* Sidebar Divider (y: 295 - 74 = 221) */}
        <div style={{ position: 'absolute', left: '39px', top: '221px', width: '196px', height: '1px', backgroundColor: '#EEEEF2' }} />

        {/* Secondary Nav Items */}
        {[
          { label: 'Review queue', top: 250, icon: 'check' },
          { label: 'Published', top: 309, icon: 'db' },
          { label: 'Members', top: 368, icon: 'users' },
        ].map((nav) => (
          <div
            key={nav.label}
            style={{
              position: 'absolute',
              left: '42px',
              top: `${nav.top}px`,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '17px',
              color: '#3E4046',
              cursor: 'pointer',
            }}
          >
            {nav.icon === 'check' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#3E4046" strokeWidth="1.6">
                <rect x="3" y="3" width="14" height="14" rx="2.5" />
                <path d="M7 10.2l2 2 4-4.2" />
              </svg>
            )}
            {nav.icon === 'db' && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#3E4046" strokeWidth="1.6">
                <ellipse cx="10" cy="5" rx="6.5" ry="2.5" />
                <path d="M3.5 5v10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5V5" />
                <path d="M3.5 10c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" />
              </svg>
            )}
            {nav.icon === 'users' && <UsersIcon size={20} color="#3E4046" />}
            <span>{nav.label}</span>
          </div>
        ))}

        {/* Bottom Settings */}
        <div
          style={{
            position: 'absolute',
            left: '41px',
            top: '871px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '17px',
            color: '#4E5056',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#3E4046" strokeWidth="1.6">
            <circle cx="11" cy="11" r="3" />
            <path d="M19 11a7.8 7.8 0 00-.1-1.3l2-1.5-2-3.4-2.3.9a8 8 0 00-2.2-1.3L14 2h-4l-.4 2.4a8 8 0 00-2.2 1.3l-2.3-.9-2 3.4 2 1.5a7.8 7.8 0 000 2.6l-2 1.5 2 3.4 2.3-.9a8 8 0 002.2 1.3L10 20h4l.4-2.4a8 8 0 002.2-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.9.1-1.3z" />
          </svg>
          <span>Settings</span>
        </div>
      </aside>

      {/* Main Content Area (x: 258..1536, y: 74..1024) */}
      {/* Breadcrumb */}
      <div style={{ position: 'absolute', left: '295px', top: '99px', fontSize: '15.5px', color: '#6E7076' }}>
        <span>Datasets</span>
        <span style={{ margin: '0 10px', color: '#9A9CA2' }}>/</span>
        <strong style={{ color: '#1E1E1E', fontWeight: 500 }}>{activeDataset}</strong>
      </div>

      {/* Title Row */}
      <h1
        style={{
          position: 'absolute',
          left: '295px',
          top: '136px',
          fontSize: '46px',
          fontWeight: 500,
          letterSpacing: '-0.03em',
          color: '#141414',
          lineHeight: 1.1,
        }}
      >
        Version v1.4
      </h1>

      {/* Ready to publish badge */}
      <div
        style={{
          position: 'absolute',
          left: '563px',
          top: '147px',
          height: '36px',
          padding: '0 16px',
          borderRadius: '18px',
          backgroundColor: '#EAF8EE',
          color: '#15803D',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '9px',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
        <span>{published ? 'Published' : 'Ready to publish'}</span>
      </div>

      {/* Top Right Action Buttons */}
      <button
        onClick={() => setActiveView('desktop')}
        style={{
          position: 'absolute',
          left: '1137px',
          top: '136px',
          width: '155px',
          height: '53px',
          borderRadius: '8px',
          border: '1px solid #DFE2E7',
          backgroundColor: '#FFFFFF',
          fontSize: '17px',
          fontWeight: 500,
          color: '#1E1E1E',
          cursor: 'pointer',
        }}
      >
        View v1.3
      </button>

      <button
        onClick={() => setActiveView('component')}
        style={{
          position: 'absolute',
          left: '1307px',
          top: '136px',
          width: '191px',
          height: '53px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#FD3E07',
          color: '#FFFFFF',
          fontSize: '17px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Publish version
      </button>

      {/* CSV Subtitle */}
      <div style={{ position: 'absolute', left: '295px', top: '198px', fontSize: '16.5px', color: '#6E7076' }}>
        <span>Prepared from </span>
        <span className="font-mono" style={{ fontSize: '15.5px' }}>harbor-routes-oct.csv</span>
        <span style={{ margin: '0 8px' }}>·</span>
        <span>Updated Oct 24, </span>
        <span className="font-mono" style={{ fontSize: '15.5px' }}>2026</span>
      </div>

      {/* Tabs Row (y: 250..287) */}
      <div
        style={{
          position: 'absolute',
          left: '284px',
          width: '1214px',
          top: '248px',
          height: '40px',
          borderBottom: '1px solid #E9EAEE',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '44px',
          paddingLeft: '12px',
        }}
      >
        {(['Changes', 'Schema', 'Activity'] as const).map((t) => {
          const isAct = activeTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 4px 12px',
                fontSize: '18px',
                fontWeight: isAct ? 500 : 400,
                color: isAct ? '#FD3E07' : '#2A2A28',
                borderBottom: isAct ? '2.5px solid #FD3E07' : '2.5px solid transparent',
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Summary Line (y: 310) */}
      <div style={{ position: 'absolute', left: '295px', top: '310px', display: 'flex', alignItems: 'baseline', gap: '28px' }}>
        <span style={{ fontSize: '20px', fontWeight: 500, color: '#141414' }}>
          8,540 rows <span style={{ margin: '0 4px', color: '#8A8A86' }}>·</span> 13 fields
        </span>
        <span style={{ fontSize: '17px', color: '#6E7076' }}>
          +120 rows <span style={{ margin: '0 4px' }}>·</span> +1 field since v1.3
        </span>
      </div>

      {/* Left Card: Field changes (x: 294..1119, y: 354..933) */}
      <div
        style={{
          position: 'absolute',
          left: '294px',
          top: '354px',
          width: '825px',
          height: '579px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAEAEF',
          borderRadius: '10px',
        }}
      >
        <div style={{ position: 'absolute', left: '24px', top: '22px', fontSize: '26px', fontWeight: 500, color: '#141414', letterSpacing: '-0.02em' }}>
          {activeTab === 'Activity' ? 'Version activity' : activeTab === 'Schema' ? 'Table schema (13 fields)' : 'Field changes'}
        </div>

        {/* Filter Select */}
        <select
          value={fieldFilter}
          onChange={(e) => setFieldFilter(e.target.value as any)}
          style={{
            position: 'absolute',
            right: '23px',
            top: '19px',
            width: '162px',
            height: '41px',
            borderRadius: '7px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            padding: '0 14px',
            fontSize: '15.5px',
            color: '#1E1E1E',
            cursor: 'pointer',
          }}
        >
          <option value="All fields">All fields</option>
          <option value="Added only">Added only</option>
          <option value="Unchanged">Unchanged</option>
        </select>

        {/* Inner Table Box (x: 22..802, y: 72..313) */}
        <div
          style={{
            position: 'absolute',
            left: '22px',
            right: '23px',
            top: '72px',
            border: '1px solid #EFEFF3',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: activeTab === 'Activity' ? '150px 1fr 160px' : '278px 228px 1fr',
              alignItems: 'center',
              height: '45px',
              padding: '0 20px',
              backgroundColor: '#FAFBFD',
              borderBottom: '1px solid #F3EAE7',
              fontSize: '14.5px',
              fontWeight: 500,
              color: '#2A2A28',
            }}
          >
            {activeTab === 'Activity' ? (
              <>
                <span>Timestamp</span>
                <span>Action</span>
                <span>Actor</span>
              </>
            ) : (
              <>
                <span>Field</span>
                <span>Type</span>
                <span>{activeTab === 'Schema' ? 'Constraint' : 'Change'}</span>
              </>
            )}
          </div>

          {activeTab === 'Activity' ? (
            [
              { t: '14:22 UTC', a: 'Approved v1.4 publication readiness', u: 'Theo Park', hi: true },
              { t: '14:15 UTC', a: 'Approved schema addition (service_region)', u: 'Maya Chen', hi: false },
              { t: '13:58 UTC', a: '3 automated quality checks passed (8,540 rows)', u: 'Rillset CI', hi: false },
              { t: '13:49 UTC', a: 'Prepared harbor-routes-oct.csv (+120 rows)', u: 'Data operations', hi: false },
            ].map((ev) => (
              <div
                key={ev.t}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr 160px',
                  alignItems: 'center',
                  height: '49px',
                  padding: '0 20px',
                  backgroundColor: ev.hi ? '#FDF1EB' : '#FFFFFF',
                  borderBottom: '1px solid #EFEFF3',
                }}
              >
                <span className="font-mono" style={{ fontSize: '14.5px', color: '#5A5C62' }}>{ev.t}</span>
                <span style={{ fontSize: '15.5px', color: '#141414' }}>{ev.a}</span>
                <span style={{ fontSize: '15px', color: '#5A5C62' }}>{ev.u}</span>
              </div>
            ))
          ) : (
            filteredFields.map((f) => {
              const isAdded = f.change === 'Added';
              const isSel = selectedField.name === f.name;
              return (
                <div
                  key={f.name}
                  onClick={() => setSelectedField(f)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '278px 228px 1fr',
                    alignItems: 'center',
                    height: '49px',
                    padding: '0 20px',
                    backgroundColor: isAdded ? '#FDF1EB' : isSel ? '#F6F7F9' : '#FFFFFF',
                    borderBottom: '1px solid #EFEFF3',
                    cursor: 'pointer',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '16px', color: '#141414' }}>
                    {f.name}
                  </span>
                  <span className="font-mono" style={{ fontSize: '15.5px', color: '#5A5C62' }}>
                    {f.type}
                  </span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '15.5px', color: isAdded ? '#4A4A46' : '#6E7076' }}>
                    {activeTab === 'Schema' ? (
                      <span className="font-mono" style={{ fontSize: '14px', color: '#5A5C62' }}>
                        {f.name === 'route_id' ? 'PRIMARY KEY · NOT NULL' : 'NOT NULL'}
                      </span>
                    ) : (
                      <>
                        <span
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            backgroundColor: isAdded ? '#16A34A' : '#9CA0A8',
                          }}
                        />
                        <span>{f.change}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Field Area (y: 332..512) */}
        <div
          style={{
            position: 'absolute',
            left: '24px',
            right: '23px',
            top: '332px',
            borderTop: '1px solid #F2F3F6',
            paddingTop: '18px',
          }}
        >
          <div className="font-mono" style={{ fontSize: '12px', letterSpacing: '0.06em', color: '#6E7076', marginBottom: '6px' }}>
            SELECTED FIELD
          </div>
          <div className="font-mono" style={{ fontSize: '23px', fontWeight: 500, color: '#141414', marginBottom: '8px' }}>
            {selectedField.name}
          </div>
          <div style={{ fontSize: '16.5px', color: '#5A5C62', marginBottom: '18px' }}>
            {selectedField.description}
          </div>

          <div className="font-mono" style={{ fontSize: '12px', letterSpacing: '0.06em', color: '#6E7076', marginBottom: '8px' }}>
            SAMPLE VALUES
          </div>
          <div
            className="font-mono"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              height: '39px',
              padding: '0 18px',
              borderRadius: '7px',
              backgroundColor: '#F5F6F8',
              fontSize: '15.5px',
              color: '#1E1E1E',
            }}
          >
            {selectedField.sampleValues.map((v, i) => (
              <React.Fragment key={v}>
                {i > 0 && <span style={{ color: '#8A8A86' }}>·</span>}
                <span>{v}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Card Footer: Showing 4 of 13 fields */}
        <div
          style={{
            position: 'absolute',
            left: '24px',
            right: '23px',
            bottom: '16px',
            paddingTop: '14px',
            borderTop: '1px solid #F1F2F5',
            fontSize: '15.5px',
            color: '#6E7076',
          }}
        >
          Showing {filteredFields.length} of 13 fields
        </div>
      </div>

      {/* Right Column Card 1: Reviewers (x: 1137..1498, y: 354..540) */}
      <div
        style={{
          position: 'absolute',
          left: '1137px',
          top: '354px',
          width: '361px',
          height: '186px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAEAEF',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            height: '60px',
            padding: '0 24px',
            borderBottom: '1px solid #F1F2F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '22px', fontWeight: 500, color: '#141414' }}>Reviewers</span>
          <span style={{ fontSize: '15px', color: '#6E7076' }}>2 of 2 approved</span>
        </div>

        {[
          { init: 'MC', name: 'Maya Chen', top: 71 },
          { init: 'TP', name: 'Theo Park', top: 124 },
        ].map((rev) => (
          <div
            key={rev.init}
            style={{
              position: 'absolute',
              left: '24px',
              right: '24px',
              top: `${rev.top}px`,
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#F1F2F5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#2A2A28',
                }}
              >
                {rev.init}
              </span>
              <span style={{ fontSize: '16.5px', color: '#1E1E1E' }}>{rev.name}</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '15.5px', color: '#16A34A', fontWeight: 500 }}>
              <GreenCheckCircle size={22} />
              <span>Approved</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column Card 2: Quality checks (x: 1137..1498, y: 558..772) */}
      <div
        style={{
          position: 'absolute',
          left: '1137px',
          top: '558px',
          width: '361px',
          height: '214px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAEAEF',
          borderRadius: '10px',
        }}
      >
        <div
          style={{
            height: '60px',
            padding: '0 24px',
            borderBottom: '1px solid #F1F2F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '22px', fontWeight: 500, color: '#141414' }}>Quality checks</span>
          <span style={{ fontSize: '15px', color: '#6E7076' }}>3 of 3 passed</span>
        </div>

        {[
          { text: 'Route IDs unique', top: 76 },
          { text: 'Required values present', top: 120 },
          { text: 'Dates valid', top: 164 },
        ].map((chk) => (
          <div
            key={chk.text}
            style={{
              position: 'absolute',
              left: '26px',
              top: `${chk.top}px`,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '16.5px',
              color: '#2A2A28',
            }}
          >
            <GreenCheckCircle size={23} />
            <span>{chk.text}</span>
          </div>
        ))}
      </div>

      {/* Right Column Card 3: Access (x: 1137..1498, y: 789..925) */}
      <div
        style={{
          position: 'absolute',
          left: '1137px',
          top: '789px',
          width: '361px',
          height: '136px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAEAEF',
          borderRadius: '10px',
          padding: '20px 24px',
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 500, color: '#141414', marginBottom: '14px' }}>
          Access
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UsersIcon size={20} color="#3E4046" />
          </span>
          <div>
            <div style={{ fontSize: '16.5px', fontWeight: 500, color: '#1E1E1E' }}>Team only</div>
            <div style={{ fontSize: '15px', color: '#6E7076', marginTop: '2px' }}>Fieldworks</div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar (x: 294..1498, y: 950..1002) */}
      <div
        style={{
          position: 'absolute',
          left: '294px',
          top: '950px',
          width: '1204px',
          height: '52px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAEAEF',
          borderRadius: '10px',
          padding: '0 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '16px',
          color: '#5A5C62',
        }}
      >
        <InfoCircleIcon size={20} />
        <span>Publishing v1.4 keeps v1.3 available in version history.</span>
      </div>
    </ScaledStage>
  );

  /* ============================================================================
   * 4. ISOLATED COMPONENT MODAL (1135 × 1386) — 1:1 WITH component.png
   * ============================================================================ */
  const renderComponent = () => (
    <ScaledStage width={1135} height={1386}>
      {/* Modal Card (x: 62..1071, y: 41..1349) */}
      <div
        style={{
          position: 'absolute',
          left: '62px',
          top: '41px',
          width: '1009px',
          height: '1308px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DBDEE4',
          borderRadius: '14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}
      >
        {/* Top Bar (h: 82px, border at y=123) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '82px',
            borderBottom: '1px solid #E4E6EC',
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '33px', fontWeight: 600, letterSpacing: '-0.03em', color: '#141414' }}>
              Rillset
            </span>
            <span style={{ width: '1px', height: '32px', backgroundColor: '#E2E4EB', margin: '0 32px' }} />
            <span style={{ fontSize: '21px', color: '#64666C' }}>Publish version</span>
          </div>

          <button
            onClick={() => setActiveView('workspace')}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#3E4046',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <h1
          style={{
            position: 'absolute',
            left: '42px',
            top: '112px',
            fontSize: '47px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: '#141414',
          }}
        >
          Publish v1.4?
        </h1>

        <p
          style={{
            position: 'absolute',
            left: '42px',
            top: '174px',
            fontSize: '23px',
            color: '#64666C',
          }}
        >
          Harbor routes will become the current version for Fieldworks.
        </p>

        {/* Summary Box (x: 42..970, y: 230..407) */}
        <div
          style={{
            position: 'absolute',
            left: '42px',
            right: '40px',
            top: '230px',
            height: '177px',
            backgroundColor: '#FAFBFD',
            border: '1px solid #E6E8EE',
            borderRadius: '10px',
            padding: '22px 26px',
          }}
        >
          <div style={{ fontSize: '25px', fontWeight: 600, color: '#141414', marginBottom: '8px' }}>
            Harbor routes
          </div>
          <div className="font-mono" style={{ fontSize: '21px', color: '#1E1E1E', marginBottom: '8px' }}>
            8,540 rows · 13 fields
          </div>
          <div style={{ fontSize: '19px', color: '#64666C', marginBottom: '8px' }}>
            +120 rows · 1 field added
          </div>
          <div style={{ fontSize: '19px', color: '#64666C' }}>
            Previous version v1.3
          </div>
        </div>

        {/* Release note (y: 438) */}
        <label
          style={{
            position: 'absolute',
            left: '42px',
            top: '437px',
            fontSize: '21px',
            fontWeight: 500,
            color: '#1E1E1E',
          }}
        >
          Release note
        </label>

        <textarea
          value={releaseNote}
          onChange={(e) => setReleaseNote(e.target.value)}
          style={{
            position: 'absolute',
            left: '42px',
            right: '40px',
            top: '472px',
            height: '116px',
            borderRadius: '8px',
            border: '1px solid #DFE1E8',
            padding: '18px 20px',
            fontSize: '21px',
            color: '#1E1E1E',
            resize: 'vertical',
          }}
        />

        {/* Audience (y: 618) */}
        <label
          style={{
            position: 'absolute',
            left: '42px',
            top: '618px',
            fontSize: '21px',
            fontWeight: 500,
            color: '#1E1E1E',
          }}
        >
          Audience
        </label>

        <div
          style={{
            position: 'absolute',
            left: '42px',
            top: '653px',
            width: '442px',
            height: '59px',
            borderRadius: '8px',
            border: '1px solid #DFE2E8',
            backgroundColor: '#FFFFFF',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <UsersIcon size={24} color="#3E4046" />
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value as any)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '21px',
                color: '#1E1E1E',
                outline: 'none',
                cursor: 'pointer',
                width: '350px',
                appearance: 'none',
              }}
            >
              <option value="Team only">Team only</option>
              <option value="Public">Public</option>
            </select>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#3E4046" strokeWidth="1.8">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </div>

        <div style={{ position: 'absolute', left: '42px', top: '723px', fontSize: '19px', color: '#6E7076' }}>
          Visible to members of Fieldworks.
        </div>

        {/* Divider at y: 817 - 41 = 776 */}
        <div style={{ position: 'absolute', left: '42px', right: '40px', top: '776px', height: '1px', backgroundColor: '#ECEEF3' }} />

        {/* Review Summary */}
        <div style={{ position: 'absolute', left: '42px', top: '796px', fontSize: '22px', fontWeight: 500, color: '#141414' }}>
          Review summary
        </div>
        <div style={{ position: 'absolute', left: '42px', top: '836px', fontSize: '20px', color: '#64666C' }}>
          2 of 2 approved
        </div>

        {[
          { init: 'MC', name: 'Maya Chen', top: 878 },
          { init: 'TP', name: 'Theo Park', top: 938 },
        ].map((rev) => (
          <div
            key={rev.init}
            style={{
              position: 'absolute',
              left: '42px',
              right: '40px',
              top: `${rev.top}px`,
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <span
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#F1F2F5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 500,
                  color: '#1E1E1E',
                }}
              >
                {rev.init}
              </span>
              <span style={{ fontSize: '21px', color: '#1E1E1E' }}>{rev.name}</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '21px', color: '#16A34A' }}>
              <GreenCheckCircle size={32} />
              <span>Approved</span>
            </div>
          </div>
        ))}

        {/* Divider at y: 1045 - 41 = 1004 */}
        <div style={{ position: 'absolute', left: '42px', right: '40px', top: '1004px', height: '1px', backgroundColor: '#EAEDF1' }} />

        {/* 3 quality checks passed */}
        <div
          style={{
            position: 'absolute',
            left: '42px',
            top: '1022px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '20px',
            color: '#64666C',
          }}
        >
          <GreenCheckCircle size={30} />
          <span>3 quality checks passed.</span>
        </div>

        {/* Keep v1.3 checkbox */}
        <label
          onClick={() => setKeepHistory(!keepHistory)}
          style={{
            position: 'absolute',
            left: '42px',
            top: '1094px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            fontSize: '21px',
            color: '#141414',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              backgroundColor: keepHistory ? '#F44311' : '#FFFFFF',
              border: keepHistory ? 'none' : '1.5px solid #D4D6DC',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {keepHistory && (
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
              </svg>
            )}
          </span>
          <span>Keep v1.3 in version history</span>
        </label>

        {/* Divider at y: 1191 - 41 = 1150 */}
        <div style={{ position: 'absolute', left: '42px', right: '40px', top: '1150px', height: '1px', backgroundColor: '#EAECF1' }} />

        {/* Publishing makes v1.4 available immediately */}
        <div
          style={{
            position: 'absolute',
            left: '42px',
            top: '1170px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '19.5px',
            color: '#64666C',
          }}
        >
          <InfoCircleIcon size={28} />
          <span>Publishing makes v1.4 available immediately.</span>
        </div>

        {/* Bottom Buttons (y: 1264 - 41 = 1223) */}
        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            left: '42px',
            top: '1223px',
            width: '160px',
            height: '61px',
            borderRadius: '8px',
            border: '1px solid #DFE2E8',
            backgroundColor: '#FFFFFF',
            fontSize: '21px',
            color: '#1E1E1E',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setPublished(true);
            setTimeout(() => setActiveView('workspace'), 600);
          }}
          style={{
            position: 'absolute',
            right: '40px',
            top: '1223px',
            width: '215px',
            height: '61px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#FB4414',
            color: '#FFFFFF',
            fontSize: '21px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {published ? 'Published v1.4 ✓' : 'Publish v1.4'}
        </button>
      </div>
    </ScaledStage>
  );

  const activeContent =
    activeView === 'desktop'
      ? renderDesktopHomepage()
      : activeView === 'mobile'
      ? renderMobileHomepage()
      : activeView === 'workspace'
      ? renderWorkspace()
      : renderComponent();

  const currentDim = stageDims[activeView];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#F4F4F1' }}>
      {compareMode === 'side' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', alignItems: 'start' }}>
          <div style={{ border: '1px solid #D4D4CE', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#FCFCFD' }}>
            <div className="font-mono" style={{ padding: '8px 14px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E4E0', fontSize: '11px' }}>
              LIVE REACT DOM ({activeView} — {currentDim.width}×{currentDim.height})
            </div>
            {activeContent}
          </div>
          <div style={{ border: '1px solid #D4D4CE', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#FFFFFF', position: 'sticky', top: '16px' }}>
            <div className="font-mono" style={{ padding: '8px 14px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E4E0', fontSize: '11px' }}>
              SUPPLIED REFERENCE ART ({referenceImageForView[activeView]})
            </div>
            <img
              src={referenceImageForView[activeView]}
              alt="Supplied Reference Art"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', maxWidth: `${currentDim.width}px`, margin: '0 auto' }}>
          {activeContent}
          {compareMode === 'overlay' && (
            <img
              src={referenceImageForView[activeView]}
              alt="Reference Overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 'auto',
                opacity: overlayOpacity / 100,
                pointerEvents: 'none',
                zIndex: 400,
              }}
            />
          )}
        </div>
      )}

      {/* Floating Bottom-Right Switcher Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 800,
          backgroundColor: 'rgba(255,255,255,0.96)',
          border: '1px solid #D4D4CE',
          borderRadius: '999px',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(8px)',
          flexWrap: 'wrap',
        }}
      >
        {(
          [
            { id: 'desktop', label: 'Desktop' },
            { id: 'mobile', label: 'Mobile' },
            { id: 'workspace', label: 'Web App' },
            { id: 'component', label: 'Component' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer',
              backgroundColor: activeView === tab.id ? '#F15B28' : 'transparent',
              color: activeView === tab.id ? '#FFFFFF' : '#5C5C5A',
            }}
          >
            {tab.label}
          </button>
        ))}

        <span style={{ color: '#E4E4E0' }}>|</span>

        <span className="font-mono" style={{ fontSize: '10.5px', color: '#787874', marginLeft: '2px' }}>
          1:1 Compare:
        </span>

        {(['off', 'side', 'overlay'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCompareMode(m)}
            className="font-mono"
            style={{
              border: '1px solid #E4E4E0',
              borderRadius: '999px',
              padding: '4px 9px',
              fontSize: '10.5px',
              cursor: 'pointer',
              backgroundColor: compareMode === m ? '#171717' : '#FFFFFF',
              color: compareMode === m ? '#FFFFFF' : '#5C5C5A',
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
            style={{ width: '70px' }}
            title={`Overlay opacity: ${overlayOpacity}%`}
          />
        )}
      </div>
    </div>
  );
}

export default App;
