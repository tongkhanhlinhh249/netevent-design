import * as React from "react";
import { useState } from "react";
import {
  AlignLeft, CircleDot, ListChecks, Mail, MessageCircleQuestion, Pencil, Phone, Plus, Type, User, X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  MODE_LABEL, QUESTION_TYPE_LABEL, STANDARD_FIELDS, isChoice, useRegistrationForm,
  type CustomQuestion, type FieldMode, type QuestionType, type StandardField,
} from "../../data/registrationForm";

/**
 * Tab "Vé & Đăng ký" — khối câu hỏi đăng ký sau phần hạng vé, theo bố cục trang
 * Registration của Luma. Form đăng ký trên trang sự kiện đọc đúng cấu hình ở đây.
 */

const T = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  border:     "var(--border)",
  primary:    "var(--primary)",
  secondary:  "var(--secondary)",
  mutedFg:    "var(--muted-foreground)",
  destructive:"var(--destructive)",
  fw_medium: "var(--font-weight-medium)",
  fw_semi:   "var(--font-weight-semibold)",
  xs:   "var(--text-xs)",
  sm:   "var(--text-sm)",
  base: "var(--text-base)",
};

const FIELD_ICON: Record<StandardField, React.ElementType> = { phone: Phone, email: Mail };
const TYPE_ICON: Record<QuestionType, React.ElementType> = { short: Type, long: AlignLeft, single: CircleDot, multi: ListChecks };

// ── Câu hỏi đăng ký ──────────────────────────────────────────────────────────

