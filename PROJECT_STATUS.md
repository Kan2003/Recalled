# Recalled — Project Status & Decisions

_Last updated: 2026-07-01 · Branch: `UI_Design`_

Recalled is an AI meeting-intelligence app: upload/record a meeting, transcribe it, get an AI summary + decisions + action items, then browse/ask questions about it from a dashboard.

---

## 1. Tech stack (and why)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js `16.2.6`, React `19.2.4` | App Router. **Not the Next.js you know** — see `AGENTS.md`, check `node_modules/next/dist/docs/` before assuming API shape. |
| Database | PostgreSQL via `pg` + Prisma `7.8.0` | Uses the newer `prisma-client` generator (not `prisma-client-js`), output to `lib/generated/prisma`. |
| Auth | NextAuth v5 (beta) + `@auth/prisma-adapter`, Google OAuth only | Session/account/user tables are Prisma-backed. |
| Meeting analysis (LLM) | Anthropic Claude via `@anthropic-ai/sdk`, model `claude-sonnet-4-6` | Called directly in `app/api/analyze/route.ts`. |
| Transcription | Groq's hosted Whisper (`whisper-large-v3-turbo`) via the `openai` SDK pointed at Groq's OpenAI-compatible endpoint | **Decision:** reuse the `openai` package as an HTTP client shape instead of adding a Groq-specific client — `groq-sdk` is in `package.json` but currently unused. README still says "OpenAI Whisper," which is stale — the actual provider is Groq. |
| Styling | Tailwind CSS v4, no component library | Landing/upload/dashboard UI is hand-built with inline `style={}` + shared `tokens` modules per section (`components/*/tokens.ts` style pattern), not a design system. |
| Route protection | `proxy.ts` at repo root (not `middleware.ts`) | Wraps `auth()`, redirects unauthenticated users to `/login`, redirects logged-in users away from `/login`. **Needs verification**: confirm this Next.js version actually treats root-level `proxy.ts` as the middleware entry point — if not, page-level route protection is silently a no-op and only the manual `session` checks inside API routes are real. |
| Analytics | `web-vitals` via `components/WebVitals.tsx` | Currently just `console.log`s metrics — no real analytics backend wired up yet. |

## 2. Data model (`prisma/schema.prisma`)

- `User` / `Account` / `Session` / `VerificationToken` — standard NextAuth schema.
- `Meeting` — `title`, `transcript`, `summary?`, `decisions Json?` (string[]), `topics Json?` (string[]), belongs to `User`, has many `ActionItem`.
- `ActionItem` — `task`, `owner?`, `dueDate?`, `done` (default false), belongs to `Meeting`.

**Decision:** `decisions` and `topics` are stored as loose `Json` arrays rather than normalized tables — fine for now given they're AI-extracted, display-only lists; revisit only if they need to be queried/filtered independently.

## 3. What's actually done (verified against code, not just UI)

### Fully working end-to-end
- **Auth**: Google sign-in, Prisma-backed sessions, `/login` page.
- **Upload → Analyze → Save pipeline** (`components/upload/UploadShell.tsx`): for **audio** and **pasted text** sources only —
  1. `POST /api/transcribe` (audio) or use pasted text directly
  2. `POST /api/analyze` (real Claude call → summary/decisions/actionItems/topics)
  3. `POST /api/meetings` (persists via Prisma)
  4. Redirects to `/dashboard/:meetingId`
- **`GET/POST /api/meetings`**: list current user's meetings, create a meeting with normalized action items (invalid `dueDate` strings like "Friday" are dropped rather than crashing `Date` parsing).
- **Landing, dashboard shell, upload UI**: visually complete (Hero, Features, HowItWorks, dashboard rail/panes, upload form with chip inputs for speakers/tags, cost/time estimate).

### Partially working / UI-only
- **Record-from-browser source**: UI exists (`RecordSource` in `components/upload/Sources.tsx`) but the "Start recording" button has no handler — placeholder only, needs `getUserMedia` + `MediaRecorder`.
- **URL/meeting-link import** (`URLSource`): input + "Fetch" button rendered, no handler wired.
- **Meeting detail page** (`app/dashboard/[meetingId]/page.tsx`): ignores the real `meetingId` param and always renders a hardcoded mock meeting — not yet wired to `GET /api/meetings/[id]`.
- **Dashboard/meeting-detail components** (`components/dashboard/data.ts`, `components/meeting/data.ts`): still driven by static mock data rather than the live `/api/meetings` list in places.

### Stubbed (file exists, no implementation)
- `app/api/meetings/[id]/route.ts` — fetch single meeting
- `app/api/meetings/[id]/ask/route.ts` — "Ask AI" chat about a meeting (the `AskAI`/`AskAIPanel` UI components have no backend)
- `app/api/cron/reminders/route.ts` — scheduled reminder emails
- `lib/claude.ts`, `lib/whisper.ts` — dead wrapper stubs; the real clients are inlined directly in the two API routes instead, so these files are currently unused
- `lib/email.ts` — Resend email helpers, fully unimplemented (no email sending anywhere in the app)

## 4. Known issues to clean up

- **`debugger` statement left in `app/api/analyze/route.ts`** (before the auth check) — remove before shipping.
- **`proxy.ts` naming risk** — verify against this Next.js version's actual docs that root-level `proxy.ts` (not `middleware.ts`) is the recognized middleware convention. If it isn't picked up, pages currently have **no server-side auth gating** at all (only API routes self-check `session.user.id`).
- **README drift** — README still describes Next.js 14 and "OpenAI Whisper"; both are wrong (Next 16, Groq-hosted Whisper). It also lists an unchecked roadmap that's now partially stale relative to actual code state.
- **Missing env var in docs** — `GROQ_API_KEY` is required by `app/api/transcribe/route.ts` but isn't listed in README's documented env vars (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID/SECRET`, `NEXTAUTH_URL`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`). No `.env.example` file exists at all.
- **Unused dependency**: `groq-sdk` is installed but not imported anywhere — either use it directly (drop the `openai`-as-Groq-client indirection) or remove it.

## 5. What remains (prioritized)

1. **Wire the meeting detail page to real data** — implement `GET /api/meetings/[id]` and replace the hardcoded mock render in `app/dashboard/[meetingId]/page.tsx`.
2. **Implement "Ask AI" for a meeting** — `POST /api/meetings/[id]/ask`, backing the existing `AskAI`/`AskAIPanel` components (likely another Claude call scoped to that meeting's transcript).
3. **Verify/fix route protection** — confirm `proxy.ts` is actually enforced by this Next.js version; if not, rename/adapt to whatever the correct convention is.
4. **Finish upload sources** — implement in-browser recording (`getUserMedia`/`MediaRecorder`) and URL-based import, or remove those tabs if out of scope for v1.
5. **Reminders/email** — implement `lib/email.ts` (Resend) and `app/api/cron/reminders/route.ts`, and decide how the cron is actually triggered (Vercel Cron, external scheduler, etc.).
6. **Housekeeping** — remove the leftover `debugger`, delete or repurpose the dead `lib/claude.ts`/`lib/whisper.ts` stubs, drop the unused `groq-sdk` dependency (or switch to it), add a `.env.example`, and update README to match current stack/provider reality.
7. **Search/mark-complete on action items** — `ActionItem.done` exists in the schema but no UI/route currently toggles it or searches across meetings.

## 6. Recent history (context)

Build order per `git log`: Prisma setup → Google auth → landing page UI → dashboard UI → upload UI + route protection (`proxy.ts`) → meeting-details page wired to `/api/analyze` and `/api/transcribe`. All work so far is by a single author on the `UI_Design` branch off `main`.
