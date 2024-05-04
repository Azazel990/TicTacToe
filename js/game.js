class Game{
    constructor(){
        this.config();
    }
    config(){
        this.counter = 0;
        this.playGrid = Array(10).fill(-1);
        this.currentElement = "";
        this.position = 1;
        this.block = "";
        this.winningCombinitions = [[1,2,3],[1,5,9],[1,4,7],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
        this.timeout = 500;
        this.winner = 0;
        this.round = sessionStorage.getItem("round") ? parseInt(sessionStorage.getItem("round")) : 1;
        this.playerWinCount = sessionStorage.getItem("playerWinCount") ? parseInt(sessionStorage.getItem("playerWinCount")) : 0;
        this.cpuWinCount = sessionStorage.getItem("cpuWinCount") ? parseInt(sessionStorage.getItem("cpuWinCount")) : 0;

        this.gameMode = sessionStorage.getItem("gameMode") ? sessionStorage.getItem("gameMode") : 1;

        document.getElementById("playerWinCount").innerHTML = this.playerWinCount;
        document.getElementById("cpuWinCount").innerHTML = this.cpuWinCount;
    }
    setData(){
        sessionStorage.setItem("round",parseInt(this.round) + 1);
        if(this.gameMode == 1){
            sessionStorage.setItem("playerWinCount",parseInt(this.playerWinCount));
            sessionStorage.setItem("cpuWinCount",parseInt(this.cpuWinCount));
        }
    }
    checkIfTieGame(){
        let count = 0;
        this.playGrid.forEach((place,index) => {
            if(index != 0 && place != -1) count++;
        });
        return count == 9 ?  true : false;
    }
    announceTieGame(){
        this.showPopUp("Tie Game","win.gif");
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
                location.reload();
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
    }
    makeAMove(element){
        this.currentElement = element[0];
        this.position = parseInt(this.currentElement.dataset["position"]);

        this.playerMove();
        this.winner = this.checkIfWinning();
        if(this.winner){
            if(this.winner == 1){
                this.playerWinCount += 1;
            }else{
                this.cpuWinCount += 1;
            }
            this.announceWinner();
        }else{
            let tie = this.checkIfTieGame();
            if(tie){
                this.announceTieGame();
            }else{
                setTimeout(() => {
                    this.cpuMove();
                    this.checkIfWinning();
                    this.checkIfTieGame();
                }, this.timeout);
            }
        }
       
    }
    playerMove(){
        this.fillGrid();
        this.blockCell();
        this.incrementCounter();
    }
    cpuMove(){
        this.dumbAI();
        this.fillGrid();
        this.selectElement();
        this.blockCell();
        this.incrementCounter();
    }

    selectElement(){
        this.currentElement = document.getElementById("cell" + this.position);
    }

    dumbAI(){
        while(1){
            const index = this.rng();
            console.log(index);
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
    }
    makeAMove(element){
        this.currentElement = element[0];
        this.position = parseInt(this.currentElement.dataset["position"]);
        this.fillGrid();
        this.blockCell();
        
        this.winner = this.checkIfWinning();
        if(this.winner){
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