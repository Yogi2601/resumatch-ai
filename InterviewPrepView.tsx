import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Target,
  Brain,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { InterviewQuestionItem } from '../types.ts';

interface InterviewPrepViewProps {
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({
  resumeText,
  jobDescription,
  jobTitle,
}) => {
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle: jobTitle || 'Target Role',
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate interview prep');
      }

      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || 'Error generating interview questions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 text-slate-800">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Targeted Interview Preparation & Gap Strategy
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Anticipate the exact questions hiring managers will ask based on where your resume aligns or differs from {jobTitle || 'the JD'}.
          </p>
        </div>

        {questions.length > 0 && (
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Regenerate Questions</span>
          </button>
        )}
      </div>

      {/* Initial Call To Action */}
      {questions.length === 0 && !isLoading && (
        <div className="text-center py-10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Generate Tailored Interview Questions & STAR Outlines
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Identify potential scrutiny points in your experience and prepare high-conviction STAR answers before stepping into the room.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!resumeText.trim() || !jobDescription.trim()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-indigo-600/25 disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Targeted Questions</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">
            Simulating hiring manager review & synthesizing high-yield questions...
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Questions Accordion */}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isExpanded = expandedIndex === idx;

            const categoryTheme =
              q.category.includes('Gap') || q.category.includes('Investigation')
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : q.category.includes('Technical')
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200 rounded-xl overflow-hidden transition shadow-2xs"
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-100/70 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200">
                        {idx + 1}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${categoryTheme}`}
                      >
                        {q.category}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      "{q.question}"
                    </h4>
                  </div>

                  <div className="text-slate-400 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-slate-200 mt-1">
                    {/* Why Interviewer Asks */}
                    <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900 block mb-1">
                        Why the Hiring Manager Asks This:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {q.whyInterviewerAsks}
                      </p>
                    </div>

                    {/* Answer Strategy */}
                    <div className="bg-teal-50/70 p-3.5 rounded-lg border border-teal-200 text-xs">
                      <span className="font-bold text-teal-900 block mb-1">
                        Recommended Candidate Strategy:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {q.recommendedAnswerStrategy}
                      </p>
                    </div>

                    {/* STAR Framework Breakdown */}
                    {q.suggestedStarOutline && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
                          Suggested STAR Framework Outline:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="font-bold text-slate-500 text-[10px] uppercase block">
                              Situation:
                            </span>
                            <span className="text-slate-800">
                              {q.suggestedStarOutline.situation}
                            </span>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="font-bold text-slate-500 text-[10px] uppercase block">
                              Task:
                            </span>
                            <span className="text-slate-800">
                              {q.suggestedStarOutline.task}
                            </span>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="font-bold text-slate-500 text-[10px] uppercase block">
                              Action:
                            </span>
                            <span className="text-slate-800">
                              {q.suggestedStarOutline.action}
                            </span>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="font-bold text-slate-500 text-[10px] uppercase block">
                              Result:
                            </span>
                            <span className="text-slate-800">
                              {q.suggestedStarOutline.result}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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
