import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useSolanaWallet } from '../contexts/WalletContext';

type UserStream = {
    userId: string;
    stream: MediaStream;
};

const VideoCall: React.FC = () => {
    const { meetingId } = useParams<{ meetingId: string }>();
    const { publicKey, connected } = useSolanaWallet();

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<UserStream[]>([]);
    const socket = useRef<Socket | null>(null);
    const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});

    // Local video ref to display user's own stream
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    // Manage multiple remote video streams
    const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    useEffect(() => {
        if (!connected) {
            alert('Please connect your wallet to join the meeting.');
            return;
        }

        // Initialize WebRTC and Socket.IO
        initializeCall();

        return () => {
            socket.current?.disconnect();
        };
    }, [connected, publicKey, meetingId]);

    const initializeCall = () => {
        // Initialize socket connection
        socket.current = io(process.env.SOCKET_IO_URL);

        // Join the meeting room
        socket.current.emit('joinCall', { meetingId, userId: publicKey?.toString() });

        // Get user media (video/audio)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Inform other users of the new stream
                socket.current?.emit('newUser', { meetingId, userId: publicKey?.toString() });

                // Listen for existing users and setup peer connections
                socket.current?.on('userJoined', handleUserJoined);
                socket.current?.on('offer', handleOffer);
                socket.current?.on('answer', handleAnswer);
                socket.current?.on('iceCandidate', handleNewICECandidate);
            });
    };

    const handleUserJoined = (data: { userId: string }) => {
        // Set up WebRTC connection with the new user
        const peerConnection = createPeerConnection(data.userId);
        peerConnections.current[data.userId] = peerConnection;

        // Add local stream to the new connection
        localStream?.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Create an offer to connect
        peerConnection.createOffer()
            .then(offer => {
                peerConnection.setLocalDescription(offer);
                socket.current?.emit('offer', { offer, to: data.userId });
            });
    };

    const createPeerConnection = (userId: string) => {
        const peerConnection = new RTCPeerConnection();

        // Handle remote stream from the peer
        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            setRemoteStreams(prevStreams => [...prevStreams, { userId, stream: remoteStream }]);
        };

        // Send ICE candidates to peer
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current?.emit('iceCandidate', { candidate: event.candidate, to: userId });
            }
        };

        return peerConnection;
    };

    const handleOffer = (data: { offer: RTCSessionDescriptionInit, from: string }) => {
        const peerConnection = createPeerConnection(data.from);
        peerConnections.current[data.from] = peerConnection;

        peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
            .then(() => peerConnection.createAnswer())
            .then(answer => {
                peerConnection.setLocalDescription(answer);
                socket.current?.emit('answer', { answer, to: data.from });
            });
    };

    const handleAnswer = (data: { answer: RTCSessionDescriptionInit, from: string }) => {
        const peerConnection = peerConnections.current[data.from];
        if (peerConnection) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
    };

    const handleNewICECandidate = (data: { candidate: RTCIceCandidateInit, from: string }) => {
        const peerConnection = peerConnections.current[data.from];
        if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
        }
    };

    return (
        <div>
            <h1>Meeting ID: {meetingId}</h1>

            <div>
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ width: '300px', height: '200px' }}
                />
                <button onClick={toggleAudio}>Toggle Audio</button>
                <button onClick={toggleVideo}>Toggle Video</button>
            </div>

            <div>
                <h2>Participants</h2>
                {remoteStreams.map((userStream) => (
                    <div key={userStream.userId}>
                        <video
                            ref={(el) => (remoteVideoRefs.current[userStream.userId] = el)}
                            autoPlay
                            playsInline
                            style={{ width: '300px', height: '200px' }}
                            onCanPlay={() => {
                                if (remoteVideoRefs.current[userStream.userId]) {
                                    remoteVideoRefs.current[userStream.userId]!.srcObject = userStream.stream;
                                }
                            }}
                        />
                        <button onClick={toggleAudio}>Mute/Unmute Audio</button>
                        <button onClick={toggleVideo}>Enable/Disable Video</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoCall;
