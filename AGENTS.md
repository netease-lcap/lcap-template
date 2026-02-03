# AGENTS.md - Coding Guidelines for AI Agents

This document provides coding standards, build commands, and best practices for AI agents working in this low-code application template monorepo.

## Project Overview

**Type:** Monorepo (pnpm workspaces + Turbo)  
**Frameworks:** Vue 3, Vue 2, React 18, Mini-programs (Taro)  
**Languages:** TypeScript 5.x, JavaScript  
**Build Tools:** Rspack, Webpack 4, Rollup, Turbo  
**Testing:** Jest 29.x with ts-jest  
**Requirements:** Node.js >= 18, pnpm >= 8

## Directory Structure

```
lcap-template/
├── packages/
│   ├── basic/              # Framework-agnostic utilities (Rollup + TypeScript)
│   │   ├── src/            # Source code (apis, init, router, sdk, types, utils)
│   │   ├── tests/          # Jest test files (*.spec.js)
│   │   ├── dist/           # Build output
│   │   └── typings/        # Generated TypeScript definitions
│   ├── vue3/source/        # Vue 3 template (Rspack)
│   ├── vue2/source/        # Vue 2 template (Vue CLI + Webpack)
│   └── react/source/       # React template (Rspack)
└── mini-folder/taro/       # Mini-program support
```

## Build, Test, and Lint Commands

### Root Level (Monorepo)

```bash
pnpm test                    # Run tests in all packages
pnpm build                   # Build all packages via Turbo
pnpm deploy                  # Deploy all packages
pnpm format:vue3             # Format Vue 3 code with Prettier
pnpm format:react            # Format React code with Prettier
pnpm doc                     # Generate TypeDoc documentation
```

### Basic Package (packages/basic)

```bash
npm run build                # Build Rollup + TypeScript types
npm run build:rollup         # Build with Rollup only
npm run build:types          # Generate TypeScript declarations only
npm test                     # Run Jest tests with coverage
npm run dev                  # Watch mode with yalc publish
npm run clean                # Remove dist/typings directories
npm run deploy               # Deploy to platform
npm run doc                  # Generate TypeDoc documentation
```

**Running a Single Test:**

```bash
# In packages/basic directory
npx jest tests/init/utils/list/list-sort.spec.js
npx jest -t "List sort integers"              # Run specific test by name
npx jest --watch                               # Interactive watch mode
npx jest --coverage                            # With coverage report
```

### Vue 3 (packages/vue3/source)

```bash
npm run dev                  # Rspack dev server with hot reload
npm run build                # Production build
npm run lint                 # ESLint with auto-fix
npm run format               # Prettier formatting
npm run lint:style           # Stylelint for CSS
npm run changelog            # Generate conventional changelog
npm run git-cz               # Commitizen for conventional commits
```

### Vue 2 (packages/vue2/source)

```bash
npm run serve                # Vue CLI dev server
npm run build                # Production build
npm run lint                 # ESLint with auto-fix
npm run format               # Prettier formatting
npm run lint:style           # Stylelint for CSS
```

### React (packages/react/source/pc)

```bash
npm run dev                  # Rspack dev server
npm run build                # Production build
npm run lint                 # ESLint with auto-fix
npm run format               # Prettier formatting
```

## Code Style Guidelines

### Formatting (Prettier)

- **Print width:** 120 characters (300 for .vue files)
- **Indentation:** 2 spaces (no tabs)
- **Quotes:** Single quotes
- **Semicolons:** Required
- **Trailing commas:** Always
- **Vue files:** Single attribute per line in templates

### Import Organization

1. Node/external modules first
2. Framework imports (Vue, React, Pinia, etc.)
3. Local utilities and components
4. Type imports last (when using TypeScript)

Example:

```typescript
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MyComponent } from '@/components';
import type { User } from '@/types';
```

### TypeScript Standards

- **Strict mode:** Enabled for React packages
- **No unused vars:** Must be addressed
- **Type safety:** Prefer explicit types over `any` (though `any` is allowed)
- **Path aliases:** Use `@/*` for `src/*` imports
- **Target:** ES6
- **Module:** ESNext with Node resolution

