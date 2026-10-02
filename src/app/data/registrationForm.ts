// Câu hỏi đăng ký của một sự kiện — cấu hình ở tab "Vé & Đăng ký", và chính form
// đăng ký trên trang sự kiện đọc cấu hình này để biết phải hỏi gì.
//
// Họ và tên và email luôn bắt buộc: thiếu một trong hai thì không gửi được vé.

import { useEffect, useState } from "react";

export type FieldMode = "off" | "optional" | "required";
export type QuestionType = "short" | "long" | "single" | "multi";

/** Thông tin có sẵn mà ban tổ chức bật/tắt được. */
export type StandardField = "phone" | "company" | "title";

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

export const STANDARD_FIELDS: { id: StandardField; label: string; placeholder: string; type: "tel" | "text" }[] = [
  { id: "phone",   label: "Số điện thoại",     placeholder: "Nhập số điện thoại",            type: "tel" },
  { id: "company", label: "Công ty / Tổ chức", placeholder: "Nhập tên công ty hoặc tổ chức", type: "text" },
  { id: "title",   label: "Chức danh",         placeholder: "Nhập chức danh",                type: "text" },
];

export const MODE_LABEL: Record<FieldMode, string> = {
  off: "Tắt", optional: "Không bắt buộc", required: "Bắt buộc",
};

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  short: "Trả lời ngắn", long: "Đoạn văn", single: "Chọn một", multi: "Chọn nhiều",
};

export const isChoice = (t: QuestionType) => t === "single" || t === "multi";

/** Đúng những gì form đăng ký hỏi trước khi có phần cấu hình này. */
const DEFAULT_FORM: RegistrationForm = {
  fields: { phone: "required", company: "optional", title: "optional" },
  questions: [],
};

const key = (eventId: string) => `netevent_reg_form_${eventId}`;
const EVT = "netevent:reg-form";

export function readRegistrationForm(eventId: string): RegistrationForm {
  try {
    const raw = localStorage.getItem(key(eventId));
    if (!raw) return DEFAULT_FORM;
    const saved = JSON.parse(raw) as Partial<RegistrationForm>;
    return { fields: { ...DEFAULT_FORM.fields, ...saved.fields }, questions: saved.questions ?? [] };
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
