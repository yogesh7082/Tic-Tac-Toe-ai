var player1 = localStorage.getItem("Player1");
var player2 = localStorage.getItem("Player2");

$("#status-text").text(player1 + "'s turn!");
$(".player1-score").text(player1 + ": --");
$(".player2-score").text(player2 + ": --");

function addScores(){
    var score1 = localStorage.getItem("PlayerScore1");
    var score2 = localStorage.getItem("PlayerScore2");
    var player1 = localStorage.getItem("Player1");
    var player2 = localStorage.getItem("Player2");
    var numberOfDraws = localStorage.getItem("Draws");

    var score = {
        "Player1": player1,
        "Score1": score1,
        "Player2": player2,
        "Score2": score2,
        "Draws": numberOfDraws
    };
    localStorage.setItem("score", JSON.stringify(score));

    var allScores = JSON.parse(localStorage.getItem("allScores"));
    allScores.push(score);

    localStorage.setItem("allScores", JSON.stringify(allScores));
};

class TicTacToe {
    constructor(){
        this.turn = "X";
        this.board = new Array(9).fill(null);
    }

    nextTurn(){
        if(this.turn == "X"){
            this.turn = "O";
        }
        else{
            this.turn = "X";
        }
        return this.turn;
    }

    makeMove(i){
        if(this.board[i] || !this.gameInProgress()){
            return;
        }
        else{
            this.board[i] = this.turn;
            this.nextTurn();
        }
    }

    //  0 1 2
    //  3 4 5
    //  6 7 8
    findWinner(){
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

        for(var i = 0; i < 8; i++){
            const [a, b, c] = winCombination[i];

            if(this.board[a] && (this.board[a] === this.board[b] && this.board[b] === this.board[c]))
                return this.board[a];
        }
        return null;
    }

    draw(){
        if(this.findWinner() == null && this.board.indexOf(null) == -1){
            console.log("Draw!");
            this.turn = null;
            return true;
        }
        return false;
    }

    gameInProgress(){
        if(this.findWinner() == null && this.draw() == false){
            return true;
        }else{
            return false;
        }
    }
}


let game = new TicTacToe();
var score1 = 0, score2 = 0, numberOfDraws = 0;
localStorage.setItem("PlayerScore1", score1);
localStorage.setItem("PlayerScore2", score2);
localStorage.setItem("Draws", numberOfDraws);

const boxes = document.querySelectorAll(".box");
boxes.forEach((b, i) => {
    b.addEventListener("click", () => {
        console.log(i);

        const tmp = "#box" + i;
        $(tmp).text(game.turn);
        $("#status-text").text("Make next turn!");

        game.makeMove(i);

        winner = game.findWinner();

        if(winner === 'X'){
            $("#status-text").text(player1 + " Wins!");
            score1 += 10;
            localStorage.setItem("PlayerScore1", score1);
            //remove Event Listeners
            removeButtonClick();
            addScores();
        }
        if(winner === 'O'){
            $("#status-text").text(player2 + " Wins!");
            score2 += 10;
            localStorage.setItem("PlayerScore2", score2);
            //remove event listeners
            // document.querySelectorAll(".box").removeEventListener("click");
            removeButtonClick();
            addScores();
        }
        if(game.draw()){
            $("#status-text").text("It's a Draw!");
            numberOfDraws += 1;
            localStorage.setItem("Draws", numberOfDraws);
            removeButtonClick();
            addScores();
        }

        $(".player1-score").text(player1 + ": " + localStorage.getItem("PlayerScore1"));
        $(".player2-score").text(player2 + ": " + localStorage.getItem("PlayerScore2"));
        $(".draw-score").text("Draw: " + localStorage.getItem("Draws"));

        $(tmp).prop('disabled', true);
        $(tmp).addClass('disabled');

    });
}, { once: true });

function removeButtonClick(){
    $(".box").prop('disabled', true);
    $(".box").addClass('disabled');
}

console.log(game.board);
