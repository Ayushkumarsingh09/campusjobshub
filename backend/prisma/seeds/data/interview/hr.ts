import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const HR_BANK: InterviewTopicBank = {
  topic: 'HR',
  topicSlug: 'hr',
  questions: [
    q(
      'Tell me about yourself — how should a fresher answer in HR round?',
      'Structure a 90-second pitch covering education, relevant skills, one or two projects or internships, and career goal aligned with the role. Start present: final-year CSE at XYZ college. Past: internship at ABC building React dashboard. Future: grow as full-stack engineer contributing to scalable products. Avoid personal biography, family details, or repeating entire resume. Practice until natural not memorized robotic. Indian campus HR panels at TCS, Infosys, and Cognizant use this opener to assess communication clarity and confidence before salary or relocation questions follow.',
      'easy',
    ),
    q(
      'Why do you want to join our company?',
      'Research company products, culture, tech stack, and recent news before interview. Connect your skills and goals to their needs: admire Flipkart scale engineering challenges matching your DSA preparation; value Infosys learning programs for freshers. Avoid generic praise or salary-only motivation. Mention specific initiatives — sustainability report, open source contributions, campus hiring program. Campus HR rejects candidates saying only brand name or job security. Authentic alignment between your project experience in e-commerce and company domain demonstrates genuine interest interviewers appreciate across Indian product and service company HR rounds.',
      'easy',
    ),
    q(
      'What are your strengths and weaknesses?',
      'Choose real strengths relevant to job: quick learner, consistent problem solver, collaborative team player — support with brief example from project or hackathon. Weakness should be genuine but manageable with improvement steps: public speaking improving through presentations, saying yes to too many tasks learning prioritization with Eisenhower matrix. Never claim perfection or cite disguised strengths like I work too hard. Campus HR assesses self-awareness and honesty. Indian interviewers expect balanced answer showing growth mindset valued in fast-paced IT workplace culture and annual appraisal discussions after joining.',
      'easy',
    ),
    q(
      'Where do you see yourself in five years?',
      'Show ambition balanced with commitment to company growth. Example: deepen expertise as backend engineer owning microservices, mentor junior developers, contribute to architecture decisions — aligned with company technical ladder. Avoid saying starting own business soon or unrelated MBA unless applying for management track. Service companies appreciate long-term stability; product companies value technical depth. Campus candidates should not appear using company as short stopover. Frame five-year vision demonstrating learning trajectory from fresher to senior engineer contributing to impactful products serving Indian market scale.',
      'easy',
    ),
    q(
      'Are you willing to relocate?',
      'Answer honestly based on actual flexibility. If yes: express openness to Bangalore, Hyderabad, Pune, or client location with enthusiasm for new experience and career exposure. If prefer specific city: state preference respectfully while confirming willingness if business requires — many Indian IT roles require relocation or client site deployment. Ask about training period location and permanent posting policy. Campus HR uses relocation to filter candidates for project staffing. Never lie saying yes then refuse offer — damages reputation with placement cell and company campus relations affecting future batch hiring.',
      'easy',
    ),
    q(
      'What is your expected CTC?',
      'Research company pay band and campus offer trends on AmbitionBox, Glassdoor, and seniors before stating range. Give reasonable range based on role and location not arbitrary maximum. If company asks first: politely ask their budget for role or say open to company standard campus offer aligned with market and your qualifications. Avoid anchoring unrealistically high without Amazon Google level skills. Campus placement cells often publish expected ranges. Negotiate after offer not during first HR screening unless explicitly asked. Indian fresher CTC includes base plus variable plus benefits — clarify components before comparing offers.',
      'easy',
    ),
    q(
      'Why should we hire you over other candidates?',
      'Summarize unique combination: strong DSA foundation demonstrated through CodeChef rating, full-stack placement portal project with 500 active users, internship delivering production bug fixes, and consistent academic record. Connect specifically to job description requirements. Avoid criticizing other candidates. Confidence without arrogance: I bring proven ability to learn quickly and deliver under deadlines evidenced by hackathon win. Campus HR final filter question — differentiate with concrete evidence not adjectives. Tailor answer per company emphasizing relevant stack Java for Infosys React for startup frontend role.',
      'easy',
    ),
    q(
      'Do you have any questions for us?',
      'Always prepare two or three thoughtful questions showing research and interest. Good topics: team structure and technologies for fresher role, training and mentorship program duration, performance review and growth path, upcoming projects for new hires. Avoid asking only about salary leave in first round or questions easily answered by website. Ask about day-to-day responsibilities and learning opportunities. Campus HR negative signal when candidate has zero questions appearing disengaged. Quality questions leave strong closing impression often influencing borderline hire decisions in Indian campus placement committees alongside technical scores.',
      'easy',
    ),
    q(
      'How do you handle stress and tight deadlines?',
      'Describe practical approach: prioritize tasks using urgency importance matrix, break large deliverables into daily milestones, communicate early if risk of missing deadline, stay calm focusing on controllable actions. Give example: exam week coinciding with project demo prioritized core features shipped MVP deferred nice-to-have features successfully. Avoid claiming never stressed or unhealthy coping. Campus HR assesses resilience for IT industry deadline pressure sprint cycles and production incidents. Indian service companies mention on-call rotations; demonstrate mature coping strategies interviewers trust for client delivery environments.',
      'easy',
    ),
    q(
      'What do you know about our company?',
      'Prepare company snapshot: founding year, core business, flagship products, market position, recent achievements, tech blog topics, and campus hiring initiatives. For TCS mention global IT services digital transformation; for Razorpay mention payment gateway SME focus; for Amazon mention leadership principles and scale. Reference specific detail from recent news not Wikipedia first paragraph only. Campus HR eliminates candidates who know nothing about company appearing mass applying without interest. Ten minutes research before interview separates prepared candidates in competitive Indian campus seasons with hundreds applying same company through placement portal.',
      'easy',
    ),
    q(
      'Explain any gap in your education or career timeline.',
      'Be honest and concise with positive framing: health gap recovered fully committed to career; drop year used for intensive DSA preparation and building portfolio projects improving readiness. Avoid lengthy excuses or blaming others. Emphasize current preparedness and forward focus. Provide documentation if asked medical certificate for legitimate health gap. Campus HR gap scrutiny higher in service companies verifying background check clearance. Prepare factual timeline without defensiveness. Gap year for UPSC or entrepreneurship pivot explain skill transfer to software role demonstrating deliberate career choice not failure narrative..',
      'medium',
    ),
    q(
      'How would you handle disagreement with your manager?',
      'Professional approach: privately discuss concerns with data and respect, present alternative viewpoint with reasoning, accept final decision if manager decides after hearing you, execute committedly regardless of personal preference. Never badmouth manager in interview or escalate publicly first. Example: disagreed on technology choice presented prototype metrics manager chose their approach you implemented successfully. Campus HR tests maturity and teamwork essential for hierarchical Indian IT organizations. Show you voice opinions constructively without ego conflict damaging team dynamics client-facing project environments common in TCS Infosys delivery models..',
      'medium',
    ),
    q(
      'Describe your ideal work environment.',
      'Balance preferences with adaptability: collaborative team with code reviews and learning culture, clear goals, autonomy with mentorship, modern tech stack — while acknowledging every company differs and you adapt to established processes. Avoid demanding unrealistic perks or criticizing corporate structure. Research target company culture beforehand aligning answer: startup mention enjoying fast iteration; service company mention structured learning and diverse projects. Campus HR detects inflexibility red flag. Ideal environment answer reveals culture fit — match company values Amazon customer obsession Microsoft growth mindset without sounding scripted reciting their careers page verbatim..',
      'medium',
    ),
    q(
      'How do you prioritize multiple tasks with conflicting deadlines?',
      'Use framework: assess impact and urgency, communicate with stakeholders clarifying priorities, focus highest value deadline first, delegate if team context, track progress transparently. Tools: todo lists, calendar blocks, daily standup updates. Example: placement week balanced company prep slots with assignment submission negotiating extension professor after showing completed draft. Campus HR connects to sprint planning and client deliverable management post joining. Demonstrate proactive communication not silent struggle until failure. Indian IT managers value employees escalating blockers early especially fresher learning curve first months on bench training before production project assignment..',
      'medium',
    ),
    q(
      'What motivates you at work?',
      'Intrinsic motivators resonate better: solving challenging problems, learning new technologies, seeing users benefit from your code, team achievement. Connect to role: building reliable payment systems impacting merchants motivates at fintech. Avoid money-only answer in first HR round though compensation matters — save for negotiation. Campus HR seeks sustainable motivation for long hours during release cycles. Authentic answer referencing satisfaction debugging production issue or mentoring junior in college coding club demonstrates engineering mindset beyond paycheck focus valued in product company culture building career growth narratives..',
      'medium',
    ),
    q(
      'How do you keep yourself updated with technology trends?',
      'Mention specific habits: follow engineering blogs Hacker News dev.to, YouTube channels for system design, LeetCode daily practice, GitHub explore trending repos, company tech blogs, internal meetups after joining, online courses NPTEL Coursera certificates. Demonstrate continuous learning essential for IT career. Avoid vague I read sometimes. Campus HR assesses growth potential and self-driven learning critical when technologies change faster than formal training updates. Indian fresher competitive advantage showing structured upskilling plan AWS certification pursuit or open source contribution differentiates in HR round after similar technical scores among college batchmates..',
      'medium',
    ),
    q(
      'Would you be comfortable working in shifts or extended hours when required?',
      'Honest answer based on role requirements. Many Indian IT service roles involve US UK client shift overlap or on-call support. Express willingness for reasonable project needs while maintaining work-life balance long term. Ask about shift allowances compensatory offs and frequency not daily expectation. Product companies may mention crunch before releases honestly. Campus HR filters candidates unwilling any flexibility missing project opportunities. Avoid absolute refusal unless genuine medical constraint. Frame as professional commitment during critical delivery balanced with sustainable pace — mature answer HR panels prefer over heroic burnout promises unsustainable after joining..',
      'medium',
    ),
    q(
      'How do you handle constructive criticism or feedback?',
      'Welcome feedback as growth opportunity: listen without defensiveness, ask clarifying questions, implement improvements, follow up showing change. Example: code review comments on naming conventions adopted team style guide improved subsequent reviews. Distinguish constructive feedback from personal attack responding professionally to both. Campus HR links to performance appraisal culture Indian IT companies annual review cycles. Show emotional intelligence valued in client-facing roles presenting demos to stakeholders receiving feedback gracefully. Never say I don not take criticism well — immediate rejection signal regardless of technical brilliance in preceding campus technical rounds..',
      'medium',
    ),
    q(
      'Explain your notice period and joining availability.',
      'Campus hires typically join after degree completion and clearance from placement cell — state exact date graduation convocation offer letter joining window. Off-campus experienced candidates mention current notice period 30 60 90 days negotiable. Confirm no active competing offer binding period unless true. Coordinate with placement office policies some colleges restrict early joining before exams. Campus HR logistical question ensuring workforce planning training batch scheduling. Clear joining date prevents offer revocation for delayed joining. Mention willingness complete documentation background verification promptly expediting onboarding Indian companies conduct thorough BGV before first day desk allocation..',
      'medium',
    ),
    q(
      'What is your policy on bonds or service agreement if company requires one?',
      'Indian service companies sometimes impose training bonds 1-2 years with monetary penalty early exit. Understand terms before signing: bond duration, penalty amount, conditions waiving bond, legal enforceability varies. In interview express willingness to commit if terms reasonable after reviewing offer document not blind acceptance. Ask HR clarify bond scope training costs only or general employment. Campus placement cell often guides students on bond fairness. Never agree interview then refuse offer signing creating blacklist reputation. Balanced answer: open to reasonable commitment in exchange for training investment seeking transparent terms — demonstrates professional maturity navigating common Indian IT fresher employment practice..',
      'medium',
    ),
    q(
      'You have offers from two companies — how would you decide and communicate?',
      'Decision framework: role fit, learning curve, compensation total package not just base, location, growth trajectory, work-life balance, company stability aligned with personal priorities ranked consciously. Communicate ethically: inform companies of decision timeline, accept one offer formally decline others respectfully without ghosting, honor placement cell one student one job policy most Indian colleges enforce. Never leverage fake offers for negotiation damaging integrity. Campus HR may ask hypothetical assessing loyalty and decision-making. Explain transparent process consulting mentors and family without implying desperate whichever pays more. Professional decline email preserves relationships for future referral opportunities small Indian tech community..',
      'hard',
    ),
    q(
      'How would you respond if assigned technology stack different from your preference?',
      'Express adaptability: primary goal learning and contributing effectively; previously worked Python comfortable learning Java enterprise stack through company training and documentation; successful developers master fundamentals transferring across languages. Ask about training resources and mentorship timeline ramping up. Avoid demanding only React refusing Java backend role — limits fresher opportunities Indian market Java demand high. Share example learning new framework for college project delivered on time. Campus HR tests flexibility for bench training random project allocation service companies. Mature answer acknowledges preference while committing excellence assigned stack — essential mindset TCS Cognizant resource deployment model moving between client projects technologies..',
      'hard',
    ),
    q(
      'Describe a situation where you demonstrated leadership without formal title.',
      'Use STAR format: Situation college fest tech event registration system failing. Task coordinate fix before keynote. Action organized teammates divided debugging frontend backend database, communicated status to faculty, implemented caching fix. Result system handled 2000 registrations smoothly event success. Leadership means initiative accountability and enabling others not bossing. Campus HR leadership question for associate roles predicting future team lead potential. Indian companies value lead-from-front freshers in client teams gradually taking module ownership. Specific measurable outcome stronger than vague I led my team generic answer failing behavioral interview scoring rubrics used by structured HR panels..',
      'hard',
    ),
    q(
      'How do you ensure diversity and inclusion respect in workplace?',
      'Treat colleagues respectfully regardless of gender region language background; listen diverse perspectives in meetings; call out disrespect appropriately through HR channels; avoid stereotypes and jokes harming inclusion. Value diverse teams better solutions citing college group project mixed branch team outperformed homogeneous group. Campus HR increasing focus D&I policies especially MNCs operating globally from India. Authentic awareness without performative activism. Mention accessibility considerations if building placement portal project screen reader support showing inclusive product thinking. Demonstrates cultural readiness multinational HR policies code of conduct training mandatory first week joining Indian GCC global capability centers..',
      'hard',
    ),
    q(
      'What would you do if you discovered unethical behavior by a colleague?',
      'Follow company ethics policy: document facts objectively, report manager or anonymous ethics hotline HR not public accusation, maintain confidentiality, cooperate investigation, avoid retaliation fears — companies protect good faith reporters. Do not ignore data leak or expense fraud rationalizing not my problem. Campus HR integrity test critical financial services healthcare clients compliance requirements. Balance loyalty with ethics — protecting company and users paramount. Reference college honor code academic integrity parallel demonstrating consistent values. Mature answer acknowledges difficulty reporting friend while emphasizing professional responsibility expected Indian IT export services maintaining client trust global delivery standards..',
      'hard',
    ),
    q(
      'Negotiate salary respectfully as a fresher with competing offer.',
      'After written offers only: thank company express strong interest, share competing offer factually without exaggeration, ask if compensation adjustment possible within their campus band, accept gracefully regardless outcome. Justify with skills evidence not desperation. Some companies match or add joining bonus sign-on. Never negotiate aggressively threatening unless prepared walk away. Campus placement cell rules may restrict renegotiation after acceptance — understand policy first. Script example: grateful for Infosys offer have Wipro offer 10% higher on base given identical role ask if Infosys can review given my GATE score project — polite factual effective Indian campus negotiation limited fresher leverage but worth attempting once professionally.',
      'hard',
    ),
    q(
      'How do you plan continuous career development after joining as fresher?',
      'First 90 days: master onboarding training deliver assigned tasks seek feedback. Year one: complete company certifications cloud agile, understand domain deeply, build internal network mentor. Years two three: specialize depth area backend security or breadth full-stack, contribute design discussions, pursue external learning aligned company tuition reimbursement. Align with company competency framework promotion criteria. Campus HR long-term retention question — show you invest career there not exit six months. Reference company specific programs TCS Elevate Infosys Lex learning platform demonstrating research. Structured plan impresses HR over vague I will work hard answer lacking actionable milestones measurable growth indicators..',
      'hard',
    ),
    q(
      'Explain work-life balance approach for demanding IT career.',
      'Sustainable performance requires boundaries: focused work hours minimize distractions, disconnect after shift when possible, physical exercise sleep prioritization, hobbies preventing burnout, communicate workload concerns before breaking point. Acknowledge crunch periods exist commit extra effort temporarily balanced recovery after. Avoid claiming always available 24/7 unsustainable dishonest. Campus HR assesses burnout risk freshers unrealistic hero promises. Indian IT work-life balance varies widely service versus product — researched answer matching company reality. Mature perspective: high performance through consistency not perpetual overtime — resonates HR reducing attrition concern hiring expensive campus pipeline investing training cost per fresher lakh rupees range..',
      'hard',
    ),
    q(
      'How would you represent company brand as employee on social media?',
      'Follow social media policy: disclaimer views personal not employer, never share confidential client data unreleased features, avoid controversial statements reflecting poorly on employer, positive professional LinkedIn presence showcasing work appropriately approved, report misinformation about company. Campus HR digital footprint scrutiny increasing background social media review. Example refused sharing internal sprint screenshot on Instagram protecting client confidentiality. Balance personal expression professional responsibility especially Indian IT employees client NDAs strict social media clauses offer letters. Demonstrates awareness modern employment expectations beyond technical skills HR evaluates holistic hire risk management protecting company reputation global client relationships..',
      'hard',
    ),
    q(
      'How do you explain a low CGPA in campus HR interviews?',
      'Be honest without being defensive: acknowledge CGPA, explain context if legitimate—health issue, focus on competitive programming over marks, early semester adjustment—then pivot to evidence of capability: strong projects, internship performance, coding contest ranks, and relevant certifications. Show upward trend if later semesters improved. Never blame professors or system entirely. Frame as learning experience building resilience and time management improved since. Campus HR evaluates overall profile not single number—TCS and Infosys hire candidates below 7 CGPA with strong aptitude sometimes. Confidence and demonstrated skills through portfolio matter more when you address CGPA directly rather than hoping interviewer ignores transcript..',
      'hard',
    ),
  ],
};
