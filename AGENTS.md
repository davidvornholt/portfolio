# AGENTS.md

## Project Context

- **Runtime:** Bun (Latest)
- **Monorepo:** Turborepo
- **Linter/Formatter:** Biome
- **Architecture:** Functional Programming via Effect TS
- **Validation:** Effect Schema (Native)

## Core Research & Analysis Protocol (MANDATORY)

To produce high-quality output, you MUST adhere to the **"Research First, Code Second"** methodology. **Guessing is strictly forbidden.**

### 1. Comprehensive Context Research

**Before writing or modifying a single line of code**, you MUST:

- **Explore the Codebase:** Use search tools to identify existing patterns, shared utilities, and Effect Layers. Do not reinvent the wheel.
- **Trace Dependencies:** Understand *who* calls the function you are editing and *what* downstream services depend on it.
- **Read Definitions:** strictly check Type/Schema definitions. Do not infer types based on variable names.

### 2. Deep Request Understanding

- **Analyze Intent:** Do not just read the task; understand the *goal*. Why is this change needed?
- **Identify Conflicts:** Check if the request conflicts with existing architectural constraints (e.g., "Add a `try/catch` block" conflicts with "Use Effect Error Handling").
- **Ask Before Acting:** If the request is ambiguous, ask clarifying questions instead of making an executive decision.

If you find yourself making an arbitrary decision (e.g., "I'll just default the timeout to 500ms" or "I'll assume the user ID is an integer"), **STOP**.

- Ask the user for the specific constraint.
- **NEVER** assume business logic constants.

## Skill Utilization

This project uses a specialized knowledge base located in `.agents/skills/`.
**Before generating code**, you MUST check if a relevant Skill exists for your task.

### Mandatory Skill Triggers

- **Next.js Data & Caching Strategy**
  - **Trigger:** When writing Server Components, utilizing `fetch`, implementing caching, or modifying API routes (`route.ts`).
  - **Action:** You **MUST** consult the **[Next Cache Components Skill][next-cache-components-skill]** to ensure proper memoization, revalidation tags, and hydration compatibility.
- **UI/UX & Frontend Polish**
  - **Trigger:** When creating `.tsx` components, modifying CSS/Tailwind classes, or adjusting layout structure.
  - **Action:** You **MUST** apply the principles from the **[Frontend Design Skill][frontend-design]**. Do not output generic UI; enforce visual hierarchy, consistent spacing, and accessibility compliance.
  - **Styling Rule:** You **MUST** use Tailwind CSS for all styling. Do not introduce or use plain CSS, CSS Modules, styled-components, or inline style objects unless explicitly requested.
  - **Icon Rule:** You **MUST** use `lucide-react` for icons. Do not manually create SVG icons unless explicitly requested.
  - **Toast Rule:** You **MUST** use `sonner` for toast notifications. Do not use `react-hot-toast`, `react-toastify`, or any other toast library.
  - **Square Sizing Rule:** When an element has equal width and height, use the `size-*` utility (e.g., `size-8`) instead of separate `w-* h-*` pairs (e.g., `w-8 h-8`).
- **shadcn/ui Components**
  - **Trigger:** When adding any UI primitive or generic interactive component (buttons, dialogs, dropdowns, selects, inputs, tables, tabs, cards, badges, alerts, tooltips, popovers, sheets, accordions, etc.).
  - **Action:** You **MUST** consult the **[shadcn/ui Skill][shadcn-ui]** first. Check whether a shadcn/ui component already exists for the need before hand-coding one. If one exists, install it with `bunx --bun shadcn@latest add @shadcn/<component>` and adapt it to comply with this file's rules. Always prefer shadcn/ui over manually creating generic UI components.

## Critical Constraints (MUST FOLLOW)

### Package Management & Runtime

- **Strictly use Bun:** `bun install`, `bun add`, `bun run`.
- **NEVER use:** `npm`, `yarn`, `pnpm`, `node`, `ts-node`.
- **Forbidden Package:** NEVER use or add `@effect/schema`. It has been merged into the main `effect` package and is deprecated.
- **Scripts:** Use `bunx` instead of `npx`.
- **Database Tooling:** For database-related work, use Drizzle unless the user explicitly requests a different tool.
- **Environment:** Bun loads `.env` automatically. Do not use `dotenv`.
- **Dependency Management (STRICT):**
  - **ALWAYS** use `bun add <package>` to install new dependencies.
  - **NEVER** manually edit `package.json` to add/update versions.

