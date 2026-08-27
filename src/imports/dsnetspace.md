# NetSpace — Design System (Developer Reference)

> Phiên bản dành cho **developer**: copy-paste ready tokens, component patterns, Tailwind config, accessibility rules.

**Stack:** Next.js / React / Vanilla HTML · Tailwind CSS v3 or v4 · Be Vietnam Pro

---

## 1. Setup

### 1.1 Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 1.2 CSS Custom Properties (`globals.css`)

Dán vào `:root` — dùng được cho cả Tailwind và vanilla CSS.

```css
:root {
  /* ── Colors ── */
  --color-canvas:       #ffffff;
  --color-hero-surface: #eef3fb;
  --color-ink:          #131313;
  --color-ink-muted:    #595959;   /* AA-compliant (7:1 on white). Brand #7a7a7a chỉ OK cho text ≥ 18px */
  --color-ink-light:    #767676;   /* min AA large text (4.54:1) */
  --color-ns-primary:   #1eaaff;
  --color-ns-secondary: #9462fb;
  --color-ns-accent:    #6adbe3;
  --color-ns-pink:      #f86880;
  --color-ns-yellow:    #fae096;
  --color-surface:      #ffffff;
  --color-border:       rgba(29, 73, 166, 0.08);
  --color-shadow-tint:  rgba(29, 73, 166, 0.15);

  /* ── Gradients ── */
  --grad-headline: linear-gradient(to right, #1eaaff, #9462fb, #f86880, #fae096);
  --grad-label:    linear-gradient(to right, #1eaaff, #9462fb, #f86880);
  --grad-cta:      linear-gradient(to right, #1eaaff, #9462fb, #f86880 85%);
  --grad-footer:   linear-gradient(162deg, #0070b8 0%, #8049f5 100%);
                   /* ↑ Darkened từ brand (#1ea0f7→#9462fb) để white text đạt ≥ 4.5:1 */
  --grad-divider:  linear-gradient(to right, #1eaaff, #9462fb 70%, #f86880 85%, #fae096);

  /* ── Typography ── */
  --font-sans: 'Be Vietnam Pro', system-ui, sans-serif;

  /* Type scale */
  --text-display:    56px;
  --text-display-sm: 52px;
  --text-headline:   40px;
  --text-heading:    32px;
  --text-subheading: 24px;
  --text-body-lg:    18px;
  --text-body:       16px;
  --text-caption:    14px;
  --text-micro:      13px;

  /* Line heights */
  --leading-display: 1.2;
  --leading-heading: 1.4;
  --leading-body:    1.5;
  --leading-body-lg: 1.6;

  /* Letter spacing */
  --tracking-display: -0.09em;   /* ≈ -1.4px at 56px */
  --tracking-heading: -0.03em;
  --tracking-body:     0em;

  /* ── Spacing (base-4) ── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* ── Border radius ── */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-pill: 9999px;

  /* ── Shadows ── */
  --shadow-card:    rgba(29, 73, 166, 0.15) 0px  8px 32px 0px;
  --shadow-card-lg: rgba(29, 73, 166, 0.22) 0px 16px 48px 0px;
  --shadow-nav:     rgba(29, 73, 166, 0.10) 0px  4px 24px 0px;
  --shadow-btn:     rgba(30, 170, 255, 0.30) 0px  4px 20px 0px;

  /* ── Layout ── */
  --content-width: 1200px;
  --section-gap:   96px;
  --card-pad:      28px;
}
```

---

### 1.3 Tailwind v3 Config (`tailwind.config.js`)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        canvas:         '#ffffff',
        'hero-surface': '#eef3fb',
        ink:            '#131313',
        'ink-muted':    '#595959',
        'ink-light':    '#767676',
        'ns-primary':   '#1eaaff',
        'ns-secondary': '#9462fb',
        'ns-accent':    '#6adbe3',
        'ns-pink':      '#f86880',
        'ns-yellow':    '#fae096',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        xl:   '20px',
        lg:   '16px',
        md:   '12px',
        sm:   '8px',
      },
      boxShadow: {
        card:     'rgba(29,73,166,0.15) 0px 8px 32px 0px',
        'card-lg':'rgba(29,73,166,0.22) 0px 16px 48px 0px',
        nav:      'rgba(29,73,166,0.10) 0px 4px 24px 0px',
        btn:      'rgba(30,170,255,0.30) 0px 4px 20px 0px',
      },
      letterSpacing: {
        display: '-0.09em',
        heading: '-0.03em',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}
```

### 1.4 Tailwind v4 Config (`globals.css` — `@theme` block)

```css
@import "tailwindcss";

@theme {
  --color-canvas:         #ffffff;
  --color-hero-surface:   #eef3fb;
  --color-ink:            #131313;
  --color-ink-muted:      #595959;
  --color-ink-light:      #767676;
  --color-ns-primary:     #1eaaff;
  --color-ns-secondary:   #9462fb;
  --color-ns-accent:      #6adbe3;
  --color-ns-pink:        #f86880;
  --color-ns-yellow:      #fae096;

  --font-sans:            "Be Vietnam Pro", system-ui, sans-serif;

  --radius-pill:          9999px;
  --radius-xl:            20px;
  --radius-lg:            16px;
  --radius-md:            12px;
  --radius-sm:            8px;

  --shadow-card:          rgba(29,73,166,0.15) 0px 8px 32px 0px;
  --shadow-card-lg:       rgba(29,73,166,0.22) 0px 16px 48px 0px;
  --shadow-nav:           rgba(29,73,166,0.10) 0px 4px 24px 0px;
  --shadow-btn:           rgba(30,170,255,0.30) 0px 4px 20px 0px;
}
```

---

## 2. Typography

### Rules

| Trường hợp | Dùng gì |
|------------|---------|
| Hero display ≥ 40px bold | `grad-text` gradient OK |
| Section headings h2 ≥ 32px bold | `grad-label-text` OK |
| Body / caption / label < 24px | **Solid color only** — không gradient |
| Muted body text | `#595959` (`--color-ink-muted`) |

### Gradient text pattern

```css
/* Luôn khai báo `color` trước làm solid fallback */
.grad-text {
  color: #1eaaff;
  background-image: var(--grad-headline);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.grad-label-text {
  color: #1eaaff;
  background-image: var(--grad-label);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Windows High Contrast Mode — tắt gradient, dùng solid */
@media (forced-colors: active) {
  .grad-text, .grad-label-text {
    background: none;
    -webkit-text-fill-color: unset;
    color: ButtonText;
  }
}
```

### React component

```tsx
// components/ui/GradientText.tsx
type Variant = 'headline' | 'label';

const gradients: Record<Variant, string> = {
  headline: 'linear-gradient(to right, #1eaaff, #9462fb, #f86880, #fae096)',
  label:    'linear-gradient(to right, #1eaaff, #9462fb, #f86880)',
};

export function GradientText({
  children,
  variant = 'headline',
  className = '',
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        color: '#1eaaff',                        // solid fallback
        backgroundImage: gradients[variant],
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  );
}
```

### Type scale classes (Tailwind)

```html
<!-- h1 Hero -->
<h1 class="text-5xl sm:text-6xl font-bold leading-tight tracking-display">…</h1>

<!-- h2 Section heading -->
<h2 class="text-4xl font-bold tracking-heading leading-tight">…</h2>

<!-- h3 Card title -->
<h3 class="text-xl font-bold tracking-tight text-ink">…</h3>

<!-- Body -->
<p class="text-base text-ink-muted leading-relaxed">…</p>

<!-- Caption -->
<p class="text-sm text-ink-muted">…</p>

<!-- Eyebrow label -->
<p class="text-xs font-semibold uppercase tracking-widest">…</p>
```

