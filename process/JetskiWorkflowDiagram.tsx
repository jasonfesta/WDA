import React from 'react';

export interface WorkflowNodeItem {
  label: string;
  detail?: string;
}

export interface WorkflowNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle?: string;
  badge?: string;
  isHumanCheckpoint?: boolean;
  isFinalOutput?: boolean;
  quote?: string;
  quotes?: string[];
  items?: WorkflowNodeItem[];
  subBoxes?: {
    title: string;
    items: string[];
  }[];
  footerNote?: string;
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
        quote: '"Make me a warm landing page for my new coffee shop and brand"',
      },
      {
        id: 'benchmarking',
        stepNumber: '02',
        title: 'Competitor Research Benchmarking',
        subtitle: 'Voice-generated Markdown artifact',
        badge: '1× research.md',
        quotes: [
          '"Give me 25 examples of coffee shop brands that are modern and popular across Instagram and the social web."',
          '"Keep going in this direction, XYZ brand. Find me more versions of this that have high brand quality, similar photography, and visual direction."',
        ],
        items: [
          {
            label: '1× research.md File (via Voice)',
            detail: 'Top 15–25 websites & apps in the target category',
          },
          {
            label: 'Reference Capture',
            detail: 'Benchmarked by URL + Screenshot (~25 total references)',
          },
          {
            label: 'Dual Evaluation Lens',
            detail: 'Analyzes both Visual Design and Code Interactions',
          },
        ],
        subBoxes: [
          {
            title: 'Future State: Library & Catalog Pull',
            items: [
              'Can pull directly from a pre-indexed library & catalog instead of running in real time',
              'Runs as a hidden instruction in the background to keep references fresh',
            ],
          },
        ],
      },
    ],
  },
  {
    phaseNumber: 'PHASE 02',
    phaseTitle: 'Design Range & MD Artifacts',
    phaseSubtitle: 'Spectrum definition & prompt readiness',
    nodes: [
      {
        id: 'design-range',
        stepNumber: '03',
        title: 'Dynamic Design Range & Charm',
        subtitle: 'Structuring design thinking upfront',
        quote: '"Begin to structure our design range from minimal to opinionated, represented by xyz.com for minimal, xyz.com for structured, and xyz.com for opinionated."',
        subBoxes: [
          {
            title: 'A. Dynamic Design Spectrum',
            items: [
              'Declare full category range from research',
              'e.g., Minimal → Structured → Opinionated',
              'Barbershop e.g.: Minimal → Nostalgic London Burgundy / Elite → Hip-Hop',
            ],
          },
          {
            title: 'B. Interaction & Touch Areas ("Charm")',
            items: [
              'Highlight specific section behaviors & micro-touches to carry into Image Gen',
              'Assign explicit brutal / minimal / interactive moments per section',
            ],
          },
        ],
      },
      {
        id: 'md-artifacts',
        stepNumber: '04',
        title: 'Structured Markdown Files',
        subtitle: 'Roll-over context for Image Gen',
        badge: '1 Main + 5–10 Range .md',
        items: [
          {
            label: '1× Main Agent .md File',
            detail: 'Core architecture, global rules, and interaction specs',
          },
          {
            label: '5–10× Design Range .md Files',
            detail: 'One per category flavor depending on category breadth',
          },
          {
            label: 'Zero Tertiary Research in MGen',
            detail: 'Armed with prompts, model URLs, & code refs to go straight to prompts',
          },
        ],
      },
    ],
  },
  {
    phaseNumber: 'PHASE 03',
    phaseTitle: 'Image Generation (Nano Banana 2)',
    phaseSubtitle: 'Comps, 4K grids, & internal design QA',
    nodes: [
      {
        id: 'imgen-core',
        stepNumber: '05',
        title: 'Iterative Image Generation',
        subtitle: 'Nano Banana 2 Pipeline',
        badge: 'Desktop + Mobile',
        items: [
          {
            label: 'Anchor Screens & Breakpoints',
            detail: 'Generate initial screens, steer against .md files, lock Desktop + Mobile breakpoints',
          },
          {
            label: 'Clone & Full-Site Expansion',
            detail: 'Clone locked anchor → print main sections → generate rest of site + footer (up to 35+ pages)',
          },
          {
            label: 'Output Format (1-by-1 or 4K Grid)',
            detail: 'Image per screen generated individually OR via massive 4K grid split up to save cost',
          },
        ],
      },
      {
        id: 'human-gate-1',
        stepNumber: '06',
        title: 'Human Checkpoint #1: Grid & Comp QA',
        subtitle: 'Internal Design Team Review Surface',
        badge: 'HUMAN GATE',
        isHumanCheckpoint: true,
        items: [
          {
            label: 'Internal Review Page',
            detail: 'Rapid "Yes, yes, yes, looks great" pass across generated screen grids',
          },
          {
            label: 'Prevents Multi-Screen "Slop"',
            detail: 'Catches off-colors or missed direction early before wasting 30+ generated screens',
          },
        ],
        subBoxes: [
          {
            title: 'Drift Resolution & Model Evolution',
            items: [
              'Today: Fill public reference gaps with explicit Visual Ref + Code Snippet + Steering',
              'Over Time: Train skill to predict next spots cleanly from only the first few screens',
            ],
          },
        ],
      },
      {
        id: 'design-package',
        stepNumber: '07',
        title: 'Complete Design Package',
        subtitle: 'Consolidated Markdown & Asset Handoff',
        badge: '1× design-package.md',
        items: [
          {
            label: '1× Complete Design Package .md File',
            detail: 'Unifies all research .md files, code references, breakpoint specs, & approved screen comps',
          },
          {
            label: 'Zero Mid-Build Ad-Hoc Image Gen',
            detail: 'Locks 35+ page architecture before entering the React build phase',
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
        subtitle: 'Markdown-driven skills & checkpoint outputs',
        badge: '1 Pipeline + 3 Skill .md',
        items: [
          {
            label: '1× Image-to-React Pipeline .md File',
            detail: 'Master orchestration spec governing component translation & evaluation',
          },
          {
            label: '3× Skill Definition & Checkpoint .md Files',
            detail: 'Each skill executes from its .md spec and emits a verifiable checkpoint .md artifact',
          },
        ],
        subBoxes: [
          {
            title: 'Skill 01 (.md) — Clean Image-to-React Translation',
            items: ['Direct structural & visual translation from approved screen comps'],
          },
          {
            title: 'Skill 02 (.md) — Cleanup & Eval Benchmarking',
            items: ['Dual verification benchmarked by both Model and Human Reviewer'],
          },
          {
            title: 'Skill 03 (.md) — Viewport & Performance QA',
            items: ['Responsive feel across viewports, 60fps scrolling verification, scroll kits working'],
          },
        ],
      },
      {
        id: 'human-gate-2',
        stepNumber: '09',
        title: 'Human Checkpoint #2: Code Steering',
        subtitle: 'Shareable Artifacts on Core Screens',
        badge: 'HUMAN GATE',
        isHumanCheckpoint: true,
        items: [
          {
            label: 'Artifact Checkpoints',
            detail: 'Each skill emits a verifiable, shareable artifact—critical on core pages before multiplying',
          },
          {
            label: '~3 Steering Moments (First 3–5 Pages)',
            detail: 'First moment designer steers actual code before scaling across the rest of the site',
          },
        ],
        subBoxes: [
          {
            title: 'Two Designer Steering Paths',
            items: [
              'Path A (Correct Drift): Detect where code veered off and revert strictly back to comp',
              'Path B (Capture Serendipity): Model does something cool halfway → "Stop, freeze worktree, analyze, & go forward"',
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
        subtitle: 'Format verification & single-bundle archive',
        badge: '1× bundle.md + .zip',
        items: [
          {
            label: '1× Bundle Manifest & Packaging .md File',
            detail: 'Documents full model-safe structure, lint verification, and file inventory',
          },
          {
            label: 'Lints & Validates for Target Model Format',
            detail: 'Ensures full compliance and safety across the entire codebase',
          },
        ],
        subBoxes: [
          {
            title: 'Single Bundle (.zip) Contents',
            items: [
              'Bundle Manifest .md file',
              'All required website & application pages',
              'All .apx files',
              'All JavaScript / TypeScript (.js / .ts) files',
              'All application & build configuration files',
            ],
          },
        ],
      },
      {
        id: 'golden-template',
        stepNumber: '11',
        title: 'React Golden Template',
        subtitle: 'Final Production & Model-Ready Output',
        badge: 'GOLDEN TEMPLATE',
        isFinalOutput: true,
        items: [
          {
            label: 'Fully Steered, Benchmarked & Packaged',
            detail: 'Ready for model consumption, evaluation, or direct deployment at scale',
          },
        ],
      },
    ],
  },
];

const DownArrow: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
    <svg width="14" height="20" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      width: '24px',
      flexShrink: 0,
      paddingTop: '90px',
    }}
  >
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="10" x2="18" y2="10" stroke="#111111" strokeWidth="1.5" />
      <path d="M14 5.5L19.5 10L14 14.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export const JetskiWorkflowDiagram: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#111111',
        fontFamily: '"Google Sans Flex", "Google Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        minHeight: '100vh',
        padding: '28px 32px 48px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1.5px solid #111111',
          paddingBottom: '24px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#52525B',
              marginBottom: '8px',
            }}
          >
            JETSKI DESIGN WORKFLOW
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              margin: 0,
              color: '#111111',
            }}
          >
            Prompt &amp; Mood Board → React Golden Template
          </h1>
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
            <span>Process / Skill Node</span>
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
            <span>Human Review / Steering Checkpoint</span>
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
          alignItems: 'flex-start',
          width: '100%',
          paddingBottom: '24px',
        }}
      >
        {WORKFLOW_COLUMNS.map((col, colIndex) => (
          <React.Fragment key={col.phaseNumber}>
            {/* Column */}
            <div
              style={{
                flex: '1 1 0%',
                minWidth: 0,
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
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
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
                            ? '2px solid #111111'
                            : isHuman
                            ? '1.75px solid #111111'
                            : '1.25px solid #D4D4D8',
                          backgroundColor: isFinal ? '#111111' : isHuman ? '#FAFAFA' : '#FFFFFF',
                          color: isFinal ? '#FFFFFF' : '#111111',
                          padding: '18px 20px',
                          boxSizing: 'border-box',
                        }}
                      >
                        {/* Top Row: Step Number + Badge */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                            gap: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              letterSpacing: '0.08em',
                              color: isFinal ? '#A1A1AA' : '#52525B',
                            }}
                          >
                            STEP {node.stepNumber}
                          </span>
                          {node.badge && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                letterSpacing: '0.06em',
                                padding: '3px 8px',
                                borderRadius: '999px',
                                border: isFinal
                                  ? '1px solid #3F3F46'
                                  : isHuman
                                  ? '1px solid #111111'
                                  : '1px solid #D4D4D8',
                                backgroundColor: isFinal
                                  ? '#27272A'
                                  : isHuman
                                  ? '#111111'
                                  : '#F4F4F5',
                                color: isFinal || isHuman ? '#FFFFFF' : '#111111',
                              }}
                            >
                              {node.badge}
                            </span>
                          )}
                        </div>

                        {/* Node Title & Subtitle */}
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {node.title}
                        </div>
                        {node.subtitle && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: isFinal ? '#D4D4D8' : '#52525B',
                              marginTop: '3px',
                            }}
                          >
                            {node.subtitle}
                          </div>
                        )}

                        {/* Prompt Quote(s) */}
                        {node.quote && (
                          <div
                            style={{
                              marginTop: '10px',
                              padding: '9px 11px',
                              borderRadius: '7px',
                              border: '1px solid #E4E4E7',
                              backgroundColor: '#FAFAFA',
                              fontSize: '11.5px',
                              fontWeight: 500,
                              lineHeight: 1.4,
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
                                marginTop: qIdx === 0 ? '10px' : '6px',
                                padding: '9px 11px',
                                borderRadius: '7px',
                                border: '1px solid #E4E4E7',
                                backgroundColor: '#FAFAFA',
                                fontSize: '11.5px',
                                fontWeight: 500,
                                lineHeight: 1.4,
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
                                        fontSize: '11.5px',
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
  );
};

export default JetskiWorkflowDiagram;
