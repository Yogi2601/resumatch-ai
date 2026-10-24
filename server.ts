import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  computeAlgorithmicATS,
  tailorBulletAlgorithmic,
  generateCoverLetterAlgorithmic,
  generateInterviewPrepAlgorithmic,
} from './src/server/atsEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Environment constraint: dev server must run on port 3000
const port = 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini client utility (User-Agent header required by skill)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Call Gemini with timeout
async function callGeminiWithTimeout(contents: any, config: any = {}, timeoutMs = 6000): Promise<string> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Gemini API call timed out')), timeoutMs)
  );

  const apiPromise = ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config,
  });

  const response: any = await Promise.race([apiPromise, timeoutPromise]);
  return response.text || '';
}

// 1. Full ATS & Job Description Analysis
app.post('/api/analyze-resume', async (req, res) => {
  const {
    resumeText,
    jobDescription,
    jobTitle = 'Target Role',
    companyName = 'Target Company',
    experienceLevel = 'Mid-Senior',
  } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Both resume text and job description are required.' });
  }

  // Attempt Gemini AI analysis first; seamlessly fall back to algorithmic engine on 503/timeout
  try {
    const prompt = `You are a world-class Fortune 500 Senior Technical Recruiter, ATS Algorithm Architect, and Executive Career Coach.
Analyze the candidate Resume against the Job Description.

Candidate Resume:
"""
${resumeText}
"""

Target Job Description (${jobTitle} at ${companyName}, Level: ${experienceLevel}):
"""
${jobDescription}
"""

Return valid JSON:
- overallScore: integer between 0 and 100.
- verdict: concise summary phrase.
- summary: 2 to 3 sentences summarizing match quality, strengths, and friction points.
- scores: { skillsMatch: number, experienceMatch: number, atsReadability: number, impactQuantification: number, keywordRelevance: number }
- keywords: {
    matched: array of { "keyword": string, "category": "technical"|"soft"|"domain"|"tool", "inResumeCount": number, "importance": "high"|"medium"|"low" },
    missing: array of { "keyword": string, "category": "technical"|"soft"|"domain"|"tool", "importance": "high"|"medium"|"low", "recommendation": string }
  }
- sectionAudits: array of { "section": string, "status": "good"|"warning"|"critical", "findings": string[], "actionableRecommendations": string[] }
- bulletPointCritiques: array of 3 to 5 items { "originalBullet": string, "issue": string, "improvedBullet": string, "whyItWorks": string }
- topQuickWins: string[] (3-5 immediate high-yield changes)
- strengths: string[]
- criticalGaps: string[]
- jobRequirementsSummary: { keyResponsibilities: string[], requiredSkills: string[], preferredQualifications: string[] }`;

    const rawText = await callGeminiWithTimeout(prompt, {
      responseMimeType: 'application/json',
      temperature: 0.2,
    });

    const parsed = JSON.parse(rawText);
    if (parsed && typeof parsed.overallScore === 'number' && parsed.keywords) {
      return res.json(parsed);
    }
  } catch (err: any) {
    console.warn('Gemini API unavailable or timed out, executing high-precision ATS engine:', err.message);
  }

  // Algorithmic ATS fallback (never fails, instant, deterministic)
  const fallbackResult = computeAlgorithmicATS(
    resumeText,
    jobDescription,
    jobTitle,
    companyName,
    experienceLevel
  );
  res.json(fallbackResult);
});

