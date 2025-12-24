
var board = [];

var minesLocation = [];

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function() {
    loadDifficulty("medium");

    document.getElementById("difficulty").addEventListener("change", function () {
        loadDifficulty(this.value);
    });

    // Add restart button listener here
    document.getElementById("restart-button").addEventListener("click", function() {
        document.getElementById("game-over-overlay").style.display = "none";
        resetGame();
    });

    const overlay = document.getElementById("game-over-overlay");
    const overlayText = document.getElementById("overlay-text");
    const restartBtn = document.getElementById("restart-button");

    overlayText.innerText = "Good Luck!";
    overlay.style.display = "flex";

    setTimeout(() => {
        overlay.style.display = "none";
    }, 2000);

    restartBtn.addEventListener("click", () => {
        overlay.style.display = "none";
        resetGame();
    });

    document.getElementById("board").classList.add("shake");
    setTimeout(() => {
        document.getElementById("board").classList.remove("shake");
    }, 300);

}

const difficultySettings = {
    easy: { rows: 6, cols: 6, minesCount: 4 },
    medium: { rows: 8, cols: 8, minesCount: 10 },
    hard: { rows: 12, cols: 12, minesCount: 25 }
}

function loadDifficulty(level) {
    rows = difficultySettings[level].rows;
    cols = difficultySettings[level].cols;
    minesCount = difficultySettings[level].minesCount;

    resetGame();
}

function resetGame() {
    // Reset game state
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    gameOver = false;
    flagEnabled = false;

    // Reset UI
    document.getElementById("board").innerHTML = "";
    document.getElementById("flag-button").style.backgroundColor = "lightgray";
    document.getElementById("mines-count").innerText = minesCount;

    document.getElementById("board").style.gridTemplateColumns =
        `repeat(${cols}, var(--tile-size))`;

    startGame();
}

function setMines() {
//    minesLocation.push("2-2");
//    minesLocation.push("2-3");
//    minesLocation.push("5-6");
//    minesLocation.push("3-4");
//    minesLocation.push("1-1");

    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let id =  r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines()

    for (let r = 0; r < rows; r++ ) {
        let row = [];
        for (let c = 0; c < cols; c++ ) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
            tile.addEventListener("contextmenu", rightClickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function setFlag(){
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "gray";
    }
}

function rightClickTile(e) {
    e.preventDefault(); // stop browser context menu

    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    if (this.innerText === "") {
        this.innerText = "🚩";
    } else if (this.innerText === "🚩") {
        this.innerText = "";
    }
}

function clickTile() {
    if(gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;

    if (flagEnabled) {
        if(tile.innerText === "") {
            tile.innerText = "🚩"
        }
        else if (tile.innerText === "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (this.innerText === "🚩") {
        return;
    }

    if(minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        //alert("GAME OVER");

        setTimeout(() => {
            const overlay = document.getElementById("game-over-overlay");
            const overlayText = document.getElementById("overlay-text");
            const boomSound = document.getElementById("boom-sound");

            overlayText.innerText = "BOOM! Game Over";
            overlay.style.display = "flex";

            boomSound.currentTime = 0;
            boomSound.play();
        }, 50);
 // 50ms delay

        showGameOver();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMines(r, c);
}

function showGameOver() {
    document.getElementById("game-over-overlay").style.display = "flex";
}

function revealMines() {
    for(let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // Top 3 tiles
    minesFound += checkTile(r-1, c-1);   // Top left
    minesFound += checkTile(r-1, c);        // Top
    minesFound += checkTile(r-1, c+1);   // Top right

    // Left and right tiles
    minesFound += checkTile(r, c-1);        // Left
    minesFound += checkTile(r, c+1);        // Right

    // Bottom 3 tiles
    minesFound += checkTile(r+1, c-1);  // Bottom left
    minesFound += checkTile(r+1, c);       // Bottom
    minesFound += checkTile(r+1, c+1);  // Bottom right

    if(minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // Top 3
        checkMines(r-1, c-1);   // Top left
        checkMines(r-1, c);        // Top
        checkMines(r-1, c+1);   // Top right

        //Left and right
        checkMines(r, c-1);       // Left
        checkMines(r, c+1);       // Right

        // Bottom 3
        checkMines(r+1, c-1);  // Bottom left
        checkMines(r+1, c);       // Bottom
        checkMines(r+1, c+1);  // Bottom right
    }

    if (board[r][c].innerText === "🚩") {
        return;
    }

    if(tilesClicked == rows * cols - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        alert("Congratulations!");
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}