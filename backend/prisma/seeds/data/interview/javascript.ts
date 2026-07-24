import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const JAVASCRIPT_BANK: InterviewTopicBank = {
  topic: 'JavaScript',
  topicSlug: 'javascript',
  questions: [
    q(
      'What is JavaScript and how does it run in the browser?',
      'JavaScript is a high-level, interpreted language that makes web pages interactive. Browsers include a JavaScript engine — V8 in Chrome, SpiderMonkey in Firefox — that parses, compiles, and executes JS code. HTML provides structure, CSS styling, and JavaScript behavior via DOM manipulation and event handling. Scripts load via script tags with defer or async attributes affecting execution order. Node.js runs the same language on servers using V8 without a browser. Campus frontend and full-stack interviews at virtually every Indian IT company test JavaScript fundamentals alongside React or Angular frameworks.',
      'easy',
    ),
    q(
      'What is the difference between var, let, and const?',
      'var is function-scoped and hoisted with undefined initialization — can be redeclared in same scope causing bugs. let and const are block-scoped, hoisted but in temporal dead zone until declaration — cannot be redeclared in same scope. const prevents reassignment of binding but object contents remain mutable. Use const by default, let when reassignment needed, avoid var in modern code. Campus interviews ask predict output loops with var versus let in setTimeout callbacks — classic closure and scope question appearing in TCS CodeVita and Infosys SPARK registration tests.',
      'easy',
    ),
    q(
      'Explain data types in JavaScript: primitives versus objects.',
      'Primitive types are string, number, boolean, undefined, null, symbol, and bigint — stored by value, immutable. Objects including arrays, functions, and dates are reference types stored by reference — copying assigns pointer not deep clone. typeof null returns object — historical bug. typeof function returns function. Array.isArray distinguishes arrays from objects. Strict equality === avoids type coercion surprises. Campus coding rounds test typeof checks and reference equality when comparing arrays — [1,2] === [1,2] is false because different references.',
      'easy',
    ),
    q(
      'What is the DOM and how do you select elements?',
      'The Document Object Model is a tree representation of HTML that JavaScript can read and modify. Selection methods include document.getElementById, getElementsByClassName, querySelector for CSS selectors, and querySelectorAll for NodeLists. Properties like textContent, innerHTML, and classList modify content and styling. createElement and appendChild build dynamic UI. Event listeners attach via addEventListener on selected nodes. Campus frontend interviews ask build a todo list or filter table rows using DOM APIs before React abstraction — tests fundamental web knowledge expected in Wipro and Capgemini UI developer tracks.',
      'easy',
    ),
    q(
      'What are truthy and falsy values in JavaScript?',
      'Falsy values convert to false in boolean context: false, 0, -0, 0n, empty string, null, undefined, and NaN. All other values including empty arrays [], empty objects {}, and string "0" are truthy. Logical operators && and || return operand values not booleans — used for conditional defaults: name = input || "Guest". Nullish coalescing ?? only defaults on null or undefined, preserving 0 and empty string. Campus trick questions test if ([]) and if ({}) both true. Understanding truthiness prevents bugs in form validation on placement portal search filters.',
      'easy',
    ),
    q(
      'What is an arrow function and how does it differ from regular functions?',
      'Arrow functions use concise syntax: const add = (a, b) => a + b. They lack own this binding — inherit this from enclosing lexical scope, fixing callback this bugs in event handlers. Cannot be used as constructors with new. No arguments object — use rest parameters instead. Implicit return for single expressions without braces. Campus interviews contrast arrow functions in React class versus functional components and warn against arrow functions as object methods when dynamic this is needed — use regular methods or bind in class components.',
      'easy',
    ),
    q(
      'What is JSON and how do you parse and stringify it?',
      'JSON (JavaScript Object Notation) is a text format for structured data exchange between client and server. JSON.stringify converts JavaScript objects to JSON strings for API requests. JSON.parse converts JSON strings back to objects — throws on invalid JSON. JSON supports objects, arrays, strings, numbers, booleans, and null — not undefined, functions, or Date objects without custom serialization. Campus full-stack projects use fetch API with JSON bodies for placement application submission. Interviewers ask handle parse errors with try/catch and validate API responses before accessing nested properties.',
      'easy',
    ),
    q(
      'What is event bubbling and event capturing?',
      'Events propagate in three phases: capturing from root to target, target phase, then bubbling from target to root. addEventListener third parameter true enables capturing; default false uses bubbling. event.stopPropagation prevents further propagation. event.preventDefault stops default browser behavior like form submit or link navigation. Delegation attaches one listener on parent handling child events via event.target — efficient for dynamic lists. Campus UI questions ask implement click on table rows using delegation for job listing tables rendered from API data without per-row listeners.',
      'easy',
    ),
    q(
      'What is the difference between null and undefined?',
      'undefined means a variable declared but not assigned, missing object property, or function with no return value. null is an intentional absence of value assigned by programmer. typeof undefined is undefined; typeof null is object. Equality null == undefined is true with loose equality but false with strict ===. JSON.stringify omits undefined properties but includes null. Campus interviews use this distinction in API design — return null for known empty profile photo URL versus omit field meaning not set. Defensive coding checks both when validating optional student profile fields.',
      'easy',
    ),
    q(
      'What are template literals in JavaScript?',
      'Template literals use backticks for strings supporting multiline content and interpolation via ${expression} syntax. Example: `Hello ${student.name}, your CGPA is ${cgpa}`. Nested expressions can call functions. Tagged templates process literals with custom functions for advanced use cases. They replace error-prone string concatenation with + operator. Campus coding prefers template literals for building dynamic HTML snippets and API URLs with query parameters in Node.js Express routes — cleaner than concatenation especially with multiple variables in placement dashboard notifications.',
      'easy',
    ),
    q(
      'Explain closures in JavaScript with a practical example.',
      'A closure is a function that retains access to variables from its outer lexical scope even after the outer function returns. Example: function counter() { let count = 0; return function() { return ++count; }; } const inc = counter(); inc() returns 1, inc() returns 2 — count is private. Closures enable data privacy, factory functions, and partial application. Common interview bug: loop var i in setTimeout printing same value — fix with let or IIFE closure. React hooks rely on closures capturing state. Campus interviews at product companies expect closure explanation for module pattern and debounce implementations in search input components.',
      'medium',
    ),
    q(
      'What is the JavaScript event loop?',
      'The event loop coordinates call stack execution with task queues. Synchronous code runs on call stack until empty. Asynchronous callbacks from setTimeout, promises, and IO enqueue in macrotask or microtask queues. After each stack turn, all microtasks (promise then) run before next macrotask. This explains why Promise.resolve().then runs before setTimeout(..., 0). Non-blocking IO lets Node.js handle concurrent requests on single thread. Campus interviews ask predict output ordering of mixed sync, promise, and timeout code — standard question at Paytm and PhonePe JavaScript rounds testing async fundamentals beyond syntax memorization..',
      'medium',
    ),
    q(
      'Explain prototypal inheritance in JavaScript.',
      'Every object has internal [[Prototype]] link accessed via Object.getPrototypeOf or __proto__. Property lookup walks prototype chain until found or null. Functions have prototype property used when constructed with new — instance.__proto__ equals Constructor.prototype. Object.create(proto) creates object with specified prototype. Class syntax in ES6 is sugar over constructor functions and prototypes. Method sharing via prototype saves memory versus copying methods per instance. Campus OOP questions ask implement inheritance without class keyword using Object.create or constructor.prototype.method assignment — tests deep understanding for senior frontend roles beyond React component usage..',
      'medium',
    ),
    q(
      'What are Promises and async/await?',
      'Promises represent eventual completion or failure of async operations with states pending, fulfilled, or rejected. .then handles success, .catch handles errors, .finally runs cleanup. async functions return promises; await pauses within async function until promise settles, writing async code synchronously. Promise.all runs parallel tasks failing fast; Promise.allSettled waits for all regardless of failure. Campus coding uses async/await with fetch for REST APIs in placement projects. Interviewers ask convert callback pyramid to promises, handle errors with try/catch in async functions, and avoid awaiting inside loops sequentially when parallel execution is intended..',
      'medium',
    ),
    q(
      'Explain this keyword binding rules in JavaScript.',
      'this depends on call site not definition: default binding — global or undefined in strict mode; implicit binding — object before dot; explicit binding — call, apply, bind set this; new binding — new creates fresh object as this; arrow functions inherit lexical this from enclosing scope. Losing this occurs extracting method reference — fix with bind. Campus interviews demonstrate each rule with code snippets and connect to React class component this.handleClick = this.handleClick.bind(this) pattern before hooks eliminated the issue. Understanding binding prevents subtle bugs in event handlers and callback passing in Node.js Express middleware..',
      'medium',
    ),
    q(
      'What is hoisting in JavaScript?',
      'Hoisting moves declarations to top of scope during compilation phase — not execution. var declarations hoist initialized undefined; function declarations hoist fully. let and const hoist but stay in temporal dead zone until line executes — accessing before throws ReferenceError. Function expressions with var hoist undefined variable not function body. Campus output prediction questions show hoisting interactions: console.log(x); var x = 5 prints undefined not error. Interviewers expect recommendation use let/const and declare before use to avoid hoisting confusion in large placement portal codebase maintenance..',
      'medium',
    ),
    q(
      'What are ES6 modules import and export?',
      'ES modules use export to expose bindings — named export export const PI = 3.14 or default export export default function. import loads modules — import { PI } from "./math.js" or import math from "./math.js" for default. Modules are strict mode, statically analyzed enabling tree shaking, and deferred in browsers. CommonJS require/module.exports still used in older Node code; modern Node supports ESM with "type": "module". Campus full-stack interviews ask structure utils, services, and components in separate modules. Circular dependency issues require refactoring shared code to third module — advanced follow-up in webpack bundler discussions..',
      'medium',
    ),
    q(
      'Explain debouncing and throttling for frontend performance.',
      'Debouncing delays function execution until pause in calls — search input waits 300ms after last keystroke before API call, reducing server load. Throttling limits execution rate — scroll handler fires at most once per 100ms for infinite job list loading. Implement debounce with setTimeout clearing previous timer; throttle with last-run timestamp or requestAnimationFrame. lodash debounce and throttle utilities are common. Campus frontend performance questions ask implement debounce from scratch in interviews. React useEffect cleanup clears timeout on dependency change. Proper use prevents placement search API flooding during campus fest demo with hundreds of concurrent users typing simultaneously..',
      'medium',
    ),
    q(
      'What is the spread operator and rest parameters?',
      'Spread ... expands iterables — copy array [...arr], merge objects {...obj1, ...obj2}, pass array elements as arguments Math.max(...nums). Rest collects remaining arguments into array: function sum(...args) and destructuring const [first, ...rest] = arr. Spread creates shallow copies — nested objects still shared references. Common in React state updates: setState(prev => ({...prev, name: value})). Campus interviews ask clone array without mutation for immutable patterns in Redux reducers. Distinguish rest parameters in function signature versus spread in call sites — terminology confuses many candidates in HCL and Tech Mahindra JavaScript assessments..',
      'medium',
    ),
    q(
      'How does JavaScript handle equality with == versus ===?',
      '=== strict equality checks type and value without coercion — preferred default. == loose equality coerces types: "5" == 5 is true; null == undefined is true; false == 0 is true. Coercion rules follow abstract equality algorithm with surprising results like [] == false. Object.is treats NaN as equal to NaN unlike ===. Campus trick questions test == chains; interviewers expect === everywhere except null check pattern. Understanding coercion helps debug API responses where string "true" from query params fails strict boolean check — use explicit conversion Boolean() or comparison..',
      'medium',
    ),
    q(
      'Explain memory management and garbage collection in JavaScript.',
      'JavaScript engines allocate objects on heap and reclaim unreachable objects via garbage collection — mark-and-sweep identifies objects not reachable from roots. Memory leaks occur when references remain: forgotten event listeners, global variables, closures holding large DOM nodes, and unbounded caches. WeakMap and WeakSet allow GC of keys when no other references exist. Campus senior frontend interviews ask diagnose memory leak in SPA using Chrome DevTools heap snapshots comparing retained object growth after navigation. Node.js servers leak memory from global arrays accumulating request logs — discuss monitoring and bounded LRU caches for session data in placement backend services..',
      'hard',
    ),
    q(
      'What is the module pattern and revealing module pattern?',
      'Module pattern uses IIFE or closures to create private variables and expose public API: const counter = (function() { let count = 0; return { increment() { return ++count; }, get() { return count; } }; })(); Private count cannot be accessed directly. Revealing module pattern returns object referencing private functions assigned to public names. ES modules largely replace this pattern but understanding underpins bundler scope and Node.js encapsulation. Campus architecture interviews connect module pattern to separation of concerns in placement app: authService module exposing login/logout hiding token storage implementation — demonstrates JavaScript design without framework dependency..',
      'hard',
    ),
    q(
      'How would you implement Promise.all from scratch?',
      'Track results array, resolved count, and rejection flag. Map input promises wrapping non-promises with Promise.resolve. For each promise attach then to store result at index and increment count — when count equals length resolve results array. First rejection immediately rejects combined promise. Handle empty input resolving to []. Edge cases: maintain result order despite completion order using index storage. Campus async interviews at Razorpay test this implementation plus discuss Promise.allSettled differences and why all fails fast unsuitable when partial success acceptable like fetching multiple job board APIs where some sources may timeout without failing entire dashboard load..',
      'hard',
    ),
    q(
      'Explain currying and partial application in JavaScript.',
      'Currying transforms function f(a,b,c) into f(a)(b)(c) returning nested unary functions. Partial application fixes some arguments producing new function with fewer parameters: const multiplyBy5 = multiply.bind(null, 5). Currying enables reusable specialized functions and functional composition. lodash curry utility helps. Use cases: configure API client with base URL then call endpoints with remaining params. Campus functional programming questions ask implement curry generic function and discuss trade-off — curried functions aid reusability but hurt readability in imperative codebases. Connect to React hooks custom useApi(baseUrl) returning fetch functions — practical currying application in frontend architecture interviews..',
      'hard',
    ),
    q(
      'What are Proxy and Reflect in ES6 and their use cases?',
      'Proxy wraps object intercepting operations like get, set, has, deleteProperty via handler traps. Enables validation, logging, reactive data binding — Vue 3 reactivity uses Proxy. Reflect provides methods mirroring proxy traps with consistent return behavior. Example: validate property assignment rejecting invalid CGPA values on student object proxy. Campus advanced JavaScript asks implement observable object firing callbacks on property changes without libraries — tests Proxy understanding valued in framework contribution roles. Discuss performance overhead versus manual getters/setters and security implications of proxying untrusted objects in browser extensions..',
      'hard',
    ),
    q(
      'How does JavaScript handle concurrency in Node.js versus browser?',
      'Browser JavaScript is single-threaded per tab with Web Workers for parallel CPU tasks communicating via postMessage without shared memory except SharedArrayBuffer. Main thread handles DOM — never block with heavy computation. Node.js single-threaded event loop handles IO concurrency; worker_threads module runs CPU-intensive tasks in parallel isolating V8 instances. cluster module forks processes for multi-core utilization. Campus full-stack design for file upload virus scanning: offload to worker thread preventing API latency spikes during placement document verification peak. Contrast with Java thread pools — Node excels IO-bound API gateways, less ideal CPU-bound report generation without workers..',
      'hard',
    ),
    q(
      'Explain event delegation implementation for dynamic job listing table.',
      'Attach single click listener on tbody element. On event, check event.target matches tr or button using closest("tr") traversing up DOM. Read data-job-id from data attributes set during render. Handle action buttons separately checking target.classList.contains. Benefits: works for rows added after initial render via pagination without rebinding listeners; fewer memory listeners. Prevent issues: ignore clicks on non-row elements; use event.target versus currentTarget correctly. Campus frontend practical asks rebuild without React testing vanilla JS skills. Mention accessibility: keyboard navigation requires separate keydown handling — delegation handles click only, showing mature UI engineering beyond minimum answer..',
      'hard',
    ),
    q(
      'Design a client-side caching layer for placement API responses.',
      'Implement cache Map with key URL plus serialized query params mapping to { data, expiry, etag }. On request check cache hit and TTL validity — return cached data if fresh. Stale-while-revalidate serves stale data immediately while background fetch updates cache. Use If-None-Match header with ETag for conditional requests returning 304 saving bandwidth. LRU eviction when cache exceeds max entries. Separate caches for job listings (short TTL) versus static skill taxonomy (long TTL). Persist critical cache to sessionStorage for page reload resilience. Campus system design evaluates trade-offs: memory versus freshness, cache invalidation on application submit mutation, and race conditions when parallel requests populate same key — demonstrate production frontend architecture thinking.',
      'hard',
    ),
    q(
      'Compare microtask and macrotask queues with detailed execution ordering example.',
      'Synchronous: console.log(1). Macrotask: setTimeout(() => console.log(2)). Microtask: Promise.resolve().then(() => console.log(3)). More sync: console.log(4). Output: 1, 4, 3, 2. After sync stack clears, engine drains entire microtask queue including microtasks scheduled by other microtasks before next macrotask. queueMicrotask schedules explicit microtasks. MutationObserver callbacks are microtasks. setImmediate in Node is macrotask between phases. Campus senior async interviews use extended examples with async/await desugaring to promises — await splits function continuing in microtask. Understanding ordering debugs React 18 automatic batching and unexpected state update sequencing in placement dashboard filters applying multiple setState calls..',
      'hard',
    ),
    q(
      'How do you structure a large JavaScript codebase for maintainability?',
      'Organize by feature folders containing components, hooks, services, and tests colocated. Enforce ESLint and Prettier for consistency; TypeScript adds compile-time safety. Separate pure utilities from side-effect services API clients. Use barrel exports sparingly to avoid circular dependencies. Lazy-load routes and heavy modules reducing initial bundle. Document public module boundaries; avoid deep imports into internal files. Consistent naming and single responsibility per file ease onboarding. Campus frontend architecture interviews expect you to describe how your placement portal scaled from monolithic app.js to feature modules with shared design tokens—demonstrating maintainability thinking valued at product companies hiring campus React developers..',
      'hard',
    ),
  ],
};