// 2. Tailor / Rewrite specific bullet points
app.post('/api/tailor-bullets', async (req, res) => {
  const { bulletText, jobDescription, jobTitle = 'Target Role' } = req.body;

  if (!bulletText) {
    return res.status(400).json({ error: 'Bullet text is required.' });
  }

  try {
    const prompt = `Rewrite this candidate resume bullet point for maximum impact, ATS keyword indexing, and recruiter impressiveness for "${jobTitle}".
Original Bullet: "${bulletText}"
Job Context: "${jobDescription || 'Technical/Corporate Role'}"

Return valid JSON:
{
  "variations": [
    { "style": "ATS Keyword Optimized", "bullet": "string", "tagline": "string", "keywordsIncluded": ["string"] },
    { "style": "Metric & Impact Heavy (Google XYZ Formula)", "bullet": "string", "tagline": "string", "keywordsIncluded": ["string"] },
    { "style": "Leadership & Cross-Functional Scope", "bullet": "string", "tagline": "string", "keywordsIncluded": ["string"] }
  ],
  "critique": "string"
}`;

    const rawText = await callGeminiWithTimeout(prompt, {
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    const parsed = JSON.parse(rawText);
    if (parsed?.variations?.length) {
      return res.json(parsed);
    }
  } catch (err: any) {
    console.warn('Gemini API unavailable, using algorithmic bullet rewriter:', err.message);
  }

  const fallback = tailorBulletAlgorithmic(bulletText, jobTitle);
  res.json(fallback);
});

// 3. Tailored Cover Letter Generator
app.post('/api/generate-cover-letter', async (req, res) => {
  const {
    resumeText,
    jobDescription,
    jobTitle = 'Target Role',
    companyName = 'Hiring Team',
    tone = 'confident',
  } = req.body;

  try {
    const prompt = `Write a high-converting, tailored cover letter.
Tone: ${tone}. Role: ${jobTitle}. Company: ${companyName}.
Resume: """${resumeText}"""
Job Description: """${jobDescription}"""

Return valid JSON:
{
  "subjectLine": "string",
  "openingHook": "string",
  "coreAlignment": "string",
  "closingCallToAction": "string",
  "fullLetter": "string",
  "tailoredStrengthsHighlighted": ["string", "string"]
}`;

    const rawText = await callGeminiWithTimeout(prompt, {
      responseMimeType: 'application/json',
      temperature: 0.4,
    });

    const parsed = JSON.parse(rawText);
    if (parsed?.fullLetter) {
      return res.json(parsed);
    }
  } catch (err: any) {
    console.warn('Gemini API unavailable, using algorithmic cover letter generator:', err.message);
  }

  const fallback = generateCoverLetterAlgorithmic(
    resumeText,
    jobDescription,
    jobTitle,
    companyName,
    tone
  );
  res.json(fallback);
});

// 4. Targeted Interview Prep & Likely Questions
app.post('/api/interview-prep', async (req, res) => {
  const { resumeText, jobDescription, jobTitle = 'Target Role' } = req.body;

  try {
    const prompt = `Generate 5 high-yield interview questions for candidate interviewing for ${jobTitle}.
Resume: """${resumeText}"""
Job Description: """${jobDescription}"""

Return valid JSON:
{
  "questions": [
    {
      "question": "string",
      "category": "Gap Investigation" | "Technical Deep Dive" | "Behavioral & STAR" | "System Architecture & Execution",
      "whyInterviewerAsks": "string",
      "recommendedAnswerStrategy": "string",
      "suggestedStarOutline": { "situation": "string", "task": "string", "action": "string", "result": "string" }
    }
  ]
}`;

    const rawText = await callGeminiWithTimeout(prompt, {
      responseMimeType: 'application/json',
      temperature: 0.3,
    });

    const parsed = JSON.parse(rawText);
    if (parsed?.questions?.length) {
      return res.json(parsed);
    }
  } catch (err: any) {
    console.warn('Gemini API unavailable, using interview prep generator:', err.message);
  }

  const fallback = generateInterviewPrepAlgorithmic(jobTitle);
  res.json(fallback);
});

// 5. Extract text from uploaded document (supports PDF, images, docs via Gemini multimodal)
app.post('/api/extract-resume-document', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;

    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: 'Base64 data and mimeType are required.' });
    }

    const documentPart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: `Extract all resume text accurately, preserving logical sections (Contact Info, Professional Summary, Work Experience with all bullet points, Education, Technical Skills, Projects, Certifications). Return clean, plain text formatted with clear Markdown headers and bullet points. Do not add commentary.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [documentPart, textPart] },
    });

    res.json({ extractedText: response.text || '' });
  } catch (error: any) {
    console.error('Error extracting document text with Gemini, attempting base64 fallback:', error);
    try {
      // If it's a plain text or UTF-8 encoded file
      const raw = Buffer.from(req.body.base64Data, 'base64').toString('utf-8');
      if (raw && !/[\x00-\x08\x0E-\x1F]/.test(raw.slice(0, 500))) {
        return res.json({ extractedText: raw });
      }
    } catch (e) {
      // ignore
    }
    res.status(500).json({ error: 'Could not extract text from document. Please copy and paste the text directly.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ResuMatch AI API' });
});

// Setup Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: false,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`ResuMatch AI server running at http://0.0.0.0:${port}`);
});
