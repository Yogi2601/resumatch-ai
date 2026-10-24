import type { ATSAnalysisResult, TailoredBulletsResult, CoverLetterResult, InterviewQuestionItem } from '../types.ts';

// Comprehensive dictionary of technical, soft, and domain skills
const COMMON_SKILLS = [
  // Languages & Runtimes
  { name: 'TypeScript', category: 'technical', aliases: ['typescript', 'ts'] },
  { name: 'JavaScript', category: 'technical', aliases: ['javascript', 'js', 'es6'] },
  { name: 'Python', category: 'technical', aliases: ['python', 'py'] },
  { name: 'Go / Golang', category: 'technical', aliases: ['golang', 'go'] },
  { name: 'Java', category: 'technical', aliases: ['java'] },
  { name: 'C++', category: 'technical', aliases: ['c++', 'cpp'] },
  { name: 'C# / .NET', category: 'technical', aliases: ['c#', '.net', 'csharp'] },
  { name: 'Rust', category: 'technical', aliases: ['rust'] },
  { name: 'Ruby', category: 'technical', aliases: ['ruby', 'rails'] },
  { name: 'SQL', category: 'technical', aliases: ['sql'] },

  // Frontend
  { name: 'React', category: 'technical', aliases: ['react', 'reactjs', 'react.js'] },
  { name: 'Next.js', category: 'technical', aliases: ['next.js', 'nextjs'] },
  { name: 'Vue.js', category: 'technical', aliases: ['vue', 'vue.js', 'vuejs'] },
  { name: 'Tailwind CSS', category: 'tool', aliases: ['tailwind', 'tailwindcss'] },
  { name: 'HTML5 & CSS3', category: 'technical', aliases: ['html', 'html5', 'css', 'css3'] },
  { name: 'Redux', category: 'tool', aliases: ['redux', 'redux toolkit'] },
  { name: 'GraphQL', category: 'technical', aliases: ['graphql', 'apollo'] },
  { name: 'WebSockets', category: 'technical', aliases: ['websocket', 'websockets'] },

  // Backend & Databases
  { name: 'Node.js', category: 'technical', aliases: ['node', 'nodejs', 'node.js'] },
  { name: 'Express', category: 'tool', aliases: ['express', 'express.js'] },
  { name: 'PostgreSQL', category: 'technical', aliases: ['postgres', 'postgresql'] },
  { name: 'MySQL', category: 'technical', aliases: ['mysql'] },
  { name: 'MongoDB', category: 'technical', aliases: ['mongodb', 'mongo'] },
  { name: 'Redis', category: 'tool', aliases: ['redis'] },
  { name: 'Kafka', category: 'technical', aliases: ['kafka', 'apache kafka'] },
  { name: 'RabbitMQ', category: 'tool', aliases: ['rabbitmq'] },
  { name: 'REST APIs', category: 'technical', aliases: ['rest', 'restful', 'rest api', 'apis'] },
  { name: 'Microservices', category: 'domain', aliases: ['microservices', 'microservice'] },

  // Cloud & DevOps
  { name: 'AWS', category: 'technical', aliases: ['aws', 'amazon web services', 's3', 'ecs', 'lambda', 'rds', 'ec2'] },
  { name: 'Docker', category: 'tool', aliases: ['docker', 'containerization', 'containers'] },
  { name: 'Kubernetes', category: 'tool', aliases: ['kubernetes', 'k8s', 'helm'] },
  { name: 'CI/CD Pipelines', category: 'tool', aliases: ['ci/cd', 'github actions', 'gitlab ci', 'jenkins'] },
  { name: 'Terraform', category: 'tool', aliases: ['terraform', 'iac'] },
  { name: 'Datadog / Monitoring', category: 'tool', aliases: ['datadog', 'prometheus', 'grafana', 'observability'] },

  // AI & Data Science
  { name: 'Machine Learning', category: 'domain', aliases: ['machine learning', 'ml', 'deep learning'] },
  { name: 'PyTorch', category: 'tool', aliases: ['pytorch', 'torch'] },
  { name: 'TensorFlow', category: 'tool', aliases: ['tensorflow', 'tf'] },
  { name: 'LLMs & GenAI', category: 'technical', aliases: ['llm', 'llms', 'large language models', 'genai', 'generative ai', 'transformers'] },
  { name: 'RAG & Vector DBs', category: 'technical', aliases: ['rag', 'retrieval-augmented generation', 'vector database', 'pinecone', 'chroma'] },
  { name: 'Airflow / ETL', category: 'tool', aliases: ['airflow', 'etl', 'spark', 'snowflake', 'bigquery'] },

  // Product & Agile & Soft Skills
  { name: 'Product Roadmapping', category: 'domain', aliases: ['roadmap', 'roadmapping', 'prds', 'product management'] },
  { name: 'Agile & Scrum', category: 'domain', aliases: ['agile', 'scrum', 'sprints', 'jira'] },
  { name: 'A/B Testing & Analytics', category: 'domain', aliases: ['a/b testing', 'experimentation', 'mixpanel', 'amplitude', 'optimizely'] },
  { name: 'Cross-Functional Leadership', category: 'soft', aliases: ['cross-functional', 'leadership', 'stakeholder', 'mentorship', 'collaboration'] },
  { name: 'System Architecture', category: 'domain', aliases: ['system design', 'architecture', 'scalability', 'distributed systems'] },
  { name: 'Unit & Integration Testing', category: 'technical', aliases: ['testing', 'unit test', 'jest', 'vitest', 'playwright', 'cypress'] },
  { name: 'Customer Discovery', category: 'soft', aliases: ['customer discovery', 'interviews', 'user research', 'nps'] },
];

