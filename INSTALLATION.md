# 📦 Community Portal - Complete Installation Guide

Comprehensive step-by-step installation instructions for all system levels.

---

## 📁 Project Files Overview

```
community-portal/
│
├── index.html                 (Main website - all pages in one file)
├── style.css                  (All styling and animations)
├── script.js                  (Frontend JavaScript logic)
├── Code.gs                    (Google Apps Script backend)
│
├── README.md                  (Project overview and features)
├── QUICK_START.md             (5-minute fast setup)
├── INSTALLATION.md            (This file - detailed instructions)
├── GOOGLE_SHEETS_SETUP.md     (Database configuration guide)
├── DEPLOYMENT_CHECKLIST.md    (Pre-launch verification)
└── SAMPLE_DATA_AND_API.md     (API reference and examples)
```

### File Sizes
- `index.html` - ~20 KB
- `style.css` - ~25 KB
- `script.js` - ~18 KB
- `Code.gs` - ~12 KB
- **Total:** ~75 KB (very lightweight!)

---

## 🖥️ System Requirements

### Minimum
- Web browser (Chrome, Firefox, Safari, Edge)
- Google Account
- Internet connection
- Text editor (any)

### Recommended
- Modern browser (2020+)
- GitHub/Netlify account (for hosting)
- SSH client (for server deployment)
- 100 MB free space

---

## 📋 Pre-Installation Checklist

Before starting:
- [ ] Google Account created
- [ ] Internet connection stable
- [ ] Text editor available
- [ ] Browser updated
- [ ] Spreadsheet ID saved
- [ ] GAS URL saved
- [ ] Hosting platform chosen

---

## Phase 1: Google Sheets Database

### Step 1.1: Create Google Sheet