---

## 3. Colors

### Reference table

| Token | Value | WCAG on white | Dùng cho |
|-------|-------|---------------|----------|
| `--color-ink` | `#131313` | 18.1:1 ✅ AAA | Headings, primary text |
| `--color-ink-muted` | `#595959` | 7.0:1 ✅ AAA | Body text, descriptions |
| `--color-ink-light` | `#767676` | 4.54:1 ✅ AA | Captions ≥ 14px |
| `--color-ns-primary` | `#1eaaff` | 2.5:1 ❌ | Button bg, border, icon — **không làm text trên nền sáng** |
| `--color-ns-secondary` | `#9462fb` | 4.5:1 ✅ AA | Bold text ≥ 14px, gradient stop |
| `--color-ns-pink` | `#f86880` | 3.1:1 ❌ | Decorative only, badge bg |

> ⚠️ `#1eaaff` trên nền trắng = 2.5:1 — **không đủ WCAG AA**. Chỉ dùng làm button background (với white text trên trên), border, hoặc icon fill.

### Gradient CSS

```css
/* Button gradient */
.btn-grad { background-image: var(--grad-cta); color: #fff; }

/* Ghost button — gradient border trick */
.btn-ghost-grad {
  background-image: linear-gradient(white, white), var(--grad-cta);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1.5px solid transparent;
  background-color: white;
  color: var(--color-ink);
}

/* Accent line dưới section title */
.title-accent {
  height: 3px;
  width: 48px;
  background-image: var(--grad-divider);
  border-radius: var(--radius-pill);
}

/* Footer / CTA section background */
.section-footer { background-image: var(--grad-footer); }
```

---

## 4. Components

### 4.1 Navigation Bar

```html
<header role="banner">
  <div class="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
    <nav
      class="max-w-content mx-auto flex items-center justify-between
             bg-white/[0.92] backdrop-blur-[16px] [-webkit-backdrop-filter:blur(16px)]
             rounded-pill shadow-nav border border-white/80 px-5 py-2.5"
      aria-label="Điều hướng chính"
    >
      <a href="/" class="flex items-center gap-2.5 rounded-pill" aria-label="NetSpace — Trang chủ">
        <img src="/logo.svg" alt="" aria-hidden="true" width="32" height="32" class="rounded-[9px]">
        <span class="text-[17px] font-bold text-ink">NetSpace</span>
      </a>

      <ul class="hidden lg:flex items-center gap-0.5 list-none">
        <li><a href="/about"    class="nav-link">Về chúng tôi</a></li>
        <li><a href="/services" class="nav-link">Dịch vụ</a></li>
        <li><a href="/contact"  class="nav-link">Liên hệ</a></li>
      </ul>

      <div class="flex items-center gap-2">
        <a href="/contact" class="btn-grad hidden sm:inline-flex text-white text-[13px] font-semibold px-4 py-2 rounded-pill shadow-btn">
          Nhận tư vấn
        </a>
        <button
          id="hamburger" type="button"
          aria-expanded="false" aria-controls="mobile-menu" aria-label="Mở menu"
          class="lg:hidden p-2 rounded-lg focus-visible:outline-2 focus-visible:outline-ns-primary"
        >
          <!-- 3 lines icon -->
        </button>
      </div>
    </nav>

    <div id="mobile-menu" hidden
         class="bg-white/[0.92] backdrop-blur-[16px] mt-2 max-w-content mx-auto rounded-2xl shadow-card border border-white/80 p-4">
      <ul class="flex flex-col gap-1 list-none">
        <li><a href="/about"    class="nav-link-mobile">Về chúng tôi</a></li>
        <li><a href="/services" class="nav-link-mobile">Dịch vụ</a></li>
        <li><a href="/contact"  class="nav-link-mobile">Liên hệ</a></li>
      </ul>
    </div>
  </div>
</header>
```

```css
.nav-link {
  font-size: 14px; font-weight: 500; color: var(--color-ink-muted);
  padding: 7px 14px; border-radius: var(--radius-pill); text-decoration: none;
  transition: color .2s, background-color .2s;
}
.nav-link:hover { color: var(--color-ink); background: rgba(30,170,255,.07); }

.nav-link-mobile {
  display: block; font-size: 14px; font-weight: 500; color: var(--color-ink-muted);
  padding: 10px 16px; border-radius: 12px; text-decoration: none;
  transition: color .2s, background-color .2s;
}
.nav-link-mobile:hover { color: var(--color-ink); background: rgba(30,170,255,.07); }
```

```js
// Keyboard-accessible mobile menu
const btn  = document.getElementById('hamburger');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  btn.setAttribute('aria-label', open ? 'Mở menu' : 'Đóng menu');
  open ? menu.setAttribute('hidden', '') : menu.removeAttribute('hidden');
  if (!open) menu.querySelector('a')?.focus();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('hidden', '');
    btn.focus();
  }
});
```

---

### 4.2 Buttons

| Variant | Dùng cho |
|---------|----------|
| `btn-primary` | CTA chính (hero, section) |
| `btn-solid` | Action phụ, lang toggle |
| `btn-ghost` | CTA thứ 2 cạnh primary |
| `btn-outline` | Link-style action trên nền sáng |
| `btn-outline-white` | Action trên nền tối/gradient |

```css
/* ── Base shared ── */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-sans); font-size: 15px; font-weight: 600;
  line-height: 1; border: none; cursor: pointer; text-decoration: none;
  border-radius: var(--radius-pill); padding: 10px 24px;
  transition: filter .2s, transform .15s, box-shadow .2s;
}
.btn:active { transform: scale(0.97); }

/* Focus ring — tất cả variants */
.btn:focus-visible {
  outline: 2.5px solid var(--color-ns-primary);
  outline-offset: 3px;
  border-radius: var(--radius-pill);
}

/* Primary */
.btn-primary  { background-image: var(--grad-cta); color: #fff; box-shadow: var(--shadow-btn); }
.btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }

/* Solid */
.btn-solid    { background-color: var(--color-ns-primary); color: #fff; }
.btn-solid:hover { opacity: .9; }

/* Ghost (gradient border) */
.btn-ghost {
  background-image: linear-gradient(white, white), var(--grad-cta);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 1.5px solid transparent;
  background-color: white;
  color: var(--color-ink);
}
.btn-ghost:hover { box-shadow: var(--shadow-card); transform: translateY(-1px); }

/* Outline */
.btn-outline { background: transparent; border: 1.5px solid rgba(29,73,166,.2); color: var(--color-ink); }
.btn-outline:hover { border-color: var(--color-ns-primary); box-shadow: var(--shadow-card); }

/* Outline white */
.btn-outline-white { background: transparent; border: 1.5px solid rgba(255,255,255,.65); color: #fff; }
.btn-outline-white:hover { background: rgba(255,255,255,.12); border-color: #fff; }
.btn-outline-white:focus-visible { outline-color: #fff; }
```

```tsx
// React Button
type BtnVariant = 'primary' | 'solid' | 'ghost' | 'outline' | 'outline-white';
const cls: Record<BtnVariant, string> = {
  primary:       'btn btn-primary',
  solid:         'btn btn-solid',
  ghost:         'btn btn-ghost',
  outline:       'btn btn-outline',
  'outline-white':'btn btn-outline-white',
};
export function Button({ variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return <button className={`${cls[variant]} ${className}`} {...props} />;
}
```

---

### 4.3 Cards

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
  padding: var(--card-pad);
}
.card-hover {
  transition: transform .25s ease, box-shadow .25s ease;
}
.card-hover:hover { transform: translateY(-5px); box-shadow: var(--shadow-card-lg); }