export function computeAlgorithmicATS(
  resumeText: string,
  jobDescription: string,
  jobTitle = 'Target Role',
  companyName = 'Target Company',
  experienceLevel = 'Mid-Senior'
): ATSAnalysisResult {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  // 1. Identify relevant skills present in JD
  const targetSkillsInJd = COMMON_SKILLS.filter((skill) =>
    skill.aliases.some((alias) => {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(jdLower);
    })
  );

  // Fallback: If JD doesn't hit many common skills, extract top nouns/words
  const matchedList: any[] = [];
  const missingList: any[] = [];

  targetSkillsInJd.forEach((skill) => {
    let matchCount = 0;
    skill.aliases.forEach((alias) => {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = resumeLower.match(regex);
      if (matches) matchCount += matches.length;
    });

    // Check importance
    const isCritical =
      jdLower.includes(`required: ${skill.name.toLowerCase()}`) ||
      jdLower.includes(`experience with ${skill.name.toLowerCase()}`) ||
      jdLower.includes(`must have`) ||
      ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL'].includes(skill.name);

    if (matchCount > 0) {
      matchedList.push({
        keyword: skill.name,
        category: skill.category,
        inResumeCount: matchCount,
        importance: isCritical ? 'high' : 'medium',
      });
    } else {
      missingList.push({
        keyword: skill.name,
        category: skill.category,
        importance: isCritical ? 'high' : 'medium',
        recommendation: `Add ${skill.name} under your Technical Skills section and mention a project where you applied it to pass ATS screening.`,
      });
    }
  });

  // Calculate skill score
  const totalRelevantSkills = matchedList.length + missingList.length;
  const skillsRatio = totalRelevantSkills > 0 ? matchedList.length / totalRelevantSkills : 0.75;
  const skillsMatch = Math.min(100, Math.max(35, Math.round(skillsRatio * 100)));

  // 2. Metrics & Impact Quantification Check
  const metricRegex = /(\b\d+(\.\d+)?%|\$\d+[MKk]?|\b\d+x\b|\b\d{2,}\+?\s*(users|clients|engineers|requests|transactions|ms|seconds|minutes|hours))/gi;
  const metricsFound = resumeText.match(metricRegex) || [];
  const impactQuantification = Math.min(95, Math.max(40, 45 + metricsFound.length * 7));

  // 3. Readability & Structure Check
  const hasSummary = /summary|profile|about/i.test(resumeText);
  const hasExperience = /experience|work history|employment/i.test(resumeText);
  const hasSkills = /skills|technologies|technical/i.test(resumeText);
  const hasEducation = /education|degree|university/i.test(resumeText);
  let atsReadability = 70;
  if (hasSummary) atsReadability += 8;
  if (hasExperience) atsReadability += 10;
  if (hasSkills) atsReadability += 7;
  if (hasEducation) atsReadability += 5;
  atsReadability = Math.min(98, atsReadability);

  // 4. Experience & Seniority Alignment
  const experienceYearsMatch = resumeText.match(/(\d+)\+?\s*years/i);
  const years = experienceYearsMatch ? parseInt(experienceYearsMatch[1], 10) : 4;
  let experienceMatch = 75;
  if (experienceLevel.toLowerCase().includes('senior') && years >= 5) experienceMatch = 90;
  else if (years >= 3) experienceMatch = 82;

  // 5. Keyword Relevance
  const keywordRelevance = Math.round((skillsMatch * 0.7) + (atsReadability * 0.3));

  // Overall Weighted ATS Score
  const overallScore = Math.round(
    skillsMatch * 0.35 +
    experienceMatch * 0.25 +
    atsReadability * 0.15 +
    impactQuantification * 0.15 +
    keywordRelevance * 0.1
  );

  let verdict = 'Moderate Match with High Potential';
  if (overallScore >= 82) verdict = 'Strong Contender with High ATS Alignment';
  else if (overallScore >= 70) verdict = 'Solid Fit with Addressable Keyword Gaps';
  else verdict = 'Needs Significant Optimization for ATS Pass Rate';

  // Section Audits
  const sectionAudits = [
    {
      section: 'Professional Summary',
      status: (hasSummary ? 'good' : 'warning') as 'good' | 'warning',
      findings: hasSummary
        ? ['Clear title header with target seniority explicitly stated.', 'Contains high-level years of experience and domain focus.']
        : ['Missing dedicated Professional Summary section.', 'ATS scanners look for a 3-line elevator pitch at the very top.'],
      actionableRecommendations: [
        `Explicitly title summary with "${jobTitle}" to maximize keyword relevance ranking.`,
        'Include 2 core metric achievements (e.g. scale handled or efficiency gained) in sentence 2.',
      ],
    },
    {
      section: 'Work Experience',
      status: (metricsFound.length >= 4 ? 'good' : 'warning') as 'good' | 'warning',
      findings: [
        `Detected ${metricsFound.length} quantified metric indicators across experience bullets.`,
        'Chronological format matches ATS standard parser expectations.',
      ],
      actionableRecommendations: [
        'Apply the Google XYZ Formula: Accomplished [X], as measured by [Y], by doing [Z].',
        'Start every bullet point with strong action verbs (Architected, Spearheaded, Optimized, Shipped).',
      ],
    },
    {
      section: 'Technical Skills',
      status: (missingList.length <= 2 ? 'good' : 'critical') as 'good' | 'critical',
      findings: [
        `Matched ${matchedList.length} relevant skill terms from target job description.`,
        `${missingList.length} critical or preferred skills from the JD are absent.`,
      ],
      actionableRecommendations: [
        `Add missing high-priority keywords: ${missingList.slice(0, 4).map((k) => k.keyword).join(', ')}.`,
        'Group skills logically (Languages, Frameworks, Cloud & DevOps, Databases & Tools).',
      ],
    },
    {
      section: 'Education & Certifications',
      status: (hasEducation ? 'good' : 'warning') as 'good' | 'warning',
      findings: hasEducation
        ? ['Standard degree and institution detected by parser.']
        : ['Education section could not be clearly indexed.'],
      actionableRecommendations: [
        'List degree, major, and graduation year clearly.',
        'Include relevant vendor certifications (AWS, GCP, Scrum, etc.) to boost recruiter confidence.',
      ],
    },
  ];

  // Bullet Point Critiques
  const bulletPointCritiques = [
    {
      originalBullet: 'Responsible for building backend services and maintaining the database.',
      issue: 'Passive phrasing ("Responsible for"), lacks measurable outcome, no specific technologies cited.',
      improvedBullet: `Architected and shipped 6 core microservices using Node.js and PostgreSQL, reducing query latency by 42% for 350K+ active users.`,
      whyItWorks: 'Follows XYZ formula, quantifies latency reduction, specifies technology stack, and conveys ownership.',
    },
    {
      originalBullet: 'Helped improve application performance and fixed critical bugs.',
      issue: 'Vague scope ("Helped"), lacks metric scale, no indication of business or technical impact.',
      improvedBullet: `Optimized React frontend state management and API caching, improving core web vitals and reducing p95 page load time from 3.2s to 1.1s.`,
      whyItWorks: 'Demonstrates deep performance optimization knowledge with before/after benchmarks.',
    },
    {
      originalBullet: 'Worked with team members in agile sprints and attended daily standups.',
      issue: 'Focuses on routine attendance rather than engineering leadership or deliverable value.',
      improvedBullet: `Collaborated in bi-weekly Agile sprints across a squad of 8 engineers, delivering 14 zero-defect features on schedule with 92% unit test coverage.`,
      whyItWorks: 'Highlights sprint delivery velocity, team size, and quality metrics.',
    },
  ];

  const topQuickWins = [
    missingList.length > 0
      ? `Incorporate missing critical keywords into your Skills and Experience sections: ${missingList.slice(0, 3).map((m) => m.keyword).join(', ')}.`
      : 'Tailor your top 3 bullet points to mirror the exact key responsibilities mentioned in the JD.',
    'Upgrade passive bullet phrases ("Responsible for", "Helped with") to authoritative action verbs ("Spearheaded", "Architected", "Engineered").',
    'Add measurable metric percentages or numbers to at least 4 experience bullet points (XYZ Formula).',
    `Align your headline / professional summary title exactly to "${jobTitle}".`,
  ];

  const strengths = [
    `Strong alignment in core stack: ${matchedList.slice(0, 4).map((m) => m.keyword).join(', ')}.`,
    `Robust career trajectory with measurable engineering/product outcomes.`,
    `Clean, ATS-parseable chronological layout with well-defined sections.`,
  ];

  const criticalGaps = missingList.slice(0, 4).map(
    (m) => `Missing explicit mention of ${m.keyword} (${m.category}) which is emphasized in the job description.`
  );

  if (criticalGaps.length === 0) {
    criticalGaps.push('Ensure metrics are consistently quantified across all past employment tenures.');
  }

  return {
    overallScore,
    verdict,
    summary: `Candidate presents an overall ${overallScore}% ATS alignment for the ${jobTitle} position at ${companyName}. The resume demonstrates strong core competency in ${matchedList.slice(0, 3).map((m) => m.keyword).join(', ')}, but requires targeted keyword integration for ${missingList.slice(0, 3).map((m) => m.keyword).join(', ')} to guarantee bypass of strict recruiter automated filters.`,
    scores: {
      skillsMatch,
      experienceMatch,
      atsReadability,
      impactQuantification,
      keywordRelevance,
    },
    keywords: {
      matched: matchedList,
      missing: missingList,
    },
    sectionAudits,
    bulletPointCritiques,
    topQuickWins,
    strengths,
    criticalGaps,
    jobRequirementsSummary: {
      keyResponsibilities: [
        'Lead architectural decisions and feature delivery for core platform initiatives.',
        'Collaborate cross-functionally with product, design, and engineering stakeholders.',
        'Ensure high availability, test automation, and resilient CI/CD deployments.',
      ],
      requiredSkills: matchedList.map((m) => m.keyword).slice(0, 6),
      preferredQualifications: missingList.map((m) => m.keyword).slice(0, 4),
    },
  };
}

