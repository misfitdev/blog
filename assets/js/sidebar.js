(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generate a noise canvas and set it as the sidebar background texture.
  // The CSS animation shifts background-position to simulate animated film grain.
  function initGrain() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    var size = 250;
    var c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    var ctx = c.getContext('2d');
    var img = ctx.createImageData(size, size);
    var d = img.data;

    for (var i = 0; i < d.length; i += 4) {
      var v = Math.floor(Math.random() * 256);
      d[i]     = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = Math.floor(Math.random() * 28); // max ~11% opacity per pixel
    }

    ctx.putImageData(img, 0, 0);
    sidebar.style.backgroundImage = 'url(' + c.toDataURL() + ')';
    sidebar.style.backgroundSize = size + 'px ' + size + 'px';
  }

  // Type out the site name character by character on load.
  // sessionStorage prevents replaying on same-tab navigations;
  // hard reload clears sessionStorage and replays.
  function initTypewriter() {
    if (reduced) return;
    if (sessionStorage.getItem('tw')) return;

    var el = document.querySelector('.site-title h1 a');
    if (!el) return;

    var full = el.textContent.trim();
    el.textContent = '';
    el.dataset.typewriter = '';

    var i = 0;
    function tick() {
      if (i < full.length) {
        el.textContent = full.slice(0, ++i);
        setTimeout(tick, 52);
      } else {
        delete el.dataset.typewriter;
        sessionStorage.setItem('tw', '1');
      }
    }

    setTimeout(tick, 350);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGrain();
    initTypewriter();
  });
})();
