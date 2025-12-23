---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Instructions

## General

- Explicitly annotate the return type of all functions.
- Use kebab-case for file and folder names.
- Use ESLint/Prettier conventions for formatting.

## Functional Style

- Suggest using the TypeScript Library Effect when applicable.
- Prefer functional utilities (e.g. map, filter, reduce) over loops where possible.
- Suggest pattern matching with Effect instead of nested conditionals.

## Type Safety

- Prefer readonly for immutability in types and interfaces.
- Use unknown over any.
- Prefer narrow types over wide/generic ones to increase type safety.
- Use discriminated unions for modeling complex state.
- Prefer union and intersection types over inheritance when possible.

## Best Practices

- Use const assertions for literals where beneficial.
- Prefer type aliases over interface unless extension is required.
- Use the latest Zod version for data validation and parsing.
- Suggest tree-shakable imports (avoid import * as).
- Prefer arrow function expressions over function declarations with the `function` keyword.