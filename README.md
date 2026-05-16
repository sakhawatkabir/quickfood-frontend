# QuickFood

A full-stack food delivery platform built with Next.js, featuring restaurant management, menu ordering, real-time order tracking, and an admin dashboard with analytics.

## Features

### Customer
- Browse restaurants and menus
- Add items to cart and place orders
- Order tracking with status updates
- User profile management
- Search restaurants and menu items

### Restaurant Owner
- Dashboard with revenue and order analytics (Recharts)
- Manage restaurants (create, edit, delete)
- Manage menu items with image uploads (Cloudinary)
- View and update order status

### Admin
- Overview dashboard with stats, charts, and recent activity
- User management with role assignment
- Order management with status updates and item details
- Restaurant and menu item management
- Revenue and order analytics

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| UI | shadcn/ui, Tailwind CSS, Lucide Icons |
| Charts | Recharts |
| State | TanStack React Query v5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (jose) |
| Images | Cloudinary |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/sakhawatkabir/quickfood.git
cd quickfood

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/quickfood"
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── admin/              # Admin dashboard
│   ├── users/          # User management
│   ├── orders/         # Order management
│   ├── restaurants/    # Restaurant management
│   └── menu-items/     # Menu item management
├── api/                # API routes
│   ├── admin/          # Admin endpoints
│   ├── users/          # Auth & profile
│   └── ...
├── dashboard/          # Restaurant owner dashboard
│   ├── restaurants/    # Restaurant CRUD
│   ├── menu-items/     # Menu item CRUD
│   └── orders/         # Order management
├── (public)/           # Public pages
│   ├── restaurants/    # Browse restaurants
│   ├── menu-items/     # Browse menu
│   └── cart/           # Shopping cart
components/
├── ui/                 # shadcn/ui components
lib/
├── api.js              # Client-side API functions
├── auth.js             # Auth middleware
├── prisma.js           # Prisma client
└── utils.js            # Utility functions
prisma/
└── schema.prisma       # Database schema
```

## Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

This application can be deployed to Vercel or any hosting service that supports Next.js.
