import { UserProfile, JobListing } from '../src/types.js';

export const INITIAL_PROFILE: UserProfile = {
  full_name: "Kartik Bhatt",
  contact: {
    email: "kb270102@gmail.com",
    phone: "+91-7428062532",
    location: "Gurugram, India",
    links: "linkedin.com/in/kartikbhatt, github.com/Pokedash01"
  },
  total_years_experience: 3.2,
  seniority_tier: "Mid",
  education: [
    {
      institution: "Maharaja Surajmal Institute",
      degree: "Bachelor of Computer Applications",
      details: "Majors: Computer Science, GPA: 9.3/10 (Top 1%)",
      dates: "Jul’19 – Aug’22"
    }
  ],
  experience: [
    {
      company: "KPMG",
      role: "Analyst",
      location: "Gurugram",
      dates: "May’24 – Present",
      summary: "Led cross-functional projects across 13 sectors demanding 360-degree stakeholder management and played a key role in business development.",
      bullets: [
        "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
        "Built end-to-end solution to facilitate migration of old Excel‑based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
        "Built and managed multiple VBA‑macros‑based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
        "Built a multi‑modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
        "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development).",
        "Catered to 100+ RFP and RFI requests and created more than 100 internal site pages according to KPMG brand values and standards.",
        "Undertook a complete contact management system for more than 10,000 KGS members.",
        "Uploaded 5,000+ content assets across 3 content types and 15 libraries.",
        "Performed Audit Market Share (AMS) analysis for more than 6 sectors.",
        "Handled more than 50 SharePoint governance and administration requests, including term store, change, metadata, and permission level management.",
        "Awarded ‘KUDOS’ for applying Lean Six Sigma methodology and saving more than 2,000 hrs. annually.",
        "Earned the ‘Super Team’ award for hosting and organizing employee council events for the wider KGS group.",
        "Received ‘Ally of Inclusion’ accolade recognizing commitment to an inclusive work environment.",
        "Awarded ‘KUDOS’ for migrating legacy practices using VBA and Excel to a GenAI‑focused solution with agents and Power Platform.",
        "Awarded ‘Gurus@Work’ for contributions to learning culture in KGS while empowering and inspiring learners."
      ]
    },
    {
      company: "GlobalLogic Technologies Private Limited",
      role: "Associate Analyst",
      location: "Gurugram",
      dates: "Sep’22 – Oct’23",
      summary: "Participated in various content generation and manipulation projects for clients such as Google.",
      bullets: [
        "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
        "Piloted a project to extract relevant answers from multi‑level documents to build an AI training dataset.",
        "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
        "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
        "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%.",
        "Performed QA on more than 500 pieces weekly.",
        "Led 3 pilot projects, securing all of them while competing with major MNCs."
      ]
    }
  ],
  skills: [
    "MS Excel",
    "Copilot GenAI (Agents)",
    "Power Automate",
    "Power BI",
    "SharePoint Online",
    "Power Apps",
    "Copilot Studio",
    "SQL",
    "Python",
    "Process Automation",
    "VBA Macros",
    "Lean Six Sigma"
  ],
  certifications: [
    "Microsoft Certified: Azure AI Fundamentals (AI-901)",
    "Microsoft Certified: AI Transformation Leader (AB-731)",
    "Lean Six Sigma: Yellow Belt",
    "Oracle: Agentic AI Certified Foundations Associate",
    "Microsoft Certified: AI Business Professional (AB-730)"
  ],
  target_roles: [
    "AI Transformation Analyst",
    "Power Platform Developer",
    "Automation Consultant",
    "Business Intelligence & GenAI Specialist",
    "Solutions Analyst"
  ],
  anti_targets: [
    "Cold Sales Representative",
    "Manual BPO Telecaller"
  ],
  preferred_locations: [
    "Gurgaon",
    "Gurugram",
    "Noida",
    "Delhi",
    "Remote",
    "Bangalore",
    "Bengaluru"
  ],
  salary_expectation: {
    min_lpa: 10,
    max_lpa: 18
  }
};

