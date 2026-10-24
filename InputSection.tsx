import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Briefcase,
  Building,
  GraduationCap,
  Sparkles,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/samplePresets.ts';

interface InputSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  companyName: string;
  setCompanyName: (company: string) => void;
  experienceLevel: string;
  setExperienceLevel: (level: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onLoadPreset: (presetId: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  jobTitle,
  setJobTitle,
  companyName,
  setCompanyName,
  experienceLevel,
  setExperienceLevel,
  onAnalyze,
  isLoading,
  onLoadPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Handle file upload (TXT, MD, or PDF/Image extraction)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtractError(null);
    setFileName(file.name);

    // Plain text / Markdown
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setResumeText(content);
      };
      reader.readAsText(file);
      return;
    }

    // PDF, DOCX, or Image via server-side Gemini multimodal OCR
    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          const mimeType = file.type || 'application/pdf';

          const response = await fetch('/api/extract-resume-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64Data, mimeType }),
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to extract text from file');
          }

          const data = await response.json();
          if (data.extractedText) {
            setResumeText(data.extractedText);
          } else {
            throw new Error('No text was found in the uploaded document.');
          }
        } catch (err: any) {
          setExtractError(err.message || 'Error processing document');
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setExtractError(err.message || 'Error reading file');
      setIsExtracting(false);
    }
  };

  const resumeWordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/20 rounded-2xl border border-indigo-100 p-5 sm:p-7 shadow-sm mb-8 text-slate-800 relative overflow-hidden">
      {/* Decorative colored glow orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-200/20 via-purple-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-200/20 via-sky-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner with Quick Presets */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-5 mb-5 border-b border-indigo-100/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Resume & Target Job Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Paste your resume and target job description or choose a benchmark preset to calculate your ATS match rating.
          </p>
        </div>

        {/* Quick Sample Chips with distinct colored tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
          {SAMPLE_PRESETS.map((p, idx) => {
            const presetPillColors = [
              'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
              'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
              'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
            ][idx % 3];

            const dotColors = ['bg-blue-500', 'bg-purple-500', 'bg-emerald-500'][idx % 3];

            return (
              <button
                key={p.id}
                onClick={() => onLoadPreset(p.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 font-bold shadow-2xs ${presetPillColors}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`}></span>
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Role Meta Details */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-indigo-100/80 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            Target Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-indigo-100/80 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-purple-600" />
            Target Company (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Stripe, Google, Airbnb"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition font-medium"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-indigo-100/80 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
            Target Seniority Level
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition font-medium"
          >
            <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
            <option value="Mid Level (2-5 yrs)">Mid Level (2-5 yrs)</option>
            <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
            <option value="Staff / Principal / Lead">Staff / Principal / Lead</option>
            <option value="Director / Executive">Director / Executive</option>
          </select>
        </div>
      </div>

      {/* Dual Column Inputs */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Left: Candidate Resume */}
        <div className="flex flex-col bg-white p-4 rounded-xl border border-blue-200/70 shadow-xs">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <label className="text-sm font-bold text-slate-900">
                Candidate Resume
              </label>
              {resumeWordCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  {resumeWordCount} words
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.pdf,.png,.jpg,.jpeg"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExtracting}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 rounded-lg transition font-bold shadow-2xs"
                title="Upload PDF, TXT, or Image of resume"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-3 h-3" />
                    <span>Upload Resume (PDF/TXT)</span>
                  </>
                )}
              </button>

              {resumeText && (
                <button
                  type="button"
                  onClick={() => {
                    setResumeText('');
                    setFileName(null);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 transition"
                  title="Clear Resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {extractError && (
            <div className="mb-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{extractError}</span>
            </div>
          )}

          {fileName && !extractError && (
            <div className="mb-2 p-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Loaded from: {fileName}</span>
            </div>
          )}

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume here (Summary, Work History, Education, Skills, Projects)... or click 'Upload Resume' above."
            rows={14}
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y leading-relaxed"
          />
        </div>

        {/* Right: Job Description */}
        <div className="flex flex-col bg-white p-4 rounded-xl border border-teal-200/70 shadow-xs">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5" />
              </span>
              <label className="text-sm font-bold text-slate-900">
                Target Job Description (JD)
              </label>
              {jdWordCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                  {jdWordCount} words
                </span>
              )}
            </div>

            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
                className="text-slate-400 hover:text-rose-600 p-1 transition"
                title="Clear Job Description"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description here (Responsibilities, Requirements, Desired Qualifications)..."
            rows={14}
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-y leading-relaxed"
          />
        </div>
      </div>

      {/* Action Button Bar with vibrant gradient */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-indigo-100/80">
        <div className="text-xs text-slate-600 flex items-center gap-2 font-semibold">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>Calculates ATS Match %, Hard/Soft Skill Gaps, Bullet Critiques, and Interview Prep</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition shadow-lg ${
            isLoading || !resumeText.trim() || !jobDescription.trim()
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-indigo-500/30 active:scale-[0.99] cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Match with Gemini 3.8 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run ATS Match Analysis</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
