"use client";

import { useState, useCallback, useMemo } from "react";
import { CRITERIA, DOMAINS } from "@/lib/data";
import { generateSampleAssessment, calculateOverallScore, calculateDomainScores } from "@/lib/utils";
import type { Assessment, TabId } from "@/lib/types";

import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { AssessmentTab } from "@/components/tabs/AssessmentTab";
import { ImportTab } from "@/components/tabs/ImportTab";
import { ComplianceTab } from "@/components/tabs/ComplianceTab";
import { ThreatsTab } from "@/components/tabs/ThreatsTab";
import { TrainingTab } from "@/components/tabs/TrainingTab";
import { DevicesTab } from "@/components/tabs/DevicesTab";
import { NotificationsTab } from "@/components/tabs/NotificationsTab";
import { ReportsTab } from "@/components/tabs/ReportsTab";
import { CompareTab } from "@/components/tabs/CompareTab";
import { SettingsTab } from "@/components/tabs/SettingsTab";
import { HelpTab } from "@/components/tabs/HelpTab";

function createInitialAssessment(): Assessment {
  const a = generateSampleAssessment(CRITERIA);
  a.domainScores = calculateDomainScores(a.results, CRITERIA, DOMAINS);
  a.overallScore = calculateOverallScore(a.results);
  return a;
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [assessment, setAssessment] = useState<Assessment>(createInitialAssessment);

  const handleUpdateResult = useCallback(
    (criterionId: string, score: number, status: string, notes: string) => {
      if (!assessment) return;
      const updated = { ...assessment };
      const idx = updated.results.findIndex((r) => r.criterionId === criterionId);
      if (idx >= 0) {
        updated.results[idx] = {
          ...updated.results[idx],
          score: score as 0 | 1 | 2 | 3 | 4 | 5,
          status: status as "compliant" | "partial" | "non-compliant" | "not-assessed",
          notes,
          assessedAt: new Date().toISOString(),
        };
        updated.domainScores = calculateDomainScores(updated.results, CRITERIA, DOMAINS);
        updated.overallScore = calculateOverallScore(updated.results);
        updated.updatedAt = new Date().toISOString();
        setAssessment(updated);
      }
    },
    [assessment]
  );

  const handleImport = useCallback(
    (imported: Assessment) => {
      imported.domainScores = calculateDomainScores(imported.results, CRITERIA, DOMAINS);
      imported.overallScore = calculateOverallScore(imported.results);
      setAssessment(imported);
      setActiveTab("overview");
    },
    []
  );

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab assessment={assessment} />;
      case "assessment":
        return (
          <AssessmentTab
            assessment={assessment}
            selectedDomain={selectedDomain}
            searchQuery={searchQuery}
            onUpdateResult={handleUpdateResult}
          />
        );
      case "import":
        return <ImportTab onImport={handleImport} />;
      case "compliance":
        return <ComplianceTab />;
      case "threats":
        return <ThreatsTab />;
      case "training":
        return <TrainingTab />;
      case "devices":
        return <DevicesTab />;
      case "notifications":
        return <NotificationsTab />;
      case "reports":
        return <ReportsTab assessment={assessment} />;
      case "compare":
        return <CompareTab />;
      case "settings":
        return <SettingsTab />;
      case "help":
        return <HelpTab />;
      default:
        return <OverviewTab assessment={assessment} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <LeftSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
        assessment={assessment}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {renderTab()}
      </main>
      <RightSidebar assessment={assessment} />
    </div>
  );
}
