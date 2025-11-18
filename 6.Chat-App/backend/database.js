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
 * User
 */
export async function createUsers(id, user) {
    try {
        await pool.query(`
            INSERT INTO Users (userID, userName)
            VALUES (?, ?)
        `, [id, user]);

        return await getUser(id);

    } catch (error) {
        console.log(error);
    }
}

export async function getUser(id) {
    try {
        const [ rows ] = await pool.query(`
            SELECT * FROM Users
            WHERE userID = ?
        `, [id]);

        return rows[0];

    } catch (error) {
        console.log(error);
    }
}

/* --------------------------------------------------------*/

/**
 * Room
 */
export async function getRoom(room_name) {
    try {
        const [ rows ] = await pool.query(`
            SELECT * FROM Rooms
            WHERE roomName = ?
        `, [room_name]);

        return await rows[0].roomID;

    } catch (error) {
        console.log(error);
    }
}

/* --------------------------------------------------------*/

/**
 * Create and Save user messages.
 * @param {msg, room, user} x - Messages, Room ID and User ID.
 * @returns {promise} Saves messages, room and user ID.
 */
export async function createMessages(userID, room_name, msg) {
    try {
        const roomID = await getRoom(room_name);
        await pool.query(`
            INSERT INTO Messages (content, userID_fk, roomID_fk)
            VALUES (?, ?, ?)
        `, [msg, userID, roomID]);

    } catch (error) {
        console.log(error);
    }
}

/**
 * Get messages saved in database.
 * @returns {promise} messages saved.
 */
export async function getMessages(userID, room) {
    const roomID = await getRoom(room);
    try {
        const [ rows ] = await pool.query(`
            SELECT content, userName, roomName, created_at FROM Messages
            INNER JOIN Rooms
            ON Messages.roomID_fk = Rooms.roomID
            INNER JOIN Users
            ON Messages.userID_fk = Users.userID
            WHERE roomID_fk = ?
            ORDER BY roomName;
        `, [roomID, userID]);

        console.log(rows);

        console.log(Object.values(rows));
        return rows;

    } catch (error) {
        console.log(error);
    }
}
