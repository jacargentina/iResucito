# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

iResucito is the definitive app for the Neocatecumenal Way's Brother: a songs/psalms repository with liturgical categorization and Word/Eucharist celebration lists, available as a mobile app (React Native/Expo) and a web app (Remix). Songs and translations are collaboratively edited via the web app.

## Monorepo layout

Yarn (v4, Berry) workspaces, package manager pinned via `packageManager` in root `package.json`. No single global build tool — each package builds independently.

- `packages/core` — `@iresucito/core`: shared domain logic (song parsing, PDF generation via `pdfkit`, patches, Dropbox integration). Dual-published as CJS + ESM + type declarations (`dist/cjs`, `dist/esm`, `dist/types`). Contains the song data assets (`assets/songs/*.json`, `assets/songs.json`).
- `packages/native` — `@iresucito/native`: React Native / Expo app (iOS/Android), Expo Router-free navigation via `@react-navigation`, state via `zustand`, UI via `@gluestack-ui`.
- `packages/web` — `@iresucito/web`: Remix + Vite web app, deployed to Vercel. Depends on both `core` and `native` (reuses native components/screens where possible).
- `packages/translations` — `@iresucito/translations`: i18n strings (`langs/`).
- `packages/scripts` — one-off Node/TS maintenance scripts for song data (renaming, migrating, fixing patches, translation helpers). Not part of the build graph; run manually with `esno`/`ts-node` as needed.

Workspace packages reference each other with `"*"` and resolve via Yarn workspaces — no need to `yarn add` local packages, just import `@iresucito/core`, `@iresucito/translations`, etc.

## Build & run

Root:

```
yarn build          # yarn workspaces foreach -A run build
```

Per package:

```
# core
cd packages/core && yarn build        # builds cjs + esm + types
cd packages/core && yarn test         # esno src/test.ts (NOT jest — see note below)

# native (Expo)
cd packages/native && yarn start      # expo start --ios
cd packages/native && yarn ios        # expo run:ios
cd packages/native && yarn android    # expo run:android
cd packages/native && yarn test       # jest --watch

# web (Remix)
cd packages/web && yarn dev           # remix vite:dev
cd packages/web && yarn build         # remix vite:build
```

**Note on `core` tests**: `jest.config.js` in `packages/core` is currently broken/unused (see the `test-no-funciona` script and comments inside `jest.config.js`). The actual test entry point is `src/test.ts`, run via `yarn test` (esno). Don't assume jest works there without checking `jest.config.js` first.

`packages/native` has a `postinstall` script that runs `yarn build` at the repo root — installing native's deps rebuilds `core`/`translations`. Keep this in mind if a build seems to run unexpectedly during `yarn install`.

## Code style

- Prettier: 2-space tabs, single quotes, no tabs, `bracketSameLine: true`. Run via editor/prettier, no separate lint script wired at root — check for `.prettierignore` before formatting generated/asset files.
- TypeScript everywhere (`core`, `native`, `web`, `translations`, most of `scripts`).
- `core` is `"type": "module"` (ESM) but also builds a CJS output for RN/Metro compatibility — when touching `core`, be mindful of both `tsconfig.cjs.json` and `tsconfig.esm.json`.

## Song data model (important domain knowledge)

Song content lives in `packages/core/assets/songs/<locale>.json` (`es`, `en`, `it`, `pt-BR`, `pt-PT`, `fr`; `es` is the source/main language). Each entry is keyed by a numeric **locale index** and has `name` (title + source) and `source` (lyrics/content).

Every song is also registered in the **Global Songs Index** at `packages/core/assets/songs.json`, keyed by a numeric song id, with liturgical metadata (`stage`, `lutes and vespers`, `entrance`, `communion`, etc.) and a `files` map from locale code → locale index in that language's JSON.

When adding/editing songs: update both the per-locale content file AND the global index's `files` mapping. The `packages/scripts` directory has existing helpers for common song-data operations (renaming, migrating locales, fixing patches, checking for missing translations) — check there before writing new one-off scripts.

## Native app specifics

- Expo-managed workflow (`expo prebuild`, `eas build`); `android/` and `ios/` are generated/native project dirs — avoid hand-editing generated native config unless necessary, prefer Expo config plugins (see `packages/native/plugins`).
- Publishing/versioning uses `standard-version` (`npm run publish` bumps patch version, then triggers EAS builds for iOS/Android with auto-submit). Do not run publish/EAS commands without explicit user confirmation — they trigger real store submissions.
- Release APK signing and Sentry config require local secrets (`~/.gradle/gradle.properties`, `sentry.properties`) not committed to the repo — see `README.md` for the exact keys needed.

## Web app specifics

- Remix + Vite, deployed on Vercel (`publish-web` root script: `vercel build && vercel deploy --prebuilt`). Treat any `vercel deploy` as a real deployment — confirm with the user before running.
- Server-side auth via `remix-auth`, sessions via `session.server.tsx`.
- Reuses UI/logic from `@iresucito/native` where possible — check `packages/native/components` and `packages/native/screens` before duplicating UI in `web`.

## Cross-cutting notes

- Don't touch `node_modules`, `.expo`, `dist`, or `build` directories — they're generated.
- `README.md` documents two live troubleshooting notes (Metro/i18n-js import error, Sentry org slug) — check there first for known build issues before treating them as new bugs.
