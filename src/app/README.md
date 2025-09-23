# App Components Guide

This reference summarizes the primary standalone components that make up Other Party UI.

## Layout & Shell
- **`NavbarComponent`** – Displays login/logout/stateful actions. Relies on `AuthenticateService` and `BillService` to cancel subscriptions and expose privacy/terms overlays.
- **`FooterComponent`** – Static marketing/footer links reused across routes.
- **`TitleComponent` / `DividerComponent`** – Shared typography and layout helpers for section headers.

## Story Discovery
- **`StoriesComponent`** – Top-level route for `/`. Hosts global layout and delegates business logic to `ContentComponent`.
- **`ContentComponent`**
  - Fetches paginated data through `BillService.getHeadLines`.
  - Restores and persists representative filters via local storage.
  - Provides search with debounced form controls and infinite scroll via `ngx-infinite-scroll`.
  - Emits filter events with `BillService.callXFunction`/`callYFunction` to sync tabs across components.
- **`FullStoryComponent`**
  - Fetches a single bill (`BillService.getFullStory`).
  - Generates shareable copy, updates meta tags for SEO, and allows users to follow bills through the backend (requires Cognito tokens).
  - Guards browser-only APIs with `isPlatformBrowser` during SSR.

## Subscriber Intelligence
- **`SubscribersPageComponent`** – Focused view for a representative (`/subscriber-view/:id`). Surfaces voting history, subscribed users, and quick actions. Uses multiple `BillService` endpoints and mirrors the sharing helpers used in `FullStoryComponent`.

## Authentication & Onboarding (`src/app/auth`)
- **`RegisterComponent` / `LoginComponent`** – Capture credentials and call `AuthenticateService` for Cognito operations.
- **`OtpVerificationComponent`** – Confirms email codes before unlocking `/plans`.
- **`ResetPasswordComponent` / `CreateNewPasswordComponent`** – Forgot password flow built on Cognito APIs.
- **`PlansComponent`** – Lazy-loads Stripe pricing tables and embeds subscription options. Ensure browser guards stay intact when modifying the script loader.
- Shared guards (`auth.guard.ts`) redirect users based on authentication state.

## Informational Pages
- **`AboutComponent`** – Marketing content with the standard shell.
- **`PrivacyPolicyComponent`, `TermsAndConditionsComponent`** – Legal content embedded in dialogs or dedicated sections.

## Shared Utilities (`src/app/shared`)
- **`TruncatePipe`** – Limits text length for story cards and summaries.
- Shared directives/module exports live under `src/app/shared` and can be imported into standalone components as needed.

When adding new components, prefer the standalone pattern (`standalone: true`) and co-locate templates (`*.html`) and styles (`*.scss`) beside the TypeScript file. Update this document to outline responsibilities and interactions for any new screens.
