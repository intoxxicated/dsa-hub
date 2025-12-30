const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    problem_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completed_at: {
        type: Date,
    },
}, {
    timestamps: true,
});

progressSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
