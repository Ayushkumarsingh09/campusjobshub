import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const NODEJS_BANK: InterviewTopicBank = {
  topic: 'Node.js',
  topicSlug: 'nodejs',
  questions: [
    q(
      'What is Node.js and why is it used for backend development?',
      'Node.js is a JavaScript runtime built on Chrome V8 engine enabling server-side development with same language as frontend. It uses non-blocking event-driven architecture ideal for IO-heavy applications like REST APIs, real-time chat, and file uploads. npm provides vast package ecosystem. Indian startups and product companies hire Node.js developers for microservices and Express or NestJS backends. Campus full-stack projects commonly pair React frontend with Node API. Node excels at concurrent connections but less ideal for CPU-intensive tasks without worker threads — important trade-off for placement interview discussions.',
      'easy',
    ),
    q(
      'What is npm and what is the purpose of package.json?',
      'npm is Node package manager installing and publishing JavaScript packages. package.json defines project metadata, dependencies, devDependencies, scripts, and engine requirements. npm install reads package.json and package-lock.json for reproducible installs. Scripts section runs commands like npm start and npm test. Semantic versioning in dependencies ^1.2.3 allows minor updates; lock file pins exact versions. Campus project setup questions ask difference between dependencies and devDependencies — jest in devDependencies, express in dependencies — basic but essential for Node backend placement project submission and code review.',
      'easy',
    ),
    q(
      'What is Express.js and how do you create a basic REST API?',
      'Express is minimal web framework for Node.js simplifying routing, middleware, and HTTP handling. Basic server: const app = express(); app.use(express.json()); app.get("/jobs", handler); app.listen(3000). Middleware processes requests sequentially — logging, parsing, authentication. Route handlers receive req and res objects. Campus backend interviews ask create CRUD endpoints for jobs resource with JSON body parsing and status codes 200, 201, 404 — foundational skill tested before database integration questions in TCS Ninja and startup full-stack hiring loops.',
      'easy',
    ),
    q(
      'What is middleware in Express?',
      'Middleware functions have signature (req, res, next) executing during request-response cycle. They can modify req/res, end response, or call next() passing control to next middleware. Order matters — body parser before routes, auth before protected routes. app.use applies globally; app.get applies to specific route. Error middleware has four parameters (err, req, res, next). Campus interviews ask implement logging middleware printing method and URL and auth middleware checking JWT before /applications routes — standard Express pattern in placement portal backend projects.',
      'easy',
    ),
    q(
      'What is the difference between process.env and hardcoding configuration?',
      'process.env accesses environment variables set outside code — PORT, DATABASE_URL, JWT_SECRET. Hardcoding secrets in source code exposes them in git history and violates security best practices. Use dotenv package loading .env file locally; production sets variables via hosting platform. Never commit .env files. Campus DevOps questions connect environment variables to twelve-factor app methodology. Interviewers ask structure config module validating required env vars at startup failing fast if JWT_SECRET missing rather than cryptic runtime errors during first login attempt in demo.',
      'easy',
    ),
    q(
      'What is a stream in Node.js?',
      'Streams process data chunk by chunk without loading entire file into memory — readable, writable, duplex, and transform types. fs.createReadStream reads large resume PDFs efficiently; pipe connects readable to writable. Backpressure handles producer faster than consumer via pause and resume. HTTP request and response objects are streams. Campus backend questions ask stream CSV upload parsing versus reading entire buffer — memory efficiency critical when placement portal handles bulk student imports during registration week with limited server RAM on college deployment.',
      'easy',
    ),
    q(
      'What is the purpose of module.exports and require?',
      'CommonJS modules export code via module.exports or exports; require imports synchronously resolving file paths. Node caches modules after first require — subsequent requires return cached exports. Built-in modules like fs, path, http need no install. ES modules use import/export with "type": "module" in package.json increasingly preferred. Campus interviews ask structure routes, controllers, and services in separate files exporting functions — basic modularity expected in Node backend code review during internship selection at Indian product companies.',
      'easy',
    ),
    q(
      'What HTTP status codes should a REST API return?',
      '200 OK for successful GET/PUT; 201 Created for POST creating resource; 204 No Content for DELETE success. 400 Bad Request invalid input; 401 Unauthorized missing auth; 403 Forbidden insufficient permissions; 404 Not Found missing resource; 409 Conflict duplicate email; 422 Unprocessable Entity validation errors. 500 Internal Server Error unexpected server failure — avoid leaking stack traces. Campus API design questions map placement application submit to 201 with Location header, validation failure to 400 with error details array — demonstrates REST maturity beyond always returning 200 with error message in body anti-pattern.',
      'easy',
    ),
    q(
      'What is CORS and why does it matter for Node APIs?',
      'Cross-Origin Resource Sharing controls which browser origins can access API from JavaScript frontend on different port or domain. Browser blocks cross-origin requests unless server sends Access-Control-Allow-Origin header. Express cors middleware configures allowed origins, methods, credentials. Without CORS React app on localhost:5173 cannot call API on localhost:3000. Campus full-stack debugging classic issue — API works in Postman but fails in browser with CORS error. Explain preflight OPTIONS requests for non-simple methods and custom headers in authentication flows.',
      'easy',
    ),
    q(
      'What is bcrypt used for in Node.js authentication?',
      'bcrypt hashes passwords with adaptive cost factor resisting brute force and rainbow tables. Never store plaintext passwords. hashSync or async hash on registration; compare on login checking hash matches plaintext without reversible decryption. Salt embedded in hash output. Increase rounds as hardware improves. Campus security baseline question — pairing bcrypt with JWT issuing token after successful login. Mention timing-safe comparison and rate limiting login endpoint against credential stuffing attacks targeting campus portal accounts during placement season peak traffic.',
      'easy',
    ),
    q(
      'Explain the Node.js event loop phases.',
      'Event loop phases in order: timers (setTimeout, setInterval callbacks), pending callbacks (deferred IO), idle/prepare internal, poll (retrieve new IO events, execute IO callbacks), check (setImmediate), close callbacks (socket.on close). process.nextTick queue runs between phases with higher priority than microtasks from promises. Understanding phases explains setImmediate versus setTimeout ordering and why blocking poll phase delays all IO. Campus Node interviews at Paytm and Swiggy backend teams test event loop knowledge beyond surface async/await usage — distinguishes candidates who understand runtime behavior under load..',
      'medium',
    ),
    q(
      'How do you connect Node.js to MongoDB or PostgreSQL?',
      'MongoDB: mongoose ORM or native mongodb driver — connect with connection string, define schemas with validation, use async await queries. PostgreSQL: pg library or Sequelize/Prisma ORM — connection pool for concurrent requests, parameterized queries preventing SQL injection. Environment variable stores DATABASE_URL. Handle connection errors at startup; graceful shutdown closes pool on SIGTERM. Campus full-stack projects typically use one database — justify choice MongoDB flexible schema for student profiles versus PostgreSQL ACID for financial offer data. Mention migrations with Prisma migrate for schema versioning in team projects..',
      'medium',
    ),
    q(
      'What is JWT authentication and how do you implement it in Express?',
      'JSON Web Token encodes claims signed with secret — stateless authentication without server session storage. Login verifies credentials, signs payload { userId, role } with expiry, returns token. Client sends Authorization Bearer header; middleware verifies signature and expiry attaching user to req. Refresh tokens enable short access token lifetime. Campus implementation steps: jsonwebtoken sign and verify, middleware authRequired, role-based authorization checking req.user.role. Discuss token revocation limitations versus session store and use refresh token rotation for placement app security — standard backend interview flow at Indian startups..',
      'medium',
    ),
    q(
      'What is the difference between synchronous and asynchronous file operations?',
      'fs.readFileSync blocks event loop until complete — simple but stalls all concurrent requests under load. fs.readFile or fs.promises.readFile non-blocking releases thread during disk IO continuing other requests. Always prefer async in server code except startup config reads. Campus performance question: synchronous bcrypt or JSON parse in hot path degrades API latency under concurrent campus fest traffic. Use worker threads for CPU-heavy sync operations. Demonstrate promisify or fs.promises for clean async await syntax in file upload handlers storing student resumes..',
      'medium',
    ),
    q(
      'How do you handle errors in Express applications?',
      'Wrap async route handlers catching rejected promises — express-async-errors or try/catch calling next(err). Central error middleware maps errors to consistent JSON { message, code } hiding internal details in production. Operational errors like validation return 400; programmer errors log and return 500. process.on unhandledRejection catches missed promise rejections crashing gracefully. Campus production readiness asks global error handler, request ID logging correlation, and never exposing stack traces to clients — differentiate trusted internal logging from public API error responses in placement portal backend code review..',
      'medium',
    ),
    q(
      'What is clustering in Node.js?',
      'cluster module forks worker processes sharing server port utilizing multiple CPU cores since single Node process uses one core for JavaScript execution. Primary process manages workers; workers handle requests independently. PM2 cluster mode automates process management and restarts. Trade-off: increased memory per worker, stateless design required — session in Redis not memory. Campus scaling questions explain when cluster helps IO-bound API versus when worker_threads better for CPU tasks. Load balancer nginx in front of clustered Node instances standard deployment architecture for campus job portal handling concurrent application submissions..',
      'medium',
    ),
    q(
      'Explain input validation in Node.js APIs.',
      'Validate all client input server-side regardless of frontend validation — never trust client. Libraries: Joi, Zod, express-validator define schemas checking types, ranges, formats. Reject invalid input with 400 and detailed field errors. Sanitize strings preventing NoSQL injection in MongoDB queries. Validate file uploads: size limits, MIME type, extension whitelist for resumes. Campus security questions SQL injection via raw queries — always parameterized queries. Rate limit registration endpoint. Validation middleware applied before controller logic keeping handlers clean — architecture pattern expected in Infosys and Razorpay Node backend interviews..',
      'medium',
    ),
    q(
      'What is the purpose of helmet and rate limiting middleware?',
      'helmet sets security HTTP headers — Content-Security-Policy, X-Frame-Options, HSTS reducing XSS clickjacking risks. express-rate-limit restricts requests per IP window preventing brute force and DDoS abuse — critical for login and OTP endpoints during placement registration spikes. Combine with slow-down progressive delay. Store rate limit counters in Redis for distributed deployment. Campus security architecture mentions helmet rate limit CORS together as API hardening baseline. Discuss tuning limits avoiding blocking legitimate campus lab NAT shared IP while stopping automated scraping of job listings..',
      'medium',
    ),
    q(
      'How do WebSockets differ from HTTP REST in Node.js?',
      'HTTP REST is request-response stateless protocol — client polls for updates inefficiently. WebSocket establishes persistent bidirectional connection after HTTP upgrade — server pushes real-time updates like application status changes or chat support. socket.io library adds rooms, reconnection, fallback transports. Use WebSockets for live notification feed; REST for CRUD operations. Campus full-stack design placement tracker notifications via WebSocket plus REST for data mutations — explain scaling WebSockets with Redis pub/sub adapter across multiple Node instances sticky sessions or shared subscription layer..',
      'medium',
    ),
    q(
      'What is dependency injection and how does NestJS use it?',
      'Dependency injection provides dependencies from outside rather than hardcoding instantiation — improves testability and modularity. NestJS built-in DI container manages providers injected via constructor parameters decorated with @Injectable. Modules organize providers controllers imports exports. Testing mocks services replacing database layer. Campus NestJS questions contrast Express manual wiring with NestJS decorators @Controller @Get @Post and built-in validation pipes — enterprise pattern at TCS digital and product companies adopting TypeScript Node backends. Explain inversion of control benefit swapping email service mock in unit tests without changing controller code..',
      'medium',
    ),
    q(
      'Design a scalable REST API architecture for campus job portal backend.',
      'Layer architecture: routes → controllers → services → repositories → database. Separate concerns: auth module, jobs module, applications module. PostgreSQL primary store; Redis cache hot job listings; S3 for resume storage. JWT auth with refresh tokens. Input validation with Zod; OpenAPI documentation. Horizontal scaling stateless Node instances behind load balancer; PM2 cluster per instance. Background jobs with Bull queue for email notifications. Health check /health and readiness probes. Logging with Winston structured JSON; correlation IDs. Campus system design evaluates complete production architecture not just Express hello world — database indexing, caching strategy, file upload pipeline, and deployment on AWS ECS or Railway expected in senior campus backend interviews.',
      'hard',
    ),
    q(
      'Explain memory leaks in Node.js and how to diagnose them.',
      'Common leaks: global variables accumulating request data, closures retaining large objects, forgotten event listeners, unbounded caches without TTL, timers never cleared. Symptoms: increasing heap usage until crash OOM. Diagnose with node --inspect, Chrome DevTools heap snapshots comparing retained objects, clinic.js automated analysis, APM tools. Fix: remove listeners on shutdown, WeakMap for caches, bounded LRU, stream instead of buffering entire files. Campus production question scenario API slows after 24 hours — walk through heap snapshot finding EventEmitter listener leak on each request attaching duplicate handler — demonstrates operational maturity beyond feature development..',
      'hard',
    ),
    q(
      'How would you implement idempotent POST for job application submission?',
      'Client sends Idempotency-Key header unique per submission attempt stored in Redis with TTL mapping to response or processing lock. First request processes application storing result; duplicate key within TTL returns cached 201 response without double insert. Database unique constraint on (student_id, job_id) prevents duplicates at persistence layer. Use transaction wrapping insert and notification enqueue. Return 409 if already applied with existing application id. Campus API design advanced topic preventing double-click duplicate applications during slow network — combines distributed systems thinking with Node Redis integration expected at Flipkart and Amazon backend campus hire loops..',
      'hard',
    ),
    q(
      'Compare worker_threads versus cluster module for CPU-bound tasks in Node.',
      'cluster forks entire Node processes sharing port — isolates memory, good for horizontal scaling IO-bound HTTP servers across cores. worker_threads run JavaScript in parallel threads sharing some memory via SharedArrayBuffer — better for CPU-intensive computation like PDF parsing resume text extraction image processing without blocking main event loop. Workers have communication overhead via message passing. Choose cluster for request handling throughput; worker_threads for embedded compute in request pipeline. Campus architecture resume parsing service: API receives upload async queues job worker thread extracts text returns via job id polling — explains when not to block Express request thread..',
      'hard',
    ),
    q(
      'Explain graceful shutdown in Node.js production servers.',
      'On SIGTERM from orchestrator Kubernetes stop accepting new connections server.close() finishing in-flight requests. Set timeout forcing shutdown after deadline. Close database pool Redis connections Bull queue workers cleanly. Health check fails readiness immediately on SIGTERM routing traffic away before drain. Handle SIGINT locally. PM2 gracefulReload coordinates zero-downtime deploy. Campus DevOps integration question — deployment during placement deadline cannot drop active application submissions. Implement shutdown hook tracking active request count decrementing on response finish closing server when zero — production reliability answer distinguishing student projects from deployable services..',
      'hard',
    ),
    q(
      'How do you structure logging and monitoring for Node.js microservices?',
      'Structured JSON logging with Winston or Pino including timestamp level message requestId userId service name. Correlation ID propagated from API gateway through headers tracing request across services. Log levels: error warn info debug — production info default. Centralize logs ELK Datadog CloudWatch. Metrics: Prometheus histogram request duration counter error rates. Alert on error rate spike latency p99. Health endpoints liveness versus readiness. Campus observability question beyond console.log debugging — demonstrate understanding distributed tracing OpenTelemetry for placement microservices debugging slow application status update spanning auth jobs notification services..',
      'hard',
    ),
    q(
      'Implement secure file upload handling for student resumes in Node.js.',
      'Use multer memory or disk storage with strict file size limit 2MB. Validate MIME magic bytes not just extension preventing executable upload. Generate random filename store S3 not public bucket — presigned URL for recruiter download expiring. Scan virus ClamAV async queue. Never serve uploads directory statically with script execution. Store metadata in DB not file path alone. Rate limit uploads per user. Campus security comprehensive answer covering OWASP file upload risks — path traversal double extension image.php.jpg blocked content-type sniffing — expected at security-conscious product company backend interviews beyond basic multer tutorial implementation..',
      'hard',
    ),
    q(
      'Explain database transaction patterns with Node.js and PostgreSQL.',
      'Use pool.connect client query BEGIN COMMIT ROLLBACK for multi-statement atomicity — create application row and decrement job vacancy together or neither. ORM Prisma $transaction callback automatic rollback on error. Optimistic concurrency version column increment check affected rows. Saga pattern for distributed transactions across services compensating actions on failure. Avoid long transactions blocking connections. Campus backend scenario two students last vacancy race condition — SELECT FOR UPDATE pessimistic lock or atomic UPDATE WHERE vacancies > 0 RETURNING — transaction isolation discussion linking SQL knowledge to Node implementation in high-stakes placement offer acceptance flow..',
      'hard',
    ),
    q(
      'How would you migrate a monolithic Express app to microservices?',
      'Identify bounded contexts: auth users jobs applications notifications. Strangler fig pattern route traffic gradually to extracted services via API gateway. Shared database initially then split databases per service. Event-driven communication Kafka or RabbitMQ for application-created events decoupling notification service. Maintain backward compatible REST contracts versioning /v1. CI/CD independent deploy pipelines per service. Campus architecture evolution question for growing placement platform — discuss trade-offs distributed complexity versus team scalability and when microservices premature for college project but appropriate for Flipkart scale — nuanced answer valued in senior campus system design plus backend combined rounds..',
      'hard',
    ),
    q(
      'How do you secure a Node.js REST API against common OWASP vulnerabilities?',
      'Mitigate injection with parameterized queries and input validation schemas. Prevent broken authentication using strong password hashing bcrypt, JWT expiry, refresh rotation, and secure cookie flags. Rate-limit auth endpoints; use helmet for security headers and CORS allowlists not wildcards in production. Sanitize output preventing XSS in error messages. Keep dependencies updated npm audit; avoid eval and dynamic require of user input. Log security events without sensitive data. Campus backend security questions connect to placement portal threats: brute-force login, mass scraping job APIs, and resume upload malware—articulate layered defenses beyond basic JWT login tutorial implementations..',
      'hard',
    ),
  ],
};
