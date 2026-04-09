# Professional Rating Update - Test Guide

## Overview
This guide walks through testing the professional rating system to ensure ratings, reviews count, and completed jobs counter update correctly when users submit ratings.

## Prerequisites
- App running at http://localhost:5175/
- Browser DevTools open (F12)
- localStorage accessible (Console tab)

## Test Scenario

### Step 1: Clear Previous Data
1. Open Browser Console (F12 → Console)
2. Run: `localStorage.clear()` to clear all previous data
3. Refresh the page (Ctrl+R or Cmd+R)

### Step 2: Login as Regular User
1. Click "Sign In" button
2. Login with demo user credentials:
   - Email: `user@demo.com`
   - Password: `user123`
3. You should be on User Dashboard

### Step 3: Check Initial Professional Stats
1. Open Browser Console
2. Run: `JSON.parse(localStorage.getItem('professionals')).find(p => p.name === 'Ravi Kumar')`
3. Note the current stats for Ravi Kumar (Plumbing professional):
   - Expected: `rating: 4.8, reviews: 124, completedJobs: 312`

### Step 4: Hire the Professional
1. In dashboard, go to "Find Professionals" tab
2. Filter by "Plumbing" category or search for "Ravi Kumar"
3. Click on Ravi Kumar's card
4. Click "Hire Professional" button
5. Select a service (e.g., "Pipe Repair")
6. Confirm the hire

### Step 5: Professional Confirms Request
1. Click Profile or navigate to Professional Dashboard
2. Logout and login as professional:
   - Email: `pro@demo.com`
   - Password: `pro123`
3. In Professional Dashboard, "View Requests" or check requests section
4. Find your hire request from user
5. Click "Confirm" or "Accept" button to change status to "confirmed"

### Step 6: User Rates the Professional
1. Logout and login back as user (`user@demo.com` / `user123`)
2. Go to "My Requests" or similar section
3. Find the request that is "confirmed" status
4. Click "Rate Professional" button
5. Select a rating (e.g., 5⭐ stars)
6. Click "Submit Rating"
7. You should see: "⭐ Rating submitted for Ravi Kumar! Thank you 🎉"

### Step 7: Verify Professional Stats Updated
1. Check if Ravi Kumar's stats changed in the professional card display
2. Open Browser Console
3. Run: `JSON.parse(localStorage.getItem('professionals')).find(p => p.name === 'Ravi Kumar')`
4. Verify the new stats:
   - `reviews` should be: `125` (was 124, now +1)
   - `completedJobs` should be: `313` (was 312, now +1)
   - `rating` should have changed (calculation shown below)

## Expected Rating Calculation

### Formula for New Average Rating:
```
newReviews = oldReviews + 1
newRating = (oldRating * oldReviews + ratingValue) / newReviews
```

### Example:
If submitting 5.0 stars for Ravi Kumar:
- oldRating = 4.8, oldReviews = 124
- newReviews = 125
- newRating = (4.8 * 124 + 5.0) / 125 = (595.2 + 5.0) / 125 = 600.2 / 125 = 4.8016
- Rounded to 1 decimal: **4.8** (minimal change for established professional)

## Test Verification Checklist

After completing the steps above:

- [ ] Step 1: Data cleared successfully
- [ ] Step 2: Logged in as regular user
- [ ] Step 3: Initial stats captured correctly
- [ ] Step 4: Professional hired successfully
- [ ] Step 5: Professional confirmed request
- [ ] Step 6: Rating submitted with success message
- [ ] Step 7: Professional stats updated in localStorage
- [ ] Extra Check: Reviews count incremented by 1
- [ ] Extra Check: Completed jobs count incremented by 1
- [ ] Extra Check: Rating value updated (may be slight change for established pros)

## Debugging Tips

If rating doesn't update:

1. **Check Browser Console for errors:**
   ```javascript
   // Open console and look for any red error messages
   ```

2. **Verify submitProfessionalRating is called:**
   - Add `console.log('Rating submitted:', professionalId, ratingValue)` in UserDashboard.jsx
   - Check if message appears when submitting rating

3. **Check localStorage directly:**
   ```javascript
   // In Console:
   const professionals = JSON.parse(localStorage.getItem('professionals'));
   console.table(professionals.map(p => ({
       name: p.name,
       rating: p.rating,
       reviews: p.reviews,
       completedJobs: p.completedJobs
   })));
   ```

4. **Verify Request Status:**
   ```javascript
   // In Console:
   const requests = JSON.parse(localStorage.getItem('requests') || '[]');
   const userRequests = requests.filter(r => r.status === 'completed');
   console.table(userRequests);
   ```

## Related Features

These work together with the rating system:

### Professional Request Status Flow:
1. **pending** - User just hired, waiting for professional to respond
2. **confirmed** - Professional accepted the request
3. **completed** - User submitted rating (automatically set by submitRating function)

### Professional Profile Data:
- `rating` - Average rating across all reviews
- `reviews` - Total number of reviews received
- `completedJobs` - Total number of jobs completed

## Files Modified

For this feature implementation:

1. **src/context/AppContext.jsx**
   - Added `submitProfessionalRating()` function
   - Added localStorage persistence for professionals
   - Exported new function in context value

2. **src/pages/UserDashboard.jsx**
   - Updated `submitRating()` to call `submitProfessionalRating()`
   - Updated `updateRequestStatus()` to mark request as "completed"
   - Added imports for `submitProfessionalRating` and `updateRequestStatus`

3. **Storage**
   - New key: `professionals` in localStorage
   - Updates automatically when professional stats change

---
**Test completed:** [Date/Time to be filled after testing]
**Tester:** [Name to be filled]
**Status:** [PASS/FAIL to be filled]
