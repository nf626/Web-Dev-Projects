--@block
-- MYSQL
CREATE DATABASE IF NOT EXISTS chat_app;
USE chat_app;

--@block
-- User
CREATE TABLE IF NOT EXISTS Users (
    userID VARCHAR(40) NOT NULL,
    userName VARCHAR(20) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (userID)
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
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    userID_fk VARCHAR(40),
    roomID_fk INT,
    PRIMARY KEY (messageID),
    FOREIGN KEY (userID_fk) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (roomID_fk) REFERENCES Rooms(roomID) ON DELETE CASCADE
);

--@block
-- Example
INSERT INTO Users (userID, userName)
VALUES
    (1, 'John'),
    (2, 'Alan'),
    (3, 'Betty');

INSERT INTO Messages (messageID, content, userID_fk, roomID_fk)
VALUES
    (1, "test 1", 1, 1),
    (2, "test 2", 2, 2),
    (3, "test 2", 3, 1),
    (4, "test 3", 3, 2),
    (5, "test 3", 2, 3),
    (6, "test 1", 1, 3);

SELECT * FROM Messages INNER JOIN Room
ON Messages.roomID_fk = Room.roomID
WHERE roomID_fk = 2;
