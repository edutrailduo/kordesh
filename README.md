# KORDESH

A Bengali-first, bilingual Korean beauty storefront for Bangladesh.

## Current free storefront
- Static storefront hosted with GitHub Pages
- Premium editorial black-and-white design
- Bengali / English language switch
- Product catalogue with images, prices and detail modal
- Shopping cart saved in the visitor's browser
- Bangladesh checkout form
- WhatsApp order handoff
- Google Sheets order capture through Google Apps Script

## Publish with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**, then Save.
4. Wait for GitHub Pages to publish the site.

Expected URL: https://edutrailduo.github.io/kordesh/

## Enable order notifications
The WhatsApp number and Google Sheets endpoint are deliberately left as placeholders. Orders are not live until these are configured.

### WhatsApp
In `app.js`, replace `8801XXXXXXXXX` with the KORDESH Bangladesh WhatsApp number, including country code 880 and without a plus sign.

### Google Sheets
1. Create a Google Spreadsheet named **KORDESH Orders**.
2. Copy its ID from the URL (the text between `/d/` and `/edit`).
3. Open [Google Apps Script](https://script.google.com/) and create a project.
4. Copy the contents of `google-apps-script/Code.gs` into the editor.
5. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your Spreadsheet ID.
6. Save, then choose **Deploy → New deployment → Web app**.
7. Set **Execute as: Me** and **Who has access: Anyone**.
8. Deploy and authorize the script. Copy the URL ending in `/exec`.
9. In `app.js`, replace `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.

Orders will appear in the **Orders** tab. You can change the order status in the sheet manually.

## Important before public launch
- The catalogue, product descriptions, prices and delivery charges are demonstration content. Verify stock, authenticity, sizes, prices and shipping fees before accepting real orders.
- Product photos currently load from external image hosts; they are not stored in this repository and may change or block hotlinking.
- Delivery charges are sample values: ৳80 inside Dhaka and ৳130 outside Dhaka.
- The free version does not process online card or mobile-wallet payments. Confirm payment manually with the customer.
- Test a complete order on your own phone before promoting the store.

## Future upgrade
This GitHub Pages version is a free storefront, not WordPress hosting. To move to WooCommerce later, purchase compatible WordPress hosting and migrate the product catalogue and design.
