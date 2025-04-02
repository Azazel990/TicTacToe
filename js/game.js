class Game{
    constructor(){
        this.config();
    }
    config(){
        
        const gridElement = document.querySelector("#playGrid");

        this.playGrid = Array(10).fill(-1);
        this.cellHeight = document.getElementsByClassName("cell")[0].scrollHeight;
        this.cellWidth = document.getElementsByClassName("cell")[0].scrollWidth;
        this.gridGap = parseInt(getComputedStyle(gridElement).getPropertyValue("grid-row-gap"));
        this.currentElement = "";
        this.position = 1;
        this.block = "";
        this.winningCombinitions = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
        this.timeout = 500;
        this.winningTimeout = 1000;
        this.winner = 0;
        this.currentWinningCombo = 2;
        this.round = sessionStorage.getItem("round") ? parseInt(sessionStorage.getItem("round")) : 1;
        this.counter = this.round % 2 != 0 ? 0 : 1;

        this.playerWinCount = sessionStorage.getItem("playerWinCount") ? parseInt(sessionStorage.getItem("playerWinCount")) : 0;
        this.cpuWinCount = sessionStorage.getItem("cpuWinCount") ? parseInt(sessionStorage.getItem("cpuWinCount")) : 0;

        this.player1WinCount = sessionStorage.getItem("player1WinCount") ? parseInt(sessionStorage.getItem("player1WinCount")) : 0;
        this.player2WinCount = sessionStorage.getItem("player2WinCount") ? parseInt(sessionStorage.getItem("player2WinCount")) : 0;
        this.gameMode = sessionStorage.getItem("gameMode") ? sessionStorage.getItem("gameMode") : 1;

        this.horizontalAnimation = "horizontalAnimation";
        this.verticalAnimation = "verticalAnimation";
        this.StrokeColors = {
            blue : 'rgb(0, 225, 225)',
            red : 'rgb(255, 0, 0)'
        }        

        this.assets = 'assets/';
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
        window.location.href = './index.html';
    }

    checkIfTieGame(){
        let count = 0;
        this.playGrid.forEach((place,index) => {
            if(index != 0 && place != -1) count++;
        });
        return count == 9 ?  true : false;
    }
    announceTieGame(){
        this.showPopUp("Tie Game", this.assets + "tie.png");
    }
    announceWinner(){
        this.triggerWinningStroke();
        setTimeout(() => {
            this.showPopUp("Player "+ this.winner +" Wins", this.assets + "win.gif");
        }, this.winningTimeout);
    }

    triggerWinningStroke(){
        const startingPostition = this.winningCombinitions[this.currentWinningCombo][0];

        const strokeColor = this.winner == 1 ? this.StrokeColors.blue : this.StrokeColors.red;

        if(this.currentWinningCombo >= 0 && this.currentWinningCombo <= 2){
            const strokeTop = (parseInt(startingPostition / 3)) * this.cellHeight + (this.cellHeight) / 2 + (parseInt(startingPostition / 3)) * this.gridGap;
            const stroke = this.getStrokeElement("winningStrokeHorizontal");

            stroke.style.top = strokeTop + 'px';
            this.setStrokeColor(stroke,strokeColor);
            this.makeStrokeVisible(stroke);
            stroke.setAttribute("class",this.horizontalAnimation);
        }else if(this.currentWinningCombo >= 3 && this.currentWinningCombo <= 5){
            const strokeTop = ((startingPostition - 1) * this.cellWidth) + (this.cellWidth) / 2 + (startingPostition - 1) * this.gridGap;
            const stroke = this.getStrokeElement("winningStrokeVertical");
            this.setStrokeColor(stroke,strokeColor);
            stroke.style.left = strokeTop + 'px';
            this.makeStrokeVisible(stroke);
            stroke.setAttribute("class",this.verticalAnimation);
        }else{
            // const canvas = document.getElementById("winnerCanvas");
            // canvas.style.zIndex = "9999999";
            // const ctx = canvas.getContext("2d");
     
            // let x = 0;
            // let y = 0;
            // const maxX = canvas.scrollWidth;
            // const maxY = canvas.scrollHeight;
            // const step = Math.sqrt((maxX * maxX) + (maxY * maxY)) / 900; 
            
            // function drawLine() {
            //     ctx.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight); 
            //     ctx.beginPath();
            //     ctx.moveTo(0, 0);
            //     ctx.lineTo(x, y);
            //     ctx.strokeStyle = strokeColor;
            //     ctx.lineWidth = 2; 
            //     ctx.lineCap = "round"; 
            //     ctx.stroke();
                
            //     if (x < maxX && y < maxY) {
            //         x += (maxX / maxY) * step;
            //         y += step;
            //         requestAnimationFrame(drawLine);
            //     }
            // }
            // drawLine();
        }
    }

    setStrokeColor(stroke,color){
        stroke.style.background = color;
    }

    makeStrokeVisible(stroke = ""){
        stroke.style.visibility = 'visible';
    }

    getStrokeElement(element_id){
        return document.getElementById(element_id);
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
        this.block.setAttribute("src",this.assets + "c" + this.determineWhosTurnItIs() + ".jpg");
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
                    this.currentWinningCombo = i;
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
    }
    playerMove(){
        this.fillGrid();
        this.blockCell();
        this.incrementCounter();
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
        }else{
            isWinning = this.checkIfPlayerOrCpuIsWinning(1);
            if(isWinning){
                this.position = isWinning;
            }else{
                let maxProfitCombos = this.determineMaxProfitCombos();
                this.position = this.selectBestPosition(maxProfitCombos);  
            }
        }
        this.selectElement();
    }
    selectBestPosition(maxProfitCombos = []){
        const uniqueCells = this.getUniquePositions(maxProfitCombos); 

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
    checkIfEmptyCellsAreAvailable(maxProfitCombos = []){
        maxProfitCombos.forEach((profit_index) => {
            for(let i = 0; i < 3; i++){
                if(this.winningCombinitions[profit_index][i] == -1) return true;
            }
        })

        return false;
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
        let maxProfitCombos = [];
        while(ProfitCombos.length){
            const maxProfit = Math.max(...ProfitCombos);
            for(let i = 0; i < ProfitCombos.length; i++){
                if(ProfitCombos[i] == maxProfit) maxProfitCombos.push(i);
            }

            if(!this.checkIfEmptyCellsAreAvailable(maxProfitCombos)){
                ProfitCombos = ProfitCombos.filter(profit => {
                    return profit != maxProfit;
                })               
            }else return maxProfitCombos;
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
            const dontPlay = [2,4,6,8];
            if(this.playGrid[index] == -1 && dontPlay.indexOf(index) < 0){
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