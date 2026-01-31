---
trigger: always_on
---

# TypeScript & Tech Stack Instructions

## Project Constraints

- **Runtime & Package Manager:** Use **Bun** for all package management (`bun install`, `bun add`), script execution, and runtime needs.
- **Build System:** Use the latest version of **Turborepo** for task orchestration.
- **Formatting/Linting:** Use **Biome**. Do not use Prettier or ESLint.
- **Naming:** Use `kebab-case` for all file and directory names.

## Monorepo & Build System (Turborepo)

- **Configuration:** Maintain a root `turbo.json` to define the task pipeline (e.g., `build`, `test`, `lint`).
- **Dependencies:** Use topological dependencies (e.g., `"dependsOn": ["^build"]`) to ensure libraries build before consumers.
- **Caching:** Explicitly define `outputs` (e.g., `dist/**`) and `inputs` in `turbo.json` to maximize local and remote cache hits.
- **Integration:**
  - Configure the root `package.json` to specify `"packageManager": "bun@<version>"`.
  - Ensure Turbo tasks invoke **Biome** for the `lint` and `format` lifecycle scripts.

## Type Safety & Definitions

- **No Any:** Never use `any`. Use `unknown` if the type is truly not known yet, then refine via narrowing.
- **Explicit Returns:** Explicitly annotate the return type of *all* functions and methods to prevent accidental type widening.
- **Type Definitions:**
  - Prefer `type` aliases over `interface` for consistency and to avoid interface merging behavior, unless extending a third-party library interface is strictly required.
  - Use `readonly` for all properties in types and `ReadonlyArray<T>` for arrays to enforce immutability at the compile level.
- **Literals:** Use `as const` assertions for literal arrays and objects to infer the narrowest possible type.
- **Strictness:**
  - Use discriminated unions for modeling complex state or polymorphic data (e.g., `{ status: 'loading' } | { status: 'success', data: T }`).
  - Prefer Union (`|`) and Intersection (`&`) types over class inheritance.

## Effect TS Architecture

*Since this project uses Effect TS, standard TypeScript patterns for async and error handling are superseded by Effect patterns.*

- **Error Handling:**
  - **Never throw exceptions.** All errors must be typed and returned as part of the `Effect<Success, Error, Requirements>` signature.
  - Use `Effect.fail` for expected errors and `Effect.die` for truly unrecoverable defects (bugs).
- **Asynchronous Code:**
  - Avoid `async/await` and `Promise`. Use `Effect.gen` and `yield*` for imperative-looking, synchronous-style Effect composition.
- **Control Flow:**
  - Use `Effect.match`, `Match.type`, or `Effect.if` instead of imperative `if/else` or `switch` statements for complex logic.
  - Use `pipe` for chaining transformations.
- **Pipelines:** Prefer Effect-native utility functions (e.g., `Effect.map`, `Effect.flatMap`, `Effect.all`) over manual looping.

## Functional Patterns

- **Arrow Functions:** Prefer `const myFunc = () => {}` over `function myFunc() {}` to preserve lexical scoping and consistency.
- **Data Manipulation:**
  - Avoid `for`, `for...of`, and `while` loops.
  - Use standard functional array methods (`map`, `filter`, `reduce`) for plain arrays.
  - Use `Effect.forEach` when iterating involves side effects.
- **Immutability:**
  - Never mutate objects or arrays. Use the spread operator (`...`) or non-mutating array methods (e.g., `toSorted()` instead of `sort()`).

## Data Validation & Imports

- **Validation:** Use the latest version of **Zod** for runtime validation, parsing, and defining domain schema boundaries (e.g., API responses, form inputs).
- **Imports:**
  - Avoid `import * as`. Use named imports to facilitate tree-shaking.
  - Group imports by type: external libraries first, then internal modules.
  - Use `import type { ... }` when importing types to assist the transpiler/bundler.
