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
      if (el.name) data[el.name] = (el.value || '').trim();
    }
    return data;
  }

  var LEAD_FORM_URL = 'https://script.google.com/macros/s/AKfycbyLcAVMD2Y_-oZq4gd-_VbxavlgfnclEPvEdnckRONO5auI5IYY9lHHXfMB-3sHP-T0_Q/exec';

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var data = serializeForm(form);
    var nameVal = (data.name || '').trim();
    var phoneVal = (data.phone || '').trim();
    if (!nameVal || !phoneVal) {
      showMessage(form, 'Укажите имя и телефон.');
      return;
    }
    if (phoneVal && !/^\+/.test(phoneVal) && /^\d/.test(phoneVal)) phoneVal = '+' + phoneVal;
    var fields = {
      form: 'lead',
      date: new Date().toISOString(),
      name: nameVal,
      phone: phoneVal,
      telegram: (data.telegram || '').trim(),
      message: (data.message || '').trim()
    };
    if (LEAD_FORM_URL.indexOf('YOUR_LEAD') !== -1) {
      console.log('Lead form data (укажите LEAD_FORM_URL в main.js):', fields);
      showMessage(form, 'Спасибо! Мы свяжемся с вами в течение часа.');
      form.reset();
      return;
    }
    var f = document.createElement('form');
    f.method = 'POST';
    f.action = LEAD_FORM_URL;
    f.target = 'lead-submit-frame';
    Object.keys(fields).forEach(function(k) {
      var inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = k;
      inp.value = fields[k];
      f.appendChild(inp);
    });
    var frame = document.getElementById('lead-submit-frame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.name = 'lead-submit-frame';
      frame.id = 'lead-submit-frame';
      frame.style.cssText = 'position:absolute;width:1px;height:1px;border:0;visibility:hidden;';
      document.body.appendChild(frame);
    }
    document.body.appendChild(f);
    f.submit();
    f.remove();
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
        var r = quiz.querySelector('input[name="people"]:checked');
        if (!r) return false;
        if (r.value === 'other') {
          var val = (quiz.querySelector('[name="people_other"]')?.value || '').trim();
          return val.length > 0;
        }
        return true;
      }
      if (slideNum === 2) {
        var checked = quiz.querySelectorAll('input[name="visa_3y"]:checked');
        if (!checked.length) return false;
        var other = quiz.querySelector('input[name="visa_3y"][value="other"]');
        if (other && other.checked) {
          var val = (quiz.querySelector('[name="visa_3y_other"]')?.value || '').trim();
          return val.length > 0;
        }
        return true;
      }
      if (slideNum === 3) {
        var r = quiz.querySelector('input[name="when"]:checked');
        if (!r) return false;
        if (r.value === 'date') {
          var val = (quiz.querySelector('[name="when_other"]')?.value || '').trim();
          return val.length > 0;
        }
        return true;
      }
      if (slideNum === 4) {
        var checked = quiz.querySelectorAll('input[name="countries"]:checked');
        if (!checked.length) return false;
        var other = quiz.querySelector('input[name="countries"][value="other"]');
        if (other && other.checked) {
          var val = (quiz.querySelector('[name="countries_other"]')?.value || '').trim();
          return val.length > 0;
        }
        return true;
      }
      if (slideNum === 5) return true;
      return true;
    }

    function updateNextButton() {
      if (nextBtn && current < totalSlides) {
        nextBtn.disabled = !isSlideValid(current);
      }
    }

    function getNextSlide() {
      return current + 1;
    }
    function getPrevSlide() {
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

    // Автодополнение стран для «Свой вариант» в «Куда поездка» (все страны мира)
    var countriesList = (typeof window.COUNTRIES_RU !== 'undefined') ? window.COUNTRIES_RU : [];
    var countryInput = quiz.querySelector('.quiz-country-autocomplete');
    var suggestionsEl = quiz.querySelector('.quiz-country-suggestions');
    if (countryInput && suggestionsEl) {
      function getMatches(query) {
        var q = (query || '').trim().toLowerCase();
        if (!q) return [];
        return countriesList.filter(function(c) {
          return c.toLowerCase().indexOf(q) !== -1;
        }).slice(0, 5);
      }
      function showSuggestions(matches) {
        suggestionsEl.innerHTML = '';
        if (!matches.length) {
          suggestionsEl.hidden = true;
          return;
        }
        matches.forEach(function(name) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'quiz-country-suggestion';
          btn.textContent = name;
          btn.addEventListener('click', function() {
            countryInput.value = name;
            suggestionsEl.hidden = true;
            updateNextButton();
          });
          suggestionsEl.appendChild(btn);
        });
        suggestionsEl.hidden = false;
      }
      function hideSuggestions() {
        setTimeout(function() { suggestionsEl.hidden = true; }, 150);
      }
      countryInput.addEventListener('input', function() {
        showSuggestions(getMatches(countryInput.value));
      });
      countryInput.addEventListener('focus', function() {
        showSuggestions(getMatches(countryInput.value));
      });
      countryInput.addEventListener('blur', hideSuggestions);
    }

    // «Другой вариант» — показывать/скрывать поле ввода
    function toggleOtherWrap(otherInput, wrap) {
      wrap.style.display = otherInput.checked ? 'block' : 'none';
    }
    quiz.querySelectorAll('.quiz-option-other').forEach(function(label) {
      var wrap = label.nextElementSibling;
      var otherInput = label.querySelector('input');
      if (!otherInput || !wrap || !wrap.classList.contains('quiz-other-input-wrap')) return;
      function onToggle() {
        toggleOtherWrap(otherInput, wrap);
        if (otherInput.name === 'when' && otherInput.value === 'date' && otherInput.checked) {
          var dateInput = wrap.querySelector('input[type="date"]');
          if (dateInput) {
            var today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
          }
        }
      }
      otherInput.addEventListener('change', onToggle);
      if (otherInput.type === 'radio') {
        quiz.querySelectorAll('input[name="' + otherInput.name + '"]').forEach(function(radio) {
          radio.addEventListener('change', onToggle);
        });
      }
    });

    // Визы за 3 года: «Не было виз» и страны взаимно исключают друг друга
    var visaNo = quiz.querySelector('input[name="visa_3y"][value="no"]');
    var visaCountries = quiz.querySelectorAll('input[name="visa_3y"][value="Греция"], input[name="visa_3y"][value="Испания"], input[name="visa_3y"][value="Италия"], input[name="visa_3y"][value="other"]');
    if (visaNo && visaCountries.length) {
      function syncVisa3y() {
        var noChecked = visaNo.checked;
        var anyCountryChecked = Array.prototype.some.call(visaCountries, function(cb) { return cb.checked; });
        visaCountries.forEach(function(cb) {
          cb.disabled = noChecked;
          if (noChecked) { cb.checked = false; }
          cb.closest('.quiz-option').style.opacity = noChecked ? '0.5' : '1';
          cb.closest('.quiz-option').style.pointerEvents = noChecked ? 'none' : '';
        });
        visaNo.disabled = anyCountryChecked;
        if (anyCountryChecked) { visaNo.checked = false; }
        visaNo.closest('.quiz-option').style.opacity = anyCountryChecked ? '0.5' : '1';
        visaNo.closest('.quiz-option').style.pointerEvents = anyCountryChecked ? 'none' : '';
        // Скрыть поле «Свой вариант» при снятии «other»
        var otherCb = quiz.querySelector('input[name="visa_3y"][value="other"]');
        var wrap = otherCb && otherCb.closest('.quiz-option-other') && otherCb.closest('.quiz-option-other').nextElementSibling;
        if (wrap && wrap.classList.contains('quiz-other-input-wrap')) wrap.style.display = otherCb.checked ? 'block' : 'none';
      }
      quiz.querySelectorAll('input[name="visa_3y"]').forEach(function(inp) {
        inp.addEventListener('change', syncVisa3y);
      });
      syncVisa3y();
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
        // Куда поездка — собираем ВСЕ выбранное: карточки стран + свой вариант (в одной строке)
        quizData.countries = [];
        quiz.querySelectorAll('input[name="countries"]:checked').forEach(function(cb) {
          var val = cb.value === 'other' ? (quiz.querySelector('[name="countries_other"]')?.value || '').trim() : cb.value;
          if (val) quizData.countries.push(val);
        });
        // Количество человек
        var peopleChecked = quiz.querySelector('input[name="people"]:checked');
        quizData.people = peopleChecked ? (peopleChecked.value === 'other' ? (quiz.querySelector('[name="people_other"]')?.value || '').trim() : peopleChecked.value) : '';
        // Визы за 3 года — собираем все выбранное в одной строке
        quizData.visa_3y = [];
        quiz.querySelectorAll('input[name="visa_3y"]:checked').forEach(function(r) {
          var v = r.value === 'other' ? (quiz.querySelector('[name="visa_3y_other"]')?.value || '').trim() : r.value;
          if (v) quizData.visa_3y.push(v);
        });
        // Когда поездка
        var whenChecked = quiz.querySelector('input[name="when"]:checked');
        quizData.when = whenChecked ? (whenChecked.value === 'date' ? (quiz.querySelector('[name="when_other"]')?.value || '').trim() : whenChecked.value) : '';
        Object.assign(data, quizData);
        console.log('Quiz form data:', data);
        // Человекочитаемые подписи
        var peopleLabels = { '1': 'Только я', '2': '2 человека', '3-4': '3–4 человека', '5+': 'Компания от 5 человек' };
        var visa3yLabels = { 'no': 'Не было виз' };
        var whenLabels = {
          'urgent': 'Меньше, чем через 2 недели',
          '2-4': 'В ближайшее время (2–4 недели)',
          '1-3m': '1–3 месяца есть в запасе',
          'undecided': 'Просто хочу уточнить заранее информацию'
        };
        var peopleText = peopleLabels[data.people] || data.people || '';
        var visa3yArr = (Array.isArray(data.visa_3y) ? data.visa_3y : []).map(function(v) { return visa3yLabels[v] || v; });
        var whenRaw = data.when || '';
        var whenText = whenLabels[whenRaw] || (whenRaw && /^\d{4}-\d{2}-\d{2}$/.test(whenRaw) ? 'Точная дата: ' + whenRaw.split('-').reverse().join('.') : whenRaw) || '';
        var phoneVal = (data.phone || '').trim().replace(/\s+/g, ' ');
        if (phoneVal && !/^\+/.test(phoneVal) && /^\d/.test(phoneVal)) phoneVal = '+' + phoneVal;
        var baseUrl = 'https://script.google.com/macros/s/AKfycbxEzHdu8UvIpdiu0zk6qW5Ftda5h3_LI87v7XNNv0rVcvjnC72XURrRF4PF1O3EwExm/exec';
        var fields = {
          date: new Date().toISOString(),
          people: peopleText,
          visa_3y: visa3yArr.join('|'),
          when: whenText,
          countries: Array.isArray(data.countries) ? data.countries.join('|') : (data.countries || ''),
          name: (data.name || '').trim(),
          phone: phoneVal
        };
        // POST вместо GET — URL при GET обрезается, и страны/имя/телефон теряются
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = baseUrl;
        form.target = 'quiz-submit-frame';
        Object.keys(fields).forEach(function(k) {
          var inp = document.createElement('input');
          inp.type = 'hidden';
          inp.name = k;
          inp.value = fields[k];
          form.appendChild(inp);
        });
        var frame = document.getElementById('quiz-submit-frame');
        if (!frame) {
          frame = document.createElement('iframe');
          frame.name = 'quiz-submit-frame';
          frame.id = 'quiz-submit-frame';
          frame.style.cssText = 'position:absolute;width:1px;height:1px;border:0;visibility:hidden;';
          document.body.appendChild(frame);
        }
        document.body.appendChild(form);
        form.submit();
        form.remove();
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