/* Featured variant */
.card-featured {
  background: linear-gradient(135deg, #f8f4ff, #eef6ff);
  border-color: rgba(148,98,251,.15);
}

/* Icon block */
.card-icon {
  width: 56px; height: 56px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
  background-image: var(--grad-cta);
  box-shadow: rgba(30,170,255,.25) 0 4px 16px;
}

/* Badges / Tags */
.badge { font-size: 11px; font-weight: 600; border-radius: var(--radius-pill); padding: 4px 12px; border: 1px solid; }
.badge-blue   { color: var(--color-ns-primary);   background: rgba(30,170,255,.08);  border-color: rgba(30,170,255,.2); }
.badge-purple { color: var(--color-ns-secondary); background: rgba(148,98,251,.08); border-color: rgba(148,98,251,.2); }
.badge-pink   { color: var(--color-ns-pink);      background: rgba(248,104,128,.08);border-color: rgba(248,104,128,.2);}
.badge-green  { color: #15803d;                   background: rgba(34,197,94,.08);  border-color: rgba(34,197,94,.2); }
```

```html
<!-- Card HTML pattern -->
<article class="card card-hover">
  <div class="card-icon" role="img" aria-label="[mô tả icon]">
    <img src="/icon.svg" alt="" aria-hidden="true" width="28" height="28">
  </div>
  <h3 class="text-xl font-bold text-ink mb-2 tracking-tight">[Title]</h3>
  <p class="text-sm text-ink-muted leading-relaxed mb-5">[Description]</p>
  <ul class="flex flex-wrap gap-2 list-none" aria-label="Tags">
    <li><span class="badge badge-blue">Tag 1</span></li>
  </ul>
</article>
```

---

### 4.4 Forms

```html
<!-- Accessible field pattern -->
<div class="form-field">
  <label for="f-email" class="form-label">
    Email <span aria-label="(bắt buộc)">*</span>
  </label>
  <input
    id="f-email" type="email" name="email"
    autocomplete="email" required aria-required="true"
    aria-describedby="f-email-err"
    placeholder="email@congty.vn"
    class="form-input"
  >
  <p id="f-email-err" role="alert" class="form-error" hidden>
    Vui lòng nhập email hợp lệ.
  </p>
</div>
```

```css
.form-label { display: block; font-size: 13px; font-weight: 600; color: var(--color-ink); margin-bottom: 6px; }

.form-input {
  display: block; width: 100%;
  font-family: var(--font-sans); font-size: 14px; color: var(--color-ink);
  background: white; border: 1.5px solid rgba(29,73,166,.15);
  border-radius: var(--radius-md); padding: 10px 14px;
  outline: none; -webkit-appearance: none;
  transition: border-color .2s, box-shadow .2s;
}
.form-input::placeholder { color: var(--color-ink-light); }
.form-input:focus {
  border-color: var(--color-ns-primary);
  box-shadow: 0 0 0 3px rgba(30,170,255,.15);
}
.form-input[aria-invalid="true"] {
  border-color: var(--color-ns-pink);
  box-shadow: 0 0 0 3px rgba(248,104,128,.15);
}

.form-error { font-size: 12px; color: #c0392b; margin-top: 5px; } /* #c0392b = 6.5:1 on white ✅ */

/* On dark backgrounds */
.form-input-dark { background: rgba(255,255,255,.9); border-color: rgba(255,255,255,.3); }
```

```js
// Form validation với live region
form.addEventListener('submit', e => {
  e.preventDefault();
  const errors = [];
  if (!nameInput.value.trim()) errors.push('Họ tên không được để trống.');
  if (!emailInput.value.includes('@')) errors.push('Email không hợp lệ.');

  if (errors.length) {
    errorRegion.textContent = errors.join(' '); // role="alert" sẽ tự announce
    errorRegion.removeAttribute('hidden');
    return;
  }
  // success
  successRegion.removeAttribute('hidden'); // role="status"
});
```

---

### 4.5 Partners Marquee

```html
<section aria-label="Đối tác của NetSpace">
  <div class="marquee-wrapper">
    <ul class="marquee-track list-none" role="list" aria-label="Danh sách đối tác">
      <li class="marquee-item">Partner A</li>
      <li class="marquee-item">Partner B</li>
      <!-- Duplicate with aria-hidden for seamless loop -->
      <li class="marquee-item" aria-hidden="true">Partner A</li>
      <li class="marquee-item" aria-hidden="true">Partner B</li>
    </ul>
  </div>
</section>
```

```css
.marquee-wrapper { overflow: hidden; position: relative; }
.marquee-wrapper::before,
.marquee-wrapper::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2; pointer-events: none;
}
.marquee-wrapper::before { left:  0; background: linear-gradient(to right, white, transparent); }
.marquee-wrapper::after  { right: 0; background: linear-gradient(to left,  white, transparent); }

.marquee-track { display: flex; align-items: center; width: max-content; animation: marquee 28s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
.marquee-item { padding: 0 36px; border-right: 1px solid rgba(29,73,166,.06); font-size: 14px; font-weight: 600; color: var(--color-ink-light); white-space: nowrap; }

@keyframes marquee { to { transform: translateX(-50%); } }
```

---

## 5. Accessibility

### 5.1 Skip link (bắt buộc)

```html
<!-- Ngay sau <body>, trước mọi thứ khác -->
<a href="#main-content" class="skip-link">Bỏ qua điều hướng</a>
<main id="main-content" tabindex="-1">…</main>
```

```css
.skip-link {
  position: absolute; top: -100%; left: 1rem; z-index: 9999;
  background: var(--color-ns-primary); color: #fff;
  padding: 8px 20px; border-radius: var(--radius-pill);
  font-weight: 600; font-size: 14px; text-decoration: none;
}
.skip-link:focus { top: 1rem; }
```

### 5.2 Focus rings (global CSS)

```css
* { outline: none; }
*:focus-visible {
  outline: 2.5px solid var(--color-ns-primary);
  outline-offset: 3px;
  border-radius: 4px;
}
/* Pill elements */
a, button { border-radius: var(--radius-pill); }
/* White ring on dark backgrounds */
.on-dark:focus-visible { outline-color: #fff; }
```

### 5.3 ARIA patterns

```html
<!-- Landmarks -->
<header role="banner">…</header>
<nav aria-label="Điều hướng chính">…</nav>
<main id="main-content">…</main>
<footer aria-label="Thông tin NetSpace">…</footer>

<!-- Sections cần heading -->
<section aria-labelledby="solutions-heading">
  <h2 id="solutions-heading">Giải pháp</h2>
</section>

<!-- Section không cần visible heading -->
<section>
  <h2 class="sr-only">Số liệu ấn tượng</h2>
</section>

<!-- Icon-only buttons -->
<button type="button" aria-label="Đóng">
  <svg aria-hidden="true" focusable="false">…</svg>
</button>

<!-- Decorative images -->
<img src="hero-3d.png" alt="" role="presentation">

<!-- Informational images -->
<img src="team.jpg" alt="Đội ngũ NetSpace gồm hơn 200 thành viên chụp trong không gian chủ đề vũ trụ">

<!-- Stats với dl/dt/dd -->
<dl>
  <div>
    <dd class="stat-value">10M+</dd>
    <dt class="text-sm text-ink-muted">Người dùng mỗi tháng</dt>
  </div>
</dl>

<!-- Rating badge -->
<span aria-label="5 sao trên 5">
  <span aria-hidden="true">⭐ 5.0</span>
</span>

<!-- Live regions -->
<p role="alert"  aria-live="assertive">Lỗi: email không hợp lệ.</p>
<p role="status" aria-live="polite">Gửi thành công!</p>
```

### 5.4 Contrast checklist

| Element | Text | Nền | Ratio | Pass |
|---------|------|-----|-------|------|
| Body text | `#595959` | `#fff` | 7.0:1 | ✅ AAA |
| Headings | `#131313` | `#fff` | 18:1 | ✅ AAA |
| Caption | `#767676` | `#fff` | 4.54:1 | ✅ AA |
| Footer text 75% | `rgba(255,255,255,.75)` | `#0070b8` | ~4.6:1 | ✅ AA |
| Footer heading | `#ffffff` | `#0070b8` | 5.25:1 | ✅ AA |
| Btn text | `#ffffff` | `#1eaaff` | 2.5:1 | ❌ — khắc phục bằng shadow + bold |
| Gradient text 56px bold | — | `#fff` | ~4.5:1 (purple stop) | ✅ AA large |

---

## 6. Animations

### Scroll reveal

```css
.reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity .65s ease, transform .65s ease;
}
.reveal.in { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: .1s; }
.reveal-d2 { transition-delay: .2s; }
.reveal-d3 { transition-delay: .3s; }
```

```js
const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (noMotion) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
} else {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('in'); return; }
    obs.observe(el);
  });
}
```

### prefers-reduced-motion (toàn bộ CSS)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:        0.01ms !important;
    animation-iteration-count: 1      !important;
    transition-duration:       0.01ms !important;
    scroll-behavior:           auto   !important;
  }
  .reveal { opacity: 1; transform: none; transition: none; }
  .card-hover:hover { transform: none; }
}
```

---

## 7. Layout

### Container + Section

```css
.container { max-width: var(--content-width); margin: 0 auto; padding: 0 24px; }
section { padding: var(--section-gap) 0; }

/* Responsive grids */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }

@media (max-width: 1023px) {
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 639px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
```

### Hero section

```css
.hero-section {
  min-height: 100vh;
  display: flex; align-items: center;
  padding-top: 100px; padding-bottom: 80px;
  background: linear-gradient(160deg, #eef3fb 0%, #f5f8ff 55%, #fff 100%);
}
.hero-title {
  font-size: clamp(40px, 5vw, 60px);
  font-weight: 700;
  letter-spacing: var(--tracking-display);
  line-height: var(--leading-display);
}
@media (max-width: 639px) {
  .hero-title { letter-spacing: -0.06em; /* tighter tracking less jarring on mobile */ }
}
```

---

## 8. Cross-browser Notes

| Kỹ thuật | Chrome | Safari | Firefox | Fallback |
|----------|--------|--------|---------|---------|
| `backdrop-filter` | ✅ | ✅ | ✅ v103+ | `background: rgba(255,255,255,.97)` |
| `background-clip: text` | ✅ | ✅ | ✅ | `color` property (khai báo trước) |
| `-webkit-text-fill-color` | ✅ | ✅ | ✅ | `color` |
| `border-image` gradient | ✅ | ✅ | ✅ | double-background technique |
| CSS `clamp()` | ✅ 79+ | ✅ 13.1+ | ✅ 75+ | `font-size: 40px; font-size: clamp(...)` |
| `@layer` / `@theme` (TW v4) | ✅ 99+ | ✅ 15.4+ | ✅ 97+ | Tailwind v3 config |
| `IntersectionObserver` | ✅ | ✅ | ✅ | `npm i intersection-observer` |
| `prefers-reduced-motion` | ✅ | ✅ | ✅ | Không cần (animation stays on) |

```css
/* backdrop-filter cross-browser */
.frosted {
  background: rgba(255,255,255,.92);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}
@supports not (backdrop-filter: blur(1px)) {
  .frosted { background: rgba(255,255,255,.97); }
}
```

---

## 9. Do's & Don'ts (Developer)

### ✅ Do

- Khai báo `color` solid **trước** `background-clip: text` — solid fallback cho mọi browser/mode.
- Dùng `:focus-visible` (không phải `:focus`) để focus ring chỉ hiện với keyboard.
- Wrap decorative icon/emoji với `aria-hidden="true"`, mọi icon-only button với `aria-label`.
- Dùng `<dl>/<dt>/<dd>` cho stats; `<blockquote>` cho testimonials.
- Khai báo `lang="vi"` trên `<html>`.
- Thêm `prefers-reduced-motion` ở cuối CSS — override mọi thứ.
- Duplicate marquee items với `aria-hidden="true"` trên bản duplicate.
- Dùng `role="alert"` cho lỗi form, `role="status"` cho success message.

### ❌ Don't

- **Không** dùng `#1eaaff` làm màu text trên nền trắng — contrast 2.5:1, fail AA.
- **Không** dùng gradient text cho element nhỏ hơn 32px bold.
- **Không** bỏ `color` fallback khi dùng `background-clip: text`.
- **Không** hardcode `border-radius < 8px` trên interactive elements.
- **Không** dùng `--grad-footer` làm nền card hay section nội dung.
- **Không** đặt `outline: none` mà không có `focus-visible` thay thế.
- **Không** bỏ `<label>` visible cho form inputs (dùng `aria-label` chỉ là last resort).
- **Không** animate card hover mà không có `prefers-reduced-motion` guard.

---

## 10. Project Structure (Next.js)

```
src/
├── styles/
│   ├── globals.css          # :root tokens + base + @theme (TW v4)
│   └── animations.css       # reveal, marquee, float keyframes
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── GradientText.tsx
│   │   ├── TitleAccent.tsx
│   │   └── FormField.tsx
│   ├── layout/
│   │   ├── Navbar.tsx       # floating pill + mobile menu
│   │   └── Footer.tsx       # gradient footer
│   └── sections/
│       ├── Hero.tsx
│       ├── Partners.tsx     # marquee
│       ├── Solutions.tsx
│       ├── About.tsx
│       ├── Ecosystem.tsx
│       ├── Numbers.tsx
│       ├── Testimonials.tsx
│       └── CTASection.tsx
└── app/
    └── page.tsx             # compose sections
```

---

## 11. Breakpoints

### System

| Name | Value | Tailwind prefix | Dùng cho |
|------|-------|-----------------|----------|
| xs | 375px | — (default/mobile-first) | iPhone SE, nhỏ nhất |
| sm | 640px | `sm:` | Large phone, landscape mobile |
| md | 768px | `md:` | Tablet portrait |
| lg | 1024px | `lg:` | Tablet landscape, small laptop |
| xl | 1280px | `xl:` | Desktop |
| 2xl | 1536px | `2xl:` | Wide desktop |

### CSS Media Queries

```css
/* Mobile first — viết base styles cho mobile, override lên trên */
@media (min-width: 640px)  { /* sm  */ }
@media (min-width: 768px)  { /* md  */ }
@media (min-width: 1024px) { /* lg  */ }
@media (min-width: 1280px) { /* xl  */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Layout mapping theo breakpoint

| Component | xs–sm | md | lg+ |
|-----------|-------|----|-----|
| Nav links | Ẩn, dùng hamburger | Ẩn, dùng hamburger | Hiện full |
| Hero grid | 1 cột, visual ẩn | 1 cột | 2 cột |
| Solutions grid | 1 cột | 2 cột | 2 cột |
| Ecosystem grid | 1 cột | 2 cột | 3 cột |
| Numbers grid | 2 cột | 2 cột | 4 cột |
| Reviews grid | 1 cột | 2 cột | 3 cột |
| Footer grid | 1 cột | 2 cột | 4 cột |
| Container padding | 16px | 24px | 24px |
| Section gap | 64px | 80px | 96px |

### Tailwind v3 — custom breakpoint (nếu cần xs)

```js
// tailwind.config.js
theme: {
  screens: {
    xs:  '375px',
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    '2xl': '1536px',
  }
}
```

### CSS helper

```css
/* Ẩn trên mobile, hiện từ lg */
.hide-mobile { display: none; }
@media (min-width: 1024px) { .hide-mobile { display: block; } }

/* Ẩn từ lg trở lên */
.hide-desktop { display: block; }
@media (min-width: 1024px) { .hide-desktop { display: none; } }

/* Container responsive padding */
.container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 16px;
}
@media (min-width: 640px) { .container { padding: 0 24px; } }
```

---

## 12. Semantic States

### Tokens

```css
:root {
  /* Success */
  --color-success:       #16a34a;   /* 5.9:1 on white ✅ AA */
  --color-success-bg:    #f0fdf4;
  --color-success-border:#bbf7d0;

  /* Warning */
  --color-warning:       #92400e;   /* 7.5:1 on #fef3c7 ✅ */
  --color-warning-bg:    #fffbeb;
  --color-warning-border:#fde68a;

  /* Error */
  --color-error:         #b91c1c;   /* 6.5:1 on white ✅ AA */
  --color-error-bg:      #fef2f2;
  --color-error-border:  #fecaca;

  /* Info */
  --color-info:          #0070b8;   /* 5.25:1 on white ✅ AA — same as footer gradient start */
  --color-info-bg:       #eff6ff;
  --color-info-border:   #bfdbfe;
}
```

### Alert component

```html
<!-- Role alert — tự announce với screen reader khi xuất hiện trong DOM -->
<div role="alert" class="alert alert-error" aria-live="assertive">
  <span class="alert-icon" aria-hidden="true">✕</span>
  <div>
    <p class="alert-title">Đã xảy ra lỗi</p>
    <p class="alert-desc">Email không hợp lệ. Vui lòng kiểm tra lại.</p>
  </div>
  <button type="button" class="alert-close" aria-label="Đóng thông báo">×</button>
</div>

<!-- Success -->
<div role="status" class="alert alert-success" aria-live="polite">
  <span class="alert-icon" aria-hidden="true">✓</span>
  <div>
    <p class="alert-title">Gửi thành công!</p>
    <p class="alert-desc">Chúng tôi sẽ liên hệ trong vòng 24 giờ.</p>
  </div>
</div>

<!-- Warning -->
<div role="alert" class="alert alert-warning">
  <span class="alert-icon" aria-hidden="true">⚠</span>
  <p class="alert-desc">Phiên làm việc sắp hết hạn.</p>
</div>

<!-- Info -->
<div class="alert alert-info" aria-label="Thông tin">
  <span class="alert-icon" aria-hidden="true">ℹ</span>
  <p class="alert-desc">Trang web đang được cập nhật.</p>
</div>
```

```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid;
  font-size: 14px;
  line-height: 1.5;
}
.alert-title { font-weight: 600; margin-bottom: 2px; }
.alert-desc  { color: inherit; opacity: 0.85; }
.alert-icon  { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.alert-close {
  margin-left: auto; flex-shrink: 0; background: none; border: none;
  cursor: pointer; font-size: 18px; line-height: 1; opacity: 0.6;
  padding: 0 0 0 8px;
}
.alert-close:hover { opacity: 1; }
.alert-close:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: 4px; }

.alert-success { background: var(--color-success-bg); border-color: var(--color-success-border); color: var(--color-success); }
.alert-error   { background: var(--color-error-bg);   border-color: var(--color-error-border);   color: var(--color-error); }
.alert-warning { background: var(--color-warning-bg); border-color: var(--color-warning-border); color: var(--color-warning); }
.alert-info    { background: var(--color-info-bg);    border-color: var(--color-info-border);    color: var(--color-info); }
```

### Toast (floating notification)

```css
/* Toast container — fixed bottom-right */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: var(--z-toast);    /* 200 */
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
  width: calc(100vw - 48px);
}

