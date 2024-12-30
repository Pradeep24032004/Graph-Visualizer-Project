//import React from "react";
const runDijkstra = (nodes, edges, setPath, setPathLength, setPathTime) => {
    const start = prompt('Enter start node:');
    const end = prompt('Enter end node:');

    const startTime = Date.now(); // Start time measurement

    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes.map(node => node.id));

    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
    distances[start] = 0;

    while (unvisited.size) {
        const currentNode = Array.from(unvisited).reduce((a, b) =>
            distances[a] < distances[b] ? a : b
        );

        unvisited.delete(currentNode);

        if (currentNode === end) break;

        edges
            .filter(edge => edge.from === currentNode && unvisited.has(edge.to))
            .forEach(edge => {
                const alt = distances[currentNode] + edge.weight;
                if (alt < distances[edge.to]) {
                    distances[edge.to] = alt;
                    previous[edge.to] = currentNode;
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
    setPathTime((endTime - startTime) * 1000); // Calculate and set time taken
};
export default runDijkstra;