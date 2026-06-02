/* ==========================================
   红颜 · Monopo 风格 - 交互引擎
   ========================================== */

(function() {
  'use strict';

  // ── THREE.JS WEBGL 背景 ──────────────────
  const canvas = document.getElementById('heroCanvas');
  if (canvas && window.THREE) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 5;

    const geo = new THREE.PlaneGeometry(8, 8, 64, 64);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#1a1a3e') },
        uColor2: { value: new THREE.Color('#0a0a1a') },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;
        uniform vec2 uMouse;
        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          float dist = distance(modelPosition.xy, vec2(uMouse.x * 4.0 - 2.0, uMouse.y * 4.0 - 2.0));
          float elevation = sin(modelPosition.x * 3.0 + uTime) * cos(modelPosition.y * 3.0 + uTime * 0.5) * 0.3;
          elevation += exp(-dist * 2.0) * 0.5;
          modelPosition.z += elevation;
          vElevation = elevation;
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelPosition;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        void main() {
          float mixStrength = (vElevation + 0.5) * 1.5;
          vec3 color = mix(uColor1, uColor2, mixStrength);
          float alpha = 0.08 + abs(vElevation) * 0.3;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      wireframe: true
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -0.5;
    scene.add(mesh);

    function resizeRenderer() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    let mouseX = 0.5, mouseY = 0.5;
    let targetMouseX = 0.5, targetMouseY = 0.5;
    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1 - e.clientY / window.innerHeight;
    });

    function animateWebGL(time) {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      mat.uniforms.uTime.value = time * 0.001;
      mat.uniforms.uMouse.value.set(mouseX, mouseY);
      renderer.render(scene, camera);
      requestAnimationFrame(animateWebGL);
    }
    requestAnimationFrame(animateWebGL);
  }

  // ── 自定义光标 ──────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let cx = 0, cy = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function updateCursor() {
    cx += (tx - cx) * 0.15;
    cy += (ty - cy) * 0.15;
    if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
    if (cursorDot) { cursorDot.style.left = tx + 'px'; cursorDot.style.top = ty + 'px'; }
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // ── 磁性元素 ────────────────────────────
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
    });
    el.addEventListener('mouseleave', (e) => {
      el.style.transform = 'translate(0,0) scale(1)';
    });
  });

  // ── 滚动进度条 ──────────────────────────
  const scrollBar = document.getElementById('scrollBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? window.scrollY / h : 0;
    if (scrollBar) scrollBar.style.width = (p * 100) + '%';
  });

  // ── 滚动揭示动画 ─────────────────────────
  const revealEls = document.querySelectorAll('.project, .bili-content, .about-grid');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── 视差效果 ────────────────────────────
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax'));
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const viewCenter = window.innerHeight / 2;
          const offset = (center - viewCenter) * speed * 0.05;
          const img = el.querySelector('.project-image-wrap');
          if (img) img.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ── 平滑滚动（锚点） ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(offset, 1200);
      }
    });
  });

  function smoothScrollTo(to, duration) {
    const start = window.scrollY;
    const change = to - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeInOutCubic
      const val = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, start + change * val);
      if (progress < 1) requestAnimationFrame(animateScroll);
    }
    requestAnimationFrame(animateScroll);
  }

  console.log('%c✦ 红颜 · Creative Portfolio %c| nuomihy.dpdns.org',
    'color:#f5c842;font-size:18px;','color:#888;');
  console.log('%cInspired by Monopo — Godly #334','color:#888;font-style:italic;');

})();
