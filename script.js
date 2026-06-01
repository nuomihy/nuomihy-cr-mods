// ========================================
// 皇室战争魔改版 - 交互脚本
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- 导航栏滚动效果 ----
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ---- 移动端菜单 ----
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // 点击链接关闭菜单
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // ---- 数字递增动画 ----
  const animateNumbers = () => {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(el);
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
              } else {
                el.textContent = Math.floor(current);
              }
            }, 16);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(el);
    });
  };

  animateNumbers();

  // ---- 滚动进入动画 ----
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.mod-card, .about-card, .bilibili-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  };

  animateOnScroll();

  // ---- 下载按钮点击提示 ----
  document.querySelectorAll('.btn-mod').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.mod-card');
      const name = card.querySelector('h3').textContent;
      showToast(`⚠️ "${name}" 下载链接待更新，请关注B站获取最新下载地址`);
    });
  });

  // ---- Toast 通知 ----
  function showToast(message) {
    // 移除旧 toast
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 动态添加 toast 样式
  const toastStyle = document.createElement('style');
  toastStyle.textContent = `
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(30, 30, 50, 0.95);
      color: var(--text);
      padding: 14px 28px;
      border-radius: 50px;
      font-size: 0.9rem;
      z-index: 9999;
      border: 1px solid rgba(240, 192, 64, 0.3);
      backdrop-filter: blur(10px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 90vw;
      text-align: center;
    }
    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(toastStyle);

  // ---- 粒子背景效果 ----
  const createParticles = () => {
    const hero = document.querySelector('.hero-bg');
    if (!hero) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: rgba(240, 192, 64, ${Math.random() * 0.4 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
      hero.appendChild(particle);
    }
  };

  // 闪烁动画
  const twinkleStyle = document.createElement('style');
  twinkleStyle.textContent = `
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 1; transform: scale(2); }
    }
  `;
  document.head.appendChild(twinkleStyle);

  createParticles();

  console.log('🏰 皇室战争魔改版 | nuomihy.dpdns.org');
  console.log('📺 B站: 访问上方链接');
  console.log('⚡ 域名由 DigitalPlat FreeDomain 免费提供');
});
