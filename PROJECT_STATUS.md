# Recalled — Project Status & Decisions

_Last updated: 2026-07-08 · Branch: `transcribe` · includes uncommitted working-tree changes_

Recalled is an AI meeting-intelligence app: upload/record a meeting, transcribe it, get an AI summary + decisions + action items, then browse/ask questions about it from a dashboard.

---

## 1. Tech stack (and why)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js `16.2.6`, React `19.2.4` | App Router. **Not the Next.js you know** — see `AGENTS.md`, check `node_modules/next/dist/docs/` before assuming API shape. |
| Database | PostgreSQL via `pg` + Prisma `7.8.0` | Uses the newer `prisma-client` generator (not `prisma-client-js`), output to `lib/generated/prisma`. |
| Auth | NextAuth v5 (beta) + `@auth/prisma-adapter`, Google OAuth only | Session/account/user tables are Prisma-backed. |
| Meeting analysis (LLM) | **Switched from Anthropic Claude to Groq (Llama 3.3 70B)** — `groq.chat.completions.create({ model: "llama-3.3-70b-versatile" })` in `app/api/analyze/route.ts` | **Decision (this session's diff):** `@anthropic-ai/sdk` was dropped from `package.json` entirely. Uses a separate `GROQ_ANALYZE_API_KEY` env var (distinct from the transcription key) so the two Groq usages can be billed/rate-limited independently. |
| Transcription | Groq's hosted Whisper (`whisper-large-v3-turbo`) via the `openai` SDK pointed at Groq's OpenAI-compatible endpoint, key `GROQ_API_KEY` | Unchanged. `groq-sdk` is now actually justified as a dependency since `analyze/route.ts` uses it directly — no longer "unused." |
| Styling | Tailwind CSS v4, no component library | Landing/upload/dashboard UI is hand-built with inline `style={}` + shared `tokens` modules. |
| Route protection | `proxy.ts` at repo root (not `middleware.ts`) | Still unverified — see open issues below. |
| Analytics | `web-vitals` via `components/WebVitals.tsx` | Still just `console.log`s metrics. |

**Why the Claude → Groq switch for analysis:** consolidates both AI calls (transcription + analysis) onto a single provider (Groq), simplifying billing/env vars to one API key family instead of two providers. Trade-off: Llama 3.3 70B's JSON-following and reasoning quality on long transcripts is generally weaker than Claude Sonnet — worth watching for more malformed-JSON parse failures in `/api/analyze` (the code already tolerates code fences and slices `{…}`, but hasn't been proven against Llama's more variable formatting).

## 2. Data model (`prisma/schema.prisma`)

- `User` / `Account` / `Session` / `VerificationToken` — standard NextAuth schema.
- `Meeting` — `title`, `transcript`, `summary?`, `decisions Json?` (string[]), `topics Json?` (string[]), belongs to `User`, has many `ActionItem`.
- `ActionItem` — `task`, `owner?`, `dueDate?`, `done` (default false), belongs to `Meeting`.

No schema changes this round — the new work is all in the API/UI layer consuming this same schema.

## 3. What's actually done (verified against code)

### Newly completed this round
- **Upload now actually stops at a review step before saving** (this was a bug — user-reported: clicking "Analyze meeting" used to run transcribe → analyze → save → redirect in one shot, skipping review entirely). `UploadShell.tsx` now has an explicit `phase: "input" | "review"` state machine: `handleAnalyze` only transcribes + calls `/api/analyze` and stops; a new `components/upload/ReviewPanel.tsx` renders the editable summary/decisions/action-items/topics; only `handleConfirmSave` (triggered by "Confirm & save meeting") POSTs to `/api/meetings` and redirects. The header's `STEPS` indicator (`UploadHeader`, previously hardcoded to step 1) now reflects real state (1 = input, 2 = analyzing, 3 = review).
- **Dashboard is now wired to live data.** `DashboardShell.tsx` no longer imports static `MEETINGS` mock data — it `fetch("/api/meetings")` on mount, shows a loading state, an empty state ("No meetings yet — upload one to get started"), and renders the real list/detail panes from Prisma-backed data via new `toMeetingSummary`/`toActionItems`/`toDecisions` mappers in `components/dashboard/data.ts` (raw Prisma shape → UI shape).
- **Action items are now persisted and toggleable end-to-end.** New route `app/api/meetings/[id]/action-items/[itemId]/route.ts` (`PATCH`) validates ownership (meeting belongs to the session user, item belongs to that meeting) and updates `done` in Postgres. `MeetingDetailPane.tsx` calls it with optimistic UI update + rollback on failure — this closes out the "mark-complete" gap called out in the previous version of this doc.
- **`GET /api/meetings/[id]`** is implemented (was a stub before): fetches one meeting + its action items, 404s if missing or not owned by the caller.
- **The meeting detail page is now wired to real data** (commit `97ef466`, confirmed correct on review). `app/dashboard/[meetingId]/page.tsx` is a server component that auth-gates, fetches the meeting **directly via Prisma** (not over HTTP to its own `/api/meetings/[id]` route — a reasonable choice for a server component, avoids a self-fetch round trip), 404s via `notFound()` if missing/not owned, and maps it through a new `components/meeting/fromPrisma.ts` (`toMeetingDetail`) into the richer `MeetingDetail` shape the UI expects. Fields the schema doesn't track (speakers, per-turn transcript timestamps, unresolved questions, related-meeting overlap, decision/action citations) are degraded to empty/neutral values rather than faked — documented inline in `fromPrisma.ts`. This closes out what was previously the top-priority gap.
- **Dashboard list pane is now resizable/collapsible** (`MeetingListPane.tsx`): drag-to-resize with min/max width, collapses to a slim icon rail below a threshold, double-click resets to default width.
- **Account/sign-out menu added to the nav rail** (`Rail.tsx`): click-outside-to-close dropdown showing the signed-in user's name/email with a working `signOut({ callbackUrl: "/login" })`. The old "Search" rail icon was removed (unused/unwired).
- **Login page redesigned** (`app/(auth)/login/page.tsx`): now matches the app's visual system (Aurora background, `Card` primitive, Logo) instead of default Tailwind boilerplate, and surfaces real NextAuth error codes (`OAuthSignin`, `OAuthCallback`, `OAuthAccountNotLinked`, `AccessDenied`) as human-readable messages instead of failing silently.
- **"Record now" upload source removed.** `RecordSource` component, its tab, and its icon were deleted from `Sources.tsx`/`UploadShell.tsx` — this was previously a non-functional placeholder (no `getUserMedia` wiring); the decision this round was to cut it from the UI rather than ship a dead button. Upload now offers **audio** and **paste** (working) and **URL** (still unwired).
- **Key Decisions card is now null-safe**: `MeetingDetailPane` no longer assumes every decision has a `cite` string (real AI-extracted decisions don't have citations) and renders "No decisions extracted" / "No action items extracted" empty states instead of relying on mock arrays.
- **README and `.env` documentation updated** to reflect Groq-for-everything (transcription + analysis), including the new `GROQ_ANALYZE_API_KEY` variable.

### Fully working end-to-end (carried over + updated)
- **Auth**: Google sign-in, Prisma-backed sessions, redesigned `/login` page with error handling, sign-out from the dashboard rail.
- **Upload → Analyze → Review → Save pipeline** (audio + pasted text only): `/api/transcribe` → `/api/analyze` (now Groq/Llama instead of Claude) → **editable review screen** → `/api/meetings` → redirect to `/dashboard/:meetingId`.
- **Dashboard**: live meeting list + detail view, both backed by real Prisma data, with working action-item completion toggling.

### Partially working / UI-only
- **URL/meeting-link import** (`URLSource`): input + "Fetch" button rendered, still no handler wired; `UploadShell.handleSubmit` still has no branch for it (audio/paste only).
- **Meeting detail page degrades several fields to empty/neutral** (by design, per `fromPrisma.ts` comment) since the schema doesn't store them: no speakers, no per-turn transcript timestamps (whole transcript renders as one block), no unresolved-questions list, no related-meetings, no citation timestamps on decisions/actions. Cosmetic/UX gap, not a bug — worth a product decision on whether any of these are worth adding to the schema later.

### Stubbed (file exists, no implementation)
- `app/api/meetings/[id]/ask/route.ts` — "Ask AI" chat about a meeting (still `export {}`; `AskAI`/`AskAIPanel` UI components have no backend)
- `app/api/cron/reminders/route.ts` — scheduled reminder emails
- `lib/claude.ts` — now doubly dead: it was already unused, and the app no longer uses Claude at all anywhere
- `lib/whisper.ts` — dead wrapper stub; the real client is inlined in `app/api/transcribe/route.ts`
- `lib/email.ts` — Resend email helpers, fully unimplemented

## 4. Known issues to clean up

- **`debugger` statement in `app/api/analyze/route.ts`** — still present (survived the Claude→Groq rewrite of this same file). Remove before shipping.
- **`proxy.ts` naming risk** — still unverified whether this Next.js version treats root-level `proxy.ts` as real middleware. Unchanged risk from before.
- **Two-provider Groq setup**: analysis and transcription now both hit Groq but with two separate API keys (`GROQ_ANALYZE_API_KEY` vs `GROQ_API_KEY`). Confirm this split is intentional (e.g., separate rate-limit pools) rather than an accidental inconsistency — if there's no real reason for two keys, collapse to one to reduce config surface.
- **Uncommitted work**: everything in section 3's "Newly completed this round" is currently **uncommitted** (`git status` shows these as modified/untracked). Nothing has been committed since `97ef466`. Worth committing in logical chunks (e.g., "wire dashboard to live data + action item toggling", "switch analysis provider to Groq", "redesign login page", "remove unfinished record-audio source") rather than one giant commit.
- **Llama JSON reliability** (new risk from the provider switch): `/api/analyze`'s parse step (strip code fences, slice first `{` to last `}`) was written/tested against Claude's output style. Worth a few real runs against Llama 3.3 70B to confirm it doesn't regress the parse-failure rate.

## 5. What remains (prioritized)

1. **Implement "Ask AI" for a meeting** — `POST /api/meetings/[id]/ask` is still `export {}`. This is now the top remaining gap: the `AskAI`/`AskAIPanel` UI is built and expects to call it, but there's no backend. Likely shape: a Groq chat call scoped to that meeting's `transcript` + `summary`, following the same pattern as `/api/analyze`.
2. **Verify/fix route protection** — confirm `proxy.ts` is actually enforced by this Next.js version.
3. **Decide the fate of URL-based upload** — either wire `URLSource` to a real fetch-and-transcribe flow or remove the tab (same call already made for the record-audio source this round).
4. **Reminders/email** — implement `lib/email.ts` (Resend) and `app/api/cron/reminders/route.ts`, plus decide the trigger mechanism (Vercel Cron, etc.).
5. **Housekeeping**: remove the leftover `debugger`; delete `lib/claude.ts`/`lib/whisper.ts` (both fully dead now); confirm the two-Groq-key setup is intentional; commit the current working-tree changes in logical chunks.
6. **Search on the dashboard** — the old "Search" rail icon was removed with no replacement; there's currently no way to search meetings from the UI (the list pane has a search input already per earlier code — confirm it's still connected to `filtered` state, since the rail-level search nav was cut).
7. **Optional schema/UX enrichment** — decide whether speaker diarization, per-turn transcript timestamps, unresolved-question extraction, or related-meeting overlap are worth adding later; the detail page already has UI slots for all of them, just fed empty arrays today.

## 6. Recent history (context)

Committed build order per `git log`: Prisma setup → Google auth → landing page UI → dashboard UI → upload UI + route protection (`proxy.ts`) → meeting-details page wired to `/api/analyze` and `/api/transcribe` (commit `97ef466`). **On top of that**, the current uncommitted working tree adds: live dashboard data fetching, persisted/toggleable action items, a redesigned login page, an account/sign-out menu, a resizable meeting list pane, removal of the unfinished record-audio source, and a provider switch for meeting analysis from Anthropic Claude to Groq/Llama 3.3 70B. All work so far is by a single author.
