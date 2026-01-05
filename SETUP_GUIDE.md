# TypeScript Interview Template - Manual Setup Guide

This guide walks you through setting up a production-ready TypeScript project from scratch.

---

## Table of Contents

1. [Initialize the Project](#1-initialize-the-project)
2. [TypeScript Setup](#2-typescript-setup)
3. [ESLint Setup](#3-eslint-setup)
4. [Prettier Setup](#4-prettier-setup)
5. [Jest Testing Setup](#5-jest-testing-setup)
6. [Environment Variables](#6-environment-variables)
7. [Docker Setup](#7-docker-setup)
8. [Docker Compose with Databases](#8-docker-compose-with-databases)

---

## 1. Initialize the Project

### Create project directory and initialize git

```bash
mkdir my-project
cd my-project
git init
```

### Initialize npm

```bash
npm init -y
```

This creates `package.json` - the manifest file for your Node.js project containing:
- **name**: Project name (defaults to folder name)
- **version**: Semantic version (major.minor.patch)
- **main**: Entry point file
- **scripts**: Command shortcuts for `npm run <script>`
- **dependencies**: Runtime packages
- **devDependencies**: Development-only packages

### Add ES Modules support

Edit `package.json` and add:

```json
{
  "type": "module"
}
```

**Why?** This tells Node.js to treat `.js` files as ES Modules, enabling `import/export` syntax instead of `require()`. Modern JavaScript standard.

### Create .gitignore

```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
coverage/
*.log
.DS_Store
.env
.env.local
EOF
```

**What each line ignores:**
- `node_modules/` - Dependencies (reinstalled via `npm install`)
- `dist/` - Compiled output (regenerated via `npm run build`)
- `coverage/` - Test coverage reports (regenerated)
- `*.log` - Log files
- `.DS_Store` - macOS folder metadata
- `.env`, `.env.local` - Environment secrets (NEVER commit these)

---

## 2. TypeScript Setup

### Install TypeScript

```bash
npm install --save-dev typescript @types/node
```

**Packages explained:**
- `typescript` - The TypeScript compiler (`tsc`)
- `@types/node` - Type definitions for Node.js built-in modules (fs, path, http, etc.)

`--save-dev` (or `-D`) installs as devDependency - not needed in production runtime.

### Create tsconfig.json

```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

**Compiler options explained:**

| Option | Value | Purpose |
|--------|-------|---------|
| `target` | `ES2020` | JavaScript version to compile to. ES2020 has good Node.js support. |
| `module` | `commonjs` | Output module system. CommonJS for Node.js compatibility. |
| `lib` | `["ES2020"]` | Built-in type definitions to include. |
| `outDir` | `./dist` | Where compiled `.js` files go. |
| `rootDir` | `./src` | Where source `.ts` files are. |
| `strict` | `true` | Enable all strict type-checking options (recommended). |
| `esModuleInterop` | `true` | Allows `import x from 'y'` for CommonJS modules. |
| `skipLibCheck` | `true` | Skip type checking of `.d.ts` files (faster builds). |
| `forceConsistentCasingInFileNames` | `true` | Error if import casing doesn't match filesystem. |
| `resolveJsonModule` | `true` | Allow importing `.json` files. |
| `declaration` | `true` | Generate `.d.ts` type definition files. |
| `declarationMap` | `true` | Generate sourcemaps for `.d.ts` files. |
| `sourceMap` | `true` | Generate `.js.map` files for debugging. |

**include/exclude:**
- `include`: Which files to compile
- `exclude`: Which files to ignore

### Create source directory and entry point

```bash
mkdir src

cat > src/index.ts << 'EOF'
function main(): void {
  console.log("Hello, World!");
}

main();
EOF
```

### Add scripts to package.json

Add these to the `"scripts"` section:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```

**Scripts explained:**
- `build` - Compiles TypeScript to JavaScript in `dist/`
- `start` - Runs the compiled JavaScript (production)
- `dev` - Runs TypeScript directly without compiling (development)

### Verify it works

```bash
npm run build
npm start
# Output: Hello, World!
```

---

## 3. ESLint Setup

ESLint analyzes your code for potential errors and enforces coding standards.

### Install ESLint packages

```bash
npm install --save-dev eslint @eslint/js typescript-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Packages explained:**
- `eslint` - Core ESLint engine
- `@eslint/js` - ESLint's recommended JavaScript rules
- `typescript-eslint` - Monorepo package for TypeScript ESLint integration
- `@typescript-eslint/parser` - Parses TypeScript for ESLint
- `@typescript-eslint/eslint-plugin` - TypeScript-specific lint rules

### Create eslint.config.js (Flat Config format - ESLint 9+)

```bash
cat > eslint.config.js << 'EOF'
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: ["dist/", "node_modules/"],
  }
);
EOF
```

**Configuration explained:**
- `eslint.configs.recommended` - ESLint's recommended rules for JavaScript
- `tseslint.configs.recommended` - TypeScript-specific recommended rules
- `prettier` - Disables formatting rules that conflict with Prettier
- `ignores` - Folders to skip

### Add lint scripts to package.json

```json
{
  "scripts": {
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

- `lint` - Check for issues
- `lint:fix` - Automatically fix fixable issues

---

## 4. Prettier Setup

Prettier is an opinionated code formatter. Unlike ESLint (which finds problems), Prettier reformats code to a consistent style.

### Install Prettier packages

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

**Packages explained:**
- `prettier` - The Prettier formatter
- `eslint-config-prettier` - Turns OFF ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Runs Prettier as an ESLint rule

### Create .prettierrc

```bash
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
EOF
```

**Options explained:**
| Option | Value | Meaning |
|--------|-------|---------|
| `semi` | `true` | Add semicolons at end of statements |
| `trailingComma` | `es5` | Add trailing commas where valid in ES5 (objects, arrays) |
| `singleQuote` | `false` | Use double quotes for strings |
| `printWidth` | `100` | Wrap lines at 100 characters |
| `tabWidth` | `2` | Use 2 spaces for indentation |

### Add format script to package.json

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

---

## 5. Jest Testing Setup

Jest is a JavaScript testing framework with built-in assertions, mocking, and coverage.

### Install Jest packages

```bash
npm install --save-dev jest ts-jest @types/jest
```

**Packages explained:**
- `jest` - The Jest test runner
- `ts-jest` - TypeScript preprocessor for Jest (compiles `.ts` on the fly)
- `@types/jest` - Type definitions for Jest globals (`describe`, `it`, `expect`)

### Create jest.config.cjs

Note: We use `.cjs` extension because Jest's config uses CommonJS, but our project uses ES Modules.

```bash
cat > jest.config.cjs << 'EOF'
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
  coverageDirectory: "coverage",
};
EOF
```

**Configuration explained:**
| Option | Value | Purpose |
|--------|-------|---------|
| `preset` | `ts-jest` | Use ts-jest's default configuration |
| `testEnvironment` | `node` | Run tests in Node.js (not browser/jsdom) |
| `roots` | `["<rootDir>/src"]` | Where to look for tests |
| `testMatch` | `["**/*.test.ts"]` | Pattern for test files |
| `collectCoverageFrom` | `[...]` | Which files to include in coverage |
| `coverageDirectory` | `coverage` | Where to output coverage reports |

### Create example utility with tests

```bash
cat > src/utils.ts << 'EOF'
export function add(a: number, b: number): number {
  return a + b;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
EOF
```

```bash
cat > src/utils.test.ts << 'EOF'
import { add, isValidEmail } from "./utils";

describe("add", () => {
  it("should add two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("should handle negative numbers", () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe("isValidEmail", () => {
  it("should return true for valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("should return false for invalid email", () => {
    expect(isValidEmail("invalid-email")).toBe(false);
  });
});
EOF
```

**Test file anatomy:**
- `describe()` - Groups related tests
- `it()` - Individual test case (alias: `test()`)
- `expect()` - Assertion wrapper
- `.toBe()` - Strict equality matcher

### Add test scripts to package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

- `test` - Run all tests once
- `test:watch` - Re-run tests when files change
- `test:coverage` - Generate coverage report

### Verify tests work

```bash
npm test
```

---

## 6. Environment Variables

Environment variables store configuration that changes between environments (dev, staging, prod) and secrets that shouldn't be in code.

### Install dotenv

```bash
npm install dotenv
```

**Package explained:**
- `dotenv` - Loads variables from `.env` file into `process.env`

### Create .env.example

This is a template showing what environment variables are needed (committed to git):

```bash
cat > .env.example << 'EOF'
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
REDIS_URL=redis://localhost:6379
EOF
```

**Variables explained:**
- `NODE_ENV` - Environment mode (development/production/test)
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string format: `postgresql://user:password@host:port/database`
- `REDIS_URL` - Redis connection string

### Create config module

```bash
cat > src/config.ts << 'EOF'
import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
};
EOF
```

**Why a config module?**
- Centralized configuration
- Type safety (parsed integers, defaults)
- Easy to mock in tests
- Single import instead of `process.env` everywhere

### Usage

1. Copy `.env.example` to `.env`
2. Fill in real values
3. Import config: `import { config } from "./config";`

---

## 7. Docker Setup

Docker packages your application with its dependencies into a container that runs consistently anywhere.

### Create Dockerfile

```bash
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
EOF
```

**Multi-stage build explained:**

**Stage 1: builder**
```dockerfile
FROM node:20-alpine AS builder    # Base image (Alpine = minimal Linux)
WORKDIR /app                       # Set working directory
COPY package*.json ./              # Copy package files first (layer caching)
RUN npm ci                         # Install ALL dependencies (including devDeps)
COPY tsconfig.json ./              # Copy TypeScript config
COPY src ./src                     # Copy source code
RUN npm run build                  # Compile TypeScript
```

**Stage 2: runner**
```dockerfile
FROM node:20-alpine AS runner      # Fresh minimal image
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production       # Install ONLY production dependencies
COPY --from=builder /app/dist ./dist  # Copy compiled code from builder
ENV NODE_ENV=production            # Set environment
EXPOSE 3000                        # Document the port (informational)
CMD ["node", "dist/index.js"]      # Start command
```

**Why multi-stage?**
- Final image doesn't include TypeScript, dev dependencies, source code
- Much smaller image size (often 10x smaller)
- Faster deployments, less attack surface

**Commands explained:**
- `npm ci` - Clean install (faster, stricter than `npm install`)
- `--only=production` - Skip devDependencies

### Create .dockerignore

```bash
cat > .dockerignore << 'EOF'
node_modules
dist
coverage
.git
.gitignore
*.md
.env*
EOF
```

**Why?** Prevents copying unnecessary files into the Docker build context:
- `node_modules` - Reinstalled in container
- `dist` - Rebuilt in container
- `.env*` - Secrets shouldn't be baked into images

### Build and run

```bash
# Build the image
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

---

## 8. Docker Compose with Databases

Docker Compose runs multi-container applications. Perfect for local development with databases.

### Create docker-compose.yml

```bash
cat > docker-compose.yml << 'EOF'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF
```

**Services explained:**

**app (your application)**
```yaml
app:
  build: .                    # Build from Dockerfile in current directory
  ports:
    - "3000:3000"             # Map host:container ports
  environment:                # Environment variables
    - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
  depends_on:
    db:
      condition: service_healthy  # Wait for db to be healthy
```

**db (PostgreSQL)**
```yaml
db:
  image: postgres:16-alpine   # Official PostgreSQL image
  ports:
    - "5432:5432"             # Expose for local tools (pgAdmin, etc.)
  environment:
    POSTGRES_USER: postgres   # Default username
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: app          # Database name to create
  volumes:
    - postgres_data:/var/lib/postgresql/data  # Persist data
  healthcheck:                # Health check for depends_on
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 5s
    timeout: 5s
    retries: 5
```

**redis (Redis cache)**
```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data        # Persist Redis data
```

**Named volumes:**
```yaml
volumes:
  postgres_data:              # Data persists between container restarts
  redis_data:
```

### Add docker scripts to package.json

```json
{
  "scripts": {
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build"
  }
}
```

- `docker:up` - Start all services in background (`-d` = detached)
- `docker:down` - Stop and remove containers
- `docker:build` - Rebuild images

### Usage

```bash
# Start databases only (for local development)
docker-compose up -d db redis

# Start everything including your app
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Stop and delete data volumes
docker-compose down -v
```

---

## Final package.json Scripts Summary

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:build": "docker-compose build"
  }
}
```

---

## Project Structure

```
my-project/
├── src/
│   ├── index.ts          # Entry point
│   ├── config.ts         # Environment configuration
│   ├── utils.ts          # Utility functions
│   └── utils.test.ts     # Tests
├── dist/                  # Compiled JavaScript (gitignored)
├── coverage/              # Test coverage (gitignored)
├── node_modules/          # Dependencies (gitignored)
├── .env                   # Local secrets (gitignored)
├── .env.example           # Environment template
├── .gitignore
├── .dockerignore
├── .prettierrc
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── jest.config.cjs
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Run TypeScript directly
npm run build            # Compile to JavaScript
npm start                # Run compiled code

# Code Quality
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues
npm run format           # Format code

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage

# Docker
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
docker-compose logs -f   # View logs
```
