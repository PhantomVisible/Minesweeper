var board = [];
var rows = 8;
var cols = 8;

var minesCount = 5;
var minesLocation = [];

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function() {
    startGame();
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);

    for (let r = 0; r < rows; r++ ) {
        let row = [];
        for (let c = 0; c < cols; c++ ) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile)
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
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {

    let tile = this;
    if (flagEnabled) {
        if(tile.innerText == "") {
            tile.innerText = "🚩"
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
    }
}