/* After Hours Compendium — cenários em pixel art (320x180), desenhados em código.
   Cada cena tem uma camada fixa (base) e uma função que anima os detalhes por cima.
   Se existir img/fundo-<categoria>.png, a página usa essa imagem em vez da cena desenhada. */
window.CENAS = (function () {
  var W = 320, H = 180;
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  function bt(x, y) { return (BAYER[((y | 0) % 4 + 4) % 4][((x | 0) % 4 + 4) % 4] + 0.5) / 16; }
  function px(c, x, y, col, a) { if (a != null) c.globalAlpha = Math.max(0, Math.min(1, a)); c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), 1, 1); c.globalAlpha = 1; }
  function rect(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); }
  function grad(c, x0, y0, w, h, cols) {
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var t = y / Math.max(1, h - 1) * (cols.length - 1), b = Math.floor(t), f = t - b;
      px(c, x0 + x, y0 + y, cols[Math.min(cols.length - 1, b + (bt(x, y) < f ? 1 : 0))]);
    }
  }
  function layer(fn) { var c = document.createElement("canvas"); c.width = W; c.height = H; var x = c.getContext("2d"); fn(x); return c; }
  function seeded(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function disc(c, cx, cy, r, col, edge) {
    for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) { var d = Math.hypot(x, y); if (d <= r) px(c, cx + x, cy + y, edge && d > r - 1.2 ? edge : col); }
  }
  function glow(c, cx, cy, r, col, strength, sy) {
    for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) {
      var d = Math.hypot(x, y * (sy || 1)); if (d > r) continue;
      if (bt(cx + x, cy + y) < (1 - d / r) * strength) px(c, cx + x, cy + y, col, 0.22);
    }
  }
  function pine(c, x, base, h, col, hi) {
    for (var k = 0; k < h; k++) {
      var hw = Math.floor(k * 0.33 + (k % 5) * 0.4);
      rect(c, x - hw, base - h + k, hw * 2 + 1, 1, col);
      if (hi && hw > 0 && k % 5 > 1) px(c, x + hw, base - h + k, hi);
    }
  }
  function stars(R, n, maxY) { var s = []; for (var i = 0; i < n; i++) s.push({ x: Math.floor(R() * W), y: Math.floor(R() * maxY), p: R() * 6.28, sp: 0.8 + R() * 2 }); return s; }
  function drawStars(c, s, t) { s.forEach(function (o) { var v = 0.35 + 0.65 * Math.sin(t * o.sp + o.p); if (v > 0.1) px(c, o.x, o.y, "#ffffff", v); }); }
  var BIRD = [["#...#", ".#.#.", "..#.."], [".....", "..#..", "##.##"]];
  function sprite(c, rows, x, y, col, a) { for (var r = 0; r < rows.length; r++) for (var k = 0; k < rows[r].length; k++) if (rows[r][k] === "#") px(c, x + k, y + r, col, a); }

  var S = {};

  /* ---------- MÚSICA: deserto ao anoitecer, gerador e amplificador ---------- */
  S.deserto = function () {
    var R = seeded(5), st = stars(R, 70, 70);
    var ground = function (x) { return Math.round(132 + 5 * Math.sin(x * 0.021 + 1) + 3 * Math.sin(x * 0.07)); };
    var base = layer(function (c) {
      grad(c, 0, 0, W, 135, ["#0b0820", "#140f30", "#221640", "#361c4a", "#55234e", "#82334e", "#b44f48", "#df7f45", "#f0a85a"]);
      disc(c, 262, 34, 11, "#f6e6c8", "#d9c3a0"); px(c, 258, 31, "#e2cfae"); px(c, 265, 37, "#e2cfae"); px(c, 260, 39, "#e2cfae");
      glow(c, 262, 34, 30, "#ffd9a0", 0.35);
      for (var x = 0; x < W; x++) { // mesas ao longe
        var m = 112 - (x > 20 && x < 75 ? 18 : 0) - (x > 200 && x < 240 ? 12 : 0) - (x > 238 && x < 300 ? 22 : 0) + Math.round(2 * Math.sin(x * 0.3));
        rect(c, x, m, 1, 140 - m, "#3b1f3c"); if (bt(x, m) < 0.5) px(c, x, m, "#5a2c48");
      }
      for (x = 0; x < W; x++) { // dunas
        var g = ground(x);
        for (var y = g; y < H; y++) {
          var t = (y - g) / 40, col = t < 0.05 ? "#b9744a" : t < 0.3 ? "#8a5232" : t < 0.7 ? "#6e3f28" : "#53301f";
          if (bt(x, y) < 0.15 && t > 0.05) col = "#9a5f3a";
          px(c, x, y, col);
        }
      }
      // catos
      [[30, 36], [262, 30], [298, 24], [205, 18]].forEach(function (k) {
        var cx = k[0], h = k[1], gy = ground(cx) + 2;
        rect(c, cx, gy - h, 4, h, "#24142a"); rect(c, cx + 1, gy - h - 1, 2, 1, "#24142a");
        rect(c, cx - 5, gy - h + 10, 5, 3, "#24142a"); rect(c, cx - 5, gy - h + 3, 3, 8, "#24142a");
        rect(c, cx + 4, gy - h + 14, 5, 3, "#24142a"); rect(c, cx + 6, gy - h + 7, 3, 8, "#24142a");
        rect(c, cx + 3, gy - h, 1, h, "#3a2238");
      });
      // gerador
      var gx = 92, gy2 = ground(100) + 3;
      rect(c, gx, gy2 - 10, 16, 10, "#c9a23a"); rect(c, gx, gy2 - 10, 16, 1, "#e8c45a"); rect(c, gx + 2, gy2 - 8, 8, 5, "#3a3530");
      rect(c, gx + 11, gy2 - 8, 3, 3, "#2a2520"); rect(c, gx - 1, gy2 - 1, 18, 1, "#1a1410"); rect(c, gx + 13, gy2 - 13, 2, 3, "#555");
      // amplificador (cabeça + coluna)
      var ax = 118, ay = ground(126) + 3;
      rect(c, ax, ay - 24, 20, 18, "#1a1418"); rect(c, ax + 1, ay - 23, 18, 16, "#2a2228");
      [[ax + 5, ay - 19], [ax + 14, ay - 19], [ax + 5, ay - 11], [ax + 14, ay - 11]].forEach(function (p) { disc(c, p[0], p[1], 3, "#141014", "#3e343c"); px(c, p[0], p[1], "#55485a"); });
      rect(c, ax, ay - 31, 20, 7, "#1a1418"); rect(c, ax + 1, ay - 30, 18, 1, "#c9b9a0");
      for (var k2 = 0; k2 < 5; k2++) px(c, ax + 3 + k2 * 3, ay - 27, "#f4c16a");
      rect(c, ax, ay - 6, 20, 6, "#141014");
      // cabo do gerador ao amplificador
      for (x = gx + 16; x < ax; x++) px(c, x, ay - 1 + Math.round(Math.sin(x * 0.4)), "#0d0a0c");
      // tripé do micro
      var mx = 150, my = ground(150) + 2;
      rect(c, mx, my - 22, 1, 22, "#8a8a92"); px(c, mx - 2, my, "#8a8a92"); px(c, mx + 2, my, "#8a8a92"); rect(c, mx - 1, my - 25, 3, 3, "#2a2a30");
      // guitarra encostada
      rect(c, 140, my - 20, 1, 12, "#5a3d22"); disc(c, 140, my - 5, 4, "#a8321f", "#6b1e12"); rect(c, 139, my - 22, 3, 2, "#2a1a10");
    });
    var waves = 0, puffs = [], tumble = null, shoot = null, nextShoot = 4;
    return { base: base, foco: 125, draw: function (c, t, dt) {
      drawStars(c, st, t);
      if (!shoot && t > nextShoot) { shoot = { x: 60 + Math.random() * 200, y: 8 + Math.random() * 30, l: 0 }; nextShoot = t + 6 + Math.random() * 8; }
      if (shoot) { shoot.l += dt; for (var k = 0; k < 9; k++) px(c, shoot.x - shoot.l * 2.4 + k * 2, shoot.y + shoot.l - k, "#ffffff", (1 - k / 9) * (1 - shoot.l / 30)); if (shoot.l > 30) shoot = null; }
      // ondas de som
      var ax = 128, ay = ground(126) - 15;
      for (var w = 0; w < 3; w++) {
        var r = ((t * 22 + w * 14) % 42) + 12, a = Math.max(0, 1 - (r - 12) / 42) * 0.7;
        for (var ang = -0.55; ang <= 0.55; ang += 0.05) {
          var x = ax + 12 + Math.cos(ang) * r, y = ay + Math.sin(ang) * r;
          if (bt(x, y) < 0.7) px(c, x, y, "#ffd27a", a);
        }
      }
      // luz do gerador e fumo
      if (Math.floor(t * 2) % 2) px(c, 104, ground(100) - 9, "#ff4a3a");
      if (Math.random() < 0.08 * dt) puffs.push({ x: 106, y: ground(100) - 13, l: 0 });
      puffs = puffs.filter(function (p) { p.l += dt; p.y -= 0.15 * dt; p.x += 0.08 * dt; rect(c, p.x, p.y, p.l > 30 ? 2 : 1, p.l > 30 ? 2 : 1, "rgba(200,190,200," + Math.max(0, 0.5 - p.l / 120) + ")"); return p.l < 60; });
      // bola de feno
      if (!tumble && Math.random() < 0.002 * dt) tumble = { x: -8, l: 0 };
      if (tumble) {
        tumble.x += 0.6 * dt; tumble.l += dt;
        var ty = ground(tumble.x) - 4 - Math.abs(Math.sin(tumble.l * 0.12)) * 4;
        for (var i = 0; i < 14; i++) { var an = i * 0.45 + tumble.l * 0.15; px(c, tumble.x + Math.cos(an) * (2 + i % 3), ty + Math.sin(an) * (2 + i % 3), "#8a6a3a"); }
        if (tumble.x > W + 8) tumble = null;
      }
    } };
  };

  /* ---------- ESTANTE: biblioteca com chuva na janela ---------- */
  S.biblioteca = function () {
    var R = seeded(9), books = [];
    var COLS = ["#7a2e2e", "#2e4a7a", "#3d6b2f", "#7a5a2d", "#5a2d6b", "#2d6b6b", "#8a7a5a", "#a14a2a", "#2a2a3a", "#6b6b2d"];
    function shelf(c, x0, x1) {
      rect(c, x0 - 3, 10, x1 - x0 + 6, 142, "#3a2614"); rect(c, x0 - 3, 10, 2, 142, "#5a3d22"); rect(c, x1 + 1, 10, 2, 142, "#2a1a0c");
      for (var row = 0; row < 5; row++) {
        var by = 36 + row * 28, x = x0;
        while (x < x1 - 3) {
          var w = 3 + Math.floor(R() * 4), h = 14 + Math.floor(R() * 10), col = COLS[Math.floor(R() * COLS.length)];
          if (R() < 0.07) { x += 4; continue; }
          if (x + w > x1) break;
          rect(c, x, by - h, w, h, col); rect(c, x, by - h, 1, h, "rgba(255,255,255,.15)"); rect(c, x + w - 1, by - h, 1, h, "rgba(0,0,0,.3)");
          if (R() < 0.6) rect(c, x, by - h + 2, w, 1, "#d8b060");
          x += w;
        }
        rect(c, x0 - 3, by, x1 - x0 + 6, 3, "#6b4a28"); rect(c, x0 - 3, by, x1 - x0 + 6, 1, "#8a6236");
      }
    }
    var base = layer(function (c) {
      grad(c, 0, 0, W, 150, ["#241810", "#2c1e14", "#33241a"]);
      for (var x = 0; x < W; x += 16) rect(c, x, 0, 1, 150, "#1e140c");
      shelf(c, 6, 72); shelf(c, 196, 316);
      // janela
      rect(c, 92, 18, 82, 84, "#4a3018"); grad(c, 96, 22, 74, 76, ["#0c1228", "#141c3a", "#1e2a50", "#2a3a62"]);
      disc(c, 150, 36, 6, "#dfe6f0", "#b8c2d4");
      for (x = 96; x < 170; x++) { var h = 86 + Math.round(4 * Math.sin(x * 0.2) + 3 * Math.sin(x * 0.07)); rect(c, x, h, 1, 98 - h, "#0a0f20"); }
      [[100, 82], [112, 79], [140, 84], [158, 80]].forEach(function (p) { px(c, p[0], p[1], "#ffd27a"); });
      rect(c, 132, 22, 2, 76, "#4a3018"); rect(c, 96, 58, 74, 2, "#4a3018");
      rect(c, 88, 100, 90, 4, "#6b4a28"); rect(c, 88, 100, 90, 1, "#8a6236");
      // chão e tapete
      for (var y = 150; y < H; y++) for (x = 0; x < W; x++) px(c, x, y, ((x + (y % 2) * 13) % 26 === 0) ? "#24160a" : y === 150 ? "#5a3d22" : "#3a2614");
      for (y = 158; y < 176; y++) for (x = 70; x < 210; x++) { var e = Math.min(y - 158, 175 - y, x - 70, 209 - x); px(c, x, y, e < 2 ? "#d8b060" : (e % 4 === 2 && bt(x, y) < 0.6) ? "#a14a2a" : "#6b2a2a"); }
      // poltrona
      rect(c, 104, 118, 30, 34, "#6b2424"); rect(c, 104, 118, 30, 2, "#8a3434"); rect(c, 100, 132, 8, 20, "#7a2e2e"); rect(c, 130, 132, 8, 20, "#7a2e2e");
      rect(c, 106, 136, 26, 8, "#7a2e2e"); rect(c, 102, 152, 3, 4, "#2a1a0c"); rect(c, 133, 152, 3, 4, "#2a1a0c");
      // mesinha e candeeiro
      rect(c, 146, 136, 18, 3, "#6b4a28"); rect(c, 148, 139, 2, 15, "#4a3018"); rect(c, 160, 139, 2, 15, "#4a3018");
      rect(c, 154, 116, 1, 20, "#2a2a30"); rect(c, 148, 108, 14, 9, "#e8c27a"); rect(c, 148, 108, 14, 1, "#fff0c0"); rect(c, 150, 117, 10, 1, "#a87a3a");
      rect(c, 147, 131, 6, 4, "#2e4a7a"); rect(c, 147, 129, 6, 2, "#7a2e2e");
      // pilha de livros no chão
      [[176, 148, 14, "#3d6b2f"], [177, 145, 12, "#7a5a2d"], [175, 142, 15, "#2e4a7a"]].forEach(function (b) { rect(c, b[0], b[1], b[2], 3, b[3]); rect(c, b[0], b[1], b[2], 1, "rgba(255,255,255,.2)"); });
    });
    var drops = []; for (var i = 0; i < 40; i++) drops.push({ x: 96 + Math.random() * 74, y: 22 + Math.random() * 76, v: 1.5 + Math.random() });
    var dust = []; for (i = 0; i < 18; i++) dust.push({ x: 130 + Math.random() * 50, y: 100 + Math.random() * 50, p: Math.random() * 6 });
    var flash = 0;
    return { base: base, foco: 132, draw: function (c, t, dt) {
      drops.forEach(function (d) { d.y += d.v * dt; if (d.y > 97) { d.y = 22; d.x = 96 + Math.random() * 74; } if ((d.x | 0) !== 132 && (d.y | 0) !== 58) { px(c, d.x, d.y, "#8fa8d8", 0.6); px(c, d.x, d.y - 1, "#8fa8d8", 0.3); } });
      if (flash <= 0 && Math.random() < 0.0015 * dt) flash = 8;
      if (flash > 0) { flash -= dt; c.globalAlpha = 0.25 * (flash / 8); rect(c, 96, 22, 74, 76, "#dfe8ff"); c.globalAlpha = 1; }
      var fl = 0.75 + 0.1 * Math.sin(t * 7) + 0.05 * Math.sin(t * 19);
      for (var y = -40; y <= 40; y++) for (var x = -45; x <= 45; x++) {
        var d = Math.hypot(x, y * 1.2); if (d > 45) continue;
        if (bt(155 + x, 118 + y) < (1 - d / 45) * 0.55 * fl) px(c, 155 + x, 118 + y, "#ffcc7a", 0.16);
      }
      dust.forEach(function (m) { m.p += 0.02 * dt; m.y -= 0.03 * dt; m.x += Math.sin(m.p) * 0.08; if (m.y < 95) { m.y = 150; m.x = 130 + Math.random() * 50; } px(c, m.x, m.y, "#ffe9b8", 0.3 + 0.3 * Math.sin(m.p * 3)); });
    } };
  };

  /* ---------- SKUMM: fogueira na floresta à noite ---------- */
  S.fogueira = function () {
    var R = seeded(31), st = stars(R, 90, 80);
    var FX = 128, FY = 150;
    var base = layer(function (c) {
      grad(c, 0, 0, W, 150, ["#05030e", "#0a0720", "#120d30", "#1c1440", "#2a1d4a"]);
      disc(c, 250, 30, 10, "#e8e2ff", "#b8b0dc"); px(c, 247, 28, "#c8c0ea"); px(c, 253, 33, "#c8c0ea");
      glow(c, 250, 30, 26, "#c8c0ff", 0.3);
      for (var x = 0; x < W; x++) { var h = Math.round(108 - 10 * Math.sin(x * 0.02 + 2) - 5 * Math.sin(x * 0.06)); rect(c, x, h, 1, 150 - h, "#1a1438"); }
      for (x = 0; x < W; x += 5 + Math.floor(R() * 5)) pine(c, x, 140, 16 + Math.floor(R() * 18), "#110c26");
      for (x = -4; x < W; x += 7 + Math.floor(R() * 10)) { if (x > 90 && x < 170) continue; pine(c, x, 156, 30 + Math.floor(R() * 26), "#080516"); }
      grad(c, 0, 150, W, 30, ["#0c0818", "#0a0714", "#070510"]);
      rect(c, FX - 10, FY + 1, 20, 2, "#5a3d22"); rect(c, FX - 6, FY, 12, 1, "#80592f");
      [[-14, 2], [12, 2], [-11, 4], [9, 4], [-3, 5]].forEach(function (p) { rect(c, FX + p[0], FY + p[1], 4, 2, "#3a3550"); px(c, FX + p[0], FY + p[1], "#5a5580"); });
      // tenda
      for (var k = 0; k < 20; k++) { var hw = Math.floor(k * 0.9); rect(c, 82 - hw, 132 + k, hw * 2 + 1, 1, k < 2 ? "#4a3a2a" : "#3a2c20"); }
      for (k = 4; k < 20; k++) { var hw2 = Math.floor((k - 4) * 0.35); rect(c, 82 - hw2, 132 + k, hw2 * 2 + 1, 1, "#0a0710"); }
      // Skumm sentado (silhueta de troll, capuz e presas)
      var TROLL = [
        "....###.....",
        "...#####....",
        "..##...##...",
        "..#.....#...",
        ".###...###..",
        "############",
        ".##########.",
        ".##########.",
        "############",
        "############",
        ".##########.",
        "###########.",
        "###.###.###."
      ];
      TROLL.forEach(function (row, r) { for (var q = 0; q < row.length; q++) if (row[q] === "#") px(c, 148 + q, 138 + r, "#05030a"); });
      px(c, 151, 142, "#ff3a2a"); px(c, 154, 142, "#ff3a2a"); px(c, 150, 144, "#e8e2d0"); px(c, 155, 144, "#e8e2d0");
      // adaga cravada no chão
      rect(c, 168, 144, 1, 7, "#c9d1da"); rect(c, 166, 143, 5, 1, "#8a6236"); rect(c, 168, 140, 1, 3, "#5a3d22");
    });
    var embers = [], flies = [];
    for (var i = 0; i < 12; i++) flies.push({ x: 20 + Math.random() * 280, y: 110 + Math.random() * 50, p: Math.random() * 6, r: 6 + Math.random() * 10 });
    return { base: base, foco: 130, draw: function (c, t, dt) {
      drawStars(c, st, t);
      var f = 0.8 + 0.12 * Math.sin(t * 11) + 0.08 * Math.sin(t * 23);
      for (var y = -26; y <= 22; y++) for (var x = -60; x <= 60; x++) {
        var d = Math.hypot(x, y * 1.8); if (d > 60) continue;
        if (bt(FX + x, FY + y) < (1 - d / 60) * 0.6 * f) px(c, FX + x, FY + y, "#ff8a3c", 0.2);
      }
      for (var fx = FX - 9; fx <= FX + 9; fx++) {
        var hh = Math.max(0, 15 - Math.abs(fx - FX) * 1.4 + Math.sin(t * 12 + fx) * 2.2 + Math.sin(t * 7 + fx * 3) * 1.6);
        for (var k = 0; k < hh; k++) {
          var col = k < hh * 0.35 ? "#fff3b0" : k < hh * 0.7 ? "#ffb347" : "#e2522b";
          if (Math.abs(fx - FX) > 5 && k < hh * 0.35) col = "#ffb347";
          px(c, fx, FY - k, col);
        }
      }
      if (Math.random() < 0.35 * dt) embers.push({ x: FX - 4 + Math.random() * 8, y: FY - 10, vx: (Math.random() - 0.5) * 0.2, l: 0 });
      embers = embers.filter(function (e) { e.l += dt; e.y -= 0.3 * dt; e.x += e.vx * dt + Math.sin(e.l * 0.1) * 0.06; px(c, e.x, e.y, e.l < 30 ? "#ffcf6a" : "#e2522b", 1 - e.l / 90); return e.l < 90; });
      flies.forEach(function (o) { var b = (Math.sin(t * 2.4 + o.p * 5) + 1) / 2; if (b < 0.3) return; var x = o.x + Math.sin(t * 0.5 + o.p) * o.r, y = o.y + Math.cos(t * 0.4 + o.p) * o.r * 0.5; px(c, x, y, "#d8ff8a", b); });
    } };
  };

  /* ---------- TREINO: parque ao amanhecer com barras ---------- */
  S.parque = function () {
    var R = seeded(17);
    var base = layer(function (c) {
      grad(c, 0, 0, W, 140, ["#2a3a6a", "#3e4c80", "#6a6a98", "#a87e98", "#e09a88", "#f6bc84", "#ffe0a0"]);
      disc(c, 236, 122, 14, "#fff2c0", "#ffd890"); glow(c, 236, 122, 40, "#fff0b0", 0.4);
      for (var x = 0; x < W; x++) { // cidade ao longe
        var b = Math.floor(x / 9), h = 112 - Math.floor((Math.sin(b * 12.9898) * 43758.5453 % 1 + 1) % 1 * 18);
        rect(c, x, h, 1, 140 - h, "#5a4a72"); if (x % 9 > 2 && x % 9 < 7 && (h + x) % 5 === 0) px(c, x, h + 4, "#ffd27a");
      }
      for (x = -10; x < W + 10; x += 14 + Math.floor(R() * 12)) { var r = 9 + Math.floor(R() * 8); disc(c, x, 132 - r * 0.6, r, "#3a5a3a"); disc(c, x - 2, 130 - r * 0.8, r - 3, "#4a6a42"); }
      grad(c, 0, 138, W, 42, ["#5a8a42", "#4a7a3a", "#3e6a32", "#345a2a"]);
      for (var y = 150; y < H; y++) { var px0 = 40 + (y - 150) * 2; for (x = px0; x < px0 + 50 + (y - 150) * 2; x++) px(c, x, y, bt(x, y) < 0.2 ? "#b8a080" : "#a89070"); }
      // estrutura de barras
      rect(c, 92, 100, 3, 54, "#55606a"); rect(c, 162, 100, 3, 54, "#55606a"); rect(c, 92, 100, 73, 3, "#9aa3ad"); rect(c, 92, 100, 73, 1, "#cdd5de");
      rect(c, 92, 154, 3, 2, "#2a2a2a"); rect(c, 162, 154, 3, 2, "#2a2a2a");
      rect(c, 180, 132, 34, 2, "#9aa3ad"); rect(c, 182, 134, 2, 20, "#55606a"); rect(c, 210, 134, 2, 20, "#55606a");
      rect(c, 180, 140, 34, 2, "#9aa3ad"); rect(c, 182, 142, 2, 12, "#55606a"); rect(c, 210, 142, 2, 12, "#55606a");
      rect(c, 48, 148, 26, 3, "#80592f"); rect(c, 50, 151, 2, 5, "#5a3d22"); rect(c, 70, 151, 2, 5, "#5a3d22");
      rect(c, 60, 145, 6, 3, "#2d5a7a"); rect(c, 66, 146, 3, 2, "#f4f1e8"); // mochila e garrafa
    });
    var grass = []; for (var x = 0; x < W; x += 2) grass.push({ x: x, h: 2 + Math.floor(Math.random() * 3) });
    var birds = [], reps = 0, wasTop = false, clouds = [];
    for (var i = 0; i < 4; i++) clouds.push({ x: Math.random() * W, y: 20 + Math.random() * 50, w: 20 + Math.random() * 26, v: 0.05 + Math.random() * 0.08 });
    return { base: base, foco: 128, draw: function (c, t, dt) {
      clouds.forEach(function (k) { k.x += k.v * dt; if (k.x > W + 30) k.x = -60; rect(c, k.x, k.y, k.w, 3, "rgba(255,210,200,.55)"); rect(c, k.x + 5, k.y - 2, k.w - 12, 2, "rgba(255,225,215,.55)"); });
      // atleta a fazer elevações
      var ph = (t * 0.5) % 1, up = ph < 0.4 ? ph / 0.4 : ph < 0.5 ? 1 : ph < 0.9 ? 1 - (ph - 0.5) / 0.4 : 0;
      up = up * up * (3 - 2 * up);
      if (up > 0.98 && !wasTop) { reps = reps % 10 + 1; wasTop = true; } if (up < 0.5) wasTop = false;
      var cx = 128, sy = Math.round(124 - up * 16);
      for (var k = 0; k <= 20; k++) { var f = k / 20, bend = up > 0.4 ? -Math.sin(f * Math.PI) * 4 * up : 0;
        px(c, 122 + (125 - 122) * f + bend * 0.3, 102 + (sy - 102) * f, "#e8b48a"); px(c, 123 + (125 - 123) * f + bend * 0.3, 102 + (sy - 102) * f, "#d8a07a");
        px(c, 134 + (131 - 134) * f - bend * 0.3, 102 + (sy - 102) * f, "#e8b48a"); px(c, 133 + (131 - 133) * f - bend * 0.3, 102 + (sy - 102) * f, "#d8a07a"); }
      rect(c, 121, 101, 3, 2, "#e8b48a"); rect(c, 133, 101, 3, 2, "#e8b48a");
      rect(c, cx - 3, sy - 8, 6, 7, "#e8b48a"); rect(c, cx - 3, sy - 8, 6, 3, "#3a2a1d"); px(c, cx + 1, sy - 4, "#1a1410");
      rect(c, cx - 4, sy, 9, 11, "#2d5a7a"); rect(c, cx - 4, sy, 9, 1, "#3f7aa3");
      rect(c, cx - 4, sy + 11, 9, 4, "#1a1426");
      rect(c, cx - 3, sy + 15, 3, 7, "#e8b48a"); rect(c, cx + 1, sy + 15, 3, 7, "#e8b48a");
      rect(c, cx - 2, sy + 22, 3, 3, "#e8b48a"); rect(c, cx + 2, sy + 22, 3, 3, "#e8b48a");
      rect(c, cx - 2, sy + 25, 4, 1, "#f4f1e8"); rect(c, cx + 2, sy + 25, 4, 1, "#f4f1e8");
      // pássaros
      if (Math.random() < 0.004 * dt) { var by = 20 + Math.random() * 40; for (var b = 0; b < 3; b++) birds.push({ x: -8 - b * 8, y: by + b * 3, f: b * 4 }); }
      birds = birds.filter(function (o) { o.x += 0.4 * dt; o.f += dt; sprite(c, BIRD[Math.floor(o.f / 9) % 2], o.x, o.y + Math.sin(o.f * 0.05), "#2a2236"); return o.x < W + 10; });
      grass.forEach(function (g) { var lean = Math.round(Math.sin(t * 1.6 + g.x * 0.15)); for (var k = 0; k < g.h; k++) px(c, g.x + (k === g.h - 1 ? lean : 0), H - 1 - k, k === g.h - 1 ? "#8fbf5a" : "#4f8a3f"); });
    } };
  };

  /* ---------- OFICINA: bancada à noite ---------- */
  S.oficina = function () {
    var R = seeded(23), lights = [];
    var base = layer(function (c) {
      grad(c, 0, 0, W, 132, ["#141a20", "#182028", "#1c242c"]);
      // painel de ferramentas
      rect(c, 14, 24, 70, 70, "#5a4a32"); for (var y = 28; y < 92; y += 5) for (var x = 18; x < 82; x += 5) px(c, x, y, "#3a2e1e");
      rect(c, 22, 32, 2, 22, "#9aa3ad"); rect(c, 20, 30, 6, 4, "#9aa3ad");                   // chave
      rect(c, 34, 34, 2, 14, "#c9d1da"); rect(c, 33, 48, 4, 9, "#c0392b");                    // chave de fendas
      rect(c, 46, 32, 2, 18, "#555c66"); rect(c, 50, 32, 2, 18, "#555c66"); rect(c, 45, 50, 4, 8, "#c08a3c"); rect(c, 49, 50, 4, 8, "#c08a3c"); // alicate
      rect(c, 60, 34, 14, 6, "#2d5a7a"); rect(c, 64, 40, 6, 14, "#3a3a40");                   // martelo
      rect(c, 22, 66, 50, 2, "#2a2a30"); for (var k = 0; k < 6; k++) disc(c, 26 + k * 8, 76, 3, ["#c0392b", "#f4c16a", "#3d6b2f", "#2e4a7a", "#8a7a5a", "#5a2d6b"][k]); // bobinas
      // janela com cidade
      rect(c, 206, 18, 92, 72, "#2a2f36"); grad(c, 210, 22, 84, 64, ["#080c1c", "#10162c", "#1a2240"]);
      for (x = 210; x < 294; x++) { var b = Math.floor(x / 7), h = 50 + Math.floor(((Math.sin(b * 78.233) * 43758.5453) % 1 + 1) % 1 * 26); rect(c, x, h, 1, 86 - h, "#0a0e18");
        if (x % 7 > 1 && x % 7 < 5) for (var yy = h + 3; yy < 84; yy += 5) if (R() < 0.35) lights.push([x, yy]); }
      rect(c, 250, 22, 2, 64, "#2a2f36"); rect(c, 210, 52, 84, 2, "#2a2f36");
      // prateleira com caixas
      rect(c, 100, 40, 90, 3, "#6b4a28"); [[104, 26, 16, 14, "#7a5a2d"], [122, 30, 12, 10, "#2e4a7a"], [140, 22, 20, 18, "#5a4a32"], [164, 30, 14, 10, "#3d6b2f"]].forEach(function (b) { rect(c, b[0], b[1], b[2], b[3], b[4]); rect(c, b[0], b[1], b[2], 1, "rgba(255,255,255,.15)"); });
      // bancada
      rect(c, 40, 132, 250, 6, "#6b4a28"); rect(c, 40, 132, 250, 1, "#8a6236"); rect(c, 48, 138, 4, 42, "#4a3018"); rect(c, 278, 138, 4, 42, "#4a3018");
      grad(c, 0, 138, W, 42, ["#121418", "#0e1014", "#0a0c0e"]); rect(c, 48, 138, 4, 42, "#4a3018"); rect(c, 278, 138, 4, 42, "#4a3018");
      // monitor
      rect(c, 92, 90, 66, 40, "#2a2f36"); rect(c, 95, 93, 60, 33, "#061006"); rect(c, 120, 130, 10, 2, "#2a2f36");
      // teclado
      rect(c, 98, 128, 50, 4, "#3a3f46"); for (x = 100; x < 146; x += 3) px(c, x, 129, "#5a6068");
      // router
      rect(c, 172, 122, 26, 10, "#1a1d22"); rect(c, 174, 114, 1, 8, "#1a1d22"); rect(c, 195, 114, 1, 8, "#1a1d22");
      // ferro de soldar e placa
      rect(c, 208, 126, 18, 6, "#2d6b2d"); for (x = 210; x < 225; x += 3) px(c, x, 128, "#f4c16a");
      rect(c, 232, 124, 12, 8, "#3a3a40"); rect(c, 236, 112, 1, 12, "#9aa3ad"); px(c, 236, 111, "#ff7a3a");
      // candeeiro articulado
      rect(c, 60, 100, 2, 32, "#3a3a40"); for (k = 0; k < 16; k++) px(c, 61 + k, 100 - k * 0.6, "#3a3a40"); rect(c, 74, 86, 10, 5, "#c0392b");
    });
    var LINES = ["$ ssh pi@oficina", "$ sudo apt update", "$ bluetoothctl scan on", "[NEW] GPS WATCH", "$ git push origin main", "> deploy ok", "$ ping -c 3 1.1.1.1", "64 bytes ttl=57"];
    var total = LINES.reduce(function (s, l) { return s + l.length + 6; }, 0) + 30;
    var smoke = [];
    function gear(c, cx, cy, Rr, teeth, rot) {
      for (var y = -Rr - 2; y <= Rr + 2; y++) for (var x = -Rr - 2; x <= Rr + 2; x++) {
        var d = Math.hypot(x, y), a = Math.atan2(y, x) - rot, tooth = ((a / (Math.PI * 2) * teeth) % 1 + 1) % 1 < 0.5;
        if (d > (tooth ? Rr + 2 : Rr) || d < Rr * 0.35) continue;
        px(c, cx + x, cy + y, d < Rr * 0.55 ? "#4a5058" : x + y < -Rr * 0.4 ? "#c9d1da" : x + y > Rr * 0.6 ? "#4a5058" : "#8a929c");
      }
    }
    return { base: base, foco: 125, draw: function (c, t, dt) {
      lights.forEach(function (l, i) { if (((i * 7 + Math.floor(t * 0.3)) % 11) > 2) px(c, l[0], l[1], "#ffd27a", 0.8); });
      for (var y = -30; y <= 30; y++) for (var x = -40; x <= 40; x++) { var d = Math.hypot(x, y); if (d > 40) continue; if (bt(125 + x, 110 + y) < (1 - d / 40) * 0.4) px(c, 125 + x, 110 + y, "#7dff8a", 0.08); }
      var cyc = Math.floor(t * 14) % total, acc = 0, shown = [];
      for (var i = 0; i < LINES.length; i++) { if (cyc < acc) break; shown.push([i, Math.min(LINES[i].length, cyc - acc)]); acc += LINES[i].length + 6; }
      shown.slice(-7).forEach(function (s, row, arr) {
        var text = LINES[s[0]].slice(0, s[1]);
        for (var k = 0; k < text.length && k < 27; k++) { if (text[k] === " ") continue; rect(c, 98 + k * 2, 96 + row * 4, 1, 2, text[0] === "$" ? (k === 0 ? "#f4c16a" : "#7dff8a") : "#b8e8ff"); }
        if (row === arr.length - 1 && Math.floor(t * 2) % 2) rect(c, 98 + Math.min(text.length, 27) * 2, 96 + row * 4, 2, 2, "#7dff8a");
      });
      for (var l = 0; l < 4; l++) px(c, 176 + l * 5, 126, Math.random() < 0.5 ? "#3aff6a" : "#0a4a1a");
      px(c, 196, 126, Math.floor(t) % 2 ? "#ff9a3a" : "#3a1a0a");
      gear(c, 286, 112, 9, 9, t * 0.6);
      if (Math.random() < 0.15 * dt) smoke.push({ x: 236, y: 110, l: 0 });
      smoke = smoke.filter(function (s) { s.l += dt; s.y -= 0.2 * dt; s.x += Math.sin(s.l * 0.08) * 0.25; px(c, s.x, s.y, "#c8c8d0", 0.45 * (1 - s.l / 80)); return s.l < 80; });
    } };
  };

  /* ---------- NATUREZA: floresta com riacho ---------- */
  S.floresta = function () {
    var R = seeded(11);
    function riverX(y) { return 150 + 30 * Math.sin((y - 110) * 0.045) - (y - 110) * 0.6; }
    function riverW(y) { return 3 + (y - 110) * 0.42; }
    var base = layer(function (c) {
      grad(c, 0, 0, W, 120, ["#8cc6ec", "#a6d2ee", "#c4e2ec", "#dcecdc"]);
      disc(c, 270, 26, 9, "#fffbe0", "#fff0b0"); glow(c, 270, 26, 30, "#fff6c8", 0.4);
      for (var x = 0; x < W; x++) { var h = Math.round(92 - 8 * Math.sin(x * 0.025 + 1) - 4 * Math.sin(x * 0.09)); rect(c, x, h, 1, 120 - h, "#8ab07a"); }
      for (x = 0; x < W; x += 4 + Math.floor(R() * 4)) pine(c, x, 116, 10 + Math.floor(R() * 10), "#5f8f58", "#7aaa6a");
      grad(c, 0, 110, W, 70, ["#6aa04f", "#5a9445", "#4e863c", "#447a34"]);
      for (var y = 110; y < H; y++) { var rx = riverX(y), rw = riverW(y); for (x = Math.floor(rx - rw); x <= rx + rw; x++) { var e = Math.min(x - (rx - rw), rx + rw - x); px(c, x, y, e < 1.2 ? "#cfe6f0" : bt(x, y) < 0.25 ? "#6aa8d8" : "#4a8ac0"); } }
      [[96, 168, 5], [130, 150, 3], [200, 158, 4], [214, 174, 6], [74, 176, 4]].forEach(function (s) { disc(c, s[0], s[1], s[2], "#7a7488", "#5a5468"); px(c, s[0] - 1, s[1] - s[2] + 1, "#a8a2b8"); });
      // árvores grandes
      [[104, 156, 28], [262, 156, 30], [300, 140, 20], [30, 140, 20]].forEach(function (tr) {
        rect(c, tr[0] - 3, tr[1] - tr[2] * 1.6, 6, tr[2] * 1.6, "#5a3d22"); rect(c, tr[0] - 3, tr[1] - tr[2] * 1.6, 2, tr[2] * 1.6, "#80592f");
      });
      // raios de sol
      for (y = 0; y < 150; y++) for (x = 0; x < W; x++) { var band = ((x + y * 0.8) % 60); if (band < 10 && x > 120 && bt(x, y) < 0.18 * (1 - y / 150)) px(c, x, y, "#fff8d0", 0.35); }
      for (x = 0; x < W; x += 3) { var fh = 3 + Math.floor(R() * 6); if (Math.abs(x - riverX(176)) < riverW(176) + 3) continue; for (var k = 0; k < fh; k++) px(c, x + (k % 2), H - 1 - k, "#2f6a28"); }
    });
    var crowns = [[104, 156, 28], [262, 156, 30], [300, 140, 20], [30, 140, 20]];
    var leaves = [], sparks = [], birds = [], flies = [{ x: 120, y: 120, p: 0, c: "#ffd447" }, { x: 160, y: 130, p: 2, c: "#ffffff" }];
    var grass = []; for (var x = 0; x < W; x += 2) grass.push({ x: x, h: 2 + Math.floor(Math.random() * 4) });
    return { base: base, foco: 140, draw: function (c, t, dt) {
      crowns.forEach(function (tr, i) {
        var sw = Math.sin(t * 0.9 + i) * 1.4, top = tr[1] - tr[2] * 1.6;
        [[0, -4, 1, "#3f7a35"], [-0.55, 4, 0.7, "#356a2d"], [0.55, 4, 0.7, "#356a2d"], [0.1, -10, 0.65, "#4f8f3f"], [0.25, -6, 0.4, "#6faa4f"]].forEach(function (b) {
          var r = Math.round(tr[2] * b[2]), cx = tr[0] + b[0] * tr[2] + sw, cy = top + b[1];
          for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) { var d = Math.hypot(x, y * 1.15); if (d > r) continue; px(c, cx + x + sw * (y < 0 ? 0.3 : 0), cy + y, d > r - 1.3 && bt(x, y) < 0.5 ? "#2c5a26" : b[3]); }
        });
      });
      if (Math.random() < 0.06 * dt) { var tr = crowns[Math.floor(Math.random() * crowns.length)]; leaves.push({ x: tr[0] - 10 + Math.random() * 20, y: tr[1] - tr[2] * 1.6, l: 0, c: ["#e0a030", "#c0582a", "#8fbf5a"][Math.floor(Math.random() * 3)] }); }
      leaves = leaves.filter(function (o) { o.l += dt; o.y += 0.15 * dt; o.x += 0.12 * dt + Math.sin(o.l * 0.07) * 0.35; px(c, o.x, o.y, o.c); if (Math.floor(o.l / 10) % 2) px(c, o.x + 1, o.y, o.c); return o.y < H; });
      if (Math.random() < 0.5 * dt) { var y = 112 + Math.random() * 68; sparks.push({ y: y, l: 0 }); }
      sparks = sparks.filter(function (s) { s.l += dt; s.y += 0.25 * dt; var x = riverX(s.y) + Math.sin(s.y) * riverW(s.y) * 0.6; px(c, x, s.y, "#ffffff", s.l < 10 ? s.l / 10 : 1 - (s.l - 10) / 30); return s.l < 40 && s.y < H; });
      flies.forEach(function (f) { f.p += 0.03 * dt; var x = f.x + Math.sin(f.p) * 20, y = f.y + Math.sin(f.p * 2.3) * 8; var open = Math.floor(t * 8) % 2; px(c, x, y, f.c); if (open) { px(c, x - 1, y - 1, f.c); px(c, x + 1, y - 1, f.c); } else { px(c, x - 1, y, f.c); px(c, x + 1, y, f.c); } });
      if (Math.random() < 0.004 * dt) birds.push({ x: -6, y: 20 + Math.random() * 30, f: 0 });
      birds = birds.filter(function (o) { o.x += 0.45 * dt; o.f += dt; sprite(c, BIRD[Math.floor(o.f / 8) % 2], o.x, o.y, "#1d1a24"); px(c, o.x + 2, o.y + 1, "#ffffff"); return o.x < W + 8; });
      grass.forEach(function (g) { var lean = Math.round(Math.sin(t * 1.8 + g.x * 0.2)); px(c, g.x + lean, H - g.h - 1, "#8fbf5a"); });
    } };
  };

  return { W: W, H: H, criar: function (nome) { return (S[nome] || S.floresta)(); } };
})();
