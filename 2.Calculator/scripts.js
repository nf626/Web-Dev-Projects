const inputArray = []; // Store numbers and operators in an array
const calcArray = []; // Store numbers in an array
const opArray = ["\u00D7", "\u00F7", "\u2212", "\u002B"]; // Checks for operators

let sumValue = null;
let calcResetState = false; // calculator state control.

// targeted variables - DOM
const input_screen = document.querySelector(".js-input-screen");
const calc_screen = document.querySelector(".js-calc-screen");

/**
 * A utility function to restrict the size of the number.
 * @param {string} value - Number inputted on screen.
 * @param {number} limit - Limit the size of the number.
 * @returns {string} Restricted value length.
 */
function formatScreen(value, limit = 11) {
   let str = value.toString();

    // If it's too long, switch to exponential
    if (str.length > limit) {
        if (!isNaN(value)) {
            return Number(value).toExponential(limit - 6); // "1.234567e+12"
        } else {
            return str.slice(0, limit); // Fallback (operators etc.)
        }
    }
    return str;
}

/**
 * A function to clear inputs on screen and reset.
 * @param {string} clearValue - String to match clear conditions.
 */
function clearScreen(clearValue) {
    if (calcResetState === false) {
        // Clear entry
        if (clearValue === 'CE') {
            inputArray.pop();
            calc_screen.value = "";
            calcArray.length = 0;
        }
        // Clear everything
        else if (clearValue === 'C') {
            inputArray.length = 0;
            input_screen.value = "";
            calcArray.length = 0;
            calc_screen.value = inputArray.join("");
        }
        // Clear one digit
        else if (clearValue === 'backspace') {
            inputArray.pop();
            calcArray.pop();
            calc_screen.value = calcArray.join("");
        }
    } else {
        // Calculator resets after math calculated
        inputArray.length = 0;
        calcArray.length = 0;

        input_screen.value = "";
        calc_screen.value = "";

        calcResetState = false;
    }
}

/**
 * Stores operators.
 * @param {string} operator - The operator to form math equation.
 */
function appendOperator(operator) {
    // Clear screen for next number
    calcArray.some((operator) => {
        if (operator) {
            calc_screen.value = "";
            calcArray.length = 0;
        }
    });

    inputArray.push(operator); // Store operators into inputArray

    // Change operators without numbers and only one operator
    if (inputArray[0] === operator && inputArray.length < 2) {
        input_screen.value = inputArray.join("");
        inputArray.pop();
    } else {
        input_screen.value = inputArray.join("");
    }

    // Check operators are next to each other
    for (let i = 0; i < inputArray.length; i++) {
        let prev = inputArray[i - 1];
        if (opArray.includes(prev)) {
            inputArray.splice(i - 1, 1);
            input_screen.value = inputArray.join("");
        }
    }
}

/**
 * Stores numbers.
 * @param {string} number 
 */
function appendNumber(number) {
    if (calcResetState === true) {
        input_screen.value = "";
        calcResetState = false;
    } else {
        calcResetState = false;
    }

    // Handle negative numbers
    if (inputArray[0] === "-") {
        inputArray.push(number);
        
        calcArray.push(number);
        calc_screen.value = formatScreen(calcArray.join(""));
    } else {
        inputArray.push(number); // Store numbers into inputArray

        calcArray.push(number); // Store numbers into calcArray
        calc_screen.value = formatScreen(calcArray.join("")); // Clear calculator screen after input
    }

    // Clear input screen
    if (calcArray[0] === number && inputArray.length < 2) {
        input_screen.value = "";
    }
}

/**
 * A function to change integer to percent. eg. 10% = 0.1.
 * @returns none
 */
function percentage() {
    if (inputArray.length === 0 && !sumValue) return;

    // Find last operator
    let lastOpIndex = -1;
    let lastOp = null;
    for (let i = inputArray.length - 1; i >= 0; i--) {
        if (opArray.includes(inputArray[i])) {
            lastOpIndex = i;
            lastOp = inputArray[i];
            break;
        }
    }

    // Extract last number
    let lastNumberArr = inputArray.slice(lastOpIndex + 1);
    let lastNumberStr = lastNumberArr.join("");
    if (!lastNumberStr) return;

    let lastNumber = parseFloat(lastNumberStr);

    // Case 1: no operator → just turn number into percentage
    if (lastOpIndex === -1) {
        lastNumber = lastNumber / 100;
    } else {
        // Get the base (number before the operator)
        let baseArr = inputArray.slice(0, lastOpIndex);
        let baseStr = baseArr.join("");
        let base = parseFloat(baseStr);

        switch (lastOp) {
            case "\u002B": // +
            case "\u2212": // −
                lastNumber = (base * lastNumber) / 100;
                break;
            case "\u00D7": // ×
            case "\u00F7": // ÷
                lastNumber = lastNumber / 100;
                break;
        }
    }

    // Replace last number in inputArray
    inputArray.splice(
        lastOpIndex + 1,
        inputArray.length - (lastOpIndex + 1),
        ...lastNumber.toString().split("")
    );

    // Update calcArray
    calcArray.splice(0, calcArray.length, ...lastNumber.toString().split(""));

    // Update displays
    input_screen.value = inputArray.join("");
    calc_screen.value = calcArray.join("");

    calcResetState = false;
}

