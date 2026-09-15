import * as React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "../ui/utils";

/**
 * Ô soạn email không lộ cú pháp biến. Giá trị vẫn là chuỗi có {{bien}} và
 * [chữ](https://…) để lưu và gửi, còn trong ô soạn mỗi biến hiện thành một thẻ
 * như [Tên sự kiện] và mỗi link thành một thẻ link. Thẻ không sửa chữ bên trong
 * được: xoá bằng Backspace, chèn bằng insertToken / insertLink tại con trỏ.
 *
 * Xuống dòng lưu bằng <br>. Khi nội dung kết thúc bằng xuống dòng, trình duyệt
 * cần thêm một <br> giữ chỗ để hiện dòng trống — <br> cuối cùng không tính.
 * Thẻ đứng cuối dòng có một ký tự rỗng (ZWSP) phía sau để đặt được con trỏ.
 */

export interface TokenEditorHandle {
  insertToken: (key: string) => void;
  insertLink: (text: string, url: string) => void;
}

const ZWSP = "\u200B";
const ZWSP_RE = /\u200B/g;
const PART_RE = /\{\{\s*([a-z_]+)\s*\}\}|\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;

const EDITOR_CSS = `
.ne-editor { position: relative; cursor: text; white-space: pre-wrap; overflow-wrap: anywhere; }
.ne-editor[data-empty]::before { content: attr(data-placeholder); position: absolute; inset: 0; padding: inherit; color: var(--muted-foreground); pointer-events: none; }
.ne-chip { padding: 1px 7px; margin: 0 1px; border-radius: 6px; white-space: nowrap; cursor: default;
  background: color-mix(in srgb, var(--primary) 12%, transparent); color: var(--primary); font-weight: var(--font-weight-medium); }
.ne-chip-link { text-decoration: underline; text-underline-offset: 2px; }
`;

const isChip = (n: Node | null | undefined): n is HTMLElement =>
  n instanceof HTMLElement && (n.hasAttribute("data-token") || n.hasAttribute("data-link-url"));

function makeChip(label: string, attrs: Record<string, string>, link = false) {
  const el = document.createElement("span");
  el.contentEditable = "false";
  el.className = link ? "ne-chip ne-chip-link" : "ne-chip";
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.textContent = label;
  return el;
}

const linkChip = (text: string, url: string) =>
  makeChip(text, { "data-link-text": text, "data-link-url": url, title: url }, true);

/** Chuỗi lưu trữ → các nút DOM. Biến không có trong danh sách giữ nguyên dạng chữ. */
function buildNodes(value: string, tokens: Record<string, string>): Node[] {
  const nodes: Node[] = [];
  value.split("\n").forEach((line, i) => {
    if (i > 0) nodes.push(document.createElement("br"));
    let last = 0;
    for (const m of line.matchAll(PART_RE)) {
      if (m[1] && !tokens[m[1]]) continue;
      const at = m.index ?? 0;
      if (at > last) nodes.push(document.createTextNode(line.slice(last, at)));
      nodes.push(m[1] ? makeChip(tokens[m[1]], { "data-token": m[1] }) : linkChip(m[2], m[3]));
      last = at + m[0].length;
    }
    if (last < line.length) nodes.push(document.createTextNode(line.slice(last)));
    if (isChip(nodes[nodes.length - 1])) nodes.push(document.createTextNode(ZWSP));
  });
  return nodes;
}

/** Các nút DOM → chuỗi lưu trữ. */
function serialize(root: HTMLElement, singleLine: boolean) {
  let out = "";
  const walk = (parent: Node) => {
    parent.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) out += (n.textContent ?? "").replace(ZWSP_RE, "");
      else if (isChip(n)) {
        out += n.hasAttribute("data-token")
          ? `{{${n.getAttribute("data-token")}}}`
          : `[${n.getAttribute("data-link-text")}](${n.getAttribute("data-link-url")})`;
      } else if (n.nodeName === "BR") out += "\n";
      else if (n instanceof HTMLElement) {
        // Khối do trình duyệt tự tạo (vd. khi xoá hết nội dung) tính như một dòng mới.
        if (/^(DIV|P|LI)$/.test(n.nodeName) && out && !out.endsWith("\n")) out += "\n";
        walk(n);
      }
    });
  };
  walk(root);
  if (root.lastChild?.nodeName === "BR" && out.endsWith("\n")) out = out.slice(0, -1);
  return singleLine ? out.replace(/\n/g, " ") : out;
}

const hasContentAfter = (n: Node) => {
  for (let s = n.nextSibling; s; s = s.nextSibling) {
    if (s.nodeType !== Node.TEXT_NODE || (s.textContent ?? "").replace(ZWSP_RE, "")) return true;
  }
  return false;
};

function closestChip(node: Node, root: HTMLElement) {
  for (let n: Node | null = node; n && n !== root; n = n.parentNode) if (isChip(n)) return n;
  return null;
}

