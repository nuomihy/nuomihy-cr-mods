/* ==========================================
   红颜 · 皇室战争魔改版 - 交互脚本
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- 粒子系统 ----
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.7
        ? `rgba(245,200,66,${this.alpha})`
        : `rgba(168,85,247,${this.alpha})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245,200,66,${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  // ---- 导航栏 ----
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
  });

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  // ---- 数字递增 ----
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          obs.unobserve(el);
          let curr = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            curr += step;
            if (curr >= target) { el.textContent = target; clearInterval(timer); }
            else el.textContent = Math.floor(curr);
          }, 30);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  // ---- 滚动入场动画 ----
  const animEls = document.querySelectorAll('.mod-card, .bili-card, .about-inner');
  const animObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        animObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => { el.classList.add('anim-in'); animObs.observe(el); });

  // ---- 下载按钮 ----
  document.querySelectorAll('.btn-mod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.closest('.mod-card-inner').querySelector('h3').textContent;
      showToast(`⚠️ "${name}" 下载链接待更新，请关注B站获取最新下载地址`);
    });
  });

  // ---- Toast ----
  function showToast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3500);
  }

  // ---- 鼠标光晕跟随（hero区） ----
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      hero.style.setProperty('--mx', x + 'px');
      hero.style.setProperty('--my', y + 'px');
    });
  }

  console.log('%c🏰 红颜 · 皇室战争魔改版 %c| nuomihy.dpdns.org',
    'color:#f5c842;font-size:16px;', 'color:#888;');
  console.log('%c📺 B站: space.bilibili.com/2126202578', 'color:#fb7299;');
});
