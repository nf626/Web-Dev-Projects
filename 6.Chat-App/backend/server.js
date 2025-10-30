import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 8080;

// file name path to frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file_path = path.parse(__dirname);
const file_dir = file_path.dir;

// backend server
const app = express();

// socket
const httpServer = createServer(app);
const io = new Server(httpServer);

// static middleware - runs all static files together
app.use(express.static(path.resolve(file_dir, "frontend")));

// socket handler
io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("chat message", (msg) => {
        console.log("message:", msg);
        io.emit("chat message", msg);
    });

    // disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    });
});


httpServer.listen(PORT, () => {
    console.log(`Server: ${PORT}`);
});
