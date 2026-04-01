"use client";

export function HelpTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-200">Trợ giúp</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Hướng dẫn sử dụng</h3>
          <div className="space-y-3">
            <HelpItem title="Bắt đầu đánh giá" desc="Chọn tab 'Đánh giá', chọn lĩnh vực và chấm điểm từng tiêu chí từ 0-5." />
            <HelpItem title="Xuất báo cáo" desc="Sử dụng sidebar trái hoặc tab 'Báo cáo' để xuất dữ liệu sang JSON, CSV, Excel, TXT, HTML, PDF." />
            <HelpItem title="Xem tuân thủ" desc="Tab 'Tuân thủ' hiển thị mức độ đáp ứng ISO 27001 và SOC 2 cho từng lĩnh vực." />
            <HelpItem title="So sánh đánh giá" desc="Tab 'So sánh' cho phép đối chiếu kết quả đánh giá giữa các kỳ khác nhau." />
            <HelpItem title="Quản lý thiết bị" desc="Tab 'Thiết bị' hiển thị trạng thái bảo mật của tất cả thiết bị trong hệ thống." />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Tiêu chuẩn</h3>
          <div className="space-y-3">
            <HelpItem title="ISO 27001" desc="Tiêu chuẩn quốc tế về Hệ thống quản lý An toàn thông tin (ISMS)." />
            <HelpItem title="SOC 2" desc="Báo cáo kiểm soát tổ chức dịch vụ, tập trung vào bảo mật, tính sẵn sàng, tính bảo mật." />
            <HelpItem title="NIST CSF" desc="Khung Cybersecurity của Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ." />
            <HelpItem title="OWASP" desc="Dự án bảo mật ứng dụng web mã nguồn mở với Top 10 lỗ hổng phổ biến." />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Mức độ rủi ro</h3>
          <div className="space-y-2">
            <RiskLevelInfo level="Critical" color="red" desc="Lỗ hổng nghiêm trọng, cần khắc phục ngay lập tức. Có thể dẫn đến vi phạm dữ liệu." />
            <RiskLevelInfo level="High" color="orange" desc="Rủi ro cao, cần ưu tiên xử lý trong tuần. Có thể bị khai thác dễ dàng." />
            <RiskLevelInfo level="Medium" color="yellow" desc="Rủi ro trung bình, cần xử lý trong tháng. Cần theo dõi thường xuyên." />
            <RiskLevelInfo level="Low" color="blue" desc="Rủi ro thấp, xử lý khi có thời gian. Ảnh hưởng hạn chế." />
            <RiskLevelInfo level="Info" color="slate" desc="Thông tin tham khảo, không ảnh hưởng trực tiếp đến bảo mật." />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Thang điểm đánh giá</h3>
          <div className="space-y-2">
            <ScoreInfo score={5} label="Xuất sắc" desc="Triển khai đầy đủ, hiệu quả cao, có tài liệu hóa." color="text-green-400" />
            <ScoreInfo score={4} label="Tốt" desc="Triển khai大部分, cần hoàn thiện một số chi tiết." color="text-green-400" />
            <ScoreInfo score={3} label="Trung bình" desc="Triển khai một phần, cần cải thiện đáng kể." color="text-yellow-400" />
            <ScoreInfo score={2} label="Yếu" desc="Triển khai很少, nhiều thiếu sót cần xử lý." color="text-orange-400" />
            <ScoreInfo score={1} label="Rất yếu" desc="几乎没有 triển khai, cần bắt đầu từ đầu." color="text-red-400" />
            <ScoreInfo score={0} label="Chưa đánh giá" desc="Chưa được đánh giá hoặc không áp dụng." color="text-slate-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Tổng quan hệ thống</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-cyan-400">203</p>
            <p className="text-xs text-slate-400">Tiêu chí đánh giá</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-cyan-400">17</p>
            <p className="text-xs text-slate-400">Lĩnh vực</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-cyan-400">11</p>
            <p className="text-xs text-slate-400">Tab chức năng</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-cyan-400">6</p>
            <p className="text-xs text-slate-400">API Routes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-2 rounded bg-slate-800">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
    </div>
  );
}

function RiskLevelInfo({ level, color, desc }: { level: string; color: string; desc: string }) {
  const colorMap: Record<string, string> = {
    red: "text-red-400 bg-red-500/20",
    orange: "text-orange-400 bg-orange-500/20",
    yellow: "text-yellow-400 bg-yellow-500/20",
    blue: "text-blue-400 bg-blue-500/20",
    slate: "text-slate-400 bg-slate-500/20",
  };
  return (
    <div className="flex items-start gap-2">
      <span className={`text-xs px-2 py-0.5 rounded ${colorMap[color]} shrink-0`}>{level}</span>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
  );
}

function ScoreInfo({ score, label, desc, color }: { score: number; label: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className={`text-sm font-bold ${color} w-6 shrink-0`}>{score}</span>
      <div>
        <p className="text-sm text-slate-200">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
