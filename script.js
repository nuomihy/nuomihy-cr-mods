/* ==========================================
   红颜 · 可爱公主风 交互
   ========================================== */

(function() {
  'use strict';

  // ── 鼠标揭示背景图 ──────────────────────
  const bgReveal = document.getElementById('bgReveal');
  const spotlight = document.getElementById('spotlight');
  const cursorStar = document.getElementById('cursorStar');
  let mx = 0, my = 0, smx = 0, smy = 0;

  // ── 伊蕾娜背景图（你的本地图片）───────
  // 底层 bg1.jpg，鼠标揭示层 bg2.jpg
  document.querySelector('.bg-base').style.backgroundImage = 'url(bg1.jpg)';
  if (bgReveal) {
    bgReveal.style.backgroundImage = 'url(bg2.jpg)';
  }

  function updateSpotlight() {
    smx += (mx - smx) * 0.06;
    smy += (my - smy) * 0.06;
    if (bgReveal) {
      bgReveal.style.maskImage = `radial-gradient(circle 240px at ${smx}px ${smy}px, black 20%, transparent 60%)`;
      bgReveal.style.webkitMaskImage = `radial-gradient(circle 240px at ${smx}px ${smy}px, black 20%, transparent 60%)`;
    }
    if (cursorStar) {
      cursorStar.style.left = mx + 'px';
      cursorStar.style.top = my + 'px';
    }
    if (spotlight) {
      spotlight.style.background = `radial-gradient(circle 200px at ${smx}px ${smy}px, rgba(255,245,249,0) 0%, rgba(255,245,249,.3) 70%)`;
    }
    requestAnimationFrame(updateSpotlight);
  }
  requestAnimationFrame(updateSpotlight);

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // ── 光标悬停放大 ────────────────────────
  document.querySelectorAll('a, button, .work-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorStar && cursorStar.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorStar && cursorStar.classList.remove('hover'));
  });

  // ── 滚动渐显 ────────────────────────────
  const animEls = document.querySelectorAll('.work-card, .bili-box, .about-card');
  animEls.forEach(el => el.classList.add('anim-el'));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animEls.forEach(el => obs.observe(el));

  // ── 平滑锚点 ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const t = document.querySelector(this.getAttribute('href'));
      if (t) {
        const to = t.getBoundingClientRect().top + window.scrollY;
        smoothScroll(to, 1000);
      }
    });
  });

  function smoothScroll(to, dur) {
    const start = window.scrollY;
    const change = to - start;
    const startTime = performance.now();
    function anim(now) {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / dur, 1);
      const v = p < .5 ? 2*p*p : -1+(4-2*p)*p;
      window.scrollTo(0, start + change * v);
      if (p < 1) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }

  console.log('%c🌸 红颜 · 网络公主 %c| nuomihy.dpdns.org',
    'color:#f8a5c2;font-size:18px;','color:#8b7a9e;');
  console.log('%c💜 伊蕾娜单推人', 'color:#c4a1ff;');
})();
