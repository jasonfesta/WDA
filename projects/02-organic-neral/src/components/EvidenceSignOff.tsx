import React, { useState } from 'react';
import { SAMPLE_RUN } from '../data';

interface EvidenceSignOffProps {
  onSignComplete?: () => void;
  standaloneCard?: boolean;
}

export const EvidenceSignOff: React.FC<EvidenceSignOffProps> = ({
  onSignComplete,
  standaloneCard = false,
}) => {
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [decisionNote, setDecisionNote] = useState<string>('Regression cases need follow-up owners.');
  const [requestedChanges, setRequestedChanges] = useState<boolean>(false);

  const handleSign = () => {
    setIsSigned(true);
    setRequestedChanges(false);
    if (onSignComplete) onSignComplete();
  };

  const handleRequestChanges = () => {
    setRequestedChanges(true);
    setIsSigned(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--rule-base)',
        borderRadius: '4px',
        padding: '36px 40px',
        maxWidth: '820px',
        margin: '0 auto',
        boxShadow: standaloneCard ? '0 1px 3px rgba(0,0,0,0.02)' : 'none',
      }}
      className="evidence-signoff-card"
    >
      {/* Top Header Row: NERAL left, EV-024 right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: 'var(--ink-primary)',
          }}
        >
          NERAL
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: '13px',
            color: 'var(--ink-secondary)',
          }}
        >
          {SAMPLE_RUN.id}
        </span>
      </div>

      {/* Main Title Row: Evidence sign-off + Review pending badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '6px',
          flexWrap: 'wrap',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--ink-primary)',
          }}
        >
          Evidence sign-off
        </h1>

        {/* Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            backgroundColor: isSigned ? 'var(--sage-bg)' : requestedChanges ? '#FCF0EF' : '#FEF8EA',
            borderRadius: '3px',
            fontSize: '12px',
            color: isSigned ? 'var(--sage-dark)' : requestedChanges ? '#8B2117' : '#7A5712',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isSigned ? 'var(--sage-accent)' : requestedChanges ? '#D34538' : 'var(--amber-accent)',
              display: 'inline-block',
            }}
          />
          <span>{isSigned ? 'Review completed' : requestedChanges ? 'Changes requested' : 'Review pending'}</span>
        </div>
      </div>

      {/* Subtitle: Support answers · 120 cases */}
      <div
        className="font-mono"
        style={{
          fontSize: '14px',
          color: 'var(--ink-secondary)',
          marginBottom: '28px',
        }}
      >
        {SAMPLE_RUN.name} · {SAMPLE_RUN.totalCases} cases
      </div>

      {/* Comparison Summary Box */}
      <div
        style={{
          border: '1px solid var(--rule-light)',
          borderRadius: '4px',
          padding: '24px',
          backgroundColor: '#FFFFFF',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '20px',
          }}
          className="signoff-summary-grid"
        >
          {/* Baseline A */}
          <div>
            <div style={{ fontSize: '13px', color: 'var(--ink-primary)', marginBottom: '4px' }}>
              Baseline A
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '32px',
                fontWeight: 500,
                color: 'var(--ink-primary)',
                lineHeight: 1.1,
                marginBottom: '4px',
              }}
            >
              80%
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-secondary)',
                marginBottom: '10px',
              }}
            >
              96 / 120 accepted
            </div>
            <div
              style={{
                height: '7px',
                backgroundColor: '#ECEAE6',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '80%',
                  backgroundColor: 'var(--sage-accent)',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>

          {/* Candidate B */}
          <div>
            <div style={{ fontSize: '13px', color: 'var(--ink-primary)', marginBottom: '4px' }}>
              Candidate B
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '32px',
                fontWeight: 500,
                color: 'var(--ink-primary)',
                lineHeight: 1.1,
                marginBottom: '4px',
              }}
            >
              90%
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-secondary)',
                marginBottom: '10px',
              }}
            >
              108 / 120 accepted
            </div>
            <div
              style={{
                height: '7px',
                backgroundColor: '#ECEAE6',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '90%',
                  backgroundColor: 'var(--sage-accent)',
                  borderRadius: '3px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Divider line inside summary */}
        <div style={{ height: '1px', backgroundColor: 'var(--rule-light)', marginBottom: '14px' }} />

        {/* Metrics Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
          <span style={{ color: '#2A5E39', fontWeight: 500 }}>+10 percentage points</span>
          <span style={{ color: 'var(--ink-tertiary)' }}>·</span>
          <span style={{ color: 'var(--ink-secondary)' }}>6 regressions</span>
        </div>
      </div>

      {/* Reviewer Section */}
      <div
        style={{
          border: '1px solid var(--rule-light)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            fontSize: '13px',
            color: 'var(--ink-secondary)',
            borderBottom: '1px solid var(--rule-light)',
          }}
        >
          {isSigned ? '3 of 3 reviewers signed' : '2 of 3 reviewers signed'}
        </div>

        {/* Asha Ng - Signed */}
        <div
          style={{
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--rule-light)',
          }}
        >
          <span style={{ fontSize: '14px', color: 'var(--ink-primary)' }}>Asha Ng</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#1E6B43',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: '13px', color: '#1E6B43', fontWeight: 400 }}>Signed</span>
          </div>
        </div>

        {/* Leo Ruiz - Signed */}
        <div
          style={{
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--rule-light)',
          }}
        >
          <span style={{ fontSize: '14px', color: 'var(--ink-primary)' }}>Leo Ruiz</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#1E6B43',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: '13px', color: '#1E6B43', fontWeight: 400 }}>Signed</span>
          </div>
        </div>

        {/* Mina Shah - Pending or Signed */}
        <div
          style={{
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '14px', color: 'var(--ink-primary)' }}>Mina Shah</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isSigned ? (
              <>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#1E6B43',
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: '13px', color: '#1E6B43', fontWeight: 400 }}>Signed</span>
              </>
            ) : (
              <>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--ink-secondary)',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontWeight: 400 }}>Pending</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checked Checkbox: I reviewed the six regression cases */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <button
          onClick={() => setIsChecked(!isChecked)}
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: isChecked ? 'var(--ink-primary)' : '#FFFFFF',
            border: isChecked ? 'none' : '1px solid var(--rule-base)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '12px',
            cursor: 'pointer',
          }}
          aria-label="Toggle acknowledgment"
        >
          {isChecked && '✓'}
        </button>
        <span style={{ fontSize: '14px', color: 'var(--ink-primary)' }}>
          I reviewed the six regression cases.
        </span>
      </div>

      {/* Decision Note Field */}
      <div
        style={{
          border: '1px solid var(--rule-light)',
          borderRadius: '4px',
          padding: '12px 16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            color: 'var(--ink-tertiary)',
            marginBottom: '4px',
          }}
        >
          Decision note
        </div>
        <input
          type="text"
          value={decisionNote}
          onChange={(e) => setDecisionNote(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: 'var(--ink-primary)',
            backgroundColor: 'transparent',
            padding: 0,
          }}
        />
      </div>

      {/* Bottom Row: Short Serif copy left, buttons right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
        className="signoff-actions-row"
      >
        <div
          className="font-serif"
          style={{
            fontSize: '14px',
            color: 'var(--ink-secondary)',
          }}
        >
          Signing confirms the evidence record. It does not release a model.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSign}
            disabled={isSigned}
            style={{
              backgroundColor: isSigned ? '#1E6B43' : 'var(--ink-primary)',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 400,
              cursor: isSigned ? 'default' : 'pointer',
            }}
          >
            {isSigned ? 'Evidence review signed ✓' : 'Sign evidence review →'}
          </button>

          <button
            onClick={handleRequestChanges}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--rule-base)',
              color: 'var(--ink-primary)',
              padding: '10px 18px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            Request changes
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .evidence-signoff-card {
            padding: 24px 20px !important;
          }
          .signoff-summary-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .signoff-actions-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
};
