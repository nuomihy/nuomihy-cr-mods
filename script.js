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

  // 伊蕾娜背景图片数组 (使用 wallhaven 直链)
  const irenaImages = [
    'url(https://w.wallhaven.cc/full/57/wallhaven-57dov1.jpg)',
    'url(https://w.wallhaven.cc/full/kx/wallhaven-kx9mw6.png)',
    'url(https://w.wallhaven.cc/full/6o/wallhaven-6ovmex.jpg)',
    'url(https://w.wallhaven.cc/full/l8/wallhaven-l81zk2.jpg)',
    'url(https://w.wallhaven.cc/full/9d/wallhaven-9djr8w.png)',
  ];
  let currentBg = 0;

  // 定期切换揭示图
  setInterval(() => {
    currentBg = (currentBg + 1) % irenaImages.length;
    bgReveal.style.backgroundImage = irenaImages[currentBg];
  }, 8000);

  function updateSpotlight() {
    smx += (mx - smx) * 0.08;
    smy += (my - smy) * 0.08;
    if (bgReveal) {
      bgReveal.style.maskImage = `radial-gradient(circle 220px at ${smx}px ${smy}px, black 25%, transparent 65%)`;
      bgReveal.style.webkitMaskImage = `radial-gradient(circle 220px at ${smx}px ${smy}px, black 25%, transparent 65%)`;
    }
    if (cursorStar) {
      cursorStar.style.left = mx + 'px';
      cursorStar.style.top = my + 'px';
    }
    if (spotlight) {
      spotlight.style.background = `radial-gradient(circle 180px at ${smx}px ${smy}px, rgba(255,245,249,0) 0%, rgba(255,245,249,.35) 75%)`;
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
      const v = p < .5 ? 2*p*p : -1+(4-2*p)*p; // easeInOutQuad
      window.scrollTo(0, start + change * v);
      if (p < 1) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }

  // ── 背景图 fallback ─────────────────────
  // 尝试加载伊蕾娜壁纸，失败则用 picsum
  const testImg = new Image();
  testImg.onerror = () => {
    document.querySelector('.bg-base').style.backgroundImage = 'url(https://picsum.photos/seed/elaina1/1920/1080)';
    bgReveal.style.backgroundImage = 'url(https://picsum.photos/seed/elaina2/1920/1080)';
  };
  testImg.src = 'https://w.wallhaven.cc/full/57/wallhaven-57dov1.jpg';

  // 初始加载一张背景
  const baseImg = new Image();
  baseImg.onload = () => {
    document.querySelector('.bg-base').style.backgroundImage = `url(${baseImg.src})`;
  };
  baseImg.onerror = () => {
    document.querySelector('.bg-base').style.backgroundImage = 'url(https://picsum.photos/seed/elaina1/1920/1080)';
  };
  baseImg.src = 'https://w.wallhaven.cc/full/6o/wallhaven-6ovmex.jpg';

  console.log('%c🌸 红颜 · 网络公主 %c| nuomihy.dpdns.org',
    'color:#f8a5c2;font-size:18px;','color:#8b7a9e;');
  console.log('%c💜 伊蕾娜单推人', 'color:#c4a1ff;');
})();
