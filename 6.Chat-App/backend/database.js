/**
 * MYSQL Database
 */
import mysql from "mysql2";
import { loadEnvFile } from "node:process";

loadEnvFile(); // Access .env file

// mysql connection
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    gracefulEnd: true
}).promise();

/**
 * Creates Users.
 * @param {string} id - User ID.
 * @param {string} user - Username.
 * @param {string} socket - Socket ID.
 * @returns {object} User object created from database.
 */
export async function createUsers(id, user, socket) {
    try {
        await pool.query(`
            INSERT INTO Users (userID, userName, socketID)
            VALUES (?, ?, ?)
        `, [id, user, socket]);

        return getUser(id);

    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Retrieves User.
 * @param {string} id - User ID.
 * @returns {object} Shows user object.
 */
export async function getUser(id) {
    try {
        const [ rows ] = await pool.query(`
            SELECT * FROM Users
            WHERE userID = ?
        `, [id]);

        return rows[0];

    } catch (error) {
        throw new Error(error);
    }
}

/* --------------------------------------------------------*/

/**
 * Creates Rooms.
 * @param {string} room_name - Room name.
 * @returns {string} Room ID from database.
 */
export async function getRoom(room_name) {
    try {
        const [ rows ] = await pool.query(`
            SELECT * FROM Rooms
            WHERE roomName = ?
        `, [room_name]);

        return rows[0].roomID;

    } catch (error) {
        throw new Error(error);
    }
}

/* --------------------------------------------------------*/

/**
 * Create and save user messages.
 * @param {string} socketID - Socket ID.
 * @param {string} room_name - Room name.
 * @param {string} msg - User messages.
 * @returns {none}
 */
export async function createMessages(socketID, room_name, msg) {
    try {
        const roomID = await getRoom(room_name);
        await pool.query(`
            INSERT INTO Messages (content, socketID_fk, roomID_fk)
            VALUES (?, ?, ?)
        `, [msg, socketID, roomID]);

        return;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Get messages saved in database.
 * @param {string} room - Room name.
 * @returns {array} User messages stored in array of objects.
 */
export async function getMessages(room) {
    const roomID = await getRoom(room);
    try {
        const [ rows ] = await pool.query(`
            SELECT userID, content, userName, roomName, socketID, created_at FROM Messages
            INNER JOIN Rooms
            ON Messages.roomID_fk = Rooms.roomID
            INNER JOIN Users
            ON Messages.socketID_fk = Users.socketID
            WHERE roomID_fk = ?
            ORDER BY created_at
        `, [roomID]);

        return rows;

    } catch (error) {
        throw new Error(error);
    }
}
