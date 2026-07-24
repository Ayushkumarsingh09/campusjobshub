import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const REACT_BANK: InterviewTopicBank = {
  topic: 'React',
  topicSlug: 'react',
  questions: [
    q(
      'What is React and why is it popular for frontend development?',
      'React is a JavaScript library for building user interfaces using reusable components and declarative rendering. Facebook maintains it; Indian startups and service companies hire React developers extensively for web dashboards and SPAs. React updates the DOM efficiently through a virtual DOM diffing algorithm. Component-based architecture maps well to design systems and campus project modules like job cards and application forms. React ecosystem includes React Router for navigation, Redux or Context for state, and Next.js for SSR. Campus placements prioritize React alongside JavaScript fundamentals for frontend and full-stack roles.',
      'easy',
    ),
    q(
      'What is JSX in React?',
      'JSX is a syntax extension letting you write HTML-like markup inside JavaScript. Babel transpiles JSX to React.createElement calls producing virtual DOM elements. JSX requires single parent element or React Fragment. Embed expressions with curly braces {student.name}. className replaces HTML class; htmlFor replaces for attribute. JSX prevents injection attacks by escaping values by default. Campus interviews ask difference between JSX and HTML and why JSX improves readability over manual createElement chains in large placement portal component trees with conditional rendering of application status badges.',
      'easy',
    ),
    q(
      'What is the difference between functional and class components?',
      'Class components extend React.Component with render method and this.state — legacy pattern before hooks. Functional components are plain functions returning JSX — simpler, less boilerplate, preferred in modern React. Hooks like useState and useEffect give functional components state and lifecycle behavior. Class components use lifecycle methods componentDidMount; hooks use useEffect with dependency array. Campus interviews expect new projects use functional components exclusively unless maintaining legacy codebases at Wipro or Infosys client projects still on older React versions.',
      'easy',
    ),
    q(
      'What are props in React?',
      'Props are read-only inputs passed from parent to child components defining configuration and data flow. Pass props as attributes: <JobCard title={job.title} ctc={job.ctc} />. Access via function parameter destructuring: function JobCard({ title, ctc }). Props enable component reusability — same JobCard renders different jobs. Default props or default parameter values handle missing data. PropTypes or TypeScript interfaces document expected shapes. Campus interviews stress props flow down, events flow up — unidirectional data flow core React principle preventing spaghetti state mutations in team placement portal projects.',
      'easy',
    ),
    q(
      'What is state in React and how do you update it?',
      'State is mutable data local to a component causing re-render when changed. useState hook returns [value, setter]: const [count, setCount] = useState(0). Never mutate state directly — setCount(count + 1) or functional update setCount(c => c + 1) when depending on previous value. State updates may batch asynchronously in React 18. Lifting state up shares data between siblings via common parent. Campus coding asks counter, toggle, and form input controlled components where value and onChange bind to state — fundamental pattern in every React technical round.',
      'easy',
    ),
    q(
      'What is the virtual DOM and how does React use it?',
      'Virtual DOM is a lightweight JavaScript representation of real DOM tree. On state change React builds new virtual tree, diffs with previous using reconciliation algorithm, and applies minimal DOM updates. This batches changes efficiently versus manual DOM manipulation. React Fiber architecture enables incremental rendering and priority scheduling. Virtual DOM is not always faster than direct DOM for simple updates but scales better for complex UIs. Campus interviews clarify React optimizes developer experience and predictable updates; raw DOM still faster for single element change if measured in isolation.',
      'easy',
    ),
    q(
      'What are keys in React lists and why are they important?',
      'Keys help React identify which list items changed, added, or removed during reconciliation. Provide stable unique key prop: jobs.map(job => <JobRow key={job.id} ... />). Avoid array index as key when list reorders, filters, or inserts — causes wrong component state association and performance issues. Keys must be unique among siblings not globally. Campus bug scenarios show input state jumping between rows when using index keys in editable application list — fix with database id keys demonstrating practical understanding beyond documentation recitation.',
      'easy',
    ),
    q(
      'What is conditional rendering in React?',
      'Render different UI based on conditions using JavaScript inside JSX: ternary operator condition ? <A /> : <B />, logical AND condition && <Message />, or early return if (!user) return <Login />. Switch statements or object maps handle multiple states like application status pending, shortlisted, rejected. Avoid nesting too many ternaries — extract subcomponents. Campus interviews ask show loading spinner while fetching jobs, error message on failure, and list on success — standard data fetching UI pattern testing conditional rendering and component composition skills together.',
      'easy',
    ),
    q(
      'What is an event handler in React?',
      'Event handlers respond to user interactions like onClick, onChange, onSubmit. Pass function reference not invocation: onClick={handleApply} not onClick={handleApply()}. Synthetic events wrap native events for cross-browser consistency. Prevent default with e.preventDefault() in form submit. Pass arguments using arrow wrapper: onClick={() => applyToJob(job.id)}. Campus forms interview builds job application form with validation on submit, controlled inputs updating state on change, and disabled submit button while API request in flight — combines events, state, and async patterns.',
      'easy',
    ),
    q(
      'What is React Fragment and why use it?',
      'Fragment lets you group multiple elements without adding extra DOM node like div wrapper. Syntax: <>...</> or <React.Fragment key={id}> when key needed. Avoids invalid HTML from nested divs breaking CSS grid or flex layouts. Useful returning multiple table rows or list items from map without tbody wrapper violations. Campus layout questions ask render job title and company side by side without breaking semantic HTML structure — Fragment preserves accessibility tree cleanliness compared to meaningless wrapper divs affecting screen reader navigation in inclusive campus hiring platforms.',
      'easy',
    ),
    q(
      'Explain the useEffect hook and its dependency array.',
      'useEffect runs side effects after render — data fetching, subscriptions, DOM sync. Syntax: useEffect(() => { ...; return cleanup; }, [deps]). Empty deps [] runs once on mount like componentDidMount. Omitting deps runs every render — usually unintentional. Cleanup function runs before next effect and unmount — clear intervals, abort fetch. Include all reactive values used inside effect in dependency array per exhaustive-deps lint rule. Campus interviews debug infinite loop from missing deps causing repeated fetch or wrong deps triggering stale closure showing outdated application status after API update..',
      'medium',
    ),
    q(
      'What is lifting state up in React?',
      'When sibling components need shared data, move state to closest common parent and pass down via props. Parent owns canonical state; children receive values and callback props to request updates. Example: FilterBar and JobList share searchQuery state in JobsPage parent. Avoid duplicating state that can desync. Context API reduces prop drilling for deeply nested trees. Campus architecture questions design placement dashboard with sidebar filters and main content sharing filter state — lifting state up is first solution before introducing global state management complexity prematurely in college projects..',
      'medium',
    ),
    q(
      'What is the Context API and when should you use it?',
      'Context provides way to pass data through component tree without prop drilling at every level. Create context with createContext, provide value with Provider, consume with useContext hook. Suitable for theme, auth user, locale — infrequently changing global data. Overusing context causes unnecessary re-renders when value changes — split contexts by concern. Not replacement for all state management — local state and lifted state often suffice. Campus interviews contrast Context with Redux for placement app auth session — Context adequate for user object; Redux or Zustand better for complex application workflow state with middleware and devtools..',
      'medium',
    ),
    q(
      'Explain controlled versus uncontrolled components.',
      'Controlled components bind input value to React state with onChange updating state — single source of truth enabling validation and conditional disable. Uncontrolled components store value in DOM ref accessed via useRef — simpler for one-off forms, file inputs. React recommends controlled for most forms. defaultValue sets initial uncontrolled value. Campus form validation interview implements CGPA input controlled with regex validation on change and submit blocking invalid values. Discuss hybrid: controlled text fields with uncontrolled file upload ref for resume PDF in application form — practical full-stack form handling pattern..',
      'medium',
    ),
    q(
      'What are React hooks rules and why do they exist?',
      'Rules: only call hooks at top level of function components or custom hooks — not inside loops, conditions, or nested functions. Only call from React function components or custom hooks. Rules ensure hooks called same order every render so React associates state correctly with hook calls. Violating rules causes state mismatch bugs. ESLint plugin react-hooks/rules-of-hooks enforces compliance. Campus interviews ask why conditional useState breaks component and how custom hooks extract reusable logic like useFetchJobs encapsulating loading, error, and data state shared across placement pages..',
      'medium',
    ),
    q(
      'What is React.memo and useMemo?',
      'React.memo is higher-order component preventing re-render if props shallow equal previous — optimize pure presentational components like JobCard receiving stable props. useMemo caches expensive computation result between renders when dependencies unchanged: useMemo(() => filterJobs(jobs, query), [jobs, query]). useCallback memoizes function reference: useCallback(() => apply(id), [id]) stabilizing props to memoized children. Premature optimization adds complexity — profile first. Campus performance questions ask when memo helps large job lists with expensive filter versus when shallow compare overhead exceeds benefit for simple components re-rendering cheaply anyway..',
      'medium',
    ),
    q(
      'How does React Router work for SPA navigation?',
      'React Router maps URL paths to components without full page reload. BrowserRouter uses HTML5 history API; Routes and Route define path-component mapping; Link navigates declaratively; useNavigate programmatic navigation; useParams reads URL parameters like /jobs/:id. Nested routes render outlet in layout components. Protected routes check auth before rendering dashboard. Campus full-stack project structure: public routes login/register, private routes applications profile using wrapper component redirecting unauthenticated users — standard pattern interviewers expect in final-year placement portal React frontend demonstration..',
      'medium',
    ),
    q(
      'What is prop drilling and how do you solve it?',
      'Prop drilling passes props through many intermediate components that do not use them solely to reach deep child — verbose and brittle refactoring. Solutions: lift state only as needed, Context API for global auth theme, component composition passing children or render props, state management libraries Redux Zustand Jotai. Colocate state closest to usage. Campus design review identifies drilling in deeply nested application status timeline — refactor using Context for current user or composition passing StatusTimeline directly as child of page avoiding intermediate layout props forwarding five levels deep..',
      'medium',
    ),
    q(
      'Explain error boundaries in React.',
      'Error boundaries are class components implementing getDerivedStateFromError or componentDidCatch catching JavaScript errors in child component tree during render — not event handlers or async code. Display fallback UI instead of crashing entire app. React 19 improves error handling but boundaries remain class-based currently. Wrap route sections or third-party widgets in boundaries isolating failures. Log errors to monitoring service in componentDidCatch. Campus production readiness questions ask prevent white screen when job API component throws — wrap JobList in ErrorBoundary showing retry button and logging to Sentry for placement portal reliability during demo day..',
      'medium',
    ),
    q(
      'What is the difference between useRef and useState?',
      'useState triggers re-render on update; useRef mutating .current does not cause re-render. useRef persists value across renders like instance variable. Common uses: DOM element reference for focus management, storing previous value, timer IDs, mutable values not affecting UI. Access input focus: const ref = useRef(); ref.current.focus(). Campus interviews ask store interval ID in ref for cleanup in useEffect return clearInterval. Contrast storing render count in ref versus state — ref change invisible until something else triggers render demonstrating when each hook appropriate..',
      'medium',
    ),
    q(
      'Explain React reconciliation and the role of Fiber architecture.',
      'Reconciliation compares new element tree with previous determining minimal DOM updates. Elements of different type unmount and remount — key prevents wrong reuse. Fiber splits rendering into units pausable across frames preventing main thread blocking on large updates. Priority lanes schedule urgent updates like input ahead of expensive list renders. Concurrent features in React 18 include useTransition marking non-urgent state updates and Suspense for async component loading. Campus senior frontend interviews explain why key stability matters for Fiber reuse and how startTransition keeps search input responsive while filtering thousands of campus job records without jank..',
      'hard',
    ),
    q(
      'How would you optimize a React application with large job listing pages?',
      'Virtualize list with react-window rendering only visible rows reducing DOM nodes. Paginate or infinite scroll server-side limiting data fetched. Memoize JobCard with React.memo when props stable; stabilize callbacks with useCallback. Code split routes with React.lazy and Suspense reducing initial bundle. Prefetch next page on scroll proximity. Debounce search filter; useTransition for filter updates. Optimize images lazy loading and CDN. Profile with React DevTools Profiler identifying slow components. Server render critical content with Next.js for SEO. Campus architecture answer covers measurement-driven optimization for placement portal handling 10k jobs — demonstrates senior frontend thinking beyond blindly wrapping everything in memo..',
      'hard',
    ),
    q(
      'Compare Redux, Context, and Zustand for state management.',
      'Redux centralizes state in single store with pure reducers and actions — excellent devtools, middleware for async thunks, predictable but verbose boilerplate. Context simple for low-frequency global data but re-renders all consumers on any context value change unless split. Zustand minimal API with selector-based subscriptions re-rendering only components using changed slice — popular modern alternative. Redux Toolkit reduces Redux boilerplate. Campus project scoping: Context for auth theme; Zustand for application wizard multi-step form; Redux for complex enterprise dashboard with time-travel debugging. Justify choice by update frequency, team familiarity, and devtools needs — not hype..',
      'hard',
    ),
    q(
      'Explain custom hooks design for data fetching with caching.',
      'Custom hook useJobs(params) encapsulates loading, error, data state, refetch function, and abort controller cleanup in useEffect. Cache layer with Map keyed by serialized params returning stale data while revalidating. Expose isValidating separate from isLoading for background refresh UX. Handle race conditions ignoring stale responses when params change faster than network. Integrate SWR or React Query patterns if allowed — otherwise implement minimal version demonstrating understanding. Campus full-stack interviews expect hook abstraction over raw useEffect in every component — reusable useApplications(studentId) shared across profile and dashboard pages with consistent error handling and cache invalidation after mutation..',
      'hard',
    ),
    q(
      'What are render props and compound components patterns?',
      'Render props: component accepts function prop child rendering based on internal state — <DataFetcher render={({ data, loading }) => ...} /> sharing logic flexibly. Compound components: related components share implicit state via Context — <Select><Select.Option /><Select.Dropdown /></Select> composable API like HTML select. Both improve reusability versus prop explosion. Headless UI libraries use these patterns. Campus component design interview build Tabs component with TabList Tab Panels using compound pattern and Context — tests API design skills for design system contributions at product companies hiring frontend engineers from campus..',
      'hard',
    ),
    q(
      'How does Server Components differ from Client Components in Next.js App Router?',
      'Server Components render on server, send serialized output to client — zero JavaScript bundle for static content, direct database access without API layer, SEO friendly. Client Components marked use client for interactivity hooks browser APIs event handlers. Compose Server Components importing Client Components as leaves not vice versa. Reduces client bundle for job listing pages rendering static headers server-side while Client Component handles apply button modal. Campus Next.js questions explain when placement job detail page should be Server Component fetching SQL directly versus Client Component for bookmark toggle — architecture decision reflecting modern React 18 plus full-stack hiring expectations..',
      'hard',
    ),
    q(
      'Explain Strict Mode double rendering and its purpose.',
      'React Strict Mode in development intentionally double-invokes render, setState updaters, and effects to detect impure render side effects and missing cleanup. Effects mount unmount remount simulating future offscreen API behavior. Production does not double render. Campus debugging questions explain why useEffect runs twice locally causing duplicate fetch — not a bug but Strict Mode surfacing missing abort cleanup. Proper fetch pattern uses AbortController cancelled in cleanup preventing duplicate submissions. Shows maturity distinguishing development artifacts from production bugs during Infosys and Microsoft frontend loop interviews..',
      'hard',
    ),
    q(
      'Design component architecture for a campus placement dashboard.',
      'Layer pages (DashboardPage), feature containers (ApplicationsContainer fetching data), presentational components (ApplicationTable, StatusBadge), shared UI (Button, Modal), hooks (useApplications, useAuth), services (apiClient), and types. Colocate feature files or use feature folders applications/components hooks. ErrorBoundary per route section. Lazy load admin analytics chunk. Context for auth; Zustand for filter state persisted to URL query params. Testing: unit test StatusBadge mapping; integration test ApplicationTable with MSW mocking API. Campus system design frontend evaluates separation of concerns, scalability for new modules internships offers, and accessibility WCAG compliance — comprehensive answer for senior campus hire frontend architecture round..',
      'hard',
    ),
    q(
      'How would you implement authentication flow in React SPA securely?',
      'Store JWT in memory or httpOnly cookie not localStorage preventing XSS token theft — prefer cookie with SameSite Strict and CSRF token for mutating requests. AuthContext provides user and login logout; ProtectedRoute redirects unauthenticated to login preserving return URL. Refresh token rotation with silent refresh endpoint. Axios interceptor attaches Authorization header and handles 401 redirect logout. Avoid storing sensitive data in Redux persist. Campus security questions beyond basic login form — discuss XSS CSRF mitigation, token expiry handling mid-session during long placement test, and Content Security Policy headers — differentiates security-aware candidates in product company frontend interviews..',
      'hard',
    ),
    q(
      'How do you test React components effectively?',
      'Use React Testing Library focusing user-visible behavior not implementation details—render components, query by role/label, simulate clicks and typing, assert outcomes. Mock network with MSW for integration tests of job listing fetches. Unit test pure utilities and custom hooks with renderHook. Snapshot tests sparingly for stable UI fragments. E2E with Playwright for critical flows application submit login. Test accessibility with jest-axe. Campus senior frontend rounds ask testing strategy beyond manual QA—explain pyramid many unit few E2E, CI running tests on PR, and testing error loading empty states not just happy path for placement dashboard reliability during demo and production..',
      'hard',
    ),
  ],
};