const LETTER = /[\p{L}\p{N}]/u;
const visible = (n: Node) => (n.textContent ?? "").replace(ZWSP_RE, "");

/** Ký tự sát trước / sau một vị trí, bỏ qua ký tự rỗng; thẻ tính như một chữ. */
function edgeChar(n: Node | null | undefined, side: "end" | "start"): string {
  if (!n) return "";
  if (isChip(n)) return "x";
  if (n.nodeType !== Node.TEXT_NODE) return "";
  const t = visible(n);
  if (t) return side === "end" ? t.slice(-1) : t.charAt(0);
  return edgeChar(side === "end" ? n.previousSibling : n.nextSibling, side);
}

function charsAround(r: Range) {
  const c = r.startContainer;
  if (c.nodeType === Node.TEXT_NODE) {
    const text = c.textContent ?? "";
    const before = text.slice(0, r.startOffset).replace(ZWSP_RE, "");
    const after = text.slice(r.startOffset).replace(ZWSP_RE, "");
    return {
      before: before ? before.slice(-1) : edgeChar(c.previousSibling, "end"),
      after: after ? after.charAt(0) : edgeChar(c.nextSibling, "start"),
    };
  }
  return { before: edgeChar(c.childNodes[r.startOffset - 1], "end"), after: edgeChar(c.childNodes[r.startOffset], "start") };
}

