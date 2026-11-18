# Tests per package

Give every workspace package a working `test` script, fix the broken core jest setup, and add a root `yarn test`.
Runner decision: Vitest for core/translations/web, jest-expo for native.

## Specs

- S1: "mejoremos el proyecto para tener tests en cada package" — packages in scope: core, translations, native, web.
- S2: "mira en packages/core/jest.config.js el comentario para ver si se puede mejorar / solucionar" — core tests must run; root cause documented (ESM `@iresucito/translations` dist not transformed by ts-jest; `module.exports` in a `"type": "module"` package).
- S3: Runner: "Vitest + jest-expo" (Vitest in core/translations/web, jest-expo in native).
- S4: Root: "Solo `yarn test` raíz" — `yarn workspaces foreach -A run test`, no CI.

## Tasks

- T1 [S1,S2,S3] core: replace jest with vitest, migrate transport test, add parser tests, drop broken config/scratch — inline — commit: df5ef2ea
- T2 [S1,S3] translations: vitest + locale key parity test — inline — commit: 807c176f
- T3 [S1,S3] web: vitest + tests for pure helpers — inline — commit: 31b872b1
- T4 [S1,S3] native: jest-expo + smoke test, non-watch `test` script — inline — commit: 2a1ce148
- T5 [S4] root `yarn test` + AGENTS.md/README docs — inline — commit: this commit

## Log

- L1: "mejoremos el proyecto para tener tests en cada package; además mira en packages/core/jest.config.js el comentario para ver si se puede mejorar / solucionar"
- L2: User chose runner "Vitest + jest-expo"; scope core, translations, native, web; root "Solo `yarn test` raíz".
- L3: Evidence: ts-jest js-with-ts preset + .cjs config made transport.test.ts pass 2/2 in a scratch config; root cause is the ESM translations dist, not i18n-js.
- L4: Finding: fr, lt-LT, pt-BR lack the whole `songs.*` section (11 keys, fallback to en). Parity test pins the current gaps as a known list so new gaps fail; data fix out of scope.
- L5: Finding: getSongItem translates `songs.clamp` with the global i18n.locale, ignoring its locale argument; test pins current behavior.
- L6: Finding: native babel.config.js found babel-preset-expo only via hoisting (nested under expo); declared explicitly with @babel/runtime. jest-expo 58 needs @react-native/jest-preset peer.
- L7: Verified: root `yarn test` exit 0 — core 12, translations 29, native 2, web 3 (46 tests). Babel transform of App.tsx with the real config ok; expo-doctor failures (metro disableHierarchicalLookup, react-native-web peer, RN Directory) pre-exist.
