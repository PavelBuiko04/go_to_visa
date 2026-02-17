/**
 * Каталог: блокнот — перелистывание страниц с анимацией
 */
(function () {
  'use strict';

  var notebook = document.querySelector('.notebook-wrap');
  if (!notebook) return;

  var tabs = notebook.querySelectorAll('.notebook-tab');
  var track = notebook.querySelector('.notebook-pages-track');
  var spreads = notebook.querySelectorAll('.notebook-spread');
  var prevBtn = notebook.querySelector('.notebook-prev');
  var nextBtn = notebook.querySelector('.notebook-next');
  var indicator = notebook.querySelector('.notebook-page-indicator');
  var total = spreads.length;
  var current = 0;

  function goToPage(index) {
    current = Math.max(0, Math.min(index, total - 1));

    if (track && total > 0) {
      var offsetPct = (current / total) * 100;
      track.style.transform = 'translateX(-' + offsetPct + '%)';
    }

    spreads.forEach(function (s) { s.classList.remove('current'); });
    var spread = spreads[current];
    if (spread) spread.classList.add('current');

    tabs.forEach(function (t) { t.classList.remove('active'); });
    var tab = tabs[current];
    if (tab) tab.classList.add('active');

    if (prevBtn) prevBtn.disabled = current <= 0;
    if (nextBtn) nextBtn.disabled = current >= total - 1;
    if (indicator) indicator.textContent = (current + 1) + ' / ' + total;
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      goToPage(i);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (current > 0) goToPage(current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (current < total - 1) goToPage(current + 1);
    });
  }

  window.addEventListener('resize', function () {
    if (track && total > 0) {
      var offsetPct = (current / total) * 100;
      track.style.transform = 'translateX(-' + offsetPct + '%)';
    }
  });

  goToPage(0);
})();
