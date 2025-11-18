/**
 * Helper function to add leading zero.
 * @param {string} num - Time.
 * @returns New structured time.
 */
export function addZeros(num) {
	return (num < 10) ? "0" + num : num;
}

/**
 * Get time when message was sent.
 * @returns Time
 */
export function timeStamp() {
    // Date
    const date = new Date();
    // const localDate = date.toLocaleDateString(); // "01/11/25"

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const amPm = (hours < 12) ? "am" : "pm";
    const hour_12 = hours % 12 || 12; // Convert to 12-Hour format

    return `${addZeros(hour_12)}:${addZeros(minutes)}:${addZeros(seconds)} ${amPm}`;
}
