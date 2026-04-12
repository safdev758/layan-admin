# 🔐 Admin Dashboard Credentials

## Login Information

```
Email:    admin@layan.com
Password: Admin@123
```

## Access URLs

- **Dashboard**: http://localhost:4200
- **Backend API**: http://localhost:3000

## What's Been Fixed

### ✅ No More Hardcoded Data
- Dashboard stats are now fetched from the backend API (`/api/v1/admin/stats`)
- User list is fetched from the backend API (`/api/v1/admin/users`)
- All data is dynamic and real-time

### ✅ Clean Authentication Flow
- Only login page shows when not authenticated
- No sidebar/header visible until logged in
- Proper route guards protect all admin routes

### ✅ Backend API Endpoints
- `GET /api/v1/admin/stats` - Dashboard statistics
- `GET /api/v1/admin/users` - List all users with pagination
- `PATCH /api/v1/admin/users/:id/status` - Update user status

## Features

1. **Dynamic Dashboard**
   - Real user count from database
   - Real order count from database
   - Real revenue calculation from database
   - Loading states
   - Error handling

2. **User Management**
   - List all users from database
   - Filter by role
   - Search by name/email
   - Update user status (Active/Suspended/Pending)
   - Pagination support

3. **Secure Authentication**
   - JWT token-based authentication
   - Auto-logout on 401 errors
   - Token stored in localStorage
   - HTTP interceptor adds token to all requests

## Testing

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd dashboard/admin-dashboard && npm start`
3. Open http://localhost:4200
4. Login with credentials above
5. See real data from your database!

---

**All data is now dynamic - no hardcoded values!** 🎉
