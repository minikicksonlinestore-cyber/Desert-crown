(function () {
  var menu = document.getElementById('menu'), nav = document.getElementById('nav');
  function setMenu(open) { nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.dataset.copy), text = el.textContent;
      function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); }
      function fallback() { var r = document.createRange(); r.selectNodeContents(el); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fallback); } else { fallback(); }
    });
  });
})();

(function () {
  var c = document.getElementById('dust'); if (!c || !c.getContext) return;
  var ctx = c.getContext('2d'), hero = c.parentNode, dots = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size() {
    W = hero.clientWidth; H = hero.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = W < 600 ? 34 : 70; dots = [];
    for (var i = 0; i < n; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 1, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, dist, lim = W < 600 ? 90 : 130;
    for (i = 0; i < dots.length; i++) {
      a = dots[i]; a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;
    }
    for (i = 0; i < dots.length; i++) {
      a = dots[i];
      for (j = i + 1; j < dots.length; j++) {
        b = dots[j]; dx = a.x - b.x; dy = a.y - b.y; dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < lim) { ctx.strokeStyle = 'rgba(252,228,194,' + ((1 - dist / lim) * .35).toFixed(2) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fillStyle = 'rgba(252,228,194,.8)'; ctx.fill();
    }
    if (!still) requestAnimationFrame(draw);
  }
  size(); draw(0);
  window.addEventListener('resize', function () { size(); if (still) draw(0); });
})();

(function () {
  var els = document.querySelectorAll('[data-r]');
  var top = document.querySelector('header.top');
  function sc() { top.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', sc, { passive: true }); sc();
  if (!('IntersectionObserver' in window) || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  document.documentElement.classList.add('rv');
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function (el, i) { el.style.setProperty('--d', (i % 4) * 80 + 'ms'); io.observe(el); });
})();
