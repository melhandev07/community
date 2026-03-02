# 📊 Sample Data & API Reference

Complete guide with sample data, API endpoints, and usage examples.

---

## 🎯 Sample Data to Add to Google Sheets

### 1. Users Sheet - Sample Users

Add these after creating the Users sheet:

```
id                    | name           | phone            | email              | address           | passwordHash
ID_USR_001           | Alice Johnson  | +1-555-0101      | alice@email.com    | 123 Oak St        | [hashed_pwd]
ID_USR_002           | Bob Williams   | +1-555-0102      | bob@email.com      | 456 Pine St       | [hashed_pwd]
ID_USR_003           | Carol Smith    | +1-555-0103      | carol@email.com    | 789 Elm Ave       | [hashed_pwd]
```

**Note:** Passwords will be hashed when users sign up. Leave the last column empty or populate with hashed values later.

---

### 2. Leaders Sheet - Sample Leaders

Add these complete rows with proper formatting:

```
id           | name            | title                  | photoURL                                                    | description
ID_LDR_001  | John Smith      | Community President    | https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400 | John has been leading our community for 5 years with dedication and vision. He believes in the power of unity and collective growth.
ID_LDR_002  | Sarah Johnson   | Finance Manager        | https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400 | Sarah manages our finances with transparency and accountability. She ensures every dollar is spent wisely for community benefit.
ID_LDR_003  | Michael Brown   | Event Coordinator      | https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400 | Michael organizes community events that bring us all together. From celebrations to fundraisers, he creates memorable experiences.
ID_LDR_004  | Maria Garcia    | Education Lead         | https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400 | Maria leads our education initiatives and youth programs. She's passionate about empowering the next generation.
ID_LDR_005  | David Lee       | Health & Wellness      | https://images.unsplash.com/photo-1570295676322-adf46c3a0e3e?w=400 | David coordinates health programs and wellness activities. His goal is to ensure our community stays healthy and strong.
```

**Photo URL Sources (Free):**
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

---

### 3. Donations Sheet - Sample Donations

Create sample donation records:

```
id            | userEmail       | month      | status
ID_DON_001   | alice@email.com | January    | paid
ID_DON_002   | alice@email.com | February   | paid
ID_DON_003   | alice@email.com | March      | pending
ID_DON_004   | bob@email.com   | January    | paid
ID_DON_005   | bob@email.com   | February   | unpaid
ID_DON_006   | carol@email.com | January    | paid
ID_DON_007   | carol@email.com | February   | paid
ID_DON_008   | carol@email.com | March      | paid
```

**Status Values:**
- `paid` → Displayed as "✓ Paid" with green badge
- `pending` → Displayed as "⏳ Pending" with yellow badge
- `unpaid` → Displayed as "✗ Unpaid" with red badge

---

### 4. Messages Sheet - Sample Messages

Add sample messages:

```
id            | name          | phone       | address         | message                              | timestamp                | read
ID_MSG_001   | Chris Davis   | 555-1234    | 100 Main St      | Thank you for your support!         | 2024-01-15T10:30:00Z    | false
ID_MSG_002   | Emma Wilson   | 555-5678    | 200 Oak Ave      | Great community spirit!             | 2024-01-14T14:22:00Z    | true
ID_MSG_003   | Frank Moore   | 555-9012    | 300 Pine Rd      | Can we organize more events?        | 2024-01-13T09:15:00Z    | false
```

---

## 🔌 Complete API Reference

### Base Configuration
```
Method: POST
Content-Type: application/json
URL: {GAS_URL}?endpoint={endpoint}
```

---

## 🔐 Authentication Endpoints

### 1. User Signup
**Endpoint:** `/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@email.com",
  "phone": "+1-234-567-8900",
  "address": "123 Main Street, City, State",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

**Validation Rules:**
- Email must be unique
- Password minimum 8 characters (recommended)
- All fields required
- Phone format: any valid format

---

### 2. User Login
**Endpoint:** `/login`

**Request:**
```json
{
  "email": "john@email.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "email": "john@email.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid password"
}
```

**Admin Login (Hardcoded):**
```json
{
  "email": "community@gmail.com",
  "password": "admin@community"
}
```

---

## 👥 Leaders Endpoints

### 3. Get All Leaders
**Endpoint:** `/leaders/get`

**Request:**
```json
{}
```

**Success Response:**
```json
{
  "success": true,
  "leaders": [
    {
      "id": "ID_LDR_001",
      "name": "John Smith",
      "title": "Community President",
      "photoURL": "https://...",
      "description": "John has been leading..."
    }
  ]
}
```

---

### 4. Create Leader (Admin Only)
**Endpoint:** `/leaders/create`

**Request:**
```json
{
  "name": "New Leader Name",
  "title": "Leadership Title",
  "photoURL": "https://example.com/photo.jpg",
  "description": "Detailed description of the leader and their role..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Leader created",
  "id": "ID_LDR_006"
}
```

---

### 5. Update Leader (Admin Only)
**Endpoint:** `/leaders/update`

**Request:**
```json
{
  "id": "ID_LDR_001",
  "name": "Updated Name",
  "title": "Updated Title",
  "photoURL": "https://new-photo-url.com/photo.jpg",
  "description": "Updated description..."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Leader updated"
}
```

---

### 6. Delete Leader (Admin Only)
**Endpoint:** `/leaders/delete`

**Request:**
```json
{
  "id": "ID_LDR_001"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Leader deleted"
}
```

---

## 💰 Donations Endpoints

### 7. Get Donations
**Endpoint:** `/donations/get`

**For User:**
```json
{
  "email": "john@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "donations": [
    {
      "id": "ID_DON_001",
      "email": "john@email.com",
      "month": "January",
      "status": "paid"
    },
    {
      "id": "ID_DON_002",
      "email": "john@email.com",
      "month": "February",
      "status": "pending"
    }
  ]
}
```

**For Admin (all donations):**
```json
{
  "allRecords": true
}
```

---

### 8. Update Donation Status (Admin Only)
**Endpoint:** `/donations/update`

**Request:**
```json
{
  "id": "ID_DON_001",
  "status": "paid"
}
```

**Valid Status Values:**
- `paid` - Payment received
- `pending` - Awaiting confirmation
- `unpaid` - Not yet paid

**Success Response:**
```json
{
  "success": true,
  "message": "Donation updated"
}
```

---

## 💬 Messages Endpoints

### 9. Create Message
**Endpoint:** `/messages/create`

**Request:**
```json
{
  "name": "John Visitor",
  "phone": "+1-555-0001",
  "address": "123 Visitor Street",
  "message": "I would like to join the community. Please let me know how to get involved."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Message saved",
  "id": "ID_MSG_XXX"
}
```

**Validation:**
- All fields required
- Message up to 5000 characters
- Timestamp auto-generated

---

### 10. Get All Messages (Admin Only)
**Endpoint:** `/messages/get`

**Request:**
```json
{}
```

**Success Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "ID_MSG_001",
      "name": "John Visitor",
      "phone": "+1-555-0001",
      "address": "123 Visitor Street",
      "message": "I would like to join...",
      "timestamp": "2024-01-15T10:30:00Z",
      "read": false
    }
  ]
}
```

