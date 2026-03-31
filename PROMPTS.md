# PROMPTS.md — AI Prompt Instructions & Tool Usage Guide

This file documents all AI prompt templates, usage instructions, and API key requirements for the interactive tools shipped with this portfolio. It is intended to serve as a single reference for understanding how each AI-powered feature works, what prompts are used under the hood, and how users must configure their own credentials.

---

## Table of Contents

- [Tool 1 — AI Based Resume & CV Text Generator](#tool-1--ai-based-resume--cv-text-generator)
  - [Live Link](#live-link-resume-tool)
  - [How It Works](#how-it-works-resume-tool)
  - [API Key Requirement](#api-key-requirement)
  - [Full Prompt Instruction](#full-prompt-instruction--resume-generator)
  - [Output Format Instruction](#output-format-instruction)
- [Tool 2 — Leveling Tool (Personal Skill Tracker)](#tool-2--leveling-tool-personal-skill-tracker)
  - [Live Link](#live-link-leveling-tool)
  - [How It Works](#how-it-works-leveling-tool)
  - [WebRTC Sync](#webrtc-sync)
  - [Local Storage & Encryption](#local-storage--encryption)
  - [Daily Log AI Prompt](#daily-log-ai-prompt)
  - [Skill Extraction & Mapping Logic](#skill-extraction--mapping-logic)

---

## Tool 1 — AI Based Resume & CV Text Generator

### Live Link (Resume Tool)

🔗 **[https://ankkiyy.com/tools/ai-resume-and-cover-letter-generator](https://ankkiyy.com/tools/ai-resume-and-cover-letter-generator)**

---

### How It Works (Resume Tool)

1. The user fills in their **personal information** (name, email, phone, location, LinkedIn, GitHub, portfolio URL).
2. The user adds **work experience** entries and **education** entries through the form.
3. The user pastes a **job description** and lists their **key skills**.
4. On clicking **Generate**, the tool calls the **Google Gemini API** (`gemini-2.5-flash-lite` model) via LangChain's `ChatGoogleGenerativeAI` integration.
5. The AI analyzes all the provided data and produces an **ATS-optimized resume** in structured JSON, which is then rendered as Markdown in the UI.
6. The user can **copy** the output, switch between rendered Markdown and raw text views, or open a **print-friendly page** combining both the resume and cover letter.

All form state (personal info, work experience, education, and the API key) is **persisted to encrypted local storage** via Redux Persist + AES encryption so nothing is lost on page refresh.

---

### API Key Requirement

> ⚠️ **Users must supply their own Google Gemini API key.**

To prevent API key abuse, the tool does **not** ship with a server-side key or proxy. Each user must:

1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and generate a free Gemini API key.
2. Paste the key into the **API Key** field shown on the tool's setup screen before generating.
3. The key is stored **exclusively in the user's own browser** (AES-encrypted local storage) and is sent **only** to Google's Generative AI API — it is never transmitted to or stored on any server operated by this project.
4. The key can be cleared at any time using the **Reset** button in the tool.

---

### Full Prompt Instruction — Resume Generator

The following is the exact LangChain `PromptTemplate` used to generate the resume. Variable placeholders (surrounded by `{}`) are substituted at runtime with the user's data.

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
5. Use STAR (Situation, Task, Action, Result) method for experience descriptions and
   rewrite them to more suit the job description.
   Example: "X was slow and Y needed optimization, so I implemented Z, resulting in
   improved XYZ."
6. Use metrics to quantify achievements and enhance impact in descriptions with keywords
   of metrics (e.g., "Increased sales by 20%").

Format Instructions: {format_instructions}
```

**Variable breakdown:**

| Variable | Source |
|----------|--------|
| `{personalInfo}` | JSON-serialized personal info saved by the user (name, email, phone, location, LinkedIn, etc.) |
| `{experienceData}` | JSON-serialized array of work experience entries (title, company, dates, description bullets) |
| `{educationData}` | JSON-serialized array of education entries (degree, institution, dates, GPA, description) |
| `{jobDescription}` | Raw text of the target job description pasted by the user |
| `{skills}` | Comma-separated list of skills typed by the user |
| `{format_instructions}` | Auto-injected instruction to return a complete resume JSON object with sections: `personalInfo`, `professionalSummary`, `experience`, `education`, and `skills` |

---

### Output Format Instruction

The format instruction injected automatically into every prompt is:

```
Respond with a complete resume JSON object with sections: personalInfo,
professionalSummary, experience, education, and skills. Tailor the professional
summary and optimize experience descriptions based on the job description and
required skills.
```

The tool uses LangChain's `JsonOutputParser` to parse and validate the structured output before rendering it in the UI.

---

## Tool 2 — Leveling Tool (Personal Skill Tracker)

### Live Link (Leveling Tool)

🔗 **[https://ankkiyy.com/tools/leveling](https://ankkiyy.com/tools/leveling)**

---

### How It Works (Leveling Tool)

The Leveling Tool is a **gamified personal-development notebook**. It turns your daily work activities into measurable skill progress — similar to an RPG character sheet.

Key features:

| Feature | Description |
|---------|-------------|
| **Game Profile** | Create and manage your character profile with a username and total XP display |
| **Skill Tree** | Add custom skills organized into categories; each skill has an XP count and level calculated from a linear progression formula |
| **Daily Log (AI Chat)** | Write a free-text description of your day; AI analyses it and automatically updates which skills you worked on |
| **Progress Tracking** | View achievement history, milestone completion, and skill-level charts (powered by Recharts) |
| **Settings** | Configure peer-connection, auto-sync, AI model endpoint, and XP gain/penalty values |
| **Encrypted QR Sync** | Export your entire tool state as an AES-GCM encrypted QR code; scan it on another device to import instantly — no account needed |
| **WebRTC P2P Sync** | Real-time peer-to-peer data transfer between devices |

---

### WebRTC Sync

The Leveling Tool uses **native WebRTC** for real-time, peer-to-peer profile synchronisation between devices:

- A lightweight **Socket.io signaling server** (`signaling_server.py`) is used only for initial peer discovery (exchanging SDP offers/answers and ICE candidates). No user data passes through the signaling server.
- Once the WebRTC data channel is established, all profile data is transferred **directly between browsers** — no intermediate server is involved.
- Peer connection can be toggled on/off in the **Settings** tab (`peerConnectionEnabled`).
- Auto-sync can be enabled so that any state change is immediately broadcast to all connected peers (`autoSyncEnabled`).

To run the signaling server locally:

```bash
pip install python-socketio eventlet
python signaling_server.py
```

Set the `VITE_SIGNALING_URL` or `VITE_LEVELING_SIGNALING_URL` environment variable to point to your deployed signaling server instance.

---

### Local Storage & Encryption

All Leveling Tool state (profile, skills, daily logs, settings) is managed by **Redux Toolkit** and automatically persisted to **encrypted local storage** via Redux Persist + `redux-persist-transform-encrypt` (AES cipher).

The **QR code export / import** uses a stronger, purpose-built encryption layer:

| Parameter | Value |
|-----------|-------|
| Algorithm | AES-GCM (256-bit) |
| Key derivation | PBKDF2 with SHA-256, 100 000 iterations |
| Salt length | 16 bytes (random per export) |
| IV length | 12 bytes (random per export) |
| API | Web Crypto (`SubtleCrypto`) — runs entirely in the browser |

The encryption key / password is provided by the user at export time and is required to decrypt the QR payload on import. Nothing is stored on any server.

---

### Daily Log AI Prompt

Each time a user submits a Daily Log, the tool sends the following prompt to an **Ollama-compatible local AI model** (configurable in Settings):

```
Analyze the following daily log and identify which skills were worked on.
Only return skill names that were actually mentioned or implied, separated by commas.
Skills available: {skills}.

Daily log: {sanitizedText}

Skills worked on (comma-separated):
```

**Variable breakdown:**

| Variable | Source |
|----------|--------|
| `{skills}` | Comma-separated list of all skill names currently in the user's skill tree |
| `{sanitizedText}` | User's daily log text, sanitised (HTML tags and code-block markers stripped, truncated to 2 000 characters) |

The prompt is sent as a `POST` request to `{aiModelUrl}/api/generate` with the configured `aiModelName`. The default endpoint is `http://localhost:11434` (Ollama default) and the default model is `llama2`.

Configure the AI endpoint and model name in the **Settings** tab of the tool, or set them via the `VITE_LEVELING_SIGNALING_URL` / `VITE_SIGNALING_URL` environment variables for the signaling layer.

---

### Skill Extraction & Mapping Logic

After the AI returns a comma-separated list of skill names it identified in the log, the tool applies the following matching and XP update logic:

```
1. Parse response  →  split by comma, trim whitespace, lowercase each token.
2. For each skill in the user's skill tree:
     - If any AI token is a substring of the skill name  OR
       the skill name is a substring of any AI token
       → mark skill as "worked on"
3. For each skill marked as "worked on":
     → dispatch addXpToSkill(skillId, dailyXpGain)
        (default dailyXpGain = 10 XP per day)
4. For each skill NOT marked as "worked on":
     → dispatch degradeSkill(skillId)
        (subtracts missedDayPenalty XP, default = 20 XP, minimum 0)
5. If NO skills are matched at all:
     → degrade ALL skills
6. If the user missed one or more whole calendar days since the last log:
     → degrade ALL skills once per missed day BEFORE applying today's update
7. Save the daily log entry to the Redux store with:
     - date (ISO timestamp)
     - content (original text)
     - processedSkills (array of matched skill IDs)
```

**Level progression formula** (applied after every XP change):

```
Level 1 starts at 0 XP.
Each level N requires:  XP_required(N) = 20 + (N - 1) × 10

Cumulative XP thresholds:
  Level 1 →    0 XP
  Level 2 →   20 XP  (requires 20)
  Level 3 →   50 XP  (requires 30 more)
  Level 4 →   90 XP  (requires 40 more)
  Level 5 →  140 XP  (requires 50 more)
  ...and so on
```

> **Fallback behaviour:** If the AI model is unreachable or returns an error, the tool falls back to **simple keyword matching** — it checks whether any skill name appears as a literal substring of the raw log text (case-insensitive). XP and penalty logic remain identical.