### Build & Monorepo

- **Turborepo:** Use topological dependencies (`"dependsOn": ["^build"]`).
- **Workspace Imports:** ALWAYS use package aliases (e.g., `import { Button } from "@my-repository/ui"`).
- **Forbidden:** **NEVER** use relative paths to import from other packages (e.g., `../../packages/ui`).
- **Script Definitions (Workspace Packages):** Script values MUST be:
  - `check-types`: `tsc --noEmit`
  - `lint`: `biome check --error-on-warnings`
  - `lint:fix`: `biome check --write --error-on-warnings`
  - `test`: `bun test` (**do NOT** use `--pass-with-no-tests`)
- **Operational Workspace Scripts:** Feature-specific operational scripts belong in the owning workspace package (for example `db:generate` and `db:migrate` in `apps/bible-db`), and the root `package.json` should invoke them through `turbo run <task> --filter=<workspace>`.
- **Turborepo Ownership Pattern (Recommended):**
  - The workspace that owns the concern defines the concrete script and any tool-specific dependencies.
  - The root `package.json` exposes convenience wrappers that delegate through Turbo with an explicit `--filter`.
  - Add matching task definitions in `turbo.json` when caching, outputs, or side effects need to be declared.
- **Unified Checks:** Define `check` and `check:fix` in the root `package.json` only:
  - `check`: `turbo run lint check-types test`
  - `check:fix`: `turbo run lint:fix check-types test`
  - Package-level workspaces must expose `lint`, `lint:fix`, `check-types`, and `test`, and may also expose workspace-owned operational scripts such as `db:*` when they follow the ownership pattern above.

### Bun Native APIs

- **Files:** Use `Bun.file()`. **NO** `node:fs`.
- **Shell:** Use Bun Shell (`` Bun.$`ls` ``). **NO** `execa` or `child_process`.
- **Testing:** Use `bun:test`. **NO** `jest` or `vitest`.

## Monorepo Package Standards (STRICT)

### 1. Structure & Naming

- **Alias Placeholder Convention:** Use `@my-repository/*` as the documentation example for workspace aliases, and ALWAYS customize that alias to the real project name in the actual repository.
- **Scope:** ALL packages MUST be named `<actual-project-alias>/<package-name>` using the repository's real customized alias (for example `@my-repository/<package-name>` in documentation examples).
- **Versioning:** ALL internal packages MUST be set to version `"0.0.0"`. Do not attempt to version internal packages independently.
- **Internal Dependencies:** When adding a dependency on another workspace package, you MUST use the `workspace:*` protocol to ensure the local version is always used.
  - *Correct:* `"@my-repository/ui": "workspace:*"` (replace `@my-repository` with the actual project alias in the real repo)
  - *Incorrect:* `"@my-repository/ui": "^1.0.0"`

### 2. Configuration Inheritance

- **Shared Config:** You MUST create/maintain a `packages/typescript-config` workspace.
- **No Standalone Configs:** NEVER create a `tsconfig.json` from scratch. ALL packages MUST extend the shared configuration.

### 3. Public API Definition (Exports)

- **Encapsulation:** You MUST use the `exports` field in `package.json` to explicitly define the public API.
- **Deep Imports:** Prevent consumers from importing internal files by only exposing specific entry points.

## Quality Control & Workflow (MANDATORY)

### 1. Test-Driven Development

- **New Logic:** You MUST create a comprehensive Unit Test suite for every new Effect, Schema, or Utility created.
- **Existing Logic:** If you modify code, you MUST update the corresponding tests.
- **Coverage:** Tests must cover happy paths **AND** failure paths (`Effect.fail`, schema errors).
- **Type System Rule:** Do NOT write tests for what the type system already guarantees. If TypeScript or Effect Schema makes an invalid state unrepresentable at compile time, a test for that case is redundant noise.
- **UI/Page Changes (Minimal Rule):** For UI/page wiring or rendering changes, add a minimal focused test set that covers at least one success path and one failure/empty-state path. This can be satisfied via extracted view-model/helper tests used by the changed UI/page files. Exhaustive UI snapshot/component coverage is optional unless critical behavior changes.

