import type { Threat, TrainingModule, Device, Notification, AuditLog, Vulnerability, ComplianceFramework } from "./types";

export const THREATS: Threat[] = [
  { id: "T-001", name: "Ransomware", category: "Malware", severity: "critical", description: "Mã độc tống tiền mã hóa dữ liệu và yêu cầu tiền chuộc", mitigation: "Sao lưu thường xuyên, cập nhật hệ thống, đào tạo nhân viên", relatedCriteriaIds: ["CR-061", "CR-062", "CR-063"] },
  { id: "T-002", name: "Phishing", category: "Social Engineering", severity: "high", description: "Lừa đảo qua email giả mạo để lấy thông tin đăng nhập", mitigation: "Lọc email, đào tạo nhận diện, MFA", relatedCriteriaIds: ["CR-001", "CR-097"] },
  { id: "T-003", name: "SQL Injection", category: "Application Attack", severity: "critical", description: "Chèn mã SQL độc hại qua đầu vào ứng dụng", mitigation: "Prepared statements, WAF, input validation", relatedCriteriaIds: ["CR-053", "CR-054"] },
  { id: "T-004", name: "DDoS Attack", category: "Network Attack", severity: "high", description: "Tấn công từ chối dịch vụ làm hệ thống quá tải", mitigation: "CDN, DDoS protection service, traffic filtering", relatedCriteriaIds: ["CR-022", "CR-023"] },
  { id: "T-005", name: "Insider Threat", category: "Internal", severity: "high", description: "Nhân viên hoặc đối tác gây tổn hại cố ý hoặc vô ý", mitigation: "Kiểm soát truy cập, giám sát, phân tách nhiệm vụ", relatedCriteriaIds: ["CR-091", "CR-092"] },
  { id: "T-006", name: "Zero-Day Exploit", category: "Vulnerability", severity: "critical", description: "Khai thác lỗ hổng chưa có bản vá", mitigation: "Patch management, virtual patching, threat intelligence", relatedCriteriaIds: ["CR-057", "CR-058"] },
  { id: "T-007", name: "Man-in-the-Middle", category: "Network Attack", severity: "high", description: "Nghe lén và sửa đổi dữ liệu truyền tải", mitigation: "TLS, certificate pinning, HSTS", relatedCriteriaIds: ["CR-034", "CR-035"] },
  { id: "T-008", name: "Supply Chain Attack", category: "Supply Chain", severity: "critical", description: "Xâm nhập qua nhà cung cấp hoặc thư viện phần mềm", mitigation: "Đánh giá vendor, dependency scanning, code signing", relatedCriteriaIds: ["CR-057", "CR-191"] },
  { id: "T-009", name: "Credential Stuffing", category: "Authentication", severity: "high", description: "Sử dụng thông tin đăng nhập bị rò rỉ từ vi phạm khác", mitigation: "MFA, password policy, rate limiting", relatedCriteriaIds: ["CR-001", "CR-002"] },
  { id: "T-010", name: "Cryptojacking", category: "Malware", severity: "medium", description: "Sử dụng tài nguyên hệ thống để đào tiền mã hóa", mitigation: "Endpoint protection, network monitoring, resource monitoring", relatedCriteriaIds: ["CR-023", "CR-161"] },
  { id: "T-011", name: "Advanced Persistent Threat", category: "APT", severity: "critical", description: "Tấn công có chủ đích kéo dài từ nhóm hacker có tổ chức", mitigation: "Threat intelligence, network segmentation, endpoint detection", relatedCriteriaIds: ["CR-024", "CR-068"] },
  { id: "T-012", name: "Cross-Site Scripting", category: "Application Attack", severity: "high", description: "Chèn mã JavaScript độc hại vào trang web", mitigation: "Output encoding, CSP headers, input validation", relatedCriteriaIds: ["CR-055", "CR-053"] },
  { id: "T-013", name: "Data Breach", category: "Data", severity: "critical", description: "Truy cập trái phép và rò rỉ dữ liệu nhạy cảm", mitigation: "Mã hóa, DLP, kiểm soát truy cập", relatedCriteriaIds: ["CR-031", "CR-032"] },
  { id: "T-014", name: "Privilege Escalation", category: "Access Control", severity: "critical", description: "Nâng cấp quyền truy cập trái phép lên đặc quyền cao hơn", mitigation: "Least privilege, PAM, regular access review", relatedCriteriaIds: ["CR-003", "CR-010"] },
  { id: "T-015", name: "DNS Poisoning", category: "Network Attack", severity: "high", description: "Làm sai lệch phân giải DNS dẫn người dùng đến trang giả mạo", mitigation: "DNSSEC, DNS monitoring, secure DNS resolver", relatedCriteriaIds: ["CR-025", "CR-030"] },
  { id: "T-016", name: "Business Email Compromise", category: "Social Engineering", severity: "critical", description: "Giả mạo email doanh nghiệp để lừa đảo chuyển tiền", mitigation: "Xác minh yêu cầu, email authentication, employee training", relatedCriteriaIds: ["CR-097", "CR-098"] },
  { id: "T-017", name: "API Abuse", category: "Application Attack", severity: "high", description: "Lạm dụng API để truy cập trái phép hoặc DoS", mitigation: "Rate limiting, API authentication, request validation", relatedCriteriaIds: ["CR-056", "CR-057"] },
  { id: "T-018", name: "Watering Hole Attack", category: "APT", severity: "high", description: "Xâm nhập qua website thường được truy cập bởi mục tiêu", mitigation: "Web filtering, endpoint protection, traffic monitoring", relatedCriteriaIds: ["CR-024", "CR-068"] },
];