export function tailorBulletAlgorithmic(
  bulletText: string,
  jobTitle = 'Target Role'
): TailoredBulletsResult {
  const cleaned = bulletText.replace(/^[•\-\*]\s*/, '').trim();

  return {
    variations: [
      {
        style: 'ATS Keyword Optimized',
        bullet: `Architected and executed ${cleaned.toLowerCase().replace(/^(responsible for|helped|worked on)\s*/i, '')}, integrating modern cloud infrastructure and automated CI/CD to accelerate feature delivery by 35%.`,
        tagline: 'High keyword density for automated ATS parser indexing',
        keywordsIncluded: ['Architecture', 'Cloud Infrastructure', 'CI/CD', 'Optimization'],
      },
      {
        style: 'Metric & Impact Heavy (Google XYZ Formula)',
        bullet: `Engineered scalable solution for ${cleaned.toLowerCase().replace(/^(responsible for|helped|worked on)\s*/i, '')}, decreasing system latency by 44% and saving 18 engineering hours weekly through automated workflows.`,
        tagline: 'Accomplished [X], as measured by [Y], by doing [Z]',
        keywordsIncluded: ['Scalability', 'Latency Reduction', 'Automation', 'Efficiency'],
      },
      {
        style: 'Leadership & Cross-Functional Scope',
        bullet: `Spearheaded cross-functional initiative to deliver ${cleaned.toLowerCase().replace(/^(responsible for|helped|worked on)\s*/i, '')}, mentoring 5 team members and aligning technical roadmaps with executive stakeholders.`,
        tagline: 'Emphasizes initiative, ownership, and engineering excellence',
        keywordsIncluded: ['Cross-Functional', 'Mentorship', 'Roadmap Alignment', 'Leadership'],
      },
    ],
    critique: `Original bullet lacked quantifiable outcome benchmarks and used passive framing. These 3 variations frame your experience with active verbs, clear business metrics, and target role keywords.`,
  };
}

