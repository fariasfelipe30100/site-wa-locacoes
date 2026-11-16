// WA Locações e Serviços — interações do site (v2)
(function () {
  "use strict";
  var WHATS = "5566996720465";
  var doc = document.documentElement;
  doc.classList.add("js");
  var semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // WhatsApp: cada botão leva a sua mensagem em data-wa
  $$("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Topo: fica branco depois do hero
  var topo = $("#topo");
  var menu = $("#menu");
  var ham = $("#hamburguer");
  var aoRolar = function () { topo.classList.toggle("rolou", window.scrollY > 60); };

  // Menu do celular
  var fechar = function () {
    menu.classList.remove("aberto"); doc.classList.remove("menu-aberto");
    ham.setAttribute("aria-expanded", "false");
  };
  ham.addEventListener("click", function () {
    var abrir = !menu.classList.contains("aberto");
    menu.classList.toggle("aberto", abrir); doc.classList.toggle("menu-aberto", abrir);
    ham.setAttribute("aria-expanded", String(abrir));
  });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", fechar); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });

  // Item ativo do menu
  var links = $$('a[href^="#"]', menu);
  var alvos = links.map(function (a) { return $(a.getAttribute("href")); });
  var marcar = function () {
    var y = window.scrollY + window.innerHeight * 0.35, atual = 0;
    alvos.forEach(function (el, i) { if (el && el.getBoundingClientRect().top + window.scrollY <= y) atual = i; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) atual = alvos.length - 1;
    links.forEach(function (a, i) { a.classList.toggle("ativo", i === atual); });
  };

  // Paralaxe leve (foto do Sobre e fundo da chamada final)
  var paralaxe = semMovimento ? [] : [
    { el: $(".sobre__img img"), forca: 0.12 },
    { el: $(".cta__fundo"), forca: 0.18 }
  ].filter(function (p) { return p.el; });
  var mover = function () {
    var h = window.innerHeight;
    paralaxe.forEach(function (p) {
      var r = p.el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return;
      var t = (r.top + r.height / 2 - h / 2) / h;
      p.el.style.transform = "translate3d(0," + (-t * p.forca * 100).toFixed(2) + "%,0)";
    });
  };

  var pedido = false;
  window.addEventListener("scroll", function () {
    if (pedido) return; pedido = true;
    requestAnimationFrame(function () { aoRolar(); marcar(); mover(); pedido = false; });
  }, { passive: true });
  aoRolar(); marcar(); mover();

  // Contadores
  var formatar = function (n, milhar) { return milhar ? n.toLocaleString("pt-BR") : String(n); };
  var contar = function (el) {
    var alvo = Number(el.dataset.alvo), milhar = el.hasAttribute("data-milhar");
    if (semMovimento) { el.textContent = formatar(alvo, milhar); return; }
    var ini = performance.now(), dur = 1800;
    var passo = function (t) {
      var p = Math.min(1, (t - ini) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = formatar(Math.round(alvo * e), milhar);
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };

  // Entradas ao rolar
  var itens = $$(".revelar, .passos__lista");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        $$(".conta", e.target).forEach(contar);
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    var grupo = null, ordem = 0;
    itens.forEach(function (el) {
      if (el.parentElement !== grupo) { grupo = el.parentElement; ordem = 0; }
      el.style.transitionDelay = Math.min(ordem++, 5) * 90 + "ms";
      io.observe(el);
    });
  } else {
    itens.forEach(function (el) { el.classList.add("visivel"); });
  }

  // Abas de valores
  var abas = $$('.abas [role="tab"]');
  var marca = $(".abas__marca");
  var posicionar = function () {
    var at = $('.abas [aria-selected="true"]');
    if (!at || !marca) return;
    marca.style.width = at.offsetWidth + "px";
    marca.style.transform = "translateX(" + at.offsetLeft + "px)";
  };
  var escolher = function (aba, foco) {
    abas.forEach(function (b) {
      var sel = b === aba;
      b.setAttribute("aria-selected", String(sel));
      b.tabIndex = sel ? 0 : -1;
      $("#" + b.getAttribute("aria-controls")).hidden = !sel;
    });
    if (foco) aba.focus();
    posicionar();
  };
  abas.forEach(function (b, i) {
    b.addEventListener("click", function () { escolher(b); });
    b.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { e.preventDefault(); escolher(abas[(i + d + abas.length) % abas.length], true); }
    });
  });

  // Diesel por conta de quem
  var opcoes = $$(".chave button");
  var fundo = $(".chave__fundo");
  var moverChave = function () {
    var at = $('.chave [aria-checked="true"]');
    if (!at || !fundo) return;
    fundo.style.width = at.offsetWidth + "px";
    fundo.style.transform = "translateX(" + (at.offsetLeft - 4) + "px)";
  };
  opcoes.forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("aria-checked") === "true") return;
      opcoes.forEach(function (o) { o.setAttribute("aria-checked", String(o === b)); });
      moverChave();
      $$(".valor").forEach(function (v) {
        v.classList.add("troca");
        setTimeout(function () { v.textContent = v.dataset[b.dataset.diesel]; v.classList.remove("troca"); }, 230);
      });
    });
  });
  var ajustar = function () { posicionar(); moverChave(); };
  window.addEventListener("resize", ajustar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
  ajustar();

  // Carrossel: setas e arrastar com o mouse
  var car = $("#carrossel");
  var setas = $$(".seta");
  var atualizarSetas = function () {
    var fim = car.scrollWidth - car.clientWidth - 4;
    setas[0].disabled = car.scrollLeft <= 4;
    setas[1].disabled = car.scrollLeft >= fim;
  };
  setas.forEach(function (b) {
    b.addEventListener("click", function () {
      var passo = $(".obra", car).getBoundingClientRect().width + 20;
      car.scrollBy({ left: passo * Number(b.dataset.dir), behavior: "smooth" });
    });
  });
  var arrasto = null;
  car.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    arrasto = { x: e.clientX, s: car.scrollLeft };
    car.classList.add("arrastando");
  });
  window.addEventListener("pointermove", function (e) { if (arrasto) car.scrollLeft = arrasto.s - (e.clientX - arrasto.x); });
  window.addEventListener("pointerup", function () { if (arrasto) { arrasto = null; car.classList.remove("arrastando"); } });
  car.addEventListener("scroll", atualizarSetas, { passive: true });
  window.addEventListener("resize", atualizarSetas);
  atualizarSetas();

  // Vídeo do topo: carrega depois da página, só se o visitante aceita movimento
  var video = $(".hero__video");
  var economia = navigator.connection && navigator.connection.saveData;
  if (video && !semMovimento && !economia) {
    var carregar = function () {
      var src = window.innerWidth <= 700 && video.dataset.srcMobile ? video.dataset.srcMobile : video.dataset.src;
      video.src = src;
      video.addEventListener("canplay", function () {
        var p = video.play();
        if (p && p.then) p.then(function () { video.classList.add("pronto"); }).catch(function () {});
        else video.classList.add("pronto");
      }, { once: true });
      video.load();
    };
    if (document.readyState === "complete") setTimeout(carregar, 300);
    else window.addEventListener("load", function () { setTimeout(carregar, 300); });
  }

  $("#ano").textContent = new Date().getFullYear();
})();
