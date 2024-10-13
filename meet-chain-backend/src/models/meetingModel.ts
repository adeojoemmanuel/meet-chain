import mongoose, { Document, Schema } from 'mongoose';

// Define the Meeting interface
export interface IMeeting extends Document {
    creatorWalletAddress: string;   // Wallet address of the user who created the meeting
    meetingId: string;              // Unique identifier for the meeting
    meetingFee: number;             // Fee for joining the meeting (0 if free)
    scheduled: boolean;             // Indicates if the meeting is scheduled
    scheduleTime?: Date;            // The time the meeting is scheduled for (optional)
    participants: string[];         // List of wallet addresses of participants
    createdAt: Date;                // Timestamp of when the meeting was created
    active: boolean;                // Is the meeting currently active
}

// Define the schema for meetings
const MeetingSchema: Schema = new Schema({
    creatorWalletAddress: {
        type: String,
        required: true,
    },
    meetingId: {
        type: String,
        required: true,
        unique: true,
    },
    meetingFee: {
        type: Number,
        required: true,
        default: 0,   // Default to 0 if it's a free meeting
    },
    scheduled: {
        type: Boolean,
        required: true,
        default: false,
    },
    scheduleTime: {
        type: Date,
    },
    participants: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
});

// Create and export the model
const MeetingModel = mongoose.model<IMeeting>('Meeting', MeetingSchema);

export default MeetingModel;
