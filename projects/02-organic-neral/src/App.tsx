import React, { useState, useEffect, useRef } from 'react';
import { REGRESSION_CASES, EvalCase } from './data';

type ActiveView = 'desktop' | 'mobile' | 'workspace' | 'component';
type CompareMode = 'off' | 'side' | 'overlay';
type CategoryFilter = 'both_accepted' | 'improved' | 'regressed' | 'both_flagged' | null;

function Scaled({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const update = () => setScale(node.clientWidth / width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={ref}
      className="scaled-frame"
      style={{ aspectRatio: `${width}/${height}`, width: '100%' }}
    >
      <div
        className="scaled-content"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const CATEGORY_CASE_SAMPLES: Record<
  Exclude<CategoryFilter, null>,
  {
    code: string;
    pillText: string;
    pillBg: string;
    pillDot: string;
    pillColor: string;
    baselineText: string;
    candidateText: string;
    findingText: string;
  }
> = {
  regressed: {
    code: 'CASE043  ·  Return policy exception',
    pillText: 'One of six regressions',
    pillBg: '#FEF0D2',
    pillDot: '#F5B81C',
    pillColor: '#4A3B1C',
    baselineText: 'Returns within 30 days,\nexcept final-sale items.',
    candidateText: 'Returns within 30 days.',
    findingText: 'Candidate omits the final-sale exception.',
  },
  improved: {
    code: 'CASE019  ·  International VAT exemption',
    pillText: 'One of 18 improved cases',
    pillBg: '#EBF4ED',
    pillDot: '#2E7D4F',
    pillColor: '#1E5636',
    baselineText: 'Standard VAT applies to all European orders.',
    candidateText: 'Reverse-charge VAT exemption applies when a valid EU VAT ID is entered.',
    findingText: 'Candidate accurately cites reverse-charge VAT verification rules.',
  },
  both_accepted: {
    code: 'CASE004  ·  Standard refund processing window',
    pillText: 'One of 90 accepted cases',
    pillBg: '#EFEFEE',
    pillDot: '#8D8F8C',
    pillColor: '#3A3A38',
    baselineText: 'Refunds appear on your original statement within 5–7 business days.',
    candidateText: 'Approved refunds post to the original payment method in 5–7 business days.',
    findingText: 'Both models preserve the exact settlement timeline.',
  },
  both_flagged: {
    code: 'CASE092  ·  Legacy HIPAA BAA amendment',
    pillText: 'One of six flagged cases',
    pillBg: '#EFEFEE',
    pillDot: '#B8B8B4',
    pillColor: '#4A4A46',
    baselineText: 'BAA coverage is automatically enabled on Pro plans.',
    candidateText: 'All workspaces include HIPAA BAA protection by default.',
    findingText: 'Both models omit the required countersigned Enterprise addendum.',
  },
};

/* ==========================================================================
   1. DESKTOP HOMEPAGE STAGE (1536 × 2048) — 1:1 with desktop-homepage.png
   ========================================================================== */
const DesktopStage: React.FC<{
  onOpenWorkspace: (caseId?: string) => void;
  onOpenComponent: () => void;
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
}> = ({ onOpenWorkspace, onOpenComponent, selectedCategory, onSelectCategory }) => {
  const sample = selectedCategory ? CATEGORY_CASE_SAMPLES[selectedCategory] : CATEGORY_CASE_SAMPLES.regressed;

  const scrollToSection = (topPx: number) => {
    window.scrollTo({ top: topPx, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        width: 1536,
        height: 2048,
        backgroundColor: '#F9F9F7',
        position: 'relative',
        color: '#222220',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
      }}
    >
      {/* Top Header */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'absolute',
          left: 72,
          top: 32,
          fontSize: 23.5,
          fontWeight: 400,
          letterSpacing: '0.025em',
          color: '#222220',
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        NERAL
      </div>

      {/* Center Nav */}
      <div
        style={{
          position: 'absolute',
          left: 635,
          top: 37,
          display: 'flex',
          alignItems: 'center',
          gap: 38,
          fontSize: 16.5,
          fontWeight: 400,
          color: '#2A2A28',
          lineHeight: 1,
        }}
      >
        <button onClick={() => scrollToSection(700)} style={{ fontSize: 16.5, color: '#2A2A28' }}>
          Platform
        </button>
        <button onClick={() => scrollToSection(730)} style={{ fontSize: 16.5, color: '#2A2A28' }}>
          Method
        </button>
        <button onClick={() => onOpenComponent()} style={{ fontSize: 16.5, color: '#2A2A28' }}>
          Security
        </button>
      </div>

      {/* Right Sign in + Open workspace */}
      <button
        onClick={() => onOpenWorkspace('043')}
        style={{
          position: 'absolute',
          left: 1209,
          top: 37,
          fontSize: 16.5,
          fontWeight: 400,
          color: '#2A2A28',
          lineHeight: 1,
        }}
      >
        Sign in
      </button>

      <button
        onClick={() => onOpenWorkspace('043')}
        style={{
          position: 'absolute',
          left: 1297,
          top: 23,
          width: 168,
          height: 48,
          backgroundColor: '#232321',
          color: '#FFFFFF',
          borderRadius: 6,
          fontSize: 15.5,
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Open workspace
      </button>

      {/* Hero Left Column */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: 72,
          top: 181,
          fontSize: 13.5,
          fontWeight: 400,
          letterSpacing: '0.135em',
          color: '#4B4B48',
          lineHeight: 1,
        }}
      >
        MODEL EVALUATION, TOGETHER
      </div>

      <h1
        style={{
          position: 'absolute',
          left: 72,
          top: 229,
          fontSize: 70,
          fontWeight: 400,
          lineHeight: 1.13,
          letterSpacing: '-0.032em',
          color: '#1E1E1C',
          margin: 0,
        }}
      >
        Make the next model
        <br />
        decision a clear one.
      </h1>

      <p
        className="font-serif"
        style={{
          position: 'absolute',
          left: 72,
          top: 419,
          fontSize: 27,
          fontWeight: 400,
          lineHeight: 1.48,
          letterSpacing: '-0.005em',
          color: '#282826',
          margin: 0,
        }}
      >
        Design evaluations, compare experiments, and
        <br />
        bring the evidence into one shared review.
      </p>

      <button
        onClick={() => onOpenWorkspace('043')}
        style={{
          position: 'absolute',
          left: 72,
          top: 541,
          width: 295,
          height: 62,
          backgroundColor: '#232321',
          color: '#FFFFFF',
          borderRadius: 6,
          fontSize: 19,
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <span>Explore the workspace</span>
        <span style={{ fontSize: 20, fontWeight: 300 }}>→</span>
      </button>

      <button
        onClick={() => scrollToSection(730)}
        style={{
          position: 'absolute',
          left: 413,
          top: 560,
          fontSize: 19,
          fontWeight: 400,
          color: '#262624',
          borderBottom: '1.5px solid #4A4A46',
          paddingBottom: 3,
          lineHeight: 1.1,
        }}
      >
        See the method
      </button>

      {/* Hero Right Sample Evaluation Card */}
      <div
        onClick={() => onOpenWorkspace('043')}
        title="Click to inspect EV-024 in Workspace"
        style={{
          position: 'absolute',
          left: 840,
          top: 156,
          width: 625,
          height: 504,
          backgroundColor: '#FAF9F7',
          border: '1px solid #DFDFDC',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 35,
            top: 32,
            fontSize: 11.5,
            letterSpacing: '0.11em',
            color: '#50504C',
            lineHeight: 1,
          }}
        >
          SAMPLE EVALUATION
        </div>

        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 54,
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: '-0.015em',
            color: '#1E1E1C',
            lineHeight: 1.15,
          }}
        >
          Support answers
        </div>

        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 35,
            top: 91,
            fontSize: 15,
            color: '#63635E',
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}
        >
          EV-024 · 120 cases
        </div>

        {/* Rule 1 */}
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 138,
            width: 554,
            height: 1,
            backgroundColor: '#E2E2DF',
          }}
        />

        {/* Baseline A */}
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 165,
            fontSize: 21,
            fontWeight: 400,
            color: '#1E1E1C',
            lineHeight: 1,
          }}
        >
          Baseline A
        </div>
        <div
          style={{
            position: 'absolute',
            right: 36,
            top: 167,
            fontSize: 18,
            fontWeight: 400,
            color: '#1E1E1C',
            lineHeight: 1,
          }}
        >
          80%
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 35,
            top: 197,
            fontSize: 14.5,
            color: '#666661',
            lineHeight: 1,
          }}
        >
          96 / 120 accepted
        </div>
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 229,
            width: 554,
            height: 13,
            backgroundColor: '#E8E8E6',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '80.8%',
              height: '100%',
              backgroundColor: '#9E9FA1',
              borderRadius: 6,
            }}
          />
        </div>

        {/* Candidate B */}
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 279,
            fontSize: 21,
            fontWeight: 400,
            color: '#1E1E1C',
            lineHeight: 1,
          }}
        >
          Candidate B
        </div>
        <div
          style={{
            position: 'absolute',
            right: 36,
            top: 281,
            fontSize: 18,
            fontWeight: 400,
            color: '#1E1E1C',
            lineHeight: 1,
          }}
        >
          90%
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 35,
            top: 311,
            fontSize: 14.5,
            color: '#666661',
            lineHeight: 1,
          }}
        >
          108 / 120 accepted
        </div>
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 343,
            width: 554,
            height: 13,
            backgroundColor: '#E8E8E6',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '90%',
              height: '100%',
              backgroundColor: '#8CAF8F',
              borderRadius: 6,
            }}
          />
        </div>

        {/* Rule 2 */}
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 392,
            width: 554,
            height: 1,
            backgroundColor: '#E2E2DF',
          }}
        />

        {/* Card Footer */}
        <div
          style={{
            position: 'absolute',
            left: 35,
            top: 423,
            fontSize: 21,
            fontWeight: 400,
            color: '#23663E',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          +10 percentage points
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 35,
            top: 455,
            fontSize: 14.5,
            color: '#666661',
            lineHeight: 1,
          }}
        >
          6 regressions to inspect
        </div>

        <div
          style={{
            position: 'absolute',
            right: 36,
            top: 424,
            height: 36,
            padding: '0 14px',
            backgroundColor: '#FEF0D2',
            borderRadius: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            fontSize: 14,
            color: '#3D3117',
          }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: '#FCC314',
              display: 'inline-block',
            }}
          />
          <span>Evidence review pending</span>
        </div>
      </div>

      {/* Section Divider Rule at y=729 */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 729,
          width: 1392,
          height: 1,
          backgroundColor: '#DCDCD9',
        }}
      />

      {/* Section 2: Method Narrative */}
      <h2
        style={{
          position: 'absolute',
          left: 72,
          top: 790,
          fontSize: 40,
          fontWeight: 400,
          letterSpacing: '-0.025em',
          color: '#1E1E1C',
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        A score is a starting point.
      </h2>

      <p
        className="font-serif"
        style={{
          position: 'absolute',
          left: 72,
          top: 862,
          fontSize: 22.5,
          lineHeight: 1.54,
          color: '#2B2B29',
          margin: 0,
        }}
      >
        Decide what good means. Compare the
        <br />
        same cases. Leave a decision your team
        <br />
        can trace.
      </p>

      {/* Step 1: Define */}
      <div style={{ position: 'absolute', left: 640, top: 833 }}>
        <div style={{ fontSize: 23, fontWeight: 400, color: '#1E1E1C', marginBottom: 14 }}>
          Define
        </div>
        <div
          className="font-serif"
          style={{ fontSize: 19, lineHeight: 1.4, color: '#333330' }}
        >
          Choose the cases
          <br />
          and criteria
        </div>
      </div>

      {/* Arrow 1 */}
      <svg
        width="44"
        height="18"
        viewBox="0 0 44 18"
        style={{ position: 'absolute', left: 848, top: 866 }}
      >
        <line x1="0" y1="9" x2="41" y2="9" stroke="#B5B5B0" strokeWidth="1.3" />
        <polyline
          points="34,2 42,9 34,16"
          fill="none"
          stroke="#B5B5B0"
          strokeWidth="1.3"
        />
      </svg>

      {/* Step 2: Compare */}
      <div style={{ position: 'absolute', left: 948, top: 833 }}>
        <div style={{ fontSize: 23, fontWeight: 400, color: '#1E1E1C', marginBottom: 14 }}>
          Compare
        </div>
        <div
          className="font-serif"
          style={{ fontSize: 19, lineHeight: 1.4, color: '#333330' }}
        >
          Inspect gains and
          <br />
          regressions
        </div>
      </div>

      {/* Arrow 2 */}
      <svg
        width="44"
        height="18"
        viewBox="0 0 44 18"
        style={{ position: 'absolute', left: 1173, top: 866 }}
      >
        <line x1="0" y1="9" x2="41" y2="9" stroke="#B5B5B0" strokeWidth="1.3" />
        <polyline
          points="34,2 42,9 34,16"
          fill="none"
          stroke="#B5B5B0"
          strokeWidth="1.3"
        />
      </svg>

      {/* Step 3: Review */}
      <div style={{ position: 'absolute', left: 1273, top: 833 }}>
        <div style={{ fontSize: 23, fontWeight: 400, color: '#1E1E1C', marginBottom: 14 }}>
          Review
        </div>
        <div
          className="font-serif"
          style={{ fontSize: 19, lineHeight: 1.4, color: '#333330' }}
        >
          Approve the evidence
          <br />
          together
        </div>
      </div>

      {/* Section 3: Evidence Keeps the Exceptions Visible */}
      <h2
        style={{
          position: 'absolute',
          left: 70,
          top: 1110,
          fontSize: 55,
          fontWeight: 400,
          lineHeight: 1.07,
          letterSpacing: '-0.03em',
          color: '#1E1E1C',
          margin: 0,
        }}
      >
        Evidence keeps the
        <br />
        exceptions visible.
      </h2>

      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: 1206,
          top: 1123,
          fontSize: 13.5,
          letterSpacing: '0.11em',
          color: '#3A3A38',
          lineHeight: 1.85,
        }}
      >
        <div>SAMPLE EVALUATION · EV-024</div>
        <div style={{ letterSpacing: '0.03em', color: '#585854', fontSize: 15 }}>
          120 paired cases
        </div>
      </div>

      <p
        className="font-serif"
        style={{
          position: 'absolute',
          left: 72,
          top: 1244,
          fontSize: 26,
          fontWeight: 400,
          color: '#262624',
          margin: 0,
        }}
      >
        Compare paired cases before deciding what moves forward.
      </p>

      {/* 4-Segment Stacked Bar (x: 72..1465, y: 1313..1358) */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 1313,
          width: 1393,
          height: 45,
          borderRadius: 6,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1037px 207px 72px 74px',
          columnGap: '1px',
          backgroundColor: '#F9F9F7',
        }}
      >
        <button
          onClick={() =>
            onSelectCategory(selectedCategory === 'both_accepted' ? null : 'both_accepted')
          }
          title="Both accepted: 90 cases (75%)"
          style={{
            backgroundColor: '#9E9FA0',
            height: '100%',
            opacity: selectedCategory && selectedCategory !== 'both_accepted' ? 0.45 : 1,
          }}
        />
        <button
          onClick={() =>
            onSelectCategory(selectedCategory === 'improved' ? null : 'improved')
          }
          title="Improved: 18 cases (15%)"
          style={{
            backgroundColor: '#96BB99',
            height: '100%',
            opacity: selectedCategory && selectedCategory !== 'improved' ? 0.45 : 1,
          }}
        />
        <button
          onClick={() =>
            onSelectCategory(selectedCategory === 'regressed' ? null : 'regressed')
          }
          title="Regressed: 6 cases (5%)"
          style={{
            backgroundColor: '#FECB58',
            height: '100%',
            opacity: selectedCategory && selectedCategory !== 'regressed' ? 0.45 : 1,
          }}
        />
        <button
          onClick={() =>
            onSelectCategory(selectedCategory === 'both_flagged' ? null : 'both_flagged')
          }
          title="Both flagged: 6 cases (5%)"
          style={{
            backgroundColor: '#DFDEDE',
            height: '100%',
            opacity: selectedCategory && selectedCategory !== 'both_flagged' ? 0.45 : 1,
          }}
        />
      </div>

      {/* Legend Row below Stacked Bar */}
      {[
        {
          id: 'both_accepted' as const,
          left: 72,
          dot: '#9E9FA0',
          label: 'Both accepted',
          count: '90',
        },
        {
          id: 'improved' as const,
          left: 452,
          dot: '#96BB99',
          label: 'Improved',
          count: '18',
        },
        {
          id: 'regressed' as const,
          left: 829,
          dot: '#FECB58',
          label: 'Regressed',
          count: '6',
        },
        {
          id: 'both_flagged' as const,
          left: 1185,
          dot: '#DFDEDE',
          label: 'Both flagged',
          count: '6',
        },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() =>
            onSelectCategory(selectedCategory === item.id ? null : item.id)
          }
          style={{
            position: 'absolute',
            left: item.left,
            top: 1383,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            opacity: selectedCategory && selectedCategory !== item.id ? 0.45 : 1,
          }}
        >
          <span
            style={{
              width: 23,
              height: 23,
              borderRadius: '50%',
              backgroundColor: item.dot,
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 19, fontWeight: 400, color: '#1E1E1C' }}>
            {item.label}
          </span>
          <span
            className="font-mono"
            style={{ fontSize: 16.5, color: '#585854', marginLeft: 10 }}
          >
            {item.count}
          </span>
        </button>
      ))}

      {/* Outlier-Detail Card (x: 72..1464, y: 1455..1626) */}
      <div
        onClick={() => onOpenWorkspace('043')}
        title="Click to open Case 043 in full evaluation workspace"
        style={{
          position: 'absolute',
          left: 72,
          top: 1455,
          width: 1392,
          height: 171,
          backgroundColor: '#FAF9F8',
          border: '1px solid #E1E1DE',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        {/* Col 1 */}
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 38,
            top: 44,
            fontSize: 15,
            color: '#3A3A38',
            letterSpacing: '0.01em',
          }}
        >
          {sample.code}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 76,
            height: 36,
            padding: '0 14px',
            backgroundColor: sample.pillBg,
            borderRadius: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 14.5,
            color: sample.pillColor,
          }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: sample.pillDot,
              display: 'inline-block',
            }}
          />
          <span>{sample.pillText}</span>
        </div>

        {/* Vertical divider 1 at x=504 (relative left: 432) */}
        <div
          style={{
            position: 'absolute',
            left: 432,
            top: 26,
            width: 1,
            height: 119,
            backgroundColor: '#E3E3E0',
          }}
        />

        {/* Col 2 */}
        <div
          style={{
            position: 'absolute',
            left: 479,
            top: 39,
            fontSize: 17,
            fontWeight: 500,
            color: '#1E1E1C',
          }}
        >
          Baseline A
        </div>
        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 479,
            top: 72,
            fontSize: 20,
            lineHeight: 1.4,
            color: '#2B2B29',
            whiteSpace: 'pre-line',
            maxWidth: 380,
          }}
        >
          {sample.baselineText}
        </div>

        {/* Vertical divider 2 at x=956 (relative left: 884) */}
        <div
          style={{
            position: 'absolute',
            left: 884,
            top: 26,
            width: 1,
            height: 119,
            backgroundColor: '#E3E3E0',
          }}
        />

        {/* Col 3 */}
        <div
          style={{
            position: 'absolute',
            left: 931,
            top: 39,
            fontSize: 17,
            fontWeight: 500,
            color: '#1E1E1C',
          }}
        >
          Candidate B
        </div>
        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 931,
            top: 72,
            fontSize: 20,
            lineHeight: 1.4,
            color: '#2B2B29',
          }}
        >
          {sample.candidateText}
        </div>
        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 931,
            top: 118,
            fontSize: 16,
            color: '#6E6E69',
          }}
        >
          {sample.findingText}
        </div>
      </div>

      {/* Section 4: Pale Warm-Gray Invitation Band (y: 1670..1836) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 1670,
          width: 1536,
          height: 166,
          backgroundColor: '#F1F0EF',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 42,
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            color: '#1E1E1C',
          }}
        >
          Bring your next evaluation
          <br />
          into focus.
        </div>

        {/* Vertical hairline at x=646 */}
        <div
          style={{
            position: 'absolute',
            left: 646,
            top: 42,
            width: 1,
            height: 84,
            backgroundColor: '#DCDCD9',
          }}
        />

        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 706,
            top: 72,
            fontSize: 25,
            color: '#2B2B29',
          }}
        >
          Start with a dataset and a question.
        </div>

        <button
          onClick={() => onOpenWorkspace('043')}
          style={{
            position: 'absolute',
            left: 1226,
            top: 54,
            width: 239,
            height: 58,
            backgroundColor: '#232321',
            color: '#FFFFFF',
            borderRadius: 6,
            fontSize: 17,
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <span>Create a workspace</span>
          <span style={{ fontSize: 18, fontWeight: 300 }}>→</span>
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 1868,
          width: 1392,
          height: 1,
          backgroundColor: '#DCDCD9',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 1891,
          fontSize: 22.5,
          fontWeight: 400,
          letterSpacing: '0.02em',
          color: '#1E1E1C',
        }}
      >
        NERAL
      </div>
      <div
        className="font-serif"
        style={{
          position: 'absolute',
          left: 72,
          top: 1922,
          fontSize: 18,
          color: '#454542',
        }}
      >
        Evidence, shared.
      </div>

      <button
        onClick={() => onOpenComponent()}
        style={{
          position: 'absolute',
          right: 72,
          top: 1904,
          fontSize: 17,
          fontWeight: 400,
          color: '#1E1E1C',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>Contact the team</span>
        <span>→</span>
      </button>

      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 1965,
          width: 1392,
          height: 1,
          backgroundColor: '#E2E2DF',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 1988,
          display: 'flex',
          alignItems: 'center',
          gap: 44,
          fontSize: 14.5,
          color: '#4A4A46',
        }}
      >
        <button onClick={() => onOpenWorkspace('043')} style={{ fontSize: 14.5, color: '#4A4A46' }}>
          Documentation
        </button>
        <button onClick={() => onOpenComponent()} style={{ fontSize: 14.5, color: '#4A4A46' }}>
          Privacy
        </button>
        <button onClick={() => onOpenComponent()} style={{ fontSize: 14.5, color: '#4A4A46' }}>
          Security
        </button>
        <button onClick={() => onOpenWorkspace('043')} style={{ fontSize: 14.5, color: '#4A4A46' }}>
          Status
        </button>
      </div>

      <div
        className="font-mono"
        style={{
          position: 'absolute',
          right: 72,
          top: 1989,
          fontSize: 14,
          letterSpacing: '0.04em',
          color: '#5A5A55',
        }}
      >
        ©2026 NERAL
      </div>
    </div>
  );
};

