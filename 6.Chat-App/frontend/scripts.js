import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const socket = io(`http://localhost:8000/`);

const userInput = document.getElementById("js-input");
const messages = document.querySelector(".text-container");
const sendButton = document.getElementById("js-sendButton");

sendButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (userInput.value) {
        socket.emit("chat message", userInput.value);
        userInput.value = "";
    }
});


socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    item.classList.add("hostMessage");
    window.scrollTo(0, document.body.scrollHeight);
});
