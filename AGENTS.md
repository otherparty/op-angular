# Repository Guidelines

## Project Structure & Module Organization
- `src/app` contains standalone Angular components organized by feature (e.g., `stories`, `navbar`, `auth`). Shared pipes and services live in `src/pipes` and `src/services`.
- Route configuration resides in `src/app/app.routes.ts`; SSR-specific bootstrapping is under `main.server.ts` and `server.ts`.
- Static assets belong in `src/assets`; environment toggles live in `src/environments`.
- Build artifacts go to `dist/` and should not be tracked.

## Build, Test, and Development Commands
- `npm run watch` recompiles the browser bundle with live rebuilds for UI iteration.
- `npm run dev:ssr` launches the Angular SSR dev server defined in `angular.json`.
- `npm run build` produces the client bundle in `dist/browser`; use `npm run build:ssr` to emit both browser and server bundles.
- `npm test` runs Karma/Jasmine unit tests; append `--code-coverage` for coverage reports under `coverage/`.

## Coding Style & Naming Conventions
- TypeScript uses 2-space indentation, single quotes, and `camelCase` for variables/functions; components/services remain `PascalCase`.
- Prefer standalone components; expose shared UI via `src/app/shared`.
- Keep SCSS modular. Co-locate component styles and templates; use BEM-style class names when global styles are required in `styles.scss`.
- Run `npx ng lint` before commits when adjusting configuration-affecting files.

## Testing Guidelines
- Unit tests live beside their sources as `*.spec.ts`. Mirror the component/service name in the spec.
- Validate guards and directives with focused specs (`auth.guard.spec.ts` is the pattern).
- Ensure new behavior has at least one happy-path and one failure-path spec. Maintain or improve current coverage; generate reports with `npm test -- --code-coverage`.
- For SSR-specific changes, verify server bootstrap with `npm run dev:ssr` before opening PRs.

## Commit & Pull Request Guidelines
- Follow the existing history: short, imperative messages (`add story carousel`, `fix auth guard`). Scope each commit narrowly.
- Reference issue IDs in the message footer when available.
- PRs should describe the user-facing impact, summarize test evidence (`npm test`, `npm run dev:ssr`), and include screenshots or GIFs for UI updates.
- Tag reviewers on related feature areas (e.g., `stories`, `auth`) and call out any environment or API changes.

## SSR & Configuration Tips
- Environment variables map through `src/environments/*`; update both `environment.ts` and `.prod` variants.
- Proxy or security tweaks should go through `server.ts`; keep middlewares pure and reusable so the SSR build remains deterministic.
