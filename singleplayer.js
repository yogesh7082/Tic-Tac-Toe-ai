var playerName = localStorage.getItem("Player");
var startingMove = localStorage.getItem("StartingMove");

$("#status-text").text(playerName + "'s Turn!");
$(".player-score").text(playerName + ": --");

function addScores(){
    var xScore = localStorage.getItem("xScore");
    var oScore = localStorage.getItem("oScore");
    var playerName = localStorage.getItem("Player");
    var numberOfDraws = localStorage.getItem("singleplayerDraws");

    var score = {
        "Player1": playerName,
        "Score1": player == 'X' ? xScore : oScore,
        "Player2": "Computer",
        "Score2": player == 'X' ? oScore : xScore,
        "Draws": numberOfDraws
    };
    localStorage.setItem("score", JSON.stringify(score));

    var allScores = JSON.parse(localStorage.getItem("allScores"));
    allScores.push(score);

    localStorage.setItem("allScores", JSON.stringify(allScores));
};

//game setup
var board = new Array(9).fill(null);
let player = startingMove == 'X' ? 'X' : 'O';
let computer = player == 'X' ? 'O' : 'X';     //maximizing player
let currentPlayer = startingMove;        //since computer has already made the first move

var xScore = 0, oScore = 0, numberOfDraws = 0;
localStorage.setItem("xScore", xScore);
localStorage.setItem("oScore", oScore);
localStorage.setItem("singleplayerDraws", numberOfDraws);

const winCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let scoresForX = {
    X: 1,
    O: -1,
    draw: 0
};

let scoresForO = {
    X: -1,
    O: 1,
    draw: 0
};


function findWinner(){
    for(var i = 0; i < 8; i++){
        const [a, b, c] = winCombination[i];

        if(board[a] && (board[a] === board[b] && board[b] === board[c])){
            return board[a];
        }
    }
    if(board.indexOf(null) === -1){
        return "draw";
    }
    return null;
}

function bestMove(){
     // computer with X
    let bestScore = -Infinity;
    let move;

    for(let i = 0; i < 9; i++){
        if(board[i] === null){
            board[i] = computer;                   // assign a move
            let score = minimax(board, 0, false);  // check bestscore for that move
            board[i] = null;                       // clear move

            if(score > bestScore){      // if score is better then consider the move a good move
                bestScore = score;
                move = i;
            }
        }
    }
    board[move] = computer;
    $("#box" + move).text(computer);
    $("#box" + move).prop('disabled', true);
    $("#box" + move).addClass('disabled');
    currentPlayer = player;
}

function minimax(board, depth, isMaximizing){
    let winner = findWinner();

    if(winner !== null){
        return startingMove === 'O' ? scoresForX[winner] : scoresForO[winner];
    }

    if(isMaximizing){
        let bestScore = -Infinity;

        for(let i = 0; i < 9; i++){
            if(board[i] === null){
                board[i] = computer;
                let score = minimax(board, depth+1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }
    else{
        let bestScore = Infinity;

        for(let i = 0; i < 9; i++){
            if(board[i] === null){
                board[i] = player;
                let score = minimax(board, depth+1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}


if(startingMove === 'O'){ // player plays with O (computer = 'X')
    bestMove();

    const boxes = document.querySelectorAll(".box");
    boxes.forEach((b, i) => {
        b.addEventListener("click", function (){
            console.log(i);

            const boxId = "#box" + i;
            $(boxId).text(currentPlayer);
            $("#status-text").text("Make next move!");

            board[i] = player;              //player makes a move on board
            currentPlayer = computer;       // currentPlayer is switched to computer for it to perform bestMove

            bestMove();

            winner = findWinner();

            if(winner === 'X'){
                $("#status-text").text((player == 'X' ? playerName : "Compter") + " Wins!");
                xScore += 10;
                localStorage.setItem("xScore", xScore);
                addScores();
            }

            if(winner === 'O'){
                $("#status-text").text((player == 'O' ? playerName : "Compter") + " Wins!");
                oScore += 10;
                localStorage.setItem("oScore", oScore);
                addScores();
            }

            if(winner === "draw"){
                $("#status-text").text("It's a Draw!");
                numberOfDraws += 1;
                localStorage.setItem("singleplayerDraws", numberOfDraws);
                addScores();
            }

            $(".player-score").text(playerName + ": " + (player === 'X' ? xScore : oScore));
            $(".computer-score").text("Computer: " + (computer === 'O' ? oScore : xScore) );
            $(".draw-score").text("Draw: " + numberOfDraws);

            $(boxId).prop('disabled', true);
            $(boxId).addClass('disabled');
        });
    }, { once: true });

}

if(startingMove === 'X'){  // player starts with X (computer = 'O')

    const boxes = document.querySelectorAll(".box");
    boxes.forEach((b, i) => {
        b.addEventListener("click", function (){
            console.log(i);

            const boxId = "#box" + i;
            $(boxId).text(currentPlayer);
            $("#status-text").text("Make next move!");

            board[i] = player;             //player makes a move on board
            currentPlayer = computer;      // currentPlayer is switched to computer for it to perform bestMove

            bestMove();

            winner = findWinner();

            if(winner === 'X'){
                $("#status-text").text((player == 'X' ? playerName : "Compter") + " Wins!");
                xScore += 10;
                localStorage.setItem("xScore", xScore);
                removeButtonClick();
                addScores();
            }

            if(winner === 'O'){
                $("#status-text").text((player == 'O' ? playerName : "Compter") + " Wins!");
                oScore += 10;
                localStorage.setItem("oScore", oScore);
                removeButtonClick();
                addScores();
            }

            if(winner === "draw"){
                $("#status-text").text("It's a Draw!");
                numberOfDraws += 1;
                localStorage.setItem("singleplayerDraws", numberOfDraws);
                removeButtonClick();
                addScores();
            }

            $(".player-score").text(playerName + ": " + (player === 'X' ? xScore : oScore));
            $(".computer-score").text("Computer: " + (computer === 'O' ? oScore : xScore) );
            $(".draw-score").text("Draw: " + numberOfDraws);

            $(boxId).prop('disabled', true);
            $(boxId).addClass('disabled');
        });
    }, { once: true });

}

function removeButtonClick(){
    $(".box").prop('disabled', true);
    $(".box").addClass('disabled');
}
