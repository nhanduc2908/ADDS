import type { Threat, TrainingModule, Device, Notification } from "./types";

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
];

export const DEVICES: Device[] = [
  { id: "D-001", name: "Web Server 01", type: "Server", status: "secure", lastScan: "2026-04-01T08:00:00Z", vulnerabilities: 0, os: "Ubuntu 22.04", ip: "10.0.1.10" },
  { id: "D-002", name: "Database Server", type: "Server", status: "warning", lastScan: "2026-04-01T07:30:00Z", vulnerabilities: 2, os: "CentOS 8", ip: "10.0.1.20" },
  { id: "D-003", name: "Mail Server", type: "Server", status: "secure", lastScan: "2026-04-01T08:15:00Z", vulnerabilities: 0, os: "Debian 12", ip: "10.0.1.30" },
  { id: "D-004", name: "CEO Laptop", type: "Endpoint", status: "secure", lastScan: "2026-04-01T09:00:00Z", vulnerabilities: 0, os: "Windows 11", ip: "10.0.2.101" },
  { id: "D-005", name: "Dev Workstation 03", type: "Endpoint", status: "warning", lastScan: "2026-03-31T16:00:00Z", vulnerabilities: 3, os: "macOS 15", ip: "10.0.2.103" },
  { id: "D-006", name: "Firewall Edge", type: "Network", status: "secure", lastScan: "2026-04-01T06:00:00Z", vulnerabilities: 0, os: "FortiOS 7.4", ip: "10.0.0.1" },
  { id: "D-007", name: "Core Switch", type: "Network", status: "secure", lastScan: "2026-04-01T06:30:00Z", vulnerabilities: 0, os: "IOS-XE 17.9", ip: "10.0.0.2" },
  { id: "D-008", name: "IoT Sensor 01", type: "IoT", status: "critical", lastScan: "2026-03-28T10:00:00Z", vulnerabilities: 5, os: "Embedded Linux", ip: "10.0.5.10" },
  { id: "D-009", name: "Cloud Instance AWS-1", type: "Cloud", status: "secure", lastScan: "2026-04-01T10:00:00Z", vulnerabilities: 0, os: "Amazon Linux 2023", ip: "172.31.10.100" },
  { id: "D-010", name: "Mobile Device - Sales Team", type: "Mobile", status: "warning", lastScan: "2026-03-31T12:00:00Z", vulnerabilities: 1, os: "Android 15", ip: "N/A" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "N-001", title: "Phát hiện lỗ hổng nghiêm trọng", message: "CVE-2026-1234 ảnh hưởng đến Database Server. Cần cập nhật ngay.", type: "critical", read: false, createdAt: "2026-04-01T15:30:00Z", relatedId: "D-002" },
  { id: "N-002", title: "Cập nhật chính sách bảo mật", message: "Chính sách mật khẩu mới đã được phê duyệt và có hiệu lực từ 01/04/2026.", type: "info", read: true, createdAt: "2026-04-01T09:00:00Z" },
  { id: "N-003", title: "Thiết bị IoT cần chú ý", message: "IoT Sensor 01 có 5 lỗ hổng chưa được vá.", type: "critical", read: false, createdAt: "2026-03-31T14:00:00Z", relatedId: "D-008" },
  { id: "N-004", title: "Đánh giá ISO 27001 sắp tới", message: "Đợt đánh giá ISO 27001 dự kiến vào 15/04/2026. Vui lòng chuẩn bị.", type: "warning", read: false, createdAt: "2026-03-30T10:00:00Z" },
  { id: "N-005", title: "Nhân viên hoàn thành đào tạo", message: "85% nhân viên đã hoàn thành khóa Đào tạo nhận thức bảo mật.", type: "success", read: true, createdAt: "2026-03-29T16:00:00Z" },
  { id: "N-006", title: "Phát hiện truy cập bất thường", message: "Đăng nhập từ địa điểm bất thường cho tài khoản admin@company.com.", type: "warning", read: false, createdAt: "2026-04-01T18:45:00Z" },
  { id: "N-007", title: "Backup hoàn tất", message: "Sao lưu hàng ngày hoàn tất thành công lúc 02:00 AM.", type: "success", read: true, createdAt: "2026-04-01T02:05:00Z" },
  { id: "N-008", title: "Chứng chỉ SSL sắp hết hạn", message: "Chứng chỉ SSL của mail.company.com hết hạn sau 14 ngày.", type: "warning", read: false, createdAt: "2026-03-31T08:00:00Z" },
];
