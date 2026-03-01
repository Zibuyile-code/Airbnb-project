# Capstone Submission Evidence Map

## Build Verification
- Command used: `npm --prefix "c:\Users\emman\Documents\Websites\Capstone Project\frontend" run build`
- Notes: Re-run before final upload and include terminal screenshot showing final status line.

## One-Recording Demo Flow
Record one continuous video (or capture screenshots in this order):

1. **Login flow**
   - Open `/login`
   - Enter valid credentials
   - Submit and show redirect to dashboard
   - Evidence files:
     - `frontend/src/pages/Login.js`
     - `frontend/src/components/PrivateRoute.js`

2. **Create listing**
   - Go to `Admin Add Hotel` or `/listings/create`
   - Fill required fields (title, location, description, bedrooms, bathrooms, guests, type, price, amenities, fees)
   - Submit successfully
   - Evidence file:
     - `frontend/src/pages/ListingForm.js`

3. **Edit listing**
   - Open `My Listings`
   - Click Edit on one listing
   - Change a value and save
   - Show updated listing
   - Evidence files:
     - `frontend/src/pages/ListingsList.js`
     - `frontend/src/pages/ListingForm.js`

4. **Delete listing**
   - From `My Listings`, click Delete
   - Confirm deletion
   - Show listing removed from list
   - Evidence files:
     - `frontend/src/pages/ListingsList.js`

5. **Reservation creation**
   - Open a location detail page (`/listings/:id`)
   - Set check-in/check-out and guests
   - Click Reserve
   - Evidence files:
     - `frontend/src/pages/LocationDetails.js`
     - `backend/controllers/reservationController.js`

6. **Reservations table view**
   - Open profile menu
   - Click `View Reservations`
   - Show reservations table data
   - Evidence files:
     - `frontend/src/pages/Reservations.js`
     - `frontend/src/components/Header.js`
     - `frontend/src/App.js`

## Backend Endpoint Proof (Screenshot from code + optional API response)
- Required endpoints:
  - `POST /api/reservations`
  - `GET /api/reservations/host`
  - `GET /api/reservations/user`
  - `DELETE /api/reservations/:id`
- Evidence files:
  - `backend/routes/reservationRoutes.js`
  - `backend/middleware/reservationMiddleware.js`
  - `backend/app.js`

## Suggested Screenshot Set (if not using video)
1. Login page before submit
2. Dashboard after login (username visible)
3. Create listing form filled
4. Success result or listing shown in list
5. Edit listing before/after value change
6. Delete confirmation + updated list
7. Location details with cost calculator values
8. Reserve action result
9. Header dropdown showing `View Reservations`
10. Reservations table page
11. Code screenshot of `reservationRoutes.js` showing `/host` and `/user`
12. Terminal screenshot of frontend build command result

## Final Submission Notes
- Keep screenshots in chronological order matching the flow above.
- Include this file in your repo to show marker-friendly traceability from requirement to implementation.
