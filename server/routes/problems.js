const express = require('express');
const Problem = require('../models/Problem');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find().populate('topic_id', 'name').sort({ topic_id: 1, order_index: 1 });
        res.send(problems);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/topic/:topicId', async (req, res) => {
    try {
        const problems = await Problem.find({ topic_id: req.params.topicId }).sort({ order_index: 1 });
        res.send(problems);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).populate('topic_id', 'name');
        if (!problem) return res.status(404).send({ error: 'Problem not found' });
        res.send(problem);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', auth, admin, async (req, res) => {
    try {
        const problem = new Problem(req.body);
        await problem.save();
        res.status(201).send(problem);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id', auth, admin, async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id;

        const problem = await Problem.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!problem) return res.status(404).send({ error: 'Problem not found' });
        res.send(problem);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);
        if (!problem) return res.status(404).send({ error: 'Problem not found' });
        res.send(problem);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
