import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  Copy,
  Check,
  Zap,
  Tag,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { TailoredBulletsResult } from '../types.ts';

interface BulletImproverTabProps {
  initialBullet?: string;
  jobDescription: string;
  jobTitle: string;
  onApplyBulletToResume?: (bullet: string) => void;
}

export const BulletImproverTab: React.FC<BulletImproverTabProps> = ({
  initialBullet = '',
  jobDescription,
  jobTitle,
  onApplyBulletToResume,
}) => {
  const [bulletText, setBulletText] = useState(initialBullet);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TailoredBulletsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  // Sync if initialBullet prop changes
  React.useEffect(() => {
    if (initialBullet) {
      setBulletText(initialBullet);
    }
  }, [initialBullet]);

  const handleGenerate = async () => {
    if (!bulletText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/tailor-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletText,
          jobDescription,
          jobTitle,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to tailor bullet point');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error tailoring bullet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (bullet: string, index: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (bullet: string, index: number) => {
    if (onApplyBulletToResume) {
      onApplyBulletToResume(bullet);
      setAppliedIndex(index);
      setTimeout(() => setAppliedIndex(null), 2500);
    }
  };

  const sampleQuickStarters = [
    'Responsible for building backend APIs and working with database.',
    'Helped improve system performance and fixed bugs.',
    'Led meetings with clients and gathered requirements for software.',
    'Managed social media campaigns and tracked user analytics.',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-slate-800">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">
            AI Resume Bullet Point Optimizer (Google XYZ Formula)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Transform weak, passive responsibility statements into high-yield, metric-driven achievements tailored to {jobTitle || 'your target role'}.
        </p>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Paste any resume bullet point or duty to rewrite:
        </label>
        <textarea
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
          placeholder="e.g. Worked on migrating database and speeding up queries for our web app..."
          rows={3}
          className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl p-3.5 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />

        {/* Quick Starters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-medium text-slate-500">Try an example:</span>
          {sampleQuickStarters.map((starter, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setBulletText(starter)}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition truncate max-w-xs font-medium"
            >
              "{starter}"
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !bulletText.trim()}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            isLoading || !bulletText.trim()
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Synthesizing High-Impact Rewrites...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate 3 High-Impact Rewrites</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-5 pt-3 border-t border-slate-100">
          {/* Recruiter Diagnostic */}
          {result.critique && (
            <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl text-xs text-slate-800">
              <span className="font-bold text-amber-800">Recruiter Diagnostic: </span>
              {result.critique}
            </div>
          )}

          {/* 3 Variations */}
          <div className="space-y-4">
            {result.variations.map((v, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-xl p-4 sm:p-5 space-y-3 transition shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{v.style}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{v.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleCopy(v.bullet, idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition shadow-2xs"
                      title="Copy bullet"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {onApplyBulletToResume && (
                      <button
                        onClick={() => handleApply(v.bullet, idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition"
                        title="Add this bullet to your live resume draft"
                      >
                        {appliedIndex === idx ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Added to Draft!</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Add to Resume Draft</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Rewritten Bullet Text */}
                <div className="bg-white border border-slate-200 p-3.5 rounded-lg text-xs sm:text-sm font-mono text-emerald-800 font-medium leading-relaxed shadow-2xs">
                  • {v.bullet}
                </div>

                {/* Keywords Injected */}
                {v.keywordsIncluded && v.keywordsIncluded.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Tag className="w-3 h-3 text-indigo-600" />
                      Keywords injected:
                    </span>
                    {v.keywordsIncluded.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
