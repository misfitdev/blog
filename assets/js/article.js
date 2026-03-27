(function () {
  if (!document.querySelector('.article-title')) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Reading progress bar ──────────────────────────────────────────────────────
  // CSS scroll-driven animation handles it when supported; JS fallback otherwise.
  function initProgress() {
    var article = document.querySelector('article');
    if (!article) return;

    var bar = document.createElement('div');
    bar.className = 'article-progress';
    article.prepend(bar);

    if (CSS.supports('animation-timeline', 'scroll()')) return;

    function update() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var pct   = total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;
      bar.style.transform = 'scaleX(' + pct + ')';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ── Title word clip-up entrance ───────────────────────────────────────────────
  function initTitle() {
    if (reduced) return;

    var title = document.querySelector('.article-title');
    if (!title) return;

    var words   = title.textContent.trim().split(/\s+/);
    var perWord = 75;

    title.innerHTML = words.map(function (w, i) {
      return (
        '<span class="tw" style="transition-delay:' + (i * perWord) + 'ms">' +
        '<span class="tw-i">' + w + '</span>' +
        '</span>'
      );
    }).join(' ');

    var dateEl = document.querySelector('.article-date');
    if (dateEl) {
      dateEl.style.opacity    = '0';
      dateEl.style.transition = 'opacity 0.5s ease ' + (words.length * perWord + 80) + 'ms';
    }

    // Double rAF ensures the initial hidden state is painted before we animate.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        title.querySelectorAll('.tw').forEach(function (el) {
          el.classList.add('tw-show');
        });
        if (dateEl) dateEl.style.opacity = '1';
      });
    });
  }

  // ── Scroll reveals ────────────────────────────────────────────────────────────
  function initReveals() {
    if (reduced) return;

    var els = document.querySelectorAll(
      '.article-content h2, .article-content h3, ' +
      '.article-content blockquote, .article-content pre'
    );
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('a-pending');
        entry.target.classList.add('a-revealed');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    els.forEach(function (el) {
      // Elements above the initial viewport are already read — reveal immediately.
      if (el.getBoundingClientRect().bottom < 0) {
        el.classList.add('a-revealed');
      } else {
        el.classList.add('a-pending');
        io.observe(el);
      }
    });
  }

  // ── TOC pill indicator ────────────────────────────────────────────────────────
  function initTocPill() {
    var toc = document.getElementById('toc');
    if (!toc) return;

    var headings = Array.from(
      document.querySelectorAll('.article-content h2, .article-content h3')
    );
    if (!headings.length) return;

    var pill = document.createElement('div');
    pill.className = 'toc-pill';
    toc.appendChild(pill);

    var links   = Array.from(toc.querySelectorAll('a'));
    var current = null;

    function activate(heading) {
      var link = heading.id
        ? toc.querySelector('a[href="#' + heading.id + '"]')
        : null;
      if (!link || link === current) return;

      links.forEach(function (l) { l.classList.remove('toc-live'); });
      link.classList.add('toc-live');
      current = link;

      var li = link.closest('li') || link.parentElement;
      pill.style.top    = li.offsetTop + 'px';
      pill.style.height = li.offsetHeight + 'px';
      pill.classList.add('toc-pill-on');
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) activate(e.target);
      });
    }, { rootMargin: '-5% 0px -75% 0px' });

    headings.forEach(function (h) { io.observe(h); });
  }

  // ── Cursor spotlight ──────────────────────────────────────────────────────────
  function initSpotlight() {
    if (reduced || 'ontouchstart' in window) return;

    var content = document.querySelector('.article-content');
    if (!content) return;

    content.addEventListener('mousemove', function (e) {
      var r = content.getBoundingClientRect();
      content.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      content.style.setProperty('--sy', (e.clientY - r.top)  + 'px');
      content.classList.add('s-on');
    }, { passive: true });

    content.addEventListener('mouseleave', function () {
      content.classList.remove('s-on');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProgress();
    initTitle();
    initReveals();
    initTocPill();
    initSpotlight();
  });
})();
