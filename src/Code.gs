function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const type = e && e.parameter && e.parameter.type;

  // ── GET MERCH ──────────────────────────────────────────────────────────────
  if (type === 'merch') {
    const sheet = ss.getSheetByName('merch');
    if (!sheet) return json({ error: 'Merch sheet not found' });
    const [headers, ...rows] = sheet.getDataRange().getValues();
    const data = rows.map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      // Parse pipe-separated arrays
      obj.imgs   = obj.imgs   ? obj.imgs.toString().split('|').filter(Boolean)   : [];
      obj.fields = obj.fields ? obj.fields.toString().split('|').filter(Boolean) : ['note'];
      return obj;
    });
    return json({ data });
  }

  // ── GET DESTINATIONS (default) ─────────────────────────────────────────────
  const sheet = ss.getSheetByName('destinations');
  const [headers, ...rows] = sheet.getDataRange().getValues();
  const data = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    obj.highlights = obj.highlights ? obj.highlights.split('|') : [];
    return obj;
  });
  return json({ data });
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);

  // ── SAVE DESTINATIONS (from admin) ─────────────────────────────────────────
  if (data.type === 'save_destinations') {
    const sheet = ss.getSheetByName('destinations');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
    data.destinations.forEach(dest => {
      const row = headers.map(h => {
        if (h === 'highlights') return (dest.highlights || []).join('|');
        return dest[h] !== undefined ? dest[h] : '';
      });
      sheet.appendRow(row);
    });
    return json({ success: true });
  }

  // ── SAVE MERCH (from admin) ────────────────────────────────────────────────
  if (data.type === 'save_merch') {
    let sheet = ss.getSheetByName('merch');
    if (!sheet) {
      sheet = ss.insertSheet('merch');
      sheet.appendRow(['id', 'name', 'price', 'tag', 'desc', 'category', 'imgs', 'fields']);
    }
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
    data.merch.forEach(item => {
      const row = headers.map(h => {
        if (h === 'imgs')   return Array.isArray(item.imgs)   ? item.imgs.join('|')   : (item.imgs || '');
        if (h === 'fields') return Array.isArray(item.fields) ? item.fields.join('|') : (item.fields || 'note');
        return item[h] !== undefined ? item[h] : '';
      });
      sheet.appendRow(row);
    });
    return json({ success: true });
  }

  // ── BOOKING (existing) ─────────────────────────────────────────────────────
  const sheet = ss.getSheetByName('bookings');
  sheet.appendRow([
    new Date().toISOString(),
    data.destination,
    data.name,
    data.email,
    data.date,
    data.travellers,
    data.budget,
    data.message
  ]);
  return json({ success: true });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
