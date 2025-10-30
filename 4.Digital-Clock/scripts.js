const upButton = document.getElementById("js-up-arrow");
const downButton = document.getElementById("js-down-arrow");
const hoursButton = document.getElementById("js-hours-button");
const minutesButton = document.getElementById("js-minutes-button");
const secondsButton = document.getElementById("js-seconds-button");
const okButton = document.getElementById("js-ok-button");
const cancelButton = document.getElementById("js-cancel-button");
const alarm24 = document.getElementById("alarm_24Hour");
const alarm12 = document.getElementById("alarm_12Hour");
let holdInterval;

// Clock state
let alarmTime = "";
let alarmMode = false;
let hourCount = 0;
let minCount = 0;
let secCount = 0;
let selectField = ""; // Adjust hour, minute, second
let is24Hour = true;

// Enable clock
let intervalID = setInterval(runClock, 1000);
runClock();

/**
 * Clock setup.
 */
function runClock() {
	const dateTime = new Date();
	let hours = dateTime.getHours();
	const minutes = addZeros(dateTime.getMinutes());
	const seconds = addZeros(dateTime.getSeconds());
	const date = dateTime.toDateString();
	const amPm = (hours < 12) ? "am" : "pm";

	// store 24-hour version for comparison
	const current24 = `${addZeros(dateTime.getHours())}:${minutes}:${seconds}`;

	// display hours in 12-Hour format
	let displayHours = hours;
	if (!is24Hour) {
		displayHours = hours % 12 || 12;
		document.querySelector(".display-hour").innerHTML = "12H";
	} else {
		document.querySelector(".display-hour").innerHTML = "24H";
	}

	const time = `${addZeros(displayHours)}:${minutes}:${seconds}`;

	document.querySelector(".date-time").innerHTML = `${time} ${amPm}`;
	document.querySelector(".bottom-bar").innerHTML = date;

	if (alarmTime && alarmTime === current24) {
		alarmActive();
	}
}

/**
 * Helper function to add leading zero.
 * @param {string} num - Time.
 * @returns New structured time.
 */
function addZeros(num) {
	return (num < 10) ? "0" + num : num;
}

/**
 * Handles alarm when active.
 */
function alarmActive() {
	const screen = document.querySelector(".date-time");
	const alarmIcon = document.getElementById("alarm-pic");
	const clockBody = document.querySelector(".container");

	screen.innerHTML = "🔔 Beep Beep!";

	// Alarm animations
	clockBody.animate(
		[
			{ opacity: 1 },
			{ opacity: 0.5 },
			{ opacity: 1 }
		],
		{
			duration: 300,
			iterations: 3,
			easing: "ease-in-out"
		}
	);
	screen.animate(
		[
			{ opacity: 1 },
			{ opacity: 0.5 },
			{ opacity: 1 }
		],
		{
			duration: 300,
			iterations: 3,
			easing: "ease-in-out"
		}
	);
	alarmIcon.animate(
		[
			{ opacity: 1 },
			{ opacity: 0.2 },
			{ opacity: 1 }
		],
		{
			duration: 300,
			iterations: 3
		}
	);

	setTimeout(() => {
		alarmMode = false;
		selectField = "";
		alarmIcon.style.opacity = 0;
	}, 450);
}

/**
 * Handles Alarm mode.
 */
function alarm() {
	document.querySelector(".alarm-title").innerHTML = "ALARM";
	clearInterval(intervalID);
	alarmMode = true;
	updateAlarmScreen();
}

// Hours button
hoursButton.addEventListener("click", () => {
	if (alarmMode) selectField = "hours";
});

// Minutes button
minutesButton.addEventListener("click", () => {
	if (alarmMode) selectField = "minutes";
});

// Seconds button
secondsButton.addEventListener("click", () => {
	if (alarmMode) selectField = "seconds";
});

