# AI Assignment Creator

An intelligent assignment creation platform for teachers. Upload reference material, configure question types, and let AI generate structured, exam-ready question papers in seconds.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Approach](#approach)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)

---

## Features

- AI-powered question paper generation using Google Gemini
- File upload support (PDF/Image) — AI extracts content and generates contextual questions
- Real-time generation status via WebSocket
- Background job processing with BullMQ + Redis
- Structured output with sections, difficulty tags, marks, and answer key
- Download generated paper as PDF
- Regenerate paper with one click
- Redis caching for fast repeated access
- Rate limiting to prevent API abuse
- Mobile responsive UI

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 + TypeScript | UI framework with file-based routing |
| Tailwind CSS | Styling |
| Zustand | State management |
| Axios | API calls |
| WebSocket (native) | Real-time generation updates |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express + TypeScript | REST API server |
| MongoDB + Mongoose | Persistent storage for assignments and papers |
| Redis (ioredis) | Caching and BullMQ job storage |
| BullMQ | Background job queue for AI generation |
| WebSocket (ws) | Real-time frontend notifications |
| Google Gemini API | AI question paper generation |
| Multer | File upload handling |
| pdf-parse | PDF text extraction |
| express-rate-limit | API rate limiting |

---

## Architecture Overview

Here is how the entire system works from the moment a teacher submits the form to seeing the generated paper:

```
TEACHER
  │
  │  Fills form (title, file, question types)
  ▼
NEXT.JS FRONTEND
  │
  │  POST /api/assignments (multipart/form-data)
  ▼
EXPRESS API
  │
  ├──► Saves assignment to MONGODB
  │
  ├──► Adds job to BULLMQ QUEUE (stored in Redis)
  │
  └──► Returns instantly { _id, status: "pending" }
          │
          │  Frontend connects WebSocket with assignmentId
          │  and waits for updates...
          │
          ▼
    BULLMQ WORKER (running in background)
          │
          ├──► Picks job from Redis queue
          │
          ├──► Extracts text from uploaded file (if any)
          │
          ├──► Builds structured prompt → calls GEMINI AI
          │
          ├──► Parses AI JSON response → validates structure
          │
          ├──► Saves generated paper to MONGODB
          │
          ├──► Caches paper in REDIS (1 hour)
          │
          └──► Sends WebSocket message: { status: "completed" }
                    │
                    ▼
            NEXT.JS FRONTEND
                    │
                    ├──► Receives WebSocket notification
                    │
                    ├──► Fetches paper from GET /api/assignments/:id/paper
                    │         │
                    │         ├── Redis hit? → returns instantly
                    │         └── Redis miss? → fetches MongoDB → caches → returns
                    │
                    └──► Displays structured exam paper
```

### Caching Strategy

| Redis Key | TTL | Invalidated On |
|---|---|---|
| `assignments:list` | 1 hour | Create, Delete, Regenerate |
| `assignment:meta:id` | 24 hours | Delete, Regenerate |
| `paper:id` | 1 hour | Delete, Regenerate |

---

## Approach

### AI Generation (No Raw LLM Rendering)

The assignment explicitly required not rendering raw LLM responses. Our approach:

1. Build a structured prompt from form data specifying exact JSON format
2. Gemini returns JSON with sections, questions, difficulty, marks, and answers
3. `parseAIResponse()` validates and sanitizes the JSON before any use
4. React components render the structured data — never the raw AI text

```
Form Data → buildPrompt() → Gemini API → parseAIResponse() → MongoDB → React UI
```

### Background Processing

AI generation takes 10–30 seconds. Using BullMQ prevents HTTP timeouts, the API responds instantly with a job confirmation, the worker processes AI in the background, and WebSocket notifies the frontend on completion. Failed jobs automatically retry up to 3 times with exponential backoff.

### File Upload Flow

Teachers can upload PDF or image files containing reference material:

- PDF files: text extracted using `pdf-parse`
- Image files: text extracted using Gemini Vision API
- Extracted text is added to the AI prompt as context
- Questions are generated based on the actual content

---

## Setup Instructions

### Prerequisites

- Node.js v20 or v22
- MongoDB Atlas account (free tier)
- Redis Cloud account (free tier)
- Google AI Studio API key (free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vedaai.git
cd vedaai
```

### 2. Backend Setup

```bash
cd backend
npm install
mkdir uploads
```

Create `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
REDIS_URL=redis://default:your_password@your_host:your_port
GEMINI_API_KEY=your_google_ai_studio_key
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Verify Everything is Running

Open `http://localhost:3000` — you should see the VedaAI dashboard.

Check backend health: `GET http://localhost:5000/` : should return `VedaAI Backend Running!`

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `REDIS_URL` | Redis Cloud connection URL |
| `GEMINI_API_KEY` | Google AI Studio API key |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assignments` | Get all assignments |
| POST | `/api/assignments` | Create new assignment (multipart/form-data) |
| GET | `/api/assignments/:id` | Get single assignment |
| DELETE | `/api/assignments/:id` | Delete assignment |
| GET | `/api/assignments/:id/paper` | Get generated paper |
| POST | `/api/assignments/:id/regenerate` | Regenerate paper |

### Create Assignment Request

```
Content-Type: multipart/form-data

title                   string (required)
dueDate                 string YYYY-MM-DD (required)
questionTypes           JSON string (required)
                        [{"type":"MCQ","numberOfQuestions":5,"marks":2}]
additionalInstructions  string (optional)
file                    PDF or image file (optional)
```

### WebSocket

After creating an assignment, the frontend connects to `ws://localhost:5000` and sends the `assignmentId` to subscribe for updates. The server sends back status messages as the job progresses through the queue — first `{ status: "processing" }` when the worker picks it up, then either `{ status: "completed", paperId: "xxx" }` when the paper is ready or `{ status: "failed", message: "..." }` if something goes wrong. The frontend listens for these messages and updates the UI in real time without the user needing to refresh.

---

## License

MIT
