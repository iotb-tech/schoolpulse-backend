
# Getting Started

This section explains how to set up the SchoolPulse backend after cloning the repository.

---

## Prerequisites

Before working on the backend, make sure you have the following installed:

- Node.js
- npm
- Git
- VS Code

Check your installations:

```bash
node -v
npm -v
git --version
````


# Quick Start

For a teammate who has just cloned the repository:

```bash
cd schoolpulse-backend
code .
npm install
```

Create your local `.env` file:

```env
DATABASE_URL="your_postgresql_connection_string_here"
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Then start the development server:

```bash
npm run dev
```

Before starting your task, make sure you are working on a feature branch:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/<your-name>/<your-task>
```


---

## 1. Clone the Repository

Follow the team's Git workflow guide to clone the repository.

After cloning, move into the project directory:

```bash
cd schoolpulse-backend
```

Open the project in VS Code:

```bash
code .
```

If `code .` does not work, open the `schoolpulse-backend` folder manually in VS Code.

---


## 2. Install Dependencies

Install all project dependencies:

```bash
npm install
```

This installs the packages defined in `package.json`.

---


## 3. Set Up Environment Variables

The backend uses environment variables for configuration and sensitive information.

Create a `.env` file in the project root.

Use `.env.example` as a reference.

Your local `.env` should contain:

```env
DATABASE_URL="your_postgresql_connection_string_here"
```

### Important

**Never commit or push `.env` to GitHub.**

The `.env` file is already included in `.gitignore`.

The `.env.example` file contains placeholders only and can be committed.

---

# Database Setup

SchoolPulse uses:

* PostgreSQL as the database
* Prisma as the ORM

The shared PostgreSQL database is provisioned and managed in coordination with the DevOps team.

Web Development is responsible for the application database schema and Prisma integration.

Once the DevOps team provides the appropriate database connection string, add it to your local `.env` file:

```env
DATABASE_URL="your_postgresql_connection_string_here"
```

Do not share database credentials in GitHub or other public channels.

---

# Prisma

Prisma is used to:

* Define the database schema
* Generate the Prisma Client
* Create and manage database migrations
* Communicate with PostgreSQL from the backend

The Prisma schema is located at:

```text
prisma/schema.prisma
```

Prisma configuration is located at:

```text
prisma7.config.ts
```

Generated Prisma Client files are placed under:

```text
src/generated/prisma/
```

---

## Generate Prisma Client

Run:

```bash
npm run prisma:generate
```

Run this when necessary after changes to the Prisma schema or when setting up the project.

---

## Database Migrations

When the team is ready to create or apply a Prisma migration:

```bash
npm run prisma:migrate
```

Do not change the database structure or create migrations without coordinating with the Web Development team.

---

## Prisma Studio

To open Prisma Studio:

```bash
npm run prisma:studio
```

Prisma Studio provides a visual interface for viewing and working with database records.

---

# Running the Backend

## Development Mode

Start the development server with:

```bash
npm run dev
```

The development server uses `tsx watch`, so TypeScript changes automatically restart the server.

---

## Build the Project

To compile the TypeScript project:

```bash
npm run build
```

The compiled files are generated inside:

```text
dist/
```

The `dist/` directory should not be committed to Git.

---

## Start the Production Build

After building the project:

```bash
npm start
```

This runs:

```text
dist/server.js
```

---

# Available NPM Scripts

| Command                   | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| `npm run dev`             | Start the development server with automatic reload |
| `npm run build`           | Compile TypeScript                                 |
| `npm start`               | Run the compiled production build                  |
| `npm run prisma:generate` | Generate Prisma Client                             |
| `npm run prisma:migrate`  | Create/apply Prisma migrations                     |
| `npm run prisma:studio`   | Open Prisma Studio                                 |

---

# Project Structure

The backend follows a feature-based modular architecture.

```text
schoolpulse-backend/
│
├── src/
│   ├── config/
│   │
│   ├── middleware/
│   │
│   ├── modules/
│   │   ├── students/
│   │   ├── classes/
│   │   ├── parents/
│   │   ├── attendance/
│   │   └── notifications/
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── prisma7.config.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Each feature module should generally follow this structure:

```text
<feature>/
├── <feature>.controller.ts
├── <feature>.service.ts
├── <feature>.route.ts
└── <feature>.validation.ts
```

For example:

```text
students/
├── students.controller.ts
├── students.service.ts
├── students.route.ts
└── students.validation.ts
```

---

