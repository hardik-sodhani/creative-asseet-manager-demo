---
name: pr-workflow
description: Commits staged changes, runs linters and tests, pushes the branch, and opens a pull request. Use when the user asks to create a PR, open a pull request, prepare and push changes for review, or run the full PR workflow (commit, lint, test, push, PR).
---

# PR Workflow

Run this workflow when the user wants to commit, lint, test, push, and open a pull request.

## Workflow Steps

Execute in order. If any step fails, stop and report the failure before proceeding.

**Task progress:**
- [ ] 1. Ensure changes are staged and commit
- [ ] 2. Run linter(s)
- [ ] 3. Run tests
- [ ] 4. Push branch
- [ ] 5. Open pull request

---

### Step 1: Commit

- If the user provided a commit message, use it. Otherwise generate a clear, conventional message from the changes (e.g. `feat: add asset filters`, `fix: correct upload validation`).
- Stage any unstaged changes if the user intends to include them: `git add -A` or the paths they specified.
- Commit: `git commit -m "<message>"`.
- If nothing to commit (working tree clean), skip to Step 4 if the user still wants to push and open a PR.

---

### Step 2: Run linters

- Prefer project scripts: check `package.json` (or equivalent) for `lint`, `lint:fix`, `eslint`, or similar. Use the project's package manager (`npm run`, `pnpm run`, `yarn`).
- Examples: `npm run lint`, `npm run lint:fix`, `pnpm run lint`.
- If no lint script exists, skip this step and say so.
- If the linter reports errors, stop and report them; do not push until the user fixes them or asks to proceed anyway.

---

### Step 3: Run tests

- Run the project test script: `npm test`, `pnpm test`, `yarn test`, or the script name in `package.json` (e.g. `test`, `test:ci`). Use `-- --watchAll=false` or equivalent for non-watch mode in CI-like runs.
- If no test script exists, skip and say so.
- If tests fail, stop and report; do not push until the user fixes them or asks to proceed.

---

### Step 4: Push branch

- Ensure a branch is checked out. If the user is on a feature branch, use it; otherwise they may need to create one first (e.g. `git checkout -b feature/short-name`).
- Push: `git push -u origin <branch-name>` (use `-u` if the branch is not yet tracking a remote). If the branch already has an upstream, `git push` is enough.

---

### Step 5: Open pull request

- **If GitHub CLI is available** (`gh`): run `gh pr create` and, if needed, pass title/body or use `--fill` to use the commit message. Add `--web` to open the PR in the browser for the user to edit.
- **If `gh` is not available**: after pushing, tell the user the branch name and give the PR URL pattern so they can open it manually, e.g. `https://github.com/<owner>/<repo>/compare/<branch-name>?expand=1`.

---

## Summary

| Step   | Action        | Command / note                          |
|--------|---------------|------------------------------------------|
| 1      | Commit        | `git add` then `git commit -m "..."`     |
| 2      | Lint          | `npm run lint` (or project’s lint script)|
| 3      | Test          | `npm test` (or project’s test script)    |
| 4      | Push          | `git push -u origin <branch>`            |
| 5      | Open PR       | `gh pr create` or share compare URL      |

If the user only wants part of this (e.g. “just push” or “just open PR”), do only the requested steps.
