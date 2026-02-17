let playerWin = false;
let botWin = false;

const grid = [
    [$("#1"), $("#2"), $("#3")],
    [$("#4"), $("#5"), $("#6")],
    [$("#7"), $("#8"), $("#9")]
]

const winPatterns = [
    [[0,0], [0,1], [0,2]], //Top Row
    [[1,0], [1,1], [1,2]], //Middle Row
    [[2,0], [2,1], [2,2]], //Bottom Row

    [[0,0], [1,0], [2,0]], //Left Collumn
    [[0,1], [1,1], [2,1]], //Middle Collumn
    [[0,2], [1,2], [2,2]], //Right Collumn

    [[0,0], [1,1], [2,2]], //Top Left to Bottom Right
    [[0,2], [1,1], [2,0]] //Top Right to Bottom Left
]

function botMove(){
    for(let pattern of winPatterns){
        let cells = pattern.map(([r,c]) => grid[r][c]);
        let values = cells.map(cell => cell.text());

        const oCount = values.filter(value => value === "O").length;
        const dashPos = values.indexOf("-");

        if(oCount === 2 && dashPos != -1){
            cells[dashPos].find("span").text("O");
            return
        }
    }

    for(let pattern of winPatterns){
        let cells = pattern.map(([r,c]) => grid[r][c]);
        let values = cells.map(cell => cell.find("span").text());

        const xCount = values.filter(value => value === "X").length;
        const dashPos = values.indexOf("-");

        if(xCount === 2 && dashPos != -1){
            cells[dashPos].find("span").text("O");
            return
        }
    }

    const allCells = $(".grid-button");
    let emptyCells = [];
    allCells.each(function() {
        if($(this).text() === "-"){
            emptyCells.push($(this));
        }
    });

    const ranCellIndex = Math.floor(Math.random()*emptyCells.length);
    emptyCells[ranCellIndex].find("span").text("O");
}

function checkForWin(piece){
    for(let pattern of winPatterns){
        let cells = pattern.map(([r,c]) => grid[r][c]);
        let values = cells.map(cell => cell.find("span").text());

        const pieceCount = values.filter(value => value === piece).length;

        if(pieceCount === 3){
            cells.forEach(cell => {
                if(piece === "X"){cell.addClass("text-success")}
                else if(piece === "O"){cell.addClass("text-danger")}
            });
            
            if(piece === "X"){
                playerWin = true;
            }
            else if(piece === "O"){
                botWin = true;
            }
            return
        }
    }
}

function checkDraw(){
    const allCells = $(".grid-button");
    let allCellValues = [];

    allCells.each(function(){
        allCellValues.push($(this).text());
    })

    if(!allCellValues.includes("-")){
        console.log("Draw");
        $("#drawAlert").removeClass("d-none");
        return true
    }else{
        return false
    }
}

function changeScore(scoreDisplay){
    console.log(scoreDisplay);
    let score = parseInt(scoreDisplay.text());
    score++;
    scoreDisplay.text(score);
}

for(let x = 1; x < 10; x++){
    $(`#${x}`).on("click", function(){
        if(playerWin || botWin){
            return
        }else{
            const buttonHeading = $(`#${x} span`);
            if(buttonHeading.text() === "-"){
                buttonHeading.text("X");
                checkForWin("X");
                if(!playerWin){
                    const draw = checkDraw();
                    if(draw){
                        return
                    }
                    botMove();
                    checkForWin("O");
                    if(botWin){
                        console.log("Bot Wins");
                        $("#botWinAlert").removeClass("d-none");
                        changeScore($("#ai-score"));
                        return
                    }
                }else{
                    console.log("You Win");
                    $("#playerWinAlert").removeClass("d-none");
                    changeScore($("#player-score"));
                    return
                }
            }
        }
    })
}

$(".game-reset").on("click", function(){
    botWin = false;
    playerWin = false;

    const allCells = $(".grid-button");

    allCells.each(function() {
        $(this).find("span").text("-");
        if($(this).hasClass("text-success")){
            $(this).removeClass("text-success");
        }
        else if($(this).hasClass("text-danger")){
            $(this).removeClass("text-danger")
        }
    });

    $(this).parent().addClass("d-none");

})