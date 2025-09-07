// PWA registration + update prompt
(function() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      function showBanner(){
        if(document.getElementById('sw-update-banner')) return;
        var bar=document.createElement('div');
        bar.id='sw-update-banner';
        bar.setAttribute('role','status');
        bar.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#111827;color:#fff;display:flex;align-items:center;justify-content:center;z-index:9999;font-size:1rem;padding:.6em 0;box-shadow:0 -2px 8px rgba(0,0,0,.08)';
        bar.innerHTML='<span style="margin-right:1em;">Nouvelle version disponible</span><button style="background:#FF8C42;color:#fff;border:none;padding:.5em 1.1em;border-radius:6px;cursor:pointer;font-weight:600;">Mettre à jour</button>';
        bar.querySelector('button').onclick=function(){
          if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
        };
        document.body.appendChild(bar);
      }
      if (!reg) return;
      if (reg.waiting) showBanner();
      reg.addEventListener('updatefound', function() {
        var newWorker = reg.installing;
        newWorker && newWorker.addEventListener('statechange', function() {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) showBanner();
        });
      });
      var refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    });
  });
})();