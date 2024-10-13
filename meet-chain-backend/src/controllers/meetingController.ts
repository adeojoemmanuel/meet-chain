import { Request, Response } from 'express';
import { createSolanaTransaction } from '../utils/solanaUtils';

export const createMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress, meetingFee, free } = req.body;

        if (!free) {
            const transaction = await createSolanaTransaction(walletAddress, meetingFee);
            if (!transaction.success) {
                res.status(500).json({ message: 'Transaction failed' });
                return;
            }
        }

        // Create and save meeting details
        res.status(200).json({ message: 'Meeting created', meetingId: 'sample_meeting_id' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const scheduleMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress, meetingFee, scheduleTime } = req.body;

        // Schedule logic
        res.status(200).json({ message: 'Meeting scheduled' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
