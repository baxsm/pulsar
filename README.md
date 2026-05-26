# Pulsar

An API-based notification platform. Create API keys, set up event categories, and send notifications to Discord and Slack from your apps.

**Live:** [pulsar-omega.vercel.app](https://pulsar-omega.vercel.app/)

## Screenshots

![Dashboard](/.github/readme1.png)
![API Keys](/.github/readme2.png)
![Event Categories](/.github/readme3.png)
![Event Categories Detail](/.github/readme4.png)
![Event Categories View](/.github/readme5.png)
![Integrations](/.github/readme6.png)
![Billing](/.github/readme7.png)

## What it does

- Generate and manage encrypted API keys for your applications
- Create event categories with custom names, colors, and labels
- Connect Discord (DMs or channels) and Slack (public or private channels)
- Send real-time notifications from any app using a simple API call
- Free and Pro plans with quota management

## API usage

Send a notification with a single POST request:

```bash
curl -X POST https://pulsar-omega.vercel.app/api/v1/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "integration": "discord_dm",
    "category": "order-update",
    "fields": {
      "field1": "customer123",
      "field2": "customer@example.com"
    }
  }'
```

Integration options: `discord_dm`, `discord_channel`, `slack`

## How to use it

1. Generate your API key from the dashboard
2. Create event categories (like "order-update" or "new-signup")
3. Connect your Discord bot or Slack workspace
4. Start sending events from your app using the API

## Tech stack

- Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui
- Prisma with Neon PostgreSQL
- Clerk for auth, Stripe for billing
- Discord.js REST API, Slack API
- React Query, Zustand, React Hook Form, Zod

## Getting started

```bash
git clone https://github.com/baxsm/pulsar.git
cd pulsar
npm install --legacy-peer-deps
```

Set up your `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ENCRYPTION_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
DISCORD_BOT_TOKEN=
NEXT_PUBLIC_SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
```

```bash
npm run dev
```

Open `http://localhost:3000` to get started.
