"use client";

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-200">Cài đặt</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Cài đặt chung</h3>
          <SettingRow label="Ngôn ngữ" value="Tiếng Việt" />
          <SettingRow label="Múi giờ" value="Asia/Ho_Chi_Minh (UTC+7)" />
          <SettingRow label="Theme" value="Dark" />
          <SettingRow label="Định dạng ngày" value="DD/MM/YYYY" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Thông báo</h3>
          <ToggleSetting label="Thông báo email" description="Nhận thông báo qua email" enabled />
          <ToggleSetting label="Cảnh báo critical" description="Thông báo ngay khi có sự cố nghiêm trọng" enabled />
          <ToggleSetting label="Báo cáo tự động" description="Gửi báo cáo định kỳ" enabled />
          <ToggleSetting label="Thông báo đào tạo" description="Nhắc nhở khóa đào tạo" enabled={false} />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Đánh giá</h3>
          <SettingRow label="Chu kỳ đánh giá" value="Hàng quý" />
          <SettingRow label="Ngưỡng cảnh báo" value="Dưới 60%" />
          <SettingRow label="Tự động đánh giá" value="Bật" />
          <SettingRow label="Gửi kết quả cho" value="CISO, Security Team" />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Bảo mật hệ thống</h3>
          <ToggleSetting label="Xác thực 2 yếu tố" description="Bắt buộc MFA cho tất cả người dùng" enabled />
          <ToggleSetting label="Ghi log hoạt động" description="Ghi lại tất cả thao tác trong hệ thống" enabled />
          <ToggleSetting label="Tự động khóa phiên" description="Khóa sau 15 phút không hoạt động" enabled />
          <SettingRow label="Chính sách mật khẩu" value="Mạnh (12+ ký tự)" />
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm text-slate-200 font-medium">{value}</span>
    </div>
  );
}

function ToggleSetting({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm text-slate-200">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className={`w-10 h-5 rounded-full ${enabled ? "bg-cyan-600" : "bg-slate-600"} relative cursor-pointer`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${enabled ? "left-5.5" : "left-0.5"}`} />
      </div>
    </div>
  );
}
