import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const BEHAVIORAL_BANK: InterviewTopicBank = {
  topic: 'Behavioral',
  topicSlug: 'behavioral',
  questions: [
    q(
      'What is the STAR method for answering behavioral questions?',
      'STAR stands for Situation, Task, Action, and Result. Situation sets context briefly — final-year group project deadline. Task explains your responsibility — deliver working authentication module. Action describes specific steps you took — researched JWT, pair-programmed, wrote tests. Result quantifies outcome — module shipped on time, zero auth bugs in demo, professor praised security design. Keep answers two minutes focused on your contributions using I not we vaguely. Campus behavioral rounds at Amazon Microsoft and Goldman Sachs use STAR explicitly; Indian product companies increasingly adopt similar structured behavioral interviews alongside technical assessments.',
      'easy',
    ),
    q(
      'Tell me about a time you worked effectively in a team.',
      'Choose college project, hackathon, or fest organizing example. Describe diverse team roles, how you communicated via daily standups WhatsApp group, resolved disagreements on architecture by prototyping both approaches, shared credit with teammates. Emphasize collaboration not solo heroics. Example: Smart India Hackathon team divided frontend backend ML tracks integrated API contract first weekend avoiding merge conflicts final submission scored top 50 nationally. Campus interviewers seek team players for agile software development post joining. Avoid blaming teammates for failures — focus on collective recovery and your constructive contribution.',
      'easy',
    ),
    q(
      'Describe a time you failed and what you learned.',
      'Pick genuine failure with recovery lesson — not disguised success. Example: first hackathon submitted incomplete prototype because underestimated integration time; learned break tasks estimate buffer, practice demo path early. Show accountability without excessive self-blame. Explain behavior change afterward — next hackathon used Trello milestones delivered MVP with polish winning college round. Campus behavioral interviewers respect honesty and growth mindset over perfection claims. Indian HR panels forgive failure demonstrating reflection; reject candidates claiming never failed appearing untruthful or risk-averse avoiding stretch opportunities essential for engineering career.',
      'easy',
    ),
    q(
      'Tell me about a time you showed initiative.',
      'Initiative means identifying need and acting without being asked. Example: noticed placement cell manually tracking applications created free portal prototype presented to coordinator now used by 300 students saving hours weekly. Or noticed library computer lab outdated software volunteered tutorial sessions for juniors. Connect initiative to workplace: proactively fixing documentation gap, suggesting test automation improvement. Campus interviews value self-starters especially startups with limited supervision. Quantify impact where possible. Avoid examples solely personal benefit without team or organization value — interviewers assess organizational orientation not just personal ambition.',
      'easy',
    ),
    q(
      'Describe a challenging problem you solved.',
      'Select technical or organizational challenge with clear resolution. Technical: optimized slow SQL query in project reducing page load three seconds to 300 milliseconds via indexing and query rewrite. Organizational: mediating team conflict when two members stopped communicating reorganized tasks clear ownership restored progress. Structure STAR emphasizing analytical approach: defined problem, gathered data, evaluated options, implemented solution, verified results. Campus behavioral complements technical coding round showing real-world problem solving beyond LeetCode isolated problems. Choose example matching role — backend query optimization for server role, UX improvement for frontend.',
      'easy',
    ),
    q(
      'Tell me about a time you had to learn something quickly.',
      'Example: assigned React module two weeks before demo only knew vanilla JavaScript; completed official tutorial, built todo prototype, sought senior student mentor code reviews, delivered functional dashboard meeting requirements. Highlight learning strategy: official docs first, focused scope MVP, sought feedback early, practiced daily. Campus hiring assumes continuous learning; demonstrate proven ability ramp fast new stack company assigns. Avoid claiming mastery overnight — credible progression impresses. Connect to onboarding expectation first project assignment unfamiliar codebase common Indian IT fresher experience bench training followed client technology stack.',
      'easy',
    ),
    q(
      'Describe a time you met a tight deadline.',
      'Choose exam week project delivery or event launch. Explain prioritization cutting non-essential features, daily progress tracking, communicating risks to professor or team lead early, working focused hours without glorifying unhealthy all-nighters excessively. Result: delivered core functionality on schedule stakeholders satisfied. Mention quality not sacrificed entirely — basic tests run before submit. Campus behavioral assesses reliability under pressure common sprint deadlines release cycles. Indian service company client demos immovable dates — prove you deliver when stakes high using organized approach not panic or last-minute heroics alone unsustainable pattern.',
      'easy',
    ),
    q(
      'Tell me about a conflict with a teammate and how you resolved it.',
      'Pick interpersonal not technical disagreement: teammate wanted MongoDB you preferred PostgreSQL for transactional integrity. Resolution: scheduled meeting listed pros cons each, agreed evaluation criteria performance schema flexibility team familiarity, built small spike both options, team voted PostgreSQL with documented rationale preserving relationship. Emphasize listening empathy compromise data-driven decision not winning argument. Campus interviewers fear hiring brilliant jerks disrupting teams. Never describe conflict as teammate was lazy idiot — immediate red flag. Show emotional intelligence valued agile retrospectives constructive feedback cultures product companies and increasingly TCS agile squads.',
      'easy',
    ),
    q(
      'Describe a time you received critical feedback.',
      'Example: internship mentor said code lacked comments and tests difficult to review. Response: thanked feedback, asked specific examples, added JSDoc comments unit tests next PR, requested follow-up review showing improvement mentor approved merge. Demonstrate non-defensive growth orientation. Campus behavioral pairs with HR weakness question — consistent narrative builds credibility. Feedback example should show behavior change not just apology. Indian workplace code review culture critical skill; prove you thrive review process learning from senior engineers client delivery environments code quality gates blocking merge without tests.',
      'easy',
    ),
    q(
      'Tell me about your most significant academic or project achievement.',
      'Choose achievement with measurable impact and personal contribution clarity: led team building AI placement predictor achieving 85% accuracy presented at college symposium, published paper in IEEE student conference, ranked top 5 percent CodeChef campus chapter, secured internship through off-campus application after 50 rejections demonstrating persistence. Explain why it matters skills demonstrated alignment target role. Campus behavioral opens positive note before difficult questions. Avoid purely grade focus unless exceptional GATE rank relevant — projects and practical impact resonate engineering hiring more than marks alone unless consulting analytics role emphasizing quantitative excellence.',
      'easy',
    ),
    q(
      'Describe a time you had to persuade others to your point of view.',
      'Example: convinced team adopt Git flow instead of sharing USB drives — prepared short demo showing branch merge conflict resolution, addressed concerns learning curve offering pair sessions, team adopted workflow reducing lost code incidents. Persuasion through evidence empathy not authority or shouting. Workplace parallel: proposing refactoring legacy module showing performance metrics stakeholder buy-in. Campus leadership potential signal without formal manager title. STAR action step detail specific arguments and adaptations made hearing others concerns — not bulldozing opinion. Indian hierarchical culture sometimes discourages speaking up; show respectful persuasion skill valued innovation initiatives service companies digital transformation projects..',
      'medium',
    ),
    q(
      'Tell me about a time you had to adapt to unexpected change.',
      'Example: hackathon problem statement changed midnight 12 hours before submission pivoted from healthcare to edtech solution reusing authentication component adapting UI copy team regrouped delivered partial solution judges noted adaptability. Or COVID shifted project demo online rebuilt presentation format successful virtual defense. Emphasize calm reassessment reprioritization communication not complaining about unfair change. Campus behavioral mirrors agile respond-to-change-over-following-plan value. IT projects scope changes frequently client requests — prove flexible resilient candidate. Connect change adaptation positive outcome not just endured change survived narrative demonstrating proactive reframing opportunity within constraints..',
      'medium',
    ),
    q(
      'Describe a situation where you demonstrated attention to detail.',
      'Example: testing placement portal discovered edge case duplicate application when double-clicking submit button implemented debounce and server idempotency key preventing data corruption caught before production launch. Or proofread team report found calculation error CGPA average corrected before dean submission. Detail orientation prevents production bugs financial errors compliance failures. Campus quality mindset question — SDET roles emphasize further. Explain systematic approach checklist code review self-testing edge cases not accidental catch. Indian outsourcing reputation quality depends individual engineer rigor; demonstrate pride craftsmanship beyond minimum passing demo day requirements professor assignment..',
      'medium',
    ),
    q(
      'Tell me about a time you went above and beyond expectations.',
      'Example: internship task fix three bugs also documented root cause analysis preventing similar bugs team wiki volunteered help QA regression weekend before release manager acknowledged in evaluation letter. Balance beyond expectations not exploited unpaid overtime unhealthy — frame as chosen extra mile impactful not normalized crunch. Campus differentiation showing drive without burnout glorification. Quantify extra value bugs prevented documentation hours saved future developers. Above and beyond should connect organizational benefit not merely personal learning though both valid secondary mention — interviewers assess citizenship potential exceeding job description appropriately recognized performance reviews promotion considerations..',
      'medium',
    ),
    q(
      'Describe a time you had to make a decision with incomplete information.',
      'Example: production college website down day before fest no DBA available chose restore yesterday backup accepting loss four hour registrations versus debug unknown corruption risk hours — communicated trade-off stakeholders decided restore documented incident post-mortem. Explain decision framework: assess risk urgency available options consult available experts default reversible when possible. Campus mirrors on-call engineering judgment. Avoid paralysis analysis or reckless guessing — structured reasoning under uncertainty. Incomplete information constant software development ambiguous requirements — prove pragmatic decision maker documenting assumptions revisiting when data available Indian startup environments especially fast-moving lacking complete specs..',
      'medium',
    ),
    q(
      'Tell me about mentoring or helping someone else succeed.',
      'Example: tutored junior batchmates DSA weekly sessions twelve students improved mock test scores average 30 percent; paired with struggling lab partner explained pointers patiently both submitted assignment on time. Mentoring shows leadership empathy communication skills. Campus behavioral for senior associate tracks predicting people development capability. Focus on mentee outcome not your superiority. Workplace parallel onboarding buddy helping fresher navigate codebase code review teaching. Indian campus senpai culture strong — authentic helping examples resonate culturally. Avoid one-time answer copied homework — ethical mentoring teaching concepts not cheating violation academic integrity if discovered disqualifies candidate integrity assessments..',
      'medium',
    ),
    q(
      'Describe a time you managed multiple priorities successfully.',
      'Example: simultaneous internship part-time, final year project, and GATE preparation — created weekly schedule blocking deep work mornings, communicated availability clearly to manager, delivered internship sprint tasks project milestone GATE mock weekly without failing any commitment. Tools: calendar time blocking saying no low priority fest volunteer request. Campus time management essential placement season chaos multiple company tests overlapping. Demonstrate sustainable system not lucky week survived. HR assesses organizational skills preventing missed deadlines client deliverables after joining juggling learning project tasks certification study service company bench period before allocation..',
      'medium',
    ),
    q(
      'Tell me about a time you disagreed with a rule or policy.',
      'Choose respectful disagreement not rebellious violation: college required proprietary IDE disagreed preferring VS Code negotiated exception demonstrating equivalent linting output professor granted approval. Or company policy no remote work requested one WFH day exam discussed with manager hybrid compromise exam day. Never describe breaking policy secretly — integrity violation. Frame constructive dialogue proposing alternatives accepting final authority if denied. Campus behavioral tests professional dissent not blind obedience nor reckless rule breaking. Indian workplace hierarchy sensitive — show diplomatic challenge channel appropriate escalation HR manager not public Twitter rant damaging example..',
      'medium',
    ),
    q(
      'Describe a creative solution you implemented.',
      'Example: limited budget college event needed attendance tracking built QR check-in web app using free hosting tier Google Sheets backend zero cost tracked 800 attendees real-time dashboard impressed sponsors. Creativity resource constraints engineering ingenuity not artistic talent unless design role. Connect creative problem solving innovation value product companies seek. Campus hackathon culture celebrates creative hacks — strong example source. Explain why conventional solution infeasible constraints time money skills creative alternative satisfied core requirement. Balance creativity with maintainability — clever hack failing production load less impressive than boring reliable solution scaled; context appropriate college event versus banking core system..',
      'medium',
    ),
    q(
      'Tell me about a time you took ownership of a mistake.',
      'Example: accidentally pushed broken build demo environment during internship immediately notified team reverted commit within ten minutes wrote post-mortem proposed CI check preventing direct main push implemented pre-commit hook team adopted. Ownership means accountability transparent communication remediation prevention not hiding blaming deploy tool. Campus integrity critical — cover-ups worse than mistakes. Amazon leadership principle ownership heavily tested Indian Amazon campus loop. STAR result include systemic fix not just apology. Managers trust engineers owning mistakes learning publicly — cultural fit question Indian teams valuing psychological safety reporting errors early reducing production incident severity client escalation penalties service companies..',
      'medium',
    ),
    q(
      'Describe leading a project under resource constraints.',
      'Example: college fest app team two developers one designer one week deadline — scoped MVP login event schedule registration deferred notifications, reused UI component library, daily fifteen minute standups, shipped stable app 500 downloads event weekend zero critical crashes. Leadership under constraints prioritizes ruthlessly communicates clearly maintains morale. Campus senior SDE behavioral predicts tech lead trajectory. Discuss difficult scope cuts stakeholder negotiation professor accepted deferred features seeing MVP demo. Resource constraints mirror startup funding limits client fixed bid projects service companies — prove deliver value limited time people money not excuse incomplete delivery without communication stakeholders surprised demo day..',
      'hard',
    ),
    q(
      'Tell me about a time you influenced without authority.',
      'Example: cross-functional college magazine team developers designers conflict on timeline — no formal authority over designers facilitated workshop mapping dependencies agreed shared milestone calendar designers delivered assets two days earlier developers integrated smoothly magazine published schedule. Influence via relationship building data shared goals not title power. Workplace: convincing another team adopt your API standard through documentation benchmarks office hours not mandate. Campus Amazon influence without authority leadership principle explicit preparation. Detail specific influence tactics listening finding mutual win follow-up consistency — vague people liked me insufficient behavioral depth failing structured interview scoring rubrics requiring concrete actions observable outcomes..',
      'hard',
    ),
    q(
      'Describe navigating ambiguity in a project with unclear requirements.',
      'Example: client professor said build smart attendance system vague requirements — conducted user interviews three faculty clarified must work offline mobile spotty WiFi prototyped MVP gathered feedback iterated biometric QR hybrid final spec documented sign-off before full build avoided rework. Ambiguity navigation proactive clarification iterative delivery assumptions documented stakeholder alignment. Campus mirrors real client projects vague BRD documents service companies. Show comfort uncertainty structured reduction ambiguity not paralysis waiting perfect spec never arrives. Indian IT business analyst gap sometimes engineers clarify directly client calls — demonstrate communication courage asking dumb questions early saving expensive late rework change requests billing disputes.',
      'hard',
    ),
    q(
      'Tell me about a time you recovered a project heading toward failure.',
      'Example: final year project two weeks behind integration broken team morale low — called reset meeting reassessed scope cut ML fancy feature core working pipeline, assigned clear owners daily check-ins, pair programmed hardest integration bug fixed database schema mismatch, submitted working project scored A grade. Recovery leadership crisis management optimism realism balance. Campus behavioral senior track assessing project management potential. Honest about near failure severity without toxic blame narrative. Result quantified on-time submission grade restored team relationship. Mirror workplace sprint rescue manager appreciates engineer identifying death march early proposing recovery plan not silent until demo catastrophe day..',
      'hard',
    ),
    q(
      'Describe ethical dilemma you faced and how you handled it.',
      'Example: teammate suggested copying previous year project code verbatim for submission — refused explained plagiarism consequences offered help building original solution legitimately completed own implementation reported concern privately to guide if continued pressure. Ethical clarity with empathy offering constructive alternative. Workplace parallel: pressure ship feature skipping security review insisted documented risk sign-off manager delayed release fixed vulnerability. Campus integrity non-negotiable especially financial services hiring compliance culture. Never describe unethical choice you made and regretted unless profound reform story — chose right path under pressure stronger narrative Indian academic integrity placement cell strict plagiarism policies expulsion risk..',
      'hard',
    ),
    q(
      'Tell me about delivering bad news to stakeholders.',
      'Example: informed fest coordinator two days before event mobile app notification feature would not ship — prepared explanation scope underestimation API delay, proposed SMS fallback manual announcement plan coordinator accepted appreciated early warning adjusted publicity. Bad news delivery: early transparent options recommended not burying until last minute. Campus communication maturity — client calls delaying milestones require same skill TCS Infosys account managers engineers present technical delays professionally. STAR action include empathy stakeholder perspective solution orientation not merely announcing failure dropping problem. Frequency bad news delivery handled distinguishes senior engineers junior hiding status until escalation crisis..',
      'hard',
    ),
    q(
      'Describe building trust with someone skeptical of you.',
      'Example: new team member skeptical your coding ability after you joined mid-project — consistently delivered assigned modules early, requested code reviews welcomed criticism, helped debug their issue Saturday voluntarily, trust built collaboration smooth project success. Trust through competence reliability generosity over time not single conversation. Workplace: new hire proving value skeptical legacy team protecting territory. Campus diverse team dynamics regional language barriers initial skepticism overcome delivery consistency. Behavioral depth: specific skeptical behaviors how you responded measurable trust indicators them delegating critical task you afterward — trust outcome not just felt better relationship vague..',
      'hard',
    ),
    q(
      'Tell me about a long-term goal you pursued despite setbacks.',
      'Example: targeted Google internship rejected phone screen year one analyzed gap advanced DSA study 300 problems rebuilt system design knowledge re-applied year two reached onsite round fell short final feedback loop continued improving contributed open source project year three landed Amazon offer persistence payoff. Long-term goal narrative shows resilience growth trajectory not overnight success entitlement. Campus motivational arc inspiring HR panels remember candidate story among fifty interviews batch day. Balance ambition realism — setbacks genuine learning adjusted approach not identical retry blind. Connect goal pursuit skills role requires demonstrating marathon not sprint mentality career development Indian competitive placement landscape requiring multi-year preparation many successful candidates.',
      'hard',
    ),
    q(
      'Describe situation requiring balancing quality and speed.',
      'Example: hackathon 24 hours chose ship tested core user flow three features polished over six half-working features — wrote minimal unit tests critical payment calculation skipped nice CSS animations judges awarded reliability prize. Explain explicit trade-off reasoning stakeholders agreement definition done. Workplace sprint velocity versus tech debt balance — ship MVP with monitoring plan refactor next sprint documented. Campus Amazon bias action speed with quality bar calibration — too slow perfectionist fails startup too sloppy bugs fail enterprise client. Articulate quality non-negotiable areas security data integrity versus deferrable polish visual animations demonstrating engineering judgment Indian product company CI gates automated tests non-negotiable quality definition.',
      'hard',
    ),
    q(
      'Tell me about a time you had to learn from a teammate who was more skilled than you.',
      'Use STAR: Situation—joined hackathon team with senior who knew React deeply while you knew only basics. Task—deliver frontend dashboard in 48 hours. Action—asked specific code review questions, paired on hardest component, documented patterns they taught, volunteered testing so they focused architecture. Result—delivered on time, improved React skills measurably, maintained friendship, later referred you internship. Campus behavioral assesses humility coachability essential for fresher joining experienced teams. Avoid envy or passive acceptance—show active learning. Indian IT fresher training assumes steep learning curve; prove you accelerate by leveraging others expertise respectfully not silently struggling or copying without understanding..',
      'hard',
    ),
  ],
};
