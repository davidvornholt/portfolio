---
trigger: always_on
---

# Clean Code Guidelines

This file outlines the coding conventions, architectural principles, and best practices based on Robert C. Martin's "Clean Code." Apply these rules to generate high-quality, maintainable, and readable code.

## Core Philosophy

- **The Boy Scout Rule:** Always leave the code cleaner than you found it.
- **Readability:** Code is read far more often than it is written. Optimize for the reader, not the writer.
- **Craftsmanship:** Care about your code. Bad code rots and destroys project productivity over time.
- **No Broken Windows:** Do not tolerate bad designs, wrong decisions, or poor code. Fix them when you see them.

## Naming Conventions

- **Intention-Revealing:** Names must answer why it exists, what it does, and how it is used.
  - *Bad:* `int d; // elapsed time in days`
  - *Good:* `int elapsedTimeInDays;`
- **Avoid Disinformation:** Do not use words that have specific technical meanings (like `List`) unless the container is actually that type. Avoid similar names (`XYZControllerForEfficientHandlingOfStrings` vs `XYZControllerForEfficientStorageOfStrings`).
- **Make Meaningful Distinctions:** Avoid noise words (`Info`, `Data`, `Manager`, `the`, `a`). `NameString` is no better than `Name`.
- **Pronounceable & Searchable:** Use names that can be spoken and easily grepped. Single-letter names are only acceptable as local variables in short methods (e.g., loops).
- **No Encodings:** Do not use Hungarian notation. Do not prefix member variables (e.g., no `m_`). Do not encode interface implementations (e.g., no `IShapeFactory`; use `ShapeFactory` and `ShapeFactoryImpl`).
- **Class Names:** Nouns or noun phrases (e.g., `Customer`, `WikiPage`). Avoid verbs. Avoid "Manager", "Processor", "Data", or "Info" in class names.
- **Method Names:** Verbs or verb phrases (e.g., `postPayment`, `deletePage`).
  - Accessors/Mutators: `get`, `set`, `is`.
  - Constructors: Use static factory methods with names describing arguments (e.g., `Complex.FromRealNumber(23.0)`).
- **Pick One Word per Concept:** Don't use `fetch`, `retrieve`, and `get` for the same concept in different classes. Stick to one.

## Functions

- **Size:** Functions should be small. Then they should be smaller. Ideally < 20 lines.
- **Do One Thing:** Functions should do one thing. They should do it well. They should do it only.
- **One Level of Abstraction:** Statements within a function should be at the same level of abstraction.
- **Arguments:**
  - Ideal: 0 arguments (niladic).
  - Good: 1 argument (monadic).
  - Acceptable: 2 arguments (dyadic).
  - Avoid: 3+ arguments (triadic/polyadic). Wrap arguments in objects if necessary (e.g., `Circle makeCircle(Point center, double radius)`).
  - **No Flag Arguments:** Passing a boolean into a function is a terrible practice. It means the function does two things. Split the function.
- **No Side Effects:** Functions should not do hidden things (e.g., initializing a session inside `checkPassword`).
- **Command Query Separation:** Functions should either do something or answer something, not both.
- **Don't Repeat Yourself (DRY):** Eliminate duplication.

## Comments

- **Comments are Failures:** A comment means you failed to express yourself in code.
- **Don't Comment Bad Code:** Rewrite it.
- **Allowed Comments:**
  - Legal/Copyright headers.
  - Informative comments (e.g., explaining a RegEx pattern).
  - Explanation of Intent (why a decision was made).
  - Warning of consequences.
  - TODO comments.
  - Amplification (highlighting importance).
- **Forbidden Comments:**
  - Mumbling/Vague comments.
  - Redundant comments (e.g., `i++; // increments i`).
  - Misleading comments.
  - Mandated comments (e.g., Javadocs for every private method).
  - Journal comments (use Git instead).
  - Noise comments.
  - Closing brace comments.
  - **Commented-Out Code:** Delete it immediately. Source control remembers.

## Functional & Declarative Design

- **Paradigm Preference:** Prefer functional and declarative code over imperative and Object-Oriented state manipulation. Describe *what* needs to happen, not *how* flow control works.
- **Immutability:**
  - Default to immutable variables (`const`, `final`) and data structures.
  - **Avoid Mutation:** Do not change the state of objects in place. Return new instances with updated values.
- **No Loops:** Replace explicit `for` and `while` loops with functional pipelines (e.g., `map`, `filter`, `reduce`, `flatMap`, `stream`).
- **Composition over Inheritance:**
  - Avoid class inheritance hierarchies for code reuse.
  - Use composition, interfaces, or higher-order functions to combine behaviors.
- **Pure Functions:**
  - Functions should be deterministic (same input = same output).
  - **No Side Effects:** Isolate side effects (I/O, database writes, global state changes) to the boundaries of the system (the "imperative shell"). Core logic should be pure.
- **Data vs. Behavior:** Unlike strict OO (which couples data and behavior), prefer separating data (immutable DTOs/Records) from the functions that operate on them.

## Systems & Concurrency

- Strictly limit access to shared data.
- Use copies of data to avoid sharing.
- Threads should be independent (share nothing).
- Keep synchronized sections as small as possible.
- Shutting down properly is hard; plan for it early.
