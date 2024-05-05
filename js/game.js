class Game{
    constructor(){
        this.config();
    }
    config(){
        this.playGrid = Array(10).fill(-1);
        this.currentElement = "";
        this.position = 1;
        this.block = "";
        this.winningCombinitions = [[1,2,3],[1,5,9],[1,4,7],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
        this.timeout = 500;
        this.winner = 0;
        
        this.round = sessionStorage.getItem("round") ? parseInt(sessionStorage.getItem("round")) : 1;
        // this.round = 1;
        this.counter = this.round % 2 != 0 ? 0 : 1;
        // this.counter = 1;

        this.playerWinCount = sessionStorage.getItem("playerWinCount") ? parseInt(sessionStorage.getItem("playerWinCount")) : 0;
        this.cpuWinCount = sessionStorage.getItem("cpuWinCount") ? parseInt(sessionStorage.getItem("cpuWinCount")) : 0;

        this.player1WinCount = sessionStorage.getItem("player1WinCount") ? parseInt(sessionStorage.getItem("player1WinCount")) : 0;
        this.player2WinCount = sessionStorage.getItem("player2WinCount") ? parseInt(sessionStorage.getItem("player2WinCount")) : 0;
        this.gameMode = sessionStorage.getItem("gameMode") ? sessionStorage.getItem("gameMode") : 1;
    }
    setData(){
        sessionStorage.setItem("round",parseInt(this.round) + 1);
        if(this.gameMode == 1){
            sessionStorage.setItem("playerWinCount",parseInt(this.playerWinCount));
            sessionStorage.setItem("cpuWinCount",parseInt(this.cpuWinCount));
        }else{
            sessionStorage.setItem("player1WinCount",parseInt(this.player1WinCount));
            sessionStorage.setItem("player2WinCount",parseInt(this.player2WinCount));
        }
    }

    clearData(){
        sessionStorage.clear();
    }
    quitGame(){
        this.clearData();
        window.location.href = './game.html';
    }

    checkIfTieGame(){
        let count = 0;
        this.playGrid.forEach((place,index) => {
            if(index != 0 && place != -1) count++;
        });
        return count == 9 ?  true : false;
    }
    announceTieGame(){
        this.showPopUp("Tie Game","tie.png");
    }
    announceWinner(){
       this.showPopUp("Player "+ this.winner +" Wins","win.gif");
    }
    showPopUp(msg,img){
        Swal.fire({
            title: msg,
            imageUrl: img,
            imageWidth: 200,
            imageHeight: 200,
            confirmButtonText : "Play Again",
            showCancelButton: true,
            cancelButtonText : 'Quit'
          }).then((result) => {
            if (result.isConfirmed) {
                this.setData();
                location.reload();
            }else{
                this.quitGame();
            }
        });

    }
    createBlock(){
        this.block = document.createElement("img");
        this.block.setAttribute("src","c" + this.determineWhosTurnItIs() + ".jpg");
        this.block.setAttribute("class","tictac");
        this.block.setAttribute("id","cell"+this.position);
    }
    blockCell(){
        this.createBlock(this.currentElement);
        this.currentElement.parentElement.append(this.block);
        this.currentElement.remove();       
    }
    fillGrid(){
        this.playGrid[this.position] = this.determineWhosTurnItIs();
    }
    determineWhosTurnItIs(){
        return this.counter%2 == 0 ? 1 : 2;
    }
    incrementCounter(){
        this.counter++;
    }
    checkIfWinning(){
        for(let  player = 1;player <= 2; player++){
            for(let i = 0;i <= this.winningCombinitions.length - 1; i++){
                let flag = 0;
                for(let j = 0; j <= 2;j++){
                    if(this.playGrid[this.winningCombinitions[i][j]] == player){
                        flag++;
                    }else break;
                }
                if(flag == 3){
                    return player;
                }
            }
        }

        return false;
    }
}

class Singleplayer extends Game{
    constructor(){
        super();
        this.gameMode = 1;
        document.getElementById("playerWinCount").innerHTML = this.playerWinCount;
        document.getElementById("cpuWinCount").innerHTML = this.cpuWinCount;

        if(this.round % 2 == 0 && this.counter == 1){
            setTimeout(() => {this.makeAMoveCPU();}, this.timeout);
        }
    }
    makeAMove(element = ""){
        this.currentElement = element[0];
        this.position = parseInt(this.currentElement.dataset["position"]);
        this.playerMove();
        this.winnerCheck(1);
    }

    winnerCheck(move = 0){
        this.winner = this.checkIfWinning();
        if(this.winner){
            if(this.winner == 1) this.playerWinCount += 1;
            else this.cpuWinCount += 1;   
            this.announceWinner();
        }else{
            if(this.checkIfTieGame()) this.announceTieGame();
            else if(move){
                setTimeout(() => {
                    this.makeAMoveCPU();
                    this.winnerCheck(0);
                }, this.timeout);
            }
        }     
    }

    makeAMoveCPU(){
        this.cpuMove();
        this.checkIfWinning();
        this.checkIfTieGame();
        console.log(this.currentElement);
    }
    playerMove(){
        this.fillGrid();
        this.blockCell();
        this.incrementCounter();
        // console.log(this.currentElement);
    }
    cpuMove(){
        if(this.counter <= 1){
            this.dumbAI();
        }else{
            this.smartAI();
        }
        this.fillGrid();
        this.selectElement();
        this.blockCell();
        this.incrementCounter();
    }

    selectElement(){
        this.currentElement = document.getElementById("cell" + this.position);
    }

    checkIfPlayerOrCpuIsWinning(token = 1){
        for(let i = 0; i < this.winningCombinitions.length; i++){
            let cost = 0;
            for(let j = 0; j < 3;j++){
                if(this.playGrid[this.winningCombinitions[i][j]] == token) cost += 1;
            }
            if(cost == 2){
                for(let k = 0; k < 3;k++){
                    if(this.playGrid[this.winningCombinitions[i][k]] == -1) return this.winningCombinitions[i][k];
                }
            }
        }
        return false;
    }

    smartAI(){
        let isWinning = this.checkIfPlayerOrCpuIsWinning(2);
        if(isWinning){
            this.position = isWinning;
            console.log("CPU WINNING");
        }else{
            isWinning = this.checkIfPlayerOrCpuIsWinning(1);
            if(isWinning){
                this.position = isWinning;
                console.log("Player WINNING");

            }else{
                let maxProfitCombos = this.determineMaxProfitCombos();
                this.position = this.selectBestPosition(maxProfitCombos);  
            }
        }
        this.selectElement();
    }
    selectBestPosition(maxProfitCombos = []){
        const uniqueCells = this.getUniquePositions(maxProfitCombos); 
        console.log("uniqueCells ", uniqueCells);

        return uniqueCells.length > 1 ? this.calculateProfitForEachCell(uniqueCells) : uniqueCells[0];
    }

    calculateProfitForEachCell(uniqueCells = []){
        let profitOnEachCell = [];
        uniqueCells.forEach(cell => {
            let profitOnThisCell = 0;
            for(let i = 0; i < this.winningCombinitions.length;i++){               

                let index = this.winningCombinitions[i].indexOf(cell);

                if(index > - 1){
                    for(let j = 0; j < 3; j++){
                        profitOnThisCell = profitOnThisCell + parseInt(this.addCost(this.winningCombinitions[i][j]));
                    }
                }
            }
            profitOnEachCell.push(profitOnThisCell) 
        })
        return this.getMaxProfitCell(profitOnEachCell,uniqueCells);
    }

    getMaxProfitCell(profitOnEachCell = [],uniqueCells = []){
        let maxProfit = Math.max(...profitOnEachCell);
        return uniqueCells[profitOnEachCell.indexOf(maxProfit)];
    }
    
    getUniquePositions(maxProfitCombos = []){
        let cells = [];
        maxProfitCombos.forEach((value) => {
            for(let i = 0; i < 3; i++){
                cells.push(this.winningCombinitions[value][i]);
            }
        })
        cells = this.removeFilledCells(cells);
        return [... new Set(cells)];
    }

    checkIfLastCellRemaining(cells = []){
        let emptyCells = [];
        this.playGrid.forEach((value,index) => {
            if(value == -1 && index != 0) emptyCells.push(index);
        })

        return emptyCells.length == 1 ? [emptyCells[0]] : cells; 
    }

    removeFilledCells(cells = []){
        let arr = [];
        for(let i = 0; i < cells.length; i++){
            if(this.playGrid[cells[i]] == -1) arr.push(cells[i]);
        }
        return this.checkIfLastCellRemaining(arr);
    }

    determineMaxProfitCombos(){
        let ProfitCombos = [];
        
        for(let  i = 0; i < this.winningCombinitions.length; i++){
            let profit = 0;
            for(let j = 0; j < 3;j++){
                profit = profit + parseInt(this.addCost(this.playGrid[this.winningCombinitions[i][j]]));
            }
            ProfitCombos.push(profit);
        }
        const maxProfit = Math.max(...ProfitCombos);
        
        let maxProfitCombos = [];
        for(let i = 0; i < ProfitCombos.length; i++){
            if(ProfitCombos[i] == maxProfit) maxProfitCombos.push(i);
        }
        return maxProfitCombos;
    }   

    addCost(value = -1){
        if(value == 1) return -1 ;
        else if(value == 2) return 2;

        return 1;
    }

    dumbAI(){
        while(1){
            const index = this.rng();
            if(this.playGrid[index] == -1){
                this.position = index;
                return;
            }    
        }  
    }

    rng(min = 1,max = 9){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


class Multiplayer extends Game{
    constructor(){
        super();
        this.gameMode = 2;
        document.getElementById("player1WinCount").innerHTML = this.player1WinCount;
        document.getElementById("player2WinCount").innerHTML = this.player2WinCount;
    }
    makeAMove(element){
        this.currentElement = element[0];
        this.position = parseInt(this.currentElement.dataset["position"]);
        this.fillGrid();
        this.blockCell();
        
        this.winner = this.checkIfWinning();
       
        if(this.winner){
            if(this.winner == 1){
                this.player1WinCount += 1;
            }else{
                this.player2WinCount += 1;
            }
            this.announceWinner();
        }else{
            let tie = this.checkIfTieGame();
            if(tie){
                this.announceTieGame();
            }
        }  
        this.incrementCounter();
    }
}