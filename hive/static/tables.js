// Numbers copied from the paper (Tables 1-4, Fig. 1(b), and the outage-duration table of the appendix).
// Cell markup: 'b:x' = best (bold), 'u:x' = second best (underline), as in the paper.
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const cell = (v) => {
    const s = String(v);
    if (s.startsWith('b:')) return '<b>' + s.slice(2) + '</b>';
    if (s.startsWith('u:')) return '<u>' + s.slice(2) + '</u>';
    return s;
  };
  function render(id, head, rows) {
    const t = document.getElementById(id);
    if (!t) return;
    let h = '<thead>' + head + '</thead><tbody>';
    for (const r of rows) {
      if (r.group) { h += '<tr class="group"><td colspan="' + r.span + '">' + r.group + '</td></tr>'; continue; }
      h += '<tr class="' + (r.cls || '') + '"><td>' + r.name + '</td>' + r.v.map((x) => '<td>' + cell(x) + '</td>').join('') + '</tr>';
    }
    t.innerHTML = h + '</tbody>';
  }

  // ---------------- Table 1 ----------------
  render('table-main',
    '<tr class="grp"><th></th><th></th><th colspan="2">VLM judge</th><th colspan="2">VBench</th><th colspan="2">Camera / motion</th><th colspan="3">Energy (J / video s) &darr;</th><th></th><th></th></tr>' +
    '<tr><th>Method</th><th>FPS &uarr;</th><th>Quality &uarr;</th><th>Drift &darr;</th><th>Quality &uarr;</th><th>Imag. &uarr;</th><th>RPE &darr;</th><th>Resp. &uarr;</th><th>Device</th><th>Cloud</th><th>Total</th><th>Latency (s) &darr;</th><th>Network (kB/frame) &darr;</th></tr>',
    [
      { group: 'Single model', span: 13 },
      { cls: 'dim', name: 'Device only (1.3B)', v: [20.1, 6.49, 64.8, 76.2, 61.9, 0.653, 86.6, 360, 0, 360, 0.592, 0] },
      { cls: 'dim', name: 'Cloud only (14B)', v: [7.3, 7.09, 53.5, '77.0', 66.4, 0.483, '84.0', 0, 1172, 1172, 1.657, '&ndash;'] },
      { cls: 'dim', name: 'Cloud only (14B), 1-step<sup>&dagger;</sup>', v: [14.1, 7.03, 48.2, 77.5, 65.2, 0.371, 83.5, 0, 567, 567, 0.856, '&ndash;'] },
      { cls: 'dim', name: '14B on the device, 4-bit', v: ['5.0', 6.99, 51.2, 76.4, 65.4, 0.454, 85.2, 1705, 0, 1705, 2.404, 0] },
      { cls: 'dim', name: 'Speculative Forcing', v: [22.5, 5.37, 71.1, 73.2, '61.0', 0.834, 85.9, 340, 0, 340, 0.565, 0] },
      { group: 'Two models on two GPUs', span: 13 },
      { name: 'Hybrid SD', v: [10.8, '6.60', 58.7, 76.1, 61.8, 0.507, 84.2, 373, 645, 1018, 1.107, 87.5] },
      { name: 'EC-Diff', v: ['u:11.5', 'u:6.96', 'u:51.3', 'u:76.9', 'u:64.8', 'u:0.435', 85.4, 'u:334', 634, 'u:968', 'u:1.042', 58.6] },
      { name: 'SDVG (&tau; = &minus;1.2)', v: [7.3, 6.86, 58.1, 76.7, 64.3, 0.564, 'u:86.2', 681, 'u:625', 1306, 1.152, 'b:29.6'] },
      { group: 'Edge&ndash;cloud collaboration', span: 13 },
      { cls: 'dim', name: 'HIVE w/o device model', v: [21.3, 7.03, 48.2, 77.5, 65.2, 0.371, 83.5, 208, 422, 630, 0.801, 32.5] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['b:21.4', 'b:7.07', 'b:46.6', 'b:77.9', 'b:65.3', 'b:0.382', 'b:87.2', 'b:251', 'b:404', 'b:655', 'b:0.595', 'u:32.5'] },
    ]);

  // ---------------- Table 2 (ablation) ----------------
  render('table-ablation',
    '<tr><th>Variant</th><th>FPS &uarr;</th><th>Quality &uarr;</th><th>Imag. &uarr;</th><th>RPE &darr;</th><th>Lat. &darr;</th><th>Cloud J &darr;</th></tr>',
    [
      { group: 'Components removed cumulatively', span: 7 },
      { name: '&minus; device model', v: ['b:21.3', 7.23, '65.0', 0.521, 0.79, 413] },
      { name: '&minus; lookahead', v: [18.9, 7.23, '65.0', 0.521, 'u:0.63', 403] },
      { name: '&minus; device decoding', v: [14.2, 7.23, '65.0', 0.521, 0.84, 551] },
      { name: '&minus; one-step sampling', v: [7.3, 'b:7.33', 'b:68.7', 0.729, 1.63, 1141] },
      { group: 'Chunk invalidated by an action change', span: 7 },
      { name: 'No regeneration<sup>&dagger;</sup>', v: [21.1, 7.23, 65.5, '0.690', '&ndash;', 'u:400'] },
      { name: 'Guided regeneration', v: [20.1, 'u:7.31', 66.5, 'u:0.462', '0.80', 401] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['u:21.2', 7.28, 'u:67.0', 'b:0.461', 'b:0.59', 'b:398'] },
    ]);

  // ---------------- Device denoising steps ----------------
  render('table-devsteps',
    '<tr><th>Regeneration</th><th>MUSIQ &uarr;</th><th>Rot. RPE (&deg;) &darr;</th><th>VLM drift &darr;</th></tr>',
    [
      { name: 'Cloud, 1 step<sup>&dagger;</sup>', v: ['63.04', '0.593', '46.0'] },
      { name: 'Device, 1 step', v: ['57.86', '0.488', '44.8'] },
      { name: 'Device, 2 steps', v: ['62.96', '0.480', '40.3'] },
      { cls: 'ours', name: 'Device, 4 steps (HIVE)', v: ['b:66.15', 'b:0.402', 'b:39.3'] },
    ]);

  // ---------------- Table 3 (another backbone) ----------------
  render('table-pair2',
    '<tr><th>Method</th><th>FPS &uarr;</th><th>Quality &uarr;</th><th>Drift &darr;</th><th>Imag. &uarr;</th><th>Cloud J &darr;</th></tr>',
    [
      { name: 'Device only (1.3B)', v: ['b:14.5', 7.72, '29.0', 'u:67.7', 0] },
      { name: 'Cloud only (14B)', v: [3.8, 'b:8.13', 'u:19.0', 'b:69.7', 2406] },
      { name: 'Cloud only (14B), 1-step', v: [8.0, '7.60', 21.5, 65.2, 'u:1098'] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['u:9.8', 'u:7.95', 'b:15.4', 66.6, 'b:844'] },
    ]);

  // ---------------- Table 4 (real-time inputs) ----------------
  render('table-timed',
    '<tr><th></th><th>End-to-end (s) &darr;</th><th>First frame (s) &darr;</th><th>Stall (s/clip) &darr;</th><th>Cloud J &darr;</th></tr>',
    [
      { group: 'Network delay 0 ms', span: 5 },
      { name: 'No lookahead, 1-step', v: [1.08, 1.08, 0.31, 416] },
      { name: 'HIVE w/o device model', v: ['b:0.78', 0.59, 'b:0.00', 431] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['b:0.77', 'b:0.39', 'b:0.00', 'b:414'] },
      { group: 'Network delay 150 ms', span: 5 },
      { name: 'No lookahead, 1-step', v: [4.43, 4.43, 6.92, 436] },
      { name: 'HIVE w/o device model', v: ['b:1.07', '0.90', 'b:0.00', 431] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['b:1.07', 'b:0.49', 'b:0.00', 'b:415'] },
      { group: 'Delay 50 ms, jitter &plusmn;30 ms, loss 2%', span: 5 },
      { name: 'HIVE w/o device model', v: [0.95, 0.73, 0.01, 431] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['b:0.87', 'b:0.41', 'b:0.00', 'b:415'] },
      { group: '2-s network outage', span: 5 },
      { name: 'HIVE w/o device model', v: [2.01, 0.76, 1.32, 430] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['b:1.00', 'b:0.62', 'b:0.29', 'b:405'] },
      { group: '20-s network outage', span: 5 },
      { name: 'HIVE w/o device model', v: [20.02, 17.37, 19.33, 479] },
      { cls: 'ours', name: 'HIVE (Ours)', v: ['b:1.01', 'b:0.40', 'b:0.29', 'b:339'] },
    ]);

  // ---------------- helpers for the SVG charts ----------------
  const CSS = getComputedStyle(document.documentElement);
  const V = (n) => CSS.getPropertyValue(n).trim();
  const PAL = { cloud: V('--cloud'), dev: V('--device'), hive: V('--hive'), two: '#9aa0ac', design: V('--green'), ink: '#3c4150', axis: '#8b90a0', grid: '#eef0f4' };
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function text(parent, x, y, s, attrs) {
    const t = el('text', Object.assign({ x: x, y: y }, attrs || {}), parent);
    t.textContent = s;
    return t;
  }
  function tipFor(container) {
    const tip = document.createElement('div');
    tip.className = 'tip';
    container.appendChild(tip);
    return {
      show(html, x, y) { tip.innerHTML = html; tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.add('on'); },
      hide() { tip.classList.remove('on'); },
    };
  }
  function pointer(svg, container, x, y) {
    const r = svg.getBoundingClientRect(), c = container.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    return [x * r.width / vb.width + r.left - c.left, y * r.height / vb.height + r.top - c.top];
  }
  const hexPts = (cx, cy, r) => { const p = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); } return p.join(' '); };

  // ---------------- Fig. 1(b): quality against throughput ----------------
  (function scatter() {
    const box = document.getElementById('scatter');
    if (!box) return;
    const C = { cloud: PAL.cloud, dev: PAL.dev, two: PAL.two, design: PAL.design, hive: PAL.hive };
    //   name                      fps   quality total J  cloud J group     label dx, dy, anchor
    const P = [
      ['Cloud only (14B)',          7.3,  7.09, 1172, 1172, 'cloud', [12, -4, 'start']],
      ['Device only (1.3B)',       20.1,  6.49,  360,    0, 'dev', [12, 14, 'start']],
      ['Hybrid SD',                10.8,  6.60, 1018,  645, 'two', [0, 24, 'middle']],
      ['SDVG',                      7.3,  6.86, 1306,  625, 'two', [12, 2, 'start']],
      ['EC-Diff',                  11.5,  6.96,  968,  634, 'two', [12, 2, 'start']],
      ['Low-res cloud',            17.8,  5.73,  737,  null, 'design', [12, -2, 'start']],
      ['Cloud step + refine',      20.5,  6.52,  734,  null, 'design', [-12, -16, 'end']],
      ['Periodic cloud',           23.6,  6.85,  602,  307, 'design', [0, 24, 'middle']],
      ['HIVE (Ours)',              21.4,  7.07,  655,  404, 'hive', [0, -36, 'middle']],
    ];
    const W = 780, H = 410, m = { l: 64, r: 26, t: 22, b: 54 };
    const x0 = 5, x1 = 25.5, y0 = 5.6, y1 = 7.3;
    const X = (v) => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r);
    const Y = (v) => H - m.b - (v - y0) / (y1 - y0) * (H - m.t - m.b);
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }, box);
    const g = el('g', { 'font-size': 13 }, svg);
    const defs = el('defs', {}, svg);
    const lg0 = el('linearGradient', { id: 'rtgrad', x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    el('stop', { offset: 0, 'stop-color': PAL.hive, 'stop-opacity': 0.09 }, lg0); el('stop', { offset: 1, 'stop-color': PAL.dev, 'stop-opacity': 0.05 }, lg0);
    el('rect', { x: X(16), y: m.t, width: X(x1) - X(16), height: H - m.t - m.b, fill: 'url(#rtgrad)', rx: 6 }, g);
    for (let v = 10; v <= 25; v += 5) {
      el('line', { x1: X(v), x2: X(v), y1: m.t, y2: H - m.b, stroke: PAL.grid }, g);
      text(g, X(v), H - m.b + 22, v, { 'text-anchor': 'middle', fill: PAL.axis });
    }
    for (let v = 5.75; v <= 7.26; v += 0.25) {
      el('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), stroke: PAL.grid }, g);
      text(g, m.l - 10, Y(v) + 4, v.toFixed(2), { 'text-anchor': 'end', fill: PAL.axis });
    }
    el('line', { x1: X(16), x2: X(16), y1: m.t, y2: H - m.b, stroke: PAL.hive, 'stroke-dasharray': '5 5', 'stroke-width': 1.4 }, g);
    text(g, X(16) - 8, m.t + 14, 'real time (16 FPS) \u2192', { fill: PAL.hive, 'font-size': 12, 'font-weight': 600, 'text-anchor': 'end' });
    text(g, (m.l + W - m.r) / 2, H - 10, 'Throughput (FPS) \u2192', { 'text-anchor': 'middle', fill: PAL.ink, 'font-weight': 600 });
    const yl = text(g, 16, (m.t + H - m.b) / 2, 'Video quality (VLM judge) \u2192', { 'text-anchor': 'middle', fill: PAL.ink, 'font-weight': 600 });
    yl.setAttribute('transform', `rotate(-90 16 ${(m.t + H - m.b) / 2})`);
    const tip = tipFor(box);
    for (const [name, fps, q, tot, cj, grp, [dx, dy, anchor]] of P) {
      const cx = X(fps), cy = Y(q), col = C[grp];
      const node = el('g', { class: 'pt', tabindex: 0 }, g);
      if (grp === 'hive') {
        el('polygon', { class: 'halo', points: hexPts(cx, cy, 22), fill: col, opacity: 0.14 }, node);
        const ring = el('polygon', { points: hexPts(cx, cy, 17), fill: 'none', stroke: col, 'stroke-width': 1.5, opacity: 0.5 }, node);
        const an = el('animate', { attributeName: 'opacity', values: '0.55;0.1;0.55', dur: '2.4s', repeatCount: 'indefinite' }, ring); void an;
        el('polygon', { points: hexPts(cx, cy, 12), fill: col, stroke: '#fff', 'stroke-width': 2 }, node);
      } else {
        el('circle', { class: 'halo', cx: cx, cy: cy, r: 14, fill: col, opacity: 0.18 }, node);
        el('circle', { cx: cx, cy: cy, r: 7.5, fill: col, stroke: '#fff', 'stroke-width': 2 }, node);
      }
      const lab = text(node, cx + dx, cy + dy, name, { 'text-anchor': anchor, fill: col, 'font-weight': grp === 'hive' ? 800 : 600 });
      text(node, cx + dx, cy + dy + 15, `(${tot} J)`, { 'text-anchor': anchor, fill: col, 'font-size': 11.5, opacity: 0.85 });
      if (grp === 'hive') lab.setAttribute('font-size', 15);
      const html = `<b>${name}</b><br>${fps} FPS &middot; quality ${q.toFixed(2)}<br>total ${tot} J` + (cj !== null ? ` &middot; cloud ${cj} J` : '') + ' per video s' + (grp === 'design' ? ' (20 scenes)' : '');
      const show = () => { const [px, py] = pointer(svg, box, cx, cy); tip.show(html, px, py); };
      node.addEventListener('mouseenter', show); node.addEventListener('focus', show);
      node.addEventListener('mouseleave', tip.hide); node.addEventListener('blur', tip.hide);
    }
    const lg = document.getElementById('scatter-legend');
    if (lg) lg.innerHTML = [['cloud', 'Cloud model alone'], ['dev', 'Device model alone'], ['two', 'Published two-model methods'], ['design', 'Other collaboration designs (20 scenes)'], ['hive', 'HIVE']]
      .map(([k, s]) => `<span><i class="dot" style="background:${C[k]}"></i>${s}</span>`).join('');
  })();

  // ---------------- Outage duration (appendix table) ----------------
  (function outage() {
    const box = document.getElementById('outage');
    if (!box) return;
    const D = [[1, 0.32, 0.29, 13.4], [2, 1.32, 0.29, 16.1], [4, 3.33, 0.33, 13.7], [8, 7.33, 0.29, 19.0], [20, 19.33, 0.29, 26.0]];
    const W = 520, H = 310, m = { l: 48, r: 16, t: 20, b: 48 };
    const yMax = 20, gw = (W - m.l - m.r) / D.length, bw = Math.min(30, gw * 0.32);
    const Y = (v) => H - m.b - v / yMax * (H - m.t - m.b);
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}` }, box);
    const g = el('g', { 'font-size': 12.5 }, svg);
    for (let v = 0; v <= 20; v += 5) {
      el('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), stroke: v ? PAL.grid : '#c9cdd6' }, g);
      text(g, m.l - 8, Y(v) + 4, v, { 'text-anchor': 'end', fill: PAL.axis });
    }
    const yl = text(g, 13, (m.t + H - m.b) / 2, 'Stall per clip (s)', { 'text-anchor': 'middle', fill: PAL.ink, 'font-weight': 600 });
    yl.setAttribute('transform', `rotate(-90 13 ${(m.t + H - m.b) / 2})`);
    text(g, (m.l + W - m.r) / 2, H - 8, 'Outage duration', { 'text-anchor': 'middle', fill: PAL.ink, 'font-weight': 600 });
    const tip = tipFor(box);
    D.forEach(([o, nodev, hive, devchunks], i) => {
      const cx = m.l + gw * (i + 0.5);
      text(g, cx, H - m.b + 19, o + ' s', { 'text-anchor': 'middle', fill: PAL.ink, 'font-weight': 600 });
      [[nodev, PAL.two, -1, 'Decode-only device'], [hive, PAL.hive, 1, 'HIVE']].forEach(([v, col, side, name]) => {
        const x = cx + side * (bw / 2 + 2) - bw / 2;
        const r = el('rect', { x: x, y: Y(v), width: bw, height: Math.max(2, Y(0) - Y(v)), rx: 4, fill: col }, g);
        text(g, x + bw / 2, Y(v) - 6, v.toFixed(2), { 'text-anchor': 'middle', fill: col, 'font-size': 11, 'font-weight': 700 });
        const html = `<b>${name}</b>, ${o}-s outage<br>stall ${v.toFixed(2)} s per clip` + (side > 0 ? `<br>device generates ${devchunks} of 39 chunks` : '');
        r.addEventListener('mouseenter', () => { const [px, py] = pointer(svg, box, x + bw / 2, Y(v)); tip.show(html, px, py); });
        r.addEventListener('mouseleave', tip.hide);
      });
    });
    const lg = el('g', { transform: `translate(${m.l + 14},${m.t + 4})` }, g);
    [[PAL.two, 'HIVE w/o device model (decode-only device)'], [PAL.hive, 'HIVE']].forEach(([c, s], i) => {
      el('polygon', { points: hexPts(6, i * 21 + 6, 7), fill: c }, lg);
      text(lg, 18, i * 21 + 10.5, s, { fill: PAL.ink });
    });
  })();

  // ---------------- Collaboration designs (Fig. design_main; quality and FPS from Tables 1 and design_main) ----------------
  (function design() {
    const box = document.getElementById('designchart');
    if (!box) return;
    //  name                    quality (WS-300)  FPS (20 scenes)  cloud J
    const P = [
      ['Device only',            6.49, 20.4,    0],
      ['Periodic cloud',         6.85, 23.6,  307],
      ['Shared chunks',          7.06, 20.1,  370],
      ['HIVE (Ours)',            7.07, 21.2,  398],
      ['Adaptive second step',   7.11, 17.8,  513],
      ['Two cloud steps',        7.15, 15.0,  612],
      ['Four cloud steps',       7.16,  8.5, 1011],
      ['Cloud only',             7.09,  7.3, 1141],
    ];
    const W = 560, H = 380, m = { l: 52, r: 52, t: 22, b: 118 };
    const q0 = 6.4, q1 = 7.2, f0 = 5, f1 = 25;
    const X = (i) => m.l + 18 + i * (W - m.l - m.r - 36) / (P.length - 1);
    const YQ = (v) => H - m.b - (v - q0) / (q1 - q0) * (H - m.t - m.b);
    const YF = (v) => H - m.b - (v - f0) / (f1 - f0) * (H - m.t - m.b);
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}` }, box);
    const g = el('g', { 'font-size': 12 }, svg);
    for (let k = 0; k <= 4; k++) {
      const y = H - m.b - k / 4 * (H - m.t - m.b);
      el('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, stroke: k ? PAL.grid : '#c9cdd6' }, g);
      text(g, m.l - 8, y + 4, (q0 + k / 4 * (q1 - q0)).toFixed(2), { 'text-anchor': 'end', fill: PAL.cloud });
      text(g, W - m.r + 8, y + 4, (f0 + k / 4 * (f1 - f0)).toFixed(0), { 'text-anchor': 'start', fill: PAL.dev });
    }
    const ql = text(g, 14, (m.t + H - m.b) / 2, 'Video quality \u2191', { 'text-anchor': 'middle', fill: PAL.cloud, 'font-weight': 700 });
    ql.setAttribute('transform', `rotate(-90 14 ${(m.t + H - m.b) / 2})`);
    const fl = text(g, W - 12, (m.t + H - m.b) / 2, 'Throughput (FPS) \u2191', { 'text-anchor': 'middle', fill: PAL.dev, 'font-weight': 700 });
    fl.setAttribute('transform', `rotate(90 ${W - 12} ${(m.t + H - m.b) / 2})`);
    const line = (Yf, idx, col) => el('polyline', { points: P.map((p, i) => X(i) + ',' + Yf(p[idx])).join(' '), fill: 'none', stroke: col, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, g);
    line(YQ, 1, PAL.cloud); line(YF, 2, PAL.dev);
    const tip = tipFor(box);
    P.forEach(([name, q, fps, cj], i) => {
      const x = X(i), ours = i === 3;
      const node = el('g', { class: 'pt', tabindex: 0 }, g);
      el('rect', { x: x - 16, y: m.t, width: 32, height: H - m.t - m.b, fill: '#000', opacity: 0 }, node);
      if (ours) el('rect', { x: x - 16, y: m.t, width: 32, height: H - m.t - m.b, fill: PAL.hive, opacity: 0.07, rx: 6 }, node);
      [[YQ(q), PAL.cloud], [YF(fps), PAL.dev]].forEach(([y, col]) => {
        if (ours) el('polygon', { points: hexPts(x, y, 9), fill: PAL.hive, stroke: '#fff', 'stroke-width': 2 }, node);
        else el('circle', { cx: x, cy: y, r: 5.5, fill: col, stroke: '#fff', 'stroke-width': 2 }, node);
      });
      const lab = text(node, x, H - m.b + 14, name, { 'text-anchor': 'end', fill: ours ? PAL.hive : PAL.ink, 'font-weight': ours ? 800 : 500 });
      lab.setAttribute('transform', `rotate(-38 ${x} ${H - m.b + 14})`);
      const html = `<b>${name}</b><br>quality ${q.toFixed(2)} &middot; ${fps} FPS<br>cloud ${cj} J per video s (20 scenes)`;
      const show = () => { const [px, py] = pointer(svg, box, x, Math.min(YQ(q), YF(fps))); tip.show(html, px, py); };
      node.addEventListener('mouseenter', show); node.addEventListener('focus', show);
      node.addEventListener('mouseleave', tip.hide); node.addEventListener('blur', tip.hide);
    });
    text(g, m.l, H - 8, '\u2190 more on the device', { fill: PAL.axis, 'font-weight': 600 });
    text(g, W - m.r, H - 8, 'more in the cloud \u2192', { fill: PAL.axis, 'font-weight': 600, 'text-anchor': 'end' });
  })();
})();
