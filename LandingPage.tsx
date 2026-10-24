import React from 'react';
import {
  FileCheck2,
  Sparkles,
  SlidersHorizontal,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Target,
  BarChart3,
  Edit3,
  Mail,
  HelpCircle,
  Lock,
  Award,
  History,
  Clock,
  ChevronRight,
  LogIn,
  UserPlus,
  Building,
  Check,
} from 'lucide-react';
import type { User } from '../types.ts';

interface LandingPageProps {
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onGoToDashboard: () => void;
  onOpenProjectReport?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onOpenAuth,
  onGoToDashboard,
  onOpenProjectReport,
}) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* 1. PUBLIC NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Subtle Top Accent Line */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 bg-clip-text text-transparent">
                    ResuMatch<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent font-black">AI</span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                    ATS Engine
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-indigo-600 transition"
              >
                Home
              </a>
              <a href="#features" className="hover:text-indigo-600 transition">Features</a>
              <a href="#about" className="hover:text-indigo-600 transition">About</a>
              <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
            </nav>

            {/* Authentication Buttons & Dashboard CTA */}
            <div className="flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                    Signed in as <strong className="text-indigo-600">@{currentUser.username}</strong>
                  </span>
                  <button
                    onClick={onGoToDashboard}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/25 transition active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>

                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/25 transition active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up Free</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-indigo-50/60 via-white to-purple-50/30">
        {/* Decorative background light blooms */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-indigo-200/25 via-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-200/80 shadow-2xs mb-6 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-Powered Applicant Tracking System Simulator</span>
          </div>

          {/* Hero Heading (Exact User Instruction) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Land Your Dream Job with an{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ATS-Ready Resume.
            </span>
          </h1>

          {/* Short Description (Exact User Instruction) */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            ResuMatch AI compares your resume directly with target job descriptions, calculates a multi-dimensional ATS compatibility score, identifies critical missing keywords, and provides actionable improvement suggestions.
          </p>

          {/* Prominent Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            {currentUser ? (
              <button
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-500/30 transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Go to ATS Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-500/30 transition active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Get Started Free</span>
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base rounded-2xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>

          {/* Social Proof & Quantitative Strip */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-indigo-600">88%</span>
              <p className="text-xs text-slate-600 font-medium">Average Match Target</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-600">94.6%</span>
              <p className="text-xs text-slate-600 font-medium">Parsing Accuracy</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-purple-600">XYZ</span>
              <p className="text-xs text-slate-600 font-medium">Google Formula Standard</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-blue-600">&lt; 3 sec</span>
              <p className="text-xs text-slate-600 font-medium">Instant AI Analysis</p>
            </div>
          </div>

          {/* Interactive Visual Dashboard Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-indigo-200/50 via-purple-200/30 to-slate-200/50 shadow-2xl">
            <div className="bg-white rounded-[22px] border border-slate-200 p-6 sm:p-8 text-left space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl border border-emerald-300">
                    88%
                  </div>
                  <div>
                    <span className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider">
                      Verified ATS Pass Rate
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Strong Contender with High ATS Alignment
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full">
                    Ready to Apply
                  </span>
                  <button
                    onClick={onGoToDashboard}
                    className="text-xs font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition flex items-center gap-1"
                  >
                    <span>Try In Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 5 Dimension Progress Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block">Hard Skills</span>
                  <span className="text-base font-black text-blue-600">85%</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-blue-600 h-full w-[85%]" />
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block">Experience Fit</span>
                  <span className="text-base font-black text-indigo-600">90%</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-indigo-600 h-full w-[90%]" />
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block">Readability</span>
                  <span className="text-base font-black text-emerald-600">95%</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-600 h-full w-[95%]" />
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block">Metrics & Impact</span>
                  <span className="text-base font-black text-amber-600">82%</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-amber-600 h-full w-[82%]" />
                  </div>
                </div>
              </div>

              {/* Sample Keywords Matched */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-500">Sample Keyword Extraction:</span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> TypeScript
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> React 18
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Node.js
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-300 font-bold flex items-center gap-1">
                  <span className="text-rose-600 font-black">+</span> Docker (Missing)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE FEATURE CARDS (Exact User Instruction) */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">
              Powerful Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Everything You Need to Bypass Automated Screening
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
              Built specifically to align candidate qualifications with the algorithmic parsers used by Fortune 500 recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1: ATS Score Analysis */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 mb-4">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  ATS Score Analysis
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  Calculates a multi-dimensional 0–100% compatibility rating benchmarked across Hard Skills, Seniority Fit, Readability, and Impact Quantification.
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Real-world recruiter verdicts</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>5-dimensional breakdown</span>
                </li>
              </ul>
            </div>

            {/* Feature Card 2: Keyword Gap Detection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-sky-300 transition space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-600 text-white flex items-center justify-center shadow-md shadow-sky-500/25 mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Keyword Gap Detection
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  Extracts verified terms from the target job description and highlights critical missing technical, tool, and domain competencies you forgot to include.
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Categorized skill matrix</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Specific placement advice</span>
                </li>
              </ul>
            </div>

            {/* Feature Card 3: AI Resume Optimization */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  AI Resume Optimization
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  Upgrades weak, passive bullet points using Google's XYZ formula (*Accomplished [X], as measured by [Y], by doing [Z]*) and generates tailored cover letters.
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Google XYZ formula rewrites</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Live interactive resume editor</span>
                </li>
              </ul>
            </div>

            {/* Feature Card 4: Resume History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 mb-4">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Resume History
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  Securely preserves your past scans and optimized resumes under your private account so you can track score progression across applications over time.
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Private isolated account records</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Boardroom-ready PDF exports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              From Job Description to Interview Ready in Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Paste or Upload</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Paste your current resume and the target job description, or upload your resume as PDF/TXT.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Run Compatibility Scan</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Gemini 3.8 Flash and our algorithmic parser analyze match percentage, keyword gaps, and weak bullet points.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Optimize & Re-Score</h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Add missing keywords in the live editor, apply Google XYZ rewrites, and re-score until your ATS rating hits 85%+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="about" className="py-16 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-300">
                Why ATS Compatibility Matters
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Recruiters Don't Read Every Resume. Software Does.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                When you apply to jobs on LinkedIn, Indeed, or career portals, your resume is first evaluated by an Applicant Tracking System (Workday, Greenhouse, Lever). If your resume does not explicitly contain the target skills and metrics, it is ranked at the bottom and never reviewed.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                ResuMatch AI acts as your pre-submission filter, giving you the exact diagnostic report a recruiter's ATS dashboard would show.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Tested Against Top Recruiting Systems</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-200 font-medium">
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">✓ Workday ATS Parser</div>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">✓ Greenhouse Software</div>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">✓ Lever Recruiting</div>
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">✓ Taleo & iCIMS Filter</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ready to Build an ATS-Optimized Resume?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
            Join thousands of candidates who improved their resume compatibility score and increased their recruiter callback rates.
          </p>

          <div className="pt-2">
            {currentUser ? (
              <button
                onClick={onGoToDashboard}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-500/25 transition active:scale-[0.99] inline-flex items-center gap-2"
              >
                <span>Launch ATS Checker Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-500/25 transition active:scale-[0.99] inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Get Started Free — Scan Your Resume</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 7. SIMPLE FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-slate-900">
              ResuMatch<span className="text-indigo-600">AI</span>
            </span>
            <span>·</span>
            <span>Applicant Tracking System Simulator & Career Optimizer</span>
          </div>

          <div className="flex items-center space-x-6 font-semibold">
            <a href="#features" className="hover:text-slate-900 transition">Features</a>
            <a href="#about" className="hover:text-slate-900 transition">About</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition">How It Works</a>
            {currentUser ? (
              <button onClick={onGoToDashboard} className="text-indigo-600 font-bold hover:underline">
                Dashboard
              </button>
            ) : (
              <button onClick={() => onOpenAuth('login')} className="text-indigo-600 font-bold hover:underline">
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-200/60 text-center text-slate-400">
          © {new Date().getFullYear()} ResuMatch AI. All rights reserved. Powered by Google Gemini 3.8 Flash.
        </div>
      </footer>
    </div>
  );
};