// Up button
upButton.addEventListener("mousedown", () => {
	if (alarmMode && selectField) {
		adjustTime(1);
		holdInterval = setInterval(() => adjustTime(1), 200);
	}
});
upButton.addEventListener("mouseup", () => clearInterval(holdInterval));
upButton.addEventListener("mouseleave", () => clearInterval(holdInterval));

// Down button
downButton.addEventListener("mousedown", () => {
	if (alarmMode && selectField) {
		adjustTime(-1);
		holdInterval = setInterval(() => adjustTime(-1), 200);
	}
});
downButton.addEventListener("mouseup", () => clearInterval(holdInterval));
downButton.addEventListener("mouseleave", () => clearInterval(holdInterval));

// OK button
okButton.addEventListener("click", () => {
	if (!alarmMode) return;

	const hours = addZeros(hourCount);
	const minutes = addZeros(minCount);
	const seconds = addZeros(secCount);
	document.querySelector(".alarm-title").innerHTML = "";

	// store in 24-hour format for matching
	alarmTime = `${hours}:${minutes}:${seconds}`;

	// Set alarm on
	const screen = document.querySelector(".date-time");
	screen.innerHTML = "Alarm Set";
	document.getElementById("alarm-pic").style.opacity = 1;

	alarmMode = false;
	clearInterval(intervalID);

	setTimeout(() => {
		intervalID = setInterval(runClock, 1000);
		runClock();
	}, 1000);
});

// Cancel button
cancelButton.addEventListener("click", () => {
	alarmMode = false;
	alarmTime = "";
	hourCount = 0;
	minCount = 0;
	secCount = 0;
	selectField = "";
	document.querySelector(".alarm-title").innerHTML = "";
	document.getElementById("alarm-pic").style.opacity = 0;
	
	const screen = document.querySelector(".date-time");
	clearInterval(intervalID);

	cancelButton.disabled = true;

	// Cancel alarm
	screen.style.fontSize = "1.5rem";
	screen.innerHTML = "Alarm Cancelled<br>--:--:--";

	setTimeout(() => {
		screen.style.fontSize = "";
		cancelButton.disabled = false;
		intervalID = setInterval(runClock, 1000);
		runClock();
	}, 1000);
});

/**
 * Function to change Hours, Minutes and Seconds using Arrow buttons.
 * @param {number} direction - Increment or Decrement time by one.
 * @returns none.
 */
function adjustTime(direction) {
	switch (selectField) {
		case "hours":
			hourCount = (hourCount + direction + 24) % 24;
			break;
		case "minutes":
			minCount = (minCount + direction + 60) % 60;
			break;
		case "seconds":
			secCount = (secCount + direction + 60) % 60;
			break;
		default:
			return;
	}
	updateAlarmScreen();
}

/**
 * Function to update time on screen.
 */
function updateAlarmScreen() {
	let hours = hourCount;
	const minutes = addZeros(minCount);
	const seconds = addZeros(secCount);
	const amPm = (hours < 12) ? "am" : "pm";

	if (!is24Hour) {
		hours = hours % 12 || 12;
	}

	const time = `${addZeros(hours)}:${minutes}:${seconds}`;
	document.querySelector(".date-time").innerHTML = `${time} ${amPm}`;
}

/**
 * Displays the time in 12-Hour Format.
 */
function button_12Hour() {
	if (!alarmMode) {
		is24Hour = false;
		clearInterval(intervalID);
		intervalID = setInterval(runClock, 1000);
		runClock();
	} else {
		is24Hour = false;
		clearInterval(intervalID);
		document.querySelector(".display-hour").innerHTML = "12H";
		updateAlarmScreen();
	}
}

/**
 * Displays the time in 24-Hour Format.
 */
function button_24Hour() {
	if (!alarmMode) {
		is24Hour = true;
		clearInterval(intervalID);
		intervalID = setInterval(runClock, 1000);
		runClock();
	} else {
		is24Hour = true;
		clearInterval(intervalID);
		document.querySelector(".display-hour").innerHTML = "24H";
		updateAlarmScreen();
	}
}