/**
 * A function to change value into negative or positive.
 * @returns none
 */
function plus_minus() {
    // nothing typed yet → start with a negative number
    if (inputArray.length === 0) {
        inputArray.push("-");
        calcArray.push("-");
        input_screen.value = inputArray.join("");
        calc_screen.value = calcArray.join("");
        return;
    }

    // Find last operator index
    let lastOpIndex = -1;
    for (let i = inputArray.length - 1; i >= 0; i--) {
        if (opArray.includes(inputArray[i])) {
            lastOpIndex = i;
            break;
        }
    }

    // Extract last number
    let lastNumberArr = inputArray.slice(lastOpIndex + 1);
    let lastNumberStr = lastNumberArr.join("");

    // If nothing after the operator, insert a negative sign
    if (!lastNumberStr) {
        inputArray.splice(lastOpIndex + 1, 0, "-");
        calcArray.splice(0, calcArray.length, "-");
    } else {
        // Toggle sign of last number
        if (lastNumberStr.startsWith("-")) {
            lastNumberStr = lastNumberStr.slice(1); // Remove minus
        } else {
            lastNumberStr = "-" + lastNumberStr; // Add minus
        }

        // Replace in inputArray
        inputArray.splice(
            lastOpIndex + 1,
            inputArray.length - (lastOpIndex + 1),
            ...lastNumberStr.split("")
        );

        // Update calcArray
        calcArray.splice(0, calcArray.length, ...lastNumberStr.split(""));
    }

    // Update display
    input_screen.value = inputArray.join("");
    calc_screen.value = calcArray.join("");
}

/**
 * A function to turn interger to decimal.
 * @param {string} dec - Decimal symbol.
 */
function decimal(dec) {
    // Find last operator index
    let lastOpIndex = -1;
    for (let i = inputArray.length - 1; i >= 0; i--) {
        if (opArray.includes(inputArray[i])) {
            lastOpIndex = i;
            break;
        }
    }

    // Extract last number
    let lastNumberArr = inputArray.slice(lastOpIndex + 1);
    let lastNumberStr = lastNumberArr.join("");

    // No number yet or directly after operator
    if (!lastNumberStr) {
        inputArray.push("0", dec);
        calcArray.push("0", dec);
    }
    // Prevent multiple decimals in the same number
    else if (!lastNumberStr.includes(dec)) {
        inputArray.push(dec);
        calcArray.push(dec);
    }

    // Update display
    input_screen.value = inputArray.join("");
    calc_screen.value = calcArray.join("");
}

/**
 * Calculates the sum total.
 * @param {string} equalOp - Equal symbol.
 * @returns none
 * @throws {Error} If expression is not valid.
 */
function sum(equalOp) {
    try {
        if (inputArray.length === 0) {
            input_screen.value = "";
            calc_screen.value = "";
            return;
        }

        // Copy expression
        const totalArray = Array.from(inputArray);

        for (let i = 0; i < totalArray.length; i++) {
            let current = totalArray.at(i);
            let next = totalArray.at(i + 1);

            // Handle minus and negative eg. 1 - -2 = 1 + 2
            if (current === "\u2212" && next === "-") {
                totalArray.splice(i, 2, "+");
            }
        }

        // Convert operators to JS symbols
        let totalString = totalArray.join("")
            .replaceAll("\u00D7", "*")  // ×
            .replaceAll("\u00F7", "/")  // ÷
            .replaceAll("\u2212", "-")  // −
            .replaceAll("\u002B", "+"); // +

        // If last entry is operator, ignore it
        if (opArray.includes(inputArray[inputArray.length - 1])) {
            totalString = totalString.slice(0, -1);
            inputArray.pop();
        }

        // Prevent eval errors (e.g. empty string)
        if (!totalString) {
            input_screen.value = "";
            calc_screen.value = "";
            return;
        }

        // Evaluate result
        const total = eval(totalString);
        const totalSum = parseFloat(total);

        // Update screens
        inputArray.push(equalOp);
        input_screen.value = inputArray.join("");
        calc_screen.value = formatScreen(totalSum);

        // Save result
        sumValue = totalSum;

        // Reset for new expression
        inputArray.length = 0;
        calcArray.length = 0;

        calcResetState = true;
    } catch (error) {
        calc_screen.value = "ERROR";
        throw new Error(error);
    }
}
