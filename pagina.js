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
  function urlItem(c, i) { return "item.html?c=" + c + "&i=" + encodeURIComponent(i); }

  // ---------- que página é esta? ----------
  var q = new URLSearchParams(location.search);
  var catId = document.body.dataset.cat || q.get("c");
  var itemId = document.body.dataset.cat ? null : q.get("i");
  var cat = A[catId];
  var item = null, lista = [];
  if (cat) cat.seccoes.forEach(function (s) { s.itens.forEach(function (it) { if (it && it.pagina) lista.push(it); }); });
  if (cat && itemId) item = lista.filter(function (it) { return it.id === itemId; })[0] || null;

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
      return '<li><a class="plank' + (on ? " atual" : "") + '" href="' + id + '.html" data-icon="' + A[id].icone + '"' + (on && !item ? ' aria-current="page"' : "") + ">" + NOMES_NAV[id] + "</a></li>";
    }).join("") + '</ul><a class="voltar" href="./">◀ voltar ao monte</a>';
  nav.querySelectorAll(".plank").forEach(function (b) {
    var c = document.createElement("canvas"); c.width = 8; c.height = 8; c.setAttribute("aria-hidden", "true");
    var x = c.getContext("2d"), rows = ICONS[b.dataset.icon];
    for (var r = 0; r < 8; r++) for (var k = 0; k < 8; k++) if (rows[r][k] === "#") { x.fillStyle = r < 2 ? "#ffe39a" : "#f4c16a"; x.fillRect(k, r, 1, 1); }
    b.prepend(c);
  });

  // ---------- conteúdo ----------
  var main = document.getElementById("conteudo");
  if (cat && cat.lang) main.lang = cat.lang;

  function secao(s) {
    var h = "<h2>" + esc(s.titulo) + "</h2>";
    var it = s.itens;
    switch (s.tipo) {
      case "cartoes":
        return h + '<div class="grelha">' + it.map(function (o) {
          var tag = o.pagina ? 'a href="' + urlItem(catId, o.id) + '"' : "div";
          var est = o.estado ? '<span class="estado ' + o.estado + '">' + { curso: "EM CURSO", ativo: "ATIVO", feito: "APRENDIDO", inicio: "A COMEÇAR" }[o.estado] + "</span>" : "";
          return "<" + tag + ' class="cartao">' + est + "<b>" + esc(o.nome) + "</b>" + (o.sub ? "<em>" + esc(o.sub) + "</em>" : "") +
            '<span class="' + vazio(o.resumo || "") + '">' + esc(o.resumo || "") + "</span>" + (o.pagina ? '<i class="ver">abrir ▶</i>' : "") + "</" + tag.split(" ")[0] + ">";
        }).join("") + "</div>";
      case "lista":
        return h + '<ul class="lista">' + it.map(function (o) { return '<li class="' + vazio(o) + '">' + esc(o) + "</li>"; }).join("") + "</ul>";
      case "texto":
        return h + it.map(function (o) { return "<p>" + esc(o) + "</p>"; }).join("");
      case "ficha":
        return h + '<dl class="ficha">' + it.map(function (o) { return "<dt>" + esc(o[0]) + '</dt><dd class="' + vazio(o[1]) + '">' + esc(o[1]) + "</dd>"; }).join("") + "</dl>";
      case "estante":
        return h + '<div class="estante">' + it.map(function (o) {
          return '<a class="livro' + (o.fav ? " fav" : "") + '" href="' + urlItem(catId, o.id) + '" style="background:' + o.cor + '">' + esc(o.nome) + "<br><span>" + esc(o.sub) + (o.fav ? " ★" : "") + "</span></a>";
        }).join("") + "</div>";
      case "livros":
        return h + '<ul class="lista ligacoes">' + it.map(function (o) { return '<li><a href="' + urlItem(catId, o.id) + '">' + esc(o.nome) + " <small>" + esc(o.sub) + "</small></a></li>"; }).join("") + "</ul>";
      case "missoes":
        return h + it.map(function (o) {
          return '<a class="missao" href="' + urlItem(catId, o.id) + '"><div>' + esc(o.nome) + " <span>" + esc(o.valor) + '</span></div><div class="barra"><i style="width:' + o.progresso + '%"></i></div></a>';
        }).join("");
      case "entradas":
        return h + it.map(function (o) {
          return '<a class="entrada" href="' + urlItem(catId, o.id) + '"><h3>' + esc(o.nome) + "</h3>" + (o.sub ? '<p class="data' + vazio(o.sub) + '">' + esc(o.sub) + "</p>" : "") + '<p class="' + vazio(o.resumo) + '">' + esc(o.resumo) + '</p><i class="ver">abrir ▶</i></a>';
        }).join("");
    }
    return "";
  }

  var html;
  if (!cat || (itemId && !item)) {
    html = "<h1>Caminho perdido</h1><p class='intro'>Esta página não existe (ainda).</p><p><a href='./'>◀ voltar ao monte</a></p>";
    document.title = "Caminho perdido · After Hours Compendium";
  } else if (!item) {
    html = "<h1>" + esc(cat.nome) + '</h1><p class="intro">' + esc(cat.intro) + "</p>" + cat.seccoes.map(secao).join("");
    document.title = cat.nome + " · After Hours Compendium";
  } else {
    var p = item.pagina, idx = lista.indexOf(item), ant = lista[idx - 1], seg = lista[idx + 1];
    html = '<a class="migalha" href="' + catId + '.html">◀ ' + esc(cat.nome) + "</a>" +
      "<h1>" + esc(item.nome) + "</h1>" + (item.sub ? '<p class="sub' + vazio(item.sub) + '">' + esc(item.sub) + "</p>" : "") +
      (p.campos ? '<dl class="ficha">' + p.campos.map(function (o) { return "<dt>" + esc(o[0]) + '</dt><dd class="' + vazio(o[1]) + '">' + esc(o[1]) + "</dd>"; }).join("") + "</dl>" : "") +
      (p.captura ? '<div class="captura">[' + (cat.lang === "en" ? "screenshot" : "imagem") + "]</div>" : "") +
      (p.texto || []).map(function (t) { return '<p class="' + vazio(t) + '">' + esc(t) + "</p>"; }).join("") +
      (p.listas || []).map(function (l) { return "<h2>" + esc(l.titulo) + '</h2><ul class="lista">' + l.itens.map(function (o) { return '<li class="' + vazio(o) + '">' + esc(o) + "</li>"; }).join("") + "</ul>"; }).join("") +
      '<nav class="passos" aria-label="Itens">' +
      (ant ? '<a href="' + urlItem(catId, ant.id) + '">◀ ' + esc(ant.nome) + "</a>" : "<span></span>") +
      (seg ? '<a href="' + urlItem(catId, seg.id) + '">' + esc(seg.nome) + " ▶</a>" : "<span></span>") + "</nav>";
    document.title = item.nome + " · " + cat.nome + " · After Hours Compendium";
  }
  main.innerHTML = '<div class="painel-in">' + html + "</div>";

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
