(() => {
  'use strict';
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. Minigame 1: vòng quay may mắn ---------- */
  // Thứ tự giải trùng thứ tự ô màu của conic-gradient: bắt đầu từ đỉnh, theo chiều kim đồng hồ.
  const wheel = $('#mgWheel');
  if (wheel) {
    const PRIZES = ['Voucher 200K', 'Áo thun', 'Bình nước', 'Sổ tay',
                    'Voucher 500K', 'Túi vải', 'Thêm lượt', 'Chúc may mắn lần sau'];
    const SEG = 360 / PRIZES.length, btn = $('#mg1Btn'), out = $('#mg1Out');
    let rot = 0, busy = false;
    btn.addEventListener('click', () => {
      if (busy) return;
      busy = true; btn.disabled = true; out.textContent = 'Đang quay…';
      const k = Math.floor(Math.random() * PRIZES.length);
      const target = (360 - (k * SEG + SEG / 2)) % 360;      // đưa tâm ô k về dưới kim ở đỉnh
      const cur = ((rot % 360) + 360) % 360;
      rot += 360 * 5 + ((target - cur + 360) % 360);
      wheel.style.transform = `rotate(${rot}deg)`;
      const done = () => { busy = false; btn.disabled = false; out.textContent = 'Bạn trúng: ' + PRIZES[k]; };
      reduce.matches ? done() : setTimeout(done, 4300);
    });
  }

  /* ---------- 2. Minigame 2 & 3: bốc thăm check-in, Lucky Draw ---------- */
  // Tên / mã nhảy liên tục ngay trên dòng kết quả dưới nút rồi dừng ở người trúng.
  // Trong lúc nhảy đánh dấu aria-busy để trình đọc màn hình chỉ đọc kết quả cuối.
  const draw = (btn, out, pool, label) => {
    if (!btn || !out) return;
    let busy = false;
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    btn.addEventListener('click', () => {
      if (busy) return;
      busy = true; btn.disabled = true;
      const win = pick();
      const done = () => { out.removeAttribute('aria-busy'); out.textContent = label + win; busy = false; btn.disabled = false; };
      if (reduce.matches) return done();
      out.setAttribute('aria-busy', 'true');
      const t = setInterval(() => { out.textContent = label + pick(); }, 80);
      setTimeout(() => { clearInterval(t); done(); }, 2200);
    });
  };
  const NAMES = ['Nguyễn Minh Anh', 'Trần Bảo Ngọc', 'Lê Hoàng Nam', 'Phạm Thu Hà',
                 'Đỗ Quang Huy', 'Vũ Khánh Linh', 'Bùi Đức Anh', 'Hoàng Mai Chi'];
  const CODES = Array.from({ length: 12 }, (_, i) => 'NE-2026-00' + (312 + i * 7));
  draw($('#mg2Btn'), $('#mg2Out'), NAMES, 'Người trúng: ');
  draw($('#mg3Btn'), $('#mg3Out'), CODES, 'Mã trúng: ');

  /* ---------- 3. Form nhận tư vấn ---------- */
  const form = $('#regForm'), doneBox = $('#regDone');
  if (form) {
    const f = { name: $('#regName'), phone: $('#regPhone'), email: $('#regEmail') };
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, PHONE = /^[\d\s().+-]{9,16}$/;
    const ok = {
      name:  () => !!f.name.value.trim(),
      phone: () => PHONE.test(f.phone.value.trim()),
      email: () => !f.email.value.trim() || EMAIL.test(f.email.value.trim()),
    };
    const mark = k => {
      const good = ok[k]();
      $('#err-' + k).hidden = good;
      f[k].closest('.ns-field').dataset.invalid = String(!good);
      return good;
    };
    let live = false;                         // sau lần gửi hỏng đầu tiên thì kiểm tra ngay khi gõ
    Object.keys(f).forEach(k => {
      f[k].addEventListener('blur', () => { if (f[k].value.trim() || live) mark(k); });
      f[k].addEventListener('input', () => { if (live) mark(k); });
    });

    // CHƯA NỐI BACKEND: thay thân hàm này bằng lệnh gửi thật (fetch tới API / CRM).
    const send = async data => data;
    const submit = form.querySelector('[type=submit]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      live = true;
      if (!Object.keys(f).map(mark).every(Boolean)) {
        const first = form.querySelector('[data-invalid="true"] .ns-field__input');
        if (first) first.focus();
        return;
      }
      submit.disabled = true; submit.setAttribute('aria-busy', 'true');
      try {
        await send(Object.fromEntries(new FormData(form)));
        form.hidden = true; doneBox.hidden = false; doneBox.focus();
      } finally {
        submit.disabled = false; submit.removeAttribute('aria-busy');
      }
    });
  }

  /* ---------- 4. Hiện dần khi cuộn (trang Mini Game) ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.rv').forEach(el => io.observe(el));

  /* ---------- 7. Viền sáng thẻ loại hình (phỏng theo BorderGlow của React Bits) ---------- */
  // Rê chuột gần mép: vệt sáng bám theo hướng con trỏ. Vừa rê vào: vệt sáng chạy một vòng quanh thẻ.
  const glowCards = $$('.bg-card');
  if (glowCards.length) {
    const geom = (el, e) => {
      const r = el.getBoundingClientRect(), cx = r.width / 2, cy = r.height / 2;
      const dx = e.clientX - r.left - cx, dy = e.clientY - r.top - cy;
      const kx = dx ? cx / Math.abs(dx) : Infinity, ky = dy ? cy / Math.abs(dy) : Infinity;
      let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle < 0) angle += 360;
      return { edge: Math.min(Math.max(1 / Math.min(kx, ky), 0), 1) * 100, angle };
    };
    const tween = (ms, ease, step, done) => {
      const t0 = performance.now();
      const tick = now => {
        const t = Math.min((now - t0) / ms, 1);
        step(ease(t));
        if (t < 1) requestAnimationFrame(tick); else if (done) done();
      };
      requestAnimationFrame(tick);
    };
    const linear = t => t, inOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    glowCards.forEach(card => {
      let angle = 0, edge = 0, toAngle = 0, toEdge = 0, follow = 0, last = 0, sweeping = false;
      const paint = () => {
        card.style.setProperty('--edge-proximity', edge.toFixed(2));
        card.style.setProperty('--cursor-angle', angle.toFixed(2) + 'deg');
      };
      // bám theo con trỏ có độ trễ mềm (đi đường ngắn nhất quanh vòng tròn) thay vì nhảy tức thì
      const step = now => {
        const dt = last ? Math.min((now - last) / 1000, .05) : .016; last = now;
        const k = 1 - Math.exp(-dt * 5);
        angle += ((((toAngle - angle) % 360) + 540) % 360 - 180) * k;
        edge += (toEdge - edge) * k;
        paint();
        if (!sweeping && (Math.abs(toEdge - edge) > .2 || Math.abs((((toAngle - angle) % 360) + 540) % 360 - 180) > .2)) {
          follow = requestAnimationFrame(step);
        } else { follow = 0; last = 0; }
      };
      card.addEventListener('pointermove', e => {
        const g = geom(card, e);
        toAngle = g.angle; toEdge = g.edge;
        if (!sweeping && !follow) follow = requestAnimationFrame(step);
      });
      card.addEventListener('pointerleave', () => { toEdge = 0; if (!sweeping && !follow) follow = requestAnimationFrame(step); });
      // vừa rê vào: vệt sáng chạy chậm một vòng quanh thẻ (~3 giây) rồi mờ dần
      card.addEventListener('pointerenter', e => {
        if (sweeping || reduce.matches) return;
        sweeping = true; card.classList.add('sweep-active');
        cancelAnimationFrame(follow); follow = 0; last = 0;
        const from = geom(card, e).angle, e0 = edge;
        tween(600, linear, v => { edge = e0 + (80 - e0) * v; paint(); });
        tween(2800, inOut, v => { angle = from + 360 * v; paint(); });
        setTimeout(() => tween(900, linear, v => { edge = 80 * (1 - v); paint(); }, () => {
          sweeping = false; card.classList.remove('sweep-active');
          angle %= 360;
          if (card.matches(':hover')) follow = requestAnimationFrame(step);   // còn rê chuột thì quay lại bám con trỏ
        }), 2200);
      });
    });
  }

  /* ---------- 8. Nút chính ở hero: vệt sáng chạy theo viền (phỏng theo SpecularButton của React Bits) ---------- */
  // Shader vẽ viền bo tròn của nút; vệt sáng xoay về phía con trỏ và sáng dần khi con trỏ lại gần (trong 250px).
  // Bản gốc dùng thư viện ogl; ở đây viết WebGL2 thuần. Máy không có WebGL2 thì nút vẫn hiển thị bình thường.
  const SB_VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;
  const SB_FRAG = `#version 300 es
precision highp float;
uniform vec2 uCenter; uniform vec2 uHalfSize; uniform float uRadius; uniform float uAngle; uniform float uPx;
uniform vec3 uLineColor; uniform vec3 uBaseColor; uniform float uBaseAlpha; uniform float uIntensity;
uniform float uShineSize; uniform float uShineFade; uniform float uThickness; uniform float uBaseWidth;
out vec4 fragColor;
float sdRoundedRect(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float gaussianLine(float d, float sigma){ float x = d / (sigma + 1e-6); float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x)); return exp(-k * x * x); }
void main(){
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 L = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * uBaseAlpha;
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = gaussianLine(d, uThickness) * rim * edgeClamp * uIntensity;
  fragColor = vec4(uBaseColor * base + uLineColor * hi, clamp(base + hi, 0.0, 1.0));
}`;
  $$('.sb').forEach(btn => {
    const fx = $('.sb__fx', btn), canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!fx || !gl) return;
    const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, SB_VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, SB_FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    fx.appendChild(canvas);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);  // 1 tam giác phủ kín khung
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    const U = n => gl.getUniformLocation(prog, n);
    // Thông số tương ứng props của component: viền trắng, nền viền tím đậm theo design system
    const dpr = Math.min(devicePixelRatio || 1, 2), RADIUS = 999, SPEED = .35, PROXIMITY = 250;
    gl.uniform1f(U('uPx'), dpr);
    gl.uniform3f(U('uLineColor'), 1, 1, 1);
    gl.uniform3f(U('uBaseColor'), 61 / 255, 43 / 255, 184 / 255);
    gl.uniform1f(U('uBaseAlpha'), .3);
    gl.uniform1f(U('uShineSize'), 10 * Math.PI / 180);
    gl.uniform1f(U('uShineFade'), 40 * Math.PI / 180);
    gl.uniform1f(U('uThickness'), 1.3 * dpr);
    gl.uniform1f(U('uBaseWidth'), dpr);
    const uAngle = U('uAngle'), uIntensity = U('uIntensity');

    let raf = 0, visible = false, last = 0, angle = 2.4, idle = 2.4, bright = 0, pAngle = null, near = 0;
    const frame = now => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, .05) : 0; last = now;
      idle += SPEED * dt;
      const target = pAngle == null ? idle : pAngle;
      const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * 7));
      bright += (near - bright) * (1 - Math.exp(-dt * 8));
      gl.uniform1f(uAngle, angle); gl.uniform1f(uIntensity, 1.6 * bright);   // sáng hơn bản gốc vì nút nền gradient sáng
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && (near > 0 || bright > .002)) raf = requestAnimationFrame(frame); else last = 0;
    };
    const kick = () => { if (visible && !raf) raf = requestAnimationFrame(frame); };
    const resize = () => {
      // khung canvas tràn đều quanh nút nên tâm nút = tâm canvas; kích thước lấy theo khung thật (nút có viền 1px)
      const r = btn.getBoundingClientRect(), f = fx.getBoundingClientRect(), w = r.width, h = r.height;
      canvas.width = Math.round(f.width * dpr); canvas.height = Math.round(f.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U('uCenter'), f.width / 2 * dpr, f.height / 2 * dpr);
      gl.uniform2f(U('uHalfSize'), w / 2 * dpr, h / 2 * dpr);
      gl.uniform1f(U('uRadius'), Math.min(RADIUS, w / 2, h / 2) * dpr);
      kick(); if (!raf) frame(performance.now());
    };
    addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dist = Math.hypot(Math.max(r.left - e.clientX, 0, e.clientX - r.right), Math.max(r.top - e.clientY, 0, e.clientY - r.bottom));
      if (dist === 0) {     // trên nút: vệt sáng nằm chéo góc, lắc nhẹ theo vị trí con trỏ
        const nx = (e.clientX - cx) / (r.width / 2), ny = (cy - e.clientY) / (r.height / 2);
        pAngle = Math.atan2(2 / r.height, -2 / r.width) + nx * .3 + ny * .15;
      } else pAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
      const t = Math.max(0, 1 - dist / PROXIMITY);
      near = t * t * (3 - 2 * t);
      kick();
    }, { passive: true });
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(btn);
    new ResizeObserver(resize).observe(btn);
  });

  /* ---------- 9. Minigame: thẻ xếp chồng khi cuộn (phỏng theo ScrollStack của React Bits) ---------- */
  // Thẻ dính bằng position:sticky (CSS). JS thu nhỏ từng thẻ ngay sau khi nó dính: thẻ i về 0.85 + i×0.03,
  // thu nhỏ xong khi vị trí gốc của thẻ chạm 10% chiều cao màn hình. Màn hẹp / giảm chuyển động: không thu nhỏ.
  const stack = $('.mg-stack');
  if (stack) {
    const items = $$('.mg-card', stack), BASE = .85, STEP = .03;
    let rel = [], queued = false;
    const active = () => getComputedStyle(items[0]).position === 'sticky' && !reduce.matches;
    const update = () => {
      queued = false;
      if (!active()) { items.forEach(c => { c.style.transform = ''; }); return; }
      const top0 = stack.getBoundingClientRect().top + scrollY, endPx = .1 * innerHeight;   // đo lại mỗi lần: phần trên trang có thể đổi cao
      items.forEach((c, i) => {
        const nat = top0 + rel[i], start = nat - parseFloat(getComputedStyle(c).top), end = nat - endPx;
        const t = Math.min(Math.max((scrollY - start) / Math.max(end - start, 1), 0), 1);
        c.style.transform = `scale(${(1 - t * (1 - (BASE + i * STEP))).toFixed(4)})`;
      });
    };
    const measure = () => {
      // vị trí gốc (chưa dính) của từng thẻ so với đỉnh khung = chiều cao + lề dưới các thẻ phía trước + khoảng cách
      const cs = getComputedStyle(stack), gap = parseFloat(cs.rowGap) || 0;
      let y = parseFloat(cs.paddingTop) || 0;
      rel = items.map(c => { const t = y; y += c.offsetHeight + (parseFloat(getComputedStyle(c).marginBottom) || 0) + gap; return t; });
      update();
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    new ResizeObserver(measure).observe(stack);
    addEventListener('resize', measure);
  }

  /* ---------- 10. Màn hình laptop ở hero: thu phóng giao diện app (thiết kế ngang 1000px) cho vừa màn ---------- */
  const lapScreen = $('.hx-screen');
  if (lapScreen) {
    const lapApp = $('.hx-app', lapScreen);
    new ResizeObserver(() => lapApp.style.setProperty('--s', (lapScreen.clientWidth / 1000).toFixed(4))).observe(lapScreen);
  }

  /* ---------- 11. Thanh đầu trang: tô mục đang xem khi cuộn (aria-current) ---------- */
  const spyLinks = $$('.ne-navlinks a').filter(a => a.hash && document.getElementById(a.hash.slice(1)));
  if (spyLinks.length) {
    const seen = new Map();
    const mark = () => {
      const cur = spyLinks.map(a => a.hash.slice(1)).filter(id => seen.get(id)).pop();
      spyLinks.forEach(a => a.hash.slice(1) === cur ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    };
    const spy = new IntersectionObserver(es => { es.forEach(e => seen.set(e.target.id, e.isIntersecting)); mark(); },
      { rootMargin: '-45% 0px -50% 0px' });                // mục nào cắt ngang giữa màn hình là mục đang xem
    spyLinks.forEach(a => spy.observe(document.getElementById(a.hash.slice(1))));
  }

  /* ---------- 6. Ngăn kéo menu trên màn hẹp ---------- */
  const burger = $('#burger'), drawer = $('#drawer'), icon = $('#burgerIcon');
  if (burger && drawer) {
    const setDrawer = open => {
      drawer.dataset.open = String(open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
      icon.innerHTML = `<use href="#${open ? 'i-close' : 'i-menu'}"/>`;
    };
    burger.addEventListener('click', () => setDrawer(drawer.dataset.open !== 'true'));
    drawer.addEventListener('click', e => { if (e.target.closest('a')) setDrawer(false); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.dataset.open === 'true') { setDrawer(false); burger.focus(); }
    });
    matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setDrawer(false); });
  }
})();
