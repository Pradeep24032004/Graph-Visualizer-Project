import React from "react";
const runBellmanFord = (nodes, edges, setPath, setPathLength, setPathTime) => {
    const start = prompt('Enter start node:');
    const end = prompt('Enter end node:');

    const startTime = Date.now(); // Start time measurement

    const distances = {};
    const previous = {};

    // Initialize distances and previous nodes
    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
    distances[start] = 0;

    // Relax edges repeatedly
    for (let i = 0; i < nodes.length - 1; i++) {
        edges.forEach(edge => {
            const { from, to, weight } = edge;
            if (distances[from] + weight < distances[to]) {
                distances[to] = distances[from] + weight;
                previous[to] = from;
            }
        });
    }

    // Check for negative weight cycles
    edges.forEach(edge => {
        const { from, to, weight } = edge;
        if (distances[from] + weight < distances[to]) {
            console.error('Graph contains a negative weight cycle');
            return;
        }
    });

    // Build the shortest path
    const path = [];
    let currentNode = end;
    while (currentNode) {
        path.unshift(currentNode);
        currentNode = previous[currentNode];
    }

    const endTime = Date.now(); // End time measurement

    // Set the results
    setPath(path);
    setPathLength(distances[end]);
    setPathTime((endTime - startTime) * 1000); // Calculate and set time taken
};

export default runBellmanFord;
