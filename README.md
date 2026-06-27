# ⚖️ LexAI — AI-Powered Legal Document Intelligence Platform

> Built for Indian legal workflows. Analyse contracts, verify clauses, flag risks, and manage client matters — all in one platform.

![LexAI](https://img.shields.io/badge/LexAI-v1.1.0--alpha-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite)

---

## 📌 About

LexAI is an AI-powered legal document intelligence platform designed specifically for Indian law firms, corporate legal teams, and legal departments. It automates the most time-consuming parts of legal work — reading contracts, identifying risks, tracking obligations, managing clients, and routing documents through internal approval chains.

> ⚠️ **Current Status:** The frontend UI is fully built and functional with sample data. The fine-tuned AI model (trained on Indian law) is ready and running locally via Ollama. Full model-to-frontend integration is in progress.

---

## 🖥️ Live Demo

> Run locally — see setup instructions below.

---

## 🚀 Features

### 🔵 Core — Contract Intelligence
| Page | Description |
|---|---|
| **Dashboard** | Overview of all contracts, risk stats, health scores, and recent activity |
| **Contract Analysis** | Full document summary — parties, jurisdiction, date, plain-English overview |
| **Upload Documents** | Drag and drop PDF/DOCX contracts for instant AI analysis |
| **Clause Verification** | Checks all standard clauses — Present, Missing, or Modified — with confidence scores |
| **Risk Analysis** | Flags High/Medium/Low risks with descriptions and specific fix recommendations |
| **Missing Clause Checklist** | Lists missing clauses with criticality level and suggested standard language |
| **Memo Generator** | Auto-generates professional legal memos summarising risks and findings |
| **Defined Terms Dictionary** | Extracts and explains every defined term in the contract with page references |
| **Obligation Tracker** | Tracks every obligation per party — what, who, when, and current status |
| **Multi Contract Comparison** | Side-by-side comparison of two contracts across clauses, risks, and terms |

### 🟣 Contracts+ — Advanced Legal Tools
| Page | Description |
|---|---|
| **Negotiation Assistant** | Suggests negotiation positions and counter-language for risky clauses |
| **Templates Library** | Standard Indian legal contract templates ready to download or customise |
| **eSign Integration** | Send contracts for digital signature via Aadhaar-based eSign |
| **Limitation Tracker** | Tracks legal limitation periods so you never miss a filing deadline |

### 🟡 LexCase — Client & Matter Management
| Page | Description |
|---|---|
| **Client Portal** | Manage clients, their matters, documents, messages, and activity in one place |
| **Approval Workflows** | Internal document approval chain with stage tracking, comments, and escalation |

### ⚙️ System
| Page | Description |
|---|---|
| **AI Legal Assistant** | Chat panel on every screen — ask questions about the active contract |
| **Settings** | Configure AI model, Ollama server, theme, and platform preferences |

---

## 🇮🇳 Built for India

Unlike generic legal AI tools, LexAI is designed around Indian legal language:
- IPC sections and bare acts
- RERA, Companies Act, Limitation Act references
- Indian jurisdiction and court terminology
- Fine-tuned on 47,000+ Indian legal Q&A pairs

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Build Tool | Vite |
| State Management | React Context API |
| Icons | Lucide React |
| AI Backend | Ollama (local) — Qwen2.5 fine-tuned on Indian law |
| Deployment | Netlify (frontend) |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- npm or yarn
- Ollama (optional — for live AI responses)

### 1. Clone the repository
```bash
git clone https://github.com/yashraut2805/LEX-AI.git
cd LEX-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. (Optional) Connect Ollama for live AI
Install [Ollama](https://ollama.com) and run:
```bash
ollama run qwen2.5:7b
```
Then in LexAI → Settings, set the Ollama URL to `http://localhost:11434`.

---

## 📁 Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── AIAssistant.tsx
├── context/
│   └── AppContext.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── DocumentAnalysis.tsx
│   ├── ClauseVerification.tsx
│   ├── RiskAnalysis.tsx
│   ├── MemoGenerator.tsx
│   ├── ObligationTracker.tsx
│   ├── DefinedTerms.tsx
│   ├── Comparison.tsx
│   ├── NegotiationAssistant.tsx
│   ├── TemplatesLibrary.tsx
│   ├── ESignIntegration.tsx
│   ├── LimitationTracker.tsx
│   ├── ClientPortal.tsx
│   ├── ApprovalWorkflows.tsx
│   ├── Upload.tsx
│   └── Settings.tsx
└── App.tsx
```

---

## 👥 Team

| Name | Role |
|---|---|
| Shaunak Paul | AI Engineering & Frontend |
| Yash Raut | Frontend Development |
| Parth Vibhute | Frontend Development |
| Mrudul Patil | UI/UX & Frontend |

---

## 📍 Roadmap

- [x] Core contract analysis features (10 pages)
- [x] Contracts+ advanced tools (4 pages)
- [x] LexCase client & approval management (2 pages)
- [ ] Fine-tuned model integration (Qwen3-14B via Ollama)
- [ ] LexResearch — RAG search across Indian statutes and SC judgments
- [ ] Court date tracker
- [ ] Mobile responsive layout
- [ ] Multi-user authentication

---

## 📄 License

This project is for academic and demonstration purposes as part of the B.E. AI & ML program at St. John College of Engineering and Management, Mumbai (Batch 2023–2027).

---

> *"LexAI doesn't replace lawyers. It makes lawyers faster."*
