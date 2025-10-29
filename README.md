# Next.js + Better Auth + RBAC Template

A production-ready Next.js template with role-based access control (RBAC), featuring Better Auth for authentication and a comprehensive admin panel.

## Features

- 🔐 **Authentication**: Email/password authentication with Better Auth
- 👥 **RBAC System**: Advanced role-based access control with permission inheritance
- 🎨 **Modern UI**: Built with Radix UI themes and beautiful dark mode
- 📊 **Admin Panel**: Full-featured admin dashboard for managing users, roles, and permissions
- 📧 **Email Integration**: Password reset functionality with Resend
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- ⚡ **Fast**: Built on Next.js 15 with App Router and React 19

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Resend API key (for email functionality)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

Create a `.env` file in the root directory with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Resend Email Service
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

3. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed initial data (roles, permissions, admin user)
npm run seed
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## RBAC System

### Default Roles

- **admin**: Full system access with all permissions
- **user**: Basic user with limited access

### Default Permissions

- `manage_users`: Create, update, delete users and assign roles
- `manage_roles`: Create, update, delete roles and configure hierarchy
- `manage_permissions`: Create, update, delete permissions and assign to roles

### Role Hierarchy

Roles support parent-child relationships for permission inheritance. Child roles automatically inherit all permissions from their parent roles.

## Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard routes
│   │   ├── admin/          # Admin panel for RBAC management
│   │   │   ├── users/      # User management
│   │   │   ├── roles/      # Role management
│   │   │   └── permissions/# Permission management
│   │   └── page.tsx        # Main dashboard
│   ├── api/auth/           # Better Auth API routes
│   └── page.tsx            # Public login/register page
├── components/
│   ├── admin/              # Admin panel components
│   ├── Auth.tsx            # Login/register component
│   └── LogoutButton.tsx    # Logout functionality
├── lib/
│   ├── access.ts           # Access control utilities
│   ├── admin-actions.ts    # Server actions for admin operations
│   ├── auth.ts             # Better Auth configuration
│   ├── auth-client.ts      # Client-side auth utilities
│   └── actions.ts          # Password reset & email actions
└── middleware.ts           # Route protection middleware
```

## Admin Panel

Access the admin panel at `/dashboard/admin` (requires appropriate permissions).

### User Management

- View all users with their assigned roles
- Assign or remove roles from users
- View user details and verification status

### Role Management

- Create, update, and delete roles
- Set role hierarchy (parent roles)
- Assign permissions to roles
- View user count per role

### Permission Management

- Create and delete permissions
- View which roles have which permissions
- Manage permission assignments

## Database Schema

The template uses Prisma with PostgreSQL and includes models for:

- **User**: User accounts with authentication
- **Role**: User roles with hierarchy support
- **Permission**: Granular permissions
- **UserRole**: User-to-role assignments
- **RolePermission**: Role-to-permission assignments
- **Session**: User sessions
- **Account**: OAuth and credential accounts
- **Verification**: Email verification tokens

## Security

- Server-side session validation on all protected routes
- Permission checks on all admin actions
- Prepared statements via Prisma (SQL injection protection)
- Secure password hashing via Better Auth
- CSRF protection built into Better Auth

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Radix UI Documentation](https://www.radix-ui.com/themes/docs)

## License

MIT
