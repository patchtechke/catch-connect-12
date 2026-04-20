# MarineCatch Africa - Seafood Supply Chain Platform

## Overview

MarineCatch Africa is a web-based platform designed to revolutionize Africa's seafood supply chain. It connects small-scale fishers directly with buyers, leveraging blockchain, IoT integration, and embedded finance to ensure fair pricing, supply chain transparency, and financial inclusion for fishing communities across Africa's 38 coastal and island nations. The platform offers a marketplace and traceability system, enabling fishers to log catches via mobile apps, buyers to purchase verified seafood, and secure payments through smart contracts. The project aims to initially pilot with 1,500+ fishers in Eastern Africa before scaling continent-wide.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The project utilizes a fullstack architecture, featuring an Express.js backend and a React frontend.

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for building and development
- Wouter for client-side routing
- TanStack Query for server state management
- Tailwind CSS with a Material Design-inspired color system
- shadcn/ui components built on Radix UI

**Design System:**
- Custom HSL-based color palette (ocean blue, coral red, teal, green)
- Gradient utilities for visual depth
- Shadow system for elevation
- Responsive design with mobile-first breakpoints

**Key Features:**
- Single-page application with section-based navigation
- Interactive Google Maps integration for Large Marine Ecosystems
- Video background in hero section
- Waitlist signup form
- Responsive mobile menu
- WhatsApp chat integration
- Role-based dashboards for Fishers, Buyers, and Admins

**Routing Strategy:**
Hash-based navigation for the main page and dedicated routes for:
- User authentication (`/login`, `/register`, `/forgot-password`, `/reset-password`)
- Fisher portal (`/fisher/*` for catches, orders, analytics, earnings, settings)
- Buyer portal (`/buyer/*` for marketplace, orders, favorites, history, settings)
- Admin portal (`/admin/*` for users, fishers, buyers, orders, catches, reports, settings)
- Legal pages (`/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/faq`)

### Backend Architecture

**Technology Stack:**
- Express.js server
- TypeScript
- Supabase (self-hosted) for authentication and database
- JWT-based authentication with role-based access control
- Vite middleware for HMR in development

**API Endpoints:**
- **Public:** Register, Login, Logout, Session, Health check.
- **Fisher (authenticated):** Profile management, catch listings (CRUD), orders for fisher's catches, order status updates, statistics.
- **Buyer (authenticated):** Profile management, marketplace browsing, order creation, order tracking, order cancellation, statistics.
- **Admin (authenticated):** Platform statistics, user management (list, status update), fisher/buyer verification, order management.

**Data Storage:**
- Supabase (self-hosted) provides user authentication, PostgreSQL database, and Row-Level Security.
- Database schema includes `users`, `fisher_profiles`, `buyer_profiles`, `catches`, and `orders` tables.
- `shared/schema.ts` defines TypeScript interfaces and Zod validation schemas.

**Authentication & Authorization:**
- JWT-based authentication with Supabase for user registration, login, and session management.
- Role-based access control (fisher, buyer, admin) enforced via middleware.
- Password requirements: minimum 8 characters.

### Development & Build Process
- Client build: Vite compiles React app to `dist/public`.
- Server build: TypeScript compiles server code to `dist/`.
- Path aliases are used for cleaner imports (`@/*`, `@shared/*`, `@assets/*`).
- Error handling includes client-side 404s and server-side global JSON error formatting.

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Unstyled, accessible component primitives.
- **shadcn/ui**: Component library built on Radix UI.
- **Lucide React**: Icon library.
- **embla-carousel-react**: Carousel functionality.
- **cmdk**: Command palette component.
- **vaul**: Drawer component.
- **input-otp**: One-time password input component.

### Form Management
- **react-hook-form**: Form state management and validation.
- **@hookform/resolvers**: Validation resolver integration.
- **zod**: Schema validation.

### Backend Libraries
- **@supabase/supabase-js**: Supabase client for authentication and database interaction.

### Utilities
- **class-variance-authority**: Type-safe variant styling.
- **clsx** & **tailwind-merge**: Conditional className utilities.
- **date-fns**: Date formatting and manipulation.

### Development Tools
- **TypeScript**: Static type checking.
- **ESLint**: Code linting.
- **Vite**: Build tool and dev server.
- **PostCSS**: CSS processing.
- **tsx**: TypeScript execution for development server.

### External Services
- **Supabase (Self-Hosted):** For authentication and PostgreSQL database, configured via environment variables.
- **EspoCRM:** Integrates with the waitlist form, with a fallback to local storage. Configured via environment variables.
- **Google Maps API:** Used for displaying interactive maps of Large Marine Ecosystems with API Key embedded in client code.

### Email & Social Integration
- Newsletter form submission to EspoCRM.
- WhatsApp chat button for support.
- Social media links (Facebook, Twitter, LinkedIn, Instagram).
- OpenGraph and Twitter Card meta tags for social sharing.

## Recent Changes

### December 4, 2025
- **Admin Panel with Sidebar Navigation:** Built a comprehensive admin panel following the same sidebar pattern as fisher and buyer panels.
  - Created `AdminSidebar` component with collapsible menu sections (Management, Reports, Account).
  - Created `AdminLayout` component with breadcrumb navigation.
  - Built 8 admin pages: AdminOverview, AdminUsers, AdminFishers, AdminBuyers, AdminOrders, AdminCatches, AdminReports, AdminSettings.
  - Added all admin routes to App.tsx (`/admin`, `/admin/users`, `/admin/fishers`, `/admin/buyers`, `/admin/orders`, `/admin/catches`, `/admin/reports`, `/admin/settings` with sub-routes).
