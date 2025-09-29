# Authentication Guide

## Overview
This guide explains how authentication works in the MantraSetu frontend application and how to properly set up and use the authentication system.

## Authentication Flow

### 1. Initial App Load
- When the app loads, it checks for existing tokens in localStorage
- If tokens exist, it validates them by calling the backend API
- If validation fails, tokens are cleared and user is redirected to login

### 2. Login Process
1. User enters credentials on `/login` page
2. Frontend calls `authAPI.login()` with credentials
3. Backend returns user data and tokens (access + refresh)
4. Tokens are stored in localStorage and Redux store
5. User is redirected to `/dashboard`

### 3. Registration Process
1. User fills registration form on `/register` page
2. Frontend calls `authAPI.register()` with user data
3. Backend creates user account and returns tokens
4. User is automatically logged in and redirected to `/dashboard`

### 4. Protected Routes
- Routes like `/dashboard` and `/bookings` require authentication
- `ProtectedRoute` component checks authentication status
- Unauthenticated users are redirected to `/login`
- Authenticated users trying to access `/login` or `/register` are redirected to `/dashboard`

### 5. Token Management
- Access tokens are included in API requests via axios interceptors
- When access token expires (401 response), refresh token is used automatically
- If refresh fails, user is logged out and redirected to login
- Tokens are cleared on logout

## API Integration

### Backend Connection
The frontend connects to the backend API at `http://localhost:3000/api/v1` (configurable via `REACT_APP_API_URL`).

### Available API Endpoints
- **Authentication**: `/auth/login`, `/auth/register`, `/auth/refresh`
- **Users**: `/users/profile`, `/users/bookings`
- **Bookings**: `/bookings`, `/bookings/search`
- **Services**: `/services/search`, `/services/categories`
- **Pandits**: `/pandits/search`, `/pandits/available`

### Error Handling
- API errors are handled gracefully with user-friendly messages
- Network errors show retry options
- Authentication errors trigger automatic logout

## Running the Application

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 3000

### Setup
1. Copy environment file:
   ```bash
   cp env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

### Environment Variables
Key environment variables:
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:3000/api/v1)
- `REACT_APP_ENABLE_DEBUG`: Enable debug logging
- `REACT_APP_ENABLE_ANALYTICS`: Enable analytics tracking

## User Experience

### For Unauthenticated Users
- Can access: `/`, `/services`, `/contact`, `/login`, `/register`
- Cannot access: `/dashboard`, `/bookings`
- Attempting to access protected routes redirects to login

### For Authenticated Users
- Can access all routes
- Accessing `/login` or `/register` redirects to `/dashboard`
- User information displayed in header
- Logout functionality available

## Security Features

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Automatic Refresh**: Seamless token refresh without user intervention
3. **Route Protection**: Client-side route protection with server-side validation
4. **Error Handling**: Graceful handling of authentication failures
5. **Logout**: Complete token cleanup on logout

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **Token Expiry**: Check if refresh token endpoint is working
3. **API Connection**: Verify backend is running and accessible
4. **Environment Variables**: Ensure `.env` file is properly configured

### Debug Mode
Set `REACT_APP_ENABLE_DEBUG=true` in `.env` to enable detailed logging.

## Production Considerations

1. **HTTPS**: Use HTTPS in production
2. **Token Security**: Consider httpOnly cookies for token storage
3. **Environment Variables**: Use secure environment variable management
4. **Error Tracking**: Implement error tracking (Sentry, etc.)
5. **Analytics**: Enable analytics for user behavior tracking
