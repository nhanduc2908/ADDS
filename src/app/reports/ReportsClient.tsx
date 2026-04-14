import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions";

const sampleReports = [
  { id: 1, name: "Báo cáo đánh giá Q1 2026", type: "Đánh giá bảo mật", date: "2026-03-31", status: "Hoàn thành" },
  { id: 2, name: "Báo cáo quét lỗ hổng tháng 3", type: "Quét lỗ hổng", date: "2026-03-25", status: "Hoàn thành" },
  { id: 3, name: "Báo cáo tuân thủ ISO 27001", type: "Compliance", date: "2026-03-20", status: "Hoàn thành" },
  { id: 4, name: "Báo cáo đánh giá Q2 2026", type: "Đánh giá bảo mật", date: "2026-04-10", status: "Đang tiến hành" },
  { id: 5, name: "Báo cáo rủi ro an ninh mạng", type: "Rủi ro", date: "2026-04-05", status: "Hoàn thành" },
];

const exportFormats = [
  { id: "pdf", name: "PDF", icon: "📄" },
  { id: "excel", name: "Excel", icon: "📊" },
  { id: "word", name: "Word", icon: "📝" },
  { id: "json", name: "JSON", icon: "{}" },
];

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  return saved ? saved === "dark" : true;
}

export default function ReportsClient({ user }: { user: { id: number; email: string; name: string; role: string } }) {
  const [dark, setDark] = useState(getInitialTheme());
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

  const toggleReport = (id: number) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    alert(`Xuất ${selectedReports.length} báo cáo sang định dạng ${selectedFormat.toUpperCase()}`);
  };

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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              ← Quay lại
            </Link>
            <h1 className="text-xl font-bold">Báo cáo</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              user.role === "admin" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200" :
              user.role === "manager" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200" :
              "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
            }`}>
              {user.role.toUpperCase()}
            </span>
            <span className="text-slate-600 dark:text-slate-400">{user.name}</span>
            <form action={logoutAction}>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Xuất báo cáo</h2>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedFormat === format.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-blue-500"
                }`}
              >
                {format.icon} {format.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            disabled={selectedReports.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Xuất báo cáo ({selectedReports.length})
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports(sampleReports.map(r => r.id));
                      } else {
                        setSelectedReports([]);
                      }
                    }}
                    checked={selectedReports.length === sampleReports.length}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Tên báo cáo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Loại</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {sampleReports.map((report) => (
                <tr key={report.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleReport(report.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{report.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{report.type}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{report.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.status === "Hoàn thành" 
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
