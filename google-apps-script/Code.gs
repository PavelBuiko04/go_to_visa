/**
 * Скрипт для сохранения квиза в Google Таблицу.
 * doGet и doPost ОБЯЗАТЕЛЬНО должны быть функциями верхнего уровня (не внутри других функций).
 * Расширения → Apps Script → вставь весь код → Сохранить → Развернуть → Новое развёртывание → Веб-приложение
 */

function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  return appendQuizRow(p);
}

function doPost(e) {
  var p = {};
  if (e && e.parameter) {
    p = e.parameter;
  } else if (e && e.postData && e.postData.contents) {
    try { p = JSON.parse(e.postData.contents); } catch (_) {}
  }
  return appendQuizRow(p);
}

function appendQuizRow(p) {
  try {
    if (!p.name && !p.phone) {
      return ContentService.createTextOutput('Ожидаются параметры name, phone и др.')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var countries = (p.countries || '').replace(/\|/g, ', ');
    var visaCountry = (p.visa_country || '').replace(/\|/g, ', ');
    var visited = (p.visited || '').replace(/\|/g, ', ');
    
    var phone = (p.phone || '').trim();
    if (phone && !phone.match(/^\+/) && phone.match(/^\d/)) phone = '+' + phone;
    var row = [
      p.date ? new Date(p.date) : new Date(),
      countries,
      p.people || '',
      p.visa_3y || '',
      visaCountry,
      visited,
      p.when || '',
      p.name || '',
      '\'' + phone
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
