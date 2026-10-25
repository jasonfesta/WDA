import React from 'react';

export const MethodNarrative: React.FC = () => {
  return (
    <section
      id="method"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '56px 24px 72px 24px',
        borderTop: '1px solid var(--rule-base)',
      }}
      className="method-narrative-section"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 380px) 1fr',
          gap: '64px',
          alignItems: 'start',
        }}
        className="method-narrative-grid"
      >
        {/* Left Column: Heading and Source Serif copy */}
        <div>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 400,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              color: 'var(--ink-primary)',
              marginBottom: '18px',
            }}
          >
            A score is a starting point.
          </h2>

          <p
            className="font-serif"
            style={{
              fontSize: '18px',
              lineHeight: 1.55,
              color: 'var(--ink-secondary)',
            }}
          >
            Decide what good means. Compare the same cases. Leave a decision your team can trace.
          </p>
        </div>

        {/* Right Column: Three Horizontal Steps with Fine Arrows */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px',
            paddingTop: '6px',
          }}
          className="method-steps-container"
        >
          {/* Step 1 */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 500,
                color: 'var(--ink-primary)',
                marginBottom: '8px',
              }}
            >
              Define
            </h3>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.45,
                color: 'var(--ink-secondary)',
              }}
            >
              Choose the cases<br />and criteria
            </p>
          </div>

          {/* Thin arrow 1 */}
          <div
            style={{
              color: 'var(--ink-tertiary)',
              fontSize: '18px',
              paddingTop: '2px',
              userSelect: 'none',
            }}
            className="method-arrow"
          >
            →
          </div>

          {/* Step 2 */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 500,
                color: 'var(--ink-primary)',
                marginBottom: '8px',
              }}
            >
              Compare
            </h3>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.45,
                color: 'var(--ink-secondary)',
              }}
            >
              Inspect gains and<br />regressions
            </p>
          </div>

          {/* Thin arrow 2 */}
          <div
            style={{
              color: 'var(--ink-tertiary)',
              fontSize: '18px',
              paddingTop: '2px',
              userSelect: 'none',
            }}
            className="method-arrow"
          >
            →
          </div>

          {/* Step 3 */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 500,
                color: 'var(--ink-primary)',
                marginBottom: '8px',
              }}
            >
              Review
            </h3>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.45,
                color: 'var(--ink-secondary)',
              }}
            >
              Approve the evidence<br />together
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .method-narrative-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .method-steps-container {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .method-arrow {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
