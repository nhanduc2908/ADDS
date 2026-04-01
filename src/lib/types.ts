export type RiskLevel = "critical" | "high" | "medium" | "low" | "info";
export type ComplianceStatus = "compliant" | "partial" | "non-compliant" | "not-assessed";
export type AssessmentScore = 0 | 1 | 2 | 3 | 4 | 5;

export interface SecurityDomain {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  criteriaCount: number;
  icon: string;
}

export interface SecurityCriterion {
  id: string;
  domainId: string;
  code: string;
  name: string;
  nameVi: string;
  description: string;
  riskLevel: RiskLevel;
  iso27001Control?: string;
  soc2Criteria?: string;
  weight: number;
}

export interface AssessmentResult {
  criterionId: string;
  score: AssessmentScore;
  status: ComplianceStatus;
  notes: string;
  assessedAt: string;
  assessedBy: string;
}

export interface Assessment {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  results: AssessmentResult[];
  overallScore: number;
  domainScores: Record<string, number>;
}

export interface Threat {
  id: string;
  name: string;
  category: string;
  severity: RiskLevel;
  description: string;
  mitigation: string;
  relatedCriteriaIds: string[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  completed: boolean;
  relatedDomainIds: string[];
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: "secure" | "warning" | "critical" | "unknown";
  lastScan: string;
  vulnerabilities: number;
  os: string;
  ip: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical" | "success";
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface ExportFormat {
  format: "json" | "csv" | "excel" | "txt" | "html" | "pdf";
  label: string;
  icon: string;
}

export type TabId =
  | "overview"
  | "assessment"
  | "compliance"
  | "threats"
  | "training"
  | "devices"
  | "notifications"
  | "reports"
  | "compare"
  | "settings"
  | "help";

export interface Tab {
  id: TabId;
  label: string;
  labelVi: string;
  icon: string;
}
