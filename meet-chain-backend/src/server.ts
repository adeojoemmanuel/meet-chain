import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import meetingRoutes from './routes/meetingRoutes';
import { handleSocket } from './socketHandler';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.use(express.json());
app.use('/api/meetings', meetingRoutes);

io.on('connection', (socket) => handleSocket(socket, io));

// Export the `app`, `server`, and `io`
export { app, server, io };
