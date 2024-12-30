const mongoose = require('mongoose');

const graphSchema = new mongoose.Schema({
    nodes: [{ id: String, x: Number, y: Number }],
    edges: [{ from: String, to: String, weight: Number }],
});

module.exports = mongoose.model('Graph', graphSchema);
