import React, { useState } from 'react';

const CreateMeeting: React.FC = () => {
    const [fee, setFee] = useState<number>(0);

    const handleCreateMeeting = () => {
        const endpoint = `${process.env.SOCKET_IO_URL}/api/meetings/create`
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                walletAddress: 'your-wallet',
                meetingFee: fee,
                free: false
            })
        });
    };

    return (
        <div>
            <h1>Create Meeting</h1>
            <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
            />
            <button onClick={handleCreateMeeting}>Create Meeting</button>
        </div>
    );
};

export default CreateMeeting;
