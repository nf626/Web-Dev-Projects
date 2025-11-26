import { listMessages } from "./scripts.js";

/**
 * Helper function to add leading zero.
 * @param {string} num - Time.
 * @returns {string} New structured time.
 */
export function addZeros(num) {
	return (num < 10) ? "0" + num : num;
}

/**
 * Get time when message was sent.
 * @returns {string} Displays time for message sent.
 */
export function timeStamp() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const amPm = (hours < 12) ? "am" : "pm";
    const hour_12 = hours % 12 || 12; // Convert to 12-Hour format

    return `${addZeros(hour_12)}:${addZeros(minutes)}:${addZeros(seconds)} ${amPm}`;
}

/**
 * Creates HTML structure for user messages.
 * @param {string} msg - Text Messages from User.
 * @param {string} userName - Username.
 * @param {string} timeStamp - Time sent.
 */
export function createUserMessages(msg, userName, timeStamp) {
    const item = document.createElement("li");
    item.innerHTML = `<p>${msg}</p><div>${userName}</div>`;
    listMessages.appendChild(item);
    item.classList.add("sendMessage");

    const time = document.createElement("p");
    time.innerText = timeStamp;
    listMessages.appendChild(time);
    time.classList.add("timeStamp");
}

/**
 * Creates HTML structure for other user messages.
 * @param {string} msg - Text Messages from User.
 * @param {string} userName - Username.
 * @param {string} timeStamp - Time sent.
 */
export function createOtherMessages(msg, userName, timeStamp) {
    const item = document.createElement("li");
    item.innerHTML = `<div>${userName}</div><p>${msg}</p>`;
    listMessages.appendChild(item);
    item.classList.add("receiveMessage");

    const time = document.createElement("p");
    time.innerText = timeStamp;
    listMessages.appendChild(time);
    time.classList.add("timeStamp");
    time.style.alignSelf = "flex-start";
    time.style.textAlign = "start";
}
