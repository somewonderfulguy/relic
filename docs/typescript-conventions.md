# TypeScript conventions

- Keep strict mode enabled in every TypeScript project.
- Prefer inferred types for local values and explicit types for public APIs.
- Use `import type` for type-only imports.
- Avoid `any`; use `unknown` and narrow it before use.
- Run `pnpm typecheck` before considering TypeScript changes complete.
