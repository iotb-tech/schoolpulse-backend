😂 You're right — **we are NOT going back to Decision 29 yet.** Let's finish the Git workflow properly first.

And yes: **your branch is supposed to exist locally and remotely while you're working on that feature.** After the PR is merged, however, the feature branch can be deleted. Keeping it is optional, but for a clean repository, we should normally delete it after merging.

Your current situation is:

```text
feature/adeshina/project-setup   ← still exists locally + remotely
              ↓
             PR
              ↓
             dev                 ← README is now here
```

That's completely fine.

---

# SchoolPulse Git Workflow Guide

This is the guide I'd send to every Web Dev team member so everyone follows **exactly the same process**.

You can send this to them as-is.

---

# SchoolPulse — Git & GitHub Development Workflow

## 1. Clone the repository

There are two separate repositories:

```text
schoolpulse-frontend
schoolpulse-backend
```

Clone the repository you're going to work on.

For example, for the backend:

```powershell
git clone https://github.com/iotb-tech/schoolpulse-backend.git
```

Then enter the repository:

```powershell
cd schoolpulse-backend
```

For the frontend:

```powershell
git clone https://github.com/iotb-tech/schoolpulse-frontend.git
```

Then:

```powershell
cd schoolpulse-frontend
```

---

## 2. Open the project in VS Code

From inside the repository folder:

```powershell
code .
```

This opens the **actual cloned repository** in VS Code.

You should see the project files in the VS Code Explorer.

---

# 3. Check your branches

Run:

```powershell
git branch -a
```

You should see the persistent branches:

```text
main
dev
staging
```

You may also see remote branches such as:

```text
remotes/origin/main
remotes/origin/dev
remotes/origin/staging
```

---

# 4. Start from the latest `dev`

**Do not start your work from `main`.**

Switch to `dev`:

```powershell
git checkout dev
```

Then get the latest version:

```powershell
git pull origin dev
```

This ensures you're starting your work from the latest integrated development code.

---

# 5. Create your feature branch

Do **not** create branches like:

```text
dev/adeshina/attendance-api
```

because `dev` is already a branch name, and Git doesn't allow a branch such as `dev/...` when `dev` itself exists.

Our feature-branch naming convention is:

```text
feature/<developer-name>/<work-description>
```

Examples:

```text
feature/adeshina/attendance-api
feature/ikechukwu/student-crud
feature/john/login-page
feature/adeshina/fix-attendance-validation
```

Create your branch:

```powershell
git checkout -b feature/your-name/your-work
```

For example:

```powershell
git checkout -b feature/adeshina/attendance-api
```

---

# 6. Confirm you're on your feature branch

Run:

```powershell
git branch
```

You should see:

```text
  dev
* feature/adeshina/attendance-api
  main
```

The `*` tells you which branch you're currently on.

### Important

Once you're on your feature branch, **do your work there**.

Do not switch to `dev`, `staging`, or `main` and start coding there.

---

# 7. Make your changes

Now work normally in VS Code.

For example:

```text
src/
├── modules/
│   └── attendance/
│       ├── attendance.controller.ts
│       ├── attendance.service.ts
│       └── attendance.route.ts
```

Create or modify the files required for your assigned task.

---

# 8. Check what you changed

Run:

```powershell
git status
```

Git will show you the files you've created or modified.

You can also see the actual changes with:

```powershell
git diff
```

---

# 9. Stage your changes

When you're satisfied with your changes:

```powershell
git add .
```

Then check:

```powershell
git status
```

The files should now appear under **Changes to be committed**.

---

# 10. Commit your changes

Create a meaningful commit message.

Example:

```powershell
git commit -m "Add attendance API"
```

Other examples:

```powershell
git commit -m "Create student CRUD endpoints"
```

```powershell
git commit -m "Add class account authentication"
```

```powershell
git commit -m "Fix attendance validation"
```

Avoid messages like:

```text
update
changes
fix
done
final
```

because they don't explain what actually changed.

---

# 11. Push your feature branch to GitHub

The first time you push the branch:

```powershell
git push -u origin feature/adeshina/attendance-api
```

Replace the branch name with your own.