### 2. The "Definition of Done" Loop

You are NOT done until you have successfully executed the following sequence with **Zero Errors** and **Zero Warnings**:

1. **Mandatory Test Verification (before running the check):**
    - **New Logic:** Verify that *every* new Effect, Schema, or Utility has a corresponding unit test.
    - **Changed Logic:** Verify that existing tests were updated to reflect behavior changes.
    - **Rule:** If you have written code but have not written/updated the tests for it, **YOU ARE NOT DONE.** Stop here and write the tests.
2. **Mandatory Documentation & Examples Verification:**
    - **Search** the entire workspace for references to any concept, variable, path, service, or configuration you changed. This includes READMEs, `.env.example` files, inline doc-comments, and any other prose or configuration that mentions the affected area.
    - **Update** every stale reference so that documentation, examples, and configuration templates stay consistent with the code.
    - **Rule:** If your change alters environment variables, storage paths, service names, API signatures, architectural patterns, or error types and you have not updated the corresponding documentation, **YOU ARE NOT DONE.** Stop here and fix the docs.
3. **Run Unified Check:** `bun run check:fix` (Root script: `turbo run lint:fix check-types test`. Runs type checks, Biome auto-fix, and tests. Ensure all pass—**including the new tests you just verified in Step 1**).

*If any step fails, or if you realize during Step 1 that tests are missing, analyze the gap, write/fix the code, and restart the sequence from the beginning.*

## Debugging Protocol (NO RANDOM FIXES)

If you encounter an error (test failure, build error, or runtime crash), you MUST follow this protocol. **Guessing is FORBIDDEN.**

1. **Read & Analyze:**
    - Read the *entire* stack trace, not just the last line.
    - Identify the specific file, line number, and Effect/Schema involved.
2. **Reproduction:**
    - Create a minimal reproduction case or a failing test *before* attempting a fix.
    - If you cannot reproduce it locally, add `Effect.log` instrumentation to trace the data flow.
3. **Root Cause Identification:**
    - State the root cause clearly in your thought process.
    - *Example:* "The Schema expects a string, but the API returns a number."
    - *Bad:* "Maybe it's the date format, let me try changing it."
4. **The "Two-Strike" Rule:**
    - If you attempt a fix and it fails: **STOP.**
    - Do not try a "quick variation."
    - Re-read the error. Check the architecture.
    - If 2 fixes fail, the problem is likely architectural. **Request human intervention** or refactor the approach entirely.

## Database & Migrations (MANDATORY)

- **Default to Drizzle:** For schema definition, migration generation, and database migration execution, use Drizzle unless the user explicitly instructs otherwise.
- **Own DB Scripts in the DB Workspace:** Database commands such as `db:generate` and `db:migrate` must live in the database-owning workspace package (for example `apps/bible-db/package.json`).
- **Root Delegation:** The root `package.json` should call workspace-owned database scripts via Turbo wrappers (for example `turbo run db:generate --filter=@my-repository/bible-db`), replacing `@my-repository` with the actual project alias in the real repo.
- **Never Handwrite Migrations:** Do not create SQL migration files manually. Generate migrations with Drizzle Kit from the schema source of truth.
- **Drizzle Convention:** Keep `drizzle.config.ts` in the owning workspace, keep generated SQL under that workspace's `drizzle/` directory, and commit the generated migration plus the `drizzle/meta/` journal files together.
- **Workflow:** After changing schema definitions, run the workspace-owned `db:generate` script to create the migration, review the generated SQL, then run the workspace-owned `db:migrate` script, which should call `drizzle-kit migrate`, against the target database.
- **Driver Requirement:** The database-owning workspace must keep a Drizzle-supported driver installed for `drizzle-kit migrate` (for Postgres: `pg`, `postgres`, `@neondatabase/serverless`, or `@vercel/postgres`).
- **No Runtime Auto-Migrations:** Do not wire application runtime code to auto-run migrations unless the user explicitly requests that architecture. Default to the committed Drizzle Kit migration flow.
- **Single Source of Truth:** Application runtime schema setup must not drift from generated Drizzle migrations. Prefer Drizzle Kit-managed migrations over parallel hand-maintained SQL strings or ad hoc runtime migration wrappers.

