# ResuMatch AI — Full-Stack ATS Resume & Job Description Compatibility Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/Google_Gemini-3.8_Flash-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> An intelligent, full-stack AI application that simulates real-world Applicant Tracking Systems (ATS) like Workday, Greenhouse, and Lever. ResuMatch AI calculates multi-dimensional match scores, maps semantic keyword gaps, rewrites weak bullets with Google's XYZ formula, generates bespoke cover letters, and prepares targeted interview responses.

---

## 🌟 Key Features

1. **ATS Compatibility Scoring (0–100%)**:
   - Animated SVG score gauge with real-world hiring verdicts (*Ready to Apply*, *Moderate Match*, or *High Risk of Rejection*).
   - 5-dimensional breakdown: **Hard Skills**, **Experience & Seniority Fit**, **ATS Readability**, **Metric Quantification**, and **Keyword Density**.

2. **Interactive Keyword & Semantic Skill Gap Matrix**:
   - Categorizes skills into **Technical**, **Tools & Frameworks**, **Domain Knowledge**, and **Leadership & Soft Skills**.
   - Identifies critical missing terms filtered by recruiters and provides placement guidance.

3. **Google XYZ Resume Bullet Optimizer**:
   - Transforms passive responsibility bullets into high-impact metrics using Google's formula:  
     $$\text{Accomplished [X], as measured by [Y], by doing [Z]}$$
   - Offers 3 tailored variations: *ATS Keyword Packed*, *Metric-Heavy*, and *Leadership/Scope*.

4. **Live Interactive Resume Editor**:
   - Split-screen workspace with real-time keyword presence indicators that light up in green as you type.
   - Built-in reading time, word count, character metrics, and instant re-scoring.

5. **Tailored Cover Letter Generator**:
   - Crafts bespoke 3-paragraph letters matching candidate achievements to company pain points.
   - Selectable tones: *Confident*, *Enthusiastic*, *Concise*, or *Technical*.

6. **Targeted Interview Preparation**:
   - 5 custom questions targeting experience gaps, technical deep dives, and behavioral conflicts.
   - Complete **STAR model outlines** (*Situation, Task, Action, Result*) for each question.

7. **Multi-Format Ingestion & Export**:
   - Supports text paste, document upload (PDF, TXT, DOCX, images) via multimodal parsing, and 1-click industry benchmark presets (*Senior Full-Stack*, *Product Manager*, *Data Scientist/ML*).
   - Formatted print stylesheet (`@media print`) for clean, boardroom-ready PDF export.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans typography.
- **Backend**: Express.js server (`server.ts`) with Vite middleware integration.
- **AI Engine**: Google `@google/genai` SDK powered by `gemini-3.8-flash`.
- **Fault-Tolerant Hybrid Architecture**: Built-in algorithmic fallback engine (`atsEngine.ts`) guaranteeing zero downtime during external API demand spikes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- npm or pnpm
- Google Gemini API Key 

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/resumatch-ai.git
   cd resumatch-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 💼 How to Showcase in Your Portfolio & Resume

### Resume Bullet (Add to your "Projects" section):
> **ResuMatch AI — Full-Stack ATS Resume & Job Description Compatibility Engine** | *TypeScript, React 19, Express, Tailwind CSS, Google Gemini 3.8 Flash*
> - Engineered an AI-powered resume scanner and ATS simulator matching candidate qualifications to job descriptions with 5-dimensional competency scoring.
> - Implemented an interactive keyword gap matrix and Google XYZ bullet optimizer with real-time text analysis.
> - Built a fault-tolerant hybrid backend with sub-second algorithmic fallback handling external API rate limits with 100% uptime.

### LinkedIn Post Template:
> 🚀 Excited to share my latest full-stack project: **ResuMatch AI**!
>
> Over 75% of resumes are filtered out by ATS parsers (Workday, Greenhouse) before a recruiter ever reviews them. I built ResuMatch AI to solve this problem:
> ✨ Real-time ATS match scoring (0–100%) across 5 dimensions  
> 🔍 Semantic keyword gap matrix (detects missing critical tech keywords)  
> ⚡ Google XYZ formula bullet point re-writer  
> ✍️ Live interactive resume editor with dynamic keyword illumination  
> 🎯 Bespoke cover letter & STAR interview prep generator  
>
> 💻 Tech Stack: React 19, TypeScript, Express, Tailwind CSS v4, and Google Gemini 3.8 Flash.
> 🔗 Live Demo: [Your Link] | GitHub: [Your Repo Link]
