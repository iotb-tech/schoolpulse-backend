# SchoolPulse Web Development — Working Decisions

> **Status:** Working draft
> **Purpose:** Record the technical and collaboration decisions agreed upon for the SchoolPulse Web Development team before implementation begins.

---

## 1. GitHub Organization

The SchoolPulse Web Development repositories will be hosted under the existing **`iotbtech` GitHub organization**.

We will not create a separate GitHub account or organization for SchoolPulse.

---

## 2. Repository Strategy

The Web Development team will use two separate repositories under `iotbtech`:

iotbtech
├── schoolpulse-frontend
└── schoolpulse-backend


The frontend and backend will therefore have independent codebases, dependencies, deployments, and CI/CD configurations.

---

## 3. Repository Access

All Web Development team members and relevant DevOps members will have access to both repositories.

Administrative access will be restricted to designated project leads, initially:

* Web Development Lead
* DevOps Lead

Normal contributors will not receive administrative repository permissions.

---

## 4. Branching Strategy

The project will use three persistent environment branches:

dev
staging
main

Development will follow this progression:

Feature Branch
      ↓
     dev
      ↓
   staging
      ↓
    main
      ↓
 Production

The branches represent:

* **`dev`** — integrated development
* **`staging`** — pre-production testing and deployment
* **`main`** — production-ready code

Developers will not push directly to these protected branches.

---

## 5. Pull Request Requirement

Changes entering `dev`, `staging`, or `main` must go through Pull Requests.

The expected workflow is:

Developer Branch
      ↓
Pull Request
      ↓
Review
      ↓
Approval
      ↓
Merge

Direct pushes to protected branches will not be permitted.

---

## 6. Pull Request Approval Policy

### Feature → `dev`

Requires:

* **2 Web Development approvals**

### `dev` → `staging`

Requires:

* **1 Web Development approval**
* **1 DevOps approval**

Total: **2 approvals**

### `staging` → `main`

Requires:

* **Web Development Lead approval**
* **DevOps Lead approval**

Total: **2 approvals**

---

## 7. Merge Authority — `feature` → `dev`

After the required two Web Development approvals have been obtained, the **Web Development Lead** will perform the merge into `dev`.

The approval and merge responsibilities are therefore separated:

Reviewers
   ↓
Approve
   ↓
Web Development Lead
   ↓
Merge

---

## 8. Merge Authority — `dev` → `staging`

Promotion from `dev` to `staging` requires:

* One Web Development approval
* One DevOps approval

After both approvals have been obtained, the **Web Development Lead** will perform the merge.

---

## 9. Merge Authority — `staging` → `main`

Promotion from `staging` to `main` requires:

* Web Development Lead approval
* DevOps Lead approval

After both approvals have been obtained, the **Web Development Lead** will perform the merge.

This represents the final promotion to production.

---

## 10. Feature Branch Naming

Developers will use the following branch naming convention:

dev/<developer-name>/<work-description>


Examples:

dev/adeshina/attendance-api
dev/ikechukwu/student-crud
dev/abibat/dashboard-ui
dev/jumaa/login


For fixes:

dev/adeshina/fix-attendance-validation

Developers should not commit directly to:

dev
staging
main

---

## 11. Backend Technology Stack

The SchoolPulse backend will use:

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | JavaScript runtime              |
| Express.js | Backend/API framework           |
| TypeScript | Type safety and maintainability |
| PostgreSQL | Relational database             |
| Prisma     | ORM and database access layer   |

The backend architecture will therefore be:


Node.js
   ↓
Express.js
   ↓
TypeScript
   ↓
Prisma
   ↓
PostgreSQL

PostgreSQL is the actual database, while Prisma is the application's ORM/data-access layer.

---

## 12. Frontend Technology Stack

The SchoolPulse frontend will use:

* Next.js
* TypeScript
* Tailwind CSS

The project will use the **latest stable Next.js version available when the project is initialized**.

The frontend will use the **Next.js App Router** and the `src/app` directory structure.

Example:

schoolpulse-frontend/
└── src/
    └── app/
        ├── layout.tsx
        ├── page.tsx
        └── ...

---

## 13. API Architecture

The frontend and backend will communicate through **RESTful HTTP APIs**.

High-level architecture:


┌──────────────────────┐
│      Next.js         │
│      Frontend        │
└──────────┬───────────┘
           │
           │ HTTP / REST
           ▼
┌──────────────────────┐
│   Express.js API     │
│      Backend         │
└──────────┬───────────┘
           │
           │ Prisma
           ▼
┌──────────────────────┐
│     PostgreSQL       │
└──────────────────────┘

The frontend will consume the backend API and will not connect directly to PostgreSQL.

---

## 14. Backend Architecture

The backend will use a **feature-based modular architecture**.

Initial structure:

src/
├── config/
├── middleware/
├── modules/
│   ├── students/
│   ├── classes/
│   ├── parents/
│   ├── attendance/
│   └── notifications/
├── app.ts
└── server.ts

Each major module can contain its own:


<feature>/
├── <feature>.controller.ts
├── <feature>.service.ts
├── <feature>.route.ts
└── <feature>.validation.ts

The intended request flow is:

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

Controllers should not contain database/business logic. Business logic belongs in the service layer, while Prisma handles database access.


## 15. Initial Database Model

The project will use the Data Analytics team's proposed six core domains as the **starting point** for the database model:

1. Students
2. Classes
3. Parents
4. Attendance
5. Notifications
6. Daily Executive Summary

The initial model is not considered permanently fixed.

The schema should remain extensible so additional entities, relationships, and fields can be introduced when product requirements require them.

The initial conceptual relationship is:


Classes
   │
   └── Students
          │
          ├── Parents
          │
          └── Attendance
                  │
                  └── Notifications

Daily Executive Summary
        ↑
Derived from application data


The Data Analytics team's current document identifies these as proposed reference structures and states that the actual columns, types, keys, and relationships should be reviewed before the final schema is established.

Schema changes should therefore be coordinated between Web Development, DevOps, and Data Analytics.

The Prisma schema will be maintained in:

prisma/
└── schema.prisma

Database changes will be tracked using Prisma migrations.
