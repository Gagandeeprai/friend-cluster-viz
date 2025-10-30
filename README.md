# Algo_vibe
🌐 Group Chat Clusters: Connected Components Visualizer
An interactive web application that visualizes friend groups in social networks by identifying connected components in an undirected graph using depth-first search (DFS) and breadth-first search (BFS) algorithms.​

🎯 Problem Overview
The Challenge:
Students communicate through direct messages, forming an undirected graph where each edge represents a bidirectional conversation between two people. Some students belong to large interconnected friend groups, while others exist in small clusters or remain completely isolated. This project identifies and visualizes how many separate friend groups exist by finding all connected components in the communication network.​

📊 What Are Connected Components?
 connected component is a maximal group of nodes where every student is reachable from every other student in the same group through direct or indirect message chains. Each component represents one distinct friend group with no connections to other groups.​

💡 Technical Approach
The application implements graph traversal algorithms to identify connected components:

Depth-First Search (DFS): Recursively explores each unvisited node and all its neighbors, marking them as part of the same component

Breadth-First Search (BFS): Level-by-level exploration using a queue to group connected students

Union-Find (Disjoint Set): Efficiently merges components as edges are processed​

Each algorithm runs in O(n + m) time complexity, where n is the number of students and m is the number of direct message connections.​

🎨 Visualization Features
The interactive visualization displays:

Nodes: Each student represented as a colored circle

Edges: Direct message connections between students

Color Coding: Each connected component (friend group) is assigned a unique color to clearly distinguish separate groups​

Statistics: Real-time metrics including total components, largest group size, and isolated students

Interactive Exploration: Click nodes to view details, find shortest paths between students, and analyze component density

📝 Input/Output Specification
Input Format:

text
First line: n (students), m (DM connections)
Next m lines: u v (bidirectional direct message between students u and v)
Output Format:

text
Number of separate friend groups (connected components)
Visual graph with color-coded components
Constraints:

1 ≤ n ≤ 100,000

0 ≤ m ≤ 200,000

Students are numbered 1 to n
🛠️ Tech Stack
Backend:

Node.js + Express 

Graph algorithms: DFS

Frontend:

HTML5 + CSS3 + JavaScript

D3.js for graph visualization

Responsive design for all devices
🎓 Algorithm Complexity
Time Complexity: O(n + m) for DFS/BFS traversal

Space Complexity: O(n) for visited array and recursion stack

Optimal for: Sparse graphs with n ≤ 100,000 and m ≤ 200,000​

🌟 Key Features
Real-time graph analysis with instant component identification

Multiple algorithm implementations (DFS, BFS, Union-Find)

Interactive force-directed graph layout

Shortest path finding between any two students

Component density and centrality metrics

Export graph data as JSON or PNG

Responsive design for mobile and desktop

📚 Applications
This visualization technique applies to:

Social network analysis and community detection

Network topology analysis and fault isolation

Recommendation systems (friend suggestions)

Anomaly detection in communication patterns

Infrastructure connectivity assessment​

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request
Author
Gagandeep Rai
Undergraduate Student - Information Science Engineering
RV College of Engineering
