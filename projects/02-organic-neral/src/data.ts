export interface EvalCase {
  id: string; // e.g. "043"
  index: number; // 1 to 6
  title: string;
  category: string;
  prompt: string;
  baseline: {
    status: 'accepted' | 'flagged';
    response: string;
    rationale: string;
    latencyMs: number;
    tokens: number;
  };
  candidate: {
    status: 'accepted' | 'flagged';
    response: string;
    rationale: string;
    latencyMs: number;
    tokens: number;
  };
  outcome: 'both_accepted' | 'improved' | 'regressed' | 'both_flagged';
  finding: string;
  severity: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface Reviewer {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  status: 'signed' | 'pending';
  signedAt?: string;
  note?: string;
}

export interface EvalRun {
  id: string; // "EV-024"
  name: string; // "Support answers"
  workspace: string; // "Support lab"
  totalCases: number;
  baselineAccepted: number;
  baselinePercentage: number;
  candidateAccepted: number;
  candidatePercentage: number;
  regressionsCount: number;
  breakdown: {
    bothAccepted: number;
    improved: number;
    regressed: number;
    bothFlagged: number;
  };
}

export const SAMPLE_RUN: EvalRun = {
  id: 'EV-024',
  name: 'Support answers',
  workspace: 'Support lab',
  totalCases: 120,
  baselineAccepted: 96,
  baselinePercentage: 80,
  candidateAccepted: 108,
  candidatePercentage: 90,
  regressionsCount: 6,
  breakdown: {
    bothAccepted: 90, // 75%
    improved: 18,    // 15%
    regressed: 6,     // 5%
    bothFlagged: 6    // 5%
  }
};

export const REGRESSION_CASES: EvalCase[] = [
  {
    id: '043',
    index: 1,
    title: 'Return policy exception',
    category: 'Policy & Terms',
    prompt: 'What is the return window for a final-sale item?',
    baseline: {
      status: 'accepted',
      response: 'Returns are available within 30 days, except final-sale items.',
      rationale: 'Directly stated standard 30-day window while explicitly preserving the final-sale restriction.',
      latencyMs: 340,
      tokens: 28
    },
    candidate: {
      status: 'flagged',
      response: 'Returns are available within 30 days.',
      rationale: 'Omitted the strict restriction on final-sale merchandise, risking customer disputes.',
      latencyMs: 295,
      tokens: 15
    },
    outcome: 'regressed',
    finding: 'Candidate omits the final-sale exception.',
    severity: 'high',
    tags: ['Returns', 'Exceptions', 'Customer Trust']
  },
  {
    id: '058',
    index: 2,
    title: 'Tiered enterprise billing prorate',
    category: 'Billing & Invoicing',
    prompt: 'How is mid-cycle seat subtraction credited on an annual invoice contract?',
    baseline: {
      status: 'accepted',
      response: 'Seats removed mid-cycle generate a prorated credit applied to your next annual renewal invoice, rather than an immediate cash refund.',
      rationale: 'Accurately outlines credit ledger rollover policy per enterprise SLA terms.',
      latencyMs: 410,
      tokens: 34
    },
    candidate: {
      status: 'flagged',
      response: 'We will immediately issue a direct refund to your credit card for the prorated days.',
      rationale: 'Confused enterprise invoice credit account terms with self-serve credit card refunding.',
      latencyMs: 310,
      tokens: 22
    },
    outcome: 'regressed',
    finding: 'Candidate fabricated direct card refunds for contractual invoice accounts.',
    severity: 'high',
    tags: ['Billing', 'Enterprise', 'Proration']
  },
  {
    id: '072',
    index: 3,
    title: 'GDPR subprocessor notification',
    category: 'Compliance & Security',
    prompt: 'How far in advance are customers alerted before a new data subprocessor is onboarded?',
    baseline: {
      status: 'accepted',
      response: 'We provide 30 days advance written notification via email and our Trust portal before authorizing any new subprocessor.',
      rationale: 'Complies with mandatory DPA clause 4.2 timeline requirement.',
      latencyMs: 380,
      tokens: 29
    },
    candidate: {
      status: 'flagged',
      response: 'Subprocessors are updated on our live dashboard concurrently with deployment.',
      rationale: 'Violates legal requirement of 30 days prior written notice.',
      latencyMs: 280,
      tokens: 18
    },
    outcome: 'regressed',
    finding: 'Candidate failed to enforce the mandatory 30-day prior written notification window.',
    severity: 'medium',
    tags: ['GDPR', 'Compliance', 'Subprocessors']
  },
  {
    id: '088',
    index: 4,
    title: 'API rate limit 429 Retry-After header',
    category: 'Developer API',
    prompt: 'What response header indicates when rate limit throttles reset?',
    baseline: {
      status: 'accepted',
      response: 'When receiving HTTP 429, inspect the Retry-After header which returns remaining integer seconds until quota renewal.',
      rationale: 'Correctly identifies Retry-After format and integer seconds unit.',
      latencyMs: 290,
      tokens: 26
    },
    candidate: {
      status: 'flagged',
      response: 'Check the X-RateLimit-Reset-Epoch timestamp in Unix milliseconds format.',
      rationale: 'Referenced nonexistent header key and incorrect timestamp unit.',
      latencyMs: 250,
      tokens: 21
    },
    outcome: 'regressed',
    finding: 'Candidate misquoted header name and timestamp spec.',
    severity: 'medium',
    tags: ['API', 'Rate Limiting', 'Headers']
  },
  {
    id: '101',
    index: 5,
    title: 'Self-hosted SSO SAML certificate rollover',
    category: 'Authentication',
    prompt: 'Can secondary signing certificates be uploaded before primary cert expiry?',
    baseline: {
      status: 'accepted',
      response: 'Yes, Neral supports dual concurrent X.509 certs in your IdP config to enable zero-downtime rollover.',
      rationale: 'Accurately documents dual-certificate verification window.',
      latencyMs: 440,
      tokens: 31
    },
    candidate: {
      status: 'flagged',
      response: 'No, only one active certificate may exist at any moment; previous cert must be deleted first.',
      rationale: 'Would cause unavoidable SSO service interruption during key rotation.',
      latencyMs: 330,
      tokens: 24
    },
    outcome: 'regressed',
    finding: 'Candidate incorrectly claims single-cert limitation, risking auth outages.',
    severity: 'high',
    tags: ['SAML', 'SSO', 'Certificates']
  },
  {
    id: '114',
    index: 6,
    title: 'Custom role permission inheritance',
    category: 'Access Control',
    prompt: 'Do scoped auditor roles inherit export privileges from parent workspace viewer?',
    baseline: {
      status: 'accepted',
      response: 'No, scoped auditor roles are strictly read-only and explicitly restrict dataset CSV/JSON batch exports.',
      rationale: 'Correctly adheres to least-privilege boundary model.',
      latencyMs: 360,
      tokens: 27
    },
    candidate: {
      status: 'flagged',
      response: 'Yes, all child roles inherit standard viewer export capabilities automatically.',
      rationale: 'Accidentally leaks export permissions across audit separation lines.',
      latencyMs: 300,
      tokens: 19
    },
    outcome: 'regressed',
    finding: 'Candidate erroneously granted export permissions to audit scopes.',
    severity: 'medium',
    tags: ['RBAC', 'Permissions', 'Audit']
  }
];

export const INITIAL_REVIEWERS: Reviewer[] = [
  {
    id: 'asha',
    name: 'Asha Ng',
    role: 'Staff Evaluation Engineer',
    avatarInitials: 'AN',
    status: 'signed',
    signedAt: 'Today at 09:14 AM',
    note: 'Baseline comparison verified. Verified 18 improved cases on intent parsing.'
  },
  {
    id: 'leo',
    name: 'Leo Ruiz',
    role: 'Principal Product Lead',
    avatarInitials: 'LR',
    status: 'signed',
    signedAt: 'Today at 10:48 AM',
    note: 'Policy exceptions need careful tracking, but +10pp improvement is decisive.'
  },
  {
    id: 'mina',
    name: 'Mina Shah',
    role: 'Head of AI Alignment (You)',
    avatarInitials: 'MS',
    status: 'pending'
  }
];
