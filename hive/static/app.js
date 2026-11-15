// HIVE project page: synchronized players with action-key overlays and the chunk-source ribbon, the teaser mosaic,
// the step-by-step method diagram, the drag-to-compare player, gallery cards with hover previews, nav and reveal effects.
(function () {
  'use strict';
  const D = window.HIVE_DATA;
  const FPS = D.fps, CHUNK = D.chunkFrames;
  const NCHUNK = Math.floor((D.frames + 3) / CHUNK) + 1;          // 41 chunks; chunk c >= 1 covers video frames 12c-3 .. 12c+8
  const chunkOf = (f) => (f <= 8 ? 0 : Math.floor((f + 3) / CHUNK));
  const KEYMAP = { W: 'W', A: 'A', S: 'S', D: 'D', yawL: 'left', yawR: 'right', stop: null };
  const KEYNAME = { W: 'forward', A: 'left', S: 'backward', D: 'right', yawL: 'turn left', yawR: 'turn right', stop: 'no input' };
  const KEYLABEL = { W: 'W', A: 'A', S: 'S', D: 'D', yawL: '\u2190', yawR: '\u2192', stop: '\u2013' };
  const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const COL = { cloud: css.getPropertyValue('--cloud').trim(), dev: css.getPropertyValue('--device').trim(), hive: css.getPropertyValue('--hive').trim(), hybridsd: '#8b90a0', sdvg: '#5d6272', ecdiff: '#b3b7c2' };
  const fmt = (t) => { t = Math.max(0, t); const s = Math.floor(t); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + '.' + Math.floor((t - s) * 10); };
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const actAt = (segs, f) => { for (const s of segs) if (f >= s.f0 && f < s.f1) return s.a; return 'stop'; };
  const playSafe = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  const mkVideo = () => {
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'none'; v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.disablePictureInPicture = true;
    return v;
  };
  const onView = (el, cb, opt) => new IntersectionObserver((es) => es.forEach((e) => cb(e.isIntersecting, e)), opt || { threshold: 0.15 }).observe(el);

  // ---------------------------------------------------------------- key pad
  function keyPad() {
    const pad = h('div', 'keys');
    const keys = {};
    for (const k of ['left', 'W', 'right', 'A', 'S', 'D']) {
      const e = h('div', 'key', { left: '\u2190', right: '\u2192' }[k] || k);
      keys[k] = e; pad.appendChild(e);
    }
    let cur;
    return { el: pad, set(a) { const k = KEYMAP[a] || null; if (k === cur) return; if (cur) keys[cur].classList.remove('on'); if (k) keys[k].classList.add('on'); cur = k; } };
  }
  const label = (arm, cls) => { const A = D.arms[arm]; return h('div', 'vlabel' + (cls ? ' ' + cls : ''), '<i></i>' + A.label + ' <small>' + A.sub + '</small>'); };

  // ---------------------------------------------------------------- panel: one video with its overlays
  function panel(arm, opts) {
    const A = D.arms[arm];
    const root = h('div', 'panel ' + arm);
    const box = h('div', 'vbox wait');
    const v = mkVideo();
    box.appendChild(v);
    const poster = h('img', 'poster'); poster.alt = ''; box.appendChild(poster);
    box.appendChild(label(arm));
    box.appendChild(h('div', 'loading', 'loading'));
    const lag = h('div', 'lag'); box.appendChild(lag);
    const flag = h('div', 'flag', 'new action &middot; device regenerates'); if (arm === 'hive') box.appendChild(flag);
    const pad = keyPad(); box.appendChild(pad.el);
    root.appendChild(box);
    if (opts && opts.chips) {
      const c = h('div', 'chips');
      c.appendChild(h('span', 'chip ' + (A.fps >= 16 ? 'good' : 'bad'), A.fps + ' FPS'));
      c.appendChild(h('span', 'chip', 'quality ' + A.quality.toFixed(2)));
      const cj = h('span', 'chip', 'cloud ' + A.cloudJ + ' J'); cj.title = 'cloud GPU energy per second of video (Table 1)'; c.appendChild(cj);
      root.appendChild(c);
    }
    v.addEventListener('playing', () => box.classList.remove('wait'));
    v.addEventListener('loadeddata', () => { poster.style.display = 'none'; });
    v.addEventListener('waiting', () => box.classList.add('wait'));
    return { arm, root, box, video: v, poster, pad, lag, flag, rate: Math.min(1, A.fps / FPS) };
  }

  // ---------------------------------------------------------------- ribbon: which model generated each chunk of the HIVE video
  function ribbon(container) {
    container.innerHTML = '';
    const lab = h('div', 'ribbon-label');
    lab.appendChild(h('span', '', '<b>HIVE</b> &middot; source of each 0.75-s chunk'));
    lab.appendChild(h('span', 'legend', '<span><i class="sw cloud1"></i>cloud, one step</span><span><i class="sw dev4"></i>device, four steps (action changed)</span><span><i class="sw open"></i>opening chunks (cloud)</span>'));
    container.appendChild(lab);
    const rb = h('div', 'ribbon'); rb.style.gridTemplateColumns = `repeat(${NCHUNK},minmax(0,1fr))`;
    const cells = [];
    for (let c = 0; c < NCHUNK; c++) { const e = h('div', 'cell'); rb.appendChild(e); cells.push(e); }
    container.appendChild(rb);
    const marks = h('div', 'ribbon-marks'); container.appendChild(marks);
    let last = -1;
    return {
      set(entry) {
        const st = new Set(entry.stale);
        cells.forEach((e, c) => {
          e.className = 'cell ' + (c < entry.open ? 'open' : st.has(c) ? 'dev4' : 'cloud1');
          const f0 = c ? CHUNK * c - 3 : 0, t0 = f0 / FPS;
          e.title = `chunk ${c} (${t0.toFixed(2)} s): ` + (c < entry.open ? 'opening chunk from the cloud model' : st.has(c) ? `action changed to "${KEYNAME[actAt(entry.segments, f0 + 4)]}", regenerated by the device with four steps` : 'one-step estimate of the cloud model, decoded on the device');
        });
        marks.innerHTML = '';
        for (const c of entry.stale) {
          const a = actAt(entry.segments, CHUNK * c);
          const m = h('span', 'mk', '<i>' + (a === 'stop' ? '&#9632;' : KEYLABEL[a]) + '</i>' + KEYNAME[a]); m.style.left = ((c + 0.5) / NCHUNK * 100) + '%';
          m.title = 'new action: ' + KEYNAME[a] + '; the device regenerates this chunk'; marks.appendChild(m);
        }
        last = -1;
      },
      tick(t) {
        const c = Math.min(NCHUNK - 1, chunkOf(Math.floor(t * FPS)));
        if (c === last) return; last = c;
        cells.forEach((e, i) => { e.classList.toggle('past', i < c); e.classList.toggle('now', i === c); });
      },
    };
  }

  // ---------------------------------------------------------------- player bar
  function bar(container, group) {
    container.innerHTML = '';
    const btn = h('button', 'pbtn'); btn.type = 'button'; btn.setAttribute('aria-label', 'Play or pause');
    const PLAY = '<svg viewBox="0 0 12 12"><path d="M2.5 1l8.5 5-8.5 5z"/></svg>', PAUSE = '<svg viewBox="0 0 12 12"><path d="M2 1h3v10H2zM7 1h3v10H7z"/></svg>';
    btn.innerHTML = PAUSE;
    const sc = h('div', 'scrub'); sc.setAttribute('role', 'slider'); sc.setAttribute('aria-label', 'Seek'); sc.tabIndex = 0;
    const track = h('div', 'track'), fill = h('div', 'fill'), knob = h('div', 'knob');
    sc.append(track, fill, knob);
    const time = h('div', 'time', '0:00.0 / 0:30');
    container.append(btn, sc, time);
    const dur = D.frames / FPS;
    let segEls = [], lastBtn = null;
    function setSegments(segs) {
      segEls.forEach((e) => e.remove()); segEls = [];
      segs.forEach((s, i) => {
        const x = s.f0 / D.frames * 100;
        if (i) { const tk = h('div', 'tick'); tk.style.left = x + '%'; sc.appendChild(tk); segEls.push(tk); }
        const lb = h('div', 'seg', KEYLABEL[s.a] + ' ' + KEYNAME[s.a]); lb.style.left = x + '%'; sc.appendChild(lb); segEls.push(lb);
      });
    }
    function seekFromEvent(ev) {
      const r = sc.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      group.seek(x * dur);
    }
    let drag = false;
    sc.addEventListener('pointerdown', (e) => { drag = true; sc.setPointerCapture(e.pointerId); seekFromEvent(e); });
    sc.addEventListener('pointermove', (e) => { if (drag) seekFromEvent(e); });
    sc.addEventListener('pointerup', () => { drag = false; });
    sc.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') group.seek(group.time() + 2); else if (e.key === 'ArrowLeft') group.seek(group.time() - 2); else return;
      e.preventDefault();
    });
    btn.addEventListener('click', () => group.toggle());
    return {
      setSegments,
      tick(t, playing) {
        const x = Math.min(1, t / dur) * 100;
        fill.style.width = x + '%'; knob.style.left = x + '%';
        time.textContent = fmt(t) + ' / 0:30';
        if (playing !== lastBtn) { btn.innerHTML = playing ? PAUSE : PLAY; lastBtn = playing; }
      },
    };
  }

  // ---------------------------------------------------------------- synchronized group of panels
  const groups = [];
  function Group(root, panels, opts) {
    const G = { root, panels, wantPlay: true, visible: false, loaded: false, realtime: false, entry: null, ribbon: null, bar: null };
    const master = () => (panels.find((p) => p.arm === 'hive') || panels[0]).video;
    G.time = () => master().currentTime || 0;
    G.load = function (entry) {
      G.entry = entry;
      panels.forEach((p) => { p.poster.src = entry.poster; p.poster.style.display = ''; p.box.classList.add('wait'); });
      if (G.loaded) attach();
      if (G.ribbon) G.ribbon.set(entry);
      if (G.bar) G.bar.setSegments(entry.segments);
    };
    function attach() {
      panels.forEach((p) => {
        const src = G.entry.videos[p.arm];
        if (p.video.getAttribute('src') !== src) { p.video.preload = 'auto'; p.video.src = src; p.video.load(); }
      });
      G.seek(0);
      if (G.wantPlay && G.visible) G.play();
    }
    // replace the video of one panel (the left side of the comparison player) and keep the current time
    G.swap = function (p, arm) {
      p.arm = arm;
      if (!G.loaded || !G.entry) return;
      const t = G.time(), v = p.video;
      v.preload = 'auto'; v.src = G.entry.videos[arm]; v.load();
      v.addEventListener('loadedmetadata', () => { try { v.currentTime = t; } catch (e) { /* not seekable yet */ } if (G.wantPlay && G.visible) playSafe(v); }, { once: true });
    };
    G.play = function () { G.wantPlay = true; panels.forEach((p) => { p.video.playbackRate = G.realtime ? p.rate : 1; playSafe(p.video); }); };
    G.pause = function (user) { if (user) G.wantPlay = false; panels.forEach((p) => p.video.pause()); };
    G.toggle = function () { if (G.wantPlay && !master().paused) G.pause(true); else G.play(); };
    G.seek = function (t) {
      const d = D.frames / FPS;
      t = Math.min(Math.max(0, t), d - 0.05);
      panels.forEach((p) => { try { p.video.currentTime = t; } catch (e) { /* not loaded yet */ } });
    };
    G.setRealtime = function (on) {
      G.realtime = on; root.classList.toggle('realtime', on);
      panels.forEach((p) => { p.video.playbackRate = on ? p.rate : 1; p.lag.classList.toggle('on', on && p.rate < 1); });
      G.seek(0);
      if (G.wantPlay) G.play();
    };
    G.tick = function () {
      if (!G.loaded || !G.visible || !G.entry) return;
      const m = master(), t = m.currentTime;
      const d = D.frames / FPS;
      // loop: restart every video when the master (HIVE) reaches the end. In real-time mode a slower system has shown less
      // of its video by then, which is the point of that view.
      if (m.ended || t >= d - 0.06) { G.seek(0); if (G.wantPlay) G.play(); }
      for (const p of panels) {
        const v = p.video;
        if (!G.realtime && v !== m && !v.seeking && v.readyState >= 2) {
          const dt = v.currentTime - t;
          if (Math.abs(dt) > 0.25) v.currentTime = t;
          else if (!m.paused) v.playbackRate = Math.abs(dt) > 0.03 ? (dt > 0 ? 0.94 : 1.06) : 1;
        }
        if (G.wantPlay && v.paused && m.readyState >= 3 && v.readyState >= 3 && !v.ended) playSafe(v);
        const fr = Math.floor(v.currentTime * FPS);
        p.pad.set(actAt(G.entry.segments, fr));
        if (p.arm === 'hive') p.flag.classList.toggle('on', G.entry.stale.indexOf(chunkOf(fr)) >= 0);
        if (G.realtime && p.rate < 1) p.lag.textContent = (t - v.currentTime).toFixed(1) + ' s behind';
      }
      if (G.ribbon) G.ribbon.tick(t);
      if (G.bar) G.bar.tick(t, G.wantPlay && !m.paused);
    };
    onView(root, (vis) => {
      G.visible = vis;
      if (vis && !G.loaded && G.entry) { G.loaded = true; attach(); }
      else if (vis && G.wantPlay) G.play();
      else if (!vis) G.pause(false);
    });
    if (opts.ribbonEl) G.ribbon = ribbon(opts.ribbonEl);
    if (opts.barEl) G.bar = bar(opts.barEl, G);
    groups.push(G);
    return G;
  }
  function loop() { groups.forEach((g) => g.tick()); requestAnimationFrame(loop); }

  function tabs(container, items, onPick, cls) {
    container.innerHTML = '';
    const els = items.map((it, i) => {
      const b = h('button', cls || 'tab'); b.type = 'button'; b.setAttribute('role', 'tab');
      b.innerHTML = it.html; b.addEventListener('click', () => { pick(i); onPick(i); });
      container.appendChild(b); return b;
    });
    function pick(i) { els.forEach((e, j) => e.setAttribute('aria-selected', i === j ? 'true' : 'false')); }
    pick(0);
    return pick;
  }

  // ---------------------------------------------------------------- demo (three-way player)
  (function hero() {
    const trio = document.getElementById('hero-trio');
    const ps = ['cloud', 'dev', 'hive'].map((a) => panel(a, { chips: true }));
    ps.forEach((p) => trio.appendChild(p.root));
    const G = Group(document.getElementById('hero'), ps, { ribbonEl: document.getElementById('hero-ribbon'), barEl: document.getElementById('hero-bar') });
    const cap = document.getElementById('hero-caption');
    const CAP_SYNC = 'Shown in sync at 16 FPS. The numbers under each video are the averages of Table 1 (throughput, VLM-judged quality on WorldScore-300, cloud energy per second of video), not measurements of this clip.';
    const CAP_RT = 'Each video now advances at the frame rate its system reaches with one RTX PRO 6000 per model (Table 1), capped at the 16-FPS playback rate. The cloud model alone produces 7.3 frames per second, so its video falls behind; the device model and HIVE keep up.';
    cap.textContent = CAP_SYNC;
    tabs(document.getElementById('hero-tabs'), D.hero.map((e) => ({ html: e.title })), (i) => G.load(D.hero[i]));
    G.load(D.hero[0]);
    const rt = document.getElementById('realtime');
    rt.addEventListener('change', () => { G.setRealtime(rt.checked); cap.textContent = rt.checked ? CAP_RT : CAP_SYNC; });
  })();

  // ---------------------------------------------------------------- gallery (defined before the teaser, which links to it)
  const gallery = (function () {
    const trio = document.getElementById('gal-trio');
    const ps = ['cloud', 'dev', 'hive'].map((a) => panel(a));
    ps.forEach((p) => trio.appendChild(p.root));
    const stage = document.getElementById('gal-stage');
    const G = Group(stage, ps, { ribbonEl: document.getElementById('gal-ribbon'), barEl: document.getElementById('gal-bar') });
    const cap = document.getElementById('gal-caption');
    const grid = document.getElementById('gal-cards');
    const cards = [];
    let activePrev = null;
    const show = (i) => {
      const e = D.gallery[i];
      cap.innerHTML = '<span class="t">' + e.title + '</span>' + (e.caption ? '<span class="q">&ldquo;' + e.caption + '&rdquo;</span>' : '<span class="q">no text prompt</span>');
      cards.forEach((c, j) => c.setAttribute('aria-selected', i === j ? 'true' : 'false'));
      G.load(e);
    };
    D.gallery.forEach((e, i) => {
      const c = h('button', 'gcard'); c.type = 'button'; c.setAttribute('role', 'tab');
      const media = h('div', 'media');
      const img = h('img'); img.src = e.poster; img.alt = ''; img.loading = 'lazy'; media.appendChild(img);
      media.appendChild(h('span', 'now', 'playing'));
      c.appendChild(media);
      c.appendChild(h('div', 'meta', '<span>' + e.title + '</span><em>' + e.segments.map((s) => KEYLABEL[s.a]).join(' ') + '</em>'));
      let v = null;
      const stop = () => { if (v) { v.pause(); c.classList.remove('prev'); } };
      c.addEventListener('pointerenter', (ev) => {
        if (ev.pointerType !== 'mouse') return;
        if (activePrev && activePrev !== stop) activePrev();
        activePrev = stop;
        if (!v) { v = mkVideo(); v.loop = true; v.src = 'assets/previews/' + e.scene + '.mp4'; v.preload = 'auto'; media.insertBefore(v, media.children[1]); v.addEventListener('playing', () => c.classList.add('prev')); }
        try { v.currentTime = 0; } catch (err) { /* not loaded yet */ }
        playSafe(v);
      });
      c.addEventListener('pointerleave', stop);
      c.addEventListener('click', () => {
        show(i);
        const r = stage.getBoundingClientRect();
        if (r.top < 60 || r.top > window.innerHeight * 0.5) stage.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      });
      grid.appendChild(c); cards.push(c);
    });
    const start = Math.max(0, D.gallery.findIndex((e) => e.scene === 'mg2__universal_0011'));
    show(start);
    return { select(scene) { const i = D.gallery.findIndex((e) => e.scene === scene); if (i >= 0) show(i); } };
  })();

  // ---------------------------------------------------------------- teaser mosaic (HIVE excerpts)
  (function teaser() {
    const root = document.getElementById('teaser');
    const SCENES = ['neutral_832__easy_greatwall', 'mg2__universal_0008', 'mg2__universal_0011', 'neutral_832__easy_dragon_night',
      'mg2__universal_0009', 'neutral_832__easy_lake', 'neutral_832__newtons_cradle', 'neutral_832__easy_urban_rain'];
    SCENES.forEach((scene, k) => {
      const e = D.gallery.find((g) => g.scene === scene);
      if (!e) return;
      const t = h('button', 'tile'); t.type = 'button'; t.setAttribute('aria-label', e.title + ': compare in the gallery');
      const v = mkVideo(); v.loop = true;
      const img = h('img'); img.src = e.poster; img.alt = '';
      t.append(v, img, h('span', 'tl', e.title), h('span', 'go', 'compare &rarr;'));
      v.addEventListener('playing', () => t.classList.add('playing'));
      onView(t, (vis) => {
        if (vis) { if (!v.getAttribute('src')) { v.preload = 'auto'; v.src = 'assets/teaser/' + scene + '.mp4'; try { v.currentTime = (k % 4) * 1.5; } catch (err) { /* later */ } } if (!REDUCED) playSafe(v); }
        else v.pause();
      }, { threshold: 0.1 });
      t.addEventListener('click', () => { gallery.select(scene); document.getElementById('gallery').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' }); });
      root.appendChild(t);
    });
  })();

  // ---------------------------------------------------------------- headline numbers count up once
  (function stats() {
    const nums = [...document.querySelectorAll('.stat-num')];
    if (!nums.length || REDUCED) return;
    let done = false;
    onView(document.getElementById('stats'), (vis) => {
      if (!vis || done) return; done = true;
      const t0 = performance.now(), T = 1100;
      const step = (now) => {
        const x = Math.min(1, (now - t0) / T), k = 1 - Math.pow(1 - x, 3);
        nums.forEach((n) => { const to = parseFloat(n.dataset.to), dec = +n.dataset.dec; n.textContent = (x < 1 ? to * k : to).toFixed(dec); });
        if (x < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
  })();

  // ---------------------------------------------------------------- method diagram, four steps
  (function method() {
    const dg = document.getElementById('dg'); if (!dg) return;
    dg.querySelectorAll('.kp').forEach((k) => { const p = keyPad(); p.set(k.dataset.key); k.appendChild(p.el); });
    const items = [...dg.querySelectorAll('[data-at]')];
    const stale = dg.querySelector('.box.stale'), kpChange = document.getElementById('kp-change');
    const steps = [...document.querySelectorAll('#steps-nav .step')];
    const DUR = 3600;
    let cur = 0, timer = null, visible = false, holdUntil = 0;
    function set(s) {
      cur = s;
      items.forEach((e) => { const at = +e.dataset.at; e.classList.toggle('shown', at <= s); e.classList.toggle('cur', at === s); });
      stale.classList.toggle('dead', s >= 2);
      kpChange.classList.toggle('press', s === 2);
      dg.classList.toggle('s4', s === 4);
      steps.forEach((b, i) => { b.classList.remove('on'); void b.offsetWidth; b.classList.toggle('on', i === s - 1); b.style.setProperty('--dur', DUR + 'ms'); });
    }
    function schedule() {
      clearTimeout(timer);
      if (!visible || REDUCED) return;
      timer = setTimeout(() => { if (performance.now() >= holdUntil) set(cur % 4 + 1); schedule(); }, DUR);
    }
    steps.forEach((b, i) => b.addEventListener('click', () => { holdUntil = performance.now() + 9000; steps.forEach((x) => x.classList.add('paused')); set(i + 1); setTimeout(() => steps.forEach((x) => x.classList.remove('paused')), 9000); schedule(); }));
    // dashed "shared history" arrow from the regenerated frame (chunk i) to the next cloud step (chunk i+1)
    const svg = document.getElementById('hist'), path = svg.querySelector('path'), lbl = svg.querySelector('.lbl');
    function drawHist() {
      const frames = dg.querySelectorAll('.frame'), boxes = dg.querySelectorAll('.box.c');
      if (frames.length < 2 || boxes.length < 2) return;
      const R = dg.getBoundingClientRect(), f = frames[1].getBoundingClientRect(), b = boxes[1].getBoundingClientRect();
      svg.setAttribute('width', R.width); svg.setAttribute('height', R.height); svg.style.left = '0'; svg.style.top = '0';
      const x0 = f.right - R.left + 3, y0 = f.top - R.top + f.height * 0.35, x1 = b.left - R.left - 5, y1 = b.top - R.top + b.height * 0.5;
      const mx = (x0 + x1) / 2;
      path.setAttribute('d', `M${x0},${y0} C${mx + 12},${y0} ${mx - 12},${y1} ${x1},${y1}`);
      path.setAttribute('marker-end', 'url(#arrowhead)');
      lbl.textContent = '';
    }
    svg.insertAdjacentHTML('afterbegin', '<defs><marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#e0435f" style="stroke:none;opacity:1"/></marker></defs>');
    window.addEventListener('resize', drawHist);
    dg.querySelectorAll('img').forEach((im) => im.addEventListener('load', drawHist));
    set(REDUCED ? 4 : 1); drawHist();
    onView(dg, (vis) => { visible = vis; drawHist(); if (vis && !REDUCED) { set(1); schedule(); } else clearTimeout(timer); }, { threshold: 0.35 });
  })();

  // ---------------------------------------------------------------- comparison: drag-to-compare player and the five-way grid
  (function qual() {
    const card = document.getElementById('wipe-card'), wipe = document.getElementById('wipe');
    const mkLayer = (side) => {
      const layer = h('div', 'layer ' + side), v = mkVideo(), poster = h('img', 'poster'); poster.alt = '';
      layer.append(v, poster);
      v.addEventListener('loadeddata', () => { poster.style.display = 'none'; });
      return { layer, v, poster };
    };
    const R = mkLayer('right'), L = mkLayer('left');
    const lLab = h('div', 'vlabel l', ''), rLab = label('hive', 'r');
    const divider = h('div', 'divider'), grip = h('div', 'grip', '<svg viewBox="0 0 24 24" fill="none" stroke="#151821" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/></svg>');
    grip.tabIndex = 0; grip.setAttribute('role', 'slider'); grip.setAttribute('aria-label', 'Comparison divider');
    const pad = keyPad(), flag = h('div', 'flag', 'new action &middot; device regenerates'), loading = h('div', 'loading', 'loading');
    wipe.append(R.layer, L.layer, divider, grip, lLab, rLab, pad.el, flag, loading);
    wipe.classList.add('wait');
    const dummy = () => h('div');
    const right = { arm: 'hive', root: wipe, box: wipe, video: R.v, poster: R.poster, pad, lag: dummy(), flag, rate: 1 };
    const left = { arm: 'dev', root: wipe, box: wipe, video: L.v, poster: L.poster, pad: { set() {} }, lag: dummy(), flag: dummy(), rate: 1 };
    R.v.addEventListener('playing', () => wipe.classList.remove('wait'));
    R.v.addEventListener('waiting', () => wipe.classList.add('wait'));
    const G = Group(card, [left, right], { ribbonEl: document.getElementById('wipe-ribbon'), barEl: document.getElementById('wipe-bar') });
    const setLeftLabel = (arm) => { const A = D.arms[arm]; lLab.innerHTML = '<i></i>' + A.label + ' <small>' + A.sub + '</small>'; wipe.style.setProperty('--lc', COL[arm]); };
    // divider position
    let x = 50;
    const setX = (v) => { x = Math.max(0, Math.min(100, v)); wipe.style.setProperty('--x', x + '%'); grip.setAttribute('aria-valuenow', Math.round(x)); };
    setX(50);
    let drag = false;
    const fromEv = (ev) => { const r = wipe.getBoundingClientRect(); setX((ev.clientX - r.left) / r.width * 100); };
    wipe.addEventListener('pointerdown', (ev) => { drag = true; wipe.classList.remove('hint'); wipe.setPointerCapture(ev.pointerId); fromEv(ev); });
    wipe.addEventListener('pointermove', (ev) => { if (drag) fromEv(ev); });
    wipe.addEventListener('pointerup', () => { drag = false; });
    wipe.addEventListener('pointercancel', () => { drag = false; });
    grip.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') setX(x - 5); else if (e.key === 'ArrowRight') setX(x + 5); else return; e.preventDefault(); });
    let hinted = false;
    onView(wipe, (vis) => {
      if (!vis || hinted || REDUCED) return; hinted = true;
      wipe.classList.add('hint');
      setTimeout(() => setX(22), 500); setTimeout(() => setX(78), 1600); setTimeout(() => setX(50), 2700); setTimeout(() => wipe.classList.remove('hint'), 3800);
    }, { threshold: 0.5 });
    const LEFT = ['dev', 'hybridsd', 'ecdiff', 'sdvg', 'cloud'];
    tabs(document.getElementById('left-tabs'), LEFT.map((a) => ({ html: '<i class="d" style="background:' + COL[a] + '"></i>' + D.arms[a].label })), (i) => { setLeftLabel(LEFT[i]); G.swap(left, LEFT[i]); });
    setLeftLabel('dev');

    // six-way grid (HIVE last)
    const root = document.getElementById('qual');
    const six = h('div', 'row-six');
    const ps = {};
    ['dev', 'hybridsd', 'ecdiff', 'sdvg', 'cloud', 'hive'].forEach((a) => { ps[a] = panel(a); six.appendChild(ps[a].root); });
    root.append(six);
    const G2 = Group(document.getElementById('grid-card'), Object.values(ps), { barEl: document.getElementById('qual-bar') });

    tabs(document.getElementById('qual-tabs'), D.qual.map((e) => ({ html: e.title + ' &middot; seed ' + e.seed })), (i) => { G.load(D.qual[i]); G2.load(D.qual[i]); });
    G.load(D.qual[0]); G2.load(D.qual[0]);
    const gridCard = document.getElementById('grid-card');
    tabs(document.getElementById('view-tabs'), [{ html: 'Slider' }, { html: 'All six' }], (i) => {
      card.classList.toggle('hidden', i !== 0); gridCard.classList.toggle('hidden', i !== 1);
    });
  })();

  // ---------------------------------------------------------------- nav: shows after the title, highlights the current section
  (function nav() {
    const navEl = document.getElementById('topnav');
    const title = document.querySelector('.hero-inner');
    const upd = () => navEl.classList.toggle('on', title.getBoundingClientRect().bottom < 0);
    window.addEventListener('scroll', upd, { passive: true }); upd();
    const links = [...navEl.querySelectorAll('.nav-links a')];
    const byId = Object.fromEntries(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.remove('on'));
      const a = byId[e.target.id]; if (a) { a.classList.add('on'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  })();

  // ---------------------------------------------------------------- reveal on scroll
  (function reveal() {
    const els = document.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window) || REDUCED) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
  })();

  requestAnimationFrame(loop);
})();