1. Go to [https://sheets.google.com](https://sheets.google.com)
2. Click **+ Create** button
3. Select **Blank spreadsheet**
4. Name: "Community Portal Database"
5. Browser shows new sheet

### Step 1.2: Get Spreadsheet ID

1. Look at URL in address bar
2. Find the ID between `/d/` and `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit
                                         ^^^^^^^^^^^^^^^^^
   ```
3. Copy the ID
4. **Save it in a text file!**

### Step 1.3: Create Sheet Tabs

1. Right-click on "Sheet1" tab at bottom
2. Select "Delete" (remove default sheet)
3. Right-click in empty space next to tabs
4. Click "+" icon 4 times to create 4 sheets
5. Rename each:
   - Right-click → "Rename"
   - Sheet 1: **Users**
   - Sheet 2: **Leaders**
   - Sheet 3: **Donations**
   - Sheet 4: **Messages**

### Step 1.4: Add Headers - Users Sheet

1. Click **Users** tab
2. In cell A1, type: `id`
3. Tab → B1, type: `name`
4. Tab → C1, type: `phone`
5. Tab → D1, type: `email`
6. Tab → E1, type: `address`
7. Tab → F1, type: `passwordHash`

Final row should look like:
```
id | name | phone | email | address | passwordHash
```

### Step 1.5: Add Headers - Leaders Sheet

Click **Leaders** tab, add in row 1:
```
id | name | title | photoURL | description
```

### Step 1.6: Add Headers - Donations Sheet

Click **Donations** tab, add in row 1:
```
id | userEmail | month | status
```

### Step 1.7: Add Headers - Messages Sheet

Click **Messages** tab, add in row 1:
```
id | name | phone | address | message | timestamp | read
```

### Step 1.8: Add Sample Leaders (Optional)

Click **Leaders** tab, add sample row:

```
ID_L1 | John Smith | Community President | https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400 | Leading since 5 years
```

### Step 1.9: Share the Sheet

1. Click **Share** button (top right)
2. Select **Anyone with the link can edit**
3. Click **Share**
4. Don't worry about the URL

**✅ Database setup complete!**

---

## Phase 2: Google Apps Script Backend

### Step 2.1: Create New Project

1. Go to [https://script.google.com](https://script.google.com)
2. Click **+ New project**
3. Name it: "Community Portal Backend"

### Step 2.2: Delete Default Code

1. You see `function myFunction() {}`
2. Select all code (Ctrl+A or Cmd+A)
3. Delete it
4. Empty editor ready

### Step 2.3: Copy Backend Code

1. Open the `Code.gs` file
2. Select all code
3. Copy (Ctrl+C or Cmd+C)
4. Paste into Google Apps Script editor
5. Save (Ctrl+S or Cmd+S)

### Step 2.4: Update Spreadsheet ID

1. Find this line in the code:
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```

2. Replace `'YOUR_SPREADSHEET_ID_HERE'` with your ID from Step 1.2:
   ```javascript
   const SPREADSHEET_ID = '1ABC123XYZ...';
   ```

3. Save again (Ctrl+S)

### Step 2.5: Deploy as Web App

1. Click **Deploy** button (top right)
2. Click **New deployment**
3. In the type dropdown, select **Web app**
4. Fill in:
   - **Execute as:** Your Google Account
   - **Who has access:** Anyone
5. Click **Deploy**

### Step 2.6: Copy Deployment URL

1. A popup appears with success message
2. Click the copy icon next to the URL
3. The URL looks like:
   ```
   https://script.googleapis.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent
   ```
4. **Save this URL!** (Important!)

### Step 2.7: Verify Deployment

1. You should see "Deployment ID: abc123..."
2. The URL is now active
3. Keep this tab open for Step 3

**✅ Backend deployed!**

---

## Phase 3: Website Setup

### Step 3.1: Get the Files

You need 3 files:
1. `index.html`
2. `style.css`
3. `script.js`

These should already be downloaded or created.

### Step 3.2: Update GAS URL

Open `script.js` in text editor:

1. Find line (usually near top):
   ```javascript
   const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```

2. Replace with your URL from Step 2.6:
   ```javascript
   const GAS_URL = 'https://script.googleapis.com/macros/d/YOUR_ID/usercontent';
   ```

3. Save file (Ctrl+S)

### Step 3.3: (Optional) Update Admin Credentials

Find these lines in `script.js`:
```javascript
const ADMIN_EMAIL = 'community@123';
const ADMIN_PASSWORD = 'admin@community123';
```

Change to your credentials:
```javascript
const ADMIN_EMAIL = 'your@email.com';
const ADMIN_PASSWORD = 'YourSecurePassword123';
```

### Step 3.4: Test Locally

1. Open file browser
2. Navigate to folder with 3 files
3. Right-click on `index.html`
4. Select "Open with" → Your browser
5. Website should load!

**Local test checklist:**
- [ ] Page loads without errors
- [ ] Navigation bar appears
- [ ] All buttons clickable
- [ ] No red errors in console (F12)

**✅ Files ready for deployment!**

---

## Phase 4: Website Hosting

Choose one method:

### Option A: GitHub Pages (Recommended for Beginners)

#### Prerequisites
- GitHub account (free at github.com)

#### Steps

1. **Create Repository:**
   - Go to github.com
   - Click **+** → **New repository**
   - Name: `community-portal`
   - Public repository
   - Don't initialize with README
   - Click **Create repository**

2. **Upload Files:**
   - Click **uploading an existing file**
   - Upload `index.html`
   - Upload `style.css`
   - Upload `script.js`
   - Commit message: "Initial commit"
   - Click **Commit changes**

3. **Enable GitHub Pages:**
   - Click **Settings** tab
   - Click **Pages** (left sidebar)
   - Source: **main** branch
   - Click **Save**
   - Wait 1-2 minutes
   - Your URL appears:
     ```
     https://username.github.io/community-portal
     ```

4. **Visit Your Site:**
   - Open the URL in browser
   - Website is live!

**Pros:** Free, reliable, easy updates  
**Cons:** Static only (no backend needed here since we use GAS)

---

### Option B: Netlify (Easiest)

#### Steps

1. Go to netlify.com
2. Click **Sign up**
3. Use GitHub account
4. Authorize Netlify
5. Click **Add new site** → **Deploy manually**
6. Drag & drop your 3 files
7. Wait for deployment
8. Get your URL: `https://random-name.netlify.app`

**Pros:** Very easy, auto-deploys  
**Cons:** Requires account

---

### Option C: Vercel (Fastest)

#### Steps

1. Go to vercel.com
2. Click **Sign up**
3. Use GitHub/email
4. Click **Add new project**
5. Upload files OR connect GitHub
6. Click **Deploy**
7. Get your URL instantly

**Pros:** Fastest performance  
**Cons:** Requires account

---

### Option D: Your Own Server

#### Prerequisites
- Web hosting (Apache, Nginx)
- FTP/SFTP access
- Domain name (optional)

#### Steps

1. Connect via FTP/SFTP
2. Upload 3 files to `public_html` folder
3. Set permissions to 644 (readable)
4. Visit your domain
5. Website is live!

**Example commands:**
```bash
sftp user@example.com
cd public_html
put index.html
put style.css
put script.js
exit
```

---

## Phase 5: Testing & Verification

### Step 5.1: Basic Load Test

1. Open website in browser
2. Wait for full load (< 2 seconds)
3. Check for any red errors (F12 console)
4. Click around pages to verify navigation

**Expected behavior:**
- All pages load smoothly
- Navigation works
- No console errors
- Mobile menu works (F12 → toggle device)

### Step 5.2: Authentication Test

1. Click "Login" in navigation
2. Try admin login:
   - Email: `community@123`
   - Password: `admin@community123`
3. Should see admin dashboard
4. Click "Logout"

### Step 5.3: Admin Functions Test

1. Login as admin again
2. Click "Admin" in navbar
3. Dashboard tab: See statistics
4. Leaders tab: Add new leader
   - Fill in name, title, photo URL, description
   - Click "Save Leader"
   - Should see success message
5. Messages tab: Should be empty (no messages yet)

### Step 5.4: User Functions Test

1. Logout
2. Click "Sign up"
3. Create test account:
   - Name: Test User
   - Email: test@example.com
   - Phone: 555-1234
   - Address: 123 Test St
   - Password: Test1234
4. Click "Create Account"
5. Should see success message
6. Check Google Sheets Users tab - new user appears!

### Step 5.5: Message Test

1. Go to "Message" page
2. Fill out form:
   - Name: Test Person
   - Phone: 555-5678
   - Address: 456 Message St
   - Message: Test message
3. Click "Send Message"
4. Should see success notification
5. Check Google Sheets Messages tab - message appears!

### Step 5.6: Mobile Test

1. Press F12 (Developer Tools)
2. Click device icon (toggle device toolbar)
3. Select iPhone 12
4. Check:
   - [ ] Hamburger menu appears
   - [ ] Menu expands/collapses
   - [ ] Layout stacks vertically
   - [ ] No horizontal scroll
   - [ ] Buttons are clickable
   - [ ] Text is readable

### Step 5.7: Cross-Browser Test

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Phase 6: Post-Deployment

### Step 6.1: Document Your Setup

Create a setup notes file:
```
Community Portal Setup Notes
============================

Spreadsheet ID: 1ABC123XYZ
GAS URL: https://script.googleapis.com/...
Website URL: https://your-site.com
Admin Email: community@123
Admin Password: admin@community123

Date Deployed: January 15, 2024
Deployed by: Your Name
```

### Step 6.2: Backup Important URLs

Save in safe location:
- Spreadsheet ID
- GAS URL
- Website URL
- Admin credentials

### Step 6.3: Share with Community

1. Send website link to members
2. Create instructions page
3. Monitor first week
4. Fix any issues

### Step 6.4: Add Real Data

1. Update Leaders sheet with actual leaders
2. Add donation records for members
3. Import existing contact messages

---

## 🐛 Troubleshooting During Installation

### Error: "Google Apps Script URL not set"
**Solution:** Update `GAS_URL` in script.js with your deployment URL

### Error: "Cannot read property 'getSheetByName'"
**Solution:** 
- Verify Spreadsheet ID in Code.gs is correct
- Check sheet names match exactly
- Re-deploy Code.gs

### Error: "Unexpected end of file"
**Solution:**
- Check Code.gs has no syntax errors
- Copy the entire file correctly
- Remove any extra spaces at end

### Website shows blank page
**Solution:**
- Check browser console (F12)
- Verify GAS_URL is correct
- Try hard refresh (Ctrl+Shift+R)

### Login always fails
**Solution:**
- Check GAS deployment is "Anyone"
- Verify Spreadsheet ID is correct
- Check Users sheet has correct headers

### No data showing
**Solution:**
- Add headers in row 1 of each sheet
- Add sample data in row 2+
- Check sheet names in Code.gs match Google Sheets

---

## 📊 Installation Checklist

### Phase 1: Database
- [ ] Google Sheet created
- [ ] Spreadsheet ID copied
- [ ] 4 sheets created and named
- [ ] Headers added to all sheets
- [ ] Sample leaders added

### Phase 2: Backend
- [ ] Google Apps Script project created
- [ ] Code.gs copied and updated
- [ ] Spreadsheet ID inserted in Code.gs
- [ ] Deployed as Web App
- [ ] Deployment URL saved

### Phase 3: Frontend
- [ ] GAS_URL updated in script.js
- [ ] All 3 files saved correctly
- [ ] Tested locally in browser
- [ ] No console errors

### Phase 4: Hosting
- [ ] Chose hosting platform
- [ ] Files uploaded
- [ ] Website accessible via URL
- [ ] Domain configured (if applicable)

### Phase 5: Testing
- [ ] Load test passed
- [ ] Admin login works
- [ ] Signup works
- [ ] Message submission works
- [ ] Mobile responsive
- [ ] Cross-browser tested

### Phase 6: Launch
- [ ] All tests passed
- [ ] Documentation saved
- [ ] Team briefed
- [ ] Community notified
- [ ] Monitoring setup

---

## ✅ You're Ready!

Once all checklists pass, your Community Portal is:
- ✅ Fully functional
- ✅ Secure
- ✅ Responsive
- ✅ Professional
- ✅ Ready for community use

---

## 📚 Next Steps

1. Read `README.md` for feature overview
2. Check `SAMPLE_DATA_AND_API.md` for API reference
3. Review `DEPLOYMENT_CHECKLIST.md` for go-live
4. Monitor first week for issues
5. Update leaders quarterly
6. Back up data monthly

---

## 🆘 Getting Help

If stuck:
1. Check the troubleshooting section above
2. Review `GOOGLE_SHEETS_SETUP.md`
3. Check browser console (F12)
4. Verify Google Apps Script deployment
5. Try hard refresh (Ctrl+Shift+R)

---

**Congratulations on your new Community Portal!** 🎉

Total installation time: ~30 minutes  
Difficulty: Beginner friendly  
No coding required!

---

Last Updated: January 2024
Version: 1.0
