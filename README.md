# <p align="center">✨ VITAE — The Intelligence-Driven Resume Architect</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/AI-Groq%20%2B%20OpenRouter-orange?style=for-the-badge" alt="AI" />
  <img src="https://img.shields.io/badge/Auth-Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/DB-Prisma%20v7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 💎 What is Vitae?

**Vitae** is a full-stack, production-grade AI-powered resume builder built for ambitious professionals. It combines a cinematic "Brutalist-Premium" dark UI with cutting-edge LLM intelligence across multiple AI providers, turning your career history into a compelling, ATS-optimized narrative that stands out.

Built with Next.js 16 App Router, Supabase Auth, Prisma v7, and a dual-provider AI backbone (Groq + OpenRouter), Vitae is designed to handle real-world production traffic with rate limiting, prompt injection protection, and secure database access patterns.

---

## 📸 Visual Showcase

<p align="center">
  <i>The Control Room — Your production-grade career workspace.</i>
</p>

<p align="center">
  <img src="https://via.placeholder.com/800x450/0a0a0a/ffffff?text=Vitae+%E2%80%94+Dashboard+%2F+Control+Room" alt="Dashboard" width="80%" />
</p>

<div align="center">
  <table>
    <tr>
      <td width="50%"><img src="https://via.placeholder.com/400x225/0a0a0a/ffffff?text=Live+Resume+Editor" alt="Resume Editor" /></td>
      <td width="50%"><img src="https://via.placeholder.com/400x225/0a0a0a/ffffff?text=Job+Match+Engine" alt="Job Match" /></td>
    </tr>
    <tr>
      <td align="center"><b>Live Resume Editor</b></td>
      <td align="center"><b>Job Match Analytics</b></td>
    </tr>
    <tr>
      <td width="50%"><img src="https://via.placeholder.com/400x225/0a0a0a/ffffff?text=Cover+Letter+Studio" alt="Cover Letter Studio" /></td>
      <td width="50%"><img src="https://via.placeholder.com/400x225/0a0a0a/ffffff?text=Template+Library" alt="Template Library" /></td>
    </tr>
    <tr>
      <td align="center"><b>Cover Letter Studio</b></td>
      <td align="center"><b>Template Library</b></td>
    </tr>
  </table>
</div>

---

## 🚀 Core Features


### 📄 Resume Builder & Editor
- **Live Rich Editor**: A real-time drag-and-drop resume editor with instant visual feedback.
- **Modular Section Management**: Add, remove, and reorder sections including Work Experience, Education, Skills, Projects, and Certifications.
- **Auto-Save**: Resume content is automatically persisted to the database as you type.
- **Resume Versioning**: The system tracks resume versions to preserve a history of your edits.
- **Resume Titles**: Name and rename your resumes for easy organization in the library.

### 🎨 Premium Templates
A curated collection of high-fidelity, professionally designed templates:
- **Harvard Classic** — Traditional academic and law-firm style with precise typographic rules.
- **Consulting Elite** — Clean, high-density layout favored by top-tier consulting firms.
- **Investment Banking** — Structured, formal layout optimized for financial sector applications.
- **Modern Executive** — Contemporary, stylish design for senior leadership roles.
- **Tech Professional** — Clean and scannable, optimized for engineering and product roles.

### 🧠 Multi-Provider AI Engine
Vitae features a resilient dual-AI architecture:
- **Primary Provider (Groq)**: Ultra-low-latency inference using Llama 3.3 70B for real-time features.
- **Secondary Provider (OpenRouter)**: Automatic fallback to a curated list of free frontier models (including Llama 3.3 70B, Hermes 405B, Gemma, DeepSeek, and more) for generation and scoring tasks.
- **Failover Logic**: If Groq is overloaded or unavailable, the system seamlessly switches to OpenRouter with no user disruption.

### 🤖 AI Writing Assistant
- **Global Chat Companion**: A persistent AI assistant accessible from any page in the app. Ask it to rewrite sections, brainstorm bullet points, or critique your tone.
- **Context-Aware**: The assistant is aware of your resume content and can give personalized, specific advice.
- **Bullet Point Rewriter**: Select any bullet point and instantly get AI-powered rewrites with stronger impact verbs and quantified results.
- **ATS Score Engine**: Get an AI-generated ATS compatibility score (0–100) with specific, actionable feedback on keyword density, formatting, and section completeness.

