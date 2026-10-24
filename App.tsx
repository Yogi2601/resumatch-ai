/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { InputSection } from './components/InputSection.tsx';
import { ScoreOverviewCard } from './components/ScoreOverviewCard.tsx';
import { KeywordsGapCard } from './components/KeywordsGapCard.tsx';
import { SectionAuditsView } from './components/SectionAuditsView.tsx';
import { BulletImproverTab } from './components/BulletImproverTab.tsx';
import { LiveResumeEditor } from './components/LiveResumeEditor.tsx';
import { CoverLetterGenerator } from './components/CoverLetterGenerator.tsx';
import { InterviewPrepView } from './components/InterviewPrepView.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { PrintReportView } from './components/PrintReportView.tsx';
import { SAMPLE_PRESETS } from './data/samplePresets.ts';
import type { ATSAnalysisResult } from './types.ts';
import {
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  CheckCircle2,
  FileCheck2,
  SlidersHorizontal,
  BookOpenCheck,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'resumatch_ai_history_v1';

export default function App() {
  // Pre-fill with the first sample preset so users see high-value immediate demo
  const initialPreset = SAMPLE_PRESETS[0];

  const [resumeText, setResumeText] = useState(initialPreset.resumeText);
  const [jobDescription, setJobDescription] = useState(initialPreset.jobDescription);
  const [jobTitle, setJobTitle] = useState(initialPreset.title);
  const [companyName, setCompanyName] = useState(initialPreset.companyName);
  const [experienceLevel, setExperienceLevel] = useState(initialPreset.experienceLevel);

  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'analyzer' | 'keywords' | 'audits' | 'bulletImprover' | 'editor' | 'coverLetter' | 'interviewPrep'
  >('analyzer');

  const [selectedBulletForOptimizer, setSelectedBulletForOptimizer] = useState<string>('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<ATSAnalysisResult[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistoryList(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Shared scan runner
  const runScan = async (
    rText: string,
    jdText: string,
    rTitle: string,
    rCompany: string,
    rLevel: string,
    saveHistory = true
  ) => {
    if (!rText.trim() || !jdText.trim()) {
      setError('Please provide both resume text and a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: rText,
          jobDescription: jdText,
          jobTitle: rTitle || 'Target Role',
          companyName: rCompany || 'Target Company',
          experienceLevel: rLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze resume. Please try again.');
      }

      const result: ATSAnalysisResult = await response.json();
      setAnalysis(result);

      if (saveHistory) {
        try {
          const itemToSave = {
            ...result,
            id: 'analysis-' + Date.now(),
            timestamp: Date.now(),
            jobTitle: rTitle || 'Target Role',
            companyName: rCompany || 'Company',
          };
          setHistoryList((prev) => {
            const updated = [itemToSave, ...prev.slice(0, 19)];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        } catch (e) {
          console.error('Failed to save analysis to history', e);
        }
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial scan on first mount so all tabs and scores are live immediately
  useEffect(() => {
    runScan(
      initialPreset.resumeText,
      initialPreset.jobDescription,
      initialPreset.title,
      initialPreset.companyName,
      initialPreset.experienceLevel,
      false
    );
  }, []);

  const handleClearHistory = () => {
    setHistoryList([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = historyList.filter((item) => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSelectHistoryItem = (item: ATSAnalysisResult) => {
    setAnalysis(item);
    if (item.jobTitle) setJobTitle(item.jobTitle);
    if (item.companyName) setCompanyName(item.companyName);
    setActiveTab('analyzer');
  };

  // Perform full ATS match analysis from current form values
  const handleAnalyze = () => {
    runScan(resumeText, jobDescription, jobTitle, companyName, experienceLevel, true);
  };

  const handleLoadPreset = (presetId: string) => {
    const found = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setResumeText(found.resumeText);
      setJobDescription(found.jobDescription);
      setJobTitle(found.title);
      setCompanyName(found.companyName);
      setExperienceLevel(found.experienceLevel);
      setError(null);
      setActiveTab('analyzer');
      // Automatically scan the newly selected preset
      runScan(found.resumeText, found.jobDescription, found.title, found.companyName, found.experienceLevel, true);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setJobDescription('');
    setJobTitle('');
    setCompanyName('');
    setAnalysis(null);
    setError(null);
    setActiveTab('analyzer');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleOptimizeBullet = (bullet: string) => {
    setSelectedBulletForOptimizer(bullet);
    setActiveTab('bulletImprover');
  };

  const handleApplyBulletToResume = (bullet: string) => {
    setResumeText((prev) => prev + `\n• ${bullet}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-slate-50 to-violet-50/40 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative">
      {/* Ambient background colorful light blooms */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/15 via-indigo-300/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-teal-300/15 via-emerald-300/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Printable Report View (Visible only during window.print) */}
      <PrintReportView
        analysis={analysis}
        jobTitle={jobTitle}
        companyName={companyName}
        experienceLevel={experienceLevel}
      />

      {/* Interactive Web App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadPreset={handleLoadPreset}
        onReset={handleReset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onPrintReport={handlePrintReport}
        hasAnalysis={!!analysis}
        historyCount={historyList.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 print:hidden">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 font-medium">
              <span className="font-bold block text-rose-900">Analysis Notice:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-700 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Form Section (Always accessible) */}
        <InputSection
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          companyName={companyName}
          setCompanyName={setCompanyName}
          experienceLevel={experienceLevel}
          setExperienceLevel={setExperienceLevel}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onLoadPreset={handleLoadPreset}
        />

        {/* Active Tab View */}
        <div className="mt-8">
          {/* Tab 1: Analyzer & Score Overview */}
          {activeTab === 'analyzer' && (
            <div>
              {analysis ? (
                <ScoreOverviewCard
                  analysis={analysis}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              ) : (
                <div className="bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/30 rounded-2xl border-2 border-dashed border-indigo-200 p-12 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/25">
                    <FileCheck2 className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-slate-900">
                      Ready for ATS Compatibility Scan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium mb-3">
                      Extract keyword matches, calculate parsing compliance, and unlock tailored optimizations.
                    </p>
                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                    >
                      {isLoading ? 'Scanning...' : 'Run ATS Match Analysis Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Keyword Gap Matrix */}
          {activeTab === 'keywords' && (
            <div>
              {analysis ? (
                <KeywordsGapCard
                  matchedKeywords={analysis.keywords.matched}
                  missingKeywords={analysis.keywords.missing}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-sky-300 p-12 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-200">
                    <SlidersHorizontal className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-base font-bold text-slate-900">
                      Keyword Gap Matrix
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 mb-3">
                      Run an ATS scan to see all matched technical skills, missing critical keywords, and placement suggestions.
                    </p>
                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                    >
                      {isLoading ? 'Scanning...' : 'Run ATS Analysis to View Matrix'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Section-by-Section Audits */}
          {activeTab === 'audits' && (
            <div>
              {analysis ? (
                <SectionAuditsView
                  sectionAudits={analysis.sectionAudits}
                  bulletCritiques={analysis.bulletPointCritiques}
                  onOptimizeBullet={handleOptimizeBullet}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-violet-300 p-12 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto border border-violet-200">
                    <BookOpenCheck className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto">
                    <h3 className="text-base font-bold text-slate-900">
                      Section-by-Section ATS Audit
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 mb-3">
                      Inspect your Professional Summary, Work History, Skills, and Education sections against ATS standards.
                    </p>
                    <button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                    >
                      {isLoading ? 'Scanning...' : 'Run ATS Analysis to Inspect Sections'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: AI Bullet Optimizer */}
          {activeTab === 'bulletImprover' && (
            <BulletImproverTab
              initialBullet={selectedBulletForOptimizer}
              jobDescription={jobDescription}
              jobTitle={jobTitle}
              onApplyBulletToResume={handleApplyBulletToResume}
            />
          )}

          {/* Tab 5: Live Resume Editor */}
          {activeTab === 'editor' && (
            <LiveResumeEditor
              resumeText={resumeText}
              setResumeText={setResumeText}
              analysis={analysis}
              onReAnalyze={handleAnalyze}
              isAnalyzing={isLoading}
            />
          )}

          {/* Tab 6: Tailored Cover Letter */}
          {activeTab === 'coverLetter' && (
            <CoverLetterGenerator
              resumeText={resumeText}
              jobDescription={jobDescription}
              jobTitle={jobTitle}
              companyName={companyName}
            />
          )}

          {/* Tab 7: Targeted Interview Prep */}
          {activeTab === 'interviewPrep' && (
            <InterviewPrepView
              resumeText={resumeText}
              jobDescription={jobDescription}
              jobTitle={jobTitle}
            />
          )}
        </div>

        {/* Informational Guidance Footer on ATS Algorithms */}
        <div className="mt-14 pt-8 border-t border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          <div className="space-y-2 bg-gradient-to-br from-emerald-50/60 to-white p-5 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Tested Against Top ATS Engines</span>
            </div>
            <p className="leading-relaxed font-medium">
              Designed to pass parsing filters used by Workday, Greenhouse, Lever, Taleo, iCIMS, and Ashby without layout rejection.
            </p>
          </div>

          <div className="space-y-2 bg-gradient-to-br from-amber-50/60 to-white p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span>Google XYZ Formula Standard</span>
            </div>
            <p className="leading-relaxed font-medium">
              Enforces the gold-standard achievement syntax: "Accomplished [X], as measured by [Y], by doing [Z]" with verifiable scale metrics.
            </p>
          </div>

          <div className="space-y-2 bg-gradient-to-br from-indigo-50/60 to-white p-5 rounded-2xl border border-indigo-200/80 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span>Zero-Fluff Semantic Match</span>
            </div>
            <p className="leading-relaxed font-medium">
              Identifies true domain competencies and hard skills rather than penalizing for harmless grammatical variations.
            </p>
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onSelectAnalysis={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />
    </div>
  );
}
