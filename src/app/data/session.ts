// Phiên đăng nhập của bản prototype.
//
// Lưu ở localStorage để đăng nhập một lần là dùng được ở mọi tab — các nút như
// "Tạo sự kiện" trên landing page mở app ở trang mới, không nên bắt đăng nhập lại.

export type UserRole = "owner" | "admin" | "staff";
export interface Session { role: UserRole; name?: string }

const ROLE = "netevent_role";
const NAME = "netevent_user_name";

export function readSession(): Session | null {
  try {
    const role = localStorage.getItem(ROLE) as UserRole | null;
    return role ? { role, name: localStorage.getItem(NAME) ?? undefined } : null;
  } catch {
    return null;
  }
}

export function saveSession(role: UserRole, name?: string): Session {
  try {
    localStorage.setItem(ROLE, role);
    if (name) localStorage.setItem(NAME, name);
    else localStorage.removeItem(NAME);
  } catch { /* bộ nhớ bị chặn — phiên chỉ sống trong trang này */ }
  return { role, name };
}

export function clearSession() {
  try {
    localStorage.removeItem(ROLE);
    localStorage.removeItem(NAME);
  } catch { /* không có gì để xoá */ }
}
