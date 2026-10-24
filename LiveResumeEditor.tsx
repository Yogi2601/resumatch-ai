import React, { useMemo } from 'react';
import {
  Edit3,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Search,
  ListPlus,
  Heading,
} from 'lucide-react';
import { ATSAnalysisResult } from '../types.ts';

interface LiveResumeEditorProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  analysis: ATSAnalysisResult | null;
  onReAnalyze: () => void;
  isAnalyzing: boolean;
}

export const LiveResumeEditor: React.FC<LiveResumeEditorProps> = ({
  resumeText,
  setResumeText,
  analysis,
  onReAnalyze,
  isAnalyzing,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [keywordSearch, setKeywordSearch] = React.useState('');

  // Extract all target keywords from analysis
  const targetKeywords = useMemo(() => {
    if (!analysis) return [];
    const all = [
      ...analysis.keywords.missing.map((k) => k.keyword),
      ...analysis.keywords.matched.map((k) => k.keyword),
    ];
    // deduplicate
    return Array.from(new Set(all));
  }, [analysis]);

  // Compute live presence in the current resumeText
  const keywordLiveStatus = useMemo(() => {
    const lowerText = resumeText.toLowerCase();
    return targetKeywords.map((kw) => {
      // Regex check for word presence
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      const matches = lowerText.match(regex);
      const count = matches ? matches.length : 0;
      return {
        keyword: kw,
        isPresent: count > 0,
        count,
      };
    });
  }, [resumeText, targetKeywords]);

  const presentCount = keywordLiveStatus.filter((k) => k.isPresent).length;
  const missingCount = keywordLiveStatus.length - presentCount;
  const liveCoveragePercent =
    targetKeywords.length > 0 ? Math.round((presentCount / targetKeywords.length) * 100) : 0;

  const filteredLiveKeywords = useMemo(() => {
    if (!keywordSearch.trim()) return keywordLiveStatus;
    return keywordLiveStatus.filter((k) =>
      k.keyword.toLowerCase().includes(keywordSearch.toLowerCase())
    );
  }, [keywordLiveStatus, keywordSearch]);

  const words = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const chars = resumeText.length;
  const estimatedReadingMinutes = Math.max(1, Math.ceil(words / 200));

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Tailored_Resume_ResuMatch.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInsertBullet = () => {
    setResumeText(resumeText + '\n• Accomplished [X], as measured by [Y]%, by doing [Z]');
  };

  const handleInsertHeader = () => {
    setResumeText(resumeText + '\n\nNEW SECTION NAME\n-----------------');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Live Interactive Resume Editor & Keyword Tracker
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inject missing keywords and watch them light up in real time. Click Re-Score to recalculate your ATS match rating.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>

          <button
            onClick={onReAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Re-Scoring...' : 'Re-Score ATS'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Main Canvas (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col space-y-2">
          {/* Editor Quick Tools Bar */}
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-t-xl border border-b-0 border-slate-300 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInsertBullet}
                className="flex items-center gap-1 hover:text-slate-900 px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 transition font-medium"
                title="Insert Google XYZ formatted bullet"
              >
                <ListPlus className="w-3.5 h-3.5 text-teal-600" />
                <span>+ XYZ Bullet</span>
              </button>

              <button
                type="button"
                onClick={handleInsertHeader}
                className="flex items-center gap-1 hover:text-slate-900 px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 transition font-medium"
                title="Insert section header"
              >
                <Heading className="w-3.5 h-3.5 text-indigo-600" />
                <span>+ Header</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span>{words} words</span>
              <span>•</span>
              <span>{chars} characters</span>
              <span>•</span>
              <span>~{estimatedReadingMinutes} min read</span>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={22}
            className="w-full bg-white border border-slate-300 rounded-b-xl p-4 font-mono text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed resize-y"
            placeholder="Edit your resume content here..."
          />
        </div>

        {/* Live Keyword Tracking Sidebar (1 Col) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Keyword Coverage
              </span>
              <span className="text-xs font-extrabold text-indigo-700">
                {liveCoveragePercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${liveCoveragePercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-emerald-700">{presentCount} detected</span>
              <span className="text-rose-700">{missingCount} missing</span>
            </div>
          </div>

          {/* Search Keywords */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search target keywords..."
              value={keywordSearch}
              onChange={(e) => setKeywordSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-2 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Keywords List */}
          <div className="flex-1 overflow-y-auto max-h-[460px] space-y-1.5 pr-1 no-scrollbar">
            {targetKeywords.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                Run an ATS analysis first to populate target job keywords.
              </p>
            ) : filteredLiveKeywords.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                No matching keywords found.
              </p>
            ) : (
              filteredLiveKeywords.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs transition ${
                    item.isPresent
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate mr-2 font-medium">
                    {item.isPresent ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    )}
                    <span className="truncate">{item.keyword}</span>
                  </div>

                  <span className="text-[10px] font-mono shrink-0 px-1.5 py-0.2 rounded bg-white border border-slate-200 font-bold">
                    {item.isPresent ? `${item.count}x` : '0x'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
