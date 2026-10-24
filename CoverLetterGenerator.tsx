import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  Send,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { CoverLetterResult } from '../types.ts';

interface CoverLetterGeneratorProps {
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  resumeText,
  jobDescription,
  jobTitle,
  companyName,
}) => {
  const [tone, setTone] = useState<'confident' | 'enthusiastic' | 'concise' | 'technical'>('confident');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editedLetter, setEditedLetter] = useState('');

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle: jobTitle || 'Target Role',
          companyName: companyName || 'Hiring Team',
          tone,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate cover letter');
      }

      const data: CoverLetterResult = await response.json();
      setResult(data);
      setEditedLetter(data.fullLetter);
    } catch (err: any) {
      setError(err.message || 'Error generating cover letter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${(companyName || 'Company').replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-slate-800">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              AI Tailored Cover Letter Generator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Bridges your actual accomplishments directly to the requirements of {jobTitle || 'the position'} at {companyName || 'the target company'}.
          </p>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['confident', 'enthusiastic', 'concise', 'technical'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-3 py-1 rounded-lg text-xs capitalize font-semibold transition ${
                tone === t
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Trigger Button */}
      {!result && (
        <div className="text-center py-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Ready to generate your targeted cover letter
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Gemini will match your verified resume achievements with the primary business challenges outlined in the job description.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !resumeText.trim() || !jobDescription.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-indigo-600/25 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating tailored letter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {tone} Cover Letter</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Generated Cover Letter Result */}
      {result && (
        <div className="space-y-4">
          {/* Top Actions & Highlights */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-medium">Subject Line:</span>
              <div className="text-sm font-bold text-slate-900">{result.subjectLine}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Letter</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-1 px-2.5 py-1.5 text-indigo-600 hover:text-indigo-800 text-xs font-semibold transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Key Tailored Strengths Highlighted */}
          {result.tailoredStrengthsHighlighted && result.tailoredStrengthsHighlighted.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Key Themes:</span>
              {result.tailoredStrengthsHighlighted.map((theme, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  ✓ {theme}
                </span>
              ))}
            </div>
          )}

          {/* Editable Full Letter Canvas */}
          <div>
            <textarea
              value={editedLetter}
              onChange={(e) => setEditedLetter(e.target.value)}
              rows={16}
              className="w-full bg-white border border-slate-300 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed shadow-2xs"
            />
          </div>
        </div>
      )}
    </div>
  );
};
