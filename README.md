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

## 16. Authentication and Account Structure

SchoolPulse will use role-based authentication and authorization.

The MVP will have three types of authenticated users/accounts:

* **Super Admin**
* **Lower Admin**
* **Class Accounts**

Parents will **not have login accounts in the MVP**. Their information will be stored in the system for communication and notification purposes.

Teachers will also **not have individual login accounts in the MVP**. Instead, teachers will use the login credentials of the class they are assigned to.

The current recommended authentication solution is **Supabase Auth**, because it can handle authentication while the application backend remains Node.js + Express + TypeScript + Prisma + PostgreSQL. The authentication provider is not yet formally finalized.

---

## 17. Super Admin

The **Super Admin** represents the school owner or highest-level school administrator.

The Super Admin will:

* Use an individual **email + password** account.
* Have the highest level of authority within the school.
* Create and manage Lower Admin accounts.
* Create and manage Class Accounts.
* Assign teachers to classes.
* Remove teachers from classes.
* Replace teachers when necessary.
* Manage school-level administrative functions.
* Manage their own password.

The Super Admin account is **not a shared account**.

The Super Admin is intended to remain associated with the school owner or highest-authority administrator.

---

## 18. Lower Admin Accounts

Lower-level Admin accounts will be created and managed by the Super Admin.

Lower Admins will:

* Use **username + password** authentication.
* Have usernames such as `admin1`, `admin2`, etc.
* Handle normal school-management operations.
* Manage students, parents, classes, attendance, notifications, announcements, and other authorized school functions.
* Create and manage Class Accounts.
* Reset Class Account passwords.
* Assign, remove, and replace teachers assigned to classes.

Lower Admins **cannot manage Super Admin accounts or create/manage other Lower Admin accounts** unless this permission is explicitly expanded later.

---

## 19. Lower Admin Account Replacement

Lower Admin accounts are designed to be reusable rather than deleted whenever the person using the account changes.

If a Lower Admin leaves the school or their access needs to be revoked:

1. The Super Admin resets the existing account's password.
2. The replacement administrator receives the new credentials.
3. The existing account remains in the system.

For example:

admin1
   ↓
Old administrator leaves
   ↓
Super Admin resets password
   ↓
New administrator receives admin1 credentials

This allows historical records and logs to continue under the same account identity.

**Important limitation:** because the same account is reused, historical logs can identify that `admin1` performed an action, but they cannot distinguish whether the old or new person was using the account at that time.

This trade-off is accepted for the MVP.

---

## 20. Class Accounts

Teachers will not have individual login accounts in the MVP.

Instead, **each class will have its own account**.

Examples:

primary3
primary5
jss1

Class Accounts:

* Use **username + password**.
* Are created and managed by Super Admin/Lower Admin.
* Are tied to a specific class.
* Can only access their own class.
* Can mark attendance for their own class.
* Cannot access another class's attendance or student information.
* Cannot edit student information.
* Cannot edit parent information.
* Cannot modify attendance history.
* Cannot modify notification records.
* Cannot manage accounts.

The Class Account remains with the class even when the teacher assigned to that class changes.

For example:

Primary 3
    │
    └── Class Account: primary3

Mrs. Adeola leaves
    ↓
New teacher is assigned
    ↓
Primary 3 still uses: primary3

This keeps the class account, students, attendance records, and other class-related data independent of individual teacher turnover.

---

## 21. Class Dashboard

After logging in, a Class Account will see a **dashboard**, rather than being taken directly to the attendance page.

The Class Dashboard will contain:

* Welcome/Overview
* **Current Teacher's Name**
* Attendance
* Students
* Attendance History
* Notification Delivery Status
* Announcements — **Coming Soon** if not implemented in the MVP

For example:

Primary 3

Class Teacher: Mrs. Adeola

Welcome, Primary 3

[Attendance]
[Students]
[Attendance History]
[Notifications]
[Announcements — Coming Soon]

Only the **teacher's name** will be displayed on the Class Dashboard. The teacher's phone number, email, and other personal/profile details will not be displayed to the Class Account.

The dashboard should reuse shared UI components with the Admin dashboard wherever practical.

### Class Account Permissions

The Class Account will be **read-only everywhere except attendance marking**.

The class account cannot:

* Edit student information.
* Edit parent information.
* Modify attendance history outside the permitted attendance-marking workflow.
* Modify notification records.
* Manage class accounts.
* Manage teachers.
* Manage other classes.
* Manage administrative accounts.

The backend must enforce these permissions rather than relying only on frontend UI restrictions.


## 22. Shared Dashboard Architecture

Admin and Class Accounts should use a shared dashboard architecture and reusable components wherever possible.

The purpose is to avoid building completely separate interfaces for each role.

The general structure can be shared while the available actions and data are controlled by the user's permissions.

For example:

```text
Shared Dashboard Components
          │
          ├── Super Admin permissions
          │
          ├── Lower Admin permissions
          │
          └── Class Account permissions
```

