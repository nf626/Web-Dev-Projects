const board = Array(9).fill(""); // Array to simulate game board.
let gameState = true; // game state
// Markers for game
const comMarker = `<img class="js-com" src="./images/holberton_logo.svg" alt="Blue HB Logo" width="100" height="50" style="filter: invert(27%) sepia(91%) saturate(2204%) hue-rotate(202deg) brightness(98%) contrast(93%);">`;
const playerMarker = `<img class="js-player" src="./images/holberton_logo.svg" alt="Red HB Logo" width="100" height="50">`;

// Win condition for game
const winCondition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

/**
 * Computer movesets.
 * @returns Computer marker placed on game board.
 */
function comMove() {
    // Map new array copy and filter 'null'
    const emptyCells = board
        .map((value, index) => value === "" ? index : null)
        .filter(index => index !== null);
    
    if (emptyCells.length === 0) return; // No moves left

    // CPU to win
    for (const [a, b, c] of winCondition) {
        if (board[a] === "C" && board[b] === "C" && board[c] === "") return locatePos(c);
        if (board[a] === "C" && board[c] === "C" && board[b] === "") return locatePos(b);
        if (board[b] === "C" && board[c] === "C" && board[a] === "") return locatePos(a);
    }

    // Block player
    for (const [a, b, c] of winCondition) {
        if (board[a] === "P" && board[b] === "P" && board[c] === "") return locatePos(c);
        if (board[a] === "P" && board[c] === "P" && board[b] === "") return locatePos(b);
        if (board[b] === "P" && board[c] === "P" && board[a] === "") return locatePos(a);
    }

    // Else random
    const randIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    locatePos(randIndex);

    /**
     * Helper function to locate position of game board.
     * @param {string} i - Computer marker to be placed.
     */
    function locatePos(i) {
        board[i] = "C";
        const com = document.querySelector(`#js-cell-${i}`);
        com.innerHTML = comMarker;
        com.style.borderColor = "blue";
    }
}

/**
 * Checks if Player or Computer wins. 
 * @returns Results of the game.
 */
function checkWinner() {
    for (const condition of winCondition) {
        const [a, b, c] = condition;
        const animate_A = document.querySelector(`#js-cell-${a}`);
        const animate_B = document.querySelector(`#js-cell-${b}`);
        const animate_C = document.querySelector(`#js-cell-${c}`);

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameState = false;

            // Player wins
            if (board[a] === "P") {
                // Player Animation
                const player_A = animate_A.querySelector(".js-player");
                const player_B = animate_B.querySelector(".js-player");
                const player_C = animate_C.querySelector(".js-player");
                if (player_A && player_B && player_C) {
                    player_A.classList.add("spin-bounce");
                    player_B.classList.add("spin-bounce");
                    player_C.classList.add("spin-bounce");
                }
                return "Win";
            } else {
                // Com wins and Com Animation
                const com_A = animate_A.querySelector(".js-com");
                const com_B = animate_B.querySelector(".js-com");
                const com_C = animate_C.querySelector(".js-com");
                if (com_A && com_B && com_C) {
                    com_A.classList.add("spin-bounce");
                    com_B.classList.add("spin-bounce");
                    com_C.classList.add("spin-bounce");
                }
                return "Lose";
            }
        }
    }

    // Drawn game
    if (!board.includes("")) {
        gameState = false;
        document.querySelectorAll(".js-player").forEach(player =>
            player.classList.add("fall-player")
        );
        document.querySelectorAll(".js-com").forEach(com =>
            com.classList.add("fall-com")
        );
        return "Draw";
    }

    return null;
}

/**
 * Player movesets.
 * @param {string} playerIndex - Player marker to place in board.
 * @returns none.
 */
function gameplay(playerIndex) {
    let result = "";

    if (!gameState || board[playerIndex] !== "") return;

    // PLayer move
    board[playerIndex] = "P";
    const player = document.querySelector(`#js-cell-${playerIndex}`);
    player.innerHTML = playerMarker;
    player.style.borderColor = "red";
    
    result = checkWinner();
    
    // Display results
    if (result === "Win") {
        document.querySelector(".result").innerHTML = "🎉 You Win!";
        document.querySelector(".background").style.boxShadow =  "0 0 15px red";
    } else if (result === "Draw") {
        document.querySelector(".result").innerHTML = "😐 It's a Draw!";
    }

    if (gameState) {
        // Com results
        comMove();
        result = checkWinner();
        if (result === "Lose") {
            document.querySelector(".result").innerHTML = "🤖 Computer Wins!";
            document.querySelector(".background").style.boxShadow =  "0 0 15px blue";
        }
    }
}

// Reset game
const resetGame = document.querySelector(".js-reset-button")
    .addEventListener("click", () => {
        for (let i = 0; i < board.length; i++) {
                board[i] = "";
                document.querySelector(`#js-cell-${i}`).innerHTML = "";
                document.querySelector(`#js-cell-${i}`).style.borderColor = "black";
            }
        gameState = true;
        document.querySelector(".result").innerHTML = "";
        document.querySelector(".background").style.boxShadow =  "";


        const com = document.querySelector("#js-com");
        if (com) com.classList.remove("spin-bounce");

        const player = document.querySelector("#js-player");
        if (player) player.classList.remove("spin-bounce");
    });
