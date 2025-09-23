# Other Party UI

Other Party UI is an Angular 17 application that surfaces legislative stories, subscription plans, and account management flows for the Other Party platform. The app renders both on the client and server (Angular SSR) and integrates with AWS Cognito for authentication, Stripe for subscriptions, and a custom backend for story data.

## Highlights
- Curated legislative stories with infinite scrolling, search, and social share helpers.
- Deep-dive "Full Story" views with shareable messaging, meta tags, and follow actions.
- Auth flows (register, login, OTP verification, password reset) backed by AWS Cognito.
- Subscriber experience with bill tracking and cancellation via Stripe APIs.
- Server-side rendering powered by Express to support SEO and fast initial paints.
- Shared UI primitives (navbar, footer, dividers, pipes) designed for standalone components.

## Tech Stack
- Angular 17 standalone components with Angular Router
- Angular SSR Express host (`server.ts`) for hydration
- AWS Cognito (amazon-cognito-identity-js) and Stripe pricing table embeds
- RxJS for data flow, ngx-infinite-scroll for feed pagination, ngx-toastr for notifications

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environments**
   - Default dev settings live in `src/environments/environment.ts`.
   - Mirror changes in `environment.prod.ts` when adding new variables.
   - Backend endpoints are derived from `baseURL` and `billsURL`.
3. **Run the browser dev server**
   ```bash
   npm run watch
   ```
   Navigate to `http://localhost:4200/`. Builds rebuild incrementally.
4. **Run the SSR dev server** (tests both server and browser bundles)
   ```bash
   npm run dev:ssr
   ```

## Common Commands
- `npm run watch` – browser bundle with live rebuilds.
- `npm run dev:ssr` – SSR development server using settings from `angular.json`.
- `npm run build` – client bundle in `dist/browser`.
- `npm run build:ssr` – browser + server bundles.
- `npm run serve:ssr` – serve the production SSR build from `dist/other-party-ui`.
- `npm test` – Karma/Jasmine unit tests. Append `-- --code-coverage` for HTML reports under `coverage/`.

## Testing
- Place specs beside sources as `*.spec.ts`.
- Cover both happy and failure paths for new behavior.
- Guards and directives should have focused specs (see `src/app/auth.guard.spec.ts`).
- Generate coverage as needed via `npm test -- --code-coverage`.

## Project Structure
```
src/
  app/                Feature components and routes (standalone)
  services/           HTTP services, Cognito helpers, interceptors
  app/shared/         Shared pipes/directives/module utilities
  assets/             Static assets served with the app
  environments/       Environment toggles (`environment.ts`, `.prod`)
server.ts             Express host for Angular SSR
angular.json          CLI configuration, SSR targets, builder options
```
Refer to `docs/architecture.md` for a detailed tour of feature modules and data flow.

## Documentation
- [`docs/architecture.md`](docs/architecture.md) – feature map, routing, and data dependencies.
- [`docs/development.md`](docs/development.md) – local workflows, SSR tips, and linting/testing expectations.
- [`docs/authentication.md`](docs/authentication.md) – Cognito, Stripe, and guard behaviors.
- [`src/app/README.md`](src/app/README.md) – component-level reference for the main UI surfaces.
- [`src/services/README.md`](src/services/README.md) – service APIs and integration notes.

## Contributing
- Follow the short, imperative commit style (`add story carousel`).
- Reference relevant issues in commit footers when available.
- Run `npm test` (and `npm run dev:ssr` for SSR-touching changes) before opening a PR.
- See `docs/development.md` for branch workflow tips and environment updates.