export const TRAINING_MODULES: TrainingModule[] = [
  { id: "TM-001", title: "Nhận thức bảo mật cơ bản", description: "Kiến thức cơ bản về bảo mật thông tin cho nhân viên", duration: "2 giờ", difficulty: "beginner", completed: true, relatedDomainIds: ["hr-security", "access-control"] },
  { id: "TM-002", title: "Phòng chống lừa đảo", description: "Nhận diện và phòng tránh các cuộc tấn công phishing", duration: "1.5 giờ", difficulty: "beginner", completed: true, relatedDomainIds: ["hr-security"] },
  { id: "TM-003", title: "Bảo mật mật khẩu", description: "Thực hành tạo và quản lý mật khẩu an toàn", duration: "1 giờ", difficulty: "beginner", completed: false, relatedDomainIds: ["access-control"] },
  { id: "TM-004", title: "Bảo mật dữ liệu cá nhân", description: "Hiểu và tuân thủ quy định bảo vệ dữ liệu cá nhân", duration: "2 giờ", difficulty: "intermediate", completed: false, relatedDomainIds: ["data-protection", "compliance-legal"] },
  { id: "TM-005", title: "An toàn khi làm việc từ xa", description: "Thực hành bảo mật khi làm việc từ xa và sử dụng VPN", duration: "1.5 giờ", difficulty: "beginner", completed: true, relatedDomainIds: ["access-control", "network-security"] },
  { id: "TM-006", title: "Bảo mật ứng dụng web", description: "OWASP Top 10 và cách phòng tránh", duration: "4 giờ", difficulty: "advanced", completed: false, relatedDomainIds: ["application-security"] },
  { id: "TM-007", title: "Ứng phó sự cố", description: "Quy trình phát hiện và ứng phó sự cố bảo mật", duration: "3 giờ", difficulty: "intermediate", completed: false, relatedDomainIds: ["incident-management"] },
  { id: "TM-008", title: "Bảo mật đám mây", description: "Thực hành bảo mật tốt nhất cho AWS/Azure/GCP", duration: "3 giờ", difficulty: "advanced", completed: false, relatedDomainIds: ["cloud-security"] },
  { id: "TM-009", title: "Mã hóa và quản lý khóa", description: "Hiểu về mã hóa đối xứng, bất đối xứng và quản lý khóa", duration: "2.5 giờ", difficulty: "intermediate", completed: false, relatedDomainIds: ["crypto-management", "data-protection"] },
  { id: "TM-010", title: "Tuân thủ ISO 27001", description: "Hướng dẫn thực hành tuân thủ tiêu chuẩn ISO 27001", duration: "4 giờ", difficulty: "advanced", completed: false, relatedDomainIds: ["compliance-legal", "security-governance"] },
  { id: "TM-011", title: "An ninh mạng cơ bản", description: "Tổng quan về an ninh mạng và các mối đe dọa", duration: "2 giờ", difficulty: "beginner", completed: true, relatedDomainIds: ["network-security"] },
  { id: "TM-012", title: "Bảo mật thiết bị di động", description: "Bảo mật smartphone và tablet trong doanh nghiệp", duration: "1.5 giờ", difficulty: "beginner", completed: false, relatedDomainIds: ["mobile-security"] },
];