After the first push, you can simply use:

```powershell
git push
```

Your branch will now exist both:

```text
Local computer
      ↓
feature/adeshina/attendance-api

GitHub
      ↓
feature/adeshina/attendance-api
```

---

# 12. Create the Pull Request

Go to the GitHub repository.

Create a **New Pull Request**.

Make sure the branches are:

```text
base:    dev
compare: feature/your-name/your-work
```

For example:

```text
base:    dev
compare: feature/adeshina/attendance-api
```

The direction must be:

```text
feature/adeshina/attendance-api
              ↓
             dev
```

### Do NOT accidentally create:

```text
dev → feature/...
```

We want the feature branch to go **into `dev`**.

---

# 13. Describe your Pull Request

Give the PR a clear title.

Example:

```text
Add attendance API
```

In the description, briefly explain:

```text
## What was done
- Added attendance routes
- Added attendance controller
- Added attendance service
- Added attendance validation

## Testing
- Tested attendance creation
- Tested invalid student ID
- Tested duplicate attendance
```

This helps reviewers understand what they're approving.

---

# 14. Wait for review

Our `dev` branch is protected.

A PR going into `dev` requires:

**2 Web Dev approvals.**

So the normal process is:

```text
Developer
    ↓
Feature branch
    ↓
Pull Request
    ↓
2 Web Dev reviews
    ↓
Approved
    ↓
Web Dev Lead merges
    ↓
dev
```

Developers should **not bypass the review requirement** during normal development.

---

# 15. After the PR is merged

Once your PR has been merged into `dev`, you no longer need the feature branch.

You can delete the remote branch through GitHub.

Then clean up your local branch:

```powershell
git checkout dev
```

Update your local `dev`:

```powershell
git pull origin dev
```

Then delete your local feature branch:

```powershell
git branch -d feature/your-name/your-work
```

For example:

```powershell
git branch -d feature/adeshina/attendance-api
```

Your repository then goes back to:

```text
main
dev
staging
```

until you start your next task.

---

# 16. Starting your next task

Always repeat:

```powershell
git checkout dev
```

Then:

```powershell
git pull origin dev
```

Then create a **new feature branch**:

```powershell
git checkout -b feature/your-name/new-work
```

For example:

```powershell
git checkout -b feature/adeshina/notification-service
```

Then:

```text
code
  ↓
git add .
  ↓
git commit
  ↓
git push
  ↓
Pull Request → dev
  ↓
2 approvals
  ↓
Web Dev Lead merges
```

---

# 17. Branch flow for SchoolPulse

The overall project flow is:

```text
                ┌─────────────────────┐
                │  feature/name/task  │
                └──────────┬──────────┘
                           │
                           │ PR
                           ▼
                     ┌───────────┐
                     │    dev    │
                     └─────┬─────┘
                           │
                           │ PR
                           │ 2 approvals
                           ▼
                     ┌───────────┐
                     │  staging  │
                     └─────┬─────┘
                           │
                           │ PR
                           │ 2 approvals
                           ▼
                     ┌───────────┐
                     │   main    │
                     └───────────┘
                           │
                           ▼
                      Production
```

### Golden rules

**Never:**

```text
❌ push directly to main
❌ push directly to staging
❌ push directly to dev
❌ work directly on main
❌ work directly on staging
❌ work directly on dev
❌ bypass reviews during normal development
```

**Always:**

```text
✅ update dev first
✅ create a feature branch
✅ work on your feature branch
✅ commit your work
✅ push your feature branch
✅ create PR → dev
✅ get 2 Web Dev approvals
✅ Web Dev Lead merges
```

---

### And about your current branch

Your `feature/adeshina/project-setup` branch **can remain for now**. It isn't hurting anything.

Since its PR has already been merged, though, once we're completely satisfied that the README is correctly on `dev`, I'd recommend deleting it from both GitHub and your local machine so your branch list stays clean.

And **yes, this workflow should be reflected in our SchoolPulse README**. We discovered during the actual setup that the original `dev/<developer-name>/...` naming convention was technically invalid with a permanent `dev` branch, so we'll need to update that section when we eventually return to the README.
