# Google Sheets Setup Guide for Community Portal

## Overview
This guide will help you set up the Google Sheets database structure for the Community Portal.

## Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Create** > **Blank spreadsheet**
3. Name it "Community Portal Database"
4. Copy the Spreadsheet ID from the URL (between `/d/` and `/edit`)
   - Example URL: `https://docs.google.com/spreadsheets/d/1ABC123XYZ/edit`
   - Your ID: `1ABC123XYZ`

## Step 2: Create Sheet Tabs

Delete the default "Sheet1" and create 4 new sheets:
1. **Users**
2. **Leaders**
3. **Donations**
4. **Messages**

---

## Sheet 1: Users

**Column Headers (Row 1):**
```
id | name | phone | email | address | passwordHash
```

**Data Type:**
- id: Text (auto-generated)
- name: Text
- phone: Text
- email: Text (unique)
- address: Text
- passwordHash: Text (encrypted)

**Sample Row:**
```
ID_xyz123 | John Doe | +1-234-567-8900 | john@email.com | 123 Main St, City | [HASHED_PASSWORD]
```

**Setup Instructions:**
1. Create header row with columns above
2. Set email column as unique (Data > Data validation > Custom formula = `COUNTIF($D$2:$D,D2)=1`)
3. No sample data needed yet - it will be added through signup

---

## Sheet 2: Leaders

**Column Headers (Row 1):**
```
id | name | title | photoURL | description
```

**Data Types:**
- id: Text (auto-generated)
- name: Text
- title: Text
- photoURL: Text (URL to image)
- description: Text

**Sample Data (Add 3 rows):**

```
ID_leader_001 | John Smith | Community President | https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400 | John has been leading our community for 5 years with dedication and vision.

ID_leader_002 | Sarah Johnson | Finance Manager | https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400 | Sarah manages our finances with transparency and accountability.

ID_leader_003 | Michael Brown | Event Coordinator | https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400 | Michael organizes community events that bring us all together.
```

---

## Sheet 3: Donations

**Column Headers (Row 1):**
```
id | userEmail | month | status
```

**Data Types:**
- id: Text (auto-generated)
- userEmail: Text
- month: Text
- status: Text (paid/pending/unpaid)

**Sample Data (Add 3 rows):**

```
ID_don_001 | john@email.com | January | paid
ID_don_002 | john@email.com | February | pending
ID_don_003 | jane@email.com | January | unpaid
```

**Status Values:**
- `paid` - Green badge ✓
- `pending` - Yellow badge ⏳
- `unpaid` - Red badge ✗

**Data Validation:**
- Create dropdown for status column
- Go to Data > Data validation
- List from range or entries: `paid, pending, unpaid`

---

## Sheet 4: Messages

**Column Headers (Row 1):**
```
id | name | phone | address | message | timestamp | read
```

**Data Types:**
- id: Text (auto-generated)
- name: Text
- phone: Text
- address: Text
- message: Text (long)
- timestamp: Text (ISO 8601 format)
- read: Text (true/false)

**Sample Row:**
```
ID_msg_001 | Alice Park | +1-555-1234 | 456 Oak Ave, Town | Thank you for helping our community! | 2024-01-15T10:30:00Z | false
```

---

## Step 3: Share Settings

1. Click **Share** button (top right)
2. Change to "Anyone with the link can view" or "Anyone can edit" based on security needs
3. Click **Copy link**
4. For integration: Set to **Editor** permissions for the script to work

---

## Step 4: Integration with Code

### In index.html:
- Update `GAS_URL` variable with your deployed Google Apps Script URL

### In Code.gs (Google Apps Script):
- Update `SPREADSHEET_ID` with your Sheet ID

### How to Deploy Google Apps Script:

1. Create a new Google Apps Script project:
   - Go to [script.google.com](https://script.google.com)
   - Click **+ New project**
   - Copy all code from `Code.gs` into the script editor

2. Deploy as Web App:
   - Click **Deploy** > **New deployment**
   - Select type: **Web app**
   - Execute as: Your Google account
   - Who has access: **Anyone**
   - Click **Deploy**
   - Copy the deployment URL
   - Paste into `GAS_URL` in index.html

---

## Data Flow Diagram

```
User Interface (index.html)
    ↓
JavaScript (script.js)
    ↓
Google Apps Script API (Code.gs)
    ↓
Google Sheets Database
    ↓
(CRUD Operations)
```

---

## Security Notes

1. **Passwords:**
   - Hashed using SHA-256 in Code.gs
   - Never stored in plain text
   - Verified server-side during login

2. **Admin Credentials:**
   - Email: `community@123`
   - Password: `admin@community123`
   - Change these in script.js after deployment

3. **Google Sheets Access:**
   - Only the deployed app can modify sheets
   - Users cannot directly access raw data
   - All operations are validated server-side

---

## Troubleshooting

### Sheet not found error:
- Verify sheet names match exactly (case-sensitive)
- Check SPREADSHEET_ID is correct
- Ensure script has access to the sheet

### No data showing:
- Check that headers are in Row 1
- Verify data starts from Row 2
- Check sheet names in Code.gs

### Authentication errors:
- Verify GAS_URL is correct
- Check deployment is set to "Anyone"
- Redeploy if script code changes

---

## API Endpoints Available

All endpoints are POST-only and handled by Code.gs:

### Authentication
- `/signup` - Register new user
- `/login` - User login

### Leaders
- `/leaders/get` - Fetch all leaders
- `/leaders/create` - Add new leader
- `/leaders/update` - Modify leader
- `/leaders/delete` - Remove leader

### Donations
- `/donations/get` - Fetch donation records
- `/donations/update` - Update donation status

### Messages
- `/messages/create` - Save new message
- `/messages/get` - Fetch all messages

### Statistics
- `/stats/get` - Get dashboard statistics

---

## Sample cURL Requests

### Get Leaders:
```bash
curl -X POST https://YOUR_GAS_URL \
  -H "Content-Type: application/json" \
  -d '{}' \
  -G -d "endpoint=leaders/get"
```

### Create Message:
```bash
curl -X POST https://YOUR_GAS_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "phone": "123-456-7890",
    "address": "123 Main St",
    "message": "Hello"
  }' \
  -G -d "endpoint=messages/create"
```

---

## Support & Resources

- Google Sheets: https://sheets.google.com
- Google Apps Script: https://script.google.com
- Apps Script Documentation: https://developers.google.com/apps-script

---

**Last Updated:** January 2024
**Version:** 1.0
