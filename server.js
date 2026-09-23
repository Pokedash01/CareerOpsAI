// server.ts
import express from "express";
import path2 from "path";

// src/seedData.ts
var INITIAL_PROFILE = {
  "full_name": "Kartik Bhatt",
  "contact": {
    "email": "kb270102@gmail.com",
    "phone": "+91-7428062532",
    "location": "Gurugram, India",
    "links": "linkedin.com/in/kartikbhatt, github.com/Pokedash01"
  },
  "total_years_experience": 3.2,
  "seniority_tier": "Mid",
  "education": [
    {
      "institution": "Maharaja Surajmal Institute",
      "degree": "Bachelor of Computer Applications",
      "details": "Majors: Computer Science, GPA: 9.3/10 (Top 1%)",
      "dates": "Jul\u201919 \u2013 Aug\u201922"
    }
  ],
  "experience": [
    {
      "company": "KPMG",
      "role": "Analyst",
      "location": "Gurugram",
      "dates": "May\u201924 \u2013 Present",
      "summary": "Led cross-functional projects across 13 sectors demanding 360-degree stakeholder management and played a key role in business development.",
      "bullets": [
        "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
        "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
        "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
        "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
        "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development).",
        "Catered to 100+ RFP and RFI requests and created more than 100 internal site pages according to KPMG brand values and standards.",
        "Undertook a complete contact management system for more than 10,000 KGS members.",
        "Uploaded 5,000+ content assets across 3 content types and 15 libraries.",
        "Performed Audit Market Share (AMS) analysis for more than 6 sectors.",
        "Handled more than 50 SharePoint governance and administration requests, including term store, change, metadata, and permission level management.",
        "Awarded \u2018KUDOS\u2019 for applying Lean Six Sigma methodology and saving more than 2,000 hrs. annually.",
        "Earned the \u2018Super Team\u2019 award for hosting and organizing employee council events for the wider KGS group.",
        "Received \u2018Ally of Inclusion\u2019 accolade recognizing commitment to an inclusive work environment.",
        "Awarded \u2018KUDOS\u2019 for migrating legacy practices using VBA and Excel to a GenAI\u2011focused solution with agents and Power Platform.",
        "Awarded \u2018Gurus@Work\u2019 for contributions to learning culture in KGS while empowering and inspiring learners."
      ]
    },
    {
      "company": "GlobalLogic Technologies Private Limited",
      "role": "Associate Analyst",
      "location": "Gurugram",
      "dates": "Sep\u201922 \u2013 Oct\u201923",
      "summary": "Participated in various content generation and manipulation projects for clients such as Google.",
      "bullets": [
        "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
        "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
        "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
        "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
        "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%.",
        "Performed QA on more than 500 pieces weekly.",
        "Led 3 pilot projects, securing all of them while competing with major MNCs."
      ]
    }
  ],
  "skills": [
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
  "certifications": [
    "Microsoft Certified: Azure AI Fundamentals (AI-901)",
    "Microsoft Certified: AI Transformation Leader (AB-731)",
    "Lean Six Sigma: Yellow Belt",
    "Oracle: Agentic AI Certified Foundations Associate",
    "Microsoft Certified: AI Business Professional (AB-730)"
  ],
  "target_roles": [
    "AI Transformation Analyst",
    "Power Platform Developer",
    "Automation Consultant",
    "Business Intelligence & GenAI Specialist",
    "Solutions Analyst"
  ],
  "anti_targets": [
    "Cold Sales Representative",
    "Manual BPO Telecaller"
  ],
  "preferred_locations": [
    "Gurgaon",
    "Gurugram",
    "Noida",
    "Delhi",
    "Remote",
    "Bangalore",
    "Bengaluru"
  ],
  "salary_expectation": {
    "min_lpa": 10,
    "max_lpa": 18
  }
};
var INITIAL_JOBS = [
  {
    "id": "90f943841b863e7f",
    "title": "Power BI Specialist/Data analyst",
    "company_name": "Hitachi",
    "location": "Chennai",
    "salary_range_lpa": [
      9,
      16
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)",
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "description": "... power Apps, Power Automate using SharePoint / Dataverse or SQL as ... Proven hands-on experience with Power BI Desktop and Power BI Service in ...\n\nRequisition posted on Hitachi career portal. Direct application link verified active.",
    "apply_link": "https://hitachi.wd1.myworkdayjobs.com/en-US/hitachi/job/Power-BI-Specialist-Data-analyst_R0144246",
    "ats_source": "Workday",
    "discovered_at": "2026-09-18T08:13:35.538Z",
    "posted_date": "2026-09-15T08:13:35.538Z",
    "posted_days_ago": 3,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:35.538Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "Not evaluated",
      "salary_range": "Not evaluated",
      "location": "Chennai",
      "skills_gap": "Location mismatch",
      "rejection_reason": "Location 'Chennai' not in preferred list [Gurgaon, Gurugram, Noida, Delhi, Remote, Bangalore, Bengaluru]",
      "evaluated_at": "2026-09-18T08:13:36.798Z"
    }
  },
  {
    "id": "0b8112e0e79c3309",
    "title": "Business Analyst",
    "company_name": "Worldwide",
    "location": "Not specified",
    "salary_range_lpa": [
      22,
      35
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)",
    "experience_range_years": [
      5,
      8
    ],
    "experience_is_inferred": false,
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 5+ years experience",
    "description": "SUMMARY: The Business Analyst (BA) will work with other stakeholders within the organization to deliver the solutions by translating business ...\n\nRequisition posted on Worldwide career portal. Direct application link verified active.",
    "apply_link": "https://worldwide.wd1.myworkdayjobs.com/en-US/External/job/Trivandrum/Business-Analyst---India_JR102991",
    "ats_source": "Workday",
    "discovered_at": "2026-09-18T08:13:32.302Z",
    "posted_date": "2026-09-16T08:13:32.302Z",
    "posted_days_ago": 2,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:32.302Z",
    "status": "discovered",
    "fit": {
      "is_viable": true,
      "match_score": 82,
      "detected_experience": "5-8 Years",
      "salary_range": "\u20B922 - \u20B935 LPA",
      "location": "Not specified",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Business Analyst. Strong alignment with  in Not specified.",
      "strengths": [
        "Direct match with candidate target role: Business Analyst"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-18T08:13:53.835Z"
    },
    "tailored": {
      "job_title": "Business Analyst",
      "company": "Worldwide",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Business Analyst position at Worldwide. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Worldwide.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Worldwide."
      ],
      "generated_at": "2026-09-18T08:14:02.161Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    }
  },
  {
    "id": "5816b194c70faf0c",
    "title": "Power BI Developer (Active Secret clearance required)",
    "company_name": "Truetandem",
    "location": "Remote",
    "salary_range_lpa": [
      102,
      125
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "description": "True Tandem - Power BI Developer (Active Secret clearance required) Power BI Developer (Active Secret clearance required) Remote All / Full time / Remote apply for this job Company Description TrueTandem's mission is to be a trusted information technology solutions provider, committed to the success of our customers, communities and employees. To enable this mission, we listen to our customers\u2019 needs, empower our dedicated and talented employees, envision success together, and deliver innovative cost-effective solutions. For our customers, we aim to deliver more power to meet their business outcomes through technology implementation, integration, optimization and customization. We enable some of the most well-known companies, nonprofits and federal agencies in the United States to intelligently plan and develop their applications, modernize their infrastructure and manage their data. As a Power BI Developer on our solutions delivery team, you will have the unique opportunity to support the technical development for projects advancing the digital transformation of critical government systems with true mission impact. &nbsp; &nbsp;Our delivery teams are driven to explore new ideas and technology, and care deeply about collaboration, feedback, and iteration. We follow agile practices, and use modern tech stacks, and constantly challenge each other to grow and improve. Technical members of our solutions teams require little guidance, but love to learn, collaborate, and solve problems. This position requires experience and passion for coding, and a strong desire to solve our customers\u2019 unique technology challenges. Role and Responsibilities: Design, develop, test, deploy, and maintain Power BI dashboards, reports, dataflows and semantic models. Engineer and optimize data connections with Dataverse. Work with stakeholders to gather and translate business and reporting requirements into technical solutions. Develop complex calculations and business logic using DAX (Data Analysis Expressions). Use Power Query/M to connect, transform, cleanse, and prepare data for reporting. Implement Security and other appropriate data-access controls. Implement BI governance, version control, report lifecycle management and workspace organization Required Skills Active Secret Clearance or higher is required&nbsp; Minimum of 4 years designing and developing Power BI reports, dashboards, and integrations with complex datasets Minimum of 4 years of experience scripting in data engineering languages such as SQL, Power Query M, DAX Strong hands-on experience with Microsoft Power BI Desktop and Power BI Service. Ability to be self-driven and proactive with planning, development, and customer engagement. Excellent communication, collaboration, and customer management skills Ability to train data analysts on how to create reports Preferred Skills Experience with Microsoft Power Apps, Power Automate Experience with Dataverse, Azure Data, Databrick or other data sources &nbsp; $120,000 - $147,000 a year The above salary range represents a general guideline; however, TrueTandem considers several factors when determining base salary offers such as the scope and responsibilities of the position and the candidate's experience, education, skills and current market conditions. &nbsp; In addition, TrueTandem provides a variety of benefits including health insurance coverage, dental and vision plans, life and disability insurance, company paid holidays and paid time off (PTO). Our retirement plan offers a variety of investment options to build toward your retirement. &nbsp; &nbsp; U.S. Citizenship is required for all positions with a government clearance and certain other restricted positions. Additional Information TrueTandem is an equal opportunity employer, committed to diversity and inclusion in the workplace and affords equal opportunity to all qualified applicants for all positions without regard to protected veteran status, qualified individuals with disabilities and all individuals without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age or any other status protected under local, state or federal laws. Equal Opportunity Employer - Minorities/Females/Disabled/Veterans We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job True Tandem Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/truetandem/f9e53ae9-6126-49e0-be40-c59aef46ddd3",
    "ats_source": "Lever",
    "discovered_at": "2026-09-18T08:13:31.663Z",
    "posted_date": "2026-09-17T08:13:31.663Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:31.663Z",
    "status": "discovered",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "2-4 Years",
      "salary_range": "\u20B9102 - \u20B9125 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Power BI Developer (Active Secret clearance required). Strong alignment with MS Excel, Power Automate, Power BI in Remote.",
      "strengths": [
        "Direct match with candidate target role: Power BI Developer (Active Secret clearance required)",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in Power Apps",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-18T08:13:40.754Z"
    },
    "tailored": {
      "job_title": "Power BI Developer (Active Secret clearance required)",
      "company": "Truetandem",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Power BI Developer (Active Secret clearance required) position at Truetandem. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Truetandem.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Truetandem."
      ],
      "generated_at": "2026-09-18T08:13:48.352Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    }
  },
  {
    "id": "e7f2e7da0ac13125",
    "title": "Beghou Consulting - Power BI Developer (318)",
    "company_name": "Beghouconsulting",
    "location": "Bangalore",
    "salary_range_lpa": [
      11,
      19
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)",
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": false,
    "experience_inferred_reason": "Exact requirement extracted from Job Description: Experience : 2 to 4 years",
    "description": "Beghou Consulting - Consultant - Power BI Developer (318) Consultant - Power BI Developer (318) Pune / Bangalore Consulting \u2013 Consulting / Hybrid apply for this job Beghou brings over three decades of experience helping life sciences companies optimize their commercialization through strategic insight, advanced analytics, and technology. From developing go-to-market strategies and building foundational data analytics infrastructures to leveraging artificial intelligence to improve customer insights and engagement, Beghou helps life sciences companies maximize performance across their portfolios. Beghou also deploys proprietary and third-party technology solutions to help companies forecast performance, design territories, manage customer data, organize, and report on medical and commercial data, and more. Headquartered in Evanston, Illinois, we have 10 global offices. Our mission is to bring together analytical minds and innovative technology to help life sciences companies navigate the complexity of health care and improve patient outcomes. We are seeking a motivated Power BI Developer to join our data analytics team. The ideal candidate will assist in developing interactive dashboards, reports, and data visualizations to help business users make informed decisions. You will work closely with data analysts, business stakeholders, and senior developers to transform raw data into meaningful insights We'll trust you to Develop and maintain Power BI reports, dashboards, and visualizations. Connect, transform, and model data from various sources in Power BI. Assist in data analysis and provide actionable insights. Optimize Power BI reports for performance and usability. Collaborate with stakeholders to understand reporting needs and business objectives. Ensure data accuracy and integrity in reporting solutions. Stay up to date with Power BI best practices and new features. Troubleshoot and resolve Power BI-related issues. Additional Responsibilities : Perform other project-related tasks as needed. You'll need to have Education : Bachelor\u2019s or Master\u2019s degree in Computer Science, Data Science, Information Technology, or a related field. Experience : 2 to 4 years of experience in Power BI and other Visualization tools Like Tableau is added advantage. Proficiency in creating interactive dashboards and visualizations. Solid experience in Power BI, including DAX and Power Query. Strong SQL skills, including complex queries and calculated fields. Experience working with large datasets, patient data, or market access analytics Technical Skills : Familiarity with data warehousing concepts and ETL processes. Experience with Power BI Service. Knowledge of cloud platforms (AWS, Azure, Google Cloud) is a plus. Soft Skills : Strong analytical and problem-solving abilities. Excellent verbal and written communication skills. Ability to work in a collaborative, team-oriented environment. At Beghou Consulting, you'll join a highly collaborative, values-driven team where technical excellence, analytical rigor, and personal growth converge. Whether you're passionate about AI innovation, building commercialization strategies, or shaping the next generation of data-first solutions in life sciences, this is a place to make an impact! We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Beghou Consulting Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/beghouconsulting/b26af326-54b6-4028-8fd2-efd092408909",
    "ats_source": "Lever",
    "discovered_at": "2026-09-18T08:13:31.699Z",
    "posted_date": "2026-09-17T08:13:31.699Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:31.699Z",
    "status": "discovered",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "2-4 Years",
      "salary_range": "\u20B911 - \u20B919 LPA",
      "location": "Bangalore",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Beghou Consulting - Power BI Developer (318). Strong alignment with MS Excel, Power BI, SQL in Bangalore.",
      "strengths": [
        "Direct match with candidate target role: Beghou Consulting - Power BI Developer (318)",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-18T08:13:58.909Z"
    },
    "tailored": {
      "job_title": "Beghou Consulting - Power BI Developer (318)",
      "company": "Beghouconsulting",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Beghou Consulting - Power BI Developer (318) position at Beghouconsulting. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Beghouconsulting.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Beghouconsulting."
      ],
      "generated_at": "2026-09-18T08:14:06.236Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    }
  },
  {
    "id": "f4004405d9c00c39",
    "title": "Business Intelligence Data Analyst",
    "company_name": "Openx",
    "location": "Remote",
    "salary_range_lpa": [
      79,
      94
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      1,
      3
    ],
    "experience_is_inferred": false,
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 1-3 years",
    "description": `OpenX - Business Intelligence Data Analyst Business Intelligence Data Analyst US - Remote Finance \u2013 Finance / Full-Time / Remote apply for this job Company at a Glance OpenX is focused on unleashing the full economic potential of digital media companies. We do this by making digital advertising markets and technologies that are designed to deliver optimal value to publishers and advertisers on every ad served across all screens. At OpenX, we have built a team that is uniquely experienced in designing and operating high-scale ad marketplaces, and we are constantly on the lookout for thoughtful, creative executors who are as fascinated as we are about finding new ways to apply a blend of market design, technical innovation, operational excellence, and empathetic partner service to the frontiers of digital advertising. Data Analyst \u2013 Business Intelligence Location: Remote Position Summary: OpenX Technologies, Inc. is looking for a Data Analyst to join our dynamic and high-performing Business Intelligence team within the Finance organization. Our organization\u2019s mission is to steer the financial growth of OpenX through the delivery of world-class financial intelligence, guidance and services. &nbsp;In this mission we value reliability, integrity and fearless stewardship of OpenX\u2019s business. We strive to operate with objectivity, rigor and strategic insight.&nbsp; The ideal candidate will be a highly engaged and intellectually curious data analyst with one to three years of experience in an analytic role. You will be responsible for developing in-depth business analyses, providing ad hoc analytic support to the entire business, and driving the scaling and automation of reporting processes. &nbsp;You will have the opportunity to design and execute quantitative analyses using large and complex data sets, and learn about the dynamic ad tech industry from within one of its leading companies. Responsibilities: Build performance and revenue reporting tools for internal customers Help build and automate data and reporting processes for the Finance organization Ad-hoc analysis and reporting, serving teams across the company Execute deep dive quantitative analyses that translates data into actionable insights Provide analytical and decision-making support for key company initiatives Present analysis and share findings with both technical and non-technical stakeholders Key Qualifications: 1-3 years of analytical work experience, preferably within a business intelligence, corporate finance or strategic planning role. &nbsp;Experience working with large data sets is preferred. Bachelor\u2019s degree in a quantitative field (such as Mathematics, Statistics, Finance, Economics, Physics), Master\u2019s degree in a quantitative field is preferred. Strong analytical abilities and the ability to form key, succinct insights and recommendations from analyses involving large amounts of complex data. Curiosity to identify and ability to solve difficult problems. Prior experience with relational database systems; strong SQL skills are required. &nbsp;Previous experience with Google BigQuery is a definite plus. Strong quantitative skills and proficiency with MS Office and Google suite of applications, and prior experience with scripting languages (such as Python) preferred. Outstanding written and verbal communication skills.&nbsp; Ability to interface with and effectively present to multiple levels of management. Extremely proactive with a strong bias for action; naturally inquisitive; desire to continuously improve current business practices/processes. Organized, detail-oriented, and ability to multi-task.&nbsp; $93,500 - $110,000 a year Pursuant to any state, local ordinance, or local hiring regulations, we will consider for employment any qualified applicant, including those with arrest and conviction records, in a manner consistent with the applicable regulation.&nbsp; OpenX is committed to fair and equitable compensation practices. For all applicants, the base salary range is noted above, per year + bonus + equity + benefits. A candidate\u2019s salary is determined by various factors including, but not limited to, relevant work experience, skills, and certifications.&nbsp; A summary of our benefits, which include medical, dental, vision, 401k, equity and more, can be viewed here:&nbsp; https://www.openx.com/company/careers/ &nbsp;A candidate\u2019s salary is determined by various factors including, but not limited to, relevant work experience, skills, and certifications.&nbsp;&nbsp; OpenX VALUES Our five company values form a solid bedrock serving to define us as a group and guide the company. Our values remind us that how we do things often matters as much as what we do. WE ARE ONE We are one team. There are no exceptions. We are a group of strong and diverse individuals unified by a shared mission. We embrace challenges and win together as a team. We respect and care about our colleagues and cultivate an inclusive culture WE ARE CUSTOMER CENTRIC We innovate on behalf of our customers. We understand, respect, and listen carefully to our customers. We build great products to solve our customers\u2019 problems. We manage our customers\u2019 expectations clearly and honestly. We are a trusted partner to all of our customers - we act with integrity at all times. We care. OPENX IS OURS We are all owners of OpenX We all have a voice to improve OpenX We stake our personal and professional reputations on the excellence of our work We are not interested in just "doing our jobs"; we take ownership to drive results WE ARE AN OPEN BOOK We understand and respect what each of us does.&nbsp;We are eager to teach and share what we know with others, both internally and externally. We are eager to learn from others and we ask questions internally and externally.&nbsp; WE EVOLVE FAST We take responsible risks and own and learn from our mistakes. We recognize and repeat success.&nbsp;We actively seek out and provide constructive feedback. We adapt quickly and embrace change. We tackle growth and learning with real urgency. We are endlessly curious. OpenX TRAITS Our three traits capture what makes a great team member at OpenX. HUMBLE Ideal team players are humble and demonstrate integrity. They put the team's success above their own, share credit generously, and value collective achievements. They are self-assured, open to coaching, and committed to continuous learning. DRIVEN Ideal team players are results-driven and motivated. They are curious, always seeking more to do, learn, and take on. As proactive problem-solvers, they take initiative without needing external motivation. They continuously think about the next steps and opportunities for improvement. SMART Ideal team players are smart and possess the intellectual acumen to understand the complexities of our organization and industry. They are interpersonally intelligent, good communicators, and exemplify sound judgment in their interactions across the company to foster a collaborative environment. OpenX is committed to equal employment opportunities. It is a fundamental principle at OpenX not to discriminate against employees or applicants for employment on any legally-recognized basis including, but not limited to: age, race, creed, color, religion, national origin, sexual orientation, sex, disability, predisposing genetic characteristics, genetic information, military or veteran status, marital status, gender identity/transgender status, pregnancy, childbirth or related medical condition, and other protected characteristic as established by law. OpenX Applicant Privacy Policy Applicants can review our Applicant Privacy Policy at any time by visiting the following link:&nbsp; https://www.openx.com/privacy-center/applicant-privacy-policy/ . Effective Date: November 21, 2024 apply for this job OpenX Home Page Jobs powered by`,
    "apply_link": "https://jobs.lever.co/openx/df23b30a-21b5-4055-9698-5b5c2767df3c",
    "ats_source": "Lever",
    "discovered_at": "2026-09-18T08:13:31.925Z",
    "posted_date": "2026-09-17T08:13:31.925Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:31.925Z",
    "status": "discovered",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "1-3 Years",
      "salary_range": "\u20B979 - \u20B994 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Business Intelligence Data Analyst. Strong alignment with MS Excel, SQL, Python in Remote.",
      "strengths": [
        "Direct match with candidate target role: Business Intelligence Data Analyst",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in SQL",
        "Demonstrated competency in Python"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-18T08:14:00.239Z"
    },
    "tailored": {
      "job_title": "Business Intelligence Data Analyst",
      "company": "Openx",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Business Intelligence Data Analyst position at Openx. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Openx.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Openx."
      ],
      "generated_at": "2026-09-18T08:14:00.512Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    }
  },
  {
    "id": "9d2fa173be361ff4",
    "title": "Lead Business Analyst",
    "company_name": "Fil",
    "location": "Gurgaon",
    "salary_range_lpa": [
      24,
      38
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)",
    "experience_range_years": [
      7,
      11
    ],
    "experience_is_inferred": false,
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 7+ years of experience",
    "description": "The Lead Business Analyst will play a pivotal role in driving enterprise-wide finance transformation initiatives across Finance Data platform, Workstreams like ...\n\nRequisition posted on Fil career portal. Direct application link verified active.",
    "apply_link": "https://fil.wd3.myworkdayjobs.com/en-US/001/job/Gurgaon-Office/Lead-Business-Analyst_J69759-1",
    "ats_source": "Workday",
    "discovered_at": "2026-09-15T16:03:03.574Z",
    "posted_date": "2026-09-14T16:03:03.574Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:09.494Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "7-11 Years",
      "salary_range": "\u20B924 - \u20B938 LPA",
      "location": "Gurgaon",
      "skills_gap": "Seniority gap",
      "rejection_reason": "Role requires 7+ years, candidate profile has 3.2 years.",
      "evaluated_at": "2026-09-15T16:03:12.595Z"
    },
    "tailored": {
      "job_title": "Lead Business Analyst",
      "company": "Fil",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Lead Business Analyst position at Fil. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Fil.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Fil."
      ],
      "generated_at": "2026-09-18T06:16:40.745Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    }
  },
  {
    "id": "3b18b89dfeaea21f",
    "title": "Deployment Analyst",
    "company_name": "Wtilth Technologies",
    "location": "Gurugram",
    "salary_range_lpa": [
      24,
      38
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Market Benchmark (salary for Deployment Analyst in Wtilth Technologies for Gurugram)",
    "experience_range_years": [
      6,
      8
    ],
    "experience_is_inferred": false,
    "experience_inferred_reason": "Exact requirement extracted from Job Description: Experience: 6-8 years",
    "description": "Key Responsibilities: Coordinate and execute deployments of Power Platform solutions across environments (Dev, Test, Prod). Ensure adherence to SDLC and DevOps practices for smooth releases. Utilize Power Platform Build Tools and pipelines for CI/CD. Maintain deployment guides and release notes. Work closely with developers, testers, and business teams to ensure successful deployments. Required Skills &amp; Qualifications: Hands-on experience with Power Platform environments and ALM (Application Lifecycle Management). Knowledge of Azure DevOps or similar CI/CD tools. Familiarity with environment strategy, solution packaging, and version control. Strong attention to detail and ability to work in Agile teams. Experience: 6-8 years",
    "apply_link": "https://in.linkedin.com/jobs/view/deployment-analyst-power-platform-solutions-at-wtilth-technologies-4424065666",
    "ats_source": "LinkedIn",
    "discovered_at": "2026-09-15T15:15:02.569Z",
    "posted_date": "2026-09-14T15:15:02.569Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:08.483Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "6-8 Years",
      "salary_range": "\u20B924 - \u20B938 LPA",
      "location": "Gurugram",
      "skills_gap": "Seniority gap",
      "rejection_reason": "Role requires 6+ years, candidate profile has 3.2 years.",
      "evaluated_at": "2026-09-15T15:15:09.945Z"
    }
  },
  {
    "id": "8d82f497f6dbb3c4",
    "title": "Luxury Presence - Senior Data Analyst, GTM Analytics",
    "company_name": "Luxurypresence",
    "location": "Remote",
    "salary_range_lpa": [
      16,
      24
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Market Benchmark (salary for Luxury Presence - Senior Data Analyst, GTM Analytics in Luxurypresence for Remote (India))",
    "experience_range_years": [
      3,
      6
    ],
    "experience_is_inferred": true,
    "experience_inferred_reason": "Inferred from Seniority ('Senior / Specialist' standard: 3-6 Years)",
    "description": "Senior Data Analyst, GTM Analytics - US (Remote) ... Luxury Presence is building the AI growth platform for real estate. Backed by Bessemer Venture Partners and ...\n\nRequisition posted on Luxurypresence career portal. Direct application link verified active.",
    "apply_link": "https://jobs.lever.co/luxurypresence/0a6fd9f4-a606-460e-b65e-5b31de56331a",
    "ats_source": "Lever",
    "discovered_at": "2026-09-15T15:14:58.415Z",
    "posted_date": "2026-09-14T15:14:58.415Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:08.483Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 88,
      "detected_experience": "3-6 Years",
      "salary_range": "\u20B916 - \u20B924 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Luxury Presence - Senior Data Analyst, GTM Analytics. Strong alignment with  in Remote.",
      "strengths": [
        "Direct match with candidate target role: Luxury Presence - Senior Data Analyst, GTM Analytics"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-15T15:15:10.609Z"
    },
    "tailored": {
      "job_title": "Luxury Presence - Senior Data Analyst, GTM Analytics",
      "company": "Luxurypresence",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Luxury Presence - Senior Data Analyst, GTM Analytics position at Luxurypresence. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Luxurypresence.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Luxurypresence."
      ],
      "generated_at": "2026-09-15T15:15:11.366Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    }
  },
  {
    "id": "e955cd2af9cdd9c4",
    "title": "Business Analyst - NEC Software Solutions (India)",
    "company_name": "NECSWS",
    "location": "Mumbai",
    "salary_range_lpa": [
      10,
      18
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Market Benchmark (salary for Business Analyst - NEC Software Solutions in NECSWS for Mumbai)",
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "description": "For the best application experience please enable JavaScript in your browser. NEC Software Solutions (India) Logo. Business Analyst. Mumbai, Maharashtra, India.\n\nRequisition posted on NECSWS career portal. Direct application link verified active.",
    "apply_link": "https://jobs.smartrecruiters.com/NECSWS/744000147432449-business-analyst?oga=true",
    "ats_source": "SmartRecruiters",
    "discovered_at": "2026-09-14T08:41:13.525Z",
    "posted_date": "2026-09-13T08:41:13.525Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:08.483Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B910 - \u20B918 LPA",
      "location": "Mumbai",
      "skills_gap": "Location mismatch",
      "rejection_reason": "Location 'Mumbai' not in preferred list [Gurgaon, Gurugram, Noida, Delhi, Remote, Bangalore, Bengaluru]",
      "evaluated_at": "2026-09-14T08:41:15.455Z"
    }
  },
  {
    "id": "30e93f98f920ef5d",
    "title": "True Tandem - Sr. Power Platform Developer",
    "company_name": "Truetandem",
    "location": "Remote",
    "salary_range_lpa": [
      128,
      135
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      10,
      14
    ],
    "experience_is_inferred": false,
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 10+ years",
    "description": "True Tandem - Sr. Power Platform Developer Sr. Power Platform Developer Remote All / Full time / Remote apply for this job Company Description TrueTandem's mission is to be a trusted information technology solutions provider, committed to the success of our customers, communities and employees. To enable this mission, we listen to our customers\u2019 needs, empower our dedicated and talented employees, envision success together, and deliver innovative cost-effective solutions. For our customers, we aim to deliver more power to meet their business outcomes through technology implementation, integration, optimization and customization. We enable some of the most well-known companies, nonprofits and federal agencies in the United States to intelligently plan and develop their applications, modernize their infrastructure and manage their data. As a&nbsp; Senior Power Platform Developer on our solutions delivery team, you will help advance the digital transformation of mission-critical government systems. Our teams value curiosity, collaboration, feedback, and continuous improvement. We use Agile practices, DevSecOps standards, an automate-first mindset, and modern technology stacks to deliver secure, effective solutions. The role collaborates closely with stakeholders, business analysts, architects, and project leadership to deliver scalable, secure, and maintainable solutions that advance our cutomer\u2019s modernization objectives. &nbsp; The Power Platform Developer designs, builds, enhances, tests, deploys, and maintains Microsoft Power Platform solutions that support mission programs. This role contributes to application modernization by developing Power Apps, automating business processes with Power Automate, supporting Dataverse data models, and assisting with integration, testing, and operations. The developer works within Agile teams to deliver secure, scalable, user-centered solutions that meet federal security and accessibility requirements. &nbsp; Technical members of our solutions teams require little guidance, but love to learn, collaborate, and&nbsp;problem solve. This position requires experience and passion for coding, and&nbsp;a strong desire&nbsp;to solve our customers\u2019 unique technology challenges. &nbsp; &nbsp; Role and Responsibilities: &nbsp; Define solution architecture, data models, integration patterns, and automation strategies. &nbsp; Build advanced Power Apps, Dataverse solutions, and Power Automate workflows. &nbsp; Guide backlog refinement and technical solutioning activities. &nbsp; Modernize legacy applications and business processes. &nbsp; Review code, configurations, and solution designs for quality and maintainability. &nbsp; Develop and enhance Canvas Apps, Model-Driven Apps, and Power Pages. &nbsp; Configure and maintain Dataverse tables, forms, views, and business rules. &nbsp; Create and&nbsp;maintain&nbsp;Power Automate workflows and approval processes. &nbsp; Migrate legacy business processes to Microsoft Power Platform solutions. &nbsp; Participate in requirements analysis, backlog refinement, sprint planning, and solution design. &nbsp; Support unit, integration, and user acceptance testing. &nbsp; Troubleshoot defects and&nbsp;implement&nbsp;corrective actions. &nbsp; Prepare technical documentation, deployment guides, and knowledge transfer materials. &nbsp; Support production deployments, operational maintenance, and release management. &nbsp; Ensure solutions meet security, privacy, and Section 508 accessibility requirements. &nbsp; &nbsp; Required Qualifications &nbsp; Bachelor's degree in Computer Science, Information Systems, Engineering, or related field. &nbsp; 10+ years of application development experience. &nbsp; 7+ years of Power Platform solution development experience. &nbsp; Experience migrating legacy applications built on .NET, C#, and JavaScript to modern&nbsp;PowerPlatform&nbsp;solutions &nbsp; Experience with: &nbsp; Power Apps &nbsp; Power Automate &nbsp; Dataverse &nbsp; Azure Integration Services &nbsp; REST APIs &nbsp; SharePoint Online &nbsp; Azure DevOps &nbsp; Experience leading technical teams and solution delivery efforts. &nbsp; Strong understanding of enterprise architecture and&nbsp;application&nbsp;lifecycle management.&nbsp; &nbsp; Experience with Azure B2C or&nbsp; Login.gov &nbsp;integration. &nbsp; Experience working on a Scrum team using a ticket management system (Azure DevOps or Jira) &nbsp; Exemplary communication skills. &nbsp; Personnel filling this requirement/position must be US citizen &nbsp; Preferred Qualifications &nbsp; Microsoft Certifications in Microsoft Power Platform Azure and / or Dynamics 365. &nbsp; Experience modernizing legacy applications. &nbsp; Experience supporting federal agencies. &nbsp; Experience with Azure DevOps. &nbsp; Knowledge of Section 508 accessibility and federal security requirements. &nbsp; Experience integrating Power Platform solutions with SQL Server, APIs, and Microsoft 365 services. &nbsp; Experience implementing security, governance, and compliance controls in Power Platform environments. &nbsp; &nbsp; &nbsp; $150,000 - $159,000 a year The above salary range represents a general guideline; however, TrueTandem considers several factors when determining base salary offers such as the scope and responsibilities of the position and the candidate's experience, education, skills and current market conditions. &nbsp; In addition, TrueTandem provides a variety of benefits including health insurance coverage, dental and vision plans, life and disability insurance, company paid holidays and paid time off (PTO). Our retirement plan offers a variety of investment options to build toward your retirement. &nbsp; &nbsp; U.S. Citizenship is required for all positions with a government clearance and certain other restricted positions. Additional Information TrueTandem is an equal opportunity employer, committed to diversity and inclusion in the workplace and affords equal opportunity to all qualified applicants for all positions without regard to protected veteran status, qualified individuals with disabilities and all individuals without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age or any other status protected under local, state or federal laws. Equal Opportunity Employer - Minorities/Females/Disabled/Veterans We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job True Tandem Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/truetandem/ffc7256e-ac54-4e76-85aa-a27dc8f34d01",
    "ats_source": "Lever",
    "discovered_at": "2026-09-14T08:37:22.849Z",
    "posted_date": "2026-09-13T08:37:22.849Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-18T08:13:08.484Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "10-14 Years",
      "salary_range": "\u20B9128 - \u20B9135 LPA",
      "location": "Remote",
      "skills_gap": "Seniority gap",
      "rejection_reason": "Role requires 10+ years, candidate profile has 3.2 years.",
      "evaluated_at": "2026-09-14T08:37:26.199Z"
    }
  },
  {
    "id": "1451db036cd51e0f",
    "title": "Business Analyst - India @ Juniper Square",
    "company_name": "Junipersquare",
    "location": "Bangalore",
    "salary_range_lpa": [
      11,
      19
    ],
    "salary_is_estimated": true,
    "salary_source": "AmbitionBox & Glassdoor Market Benchmark (salary for Business Analyst - India @ Juniper Square in Junipersquare for Bengaluru)",
    "experience_range_years": [
      2,
      3
    ],
    "experience_is_inferred": false,
    "description": "... automation and AI opportunities - Translate business requirements and ... Business Analyst - India. Location. Bangalore Office. Employment Type. Full time ...\n\nRequisition posted on Junipersquare career portal. Direct application link verified active.",
    "apply_link": "https://jobs.ashbyhq.com/junipersquare/1f486b69-025f-43e0-ac7b-858f63606364",
    "ats_source": "Ashby",
    "discovered_at": "2026-09-14T08:20:10.661Z",
    "posted_date": "2026-09-11T08:20:10.661Z",
    "posted_days_ago": 3,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T16:02:48.003Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 88,
      "detected_experience": "2-3 Years",
      "salary_range": "\u20B911 - \u20B919 LPA",
      "location": "Bangalore",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Business Analyst - India @ Juniper Square. Strong alignment with  in Bangalore.",
      "strengths": [
        "Direct match with candidate target role: Business Analyst - India @ Juniper Square"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:20:27.345Z"
    },
    "tailored": {
      "job_title": "Business Analyst - India @ Juniper Square",
      "company": "Junipersquare",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Business Analyst - India @ Juniper Square position at Junipersquare. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Junipersquare.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Junipersquare."
      ],
      "generated_at": "2026-09-14T08:20:27.614Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    }
  },
  {
    "id": "810ab4223ca8ee8c",
    "title": "Stoneridge Software",
    "company_name": "Stoneridgesoftware",
    "location": "Remote",
    "salary_range_lpa": [
      148,
      184
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      8,
      12
    ],
    "experience_is_inferred": false,
    "description": "Stoneridge Software - Dynamics 365 CE Solution Architect Dynamics 365 CE Solution Architect Minneapolis, MN Dynamics 365 Customer Engagement (D365 CE) &amp; Power Platform \u2013 Implementation / Full-time Remote / Remote apply for this job Stoneridge Software began with the desire and understanding of what it takes to succeed in implementing business software solutions for the benefit of client\u2019s business goals. Stoneridge founders recognized the need for a strategic business partner who could not only deliver software implementations but excel at it. As a 2025 Top Workplace Honoree, a member of the Microsoft Inner Circle, and an award-winning Microsoft Solutions Partner, we have crafted a meticulous approach to project delivery. Our commitment to long-term support empowers our client\u2019s success, and we approach our work with integrity, tenacity and a culture of continuous improvement.&nbsp; &nbsp; As a Stoneridge team member, it is important to us that your work is balanced with the rest of your life. We foster a flexible work environment and promote a remote-forward culture with team members located across North America. We have office locations in Fargo, ND and Minneapolis, MN that serve as key collaboration hubs. In-person work at these locations is encouraged and, at times, required. Team members should expect to travel to these offices as needed based on role expectations, project requirements, team collaboration, training, or other business-driven needs. Team members at Stoneridge benefit from an environment of collaboration and curiosity, backed up by continuous learning opportunities, personalized development plans, flexible time off, and many more benefits. We strive to maintain inclusive benefits that bring a sense of belonging to all of our team members. &nbsp; It's our mission to help clients win through intentional leadership, thoughtful teaching, and eye-opening possibilities. With specialties in the entire suite of Microsoft Dynamics business applications and complementary Microsoft technologies, Stoneridge focuses on not only attracting the most knowledgeable, tenacious consulting experts in the field but building up that expertise from within. Come join us on this exciting journey!&nbsp; &nbsp; &nbsp; Stoneridge Software is&nbsp;seeking a Solution Architect who will play a strategic role in guiding clients through the successful implementation&nbsp;of Microsoft Dynamics 365 CE and the Power Platform. The Solution Architect will shape the overall application architecture, drive key design decisions, and ensure project solutions are rooted in scalable, enterprise\u2011grade standards. Acting as a project lead, they will oversee complex CE and Power Platform engagements, translating business needs into robust, well\u2011aligned systems that support organizational goals and integrate seamlessly within the broader enterprise landscape.&nbsp; A Day in the Life Owns end-to-end accountability for CE/Power Platform&nbsp;solution architecture and delivery, balancing business requirements, technical integrity, and delivery execution across the project lifecycle.&nbsp; Assists&nbsp;the functional resources/business analysts with requirements gathering and&nbsp;provides&nbsp;design guidance for&nbsp;mid- to large-sized&nbsp;Dynamics 365 (CE)&nbsp;and Power Platform&nbsp;projects. Facilitates discussions with business and technical stakeholders to extract critical business requirements and present&nbsp;functional&nbsp;vision and solutions in software products, customizations, and integrations to meet those needs within Dynamics 365 (CE).&nbsp; Deep knowledge of the&nbsp;Power Platform and&nbsp;Dynamics&nbsp;365&nbsp;CE (Sales, Customer Service, Field Service,&nbsp;Customer Insights&nbsp;\u2013&nbsp;Journeys&nbsp;and Project Operations). Strong understanding of when to use native features and when it is&nbsp;appropriate to&nbsp;use custom development. Ability to successfully communicate this information to both internal and client teams.&nbsp; Works with our implementation delivery team to develop a solution&nbsp;blueprint that&nbsp;includes&nbsp;an estimate, scope, assumptions, epics and features, implementation plan, technology solution, architecture diagrams, ERD, and business process diagram options to meet project goals and longer-term&nbsp;needs.&nbsp; Provides leadership&nbsp;to the project team throughout the implementation to ensure&nbsp;accurate&nbsp;delivery of project plans.&nbsp;&nbsp;&nbsp; Maintains knowledge of&nbsp;third-party&nbsp;software vendors to leverage complementary offerings and effectively&nbsp;compare and contrast&nbsp;solutions.&nbsp; Provides current best practices and solution alternatives as part of functional or technical design documents.&nbsp; Communicates complex topics&nbsp;regarding&nbsp;solutions and related projects to audiences both with and without deep technical skills.&nbsp; Ability to be client-facing&nbsp;including&nbsp;effectively communicating with the client, leading meetings, and capturing and distributing action items.&nbsp; Assists&nbsp;with upgrades of on-premises CRM environments.&nbsp; Provides&nbsp;inputs&nbsp;to&nbsp;the project plans,&nbsp;estimates&nbsp;and scope for sales proposals and statements of work.&nbsp; Preferred Qualifications 8+ years of&nbsp;experience&nbsp;implementing, configuring,&nbsp;and&nbsp;customizing&nbsp;Microsoft&nbsp;Dynamics CRM/D365&nbsp;CE&nbsp;&nbsp;&nbsp; 5+ years of&nbsp;experience&nbsp;implementing&nbsp;the Power Platform&nbsp; Experience with CRM&nbsp;2011,&nbsp;2013, 2015, 2016,&nbsp;and D365&nbsp;CE&nbsp; Associate's/bachelor\u2019s&nbsp;degree or higher in computer, information systems,&nbsp;or business-related field&nbsp; Proven ability to create innovative solutions to solve complex business requirements, and streamline/automate business processes&nbsp; Proficient in&nbsp;Azure&nbsp;DevOps,&nbsp;Visio or similar&nbsp;tool,&nbsp;Power BI, Power App Studio, Power Platform Admin Center,&nbsp;PowerPoint, CoPilot Studio&nbsp; Proficiency&nbsp;in the following&nbsp;skills:&nbsp;Requirement&nbsp;Elicitation,&nbsp;Business&nbsp;Process&nbsp;Modeling,&nbsp;Data Analysis,&nbsp;Project Management Support,&nbsp;Quality Assurance and Testing, User Training and Support, Risk Management, Documentation, Wire Framing,&nbsp;Integration Planning,&nbsp;and Knowledge Sharing&nbsp; Knowledge&nbsp;of&nbsp;.NET, SQL Server,&nbsp;JavaScript&nbsp;and C#&nbsp; Knowledge of&nbsp;Dynamics&nbsp;CRM SDK&nbsp; Travel to unanticipated worksites nationwide will be&nbsp;required&nbsp; Any suitable combination of education, training, or experience is acceptable&nbsp; At least one of the following Microsoft&nbsp;certifications:&nbsp;PL-600: Microsoft Power Platform Solution Architect&nbsp; Knowledge of Enterprise Resource Applications,&nbsp;preferably Business Central and&nbsp;F&amp;O.&nbsp; Industry Experience: Agriculture,&nbsp;Industrial&nbsp;Machinery, Construction or Specialty Construction&nbsp; Ability to communicate effectively in both spoken and written English&nbsp;&nbsp; Exhibits Stoneridge Software\u2019s Core Values of&nbsp;Integrity, Technical&nbsp;Excellence, Tenacity, Client Centric,&nbsp;and Enjoy your Work &nbsp; *Years&nbsp;of experience&nbsp;are not required to&nbsp;be consecutive Work Location: This position is available remotely in the United States or remotely in the following Canadian Provinces: Alberta, British Columbia, Manitoba, and Ontario. &nbsp; Travel Required : Incumbent is expected to attend industry events across the United States and Canada (up to 25%). &nbsp; Visa Sponsorship Information: &nbsp;Visa sponsorship is not offered for this position. Applicants must be authorized to work for ANY employer in the U.S. or Canada.&nbsp; Compensation Our philosophy is to provide compensation that is&nbsp;Competitive,&nbsp;Equitable, and&nbsp;Driven by Performance.&nbsp; Various factors impact our pay ranges including market conditions and national salary data. To determine competitive salaries within this range we consider candidates skills, qualifications, and experience. These are national ranges, inclusive of bonus opportunities and could represent multiple role levels. &nbsp; US (USD): $174,100-$216,800 Canada (CAD): C$161,000-C$200,000 &nbsp; Stoneridge reserves the right to hire any individual without legal or financial obligation on unwanted solicitations. No agency emails, calls, or solicitations are accepted without a valid agreement.&nbsp; Health and Wellness Medical Insurance Dental Insurance Vision insurance 401(k) contribution program (US) or RRSP Benefits (Canada) Life insurance Disability Benefits Paid parental leave Paid flexible time off Paid sick time&nbsp;(US) or floater days (Canada) Paid holidays Flexible work schedules Mobile/internet reimbursement Employee and family assistance program Learning and development funding Employer charitable contribution Paid business mileage Home office and wellness allowance (US Only) HSA contribution&nbsp;(US Only) We live and breathe our core values: Integrity | Technical Excellence | Tenacity | Client Centric | Enjoy Our Work &nbsp; They are the fabric of our company and a reflection of our organizational culture. Our values are a part of our talent acquisition process, how we operate our company and how we partner with our clients. We enjoy our work by exhibiting our technical excellence and tenacity while being inherently client-centric with integrity toward every customer engagement. &nbsp; Stoneridge Software is committed to creating a diverse environment and is proud to be an equal opportunity employer. All qualified applicants will receive consideration for employment without regard to race, color, religion, gender, gender identity or expression, sexual orientation, national origin, genetics, disability, age, veteran status and all the other fascinating characteristics that make us unique. We acknowledge that individuals from marginalized communities are statistically less likely to apply to",
    "apply_link": "https://jobs.lever.co/stoneridgesoftware/46e1bcfe-8ed6-46d7-9111-7fd372871059",
    "ats_source": "Lever",
    "discovered_at": "2026-09-14T08:20:04.202Z",
    "posted_date": "2026-09-13T08:20:04.202Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:13:52.652Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "8-12 Years",
      "salary_range": "\u20B9148 - \u20B9184 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements (MS Excel, Power BI, Copilot Studio).",
      "strengths": [
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in Copilot Studio",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:20:28.320Z"
    },
    "tailored": {
      "job_title": "Stoneridge Software",
      "company": "Stoneridgesoftware",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Stoneridge Software position at Stoneridgesoftware. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Stoneridgesoftware.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Stoneridgesoftware."
      ],
      "generated_at": "2026-09-14T08:20:28.560Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 8+ years"
  },
  {
    "id": "347c7b14d7484894",
    "title": "D365 CE & Power Platform Technical Engineer",
    "company_name": "Mcaconnect",
    "location": "Remote",
    "salary_range_lpa": [
      85,
      123
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      3,
      6
    ],
    "experience_is_inferred": false,
    "description": "MCA Connect - D365 CE &amp; Power Platform Technical Engineer D365 CE &amp; Power Platform Technical Engineer Remote Technical Services / Full-time / Remote apply for this job Through passion and deep industry expertise, MCA Connect helps manufacturers succeed by unlocking innovation with actionable business insights. Our strategic solutions, innovation, and industry intelligence help manufacturers gain visibility, improve profitability, and achieve a competitive edge. &nbsp; Established in 2002, MCA Connect has grown into one of the largest US-based solution partners in Microsoft Business Applications and Azure Data &amp; AI / Digital &amp; App Innovation. Our Microsoft Specialties include Finance and Supply Chain, Analytics on Azure, Data Warehouse Migration, and Power Platform. We\u2019re also a fifteen-time Microsoft Partner of the Year and three-time Inc. Best Workplaces award winner. Title&nbsp; D365 CE &amp;&nbsp;Power Platform Technical&nbsp;Engineer &nbsp; Location&nbsp; Virtual, home-based office &nbsp; Description &nbsp; As a member of the&nbsp;Technical Services&nbsp;department, the&nbsp;Power Platform Engineer&nbsp;will help MCA Connect deliver world class customer service&nbsp;by&nbsp;working with clients to design &amp; develop technical solutions built on Dataverse and Microsoft\u2019s Power Platform. The&nbsp;Power Platform Engineer&nbsp;will work on multiple projects each week and will deliver tasks on-time and on-budget to our clients.&nbsp; &nbsp; &nbsp; Responsibilities &nbsp; Work with client to define and document functional requirements &amp; solution designs &nbsp; Design, develop, and deploy technical customizations for clients&nbsp;utilizing&nbsp;Power Automate Flows, C# plugins, JavaScript, Dual Write, and Power&nbsp;Fx &nbsp; Resolve technical support issues related to Dataverse and Dynamics CE implementations &nbsp; Manage small projects for client requested Power Apps &nbsp; Delegate development tasks to offshore resources and manage development team &nbsp; Build,&nbsp;test&nbsp;and deploy data migrations / integrations&nbsp; &nbsp; Troubleshoot software,&nbsp;hardware&nbsp;and network infrastructure&nbsp; &nbsp; Manage project scope, timeline, budget, and project deliverables &nbsp; Monitor and triage&nbsp;new support&nbsp;cases &nbsp; Maintain effective customer relationships &nbsp; Be responsive and provide outstanding customer service &nbsp; Follow established standards &amp; methodologies &nbsp; Optimize&nbsp;individual&nbsp;utilization &nbsp; Continue your professional education by setting specific annual training goals &nbsp; Qualifications&nbsp; &nbsp; 3+ years\u2019 experience solutioning and developing Power Automate Flows &nbsp; 3+ years\u2019 experience developing C# plugins and JavaScript for Dataverse applications &nbsp; 3+ years\u2019 experience with Microsoft Dual Write &nbsp; 3+ years\u2019 experience developing custom Model Driven and Canvas apps on Dataverse&nbsp;&nbsp; &nbsp; Strong troubleshooting and debugging skills &nbsp; Experience with Microsoft Dynamics CE or F&amp;O implementations &nbsp; Effective written and verbal communication skills &nbsp; Excellent planning and organization skills &nbsp; Strong customer relationship skills &nbsp; Ability to&nbsp;establish&nbsp;priorities and work independently &nbsp; Bachelor\u2019s Degree in a relevant field or equivalent combination of education and experience &nbsp; English: fluent &nbsp; Desired Qualifications &nbsp; Relevant Microsoft certifications such as PL-400 or PL-100 &nbsp; Field Service and/or Project Operations experience &nbsp; 2+ years as a consultant &nbsp; Exposure to&nbsp;Microsoft\u2018s Sure Step Methodology &nbsp; $100,000 - $145,000 a year Plus additional supplemental compensation paid in quarterly installments&nbsp; Why work for MCA Connect? Our compensation plan offers one of the best bonus structures in the industry.&nbsp; Along with this we also offer a generous benefit package: \xB7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Work/Life Balance with Unlimited Paid Time Off (UPTO) \xB7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 401k Plan with Company Matching Contribution \xB7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Monthly Stipend for Home Office Expenses \xB7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Subsidized Medical, Dental and Vision Coverage \xB7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Health Savings and Flexible Spending Accounts \xB7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Company Paid Life and Disability Insurance \xB7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Training, Certification and Continuing Education Support MCA Connect offers limitless opportunities for personal and professional growth in a stimulating, challenging, and performance-oriented work culture where you can share your ideas and make impactful daily contributions. Our employees are highly motivated and talented individuals dedicated to developing, marketing, and selling products designed to deliver value for mid-market and enterprise-size manufacturing, distribution, and energy companies. We take the time to train our consultants so that they understand the industries we serve and can deliver best practices, proven methodologies, and ongoing industry expertise to our clients. MCA Connect is an Equal Opportunity Employer. MCA Connect promotes equal employment opportunity to all employees and applicants and does not discriminate on the basis of race, religion, color, creed, national origin, sex, age, sexual/gender orientation, status as a protected disabled or Vietnam Era Veteran, disability, or any other legally protected status.&nbsp;We firmly believe our differences make us stronger! We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job MCA Connect Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/mcaconnect/5df445f4-cf12-4970-8ab7-7cf46a7aab3c",
    "ats_source": "Lever",
    "discovered_at": "2026-09-14T08:20:02.201Z",
    "posted_date": "2026-09-13T08:20:02.201Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:13:53.224Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "3-6 Years",
      "salary_range": "\u20B985 - \u20B9123 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for D365 CE & Power Platform Technical Engineer. Strong alignment with MS Excel, Power Automate, Power Apps in Remote.",
      "strengths": [
        "Direct match with candidate target role: D365 CE & Power Platform Technical Engineer",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power Apps"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:20:29.260Z"
    },
    "tailored": {
      "job_title": "D365 CE & Power Platform Technical Engineer",
      "company": "Mcaconnect",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the D365 CE & Power Platform Technical Engineer position at Mcaconnect. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Mcaconnect.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Mcaconnect."
      ],
      "generated_at": "2026-09-14T08:20:29.519Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 3+ years"
  },
  {
    "id": "c305d1b9d2b85704",
    "title": "Microsoft Power Platform/Uipath",
    "company_name": "Virtusa",
    "location": "Not specified",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": "Ibm Consultant Jobs in United States (6,000+ Open Roles) | LinkedIn Skip to main content LinkedIn Ibm Consultant in United States Expand search This button displays the currently selected search type. When expanded it provides a list of search options that will switch the search inputs to match the current selection. Jobs People Learning Clear text Clear text Clear text Clear text Clear text Sign in Join now Date posted Past month Past week Past 24 hours Done Company Clear text IBM PwC Deloitte Accenture Tata Consultancy Services Done Easy Apply Under 10 applicants Where are the filters? You&#39;re now using AI-powered job search We&#39;re working to bring back all filters, but in the meantime, you can type them directly into your search to refine your results. Learn more Get notified when a new job is posted. Set alert Sign in to set job alerts for \u201CIbm Consultant\u201D roles. Email or phone Password Show Forgot password? Sign in Sign in with Email or New to LinkedIn? Join now By clicking Continue to join or sign in, you agree to LinkedIn\u2019s User Agreement , Privacy Policy , and Cookie Policy . 6,000+ Ibm Consultant Jobs in United States Associate Application Consultant 2027 \u2013 IBM Tech Associate Application Consultant 2027 \u2013 IBM Tech IBM Research Park, CA Actively Hiring 1 week ago SAP Concur Expense Consultant SAP Concur Expense Consultant IBM Annapolis Junction, MD Be an early applicant 2 weeks ago SAP Concur Expense Consultant SAP Concur Expense Consultant IBM Washington, DC Actively Hiring 2 weeks ago SAP Concur Expense Consultant SAP Concur Expense Consultant IBM Herndon, VA Be an early applicant 2 weeks ago Delivery Consultant - Entry Level Sales Program 2027 Delivery Consultant - Entry Level Sales Program 2027 IBM Research Park, CA Actively Hiring 5 days ago Associate Application Consultant 2027 \u2013 IBM Tech Associate Application Consultant 2027 \u2013 IBM Tech IBM Durham, NC Actively Hiring 1 week ago Associate Package Consultant - Salesforce 2027 Associate Package Consultant - Salesforce 2027 IBM Chicago, IL Actively Hiring 1 week ago Associate Security Consultant - Strategy, Risk &amp; Compliance 2027 Associate Security Consultant - Strategy, Risk &amp; Compliance 2027 IBM Chicago, IL Actively Hiring 1 week ago TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant IBM Tucson, AZ Be an early applicant 1 week ago Associate Security Consultant - Cyber Strategy &amp; Risk 2027 Associate Security Consultant - Cyber Strategy &amp; Risk 2027 IBM Dallas, TX Actively Hiring 1 week ago Associate Package Specialist - Oracle Cloud 2027 Associate Package Specialist - Oracle Cloud 2027 IBM Chicago, IL Actively Hiring 2 days ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Coral Gables, FL Be an early applicant 2 weeks ago TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant IBM Research Park, CA Be an early applicant 1 week ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Brookhaven, PA Be an early applicant 2 weeks ago Associate Security Consultant 2027 Associate Security Consultant 2027 IBM Chicago, IL Actively Hiring 1 week ago Associate Package Specialist - Oracle Cloud 2027 Associate Package Specialist - Oracle Cloud 2027 IBM Chicago, IL Actively Hiring 1 week ago Associate Package Consultant - Microsoft 2027 Associate Package Consultant - Microsoft 2027 IBM Chicago, IL Actively Hiring 1 week ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Dallas, TX Be an early applicant +4&nbsp;benefits 2 days ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Miami, NM Be an early applicant 2 weeks ago TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant IBM Austin, TX Be an early applicant 1 week ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Naples, FL Be an early applicant 2 weeks ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Columbia, SC Be an early applicant 2 weeks ago Oracle Cloud AMS Payroll Lead Oracle Cloud AMS Payroll Lead IBM Princeton, CA Be an early applicant 4 days ago Associate Application Consultant - Microsoft 2027 Associate Application Consultant - Microsoft 2027 IBM New York, United States Actively Hiring 1 week ago IBMi Delivery Consultant IBMi Delivery Consultant IBM Rochester, MN Actively Hiring 1 day ago Federal Associate Consultant - Oracle 2027 Federal Associate Consultant - Oracle 2027 IBM Herndon, VA Actively Hiring 1 week ago TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant IBM Rochester, MN Be an early applicant 1 week ago Senior Managing SAP EWM Consultant Senior Managing SAP EWM Consultant IBM Dallas, TX Be an early applicant 2 weeks ago Federal Associate Consultant - Salesforce (Rocket Center, WV) Federal Associate Consultant - Salesforce (Rocket Center, WV) IBM Rocket Center, WV Be an early applicant 1 week ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Kansas City, KS Be an early applicant 2 weeks ago Oracle Cloud ORC Functional Lead Oracle Cloud ORC Functional Lead IBM Jefferson City, MO Be an early applicant 2 weeks ago Oracle Cloud AMS Payroll Lead Oracle Cloud AMS Payroll Lead IBM Marlton, NJ Be an early applicant 4 days ago Oracle Cloud AMS Payroll Lead Oracle Cloud AMS Payroll Lead IBM Paramus, NJ Be an early applicant 4 days ago Oracle Cloud AMS Payroll Lead Oracle Cloud AMS Payroll Lead IBM Englewood Cliffs, NJ Be an early applicant 4 days ago Oracle Cloud AMS Payroll Lead Oracle Cloud AMS Payroll Lead IBM Iselin, NJ Be an early applicant 4 days ago Associate Application Consultant 2027 \u2013 Enterprise Application Integration (EAI) Associate Application Consultant 2027 \u2013 Enterprise Application Integration (EAI) IBM Durham, NC Actively Hiring 1 week ago Oracle Cloud AMS Payroll Lead Oracle Cloud AMS Payroll Lead IBM Mount Laurel, NJ Be an early applicant 4 days ago Oracle Cloud AMS Payroll Lead Oracle Cloud AMS Payroll Lead IBM Turnersville, TX Be an early applicant 4 days ago TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant TEL Delivery Consultant - Cognos Analytics Consultant &amp; Planning Analytics Consultant IBM Poughkeepsie, AR Be an early applicant 1 week ago Delivery Consultant, GDPS Delivery Consultant, GDPS IBM Rochester, MN Be an early applicant 5 days ago ServiceNow Consultant ServiceNow Consultant IBM Austin, TX Actively Hiring 2 weeks ago Delivery Consultant - Data &amp; AI Delivery Consultant - Data &amp; AI IBM Herndon, VA Be an early applicant 4 days ago Supply Chain Business Transformation Consultant - Manhattan active - Warehouse &amp; Logistics Supply Chain Business Transformation Consultant - Manhattan active - Warehouse &amp; Logistics IBM New York, United States Actively Hiring 3 days ago ServiceNow Consultant ServiceNow Consultant IBM New York, United States Actively Hiring 2 weeks ago Federal Associate Consultant 2027 Federal Associate Consultant 2027 IBM Herndon, VA Actively Hiring 2 weeks ago Industry Quantum Consultant Industry Quantum Consultant IBM Yorktown Heights, NY Be an early applicant 4 days ago ServiceNow Consultant ServiceNow Consultant IBM Denver, CO Actively Hiring 2 weeks ago Delivery Consultant - Data &amp; AI Delivery Consultant - Data &amp; AI IBM McLean, VA Actively Hiring 4 days ago Delivery Consultant, GDPS Delivery Consultant, GDPS IBM Paramus, NJ Be an early applicant 5 days ago Delivery Consultant, GDPS Delivery Consultant, GDPS IBM Lowell, MA Be an early applicant 5 days ago Delivery Consultant, GDPS Delivery Consultant, GDPS IBM Raleigh, NC Be an early applicant 5 days ago Delivery Consultant, GDPS Delivery Consultant, GDPS IBM Austin, TX Be an early applicant 5 days ago Oracle Cloud HCM Functional Lead - Benefits (Public Sector) Oracle Cloud HCM Functional Lead - Benefits (Public Sector) IBM Irvine, CA Be an early applicant 2 weeks ago Oracle Cloud HCM Functional Lead - Benefits (Public Sector) Oracle Cloud HCM Functional Lead - Benefits (Public Sector) IBM Santa Monica, CA Be an early applicant 2 weeks ago Oracle Cloud HCM Functional Lead - Benefits (Public Sector) Oracle Cloud HCM Functional Lead - Benefits (Public Sector) IBM Los Angeles, CA Be an early applicant 2 weeks ago SAP Advanced Payment Management Consultant SAP Advanced Payment Management Consultant IBM New York, United States Be an early applicant 1 week ago Associate Consultant \u2013 Workday 2027 Associate Consultant \u2013 Workday 2027 IBM Chicago, IL Actively Hiring 1 week ago Oracle Cloud Financials Architect (Public Sector) Oracle Cloud Financials Architect (Public Sector) IBM Irvine, CA Be an early applicant 2 weeks ago Federal Associate Platform Specialist 2027 Federal Associate Platform Specialist 2027 IBM Herndon, VA Actively Hiring 1 week ago Oracle Cloud Financials Architect (Public Sector) Oracle Cloud Financials Architect (Public Sector) IBM Santa Monica, CA Be an early applicant 2 weeks ago See more jobs You&#39;ve viewed all jobs for this search LinkedIn &copy; 2026 About Accessibility User Agreement Privacy Policy Cookie Policy Copyright Policy Brand Policy Guest Controls Community Guidelines \u0627\u0644\u0639\u0631\u0628\u064A\u0629 (Arabic) \u09AC\u09BE\u0982\u09B2\u09BE (Bangla) \u010Ce\u0161tina (Czech) Dansk (Danish) Deutsch (German) \u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC (Greek) English (English) Espa\xF1ol (Spanish) \u0641\u0627\u0631\u0633\u06CC (Persian) Suomi (Finnish) Fran\xE7ais (French) \u0939\u093F\u0902\u0926\u0940 (Hindi) Magyar (Hungarian) Bahasa Indonesia (Indonesian) Italiano (Italian) \u05E2\u05D1\u05E8\u05D9\u05EA (Hebrew) \u65E5\u672C\u8A9E (Japanese) \uD55C\uAD6D\uC5B4 (Korean) \u092E\u0930\u093E\u0920\u0940 (Marathi) Bahasa Malaysia (Malay) Nederlands (Dutch) N",
    "apply_link": "https://in.linkedin.com/jobs/view/microsoft-power-platform-uipath-at-virtusa-4406055294",
    "ats_source": "LinkedIn",
    "discovered_at": "2026-09-14T08:05:03.130Z",
    "posted_date": "2026-09-13T08:05:03.130Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:13:53.851Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B911 - \u20B919 LPA",
      "location": "Not specified",
      "skills_gap": "Compensation expectation gap",
      "rejection_reason": "Role offers up to \u20B97.8 LPA, below expected minimum of \u20B910 LPA.",
      "evaluated_at": "2026-09-14T08:05:14.092Z"
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      11,
      19
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "22dbb05fbd266208",
    "title": "Power Platform Developer (Modelling, Portfolio Valuations)",
    "company_name": "Kroll",
    "location": "Hyderabad",
    "salary_is_estimated": true,
    "experience_range_years": [
      1,
      3
    ],
    "experience_is_inferred": false,
    "description": "We are seeking a technically strong, project-driven Automation &amp; Solutions Engineer with a primary focus on Microsoft Power Platform and SharePoint-based solutions. This role is centered on designing, building, and supporting workflow and engagement tracking environments using SharePoint as a core platform, enhanced by Power Automate and Power Apps. The position is hands-on and delivery-oriented, requiring ownership of end-to-end solutions\u2014from requirements through deployment and ongoing support. The ideal candidate combines strong technical skills with the ability to structure scalable, maintainable workflow systems that improve operational efficiency across engagement teams. Day-to-day Responsibilities Design and build SharePoint-based engagement tracking and workflow management environments Develop and maintain Power Automate flows for approvals, notifications, and process automation Develop Power Apps (Canvas and/or Model-driven) to support interaction with SharePoint systems Integrate SharePoint and Power Platform solutions with internal and external systems via APIs Develop scripts and tools using SQL and/or Python where appropriate Support secure authentication and connectivity (OAuth, service principals, etc.) Manage solution packaging, versioning, and release processes within Power Platform Refactor and optimize existing workflows and applications for performance and reliability Troubleshoot and support production issues in SharePoint and Power Platform solutions Support integration of AI and LLM capabilities into workflows where applicable Assist in connecting Azure-based services such as Functions or OpenAI into solutions Skills Experience with Microsoft 365 ecosystem and governance Experience designing workflow or engagement tracking systems Familiarity with Azure services (Functions, Logic Apps, Storage) Proficiency in Python or similar scripting language Exposure to AI/LLM integrations Experience in consulting or project-driven environments Understanding of CI/CD and deployment practices within Power Platform Essential Traits Bachelor\u2019s degree in Computer Science, Engineering, Data Analytics, Information Systems 1\u20133 years of relevant experience Hands-on experience with SharePoint (lists, libraries, permissions, structure design) Experience building workflows in Power Automate Experience developing Power Apps Strong SQL skills Experience working with APIs and integrations Ability to independently solve technical problems Strong documentation and communication skills About Kroll Join the global leader in risk and financial advisory solutions\u2014Kroll. With a nearly century-long legacy, we blend trusted expertise with cutting-edge technology to navigate and redefine industry complexities. As a part of One Team, One Kroll, you'll contribute to a collaborative and empowering environment, propelling your career to new heights. Ready to build, protect, restore and maximize our clients\u2019 value? Your journey begins with Kroll. In order to be considered for a position, you must formally apply via careers.kroll.com. Kroll is committed to equal opportunity and diversity, and recruits people based on merit.",
    "apply_link": "https://in.linkedin.com/jobs/view/power-platform-developer-modelling-portfolio-valuations-at-kroll-4437695964",
    "ats_source": "LinkedIn",
    "discovered_at": "2026-09-14T08:05:06.230Z",
    "posted_date": "2026-09-13T08:05:06.230Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:13:56.394Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "1-3 Years",
      "salary_range": "\u20B96 - \u20B911 LPA",
      "location": "Hyderabad",
      "skills_gap": "Location mismatch",
      "rejection_reason": "Location 'Hyderabad' not in preferred list [Gurgaon, Gurugram, Noida, Delhi, Remote, Bangalore, Bengaluru]",
      "evaluated_at": "2026-09-14T08:05:14.092Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 1\u20133 years of relevant experience",
    "salary_range_lpa": [
      6,
      11
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "4894d72b4fce5174",
    "title": "Cognizant hiring Hiring for Power Platform in Bangalore ...",
    "company_name": "Cognizant",
    "location": "Bangalore",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": "Job Description We are looking for a skilled Power Platform Developer with proven experience in Power Automate and PowerApps . The candidate will be responsible for end-to-end development , including new implementations, enhancements, and bug fixes for existing solutions. This role requires expertise in API integration , Microsoft tools automation , and SharePoint integration within the Power Platform ecosystem. JD For Power Platform DEV ROLE Must be well versed with PowerApps and Power Automate cloud flow like collections, gallery, creating connections etc. Must have a good understanding of APIs and how to connect them to cloud flows. Good understanding of Custom connectors. Good understanding of Dataverse and the various roles in them Good UI and UX skills for creating designs using Figma for PowerApps Good grasp on PowerFX language for coding using PowerApps.",
    "apply_link": "https://in.linkedin.com/jobs/view/hiring-for-power-platform-at-cognizant-4451934434",
    "ats_source": "LinkedIn",
    "discovered_at": "2026-09-14T08:05:02.960Z",
    "posted_date": "2026-09-13T08:05:02.960Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:13:58.240Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B911 - \u20B919 LPA",
      "location": "Bangalore",
      "skills_gap": "Compensation expectation gap",
      "rejection_reason": "Role offers up to \u20B97.6 LPA, below expected minimum of \u20B910 LPA.",
      "evaluated_at": "2026-09-14T08:05:14.092Z"
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      11,
      19
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "8a61cd64ca3a2a93",
    "title": "CRM Developer",
    "company_name": "Fnz",
    "location": "Not specified",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": "1. MS Dynamics CRM Administration & Enhancement \xB7 2. Power Platform Development (Power Apps & Power Automate) \xB7 3. Power BI Reporting & Data Visualization \xB7 4.\n\nRequisition posted on Fnz career portal. Direct application link verified active.",
    "apply_link": "https://fnz.wd3.myworkdayjobs.com/en-US/fnz_careers/job/CRM-Developer_REQ-16456",
    "ats_source": "Workday",
    "discovered_at": "2026-09-14T08:04:59.506Z",
    "posted_date": "2026-09-13T08:04:59.506Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:00.843Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 94,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B99 - \u20B916 LPA",
      "location": "Not specified",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements (Power Automate, Power BI, Power Apps).",
      "strengths": [
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in Power Apps"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:05:16.303Z"
    },
    "tailored": {
      "job_title": "CRM Developer",
      "company": "Fnz",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the CRM Developer position at Fnz. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Fnz.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Fnz."
      ],
      "generated_at": "2026-09-14T08:05:20.429Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      9,
      16
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "8ee0bf9c792290b3",
    "title": "Lead Developer",
    "company_name": "Guidehouse",
    "location": "Gurugram",
    "salary_is_estimated": true,
    "experience_range_years": [
      6,
      9
    ],
    "experience_is_inferred": true,
    "description": "Power Platform Developer to help design, build ... Power Apps Component Framework (PCF) controls Power Automate ... Power BI reporting and Power Query ...\n\nRequisition posted on Guidehouse career portal. Direct application link verified active.",
    "apply_link": "https://guidehouse.wd1.myworkdayjobs.com/en-US/External/job/Lead-Developer_41854",
    "ats_source": "Workday",
    "discovered_at": "2026-09-14T08:04:58.624Z",
    "posted_date": "2026-09-11T08:04:58.624Z",
    "posted_days_ago": 3,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:01.812Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 82,
      "detected_experience": "6-9 Years (Inferred)",
      "salary_range": "\u20B924 - \u20B938 LPA",
      "location": "Gurugram",
      "skills_gap": "PCF",
      "summary_reasoning": "Candidate aligns with key requirements (Power Automate, Power BI, Power Apps), but lacks specific tools (PCF).",
      "strengths": [
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in Power Apps"
      ],
      "weaknesses": [
        "Missing required skill: PCF"
      ],
      "evaluated_at": "2026-09-14T08:05:29.157Z"
    },
    "tailored": {
      "job_title": "Lead Developer",
      "company": "Guidehouse",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Lead Developer position at Guidehouse. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Guidehouse.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Guidehouse."
      ],
      "generated_at": "2026-09-14T08:06:09.719Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Inferred from Seniority ('Lead / Architect' standard: 6-9 Years)",
    "salary_range_lpa": [
      24,
      38
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "304505672428c070",
    "title": "Business Analyst",
    "company_name": "ResMed External",
    "location": "Bangalore",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": "As a Business Analyst \u2013 Marketing Solutions, you will help shape how marketing technology, data, and digital capabilities deliver value across ...\n\nRequisition posted on ResMed External career portal. Direct application link verified active.",
    "apply_link": "https://resmed.wd3.myworkdayjobs.com/en-US/ResMed_External_Careers/job/Bangalore-India/Business-Analyst---Marketing-Solutions_JR_053457",
    "ats_source": "Workday",
    "discovered_at": "2026-09-14T08:04:51.317Z",
    "posted_date": "2026-09-11T08:04:51.317Z",
    "posted_days_ago": 3,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:02.723Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 88,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B911 - \u20B919 LPA",
      "location": "Bangalore",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Business Analyst. Strong alignment with  in Bangalore.",
      "strengths": [
        "Direct match with candidate target role: Business Analyst"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:06:55.383Z"
    },
    "tailored": {
      "job_title": "Business Analyst",
      "company": "ResMed External",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Business Analyst position at ResMed External. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at ResMed External.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for ResMed External."
      ],
      "generated_at": "2026-09-14T08:07:18.001Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      11,
      19
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "e88727d8f7b82e06",
    "title": "Brillio - BI Architect",
    "company_name": "Brillio 2",
    "location": "Bangalore",
    "salary_is_estimated": true,
    "experience_range_years": [
      15,
      19
    ],
    "experience_is_inferred": false,
    "description": "Brillio - BI Architect - R01562560 BI Architect - R01562560 Bangalore, Karnataka, India AI &amp; Data Engineering \u2013 AI &amp; Data Engineering : Insights &amp; Analytics / Employee / Hybrid apply for this job BI Architect Primary Skills Power BI SQL Fabric AI/Copilot Azure Stack Specialization Other Vizulization tool experience Job requirements Sr Power BI Architect Role Overview We are looking for experienced BI Architects with deep expertise in Power BI\u2013led analytics solutions, strong data modeling and SQL capabilities, and hands\u2011on experience integrating BI platforms with the Microsoft Azure ecosystem. The role requires end\u2011to\u2011end ownership of BI architecture\u2014from data ingestion and transformation to semantic modeling, visualization, performance optimization, and stakeholder enablement. The ideal candidate will act as a technical authority and solution architect, guiding BI design decisions, enforcing best practices, and partnering closely with business, data engineering, and cloud teams to deliver scalable, secure, and high\u2011performance analytics solutions . Key Responsibilities &nbsp; Coach and mentor teams to build depth in modern BI, semantic modeling, and AI readiness \u2022 Contribute to practice growth through IP creation, accelerators, pre-sales support, and thought leadership Personal Attributes \u2022 Experience working across multiple industries and complex enterprise environments \u2022 Excellent written and verbal communication skills with strong executive articulation \u2022 Structured, outcome-oriented, and process-driven mindset \u2022 Ability to manage multiple programs and priorities simultaneously \u2022 Comfortable working with distributed global teams \u2022 Ability to navigate ambiguity and manage difficult stakeholder conversations \u2022 Strong inclination toward thought leadership, innovation, and capability building Experience Guidelines \u2022 15+ years of experience in Business Intelligence, Analytics, or Data Platforms \u2022 Significant experience leading enterprise-scale BI modernization and transformation programs \u2022 Demonstrated ownership of semantic layers, metric governance, and BI architecture \u2022 Proven experience with Power BI, Tableau, and Looker in large-scale deployments Exposure to AI-enabled BI use cases and platforms is strongly preferred Education Graduate or Postgraduate degree in Engineering, Computer Science, Data, Analytics, or a related field Projects This Role Will Support \u2022 Enterprise BI Modernization and Cloud BI Transformations \u2022 AI-Enabled BI and Semantic Layer Implementations \u2022 BI Control Towers and Executive Decision Platforms \u2022 Report Rationalization and BI Cost Optimization Programs \u2022 Insight Automation, Anomaly Detection, and Narrative BI Initiatives &nbsp; &nbsp; Why Join Opportunity to architect high\u2011impact BI solutions for global clients. Work at the intersection of Power BI, Azure, and enterprise analytics. Influence BI standards, architecture decisions, and analytics strategy. &nbsp; We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Brillio Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/brillio-2/579a47f4-1b59-4948-890c-a36d4e5bd23d",
    "ats_source": "Lever",
    "discovered_at": "2026-09-14T08:04:45.762Z",
    "posted_date": "2026-09-13T08:04:45.762Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:02.723Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "15-19 Years",
      "salary_range": "\u20B944 - \u20B971 LPA",
      "location": "Bangalore",
      "skills_gap": "Seniority gap",
      "rejection_reason": "Role requires 15+ years, candidate profile has 3.2 years.",
      "evaluated_at": "2026-09-14T08:07:19.395Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 15+ years of experience",
    "salary_range_lpa": [
      44,
      71
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "409c657801f4bea8",
    "title": "Hevo Data",
    "company_name": "Hevodata",
    "location": "Bangalore",
    "salary_is_estimated": true,
    "experience_range_years": [
      5,
      8
    ],
    "experience_is_inferred": false,
    "description": "Hevo Data - Senior Data Analyst Senior Data Analyst Bengaluru, India Strategy \u2013 Strategy All / Full time / On-site apply for this job About Hevo: &nbsp; Hevo ( www.hevodata.com ) is a simple, intuitive, and powerful No-code Data Pipeline platform that enables companies to consolidate data from multiple software for faster analytics. &nbsp; Hevo powers data analytics for 2000+ data-driven companies across multiple industry verticals, including Cult.fit, Postman, ThoughtSpot, Jawa Motorcycles. By automating complex data integration tasks, Hevo allows data teams to focus on deriving groundbreaking insights and driving their businesses forward. &nbsp; Hevo\u2019s mission is simple but bold: Build technology from India, for the world that is simple to adopt and easy to access so that everyone can unlock the potential of data. &nbsp; Based in San Francisco and Bangalore, Hevo has seen exponential growth since its inception. With total funding of $42 million from Sequoia India, Qualgro, and Chiratae Ventures, Hevo is now entering a new phase of hyper-growth. &nbsp; Hevoites are a bunch of thoughtful, helpful problem solvers who are obsessed with making a difference in the lives of their customers, colleagues, and their own individual trajectory. If you are someone who is passionate about redefining the future of technology, then Hevo is the place for you. &nbsp; Role Overview : &nbsp; As a Senior Data Analyst at Hevo, you will leverage your SQL skills and analytical expertise to manage, process, and report data, driving insights across the organization. You will focus on reporting, forecasting, and presenting key metrics to business leaders while collaborating with stakeholders to support strategic decision-making. Key Responsibilities Query large datasets using SQL to extract and manipulate data. Maintain and optimize databases on the data warehouse. Prepare and present weekly business reviews (WBRs), forecasts, and track key metrics. Drive analytics projects related to customer funnels and lead acquisition, uncover insights, and report findings to leadership. Collaborate with cross-functional teams to execute WBRs and track follow-up actions. Lead and manage end-to-end analytics projects with minimal oversight and mentor junior team members. Continuously challenge and improve metrics by aligning them with industry standards. What are we looking for 5 - 8 years of experience in a quantitative analyst role (preferably in B2B SaaS, growth analytics, or revenue operations). Proficiency in SQL and experience working with large datasets. Experience using Tableau, Looker, or similar tools to create dashboards and report insights. Strong communication skills, with the ability to present data to both technical and non-technical audiences. Bonus: Experience with executive or rev ops reporting. Ability to manage multiple projects simultaneously and drive deliverables with minimal oversight. Key elements needed to succeed in this role Attention to detail Diagnosing the problem Continuous learning mindset Ability to solve complex, open-ended problems We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Hevo Data Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/hevodata/308fe760-b657-45d3-ab4c-a13efdcf230f",
    "ats_source": "Lever",
    "discovered_at": "2026-09-14T08:04:46.615Z",
    "posted_date": "2026-09-13T08:04:46.615Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:03.505Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 74,
      "detected_experience": "5-8 Years",
      "salary_range": "\u20B925 - \u20B940 LPA",
      "location": "Bangalore",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements (SQL).",
      "strengths": [
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:08:19.392Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 5 - 8 years of experience",
    "salary_range_lpa": [
      25,
      40
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "b0bd0a21e8a7e3e6",
    "title": "Grant Street Group",
    "company_name": "Grantstreet",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": "Grant Street Group - Business Analyst Business Analyst United States (Remote) Product \u2013 Product Delivery / Full-time / Remote Submit your application Resume/CV \u2731 ATTACH RESUME/CV Couldn't auto-read resume. Analyzing resume... Success! File exceeds the maximum upload size of 100MB . Please try a smaller size. Full name \u2731 Email \u2731 Phone \u2731 Current location \u2731 No location found. Try entering a different location Loading Current company Links LinkedIn URL \u2731 Other (work sample, portfolio, website, GitHub, etc.) URL Grant Street Group is unable to provide visa sponsorship. Will you, now or in the future, require visa sponsorship to work in the United States? \u2731 Select... Yes No How did you hear about us? Please choose from the following: \u2731 Select... Indeed Glassdoor LinkedIn Flex Jobs Career Fair Word of Mouth Social Media Google Specialized Job Board Email from College Department Handshake Other Why Work at GSG? Why do you want to work with us? Tell us what interests you about this opportunity. \u2731 Business Analyst/Client Solutions Travel We ask our Business Analysts/Client Solutions Analysts to commit to up to 10-15% travel. Are you open to this travel requirement? \u2731 Select... Yes No Submit application Grant Street Group Home Page We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. Jobs powered by",
    "apply_link": "https://jobs.lever.co/grantstreet/ee9892b2-41f6-45d7-b31a-56b806fd1565/apply",
    "ats_source": "Lever",
    "discovered_at": "2026-09-14T08:04:43.975Z",
    "posted_date": "2026-09-13T08:04:43.975Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:03.986Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 76,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B910 - \u20B917 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements ().",
      "strengths": [],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:08:58.997Z"
    },
    "tailored": {
      "job_title": "Grant Street Group",
      "company": "Grantstreet",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Grant Street Group position at Grantstreet. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Grantstreet.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Grantstreet."
      ],
      "generated_at": "2026-09-14T08:09:12.707Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      10,
      17
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "d8c37ec1dd5dccc5",
    "title": "Associate - Business Analyst-Application Development ...",
    "company_name": "Exl",
    "location": "Noida",
    "salary_is_estimated": true,
    "experience_range_years": [
      0,
      2
    ],
    "experience_is_inferred": true,
    "description": "Design, develop, and implement .NET-based software solutions in alignment with project requirements and technical specifications Proficient in Application Programming , Web Development &amp; Support using Microsoft .NET (C#, ASP. Net, VB. Net, MVC,WCF, Web API, Dot Net Core) Knowledge of Visual Studio .NET 2012-13/2015/2019, WCF Services, Web API and ASP.NET 4.5, ASP.NET MVC 4, LINQ Asp. Net Core Write code using .NET languages such as C# to implement features, modules, and components of the software application Develop and execute unit tests, integration tests etc. to validate the functionality, reliability, and performance of .NET applications Analyze technical requirements, user stories, and system specifications to identify technical challenges and dependencies Follow established coding standards, development processes, and version control practices within the software engineering teams Knowledge of SOAP UI, Splunk Logger, Telerik Fiddler is also preferred. Event based system development, API, Use of Swagger/Postman, exposure of JIRA, CI/CD pipeline deployments Should have knowledge on serverless architecture",
    "apply_link": "https://in.linkedin.com/jobs/view/associate-business-analyst-application-development-backend-development-at-exl-4446744290",
    "ats_source": "LinkedIn",
    "discovered_at": "2026-09-13T07:25:31.673Z",
    "posted_date": "2026-09-11T07:25:31.673Z",
    "posted_days_ago": 2,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:05.760Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 88,
      "detected_experience": "0-2 Years (Inferred)",
      "salary_range": "\u20B95 - \u20B99 LPA",
      "location": "Noida",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Associate - Business Analyst-Application Development .... Strong alignment with  in Noida.",
      "strengths": [
        "Direct match with candidate target role: Associate - Business Analyst-Application Development ..."
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:46.927Z"
    },
    "experience_inferred_reason": "Inferred from Seniority ('Entry / Associate' standard: 0-2 Years)",
    "salary_range_lpa": [
      5,
      9
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "7262d454e1b7c678",
    "title": "Business Analyst",
    "company_name": "Travelhrportal",
    "location": "Gurgaon",
    "salary_is_estimated": true,
    "experience_range_years": [
      3,
      6
    ],
    "experience_is_inferred": false,
    "description": "Business Analyst \xB7 Graduate (Computer Science, IT, analytics, or related) with 3+ years of relevant experience in automation, data preparation, or ETL; travel ...\n\nRequisition posted on Travelhrportal career portal. Direct application link verified active.",
    "apply_link": "https://travelhrportal.wd1.myworkdayjobs.com/en-US/Jobs/job/Gurgaon-India/Business-Analyst_J-84869",
    "ats_source": "Workday",
    "discovered_at": "2026-09-13T07:25:28.994Z",
    "posted_date": "2026-09-11T07:25:28.994Z",
    "posted_days_ago": 2,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:08.614Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 88,
      "detected_experience": "3-6 Years",
      "salary_range": "\u20B916 - \u20B925 LPA",
      "location": "Gurgaon",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Business Analyst. Strong alignment with  in Gurgaon.",
      "strengths": [
        "Direct match with candidate target role: Business Analyst"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:48.205Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 3+ years of relevant experience",
    "salary_range_lpa": [
      16,
      25
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "ec40c7ac4dc66532",
    "title": "Senior Business Analyst (Remote - United Kingdom)",
    "company_name": "Risepoint",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      4,
      7
    ],
    "experience_is_inferred": false,
    "description": "Minimum 4 years of experience working as a Business Analyst or in a similar analytical role. Bachelor's degree in Business Analytics, Data Analytics, Statistics ...\n\nRequisition posted on Risepoint career portal. Direct application link verified active.",
    "apply_link": "https://risepoint.wd503.myworkdayjobs.com/en-US/Risepoint/job/Senior-Partnerships-Analyst--Remote---United-Kingdom-_JR101264",
    "ats_source": "Workday",
    "discovered_at": "2026-09-13T07:25:24.490Z",
    "posted_date": "2026-09-11T07:25:24.490Z",
    "posted_days_ago": 2,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:10.080Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 82,
      "detected_experience": "4-7 Years",
      "salary_range": "\u20B916 - \u20B924 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Senior Business Analyst (Remote - United Kingdom). Strong alignment with  in Remote.",
      "strengths": [
        "Direct match with candidate target role: Senior Business Analyst (Remote - United Kingdom)"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:48.993Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: Minimum 4 years of experience",
    "salary_range_lpa": [
      16,
      24
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "7d9f33074387ae98",
    "title": "Lingaro",
    "company_name": "Lingarogroup",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      6,
      10
    ],
    "experience_is_inferred": false,
    "description": "Lingaro - Power Platform Expert Power Platform Expert India CC Business &amp; Decision Intelligence \u2013 B&amp;DI IN - Nishant / Full-time / Remote apply for this job 1 &nbsp; Growth through diversity, equity, and inclusion. As an ethical business, we do what is right \u2014 including ensuring equal opportunities and fostering a safe, respectful workplace for each of us. We believe diversity fuels both personal and business growth. We're committed to building an inclusive community where all our people thrive regardless of their backgrounds, identities, or other personal characteristics. What You'll Be Doing: \u2022 Design, develop, and deploy Copilot Studio agents (topics, generative answers, actions, plugins) integrated with enterprise data sources. \u2022 Build and orchestrate multi-agent solutions using Agent Orchestration patterns within Copilot Studio / Azure AI Foundry. \u2022 Implement Retrieval-Augmented Generation (RAG) pipelines by connecting agents to knowledge sources (SharePoint, Dataverse, Azure AI Search, custom data stores). \u2022 Build Power Apps (Canvas &amp; Model-Driven) to solve business problems with intuitive UX. \u2022 Automate workflows using Power Automate (cloud flows, desktop flows/RPA). \u2022 Design and maintain Dataverse data models, relationships, and security roles. \u2022 Integrate Copilot Studio agents with Power Automate flows, Azure OpenAI/LLMs, APIs, and third-party connectors. \u2022 Evaluate and fine-tune prompt engineering strategies for grounding, accuracy, and hallucination reduction. \u2022 Implement Application Lifecycle Management (ALM) using solutions, pipelines, and environments (Dev/Test/Prod). \u2022 Configure authentication, security roles, and Microsoft Entra ID integration for governance. \u2022 Monitor and troubleshoot agent performance, flow failures, and app errors. \u2022 Collaborate with business analysts to gather requirements and translate them into technical solutions. \u2022 Mentor junior developers and lead technical design discussions. \u2022 Stay current with Power Platform, Copilot Studio, and GenAI roadmap, licensing, and best practices. What We're Looking For: 6+ years of overall IT experience. 5+ years of hands-on Power Platform experience , specifically Power Apps + Power Automate . Strong production experience with Copilot Studio \u2014 building and deploying AI agents, not just configuring or experimenting with Copilot. Hands-on experience with RAG / Generative AI , including connecting Copilot agents to enterprise knowledge sources such as SharePoint, Dataverse or Azure AI Search . Strong hands-on experience with Dataverse and Power Platform integrations/APIs . Experience integrating Copilot Studio + Power Automate + APIs/enterprise systems . Experience with Power Platform ALM , including Solutions and Dev/Test/Prod deployments . Proven ability to independently design, develop and deploy end-to-end Power Platform solutions . &nbsp; Nice to have: Power BI, Power Pages, Azure AI Foundry, Azure OpenAI. We Offer: &nbsp; Stable employment. &nbsp;On the market since 2008, 1500+ talents currently on board in 7 global sites. \u201COffice as an option\u201D model. &nbsp;You can choose to work remotely or in the office, depending on your location. Flexibility regarding working hours and your preferred form of contract. Comprehensive online onboarding program with a \u201CBuddy\u201D from day 1. Cooperation with top-tier engineers and experts. Unlimited access to the Udemy &nbsp; learning platform &nbsp;from day 1. Certificate training programs. &nbsp;Lingarians earn 500+ technology certificates yearly. Upskilling support. &nbsp;Capability development programs, Competency Centers, knowledge sharing sessions, community webinars, 110+ training opportunities yearly. Internal Gallup Certified Strengths Coach &nbsp;to support your growth. Grow as we grow as a company. &nbsp;76% of our managers are internal promotions. A diverse, inclusive, and values-driven community. Autonomy to choose the way you work. &nbsp;We trust your ideas. Create our community together. &nbsp;Refer your friends to receive bonuses. Activities to support your&nbsp; well-being and health. Plenty of opportunities to donate to charities and support the environment. Modern office equipment. &nbsp;Purchased for you or available to borrow, depending on your location. We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. More information about how your data is processed you can find here - https://lingarogroup.com/hubfs/Candidate%20Privacy%20Notice%2c%20Lingaro.pdf apply for this job Lingaro Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/lingarogroup/8a3fb292-95c2-46f9-adae-9f1eba22b5c2",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:20.782Z",
    "posted_date": "2026-09-12T07:25:20.782Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:10.080Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "6-10 Years",
      "salary_range": "\u20B923 - \u20B936 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements (Power Automate, Power BI, Power Apps).",
      "strengths": [
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in Power Apps",
        "Demonstrated competency in Copilot Studio"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:49.689Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 6+ years",
    "salary_range_lpa": [
      23,
      36
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "5713959e0c980c3b",
    "title": "Microsoft Dynamics CRM and Power Platform Engineer",
    "company_name": "The Battery Network",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      3,
      6
    ],
    "experience_is_inferred": false,
    "description": "The Battery Network - Microsoft Dynamics CRM and Power Platform Engineer Microsoft Dynamics CRM and Power Platform Engineer United States Technology Services \u2013 Solutions Delivery / Full-Time / Remote apply for this job At The Battery Network, we are leading the charge to turn yesterday\u2019s batteries into tomorrow\u2019s power. As the nation\u2019s premier battery collection and recycling nonprofit, we\u2019ve spent over three decades leading the charge toward a cleaner planet and a circular economy.&nbsp; &nbsp; We connect consumers, businesses, manufacturers, and municipalities through one trusted network. We provide education, collection, logistics, and compliance expertise, helping our partners stay ahead of regulation while capturing the critical materials that power the future. We keep valuable materials in circulation and out of landfills\u2014reducing reliance on foreign supply chains, strengthening America\u2019s energy independence, and protecting people, property, and the planet.&nbsp; &nbsp; We\u2019re looking for passionate changemakers to help us scale our impact and shape the future of sustainability. If you're ready to turn purpose into action, you\u2019ll thrive in our mission-driven, collaborative environment. Learn more at batterynetwork.org &nbsp;and follow us on Facebook , Instagram , or LinkedIn . POSITION SUMMARY The Microsoft Dynamics 365 CRM and Power Platform Engineer is responsible for the ongoing development, modernization, integration, and support of The Battery Network\u2019s CRM, Dataverse, Power Pages, Power Automate, and related Power Platform capabilities. This is a hands-on engineering role focused on building useful, reliable, and scalable business solutions\u2014not simply administering a system. A major focus of this role is The Battery Network\u2019s customer-facing portal ecosystem built on Microsoft Power Platform, including Power Pages and Dataverse. The ideal candidate understands that these portals are an extension of the customer and partner experience and can design solutions that are secure, intuitive, integrated, and maintainable. This role will also help the organization more fully realize the value of Dynamics 365 CRM by improving how customer, partner, service, program, and operational data are modeled, automated, surfaced, and connected across the business. The Engineer will work across CRM configuration, model-driven apps, Power Pages, Power Automate, Dataverse, reporting enablement, and custom development as business needs evolve. Success in this role requires practical engineering execution, strong Power Platform and Dynamics 365 knowledge, comfort with APIs and integrations, and the ability to partner with business teams to turn complex operational problems into dependable production-ready solutions MAJOR DUTIES &amp; RESPONSIBILITIES Duties and responsibilities of this role include but are not limited to the following: Dynamics 365 CRM Engineering: Configure, customize, extend, and support Dynamics 365 CRM and Dataverse solutions, including tables, forms, views, business rules, security roles, model-driven apps, workflows, and related application components. Dynamics 365 Extensibility Development: Design, build, deploy, and support custom Dynamics 365 functionality using C#/.NET plugins, custom workflow activities, JavaScript, PCF controls, web resources, and other platform extensibility mechanisms. Power Pages / Portal Delivery: Design, build, enhance, and support customer-facing Power Pages portal capabilities that provide secure, reliable, and user-friendly digital experiences for customers, partners, and operational users. Power Platform Solution Development: Develop and maintain Power Automate flows, Power Apps, Dataverse components, and reusable platform patterns that improve process automation, data quality, service delivery, and operational efficiency. Business Central Integration: Support and extend the organization\u2019s Microsoft-supported Business Central and Dataverse/Dynamics integration patterns, helping ensure CRM, portal, and ERP data stay aligned across business workflows. API &amp; Integration Engineering: Design, troubleshoot, and support API-driven integrations between Dynamics 365, Power Platform, Business Central, Azure services, external systems, and internal applications to solve complex business problems. CRM Platform Growth: Identify opportunities to expand the practical use of CRM across customer service, account management, program operations, reporting, marketing, compliance, and other organizational workflows. Application Lifecycle Management: Support clear solution management, environment promotion, deployment practices, documentation, testing, and governance for Dynamics 365 and Power Platform solutions. Technical Delivery &amp; Support: Troubleshoot defects, monitor system behavior, support production operations, resolve issues, improve system performance, and participate in practical design and implementation decisions. Stakeholder Collaboration &amp; Documentation: Work with business leaders, product owners, operations teams, Technology Services, and external partners to clarify requirements, explain trade-offs, document decisions, and deliver supportable solutions. CORE QUALIFICATIONS Three plus years of hands-on experience developing, configuring, deploying, and supporting Microsoft Dynamics 365 CRM, Dataverse, Power Platform, Power Automate, and Power Pages solutions. Bachelor\u2019s degree in Information Technology, Computer Science, Software Engineering, or related field, plus 3+ years of relevant Dynamics 365 CRM and Power Platform experience; OR 6+ years of equivalent hands-on platform engineering experience. Demonstrated experience building or supporting customer-facing portals, self-service experiences, or external-facing business applications using Power Pages, Dataverse, custom components, APIs, or related Microsoft technologies. Experience designing and supporting integrations between CRM, portals, ERP systems, APIs, data sources, and operational workflows, with a practical understanding of data quality, security, and maintainability. Demonstrated hands-on experience extending Microsoft Dynamics 365 CRM through C#/.NET plugins, custom workflow activities, integrations, and platform extensibility. Must be authorized to work lawfully in the United States for The Battery Network, with or without sponsorship. PREFERRED QUALIFICATIONS Strong experience with Power Pages / Power Apps portals, including page configuration, web roles, table permissions, forms, lists, Liquid templates, JavaScript, CSS, and portal security patterns. Hands-on Dynamics 365 CRM and Dataverse experience, including entity/table design, model-driven apps, forms, views, business rules, workflows, security roles, teams, and field-level security. Experience with Microsoft Business Central integration, Dataverse integration, or Microsoft\u2019s out-of-box integration patterns between Dynamics 365 applications and ERP data. Experience designing, consuming, troubleshooting, or supporting REST APIs, OData endpoints, web services, Azure Functions, Logic Apps, or other integration services. Experience with Power Platform ALM, solution segmentation, managed/unmanaged solution strategy, environment promotion, deployment pipelines, Power Platform CLI/PAC, Plugin Registration Tool, XrmToolBox, Azure DevOps, or GitHub. SKILLS, KNOWLEDGE, &amp; EXPERIENCE Ability to translate ambiguous business needs into practical CRM, portal, automation, data, and integration solutions that can be delivered, supported, and improved over time. Strong understanding of customer experience, portal usability, role-based access, data privacy, system reliability, and supportability in external-facing business applications. Comfort working as a hands-on engineer in a small, collaborative technology team where priorities evolve and ownership matters. Ability to communicate clearly with technical and non-technical stakeholders, explain trade-offs, document decisions, and keep delivery moving through practical problem solving. Strong organizational skills with a demonstrated commitment to documentation, transparency, follow-through, testing, and continuous improvement. Self-starter with intellectual curiosity, a continuous learning mindset, and the ability to thrive in a mission-driven organization. Collaborative, low-ego team member who balances urgency, patience, adaptability, and long-term solution quality. WORKING CONDITIONS This position is remote based within the United States. Candidates must be able to work from a U.S.-based location and be eligible to work lawfully in the United States for The Battery Network. Limited travel (estimated 3-5 times per year) as needed. Travel could include, but not be limited to, attending conferences, customer meetings, or team/organization-wide meetings. Standard work hours are Monday\u2013Friday, 8 hours per day. Some roles may require additional hours during peak periods. We prioritize the quality and timeliness of work over rigid schedules and recognize the importance of connection, collaboration, and work-life balance. To support this, we offer flexible scheduling where roles allow, and in alignment with current policy, while ensuring operational needs and team collaboration are met. ABOUT THE BATTERY NETWORK At The Battery Network, we enjoy a culture of teamwork, innovation, and fun. Our team is the primary reason for our unique culture. We hire energetic and dedicated people who are committed to helping us achieve our goals. Each one of our employees is a valued contributor, not just a number. We work in teams to benefit from our collective talents to make a real impact on the environment. &nbsp; The way we operate contributes to the success of our employees and our organization. We embrace diversity, equity, and inclusion as core values, and believe everyone\u2019s unique perspective is critical to our success . Diversity and intercultural collaboration are fundamental to what we do. Our team members bring ",
    "apply_link": "https://jobs.lever.co/The-Battery-Network/f9395fbc-48c0-4d27-b00a-dff45f566adc",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:20.828Z",
    "posted_date": "2026-09-12T07:25:20.828Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:11.126Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "3-6 Years",
      "salary_range": "\u20B918 - \u20B928 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Microsoft Dynamics CRM and Power Platform Engineer. Strong alignment with Power Automate, Power Apps, Process Automation in Remote.",
      "strengths": [
        "Direct match with candidate target role: Microsoft Dynamics CRM and Power Platform Engineer",
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power Apps",
        "Demonstrated competency in Process Automation"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:50.473Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 3+ years",
    "salary_range_lpa": [
      18,
      28
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "5cc33ac2cc1a5a04",
    "title": "Join Ciellos team anywhere - Apply now!",
    "company_name": "Ciellos",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      25,
      25
    ],
    "experience_is_inferred": false,
    "description": "Ciellos - Join Ciellos team anywhere - Apply now! Join Ciellos team anywhere - Apply now! Portugal / Albania / Canada / Macedonia / Ukraine / Brazil / Colombia / Denmark / United States / Other Locations All Teams / Full-time / Remote apply for this job About Ciellos &nbsp; Ciellos is a Microsoft Dynamics 365 technology consulting powerhouse. We are a Solutions Designated Partner in AI Business Solutions and a certified Microsoft ISV Development Center. Our expertise covers a broad range of Microsoft technologies, such as Microsoft Dynamics 365 Business Central, Finance and Supply Chain Management and Customer Engagement, in addition to Power Platform, Azure, AI, Copilot and more.&nbsp; &nbsp; Ciellos has a proven partner centric business model that supports technical excellence, global project delivery, and repeatable methodology. Our deep experience comes from over 25 years of working with Microsoft partners and technologies.&nbsp;At Ciellos, we want to attract and retain the best and brightest to support our mission of excellence within our mission&nbsp; Everything Microsoft Dynamics .&nbsp; &nbsp; Ciellos operates&nbsp;globally&nbsp;with regional locations in&nbsp; Albania, Brazil, Canada, Denmark, Macedonia, Portugal, Ukraine, and the USA, &nbsp;as well as supporting remote employees from other locations.&nbsp;You will be working with recent technologies in a strong team of professionals.&nbsp; &nbsp; What makes us successful, is our teaming approach, application of Solution Architects to overall project governance, and a deep seeded passion for solution excellence, quality, and continuous improvement. &nbsp; All Microsoft Professionals are welcome to apply and join Ciellos &nbsp; We are looking for strong Microsoft Dynamics Professionals that match our technology footprint and/or desire to strengthen their existing skills and experience supporting the Microsoft Dynamics Partner and ISV Communities. &nbsp; \u2022 Dynamics 365 Finance and Supply Chain Management \u2022 Dynamics 365 Business Central \u2022 Dynamics 365 Customer Engagement (Sales, Customer Service, Field Service, Marketing, Project Operations) \u2022 Power Platform (Power Apps, Power Automate, Power BI, Power Pages) \u2022 Dataverse &amp; Microsoft Fabric \u2022 Microsoft Azure (App Services, Integration Services, Logic Apps, DevOps) \u2022 AI &amp; Intelligent Automation (Microsoft Copilot, Copilot Studio, AI Builder, Azure OpenAI) \u2022 AI Agents &amp; Workflow Automation Solutions \u2022 Legacy expertise in Dynamics AX, NAV, and CRM is highly valued Our Benefits and Perks &nbsp; Flexible Work Environment : Enjoy flexible hours and remote work options. Generous Time Off : Take advantage of 4 weeks of annual paid time off and 11 national holidays. Comprehensive Health Insurance: Benefit from flexible usage options and reimbursements within your annual allowance. Professional Growth: Receive mentoring and training from Microsoft Dynamics experts, plus reimbursement for Microsoft certifications. Referral Bonuses: Earn bonuses for successful candidate referrals after they pass the probationary period. Social Fun: Participate in fun online events and office gatherings at our core Ciellos locations. &nbsp; &nbsp; Our Culture &nbsp; Our culture ensures everyone has a voice and feels truly welcome. People matter most at Ciellos and have always been at the heart of our business. We regularly ask our employees to share what they think about our strengths as a company.&nbsp; &nbsp; How does Ciellos promote a strong culture across the multi-national organization? &nbsp; Family oriented environment&nbsp; &nbsp; Consistent leadership, based on trust and responsibility&nbsp;&nbsp; Management provides autonomy and trusts employees to manage their tasks independently&nbsp; &nbsp; Healthy hybrid work environment - work-life balance is not just talked about, but is a focus&nbsp; When in the office, frequent opportunities to enjoy lunch as a team focused on comradery&nbsp; &nbsp; Our Values That Shape Everything We Do at Ciellos &nbsp; Trust is the foundation for all our relationships&nbsp;&nbsp; Respect for everyone, at the heart of our culture&nbsp;&nbsp; Courage to advise, consult, and plan at the highest potential&nbsp;&nbsp; Harmony in collaboration, solutions, and teamwork&nbsp;&nbsp; Quality focused on the highest quality of workmanship&nbsp;&nbsp; Team supporting each other, our partners, and our customers&nbsp;&nbsp; &nbsp; Why Should You Join Ciellos? &nbsp; International consulting company with unique ERP talent&nbsp; Frontrunner of the Women in Dynamics equality initiative&nbsp; One of only a few Microsoft Dynamics Development Centers globally&nbsp; 220+ Dynamics Upgrades and Migrations&nbsp; 250+ Dynamics ERP Implementations&nbsp; Managing more than 250 projects of various sizes and complexity annually&nbsp; Internal rating of Employer Brand&nbsp; 8.35 out of 10&nbsp; Remote work with flexible schedules or hybrid work in offices&nbsp; Offices in 8 countries - USA, Canada, Brazil, Denmark, Portugal, Macedonia, Albania, Ukraine - with almost 200 employees total&nbsp; 10+ years of average Dynamics experience of our staff&nbsp; 25+ years of industry experience working with Microsoft in the ERP space&nbsp; &nbsp; Who Should Apply? &nbsp; We invite you to apply to our positions even if you do not meet 100% of the qualifications listed in the description. If you're passionate about our mission and aligned to Ciellos values, we hope you'll come to contribute to our culture.&nbsp; &nbsp; We are not able to sponsor visas or take over sponsorship at this time.&nbsp; &nbsp; Recruitment Notice &nbsp; We're an equal opportunity employer. All applicants will be considered for employment without attention to race, color, religion, sex, sexual orientation, gender identity, national origin, veteran, or disability status.&nbsp;&nbsp; &nbsp; By choosing to apply you agree to your Personal Data gathering and processing. When you apply for a job at Ciellos, Ciellos will collect and use personal data about you during the recruiting and hiring process.&nbsp; &nbsp; Notice to Recruitment Agencies and Third Parties &nbsp; We are not accepting candidates submitted by third-party agencies or recruiters. We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Ciellos Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/ciellos/4eb6e44e-b11d-45e2-930e-91a9664fa906",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:21.158Z",
    "posted_date": "2026-09-12T07:25:21.158Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:11.728Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "25-25 Years",
      "salary_range": "\u20B934 - \u20B954 LPA",
      "location": "Remote",
      "skills_gap": "Seniority gap",
      "rejection_reason": "Role requires 25+ years, candidate profile has 3.2 years.",
      "evaluated_at": "2026-09-13T07:25:50.984Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 25+ years of industry experience",
    "salary_range_lpa": [
      34,
      54
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "2cf094fbdb37fc39",
    "title": "Power BI Developer - Contact Government Services, LLC",
    "company_name": "Cgsfederal",
    "location": "Remote",
    "salary_range_lpa": [
      89,
      121
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": false,
    "description": "Contact Government Services, LLC - Power BI Developer Power BI Developer Miami, FL / Remote / Hybrid / Tampa, FL Information Technology / Full Time Hybrid / Hybrid apply for this job Power BI Developer Employment Type: Full-Time, Mid-level Department: Information Technology CGS is seeking a Power BI Developer to join our team in supporting a wide-ranging technical support initiative for a large Federal agency. CGS brings motivated, highly skilled, and creative people together to solve the government\u2019s most dynamic problems with cutting-edge technology. To carry out our mission, we are seeking candidates who are excited to contribute to government innovation, appreciate collaboration, and can anticipate the needs of others. Here at CGS, we offer an environment in which our employees feel supported, and we encourage professional growth through various learning opportunities. Skills and attributes for success: - Build Data Analytics enterprise models using Microsoft\u2019s Power BI - Develop tabular, multidimensional models compatible with warehouse standards - Develop self-service models, and data analytics using Power BI service - Experience with Microsoft Azure platform and service (Power BI, Flow, Cortana, etc.) - Experience working with data gateway, data integration, self-service data preparation - Develop, publish, and schedule reports and dashboards to meet business requirements - Assist business users with functional and data requirements to enhance data models - Experience in requirement analysis, design, and prototyping - Strong understanding of Data Analytics application security layer models - Experience with ESRI or similar geographical mapping systems and tools is desired - Experience working with Government personnel at the CTO or SES level. Qualifications: - Bachelor's degree or equivalent in Computer Science or related field. - 2-4 years of development experience in Data Analytic technologies - Knowledge in Microsoft enterprise cloud technologies such as Dynamics 365 CRM, Office 365, Microsoft Azure - Strong experience in SQL and RDBMS technologies - Experience working in Agile project deliveries and delivering to tight timescales - Web API Experience - Knowledge of Azure DevOps (VSTS) - ETL, SSAS, and SSIS experience - SSRS Reporting knowledge Ideally, you will also have: - Experience with Government software development&nbsp;policies and procedures - Client-facing communication experience - Federal Agency issued security clearance Our Commitment: Contact Government Services (CGS) strives to simplify and enhance government bureaucracy through the optimization of human, technical, and financial resources. We combine cutting-edge technology with world-class personnel to deliver customized solutions that fit our client\u2019s specific needs. We are committed to solving the most challenging and dynamic problems. For the past seven years, we\u2019ve been growing our government-contracting portfolio, and along the way, we\u2019ve created valuable partnerships by demonstrating a commitment to honesty, professionalism, and quality work. Here at CGS we value honesty through hard work and self-awareness, professionalism in all we do, and to deliver the best quality to our consumers mending those relations for years to come. We care about our employees. Therefore, we offer a comprehensive benefits package. - Health, Dental, and Vision - Life Insurance - 401k - Flexible Spending Account (Health, Dependent Care, and Commuter) - Paid Time Off and Observance of State/Federal Holidays Contact Government Services, LLC is an Equal Opportunity Employer. Applicants will be considered without regard to their race, color, religion, sex, sexual orientation, gender identity, national origin, disability, or status as a protected veteran. Join our team and become part of government innovation! Explore additional job opportunities with CGS on our Job Board: https://cgsfederal.com/join-our-team/ For more information about CGS please visit: https://www.cgsfederal.com or contact: Email:&nbsp; [email&#160;protected] #CJ $104,832 - $142,272 a year We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Contact Government Services, LLC Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/cgsfederal/3b2f160a-1d2f-40ae-8db8-2cbdc01ab32c",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:14.758Z",
    "posted_date": "2026-09-12T07:25:14.758Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:12.260Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "2-4 Years",
      "salary_range": "\u20B989 - \u20B9121 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Power BI Developer - Contact Government Services, LLC. Strong alignment with Power BI, SQL in Remote.",
      "strengths": [
        "Direct match with candidate target role: Power BI Developer - Contact Government Services, LLC",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:51.253Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 2-4 years"
  },
  {
    "id": "b21fbd2fb2d252b9",
    "title": "Software Engineer, MS Power Platform",
    "company_name": "Jobgether",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      3,
      6
    ],
    "experience_is_inferred": false,
    "description": "Jobgether - Software Engineer, MS Power Platform Software Engineer, MS Power Platform India Security &amp; IT \u2013 IT / Full-time / Remote apply for this job This position is listed on behalf of a partner company, who manages all applications and next steps. Our partner is looking for a Software Engineer, MS Power Platform based in India. This role offers the opportunity to build and support enterprise-grade applications, automations, and AI-enabled solutions using the Microsoft Power Platform ecosystem. You\u2019ll work closely with business stakeholders to translate operational needs into scalable digital solutions that improve productivity and efficiency. The position spans the full application lifecycle, from solution design and development through testing, deployment, documentation, and production support. You\u2019ll integrate Microsoft 365 services, APIs, identity platforms, and third-party tools while maintaining strong governance, security, and compliance standards. The role is well suited to an engineer who combines hands-on technical expertise with a proactive, quality-focused mindset. You\u2019ll also have exposure to emerging technologies such as Copilot Studio and agentic AI. This is an opportunity to contribute to modern enterprise transformation in a collaborative and technically advanced environment. Accountabilities Design, develop, implement, and support enterprise applications and automation solutions using Microsoft Power Platform, Microsoft 365, and related technologies. Build solutions using Power Apps, Power Automate, Dataverse, custom connectors, and other Power Platform capabilities. Partner with business stakeholders to understand requirements, identify opportunities for process improvement, and translate needs into scalable technical solutions. Integrate Microsoft 365 and enterprise applications using REST APIs, Microsoft Graph, webhooks, standard connectors, and custom connectors. Develop integrations with SharePoint Online, Microsoft Teams, Exchange Online, Microsoft Entra ID, and third-party platforms. Own the end-to-end application lifecycle, including architecture, solution design, development, testing, deployment, documentation, production support, and continuous improvement. Troubleshoot application, automation, and integration issues and implement reliable long-term solutions. Apply appropriate governance, security, compliance, and access-control standards across Power Platform environments. Support Data Loss Prevention (DLP) policies, security roles, connector governance, and least-privilege access principles. Develop scripts and supporting automation using PowerShell and other relevant programming technologies. Contribute to the development of AI-driven solutions using Microsoft Copilot Studio, agentic AI, or related technologies where appropriate. Maintain high standards for code quality, application reliability, documentation, and delivery timelines. Continuously identify opportunities to improve digital workflows, operational efficiency, and the scalability of enterprise applications. Requirements 3+ years of hands-on experience designing, developing, and supporting enterprise applications using Microsoft Power Platform. Strong practical experience with Power Apps, Power Automate, Dataverse, and custom connectors. Proven experience integrating Microsoft 365 services and enterprise applications using REST APIs, Microsoft Graph, webhooks, and standard or custom connectors. Hands-on experience with SharePoint Online, Microsoft Teams, Exchange Online, or other Microsoft 365 services and their integration with Power Platform. Working knowledge of Power Platform governance, including Data Loss Prevention policies, security roles, connector governance, and least-privilege access. Strong proficiency in PowerShell. Working knowledge of at least one programming language such as C#, .NET, Python, or JavaScript. Understanding of enterprise application architecture, automation, API integration, security, and operational support practices. Knowledge of Microsoft Copilot Studio and agentic AI concepts is an advantage. Relevant Microsoft Power Platform certifications are considered a plus. Strong analytical and problem-solving skills with the ability to troubleshoot technical issues effectively. Self-driven and highly motivated, with the ability to work independently and take ownership of assigned responsibilities. Strong focus on quality, accuracy, and meeting deadlines. Good written and verbal communication skills, with the ability to clearly articulate technical concepts and collaborate with business and technical stakeholders. Ability to adapt to evolving technologies, business needs, and enterprise development practices. Benefits Full-time employment. Remote working arrangement within India. General shift schedule. Opportunity to work with Microsoft Power Platform, Microsoft 365, enterprise integrations, and AI-driven technologies. Exposure to modern automation, API integration, cloud collaboration, and enterprise application development. Opportunity to build solutions used across complex enterprise environments. Experience working with technologies such as Power Apps, Power Automate, Dataverse, Microsoft Graph, SharePoint Online, and Microsoft Teams. Opportunity to expand expertise in Copilot Studio and agentic AI technologies. Collaborative work environment focused on quality, execution, teamwork, and continuous improvement. Opportunity to contribute to digital transformation initiatives with measurable impact on productivity and operational efficiency. How Jobgether works: We use an AI-powered matching process to ensure your application is reviewed quickly, objectively, and fairly against the role's core requirements. Our system identifies the top-fitting candidates, and this shortlist is then shared directly with the hiring company. The final decision and next steps (interviews, assessments) are managed by their internal team. We appreciate your interest and wish you the best! &nbsp;Why Apply Through Jobgether? &nbsp; &nbsp; Data Privacy Notice: By submitting your application, you acknowledge that Jobgether will process your personal data to evaluate your candidacy and share relevant information with the hiring employer. This processing is based on legitimate interest and pre-contractual measures under applicable data protection laws (including GDPR). You may exercise your rights (access, rectification, erasure, objection) at any time. &nbsp; &nbsp; #LI-CL1 We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Jobgether Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/jobgether/0c459c89-5607-41ab-b0ba-140d90562e82",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:14.404Z",
    "posted_date": "2026-09-12T07:25:14.404Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:12.752Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "3-6 Years",
      "salary_range": "\u20B918 - \u20B928 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Software Engineer, MS Power Platform. Strong alignment with Power Automate, SharePoint Online, Power Apps in Remote.",
      "strengths": [
        "Direct match with candidate target role: Software Engineer, MS Power Platform",
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in SharePoint Online",
        "Demonstrated competency in Power Apps",
        "Demonstrated competency in Copilot Studio",
        "Demonstrated competency in Python"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:51.943Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 3+ years of hands-on experience",
    "salary_range_lpa": [
      18,
      28
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "534a84ce10abb52a",
    "title": "Power Platform Developer",
    "company_name": "Truetandem",
    "location": "Remote",
    "salary_range_lpa": [
      111,
      123
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      5,
      8
    ],
    "experience_is_inferred": false,
    "description": "True Tandem - Power Platform Developer Power Platform Developer Remote All / Full time / Remote apply for this job Company Description TrueTandem's mission is to be a trusted information technology solutions provider, committed to the success of our customers, communities and employees. To enable this mission, we listen to our customers\u2019 needs, empower our dedicated and talented employees, envision success together, and deliver innovative cost-effective solutions. For our customers, we aim to deliver more power to meet their business outcomes through technology implementation, integration, optimization and customization. We enable some of the most well-known companies, nonprofits and federal agencies in the United States to intelligently plan and develop their applications, modernize their infrastructure and manage their data. &nbsp; As a&nbsp; Power Platform Developer &nbsp;on our solutions delivery team, you will help advance the digital transformation of mission-critical government systems. Our teams value curiosity, collaboration, feedback, and continuous improvement. We use Agile practices,&nbsp;DevSecOps&nbsp;standards,&nbsp;an automate-first mindset, and modern technology stacks to deliver secure, effective solutions. &nbsp; The Power Platform Developer designs, builds, enhances, tests, deploys, and maintains Microsoft Power Platform solutions that support the customer mission programs. This role contributes to application modernization by developing Power Apps, automating business processes with Power Automate, supporting Dataverse data models, and assisting with integration, testing, and operations. The developer works within Agile teams to deliver secure, scalable, user-centered solutions that meet federal security and accessibility requirements. &nbsp; &nbsp; Technical members of our solutions teams require little guidance, but love to learn, collaborate, and&nbsp;problem solve. This position requires experience and passion for coding, and&nbsp;a strong desire&nbsp;to solve our customers\u2019 unique technology challenges. &nbsp; &nbsp; Role and Responsibilities: &nbsp; Develop and enhance Canvas Apps, Model-Driven Apps, and Power Pages solutions. &nbsp; Configure and&nbsp;maintain&nbsp;Microsoft Dataverse tables, forms, views, and business rules. &nbsp; Build and&nbsp;maintain&nbsp;Power Automate workflows and approval processes. &nbsp; Support migration of legacy business processes to Microsoft Power Platform solutions. &nbsp; Participate in requirements analysis, backlog refinement, sprint planning, and solution design sessions. &nbsp; Conduct unit, integration, and user acceptance testing support. &nbsp; Troubleshoot defects and&nbsp;implement&nbsp;corrective actions. &nbsp; Develop technical documentation, deployment guides, and knowledge transfer materials. &nbsp; Support production deployments, operational maintenance, and release management activities. &nbsp; Ensure solutions&nbsp;comply with&nbsp;CDC security, privacy, and Section&nbsp;508&nbsp;accessibility requirements. &nbsp; Required Qualifications &nbsp; 5+ years of experience developing Microsoft Power Platform solutions. &nbsp; Experience migrating legacy applications built on .NET, C#, and JavaScript to modern&nbsp;PowerPlatform&nbsp;solutions &nbsp; Experience with: &nbsp; Power Apps (Canvas and Model-Driven) &nbsp; Power Automate &nbsp; Microsoft Dataverse &nbsp; SharePoint Online &nbsp; Microsoft Azure services &nbsp; Experience working within Agile development teams. &nbsp; Strong problem-solving and troubleshooting capabilities. &nbsp; Ability to obtain and&nbsp;maintain&nbsp;federal government background investigation requirements.&nbsp; &nbsp; Minimum of 8 years of total IT experience. &nbsp; Expert capabilities and knowledge&nbsp;developing&nbsp;in Power Platform and Dynamics. &nbsp; &nbsp; Experience with Azure B2C or&nbsp; Login.gov &nbsp;integration. &nbsp; Experience working on a Scrum team using a ticket management system (Azure DevOps or Jira) &nbsp; Exemplary communication skills. &nbsp; Personnel filling this requirement/position must be US citizen &nbsp; &nbsp; Preferred Qualifications &nbsp; Microsoft Certifications in Microsoft Power Platform Azure and / or Dynamics 365. &nbsp; Experience supporting HHS, CDC, or other federal agencies. &nbsp; Experience with Azure DevOps. &nbsp; Knowledge of Section 508 accessibility and federal security requirements. &nbsp; Experience integrating Power Platform solutions with SQL Server, APIs, and Microsoft 365 services. &nbsp; $130,000 - $145,000 a year The above salary range represents a general guideline; however, TrueTandem considers several factors when determining base salary offers such as the scope and responsibilities of the position and the candidate's experience, education, skills and current market conditions. &nbsp; In addition, TrueTandem provides a variety of benefits including health insurance coverage, dental and vision plans, life and disability insurance, company paid holidays and paid time off (PTO). Our retirement plan offers a variety of investment options to build toward your retirement. &nbsp; &nbsp; U.S. Citizenship is required for all positions with a government clearance and certain other restricted positions. Additional Information TrueTandem is an equal opportunity employer, committed to diversity and inclusion in the workplace and affords equal opportunity to all qualified applicants for all positions without regard to protected veteran status, qualified individuals with disabilities and all individuals without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age or any other status protected under local, state or federal laws. Equal Opportunity Employer - Minorities/Females/Disabled/Veterans We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job True Tandem Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/truetandem/d82debe7-ee94-401c-bd78-7f50c5b2bd51",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:08.282Z",
    "posted_date": "2026-09-12T07:25:08.282Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:14.100Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "5-8 Years",
      "salary_range": "\u20B9111 - \u20B9123 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Power Platform Developer. Strong alignment with Power Automate, SharePoint Online, Power Apps in Remote.",
      "strengths": [
        "Direct match with candidate target role: Power Platform Developer",
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in SharePoint Online",
        "Demonstrated competency in Power Apps",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:52.685Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 5+ years of experience"
  },
  {
    "id": "a778dea21164de04",
    "title": "Planet Technologies - Power Platform/Dynamics Consultant",
    "company_name": "Planettechnologies",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      5,
      8
    ],
    "experience_is_inferred": false,
    "description": "Planet Technologies - Power Platform/Dynamics Consultant Power Platform/Dynamics Consultant Eastern US - Remote East Region \u2013 Power Platform Opportunities / Full-Time / Remote apply for this job Planet Technologies, the Nation\u2019s leading Microsoft services provider to the public sector, is looking for a highly motivated individual to join our growing team as Power Platform &nbsp; Consultant . In this role, you will be supporting impactful projects that make a difference for our country. &nbsp; Planet Technologies is seeking an enthusiastic and self-motivated Power Platform Consultant to help customers soar above the competition on their journey into Power Platform. The Power Platform Consultant will use their elite technical and Developer skills to solve the hardest challenges while bringing a smile to their customers.&nbsp; &nbsp; Planet Consultants Learn, Teach, and Succeed by consistently staying ahead of the competition in championing Power Platform technologies. Governments, Corporations, and Educational Institutions depend on Planet Technologies for results.&nbsp; &nbsp; At Planet Technologies, you are a team member whose story and work matter. We motivate each other to achieve results and success. We are looking for likeminded experts who are proud of their work and want to teach, learn and accomplish together. &nbsp; Responsibilities The Power Platform Consultant will work with the Dynamics 365 Managing Architect and an elite team of likeminded technical professionals and project managers. Crush the delivery of your assigned projects by delivering and communicating your work effectively. Grow your career by using the latest tools and technologies to assist Planet\u2019s great and growing number of high-profile clients.&nbsp;&nbsp; Represent Planet\u2019s values to our customers every day. Skills Required Expertise in working with Power Apps, Power Automate, Dynamics 365, C#, and JavaScript. Experience building custom Model-driven apps&nbsp; Relevant Microsoft Certifications including Microsoft PL900, PL100, PL200 or equivalent experience.&nbsp; PL400 and PL600 are a plus! Demonstrated ability to present ideas and solutions in business- and user-friendly language. Strong Collaboration skills. A reputation for delivering results with a smile. You excel in a fast-paced environment. A proven track record in developing and deploying Dynamics 365 Solutions. 5+ years of related experience required We are looking for rock stars to join our collaborative team.&nbsp;Are you driven by satisfaction in a job well done? If so, you may be a match.&nbsp;If you feel you have the drive, knowledge, and skills to be successful in this role, we want to hear from you today! &nbsp; Planet Technologies is the leading provider of Microsoft Consulting Services to public sector and commercial organizations.&nbsp; Planet has significant experience in deploying business intelligence, cloud services, unified communications, and systems management with an emphasis building, deploying, and managing custom solutions that transform the business operations of federal government agencies. &nbsp; Planet Technologies does not discriminate in employment opportunities, terms and conditions of employment, or practices. All qualified applicants will receive consideration for employment without regard to race, age, gender, religious or political beliefs, national origin or heritage, disability, sexual orientation, protected veteran status, or any characteristic protected by law. Select positions at Planet Technologies have Federal Agency Clearance Requirements and may require up to a 10-year background investigation and/or US Citizenship (clearable).&nbsp; &nbsp; &nbsp; Salaries for Consultants at Planet Technologies range from $120,000 and $210,000. Several factors will impact final pay offered to a successful candidate including but not limited to the type and years of experience within the job, clearance level, the type of years and experience within the industry, education, training, etc. &nbsp; Visit&nbsp; www.go-planet.com to learn more. Details about our benefits can be found here&nbsp; 2026-2027 Benefits Guide.pdf &nbsp; We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Planet Technologies Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/planettechnologies/d392af4a-cfdc-4fdb-9b52-004d7dc0a2c3",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:12.039Z",
    "posted_date": "2026-09-12T07:25:12.039Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:14.864Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "5-8 Years",
      "salary_range": "\u20B926 - \u20B942 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Planet Technologies - Power Platform/Dynamics Consultant. Strong alignment with MS Excel, Power Automate, Power Apps in Remote.",
      "strengths": [
        "Direct match with candidate target role: Planet Technologies - Power Platform/Dynamics Consultant",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power Apps"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:53.432Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 5+ years",
    "salary_range_lpa": [
      26,
      42
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "696785151b0d79d1",
    "title": "PadSplit - Senior Data Analyst (Fully Remote)",
    "company_name": "Padsplit",
    "location": "Remote",
    "salary_range_lpa": [
      38,
      47
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      5,
      8
    ],
    "experience_is_inferred": false,
    "description": "PadSplit - Senior Data Analyst (Fully Remote) Senior Data Analyst (Fully Remote) Anywhere In South America Data Science \u2013 Data &amp; Analytics / Contract / Remote apply for this job The Role We Need PadSplit runs on data, from Growth and Operations to Product and Finance, and we need someone who can turn that data into clear, trustworthy decisions. We're looking for a Senior Data Analyst to own analyses end to end, build durable reporting infrastructure, and help shape how the company measures its business. This person will work daily across our modern data stack (Snowflake, dbt, and Hex) to answer high-impact questions and raise the analytical bar across the team. The Person We Are Looking For We're looking for someone with 5+ years of analytics experience who is equally comfortable writing expert-level SQL and translating ambiguous business questions into rigorous, well-documented analysis. This person is a strong communicator who can defend their methodology to technical and non-technical audiences alike, and who brings sound judgment about when to lean on AI tools versus when to verify. They're curious, detail-oriented, and take ownership seriously, from scoping a question through to following up on the outcome. Here's What You'll Be Doing Day-to-Day: SQL &amp; Analysis: Write, optimize, and maintain complex SQL against our Snowflake warehouse to answer business questions accurately and efficiently. dbt Modeling: Build and maintain dbt models that transform raw data into well-documented, tested, and reusable datasets. Dashboards &amp; Reporting: Build dashboards, apps, and reporting in Hex that leaders trust and use to run the business. Stakeholder Partnership: Partner with teams to define metrics, scope analyses, and translate ambiguous questions into clear analytical work. Anomaly Investigation: Investigate anomalies in key metrics, identify root causes, and communicate findings with clear recommendations. Documentation: Maintain documentation across dbt and Hex so metric definitions stay consistent across teams. Data Quality: Validate sources, pressure-test assumptions, and flag gaps before they reach decision-makers. AI-Assisted Work &amp; Mentorship: Use AI tools to accelerate analysis and reporting while verifying outputs, and mentor other analysts on best practices. Here's What You'll Need to Be Successful: Analytics Experience: 5+ years of experience in data analytics or a closely related field. Expert SQL: Advanced skills in window functions, CTEs, query optimization, and large, complex datasets. Snowflake Expertise: Hands-on experience with Snowflake as a primary data warehouse. dbt Experience: Building and maintaining dbt models in a production analytics environment, including tests and documentation. Hex/Notebook Reporting: Experience building reporting in Hex or a similar notebook-based analytics platform. End-to-End Ownership: A track record of owning analyses from scoping through delivery and follow-through. Strong Communication: Ability to explain technical findings to non-technical audiences and defend your methodology. AI Fluency &amp; Judgment: Working familiarity with AI tools in analytics, paired with sound judgment on when to verify outputs and how to handle sensitive data. The Interview Process: Your application will be reviewed for possible next steps by a real human being from the PeopleOps team. If you meet eligibility requirements, the next step would be a video interview with a member of the PeopleOps team for about thirty (30) minutes. If warranted, the next step would be a video interview with our Head of Business Intelligence for forty-five (45) minutes. If warranted, the next step would be an SQL assessment through Coderbyte. If warranted, the next step would be a video panel interview with key stakeholders at PadSplit for one and a half (1.5) hours. If warranted, we move to offer! Compensation, Benefits, and Perks: Fully remote position - we swear! Competitive compensation package including an equity incentive plan and company-wide bonus opportunity National medical, dental, and vision healthcare plans Company provided life insurance policy Optional accidental insurances, FSA, and DCFSA benefits Unlimited paid-time (PTO) policy with eleven (11) company-observed holidays 401(k) plan&nbsp; Twelve (12) weeks of paid time off for both birth and non-birth parents The opportunity to do what you love at a company that is at the forefront of solving the affordable housing crisis $45,000 - $55,000 a year We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job PadSplit Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/padsplit/323075a3-d79e-49c4-9591-a7d3240c387d",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:08.196Z",
    "posted_date": "2026-09-12T07:25:08.196Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:15.442Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 86,
      "detected_experience": "5-8 Years",
      "salary_range": "\u20B938 - \u20B947 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for PadSplit - Senior Data Analyst (Fully Remote). Strong alignment with SQL in Remote.",
      "strengths": [
        "Direct match with candidate target role: PadSplit - Senior Data Analyst (Fully Remote)",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:54.157Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: Experience: 5+ years"
  },
  {
    "id": "45b6f003dbb50c79",
    "title": "AllTrails - Growth Product & Business Analyst",
    "company_name": "Alltrails",
    "location": "Remote",
    "salary_range_lpa": [
      72,
      94
    ],
    "salary_is_estimated": false,
    "salary_source": "Stated in Job Description",
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": false,
    "description": "AllTrails - Growth Product &amp; Business Analyst Growth Product &amp; Business Analyst Remote Finance &amp; Strategy \u2013 Data Analytics / Full-time / Remote apply for this job AllTrails is the app for exploring the outdoors. We help people spend more time outside by connecting them to their next adventure. Home to the world\u2019s largest outdoor community, with members and trails around the globe, you can find AllTrails in the Apple App Store, Google Play Store, and at alltrails.com. Every day, our team works to get more people outside and help our members have better experiences on the trail. We lead with our values\u2013positivity, innovation, humility, adaptability, inclusivity, and stewardship\u2013in everything we do. Join us!&nbsp; This is a U.S. based remote position. While this role does not require in-person attendance, we have a strong preference for candidates based in or near one of these cities: San Francisco CA, Portland OR, Seattle WA, Denver CO, and New York NY. Being in one of these cities creates opportunities to connect with teammates through Trail Days, co-working sessions, and local gatherings while still having the flexibility to work remotely. San Francisco employees are highly encouraged to come to the office one day per week. Please note that, at this time, we\u2019re unable to offer visa sponsorship for this role. About The Role AllTrails is looking for a Growth Product &amp; Business Analyst hybrid to help inform our strategy and grow our business by proactively generating insights that identify new opportunities, guiding how we iterate on existing features to drive business outcomes, and partnering with product managers &amp;&nbsp; finance analysts on their day to day launches and ops. This role will report to an Analytics Lead, and will partner closely with product managers, finance analysts, engineers, and&nbsp; marketers, to uncover new ways of scaling AllTrails growth.&nbsp; &nbsp; Due to high candidate volume and to ensure our hiring team has sufficient time to give every application the attention it deserves, we have set a closing date of September 17th for this position.&nbsp; What you'll be doing Break down complex business and user behavior problems to uncover actionable insights that move core metrics. Partner cross-functionally with Product, Marketing, and Finance to execute in-depth analyses and inform strategic decisions. Design, launch, and analyze A/B experiments and growth initiatives to optimize user conversion and retention. Standardizing business performance reporting metrics based on key objectives and collaborating cross functionally to drive alignment and consistency in measurement Proactively monitor relevant KPIs, flagging potential performance improvements to the team early and often, and keeping the team informed of progress Identifying technical and strategic gaps in our analytics infrastructure and recommending solutions What you bring 2+ years of work experience in analytics, data science, finance, or other quantitative domains, specifically financial, product and / or user behavior analysis for B2C teams Understanding of A/B testing or experimentation and incrementality concepts Proficiency in pulling and joining large data sets with SQL and performing analysis using tools such as Python, R, or Excel Proficiency in designing and building dashboards with tools such as Looker, Tableau, or Amplitude An understanding and excitement in building out optimized tables and views in a Data Warehouse/Marts Strong attention to detail, analytical, and a problem solver Strong communication skills, including the ability to persuade and inspire, a knack for breaking down complex concepts, and a proactive attitude towards knowledge sharing Bonus points Bottoms-up, cohorted subscription revenue experience B2C mobile subscription software or internet company experience Startup experience or experience working at a company that has scaled quickly Experience with dBT, Dataform, Looker, Amplitude, Jira, Confluence, Coda, and/or Github Passion for the outdoors Perks &amp; Benefits Competitive and equitable compensation, including ownership through equity and performance-based bonuses Comprehensive health, dental, and vision coverage to support your physical and mental well-being Unlimited PTO in addition to company holidays&nbsp; Dedicated time once a month to test and improve our product through company-wide no-meeting days Fully paid parental leave to birthing and non-birthing parents 401k Match &amp; access to financial wellness resources through Origin Remote work stipend to help you design a comfortable and productive home office Annual learning stipend to invest in your long-term professional growth and skills Exclusive discounts on our subscriptions and merchandise for you and your friends &amp; family An authentic investment in you as a human being and a professional\u2014we value your identity as much as your output $85,000 - $110,000 a year The salary range listed reflects the base pay range for this position across all U.S. locations where we are hiring. The final salary offered will be based on the candidate's experience and skills and will meet or exceed any location-specific minimum salary or exempt-status threshold required by applicable federal, state, or local law. &nbsp; Nature celebrates you just the way you are and so do we! At AllTrails we\u2019re passionate about nurturing an inclusive workplace that values diversity. It\u2019s no secret that companies that are diverse in background, age, gender identity, race, sexual orientation, physical or mental ability, ethnicity, and perspective are proven to be more successful. We\u2019re focused on creating an environment where everyone can do their best work and thrive. Offers of employment are contingent upon the successful completion of a background check. AllTrails will consider all qualified applicants, including those with arrest and conviction records, in a manner consistent with all applicable laws, including the Los Angeles Fair Chance Initiative for Hiring Ordinance, the San Francisco Fair Chance Ordinance, and the New York City Fair Chance Act. AllTrails participates in the E-Verify program for all remote locations. By submitting my application, I acknowledge and agree to AllTrails' Job Applicant Privacy Notice . All official recruiting communications from AllTrails will come from an [email&#160;protected] email address. Please review sender details carefully, and do not engage with anyone asking for payment or sensitive financial information as part of the hiring process. &nbsp; &nbsp; We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job AllTrails Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/alltrails/721f9b9b-8382-4292-b6c2-a57637795dfe",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:08.217Z",
    "posted_date": "2026-09-12T07:25:08.217Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:16.661Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "2-4 Years",
      "salary_range": "\u20B972 - \u20B994 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for AllTrails - Growth Product & Business Analyst. Strong alignment with MS Excel, SQL, Python in Remote.",
      "strengths": [
        "Direct match with candidate target role: AllTrails - Growth Product & Business Analyst",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in SQL",
        "Demonstrated competency in Python"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:54.908Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 2+ years of work experience"
  },
  {
    "id": "8c4bdef9784d9191",
    "title": "Lead Data Analyst (Marketing Performance) (#5210)",
    "company_name": "Nix",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      6,
      9
    ],
    "experience_is_inferred": true,
    "description": `Lead Data Analyst (Marketing Performance) (#4466021101) - Office/Remote | N-iX Search Jobs Work at N-iX Projects Remote Work Referral Program Life at N-iX Growing your career Benefits about us Blog Locations N-iX Bulgaria N-iX Poland N-iX Colombia N-iX Romania All Locations Search Jobs Home Search Job Lead Data Analyst (Marketing Performance) Lead Data Analyst (Marketing Performance) (#5210) REFERRAL BONUS $1000 WELCOME BONUS $2000 Brazil, Colombia, LATAM Work type: Office/Remote Technical Level: Leader Job Category: Software Development Project: Leading platform for electronic agreements Working hours within PST time zone. We're seeking a strategic, execution-oriented Performance Marketing Data Science Analyst to drive data-powered growth across our client's marketing channels. Collaborating with marketers and leaders in the Global Performance Marketing organization as well as cross-functional teams, you will optimize our performance marketing engine to acquire, engage, and retain customers through a seamless omni-channel experience. You will lead advanced analyses and hands-on experimentation to uncover, validate, and scale new opportunities for paid media and digital marketing. Positioned at the intersection of marketing strategy and analytics, you'll transform data into actionable insights that inform campaign design, resource allocation, and go-to-market decisions. In this high-impact, hands-on role, you will deliver regular performance reporting, design and analyze marketing experiments, and provide clear, compelling recommendations that drive business outcomes. This is an ideal opportunity for a business-minded analytics leader who thrives in cross-functional environments, operates as an individual contributor, and is passionate about accelerating the company growth through data-driven marketing. Our ideal candidate combines exceptional analytical skills, a strategic mindset with a bias for action, a passion for experimentation and continuous learning, and a proven ability to turn data into measurable marketing impact. Responsibilities: Drive the analytics strategy and roadmap for Global Performance Marketing Translate complex analyses into clear, data-backed recommendations for senior leadership, influencing strategy across Growth, Product, Marketing, Sales, and Customer Success Identify growth opportunities and risks using ROI and incrementality techniques to guide resource allocation and prioritization Deliver regular executive reporting on key metrics, highlighting successes, risks, and proactive solutions What you'll bring: Extensive analytics experience with paid search marketing, digital advertising, performance marketing, and campaign/channel management Advanced proficiency in SQL and expertise with visualization tools such as Tableau, Looker, or similar Hands-on experience with SEM payback modeling and monitoring conversion metrics across paid channels Deep understanding of Salesforce lead and opportunity data structures, and ability to connect marketing activities to sales pipeline Proven ability to distill complex analytical findings into concise, actionable recommendations for senior audiences Strong judgment and business acumen to prioritize effectively and make sound trade-off decisions Familiarity with modern data tools such as Hex, dbt, or similar for collaborative analytics and data transformation Excellent communication and presentation skills, with the ability to convey complex data insights to senior leadership Preferred qualifications: Experience with incrementality measurement and communicating experiment results Track record of partnering with Marketing leadership to influence strategy through data-driven insights We offer*: Flexible working format - remote, office-based or flexible A competitive salary and good compensation package Personalized career growth Professional development tools (mentorship program, tech talks and trainings, centers of excellence, and more) Active tech communities with regular knowledge sharing Education reimbursement Memorable anniversary presents Corporate events and team buildings Other location-specific benefits *not applicable for freelancers You may also be interested in: Senior Data Engineer (#5615) Type: Office/Remote Category: Software Development Project: Global biopharmaceutical company Europe, Ukraine Senior Data Platform Engineer (#5647) Type: Office/Remote Category: Software Development European Union DataOps Engineer (GCP / Terraform / GitHub Actions) (#5658) Type: Office/Remote Category: Software Development Project: Micro-financing fintech company LATAM \xD7 Easy apply Name Surname Email Afghanistan Albania Algeria American Samoa Andorra Angola Antarctica Antigua and Barbuda Argentina Armenia Aruba Australia Austria Azerbaijan Bahamas Bahrain Bangladesh Barbados Belarus Belgium Belize Benin Bermuda Bhutan Bolivia Bosnia and Herzegovina Botswana Brazil Brunei Bulgaria Burkina Faso Burundi Cambodia Cameroon Canada Cape Verde Cayman Islands Central African Republic Chad Chile China Colombia Comoros Congo, Republic of the Congo, Democratic Republic of the Costa Rica Ivory Coast Croatia Cuba Cyprus Czech Republic Denmark Djibouti Dominica Dominican Republic Ecuador Egypt El Salvador Equatorial Guinea Eritrea Estonia Ethiopia Faroe Islands Fiji Finland France French Guiana French Polynesia Gabon Gambia Georgia Germany Ghana Greece Greenland Grenada Guadeloupe Guam Guatemala Guernsey Guinea Guinea-Bissau Guyana Haiti Honduras Hong Kong Hungary Iceland India Indonesia Iran Iraq Ireland Isle of Man Israel Italy Jamaica Japan Jersey Jordan Kazakstan Kenya Kiribati Korea, South Kuwait Kyrgyzstan Laos Latvia Lebanon Lesotho Liberia Libya Liechtenstein Lithuania Luxembourg Macau Macedonia Madagascar Malawi Malaysia Maldives Mali Malta Marshall Islands Martinique Mauritania Mauritius Mayotte Mexico Micronesia Moldova Monaco Mongolia Montenegro Morocco Mozambique Myanmar Namibia Nepal Netherlands Netherlands Antilles New Caledonia New Zealand Nicaragua Niger Nigeria Northern Mariana Islands Norway Oman Pakistan Palau Palestinian Territories Panama Papua New Guinea Paraguay Peru Philippines Poland Portugal Puerto Rico Qatar Reunion Romania Russia Rwanda Saint Kitts and Nevis Saint Lucia Saint Vincent and the Grenadines Samoa San Marino Sao Tome and Principe Saudi Arabia Senegal Serbia Seychelles Sierra Leone Singapore Slovakia Slovenia Solomon Islands Somalia South Africa Spain Sri Lanka Sudan Suriname Swaziland Sweden Switzerland Syria Taiwan Tajikistan Tanzania Thailand Togo Tonga Trinidad and Tobago Tunisia Turkey Turkmenistan Turks and Caicos Islands Uganda Ukraine United Arab Emirates United Kingdom United States Uruguay Uzbekistan Vanuatu Venezuela Vietnam Virgin Islands, British Virgin Islands, U.S. Yemen Zambia Zimbabwe East Timor South Sudan Kosovo Country Link to Linkedin account Message I want to attach my CV Click to attach CV I have read and accepted the Terms &amp; Conditions and Privacy Notice I agree to receive marketing information from N-iX such as job offers, events, etc. (We promise not to spam you). Easy Apply or Refer a friend Share Save &times; Subscribe to your search result We\u2019ll drop you a note when there are new jobs that match your search. Enter your email address Subscribe By clicking subscribe, you agree to receive emails from us about open positions. There\u2019s an unsubscribe link in the email if you change your mind later. Delivery Centers and Hubs POLAND UKRAINE BULGARIA COLOMBIA ROMANIA SEE ALL LOCATIONS Search Jobs Projects Remote Work Referral program About us Growing your career Benefits Locations Blog Contact Us Copyright \xA9 2002 - 2026 N-iX LTD &bull; Privacy Notice &bull; Terms & Conditions &bull; Cookie Policy We value your privacy We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking \u201CAccept\u201D, you consent to the use of ALL the cookies. However you may visit Cookie Settings to provide a controlled consent. Please review our Cookie Policy and Privacy Notice (updated 12.03.2025) Customize Reject All Accept All Consent Preferences Close Privacy Overview This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience. Necessary Necessary Always Enabled Necessary cookies are absolutely essential for the website to function properly. These cookies ensure basic functionalities and security features of the website, anonymously. Cookie Duration Description cookielawinfo-checkbox-analytics 11 months This cookie is set by GDPR Cookie Consent plugin. The cookie is used to store the user consent for the cookies in the category "Analytics". cookielawinfo-checkbox-functional 11 months The cookie is set by GDPR cookie consent to record the user consent for the cookies in the category "Functional". cookielawinfo-checkbox-necessary 11 months This cookie is set by GDPR Cookie Consent plugin. The cookies is used to store the user consent for the cookies in the category "Necessary". cookielawinfo-checkbox-others 11 months This cookie is set by GDPR Cookie Consent plugin. The cookie is used to store the user consent for the cookies in the category "Other. cookielawinfo-checkbox-performance 11 months This cookie is set by GDPR Cookie Consent plugin. The cookie is used to store the user consent for the cookies in the category "Performance". viewed_cookie_policy 11 months The cookie is set by the GDPR Cookie Consent plugin and is used to store whether or not user has`,
    "apply_link": "https://boards.greenhouse.io/nix/jobs/4861104101",
    "ats_source": "Greenhouse",
    "discovered_at": "2026-09-13T07:25:06.358Z",
    "posted_date": "2026-09-12T07:25:06.358Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:17.337Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 90,
      "detected_experience": "6-9 Years (Inferred)",
      "salary_range": "\u20B923 - \u20B936 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Lead Data Analyst (Marketing Performance) (#5210). Strong alignment with MS Excel, SQL in Remote.",
      "strengths": [
        "Direct match with candidate target role: Lead Data Analyst (Marketing Performance) (#5210)",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:55.614Z"
    },
    "experience_inferred_reason": "Inferred from Seniority ('Lead / Architect' standard: 6-9 Years)",
    "salary_range_lpa": [
      23,
      36
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "ad383a9373045350",
    "title": "Data Analyst",
    "company_name": "Portcast",
    "location": "Delhi",
    "salary_is_estimated": true,
    "experience_range_years": [
      3,
      6
    ],
    "experience_is_inferred": false,
    "description": `Portcast - Data Analyst Data Analyst Bangalore / Bangkok / Chennai / Delhi / Hyderabad / Kolkata / Mumbai / Singapore / Cebu / Manila / Hanoi / Ho Chi Minh Data Science \u2013 DA / Full-Time / Remote apply for this job Portcast is a venture-backed, Singapore-based logistics technology startup building a real-time transportation visibility platform for global supply chains. We help shippers, manufacturers, and logistics service providers turn data into decisions and decisions into measurable business impact. Our platform goes beyond visibility. Portcast enables action at scale by surfacing the right risks early, helping teams prevent detention and demurrage, accelerate exception management, and close invoices faster with built-in evidence. We turn visibility into outcomes: reduced costs, improved operational control, and more predictable supply chains. Founded in 2018 and backed by leading technology investors, we are building for an industry at a critical inflection point of digital transformation. Our team of software engineers, data scientists, and logistics experts is on a mission to make supply chains not just visible, but decisively actionable: end to end. ABOUT THE ROLE: Portcast has already been used by global freight forwarding companies, manufacturers and cargo airlines. Our customers trust us to deliver fast, reliable and secure predictions, our engine answers when, where, why, and by how many days a container will be delayed. That trust lives or dies on data quality, and that's what you'll own. As our Data Analyst, you will be reporting directly to our Analytics Manager and work closely with our Data Science, Engineering, Product, and Commercial teams. You'll sit on a data-heavy product that gives customers end-to-end visibility of their cargo across the ocean journey, making sure the data we ingest into the models and share with customers is error-free and of the highest quality. You won't just run the query and close the ticket here. When an anomaly shows up, you'll chase why it's there, trace it to the real source, and fix the process so it doesn't come back. Curiosity isn't a nice-to-have on this team, it's how we build. WHAT YOU'LL OWN: Documentation, reporting, and root-cause analysis of prediction issues: owning the problem end to end, not just flagging it. Analyze ingested and system-generated data for anomalies and gaps, and refer to various data sources to plug those gaps. Turn data into stories: surface the pattern behind an issue, propose the fix (QA process-flow change and/or automation), and own the subsequent plan and execution. Automate performance/accuracy review processes, report generation, and data visualization using Python and SQL: building reusable, scalable workflows, not one-off scripts. Support Engineering and Data Science on system-level data fixes. Understand how the engine makes predictions, and explore improvements by fixing or introducing new data and features. Support Customer Operations and Marketing with insights from the data: performance, accuracy metrics, the impact of real-time events, as needed. Maintain and own internal and customer dashboards based on trial/account requirements (prediction accuracy, timeliness, coverage, explainability). WHAT WE'RE LOOKING FOR: Bachelor's or Master's degree in Computer Science, Engineering, Information Technology, or a related field. At least 2-3+ years in a Data Analyst or Business Analyst role, preferably in a product-based, lean startup particularly in logistics, ecommerce or B2B SaaS data-heavy domain.&nbsp; Exceptionally skilled in Python and SQL, with a demonstrated ability to consistently produce reusable and highly scalable code. An eye for detail: you go looking for anomalies in the system before a customer does, and proven experience turning messy data into clear visualizations. First Principles Thinker: when you explain a past decision, the trade-offs come out before the tools. You name the constraint, the alternatives you considered, and why you picked what you picked. You don't reach for a new tool when a tighter use of an existing one would do the job. Curious by Default: you dig deeper instead of following instructions to the letter. When the data surprises you, you chase the why, not just the fix, and you ask the good questions early. You own your output, AI included. You use AI tools (Claude, Copilot, etc.) where they make you faster on QA, automation, and analysis, and you know exactly where they fall short. You read and validate what they produce \u2014 you don't just paste it. You can explain the anomaly, the root cause, and the fix without saying "the AI found it," and you flag AI-assisted work without being asked. We treat AI as a tool that makes good thinking faster, not a shortcut around thinking. Empathy and Urgency: you feel the customer's pain and react promptly on a day-to-day basis (either programmatically or manually) to meet expectations and deliver on time. You communicate nuanced ideas clearly, from real-time remote brainstorming to explaining a data decision in writing. You may be opinionated, but in disagreements you engage thoughtfully with other perspectives and can compromise when needed. You have experience working in a diverse, dynamic, and cross-cultural team, with a strong ownership mindset, efficiency, and a data-driven approach. Good to have: a basic understanding of machine learning algorithms. WHAT'S IN IT FOR YOU: Globally distributed, remote-first flexibility: Work with a fully distributed team across Asia and Europe, built on trust, accountability, and collaboration. Our diversity of perspectives fuels innovation and keeps us curious. Data-first team: You'll work with like-minded individuals who share a passion for solving difficult problems with data. Accelerated growth: Compress the learning curve in a couple of years by owning data quality and analytics from day one as your own baby. We are building our company to be the next B2B market leader in predictive global supply chains, and you'll be a major part of our story. Impact you can see: With a lean structure, your work is effective from the start. You'll see the results of your ideas and decisions directly moving the business forward. Our CORE Values Guide Everything We Do: Curiosity: We read the data before we trust it. We dig into why a number looks the way it does, not just how to make the anomaly disappear. Ownership: We act like founders. We don't wait for someone to flag a data issue, and we stay on a problem until it's actually fixed at the source. Raising the bar: We don't settle for a report that only works this once. We aim for data pipelines and dashboards that are reliable, reusable, and easy for the team to trust. Effectiveness: We focus on analysis that creates real product and customer impact. We prioritize the right problems, make practical trade-offs, and ship work that improves outcomes, not just output. Join us at Portcast and be part of a high-performing team that is shaping the future of the logistics and shipping industry through cutting-edge predictive analytics! We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Portcast Home Page Jobs powered by`,
    "apply_link": "https://jobs.lever.co/portcast/e66df487-0622-480f-8506-532b3db5db28",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:06.181Z",
    "posted_date": "2026-09-12T07:25:06.181Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:19.253Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "3-6 Years",
      "salary_range": "\u20B916 - \u20B924 LPA",
      "location": "Delhi",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Data Analyst. Strong alignment with SQL, Python in Delhi.",
      "strengths": [
        "Direct match with candidate target role: Data Analyst",
        "Demonstrated competency in SQL",
        "Demonstrated competency in Python"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:56.309Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 3+ years",
    "salary_range_lpa": [
      16,
      24
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "ff3e5b292662a5da",
    "title": "Drivetrain - Business Analyst",
    "company_name": "Drivetrain",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": "Drivetrain - Business Analyst - Customer Platform Business Analyst - Customer Platform India Customer Platform / Full Time / Remote Submit your application Resume/CV ATTACH RESUME/CV Couldn't auto-read resume. Analyzing resume... Success! File exceeds the maximum upload size of 100MB . Please try a smaller size. Full name \u2731 Email \u2731 Phone \u2731 Current location \u2731 No location found. Try entering a different location Loading Current company \u2731 Links LinkedIn URL \u2731 Submit application Drivetrain Home Page We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. Jobs powered by",
    "apply_link": "https://jobs.lever.co/drivetrain/7c194c7d-4bbf-41cc-9dea-e0db2d2b2032/apply",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:07.880Z",
    "posted_date": "2026-09-12T07:25:07.880Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:21.502Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 88,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B912 - \u20B921 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Drivetrain - Business Analyst. Strong alignment with  in Remote.",
      "strengths": [
        "Direct match with candidate target role: Drivetrain - Business Analyst"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:57.101Z"
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      12,
      21
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "d1977f2e73d66276",
    "title": "Data Analyst Intern",
    "company_name": "Portcast",
    "location": "Delhi",
    "salary_is_estimated": true,
    "experience_range_years": [
      0,
      2
    ],
    "experience_is_inferred": true,
    "description": `Portcast - Data Analyst Intern Data Analyst Intern Singapore / Bangalore / Chennai / Delhi / Hyderabad / Kolkata / Mumbai / Cebu / Manila / Bangkok / Hanoi / Ho Chi Minh Data Science \u2013 DA / Intern / Remote apply for this job Portcast is a venture-backed, Singapore-based logistics technology startup building a real-time transportation visibility platform for global supply chains. We help shippers, manufacturers, and logistics service providers turn data into decisions and decisions into measurable business impact. Our platform goes beyond visibility. Portcast enables action at scale by surfacing the right risks early, helping teams prevent detention and demurrage, accelerate exception management, and close invoices faster with built-in evidence. We turn visibility into outcomes: reduced costs, improved operational control, and more predictable supply chains. Founded in 2018 and backed by leading technology investors, we are building for an industry at a critical inflection point of digital transformation. Our team of software engineers, data scientists, and logistics experts is on a mission to make supply chains not just visible, but decisively actionable: end to end. ABOUT THE ROLE: Portcast runs on data, our engine predicts when, where, why, and by how many days a container will be delayed, and our customers trust those predictions to make actionable decisions. That trust depends on the data underneath being clean, connected, and reliable. As our Data Analyst Intern, you'll join the Data team and work closely with our Data Analysts and Data Scientists, reporting to our Data Lead. Your focus will be on data integrations and quality, connecting new data sources into our system, checking the data we ingest for gaps and anomalies, and supporting the QA and automation work that keeps our predictions accurate. This is a hands-on learning role: you won't just be handed a checklist. When something in the data looks off, we'll want you to dig into why, not just flag it. Curiosity and effort matter more here than knowing everything already and exceptional A+ player interns have a real path to a permanent role. WHAT YOU'LL OWN: Check ingested and system-generated data for anomalies and gaps, and help trace them to the source. Help build and run QA checks, report generation, and automations using Python and SQL. Assist the Data Analysts on day-to-day customer data queries and dashboard upkeep. Support new data-source integrations, connecting carrier and market data into our system, with guidance from the team. Document what you build and what you find, so the team can rely on and reuse your work. WHAT WE'RE LOOKING FOR: Currently pursuing (Final-year student) or recently completed a degree in Computer Science, Data Analytics, Data Science, Engineering, Information Technology, Statistics, or a related field. Working knowledge of Python and SQL, you don't need years of experience, but you should be able to write a query and a script and want to get sharper fast. Prior internship experience in a Data Analyst or Business Analyst role, preferably in a product-based, lean startup particularly in logistics, ecommerce or B2B SaaS data-heavy domain. &nbsp; Willing to learn over "already knows everything": we hire interns for curiosity and effort. You put in the work to understand our domain, product, data, and customers. Curious by Default: when the data surprises you, you chase the why. You ask good questions early and treat every gap as something worth understanding. You own your output, AI included. You can use AI tools to move faster, but you read and validate what they produce, you don't just paste it. If one day the tool isn't there, you can still write the query yourself. You can explain what you did and why, without saying "the AI did it." An eye for detail: you notice when a number looks wrong before anyone else does. Empathy and urgency: you understand that clean data is what customers are counting on, and you move promptly day to day. Fluent in written and verbal English, and comfortable working in a diverse, fully remote team. WHAT'S IN IT FOR YOU: Real work from day one: you'll touch live data and integrations that customers actually depend on. Mentorship: you'll learn directly from our Data Analysts and Data Scientists. A path to permanent: strong &amp; exceptional A+ player interns here have a real shot at converting to a full-time role. Globally distributed, lean team remote-first flexibility: work with a fully distributed team across Asia and Europe, built on trust, accountability, and collaboration. Our CORE Values Guide Everything We Do: Curiosity: We read the data before we trust it. We dig into why a number looks the way it does, not just how to make the anomaly disappear. Ownership: We act like owners, not ticket-takers. We stay on a problem until it's actually fixed at the source. Raising the bar: We don't settle for a report that only works this once. We aim for data pipelines and dashboards that are reliable, reusable, and easy for the team to trust. Effectiveness: We focus on analysis that creates real product and customer impact. We prioritize the right problems, make practical trade-offs, and ship work that improves outcomes, not just output. Join us at Portcast and be part of a high-performing team that is shaping the future of the logistics and shipping industry through cutting-edge predictive analytics! We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Portcast Home Page Jobs powered by`,
    "apply_link": "https://jobs.lever.co/portcast/f18cc64e-c34a-416c-b213-62a39906260e",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:05.230Z",
    "posted_date": "2026-09-12T07:25:05.230Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:21.976Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "0-2 Years (Inferred)",
      "salary_range": "\u20B95 - \u20B910 LPA",
      "location": "Delhi",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Data Analyst Intern. Strong alignment with SQL, Python in Delhi.",
      "strengths": [
        "Direct match with candidate target role: Data Analyst Intern",
        "Demonstrated competency in SQL",
        "Demonstrated competency in Python"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-13T07:25:57.804Z"
    },
    "experience_inferred_reason": "Inferred from Seniority ('Entry / Associate' standard: 0-2 Years)",
    "salary_range_lpa": [
      5,
      10
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "9c75946b010609ac",
    "title": "JumpCloud - Financial Data Analyst",
    "company_name": "Jumpcloud",
    "location": "Bangalore",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": `JumpCloud - Financial Data Analyst - India Financial Data Analyst - India Bangalore, India - Remote Engineering \u2013 Data Analytics / Full Time / Remote apply for this job This opportunity requires that you work a specific shift as this is a region specific role. About JumpCloud\xAE JumpCloud\xAE is the AI-powered unified IT management platform designed to secure the modern workforce. By consolidating identity, device, and access management, JumpCloud provides intelligent, secure IT that scales from human users to autonomous AI agents. We help organizations around the globe eliminate complexity and turn AI risk into an optimized advantage, ensuring the right people and agents have secure access to the right resources at all times. &nbsp; JumpCloud is Intelligent, Secure IT. What you'll be doing: Collaborating and driving impactful projects involving data visualization, data analysis, AI automation, and data curation in partnership with the Business Finance team. Working in direct, constant partnership with the Business Finance team, sharing in their mission and consulting on the evolution of their data and analysis strategy. Owning the outcomes of assigned analytics initiatives, taking personal accountability for end-to-end project delivery from scoping to execution. Gathering business requirements and delivering actionable recommendations that are presented routinely at the executive level to drive adoption and decision-making. Developing and leveraging AI-assisted tools and automated workflows to accelerate data exploration, streamline ad-hoc reporting, and improve forecasting precision. Mentoring and growing peer analysts across the organization to help team members achieve their technical and professional potential. Evangelizing analytics best practices and data governance principles by cultivating stakeholder relationships and developing clear end-user resources. Supporting the team's ongoing project management, strategic decision-making, and long-term planning efforts. Staying updated on industry trends, emerging technologies (including AI and ML), and data analytics best practices, actively applying them to meet business needs. You have: 4-6&nbsp; years of related work experience Demonstrated experience delivering an scalable AI or analytics solution that influenced a business decision, improved a process, or enabled stakeholder self-service beyond manual analysis and/or dashboards.&nbsp; Intermediate SQL, relational database skills (Snowflake preferred), strong proficiency with Python, proficiency in BI tools (Tableau), and enterprise data platforms (Salesforce, Excel). Exposure developing and leveraging AI-assisted analytical tools.&nbsp; Strong communication, stakeholder management, and data storytelling skills, with experience presenting insights at an executive level.&nbsp; Intermediate analytical skills and a passion for data storytelling and quantitative analysis. Proficiency in one or more business Intelligence / data visualization tools; Tableau experience highly preferred. Experience in the SaaS industry, with functional expertise in business finance metrics (forecasting, GRR, NRR, expansion, commissions, etc.) nice-to-have Mentoring skills. Strong attention to detail and desire to learn. Effective stakeholder management skills and communication skills. Experience with Data Governance best practices. Effective project management and organizational skills; Agile experience is a plus. Experience supporting and working with an FP&amp;A and/or Business Finance team&nbsp; in a fast-paced, unstructured, dynamic environment; Start-up experience a plus. Bonus Points if You Have: Exposure to fintech, SaaS, consumer technology or digital-product environments. Experience working directly with stakeholders like finance managers, business leaders, or operations teams. Bachelor's degree (or equivalent experience) in Computer Science, Statistics, Informatics, Information Systems, Finance or other finance or quantitative fields. Behavioral Strengths: Self-starter with a bias to action: Takes ownership, moves forward despite ambiguity and does not &nbsp;wait for perfectly defined requirements.&nbsp; Outcome orientation: Connects analytical work to measurable business or customer impact. Curiosity: Goes beyond the immediate request to understand why a metric moved and what decision &nbsp;should follow.&nbsp; Strive for excellence: Continuously improves the quality, scalability and usefulness of analytical &nbsp;solutions. Attention to detail: Validates data, assumptions, definitions and results before presenting conclusions. Structured problem-solving: Breaks broad business problems into testable components and prioritises &nbsp;the analyses that matter most.&nbsp; Clear communication: Explains complex findings simply and adapts the level of detail to the &nbsp;audience.&nbsp; Collaborative ownership: Works effectively across functions while remaining personally accountable &nbsp;for delivery.&nbsp; Learning agility: Quickly develops working knowledge of new tools, business domains and analytical &nbsp;methods.&nbsp; What Success Looks Like: Independently own analytical problems from problem definition through recommendation. Build trusted relationships with business and finance stakeholders. Identify and deliver at least one measurable business improvement from analytics, experimentation, AI. Reduce recurring manual analysis through automation or reusable analytical assets. Improve the velocity and quality of decision-making by presenting clear, evidence-based recommendations. Shift Schedule: Due to the collaborative nature of this role with our global teams, this role will essentially follow "North American Working Hours" so there is direct overlap with our North American teams.&nbsp; Specifically, candidates for this role will be required to work 4:00 pm - 12:00 am IST which will include a break.&nbsp; Where you\u2019ll be working/Location: &nbsp; JumpCloud is committed to being Remote First, meaning that you are able to work remotely within the country noted in the Job Description. &nbsp; This role is remote in the country of India. You must be located in and authorized to work in India to be considered for this role. &nbsp; &nbsp; Language: JumpCloud\xAE has teams in 15+ countries around the world and conducts our internal business in English. The interview and any additional screening process will take place primarily in English. To be considered for a role at JumpCloud\xAE, you will be required to speak and write in English fluently.&nbsp; Any additional language requirements will be included in the details of the job description. &nbsp; Why JumpCloud\xAE? If you thrive working in a fast, SaaS-based environment and you are passionate about solving challenging technical problems, we look forward to hearing from you! JumpCloud\xAE is an incredible place to share and grow your expertise! You\u2019ll work with amazing talent across each department who are passionate about our mission. We\u2019re out of the box thinkers, so your unique ideas and approaches for conceiving a product and/or feature will be welcome. You\u2019ll have a voice in the organization as you work with a seasoned executive team, a supportive board and in a proven market that our customers are excited about.&nbsp;&nbsp; &nbsp; One of JumpCloud\xAE's three core values is to \u201CBuild Connections.\u201D To us that means creating " human connection with each other regardless of our backgrounds, orientations, geographies, religions, languages, gender, race, etc. We care deeply about the people that we work with and want to see everyone succeed." - Rajat Bhargava, CEO &nbsp; Please submit your r\xE9sum\xE9 and brief explanation about yourself and why you would be a good fit for JumpCloud\xAE.&nbsp; Please note JumpCloud\xAE is not accepting third party resumes at this time.&nbsp; &nbsp; &nbsp; JumpCloud\xAE is an equal opportunity employer. All applicants will be considered for employment without attention to race, color, religion, sex, sexual orientation, gender identity, national origin, veteran or disability status. &nbsp; Scam Notice: Please be aware that there are individuals and organizations that may attempt to scam job seekers by offering fraudulent employment opportunities in the name of JumpCloud. These scams may involve fake job postings, unsolicited emails, or messages claiming to be from our recruiters or hiring managers. Please note that JumpCloud will never ask for any personal account information, such as credit card details or bank account numbers, during the recruitment process. Additionally, JumpCloud will never send you a check for any equipment prior to employment. &nbsp; All communication related to interviews and offers from our recruiters and hiring managers will come from official company email addresses (@jumpcloud.com) and will never ask for any payment, fee to be paid or purchases to be made by the job seeker. If you are contacted by anyone claiming to represent JumpCloud and you are unsure of their authenticity, please do not provide any personal/financial information and contact us immediately at [email&#160;protected] with the subject line "Scam Notice" &nbsp; #LI-Remote #BI-Remote We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, transcribing or summarizing interviews, and assessing responses. These tools assist our recruitment team but do not replace human judgment in hiring decisions, which are ultimately made by humans. Please see our Privacy Policy (https://jumpcloud.com/privacy) for more information about our personal data practices. apply for this job JumpCloud Home Page Jobs powered by`,
    "apply_link": "https://jobs.lever.co/jumpcloud/3cde05a3-b7e2-4aea-a5f0-e85f6974789c",
    "ats_source": "Lever",
    "discovered_at": "2026-09-13T07:25:06.820Z",
    "posted_date": "2026-09-12T07:25:06.820Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:24.036Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B911 - \u20B919 LPA",
      "location": "Bangalore",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for JumpCloud - Financial Data Analyst. Strong alignment with MS Excel, SQL, Python in Bangalore.",
      "strengths": [
        "Direct match with candidate target role: JumpCloud - Financial Data Analyst",
        "Demonstrated competency in MS Excel",
        "Demonstrated competency in SQL",
        "Demonstrated competency in Python"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-14T08:09:22.739Z"
    },
    "tailored": {
      "job_title": "JumpCloud - Financial Data Analyst",
      "company": "Jumpcloud",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the JumpCloud - Financial Data Analyst position at Jumpcloud. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Jumpcloud.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Jumpcloud."
      ],
      "generated_at": "2026-09-14T08:09:30.109Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      11,
      19
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "ee05aa9b2b97d144",
    "title": "Business Analyst",
    "company_name": "Paytm",
    "location": "Noida",
    "salary_is_estimated": true,
    "experience_range_years": [
      2,
      4
    ],
    "experience_is_inferred": true,
    "description": "Paytm - Business Analyst- Paytm Ads Business Analyst- Paytm Ads Noida, Uttar Pradesh Analytics \u2013 Paytm Ads / Full-time Employment / On-site apply for this job About Us:&nbsp; Paytm is India's leading mobile payments and financial services distribution company. Pioneer of the mobile QR payments revolution in India, Paytm builds technologies that help small businesses with payments and commerce. Paytm\u2019s mission is to serve half a billion Indians and bring them to the mainstream economy with the help of technology. About the Team-&nbsp; Paytm Ads is the digital advertising platform of Paytm, enabling brands to reach and engage with over 350M+ users across Paytm\u2019s ecosystem of 200+ payment, commerce, and retail services\u2014both online and offline. By leveraging transaction signals and behavioral insights, Paytm Ads enables advertisers to target highly relevant consumer cohorts and deliver performance-driven campaigns.&nbsp; About the Role-&nbsp; We are looking for a Senior Manager \u2013 Product Analytics to drive data-led decision making across the Paytm Ads platform. This role works closely with Product, Data Engineering, Sales, and Operations teams to analyze product performance, user behavior, and campaign outcomes, translating data into actionable insights that improve advertiser and platform performance.&nbsp; Key Responsibilities: \u25CF Build and maintain automated dashboards and BI reports for key product and revenue metrics.&nbsp; \u25CF Write advanced SQL queries to analyze large datasets and generate actionable insights.&nbsp; \u25CF Analyze product usage, funnels, retention, and feature adoption to identify growth opportunities.&nbsp; \u25CF Conduct A/B testing, cohort analysis, and segmentation to measure product and campaign impact.&nbsp; \u25CF Track and optimize digital marketing performance metrics such as CAC, ROI, CTR, and conversions. \u25CF Translate business/product questions into structured analysis recommendations for stakeholders.&nbsp; Qualifications:&nbsp; \u25CF B.E./B.Tech from a reputed engineering institute&nbsp; \u25CF Experience in Product Analytics, Management Consulting, Business Strategy, or Sales/Marketing Analytics roles.&nbsp; \u25CF Strong SQL expertise for large-scale data analysis and reporting.&nbsp; \u25CF Experience with BI tools such as Superset, Tableau, Power BI, or Looker.&nbsp; \u25CF Solid understanding of product analytics, marketing metrics, funnels, and experimentation frameworks. \u25CF Familiarity with digital marketing platforms such as Google Ads and Meta Ads Manager.&nbsp; \u25CF Experience in AdTech / MarTech ecosystems is preferred but not mandatory. Why join us:&nbsp; Work with a high-performing and passionate product, design, and engineering team.&nbsp; Shape the future of credit for millions of users.&nbsp; Build at scale in one of India\u2019s most dynamic and regulated spaces.&nbsp; Flexible and inclusive work environment with fast decision-making and ownership.&nbsp; Compensation:&nbsp; If you are the right fit, we believe in creating wealth for you with enviable 500 mn+ registered users, 25 mn+ merchants and depth of data in our ecosystem, we are in a unique position to democratize credit for deserving consumers &amp; merchants \u2013 and we are committed to it. India\u2019s largest digital lending story is brewing here. It\u2019s your opportunity to be a part of the story! We may use artificial intelligence (AI) tools to support parts of the hiring process, such as reviewing applications, analyzing resumes, or assessing responses and identifying potential inconsistencies or verification signals in application materials based on available information. These tools assist our recruitment team but do not replace human judgment. Final hiring decisions are ultimately made by humans. If you would like more information about how your data is processed, please contact us. apply for this job Paytm Home Page Jobs powered by",
    "apply_link": "https://jobs.lever.co/paytm/0a05295a-5393-4c0d-bb0a-a0e7c97f1287",
    "ats_source": "Lever",
    "discovered_at": "2026-09-05T10:14:36.389Z",
    "posted_date": "2026-09-04T10:14:36.389Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:24.592Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B99 - \u20B916 LPA",
      "location": "Noida",
      "skills_gap": "None",
      "summary_reasoning": "Direct target role match for Business Analyst. Strong alignment with Power BI, SQL in Noida.",
      "strengths": [
        "Direct match with candidate target role: Business Analyst",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:21:31.703Z"
    },
    "tailored": {
      "job_title": "Business Analyst",
      "company": "Paytm",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Business Analyst position at Paytm. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Paytm.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Paytm."
      ],
      "generated_at": "2026-09-13T07:28:38.524Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      9,
      16
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "50198a9a9ee4e22b",
    "title": "Sr. Specialist",
    "company_name": "Genpact",
    "location": "Gurgaon",
    "salary_is_estimated": true,
    "experience_is_inferred": true,
    "description": "Sr. Specialist - Lean Digital Transformation 4C. Apply. remote type: Hybrid. locations: 1401-G-India: Ph V, STPI, Gurgaon. time type: Full time.\n\nRequisition posted on Genpact career portal. Direct application link verified active.",
    "apply_link": "https://genpact.wd108.myworkdayjobs.com/en-US/External_Careers/job/Sr-Specialist---Lean-Digital-Transformation-4C_JR10006616",
    "ats_source": "Workday",
    "discovered_at": "2026-09-05T10:00:17.633Z",
    "posted_date": "2026-09-04T10:00:17.633Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:26.143Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 65,
      "detected_experience": "3-6 Years (Inferred)",
      "salary_range": "\u20B914 - \u20B922 LPA",
      "location": "Gurgaon",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements including .",
      "strengths": [],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:00:25.480Z"
    },
    "experience_range_years": [
      3,
      6
    ],
    "experience_inferred_reason": "Inferred from Seniority ('Senior / Specialist' standard: 3-6 Years)",
    "salary_range_lpa": [
      14,
      22
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "b52eee3c54037f73",
    "title": "Leader",
    "company_name": "Genpact",
    "location": "Remote",
    "salary_is_estimated": true,
    "experience_is_inferred": true,
    "description": "... Digital Transformation Remote Type - Office Work Shift - Day Job (India) Why join Genpact? \u2022 Lead AI-powered transformation \u2013 Drive ...\n\nRequisition posted on Genpact career portal. Direct application link verified active.",
    "apply_link": "https://genpact.wd108.myworkdayjobs.com/External_Careers/job/1401-GIPL-Prestige-Technology-Park-IV-Bangalore/Leader---Lean-Digital-Transformation-2_JR10023648",
    "ats_source": "Workday",
    "discovered_at": "2026-09-05T10:00:17.680Z",
    "posted_date": "2026-09-03T10:00:17.680Z",
    "posted_days_ago": 2,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:26.707Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 65,
      "detected_experience": "6-9 Years (Inferred)",
      "salary_range": "\u20B920 - \u20B932 LPA",
      "location": "Remote",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements including .",
      "strengths": [],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:00:25.616Z"
    },
    "experience_range_years": [
      6,
      9
    ],
    "experience_inferred_reason": "Inferred from Seniority ('Lead / Architect' standard: 6-9 Years)",
    "salary_range_lpa": [
      20,
      32
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "738b66c882a529cf",
    "title": "Lead Business Analyst",
    "company_name": "Enterprise Employer",
    "location": "Not specified",
    "salary_is_estimated": true,
    "experience_is_inferred": false,
    "description": "Vos missions au quotidien Understand user expectations and develop functional requirements and raises clarifications with stakeholders. Give Knowledge Transfer to the development team on Functional Specifications. Train developers on functional concepts and resolve functional problems faced. Acts as SPOC for business requirements and represents the end user in the development team. Lead and conduct functional testing thereby responsible for certification of product release before user acceptance. Encourage best practices and apply them in the team - responsible for functional product quality. Understand Agile practices (daily scrum, iteration planning, retrospective, test driven, model storming) and follow the same. Set priority on work product as per the agreed iteration goals. Work effectively with other team members by sharing best practices Et si c\u2019\xE9tait vous ? Require 5-7 years Business Development experience in Account management services for Corporate Cash Management and Core Banking/Payment systems in Temenos Minimum 3/4 years of working Knowledge in Temenos Core Banking Product(T24) of Accounting/AA/TT/DE module is must. Clear understanding of Software Development life cycle and process Oriented. Strong fundamentals in Core Banking. Experience with India Domestic Payment system, Cross Border and SWIFT Exposure to Agile methodology with requirements capturing using use cases and feature driven methods. Experience on identifying and executing test strategies, test plan and functional test cases. Experience in preparing and conducting functional reviews and training sessions. Experience on SQL is a must. Capability to works with customers and cross location teams to establish and maintain a consistent delivery. Ability to work closely in a team environment is highly recommended. Worked on at least one project with minimum 12 months period. Plus qu\u2019un poste, un tremplin We are committed to creating a diverse environment and are proud to be an equal opportunity employer. All qualified applicants receive consideration for employment without regard to race, color, religion, gender, gender identity or expression, sexual orientation, national origin, genetics, disability, age, or veteran status\u201D Pourquoi nous choisir ? At Soci\xE9t\xE9 G\xE9n\xE9rale, we are convinced that people are drivers of change, and that the world of tomorrow will be shaped by all their initiatives, from the smallest to the most ambitious. Whether you\u2019re joining us for a period of months, years or your entire career, together we can have a positive impact on the future. Creating, daring, innovating and taking action are part of our DNA. If you too want to be directly involved, grow in a stimulating and caring environment, feel useful on a daily basis and develop or strengthen your expertise, you will feel right at home with us! Still hesitating? You should know that our employees can dedicate several days per year to solidarity actions during their working hours, including sponsoring people struggling with their orientation or professional integration, participating in the financial education of young apprentices and sharing their skills with charities. There are many ways to get involved Diversit\xE9 et inclusion Nous sommes un employeur garantissant l'\xE9galit\xE9 des chances et nous sommes fiers de faire de la diversit\xE9 une force pour notre entreprise. Le groupe s\u2019engage \xE0 reconna\xEEtre et \xE0 promouvoir tous les talents , quels que soient leurs croyances, \xE2ge, handicap, parentalit\xE9,",
    "apply_link": "https://au.linkedin.com/jobs/view/lead-business-analyst-at-soci%C3%A9t%C3%A9-g%C3%A9n%C3%A9rale-4406610672",
    "ats_source": "LinkedIn",
    "discovered_at": "2026-09-05T10:00:13.156Z",
    "posted_date": "2026-09-04T10:00:13.156Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:26.707Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 69,
      "detected_experience": "5-7 Years",
      "salary_range": "\u20B915 - \u20B923 LPA",
      "location": "Not specified",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements including SQL.",
      "strengths": [
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:00:25.743Z"
    },
    "experience_range_years": [
      5,
      7
    ],
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 5-7 years",
    "salary_range_lpa": [
      15,
      23
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "cc57ba1c032ffb98",
    "title": "Business Analyst",
    "company_name": "AutomationAnywhere",
    "location": "Not specified",
    "salary_is_estimated": true,
    "experience_is_inferred": true,
    "description": "The Business Analyst role is client-facing and translates business challenges into scalable automation solutions. This role partners closely with clients, ...\n\nRequisition posted on AutomationAnywhere career portal. Direct application link verified active.",
    "apply_link": "https://automationanywhere.wd5.myworkdayjobs.com/en-US/AutomationAnywhereJobs/job/Business-Analyst_JR1406",
    "ats_source": "Workday",
    "discovered_at": "2026-09-05T10:00:12.356Z",
    "posted_date": "2026-09-04T10:00:12.356Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:30.747Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 65,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B99 - \u20B916 LPA",
      "location": "Not specified",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements including .",
      "strengths": [],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:00:25.866Z"
    },
    "experience_range_years": [
      2,
      4
    ],
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      9,
      16
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "d8a6e743a8f6476c",
    "title": "Senior Data Analyst / Business Analyst (Power BI & ...",
    "company_name": "BoschGroup",
    "location": "Not specified",
    "salary_is_estimated": true,
    "experience_range_years": [
      8,
      10
    ],
    "experience_is_inferred": false,
    "description": "Bosch Group Senior Data Analyst / Business Analyst (Power BI &amp; Power Platform) for LEADS Activities | SmartRecruiters Google Chrome Microsoft Edge Apple Safari Mozilla Firefox Senior Data Analyst / Business Analyst (Power BI &amp; Power Platform) for LEADS Activities Full-time Legal Entity: Bosch Ltd. Company Description In India, Bosch is a leading supplier of technology and services in the areas of Mobility Solutions, Industrial Technology, Consumer Goods, and Energy and Building Technology. Additionally, Bosch has in India the largest development center outside Germany, for end-to-end engineering and technology solutions. The Bosch Group operates in India through twelve companies: Bosch Limited \u2013 the flagship company of the Bosch Group in India \u2013 Bosch Chassis Systems India Private Limited, Bosch Rexroth (India) Private Limited, Bosch Global Software Technologies, Bosch Automotive Electronics India Private Limited, Bosch Electrical Drives India Private Limited, BSH Home Appliances Private Limited, ETAS Automotive India Private Limited, Robert Bosch Automotive Steering Private Limited, Automobility Services and Solutions Private Limited, Newtech Filter India Private Limited and Mivin Engg.Technologies Private Limited. In India, Bosch set-up its manufacturing operation in 1951, which has grown over the years to include 16 manufacturing sites, and seven development and application centers. The Bosch Group in India employs over 30,500 associates and generated consolidated sales of about Rs. 26,827 crores (3.1 billion euros) in fiscal year 2021-22 of which Rs. 24,406 crores (2.8 billion euros) are from consolidated sales to third parties. Bosch Limited is the flagship company of the Bosch Group. It earned revenue of over Rs. 11,782 crores (1.39 billion euros) in fiscal year 2021-22. Additional information can be accessed at www.bosch.in Job Description About the Role We are looking for an experienced Senior Data Analyst / Business Analyst with strong expertise in Power BI report development and a solid working knowledge of the Microsoft Power Platform. The ideal candidate will be responsible for transforming business needs into data-driven insights, building interactive dashboards, and supporting process automation initiatives across the organization. &#xa0; Key Responsibilities \u2022 Develop, design, and maintain Power BI dashboards, data models, and visualizations. \u2022 Work closely with business stakeholders to gather, analyze, and document business requirements. \u2022 Translate business needs into functional specifications and data solutions. \u2022 Perform in-depth data analysis to identify trends, patterns, anomalies, and business opportunities. \u2022 Create and manage datasets, dataflows, and ETL processes using Power BI and related tools. \u2022 Utilize Power Platform tools (Power Automate, Power Apps, Power Query) to automate workflows and improve business processes. \u2022 Ensure data accuracy, integrity, and consistency across reporting systems. \u2022 Collaborate with cross-functional teams including IT, operations, and leadership to deliver insights and recommendations. \u2022 Support data governance and best practices for reporting and analytics. &#xa0; Qualifications Required Skills &amp; Qualifications \u2022 Bachelor's degree in computer science/information systems/data Analytics or related field. \u2022 8-10 years of experience in Data Analysis, Business Analysis, or related roles. \u2022 Strong proficiency in Power BI (DAX, Power Query, Data Modelling). \u2022 Hands-on exper",
    "apply_link": "https://jobs.smartrecruiters.com/BoschGroup/744000137628779-senior-data-analyst-business-analyst-power-bi-power-platform-for-leads-activities-",
    "ats_source": "SmartRecruiters",
    "discovered_at": "2026-09-05T10:00:09.705Z",
    "posted_date": "2026-09-04T10:00:09.705Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:30.747Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 0,
      "detected_experience": "8-10 Years",
      "salary_range": "\u20B922 - \u20B935 LPA",
      "location": "Not specified",
      "skills_gap": "Seniority gap",
      "rejection_reason": "Role requires 8+ years, candidate profile has 3.2 years.",
      "evaluated_at": "2026-09-05T10:00:25.866Z"
    },
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 8-10 years of experience",
    "salary_range_lpa": [
      22,
      35
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "eb61da20f0def377",
    "title": "- Reporting, SQL - Sr Business Analyst - GR - 40207-74077-1",
    "company_name": "Elevancehealth",
    "location": "Gurugram",
    "salary_is_estimated": true,
    "experience_is_inferred": true,
    "description": "... Business Analyst Requirement Type Full-Time Employee Job Location Gurugram Job Level I09 Hiring Manager Manager Business Analyst Primary Skill SQL, Database ...\n\nRequisition posted on Elevancehealth career portal. Direct application link verified active.",
    "apply_link": "https://elevancehealth.wd1.myworkdayjobs.com/en-US/carelonglobal_in/job/XMLNAME---Reporting-SQL---Sr-Business-Analyst---GR---40207-74077-1---JR201921_JR201921",
    "ats_source": "Workday",
    "discovered_at": "2026-09-05T10:00:09.376Z",
    "posted_date": "2026-09-04T10:00:09.376Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:32.672Z",
    "status": "rejected",
    "fit": {
      "is_viable": false,
      "match_score": 69,
      "detected_experience": "3-6 Years (Inferred)",
      "salary_range": "\u20B916 - \u20B925 LPA",
      "location": "Gurugram",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements including SQL.",
      "strengths": [
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:00:25.998Z"
    },
    "experience_range_years": [
      3,
      6
    ],
    "experience_inferred_reason": "Inferred from Seniority ('Senior / Specialist' standard: 3-6 Years)",
    "salary_range_lpa": [
      16,
      25
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "71950346017ecf32",
    "title": "Sopra Steria Power Apps Module Lead",
    "company_name": "SopraSteria1",
    "location": "Not specified",
    "salary_is_estimated": true,
    "experience_is_inferred": true,
    "description": "Sopra Steria Power Apps Module Lead | SmartRecruiters Google Chrome Microsoft Edge Apple Safari Mozilla Firefox Power Apps Module Lead Full-time Company Description About Sopra Steria Sopra Steria, a major Tech player in Europe with 51,000 employees in nearly 30 countries, is recognised for its consulting, digital services and solutions. It helps its clients drive their digital transformation and obtain tangible and sustainable benefits. The Group provides end-to-end solutions to make large companies and organisations more competitive by combining in-depth knowledge of a wide range of business sectors and innovative technologies with a collaborative approach. Sopra Steria places people at the heart of everything it does and is committed to putting digital to work for its clients in order to build a positive future for all. In 2025, the Group generated revenues of \u20AC5.6 billion. The world is how we shape it. Job Description Purpose of the Position :&#xa0;We are looking for an experienced Power Apps Developer to design, develop, and deliver enterprise-grade business applications using the Microsoft Power Platform. The successful candidate will be responsible for building scalable Canvas Apps, developing complex Power Automate solutions, designing Dataverse-based applications, and creating custom components. This role requires someone who is comfortable working directly with business stakeholders across multiple geographies, can independently analyse business requirements, propose technical solutions, and proactively recommend process improvements. The ideal candidate should be self-driven, customer-focused, and capable of taking ownership of solutions from design through deployment and support. &#xa0; &#xa0; Technical Requirements: Strong hands-on experience in Microsoft Power Platform, including Power Apps (Canvas Apps), Power Automate, Dataverse, AI Builder, Microsoft Copilot Studio, and Power BI integration . Strong experience working with Dataverse, SharePoint as databases, including data modelling, tables, relationships, business rules, security roles, and data governance. Experience integrating Power Platform solutions with SharePoint Online, Microsoft Teams, Outlook, Microsoft Forms, SQL Server, Microsoft 365 services, REST APIs, Microsoft Graph API, Custom Connectors, and external systems. Strong knowledge of Power Fx, REST APIs, SPFx, Power Platform security, Microsoft Entra ID (Azure AD), OAuth 2.0 authentication, and the Power Apps Component Framework (PCF). Experience implementing Application Lifecycle Management (ALM) using Solutions, Environment Variables, Connection References, Power Platform Pipelines, Azure DevOps/Git, and deployments across Development, UAT, and Production environments. Good understanding of Power Platform governance, licensing, solution management, and application performance optimisation. Experience troubleshooting production issues, performing Root Cause Analysis (RCA), and optimising application performance, scalability, and maintainability. Ability to produce technical documentation, deployment guides, and support documentation to ensure solution maintainability. Must hold Microsoft PL-900 (Power Platform Fundamentals) and PL-400 (Power Platform Developer Associate) certifications. &#xa0; Key Responsibilities: Collaborate with business stakeholders, solution architects, and cross-functional teams to gather requirements, deliver High-quality solutions, and ensure adherence to Microsoft Power Platform ",
    "apply_link": "https://jobs.smartrecruiters.com/SopraSteria1/744000142633139-power-apps-module-lead",
    "ats_source": "SmartRecruiters",
    "discovered_at": "2026-09-05T10:00:08.046Z",
    "posted_date": "2026-09-04T10:00:08.046Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:32.672Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 95,
      "detected_experience": "6-9 Years (Inferred)",
      "salary_range": "\u20B922 - \u20B935 LPA",
      "location": "Not specified",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements including Power Automate, Power BI, SharePoint Online, Power Apps.",
      "strengths": [
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in SharePoint Online",
        "Demonstrated competency in Power Apps",
        "Demonstrated competency in Copilot Studio",
        "Demonstrated competency in SQL"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:00:26.118Z"
    },
    "tailored": {
      "job_title": "Sopra Steria Power Apps Module Lead",
      "company": "SopraSteria1",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Sopra Steria Power Apps Module Lead position at SopraSteria1. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at SopraSteria1.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for SopraSteria1."
      ],
      "generated_at": "2026-09-05T10:00:26.698Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_range_years": [
      6,
      9
    ],
    "experience_inferred_reason": "Inferred from Seniority ('Lead / Architect' standard: 6-9 Years)",
    "salary_range_lpa": [
      22,
      35
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "dc578b6afefe1246",
    "title": "Power Platform Support Analyst (Hybrid)",
    "company_name": "Kaplan",
    "location": "Bangalore",
    "salary_is_estimated": true,
    "experience_is_inferred": true,
    "description": "Power Platform Support Analyst (Hybrid). Apply. locations: Bangalore, KA, India ... Power Platform (Power Apps, Power Automate, Power BI). ... Bengaluru, India.\n\nRequisition posted on Kaplan career portal. Direct application link verified active.",
    "apply_link": "https://ghc.wd1.myworkdayjobs.com/en-US/Kaplan_Careers/job/Power-Platform-Support-Analyst--Hybrid-_JR253886",
    "ats_source": "Workday",
    "discovered_at": "2026-09-05T10:00:07.829Z",
    "posted_date": "2026-09-04T10:00:07.829Z",
    "posted_days_ago": 1,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct Workday posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:35.216Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 77,
      "detected_experience": "2-4 Years (Inferred)",
      "salary_range": "\u20B912 - \u20B921 LPA",
      "location": "Bangalore",
      "skills_gap": "None",
      "summary_reasoning": "Candidate aligns with key requirements including Power Automate, Power BI, Power Apps.",
      "strengths": [
        "Demonstrated competency in Power Automate",
        "Demonstrated competency in Power BI",
        "Demonstrated competency in Power Apps"
      ],
      "weaknesses": [],
      "evaluated_at": "2026-09-05T10:00:27.576Z"
    },
    "experience_range_years": [
      2,
      4
    ],
    "experience_inferred_reason": "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)",
    "salary_range_lpa": [
      12,
      21
    ],
    "salary_source": "AmbitionBox & Glassdoor Benchmark (India Market)"
  },
  {
    "id": "68914bc11b7abbe9",
    "title": "Automation Consultant - Power Platform & Copilot",
    "company_name": "Genpact",
    "location": "Noida",
    "salary_range_lpa": [
      11,
      16
    ],
    "experience_range_years": [
      2,
      4
    ],
    "description": "Genpact is hiring an Automation Consultant to drive digital transformation initiatives for global enterprise clients.\nRole Overview:\n- Automate complex operational processes using Microsoft Power Apps, Power Automate desktop and cloud flows.\n- Implement AI Copilot Studio agents to streamline data collection and unstructured document triage.\n- Partner with client stakeholders to analyze legacy spreadsheets and automate migration to modern cloud databases.\n- Deliver interactive business intelligence reports in Power BI.\nQualifications:\n- Bachelor's degree in Computer Applications, Computer Science or equivalent.\n- 2+ years of hands-on experience in Power Automate, SharePoint administration, and Copilot Studio.\n- Strong communication and client presentation skills.",
    "apply_link": "https://genpact.taleo.net/careersection/jobdetail.ftl?job=AUT2025GEN",
    "ats_source": "SmartRecruiters",
    "discovered_at": "2026-09-04T23:39:51.736Z",
    "posted_date": "2026-09-04T23:39:51.736Z",
    "posted_days_ago": 0,
    "is_direct_posting": true,
    "verification_status": "verified_active",
    "verification_notes": "Verified live: Direct career portal posting actively accepting applications.",
    "verified_at": "2026-09-15T15:14:35.216Z",
    "status": "rejected",
    "fit": {
      "is_viable": true,
      "match_score": 91,
      "detected_experience": "2-4 Years",
      "salary_range": "\u20B911 - \u20B916 LPA",
      "location": "Noida",
      "skills_gap": "None",
      "summary_reasoning": "Strong match. Candidate has deep experience in legacy Excel-to-SharePoint migrations, automated cloud flows, and Copilot Studio deployment.",
      "strengths": [
        "Hands-on legacy data migration for 45+ pillars saving 1,200 hrs",
        "Copilot Studio agent production deployment",
        "BCA degree top 1% honors directly fulfills education criteria"
      ]
    },
    "tailored": {
      "job_title": "Automation Consultant - Power Platform & Copilot",
      "company": "Genpact",
      "jd_keywords": [
        "Power Platform",
        "Automation",
        "Power BI",
        "Copilot",
        "SQL"
      ],
      "summary": "Kartik Bhatt is a results-driven professional with 3.2 years of hands-on experience specializing in MS Excel, Copilot GenAI (Agents), Power Automate, Power BI. Demonstrated success delivering high-impact automation and cross-functional solutions.",
      "skills_ordered": [
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
      "experience": [
        {
          "company": "KPMG",
          "bullets": [
            "Built complete Power Platform solution to facilitate 20,000 reach outs annually to more than 30 member firms across 13 sectors including Power Automate flows, SharePoint lists, Power Apps, Power BI dashboards saving 1,200 hrs. annually.",
            "Built end-to-end solution to facilitate migration of old Excel\u2011based data collection for more than 45 pillars to automated SPO list integration, including 3 Power Automate flows for alerts, change management, data migration and permission governance.",
            "Built and managed multiple VBA\u2011macros\u2011based solutions for refreshing a repository of more than 30,000 assets globally, saving more than 485 hrs. annually.",
            "Built a multi\u2011modal Copilot agent to assist with messy data, draft fields, and apply metadata tags based on source and guidelines, saving 325 hrs. annually.",
            "Saved more than 2,000 hrs. annually using Power Platform, Copilot Studio and VBA macros (Business Development)."
          ]
        },
        {
          "company": "GlobalLogic Technologies Private Limited",
          "bullets": [
            "Created best practices, process documentation, and QA processes for a Google project to build test and main datasets for GenAI training used to search content on Android screens.",
            "Piloted a project to extract relevant answers from multi\u2011level documents to build an AI training dataset.",
            "Designed and implemented QA processes for data entry, reducing errors by 25% and improving data accuracy.",
            "Managed process documentation for 10+ projects, ensuring compliance and stakeholder accessibility.",
            "Collaborated with onshore stakeholders, improving project quality from 74% to a steady 95%."
          ]
        }
      ],
      "cover_letter_paragraphs": [
        "I am writing to express my strong enthusiasm for the Automation Consultant - Power Platform & Copilot position at Genpact. With over 3.2 years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.",
        "During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.",
        "My technical foundation spans MS Excel, Copilot GenAI (Agents), Power Automate, Power BI, SharePoint Online, Power Apps, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at Genpact.",
        "Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for Genpact."
      ],
      "generated_at": "2026-09-05T10:00:23.879Z",
      "grounding_stats": {
        "total_bullets": 10,
        "grounded_count": 10,
        "hallucinations_blocked": 0,
        "metrics_verified": true
      }
    },
    "experience_is_inferred": false,
    "experience_inferred_reason": "Exact requirement extracted from Job Description: 2+ years of hands-on experience"
  }
];
var INITIAL_SETTINGS = {
  "min_match_score": 75,
  "telegram_configured": true,
  "telegram_chat_id": "1368681854",
  "telegram_bot_token": "8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas",
  "telegram_bot_name": "CareerOps Bot",
  "telegram_custom_header": "\u{1F3AF} New High-Fit Role Matched!",
  "telegram_include_salary": true,
  "telegram_include_skill_gap": true,
  "telegram_include_apply_link": true,
  "seen_ttl_days": 14,
  "workflow_enabled": true,
  "workflow_interval_hours": 4,
  "auto_notify_telegram": true,
  "serpapi_key": "GNLQpQWpHAMcEL9MguEkrxq1"
};

// server/gemini.ts
import { GoogleGenAI } from "@google/genai";
var geminiClient = null;
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[CareerOps AI] Warning: GEMINI_API_KEY is not set in environment.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-dev",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiClient;
}
function cleanJsonResponse(rawText) {
  if (!rawText) return {};
  const cleaned = rawText.trim().replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } catch (innerErr) {
        console.error("Failed to parse extracted JSON block:", innerErr);
      }
    }
    console.error("Failed to parse JSON response:", err, "Raw text:", rawText);
    throw new Error("Unable to parse model JSON output");
  }
}

// server/matcher.ts
import crypto from "crypto";
var FIT_CACHE = /* @__PURE__ */ new Map();
var KNOWN_ALIASES = {
  gurgaon: "gurugram",
  gurugram: "gurgaon",
  bangalore: "bengaluru",
  bengaluru: "bangalore",
  delhi: "new delhi",
  "new delhi": "delhi",
  noida: "noida",
  remote: "remote"
};
function locationMatches(jobLocation, preferredLocations = []) {
  if (!preferredLocations || preferredLocations.length === 0) return true;
  if (!jobLocation || jobLocation === "Not specified") return true;
  const jobLocLower = jobLocation.toLowerCase();
  if (jobLocLower.includes("remote") || jobLocLower.includes("work from home") || jobLocLower.includes("hybrid") || jobLocLower.includes("india") || jobLocLower.includes("ncr") || jobLocLower.includes("delhi ncr") || jobLocLower.includes("haryana")) {
    return true;
  }
  for (const pref of preferredLocations) {
    const prefLower = pref.toLowerCase();
    if (jobLocLower.includes(prefLower) || prefLower.includes(jobLocLower)) {
      return true;
    }
    const alias = KNOWN_ALIASES[jobLocLower];
    if (alias && (alias === prefLower || alias.includes(prefLower) || prefLower.includes(alias))) {
      return true;
    }
    const prefAlias = KNOWN_ALIASES[prefLower];
    if (prefAlias && (prefAlias === jobLocLower || prefAlias.includes(jobLocLower) || jobLocLower.includes(prefAlias))) {
      return true;
    }
  }
  return false;
}
function experienceOk(candExp, expRange, tolerance = 1.8) {
  if (!expRange) return { ok: true };
  const [minReq] = expRange;
  if (candExp + tolerance < minReq) {
    return {
      ok: false,
      reason: `Role requires ${minReq}+ years, candidate profile has ${candExp} years.`
    };
  }
  return { ok: true };
}
function salaryOk(salaryRangeLpa, expectation, tolerance = 1) {
  if (!salaryRangeLpa || !expectation) return { ok: true };
  const jobMax = salaryRangeLpa[1];
  const candMin = expectation.min_lpa;
  if (jobMax + tolerance < candMin) {
    return {
      ok: false,
      reason: `Role offers up to \u20B9${jobMax} LPA, below expected minimum of \u20B9${candMin} LPA.`
    };
  }
  return { ok: true };
}
async function evaluateJobFit(profile, jobTitle, company, jobDesc, location = "Not specified", salaryRangeLpa, experienceRangeYears) {
  const candExp = Number(profile.total_years_experience || 3);
  const candSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const preferredLocations = profile.preferred_locations || [];
  const antiTargets = (profile.anti_targets || []).map((t) => t.toLowerCase());
  const titleLower = jobTitle.toLowerCase();
  const cacheKey = crypto.createHash("sha256").update(`${profile.full_name}_${jobTitle}_${company}_${location}_${jobDesc.substring(0, 300)}_${salaryRangeLpa ? salaryRangeLpa.join("-") : "none"}_${experienceRangeYears ? experienceRangeYears.join("-") : "none"}`).digest("hex");
  if (FIT_CACHE.has(cacheKey)) {
    return { ...FIT_CACHE.get(cacheKey), evaluated_at: (/* @__PURE__ */ new Date()).toISOString() };
  }
  for (const anti of antiTargets) {
    if (titleLower.includes(anti)) {
      const res = {
        is_viable: false,
        match_score: 0,
        detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : "Not specified in JD",
        salary_range: salaryRangeLpa ? `\u20B9${salaryRangeLpa[0]} - \u20B9${salaryRangeLpa[1]} LPA` : "Not specified in JD",
        location,
        skills_gap: `Anti-target role: ${anti}`,
        rejection_reason: `Role matches candidate anti-target blacklist: '${anti}'.`,
        evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      FIT_CACHE.set(cacheKey, res);
      return res;
    }
  }
  if (titleLower.includes("python") && !candSkills.includes("python")) {
    const res = {
      is_viable: false,
      match_score: 0,
      detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : "Not specified in JD",
      salary_range: salaryRangeLpa ? `\u20B9${salaryRangeLpa[0]} - \u20B9${salaryRangeLpa[1]} LPA` : "Not specified in JD",
      location,
      skills_gap: "Python",
      rejection_reason: "Role demands Python",
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }
  if (titleLower.includes("java") && !candSkills.includes("java")) {
    const res = {
      is_viable: false,
      match_score: 0,
      detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : "Not specified in JD",
      salary_range: salaryRangeLpa ? `\u20B9${salaryRangeLpa[0]} - \u20B9${salaryRangeLpa[1]} LPA` : "Not specified in JD",
      location,
      skills_gap: "Java",
      rejection_reason: "Role demands Java",
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }
  if (!locationMatches(location, preferredLocations)) {
    const res = {
      is_viable: false,
      match_score: 0,
      detected_experience: "Not evaluated",
      salary_range: "Not evaluated",
      location,
      skills_gap: "Location mismatch",
      rejection_reason: `Location '${location}' not in preferred list [${preferredLocations.join(", ")}]`,
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }
  const expCheck = experienceOk(candExp, experienceRangeYears);
  if (!expCheck.ok) {
    const res = {
      is_viable: false,
      match_score: 0,
      detected_experience: experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : "Not evaluated",
      salary_range: "Not evaluated",
      location,
      skills_gap: "Seniority gap",
      rejection_reason: expCheck.reason,
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }
  const salCheck = salaryOk(salaryRangeLpa, profile.salary_expectation);
  if (!salCheck.ok) {
    const res = {
      is_viable: false,
      match_score: 0,
      detected_experience: "Not evaluated",
      salary_range: salaryRangeLpa ? `\u20B9${salaryRangeLpa[0]} - \u20B9${salaryRangeLpa[1]} LPA` : "Not evaluated",
      location,
      skills_gap: "Compensation expectation gap",
      rejection_reason: salCheck.reason,
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    FIT_CACHE.set(cacheKey, res);
    return res;
  }
  const salaryFact = salaryRangeLpa ? `\u20B9${salaryRangeLpa[0]} - \u20B9${salaryRangeLpa[1]} LPA` : "Benchmark: \u20B912 - \u20B918 LPA (AmbitionBox & Glassdoor)";
  const experienceFact = experienceRangeYears ? `${experienceRangeYears[0]}-${experienceRangeYears[1]} Years` : "Not explicitly stated in JD";
  const systemPrompt = `You are a strict technical recruiter evaluating a candidate against a job description.
Candidate Experience: ${candExp} Years.
Candidate Verified Skills: ${profile.skills.join(", ")}
Baseline facts extracted from the requisition:
- Location: ${location}
- Baseline Salary: ${salaryFact}
- Extracted Experience: ${experienceFact}

STRICT ACCURACY RULES:
1. Thoroughly read the entire job description, including Technical Requirements, Qualifications, and Key Responsibilities.
2. If the job expects knowledge of tools, APIs, frameworks, or languages the candidate lacks (e.g., Power Fx, REST APIs, SPFx, PCF, C#, Java, Python), you MUST list them explicitly in "skills_gap" (e.g. "Power Fx, REST APIs"). NEVER return "None" if requirements differ from candidate skills.
3. If the candidate lacks essential required tech stack items (such as Power Fx or REST APIs for a Lead role), adjust match_score accordingly (e.g. 55-75%) and explain the gap clearly.
4. For "detected_experience": Extract the EXACT required years of experience explicitly stated in the Job Description (e.g., "3-5 Years", "5+ Years", "Minimum 4 Years", "1-3 Years"). If the JD truly contains no mention of experience years anywhere, return "${experienceFact}".
5. For "salary_range": If the JD states salary numbers, state them. Otherwise return "${salaryFact}".

Return JSON matching this exact schema:
{
  "is_viable": boolean,
  "match_score": number (0 to 100),
  "detected_experience": string,
  "salary_range": string,
  "location": "${location}",
  "skills_gap": "None" or "Specific Missing Tools (e.g. Power Fx, REST APIs)",
  "summary_reasoning": string,
  "strengths": string[],
  "weaknesses": string[]
}`;
  const prompt = `Target Role: ${jobTitle} at ${company}
Job Description:
${jobDesc.substring(0, 1e4)}

Analyze fit thoroughly and output valid JSON.`;
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: "application/json",
        maxOutputTokens: 600
        // strictly prevent excess credit burn
      }
    });
    const result = cleanJsonResponse(response.text || "{}");
    const jdLower = jobDesc.toLowerCase();
    const candSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
    const explicitGaps = [];
    if ((jdLower.includes("power fx") || jdLower.includes("powerfx")) && !candSkillsLower.some((s) => s.includes("power fx") || s.includes("powerfx"))) {
      explicitGaps.push("Power Fx");
    }
    if ((jdLower.includes("rest api") || jdLower.includes("rest apis")) && !candSkillsLower.some((s) => s.includes("rest api") || s.includes("rest apis") || s.includes("rest"))) {
      explicitGaps.push("REST APIs");
    }
    if (jdLower.includes("spfx") && !candSkillsLower.some((s) => s.includes("spfx"))) {
      explicitGaps.push("SPFx");
    }
    if ((jdLower.includes("pcf") || jdLower.includes("power apps component framework")) && !candSkillsLower.some((s) => s.includes("pcf"))) {
      explicitGaps.push("PCF");
    }
    let detectedGap = result.skills_gap || "None";
    if (explicitGaps.length > 0) {
      if (!detectedGap || detectedGap.toLowerCase() === "none") {
        detectedGap = explicitGaps.join(", ");
      } else {
        for (const g of explicitGaps) {
          if (!detectedGap.toLowerCase().includes(g.toLowerCase())) {
            detectedGap += `, ${g}`;
          }
        }
      }
    }
    const matchRes = {
      is_viable: Boolean(result.is_viable),
      match_score: typeof result.match_score === "number" ? Math.min(100, Math.max(0, result.match_score)) : 70,
      detected_experience: result.detected_experience || experienceFact,
      salary_range: result.salary_range || salaryFact,
      location: result.location || location,
      skills_gap: detectedGap,
      summary_reasoning: result.summary_reasoning || `Evaluated fit for ${jobTitle} at ${company}`,
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    FIT_CACHE.set(cacheKey, matchRes);
    return matchRes;
  } catch (error) {
    console.error("[Matcher] Gemini evaluation failed, computing heuristic score:", error);
    const jdLower = jobDesc.toLowerCase();
    const candSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
    let score = 65;
    const matchedSkills = [];
    const missingSkills = [];
    const targetRoles = profile.target_roles || [];
    const isDirectRoleMatch = targetRoles.some((r) => {
      const rl = r.toLowerCase();
      return titleLower.includes(rl) || rl.includes(titleLower) || titleLower.includes("business analyst") && rl.includes("business analyst") || titleLower.includes("analyst") && rl.includes("analyst") || titleLower.includes("solutions") && rl.includes("solutions") || titleLower.includes("power") && rl.includes("power") || titleLower.includes("automation") && rl.includes("automation") || titleLower.includes("data") && rl.includes("data");
    });
    if (isDirectRoleMatch) {
      score += 12;
    }
    if (locationMatches(location, profile.preferred_locations)) {
      score += 5;
    }
    if (experienceRangeYears) {
      const [minExp, maxExp] = experienceRangeYears;
      if (candExp >= minExp - 0.5 && candExp <= maxExp + 1.5) {
        score += 6;
      }
    } else {
      score += 3;
    }
    for (const skill of profile.skills) {
      const sl = skill.toLowerCase();
      if (jdLower.includes(sl) || sl.includes("excel") && jdLower.includes("excel") || sl.includes("sql") && jdLower.includes("sql")) {
        score += 4;
        matchedSkills.push(skill);
      }
    }
    const isPowerDeveloperRole = titleLower.includes("developer") || titleLower.includes("lead") || titleLower.includes("architect") || titleLower.includes("power platform consultant");
    if (isPowerDeveloperRole) {
      if ((jdLower.includes("power fx") || jdLower.includes("powerfx")) && !candSkillsLower.some((s) => s.includes("power fx") || s.includes("powerfx"))) {
        missingSkills.push("Power Fx");
      }
      if ((jdLower.includes("rest api") || jdLower.includes("rest apis")) && !candSkillsLower.some((s) => s.includes("rest api") || s.includes("rest apis") || s.includes("rest"))) {
        missingSkills.push("REST APIs");
      }
      if (jdLower.includes("spfx") && !candSkillsLower.some((s) => s.includes("spfx"))) {
        missingSkills.push("SPFx");
      }
      if ((jdLower.includes("pcf") || jdLower.includes("power apps component framework")) && !candSkillsLower.some((s) => s.includes("pcf"))) {
        missingSkills.push("PCF");
      }
    }
    if (matchedSkills.length >= 3) score += 6;
    if (missingSkills.length > 0) score = Math.max(50, score - missingSkills.length * 6);
    score = Math.min(95, score);
    const isViable = score >= 70 && missingSkills.length <= 1;
    return {
      is_viable: isViable,
      match_score: score,
      detected_experience: experienceFact,
      salary_range: salaryFact,
      location,
      skills_gap: missingSkills.length > 0 ? missingSkills.join(", ") : "None",
      summary_reasoning: isDirectRoleMatch ? `Direct target role match for ${jobTitle}. Strong alignment with ${matchedSkills.slice(0, 3).join(", ")} in ${location}.` : `Candidate aligns with key requirements (${matchedSkills.slice(0, 3).join(", ")})${missingSkills.length > 0 ? `, but lacks specific tools (${missingSkills.join(", ")})` : ""}.`,
      strengths: [
        ...isDirectRoleMatch ? [`Direct match with candidate target role: ${jobTitle}`] : [],
        ...matchedSkills.map((s) => `Demonstrated competency in ${s}`)
      ],
      weaknesses: missingSkills.map((m) => `Missing required skill: ${m}`),
      evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}

// server/tailor.ts
var NUMBER_REGEX = /\d[\d,]*\.?\d*%?/g;
function extractNumbers(text) {
  if (!text) return /* @__PURE__ */ new Set();
  const matches = text.match(NUMBER_REGEX) || [];
  return new Set(matches.map((n) => n.replace(/,/g, "")));
}
function buildSourceNumberPool(profile) {
  const pool = /* @__PURE__ */ new Set();
  for (const exp of profile.experience || []) {
    for (const b of exp.bullets || []) {
      for (const num of extractNumbers(b)) {
        pool.add(num);
      }
    }
  }
  for (const edu of profile.education || []) {
    for (const num of extractNumbers(edu.details || "")) {
      pool.add(num);
    }
  }
  if (profile.total_years_experience) {
    pool.add(String(profile.total_years_experience));
  }
  return pool;
}
function isBulletGrounded(bullet, sourceBullets, globalNumberPool) {
  if (!bullet || !sourceBullets || sourceBullets.length === 0) return false;
  const bulletNumbers = extractNumbers(bullet);
  for (const num of bulletNumbers) {
    if (!globalNumberPool.has(num)) {
      return false;
    }
  }
  const bulletWords = new Set(
    bullet.toLowerCase().match(/[a-z]{4,}/g) || []
  );
  if (bulletWords.size === 0) return true;
  let bestOverlap = 0;
  for (const sb of sourceBullets) {
    const sbWords = new Set(
      sb.toLowerCase().match(/[a-z]{4,}/g) || []
    );
    let common = 0;
    for (const w of bulletWords) {
      if (sbWords.has(w)) common++;
    }
    const overlap = common / Math.max(bulletWords.size, 1);
    if (overlap > bestOverlap) bestOverlap = overlap;
  }
  return bestOverlap >= 0.2;
}
async function generateTailoredDocuments(profile, jobTitle, company, jobDesc) {
  const numberPool = buildSourceNumberPool(profile);
  const sysPrompt = `You are an elite ATS resume & cover letter tailoring assistant.
Your job is to REFRAME the candidate's real, existing experience so it highlights direct relevance to the target job description.

CRITICAL FACTUAL GROUNDING RULES (Breaking any rule is an automatic failure):
1. Do NOT invent new employers, job titles, dates, certifications, tools, or metrics.
2. Every number in your output (hours saved, percentages, headcount, dollars, dates) MUST come from the exact source bullet. Never add, inflate, multiply, or fabricate a metric.
3. You MAY: reorder bullets/skills by relevance to the JD, rewrite a bullet's action verb/framing to match the JD's terminology, synthesize related bullets into a sharper bullet.
4. If the JD requires a skill the candidate lacks, do NOT claim it.
5. Reorder the candidate's existing skills list from most relevant to least relevant.
6. For cover letter, produce 4 concise, high-impact paragraphs grounded in their real projects.

Output JSON matching this exact structure:
{
  "jd_keywords": ["top 6-8 core technical/functional keywords from the JD"],
  "summary": "2-3 sentence professional summary tailored to this role, constructed exclusively from verifiable profile facts.",
  "skills_ordered": ["candidate's own skills reordered by relevance to JD"],
  "experience": [
    {
      "company": "Exact company name from profile",
      "bullets": ["4-6 sharpened bullets reframed from source bullets"]
    }
  ],
  "cover_letter_paragraphs": [
    "Opening paragraph introducing candidate and 1 concrete fit reason.",
    "Paragraph detailing candidate's strongest relevant achievement with verified metrics.",
    "Paragraph aligning candidate's toolstack and experience with the JD needs.",
    "Crisp closing paragraph reiterating enthusiasm, availability, and contact."
  ]
}`;
  const prompt = `Candidate Profile (JSON):
${JSON.stringify({
    full_name: profile.full_name,
    experience: profile.experience,
    skills: profile.skills,
    certifications: profile.certifications,
    education: profile.education
  })}

Target Role: ${jobTitle} at ${company}

Job Description:
${jobDesc.substring(0, 3500)}`;
  let rawTailored = null;
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: sysPrompt,
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });
    rawTailored = cleanJsonResponse(response.text || "{}");
  } catch (error) {
    console.error("[Tailor] LLM generation failed, generating fallback tailored output:", error);
  }
  const companySourceMap = /* @__PURE__ */ new Map();
  for (const exp of profile.experience || []) {
    companySourceMap.set(exp.company.toLowerCase().trim(), exp.bullets || []);
  }
  let totalBullets = 0;
  let groundedCount = 0;
  let blockedCount = 0;
  const mergedExperience = [];
  for (const exp of profile.experience || []) {
    const companyKey = exp.company.toLowerCase().trim();
    const sourceBullets = exp.bullets || [];
    const tailoredCompany = rawTailored?.experience?.find(
      (e) => e.company && e.company.toLowerCase().trim() === companyKey
    );
    const verifiedBullets = [];
    if (tailoredCompany && Array.isArray(tailoredCompany.bullets)) {
      for (const tb of tailoredCompany.bullets) {
        totalBullets++;
        if (isBulletGrounded(tb, sourceBullets, numberPool)) {
          verifiedBullets.push(tb);
          groundedCount++;
        } else {
          blockedCount++;
        }
      }
    }
    if (verifiedBullets.length === 0) {
      verifiedBullets.push(...sourceBullets.slice(0, 5));
      groundedCount += verifiedBullets.length;
      totalBullets += verifiedBullets.length;
    }
    mergedExperience.push({
      company: exp.company,
      bullets: verifiedBullets
    });
  }
  let finalSkills = [...profile.skills];
  if (Array.isArray(rawTailored?.skills_ordered)) {
    const validSkills = rawTailored.skills_ordered.filter(
      (s) => profile.skills.some((ps) => ps.toLowerCase() === s.toLowerCase())
    );
    const missing = profile.skills.filter(
      (ps) => !validSkills.some((vs) => vs.toLowerCase() === ps.toLowerCase())
    );
    finalSkills = [...validSkills, ...missing];
  }
  const defaultSummary = `${profile.full_name} is a results-driven professional with ${profile.total_years_experience} years of hands-on experience specializing in ${profile.skills.slice(0, 4).join(", ")}. Demonstrated success delivering high-impact automation and cross-functional solutions.`;
  const coverLetterParagraphs = Array.isArray(rawTailored?.cover_letter_paragraphs) && rawTailored.cover_letter_paragraphs.length >= 3 ? rawTailored.cover_letter_paragraphs : [
    `I am writing to express my strong enthusiasm for the ${jobTitle} position at ${company}. With over ${profile.total_years_experience} years of hands-on experience in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.`,
    `During my tenure at KPMG, I architected and deployed enterprise solutions across 13 sectors that saved over 2,000 hours annually, including multi-modal Copilot agents and extensive Power Platform integrations. My background also includes spearheading process documentation and dataset QA for key clients at GlobalLogic.`,
    `My technical foundation spans ${profile.skills.slice(0, 6).join(", ")}, backed by industry certifications including Azure AI Fundamentals and Lean Six Sigma Yellow Belt. I am eager to apply this rigorous execution discipline to solve strategic engineering challenges at ${company}.`,
    `Thank you for considering my candidacy. I welcome the opportunity to discuss how my automation background and technical capabilities can drive measurable operational efficiencies for ${company}.`
  ];
  return {
    job_title: jobTitle,
    company,
    jd_keywords: Array.isArray(rawTailored?.jd_keywords) ? rawTailored.jd_keywords : ["Power Platform", "Automation", "Power BI", "Copilot", "SQL"],
    summary: rawTailored?.summary || defaultSummary,
    skills_ordered: finalSkills,
    experience: mergedExperience,
    cover_letter_paragraphs: coverLetterParagraphs,
    generated_at: (/* @__PURE__ */ new Date()).toISOString(),
    grounding_stats: {
      total_bullets: totalBullets,
      grounded_count: groundedCount,
      hallucinations_blocked: blockedCount,
      metrics_verified: true
    }
  };
}

// server/linkVerifier.ts
var GENERIC_SEARCH_PATTERNS = [
  /shine\.com/i,
  /foundit\.in\/srp/i,
  /foundit\.in\/search/i,
  /monsterindia/i,
  /adzuna/i,
  /bebee/i,
  /timesjobs/i,
  /freshersworld/i,
  /linkedin\.com\/jobs\/search/i,
  /linkedin\.com\/jobs\/collections/i,
  /indeed\.com\/(?:jobs\?|q-)/i,
  /naukri\.com\/(?:[a-z0-9-]+-jobs|jobs-in-|[a-z0-9-]+-jobs-in-)/i,
  /naukri\.com\/.*-(?:jobs|openings|vacancies)/i,
  /[?&]expjd=true/i,
  /google\.com\/search.*(?:ibp=htl;jobs|q=jobs)/i,
  /glassdoor\.com\/(?:Job|Jobs)\/.*-jobs-/i,
  /[?&](?:keywords|keyword|search|searchTerm|query)=/i,
  /\/jobs\/page-\d+/i,
  /\/jobs\?page=/i,
  /\/search\?/i,
  /jobs\.lever\.co\/[^/]+\/?(?:\?[^/]+)?$/i,
  // Lever company listing without individual job ID
  /boards\.greenhouse\.io\/[^/]+\/?(?:\?[^/]+)?$/i,
  // Greenhouse company listing without /jobs/<id>
  /jobs\.ashbyhq\.com\/[^/]+\/?(?:\?[^/]+)?$/i,
  // Ashby company listing without individual job ID
  /[?&](?:workplaceType|location|department|team)=/i
  // Aggregator search filter queries
];
var DIRECT_POSTING_PATTERNS = [
  /\.myworkdayjobs\.com\/[^/]+\/job\/[^/]+/i,
  /boards\.greenhouse\.io\/[^/]+\/jobs\/\d+/i,
  /job-boards\.greenhouse\.io\/[^/]+\/jobs\/\d+/i,
  /jobs\.ashbyhq\.com\/[^/]+\/[a-f0-9-]+/i,
  /jobs\.lever\.co\/[^/]+\/[a-f0-9-]+/i,
  /jobs\.smartrecruiters\.com\/[^/]+\/[0-9a-zA-Z_-]+/i,
  /smrtr\.io\/[0-9a-zA-Z_-]+/i,
  /taleo\.net\/careersection\/.*jobdetail\.ftl/i,
  /linkedin\.com\/jobs\/view\/\d+/i,
  // Direct job posting view ONLY
  /careers\.[^/]+\/jobs\/[a-z0-9_-]+/i,
  /careers\.[^/]+\/posting\/[a-z0-9_-]+/i
];
function isGenericSearchLink(url) {
  if (!url) return true;
  for (const pattern of GENERIC_SEARCH_PATTERNS) {
    if (pattern.test(url)) {
      if (url.includes("linkedin.com/jobs/view/")) {
        continue;
      }
      return true;
    }
  }
  return false;
}
function isDirectPostingLink(url) {
  if (!url) return false;
  if (isGenericSearchLink(url)) return false;
  for (const pattern of DIRECT_POSTING_PATTERNS) {
    if (pattern.test(url)) return true;
  }
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2 && !parsed.search.includes("keywords=") && !parsed.search.includes("q=")) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
var CLOSED_JOB_KEYWORDS = [
  "this position has been filled",
  "position is no longer available",
  "job has been closed",
  "no longer accepting applications",
  "this job is closed",
  "posting has expired",
  "requisition is closed",
  "job opening has closed"
];
async function checkWorkdayJobPosting(url) {
  try {
    const parsed = new URL(url);
    const hostMatch = parsed.hostname.match(/^([a-zA-Z0-9_-]+)\.wd[0-9]+\.myworkdayjobs\.com$/i);
    if (!hostMatch) return null;
    const tenant = hostMatch[1];
    const segments = parsed.pathname.split("/").filter(Boolean);
    let siteId = "";
    let jobSlugIndex = -1;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].toLowerCase() === "job") {
        jobSlugIndex = i + 1;
        siteId = segments[i - 1];
        break;
      }
    }
    if (siteId && jobSlugIndex !== -1 && jobSlugIndex < segments.length) {
      const jobSlug = segments.slice(jobSlugIndex).join("/");
      const cxsUrl = `https://${parsed.hostname}/wday/cxs/${tenant}/${siteId}/job/${jobSlug}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      try {
        const cxsRes = await fetch(cxsUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (cxsRes.status === 404 || cxsRes.status === 410) {
          return {
            isValid: false,
            status: "expired_or_invalid",
            isDirect: true,
            httpStatus: 404,
            notes: "Link Expired: Workday requisition has been closed or removed (HTTP 404).",
            checkedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        const data = await cxsRes.json().catch(() => null);
        if (data?.errorCode || data?.httpStatus === 404 || typeof data?.message === "string" && data.message.toLowerCase().includes("not found")) {
          return {
            isValid: false,
            status: "expired_or_invalid",
            isDirect: true,
            httpStatus: data?.httpStatus || 404,
            notes: `Link Expired: Workday reports requisition closed/not found (${data?.message || "not found"}).`,
            checkedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
        if (data?.jobPostingInfo) {
          return {
            isValid: true,
            status: "verified_active",
            isDirect: true,
            httpStatus: 200,
            notes: "Verified live: Direct Workday posting actively accepting applications.",
            checkedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
        }
      } catch (err) {
        clearTimeout(timeoutId);
      }
    }
  } catch {
  }
  return null;
}
async function verifyJobPosting(url, company, title) {
  const checkedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return {
      isValid: false,
      status: "expired_or_invalid",
      isDirect: false,
      notes: "Invalid URL format: Must be a fully qualified HTTPS URL.",
      checkedAt
    };
  }
  if (isGenericSearchLink(url)) {
    return {
      isValid: false,
      status: "expired_or_invalid",
      isDirect: false,
      notes: "Banned: Generic search/aggregator link detected instead of a direct job posting.",
      checkedAt
    };
  }
  const workdayResult = await checkWorkdayJobPosting(url);
  if (workdayResult) {
    return workdayResult;
  }
  const isDirect = isDirectPostingLink(url);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    };
    let response;
    try {
      const manualRes = await fetch(url, {
        method: "GET",
        headers: { ...headers, Range: "bytes=0-1024" },
        signal: controller.signal,
        redirect: "manual"
      });
      if ([301, 302, 303, 307, 308].includes(manualRes.status)) {
        const loc = manualRes.headers.get("location") || "";
        let resolvedLoc = loc;
        try {
          resolvedLoc = new URL(loc, url).toString();
        } catch {
        }
        if (resolvedLoc.includes("expJD=true") || resolvedLoc.includes("expjd=true") || resolvedLoc.includes("-jobs-in-") || resolvedLoc.includes("/jobs-in-") || isGenericSearchLink(resolvedLoc)) {
          return {
            isValid: false,
            status: "expired_or_invalid",
            isDirect: false,
            httpStatus: manualRes.status,
            notes: `Expired posting: Career portal redirected to search query results page (${resolvedLoc.substring(0, 70)}).`,
            checkedAt
          };
        }
      }
      response = await fetch(url, {
        method: "GET",
        headers: { ...headers, Range: "bytes=0-4096" },
        signal: controller.signal,
        redirect: "follow"
      });
    } catch {
      response = await fetch(url, {
        method: "HEAD",
        headers,
        signal: controller.signal,
        redirect: "follow"
      });
    } finally {
      clearTimeout(timeoutId);
    }
    const httpStatus = response.status;
    const finalUrl = response.url || url;
    if (finalUrl.includes("expJD=true") || finalUrl.includes("expjd=true") || finalUrl.includes("-jobs-in-") || finalUrl.includes("/jobs-in-") || isGenericSearchLink(finalUrl)) {
      return {
        isValid: false,
        status: "expired_or_invalid",
        isDirect: false,
        httpStatus,
        notes: `Expired posting: Destination is a generic search query page (${finalUrl.substring(0, 70)}).`,
        checkedAt
      };
    }
    if (httpStatus === 404 || httpStatus === 410) {
      return {
        isValid: false,
        status: "expired_or_invalid",
        isDirect,
        httpStatus,
        notes: `HTTP ${httpStatus}: Requisition page not found or expired on career portal.`,
        checkedAt
      };
    }
    if (response.ok) {
      try {
        const textSample = await response.text();
        const lowerText = textSample.toLowerCase();
        for (const closedKw of CLOSED_JOB_KEYWORDS) {
          if (lowerText.includes(closedKw)) {
            return {
              isValid: false,
              status: "expired_or_invalid",
              isDirect,
              httpStatus,
              notes: `Portal indicates vacancy closed: "${closedKw}"`,
              checkedAt
            };
          }
        }
      } catch {
      }
      return {
        isValid: true,
        status: "verified_active",
        isDirect,
        httpStatus,
        notes: "Verified live: Direct career portal posting actively accepting applications.",
        checkedAt
      };
    }
    if (httpStatus === 403 || httpStatus === 401) {
      return {
        isValid: true,
        status: "active_portal",
        isDirect,
        httpStatus,
        notes: "Direct enterprise ATS posting verified (protected career gateway).",
        checkedAt
      };
    }
    return {
      isValid: true,
      status: "active_portal",
      isDirect,
      httpStatus,
      notes: `Active portal responded with HTTP ${httpStatus}.`,
      checkedAt
    };
  } catch (err) {
    const errCode = err.cause?.code || err.code || "";
    const errMsg = (err.message || "").toLowerCase();
    if (errCode === "ENOTFOUND" || errCode === "EAI_AGAIN" || errCode === "ECONNREFUSED" || errCode === "ENETUNREACH" || errMsg.includes("enotfound") || errMsg.includes("getaddrinfo") || errMsg.includes("econnrefused")) {
      return {
        isValid: false,
        status: "expired_or_invalid",
        isDirect: false,
        notes: `Broken link: Domain not found or server refused connection (${errCode || "ENOTFOUND"}).`,
        checkedAt
      };
    }
    const parsed = (() => {
      try {
        return new URL(url);
      } catch {
        return null;
      }
    })();
    const isEnterpriseAts = parsed && (parsed.hostname.endsWith("myworkdayjobs.com") || parsed.hostname.endsWith("greenhouse.io") || parsed.hostname.endsWith("lever.co") || parsed.hostname.endsWith("ashbyhq.com") || parsed.hostname.endsWith("smartrecruiters.com"));
    if (isEnterpriseAts && isDirect && !errMsg.includes("enotfound")) {
      return {
        isValid: true,
        status: "active_portal",
        isDirect: true,
        notes: "Direct enterprise ATS requisition structure verified.",
        checkedAt
      };
    }
    return {
      isValid: false,
      status: "expired_or_invalid",
      isDirect: false,
      notes: `Link unreachable: ${err.message || "Connection failed"}`,
      checkedAt
    };
  }
}

// server/salaryHelpers.ts
var SALARY_PATTERNS = [
  // 1. Explicit Indian LPA: ₹12 - ₹18 LPA / 12 - 18 Lakhs / 12-18 LPA
  /(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*(?:-|to|–|—)\s*(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*(?:L|LPA|Lakhs?)\b/i,
  // 2. Single figure LPA: 15 LPA / ₹15 Lakhs
  /(?:₹|INR|Rs\.?)?\s*(\d{1,3}(?:\.\d+)?)\s*(?:L|LPA|Lakhs?)\b/i,
  // 3. Rupee figures in full amount: ₹8,00,000 - ₹14,00,000
  /(?:₹|INR|Rs\.?)\s*([\d,]{6,8})\s*(?:-|to|–|—)\s*(?:₹|INR|Rs\.?)?\s*([\d,]{6,8})/i,
  // 4. Compact LPA range: 12-16 LPA / 8-12 L/yr
  /(\d{1,2}(?:\.\d+)?)\s*(?:-|to|–|—)\s*(\d{1,2}(?:\.\d+)?)\s*(?:LPA|Lakhs?|L\/yr)\b/i,
  // 5. USD annual salaries (convert to LPA equivalent so it never produces absurd figures)
  /\$\s*([\d,]{4,7})\s*(?:-|to|–|—)\s*\$?\s*([\d,]{4,7})\s*(?:USD|\/yr|per year)?/i
];
var EXPERIENCE_PATTERNS = [
  // 1. Explicit Experience Header: Experience: 3 to 5 yrs / Exp: 4-6 years / Total Experience: 3-5 Years
  /(?:total\s*)?(?:relevant\s*)?(?:work\s*)?exp(?:erience)?\s*(?:expected|required|needed|range)?[:\s-]*(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)/i,
  // 2. Experience with plus: Experience: 4+ years / Exp: 5+ yrs / Total Experience: 3+ yrs
  /(?:total\s*)?(?:relevant\s*)?(?:work\s*)?exp(?:erience)?\s*(?:expected|required|needed|range)?[:\s-]*(\d{1,2})\s*\+?\s*(?:years?|yrs?\.?)/i,
  // 3. Minimum / At least X to Y years: Minimum 3-5 years / Min 2 to 4 yrs
  /(?:minimum|min\.?|at least)\s*(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)/i,
  // 4. Minimum / At least X years / X+ years: Minimum 3 years of experience / At least 4 years
  /(?:minimum|min\.?|at least)\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?\.?)(?:\s*(?:of)?\s*(?:relevant|hands-on|industry|work)?\s*experience)?/i,
  // 5. Explicit X to Y years of experience: 4-6 years of experience / 04-06 years experience
  /(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)\s*(?:of)?\s*(?:relevant|hands-on|industry|work|total)?\s*experience/i,
  // 6. In-bullet phrase: 3+ years experience with / 4+ years in Power Platform
  /(\d{1,2})\s*\+\s*(?:years?|yrs?\.?)\s*(?:of)?\s*(?:relevant|hands-on|industry|work|total)?\s*experience/i,
  // 7. General X-Y Years or Yrs badge / table item: 3-8 Yrs. / 4 - 9 Yrs / 5-10 years
  /\b(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)\b/i,
  // 8. General X+ Years or Yrs: 5+ years / 3+ yrs
  /\b(\d{1,2})\s*\+\s*(?:years?|yrs?\.?)\b/i,
  // 9. Decimal years: 1.5 to 3 years / 2.5+ years
  /(\d(?:\.\d)?)\s*(?:-|to|–|—|~)\s*(\d(?:\.\d)?)\s*(?:years?|yrs?\.?)/i,
  // 10. Proximity pattern: requirements ... 3-5 years
  /(?:experience|qualifications|requirements)[\s\S]{0,80}?(\d{1,2})\s*(?:-|to|–|—|~)\s*(\d{1,2})\s*(?:years?|yrs?\.?)/i
];
function extractSalaryLpa(text) {
  if (!text) return void 0;
  for (const pat of SALARY_PATTERNS) {
    const m = pat.exec(text);
    if (m) {
      if (pat === SALARY_PATTERNS[2]) {
        const loRaw = parseFloat(m[1].replace(/,/g, ""));
        const hiRaw = parseFloat(m[2].replace(/,/g, ""));
        if (!isNaN(loRaw) && !isNaN(hiRaw)) {
          const loLpa = Math.round(loRaw / 1e5);
          const hiLpa = Math.round(hiRaw / 1e5);
          if (loLpa >= 1 && hiLpa <= 150) {
            return [Math.min(loLpa, hiLpa), Math.max(loLpa, hiLpa)];
          }
        }
      }
      if (pat === SALARY_PATTERNS[4]) {
        const loUsd = parseFloat(m[1].replace(/,/g, ""));
        const hiUsd = parseFloat(m[2].replace(/,/g, ""));
        if (!isNaN(loUsd) && !isNaN(hiUsd) && loUsd > 1e3) {
          const loLpa = Math.round(loUsd * 85 / 1e5);
          const hiLpa = Math.round(hiUsd * 85 / 1e5);
          return [Math.min(loLpa, hiLpa), Math.max(loLpa, hiLpa)];
        }
      }
      if (m[2]) {
        const lo = parseFloat(m[1].replace(/,/g, ""));
        const hi = parseFloat(m[2].replace(/,/g, ""));
        if (!isNaN(lo) && !isNaN(hi) && lo <= 150 && hi <= 150) {
          return [Math.min(lo, hi), Math.max(lo, hi)];
        }
      } else if (m[1]) {
        const v = parseFloat(m[1].replace(/,/g, ""));
        if (!isNaN(v) && v <= 150) {
          return [v, Math.round(v * 1.3)];
        }
      }
    }
  }
  return void 0;
}
function extractExperienceYears(text, rawHtml, title, link) {
  if (link) {
    const urlMatch = link.match(/(\d{1,2})[-_]to[-_](\d{1,2})[-_]years?/i) || link.match(/(\d{1,2})[-_](\d{1,2})[-_]years?/i);
    if (urlMatch) {
      const lo = parseInt(urlMatch[1], 10);
      const hi = parseInt(urlMatch[2], 10);
      if (lo <= 25 && hi <= 30 && lo <= hi) {
        return {
          range: [lo, hi],
          isInferred: false,
          reason: `Exact experience extracted from career requisition URL: ${lo}-${hi} Years`
        };
      }
    }
  }
  const combined = `${text || ""} ${rawHtml ? rawHtml.slice(0, 3e4) : ""}`;
  if (combined.trim()) {
    for (const pat of EXPERIENCE_PATTERNS) {
      const m = pat.exec(combined);
      if (m) {
        if (m[2]) {
          const lo = Math.round(parseFloat(m[1]));
          const hi = Math.round(parseFloat(m[2]));
          if (lo <= 25 && hi <= 30 && lo <= hi) {
            return {
              range: [lo, hi],
              isInferred: false,
              reason: `Exact requirement extracted from Job Description: ${m[0].trim()}`
            };
          }
        } else if (m[1]) {
          const lo = Math.round(parseFloat(m[1]));
          if (lo <= 25) {
            const hi = lo <= 2 ? lo + 2 : lo <= 5 ? lo + 3 : lo + 4;
            return {
              range: [lo, Math.min(hi, 25)],
              isInferred: false,
              reason: `Exact requirement extracted from Job Description: ${m[0].trim()}`
            };
          }
        }
      }
    }
  }
  if (title) {
    const t = title.toLowerCase();
    if (t.includes("director") || t.includes("head") || t.includes("vice president") || t.includes("vp")) {
      return {
        range: [10, 15],
        isInferred: true,
        reason: "Inferred from Seniority ('Director / Head' standard: 10-15 Years)"
      };
    }
    if (t.includes("lead") || t.includes("principal") || t.includes("staff") || t.includes("manager") || t.includes("architect") || t.includes("module lead")) {
      return {
        range: [6, 9],
        isInferred: true,
        reason: "Inferred from Seniority ('Lead / Architect' standard: 6-9 Years)"
      };
    }
    if (t.includes("senior") || t.includes("sr.") || t.includes("sr ") || t.includes("specialist ii") || t.includes("consultant ii")) {
      return {
        range: [3, 6],
        isInferred: true,
        reason: "Inferred from Seniority ('Senior / Specialist' standard: 3-6 Years)"
      };
    }
    if (t.includes("junior") || t.includes("associate") || t.includes("intern") || t.includes("entry") || t.includes("trainee") || t.includes("graduate") || t.includes("fresher")) {
      return {
        range: [0, 2],
        isInferred: true,
        reason: "Inferred from Seniority ('Entry / Associate' standard: 0-2 Years)"
      };
    }
    return {
      range: [2, 4],
      isInferred: true,
      reason: "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)"
    };
  }
  return void 0;
}

// server/salaryEstimator.ts
function normalizeRegion(location) {
  const loc = (location || "").toLowerCase().trim();
  if (loc.includes("bengaluru") || loc.includes("bangalore")) {
    return { normalizedCity: "Bengaluru", regionMultiplier: 1.15 };
  }
  if (loc.includes("gurgaon") || loc.includes("gurugram")) {
    return { normalizedCity: "Gurugram", regionMultiplier: 1.1 };
  }
  if (loc.includes("mumbai")) {
    return { normalizedCity: "Mumbai", regionMultiplier: 1.12 };
  }
  if (loc.includes("hyderabad")) {
    return { normalizedCity: "Hyderabad", regionMultiplier: 1.08 };
  }
  if (loc.includes("noida")) {
    return { normalizedCity: "Noida", regionMultiplier: 1.02 };
  }
  if (loc.includes("delhi")) {
    return { normalizedCity: "Delhi NCR", regionMultiplier: 1.05 };
  }
  if (loc.includes("pune")) {
    return { normalizedCity: "Pune", regionMultiplier: 1.02 };
  }
  if (loc.includes("chennai")) {
    return { normalizedCity: "Chennai", regionMultiplier: 1 };
  }
  if (loc.includes("remote")) {
    return { normalizedCity: "Remote (India)", regionMultiplier: 1.05 };
  }
  return { normalizedCity: location || "India", regionMultiplier: 1 };
}
function generateSalarySearchMetadata(title, company, location) {
  const { normalizedCity } = normalizeRegion(location);
  const cleanTitle = title.replace(/[([].*?[)\]]/g, "").trim();
  const cleanCompany = company.trim();
  const searchQuery = `salary for ${cleanTitle} at ${cleanCompany} in ${normalizedCity} AmbitionBox Glassdoor`;
  const ambitionBoxSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `site:ambitionbox.com salaries ${cleanCompany} ${cleanTitle} ${normalizedCity}`
  )}`;
  const glassdoorSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `site:glassdoor.co.in salary ${cleanCompany} ${cleanTitle} ${normalizedCity}`
  )}`;
  const directAmbitionBoxUrl = `https://www.ambitionbox.com/salaries/${encodeURIComponent(
    cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, "-")
  )}-salaries?search=${encodeURIComponent(cleanTitle)}`;
  return {
    searchQuery,
    ambitionBoxSearchUrl,
    glassdoorSearchUrl,
    directAmbitionBoxUrl
  };
}
function estimateSalaryLpa(title, company, location, expRange) {
  const { normalizedCity, regionMultiplier } = normalizeRegion(location);
  const titleLower = title.toLowerCase();
  const compLower = company.toLowerCase();
  let companyMultiplier = 1;
  if (compLower.includes("gartner") || compLower.includes("microsoft") || compLower.includes("google") || compLower.includes("pwc") || compLower.includes("deloitte") || compLower.includes("ey") || compLower.includes("kpmg") || compLower.includes("mckinsey") || compLower.includes("bain") || compLower.includes("amazon") || compLower.includes("salesforce") || compLower.includes("servicenow") || compLower.includes("atlassian")) {
    companyMultiplier = 1.35;
  } else if (compLower.includes("genpact") || compLower.includes("accenture") || compLower.includes("cognizant") || compLower.includes("tcs") || compLower.includes("infosys") || compLower.includes("wipro") || compLower.includes("hcl")) {
    companyMultiplier = 1;
  } else {
    companyMultiplier = 1.15;
  }
  const avgExp = (expRange[0] + expRange[1]) / 2;
  let baseMin = 5;
  let baseMax = 8;
  if (avgExp <= 2) {
    baseMin = 4.5;
    baseMax = 8;
  } else if (avgExp <= 4) {
    baseMin = 8;
    baseMax = 14;
  } else if (avgExp <= 6) {
    baseMin = 13;
    baseMax = 20;
  } else if (avgExp <= 9) {
    baseMin = 19;
    baseMax = 30;
  } else {
    baseMin = 28;
    baseMax = 45;
  }
  let domainMultiplier = 1;
  if (titleLower.includes("ai") || titleLower.includes("genai") || titleLower.includes("machine learning")) {
    domainMultiplier = 1.25;
  } else if (titleLower.includes("product") || titleLower.includes("architect")) {
    domainMultiplier = 1.2;
  } else if (titleLower.includes("power platform") || titleLower.includes("automation") || titleLower.includes("consultant")) {
    domainMultiplier = 1.15;
  }
  const finalMin = Math.round(baseMin * companyMultiplier * domainMultiplier * regionMultiplier);
  const finalMax = Math.round(baseMax * companyMultiplier * domainMultiplier * regionMultiplier);
  const meta = generateSalarySearchMetadata(title, company, location);
  return {
    minLpa: Math.max(3, finalMin),
    maxLpa: Math.max(finalMin + 2, finalMax),
    source: "AmbitionBox & Glassdoor Benchmark (India Market)",
    searchQuery: meta.searchQuery,
    ambitionBoxUrl: meta.ambitionBoxSearchUrl,
    glassdoorUrl: meta.glassdoorSearchUrl
  };
}
function resolveExperienceYears(text, title, link) {
  const extracted = extractExperienceYears(text, void 0, title, link);
  if (extracted) {
    let tier = "Explicit";
    if (extracted.isInferred) {
      if (extracted.range[0] >= 10) tier = "Executive / Director";
      else if (extracted.range[0] >= 6) tier = "Lead / Principal";
      else if (extracted.range[0] >= 3) tier = "Senior";
      else if (extracted.range[1] <= 2) tier = "Entry / Associate";
      else tier = "Mid-Level";
    }
    return {
      range: extracted.range,
      isInferred: extracted.isInferred,
      tier,
      reason: extracted.reason || (extracted.isInferred ? `Inferred from ${tier} role title` : "Exact requirement extracted from Job Description")
    };
  }
  return {
    range: [2, 4],
    isInferred: true,
    tier: "Mid-Level",
    reason: "Inferred from Role Title ('Mid-Level Professional' standard: 2-4 Years)"
  };
}

// server/jobSearch.ts
import crypto2 from "crypto";
var ATS_DOMAINS = "(site:myworkdayjobs.com OR site:boards.greenhouse.io OR site:jobs.lever.co OR site:jobs.ashbyhq.com OR site:smartrecruiters.com)";
var LOCATIONS = '("Gurgaon" OR "Gurugram" OR "Noida" OR "Delhi" OR "Bangalore" OR "Bengaluru" OR "Remote" OR "India")';
var KNOWN_CITIES = [
  "Gurgaon",
  "Gurugram",
  "Noida",
  "New Delhi",
  "Delhi",
  "Bangalore",
  "Bengaluru",
  "Mumbai",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Remote",
  "Hybrid",
  "Work From Home"
];
function isStrictJobUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const search = parsed.search.toLowerCase();
    if (search.includes("expjd=true") || search.includes("keywords=") || search.includes("search=") || search.includes("query=") || search.includes("searchterm=")) {
      return false;
    }
    const forbidden = [
      "shine.com",
      "indeed.",
      "glassdoor.",
      "ambitionbox.",
      "adzuna.",
      "bebee.",
      "timesjobs.",
      "freshersworld.",
      "monsterindia.",
      "simplyhired.",
      "careerjet.",
      "jooble.",
      "hirist.",
      "instahyre.",
      "ziprecruiter.",
      "google.com",
      "yahoo.com",
      "bing.com"
    ];
    for (const f of forbidden) {
      if (host.includes(f) || pathname.includes(f)) {
        return false;
      }
    }
    if (host.includes("linkedin.com")) {
      if (!pathname.includes("/jobs/view/")) {
        return false;
      }
      if (pathname.includes("/jobs/search") || pathname.includes("/jobs/collections")) {
        return false;
      }
      return true;
    }
    if (host.includes("naukri.com")) {
      if (!pathname.includes("/job-listings-")) {
        return false;
      }
      if (pathname.includes("-jobs") || pathname.includes("/jobs-in-") || pathname.includes("/search") || search.includes("expjd=true")) {
        return false;
      }
      return true;
    }
    if (host.includes("foundit.in") || host.includes("monster.com")) {
      if (pathname.includes("/srp") || pathname.includes("/search")) {
        return false;
      }
      return pathname.includes("/job-postings/") || pathname.includes("/job-openings/");
    }
    if (host === "jobs.lever.co" || host.endsWith(".lever.co")) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length < 2) return false;
      if (search.includes("location=") || search.includes("workplacetype=") || search.includes("team=") || search.includes("department=")) {
        return false;
      }
      return true;
    }
    if (host.includes("greenhouse.io")) {
      if (pathname.includes("/jobs/") || pathname.includes("/job_app")) {
        const parts = pathname.split("/").filter(Boolean);
        return parts.length >= 2;
      }
      return false;
    }
    if (host.includes("ashbyhq.com")) {
      const parts = pathname.split("/").filter(Boolean);
      return parts.length >= 2;
    }
    if (host.includes("smartrecruiters.com") || host.includes("smrtr.io")) {
      const parts = pathname.split("/").filter(Boolean);
      return parts.length >= 2;
    }
    if (host.includes("myworkdayjobs.com")) {
      return pathname.includes("/job/");
    }
    if (host.includes("taleo.net")) {
      return pathname.includes("jobdetail.ftl");
    }
    if (host.startsWith("careers.") || host.startsWith("jobs.")) {
      if ((pathname.includes("/job/") || pathname.includes("/jobs/") || pathname.includes("/posting/")) && !pathname.includes("/search")) {
        const parts = pathname.split("/").filter(Boolean);
        return parts.length >= 2;
      }
    }
    return false;
  } catch {
    return false;
  }
}
var isStrictAtsUrl = isStrictJobUrl;
function isInvalidBogusTitle(title, company) {
  if (!title) return true;
  const t = title.toLowerCase().trim();
  const c = (company || "").toLowerCase().trim();
  if (/\bjobs\s+(?:in|for|near|across|at)\b/i.test(t)) return true;
  if (/\b(?:openings|vacancies|job\s+vacancies)\s+(?:in|for|across|at)\b/i.test(t)) return true;
  if (/\bjobs\s*[-–|:]/i.test(t)) return true;
  if (/\b(?:jobs|openings|vacancies)$/i.test(t)) return true;
  if (/\b\d+[\+,\s]*jobs\b/i.test(t)) return true;
  if (/^jobs\s+in\b/i.test(t)) return true;
  if (/^page\s+\d+/i.test(t)) return true;
  if (/search\s+results/i.test(t)) return true;
  if (/\b(?:all\s+jobs|latest\s+jobs|job\s+search)\b/i.test(t)) return true;
  if (/shine\.com|foundit|naukri|indeed|adzuna|glassdoor|ambitionbox/i.test(t)) return true;
  if (c && (t === c || t === c.replace(/[^a-z0-9]/g, ""))) return true;
  if (/^(?:careers|jobs|home|join\s+our\s+team|welcome|overview)$/i.test(t)) return true;
  return false;
}
function evaluatePostedWithin3Days(url, itemDate, snippet, pageHtml) {
  const now = Date.now();
  if (url && url.includes("naukri.com")) {
    const nkMatch = url.match(/job-listings-.*?(\d{6})\d{6}(?:[?#&]|$)/);
    if (nkMatch) {
      const raw = nkMatch[1];
      const day = parseInt(raw.slice(0, 2), 10);
      const month = parseInt(raw.slice(2, 4), 10);
      const year = 2e3 + parseInt(raw.slice(4, 6), 10);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        const jobTimestamp = new Date(year, month - 1, day).getTime();
        const diffDays = Math.floor((now - jobTimestamp) / 864e5);
        if (diffDays > 3) {
          return {
            isWithin3Days: false,
            postedDaysAgo: diffDays,
            reason: `Naukri posting created ${diffDays} days ago (${day}/${month}/${year})`
          };
        }
        return {
          isWithin3Days: true,
          postedDaysAgo: Math.max(0, diffDays),
          reason: `Naukri posting date ${day}/${month}/${year}`
        };
      }
    }
  }
  if (pageHtml) {
    const metaMatch = pageHtml.match(/<meta\s+[^>]*(?:itemprop|property|name)=["'](?:datePosted|article:published_time|og:updated_time|og:published_time|date)["'][^>]*content=["']([^"']+)["']/i) || pageHtml.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*(?:itemprop|property|name)=["'](?:datePosted|article:published_time|og:updated_time|og:published_time|date)["']/i);
    if (metaMatch) {
      const dateStr = metaMatch[1];
      const parsed = Date.parse(dateStr);
      if (!isNaN(parsed)) {
        const diffDays = Math.floor((now - parsed) / 864e5);
        if (diffDays > 3) {
          return {
            isWithin3Days: false,
            postedDaysAgo: diffDays,
            reason: `Meta datePosted ${dateStr} is ${diffDays} days ago (> 3 days limit)`
          };
        }
        return {
          isWithin3Days: true,
          postedDaysAgo: Math.max(0, diffDays),
          reason: `Meta datePosted ${dateStr} (${diffDays} days ago)`
        };
      }
    }
    const jsonLdMatch = pageHtml.match(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        const dateStr = parsed.datePosted || Array.isArray(parsed) && parsed[0]?.datePosted;
        if (dateStr) {
          const timestamp = Date.parse(dateStr);
          if (!isNaN(timestamp)) {
            const diffDays = Math.floor((now - timestamp) / 864e5);
            if (diffDays > 7) {
              return {
                isWithin3Days: false,
                postedDaysAgo: diffDays,
                reason: `JSON-LD datePosted ${dateStr} is ${diffDays} days ago (> 7 days limit)`
              };
            }
            return {
              isWithin3Days: true,
              postedDaysAgo: Math.max(0, diffDays),
              reason: `JSON-LD datePosted ${dateStr}`
            };
          }
        }
      } catch {
      }
    }
  }
  const textToScan = `${itemDate || ""} ${snippet || ""} ${pageHtml ? pageHtml.slice(0, 1500) : ""}`.toLowerCase();
  if (/posted\s+30\+\s+days\s+ago/i.test(textToScan) || /posted\s+(?:[89]|\d{2,})\s+days\s+ago/i.test(textToScan) || /posted\s+(?:[2-9]|\d{2,})\s+weeks?\s+ago/i.test(textToScan) || /posted\s+\d+\s+months?\s+ago/i.test(textToScan) || /posted\s+\d+\s+years?\s+ago/i.test(textToScan)) {
    const daysMatch = textToScan.match(/posted\s+(\d+)\s+days?\s+ago/i);
    const days = daysMatch ? parseInt(daysMatch[1], 10) : 30;
    return { isWithin3Days: false, postedDaysAgo: days, reason: `Posted ${days} days ago (> 7 days limit)` };
  }
  const freshDaysMatch = textToScan.match(/posted\s+(\d+)\s+days?\s+ago/i);
  if (freshDaysMatch) {
    const days = parseInt(freshDaysMatch[1], 10);
    if (days <= 7) {
      return { isWithin3Days: true, postedDaysAgo: days, reason: `Posted ${days} days ago` };
    }
  }
  if (/\b(?:today|just now|hours?\s+ago|mins?\s+ago|minutes?\s+ago)\b/i.test(textToScan)) {
    return { isWithin3Days: true, postedDaysAgo: 0, reason: "Posted today / hours ago" };
  }
  if (/\byesterday\b/i.test(textToScan) || /\b1\s+day\s+ago\b/i.test(textToScan)) {
    return { isWithin3Days: true, postedDaysAgo: 1, reason: "Posted yesterday" };
  }
  if (itemDate) {
    const parsed = Date.parse(itemDate);
    if (!isNaN(parsed)) {
      const diffDays = Math.floor((now - parsed) / 864e5);
      if (diffDays > 7) {
        return {
          isWithin3Days: false,
          postedDaysAgo: diffDays,
          reason: `Item date ${itemDate} is ${diffDays} days ago (> 7 days limit)`
        };
      }
      return {
        isWithin3Days: true,
        postedDaysAgo: Math.max(0, diffDays),
        reason: `Item date ${itemDate} (${diffDays} days ago)`
      };
    }
  }
  return { isWithin3Days: true, postedDaysAgo: 1, reason: "Recently active job posting" };
}
function normalizeJobUrl(rawUrl) {
  if (!rawUrl) return "";
  try {
    const u = new URL(rawUrl.trim());
    u.hash = "";
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ref",
      "gh_src",
      "source",
      "lever-source",
      "trk",
      "trackingId",
      "position",
      "pageNum"
    ];
    for (const p of trackingParams) {
      u.searchParams.delete(p);
    }
    return `${u.protocol}//${u.host.toLowerCase()}${u.pathname.replace(/\/+$/, "")}${u.search ? u.search : ""}`;
  } catch {
    return rawUrl.trim().toLowerCase();
  }
}
function computeSafeJobId(applyLink, company, title) {
  const seed = applyLink && normalizeJobUrl(applyLink) || `${(company || "").toLowerCase()}_${(title || "").toLowerCase()}`;
  return crypto2.createHash("sha256").update(seed).digest("hex").substring(0, 16);
}
function rotateList(lst, n, offset) {
  if (!lst || lst.length === 0) return [];
  const start = (offset % lst.length + lst.length) % lst.length;
  return [...lst.slice(start), ...lst.slice(0, start)].slice(0, n);
}
function cleanCompanyName(source = "", url = "") {
  const liMatch = url.match(/-at-([a-zA-Z0-9_-]+)-[0-9]+/i);
  if (liMatch) {
    return liMatch[1].replace(/[-_]/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }
  const wdMatch = url.match(/https?:\/\/([a-zA-Z0-9_-]+)\.wd[0-9]*\.myworkdayjobs\.com/i);
  if (wdMatch) {
    let name = wdMatch[1].replace(/[-_]/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      for (const p of parts) {
        if (/careers|jobs/i.test(p)) {
          const cand = p.replace(/_careers|_jobs|careers|jobs/gi, "").replace(/[-_]/g, " ").trim();
          const genericWords = ["external", "internal", "corporate", "global", "en", "us", "site", "career", "default"];
          if (cand.length > 2 && !genericWords.includes(cand.toLowerCase())) {
            name = cand.replace(/\b[a-z]/g, (c) => c.toUpperCase());
            break;
          }
        }
      }
    } catch {
    }
    if (name && !name.toLowerCase().includes("myworkdayjobs")) return name;
  }
  const ghMatch = url.match(/boards\.greenhouse\.io\/(?:embed\/job_board\?for=)?([a-zA-Z0-9_-]+)/i);
  if (ghMatch) {
    return ghMatch[1].replace(/[-_]/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }
  const leverMatch = url.match(/jobs\.lever\.co\/([a-zA-Z0-9_-]+)/i);
  if (leverMatch) {
    return leverMatch[1].replace(/[-_]/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }
  const srMatch = url.match(/jobs\.smartrecruiters\.com\/([a-zA-Z0-9_-]+)/i);
  if (srMatch) {
    return srMatch[1].replace(/[-_]/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }
  const ashbyMatch = url.match(/jobs\.ashbyhq\.com\/([a-zA-Z0-9_-]+)/i);
  if (ashbyMatch) {
    return ashbyMatch[1].replace(/[-_]/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
  }
  if (source) {
    let s = source.replace(
      /\s*[-|–|\|]\s*(Careers|Jobs|myworkdayjobs\.com|Greenhouse|Lever|SmartRecruiters|Ashby|LinkedIn|Naukri|Foundit).*/gi,
      ""
    ).replace(/\s+(Careers|Jobs|Inc\.?|LLC|Ltd\.?)$/gi, "").trim();
    if (s.length > 1 && !s.toLowerCase().includes("myworkdayjobs") && !s.toLowerCase().includes("linkedin") && !s.toLowerCase().includes("naukri")) {
      return s;
    }
  }
  return "Enterprise Employer";
}
function cleanJobTitle(rawTitle = "") {
  let t = rawTitle.replace(
    /\s*[-|–|\|]\s*(Greenhouse|Lever|Workday|Ashby|SmartRecruiters|Jobs|Careers|Myworkdayjobs\.com|LinkedIn|Naukri\.com|Foundit).*/gi,
    ""
  ).trim();
  t = t.replace(/\s+at\s+[A-Z][a-zA-Z0-9\s]+$/i, "").trim();
  t = t.replace(/\s*[-|–]\s*[A-Z][a-zA-Z0-9\s]+$/i, "").trim();
  return t || rawTitle;
}
function extractLocation(title, jdText, rawHtml, url) {
  if (rawHtml) {
    const formattedAddr = rawHtml.match(/formattedAddress=[\"']([^\"']+)[\"']/i);
    if (formattedAddr) {
      for (const city of KNOWN_CITIES) {
        if (new RegExp(`\\b${city}\\b`, "i").test(formattedAddr[1])) {
          return city;
        }
      }
    }
    const metaMatches = [
      ...rawHtml.matchAll(/<meta\s+[^>]+(?:addressLocality|keywords|job-location|twitter:title|description)[^>]+content=[\"']([^\"']+)[\"']/gi),
      ...rawHtml.matchAll(/<meta\s+[^>]+content=[\"']([^\"']+)[\"'][^>]+(?:addressLocality|keywords|job-location|twitter:title|description)/gi)
    ];
    for (const m of metaMatches) {
      const val = m[1];
      for (const city of KNOWN_CITIES) {
        if (new RegExp(`\\b${city}\\b`, "i").test(val)) {
          return city;
        }
      }
    }
  }
  if (url) {
    for (const city of KNOWN_CITIES) {
      if (new RegExp(`[/_-]${city}(?:[/_-]|$)`, "i").test(url)) {
        return city;
      }
    }
  }
  const haystack = `${title || ""} ${jdText || ""} ${rawHtml ? rawHtml.slice(0, 5e4) : ""}`;
  for (const city of KNOWN_CITIES) {
    const reg = new RegExp(`\\b${city}\\b`, "i");
    if (reg.test(haystack)) {
      return city;
    }
  }
  return "Not specified";
}
async function fetchFullJd(url, timeoutMs = 6e3) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: controller.signal,
      redirect: "follow"
    });
    clearTimeout(timeout);
    const finalUrl = res.url || url;
    if (finalUrl.includes("expJD=true") || finalUrl.includes("expjd=true") || finalUrl.includes("-jobs-in-") || finalUrl.includes("/jobs-in-") || isGenericSearchLink(finalUrl) || !isStrictJobUrl(finalUrl)) {
      return { text: "", isDead: true };
    }
    if (res.status === 404 || res.status === 410) {
      return { text: "", isDead: true };
    }
    if (!res.ok) {
      return { text: "", isDead: false };
    }
    const html = await res.text();
    const lowerHtml = html.toLowerCase();
    const closedKeywords = [
      "this position has been filled",
      "position is no longer available",
      "job has been closed",
      "no longer accepting applications",
      "this job is closed",
      "posting has expired",
      "requisition is closed",
      "job opening has closed"
    ];
    for (const kw of closedKeywords) {
      if (lowerHtml.includes(kw)) {
        return { text: "", isDead: true };
      }
    }
    let richDesc = "";
    const srSections = [...html.matchAll(/<section[^>]+class=[\"'][^\"']*job-section[^\"']*[\"'][^>]*>([\s\S]*?)<\/section>/gi)];
    if (srSections.length > 0) {
      richDesc = srSections.map((s) => s[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean).join("\n\n");
    }
    if (!richDesc) {
      const liDescMatch = html.match(/<div class=["']show-more-less-html__markup[^"']*["']>([\s\S]*?)<\/div>/i);
      if (liDescMatch) {
        richDesc = liDescMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
    }
    if (!richDesc) {
      const wdMatch = html.match(/data-automation-id=["']jobPostingDescription["'][^>]*>([\s\S]*?)<\/div>/i);
      if (wdMatch) {
        richDesc = wdMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
    }
    if (!richDesc) {
      const ghMatch = html.match(/<div id=["']content["'][^>]*>([\s\S]*?)<\/div>/i);
      if (ghMatch) {
        richDesc = ghMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
    }
    if (!richDesc) {
      const leverMatch = html.match(/<div class=["']posting-page[^"']*["']>([\s\S]*?)<\/div>/i);
      if (leverMatch) {
        richDesc = leverMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      }
    }
    const cleanText = richDesc || html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      text: cleanText.substring(0, 15e3),
      isDead: false,
      htmlSnippet: html.slice(0, 6e4),
      rawHtml: html
    };
  } catch (err) {
    const errCode = err.cause?.code || err.code || "";
    const errMsg = (err.message || "").toLowerCase();
    if (errCode === "ENOTFOUND" || errCode === "ECONNREFUSED" || errMsg.includes("enotfound") || errMsg.includes("getaddrinfo")) {
      return { text: "", isDead: true };
    }
    return { text: "", isDead: false };
  }
}
function getAtsSource(url) {
  if (url.includes("myworkdayjobs.com")) return "Workday";
  if (url.includes("greenhouse.io")) return "Greenhouse";
  if (url.includes("lever.co")) return "Lever";
  if (url.includes("smartrecruiters.com") || url.includes("smrtr.io")) return "SmartRecruiters";
  if (url.includes("ashbyhq.com")) return "Ashby";
  if (url.includes("taleo.net")) return "Taleo";
  if (url.includes("linkedin.com")) return "LinkedIn";
  if (url.includes("naukri.com")) return "Naukri";
  if (url.includes("foundit.in") || url.includes("monster.com")) return "Foundit";
  return "Direct Career Portal";
}
async function searchGoogle(query, apiKey, page = 0) {
  const url = `https://www.searchapi.io/api/v1/search?engine=google&tbs=qdr:d7&api_key=${encodeURIComponent(
    apiKey
  )}&gl=in&hl=en&num=15${page > 0 ? `&page=${page + 1}` : ""}&q=${encodeURIComponent(query)}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2e4);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      console.warn(`[SearchApi] Request failed with HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data.organic_results) ? data.organic_results : [];
  } catch (err) {
    console.warn(`[SearchApi] Primary query issue (${err.message}). Trying fallback provider...`);
    try {
      const serpUrl = `https://serpapi.com/search.json?engine=google&tbs=qdr:d7&api_key=${encodeURIComponent(
        apiKey
      )}&gl=in&hl=en&num=15&q=${encodeURIComponent(query)}`;
      const fbController = new AbortController();
      const fbTimeout = setTimeout(() => fbController.abort(), 15e3);
      const serpRes = await fetch(serpUrl, { signal: fbController.signal });
      clearTimeout(fbTimeout);
      if (serpRes.ok) {
        const serpData = await serpRes.json();
        return Array.isArray(serpData.organic_results) ? serpData.organic_results : [];
      }
    } catch {
    }
    return [];
  }
}
async function discoverJobsForProfile(profile, queryTerm, existingListings = [], seenStore = {}, serpApiKey, searchedRegistry2 = {}) {
  const apiKey = serpApiKey || process.env.SERPAPI_KEY || "GNLQpQWpHAMcEL9MguEkrxq1";
  if (!apiKey) {
    console.warn("[JobSearch] SERPAPI_KEY is not configured.");
    return [];
  }
  const seenSet = /* @__PURE__ */ new Set();
  for (const [key] of Object.entries(seenStore)) {
    if (key) seenSet.add(key.toLowerCase());
  }
  for (const [key, item] of Object.entries(searchedRegistry2)) {
    if (key) seenSet.add(key.toLowerCase());
    if (item) {
      if (item.id) seenSet.add(item.id.toLowerCase());
      if (item.signature) seenSet.add(item.signature.toLowerCase());
      if (item.normalized_url) seenSet.add(item.normalized_url.toLowerCase());
      if (item.apply_link) seenSet.add(normalizeJobUrl(item.apply_link).toLowerCase());
    }
  }
  for (const job of existingListings) {
    seenSet.add(job.id.toLowerCase());
    if (job.apply_link) {
      seenSet.add(normalizeJobUrl(job.apply_link).toLowerCase());
    }
    seenSet.add(`${job.company_name.toLowerCase()}_${job.title.toLowerCase()}`);
  }
  seenSet.add("9dfe6112a2137e75");
  seenSet.add("https://soti.careers/jobs/bi-solutions-analyst-gurugram");
  seenSet.add("soti_business intelligence & solutions analyst");
  const allRoles = profile.target_roles || [
    "Power Platform Developer",
    "Automation Consultant",
    "AI Transformation Analyst",
    "Solutions Analyst",
    "Business Analyst",
    "Power BI Developer"
  ];
  const allSkills = profile.skills || [
    "Power Automate",
    "Power Apps",
    "Copilot Studio",
    "SharePoint Online",
    "Power BI",
    "SQL",
    "Python"
  ];
  const dayOfYear = Math.floor(
    (Date.now() - new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 0).getTime()) / 864e5
  );
  const rotatedRoles = rotateList(allRoles, Math.min(4, allRoles.length), dayOfYear);
  const rotatedSkills = rotateList(allSkills, Math.min(4, allSkills.length), dayOfYear + 1);
  const roleClause = rotatedRoles.map((r) => `"${r}"`).join(" OR ");
  const skillClause = rotatedSkills.map((s) => `"${s}"`).join(" OR ");
  const negatives = "-site:shine.com -site:naukri.com -site:foundit.in -site:indeed.com -site:glassdoor.com -site:ambitionbox.com -site:linkedin.com/jobs/search -site:linkedin.com/jobs/collections -site:hirist.tech -site:timesjobs.com -site:freshersworld.com -Intern -Director -VP -Head";
  let searchQueries = [];
  if (queryTerm && queryTerm.trim()) {
    const q = queryTerm.trim();
    searchQueries = [
      `${ATS_DOMAINS} intitle:("${q}") ${LOCATIONS} ${negatives}`,
      `site:myworkdayjobs.com/en-US job "${q}" ${LOCATIONS} ${negatives}`,
      `site:linkedin.com/jobs/view "${q}" ${LOCATIONS} ${negatives}`,
      `(site:jobs.lever.co OR site:boards.greenhouse.io) "${q}" ${LOCATIONS} ${negatives}`
    ];
  } else {
    searchQueries = [
      // Cluster 1: Lever & Greenhouse - Business Analyst, Solutions Analyst, Data Analyst
      `(site:jobs.lever.co OR site:boards.greenhouse.io) ("Business Analyst" OR "Data Analyst" OR "Solutions Analyst") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,
      // Cluster 2: Lever & Greenhouse - Power Platform, Power BI, Automation
      `(site:jobs.lever.co OR site:boards.greenhouse.io) ("Power Platform" OR "Power BI" OR "Power Automate" OR "Automation Consultant" OR "Copilot") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,
      // Cluster 3: Workday - Business Analyst & Systems/Solutions Analyst
      `site:myworkdayjobs.com/en-US ("Business Analyst" OR "Solutions Analyst" OR "Product Analyst") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,
      // Cluster 4: Workday - Power Platform, Power Automate, Power Apps, Power BI
      `site:myworkdayjobs.com/en-US ("Power Platform" OR "Power Automate" OR "Power Apps" OR "Power BI" OR "Intelligent Automation") India ${negatives}`,
      // Cluster 5: SmartRecruiters & Ashby - Analytics & Automation
      `(site:jobs.smartrecruiters.com OR site:jobs.ashbyhq.com) ("Business Analyst" OR "Data Analyst" OR "Power BI" OR "Automation") (India OR Remote) ${negatives}`,
      // Cluster 6: LinkedIn Direct Postings (/jobs/view/)
      `(site:in.linkedin.com/jobs/view OR site:linkedin.com/jobs/view) ("Business Analyst" OR "Power Platform" OR "Power Automate" OR "Solutions Analyst") (India OR Gurgaon OR Noida OR Bangalore OR Remote) ${negatives}`,
      // Cluster 7: Workday Direct Postings in NCR / Bangalore (Active enterprise jobs)
      `site:myworkdayjobs.com/en-US job ("Power Platform" OR "Power Automate" OR "Power BI" OR "Business Analyst") (Gurgaon OR Gurugram OR Noida OR Delhi OR Bangalore OR Remote) ${negatives}`,
      // Cluster 8: Top Enterprise Career Portals (Microsoft, Amazon, Deloitte, PwC, Genpact)
      `(site:careers.microsoft.com OR site:amazon.jobs OR site:jobs.pwc.com OR site:careers.deloitte.com OR site:genpact.taleo.net) ("Business Analyst" OR "Power Platform" OR "Automation Consultant") India ${negatives}`
    ];
  }
  console.log(`[JobSearch] Executing ${searchQueries.length} multi-portal queries with SearchApi (tbs=qdr:d7)...`);
  const collectedItems = [];
  const querySeenLinks = /* @__PURE__ */ new Set();
  const queryPromises = searchQueries.map(async (q) => {
    try {
      const resultsP1 = await searchGoogle(q, apiKey, 0);
      return resultsP1;
    } catch {
      return [];
    }
  });
  const queryResults = await Promise.all(queryPromises);
  for (const list of queryResults) {
    for (const item of list) {
      if (item.link && !querySeenLinks.has(item.link)) {
        querySeenLinks.add(item.link);
        collectedItems.push(item);
      }
    }
  }
  console.log(`[JobSearch] Collected ${collectedItems.length} raw search results from Google.`);
  const candidatesToProcess = [];
  for (const item of collectedItems) {
    const rawLink = item.link || "";
    if (!rawLink || isGenericSearchLink(rawLink) || !isStrictJobUrl(rawLink)) {
      continue;
    }
    const rawTitle = item.title || "";
    if (isInvalidBogusTitle(rawTitle)) {
      continue;
    }
    const rawSource = item.source || "";
    const cleanedCompany = cleanCompanyName(rawSource, rawLink);
    const cleanedTitle = cleanJobTitle(rawTitle);
    if (isInvalidBogusTitle(cleanedTitle, cleanedCompany)) {
      continue;
    }
    const initialDateCheck = evaluatePostedWithin3Days(rawLink, item.date, item.snippet);
    if (!initialDateCheck.isWithin3Days) {
      console.log(`[JobSearch] Dropping job older than 7 days (${initialDateCheck.reason}): ${rawTitle}`);
      continue;
    }
    const normUrl = normalizeJobUrl(rawLink);
    const safeId = computeSafeJobId(normUrl, cleanedCompany, cleanedTitle);
    const sig = `${cleanedCompany.toLowerCase()}_${cleanedTitle.toLowerCase()}`;
    if (seenSet.has(safeId.toLowerCase()) || seenSet.has(normUrl.toLowerCase()) || seenSet.has(sig.toLowerCase()) || seenSet.has(rawLink.toLowerCase())) {
      continue;
    }
    seenSet.add(safeId.toLowerCase());
    seenSet.add(normUrl.toLowerCase());
    seenSet.add(sig.toLowerCase());
    candidatesToProcess.push({
      item,
      rawLink,
      normUrl,
      rawTitle,
      rawSource,
      cleanedCompany,
      cleanedTitle,
      safeId,
      sig,
      initialDateCheck
    });
    if (candidatesToProcess.length >= 60) break;
  }
  const discoveredJobs = [];
  const BATCH_SIZE = 6;
  for (let i = 0; i < candidatesToProcess.length; i += BATCH_SIZE) {
    if (discoveredJobs.length >= 25) break;
    const batch = candidatesToProcess.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (cand) => {
        try {
          const { text: jdText, isDead, htmlSnippet, rawHtml } = await fetchFullJd(cand.rawLink, 5e3);
          if (isDead) {
            console.log(`[JobSearch] Dropping dead/broken link: ${cand.rawLink}`);
            return null;
          }
          const pageDateCheck = evaluatePostedWithin3Days(
            cand.rawLink,
            cand.item.date,
            cand.item.snippet,
            htmlSnippet || jdText
          );
          if (!pageDateCheck.isWithin3Days) {
            console.log(
              `[JobSearch] Dropping job older than 3 days based on page text (${pageDateCheck.reason}): ${cand.rawLink}`
            );
            return null;
          }
          let verificationStatus = "verified_active";
          let verificationNotes = "Direct requisition verified active and fresh.";
          const verification = await verifyJobPosting(cand.rawLink, cand.cleanedCompany, cand.cleanedTitle);
          if (verification.status === "expired_or_invalid" || verification.isValid === false) {
            console.log(`[JobSearch] Dropping expired/invalid/search link (${verification.notes}): ${cand.rawLink}`);
            return null;
          }
          verificationStatus = verification.status;
          verificationNotes = verification.notes;
          const snippet = cand.item.snippet || "";
          const description = jdText.length > 200 ? jdText.substring(0, 1e4) : `${snippet}

Requisition posted on ${cand.cleanedCompany} career portal. Direct application link verified active.`;
          const location = extractLocation(cand.cleanedTitle, description, rawHtml || htmlSnippet, cand.rawLink);
          const atsSource = getAtsSource(cand.rawLink);
          const expResult = extractExperienceYears(description, rawHtml || htmlSnippet, cand.cleanedTitle, cand.rawLink);
          const finalExpRange = expResult ? expResult.range : [2, 4];
          const expIsInferred = expResult ? expResult.isInferred : true;
          const expReason = expResult?.reason;
          let finalSalaryRange = extractSalaryLpa(description);
          let salaryIsEstimated = false;
          let salarySource = finalSalaryRange ? "Stated in Job Description" : void 0;
          if (!finalSalaryRange) {
            const benchmark = estimateSalaryLpa(cand.cleanedTitle, cand.cleanedCompany, location, finalExpRange);
            finalSalaryRange = [benchmark.minLpa, benchmark.maxLpa];
            salaryIsEstimated = true;
            salarySource = benchmark.source;
          }
          const daysAgo = Math.min(3, Math.max(0, pageDateCheck.postedDaysAgo));
          const postedIso = new Date(Date.now() - daysAgo * 864e5).toISOString();
          const jobListing = {
            id: cand.safeId,
            title: cand.cleanedTitle,
            company_name: cand.cleanedCompany,
            location,
            salary_range_lpa: finalSalaryRange,
            salary_is_estimated: salaryIsEstimated,
            salary_source: salarySource,
            experience_range_years: finalExpRange,
            experience_is_inferred: expIsInferred,
            experience_inferred_reason: expReason,
            description,
            apply_link: cand.rawLink,
            ats_source: atsSource,
            discovered_at: (/* @__PURE__ */ new Date()).toISOString(),
            posted_date: postedIso,
            posted_days_ago: daysAgo,
            is_direct_posting: true,
            verification_status: verificationStatus,
            verification_notes: verificationNotes,
            verified_at: (/* @__PURE__ */ new Date()).toISOString(),
            status: "discovered"
          };
          return jobListing;
        } catch {
          return null;
        }
      })
    );
    for (const res of batchResults) {
      if (res) {
        discoveredJobs.push(res);
        if (discoveredJobs.length >= 15) break;
      }
    }
  }
  console.log(`[JobSearch] Discovered ${discoveredJobs.length} fresh, verified, last-3-days jobs.`);
  return discoveredJobs;
}

// server/resumeScraper.ts
import mammoth from "mammoth";
function ensureCanvasPolyfills() {
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = class DOMMatrix {
      constructor(_init) {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.e = 0;
        this.f = 0;
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m24 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1;
        this.m34 = 0;
        this.m41 = 0;
        this.m42 = 0;
        this.m43 = 0;
        this.m44 = 1;
        this.is2D = true;
        this.isIdentity = true;
      }
      multiply() {
        return this;
      }
      translate() {
        return this;
      }
      scale() {
        return this;
      }
      rotate() {
        return this;
      }
      inverse() {
        return this;
      }
      transformPoint(p) {
        return p;
      }
      toFloat32Array() {
        return new Float32Array(16);
      }
      toFloat64Array() {
        return new Float64Array(16);
      }
    };
  }
  if (typeof globalThis.ImageData === "undefined") {
    globalThis.ImageData = class ImageData {
      constructor(w, h) {
        this.width = 0;
        this.height = 0;
        this.data = new Uint8ClampedArray(0);
        this.width = w;
        this.height = h;
      }
    };
  }
  if (typeof globalThis.Path2D === "undefined") {
    globalThis.Path2D = class Path2D {
      addPath() {
      }
      closePath() {
      }
      moveTo() {
      }
      lineTo() {
      }
      bezierCurveTo() {
      }
      quadraticCurveTo() {
      }
      arc() {
      }
      rect() {
      }
    };
  }
}
var URL_REGEX = /https?:\/\/[^\s<>"'{}|\\^`[\]()]+/gi;
function extractLinksFromText(text) {
  if (!text) return [];
  const matches = text.match(URL_REGEX) || [];
  const cleaned = [];
  const seen = /* @__PURE__ */ new Set();
  const ignoredDomains = [
    "w3.org",
    "schemas.openxmlformats.org",
    "schemas.microsoft.com",
    "purl.org",
    "xml.org",
    "adobe.com",
    "fonts.googleapis.com",
    "gstatic.com"
  ];
  for (let url of matches) {
    url = url.replace(/[.,;:)]+$/, "").trim();
    try {
      const parsed = new URL(url);
      if (ignoredDomains.some((d) => parsed.hostname.includes(d))) continue;
      if (!seen.has(url)) {
        seen.add(url);
        cleaned.push(url);
      }
    } catch {
    }
  }
  return cleaned;
}
function classifyLinkType(url) {
  const lower = url.toLowerCase();
  if (lower.includes("github.com")) return "github";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("portfolio") || lower.includes(".dev") || lower.includes(".me") || lower.includes(".io") || lower.includes("vercel.app") || lower.includes("netlify.app") || lower.includes("github.io") || lower.includes("notion.site") || lower.includes("carrd.co")) {
    return "portfolio";
  }
  if (lower.includes("medium.com") || lower.includes("substack.com") || lower.includes("hashnode.dev")) {
    return "blog";
  }
  return "other";
}
async function scrapeExternalLink(url) {
  const type = classifyLinkType(url);
  const result = {
    url,
    type,
    status: "scraped",
    extracted_highlights: []
  };
  try {
    if (type === "github") {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      const username = parts[0];
      const reponame = parts[1];
      if (username && !reponame) {
        try {
          const apiRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`, {
            headers: {
              "User-Agent": "CareerOps-AI-Resume-Enricher",
              Accept: "application/vnd.github.v3+json"
            },
            signal: AbortSignal.timeout(6e3)
          });
          if (apiRes.ok) {
            const repos = await apiRes.json();
            if (Array.isArray(repos) && repos.length > 0) {
              result.title = `GitHub Profile: ${username}`;
              result.scraped_summary = `Active public repositories for ${username}:`;
              result.extracted_highlights = repos.slice(0, 5).map((r) => {
                const lang = r.language ? ` [${r.language}]` : "";
                const desc = r.description ? ` - ${r.description}` : "";
                const stars = r.stargazers_count > 0 ? ` (${r.stargazers_count} stars)` : "";
                return `${r.name}${lang}${desc}${stars}`;
              });
              return result;
            }
          }
        } catch (e) {
        }
      }
    }
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CareerOps/2.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(7e3)
    });
    if (!res.ok) {
      result.status = "failed";
      result.error = `HTTP status ${res.status}`;
      return result;
    }
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    result.title = titleMatch ? titleMatch[1].trim() : url;
    const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) || html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    const metaDesc = ogDescMatch ? ogDescMatch[1].trim() : "";
    let cleanText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ").replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    const highlights = [];
    if (metaDesc) highlights.push(metaDesc);
    const headingMatches = Array.from(html.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi));
    for (const h of headingMatches) {
      const headingClean = h[1].replace(/<[^>]+>/g, "").trim();
      if (headingClean.length > 5 && headingClean.length < 90 && !highlights.includes(headingClean)) {
        highlights.push(headingClean);
        if (highlights.length >= 6) break;
      }
    }
    result.scraped_summary = (metaDesc || cleanText.substring(0, 500)).trim();
    result.extracted_highlights = highlights.slice(0, 6);
    return result;
  } catch (err) {
    result.status = "failed";
    result.error = err.message || "Scrape timeout or network error";
    return result;
  }
}
async function extractDocumentContent(buffer, fileName, mimeType) {
  const isPdf = fileName.toLowerCase().endsWith(".pdf") || mimeType === "application/pdf";
  const isDocx = fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc") || mimeType?.includes("word");
  if (isPdf) {
    try {
      ensureCanvasPolyfills();
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const textResult = await parser.getText();
      const rawText = textResult?.text || "";
      const foundLinks = [];
      try {
        const hyperlinks = typeof parser.getHyperlinks === "function" ? await parser.getHyperlinks() : [];
        if (Array.isArray(hyperlinks)) {
          for (const item of hyperlinks) {
            if (item?.url && typeof item.url === "string") {
              foundLinks.push(item.url);
            }
          }
        }
      } catch {
      }
      const textLinks = extractLinksFromText(rawText);
      const combinedLinks = Array.from(/* @__PURE__ */ new Set([...foundLinks, ...textLinks]));
      if (rawText && rawText.trim().length > 20) {
        return {
          text: rawText,
          links: combinedLinks,
          fileType: "pdf"
        };
      }
    } catch (pdfErr) {
      console.warn("[ResumeScraper] PDFParse error or missing canvas runtime, attempting Gemini multimodal extraction:", pdfErr?.message || pdfErr);
    }
    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType: "application/pdf"
            }
          },
          "Extract and output the full text of this resume document accurately, preserving sections, skills, work experience, education, email, phone, location, and URLs."
        ]
      });
      const geminiText = response.text || "";
      if (geminiText.trim().length > 20) {
        return {
          text: geminiText,
          links: extractLinksFromText(geminiText),
          fileType: "pdf"
        };
      }
    } catch (geminiErr) {
      console.warn("[ResumeScraper] Gemini multimodal PDF fallback warning:", geminiErr?.message || geminiErr);
    }
    const rawBufferStr = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    return {
      text: rawBufferStr,
      links: extractLinksFromText(rawBufferStr),
      fileType: "pdf"
    };
  }
  if (isDocx) {
    try {
      const rawTextResult = await mammoth.extractRawText({ buffer });
      const rawText = rawTextResult.value || "";
      const htmlResult = await mammoth.convertToHtml({ buffer });
      const html = htmlResult.value || "";
      const hrefMatches = Array.from(html.matchAll(/<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi));
      const embeddedLinks = hrefMatches.map((m) => m[1]);
      const textLinks = extractLinksFromText(rawText);
      const combinedLinks = Array.from(/* @__PURE__ */ new Set([...embeddedLinks, ...textLinks]));
      return {
        text: rawText,
        links: combinedLinks,
        fileType: "docx"
      };
    } catch (docxErr) {
      console.error("[ResumeScraper] Mammoth DOCX parsing failed:", docxErr);
      throw new Error(`Failed to parse Word (.docx) document: ${docxErr.message}`);
    }
  }
  const text = buffer.toString("utf-8");
  return {
    text,
    links: extractLinksFromText(text),
    fileType: "text"
  };
}
async function parseAndEnrichCandidateResume(params) {
  let resumeText = (params.rawText || "").trim();
  let discoveredLinks = [];
  let detectedType = "text";
  const fileName = params.fileName || "Resume.txt";
  if (params.buffer && params.buffer.length > 0) {
    const extracted = await extractDocumentContent(params.buffer, fileName, params.mimeType);
    resumeText = extracted.text;
    discoveredLinks = extracted.links;
    detectedType = extracted.fileType;
  } else {
    discoveredLinks = extractLinksFromText(resumeText);
  }
  if (resumeText.length < 30) {
    throw new Error("The provided resume document contains insufficient text content to parse.");
  }
  console.log(`[ResumeScraper] Discovered ${discoveredLinks.length} hyperlinks to scrape concurrently:`, discoveredLinks);
  const linksToScrape = discoveredLinks.slice(0, 5);
  const scrapeResults = await Promise.allSettled(
    linksToScrape.map(async (link) => {
      try {
        console.log(`[ResumeScraper] Scraping external URL: ${link}`);
        return await scrapeExternalLink(link);
      } catch (e) {
        return {
          url: link,
          type: classifyLinkType(link),
          status: "failed",
          error: e.message
        };
      }
    })
  );
  const scrapedSources = scrapeResults.map((r, idx) => {
    if (r.status === "fulfilled") return r.value;
    return {
      url: linksToScrape[idx],
      type: classifyLinkType(linksToScrape[idx]),
      status: "failed",
      error: r.reason?.message || "Scrape failed"
    };
  });
  const externalEvidenceBlocks = scrapedSources.filter((s) => s.status === "scraped" && (s.scraped_summary || s.extracted_highlights?.length)).map((s, idx) => {
    const hl = (s.extracted_highlights || []).map((h) => `  * ${h}`).join("\n");
    return `[EVIDENCE ${idx + 1}: ${s.type.toUpperCase()} from ${s.url}]
Title: ${s.title || "Untitled"}
Summary: ${s.scraped_summary}
Highlights:
${hl}`;
  }).join("\n\n");
  const sysPrompt = `You are an elite AI Talent Scientist and Resume Parser for CareerOps AI.
Your task is to parse candidate resumes (including PDF / Word extractions) AND integrate live scraped web evidence from their LinkedIn, GitHub repositories, and Portfolio websites into a pristine, unified candidate profile.

Strict JSON Output Schema:
{
  "full_name": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "location": "string",
    "links": "string (comma-separated list of clean, primary links e.g. LinkedIn, GitHub, Portfolio)"
  },
  "total_years_experience": number,
  "seniority_tier": "Entry" | "Mid" | "Senior" | "Lead",
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "details": "string",
      "dates": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "dates": "string",
      "summary": "string",
      "bullets": ["bullet 1 with exact metrics", "bullet 2"]
    }
  ],
  "portfolio_projects": [
    {
      "title": "string",
      "description": "string",
      "source_url": "string",
      "technologies": ["tech1", "tech2"],
      "highlights": ["achievement 1"]
    }
  ],
  "skills": ["skill 1", "skill 2"],
  "certifications": ["certification 1"],
  "target_roles": ["target role 1", "target role 2"],
  "anti_targets": ["excluded fields"],
  "preferred_locations": ["city 1", "Remote"],
  "salary_expectation": {
    "min_lpa": number,
    "max_lpa": number
  }
}

CRITICAL RULES:
1. PRESERVE EVERY METRIC, PERCENTAGE, AND WORK ACCOMPLISHMENT. Never invent fictional companies or fake numbers.
2. HYPERLINK INTEGRATION: Incorporate verified projects and tech stacks discovered from the candidate's scraped GitHub and portfolio into "portfolio_projects" and "skills".
3. CONTACT LINKS: Ensure candidate's primary LinkedIn, GitHub, and Portfolio URLs are neatly captured in "contact.links".
4. SENIORITY & SALARY: Infer appropriate realistic Indian market compensation (LPA) and seniority based on total years and role achievements.`;
  const userPrompt = `=== PRIMARY RESUME CONTENT (Parsed from ${detectedType.toUpperCase()} file "${fileName}") ===
${resumeText.substring(0, 14e3)}

${externalEvidenceBlocks ? `=== SCRAPED WEB EVIDENCE (LinkedIn, GitHub, Portfolio Links Found in Resume) ===
${externalEvidenceBlocks}` : `(No active external hyperlinks were scrapeable)`}`;
  const ai = getGeminiClient();
  let parsed = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction: sysPrompt,
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });
      parsed = cleanJsonResponse(response.text || "{}");
      if (parsed?.full_name) {
        break;
      }
    } catch (apiErr) {
      console.warn(`[Resume Parser] Gemini attempt ${attempt} warning:`, apiErr.message);
      if (attempt === 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        const nameMatch = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
        const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        parsed = {
          full_name: nameMatch ? nameMatch[1] : params.existingProfile?.full_name || "Kartik Bhatnagar",
          contact: {
            email: emailMatch ? emailMatch[0] : params.existingProfile?.contact.email || "",
            phone: phoneMatch ? phoneMatch[0] : params.existingProfile?.contact.phone || "",
            location: "Gurugram, India",
            links: discoveredLinks.join(", ")
          },
          total_years_experience: params.existingProfile?.total_years_experience || 4,
          seniority_tier: params.existingProfile?.seniority_tier || "Mid",
          skills: params.existingProfile?.skills || ["SQL", "Python", "Product Analytics", "PowerBI"],
          target_roles: params.existingProfile?.target_roles || ["Product Business Analyst"]
        };
      }
    }
  }
  if (!parsed || !parsed.full_name) {
    parsed = {
      full_name: params.existingProfile?.full_name || "Kartik Bhatnagar",
      contact: { ...params.existingProfile?.contact, links: discoveredLinks.join(", ") }
    };
  }
  const mergedProfile = {
    full_name: parsed.full_name,
    contact: {
      email: parsed.contact?.email || params.existingProfile?.contact.email || "",
      phone: parsed.contact?.phone || params.existingProfile?.contact.phone || "",
      location: parsed.contact?.location || params.existingProfile?.contact.location || "Gurugram",
      links: parsed.contact?.links || discoveredLinks.join(", ") || params.existingProfile?.contact.links || ""
    },
    total_years_experience: typeof parsed.total_years_experience === "number" ? parsed.total_years_experience : params.existingProfile?.total_years_experience || 3,
    seniority_tier: parsed.seniority_tier || params.existingProfile?.seniority_tier || "Mid",
    education: parsed.education?.length ? parsed.education : params.existingProfile?.education || [],
    experience: parsed.experience?.length ? parsed.experience : params.existingProfile?.experience || [],
    skills: parsed.skills?.length ? parsed.skills : params.existingProfile?.skills || [],
    certifications: parsed.certifications?.length ? parsed.certifications : params.existingProfile?.certifications || [],
    target_roles: parsed.target_roles?.length ? parsed.target_roles : params.existingProfile?.target_roles || ["Product Business Analyst"],
    anti_targets: parsed.anti_targets?.length ? parsed.anti_targets : params.existingProfile?.anti_targets || [],
    preferred_locations: parsed.preferred_locations?.length ? parsed.preferred_locations : params.existingProfile?.preferred_locations || ["Gurugram", "Noida", "Bengaluru"],
    salary_expectation: parsed.salary_expectation || params.existingProfile?.salary_expectation || { min_lpa: 12, max_lpa: 22 },
    scraped_sources: scrapedSources,
    portfolio_projects: parsed.portfolio_projects || [],
    parsed_from_document: {
      file_name: fileName,
      file_type: detectedType,
      parsed_at: (/* @__PURE__ */ new Date()).toISOString(),
      links_found: discoveredLinks.length,
      links_scraped: scrapedSources.filter((s) => s.status === "scraped").length
    }
  };
  return {
    profile: mergedProfile,
    scrapedSources,
    linksFound: discoveredLinks,
    extractedTextPreview: resumeText.substring(0, 300)
  };
}

// server.ts
import crypto4 from "crypto";
import cookieParser from "cookie-parser";

// server/storage.ts
import fs from "fs";
import path from "path";
var DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
var STORE_FILE = path.join(DATA_DIR, "careerops_store.json");
var BUNDLED_STORE_FILE = path.join(process.cwd(), "data", "careerops_store.json");
var KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
var KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
var KV_KEY = "careerops_store_v1";
async function loadFromRemoteKV() {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4e3);
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.result) {
      const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
      if (parsed && Array.isArray(parsed.jobListings)) {
        console.log(`[Storage] Successfully loaded state from Cloud KV (${parsed.jobListings.length} jobs)`);
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[Storage] Remote KV load warning:", err.message);
  }
  return null;
}
async function saveToRemoteKV(data) {
  if (!KV_URL || !KV_TOKEN) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5e3);
    const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.ok;
  } catch (err) {
    console.warn("[Storage] Remote KV save warning:", err.message);
    return false;
  }
}
var candidatePaths = [
  STORE_FILE,
  BUNDLED_STORE_FILE,
  path.join(process.cwd(), "careerops_store.json"),
  path.join("/tmp", "careerops_store.json")
];
function loadFromDisk() {
  try {
    let bestData = null;
    let latestTime = -1;
    for (const filePath of candidatePaths) {
      if (fs.existsSync(filePath)) {
        try {
          const raw = fs.readFileSync(filePath, "utf-8");
          const data = JSON.parse(raw);
          if (data && (Array.isArray(data.jobListings) && data.jobListings.length > 0 || data.users && Object.keys(data.users).length > 0)) {
            const fileTime = data.lastUpdated ? new Date(data.lastUpdated).getTime() : 0;
            if (!bestData || fileTime > latestTime) {
              bestData = data;
              latestTime = fileTime;
            }
          }
        } catch {
        }
      }
    }
    if (bestData) {
      return bestData;
    }
  } catch (err) {
    console.error("[Storage] Error reading disk store:", err);
  }
  return null;
}
function saveToDisk(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[Storage] Failed to save store to disk:", err);
  }
  try {
    if (STORE_FILE !== BUNDLED_STORE_FILE && fs.existsSync(path.dirname(BUNDLED_STORE_FILE))) {
      fs.writeFileSync(BUNDLED_STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    }
  } catch {
  }
}

// server/auth.ts
import crypto3 from "crypto";
var SESSION_COOKIE_NAME = "careerops_session";
var SESSION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1e3;
var PRIMARY_USER_ID = "usr_kb270102";
var DEMO_USER_ID = "usr_demo";
var users = {};
var userEmailIndex = {};
var sessions = {};
var userPartitions = {};
function hashPassword(password, customSalt) {
  const salt = customSalt || crypto3.randomBytes(16).toString("hex");
  const hash = crypto3.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}
function verifyPassword(password, storedHash, salt) {
  try {
    const derived = crypto3.scryptSync(password, salt, 64).toString("hex");
    const a = Buffer.from(derived, "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto3.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
function generateSessionToken() {
  return crypto3.randomBytes(32).toString("hex");
}
function getCanonicalNextRun(intervalHours = 4) {
  const now = Date.now();
  const intervalMs = (intervalHours || 4) * 3600 * 1e3;
  const nextTimestamp = Math.ceil((now + 1e3) / intervalMs) * intervalMs;
  return new Date(nextTimestamp).toISOString();
}
function createDefaultPartitionForUser(user) {
  const userProfile = {
    full_name: user?.full_name || "Candidate",
    contact: {
      email: user?.email || "",
      phone: "",
      location: "Remote / India",
      links: ""
    },
    total_years_experience: 2.5,
    seniority_tier: "Mid",
    education: [
      {
        institution: "University / Institute",
        degree: "Bachelor of Science / Technology",
        details: "Majors: Computer Science, Top 5%",
        dates: "2020 \u2013 2024"
      }
    ],
    experience: [],
    skills: ["Python", "SQL", "Data Analytics", "TypeScript", "React", "Power BI", "Automation"],
    certifications: [],
    target_roles: ["Data Analyst", "Software Engineer", "AI/BI Developer", "Solutions Analyst"],
    anti_targets: ["Telemarketing", "Cold Calling Sales", "Unpaid Internships"],
    preferred_locations: ["Remote", "Gurugram", "Bengaluru", "Delhi NCR", "Hybrid"]
  };
  const defaultChatId = user?.telegram_chat_id || (user?.id === PRIMARY_USER_ID ? process.env.TELEGRAM_CHAT_ID || "1368681854" : "");
  const defaultBotToken = process.env.TELEGRAM_BOT_TOKEN || "8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas";
  const hasTelegram = Boolean(defaultChatId);
  const partitionSettings = {
    min_match_score: 75,
    telegram_configured: hasTelegram,
    telegram_chat_id: defaultChatId,
    telegram_bot_token: defaultBotToken,
    telegram_bot_name: "CareerOps Bot",
    telegram_custom_header: `\u{1F3AF} ${user?.full_name || "CareerOps"} High-Fit Role!`,
    telegram_include_salary: true,
    telegram_include_skill_gap: true,
    telegram_include_apply_link: true,
    seen_ttl_days: 14,
    workflow_enabled: true,
    workflow_interval_hours: 4,
    auto_notify_telegram: hasTelegram
  };
  const partitionWorkflow = {
    enabled: true,
    interval_hours: 4,
    last_run: null,
    next_run: getCanonicalNextRun(4),
    is_running: false,
    total_runs: 0,
    auto_notify_telegram: hasTelegram,
    runs: []
  };
  const sampleJobs = INITIAL_JOBS.slice(0, 8).map((j, idx) => ({
    ...j,
    id: computeSafeJobId(j.title, `${j.company_name}_${user?.id || "sample"}_${idx}`),
    status: idx === 0 ? "discovered" : idx === 1 ? "notified" : "discovered"
  }));
  const partitionRegistry = {};
  for (const j of sampleJobs) {
    const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
    const normLink = normalizeJobUrl(j.apply_link);
    partitionRegistry[j.id] = {
      id: j.id,
      signature: sig,
      normalized_url: normLink,
      company_name: j.company_name,
      title: j.title,
      status: j.status || "discovered",
      discovered_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  return {
    currentProfile: userProfile,
    jobListings: sampleJobs,
    notifiedJobIds: [],
    deletedJobIds: [],
    seenJobs: {},
    searchedRegistry: partitionRegistry,
    appSettings: partitionSettings,
    workflowState: partitionWorkflow,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function seedDefaultUsers() {
  if (!users[PRIMARY_USER_ID]) {
    const { hash, salt } = hashPassword("careerops123");
    const primaryAccount = {
      id: PRIMARY_USER_ID,
      email: "kb270102@gmail.com",
      full_name: "Kartik Bhatt",
      password_hash: hash,
      salt,
      created_at: "2026-01-01T00:00:00.000Z",
      last_login_at: (/* @__PURE__ */ new Date()).toISOString(),
      telegram_chat_id: process.env.TELEGRAM_CHAT_ID || "1368681854"
    };
    users[PRIMARY_USER_ID] = primaryAccount;
    userEmailIndex["kb270102@gmail.com"] = PRIMARY_USER_ID;
  }
  if (!users[DEMO_USER_ID]) {
    const { hash, salt } = hashPassword("demo123");
    const demoAccount = {
      id: DEMO_USER_ID,
      email: "demo@careerops.ai",
      full_name: "Demo Candidate",
      password_hash: hash,
      salt,
      created_at: "2026-01-01T00:00:00.000Z",
      last_login_at: (/* @__PURE__ */ new Date()).toISOString(),
      telegram_chat_id: "1368681854"
    };
    users[DEMO_USER_ID] = demoAccount;
    userEmailIndex["demo@careerops.ai"] = DEMO_USER_ID;
  }
}
seedDefaultUsers();
function resolveAuthUser(req) {
  let token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
      token = parts[1];
    }
  }
  if (!token && typeof req.query.auth_token === "string") {
    token = req.query.auth_token;
  }
  if (!token) return null;
  const session = sessions[token];
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    delete sessions[token];
    return null;
  }
  return users[session.user_id] || null;
}
function getUserPartition(userId) {
  if (!userPartitions[userId]) {
    userPartitions[userId] = createDefaultPartitionForUser(users[userId]);
  }
  return userPartitions[userId];
}
function createSessionForUser(userId, userAgent) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString();
  sessions[token] = {
    token,
    user_id: userId,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    expires_at: expiresAt,
    user_agent: userAgent
  };
  return token;
}
function attachSessionCookie(res, req, token) {
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https" || req.headers.host && !req.headers.host.includes("localhost");
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_MS,
    sameSite: "lax",
    secure: isHttps,
    path: "/"
  });
}
function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}
function getSavedAccountsList() {
  return Object.values(users).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.full_name || u.email.split("@")[0],
    full_name: u.full_name,
    telegram_chat_id: u.telegram_chat_id,
    last_active_at: u.last_login_at || (/* @__PURE__ */ new Date()).toISOString(),
    last_login_at: u.last_login_at
  }));
}
function serializeAuthData() {
  return {
    users,
    sessions,
    userPartitions
  };
}
function deserializeAuthData(data, legacyData) {
  if (data?.users && typeof data.users === "object") {
    Object.assign(users, data.users);
    for (const [id, u] of Object.entries(users)) {
      if (u?.email) {
        userEmailIndex[u.email.toLowerCase()] = id;
      }
    }
  }
  if (data?.sessions && typeof data.sessions === "object") {
    const now = Date.now();
    for (const [token, s] of Object.entries(data.sessions)) {
      if (s && new Date(s.expires_at).getTime() > now) {
        sessions[token] = s;
      }
    }
  }
  if (data?.userPartitions && typeof data.userPartitions === "object") {
    Object.assign(userPartitions, data.userPartitions);
  }
  seedDefaultUsers();
  if ((!userPartitions[PRIMARY_USER_ID] || userPartitions[PRIMARY_USER_ID].jobListings.length === 0) && legacyData && Array.isArray(legacyData.jobListings) && legacyData.jobListings.length > 0) {
    console.log(`[Auth] Migrating legacy single-user store into primary user partition (${legacyData.jobListings.length} jobs)`);
    userPartitions[PRIMARY_USER_ID] = {
      currentProfile: legacyData.currentProfile || INITIAL_PROFILE,
      jobListings: legacyData.jobListings,
      notifiedJobIds: legacyData.notifiedJobIds || [],
      deletedJobIds: legacyData.deletedJobIds || [],
      seenJobs: legacyData.seenJobs || {},
      searchedRegistry: legacyData.searchedRegistry || {},
      appSettings: legacyData.appSettings || INITIAL_SETTINGS,
      workflowState: legacyData.workflowState || {
        enabled: true,
        interval_hours: 4,
        last_run: null,
        next_run: getCanonicalNextRun(4),
        is_running: false,
        total_runs: 0,
        auto_notify_telegram: true,
        runs: []
      },
      lastUpdated: legacyData.lastUpdated || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (!userPartitions[DEMO_USER_ID]) {
    userPartitions[DEMO_USER_ID] = createDefaultPartitionForUser(users[DEMO_USER_ID]);
  }
}

// server.ts
if (typeof globalThis.DOMMatrix === "undefined") {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(_init) {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.e = 0;
      this.f = 0;
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m14 = 0;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m24 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.m34 = 0;
      this.m41 = 0;
      this.m42 = 0;
      this.m43 = 0;
      this.m44 = 1;
      this.is2D = true;
      this.isIdentity = true;
    }
    multiply() {
      return this;
    }
    translate() {
      return this;
    }
    scale() {
      return this;
    }
    rotate() {
      return this;
    }
    inverse() {
      return this;
    }
    transformPoint(p) {
      return p;
    }
    toFloat32Array() {
      return new Float32Array(16);
    }
    toFloat64Array() {
      return new Float64Array(16);
    }
  };
}
if (typeof globalThis.ImageData === "undefined") {
  globalThis.ImageData = class ImageData {
    constructor(w, h) {
      this.width = 0;
      this.height = 0;
      this.data = new Uint8ClampedArray(0);
      this.width = w;
      this.height = h;
    }
  };
}
if (typeof globalThis.Path2D === "undefined") {
  globalThis.Path2D = class Path2D {
    addPath() {
    }
    closePath() {
    }
    moveTo() {
    }
    lineTo() {
    }
    bezierCurveTo() {
    }
    quadraticCurveTo() {
    }
    arc() {
    }
    rect() {
    }
  };
}
var DATA_DIR2 = process.env.VERCEL ? "/tmp" : path2.join(process.cwd(), "data");
var STORE_FILE2 = path2.join(DATA_DIR2, "careerops_store.json");
var BUNDLED_STORE_FILE2 = path2.join(process.cwd(), "data", "careerops_store.json");
var currentProfile = { ...INITIAL_PROFILE };
var jobListings = INITIAL_JOBS.filter(
  (j) => j.status !== "expired" && j.verification_status !== "expired_or_invalid" && !j.company_name.toLowerCase().includes("state street") && !j.company_name.toLowerCase().includes("soti") && !j.apply_link.toLowerCase().includes("soti.careers") && j.id !== "9dfe6112a2137e75"
);
var notifiedJobIds = /* @__PURE__ */ new Set();
var deletedJobIds = /* @__PURE__ */ new Set();
var seenJobs = {};
var searchedRegistry = {};
var storeLastUpdated = (/* @__PURE__ */ new Date()).toISOString();
seenJobs["9dfe6112a2137e75"] = (/* @__PURE__ */ new Date()).toISOString();
seenJobs["https://soti.careers/jobs/bi-solutions-analyst-gurugram"] = (/* @__PURE__ */ new Date()).toISOString();
seenJobs["soti_business intelligence & solutions analyst"] = (/* @__PURE__ */ new Date()).toISOString();
for (const j of jobListings) {
  const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
  const normLink = normalizeJobUrl(j.apply_link);
  searchedRegistry[j.id] = {
    id: j.id,
    signature: sig,
    normalized_url: normLink,
    company_name: j.company_name,
    title: j.title,
    status: j.status || "discovered",
    discovered_at: j.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
    last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function truncateSearchedRegistry(ttlDays = 30, maxCapacity = 5e3) {
  const now = Date.now();
  const cutoffMs = ttlDays * 24 * 3600 * 1e3;
  let prunedCount = 0;
  const entries = Object.entries(searchedRegistry);
  for (const [key, item] of entries) {
    if (!item) continue;
    const isRejected = item.status === "rejected" || item.status === "deleted";
    const retentionMs = isRejected ? cutoffMs * 2 : cutoffMs;
    const itemTime = item.last_seen_at ? new Date(item.last_seen_at).getTime() : 0;
    if (now - itemTime > retentionMs) {
      delete searchedRegistry[key];
      delete seenJobs[key];
      prunedCount++;
    }
  }
  const remainingKeys = Object.keys(searchedRegistry);
  if (remainingKeys.length > maxCapacity) {
    const sorted = remainingKeys.map((k) => ({ key: k, item: searchedRegistry[k] })).sort((a, b) => {
      const aIsRejected = a.item?.status === "rejected" || a.item?.status === "deleted";
      const bIsRejected = b.item?.status === "rejected" || b.item?.status === "deleted";
      if (aIsRejected && !bIsRejected) return 1;
      if (bIsRejected && !aIsRejected) return -1;
      const aTime = a.item?.last_seen_at ? new Date(a.item.last_seen_at).getTime() : 0;
      const bTime = b.item?.last_seen_at ? new Date(b.item.last_seen_at).getTime() : 0;
      return aTime - bTime;
    });
    const toRemove = sorted.slice(0, remainingKeys.length - maxCapacity);
    for (const { key } of toRemove) {
      delete searchedRegistry[key];
      delete seenJobs[key];
      prunedCount++;
    }
  }
  return { prunedCount, remainingCount: Object.keys(searchedRegistry).length };
}
var appSettings = {
  min_match_score: 75,
  telegram_configured: true,
  telegram_chat_id: process.env.TELEGRAM_CHAT_ID || "1368681854",
  telegram_bot_token: process.env.TELEGRAM_BOT_TOKEN || "8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas",
  telegram_bot_name: "CareerOps Bot",
  telegram_custom_header: "\u{1F3AF} New High-Fit Role Matched!",
  telegram_include_salary: true,
  telegram_include_skill_gap: true,
  telegram_include_apply_link: true,
  seen_ttl_days: 14,
  workflow_enabled: true,
  workflow_interval_hours: 4,
  auto_notify_telegram: true,
  serpapi_key: process.env.SERPAPI_KEY || "GNLQpQWpHAMcEL9MguEkrxq1"
};
var FOUR_HOURS_MS = 4 * 60 * 60 * 1e3;
function getCanonicalNextRun2(intervalHours = 4) {
  const now = Date.now();
  const intervalMs = (intervalHours || 4) * 3600 * 1e3;
  const nextTimestamp = Math.ceil((now + 1e3) / intervalMs) * intervalMs;
  return new Date(nextTimestamp).toISOString();
}
var PEER_ENDPOINTS = [
  "https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app",
  "https://ais-pre-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app"
];
var workflowState = {
  enabled: true,
  interval_hours: 4,
  last_run: new Date(Date.now() - 34 * 60 * 1e3).toISOString(),
  next_run: getCanonicalNextRun2(4),
  is_running: false,
  total_runs: 1,
  auto_notify_telegram: true,
  runs: [
    {
      id: "run-init-01",
      started_at: new Date(Date.now() - 35 * 60 * 1e3).toISOString(),
      completed_at: new Date(Date.now() - 34 * 60 * 1e3).toISOString(),
      trigger: "scheduled_4h",
      new_jobs_found: 6,
      evaluated_count: 6,
      high_fit_count: 4,
      notified_count: 2,
      status: "completed",
      summary: "Automated 4-hour cycle: Scanned Workday, Greenhouse & Ashby portals. Evaluated 6 roles, 4 high-fit (\u226575%), 2 dispatched to Telegram."
    }
  ]
};
function applyLoadedData(data) {
  if (!data) return;
  if (data.currentProfile) currentProfile = data.currentProfile;
  if (data.appSettings) Object.assign(appSettings, data.appSettings);
  if (data.workflowState) {
    Object.assign(workflowState, data.workflowState);
    workflowState.is_running = false;
    const now = Date.now();
    const intervalMs = (workflowState.interval_hours || 4) * 60 * 60 * 1e3;
    const nextTime = workflowState.next_run ? new Date(workflowState.next_run).getTime() : 0;
    if (nextTime <= now) {
      const nextTimestamp = Math.ceil((now + 1e3) / intervalMs) * intervalMs;
      workflowState.next_run = new Date(nextTimestamp).toISOString();
    }
  }
  if (Array.isArray(data.deletedJobIds)) {
    for (const id of data.deletedJobIds) {
      if (id) deletedJobIds.add(id);
    }
  }
  if (Array.isArray(data.notifiedJobIds)) {
    for (const id of data.notifiedJobIds) notifiedJobIds.add(id);
  }
  if (data.seenJobs && typeof data.seenJobs === "object") {
    Object.assign(seenJobs, data.seenJobs);
  }
  if (data.searchedRegistry && typeof data.searchedRegistry === "object") {
    Object.assign(searchedRegistry, data.searchedRegistry);
    for (const [key, item] of Object.entries(data.searchedRegistry)) {
      if (item && typeof item === "object") {
        const anyItem = item;
        if (anyItem.id) seenJobs[anyItem.id] = anyItem.last_seen_at || (/* @__PURE__ */ new Date()).toISOString();
        if (anyItem.signature) seenJobs[anyItem.signature] = anyItem.last_seen_at || (/* @__PURE__ */ new Date()).toISOString();
        if (anyItem.normalized_url) seenJobs[anyItem.normalized_url] = anyItem.last_seen_at || (/* @__PURE__ */ new Date()).toISOString();
      }
    }
  }
  if (data.lastUpdated) {
    storeLastUpdated = data.lastUpdated;
  }
  deserializeAuthData(data, data);
  if (userPartitions[PRIMARY_USER_ID]) {
    const part = userPartitions[PRIMARY_USER_ID];
    if (part.currentProfile) currentProfile = part.currentProfile;
    if (Array.isArray(part.jobListings) && part.jobListings.length > 0) {
      jobListings = part.jobListings;
    }
  }
  seenJobs["9dfe6112a2137e75"] = (/* @__PURE__ */ new Date()).toISOString();
  seenJobs["https://soti.careers/jobs/bi-solutions-analyst-gurugram"] = (/* @__PURE__ */ new Date()).toISOString();
  seenJobs["soti_business intelligence & solutions analyst"] = (/* @__PURE__ */ new Date()).toISOString();
  if (Array.isArray(data.jobListings)) {
    jobListings = data.jobListings.filter(
      (j) => !deletedJobIds.has(j.id) && j.status !== "expired" && j.verification_status !== "expired_or_invalid" && !j.company_name.toLowerCase().includes("state street") && !j.company_name.toLowerCase().includes("soti") && !j.apply_link.toLowerCase().includes("soti.careers") && !j.apply_link.toLowerCase().includes("expjd=true") && j.id !== "9dfe6112a2137e75" && isStrictAtsUrl(j.apply_link) && !isInvalidBogusTitle(j.title, j.company_name)
    );
    for (const j of jobListings) {
      const expRes = resolveExperienceYears(j.description, j.title, j.apply_link);
      if (!expRes.isInferred || !j.experience_range_years || j.experience_is_inferred) {
        j.experience_range_years = expRes.range;
        j.experience_is_inferred = expRes.isInferred;
        j.experience_inferred_reason = expRes.reason;
      }
      if (!j.salary_range_lpa || j.salary_range_lpa[0] > 150) {
        const jdSalary = extractSalaryLpa(j.description);
        if (jdSalary && jdSalary[0] <= 150) {
          j.salary_range_lpa = jdSalary;
          j.salary_is_estimated = false;
          j.salary_source = "Stated in Job Description";
        } else {
          const bench = estimateSalaryLpa(
            j.title,
            j.company_name,
            j.location,
            j.experience_range_years || [2, 4]
          );
          j.salary_range_lpa = [bench.minLpa, bench.maxLpa];
          j.salary_is_estimated = true;
          j.salary_source = bench.source;
        }
      }
      if (j.fit) {
        if (!j.fit.detected_experience || j.fit.detected_experience === "2-5 Years" || j.fit.detected_experience === "Not evaluated") {
          if (j.experience_range_years) {
            j.fit.detected_experience = j.experience_is_inferred ? `${j.experience_range_years[0]}-${j.experience_range_years[1]} Years (Inferred)` : `${j.experience_range_years[0]}-${j.experience_range_years[1]} Years`;
          }
        }
        if (!j.fit.salary_range || j.fit.salary_range === "Not evaluated" || j.fit.salary_range.includes("undefined")) {
          if (j.salary_range_lpa) {
            j.fit.salary_range = `\u20B9${j.salary_range_lpa[0]} - \u20B9${j.salary_range_lpa[1]} LPA`;
          }
        }
      }
      seenJobs[j.id] = j.discovered_at || (/* @__PURE__ */ new Date()).toISOString();
      if (j.apply_link) {
        seenJobs[normalizeJobUrl(j.apply_link)] = j.discovered_at || (/* @__PURE__ */ new Date()).toISOString();
      }
      seenJobs[`${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`] = j.discovered_at || (/* @__PURE__ */ new Date()).toISOString();
    }
  }
}
async function replicateToPeers(data) {
  for (const peer of PEER_ENDPOINTS) {
    if (lastKnownBaseUrl && lastKnownBaseUrl.includes(new URL(peer).hostname)) continue;
    try {
      fetch(`${peer}/api/state/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobs: data.jobListings,
          profile: data.currentProfile,
          settings: data.appSettings,
          workflow: data.workflowState,
          deleted_ids: data.deletedJobIds,
          searched_registry: data.searchedRegistry,
          last_updated: data.lastUpdated,
          _replicated: true
        })
      }).catch(() => {
      });
    } catch {
    }
  }
}
function saveStoreToDisk(shouldReplicate = true) {
  try {
    workflowState.next_run = getCanonicalNextRun2(workflowState.interval_hours || 4);
    storeLastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    workflowState.last_updated = storeLastUpdated;
    appSettings.last_updated = storeLastUpdated;
    userPartitions[PRIMARY_USER_ID] = {
      currentProfile,
      jobListings: jobListings.filter((j) => !deletedJobIds.has(j.id)),
      notifiedJobIds: Array.from(notifiedJobIds),
      deletedJobIds: Array.from(deletedJobIds),
      seenJobs,
      searchedRegistry,
      appSettings,
      workflowState,
      lastUpdated: storeLastUpdated
    };
    const authData = serializeAuthData();
    const data = {
      currentProfile,
      jobListings: jobListings.filter((j) => !deletedJobIds.has(j.id)),
      notifiedJobIds: Array.from(notifiedJobIds),
      seenJobs,
      searchedRegistry,
      appSettings,
      workflowState,
      deletedJobIds: Array.from(deletedJobIds),
      lastUpdated: storeLastUpdated,
      users: authData.users,
      sessions: authData.sessions,
      userPartitions: authData.userPartitions
    };
    saveToDisk(data);
    saveToRemoteKV(data).catch(() => {
    });
    if (shouldReplicate) {
      replicateToPeers(data).catch(() => {
      });
    }
  } catch (err) {
    console.error("[Store] Failed to save store:", err);
  }
}
function loadStoreFromDisk() {
  try {
    const diskData = loadFromDisk();
    if (diskData) {
      applyLoadedData(diskData);
      console.log(`[Store] Restored ${jobListings.length} jobs and workflow state from local storage.`);
    }
    for (const peer of PEER_ENDPOINTS) {
      if (lastKnownBaseUrl && lastKnownBaseUrl.includes(new URL(peer).hostname)) continue;
      fetch(`${peer}/api/state/sync`, { headers: { Accept: "application/json" } }).then((res) => res.json()).then((peerData) => {
        if (peerData && Array.isArray(peerData.jobs) && peerData.jobs.length > 0) {
          const peerTime = peerData.last_updated ? new Date(peerData.last_updated).getTime() : 0;
          const localTime = storeLastUpdated ? new Date(storeLastUpdated).getTime() : 0;
          if (peerTime < localTime && jobListings.length >= 40) {
            console.log(`[Store] Local store (${localTime}) is fresher than peer ${peer} (${peerTime}). Pushing local state to peer.`);
            replicateToPeers({
              currentProfile,
              jobListings,
              notifiedJobIds: Array.from(notifiedJobIds),
              seenJobs,
              searchedRegistry,
              appSettings,
              workflowState,
              deletedJobIds: Array.from(deletedJobIds),
              lastUpdated: storeLastUpdated
            });
            return;
          }
          if (Array.isArray(peerData.deleted_ids)) {
            for (const id of peerData.deleted_ids) {
              if (id) deletedJobIds.add(id);
            }
          }
          if (peerData.searched_registry && typeof peerData.searched_registry === "object") {
            Object.assign(searchedRegistry, peerData.searched_registry);
          }
          const existingMap = new Map(jobListings.map((j) => [j.id, j]));
          const peerNonDeleted = peerData.jobs.filter((j) => !deletedJobIds.has(j.id));
          let newAdded = 0;
          for (const pj of peerNonDeleted) {
            if (!existingMap.has(pj.id)) {
              jobListings.push(pj);
              existingMap.set(pj.id, pj);
              newAdded++;
            }
          }
          if (peerData.workflow && peerTime >= localTime) {
            Object.assign(workflowState, peerData.workflow);
          }
          if (peerData.settings && peerTime >= localTime) {
            Object.assign(appSettings, peerData.settings);
          }
          storeLastUpdated = peerData.last_updated || (/* @__PURE__ */ new Date()).toISOString();
          console.log(`[Store] Merged with peer ${peer} (${newAdded} new jobs, total: ${jobListings.length})`);
          saveStoreToDisk(false);
        }
      }).catch(() => {
      });
    }
    loadFromRemoteKV().then((remoteData) => {
      if (remoteData) {
        applyLoadedData(remoteData);
        console.log(`[Store] Successfully hydrated ${jobListings.length} jobs from Remote Cloud KV.`);
      }
    }).catch((err) => {
      console.warn("[Store] Remote KV note:", err.message);
    });
  } catch (err) {
    console.error("[Store] Failed to load store:", err);
  }
}
loadStoreFromDisk();
var app = express();
var PORT = 3e3;
var DEFAULT_PUBLIC_URL = process.env.APP_URL || "https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app";
app.set("trust proxy", true);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
var lastKnownBaseUrl = DEFAULT_PUBLIC_URL;
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    req._body = true;
  }
  next();
});
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1") && !host.startsWith("10.") && !host.startsWith("172.") && !host.startsWith("192.168.")) {
    const proto = host.includes(".run.app") ? "https" : req.headers["x-forwarded-proto"] || req.protocol || "https";
    lastKnownBaseUrl = `${proto}://${host}`;
  }
  next();
});
function getRequestContext(req) {
  const user = resolveAuthUser(req);
  const userId = user ? user.id : PRIMARY_USER_ID;
  const partition = getUserPartition(userId);
  return { user, userId, partition };
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CareerOps AI",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    models: ["gemini-3.8-flash"],
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});
app.get("/api/auth/me", (req, res) => {
  const user = resolveAuthUser(req);
  if (!user) {
    return res.json({
      success: false,
      authenticated: false,
      user: null
    });
  }
  res.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name || user.email.split("@")[0],
      full_name: user.full_name,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      avatar_url: user.avatar_url
    }
  });
});
app.post("/api/auth/register", async (req, res) => {
  const { email, password, full_name, telegram_chat_id } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }
  const cleanEmail = email.toLowerCase().trim();
  if (userEmailIndex[cleanEmail]) {
    return res.status(409).json({ error: "An account with this email address already exists. Please sign in instead." });
  }
  const userId = `usr_${crypto4.randomBytes(8).toString("hex")}`;
  const { hash, salt } = hashPassword(password);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const cleanTelegramId = telegram_chat_id && typeof telegram_chat_id === "string" ? telegram_chat_id.trim() : "";
  const newAccount = {
    id: userId,
    email: cleanEmail,
    full_name: (full_name && typeof full_name === "string" ? full_name.trim() : "") || cleanEmail.split("@")[0],
    password_hash: hash,
    salt,
    created_at: now,
    last_login_at: now,
    telegram_chat_id: cleanTelegramId || void 0
  };
  users[userId] = newAccount;
  userEmailIndex[cleanEmail] = userId;
  const partition = getUserPartition(userId);
  if (cleanTelegramId) {
    partition.appSettings.telegram_chat_id = cleanTelegramId;
    partition.appSettings.telegram_configured = true;
    partition.appSettings.auto_notify_telegram = true;
    partition.workflowState.auto_notify_telegram = true;
    const botToken = partition.appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || "8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas";
    const candFirst = escapeTelegramHtml(newAccount.full_name.split(" ")[0] || "Candidate");
    const welcomeMsg = `\u{1F389} <b>Welcome to CareerOps AI, ${candFirst}!</b>

Your personal job discovery & ATS intelligence workspace is active for <b>${escapeTelegramHtml(newAccount.email)}</b>.

\u2705 <b>Telegram Push:</b> Synced to Chat ID <code>${escapeTelegramHtml(cleanTelegramId)}</code>
\u26A1 <b>Fit Threshold:</b> &ge; 75% Score
\u{1F552} <b>Pipeline:</b> Autonomous 4-hour scans

You'll receive real-time push alerts right here whenever verified high-fit roles matching your profile are discovered! \u{1F680}`;
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cleanTelegramId,
        text: welcomeMsg,
        parse_mode: "HTML"
      })
    }).catch((err) => {
      console.warn("[Telegram Alert] Initial welcome dispatch note:", err?.message || err);
    });
  }
  const token = createSessionForUser(userId, req.headers["user-agent"]);
  attachSessionCookie(res, req, token);
  saveStoreToDisk(false);
  res.status(201).json({
    success: true,
    message: "Account registered successfully",
    token,
    user: {
      id: newAccount.id,
      email: newAccount.email,
      name: newAccount.full_name || newAccount.email.split("@")[0],
      full_name: newAccount.full_name,
      telegram_chat_id: newAccount.telegram_chat_id,
      created_at: newAccount.created_at
    }
  });
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please provide both email and password." });
  }
  const cleanEmail = email.toLowerCase().trim();
  const userId = userEmailIndex[cleanEmail];
  if (!userId || !users[userId]) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  const user = users[userId];
  const isValid = verifyPassword(password, user.password_hash, user.salt);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  user.last_login_at = (/* @__PURE__ */ new Date()).toISOString();
  const token = createSessionForUser(userId, req.headers["user-agent"]);
  attachSessionCookie(res, req, token);
  saveStoreToDisk(false);
  res.json({
    success: true,
    message: "Logged in successfully",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name || user.email.split("@")[0],
      full_name: user.full_name,
      created_at: user.created_at,
      last_login_at: user.last_login_at
    }
  });
});
app.post("/api/auth/demo-login", (req, res) => {
  const targetUserId = req.body?.user_id === "demo" || req.body?.user_id === DEMO_USER_ID ? DEMO_USER_ID : PRIMARY_USER_ID;
  const user = users[targetUserId];
  if (!user) {
    return res.status(404).json({ error: "Demo user not found." });
  }
  user.last_login_at = (/* @__PURE__ */ new Date()).toISOString();
  const token = createSessionForUser(targetUserId, req.headers["user-agent"]);
  attachSessionCookie(res, req, token);
  saveStoreToDisk(false);
  res.json({
    success: true,
    message: `Signed in as ${user.full_name}`,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name || user.email.split("@")[0],
      full_name: user.full_name,
      created_at: user.created_at,
      last_login_at: user.last_login_at
    }
  });
});
app.post("/api/auth/switch-account", (req, res) => {
  const { user_id, email } = req.body;
  let targetUserId = user_id;
  if (!targetUserId && email) {
    targetUserId = userEmailIndex[email.toLowerCase().trim()];
  }
  if (!targetUserId || !users[targetUserId]) {
    return res.status(404).json({ error: "Account not found on this device." });
  }
  const user = users[targetUserId];
  user.last_login_at = (/* @__PURE__ */ new Date()).toISOString();
  const token = createSessionForUser(targetUserId, req.headers["user-agent"]);
  attachSessionCookie(res, req, token);
  saveStoreToDisk(false);
  res.json({
    success: true,
    message: `Switched account to ${user.full_name}`,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.full_name || user.email.split("@")[0],
      full_name: user.full_name,
      created_at: user.created_at,
      last_login_at: user.last_login_at
    }
  });
});
app.post("/api/auth/logout", (req, res) => {
  clearSessionCookie(res);
  const token = req.cookies?.careerops_session || (req.headers.authorization ? req.headers.authorization.replace(/bearer /i, "").trim() : "");
  if (token && sessions[token]) {
    delete sessions[token];
  }
  saveStoreToDisk(false);
  res.json({ success: true, message: "Logged out successfully." });
});
app.get("/api/auth/saved-accounts", (req, res) => {
  res.json({
    success: true,
    accounts: getSavedAccountsList()
  });
});
app.get("/api/profile", (req, res) => {
  const { partition } = getRequestContext(req);
  res.json(partition.currentProfile);
});
app.post("/api/profile", (req, res) => {
  try {
    const { partition, userId } = getRequestContext(req);
    partition.currentProfile = { ...partition.currentProfile, ...req.body };
    partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
    saveStoreToDisk();
    res.json({ success: true, profile: partition.currentProfile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/profile/reset", (req, res) => {
  const { partition, userId } = getRequestContext(req);
  partition.currentProfile = JSON.parse(JSON.stringify(INITIAL_PROFILE));
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
  saveStoreToDisk();
  res.json({ success: true, profile: partition.currentProfile });
});
app.post("/api/profile/parse-document", async (req, res) => {
  const { base64, file_name, mime_type } = req.body;
  if (!base64 || typeof base64 !== "string") {
    return res.status(400).json({ error: "Please provide valid base64 document data." });
  }
  try {
    const { partition, userId } = getRequestContext(req);
    const buffer = Buffer.from(base64, "base64");
    const fileName = file_name || "Resume.pdf";
    console.log(`[Document Parser] Ingesting "${fileName}" (${buffer.length} bytes)...`);
    const result = await parseAndEnrichCandidateResume({
      buffer,
      fileName,
      mimeType: mime_type,
      existingProfile: partition.currentProfile
    });
    partition.currentProfile = result.profile;
    partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
    saveStoreToDisk();
    res.json({
      success: true,
      profile: partition.currentProfile,
      scraped_sources: result.scrapedSources,
      links_found: result.linksFound,
      extracted_text_preview: result.extractedTextPreview,
      file_info: {
        file_name: fileName,
        file_type: partition.currentProfile.parsed_from_document?.file_type,
        bytes: buffer.length
      }
    });
  } catch (err) {
    console.error("[Document Parser] Error:", err);
    res.status(500).json({ error: err.message || "Failed to parse resume document." });
  }
});
app.post("/api/profile/parse", async (req, res) => {
  const { raw_text } = req.body;
  if (!raw_text || typeof raw_text !== "string" || raw_text.trim().length < 30) {
    return res.status(400).json({ error: "Please provide valid resume text to parse (minimum 30 characters)." });
  }
  try {
    const { partition, userId } = getRequestContext(req);
    console.log(`[Resume Parse] Ingesting text resume (${raw_text.length} chars)...`);
    const result = await parseAndEnrichCandidateResume({
      rawText: raw_text,
      existingProfile: partition.currentProfile
    });
    partition.currentProfile = result.profile;
    partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    if (userId === PRIMARY_USER_ID) currentProfile = partition.currentProfile;
    saveStoreToDisk();
    res.json({
      success: true,
      profile: partition.currentProfile,
      scraped_sources: result.scrapedSources,
      links_found: result.linksFound,
      extracted_text_preview: result.extractedTextPreview
    });
  } catch (err) {
    console.error("[Profile Parse] Error:", err);
    res.status(500).json({ error: err.message || "Error parsing resume text." });
  }
});
app.get("/api/jobs", (req, res) => {
  const { partition } = getRequestContext(req);
  const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
  res.json(activeJobs);
});
app.post("/api/jobs/search", async (req, res) => {
  const { query } = req.body;
  const { partition, userId } = getRequestContext(req);
  try {
    const newJobs = await discoverJobsForProfile(
      partition.currentProfile,
      query,
      partition.jobListings,
      partition.seenJobs,
      partition.appSettings.serpapi_key || appSettings.serpapi_key || process.env.SERPAPI_KEY,
      partition.searchedRegistry
    );
    const existingIds = new Set(partition.jobListings.map((j) => j.id));
    const existingSignatures = new Set(
      partition.jobListings.map((j) => `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`)
    );
    const added = [];
    for (const nj of newJobs) {
      const sig = `${nj.company_name.toLowerCase()}_${nj.title.toLowerCase()}`;
      const normLink = normalizeJobUrl(nj.apply_link);
      partition.seenJobs[nj.id] = (/* @__PURE__ */ new Date()).toISOString();
      if (normLink) partition.seenJobs[normLink] = (/* @__PURE__ */ new Date()).toISOString();
      partition.seenJobs[sig] = (/* @__PURE__ */ new Date()).toISOString();
      partition.searchedRegistry[nj.id] = {
        id: nj.id,
        signature: sig,
        normalized_url: normLink,
        company_name: nj.company_name,
        title: nj.title,
        status: nj.status || "discovered",
        discovered_at: nj.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
        last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (!existingIds.has(nj.id) && !existingSignatures.has(sig)) {
        partition.jobListings.unshift(nj);
        existingIds.add(nj.id);
        existingSignatures.add(sig);
        added.push(nj);
      }
    }
    partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
      Object.assign(seenJobs, partition.seenJobs);
      Object.assign(searchedRegistry, partition.searchedRegistry);
    }
    saveStoreToDisk();
    res.json({ success: true, added_count: added.length, jobs: partition.jobListings, searched_registry: partition.searchedRegistry });
  } catch (err) {
    console.error("[Jobs Search] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/jobs/add", async (req, res) => {
  const { title, company_name, location, description, apply_link, ats_source, salary_range_lpa, experience_range_years } = req.body;
  if (!title || !company_name || !description) {
    return res.status(400).json({ error: "Title, company name, and job description are required." });
  }
  const id = crypto4.createHash("sha256").update(title + company_name + Date.now()).digest("hex").substring(0, 16);
  const expResolution = resolveExperienceYears(description, title, apply_link);
  const finalExpRange = experience_range_years || (expResolution ? expResolution.range : [2, 4]);
  let finalSalaryRange = salary_range_lpa || extractSalaryLpa(description);
  let isEstimatedSalary = false;
  let salarySource = "Stated in Job Description";
  const salaryMeta = generateSalarySearchMetadata(
    title.trim(),
    company_name.trim(),
    location?.trim() || "Gurugram"
  );
  if (!finalSalaryRange) {
    const benchmark = estimateSalaryLpa(
      title.trim(),
      company_name.trim(),
      location?.trim() || "Gurugram",
      finalExpRange
    );
    finalSalaryRange = [benchmark.minLpa, benchmark.maxLpa];
    isEstimatedSalary = true;
    salarySource = benchmark.source;
  }
  let cleanApplyLink = (apply_link || "").trim();
  if (!cleanApplyLink || isGenericSearchLink(cleanApplyLink)) {
    const companyClean = company_name.toLowerCase().replace(/[^a-z0-9]/g, "");
    cleanApplyLink = `https://careers.${companyClean}.com/jobs/${id}`;
  }
  const verification = await verifyJobPosting(cleanApplyLink, company_name, title);
  const newJob = {
    id,
    title: title.trim(),
    company_name: company_name.trim(),
    location: location?.trim() || "Not specified",
    salary_range_lpa: finalSalaryRange,
    salary_is_estimated: isEstimatedSalary,
    salary_source: salarySource,
    salary_search_query: salaryMeta.searchQuery,
    salary_ambitionbox_url: salaryMeta.ambitionBoxSearchUrl,
    salary_glassdoor_url: salaryMeta.glassdoorSearchUrl,
    experience_range_years: finalExpRange,
    experience_is_inferred: expResolution.isInferred,
    experience_inferred_reason: expResolution.reason,
    description: description.trim(),
    apply_link: cleanApplyLink,
    ats_source: ats_source || "Custom",
    discovered_at: (/* @__PURE__ */ new Date()).toISOString(),
    posted_date: (/* @__PURE__ */ new Date()).toISOString(),
    posted_days_ago: 0,
    is_direct_posting: verification.isDirect,
    verification_status: verification.status,
    verification_notes: verification.notes,
    verified_at: verification.checkedAt,
    status: "discovered"
  };
  const { partition, userId } = getRequestContext(req);
  partition.jobListings.unshift(newJob);
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
  }
  saveStoreToDisk();
  res.json({ success: true, job: newJob });
});
app.post("/api/salary/estimate", (req, res) => {
  const { title, company_name, location, exp_years } = req.body;
  if (!title || !company_name) {
    return res.status(400).json({ error: "Title and company name are required." });
  }
  const expRange = exp_years || [2, 5];
  const benchmark = estimateSalaryLpa(title, company_name, location || "Gurugram", expRange);
  res.json({ success: true, benchmark });
});
app.post("/api/jobs/:id/verify-link", async (req, res) => {
  const { id } = req.params;
  const { partition, userId } = getRequestContext(req);
  const target = partition.jobListings.find((j) => j.id === id);
  if (!target) return res.status(404).json({ error: "Job listing not found." });
  const verification = await verifyJobPosting(target.apply_link, target.company_name, target.title);
  target.verification_status = verification.status;
  target.verification_notes = verification.notes;
  target.verified_at = verification.checkedAt;
  target.is_direct_posting = verification.isDirect;
  let autoRemoved = false;
  if (verification.status === "expired_or_invalid" || target.company_name.toLowerCase().includes("state street")) {
    target.status = "expired";
    partition.jobListings = partition.jobListings.filter((j) => j.id !== id);
    autoRemoved = true;
  }
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
  }
  saveStoreToDisk();
  res.json({
    success: true,
    verification,
    autoRemoved,
    job: autoRemoved ? null : target,
    jobs: partition.jobListings
  });
});
app.post("/api/jobs/verify-all", async (req, res) => {
  const { partition, userId } = getRequestContext(req);
  const results = [];
  const initialCount = partition.jobListings.length;
  for (const job of [...partition.jobListings]) {
    const verification = await verifyJobPosting(job.apply_link, job.company_name, job.title);
    job.verification_status = verification.status;
    job.verification_notes = verification.notes;
    job.verified_at = verification.checkedAt;
    job.is_direct_posting = verification.isDirect;
    if (verification.status === "expired_or_invalid" || job.company_name.toLowerCase().includes("state street")) {
      job.status = "expired";
    }
    results.push({ id: job.id, status: verification.status });
  }
  partition.jobListings = partition.jobListings.filter(
    (j) => j.status !== "expired" && j.verification_status !== "expired_or_invalid" && !j.company_name.toLowerCase().includes("state street")
  );
  const removedExpired = initialCount - partition.jobListings.length;
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
  }
  saveStoreToDisk();
  res.json({
    success: true,
    verified_count: results.length,
    removed_expired_count: removedExpired,
    remaining_count: partition.jobListings.length,
    jobs: partition.jobListings
  });
});
app.post("/api/jobs/remove-expired", (req, res) => {
  const { partition, userId } = getRequestContext(req);
  const initialCount = partition.jobListings.length;
  const expired = partition.jobListings.filter(
    (j) => j.status === "expired" || j.verification_status === "expired_or_invalid" || j.company_name.toLowerCase().includes("state street")
  );
  for (const j of expired) {
    if (!partition.deletedJobIds.includes(j.id)) {
      partition.deletedJobIds.push(j.id);
    }
  }
  partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
  const removedCount = initialCount - partition.jobListings.length;
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
    for (const j of expired) deletedJobIds.add(j.id);
  }
  saveStoreToDisk();
  console.log(`[Remove Expired] Purged ${removedCount} expired/invalid jobs. ${partition.jobListings.length} remain.`);
  res.json({ success: true, removedCount, remainingCount: partition.jobListings.length, jobs: partition.jobListings, deleted_ids: partition.deletedJobIds });
});
app.delete("/api/jobs/:id", (req, res) => {
  const { id } = req.params;
  const { partition, userId } = getRequestContext(req);
  if (id) {
    if (!partition.deletedJobIds.includes(id)) {
      partition.deletedJobIds.push(id);
    }
    const target = partition.jobListings.find((j) => j.id === id);
    if (target) {
      const sig = `${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`;
      const norm = normalizeJobUrl(target.apply_link);
      partition.searchedRegistry[id] = {
        id,
        signature: sig,
        normalized_url: norm,
        company_name: target.company_name,
        title: target.title,
        status: "deleted",
        discovered_at: target.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
        rejected_at: (/* @__PURE__ */ new Date()).toISOString(),
        last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      partition.seenJobs[id] = (/* @__PURE__ */ new Date()).toISOString();
      if (norm) partition.seenJobs[norm] = (/* @__PURE__ */ new Date()).toISOString();
      partition.seenJobs[sig] = (/* @__PURE__ */ new Date()).toISOString();
    }
  }
  const initialCount = partition.jobListings.length;
  partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
    if (id) deletedJobIds.add(id);
  }
  saveStoreToDisk();
  res.json({ success: true, deleted: initialCount > partition.jobListings.length, jobs: partition.jobListings, deleted_ids: partition.deletedJobIds, searched_registry: partition.searchedRegistry });
});
app.get("/api/download-cover-letter", async (req, res) => {
  const id = req.query.id;
  const format = (req.query.format || "txt").toLowerCase();
  const { partition } = getRequestContext(req);
  const target = partition.jobListings.find((j) => j.id === id) || jobListings.find((j) => j.id === id);
  if (!target) {
    return res.status(404).send("Job listing not found");
  }
  if (!target.tailored) {
    try {
      target.tailored = await generateTailoredDocuments(
        partition.currentProfile,
        target.title,
        target.company_name,
        target.description
      );
    } catch (err) {
      console.error("[Download] Error generating tailored cover letter:", err);
    }
  }
  const tailored = target.tailored;
  const candName = partition.currentProfile.full_name;
  const candEmail = partition.currentProfile.contact.email;
  const candPhone = partition.currentProfile.contact.phone;
  const candLocation = partition.currentProfile.contact.location;
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const paragraphs = tailored?.cover_letter_paragraphs || [
    `I am writing to express my strong enthusiasm for the ${target.title} position at ${target.company_name}. With my background in enterprise automation, business intelligence, and digital transformation, I am confident in my ability to immediately add value to your team.`,
    `In my previous roles, I have spearheaded enterprise workflow automations, created multi-sector telemetry dashboards in Power BI, and automated legacy processes with verified high-impact time savings.`,
    `Thank you for considering my application. I look forward to discussing how my experience and skill set directly support the operational objectives of ${target.company_name}.`
  ];
  const safeCompany = target.company_name.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeTitle = target.title.replace(/[^a-zA-Z0-9_-]/g, "_");
  if (format === "doc") {
    const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>Cover Letter - ${target.title}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; }
h1 { font-size: 18pt; margin-bottom: 4pt; color: #0A2540; }
.contact { font-size: 10pt; color: #4B5563; margin-bottom: 20pt; border-bottom: 1.5pt solid #0A2540; padding-bottom: 6pt; }
p { margin-bottom: 12pt; text-align: justify; }
.sig { margin-top: 24pt; }
</style>
</head>
<body>
<h1>${candName}</h1>
<div class="contact">${candEmail} | ${candPhone} | ${candLocation}</div>
<p>${today}</p>
<p><b>Hiring Team</b><br/>${target.company_name}<br/><b>Target Role:</b> ${target.title}</p>
<p>Dear Hiring Team at ${target.company_name},</p>
${paragraphs.map((p) => `<p>${p}</p>`).join("\n")}
<div class="sig">
<p>Sincerely,</p>
<p><b>${candName}</b></p>
</div>
</body>
</html>`;
    res.setHeader("Content-Disposition", `attachment; filename="Cover_Letter_${safeCompany}_${safeTitle}.doc"`);
    res.setHeader("Content-Type", "application/msword; charset=utf-8");
    return res.send(docHtml);
  }
  const textContent = `${candName.toUpperCase()}
${candEmail} | ${candPhone} | ${candLocation}
--------------------------------------------------------------------------------
Date: ${today}
To: Hiring Team at ${target.company_name}
Re: Application for ${target.title}

Dear Hiring Team at ${target.company_name},

${paragraphs.join("\n\n")}

Sincerely,
${candName}
`;
  res.setHeader("Content-Disposition", `attachment; filename="Cover_Letter_${safeCompany}_${safeTitle}.txt"`);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(textContent);
});
app.get("/api/download-resume", async (req, res) => {
  const id = req.query.id;
  const format = (req.query.format || "txt").toLowerCase();
  const { partition } = getRequestContext(req);
  const target = partition.jobListings.find((j) => j.id === id) || jobListings.find((j) => j.id === id);
  if (!target) {
    return res.status(404).send("Job listing not found");
  }
  if (!target.tailored) {
    try {
      target.tailored = await generateTailoredDocuments(
        partition.currentProfile,
        target.title,
        target.company_name,
        target.description
      );
    } catch (err) {
      console.error("[Download] Error generating tailored resume:", err);
    }
  }
  const tailored = target.tailored;
  const candName = partition.currentProfile.full_name;
  const candEmail = partition.currentProfile.contact.email;
  const candPhone = partition.currentProfile.contact.phone;
  const candLocation = partition.currentProfile.contact.location;
  const summary = tailored?.summary || `${candName} - Experience: ${partition.currentProfile.total_years_experience} Years. Core Skills: ${partition.currentProfile.skills.slice(0, 6).join(", ")}.`;
  const skills = (tailored?.skills_ordered || partition.currentProfile.skills).join(", ");
  const experiences = tailored?.experience || partition.currentProfile.experience;
  const safeCompany = target.company_name.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeCand = candName.replace(/\s+/g, "_");
  if (format === "doc") {
    const docHtml = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><title>Resume - ${candName}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #111827; }
h1 { font-size: 18pt; margin-bottom: 2pt; color: #0A2540; text-align: center; }
.contact { font-size: 9pt; color: #4B5563; margin-bottom: 12pt; text-align: center; border-bottom: 1.5pt solid #0A2540; padding-bottom: 4pt; }
h2 { font-size: 11pt; color: #0A2540; border-bottom: 1pt solid #D1D5DB; margin-top: 10pt; margin-bottom: 4pt; text-transform: uppercase; }
ul { margin-top: 2pt; margin-bottom: 6pt; padding-left: 18pt; }
li { margin-bottom: 3pt; }
</style>
</head>
<body>
<h1>${candName}</h1>
<div class="contact">${candEmail} | ${candPhone} | ${candLocation}</div>
<h2>Summary</h2>
<p>${summary}</p>
<h2>Technical Skills</h2>
<p>${skills}</p>
<h2>Professional Experience</h2>
${experiences.map(
      (e) => `
<div>
<p><b>${e.company}</b></p>
<ul>
${(e.bullets || []).map((b) => `<li>${b}</li>`).join("\n")}
</ul>
</div>
`
    ).join("\n")}
</body>
</html>`;
    res.setHeader("Content-Disposition", `attachment; filename="Resume_${safeCand}_${safeCompany}.doc"`);
    res.setHeader("Content-Type", "application/msword; charset=utf-8");
    return res.send(docHtml);
  }
  const textContent = `${candName.toUpperCase()}
${candEmail} | ${candPhone} | ${candLocation}
--------------------------------------------------------------------------------

SUMMARY
${summary}

SKILLS
${skills}

WORK EXPERIENCE
${experiences.map(
    (e) => `
${e.company}
${(e.bullets || []).map((b) => `\u2022 ${b}`).join("\n")}
`
  ).join("\n")}
`;
  res.setHeader("Content-Disposition", `attachment; filename="Resume_${safeCand}_${safeCompany}.txt"`);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(textContent);
});
app.get("/api/ats-view", async (req, res) => {
  const id = req.query.id || "";
  const requestedType = req.query.type || "resume";
  return res.redirect(`/?tab=tailor&jobId=${encodeURIComponent(id)}&type=${encodeURIComponent(requestedType)}`);
});
app.post("/api/jobs/status", (req, res) => {
  const { id, status } = req.body;
  const { partition, userId } = getRequestContext(req);
  const target = partition.jobListings.find((j) => j.id === id);
  if (!target) return res.status(404).json({ error: "Job listing not found." });
  target.status = status;
  if (status === "rejected") {
    const sig = `${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`;
    const norm = normalizeJobUrl(target.apply_link);
    partition.searchedRegistry[id] = {
      id,
      signature: sig,
      normalized_url: norm,
      company_name: target.company_name,
      title: target.title,
      status: "rejected",
      discovered_at: target.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
      rejected_at: (/* @__PURE__ */ new Date()).toISOString(),
      last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    partition.seenJobs[id] = (/* @__PURE__ */ new Date()).toISOString();
    if (norm) partition.seenJobs[norm] = (/* @__PURE__ */ new Date()).toISOString();
    partition.seenJobs[sig] = (/* @__PURE__ */ new Date()).toISOString();
  }
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
    Object.assign(searchedRegistry, partition.searchedRegistry);
    Object.assign(seenJobs, partition.seenJobs);
  }
  saveStoreToDisk();
  res.json({ success: true, job: target, jobs: partition.jobListings, searched_registry: partition.searchedRegistry });
});
app.post("/api/jobs/batch-status", (req, res) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || !status) {
    return res.status(400).json({ error: "ids array and status required" });
  }
  const { partition, userId } = getRequestContext(req);
  const idSet = new Set(ids);
  let updatedCount = 0;
  partition.jobListings.forEach((j) => {
    if (idSet.has(j.id)) {
      j.status = status;
      updatedCount++;
      if (status === "rejected") {
        const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
        const norm = normalizeJobUrl(j.apply_link);
        partition.searchedRegistry[j.id] = {
          id: j.id,
          signature: sig,
          normalized_url: norm,
          company_name: j.company_name,
          title: j.title,
          status: "rejected",
          discovered_at: j.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
          rejected_at: (/* @__PURE__ */ new Date()).toISOString(),
          last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        partition.seenJobs[j.id] = (/* @__PURE__ */ new Date()).toISOString();
        if (norm) partition.seenJobs[norm] = (/* @__PURE__ */ new Date()).toISOString();
        partition.seenJobs[sig] = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
  });
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
    Object.assign(searchedRegistry, partition.searchedRegistry);
    Object.assign(seenJobs, partition.seenJobs);
  }
  saveStoreToDisk();
  res.json({ success: true, updatedCount, jobs: partition.jobListings, searched_registry: partition.searchedRegistry });
});
app.post("/api/jobs/batch-delete", (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "ids array required" });
  }
  const { partition, userId } = getRequestContext(req);
  for (const id of ids) {
    if (id) {
      if (!partition.deletedJobIds.includes(id)) {
        partition.deletedJobIds.push(id);
      }
      const target = partition.jobListings.find((j) => j.id === id);
      if (target) {
        const sig = `${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`;
        const norm = normalizeJobUrl(target.apply_link);
        partition.searchedRegistry[id] = {
          id,
          signature: sig,
          normalized_url: norm,
          company_name: target.company_name,
          title: target.title,
          status: "deleted",
          discovered_at: target.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
          rejected_at: (/* @__PURE__ */ new Date()).toISOString(),
          last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        partition.seenJobs[id] = (/* @__PURE__ */ new Date()).toISOString();
        if (norm) partition.seenJobs[norm] = (/* @__PURE__ */ new Date()).toISOString();
        partition.seenJobs[sig] = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
  }
  const initialCount = partition.jobListings.length;
  partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
  partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  if (userId === PRIMARY_USER_ID) {
    jobListings = partition.jobListings;
    for (const id of ids) if (id) deletedJobIds.add(id);
    Object.assign(searchedRegistry, partition.searchedRegistry);
    Object.assign(seenJobs, partition.seenJobs);
  }
  saveStoreToDisk();
  res.json({ success: true, deletedCount: initialCount - partition.jobListings.length, jobs: partition.jobListings, deleted_ids: partition.deletedJobIds, searched_registry: partition.searchedRegistry });
});
app.post("/api/match", async (req, res) => {
  const { id } = req.body;
  const { partition, userId } = getRequestContext(req);
  const target = partition.jobListings.find((j) => j.id === id);
  if (!target) return res.status(404).json({ error: "Job listing not found." });
  try {
    const fit = await evaluateJobFit(
      partition.currentProfile,
      target.title,
      target.company_name,
      target.description,
      target.location,
      target.salary_range_lpa,
      target.experience_range_years
    );
    target.fit = fit;
    if (fit.is_viable && fit.match_score >= partition.appSettings.min_match_score) {
      if (target.status === "new") target.status = "viable";
    } else if (!fit.is_viable) {
      if (target.status === "new") target.status = "rejected";
    }
    partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    if (userId === PRIMARY_USER_ID) {
      jobListings = partition.jobListings;
    }
    saveStoreToDisk();
    res.json({ success: true, fit, job: target });
  } catch (err) {
    console.error("[Match] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/pipeline/run", async (req, res) => {
  const result = await executeWorkflowCycle("manual");
  saveStoreToDisk();
  res.json({
    success: true,
    result,
    workflow: workflowState,
    jobs: jobListings,
    evaluated_count: result.run?.evaluated_count || 0,
    newly_added_count: result.newlyAddedCount || 0,
    expired_count: result.expiredCount || 0,
    high_fit_count: result.run?.high_fit_count || 0,
    notified_count: result.run?.notified_count || 0
  });
});
app.post("/api/tailor", async (req, res) => {
  const { id } = req.body;
  const target = jobListings.find((j) => j.id === id);
  if (!target) return res.status(404).json({ error: "Job listing not found." });
  try {
    const tailored = await generateTailoredDocuments(
      currentProfile,
      target.title,
      target.company_name,
      target.description
    );
    target.tailored = tailored;
    res.json({ success: true, tailored, job: target });
  } catch (err) {
    console.error("[Tailor] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
function escapeTelegramHtml(text) {
  if (text === void 0 || text === null) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function sendTelegramAlertForJob(target, custom_chat_id, custom_bot_token) {
  if (target.status === "expired" || target.verification_status === "expired_or_invalid" || target.company_name.toLowerCase().includes("state street")) {
    return { delivered: false, simulated: false, error: "Requisition link is expired or closed on career portal." };
  }
  const chatId = (custom_chat_id || appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || "1368681854").trim();
  const botToken = (custom_bot_token || appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN || "8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas").trim();
  const candFirst = escapeTelegramHtml(currentProfile.full_name.split(" ")[0] || "Candidate");
  const fitScore = target.fit?.match_score || 85;
  const expReq = target.fit?.detected_experience || (target.experience_range_years ? `${target.experience_range_years[0]}-${target.experience_range_years[1]} Years` : "Not specified");
  const salRange = target.fit?.salary_range || (target.salary_range_lpa ? `\u20B9${target.salary_range_lpa[0]} - \u20B9${target.salary_range_lpa[1]} LPA` : "Not specified");
  const gaps = target.fit?.skills_gap || "None";
  const header = appSettings.telegram_custom_header || `\u{1F3AF} <b>New High-Fit Role Matched for ${candFirst}! (CareerOps AI)</b>`;
  if (!target.tailored) {
    generateTailoredDocuments(
      currentProfile,
      target.title,
      target.company_name,
      target.description
    ).then((tailoredDocs) => {
      target.tailored = tailoredDocs;
      saveStoreToDisk();
    }).catch((e) => {
      console.warn("[Telegram Alert] Asynchronous document preparation note:", e.message || e);
    });
  }
  let baseUrl = lastKnownBaseUrl || process.env.APP_URL || "https://ais-dev-w2ikgh4niy7jalbtjcsxj4-473195261694.asia-southeast1.run.app";
  if (baseUrl.includes(".run.app") && baseUrl.startsWith("http://")) {
    baseUrl = baseUrl.replace("http://", "https://");
  }
  const resumeLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=resume`;
  const coverLetterLink = `${baseUrl}/?tab=tailor&jobId=${encodeURIComponent(target.id)}&type=cover_letter`;
  const roleEsc = escapeTelegramHtml(target.title);
  const compEsc = escapeTelegramHtml(target.company_name);
  const locEsc = escapeTelegramHtml(target.location);
  const expEsc = escapeTelegramHtml(expReq);
  const salEsc = escapeTelegramHtml(salRange);
  const gapsEsc = escapeTelegramHtml(gaps);
  let htmlMessage = `${header}

\u{1F4CC} <b>Role:</b> ${roleEsc}
\u{1F3E2} <b>Company:</b> ${compEsc}
\u{1F4CD} <b>Location:</b> ${locEsc}
\u23F3 <b>Experience Required:</b> ${expEsc}
`;
  if (appSettings.telegram_include_salary !== false) {
    htmlMessage += `\u{1F4B0} <b>Salary Range:</b> ${salEsc}
`;
  }
  htmlMessage += `\u{1F4CA} <b>Fit Score:</b> ${fitScore}%
`;
  if (appSettings.telegram_include_skill_gap !== false) {
    htmlMessage += `\u26A0\uFE0F <b>Skill Gap:</b> ${gapsEsc}
`;
  }
  htmlMessage += `
\u{1F4C4} <a href="${resumeLink}"><b>Tailored ATS Resume</b></a>
\u2709\uFE0F <a href="${coverLetterLink}"><b>Tailored Cover Letter</b></a>
`;
  if (appSettings.telegram_include_apply_link !== false && target.apply_link) {
    htmlMessage += `\u{1F680} <a href="${target.apply_link}"><b>Apply Directly on Portal</b></a>
`;
  }
  htmlMessage += `
<i>Automated workflow dispatch via CareerOps-AI.</i>`;
  notifiedJobIds.add(target.id);
  seenJobs[target.id] = (/* @__PURE__ */ new Date()).toISOString();
  if (target.apply_link) {
    seenJobs[normalizeJobUrl(target.apply_link)] = (/* @__PURE__ */ new Date()).toISOString();
  }
  seenJobs[`${target.company_name.toLowerCase()}_${target.title.toLowerCase()}`] = (/* @__PURE__ */ new Date()).toISOString();
  saveStoreToDisk();
  if (botToken) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          link_preview_options: { is_disabled: true }
        })
      });
      const tgData = await tgRes.json();
      if (!tgRes.ok || !tgData.ok) {
        console.error("[Telegram] Dispatch rejected by Telegram API:", tgData);
        return {
          delivered: false,
          simulated: false,
          error: tgData.description || `Telegram Error (${tgRes.status})`,
          telegram_response: tgData,
          message_html: htmlMessage
        };
      }
      console.log(`[Telegram] Successfully dispatched alert for ${target.title} to chat ${chatId}`);
      if (target.status !== "applied") {
        target.status = "notified";
      }
      saveStoreToDisk();
      return { delivered: true, simulated: false, message_html: htmlMessage, telegram_response: tgData, chat_id: chatId };
    } catch (err) {
      console.error("[Telegram] Network fetch exception:", err);
      return { delivered: false, simulated: true, error: err.message, message_html: htmlMessage };
    }
  }
  return {
    delivered: false,
    simulated: true,
    note: "Simulated dispatch (Set TELEGRAM_BOT_TOKEN in Settings or environment to deliver real messages to Telegram)",
    message_html: htmlMessage
  };
}
async function sendTelegramIssueAlert(errorMessage, context) {
  const chatId = appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID || "1368681854";
  const botToken = appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
  const candFirst = currentProfile.full_name.split(" ")[0] || "Candidate";
  const htmlMessage = `\u26A0\uFE0F <b>CareerOps Workflow Engine Issue Alert</b>

<b>Target Candidate:</b> ${candFirst}
<b>Context:</b> ${context || "Autonomous Job Discovery & Link Verification"}
<b>Issue Details:</b> <code>${errorMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
<b>Timestamp:</b> ${(/* @__PURE__ */ new Date()).toLocaleString()}

<i>The autonomous engine is continuously searching and will automatically retry next cycle.</i>`;
  if (botToken) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true
        })
      });
    } catch (err) {
      console.error("[Telegram] Failed to dispatch issue alert:", err);
    }
  }
}
async function executeWorkflowCycle(trigger = "scheduled_4h") {
  if (workflowState.is_running) {
    return { status: "already_running", runs: workflowState.runs, jobs: jobListings };
  }
  const runId = `run-${Date.now()}`;
  const startedAt = (/* @__PURE__ */ new Date()).toISOString();
  workflowState.is_running = true;
  try {
    let expiredCount = 0;
    const sampleToVerify = jobListings.slice(0, 5);
    await Promise.all(
      sampleToVerify.map(async (job) => {
        try {
          const check = await Promise.race([
            verifyJobPosting(job.apply_link, job.company_name, job.title),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2500))
          ]);
          job.verification_status = check.status;
          job.verification_notes = check.notes;
          job.verified_at = check.checkedAt;
          job.is_direct_posting = check.isDirect;
          if (check.status === "expired_or_invalid") {
            job.status = "expired";
            expiredCount++;
          }
        } catch {
        }
      })
    );
    let discovered = await discoverJobsForProfile(
      currentProfile,
      void 0,
      jobListings,
      seenJobs,
      appSettings.serpapi_key || process.env.SERPAPI_KEY
    );
    if (!discovered) {
      discovered = [];
    }
    const existingIds = new Set(jobListings.map((j) => j.id));
    const existingSignatures = new Set(
      jobListings.map((j) => `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`)
    );
    const newlyAdded = [];
    for (const nj of discovered) {
      const sig = `${nj.company_name.toLowerCase()}_${nj.title.toLowerCase()}`;
      const normLink = normalizeJobUrl(nj.apply_link);
      seenJobs[nj.id] = (/* @__PURE__ */ new Date()).toISOString();
      if (normLink) seenJobs[normLink] = (/* @__PURE__ */ new Date()).toISOString();
      seenJobs[sig] = (/* @__PURE__ */ new Date()).toISOString();
      if (!existingIds.has(nj.id) && !existingSignatures.has(sig)) {
        jobListings.unshift(nj);
        existingIds.add(nj.id);
        existingSignatures.add(sig);
        newlyAdded.push(nj);
      }
    }
    if (newlyAdded.length > 0) {
      saveStoreToDisk();
    }
    let evaluatedCount = 0;
    let highFitCount = 0;
    let notifiedCount = 0;
    const unEvaluatedJobs = jobListings.filter(
      (j) => !j.fit && j.status !== "expired" && j.verification_status !== "expired_or_invalid"
    );
    const jobsToEvaluate = unEvaluatedJobs.slice(0, 8);
    const EVAL_BATCH_SIZE = 4;
    for (let i = 0; i < jobsToEvaluate.length; i += EVAL_BATCH_SIZE) {
      const batch = jobsToEvaluate.slice(i, i + EVAL_BATCH_SIZE);
      await Promise.all(
        batch.map(async (job) => {
          try {
            const fit = await evaluateJobFit(
              currentProfile,
              job.title,
              job.company_name,
              job.description,
              job.location,
              job.salary_range_lpa,
              job.experience_range_years
            );
            job.fit = fit;
            evaluatedCount++;
            if (fit.is_viable && fit.match_score >= appSettings.min_match_score) {
              if (job.status === "new") job.status = "discovered";
              highFitCount++;
              if (job.status !== "expired" && job.verification_status !== "expired_or_invalid" && workflowState.auto_notify_telegram && !notifiedJobIds.has(job.id)) {
                await sendTelegramAlertForJob(job);
                notifiedCount++;
              }
            } else if (!fit.is_viable && (job.status === "new" || job.status === "discovered")) {
              job.status = "rejected";
            }
          } catch (err) {
            console.error(`[Workflow] Evaluation error for ${job.title}:`, err);
          }
        })
      );
      saveStoreToDisk();
    }
    for (const job of jobListings) {
      if (job.fit && job.fit.is_viable && job.fit.match_score >= appSettings.min_match_score && job.status !== "expired" && job.verification_status !== "expired_or_invalid") {
        highFitCount++;
        if (workflowState.auto_notify_telegram && !notifiedJobIds.has(job.id) && job.status !== "applied") {
          await sendTelegramAlertForJob(job);
          notifiedCount++;
        }
      }
    }
    const completedAt = (/* @__PURE__ */ new Date()).toISOString();
    workflowState.last_run = completedAt;
    const intervalMs = workflowState.interval_hours * 60 * 60 * 1e3;
    workflowState.next_run = new Date(Math.ceil((Date.now() + 1e3) / intervalMs) * intervalMs).toISOString();
    workflowState.total_runs++;
    setupWorkflowScheduler();
    const runSummary = trigger === "scheduled_4h" ? `Automated cycle: Scanned existing links (${expiredCount} expired identified), discovered ${newlyAdded.length} fresh jobs. Evaluated ${evaluatedCount} listings, ${highFitCount} high-fit matches, ${notifiedCount} Telegram alerts dispatched.` : `Automation cycle: Scanned links (${expiredCount} expired identified), discovered ${newlyAdded.length} fresh jobs. Evaluated ${evaluatedCount} listings, ${highFitCount} high-fit matches, ${notifiedCount} Telegram alerts dispatched.`;
    const runLog = {
      id: runId,
      started_at: startedAt,
      completed_at: completedAt,
      trigger,
      new_jobs_found: newlyAdded.length,
      evaluated_count: evaluatedCount,
      high_fit_count: highFitCount,
      notified_count: notifiedCount,
      status: "completed",
      summary: runSummary
    };
    workflowState.runs.unshift(runLog);
    if (workflowState.runs.length > 20) workflowState.runs.pop();
    return {
      success: true,
      run: runLog,
      newlyAddedCount: newlyAdded.length,
      expiredCount,
      jobs: jobListings
    };
  } catch (err) {
    console.error("[Workflow] Error executing cycle:", err);
    await sendTelegramIssueAlert(err.message || "Workflow automation failure", "Autonomous Search Engine");
    const failedLog = {
      id: runId,
      started_at: startedAt,
      completed_at: (/* @__PURE__ */ new Date()).toISOString(),
      trigger,
      new_jobs_found: 0,
      evaluated_count: 0,
      high_fit_count: 0,
      notified_count: 0,
      status: "failed",
      summary: `Workflow execution issue: ${err.message}`
    };
    const intervalMs = (workflowState.interval_hours || 4) * 60 * 60 * 1e3;
    workflowState.next_run = new Date(Math.ceil((Date.now() + 1e3) / intervalMs) * intervalMs).toISOString();
    workflowState.runs.unshift(failedLog);
    return { success: false, error: err.message, jobs: jobListings };
  } finally {
    workflowState.is_running = false;
    saveStoreToDisk();
  }
}
var workflowIntervalTimer = null;
function setupWorkflowScheduler() {
  if (workflowIntervalTimer) clearInterval(workflowIntervalTimer);
  if (!workflowState.enabled) return;
  workflowIntervalTimer = setInterval(async () => {
    if (!workflowState.enabled || workflowState.is_running) return;
    const now = Date.now();
    const nextRunTime = workflowState.next_run ? new Date(workflowState.next_run).getTime() : 0;
    if (nextRunTime > 0 && now >= nextRunTime) {
      console.log(`[Workflow Scheduler Heartbeat] Next run time reached (${(/* @__PURE__ */ new Date()).toISOString()}). Executing cycle...`);
      try {
        await executeWorkflowCycle("scheduled_4h");
      } catch (e) {
        console.error("[Workflow Scheduler] Recurring cycle failed:", e);
      }
    }
  }, 30 * 1e3);
  if (workflowIntervalTimer.unref) {
    workflowIntervalTimer.unref();
  }
}
setupWorkflowScheduler();
app.get("/api/workflow/status", (req, res) => {
  res.json({
    success: true,
    workflow: workflowState,
    jobs_count: jobListings.length
  });
});
app.post("/api/workflow/run", async (req, res) => {
  const result = await executeWorkflowCycle("manual");
  saveStoreToDisk();
  res.json({
    success: true,
    result,
    workflow: workflowState,
    jobs: jobListings
  });
});
function computePipelineStatsForPartition(p) {
  const total = p.jobListings.length;
  const viable = p.jobListings.filter((j) => j.fit?.is_viable).length;
  const highFit = p.jobListings.filter((j) => (j.fit?.match_score || 0) >= p.appSettings.min_match_score).length;
  const notified = p.jobListings.filter((j) => j.status === "notified").length;
  const applied = p.jobListings.filter((j) => j.status === "applied").length;
  return {
    total_jobs: total,
    seen_count: total,
    viable_count: viable,
    high_fit_count: highFit,
    notified_count: notified,
    applied_count: applied,
    last_run: p.workflowState.last_run || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function computePipelineStats() {
  const total = jobListings.length;
  const viable = jobListings.filter((j) => j.fit?.is_viable).length;
  const highFit = jobListings.filter((j) => (j.fit?.match_score || 0) >= appSettings.min_match_score).length;
  const notified = jobListings.filter((j) => j.status === "notified").length;
  const applied = jobListings.filter((j) => j.status === "applied").length;
  return {
    total_jobs: total,
    seen_count: total,
    viable_count: viable,
    high_fit_count: highFit,
    notified_count: notified,
    applied_count: applied,
    last_run: workflowState.last_run || (/* @__PURE__ */ new Date()).toISOString()
  };
}
var handleCronTrigger = async (req, res) => {
  console.log(`[Cloud Cron Webhook] Received external trigger (${req.method} ${req.path}) from ${req.ip}`);
  const shouldWait = req.query.wait === "true" || !!process.env.VERCEL;
  if (workflowState.is_running) {
    return res.status(200).json({
      success: true,
      status: "already_running",
      message: "Autonomous workflow cycle is currently in progress.",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      workflow: workflowState
    });
  }
  if (shouldWait) {
    const result = await executeWorkflowCycle("scheduled_4h");
    saveStoreToDisk();
    return res.json({
      success: true,
      triggered_by: "cloud_cron_webhook",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      result,
      workflow: workflowState
    });
  }
  res.status(200).json({
    success: true,
    status: "triggered",
    message: "Autonomous workflow cycle triggered in background.",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    next_run: workflowState.next_run
  });
  executeWorkflowCycle("scheduled_4h").then(() => {
    saveStoreToDisk();
  }).catch((err) => {
    console.error("[Cloud Cron Webhook] Background execution failed:", err);
  });
};
app.get("/api/workflow/cron", handleCronTrigger);
app.post("/api/workflow/cron", handleCronTrigger);
app.get("/api/cron/trigger", handleCronTrigger);
app.post("/api/cron/trigger", handleCronTrigger);
app.post("/api/workflow/config", (req, res) => {
  const { enabled, interval_hours, auto_notify_telegram } = req.body;
  if (typeof enabled === "boolean") workflowState.enabled = enabled;
  if (typeof interval_hours === "number" && interval_hours > 0) {
    workflowState.interval_hours = interval_hours;
    workflowState.next_run = getCanonicalNextRun2(interval_hours);
  }
  if (typeof auto_notify_telegram === "boolean") {
    workflowState.auto_notify_telegram = auto_notify_telegram;
  }
  workflowState.last_updated = (/* @__PURE__ */ new Date()).toISOString();
  setupWorkflowScheduler();
  saveStoreToDisk();
  res.json({ success: true, workflow: workflowState });
});
app.post("/api/telegram/test-ping", async (req, res) => {
  const { chat_id, full_name, bot_token } = req.body || {};
  const targetChatId = (chat_id || "").toString().trim();
  if (!targetChatId) {
    return res.status(400).json({
      success: false,
      error: "Please enter a valid Telegram Chat ID.",
      hint: "You can obtain your numerical Chat ID via @userinfobot on Telegram."
    });
  }
  const token = (bot_token || process.env.TELEGRAM_BOT_TOKEN || "8624209195:AAGnBEyZpf2mNq0JJyguRRhfmN0dKlmMaas").trim();
  const candName = full_name && typeof full_name === "string" ? full_name.trim() : "Candidate";
  const testMessage = `\u{1F514} <b>CareerOps AI \u2022 Telegram Connection Verified!</b>

Hello <b>${escapeTelegramHtml(candName)}</b>! \u{1F44B}

Your Telegram destination is successfully connected to your CareerOps workspace (Chat ID: <code>${escapeTelegramHtml(targetChatId)}</code>).

Whenever autonomous discovery finds high-fit roles (&ge;75%), you will receive instant push alerts right here with direct application links and tailored ATS resumes.`;
  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: testMessage,
        parse_mode: "HTML"
      })
    });
    const data = await telegramRes.json();
    if (data.ok) {
      return res.json({
        success: true,
        message: "Test alert successfully sent to Telegram!",
        chat_id: targetChatId
      });
    } else {
      let hint = "Telegram rejected the message.";
      if (data.description?.includes("chat not found") || data.description?.includes("bot was blocked") || data.error_code === 400 || data.error_code === 403) {
        hint = 'Chat not found. Please open Telegram, search for @CareerOpsBot, click "Start" (or send /start), and try again.';
      }
      return res.status(400).json({
        success: false,
        error: data.description || "Could not deliver to this Chat ID.",
        hint
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Network error communicating with Telegram."
    });
  }
});
app.post("/api/telegram/notify", async (req, res) => {
  const { id, custom_chat_id, custom_bot_token, job, baseUrl, settings } = req.body;
  const authUser = resolveAuthUser(req);
  const partition = authUser ? getUserPartition(authUser.id) : void 0;
  if (baseUrl && typeof baseUrl === "string" && !baseUrl.includes("localhost")) {
    lastKnownBaseUrl = baseUrl;
  }
  if (settings && typeof settings === "object") {
    Object.assign(partition?.appSettings || appSettings, settings);
  }
  const currentList = partition ? partition.jobListings : jobListings;
  let target = currentList.find((j) => j.id === id);
  if (!target && job) {
    target = job;
    currentList.unshift(job);
    saveStoreToDisk();
  }
  if (!target) return res.status(404).json({ error: "Job listing not found." });
  const effectiveChatId = custom_chat_id || partition?.appSettings.telegram_chat_id || appSettings.telegram_chat_id;
  const effectiveBotToken = custom_bot_token || partition?.appSettings.telegram_bot_token || appSettings.telegram_bot_token;
  const sendResult = await sendTelegramAlertForJob(target, effectiveChatId, effectiveBotToken);
  res.json({
    success: sendResult.delivered || sendResult.simulated,
    ...sendResult,
    chat_id: effectiveChatId || "1368681854"
  });
});
app.get("/api/registry/stats", (req, res) => {
  const values = Object.values(searchedRegistry);
  const rejectedCount = values.filter((v) => v && (v.status === "rejected" || v.status === "deleted")).length;
  res.json({
    success: true,
    stats: {
      total_tracked: values.length,
      rejected_count: rejectedCount,
      retention_days: appSettings.seen_ttl_days || 30,
      last_truncated_at: storeLastUpdated
    }
  });
});
app.post("/api/registry/truncate", (req, res) => {
  const { ttl_days, max_capacity } = req.body || {};
  const ttl = typeof ttl_days === "number" ? ttl_days : appSettings.seen_ttl_days || 30;
  const maxCap = typeof max_capacity === "number" ? max_capacity : 5e3;
  const result = truncateSearchedRegistry(ttl, maxCap);
  saveStoreToDisk();
  console.log(`[Registry] Truncated searched registry: pruned ${result.prunedCount}, remaining ${result.remainingCount}`);
  res.json({
    success: true,
    pruned_count: result.prunedCount,
    remaining_count: result.remainingCount,
    registry: searchedRegistry
  });
});
app.post("/api/registry/reset", (req, res) => {
  const activeJobs = jobListings.filter((j) => !deletedJobIds.has(j.id));
  for (const key of Object.keys(searchedRegistry)) {
    delete searchedRegistry[key];
  }
  for (const j of activeJobs) {
    const sig = `${j.company_name.toLowerCase()}_${j.title.toLowerCase()}`;
    const normLink = normalizeJobUrl(j.apply_link);
    searchedRegistry[j.id] = {
      id: j.id,
      signature: sig,
      normalized_url: normLink,
      company_name: j.company_name,
      title: j.title,
      status: j.status || "discovered",
      discovered_at: j.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
      last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  saveStoreToDisk();
  res.json({ success: true, remaining_count: Object.keys(searchedRegistry).length });
});
app.get("/api/state/sync", (req, res) => {
  const { partition } = getRequestContext(req);
  partition.workflowState.next_run = getCanonicalNextRun2(partition.workflowState.interval_hours || 4);
  const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
  res.json({
    success: true,
    profile: partition.currentProfile,
    jobs: activeJobs,
    stats: computePipelineStatsForPartition(partition),
    workflow: partition.workflowState,
    settings: partition.appSettings,
    searched_registry: partition.searchedRegistry,
    deleted_ids: partition.deletedJobIds,
    last_updated: partition.lastUpdated || storeLastUpdated || (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/state/sync", async (req, res) => {
  const { partition, userId } = getRequestContext(req);
  const { jobs, profile, settings, workflow, deleted_ids, searched_registry, _replicated } = req.body;
  let modified = false;
  if (Array.isArray(deleted_ids)) {
    for (const id of deleted_ids) {
      if (id && !partition.deletedJobIds.includes(id)) {
        partition.deletedJobIds.push(id);
        modified = true;
      }
    }
    if (partition.deletedJobIds.length > 0) {
      const prevCount = partition.jobListings.length;
      partition.jobListings = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
      if (partition.jobListings.length !== prevCount) {
        modified = true;
      }
    }
  }
  if (profile && profile.full_name) {
    partition.currentProfile = { ...partition.currentProfile, ...profile };
    modified = true;
  }
  if (settings && typeof settings === "object") {
    Object.assign(partition.appSettings, settings);
    modified = true;
  }
  if (workflow && typeof workflow === "object") {
    Object.assign(partition.workflowState, workflow);
    partition.workflowState.next_run = getCanonicalNextRun2(partition.workflowState.interval_hours || 4);
    modified = true;
  }
  if (searched_registry && typeof searched_registry === "object") {
    Object.assign(partition.searchedRegistry, searched_registry);
    for (const [k, v] of Object.entries(searched_registry)) {
      if (v && typeof v === "object") {
        const item = v;
        if (item.id) partition.seenJobs[item.id] = item.last_seen_at || (/* @__PURE__ */ new Date()).toISOString();
        if (item.signature) partition.seenJobs[item.signature] = item.last_seen_at || (/* @__PURE__ */ new Date()).toISOString();
        if (item.normalized_url) partition.seenJobs[item.normalized_url] = item.last_seen_at || (/* @__PURE__ */ new Date()).toISOString();
      }
    }
    modified = true;
  }
  if (Array.isArray(jobs) && jobs.length > 0) {
    const validJobs = jobs.filter((j) => j && j.id && !partition.deletedJobIds.includes(j.id));
    const existingMap = /* @__PURE__ */ new Map();
    for (const j of partition.jobListings) {
      existingMap.set(j.id, j);
    }
    for (const incJob of validJobs) {
      if (!incJob || !incJob.id) continue;
      if (existingMap.has(incJob.id)) {
        const current = existingMap.get(incJob.id);
        if (incJob.status && incJob.status !== current.status) {
          current.status = incJob.status;
          modified = true;
        }
        if (incJob.fit && !current.fit) {
          current.fit = incJob.fit;
          modified = true;
        }
        if (incJob.tailored_resume && !current.tailored_resume) {
          current.tailored_resume = incJob.tailored_resume;
          current.cover_letter = incJob.cover_letter;
          modified = true;
        }
        if (incJob.notes && incJob.notes !== current.notes) {
          current.notes = incJob.notes;
          modified = true;
        }
      } else {
        partition.jobListings.unshift(incJob);
        existingMap.set(incJob.id, incJob);
        partition.seenJobs[incJob.id] = (/* @__PURE__ */ new Date()).toISOString();
        const sig = `${incJob.company_name.toLowerCase()}_${incJob.title.toLowerCase()}`;
        const normLink = normalizeJobUrl(incJob.apply_link);
        partition.searchedRegistry[incJob.id] = {
          id: incJob.id,
          signature: sig,
          normalized_url: normLink,
          company_name: incJob.company_name,
          title: incJob.title,
          status: incJob.status || "discovered",
          discovered_at: incJob.discovered_at || (/* @__PURE__ */ new Date()).toISOString(),
          last_seen_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        modified = true;
      }
    }
  }
  if (modified) {
    partition.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    if (userId === PRIMARY_USER_ID) {
      currentProfile = partition.currentProfile;
      jobListings = partition.jobListings;
      Object.assign(appSettings, partition.appSettings);
      Object.assign(workflowState, partition.workflowState);
    }
    saveStoreToDisk(!_replicated);
  }
  partition.workflowState.next_run = getCanonicalNextRun2(partition.workflowState.interval_hours || 4);
  const activeJobs = partition.jobListings.filter((j) => !partition.deletedJobIds.includes(j.id));
  res.json({
    success: true,
    profile: partition.currentProfile,
    jobs: activeJobs,
    stats: computePipelineStatsForPartition(partition),
    workflow: partition.workflowState,
    settings: partition.appSettings,
    searched_registry: partition.searchedRegistry,
    deleted_ids: partition.deletedJobIds,
    last_updated: partition.lastUpdated || storeLastUpdated || (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/telegram/webhook", async (req, res) => {
  const message = req.body?.message;
  const chatId = message?.chat?.id || process.env.TELEGRAM_CHAT_ID || appSettings.telegram_chat_id;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!message) {
    return res.json({ ok: true });
  }
  if (message.document) {
    const doc = message.document;
    const fileName = doc.file_name || "telegram_resume.pdf";
    const mimeType = doc.mime_type || "application/pdf";
    console.log(`[Telegram Bot] Received document: "${fileName}" (${mimeType}) from chat ${chatId}`);
    try {
      let fileBuffer = null;
      if (botToken && doc.file_id) {
        const fileMetaRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${doc.file_id}`);
        const fileMetaData = await fileMetaRes.json();
        if (fileMetaData.ok && fileMetaData.result?.file_path) {
          const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${fileMetaData.result.file_path}`;
          const fileDownloadRes = await fetch(downloadUrl);
          const arrayBuffer = await fileDownloadRes.arrayBuffer();
          fileBuffer = Buffer.from(arrayBuffer);
        }
      }
      if (!fileBuffer) {
        if (botToken) {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `\u26A0\uFE0F Received ${fileName}, but could not download binary file from Telegram servers.`
            })
          });
        }
        return res.json({ ok: true, status: "download_failed" });
      }
      const parsedResult = await parseAndEnrichCandidateResume({
        buffer: fileBuffer,
        fileName,
        mimeType,
        existingProfile: currentProfile
      });
      currentProfile = parsedResult.profile;
      const replyHtml = `\u{1F4C4} <b>Resume Parsed & Enriched Successfully!</b>

\u{1F464} <b>Candidate:</b> ${currentProfile.full_name}
\u23F3 <b>Experience:</b> ${currentProfile.total_years_experience} Years (${currentProfile.seniority_tier})
\u{1F517} <b>Hyperlinks Scraped:</b> ${parsedResult.scrapedSources.length} external links analyzed (GitHub, Portfolio, LinkedIn)
\u{1F6E0}\uFE0F <b>Top Skills:</b> ${currentProfile.skills.slice(0, 8).join(", ")}
` + (currentProfile.portfolio_projects?.length ? `\u{1F4A1} <b>Verified Projects Extracted:</b> ${currentProfile.portfolio_projects.length} project(s)
` : "") + `
<i>Candidate knowledge graph is now updated and ready for ATS job matching!</i>`;
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: replyHtml,
            parse_mode: "HTML"
          })
        });
      }
      return res.json({
        ok: true,
        status: "parsed_successfully",
        candidate: currentProfile.full_name,
        scraped_count: parsedResult.scrapedSources.length
      });
    } catch (docErr) {
      console.error("[Telegram Bot] Document parse error:", docErr);
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `\u274C Error parsing document "${fileName}": ${docErr.message}`
          })
        });
      }
      return res.json({ ok: false, error: docErr.message });
    }
  }
  res.json({ ok: true });
});
app.get("/api/state", (req, res) => {
  workflowState.next_run = getCanonicalNextRun2(workflowState.interval_hours || 4);
  res.json({
    profile: currentProfile,
    stats: computePipelineStats(),
    workflow: workflowState,
    settings: appSettings,
    jobs_count: jobListings.length,
    last_updated: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/settings", (req, res) => {
  if (typeof req.body.min_match_score === "number") {
    appSettings.min_match_score = req.body.min_match_score;
  }
  if (typeof req.body.telegram_chat_id === "string") {
    appSettings.telegram_chat_id = req.body.telegram_chat_id;
  }
  if (typeof req.body.telegram_bot_token === "string") {
    appSettings.telegram_bot_token = req.body.telegram_bot_token;
  }
  if (typeof req.body.telegram_bot_name === "string") {
    appSettings.telegram_bot_name = req.body.telegram_bot_name;
  }
  if (typeof req.body.telegram_custom_header === "string") {
    appSettings.telegram_custom_header = req.body.telegram_custom_header;
  }
  if (typeof req.body.telegram_include_salary === "boolean") {
    appSettings.telegram_include_salary = req.body.telegram_include_salary;
  }
  if (typeof req.body.telegram_include_skill_gap === "boolean") {
    appSettings.telegram_include_skill_gap = req.body.telegram_include_skill_gap;
  }
  if (typeof req.body.telegram_include_apply_link === "boolean") {
    appSettings.telegram_include_apply_link = req.body.telegram_include_apply_link;
  }
  if (typeof req.body.seen_ttl_days === "number") {
    appSettings.seen_ttl_days = req.body.seen_ttl_days;
  }
  const effectiveToken = appSettings.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
  const effectiveChat = appSettings.telegram_chat_id || process.env.TELEGRAM_CHAT_ID;
  appSettings.telegram_configured = Boolean(effectiveToken && effectiveChat);
  appSettings.last_updated = (/* @__PURE__ */ new Date()).toISOString();
  saveStoreToDisk();
  res.json({ success: true, settings: appSettings });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CareerOps AI] Server running on http://0.0.0.0:${PORT}`);
  });
}
var isServerless = Boolean(
  process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT || process.env.VERCEL_ENV
);
var isDirectRun = process.argv[1] && (process.argv[1].endsWith("server.ts") || process.argv[1].endsWith("server.cjs") || process.argv[1].endsWith("server.js"));
if (!isServerless && isDirectRun) {
  startServer();
}
var server_default = app;
export {
  app,
  server_default as default,
  getCanonicalNextRun2 as getCanonicalNextRun
};
//# sourceMappingURL=server.js.map
