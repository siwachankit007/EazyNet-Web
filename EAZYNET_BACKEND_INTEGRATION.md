# EazyNet Backend Integration

This document explains how the EazyNet frontend has been integrated with your custom backend instead of using Supabase directly.

## Overview

The integration replaces Supabase authentication with your EazyNet backend endpoints while maintaining the existing UI and user experience. Google OAuth continues to work through Supabase as before.

## Backend Endpoints

Your backend should implement these endpoints:

### Authentication
- `POST /api/Auth/login` - User login
- `POST /api/Auth/register` - User registration  
- `POST /api/Auth/refresh` - Token refresh
- `POST /api/Auth/logout` - User logout (requires auth)

### User Management
- `GET /api/User/profile` - Get user profile (requires auth)
- `PUT /api/User/profile` - Update user profile (requires auth)

## Expected Response Format

### Auth Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "fullName": "User Name"
    }
  }
}
```

### Profile Response
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "fullName": "User Name",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

## Frontend Changes

### 1. EazyNet API Client (`src/lib/eazynet-api.ts`)
- Handles all API communication with your backend
- Manages JWT tokens and refresh logic
- Provides type-safe interfaces for all endpoints

### 2. Auth Context (`src/lib/auth-context.tsx`)
- Updated to work with EazyNet user/session types
- Removed Supabase-specific logic
- Added `updateAuthState` function for manual auth state updates

### 3. Auth Form (`src/components/auth-form.tsx`)
- Login/register now use your backend endpoints
- Google OAuth continues to work through Supabase
- Uses Toastify for consistent notifications

### 4. Auth Utils (`src/lib/auth-utils.ts`)
- Simplified to work with your backend
- Placeholder functions for future backend implementations

### 5. Profile Page (`src/app/profile/page.tsx`)
- Profile updates now use your backend
- Password change temporarily disabled (needs backend endpoint)
- Date fields simplified until backend provides them

## Environment Configuration

Add to your `.env.local`:

```bash
NEXT_PUBLIC_EAZYNET_API_URL=https://localhost:7061
```

## Testing the Integration

1. Start your backend on `https://localhost:7061`
2. Ensure CORS is properly configured
3. Test login/register flows
4. Verify profile updates work
5. Check token refresh functionality

## Next Steps

### Backend Implementation Needed
- [ ] Password change endpoint
- [ ] User activity tracking
- [ ] Additional user metadata fields

### Frontend Enhancements
- [ ] Real-time auth state updates (WebSocket/polling)
- [ ] Better error handling for network issues
- [ ] Offline support for cached user data

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure your backend allows requests from `http://localhost:3000`
2. **HTTPS issues**: Your backend uses HTTPS, ensure certificates are valid
3. **Token format**: Ensure JWT tokens are properly formatted and signed
4. **Response format**: Verify all responses match the expected interface

### Debug Mode
Set `NODE_ENV=development` to see detailed logging in the browser console.

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Refresh tokens are automatically handled
- All API requests include proper Authorization headers
- Token expiration and refresh logic is implemented

## Migration from Supabase

The integration maintains the same user experience while switching backends:
- User registration and login flows remain identical
- Profile management works the same way
- Authentication state is preserved
- Route protection continues to work

Google OAuth users can continue using the service as before through Supabase.
