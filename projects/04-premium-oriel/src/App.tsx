import React, { useState, useRef, useLayoutEffect } from 'react';
import { INITIAL_UPDATES, UpdateItem } from './data/updates';

type ActiveView = 'desktop' | 'mobile' | 'workspace' | 'component';
type CompareMode = 'off' | 'side' | 'overlay';

interface ScaledProps {
  width: number;
  height: number;
  maxWidth?: number;
  children: React.ReactNode;
}

function Scaled({ width, height, maxWidth, children }: ScaledProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const w = node.clientWidth;
      if (w > 0) setScale(w / width);
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
        maxWidth: maxWidth ? `${maxWidth}px` : `${width}px`,
        margin: '0 auto',
        aspectRatio: `${width} / ${height}`,
        position: 'relative',
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
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const MICA_SEARCH_ITEMS = [
  {
    id: 'res_1',
    title: 'Saved view · Q4 Release Roadmap & Customer Milestones',
    tag: 'Saved view',
    barWidth: 274,
    date: 'Updated 2h ago',
  },
  {
    id: 'res_2',
    title: 'Project · Global Search Index & Keyboard Navigation',
    tag: 'Project',
    barWidth: 210,
    date: 'Active sprint',
  },
  {
    id: 'res_3',
    title: 'Changelog · October 2026 Product Improvements',
    tag: 'Changelog',
    barWidth: 254,
    date: 'Scheduled',
  },
];

export function App() {
  const [activeView, setActiveView] = useState<ActiveView>('desktop');
  const [compareMode, setCompareMode] = useState<CompareMode>('off');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);

  const [updates, setUpdates] = useState<UpdateItem[]>(INITIAL_UPDATES);
  const [selectedUpdateId, setSelectedUpdateId] = useState<string>(INITIAL_UPDATES[0].id);
  const selectedUpdate = updates.find((u) => u.id === selectedUpdateId) || updates[0];

  // Interactive states for Mica card search
  const [micaSearchQuery, setMicaSearchQuery] = useState('');
  const [micaSearchFocused, setMicaSearchFocused] = useState(false);
  const [selectedMicaRow, setSelectedMicaRow] = useState<number | null>(null);

  // Interactive states for Component schedule editing & preview modal
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [schedDate, setSchedDate] = useState('28 Oct 2026');
  const [schedTime, setSchedTime] = useState('09:00 UTC');
  const [showNewUpdateModal, setShowNewUpdateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newScheduleDate, setNewScheduleDate] = useState('06 Nov 2026');

  // Interactive state for Workspace top nav tabs
  const [workspaceTab, setWorkspaceTab] = useState<'Mica' | 'Updates' | 'Review' | 'Settings'>('Updates');

  // Interactive state for CTA work email
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSubmitted, setInviteSubmitted] = useState(false);

  const referenceImageForView: Record<ActiveView, string> = {
    desktop: '/reference/desktop-homepage.png',
    mobile: '/reference/mobile-homepage.png',
    workspace: '/reference/app.png',
    component: '/reference/component.png',
  };

  const stageDimensions: Record<ActiveView, { width: number; height: number; maxWidth: number }> = {
    desktop: { width: 1254, height: 2508, maxWidth: 1254 },
    mobile: { width: 948, height: 4740, maxWidth: 474 },
    workspace: { width: 1536, height: 1024, maxWidth: 1536 },
    component: { width: 1295, height: 1214, maxWidth: 1295 },
  };

  const handleCreateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const nextNum = 70 + updates.length + 1;
    const created: UpdateItem = {
      id: `upd_0${nextNum}`,
      tag: `upd_0${nextNum}`,
      title: newTitle.trim(),
      excerpt: newExcerpt.trim() || 'Search across saved views and recent projects in one place.',
      content: newExcerpt.trim() || 'Search across saved views and recent projects in one place.',
      status: 'Scheduled',
      scheduledDate: newScheduleDate,
      scheduledTime: '09:00 UTC',
      author: { name: 'Nina Cole', avatar: 'NC', role: 'Author' },
      reviewer: { name: 'Sam Lee', avatar: 'SL', status: 'Approved' },
      category: 'Product improvement',
      channels: { publicChangelog: true, customerEmail: true, inAppBanner: false },
    };
    setUpdates([created, ...updates]);
    setSelectedUpdateId(created.id);
    setNewTitle('');
    setNewExcerpt('');
    setShowNewUpdateModal(false);
  };

  /* ============================================================================
   * 1. DESKTOP HOMEPAGE STAGE (1254 x 2508) — 1:1 with desktop-homepage.png
   * ============================================================================ */
  const renderDesktopStage = () => {
    const filteredMica = MICA_SEARCH_ITEMS.filter((item) =>
      item.title.toLowerCase().includes(micaSearchQuery.toLowerCase())
    );

    return (
      <div
        style={{
          width: '1254px',
          height: '2508px',
          position: 'relative',
          backgroundColor: '#060606',
          color: '#F5F5F2',
          fontFamily: 'var(--font-sans)',
          userSelect: 'none',
        }}
      >
        {/* Top-down subtle warm spotlight behind Hero & Mica Card */}
        <div
          style={{
            position: 'absolute',
            top: '56px',
            left: '0',
            width: '1254px',
            height: '1220px',
            background:
              'radial-gradient(640px 580px at 627px 270px, rgba(255, 253, 245, 0.055) 0%, rgba(215, 212, 200, 0.025) 45%, rgba(6, 6, 6, 0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header (y: 0..56) */}
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1254px',
            height: '56px',
            borderBottom: '1px solid #1E1E1C',
          }}
        >
          <span
            onClick={() => setActiveView('desktop')}
            style={{
              position: 'absolute',
              left: '68px',
              top: '13px',
              fontSize: '24px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#F5F5F2',
              lineHeight: 1.2,
              cursor: 'pointer',
            }}
          >
            Oriel
          </span>

          {/* Centered Nav */}
          <nav
            style={{
              position: 'absolute',
              left: '488px',
              top: '20px',
              display: 'flex',
              gap: '44px',
              fontSize: '13px',
              fontWeight: 400,
              color: '#B8B8B4',
              lineHeight: 1.2,
            }}
          >
            <button
              onClick={() => setActiveView('workspace')}
              style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', cursor: 'pointer' }}
            >
              Workspace
            </button>
            <button
              onClick={() => setActiveView('component')}
              style={{ background: 'none', border: 'none', color: 'inherit', fontSize: 'inherit', cursor: 'pointer' }}
            >
              Publishing
            </button>
            <a
              href="#desktop-cta"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('workspace');
              }}
              style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
            >
              Plans
            </a>
          </nav>

          {/* Right Actions */}
          <button
            onClick={() => setActiveView('workspace')}
            style={{
              position: 'absolute',
              left: '992px',
              top: '20px',
              background: 'none',
              border: 'none',
              color: '#D8D8D4',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.2,
              cursor: 'pointer',
            }}
          >
            Sign in
          </button>

          <button
            onClick={() => setActiveView('workspace')}
            style={{
              position: 'absolute',
              left: '1068px',
              top: '10px',
              width: '117px',
              height: '35px',
              borderRadius: '6px',
              border: '1px solid #3A3A38',
              backgroundColor: 'transparent',
              color: '#F0F0EC',
              fontSize: '13px',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            Start writing
          </button>
        </header>

        {/* Section 1: Hero Copy */}
        <div
          style={{
            position: 'absolute',
            top: '175px',
            left: 0,
            width: '1254px',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#9E9E99',
            lineHeight: 1,
          }}
        >
          PRODUCT UPDATES, WELL TOLD
        </div>

        <h1
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            top: '210px',
            left: 0,
            width: '1254px',
            textAlign: 'center',
            fontSize: '84px',
            fontWeight: 400,
            lineHeight: '83px',
            letterSpacing: '-0.015em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          Let your progress
          <br />
          speak clearly.
        </h1>

        <p
          style={{
            position: 'absolute',
            top: '402px',
            left: '387px',
            width: '480px',
            textAlign: 'center',
            fontSize: '18.5px',
            fontWeight: 400,
            lineHeight: '27px',
            color: '#A3A39E',
            letterSpacing: '-0.01em',
          }}
        >
          One place to shape, review, and share
          <br />
          the work your team ships.
        </p>

        {/* Hero CTA Buttons (y: 495..549) */}
        <button
          onClick={() => setActiveView('component')}
          style={{
            position: 'absolute',
            left: '428px',
            top: '495px',
            width: '217px',
            height: '54px',
            borderRadius: '8px',
            backgroundColor: '#F3F2EE',
            border: '1px solid #F3F2EE',
            color: '#141413',
            fontSize: '15px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          Create a publication
        </button>

        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            left: '684px',
            top: '511px',
            background: 'none',
            border: 'none',
            color: '#D8D8D4',
            fontSize: '15px',
            fontWeight: 400,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            cursor: 'pointer',
          }}
        >
          <span>See an example</span>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
        </button>

        {/* Mica Showcase Card (x: 160..1094, y: 608..1185, 934x577) */}
        <div
          style={{
            position: 'absolute',
            left: '160px',
            top: '608px',
            width: '934px',
            height: '577px',
            borderRadius: '14px',
            backgroundColor: '#F1F1EE',
            color: '#181817',
            boxShadow: '0 28px 80px rgba(0, 0, 0, 0.65)',
          }}
        >
          {/* Card Header Row (x: 228..1026 -> relative x: 68..866, w: 798) */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '36px',
              width: '798px',
              height: '38px',
              borderBottom: '1px solid #DEDED9',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 500, color: '#181817', letterSpacing: '-0.015em', lineHeight: 1 }}>
              Mica
            </span>
            <span style={{ fontSize: '13px', fontWeight: 400, color: '#6E6E6A', lineHeight: 1.2 }}>
              Product updates
            </span>
          </div>

          {/* Date Eyebrow */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '112px',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#787873',
              lineHeight: 1,
            }}
          >
            OCTOBER 2026
          </div>

          {/* Mica Title */}
          <h2
            className="font-serif-oriel"
            style={{
              position: 'absolute',
              left: '68px',
              top: '136px',
              fontSize: '50px',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.012em',
              color: '#141413',
              margin: 0,
            }}
          >
            {selectedUpdate.title}
          </h2>

          {/* Mica Subtitle */}
          <p
            style={{
              position: 'absolute',
              left: '68px',
              top: '202px',
              fontSize: '17px',
              fontWeight: 400,
              color: '#5A5A55',
              letterSpacing: '-0.005em',
              lineHeight: 1.35,
            }}
          >
            {selectedUpdate.excerpt}
          </p>

          {/* Interactive Search Pill (x: 326..928 -> relative left: 166px, top: 263px, 602x54) */}
          <div
            onClick={() => setMicaSearchFocused(true)}
            style={{
              position: 'absolute',
              left: '166px',
              top: '263px',
              width: '602px',
              height: '54px',
              borderRadius: '999px',
              backgroundColor: '#F7F7F5',
              border: micaSearchFocused ? '1px solid #BDBDB6' : '1px solid #DFDFDA',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '26px',
              paddingRight: '24px',
              cursor: 'text',
            }}
          >
            {/* Magnifying glass SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginRight: '18px' }}>
              <circle cx="8.5" cy="8.5" r="6.2" stroke="#2C2C2A" strokeWidth="1.5" />
              <line x1="13.2" y1="13.2" x2="17.5" y2="17.5" stroke="#2C2C2A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            {micaSearchFocused || micaSearchQuery ? (
              <input
                type="text"
                value={micaSearchQuery}
                autoFocus={micaSearchFocused}
                onBlur={() => setMicaSearchFocused(false)}
                onChange={(e) => setMicaSearchQuery(e.target.value)}
                placeholder="Filter saved views, roadmap, or changelog..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13.5px',
                  color: '#181817',
                }}
              />
            ) : (
              <div
                style={{
                  width: '226px',
                  height: '10px',
                  borderRadius: '999px',
                  backgroundColor: '#E2E2DD',
                }}
              />
            )}
          </div>

          {/* 3 Stacked Result Rows (relative left: 166px, top: 336, 382, 428; each 602x36) */}
          {(micaSearchQuery ? filteredMica : MICA_SEARCH_ITEMS).map((item, idx) => {
            const rowTop = 336 + idx * 46;
            const isSelected = selectedMicaRow === idx;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMicaRow(isSelected ? null : idx)}
                title={`${item.title} (${item.date}) — Click to inspect`}
                style={{
                  position: 'absolute',
                  left: '166px',
                  top: `${rowTop}px`,
                  width: '602px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#EAEAE4' : '#F7F7F5',
                  border: isSelected ? '1px solid #C8C8C0' : '1px solid #E5E5E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 22px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#7B9C88' : '#D0D0CB',
                      flexShrink: 0,
                    }}
                  />
                  {isSelected || micaSearchQuery ? (
                    <span style={{ fontSize: '12.5px', color: '#242422', fontWeight: 500 }}>{item.title}</span>
                  ) : (
                    <div
                      style={{
                        width: `${item.barWidth}px`,
                        height: '9px',
                        borderRadius: '999px',
                        backgroundColor: '#D5D5D0',
                      }}
                    />
                  )}
                </div>
                {isSelected || micaSearchQuery ? (
                  <span style={{ fontSize: '11px', color: '#6E6E6A' }}>{item.date}</span>
                ) : (
                  <div
                    style={{
                      width: '66px',
                      height: '10px',
                      borderRadius: '999px',
                      backgroundColor: '#DEDED9',
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* Card Footer (relative left: 68px, top: 498px, width: 798px) */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '498px',
              width: '798px',
              paddingTop: '24px',
              borderTop: '1px solid #DEDED9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
            }}
          >
            <span style={{ color: '#666661', fontWeight: 400 }}>{selectedUpdate.category}</span>
            <button
              onClick={() => setActiveView('component')}
              style={{
                background: 'none',
                border: 'none',
                color: '#181817',
                fontSize: '13px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <span>Read update</span>
              <span style={{ fontSize: '14px' }}>→</span>
            </button>
          </div>
        </div>

        {/* Caption below Mica Card (y: 1204) */}
        <div
          style={{
            position: 'absolute',
            top: '1204px',
            left: 0,
            width: '1254px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#8E8E89',
            letterSpacing: '-0.005em',
          }}
        >
          A clear home for what changes.
        </div>

        {/* Section 2: 3-Step Rhythm (y: 1332..1635) */}
        <h2
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            top: '1332px',
            left: 0,
            width: '1254px',
            textAlign: 'center',
            fontSize: '56px',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.012em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          From a rough note to a clear update.
        </h2>

        <p
          style={{
            position: 'absolute',
            top: '1402px',
            left: 0,
            width: '1254px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 400,
            color: '#A0A09B',
            letterSpacing: '-0.01em',
          }}
        >
          A simple rhythm for the whole team.
        </p>

        {/* Two vertical dividers at x: 442 and x: 812, y: 1475..1630 */}
        <div
          style={{
            position: 'absolute',
            left: '442px',
            top: '1475px',
            width: '1px',
            height: '155px',
            backgroundColor: '#1E1E1C',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '812px',
            top: '1475px',
            width: '1px',
            height: '155px',
            backgroundColor: '#1E1E1C',
          }}
        />

        {/* Step 01 */}
        <div
          style={{
            position: 'absolute',
            left: '75px',
            top: '1488px',
            width: '350px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#8E8E89', marginBottom: '8px' }}>01</div>
          <div className="font-serif-oriel" style={{ fontSize: '35px', color: '#F5F5F2', lineHeight: 1.1, marginBottom: '12px' }}>
            Shape
          </div>
          <p style={{ fontSize: '15px', lineHeight: '22px', color: '#9A9A95', margin: '0 auto', maxWidth: '245px' }}>
            Bring notes, screenshots and
            <br />
            context into one draft.
          </p>
        </div>

        {/* Step 02 */}
        <div
          style={{
            position: 'absolute',
            left: '452px',
            top: '1488px',
            width: '350px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#8E8E89', marginBottom: '8px' }}>02</div>
          <div className="font-serif-oriel" style={{ fontSize: '35px', color: '#F5F5F2', lineHeight: 1.1, marginBottom: '12px' }}>
            Review
          </div>
          <p style={{ fontSize: '15px', lineHeight: '22px', color: '#9A9A95', margin: '0 auto', maxWidth: '250px' }}>
            Resolve the details with the
            <br />
            people who know the work.
          </p>
        </div>

        {/* Step 03 */}
        <div
          style={{
            position: 'absolute',
            left: '829px',
            top: '1488px',
            width: '350px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#8E8E89', marginBottom: '8px' }}>03</div>
          <div className="font-serif-oriel" style={{ fontSize: '35px', color: '#F5F5F2', lineHeight: 1.1, marginBottom: '12px' }}>
            Share
          </div>
          <p style={{ fontSize: '15px', lineHeight: '22px', color: '#9A9A95', margin: '0 auto', maxWidth: '255px' }}>
            Choose a time and publish to
            <br />
            your own changelog.
          </p>
        </div>

        {/* Section 3: Split Review Card + Considered Release (y: 1702..2074) */}
        <div
          onClick={() => setActiveView('component')}
          title="Click to open publication component"
          style={{
            position: 'absolute',
            left: '100px',
            top: '1702px',
            width: '552px',
            height: '372px',
            borderRadius: '10px',
            backgroundColor: '#0B0B0B',
            border: '1px solid #1F1F1D',
            cursor: 'pointer',
          }}
        >
          <div
            className="font-serif-oriel"
            style={{
              position: 'absolute',
              left: '31px',
              top: '36px',
              fontSize: '31px',
              color: '#F5F5F2',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            A faster way to find your work
          </div>

          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '80px',
              fontSize: '14px',
              color: '#9A9A95',
            }}
          >
            Review complete
          </div>

          {/* Hairline 1 (y: 1828 -> relative top: 126px) */}
          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '126px',
              width: '490px',
              height: '1px',
              backgroundColor: '#1E1E1C',
            }}
          />

          {/* Row 1: Nina Cole (y: 1846..1894 -> relative top: 144px) */}
          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '145px',
              width: '490px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#161615',
                  border: '1px solid #2A2A28',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#E5E5E0',
                }}
              >
                NC
              </span>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#F5F5F2' }}>Nina Cole</span>
            </div>
            <span style={{ fontSize: '14px', color: '#9A9A95' }}>Author</span>
          </div>

          {/* Hairline 2 (y: 1910 -> relative top: 208px) */}
          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '208px',
              width: '490px',
              height: '1px',
              backgroundColor: '#1E1E1C',
            }}
          />

          {/* Row 2: Sam Lee (y: 1928..1976 -> relative top: 227px) */}
          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '227px',
              width: '490px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#161615',
                  border: '1px solid #2A2A28',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#E5E5E0',
                }}
              >
                SL
              </span>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#F5F5F2' }}>Sam Lee</span>
            </div>
            <span style={{ fontSize: '14px', color: '#9A9A95' }}>Approved</span>
          </div>

          {/* Hairline 3 (y: 1992 -> relative top: 290px) */}
          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '290px',
              width: '490px',
              height: '1px',
              backgroundColor: '#1E1E1C',
            }}
          />

          {/* Footer (y: 2022 -> relative top: 320px) */}
          <div
            style={{
              position: 'absolute',
              left: '31px',
              top: '320px',
              fontSize: '14px',
              color: '#9A9A95',
            }}
          >
            Scheduled for 28 Oct · 09:00 UTC
          </div>
        </div>

        {/* Right Copy (x: 742..1160, y: 1756..2025) */}
        <h3
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            left: '742px',
            top: '1754px',
            fontSize: '58px',
            fontWeight: 400,
            lineHeight: '57px',
            letterSpacing: '-0.015em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          Give every update
          <br />a considered release.
        </h3>

        <p
          style={{
            position: 'absolute',
            left: '742px',
            top: '1892px',
            width: '380px',
            fontSize: '19px',
            fontWeight: 400,
            lineHeight: '28px',
            color: '#9E9E99',
            letterSpacing: '-0.01em',
          }}
        >
          Keep the draft, the decision and
          <br />
          the published story connected.
        </p>

        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            left: '742px',
            top: '1998px',
            background: 'none',
            border: 'none',
            color: '#E5E5E0',
            fontSize: '16px',
            fontWeight: 400,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <span>Explore the workflow</span>
          <span style={{ fontSize: '17px' }}>→</span>
        </button>

        {/* Section 4: CTA Row (y: 2136..2384) */}
        <div
          id="desktop-cta"
          style={{
            position: 'absolute',
            left: '75px',
            top: '2136px',
            width: '1104px',
            height: '1px',
            backgroundColor: '#1E1E1C',
          }}
        />

        <h3
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            left: '75px',
            top: '2186px',
            fontSize: '55px',
            fontWeight: 400,
            lineHeight: '54px',
            letterSpacing: '-0.015em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          Your next chapter
          <br />
          starts with a note.
        </h3>

        <p
          style={{
            position: 'absolute',
            left: '75px',
            top: '2306px',
            fontSize: '18px',
            fontWeight: 400,
            color: '#9E9E99',
            letterSpacing: '-0.01em',
          }}
        >
          A workspace for your product story.
        </p>

        {/* Right Email Form (x: 602..1180, y: 2216..2277) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setInviteSubmitted(true);
          }}
        >
          <input
            type="email"
            placeholder={inviteSubmitted ? '✓ Invitation sent' : 'Work email'}
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{
              position: 'absolute',
              left: '602px',
              top: '2216px',
              width: '406px',
              height: '61px',
              borderRadius: '8px',
              backgroundColor: '#0B0B0B',
              border: '1px solid #242422',
              padding: '0 22px',
              fontSize: '15px',
              color: '#F5F5F2',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              position: 'absolute',
              left: '1018px',
              top: '2216px',
              width: '162px',
              height: '61px',
              borderRadius: '8px',
              backgroundColor: '#F3F2EE',
              border: '1px solid #F3F2EE',
              color: '#141413',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Start writing
          </button>
        </form>

        {/* Footer (y: 2384..2508) */}
        <div
          style={{
            position: 'absolute',
            left: '75px',
            top: '2384px',
            width: '1104px',
            height: '1px',
            backgroundColor: '#1E1E1C',
          }}
        />

        <span
          style={{
            position: 'absolute',
            left: '75px',
            top: '2402px',
            fontSize: '22px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#F5F5F2',
          }}
        >
          Oriel
        </span>

        <div
          style={{
            position: 'absolute',
            right: '75px',
            top: '2410px',
            display: 'flex',
            gap: '38px',
            fontSize: '12px',
            color: '#9E9E99',
          }}
        >
          <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('workspace')}>
            Help center
          </span>
          <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('component')}>
            Contact
          </span>
          <span style={{ cursor: 'pointer' }}>Privacy</span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '75px',
            top: '2444px',
            width: '1104px',
            height: '1px',
            backgroundColor: '#1E1E1C',
          }}
        />

        <span
          style={{
            position: 'absolute',
            left: '75px',
            top: '2462px',
            fontSize: '12px',
            color: '#8E8E89',
          }}
        >
          © 2026 Oriel
        </span>

        <span
          style={{
            position: 'absolute',
            left: 0,
            top: '2462px',
            width: '1254px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#8E8E89',
            pointerEvents: 'none',
          }}
        >
          Thoughtfully shipped.
        </span>

        <span
          style={{
            position: 'absolute',
            right: '75px',
            top: '2462px',
            fontSize: '12px',
            color: '#8E8E89',
          }}
        >
          Terms
        </span>
      </div>
    );
  };

  /* ============================================================================
   * 2. MOBILE HOMEPAGE STAGE (948 x 4740) — 1:1 with mobile-homepage.png
   * ============================================================================ */
  const renderMobileStage = () => {
    const filteredMica = MICA_SEARCH_ITEMS.filter((item) =>
      item.title.toLowerCase().includes(micaSearchQuery.toLowerCase())
    );

    return (
      <div
        style={{
          width: '948px',
          height: '4740px',
          position: 'relative',
          backgroundColor: '#060606',
          color: '#F5F5F2',
          fontFamily: 'var(--font-sans)',
          userSelect: 'none',
        }}
      >
        {/* Top-down subtle spotlight */}
        <div
          style={{
            position: 'absolute',
            top: '105px',
            left: 0,
            width: '948px',
            height: '1400px',
            background:
              'radial-gradient(520px 640px at 474px 300px, rgba(255, 253, 245, 0.05) 0%, rgba(215, 212, 200, 0.02) 45%, rgba(6, 6, 6, 0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Mobile Header (y: 0..105) */}
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '948px',
            height: '105px',
            borderBottom: '1px solid #2A2A28',
          }}
        >
          <span
            onClick={() => setActiveView('desktop')}
            style={{
              position: 'absolute',
              left: '68px',
              top: '28px',
              fontSize: '46px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#F5F5F2',
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            Oriel
          </span>

          {/* Hamburger icon (x: 834..876, y: 40..66) */}
          <button
            onClick={() => setActiveView('workspace')}
            aria-label="Open Workspace"
            style={{
              position: 'absolute',
              left: '834px',
              top: '38px',
              width: '44px',
              height: '32px',
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '3px 0',
              cursor: 'pointer',
            }}
          >
            <span style={{ width: '42px', height: '2px', backgroundColor: '#E5E5E0', display: 'block' }} />
            <span style={{ width: '42px', height: '2px', backgroundColor: '#E5E5E0', display: 'block' }} />
            <span style={{ width: '42px', height: '2px', backgroundColor: '#E5E5E0', display: 'block' }} />
          </button>
        </header>

        {/* Eyebrow (y: 180) */}
        <div
          style={{
            position: 'absolute',
            top: '180px',
            left: 0,
            width: '948px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#9E9E99',
            lineHeight: 1,
          }}
        >
          PRODUCT UPDATES, WELL TOLD
        </div>

        {/* Hero Heading (y: 226..426) */}
        <h1
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            top: '226px',
            left: 0,
            width: '948px',
            textAlign: 'center',
            fontSize: '104px',
            fontWeight: 400,
            lineHeight: '98px',
            letterSpacing: '-0.015em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          Let your progress
          <br />
          speak clearly.
        </h1>

        {/* Subtitle (y: 448..530) */}
        <p
          style={{
            position: 'absolute',
            top: '448px',
            left: '174px',
            width: '600px',
            textAlign: 'center',
            fontSize: '31px',
            fontWeight: 400,
            lineHeight: '43px',
            color: '#A3A39E',
            letterSpacing: '-0.01em',
          }}
        >
          One place to shape, review, and share
          <br />
          the work your team ships.
        </p>

        {/* Primary Button (x: 262..686, y: 571..653) */}
        <button
          onClick={() => setActiveView('component')}
          style={{
            position: 'absolute',
            left: '262px',
            top: '571px',
            width: '424px',
            height: '82px',
            borderRadius: '12px',
            backgroundColor: '#F3F2EE',
            border: '1px solid #F3F2EE',
            color: '#141413',
            fontSize: '26px',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            cursor: 'pointer',
          }}
        >
          Create a publication
        </button>

        {/* Secondary Action (y: 686) */}
        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            top: '686px',
            left: 0,
            width: '948px',
            background: 'none',
            border: 'none',
            color: '#D8D8D4',
            fontSize: '23px',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <span>See an example</span>
          <span>→</span>
        </button>

        {/* Mobile Mica Card (x: 67..884, y: 756..1566, 817x810) */}
        <div
          style={{
            position: 'absolute',
            left: '67px',
            top: '756px',
            width: '817px',
            height: '810px',
            borderRadius: '22px',
            backgroundColor: '#F3F2EF',
            color: '#181817',
          }}
        >
          {/* Card Header (relative x: 60..756, y: 46..101) */}
          <div
            style={{
              position: 'absolute',
              left: '60px',
              top: '46px',
              width: '696px',
              height: '55px',
              borderBottom: '1px solid #DEDED9',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '31px', fontWeight: 500, color: '#181817', lineHeight: 1 }}>Mica</span>
            <span style={{ fontSize: '21px', color: '#6E6E6A', lineHeight: 1.3 }}>Product updates</span>
          </div>

          <div
            style={{
              position: 'absolute',
              left: '60px',
              top: '150px',
              fontSize: '18px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              color: '#787873',
            }}
          >
            OCTOBER 2026
          </div>

          <h2
            className="font-serif-oriel"
            style={{
              position: 'absolute',
              left: '60px',
              top: '186px',
              fontSize: '74px',
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              color: '#141413',
              margin: 0,
            }}
          >
            A faster way to find your work
          </h2>

          <p
            style={{
              position: 'absolute',
              left: '60px',
              top: '274px',
              width: '660px',
              fontSize: '29px',
              lineHeight: '42px',
              color: '#5A5A55',
            }}
          >
            Search across saved views and recent projects
            <br />
            in one place.
          </p>

          {/* Search Pill (relative x: 66..752, y: 389..462, 686x73) */}
          <div
            onClick={() => setMicaSearchFocused(true)}
            style={{
              position: 'absolute',
              left: '66px',
              top: '389px',
              width: '686px',
              height: '73px',
              borderRadius: '999px',
              backgroundColor: '#F7F7F5',
              border: '1px solid #DCDCD6',
              display: 'flex',
              alignItems: 'center',
              padding: '0 32px',
              cursor: 'text',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginRight: '24px' }}>
              <circle cx="8.5" cy="8.5" r="6.2" stroke="#222220" strokeWidth="1.5" />
              <line x1="13.2" y1="13.2" x2="17.5" y2="17.5" stroke="#222220" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {micaSearchFocused || micaSearchQuery ? (
              <input
                type="text"
                value={micaSearchQuery}
                onChange={(e) => setMicaSearchQuery(e.target.value)}
                onBlur={() => setMicaSearchFocused(false)}
                placeholder="Search views and projects..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '22px',
                  color: '#181817',
                }}
              />
            ) : (
              <div style={{ width: '290px', height: '14px', borderRadius: '999px', backgroundColor: '#DFDFDA' }} />
            )}
          </div>

          {/* 3 Result Rows (relative y: 482, 547, 612, each 682x54) */}
          {(micaSearchQuery ? filteredMica : MICA_SEARCH_ITEMS).map((item, idx) => {
            const topPos = 482 + idx * 65;
            const barWidths = [368, 326, 368];
            const isSelected = selectedMicaRow === idx;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMicaRow(isSelected ? null : idx)}
                style={{
                  position: 'absolute',
                  left: '68px',
                  top: `${topPos}px`,
                  width: '682px',
                  height: '54px',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? '#EAEAE4' : '#F7F7F5',
                  border: '1px solid #E5E5E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 24px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#7B9C88' : '#CFCFC9',
                    }}
                  />
                  {isSelected || micaSearchQuery ? (
                    <span style={{ fontSize: '20px', color: '#181817', fontWeight: 500 }}>{item.title}</span>
                  ) : (
                    <div
                      style={{
                        width: `${barWidths[idx] || 340}px`,
                        height: '13px',
                        borderRadius: '999px',
                        backgroundColor: '#D5D5D0',
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    width: '90px',
                    height: '13px',
                    borderRadius: '999px',
                    backgroundColor: '#DFDFDA',
                  }}
                />
              </div>
            );
          })}

          {/* Card Footer (relative y: 707) */}
          <div
            style={{
              position: 'absolute',
              left: '60px',
              top: '707px',
              width: '696px',
              paddingTop: '34px',
              borderTop: '1px solid #DEDED9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '22px',
            }}
          >
            <span style={{ color: '#666661' }}>Product improvement</span>
            <button
              onClick={() => setActiveView('component')}
              style={{
                background: 'none',
                border: 'none',
                color: '#181817',
                fontSize: '22px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <span>Read update</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Caption below Card (y: 1598) */}
        <div
          style={{
            position: 'absolute',
            top: '1596px',
            left: 0,
            width: '948px',
            textAlign: 'center',
            fontSize: '21px',
            color: '#9A9A95',
          }}
        >
          A clear home for what changes.
        </div>

        {/* Section 2: From a rough note to a clear update (y: 1732..2500) */}
        <h2
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            top: '1732px',
            left: 0,
            width: '948px',
            textAlign: 'center',
            fontSize: '76px',
            fontWeight: 400,
            lineHeight: '72px',
            letterSpacing: '-0.015em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          From a rough note
          <br />
          to a clear update.
        </h2>

        <p
          style={{
            position: 'absolute',
            top: '1895px',
            left: 0,
            width: '948px',
            textAlign: 'center',
            fontSize: '29px',
            color: '#A0A09B',
          }}
        >
          A simple rhythm for the whole team.
        </p>

        {/* Step 01 (y: 1966..2129) */}
        <div style={{ position: 'absolute', left: '124px', top: '1966px', width: '708px' }}>
          <div style={{ fontSize: '20px', color: '#9A9A95', marginBottom: '12px' }}>01</div>
          <div className="font-serif-oriel" style={{ fontSize: '52px', color: '#F5F5F2', lineHeight: 1.05, marginBottom: '12px' }}>
            Shape
          </div>
          <div style={{ fontSize: '26px', color: '#9E9E99', lineHeight: 1.35 }}>
            Bring notes, screenshots and context into one draft.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '116px',
            top: '2129px',
            width: '717px',
            height: '1px',
            backgroundColor: '#222220',
          }}
        />

        {/* Step 02 (y: 2164..2328) */}
        <div style={{ position: 'absolute', left: '124px', top: '2164px', width: '708px' }}>
          <div style={{ fontSize: '20px', color: '#9A9A95', marginBottom: '12px' }}>02</div>
          <div className="font-serif-oriel" style={{ fontSize: '52px', color: '#F5F5F2', lineHeight: 1.05, marginBottom: '12px' }}>
            Review
          </div>
          <div style={{ fontSize: '26px', color: '#9E9E99', lineHeight: 1.35 }}>
            Resolve the details with the people who know the work.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '116px',
            top: '2328px',
            width: '717px',
            height: '1px',
            backgroundColor: '#222220',
          }}
        />

        {/* Step 03 (y: 2363..2500) */}
        <div style={{ position: 'absolute', left: '124px', top: '2363px', width: '708px' }}>
          <div style={{ fontSize: '20px', color: '#9A9A95', marginBottom: '12px' }}>03</div>
          <div className="font-serif-oriel" style={{ fontSize: '52px', color: '#F5F5F2', lineHeight: 1.05, marginBottom: '12px' }}>
            Share
          </div>
          <div style={{ fontSize: '26px', color: '#9E9E99', lineHeight: 1.35 }}>
            Choose a time and publish to your own changelog.
          </div>
        </div>

        {/* Section 3: Give every update a considered release (y: 2560..3280) */}
        <h3
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            left: '124px',
            top: '2560px',
            fontSize: '74px',
            fontWeight: 400,
            lineHeight: '69px',
            letterSpacing: '-0.015em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          Give every update
          <br />a considered release.
        </h3>

        <p
          style={{
            position: 'absolute',
            left: '124px',
            top: '2714px',
            width: '680px',
            fontSize: '28px',
            lineHeight: '38px',
            color: '#9E9E99',
          }}
        >
          Keep the draft, the decision and the published story connected.
        </p>

        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            left: '124px',
            top: '2812px',
            background: 'none',
            border: 'none',
            color: '#E5E5E0',
            fontSize: '25px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
          }}
        >
          <span>Explore the workflow</span>
          <span>→</span>
        </button>

        {/* Mobile Dark Review Card (x: 77..872, y: 2881..3278, 795x397) */}
        <div
          onClick={() => setActiveView('component')}
          style={{
            position: 'absolute',
            left: '77px',
            top: '2881px',
            width: '795px',
            height: '397px',
            borderRadius: '18px',
            backgroundColor: '#0D0D0C',
            border: '1px solid #222220',
            cursor: 'pointer',
          }}
        >
          <div
            className="font-serif-oriel"
            style={{
              position: 'absolute',
              left: '48px',
              top: '38px',
              fontSize: '50px',
              color: '#F5F5F2',
              lineHeight: 1.05,
            }}
          >
            A faster way to find your work
          </div>

          <div
            style={{
              position: 'absolute',
              left: '48px',
              top: '96px',
              fontSize: '21px',
              color: '#9A9A95',
            }}
          >
            Review complete
          </div>

          {/* Hairline 1 (relative top: 138px) */}
          <div
            style={{
              position: 'absolute',
              left: '48px',
              top: '138px',
              width: '700px',
              height: '1px',
              backgroundColor: '#222220',
            }}
          />

          {/* Row 1: Nina Cole */}
          <div
            style={{
              position: 'absolute',
              left: '48px',
              top: '150px',
              width: '700px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  backgroundColor: '#171716',
                  border: '1px solid #2C2C2A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 500,
                }}
              >
                NC
              </span>
              <span style={{ fontSize: '22px', fontWeight: 500 }}>Nina Cole</span>
            </div>
            <span style={{ fontSize: '21px', color: '#9A9A95' }}>Author</span>
          </div>

          {/* Hairline 2 (relative top: 221px) */}
          <div
            style={{
              position: 'absolute',
              left: '48px',
              top: '221px',
              width: '700px',
              height: '1px',
              backgroundColor: '#222220',
            }}
          />

          {/* Row 2: Sam Lee */}
          <div
            style={{
              position: 'absolute',
              left: '48px',
              top: '236px',
              width: '700px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  backgroundColor: '#171716',
                  border: '1px solid #2C2C2A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 500,
                }}
              >
                SL
              </span>
              <span style={{ fontSize: '22px', fontWeight: 500 }}>Sam Lee</span>
            </div>
            <span style={{ fontSize: '21px', color: '#9A9A95' }}>Approved</span>
          </div>

          {/* Hairline 3 (relative top: 310px) */}
          <div
            style={{
              position: 'absolute',
              left: '48px',
              top: '310px',
              width: '700px',
              height: '1px',
              backgroundColor: '#222220',
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: '48px',
              top: '338px',
              fontSize: '21px',
              color: '#9A9A95',
            }}
          >
            Scheduled for 28 Oct · 09:00 UTC
          </div>
        </div>

        {/* Section 4: Mobile CTA (y: 3476..4314) */}
        <div
          style={{
            position: 'absolute',
            left: '59px',
            top: '3476px',
            width: '830px',
            height: '1px',
            backgroundColor: '#2A2A28',
          }}
        />

        <h3
          className="font-serif-oriel"
          style={{
            position: 'absolute',
            top: '3580px',
            left: 0,
            width: '948px',
            textAlign: 'center',
            fontSize: '96px',
            fontWeight: 400,
            lineHeight: '92px',
            letterSpacing: '-0.015em',
            color: '#F5F5F2',
            margin: 0,
          }}
        >
          Your next chapter
          <br />
          starts with a note.
        </h3>

        <p
          style={{
            position: 'absolute',
            top: '3812px',
            left: 0,
            width: '948px',
            textAlign: 'center',
            fontSize: '36px',
            color: '#A0A09B',
          }}
        >
          A workspace for your product story.
        </p>

        <input
          type="email"
          placeholder="Work email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          style={{
            position: 'absolute',
            left: '61px',
            top: '3925px',
            width: '826px',
            height: '104px',
            borderRadius: '14px',
            backgroundColor: '#0A0A09',
            border: '1px solid #2A2A28',
            padding: '0 44px',
            fontSize: '28px',
            color: '#F5F5F2',
            outline: 'none',
          }}
        />

        <button
          onClick={() => setActiveView('workspace')}
          style={{
            position: 'absolute',
            left: '61px',
            top: '4066px',
            width: '826px',
            height: '105px',
            borderRadius: '14px',
            backgroundColor: '#F3F2EE',
            border: '1px solid #F3F2EE',
            color: '#141413',
            fontSize: '31px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Start writing
        </button>

        {/* Mobile Footer (y: 4314..4740) */}
        <div
          style={{
            position: 'absolute',
            left: '59px',
            top: '4314px',
            width: '830px',
            height: '1px',
            backgroundColor: '#2A2A28',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '63px',
            top: '4360px',
            fontSize: '50px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#F5F5F2',
          }}
        >
          Oriel
        </div>

        <div
          style={{
            position: 'absolute',
            left: '65px',
            top: '4454px',
            display: 'flex',
            gap: '54px',
            fontSize: '25px',
            color: '#A0A09B',
          }}
        >
          <span>Help center</span>
          <span>Contact</span>
          <span>Privacy</span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: '59px',
            top: '4531px',
            width: '830px',
            height: '1px',
            backgroundColor: '#2A2A28',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '63px',
            top: '4568px',
            fontSize: '24px',
            color: '#8E8E89',
            lineHeight: '39px',
          }}
        >
          <div>© 2026 Oriel</div>
          <div>Thoughtfully shipped.</div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: '63px',
            top: '4588px',
            fontSize: '24px',
            color: '#8E8E89',
          }}
        >
          Terms
        </div>
      </div>
    );
  };

  /* ============================================================================
   * 3. WORKSPACE WEB APP STAGE (1536 x 1024) — 1:1 with app.png
   * ============================================================================ */
  const renderWorkspaceStage = () => {
    return (
      <div
        style={{
          width: '1536px',
          height: '1024px',
          position: 'relative',
          backgroundColor: '#0A0A0A',
          color: '#F5F5F2',
          fontFamily: 'var(--font-sans)',
          userSelect: 'none',
        }}
      >
        {/* Top Header (y: 0..78) */}
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1536px',
            height: '78px',
            borderBottom: '1px solid #222220',
          }}
        >
          <span
            onClick={() => setActiveView('desktop')}
            style={{
              position: 'absolute',
              left: '63px',
              top: '21px',
              fontSize: '34px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#F5F5F2',
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            Oriel
          </span>

          {/* Nav items: Mica (x: 228), Updates (x: 324), Review (x: 447), Settings (x: 560) */}
          {(
            [
              { id: 'Mica', left: 228, underlineLeft: 214, underlineWidth: 66 },
              { id: 'Updates', left: 324, underlineLeft: 310, underlineWidth: 91 },
              { id: 'Review', left: 447, underlineLeft: 435, underlineWidth: 78 },
              { id: 'Settings', left: 560, underlineLeft: 548, underlineWidth: 86 },
            ] as const
          ).map((item) => {
            const active = workspaceTab === item.id;
            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setWorkspaceTab(item.id)}
                  style={{
                    position: 'absolute',
                    left: `${item.left}px`,
                    top: '29px',
                    background: 'none',
                    border: 'none',
                    fontSize: '17px',
                    fontWeight: active ? 500 : 400,
                    color: active ? '#F5F5F2' : '#9E9E99',
                    cursor: 'pointer',
                  }}
                >
                  {item.id}
                </button>
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${item.underlineLeft}px`,
                      top: '76px',
                      width: `${item.underlineWidth}px`,
                      height: '2px',
                      backgroundColor: '#F5F5F2',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Right User Profile (x: 1314..1474) */}
          <div
            style={{
              position: 'absolute',
              left: '1314px',
              top: '19px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1E1E1D',
                border: '1px solid #2E2E2C',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 500,
                color: '#F5F5F2',
              }}
            >
              NC
            </span>
            <span style={{ fontSize: '16px', color: '#B8B8B4' }}>Nina Cole</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ marginLeft: '2px' }}>
              <path d="M1.5 1.75L6 6.25L10.5 1.75" stroke="#8E8E89" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </header>

        {/* Breadcrumb (x: 64, y: 120) */}
        <div
          style={{
            position: 'absolute',
            left: '64px',
            top: '120px',
            fontSize: '16px',
            color: '#9E9E99',
            display: 'flex',
            gap: '12px',
          }}
        >
          <span>Workspace</span>
          <span style={{ color: '#6E6E6A' }}>/</span>
          <span>{workspaceTab}</span>
        </div>

        {/* Heading Updates (x: 63, y: 174) */}
        <h1
          style={{
            position: 'absolute',
            left: '63px',
            top: '174px',
            fontSize: '49px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#F5F5F2',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {workspaceTab}
        </h1>

        <p
          style={{
            position: 'absolute',
            left: '63px',
            top: '235px',
            fontSize: '19px',
            color: '#9A9A95',
            letterSpacing: '-0.01em',
          }}
        >
          Good work deserves a clear story.
        </p>

        {/* New update button (x: 1325..1474, y: 178..227, 149x49) */}
        <button
          onClick={() => setShowNewUpdateModal(true)}
          style={{
            position: 'absolute',
            left: '1325px',
            top: '178px',
            width: '149px',
            height: '49px',
            borderRadius: '8px',
            backgroundColor: '#0E0E0D',
            border: '1px solid #3A3A38',
            color: '#F5F5F2',
            fontSize: '16px',
            fontWeight: 400,
            cursor: 'pointer',
          }}
        >
          New update
        </button>

        {/* Left Updates List (x: 61..842, y: 306..665) */}
        <div
          style={{
            position: 'absolute',
            left: '61px',
            top: '306px',
            width: '781px',
          }}
        >
          {updates.map((u, idx) => {
            const active = u.id === selectedUpdate.id;
            const isScheduled = u.status === 'Scheduled';
            return (
              <React.Fragment key={u.id}>
                <div
                  onClick={() => setSelectedUpdateId(u.id)}
                  style={{
                    width: '781px',
                    height: active ? '118px' : '119px',
                    borderRadius: active ? '10px' : '0',
                    backgroundColor: active ? '#151514' : 'transparent',
                    border: active ? '1px solid #242422' : 'none',
                    padding: '0 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '23px',
                        fontWeight: 400,
                        color: '#F5F5F2',
                        letterSpacing: '-0.015em',
                        marginBottom: '10px',
                      }}
                    >
                      {u.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '16.5px',
                        color: '#9E9E99',
                      }}
                    >
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: isScheduled ? '#7B9C88' : '#8A8A85',
                          flexShrink: 0,
                        }}
                      />
                      <span>
                        {u.status}
                        {isScheduled ? `  ·  28 Oct, 09:00 UTC` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Right Chevron */}
                  <svg width="11" height="20" viewBox="0 0 11 20" fill="none">
                    <path d="M1.5 1.5L9.5 10L1.5 18.5" stroke="#9E9E99" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Hairline after non-active rows */}
                {!active && (
                  <div
                    style={{
                      width: '781px',
                      height: '1px',
                      backgroundColor: '#1E1E1C',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Vertical Divider at x: 879, y: 302..830 */}
        <div
          style={{
            position: 'absolute',
            left: '879px',
            top: '302px',
            width: '1px',
            height: '528px',
            backgroundColor: '#212021',
          }}
        />

        {/* Right Detail Preview Pane (x: 926..1474, y: 320..800) */}
        <div
          style={{
            position: 'absolute',
            left: '926px',
            top: '320px',
            width: '548px',
          }}
        >
          {/* Top bar: PUBLIC CHANGELOG + Preview ↗ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '34px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                color: '#9E9E99',
              }}
            >
              PUBLIC CHANGELOG
            </span>

            <button
              onClick={() => setActiveView('component')}
              style={{
                background: 'none',
                border: 'none',
                color: '#B8B8B4',
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <span>Preview</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 2.5H3.5C2.94772 2.5 2.5 2.94772 2.5 3.5V12.5C2.5 13.0523 2.94772 13.5 3.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V10" stroke="#9E9E99" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M9.5 2.5H13.5V6.5" stroke="#9E9E99" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.2 2.8L7.5 8.5" stroke="#9E9E99" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Serif Title (y: 373 -> relative 53px) */}
          <h2
            className="font-serif-oriel"
            style={{
              fontSize: '48px',
              fontWeight: 400,
              lineHeight: 1.06,
              letterSpacing: '-0.012em',
              color: '#F5F5F2',
              margin: '0 0 22px 0',
            }}
          >
            {selectedUpdate.title}
          </h2>

          {/* Excerpt (y: 445) */}
          <p
            style={{
              fontSize: '18.5px',
              color: '#A3A39E',
              lineHeight: 1.45,
              letterSpacing: '-0.01em',
            }}
          >
            {selectedUpdate.excerpt}
          </p>

          {/* Divider 1 at y: 588 (relative top: 268px) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '268px',
              width: '548px',
              height: '1px',
              backgroundColor: '#212021',
            }}
          />

          {/* Metadata Row 1: Publication (y: 622 -> relative top: 302px) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '302px',
              width: '548px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '17px',
            }}
          >
            <span style={{ width: '176px', color: '#9E9E99' }}>Publication</span>
            <span style={{ color: '#E5E5E0' }}>
              {selectedUpdate.scheduledDate} · {selectedUpdate.scheduledTime}
            </span>
          </div>

          {/* Metadata Row 2: Review (y: 664 -> relative top: 344px) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '344px',
              width: '548px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '17px',
            }}
          >
            <span style={{ width: '176px', color: '#9E9E99' }}>Review</span>
            <span style={{ color: '#E5E5E0' }}>Approved by {selectedUpdate.reviewer.name}</span>
          </div>

          {/* Divider 2 at y: 721 (relative top: 401px) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '401px',
              width: '548px',
              height: '1px',
              backgroundColor: '#212021',
            }}
          />

          {/* View preview → at y: 760 (relative top: 440px) */}
          <button
            onClick={() => setActiveView('component')}
            style={{
              position: 'absolute',
              left: 0,
              top: '440px',
              background: 'none',
              border: 'none',
              color: '#F5F5F2',
              fontSize: '17px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <span>View preview</span>
            <span>→</span>
          </button>
        </div>

        {/* Bottom Left Count (x: 63, y: 942) */}
        <div
          style={{
            position: 'absolute',
            left: '63px',
            top: '942px',
            fontSize: '16.5px',
            color: '#9A9A95',
          }}
        >
          {updates.length} updates in this workspace
        </div>
      </div>
    );
  };

  /* ============================================================================
   * 4. ISOLATED COMPONENT STAGE (1295 x 1214) — 1:1 with component.png
   * ============================================================================ */
  const renderComponentStage = () => {
    return (
      <div
        style={{
          width: '1295px',
          height: '1214px',
          position: 'relative',
          backgroundColor: '#080807',
          color: '#F5F5F2',
          fontFamily: 'var(--font-sans)',
          userSelect: 'none',
        }}
      >
        {/* Centered Card (x: 123..1171, y: 100..1132, 1048x1032) */}
        <div
          style={{
            position: 'absolute',
            left: '123px',
            top: '100px',
            width: '1048px',
            height: '1032px',
            borderRadius: '14px',
            backgroundColor: '#0F0F0F',
            border: '1px solid #242422',
          }}
        >
          {/* Top Row: Oriel | Publication + Close X (y: 159..197 -> relative top: 58px, left: 64px) */}
          <span
            onClick={() => setActiveView('desktop')}
            style={{
              position: 'absolute',
              left: '64px',
              top: '54px',
              fontSize: '42px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#F5F5F2',
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            Oriel
          </span>

          {/* Vertical Pipe at x: 313 -> relative left: 190px */}
          <div
            style={{
              position: 'absolute',
              left: '190px',
              top: '56px',
              width: '1px',
              height: '42px',
              backgroundColor: '#3A3A38',
            }}
          />

          <span
            style={{
              position: 'absolute',
              left: '226px',
              top: '66px',
              fontSize: '23px',
              fontWeight: 400,
              color: '#A3A39E',
              lineHeight: 1,
            }}
          >
            Publication
          </span>

          {/* Close X button (x: 1092..1114 -> relative left: 968px, top: 62px) */}
          <button
            onClick={() => setActiveView('workspace')}
            aria-label="Close publication modal"
            style={{
              position: 'absolute',
              left: '965px',
              top: '58px',
              width: '32px',
              height: '32px',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2 2L22 22M22 2L2 22" stroke="#9E9E99" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {/* Status Pill: Green dot + Scheduled (y: 272 -> relative top: 170px, left: 68px) */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '170px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <span
              style={{
                width: '19px',
                height: '19px',
                borderRadius: '50%',
                backgroundColor: '#7B9C88',
              }}
            />
            <span style={{ fontSize: '24px', color: '#A3A39E', fontWeight: 400 }}>
              {selectedUpdate.status}
            </span>
          </div>

          {/* Large Serif Heading (y: 327..488 -> relative top: 222px, left: 68px) */}
          <h2
            className="font-serif-oriel"
            style={{
              position: 'absolute',
              left: '68px',
              top: '222px',
              fontSize: '82px',
              fontWeight: 400,
              lineHeight: '82px',
              letterSpacing: '-0.015em',
              color: '#F5F5F2',
              margin: 0,
            }}
          >
            {selectedUpdate.id === 'upd_072' ? (
              <>
                A faster way to
                <br />
                find your work
              </>
            ) : (
              selectedUpdate.title
            )}
          </h2>

          {/* Subtitle (y: 519 -> relative top: 416px) */}
          <p
            style={{
              position: 'absolute',
              left: '68px',
              top: '416px',
              fontSize: '25px',
              color: '#A0A09B',
              letterSpacing: '-0.005em',
            }}
          >
            A product update for the Mica changelog.
          </p>

          {/* 3-Row Metadata Table */}
          {/* Row 1: Publish on (y: 624 -> relative top: 521px) */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '521px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
            }}
          >
            <span style={{ width: '288px', color: '#9E9E99' }}>Publish on</span>
            {isEditingSchedule ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  style={{
                    backgroundColor: '#181817',
                    border: '1px solid #3A3A38',
                    borderRadius: '6px',
                    color: '#F5F5F2',
                    padding: '4px 12px',
                    fontSize: '20px',
                    width: '180px',
                  }}
                />
                <input
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  style={{
                    backgroundColor: '#181817',
                    border: '1px solid #3A3A38',
                    borderRadius: '6px',
                    color: '#F5F5F2',
                    padding: '4px 12px',
                    fontSize: '20px',
                    width: '150px',
                  }}
                />
              </div>
            ) : (
              <span style={{ color: '#F0F0EC' }}>
                {schedDate}  ·  {schedTime}
              </span>
            )}
          </div>

          {/* Row 2: Destination (y: 706 -> relative top: 603px) */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '603px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
            }}
          >
            <span style={{ width: '288px', color: '#9E9E99' }}>Destination</span>
            <span style={{ color: '#F0F0EC' }}>Public changelog</span>
          </div>

          {/* Row 3: Reviewed by (y: 787 -> relative top: 684px) */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '684px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
            }}
          >
            <span style={{ width: '288px', color: '#9E9E99' }}>Reviewed by</span>
            <span style={{ color: '#F0F0EC' }}>Sam Lee  ·  Approved</span>
          </div>

          {/* Note (y: 907 -> relative top: 804px) */}
          <p
            style={{
              position: 'absolute',
              left: '68px',
              top: '804px',
              fontSize: '24px',
              color: '#A0A09B',
              letterSpacing: '-0.005em',
            }}
          >
            This update will appear automatically at the scheduled time.
          </p>

          {/* Action Buttons (y: 975..1044 -> relative top: 875px, height: 68px) */}
          <button
            onClick={() => setActiveView('desktop')}
            style={{
              position: 'absolute',
              left: '68px',
              top: '875px',
              width: '238px',
              height: '68px',
              borderRadius: '10px',
              backgroundColor: '#E8E8E3',
              border: '1px solid #E8E8E3',
              color: '#141413',
              fontSize: '23px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            View preview
          </button>

          <button
            onClick={() => setIsEditingSchedule(!isEditingSchedule)}
            style={{
              position: 'absolute',
              left: '324px',
              top: '875px',
              width: '238px',
              height: '68px',
              borderRadius: '10px',
              backgroundColor: '#111110',
              border: '1px solid #3A3A38',
              color: '#F0F0EC',
              fontSize: '23px',
              fontWeight: 400,
              cursor: 'pointer',
            }}
          >
            {isEditingSchedule ? 'Save schedule' : 'Edit schedule'}
          </button>

          {/* Bottom ID (y: 1077 -> relative top: 974px) */}
          <div
            style={{
              position: 'absolute',
              left: '68px',
              top: '974px',
              fontSize: '18px',
              color: '#6E6E69',
              letterSpacing: '0.01em',
            }}
          >
            {selectedUpdate.tag}
          </div>
        </div>
      </div>
    );
  };

  const renderActiveStage = () => {
    const dim = stageDimensions[activeView];
    const stageNode =
      activeView === 'desktop'
        ? renderDesktopStage()
        : activeView === 'mobile'
        ? renderMobileStage()
        : activeView === 'workspace'
        ? renderWorkspaceStage()
        : renderComponentStage();

    return (
      <Scaled width={dim.width} height={dim.height} maxWidth={dim.maxWidth}>
        {stageNode}
      </Scaled>
    );
  };

  const dim = stageDimensions[activeView];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#060606' }}>
      {compareMode === 'side' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '16px',
            alignItems: 'start',
          }}
        >
          <div style={{ border: '1px solid #282828', borderRadius: '8px', overflow: 'hidden' }}>
            <div
              className="font-mono-oriel"
              style={{
                padding: '8px 14px',
                backgroundColor: '#111111',
                borderBottom: '1px solid #282828',
                fontSize: '11px',
                color: '#FFF',
              }}
            >
              LIVE REACT DOM ({activeView} — {dim.width}×{dim.height})
            </div>
            {renderActiveStage()}
          </div>

          <div
            style={{
              border: '1px solid #282828',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'sticky',
              top: '16px',
            }}
          >
            <div
              className="font-mono-oriel"
              style={{
                padding: '8px 14px',
                backgroundColor: '#111111',
                borderBottom: '1px solid #282828',
                fontSize: '11px',
                color: '#FFF',
              }}
            >
              SUPPLIED REFERENCE ART ({referenceImageForView[activeView]})
            </div>
            <div style={{ maxWidth: `${dim.maxWidth}px`, margin: '0 auto' }}>
              <img
                src={referenceImageForView[activeView]}
                alt="Supplied Reference Art"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {renderActiveStage()}
          {compareMode === 'overlay' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: `${dim.maxWidth}px`,
                pointerEvents: 'none',
                zIndex: 400,
              }}
            >
              <img
                src={referenceImageForView[activeView]}
                alt="Reference Overlay"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  opacity: overlayOpacity / 100,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Interactive New Update Modal */}
      {showNewUpdateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <form
            onSubmit={handleCreateUpdate}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#0F0F0F',
              border: '1px solid #282826',
              borderRadius: '12px',
              padding: '32px',
              color: '#F5F5F2',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '18px', fontWeight: 500 }}>Draft new update</span>
              <button
                type="button"
                onClick={() => setShowNewUpdateModal(false)}
                style={{ background: 'none', border: 'none', color: '#9E9E99', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9E9E99', marginBottom: '6px' }}>
                Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Scoped API tokens & audit logs"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #2C2C2A',
                  backgroundColor: '#161615',
                  color: '#F5F5F2',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9E9E99', marginBottom: '6px' }}>
                Summary
              </label>
              <textarea
                rows={3}
                placeholder="One clear sentence describing what changed..."
                value={newExcerpt}
                onChange={(e) => setNewExcerpt(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #2C2C2A',
                  backgroundColor: '#161615',
                  color: '#F5F5F2',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9E9E99', marginBottom: '6px' }}>
                Target release date
              </label>
              <input
                type="text"
                value={newScheduleDate}
                onChange={(e) => setNewScheduleDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #2C2C2A',
                  backgroundColor: '#161615',
                  color: '#F5F5F2',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowNewUpdateModal(false)}
                className="oriel-btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="oriel-btn-primary">
                Save update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating 1:1 Eval & View Switcher Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 800,
          backgroundColor: 'rgba(17,17,17,0.95)',
          border: '1px solid var(--rule-panel)',
          borderRadius: '999px',
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.6)',
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
              padding: '5px 11px',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer',
              backgroundColor: activeView === tab.id ? 'var(--ink-light)' : 'transparent',
              color: activeView === tab.id ? '#090909' : 'var(--ink-muted)',
            }}
          >
            {tab.label}
          </button>
        ))}

        <span style={{ color: 'var(--rule-panel)' }}>|</span>

        {(['off', 'side', 'overlay'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCompareMode(m)}
            className="font-mono-oriel"
            style={{
              border: '1px solid var(--rule-panel)',
              borderRadius: '999px',
              padding: '4px 9px',
              fontSize: '10.5px',
              cursor: 'pointer',
              backgroundColor: compareMode === m ? 'var(--sage-dot)' : '#181818',
              color: compareMode === m ? '#090909' : 'var(--ink-muted)',
            }}
          >
            {m === 'off' ? '1:1 Compare: Off' : m === 'side' ? 'Side-by-Side' : 'Overlay'}
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
