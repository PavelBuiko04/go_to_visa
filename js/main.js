/**
 * Main script: sticky header, mobile menu, form submit, scroll animations.
 * Forms can be wired to CRM, Telegram/WhatsApp, email autoresponder.
 */

(function () {
  'use strict';

  // ——— Sticky header (прозрачный над Hero, затем фон) ———
  var header = document.getElementById('header');
  if (header) {
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ——— Mobile menu ———
  var burger = document.getElementById('burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    document.querySelectorAll('.nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // ——— Form submit (CRM / Telegram / WhatsApp / Email placeholder) ———
  function serializeForm(form) {
    var data = {};
    var fields = form.querySelectorAll('input, textarea, select');
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      if (el.name && el.value) data[el.name] = el.value;
    }
    return data;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var data = serializeForm(form);

    // Placeholder: send to your backend/CRM/Telegram/WhatsApp/email
    console.log('Form data:', data);

    // Example: open Telegram (replace with your bot link)
    // var telegramUrl = 'https://t.me/YourBot?text=' + encodeURIComponent('Заявка: ' + JSON.stringify(data));
    // window.open(telegramUrl, '_blank');

    // Example: open WhatsApp (replace with your number)
    // var waUrl = 'https://wa.me/79001234567?text=' + encodeURIComponent('Заявка: ' + data.name + ', ' + data.phone);
    // window.open(waUrl, '_blank');

    // Autoresponder: would be sent from your server after saving to CRM
    showMessage(form, 'Спасибо! Мы свяжемся с вами в течение часа.');
    form.reset();
  }

  function showMessage(form, text) {
    var existing = form.querySelector('.form-message');
    if (existing) existing.remove();
    var msg = document.createElement('p');
    msg.className = 'form-message';
    msg.textContent = text;
    msg.style.cssText = 'margin-top:12px;color:#6D28D9;font-weight:500;';
    form.appendChild(msg);
    setTimeout(function () { msg.remove(); }, 5000);
  }

  document.querySelectorAll('form[data-form="lead"]').forEach(function (form) {
    form.addEventListener('submit', handleSubmit);
  });

  // ——— Scroll animations (sections become visible) ———
  var sections = document.querySelectorAll('.section');
  var observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

  function observeSections() {
    if (!('IntersectionObserver' in window)) {
      sections.forEach(function (s) { s.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, observerOptions);
    sections.forEach(function (s) { observer.observe(s); });
  }

  observeSections();

  // ——— Quiz (слайды, «другой вариант», условный блок) ———
  (function initQuiz() {
    var quiz = document.getElementById('quiz');
    if (!quiz) return;
    var slides = quiz.querySelectorAll('.quiz-slide');
    var prevBtn = quiz.querySelector('.quiz-btn-prev');
    var nextBtn = quiz.querySelector('.quiz-btn-next');
    var progressBar = quiz.querySelector('.quiz-progress-bar');
    var progressText = quiz.querySelector('.quiz-progress-text');
    var totalSlides = slides.length;
    var current = 1;

    function goTo(slideNum) {
      current = Math.max(1, Math.min(slideNum, totalSlides));
      slides.forEach(function(s) { s.classList.remove('active'); });
      var activeSlide = quiz.querySelector('.quiz-slide[data-slide="' + current + '"]');
      if (activeSlide) activeSlide.classList.add('active');
      var pct = (current / totalSlides) * 100;
      if (progressBar) progressBar.style.width = pct + '%';
      if (progressText) progressText.textContent = current + ' из ' + totalSlides;
      if (prevBtn) {
        prevBtn.style.display = current <= 1 ? 'none' : '';
        prevBtn.style.visibility = current <= 1 ? 'hidden' : '';
        prevBtn.disabled = current <= 1;
      }
      var nav = quiz.querySelector('.quiz-nav');
      if (nav) nav.classList.toggle('quiz-nav-first', current <= 1);
      if (nextBtn) {
        nextBtn.style.display = current === totalSlides ? 'none' : '';
        nextBtn.style.visibility = current === totalSlides ? 'hidden' : '';
        nextBtn.disabled = current < totalSlides && !isSlideValid(current);
      }
      if (current === totalSlides && typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, ticks: 120, scalar: 0.8 });
      }
    }

    function isSlideValid(slideNum) {
      if (slideNum === 1) {
        var checked = quiz.querySelectorAll('input[name="countries"]:checked');
        if (!checked.length) return false;
        var other = quiz.querySelector('input[name="countries"][value="other"]');
        if (other && other.checked) {
          var val = (quiz.querySelector('[name="countries_other"]')?.value || '').trim();
          return val.length > 0;
        }
        return true;
      }
      if (slideNum === 2) {
        var r = quiz.querySelector('input[name="people"]:checked');
        if (!r) return false;
        if (r.value === 'other') {
          var val = (quiz.querySelector('[name="people_other"]')?.value || '').trim();
          return val.length > 0;
        }
        return true;
      }
      if (slideNum === 3) {
        var r = quiz.querySelector('input[name="visa_3y"]:checked');
        if (!r) return false;
        if (r.value === 'yes') {
          var cb = quiz.querySelectorAll('input[name="visa_country"]:checked');
          if (!cb.length) return false;
          var o = quiz.querySelector('input[name="visa_country"][value="other"]');
          if (o && o.checked) {
            var val = (quiz.querySelector('[name="visa_country_other"]')?.value || '').trim();
            return val.length > 0;
          }
          return true;
        }
        return true;
      }
      if (slideNum === 4) return true;
      if (slideNum === 5) {
        var r = quiz.querySelector('input[name="when"]:checked');
        if (!r) return false;
        if (r.value === 'other') {
          var val = (quiz.querySelector('[name="when_other"]')?.value || '').trim();
          return val.length > 0;
        }
        return true;
      }
      return true;
    }

    function updateNextButton() {
      if (nextBtn && current < totalSlides) {
        nextBtn.disabled = !isSlideValid(current);
      }
    }

    function getNextSlide() {
      if (current === 3) {
        var visaNo = quiz.querySelector('input[name="visa_3y"][value="no"]');
        if (visaNo && visaNo.checked) return 5; // пропуск слайда 4
      }
      return current + 1;
    }
    function getPrevSlide() {
      if (current === 5) {
        var visaNo = quiz.querySelector('input[name="visa_3y"][value="no"]');
        if (visaNo && visaNo.checked) return 3; // возврат на слайд 3
      }
      return current - 1;
    }
    if (prevBtn) prevBtn.addEventListener('click', function() {
      var prev = getPrevSlide();
      if (prev >= 1) goTo(prev);
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
      if (nextBtn.disabled) return;
      var next = getNextSlide();
      if (next <= totalSlides) goTo(next);
    });

    quiz.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(function(inp) {
      inp.addEventListener('change', updateNextButton);
    });
    quiz.querySelectorAll('.quiz-other-input').forEach(function(inp) {
      inp.addEventListener('input', updateNextButton);
      inp.addEventListener('change', updateNextButton);
    });

    // «Другой вариант» — показывать/скрывать поле ввода
    function toggleOtherWrap(otherInput, wrap) {
      wrap.style.display = otherInput.checked ? 'block' : 'none';
    }
    quiz.querySelectorAll('.quiz-option-other').forEach(function(label) {
      var wrap = label.nextElementSibling;
      var otherInput = label.querySelector('input');
      if (!otherInput || !wrap || !wrap.classList.contains('quiz-other-input-wrap')) return;
      otherInput.addEventListener('change', function() { toggleOtherWrap(otherInput, wrap); });
      if (otherInput.type === 'radio') {
        quiz.querySelectorAll('input[name="' + otherInput.name + '"]').forEach(function(radio) {
          radio.addEventListener('change', function() { toggleOtherWrap(otherInput, wrap); });
        });
      }
    });

    // Слайд 3: показывать «какая страна» при выборе «Да, виза была»
    var visaYes = quiz.querySelector('input[name="visa_3y"][value="yes"]');
    var visaCountryBlock = document.getElementById('quiz-visa-country');
    if (visaYes && visaCountryBlock) {
      quiz.querySelectorAll('input[name="visa_3y"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
          visaCountryBlock.style.display = radio.value === 'yes' ? 'block' : 'none';
        });
      });
    }

    // Отправка формы квиза — кнопка активна только при заполненных имени и телефоне
    var quizForm = document.getElementById('quiz-form');
    var quizSubmitBtn = document.getElementById('quiz-submit-btn');
    if (quizForm && quizSubmitBtn) {
      function checkQuizFormValid() {
        var name = (quizForm.querySelector('[name="name"]')?.value || '').trim();
        var phone = (quizForm.querySelector('[name="phone"]')?.value || '').trim().replace(/\D/g, '');
        quizSubmitBtn.disabled = !(name.length >= 2 && phone.length >= 9);
      }
      quizForm.querySelectorAll('input[name="name"], input[name="phone"]').forEach(function(inp) {
        inp.addEventListener('input', checkQuizFormValid);
        inp.addEventListener('change', checkQuizFormValid);
      });
      checkQuizFormValid();
      quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var data = serializeForm(quizForm);
        var quizData = {};
        quiz.querySelectorAll('input[name="countries"]:checked').forEach(function(cb) {
          quizData.countries = (quizData.countries || []).concat(cb.value === 'other' ? (quiz.querySelector('[name="countries_other"]')?.value || 'Другое') : cb.value);
        });
        quiz.querySelectorAll('input[name="people"]:checked').forEach(function(r) {
          quizData.people = r.value === 'other' ? (quiz.querySelector('[name="people_other"]')?.value || '') : r.value;
        });
        quiz.querySelectorAll('input[name="visa_3y"]:checked').forEach(function(r) { quizData.visa_3y = r.value; });
        quiz.querySelectorAll('input[name="visa_country"]:checked').forEach(function(cb) {
          quizData.visa_country = (quizData.visa_country || []).concat(cb.value === 'other' ? (quiz.querySelector('[name="visa_country_other"]')?.value || '') : cb.value);
        });
        quiz.querySelectorAll('input[name="visited"]:checked').forEach(function(cb) {
          quizData.visited = (quizData.visited || []).concat(cb.value === 'other' ? (quiz.querySelector('[name="visited_other"]')?.value || '') : cb.value);
        });
        quiz.querySelectorAll('input[name="when"]:checked').forEach(function(r) {
          quizData.when = r.value === 'other' ? (quiz.querySelector('[name="when_other"]')?.value || '') : r.value;
        });
        Object.assign(data, quizData);
        console.log('Quiz form data:', data);
        var whenLabels = {
          'urgent': 'СРОЧНО (менее, чем через 2 недели)',
          '2-4': 'В ближайшее время (через 2–4 недели)',
          '1-3m': 'Планирую заранее (через 1–3 месяца)',
          'undecided': 'Пока только изучаю варианты (дата не определена)'
        };
        var whenText = whenLabels[data.when] || data.when || '';
        var phoneVal = (data.phone || '').trim().replace(/\s+/g, ' ');
        if (phoneVal && !/^\+/.test(phoneVal) && /^\d/.test(phoneVal)) phoneVal = '+' + phoneVal;
        var baseUrl = 'https://script.google.com/macros/s/AKfycbxEzHdu8UvIpdiu0zk6qW5Ftda5h3_LI87v7XNNv0rVcvjnC72XURrRF4PF1O3EwExm/exec';
        var fields = {
          date: new Date().toISOString(),
          countries: Array.isArray(data.countries) ? data.countries.join('|') : (data.countries || ''),
          people: data.people || '',
          visa_3y: data.visa_3y || '',
          visa_country: Array.isArray(data.visa_country) ? data.visa_country.join('|') : (data.visa_country || ''),
          visited: Array.isArray(data.visited) ? data.visited.join('|') : (data.visited || ''),
          when: whenText,
          name: data.name || '',
          phone: phoneVal
        };
        var params = Object.keys(fields).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(fields[k]); }).join('&');
        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:absolute;width:1px;height:1px;border:0;visibility:hidden;';
        iframe.src = baseUrl + '?' + params;
        document.body.appendChild(iframe);
        setTimeout(function() { iframe.remove(); }, 5000);
        showMessage(quizForm, 'Спасибо! Менеджер свяжется с вами в ближайшее время.');
        quizForm.reset();
      });
    }

    goTo(1);
  })();

  // ——— FAQ accordion ———
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
