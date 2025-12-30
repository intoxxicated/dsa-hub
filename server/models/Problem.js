const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    topic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    youtube_link: {
        type: String,
        trim: true,
    },
    leetcode_link: {
        type: String,
        trim: true,
    },
    codeforces_link: {
        type: String,
        trim: true,
    },
    article_link: {
        type: String,
        trim: true,
    },
    order_index: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Problem', problemSchema);
