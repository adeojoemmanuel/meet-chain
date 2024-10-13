import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnectButton } from '../contexts/WalletContext';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Meet-Chain</h1>
            <WalletConnectButton />
            <nav>
                <Link to="/create">Create Meeting</Link>
                <Link to="/schedule">Schedule Meeting</Link>
            </nav>
        </div>
    );
};

export default HomePage;
