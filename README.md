# Black Mac Portfolio

A modern, feature-rich cybersecurity professional portfolio built with React, TypeScript, and Tailwind CSS. The site showcases projects, case studies, client work, and certifications, and also ships two interactive tools: an AI-powered resume & cover letter generator and a collaborative leveling/notebook tool.

🌐 **Live Site:** [ankkiyy.com](https://ankkiyy.com)

---

## Table of Contents

- [Features](#features)
  - [Portfolio Sections](#portfolio-sections)
  - [Interactive Tools](#interactive-tools)
- [Tool Usage Guide](#tool-usage-guide)
  - [AI Resume & Cover Letter Generator — Usage](#ai-resume--cover-letter-generator--usage)
  - [Leveling Tool — Usage](#leveling-tool--usage)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Dev Server](#running-the-dev-server)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [AI Prompts Reference](#ai-prompts-reference)

---

## Features

### Portfolio Sections

| Section | Description |
|---------|-------------|
| **Home** | Animated hero landing page highlighting core services: Penetration Testing, Security Architecture, Threat Hunting, and Incident Response |
| **Projects** | Searchable and category-filterable gallery of technical projects with tech-stack tags and external links |
| **Case Studies** | In-depth real-world cybersecurity success stories covering challenges, solutions, and measurable results |
| **Clients** | Client/partner showcase with an auto-rotating testimonials carousel |
| **Certificates** | Searchable and filterable gallery of professional certifications, grouped by issuing organization |
| **About** | Personal bio, skills summary, and contact information |

Additional capabilities across all pages:

- **Responsive design** — optimized for mobile, tablet, and desktop viewports
- **Dark mode** — theme switching powered by `next-themes`
- **Cyber-themed animations** — multiple animated background variants and loading states
- **Smooth scroll-to-top** — automatic scroll reset on every route change

---

### Interactive Tools

Both tools are accessible from the **Tools** hub (`/tools`).

#### 1. AI Resume & Cover Letter Generator

🔗 **Live:** [ankkiyy.com/tools/ai-resume-and-cover-letter-generator](https://ankkiyy.com/tools/ai-resume-and-cover-letter-generator)

An LLM-powered document builder that creates tailored resumes and cover letters.

- Enter personal details, work experience, and education once; the form state is **persisted to encrypted local storage** via Redux Persist + AES encryption so nothing is lost on page refresh
- Select a job description and let **Google Generative AI** (via LangChain) draft a custom resume and cover letter in seconds
- Preview and copy the generated Markdown output, rendered with `react-markdown`
- Bring your own **Google Gemini API key** — stored locally, never sent to any server other than Google's API
- Built with **React Hook Form** and **Zod** schema validation

> ⚠️ **API Key required:** To prevent abuse, the tool does **not** include a shared API key. Each user must obtain their own free key from [Google AI Studio](https://aistudio.google.com/app/apikey) and enter it in the tool's setup screen. The key is saved only in your browser's local storage and is never sent to this project's servers.

#### 2. Leveling Tool

🔗 **Live:** [ankkiyy.com/tools/leveling](https://ankkiyy.com/tools/leveling)

A gamified personal-development notebook with real-time sync capabilities.

- **Game Profile** — create and manage your personal character profile
- **Skill Tree** — track progress across custom skill branches with visual progress indicators (powered by Recharts)
- **Progress Tracking** — view achievement history and milestone completion
- **Daily Log (AI)** — write a free-text description of your day; AI analyses the text, identifies which skills you worked on, and updates XP automatically
- **Settings** — customise AI model endpoint, XP gain/penalty values, and sync preferences; all stored persistently
- **Encrypted QR Sync** — export your entire notebook state as an AES-GCM encrypted QR code; scan it from another device to import instantly (no account or server storage needed)
- **WebRTC P2P Sync** — real-time, peer-to-peer data transfer between devices using Socket.io signaling + native WebRTC; no user data passes through the signaling server
- All state is managed with **Redux Toolkit** and persisted with AES-encrypted local storage

---

## Tool Usage Guide

### AI Resume & Cover Letter Generator — Usage

🔗 **[https://ankkiyy.com/tools/ai-resume-and-cover-letter-generator](https://ankkiyy.com/tools/ai-resume-and-cover-letter-generator)**

#### Prerequisites

- A free **Google Gemini API key** from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

#### Step-by-Step

1. **Enter your API key** on the setup screen. The key is stored only in your browser (AES-encrypted local storage) and is sent exclusively to Google's Generative AI API — never to this project's servers.
2. **Fill in Personal Information** — name, email, phone, location, LinkedIn, GitHub, and portfolio URL. Click **Save** to persist to local storage.
3. **Add Work Experience** — click **Add Experience**, then fill in job title, company, location, dates, and a description of your responsibilities and achievements.
4. **Add Education** — click **Add Education** and fill in degree, institution, dates, GPA (optional), and any relevant coursework.
5. **Enter Job Details** — paste the full job description and list the key skills you want to highlight.
6. **Click Generate** — the tool calls the Gemini API (`gemini-2.5-flash-lite`) and produces an ATS-optimized resume structured as JSON, rendered as Markdown.
7. **Review & Export** — copy the output to clipboard, toggle between rendered and raw Markdown views, or open the **Print** view for a formatted PDF-ready page.
8. **Reset** — use the Reset button to clear all saved data, including the API key, from local storage.

> All data (personal info, experience, education, API key) is persisted across page refreshes via Redux Persist + AES encryption. Nothing is sent to any third-party server except Google's Gemini API when you click Generate.

---

### Leveling Tool — Usage

🔗 **[https://ankkiyy.com/tools/leveling](https://ankkiyy.com/tools/leveling)**

The Leveling Tool turns your daily activity into a gamified skill tracker. It uses free-text **daily logs**, an AI model, and an XP system to keep you accountable.

#### Getting Started

1. Open the tool and navigate to the **Profile** tab.
2. Enter your **username** and save — this creates your game profile.

#### Managing Skills

1. Go to the **Skills** tab.
2. Click **Add Skill** and enter a skill name and category (e.g., "React", "Python", "Communication").
3. Each skill starts at Level 1 with 20 XP.
4. Skills are visualized as a tree with progress bars and level indicators (powered by Recharts).

#### Writing Daily Logs (AI Skill Updates)

1. Go to the **Daily Log** tab.
2. Write a free-text description of what you did today. Be natural — mention the tools, languages, or activities you worked on. **Example:**
   > "Today I built a new React component for the dashboard, fixed a bug in the Python backend, and spent an hour practicing my SQL queries."
3. Click **Process Daily Log**.
4. The tool sends your log to the configured AI model with a prompt asking it to identify which of your registered skills appear in the text.
5. Skills that are matched receive **+XP** (default: +10 XP). Skills that are not mentioned receive a **penalty** (default: −20 XP, minimum 0).
6. If you missed one or more full calendar days since your last log, **all skills are degraded** first, then today's update is applied.
7. The processed log is saved to history with timestamps and a tag list of updated skills.

#### Configuring the AI Model

Go to the **Settings** tab to configure:

| Setting | Default | Description |
|---------|---------|-------------|
| AI Model URL | `http://localhost:11434` | Ollama API endpoint or any compatible AI service |
| Model Name | `llama2` | Model to use (e.g., `llama2`, `mistral`, `codellama`) |
| Daily XP Gain | `10` | XP added to each worked-on skill per day |
| Missed Day Penalty | `20` | XP subtracted from skills not mentioned (or when a day is skipped) |

> **Fallback:** If the AI model is unreachable, the tool falls back to simple keyword matching — it checks whether any skill name appears literally in your log text.

#### Real-Time Sync with WebRTC

The tool supports two sync methods — both require no account or server storage for user data:

**QR Code Sync (offline-friendly):**
1. In your profile, generate an **Encrypted QR Code export**. You will be prompted to set a password.
2. On the target device, use the **Scan QR** option and enter the same password to import your full profile state.

**WebRTC P2P Sync (real-time):**
1. Ensure **Peer Connection** is enabled in Settings.
2. Both devices connect to the Socket.io signaling server (used only for initial handshake — no data is stored there).
3. Once the WebRTC data channel is established, all profile data flows **directly between your browsers** in real time.
4. Enable **Auto Sync** to broadcast every state change automatically to connected peers.

#### Local Storage & Encryption Details

| Layer | Technology | What Is Stored |
|-------|-----------|----------------|
| Redux Persist | AES encryption (`redux-persist-transform-encrypt`) | All tool state: profile, skills, daily logs, settings |
| QR export payload | AES-GCM 256-bit, PBKDF2 key derivation (100 000 iterations), Web Crypto API | Full serialized Redux state, encrypted with user-supplied password |

The encryption key for local storage persistence is controlled by the `VITE_ENCRYPTION_KEY` environment variable (see [Environment Variables](#environment-variables)).

---

## Tech Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI library |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool & dev server (SWC compiler) |
| React Router DOM | 6.26 | Client-side routing |

### Styling & UI

| Technology | Purpose |
|------------|---------|
| Tailwind CSS 3.4 | Utility-first styling framework |
| shadcn/ui | 50+ accessible, composable UI components |
| Radix UI | Headless primitives (dialogs, dropdowns, popovers, etc.) |
| Lucide React | Icon library |
| Embla Carousel | Touch-friendly carousel / slider |
| Tailwind CSS Animate | CSS animation utilities |

### State Management & Data Persistence

| Technology | Purpose |
|------------|---------|
| Redux Toolkit | Global application state |
| React Redux | Redux hooks integration |
| Redux Persist | Automatic state persistence to local storage |
| redux-persist-transform-encrypt | AES encryption for persisted state |
| TanStack React Query | Server/async state management |

### AI & Language Models

| Technology | Purpose |
|------------|---------|
| LangChain | LLM orchestration framework |
| @langchain/google-genai | Google Generative AI (Gemini) integration |

### Forms & Validation

| Technology | Purpose |
|------------|---------|
| React Hook Form | Performant form state management |
| Zod | Runtime schema validation |
| @hookform/resolvers | Zod ↔ React Hook Form bridge |

### Real-time Communication

| Technology | Purpose |
|------------|---------|
| Socket.io-client | WebSocket signaling for WebRTC peer discovery |
| WebRTC (native) | Peer-to-peer data transfer for Leveling tool sync |

### QR Code

| Technology | Purpose |
|------------|---------|
| react-qr-code | QR code generation |
| react-qr-scanner | Camera-based QR code scanning |

### Utilities & Rendering

| Technology | Purpose |
|------------|---------|
| react-markdown | Markdown rendering for AI-generated output |
| Recharts | Skill/progress charting |
| date-fns | Date formatting helpers |
| Sonner | Toast notifications |
| Vaul | Drawer component |
| react-resizable-panels | Draggable split-panel layouts |
| clsx / tailwind-merge | Conditional classname utilities |

---

## Project Structure

```
black-mac-portfolio/
├── public/                        # Static assets
├── scripts/
│   └── copy-sitemap.mjs           # Post-build sitemap copy script
├── signaling_server.py            # Python Socket.io signaling server (Leveling tool)
├── src/
│   ├── App.tsx                    # Root component & route definitions
│   ├── main.tsx                   # Application entry point
│   ├── components/
│   │   ├── Navigation.tsx         # Top navigation bar
│   │   ├── Footer.tsx             # Site footer
│   │   ├── CyberAnimation*.tsx    # Animated background variants
│   │   ├── ContainedLoader*.tsx   # Loading animation variants
│   │   ├── Tools/
│   │   │   ├── Constants.ts       # Tool route configuration
│   │   │   ├── ResumeAndCoverLetterTool.tsx  # AI resume generator
│   │   │   └── Leveling/
│   │   │       ├── LevelingTool.tsx    # Main leveling tool shell
│   │   │       ├── GameProfile.tsx     # User profile management
│   │   │       ├── AIChat.tsx          # In-tool AI assistant
│   │   │       ├── SkillTree.tsx       # Skill visualization
│   │   │       ├── ProgressTracking.tsx # Achievement tracking
│   │   │       ├── Settings.tsx        # Tool settings
│   │   │       └── encryption.ts       # QR data encryption/decryption
│   │   └── ui/                    # shadcn/ui component library
│   ├── pages/
│   │   ├── Home.tsx               # Hero / landing page
│   │   ├── Projects.tsx           # Filterable project gallery
│   │   ├── CaseStudies.tsx        # Case study showcase
│   │   ├── Clients.tsx            # Clients & testimonials
│   │   ├── Certificates.tsx       # Certifications gallery
│   │   ├── About.tsx              # About & contact
│   │   ├── Tools.tsx              # Tools hub (nested routes)
│   │   └── NotFound.tsx           # 404 page
│   ├── data/
│   │   ├── portfolio.ts           # Centralised portfolio data (projects, clients, etc.)
│   │   └── store/
│   │       ├── index.ts           # Redux store & persistor
│   │       ├── hooks.ts           # Typed dispatch & selector hooks
│   │       └── reducers/
│   │           ├── resumeSlice.ts     # Resume tool state
│   │           └── levelingSlice.ts   # Leveling tool state
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Mobile breakpoint detection hook
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   └── utils.ts               # Shared utilities (cn helper)
│   └── types/
│       └── react-qr-scanner.d.ts  # Type definitions for QR scanner
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite configuration (aliases: @, @reducers, @store)
├── tailwind.config.ts             # Tailwind CSS theme configuration
├── tsconfig.json                  # TypeScript configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint rules
└── components.json                # shadcn/ui configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9 (or **bun**)

### Installation

```bash
git clone https://github.com/Ankkiyy/black-mac-portfolio.git
cd black-mac-portfolio
npm install
```

### Running the Dev Server

```bash
npm run dev
```

The app will be available at **http://localhost:8080**.

> **Leveling Tool real-time sync** requires the Python signaling server to also be running:
> ```bash
> pip install python-socketio eventlet
> python signaling_server.py
> ```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server on port 8080 |
| `npm run build` | Build the app for production |
| `npm run build:dev` | Build the app in development mode |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the entire codebase |

A `postbuild` hook runs automatically after `build` to copy the sitemap to the output directory.

---

## Environment Variables

Create a `.env` file in the project root and set the following variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_ENCRYPTION_KEY` | No | `AnkkiyyIsBoss_DefaultKey_2024` | AES key used to encrypt Redux state in local storage |
| `VITE_SIGNALING_URL` | No | — | WebSocket URL of the Socket.io signaling server for Leveling tool WebRTC sync |
| `VITE_LEVELING_SIGNALING_URL` | No | — | Alternative env var for the signaling server URL |

> The **Google Gemini API key** for the Resume tool is entered directly in the UI by the user and stored only in local storage. It is never bundled with the application.

---

## Deployment

The project is deployed automatically via **GitHub Actions**:

1. On every push to `main`, the workflow:
   - Installs dependencies and runs `npm run build`
   - Uploads the built assets to the production server over SSH
   - Clears stale assets before copying the new build
2. On successful deployment, a notification is sent to **Discord**

The live site is hosted at [ankkiyy.com](https://ankkiyy.com).

---

## AI Prompts Reference

For the full documentation of all AI prompt templates, API key requirements, WebRTC sync details, local storage encryption, and skill extraction logic, see **[PROMPTS.md](./PROMPTS.md)**.

### Quick Reference — Resume Generator Prompt

```
Create a complete, ATS-friendly resume by optimizing the provided experience and
education data for the target job.

Personal Information: {personalInfo}
Experience Data:      {experienceData}
Education Data:       {educationData}
Job Description:      {jobDescription}
Skills to Highlight:  {skills}

Instructions:
1. Create a compelling professional summary based on the experience and target job.
2. Optimize experience descriptions to include relevant keywords from the job description.
3. Organize skills by relevance to the job requirements.
4. Ensure ATS-friendly formatting.
5. Use STAR method for experience descriptions.
6. Use metrics to quantify achievements (e.g., "Increased sales by 20%").

Format Instructions: {format_instructions}
```

> 🔑 **Requires your own Google Gemini API key** — obtained free from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and entered in the tool UI. Never stored on any server.

### Quick Reference — Leveling Tool Daily Log Prompt

```
Analyze the following daily log and identify which skills were worked on.
Only return skill names that were actually mentioned or implied, separated by commas.
Skills available: {skills}.

Daily log: {sanitizedText}

Skills worked on (comma-separated):
```

> Skills matched by the AI receive **+XP**; unmentioned skills receive a **penalty**. If the AI model is unavailable, a keyword-matching fallback is used automatically.
