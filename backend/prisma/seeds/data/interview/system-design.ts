import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const SYSTEM_DESIGN_BANK: InterviewTopicBank = {
  topic: 'System Design',
  topicSlug: 'system-design',
  questions: [
    q(
      'What is system design and why is it asked in campus interviews?',
      'System design evaluates how you architect scalable, reliable software systems handling real-world constraints like traffic, data storage, and failures. Product companies like Amazon, Flipkart, and Razorpay include high-level design rounds for senior campus hires and experienced roles. You discuss requirements, APIs, database schema, caching, load balancing, and trade-offs drawing diagrams. It tests structured thinking beyond coding. Indian campus candidates targeting 15+ LPA packages should start system design prep in pre-final year alongside DSA for comprehensive placement readiness.',
      'easy',
    ),
    q(
      'What is the difference between vertical and horizontal scaling?',
      'Vertical scaling adds more CPU, RAM, or disk to a single server — simpler but hits hardware limits and creates single point of failure. Horizontal scaling adds more machines distributing load — better fault tolerance and theoretically unlimited growth but requires load balancing and stateless application design. Most modern systems scale horizontally. Campus interviews ask when vertical scaling suffices for college project MVP versus when horizontal needed for national job portal serving lakhs of students during placement season peak concurrent traffic spikes.',
      'easy',
    ),
    q(
      'What is a load balancer and why is it needed?',
      'Load balancer distributes incoming requests across multiple server instances preventing any single server overload. Algorithms include round robin, least connections, and IP hash. Health checks remove unhealthy instances from rotation. Layer 4 balancers route by IP/port; Layer 7 inspect HTTP headers and paths. Examples: AWS ALB, nginx, HAProxy. Campus system design always places load balancer after users before application servers — entry point for discussing high availability and SSL termination at balancer reducing per-app certificate management complexity.',
      'easy',
    ),
    q(
      'What is caching and where would you use it?',
      'Caching stores frequently accessed data in fast storage reducing database load and latency. Browser cache, CDN for static assets, application cache like Redis for job listings, and database query cache layers exist. Cache-aside pattern: read cache first, on miss query DB and populate cache. Set TTL for freshness. Invalidate on updates when job status changes. Campus design for placement portal caches hot job search results five minutes — explain trade-off stale listings versus database query cost during peak browsing before deadline night.',
      'easy',
    ),
    q(
      'What is a CDN and how does it help web applications?',
      'Content Delivery Network distributes static assets — images, CSS, JavaScript, videos — to edge servers geographically close to users reducing latency and origin server load. CloudFront, Cloudflare, and Akamai are popular CDNs. Cache company logos, resume templates, and frontend bundles at edge. Dynamic API responses typically bypass CDN or use short TTL edge caching. Campus global user scenario Indian students across cities access job portal — CDN serves React bundle from nearest PoP Bangalore Hyderabad improving page load critical for mobile users on college WiFi during placement registration.',
      'easy',
    ),
    q(
      'What is a database index and why does it matter in system design?',
      'Database index speeds up read queries on indexed columns at cost of slower writes and storage overhead. B-tree indexes common for range queries and equality lookups. Design indexes on foreign keys, filter columns like location and status, and composite indexes matching query patterns. Over-indexing hurts write-heavy tables. Campus schema design for applications table indexes student_id job_id status — explain query plans for recruiter filtering shortlisted candidates by company without full table scan on millions of rows at scale.',
      'easy',
    ),
    q(
      'What is the difference between SQL and NoSQL databases?',
      'SQL relational databases like PostgreSQL and MySQL offer ACID transactions, structured schema, and powerful joins — ideal for financial offers and application workflows requiring consistency. NoSQL databases like MongoDB, Cassandra, and Redis offer flexible schema, horizontal scaling, and varied models — document, key-value, wide-column — suited for profiles, sessions, and analytics. Campus design chooses PostgreSQL for transactional core plus Redis cache plus Elasticsearch for job search — polyglot persistence explaining each database role rather than one-size-fits-all choice.',
      'easy',
    ),
    q(
      'What is an API gateway?',
      'API gateway is single entry point routing client requests to appropriate microservices handling cross-cutting concerns: authentication, rate limiting, SSL termination, request routing, and response aggregation. Kong, AWS API Gateway, and nginx serve this role. Simplifies client integration hiding internal service topology. Campus microservices design frontend calls gateway /api/v1/jobs routed to job-service — centralizes JWT validation once instead of each service reimplementing auth middleware inconsistently across Node Python Java mixed stack college project microservices.',
      'easy',
    ),
    q(
      'What is replication in databases?',
      'Replication copies data from primary database to replica servers for read scaling and disaster recovery. Master-slave replication: writes go to primary, reads served from replicas with replication lag delay. Multi-master allows writes on multiple nodes with conflict resolution complexity. Automatic failover promotes replica to primary on primary failure. Campus availability question placement portal during campus fest must survive database server crash — read replicas serve job browsing while failover restores write capability minimizing downtime during critical application submission window.',
      'easy',
    ),
    q(
      'What are microservices and how do they differ from monoliths?',
      'Monolith is single deployable application with shared codebase and database — simpler development and deployment for small teams. Microservices split into independently deployable services with separate databases communicating via APIs or messaging — better team autonomy and scaling individual components but add network complexity, distributed debugging, and operational overhead. Campus pragmatic answer: start monolith for college project; extract services when specific components need independent scaling like notification service sending bulk emails during offer rollout without scaling entire application.',
      'easy',
    ),
    q(
      'Explain CAP theorem in practical system design terms.',
      'CAP theorem states distributed system during network partition must choose between Consistency all nodes see same data immediately and Availability every request gets response. Partition tolerance unavoidable in distributed systems so practical choice is CP or AP. Banking offer acceptance needs CP strong consistency. Social feed job recommendations tolerate AP eventual consistency. Campus interviews apply CAP to specific components not entire system — PostgreSQL primary-replica may sacrifice read consistency lag for availability of read queries while writes remain strongly consistent on primary..',
      'medium',
    ),
    q(
      'How would you design a URL shortener like bit.ly?',
      'Requirements: shorten long URLs, redirect original URL, analytics optional, high read low write ratio. API POST /shorten returns short code; GET /:code redirects 301. Generate unique base62 code from auto-increment ID or hash collision retry. Store mapping in SQL or DynamoDB. Cache popular links in Redis — 80/20 read pattern. Rate limit creation preventing abuse. Expire inactive links optionally. Scale: stateless app servers, read replicas, CDN edge cache redirects. Campus classic design problem tests ID generation collision handling, redirect latency target under 100ms, and storage estimation billions of URLs — foundational before placement-specific designs..',
      'medium',
    ),
    q(
      'What is consistent hashing and where is it used?',
      'Consistent hashing maps keys and nodes to hash ring — adding or removing node only remaps fraction of keys unlike modulo hashing remapping everything. Used in distributed caches Redis cluster, CDNs, and load distribution minimizing disruption during scaling. Virtual nodes improve balance. Campus follow-up when cache server added to placement job listing cache cluster consistent hashing prevents mass cache invalidation causing thundering herd database spike — demonstrates distributed systems knowledge beyond basic Redis mention in design diagrams..',
      'medium',
    ),
    q(
      'Explain message queues and when to use them.',
      'Message queues decouple producers from consumers enabling asynchronous processing and load leveling. RabbitMQ, Kafka, AWS SQS buffer tasks: send application confirmation email, generate offer PDF, process resume parsing. Producer publishes message; consumer processes at own pace; retry dead letter queue for failures. Kafka adds log retention and replay for event sourcing. Campus placement portal application submit returns immediately queueing notification worker — prevents slow email SMTP blocking HTTP response improving user experience and system resilience when email service temporarily unavailable..',
      'medium',
    ),
    q(
      'What is database sharding?',
      'Sharding horizontally partitions data across multiple database instances by shard key — user_id hash or geographic region. Each shard holds subset reducing per-database size and write contention. Challenges: cross-shard queries expensive, rebalancing shards, global unique IDs. Shard key choice critical — poor choice causes hot shards. Campus scale question national job portal millions students — shard by student_id for profile applications data co-located; company job data separate smaller database not sharded initially. Contrast sharding versus read replicas when write volume drives sharding need not read volume alone..',
      'medium',
    ),
    q(
      'What is rate limiting and common algorithms?',
      'Rate limiting controls request frequency preventing abuse and protecting backend resources. Token bucket allows burst while maintaining average rate. Fixed window counts requests per time window simple but boundary burst issue. Sliding window smooths limits. Leaky bucket queues requests constant outflow. Implement in Redis atomic counters or dedicated services. Campus API design login 5 attempts per minute, search 100 per minute per user, bulk registration endpoint strict limits — explain 429 Too Many Requests response with Retry-After header and distributed rate limiting across multiple API instances sharing Redis counter..',
      'medium',
    ),
    q(
      'Explain REST versus GraphQL API design trade-offs.',
      'REST uses resource-oriented URLs with fixed response shapes — simple caching HTTP semantics predictable. GraphQL single endpoint client specifies exact fields needed reducing over-fetching and under-fetching in mobile apps with varied data needs. GraphQL adds complexity: query depth limiting, caching harder, N+1 resolver problem solved with DataLoader batching. Campus placement app mobile needs job list minimal fields detail page full nested company info — GraphQL flexible; public job board REST with CDN cache simpler. Justify choice by client diversity team expertise not trend following..',
      'medium',
    ),
    q(
      'What is eventual consistency and where is it acceptable?',
      'Eventual consistency guarantees if no new updates all replicas converge to same value given enough time — not immediate. Acceptable for search indexes lagging seconds behind database, view counters, activity feeds, and analytics dashboards. Unacceptable for seat allocation last vacancy or payment debit without strong consistency. Campus design job search Elasticsearch index updated async from PostgreSQL via change data capture — user sees new job within seconds acceptable; offer letter generation must read consistent committed transaction state from primary database not stale replica..',
      'medium',
    ),
    q(
      'How do you estimate storage and bandwidth for a system?',
      'Storage estimate: users times average data per user times retention period. Example 10 lakh students 5KB profile 50KB resume 5GB total resumes plus indexes overhead factor 1.5. Bandwidth: daily active users times requests per user times average response size. Peak factor 3x average for placement deadline evening. QPS estimation drives server count. Campus interviews show calculation not exact numbers — order of magnitude reasoning impresses interviewers more than guessing. Mention compression, tiered storage S3 Glacier for old resumes, and CDN reducing origin bandwidth for static assets..',
      'medium',
    ),
    q(
      'What is a reverse proxy and how differs from forward proxy?',
      'Forward proxy sits before clients hiding client identity accessing internet — corporate proxy. Reverse proxy sits before servers receiving client requests routing to backend hiding server topology — nginx, load balancer. Reverse proxy handles SSL, caching, compression, and security filtering. Campus deployment architecture users hit reverse proxy nginx terminating HTTPS forwarding HTTP internal Node servers — single public IP multiple internal services path-based routing /api to backend /static to CDN origin standard production pattern beyond localhost development setup in college projects..',
      'medium',
    ),
    q(
      'Design a campus placement job portal like CampusJobsHub at scale.',
      'Functional: student registration, job search filter apply, company posting, application tracking, notifications. Non-functional: 100k DAU, 99.9% availability, search under 200ms. Architecture: React SPA CDN, API gateway, microservices auth jobs applications search notification, PostgreSQL sharded by region, Redis cache Elasticsearch search, S3 resumes, Kafka events, email SMS workers. Read heavy optimize caching search index; write path application submit transactional. Rate limit apply endpoint. Monitoring alerting on error rate. Campus comprehensive design round covering full stack components data flow failure scenarios and trade-offs — capstone system design answer for product company campus hire targeting 20+ LPA packages expecting structured 45-minute whiteboard discussion.',
      'hard',
    ),
    q(
      'Design a real-time notification system for application status updates.',
      'Triggers: application status change publishes event to Kafka topic application.events. Notification service consumes events, checks user preferences email push in-app, templates message, enqueues delivery tasks. Push via WebSocket gateway maintaining connection map userId to socket ids Redis pub/sub across gateway instances. Email via SendGrid queue with retry exponential backoff. Idempotent processing event id deduplication store. Priority queue urgent interview scheduled versus marketing digest. Scale WebSocket gateways horizontally sticky sessions or shared subscription. Campus deep dive delivery guarantees at-least-once versus exactly-once, user offline push stored inbox table synced on reconnect, and rate limit notification spam — production notification architecture beyond simple email on status change.',
      'hard',
    ),
    q(
      'How would you design a search system for job listings?',
      'Ingest pipeline: job CRUD events update Elasticsearch index via Kafka consumer denormalizing company name skills location CTC for faceted search. Search API queries ES with multi-match title description filters location experience CTC range pagination sort by relevance or date. Autocomplete separate edge n-gram index on titles. Cache popular queries Redis. Handle index lag eventual consistency acceptable seconds. Scale ES cluster shards by document volume replicas for read QPS. Campus advanced facets explain inverted index tokenization stemming synonym company abbreviations TCS Tata Consultancy Services and ranking signals recency sponsored jobs — search system design question at Flipkart and Amazon listing teams adapted to placement domain.',
      'hard',
    ),
    q(
      'Design distributed rate limiter for multi-instance API cluster.',
      'Centralized Redis counter per user per endpoint window sliding log or token bucket Lua script atomic increment check TTL. Key ratelimit:userId:endpoint:window. Alternative gossip protocol decentralized less accurate no single point failure. Response headers X-RateLimit-Remaining Limit Reset. Fail open versus closed when Redis unavailable — financial endpoints fail closed reject; read endpoints fail open allow degraded. Campus implementation detail compare fixed window Redis INCR EXPIRE simplicity versus sliding window sorted set ZREMRANGEBYSCORE accuracy. Distributed systems interview tests Redis single-thread atomicity understanding and clock skew handling across instances not just mentioning rate limit requirement..',
      'hard',
    ),
    q(
      'Explain saga pattern for distributed transactions in placement offer workflow.',
      'Offer acceptance spans services: lock vacancy in jobs service, create offer in applications service, notify student via notification service, update analytics. Saga orchestrates sequence with compensating transactions on failure: if notification fails retry then compensate release vacancy mark offer failed. Choreography each service listens events; orchestration central coordinator clearer debugging. Outbox pattern ensures reliable event publish same DB transaction as state change. Campus scenario student accepts offer last seat race — saga ensures no double booking compensating actions rollback partial progress. Compare two-phase commit impractical across microservices versus saga eventual consistency acceptable with business idempotency keys..',
      'hard',
    ),
    q(
      'Design file storage system for millions of student resumes.',
      'Upload API generates presigned S3 PUT URL client uploads directly bypassing app server bandwidth. Metadata in PostgreSQL user_id s3_key mime size checksum virus_scan_status. Async Lambda worker scans ClamAV updates status. Download presigned GET URL expiring 15 minutes recruiter authorized check application relationship. Lifecycle policy archive old resumes Glacier after 2 years GDPR delete on request. CDN not used for private files. Deduplication content hash optional save storage identical resume templates. Campus scale estimate bandwidth storage cost encryption at rest SSE-KMS access audit logging compliance college data protection — file system design beyond multer disk storage college demo..',
      'hard',
    ),
    q(
      'How would you handle thundering herd problem in caching?',
      'Thundering herd: cache expires many concurrent requests hit database simultaneously. Solutions: probabilistic early expiration jitter TTL random offset spread expirations. Mutex lock first request refreshes cache others wait or serve stale stale-while-revalidate. Background refresh before expiry hot keys. Never expire simultaneously use logical TTL plus physical TTL. Singleflight pattern deduplicate in-flight refresh requests same key. Campus scenario popular company job listing cache expires during campus talk 500 students refresh — without mitigation database overload site down. Articulate specific Redis lock pattern and stale serving acceptable few seconds stale job view count during refresh..',
      'hard',
    ),
    q(
      'Design analytics and reporting pipeline for placement statistics.',
      'Operational PostgreSQL serves transactional queries. CDC Debezium streams changes to Kafka. Spark or Flink jobs aggregate daily metrics applications per company per college conversion rates average CTC trends writing to warehouse BigQuery or Redshift. Precomputed dashboards Metabase or custom admin UI query warehouse not production DB protecting OLTP performance. Batch nightly for heavy reports real-time counters Redis for live application count display. Data retention partitioning by academic year. Campus data engineering angle separates OLTP OLAP concerns explains ETL latency batch versus streaming trade-offs and privacy anonymization aggregate reports not individual student PII in dean dashboard..',
      'hard',
    ),
    q(
      'Discuss security architecture for campus hiring platform handling PII.',
      'Authentication OAuth2 JWT short-lived refresh rotation MFA optional recruiters. Authorization RBAC student company admin roles resource-level student sees own applications only. Encryption TLS transit AES-256 rest S3 RDS. Secrets manager not env files in repo. Input validation WAF SQL injection XSS CSRF protection. Audit log sensitive actions offer view resume download. GDPR India DPDP compliance consent data export deletion. Penetration testing before placement season. Rate limit auth endpoints. Campus security architecture holistic answer covering not just login but data classification PII handling breach response plan and principle least privilege recruiter sees applications only assigned companies — distinguishes security-aware system designers in senior campus rounds.',
      'hard',
    ),
    q(
      'How do you design for high availability and disaster recovery?',
      'Target SLA like 99.9% defining allowed downtime budget. Deploy multi-AZ across availability zones with load balancer health checks removing unhealthy instances. Database primary-replica with automatic failover and regular backup snapshots tested restore drills. Circuit breakers and retries with exponential backoff prevent cascade failures. Graceful degradation serve cached job listings if search service down. RTO/RPO define recovery time and data loss tolerance for disaster scenarios. Campus system design senior questions expect mention of chaos engineering game days and runbooks—showing operational maturity for national placement platform where downtime during offer week has real student impact across Indian colleges..',
      'hard',
    ),
  ],
};