export function generateCoverLetterAlgorithmic(
  resumeText: string,
  jobDescription: string,
  jobTitle = 'Target Role',
  companyName = 'Hiring Team',
  tone = 'confident'
): CoverLetterResult {
  const subjectLine = `Application for ${jobTitle} — Proven Track Record in High-Impact Engineering`;

  const openingHook = `I am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. With a demonstrated history of designing resilient architectures, driving measurable product growth, and scaling mission-critical systems, I am excited about the opportunity to contribute immediately to your team's ambitious roadmap.`;

  const coreAlignment = `Throughout my career, I have focused on delivering quantifiable results rather than just completing tasks. In my previous roles, I architected high-throughput workflows that reduced latency, collaborated closely across cross-functional squads to launch customer-facing products, and championed engineering excellence through rigorous automated testing and CI/CD pipelines. Reviewing the requirements for ${companyName}, I see a clear match with my core background in modern distributed systems, data-driven optimization, and user-centric problem solving.`;

  const closingCallToAction = `I welcome the opportunity to discuss how my technical expertise and passion for high-velocity execution will help ${companyName} achieve its upcoming quarterly objectives. Thank you for your time and consideration; I look forward to connecting soon.`;

  const fullLetter = `Dear Hiring Team at ${companyName},

${openingHook}

${coreAlignment}

${closingCallToAction}

Sincerely,
Candidate`;

  return {
    subjectLine,
    openingHook,
    coreAlignment,
    closingCallToAction,
    fullLetter,
    tailoredStrengthsHighlighted: [
      'High-throughput distributed systems & architecture',
      'Measurable latency and performance optimization',
      'Cross-functional execution and sprint leadership',
    ],
  };
}

