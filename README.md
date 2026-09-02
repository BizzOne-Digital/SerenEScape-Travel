# SerenEScape Travel

**Belong Everywhere.** — Luxury group travel for Black and BIPOC LGBTQIA+ women.

A production-ready full-stack travel booking platform built with Next.js, MongoDB, PayPal, and Square.

## Features

- **Public website** — Cinematic home page, trip listings, detailed itineraries, testimonials, FAQ, contact
- **Booking flow** — Multi-step reservation with deposit, pay-in-full (5% discount), or payment plans
- **Payments** — PayPal Checkout + Square Web Payments SDK (server-side verification only)
- **Admin portal** — Trip management, bookings, payments, promo codes, inquiries, settings
- **Payment reminders** — Automated email reminders via cron endpoint
- **Representation-first** — Centralized image manifest; no tokenized imagery

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- MongoDB Atlas + Mongoose
- Auth.js (NextAuth v5) for admin sessions
- Zod + React Hook Form
- Cloudinary for media uploads
- Motion for animations
- Vitest + Playwright for testing

## Quick Start

### 1. Clone and install

```bash
cd serenescape-travel
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

**Minimum for local development:**

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=generate-a-random-32-char-string
ADMIN_EMAIL=admin@serenescapetravel.com
ADMIN_INITIAL_PASSWORD=YourSecurePassword123!
NEXT_PUBLIC_APP_URL=http://localhost:3000
BOOKING_TOKEN_SECRET=another-random-string
CRON_SECRET=cron-secret-string
```

The site runs without payment/SMTP/Cloudinary credentials — those features show as "unconfigured."

### 3. Seed the database

```bash
npm run seed
```

This creates:
- Admin user (from `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD`)
- Default site settings
- **2027 China Odyssey** trip (draft, not bookable)
- Draft FAQs
- Pay-in-full promotion metadata

### 4. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for dev)
3. Copy the connection string to `MONGODB_URI`

## Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Add to `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
   ```
3. Upload images via Admin → Media

## SMTP Setup

For transactional emails (booking confirmations, payment reminders):

```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASSWORD=your-password
EMAIL_FROM=letsescape@serenescapetravel.com
ADMIN_NOTIFICATION_EMAIL=letsescape@serenescapetravel.com
```

## PayPal Setup

### Sandbox

1. Create app at [developer.paypal.com](https://developer.paypal.com)
2. Add credentials:
   ```env
   PAYPAL_ENV=sandbox
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
   PAYPAL_CLIENT_SECRET=your-sandbox-secret
   PAYPAL_WEBHOOK_ID=your-webhook-id
   ```
3. Configure webhook URL: `https://yourdomain.com/api/webhooks/paypal`

### Live

Change `PAYPAL_ENV=live` and use live credentials.

## Square Setup

### Sandbox

1. Create app at [developer.squareup.com](https://developer.squareup.com)
2. Add credentials:
   ```env
   SQUARE_ENV=sandbox
   NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-app-id
   NEXT_PUBLIC_SQUARE_LOCATION_ID=your-location-id
   SQUARE_ACCESS_TOKEN=your-access-token
   SQUARE_WEBHOOK_SIGNATURE_KEY=your-signature-key
   ```
3. Configure webhook URL: `https://yourdomain.com/api/webhooks/square`

### Production

Change `SQUARE_ENV=production` and use production credentials.

## Vercel Deployment

1. Push to GitHub and import in Vercel
2. Add all environment variables from `.env.example`
3. Configure cron job in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/payment-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

4. Set `CRON_SECRET` in Vercel environment variables

## Admin Guide

### Create a trip

1. Admin → Trips → New Trip
2. Fill destination, dates, pricing, capacity
3. Build itinerary days
4. Set deposit amount and payment plan template
5. Set status to "Booking Open" and enable `isBookable`
6. Publish

### Configure deposits

Set `depositCents` on the trip (stored in cents, e.g. `50000` = $500).

### Configure payment plans

Enable `paymentPlanEnabled` and set `paymentScheduleTemplate`:
- `installmentCount` — number of installments after deposit
- `intervalDays` — days between installments
- `finalDeadline` — last payment date

### Create promo codes

Admin → Promo Codes → Create:
- Code, discount type (percentage/fixed)
- Trip restrictions, date limits, usage limits
- Toggle homepage banner for announcement display

### Test bookings

1. Complete trip setup with all required fields
2. Use PayPal/Square sandbox credentials
3. Complete booking flow at `/booking/[trip-slug]`
4. Verify payment in Admin → Bookings

## Image Manifest

All site imagery is centralized in `src/config/images.ts`. Replace paths there for site-wide updates. People imagery must feature Black/BIPOC LGBTQIA+ women only when approved assets are provided.

## Testing

```bash
npm run test        # Vitest unit tests
npm run test:e2e    # Playwright E2E tests
npm run lint        # ESLint
npm run build       # Production build
```

## Project Structure

```
src/
├── app/              # Routes (public + admin + API)
├── components/       # UI, public, admin, booking, trips
├── config/           # Brand, images, legal drafts
├── hooks/            # Custom React hooks
├── lib/              # Auth, DB, models, payments, pricing, email
├── scripts/          # Seed script
└── tests/            # Vitest tests
public/
├── brand/            # Logo
└── images/           # Placeholder SVGs
```

## Payment Rules

- **No Stripe** — PayPal and Square only
- **No Zelle** in active checkout
- All prices calculated server-side
- Payment success page never marks bookings paid — verification via capture/webhook only
- Card data never stored in MongoDB
- Idempotency keys prevent duplicate charges

## License

Proprietary — SerenEScape Travel
