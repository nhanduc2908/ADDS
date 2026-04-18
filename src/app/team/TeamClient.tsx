"use client";

import { useState } from "react";
import Link from "next/link";
import { clientLogout } from "@/lib/client-utils";

const teamMembers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@security.vn",
    role: "Security Analyst",
    department: "Technical Security",
    status: "active",
    joinDate: "2024-01-15",
    avatar: "👨‍💻",
    skills: ["Penetration Testing", "Vulnerability Assessment", "Network Security"],
    certifications: ["CEH", "OSCP", "CISSP"],
    projects: 12,
    compliance: 95
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@security.vn",
    role: "Compliance Officer",
    department: "Regulatory Compliance",
    status: "active",
    joinDate: "2024-03-20",
    avatar: "👩‍💼",
    skills: ["GDPR", "ISO 27001", "Risk Assessment"],
    certifications: ["CISA", "CRISC"],
    projects: 8,
    compliance: 98
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    email: "cuong.le@security.vn",
    role: "Penetration Tester",
    department: "Technical Security",
    status: "active",
    joinDate: "2024-02-10",
    avatar: "🧑‍💻",
    skills: ["Web Application Security", "Mobile Security", "API Testing"],
    certifications: ["OSCP", "OSWE"],
    projects: 15,
    compliance: 92
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    email: "dung.pham@security.vn",
    role: "Risk Analyst",
    department: "Risk Management",
    status: "active",
    joinDate: "2024-04-05",
    avatar: "👩‍🔬",
    skills: ["Risk Modeling", "Threat Intelligence", "Incident Response"],
    certifications: ["CRISC", "CISM"],
    projects: 6,
    compliance: 96
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    email: "em.hoang@security.vn",
    role: "Security Engineer",
    department: "Infrastructure Security",
    status: "on-leave",
    joinDate: "2024-01-08",
    avatar: "👨‍🔧",
    skills: ["Cloud Security", "DevSecOps", "SIEM"],
    certifications: ["AWS Security", "CCSP"],
    projects: 10,
    compliance: 90
  }
];

const departments = ["All", "Technical Security", "Regulatory Compliance", "Risk Management", "Infrastructure Security"];

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
}

export default function TeamPage({ user }: { user: { id: number; email: string; name: string; role: string } }) {
  const [dark, setDark] = useState(getInitialTheme());
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesDepartment = selectedDepartment === "All" || member.department === selectedDepartment;
    const matchesSearch = searchTerm === "" ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === "active").length,
    avgCompliance: Math.round(teamMembers.reduce((sum, m) => sum + m.compliance, 0) / teamMembers.length),
    totalProjects: teamMembers.reduce((sum, m) => sum + m.projects, 0)
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              ← Quay lại
            </Link>
            <h1 className="text-xl font-bold">Quản lý đội ngũ</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <span className={`px-2 py-1 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200`}>
              MANAGER
            </span>
            <span className="text-slate-600 dark:text-slate-400">{user.name}</span>
            <form action={clientLogout}>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Tổng thành viên</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Tuân thủ TB</p>
                <p className="text-2xl font-bold text-blue-400">{stats.avgCompliance}%</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Tổng dự án</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalProjects}</p>
              </div>
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Tìm kiếm thành viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Thêm thành viên
            </button>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-3xl">{member.avatar}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{member.role}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{member.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      member.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' :
                      'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                    }`}>
                      {member.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                    <span className="text-xs text-slate-500">Joined {member.joinDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kỹ năng</p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs rounded text-slate-700 dark:text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chứng chỉ</p>
                  <div className="flex flex-wrap gap-1">
                    {member.certifications.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-xs rounded text-blue-700 dark:text-blue-300">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{member.projects}</p>
                    <p className="text-xs text-slate-500">Dự án</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{member.compliance}%</p>
                    <p className="text-xs text-slate-500">Tuân thủ</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{member.department.split(' ')[0]}</p>
                    <p className="text-xs text-slate-500">Bộ phận</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Không tìm thấy thành viên nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </main>
    </div>
  );
}