## Project Architecture (MANDATORY)

### 1. Domain-Based Folder Structure

ALL source code MUST live inside a **`src/`** directory at the root of each app/package. The following top-level structure within `src/` is required:

- **`features/`** — All product domain logic. Each feature is a self-contained folder (e.g., `features/auth/`, `features/player/`, `features/feed/`). A feature owns its own components, services, schemas, hooks, and tests.
- **`shared/`** — Reusable, domain-agnostic code. Only place code here when it is genuinely consumed by two or more features. Organise by concern (e.g., `shared/ui/`).
- **`app/`** (Next.js / Expo) — Route entrypoints ONLY. No business logic, no data-fetching, no UI components beyond a thin composition of feature components. Its sole responsibility is wiring routes to features.

**Forbidden:**

- Placing business logic directly in the `app/` folder.
- Importing from one feature into another directly (cross-feature coupling). If shared logic is needed, move it to `shared/`.
- Flat, type-based structures like a top-level `components/`, `hooks/`, or `utils/` that mixes concerns from multiple domains.

### 2. File Size & Splitting

- **Hard limit:** A single file MUST NOT exceed ~200 lines. If it does, it is a signal to split.
- **One concern per file:** A file should have a single, clear purpose. A file that contains a service, its schema, and its error types is three files.
- **Component granularity:** Extract any JSX block that is conditionally rendered, repeated, or logically distinct into its own component file within the relevant feature or `shared/ui/` folder.

### 3. DRY (Don't Repeat Yourself) — Strictly Enforced

- **Before writing new logic**, search the codebase for an existing implementation. Reuse or extend it.
- **Three-strike rule for duplication:** If you write the same logic a second time, extract it immediately. A third occurrence is never acceptable.
- **Schemas and error types are not exempt:** Do not redefine a schema or a `Data.TaggedError` that already exists elsewhere. Import and reuse it.
- **Shared UI patterns:** If a visual pattern (e.g., a loading skeleton, an empty-state view) appears in more than one feature, it belongs in `shared/ui/`.

## Coding Standards

### TypeScript & Biome

- **Strictness:** No `any`. Use `unknown` + Schema decoding.
- **Exports:** **NO Default Exports**. Use Named Exports only. Prefer **inline exports** (`export const myVar = …`) over declaring then exporting separately (`const myVar = …; export { myVar }`). Inline exports keep intent visible at the declaration site and are safer during refactors.
  - *Exception:* Next.js conventions require Default Exports for `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts`.
- **Imports:** Use `import type` for types. Group imports: External > Internal.
- **Naming:** `kebab-case` for files/folders. `camelCase` for variables/functions. `PascalCase` for Types/Classes.
- **Immutability:** Use `const`, `readonly`, and `ReadonlyArray<T>`.
- **Functions:** Always prefer arrow function expressions assigned to `const` over `function` declarations. Use `const myFunction = () => {}` instead of `function myFunction() {}`.
  - *Exception:* `function*` generators (e.g., `Effect.gen(function* () { ... })`) where arrow syntax is not applicable.

### Effect TS Architecture (Strict)

This project uses **Effect TS** for all logic, async, error handling, and validation.

1. **No Exceptions:** Never `throw`. Return `Effect<Success, Error>`.
2. **No Promises (Internal Logic):** Do not use `async/await`. Use `Effect.gen`.
   - *Exception (Integration Boundary):* Next.js Server Components, Route Handlers and Server Actions **MUST** be `async` functions to bridge the gap. They should call `await Effect.runPromise(program)` to resolve the Effect into data for the UI.
3. **Generator Syntax:** ALWAYS use `yield*` (delegating yield) for Effects. Never use plain `yield`.
4. **Logging:** Use `Effect.log`, `Effect.logInfo`, `Effect.logError`. **NO** `console.log`.
5. **Control Flow:** Use `Effect.match`, `Effect.if`, or `pipe()`. Avoid native `if/else` for flow control.
6. **Validation:** Use `Schema` from `effect`. **NO** `zod`, `joi`, or `yup`.

