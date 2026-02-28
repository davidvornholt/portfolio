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

### 3. The "Zero Assumption" Rule

- **Never Assume State:** Do not assume a database record exists, a file path is correct, or an environment variable is set.
- **Verify Logic:** If you are unsure how a specific library function behaves, write a small investigation script or test to verify it first.

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

## Critical Constraints (MUST FOLLOW)

### Package Management & Runtime

- **Strictly use Bun:** `bun install`, `bun add`, `bun run`.
- **NEVER use:** `npm`, `yarn`, `pnpm`, `node`, `ts-node`.
- **Forbidden Package:** NEVER use or add `@effect/schema`. It has been merged into the main `effect` package and is deprecated.
- **Scripts:** Use `bunx` instead of `npx`.
- **Environment:** Bun loads `.env` automatically. Do not use `dotenv`.
- **Dependency Management (STRICT):**
  - **ALWAYS** use `bun add <package>` to install new dependencies.
  - **NEVER** manually edit `package.json` to add/update versions.

### Build & Monorepo

- **Turborepo:** Use topological dependencies (`"dependsOn": ["^build"]`).
- **Workspace Imports:** ALWAYS use package aliases (e.g., `import { Button } from "@repo/ui"`).
- **Forbidden:** **NEVER** use relative paths to import from other packages (e.g., `../../packages/ui`).
- **Script Definitions (Workspace Packages):** Script values MUST be:
  - `check-types`: `tsc --noEmit`
  - `lint`: `biome check --error-on-warnings`
  - `lint:fix`: `biome check --write --error-on-warnings`
  - `test`: `bun test` (**do NOT** use `--pass-with-no-tests`)
- **Unified Checks:** Define `check` and `check:fix` in the root `package.json` only:
  - `check`: `turbo run lint check-types test`
  - `check:fix`: `turbo run lint:fix check-types test`
  - Package-level workspaces should expose `lint`, `lint:fix`, `check-types`, and `test` only.

### Bun Native APIs

- **Files:** Use `Bun.file()`. **NO** `node:fs`.
- **Shell:** Use Bun Shell (`` Bun.$`ls` ``). **NO** `execa` or `child_process`.
- **Testing:** Use `bun:test`. **NO** `jest` or `vitest`.

## Monorepo Package Standards (STRICT)

### 1. Structure & Naming

- **Scope:** ALL packages MUST be named `@project-name/<package-name>`.
- **Versioning:** ALL internal packages MUST be set to version `"0.0.0"`. Do not attempt to version internal packages independently.
- **Internal Dependencies:** When adding a dependency on another workspace package, you MUST use the `workspace:*` protocol to ensure the local version is always used.
  - *Correct:* `"@project-name/ui": "workspace:*"`
  - *Incorrect:* `"@project-name/ui": "^1.0.0"`

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
2. **Run Unified Check:** `bun run check:fix` (Root script: `turbo run lint:fix check-types test`. Runs type checks, Biome auto-fix, and tests. Ensure all pass—**including the new tests you just verified in Step 1**).

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
- **Exports:** **NO Default Exports**. Use Named Exports only.
  - *Exception:* Next.js conventions require Default Exports for `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts`.
- **Imports:** Use `import type` for types. Group imports: External > Internal.
- **Naming:** `kebab-case` for files/folders. `camelCase` for variables/functions. `PascalCase` for Types/Classes.
- **Immutability:** Use `const`, `readonly`, and `ReadonlyArray<T>`.

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

## Interaction Protocol (Anti-Hallucination)

### 1. The "Ambiguity Check"

Before writing any code for a non-trivial request (>5 lines of logic), you MUST:

1. **Restate the Goal:** Briefly summarize what you are about to build.
2. **Identify Ambiguities:** If requirements are vague (e.g., "make it better"), you MUST ask for clarification.
3. **Propose a Plan:** List the files you will touch and the Effect layers/services you will use.
4. **Wait for Confirmation:** (Optional, but recommended for architectural changes) "Shall I proceed?"

### 2. Stop & Ask

If you find yourself making an arbitrary decision (e.g., "I'll just default the timeout to 500ms" or "I'll assume the user ID is an integer"), **STOP**.

- Ask the user for the specific constraint.
- **NEVER** assume business logic constants.

[next-cache-components-skill]: ./.agents/skills/next-cache-components/SKILL.md
[frontend-design]: ./.agents/skills/frontend-design/SKILL.md
