// File: /models/Statistics.js
import mongoose from 'mongoose';

const dailyStatSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    properViews: {
        type: Number,
        default: 0,
    },
    earnings: {
        type: Number,
        default: 0,
    },
    dailyCPM: {
        type: Number,
        default: 0,
    },
});

const statisticsSchema = new mongoose.Schema({
    userEmail: { // Changed from 'email' in the original prompt's statisticsSchema to 'userEmail' for consistency in API/Models
        type: String,
        required: true,
        unique: true,
    },
    totalImpressions: {
        type: Number,
        default: 0,
    },
    totalProperViews: {
        type: Number,
        default: 0,
    },
    totalEarnings: {
        type: Number,
        default: 0,
    },
    averageCPM: {
        type: Number,
        default: 0,
    },
    dailyStats: [dailyStatSchema],
}, { timestamps: true });

const Statistics = mongoose.models.Statistics || mongoose.model('Statistics', statisticsSchema);

export default Statistics;