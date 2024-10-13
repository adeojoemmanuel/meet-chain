import React from 'react';
import { WalletContext } from './contexts/WalletContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateMeeting from './pages/CreateMeeting';
import ScheduleMeeting from './pages/ScheduleMeeting';
import VideoCall from './components/VideoCall';

const App: React.FC = () => {
    return (
        <WalletContext>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/create" element={<CreateMeeting />} />
                    <Route path="/schedule" element={<ScheduleMeeting />} />
                    <Route path="/call/:meetingId" element={<VideoCall />} />
                </Routes>
            </Router>
        </WalletContext>
    );
};

export default App;