### 🎯 Job Match Engine
- **Paste & Analyze**: Paste any job description and compare it against your selected resume.
- **Gap Analysis**: Identifies missing skills, keywords, and experience that are explicitly mentioned in the job posting but absent from your resume.
- **Match Score**: Generates a compatibility percentage with a detailed breakdown of strengths and weaknesses.
- **Tailoring Suggestions**: Provides concrete, prioritized recommendations to improve your match score.

### ✍️ Cover Letter Studio
- **AI-Powered Generation**: Generate a full, personalized cover letter from your resume content and job description in one click.
- **Tone Selection**: Choose from multiple professional tones — Corporate, Startup, Creative, Executive, or Minimalist.
- **Cover Letter Library**: All generated letters are saved to your account and displayed in a dedicated cover letter page with cards showing the company, role, and last-updated date.
- **Search Integration**: Saved cover letters are indexed and searchable from the global search bar.

### 📥 Resume Import (PDF & DOCX)
- **AI-Driven Parsing**: Upload your existing PDF or Word document and let the AI extract and map your experience into Vitae's schema automatically.
- **Template Selection on Import**: Choose which template to apply to your imported content immediately.
- **Robust Error Handling**: The importer uses Llama 3.3 70B with defensive JSON cleanup to handle malformed AI responses gracefully.

### 🖨️ PDF Export
- **Pixel-Perfect Rendering**: Uses Puppeteer to render your resume exactly as it appears in the preview.
- **Serverless-Compatible**: In production (Vercel), PDF generation uses **Browserless.io** as a remote browser service, avoiding serverless function size limits.
- **Automatic Fallback**: If no `BROWSERLESS_API_KEY` is set, it falls back to a local Puppeteer instance for development.
- **Export History**: Every PDF export is logged to the database and reflected in your dashboard stats.

### 🔔 Notifications System
- **Real-Time Alerts**: Receive in-app notifications for key events like resume exports, imports, and AI completions.
- **Notification Center**: A dedicated page to view, filter, and manage all past notifications.
- **Mark as Read**: Individual and bulk mark-as-read functionality.

### 👤 Profile & Settings
- **Avatar Upload**: Upload a custom profile picture stored via Supabase Storage.
- **Workspace Settings**: Configure editor preferences, export defaults, and notification preferences.
- **Account Management**: View account details linked to your Supabase identity.

### 🔍 Global Search
- **Cross-Content Search**: The global search bar (CMD+K) searches across your resume titles, cover letter titles, and all navigable pages simultaneously.
- **Real-Time Results**: Results appear instantly as you type with categorized sections for Resumes, Cover Letters, and Pages.

---

## 🔒 Security Features

Vitae is hardened for production with multiple layers of security:

