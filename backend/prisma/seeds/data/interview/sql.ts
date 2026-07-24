import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const SQL_BANK: InterviewTopicBank = {
  topic: 'SQL',
  topicSlug: 'sql',
  questions: [
    q(
      'What is SQL and what are its main categories of commands?',
      'SQL (Structured Query Language) is the standard language for managing relational databases. Commands fall into categories: DDL (Data Definition Language) like CREATE, ALTER, DROP for schema; DML (Data Manipulation Language) like SELECT, INSERT, UPDATE, DELETE for data; DCL (Data Control Language) like GRANT and REVOKE for permissions; and TCL (Transaction Control Language) like COMMIT and ROLLBACK. Campus placements at TCS, Infosys, and database roles test SQL heavily in aptitude plus technical rounds. Knowing SELECT basics and table relationships is mandatory for almost every software engineer interview in India.',
      'easy',
    ),
    q(
      'What is the difference between PRIMARY KEY and UNIQUE constraint?',
      'PRIMARY KEY uniquely identifies each row, cannot be NULL, and only one per table. It automatically creates a clustered index in SQL Server or unique index in MySQL and PostgreSQL. UNIQUE constraint also enforces uniqueness but allows one NULL in most databases (multiple NULLs in PostgreSQL). A table can have multiple UNIQUE constraints. Use PRIMARY KEY for the main identifier like student_id; use UNIQUE for alternate keys like email or roll_number. Campus interviews often ask why every table should have a primary key for efficient joins and ORM mapping in Hibernate or Django.',
      'easy',
    ),
    q(
      'Explain INNER JOIN, LEFT JOIN, and RIGHT JOIN.',
      'INNER JOIN returns rows where the join condition matches in both tables — only students with applications appear if joining students and applications. LEFT JOIN returns all rows from the left table plus matching rows from the right; non-matching right columns are NULL — all students even without applications. RIGHT JOIN is the mirror — all right table rows preserved. FULL OUTER JOIN returns all rows from both sides with NULLs where no match exists. Campus SQL questions frequently ask to list students who never applied using LEFT JOIN with WHERE applications.id IS NULL anti-join pattern.',
      'easy',
    ),
    q(
      'What is the difference between WHERE and HAVING clauses?',
      'WHERE filters rows before grouping — it cannot use aggregate functions. HAVING filters groups after GROUP BY using conditions on aggregates like HAVING COUNT(*) > 5. Example: find departments with average salary above 6 LPA requires GROUP BY department_id HAVING AVG(salary) > 600000. WHERE applies to individual row columns; HAVING applies to group summaries. Campus interviewers give trick questions mixing both — filter active employees with WHERE status = active before grouping, then HAVING on counts. Understanding order of execution (WHERE before GROUP BY before HAVING) prevents logical errors.',
      'easy',
    ),
    q(
      'What are aggregate functions in SQL?',
      'Aggregate functions compute summary values across rows: COUNT counts rows or non-null values; SUM and AVG operate on numeric columns; MIN and MAX find extremes; GROUP_CONCAT or STRING_AGG concatenates strings per group. Without GROUP BY, aggregates collapse the entire result to one row. With GROUP BY, each group gets its own aggregate values. DISTINCT inside aggregates like COUNT(DISTINCT company_id) counts unique values. Campus placement SQL tests ask average CGPA per branch, total applications per company, and highest package offered — all standard aggregate scenarios.',
      'easy',
    ),
    q(
      'What is the ORDER BY clause used for?',
      'ORDER BY sorts result rows by one or more columns ascending (ASC, default) or descending (DESC). Multiple columns sort left to right: ORDER BY cgpa DESC, created_at ASC breaks ties by date. ORDER BY can use column aliases from SELECT in most databases. Without ORDER BY, result order is undefined — never assume insertion order. Pagination uses ORDER BY with LIMIT and OFFSET: ORDER BY id LIMIT 10 OFFSET 20 for page 3. Campus interviews stress that missing ORDER BY in leaderboard queries produces random ranking, a common bug in student project demos.',
      'easy',
    ),
    q(
      'What is a foreign key and why is it important?',
      'A foreign key column references the primary key of another table, enforcing referential integrity. It prevents orphan records — you cannot insert an application with invalid student_id. ON DELETE CASCADE removes child rows when parent is deleted; ON DELETE SET NULL nullifies the reference; RESTRICT blocks parent deletion. Foreign keys document relationships and help query optimizers choose join plans. Campus ER diagram questions always include FK from applications to students and jobs. ORMs like Sequelize and Hibernate map foreign keys to association fields in backend projects.',
      'easy',
    ),
    q(
      'What is the difference between DELETE and TRUNCATE?',
      'DELETE removes rows one by one, can use WHERE to filter, fires row-level triggers, and can be rolled back in a transaction. TRUNCATE removes all rows quickly by deallocating data pages, resets identity seeds in SQL Server, cannot use WHERE, and is DDL in some databases with implicit commit. TRuncate is faster for clearing entire tables but dangerous in production. Campus DBMS viva asks when to use DELETE for partial cleanup versus TRUNCATE for staging table resets before bulk imports in ETL pipelines.',
      'easy',
    ),
    q(
      'What is NULL in SQL and how do you compare it?',
      'NULL represents missing or unknown data — not zero or empty string. Any comparison with NULL using = or <> yields UNKNOWN (treated as false in WHERE). Use IS NULL or IS NOT NULL to test for nullity. Aggregate functions except COUNT(*) ignore NULL inputs. COALESCE(col, default) replaces NULL with a fallback value. Campus trick questions include WHERE col = NULL which matches nothing — always use IS NULL. Functions like IFNULL in MySQL or NVL in Oracle handle null display in reports for placement analytics dashboards.',
      'easy',
    ),
    q(
      'What is a subquery and when would you use one?',
      'A subquery is a query nested inside another query in WHERE, FROM, or SELECT clauses. Use subqueries when you need intermediate results — find students whose CGPA exceeds the average: WHERE cgpa > (SELECT AVG(cgpa) FROM students). Correlated subqueries reference outer query rows row-by-row — often slower than JOINs. EXISTS subqueries check existence efficiently for semi-joins. Campus SQL rounds ask find companies that received more applications than average using subqueries or window functions as alternative approaches demonstrating SQL depth.',
      'easy',
    ),
    q(
      'Explain database normalization and normal forms up to 3NF.',
      'Normalization reduces redundancy and update anomalies by organizing data into related tables. First Normal Form (1NF): atomic columns, no repeating groups — separate skills into a junction table instead of skill1, skill2 columns. Second Normal Form (2NF): 1NF plus no partial dependency on composite keys — move branch_name out of enrollments if it depends only on branch_id. Third Normal Form (3NF): 2NF plus no transitive dependency — store department_id in employees, not department_name which depends on department_id not employee_id. Campus DBMS exams and interviews ask denormalize selectively for read-heavy reporting while keeping transactional schemas normalized..',
      'medium',
    ),
    q(
      'What are indexes in SQL and what are their trade-offs?',
      'Indexes are data structures (usually B-trees) that speed up SELECT, WHERE, JOIN, and ORDER BY on indexed columns at the cost of slower INSERT, UPDATE, DELETE and extra storage. Primary keys create indexes automatically. Create indexes on frequently filtered columns like email, status, and foreign keys used in joins. Avoid indexing low-cardinality columns like gender alone on large tables. Composite indexes follow leftmost prefix rule — index (branch, cgpa) helps WHERE branch = CSE but not WHERE cgpa > 8 alone. Campus performance questions ask why over-indexing hurts write-heavy application tables in placement portals..',
      'medium',
    ),
    q(
      'Explain ACID properties of database transactions.',
      'Atomicity ensures all statements in a transaction succeed or all roll back — transfer CTC update and offer letter insert together or neither. Consistency maintains defined constraints and rules after each transaction. Isolation prevents concurrent transactions from interfering — levels include Read Uncommitted, Read Committed, Repeatable Read, Serializable with increasing lock overhead. Durability guarantees committed data survives crashes via write-ahead logging. Campus DBMS theory questions link ACID to banking and placement offer workflows. Interviewers ask which isolation level prevents dirty reads and whether PostgreSQL default Read Committed suffices for most web apps..',
      'medium',
    ),
    q(
      'What is the difference between clustered and non-clustered indexes?',
      'Clustered index determines physical row order in the table — only one per table, usually on primary key. Non-clustered index stores index key plus pointer to actual row location or clustered key. Queries covering indexed columns avoid table lookups via index-only scans. SQL Server heaps have no clustered index; InnoDB primary key is clustered. Campus advanced SQL asks which index type speeds range scans on created_at for recent job listings. Understanding clustered versus non-clustered helps explain why primary key choice matters for insertion patterns in high-volume application tables..',
      'medium',
    ),
    q(
      'Write an SQL query to find the second highest salary from an employees table.',
      'Multiple approaches exist: subquery — SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees). LIMIT/OFFSET — SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1. Window function (preferred) — SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rk FROM employees) t WHERE rk = 2. Handle duplicates with DENSE_RANK versus ROW_NUMBER. Campus interviews test all approaches and ask about NULL when fewer than two rows exist. Window functions demonstrate modern SQL skills valued at product companies over legacy nested subquery patterns..',
      'medium',
    ),
    q(
      'What are window functions in SQL?',
      'Window functions compute values across related rows without collapsing groups like aggregates do. Syntax: FUNCTION() OVER (PARTITION BY col ORDER BY col). ROW_NUMBER assigns unique sequence; RANK and DENSE_RANK handle ties differently; LAG and LEAD access previous and next rows; SUM() OVER provides running totals. Example: rank students by CGPA within each branch using RANK() OVER (PARTITION BY branch ORDER BY cgpa DESC). Campus SQL advanced rounds at Amazon and Goldman Sachs test window functions for top-N per group queries replacing correlated subqueries with better performance and readability..',
      'medium',
    ),
    q(
      'Explain the difference between UNION and UNION ALL.',
      'UNION combines result sets of two queries with matching columns and removes duplicates, requiring a sort step. UNION ALL concatenates results keeping duplicates and is faster when duplicates are acceptable or impossible. Both require compatible column counts and types. Campus questions ask combine selected and waitlisted students lists — use UNION ALL if lists are mutually exclusive. ORDER BY applies to final combined result. Interviewers note UNION is expensive on large datasets and suggest UNION ALL plus application-level deduplication or single query with OR conditions when possible for placement database reporting..',
      'medium',
    ),
    q(
      'What is a VIEW and what are its advantages?',
      'A VIEW is a stored query appearing as a virtual table — SELECT * FROM active_jobs_view runs the underlying query. Views simplify complex joins for analysts, enforce row-level security by filtering sensitive columns, and provide stable interfaces when base schema changes. Materialized views store results physically and refresh periodically for faster reads at staleness cost. Views are updatable under certain constraints in some databases. Campus projects use views for dashboard queries joining students, applications, and companies. Interviewers contrast views with ORM query methods and discuss when materialized views help placement statistics refreshed nightly..',
      'medium',
    ),
    q(
      'How do you optimize a slow SQL query in production?',
      'Analyze execution plan with EXPLAIN or EXPLAIN ANALYZE to find sequential scans and high-cost nodes. Add appropriate indexes on filter and join columns. Rewrite subqueries as JOINs or EXISTS when faster. Avoid SELECT * — fetch only needed columns. Update table statistics so optimizer chooses good plans. Partition large tables by date or region. Cache frequent read queries in Redis for placement job listings. Campus system design follow-ups connect slow queries to missing indexes on foreign keys — a common issue in student CRUD projects using ORMs that hide generated SQL until production slowdowns appear under campus fest traffic spikes.',
      'medium',
    ),
    q(
      'What is database denormalization and when is it justified?',
      'Denormalization intentionally duplicates data across tables to reduce joins and improve read performance at the cost of update complexity and inconsistency risk. Justified for read-heavy analytics dashboards, caching layers, and reporting tables fed by ETL. Example: store company_name in applications table to avoid join in list API. Maintain consistency via triggers, application logic, or eventual sync jobs. Campus architecture interviews expect trade-off discussion: normalized schema for transactional integrity during offer acceptance; denormalized read models for recruiter dashboards showing application counts per college. Mention CQRS pattern separating write and read schemas in advanced answers..',
      'medium',
    ),
    q(
      'Design a database schema for a campus placement management system.',
      'Core tables: students(id, name, email, branch, cgpa, grad_year), companies(id, name, tier, domain), jobs(id, company_id, title, ctc_min, ctc_max, location, deadline), applications(id, student_id, job_id, status, applied_at), interviews(id, application_id, round, scheduled_at, result). Junction table student_skills(student_id, skill_id) for many-to-many skills. Indexes on applications(student_id, job_id), jobs(deadline), students(branch, cgpa). ENUM or lookup table for application status. Audit table application_history for status changes. Discuss soft deletes with deleted_at, UUID versus auto-increment IDs for public APIs, and partitioning applications by grad_year for archival — comprehensive schema answer for DBMS viva and backend design rounds at Indian product companies..',
      'hard',
    ),
    q(
      'Explain isolation levels with phenomena they prevent.',
      'Read Uncommitted allows dirty reads — seeing uncommitted changes from other transactions. Read Committed prevents dirty reads but allows non-repeatable reads — same query returns different rows if another transaction commits. Repeatable Read prevents non-repeatable reads but may allow phantom reads — new rows appear in repeated range scans. Serializable prevents all phenomena through strict locking or serialization, hurting concurrency. PostgreSQL Repeatable Read uses MVCC snapshot preventing phantoms for most cases. MySQL InnoDB default is Repeatable Read. Campus DBMS interviews ask map phenomena to placement scenario: two recruiters updating same application status concurrently — needs optimistic locking with version column or SELECT FOR UPDATE.',
      'hard',
    ),
    q(
      'How would you find duplicate records and remove them keeping one row?',
      'Detect duplicates: SELECT email, COUNT(*) FROM students GROUP BY email HAVING COUNT(*) > 1. Delete keeping lowest id: DELETE s1 FROM students s1 INNER JOIN students s2 ON s1.email = s2.email AND s1.id > s2.id. Window approach: DELETE FROM students WHERE id NOT IN (SELECT MIN(id) FROM students GROUP BY email). PostgreSQL uses DELETE USING or CTE with ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) WHERE rn > 1. Always backup before mass delete and wrap in transaction. Campus data cleaning questions appear in analyst and backend roles — discuss unique constraints preventing future duplicates after cleanup in student registration tables.',
      'hard',
    ),
    q(
      'Compare SQL JOIN types with real placement query examples.',
      'INNER JOIN students and applications shows only applicants — use for application pipeline reports. LEFT JOIN students to applications lists all students with NULL application fields for non-applicants — identify inactive students for counselor outreach. LEFT JOIN applications to students where students.id IS NULL finds orphan applications after bad data import. FULL OUTER JOIN compares two year cohorts finding students in either but not both lists. CROSS JOIN generates combinations like all students times all workshops for attendance matrix — beware exponential row growth. Self JOIN on employees manager_id finds reporting hierarchy. Campus SQL panel expects you to pick correct join for business question without defaulting to INNER JOIN losing required rows.',
      'hard',
    ),
    q(
      'Explain query execution plan reading for interview scenarios.',
      'EXPLAIN shows planned operations: Seq Scan reads entire table — bad on large tables without selective filters. Index Scan or Index Only Scan reads index efficiently. Nested Loop Join suits small outer sets; Hash Join builds hash table for equality joins on large sets; Merge Join needs sorted inputs. Cost estimates guide optimization — higher cost nodes deserve attention. Filter and Recheck conditions show index predicate limitations. Campus performance interviews present slow placement search query and ask identify missing index on (location, experience_level) and rewrite OR conditions preventing index use. Understanding plans separates candidates who blindly add indexes from those who diagnose root causes systematically.',
      'hard',
    ),
    q(
      'What are stored procedures, triggers, and their pros and cons?',
      'Stored procedures are precompiled SQL routines stored in the database — encapsulate business logic close to data, reduce network round trips, and centralize validation. Triggers fire automatically on INSERT, UPDATE, DELETE — audit logs, enforce constraints, or cascade updates. Pros: performance, consistency, security via granted execute permissions. Cons: business logic hidden from application version control, harder to test, database vendor lock-in, debugging complexity. Modern microservices prefer application-layer logic with ORM migrations. Campus interviews ask when audit trigger on applications status change is appropriate versus event sourcing in application code — balanced answer acknowledges triggers for compliance logging in regulated hiring workflows.',
      'hard',
    ),
    q(
      'How do you implement pagination efficiently for large tables?',
      'OFFSET/LIMIT pagination is simple but slow for large offsets — OFFSET 100000 scans and discards rows. Keyset (cursor) pagination uses WHERE id > last_seen_id ORDER BY id LIMIT 20 leveraging index seek — preferred for infinite scroll job feeds. Encode cursor as base64 of sort columns for stable ordering with tie-breaker id. Avoid OFFSET in high-traffic APIs; document cursor expiration when data changes. COUNT(*) for total pages is expensive — return has_more boolean instead. Campus backend design for CampusJobsHub job listing API should describe keyset pagination on (posted_at, id) composite index — demonstrates production SQL knowledge beyond college OFFSET homework queries.',
      'hard',
    ),
    q(
      'Explain CAP theorem and how it relates to SQL versus NoSQL choices.',
      'CAP theorem states distributed systems cannot simultaneously guarantee Consistency, Availability, and Partition tolerance during network splits — pick two in practice. Traditional RDBMS on single node prioritize CA; distributed SQL like CockroachDB and Spanner aim for strong consistency with partition tolerance at latency cost. NoSQL databases like Cassandra choose AP with eventual consistency. Campus system design asks choose database for placement notification system: PostgreSQL for transactional offers requiring ACID; Redis for session cache sacrificing durability options; Elasticsearch for job search with near-real-time indexing and relaxed consistency. Articulate why financial offer letters need relational ACID while analytics dashboards tolerate stale aggregates — nuanced database selection answer.',
      'hard',
    ),
    q(
      'Write advanced SQL to compute running total and moving average of applications per day.',
      'Use window functions: SELECT applied_date, daily_count, SUM(daily_count) OVER (ORDER BY applied_date ROWS UNBOUNDED PRECEDING) AS running_total, AVG(daily_count) OVER (ORDER BY applied_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS seven_day_avg FROM (SELECT DATE(applied_at) AS applied_date, COUNT(*) AS daily_count FROM applications GROUP BY DATE(applied_at)) daily ORDER BY applied_date. FRAME clause controls window rows — ROWS versus RANGE behaves differently with ties. Campus data analyst interviews at Razorpay and PhonePe test window frames for cohort retention and funnel metrics. Explain performance: index on applied_at, pre-aggregate daily counts in materialized view for dashboard refresh — shows SQL plus data engineering thinking valued in campus analytics roles.',
      'hard',
    ),
    q(
      'How do you prevent SQL injection and secure database access in applications?',
      'Always use parameterized queries or ORM methods—never concatenate user input into SQL strings. Apply least-privilege DB users: application role without DROP or admin rights. Validate and sanitize input at application layer with allowlists for sort columns preventing order-by injection. Use ORM escape mechanisms and stored procedures with parameters when needed. Enable audit logging for sensitive tables like offers and salary data. Encrypt connections with TLS and secrets via environment variables not source code. Campus security questions expect OWASP awareness—mention prepared statements as primary defense and defense-in-depth with WAF and regular dependency patching for Indian placement portals handling student PII at scale.',
      'hard',
    ),
  ],
};
