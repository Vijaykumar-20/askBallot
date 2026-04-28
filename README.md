# 🗳️ Ask-Ballot: AI-Powered Election Assistant

**Ask-Ballot** is an interactive, gamified civic education platform and AI-powered election assistant designed to demystify the Indian General Election process. Built for voters of all ages, it empowers citizens with essential knowledge—from voter registration (Form 6) to understanding Electronic Voting Machines (EVMs) and VVPATs. 

By combining engaging quizzes, visual timelines, and a specialized AI chat assistant, Ask-Ballot makes civic education accessible, neutral, and interactive.

---

## 🚀 About The Project

Democratic participation thrives on informed voters. However, understanding electoral procedures can often feel overwhelming for first-time voters. Ask-Ballot solves this by offering:
- **Expert AI Assistant**: A conversational AI powered by Google Gemini, rigorously instructed to answer questions purely about the civic and electoral process in a strictly non-partisan manner.
- **Gamified "Voter's Quest"**: An interactive quiz system that tests user knowledge on voting basics, rewarding them with confetti and scores to solidify learning.
- **Visual Timelines & Explainers**: Step-by-step interactive accordions and timelines to clarify the election journey, from campaign phases to counting day.
- **Robust Security**: API rate-limiting, strict input validation, and secure headers to ensure a safe environment.

---

## 💻 Tech Stack

- **Framework**: [Next.js 14 / App Router](https://nextjs.org/)
- **Frontend Core**: React 19, CSS Modules
- **AI Engine**: Google Generative AI (`gemini-2.0-flash`) via `@google/generative-ai`
- **Animations & UI**: Framer Motion, `canvas-confetti`, `lucide-react`
- **Data Visualization**: Recharts
- **Testing Infrastructure**: Vitest, React Testing Library, JSDOM
- **Security**: Granular HTTP Security Headers, In-memory Rate Limiting

---

## 🔌 API Documentation

Ask-Ballot exposes a secured serverless API endpoint for engaging with the Gemini AI model.

### `POST /api/chat`

Handles conversational AI queries regarding the election process. Built-in rate limiting restricts requests to 20 per minute per IP.

**Headers Required:**
- `Content-Type: application/json`

**Request Body Schema:**
```json
{
  "message": "What is an EVM?",
  "history": [
    {
      "role": "user",
      "parts": [ { "text": "Hello, I have a question about voting." } ]
    },
    {
      "role": "model",
      "parts": [ { "text": "Of course! What would you like to know?" } ]
    }
  ]
}
```
*Note: `message` cannot exceed 500 characters. `history` is optional.*

**Success Response (200 OK):**
```json
{
  "role": "model",
  "parts": [
    {
      "text": "An EVM (Electronic Voting Machine) is a secure device used to cast and record your vote..."
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Missing message or message exceeds 500 characters.
- `413 Payload Too Large`: Request body exceeds 32KB.
- `429 Too Many Requests`: Triggered if the rate limit (20 req / minute) is exceeded.
- `500 Server Error`: Generic fallback error message to prevent leaking internal stack traces.

---

## 🛠️ Getting Started (Local Development)

1. **Clone the repository**
   ```bash
   git clone <YOUR_REPO_URL>
   cd ask-ballot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

5. **Run the Test Suite**
   ```bash
   npm run test
   ```

---

*Made with ❤️ for democratic participation.*