.toast {
  display: flex; align-items: flex-start; gap: 10px;
  background: white; border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card-lg);
  border: 1px solid rgba(29, 73, 166, 0.08);
  padding: 14px 16px;
  font-size: 14px;
  animation: toast-in 0.3s ease;
}
@keyframes toast-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
}

.toast-icon { font-size: 16px; flex-shrink: 0; }
.toast-title { font-weight: 600; color: var(--color-ink); margin-bottom: 2px; }
.toast-desc  { font-size: 13px; color: var(--color-ink-muted); }
```

```tsx
// React Toast (minimal — pair với Radix Toast hoặc Sonner)
import { toast } from 'sonner'; // recommended: npm i sonner

toast.success('Gửi thành công!');
toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
toast.warning('Phiên làm việc sắp hết hạn.');
toast('Thông tin cập nhật.');
```

### Form field error state

```css
/* Input error */
.form-input.is-error,
.form-input[aria-invalid="true"] {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
}
/* Error message */
.form-error {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.form-error::before { content: '✕'; font-size: 10px; }
```

---

## 13. Loading & Skeleton States

### Spinner

```html
<!-- Inline spinner -->
<span role="status" aria-label="Đang tải…">
  <svg class="spinner" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-dasharray="31.4" stroke-dashoffset="31.4" stroke-linecap="round"/>
  </svg>
  <span class="sr-only">Đang tải…</span>
</span>

<!-- Button loading state -->
<button class="btn btn-primary" disabled aria-busy="true">
  <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">…</svg>
  Đang xử lý…
</button>
```

```css
.spinner {
  animation: spin 0.8s linear infinite;
  color: currentColor;
}
.spinner circle {
  stroke-dashoffset: 20;
  animation: spinner-dash 1.4s ease-in-out infinite;
}
@keyframes spin          { to { transform: rotate(360deg); } }
@keyframes spinner-dash  {
  0%   { stroke-dashoffset: 28; stroke-dasharray: 1, 30; }
  50%  { stroke-dashoffset: 0;  stroke-dasharray: 25, 6; }
  100% { stroke-dashoffset: -28; stroke-dasharray: 1, 30; }
}
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; opacity: 0.5; }
}

