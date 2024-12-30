const express = require('express');
const Graph = require('../models/Graph');
const router = express.Router();

// Get graph data
router.get('/', async (req, res) => {
    const graph = await Graph.findOne();
    res.json(graph || { nodes: [], edges: [] });
});

// Update graph data
router.post('/', async (req, res) => {
    const { nodes, edges } = req.body;
    let graph = await Graph.findOne();
    if (!graph) {
        graph = new Graph({ nodes, edges });
    } else {
        graph.nodes = nodes;
        graph.edges = edges;
    }
    await graph.save();
    res.json(graph);
});
// Get a specific graph by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;  // Get graph ID from URL params
    try {
        const graph = await Graph.findById(id);  // Find a graph by its ID
        if (!graph) {
            return res.status(404).json({ message: 'Graph not found' });
        }
        res.json(graph);  // Respond with the selected graph
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving graph', error: err });
    }
});
// Delete a node
router.delete('/node/:id', async (req, res) => {
    const nodeId = req.params.id;

    try {
        const graph = await Graph.findOne();
        if (!graph) {
            return res.status(404).send('Graph not found');
        }

        const nodeExists = graph.nodes.some(node => node.id === nodeId);
        if (!nodeExists) {
            return res.status(404).send('Node not found');
        }

        graph.nodes = graph.nodes.filter(node => node.id !== nodeId);
        graph.edges = graph.edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId);

        await graph.save();
        res.status(200).send('Node deleted successfully!');
    } catch (err) {
        console.error('Error deleting node:', err);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
