// File: /models/Withdrawal.js
import mongoose from 'mongoose';

const withdrawalHistorySchema = new mongoose.Schema({
    withdrawalId: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Complete', 'Cancelled', 'Returned'],
        default: 'Pending',
    },
    publisherEarnings: {
        type: Number,
        required: true,
    },
    referralEarnings: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    withdrawalMethod: {
        type: String,
        required: true,
    },
    withdrawalAccount: {
        type: String,
        required: true,
    },
});

const withdrawalSchema = new mongoose.Schema({
    userEmail: { // Changed from 'email' in the original prompt's withdrawalSchema to 'userEmail' for consistency in API/Models
        type: String,
        required: true,
        unique: true,
    },
    availableBalance: {
        type: Number,
        default: 0,
    },
    pendingBalance: {
        type: Number,
        default: 0,
    },
    totalWithdrawn: {
        type: Number,
        default: 0,
    },
    history: [withdrawalHistorySchema],
}, { timestamps: true });

const Withdrawal = mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;