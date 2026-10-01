#!/usr/bin/env python3
"""Nhập landing page tĩnh (netevent-site.zip) vào public/gioi-thieu/.

Landing được build với đường dẫn tính từ gốc (/assets/..., /#tu-van). Trong app
này gốc "/" thuộc về dashboard, nên mọi đường dẫn của landing được dời vào
/gioi-thieu/, còn các nút "Tạo sự kiện" trỏ thẳng vào màn tạo sự kiện của app.

Landing cập nhật thì chỉ cần chạy lại:
    python3 scripts/import_landing.py /đường/dẫn/netevent-site.zip
"""
import re
import shutil
import sys
import zipfile
from pathlib import Path

BASE = "/gioi-thieu"
CREATE = "/tao-su-kien"
OUT = Path(__file__).resolve().parent.parent / "public" / BASE.strip("/")
SKIP = {"serve.py"}

# Thẻ <a> có chữ "Tạo sự kiện" — không vượt qua </a> của chính nó.
CTA_RE = re.compile(r'<a\b[^>]*?href="[^"]*"[^>]*>(?:(?!</a>).)*?Tạo sự kiện(?:(?!</a>).)*?</a>', re.S)
ABS_RE = re.compile(r'((?:href|src|content)="|url\()(/(?!/)[^")]*)')


def rewrite(text: str, is_html: bool) -> str:
    if is_html:
        text = CTA_RE.sub(lambda m: re.sub(r'href="[^"]*"', f'href="{CREATE}"', m.group(0), count=1), text)

    def move(m: re.Match) -> str:
        prefix, path = m.group(1), m.group(2)
        if path == CREATE or path.startswith(BASE + "/"):
            return m.group(0)
        return prefix + BASE + path

    return ABS_RE.sub(move, text)


def main(zip_path: str) -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    ctas = 0
    with zipfile.ZipFile(zip_path) as z:
        for info in z.infolist():
            name = info.filename
            if info.is_dir() or Path(name).name in SKIP:
                continue
            dest = OUT / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            data = z.read(info)
            if name.endswith((".html", ".css", ".js")):
                text = data.decode("utf-8")
                if name.endswith(".html"):
                    ctas += len(CTA_RE.findall(text))
                data = rewrite(text, name.endswith(".html")).encode("utf-8")
            dest.write_bytes(data)
    print(f"Đã nhập vào {OUT.relative_to(Path.cwd()) if OUT.is_relative_to(Path.cwd()) else OUT} · {ctas} nút “Tạo sự kiện” → {CREATE}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
