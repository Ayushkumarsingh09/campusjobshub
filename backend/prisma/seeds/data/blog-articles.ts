import type { FaqItem, InternalLink } from '../../../src/lib/content/templates';

export interface ArticleSeed {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: 'career-guides' | 'placement-prep';
  contentType: 'career-guide' | 'placement-prep';
  tags: string[];
  keywords: string[];
  sections: { heading: string; body: string }[];
  faq: FaqItem[];
  internalLinks: InternalLink[];
}

export const CAREER_GUIDE_ARTICLES: ArticleSeed[] = [
  {
    slug: 'ats-friendly-resume-format-india-2026',
    title: 'ATS-Friendly Resume Format for Indian Campus Placements (2026)',
    excerpt:
      'Learn how Indian students can format resumes to pass Applicant Tracking Systems used by TCS, Infosys, Amazon, and product companies during campus hiring.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['resume', 'ats', 'campus-hiring', 'fresher-jobs'],
    keywords: ['ATS resume India', 'campus placement resume', 'resume format fresher', 'applicant tracking system'],
    sections: [
      {
        heading: 'Why ATS Matters in Indian Campus Hiring',
        body: `Most large recruiters—including TCS NQT, Infosys, Wipro, Cognizant, and product companies like Amazon and Flipkart—use Applicant Tracking Systems to filter thousands of campus applications before a human recruiter reviews them. An ATS parses your PDF or DOCX, extracts skills, education, and project keywords, and ranks candidates against the job description. If your resume uses complex tables, text boxes, graphics, or non-standard section headings, the parser may fail silently and drop critical information. Students from IITs, NITs, and tier-2 colleges alike lose shortlisting opportunities because of formatting choices, not lack of talent. The goal of an ATS-friendly resume is structural simplicity: single column, standard fonts (Arial, Calibri, or Times New Roman at 10–11 pt), clear section labels like EDUCATION and PROJECTS, and bullet points starting with action verbs. Avoid headers/footers for contact details—place phone, email, and LinkedIn at the top of the body text instead.`,
      },
      {
        heading: 'Essential Sections for Fresher Resumes',
        body: `Indian campus resumes should fit one page for BTech graduates and two pages maximum for MTech or dual-degree candidates. Required sections include Contact Information, Education (with CGPA if above 7.0 or if company threshold requires disclosure), Technical Skills grouped by category (Languages, Frameworks, Tools), Projects with measurable outcomes, Internship Experience if any, Coding Profiles (LeetCode, CodeChef, GitHub links with handle names), Achievements (hackathons, scholarships), and optionally Positions of Responsibility for leadership signals. Do not include photographs unless explicitly required—most IT employers discourage them for bias reduction. Replace objective statements with a two-line Professional Summary targeting your role, e.g., "Final-year CSE student seeking SDE roles with strengths in Java, DSA, and backend development." Mirror keywords from target job descriptions naturally without keyword stuffing that reads unnaturally to human reviewers.`,
      },
      {
        heading: 'Common ATS Mistakes Indian Students Make',
        body: `Canva-designed colorful resumes look attractive but often break parsers. Using "Curriculum Vitae" as the file name instead of FirstName_LastName_Resume.pdf reduces professionalism. Listing skills without context—simply writing "Java, Python, ML" in a cloud shape graphic—provides no ranking signal. Copying project descriptions from seniors without updating tech stack keywords mismatches ATS scoring for your target role. Submitting image-based PDFs exported from Photoshop makes text non-selectable, causing zero parsed content. Including irrelevant personal details like marital status, religion, or full address violates modern HR best practices and wastes space. For multi-page resumes, never split a project section across pages awkwardly. When applying through company portals, upload the same ATS-optimized version rather than a shortened LinkedIn export missing project depth.`,
      },
      {
        heading: 'Checklist Before You Submit',
        body: `Run your resume through CampusJobsHub ATS checker or free tools like Jobscan with a sample job description. Verify text is selectable by highlighting in PDF viewer. Confirm phone number includes +91 country code for international recruiters. Use consistent date formats (Aug 2022 – May 2026). Quantify project impact: "Reduced API latency by 30% using Redis caching" beats "Worked on API optimization." Save as PDF unless portal specifies DOCX. Tailor skills order to match each company's stack—Flipkart applications should lead with Java and DSA, while frontend roles emphasize React and TypeScript. Finally, ask a placed senior to review for clarity before mass applying during placement season.`,
      },
    ],
    faq: [
      { question: 'Should I include CGPA if it is below 7?', answer: 'If below company cutoff, omit only if policy allows; otherwise include honestly—recruiters verify transcripts.' },
      { question: 'Is two-column resume ever acceptable?', answer: 'Rarely for campus IT roles. Single column maximizes ATS compatibility across Indian recruiters.' },
      { question: 'Do product companies use ATS?', answer: 'Yes—Amazon, Microsoft, and Google campus portals parse resumes before interview shortlisting.' },
    ],
    internalLinks: [
      { title: 'Resume ATS Checker', href: '/resume/ats-checker' },
      { title: 'TCS Campus Guide', href: '/blog/tcs-campus-hiring-guide-2026' },
      { title: 'Placement Preparation', href: '/blog/campus-placement-preparation-guide-2026' },
    ],
  },
  {
    slug: 'salary-negotiation-first-job-india',
    title: 'Salary Negotiation for Your First Job in India: A Campus Graduate Guide',
    excerpt:
      'Practical salary negotiation strategies for Indian campus hires at IT services, product, and startup companies—including CTC breakdown and competing offers.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['salary-negotiation', 'offer-letter', 'campus-hiring', 'fresher-jobs'],
    keywords: ['salary negotiation fresher India', 'campus offer negotiation', 'CTC breakdown', 'joining bonus'],
    sections: [
      {
        heading: 'Understanding CTC Before You Negotiate',
        body: `Indian offer letters quote Cost to Company (CTC) which includes basic salary, HRA, special allowances, provident fund, gratuity, insurance, and variable pay. A ₹10 LPA offer at TCS Digital may yield ₹65,000–₹70,000 monthly in-hand, while ₹10 LPA at a startup with higher basic pay yields different tax outcomes. Product companies add joining bonus (paid in installments), relocation allowance, and RSUs vesting over four years—Amazon and Microsoft packages look similar on paper but cash flow differs significantly. Before negotiating, build a spreadsheet separating fixed versus variable components. Ask seniors about in-hand estimates for your specific offer band. Never compare offers using CTC alone—compare total guaranteed cash in year one, learning opportunity, and role team quality.`,
      },
      {
        heading: 'When Negotiation Is Appropriate for Freshers',
        body: `Mass recruiters like TCS, Infosys, and Wipro typically offer fixed campus bands by NQT score or college tier with zero negotiation room—accept or decline. Product companies, fintech startups (Razorpay, PhonePe), and premium IT digital tracks sometimes have flexibility for competing offers, exceptional coding profiles, or rare skill gaps. Negotiate only after receiving written offer, never during interviews. Valid leverage includes higher competing CTC from equivalent-tier company, published internship return offer, or specialized skills (ML, security clearance). Avoid negotiating using unverified Glassdoor numbers. HR expects professional, data-backed conversations—not ultimatums. If you have single offer from dream company with moderate pay, requesting 10–15% increase or higher joining bonus works better than threatening rejection.`,
      },
      {
        heading: 'Scripts and Tactics That Work',
        body: `Email template: "Thank you for the SDE offer at ₹18 LPA. I am excited about the team. I have a competing offer at ₹21 LPA from [Company]. Given my internship experience in distributed systems, is there flexibility to improve the package or signing bonus?" Phone follow-up with recruiter within 48 hours. Ask about role level bump (SDE-1 vs SDE-2 entry) if salary fixed. Request faster RSU vesting cliff only at senior levels—usually unavailable for freshers. Negotiate joining date for GATE exam or family commitments separately from salary. Always get revised offer letter in writing before resigning from other processes. If HR says no, ask "Are there non-monetary benefits such as learning budget or early performance review?" Document all commitments.`,
      },
      {
        heading: 'Mistakes That Cost Offers',
        body: `Fabricating competing offers destroys credibility—HR verifies informally within networks. Negotiating aggressively with sole mass recruiter offer wastes relationship capital. Delaying acceptance beyond deadline without communication leads to offer withdrawal. Comparing Flipkart ESOP paper value to Amazon RSU without liquidity understanding misguides decisions. Accepting verbal promises not in offer letter about team choice or location fails later. Share negotiation outcomes respectfully with placement cell to maintain college recruiter relationships. Remember: first job salary matters less than team, mentorship, and skill growth over three years—optimize holistically.`,
      },
    ],
    faq: [
      { question: 'Can I negotiate TCS Digital salary?', answer: 'Generally no—bands tied to NQT performance. Focus on track selection instead.' },
      { question: 'Should I tell HR about lower-paying dream company?', answer: 'Emphasize role fit and competing higher pay, not emotional preference alone.' },
      { question: 'Is joining bonus negotiable?', answer: 'Often yes at product companies when base salary bands are rigid.' },
    ],
    internalLinks: [
      { title: 'Google Salary Guide', href: '/blog/google-campus-hiring-guide-2026' },
      { title: 'Offer Letter Checklist', href: '/blog/offer-letter-verification-checklist-india' },
    ],
  },
  {
    slug: 'group-discussion-tips-campus-placement',
    title: 'Group Discussion Tips for Campus Placement: Score High in GD Rounds',
    excerpt:
      'Master GD rounds at Deloitte, Capgemini, and mass recruiters with structured speaking frameworks, topic preparation, and body language tips.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['group-discussion', 'hr-interview', 'placement-prep', 'on-campus'],
    keywords: ['group discussion tips', 'GD campus placement', 'GD topics India', 'consulting GD round'],
    sections: [
      {
        heading: 'Purpose of GD in Campus Hiring',
        body: `Group Discussion evaluates communication, logical reasoning, teamwork, and composure under pressure—especially at Deloitte, Accenture, Capgemini, and legacy IT firms conducting GD before technical rounds. Panels of 8–12 candidates receive topics ranging from abstract ("Hard work vs Smart work") to current affairs ("Impact of AI on Indian jobs") and case scenarios ("Should work from home continue?"). Observers note who initiates, who builds on others' points, who interrupts, and who summarizes. Unlike debate competitions, GD rewards collaborative consensus-building. Indian placement cells often run mock GDs—participate actively even if uncomfortable speaking English. Fluency matters less than clarity and structure.`,
      },
      {
        heading: 'Framework for Strong Contributions',
        body: `Use PREP: Point, Reason, Example, Point restated. If initiating, define the topic scope in 30 seconds and invite others. If joining mid-discussion, acknowledge previous speaker: "Building on Priya's point about skilling..." Avoid dominating airtime beyond 20% in 15-minute GD. Bring data when possible: "NASSCOM reports 1.4 million tech hires in FY24..." Summarize every 5 minutes if group loses direction—shows leadership. Maintain eye contact with group, not only panel. Sit upright, avoid aggressive gestures. If topic is unfamiliar, listen first two minutes, then contribute quality over quantity. Never personally attack classmates—panels penalize hostility heavily.`,
      },
      {
        heading: 'High-Frequency GD Topics to Prepare',
        body: `Prepare 2-minute talking points for: Digital India and employment, Startup vs MNC careers, Remote work productivity, Environmental sustainability in IT, Women in STEM, Cryptocurrency regulation, Education policy NEP 2020, Social media impact on youth, Make in India for electronics, and Ethics in AI. Read The Hindu Business Line editorials weekly during placement semester. Practice impromptu speaking clubs or Toastmasters chapters on campus. Record mock sessions to reduce filler words ("actually," "basically"). Prepare both affirmative and balanced views—panels may assign devil's advocate roles.`,
      },
      {
        heading: 'After GD: What Panels Evaluate',
        body: `Scoring rubrics typically include content relevance, communication clarity, listening skills, body language, and leadership/initiative balance. Silent participants rarely advance unless exceptionally strong elsewhere. Over-aggressive dominators also fail. Thank panel when exiting. Reflect with peers on improvement areas immediately while memory fresh. GD performance correlates with client-facing consulting roles—take it seriously even if your primary goal is coding jobs at product firms that skip GD.`,
      },
    ],
    faq: [
      { question: 'Should I always initiate GD?', answer: 'Initiating helps if done well; forced weak opening hurts. Quality entry mid-discussion is equally valid.' },
      { question: 'English fluency mandatory?', answer: 'Clear communication required; minor accent acceptable if ideas structured and audible.' },
      { question: 'Do product companies conduct GD?', answer: 'Rarely—mostly consulting and mass IT campus drives include GD.' },
    ],
    internalLinks: [
      { title: 'Deloitte Hiring Guide', href: '/blog/deloitte-campus-hiring-guide-2026' },
      { title: 'HR Interview Tips', href: '/blog/hr-interview-questions-campus-placement' },
    ],
  },
  {
    slug: 'quantitative-aptitude-preparation-guide',
    title: 'Quantitative Aptitude Preparation for Campus Placement Exams',
    excerpt:
      'Topic-wise plan for TCS NQT, Infosys, Wipro, and AMCAT quantitative sections with book recommendations and daily practice schedules.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['aptitude', 'placement-prep', 'on-campus', 'fresher-jobs'],
    keywords: ['quantitative aptitude campus', 'TCS NQT maths', 'placement aptitude preparation', 'time and work problems'],
    sections: [
      {
        heading: 'Syllabus Overview for Major Recruiters',
        body: `Quantitative aptitude for Indian campus tests covers arithmetic (percentages, profit-loss, time-work, pipes-cisterns, ratios), algebra (equations, progressions), geometry and mensuration, number systems, permutations-combinations, probability, and data interpretation. TCS NQT advanced section adds higher difficulty for Digital track filtering. Infosys and Wipro emphasize speed arithmetic under 60-second per question targets. AMCAT QUANT repeats pattern-based questions favoring accuracy over trick mastery. CAT-level preparation is overkill; focus placement-specific books like "Quantitative Aptitude by R.S. Aggarwal" and "Fast Track Objective Arithmetic by Rajesh Verma." Allocate 60–90 minutes daily for 8 weeks before placement season.`,
      },
      {
        heading: 'Topic Priority and Time Allocation',
        body: `Week 1–2: Percentages, ratios, averages—foundation for DI. Week 3: Time, speed, distance and time-work—highest frequency. Week 4: Number systems, LCM-HCF, remainders. Week 5: Permutation-combination and probability basics. Week 6: Geometry triangles, circles, coordinate basics. Week 7: Data interpretation tables and charts. Week 8: Mixed mock tests simulating NQT timing. Maintain formula sheet handwritten for revision. Use India's placement preparation platforms and previous year papers shared by seniors. Identify weak topics through error log notebook—revisit every wrong question twice.`,
      },
      {
        heading: 'Exam Strategy During Online Tests',
        body: `Read all questions in section first 30 seconds marking easy ones. Attempt easy questions before medium—negative marking varies by test (TCS NQT patterns change annually—verify current year rules). Use rough paper systematically numbering problems. Approximation valid for options far apart. Skip lengthy geometry if stuck beyond 90 seconds—return if time permits. Proctoring software restricts tab switching—practice full-screen mocks. Ensure calculator policy compliance—most tests disallow calculators, strengthening mental math drills for multiplication tables and fraction conversions.`,
      },
      {
        heading: 'Building Speed Without Sacrificing Accuracy',
        body: `Daily 20-question timed drills build muscle memory. Learn square roots till 30 and cube roots till 20. Vedic math techniques for multiplication help marginally—don't over-invest. Group study solving same paper competitively identifies faster methods. Track accuracy percentage target above 85% before increasing speed. Sleep adequately before test day—quant performance drops sharply with fatigue common during back-to-back placement drives in December.`,
      },
    ],
    faq: [
      { question: 'Calculator allowed in TCS NQT?', answer: 'Typically no—confirm current year NQT guidelines on official portal.' },
      { question: 'Best book for beginners?', answer: 'R.S. Aggarwal Quantitative Aptitude covers breadth adequate for mass recruiters.' },
      { question: 'How many hours daily?', answer: '90 minutes focused practice for 8 weeks minimum during prep semester.' },
    ],
    internalLinks: [
      { title: 'TCS NQT Guide', href: '/blog/tcs-campus-hiring-guide-2026' },
      { title: 'Logical Reasoning Guide', href: '/blog/logical-reasoning-campus-placement' },
    ],
  },
  {
    slug: 'logical-reasoning-campus-placement',
    title: 'Logical Reasoning for Campus Placement: Patterns, Syllogisms, and Puzzles',
    excerpt:
      'Complete logical reasoning preparation for Infosys, Cognizant, Accenture, and AMCAT with seating arrangement and blood relation techniques.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['aptitude', 'placement-prep', 'on-campus'],
    keywords: ['logical reasoning placement', 'seating arrangement tricks', 'syllogism campus test'],
    sections: [
      {
        heading: 'Core Logical Reasoning Topics',
        body: `Campus logical reasoning tests include coding-decoding, blood relations, directions, ranking orders, syllogisms, statement-conclusion, analogies, series completion, puzzles, seating arrangements (linear, circular), and input-output patterns. Difficulty moderate compared to CAT LRDI—speed and pattern recognition dominate. Infosys online test dedicates significant section weight to LR. Accenture cognitive assessment combines LR with abstract reasoning diagrams.`,
      },
      {
        heading: 'Seating Arrangement Methodology',
        body: `Draw diagrams immediately—never solve seating mentally. For circular arrangements facing center versus outward, mark positions clearly. Linear arrangements with fixed ends constrain possibilities quickly. Clue chaining: connect definitive clues first before hypothetical branches. Practice 5 seating puzzles daily from previous AMCAT papers. Time limit: 4–6 minutes per puzzle at proficiency.`,
      },
      {
        heading: 'Syllogism and Statement Logic',
        body: `Use Venn diagram method for three-statement syllogisms. Learn valid syllogism rules (AAA, EAE patterns) or use elimination from options when stuck. Statement-assumption questions require distinguishing necessary versus sufficient assumptions—avoid extreme language answers ("always," "never") unless logically forced.`,
      },
      {
        heading: 'Preparation Schedule Integration',
        body: `Pair LR practice with quantitative aptitude alternate days. Full-length mock every Sunday final month before placements. Review incorrect puzzles categorizing error type: misread clue, diagram error, or time pressure slip. LR improvement plateaus without timed practice—untimed solving gives false confidence.`,
      },
    ],
    faq: [
      { question: 'Is CAT LR material useful?', answer: 'Selectively—campus LR simpler; CAT puzzles help advanced practice but may overwhelm initially.' },
      { question: 'Blood relations shortcuts?', answer: 'Use generation-based tree notation (+ male, - female) consistently.' },
    ],
    internalLinks: [
      { title: 'Quantitative Aptitude Guide', href: '/blog/quantitative-aptitude-preparation-guide' },
      { title: 'Accenture Guide', href: '/blog/accenture-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'branch-selection-cse-vs-it-placement',
    title: 'CSE vs IT vs ECE: Branch Selection Impact on Campus Placements',
    excerpt:
      'Compare placement outcomes across engineering branches in India and strategies for non-CSE students targeting software roles.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['branch-selection', 'campus-hiring', 'fresher-jobs'],
    keywords: ['CSE vs IT placement', 'ECE software jobs', 'branch selection engineering'],
    sections: [
      {
        heading: 'Placement Statistics Reality Check',
        body: `Computer Science and IT branches typically see highest placement percentages at Indian engineering colleges with median packages exceeding mechanical or civil branches. However, tier-1 college ECE graduates frequently join software roles at Microsoft, Qualcomm hybrid roles, or embedded teams at Intel. Branch eligibility lists on company portals matter—some product companies restrict to CS/IT/ECE while mass IT hires all branches. Your branch affects initial shortlisting, not long-term ceiling—many successful engineers transitioned via self-taught coding.`,
      },
      {
        heading: 'Strategy for Non-CSE Students',
        body: `Start coding first year—delay puts you behind CS curriculum integration. Build visible GitHub portfolio compensating transcript branch label. Target companies hiring all branches: TCS, Infosys, Wipro, Cognizant, Capgemini. Pursue minors or online certifications in CS fundamentals. Participate hackathons for network and proof of skill. Apply off-campus to Zoho and startups ignoring college tier and branch. Highlight quantitative strengths from core branch when relevant (signal processing for ML roles from ECE).`,
      },
      {
        heading: 'When Branch Specialization Helps',
        body: `ECE advantageous for embedded, VLSI, telecom at Tech Mahindra and semiconductor firms. IT branch curriculum aligned with industry software practices at some state universities. CS provides deepest algorithms and systems exposure preferred by Google and Amazon. Dual degree CS+MBA opens consulting paths at Deloitte. Choose branch based on genuine interest—forced CS with weak programming struggles in interviews despite branch label.`,
      },
      {
        heading: 'Decision Framework for First-Year Students',
        body: `Assess college's branch change policy and historical placement reports by branch. Talk to three seniors per branch about honest outcomes. If passionate about core engineering, pursue it with software minor rather than resenting CS. If solely placement-motivated and enjoy logic, CS/IT rational choice at average colleges.`,
      },
    ],
    faq: [
      { question: 'Can mechanical engineer get software job?', answer: 'Yes through mass hiring and off-campus skill demonstration—harder initial path but proven repeatedly.' },
      { question: 'Do companies verify branch?', answer: 'Yes via degree transcripts during background verification.' },
    ],
    internalLinks: [
      { title: 'Off-Campus Hiring Guide', href: '/blog/off-campus-job-search-strategy-india' },
      { title: 'Zoho Hiring Guide', href: '/blog/zoho-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'linkedin-profile-optimization-freshers',
    title: 'LinkedIn Profile Optimization for Freshers Seeking Campus and Off-Campus Jobs',
    excerpt:
      'Step-by-step LinkedIn setup for Indian engineering students to attract recruiters from product companies and staffing teams.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['resume', 'off-campus', 'fresher-jobs'],
    keywords: ['LinkedIn fresher India', 'LinkedIn campus placement', 'recruiter LinkedIn tips'],
    sections: [
      {
        heading: 'Headline and About Section',
        body: `Replace default "Student at XYZ University" with "Final Year CSE | Aspiring SDE | Java, DSA, Spring Boot | Open to 2026 Campus & Intern Roles." About section expands in 3 short paragraphs: technical skills and projects, internship or hackathon achievements, and career goal with location preference (Bangalore, Hyderabad, Pune). Include email for easy outreach. Write in first person professionally.`,
      },
      {
        heading: 'Experience, Projects, and Skills',
        body: `Add projects as Experience entries with bullet accomplishments mirroring resume metrics. Skills section: pin top 5 skills aligned to target roles—recruiters filter by Java, Python, React. Request endorsements from classmates sparingly; focus skill assessments LinkedIn offers. Upload portfolio links and LeetCode profile in Featured section.`,
      },
      {
        heading: 'Networking Without Being Pushy',
        body: `Connect with alumni at target companies using personalized note referencing shared college. Follow company pages and engage thoughtfully with engineering content. Message recruiters after applying on careers portal referencing application ID. Join LinkedIn groups for campus placement and Indian developer communities. Post weekly learning takeaways demonstrating growth mindset—visibility attracts inbound recruiter messages.`,
      },
      {
        heading: 'Privacy and Placement Cell Coordination',
        body: `Hide "Open to Work" from current employer if interning—use recruiters-only visibility mode. Coordinate with placement cell policies some colleges restrict off-campus LinkedIn outreach before specific dates. Keep profile consistent with resume to avoid background check discrepancies.`,
      },
    ],
    faq: [
      { question: 'Professional photo mandatory?', answer: 'Recommended—profiles with photos receive more views; use formal attire plain background.' },
      { question: 'Should freshmen create LinkedIn?', answer: 'Yes—early profile builds network compounding benefit by final year.' },
    ],
    internalLinks: [
      { title: 'Resume Guide', href: '/blog/ats-friendly-resume-format-india-2026' },
      { title: 'Off-Campus Strategy', href: '/blog/off-campus-job-search-strategy-india' },
    ],
  },
  {
    slug: 'technical-interview-dsa-roadmap',
    title: 'DSA Roadmap for Technical Interviews: 16-Week Campus Preparation Plan',
    excerpt:
      'Structured data structures and algorithms plan covering arrays through graphs for Amazon, Flipkart, Microsoft, and startup interviews.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['dsa', 'coding-interview', 'technical-interview', 'placement-prep'],
    keywords: ['DSA roadmap campus', 'LeetCode preparation India', 'coding interview plan'],
    sections: [
      {
        heading: 'Weeks 1–4: Foundations',
        body: `Master arrays, strings, two pointers, sliding window, hash maps, and basic sorting. Solve 50 easy LeetCode problems tagged frequently in Indian interviews. Learn time-space complexity analysis for every solution. Use Java or C++ consistently—switching languages mid-prep wastes time.`,
      },
      {
        heading: 'Weeks 5–8: Core Structures',
        body: `Linked lists, stacks, queues, binary trees, BST operations, tree traversals BFS/DFS. Target 40 medium problems. Implement trie and heap from scratch once for conceptual clarity. Weekly mock interview with peer explaining approach aloud.`,
      },
      {
        heading: 'Weeks 9–12: Advanced Patterns',
        body: `Graphs, topological sort, shortest path basics, dynamic programming classic problems (knapsack, LCS, coin change). 30 medium-hard problems. Review company-specific tagged questions on LeetCode discuss sections for Amazon and Google India.`,
      },
      {
        heading: 'Weeks 13–16: Interview Simulation',
        body: `Alternate daily timed random medium problem with full mock interviews weekends. System design lite reading for scalable systems primer. Rest two days before actual interview—light review only avoiding new topics.`,
      },
    ],
    faq: [
      { question: 'How many LeetCode problems sufficient?', answer: '150–200 curated problems with depth beats 500 shallow solves.' },
      { question: 'Java or C++ for interviews?', answer: 'Either works—use language taught in college curriculum for fluency.' },
    ],
    internalLinks: [
      { title: 'Amazon Interview Guide', href: '/blog/amazon-campus-hiring-guide-2026' },
      { title: 'System Design Basics', href: '/blog/system-design-basics-freshers-india' },
    ],
  },
  {
    slug: 'system-design-basics-freshers-india',
    title: 'System Design Basics for Freshers: What Indian Campus Interviews Actually Ask',
    excerpt:
      'High-level system design expectations at Amazon, Flipkart, Razorpay, and Microsoft for new graduate engineers in India.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['system-design', 'technical-interview', 'coding-interview'],
    keywords: ['system design fresher', 'campus system design interview', 'URL shortener design'],
    sections: [
      {
        heading: 'Scope for Campus Hires',
        body: `Freshers not expected to design Twitter at scale—interviewers assess structured thinking, requirement clarification, API design, database choice, and basic scaling concepts. Common prompts: URL shortener, parking lot, chat app, news feed simplified, rate limiter. Focus clarity over buzzwords.`,
      },
      {
        heading: 'Framework: RESHADED Approach',
        body: `Requirements functional/non-functional, Estimation rough QPS/storage, Storage schema, High-level design components, API endpoints, Detailed deep dive one component, Evaluation bottlenecks. Draw boxes: clients, load balancer, app servers, database, cache. Discuss SQL vs NoSQL trade-offs relevant to use case.`,
      },
      {
        heading: 'Indian Context Examples',
        body: `Design UPI payment flow idempotency at Razorpay interviews. Flipkart may ask inventory reservation during sale. Amazon discusses cart service consistency. Relate CAP theorem loosely without over-quoting jargon without understanding.`,
      },
      {
        heading: 'Resources and Practice',
        body: `Read "System Design Primer" GitHub repository free. Watch conceptual videos on load balancing and caching. Pair with senior mock for feedback on communication clarity. Don't memorize architectures—adapt frameworks per question.`,
      },
    ],
    faq: [
      { question: 'System design in TCS interview?', answer: 'Rare for standard ASE—occasional for Digital premium track.' },
      { question: 'Microservices knowledge needed?', answer: 'Conceptual awareness sufficient; deep Kubernetes not expected for freshers.' },
    ],
    internalLinks: [
      { title: 'DSA Roadmap', href: '/blog/technical-interview-dsa-roadmap' },
      { title: 'Flipkart Guide', href: '/blog/flipkart-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'hr-interview-questions-campus-placement',
    title: 'HR Interview Questions for Campus Placement: STAR Answers That Work',
    excerpt:
      'Prepare tell me about yourself, strengths, weaknesses, and situational HR questions for Indian campus recruitment final rounds.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['hr-interview', 'on-campus', 'placement-prep'],
    keywords: ['HR interview campus', 'tell me about yourself', 'STAR method placement'],
    sections: [
      {
        heading: 'Universal HR Questions',
        body: `Prepare polished answers for: Tell me about yourself (90 seconds chronological), Why this company, Strengths and weaknesses with improvement actions, Where do you see yourself in 5 years realistic for tech IC path, Describe challenge overcome, Team conflict resolution, Why should we hire you differentiators, Questions for interviewer about team and growth.`,
      },
      {
        heading: 'STAR Method Structure',
        body: `Situation, Task, Action, Result for behavioral questions. Example weakness: "I overcommitted to club events affecting grades; now use calendar blocking and declined optional events raising CGPA from 7.2 to 8.1." Quantify results whenever possible. Avoid cliché weaknesses ("I'm perfectionist") without genuine reflection.`,
      },
      {
        heading: 'Company-Specific HR Prep',
        body: `Amazon Leadership Principles mapped stories mandatory. Microsoft growth mindset examples. TCS/Wipro relocation and shift flexibility questions answered honestly. Deloitte case interest and travel willingness. Research company values from careers site before HR round same day as technical.`,
      },
      {
        heading: 'Logistics and Professionalism',
        body: `Dress formal business attire for in-person drives. Virtual: plain background, eye contact camera, test audio 10 minutes early. Carry originals and photocopies organized. Thank you email optional but appreciated at consulting firms.`,
      },
    ],
    faq: [
      { question: 'Can I mention salary expectation in HR?', answer: 'If asked, provide researched range; otherwise defer until offer stage professionally.' },
      { question: 'English not fluent?', answer: 'Slow clear speech beats fast unclear—practice recorded mock answers.' },
    ],
    internalLinks: [
      { title: 'Amazon LP Guide', href: '/blog/amazon-campus-hiring-guide-2026' },
      { title: 'GD Tips', href: '/blog/group-discussion-tips-campus-placement' },
    ],
  },
  {
    slug: 'off-campus-job-search-strategy-india',
    title: 'Off-Campus Job Search Strategy in India When Placement Cell Offers Are Limited',
    excerpt:
      'Actionable off-campus hiring playbook using referrals, job portals, hackathons, and direct applications for tier-2 and tier-3 graduates.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['off-campus', 'fresher-jobs', 'coding-interview'],
    keywords: ['off campus hiring India', 'tier 2 college jobs', 'referral jobs fresher'],
    sections: [
      {
        heading: 'Channels That Work',
        body: `Company careers portals (Google, Microsoft, Amazon off-campus loops), LinkedIn job alerts, Instahyre and Cutshort for startups, Hackathons (Flipkart Grid, Amazon HackOn), Referrals from alumni, Twitter/X engineering hiring threads, Open source contributions visible to hiring managers, Zoho and Thoughtworks skill-based hiring ignoring tier.`,
      },
      {
        heading: 'Weekly Application Discipline',
        body: `Track spreadsheet: company, role, date applied, status, follow-up date. Apply 10 quality tailored applications weekly versus 100 generic spam. Customize resume keywords per JD. Follow up politely after 10 business days. Join discord communities for off-campus peer support and referral sharing ethically.`,
      },
      {
        heading: 'Building Proof of Skill',
        body: `Public GitHub with README demos, blog posts explaining projects, competitive programming rating if strong, Kaggle notebooks for data roles, AWS/Azure free tier deployment screenshots. Portfolio links in every application.`,
      },
      {
        heading: 'Managing Rejection Psychology',
        body: `Off-campus conversion rates lower—expect 50+ rejections before offer. Each interview is practice. Debrief failures writing improvement notes. Balance with degree completion and mental health—sustainable marathon not sprint.`,
      },
    ],
    faq: [
      { question: 'Best portal for startups?', answer: 'Instahyre, AngelList, and company career pages directly.' },
      { question: 'Referral how to ask?', answer: 'Share resume + specific role link + brief skill summary—make referring easy for employee.' },
    ],
    internalLinks: [
      { title: 'LinkedIn Guide', href: '/blog/linkedin-profile-optimization-freshers' },
      { title: 'Zoho Guide', href: '/blog/zoho-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'offer-letter-verification-checklist-india',
    title: 'Offer Letter Verification Checklist for Indian Campus Hires',
    excerpt:
      'Verify CTC components, joining dates, bonds, and background check clauses before accepting campus placement offers.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['offer-letter', 'salary-negotiation', 'campus-hiring'],
    keywords: ['offer letter verification', 'joining date campus', 'service agreement IT'],
    sections: [
      {
        heading: 'Document Authenticity',
        body: `Confirm offer from official company email domain not Gmail/Yahoo. Cross-check with placement cell company contact. Verify digital signature or letterhead authenticity. Beware fraud offers demanding payment for training—legitimate employers never charge joining fees.`,
      },
      {
        heading: 'Compensation Breakdown Review',
        body: `Match verbal discussion components: basic, HRA, special allowance, bonus, stock grants vesting schedule, joining bonus payout months, relocation clause, probation period salary same or reduced. Calculate approximate in-hand using online salary calculators for metro city.`,
      },
      {
        heading: 'Legal Clauses',
        body: `Service agreement duration and penalty clauses common in IT services—quantify financial impact if leaving early. Notice period post probation typically 90 days product vs 30–90 services. Non-compete rarely enforceable broadly in India but read anyway. Joining date alignment with degree completion certificate availability.`,
      },
      {
        heading: 'Acceptance Process',
        body: `Accept within deadline via portal with screenshot confirmation. Inform placement cell per policy single offer rule. Decline other processes professionally emailing recruiters. Request revised letter if discrepancies before accepting.`,
      },
    ],
    faq: [
      { question: 'Verbal offer binding?', answer: 'Insist written offer—verbal alone insufficient for resignation decisions.' },
      { question: 'Can company revoke offer?', answer: 'Rare but possible economic downturn—keep backup until joining day historically.' },
    ],
    internalLinks: [
      { title: 'Salary Negotiation', href: '/blog/salary-negotiation-first-job-india' },
      { title: 'TCS Guide', href: '/blog/tcs-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'coding-profile-building-leetcode-codechef',
    title: 'Building a Coding Profile on LeetCode and CodeChef for Campus Shortlisting',
    excerpt:
      'How Indian recruiters use competitive programming profiles alongside CGPA for Digital track and product company shortlists.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['coding-interview', 'dsa', 'off-campus'],
    keywords: ['LeetCode profile campus', 'CodeChef rating placement', 'competitive programming jobs'],
    sections: [
      {
        heading: 'Why Profiles Matter',
        body: `TCS Digital and Infosys Power Programmer use coding scores. Amazon and Flipkart recruiters browse LeetCode profiles during tie-break shortlists. CodeChef 3-star+ signals algorithmic strength at startups. Profiles don't replace interviews but open doors especially off-campus.`,
      },
      {
        heading: 'LeetCode Strategy',
        body: `Solve company tagged lists. Maintain streak for discipline not vanity. Write clean submissions with commented complexity in discuss posts optionally. Target 200 problems curated list over random easy spam.`,
      },
      {
        heading: 'CodeChef and Codeforces',
        body: `Participate long contests monthly building rating gradually. Upsolve problems post contest learning editorial patterns. 1600+ Codeforces rating impressive for campus seniors targeting product firms.`,
      },
      {
        heading: 'Presentation on Resume',
        body: `Include handle links not just ratings—recruiters click verifying activity recency. Mention notable contest ranks if top 10 percentile nationally. Balance time with academics and projects—profiles supplement don't replace holistic candidacy.`,
      },
    ],
    faq: [
      { question: 'Minimum LeetCode count?', answer: 'Quality 150 problems beats quantity 500 without revision.' },
      { question: 'Profile needed for TCS Ninja?', answer: 'Not required—NQT aptitude primary filter for standard track.' },
    ],
    internalLinks: [
      { title: 'DSA Roadmap', href: '/blog/technical-interview-dsa-roadmap' },
      { title: 'Infosys Guide', href: '/blog/infosys-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'internship-to-ppo-strategy',
    title: 'Internship to PPO Strategy: Converting Summer Internships into Full-Time Offers',
    excerpt:
      'Maximize pre-placement offer conversion at Microsoft, Amazon, Goldman Sachs, and Indian startups through performance and networking.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['internship', 'on-campus', 'fresher-jobs'],
    keywords: ['PPO internship India', 'return offer Microsoft', 'internship conversion tips'],
    sections: [
      {
        heading: 'Setting Expectations Early',
        body: `Clarify PPO evaluation criteria with manager week one. Understand deliverables timeline and mentorship availability. Document weekly progress in shared notes visible to team.`,
      },
      {
        heading: 'Execution Excellence',
        body: `Ship code meeting production standards with tests. Ask questions after self-attempt 30 minutes—shows initiative not helplessness. Participate standups punctually. Request mid-internship feedback correcting course early.`,
      },
      {
        heading: 'Relationship Building',
        body: `Connect cross-functional teammates understanding product context. Attend company learning sessions. Express gratitude professionally—arrogance common failure mode among talented interns.`,
      },
      {
        heading: 'If PPO Not Offered',
        body: `Request feedback letter or LinkedIn recommendation. Maintain contact for future referral. Leverage brand name internship on resume for full-time campus cycle elsewhere.`,
      },
    ],
    faq: [
      { question: 'PPO percentage at product companies?', answer: 'Varies 50–90% by year and team—never guaranteed contractually unless stated.' },
      { question: 'Virtual internship PPO?', answer: 'Yes—performance metrics adapt to remote delivery outcomes.' },
    ],
    internalLinks: [
      { title: 'Microsoft Guide', href: '/blog/microsoft-campus-hiring-guide-2026' },
      { title: 'Amazon Guide', href: '/blog/amazon-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'verbal-ability-campus-tests',
    title: 'Verbal Ability for Campus Placement: RC, Grammar, and Para Jumbles',
    excerpt:
      'Improve reading comprehension and English grammar scores for TCS, Infosys, Cognizant, and Wipro online assessments.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['aptitude', 'placement-prep', 'on-campus'],
    keywords: ['verbal ability placement', 'reading comprehension campus', 'para jumble tricks'],
    sections: [
      {
        heading: 'Reading Comprehension Technique',
        body: `Skim questions first locating keywords before reading passage deeply. Passages 300–500 words on business, technology, social topics. Practice eliminating extreme answer options. Time limit 8–10 minutes per passage pair.`,
      },
      {
        heading: 'Grammar and Vocabulary',
        body: `Focus error spotting: subject-verb agreement, tense consistency, prepositions. Word substitution tests synonym precision. Daily 10 new words from Hindu editorial vocabulary less critical than pattern practice.`,
      },
      {
        heading: 'Para Jumbles and Summary',
        body: `Identify mandatory pairs sharing pronoun references. Opening sentence often independent statement without "this/however." Summary questions choose option covering main idea not partial detail.`,
      },
      {
        heading: 'Daily Habit',
        body: `20 minutes verbal daily 6 weeks sufficient for most mass recruiter cutoffs. Non-English medium students benefit extra reading economic times simplified articles building speed.`,
      },
    ],
    faq: [
      { question: 'IELTS preparation overlap?', answer: 'Reading sections overlap beneficially; IELTS writing depth unnecessary for MCQ tests.' },
    ],
    internalLinks: [
      { title: 'Quantitative Aptitude', href: '/blog/quantitative-aptitude-preparation-guide' },
      { title: 'Wipro Guide', href: '/blog/wipro-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'product-vs-service-company-choice',
    title: 'Product vs Service Company: Career Choice Guide for Indian Graduates',
    excerpt:
      'Compare work culture, compensation, learning curves, and long-term career paths between TCS-style services and Google-style product firms.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['product-companies', 'service-companies', 'campus-hiring'],
    keywords: ['product vs service company', 'TCS vs Amazon career', 'IT services career growth'],
    sections: [
      {
        heading: 'Work Model Differences',
        body: `Service companies deploy engineers to client projects—tech stack varies by account, bench periods possible. Product companies own roadmap building single platform deepening domain expertise. Services offer breadth exposure; products offer depth and ownership.`,
      },
      {
        heading: 'Compensation Trajectories',
        body: `Product entry CTC often 2–4x mass service ASE packages. Service growth relies promotions and onsite dollar savings. Product equity components volatile but upside significant. Consider 5-year NPV not just year one.`,
      },
      {
        heading: 'Risk and Job Security',
        body: `Mass services hire volume providing backup offer security during recession fears. Product layoffs cyclical yet skills highly transferable. Hybrid path: service 2 years upskill transition off-campus product common.`,
      },
      {
        heading: 'Decision Matrix',
        body: `Choose product if strong DSA and risk tolerance. Choose service if need immediate employment financial pressure or non-CS branch limited options. Neither choice permanent—Indian market rewards continuous learning.`,
      },
    ],
    faq: [
      { question: 'Can I switch service to product later?', answer: 'Yes—6–24 months experience with DSA prep enables off-campus product entry routinely.' },
    ],
    internalLinks: [
      { title: 'Google Guide', href: '/blog/google-campus-hiring-guide-2026' },
      { title: 'TCS Guide', href: '/blog/tcs-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'mock-interview-preparation-guide',
    title: 'Mock Interview Preparation: Free and Paid Resources for Indian Students',
    excerpt:
      'Organize peer mocks, alumni sessions, and platform-based mock interviews for technical and HR campus rounds.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['technical-interview', 'hr-interview', 'placement-prep'],
    keywords: ['mock interview campus', 'peer mock DSA', 'interview preparation India'],
    sections: [
      {
        heading: 'Peer Mock Structure',
        body: `Pair with roommate alternating interviewer 45 minutes: 5 intro, 35 coding, 5 feedback. Use shared LeetCode random picker. Record session reviewing filler words and clarity.`,
      },
      {
        heading: 'Alumni and Senior Networks',
        body: `Placement cell alumni database valuable—request 30-minute mock with specific company format. LinkedIn polite outreach to recent joiners often succeeds with college affinity.`,
      },
      {
        heading: 'Platforms and Clubs',
        body: `Coding clubs on campus, InterviewBit mock assessments, Pramp international peer matching free tier, company-sponsored prep sessions before campus drive dates.`,
      },
      {
        heading: 'Feedback Integration',
        body: `Log weaknesses after each mock targeting next session. Spaced repetition on failed problem patterns. Increase mock frequency final two weeks before first company interview.`,
      },
    ],
    faq: [
      { question: 'How many mocks needed?', answer: 'Minimum 10 technical mocks before Amazon/Google level interviews.' },
    ],
    internalLinks: [
      { title: 'DSA Roadmap', href: '/blog/technical-interview-dsa-roadmap' },
      { title: 'HR Questions', href: '/blog/hr-interview-questions-campus-placement' },
    ],
  },
  {
    slug: 'github-portfolio-projects-freshers',
    title: 'GitHub Portfolio Projects That Impress Indian Campus Recruiters',
    excerpt:
      'Project ideas and README standards that differentiate fresher applications at product companies and startups.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['resume', 'off-campus', 'coding-interview'],
    keywords: ['GitHub portfolio fresher', 'project ideas campus', 'engineering portfolio India'],
    sections: [
      {
        heading: 'Project Selection Criteria',
        body: `Choose 2–3 depth projects over 10 todo tutorials. Full stack CRUD with auth deployment beats clone without customization. Domain relevance: fintech ledger, e-commerce cart, analytics dashboard. Open source contribution to established repo counts powerfully.`,
      },
      {
        heading: 'README Excellence',
        body: `Include problem statement, architecture diagram screenshot, tech stack badges, setup instructions tested on fresh machine, live demo link, API documentation snippet, future improvements section honesty.`,
      },
      {
        heading: 'Code Quality Signals',
        body: `Meaningful commits not single upload. Tests present even minimal. Linting configured. Environment variables documented not secrets committed. Docker optional bonus simplifying reviewer setup.`,
      },
      {
        heading: 'Talking Points in Interview',
        body: `Prepare 3-minute walkthrough trade-offs faced: why PostgreSQL over MongoDB, caching decisions, security auth flow. Quantify users or performance if deployed to friends/college.`,
      },
    ],
    faq: [
      { question: 'Copy projects from YouTube?', answer: 'Extend significantly with unique features—interviewers detect identical tutorial clones.' },
    ],
    internalLinks: [
      { title: 'Resume Guide', href: '/blog/ats-friendly-resume-format-india-2026' },
      { title: 'Razorpay Guide', href: '/blog/razorpay-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'gate-vs-placement-preparation-balance',
    title: 'Balancing GATE Preparation with Campus Placement Season',
    excerpt:
      'Time management strategies for students targeting both PSU jobs via GATE and private campus offers simultaneously.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['placement-prep', 'branch-selection', 'on-campus'],
    keywords: ['GATE vs placement', 'PSU vs IT job', 'dual preparation engineering'],
    sections: [
      {
        heading: 'Timeline Reality',
        body: `Campus placements peak Aug–Dec final year; GATE exam February. Overlap semester demands prioritization—choose primary path by July avoiding split focus mediocrity both.`,
      },
      {
        heading: 'Synergistic Preparation',
        body: `DSA and aptitude overlap partially—quantitative aptitude shared. GATE technical depth exceeds campus IT tests benefiting product interviews if pivot. Discrete mathematics and OS concepts dual use.`,
      },
      {
        heading: 'Decision Triggers',
        body: `If placed product company dream offer early semester, GATE optional unless PSU passion. If unplaced by November intensify campus over GATE. PSU through GATE requires dedicated mock tests previous year papers.`,
      },
      {
        heading: 'Communication with Stakeholders',
        body: `Inform placement cell GATE exam dates conflicting drives. Discuss family expectations transparently balancing stability PSU versus private sector growth.`,
      },
    ],
    faq: [
      { question: 'Can I join IT after GATE preparation?', answer: 'Yes—skills transfer; many GATE aspirants accept IT backup offers.' },
    ],
    internalLinks: [
      { title: 'Placement Prep Guide', href: '/blog/campus-placement-preparation-guide-2026' },
      { title: 'Branch Selection', href: '/blog/branch-selection-cse-vs-it-placement' },
    ],
  },
  {
    slug: 'remote-interview-best-practices',
    title: 'Remote Interview Best Practices for Virtual Campus Recruitment Drives',
    excerpt:
      'Technical setup, proctoring compliance, and communication tips for online campus interviews and assessments.',
    categorySlug: 'career-guides',
    contentType: 'career-guide',
    tags: ['technical-interview', 'on-campus', 'placement-prep'],
    keywords: ['virtual campus interview', 'online proctored test', 'video interview tips'],
    sections: [
      {
        heading: 'Technical Setup Checklist',
        body: `Laptop charged, ethernet preferred over WiFi, backup mobile hotspot, quiet room informing family, plain wall background, webcam eye level, test microphone speaker 30 minutes prior, install required proctoring software days early not hour before.`,
      },
      {
        heading: 'During Proctored Assessments',
        body: `Face visible always, no headphones unless permitted, clear desk no papers if restricted, bathroom before start, avoid looking away screen triggering flags falsely. Read instructions on negative marking carefully.`,
      },
      {
        heading: 'Live Video Interviews',
        body: `Share screen coding tests practice beforehand. Think aloud during coding. Apologize gracefully for brief connectivity blip with recap request. Dress formal waist up at minimum.`,
      },
      {
        heading: 'Post-Interview',
        body: `Screenshot submission confirmation page. Email recruiter if technical failure documented with timestamp. Don't discuss questions publicly violating NDA risking blacklisting.`,
      },
    ],
    faq: [
      { question: 'Phone camera acceptable?', answer: 'Only if company permits—laptop preferred for coding shares.' },
    ],
    internalLinks: [
      { title: 'Remote Interview Prep', href: '/blog/mock-interview-preparation-guide' },
      { title: 'Amazon Guide', href: '/blog/amazon-campus-hiring-guide-2026' },
    ],
  },
];

export const PLACEMENT_PREP_ARTICLES: ArticleSeed[] = [
  {
    slug: 'campus-placement-preparation-guide-2026',
    title: 'Complete Campus Placement Preparation Guide 2026 for Indian Engineering Students',
    excerpt:
      'Month-by-month roadmap covering aptitude, DSA, resume, mock interviews, and offer strategy for 2026 placement season.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['placement-prep', 'on-campus', 'aptitude', 'dsa'],
    keywords: ['campus placement 2026', 'placement preparation India', 'engineering placement guide'],
    sections: [
      {
        heading: 'January–March: Foundation Semester',
        body: `Finalize target company tiers: mass IT backup, mid-tier digital, dream product list. Begin aptitude daily 45 minutes. Start DSA arrays/strings 3 problems daily. Update resume skeleton. Join placement preparation cell activities.`,
      },
      {
        heading: 'April–June: Technical Depth',
        body: `Complete trees, graphs, DP modules. Build one major project deployable. Participate summer internship if available. Mock aptitude full tests biweekly. Attend company webinars on campus.`,
      },
      {
        heading: 'July–September: Intensive Season',
        body: `Daily mocks alternating aptitude and coding. Company-specific preparation using CampusJobsHub guides. HR STAR stories written. Health sleep discipline maintained avoiding burnout before first drives.`,
      },
      {
        heading: 'October–December: Execution and Offers',
        body: `Apply strategically not exhaustively first week. Track applications spreadsheet. Negotiate offers professionally. Support peers maintaining positive campus culture. Backup offer before declining any.`,
      },
    ],
    faq: [
      { question: 'When to start preparation?', answer: 'Ideally pre-final year January; minimum intensive 4 months before drives.' },
      { question: 'Placement cell mandatory?', answer: 'Register always—many companies hire only through cell eligibility.' },
    ],
    internalLinks: [
      { title: 'DSA Roadmap', href: '/blog/technical-interview-dsa-roadmap' },
      { title: 'Resume Guide', href: '/blog/ats-friendly-resume-format-india-2026' },
    ],
  },
  {
    slug: 'final-year-placement-timeline-checklist',
    title: 'Final Year Placement Timeline Checklist: Week-by-Week Tasks',
    excerpt:
      'Printable checklist from July to December for Indian campus placement season task management.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['placement-prep', 'on-campus'],
    keywords: ['placement timeline', 'final year checklist', 'campus drive schedule'],
    sections: [
      {
        heading: 'July Tasks',
        body: `Register placement cell. Resume v1 reviewed by TPO. Aptitude diagnostic test. Company preference form submitted. LinkedIn profile updated.`,
      },
      {
        heading: 'August–September Tasks',
        body: `Complete 100 DSA problems cumulative. Mock GD sessions weekly. Attend pre-placement talks. Document certificates organized folder digital.`,
      },
      {
        heading: 'October Tasks',
        body: `First wave drives—TCS NQT, Infosys, Wipro registrations. Night before test sleep priority. Follow dress code instructions precisely.`,
      },
      {
        heading: 'November–December Tasks',
        body: `Dream company interviews. Offer comparison spreadsheet. Inform family decisions. Help juniors documenting learnings for college legacy.`,
      },
    ],
    faq: [
      { question: 'Missed July start?', answer: 'Compress timeline focusing high ROI aptitude + 80 core DSA problems immediately.' },
    ],
    internalLinks: [
      { title: 'Complete Guide 2026', href: '/blog/campus-placement-preparation-guide-2026' },
    ],
  },
  {
    slug: 'aptitude-speed-drills-30-day-plan',
    title: '30-Day Aptitude Speed Drills Plan Before TCS NQT and Infosys Tests',
    excerpt:
      'Daily drill schedule improving speed and accuracy for quantitative, logical, and verbal sections.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['aptitude', 'placement-prep', 'on-campus'],
    keywords: ['30 day aptitude plan', 'NQT speed preparation', 'aptitude drills'],
    sections: [
      {
        heading: 'Days 1–10: Arithmetic Speed',
        body: `Daily 40 quant questions timed 40 minutes. Focus percentages, TSD, time-work. Review wrong answers same evening. Memorize squares cubes tables.`,
      },
      {
        heading: 'Days 11–20: Logic and DI',
        body: `Daily 20 LR + 2 DI sets. Seating arrangement 3 puzzles daily. Maintain error log categorizing mistake types.`,
      },
      {
        heading: 'Days 21–30: Full Mocks',
        body: `Alternate full-length mocks TCS pattern vs Infosys pattern. Simulate proctoring environment strictly. Analyze time spent per section adjusting strategy.`,
      },
      {
        heading: 'Test Week',
        body: `Reduce volume light revision only. Sleep 7 hours. Avoid new topics. Confirm exam login credentials and ID documents ready.`,
      },
    ],
    faq: [
      { question: 'Skip verbal practice?', answer: 'No—cutoffs apply all sections many composite scoring systems.' },
    ],
    internalLinks: [
      { title: 'Quant Guide', href: '/blog/quantitative-aptitude-preparation-guide' },
      { title: 'TCS Guide', href: '/blog/tcs-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'dsa-last-minute-revision-placement',
    title: 'DSA Last-Minute Revision Sheet for Campus Interviews',
    excerpt:
      'High-yield patterns and formulas to revise 48 hours before Amazon, Microsoft, or startup technical rounds.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['dsa', 'coding-interview', 'placement-prep'],
    keywords: ['DSA revision placement', 'last minute interview prep', 'coding patterns'],
    sections: [
      {
        heading: 'Pattern Checklist',
        body: `Two pointers, sliding window max sum, binary search variants, BFS/DFS templates, topological sort Kahn, Dijkstra basics, DP knapsack LCS LIS, union find, trie prefix, heap top K.`,
      },
      {
        heading: 'Complexity Quick Reference',
        body: `Sort O(n log n), hash map ops O(1) average, BST operations O(log n) balanced, graph BFS DFS O(V+E). State complexities aloud in interview unprompted.`,
      },
      {
        heading: '48-Hour Schedule',
        body: `Day 1: revisit 15 previously missed medium problems. Day 2: 3 timed random mediums morning, light pattern notes afternoon, early sleep. No all-nighter coding.`,
      },
      {
        heading: 'Interview Day Mindset',
        body: `Clarify constraints before coding. Write skeleton then fill. Test edge cases empty input single element. Communicate throughout silence hurts evaluation.`,
      },
    ],
    faq: [
      { question: 'Learn new DP day before?', answer: 'Avoid—reinforce known patterns only reducing panic.' },
    ],
    internalLinks: [
      { title: 'DSA Roadmap', href: '/blog/technical-interview-dsa-roadmap' },
    ],
  },
  {
    slug: 'resume-project-elevator-pitch-prep',
    title: 'Resume Project Elevator Pitch Preparation for Technical Rounds',
    excerpt:
      'Script and practice method for explaining final year projects in 2 and 5 minute formats during campus interviews.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['resume', 'technical-interview', 'placement-prep'],
    keywords: ['project explanation interview', 'elevator pitch project', 'campus technical round'],
    sections: [
      {
        heading: 'Two-Minute Version Structure',
        body: `Problem (15 sec), Solution overview (30 sec), Your specific contributions (45 sec), Tech stack (15 sec), Result/metrics (15 sec). Practice until natural not memorized robotic.`,
      },
      {
        heading: 'Anticipated Follow-Up Questions',
        body: `Why this database? How handle scale? Security approach? What would you improve? Hardest bug solved? Team role clarity if group project—honesty about individual contribution critical.`,
      },
      {
        heading: 'Demo Preparation',
        body: `Local demo ready if virtual sharing requested. Screenshots backup if live demo fails. Architecture diagram one slide optional clarity booster.`,
      },
      {
        heading: 'Weak Project Recovery',
        body: `If academic mandatory weak project, emphasize learning and parallel strong personal project depth. Redirect conversation proactively to stronger work.`,
      },
    ],
    faq: [
      { question: 'Group project credit?', answer: 'Explain your modules honestly—interviewers detect exaggeration probing details.' },
    ],
    internalLinks: [
      { title: 'GitHub Portfolio', href: '/blog/github-portfolio-projects-freshers' },
    ],
  },
  {
    slug: 'placement-season-mental-health-guide',
    title: 'Mental Health During Placement Season: Stress Management for Students',
    excerpt:
      'Coping strategies for rejection, peer comparison, and family pressure during Indian campus placement cycles.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['placement-prep', 'on-campus'],
    keywords: ['placement stress', 'rejection campus', 'mental health students India'],
    sections: [
      {
        heading: 'Normalizing Rejection',
        body: `Placement ratios often 1:5 dream company acceptance—rejection statistical not personal failure. Each no builds interview immunity. Avoid comparing LinkedIn offer announcements selectively biased highlight reels.`,
      },
      {
        heading: 'Support Systems',
        body: `Talk placement cell counselors available many colleges. Friend groups celebrate small wins mock clearances not only offers. Family conversations setting realistic expectations monthly not daily interrogation.`,
      },
      {
        heading: 'Physical Health Impact',
        body: `Exercise 20 minutes daily improves cognition and mood. Limit caffeine after 4pm sleep quality. Regular meals avoiding skip during marathon test days.`,
      },
      {
        heading: 'Professional Help Signals',
        body: `Persistent insomnia, panic attacks, or hopelessness warrant campus counselor or therapist—seeking help strength not weakness. Placement delay year possible reattempt off-campus path remains open.`,
      },
    ],
    faq: [
      { question: 'Everyone placed but me?', answer: 'Late offers common Dec-Feb—continue off-campus parallel not isolate.' },
    ],
    internalLinks: [
      { title: 'Off-Campus Guide', href: '/blog/off-campus-job-search-strategy-india' },
    ],
  },
  {
    slug: 'company-tier-strategy-dream-safe-backup',
    title: 'Dream, Safe, and Backup Company Strategy for Campus Applications',
    excerpt:
      'Portfolio approach balancing Google dreams with TCS safety nets during limited campus application slots.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['on-campus', 'campus-hiring', 'product-companies', 'service-companies'],
    keywords: ['dream company strategy', 'backup offer campus', 'company tier placement'],
    sections: [
      {
        heading: 'Tier Definitions',
        body: `Dream: product FAANG/fintech top bands requiring intensive DSA. Target: mid-tier digital Infosys SP, LTI premium, Deloitte tech. Safe: mass ASE TCS Wipro Cognizant ensuring employment baseline.`,
      },
      {
        heading: 'Application Slot Management',
        body: `Many colleges limit simultaneous processes—read TPO policy. Accept safe offer only after evaluating dream pipeline timeline risk. Backup offer holding period negotiate extensions professionally if policy allows.`,
      },
      {
        heading: 'Preparation Allocation',
        body: `70% time DSA if targeting product, shift 50% aptitude if mass recruiters first in schedule. Weekly adjust based on upcoming drive calendar not static plan.`,
      },
      {
        heading: 'Post-Offer Regret Minimization',
        body: `Document decision rationale accepting offer—reduces second-guessing. Declined offers burn bridges minimally if communicated respectfully with gratitude.`,
      },
    ],
    faq: [
      { question: 'Reject TCS for product gamble?', answer: 'Risky without backup—ensure active product pipeline advanced before declining safe written offer.' },
    ],
    internalLinks: [
      { title: 'Product vs Service', href: '/blog/product-vs-service-company-choice' },
      { title: 'TCS Guide', href: '/blog/tcs-campus-hiring-guide-2026' },
    ],
  },
  {
    slug: 'pre-placement-talk-questions-to-ask',
    title: 'Pre-Placement Talk: 15 Questions to Ask Company Representatives',
    excerpt:
      'Smart questions demonstrating research during campus PPT sessions with recruiters and engineers.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['on-campus', 'campus-hiring', 'placement-prep'],
    keywords: ['pre placement talk questions', 'PPT campus questions', 'recruiter session'],
    sections: [
      {
        heading: 'Role and Growth Questions',
        body: `What does first 6 months look like for campus hires? Ratio coding vs maintenance work? Mentorship structure? Promotion timeline typical? Internal mobility across locations?`,
      },
      {
        heading: 'Process Questions',
        body: `Interview format changes this year? CGPA cutoff confirmed? Bond or service agreement? Joining date flexibility for GATE or higher studies deferral?`,
      },
      {
        heading: 'Tech Stack Questions',
        body: `Primary languages teams hiring? Cloud platforms used? Training duration before production deployment? Open source contribution encouraged?`,
      },
      {
        heading: 'Questions to Avoid',
        body: `Don't ask salary publicly if PPT policy avoids—ask placement cell privately. Avoid "how easy to get placed" sounding entitled. Don't dominate Q&A preventing peers asking.`,
      },
    ],
    faq: [
      { question: 'Ask about WLB publicly?', answer: 'Acceptable phrased professionally: "How do teams manage release cycles?"' },
    ],
    internalLinks: [
      { title: 'Company Guides', href: '/blog' },
    ],
  },
  {
    slug: 'document-checklist-campus-drives',
    title: 'Document Checklist for Campus Drive Day: What to Carry',
    excerpt:
      'Essential originals, photocopies, and digital backups for TCS, Infosys, and product company campus interview days.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['on-campus', 'placement-prep', 'offer-letter'],
    keywords: ['campus drive documents', 'placement documents checklist', 'interview documents India'],
    sections: [
      {
        heading: 'Mandatory Documents',
        body: `Government photo ID (Aadhaar/PAN/passport), college ID, resume copies 5+, passport photos 4+, 10th 12th marksheets originals photocopies, all semester marksheets, degree provisional if available, gap affidavit if applicable, caste certificate if reservation category claimed.`,
      },
      {
        heading: 'Digital Backups',
        body: `PDF resume phone offline copy. Marksheets scanned folder Google Drive accessible. Offer letters previous internships if any.`,
      },
      {
        heading: 'Organizational Tips',
        body: `Folder segregating company-specific forms pre-filled when possible. Pen notepad for aptitude rough work if paper test. Transparent water bottle long days.`,
      },
      {
        heading: 'Verification Stage',
        body: `Discrepancy between resume CGPA and transcript fatal—reconcile beforehand. Name spelling consistent all documents avoiding passport mismatch delays.`,
      },
    ],
    faq: [
      { question: 'Laptop required?', answer: 'Only if company specifies coding bring-your-laptop round—verify email instructions.' },
    ],
    internalLinks: [
      { title: 'Offer Verification', href: '/blog/offer-letter-verification-checklist-india' },
    ],
  },
  {
    slug: 'post-placement-skill-development-plan',
    title: 'Post-Offer Skill Development Plan Before Joining Day',
    excerpt:
      'Maximize gap between offer acceptance and joining date learning stack-specific skills for smoother onboarding.',
    categorySlug: 'placement-prep',
    contentType: 'placement-prep',
    tags: ['placement-prep', 'fresher-jobs', 'internship'],
    keywords: ['pre joining preparation', 'skills before joining TCS', 'post offer learning'],
    sections: [
      {
        heading: 'Research Your Employer',
        body: `Read engineering blogs of assigned company division if known. Understand business model products clients. Connect future colleagues LinkedIn asking reading recommendations politely.`,
      },
      {
        heading: 'Technical Upskilling',
        body: `TCS/Infosys: revise Java SQL basics. Product: system design reading LeetCode maintenance. Fintech: payment flows APIs. Cloud: AWS/Azure fundamentals free tier hands-on.`,
      },
      {
        heading: 'Soft Skills',
        body: `Professional email writing. Basic Excel for services reporting. Time zone awareness if global team likely.`,
      },
      {
        heading: 'Life Admin',
        body: `Relocation housing search if moving city. Financial planning first salary budgeting. Health checkup completion if offer conditional on medical.`,
      },
    ],
    faq: [
      { question: 'Mandatory pre-joining training?', answer: 'Some companies assign modules—complete deadlines seriously affecting team assignment.' },
    ],
    internalLinks: [
      { title: 'Microsoft Guide', href: '/blog/microsoft-campus-hiring-guide-2026' },
      { title: 'DSA Roadmap', href: '/blog/technical-interview-dsa-roadmap' },
    ],
  },
];

export function articleSectionsToContent(sections: { heading: string; body: string }[]): string {
  return sections.map((s) => `## ${s.heading}\n\n${s.body}`).join('\n\n');
}
