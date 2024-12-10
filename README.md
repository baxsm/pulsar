# 🚀 Pulsar - Integration & Notification Solution! 🚀

Welcome to **Pulsar**! 🌌 Pulsar is a powerful platform that enables users to **create API keys**, define **event categories**, and seamlessly integrate with **Discord** (Direct Message or Channel) and **Slack**. Experience an easy way to trigger real-time notifications and updates to your platforms, effortlessly! 🛠️

---

## 📖 Overview 📖

**Pulsar** offers the following capabilities:

- 🔑 **Create API Keys**: Easily generate secure API keys for your applications.  
- 📁 **Event Categories**: Organize your events into categories with names, emojis, and colors.
- 🌉 **Integrations Made Easy**: Plug in your Discord (DM or Channel) and Slack.  
- 🔔 **Send Custom Event Notifications**: Use our API to send real-time custom notifications!  
  - Direct Messages or Channels on Discord.  
  - Private/Public Slack Channels.  
- 📊 **Quota Management**: Manage usage with **Free** and **Pro** plans for a scalable experience.  

Whether you're building a notification system for your app or managing team/event updates, **Pulsar** is here to streamline your workflows. 🎉

---

## 🚀 Features 🚀

✔️ **API Key Management**: Quickly create, encrypt, and activate/deactivate API keys.  
✔️ **Event Categories**: Customize categories with colors, names, and emojis.  
✔️ **Discord Integration**: Send embeds to Discord Direct Messages or Channels.  
✔️ **Slack Integration**: Post beautiful markdown messages to private or public Slack channels.  
✔️ **Secure Backend**: Fully encrypted API keys ensure data security.  
✔️ **Quota & Plans**: Set monthly quotas depending on user plans (`FREE` vs. `PRO`).  

---

## 🌐 Live Application 🌐

Try **Pulsar** today to simplify your notification needs.

🔗 **Live URL**: [Pulsar Live App](https://pulsar-omega.vercel.app/)  

---

## 🔧 Installation 🔧

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/baxsm/pulsar.git
   cd pulsar
   ```

2. **Install Dependencies**:

   Ensure you use `--legacy-peer-deps` if necessary to avoid dependency conflicts.

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set Up Environment Variables**:

   Create a `.env.local` file in the root of the project and define all necessary environment variables.

   Example `.env.local` file:

   ```plaintext
    NEXT_PUBLIC_APP_URL=http://localhost:3000

    DATABASE_URL=

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/welcome
    NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard

    ENCRYPTION_KEY=

    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    PRO_PRICE_ID=

    DISCORD_BOT_TOKEN=
    NEXT_PUBLIC_DISCORD_BOT_INSTALL_LINK=

    NEXT_PUBLIC_SLACK_CLIENT_ID=
    SLACK_CLIENT_SECRET=
   ```

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   You'll now be able to access the app at `http://localhost:3000`. 🌟

---

## 🌉 API Documentation 🌉

### 📬 POST `/api/v1/events`

Use this API to send event notifications to Discord or Slack.

#### Request Headers:
```bash
Authorization: Bearer YOUR_API_KEY
```

#### Request Body:
```javascript
{
  "integration": "discord_dm", // options: discord_dm, discord_channel, slack
  "category": "your_event_category",
  "fields": {
    "field1": "value1", // ex: recipient id
    "field2": "value2"  // ex: user email
  }
}
```

#### Code Snippet Example:
```javascript
await fetch('http://localhost:3000/api/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({
    integration: 'discord_dm',
    category: 'orderUpdate',
    fields: {
      field1: 'customer123',
      field2: 'customer@example.com',
    },
  }),
});
```
✅ Integration options: 
- `discord_dm`: Send as a DM in Discord to a recipient.  
- `discord_channel`: Post directly to a Discord Channel.  
- `slack`: Post directly to a Slack private/public channel.  
---

## 🔀 Dashboard Navigation Links 🔀

Quick links to **Pulsar's** dashboard and key features:  
- **Dashboard** ➡️ `/dashboard`  
- **API Keys Management** ➡️ `/dashboard/api-keys`  
- **Event Categories** ➡️ `/dashboard/event-category`  
- **Integrations** ➡️ `/dashboard/integrations`  
- **Billing** ➡️ `/dashboard/billing`  

---

## 🎨 Tech Stack 🎨

- **Frontend**: Next.js, TailwindCSS, shadcn-ui.  
- **Backend**: Prisma, Neon PostgreSQL.  
- **Authentication**: Clerk  
- **Integrations**:  
  🔗 **Discord API** to manage notifications.  
  🔗 **Slack API** to send rich markdown messages.  

Additional Libraries include:
- **Radix UI**, **React Query**, **React Hook Form**, **Zod**, etc.  

---

## 📝 How It Works 📝

Key steps to integrate and get started with **Pulsar**:  

### 🔑 Step 1: Generate your API Key  
Navigate to the **API Keys** section to create and copy your securely encrypted API key.  

### 🎨 Step 2: Create Event Categories  
Define your **categories** like "order-update" or "new-comment" and customize them with colors and emojis.

### 🌉 Step 3: Set Up Integrations  
Integrate either:  
- **Discord**: DM users or post messages to channels.  
- **Slack**: Post messages to private or public channels.

### 🖥️ Step 4: Start Sending Events  
Use your API key, category name, and fields to send requests to Pulsar’s `/api/v1/events` endpoint.

---

## 📸 Screenshots 📸

Capture the workflow with these beautiful screenshots!  

### 🔑 Dashboard Analytics 
In-depth analytics dashboard.  
![Dashboard](/.github/readme1.png)

### 🔑 API Keys Dashboard  
Manage your API keys effortlessly.  
![API Keys](/.github/readme2.png)

---

### 📁 Event Categories  
Customize your notifications with emojis and colors.  
![Event Categories 1](/.github/readme3.png)

![Event Categories 2](/.github/readme4.png)

![Event Categories 3](/.github/readme5.png)

---

### 🌉 Integrations Setup  
Connect to Discord and Slack with ease.  
![Integrations Screenshot](/.github/readme6.png)

---

### 🔔 Billing
Manage your billing, upgrade or view your upcoming payments!  
![Sending Event Screenshot](/.github/readme7.png)

---