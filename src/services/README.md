# Services Reference

Service classes centralize HTTP calls and authentication helpers used throughout Other Party UI.

## BillService (`bill.service.ts`)
Responsible for story data, representative insights, and subscription management.

| Method | Purpose |
| --- | --- |
| `getHeadLines(limit, offset, orderBy)` | Fetches paginated story summaries for the feed.
| `getFullStory(billId, reps?)` | Retrieves a detailed story, optionally scoped to a user's representatives.
| `searchBill(term)` | Performs a backend story search.
| `getSubscriberDetails(sponsorId)` | Returns subscriber metadata for a representative.
| `votedForList(sponsorId)` | Bills the rep voted for.
| `votedAgainstList(sponsorId)` | Bills the rep voted against.
| `votedSponsoredCosponsoredList(sponsorId)` | Bills the rep sponsored or co-sponsored.
| `searchForReps(term)` | Autocomplete helper for representatives.
| `getRepsFromZipCode(zip)` | Looks up reps using a ZIP code.
| `checkForUserSubscription(token)` | Queries Stripe subscription status with a Cognito ID token.
| `cancelForUserSubscription(token)` | Cancels the active Stripe subscription for the authenticated user.
| `updateUserWithFollowBills(followBills, cognitoId)` | Persists the bills followed by a Cognito user.
| `callXFunction(tab, isSubscriberPage)` / `callYFunction(tab, isChecked)` | Emits UI coordination events consumed by components.

Errors are funneled through `handleError`, which logs via `MessageService` and returns safe observables so the UI remains responsive.

## AuthenticateService (`cognito.service.ts`)
Wraps AWS Cognito flows and related backend integrations.

- `login`, `register`, `otpVerification` – Handle the primary auth lifecycle.
- `getIdToken`, `getAccessToken`, `getUser`, `isAuthenticated` – Convenience helpers for components/services needing identity state.
- `getUserSubscriptions` – Fetches Stripe subscription details for the current user.
- `checkUserStatus`, `createUserAccountInDB`, `resetPassword`, `confirmPassword` – Backend augmentations for Cognito users.
- `logOut` – Clears local storage and redirects to the homepage.

Browser-specific storage is always guarded with `isPlatformBrowser`; follow the same pattern for new methods.

## HeadersInterceptor (`headers.interceptor.ts`)
Demonstrates how to enrich outgoing HTTP requests with additional headers. Replace the placeholder `username: 'TEST'` value with real auth tokens or tracing identifiers as needed.

## MessageService (`message.service.ts`)
Lightweight message collector used for logging inside services. Extend or replace with a more sophisticated logging strategy if remote telemetry is required.

Document new services or endpoints here so feature teams have a single place to understand backend touchpoints.
