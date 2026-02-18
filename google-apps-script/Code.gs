/**
 * Скрипт для формы «Связаться с нами» — вторая таблица (отдельная от квиза).
 *
 * НАСТРОЙКА ТАБЛИЦЫ:
 * Первая строка (заголовки): Дата | Имя | Телефон | Telegram | Сообщение
 *
 * Расширения → Apps Script → вставь код → Сохранить → Развернуть → Новое развёртывание → Веб-приложение
 * Выполнять от имени: Я | У кого доступ: Все пользователи
 */

function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  return appendLeadRow(p);
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
  return appendLeadRow(p);
}

function appendLeadRow(p) {
  try {
    if (!p.name && !p.phone) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Нужны имя и телефон' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Заявки') || ss.getSheetByName('Лист1') || ss.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Дата', 'Имя', 'Телефон', 'Telegram', 'Сообщение']);
    }
    var phone = (p.phone || '').trim();
    if (phone && !phone.match(/^\+/) && phone.match(/^\d/)) phone = '+' + phone;
    var row = [
      p.date ? new Date(p.date) : new Date(),
      p.name || '',
      '\'' + phone,
      p.telegram || '',
      p.message || ''
    ];
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
