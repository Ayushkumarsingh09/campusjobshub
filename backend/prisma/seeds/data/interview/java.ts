import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const JAVA_BANK: InterviewTopicBank = {
  topic: 'Java',
  topicSlug: 'java',
  questions: [
    q(
      'What is the difference between JDK, JRE, and JVM?',
      'JVM (Java Virtual Machine) is the runtime engine that executes compiled bytecode (.class files) on any platform. JRE (Java Runtime Environment) includes the JVM plus core libraries and supporting files needed to run Java applications. JDK (Java Development Kit) is the full toolkit for developers: it contains the JRE plus compilers (javac), debuggers, and other development utilities. In campus interviews, remember: you need JDK to write and compile code, JRE to run it, and JVM is what actually executes bytecode.',
      'easy',
    ),
    q(
      'Explain the difference between == and equals() in Java.',
      'The == operator compares references for objects — it checks whether two references point to the same memory location. For primitive types, == compares actual values. The equals() method compares logical equality of object content when properly overridden. String comparison is a classic trap: "hello" == new String("hello") is false with == but true with equals() after override. Always override equals() and hashCode() together when defining custom classes, especially if they will be used in HashMap or HashSet.',
      'easy',
    ),
    q(
      'What are the four pillars of Object-Oriented Programming in Java?',
      'The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction. Encapsulation bundles data and methods inside a class and restricts direct access using access modifiers and getters/setters. Inheritance allows a child class to reuse and extend a parent class using the extends keyword. Polymorphism lets one interface or reference type represent many forms — method overriding at runtime and method overloading at compile time. Abstraction hides complex implementation details and exposes only essential behavior through abstract classes and interfaces.',
      'easy',
    ),
    q(
      'What is the difference between an abstract class and an interface?',
      'An abstract class can have both abstract and concrete methods, instance variables, and constructors; a class extends only one abstract class. An interface traditionally declared method signatures only; from Java 8 onward it can also have default and static methods. A class can implement multiple interfaces. Use abstract classes when you share code among closely related classes. Use interfaces when you define a contract that unrelated classes can implement, such as Runnable or Comparable.',
      'easy',
    ),
    q(
      'What is a constructor in Java and can it be overloaded?',
      'A constructor is a special method invoked automatically when an object is created using the new keyword. It initializes object state and has the same name as the class with no return type. Constructors can be overloaded — multiple constructors with different parameter lists in the same class. If no constructor is defined, Java provides a default no-argument constructor. Once you define any constructor, the default one is not generated automatically unless you explicitly add it.',
      'easy',
    ),
    q(
      'What is the difference between String, StringBuilder, and StringBuffer?',
      'String is immutable — every modification creates a new object in the string pool or heap. StringBuilder is mutable and not thread-safe, making it faster for repeated concatenation in single-threaded code. StringBuffer is also mutable but synchronized and thread-safe, with slightly more overhead. In placement coding rounds, prefer StringBuilder inside loops when building strings. Use String for constants and when immutability is required for security or hash-based collections.',
      'easy',
    ),
    q(
      'What does the final keyword mean in Java?',
      'The final keyword applies to variables, methods, and classes with different meanings. A final variable cannot be reassigned after initialization — for objects, the reference is fixed but internal state may still change unless the object is immutable. A final method cannot be overridden by subclasses. A final class cannot be extended — String and Integer are examples. final helps express intent, enables compiler optimizations, and is required for variables accessed from anonymous inner classes before Java 8.',
      'easy',
    ),
    q(
      'What is the static keyword used for in Java?',
      'static members belong to the class itself rather than any particular instance. Static variables are shared across all objects of the class. Static methods can be called without creating an object and cannot access non-static instance members directly. Static blocks run once when the class is loaded. Common examples include main(), utility methods like Math.max(), and singleton patterns. Overusing static makes unit testing harder because static state persists across tests.',
      'easy',
    ),
    q(
      'What is exception handling in Java and name its core keywords.',
      'Exception handling manages runtime errors so programs can recover gracefully instead of crashing. Java uses try to wrap risky code, catch to handle specific exceptions, finally for cleanup that always runs, and throw to explicitly raise an exception. Checked exceptions like IOException must be declared or handled; unchecked exceptions like NullPointerException extend RuntimeException. Custom exceptions extend Exception or RuntimeException depending on whether callers must handle them. Always catch specific exceptions rather than generic Exception in production code.',
      'easy',
    ),
    q(
      'What is the difference between ArrayList and LinkedList?',
      'ArrayList is backed by a dynamic array, giving O(1) random access by index and amortized O(1) append at the end, but O(n) insertion or deletion in the middle. LinkedList uses doubly linked nodes, giving O(1) insertion or deletion at known positions but O(n) access by index. ArrayList is usually preferred for most campus and industry use cases due to better cache locality and lower memory overhead. LinkedList helps when frequent insertions or deletions happen at both ends via Deque operations.',
      'easy',
    ),
    q(
      'How does HashMap work internally in Java?',
      'HashMap stores key-value pairs in an array of buckets. When you put a key, Java computes hashCode(), applies additional spreading, and maps to a bucket index. Collisions are handled using linked lists; from Java 8, when a bucket exceeds eight nodes it may convert to a balanced tree for O(log n) worst-case lookup. Load factor defaults to 0.75 — when size exceeds capacity times load factor, the table rehashes and doubles. Keys must implement consistent equals() and hashCode(). HashMap allows one null key and multiple null values; it is not thread-safe. For concurrent access, use ConcurrentHashMap..',
      'medium',
    ),
    q(
      'Explain Java memory areas: heap, stack, and method area.',
      'The stack stores method frames, local variables, and partial results for each thread — it is thread-private and fast but limited in size. The heap is shared among threads and holds all object instances and arrays; it is managed by garbage collection and divided into young (Eden, Survivor) and old generations in most collectors. The method area (metaspace since Java 8) stores class metadata, constant pool, and static variables. StackOverflowError occurs when recursion is too deep; OutOfMemoryError occurs when the heap cannot allocate new objects. Understanding this helps debug memory leaks in campus project discussions..',
      'medium',
    ),
    q(
      'What is multithreading in Java and how do you create a thread?',
      'Multithreading allows concurrent execution of multiple threads within one process, improving responsiveness and CPU utilization on multi-core machines. You can create threads by extending the Thread class and overriding run(), or preferably by implementing Runnable and passing it to new Thread(runnable). The ExecutorService framework manages thread pools and is preferred in production. Calling start() begins execution; never call run() directly because that runs on the current thread. Shared mutable state requires synchronization — otherwise race conditions corrupt data. Campus interviews often ask about thread lifecycle states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED..',
      'medium',
    ),
    q(
      'What is the synchronized keyword and when should you use it?',
      'synchronized ensures only one thread executes a block or method at a time on the same monitor lock. You can synchronize an instance method (lock on this), a static method (lock on Class object), or a specific block using synchronized(obj). It provides mutual exclusion and visibility guarantees through the Java Memory Model. Use it when multiple threads mutate shared data structures. Drawbacks include potential deadlocks, reduced scalability, and no timeout support. For finer control, consider ReentrantLock, ReadWriteLock, or concurrent collections from java.util.concurrent that reduce lock contention in high-throughput services..',
      'medium',
    ),
    q(
      'Explain key Java 8 features asked in campus placements.',
      'Java 8 introduced lambda expressions for concise functional-style code, enabling cleaner collection processing. The Stream API supports map, filter, reduce, and parallel operations on collections declaratively. Optional reduces null pointer bugs by forcing explicit handling of absent values. Default and static methods in interfaces allow evolving APIs without breaking implementers. New date/time API in java.time replaces legacy Date and Calendar with immutable, thread-safe types. Method references and functional interfaces like Predicate and Function are heavily tested in service-company and product-company Java interviews across TCS, Infosys, and Amazon SDE tracks..',
      'medium',
    ),
    q(
      'What is garbage collection in Java and name common collectors.',
      'Garbage collection automatically reclaims memory from objects no longer reachable from GC roots such as stack references and static fields. Generational hypothesis assumes most objects die young, so Minor GC cleans the young generation frequently while Major GC compacts the old generation less often. Common collectors include Serial GC for small apps, Parallel GC for throughput, G1 GC for balanced latency on large heaps, and ZGC or Shenandoah for very low pause times on modern JDK versions. You cannot force deterministic destruction like C++; calling System.gc() is only a hint. Memory leaks still happen when collections hold references to unused objects.',
      'medium',
    ),
    q(
      'Explain the Java Collections Framework hierarchy.',
      'The framework root is Collection interface with List, Set, and Queue subinterfaces. List implementations include ArrayList for random access and LinkedList for frequent insertions. Set implementations include HashSet for unordered unique elements, LinkedHashSet for insertion order, and TreeSet for sorted order using Red-Black tree. Map is a separate hierarchy with HashMap, LinkedHashMap, and TreeMap. Queue includes PriorityQueue and Deque implementations like ArrayDeque. Choosing the right collection affects time complexity and thread safety — Collections.synchronizedList wraps lists but concurrent alternatives like CopyOnWriteArrayList suit read-heavy scenarios in interview system design follow-ups..',
      'medium',
    ),
    q(
      'What are Java Streams and how are they different from collections?',
      'Streams provide a pipeline API for processing sequences of elements functionally without storing them. Operations are intermediate (lazy) like filter and map, or terminal (eager) like collect, forEach, and reduce. Streams can be sequential or parallel; parallel streams use the common ForkJoinPool. Unlike collections, streams are consumed once and do not modify the source. They excel at declarative data transformations in placement coding questions — for example, grouping students by branch and averaging CGPA. Avoid parallel streams for small datasets or IO-bound tasks because overhead exceeds benefit..',
      'medium',
    ),
    q(
      'What is Spring Boot and why is it popular in campus hiring?',
      'Spring Boot is an opinionated framework built on Spring that simplifies building production-ready Java applications with minimal configuration. It provides auto-configuration, embedded servers like Tomcat, starter dependencies, and actuator endpoints for monitoring. Developers avoid lengthy XML and focus on business logic — ideal for final-year projects and REST APIs discussed in Infosys, Wipro, and product company backend rounds. Key annotations include @SpringBootApplication, @RestController, @Autowired, and @Service. Spring Boot integrates easily with JPA, security, and Kafka, making it the default choice for microservices in Indian IT hiring pipelines..',
      'medium',
    ),
    q(
      'Explain ConcurrentHashMap and why it is preferred over synchronized HashMap.',
      'ConcurrentHashMap divides the table into segments or buckets with fine-grained locking or CAS operations, allowing concurrent reads and many concurrent writes without locking the entire map. Unlike Collections.synchronizedMap, it does not wrap every method with one global lock, giving much better throughput in multi-threaded servers. Java 8 improved it with tree bins for long collision chains. It does not allow null keys or values to avoid ambiguity in concurrent contexts. size() and isEmpty() are approximate under contention. In placement system design answers, mention ConcurrentHashMap for shared caches, rate limiters, and session stores where Hashtable or synchronized HashMap would become bottlenecks.',
      'medium',
    ),
    q(
      'Explain the Java Memory Model and happens-before relationship.',
      'The Java Memory Model defines how threads interact through memory and what reorderings compilers and CPUs may perform. Without proper synchronization, one thread may not see writes from another due to caching and instruction reordering. The happens-before rule establishes visibility guarantees: unlocking a monitor happens-before a subsequent lock on the same monitor; writing to a volatile field happens-before any subsequent read; and Thread.start happens-before any action in the started thread. Understanding JMM is essential for explaining why double-checked locking failed before volatile fixes and why concurrent collections publish safe snapshots. Senior campus rounds at Amazon and Flipkart often probe this after basic synchronized questions.',
      'hard',
    ),
    q(
      'Describe common design patterns used in Java enterprise applications.',
      'Singleton ensures one instance — use enum or double-checked locking with volatile in Java. Factory Method and Abstract Factory encapsulate object creation for loosely coupled modules. Strategy defines interchangeable algorithms at runtime, common in payment or discount engines. Observer decouples publishers and subscribers — event buses in Spring use similar ideas. Decorator adds behavior dynamically, seen in Java IO streams. Template Method defines algorithm skeleton in a base class. MVC separates model, view, and controller in web apps. In interviews, connect patterns to real projects: Singleton for config loaders, Builder for complex DTO construction with Lombok @Builder, and Repository pattern in Spring Data JPA for database access abstraction.',
      'hard',
    ),
    q(
      'How does CompletableFuture help with asynchronous programming in Java?',
      'CompletableFuture implements CompletionStage and represents a future result that can be composed asynchronously without blocking threads. You chain thenApply, thenCompose, and handle for transformations and error recovery. supplyAsync and runAsync execute tasks on ForkJoinPool or custom executors. Combining allOf or anyOf coordinates multiple async calls — useful for aggregating responses from microservices in placement system design scenarios. Unlike raw Future, CompletableFuture supports non-blocking callbacks and exception propagation. Best practices include specifying custom thread pools for IO workloads instead of the common pool, handling exceptions in handle(), and avoiding get() without timeout on reactive-style code paths in campus project demos..',
      'hard',
    ),
    q(
      'Explain SOLID principles with Java examples.',
      'Single Responsibility: a UserService should authenticate users, not send emails — split EmailService. Open/Closed: extend behavior via new classes implementing PaymentStrategy rather than modifying checkout logic. Liskov Substitution: subclasses like Square must honor Rectangle contracts if used interchangeably — violation breaks polymorphism. Interface Segregation: prefer small interfaces like Readable and Writable over one fat FileOperations interface forcing empty implementations. Dependency Inversion: high-level OrderController depends on OrderRepository interface, not concrete JDBC class — Spring dependency injection implements this. Campus architects at product companies expect you to map SOLID to your final-year project modules and explain refactoring one violating class..',
      'hard',
    ),
    q(
      'How would you implement a custom thread pool in Java?',
      'Use ThreadPoolExecutor with corePoolSize, maximumPoolSize, keepAliveTime, and a BlockingQueue work queue such as LinkedBlockingQueue or ArrayBlockingQueue. RejectedExecutionHandler defines policy when the queue is full — CallerRunsPolicy, AbortPolicy, or custom handlers. Monitor pool metrics via getActiveCount and getQueue size. For campus interviews, explain why unbounded queues risk OutOfMemoryError and why Executors.newCachedThreadPool is dangerous in production. Separate pools for CPU-bound and IO-bound tasks — IO pools need larger sizes because threads block waiting on network or disk. Graceful shutdown uses shutdown() and awaitTermination with timeout before shutdownNow()..',
      'hard',
    ),
    q(
      'What is the difference between volatile and synchronized in Java?',
      'volatile guarantees visibility of writes to all threads immediately and prevents certain reorderings, but it does not provide atomicity for compound operations like count++. synchronized provides both mutual exclusion and visibility by acquiring a monitor lock. Use volatile for simple flags such as shutdown indicators where only one thread writes and others read. Use synchronized or atomic classes like AtomicInteger for read-modify-write sequences. Double-checked locking for lazy initialization requires volatile on the instance reference to prevent partially constructed objects from being seen. Interviewers at Oracle and SAP labs often follow up asking why volatile alone cannot implement a counter safely without AtomicInteger.',
      'hard',
    ),
    q(
      'Explain Java ClassLoader hierarchy and how classes are loaded.',
      'Class loading follows delegation: Bootstrap ClassLoader loads core JDK classes from rt/modules, Extension/Platform loader loads extension modules, and Application ClassLoader loads classpath application code. Custom ClassLoaders extend ClassLoader for plugin architectures and hot reloading in application servers. Loading happens in loading, linking (verify, prepare, resolve), and initialization phases. static blocks run during initialization. ClassNotFoundException means the loader cannot find bytecode; NoClassDefFoundError means bytecode existed at compile time but is missing at runtime. In campus advanced rounds, mention how Spring Boot fat jars use LaunchedURLClassLoader and how OSGi uses modular class loading for isolation..',
      'hard',
    ),
    q(
      'How does Java serialization work and what are its pitfalls?',
      'Serialization converts object state to a byte stream via ObjectOutputStream when the class implements Serializable. Deserialization reconstructs objects with ObjectInputStream. serialVersionUID maintains version compatibility across releases. Pitfalls include breaking singletons because deserialization creates new instances, security vulnerabilities from untrusted streams leading to gadget chains, and performance overhead versus JSON or Protocol Buffers. transient fields are skipped; custom writeObject and readObject control the process. Modern microservices prefer JSON with Jackson or gRPC. In campus interviews, mention why Serializable is discouraged for long-term APIs and how Externalizable gives explicit control over serialized form..',
      'hard',
    ),
    q(
      'How would you design a REST microservice using Spring Boot for campus placement tracker?',
      'Split into services: StudentService, CompanyService, ApplicationService, and NotificationService communicating via REST or messaging. Each service owns its database following database-per-service pattern — PostgreSQL for transactional data, Redis for session cache. Use Spring Boot with @RestController, validation via @Valid, global exception handling with @ControllerAdvice, and Spring Security JWT for authentication. Implement idempotent POST using client tokens, pagination for job listings, and circuit breakers with Resilience4j when calling external APIs. Deploy as Docker containers on Kubernetes with health checks via Actuator /actuator/health. Discuss trade-offs: synchronous REST simplicity versus eventual consistency with Kafka events for application status updates — a strong answer for final-year project viva and Flipkart or Razorpay system design rounds.',
      'hard',
    ),
    q(
      'What is the difference between fail-fast and fail-safe iterators in Java?',
      'Fail-fast iterators like those in ArrayList and HashMap throw ConcurrentModificationException if the collection is structurally modified during iteration outside the iterator own remove method. They maintain a modCount field and detect concurrent changes immediately, preventing silent corruption. Fail-safe iterators like CopyOnWriteArrayList iterator operate on a snapshot taken at creation time, so they never throw CME but may not reflect recent updates. ConcurrentHashMap iterator is weakly consistent — it reflects some but not necessarily all concurrent changes. In campus interviews, explain why you cannot remove elements from ArrayList while foreach looping without Iterator.remove(), and why CopyOnWriteArrayList suits read-heavy listener lists in event-driven Spring applications despite higher memory cost on writes.',
      'hard',
    ),
  ],
};
