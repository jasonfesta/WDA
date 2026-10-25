export type CheckStatus = 'passed' | 'hold' | 'running';
export type EnvironmentState = 'Validated' | 'Window reserved' | 'Active soak' | 'Drifting';
export type ReleaseOverallState = 'AWAITING APPROVAL' | 'APPROVED & LOCKED' | 'ROLLOUT ACTIVE' | 'ROLLED BACK';
export type ViewMode = 'landing' | 'app' | 'component' | 'simulator';

export interface CheckItem {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'governance' | 'health' | 'infrastructure';
  status: CheckStatus;
  validator: string;
  timestamp: string;
  latencyMs: number;
  logTrace: string[];
  evidenceDetails: {
    signer?: string;
    commitSha?: string;
    prUrl?: string;
    scenariosPassed?: string;
    coveragePct?: number;
    auditRef?: string;
  };
}

export interface ApprovalItem {
  id: string;
  name: string;
  role: string;
  initials: string;
  status: 'approved' | 'pending' | 'rejected';
  timestamp: string;
  hashSignature?: string;
}

export interface EnvironmentModel {
  id: string;
  name: string;
  cluster: string;
  region: string;
  currentVersion: string;
  proposedVersion: string;
  state: EnvironmentState;
  healthPercent: number;
  latencyP99: number;
  errorRate: number;
  nodesCount: number;
  trafficWeight: number; // percentage
  isCanary?: boolean;
}

export interface ReleaseModel {
  id: string;
  service: string;
  version: string;
  previousVersion: string;
  windowDate: string;
  windowTime: string;
  timezone: string;
  reviewTime: string;
  status: ReleaseOverallState;
  environments: EnvironmentModel[];
  checks: CheckItem[];
  approvals: ApprovalItem[];
  notes: string;
}

export interface RollbackSimulationState {
  isActive: boolean;
  stage: 'idle' | 'anomaly_detected' | 'draining' | 'reverting' | 'restored';
  anomalyMetric: string;
  syntheticP99: number;
  syntheticErrorRate: number;
  drainedTrafficPct: number;
  snapshotLog: string[];
}

export interface PermissionsEntry {
  role: string;
  canManage: string;
  canApprove: string;
  notes: string;
}
