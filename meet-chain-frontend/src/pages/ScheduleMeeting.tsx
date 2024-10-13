import React, { useState } from 'react';

const ScheduleMeeting: React.FC = () => {
    const [fee, setFee] = useState<number>(0);
    const [scheduleTime, setScheduleTime] = useState<string>("");

    const handleScheduleMeeting = () => {
        fetch('http://localhost:5000/api/meetings/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                walletAddress: 'your-wallet',
                meetingFee: fee,
                scheduleTime: scheduleTime
            })
        });
    };

    return (
        <div>
            <h1>Schedule Meeting</h1>
            <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
            />
            <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
            />
            <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
        </div>
    );
};

export default ScheduleMeeting;
