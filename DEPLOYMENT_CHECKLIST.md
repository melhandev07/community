# 📋 Community Portal - Deployment Checklist

Complete this checklist to successfully deploy the Community Portal.

---

## Phase 1: Google Sheets Setup ✅

- [ ] Create new Google Sheet
- [ ] Copy Spreadsheet ID from URL
- [ ] Create 4 sheets:
  - [ ] Users
  - [ ] Leaders
  - [ ] Donations
  - [ ] Messages
- [ ] Add headers to Users sheet:
  ```
  id | name | phone | email | address | passwordHash
  ```
- [ ] Add headers to Leaders sheet:
  ```
  id | name | title | photoURL | description
  ```
- [ ] Add sample leaders (3-4 rows)
- [ ] Add headers to Donations sheet:
  ```
  id | userEmail | month | status
  ```
- [ ] Add sample donations (3-5 rows)
- [ ] Add headers to Messages sheet:
  ```
  id | name | phone | address | message | timestamp | read
  ```
- [ ] Set up data validation for Donations status column
- [ ] Set email column in Users sheet as unique
- [ ] Share Google Sheet (anyone with link can view/edit)
- [ ] Save Spreadsheet ID in safe location

**Spreadsheet ID:** ________________________

---

## Phase 2: Google Apps Script Deployment ✅

