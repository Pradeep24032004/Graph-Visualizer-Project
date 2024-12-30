# Graph-Visualizer-Project
This project is a **Graph Visualization Tool** built using **React.js**. It allows users to create, visualize, and manipulate graph data, as well as simulate algorithms like **Dijkstra's Shortest Path**, **Bellman-Ford**, and **Minimum Spanning Tree (MST)**. The application provides an intuitive interface for interacting with graphs, making it ideal for educational purposes, algorithm demonstrations, or testing graph-related logic.

---

## Features and Functionalities

### 1. **Graph Visualization**
- **Nodes**: Represented as circles on a canvas. Each node has an ID and coordinates (x, y).
- **Edges**: Represented as lines connecting nodes. Each edge has a weight (numerical value).

### 2. **Graph Editing Options**
- **Add Node**:
  - Prompts the user to input a node ID and its coordinates (x, y).
  - Adds the node to the graph.
- **Add Edge**:
  - Prompts the user to input the `from` node, `to` node, and the edge weight.
  - Adds a directed edge to the graph.
- **Delete Edge**:
  - Prompts the user to input the `from` and `to` nodes.
  - Removes the corresponding edge from the graph.

### 3. **Graph Saving and Resetting**
- **Save Graph**:
  - Sends the current graph data (nodes and edges) to a backend API endpoint (`POST http://localhost:5000/api/graph`) for persistence.
- **Reset Graph**:
  - Clears all nodes and edges, resetting the graph canvas.

### 4. **Algorithm Simulation**
#### **Dijkstra's Algorithm**
- Finds the shortest path between two nodes.
- Displays:
  - The path taken.
  - The total path length.
  - Time taken to compute the result.

#### **Bellman-Ford Algorithm**
- Computes shortest paths from a source node to all other nodes, even if the graph contains negative weights.
- Displays:
  - The path taken.
  - The total path length.
  - Time taken to compute the result.

#### **Minimum Spanning Tree (MST)**
- Constructs an MST using Kruskal's Algorithm.
- Displays:
  - The edges included in the MST.
  - The total weight of the MST.
  - Time taken to compute the MST.
- Also checks if a path exists between the specified start and end nodes in the MST.

### 5. **Interactive Canvas**
- The graph is rendered on an SVG canvas.
- Nodes and edges are clickable for selection or interaction.
- Selected nodes are visually highlighted.

### 6. **Performance Metrics**
- Tracks and displays the time taken (in microseconds or milliseconds) to execute algorithms.
- Helps users understand the computational efficiency of each algorithm.

---

![Screenshot (372)](https://github.com/user-attachments/assets/ed77194d-65fa-4536-b5f2-c3928570e386)  

### Visualization
1. After entering the source and destination nodes, the graph visualizes the path and displays the path, the cost to reach the destination, and the time taken.

![Screenshot (373)](https://github.com/user-attachments/assets/0a287747-7ea4-4eef-abb9-8ac180142aec)



![Screenshot (374)](https://github.com/user-attachments/assets/708b0497-fbea-48d2-a89e-2403e905ebd3)



## Technologies Used

### Frontend:
- **React.js**: For building the user interface and managing state.
- **CSS**: For styling and layout (via `GraphCanvas.css`).
- **SVG**: For rendering the graph visualization.

### Backend:
- **Node.js / Express.js** (assumed): For API endpoints to fetch and save graph data.
- **Axios**: For making HTTP requests to the backend.

---

## How It Works

1. **Initializing the Graph**:
   - On loading the app, the graph data is fetched from the backend (`GET http://localhost:5000/api/graph`).
   - Nodes and edges are populated into the state.

2. **Manipulating the Graph**:
   - Users can add or delete nodes and edges using the buttons provided.
   - The graph state is updated dynamically, and changes are reflected in real time on the canvas.

3. **Running Algorithms**:
   - Users can simulate Dijkstra's, Bellman-Ford, or MST algorithms by specifying a start and end node.
   - The respective algorithm is executed, and the results (path, length, computation time) are displayed.

4. **Saving Graph Data**:
   - Users can save their graph to the backend for later use or analysis.

5. **Resetting the Graph**:
   - Clears all graph data from the canvas, allowing users to start fresh.

---

## How to Run the Project

### Prerequisites
- **Node.js** and **npm** installed on your machine.

### Steps to Run
1. Clone the repository:
   ```bash
   git clone [(https://github.com/Pradeep24032004/Graph-Visualizer-Project)]
   cd Graph-Visualizer-Project
