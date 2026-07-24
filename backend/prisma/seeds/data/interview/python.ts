import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const PYTHON_BANK: InterviewTopicBank = {
  topic: 'Python',
  topicSlug: 'python',
  questions: [
    q(
      'What is Python and why is it popular for campus placements?',
      'Python is a high-level, interpreted programming language known for readable syntax and rapid development. It dominates data science, automation, backend web development with Django and Flask, and scripting in DevOps pipelines. Indian service companies like TCS and Cognizant test Python basics in technical rounds, while startups use it for ML and API services. Python supports multiple paradigms — procedural, object-oriented, and functional. Its vast ecosystem of libraries such as NumPy, Pandas, and FastAPI makes it a top choice for final-year projects and internship interviews across Indian campuses.',
      'easy',
    ),
    q(
      'What is the difference between a list and a tuple in Python?',
      'Lists are mutable sequences defined with square brackets — you can add, remove, or modify elements after creation. Tuples use parentheses and are immutable, making them hashable and usable as dictionary keys when they contain only immutable items. Lists are preferred for collections that change; tuples suit fixed records like coordinates or database rows. Tuples have slightly lower memory overhead and faster iteration. In campus coding tests, choose tuples for function return values that should not be accidentally modified and lists for dynamic data processing.',
      'easy',
    ),
    q(
      'Explain the difference between is and == in Python.',
      'The == operator checks value equality by calling __eq__ on objects — two strings with the same content compare equal. The is operator checks identity — whether two references point to the exact same object in memory. Small integers from -5 to 256 and short strings may be interned, causing surprising is results in REPL demos. Never use is to compare strings or numbers for equality in production code. Use is only for singleton checks like if x is None, which is the idiomatic Python pattern preferred over == None.',
      'easy',
    ),
    q(
      'What are Python decorators and why are they used?',
      'Decorators are functions that wrap another function or class to extend behavior without modifying its source code. The @decorator syntax applies the wrapper at definition time. Common uses include logging, authentication checks, caching with functools.lru_cache, and route registration in Flask. A decorator receives the original function, defines an inner wrapper, and returns it — often using functools.wraps to preserve metadata. Campus interviewers ask you to write a simple timer decorator; understanding closures is essential to explain how decorators capture the wrapped function reference.',
      'easy',
    ),
    q(
      'What is a dictionary in Python and how is it implemented?',
      'A dictionary stores key-value pairs with O(1) average lookup time using a hash table internally. Keys must be hashable — immutable types like strings, numbers, and tuples work; lists do not. Python 3.7+ guarantees insertion order preservation. Common methods include get(), keys(), values(), items(), and update(). Dict comprehensions build dictionaries concisely. In placement interviews, dictionaries solve frequency counting, two-sum complement lookups, and graph adjacency lists. defaultdict and Counter from collections simplify common patterns in coding rounds.',
      'easy',
    ),
    q(
      'What is the difference between append() and extend() on a list?',
      'append(x) adds a single element to the end of the list — append([1,2]) creates one nested list element. extend(iterable) adds each element from the iterable individually — extend([1,2]) adds 1 and 2 as separate elements. Using append in a loop to merge lists is slower than extend or list concatenation. In campus coding, confusing these causes wrong output in matrix or graph construction problems. Remember: append increases length by one; extend increases by the length of the iterable.',
      'easy',
    ),
    q(
      'What are *args and **kwargs in Python?',
      '*args collects extra positional arguments as a tuple in function definitions, allowing variable argument counts. **kwargs collects extra keyword arguments as a dictionary. They enable flexible APIs and wrapper functions that forward arguments to inner calls. Naming is conventional — only the asterisk matters; you could write *values but args is idiomatic. In Django and Flask views, **kwargs often carries URL parameters. Interviewers may ask you to write a function accepting any arguments and forwarding them using func(*args, **kwargs).',
      'easy',
    ),
    q(
      'What is list comprehension and give an example.',
      'List comprehension provides a concise syntax to create lists from iterables with optional filtering and transformation. Syntax: [expression for item in iterable if condition]. Example: squares = [x*x for x in range(10) if x % 2 == 0]. It is faster and more readable than equivalent for loops for simple transformations. Similar comprehensions exist for dicts and sets. Campus interviewers favor comprehensions in Python coding rounds but warn against nesting too deeply, which hurts readability — use regular loops for complex logic.',
      'easy',
    ),
    q(
      'What is the Global Interpreter Lock (GIL) in Python?',
      'The GIL is a mutex in CPython that allows only one thread to execute Python bytecode at a time per process, even on multi-core CPUs. It simplifies memory management for reference counting but limits CPU-bound multithreading performance. IO-bound tasks still benefit from threads because the GIL is released during IO waits. For CPU-bound parallelism, use multiprocessing or run native extensions that release the GIL. Campus interviews at data science and backend roles expect you to mention GIL when comparing Python threads versus Java threads for compute-heavy workloads.',
      'easy',
    ),
    q(
      'How does exception handling work in Python?',
      'Python uses try, except, else, and finally blocks. except catches specific exception types; catching Exception broadly hides bugs. else runs when no exception occurred in try. finally always executes for cleanup like closing files. raise explicitly throws exceptions; custom exceptions inherit from Exception. Context managers with with statement handle cleanup automatically — open() files should always use with. In campus coding, handle KeyError and ValueError specifically when parsing user input rather than bare except clauses that swallow KeyboardInterrupt.',
      'easy',
    ),
    q(
      'Explain shallow copy versus deep copy in Python.',
      'Shallow copy creates a new container but references the same nested objects — copy.copy() or list[:] for lists. Deep copy recursively duplicates all nested objects — copy.deepcopy(). Mutating a nested list in a shallow copy affects both copies. Deep copy is needed for independent nested structures in graph cloning or configuration objects. Assignment is neither — it creates another reference to the same object. Campus interviewers give scenarios with nested lists to test this distinction, especially when passing mutable default arguments that share state across function calls..',
      'medium',
    ),
    q(
      'What are Python generators and yield?',
      'Generators are iterators created using functions with yield or generator expressions like (x*x for x in range(n)). yield pauses execution and returns a value; next call resumes from that point. Generators consume constant memory for large datasets — processing million-row CSV files line by line in placement data projects. They are lazy: values computed on demand. yield from delegates to sub-generators. Interviewers ask why generators beat building full lists for streaming pipelines and how to convert generators to lists with list() when random access is needed..',
      'medium',
    ),
    q(
      'Explain object-oriented concepts in Python: class, inheritance, and polymorphism.',
      'Classes define blueprints with attributes and methods; __init__ initializes instance state. Inheritance uses class Child(Parent) to reuse and override behavior; super() calls parent methods. Python supports multiple inheritance with Method Resolution Order resolved by C3 linearization. Polymorphism allows different classes to implement the same interface — duck typing means if it quacks like a duck, use it without strict interfaces. @property creates getters; @classmethod and @staticmethod serve class-level and utility functions. Campus viva often asks about __str__ versus __repr__ and why self is explicit in method signatures unlike Java this..',
      'medium',
    ),
    q(
      'What is the difference between module, package, and library in Python?',
      'A module is a single .py file containing functions, classes, and variables. A package is a directory with __init__.py (optional in Python 3.3+ namespace packages) containing multiple modules — import mypackage.utils. A library is a broader term for reusable code collections installable via pip like requests or pandas. Relative imports use dot notation within packages. __name__ == "__main__" guards script entry points. Campus project discussions should mention virtual environments (venv) to isolate dependencies and requirements.txt for reproducible installs during Infosys and Zoho Python developer interviews..',
      'medium',
    ),
    q(
      'How does Python memory management and garbage collection work?',
      'CPython uses reference counting — when an object reference count hits zero, memory is freed immediately. A cyclic garbage collector detects and cleans reference cycles involving containers. Objects are allocated on the heap; integers and small strings may be interned. Memory leaks can occur if global lists hold references to unused objects. weakref module creates references that do not prevent collection. In campus senior rounds, contrast Python GC with Java generational GC and explain why long-running Django processes need monitoring for memory growth from cached querysets or global caches..',
      'medium',
    ),
    q(
      'What are lambda functions and when should you use them?',
      'Lambda functions are anonymous one-expression functions: lambda x, y: x + y. They are limited to a single expression — no statements or assignments. Useful for short callbacks in sorted(data, key=lambda x: x[1]) or map and filter operations. Avoid complex lambdas that hurt readability — use def for anything non-trivial. In pandas, lambdas appear in apply and assign for row transformations. Campus interviewers caution that overusing lambdas in interviews reduces clarity; prefer named functions unless the logic fits one readable line..',
      'medium',
    ),
    q(
      'Explain common Python data structures from the collections module.',
      'collections.defaultdict provides default values for missing keys, eliminating KeyError in graph adjacency lists. Counter counts hashable objects and offers most_common for frequency analysis. deque supports O(1) append and pop from both ends — ideal for BFS queues. namedtuple creates tuple subclasses with named fields for readable records. OrderedDict preserved order before Python 3.7 dict ordering guarantee. ChainMap combines multiple dicts for configuration layering. These appear frequently in campus DSA coding rounds implemented in Python and in data pipeline questions at Flipkart and Swiggy analyst interviews..',
      'medium',
    ),
    q(
      'What is Flask and how does it differ from Django?',
      'Flask is a lightweight microframework giving routing, templates, and extension hooks — you choose ORM, auth, and structure. Django is a batteries-included framework with ORM, admin panel, migrations, and authentication built in. Flask suits small APIs and microservices; Django suits full web applications with rapid CRUD development. Both appear in Indian campus hiring for Python backend roles. Flask uses decorators like @app.route; Django uses URLconf and class-based views. Mention Jinja2 templating in Flask and Django REST Framework for API projects in your final-year placement tracker or e-commerce mini project..',
      'medium',
    ),
    q(
      'How do you read and write files in Python properly?',
      'Always use with open(path, mode, encoding="utf-8") as f: for automatic file closing even when exceptions occur. Read modes: r, rb for binary; write: w, a for append. read(), readline(), and readlines() load content; iterate line by line for large files to save memory. json module parses JSON files; csv module handles CSV with dialect options. pathlib.Path provides object-oriented path handling preferred over os.path in modern Python. Campus interviewers ask about encoding errors with Indian language text and why binary mode skips encoding — relevant for resume upload features in placement portal projects..',
      'medium',
    ),
    q(
      'What are Python context managers and the with statement?',
      'Context managers define __enter__ and __exit__ methods to set up and tear down resources reliably. with open("file.txt") as f ensures the file closes even if an exception occurs. contextlib.contextmanager decorator lets you write context managers using yield. Common uses include database connections, file locks, and transaction scopes in SQLAlchemy. __exit__ receives exception info and can suppress exceptions by returning True. Campus advanced questions ask you to implement a timer context manager or a database transaction wrapper — demonstrating understanding beyond built-in with open pattern..',
      'medium',
    ),
    q(
      'Explain asyncio and async/await in Python for backend interviews.',
      'asyncio enables cooperative multitasking for IO-bound concurrent code using async def coroutines and await for non-blocking waits. The event loop schedules coroutines; await yields control during network or disk IO. asyncio.gather runs multiple coroutines concurrently on a single thread. Unlike threads, asyncio avoids GIL contention for IO workloads but requires async-compatible libraries like aiohttp instead of requests. FastAPI builds on asyncio for high-performance APIs popular in Indian startups. Campus system design answers mention asyncio for chat servers and notification services where thousands of idle connections would exhaust thread pools in synchronous Flask deployments..',
      'hard',
    ),
    q(
      'How would you optimize Python code for performance in a data processing pipeline?',
      'Profile first using cProfile or py-spy to find bottlenecks — never optimize blindly. Use vectorized NumPy and Pandas operations instead of Python loops over rows. Employ multiprocessing.Pool for CPU-bound tasks to bypass GIL. Cache expensive pure functions with functools.lru_cache. Prefer built-in functions and local variable lookups over global access. Use __slots__ in classes with many instances to reduce memory. Cython or Numba JIT compiles hot numerical loops. For IO, batch database writes and use connection pooling. In campus interviews, discuss trade-off between readability and speed — premature optimization wastes time; measure, then apply targeted fixes for placement analytics batch jobs processing lakhs of student records.',
      'hard',
    ),
    q(
      'Explain Python metaclasses and when they are actually needed.',
      'Metaclasses are classes of classes — type is the default metaclass that creates class objects. Custom metaclasses override class creation via __new__ and __init__ on the metaclass to enforce APIs, register subclasses automatically, or add methods dynamically. Django ORM models use metaclasses internally. Most application code never needs custom metaclasses; dataclasses and decorators solve most problems more clearly. Interviewers at senior Python roles test whether you reach for metaclasses appropriately or over-engineer. Explain that PEP 3115 simplified syntax with class Meta: metaclass=MyMeta and that understanding metaclasses helps debug framework magic in Flask extensions and SQLAlchemy declarative bases..',
      'hard',
    ),
    q(
      'How does Python handle concurrency versus parallelism?',
      'Concurrency is structuring code to handle multiple tasks — asyncio and threading achieve concurrency on one core by interleaving execution during waits. Parallelism executes tasks simultaneously on multiple cores — multiprocessing spawns separate processes with independent Python interpreters, bypassing GIL for CPU work. threading.Thread suits IO-bound web scrapers; multiprocessing.Pool suits image processing or ML preprocessing. concurrent.futures provides ThreadPoolExecutor and ProcessPoolExecutor unified APIs. Campus system design for job alert systems: use Celery workers (multiprocessing) for email batch sends and asyncio for real-time websocket notifications — explain why mixing models requires clear process boundaries..',
      'hard',
    ),
    q(
      'Design a REST API using FastAPI for a campus placement application.',
      'Define Pydantic models for Student, Job, and Application with validation — CGPA bounds, email format, and enum status fields. Use APIRouter to organize endpoints: POST /applications with dependency-injected DB session, GET /jobs with pagination query params. JWT authentication via OAuth2PasswordBearer and Depends(get_current_user) secures routes. SQLAlchemy async engine with asyncpg connects to PostgreSQL; Alembic manages migrations. BackgroundTasks or Celery sends application confirmation emails asynchronously. OpenAPI docs auto-generate at /docs for frontend teams. Discuss rate limiting, CORS for React frontend, and idempotent application submission using client request IDs — strong architecture answer for product company campus hires expecting production-minded Python backend design.',
      'hard',
    ),
    q(
      'Explain descriptor protocol and how @property works internally.',
      'Descriptors implement __get__, __set__, or __delete__ and control attribute access on owner classes. Functions are descriptors — bind to instances as methods via __get__. @property wraps a getter function in a descriptor whose __get__ returns the computed value; @name.setter adds __set__. classmethod and staticmethod use descriptor machinery differently. Understanding descriptors explains how Django model fields intercept assignment for database mapping. Custom validators can be descriptors enforcing type constraints. Campus senior Python interviews ask candidates to implement a typed property descriptor validating assignment — demonstrates deep language knowledge beyond surface-level decorator usage in college projects..',
      'hard',
    ),
    q(
      'What are Python typing features and why do companies use them?',
      'Type hints via typing module — List[str], Optional[int], Union, Callable — document expected types without runtime enforcement by default. mypy and pyright static analyzers catch bugs before deployment. Python 3.9+ uses built-in generics: list[str] instead of List[str]. Protocol defines structural subtyping for duck typing with type safety. TypedDict specifies dict shapes; dataclasses generate boilerplate with type annotations. FastAPI uses types for automatic validation and OpenAPI schemas. Indian product companies adopting Python increasingly expect type hints in code reviews. Campus candidates should show a typed function signature in coding rounds and explain that types improve IDE autocomplete and reduce production errors in large codebases.',
      'hard',
    ),
    q(
      'How would you debug a memory leak in a long-running Django application?',
      'Monitor memory with tracemalloc, memory_profiler, or APM tools like Datadog. Suspect global caches without TTL, queryset evaluation storing large result sets, and circular references in custom classes. Use gc.get_objects() and objgraph to find unexpected reference holders. Django Debug Toolbar and silk profile ORM query counts — N+1 queries inflate memory. Fix by using iterator(), values_list(), pagination, and clearing caches periodically. WeakValueDictionary for caches allows GC collection. Deploy with worker recycling in gunicorn --max-requests to mitigate leaks temporarily. Campus architecture interviews value systematic approaches: reproduce under load, measure heap growth, identify retaining references, patch and verify — rather than restarting servers blindly in production.',
      'hard',
    ),
    q(
      'Compare Python data model special methods for operator overloading.',
      'Python dunder methods customize object behavior: __init__ constructs, __repr__ and __str__ format strings, __eq__ defines equality, __lt__ enables sorting, __add__ overloads +, __getitem__ supports indexing, __enter__/__exit__ enable context managers, __call__ makes instances callable. collections.abc interfaces document expected methods for Sequence, Mapping, and Iterable. Implementing __hash__ alongside __eq__ is required for set and dict key usage — mutable objects must not be hashable. Campus OOP questions ask you to design a Vector class with __add__ and __mul__ or a Fraction class with __eq__ — testing whether you understand Pythonic operator overloading versus Java-style verbose method names..',
      'hard',
    ),
    q(
      'How do you profile and debug performance issues in a Python web application?',
      'Start with measurable baselines using cProfile, py-spy, or APM tools to locate hot paths before optimizing. Common bottlenecks include N+1 ORM queries, synchronous external API calls in request handlers, and unbounded in-memory caches. Fix with select_related/prefetch_related, async tasks via Celery, database indexes, and connection pooling. Load-test with locust simulating campus fest traffic spikes. After each change, re-profile to confirm improvement rather than assuming. In campus backend interviews, articulate this systematic measure-fix-verify loop—it shows production mindset beyond writing endpoints that pass Postman tests in college demos..',
      'hard',
    ),
  ],
};
