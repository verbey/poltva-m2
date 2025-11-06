# Contributing to Poltva-M2

Thank you for your interest in contributing to **Poltva Matrix Messenger (Poltva-M2)**!  
This document outlines how to report issues, suggest features, and submit code changes in a way that keeps the project consistent and maintainable.

## Bug Reports and Feature Suggestions

Please submit **bug reports** and **feature suggestions** via [GitHub Issues](https://github.com/your-username/poltva-m2/issues).  
When creating a new issue, try to include as much detail as possible—steps to reproduce, screenshots, logs, or references to related issues or PRs are all helpful.

## Pull Requests

Before submitting a pull request, please make sure your changes align with the existing code style and project organization.  
Some of these conventions may later be enforced through automated linting rules.

### Project Structure

Poltva-M2 follows the [Bulletproof React project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).  
Please review it to understand how different parts of the app are organized.

### TypeScript Types and Interfaces

- Types and interfaces that are **shared across multiple components or hooks** should be placed in their **own separate files**.
- If a type or interface is **only used in one place**, it can be defined within the same file.

### Separation of Business Logic

We use **custom React hooks** to maintain separation between **UI** and **business logic**.  
Avoid placing both in the same component file — instead, move business logic into a dedicated hook.

### Test Files

- Test files for components and hooks should be located **in the same directory** as the code they test.
- Follow naming conventions such as `ComponentName.test.tsx` or `useHookName.test.ts`.

### Component and Hook Folders

We use a **hybrid folder approach**:

- Create a dedicated folder for a component or hook **only if** there are multiple related files (e.g., subcomponents, styles, tests).
- If a directory like `components/` or `hooks/` contains only a single file, it’s perfectly fine to keep it without a subfolder.

---

Thank you for considering contributing to Poltva-M2 — your input means a lot!
