(function () {
  var KEY = 'desktop-hint:' + location.hostname;
  var w = window.innerWidth, h = window.innerHeight;
  var small = Math.min(w, h) < 600 || (w < 900 && window.matchMedia('(pointer: coarse)').matches);
  if (!small || w >= 1280) return;
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  function mount() {
    var style = document.createElement('style');
    style.textContent = '.desktop-hint{position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);z-index:9999;display:flex;gap:.55rem;align-items:center;max-width:calc(100vw - 1.5rem);padding:.58rem .6rem .58rem .8rem;border:1px solid #ffffff24;border-radius:999px;background:#06070bc7;backdrop-filter:blur(16px);color:#ffffffe0;font:11px/1.3 system-ui}.desktop-hint button{border:0;border-radius:50%;width:22px;height:22px;background:#ffffff14;color:inherit}';
    document.head.appendChild(style);
    var el = document.createElement('aside'); el.className = 'desktop-hint'; el.setAttribute('role', 'note');
    el.innerHTML = '<span>Better viewing experience on a PC or a full-screen monitor</span><button aria-label="Dismiss">×</button>';
    el.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      el.remove();
    });
    document.body.appendChild(el);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