- [ ] Go to [script.google.com](https://script.google.com)
- [ ] Create new project
- [ ] Name project "Community Portal Backend"
- [ ] Copy entire code from `Code.gs`
- [ ] Paste into Google Apps Script editor
- [ ] Update `SPREADSHEET_ID` with your Sheet ID:
  ```javascript
  const SPREADSHEET_ID = 'YOUR_ID_HERE';
  ```
- [ ] Save the project
- [ ] Click **Deploy** button
- [ ] Select **New deployment**
- [ ] Choose type: **Web app**
- [ ] Set "Execute as": Your Google account
- [ ] Set "Who has access": **Anyone**
- [ ] Click **Deploy**
- [ ] Copy the deployment URL
- [ ] Click **Manage deployments** to verify
- [ ] Save deployment URL in safe location

**GAS URL:** ________________________

---

## Phase 3: Website Code Setup ✅

- [ ] Update `script.js` with GAS URL:
  ```javascript
  const GAS_URL = 'YOUR_GAS_URL_HERE';
  ```
- [ ] (Optional) Update admin credentials:
  ```javascript
  const ADMIN_EMAIL = 'community@123';
  const ADMIN_PASSWORD = 'admin@community123';
  ```
- [ ] Test locally by opening `index.html` in browser
- [ ] Verify all pages load correctly:
  - [ ] Home page loads
  - [ ] Navigation works
  - [ ] Hamburger menu works on mobile
- [ ] Check console for errors (F12)

---

## Phase 4: Local Testing ✅

### Test Authentication
- [ ] Open website in browser
- [ ] Click "Login" in navbar
- [ ] Try admin login:
  - Email: `community@gmail.com`
  - Password: `admin@community`
- [ ] Verify admin dashboard loads
- [ ] Click "Logout"
- [ ] Click "Sign up"
- [ ] Create test user account
- [ ] Login with test account (may be mock data)

### Test Home Page
- [ ] Hero section displays correctly
- [ ] Animations play smoothly
- [ ] Leaders grid shows sample leaders
- [ ] Statistics display correctly
- [ ] Buttons navigate to correct pages
- [ ] Footer displays

### Test Donation Page
- [ ] Input field for email shows
- [ ] "Check Status" button works
- [ ] Table updates with donations (if data exists)
- [ ] Color coding displays correctly:
  - [ ] Green for "Paid"
  - [ ] Yellow for "Pending"
  - [ ] Red for "Unpaid"

### Test Message Page
- [ ] Form displays correctly
- [ ] All fields required
- [ ] Submit button works
- [ ] Success notification appears
- [ ] Form clears after submit

### Test Admin Panel
- [ ] Login with admin credentials
- [ ] Verify "Admin" link appears in navbar
- [ ] Dashboard tab shows statistics
- [ ] Leaders tab shows management interface
- [ ] Donations tab shows all donations
- [ ] Messages tab shows all messages
- [ ] Can add new leader
- [ ] Can edit leader
- [ ] Can delete leader
- [ ] Can update donation status
- [ ] Can view message details

### Test Responsive Design
- [ ] Open DevTools (F12)
- [ ] Test on mobile view (375px width)
- [ ] Test on tablet view (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Hamburger menu appears on mobile
- [ ] Navigation menu expands/collapses
- [ ] Text is readable on all sizes
- [ ] Buttons are clickable on mobile

### Test Animations
- [ ] Hero floating animation plays
- [ ] Page transitions are smooth
- [ ] Card hover effects work
- [ ] Modal slide-up animation works
- [ ] Notification appears/disappears

---

## Phase 5: Web Hosting Setup ✅

Choose one hosting option:

### Option A: GitHub Pages (Free)
- [ ] Create GitHub account
- [ ] Create new repository
- [ ] Upload `index.html`, `style.css`, `script.js`
- [ ] Enable GitHub Pages in Settings
- [ ] Access via `https://username.github.io/repo-name`
- [ ] Save website URL

### Option B: Netlify (Free)
- [ ] Create Netlify account
- [ ] Connect GitHub repository OR
- [ ] Drag & drop files to deploy
- [ ] Custom domain (optional)
- [ ] Enable HTTPS (automatic)
- [ ] Save website URL

### Option C: Vercel (Free)
- [ ] Create Vercel account
- [ ] Import GitHub repository OR
- [ ] Upload files directly
- [ ] Auto-deployed with HTTPS
- [ ] Custom domain (optional)
- [ ] Save website URL

### Option D: Own Server (Paid/Free)
- [ ] Upload files via FTP/SFTP
- [ ] Set up HTTPS certificate
- [ ] Configure web server
- [ ] Test accessibility
- [ ] Save website URL

**Website URL:** ________________________

---

## Phase 6: Production Testing ✅

### Test on Live Website
- [ ] Website loads without errors
- [ ] All pages accessible
- [ ] GAS API calls work
- [ ] Admin login works
- [ ] User signup/login works
- [ ] Message submission works
- [ ] Donation status loads
- [ ] Mobile responsive

### Test Cross-Browser
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Safari desktop
- [ ] Edge desktop
- [ ] Chrome mobile
- [ ] Safari iOS
- [ ] Firefox mobile

### Test Performance
- [ ] Page loads in < 2 seconds
- [ ] API responses < 1 second
- [ ] No console errors
- [ ] Animations are smooth
- [ ] Forms submit quickly

### Test Data Persistence
- [ ] New user signups appear in Google Sheets
- [ ] Messages appear in Google Sheets
- [ ] Donation statuses update in Google Sheets
- [ ] Leaders persist after reload
- [ ] Admin changes persist

---

## Phase 7: Go Live ✅

- [ ] All testing completed successfully
- [ ] Website URL shared with community
- [ ] Admin account tested and working
- [ ] Sample data in Google Sheets
- [ ] Google Sheets shared with admin
- [ ] Community members directed to website
- [ ] Support contact information provided
- [ ] Analytics setup (optional)

---

## Phase 8: Post-Launch ✅

### First Week
- [ ] Monitor for errors
- [ ] Check Google Sheets for new data
- [ ] Respond to user feedback
- [ ] Add real community leaders
- [ ] Create initial donations for members
- [ ] Promote website to community

### First Month
- [ ] Review user statistics
- [ ] Update leader information
- [ ] Monitor donation status
- [ ] Respond to messages
- [ ] Fix any bugs found
- [ ] Optimize based on feedback

### Ongoing Maintenance
- [ ] Update leaders quarterly
- [ ] Monitor for spam messages
- [ ] Keep Google Sheets clean
- [ ] Update donation data
- [ ] Backup important data
- [ ] Monitor security

---

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| GAS URL returns error | Re-deploy Code.gs with correct Spreadsheet ID |
| Login doesn't work | Verify GAS_URL in script.js is correct |
| No data showing | Check Google Sheets sheet names match Code.gs |
| Email validation fails | Ensure Users sheet has all required columns |
| Mobile menu not working | Check CSS display property for hamburger |
| Animations laggy | Reduce animation complexity or disable on mobile |
| Google Sheets 403 error | Re-share Google Sheet with appropriate permissions |

---

## Emergency Contacts

For urgent issues:
- Google Apps Script Docs: https://developers.google.com/apps-script
- Google Sheets API: https://developers.google.com/sheets/api
- Browser DevTools: Press F12 to view errors

---

## Backup Checklist

Before going live, backup:
- [ ] Google Sheet ID (safe location)
- [ ] GAS URL (safe location)
- [ ] Website URL (safe location)
- [ ] Admin credentials (secure location)
- [ ] Code files (GitHub or local backup)
- [ ] Sample data (document for reference)

---

## Sign-Off

- **Deployment Date:** ________________________
- **Deployed By:** ________________________
- **Tested By:** ________________________
- **Go-Live Date:** ________________________
- **Notes:** ________________________________________________

---

**Congratulations! Your Community Portal is live!** 🎉

For ongoing support and maintenance, refer to README.md and GOOGLE_SHEETS_SETUP.md
