# Pathwaiz Career Clarity

Connect with industry professionals, entrepreneurs, and freelancers for firsthand career insights before you commit to your next move.

## Project info

**URL**: https://lovable.dev/projects/9d41d9ba-2e13-420e-86f1-a6feba4d10db

## 🚀 Quick Start

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase account (for backend services) - [Sign up here](https://supabase.com)
- A Stripe account (for payments) - [Sign up here](https://stripe.com)

### Setup Instructions

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd pathwaiz-career-clarity

# Step 3: Install dependencies
npm install

# Step 4: Create environment variables
cp .env.example .env.local

# Step 5: Configure your environment variables (see below)

# Step 6: Start the development server
npm run dev
```

The app will be available at http://localhost:8080

### 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration (required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# OpenAI Configuration (optional)
VITE_OPENAI_API_KEY=your_openai_api_key

# Feature Flags
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_MESSAGING=true
VITE_ENABLE_ANALYTICS=false
```

### 🗄️ Database Setup

1. Create a new Supabase project
2. Run the migrations in the `supabase/migrations` folder in order:
   - `001_initial_schema.sql`
   - `002_add_notifications_and_video_sessions.sql`
3. Deploy the Edge Functions from `supabase/functions`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Common Issues & Solutions

1. **"vite: command not found"**
   - Run `npm install` to install dependencies

2. **"Missing required environment variables"**
   - Create `.env.local` file with required Supabase credentials
   - Make sure to copy from `.env.example` and fill in real values

3. **Port 8080 already in use**
   - The app runs on port 8080 by default
   - Either stop the process using port 8080 or modify `vite.config.ts`

## 🏗️ Project Structure

```
pathwaiz-career-clarity/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # Business logic
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── supabase/
│   ├── functions/      # Edge Functions
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9d41d9ba-2e13-420e-86f1-a6feba4d10db) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9d41d9ba-2e13-420e-86f1-a6feba4d10db) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
