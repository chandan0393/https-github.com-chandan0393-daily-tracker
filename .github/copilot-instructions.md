# Copilot / AI Agent Instructions for DailyTracker

Short, actionable guidance to help an AI coding agent be productive in this repo.

**Big picture**
- This is a small React + TypeScript + Vite single-page app (no backend). See `package.json` for scripts and deps.
- Routing is manual: `src/App.tsx` switches pages by `PageId` and renders components inside `Layout`.
- Primary domain logic lives in the Tasks feature: `src/hooks/useTasks.ts` manages in-memory state and persistence.

**State & persistence**
- Tasks are persisted to `localStorage` under key `lifeos.tasks` via `src/tasks/storage.ts`. Any change to task shape must update `loadTasks`/`isTask` and `saveTasks`.
- Use `useTasks()` (see [src/hooks/useTasks.ts](src/hooks/useTasks.ts#L1-L200)) when adding/updating/deleting tasks so UI and storage stay in sync.

**Key files and patterns (examples)**
- App entry: [src/main.tsx](src/main.tsx#L1-L50) → mounts `App`.
- Page/container pattern: `src/pages/*` (e.g. [src/pages/Tasks.tsx](src/pages/Tasks.tsx#L1-L200)) contains toolbar, controls, and lists of presentational components.
- Presentational components: `src/components/*` (e.g. `TaskItem`, `TaskFormModal`, `Modal`, `Layout`). Prefer small, focused components.
- Types & domain constants: `src/tasks/types.ts` defines task enums and `Task`/`TaskDraft` shapes—refer here when changing forms or storage.

**Conventions and constraints**
- No server: assume all data is local; avoid adding server-side references unless adding an explicit backend.
- ID generation: `useTasks` uses `crypto.randomUUID()` when available—keep this utility when creating tasks.
- Validation: `storage.loadTasks` defensively validates objects with `isTask` — preserve shape checks when editing task fields.
- UX flows: Editing opens `TaskFormModal` with `draftFromTask` defaults; saving calls `addTask` or `updateTask` through `useTasks`.

**Developer workflows**
- Start dev server: `npm run dev` (uses Vite). Build: `npm run build` (runs `tsc -b && vite build`). Preview: `npm run preview`.
- Lint: `npm run lint` (oxlint). There is no test runner configured—do not add test commands without confirming.

**When editing tasks or forms**
- Update `Task` and `TaskDraft` in [src/tasks/types.ts](src/tasks/types.ts#L1-L200) first, then update `TaskFormModal` and `toStoredFields` in [src/hooks/useTasks.ts](src/hooks/useTasks.ts#L1-L200) and `isTask` in [src/tasks/storage.ts](src/tasks/storage.ts#L1-L200).

**Styling & assets**
- Global styles live in `src/index.css`. Components rely on class names in JSX—rename classes cautiously and update CSS.

**Integration & extension points**
- Navigation items live in [src/data/navigation.ts](src/data/navigation.ts#L1-L200). Add pages by adding a `PageId`, `NAV_ITEMS` entry and handling it in `App.tsx`.
- To add persisted features beyond tasks, follow the same pattern: a small storage module with load/validate/save + a hook that exposes actions and persists through that module.

**Do not assume**
- There are no tests or CI workflows present; avoid making changes that rely on hidden CI steps.

If anything above is unclear or you want more examples (specific component flows, props, or lines to reference), tell me which area to expand. 