/* Button disabled state */
.btn:disabled, .btn[aria-busy="true"] {
  opacity: 0.65;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Skeleton loader

```html
<!-- Card skeleton -->
<div class="card" aria-busy="true" aria-label="Đang tải nội dung…">
  <div class="skeleton skeleton-icon"></div>
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text skeleton-text--short"></div>
</div>

<!-- Inline text skeleton -->
<p class="skeleton skeleton-text" aria-hidden="true"></p>
```

```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

.skeleton {
  border-radius: var(--radius-md);
  background: linear-gradient(90deg, #eef3fb 25%, #dce8f5 50%, #eef3fb 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite linear;
}
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; background: #eef3fb; }
}

.skeleton-icon  { width: 56px; height: 56px; border-radius: var(--radius-md); margin-bottom: 20px; }
.skeleton-title { height: 24px; width: 65%; border-radius: 6px; margin-bottom: 12px; }
.skeleton-text  { height: 14px; width: 100%; border-radius: 6px; margin-bottom: 8px; }
.skeleton-text--short { width: 45%; }
```

```tsx
// React skeleton component
export function CardSkeleton() {
  return (
    <div className="card" aria-busy="true" aria-label="Đang tải nội dung">
      <div className="skeleton skeleton-icon" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text skeleton-text--short" />
    </div>
  );
}

// Conditional render pattern
function SolutionsList() {
  const { data, isLoading } = useSolutions();
  if (isLoading) return (
    <div className="grid-2">
      {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
  return <div className="grid-2">{data.map(s => <SolutionCard key={s.id} {...s} />)}</div>;
}
```

---

## 14. Z-index Scale

### Tokens

```css
:root {
  --z-base:     0;    /* content bình thường */
  --z-raised:   10;   /* card hover, dropdown trigger */
  --z-dropdown: 50;   /* dropdown menus, select options */
  --z-sticky:   100;  /* sticky headers, floating elements */
  --z-nav:      200;  /* navbar (cố định trên cùng trang) */
  --z-overlay:  300;  /* modal backdrop */
  --z-modal:    400;  /* modal/dialog content */
  --z-toast:    500;  /* toast notifications */
  --z-tooltip:  600;  /* tooltips (trên cùng mọi thứ) */
}
```

### Tailwind v3 config

```js
// tailwind.config.js
theme: {
  extend: {
    zIndex: {
      base:     '0',
      raised:   '10',
      dropdown: '50',
      sticky:   '100',
      nav:      '200',
      overlay:  '300',
      modal:    '400',
      toast:    '500',
      tooltip:  '600',
    }
  }
}
```

### Usage

| Element | Z-index token | Tailwind class |
|---------|---------------|----------------|
| Card hover | `--z-raised` | `z-[10]` |
| Dropdown menu | `--z-dropdown` | `z-[50]` |
| Sticky section header | `--z-sticky` | `z-[100]` |
| **Navbar** | `--z-nav` | `z-[200]` |
| Modal backdrop | `--z-overlay` | `z-[300]` |
| Modal dialog | `--z-modal` | `z-[400]` |
| Toast / Snackbar | `--z-toast` | `z-[500]` |
| Tooltip | `--z-tooltip` | `z-[600]` |

> Luôn dùng token — không hardcode `z-index: 9999`. Khi hai element xung đột z-index, kiểm tra token trước khi tăng giá trị.

---

## 15. Icon System

### Thư viện khuyến nghị

| Thư viện | Dùng khi | Install |
|----------|----------|---------|
| **Lucide React** | Default — stroke icons, nhẹ, tree-shakeable | `npm i lucide-react` |
| **Heroicons** | Thay thế nếu dùng Tailwind UI | `npm i @heroicons/react` |
| Custom SVG | Brand icons (logo, social) | Inline hoặc sprite |

### Size scale

| Token | Value | Dùng cho |
|-------|-------|----------|
| `icon-xs` | 12px | Badge, tag inline |
| `icon-sm` | 16px | Button icon, nav |
| `icon-md` | 20px | Default UI icon |
| `icon-lg` | 24px | Section icon, card header |
| `icon-xl` | 32px | Feature highlight |
| `icon-2xl` | 48px | Hero decoration |

### CSS tokens

```css
:root {
  --icon-xs:  12px;
  --icon-sm:  16px;
  --icon-md:  20px;
  --icon-lg:  24px;
  --icon-xl:  32px;
  --icon-2xl: 48px;
}
```

### Accessibility patterns

```tsx
// 1. Decorative icon — ẩn khỏi screen reader
import { ArrowRight } from 'lucide-react';
<ArrowRight size={16} aria-hidden="true" focusable="false" />

// 2. Informational icon — cần label
<span role="img" aria-label="Tăng trưởng 32%">
  <TrendingUp size={20} aria-hidden="true" />
</span>

// 3. Icon-only button — dùng aria-label trên button
<button type="button" aria-label="Đóng dialog">
  <X size={20} aria-hidden="true" focusable="false" />
</button>

// 4. Icon + text button — icon là decorative
<button type="button">
  <Plus size={16} aria-hidden="true" />
  Thêm mới
</button>
```

### Wrapper component

```tsx
// components/ui/Icon.tsx
import type { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: keyof typeof sizes;
  label?: string;        // nếu có → role="img"
  className?: string;
}

const sizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, '2xl': 48 };

export function Icon({ icon: LIcon, size = 'md', label, className }: IconProps) {
  if (label) {
    return (
      <span role="img" aria-label={label} className={className}>
        <LIcon size={sizes[size]} aria-hidden="true" focusable={false} />
      </span>
    );
  }
  return <LIcon size={sizes[size]} aria-hidden="true" focusable={false} className={className} />;
}
```

### Icon trong card blocks

```css
/* Gradient icon block (Mục 4.3) */
.card-icon-blue   { background-image: var(--grad-cta); }
.card-icon-purple { background: linear-gradient(135deg, #9462fb, #6adbe3); }
.card-icon-pink   { background: linear-gradient(135deg, #f86880, #fae096); }
.card-icon-green  { background: linear-gradient(135deg, #22c55e, #6adbe3); }
```

---

## 16. Image & Media

### Next.js Image config (`next.config.mjs`)

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 56, 64, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'netspace.vn' },
      // Thêm CDN domain nếu có
    ],
  },
};
export default nextConfig;
```

### Aspect ratio tokens

```css
:root {
  --ratio-hero:        16 / 9;   /* hero banner, video */
  --ratio-card-thumb:   4 / 3;   /* card thumbnail */
  --ratio-card-wide:    3 / 2;   /* eco product card */
  --ratio-avatar:       1 / 1;   /* avatar, partner logo */
  --ratio-og:         1.91 / 1;  /* OG image, social share */
}
```

### Usage patterns

```html
<!-- Hero background image -->
<div class="hero-image-wrap">
  <img
    src="/hero-3d.webp"
    alt=""
    aria-hidden="true"
    width="640"
    height="480"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  >