export const DEVICES: Device[] = [
  { id: "D-001", name: "Web Server 01", type: "Server", status: "secure", lastScan: "2026-04-07T08:00:00Z", vulnerabilities: 0, os: "Ubuntu 22.04", ip: "10.0.1.10" },
  { id: "D-002", name: "Database Server", type: "Server", status: "warning", lastScan: "2026-04-07T07:30:00Z", vulnerabilities: 2, os: "CentOS 8", ip: "10.0.1.20" },
  { id: "D-003", name: "Mail Server", type: "Server", status: "secure", lastScan: "2026-04-07T08:15:00Z", vulnerabilities: 0, os: "Debian 12", ip: "10.0.1.30" },
  { id: "D-004", name: "CEO Laptop", type: "Endpoint", status: "secure", lastScan: "2026-04-07T09:00:00Z", vulnerabilities: 0, os: "Windows 11", ip: "10.0.2.101" },
  { id: "D-005", name: "Dev Workstation 03", type: "Endpoint", status: "warning", lastScan: "2026-04-06T16:00:00Z", vulnerabilities: 3, os: "macOS 15", ip: "10.0.2.103" },
  { id: "D-006", name: "Firewall Edge", type: "Network", status: "secure", lastScan: "2026-04-07T06:00:00Z", vulnerabilities: 0, os: "FortiOS 7.4", ip: "10.0.0.1" },
  { id: "D-007", name: "Core Switch", type: "Network", status: "secure", lastScan: "2026-04-07T06:30:00Z", vulnerabilities: 0, os: "IOS-XE 17.9", ip: "10.0.0.2" },
  { id: "D-008", name: "IoT Sensor 01", type: "IoT", status: "critical", lastScan: "2026-04-04T10:00:00Z", vulnerabilities: 5, os: "Embedded Linux", ip: "10.0.5.10" },
  { id: "D-009", name: "Cloud Instance AWS-1", type: "Cloud", status: "secure", lastScan: "2026-04-07T10:00:00Z", vulnerabilities: 0, os: "Amazon Linux 2023", ip: "172.31.10.100" },
  { id: "D-010", name: "Mobile Device - Sales Team", type: "Mobile", status: "warning", lastScan: "2026-04-06T12:00:00Z", vulnerabilities: 1, os: "Android 15", ip: "N/A" },
  { id: "D-011", name: "Application Server", type: "Server", status: "secure", lastScan: "2026-04-07T07:00:00Z", vulnerabilities: 0, os: "Ubuntu 22.04", ip: "10.0.1.15" },
  { id: "D-012", name: "Backup Server", type: "Server", status: "secure", lastScan: "2026-04-07T02:00:00Z", vulnerabilities: 0, os: "Rocky Linux 9", ip: "10.0.1.25" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "N-001", title: "Phát hiện lỗ hổng nghiêm trọng", message: "CVE-2026-1234 ảnh hưởng đến Database Server. Cần cập nhật ngay.", type: "critical", read: false, createdAt: "2026-04-07T15:30:00Z", relatedId: "D-002" },
  { id: "N-002", title: "Cập nhật chính sách bảo mật", message: "Chính sách mật khẩu mới đã được phê duyệt và có hiệu lực từ 01/04/2026.", type: "info", read: true, createdAt: "2026-04-01T09:00:00Z" },
  { id: "N-003", title: "Thiết bị IoT cần chú ý", message: "IoT Sensor 01 có 5 lỗ hổng chưa được vá.", type: "critical", read: false, createdAt: "2026-04-06T14:00:00Z", relatedId: "D-008" },
  { id: "N-004", title: "Đánh giá ISO 27001 sắp tới", message: "Đợt đánh giá ISO 27001 dự kiến vào 15/04/2026. Vui lòng chuẩn bị.", type: "warning", read: false, createdAt: "2026-04-05T10:00:00Z" },
  { id: "N-005", title: "Nhân viên hoàn thành đào tạo", message: "85% nhân viên đã hoàn thành khóa Đào tạo nhận thức bảo mật.", type: "success", read: true, createdAt: "2026-04-04T16:00:00Z" },
  { id: "N-006", title: "Phát hiện truy cập bất thường", message: "Đăng nhập từ địa điểm bất thường cho tài khoản admin@company.com.", type: "warning", read: false, createdAt: "2026-04-07T18:45:00Z" },
  { id: "N-007", title: "Backup hoàn tất", message: "Sao lưu hàng ngày hoàn tất thành công lúc 02:00 AM.", type: "success", read: true, createdAt: "2026-04-07T02:05:00Z" },
  { id: "N-008", title: "Chứng chỉ SSL sắp hết hạn", message: "Chứng chỉ SSL của mail.company.com hết hạn sau 14 ngày.", type: "warning", read: false, createdAt: "2026-04-06T08:00:00Z" },
  { id: "N-009", title: "Quét bảo mật hoàn tất", message: "Quét bảo mật định kỳ hoàn tất. 12 thiết bị an toàn, 2 cảnh báo.", type: "success", read: true, createdAt: "2026-04-07T08:30:00Z" },
  { id: "N-010", title: "Cập nhật hệ thống", message: "Cập nhật bảo mật Ubuntu available cho 5 servers.", type: "info", read: false, createdAt: "2026-04-07T10:00:00Z" },
];

