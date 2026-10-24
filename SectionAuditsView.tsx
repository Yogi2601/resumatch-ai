import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpenCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SectionAudit, BulletCritique } from '../types.ts';

interface SectionAuditsViewProps {
  sectionAudits: SectionAudit[];
  bulletCritiques: BulletCritique[];
  onOptimizeBullet: (bullet: string) => void;
}

export const SectionAuditsView: React.FC<SectionAuditsViewProps> = ({
  sectionAudits = [],
  bulletCritiques = [],
  onOptimizeBullet,
}) => {
  return (
    <div className="space-y-8 text-slate-800">
      {/* Section-by-Section ATS Audit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Section-by-Section ATS Architectural Audit
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Structure, parsing compliance & impact inspection
          </span>
        </div>

        <div className="space-y-4">
          {sectionAudits.map((audit, idx) => {
            const statusConfig = {
              good: {
                icon: CheckCircle2,
                color: 'text-emerald-600',
                border: 'border-emerald-200',
                bg: 'bg-emerald-50/50',
                badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                label: 'Strong Compliance',
              },
              warning: {
                icon: AlertTriangle,
                color: 'text-amber-600',
                border: 'border-amber-200',
                bg: 'bg-amber-50/50',
                badge: 'bg-amber-100 text-amber-800 border-amber-300',
                label: 'Needs Improvement',
              },
              critical: {
                icon: XCircle,
                color: 'text-rose-600',
                border: 'border-rose-200',
                bg: 'bg-rose-50/50',
                badge: 'bg-rose-100 text-rose-800 border-rose-300',
                label: 'Critical ATS Friction',
              },
            }[audit.status] || {
              icon: AlertTriangle,
              color: 'text-amber-600',
              border: 'border-slate-200',
              bg: 'bg-slate-50',
              badge: 'bg-slate-100 text-slate-700',
              label: 'Reviewed',
            };

            const Icon = statusConfig.icon;

            return (
              <div
                key={idx}
                className={`rounded-xl border ${statusConfig.border} ${statusConfig.bg} p-5 space-y-3.5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-5 h-5 ${statusConfig.color}`} />
                    <h4 className="text-base font-bold text-slate-900">
                      {audit.section}
                    </h4>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${statusConfig.badge}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Findings */}
                {audit.findings && audit.findings.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      ATS Findings:
                    </h5>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                      {audit.findings.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-slate-400 mt-1">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {audit.actionableRecommendations && audit.actionableRecommendations.length > 0 && (
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
                      Recruiter Recommendations:
                    </h5>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                      {audit.actionableRecommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-0.5 font-bold">→</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bullet Point Critiques & Rewrites */}
      {bulletCritiques.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Resume Bullet Point Diagnostic & XYZ Rewrites
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Before & after comparison upgrading weak/passive phrases to Google XYZ formula standards.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bulletCritiques.map((critique, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3"
              >
                {/* Before / Original */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                      Original Weak Bullet:
                    </span>
                    <button
                      onClick={() => onOptimizeBullet(critique.originalBullet)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                    >
                      <span>Generate More Variations</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 text-slate-700 text-xs sm:text-sm p-3 rounded-lg font-mono">
                    "{critique.originalBullet}"
                  </div>
                  <div className="text-[11px] text-rose-700 font-medium italic">
                    <span className="font-bold">Issue: </span>
                    {critique.issue}
                  </div>
                </div>

                {/* After / Improved */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Recommended XYZ Rewrite:
                  </span>
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm p-3 rounded-lg font-mono font-medium">
                    "{critique.improvedBullet}"
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <span className="font-bold text-teal-700">Why It Works: </span>
                    {critique.whyItWorks}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
