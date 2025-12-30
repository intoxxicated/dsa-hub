const express = require('express');
const Topic = require('../models/Topic');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const topics = await Topic.find().sort({ order_index: 1 });
        res.send(topics);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) return res.status(404).send({ error: 'Topic not found' });
        res.send(topic);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', auth, admin, async (req, res) => {
    try {
        const topic = new Topic(req.body);
        await topic.save();
        res.status(201).send(topic);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.patch('/:id', auth, admin, async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id;

        const topic = await Topic.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!topic) return res.status(404).send({ error: 'Topic not found' });
        res.send(topic);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const topic = await Topic.findByIdAndDelete(req.params.id);
        if (!topic) return res.status(404).send({ error: 'Topic not found' });
        res.send(topic);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