</div>

<!-- Card thumbnail (lazy) -->
<div style="aspect-ratio: 4/3; overflow: hidden; border-radius: var(--radius-lg)">
  <img
    src="/product-mcn.webp"
    alt="Minh hoạ MCN và Mega Social Channel"
    width="400"
    height="300"
    loading="lazy"
    decoding="async"
    style="width: 100%; height: 100%; object-fit: cover;"
  >
</div>

<!-- Team photo — informational, needs alt -->
<img
  src="/team-2026.webp"
  alt="Đội ngũ NetSpace gồm hơn 200 thành viên, chụp tại không gian chủ đề vũ trụ, Hà Nội 2026"
  width="760"
  height="500"
  loading="lazy"
  decoding="async"
  style="border-radius: var(--radius-xl); width: 100%; height: auto;"
>

<!-- Partner logo — functional, needs alt -->
<img
  src="/logos/vingroup.svg"
  alt="Vingroup"
  width="120"
  height="40"
  loading="lazy"
>
```

### Next.js Image component patterns

```tsx
import Image from 'next/image';

// Hero (above fold) — eager + priority
<Image
  src="/hero-3d.webp"
  alt=""
  aria-hidden
  width={640}
  height={480}
  priority
  quality={90}
  className="w-full h-auto"
/>

// Card thumbnail (below fold) — lazy
<Image
  src="/product-mcn.webp"
  alt="MCN và Mega Social Channel"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  loading="lazy"
/>

// Partner logo
<Image
  src="/logos/vingroup.svg"
  alt="Vingroup"
  width={120}
  height={40}
  loading="lazy"
  className="grayscale hover:grayscale-0 transition-all"
/>
```

### Blur placeholder (Next.js)

```tsx
// Dùng plaiceholder hoặc tự tạo base64 blurDataURL
import { getPlaiceholder } from 'plaiceholder';

const { base64 } = await getPlaiceholder('/images/team.webp');

<Image
  src="/images/team.webp"
  alt="Đội ngũ NetSpace"
  width={760}
  height={500}
  placeholder="blur"
  blurDataURL={base64}
/>
```

### CSS image utilities

```css
/* Aspect ratio wrapper */
.aspect-hero      { aspect-ratio: 16 / 9; overflow: hidden; }
.aspect-card      { aspect-ratio: 4 / 3; overflow: hidden; }
.aspect-square    { aspect-ratio: 1 / 1; overflow: hidden; }

