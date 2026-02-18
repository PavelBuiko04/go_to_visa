/**
 * Скрипт для КВИЗА (Подбор визы) — сохраняет ответы в Google Таблицу.
 *
 * НАСТРОЙКА ТАБЛИЦЫ — названия столбцов в первой строке (строго по порядку):
 * A1: Дата
 * B1: Кол-во человек
 * C1: Визы за 3 года
 * D1: Когда поездка
 * E1: Куда поездка
 * F1: Имя
 * G1: Телефон
 *
 * Расширения → Apps Script → вставь код → Сохранить → Развернуть → Веб-приложение
 */

function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  return appendQuizRow(p);
}

function doPost(e) {
  var p = {};
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    p = e.parameter;
  } else if (e && e.postData && e.postData.contents) {
    var body = e.postData.contents;
    var type = (e.postData.type || '').toLowerCase();
    if (type.indexOf('json') !== -1) {
      try { p = JSON.parse(body); } catch (_) {}
    } else {
      body.split('&').forEach(function(pair) {
        var idx = pair.indexOf('=');
        var key = idx > 0 ? decodeURIComponent(pair.substring(0, idx).replace(/\+/g, ' ')) : '';
        var val = idx >= 0 ? decodeURIComponent((pair.substring(idx + 1) || '').replace(/\+/g, ' ')) : '';
        if (key) p[key] = val;
      });
    }
  }
  return appendQuizRow(p);
}

function appendQuizRow(p) {
  try {
    var nameVal = (p.name || '').trim();
    var phoneVal = (p.phone || '').trim();
    if (!nameVal || !phoneVal) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Нужны имя и телефон' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // Проверка: если лист пустой, добавить заголовки
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Дата', 'Кол-во человек', 'Визы за 3 года', 'Когда поездка', 'Куда поездка', 'Имя', 'Телефон']);
    }
    var countries = (p.countries || '').replace(/\|/g, ', ');
    var visa3y = (p.visa_3y || '').replace(/\|/g, ', ');
    var when = (p.when || '').trim();
    if (phoneVal && !phoneVal.match(/^\+/) && phoneVal.match(/^\d/)) phoneVal = '+' + phoneVal;
    // Строго 7 столбцов по порядку: A=Дата, B=Кол-во человек, C=Визы за 3 года, D=Когда, E=Куда, F=Имя, G=Телефон
    var row = [
      p.date ? new Date(p.date) : new Date(),
      (p.people || '').toString().trim(),
      visa3y,
      when,
      countries,
      nameVal,
      "'" + phoneVal
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
