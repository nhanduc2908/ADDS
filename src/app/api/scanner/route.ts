import { NextResponse } from "next/server";
import type { ScanCheck, ScanResult, RiskLevel } from "@/lib/types";

function makeCheck(
  id: string,
  name: string,
  nameVi: string,
  category: string,
  categoryVi: string,
  status: ScanCheck["status"],
  severity: RiskLevel,
  message: string,
  messageVi: string,
  details?: string,
  recommendation?: string
): ScanCheck {
  return { id, name, nameVi, category, categoryVi, status, severity, message, messageVi, details, recommendation };
}

async function checkWebsite(url: string): Promise<ScanResult> {
  const checks: ScanCheck[] = [];
  const startTime = Date.now();
  let statusCode = 0;
  let headers: Record<string, string> = {};
  let body = "";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "SecurityAudit-Scanner/1.0",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    statusCode = res.status;
    headers = Object.fromEntries(res.headers.entries());
    body = await res.text();
  } catch {
    checks.push(makeCheck(
      "connectivity", "Connectivity", "Kết nối", "Network", "Mạng",
      "fail", "critical",
      "Cannot connect to the website",
      "Không thể kết nối đến website",
      undefined,
      "Kiểm tra URL và đảm bảo website đang hoạt động"
    ));
    return {
      url,
      scannedAt: new Date().toISOString(),
      score: 0,
      grade: "F",
      checks,
      summary: { total: 1, passed: 0, failed: 1, warnings: 0, info: 0 },
      responseTime: Date.now() - startTime,
      statusCode: 0,
    };
  }

  const responseTime = Date.now() - startTime;

  // === HTTPS Check ===
  const isHttps = url.startsWith("https://");
  checks.push(makeCheck(
    "https", "HTTPS Enabled", "Bật HTTPS", "Encryption", "Mã hóa",
    isHttps ? "pass" : "fail",
    isHttps ? "info" : "critical",
    isHttps ? "Website uses HTTPS" : "Website does not use HTTPS",
    isHttps ? "Website sử dụng HTTPS" : "Website không sử dụng HTTPS",
    isHttps ? undefined : "Dữ liệu truyền tải không được mã hóa",
    "Cài đặt chứng chỉ SSL/TLS và chuyển sang HTTPS"
  ));

  // === HTTP to HTTPS Redirect ===
  if (!isHttps) {
    try {
      const httpUrl = url.replace("https://", "http://");
      const httpRes = await fetch(httpUrl, { method: "HEAD", redirect: "manual" });
      const redirectsToHttps = httpRes.status >= 300 && httpRes.status < 400 &&
        (httpRes.headers.get("location") || "").startsWith("https://");
      checks.push(makeCheck(
        "https-redirect", "HTTPS Redirect", "Chuyển hướng HTTPS", "Encryption", "Mã hóa",
        redirectsToHttps ? "pass" : "fail",
        redirectsToHttps ? "info" : "high",
        redirectsToHttps ? "HTTP redirects to HTTPS" : "No HTTP to HTTPS redirect",
        redirectsToHttps ? "Tự động chuyển HTTP sang HTTPS" : "Không tự động chuyển HTTP sang HTTPS",
        undefined,
        "Cấu hình server chuyển hướng HTTP sang HTTPS"
      ));
    } catch {
      // Skip
    }
  }

  // === Security Headers ===
  const securityHeaders = [
    {
      id: "strict-transport-security",
      name: "Strict-Transport-Security (HSTS)",
      nameVi: "HSTS",
      severity: "high" as RiskLevel,
      desc: "Enforces HTTPS connections",
      descVi: "Bắt buộc sử dụng HTTPS",
      rec: "Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains",
    },
    {
      id: "content-security-policy",
      name: "Content-Security-Policy (CSP)",
      nameVi: "CSP",
      severity: "high" as RiskLevel,
      desc: "Prevents XSS and data injection",
      descVi: "Chống XSS và chèn mã độc",
      rec: "Add a strict CSP header to restrict resource loading",
    },
    {
      id: "x-frame-options",
      name: "X-Frame-Options",
      nameVi: "X-Frame-Options",
      severity: "medium" as RiskLevel,
      desc: "Prevents clickjacking",
      descVi: "Chống clickjacking",
      rec: "Add header: X-Frame-Options: DENY or SAMEORIGIN",
    },
    {
      id: "x-content-type-options",
      name: "X-Content-Type-Options",
      nameVi: "X-Content-Type-Options",
      severity: "medium" as RiskLevel,
      desc: "Prevents MIME type sniffing",
      descVi: "Chống phát hiện kiểu MIME",
      rec: "Add header: X-Content-Type-Options: nosniff",
    },
    {
      id: "referrer-policy",
      name: "Referrer-Policy",
      nameVi: "Referrer-Policy",
      severity: "low" as RiskLevel,
      desc: "Controls referrer information",
      descVi: "Kiểm soát thông tin giới thiệu",
      rec: "Add header: Referrer-Policy: strict-origin-when-cross-origin",
    },
    {
      id: "permissions-policy",
      name: "Permissions-Policy",
      nameVi: "Permissions-Policy",
      severity: "medium" as RiskLevel,
      desc: "Controls browser features",
      descVi: "Kiểm soát tính năng trình duyệt",
      rec: "Add Permissions-Policy to restrict camera, microphone, geolocation",
    },
    {
      id: "x-xss-protection",
      name: "X-XSS-Protection",
      nameVi: "X-XSS-Protection",
      severity: "low" as RiskLevel,
      desc: "Legacy XSS filter",
      descVi: "Bộ lọc XSS cũ",
      rec: "Add header: X-XSS-Protection: 1; mode=block (or rely on CSP)",
    },
    {
      id: "x-dns-prefetch-control",
      name: "X-DNS-Prefetch-Control",
      nameVi: "X-DNS-Prefetch-Control",
      severity: "info" as RiskLevel,
      desc: "Controls DNS prefetching",
      descVi: "Kiểm soát DNS prefetching",
      rec: "Consider adding X-DNS-Prefetch-Control: off for privacy",
    },
  ];

  for (const h of securityHeaders) {
    const value = headers[h.id] || headers[h.id.toLowerCase()];
    const present = !!value;
    checks.push(makeCheck(
      h.id, h.name, h.nameVi, "Security Headers", "Header bảo mật",
      present ? "pass" : (h.severity === "info" ? "info" : "fail"),
      present ? "info" : h.severity,
      present ? `${h.name} is present` : `${h.name} is missing`,
      present ? `${h.nameVi} đã có` : `${h.nameVi} thiếu`,
      present ? `Value: ${value}` : h.desc,
      present ? undefined : h.rec
    ));
  }

  // === Cookie Security ===
  const setCookies = headers["set-cookie"];
  if (setCookies) {
    const cookieLines = setCookies.split("\n");
    let hasSecure = false;
    let hasHttpOnly = false;
    let hasSameSite = false;
    for (const c of cookieLines) {
      const lower = c.toLowerCase();
      if (lower.includes("secure")) hasSecure = true;
      if (lower.includes("httponly")) hasHttpOnly = true;
      if (lower.includes("samesite")) hasSameSite = true;
    }
    checks.push(makeCheck(
      "cookie-secure", "Cookie Secure Flag", "Cookie Secure", "Cookies", "Cookie",
      hasSecure ? "pass" : "fail",
      hasSecure ? "info" : "high",
      hasSecure ? "Cookies have Secure flag" : "Cookies missing Secure flag",
      hasSecure ? "Cookie có cờ Secure" : "Cookie thiếu cờ Secure",
      hasSecure ? undefined : "Cookies có thể bị gửi qua HTTP không mã hóa",
      "Thêm cờ Secure cho tất cả cookie"
    ));
    checks.push(makeCheck(
      "cookie-httponly", "Cookie HttpOnly Flag", "Cookie HttpOnly", "Cookies", "Cookie",
      hasHttpOnly ? "pass" : "fail",
      hasHttpOnly ? "info" : "medium",
      hasHttpOnly ? "Cookies have HttpOnly flag" : "Cookies missing HttpOnly flag",
      hasHttpOnly ? "Cookie có cờ HttpOnly" : "Cookie thiếu cờ HttpOnly",
      hasHttpOnly ? undefined : "Cookie có thể bị truy cập qua JavaScript",
      "Thêm cờ HttpOnly cho cookie nhạy cảm"
    ));
    checks.push(makeCheck(
      "cookie-samesite", "Cookie SameSite", "Cookie SameSite", "Cookies", "Cookie",
      hasSameSite ? "pass" : "warning",
      hasSameSite ? "info" : "medium",
      hasSameSite ? "Cookies have SameSite attribute" : "Cookies missing SameSite",
      hasSameSite ? "Cookie có thuộc tính SameSite" : "Cookie thiếu thuộc tính SameSite",
      hasSameSite ? undefined : "Cookie có thể bị gửi trong cross-site request",
      "Thêm SameSite=Lax hoặc SameSite=Strict"
    ));
  } else {
    checks.push(makeCheck(
      "cookie-none", "No Cookies Set", "Không có Cookie", "Cookies", "Cookie",
      "info", "info",
      "No cookies detected", "Không phát hiện cookie",
      "Website không đặt cookie nào"
    ));
  }

  // === Server Information Disclosure ===
  const server = headers["server"];
  const poweredBy = headers["x-powered-by"];
  if (server) {
    checks.push(makeCheck(
      "server-header", "Server Header", "Header Server", "Information Disclosure", "Lộ thông tin",
      "warning", "low",
      `Server header reveals: ${server}`,
      `Header Server lộ thông tin: ${server}`,
      undefined,
      "Ẩn hoặc xóa header Server"
    ));
  }
  if (poweredBy) {
    checks.push(makeCheck(
      "x-powered-by", "X-Powered-By Header", "Header X-Powered-By", "Information Disclosure", "Lộ thông tin",
      "warning", "low",
      `X-Powered-By reveals: ${poweredBy}`,
      `X-Powered-By lộ thông tin: ${poweredBy}`,
      undefined,
      "Xóa header X-Powered-By"
    ));
  }

  // === CORS Check ===
  const acao = headers["access-control-allow-origin"];
  if (acao === "*") {
    checks.push(makeCheck(
      "cors-wildcard", "CORS Wildcard", "CORS Wildcard", "CORS", "CORS",
      "fail", "medium",
      "Access-Control-Allow-Origin allows all origins (*)",
      "Access-Control-Allow-Origin cho phép tất cả origin (*)",
      undefined,
      "Hạn chế CORS chỉ cho phép origin cụ thể"
    ));
  } else if (acao) {
    checks.push(makeCheck(
      "cors-restricted", "CORS Restricted", "CORS Hạn chế", "CORS", "CORS",
      "pass", "info",
      `CORS restricted to: ${acao}`,
      `CORS hạn chế tại: ${acao}`
    ));
  }

  // === HTML Security Checks ===
  const htmlLower = body.toLowerCase();

  // Mixed content
  if (isHttps && (htmlLower.includes("http://"))) {
    const httpLinks = (body.match(/src=["']http:\/\/[^"']+["']/gi) || []).length;
    checks.push(makeCheck(
      "mixed-content", "Mixed Content", "Nội dung hỗn hợp", "Content", "Nội dung",
      httpLinks > 0 ? "fail" : "pass",
      httpLinks > 0 ? "high" : "info",
      httpLinks > 0 ? `Found ${httpLinks} HTTP resources on HTTPS page` : "No mixed content detected",
      httpLinks > 0 ? `Phát hiện ${httpLinks} tài nguyên HTTP trên trang HTTPS` : "Không có nội dung hỗn hợp",
      undefined,
      httpLinks > 0 ? "Chuyển tất cả resource sang HTTPS" : undefined
    ));
  }

  // Inline scripts
  const inlineScripts = (body.match(/<script(?![^>]*src)[^>]*>/gi) || []).length;
  if (inlineScripts > 0) {
    checks.push(makeCheck(
      "inline-scripts", "Inline Scripts", "Script nội tuyến", "XSS Prevention", "Chống XSS",
      inlineScripts > 5 ? "warning" : "info",
      inlineScripts > 5 ? "medium" : "low",
      `Found ${inlineScripts} inline <script> blocks`,
      `Phát hiện ${inlineScripts} khối script nội tuyến`,
      undefined,
      "Chuyển inline script sang file riêng và dùng CSP nonce"
    ));
  }

  // External scripts without integrity
  const externalScripts = body.match(/<script[^>]*src=["'][^"']+["'][^>]*>/gi) || [];
  const scriptsNoIntegrity = externalScripts.filter((s) => !s.includes("integrity="));
  if (externalScripts.length > 0 && scriptsNoIntegrity.length > 0) {
    checks.push(makeCheck(
      "script-integrity", "Script SRI", "Kiểm tra toàn vẹn Script", "Integrity", "Toàn vẹn",
      "warning", "medium",
      `${scriptsNoIntegrity.length}/${externalScripts.length} external scripts lack integrity attribute`,
      `${scriptsNoIntegrity.length}/${externalScripts.length} script thiếu thuộc tính integrity`,
      undefined,
      "Thêm thuộc tính integrity và crossorigin cho script CDN"
    ));
  }

  // Forms without CSRF
  const forms = body.match(/<form[^>]*>/gi) || [];
  const formsNoCSRF = forms.filter((f) => !f.includes("csrf") && !body.substring(body.indexOf(f)).includes("_token"));
  if (forms.length > 0) {
    checks.push(makeCheck(
      "form-csrf", "CSRF Protection", "Chống CSRF", "CSRF", "CSRF",
      formsNoCSRF.length > 0 ? "warning" : "pass",
      formsNoCSRF.length > 0 ? "medium" : "info",
      formsNoCSRF.length > 0 ? `${formsNoCSRF.length} forms may lack CSRF tokens` : "Forms appear to have CSRF protection",
      formsNoCSRF.length > 0 ? `${formsNoCSRF.length} form có thể thiếu CSRF token` : "Form có CSRF protection",
      undefined,
      formsNoCSRF.length > 0 ? "Thêm CSRF token cho tất cả form" : undefined
    ));
  }

  // === Response Code ===
  checks.push(makeCheck(
    "http-status", "HTTP Status Code", "Mã trạng thái HTTP", "Network", "Mạng",
    statusCode >= 200 && statusCode < 400 ? "pass" : statusCode >= 400 && statusCode < 500 ? "warning" : "fail",
    statusCode >= 500 ? "high" : statusCode >= 400 ? "medium" : "info",
    `HTTP ${statusCode}`,
    `Mã HTTP ${statusCode}`,
    `Response time: ${responseTime}ms`
  ));

  // === Response Time ===
  checks.push(makeCheck(
    "response-time", "Response Time", "Thời gian phản hồi", "Performance", "Hiệu năng",
    responseTime < 1000 ? "pass" : responseTime < 3000 ? "warning" : "fail",
    responseTime > 3000 ? "medium" : "info",
    `Response time: ${responseTime}ms`,
    `Thời gian phản hồi: ${responseTime}ms`,
    responseTime > 3000 ? "Website phản hồi chậm" : undefined,
    responseTime > 3000 ? "Tối ưu hiệu năng server và sử dụng CDN" : undefined
  ));

  // === Calculate Score ===
  const total = checks.length;
  const passed = checks.filter((c) => c.status === "pass").length;
  const failed = checks.filter((c) => c.status === "fail").length;
  const warnings = checks.filter((c) => c.status === "warning").length;
  const infoCount = checks.filter((c) => c.status === "info").length;

  const criticalFails = checks.filter((c) => c.status === "fail" && c.severity === "critical").length;
  const highFails = checks.filter((c) => c.status === "fail" && c.severity === "high").length;
  const mediumFails = checks.filter((c) => c.status === "fail" && c.severity === "medium").length;

  let score = Math.round(((passed + warnings * 0.5 + infoCount * 0.3) / total) * 100);
  score = Math.max(0, Math.min(100, score - criticalFails * 15 - highFails * 8 - mediumFails * 3));

  let grade: ScanResult["grade"] = "F";
  if (score >= 95) grade = "A+";
  else if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else if (score >= 40) grade = "D";

  return {
    url,
    scannedAt: new Date().toISOString(),
    score,
    grade,
    checks,
    summary: { total, passed, failed, warnings, info: infoCount },
    responseTime,
    statusCode,
  };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const result = await checkWebsite(targetUrl);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: `Scan failed: ${e instanceof Error ? e.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
