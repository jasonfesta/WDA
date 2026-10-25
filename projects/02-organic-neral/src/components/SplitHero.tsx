import React, { useState } from 'react';
import { SAMPLE_RUN } from '../data';

interface SplitHeroProps {
  onOpenWorkspace: () => void;
  onExploreCases: () => void;
}

export const SplitHero: React.FC<SplitHeroProps> = ({ onOpenWorkspace, onExploreCases }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <section
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '52px 24px 64px 24px',
      }}
      className="neral-hero-section"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '56px',
          alignItems: 'start',
        }}
        className="neral-hero-grid"
      >
        {/* Left Column (Editorial Headline + Copy + CTAs) */}
        <div style={{ maxWidth: '560px' }}>
          <div
            className="font-mono"
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: 'var(--ink-secondary)',
              marginBottom: '20px',
            }}
          >
            MODEL EVALUATION, TOGETHER
          </div>

          <h1
            style={{
              fontSize: 'clamp(34px, 4.2vw, 48px)',
              lineHeight: 1.14,
              fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--ink-primary)',
              marginBottom: '24px',
            }}
          >
            Make the next model<br />decision a clear one.
          </h1>

          <p
            className="font-serif"
            style={{
              fontSize: '20px',
              lineHeight: 1.5,
              color: 'var(--ink-secondary)',
              marginBottom: '36px',
              maxWidth: '490px',
            }}
          >
            Design evaluations, compare experiments, and bring the evidence into one shared review.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={onOpenWorkspace}
              style={{
                backgroundColor: 'var(--ink-primary)',
                color: '#FFFFFF',
                padding: '11px 22px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#151515')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--ink-primary)')}
            >
              <span>Explore the workspace</span>
              <span>→</span>
            </button>

            <button
              onClick={onExploreCases}
              style={{
                fontSize: '14px',
                color: 'var(--ink-primary)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                padding: '4px 0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-primary)')}
            >
              See the method
            </button>
          </div>
        </div>

        {/* Right Column: Exact Flat Sample Evaluation Card */}
        <div style={{ maxWidth: '520px', width: '100%', justifySelf: 'end' }} className="hero-card-col">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onOpenWorkspace}
            style={{
              backgroundColor: 'var(--bg-canvas)',
              border: '1px solid var(--rule-base)',
              borderRadius: '4px',
              padding: '28px 32px',
              position: 'relative',
              boxShadow: isHovered ? '0 2px 12px rgba(0,0,0,0.03)' : 'none',
              transition: 'border-color 0.16s ease, box-shadow 0.16s ease',
              cursor: 'pointer',
            }}
          >
            {/* Top Label */}
            <div
              className="font-mono"
              style={{
                fontSize: '10.5px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--ink-secondary)',
                marginBottom: '6px',
              }}
            >
              SAMPLE EVALUATION
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 400,
                color: 'var(--ink-primary)',
                letterSpacing: '-0.01em',
                marginBottom: '4px',
              }}
            >
              {SAMPLE_RUN.name}
            </h2>

            {/* Subtitle EV-024 · 120 cases */}
            <div
              className="font-mono"
              style={{
                fontSize: '12px',
                color: 'var(--ink-tertiary)',
                marginBottom: '26px',
              }}
            >
              {SAMPLE_RUN.id} · {SAMPLE_RUN.totalCases} cases
            </div>

            {/* Baseline A */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '6px',
                }}
              >
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--ink-primary)', marginRight: '8px' }}>
                    Baseline A
                  </span>
                  <div
                    className="font-mono"
                    style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '2px' }}
                  >
                    {SAMPLE_RUN.baselineAccepted} / {SAMPLE_RUN.totalCases} accepted
                  </div>
                </div>
                <span
                  className="font-mono"
                  style={{ fontSize: '14px', color: 'var(--ink-primary)', fontWeight: 400 }}
                >
                  {SAMPLE_RUN.baselinePercentage}%
                </span>
              </div>

              {/* Baseline Bar */}
              <div
                style={{
                  height: '7px',
                  backgroundColor: '#ECEAE6',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '6px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${SAMPLE_RUN.baselinePercentage}%`,
                    backgroundColor: '#8E8D88', // neutral gray
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>

            {/* Candidate B */}
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '6px',
                }}
              >
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--ink-primary)', marginRight: '8px' }}>
                    Candidate B
                  </span>
                  <div
                    className="font-mono"
                    style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '2px' }}
                  >
                    {SAMPLE_RUN.candidateAccepted} / {SAMPLE_RUN.totalCases} accepted
                  </div>
                </div>
                <span
                  className="font-mono"
                  style={{ fontSize: '14px', color: 'var(--ink-primary)', fontWeight: 400 }}
                >
                  {SAMPLE_RUN.candidatePercentage}%
                </span>
              </div>

              {/* Candidate Bar */}
              <div
                style={{
                  height: '7px',
                  backgroundColor: '#ECEAE6',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '6px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${SAMPLE_RUN.candidatePercentage}%`,
                    backgroundColor: 'var(--sage-accent)', // muted sage #7FA58A
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--rule-light)',
                marginBottom: '20px',
              }}
            />

            {/* Footer row: +10 percentage points & Evidence review pending pill */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#2A5E39', // deep sage
                    marginBottom: '2px',
                  }}
                >
                  +10 percentage points
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--ink-secondary)',
                  }}
                >
                  6 regressions to inspect
                </div>
              </div>

              {/* Status Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  backgroundColor: '#FEF8EA',
                  borderRadius: '3px',
                  fontSize: '11.5px',
                  color: '#7A5712',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--amber-accent)',
                    display: 'inline-block',
                  }}
                />
                <span>Evidence review pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .neral-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .hero-card-col {
            justify-self: start !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};
