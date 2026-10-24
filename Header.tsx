import React from 'react';
import {
  FileCheck2,
  Sparkles,
  History,
  Printer,
  RotateCcw,
  BookOpenCheck,
  Edit3,
  Mail,
  HelpCircle,
  BarChart3,
  SlidersHorizontal,
  FileText,
  LogIn,
  LogOut,
  Shield,
  User as UserIcon,
  Home,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/samplePresets.ts';
import type { User } from '../types.ts';

interface HeaderProps {
  activeTab: 'analyzer' | 'keywords' | 'audits' | 'bulletImprover' | 'editor' | 'coverLetter' | 'interviewPrep';
  setActiveTab: (tab: 'analyzer' | 'keywords' | 'audits' | 'bulletImprover' | 'editor' | 'coverLetter' | 'interviewPrep') => void;
  onLoadPreset: (presetId: string) => void;
  onReset: () => void;
  onOpenHistory: () => void;
  onOpenProjectReport: () => void;
  onPrintReport: () => void;
  hasAnalysis: boolean;
  historyCount: number;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  onGoToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLoadPreset,
  onReset,
  onOpenHistory,
  onOpenProjectReport,
  onPrintReport,
  hasAnalysis,
  historyCount,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  isAdminOpen,
  onGoToHome,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-indigo-100/80 text-slate-900 print:hidden shadow-xs">
      {/* Top Colorful Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              if (onGoToHome) {
                onGoToHome();
              } else {
                setActiveTab('analyzer');
              }
            }}
            title="ResuMatch AI - Return to Homepage or ATS view"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/25 flex items-center justify-center transition group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 bg-clip-text text-transparent">
                  ResuMatch<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-black">AI</span>
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                  ATS Optimizer
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                AI Resume & Job Description Compatibility Checker
              </p>
            </div>
          </div>

          {/* Quick Preset Selector & Utility Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Return to Landing Page */}
            {onGoToHome && (
              <button
                type="button"
                onClick={onGoToHome}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition shadow-2xs"
                title="Return to Public Homepage"
              >
                <Home className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            {/* Sample Presets Dropdown */}
            <div className="relative group hidden sm:block">
              <button
                type="button"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 rounded-lg border border-amber-200 transition shadow-2xs"
                title="Load a pre-configured sample resume & job description"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Preset</span>
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white border border-indigo-100 rounded-xl shadow-xl py-2 hidden group-hover:block group-focus-within:block z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-indigo-900/60 uppercase tracking-wider border-b border-slate-100">
                  Load Pre-configured Sample
                </div>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLoadPreset(preset.id)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 text-slate-800 flex flex-col transition"
                  >
                    <span className="font-bold text-indigo-700">{preset.title}</span>
                    <span className="text-[11px] text-slate-500">{preset.companyName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* History Button (isolated to user when authenticated) */}
            <button
              onClick={onOpenHistory}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition shadow-2xs"
              title="View your saved past resume analyses"
            >
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] rounded-full font-bold shadow-2xs">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Project Report Showcase Button */}
            <button
              onClick={onOpenProjectReport}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-slate-100 to-indigo-50 hover:from-slate-200 hover:to-indigo-100 text-slate-700 rounded-lg border border-slate-200 transition"
              title="View full project report & architecture documentation"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Report</span>
            </button>

            {/* Print / Export Report Button */}
            {hasAnalysis && (
              <button
                onClick={onPrintReport}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white rounded-lg shadow-sm shadow-indigo-500/20 transition active:scale-[0.98]"
                title="Print or export complete ATS Audit Report as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            )}

            {/* AUTHENTICATION CONTROLS */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {/* User Profile Pill */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate hidden xl:inline">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] text-indigo-500 font-mono">
                    @{currentUser.username}
                  </span>
                </div>

                {/* Admin Dashboard Button (ONLY if role === 'admin') */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={onOpenAdmin}
                    className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-sm ${
                      isAdminOpen
                        ? 'bg-purple-700 text-white border-purple-800'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-purple-600'
                    }`}
                    title="Open Administrator Console"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign out of your account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-500/25 transition active:scale-[0.98]"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Reset all fields"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar border-t border-slate-100 py-2 text-xs">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'analyzer'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70'
            }`}
          >
            <BarChart3 className={`w-3.5 h-3.5 ${activeTab === 'analyzer' ? 'text-white' : 'text-indigo-600'}`} />
            <span>Score & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'keywords'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
            }`}
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${activeTab === 'keywords' ? 'text-white' : 'text-sky-600'}`} />
            <span>Keyword Gap Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('audits')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'audits'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25'
                : 'text-slate-600 hover:text-violet-700 hover:bg-violet-50/70'
            }`}
          >
            <BookOpenCheck className={`w-3.5 h-3.5 ${activeTab === 'audits' ? 'text-white' : 'text-violet-600'}`} />
            <span>Section Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('bulletImprover')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'bulletImprover'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/70'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'bulletImprover' ? 'text-white' : 'text-amber-500'}`} />
            <span>AI Bullet Optimizer</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'editor'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
            }`}
          >
            <Edit3 className={`w-3.5 h-3.5 ${activeTab === 'editor' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Live Resume Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('coverLetter')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'coverLetter'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/70'
            }`}
          >
            <Mail className={`w-3.5 h-3.5 ${activeTab === 'coverLetter' ? 'text-white' : 'text-blue-600'}`} />
            <span>Tailored Cover Letter</span>
          </button>

          <button
            onClick={() => setActiveTab('interviewPrep')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
              activeTab === 'interviewPrep'
                ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md shadow-fuchsia-500/25'
                : 'text-slate-600 hover:text-fuchsia-700 hover:bg-fuchsia-50/70'
            }`}
          >
            <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'interviewPrep' ? 'text-white' : 'text-fuchsia-600'}`} />
            <span>Targeted Interview Prep</span>
          </button>
        </div>
      </div>
    </header>
  );
};
