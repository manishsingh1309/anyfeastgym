# AnyFeast Gym Portal

A full-stack gym management portal for UFC AnyFeast — supporting Trainer, Owner, Member, and Super Admin roles.

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** for animations
- **Recharts** for analytics charts
- **Supabase** for backend (auth, database, edge functions)
- **React Router v6** for client-side routing

## Getting Started

```sh
# 1. Clone the repo
git clone https://github.com/manishsingh1309/anyfeastgym.git

# 2. Navigate into the project
cd anyfeastgym

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

## Demo Credentials (Mock Auth)

| Role | Phone | OTP |
|------|-------|-----|
| Trainer | `9999999999` | `123456` |
| Gym Owner | `8888888888` | `123456` |
| Member | `7777777777` | `123456` |
| Super Admin | `6666666666` | `123456` |

Google sign-in is also available via the mock account picker on the login page.

## Project Structure

```
src/
  contexts/       # AuthContext — mock auth with localStorage
  pages/
    admin/        # Super Admin portal
    owner/        # Gym Owner portal (incl. Analytics)
    trainer/      # Trainer portal
    member/       # Member portal
  components/     # Shared UI components (DashboardLayout, StatCard, etc.)
  data/           # Mock data for analytics charts
```

## Build

```sh
npm run build
```

## Deploy

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).