export const TokenEditor = forwardRef<TokenEditorHandle, {
  value: string;
  onChange: (value: string) => void;
  /** Khoá biến → chữ hiện trên thẻ. Truyền hằng số để không dựng lại ô soạn mỗi lần render. */
  tokens: Record<string, string>;
  singleLine?: boolean;
  placeholder?: string;
  invalid?: boolean;
  minHeight?: number;
  /** Khi người dùng vào ô (focus hoặc đặt con trỏ) — để biết thông tin chèn vào ô nào. */
  onFocus?: () => void;
  id?: string;
  "aria-labelledby"?: string;
}>(function TokenEditor({ value, onChange, tokens, singleLine = false, placeholder, invalid, minHeight, onFocus, ...rest }, ref) {
  const root = useRef<HTMLDivElement>(null);
  /** Giá trị ô soạn vừa phát ra — khác giá trị truyền vào nghĩa là giá trị đổi từ bên ngoài. */
  const emitted = useRef<string | null>(null);
  /** Vị trí con trỏ gần nhất trong ô, giữ lại khi bấm sang nút chèn. */
  const saved = useRef<Range | null>(null);
  const [empty, setEmpty] = useState(!value);
  const onFocusRef = useRef(onFocus);
  onFocusRef.current = onFocus;

  useEffect(() => {
    const el = root.current;
    if (!el || value === emitted.current) return;
    el.replaceChildren(...buildNodes(value, tokens));
    if (value.endsWith("\n")) el.appendChild(document.createElement("br"));
    emitted.current = value;
    saved.current = null;
    setEmpty(!value);
  }, [value, tokens]);

  useEffect(() => {
    const onSelection = () => {
      const sel = document.getSelection();
      if (!sel?.rangeCount || !root.current?.contains(sel.anchorNode)) return;
      saved.current = sel.getRangeAt(0).cloneRange();
      // Đặt con trỏ vào ô cũng tính là đang dùng ô này, kể cả khi không có sự kiện focus.
      onFocusRef.current?.();
    };
    document.addEventListener("selectionchange", onSelection);
    return () => document.removeEventListener("selectionchange", onSelection);
  }, []);

  const emit = () => {
    const el = root.current;
    if (!el) return;
    const next = serialize(el, singleLine);
    emitted.current = next;
    setEmpty(!next);
    onChange(next);
  };

  const setCaret = (r: Range) => {
    const sel = document.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
    saved.current = r.cloneRange();
  };

  /** Vị trí chèn: con trỏ đã lưu, không thì cuối nội dung; không bao giờ nằm trong một thẻ. */
  const insertionRange = (el: HTMLElement) => {
    el.focus();
    let r = saved.current && el.contains(saved.current.startContainer) ? saved.current.cloneRange() : null;
    if (!r) {
      r = document.createRange();
      if (el.lastChild?.nodeName === "BR") r.setStartBefore(el.lastChild);
      else r.setStart(el, el.childNodes.length);
      r.collapse(true);
    }
    const chip = closestChip(r.startContainer, el);
    if (chip) { r.setStartAfter(chip); r.collapse(true); }
    return r;
  };

  const insertNodes = (nodes: Node[], spaced = false) => {
    const el = root.current;
    if (!el || nodes.length === 0) return;
    const r = insertionRange(el);
    r.deleteContents();
    if (spaced) {
      // Thẻ chèn sát chữ hoặc sát thẻ khác thì tự cách một khoảng, để không thành "Chào[Tên]".
      const { before, after } = charsAround(r);
      if (LETTER.test(before)) nodes.unshift(document.createTextNode(" "));
      if (LETTER.test(after)) nodes.push(document.createTextNode(" "));
    }
    const lastNode = nodes[nodes.length - 1];
    const frag = document.createDocumentFragment();
    nodes.forEach((n) => frag.appendChild(n));
    r.insertNode(frag);

    if (isChip(lastNode) && lastNode.nextSibling?.nodeType !== Node.TEXT_NODE) lastNode.after(document.createTextNode(ZWSP));
    if (lastNode.nodeName === "BR" && !hasContentAfter(lastNode)) lastNode.after(document.createElement("br"));

    const caret = document.createRange();
    const next = lastNode.nextSibling;
    if (isChip(lastNode) && next?.nodeType === Node.TEXT_NODE) caret.setStart(next, (next.textContent ?? "").startsWith(ZWSP) ? 1 : 0);
    else caret.setStartAfter(lastNode);
    caret.collapse(true);
    setCaret(caret);
  };

  /** Backspace ngay sau một thẻ: xoá cả thẻ (và ký tự rỗng đi kèm) trong một lần bấm. */
  const removeChipBeforeCaret = () => {
    const el = root.current;
    const sel = document.getSelection();
    if (!el || !sel?.rangeCount || !sel.isCollapsed) return false;
    const { startContainer: c, startOffset: o } = sel.getRangeAt(0);
    let prev: Node | null = null;
    if (c.nodeType === Node.TEXT_NODE) {
      if (c.textContent?.slice(0, o).replace(ZWSP_RE, "")) return false;
      prev = c.previousSibling;
    } else if (c === el) {
      prev = el.childNodes[o - 1] ?? null;
    }
    if (!isChip(prev)) return false;
    const caret = document.createRange();
    if (c.nodeType === Node.TEXT_NODE) {
      const text = c as Text;
      text.deleteData(0, o);
      prev.remove();
      if (!text.data && isChip(text.previousSibling)) text.data = ZWSP;
      caret.setStart(text, text.data === ZWSP ? 1 : 0);
    } else {
      prev.remove();
      caret.setStart(el, o - 1);
    }
    caret.collapse(true);
    setCaret(caret);
    return true;
  };

  useImperativeHandle(ref, () => ({
    insertToken: (key) => {
      if (!tokens[key]) return;
      insertNodes([makeChip(tokens[key], { "data-token": key })], true);
      emit();
    },
    insertLink: (text, url) => {
      insertNodes([linkChip(text, url)], true);
      emit();
    },
  }));

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing) return; // đang gõ bộ gõ tiếng Việt
    if ((e.metaKey || e.ctrlKey) && /^[biu]$/i.test(e.key)) { e.preventDefault(); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      if (!singleLine) { insertNodes([document.createElement("br")]); emit(); }
      return;
    }
    if (e.key === "Backspace" && removeChipBeforeCaret()) { e.preventDefault(); emit(); }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    insertNodes(buildNodes(singleLine ? text.replace(/\s*\n\s*/g, " ") : text, tokens));
    emit();
  };

  // Sao chép / cắt giữ nguyên thẻ để dán lại trong ô soạn vẫn là thẻ.
  const selectionAsValue = () => {
    const sel = document.getSelection();
    if (!sel?.rangeCount || sel.isCollapsed) return null;
    const box = document.createElement("div");
    box.appendChild(sel.getRangeAt(0).cloneContents());
    return serialize(box, singleLine);
  };
  const onCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const v = selectionAsValue();
    if (v === null) return;
    e.preventDefault();
    e.clipboardData.setData("text/plain", v);
  };
  const onCut = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const v = selectionAsValue();
    if (v === null) return;
    e.preventDefault();
    e.clipboardData.setData("text/plain", v);
    document.getSelection()?.getRangeAt(0).deleteContents();
    emit();
  };

  return (
    <>
      <style>{EDITOR_CSS}</style>
      <div ref={root} {...rest} role="textbox" aria-multiline={!singleLine} aria-invalid={invalid || undefined}
        contentEditable suppressContentEditableWarning spellCheck={false}
        data-empty={empty || undefined} data-placeholder={placeholder}
        onInput={emit} onKeyDown={onKeyDown} onPaste={onPaste} onCopy={onCopy} onCut={onCut}
        onDrop={(e) => e.preventDefault()} onFocus={onFocus}
        className={cn(
          "ne-editor w-full rounded-md border border-input bg-input-background px-3 text-base md:text-sm outline-none transition-[color,box-shadow]",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          singleLine ? "py-1.5" : "py-2.5",
        )}
        style={{ minHeight: minHeight ?? 36, lineHeight: singleLine ? 1.6 : 1.8 }} />
    </>
  );
});
