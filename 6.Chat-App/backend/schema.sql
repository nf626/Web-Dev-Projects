--@block
-- MYSQL
CREATE DATABASE IF NOT EXISTS chat_app;
USE chat_app;

--@block
-- User
CREATE TABLE IF NOT EXISTS Users (
    userID VARCHAR(40) NOT NULL,
    userName VARCHAR(20) NOT NULL,
    socketID VARCHAR(40) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (socketID)
);

--@block
-- Room
CREATE TABLE IF NOT EXISTS Rooms (
    roomID INT AUTO_INCREMENT NOT NULL,
    roomName VARCHAR(20) NOT NULL UNIQUE,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (roomID)
);

INSERT INTO Rooms (roomID, roomName)
VALUES
    (1, 'public'),
    (2, 'room 1'),
    (3, 'room 2'),
    (4, 'room 3');

--@block
-- Messages
CREATE TABLE IF NOT EXISTS Messages (
    messageID INT AUTO_INCREMENT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    socketID_fk VARCHAR(40),
    roomID_fk INT,
    PRIMARY KEY (messageID),
    FOREIGN KEY (socketID_fk) REFERENCES Users(socketID) ON DELETE CASCADE,
    FOREIGN KEY (roomID_fk) REFERENCES Rooms(roomID) ON DELETE CASCADE
);