/* ==========================================================================
   2. MOBILE HOMEPAGE STAGE (821 × 3831) — 1:1 with mobile-homepage.png
   ========================================================================== */
const MobileStage: React.FC<{
  onOpenWorkspace: (caseId?: string) => void;
  onOpenComponent: () => void;
}> = ({ onOpenWorkspace, onOpenComponent }) => {
  return (
    <div
      style={{
        width: 821,
        height: 3831,
        backgroundColor: '#F9FAF7',
        position: 'relative',
        color: '#222220',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          position: 'absolute',
          left: 65,
          top: 30,
          fontSize: 32,
          fontWeight: 400,
          letterSpacing: '0.02em',
          color: '#1E1E1C',
          lineHeight: 1,
        }}
      >
        NERAL
      </div>

      <button
        onClick={() => onOpenWorkspace('043')}
        style={{
          position: 'absolute',
          right: 65,
          top: 29,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 24,
          color: '#1E1E1C',
        }}
      >
        <span>Menu</span>
        <svg width="34" height="24" viewBox="0 0 34 24">
          <line x1="0" y1="2" x2="34" y2="2" stroke="#1E1E1C" strokeWidth="2.5" />
          <line x1="0" y1="12" x2="34" y2="12" stroke="#1E1E1C" strokeWidth="2.5" />
          <line x1="0" y1="22" x2="34" y2="22" stroke="#1E1E1C" strokeWidth="2.5" />
        </svg>
      </button>

      {/* Hero Section */}
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: 66,
          top: 124,
          fontSize: 21,
          letterSpacing: '0.135em',
          color: '#4B4B48',
          lineHeight: 1,
        }}
      >
        MODEL EVALUATION, TOGETHER
      </div>

      <h1
        style={{
          position: 'absolute',
          left: 65,
          top: 173,
          fontSize: 72,
          fontWeight: 400,
          lineHeight: 1.09,
          letterSpacing: '-0.03em',
          color: '#1E1E1C',
          margin: 0,
        }}
      >
        Make the next model
        <br />
        decision a clear one.
      </h1>

      <p
        className="font-serif"
        style={{
          position: 'absolute',
          left: 66,
          top: 354,
          fontSize: 34,
          lineHeight: 1.4,
          color: '#262624',
          margin: 0,
        }}
      >
        Design evaluations, compare experiments,
        <br />
        and bring the evidence into one shared
        <br />
        review.
      </p>

      <button
        onClick={() => onOpenWorkspace('043')}
        style={{
          position: 'absolute',
          left: 66,
          top: 533,
          width: 689,
          height: 82,
          backgroundColor: '#232321',
          color: '#FFFFFF',
          borderRadius: 8,
          fontSize: 27,
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <span>Explore the workspace</span>
        <span style={{ fontSize: 28, fontWeight: 300 }}>→</span>
      </button>

      <button
        onClick={() => onOpenComponent()}
        style={{
          position: 'absolute',
          left: 66,
          top: 646,
          fontSize: 28,
          fontWeight: 400,
          color: '#222220',
          borderBottom: '2px solid #3A3A38',
          paddingBottom: 3,
          lineHeight: 1.1,
        }}
      >
        See the method
      </button>

      {/* Sample Evaluation Card (y: 734..1382) */}
      <div
        onClick={() => onOpenWorkspace('043')}
        style={{
          position: 'absolute',
          left: 66,
          top: 734,
          width: 689,
          height: 648,
          backgroundColor: '#FAF9F7',
          border: '1.5px solid #DFDFDC',
          borderRadius: 10,
          cursor: 'pointer',
        }}
      >
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 39,
            top: 38,
            fontSize: 18,
            letterSpacing: '0.12em',
            color: '#4B4B48',
          }}
        >
          SAMPLE EVALUATION
        </div>

        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 68,
            fontSize: 38,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#1E1E1C',
          }}
        >
          Support answers
        </div>

        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 39,
            top: 120,
            fontSize: 22,
            color: '#63635E',
          }}
        >
          EV-024 · 120 cases
        </div>

        {/* Rule 1 */}
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 181,
            width: 612,
            height: 1.5,
            backgroundColor: '#E2E2DF',
          }}
        />

        {/* Baseline A */}
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 214,
            fontSize: 29,
            fontWeight: 400,
            color: '#1E1E1C',
          }}
        >
          Baseline A
        </div>
        <div
          style={{
            position: 'absolute',
            right: 38,
            top: 215,
            fontSize: 26,
            fontWeight: 400,
            color: '#1E1E1C',
          }}
        >
          80%
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 39,
            top: 256,
            fontSize: 21,
            color: '#666661',
          }}
        >
          96 / 120 accepted
        </div>
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 300,
            width: 612,
            height: 21,
            backgroundColor: '#E8E8E6',
            borderRadius: 9,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '80.8%',
              height: '100%',
              backgroundColor: '#97989A',
              borderRadius: 9,
            }}
          />
        </div>

        {/* Candidate B */}
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 370,
            fontSize: 29,
            fontWeight: 400,
            color: '#1E1E1C',
          }}
        >
          Candidate B
        </div>
        <div
          style={{
            position: 'absolute',
            right: 38,
            top: 371,
            fontSize: 26,
            fontWeight: 400,
            color: '#1E1E1C',
          }}
        >
          90%
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 39,
            top: 412,
            fontSize: 21,
            color: '#666661',
          }}
        >
          108 / 120 accepted
        </div>
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 455,
            width: 612,
            height: 21,
            backgroundColor: '#E8E8E6',
            borderRadius: 9,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '89%',
              height: '100%',
              backgroundColor: '#86AC8A',
              borderRadius: 9,
            }}
          />
        </div>

        {/* Rule 2 */}
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 519,
            width: 612,
            height: 1.5,
            backgroundColor: '#E2E2DF',
          }}
        />

        {/* Card Bottom */}
        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 552,
            fontSize: 29,
            fontWeight: 400,
            color: '#23663E',
          }}
        >
          +10 percentage points
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 39,
            top: 593,
            fontSize: 21,
            color: '#666661',
          }}
        >
          6 regressions to inspect
        </div>

        <div
          style={{
            position: 'absolute',
            right: 38,
            top: 555,
            height: 52,
            padding: '0 18px',
            backgroundColor: '#FEF0D2',
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            fontSize: 20,
            color: '#3D3117',
          }}
        >
          <span
            style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              backgroundColor: '#F5B81C',
              display: 'inline-block',
            }}
          />
          <span>Evidence review pending</span>
        </div>
      </div>

      {/* Horizontal Rule at y=1432 */}
      <div
        style={{
          position: 'absolute',
          left: 66,
          top: 1432,
          width: 689,
          height: 1.5,
          backgroundColor: '#D6D6D2',
        }}
      />

      {/* Section 2: A score is a starting point */}
      <h2
        style={{
          position: 'absolute',
          left: 66,
          top: 1476,
          fontSize: 53,
          fontWeight: 400,
          letterSpacing: '-0.025em',
          color: '#1E1E1C',
          margin: 0,
        }}
      >
        A score is a starting point.
      </h2>

      <p
        className="font-serif"
        style={{
          position: 'absolute',
          left: 66,
          top: 1550,
          fontSize: 31,
          lineHeight: 1.38,
          color: '#2B2B29',
          margin: 0,
        }}
      >
        Decide what good means. Compare the same
        <br />
        cases. Leave a decision your team can trace.
      </p>

      {/* Stacked Define / Compare / Review */}
      <div style={{ position: 'absolute', left: 66, top: 1656 }}>
        <div style={{ fontSize: 30, fontWeight: 400, color: '#1E1E1C', marginBottom: 4 }}>
          Define
        </div>
        <div className="font-serif" style={{ fontSize: 26, color: '#333330' }}>
          Choose the cases and criteria
        </div>
      </div>

      <div style={{ position: 'absolute', left: 66, top: 1744 }}>
        <div style={{ fontSize: 30, fontWeight: 400, color: '#1E1E1C', marginBottom: 4 }}>
          Compare
        </div>
        <div className="font-serif" style={{ fontSize: 26, color: '#333330' }}>
          Inspect gains and regressions
        </div>
      </div>

      <div style={{ position: 'absolute', left: 66, top: 1830 }}>
        <div style={{ fontSize: 30, fontWeight: 400, color: '#1E1E1C', marginBottom: 4 }}>
          Review
        </div>
        <div className="font-serif" style={{ fontSize: 26, color: '#333330' }}>
          Approve the evidence together
        </div>
      </div>

      {/* Section 3: Evidence keeps the exceptions visible */}
      <h2
        style={{
          position: 'absolute',
          left: 65,
          top: 1995,
          fontSize: 59,
          fontWeight: 400,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: '#1E1E1C',
          margin: 0,
        }}
      >
        Evidence keeps the
        <br />
        exceptions visible.
      </h2>

      <p
        className="font-serif"
        style={{
          position: 'absolute',
          left: 65,
          top: 2142,
          fontSize: 34,
          lineHeight: 1.35,
          color: '#262624',
          margin: 0,
        }}
      >
        Compare paired cases before deciding
        <br />
        what moves forward.
      </p>

      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: 65,
          top: 2266,
          fontSize: 20,
          letterSpacing: '0.11em',
          color: '#222220',
          fontWeight: 500,
        }}
      >
        SAMPLE EVALUATION · EV-024
      </div>
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: 65,
          top: 2299,
          fontSize: 22,
          color: '#5A5E66',
        }}
      >
        120 paired cases
      </div>

      {/* 2x2 Categorical Counts Grid */}
      {/* Top Left: Both accepted 90 */}
      <div style={{ position: 'absolute', left: 65, top: 2370 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#97989A',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 28, color: '#1E1E1C' }}>Both accepted</span>
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 23, color: '#5A5E66', marginLeft: 56, marginTop: 8 }}
        >
          90
        </div>
      </div>

      {/* Top Right: Improved 18 */}
      <div style={{ position: 'absolute', left: 462, top: 2370 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#86AC8A',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 28, color: '#1E1E1C' }}>Improved</span>
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 23, color: '#5A5E66', marginLeft: 56, marginTop: 8 }}
        >
          18
        </div>
      </div>

      {/* Middle Rule between 2x2 rows */}
      <div
        style={{
          position: 'absolute',
          left: 65,
          top: 2464,
          width: 690,
          height: 1.5,
          backgroundColor: '#E5E5E2',
        }}
      />

      {/* Bottom Left: Regressed 6 */}
      <div style={{ position: 'absolute', left: 65, top: 2493 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#FCC537',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 28, color: '#1E1E1C' }}>Regressed</span>
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 23, color: '#5A5E66', marginLeft: 56, marginTop: 8 }}
        >
          6
        </div>
      </div>

      {/* Bottom Right: Both flagged 6 */}
      <div style={{ position: 'absolute', left: 462, top: 2493 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#DCDCD9',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 28, color: '#1E1E1C' }}>Both flagged</span>
        </div>
        <div
          className="font-mono"
          style={{ fontSize: 23, color: '#5A5E66', marginLeft: 56, marginTop: 8 }}
        >
          6
        </div>
      </div>

      {/* Mobile Outlier Card (y: 2637..3145) */}
      <div
        onClick={() => onOpenWorkspace('043')}
        style={{
          position: 'absolute',
          left: 65,
          top: 2637,
          width: 691,
          height: 508,
          backgroundColor: '#FAF9F8',
          border: '1.5px solid #DFDFDC',
          borderRadius: 10,
          cursor: 'pointer',
        }}
      >
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 39,
            top: 36,
            fontSize: 23,
            color: '#4B505B',
          }}
        >
          CASE043 · Return policy exception
        </div>

        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 76,
            height: 50,
            padding: '0 18px',
            backgroundColor: '#FEF0D2',
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 22,
            color: '#3D3117',
          }}
        >
          <span
            style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              backgroundColor: '#F5B81C',
              display: 'inline-block',
            }}
          />
          <span className="font-mono" style={{ fontSize: 21 }}>
            One of six regressions
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 158,
            fontSize: 31,
            fontWeight: 400,
            color: '#1E1E1C',
          }}
        >
          Baseline A
        </div>

        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 39,
            top: 205,
            fontSize: 29,
            lineHeight: 1.36,
            color: '#2B2B29',
          }}
        >
          Returns within 30 days,
          <br />
          except final-sale items.
        </div>

        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 313,
            width: 613,
            height: 1.5,
            backgroundColor: '#E3E3E0',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 39,
            top: 344,
            fontSize: 31,
            fontWeight: 400,
            color: '#1E1E1C',
          }}
        >
          Candidate B
        </div>

        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 39,
            top: 392,
            fontSize: 29,
            lineHeight: 1.36,
            color: '#2B2B29',
          }}
        >
          Returns within 30 days.
        </div>

        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 39,
            top: 446,
            fontSize: 24,
            color: '#5A5E66',
          }}
        >
          Candidate omits the final-sale exception.
        </div>
      </div>

      {/* Mobile Invitation Rounded Band (x: 26..795, y: 3185..3475) */}
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 3185,
          width: 769,
          height: 292,
          backgroundColor: '#F5F4F3',
          borderRadius: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 26,
            fontSize: 52,
            fontWeight: 400,
            lineHeight: 1.07,
            letterSpacing: '-0.025em',
            color: '#1E1E1C',
          }}
        >
          Bring your next evaluation
          <br />
          into focus.
        </div>

        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 40,
            top: 147,
            fontSize: 31,
            color: '#2B2B29',
          }}
        >
          Start with a dataset and a question.
        </div>

        <button
          onClick={() => onOpenWorkspace('043')}
          style={{
            position: 'absolute',
            left: 40,
            top: 204,
            width: 690,
            height: 72,
            backgroundColor: '#232321',
            color: '#FFFFFF',
            borderRadius: 8,
            fontSize: 25,
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <span>Create a workspace</span>
          <span style={{ fontSize: 26, fontWeight: 300 }}>→</span>
        </button>
      </div>

      {/* Mobile Footer */}
      <div
        style={{
          position: 'absolute',
          left: 65,
          top: 3518,
          width: 691,
          height: 1.5,
          backgroundColor: '#C5C5C1',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 66,
          top: 3543,
          fontSize: 29,
          fontWeight: 400,
          letterSpacing: '0.02em',
          color: '#1E1E1C',
        }}
      >
        NERAL
      </div>

      <div
        className="font-serif"
        style={{
          position: 'absolute',
          left: 66,
          top: 3580,
          fontSize: 25,
          color: '#3A3A38',
        }}
      >
        Evidence, shared.
      </div>

      <button
        onClick={() => onOpenComponent()}
        style={{
          position: 'absolute',
          left: 66,
          top: 3625,
          fontSize: 24,
          color: '#1E1E1C',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <span>Contact the team</span>
        <span>→</span>
      </button>

      <div
        style={{
          position: 'absolute',
          left: 65,
          top: 3676,
          width: 691,
          height: 1.5,
          backgroundColor: '#D6D6D2',
        }}
      />

      {/* Footer 2x2 links */}
      <button
        onClick={() => onOpenWorkspace('043')}
        className="font-serif"
        style={{
          position: 'absolute',
          left: 66,
          top: 3698,
          fontSize: 23,
          color: '#3A3A38',
        }}
      >
        Documentation
      </button>
      <button
        onClick={() => onOpenComponent()}
        className="font-serif"
        style={{
          position: 'absolute',
          left: 425,
          top: 3698,
          fontSize: 23,
          color: '#3A3A38',
        }}
      >
        Privacy
      </button>
      <button
        onClick={() => onOpenComponent()}
        className="font-serif"
        style={{
          position: 'absolute',
          left: 66,
          top: 3735,
          fontSize: 23,
          color: '#3A3A38',
        }}
      >
        Security
      </button>
      <button
        onClick={() => onOpenWorkspace('043')}
        className="font-serif"
        style={{
          position: 'absolute',
          left: 425,
          top: 3735,
          fontSize: 23,
          color: '#3A3A38',
        }}
      >
        Status
      </button>

      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: 65,
          top: 3783,
          fontSize: 19,
          letterSpacing: '0.06em',
          color: '#4B505B',
        }}
      >
        ©2026 NERAL
      </div>
    </div>
  );
};

