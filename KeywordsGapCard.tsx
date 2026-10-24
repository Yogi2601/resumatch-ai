import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Copy,
  Check,
  Tag,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { KeywordItem } from '../types.ts';

interface KeywordsGapCardProps {
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
}

export const KeywordsGapCard: React.FC<KeywordsGapCardProps> = ({
  matchedKeywords = [],
  missingKeywords = [],
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'missing' | 'matched' | 'technical' | 'soft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedMissing, setCopiedMissing] = useState(false);

  // Combine and augment
  const allKeywords = useMemo(() => {
    const list: (KeywordItem & { isMissing: boolean })[] = [
      ...missingKeywords.map((k) => ({ ...k, isMissing: true })),
      ...matchedKeywords.map((k) => ({ ...k, isMissing: false })),
    ];
    return list;
  }, [matchedKeywords, missingKeywords]);

  // Filter based on active tab and search query
  const filteredKeywords = useMemo(() => {
    return allKeywords.filter((item) => {
      // Tab filter
      if (activeFilter === 'missing' && !item.isMissing) return false;
      if (activeFilter === 'matched' && item.isMissing) return false;
      if (activeFilter === 'technical' && item.category !== 'technical' && item.category !== 'tool') return false;
      if (activeFilter === 'soft' && item.category !== 'soft' && item.category !== 'domain') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.keyword.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesRec = item.recommendation?.toLowerCase().includes(q);
        return matchesName || matchesCategory || matchesRec;
      }

      return true;
    });
  }, [allKeywords, activeFilter, searchQuery]);

  const handleCopyMissing = () => {
    const text = missingKeywords.map((k) => k.keyword).join(', ');
    navigator.clipboard.writeText(text);
    setCopiedMissing(true);
    setTimeout(() => setCopiedMissing(false), 2000);
  };

  const highImportanceMissingCount = missingKeywords.filter((k) => k.importance === 'high').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6 text-slate-800">
      {/* Header & Stats Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-sm shadow-sky-500/25">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              ATS Keyword & Semantic Skill Gap Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Applicant Tracking Systems match verbatim terms and synonymous competencies found in the job description.
          </p>
        </div>

        {/* Quick Stats Pill with vibrant gradient borders */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold">{matchedKeywords.length}</span>
            <span className="text-slate-600">Matched</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-300 text-rose-800 text-xs font-bold shadow-2xs">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span className="font-extrabold">{missingKeywords.length}</span>
            <span className="text-slate-600">Missing ({highImportanceMissingCount} Critical)</span>
          </div>

          <button
            onClick={handleCopyMissing}
            disabled={missingKeywords.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition shadow-2xs"
            title="Copy all missing keywords as comma separated list"
          >
            {copiedMissing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Missing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills with distinct vibrant colors */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            All Keywords ({allKeywords.length})
          </button>
          <button
            onClick={() => setActiveFilter('missing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
              activeFilter === 'missing'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            Missing ({missingKeywords.length})
          </button>
          <button
            onClick={() => setActiveFilter('matched')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
              activeFilter === 'matched'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Matched ({matchedKeywords.length})
          </button>
          <button
            onClick={() => setActiveFilter('technical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
              activeFilter === 'technical'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            Technical / Tools
          </button>
          <button
            onClick={() => setActiveFilter('soft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
              activeFilter === 'soft'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Leadership & Domain
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>
      </div>

      {/* Keywords Grid Display */}
      {filteredKeywords.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No keywords found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredKeywords.map((item, idx) => {
            const isMissing = item.isMissing;
            const categoryBadgeColor =
              item.category === 'technical'
                ? 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-300'
                : item.category === 'tool'
                ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-300'
                : item.category === 'domain'
                ? 'bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border-teal-300'
                : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-300';

            return (
              <div
                key={idx}
                className={`rounded-xl border p-3.5 transition flex flex-col justify-between ${
                  isMissing
                    ? item.importance === 'high'
                      ? 'bg-gradient-to-br from-rose-50/90 to-pink-50/40 border-rose-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200'
                    : 'bg-gradient-to-br from-emerald-50/80 to-teal-50/30 border-emerald-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {isMissing ? (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span className="text-sm font-bold text-slate-900">
                        {item.keyword}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${categoryBadgeColor}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    {isMissing ? (
                      <span className="text-rose-700 font-bold">
                        Not detected in resume
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        Detected in resume ({item.inResumeCount || 1}x)
                      </span>
                    )}

                    {item.importance === 'high' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-extrabold border border-rose-300">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>

                {/* Recommendation for missing keywords */}
                {isMissing && item.recommendation && (
                  <div className="mt-2 text-[11px] text-slate-700 bg-white/90 p-2.5 rounded-lg border border-rose-200/80 leading-relaxed shadow-2xs font-medium">
                    <span className="font-extrabold text-indigo-700">Action: </span>
                    {item.recommendation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