A Class Account may see the Students section but only have permission to **view** students.

An Admin may see the same section but have permission to **create, edit, assign, or deactivate** students.

Authorization must therefore exist at the backend/API level as well as the frontend level.

---

## 23. Parent Accounts

Parents will **not have login accounts in the MVP**.

Instead, parent/guardian information will be stored in the system so the school can:

* Associate parents/guardians with students.
* Store contact information.
* Send absence notifications.
* Support school announcements and communication.

A future version may introduce a Parent Portal with parent authentication.

The architecture should remain extensible enough to support this later without requiring a major redesign.

---

## 24. Password Security and Account Lockout

The system will support **temporary account lockout after repeated incorrect password attempts**.

This is intended to reduce the risk of brute-force password attacks.

The exact:

* Number of failed attempts allowed.
* Lockout duration.
* Whether the lockout rules differ by account type.

will be determined during implementation.

The security approach should be particularly strict for the Super Admin account because it has the highest level of authority.

---

## 25. Password Reset Permissions

Password-reset responsibilities will be:

| Account Type  | Password Reset Authority                                                |
| ------------- | ----------------------------------------------------------------------- |
| Super Admin   | Super Admin can reset their own password through their registered email |
| Lower Admin   | Super Admin                                                             |
| Class Account | Super Admin or Lower Admin                                              |

The Super Admin remains responsible for controlling access to Lower Admin accounts.

Lower Admins can manage Class Account credentials because they are responsible for normal school operations.

---

## 26. Teacher Management

Teachers will be represented as a **separate entity in the system** rather than simply storing a teacher's name as plain text against a class.

A teacher profile can contain:

* Teacher ID
* Full name
* Phone number
* Email
* Other relevant basic teacher details

Teachers will **not have individual login accounts in the MVP**.

Their records are primarily used for:

* School administration.
* Identifying the teacher assigned to a class.
* Teacher-class assignment management.
* Reassignment when teachers leave or change responsibilities.

The teacher's contact information does not need to be displayed to the Class Account.

---

## 27. Teacher-to-Class Assignment

Super Admins and authorized Lower Admins can:

* Assign a teacher to a class.
* Remove a teacher from a class.
* Replace a teacher with another teacher.
* View the current teacher assigned to a class.

The system should support a teacher being assigned to **multiple classes**, because real schools may experience teacher shortages.

A teacher can be assigned to a **maximum of 3 classes at the same time**.

For example:

Mrs. Adeola
│
├── Primary 3
├── Primary 5
└── JSS 1

Mrs. Adeola cannot be assigned to a fourth class unless one of her existing assignments is removed.

The teacher-to-class relationship should be designed as a flexible assignment relationship rather than permanently tying one teacher to one class.

This allows the system to support:

* Multiple classes per teacher.
* Teacher reassignment.
* Teacher replacement.
* Removal of teachers.
* Tracking teacher-class assignments.
* Future teacher-management functionality.

### Teacher Replacement

If a teacher leaves the school:

Primary 3
Current Teacher: Mrs. Adeola

        ↓

Remove Mrs. Adeola

        ↓

Assign Mr. Ibrahim

        ↓

Primary 3
Current Teacher: Mr. Ibrahim

The class account remains unchanged:

Class: Primary 3
Class Account: primary3
Current Teacher: Mr. Ibrahim

This keeps the class account independent of the individual teacher.

---

## 28. Teacher Access and Class Accounts

A teacher assigned to multiple classes does **not** receive one login that provides access to all of their classes.

Each class has its own separate login.

For example:

Mrs. Adeola
│
├── Primary 3
│   └── Login: primary3
│
├── Primary 5
│   └── Login: primary5
│
└── JSS 1
    └── Login: jss1

The teacher must use the appropriate Class Account when working with each class.

Each Class Account can only:

* Access its corresponding class.
* View its corresponding students.
* Mark attendance for its corresponding class.
* View permitted class-specific information.

A teacher logged into `primary3` cannot use that account to access Primary 5 attendance or student data.

This maintains strict **class-level data isolation**.

### Teacher Name on Class Dashboard

The Class Dashboard should display **only the name of the teacher currently assigned to that class**.

For example:

Primary 3

Class Teacher: Mrs. Adeola

The teacher's:

* Phone number
* Email
* Other personal/profile details

do **not** need to be displayed on the Class Dashboard.

Those details remain available to the appropriate Admin/Super Admin for teacher management.

### Backend Authorization

The frontend must not be the only layer enforcing class permissions.

The backend must verify the authenticated Class Account and its permitted class before allowing protected operations.

For example:

Class Account: primary3
        ↓
Attendance API
        ↓
Can access Primary 3 attendance
        ↓
Cannot access Primary 5 attendance

Hiding buttons or pages in the frontend is **not sufficient**.

The backend must enforce the account's role, permissions, and class scope.
