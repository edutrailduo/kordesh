# KORDESH

A Bengali-first, bilingual Korean beauty storefront for Bangladesh.

## Free storefront
- Static storefront hosted with GitHub Pages
- Premium editorial design and Bengali / English switch
- Product catalogue, product details, cart and checkout
- WhatsApp order handoff to KORDESH: 8801640282864
- Supabase database for order capture
- Private admin dashboard at `/admin.html`
- No Google Sheets, paid hosting, or new Supabase project required for this setup

## Publish with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/(root)**, then Save.
4. Wait for GitHub Pages to publish the site.

Expected storefront URL: https://edutrailduo.github.io/kordesh/

Admin URL: https://edutrailduo.github.io/kordesh/admin.html

## Order storage and admin access
The checkout writes orders to the existing Supabase project in the dedicated `kordesh_orders` table. The existing `work_shifts` table is not changed.

Security:
- Public visitors can submit orders but cannot read the order table.
- Only user IDs explicitly added to `kordesh_admins` can view or update orders.
- The public website contains only the Supabase publishable key. Never put a Supabase secret or service-role key in this repository.

### Activate the store administrator
1. Open the admin URL.
2. Enter your email and a strong password, then choose **Admin account তৈরি**.
3. If email confirmation is enabled, confirm your email and log in.
4. The admin page will show your Supabase User ID. Send that ID to the project maintainer so it can be added to the private admin allowlist.
5. After approval, log in again. You can view orders and change their status.

## Automatic order confirmation email
- Checkout collects the customer's email address and saves it with the order.
- After the order is saved, the Supabase Edge Function `kordesh-order-email` sends a branded confirmation through Brevo.
- The email includes the order ID, items, total, and delivery address.
- Email delivery requires a Brevo account, a verified sender address, and two Edge Function secrets:
  - `BREVO_API_KEY`
  - `KORDESH_FROM_EMAIL` (the sender email address verified in Brevo)
- Add these values in Supabase **Project Settings → Edge Functions → Secrets**: https://supabase.com/dashboard/project/bibithkwfrwahttdkcfi/functions/secrets
- Create an API key in Brevo and register a sender under **Settings → Senders, Domains, IPs → Senders**. Verify the sender using the OTP sent to that mailbox. See [Brevo sender setup](https://developers.brevo.com/docs/getting-started-with-senders-and-domains).
- Brevo Free includes transactional email and up to 300 email sends per day; free emails include Brevo branding. See [Brevo Free plan limits](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan).

## Before accepting real orders
- The current catalogue, product descriptions, prices, and delivery fees are sample content. Confirm stock, authenticity, pricing, sizes, and shipping fees before launch.
- Product photos are loaded from external image hosts and may change or block hotlinking.
- Delivery fees are sample values: ৳80 inside Dhaka and ৳130 outside Dhaka.
- The free version does not process card or mobile-wallet payments. Confirm payment manually with the customer.
- Test a complete order on your own phone before promoting the store.

## Future upgrade
GitHub Pages is static hosting and cannot run WordPress/WooCommerce. WooCommerce requires WordPress-compatible hosting and a migration of the catalogue and storefront.
