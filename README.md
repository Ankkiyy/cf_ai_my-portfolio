# Black Mac Portfolio

A modern, feature-rich cybersecurity professional portfolio built with React, TypeScript, and Tailwind CSS. The site showcases projects, case studies, client work, and certifications, and also ships two interactive tools: an AI-powered resume & cover letter generator and a collaborative leveling/notebook tool.

🌐 **Live Site:** [ankkiyy.com](https://ankkiyy.com)

---

## Table of Contents

- [Features](#features)
  - [Portfolio Sections](#portfolio-sections)
  - [Interactive Tools](#interactive-tools)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Dev Server](#running-the-dev-server)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

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

#### 1. AI Resume & Cover Letter Generator (`/tools/resume`)

An LLM-powered document builder that creates tailored resumes and cover letters.

- Enter personal details, work experience, and education once; the form state is **persisted to encrypted local storage** via Redux Persist + AES encryption so nothing is lost on page refresh
- Select a job description and let **Google Generative AI** (via LangChain) draft a custom resume and cover letter in seconds
- Preview and copy the generated Markdown output, rendered with `react-markdown`
- Bring your own **Google Gemini API key** — stored locally, never sent to any server other than Google's API
- Built with **React Hook Form** and **Zod** schema validation

#### 2. Leveling Tool (`/tools/leveling`)

A gamified personal-development notebook with real-time sync capabilities.

- **Game Profile** — create and manage your personal character profile
- **Skill Tree** — track progress across custom skill branches with visual progress indicators (powered by Recharts)
- **Progress Tracking** — view achievement history and milestone completion
- **AI Chat** — built-in AI assistant for guidance and motivation
- **Settings** — customise preferences stored persistently
- **Encrypted QR Sync** — export your entire notebook state as an encrypted QR code; scan it from another device to import instantly (no account or server storage needed)
- **WebRTC P2P Sync** — real-time, peer-to-peer data transfer between devices using Socket.io signaling + native WebRTC
- All state is managed with **Redux Toolkit** and persisted with AES-encrypted local storage

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
