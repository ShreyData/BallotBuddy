# BallotBuddy AI

**Navigate Elections with Total Confidence.**  
A deeply integrated Google Cloud Ecosystem application for voter education, simulation, and real-time guidance.

---

## 📖 Project Context
Election processes can be complex and intimidating. **BallotBuddy AI** is designed to demystify the voting experience through interactive education. It provides users with a safe environment to practice voting, locate their polling stations, and receive expert AI-driven guidance on election rules and timelines.

### 🌟 Core Features

- **Interactive EVM Simulator:** A high-fidelity, ARIA-compliant simulator of the Electronic Voting Machine (EVM) and VVPAT (Voter Verifiable Paper Audit Trail) process, allowing first-time voters to practice in a risk-free environment.
- **AI Election Assistant:** Powered by **Gemini 2.0 Flash**, the assistant provides grounded answers to election-related queries in multiple languages (English, Hindi, and regional) using **Vertex AI Search Grounding**.
- **Booth Locator:** A seamless integration with **Google Maps Platform** to help users find their designated polling stations with real-time navigation.
- **Election Timeline:** An interactive roadmap of the election cycle, integrated with **Google Calendar** for automated reminders.
- **Misinformation Checker:** An AI-powered tool to verify claims and rumors, helping users distinguish between facts and election-related myths.

---

## 🛠️ Engineering Excellence & Evaluation Factors

This project has been architected to meet the highest engineering standards, focusing on 7 key pillars of quality:

### 1. Code Quality & Software Design
- **Domain-Driven Design (DDD):** The backend is organized into clear layers (API, Service, Domain, Infrastructure), ensuring that business logic for election rules remains isolated from technical details like database drivers.
- **Type Safety:** Built with **TypeScript** on the frontend and **Pydantic v2** on the backend to ensure data integrity across the entire stack.
- **Clean Code Standards:** Enforced via **Ruff** (Python) and **ESLint/Prettier** (React), ensuring a consistent, readable, and maintainable codebase.

### 2. Security & Identity
- **Secure Token Management:** Implemented **HttpOnly, Secure, SameSite=Strict cookies** for JWT storage, providing robust protection against XSS and CSRF attacks.
- **Zero-Trust Auth:** Every sensitive API request is verified server-side using the **Firebase Admin SDK**.
- **Defense in Depth:** Configured strict **Content Security Policy (CSP)** headers and **Rate Limiting** via `slowapi` to prevent abuse.

### 3. Technical Efficiency
- **Intelligent Caching:** Uses **Redis for Semantic Caching**, allowing the system to serve frequent election queries instantly without repeated LLM calls.
- **Client-Side Optimization:** Integrated **TanStack Query** for background data revalidation and seamless UI state management.
- **Async Infrastructure:** Migrated to **Cloud Translation v3 (Asynchronous)** to ensure the FastAPI event loop remains non-blocking even under heavy load.

### 4. Comprehensive Testing
- **End-to-End (E2E) Validation:** Full user journeys (Voting simulation, AI Chat) are verified using **Cypress**, ensuring the "Happy Path" is always functional.
- **Logic Verification:** Critical election rules and timeline calculations are covered by a suite of **Pytest** unit tests.

### 5. Accessibility (A11y) & Inclusivity
- **Inclusive Simulator:** The EVM simulator is fully **ARIA-compliant**, using live regions to announce voting status and VVPAT verification to screen reader users.
- **Multilingual Core:** Native support for English, Hindi, and regional languages, powered by high-accuracy AI translation.
- **Keyboard First:** All interactive elements, including the 3D timeline, are navigable via keyboard shortcuts.

### 6. Deep Google Services Integration
- **Vertex AI (Gemini 2.0 Flash):** Provides the core intelligence for grounded, safe, and accurate election guidance.
- **Firestore Vector Search:** Powering the **RAG (Retrieval-Augmented Generation)** pipeline to ensure AI answers are based on official election documents.
- **Google Maps Platform:** Integrated for real-time polling station visualization and navigation.
- **Google Calendar:** Seamlessly syncs election phases to the user's personal schedule.

### 7. Problem Statement Alignment
- **Democratizing Education:** Directly addresses the "Election Process Education" challenge by transforming dry regulatory rules into an interactive, 3D experience that anyone can follow.

---

## 🏗️ System Architecture

### Frontend (Next.js 14 + React)
- **Framework:** Next.js (App Router) with TypeScript for a robust, type-safe development environment.
- **Styling:** Tailwind CSS for modern design, Framer Motion for smooth animations, and Three.js for immersive 3D interactions.
- **Data Management:** `@tanstack/react-query` for optimized API fetching, intelligent caching, and background synchronization.
- **Identity:** **Firebase Auth** for secure, multi-provider authentication.

### Backend (FastAPI + Python 3.13)
- **Design Pattern:** **Domain-Driven Design (DDD)** ensuring a clean separation of business logic (Services/Domain) from technical implementation (Infrastructure/API).
- **AI Intelligence:** Native integration with the **Google GenAI SDK**, leveraging **Vertex AI** for both text generation and multi-modal document analysis (Gemini Vision).
- **Persistence & Search:** **Google Cloud Firestore** utilized as both a native NoSQL database and a **Vector Store** for Retrieval-Augmented Generation (RAG).
- **Performance:** **Redis** used for high-speed semantic caching of AI responses to reduce latency and costs.

### Infrastructure & Deployment
- **Deployment:** Fully containerized services orchestrated via **Google Cloud Run** for serverless scalability.
- **CI/CD Orchestration:** Automated deployment via `infra/deploy.sh`, which handles API enablement, IAM security, and dynamic environment injection.

---

## 🚀 Getting Started

### 1. Local Development (Docker)
To run the entire stack (Frontend, Backend, and Redis) locally:
```bash
docker-compose -f infra/docker-compose.yml up --build
```
- **Frontend UI:** [http://localhost:3000](http://localhost:3000)
- **API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Production Deployment
To deploy the project to your own Google Cloud environment:
```bash
bash infra/deploy.sh
```

---

## 📂 Project Structure
```text
├── backend/            # FastAPI Backend (DDD Architecture)
│   ├── app/            # Main application source
│   │   ├── api/        # Routes and dependencies
│   │   ├── core/       # Configuration and security
│   │   ├── domain/     # Business rules and guides
│   │   ├── infrastructure/ # Cloud clients (Gemini, Firestore, Redis)
│   │   └── services/   # Business logic orchestration
│   └── tests/          # Pytest unit and integration tests
├── frontend/           # Next.js 14 Frontend
│   ├── app/            # Application pages and layouts
│   ├── components/     # Reusable UI components (EVM, Maps, Timeline)
│   ├── context/        # Auth and Language providers
│   ├── services/       # API interaction layer
│   └── __tests__/      # Cypress and Jest test suites
├── infra/              # Deployment and Orchestration
│   ├── deploy.sh       # Cloud Run deployment script
│   └── docker-compose  # Local orchestration
└── .env.example        # Environment variable template
```

**BallotBuddy AI is built with the highest standards of Clean Architecture, Accessibility, and Security.**
