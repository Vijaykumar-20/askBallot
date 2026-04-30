# 🗳️ Ask-Ballot: AI-Powered Election Assistant

**Ask-Ballot** is an interactive, gamified civic education platform and AI-powered election assistant designed to demystify the Indian General Election process. Built for voters of all ages, it empowers citizens with essential knowledge—from voter registration (Form 6) to understanding Electronic Voting Machines (EVMs) and VVPATs. 

By combining engaging quizzes, visual timelines, and a specialized AI chat assistant, Ask-Ballot makes civic education accessible, neutral, and interactive.

---

## 🚀 Key Features

Democratic participation thrives on informed voters. Ask-Ballot offers:
- **Expert AI Assistant**: A conversational AI powered by **Google Gemini 2.0 Flash**, with a robust "Education Mode" fallback for zero-quota scenarios.
- **Multilingual Support**: Integrated Google Translate support for **13 Indian languages**, ensuring no voter is left behind.
- **Gamified "Voter's Quest"**: An interactive quiz system that tests knowledge on voting basics, rewarded with animations and scoring.
- **Visual Timelines & Explainers**: Step-by-step interactive accordions and timelines clarifying the election journey (Form 6, VVPAT, EVM).
- **Comprehensive Testing**: **100% Core Logic Coverage** (91.25% total coverage) across 68 specialized unit tests.
- **Advanced Security**: Strict Content-Security-Policy (CSP), API rate-limiting, and sanitized inputs.
- **Inclusive Design**: Fully accessible interface with `aria-label` support and high-contrast glassmorphism UI.

---

## 💻 Tech Stack

- **Framework**: [Next.js 14 / App Router](https://nextjs.org/)
- **AI Engine**: Google Generative AI (`gemini-2.0-flash`)
- **Language Services**: Google Translate (13 Regional Languages)
- **Analytics**: Google Analytics 4
- **Animations**: Framer Motion, `canvas-confetti`
- **Testing**: Vitest, React Testing Library, JSDOM
- **Security**: Granular HTTP Security Headers, In-memory Rate Limiting

---

## 🔌 API Documentation

Ask-Ballot exposes a secured serverless API endpoint.

### `POST /api/chat`
Handles conversational AI queries. Rate limited to 20 req/min per IP.

**Success Response (200 OK):**
```json
{
  "role": "model",
  "parts": [{ "text": "An EVM is a secure device..." }]
}
```

---

## 🛠️ Getting Started (Local Development)

1. **Clone & Install**
   ```bash
   git clone <YOUR_REPO_URL>
   npm install
   ```

2. **Environment**
   Create `.env.local`:
   ```env
   GEMINI_API_KEY=your_key
   ```

3. **Development & Test**
   ```bash
   npm run dev   # Start server
   npm run test  # Run 68 unit tests
   ```

---

*Made with ❤️ for democratic participation.*
