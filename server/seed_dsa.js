const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');
require('dotenv').config();

const topicsData = [
    { name: 'Arrays', description: 'Master array manipulation, searching, and sorting techniques', order_index: 1 },
    { name: 'Strings', description: 'String operations, pattern matching, and manipulation', order_index: 2 },
    { name: 'Linked Lists', description: 'Singly, doubly, and circular linked list operations', order_index: 3 },
    { name: 'Stacks & Queues', description: 'LIFO and FIFO data structures and their applications', order_index: 4 },
    { name: 'Trees', description: 'Binary trees, BST, traversals, and tree algorithms', order_index: 5 },
    { name: 'Graphs', description: 'Graph representations, BFS, DFS, and shortest paths', order_index: 6 },
    { name: 'Dynamic Programming', description: 'Optimization problems using memoization and tabulation', order_index: 7 },
    { name: 'Recursion & Backtracking', description: 'Recursive problem solving and constraint-based searching', order_index: 8 }
];

const problemsData = [
    // Arrays
    { topicName: 'Arrays', name: 'Two Sum', difficulty: 'easy', youtube_link: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', leetcode_link: 'https://leetcode.com/problems/two-sum/', codeforces_link: 'https://codeforces.com/problemset/problem/1/A', article_link: 'https://leetcode.com/problems/two-sum/solution/', order_index: 1 },
    { topicName: 'Arrays', name: 'Best Time to Buy and Sell Stock', difficulty: 'easy', youtube_link: 'https://www.youtube.com/watch?v=1pkOgXD63yU', leetcode_link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', codeforces_link: 'https://codeforces.com/problemset/problem/1209/C', article_link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solution/', order_index: 2 },
    { topicName: 'Arrays', name: 'Maximum Subarray', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=5WZl3MMT0Eg', leetcode_link: 'https://leetcode.com/problems/maximum-subarray/', codeforces_link: 'https://codeforces.com/problemset/problem/327/A', article_link: 'https://en.wikipedia.org/wiki/Maximum_subarray_problem', order_index: 3 },
    // Strings
    { topicName: 'Strings', name: 'Valid Anagram', difficulty: 'easy', youtube_link: 'https://www.youtube.com/watch?v=9UtInBqnCgA', leetcode_link: 'https://leetcode.com/problems/valid-anagram/', codeforces_link: 'https://codeforces.com/problemset/problem/141/A', article_link: 'https://leetcode.com/problems/valid-anagram/solution/', order_index: 1 },
    { topicName: 'Strings', name: 'Longest Substring Without Repeating Characters', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=wiGpQwVHdE0', leetcode_link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', codeforces_link: 'https://codeforces.com/problemset/problem/116/A', article_link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/', order_index: 2 },
    // Linked Lists
    { topicName: 'Linked Lists', name: 'Reverse Linked List', difficulty: 'easy', youtube_link: 'https://www.youtube.com/watch?v=G0_I-ZF0S38', leetcode_link: 'https://leetcode.com/problems/reverse-linked-list/', codeforces_link: 'https://codeforces.com/problemset/problem/34/B', article_link: 'https://leetcode.com/problems/reverse-linked-list/solution/', order_index: 1 },
    { topicName: 'Linked Lists', name: 'Linked List Cycle', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=gBTe7lFR3vc', leetcode_link: 'https://leetcode.com/problems/linked-list-cycle/', codeforces_link: 'https://codeforces.com/problemset/problem/263/A', article_link: 'https://leetcode.com/problems/linked-list-cycle/solution/', order_index: 2 },
    // Stacks & Queues
    { topicName: 'Stacks & Queues', name: 'Valid Parentheses', difficulty: 'easy', youtube_link: 'https://www.youtube.com/watch?v=WTzjTskDFMg', leetcode_link: 'https://leetcode.com/problems/valid-parentheses/', codeforces_link: 'https://codeforces.com/problemset/problem/1097/A', article_link: 'https://leetcode.com/problems/valid-parentheses/solution/', order_index: 1 },
    { topicName: 'Stacks & Queues', name: 'Min Stack', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=qkLl7nAwDPo', leetcode_link: 'https://leetcode.com/problems/min-stack/', codeforces_link: 'https://codeforces.com/problemset/problem/1392/D', article_link: 'https://leetcode.com/problems/min-stack/solution/', order_index: 2 },
    // Trees
    { topicName: 'Trees', name: 'Invert Binary Tree', difficulty: 'easy', youtube_link: 'https://www.youtube.com/watch?v=OnSn2XEQ4MY', leetcode_link: 'https://leetcode.com/problems/invert-binary-tree/', codeforces_link: 'https://codeforces.com/problemset/problem/115/A', article_link: 'https://leetcode.com/problems/invert-binary-tree/solution/', order_index: 1 },
    { topicName: 'Trees', name: 'Binary Tree Level Order Traversal', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=6ZnyEApgFYg', leetcode_link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', codeforces_link: 'https://codeforces.com/problemset/problem/166/A', article_link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/solution/', order_index: 2 },
    // Graphs
    { topicName: 'Graphs', name: 'Number of Islands', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=pV2kpPD66nE', leetcode_link: 'https://leetcode.com/problems/number-of-islands/', codeforces_link: 'https://codeforces.com/problemset/problem/731/C', article_link: 'https://leetcode.com/problems/number-of-islands/solution/', order_index: 1 },
    { topicName: 'Graphs', name: 'Clone Graph', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=mQeF6bN8hMk', leetcode_link: 'https://leetcode.com/problems/clone-graph/', codeforces_link: 'https://codeforces.com/problemset/problem/124/B', article_link: 'https://leetcode.com/problems/clone-graph/solution/', order_index: 2 },
    // Dynamic Programming
    { topicName: 'Dynamic Programming', name: 'Climbing Stairs', difficulty: 'easy', youtube_link: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI', leetcode_link: 'https://leetcode.com/problems/climbing-stairs/', codeforces_link: 'https://codeforces.com/problemset/problem/1131/A', article_link: 'https://leetcode.com/problems/climbing-stairs/solution/', order_index: 1 },
    { topicName: 'Dynamic Programming', name: 'House Robber', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=73r3KWiEvyk', leetcode_link: 'https://leetcode.com/problems/house-robber/', codeforces_link: 'https://codeforces.com/problemset/problem/1352/C', article_link: 'https://leetcode.com/problems/house-robber/solution/', order_index: 2 },
    // Recursion & Backtracking
    { topicName: 'Recursion & Backtracking', name: 'Subsets', difficulty: 'medium', youtube_link: 'https://www.youtube.com/watch?v=REOH22Xwdkk', leetcode_link: 'https://leetcode.com/problems/subsets/', codeforces_link: 'https://codeforces.com/problemset/problem/550/A', article_link: 'https://leetcode.com/problems/subsets/solution/', order_index: 1 },
    { topicName: 'Recursion & Backtracking', name: 'N-Queens', difficulty: 'hard', youtube_link: 'https://www.youtube.com/watch?v=wGbuCyNpxIg', leetcode_link: 'https://leetcode.com/problems/n-queens/', codeforces_link: 'https://codeforces.com/problemset/problem/750/A', article_link: 'https://leetcode.com/problems/n-queens/solution/', order_index: 2 }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data (optional, but good for a fresh seed)
        await Topic.deleteMany({});
        await Problem.deleteMany({});
        console.log('Cleared existing topics and problems');

        // Insert Topics
        const insertedTopics = await Topic.insertMany(topicsData);
        console.log('Topics seeded');

        // Create a mapping of topic name to ID
        const topicMap = {};
        insertedTopics.forEach(topic => {
            topicMap[topic.name] = topic._id;
        });

        // Prepare Problems with topic IDs
        const problemsToInsert = problemsData.map(problem => ({
            ...problem,
            topic_id: topicMap[problem.topicName]
        }));

        // Insert Problems
        await Problem.insertMany(problemsToInsert);
        console.log('Problems seeded');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
