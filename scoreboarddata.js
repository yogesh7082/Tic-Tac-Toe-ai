allScores = JSON.parse(localStorage.getItem("allScores"));
var num = 1;

for(let score of allScores){
    var newScore = "<tr><th scope='row'>" + num +"</th><td>"+ score.Player1 + ": " + score.Score1 + "</td><td>"+ score.Player2 + ": " + score.Score2 + "</td><td>" + score.Draws + "</td></tr>" ;

    $("tbody").append(newScore);
    num++;
}