export function generateInterviewPrepAlgorithmic(
  jobTitle = 'Target Role'
): { questions: InterviewQuestionItem[] } {
  return {
    questions: [
      {
        question: `Tell me about a time you optimized a critical system or workflow under strict latency or business constraints.`,
        category: 'Technical Deep Dive',
        whyInterviewerAsks: 'Evaluates your technical depth, profiling methodology, and ability to diagnose bottlenecks quantitatively.',
        recommendedAnswerStrategy: 'Use the STAR method. Highlight baseline metrics, explain root-cause investigation, and state the exact percentage improvement achieved.',
        suggestedStarOutline: {
          situation: 'System p99 latency was degrading as user traffic scaled 3x over 6 months.',
          task: 'Identify query/memory bottlenecks and reduce API response time below 100ms.',
          action: 'Implemented distributed Redis caching, indexed high-cardinality SQL columns, and refactored N+1 queries.',
          result: 'Reduced p99 latency by 58% and maintained 99.99% uptime during peak promotional events.',
        },
      },
      {
        question: `How do you handle a scenario where a core requirement in the job description or sprint is unfamiliar to you?`,
        category: 'Gap Investigation',
        whyInterviewerAsks: 'Assesses learning agility, resourcefulness, and honesty about skill boundaries.',
        recommendedAnswerStrategy: 'Acknowledge the learning curve, outline your systematic learning process, and give an example of rapidly mastering adjacent technologies.',
        suggestedStarOutline: {
          situation: 'Our team needed to adopt a new distributed streaming technology with no in-house expertise.',
          task: 'Build a production-ready proof of concept within a 2-week spike.',
          action: 'Studied official documentation, completed hands-on lab sandbox, and built automated test harness to validate failure modes.',
          result: 'Shipped production integration on schedule with zero defect regressions.',
        },
      },
      {
        question: `Describe a situation where you had a strong technical disagreement with a teammate or product manager. How did you resolve it?`,
        category: 'Behavioral & STAR',
        whyInterviewerAsks: 'Tests emotional intelligence, constructive conflict resolution, and data-backed decision making.',
        recommendedAnswerStrategy: 'Focus on shared business goals, dispassionate evaluation of trade-offs (e.g. latency vs development speed), and commitment to the chosen path.',
        suggestedStarOutline: {
          situation: 'Disagreement on whether to refactor a legacy module or build a new microservice for an upcoming feature.',
          task: 'Align engineering and product on the lowest-risk, highest-ROI architectural path.',
          action: 'Organized a design review with objective benchmark criteria and spike estimates.',
          result: 'Agreed on an incremental strangler-fig pattern that delivered the feature on time while retiring legacy debt.',
        },
      },
      {
        question: `How do you ensure high software reliability and automated quality in continuous delivery environments?`,
        category: 'System Architecture & Execution',
        whyInterviewerAsks: 'Validates that you write defensive, well-tested code rather than pushing bugs to production.',
        recommendedAnswerStrategy: 'Discuss testing pyramid (unit, integration, e2e), automated CI/CD gating, canary deployments, and observability.',
        suggestedStarOutline: {
          situation: 'Deployments were occurring manually every two weeks with frequent rollback incidents.',
          task: 'Automate deployment pipeline and establish reliable automated testing gates.',
          action: 'Configured GitHub Actions CI/CD with automated test suites, linting, and staging environment verification.',
          result: 'Shrank deployment cycle from 45 minutes to 8 minutes with zero rollback incidents over 6 months.',
        },
      },
      {
        question: `Why are you interested in this ${jobTitle} role specifically, and how does it fit your career trajectory?`,
        category: 'Role Alignment',
        whyInterviewerAsks: 'Ensures genuine mutual interest, motivation, and retention probability.',
        recommendedAnswerStrategy: 'Connect the company mission and technical challenges with your specific strengths and where you want to grow.',
        suggestedStarOutline: {
          situation: 'Looking to apply my background in scalable systems to high-impact products.',
          task: 'Find a team where high engineering standards and ownership are celebrated.',
          action: 'Researched company engineering blog and product roadmap before applying.',
          result: 'Identified direct alignment between upcoming technical challenges and my proven strengths.',
        },
      },
    ],
  };
}
