# Reclaim Frontend

Modern, responsive frontend for the Reclaim decentralized subscription platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: RainbowKit + Wagmi
- **State Management**: React Query

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=11155111
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/              # Next.js app directory
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   ├── subscribe/   # Subscribe pages
│   ├── creator/     # Creator dashboard
│   └── dashboard/   # User dashboard
├── components/       # Reusable components
├── lib/             # Utilities and contracts
│   ├── contracts.ts # Contract ABIs and helpers
│   ├── types.ts     # TypeScript types
│   └── hooks/       # Custom React hooks
└── utils/           # Helper functions
```

## Features

- Wallet connection with RainbowKit
- Browse and subscribe to creators
- Creator dashboard with analytics
- User subscription management
- Real-time balance tracking
- Transaction status monitoring

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel

```bash
vercel deploy
```

### Build Manually

```bash
npm run build
npm start
```

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md)

## License

MIT

