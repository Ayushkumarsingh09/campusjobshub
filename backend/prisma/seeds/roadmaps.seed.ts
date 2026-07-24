import type { DifficultyLevel } from '@prisma/client';
import { buildRoadmapTemplate } from '../../src/lib/content/templates';
import { roadmapImageUrl } from './data/stock-images';
import type { SeedContext } from './utils';

const ROADMAP_AUTHOR = {
  name: 'CampusJobsHub Editorial Team',
  role: 'Placement Mentor',
};

type RoadmapDef = {
  title: string;
  slug: string;
  topic: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  salaryExpectations: string;
  timeline: string;
  faq: { question: string; answer: string }[];
  steps: {
    title: string;
    slug: string;
    description: string;
    resourceUrl?: string;
    estimatedHours: number;
  }[];
};

const ROADMAP_DEFINITIONS: RoadmapDef[] = [
  {
    title: 'DSA for Campus Placements',
    slug: 'dsa-placement-roadmap',
    topic: 'DSA',
    description:
      'Master data structures and algorithms from arrays to dynamic programming — the backbone of every product-company coding round in India.',
    difficulty: 'medium',
    estimatedHours: 220,
    salaryExpectations:
      'Strong DSA opens product roles at ₹12–35 LPA (Amazon, Flipkart, Microsoft) and service roles at ₹3.6–7 LPA (TCS, Infosys, Wipro). Top performers in contests often receive ₹40+ LPA offers.',
    timeline: '4–6 months with 2–3 hours daily practice',
    faq: [
      {
        question: 'How many LeetCode problems should I solve for campus placements?',
        answer:
          'Aim for 250–350 curated problems covering all major patterns. Quality beats quantity — revisit weak topics and do timed mocks weekly.',
      },
      {
        question: 'Which DSA topics are most asked on campus?',
        answer:
          'Arrays, strings, two pointers, sliding window, binary search, linked lists, trees, graphs, heaps, and dynamic programming cover roughly 90% of Indian campus coding rounds.',
      },
    ],
    steps: [
      {
        title: 'Arrays, Strings & Two Pointers',
        slug: 'arrays-strings-two-pointers',
        description:
          'Build intuition for prefix sums, kadane, two-pointer sweeps, and frequency maps. Solve 40+ problems on sorting, subarrays, and anagrams.',
        resourceUrl: 'https://leetcode.com/explore/learn/card/array-and-string/',
        estimatedHours: 30,
      },
      {
        title: 'Linked Lists & Stacks/Queues',
        slug: 'linked-lists-stacks-queues',
        description:
          'Practice reversal, cycle detection, merge patterns, monotonic stacks, and BFS-style queue problems common in service-company tests.',
        resourceUrl: 'https://www.geeksforgeeks.org/data-structures/linked-list/',
        estimatedHours: 25,
      },
      {
        title: 'Trees & Binary Search Trees',
        slug: 'trees-bst',
        description:
          'Traversals (in/pre/post/level), LCA, BST validation, diameter, and path-sum variants. Trees appear in 30%+ of medium-hard campus questions.',
        resourceUrl: 'https://leetcode.com/explore/learn/card/introduction-to-data-structure-binary-tree/',
        estimatedHours: 35,
      },
      {
        title: 'Graphs — BFS, DFS & Shortest Path',
        slug: 'graphs-bfs-dfs',
        description:
          'Grid BFS, topological sort, union-find, Dijkstra basics, and connected components. Essential for Amazon, Flipkart, and Goldman Sachs rounds.',
        resourceUrl: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/',
        estimatedHours: 40,
      },
      {
        title: 'Heaps, Greedy & Intervals',
        slug: 'heaps-greedy-intervals',
        description:
          'Priority queues for k-th element problems, meeting rooms, activity selection, and Huffman-style greedy proofs.',
        resourceUrl: 'https://leetcode.com/explore/learn/card/heap/',
        estimatedHours: 25,
      },
      {
        title: 'Dynamic Programming Foundations',
        slug: 'dynamic-programming',
        description:
          '1D/2D DP, knapsack variants, LIS, edit distance, and state-machine DP. Start with top-down memoization, then tabulate.',
        resourceUrl: 'https://www.geeksforgeeks.org/dynamic-programming/',
        estimatedHours: 45,
      },
      {
        title: 'Mock Contests & Revision Sprint',
        slug: 'mock-contests-revision',
        description:
          'Weekly timed contests on CodeChef/Codeforces. Maintain a mistake log. Revise patterns 2 weeks before your drive.',
        resourceUrl: 'https://www.codechef.com/contests',
        estimatedHours: 20,
      },
    ],
  },
  {
    title: 'Java Developer Career Roadmap',
    slug: 'java-developer-roadmap',
    topic: 'Java',
    description:
      'From core Java and OOP to Spring Boot microservices — the most in-demand backend stack for Indian IT campus hiring.',
    difficulty: 'medium',
    estimatedHours: 180,
    salaryExpectations:
      'Java developers in India: fresher ₹3.5–8 LPA (TCS, Cognizant), mid-tier product ₹10–18 LPA, senior Spring Boot engineers ₹18–35 LPA in Bangalore/Hyderabad.',
    timeline: '3–5 months',
    faq: [
      {
        question: 'Is Java still relevant for campus placements in 2026?',
        answer:
          'Yes — TCS, Infosys, Wipro, and most enterprise product teams still hire heavily for Java/Spring. It remains the default language for many college curricula.',
      },
    ],
    steps: [
      {
        title: 'Core Java & OOP',
        slug: 'core-java-oop',
        description: 'Classes, inheritance, polymorphism, interfaces, abstract classes, and SOLID principles with hands-on examples.',
        resourceUrl: 'https://docs.oracle.com/javase/tutorial/',
        estimatedHours: 30,
      },
      {
        title: 'Collections, Generics & Streams',
        slug: 'collections-generics-streams',
        description: 'ArrayList vs LinkedList, HashMap internals, Comparable/Comparator, and Stream API for data processing.',
        resourceUrl: 'https://www.baeldung.com/java-collections',
        estimatedHours: 25,
      },
      {
        title: 'Multithreading & Concurrency',
        slug: 'multithreading-concurrency',
        description: 'Threads, executors, synchronized blocks, volatile, and concurrent collections — frequently asked in Java interviews.',
        resourceUrl: 'https://www.baeldung.com/java-concurrency',
        estimatedHours: 25,
      },
      {
        title: 'JDBC, JPA & Hibernate',
        slug: 'jdbc-jpa-hibernate',
        description: 'CRUD with JDBC, entity relationships, lazy loading, and N+1 query problems in ORM.',
        resourceUrl: 'https://spring.io/guides/gs/accessing-data-jpa/',
        estimatedHours: 20,
      },
      {
        title: 'Spring Boot REST APIs',
        slug: 'spring-boot-rest',
        description: 'Build production REST APIs with Spring Boot, validation, exception handling, and OpenAPI documentation.',
        resourceUrl: 'https://spring.io/guides/gs/rest-service/',
        estimatedHours: 35,
      },
      {
        title: 'Microservices & Deployment',
        slug: 'microservices-deployment',
        description: 'Service discovery basics, Docker packaging, and CI/CD pipeline for a capstone Spring Boot project.',
        resourceUrl: 'https://spring.io/microservices',
        estimatedHours: 30,
      },
      {
        title: 'Capstone Project & Interview Prep',
        slug: 'java-capstone-interview',
        description: 'Build an e-commerce or placement-tracker API. Revise Java 8+ features, JVM basics, and common interview puzzles.',
        estimatedHours: 15,
      },
    ],
  },
  {
    title: 'Python Developer Career Roadmap',
    slug: 'python-developer-roadmap',
    topic: 'Python',
    description:
      'Learn Python for backend development, automation, and data roles — versatile skills valued across startups and MNCs.',
    difficulty: 'easy',
    estimatedHours: 160,
    salaryExpectations:
      'Python fresher roles: ₹4–9 LPA (backend/automation), data roles ₹6–14 LPA, ML engineers ₹8–20 LPA at product companies.',
    timeline: '3–4 months',
    faq: [
      {
        question: 'Should I learn Python or Java first for placements?',
        answer:
          'If your college teaches Java, stick with it for service companies. Choose Python if targeting data science, ML, or Django/FastAPI startups.',
      },
    ],
    steps: [
      {
        title: 'Python Fundamentals',
        slug: 'python-fundamentals',
        description: 'Syntax, data types, control flow, functions, modules, and virtual environments (venv/poetry).',
        resourceUrl: 'https://docs.python.org/3/tutorial/',
        estimatedHours: 25,
      },
      {
        title: 'OOP & Advanced Python',
        slug: 'python-oop-advanced',
        description: 'Classes, decorators, generators, context managers, and type hints for maintainable code.',
        resourceUrl: 'https://realpython.com/python3-object-oriented-programming/',
        estimatedHours: 20,
      },
      {
        title: 'File I/O, APIs & Requests',
        slug: 'python-apis-requests',
        description: 'JSON handling, REST client calls with requests/httpx, and error handling patterns.',
        resourceUrl: 'https://realpython.com/python-requests/',
        estimatedHours: 15,
      },
      {
        title: 'Django or FastAPI Backend',
        slug: 'django-fastapi-backend',
        description: 'Build REST APIs with authentication, ORM/database layer, and deployment-ready project structure.',
        resourceUrl: 'https://fastapi.tiangolo.com/tutorial/',
        estimatedHours: 40,
      },
      {
        title: 'Testing & Best Practices',
        slug: 'python-testing',
        description: 'pytest, mocking, linting with ruff, and packaging for reproducible projects.',
        resourceUrl: 'https://docs.pytest.org/en/stable/',
        estimatedHours: 15,
      },
      {
        title: 'Data Libraries Intro',
        slug: 'python-data-libraries',
        description: 'NumPy and Pandas basics for students targeting data analyst or ML hybrid roles.',
        resourceUrl: 'https://pandas.pydata.org/docs/getting_started/',
        estimatedHours: 25,
      },
      {
        title: 'Portfolio Project',
        slug: 'python-portfolio-project',
        description: 'Deploy a task manager or analytics dashboard API on Render/Railway with README and Postman collection.',
        estimatedHours: 20,
      },
    ],
  },
  {
    title: 'Frontend Developer Roadmap',
    slug: 'frontend-developer-roadmap',
    topic: 'Frontend',
    description:
      'HTML, CSS, JavaScript, and modern frameworks — become interview-ready for frontend and UI engineer campus roles.',
    difficulty: 'medium',
    estimatedHours: 200,
    salaryExpectations:
      'Frontend freshers: ₹4–10 LPA at product startups, ₹3.5–7 LPA at service firms. Strong React/Next.js profiles command ₹12–22 LPA within 2 years.',
    timeline: '4–5 months',
    faq: [
      {
        question: 'Do I need a design background for frontend roles?',
        answer:
          'No, but understanding layout, accessibility, and responsive design helps. Focus on JavaScript fundamentals first — they matter more than CSS tricks in interviews.',
      },
    ],
    steps: [
      {
        title: 'HTML5 & Semantic Markup',
        slug: 'html5-semantic',
        description: 'Semantic tags, forms, accessibility (ARIA), and SEO-friendly structure.',
        resourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        estimatedHours: 15,
      },
      {
        title: 'CSS Flexbox, Grid & Responsive Design',
        slug: 'css-flexbox-grid',
        description: 'Modern layouts, mobile-first design, Tailwind or CSS modules, and animation basics.',
        resourceUrl: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
        estimatedHours: 30,
      },
      {
        title: 'JavaScript ES6+ Deep Dive',
        slug: 'javascript-es6',
        description: 'Closures, promises, async/await, modules, and DOM manipulation — core of every frontend interview.',
        resourceUrl: 'https://javascript.info/',
        estimatedHours: 40,
      },
      {
        title: 'React Fundamentals',
        slug: 'react-fundamentals',
        description: 'Components, hooks, state management, and React Router for multi-page apps.',
        resourceUrl: 'https://react.dev/learn',
        estimatedHours: 35,
      },
      {
        title: 'TypeScript & Tooling',
        slug: 'typescript-tooling',
        description: 'Type-safe React, Vite/Next.js setup, ESLint, and component testing with Vitest.',
        resourceUrl: 'https://www.typescriptlang.org/docs/',
        estimatedHours: 25,
      },
      {
        title: 'Performance & Web Vitals',
        slug: 'performance-web-vitals',
        description: 'Lazy loading, code splitting, Lighthouse audits, and Core Web Vitals optimization.',
        resourceUrl: 'https://web.dev/vitals/',
        estimatedHours: 20,
      },
      {
        title: 'Frontend System Design & Portfolio',
        slug: 'frontend-portfolio',
        description: 'Build a polished dashboard or job board UI. Practice component design and state architecture questions.',
        estimatedHours: 35,
      },
    ],
  },
  {
    title: 'Backend Developer Roadmap',
    slug: 'backend-developer-roadmap',
    topic: 'Backend',
    description:
      'Design scalable APIs, databases, and server-side systems — essential for backend and platform engineer campus tracks.',
    difficulty: 'medium',
    estimatedHours: 190,
    salaryExpectations:
      'Backend freshers: ₹4–9 LPA (service), ₹10–18 LPA (product). Strong API + DB + caching skills unlock ₹15–28 LPA within 3 years.',
    timeline: '4–5 months',
    faq: [
      {
        question: 'Which backend language should I pick?',
        answer:
          'Java/Spring for enterprise hiring volume; Node.js for startups; Go/Python for platform teams. Master one stack deeply before switching.',
      },
    ],
    steps: [
      {
        title: 'HTTP, REST & API Design',
        slug: 'http-rest-api-design',
        description: 'REST conventions, status codes, idempotency, pagination, and OpenAPI specs.',
        resourceUrl: 'https://restfulapi.net/',
        estimatedHours: 20,
      },
      {
        title: 'Relational Databases & SQL',
        slug: 'relational-databases-sql',
        description: 'Schema design, normalization, indexes, joins, transactions, and query optimization.',
        resourceUrl: 'https://www.postgresql.org/docs/current/tutorial.html',
        estimatedHours: 30,
      },
      {
        title: 'Authentication & Authorization',
        slug: 'auth-jwt-oauth',
        description: 'JWT, sessions, OAuth2 flows, RBAC, and secure password handling with bcrypt.',
        resourceUrl: 'https://auth0.com/docs/authenticate',
        estimatedHours: 25,
      },
      {
        title: 'Caching & Message Queues',
        slug: 'caching-message-queues',
        description: 'Redis caching patterns, pub/sub, and intro to Kafka/RabbitMQ for async processing.',
        resourceUrl: 'https://redis.io/docs/latest/develop/get-started/',
        estimatedHours: 25,
      },
      {
        title: 'Microservices & Containerization',
        slug: 'microservices-docker',
        description: 'Docker basics, service boundaries, API gateways, and health checks.',
        resourceUrl: 'https://docs.docker.com/get-started/',
        estimatedHours: 30,
      },
      {
        title: 'Observability & Logging',
        slug: 'observability-logging',
        description: 'Structured logging, metrics, tracing concepts, and debugging production issues.',
        resourceUrl: 'https://opentelemetry.io/docs/',
        estimatedHours: 20,
      },
      {
        title: 'Backend Capstone & System Design Intro',
        slug: 'backend-capstone',
        description: 'Build a multi-service job portal backend. Practice URL shortener and rate-limiter design questions.',
        estimatedHours: 40,
      },
    ],
  },
  {
    title: 'Full Stack Developer Roadmap',
    slug: 'full-stack-developer-roadmap',
    topic: 'Full Stack',
    description:
      'End-to-end web development from database to UI — the profile startups and product companies love for campus hiring.',
    difficulty: 'hard',
    estimatedHours: 280,
    salaryExpectations:
      'Full stack campus offers: ₹5–12 LPA at startups, ₹8–20 LPA at product companies (Razorpay, Swiggy, Zomato). Portfolio quality often matters more than CGPA.',
    timeline: '5–7 months',
    faq: [
      {
        question: 'Is full stack too broad for a fresher?',
        answer:
          'Start T-shaped: go deep on one backend + one frontend stack, then broaden. A single strong MERN or Next.js + Postgres project beats shallow knowledge of ten tools.',
      },
    ],
    steps: [
      {
        title: 'Web Foundations (HTML/CSS/JS)',
        slug: 'fullstack-web-foundations',
        description: 'Solid frontend basics before framework specialization.',
        resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn',
        estimatedHours: 40,
      },
      {
        title: 'React + Next.js Frontend',
        slug: 'fullstack-react-nextjs',
        description: 'SSR, API routes, and modern React patterns for production apps.',
        resourceUrl: 'https://nextjs.org/learn',
        estimatedHours: 45,
      },
      {
        title: 'Node.js / Express or Spring Backend',
        slug: 'fullstack-backend',
        description: 'REST APIs, middleware, validation, and layered architecture.',
        resourceUrl: 'https://expressjs.com/en/starter/installing.html',
        estimatedHours: 45,
      },
      {
        title: 'PostgreSQL & Prisma/ORM',
        slug: 'fullstack-database',
        description: 'Schema migrations, relations, and efficient queries for real apps.',
        resourceUrl: 'https://www.prisma.io/docs/getting-started',
        estimatedHours: 30,
      },
      {
        title: 'Auth, Payments & Third-Party APIs',
        slug: 'fullstack-auth-integrations',
        description: 'NextAuth/JWT, Stripe/Razorpay sandbox, and webhook handling.',
        estimatedHours: 35,
      },
      {
        title: 'DevOps Basics for Full Stack',
        slug: 'fullstack-devops',
        description: 'Docker, environment variables, CI/CD, and cloud deployment (Vercel + Railway/AWS).',
        resourceUrl: 'https://docs.github.com/en/actions',
        estimatedHours: 30,
      },
      {
        title: 'Production Capstone Project',
        slug: 'fullstack-capstone',
        description: 'Ship CampusJobsHub-style platform: listings, auth, search, admin panel, and SEO.',
        estimatedHours: 55,
      },
    ],
  },
  {
    title: 'AI/ML Engineer Roadmap',
    slug: 'ai-ml-engineer-roadmap',
    topic: 'AI/ML',
    description:
      'Machine learning fundamentals through deep learning and MLOps — for students targeting AI research and ML engineer roles.',
    difficulty: 'hard',
    estimatedHours: 250,
    salaryExpectations:
      'ML fresher/intern conversion: ₹8–18 LPA at product AI teams; research roles ₹12–25 LPA. Strong Kaggle + paper reading profiles stand out.',
    timeline: '5–6 months',
    faq: [
      {
        question: 'Do I need a GPU to learn ML?',
        answer:
          'Google Colab free tier is enough for coursework. Focus on math intuition and sklearn/PyTorch basics before investing in hardware.',
      },
    ],
    steps: [
      {
        title: 'Math Foundations',
        slug: 'ml-math-foundations',
        description: 'Linear algebra, calculus, probability, and statistics essentials for ML.',
        resourceUrl: 'https://www.khanacademy.org/math/statistics-probability',
        estimatedHours: 40,
      },
      {
        title: 'Python for ML',
        slug: 'python-for-ml',
        description: 'NumPy, Pandas, Matplotlib, and Jupyter workflows.',
        resourceUrl: 'https://scikit-learn.org/stable/getting_started.html',
        estimatedHours: 25,
      },
      {
        title: 'Supervised & Unsupervised Learning',
        slug: 'supervised-unsupervised-ml',
        description: 'Regression, classification, clustering, and model evaluation metrics.',
        resourceUrl: 'https://developers.google.com/machine-learning/crash-course',
        estimatedHours: 45,
      },
      {
        title: 'Deep Learning with PyTorch',
        slug: 'deep-learning-pytorch',
        description: 'Neural networks, CNNs, RNNs, and transfer learning.',
        resourceUrl: 'https://pytorch.org/tutorials/',
        estimatedHours: 50,
      },
      {
        title: 'NLP & Transformers Intro',
        slug: 'nlp-transformers',
        description: 'Tokenization, embeddings, and Hugging Face transformers for text tasks.',
        resourceUrl: 'https://huggingface.co/learn/nlp-course',
        estimatedHours: 40,
      },
      {
        title: 'MLOps & Deployment',
        slug: 'mlops-deployment',
        description: 'Model serving with FastAPI, MLflow tracking, and basic cloud deployment.',
        resourceUrl: 'https://mlflow.org/docs/latest/getting-started/',
        estimatedHours: 30,
      },
      {
        title: 'ML Portfolio & Kaggle',
        slug: 'ml-portfolio-kaggle',
        description: 'Complete 2 Kaggle competitions and one end-to-end ML project with documentation.',
        estimatedHours: 20,
      },
    ],
  },
  {
    title: 'Data Science Career Roadmap',
    slug: 'data-science-roadmap',
    topic: 'Data Science',
    description:
      'Analytics, visualization, and statistical modeling for data analyst and data scientist campus recruitment.',
    difficulty: 'medium',
    estimatedHours: 200,
    salaryExpectations:
      'Data analyst freshers: ₹5–10 LPA; data scientists ₹8–16 LPA. FinTech and e-commerce analytics teams pay ₹12–20 LPA for strong SQL + Python profiles.',
    timeline: '4–5 months',
    faq: [
      {
        question: 'Data Science vs Data Analytics — which path?',
        answer:
          'Analytics emphasizes SQL, dashboards, and business metrics. Data science adds ML modeling. Both are hireable from campus — match your electives and projects.',
      },
    ],
    steps: [
      {
        title: 'SQL Mastery',
        slug: 'data-science-sql',
        description: 'Complex joins, window functions, CTEs, and query optimization for analytics.',
        resourceUrl: 'https://sqlbolt.com/',
        estimatedHours: 35,
      },
      {
        title: 'Statistics & Probability',
        slug: 'statistics-probability',
        description: 'Distributions, hypothesis testing, confidence intervals, and A/B testing basics.',
        resourceUrl: 'https://www.khanacademy.org/math/statistics-probability',
        estimatedHours: 30,
      },
      {
        title: 'Python Data Stack',
        slug: 'python-data-stack',
        description: 'Pandas, NumPy, and data cleaning workflows on real datasets.',
        resourceUrl: 'https://pandas.pydata.org/docs/user_guide/',
        estimatedHours: 30,
      },
      {
        title: 'Data Visualization',
        slug: 'data-visualization',
        description: 'Matplotlib, Seaborn, Plotly, and dashboard tools (Tableau/Power BI intro).',
        resourceUrl: 'https://seaborn.pydata.org/tutorial.html',
        estimatedHours: 25,
      },
      {
        title: 'Machine Learning for Analytics',
        slug: 'ml-for-analytics',
        description: 'Regression, classification, and feature engineering with scikit-learn.',
        resourceUrl: 'https://scikit-learn.org/stable/tutorial/index.html',
        estimatedHours: 35,
      },
      {
        title: 'Case Studies & Business Metrics',
        slug: 'case-studies-metrics',
        description: 'Solve business case studies: churn, funnel analysis, cohort retention, and ROI.',
        estimatedHours: 25,
      },
      {
        title: 'Data Science Portfolio',
        slug: 'data-science-portfolio',
        description: 'Kaggle notebook + GitHub repo with EDA, modeling, and stakeholder-ready insights.',
        estimatedHours: 20,
      },
    ],
  },
  {
    title: 'Cloud Computing Career Roadmap',
    slug: 'cloud-computing-roadmap',
    topic: 'Cloud',
    description:
      'AWS/Azure/GCP fundamentals, cloud architecture, and certification path for cloud engineer campus roles.',
    difficulty: 'medium',
    estimatedHours: 170,
    salaryExpectations:
      'Cloud associate freshers: ₹5–12 LPA. AWS/Azure certified engineers see ₹8–18 LPA at consulting and product infra teams.',
    timeline: '3–4 months',
    faq: [
      {
        question: 'AWS or Azure for Indian campus hiring?',
        answer:
          'AWS leads in startups and global MNCs; Azure is strong in enterprise and Microsoft partners. Pick one, earn Solutions Architect Associate, then broaden.',
      },
    ],
    steps: [
      {
        title: 'Cloud Concepts & Shared Responsibility',
        slug: 'cloud-concepts',
        description: 'IaaS/PaaS/SaaS, regions, AZs, and cloud economics basics.',
        resourceUrl: 'https://aws.amazon.com/training/digital/',
        estimatedHours: 15,
      },
      {
        title: 'Compute & Storage Services',
        slug: 'cloud-compute-storage',
        description: 'EC2/VMs, S3/Blob storage, EBS, and auto-scaling groups.',
        resourceUrl: 'https://docs.aws.amazon.com/ec2/',
        estimatedHours: 30,
      },
      {
        title: 'Networking & Security',
        slug: 'cloud-networking-security',
        description: 'VPC, subnets, security groups, IAM, and least-privilege policies.',
        resourceUrl: 'https://docs.aws.amazon.com/vpc/',
        estimatedHours: 30,
      },
      {
        title: 'Serverless & Managed Services',
        slug: 'cloud-serverless',
        description: 'Lambda, API Gateway, RDS, and DynamoDB for scalable apps.',
        resourceUrl: 'https://aws.amazon.com/lambda/getting-started/',
        estimatedHours: 25,
      },
      {
        title: 'Infrastructure as Code',
        slug: 'cloud-iac-terraform',
        description: 'Terraform or CloudFormation for reproducible infrastructure.',
        resourceUrl: 'https://developer.hashicorp.com/terraform/tutorials',
        estimatedHours: 25,
      },
      {
        title: 'Certification Prep (SAA/AZ-104)',
        slug: 'cloud-certification-prep',
        description: 'Structured exam prep with hands-on labs and practice tests.',
        resourceUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        estimatedHours: 30,
      },
      {
        title: 'Cloud Capstone Project',
        slug: 'cloud-capstone',
        description: 'Deploy a 3-tier web app with CI/CD, monitoring, and cost optimization report.',
        estimatedHours: 15,
      },
    ],
  },
  {
    title: 'DevOps Engineer Roadmap',
    slug: 'devops-engineer-roadmap',
    topic: 'DevOps',
    description:
      'CI/CD, containers, Kubernetes, and SRE practices for DevOps and platform engineer campus pipelines.',
    difficulty: 'hard',
    estimatedHours: 210,
    salaryExpectations:
      'DevOps freshers: ₹6–14 LPA at product companies, ₹4.5–9 LPA at service firms. Kubernetes + Terraform skills push offers toward ₹15–25 LPA within 2 years.',
    timeline: '4–6 months',
    faq: [
      {
        question: 'Can freshers get DevOps roles directly?',
        answer:
          'Yes, especially with internships showing Docker/K8s/CI projects. Many companies hire graduate trainees into platform teams after a coding + Linux screening.',
      },
    ],
    steps: [
      {
        title: 'Linux & Shell Scripting',
        slug: 'linux-shell-scripting',
        description: 'File permissions, process management, bash scripting, and ssh keys.',
        resourceUrl: 'https://linuxjourney.com/',
        estimatedHours: 25,
      },
      {
        title: 'Git & GitHub Actions',
        slug: 'git-github-actions',
        description: 'Branching strategies, PR workflows, and automated CI pipelines.',
        resourceUrl: 'https://docs.github.com/en/actions',
        estimatedHours: 20,
      },
      {
        title: 'Docker Deep Dive',
        slug: 'docker-deep-dive',
        description: 'Images, multi-stage builds, compose, and container security basics.',
        resourceUrl: 'https://docs.docker.com/get-started/',
        estimatedHours: 30,
      },
      {
        title: 'Kubernetes Fundamentals',
        slug: 'kubernetes-fundamentals',
        description: 'Pods, deployments, services, ingress, and Helm charts.',
        resourceUrl: 'https://kubernetes.io/docs/tutorials/',
        estimatedHours: 40,
      },
      {
        title: 'Terraform & Cloud Integration',
        slug: 'devops-terraform',
        description: 'Provision cloud resources as code with state management.',
        resourceUrl: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started',
        estimatedHours: 25,
      },
      {
        title: 'Monitoring & Incident Response',
        slug: 'monitoring-incident-response',
        description: 'Prometheus, Grafana, alerting, and on-call runbook basics.',
        resourceUrl: 'https://prometheus.io/docs/introduction/overview/',
        estimatedHours: 25,
      },
      {
        title: 'DevOps Capstone Pipeline',
        slug: 'devops-capstone',
        description: 'End-to-end pipeline: build → test → scan → deploy to K8s with rollback strategy.',
        estimatedHours: 45,
      },
    ],
  },
  {
    title: 'Cybersecurity Career Roadmap',
    slug: 'cybersecurity-roadmap',
    topic: 'Cybersecurity',
    description:
      'Network security, ethical hacking basics, and SOC fundamentals for cybersecurity analyst campus tracks.',
    difficulty: 'medium',
    estimatedHours: 180,
    salaryExpectations:
      'Security analyst freshers: ₹5–12 LPA. Big4 consulting and product security teams offer ₹8–18 LPA for CEH/OSCP-minded candidates.',
    timeline: '4–5 months',
    faq: [
      {
        question: 'Is coding required for cybersecurity?',
        answer:
          'Scripting (Python/Bash) is essential. You do not need full-stack development, but understand web/app vulnerabilities and how code creates attack surfaces.',
      },
    ],
    steps: [
      {
        title: 'Networking & TCP/IP',
        slug: 'security-networking',
        description: 'OSI model, DNS, HTTP/TLS, firewalls, and packet analysis with Wireshark.',
        resourceUrl: 'https://www.wireshark.org/docs/wsug_html/',
        estimatedHours: 30,
      },
      {
        title: 'Linux Security & Hardening',
        slug: 'linux-security',
        description: 'User permissions, audit logs, and basic hardening checklists.',
        resourceUrl: 'https://www.cyberciti.biz/t/linux-security/',
        estimatedHours: 20,
      },
      {
        title: 'Web Application Security',
        slug: 'web-app-security',
        description: 'OWASP Top 10, XSS, SQL injection, CSRF, and secure SDLC.',
        resourceUrl: 'https://owasp.org/www-project-top-ten/',
        estimatedHours: 35,
      },
      {
        title: 'Cryptography Essentials',
        slug: 'cryptography-essentials',
        description: 'Hashing, symmetric/asymmetric encryption, TLS handshakes, and certificate management.',
        resourceUrl: 'https://cryptopals.com/',
        estimatedHours: 25,
      },
      {
        title: 'Penetration Testing Intro',
        slug: 'pentest-intro',
        description: 'Recon, scanning, exploitation labs on TryHackMe/HackTheBox beginner paths.',
        resourceUrl: 'https://tryhackme.com/',
        estimatedHours: 35,
      },
      {
        title: 'SOC & Incident Handling',
        slug: 'soc-incident-handling',
        description: 'SIEM basics, log analysis, incident response lifecycle, and reporting.',
        estimatedHours: 20,
      },
      {
        title: 'Security Certifications & Portfolio',
        slug: 'security-cert-portfolio',
        description: 'Plan CompTIA Security+ or CEH. Document lab write-ups and vulnerability reports.',
        estimatedHours: 15,
      },
    ],
  },
  {
    title: 'Blockchain Developer Roadmap',
    slug: 'blockchain-developer-roadmap',
    topic: 'Blockchain',
    description:
      'Smart contracts, Web3, and distributed ledger fundamentals for blockchain and Web3 startup campus roles.',
    difficulty: 'hard',
    estimatedHours: 200,
    salaryExpectations:
      'Web3 freshers: ₹6–15 LPA at crypto startups (variable by token/equity). Traditional fintech blockchain teams: ₹8–18 LPA for Solidity + backend profiles.',
    timeline: '4–5 months',
    faq: [
      {
        question: 'Is blockchain hiring stable for campus graduates?',
        answer:
          'Niche but growing in fintech and global remote roles. Treat it as a specialization after solid programming fundamentals — not a shortcut past DSA.',
      },
    ],
    steps: [
      {
        title: 'Blockchain Fundamentals',
        slug: 'blockchain-fundamentals',
        description: 'Distributed ledgers, consensus (PoW/PoS), blocks, hashes, and wallets.',
        resourceUrl: 'https://ethereum.org/en/developers/docs/',
        estimatedHours: 25,
      },
      {
        title: 'Solidity & Smart Contracts',
        slug: 'solidity-smart-contracts',
        description: 'Variables, modifiers, events, inheritance, and security patterns.',
        resourceUrl: 'https://docs.soliditylang.org/en/latest/',
        estimatedHours: 40,
      },
      {
        title: 'Hardhat/Foundry Development',
        slug: 'hardhat-foundry',
        description: 'Compile, test, deploy locally and on testnets with scripts.',
        resourceUrl: 'https://hardhat.org/hardhat-runner/docs/getting-started',
        estimatedHours: 30,
      },
      {
        title: 'DeFi & Token Standards',
        slug: 'defi-token-standards',
        description: 'ERC-20, ERC-721, AMM basics, and common DeFi protocol patterns.',
        resourceUrl: 'https://eips.ethereum.org/erc-20',
        estimatedHours: 30,
      },
      {
        title: 'Web3 Frontend (ethers.js/wagmi)',
        slug: 'web3-frontend',
        description: 'Connect wallets, read/write contracts, and handle chain switching.',
        resourceUrl: 'https://docs.ethers.org/v6/',
        estimatedHours: 35,
      },
      {
        title: 'Security Auditing Basics',
        slug: 'blockchain-security',
        description: 'Reentrancy, overflow, access control bugs, and audit checklist.',
        resourceUrl: 'https://consensys.github.io/smart-contract-best-practices/',
        estimatedHours: 25,
      },
      {
        title: 'Web3 Capstone dApp',
        slug: 'web3-capstone',
        description: 'Build and deploy a voting or certificate dApp on Sepolia with verified contract.',
        estimatedHours: 15,
      },
    ],
  },
  {
    title: 'React Developer Roadmap',
    slug: 'react-developer-roadmap',
    topic: 'React',
    description:
      'Focused React learning path from hooks to Next.js — for frontend and React Native adjacent campus roles.',
    difficulty: 'medium',
    estimatedHours: 150,
    salaryExpectations:
      'React freshers: ₹4.5–10 LPA. Product companies hiring Next.js engineers offer ₹10–20 LPA for interns converting with strong component design skills.',
    timeline: '3–4 months',
    faq: [
      {
        question: 'React vs Angular for placements?',
        answer:
          'React dominates startup and product hiring in India. Angular appears in enterprise Angular/.NET shops — check your target company list before committing.',
      },
    ],
    steps: [
      {
        title: 'JavaScript Refresher for React',
        slug: 'js-refresher-react',
        description: 'ES6, destructuring, spread, immutability, and array methods before JSX.',
        resourceUrl: 'https://javascript.info/',
        estimatedHours: 20,
      },
      {
        title: 'React Components & JSX',
        slug: 'react-components-jsx',
        description: 'Functional components, props, conditional rendering, and lists/keys.',
        resourceUrl: 'https://react.dev/learn',
        estimatedHours: 20,
      },
      {
        title: 'Hooks — useState, useEffect, useRef',
        slug: 'react-hooks-core',
        description: 'State management, side effects, cleanup, and custom hooks.',
        resourceUrl: 'https://react.dev/reference/react',
        estimatedHours: 25,
      },
      {
        title: 'Context, Reducers & State Libraries',
        slug: 'react-context-reducers',
        description: 'useContext, useReducer, and when to adopt Zustand/Redux Toolkit.',
        resourceUrl: 'https://redux.js.org/tutorials/essentials/part-1-overview-concepts',
        estimatedHours: 25,
      },
      {
        title: 'React Router & Data Fetching',
        slug: 'react-router-data-fetching',
        description: 'Routing, loaders, TanStack Query for server state.',
        resourceUrl: 'https://tanstack.com/query/latest/docs/framework/react/overview',
        estimatedHours: 20,
      },
      {
        title: 'Next.js App Router',
        slug: 'nextjs-app-router',
        description: 'SSR, SSG, server components, and SEO-friendly React apps.',
        resourceUrl: 'https://nextjs.org/docs/app',
        estimatedHours: 30,
      },
      {
        title: 'React Interview Patterns & Project',
        slug: 'react-interview-project',
        description: 'Practice HOC/render props vs hooks, performance (memo, useMemo), and ship a portfolio app.',
        estimatedHours: 10,
      },
    ],
  },
  {
    title: 'Node.js Developer Roadmap',
    slug: 'nodejs-developer-roadmap',
    topic: 'Node.js',
    description:
      'Server-side JavaScript with Express, databases, and real-time features — ideal for MERN stack campus profiles.',
    difficulty: 'medium',
    estimatedHours: 160,
    salaryExpectations:
      'Node.js backend freshers: ₹4.5–11 LPA at startups, ₹5–9 LPA at service companies. Real-time and microservices experience adds ₹2–4 LPA premium.',
    timeline: '3–4 months',
    faq: [
      {
        question: 'Node.js or Java for backend placements?',
        answer:
          'Node.js wins at JS-first startups and full-stack roles. Java wins at volume hiring from service MNCs. MERN stack students should prioritize Node depth.',
      },
    ],
    steps: [
      {
        title: 'Node.js Runtime & Event Loop',
        slug: 'nodejs-event-loop',
        description: 'V8, event loop phases, libuv, and non-blocking I/O — top interview topic.',
        resourceUrl: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick',
        estimatedHours: 20,
      },
      {
        title: 'Express.js REST APIs',
        slug: 'express-rest-apis',
        description: 'Routing, middleware, error handling, and project structure.',
        resourceUrl: 'https://expressjs.com/en/starter/basic-routing.html',
        estimatedHours: 25,
      },
      {
        title: 'MongoDB & Mongoose',
        slug: 'mongodb-mongoose',
        description: 'Schema design, aggregation pipeline, and indexing for MERN apps.',
        resourceUrl: 'https://www.mongodb.com/docs/manual/tutorial/',
        estimatedHours: 25,
      },
      {
        title: 'Authentication & Security',
        slug: 'nodejs-auth-security',
        description: 'JWT, bcrypt, rate limiting, helmet, and input validation with Zod.',
        resourceUrl: 'https://github.com/auth0/node-jsonwebtoken',
        estimatedHours: 20,
      },
      {
        title: 'WebSockets & Real-Time',
        slug: 'websockets-realtime',
        description: 'Socket.io for chat/notifications and scaling considerations.',
        resourceUrl: 'https://socket.io/docs/v4/',
        estimatedHours: 20,
      },
      {
        title: 'Testing & TypeScript Node',
        slug: 'nodejs-testing-typescript',
        description: 'Jest/Supertest API tests and TypeScript Express setup.',
        resourceUrl: 'https://jestjs.io/docs/getting-started',
        estimatedHours: 20,
      },
      {
        title: 'Production Node.js Project',
        slug: 'nodejs-production-project',
        description: 'Deploy API with logging (pino), env config, Docker, and health endpoints.',
        estimatedHours: 30,
      },
    ],
  },
  {
    title: 'System Design for Interviews',
    slug: 'system-design-roadmap',
    topic: 'System Design',
    description:
      'Scalable architecture, trade-offs, and interview frameworks for system design rounds at product companies.',
    difficulty: 'hard',
    estimatedHours: 120,
    salaryExpectations:
      'System design mastery targets ₹15–40+ LPA product offers (Google, Amazon, Uber). Even service companies ask high-level design for senior trainee tracks — early prep differentiates top candidates.',
    timeline: '2–3 months (after DSA foundation)',
    faq: [
      {
        question: 'When should I start system design prep?',
        answer:
          'After solving ~150 DSA problems. Final-year students targeting product companies should start 3 months before interviews with 2 sessions per week.',
      },
    ],
    steps: [
      {
        title: 'Scalability Fundamentals',
        slug: 'scalability-fundamentals',
        description: 'Vertical vs horizontal scaling, CAP theorem, and latency vs throughput trade-offs.',
        resourceUrl: 'https://github.com/donnemartin/system-design-primer',
        estimatedHours: 20,
      },
      {
        title: 'Load Balancing & Caching',
        slug: 'load-balancing-caching',
        description: 'Reverse proxies, CDN, cache invalidation, and consistent hashing.',
        resourceUrl: 'https://aws.amazon.com/caching/',
        estimatedHours: 20,
      },
      {
        title: 'Databases at Scale',
        slug: 'databases-at-scale',
        description: 'Sharding, replication, SQL vs NoSQL selection, and read/write paths.',
        resourceUrl: 'https://www.mongodb.com/basics/sharding',
        estimatedHours: 20,
      },
      {
        title: 'Message Queues & Async Design',
        slug: 'message-queues-async',
        description: 'Kafka/RabbitMQ patterns, idempotency, and eventual consistency.',
        resourceUrl: 'https://kafka.apache.org/documentation/',
        estimatedHours: 15,
      },
      {
        title: 'Microservices & API Gateway',
        slug: 'microservices-api-gateway',
        description: 'Service boundaries, saga patterns, circuit breakers, and gateway routing.',
        resourceUrl: 'https://microservices.io/patterns/index.html',
        estimatedHours: 20,
      },
      {
        title: 'Classic Interview Problems',
        slug: 'classic-system-design-problems',
        description: 'URL shortener, Twitter feed, WhatsApp chat, rate limiter, and payment gateway — practice with timed whiteboard.',
        resourceUrl: 'https://www.educative.io/blog/complete-system-design-interview-guide',
        estimatedHours: 25,
      },
    ],
  },
];

