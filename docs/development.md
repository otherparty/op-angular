# Development Workflow

This guide captures the key day-to-day tasks for developers working on Other Party UI.

## Prerequisites
- Node 18+ (match the version used by CI if available).
- npm 9+.
- Access to the Other Party backend and AWS Cognito user pool credentials.

## Install & Bootstrap
```bash
npm install
```
Environment defaults ship in `src/environments/environment.ts`. Duplicate any new keys into `environment.prod.ts` so production builds resolve the same contract. Avoid hard-coding secrets; prefer environment variables injected during deployment where possible.

## Local Development Servers
- **SPA bundle** – `npm run watch`
  - Serves the browser bundle on `http://localhost:4200/` with rebuilds on change.
- **SSR bundle** – `npm run dev:ssr`
  - Builds both server and browser bundles, then runs the Express host at `http://localhost:4000/`. Use this when testing SEO tags, redirects, or platform guards.
- **Production preview** – `npm run build:ssr && npm run serve:ssr`
  - Useful for smoke-testing the exact assets shipped in production (`dist/browser`, `dist/other-party-ui/server`).

## Testing & Quality Gates
- **Unit tests** – `npm test`
  - Run with `npm test -- --code-coverage` to generate HTML reports under `coverage/`.
- **Linting** – `npx ng lint`
  - Especially important after touching configuration or shared styles.
- **Manual QA tips**
  - Validate Cognito flows (register/login/reset) with test users.
  - Verify story search and infinite scroll against real backend data.
  - Confirm SSR renders critical routes (`/`, `/story/:id`) without throwing browser-only errors.

## Working with Authentication
- `AuthenticateService` wraps Cognito operations. Guard browser APIs (localStorage, window) with `isPlatformBrowser` before use.
- Token-intensive flows (Stripe subscription status, follow bill) require valid Cognito ID tokens. Use `getIdToken()` and handle `null` cases gracefully.
- Update `docs/authentication.md` or `src/services/README.md` when extending auth endpoints so other teammates know which headers/body fields are required.

## Backend & API Expectations
- Story data and subscription endpoints derive from `environment.baseURL` and `environment.billsURL`.
- `BillService` centralizes calls such as `getHeadLines`, `getFullStory`, and subscription management. Prefer adding new endpoints there.
- Use the existing `HeadersInterceptor` as a starting point if additional headers (auth, tracing) are needed globally.

## SSR Considerations
- Avoid direct DOM access in constructors. Use Angular lifecycle hooks (`ngAfterViewInit`) and `isPlatformBrowser` checks, as demonstrated in `PlansComponent` and `FullStoryComponent`.
- Remember that local storage and window are unavailable on the server; always guard them.
- When adding third-party scripts, ensure they fail gracefully during SSR or wrap initialization in browser guards.

## Pull Request Checklist
- [ ] Tests added/updated and `npm test` passes locally.
- [ ] `npm run dev:ssr` succeeds if the change touches SSR code or platform checks.
- [ ] Documentation updated (README, `docs/`, or inline comments) for new behavior.
- [ ] Screenshots/GIFs captured for visual changes (attach in the PR template).
- [ ] Reviewers tagged according to feature area (stories, auth, subscriptions).