---

## 📊 Statistics Endpoint

### 11. Get Statistics
**Endpoint:** `/stats/get`

**Request:**
```json
{}
```

**Success Response:**
```json
{
  "success": true,
  "userCount": 15,
  "leaderCount": 5,
  "messageCount": 8,
  "donationCount": 23
}
```

---

## 🧪 cURL Examples

### Signup User
```bash
curl -X POST "https://your-gas-url.com?endpoint=/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1-555-1234",
    "address": "789 Oak Avenue",
    "password": "MyPassword123"
  }'
```

### Get Leaders
```bash
curl -X POST "https://your-gas-url.com?endpoint=/leaders/get" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Create Message
```bash
curl -X POST "https://your-gas-url.com?endpoint=/messages/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Johnson",
    "phone": "+1-555-5678",
    "address": "456 Elm Street",
    "message": "Thank you for the community support!"
  }'
```

### Check Donations
```bash
curl -X POST "https://your-gas-url.com?endpoint=/donations/get" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### Update Donation (Admin)
```bash
curl -X POST "https://your-gas-url.com?endpoint=/donations/update" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ID_DON_001",
    "status": "paid"
  }'
```

---

## JavaScript Examples

### Signup Function
```javascript
async function signupUser() {
  const response = await fetch('GAS_URL?endpoint=/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-1234',
      address: '789 Oak Ave',
      password: 'SecurePass123'
    })
  });

  const data = await response.json();
  if (data.success) {
    console.log('Signup successful!');
  } else {
    console.error('Error:', data.error);
  }
}
```

### Get Leaders Function
```javascript
async function loadLeaders() {
  const response = await fetch('GAS_URL?endpoint=/leaders/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  const data = await response.json();
  if (data.success) {
    console.log('Leaders:', data.leaders);
  }
}
```

---

## 🔒 Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Missing required fields | Verify all required fields are included |
| 401 | User not found | Check email exists in database |
| 403 | Invalid password | Verify password is correct |
| 404 | Endpoint not found | Check endpoint spelling |
| 409 | Email already exists | Use different email for signup |
| 500 | Server error | Check Google Apps Script deployment |

---

## 📈 Growth Projections

**Month 1:** 
- Users: 10-20
- Messages: 5-10
- Donations: 15-30

**Month 3:**
- Users: 30-50
- Messages: 20-40
- Donations: 50-100

**Month 6:**
- Users: 50-100
- Messages: 50-100
- Donations: 150-300

---

## 🎓 Learning Resources

### Understanding the Architecture
```
User Frontend (Browser)
        ↓
   JavaScript (script.js)
        ↓
Google Apps Script (Code.gs)
        ↓
Google Sheets Database
```

### Data Flow for Message Submission
```
1. User fills form
2. JavaScript validates input
3. Form submitted to GAS
4. GAS validates server-side
5. Data written to Google Sheets
6. Success response returned
7. Frontend shows notification
```

---

## 🚀 Performance Tips

1. **Minimize API Calls:**
   - Load all leaders once, cache in memory
   - Batch update operations

2. **Optimize Queries:**
   - Filter data before transmission
   - Use indexed searches

3. **Cache Data:**
   - Store in localStorage
   - Set TTL for freshness

4. **Monitor Performance:**
   - Log API response times
   - Track user engagement

---

## 📚 Additional Resources

- **Postman Collection:** Import API examples into Postman for testing
- **API Testing:** Use REST Client extensions in VS Code
- **Monitoring:** Set up Google Analytics for usage tracking
- **Backup:** Regular Google Sheets backups recommended

---

**Last Updated:** January 2024
**Version:** 1.0
