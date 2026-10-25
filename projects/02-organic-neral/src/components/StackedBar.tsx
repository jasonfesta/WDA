import React, { useState } from 'react';
import { SAMPLE_RUN } from '../data';

interface StackedBarProps {
  onSelectCategory?: (category: 'both_accepted' | 'improved' | 'regressed' | 'both_flagged' | null) => void;
  selectedCategory?: 'both_accepted' | 'improved' | 'regressed' | 'both_flagged' | null;
  forceMobile?: boolean;
}

export const StackedBar: React.FC<StackedBarProps> = ({
  onSelectCategory,
  selectedCategory = null,
  forceMobile = false,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const segments = [
    {
      id: 'both_accepted' as const,
      label: 'Both accepted',
      count: 90,
      percentage: 75,
      color: '#9E9D99',
    },
    {
      id: 'improved' as const,
      label: 'Improved',
      count: 18,
      percentage: 15,
      color: '#7FA58A',
    },
    {
      id: 'regressed' as const,
      label: 'Regressed',
      count: 6,
      percentage: 5,
      color: '#E8B65A',
    },
    {
      id: 'both_flagged' as const,
      label: 'Both flagged',
      count: 6,
      percentage: 5,
      color: '#DEDDD9',
    },
  ];

  const handleToggle = (id: 'both_accepted' | 'improved' | 'regressed' | 'both_flagged') => {
    if (onSelectCategory) {
      onSelectCategory(selectedCategory === id ? null : id);
    }
  };

  const activeHover = hoveredSegment ? segments.find((s) => s.id === hoveredSegment) : null;

  return (
    <section
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: forceMobile ? '36px 20px 28px' : '56px 24px 40px 24px',
        borderTop: '1px solid var(--rule-base)',
      }}
      className="stacked-bar-section"
    >
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: forceMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '32px',
        }}
        className="stacked-bar-header"
      >
        <div style={{ maxWidth: '640px' }}>
          <h2
            style={{
              fontSize: forceMobile ? '32px' : 'clamp(30px, 3.8vw, 44px)',
              fontWeight: 400,
              lineHeight: 1.14,
              letterSpacing: '-0.025em',
              color: 'var(--ink-primary)',
              marginBottom: '14px',
            }}
          >
            Evidence keeps the
            <br />
            exceptions visible.
          </h2>
          <p
            className="font-serif"
            style={{
              fontSize: forceMobile ? '17px' : '19px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.5,
            }}
          >
            Compare paired cases before deciding what moves forward.
          </p>
        </div>

        <div
          style={{
            textAlign: forceMobile ? 'left' : 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: forceMobile ? 'flex-start' : 'flex-end',
            gap: '4px',
            paddingTop: '6px',
          }}
          className="stacked-bar-meta"
        >
          <div
            className="font-mono"
            style={{
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink-tertiary)',
            }}
          >
            SAMPLE EVALUATION · {SAMPLE_RUN.id}
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: '13px',
              color: 'var(--ink-secondary)',
            }}
          >
            {SAMPLE_RUN.totalCases} paired cases
          </div>
        </div>
      </div>

      {/* Desktop: Single Continuous 120-Case Stacked Bar + Inline Legend */}
      <div className={forceMobile ? 'neral-hide-on-mobile' : 'neral-desktop-bar'}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              height: '24px',
              width: '100%',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            {segments.map((seg, idx) => {
              const isHighlighted = selectedCategory
                ? selectedCategory === seg.id
                : hoveredSegment
                ? hoveredSegment === seg.id
                : true;
              return (
                <div
                  key={seg.id}
                  onClick={() => handleToggle(seg.id)}
                  onMouseEnter={() => setHoveredSegment(seg.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  style={{
                    width: `${seg.percentage}%`,
                    height: '100%',
                    backgroundColor: seg.color,
                    borderRight: idx < segments.length - 1 ? '1.5px solid #FFFFFF' : 'none',
                    opacity: isHighlighted ? 1 : 0.45,
                    cursor: 'pointer',
                    transition: 'opacity 0.16s ease',
                    position: 'relative',
                  }}
                  title={`${seg.label}: ${seg.count} cases (${seg.percentage}%)`}
                />
              );
            })}
          </div>

          {activeHover && (
            <div
              style={{
                position: 'absolute',
                top: '-34px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--ink-primary)',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '2px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              {activeHover.label}: {activeHover.count} cases ({activeHover.percentage}%)
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            fontSize: '14px',
            color: 'var(--ink-primary)',
            marginBottom: '12px',
          }}
        >
          {segments.map((seg) => {
            const isSelected = selectedCategory === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => handleToggle(seg.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  opacity: selectedCategory && !isSelected ? 0.45 : 1,
                  padding: '4px 0',
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: seg.color,
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontWeight: isSelected ? 500 : 400 }}>{seg.label}</span>
                <span className="font-mono" style={{ color: 'var(--ink-tertiary)', marginLeft: '4px' }}>
                  {seg.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile (390px): Exact 2x2 Category Count Display matching 02-organic/mobile-homepage.png */}
      <div
        className={forceMobile ? 'neral-show-on-mobile' : 'neral-mobile-grid'}
        style={{
          display: forceMobile ? 'grid' : 'none',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--rule-base)',
          borderRadius: '4px',
          backgroundColor: 'var(--bg-canvas)',
        }}
      >
        {segments.map((seg, idx) => (
          <div
            key={seg.id}
            onClick={() => handleToggle(seg.id)}
            style={{
              padding: '16px',
              borderRight: idx % 2 === 0 ? '1px solid var(--rule-light)' : 'none',
              borderBottom: idx < 2 ? '1px solid var(--rule-light)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '6px' }}>
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: seg.color,
                  display: 'inline-block',
                }}
              />
              <span>{seg.label}</span>
            </div>
            <div className="font-mono" style={{ fontSize: '26px', fontWeight: 400, color: 'var(--ink-primary)' }}>
              {seg.count}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .neral-desktop-bar {
            display: none !important;
          }
          .neral-mobile-grid {
            display: grid !important;
          }
          .stacked-bar-meta {
            text-align: left !important;
            align-items: flex-start !important;
          }
        }
        .neral-hide-on-mobile {
          display: none !important;
        }
      `}</style>
    </section>
  );
};
