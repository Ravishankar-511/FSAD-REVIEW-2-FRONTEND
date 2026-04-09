# 🔐 ServiceConnect - Demo Credentials Guide

## Quick Start

### Login Page
**URL:** `/login`

The login page features a beautiful two-column layout with:
- **Left side:** Standard login form
- **Right side:** Demo credentials panel with one-click login

### Register Page  
**URL:** `/register`

Create new accounts or use demo credentials shown at the bottom of the registration page.

---

## 🎯 Demo Credentials

Use these credentials to access different dashboard roles and features:

### 👤 User Dashboard
**Email:** `user@demo.com`  
**Password:** `user123`  
**Access:** Find professionals, send hire requests, rate services

**Features:**
- Search and filter professionals by category, location, rating
- Send hire requests to professionals
- Rate completed jobs
- View request history
- Save favorite professionals

---

### 🔧 Professional Dashboard
**Email:** `pro@demo.com`  
**Password:** `pro123`  
**Access:** Manage profile, services, and hire requests

**Features:**
- Edit profile information (name, location, bio, rate)
- Add/manage services offered
- Accept or reject hire requests
- View completed jobs and ratings
- Track pending requests

---

### 🛡️ Admin Dashboard
**Email:** `admin@demo.com`  
**Password:** `admin123`  
**Access:** Manage platform, categories, users, professionals

**Features:**
- View platform statistics
- Manage service categories (add/remove)
- View all users on the platform
- Monitor all professionals
- Approve/manage professional listings
- View all hire requests

---

### 🎧 Support Dashboard
**Email:** `support@demo.com`  
**Password:** `support123`  
**Access:** Handle customer complaints and support tickets

**Features:**
- View all customer support tickets
- Filter tickets (open/resolved)
- Resolve tickets (mark as complete)
- Search tickets by user/category
- Track support metrics
- Manage complaint priorities

---

## 🚀 How to Use

### Method 1: Quick Demo Login (Recommended)
1. Go to **`/login`**
2. On the right panel, click any demo account card
3. Credentials auto-fill automatically
4. Instantly logged in to that dashboard

### Method 2: Manual Login
1. Go to **`/login`**
2. Enter demo email and password manually
3. Click "Sign In"
4. Redirected to dashboard

### Method 3: Create Your Own Account
1. Go to **`/register`**
2. Fill in your name, email, password
3. Click "Create Account"
4. Automatically logged in as User (can access User Dashboard)
5. Demo credentials at bottom for reference

### Method 4: Landing Page Buttons
1. From home page `/`
2. Click "Login" button in header
3. Redirected to login page
4. Select any demo role or sign in manually

---

## 📊 Dashboard Comparison

| Feature | User | Professional | Admin | Support |
|---------|------|--------------|-------|---------|
| Browse Professionals | ✅ | — | — | — |
| Send Hire Requests | ✅ | — | — | — |
| Rate Services | ✅ | — | — | — |
| Edit Profile | — | ✅ | — | — |
| Manage Services | — | ✅ | — | — |
| Views Stats | — | ✅ | ✅ | — |
| View Users | — | — | ✅ | — |
| Manage Categories | — | — | ✅ | — |
| Handle Tickets | — | — | — | ✅ |
| Resolve Complaints | — | — | — | ✅ |

---

## 💡 Tips & Tricks

### 🔄 Switch Accounts
1. Click your name in header (top right) or sidebar
2. Find "Logout" button (bottom of sidebar)
3. Go back to `/login`
4. Select different demo account

### 🎨 Explore All Features
- **User Role:** Search professionals → Send hire → Rate job
- **Professional Role:** Edit profile → Add services → Accept requests
- **Admin Role:** Manage categories → View users → Monitor system
- **Support Role:** View tickets → Resolve complaints

### 📱 Responsive Design
All pages work on:
- ✅ Desktop (1920px and above)
- ✅ Tablet (768px-1024px)
- ✅ Mobile (320px-767px)

### 🔒 Data Persistence
- Demo data saved in browser's localStorage
- Changes persist across page reloads
- Clear browser cache to reset

---

## 🐛 Troubleshooting

### "Invalid email or password"
- Check spelling of demo email exactly
- Use correct case (lowercase)
- Try copying from the demo panel

### "Account already exists"
- Email already registered
- Try different email for new account
- Or logout and login with original account

### Stuck on Loading
- Clear browser cache
- Reload page (F5)
- Check browser console (F12) for errors

### Sidebar isn't showing
- Click menu icon (☰) in top-left on mobile
- Scroll down on mobile to see content

---

## 🎯 Common Workflows

### Workflow 1: End-to-End Hiring
1. Login as **User**
2. Search for professionals by category
3. Click professional card to view details
4. Click "Hire Now" button
5. Select service and confirm
6. View in "My Requests" tab
7. (Simulate professional accepting) Login as **Professional**
8. Accept request
9. (Back as User) Rate the service in "My Requests"

### Workflow 2: Professional Setup
1. Login as **Professional**
2. Go to Profile tab
3. Click "Edit" button
4. Update name, bio, location, rate
5. Click "Save Changes"
6. Go to Services tab
7. Add multiple services
8. View pending requests
9. Accept/reject requests

### Workflow 3: Admin Platform Management
1. Login as **Admin**
2. View dashboard statistics
3. Go to Categories tab
4. Add new service category
5. Remove unwanted categories
6. View all users
7. Monitor professionals
8. Check recent requests

### Workflow 4: Support Ticket Processing
1. Login as **Support**
2. View stats (total, open, resolved)
3. Filter by "open" tickets
4. Search for specific complaints
5. Click "Mark Resolved" on ticket
6. Verify status changes to "✅ Resolved"
7. View metrics update

---

## 🔐 Security Notes

**For Demo/Testing Only:**
- ✅ Credentials are visible for easy testing
- ✅ LocalStorage used (for development)
- ⚠️ NOT for production use
- ⚠️ Replace with real backend authentication
- ⚠️ Use secure password storage
- ⚠️ Implement JWT or OAuth for production

---

## 📋 Feature Checklist

### Authentication ✅
- [ ] Login page loads
- [ ] Register page loads
- [ ] Demo credentials auto-fill
- [ ] Manual login works
- [ ] Account creation works
- [ ] Logout works

### Dashboards ✅
- [ ] User dashboard accessible
- [ ] Professional dashboard accessible
- [ ] Admin dashboard accessible
- [ ] Support dashboard accessible
- [ ] All tabs in each dashboard work

### Functionality ✅
- [ ] Professional search works
- [ ] Hire request system works
- [ ] Rating system works
- [ ] Profile editing works
- [ ] Service management works
- [ ] Category management works
- [ ] Ticket resolution works

---

## 🆘 Getting Help

### Issues?
1. Check browser console (DevTools: F12)
2. Clear browser cache and cookies
3. Try incognito/private window
4. Try different demo account
5. Check network tab for failed requests

### Documentation
- See BUTTON_VERIFICATION_CHECKLIST.md for testing
- See FULL_PROJECT_BUTTON_AUDIT.md for complete feature list
- See code comments in respective pages

---

## ✨ Next Steps

1. **Explore Different Roles** - Try each dashboard
2. **Test All Features** - Use the feature checklist
3. **Create Custom Account** - Try registration
4. **Integrate Backend** - Replace demo auth with real API
5. **Deploy** - Once testing is complete

---

**Happy Testing! 🎉**

**Remember:** These demo accounts are for exploring and testing the platform. For production, implement proper authentication and secure credential management.
