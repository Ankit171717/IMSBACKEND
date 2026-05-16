# IMS Industrial Machine Solution - Master API Documentation

This document provides a comprehensive list of API endpoints for the User, Engineer, and Admin applications, including exact request payloads (body) for every operation.

---

## 🔒 Global Configuration
- **Base URL:** `https://api.imsindustrial.com/v1`
- **Authentication:** All requests (except public auth) must include a JWT token in the header.
- **Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 📱 PART 1: USER APPLICATION (Client Side)

### 1. Authentication
- `POST /user/auth/send-otp`: Sends OTP to mobile number.
  - *Payload:* `{ "phone": "String" }`
- `POST /user/auth/verify-otp`: Verifies OTP and returns JWT.
  - *Payload:* `{ "phone": "String", "otp": "String" }`
- `POST /user/auth/register`: Completes company/owner profile registration.
  - *Payload:* 
    ```json
    { 
      "companyName": "String", 
      "ownerName": "String", 
      "phone": "String", 
      "address": "String", 
      "pincode": "String", 
      "selectedPostOffice": "String", 
      "district": "String", 
      "state": "String" 
    }
    ```

### 2. Service Discovery (Home)
- `POST /user/engineers/search`: Search for engineers based on Machine Type, Size, and Engineer Type.
  - *Payload:* `{ "machineType": "String", "size": "String", "engineerType": "String", "latitude": "Float", "longitude": "Float" }`
- `GET /user/engineers/{id}`: Get detailed profile of a specific engineer.
  - *Payload:* `{}` (Path parameter: `id`)

### 3. Subscriptions
- `GET /user/subscription/status`: Checks if user can view unmasked engineer numbers.
  - *Payload:* `{}`
- `GET /user/subscription/plans`: Fetches available user subscription plans.
  - *Payload:* `{}`
- `POST /user/subscription/purchase`: Initiates a plan purchase.
  - *Payload:* `{ "planId": "String", "paymentMethod": "String", "transactionId": "String" }`

### 4. Interactions & Logs
- `POST /user/calls/log`: Logs when a user initiates a call to an engineer.
  - *Payload:* `{ "engineerId": "String", "duration": "Int" }`
- `GET /user/calls/history`: Fetches today's and recent call logs for the user.
  - *Payload:* `{}`

---

## 🛠️ PART 2: ENGINEER APPLICATION (Provider Side)

### 1. Authentication & Onboarding (3-Step Process)
- `POST /engineer/auth/send-otp`: Sends OTP to mobile number.
  - *Payload:* `{ "phone": "String" }`
- `POST /engineer/auth/verify-otp`: Verifies OTP and returns JWT.
  - *Payload:* `{ "phone": "String", "otp": "String" }`
- `POST /engineer/auth/register`: Complete 3-step engineer signup process.
  - *Payload:*
    ```json
    {
      "name": "String",
      "phone": "String",
      "email": "String",
      "skills": "String",
      "experience": "String (Years)",
      "visitCharge": "String (₹)",
      "selectedMachines": ["String"],
      "location": "String (City)",
      "address": "String (Full Address)"
    }
    ```

### 2. Service Profile Management
- `GET /engineer/profile`: Fetches current service profile.
  - *Payload:* `{}`
- `PUT /engineer/profile/update`: Updates the engineer's professional profile from the Home screen modal.
  - *Payload:* 
    ```json
    { 
      "skills": "String", 
      "experience": "String (Years)", 
      "visitCharge": "String (₹)", 
      "selectedMachines": ["String"] 
    }
    ```
- `POST /engineer/profile/status`: Toggles active/inactive status (availability for calls).
  - *Payload:* `{ "isOnline": "Boolean" }`

### 3. Job & Call Logs
- `GET /engineer/calls/history`: Fetches logs of users who have called this engineer.
  - *Payload:* `{}`

---

## 🖥️ PART 3: ADMIN PANEL (Management Side)

### 1. Dashboard & Analytics
- `GET /admin/stats/overview`: Total Users, Total Engineers, Total Calls today.
  - *Payload:* `{}`
- `GET /admin/stats/revenue`: Subscription revenue reports.
  - *Payload:* `{}`

### 2. User Management
- `GET /admin/users`: List of all registered companies/users.
  - *Payload:* `{}`
- `GET /admin/users/{id}`: Detailed view of a user's activity and logs.
  - *Payload:* `{}` (Path parameter: `id`)
- `POST /admin/users/{id}/status`: Suspend or activate a user account.
  - *Payload:* `{ "status": "ACTIVE" | "BLOCKED" }`

### 3. Engineer Management (Verification)
- `GET /admin/engineers`: List of all registered engineers (includes pending verification).
  - *Payload:* `{}`
- `GET /admin/engineers/{id}`: View detailed 3-step profile of an engineer.
  - *Payload:* `{}` (Path parameter: `id`)
- `POST /admin/engineers/{id}/verify`: Approve or Reject an engineer's profile for the public list.
  - *Payload:* `{ "status": "VERIFIED" | "REJECTED", "reason": "String (optional)" }`
- `POST /admin/engineers/{id}/premium`: Manually grant premium status or update platform fee.
  - *Payload:* `{ "isPremium": "Boolean", "feePercentage": "Float" }`

### 4. System Configuration
- `POST /admin/config/machines`: Add/Remove machine categories (CNC, Lathe, etc.).
  - *Payload:* `{ "action": "ADD" | "REMOVE", "machineName": "String" }`
- `GET /admin/subscriptions/all`: Manage all active subscription transactions.
  - *Payload:* `{}`
- `POST /admin/notifications/broadcast`: Send FCM push notifications to all Users or Engineers.
  - *Payload:* `{ "target": "USERS" | "ENGINEERS" | "ALL", "title": "String", "body": "String" }`

---

## 📄 Data Models

### User Object
```json
{
  "id": "UUID",
  "companyName": "String",
  "ownerName": "String",
  "phone": "String",
  "pincode": "String",
  "address": "String",
  "city": "String",
  "plan": "String (FREE/PREMIUM)"
}
```

### Engineer Object
```json
{
  "id": "UUID",
  "name": "String",
  "phone": "String",
  "email": "String",
  "skills": "String",
  "experience": "Int",
  "visitCharge": "Int",
  "selectedMachines": ["String"],
  "location": "String (City)",
  "address": "String (Full Address)",
  "isOnline": "Boolean",
  "isVerified": "Boolean",
  "rating": "Float"
}
```
