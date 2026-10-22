import React, { useEffect, useRef, useState } from 'react';

export interface WorkflowNodeItem {
  label: string;
  detail?: string;
}

export interface WorkflowNode {
  id: string;
  stepNumber?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  isHumanCheckpoint?: boolean;
  isFinalOutput?: boolean;
  quoteLabel?: string;
  quote?: string;
  quotes?: string[];
  items?: WorkflowNodeItem[];
  subBoxes?: {
    title: string;
    items: string[];
  }[];
}

export interface WorkflowColumn {
  phaseNumber: string;
  phaseTitle: string;
  phaseSubtitle: string;
  nodes: WorkflowNode[];
}

const WORKFLOW_COLUMNS: WorkflowColumn[] = [
  {
    phaseNumber: 'PHASE 01',
    phaseTitle: 'Origin & Voice Research',
    phaseSubtitle: 'Prompt to category benchmarking',
    nodes: [
      {
        id: 'prompt',
        stepNumber: '01',
        title: 'Initial Prompt',
        subtitle: 'Workflow Trigger',
        badge: 'Prompt Origin',
        quote: '"Make me a warm landing page for my new coffee shop and brand"',
      },
      {
        id: 'benchmarking',
        stepNumber: '02',
        title: 'Competitor Research Benchmarking',
        subtitle: 'Voice-generated Markdown specification',
        badge: '1× research.md',
        quoteLabel: 'Example Voice Research Prompts',
        quotes: [
          '"Give me 25 examples of coffee shop brands that are modern and popular across Instagram and the social web."',
          '"Keep going in this direction, XYZ brand. Find me more versions of this that have high brand quality, similar photography, and visual direction."',
        ],
        items: [
          {
            label: '1× research.md Artifact (via Voice)',
            detail: 'Benchmarks top 15–25 live category websites & applications',
          },
          {
            label: 'Reference Capture (~25 Sources)',
            detail: 'Indexed by production URL + full-viewport screenshot',
          },
          {
            label: 'Dual Evaluation Lens',
            detail: 'Analyzes both Visual Direction and Code / DOM Interactions',
          },
        ],
        subBoxes: [
          {
            title: 'Future State: Pre-Indexed Library & Catalog',
            items: [
              'Pulls directly from a curated reference catalog rather than running real-time discovery',
              'Executes as a background instruction to continuously refresh category benchmarks',
            ],
          },
        ],
      },
    ],
  },
  {
    phaseNumber: 'PHASE 02',
    phaseTitle: 'Design Range & MD Artifacts',
    phaseSubtitle: 'Spectrum parameterization & prompt specs',
    nodes: [
      {
        id: 'design-range',
        stepNumber: '03',
        title: 'Dynamic Design Range & Interaction Specs',
        subtitle: 'Upfront design-space parameterization',
        badge: 'Spectrum Spec',
        quoteLabel: 'Example Range Structuring Prompt',
        quote: '"Begin to structure our design range from minimal to opinionated, represented by xyz.com for minimal, xyz.com for structured, and xyz.com for opinionated."',
        subBoxes: [
          {
            title: 'A. Dynamic Design Spectrum',
            items: [
              'Defines explicit stylistic axes from category research (Minimal → Structured → Opinionated)',
              'Maps distinct category archetypes (e.g., Minimalist vs. Heritage Editorial vs. Streetwear)',
            ],
          },
          {
            title: 'B. Interaction & Touch Areas ("Charm")',
            items: [
              'Specifies section-level micro-interactions and motion behaviors prior to Image Gen',
              'Assigns structural & interactive constraints per section so charm carries into comps',
            ],
          },
        ],
      },
      {
        id: 'md-artifacts',
        stepNumber: '04',
        title: 'Structured Markdown Specifications',
        subtitle: 'Roll-over context for Image Generation',
        badge: '1 Main + 5–10 Range .md',
        items: [
          {
            label: '1× Main Agent .md File',
            detail: 'Global architecture, layout constraints, and interaction specifications',
          },
          {
            label: '5–10× Design Range .md Files',
            detail: 'One dedicated specification per design spectrum point',
          },
          {
            label: 'Zero Tertiary Research in Image Gen',
            detail: 'Pre-loaded with prompts, reference URLs, and code references for direct generation',
          },
        ],
      },
    ],
  },
  {
    phaseNumber: 'PHASE 03',
    phaseTitle: 'Image Generation (Nano Banana 2)',
    phaseSubtitle: 'Comps, 4K grids, & Design Package .md',
    nodes: [
      {
        id: 'imgen-core',
        stepNumber: '05',
        title: 'Iterative Image Generation',
        subtitle: 'Nano Banana 2 Visual Pipeline',
        badge: 'Desktop + Mobile',
        items: [
          {
            label: 'Anchor Screens & Breakpoints',
            detail: 'Generates initial screens steered by .md specs; locks Desktop + Mobile breakpoints',
          },
          {
            label: 'Clone & Full-Site Expansion',
            detail: 'Clones locked anchor → generates core sections + footer → scales up to 35+ screens',
          },
          {
            label: 'Execution Mode (1-by-1 or 4K Grid)',
            detail: 'Renders screens individually OR as a composite 4K grid sliced post-generation for cost efficiency',
          },
        ],
      },
      {
        id: 'human-gate-1',
        stepNumber: '06',
        title: 'Human Checkpoint #1: Grid & Comp QA',
        subtitle: 'Internal Design Team Review Gate',
        badge: 'HUMAN GATE',
        isHumanCheckpoint: true,
        items: [
          {
            label: 'Internal Grid Review Surface',
            detail: 'Rapid pass/fail audit across generated screen grids to validate palette, typography, and layout',
          },
          {
            label: 'Prevents Downstream Drift ("Slop")',
            detail: 'Catches palette or structural regressions early—before scaling across 30+ screens',
          },
        ],
        subBoxes: [
          {
            title: 'Drift Mitigation & Model Evolution',
            items: [
              'Current Grounding: Bridges public reference gaps via Screenshot + Code Reference + Steering',
              'Target Evolution: Trains skill to extrapolate full flows from only the first few anchor screens',
            ],
          },
        ],
      },
      {
        id: 'design-package',
        stepNumber: '07',
        title: 'Complete Design Package',
        subtitle: 'Consolidated Build Handoff',
        badge: '1× design-package.md',
        items: [
          {
            label: '1× Complete Design Package .md File',
            detail: 'Unifies all research .md files, code references, breakpoint specs, & approved screen comps',
          },
          {
            label: 'Deterministic Build Input',
            detail: 'Eliminates ad-hoc Image Gen or visual guesswork during React engineering',
          },
        ],
      },
    ],
  },
  {
    phaseNumber: 'PHASE 04',
    phaseTitle: 'Image-to-React Skills & Steering',
    phaseSubtitle: 'Pipeline .md, skill checkpoints, & steering',
    nodes: [
      {
        id: 'react-skills',
        stepNumber: '08',
        title: 'Image-to-React Skills Pipeline',
        subtitle: 'Modular skills with verifiable checkpoints',
        badge: '1 Pipeline + 3 Skill .md',
        items: [
          {
            label: '1× Image-to-React Pipeline .md File',
            detail: 'Master orchestration spec governing component translation and QA gates',
          },
          {
            label: '3× Skill Definition & Checkpoint .md Files',
            detail: 'Each skill executes from its .md spec and emits a shareable checkpoint artifact',
          },
        ],
        subBoxes: [
          {
            title: 'Skill 01 (.md) — Clean Image-to-React Translation',
            items: ['High-fidelity structural and visual translation from approved screen comps to React'],
          },
          {
            title: 'Skill 02 (.md) — Cleanup & Evaluation Benchmarking',
            items: ['Automated model evaluation paired with human reviewer benchmarking'],
          },
          {
            title: 'Skill 03 (.md) — Viewport & Performance QA',
            items: ['Cross-viewport responsiveness, 60fps scroll performance, and scroll-kit verification'],
          },
        ],
      },
      {
        id: 'human-gate-2',
        stepNumber: '09',
        title: 'Human Checkpoint #2: Code Steering',
        subtitle: 'Core Screen Verification & Worktree Control',
        badge: 'HUMAN GATE',
        isHumanCheckpoint: true,
        items: [
          {
            label: 'Shareable Artifact Checkpoints',
            detail: 'Validates core template screens before multiplying patterns across 35+ pages',
          },
          {
            label: '~3 Designer Steering Moments (First 3–5 Pages)',
            detail: 'Targeted code-level interventions on foundational screens',
          },
        ],
        subBoxes: [
          {
            title: 'Two Code Steering Paths',
            items: [
              'Path A (Revert Drift): Identifies deviation from comp and restores strict visual fidelity',
              'Path B (Freeze & Branch): Captures emergent high-craft behavior → freezes worktree, analyzes, & promotes forward',
            ],
          },
        ],
      },
    ],
  },
  {
    phaseNumber: 'PHASE 05',
    phaseTitle: 'Packaging & Golden Template',
    phaseSubtitle: 'Model-safe linting, bundle .md, & final .zip',
    nodes: [
      {
        id: 'lint-package',
        stepNumber: '10',
        title: 'Linting & Model-Safe Packaging Skill',
        subtitle: 'Schema validation & single-archive bundling',
        badge: '1× bundle.md + .zip',
        items: [
          {
            label: '1× Bundle Manifest & Packaging .md File',
            detail: 'Documents model-safe directory structure, lint pass status, and file inventory',
          },
          {
            label: 'Model-Format Linting & Validation',
            detail: 'Enforces strict schema and syntax compliance across the entire application',
          },
        ],
        subBoxes: [
          {
            title: 'Single Bundle (.zip) Payload',
            items: [
              'Bundle Manifest (.md) specification',
              'All required website & application route pages',
              'All .apx files',
              'All JavaScript / TypeScript (.js / .ts / .tsx) modules',
              'All application, environment, & build configuration files',
            ],
          },
        ],
      },
      {
        id: 'golden-template',
        title: 'React Golden Template',
        subtitle: 'Fully Steered, Design Benchmarked & Packaged',
        badge: 'GOLDEN TEMPLATE',
        isFinalOutput: true,
      },
    ],
  },
];

