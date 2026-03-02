# Cursor Demo Walkthrough & Cheat Sheet

Your interview demo project: **Creative Asset Manager** — a mini Creative Cloud-style app for managing design assets. Use this guide to practice each Cursor feature using this project before your interview.

---

## Getting Started

1. Open Cursor and select **File > Open Folder** — choose the `creative-asset-manager` folder
2. Wait for Cursor to index the codebase (you'll see a progress indicator)
3. Verify the `.cursor/rules` file is detected (check Settings > Rules)

---

## Feature 1: Rules Files (Your First Demo)

**What to show:** Open `.cursor/rules` and walk through it. Explain that these are persistent instructions the AI follows every time it generates code.

**Practice exercise:**
1. Open the Agent panel (Cmd+L or Ctrl+L)
2. Ask: *"Write a new utility function that converts a hex color code to RGB"*
3. Watch how the response follows the rules — JSDoc annotations, const over let, descriptive names, try/catch error handling
4. Point out which rules the AI followed automatically

**Key talking point for Adobe:**
> "Instead of every developer on your team writing the perfect prompt, you define standards once. Rules enforce Adobe's coding conventions, security requirements, and architectural patterns automatically. And on Enterprise, you can push these centrally from the admin dashboard — no need to commit files to every repo."

---

## Feature 2: @codebase (Codebase-Wide Context)

**What to show:** Ask the AI a question that requires understanding multiple files, and show it pulling context from across the project.

**Practice exercises (try all of these):**
1. *"@codebase How does the search functionality work end-to-end, from the UI to the database?"*
   - It should reference SearchBar.jsx → useAssets.js → assetClient.js → routes/assets.js → assetModel.js
2. *"@codebase Where is file validation handled and what are the constraints?"*
   - It should find AssetUploader.jsx (client-side) and routes/assets.js (server-side)
3. *"@codebase What database tables exist and how are they related?"*
   - It should reference database.js and the foreign key between assets and asset_tags

**Key talking point for Adobe:**
> "With Photoshop's monorepo — millions of lines of code — the AI needs to understand how everything connects. @codebase uses Cursor's custom embedding model to index your entire repo. That's the difference between AI that understands your architecture and AI that's just guessing based on the open file."

---

## Feature 3: Agent Mode (Multi-File Tasks)

**What to show:** Give the agent a task that requires planning and editing across multiple files. Let the interviewer see it think, plan, and execute.

**Practice exercises (pick 2-3):**

**Easy win — great for demo:**
> *"Add error handling to all API endpoints that returns proper HTTP status codes and consistent error messages"*
- Agent should edit routes/assets.js across all route handlers

**Medium complexity — impressive:**
> *"Add a 'favorites' feature where users can star assets. This needs a new database table, API endpoint, and a favorite button on each AssetCard"*
- Agent should touch: database.js, create a new model or modify assetModel.js, add a route, modify AssetCard.jsx

**High impact — shows the real power:**
> *"Refactor the database layer to add a connection pool and add request logging middleware that tracks response times for every API call"*
- Agent should modify database.js, server.js, and possibly create new utility files

**Key talking point for Adobe:**
> "This isn't autocomplete. This is delegating actual engineering tasks — refactoring, adding features across files, fixing cross-cutting bugs. The agent plans a multi-step approach, edits multiple files, runs terminal commands, and self-corrects. For a company at Adobe's scale, that's a step-change in productivity."

---

## Feature 4: Model Selection

**What to show:** Open settings and show the model dropdown. Explain when to use which model.

**Quick framework:**
- **Fast autocomplete / tab completion** → Cursor's lightweight model (fast, context-aware)
- **Complex refactors, architectural questions** → Claude Sonnet 4.5 or GPT-4o (deep reasoning)
- **Quick code generation** → Whichever model is fastest for simple tasks

**Key talking point for Adobe:**
> "Different tasks benefit from different models. Cursor lets you pick — Claude, GPT, Gemini, Cursor's own model — and switch per task. Teams can standardize on configurations that work. That flexibility is unique to Cursor vs. Copilot, which is more locked into the GitHub/OpenAI ecosystem."

---

## Feature 5: Enterprise Features (Know These, Don't Demo)

You won't demo these live, but you need to speak to them confidently when security comes up:

| Feature | What It Does | Why Adobe Cares |
|---|---|---|
| **Privacy Mode** | Zero data retention, code never stored or trained on | Proprietary code stays private |
| **SOC 2 Type II** | Third-party audited security certification | Meets enterprise compliance bar |
| **SSO/SAML + SCIM** | Single sign-on, automatic user provisioning | IT team can manage at scale |
| **Admin Dashboard** | Usage analytics, team management, centralized billing | One pane of glass; data to justify investment |
| **Team Rules** | Push rules to all devs centrally — no repo commits needed | Standardization without developer friction |
| **Sandboxed Terminals** | Agent commands run in secure sandbox, no internet by default | Enterprise can enforce network allowlists |
| **Audit Logs** | Timestamped admin event logs | Compliance and governance requirements |
| **Bugbot** | Automated PR review + auto-fix, posts comments on PRs | Catches bugs before merge; 76% resolution rate |

---

## NEW Features to Mention (Latest — Feb 2026)

These are recent and will show you're up-to-date:

**Cloud Agents** — Agents that run in isolated cloud VMs, produce merge-ready PRs with screenshots/videos/logs. Available via web, desktop, mobile, Slack, and GitHub. 35% of Cursor's own internal PRs are now created by cloud agents.

**Plugins & Marketplace** — Cursor 2.5 introduced plugins that package skills, subagents, MCP servers, and rules into one install. Launch partners include Amplitude, AWS, Figma, Linear, and Stripe.

**Async Subagents** — Agents can now spawn child agents that work in parallel. Up to 8 agents running simultaneously on one prompt, each in its own isolated copy of the codebase.

**Browser Tool** — Agent can open a browser to test UI changes it made. Now GA with Enterprise support.

**CLI Cloud Handoff** — Start a plan in the CLI, hand it off to a cloud agent to execute.

---

## Competitive Positioning Quick Reference

### vs. GitHub Copilot
- Copilot is a plugin; Cursor IS the IDE → can plan across files, run commands, manage diffs natively
- Copilot mostly works with the open file; Cursor indexes the whole codebase
- Copilot improving with Agent Mode but catching up on multi-file workflows
- Cursor lets you pick your model; Copilot is more locked into GitHub/OpenAI

### vs. Claude Code
- Claude Code is terminal-based — no visual IDE, no inline diffs, no tab completion
- Cursor integrates Claude's models directly — same reasoning power, better workflow
- Cost: Claude Code is consumption-based (can spike in heavy sprints); Cursor is per-seat pricing (more predictable)
- Cursor = where developers live day-to-day; Claude Code = hand off a task and come back

### The Consolidation Framing
> "Do you want to manage three tools with three workflows, three security postures, and three admin experiences? Or one platform with the best models, deepest codebase understanding, and centralized control?"

---

## Project File Map (Know Your Demo)

```
creative-asset-manager/
├── .cursor/rules              ← Demo 1: Show this first
├── package.json
├── src/
│   ├── components/
│   │   ├── App.jsx            ← Main app layout
│   │   ├── SearchBar.jsx      ← Debounced search input
│   │   ├── AssetGrid.jsx      ← Memoized grid display
│   │   ├── AssetCard.jsx      ← Individual asset card
│   │   ├── AssetDetail.jsx    ← Slide-out detail panel
│   │   └── AssetUploader.jsx  ← Upload with validation
│   ├── api/
│   │   ├── server.js          ← Express server setup
│   │   ├── routes/assets.js   ← CRUD API endpoints
│   │   └── assetClient.js     ← Frontend API client
│   ├── db/
│   │   ├── database.js        ← SQLite connection & schema
│   │   ├── assetModel.js      ← Data access layer
│   │   └── seed.js            ← Sample Adobe-themed data
│   ├── hooks/
│   │   └── useAssets.js       ← Custom data-fetching hook
│   └── utils/
│       ├── debounce.js        ← Debounce utility
│       └── formatters.js      ← File size & date formatters
```

---

## Suggested Demo Flow (10 min)

1. **Rules** (2 min) — Open .cursor/rules, explain what it does, ask agent to write a function, show how rules are followed
2. **@codebase** (3 min) — Ask "how does search work end-to-end?" and show it pulling from 5 files
3. **Agent mode** (4 min) — Ask it to "add a favorites feature" and let it plan + execute across files
4. **Model switching** (1 min) — Show the dropdown, explain when you'd use different models

This mirrors the prep doc's recommended demo order and maps directly to the pain points you'll uncover in discovery.
