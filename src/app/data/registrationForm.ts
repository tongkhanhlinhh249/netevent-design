// Câu hỏi đăng ký của một sự kiện — cấu hình ở tab "Vé & Đăng ký", và chính form
// đăng ký trên trang sự kiện đọc cấu hình này để biết phải hỏi gì.
//
// Form luôn có ba trường: họ và tên (luôn bắt buộc), số điện thoại và email —
// hai trường sau ban tổ chức chọn bắt buộc hay không, mặc định bắt buộc. Thông
// tin khác (công ty, chức danh…) thêm bằng câu hỏi riêng.

import { useEffect, useState } from "react";

export type FieldMode = "optional" | "required";
export type QuestionType = "short" | "long" | "single" | "multi";

/** Trường có sẵn mà ban tổ chức chọn bắt buộc hay không. */
export type StandardField = "phone" | "email";

export interface CustomQuestion {
  id: string;
  label: string;
  type: QuestionType;
  /** Chỉ dùng cho câu hỏi chọn một / chọn nhiều. */
  options: string[];
  required: boolean;
}

export interface RegistrationForm {
  fields: Record<StandardField, FieldMode>;
  questions: CustomQuestion[];
}

export const STANDARD_FIELDS: { id: StandardField; label: string; placeholder: string; type: "tel" | "email" }[] = [
  { id: "phone", label: "Số điện thoại", placeholder: "Nhập số điện thoại", type: "tel" },
  { id: "email", label: "Email",         placeholder: "Nhập email",         type: "email" },
];

export const MODE_LABEL: Record<FieldMode, string> = {
  required: "Bắt buộc", optional: "Không bắt buộc",
};

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  short: "Trả lời ngắn", long: "Đoạn văn", single: "Chọn một", multi: "Chọn nhiều",
};

export const isChoice = (t: QuestionType) => t === "single" || t === "multi";

const DEFAULT_FORM: RegistrationForm = {
  fields: { phone: "required", email: "required" },
  questions: [],
};

/** Chỉ "optional" mới là không bắt buộc; giá trị cũ ("off") hay thiếu đều về mặc định. */
const asMode = (v: unknown): FieldMode => (v === "optional" ? "optional" : "required");

const key = (eventId: string) => `netevent_reg_form_${eventId}`;
const EVT = "netevent:reg-form";

export function readRegistrationForm(eventId: string): RegistrationForm {
  try {
    const raw = localStorage.getItem(key(eventId));
    if (!raw) return DEFAULT_FORM;
    const saved = JSON.parse(raw) as Partial<RegistrationForm>;
    // Bản lưu trước có thể còn công ty/chức danh hoặc chế độ "Tắt" — chỉ đọc SĐT và email.
    return {
      fields: { phone: asMode(saved.fields?.phone), email: asMode(saved.fields?.email) },
      questions: saved.questions ?? [],
    };
  } catch {
    return DEFAULT_FORM;
  }
}

/** Đọc/ghi cấu hình; trang sự kiện đang mở ở tab khác cũng cập nhật theo. */
export function useRegistrationForm(eventId: string): [RegistrationForm, (next: RegistrationForm) => void] {
  const [form, setForm] = useState(() => readRegistrationForm(eventId));
  useEffect(() => {
    setForm(readRegistrationForm(eventId));
    const sync = () => setForm(readRegistrationForm(eventId));
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, [eventId]);
  const save = (next: RegistrationForm) => {
    setForm(next);
    try { localStorage.setItem(key(eventId), JSON.stringify(next)); } catch { /* chỉ giữ trong phiên */ }
    window.dispatchEvent(new Event(EVT));
  };
  return [form, save];
}
