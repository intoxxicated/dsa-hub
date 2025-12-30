const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'Email already registered' });
        }

        const user = new User({ email, password, full_name });
        await user.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

const { auth } = require('../middleware/auth');
router.get('/profile', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
