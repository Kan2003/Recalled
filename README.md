# Recalled 🧠

> **AI-powered meeting intelligence platform** — Never forget what was said, decided, or assigned. Transcribe, summarize, extract action items, and chat with your meetings using AI.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)

---

## 📸 Screenshots

> _Add your app screenshots here once the UI is ready_

---

## ✨ Features

- 🎤 **Audio Transcription** — Upload meeting recordings, auto-transcribed via OpenAI Whisper
- 🤖 **AI Summarization** — Claude AI extracts summaries, key decisions & topics
- ✅ **Action Item Extraction** — Auto-detects tasks, owners, and due dates from conversation
- 💬 **Ask Your Meeting** — Chat with any past meeting using natural language Q&A
- 🔗 **Shareable Summaries** — Share meeting recaps via a unique public URL
- 📧 **Email Reminders** — Automated follow-up emails for pending action items
- ⏰ **Smart Reminders** — Daily nudges for incomplete action items via cron jobs
- 🔐 **Google Auth** — One-click sign in with Google via NextAuth.js

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon) + Prisma ORM |
| **Auth** | NextAuth.js v5 — Google Provider |
| **AI — Summarization** | Anthropic Claude API |
| **AI — Transcription** | OpenAI Whisper API |
| **Email** | Resend |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
recalled/
├── app/
│   ├── (auth)/
│   │   └── login/              # Login page
│   ├── dashboard/
│   │   ├── page.tsx            # All meetings list
│   │   └── [meetingId]/
│   │       └── page.tsx        # Single meeting view
│   ├── upload/
│   │   └── page.tsx            # Upload audio / paste transcript
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth handler
│       ├── meetings/
│       │   ├── route.ts        # GET all, POST new meeting
│       │   └── [id]/
│       │       ├── route.ts    # GET single meeting
│       │       └── ask/        # POST — Ask AI about a meeting
│       ├── transcribe/         # Whisper transcription
│       ├── analyze/            # Claude AI analysis
│       └── cron/reminders/     # Scheduled reminders
├── components/
│   ├── MeetingCard.tsx
│   ├── ActionItemList.tsx
│   ├── AskAI.tsx
│   └── TranscriptViewer.tsx
├── lib/
│   ├── prisma.ts               # Prisma DB client
│   ├── claude.ts               # Claude API wrapper
│   ├── whisper.ts              # Whisper API wrapper
│   └── email.ts                # Resend email helpers
└── prisma/
    └── schema.prisma
```

---

## 🗄️ Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  meetings      Meeting[]
}

model Meeting {
  id          String       @id @default(cuid())
  title       String
  transcript  String       @db.Text
  summary     String?      @db.Text
  createdAt   DateTime     @default(now())
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  actionItems ActionItem[]
}

model ActionItem {
  id        String    @id @default(cuid())
  task      String
  owner     String?
  dueDate   DateTime?
  done      Boolean   @default(false)
  meetingId String
  meeting   Meeting   @relation(fields: [meetingId], references: [id])
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (free tier at [Neon](https://neon.tech))
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- Resend API key ([resend.com](https://resend.com))

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/recalled.git
cd recalled
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_neon_postgres_connection_url"

# NextAuth
AUTH_SECRET="your_generated_secret"
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"
NEXTAUTH_URL="http://localhost:3000"

# AI
ANTHROPIC_API_KEY="your_anthropic_api_key"
OPENAI_API_KEY="your_openai_api_key"

# Email
RESEND_API_KEY="your_resend_api_key"
```

Generate your `AUTH_SECRET`:
```bash
npx auth secret
```

### 4. Setup the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → name it **Recalled**
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Set Application type to **Web application**
6. Add the following:

```
Authorized JavaScript origins:
  http://localhost:3000

Authorized redirect URIs:
  http://localhost:3000/api/auth/callback/google
```

7. Copy the **Client ID** and **Client Secret** into your `.env.local`

---

## 🗓️ Roadmap

- [x] Project setup & folder structure
- [x] PostgreSQL + Prisma schema
- [x] Google Auth via NextAuth.js
- [ ] Upload page — audio + transcript input
- [ ] Whisper API transcription
- [ ] Claude AI — summarization & action item extraction
- [ ] Single meeting view
- [ ] Ask AI — chat with a meeting
- [ ] Shareable public meeting links
- [ ] Email reminders via Resend
- [ ] Cron job for daily action item nudges
- [ ] Search across all meetings
- [ ] Mark action items as complete
- [ ] Deploy on Vercel

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

Built with ❤️ as a portfolio project to explore AI + full-stack development.

> *"Recalled — because every decision deserves to be remembered."*
