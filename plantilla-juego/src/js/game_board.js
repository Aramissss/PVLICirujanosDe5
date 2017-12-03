'use strict'
//'none' 'blue' 'yellow' 'red'
var cellWidth, cellHeight;
var game;
var colors = ['blue', 'yellow', 'red'];
function gameBoard(Game){
  game =Game;
  this.cells = [];
  this.cellWidth =  16;//Medidas de las celdas
  this.cellHeight = 16;
  for(var i=0; i<17;i++){//Crea array vacío
      this.cells[i]=[];
    for(var j=0; j<8;j++){
      this.cells[i][j]= new cell(game, 'none', j , i);
    }
  }
  this.createVirus = function(number){
    for(var i=0;i<number;i++){
        this.cells[game.rnd.integerInRange(8, 16)][game.rnd.integerInRange(0, 7)].changeCell(colors[game.rnd.integerInRange(0, 2)], 'Virus');
    }
  }
}
function cell (game, color, posX, posY){

    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.sprite = game.add.sprite(16*posX+336,16*posY+180);
    this.changeCell = function(color, kind){//Kind: Virus or Pill
        this.color = color;
        this.sprite.loadTexture(color + kind);
        this.sprite.scale.setTo(2,2);
        this.sprite.anchor.setTo(0,0);
    }

}


module.exports = {
  gameBoard : gameBoard,
  cell : cell,
}
