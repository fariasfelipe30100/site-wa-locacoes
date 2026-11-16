// WA Locações e Serviços — interações do site
(function () {
  "use strict";
  var WHATS = "5566996720465";
  document.documentElement.classList.add("js");

  // Links do WhatsApp: cada botão leva a sua mensagem em data-wa
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Topo com sombra ao rolar
  var topo = document.getElementById("topo");
  var aoRolar = function () { topo.classList.toggle("rolou", window.scrollY > 10); };
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  // Menu do celular
  var menu = document.getElementById("menu");
  var ham = document.getElementById("hamburguer");
  var fechar = function () { menu.classList.remove("aberto"); ham.setAttribute("aria-expanded", "false"); };
  ham.addEventListener("click", function () {
    var abrir = !menu.classList.contains("aberto");
    menu.classList.toggle("aberto", abrir);
    ham.setAttribute("aria-expanded", String(abrir));
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", fechar); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fechar(); });

  // Item ativo do menu conforme a seção na tela
  var links = Array.prototype.slice.call(menu.querySelectorAll('a[href^="#"]'));
  var alvos = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  var marcar = function () {
    var y = window.scrollY + window.innerHeight * 0.35, atual = 0;
    alvos.forEach(function (el, i) { if (el && el.getBoundingClientRect().top + window.scrollY <= y) atual = i; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) atual = alvos.length - 1;
    links.forEach(function (a, i) { a.classList.toggle("ativo", i === atual); });
  };
  window.addEventListener("scroll", marcar, { passive: true });
  marcar();

  // Entrada suave dos blocos
  var itens = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    itens.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add("visivel"); });
  }

  // Carrossel de obras
  var car = document.getElementById("carrossel");
  var setas = document.querySelectorAll(".seta");
  var atualizarSetas = function () {
    var fim = car.scrollWidth - car.clientWidth - 4;
    setas[0].disabled = car.scrollLeft <= 4;
    setas[1].disabled = car.scrollLeft >= fim;
  };
  setas.forEach(function (b) {
    b.addEventListener("click", function () {
      var passo = car.querySelector(".obra").getBoundingClientRect().width + 18;
      car.scrollBy({ left: passo * Number(b.dataset.dir), behavior: "smooth" });
    });
  });
  car.addEventListener("scroll", atualizarSetas, { passive: true });
  window.addEventListener("resize", atualizarSetas);
  atualizarSetas();

  document.getElementById("ano").textContent = new Date().getFullYear();
})();
