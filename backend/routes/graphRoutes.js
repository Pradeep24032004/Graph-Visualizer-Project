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



module.exports = router;