export const INITIAL_JOBS: JobListing[] = [
  {
    id: "gtn-prod-ba-01",
    title: "Senior Product Business Analyst",
    company_name: "Gartner",
    location: "Gurugram",
    salary_range_lpa: [18, 26],
    salary_is_estimated: true,
    salary_source: "AmbitionBox & Glassdoor Benchmark (Gurugram Market Data)",
    salary_search_query: "salary for Senior Product Business Analyst at Gartner in Gurugram AmbitionBox Glassdoor",
    salary_ambitionbox_url: "https://www.google.com/search?q=site:ambitionbox.com+salaries+Gartner+Senior+Product+Business+Analyst+Gurugram",
    salary_glassdoor_url: "https://www.google.com/search?q=site:glassdoor.co.in+salary+Gartner+Senior+Product+Business+Analyst+Gurugram",
    experience_range_years: [3, 6],
    experience_is_inferred: true,
    experience_inferred_reason: "Inferred from Seniority ('Senior Product Analyst' standard band: 3-6 Years)",
    description: `Gartner is hiring a Senior Product Business Analyst in Gurugram to drive strategic business analysis and product telemetry across our global research applications.
Key Responsibilities:
- Translate executive research workflows and business requirements into concrete user stories and functional product specs.
- Analyze operational metrics and user feedback using advanced telemetry dashboards in Power BI and SQL.
- Partner with product managers and engineering squads to lead sprint planning, backlog refinement, and acceptance criteria.
- Conduct continuous process optimization and stakeholder management across global research teams.
Qualifications:
- Proven track record in business analysis, requirements gathering, or product solutions.
- Strong proficiency in stakeholder management, data analysis, and workflow automation.
- Excellent structured communication and problem-solving skills.`,
    apply_link: "https://gartner.wd5.myworkdayjobs.com/en-US/Gartner_Careers/job/Gurugram/Senior-Product-Business-Analyst_JR10928",
    ats_source: "Workday",
    discovered_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    posted_date: new Date(Date.now() - 3600000 * 2).toISOString(),
    posted_days_ago: 0,
    is_direct_posting: true,
    verification_status: "verified_active",
    verification_notes: "Direct Workday requisition verified active and accepting applications.",
    verified_at: new Date().toISOString(),
    status: "discovered",
    fit: {
      is_viable: true,
      match_score: 92,
      detected_experience: "3-6 years (Inferred from Seniority)",
      salary_range: "₹18 - ₹26 LPA (AmbitionBox & Glassdoor Benchmark)",
      location: "Gurugram",
      skills_gap: "None",
      summary_reasoning: "Outstanding alignment for Gartner Gurugram. Candidate has 3.2 years at KPMG leading stakeholder reach-outs across 13 sectors, building telemetry dashboards in Power BI, and driving business development.",
      strengths: [
        "Direct KPMG cross-functional stakeholder management across 13 sectors",
        "Extensive Power BI reporting and business development analysis",
        "Compensation expectation matches ₹18-26 LPA AmbitionBox benchmark for Gartner Gurugram",
        "Perfect location match in Gurugram"
      ],
      weaknesses: []
    }
  },
  {
    id: "dae0f7f2de53e776",
    title: "Senior Analyst - AI & Intelligent Automation",
    company_name: "PwC",
    location: "Gurugram",
    salary_range_lpa: [12, 17],
    experience_range_years: [2, 5],
    description: `PwC India is looking for a Senior Analyst in Intelligent Automation and GenAI.
Key Responsibilities:
- Design, build, and deploy low-code automation solutions utilizing Microsoft Power Platform (Power Automate, Power Apps, Power BI).
- Integrate AI Copilots and GenAI agentic workflows to automate cross-functional business reporting and member firm communications.
- Conduct process discovery, workflow documentation, and quality governance using Lean Six Sigma methodologies.
- Collaborate with onshore leadership to build enterprise dashboards and automated data pipelines across SharePoint Online and SQL repositories.
Requirements:
- 2 to 5 years of relevant experience in enterprise automation, Power Platform, or AI solutions.
- Strong proficiency in Power Automate, SharePoint Online, Power BI, and Copilot Studio.
- Proven track record saving measurable manual hours and delivering executive reporting.`,
    apply_link: "https://pwc.wd3.myworkdayjobs.com/en-US/Global_Experienced_Careers/job/Gurugram/Senior-Analyst-AI-Automation",
    ats_source: "Workday",
    discovered_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    posted_date: new Date(Date.now() - 3600000 * 4).toISOString(),
    posted_days_ago: 0,
    is_direct_posting: true,
    verification_status: "verified_active",
    verification_notes: "Direct Workday requisition verified active and accepting applications.",
    verified_at: new Date().toISOString(),
    status: "discovered",
    fit: {
      is_viable: true,
      match_score: 94,
      detected_experience: "2-5 years",
      salary_range: "₹12 - ₹17 LPA",
      location: "Gurugram",
      skills_gap: "None",
      summary_reasoning: "Exceptional alignment. Candidate holds 3.2 years of direct experience at KPMG building Power Platform, Copilot agents, and SharePoint integrations saving over 2,000 hours annually, matching all PwC primary stack criteria.",
      strengths: [
        "Direct KPMG experience with 20,000+ reach-out solutions across Power Platform",
        "Copilot Studio and GenAI agent deployment with verified 325+ hrs saved",
        "Lean Six Sigma Yellow Belt certification and award recipient",
        "Perfect location match in Gurugram"
      ],
      weaknesses: []
    }
  },
  {
    id: "68914bc11b7abbe9",
    title: "Automation Consultant - Power Platform & Copilot",
    company_name: "Genpact",
    location: "Noida",
    salary_range_lpa: [11, 16],
    experience_range_years: [2, 4],
    description: `Genpact is hiring an Automation Consultant to drive digital transformation initiatives for global enterprise clients.
Role Overview:
- Automate complex operational processes using Microsoft Power Apps, Power Automate desktop and cloud flows.
- Implement AI Copilot Studio agents to streamline data collection and unstructured document triage.
- Partner with client stakeholders to analyze legacy spreadsheets and automate migration to modern cloud databases.
- Deliver interactive business intelligence reports in Power BI.
Qualifications:
- Bachelor's degree in Computer Applications, Computer Science or equivalent.
- 2+ years of hands-on experience in Power Automate, SharePoint administration, and Copilot Studio.
- Strong communication and client presentation skills.`,
    apply_link: "https://genpact.taleo.net/careersection/jobdetail.ftl?job=AUT2025GEN",
    ats_source: "SmartRecruiters",
    discovered_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    posted_date: new Date(Date.now() - 3600000 * 8).toISOString(),
    posted_days_ago: 0,
    is_direct_posting: true,
    verification_status: "verified_active",
    verification_notes: "Direct Taleo career section requisition actively accepting applications.",
    verified_at: new Date().toISOString(),
    status: "discovered",
    fit: {
      is_viable: true,
      match_score: 91,
      detected_experience: "2-4 years",
      salary_range: "₹11 - ₹16 LPA",
      location: "Noida",
      skills_gap: "None",
      summary_reasoning: "Strong match. Candidate has deep experience in legacy Excel-to-SharePoint migrations, automated cloud flows, and Copilot Studio deployment.",
      strengths: [
        "Hands-on legacy data migration for 45+ pillars saving 1,200 hrs",
        "Copilot Studio agent production deployment",
        "BCA degree top 1% honors directly fulfills education criteria"
      ]
    }
  },
  {
    id: "rockwell-pp-dev-01",
    title: "Power Platform Developer",
    company_name: "Rockwell Automation",
    location: "Noida",
    salary_range_lpa: [14, 20],
    experience_range_years: [3, 5],
    description: `Rockwell Automation is hiring a Power Platform Developer to architect and automate enterprise digital workflows.
Responsibilities:
- Build enterprise Power Automate cloud flows and canvas Power Apps for internal global teams.
- Deploy automated business intelligence dashboards in Power BI integrated with SQL and SharePoint.
- Build governance, security, and exception alerting for digital automation solutions.
Requirements:
- 3+ years experience with Microsoft Power Platform (Power Automate, Power Apps, Power BI).
- Strong proficiency in workflow automation and enterprise integrations.`,
    apply_link: "https://rockwellautomation.wd1.myworkdayjobs.com/en-US/External_Rockwell_Automation/job/Power-Platform-Developer_R26-5358",
    ats_source: "Workday",
    discovered_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    posted_date: new Date(Date.now() - 3600000 * 14).toISOString(),
    posted_days_ago: 1,
    is_direct_posting: true,
    verification_status: "verified_active",
    verification_notes: "Direct Workday requisition verified active and accepting applicants.",
    verified_at: new Date().toISOString(),
    status: "discovered",
    fit: {
      is_viable: true,
      match_score: 93,
      detected_experience: "3-5 years",
      salary_range: "₹14 - ₹20 LPA",
      location: "Noida",
      skills_gap: "None",
      summary_reasoning: "Exceptional match. Candidate has 3.2 years of hands-on Power Platform, Power Automate, and Power BI enterprise development at KPMG.",
      strengths: [
        "Direct KPMG experience with 20,000+ reach-out automation solutions",
        "Deep Power Apps, Power Automate, and Power BI production skills",
        "Location in Noida/NCR aligned with preferences"
      ]
    }
  },
  {
    id: "ce6b91e7d8b66dbb",
    title: "Senior Java Microservices Backend Lead",
    company_name: "FinTech Core Systems",
    location: "Mumbai",
    salary_range_lpa: [22, 30],
    experience_range_years: [7, 10],
    description: `Leading financial services firm seeking a Senior Java Microservices Architect. Must have 8+ years writing low-latency Java backend services with Spring Boot, Kafka, and Kubernetes.`,
    apply_link: "https://jobs.lever.co/fintech-core/java-lead",
    ats_source: "Lever",
    discovered_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    posted_date: new Date(Date.now() - 3600000 * 28).toISOString(),
    posted_days_ago: 1,
    is_direct_posting: true,
    verification_status: "active_portal",
    verification_notes: "Direct Lever posting active.",
    verified_at: new Date().toISOString(),
    status: "rejected",
    fit: {
      is_viable: false,
      match_score: 22,
      detected_experience: "7-10 years",
      salary_range: "₹22 - ₹30 LPA",
      location: "Mumbai",
      skills_gap: "Java, Spring Boot, Kafka, Kubernetes (Demands core Java stack)",
      rejection_reason: "Role demands 7-10 years senior Java backend architecture; candidate specializes in Power Platform, Automation, and GenAI solutions (3.2 years).",
      strengths: [],
      weaknesses: ["Missing required core Java backend stack", "Seniority mismatch (>7 years required)"]
    }
  }
];
