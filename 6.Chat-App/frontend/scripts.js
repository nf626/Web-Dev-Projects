import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { timeStamp } from "./functions.js";

// Connect to server
const socket = io("http://localhost:8000/", {
    autoConnect: false,
});

// Username container
const userContainer = document.querySelector(".name-container");
// Username + button
const userName = document.getElementById("js-user");
const cdButton = document.getElementById("js-cd-button");
// Message container
const title = document.getElementById("js-message-title");
const sysMessage = document.querySelector(".systemMessage");
const listMessages = document.getElementById("js-list-messages");
// User enters text + button
const userInput = document.getElementById("js-message");
const sendButton = document.getElementById("js-sendButton");
// Select Room
const roomSelect = document.querySelectorAll(".selectRoom");
// Leave room button
const leaveBtn = document.getElementById("leaveButton");
// Users online/offline list
const listUsers = document.getElementById("js-online");

userName.value = "";

// User Name
cdButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Connect
    if (cdButton.innerText === "Connect") {
        if (!userName.value) {
            console.log("No Username");
        } else {
            socket.connect();

            socket.emit("list users", userName.value);
            socket.emit("join room", "public");

            if (userContainer && userName) {
                userContainer.removeChild(userName);
                
                const header = document.createElement("h3");
                header.innerText = `Welcome ${userName.value}`;
                userContainer.prepend(header);
            }
        }
    }
    // Disconnect
    else if (cdButton.innerText === "Disconnect") {
        socket.disconnect();
        window.location.reload(true);
    }
});

// Socket connected event
socket.on("connect", async () => {
    cdButton.innerText = "Disconnect";
    cdButton.style.backgroundColor = "rgba(237, 0, 0, 1)";
    cdButton.style.color = "white";
    return;
})

// Socket disconnect event
socket.on("disconnect", () => {
    cdButton.innerText = "Connect";
    cdButton.style.backgroundColor = "";
    cdButton.style.color = "";

    window.location.reload(true);
    return;
});

// Send message
sendButton.addEventListener("click", (event) => {
    event.preventDefault(); // Stops the browser's default action associated with that event

    if (userInput.value && socket.connected) {
        socket.emit("chat message", userInput.value, userName.value); // Send message to server-side

        // New HTML list - message
        const item = document.createElement("li");
        item.innerHTML = `<p>${userInput.value}</p><div>${userName.value}</div>`;
        listMessages.appendChild(item);
        item.classList.add("sendMessage");

        const time = document.createElement("p");
        time.innerText = timeStamp();
        listMessages.appendChild(time);
        time.classList.add("timeStamp");

        userInput.value = "";
    }
});

// Listens for messages
socket.on("chat message", (msg, otherUser) => {
    // Create messages
    const item = document.createElement("li");
    item.innerHTML = `<div>${otherUser}</div><p>${msg}</p>`;
    listMessages.appendChild(item);
    item.classList.add("receiveMessage");

    const time = document.createElement("p");
    time.innerText = timeStamp();
    listMessages.appendChild(time);
    time.classList.add("timeStamp");
    time.style.alignSelf = "flex-start";
    time.style.textAlign = "start";

    window.scrollTo(0, document.body.scrollHeight); // Go to new message
});

// Public User list
socket.on("list users", (obj) => {
    listUsers.innerHTML = "";

    for (const key in obj) {
        if (key === socket.id) continue; // Show only other users

        const item = document.createElement("li");
        item.innerText = obj[key];
        item.classList.add("user-list");
        listUsers.appendChild(item);
    }
});

// Select Room
roomSelect.forEach((btn) => {
   btn.addEventListener("click", (event) => {
        event.preventDefault();

        if (socket.connected) {
            const roomName = btn.innerText;
            title.innerText = roomName;
            socket.emit("join room", roomName);

            roomSelect.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            leaveBtn.style.opacity = 1;
        }
    });
});

// Room User list
socket.on("room users", (users) => {
    listUsers.innerHTML = "";

    users.forEach((user) => {
        const item = document.createElement("li");
        item.innerText = user;
        item.classList.add("user-list");
        listUsers.appendChild(item);
    });
});

// Leave Room
leaveBtn.addEventListener("click", (event) => {
    event.preventDefault();

    roomSelect.forEach(btn => {
        if (socket.connected && btn.classList.contains("active")) {
            const roomName = btn.innerText;
            socket.emit("leave room", roomName);
            btn.classList.remove("active");
            title.innerText = "Public";
            leaveBtn.style.opacity = 0;
        }
    });
});

// System messages eg. joining room.
socket.on("system message", (msg) => {
    sysMessage.innerText = msg;
});
