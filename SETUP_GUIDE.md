# Admin Dashboard Setup Guide

## Overview
This is a simplified admin dashboard for the LAYAN e-commerce platform. The dashboard provides a clean authentication flow and admin management interface.

## Application Flow

### 1. Login Page (`/login`)
- **Route**: `/login`
- **Component**: `LoginComponent`
- **Purpose**: Authenticate admin users
- **Features**:
  - Email and password authentication
  - Connects to backend API at `/api/v1/auth/login`
  - Validates user has ADMIN role
  - Stores JWT token in localStorage
  - Redirects to dashboard on successful login

### 2. Dashboard (`/dashboard`)
- **Route**: `/dashboard`
- **Component**: `AdminLayoutComponent` with `OverviewComponent`
- **Purpose**: Main admin interface
- **Features**:
  - Protected by authentication guard
  - Displays statistics and metrics
  - Recent activity feed
  - Navigation sidebar
  - User profile menu

### 3. User Management (`/dashboard/users`)
- **Route**: `/dashboard/users`
- **Component**: `UsersListComponent`
- **Purpose**: Manage platform users
- **Features**:
  - List all users with pagination
  - Filter by role (Customer, Supermarket, Driver, Admin)
  - Update user status (Active, Suspended, Pending)
  - Search functionality

## Architecture

### Authentication Flow
1. User visits any route
2. Auth guard checks for valid token
3. If no token → redirect to `/login`
4. User enters credentials
5. Backend validates and returns JWT token
6. Token stored in localStorage
7. User redirected to `/dashboard`
8. All API requests include JWT token via HTTP interceptor

### Key Components

#### Services
- **AuthService** (`src/app/services/auth.service.ts`)
  - Handles login/logout
  - Manages user state
  - Token management
  - Role-based access control

- **AdminService** (`src/app/services/admin.service.ts`)
  - User management API calls
  - List users with filters
  - Update user status

#### Guards
- **authGuard** - Protects dashboard routes
- **publicRouteGuard** - Redirects logged-in users away from login

#### Interceptors
- **authInterceptor** - Adds JWT token to all API requests
- Handles 401 unauthorized responses

### Layout Components
- **AdminLayoutComponent** - Main dashboard wrapper with sidebar and header
- **HeaderComponent** - Top navigation with user menu and notifications
- **SidebarComponent** - Navigation menu with dashboard sections

## Backend Integration

### API Endpoints Used
```
POST /api/v1/auth/login
  Body: { email, password }
  Response: { token, user: { id, name, email, role, status } }

GET /api/v1/admin/users
  Headers: Authorization: Bearer <token>
  Query: page, limit, role, q
  Response: { users: [], pagination: {} }

PATCH /api/v1/admin/users/:id/status
  Headers: Authorization: Bearer <token>
  Body: { status, durationDays? }
  Response: { message, user }
```

### Environment Configuration
- **Development**: `src/environments/environment.ts`
  - API URL: `http://localhost:3000/api/v1`
- **Production**: `src/environments/environment.prod.ts`
  - Update with production API URL

## Running the Application

### Prerequisites
1. Node.js installed
2. Backend API running on `http://localhost:3000`
3. Admin user created in database

### Start Development Server
```bash
cd dashboard/admin-dashboard
npm install
npm start
```

The application will be available at `http://localhost:4200`

### Default Login
Use an admin account from your backend database:
- Email: admin@example.com
- Password: (your admin password)

## Project Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── login.component.ts
│   │   └── login.component.html
│   ├── components/
│   │   ├── header/
│   │   └── sidebar/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── layouts/
│   │   └── admin-layout/
│   ├── pages/
│   │   ├── dashboard/
│   │   │   └── overview/
│   │   └── users/
│   │       └── users-list/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── admin.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.css
```

## Features Implemented

### ✅ Authentication
- Login page with form validation
- JWT token management
- Auto-redirect based on auth status
- Logout functionality
- Role-based access (ADMIN only)

### ✅ Dashboard
- Overview with statistics cards
- Recent activity feed
- Responsive layout
- Modern UI with Tailwind CSS

### ✅ User Management
- List all users
- Filter by role
- Search functionality
- Update user status
- Pagination support

### ✅ Security
- Protected routes with guards
- HTTP interceptor for token injection
- Automatic logout on 401 errors
- Secure token storage

## Next Steps

### To Add More Features:
1. **Products Management** - Create, edit, delete products
2. **Categories Management** - Manage product categories
3. **Orders Management** - View and manage orders
4. **Settings** - System configuration
5. **Analytics** - Charts and reports

### To Extend:
1. Add more dashboard routes in `app.routes.ts`
2. Create corresponding components
3. Add services for API integration
4. Update sidebar navigation

## Troubleshooting

### Login Issues
- Ensure backend is running
- Check API URL in `environment.ts`
- Verify admin user exists in database
- Check browser console for errors

### Token Issues
- Clear localStorage and try again
- Check token expiration in backend
- Verify JWT secret matches backend

### CORS Issues
- Ensure backend allows requests from `http://localhost:4200`
- Check backend CORS configuration

## Support
For issues or questions, check the backend README or contact the development team.
