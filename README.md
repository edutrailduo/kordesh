# KORDESH

Bengali-first, bilingual Korean beauty storefront for customers in Bangladesh.

## Included
- Bengali default language with English toggle
- Responsive black-and-white storefront
- Sample Korean skincare and sun-care catalogue with Bangladeshi Taka pricing
- Cart with quantity controls and local browser persistence
- Bangladesh checkout form with district, area, address and delivery zone
- WhatsApp order message handoff
- Google Sheets order capture using Google Apps Script
- Google Sheets can be downloaded as Microsoft Excel (.xlsx)

## Before going live

### 1. Configure WhatsApp
Open `app.js` and replace:
```js
WHATSAPP_NUMBER: "8801XXXXXXXXX"
```
with the KORDESH Bangladesh WhatsApp number, including country code 880 and without a plus sign.

### 2. Connect Google Sheets
1. Create a Google Sheet in the Google account where you want to receive orders.
2. Copy the spreadsheet ID from its URL. It is the text between `/d/` and `/edit`.
3. Open [Google Apps Script](https://script.google.com/) and create a new project.
4. Copy all code from `google-apps-script/Code.gs` into the Apps Script editor.
5. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your spreadsheet ID.
6. Save the project.
7. Choose **Deploy → New deployment → Web app**.
8. Set **Execute as: Me** and **Who has access: Anyone**, then deploy and authorize it.
9. Copy the Web App URL ending in `/exec`.
10. In `app.js`, replace `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.

Orders will be added to a tab named **Orders**. In Google Sheets, use **File → Download → Microsoft Excel (.xlsx)** to get an Excel copy.

### 3. Enable GitHub Pages
In the GitHub repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then Save.

The site will appear at:
`https://edutrailduo.github.io/kordesh/`

## Important notes
- Product list, descriptions and prices are starter/demo content. Confirm actual stock, sizes, authenticity, final selling prices and shipping fees before taking public orders.
- Delivery fees are currently sample values: ৳80 inside Dhaka and ৳130 outside Dhaka.
- The current checkout does not collect online card or mobile-wallet payments. It records the order and opens WhatsApp so the shop can confirm payment and delivery details.
- Google Sheets web app URL and WhatsApp number must be configured before live order capture works.
- Do not store payment PINs, passwords or card details in the order form.
