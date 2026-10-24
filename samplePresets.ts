import type { SamplePreset } from '../types.ts';

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'fullstack-senior',
    title: 'Senior Full Stack Engineer',
    category: 'Software Engineering',
    companyName: 'Stripe / FinTech Unicorn',
    experienceLevel: 'Senior (5+ years)',
    resumeText: `ALEX MORGAN
San Francisco, CA | alex.morgan.dev@email.com | (555) 382-9012 | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 6+ years of experience building resilient, high-throughput cloud architectures, web applications, and developer platforms. Proven track record scaling microservices from 10k to 2M DAU while cutting latency by 45%. Expertise in TypeScript, React, Node.js, PostgreSQL, Docker, and AWS.

EXPERIENCE

Apex Financial Systems — San Francisco, CA
Senior Software Engineer | 2022 – Present
• Architected and shipped core multi-tenant billing engine processing $180M+ annual transaction volume using Node.js, TypeScript, PostgreSQL, and Redis.
• Reduced API p99 latency from 420ms to 85ms by implementing distributed caching strategies and optimizing complex SQL queries.
• Mentored a team of 6 engineers on domain-driven design, code review standards, and automated unit/integration testing (achieved 92% test coverage).
• Migrated legacy monolithic services to containerized Docker workloads on AWS ECS with zero downtime across 12 zero-defect releases.
• Spearheaded frontend design system migration to React 18 and Tailwind CSS, speeding up cross-team UI sprint delivery by 35%.

Vanguard Interactive — Seattle, WA
Full Stack Engineer | 2019 – 2022
• Developed real-time collaborative workspace canvas using WebSockets, React, Redux Toolkit, and Express, serving 350,000 active monthly users.
• Built automated CI/CD pipeline using GitHub Actions and Terraform, shrinking deployment cycle from 45 minutes to 8 minutes.
• Collaborated closely with Product and UX teams to build accessible, WCAG 2.1 AA compliant customer checkout flows that boosted conversion by 14%.
• Integrated Stripe, PayPal, and Plaid APIs for recurring subscription handling with automated chargeback defense webhooks.

EDUCATION & CERTIFICATIONS
B.S. in Computer Science — University of Washington, 2019
AWS Certified Solutions Architect – Associate (2023)

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, Go (working knowledge)
Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3/Sass
Backend & DB: Node.js, Express, NestJS, PostgreSQL, Redis, MongoDB, GraphQL, REST
Cloud & DevOps: AWS (ECS, S3, RDS, Lambda), Docker, GitHub Actions, Terraform, Kubernetes
Testing & Tools: Jest, Playwright, Vitest, Git, Postman, Datadog`,
    jobDescription: `Job Title: Senior Full Stack Engineer, Core Platform
Company: CloudScale Infrastructure
Location: San Francisco, CA (Hybrid) / Remote

About The Role:
We are looking for an experienced Senior Full Stack Engineer to lead architecture and development across our core distributed SaaS platform. You will build mission-critical APIs, design real-time interfaces, and scale our high-concurrency event ingestion pipelines.

Key Responsibilities:
• Design, implement, and maintain high-volume, reliable REST and GraphQL APIs using TypeScript, Node.js, and PostgreSQL.
• Build modern, high-performance web frontends with React 18, TypeScript, Tailwind CSS, and state management frameworks.
• Scale distributed cloud infrastructure on AWS, leveraging Docker, Kubernetes (EKS), Kafka/SQS messaging, and Redis caching.
• Drive engineering excellence through code reviews, automated CI/CD pipelines, system monitoring (Datadog/Prometheus), and test automation.
• Champion system reliability, achieving 99.99% uptime SLAs and proactive incident resolution.
• Partner with Product Managers, Designers, and Data Engineers to define technical roadmaps and product requirements.

Required Qualifications:
• 5+ years of full-stack software development experience in production environments.
• Expert proficiency in TypeScript, React, and Node.js.
• Strong experience with relational databases (PostgreSQL or MySQL), query optimization, and schema design.
• Practical hands-on experience with AWS, containerization (Docker), and orchestration (Kubernetes).
• Proven background handling asynchronous message queues (Kafka, RabbitMQ, or AWS SQS).
• Strong understanding of microservices architecture, distributed systems patterns, and observability.

Preferred Qualifications:
• Experience with Apache Kafka or real-time event streaming architectures.
• Hands-on Kubernetes / Helm deployment experience.
• Prior experience in FinTech, developer tooling, or high-throughput B2B SaaS.
• Degree in Computer Science, Software Engineering, or equivalent practical experience.`,
  },
  {
    id: 'product-manager',
    title: 'Senior Product Manager',
    category: 'Product Management',
    companyName: 'NextWave SaaS',
    experienceLevel: 'Senior (4+ years)',
    resumeText: `ELENA ROSTOVA
New York, NY | elena.rostova@pmmail.com | (212) 555-0149 | linkedin.com/in/elenarostova

PROFESSIONAL SUMMARY
Data-driven Senior Product Manager with 5+ years of experience leading cross-functional squads to build enterprise B2B SaaS products and growth engines. Scaled product ARR from $4M to $19M, increased user retention by 22%, and led 0-to-1 launches in collaboration with sales, engineering, and design.

EXPERIENCE
CloudHQ Technologies — New York, NY
Senior Product Manager | 2021 – Present
• Owned the product vision and quarterly OKR execution for the Analytics & Reporting suite, growing adoption from 18% to 64% of enterprise accounts.
• Partnered with 12 engineers and 2 UX designers in bi-weekly Agile sprints to launch automated export integrations with Salesforce, HubSpot, and Slack.
• Conducted 80+ customer discovery interviews and analyzed telemetry via Mixpanel to pinpoint user drop-off, reducing onboarding churn by 28%.
• Led competitive pricing packaging overhaul, contributing $3.2M in net new ARR within 6 months of rollout.

SyncMetrics — Boston, MA
Product Manager | 2018 – 2021
• Managed product roadmap for self-serve onboarding funnel, improving sign-up to paid customer conversion rate from 3.2% to 5.8%.
• Wrote detailed PRDs, user stories, acceptance criteria, and worked directly in Jira with engineering team.
• Ran 25+ multivariate A/B tests using Optimizely, optimizing landing pages and feature discovery modals.
• Championed customer feedback loops, instituting monthly NPS surveys and Voice-of-Customer forums.

EDUCATION
B.A. in Economics & Communication — NYU Stern, 2018
Certified Scrum Product Owner (CSPO)

SKILLS & TOOLS
Product: Roadmapping, PRDs, Customer Discovery, Market Research, Go-To-Market (GTM), Pricing Strategy, User Journey Mapping
Analytics: SQL, Mixpanel, Amplitude, Google Analytics, Tableau, Heap
Methodologies: Agile, Scrum, Kanban, OKRs, Continuous Discovery
Tools: Jira, Confluence, Figma, Miro, Notion, Salesforce, Optimizely`,
    jobDescription: `Job Title: Senior Product Manager, Enterprise Growth
Company: WorkPulse Global
Location: New York, NY

Role Overview:
We are seeking a strategic, customer-obsessed Senior Product Manager to accelerate growth and expansion across our Enterprise SaaS platform. You will lead a high-performing team of engineers and designers to discover, validate, and launch high-impact product experiences.

What You Will Do:
• Lead product discovery, roadmap prioritization, and backlog grooming for enterprise workflows and monetization funnels.
• Define and track North Star metrics, retention cohorts, feature adoption rates, and customer LTV.
• Conduct qualitative customer interviews with enterprise Fortune 500 decision-makers and analyze large-scale quantitative behavioral data.
• Author high-clarity Product Requirement Documents (PRDs), user stories, and technical requirements.
• Work in close partnership with Sales, Customer Success, and Marketing to ensure successful GTM launches and customer enablement.

Requirements:
• 4+ years of product management experience in B2B SaaS, preferably focused on growth, enterprise workflows, or monetization.
• Demonstrated track record of moving measurable business metrics (ARR, conversion rates, NPS, retention).
• High analytical acumen: proficiency with product analytics tools (Amplitude, Mixpanel) and comfortable querying data with SQL.
• Outstanding stakeholder communication skills and ability to align executives, engineers, and customers.
• Experience in fast-paced Agile environments managing end-to-end product lifecycles from 0 to 1 and at scale.`,
  },
  {
    id: 'data-scientist-ml',
    title: 'Machine Learning / Data Scientist',
    category: 'AI & Data Science',
    companyName: 'NeuraTech AI',
    experienceLevel: 'Mid-Senior (3+ years)',
    resumeText: `PRIYA PATEL
Austin, TX | priya.patel.ai@email.com | (512) 555-8392 | linkedin.com/in/priyapatel-ds

SUMMARY
Machine Learning Engineer and Data Scientist with 4 years of experience designing, fine-tuning, and deploying deep learning and NLP models into production. Specialized in Transformer models, predictive analytics, feature engineering, and MLOps on AWS.

EXPERIENCE
Quantix Solutions — Austin, TX
Machine Learning Engineer | 2022 – Present
• Fine-tuned open-source LLMs (Llama-3, Mistral) with LoRA/QLoRA on proprietary enterprise corpus, achieving 89% accuracy in automated ticket categorization and saving 1,400 support hours/month.
• Built scalable feature store and inference service using FastAPI, Triton Inference Server, and AWS SageMaker handling 450 requests/second.
• Designed causal inference frameworks and Bayesian A/B testing models to evaluate recommendation algorithm impact on user engagement.
• Reduced model inference latency by 60% through INT8 quantization and ONNX runtime optimizations.

OmniData Labs — Dallas, TX
Data Scientist | 2020 – 2022
• Developed churn prediction gradient boosted trees (XGBoost, LightGBM) with 84% ROC-AUC, enabling customer success to proactively retain $1.8M in annual recurring revenue.
• Built end-to-end automated ETL pipelines using Apache Spark, Snowflake, and Airflow processing 15TB+ daily event data.
• Created interactive executive dashboards in Streamlit and Tableau to visualize customer segments and model explainability (SHAP values).

EDUCATION
M.S. in Data Science & Machine Learning — University of Texas at Austin, 2020
B.S. in Applied Mathematics — UT Austin, 2018

TECHNICAL SKILLS
Languages: Python (PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy), SQL, R
ML & GenAI: LLMs, Fine-tuning, RAG, Transformers, Vector DBs (Pinecone, Chroma), HuggingFace
MLOps & Cloud: AWS SageMaker, MLflow, Docker, Kubernetes, FastAPI, Triton, Airflow
Data & Storage: Snowflake, PostgreSQL, BigQuery, Spark, Git`,
    jobDescription: `Job Title: Senior Machine Learning Engineer, Generative AI & NLP
Company: Cortex Intelligence
Location: Austin, TX (Hybrid)

Role Summary:
Cortex Intelligence is hiring a Senior ML Engineer to build cutting-edge Generative AI applications and production RAG pipelines for global enterprise customers.

Core Responsibilities:
• Research, design, and deploy production NLP and Generative AI systems including Retrieval-Augmented Generation (RAG) and domain-specific LLM fine-tuning.
• Build real-time model serving pipelines with low latency (<150ms) using Triton, FastAPI, and Kubernetes.
• Implement Vector Databases (Pinecone, Qdrant, Milvus) and evaluate semantic search retrieval metrics (Recall@K, MRR).
• Design robust MLOps evaluation pipelines, guardrails, and automated red-teaming to ensure model safety and prevent hallucinations.
• Collaborate with backend engineers and product teams to integrate AI models seamlessly into SaaS products.

Required Skills & Experience:
• 3+ years of professional experience building and deploying machine learning models in production.
• Strong proficiency in Python, PyTorch, HuggingFace Transformers, and LangChain/LlamaIndex.
• Demonstrated experience with RAG architectures, chunking strategies, embeddings, and vector databases.
• Strong foundation in MLOps: Docker, Kubernetes, CI/CD for ML, MLflow or Weights & Biases, AWS or GCP.
• Familiarity with LLM evaluation frameworks (e.g., RAGAS, DeepEval) and prompt engineering best practices.`,
  },
];
