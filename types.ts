export interface KeywordItem {
  keyword: string;
  category: 'technical' | 'soft' | 'domain' | 'tool';
  inResumeCount?: number;
  importance: 'high' | 'medium' | 'low';
  recommendation?: string;
}

export interface SectionAudit {
  section: string;
  status: 'good' | 'warning' | 'critical';
  findings: string[];
  actionableRecommendations: string[];
}

export interface BulletCritique {
  originalBullet: string;
  issue: string;
  improvedBullet: string;
  whyItWorks: string;
}

export interface AnalysisScores {
  skillsMatch: number;
  experienceMatch: number;
  atsReadability: number;
  impactQuantification: number;
  keywordRelevance: number;
}

export interface JobRequirementsSummary {
  keyResponsibilities: string[];
  requiredSkills: string[];
  preferredQualifications: string[];
}

export interface ATSAnalysisResult {
  id?: string;
  timestamp?: number;
  jobTitle?: string;
  companyName?: string;
  overallScore: number;
  verdict: string;
  summary: string;
  scores: AnalysisScores;
  keywords: {
    matched: KeywordItem[];
    missing: KeywordItem[];
  };
  sectionAudits: SectionAudit[];
  bulletPointCritiques: BulletCritique[];
  topQuickWins: string[];
  strengths: string[];
  criticalGaps: string[];
  jobRequirementsSummary: JobRequirementsSummary;
  roastCommentary?: string;
  clicheBuzzwords?: Array<{
    word: string;
    whatItSoundsLike: string;
    betterAlternative: string;
  }>;
  sixSecondGlance?: {
    verdict: 'PASS' | 'BORDERLINE' | 'REJECT';
    takeaway: string;
    eyeCatchers: string[];
  };
  gamerStats?: {
    levelTitle: string;
    levelNumber: number;
    xpPoints: number;
    badgesUnlocked: string[];
  };
}

export interface TailoredBulletVariation {
  style: string;
  bullet: string;
  tagline: string;
  keywordsIncluded: string[];
}

export interface TailoredBulletsResult {
  variations: TailoredBulletVariation[];
  critique: string;
}

export interface CoverLetterResult {
  subjectLine: string;
  openingHook: string;
  coreAlignment: string;
  closingCallToAction: string;
  fullLetter: string;
  tailoredStrengthsHighlighted: string[];
}

export interface InterviewQuestionItem {
  question: string;
  category: string;
  whyInterviewerAsks: string;
  recommendedAnswerStrategy: string;
  suggestedStarOutline: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  companyName: string;
  experienceLevel: string;
  resumeText: string;
  jobDescription: string;
}