function buildDescription(template: ReturnType<typeof buildRoadmapTemplate>): string {
  return [
    template.excerpt,
    '',
    `**Salary expectations:** ${template.salaryExpectations}`,
    '',
    `**Recommended timeline:** ${template.timeline}`,
  ].join('\n');
}

export async function seedRoadmaps(ctx: SeedContext): Promise<string[]> {
  const paths: string[] = [];

  for (const def of ROADMAP_DEFINITIONS) {
    const template = buildRoadmapTemplate({
      title: def.title,
      slug: def.slug,
      topic: def.topic,
      description: def.description,
      difficulty: def.difficulty,
      estimatedHours: def.estimatedHours,
      steps: def.steps,
      salaryExpectations: def.salaryExpectations,
      timeline: def.timeline,
      author: ROADMAP_AUTHOR,
      faq: def.faq,
    });

    await ctx.prisma.careerRoadmap.upsert({
      where: { slug: template.slug },
      update: {
        title: template.title,
        description: buildDescription(template),
        difficulty: template.difficulty as DifficultyLevel,
        estimatedHours: template.estimatedHours,
        topic: template.topic,
        isPublished: true,
        metaTitle: template.seo.metaTitle,
        metaDescription: template.seo.metaDescription,
        thumbnailUrl: roadmapImageUrl(def.topic, def.slug),
      },
      create: {
        slug: template.slug,
        title: template.title,
        description: buildDescription(template),
        difficulty: template.difficulty as DifficultyLevel,
        estimatedHours: template.estimatedHours,
        topic: template.topic,
        isPublished: true,
        metaTitle: template.seo.metaTitle,
        metaDescription: template.seo.metaDescription,
        thumbnailUrl: roadmapImageUrl(def.topic, def.slug),
        steps: {
          create: template.steps.map((step, index) => ({
            slug: step.slug,
            title: step.title,
            description: step.description,
            stepOrder: index + 1,
            resourceUrl: step.resourceUrl,
            resourceType: step.resourceUrl ? 'documentation' : null,
            estimatedHours: step.estimatedHours,
          })),
        },
      },
    });

    paths.push(`/prepare/roadmaps/${template.slug}`);
    for (const step of template.steps) {
      paths.push(`/prepare/roadmaps/${template.slug}/${step.slug}`);
    }
  }

  paths.push('/prepare/roadmaps');
  return paths;
}

export { ROADMAP_DEFINITIONS };
