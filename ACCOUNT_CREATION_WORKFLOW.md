# Account Creation Workflow

## Current Registration Flow

### 1. Frontend (Login.js)
- User fills out registration form with:
  - Username
  - Email
  - Password
- Form submits to: `POST /api/users/register`
- Error handling displays validation messages

### 2. Backend Route (userRoutes.js)
```
POST /api/users/register
  ↓
validateRegister middleware (validates input)
  ↓
register controller (creates user)
```

### 3. Validation Rules (validation.js)

**Username Requirements:**
- Must be between 3 and 30 characters
- Can only contain: letters (a-z, A-Z), numbers (0-9), and underscores (_)
- No spaces or special characters allowed

**Email Requirements:**
- Must be a valid email format
- Automatically normalized (lowercase)

**Password Requirements:**
- Must be at least 6 characters long
- **Must contain at least one uppercase letter (A-Z)**
- **Must contain at least one lowercase letter (a-z)**
- **Must contain at least one number (0-9)**

### 4. Controller (userController.js)
- Checks if email already exists
- Checks if username already exists
- Creates new user
- Hashes password
- Saves to database
- Returns success with JWT token

### 5. Error Handling
- Validation errors: Returns 400 with error messages
- Duplicate email/username: Returns 400 with specific message
- Server errors: Returns 500 with error message

## Common Issues

### Password Validation Failures
The password validation is **strict**. Common mistakes:
- ❌ `password` - missing uppercase and number
- ❌ `Password` - missing number
- ❌ `password123` - missing uppercase
- ✅ `Password123` - meets all requirements

### Username Validation Failures
- ❌ `user name` - contains space
- ❌ `user@name` - contains special character
- ✅ `user_name` - valid
- ✅ `username123` - valid

## Example Valid Registration
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "param": "password",
      "location": "body"
    }
  ]
}
```

