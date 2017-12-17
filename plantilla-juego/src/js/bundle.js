(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
//'none' 'blue' 'yellow' 'red'
var cellWidth, cellHeight;
var game;
var colors = ['blue', 'yellow', 'red'];
function gameBoard(Game){
  game =Game;
  this.pillBroken=false;
  this.halfPills=[];
  this.cellWidth =  16;//Medidas de las celdas
  this.cellHeight = 16;
  this.virus =0;
  this.maxY=0;//Altura máxima a la que puede aparecer un virus
  this.createBoard=function(level){
    this.cells = [];
    for(var i=0; i<17;i++){//Crea array vacío
        this.cells[i]=[];
      for(var j=0; j<8;j++){
        this.cells[i][j]= new cell(game, 'none', j , i);
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
        this.checkAdjacentInBoard();
    }
  }
  this.checkGameOver = function(){
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
        this.cells[auxY][auxX].destroyCell();
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
        this.cells[auxY][auxX].destroyCell();
      }
      return true;
    }
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
  this.collapseLoop = function(timer){
      var arrayHalfPills = this.checkBrothers();
      this.collapsePills();
      if(arrayHalfPills.length==0){
        this.pauseTimer();
        timer.resume();
      }
  }
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
function cell (game, color, posX, posY){
    this.kind = 'none';
    this.posX = posX;
    this.posY = posY;
    this.brother= false;
    this.brotherX= -1;
    this.brotherY = -1;
    this.color = color;
    this.sprite = game.add.sprite(16*posX+344,16*posY+188, 'blank');
    this.sprite.anchor.setTo(0.5,0.5);
    this.sprite.scale.setTo(2,2);
    this.attached = false;
    this.rotationState=0;
    this.changeCell = function(color, kind, rotState, at){//Kind: Virus or Pill
        this.rotationState=rotState;
        this.attached=at;
        this.sprite.angle = this.rotationState*90;//Rota el sprite
        this.kind = kind;
        this.color = color;
        if(this.attached){//Booleano que indica si es la píldora auxiliar
          this.sprite.scale.setTo(-2,2);
        }
        else {
          this.sprite.scale.setTo(2,2);
        }
        if(this.kind!='none'){
          this.sprite.loadTexture(color + kind);
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
    this.destroyCell = function(){
      this.attached=false;
      this.kind='none';
      this.color ='none';
      this.brother =false;
      this.brotherX=-1;
      this.brotherY=-1;
      this.sprite.loadTexture('blank');
    }
}
module.exports = {
  gameBoard : gameBoard,
  cell : cell,
}

},{}],2:[function(require,module,exports){
'use strict'
var board;
var colors = ['blue', 'yellow', 'red'];
//Contiene Item, Pills
function Item(game,x,y,color){
    Phaser.Sprite.call(this, game, x, y, color);//Se le asigna un sprite
    this.xOffset=344;//la diferencia que hay entre el punto 0 y la posición en pantalla del frasco
    this.yOffset=188;
    this.color=color;
    this.cellPosition = [0,0];
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
    this.anchor.setTo(0.5,0.5);
    this.scale.setTo(2,2);

    this.game.add.existing(this);
  };
  Item.prototype = Object.create(Phaser.Sprite.prototype);//Asignación de constructora
  Item.prototype.constructor = Item;
  Item.prototype.availableCell = function(x,y){
        if(x>=8 || y>=17){
          return false;
        }
        else if(x<0 || y<0){
          return false;
        }
        else if(board.cells[y][x].color=='none'){
          return true;
        }
      }
var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
function Pill(game, x,y,color1, color2, Board){//Píldoras, heredan de Item
       this.fallDelay=lowSpeed;
       this.fallLoop = game.time.events.loop(this.fallDelay, this.fall, this);//Bucle de caída
      Item.call(this, game, x, y, color1);
      this.game = game;
      board = Board;
      var self=this;
      this.fallLoop.timer.start();
      this.startPill = function(x,y,color1,color2){
          self.rotationState=0;//Hay 4 estados 0=0º 1=270º 2=180º 3=90º
          self.cellPosition[0]=x;
          self.cellPosition[1]=y;
          self.loadTexture(color1 + 'Pill');//Cambia el sprite
          self.color = color1;
          self.attachedPill = {
            color: color2,//'blue' 'red' 'yellow' 'none'
            cellPosition : [self.cellPosition[0]+1,self.cellPosition[1]],//La píldora adherida aparece a la derecha

            rotOffset : [[1,0],[0,1],[-1,0],[0,-1]],//Offset respecto a la píldora principal
            sprite : game.add.sprite(game.world.centerX,game.world.centerY, color2 + 'Pill'),
          }
          self.attachedPill.sprite.anchor.setTo(0.5,0.5);
          self.attachedPill.sprite.scale.setTo(-2,2);
          this.setRotation(0);
        }
  };
  Pill.prototype = Object.create(Item.prototype);//Asignación de constructora
  Pill.prototype.constructor = Pill;
  Pill.prototype.update=function(){//Se hace un update a la posición en la que aparece en pantalla
    this.setPosition();
  };
  Pill.prototype.setPosition=function(){
    this.x=16*this.cellPosition[0]+this.xOffset;
    this.y=16*this.cellPosition[1]+this.yOffset;
    this.attachedPill.sprite.x=16*this.attachedPill.cellPosition[0]+this.xOffset;
    this.attachedPill.sprite.y=16*this.attachedPill.cellPosition[1]+this.yOffset;
  }
  Pill.prototype.setFallSpeed = function(fallSpeed)
  {
    this.fallLoop.delay= fallSpeed;
  }
  Pill.prototype.move = function(keyInput){//Recibe una tecla del inputManager y mueve su posición
      if(keyInput=='r'){//Derecha
        this.cellPosition[0]++;
        this.attachedPill.cellPosition[0]++;
        if(this.cellPosition[0]>=8 || this.attachedPill.cellPosition[0]>=8){//Recoloca las píldoras dependiendo de quién esté a la derecha
          this.cellPosition[0]--;
          this.attachedPill.cellPosition[0]--;
        }
        else if(!this.availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada a la derecha
          || !this.availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
          this.cellPosition[0]--;
          this.attachedPill.cellPosition[0]--;
        }
      }
      else if(keyInput=='l'){//Izquierda
        this.cellPosition[0]--;
        this.attachedPill.cellPosition[0]--;
        if(this.cellPosition[0]<0 || this.attachedPill.cellPosition[0]<0){//Recoloca las píldoras dependiendo de quién esté a la izquierda
            this.cellPosition[0]++;
            this.attachedPill.cellPosition[0]++;
        }
        else if(!this.availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada a la izquierda
          || !this.availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
            this.cellPosition[0]++;
            this.attachedPill.cellPosition[0]++;
        }
      }
    }
    Pill.prototype.setRotation = function(rotDir){
      //Coloca la píldora según el estado actual de la rotación
        this.rotationState+=rotDir;
        if(this.rotationState>=4){
          this.rotationState=0;
        }
        else if(this.rotationState<0){
          this.rotationState=3;
        }

        if(this.canRotate(this.cellPosition[0],this.cellPosition[1],this.attachedPill.cellPosition[0],this.attachedPill.cellPosition[1],this.attachedPill.rotOffset, rotDir)){
          this.attachedPill.cellPosition[0]=this.cellPosition[0]+this.attachedPill.rotOffset[this.rotationState][0];
          this.attachedPill.cellPosition[1]=this.cellPosition[1]+this.attachedPill.rotOffset[this.rotationState][1];
        }
        this.angle = this.rotationState*90;//Rota el sprite
        this.attachedPill.sprite.angle = this.rotationState*90;
 }
    Pill.prototype.canRotate = function (auxX1,auxY1,auxX2,auxY2,rotOffset, rotDir){
      //Comprueba que al rotar las nuevas posiciones estarán disponibles
      auxX1 +=rotOffset[this.rotationState][0];
      auxY1 +=rotOffset[this.rotationState][1];
      auxX2 +=rotOffset[this.rotationState][0];
      auxY2 +=rotOffset[this.rotationState][1];
      if(this.availableCell(auxX1,auxY1) && this.availableCell(auxX2, auxY2)){
        return true;
      }
      else {
        if(rotDir>0){
        this.rotationState--;
        }
        else if(rotDir<0) this.rotationState++;
      return false;
      }
    }
  Pill.prototype.switchPillSides = function(){//Intercambia las posiciones de los dos lados de la píldora
    var auxX = this.cellPosition[0];
    var auxY = this.cellPosition[1];
    this.cellPosition[0] = this.attachedPill.cellPosition[0];
    this.cellPosition[1] = this.attachedPill.cellPosition[1];
    this.attachedPill.cellPosition[0] = auxX;
    this.attachedPill.cellPosition[1] = auxY;
  }
  Pill.prototype.fall = function(){//Función de caída que se repite en bucle

    if(board.pillBroken){
      var arrayHalfPills = board.checkBrothers();
      board.pillBroken=false;
      board.collapsePills();
      if(arrayHalfPills.length>0){
        board.pillBroken=true;

      }
      else {//Cuando hayan colapsado todas comprueba sus adyacentes
        board.checkAdjacentInBoard();
      }
    }
    else{
      this.cellPosition[1]++;
      this.attachedPill.cellPosition[1]++;
      if(!this.availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada debajo
        || !this.availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
          this.cellPosition[1]--;
          this.attachedPill.cellPosition[1]--;
          this.copyPill();
          board.checkAdjacentColors(this.color, this.cellPosition[0], this.cellPosition[1]);
          board.checkAdjacentColors(this.attachedPill.color, this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1]);
          this.attachedPill.sprite.destroy();
          this.changePill();

          }
      }
    }
  Pill.prototype.copyPill = function(){//Copia los valores de la píldora al tablero
    board.cells[this.cellPosition[1]][this.cellPosition[0]].setBrother(this.attachedPill.cellPosition[0],this.attachedPill.cellPosition[1]);
    board.cells[this.cellPosition[1]][this.cellPosition[0]].changeCell(this.color, 'Pill', this.rotationState,false);
    board.cells[this.attachedPill.cellPosition[1]][this.attachedPill.cellPosition[0]].setBrother(this.cellPosition[0],this.cellPosition[1]);
    board.cells[this.attachedPill.cellPosition[1]][this.attachedPill.cellPosition[0]].changeCell(this.attachedPill.color, 'Pill', this.rotationState, true);
  }
  Pill.prototype.changePill =function(){
      this.startPill(3,1,colors[this.game.rnd.integerInRange(0, 2)],colors[this.game.rnd.integerInRange(0, 2)]);
    }
module.exports = {
  Item : Item,
  Pill : Pill,
}

},{}],3:[function(require,module,exports){
'use strict';

var GameScene = require('./play_game.js');
var MenuScene = require('./menu.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.baseURL = 'https://aramissss.github.io/PVLICirujanosDe5/plantilla-juego/src/';
    this.game.load.crossOrigin = 'anonymous';
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.image('menuButton','images/menuButton.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.load.image('menuButton','images/menuButton.png');
  },

  create: function () {
    this.game.state.start('menu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('playGame', GameScene);
  game.state.add('menu', MenuScene)

  game.state.start('boot');
};

},{"./menu.js":4,"./play_game.js":5}],4:[function(require,module,exports){
'use strict'
var Button;
var MenuScene = {
  create: function () {
    Button = this.add.button(this.game.world.centerX-100,
      this.game.world.centerY-100,
       'menuButton',this.start,this);
    Button.scale.setTo(0.2,0.2);
  },
  start: function(menuButton) {
    this.game.state.start('playGame')
  }
};

module.exports = MenuScene;

},{}],5:[function(require,module,exports){
'use strict';
var item = require('./item.js');
var gameBoard = require('./game_board.js');
var Item = item.Item;
var Pill = item.Pill;

var GameBoard = gameBoard.gameBoard;
var Cell= gameBoard.cell;

var cursors;
var ZKey;
var XKey;
var board;
var currentPill;
var glass;
var game;
var level;
var maxY;//Altura máxima a la que puede aparecer un virus

var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
var fallDelay;
var timer, fallLoop, moveLoop;

var keyInput='';

var rotDir=0;//0=null 1=clockwise -1=anticlockwise
var GameScene = {};
GameScene.preload = function(){//Carga los sprites
  this.game.load.image('blue', 'images/blue.png');
  this.game.load.image('yellow', 'images/yellow.png');
  this.game.load.image('red', 'images/red.png');
  this.game.load.image('bluePill', 'images/bluePill.png');
  this.game.load.image('yellowPill', 'images/yellowPill.png');
  this.game.load.image('redPill', 'images/redPill.png');
  this.game.load.image('blueVirus', 'images/blueVirus.png');
  this.game.load.image('yellowVirus', 'images/yellowVirus.png');
  this.game.load.image('redVirus', 'images/redVirus.png');
  this.game.load.image('glass', 'images/glass.png');
  this.game.load.image('blank', 'images/blank.png');
}
GameScene.create = function(){
    //Añade el sprite de fondo
    level=0;
    fallDelay=lowSpeed;
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    game=this.game;
    glass.scale.setTo(2,2);
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
    ZKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    XKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
    board = new GameBoard(game);
    currentPill = new Pill(game, 3,0, 'red','yellow', board);//Crea píldota nueva
    game.add.existing(currentPill);//La añade al game
    setLevel();

  }
GameScene.update = function() {
    inputManager();
    currentPill.move(keyInput);
    checkGameEnd();
    game.debug.text("Virus Left: " + board.virus, 32, 80);
    game.debug.text("Level: " + level, 32, 32);


  }
function checkGameEnd(){
  if(board.virus<=0){
    level++;
    board.clearBoard();
    currentPill.attachedPill.sprite.destroy();
    setLevel();
  }
  else if(board.checkGameOver()){
    level=0;
    board.clearBoard();
    currentPill.attachedPill.sprite.destroy();
    setLevel();
  }
}
function setLevel(){
  board.createBoard(level);
  currentPill.startPill(3,1,'red','yellow');


}
function inputManager(){
    if(cursors.right.isDown && !board.pillBroken){
      if(cursors.right.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput='r';
      }
      else if(cursors.right.duration>250){
        keyInput='r';
      }
      else {
        keyInput='';
      }
    }
    else if(cursors.left.isDown && !board.pillBroken){
      if(cursors.left.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput='l';
      }
      else if(cursors.left.duration>250){
        keyInput='l';
      }
      else {
        keyInput='';
      }
    }
    else{
      keyInput='';
    }
    if(XKey.isDown && XKey.duration<1 && !board.pillBroken) {//Clockwise
      rotDir=1;
      currentPill.setRotation(rotDir);
    }
    else if(ZKey.isDown && ZKey.duration<1 && !board.pillBroken){//Anticlockwise
      rotDir=-1;
      currentPill.setRotation(rotDir);
    }
    else {
      rotDir=0;
    }

    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       currentPill.setFallSpeed(100);
    }
    else{
      currentPill.setFallSpeed(currentPill.fallDelay);
    }
  }
module.exports = GameScene;

},{"./game_board.js":1,"./item.js":2}]},{},[3]);
