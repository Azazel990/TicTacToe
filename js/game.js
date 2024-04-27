class Game{
    constructor(){
        this.counter = 0;
        this.playGrid = Array(10).fill(-1);
        this.currentElement = "";
        this.position = 1;

        this.block = "";

        this.winningCombinitions = [[1,2,3],[1,5,9],[1,4,7],[2,5,8],[3,6,9],[3,5,7],[4,5,6],[7,8,9]];
    }
    makeAMove(element){
        this.currentElement = element[0];
        this.position = parseInt(this.currentElement.dataset["position"]);
        this.fillGrid();
        this.blockCell();
        
        this.checkIfWinning();
        this.checkIfTieGame();
        this.incrementCounter();
    }
    checkIfTieGame(){
        let count = 0;
        this.playGrid.forEach((place,index) => {
            if(index != 0 && place != -1) count++;
        });
        return count == 9 ?  this.announceTieGame() : -1;
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
                    this.announceWinner(player);
                }
            }
        }
    }

    announceTieGame(){
        this.showPopUp("Tie Game","win.gif");
    }

    announceWinner(player){
       this.showPopUp("Player "+ player +" Wins","win.gif");
    }
    showPopUp(msg,img){
        Swal.fire({
            title: msg,
            imageUrl: img,
            imageWidth: 200,
            imageHeight: 200,
            confirmButtonText : "Play Again"  
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
        });
    }
    createBlock(){
        this.block = document.createElement("img");
        this.block.setAttribute("src","c" + this.determineWhosTurnItIs() + ".jpg");
    }
    blockCell(){
        this.createBlock(this.currentElement);
        this.currentElement.parentElement.append(this.block);
        this.currentElement.remove();       
    }
    fillGrid(){
        this.playGrid[this.position] = this.determineWhosTurnItIs();
        console.log(this.playGrid);
    }
    determineWhosTurnItIs(){
        return this.counter%2 == 0 ? 1 : 2;
    }
    incrementCounter(){
        this.counter++;
    }
}