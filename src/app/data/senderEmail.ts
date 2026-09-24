// Email gửi của tài khoản — theo [Feature Spec] CẤU HÌNH EMAIL GỬI.
//
// Một chỗ duy nhất trả lời "email nào dùng để gửi": Cài đặt → Email gửi, dùng
// lại cho mọi sự kiện. Màn Email sự kiện chỉ trả lời "gửi nội dung gì, khi nào"
// nên chỉ đọc cấu hình này, không sửa.
//
// Mật khẩu SMTP không được lưu ở đây: chỉ giữ cờ `hasPassword`, đúng như backend
// thật — sau khi lưu không trả lại mật khẩu cho FE, UI chỉ hiện ••••••••.

import { useEffect, useState } from "react";

/** Địa chỉ hệ thống, luôn sẵn sàng và là chỗ lùi về khi email riêng gặp lỗi. */
export const NETEVENT_SENDER = { name: "NetEvent", email: "no-reply@mail.netevent.vn" };

export type SenderStatus = "none" | "connected" | "error";
export type SmtpSecurity = "ssl" | "tls" | "none";

export const SECURITY_LABEL: Record<SmtpSecurity, string> = {
  ssl: "SSL", tls: "STARTTLS", none: "Không mã hoá",
};

export interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  security: SmtpSecurity;
  /** Đã có mật khẩu đang lưu; bản thân mật khẩu không bao giờ nằm trong state này. */
  hasPassword: boolean;
}

export interface SenderEmail {
  /** Tên hiển thị trong hộp thư người nhận. */
  name: string;
  email: string;
  smtp: SmtpConfig | null;
  status: SenderStatus;
  /** Địa chỉ đang dùng để gửi. Quay về NetEvent không xoá cấu hình SMTP. */
  using: "netevent" | "custom";
  checkedAt?: number;
}

const KEY = "netevent_sender_email_v1";
const EVT = "netevent:sender-email";

const EMPTY: SenderEmail = { name: "", email: "", smtp: null, status: "none", using: "netevent" };

function read(): SenderEmail {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<SenderEmail>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

/** Đọc/ghi cấu hình email gửi; mọi nơi đang mở cùng cập nhật theo. */
export function useSenderEmail(): [SenderEmail, (next: SenderEmail) => void] {
  const [value, setValue] = useState<SenderEmail>(read);
  useEffect(() => {
    const sync = () => setValue(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const save = (next: SenderEmail) => {
    setValue(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* bộ nhớ bị chặn — chỉ giữ trong phiên */ }
    window.dispatchEvent(new Event(EVT));
  };
  return [value, save];
}

/**
 * Địa chỉ thực sự đứng tên gửi. Đã chọn email tổ chức nhưng kết nối đang lỗi thì
 * vẫn gửi được — bằng email NetEvent — để sự kiện không bị gián đoạn, và `fallback`
 * bật lên để màn hình báo cho người quản trị biết.
 */
export function activeSender(s: SenderEmail) {
  const ready = s.using === "custom" && s.status === "connected" && !!s.smtp;
  return {
    name: ready ? s.name : NETEVENT_SENDER.name,
    email: ready ? s.email : NETEVENT_SENDER.email,
    fallback: s.using === "custom" && !ready,
  };
}

export const isConfigured = (s: SenderEmail) => !!s.smtp;

/**
 * Mô phỏng "Kiểm tra kết nối". Bản prototype không mở kết nối thật, nhưng trả
 * lỗi ở đúng những chỗ hay sai thật ngoài đời để luồng xử lý lỗi kiểm thử được.
 */
export function checkConnection(smtp: SmtpConfig, password: string): { ok: boolean; error?: string } {
  const port = Number(smtp.port);
  if (!smtp.host.includes(".")) return { ok: false, error: `Không tìm thấy máy chủ “${smtp.host}”. Kiểm tra lại địa chỉ máy chủ gửi.` };
  if (!port || port < 1 || port > 65535) return { ok: false, error: "Cổng không hợp lệ. Thường dùng 587 (STARTTLS) hoặc 465 (SSL)." };
  if (port === 25) return { ok: false, error: "Cổng 25 thường bị nhà mạng chặn. Dùng 587 hoặc 465." };
  if (!smtp.user.trim()) return { ok: false, error: "Nhập tài khoản đăng nhập máy chủ gửi." };
  if (!password && !smtp.hasPassword) return { ok: false, error: "Nhập mật khẩu của tài khoản gửi." };
  if (port === 465 && smtp.security !== "ssl") return { ok: false, error: "Cổng 465 cần mã hoá SSL." };
  if (port === 587 && smtp.security === "ssl") return { ok: false, error: "Cổng 587 dùng STARTTLS, không phải SSL." };
  return { ok: true };
}
