import type { InterviewTopicBank } from './types';

function q(question: string, answer: string, difficulty: 'easy' | 'medium' | 'hard') {
  return { question, answer, difficulty };
}

export const DSA_BANK: InterviewTopicBank = {
  topic: 'DSA',
  topicSlug: 'dsa',
  questions: [
    q(
      'What is time complexity and why does it matter?',
      'Time complexity describes how runtime grows with input size n using Big-O notation ignoring constants. O(1) constant, O(log n) logarithmic binary search, O(n) linear scan, O(n log n) efficient sorting, O(n²) nested loops problematic for large n. It matters because campus platforms process lakhs of student records — O(n²) algorithm fails at scale while O(n log n) succeeds. Interviewers evaluate whether you choose appropriate approach before coding. Always analyze brute force then optimize. Indian product company coding rounds typically require optimal or near-optimal complexity explanation not just working code for acceptance.',
      'easy',
    ),
    q(
      'What is the difference between array and linked list?',
      'Array stores elements contiguously enabling O(1) index access but O(n) insertion deletion in middle due to shifting. Linked list nodes scattered in memory with pointers — O(n) access by index, O(1) insertion deletion at known position. Array better cache locality and memory overhead lower; linked list better frequent insertions at ends with deque operations. Dynamic arrays ArrayList vector amortize append O(1). Campus coding chooses array for two-pointer sliding window techniques; linked list for LRU cache implementation with HashMap pointer manipulation.',
      'easy',
    ),
    q(
      'Explain stack and queue data structures with use cases.',
      'Stack LIFO — last in first out. Operations push pop peek O(1). Use cases: undo functionality, parenthesis matching, DFS iterative, expression evaluation. Queue FIFO — first in first out. Enqueue dequeue O(1) with proper implementation. Use cases: BFS graph traversal, task scheduling, buffer requests. deque in Python double-ended queue. Campus interviews implement stack using array or linked list; detect valid parentheses classic easy question. Print queue spooler real-world queue example relatable in HR technical hybrid rounds at service companies testing basic CS fundamentals.',
      'easy',
    ),
    q(
      'What is binary search and when can you apply it?',
      'Binary search finds target in sorted array by repeatedly halving search range comparing mid element — O(log n) time O(1) space iterative. Apply when sorted array or monotonic predicate function — find first bad version, minimum capacity ship packages. Common bug: mid overflow use low + (high-low)/2, infinite loop off-by-one in bounds. Campus must-know algorithm appearing dozens LeetCode easy medium problems. Variants: lower bound upper bound bisect in Python. Recognize sorted property or transform problem sorted space enabling binary search optimization from O(n) linear scan.',
      'easy',
    ),
    q(
      'What is a hash map and what problems does it solve?',
      'Hash map stores key-value pairs with O(1) average insert lookup delete using hash function mapping keys to buckets handling collisions chaining or open addressing. Solves frequency counting, two sum complement lookup, deduplication, caching. Java HashMap Python dict C++ unordered_map. Campus two sum most famous hash map problem. Watch collision degradation O(n) worst case and memory overhead. Cannot use mutable objects as keys in Python. Hash maps trade space for time — common optimization pattern converting O(n²) nested loop to O(n) single pass Indian coding interview expectations.',
      'easy',
    ),
    q(
      'Explain recursion and base case importance.',
      'Recursion function calls itself on smaller subproblem until base case stops recursion. Essential components: base case preventing infinite recursion, recursive case progressing toward base case, trust recursive call solves subproblem. Examples: factorial, Fibonacci memoized, tree traversals. Stack depth limit causes stack overflow large inputs — convert to iterative or tail recursion optimization limited Java. Campus tree graph DFS naturally recursive. Always define base case first when writing recursive solution interview whiteboard. Fibonacci naive recursion O(2^n) demonstrates need memoization dynamic programming introduction.',
      'easy',
    ),
    q(
      'What is Big-O notation for common sorting algorithms?',
      'Bubble selection insertion sort O(n²) average worst suitable small n nearly sorted. Merge sort O(n log n) stable divides conquers O(n) space. Quick sort O(n log n) average O(n²) worst pivot choice in-place partition. Heap sort O(n log n) in-place unstable. Tim sort hybrid used Python Java O(n log n) best adaptive. Campus know trade-offs: merge stable predictable; quick cache friendly average fast; counting sort O(n+k) special integer range. Interview ask implement merge sort or quick sort explain partition merge steps write recurrence relation.',
      'easy',
    ),
    q(
      'What is a binary tree and types of traversals?',
      'Binary tree each node at most two children left right. Traversals: inorder left root right gives BST sorted order; preorder root left right copy tree; postorder left right root delete tree; level order BFS queue layer by layer. Recursive and iterative implementations both expected campus knowledge. Complete full perfect balanced tree definitions. Binary tree height O(n) skewed O(log n) balanced. Campus tree problems: max depth, invert tree, symmetric tree easy warmups before medium hard tree DP problems frequently asked Amazon Microsoft campus loops India.',
      'easy',
    ),
    q(
      'What is dynamic programming and when do you use it?',
      'Dynamic programming solves problems with overlapping subproblems and optimal substructure by storing subproblem results avoiding recomputation. Approaches: top-down memoization recursion plus cache; bottom-up tabulation iterative fill table. Examples: Fibonacci climbing stairs coin change longest common subsequence knapsack. Identify DP by counting recursive calls repeated states. Campus DP hardest category for many students — start classic problems build pattern recognition. Space optimization reduce 2D DP 1D array when only previous row needed. Indian FAANG campus interviews frequently one medium-hard DP per onsite loop.',
      'easy',
    ),
    q(
      'What is a graph and how do you represent it?',
      'Graph vertices nodes connected edges. Directed versus undirected weighted versus unweighted. Representations: adjacency list vector of lists space O(V+E) preferred sparse graphs; adjacency matrix O(V²) dense quick edge lookup. Campus graph BFS DFS shortest path foundation. Social network friends cities routes placement job application workflow states modeled graphs. Implement add edge traverse neighbors. Count connected components detect cycle topological sort course schedule prerequisite classic medium problems campus interviews. Choose representation based edge density query type memory constraints problem constraints up to 10^5 nodes adjacency list mandatory.',
      'easy',
    ),
    q(
      'Explain two-pointer technique with example problem.',
      'Two pointers use two indices moving through array structure solving O(n) versus O(n²) brute force. Types: opposite ends sorted array two sum pair; same direction slow fast cycle detection linked list; sliding window substring problems. Example: container with most water left right pointers move shorter line inward tracking max area. Sorted array remove duplicates in-place slow fast. Campus pattern recognition key — seeing sorted array or pair sum triggers two pointer. Practice valid palindrome 3sum sorted merge sorted arrays. Explain invariant why pointers move direction correctness proof interviewers appreciate..',
      'medium',
    ),
    q(
      'Explain sliding window technique.',
      'Sliding window maintains window subarray substring satisfying condition expanding right pointer shrinking left when invalid tracking best answer. Fixed size window: max sum subarray size k. Variable window: longest substring without repeating characters HashMap char last index. Template: expand add right to window update state while invalid shrink left remove update result. O(n) each element enters exits once. Campus medium frequency problem type longest repeating character replacement minimum window substring. Distinguish sliding window from two pointer — window often tracks aggregate state frequency sum count while two pointer pair sum less state..',
      'medium',
    ),
    q(
      'How does BFS differ from DFS and when to use each?',
      'BFS explores level by level using queue — shortest path unweighted graph minimum steps. DFS explores depth first using stack recursion — detect cycle topological sort path existence connected components maze. BFS O(V+E) same complexity different behavior. Multi-source BFS start multiple nodes simultaneously rotten oranges. DFS simpler implement recursive; BFS iterative queue. Campus tree level order BFS; tree max depth either. Graph with many nodes deep narrow DFS memory better; shortest path BFS mandatory. Bidirectional BFS search from both ends optimize shortest path interview advanced optimization discussion..',
      'medium',
    ),
    q(
      'Explain Dijkstra shortest path algorithm.',
      'Dijkstra finds shortest paths from source to all nodes non-negative edge weights using priority queue greedy relaxation. Maintain distance array initialize infinity source zero. Pop minimum distance unvisited node relax neighbors update distances if shorter path found. O((V+E) log V) with binary heap. Cannot handle negative weights — Bellman-Ford handles negatives detects negative cycles. Campus application: network routing map navigation minimum cost path weighted graph. Implement with adjacency list priority queue. Common mistake not marking visited processed nodes outdated heap entries skip if distance greater current record. Compare BFS unweighted special case Dijkstra weights one..',
      'medium',
    ),
    q(
      'What is a heap and how is it used in algorithms?',
      'Heap complete binary tree satisfying heap property min-heap parent smaller children max-heap opposite. Implemented array index formulas parent i/2 left 2i right 2i+1. Operations insert delete-min O(log n) peek-min O(1) build-heap O(n). Priority queue scheduling find k largest elements merge k sorted lists Dijkstra. Python heapq min heap push pop heappushpop nlargest. Campus classic: kth largest element in array stream median two heaps pattern. Top k frequent elements HashMap count heap size k. Understand sift up sift down mechanics interview may ask implement heapify..',
      'medium',
    ),
    q(
      'Explain union-find disjoint set union for connectivity problems.',
      'Union-find tracks disjoint sets supports find root representative and union merge sets efficiently with path compression and union by rank achieving nearly O(1) amortized inverse Ackermann. Applications: detect cycle undirected graph adding edges, count connected components, Kruskal MST algorithm, dynamic connectivity. Implement parent array rank array find with path compression recursive or iterative. Campus number of provinces redundant connection accounts merge classic problems. Compare BFS DFS connectivity union-find better dynamic online edge additions offline BFS sufficient. Interview explain why path compression rank optimization needed without them degenerate chain O(n) per operation..',
      'medium',
    ),
    q(
      'What is topological sort and where is it applied?',
      'Topological sort linear ordering DAG directed acyclic graph vertices before all outgoing edges — course prerequisites task scheduling build order dependencies. Algorithms: Kahn BFS in-degree zero queue peel nodes; DFS postorder reverse finish times. Detect cycle if not all nodes processed in-degree remains positive. Campus course schedule I II problems staple. Application compilation order spreadsheet cell dependencies job pipeline campus placement prerequisite skills graph humorous meta. O(V+E) complexity. Interview implement Kahn explain in-degree counting adjacency list. Cycle detection impossible topological sort cycle exists explain verification step..',
      'medium',
    ),
    q(
      'Explain backtracking with N-Queens or subset generation.',
      'Backtracking builds solution incrementally abandons partial candidate fails constraint pruning search space. Template: choose explore unchoose undo recurse. N-Queens place queens row by row check column diagonal conflicts prune invalid branches. Subsets powerset include exclude each element generate 2^n subsets. Permutations swap choose. Sudoku fill empty cells try digits backtrack invalid. Campus medium backtracking problems combination sum word search board palindrome partitioning. Worst exponential but pruning makes feasible. Contrast DP optimal substructure no pruning exhaustive enumeration backtracking. Draw recursion tree interview explain branching factor pruning condition..',
      'medium',
    ),
    q(
      'What is trie prefix tree and its applications?',
      'Trie tree nodes represent characters edges form strings root empty string. Insert search startsWith O(m) word length m. Applications autocomplete search suggestions spell checker IP routing longest common prefix. Space heavy many nodes versus HashMap. Campus problem implement trie addWord searchWords prefix matching phone directory contact search. XOR trie bit manipulation maximum XOR pair advanced variant. Compare HashMap exact match trie prefix operations efficient multiple strings shared prefixes dictionary words campus word search II grid plus trie prune. Visualize trie structure whiteboard interview storing CAT CAR CART shared CA prefix..',
      'medium',
    ),
    q(
      'Explain space complexity and common trade-offs with time.',
      'Space complexity measures auxiliary memory growth with input size. O(1) constant extra space in-place algorithms; O(n) array hash map storage; O(n²) DP table. Time-space trade-off: hash map O(n) space O(n) time two sum versus sort O(1) extra if in-place O(n log n) time. Memoization DP time optimization increases space. Campus interview ask optimize space DP rolling array reduce O(n*k) O(k). In-place quicksort merge sort O(n) space trade. Indian interviews increasingly ask space after optimal time achieved — not stopping O(n) time alone. Analyze total memory constraints n up to 10^5 256MB limit typical CodeChef Codeforces..',
      'medium',
    ),
    q(
      'Design algorithm to find median from data stream.',
      'Use two heaps: max-heap lower half values max at top; min-heap upper half min at top. Balance sizes differing at most one element. Median odd size top max-heap lower half even average both tops. Insert O(log n) median O(1). Handles infinite stream cannot sort memory. Campus hard heap problem tests data structure design not just template algorithm. Variants sliding window median harder deque plus heaps lazy deletion. Explain invariant lower half less equal upper half size balance rebalancing push pop steps. Amazon streaming analytics system design connection real-time percentile computation interview follow-up..',
      'hard',
    ),
    q(
      'Explain segment tree and when to use over prefix sum.',
      'Segment tree binary tree storing interval aggregates supports range query range update O(log n) each build O(n). Use when array mutable range sum min max queries prefix sum static O(1) query fails updates O(n) recompute. Lazy propagation deferred updates range add range set efficiency. Applications range sum query mutable competitive programming database aggregation. Campus advanced beyond basic placement but Flipkart Amazon hard problems range queries. Compare Fenwick tree Binary Indexed Tree simpler range sum point update less general segment tree. Implement build query update recursive merge left right child intervals interview senior loop..',
      'hard',
    ),
    q(
      'How do you solve longest increasing subsequence efficiently?',
      'LIS length O(n log n) patience sorting binary search tails array tails[i] smallest tail length i+1 subsequence. For each element binary search replace position in tails extend if larger than all. O(n²) DP dp[i] longest ending i acceptable n 1000 constraints. Reconstruct sequence parent pointers or backtrack. Variant longest increasing path matrix DFS plus memo DP each cell. Campus classic DP problem asked explain O(n log n) optimization not just DP. Related number of longest increasing subsequence counting DP. Patience sorting card game analogy memorable interview explanation increasing subsequence piles top cards increasing..',
      'hard',
    ),
    q(
      'Explain dynamic programming on trees with example.',
      'Tree DP computes optimal value each subtree combining child results root cannot have cycle. Example: house robber III rob node or skip propagate max from children not both if robbing node. Diameter binary tree max path sum any node. Complexity O(n) visit each node once. Template DFS postorder return values parent uses combine. Re-rooting technique compute answer all nodes two passes. Campus hard tree DP less frequent arrays strings but Google India occasional. Draw small tree annotate subproblem states transition equation. Contrast graph DP cycles require careful state definition tree simpler parent-child directionality acyclic..',
      'hard',
    ),
    q(
      'Solve word break problem and explain DP approach.',
      'Given string s dictionary words determine s segmented dictionary words true false. DP dp[i] true if s[0:i] breakable dp[0] true. For each i check j<i dp[j] true and s[j:i] in dictionary set dp[i] true. O(n² * m) n string length m avg word check hash set O(1). Space O(n). Follow-up return all sentences backtracking plus memo. Campus medium DP string partition category. Optimization trie prune dictionary reduce comparisons. Explain overlapping subproblem breaking s[i:n] repeatedly naive recursion exponential DP tabulation fixes. Variant word break II print all combinations backtracking dp[i] stores reachable previous indices reconstruct paths..',
      'hard',
    ),
    q(
      'Explain graph shortest path with Bellman-Ford and negative cycles.',
      'Bellman-Ford relaxes all edges V-1 iterations updating distances if shorter path found handles negative weights O(VE). Vth iteration any relaxation possible negative cycle reachable from source. Applications currency arbitrage detect negative cycle profit loop routing protocols. Contrast Dijkstra non-negative faster. Floyd-Warshall all pairs O(V³) dense small V. Campus rare negative edge problems but Goldman Sachs quantitative roles may ask. Implement relaxation loop early exit if no update optimization. Explain why Dijkstra fails negative edges greedy assumption violated path through negative edge shorter discovered later..',
      'hard',
    ),
    q(
      'How would you approach solving hard LeetCode problem in interview?',
      'Structured approach: clarify constraints edge cases empty input duplicates; examples walk through; brute force state complexity; optimize identify bottleneck data structure pattern; code clean variable names; test dry run example edge case; analyze final complexity. Communicate thought process continuously interviewer hints valuable. If stuck enumerate patterns binary search DP graph two pointer. Partial credit working brute force better silence. Time management 45 minutes two problems prioritize working solution optimize if time. Campus Indian interview culture sometimes silent coding communicate anyway practice aloud mock interviews peers placement cell workshops. Record mistakes off-by-one null checks post interview review..',
      'hard',
    ),
    q(
      'Explain maximum flow minimum cut problem and Ford-Fulkerson.',
      'Flow network directed graph source sink edge capacities flow conservation max flow source to sink. Ford-Fulkerson augmenting paths BFS Edmonds-Karp O(VE²) find path residual graph augment flow until no path. Max-flow min-cut theorem maximum flow equals minimum cut capacity separating source sink. Applications bipartite matching network reliability project selection. Campus advanced competitive programming placement premium companies. Implement BFS residual capacities parent pointers augment bottleneck flow. Compare Dinic O(V²E) faster large graphs. Interview unlikely full implementation but recognizing matching problem reduce flow valuable senior campus hire demonstrating algorithm breadth beyond mainstream array tree DP..',
      'hard',
    ),
    q(
      'Design LRU cache with O(1) get and put operations.',
      'Combine HashMap key to node pointer and doubly linked list order recent at head evict tail when capacity exceeded. get key move node head return value. put key update move head or insert new evict tail if over capacity. O(1) both operations. Campus classic design plus data structure asked LinkedHashMap Java ordered dict Python move_to_end. Implement from scratch interview tests pointer manipulation careful edge cases capacity one update existing key. Follow-up LFU cache complex frequency buckets. Real-world CPU cache page replacement database buffer pool connection. Draw diagram HashMap nodes DLL interview explain why doubly linked O(1) removal singly linked cannot remove arbitrary node O(1) without predecessor pointer.',
      'hard',
    ),
    q(
      'Explain monotonic stack and its applications.',
      'Monotonic stack maintains elements in increasing or decreasing order popping smaller/larger elements when breaking monotonicity before pushing current. Processes each element once amortized O(n). Applications: next greater element, largest rectangle in histogram, daily temperatures, stock span problems. Template: iterate push index or value pop while violates monotonic property update answer for popped indices. Campus medium-hard pattern less obvious than binary search but frequent in Amazon interview sets. Contrast with brute force O(n²) inner loops finding next greater. Visualize stack state step-by-step in interview whiteboard—demonstrates algorithmic maturity beyond memorizing two sum and binary search templates common in basic campus DSA preparation.',
      'hard',
    ),
  ],
};
