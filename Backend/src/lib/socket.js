import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('join', (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            io.emit('online_users', Array.from(onlineUsers.keys()));
            console.log(`user joined ${userId} -> ${socket.id}`);
        }
    });

    socket.on('disconnect', () => {
        for (const [userId, sid] of onlineUsers.entries()) {
            if (sid === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        io.emit('online_users', Array.from(onlineUsers.keys()));
        console.log('a user disconnected', socket.id);
    });
});

export { io, server, app, onlineUsers };