import React from 'react';
import {
  Trophy,
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingUp,
  Sliders,
  FileCheck,
  Target,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  Code2,
  Briefcase,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import { ATSAnalysisResult } from '../types.ts';

interface ScoreOverviewCardProps {
  analysis: ATSAnalysisResult;
  onNavigateTab: (tab: 'keywords' | 'audits' | 'bulletImprover' | 'editor' | 'coverLetter' | 'interviewPrep') => void;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({
  analysis,
  onNavigateTab,
}) => {
  const [copiedSummary, setCopiedSummary] = React.useState(false);

  const { overallScore, verdict, summary, scores, topQuickWins, strengths, criticalGaps } =
    analysis;

  // Vibrant color themes based on score
  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        gradientStart: '#10b981', // emerald-500
        gradientEnd: '#06b6d4', // cyan-500
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-300',
        badge: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border-emerald-300 shadow-2xs',
        label: 'Ready to Apply • Strong ATS Match',
      };
    }
    if (score >= 65) {
      return {
        gradientStart: '#f59e0b', // amber-500
        gradientEnd: '#f97316', // orange-500
        text: 'text-amber-800',
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        badge: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border-amber-300 shadow-2xs',
        label: 'Moderate Match • Optimization Recommended',
      };
    }
    return {
      gradientStart: '#f43f5e', // rose-500
      gradientEnd: '#e11d48', // rose-600
      text: 'text-rose-800',
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      badge: 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-900 border-rose-300 shadow-2xs',
      label: 'High Risk of ATS Rejection • Major Gaps',
    };
  };

  const theme = getScoreTheme(overallScore);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const handleCopySummary = () => {
    const textToCopy = `ATS Match Score: ${overallScore}/100\nVerdict: ${verdict}\n\nSummary:\n${summary}\n\nTop Quick Wins:\n${topQuickWins
      .map((w, i) => `${i + 1}. ${w}`)
      .join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const dimensionList = [
    {
      label: 'Hard Skills & Tech Stack',
      score: scores.skillsMatch,
      desc: 'Matches required technologies, frameworks, and domain tooling.',
      barGradient: 'from-blue-500 to-cyan-500',
      icon: Code2,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      label: 'Experience & Seniority Fit',
      score: scores.experienceMatch,
      desc: 'Years in industry, leadership scope, and project scale.',
      barGradient: 'from-indigo-500 to-violet-500',
      icon: Briefcase,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-700',
    },
    {
      label: 'ATS Readability & Layout',
      score: scores.atsReadability,
      desc: 'Standard headers, parseable text structure, clean hierarchy.',
      barGradient: 'from-emerald-500 to-teal-500',
      icon: FileCheck,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Metrics & Impact Quantification',
      score: scores.impactQuantification,
      desc: 'Uses XYZ formulas, numbers, percentages, and dollar scale.',
      barGradient: 'from-amber-500 to-orange-500',
      icon: TrendingUp,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      label: 'Keyword Context & Frequency',
      score: scores.keywordRelevance,
      desc: 'Natural keyword integration without keyword stuffing.',
      barGradient: 'from-purple-500 to-pink-500',
      icon: Target,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Hero Score Section */}
      <div className="bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/30 rounded-2xl border border-indigo-100 p-6 sm:p-7 shadow-sm relative overflow-hidden text-slate-800">
        {/* Subtle decorative color blooms */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-200/20 via-pink-200/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center text-center shrink-0">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={theme.gradientStart} />
                    <stop offset="100%" stopColor={theme.gradientEnd} />
                  </linearGradient>
                </defs>
                {/* Background Track */}
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  className="text-slate-100"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Animated Gradient Progress Ring */}
                <circle
                  cx="88"
                  cy="88"
                  r={radius}
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black tracking-tight ${theme.text}`}>
                  {overallScore}
                </span>
                <span className="text-[11px] uppercase font-extrabold tracking-widest text-slate-400 mt-0.5">
                  ATS Score
                </span>
              </div>
            </div>

            <span className={`mt-3 text-xs font-bold px-3.5 py-1 rounded-full border ${theme.badge}`}>
              {theme.label}
            </span>
          </div>

          {/* Recruiter Evaluation Summary */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  ATS Recruiter Assessment
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  {verdict}
                </h3>
              </div>

              <button
                onClick={handleCopySummary}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition shadow-2xs"
                title="Copy assessment summary"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Assessment</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-indigo-100 shadow-2xs font-medium">
              {summary}
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onNavigateTab('keywords')}
                className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-sky-800 rounded-lg border border-sky-200 transition flex items-center gap-1 font-bold shadow-2xs"
              >
                <span>View {analysis.keywords.missing.length} Missing Keywords</span>
                <ArrowRight className="w-3 h-3 text-sky-600" />
              </button>

              <button
                onClick={() => onNavigateTab('bulletImprover')}
                className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 rounded-lg border border-amber-200 transition flex items-center gap-1 font-bold shadow-2xs"
              >
                <span>Optimize Resume Bullets</span>
                <ArrowRight className="w-3 h-3 text-amber-600" />
              </button>

              <button
                onClick={() => onNavigateTab('editor')}
                className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-800 rounded-lg border border-emerald-200 transition flex items-center gap-1 font-bold shadow-2xs"
              >
                <span>Edit & Re-Score Live</span>
                <ArrowRight className="w-3 h-3 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Dimensional Competency Breakdown with Vibrant Gradients */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm text-slate-800">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Sub-Score Dimensions Breakdown
            </h4>
          </div>
          <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            Weighted ATS Benchmarks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensionList.map((dim, idx) => {
            const Icon = dim.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between transition shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border shadow-2xs ${dim.iconColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {dim.label}
                      </span>
                    </div>
                    <span className={`text-sm font-black ${dim.textColor}`}>
                      {dim.score}%
                    </span>
                  </div>

                  {/* Gradient Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2.5 p-0.5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${dim.barGradient} transition-all duration-700`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-normal font-medium">
                  {dim.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Quick Wins (+15-25 points) with Warm Amber/Gold Styling */}
      <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white rounded-2xl border border-amber-200 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/25">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900">
              Top Quick Wins (Boost Score +15 to +25 Points)
            </h4>
            <span className="text-xs text-amber-900 font-medium">
              High-yield adjustments to directly satisfy ATS parsing filters
            </span>
          </div>
        </div>

        <div className="space-y-2.5 mt-4">
          {topQuickWins.map((win, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/95 border border-amber-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {i + 1}
              </div>
              <div className="flex-1 leading-relaxed font-semibold text-slate-800">{win}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Standout Strengths vs Critical Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/30 to-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-emerald-100">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Standout Candidate Strengths
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-lg border border-emerald-100/80 shadow-2xs font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Gaps */}
        <div className="bg-gradient-to-br from-rose-50/70 via-pink-50/30 to-white rounded-2xl border border-rose-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-rose-100">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Critical Deficits / Gaps to Address
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {criticalGaps.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-lg border border-rose-100/80 shadow-2xs font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