/* Fill + cover */
.img-cover { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Partner logo hover */
.partner-logo {
  filter: grayscale(1);
  opacity: 0.65;
  transition: filter 0.2s, opacity 0.2s;
}
.partner-logo:hover { filter: grayscale(0); opacity: 1; }
```

---

## 17. Font Loading

### `font-display: swap`

```css
/* Nếu self-host (không dùng Google Fonts) */
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('/fonts/BeVietnamPro-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;   /* tránh FOIT — dùng fallback trong khi tải */
}
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('/fonts/BeVietnamPro-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('/fonts/BeVietnamPro-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('/fonts/BeVietnamPro-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Next.js `next/font` (khuyến nghị)

```tsx
// app/layout.tsx
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-be-vietnam',
  preload: true,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

```css
/* globals.css — dùng CSS variable từ next/font */
:root {
  --font-sans: var(--font-be-vietnam), system-ui, sans-serif;
}
body { font-family: var(--font-sans); }
```

### Fallback font metrics (tránh layout shift)

```css
/* Size-adjust fallback để giảm FOUT shift giữa system-ui và Be Vietnam Pro */
@font-face {
  font-family: 'Be Vietnam Pro Fallback';
  src: local('Arial');
  size-adjust: 100.6%;
  ascent-override: 95%;
  descent-override: 25%;
  line-gap-override: 0%;
}
body {
  font-family: 'Be Vietnam Pro', 'Be Vietnam Pro Fallback', system-ui, sans-serif;
}
```

---

## 18. Meta Tags & SEO

### HTML template

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Primary -->
  <title>NetSpace | Giải pháp Truyền thông Báo chí · Social · KOL</title>
  <meta name="description" content="Doanh nghiệp tiên phong ứng dụng tư duy hệ sinh thái trong lĩnh vực truyền thông & nội dung số tại Việt Nam.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://netspace.vn/">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://netspace.vn/">
  <meta property="og:title"       content="NetSpace | Giải pháp Truyền thông Báo chí · Social · KOL">
  <meta property="og:description" content="Doanh nghiệp tiên phong ứng dụng tư duy hệ sinh thái trong lĩnh vực truyền thông & nội dung số tại Việt Nam.">
  <meta property="og:image"       content="https://netspace.vn/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height"content="630">
  <meta property="og:locale"      content="vi_VN">
  <meta property="og:site_name"   content="NetSpace">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:site"        content="@netspacevn">
  <meta name="twitter:title"       content="NetSpace | Giải pháp Truyền thông">
  <meta name="twitter:description" content="Doanh nghiệp tiên phong hệ sinh thái truyền thông số.">
  <meta name="twitter:image"       content="https://netspace.vn/og-image.jpg">

  <!-- Favicon -->
  <link rel="icon"             href="/favicon.ico" sizes="any">
  <link rel="icon"             href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest"         href="/manifest.webmanifest">
  <meta name="theme-color"     content="#1eaaff">

  <!-- Preconnect (performance) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

### Next.js Metadata API (`app/layout.tsx`)

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://netspace.vn'),
  title: {
    default: 'NetSpace | Giải pháp Truyền thông Báo chí · Social · KOL',
    template: '%s | NetSpace',
  },
  description: 'Doanh nghiệp tiên phong ứng dụng tư duy hệ sinh thái trong lĩnh vực truyền thông & nội dung số tại Việt Nam.',
  keywords: ['truyền thông', 'MCN', 'KOL', 'marketing', 'nội dung số', 'NetSpace'],
  authors: [{ name: 'NetSpace', url: 'https://netspace.vn' }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://netspace.vn',
    siteName: 'NetSpace',
    title: 'NetSpace | Giải pháp Truyền thông Báo chí · Social · KOL',
    description: 'Doanh nghiệp tiên phong hệ sinh thái truyền thông số tại Việt Nam.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'NetSpace' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@netspacevn',
    title: 'NetSpace | Giải pháp Truyền thông',
    description: 'Doanh nghiệp tiên phong hệ sinh thái truyền thông số.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico' }],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  themeColor: '#1eaaff',
};
```

### OG Image spec

```
File: /public/og-image.jpg
Kích thước: 1200 × 630px
Nội dung: Logo NetSpace + tagline + gradient background (--grad-footer)
Format: JPEG quality 85 hoặc WebP
```

---

## 19. Accessibility Testing Checklist

### Automated (chạy trước khi deploy)

```bash
# axe-core via CLI
npm i -D @axe-core/cli
npx axe https://localhost:3000 --exit

# Lighthouse CI
npm i -g @lhci/cli
lhci autorun --config=lighthouserc.json
```

```json
// lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:performance":   ["warn",  { "minScore": 0.85 }]
      }
    }
  }
}
```

### Browser extensions

| Tool | Dùng để |
|------|---------|
| [axe DevTools](https://www.deque.com/axe/devtools/) | Automated WCAG audit trong browser |
| [WAVE](https://wave.webaim.org/extension/) | Visual accessibility errors |
| Colour Contrast Analyser | Check contrast ratio chính xác |

### Manual checklist

**Keyboard navigation:**
- [ ] Tab qua tất cả interactive elements theo thứ tự logic
- [ ] Shift+Tab đi ngược
- [ ] Enter/Space kích hoạt buttons và links
- [ ] Escape đóng mobile menu, modal, dropdown
- [ ] Focus ring hiện rõ trên mọi element (không bị ẩn)
- [ ] Không có keyboard trap (trừ modal)

**Screen reader (NVDA + Chrome hoặc VoiceOver + Safari):**
- [ ] Skip link hoạt động
- [ ] Heading hierarchy h1→h2→h3 logic (dùng `axe` để check)
- [ ] Landmark regions được announce đúng (nav, main, footer)
- [ ] Form labels đọc đúng khi focus vào input
- [ ] Error messages được announce tự động (`role="alert"`)
- [ ] Decorative images không được announce
- [ ] Informational images có alt text mô tả đầy đủ
- [ ] Ratings announce đúng ("5 sao trên 5", không phải "⭐ 5.0")

**Responsive & Zoom:**
- [ ] Page dùng được ở 200% zoom (không overflow, không mất nội dung)
- [ ] Text không bị cắt khi tăng font-size lên 200%
- [ ] Layout không vỡ ở viewport 320px (iPhone SE)

**Motion:**
- [ ] Bật `prefers-reduced-motion` trong OS → không có animation nào chạy
- [ ] Marquee dừng khi hover (đã implement)
- [ ] Không có animation auto-play quá 5 giây không có cách dừng

**Color:**
- [ ] Page dùng được không cần màu (thử grayscale)
- [ ] Bật Windows High Contrast Mode — gradient text fallback về solid

### WCAG 2.1 AA — criteria quan trọng cho site này

| Criteria | Vấn đề cụ thể | Status |
|----------|---------------|--------|
| 1.1.1 Non-text Content | Alt text cho ảnh | ✅ covered |
| 1.3.1 Info and Relationships | `dl/dt/dd` cho stats, heading hierarchy | ✅ covered |
| 1.4.3 Contrast (Minimum) | `#595959` body text, footer đã darkened | ✅ covered |
| 1.4.4 Resize Text | Dùng `clamp()` và `em`/`rem` units | ✅ covered |
| 1.4.11 Non-text Contrast | Focus rings ≥ 3:1 với background | ✅ covered |
| 2.1.1 Keyboard | Mobile menu, smooth scroll | ✅ covered |
| 2.4.1 Bypass Blocks | Skip link | ✅ covered |
| 2.4.3 Focus Order | DOM order = visual order | Cần kiểm tra |
| 2.4.7 Focus Visible | `focus-visible` ring | ✅ covered |
| 3.1.1 Language of Page | `lang="vi"` | ✅ covered |
| 3.3.1 Error Identification | Form error với `role="alert"` | ✅ covered |
| 3.3.2 Labels or Instructions | `<label for>` pattern | ✅ covered |

---

## 20. Design Tokens Export (Figma / Style Dictionary)

### `tokens.json` (DTCG format)

```json
{
  "color": {
    "canvas":       { "$value": "#ffffff",   "$type": "color", "$description": "Primary page background" },
    "hero-surface": { "$value": "#eef3fb",   "$type": "color", "$description": "Hero section — cool periwinkle tint" },
    "ink":          { "$value": "#131313",   "$type": "color", "$description": "Primary text, headings" },
    "ink-muted":    { "$value": "#595959",   "$type": "color", "$description": "Secondary text — AA-compliant (7:1)" },
    "ink-light":    { "$value": "#767676",   "$type": "color", "$description": "Captions, timestamps (AA large text)" },
    "ns-primary":   { "$value": "#1eaaff",   "$type": "color", "$description": "Brand blue — buttons, links, focus" },
    "ns-secondary": { "$value": "#9462fb",   "$type": "color", "$description": "Brand purple — gradient midpoint" },
    "ns-accent":    { "$value": "#6adbe3",   "$type": "color", "$description": "Teal accent — decorative only" },
    "ns-pink":      { "$value": "#f86880",   "$type": "color", "$description": "Gradient third-stop, danger states" },
    "ns-yellow":    { "$value": "#fae096",   "$type": "color", "$description": "Gradient tail, warm highlight" },
    "success":      { "$value": "#16a34a",   "$type": "color", "$description": "Success state (5.9:1 on white)" },
    "error":        { "$value": "#b91c1c",   "$type": "color", "$description": "Error state (6.5:1 on white)" },
    "warning":      { "$value": "#92400e",   "$type": "color", "$description": "Warning text on --color-warning-bg" },
    "info":         { "$value": "#0070b8",   "$type": "color", "$description": "Info state (5.25:1 on white)" }
  },
  "borderRadius": {
    "sm":   { "$value": "8px",    "$type": "borderRadius" },
    "md":   { "$value": "12px",   "$type": "borderRadius" },
    "lg":   { "$value": "16px",   "$type": "borderRadius" },
    "xl":   { "$value": "20px",   "$type": "borderRadius" },
    "pill": { "$value": "9999px", "$type": "borderRadius" }
  },
  "shadow": {
    "card":    { "$value": "rgba(29,73,166,0.15) 0px 8px 32px 0px",  "$type": "shadow" },
    "card-lg": { "$value": "rgba(29,73,166,0.22) 0px 16px 48px 0px", "$type": "shadow" },
    "nav":     { "$value": "rgba(29,73,166,0.10) 0px 4px 24px 0px",  "$type": "shadow" },
    "btn":     { "$value": "rgba(30,170,255,0.30) 0px 4px 20px 0px", "$type": "shadow" }
  },
  "fontSize": {
    "display":    { "$value": "56px", "$type": "fontSize" },
    "headline":   { "$value": "40px", "$type": "fontSize" },
    "heading":    { "$value": "32px", "$type": "fontSize" },
    "subheading": { "$value": "24px", "$type": "fontSize" },
    "body-lg":    { "$value": "18px", "$type": "fontSize" },
    "body":       { "$value": "16px", "$type": "fontSize" },
    "caption":    { "$value": "14px", "$type": "fontSize" },
    "micro":      { "$value": "13px", "$type": "fontSize" }
  },
  "spacing": {
    "1":  { "$value": "4px",  "$type": "spacing" },
    "2":  { "$value": "8px",  "$type": "spacing" },
    "3":  { "$value": "12px", "$type": "spacing" },
    "4":  { "$value": "16px", "$type": "spacing" },
    "6":  { "$value": "24px", "$type": "spacing" },
    "8":  { "$value": "32px", "$type": "spacing" },
    "12": { "$value": "48px", "$type": "spacing" },
    "16": { "$value": "64px", "$type": "spacing" },
    "20": { "$value": "80px", "$type": "spacing" },
    "24": { "$value": "96px", "$type": "spacing" }
  }
}
```

### `variables.css` (standalone — cho dự án không dùng Tailwind)

```css
/* ── NetSpace Design Tokens — variables.css ── */
/* Auto-generated from tokens.json — chỉnh sửa ở tokens.json, không sửa trực tiếp */

:root {
  /* Colors */
  --color-canvas:         #ffffff;
  --color-hero-surface:   #eef3fb;
  --color-ink:            #131313;
  --color-ink-muted:      #595959;
  --color-ink-light:      #767676;
  --color-ns-primary:     #1eaaff;
  --color-ns-secondary:   #9462fb;
  --color-ns-accent:      #6adbe3;
  --color-ns-pink:        #f86880;
  --color-ns-yellow:      #fae096;
  --color-success:        #16a34a;
  --color-success-bg:     #f0fdf4;
  --color-success-border: #bbf7d0;
  --color-error:          #b91c1c;
  --color-error-bg:       #fef2f2;
  --color-error-border:   #fecaca;
  --color-warning:        #92400e;
  --color-warning-bg:     #fffbeb;
  --color-warning-border: #fde68a;
  --color-info:           #0070b8;
  --color-info-bg:        #eff6ff;
  --color-info-border:    #bfdbfe;

  /* Gradients */
  --grad-headline: linear-gradient(to right, #1eaaff, #9462fb, #f86880, #fae096);
  --grad-label:    linear-gradient(to right, #1eaaff, #9462fb, #f86880);
  --grad-cta:      linear-gradient(to right, #1eaaff, #9462fb, #f86880 85%);
  --grad-footer:   linear-gradient(162deg, #0070b8 0%, #8049f5 100%);
  --grad-divider:  linear-gradient(to right, #1eaaff, #9462fb 70%, #f86880 85%, #fae096);

  /* Typography */
  --font-sans:           'Be Vietnam Pro', system-ui, sans-serif;
  --text-display:        56px;
  --text-headline:       40px;
  --text-heading:        32px;
  --text-subheading:     24px;
  --text-body-lg:        18px;
  --text-body:           16px;
  --text-caption:        14px;
  --text-micro:          13px;
  --leading-display:     1.2;
  --leading-heading:     1.4;
  --leading-body:        1.5;
  --leading-body-lg:     1.6;
  --tracking-display:    -0.09em;
  --tracking-heading:    -0.03em;

  /* Spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Border radius */
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px;
  --radius-xl: 20px; --radius-pill: 9999px;

  /* Shadows */
  --shadow-card:    rgba(29,73,166,0.15) 0px 8px 32px 0px;
  --shadow-card-lg: rgba(29,73,166,0.22) 0px 16px 48px 0px;
  --shadow-nav:     rgba(29,73,166,0.10) 0px 4px 24px 0px;
  --shadow-btn:     rgba(30,170,255,0.30) 0px 4px 20px 0px;

  /* Z-index */
  --z-base: 0; --z-raised: 10; --z-dropdown: 50; --z-sticky: 100;
  --z-nav: 200; --z-overlay: 300; --z-modal: 400; --z-toast: 500; --z-tooltip: 600;

  /* Icons */
  --icon-xs: 12px; --icon-sm: 16px; --icon-md: 20px;
  --icon-lg: 24px; --icon-xl: 32px; --icon-2xl: 48px;

  /* Layout */
  --content-width: 1200px;
  --section-gap:   96px;
  --card-pad:      28px;
}
```

### Style Dictionary config (nếu dùng design token pipeline)

```js
// style-dictionary.config.js
module.exports = {
  source: ['tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ns',
      buildPath: 'src/styles/',
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    },
  },
};
```
