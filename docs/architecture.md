# Architecture Overview

This document explains how the Other Party UI is composed, how data moves through the app, and where to extend feature-specific code.

## Runtime Layers
- **Angular Browser App** – Standalone components driven by Angular Router. The browser bundle offers interactive feeds, auth flows, and subscription tooling.
- **Angular SSR Host** – `server.ts` exposes an Express server that bootstraps `src/main.server.ts` using `@angular/ssr`. Requests render the same component tree on the server for SEO-friendly HTML while the browser hydrates.
- **Backend Integrations** – HTTP traffic flows through `BillService` (story data, subscription status) and `AuthenticateService` (Cognito + Stripe endpoints). API base URLs come from `src/environments/`.

## Routing & Top-Level Screens
Route declarations live in `src/app/app.routes.ts`.

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `StoriesComponent` | Infinite-scrolling feed with search, tags, and share helpers.
| `/story/:id` | `FullStoryComponent` | Detail page with metadata updates, Twitter/GovTrack links, and Cognito follow actions (guarded by `authGuard`).
| `/subscriber-view/:id` | `SubscribersPageComponent` | Subscriber intelligence for a representative (voting history, bills, shareables).
| `/register`, `/login`, `/otp-verification`, `/reset-password`, `/new-password`, `/plans` | Auth + onboarding flows. `alreadyLoggedInGuard` redirects authenticated users back to `/`.
| `/about` | `AboutComponent` | Marketing content reusing the global layout shell.
| `**` | Redirect to `/` | Catch-all fallback.

## Feature Modules (`src/app`)
- **Navbar/Footer/Divider/Title** – Shared layout primitives imported directly into standalone pages.
- **Stories** – `StoriesComponent` hosts the shell while `ContentComponent` handles search, infinite scroll, and dynamic card layouts. It relies on `BillService.getHeadLines` and local storage to persist rep selections.
- **Full Story** – Fetches a single bill (`BillService.getFullStory`) and prepares share text, meta tags, and follow interactions through `AuthenticateService` and `BillService.updateUserWithFollowBills`.
- **Subscribers Page** – Uses a set of `BillService` endpoints (`getSubscriberDetails`, `votedForList`, etc.) to surface rep-specific analytics with deep links to stories.
- **Auth Flows** – Located under `src/app/auth`. Components call into `AuthenticateService` for Cognito registration, login, OTP verification, and password resets. Stripe pricing table embeds load in `PlansComponent`.
- **Shared Module** – `src/app/shared` exposes utilities like `TruncatePipe` that are consumed across stories, full-story, and subscriber screens.

## Services & Interceptors (`src/services`)
- **`BillService`** – Central data access layer for stories, reps, and Stripe subscription status. Emits UI signals via `xFunctionCalled$`/`yFunctionCalled$` Subjects to coordinate tabs and filters.
- **`AuthenticateService`** – Wraps AWS Cognito user pool operations, local storage persistence, toasts, routing redirects, and Stripe subscription helpers. Provides token helpers (`getIdToken`, `isAuthenticated`, etc.).
- **`HeadersInterceptor`** – Example interceptor that appends a static `username` header today; extend it to add auth tokens or tracing headers globally.
- **`MessageService`** – Simple in-memory logger used by `BillService`.

## Environment & Configuration
- Environment values (`baseURL`, `billsURL`, Cognito settings) live in `src/environments/`. Update both `environment.ts` and `environment.prod.ts` when adding keys.
- `angular.json` defines the browser and server builders, SSR serve target (`other-party-ui:serve-ssr`), and file replacements used during builds.
- `server.ts` controls cache headers for static assets and ties Express routes to the Angular rendering engine. Custom middleware should remain pure to keep SSR deterministic.

## Data Flow Summary
1. Components call into `BillService`/`AuthenticateService`.
2. Services fetch data from the backend with `HttpClient`, applying headers/interceptors.
3. Responses update component state, which is immediately reflected in templates thanks to Angular change detection.
4. Authentication-sensitive flows rely on Cognito tokens obtained via `AuthenticateService.getIdToken()` and persisted in local storage for browser contexts.
5. For SSR requests, the same logic runs server-side; ensure browser-only APIs are guarded with `isPlatformBrowser` checks (already present in the main components).

## Extensibility Tips
- New feature screens should be standalone components to match the existing pattern.
- Place shared UI in `src/app/shared` and data helpers in `src/services` to keep the feed and auth modules lean.
- When introducing new API endpoints, centralize them in `BillService` or a dedicated service and add documentation in `src/services/README.md`.
- If SSR behavior differs from the browser, guard direct `window`/`localStorage` access with platform checks and document the behavior in `docs/development.md`.
