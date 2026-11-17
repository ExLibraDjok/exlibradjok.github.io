/* After Hours Compendium — monta as páginas interiores a partir de dados.js e cenas.js.
   Páginas de categoria: musica.html, estante.html, ...  (body data-cat="musica")
   Páginas de item: item.html?c=musica&i=kyuss */
(function () {
  var A = window.AHC, ORDEM = ["musica", "estante", "skumm", "treino", "oficina", "natureza"];
  var NOMES_NAV = { musica: "Música", estante: "Estante", skumm: "Skumm", treino: "Treino", oficina: "Oficina", natureza: "Natureza" };
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("onpagereveal" in window)) document.documentElement.classList.add("sem-vt");

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function vazio(s) { return /^[“"]?\[/.test(String(s).trim()) ? " vazio" : ""; }
  function urlGrupo(c, g) { return "item.html?c=" + c + "&g=" + encodeURIComponent(g); }
  function urlItem(c, g, i) { return urlGrupo(c, g) + "&i=" + encodeURIComponent(i); }

  // ---------- que página é esta? ----------
  // categoria: musica.html | grupo: item.html?c=musica&g=stoner-psych | item: item.html?c=musica&g=stoner-psych&i=kyuss
  var q = new URLSearchParams(location.search);
  var catId = document.body.dataset.cat || q.get("c");
  var grupoId = document.body.dataset.cat ? null : q.get("g");
  var itemId = document.body.dataset.cat ? null : q.get("i");
  var cat = A[catId], grupo = null, item = null;
  function comPagina(g) { var l = []; g.seccoes.forEach(function (s) { s.itens.forEach(function (it) { if (it && it.pagina) l.push(it); }); }); return l; }
  if (cat && grupoId) grupo = cat.grupos.filter(function (g) { return g.id === grupoId; })[0] || null;
  if (cat && itemId && !grupo) cat.grupos.forEach(function (g) { if (comPagina(g).some(function (it) { return it.id === itemId; })) grupo = g; });
  var lista = grupo ? comPagina(grupo) : [];
  if (grupo && itemId) item = lista.filter(function (it) { return it.id === itemId; })[0] || null;

  // ---------- barra lateral ----------
  var nav = document.getElementById("nav");
  var ICONS = {
    note: ["...###..", "...#.##.", "...#..#.", "...#....", ".###....", "####....", "####....", ".##....."],
    book: [".######.", "#......#", "#.####.#", "#......#", "#.###..#", "#......#", ".######.", "..#..#.."],
    dagger: [".......#", "......##", ".....##.", "....##..", "#..##...", ".###....", ".##.....", "#..#...."],
    bar: ["........", "##....##", "##....##", "########", "##....##", "##....##", "........", "........"],
    gear: ["...##...", ".######.", ".##..##.", "###..###", "###..###", ".##..##.", ".######.", "...##..."],
    leaf: ["....####", "...#####", "..######", ".####.##", ".###.###", ".##.####", ".#.####.", "#......."]
  };
  nav.innerHTML = '<a class="brand" href="./">After Hours Compendium<small>um sítio meu, depois de horas</small></a><ul class="links">' +
    ORDEM.map(function (id) {
      var on = id === catId;
      return '<li><a class="plank' + (on ? " atual" : "") + '" href="' + id + '.html" data-icon="' + A[id].icone + '"' + (on && !grupo ? ' aria-current="page"' : "") + ">" + NOMES_NAV[id] + "</a></li>";
    }).join("") + '</ul><a class="voltar" href="./">◀ voltar ao monte</a>';
  nav.querySelectorAll(".plank").forEach(function (b) {
    var c = document.createElement("canvas"); c.width = 8; c.height = 8; c.setAttribute("aria-hidden", "true");
    var x = c.getContext("2d"), rows = ICONS[b.dataset.icon];
    for (var r = 0; r < 8; r++) for (var k = 0; k < 8; k++) if (rows[r][k] === "#") { x.fillStyle = r < 2 ? "#ffe39a" : "#f4c16a"; x.fillRect(k, r, 1, 1); }
    b.prepend(c);
  });

  // ---------- capas de discos em pixel art (24x24), sempre iguais para o mesmo nome ----------
  function capa(cv, nome) {
    var h = 2166136261; for (var k = 0; k < nome.length; k++) { h ^= nome.charCodeAt(k); h = Math.imul(h, 16777619); }
    var r = function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
    var PAL = [["#2a1230", "#9c2f5a", "#e2522b", "#ffb35c", "#ffe08a"], ["#0b1a2a", "#1d4a6a", "#3fa7a0", "#a8e0c0", "#f0f8e0"],
      ["#1a0a2a", "#5a1a7a", "#c03ab0", "#ff8ae0", "#fff0ff"], ["#2a1a0a", "#6b3a1a", "#c0782a", "#e8c070", "#fff4d0"],
      ["#0e0e12", "#3a3a44", "#8a8a96", "#d8d8e0", "#ffffff"], ["#0a1a0a", "#1a4a2a", "#4a8a3a", "#c0d860", "#f8ffd0"]];
    var pal = PAL[Math.floor(r() * PAL.length)], motivo = Math.floor(r() * 6), c = cv.getContext("2d");
    var B = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
    var cx = 8 + r() * 8, cy = 6 + r() * 8, f1 = 0.3 + r() * 0.5, f2 = r() * 6;
    for (var y = 0; y < 24; y++) for (var x = 0; x < 24; x++) {
      var v, d = Math.hypot(x - cx, y - cy);
      switch (motivo) {
        case 0: v = y < 15 ? y / 15 * 2.4 : 2 + ((y + Math.round(2 * Math.sin(x * f1 + f2))) % 4 < 2 ? 1 : 0); if (d < 4.5) v = 4; break;          // sol e dunas
        case 1: v = Math.floor(d / 2.2) % 4 + (d < 2 ? 1 : 0); break;                                                                           // anéis
        case 2: v = y / 24 * 2; if (d < 3.5) v = 4; if (y > 22 - Math.abs(x - 12) * 1.2 - 6) v = 0.4; if (y > 26 - Math.abs(x - 12) * 1.2 - 6 && y < 28 - Math.abs(x - 12) * 1.2 - 6) v = 3; break; // montanha e lua
        case 3: v = (Math.floor((y + 3 * Math.sin(x * f1 + f2)) / 3) % 5 + 5) % 5; break;                                                     // ondas
        case 4: v = 0.6 + y / 24; if (y > 6 && Math.abs(x - 12) < (y - 6) * 0.7 && y < 20) v = 3; if (Math.hypot(x - 12, (y - 14) * 1.6) < 2.6) v = Math.hypot(x - 12, (y - 14) * 1.6) < 1.2 ? 0 : 4; break; // pirâmide com olho
        default: v = ((Math.atan2(y - 12, x - 12) + Math.PI) / (Math.PI * 2) * 6 + Math.hypot(x - 12, y - 12) / 3) % 4; break;               // espiral
      }
      var b = Math.floor(v), fr = v - b;
      c.fillStyle = pal[Math.max(0, Math.min(4, b + ((B[y & 3][x & 3] + 0.5) / 16 < fr ? 1 : 0)))];
      c.fillRect(x, y, 1, 1);
    }
  }

  // ---------- conteúdo ----------
  var main = document.getElementById("conteudo");
  if (cat && cat.lang) main.lang = cat.lang;
  function VOZ_ABRIR() { return (window.__voz && window.__voz.abrir) || "abrir ▶"; }
  var EST = { curso: "EM CURSO", ativo: "ATIVO", feito: "APRENDIDO", inicio: "A COMEÇAR" };

  function busca(o) { return ' data-busca="' + esc([o.nome, o.sub, o.resumo, o.valor].filter(Boolean).join(" ").toLowerCase()) + '"'; }
  function secao(s, gid) {
    var it = s.itens, h = "<h2>" + esc(s.titulo) + "</h2>", corpo = "";
    function link(o) { return urlItem(catId, gid, o.id); }
    switch (s.tipo) {
      case "cartoes":
        corpo = '<div class="grelha">' + it.map(function (o) {
          var abre = o.pagina ? '<a href="' + link(o) + '"' : "<div", fecha = o.pagina ? "</a>" : "</div>";
          return abre + ' class="cartao"' + busca(o) + ">" + (catId === "musica" ? '<canvas class="capa" data-capa="' + esc(o.nome) + '" width="24" height="24" aria-hidden="true"></canvas>' : "") + (o.estado ? '<span class="estado ' + o.estado + '">' + EST[o.estado] + "</span>" : "") +
            "<b>" + esc(o.nome) + "</b>" + (o.sub ? "<em>" + esc(o.sub) + "</em>" : "") +
            '<span class="' + vazio(o.resumo || "") + '">' + esc(o.resumo || "") + "</span>" + (o.pagina ? '<i class="ver">' + VOZ_ABRIR() + '</i>' : "") + fecha;
        }).join("") + "</div>"; break;
      case "lista":
        corpo = '<ul class="lista">' + it.map(function (o) { return '<li class="' + vazio(o) + '" data-busca="' + esc(String(o).toLowerCase()) + '">' + esc(o) + "</li>"; }).join("") + "</ul>"; break;
      case "texto":
        corpo = it.map(function (o) { return "<p>" + esc(o) + "</p>"; }).join(""); break;
      case "ficha":
        corpo = '<dl class="ficha">' + it.map(function (o) { return "<dt>" + esc(o[0]) + '</dt><dd class="' + vazio(o[1]) + '">' + esc(o[1]) + "</dd>"; }).join("") + "</dl>"; break;
      case "estante":
        corpo = '<div class="estante">' + it.map(function (o) {
          return '<a class="livro' + (o.fav ? " fav" : "") + '" href="' + link(o) + '" style="background:' + o.cor + '"' + busca(o) + ">" + esc(o.nome) + "<br><span>" + esc(o.sub) + (o.fav ? " ★" : "") + "</span></a>";
        }).join("") + "</div>"; break;
      case "livros":
        corpo = '<ul class="lista ligacoes">' + it.map(function (o) { return "<li" + busca(o) + '><a href="' + link(o) + '">' + esc(o.nome) + " <small>" + esc(o.sub) + "</small></a></li>"; }).join("") + "</ul>"; break;
      case "missoes":
        corpo = it.map(function (o) {
          return '<a class="missao" href="' + link(o) + '"' + busca(o) + "><div>" + esc(o.nome) + " <span>" + esc(o.valor) + '</span></div><div class="barra"><i style="width:' + o.progresso + '%"></i></div></a>';
        }).join(""); break;
      case "entradas":
        corpo = it.map(function (o) {
          return '<a class="entrada" href="' + link(o) + '"' + busca(o) + "><h3>" + esc(o.nome) + "</h3>" + (o.sub ? '<p class="data' + vazio(o.sub) + '">' + esc(o.sub) + "</p>" : "") + '<p class="' + vazio(o.resumo) + '">' + esc(o.resumo) + '</p><i class="ver">' + VOZ_ABRIR() + '</i></a>';
        }).join(""); break;
    }
    return '<section class="bloco">' + h + corpo + "</section>";
  }
  function contar(g) { var n = 0; g.seccoes.forEach(function (s) { if (s.tipo !== "texto" && s.tipo !== "ficha") n += s.itens.length; }); return n; }

  var en = cat && cat.lang === "en", html;
  var VOZ = {
    musica:   { seccoes: "Caixotes de discos", itens: "discos", item: "disco", procurar: "procurar no caixote…", nada: "Nada neste caixote.", abrir: "pôr a tocar ▶", voltar: "◀" },
    estante:  { seccoes: "Prateleiras", itens: "livros", item: "livro", procurar: "procurar na prateleira…", nada: "Nenhum livro com esse nome.", abrir: "abrir ▶", voltar: "◀" },
    skumm:    { seccoes: "Chapters", itens: "entries", item: "entry", procurar: "search the log…", nada: "Nothing in the log.", abrir: "read ▶", voltar: "◀" },
    treino:   { seccoes: "Escolhe o modo", itens: "níveis", item: "nível", procurar: "procurar…", nada: "SEM RESULTADOS", abrir: "START ▶", voltar: "◀" },
    oficina:  { seccoes: "ls ~/oficina", itens: "ficheiros", item: "ficheiro", procurar: "grep…", nada: "grep: sem resultados", abrir: "./abrir", voltar: "cd .." },
    natureza: { seccoes: "Cadernos", itens: "registos", item: "registo", procurar: "procurar no caderno…", nada: "Nada anotado.", abrir: "ver ▶", voltar: "◀" }
  };
  var T = VOZ[catId] || VOZ.natureza; window.__voz = T;
  document.body.classList.add("tema-" + catId);
  if (!cat || (grupoId && !grupo) || (itemId && !item)) {
    html = "<h1>Caminho perdido</h1><p class='intro'>Esta página não existe (ainda).</p><p><a href='./'>◀ voltar ao monte</a></p>";
    document.title = "Caminho perdido · After Hours Compendium";
  } else if (!grupo) {
    // página da categoria: lista de grupos
    html = "<h1>" + esc(cat.nome) + '</h1><p class="intro" data-escrever>' + esc(cat.intro) + "</p>" +
      '<section class="bloco"><h2>' + T.seccoes + '</h2><div class="grupos">' + cat.grupos.map(function (g) {
        var n = contar(g);
        var minis = catId === "musica" ? '<span class="mini">' + comPagina(g).slice(0, 4).map(function (o) { return '<canvas data-capa="' + esc(o.nome) + '" width="24" height="24"></canvas>'; }).join("") + "</span>" : "";
        return '<a class="grupo" href="' + urlGrupo(catId, g.id) + '"><b>' + esc(g.nome) + '</b><span class="' + vazio(g.resumo) + '">' + esc(g.resumo) + "</span>" + minis +
          '<i class="conta">' + n + " " + (n === 1 ? T.item : T.itens) + " ▶</i></a>";
      }).join("") + "</div></section>" +
      (cat.seccoes || []).map(function (s) { return secao(s, ""); }).join("");
    document.title = cat.nome + " · After Hours Compendium";
  } else if (!item) {
    // página do grupo
    var n = contar(grupo);
    html = '<a class="migalha" href="' + catId + '.html">' + T.voltar + " " + esc(cat.nome) + "</a>" +
      "<h1>" + esc(grupo.nome) + '</h1><p class="intro' + vazio(grupo.resumo) + '" data-escrever>' + esc(grupo.resumo) + "</p>" +
      (n >= 5 ? '<label class="filtro"><span class="sr">' + T.procurar + '</span><input type="search" id="filtro" placeholder="' + T.procurar + '" autocomplete="off"></label><p class="nada" id="nada" hidden>' + T.nada + "</p>" : "") +
      grupo.seccoes.map(function (s) { return secao(s, grupo.id); }).join("");
    document.title = grupo.nome + " · " + cat.nome + " · After Hours Compendium";
  } else {
    var p = item.pagina, idx = lista.indexOf(item), ant = lista[idx - 1], seg = lista[idx + 1];
    var campos = p.campos ? '<dl class="ficha">' + p.campos.map(function (o) { return "<dt>" + esc(o[0]) + '</dt><dd class="' + vazio(o[1]) + '">' + esc(o[1]) + "</dd>"; }).join("") + "</dl>" : "";
    var captura = p.captura ? '<div class="captura">[' + (en ? "screenshot" : "imagem") + "]</div>" : "";
    var texto = (p.texto || []).map(function (t) { return '<p class="' + vazio(t) + '">' + esc(t) + "</p>"; }).join("");
    var listas = (p.listas || []).map(function (l) { return "<h2>" + esc(l.titulo) + '</h2><ul class="lista item-lista">' + l.itens.map(function (o) { return '<li class="' + vazio(o) + '">' + esc(o) + "</li>"; }).join("") + "</ul>"; }).join("");
    var titulo = "<h1>" + esc(item.nome) + "</h1>" + (item.sub ? '<p class="sub' + vazio(item.sub) + '">' + esc(item.sub) + "</p>" : "");
    var corpo;
    if (catId === "musica") corpo = '<div class="cabeca"><canvas class="capa-grande" data-capa="' + esc(item.nome) + '" width="24" height="24" aria-hidden="true"></canvas><div>' + titulo + "</div></div>" + campos + texto + listas;
    else if (catId === "estante") corpo = titulo + '<div class="aberto"><div>' + campos + texto + "</div><div>" + listas + "</div></div>";
    else corpo = titulo + campos + captura + texto + listas;
    html = '<p class="migalha"><a href="' + catId + '.html">' + T.voltar + " " + esc(cat.nome) + '</a> <span>/</span> <a href="' + urlGrupo(catId, grupo.id) + '">' + esc(grupo.nome) + "</a></p>" + corpo +
      '<nav class="passos" aria-label="Itens">' +
      (ant ? '<a href="' + urlItem(catId, grupo.id, ant.id) + '">◀ ' + esc(ant.nome) + "</a>" : "<span></span>") +
      (seg ? '<a href="' + urlItem(catId, grupo.id, seg.id) + '">' + esc(seg.nome) + " ▶</a>" : "<span></span>") + "</nav>";
    document.title = item.nome + " · " + grupo.nome + " · After Hours Compendium";
  }
  main.innerHTML = '<div class="painel-in">' + html + "</div>";

  // capas de discos geradas a partir do nome
  main.querySelectorAll("canvas[data-capa]").forEach(function (cv) { capa(cv, cv.dataset.capa); });

  // texto de introdução escrito letra a letra
  main.querySelectorAll("[data-escrever]").forEach(function (el) {
    if (still) return;
    var full = el.textContent, i = 0;
    el.style.minHeight = el.offsetHeight + "px"; el.textContent = ""; el.classList.add("a-escrever");
    var tm = setInterval(function () {
      i += 2; el.textContent = full.slice(0, i);
      if (i >= full.length) { clearInterval(tm); el.classList.remove("a-escrever"); }
    }, 16);
    main.addEventListener("click", function () { clearInterval(tm); el.textContent = full; el.classList.remove("a-escrever"); }, { once: true });
  });

  // pesquisa dentro do grupo
  var filtro = document.getElementById("filtro");
  if (filtro) filtro.addEventListener("input", function () {
    var t = filtro.value.trim().toLowerCase(), algum = false;
    main.querySelectorAll(".bloco").forEach(function (b) {
      var els = b.querySelectorAll("[data-busca]"), vis = 0;
      els.forEach(function (e) { var ok = !t || e.dataset.busca.indexOf(t) > -1; e.hidden = !ok; if (ok) vis++; });
      b.hidden = els.length > 0 && vis === 0; if (vis) algum = true;
    });
    document.getElementById("nada").hidden = algum || !t;
  });

  // ---------- cenário de fundo ----------
  var bg = document.getElementById("bg"), ctx = bg.getContext("2d");
  var cena = null, foto = null, W = CENAS.W, H = CENAS.H, foco = 0.4;
  function fit() {
    var vw = innerWidth, vh = innerHeight, s = Math.max(vw / bg.width, vh / bg.height), w = bg.width * s, h = bg.height * s;
    var alvo = vw > 760 ? 0.36 : 0.5;
    var left = Math.min(0, Math.max(vw - w, vw * alvo - foco * w)), top = Math.min(0, Math.max(vh - h, (vh - h) / 2));
    bg.style.width = w + "px"; bg.style.height = h + "px"; bg.style.left = left + "px"; bg.style.top = top + "px";
  }
  addEventListener("resize", fit);
  function usarCena() {
    cena = CENAS.criar(cat ? cat.cena : "floresta");
    bg.width = W; bg.height = H; foco = (cena.foco || 128) / W; fit();
    ctx.drawImage(cena.base, 0, 0); cena.draw(ctx, 1, 1);
  }
  usarCena();
  // imagem do Midjourney (opcional): img/fundo-<categoria>.png
  if (cat) {
    var im = new Image();
    im.onload = function () { foto = im; cena = null; bg.width = im.naturalWidth; bg.height = im.naturalHeight; foco = 0.4; fit(); ctx.drawImage(im, 0, 0); };
    im.src = "img/fundo-" + catId + ".png";
  }

  if (still) return;
  var last = performance.now();
  function loop(now) {
    var dt = Math.min(3, (now - last) / 16.67); last = now;
    if (cena) { ctx.drawImage(cena.base, 0, 0); cena.draw(ctx, now / 1000, dt); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
