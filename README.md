# BallotBuddy AI
### Empowering the Electorate Through Grounded Intelligence

**BallotBuddy AI** is a production-ready, full-stack application designed to demystify the voting process and combat election misinformation. By combining high-fidelity simulations with grounded AI guidance, it transforms complex regulatory procedures into an accessible, user-centric experience.

---

## 🎯 Problem Statement Alignment

**The Problem:** Election processes are often perceived as intimidating or opaque. First-time voters face "ballot anxiety," while the general public is increasingly targeted by election-related misinformation and rumors.

**The Solution:** BallotBuddy AI solves this through a three-pillared approach:
1.  **Mechanics Mastery:** A high-fidelity EVM/VVPAT simulator allows users to practice voting in a risk-free environment, reducing errors on election day.
2.  **Information Grounding:** An AI assistant powered by official election data (RAG) provides accurate, verified answers to procedural questions.
3.  **Logistical Clarity:** Integrated maps, personalized flows, and interactive timelines remove friction from "Election Day" logistics.

---

## 🌟 Key Features

*   **Interactive EVM Simulator:** A 1:1 digital twin of the Electronic Voting Machine, including the VVPAT (Voter Verifiable Paper Audit Trail) verification slip, fully compliant with ECI standards.
*   **Grounded AI Election Assistant:** Multilingual support (English/Hindi) for querying election rules, backed by official grounded data via **Vertex AI Search**.
*   **AI Misinformation Checker:** Real-time verification of election "claims" using Gemini 2.0 Flash reasoning capabilities to debunk myths.
*   **Vision-Powered Document Analysis:** Upload a voter slip or ID for instant AI analysis of registration details using **Gemini Vision**.
*   **Interactive Scenario Simulator:** A gamified "Critical Thinking Challenge" to test user knowledge of election day procedures and rights.
*   **Booth Locator:** Real-time polling station visualization and navigation using the **Google Maps Platform**.

---

## 🏗️ System Architecture

The system is architected using **Domain-Driven Design (DDD)** and **Clean Architecture** principles to ensure long-term maintainability and scalability.

*   **Frontend:** Next.js 14 (App Router) + TypeScript. Uses **TanStack Query** for state synchronization, **Framer Motion** for accessible animations, and **Three.js** for immersive 3D elements.
*   **Backend:** FastAPI (Python 3.10+). Implements a layered architecture: `API (Routes) -> Service (Orchestration) -> Domain (Logic) -> Infrastructure (Clients)`.
*   **AI Layer:** Vertex AI (Gemini 2.0 Flash) for inference, with **Firestore Vector Search** for Retrieval-Augmented Generation (RAG).
*   **Identity:** Firebase Auth for secure, multi-provider identity management.
*   **Caching:** Redis-powered semantic caching to minimize LLM latency and cost.

---

## 💎 Engineering Excellence

### 1. Code Quality & Software Design
*   **Modular Architecture:** Business logic for election rules (Domain) is strictly separated from technical details like API frameworks or database drivers.
*   **Strict Typing:** 100% TypeScript coverage on the frontend and **Pydantic v2** validation on the backend ensures data integrity at the boundaries.
*   **Clean Code Standards:** Enforced via **Ruff** (Python) and **ESLint/Prettier** (React), ensuring a consistent, readable, and maintainable codebase.

### 2. Security & Identity
*   **Secure Token Management:** Implements Firebase Auth with **HttpOnly, Secure, SameSite=Strict** cookies for JWT storage, providing robust protection against XSS and CSRF.
*   **Defense in Depth:** Every API endpoint is protected by **Slowapi Rate Limiting** and strict **Content Security Policy (CSP)** headers to prevent abuse.
*   **Zero-Trust Validation:** Server-side verification of all user identity tokens using the Firebase Admin SDK.

### 3. Technical Efficiency
*   **Intelligent Caching:** Uses **Redis for Semantic Caching**, allowing the system to serve frequent election queries instantly without repeated LLM calls.
*   **Async Infrastructure:** Leverages FastAPI's non-blocking event loop for all AI generation, translation, and database operations.
*   **Resource Optimization:** Lazy-loading of heavy 3D components and optimized asset delivery for a high-performance user experience.

### 4. Comprehensive Testing
*   **Logic Verification:** Critical election rules and timeline logic are covered by a suite of **Pytest** unit tests with 100% coverage on the domain layer.
*   **Component & E2E Validation:** UI components are tested with **Jest**, and critical practice flows (like the EVM simulator) are verified via **Cypress**.
*   **Mocking Strategy:** Robust use of mocks for external Google Cloud services to ensure fast, deterministic test execution.

### 5. Accessibility (A11y) & Inclusivity
*   **Inclusive Simulator:** The EVM simulator is fully **ARIA-compliant**, using `aria-live` regions and descriptive labels to ensure screen reader users can practice voting.
*   **Keyboard Navigation:** All interactive elements, including the Scenario Simulator and AI Chat, are fully navigable via keyboard shortcuts.
*   **Multilingual Core:** Native support for English and Hindi, with high-accuracy AI translation for regional inclusivity.

---

## ☁️ Google Services Integration

| Service | Strategic Purpose |
| :--- | :--- |
| **Vertex AI (Gemini 2.0 Flash)** | Provides the core intelligence for grounded, safe, and accurate election guidance. |
| **Firestore (Vector Search)** | Powering the **RAG** pipeline to ensure AI answers are based on official election documents. |
| **Google Maps Platform** | Integrated for real-time polling station visualization and user navigation. |
| **Cloud Translation** | Enables seamless multilingual support across the application. |
| **Firebase Auth** | Provides industry-leading security for user identity and authentication. |

---

## 🚀 Setup & Installation

### Prerequisites
*   Node.js 18+
*   Python 3.10+
*   Docker & Docker Compose
*   Google Cloud Project with Vertex AI and Maps enabled.

### Local Development (Docker)
The easiest way to run the entire stack (Frontend, Backend, and Redis) is via Docker Compose:
```bash
docker-compose -f infra/docker-compose.yml up --build
```
*   **Frontend:** [http://localhost:3000](http://localhost:3000)
*   **API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Manual Setup
1.  **Backend:** Install dependencies in `backend/requirements.txt` and run `uvicorn app.main:app`.
2.  **Frontend:** Install dependencies in `frontend/package.json` and run `npm run dev`.
3.  **Env:** Ensure all variables in `.env.example` are provided in your local `.env`.

---

## 📈 Future Roadmap
*   **PWA Support:** Offline-first access to voting guides for voters in areas with poor connectivity.
*   **Expanded RAG:** Integration of state-specific election handbooks for localized guidance.
*   **Advanced Analytics:** Anonymous insights for election authorities on common voter confusion points.

---

## 👋 Conclusion
**BallotBuddy AI** is more than a tool; it is a digital infrastructure for democracy. By prioritizing **security, accessibility, and grounded AI**, we ensure that every citizen can exercise their right to vote with total confidence and clarity.