- **Removed "Chat with us" Button:** Removed the WhatsApp floating chat button from all panels for a cleaner UI.
- **Fixed Login Page React Hook Error:** Moved redirect logic inside `useEffect` to prevent "Cannot update a component while rendering" warning.
- **Password Reset Feature:** Implemented forgot password and reset password functionality using Supabase's built-in email service.
  - Added `/api/auth/forgot-password` endpoint to send password reset emails.
  - Added `/api/auth/reset-password` endpoint to update password with token.
  - Created `/forgot-password` page for users to request password reset.
  - Created `/reset-password` page to enter new password (accessed via email link).
  - Added "Forgot password?" link on login page.
  - Added admin ability to send password reset emails to users via Admin Dashboard.
  - New admin endpoint: `POST /api/admin/users/:id/send-password-reset`.
- **Supabase Connection Fix:** Updated `server/supabase.ts` to read environment variables dynamically via getter functions instead of at module load time. This ensures Supabase credentials are properly available when the server starts. The health endpoint now correctly reports `configured: true` and `connected: true`.
- **Marketplace Table View:** Updated `BuyerMarketplace.tsx` to display catches in a tabular format instead of card grid. The table includes columns for Species, Fisher, Quality, Quantity, Price, Location, Status, and Actions (Order/Favorite buttons).
- **Quality Filter Fix:** Added quality filtering support to the `/api/buyer/marketplace` endpoint to ensure the quality dropdown filter works correctly.
- **Personalized Dashboard Greetings:** Added time-based personalized greetings to all dashboards (Fisher, Buyer, Admin) that display "Good Morning/Afternoon/Evening, {firstName}!" based on the user's local time and their first name from the database.
- **Image Upload for Catches:** Replaced URL-based image input with camera capture and file upload:
  - Added `/api/upload` endpoint with multer for handling file uploads (authenticated, 5MB limit)
  - Added "Take Photo" button for camera capture on mobile devices (uses `capture="environment"`)
  - Added "Upload from Device" button for selecting images from file system
  - Images are stored in `/uploads` directory and served statically
  - Removed temperature and humidity fields (not supported in database schema)
- **Fisher Profile Edit Page:** Created comprehensive profile editing page at `/fisher/settings/profile`:
  - Boat information: boat name, boat type, license number, catch capacity
  - Fishing details: fishing zone, years of experience
  - Location: country, region, port
  - About: bio/description field
  - All fields load existing profile data and update via API
- **Fixed Fisher Profile Not Found Errors:** Updated fisher and buyer backend routes to handle missing profiles gracefully:
  - GET `/api/fisher/catches`, `/api/fisher/orders`, `/api/fisher/stats` now return empty data instead of 404 when profile doesn't exist
  - GET `/api/buyer/orders`, `/api/buyer/stats` similarly return empty data for missing profiles
  - POST `/api/fisher/catches` now auto-creates a fisher profile with default country if one doesn't exist
  - This allows new fishers to immediately start adding catches without first completing their profile
- **Fixed Fisher Profile Update:** Fixed "Failed to update profile" error by adding proper Authorization headers to the profile fetch query. The default queryFn didn't include authentication headers, causing 401 errors.
- **Expanded Fisher Profile Page:** Enhanced the profile page with a header section showing:
  - User avatar with initials fallback
  - Full name with verification badge (when verified)
  - Email and phone number display
  - Member since date
  - Rating display (when available)
  - Total catches posted badge
- **Profile Read-Only Mode with Edit Toggle:** Profile page is now read-only by default with an "Edit Profile" button:
  - Profile displays all fields in a clean, formatted read-only view
  - "Edit Profile" button toggles into edit mode
  - Cancel button reverts changes and exits edit mode
  - Successful save automatically exits edit mode
  - Removed width constraints to expand profile to full page
  - Reorganized layout with 2-column grid for better use of space
- **Fisher Catch Management with View/Edit/Delete:** Enhanced the Catches page with full CRUD dialogs:
  - View Dialog: Shows all catch details including images, quantity, price, quality, location, catch date, and description
  - Edit Dialog: Full form to update all catch fields including species, quantity, price, quality, location, date, description, and image uploads with camera capture support
  - Delete Dialog: Confirmation dialog before deleting a catch
  - Fixed image upload authentication by adding Authorization header to fetch requests
  - Added GET `/api/fisher/catches/:id` endpoint to fetch single catch details
- **Buyer Rating System:** Buyers can now rate fishers after orders are delivered:
  - Added rating schema in `shared/schema.ts` with orderId, rating (1-5), and optional comment
  - Added POST `/api/buyer/ratings` endpoint to submit ratings (validates order is delivered, prevents duplicate ratings)
  - Added GET `/api/buyer/ratings/:orderId` endpoint to check if order has been rated
  - Rating submission automatically updates fisher's average rating in their profile
  - BuyerOrders page now shows "Rate" button for delivered orders that haven't been rated
  - Star rating interface with hover effects and rating labels (Poor, Fair, Good, Very Good, Excellent)
  - Optional comment field for additional feedback