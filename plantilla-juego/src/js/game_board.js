'use strict'
//'none' 'blue' 'yellow' 'red'
var cellWidth, cellHeight;
var game;
var colors = ['blue', 'yellow', 'red'];
function gameBoard(Game,xOffset,yOffset){
  game =Game;
  this.pillBroken=false;
  this.xOffset = xOffset;
  this.yOffset = yOffset;
  this.halfPills=[];
  this.cellWidth =  16;//Medidas de las celdas
  this.cellHeight = 16;
  this.virus =0;
  this.score=0;
  this.maxY=0;//Altura máxima a la que puede aparecer un virus
  this.createBoard=function(level){
    this.cells = [];
    for(var i=0; i<17;i++){//Crea array vacío
        this.cells[i]=[];
      for(var j=0; j<8;j++){
        this.cells[i][j]= new cell(Game, 'none', j , i,this.xOffset,this.yOffset);
      }
    }
    if(level>=15){//Se pone una altura según el nivel
      this.maxY=4;
    }
    else if(level>=10){
      this.maxY=7;
    }
    else this.maxY=10;
    this.createVirus(level*4+4,this.maxY);
  }
  this.clearBoard=function(){
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        this.cells[i][j].sprite.destroy();
        this.cells[i][j]=undefined;
      }
    }
  }
  this.createVirus = function(number, maxY){//maxY es la altura maxima donde puede aparecer un virus
    this.virus=number;
    for(var i=0;i<number;i++){
        var rndY=game.rnd.integerInRange(maxY, 16);
        var rndX=game.rnd.integerInRange(0, 7);
        while(this.cells[rndY][rndX].kind == 'Virus'){
          rndY=game.rnd.integerInRange(maxY, 16);
          rndX=game.rnd.integerInRange(0, 7);
        }
        this.cells[rndY][rndX].changeCell(colors[game.rnd.integerInRange(0, 2)], 'Virus', 0,false);
        //this.checkAdjacentInBoard();
    }
  }
  this.checkGameOver = function(){//Comprueba si hay alguna píldora obstruyendo la entrada
    if(this.cells[1][3].kind=='Pill' || this.cells[1][4].kind=='Pill'){
      return true;
    }
    else return false;
  }
  this.checkAdjacentInBoard = function(){//Comprueba si hay colores adyacentes en el tablero, se usa cuando varias píldoras se han movido o cuando se crean virus
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        if(this.cells[i][j].color!='none')
          this.checkAdjacentColors(this.cells[i][j].color, j,i);
      }
    }
  }
  this.checkAdjacentColors = function(color, posX, posY){
      if(this.checkHorizontal(color,posX,posY) || this.checkVertical(color,posX,posY)){
        this.pillBroken=true;
        return true;
      }
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
        if(this.cells[auxY][auxX].kind=='Pill'&&this.cells[auxY][auxX].brotherX!=-1&&this.cells[auxY][auxX].color!='none'){
          this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].setBrother(-1,-1);
          this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].changeCell(this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].color, 'Pill',this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].rotationState,this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].attached);
        }
        else if(this.cells[auxY][auxX].kind=='Virus'){
          this.virus--;
        }
        this.cells[auxY][auxX].destroyAnim();
      //  this.cells[auxY][auxX].destroyCell();
        this.addScore();
      }
      return true;
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
        if(this.cells[auxY][auxX].kind=='Pill'&&this.cells[auxY][auxX].brotherX!=-1&&this.cells[auxY][auxX].color!='none'){
          this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].setBrother(-1,-1);//Deja sin hermano a la otra píldora
          this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].changeCell(this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].color, 'Pill',this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].rotationState,this.cells[this.cells[auxY][auxX].brotherY][this.cells[auxY][auxX].brotherX].attached);
        }
        else if(this.cells[auxY][auxX].kind=='Virus'){
          this.virus--;
        }
        this.cells[auxY][auxX].destroyAnim();
        //this.cells[auxY][auxX].destroyCell();
        this.addScore();
      }
      return true;
    }
  }
  this.addScore = function(){
    this.score+=25;
  }
  this.checkBrothers = function()//Busca y guarda la posición de todas las píldoras que se han roto
  {
    this.halfPills =[];
    this.setHalfPills = function(index, posY,posX,color,brotherY,brotherX,rotationState,attached){
      this.halfPills[index]=[];
      this.halfPills[index][0]=posY
      this.halfPills[index][1]=posX;
      this.halfPills[index][2]=color;
      this.halfPills[index][3]=brotherY;
      this.halfPills[index][4]=brotherX;
      this.halfPills[index][5]=rotationState;
      this.halfPills[index][6]=attached;
    }
    var z=0;
    for(var i=16; i>=0;i--){//Crea array vacío
    for(var j=7; j>=0;j--){//Las recorre de abajo hacia arriba para que no haya conflicto
      if(this.cells[i][j].kind=='Pill'){//Tiene que ser una píldora
          if((this.cells[i][j].brotherY == -1 && this.cells[i][j].brotherX == -1)){//Tiene que estar sola
              if((this.availableCell(j,i+1) && this.checkColor(j,i+1)=='none')){
                this.pillBroken=true;
                this.setHalfPills(z,this.cells[i][j].posY,this.cells[i][j].posX,this.cells[i][j].color,this.cells[i][j].brotherY,this.cells[i][j].brotherX,this.cells[i][j].rotationState,this.cells[i][j].attached);
                z++;
              }
          }
          //Comprueba si hay píldoras enteras flotando
          else  if((this.availableCell(j,i+1) && this.availableCell(this.cells[i][j].brotherX,this.cells[i][j].brotherY+1)) ){//Puede haber píldoras en vertical u horizontal
              if((this.checkColor(j,i+1)=='none' && this.checkColor(this.cells[i][j].brotherX,this.cells[i][j].brotherY+1)=='none')//Horizontal
               || (this.cells[i][j].brotherY>i)&&(this.availableCell(j,i+1) && this.availableCell(this.cells[i][j].brotherX,this.cells[i][j].brotherY+1) && (this.checkColor(this.cells[i][j].brotherX,this.cells[i][j].brotherY+1)=='none'))//Attached abajo
               || (this.cells[i][j].brotherY<i &&(this.availableCell(j,i+1) && this.availableCell(this.cells[i][j].brotherX,this.cells[i][j].brotherY+1) && (this.checkColor(j,i+1)=='none')))) {//Attached arriba
                this.pillBroken=true;
                this.setHalfPills(z,this.cells[i][j].posY,this.cells[i][j].posX,this.cells[i][j].color,this.cells[i][j].brotherY,this.cells[i][j].brotherX,this.cells[i][j].rotationState,this.cells[i][j].attached);
                z++;
                this.setHalfPills(z,this.cells[i][j].brotherY,this.cells[i][j].brotherX,this.cells[this.cells[i][j].brotherY][this.cells[i][j].brotherX].color,this.cells[i][j].posY,
                this.cells[i][j].posX,this.cells[this.cells[i][j].brotherY][this.cells[i][j].brotherX].rotationState,this.cells[this.cells[i][j].brotherY][this.cells[i][j].brotherX].attached);
                z++;
              }
            }
          }

      }
    }
    return this.halfPills;
  }
  /*this.collapseLoop = function(timer){
      var arrayHalfPills = this.checkBrothers();
      this.collapsePills();
      if(arrayHalfPills.length==0){
        this.pauseTimer();
        timer.resume();
      }
  }*/
  this.collapsePills = function(){//Junta todas las píldoras que puedan haber quedado sueltas
    for(var i=0; i<this.halfPills.length;i++){
      if(this.halfPills[i][3]!=-1){//Aquí entran las píldoras enteras
        if(this.availableCell(this.halfPills[i][1], this.halfPills[i][0]+1) && this.checkColor(this.halfPills[i][1], this.halfPills[i][0]+1)=='none'){
          if(i+1<this.halfPills.length){
            if(this.availableCell(this.halfPills[i+1][4], this.halfPills[i+1][3]+1) && this.checkColor(this.halfPills[i+1][4], this.halfPills[i+1][3]+1)=='none' ){
              this.cells[this.halfPills[i][0]+1][this.halfPills[i][1]].setBrother(this.halfPills[i][4], this.halfPills[i][3]+1);
              this.cells[this.halfPills[i][0]+1][this.halfPills[i][1]].changeCell(this.halfPills[i][2], 'Pill',this.halfPills[i][5], this.halfPills[i][6]);
              this.cells[this.halfPills[i][0]][this.halfPills[i][1]].destroyCell();
              i++;
              this.cells[this.halfPills[i][0]+1][this.halfPills[i][1]].setBrother(this.halfPills[i][4], this.halfPills[i][3]+1);
              this.cells[this.halfPills[i][0]+1][this.halfPills[i][1]].changeCell(this.halfPills[i][2], 'Pill',this.halfPills[i][5], this.halfPills[i][6]);
              this.cells[this.halfPills[i][0]][this.halfPills[i][1]].destroyCell();
            }
          }
        }
      }

      else if(this.availableCell(this.halfPills[i][1], this.halfPills[i][0]+1) && this.checkColor(this.halfPills[i][1], this.halfPills[i][0]+1)=='none'){//Comprueba si pueden caer
        this.cells[this.halfPills[i][0]+1][this.halfPills[i][1]].changeCell(this.halfPills[i][2], 'Pill',this.halfPills[i][5], this.halfPills[i][6]);
        this.cells[this.halfPills[i][0]][this.halfPills[i][1]].destroyCell();
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
function cell (game, color, posX, posY , xOffset, yOffset){
    this.kind = 'none';
    this.posX = posX;
    this.posY = posY;
    this.brother= false;
    this.brotherX= -1;
    this.brotherY = -1;
    this.color = color;
    this.sprite = game.add.sprite(16*posX+xOffset,16*posY+yOffset,'' ,2);
    this.sprite.anchor.setTo(0.5,0.5);
    this.sprite.scale.setTo(1,1);
    this.attached = false;
    this.rotationState=0;
    this.changeCell = function(color, kind, rotState, at){//Kind: Virus or Pill
        this.rotationState=rotState;
        this.attached=at;
        this.sprite.angle = this.rotationState*90;//Rota el sprite
        this.kind = kind;
        this.color = color;
        if(this.attached){//Booleano que indica si es la píldora auxiliar
          this.sprite.scale.setTo(-1,1);
        }
        else {
          this.sprite.scale.setTo(1,1);
        }
        if(this.kind!='none'){
          this.sprite.loadTexture(color + kind);
          if(this.kind=='Virus'){
            this.anim = this.sprite.animations.add('idle');
            this.anim.play(6,true);

          }
        }
        if(this.kind=='Pill' && (this.brotherX==-1) && this.color!='none'){
          this.sprite.loadTexture(color);
        }
    }

    this.setBrother = function( x, y)
    {
      this.brother=true;
      this.brotherX=x;
      this.brotherY=y;
    }
    this.clearCell = function(){//Reinicia los valores de la celda
      this.attached=false;
      this.kind='none';
      this.color ='none';
      this.brother =false;
      this.brotherX=-1;
      this.brotherY=-1;
    }
    this.destroyAnim = function(){//Hace la animación de destrucción y hace clear
      this.sprite.loadTexture(this.color + 'Explosion');
      this.anim = this.sprite.animations.add('destroy');
      this.anim.play(5,false);
      this.clearCell();
    }
    this.destroyCell = function(){//Además de reiniciar los valores destruye el sprite
      this.sprite.loadTexture();
      this.clearCell();
    }
}
module.exports = {
  gameBoard : gameBoard,
  cell : cell,
}
