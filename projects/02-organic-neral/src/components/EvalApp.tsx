import React, { useState } from 'react';
import { SAMPLE_RUN, REGRESSION_CASES, EvalCase } from '../data';

interface EvalAppProps {
  initialCaseId?: string;
  onBackToOverview: () => void;
}

export const EvalApp: React.FC<EvalAppProps> = ({
  initialCaseId = '043',
  onBackToOverview,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'decision'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const activeCase: EvalCase =
    REGRESSION_CASES.find((c) => c.id === selectedCaseId) || REGRESSION_CASES[0];

  const handleNextCase = () => {
    const currentIndex = REGRESSION_CASES.findIndex((c) => c.id === selectedCaseId);
    const nextIndex = (currentIndex + 1) % REGRESSION_CASES.length;
    setSelectedCaseId(REGRESSION_CASES[nextIndex].id);
  };

  const handlePrevCase = () => {
    const currentIndex = REGRESSION_CASES.findIndex((c) => c.id === selectedCaseId);
    const prevIndex = (currentIndex - 1 + REGRESSION_CASES.length) % REGRESSION_CASES.length;
    setSelectedCaseId(REGRESSION_CASES[prevIndex].id);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        color: 'var(--ink-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Top Navbar: NERAL | Support lab    Evaluations Datasets Review queue      MS */}
      <header
        style={{
          borderBottom: '1px solid var(--rule-base)',
          backgroundColor: '#FFFFFF',
          padding: '0 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left Brand and Workspace */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button
                onClick={onBackToOverview}
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: 'var(--ink-primary)',
                }}
              >
                NERAL
              </button>

              <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--rule-base)' }} />

              <span style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>
                Support lab
              </span>
            </div>

            {/* Nav links with active underline on Evaluations */}
            <div
              style={{
                display: 'flex',
                gap: '28px',
                height: '60px',
                alignItems: 'center',
              }}
              className="app-nav-tabs"
            >
              <button
                style={{
                  height: '100%',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--ink-primary)',
                  borderBottom: '2px solid var(--ink-primary)',
                  padding: '0 4px',
                }}
              >
                Evaluations
              </button>
              <button style={{ fontSize: '14px', color: 'var(--ink-secondary)', padding: '0 4px' }}>
                Datasets
              </button>
              <button style={{ fontSize: '14px', color: 'var(--ink-secondary)', padding: '0 4px' }}>
                Review queue
              </button>
            </div>
          </div>

          {/* Right: MS circular avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onBackToOverview}
              style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}
            >
              ← Overview
            </button>
            <div
              className="font-mono"
              title="Mina Shah"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#EAE8E3',
                color: 'var(--ink-primary)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              MS
            </div>
          </div>
        </div>
      </header>

      {/* 2. Header Title Bar */}
      <section
        style={{
          borderBottom: '1px solid var(--rule-base)',
          backgroundColor: '#FFFFFF',
          padding: '24px 32px 0 32px',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    color: 'var(--ink-primary)',
                  }}
                >
                  Support answers
                </h1>

                {/* Yellow status pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 8px',
                    backgroundColor: '#FEF8EA',
                    borderRadius: '3px',
                    fontSize: '12px',
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

              {/* Sub-label EV-024 · 120 cases */}
              <div
                className="font-mono"
                style={{
                  fontSize: '13px',
                  color: 'var(--ink-tertiary)',
                  marginTop: '4px',
                }}
              >
                EV-024 · 120 cases
              </div>
            </div>

            {/* Export evidence button */}
            <button
              onClick={() => alert('Exporting signed evidence bundle (EV-024)...')}
              style={{
                backgroundColor: 'var(--ink-primary)',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '4px',
                fontSize: '13.5px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Export evidence</span>
              <span>→</span>
            </button>
          </div>

          {/* Slim summary row in rounded box */}
          <div
            style={{
              border: '1px solid var(--rule-light)',
              borderRadius: '4px',
              padding: '14px 20px',
              display: 'grid',
              gridTemplateColumns: 'minmax(240px, 1.2fr) minmax(240px, 1.2fr) 1fr 1fr',
              gap: '24px',
              alignItems: 'center',
              marginBottom: '28px',
            }}
            className="app-metrics-strip"
          >
            {/* Baseline A */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ink-primary)' }}>Baseline A</span>
                <span className="font-mono" style={{ fontSize: '13px', fontWeight: 500 }}>80%</span>
                <span className="font-mono" style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>(96 / 120)</span>
              </div>
              <div style={{ height: '5px', backgroundColor: '#ECEAE6', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '80%', backgroundColor: 'var(--sage-accent)' }} />
              </div>
            </div>

            {/* Candidate B */}
            <div style={{ borderLeft: '1px solid var(--rule-light)', paddingLeft: '20px' }} className="strip-col">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ink-primary)' }}>Candidate B</span>
                <span className="font-mono" style={{ fontSize: '13px', fontWeight: 500 }}>90%</span>
                <span className="font-mono" style={{ fontSize: '12px', color: 'var(--ink-tertiary)' }}>(108 / 120)</span>
              </div>
              <div style={{ height: '5px', backgroundColor: '#ECEAE6', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '90%', backgroundColor: 'var(--sage-accent)' }} />
              </div>
            </div>

            {/* +10 percentage points */}
            <div
              style={{
                borderLeft: '1px solid var(--rule-light)',
                paddingLeft: '20px',
                color: '#2A5E39',
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="strip-col"
            >
              +10 percentage points
            </div>

            {/* 6 regressions */}
            <div
              style={{
                borderLeft: '1px solid var(--rule-light)',
                paddingLeft: '20px',
                color: 'var(--ink-primary)',
                fontSize: '14px',
              }}
              className="strip-col"
            >
              6 regressions
            </div>
          </div>

          {/* Three Compact Tabs: Overview, Cases, Decision */}
          <div style={{ display: 'flex', gap: '28px' }}>
            {(['overview', 'cases', 'decision'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'overview' ? 'Overview' : tab === 'cases' ? 'Cases' : 'Decision';
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 0 14px 0',
                    fontSize: '14px',
                    color: isActive ? 'var(--ink-primary)' : 'var(--ink-secondary)',
                    fontWeight: isActive ? 500 : 400,
                    borderBottom: isActive ? '2px solid var(--ink-primary)' : '2px solid transparent',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Workspace Area: 72% / 28% Grid */}
      <main
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '24px 32px 48px 32px',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 340px)',
            gap: '24px',
            alignItems: 'start',
          }}
          className="app-main-grid"
        >
          {/* Left: Case Comparison Area */}
          <div
            style={{
              border: '1px solid var(--rule-base)',
              borderRadius: '4px',
              padding: '24px',
              backgroundColor: '#FFFFFF',
            }}
          >
            {/* Case Header: Regressions (6) v | Case 043 · 1 of 6 < > */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    border: '1px solid var(--rule-base)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: 'var(--ink-primary)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <span>Regressions (6)</span>
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '4px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--rule-base)',
                      borderRadius: '4px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      zIndex: 20,
                      minWidth: '220px',
                    }}
                  >
                    {REGRESSION_CASES.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedCaseId(c.id);
                          setDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px 12px',
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          backgroundColor: c.id === selectedCaseId ? 'var(--bg-subtle)' : 'transparent',
                          borderBottom: '1px solid var(--rule-light)',
                        }}
                      >
                        <strong className="font-mono">Case {c.id}:</strong> {c.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Case 043 · 1 of 6 and chevrons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="font-mono" style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                  Case {activeCase.id} · {activeCase.index} of 6
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={handlePrevCase}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: '1px solid var(--rule-base)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ink-primary)',
                      fontSize: '14px',
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextCase}
                    style={{
                      width: '28px',
                      height: '28px',
                      border: '1px solid var(--rule-base)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--ink-primary)',
                      fontSize: '14px',
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* Case Title and Prompt */}
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 400,
                color: 'var(--ink-primary)',
                letterSpacing: '-0.015em',
                marginBottom: '8px',
              }}
            >
              {activeCase.title}
            </h2>

            <p
              className="font-serif"
              style={{
                fontSize: '16px',
                color: 'var(--ink-secondary)',
                marginBottom: '24px',
              }}
            >
              {activeCase.prompt}
            </p>

            {/* Side-by-side Response Panels */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px',
              }}
              className="app-response-grid"
            >
              {/* Baseline A Panel */}
              <div
                style={{
                  border: '1px solid var(--rule-light)',
                  borderRadius: '4px',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--ink-primary)' }}>
                    Baseline A
                  </span>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      backgroundColor: 'var(--sage-bg)',
                      borderRadius: '3px',
                      fontSize: '11.5px',
                      color: 'var(--sage-dark)',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--sage-accent)',
                      }}
                    />
                    <span>Accepted</span>
                  </div>
                </div>

                <p
                  className="font-serif"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.55,
                    color: 'var(--ink-primary)',
                  }}
                >
                  {activeCase.id === '043'
                    ? 'Returns are available within 30 days, except final-sale items.'
                    : activeCase.baseline.response}
                </p>
              </div>

              {/* Candidate B Panel */}
              <div
                style={{
                  border: '1px solid var(--rule-light)',
                  borderRadius: '4px',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--ink-primary)' }}>
                    Candidate B
                  </span>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
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
                      }}
                    />
                    <span>Flagged</span>
                  </div>
                </div>

                <p
                  className="font-serif"
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.55,
                    color: 'var(--ink-primary)',
                  }}
                >
                  {activeCase.id === '043'
                    ? 'Returns are available within 30 days.'
                    : activeCase.candidate.response}
                </p>
              </div>
            </div>

            {/* Review Finding Annotation Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-canvas)',
                borderRadius: '4px',
                padding: '16px 20px',
                marginBottom: '28px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--ink-secondary)',
                  marginBottom: '4px',
                }}
              >
                Review finding
              </div>
              <div style={{ fontSize: '14px', color: 'var(--ink-primary)' }}>
                {activeCase.finding}
              </div>
            </div>

            {/* Bottom 6 Regression Cases Selector */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                6 regression cases
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {REGRESSION_CASES.map((c) => {
                  const isSelected = c.id === selectedCaseId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className="font-mono"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '12.5px',
                        backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                        border: isSelected ? '1px solid var(--ink-primary)' : '1px solid var(--rule-light)',
                        color: 'var(--ink-primary)',
                      }}
                    >
                      {c.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Evidence Sign-off Side Panel */}
          <div
            style={{
              border: '1px solid var(--rule-base)',
              borderRadius: '4px',
              padding: '24px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 500,
                color: 'var(--ink-primary)',
                marginBottom: '4px',
              }}
            >
              Evidence sign-off
            </h3>

            <div
              style={{
                fontSize: '12.5px',
                color: 'var(--ink-secondary)',
                marginBottom: '16px',
              }}
            >
              {isSigned ? '3 of 3 reviewers signed' : '2 of 3 reviewers signed'}
            </div>

            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--rule-light)',
                marginBottom: '12px',
              }}
            />

            {/* Reviewers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', color: 'var(--ink-primary)' }}>Asha Ng</span>
                <span style={{ fontSize: '12px', color: '#1E6B43', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Signed
                </span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--rule-light)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', color: 'var(--ink-primary)' }}>Leo Ruiz</span>
                <span style={{ fontSize: '12px', color: '#1E6B43', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ Signed
                </span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--rule-light)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13.5px', color: 'var(--ink-primary)' }}>Mina Shah</span>
                {isSigned ? (
                  <span style={{ fontSize: '12px', color: '#1E6B43', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ✓ Signed
                  </span>
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ○ Pending
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--rule-light)',
                marginBottom: '16px',
              }}
            />

            {/* Serif explanation */}
            <p
              className="font-serif"
              style={{
                fontSize: '13px',
                color: 'var(--ink-secondary)',
                lineHeight: 1.45,
                marginBottom: '20px',
              }}
            >
              A sign-off approves the evidence record, not a model release.
            </p>

            {/* Status box: Your review is pending */}
            <div
              style={{
                backgroundColor: '#FEF8EA',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: '#7A5712',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--amber-accent)',
                  }}
                />
                <span>{isSigned ? 'Your review is completed.' : 'Your review is pending.'}</span>
              </div>

              <button
                onClick={() => setIsSigned(!isSigned)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--ink-primary)',
                  color: '#FFFFFF',
                  padding: '9px 12px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>{isSigned ? 'Review signed ✓' : 'Add your decision'}</span>
                <span>→</span>
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => alert('Review trace: EV-024 initiated by Asha Ng at 09:14 AM.')}
                style={{
                  fontSize: '12px',
                  color: 'var(--ink-secondary)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                View review history
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .app-main-grid {
            grid-template-columns: 1fr !important;
          }
          .app-response-grid {
            grid-template-columns: 1fr !important;
          }
          .app-metrics-strip {
            grid-template-columns: 1fr 1fr !important;
          }
          .strip-col {
            border-left: none !important;
            padding-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