# Backend Request Flow

The backend follows this general request flow:

```text
HTTP Request
     ↓
Route
     ↓
Validation
     ↓
Controller
     ↓
Service
     ↓
Prisma
     ↓
PostgreSQL
```

### Responsibilities

**Routes**

* Define API endpoints.
* Connect endpoints to controllers.

**Validation**

* Validate incoming request data.
* Reject invalid input before it reaches business logic.

**Controllers**

* Handle HTTP requests and responses.
* Call the appropriate service.
* Should not contain database or business logic.

**Services**

* Contain business logic.
* Communicate with Prisma.

**Prisma**

* Handles database operations.

---

# Development Workflow

The project uses the following branch structure:

```text
feature/<developer>/<work>
          ↓
         dev
          ↓
       staging
          ↓
        main
          ↓
     production
```

### Persistent Branches

| Branch    | Purpose                |
| --------- | ---------------------- |
| `dev`     | Integrated development |
| `staging` | Pre-production testing |
| `main`    | Production             |

Do **not** work directly on:

```text
dev
staging
main
```

Create a feature branch for your work.

Example:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-name/your-task
```

Example:

```bash
git checkout -b feature/adeshina/attendance-api
```

---

# Pull Requests

When your feature is ready:

1. Commit your changes.
2. Push your feature branch.
3. Open a Pull Request.
4. Set the base branch to `dev`.
5. Add a clear title and description.
6. Wait for the required reviews.
7. Address review comments if necessary.
8. The Web Dev Lead will merge the PR after the required approvals.

For the complete Git workflow, refer to:

`sp-git-workflow-guide.md`

---

# Important Git Rules

### Do

* Always create a feature branch.
* Pull the latest `dev` before starting new work.
* Keep commits clear and meaningful.
* Push your feature branch regularly.
* Create a Pull Request into `dev`.
* Keep your branch focused on one task.
* Communicate with the team before making major architectural changes.

### Do Not

* Push directly to `dev`.
* Push directly to `staging`.
* Push directly to `main`.
* Force push shared branches.
* Commit `.env`.
* Commit `node_modules`.
* Commit `dist`.
* Modify generated Prisma Client files manually.
* Change the database structure without coordinating with the team.
* Bypass the Pull Request review process during normal development.

---

# Before Starting Work

Every time you start a new task:

```bash
git checkout dev
git pull origin dev
```

Then create a new feature branch:

```bash
git checkout -b feature/<your-name>/<your-task>
```

Example:

```bash
git checkout -b feature/ikechukwu/student-crud
```

---

# After Pulling Changes

If you pull changes that include updates to the Prisma schema, you may need to regenerate Prisma Client:

```bash
npm run prisma:generate
```

If a new migration has been added and the team has instructed you to apply it, follow the team's migration instructions before running the application.

---

# Security

Never commit sensitive information such as:

* Database passwords
* Database connection strings
* API keys
* JWT secrets
* SMS provider credentials
* Email provider credentials
* Other private credentials

Use `.env` for local secrets.

Use `.env.example` for documenting required environment variables without exposing their values.

---

# Troubleshooting

## Dependencies are missing

Run:

```bash
npm install
```

---

## Prisma Client is missing or outdated

Run:

```bash
npm run prisma:generate
```

---

## Environment variable errors

Check that:

1. A `.env` file exists in the project root.
2. `DATABASE_URL` is present.
3. The database connection string is correct.
4. You have not accidentally committed or modified `.env.example` with real credentials.

---

## TypeScript errors

Run:

```bash
npm run build
```

This performs a TypeScript compilation check and can help identify type errors before opening a Pull Request.

---

# Team Communication

Before making changes that affect multiple parts of the backend, communicate with the Web Development team.

In particular, coordinate before changing:

* Prisma schema
* Database relationships
* Authentication/authorization
* API contracts
* Shared middleware
* Notification logic
* Major project structure

The goal is to keep the frontend, backend, DevOps, and Data Analytics teams aligned.

---

# SchoolPulse Backend Architecture

The backend is being developed around the following core domains:

```text
Students
Classes
Parents
Teachers
Attendance
Notifications
Daily Executive Summary
```

The schema may evolve as development progresses. Database changes should be coordinated with the relevant Web Development, DevOps, and Data Analytics team members.

---

## Welcome to the SchoolPulse Web Development Team 🚀

Follow the project structure, branch rules, and team workflow so that everyone can work on the codebase safely and consistently.

```
```
