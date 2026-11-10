/**
 * KORDESH order receiver for Google Sheets.
 * 1) Create a Google Sheet.
 * 2) Paste its ID into SPREADSHEET_ID below.
 * 3) Deploy this Apps Script as a Web App (Execute as: Me; Access: Anyone).
 */
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Orders";

function doGet() {
  return ContentService.createTextOutput("KORDESH order endpoint is ready.");
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Empty order payload");
    }
    const order = JSON.parse(e.postData.contents);
    validateOrder_(order);

    if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf("PASTE_") === 0) {
      throw new Error("Set SPREADSHEET_ID in Code.gs first.");
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    const headers = [
      "Order ID", "Order Time", "Customer Name", "Phone", "District",
      "Area / Thana", "Full Address", "Order Note", "Products",
      "Subtotal (BDT)", "Delivery Fee (BDT)", "Delivery Zone",
      "Total (BDT)", "Status"
    ];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    const items = (order.items || []).map(function(item) {
      return item.name + " / " + item.englishName + " x " + item.qty +
        " @ BDT " + item.price;
    }).join(" | ");

    // Prefix user-entered text with apostrophe to prevent spreadsheet formulas.
    const safe = function(value) {
      const s = String(value == null ? "" : value).trim();
      return /^[=+@-]/.test(s) ? "'" + s : s;
    };

    sheet.appendRow([
      safe(order.orderId),
      new Date(order.createdAt || new Date()),
      safe(order.customer.name),
      safe(order.customer.phone),
      safe(order.customer.district),
      safe(order.customer.area),
      safe(order.customer.address),
      safe(order.customer.note),
      safe(items),
      Number(order.subtotal) || 0,
      Number(order.deliveryFee) || 0,
      safe(order.deliveryZone),
      Number(order.total) || 0,
      "New"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, orderId: order.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err.message || err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function validateOrder_(order) {
  if (!order || !order.orderId || !order.customer || !Array.isArray(order.items) || !order.items.length) {
    throw new Error("Invalid order.");
  }
  if (!order.customer.name || !order.customer.phone || !order.customer.address) {
    throw new Error("Customer details are incomplete.");
  }
  if (order.items.length > 30) throw new Error("Too many line items.");
}