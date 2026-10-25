import React, { useState } from 'react';
import { REGRESSION_CASES, EvalCase } from '../data';

interface CaseInspectorProps {
  initialCaseId?: string;
  onOpenAppReview?: (caseId: string) => void;
}

export const CaseInspector: React.FC<CaseInspectorProps> = ({
  initialCaseId = '043',
  onOpenAppReview,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId);

  const activeCase: EvalCase =
    REGRESSION_CASES.find((c) => c.id === selectedCaseId) || REGRESSION_CASES[0];

  return (
    <section
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 64px 24px',
      }}
    >
      {/* Outlier-Detail Strip: Thin border, no shadow */}
      <div
        style={{
          border: '1px solid var(--rule-base)',
          borderRadius: '4px',
          padding: '28px 32px',
          backgroundColor: 'var(--bg-canvas)',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 280px) 1fr 1fr',
          gap: '36px',
          alignItems: 'start',
        }}
        className="outlier-strip-grid"
      >
        {/* Left Column: CASE043 · Return policy exception + Pill */}
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: '12px',
              color: 'var(--ink-primary)',
              letterSpacing: '0.02em',
              marginBottom: '10px',
            }}
          >
            CASE{activeCase.id} · {activeCase.title}
          </div>

          {/* Yellow Pill: One of six regressions */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              backgroundColor: '#FEF8EA',
              borderRadius: '3px',
              fontSize: '11px',
              color: '#7A5712',
              marginBottom: '16px',
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
            <span>One of six regressions</span>
          </div>

          {/* Interactive Case Switcher Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
            {REGRESSION_CASES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className="font-mono"
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  backgroundColor: c.id === selectedCaseId ? 'var(--ink-primary)' : '#EAE8E3',
                  color: c.id === selectedCaseId ? '#FFFFFF' : 'var(--ink-secondary)',
                  border: 'none',
                }}
                title={c.title}
              >
                {c.id}
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column: Baseline A */}
        <div style={{ borderLeft: '1px solid var(--rule-light)', paddingLeft: '28px' }} className="outlier-baseline-col">
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--ink-primary)',
              marginBottom: '8px',
            }}
          >
            Baseline A
          </div>
          <p
            className="font-serif"
            style={{
              fontSize: '15px',
              lineHeight: 1.5,
              color: 'var(--ink-primary)',
            }}
          >
            {activeCase.id === '043' ? (
              'Returns within 30 days, except final-sale items.'
            ) : (
              activeCase.baseline.response
            )}
          </p>
        </div>

        {/* Right Column: Candidate B + Note */}
        <div style={{ borderLeft: '1px solid var(--rule-light)', paddingLeft: '28px' }} className="outlier-candidate-col">
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--ink-primary)',
              marginBottom: '8px',
            }}
          >
            Candidate B
          </div>
          <p
            className="font-serif"
            style={{
              fontSize: '15px',
              lineHeight: 1.5,
              color: 'var(--ink-primary)',
              marginBottom: '16px',
            }}
          >
            {activeCase.id === '043' ? 'Returns within 30 days.' : activeCase.candidate.response}
          </p>

          <div
            style={{
              fontSize: '12px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.45,
            }}
          >
            {activeCase.finding}
          </div>

          {onOpenAppReview && (
            <button
              onClick={() => onOpenAppReview(activeCase.id)}
              style={{
                fontSize: '12px',
                color: 'var(--ink-primary)',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                marginTop: '12px',
                display: 'block',
              }}
            >
              Open in evaluation workspace →
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .outlier-strip-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .outlier-baseline-col, .outlier-candidate-col {
            border-left: none !important;
            border-top: 1px solid var(--rule-light) !important;
            padding-left: 0 !important;
            padding-top: 20px !important;
          }
        }
      `}</style>
    </section>
  );
};
