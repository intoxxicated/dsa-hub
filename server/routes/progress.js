const express = require('express');
const Progress = require('../models/Progress');
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Problem = require('../models/Problem');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const progress = await Progress.find({ user_id: req.user._id });
        res.send(progress);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/admin/summary', auth, admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('email full_name created_at');
        const progressSummary = await Promise.all(users.map(async (user) => {
            const completedCount = await Progress.countDocuments({ user_id: user._id, completed: true });
            return {
                _id: user._id,
                email: user.email,
                full_name: user.full_name,
                created_at: user.created_at,
                completedProblems: completedCount
            };
        }));

        const totalProblems = await Problem.countDocuments();
        res.send({ users: progressSummary, totalProblems });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/toggle', auth, async (req, res) => {
    try {
        const { problem_id, completed } = req.body;

        const progress = await Progress.findOneAndUpdate(
            { user_id: req.user._id, problem_id },
            {
                completed,
                completed_at: completed ? new Date() : null
            },
            { upsert: true, new: true }
        );

        res.send(progress);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

module.exports = router;
