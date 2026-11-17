/* After Hours Compendium — script partilhado pelas páginas interiores.
   Monta a barra lateral, desenha a cena de fundo e anima o banner em pixel art de cada página. */
(function () {
  var PAGES = [
    ["musica", "note", "Música"],
    ["estante", "book", "Estante"],
    ["skumm", "dagger", "Skumm"],
    ["treino", "bar", "Treino"],
    ["oficina", "gear", "Oficina"],
    ["natureza", "leaf", "Natureza"]
  ];
  var cur = document.body.dataset.page;
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("onpagereveal" in window)) document.documentElement.classList.add("sem-vt");

  // ---------- barra lateral ----------
  var nav = document.getElementById("nav");
  nav.innerHTML =
    '<a class="brand" href="./">After Hours Compendium<small>um sítio meu, depois de horas</small></a>' +
    '<ul class="links">' + PAGES.map(function (p) {
      var on = p[0] === cur;
      return '<li><a class="plank' + (on ? ' atual' : '') + '" href="' + p[0] + '.html" data-icon="' + p[1] + '"' +
        (on ? ' aria-current="page"' : '') + '>' + p[2] + '</a></li>';
    }).join("") + '</ul>' +
    '<a class="voltar" href="./">◀ voltar ao monte</a>';

  var ICONS = {
    note: ["...###..", "...#.##.", "...#..#.", "...#....", ".###....", "####....", "####....", ".##....."],
    book: [".######.", "#......#", "#.####.#", "#......#", "#.###..#", "#......#", ".######.", "..#..#.."],
    dagger: [".......#", "......##", ".....##.", "....##..", "#..##...", ".###....", ".##.....", "#..#...."],
    bar: ["........", "##....##", "##....##", "########", "##....##", "##....##", "........", "........"],
    gear: ["...##...", ".######.", ".##..##.", "###..###", "###..###", ".##..##.", ".######.", "...##..."],
    leaf: ["....####", "...#####", "..######", ".####.##", ".###.###", ".##.####", ".#.####.", "#......."]
  };
  nav.querySelectorAll(".plank").forEach(function (b) {
    var c = document.createElement("canvas"); c.width = 8; c.height = 8; c.setAttribute("aria-hidden", "true");
    var x = c.getContext("2d"), rows = ICONS[b.dataset.icon];
    for (var r = 0; r < 8; r++) for (var k = 0; k < 8; k++) if (rows[r][k] === "#") { x.fillStyle = r < 2 ? "#ffe39a" : "#f4c16a"; x.fillRect(k, r, 1, 1); }
    b.prepend(c);
  });

  // ---------- fundo: mesma cena e mesmo enquadramento da página inicial ----------
  var W = 364, H = 204;
  var bg = document.getElementById("bg"), bctx = bg.getContext("2d");
  var mo = document.getElementById("motes"), mctx = mo.getContext("2d");
  function fit() {
    var vw = innerWidth, vh = innerHeight, s = Math.max(vw / W, vh / H), w = W * s, h = H * s;
    var left = Math.min(0, Math.max(vw - w, vw * (vw > 760 ? 0.58 : 0.5) - 0.40 * w));
    var top = Math.min(0, Math.max(vh - h, vh * 0.62 - 0.72 * h));
    [bg, mo].forEach(function (e) { e.style.width = w + "px"; e.style.height = h + "px"; e.style.left = left + "px"; e.style.top = top + "px"; });
  }
  fit(); addEventListener("resize", fit);
  var img = new Image(); img.src = "img/scene.png";
  img.onload = function () { bctx.drawImage(img, 0, 0); };
  var motes = [];
  for (var i = 0; i < 26; i++) motes.push({ x: Math.random() * W, y: Math.random() * H, p: Math.random() * 6.28 });

  // ---------- utilitários de pixel ----------
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  function bt(x, y) { return (BAYER[y & 3][x & 3] + 0.5) / 16; }
  function px(c, x, y, col, a) { if (a != null) c.globalAlpha = a; c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), 1, 1); c.globalAlpha = 1; }
  function rect(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); }
  function grad(c, w, h, cols) {
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var t = y / (h - 1) * (cols.length - 1), b = Math.floor(t), f = t - b;
      px(c, x, y, cols[Math.min(cols.length - 1, b + (bt(x, y) < f ? 1 : 0))]);
    }
  }
  function staticLayer(w, h, fn) { var c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d")); return c; }
  function seeded(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  var DIG = { "0": "111101101101111", "1": "010110010010111", "2": "111001111100111", "3": "111001111001111", "4": "101101111001001",
    "5": "111100111001111", "6": "111100111101111", "7": "111001001001001", "8": "111101111101111", "9": "111101111001111" };
  function num(c, n, x, y, col) {
    String(n).split("").forEach(function (d, i) {
      var m = DIG[d]; for (var k = 0; k < 15; k++) if (m[k] === "1") px(c, x + i * 4 + k % 3, y + Math.floor(k / 3), col);
    });
  }

  // ---------- banners (160x44) ----------
  var BW = 160, BH = 44;
  var BANNERS = {

    musica: function () {
      var back = staticLayer(BW, BH, function (c) { grad(c, BW, BH, ["#1a1124", "#24152c", "#311a2e", "#43202c"]); });
      var notes = [];
      var NOTE = ["..##", "..#.", "..#.", "###.", "##.."];
      return function (c, t, dt) {
        c.drawImage(back, 0, 0);
        // vinil a rodar
        var cx = 22, cy = 22;
        for (var y = -17; y <= 17; y++) for (var x = -17; x <= 17; x++) {
          var d = Math.hypot(x, y); if (d > 16.5) continue;
          var col = "#0f0c10";
          if (d > 15.5) col = "#2a2430";
          else if (d < 5) col = d < 1.5 ? "#140f0b" : "#f4c16a";
          else if ((Math.round(d) % 3) === 0) col = "#1d1820";
          var a = Math.atan2(y, x) - t * 3.2;
          var s = Math.cos(a * 2);
          if (d >= 7 && d <= 14 && s > 0.985 && Math.round(d) % 3 !== 0) col = "#3d3546";
          if (d < 5 && d > 1.5 && Math.cos(a) > 0.8) col = "#ffe39a";
          px(c, cx + x, cy + y, col);
        }
        // braço do gira-discos
        rect(c, 40, 6, 2, 2, "#c9b9a0"); for (var k = 0; k < 10; k++) px(c, 40 - k * 0.6, 8 + k, "#a8987f");
        // equalizador
        for (var i = 0; i < 17; i++) {
          var lv = (Math.sin(t * 4.1 + i * 1.3) + Math.sin(t * 6.7 + i * 0.6) + Math.sin(t * 2.3 + i * 2.1) + 3) / 6;
          var hgt = Math.round(3 + lv * 13);
          for (var sgm = 0; sgm < hgt; sgm++) {
            var col2 = sgm > 12 ? "#ff6b4a" : sgm > 8 ? "#ffb347" : "#f4c16a";
            rect(c, 52 + i * 6, 40 - sgm * 2, 4, 1, col2);
          }
        }
        // notas a subir
        if (Math.random() < 0.03 * dt) notes.push({ x: 30 + Math.random() * 10, y: 10, t: 0 });
        notes = notes.filter(function (n) {
          n.t += dt; n.y -= 0.12 * dt; n.x += Math.sin(n.t * 0.06) * 0.2;
          var a = n.t < 20 ? n.t / 20 : Math.max(0, 1 - (n.t - 20) / 60);
          for (var r = 0; r < 5; r++) for (var k = 0; k < 4; k++) if (NOTE[r][k] === "#") px(c, n.x + k, n.y + r, "#fff1c4", a);
          return n.t < 80;
        });
      };
    },

    estante: function () {
      var R = seeded(7);
      var back = staticLayer(BW, BH, function (c) {
        grad(c, BW, BH, ["#20160f", "#2a1d13", "#33231a"]);
        for (var y = 0; y < 34; y += 6) for (var x = 0; x < BW; x++) if (bt(x, y) < 0.3) px(c, x, y + ((x / 40) | 0) % 2, "#3b2a1d");
        rect(c, 0, 34, BW, 4, "#80592f"); rect(c, 0, 34, BW, 1, "#a87a45"); rect(c, 0, 38, BW, 6, "#33220f");
        var x = 4, cols = ["#7a2e2e", "#2e4a7a", "#3d6b2f", "#7a5a2d", "#5a2d6b", "#2d6b6b", "#8a7a5a", "#a14a2a", "#2a2a3a"];
        while (x < 128) {
          var w = 3 + Math.floor(R() * 4), h = 16 + Math.floor(R() * 13), col = cols[Math.floor(R() * cols.length)];
          if (R() < 0.08) { // livro inclinado
            for (var k = 0; k < h; k++) rect(c, x + Math.floor(k * 0.35), 34 - h + k, w, 1, col);
            x += w + Math.ceil(h * 0.35) + 1; continue;
          }
          rect(c, x, 34 - h, w, h, col); rect(c, x, 34 - h, 1, h, "rgba(255,255,255,.18)"); rect(c, x + w - 1, 34 - h, 1, h, "rgba(0,0,0,.3)");
          rect(c, x, 34 - h + 3, w, 1, "#f4c16a"); if (h > 20) rect(c, x, 34 - 4, w, 1, "#f4c16a");
          x += w + (R() < 0.2 ? 1 : 0);
        }
        rect(c, 142, 26, 6, 8, "#efe2c4"); rect(c, 142, 26, 1, 8, "#fff7e6"); rect(c, 140, 33, 10, 1, "#80592f");
      });
      var dust = []; for (var i = 0; i < 14; i++) dust.push({ x: Math.random() * BW, y: Math.random() * 34, p: Math.random() * 6 });
      return function (c, t, dt) {
        c.drawImage(back, 0, 0);
        var fl = 0.7 + 0.2 * Math.sin(t * 9) + 0.1 * Math.sin(t * 23) + (Math.random() < 0.05 ? -0.25 : 0);
        for (var y = -14; y <= 14; y++) for (var x = -18; x <= 18; x++) {
          var d = Math.hypot(x, y * 1.3); if (d > 18) continue;
          if (bt(x + 145, y + 20) < (1 - d / 18) * 0.6 * fl) px(c, 145 + x, 20 + y, "#ffb35c", 0.22);
        }
        rect(c, 144, 25, 1, 1, "#33220f");
        var fh = 3 + Math.round(fl * 2);
        for (var k = 0; k < fh; k++) px(c, 144 + (k > 1 ? Math.round(Math.sin(t * 7) * 0.6) : 0), 24 - k, k === 0 ? "#ffffff" : k < 2 ? "#ffe39a" : "#ff9a3c");
        dust.forEach(function (m) {
          m.p += 0.02 * dt; m.y += 0.03 * dt; m.x += Math.sin(m.p) * 0.08;
          if (m.y > 34) { m.y = 0; m.x = Math.random() * BW; }
          px(c, m.x, m.y, "#ffe9b8", 0.25 + 0.25 * Math.sin(m.p * 3));
        });
      };
    },

    skumm: function () {
      var R = seeded(31);
      var stars = []; for (var i = 0; i < 40; i++) stars.push({ x: Math.floor(R() * BW), y: Math.floor(R() * 26), p: R() * 6 });
      var back = staticLayer(BW, BH, function (c) {
        grad(c, BW, BH, ["#070512", "#0e0b24", "#1a1438", "#2a1d44"]);
        for (var y = -6; y <= 6; y++) for (var x = -6; x <= 6; x++) if (Math.hypot(x, y) <= 5.5) px(c, 132 + x, 9 + y, Math.hypot(x - 2, y + 1) < 4.5 ? "#e8e2ff" : "#b8b0dc");
        for (var x2 = 0; x2 < BW; x2++) {
          var h = Math.round(30 - 5 * Math.sin(x2 * 0.05 + 1) - 3 * Math.sin(x2 * 0.13));
          rect(c, x2, h, 1, BH - h, "#120d22");
        }
        for (var x3 = 0; x3 < BW; x3 += 4 + Math.floor(R() * 5)) {
          var th = 6 + Math.floor(R() * 7), base = 34;
          for (var k = 0; k < th; k++) { var hw = Math.floor(k * 0.35); rect(c, x3 - hw, base - th + k, hw * 2 + 1, 1, "#0a0716"); }
        }
        rect(c, 0, 36, BW, 8, "#0a0716");
        rect(c, 70, 38, 20, 2, "#5a3d22"); rect(c, 74, 37, 12, 1, "#80592f");
        // pedras à volta da fogueira
        [[66, 39], [92, 39], [68, 41], [90, 41]].forEach(function (p) { rect(c, p[0], p[1], 3, 2, "#3a3550"); px(c, p[0], p[1], "#55507a"); });
        // silhueta: troll sentado com capuz
        var TROLL = ["...##...", "..####..", ".##..##.", ".#####..", "########", ".######.", ".######.", "########", "##.##.##"];
        TROLL.forEach(function (row, r) { for (var k = 0; k < row.length; k++) if (row[k] === "#") px(c, 102 + k, 29 + r, "#05030c"); });
        rect(c, 110, 30, 1, 1, "#d23b3b"); // olho
      });
      var embers = [];
      return function (c, t, dt) {
        c.drawImage(back, 0, 0);
        stars.forEach(function (s) { var v = 0.4 + 0.6 * Math.sin(t * 2 + s.p); if (v > 0.15) px(c, s.x, s.y, "#ffffff", v); });
        // brilho da fogueira
        for (var y = -12; y <= 6; y++) for (var x = -22; x <= 22; x++) {
          var d = Math.hypot(x, y * 1.5); if (d > 22) continue;
          if (bt(x + 80, y + 36) < (1 - d / 22) * (0.55 + 0.1 * Math.sin(t * 11))) px(c, 80 + x, 36 + y, "#ff8a3c", 0.18);
        }
        // chamas
        for (var fx = 72; fx < 88; fx++) {
          var hh = Math.max(0, 9 - Math.abs(fx - 80) * 1.1 + Math.sin(t * 12 + fx) * 1.6 + Math.sin(t * 7 + fx * 3) * 1.2);
          for (var k = 0; k < hh; k++) {
            var col = k < hh * 0.35 ? "#fff3b0" : k < hh * 0.7 ? "#ffb347" : "#e2522b";
            if (Math.abs(fx - 80) > 4 && k < hh * 0.35) col = "#ffb347";
            px(c, fx, 37 - k, col);
          }
        }
        if (Math.random() < 0.25 * dt) embers.push({ x: 76 + Math.random() * 8, y: 30, vx: (Math.random() - 0.5) * 0.15, t: 0 });
        embers = embers.filter(function (e) {
          e.t += dt; e.y -= 0.25 * dt; e.x += e.vx * dt + Math.sin(e.t * 0.1) * 0.05;
          px(c, e.x, e.y, e.t < 30 ? "#ffcf6a" : "#e2522b", Math.max(0, 1 - e.t / 70));
          return e.t < 70;
        });
      };
    },

    treino: function () {
      var back = staticLayer(BW, BH, function (c) {
        grad(c, BW, BH, ["#16202a", "#1d2a36", "#253545"]);
        for (var x = 0; x < BW; x += 8) for (var y = 0; y < 36; y++) if ((y + (x / 8 | 0) * 2) % 6 === 0) px(c, x, y, "#2c3e50");
        rect(c, 0, 38, BW, 6, "#3a2a1d"); rect(c, 0, 38, BW, 1, "#5a3d22");
        // barra de elevações
        rect(c, 50, 6, 2, 32, "#555c66"); rect(c, 108, 6, 2, 32, "#555c66");
        rect(c, 50, 6, 60, 2, "#9aa3ad"); rect(c, 50, 6, 60, 1, "#cdd5de");
        // paralelas e argolas
        rect(c, 126, 26, 26, 2, "#9aa3ad"); rect(c, 128, 28, 2, 10, "#555c66"); rect(c, 148, 28, 2, 10, "#555c66");
        rect(c, 18, 0, 1, 18, "#c9b9a0"); rect(c, 28, 0, 1, 18, "#c9b9a0");
        [[16, 18], [26, 18]].forEach(function (p) { rect(c, p[0], p[1], 5, 1, "#f4c16a"); rect(c, p[0], p[1] + 4, 5, 1, "#f4c16a"); rect(c, p[0], p[1], 1, 5, "#f4c16a"); rect(c, p[0] + 4, p[1], 1, 5, "#f4c16a"); });
      });
      var reps = 0, wasTop = false;
      return function (c, t) {
        c.drawImage(back, 0, 0);
        var ph = (t * 0.55) % 1;
        var up = ph < 0.4 ? ph / 0.4 : ph < 0.5 ? 1 : ph < 0.9 ? 1 - (ph - 0.5) / 0.4 : 0;
        up = up * up * (3 - 2 * up);
        if (up > 0.98 && !wasTop) { reps = reps % 10 + 1; wasTop = true; } if (up < 0.5) wasTop = false;
        var sy = Math.round(20 - up * 11), cx = 80;
        // braços
        for (var k = 0; k <= 16; k++) {
          var f = k / 16;
          px(c, 75 + (77 - 75) * f, 8 + (sy - 8) * f + (up > 0.5 ? -Math.sin(f * Math.PI) * 3 * up : 0), "#e8b48a");
          px(c, 85 + (83 - 85) * f, 8 + (sy - 8) * f + (up > 0.5 ? -Math.sin(f * Math.PI) * 3 * up : 0), "#e8b48a");
        }
        rect(c, 74, 7, 2, 2, "#e8b48a"); rect(c, 84, 7, 2, 2, "#e8b48a");
        // cabeça
        rect(c, cx - 2, sy - 6, 4, 5, "#e8b48a"); rect(c, cx - 2, sy - 6, 4, 2, "#3a2a1d");
        // tronco (t-shirt) e calções
        rect(c, cx - 3, sy, 7, 8, "#2d5a7a"); rect(c, cx - 3, sy, 7, 1, "#3f7aa3");
        rect(c, cx - 3, sy + 8, 7, 3, "#1a1426");
        // pernas (joelhos dobrados, pés cruzados)
        rect(c, cx - 2, sy + 11, 2, 5, "#e8b48a"); rect(c, cx + 1, sy + 11, 2, 5, "#e8b48a");
        rect(c, cx - 1, sy + 16, 2, 3, "#e8b48a"); rect(c, cx + 2, sy + 16, 2, 3, "#e8b48a");
        rect(c, cx - 1, sy + 19, 3, 1, "#f4f1e8"); rect(c, cx + 2, sy + 19, 3, 1, "#f4f1e8");
        // contador de repetições
        rect(c, 4, 26, 30, 10, "rgba(0,0,0,.5)");
        num(c, reps, 6, 28, "#8fbf5a"); for (var q = 0; q < 5; q++) px(c, 16 - Math.floor(q / 2), 28 + q, "#c9b9a0"); num(c, 10, 19, 28, "#f4c16a");
      };
    },

    oficina: function () {
      var back = staticLayer(BW, BH, function (c) {
        grad(c, BW, BH, ["#11151a", "#161c22", "#1c242c"]);
        rect(c, 0, 38, BW, 6, "#3a2a1d"); rect(c, 0, 38, BW, 1, "#80592f");
        rect(c, 6, 3, 92, 33, "#2a2f36"); rect(c, 8, 5, 88, 29, "#081008");
        rect(c, 46, 36, 12, 2, "#2a2f36");
      });
      var LINES = ["$ ssh pi@oficina", "$ sudo apt update", "$ bluetoothctl scan on", "[NEW] GPS WATCH", "$ git push origin main", "> deploy ok", "$ ping -c 3 1.1.1.1", "64 bytes ttl=57"];
      function gear(c, cx, cy, R, teeth, rot, col, hi, lo) {
        for (var y = -R - 2; y <= R + 2; y++) for (var x = -R - 2; x <= R + 2; x++) {
          var d = Math.hypot(x, y), a = Math.atan2(y, x) - rot;
          var tooth = ((a / (Math.PI * 2) * teeth) % 1 + 1) % 1 < 0.5;
          var outer = tooth ? R + 2 : R;
          if (d > outer || d < R * 0.32) continue;
          var cc = col;
          if (d > R * 0.32 && d < R * 0.5) cc = lo;
          else if (x + y < -R * 0.4) cc = hi;
          else if (x + y > R * 0.6) cc = lo;
          px(c, cx + x, cy + y, cc);
        }
      }
      return function (c, t) {
        c.drawImage(back, 0, 0);
        var shown, acc, i;
        var cyc = Math.floor(t * 14) % (LINES.reduce(function (s, l) { return s + l.length + 6; }, 0) + 30);
        shown = []; acc = 0;
        for (i = 0; i < LINES.length; i++) {
          var L2 = LINES[i].length + 6;
          if (cyc < acc) break;
          shown.push([i, Math.min(LINES[i].length, cyc - acc)]); acc += L2;
        }
        var vis = shown.slice(-6);
        vis.forEach(function (s, row) {
          var text = LINES[s[0]].slice(0, s[1]);
          for (var k = 0; k < text.length; k++) {
            var ch = text[k]; if (ch === " ") continue;
            var col = text[0] === "$" ? (k === 0 ? "#f4c16a" : "#7dff8a") : "#b8e8ff";
            rect(c, 11 + k * 2, 8 + row * 4, 1, ch === "." || ch === "," ? 1 : 2, col);
          }
          if (row === vis.length - 1 && Math.floor(t * 2) % 2) rect(c, 11 + text.length * 2, 8 + row * 4, 2, 2, "#7dff8a");
        });
        gear(c, 124, 18, 11, 10, t * 0.8, "#8a929c", "#c9d1da", "#4a5058");
        gear(c, 145, 31, 6, 7, -t * 0.8 * 11 / 6 + 0.2, "#c08a3c", "#f4c16a", "#6b4a1f");
      };
    },

    natureza: function () {
      var R = seeded(11);
      var back = staticLayer(BW, BH, function (c) {
        grad(c, BW, BH, ["#8fc7ea", "#a9d5ee", "#cfe6e8", "#e8e6c8"]);
        for (var y = -6; y <= 6; y++) for (var x = -6; x <= 6; x++) { var d = Math.hypot(x, y); if (d <= 5) px(c, 128 + x, 9 + y, "#fff4c2"); else if (d < 7 && bt(x, y) < 0.5) px(c, 128 + x, 9 + y, "#ffe9a0"); }
        for (var x2 = 0; x2 < BW; x2++) {
          var h1 = Math.round(26 - 4 * Math.sin(x2 * 0.04 + 2) - 2 * Math.sin(x2 * 0.11));
          rect(c, x2, h1, 1, BH - h1, "#7da86a");
          var h2 = Math.round(33 - 3 * Math.sin(x2 * 0.06) - 1.5 * Math.sin(x2 * 0.17 + 1));
          rect(c, x2, h2, 1, BH - h2, "#4f8a3f"); px(c, x2, h2, "#6faa4f");
        }
        for (var x3 = 60; x3 < 160; x3 += 3 + Math.floor(R() * 4)) {
          var th = 4 + Math.floor(R() * 5), base = Math.round(26 - 4 * Math.sin(x3 * 0.04 + 2) - 2 * Math.sin(x3 * 0.11)) + 1;
          for (var k = 0; k < th; k++) { var hw = Math.floor(k * 0.35); rect(c, x3 - hw, base - th + k, hw * 2 + 1, 1, "#4a7a45"); }
        }
        rect(c, 26, 18, 4, 20, "#5a3d22"); rect(c, 26, 18, 1, 20, "#80592f");
        rect(c, 22, 30, 4, 1, "#5a3d22"); rect(c, 30, 26, 4, 1, "#5a3d22");
      });
      var leaves = [], grass = [];
      for (var x = 0; x < BW; x += 2) grass.push({ x: x, h: 2 + Math.floor(Math.random() * 3) });
      var BIRD = [["#...#", ".#.#.", "..#.."], [".....", "..#..", "##.##"]], bird = null;
      return function (c, t, dt) {
        c.drawImage(back, 0, 0);
        // copa a ondular
        var sway = Math.sin(t * 1.2) * 1.2;
        [[28, 12, 11, "#3f7a35"], [20, 16, 7, "#356a2d"], [36, 16, 8, "#356a2d"], [28, 8, 8, "#4f8f3f"], [33, 11, 5, "#6faa4f"]].forEach(function (b, bi) {
          for (var y = -b[2]; y <= b[2]; y++) for (var x = -b[2]; x <= b[2]; x++) {
            var d = Math.hypot(x, y * 1.15); if (d > b[2]) continue;
            var col = b[3]; if (d > b[2] - 1.2 && bt(x, y) < 0.5) col = "#2c5a26";
            px(c, b[0] + x + sway * (1 - (b[1] + y) / 30), b[1] + y, col);
          }
        });
        if (Math.random() < 0.05 * dt) leaves.push({ x: 18 + Math.random() * 22, y: 16, t: 0, c: ["#e0a030", "#c0582a", "#8fbf5a"][Math.floor(Math.random() * 3)] });
        leaves = leaves.filter(function (l) {
          l.t += dt; l.y += 0.12 * dt; l.x += 0.15 * dt + Math.sin(l.t * 0.08) * 0.3;
          px(c, l.x, l.y, l.c); if (Math.floor(l.t / 10) % 2) px(c, l.x + 1, l.y, l.c);
          return l.y < 40;
        });
        grass.forEach(function (g) {
          var lean = Math.round(Math.sin(t * 1.8 + g.x * 0.2));
          for (var k = 0; k < g.h; k++) px(c, g.x + (k === g.h - 1 ? lean : 0), BH - 1 - k, k === g.h - 1 ? "#8fbf5a" : "#4f8a3f");
        });
        if (!bird && Math.random() < 0.004 * dt) bird = { x: -6, y: 6 + Math.random() * 10, f: 0 };
        if (bird) {
          bird.x += 0.35 * dt; bird.f += dt;
          var s = BIRD[Math.floor(bird.f / 8) % 2];
          s.forEach(function (row, r) { for (var k = 0; k < 5; k++) if (row[k] === "#") px(c, bird.x + k, bird.y + r + Math.sin(bird.f * 0.05), "#1d1a24"); });
          px(c, bird.x + 2, bird.y + 1, "#ffffff");
          if (bird.x > BW + 6) bird = null;
        }
      };
    }
  };

  // ---------- arranque ----------
  var banner = document.getElementById("banner");
  var draw = BANNERS[cur] ? BANNERS[cur]() : null;
  var bc = banner ? banner.getContext("2d") : null;
  if (banner) { banner.width = BW; banner.height = BH; bc.imageSmoothingEnabled = false; }

  function drawMotes(t) {
    mctx.clearRect(0, 0, W, H);
    motes.forEach(function (m) {
      m.p += 0.02; m.y -= 0.05; m.x += Math.sin(m.p) * 0.06;
      if (m.y < 0) { m.y = H; m.x = Math.random() * W; }
      mctx.fillStyle = "rgba(255,236,170," + Math.max(0, 0.3 + 0.3 * Math.sin(m.p * 3)) + ")";
      mctx.fillRect(Math.round(m.x), Math.round(m.y), 1, 1);
    });
  }

  if (still) { if (draw) draw(bc, 2, 1); drawMotes(0); return; }
  var last = performance.now();
  function loop(now) {
    var dt = Math.min(3, (now - last) / 16.67); last = now;
    var t = now / 1000;
    if (draw) draw(bc, t, dt);
    drawMotes(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