### Naming Conventions

- **Files:** kebab-case for components, utilities (e.g., `list-sort.spec.js`)
- **Components:** PascalCase (e.g., `MyComponent.vue`)
- **Functions:** camelCase (e.g., `listSort`, `formatDateTime`)
- **Constants:** UPPER_SNAKE_CASE for true constants
- **Types/Interfaces:** PascalCase (e.g., `UserProfile`)
- **Test files:** `*.spec.js` in `tests/` directory

### Vue-Specific Rules

- Component data must be a function
- Always use `:key` with `v-for`
- Never use `v-if` with `v-for` on same element
- No async in computed properties
- No duplicate keys/attributes
- Require exact modifier for `v-on` when needed
- Use v-bind/v-on shorthand (`:prop` and `@event`)

### React-Specific Rules

- Follow React Hooks rules (via `eslint-plugin-react-hooks`)
- Use React Refresh for fast refresh in development
- TypeScript ESLint recommended rules apply
- `@ts-ignore` comments are allowed when necessary

### Error Handling

- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors appropriately (use logging utilities in `packages/basic/src/apis/log`)
- Handle null/undefined checks for optional properties

Example:

```typescript
try {
  const result = await fetchData();
  return result;
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw new Error('Data fetch failed');
}
```

## Testing Guidelines

### Test Structure

- **Location:** `packages/basic/tests/`
- **Naming:** `*.spec.js`
- **Framework:** Jest 29.x with ts-jest
- **Environment:** jsdom
- **Timezone:** Asia/Shanghai

### Test Patterns

```javascript
const utils = global.sdkUtils;

describe('Feature name', () => {
  test('specific test case', () => {
    const result = utils.FunctionName(input);
    expect(result).toBe(expected);
  });

  test.each([
    [input1, expected1],
    [input2, expected2],
  ])('parameterized test %s', (input, expected) => {
    expect(utils.FunctionName(input)).toBe(expected);
  });
});
```

### Test Coverage

- Property-based testing using `fast-check` (100 runs configured)
- Aim for comprehensive coverage of edge cases
- Test both sync and async variants of functions
- Include tests for null/undefined/empty inputs

## Git Workflow

### Commit Messages (Conventional Commits)

**Format:** `type(scope): subject` (max 72 chars)

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code formatting (no functionality change)
- `refactor` - Code restructuring (no feature/bug change)
- `perf` - Performance optimization
- `test` - Adding/updating tests
- `build` - Build system changes
- `ci` - CI/CD changes
- `chore` - Other changes
- `revert` - Revert previous commit

**Rules:**

- Scope is **required** (cannot be empty)
- Type must be lowercase
- Subject case is flexible

**Example:**

```bash
feat(vue3): add dark mode toggle component
fix(basic): handle null values in ListSort
test(basic): add edge cases for date utilities
```

### Pre-commit Hooks

- Husky runs `lint-staged` on pre-commit
- Formats JSON files with Prettier
- Formats non-source TypeScript/JavaScript files

## Best Practices

1. **Always run tests before committing** in the basic package
2. **Use pnpm** for dependency management (never npm or yarn)
3. **Run linters before pushing** to catch issues early
4. **Follow existing code patterns** in each package
5. **Write tests for new utility functions** in the basic package
6. **Use TypeScript types** - leverage the type system
7. **Leverage shared utilities** from `packages/basic` across all frameworks
8. **Respect framework boundaries** - Vue code in vue packages, React in react packages
9. **Document complex logic** with comments explaining "why" not "what"
10. **Keep components small** and focused on single responsibility

## Common Pitfalls to Avoid

- Don't mix tabs and spaces (use 2 spaces)
- Don't skip the scope in commit messages
- Don't use `cd` in bash commands (use workdir parameter)
- Don't commit without running tests in basic package
- Don't use interactive git commands (`git add -i`, `git rebase -i`)
- Don't disable TypeScript checks without good reason
- Don't ignore ESLint warnings - fix them
- Don't create new utility functions without tests