## Next.js / React Patterns (Frontend Workspace Only)

When working within Next.js apps (e.g., `apps/web`):

### 1. Server Components & Effect Integration

Next.js Server Components are the **boundary** where Effect logic resolves to UI.

- **Pattern:** Create the logic as an Effect, then run it in the Page.

### 2. Caching Strategy

- **Preferred:** Use Next.js Native Caching (`use cache` directive) for UI data.
- **Skill Reference:** Refer to the **[Next Cache Components Skill][next-cache-components-skill]** for implementation details.
- **Do Not:** Do not use `Bun.redis` directly inside UI components. Use Redis only within backend Effect Services/Layers.

### 3. Accessibility & SEO

- **Accessibility (a11y):** All UI must meet WCAG 2.2 AA. Use semantic HTML elements, proper heading hierarchy, ARIA attributes where needed, visible focus indicators, and keyboard-navigable interactions. Never rely solely on color to convey meaning.
- **SEO:** Use Next.js `Metadata` API for page titles, descriptions, and Open Graph tags. Use semantic landmarks (`<main>`, `<nav>`, `<header>`, `<footer>`). Ensure all images have descriptive `alt` text. Prefer server-rendered content over client-only rendering for indexable pages.

### Naming Dictionary

- **Network:** Use `fetch` (not `retrieve`, `download`).
- **Getters:** Use `get` (not `read`, `load`).
- **Setters:** Use `set` (not `write`, `update`).
- **Booleans:** Prefix with `is`, `has`, `can`.

## Comments & Documentation

- **Self-Documenting Code:** Code must be readable without comments.
- **Allowed Comments:** TODOs, explanations of *complex* regex/math, or "Why" (intent).
- **Forbidden:** Commented-out code, redundant comments (e.g., `// sets user`).

## Code Patterns (Do This, Not That)

### 1. Error Handling (Tagged Errors)

**BAD (Generic Errors):**

```ts
class UserError extends Error {}
// usage
return Effect.fail(new UserError("oops"));
```

**GOOD (Data.TaggedError):**

```ts
import { Data, Effect } from "effect";

// Definition
class UserNotFound extends Data.TaggedError("UserNotFound")<{
  id: string;
}> {}

// Usage
const getUser = (id: string) =>
  Effect.gen(function* () {
    const user = yield* db.select(id);
    if (!user) {
      return yield* Effect.fail(new UserNotFound({ id }));
    }
    return user;
  });
```

### 2. Dependency Injection & Testing

**BAD (Class Constructor):**

```ts
class UserService {
  constructor(private db: Database) {}
}
```

**GOOD (Context & Layers):**

```ts
// Service Definition
class Database extends Context.Tag("Database")<
  Database,
  { readonly select: (id: string) => Effect.Effect<User | null> }
>() {}

// Logic
const program = Effect.gen(function* () {
  const db = yield* Database;
  // Note the usage of yield*
  return yield* db.select("123");
});

// TEST (Mocking)
import { test, expect } from "bun:test";

test("returns user from db", async () => {
  const mockDb = Layer.succeed(Database, {
    select: () => Effect.succeed({ id: "123" }),
  });

  // Run the effect with the mock provided
  const result = await Effect.runPromise(
    program.pipe(Effect.provide(mockDb))
  );

  expect(result).toEqual({ id: "123" });
});
```

### 3. Validation & Schemas

**BAD (Zod):**

```ts
import { z } from "zod";
const User = z.object({ id: z.string() });
const data = User.parse(input); // Throws!
```

**GOOD (Effect Schema):**

```ts
import { Schema } from "effect";

// Definition
class User extends Schema.Class<User>("User")({
  id: Schema.String,
  email: Schema.String,
}) {}

// Usage (Pipeline)
const parseUser = (input: unknown) =>
  Schema.decodeUnknown(User)(input); // Returns Effect<User, ParseError>
```

[next-cache-components-skill]: ./.agents/skills/next-cache-components/SKILL.md
[frontend-design]: ./.agents/skills/frontend-design/SKILL.md
[shadcn-ui]: ./.agents/skills/shadcn/SKILL.md
