// File: /api/withdrawal/request/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Withdrawal from '@/models/Withdrawal';

export async function POST(request) {
    try {
        await connectDB();

        const { userEmail, amount } = await request.json();

        if (!userEmail || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }
        
        const MIN_WITHDRAWAL = 5.00; // Match frontend minimum

        const withdrawalDoc = await Withdrawal.findOne({ userEmail });

        if (!withdrawalDoc) {
            return NextResponse.json({ error: 'Withdrawal account not found' }, { status: 404 });
        }
        
        // 1. Basic Validation: Check available balance
        if (withdrawalDoc.availableBalance < MIN_WITHDRAWAL || withdrawalDoc.availableBalance < amount) {
            return NextResponse.json({ error: 'Insufficient available balance for withdrawal' }, { status: 403 });
        }

        // 2. Create the new history entry (the "request")
        const newHistoryItem = {
            withdrawalId: `WID-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Unique ID
            date: new Date(),
            status: 'Pending', // All new requests are pending
            publisherEarnings: amount, // Assuming the entire available balance is earnings
            referralEarnings: 0,
            totalAmount: amount,
            withdrawalMethod: 'PayPal', // Placeholder: Should come from user's payment details
            withdrawalAccount: 'user@example.com', // Placeholder: Should come from user's payment details
        };

        // 3. Update the main Withdrawal Document (atomic update is best practice)
        withdrawalDoc.availableBalance -= amount; // Deduct from available
        withdrawalDoc.pendingBalance += amount; // Add to pending
        withdrawalDoc.history.unshift(newHistoryItem); // Add new request to the front of history

        await withdrawalDoc.save();

        // 4. Return the updated document
        return NextResponse.json({ 
            message: 'Withdrawal request submitted successfully.', 
            updatedWithdrawal: withdrawalDoc 
        }, { status: 201 });

    } catch (error) {
        console.error('Error processing withdrawal request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}