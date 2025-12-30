const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('DSA Mastery Hub API is running...');
});

const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');
const problemRoutes = require('./routes/problems');
const progressRoutes = require('./routes/progress');

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/progress', progressRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
