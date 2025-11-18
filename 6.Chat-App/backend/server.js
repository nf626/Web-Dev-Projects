import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createUsers, createMessages, getRoom, getMessages } from './database.js';

const PORT = process.env.PORT || 8080;
const userObj = {};
const roomObj = {};

// File name path to frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file_path = path.parse(__dirname);
const file_dir = file_path.dir;

// Server
const app = express();

// Static middleware - runs all static files together
app.use(express.static(path.resolve(file_dir, "frontend")));

// Socket.io
// New socket
const httpServer = createServer(app);
const io = new Server(httpServer, {
    // Cors to connect server to client
    cors: {
        origin: ["http://127.0.0.1:3000"]
    }
});

// Listens for socket connection
io.on("connection", (socket) => {
    /**
     * Helper function. Shows users online except yourself.
     * @return None.
     */
    function userList() {
        // Send filtered list to *this* client (exclude themselves)
        const filteredList = Object.fromEntries(
        Object.entries(userObj).filter(([id]) => id !== socket.id)
        );
        socket.emit("list users", filteredList);

        // Send full list (including this new user) to everyone else
        io.to("public").emit("list users", userObj);
    }

    /**
     * Register username
     */
    socket.on("list users", async (user) => {
        userObj[socket.id] = user;

        console.log(`User connected: ${user}`);
        socket.join("public");

        await createUsers(socket.id, user); // mysql - create user
        userList();
    });

    /**
     * Join room
     */
    socket.on("join room", async (roomName) => {
        const username = userObj[socket.id];
        if (!username) return;

        // Leave previous room
        if (socket.data.room) {
            const oldRoom = socket.data.room;
            socket.leave(oldRoom);

            if (roomObj[oldRoom]) {
                roomObj[oldRoom] = roomObj[oldRoom].filter(user => user !== username);
                io.to(oldRoom).emit("room users", roomObj[oldRoom]);
            }
        }

        // Join new room
        socket.join(roomName);
        socket.data.room = roomName;

        if (!roomObj[roomName]) {
            roomObj[roomName] = [];
        };

        if (!roomObj[roomName].includes(username)) {
            roomObj[roomName].push(username);
        };

        // System messages
        socket.emit("system message", `You joined ${roomName}`);

        // Update everyone’s room user list
        io.to(roomName).except("public").emit("room users", roomObj[roomName]);

        console.log(`${username} joined ${roomName}`);

        await getRoom(roomName);
    });

    /**
     * Leave room
     */
    socket.on("leave room", (roomName) => {
        const username = userObj[socket.id];
        if (!username) return;

        // Leave the old room
        socket.leave(roomName);

        if (roomObj[roomName]) {
            roomObj[roomName] = roomObj[roomName].filter(user => user !== username);
            io.to(roomName).emit("room users", roomObj[roomName]);
        }

        // Join public room again
        socket.join("public");
        socket.data.room = "public";
        roomName = "public";

        // Update the user list for public
        userList();

        // Send system message
        socket.emit("system message", `You joined ${roomName}`);
        console.log(`${username} joined public`);
    });

    /**
     * Chat message
     */
    socket.on("chat message", async (msg, userName) => {
        const room = socket.data.room;
        
        try {
            await createMessages(socket.id, room, msg);

            const data = await getMessages(socket.id, room);

            socket.broadcast.to(room).emit("chat message", data.content, userName);
        } catch (error) {
            console.log(error);
        }
    });

    /**
     * Disconnect
     */
    socket.on("disconnect", () => {
        const username = userObj[socket.id];
        delete userObj[socket.id];

        if (socket.data.room && roomObj[socket.data.room]) {
            const room = socket.data.room;
            roomObj[room] = roomObj[room].filter(u => u !== username);
            io.to(room).emit("room users", roomObj[room]);
        }
        
        userList();

        console.log(`${username || socket.id} disconnected`);
    });
});

// Listen to port
httpServer.listen(PORT, () => {
    console.log(`Server: ${PORT}`);
});