const DownArrow: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
    <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="0" x2="8" y2="18" stroke="#111111" strokeWidth="1.5" />
      <path d="M3.5 14.5L8 19.5L12.5 14.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const RightConnector: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      flexShrink: 0,
      paddingTop: '110px',
    }}
  >
    <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="12" x2="36" y2="12" stroke="#111111" strokeWidth="1.5" />
      <path d="M31 6.5L37.5 12L31 17.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export const JetskiWorkflowDiagram: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateScale = () => {
      const designWidth = 1960;
      const availableWidth = document.documentElement.clientWidth || window.innerWidth;
      const nextScale = availableWidth / designWidth;
      setScale(nextScale);
      if (canvasRef.current) {
        setScaledHeight(Math.ceil(canvasRef.current.offsetHeight * nextScale));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        height: scaledHeight ? `${scaledHeight}px` : 'auto',
      }}
    >
      <div
        ref={canvasRef}
        style={{
          backgroundColor: '#FFFFFF',
          color: '#111111',
          fontFamily: '"Google Sans Flex", "Google Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          padding: '40px 48px 56px',
          width: '1960px',
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header */}
        <header
          style={{
            borderBottom: '1.5px solid #111111',
            paddingBottom: '20px',
            marginBottom: '36px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '24px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#52525B',
                marginBottom: '6px',
              }}
            >
              JETSKI DESIGN WORKFLOW
            </div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                margin: 0,
                color: '#111111',
              }}
            >
              Prompt &amp; Mood Board → React Golden Template
            </h1>
            <div
              style={{
                fontSize: '13px',
                color: '#52525B',
                marginTop: '6px',
              }}
            >
              End-to-End Architecture: Voice Benchmarking, Dynamic Design Spectrums, Nano Banana 2 Comps, Skill Checkpoints, &amp; Model-Safe Packaging
            </div>
          </div>

          {/* Clean Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '12px',
              color: '#3F3F46',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '4px',
                  border: '1.25px solid #D4D4D8',
                  backgroundColor: '#FFFFFF',
                  display: 'inline-block',
                }}
              />
              <span>Process / Skill Node (&amp; .md Specs)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '4px',
                  border: '1.75px solid #111111',
                  backgroundColor: '#FAFAFA',
                  display: 'inline-block',
                }}
              />
              <span>Human Review / Steering Gate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '4px',
                  border: '1.5px solid #111111',
                  backgroundColor: '#111111',
                  display: 'inline-block',
                }}
              />
              <span>Final Golden Template</span>
            </div>
          </div>
        </header>

        {/* Left-to-Right Pipeline Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            flexWrap: 'nowrap',
          }}
        >
          {WORKFLOW_COLUMNS.map((col, colIndex) => (
            <React.Fragment key={col.phaseNumber}>
              {/* Column */}
              <div
                style={{
                  width: '344px',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Phase Header Box */}
                <div
                  style={{
                    borderBottom: '1.5px solid #111111',
                    paddingBottom: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#52525B',
                      marginBottom: '4px',
                    }}
                  >
                    {col.phaseNumber}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: '#111111',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {col.phaseTitle}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#52525B',
                      marginTop: '2px',
                    }}
                  >
                    {col.phaseSubtitle}
                  </div>
                </div>

                {/* Nodes Stack */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {col.nodes.map((node, nodeIndex) => {
                    const isFinal = Boolean(node.isFinalOutput);
                    const isHuman = Boolean(node.isHumanCheckpoint);

                    return (
                      <React.Fragment key={node.id}>
                        <div
                          style={{
                            borderRadius: '12px',
                            border: isFinal
                              ? '2px solid #D4AF37'
                              : isHuman
                              ? '1.75px solid #111111'
                              : '1.25px solid #D4D4D8',
                            background: isFinal
                              ? 'radial-gradient(circle at 50% 32%, rgba(245, 158, 11, 0.22) 0%, #0D0D0F 72%)'
                              : isHuman
                              ? '#FAFAFA'
                              : '#FFFFFF',
                            backgroundColor: isFinal ? '#0D0D0F' : isHuman ? '#FAFAFA' : '#FFFFFF',
                            color: isFinal ? '#FFFFFF' : '#111111',
                            padding: isFinal ? '28px 24px' : '18px 20px',
                            textAlign: isFinal ? 'center' : 'left',
                            boxShadow: isFinal
                              ? '0 8px 28px rgba(212, 175, 55, 0.18), inset 0 0 0 1px rgba(253, 230, 138, 0.22)'
                              : 'none',
                            boxSizing: 'border-box',
                          }}
                        >
                          {/* Top Row: Step Number + Badge */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: isFinal ? 'center' : 'space-between',
                              alignItems: 'center',
                              marginBottom: '8px',
                              gap: '8px',
                            }}
                          >
                            {node.stepNumber && (
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  letterSpacing: '0.06em',
                                  color: '#52525B',
                                }}
                              >
                                STEP {node.stepNumber}
                              </span>
                            )}
                            {node.badge && (
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: isFinal ? 700 : 600,
                                  letterSpacing: isFinal ? '0.08em' : '0.03em',
                                  padding: isFinal ? '4px 12px' : '2px 8px',
                                  borderRadius: '999px',
                                  border: isFinal
                                    ? '1px solid #F59E0B'
                                    : isHuman
                                    ? '1px solid #111111'
                                    : '1px solid #D4D4D8',
                                  background: isFinal
                                    ? 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 55%, #D97706 100%)'
                                    : isHuman
                                    ? '#111111'
                                    : '#F4F4F5',
                                  color: isFinal ? '#111111' : isHuman ? '#FFFFFF' : '#111111',
                                  boxShadow: isFinal ? '0 2px 10px rgba(245, 158, 11, 0.4)' : 'none',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {node.badge}
                              </span>
                            )}
                          </div>

                          {/* Golden Wings Emblem for Final Golden Template */}
                          {isFinal && (
                            <div
                              aria-label="Golden Wings"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                margin: '18px 0 16px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '58px',
                                  lineHeight: 1,
                                  filter:
                                    'sepia(1) saturate(5.5) hue-rotate(5deg) brightness(1.1) drop-shadow(0 4px 14px rgba(245, 158, 11, 0.55))',
                                  display: 'inline-block',
                                  transform: 'scaleX(-1)',
                                }}
                              >
                                🪽
                              </span>
                              <span
                                style={{
                                  fontSize: '58px',
                                  lineHeight: 1,
                                  filter:
                                    'sepia(1) saturate(5.5) hue-rotate(5deg) brightness(1.1) drop-shadow(0 4px 14px rgba(245, 158, 11, 0.55))',
                                  display: 'inline-block',
                                }}
                              >
                                🪽
                              </span>
                            </div>
                          )}

                          {/* Node Title & Subtitle */}
                          <div
                            style={{
                              fontSize: isFinal ? '22px' : '15px',
                              fontWeight: isFinal ? 700 : 600,
                              lineHeight: isFinal ? 1.2 : 1.3,
                              letterSpacing: isFinal ? '-0.02em' : '-0.01em',
                              color: isFinal ? '#FDE68A' : '#111111',
                              marginBottom: isFinal ? '8px' : 0,
                            }}
                          >
                            {node.title}
                          </div>
                          {node.subtitle && (
                            <div
                              style={{
                                fontSize: isFinal ? '13px' : '12px',
                                fontWeight: isFinal ? 500 : 400,
                                color: isFinal ? '#E4E4E7' : '#52525B',
                                marginTop: isFinal ? 0 : '3px',
                              }}
                            >
                              {node.subtitle}
                            </div>
                          )}

                          {/* Optional Quote Header Label */}
                          {node.quoteLabel && (
                            <div
                              style={{
                                marginTop: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#52525B',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {node.quoteLabel}
                            </div>
                          )}

                          {/* Prompt Quote(s) */}
                          {node.quote && (
                            <div
                              style={{
                                marginTop: '6px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #E4E4E7',
                                backgroundColor: '#FAFAFA',
                                fontSize: '12.5px',
                                fontWeight: 500,
                                lineHeight: 1.45,
                                color: '#111111',
                              }}
                            >
                              {node.quote}
                            </div>
                          )}
                          {node.quotes &&
                            node.quotes.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                style={{
                                  marginTop: '6px',
                                  padding: '10px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #E4E4E7',
                                  backgroundColor: '#FAFAFA',
                                  fontSize: '12.5px',
                                  fontWeight: 500,
                                  lineHeight: 1.45,
                                  color: '#111111',
                                }}
                              >
                                {q}
                              </div>
                            ))}

                          {/* Bullet Items */}
                          {node.items && node.items.length > 0 && (
                            <div
                              style={{
                                marginTop: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                borderTop: isFinal ? '1px solid #27272A' : '1px solid #E4E4E7',
                                paddingTop: '12px',
                              }}
                            >
                              {node.items.map((item, idx) => (
                                <div key={idx} style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      color: isFinal ? '#FFFFFF' : '#111111',
                                    }}
                                  >
                                    {item.label}
                                  </div>
                                  {item.detail && (
                                    <div
                                      style={{
                                        fontSize: '12px',
                                        color: isFinal ? '#D4D4D8' : '#52525B',
                                        marginTop: '2px',
                                      }}
                                    >
                                      {item.detail}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Sub-Boxes */}
                          {node.subBoxes && node.subBoxes.length > 0 && (
                            <div
                              style={{
                                marginTop: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                              }}
                            >
                              {node.subBoxes.map((sub, sIdx) => (
                                <div
                                  key={sIdx}
                                  style={{
                                    borderRadius: '8px',
                                    border: '1px solid #D4D4D8',
                                    backgroundColor: '#FFFFFF',
                                    padding: '10px 12px',
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color: '#111111',
                                      marginBottom: '6px',
                                    }}
                                  >
                                    {sub.title}
                                  </div>
                                  <ul
                                    style={{
                                      margin: 0,
                                      paddingLeft: '16px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                    }}
                                  >
                                    {sub.items.map((line, lIdx) => (
                                      <li
                                        key={lIdx}
                                        style={{
                                          fontSize: '12px',
                                          lineHeight: 1.4,
                                          color: '#3F3F46',
                                        }}
                                      >
                                        {line}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Vertical Arrow between nodes in the same column */}
                        {nodeIndex < col.nodes.length - 1 && <DownArrow />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Horizontal Arrow Connector between columns */}
              {colIndex < WORKFLOW_COLUMNS.length - 1 && <RightConnector />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JetskiWorkflowDiagram;