/* ==========================================================================
   3. WORKSPACE WEB APP STAGE (1536 × 1024) — 1:1 with app.png
   ========================================================================== */
const WorkspaceStage: React.FC<{
  selectedCaseId: string;
  onSelectCaseId: (id: string) => void;
  isSigned: boolean;
  onToggleSign: () => void;
  onBackHome: () => void;
  onOpenComponent: () => void;
}> = ({
  selectedCaseId,
  onSelectCaseId,
  isSigned,
  onToggleSign,
  onBackHome,
  onOpenComponent,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'Overview' | 'Cases' | 'Decision'>('Cases');
  const [exportToast, setExportToast] = useState(false);

  const activeCase: EvalCase =
    REGRESSION_CASES.find((c) => c.id === selectedCaseId) || REGRESSION_CASES[0];

  const handlePrev = () => {
    const idx = REGRESSION_CASES.findIndex((c) => c.id === selectedCaseId);
    const prev = (idx - 1 + REGRESSION_CASES.length) % REGRESSION_CASES.length;
    onSelectCaseId(REGRESSION_CASES[prev].id);
  };

  const handleNext = () => {
    const idx = REGRESSION_CASES.findIndex((c) => c.id === selectedCaseId);
    const next = (idx + 1) % REGRESSION_CASES.length;
    onSelectCaseId(REGRESSION_CASES[next].id);
  };

  return (
    <div
      style={{
        width: 1536,
        height: 1024,
        backgroundColor: '#FCFCFB',
        position: 'relative',
        color: '#1E1E1C',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
      }}
    >
      {/* Top Navbar (height 76px) */}
      <button
        onClick={onBackHome}
        title="Return to NERAL Homepage"
        style={{
          position: 'absolute',
          left: 60,
          top: 26,
          fontSize: 23,
          fontWeight: 400,
          letterSpacing: '0.025em',
          color: '#1E1E1C',
          lineHeight: 1,
        }}
      >
        NERAL
      </button>

      {/* Vertical divider in navbar */}
      <div
        style={{
          position: 'absolute',
          left: 169,
          top: 24,
          width: 1,
          height: 28,
          backgroundColor: '#E2E4E8',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 202,
          top: 29,
          fontSize: 16.5,
          color: '#383A40',
          lineHeight: 1,
        }}
      >
        Support lab
      </div>

      {/* Nav links */}
      <button
        style={{
          position: 'absolute',
          left: 408,
          top: 29,
          fontSize: 16.5,
          fontWeight: 500,
          color: '#1E1E1C',
          lineHeight: 1,
        }}
      >
        Evaluations
      </button>
      <div
        style={{
          position: 'absolute',
          left: 407,
          top: 73,
          width: 88,
          height: 2.5,
          backgroundColor: '#1E1E1C',
        }}
      />

      <button
        onClick={() => setActiveSubTab('Overview')}
        style={{
          position: 'absolute',
          left: 540,
          top: 29,
          fontSize: 16.5,
          color: '#4B4E54',
          lineHeight: 1,
        }}
      >
        Datasets
      </button>

      <button
        onClick={onOpenComponent}
        style={{
          position: 'absolute',
          left: 652,
          top: 29,
          fontSize: 16.5,
          color: '#4B4E54',
          lineHeight: 1,
        }}
      >
        Review queue
      </button>

      {/* Right Avatar MS */}
      <button
        onClick={onOpenComponent}
        title="Mina Shah — Open Evidence Sign-Off Modal"
        style={{
          position: 'absolute',
          left: 1435,
          top: 19,
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#EFF0F1',
          color: '#2B2D32',
          fontSize: 14,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        MS
      </button>

      {/* Navbar Bottom Border */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 76,
          width: 1536,
          height: 1,
          backgroundColor: '#EAEBED',
        }}
      />

      {/* Title Row */}
      <h1
        style={{
          position: 'absolute',
          left: 60,
          top: 112,
          fontSize: 45,
          fontWeight: 400,
          letterSpacing: '-0.024em',
          color: '#18181A',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Support answers
      </h1>

      {/* Evidence review pending pill */}
      <div
        style={{
          position: 'absolute',
          left: 448,
          top: 129,
          height: 36,
          padding: '0 14px',
          backgroundColor: isSigned ? '#EBF4ED' : '#FEF3D6',
          borderRadius: 6,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          fontSize: 14.5,
          color: isSigned ? '#1E6B43' : '#3D3117',
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: '50%',
            backgroundColor: isSigned ? '#1E6B43' : '#F3B61F',
            display: 'inline-block',
          }}
        />
        <span>{isSigned ? 'Evidence approved' : 'Evidence review pending'}</span>
      </div>

      <div
        className="font-mono"
        style={{
          position: 'absolute',
          left: 60,
          top: 168,
          fontSize: 16.5,
          color: '#676A72',
          letterSpacing: '0.01em',
          lineHeight: 1,
        }}
      >
        EV-024 · 120 cases
      </div>

      {/* Export evidence button */}
      <button
        onClick={() => {
          setExportToast(true);
          setTimeout(() => setExportToast(false), 2400);
        }}
        style={{
          position: 'absolute',
          left: 1298,
          top: 129,
          width: 178,
          height: 44,
          backgroundColor: '#222428',
          color: '#FFFFFF',
          borderRadius: 6,
          fontSize: 15,
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <span>{exportToast ? 'Exported EV-024 ✓' : 'Export evidence'}</span>
        {!exportToast && <span style={{ fontSize: 16 }}>→</span>}
      </button>

      {/* Summary Strip Card (x: 60..1476, y: 212..296) */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 212,
          width: 1416,
          height: 85,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E6E9',
          borderRadius: 6,
        }}
      >
        {/* Col 1: Baseline A */}
        <div
          style={{
            position: 'absolute',
            left: 23,
            top: 26,
            fontSize: 17,
            color: '#1E1E1C',
          }}
        >
          Baseline A
        </div>
        <div
          style={{
            position: 'absolute',
            left: 152,
            top: 25,
            fontSize: 18,
            fontWeight: 600,
            color: '#18181A',
          }}
        >
          80%
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 199,
            top: 27,
            fontSize: 15.5,
            color: '#63666E',
          }}
        >
          (96 / 120)
        </div>
        <div
          style={{
            position: 'absolute',
            left: 152,
            top: 52,
            width: 318,
            height: 10,
            backgroundColor: '#E9EAE8',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '80.5%',
              height: '100%',
              backgroundColor: '#6EA37B',
              borderRadius: 5,
            }}
          />
        </div>

        {/* Divider 1 at x=562 (relative 502) */}
        <div
          style={{
            position: 'absolute',
            left: 502,
            top: 18,
            width: 1,
            height: 49,
            backgroundColor: '#EAECEF',
          }}
        />

        {/* Col 2: Candidate B */}
        <div
          style={{
            position: 'absolute',
            left: 534,
            top: 26,
            fontSize: 17,
            color: '#1E1E1C',
          }}
        >
          Candidate B
        </div>
        <div
          style={{
            position: 'absolute',
            left: 668,
            top: 25,
            fontSize: 18,
            fontWeight: 600,
            color: '#18181A',
          }}
        >
          90%
        </div>
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            left: 714,
            top: 27,
            fontSize: 15.5,
            color: '#63666E',
          }}
        >
          (108 / 120)
        </div>
        <div
          style={{
            position: 'absolute',
            left: 668,
            top: 52,
            width: 290,
            height: 10,
            backgroundColor: '#E9EAE8',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '90%',
              height: '100%',
              backgroundColor: '#6EA37B',
              borderRadius: 5,
            }}
          />
        </div>

        {/* Divider 2 at x=1041 (relative 981) */}
        <div
          style={{
            position: 'absolute',
            left: 981,
            top: 18,
            width: 1,
            height: 49,
            backgroundColor: '#EAECEF',
          }}
        />

        {/* Col 3: +10 percentage points */}
        <div
          style={{
            position: 'absolute',
            left: 1016,
            top: 31,
            fontSize: 19,
            fontWeight: 400,
            color: '#0D6838',
          }}
        >
          +10 percentage points
        </div>

        {/* Divider 3 at x=1306 (relative 1246) */}
        <div
          style={{
            position: 'absolute',
            left: 1246,
            top: 18,
            width: 1,
            height: 49,
            backgroundColor: '#EAECEF',
          }}
        />

        {/* Col 4: 6 regressions */}
        <div
          style={{
            position: 'absolute',
            left: 1280,
            top: 31,
            fontSize: 18,
            fontWeight: 400,
            color: '#1E1E1C',
          }}
        >
          6 regressions
        </div>
      </div>

      {/* Sub-navigation Tabs: Overview, Cases, Decision */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 332,
          display: 'flex',
          alignItems: 'center',
          gap: 50,
          fontSize: 17,
        }}
      >
        {(['Overview', 'Cases', 'Decision'] as const).map((tab) => {
          const active = activeSubTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'Decision') {
                  onOpenComponent();
                } else {
                  setActiveSubTab(tab);
                }
              }}
              style={{
                fontSize: 17,
                fontWeight: active ? 500 : 400,
                color: active ? '#18181A' : '#4E5158',
                paddingBottom: 14,
                borderBottom: active ? '2.5px solid #18181A' : '2.5px solid transparent',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Full-width Tab Rule at y=368 */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 368,
          width: 1416,
          height: 1,
          backgroundColor: '#E4E6E9',
        }}
      />

      {/* Left Main Card: Case Comparison (x: 61..1071, y: 395..998) */}
      <div
        style={{
          position: 'absolute',
          left: 61,
          top: 395,
          width: 1010,
          height: 603,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E6E9',
          borderRadius: 6,
        }}
      >
        {activeSubTab === 'Overview' ? (
          <div style={{ padding: '28px 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div className="font-mono" style={{ fontSize: 13, color: '#63666E', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  EVALUATION SUMMARY · EV-024
                </div>
                <h2 style={{ fontSize: 30, fontWeight: 400, letterSpacing: '-0.02em', color: '#18181A', margin: '6px 0 0 0' }}>
                  120 paired support cases
                </h2>
              </div>
              <button
                onClick={() => setActiveSubTab('Cases')}
                style={{
                  height: 40,
                  padding: '0 18px',
                  backgroundColor: '#25272C',
                  color: '#FFFFFF',
                  borderRadius: 6,
                  fontSize: 14.5,
                }}
              >
                Inspect 6 regressions →
              </button>
            </div>

            {/* 4-segment stacked distribution bar */}
            <div style={{ display: 'flex', height: 34, borderRadius: 6, overflow: 'hidden', gap: 2, marginBottom: 18 }}>
              <div style={{ width: '75%', backgroundColor: '#91949A' }} title="Both accepted: 90" />
              <div style={{ width: '15%', backgroundColor: '#7EA885' }} title="Improved: 18" />
              <div style={{ width: '5%', backgroundColor: '#F3B61F' }} title="Regressed: 6" />
              <div style={{ width: '5%', backgroundColor: '#D5D7DC' }} title="Both flagged: 6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Both accepted', count: 90, pct: '75%', dot: '#91949A' },
                { label: 'Improved in B', count: 18, pct: '15%', dot: '#7EA885' },
                { label: 'Regressed in B', count: 6, pct: '5%', dot: '#F3B61F' },
                { label: 'Both flagged', count: 6, pct: '5%', dot: '#D5D7DC' },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{
                    border: '1px solid #E4E6E9',
                    borderRadius: 6,
                    padding: '14px 16px',
                    backgroundColor: '#FBFAFB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#4E5158' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: b.dot, display: 'inline-block' }} />
                    <span>{b.label}</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: 24, color: '#18181A', marginTop: 8 }}>
                    {b.count} <span style={{ fontSize: 14, color: '#63666E' }}>({b.pct})</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 15, fontWeight: 500, color: '#222428', marginBottom: 10 }}>
              Regression cases requiring follow-up ({REGRESSION_CASES.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {REGRESSION_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCaseId(c.id);
                    setActiveSubTab('Cases');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    border: c.id === selectedCaseId ? '1.5px solid #222428' : '1px solid #E4E6E9',
                    borderRadius: 6,
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#18181A' }}>{c.title}</div>
                    <div style={{ fontSize: 13.5, color: '#52555D', marginTop: 2 }}>{c.finding}</div>
                  </div>
                  <span className="font-mono" style={{ fontSize: 13.5, color: '#4E5158' }}>
                    CASE {c.id} →
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
        {/* Dropdown Button: Regressions (6) */}
        <div style={{ position: 'absolute', left: 23, top: 22 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: 188,
              height: 46,
              border: '1px solid #DCDFE4',
              borderRadius: 6,
              backgroundColor: '#FFFFFF',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 16,
              color: '#1E1E1C',
            }}
          >
            <span>Regressions (6)</span>
            <svg width="12" height="8" viewBox="0 0 12 8">
              <path
                d="M1 1.5L6 6.5L11 1.5"
                fill="none"
                stroke="#383A40"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 52,
                left: 0,
                width: 280,
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCDFE4',
                borderRadius: 6,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              {REGRESSION_CASES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCaseId(c.id);
                    setDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    fontSize: 14,
                    backgroundColor: c.id === selectedCaseId ? '#F5F5F2' : '#FFFFFF',
                    borderBottom: '1px solid #EFEFEF',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{c.title}</span>
                  <span className="font-mono" style={{ color: '#676A72' }}>
                    {c.id}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Case 043 · 1 of 6 + Prev/Next Buttons */}
        <div
          className="font-mono"
          style={{
            position: 'absolute',
            right: 142,
            top: 35,
            fontSize: 15,
            color: '#4E5158',
          }}
        >
          Case {activeCase.id} · {activeCase.index} of 6
        </div>

        <button
          onClick={handlePrev}
          aria-label="Previous regression case"
          style={{
            position: 'absolute',
            left: 888,
            top: 22,
            width: 45,
            height: 46,
            border: '1px solid #DCDFE4',
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="8" height="14" viewBox="0 0 8 14">
            <path
              d="M7 1L1 7L7 13"
              fill="none"
              stroke="#2B2D32"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          aria-label="Next regression case"
          style={{
            position: 'absolute',
            left: 942,
            top: 22,
            width: 46,
            height: 46,
            border: '1px solid #DCDFE4',
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="8" height="14" viewBox="0 0 8 14">
            <path
              d="M1 1L7 7L1 13"
              fill="none"
              stroke="#2B2D32"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Case Heading & Question */}
        <h2
          style={{
            position: 'absolute',
            left: 23,
            top: 97,
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#18181A',
            margin: 0,
          }}
        >
          {activeCase.title}
        </h2>

        <p
          className="font-serif"
          style={{
            position: 'absolute',
            left: 23,
            top: 150,
            fontSize: 21,
            color: '#464952',
            margin: 0,
          }}
        >
          {activeCase.prompt}
        </p>

        {/* Left Comparison Box: Baseline A (x: 87..562 -> rel left 26, width 475, top 202, height 173) */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 202,
            width: 475,
            height: 173,
            border: '1px solid #E2E4E8',
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 25,
              top: 22,
              fontSize: 19,
              fontWeight: 500,
              color: '#18181A',
            }}
          >
            Baseline A
          </div>

          <div
            style={{
              position: 'absolute',
              right: 25,
              top: 16,
              height: 35,
              padding: '0 14px',
              backgroundColor: '#EBF3ED',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 14.5,
              color: '#264E36',
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: '#2E7D4F',
                display: 'inline-block',
              }}
            />
            <span>Accepted</span>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 25,
              top: 63,
              width: 425,
              height: 1,
              backgroundColor: '#EAECEF',
            }}
          />

          <p
            className="font-serif"
            style={{
              position: 'absolute',
              left: 25,
              top: 86,
              width: 425,
              fontSize: 20.5,
              lineHeight: 1.42,
              color: '#222428',
              margin: 0,
            }}
          >
            {activeCase.baseline.response}
          </p>
        </div>

        {/* Right Comparison Box: Candidate B (rel left 517, width 468, top 202, height 173) */}
        <div
          style={{
            position: 'absolute',
            left: 517,
            top: 202,
            width: 468,
            height: 173,
            border: '1px solid #E2E4E8',
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 25,
              top: 22,
              fontSize: 19,
              fontWeight: 500,
              color: '#18181A',
            }}
          >
            Candidate B
          </div>

          <div
            style={{
              position: 'absolute',
              right: 25,
              top: 16,
              height: 35,
              padding: '0 14px',
              backgroundColor: '#FEF3D6',
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontSize: 14.5,
              color: '#4A3B1C',
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: '#F3B61F',
                display: 'inline-block',
              }}
            />
            <span>Flagged</span>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 25,
              top: 63,
              width: 418,
              height: 1,
              backgroundColor: '#EAECEF',
            }}
          />

          <p
            className="font-serif"
            style={{
              position: 'absolute',
              left: 25,
              top: 86,
              width: 418,
              fontSize: 20.5,
              lineHeight: 1.42,
              color: '#222428',
              margin: 0,
            }}
          >
            {activeCase.candidate.response}
          </p>
        </div>

        {/* Review Finding Box (rel left 26, top 393, width 959, height 102) */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 393,
            width: 959,
            height: 102,
            backgroundColor: '#F8F9FA',
            border: '1px solid #E5E7EB',
            borderRadius: 6,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 25,
              top: 18,
              fontSize: 15.5,
              fontWeight: 500,
              color: '#222428',
            }}
          >
            Review finding
          </div>
          <div
            style={{
              position: 'absolute',
              left: 25,
              top: 50,
              fontSize: 20,
              color: '#18181A',
            }}
          >
            {activeCase.finding}
          </div>
        </div>

        {/* Bottom Selector Row: 6 regression cases */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 546,
            fontSize: 16.5,
            color: '#464952',
          }}
        >
          6 regression cases
        </div>

        <div
          style={{
            position: 'absolute',
            left: 266,
            top: 533,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          {REGRESSION_CASES.map((c) => {
            const active = c.id === selectedCaseId;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCaseId(c.id)}
                className="font-mono"
                style={{
                  width: 76,
                  height: 42,
                  borderRadius: 6,
                  border: active ? '1.5px solid #222428' : '1px solid #DCDFE4',
                  backgroundColor: '#FFFFFF',
                  fontSize: 15.5,
                  fontWeight: active ? 500 : 400,
                  color: '#18181A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {c.id}
              </button>
            );
          })}
        </div>
          </>
        )}
      </div>

      {/* Right Main Card: Evidence sign-off (x: 1098..1474, y: 395..998) */}
      <div
        style={{
          position: 'absolute',
          left: 1098,
          top: 395,
          width: 377,
          height: 603,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E6E9',
          borderRadius: 6,
        }}
      >
        <h3
          style={{
            position: 'absolute',
            left: 26,
            top: 25,
            fontSize: 28.5,
            fontWeight: 400,
            letterSpacing: '-0.015em',
            color: '#18181A',
            margin: 0,
          }}
        >
          Evidence sign-off
        </h3>

        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 66,
            fontSize: 16.5,
            color: '#52555D',
          }}
        >
          {isSigned ? '3 of 3 reviewers signed' : '2 of 3 reviewers signed'}
        </div>

        {/* Rule 1 */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 105,
            width: 325,
            height: 1,
            backgroundColor: '#EAECEF',
          }}
        />

        {/* Reviewer 1: Asha Ng */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 126,
            width: 325,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 17.5, color: '#18181A' }}>Asha Ng</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 105 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#0E7042',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: 15.5, color: '#17663E' }}>Signed</span>
          </div>
        </div>

        {/* Rule 2 */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 169,
            width: 325,
            height: 1,
            backgroundColor: '#EAECEF',
          }}
        />

        {/* Reviewer 2: Leo Ruiz */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 190,
            width: 325,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 17.5, color: '#18181A' }}>Leo Ruiz</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 105 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: '#0E7042',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
              }}
            >
              ✓
            </span>
            <span style={{ fontSize: 15.5, color: '#17663E' }}>Signed</span>
          </div>
        </div>

        {/* Rule 3 */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 233,
            width: 325,
            height: 1,
            backgroundColor: '#EAECEF',
          }}
        />

        {/* Reviewer 3: Mina Shah */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 254,
            width: 325,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 17.5, color: '#18181A' }}>Mina Shah</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 105 }}>
            {isSigned ? (
              <>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: '#0E7042',
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: 15.5, color: '#17663E' }}>Signed</span>
              </>
            ) : (
              <>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: '1.6px solid #4E5158',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: 15.5, color: '#63666E' }}>Pending</span>
              </>
            )}
          </div>
        </div>

        {/* Rule 4 */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 297,
            width: 325,
            height: 1,
            backgroundColor: '#EAECEF',
          }}
        />

        {/* Serif Note */}
        <p
          className="font-serif"
          style={{
            position: 'absolute',
            left: 26,
            top: 324,
            width: 315,
            fontSize: 17,
            lineHeight: 1.42,
            color: '#383A40',
            margin: 0,
          }}
        >
          A sign-off approves the evidence record,
          <br />
          not a model release.
        </p>

        {/* Warm Cream Pending Box (rel left 26, top 406, width 325, height 118) */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 406,
            width: 325,
            height: 118,
            backgroundColor: isSigned ? '#EBF4ED' : '#FCF4DF',
            borderRadius: 6,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 17,
              top: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              fontSize: 16,
              color: isSigned ? '#1E6B43' : '#2B2412',
            }}
          >
            <span
              style={{
                width: 11,
                height: 11,
                borderRadius: '50%',
                backgroundColor: isSigned ? '#1E6B43' : '#F3B61F',
                display: 'inline-block',
              }}
            />
            <span>{isSigned ? 'Your review is signed.' : 'Your review is pending.'}</span>
          </div>

          <button
            onClick={onToggleSign}
            style={{
              position: 'absolute',
              left: 17,
              top: 54,
              width: 294,
              height: 46,
              backgroundColor: '#25272C',
              color: '#FFFFFF',
              borderRadius: 6,
              fontSize: 15.5,
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <span>{isSigned ? 'Reset sign-off state' : 'Add your decision'}</span>
            {!isSigned && <span style={{ fontSize: 16 }}>→</span>}
          </button>
        </div>

        {/* Bottom Link: View review history */}
        <button
          onClick={onOpenComponent}
          style={{
            position: 'absolute',
            left: 26,
            top: 544,
            fontSize: 15.5,
            color: '#2B2D32',
            borderBottom: '1.2px solid #4E5158',
            paddingBottom: 2,
            lineHeight: 1.1,
          }}
        >
          View review history
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   4. COMPONENT STAGE (1376 × 1143) — 1:1 with component.png
   ========================================================================== */
const ComponentStage: React.FC<{
  isSigned: boolean;
  onToggleSign: () => void;
  onOpenWorkspace: () => void;
}> = ({ isSigned, onToggleSign, onOpenWorkspace }) => {
  const [checked, setChecked] = useState(true);
  const [note, setNote] = useState('Regression cases need follow-up owners.');
  const [changesRequested, setChangesRequested] = useState(false);

  return (
    <div
      style={{
        width: 1376,
        height: 1143,
        backgroundColor: '#FBFAFB',
        position: 'relative',
        color: '#18181A',
        fontFamily: 'var(--font-sans)',
        userSelect: 'none',
      }}
    >
      {/* Outer White Card (x: 29..1346, y: 29..1114) */}
      <div
        style={{
          position: 'absolute',
          left: 29,
          top: 29,
          width: 1318,
          height: 1086,
          backgroundColor: '#FFFFFF',
          border: '1px solid #DFE1E5',
          borderRadius: 12,
        }}
      >
        {/* Top Row: NERAL left, EV-024 right */}
        <button
          onClick={onOpenWorkspace}
          style={{
            position: 'absolute',
            left: 33,
            top: 28,
            fontSize: 31,
            fontWeight: 400,
            letterSpacing: '0.03em',
            color: '#18181A',
            lineHeight: 1,
          }}
        >
          NERAL
        </button>

        <div
          className="font-mono"
          style={{
            position: 'absolute',
            right: 33,
            top: 31,
            fontSize: 22,
            color: '#63666E',
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}
        >
          EV-024
        </div>

        {/* Title Row: Evidence sign-off + Review pending pill */}
        <h1
          style={{
            position: 'absolute',
            left: 33,
            top: 86,
            fontSize: 54,
            fontWeight: 400,
            letterSpacing: '-0.025em',
            color: '#141416',
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Evidence sign-off
        </h1>

        <div
          style={{
            position: 'absolute',
            left: 478,
            top: 99,
            height: 45,
            padding: '0 18px',
            backgroundColor: isSigned
              ? '#EBF4ED'
              : changesRequested
              ? '#FDECEC'
              : '#FCF1D4',
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            fontSize: 19,
            color: isSigned ? '#1E6B43' : changesRequested ? '#8B2117' : '#332912',
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: isSigned
                ? '#1E6B43'
                : changesRequested
                ? '#D34538'
                : '#F3B61F',
              display: 'inline-block',
            }}
          />
          <span>
            {isSigned
              ? 'Review signed'
              : changesRequested
              ? 'Changes requested'
              : 'Review pending'}
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 33,
            top: 152,
            fontSize: 27,
            color: '#5A5E66',
            letterSpacing: '-0.01em',
          }}
        >
          Support answers · 120 cases
        </div>

        {/* Sub-card 1: Baseline A vs Candidate B (rel left 33, top 205, width 1252, height 278) */}
        <div
          style={{
            position: 'absolute',
            left: 33,
            top: 205,
            width: 1252,
            height: 278,
            border: '1px solid #E2E4E8',
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Baseline A */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 24,
              fontSize: 23,
              fontWeight: 400,
              color: '#18181A',
            }}
          >
            Baseline A
          </div>
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 63,
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#141416',
              lineHeight: 1,
            }}
          >
            80%
          </div>
          <div
            className="font-mono"
            style={{
              position: 'absolute',
              left: 30,
              top: 126,
              fontSize: 19.5,
              color: '#5A5E66',
            }}
          >
            96 / 120 accepted
          </div>
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 162,
              width: 554,
              height: 16,
              backgroundColor: '#EAECEB',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '82.8%',
                height: '100%',
                backgroundColor: '#6BA279',
                borderRadius: 8,
              }}
            />
          </div>

          {/* Vertical Center Divider */}
          <div
            style={{
              position: 'absolute',
              left: 626,
              top: 23,
              width: 1,
              height: 164,
              backgroundColor: '#E5E7EB',
            }}
          />

          {/* Candidate B */}
          <div
            style={{
              position: 'absolute',
              left: 671,
              top: 24,
              fontSize: 23,
              fontWeight: 400,
              color: '#18181A',
            }}
          >
            Candidate B
          </div>
          <div
            style={{
              position: 'absolute',
              left: 671,
              top: 63,
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#141416',
              lineHeight: 1,
            }}
          >
            90%
          </div>
          <div
            className="font-mono"
            style={{
              position: 'absolute',
              left: 671,
              top: 126,
              fontSize: 19.5,
              color: '#5A5E66',
            }}
          >
            108 / 120 accepted
          </div>
          <div
            style={{
              position: 'absolute',
              left: 671,
              top: 162,
              width: 553,
              height: 16,
              backgroundColor: '#EAECEB',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '89.7%',
                height: '100%',
                backgroundColor: '#6BA279',
                borderRadius: 8,
              }}
            />
          </div>

          {/* Horizontal Divider inside Subcard 1 */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 210,
              width: 1192,
              height: 1,
              backgroundColor: '#E5E7EB',
            }}
          />

          {/* Bottom Metrics Line */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 228,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span style={{ fontSize: 25, fontWeight: 500, color: '#0E6B3C' }}>
              +10 percentage points
            </span>
            <span style={{ fontSize: 22, color: '#5A5E66' }}>·</span>
            <span style={{ fontSize: 21, color: '#383A40' }}>6 regressions</span>
          </div>
        </div>

        {/* Sub-card 2: Reviewers List (rel left 33, top 505, width 1252, height 242) */}
        <div
          style={{
            position: 'absolute',
            left: 33,
            top: 505,
            width: 1252,
            height: 242,
            border: '1px solid #E2E4E8',
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 20,
              fontSize: 21,
              color: '#464952',
            }}
          >
            {isSigned ? '3 of 3 reviewers signed' : '2 of 3 reviewers signed'}
          </div>

          {/* Row 1 Rule */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 60,
              width: 1192,
              height: 1,
              backgroundColor: '#EAECEF',
            }}
          />

          {/* Asha Ng */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 74,
              width: 1192,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 22.5, color: '#141416' }}>Asha Ng</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 138 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#0E6E40',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: 20, color: '#17663E' }}>Signed</span>
            </div>
          </div>

          {/* Row 2 Rule */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 118,
              width: 1192,
              height: 1,
              backgroundColor: '#EAECEF',
            }}
          />

          {/* Leo Ruiz */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 133,
              width: 1192,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 22.5, color: '#141416' }}>Leo Ruiz</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 138 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#0E6E40',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: 20, color: '#17663E' }}>Signed</span>
            </div>
          </div>

          {/* Row 3 Rule */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 177,
              width: 1192,
              height: 1,
              backgroundColor: '#EAECEF',
            }}
          />

          {/* Mina Shah */}
          <div
            style={{
              position: 'absolute',
              left: 30,
              top: 192,
              width: 1192,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 22.5, color: '#141416' }}>Mina Shah</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: 138 }}>
              {isSigned ? (
                <>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#0E6E40',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 17,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontSize: 20, color: '#17663E' }}>Signed</span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: '2px solid #282A30',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: 20, color: '#4E5158' }}>Pending</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Checkbox Row (rel left 35, top 771) */}
        <button
          onClick={() => setChecked(!checked)}
          style={{
            position: 'absolute',
            left: 35,
            top: 771,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <span
            style={{
              width: 35,
              height: 35,
              borderRadius: 6,
              backgroundColor: checked ? '#25272C' : '#FFFFFF',
              border: checked ? 'none' : '2px solid #25272C',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {checked && '✓'}
          </span>
          <span style={{ fontSize: 22, color: '#2B2D32' }}>
            I reviewed the six regression cases.
          </span>
        </button>

        {/* Sub-card 3: Decision Note (rel left 33, top 832, width 1252, height 109) */}
        <div
          style={{
            position: 'absolute',
            left: 33,
            top: 832,
            width: 1252,
            height: 109,
            border: '1px solid #E2E4E8',
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 24,
              top: 15,
              fontSize: 17,
              color: '#464952',
            }}
          >
            Decision note
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              position: 'absolute',
              left: 24,
              top: 48,
              width: 1180,
              border: 'none',
              outline: 'none',
              fontSize: 23,
              fontWeight: 500,
              color: '#141416',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Bottom Divider Line at rel top 963 */}
        <div
          style={{
            position: 'absolute',
            left: 33,
            top: 963,
            width: 1252,
            height: 1,
            backgroundColor: '#E5E7EB',
          }}
        />

        {/* Footer Row */}
        <div
          className="font-serif"
          style={{
            position: 'absolute',
            left: 33,
            top: 1006,
            fontSize: 22.5,
            color: '#2B2D32',
          }}
        >
          Signing confirms the evidence record. It does not release a model.
        </div>

        {/* Sign evidence review button */}
        <button
          onClick={() => {
            setChangesRequested(false);
            onToggleSign();
          }}
          style={{
            position: 'absolute',
            left: 745,
            top: 986,
            width: 306,
            height: 66,
            backgroundColor: '#25272C',
            color: '#FFFFFF',
            borderRadius: 8,
            fontSize: 21,
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <span>{isSigned ? 'Reset sign-off ✓' : 'Sign evidence review'}</span>
          {!isSigned && <span style={{ fontSize: 22 }}>→</span>}
        </button>

        {/* Request changes button */}
        <button
          onClick={() => {
            setChangesRequested(!changesRequested);
            if (isSigned) onToggleSign();
          }}
          style={{
            position: 'absolute',
            left: 1065,
            top: 986,
            width: 221,
            height: 66,
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #63666E',
            borderRadius: 8,
            fontSize: 21,
            fontWeight: 400,
            color: '#141416',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Request changes
        </button>
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN APPLICATION SHELL WITH 1:1 COMPARE & STAGE SCALING
   ========================================================================== */
export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('desktop');
  const [compareMode, setCompareMode] = useState<CompareMode>('off');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('043');
  const [isSigned, setIsSigned] = useState<boolean>(false);

  const stageSpecs: Record<
    ActiveView,
    { width: number; height: number; maxWidth: number; refImg: string }
  > = {
    desktop: {
      width: 1536,
      height: 2048,
      maxWidth: 1536,
      refImg: '/reference/desktop-homepage.png',
    },
    mobile: {
      width: 821,
      height: 3831,
      maxWidth: 440,
      refImg: '/reference/mobile-homepage.png',
    },
    workspace: {
      width: 1536,
      height: 1024,
      maxWidth: 1536,
      refImg: '/reference/app.png',
    },
    component: {
      width: 1376,
      height: 1143,
      maxWidth: 1376,
      refImg: '/reference/component.png',
    },
  };

  const spec = stageSpecs[activeView];

  const handleOpenWorkspace = (caseId?: string) => {
    if (caseId) setSelectedCaseId(caseId);
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenComponent = () => {
    setActiveView('component');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStage = () => {
    if (activeView === 'desktop') {
      return (
        <DesktopStage
          onOpenWorkspace={handleOpenWorkspace}
          onOpenComponent={handleOpenComponent}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      );
    }
    if (activeView === 'mobile') {
      return (
        <MobileStage
          onOpenWorkspace={handleOpenWorkspace}
          onOpenComponent={handleOpenComponent}
        />
      );
    }
    if (activeView === 'workspace') {
      return (
        <WorkspaceStage
          selectedCaseId={selectedCaseId}
          onSelectCaseId={setSelectedCaseId}
          isSigned={isSigned}
          onToggleSign={() => setIsSigned(!isSigned)}
          onBackHome={() => setActiveView('desktop')}
          onOpenComponent={handleOpenComponent}
        />
      );
    }
    return (
      <ComponentStage
        isSigned={isSigned}
        onToggleSign={() => setIsSigned(!isSigned)}
        onOpenWorkspace={() => handleOpenWorkspace('043')}
      />
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: activeView === 'workspace' ? '#FCFCFB' : '#F9F9F7',
        position: 'relative',
      }}
    >
      {compareMode === 'side' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            padding: 16,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              border: '1px solid var(--rule-base)',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div
              className="font-mono"
              style={{
                padding: '8px 14px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid var(--rule-base)',
                fontSize: 11,
              }}
            >
              LIVE REACT STAGE ({spec.width} × {spec.height})
            </div>
            <Scaled width={spec.width} height={spec.height}>
              {renderStage()}
            </Scaled>
          </div>

          <div
            style={{
              border: '1px solid var(--rule-base)',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              position: 'sticky',
              top: 16,
            }}
          >
            <div
              className="font-mono"
              style={{
                padding: '8px 14px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid var(--rule-base)',
                fontSize: 11,
              }}
            >
              CANONICAL REFERENCE PNG ({spec.refImg})
            </div>
            <img
              src={spec.refImg}
              alt="Canonical Reference"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            maxWidth: spec.maxWidth,
            margin: activeView === 'mobile' ? '24px auto 80px' : '0 auto',
            position: 'relative',
            boxShadow:
              activeView === 'mobile' ? '0 8px 32px rgba(0,0,0,0.06)' : 'none',
            borderRadius: activeView === 'mobile' ? 12 : 0,
            overflow: 'hidden',
          }}
        >
          <Scaled width={spec.width} height={spec.height}>
            {renderStage()}
          </Scaled>

          {compareMode === 'overlay' && (
            <img
              src={spec.refImg}
              alt="Reference Overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
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
          bottom: 16,
          right: 16,
          zIndex: 800,
          backgroundColor: 'rgba(255,255,255,0.96)',
          border: '1px solid #DFDFDC',
          borderRadius: 999,
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
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
              borderRadius: 999,
              padding: '5px 12px',
              fontSize: 11.5,
              fontWeight: 500,
              cursor: 'pointer',
              backgroundColor: activeView === tab.id ? '#222220' : 'transparent',
              color: activeView === tab.id ? '#FFFFFF' : '#5C5C58',
            }}
          >
            {tab.label}
          </button>
        ))}

        <span style={{ color: '#DFDFDC' }}>|</span>

        {(['off', 'side', 'overlay'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCompareMode(m)}
            className="font-mono"
            style={{
              border: '1px solid #DFDFDC',
              borderRadius: 999,
              padding: '4px 9px',
              fontSize: 10.5,
              cursor: 'pointer',
              backgroundColor: compareMode === m ? '#1E6B43' : '#FFFFFF',
              color: compareMode === m ? '#FFFFFF' : '#5C5C58',
            }}
          >
            {m === 'off' ? '1:1 Off' : m === 'side' ? 'Side-by-Side' : 'Overlay'}
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
};

export default App;
