
// GraphCanvas.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GraphCanvas.css';
import runDijkstra from './Algorithms/runDijkstra';
//import runBellmanFord from './Algorithms/runBellmanFord';
const GraphCanvas = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [path, setPath] = useState([]);
    const [pathLength, setPathLength] = useState(0);
    const [pathTime, setPathTime] = useState(0); // Time taken to find the path
    const [nodeNameToDelete, setNodeNameToDelete] = useState('');
    
    useEffect(() => {
        axios.get('http://localhost:5000/api/graph')
            .then(res => {
                setNodes(res.data.nodes || []);
                setEdges(res.data.edges || []);
            });
    }, []);

    const addNode = () => {
        const id = prompt('Enter node ID:');
        const x = parseInt(prompt('Enter x coordinate:'), 10);
        const y = parseInt(prompt('Enter y coordinate:'), 10);
        if (id && !isNaN(x) && !isNaN(y)) {
            setNodes([...nodes, { id, x, y }]);
        }
    };

    const addEdge = () => {
        const from = prompt('Enter from node:');
        const to = prompt('Enter to node:');
        const weight = parseInt(prompt('Enter weight:'), 10);
        if (from && to && !isNaN(weight)) {
            setEdges([...edges, { from, to, weight }]);
        }
    };

    const deleteEdge = () => {
        const from = prompt('Enter from node:');
        const to = prompt('Enter to node:');
        setEdges(edges.filter(edge => edge.from !== from || edge.to !== to));
    };

    const deleteNode = async () => {
        if (!nodeNameToDelete.trim()) {
            alert('Please enter a valid node name.');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5000/node/${nodeNameToDelete}`);
            alert(response.data);

            setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeNameToDelete));
            setEdges(prevEdges => prevEdges.filter(edge => edge.from !== nodeNameToDelete && edge.to !== nodeNameToDelete));
            setNodeNameToDelete('');
        } catch (err) {
            if (err.response && err.response.data) {
                alert(err.response.data);
            } else {
                console.error('Error deleting node:', err);
                alert('Failed to delete the node. Please try again.');
            }
        }
    };

    const saveGraph = () => {
        axios.post('http://localhost:5000/api/graph', { nodes, edges })
            .then(() => alert('Graph saved!'))
            .catch(err => console.error(err));
    };
    
  
    const runBellmanFord = () => {
        const start = prompt('Enter start node:');
        const end = prompt('Enter end node:');

        const startTime = Date.now(); // Start time measurement

        const distances = {};
        const previous = {};

        nodes.forEach(node => {
            distances[node.id] = Infinity;
            previous[node.id] = null;
        });
        distances[start] = 0;

        for (let i = 0; i < nodes.length - 1; i++) {
            edges.forEach(edge => {
                const { from, to, weight } = edge;
                if (distances[from] + weight < distances[to]) {
                    distances[to] = distances[from] + weight;
                    previous[to] = from;
                }
            });
        }

        const path = [];
        let currentNode = end;
        while (currentNode) {
            path.unshift(currentNode);
            currentNode = previous[currentNode];
        }

        const endTime = Date.now(); // End time measurement
        setPath(path);
        setPathLength(distances[end]);
        setPathTime((endTime - startTime)*1000); // Calculate and set time taken
    }; 

    const runMST = () => {
        const start = prompt('Enter start node:');
        const end = prompt('Enter end node:');

        const startTime = Date.now(); // Start time measurement

        // Helper function to find the root of a node (for Union-Find)
        const find = (parent, node) => {
            if (parent[node] === node) return node;
            return parent[node] = find(parent, parent[node]); // Path compression
        };

        // Helper function to union two subsets
        const union = (parent, rank, node1, node2) => {
            const root1 = find(parent, node1);
            const root2 = find(parent, node2);

            if (root1 !== root2) {
                if (rank[root1] > rank[root2]) {
                    parent[root2] = root1;
                } else if (rank[root1] < rank[root2]) {
                    parent[root1] = root2;
                } else {
                    parent[root2] = root1;
                    rank[root1]++;
                }
            }
        };

        const mstEdges = [];
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight); // Sort edges by weight

        const parent = {};
        const rank = {};

        // Initialize parent and rank for all nodes
        nodes.forEach(node => {
            parent[node.id] = node.id;
            rank[node.id] = 0;
        });

        // Process edges in sorted order
        for (const edge of sortedEdges) {
            const { from, to } = edge;

            if (find(parent, from) !== find(parent, to)) {
                mstEdges.push(edge);
                union(parent, rank, from, to);

                // Stop if we already have the MST between the start and end nodes
                if (find(parent, start) === find(parent, end)) {
                    break;
                }
            }
        }

        // Check if start and end are connected in the MST
        const connected = find(parent, start) === find(parent, end);

        const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);
        const endTime = Date.now(); // End time measurement

        if (connected) {
            alert(`MST Edges between ${start} and ${end}:\n${mstEdges.map(edge => `${edge.from} → ${edge.to} (weight: ${edge.weight})`).join('\n')}`);
            alert(`Total Weight of MST: ${totalWeight}`);
        } else {
            alert(`No path exists between ${start} and ${end} in the MST.`);
        }

        alert(`Time Taken: ${endTime - startTime} ms`);

        // Highlight the MST edges in the graph
        setEdges(prevEdges =>
            prevEdges.map(edge =>
                mstEdges.some(mstEdge => mstEdge.from === edge.from && mstEdge.to === edge.to)
                    ? { ...edge, isMST: true }
                    : { ...edge, isMST: false }
            )
        );
    };

    const resetGraph = () => {
        setNodes([]);
        setEdges([]);
    };

    return (
        <div className="graph-canvas">
            <svg>
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
                    </marker>
                </defs>
                {edges.map((edge, index) => {
                    const fromNode = nodes.find(node => node.id === edge.from);
                    const toNode = nodes.find(node => node.id === edge.to);

                    if (!fromNode || !toNode) return null;

                    const midX = (fromNode.x + toNode.x) / 2;
                    const midY = (fromNode.y + toNode.y) / 2;

                    const offset = 10; // Offset for edge weights
                    const dx = toNode.x - fromNode.x;
                    const dy = toNode.y - fromNode.y;
                    const length = Math.sqrt(dx * dx + dy * dy);

                    const offsetX = -dy / length * offset;
                    const offsetY = dx / length * offset;

                    return (
                        <g key={index}>
                            <line
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke={path.includes(edge.from) && path.includes(edge.to) ? 'red' : 'black'}
                                strokeWidth="2"
                                markerEnd="url(#arrowhead)"
                            />
                            <text
                                x={midX + offsetX}
                                y={midY + offsetY}
                                className="edge-label"
                            >
                                {edge.weight}
                            </text>
                        </g>
                    );
                })}
                {nodes.map(node => (
                    <g key={node.id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="10"
                            fill={selectedNode === node.id ? 'red' : 'blue'}
                            onClick={() => setSelectedNode(node.id)}
                        />
                        <text x={node.x + 12} y={node.y + 5} className="node-label">
                            {node.id}
                        </text>
                    </g>
                ))}
            </svg>
            <div className="button-container">
      <div className="row">
        <button onClick={addNode}>Add Node</button>
        <button onClick={addEdge}>Add Edge</button>
        <button onClick={deleteEdge}>Delete Edge</button>
     </div>
    <div className="row">
        
        <button onClick={saveGraph}>Save Graph</button>
        <button onClick={() => runDijkstra(nodes, edges, setPath, setPathLength, setPathTime)}>Run Dijkstra</button>
    </div>
    <div className="row">
        <button onClick={runBellmanFord}>Run Bellman-Ford</button>
        <button onClick={runMST}>Run MST</button>
        <button onClick={resetGraph}>Reset</button>
    </div>
</div>

           
            {path.length > 0 && (
                <div className="path-result">
                    <p>Path: {path.join(' → ')}</p>
                    <p>Path Length: {pathLength}</p>
                    <p>Time Taken: {pathTime} microsecs</p>
                </div>
            )}

            <div>
                <input
                    type="text"
                    value={nodeNameToDelete}
                    onChange={(e) => setNodeNameToDelete(e.target.value)}
                    placeholder="Node Name to Delete"
                />
                <button onClick={deleteNode}>Delete Node</button>
            </div>
        
        </div>
    );
};

export default GraphCanvas;

/** <button onClick={addNode}>Add Node</button>
            <button onClick={addEdge}>Add Edge</button>
            <button onClick={deleteEdge}>Delete Edge</button>
            <button onClick={deleteNode}>Delete Node</button>
            <button onClick={saveGraph}>Save Graph</button>
            <button onClick={runDijkstra}>Run Dijkstra</button>
            <button onClick={runBellmanFord}>Run Bellman-Ford</button>
            <button onClick={runMST}>Run MST</button>
            <button onClick={resetGraph}>Reset</button>
 */