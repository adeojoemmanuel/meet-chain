import { Server, Socket } from 'socket.io';

export const handleSocket = (socket: Socket, io: Server) => {
    console.log('A user connected', socket.id);

    socket.on('joinCall', ({ meetingId, userId }) => {
        socket.join(meetingId);
        socket.to(meetingId).emit('userJoined', { userId });
    });

    socket.on('offer', ({ offer, to }) => {
        socket.to(to).emit('offer', { offer, from: socket.id });
    });

    socket.on('answer', ({ answer, to }) => {
        socket.to(to).emit('answer', { answer, from: socket.id });
    });

    socket.on('iceCandidate', ({ candidate, to }) => {
        socket.to(to).emit('iceCandidate', { candidate, from: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
};
