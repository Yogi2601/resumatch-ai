import React from 'react';
import {
  X,
  History,
  Trash2,
  Calendar,
  Building,
  Briefcase,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ATSAnalysisResult } from '../types.ts';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: ATSAnalysisResult[];
  onSelectAnalysis: (analysis: ATSAnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyList,
  onSelectAnalysis,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col z-10 text-slate-800">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Analysis History</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
              {historyList.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {historyList.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold p-1.5 rounded hover:bg-rose-50 transition"
                title="Clear all history"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {historyList.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">No saved analyses yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Your ATS scans will automatically be saved here so you can track score improvements over time.
              </p>
            </div>
          ) : (
            historyList.map((item) => {
              const dateStr = item.timestamp
                ? new Date(item.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              const scoreColor =
                item.overallScore >= 80
                  ? 'text-emerald-800 border-emerald-300 bg-emerald-50'
                  : item.overallScore >= 65
                  ? 'text-amber-800 border-amber-300 bg-amber-50'
                  : 'text-rose-800 border-rose-300 bg-rose-50';

              return (
                <div
                  key={item.id || Math.random()}
                  className="bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-xl p-4 transition group flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectAnalysis(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1 truncate max-w-[200px]">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        {item.jobTitle || 'Target Role'}
                      </span>

                      <div
                        className={`text-xs font-bold px-2 py-0.5 rounded-md border ${scoreColor}`}
                      >
                        {item.overallScore}%
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1.5 font-medium">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{item.companyName || 'Company'}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic mb-2">
                      "{item.verdict}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <span className="text-indigo-600 font-bold group-hover:underline flex items-center gap-0.5">
                        Load Report <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => item.id && onDeleteHistoryItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition shrink-0"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