- **Rate Limiting (Upstash Redis)**: All AI endpoints are rate-limited to **10 requests per minute** per user to prevent token draining and API abuse.
- **Prompt Injection Protection**: System prompts in all AI routes explicitly instruct the model to ignore any instructions embedded within user-provided resume or job description text. User inputs are also hard-capped in length.
- **IDOR Prevention (Atomic DB Updates)**: All database update operations use `updateMany` with compound `WHERE id = X AND userId = Y` clauses to prevent unauthorized cross-user data modification, even under race conditions.
- **Input Validation**: All AI route inputs (resume content, job descriptions, text rewrites) have strict character limits to prevent token exhaustion attacks.
- **Account Merging**: The `ensureAppUser` function upserts by **email** instead of Supabase ID, safely merging accounts when a user signs up with multiple OAuth providers (e.g., Email + Google).

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Base UI](https://base-ui.com/) |
| **Auth** | [Supabase Auth](https://supabase.com/auth) (Email, Google, GitHub OAuth) |
| **Database ORM** | [Prisma v7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) with Connection Pooling |
| **AI Primary** | [Groq](https://groq.com/) — Llama 3.3 70B |
| **AI Secondary** | [OpenRouter](https://openrouter.ai/) — Multi-model fallback |
| **Rate Limiting** | [Upstash Redis](https://upstash.com/) + `@upstash/ratelimit` |
| **PDF Export** | [Puppeteer](https://pptr.dev/) + [Browserless.io](https://browserless.io/) |
| **Animations** | [GSAP](https://greensock.com/gsap/) + [Framer Motion](https://www.framer.com/motion/) + [Anime.js](https://animejs.com/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Drag & Drop** | [DND Kit](https://dndkit.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## ⚙️ Installation & Local Setup

### Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com/) project
- A [Groq](https://groq.com/) API key
- An [Upstash Redis](https://upstash.com/) database

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ResumeBuilder.git
cd vitae
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `/vitae` directory:

```env
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_MOCK_AUTH="false"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Database (Prisma v7 — URL passed via adapter)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres"

# AI Providers
GROQ_API_KEY="your-groq-api-key"
OPEN_ROUTER_API_KEY="your-openrouter-api-key"
OPEN_ROUTER_MODEL="meta-llama/llama-3.3-70b-instruct:free,..."

# AI Provider Config
AI_PROVIDER_SECONDARY="openrouter"
AI_SECONDARY_TASKS="generation,scoring"
AI_SECONDARY_FALLBACK="true"

# Rate Limiting
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# PDF Export (optional for local dev, required for Vercel)
# BROWSERLESS_API_KEY="your-browserless-key"
```

### 4. Run database migrations
```bash
npx prisma migrate deploy
```

### 5. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🌍 Production Deployment (Vercel)

### 1. Push to GitHub
Ensure your code is pushed to a GitHub repository. Make sure `.env` is in your `.gitignore`.

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Import your GitHub repository.

### 3. Add Environment Variables
In the Vercel project setup, add all variables from your `.env` file, plus:

| Variable | Production Value |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |
| `NEXT_PUBLIC_MOCK_AUTH` | `false` |
| `DATABASE_URL` | Use the **Supabase Connection Pooler** URL (port `6543`, with `?pgbouncer=true`) |
| `BROWSERLESS_API_KEY` | Your Browserless.io API key |

> ⚠️ **Important**: For Vercel (serverless), always use the **Supabase Pooled Connection String** for `DATABASE_URL`, not the direct connection. Find it in Supabase → **Connect** → **ORM** tab.

### 4. Configure Supabase for Production
In your Supabase Dashboard → **Authentication** → **URL Configuration**:
- **Site URL**: `https://your-project.vercel.app`
- **Redirect URLs**: `https://your-project.vercel.app/**`

### 5. Deploy
Click **Deploy**. The build script runs `prisma generate && next build` automatically.

---

## 📁 Project Structure

```
vitae/
├── app/
│   ├── (dashboard)/       # Protected app pages
│   │   ├── dashboard/     # Stats & quick actions
│   │   ├── resumes/       # Resume library
│   │   ├── resumes/[id]/  # Live resume editor
│   │   ├── cover-letters/ # Cover letter studio & library
│   │   ├── templates/     # Template picker
│   │   ├── job-match/     # ATS job match engine
│   │   ├── ai-assistant/  # Global AI chat
│   │   ├── import/        # PDF/DOCX importer
│   │   ├── notifications/ # Notification center
│   │   ├── profile/       # User profile & avatar
│   │   └── settings/      # Workspace settings
│   ├── (marketing)/       # Public landing page
│   ├── api/
│   │   ├── ai/            # AI endpoints (chat, rewrite, score, cover-letter)
│   │   ├── export/pdf/    # Puppeteer PDF export
│   │   ├── import/        # Resume file parsing
│   │   └── workspace/     # Global search data
│   ├── login/ & signup/   # Auth pages
│   └── actions/           # Server Actions (resume, cover-letter)
├── components/            # Reusable UI components
├── lib/
│   ├── ai/                # Groq + OpenRouter clients
│   ├── supabase/          # Supabase server/client helpers
│   ├── prisma.ts          # Prisma client with PrismaPg adapter
│   ├── rate-limit.ts      # Upstash rate limiters
│   └── app-user.ts        # User upsert / account merging logic
└── prisma/
    └── schema.prisma      # Full database schema
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. 🍴 **Fork** the project
2. 🌿 Create a **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** your changes (`git commit -m 'feat: add AmazingFeature'`)
4. 🚀 **Push** to the branch (`git push origin feature/AmazingFeature`)
5. 📬 Open a **Pull Request**

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Built with precision for the modern job market. 🚀
</p>
