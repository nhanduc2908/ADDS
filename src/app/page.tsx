"use client";

import { useState, useCallback } from "react";
import { CRITERIA, DOMAINS } from "@/lib/data";
import { generateSampleAssessment, calculateOverallScore, calculateDomainScores, createAssessmentFile } from "@/lib/utils";
import type { Assessment, AssessmentFile, TabId } from "@/lib/types";

import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { AssessmentTab } from "@/components/tabs/AssessmentTab";
import { FileManagerTab } from "@/components/tabs/FileManagerTab";
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

function createDefaultAssessment(): Assessment {
  const a = generateSampleAssessment(CRITERIA);
  a.domainScores = calculateDomainScores(a.results, CRITERIA, DOMAINS);
  a.overallScore = calculateOverallScore(a.results);
  return a;
}

function createDefaultFiles(): AssessmentFile[] {
  const systems = [
    { name: "Hệ thống ERP", desc: "Hệ thống hoạch định nguồn lực doanh nghiệp", tags: ["production", "critical"] },
    { name: "Website chính", desc: "Cổng thông tin điện tử công khai", tags: ["web", "external"] },
    { name: "Cơ sở dữ liệu khách hàng", desc: "Hệ thống CSDL chứa thông tin KH", tags: ["database", "pii"] },
  ];
  return systems.map((s) => {
    const f = createAssessmentFile(s.name, s.desc, s.tags);
    const assessed = Math.floor(Math.random() * 150);
    f.assessment.results = f.assessment.results.map((r, i) => {
      if (i < assessed) {
        const score = Math.floor(Math.random() * 6) as 0 | 1 | 2 | 3 | 4 | 5;
        return {
          ...r,
          score,
          status: score >= 4 ? "compliant" : score >= 2 ? "partial" : score >= 1 ? "non-compliant" : "not-assessed",
          notes: score < 3 ? "Can cai thien" : "",
        };
      }
      return r;
    });
    f.assessment.domainScores = calculateDomainScores(f.assessment.results, CRITERIA, DOMAINS);
    f.assessment.overallScore = calculateOverallScore(f.assessment.results);
    const pct = (assessed / f.assessment.results.length) * 100;
    f.status = pct === 0 ? "draft" : pct < 100 ? "in-progress" : "completed";
    return f;
  });
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [files, setFiles] = useState<AssessmentFile[]>(createDefaultFiles);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || null;
  const assessment = activeFile?.assessment || files[0]?.assessment || createDefaultAssessment();

  const updateActiveFileAssessment = useCallback(
    (updatedAssessment: Assessment) => {
      if (!activeFileId) return;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === activeFileId
            ? {
                ...f,
                assessment: updatedAssessment,
                updatedAt: new Date().toISOString(),
                status:
                  updatedAssessment.results.every((r) => r.status !== "not-assessed")
                    ? "completed"
                    : updatedAssessment.results.some((r) => r.status !== "not-assessed")
                    ? "in-progress"
                    : "draft",
              }
            : f
        )
      );
    },
    [activeFileId]
  );

  const handleUpdateResult = useCallback(
    (criterionId: string, score: number, status: string, notes: string) => {
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
        updateActiveFileAssessment(updated);
      }
    },
    [assessment, updateActiveFileAssessment]
  );

  const handleImport = useCallback(
    (imported: Assessment) => {
      imported.domainScores = calculateDomainScores(imported.results, CRITERIA, DOMAINS);
      imported.overallScore = calculateOverallScore(imported.results);
      if (activeFileId) {
        updateActiveFileAssessment(imported);
      } else {
        const newFile = createAssessmentFile("Hệ thống nhập", "Nhập từ file", ["imported"]);
        newFile.assessment = imported;
        newFile.name = imported.name || "Đánh giá nhập";
        newFile.status = "in-progress";
        setFiles((prev) => [newFile, ...prev]);
        setActiveFileId(newFile.id);
      }
      setActiveTab("overview");
    },
    [activeFileId, updateActiveFileAssessment]
  );

  const handleCreateFile = useCallback((file: AssessmentFile) => {
    setFiles((prev) => [file, ...prev]);
    setActiveFileId(file.id);
    setActiveTab("assessment");
  }, []);

  const handleLoadFile = useCallback((fileId: string) => {
    setActiveFileId(fileId);
    setActiveTab("assessment");
  }, []);

  const handleDeleteFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setActiveFileId((prev) => (prev === fileId ? null : prev));
  }, []);

  const handleRenameFile = useCallback((fileId: string, name: string, systemName: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, name, systemName, updatedAt: new Date().toISOString() } : f
      )
    );
  }, []);

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
      case "files":
        return (
          <FileManagerTab
            files={files}
            activeFileId={activeFileId}
            onCreateFile={handleCreateFile}
            onLoadFile={handleLoadFile}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
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
        return <CompareTab files={files} />;
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
        activeFileName={activeFile?.systemName || null}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {renderTab()}
      </main>
      <RightSidebar assessment={assessment} activeFile={activeFile} />
    </div>
  );
}