export function RegistrationQuestionsSection({ eventId }: { eventId: string }) {
  const [form, setForm] = useRegistrationForm(eventId);
  const [editing, setEditing] = useState<CustomQuestion | "new" | null>(null);

  const setMode = (id: StandardField, mode: FieldMode) =>
    setForm({ ...form, fields: { ...form.fields, [id]: mode } });

  const saveQuestion = (q: CustomQuestion) => {
    const exists = form.questions.some((x) => x.id === q.id);
    setForm({ ...form, questions: exists ? form.questions.map((x) => (x.id === q.id ? q : x)) : [...form.questions, q] });
    toast.success(exists ? "Đã cập nhật câu hỏi" : "Đã thêm câu hỏi");
  };
  const removeQuestion = (id: string) => {
    setForm({ ...form, questions: form.questions.filter((x) => x.id !== id) });
    toast("Đã xoá câu hỏi");
  };

  return (
    <section className="flex flex-col gap-4 pt-6" style={{ borderTop: `1px solid ${T.border}` }}>
      <div>
        <h3 style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>Câu hỏi đăng ký</h3>
        <p style={{ fontSize: T.sm, color: T.mutedFg, marginTop: 2 }}>
          Người tham dự trả lời các câu hỏi này khi đăng ký sự kiện.
        </p>
      </div>

      <GroupTitle icon={User} tint="#16a34a">Thông tin cá nhân</GroupTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Không có tên thì không xuất được vé, nên ô này luôn bắt buộc */}
        <FieldCard icon={User} label="Họ và tên"><Locked /></FieldCard>
        {STANDARD_FIELDS.map((f) => (
          <FieldCard key={f.id} icon={FIELD_ICON[f.id]} label={f.label}>
            <Select value={form.fields[f.id]} onValueChange={(v) => setMode(f.id, v as FieldMode)}>
              <SelectTrigger aria-label={`${f.label}: chế độ`} data-pill="off"
                className="h-8 w-auto gap-1 border-0 bg-transparent shadow-none px-1.5 cursor-pointer"
                style={{ fontSize: T.sm, color: T.mutedFg }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {(Object.keys(MODE_LABEL) as FieldMode[]).map((m) => (
                  <SelectItem key={m} value={m}>{MODE_LABEL[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldCard>
        ))}
      </div>

      <GroupTitle icon={MessageCircleQuestion} tint="#ea580c">Câu hỏi thêm</GroupTitle>
      {form.questions.length > 0 && (
        <div className="flex flex-col gap-2">
          {form.questions.map((q) => {
            const Icon = TYPE_ICON[q.type];
            return (
              <button key={q.id} type="button" data-pill="off" onClick={() => setEditing(q)}
                className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                style={{ border: `1px solid ${T.border}`, backgroundColor: T.background }}>
                <Icon className="size-4 shrink-0" style={{ color: T.mutedFg }} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate" style={{ fontSize: T.sm, fontWeight: T.fw_medium, color: T.foreground }}>{q.label}</span>
                  <span className="block" style={{ fontSize: T.xs, color: T.mutedFg }}>
                    {QUESTION_TYPE_LABEL[q.type]}{isChoice(q.type) ? ` · ${q.options.length} lựa chọn` : ""}
                  </span>
                </span>
                <span style={{ fontSize: T.xs, color: T.mutedFg }}>{q.required ? "Bắt buộc" : "Không bắt buộc"}</span>
                <Pencil className="size-3.5 shrink-0" style={{ color: T.mutedFg }} />
              </button>
            );
          })}
        </div>
      )}
      <Button variant="secondary" className="self-start" onClick={() => setEditing("new")}>
        <Plus className="size-4" /> Thêm câu hỏi
      </Button>

      {editing && (
        <QuestionSheet question={editing === "new" ? undefined : editing}
          onSave={saveQuestion} onRemove={removeQuestion} onClose={() => setEditing(null)} />
      )}
    </section>
  );
}

function GroupTitle({ icon: Icon, tint, children }: { icon: React.ElementType; tint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 -mb-1">
      <span className="size-5 rounded-md flex items-center justify-center" style={{ backgroundColor: tint }}>
        <Icon className="size-3" style={{ color: "#fff" }} />
      </span>
      <span style={{ fontSize: T.sm, fontWeight: T.fw_semi, color: T.foreground }}>{children}</span>
    </div>
  );
}

function FieldCard({ icon: Icon, label, children }: {
  icon: React.ElementType; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl pl-3.5 pr-2 h-11"
      style={{ border: `1px solid ${T.border}`, backgroundColor: T.background }}>
      <Icon className="size-4 shrink-0" style={{ color: T.mutedFg }} />
      <span className="flex-1 min-w-0 truncate" style={{ fontSize: T.sm, color: T.foreground }}>{label}</span>
      {children}
    </div>
  );
}

function Locked() {
  return <span className="px-1.5" style={{ fontSize: T.sm, color: T.mutedFg }}>Bắt buộc</span>;
}

// ── Thêm / sửa câu hỏi ───────────────────────────────────────────────────────

function QuestionSheet({ question, onSave, onRemove, onClose }: {
  question?: CustomQuestion;
  onSave: (q: CustomQuestion) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(question?.label ?? "");
  const [type, setType] = useState<QuestionType>(question?.type ?? "short");
  const [options, setOptions] = useState<string[]>(question?.options.length ? question.options : ["", ""]);
  const [required, setRequired] = useState(question?.required ?? false);
  const [tried, setTried] = useState(false);

  const filled = options.map((o) => o.trim()).filter(Boolean);
  const labelError = !label.trim() ? "Nhập nội dung câu hỏi." : "";
  const optionsError = isChoice(type) && filled.length < 2 ? "Cần ít nhất 2 lựa chọn." : "";

  const save = () => {
    setTried(true);
    if (labelError || optionsError) return;
    onSave({
      id: question?.id ?? `q${Date.now()}`,
      label: label.trim(), type, required,
      options: isChoice(type) ? filled : [],
    });
    onClose();
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="p-0 flex flex-col gap-0 sm:max-w-[440px]">
        <div className="px-5 py-4 pr-12" style={{ borderBottom: `1px solid ${T.border}` }}>
          <SheetTitle style={{ fontSize: T.base, fontWeight: T.fw_semi, color: T.foreground }}>
            {question ? "Chỉnh câu hỏi" : "Thêm câu hỏi"}
          </SheetTitle>
          <SheetDescription style={{ fontSize: T.xs, color: T.mutedFg, marginTop: 2 }}>
            Hiện trong form đăng ký, sau phần thông tin cá nhân.
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="q-label">Câu hỏi <span aria-label="bắt buộc" style={{ opacity: 0.75 }}>*</span></Label>
            <Input id="q-label" autoFocus value={label} placeholder="Bạn biết đến sự kiện qua đâu?"
              aria-invalid={tried && !!labelError} onChange={(e) => setLabel(e.target.value)} />
            {tried && labelError && <p style={{ fontSize: T.xs, color: T.destructive }}>{labelError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Kiểu trả lời</Label>
            <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
              <SelectTrigger aria-label="Kiểu trả lời" className="cursor-pointer"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]).map((t) => {
                  const Icon = TYPE_ICON[t];
                  return (
                    <SelectItem key={t} value={t}>
                      <span className="flex items-center gap-2"><Icon className="size-4" /> {QUESTION_TYPE_LABEL[t]}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Danh sách lựa chọn chỉ hiện khi kiểu trả lời cần đến */}
          {isChoice(type) && (
            <div className="flex flex-col gap-1.5">
              <Label>Các lựa chọn</Label>
              {options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={o} placeholder={`Lựa chọn ${i + 1}`} aria-label={`Lựa chọn ${i + 1}`}
                    onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))} />
                  {options.length > 2 && (
                    <button type="button" aria-label={`Xoá lựa chọn ${i + 1}`}
                      onClick={() => setOptions(options.filter((_, j) => j !== i))}
                      className="size-8 shrink-0 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70"
                      style={{ color: T.mutedFg }}>
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" data-pill="off" onClick={() => setOptions([...options, ""])}
                className="self-start flex items-center gap-1 cursor-pointer hover:underline"
                style={{ background: "none", border: "none", padding: 0, fontSize: T.xs, fontWeight: T.fw_medium, color: T.primary }}>
                <Plus className="size-3.5" /> Thêm lựa chọn
              </button>
              {tried && optionsError && <p style={{ fontSize: T.xs, color: T.destructive }}>{optionsError}</p>}
            </div>
          )}

          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span style={{ fontSize: T.sm, color: T.foreground }}>Bắt buộc trả lời</span>
            <Switch checked={required} onCheckedChange={setRequired} aria-label="Bắt buộc trả lời" />
          </label>
        </div>

        <div className="px-5 py-4 flex items-center gap-2" style={{ borderTop: `1px solid ${T.border}` }}>
          {question && (
            <button type="button" data-pill="off" onClick={() => { onRemove(question.id); onClose(); }}
              className="cursor-pointer hover:underline"
              style={{ background: "none", border: "none", padding: 0, fontSize: T.sm, color: T.destructive }}>
              Xoá câu hỏi
            </button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={save}>Lưu</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
