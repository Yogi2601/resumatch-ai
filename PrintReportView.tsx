import React from 'react';
import { ATSAnalysisResult } from '../types.ts';

interface PrintReportViewProps {
  analysis: ATSAnalysisResult | null;
  jobTitle: string;
  companyName: string;
  experienceLevel: string;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  analysis,
  jobTitle,
  companyName,
  experienceLevel,
}) => {
  if (!analysis) return null;

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 font-sans max-w-4xl mx-auto">
      {/* Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
            ResuMatch AI — ATS Compatibility Audit Report
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Automated Recruiter & Applicant Tracking System Evaluation
          </p>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div>Generated: {new Date().toLocaleDateString()}</div>
          <div className="font-semibold text-slate-900">Score: {analysis.overallScore} / 100</div>
        </div>
      </div>

      {/* Target Role & Scope Meta */}
      <div className="grid grid-cols-3 gap-4 p-3 bg-slate-100 rounded-lg text-xs mb-6">
        <div>
          <span className="font-bold text-slate-700 block">Target Role:</span>
          <span>{jobTitle || analysis.jobTitle || 'Unspecified'}</span>
        </div>
        <div>
          <span className="font-bold text-slate-700 block">Target Company:</span>
          <span>{companyName || analysis.companyName || 'General Application'}</span>
        </div>
        <div>
          <span className="font-bold text-slate-700 block">Seniority Benchmark:</span>
          <span>{experienceLevel}</span>
        </div>
      </div>

      {/* Overall Verdict & Summary */}
      <div className="mb-6 p-4 border border-slate-300 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Overall ATS Evaluation
          </h2>
          <span className="text-base font-black px-2.5 py-0.5 bg-slate-900 text-white rounded">
            {analysis.overallScore}% MATCH
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-800 mb-1">
          Verdict: {analysis.verdict}
        </p>
        <p className="text-xs text-slate-700 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Dimension Sub-Scores */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
          Dimension Competency Breakdown
        </h3>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 border rounded">
            <span className="block font-bold text-sm text-slate-900">
              {analysis.scores.skillsMatch}%
            </span>
            <span className="text-[10px] text-slate-600">Hard Skills</span>
          </div>
          <div className="p-2 border rounded">
            <span className="block font-bold text-sm text-slate-900">
              {analysis.scores.experienceMatch}%
            </span>
            <span className="text-[10px] text-slate-600">Experience</span>
          </div>
          <div className="p-2 border rounded">
            <span className="block font-bold text-sm text-slate-900">
              {analysis.scores.atsReadability}%
            </span>
            <span className="text-[10px] text-slate-600">Readability</span>
          </div>
          <div className="p-2 border rounded">
            <span className="block font-bold text-sm text-slate-900">
              {analysis.scores.impactQuantification}%
            </span>
            <span className="text-[10px] text-slate-600">XYZ Impact</span>
          </div>
          <div className="p-2 border rounded">
            <span className="block font-bold text-sm text-slate-900">
              {analysis.scores.keywordRelevance}%
            </span>
            <span className="text-[10px] text-slate-600">Keywords</span>
          </div>
        </div>
      </div>

      {/* Top Quick Wins */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
          High-Yield Priority Recommendations
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-800">
          {analysis.topQuickWins.map((win, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-bold text-slate-950">{i + 1}.</span>
              <span>{win}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Keywords Checklist */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
          Missing Keywords to Incorporate
        </h3>
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {analysis.keywords.missing.map((k, i) => (
            <span
              key={i}
              className="px-2 py-0.5 border border-slate-400 bg-slate-50 text-slate-900 rounded"
            >
              [ ] {k.keyword} ({k.category})
            </span>
          ))}
        </div>
      </div>

      {/* Sample Improved Bullets */}
      {analysis.bulletPointCritiques.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-1">
            Optimized Bullet Point Rewrites
          </h3>
          <div className="space-y-3">
            {analysis.bulletPointCritiques.map((b, i) => (
              <div key={i} className="text-xs border p-2 rounded space-y-1">
                <div className="text-slate-500 line-through">
                  Original: {b.originalBullet}
                </div>
                <div className="font-semibold text-slate-900">
                  Rewritten: {b.improvedBullet}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-[10px] text-slate-500 flex justify-between items-center">
        <span>ResuMatch AI • Powered by Google Gemini 3.8 Flash</span>
        <span>Candidate Confidence Report</span>
      </div>
    </div>
  );
};
