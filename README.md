# Poltva Matrix Messenger (Poltva-M2) <!-- Working title -->

## Description

**Poltva-M2** is a new Matrix messenger that aspires to be a feature-rich, stable, and user-friendly alternative to existing clients.  
The project is currently in **very early development**, so expect frequent changes to both the repository and this README.

## Technologies

### Core

- **Framework**: Next.js
- **Forms**: React Hook Form
- **State Management**: Zustand + Zod
- **Data Fetching**: TanStack Query

### Matrix

Matrix homeserver interactions are handled via the [`matrix-js-sdk`](https://github.com/matrix-org/matrix-js-sdk).  
Since both the SDK and the Matrix specification sometimes employ non-conventional practices — such as relying on server error responses to determine available authentication flows — parts of the SDK are wrapped with custom abstractions. This approach makes it easier to maintain and migrate the codebase in the future.

- **SDK**: matrix-js-sdk

### Styling

Styling is implemented using custom UI components built with **shadcn/ui** and **Tailwind CSS**.  
Currently, there are no strict design rules, but as the project evolves, a consistent design system and coding conventions will be established.

- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

### Theming

Poltva-M2 aims to support fully customizable themes that can be configured directly from within the app—similar to how theming works in Telegram.  
This feature is part of the long-term roadmap, with groundwork planned for future development.

- **Theme Provider**: next-themes
- **Custom Themes**: CSS variable contracts for colors, radii, fonts, etc.

### Testing

The goal is to achieve **~70% test coverage** across the codebase using the following tools and libraries:

- **Unit/Integration Testing**: Vitest
- **Component Testing**: React Testing Library (plus supporting libraries)

## Contributing

Thank you for your interest in contributing!  
Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file for detailed guidelines.