export const VULNERABILITIES: Vulnerability[] = [
  { id: "VUL-001", cveId: "CVE-2026-1234", title: "Remote Code Execution in Database", severity: "critical", cvss: 9.8, affectedAsset: "Database Server", status: "open", discoveredAt: "2026-04-01T10:00:00Z", dueDate: "2026-04-08", assignedTo: "IT Security Team" },
  { id: "VUL-002", cveId: "CVE-2026-1235", title: "Privilege Escalation in Application", severity: "high", cvss: 7.5, affectedAsset: "Application Server", status: "in-progress", discoveredAt: "2026-04-03T14:00:00Z", dueDate: "2026-04-15", assignedTo: "DevOps Team" },
  { id: "VUL-003", cveId: "CVE-2026-1236", title: "SQL Injection in Web Portal", severity: "critical", cvss: 9.1, affectedAsset: "Web Server 01", status: "open", discoveredAt: "2026-04-05T09:00:00Z", dueDate: "2026-04-10", assignedTo: "Development Team" },
  { id: "VUL-004", cveId: "CVE-2026-1237", title: "Outdated OpenSSL Library", severity: "medium", cvss: 6.8, affectedAsset: "Mail Server", status: "remediated", discoveredAt: "2026-03-28T11:00:00Z", dueDate: "2026-04-05", assignedTo: "System Admin" },
  { id: "VUL-005", cveId: "CVE-2026-1238", title: "Weak Cipher Configuration", severity: "high", cvss: 7.2, affectedAsset: "Firewall Edge", status: "in-progress", discoveredAt: "2026-04-02T16:00:00Z", dueDate: "2026-04-12", assignedTo: "Network Team" },
  { id: "VUL-006", cveId: "CVE-2026-1239", title: "Default Credentials IoT Device", severity: "critical", cvss: 9.0, affectedAsset: "IoT Sensor 01", status: "open", discoveredAt: "2026-04-04T08:00:00Z", dueDate: "2026-04-07", assignedTo: "IoT Team" },
  { id: "VUL-007", cveId: "CVE-2026-1240", title: "Missing Security Headers", severity: "low", cvss: 3.5, affectedAsset: "Web Server 01", status: "remediated", discoveredAt: "2026-03-30T10:00:00Z", dueDate: "2026-04-06", assignedTo: "Development Team" },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: "LOG-001", action: "User Login", user: "admin@company.com", ip: "10.0.2.101", timestamp: "2026-04-07T09:15:00Z", status: "success", details: "Successful login via MFA" },
  { id: "LOG-002", action: "Password Changed", user: "user@company.com", ip: "10.0.2.105", timestamp: "2026-04-07T08:30:00Z", status: "success", details: "Password changed by user" },
  { id: "LOG-003", action: "File Access", user: "finance@company.com", ip: "10.0.2.110", timestamp: "2026-04-07T07:45:00Z", status: "warning", details: "Access to sensitive financial data" },
  { id: "LOG-004", action: "Failed Login Attempt", user: "unknown", ip: "192.168.1.100", timestamp: "2026-04-07T06:20:00Z", status: "failure", details: "5 failed attempts, account locked" },
  { id: "LOG-005", action: "Configuration Change", user: "sysadmin@company.com", ip: "10.0.1.5", timestamp: "2026-04-06T22:00:00Z", status: "success", details: "Firewall rule modified" },
  { id: "LOG-006", action: "Data Export", user: "hr@company.com", ip: "10.0.2.115", timestamp: "2026-04-06T16:30:00Z", status: "success", details: "Employee data exported" },
  { id: "LOG-007", action: "Privilege Escalation", user: "dev@company.com", ip: "10.0.2.103", timestamp: "2026-04-06T14:00:00Z", status: "warning", details: "Elevated to admin privileges" },
  { id: "LOG-008", action: "System Update", user: "system", ip: "N/A", timestamp: "2026-04-07T02:00:00Z", status: "success", details: "Security patches applied to 5 servers" },
];

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  { id: "CF-001", name: "ISO 27001", status: "in-progress", lastAudit: "2026-01-15", nextAudit: "2026-04-15", score: 78, findings: 12, criticalFindings: 2 },
  { id: "CF-002", name: "SOC 2 Type II", status: "compliant", lastAudit: "2026-02-20", nextAudit: "2027-02-20", score: 92, findings: 3, criticalFindings: 0 },
  { id: "CF-003", name: "PCI DSS", status: "compliant", lastAudit: "2026-03-01", nextAudit: "2027-03-01", score: 95, findings: 1, criticalFindings: 0 },
  { id: "CF-004", name: "GDPR", status: "partial", lastAudit: "2025-12-10", nextAudit: "2026-06-10", score: 68, findings: 8, criticalFindings: 1 },
  { id: "CF-005", name: "Nghị định 13", status: "in-progress", lastAudit: "2026-02-01", nextAudit: "2026-05-01", score: 72, findings: 5, criticalFindings: 0 },
  { id: "CF-006", name: "NIST CSF", status: "partial", lastAudit: "2026-01-20", nextAudit: "2026-07-20", score: 74, findings: 6, criticalFindings: 1 },
];
