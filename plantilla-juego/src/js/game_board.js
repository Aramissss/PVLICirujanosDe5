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
  this.createVirus = function(number, maxY){//maxY es la altura maxima donde puede aparecer un virus
    for(var i=0;i<number;i++){
        var rndY=game.rnd.integerInRange(maxY, 16);
        var rndX=game.rnd.integerInRange(0, 7);
        while(this.cells[rndY][rndX].kind == 'Virus'){
          rndY=game.rnd.integerInRange(maxY, 16);
          rndX=game.rnd.integerInRange(0, 7);
        }
        this.cells[rndY][rndX].changeCell(colors[game.rnd.integerInRange(0, 2)], 'Virus');
    }
  }
  this.checkAdjacentColors = function(color, posX, posY){
      this.checkHorizontal(color,posX,posY);
      this.checkVertical(color,posX,posY);
  }
  this.checkHorizontal = function(color, posX, posY){
    //Horizontal
    //Vertical
    var cont=0;//Contador de colores adyacentes iguales
    var destroyablePills = [];//Array con las posiciones de las píldoras a destruir
    var auxX=posX;
    var auxY=posY;
    while(this.availableCell(auxX, posY) && this.checkColor(auxX, posY)==color){
      destroyablePills[cont]=[auxX, posY];//Almacena la posición
      auxX--;//La auxiliar recorre X a la izquierda
      cont++;//El contador aumenta
    }
    auxX=posX+1;
    while(this.availableCell(auxX, posY) && this.checkColor(auxX, posY)==color){
      destroyablePills[cont]=[auxX, posY];
      auxX++;//Ahora el auxiliar recorre a la derecha
      cont++;
    }
    if(cont>=4){
      for(var i =0;i<cont;i++){
        auxX = destroyablePills[i][0];
        auxY = destroyablePills[i][1];
        this.cells[auxY][auxX].destroyCell();
      }
    }
  }

  this.checkVertical = function(color, posX, posY){
    //Vertical
    var cont=0;//Contador de colores adyacentes iguales
    var destroyablePills = [];//Array con las posiciones de las píldoras a destruir
    var auxX=posX;
    var auxY=posY;
    while( this.availableCell(posX, auxY) && this.checkColor(posX, auxY)==color){
      destroyablePills[cont]=[posX,auxY];//Almacena la posición
      auxY--;//La auxiliar recorre Y hacia arriba
      cont++;//El contador aumenta
    }
    auxY=posY+1;
    while(  this.availableCell(posX, auxY) && this.checkColor(posX,auxY)==color){
      destroyablePills[cont]=[posX,auxY];
      auxY++;//Ahora el auxiliar recorre hacia abajo
      cont++;
    }
    if(cont>=4){
      for(var i =0;i<cont;i++){
        auxX = destroyablePills[i][0];
        auxY = destroyablePills[i][1];
        this.cells[auxY][auxX].destroyCell();

      }
    }
  }
  this.checkColor = function(x,y){
    return this.cells[y][x].color;
  }
  this.availableCell = function(x,y){
    if(x>=8 || y>=17){
      return false;
    }
    else if(x<0 || y<0){
      return false;
    }
    else{
      return true;
    }
  }
}

function cell (game, color, posX, posY){
    this.kind = 'none';
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.sprite = game.add.sprite(16*posX+336,16*posY+180, 'blank');
    this.sprite.scale.setTo(2,2);
    this.sprite.anchor.setTo(0,0);
    this.changeCell = function(color, kind){//Kind: Virus or Pill
        this.kind = kind;
        this.color = color;
        this.sprite.loadTexture(color + kind);
    }

    this.destroyCell = function(){
      this.kind='none';
      this.color ='none';
      this.sprite.loadTexture('blank');

    }
}


module.exports = {
  gameBoard : gameBoard,
  cell : cell,
}
