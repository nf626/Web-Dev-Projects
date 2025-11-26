import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createUsers, createMessages, getRoom, getMessages, getUser } from './database.js';
import { loadEnvFile } from "node:process";

loadEnvFile(); // Access .env file
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

// Socket connection
const httpServer = createServer(app);
const io = new Server(httpServer, {
    // Cors to connect server to client
    cors: {
        origin: [process.env.ADDRESS]
    }
});

// Socket Connected
io.on("connection", (socket) => {
    /**
     * Helper function. Filter user from list.
     */
    function userList(userName) {
        // Send filtered list to *this* client (exclude themselves)
        const filteredList = Object.fromEntries(
        Object.entries(userObj).filter(([id]) => id !== socket.id)
        );
        if (userObj[socket.id] === userName) {
            socket.emit("list users", filteredList);
        }

        // Send full list (including this new user) to everyone else
        io.to("public").emit("list users", userObj);
    }

    /**
     * Register username
     */
    socket.on("list users", async (userName, userUUID) => {
        userObj[socket.id] = userName;
        socket.join("public");

        await createUsers(userUUID, userName, socket.id); // Store users in database
        userList(userName);
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

        await getRoom(roomName); // Store room in database

        const response = await getMessages(roomName); // Get room messages from database
        io.to(roomName).emit("room messages", response);
    });

    /**
     * Leave room
     */
    socket.on("leave room", async (roomName) => {
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

        const response = await getMessages(roomName);
        io.to(roomName).emit("room messages", response);
    });

    /**
     * Chat message
     */
    socket.on("chat message", async (msg, userName) => {
        const room = socket.data.room;
        
        try {
            await createMessages(socket.id, room, msg); // Store messages in database
            socket.broadcast.to(room).emit("chat message", msg, userName);

        } catch (error) {
            throw new Error(error);
        }
    });

    /**
     * Socket Disconnect
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
    });
});

// Listen for port
httpServer.listen(PORT, () => {
    console.log(`Server: ${PORT}`);
});
