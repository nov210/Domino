'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ===========================
     SCROLL REVEAL ANIMATION
     =========================== */
  var revealTargets = [
    '.st-head', '.ec-head', '.np-head',
    '.st-context', '.ec-context', '.np-context',
    '.st-output--01', '.st-output--02',
    '.ec-output--01', '.ec-output--02',
    '.np-main', '.np-roller',
    '.ec-message', '.ec-roadmap',
    '.st-callout'
  ];

  var allReveal = [];
  revealTargets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      allReveal.push(el);
    });
  });

  allReveal.forEach(function (el) {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    allReveal.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* IntersectionObserver 미지원 브라우저: 바로 표시 */
    allReveal.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ===========================
     STEP SLIDER — 드라이빙 픽업
     =========================== */
  var track   = document.getElementById('sliderTrack');
  var prevBtn = document.getElementById('sliderPrev');
  var nextBtn = document.getElementById('sliderNext');

  if (!track || !prevBtn || !nextBtn) return;

  var TOTAL      = 6;
  var SLIDE_W    = 420;
  var INTERVAL   = 3500;
  var current    = 0;
  var autoTimer  = null;
  var jumping    = false;

  /* 슬라이드 이동 */
  function goTo(index, noAnim) {
    if (noAnim) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.5s ease';
    }
    track.style.transform = 'translateX(-' + (index * SLIDE_W) + 'px)';
    current = index;
    updateArrows();
  }

  /* 화살표 표시 / 숨김 */
  function updateArrows() {
    if (current === 0) {
      prevBtn.setAttribute('hidden', '');
    } else {
      prevBtn.removeAttribute('hidden');
    }
    /* 오른쪽 화살표: 항상 표시 (자동 루프) */
    nextBtn.removeAttribute('hidden');
  }

  /* 다음 슬라이드 (루프) */
  function next() {
    if (current >= TOTAL - 1) {
      /* 마지막에서 첫 번째로: 애니메이션 없이 점프 */
      jumping = true;
      goTo(0, true);
      /* 다음 프레임에서 트랜지션 복구 */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          jumping = false;
        });
      });
    } else {
      goTo(current + 1);
    }
  }

  /* 이전 슬라이드 */
  function prev() {
    if (current > 0) {
      goTo(current - 1);
    }
  }

  /* 자동 롤링 */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* 이벤트 */
  nextBtn.addEventListener('click', function () {
    stopAuto();
    if (current >= TOTAL - 1) {
      goTo(0, true);
    } else {
      goTo(current + 1);
    }
    startAuto();
  });

  prevBtn.addEventListener('click', function () {
    stopAuto();
    prev();
    startAuto();
  });

  /* 초기화 */
  goTo(0, true);
  startAuto();

});
