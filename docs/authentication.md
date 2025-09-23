# Authentication & Subscription Flows

Other Party UI integrates with AWS Cognito for identity, while delegating billing status to backend Stripe endpoints. This guide summarizes the available helpers and how screens interact with them.

## Key Services
- **`AuthenticateService` (`src/services/cognito.service.ts`)**
  - Handles Cognito user pool registration, confirmation codes, login, password resets, and local storage of user metadata.
  - Exposes convenience helpers such as `getUser()`, `getIdToken()`, `isAuthenticated()`, and `logOut()`.
  - Wraps backend calls (`checkUserStatus`, `createUserAccountInDB`, `resetPassword`, `getUserSubscriptions`) that augment Cognito with platform-specific data.
  - Uses `ngx-toastr` for user-visible feedback and the Angular Router for navigation after auth events.
- **`BillService` (`src/services/bill.service.ts`)**
  - Provides subscription helpers (`checkForUserSubscription`, `cancelForUserSubscription`, `updateUserWithFollowBills`) that require an ID token issued by Cognito.

## User Lifecycle
1. **Registration**
   - `RegisterComponent` collects profile data (names, zip, reps, notification preferences) and calls `AuthenticateService.register`.
   - Upon success, the service stores the email under `registered-user` in local storage and routes to `/otp-verification`.
2. **Email Confirmation / OTP**
   - `OtpVerificationComponent` submits a 6-digit code via `AuthenticateService.otpVerification`.
   - Success forwards the user to `/plans` to pick a subscription tier.
3. **Login**
   - `AuthenticateService.login` authenticates credentials; on success, it caches the username and navigates home.
   - Unconfirmed users are redirected to OTP verification and a resend is triggered automatically.
4. **Password Reset Flow**
   - `ResetPasswordComponent` triggers Cognito's forgot password via `resetPassword(email)`.
   - `CreateNewPasswordComponent` finalizes the reset with the confirmation code and new password.
5. **Session Handling**
   - The service caches minimal state in local storage (`registered-user`, `accessToken`, etc.) guarded by `isPlatformBrowser` checks.
   - Use `getIdToken()`/`getAccessToken()` to retrieve tokens before calling subscription APIs.
   - `logOut()` clears local storage and returns users to the homepage.

## Guards
- `authGuard` currently lets requests through but is the extension point to require authenticated access (e.g., extend to block `/story/:id`).
- `alreadyLoggedInGuard` keeps authenticated users out of onboarding routes by redirecting to `/`.

## Stripe Integration
- `PlansComponent` lazy-loads Stripe's pricing table script (`https://js.stripe.com/v3/pricing-table.js`) on the browser and embeds `<stripe-pricing-table>` in its template.
- Post-purchase, `BillService.checkForUserSubscription` confirms subscription status; `cancelForUserSubscription` lets users cancel via the navbar.
- When users follow a bill from `FullStoryComponent`, `BillService.updateUserWithFollowBills` persists the selection server-side.

## Extending Auth
- Add new Cognito attributes in `AuthenticateService.register` and ensure they are included in both the signup payload and any downstream data store updates.
- Wrap direct storage or window usage with `isPlatformBrowser` checks to keep SSR safe.
- Document new endpoints in `src/services/README.md` and update flow diagrams or component docs if user journeys change.
