'use strict';
var item = require('./item.js');
var Item = item.Item;
var Pill = item.Pill;

var cursors;
var ZKey;
var XKey;
var currentPill;
var glass;
var game;

//'none' 'blue' 'yellow' 'red'
var cells = [];//Array que contiene las casillas
var cellsSprites = [];//Array que contiene los sprites de las casillas
var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
var fallDelay;
var timer, fallLoop, moveLoop;
var inputStartTime;
var moveDelay=fallDelay/4;
var keyInput='';
var cellWidth, cellHeight;
var movable;
var colors = ['blue', 'yellow', 'red'];
var rotDir=0;//0=null 1=clockwise -1=anticlockwise

var GameScene = {};
GameScene.preload = function(){//Carga los sprites
  this.game.load.image('blue', 'images/blue.png');
  this.game.load.image('yellow', 'images/yellow.png');
  this.game.load.image('red', 'images/red.png');
  this.game.load.image('glass', 'images/glass.png');
}
GameScene.create = function(){
    //Añade el sprite de fondo
    fallDelay=lowSpeed;
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    game=this.game;
    glass.scale.setTo(2,2);
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
    ZKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    XKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
    cellWidth=16;//Medidas de las celdas
    cellHeight=16;
    for(var i=0; i<17;i++){//Crea array vacío
        cells[i]=[];
      for(var j=0; j<8;j++){
        cells[i][j]='none';
      }
    }
    for(var i=0; i<17;i++){//Crea array vacío
      cellsSprites[i]=[];
      for(var j=0; j<8;j++){
        cellsSprites[i][j]='none';
        cellsSprites[i][j] = game.add.sprite(16*j+336,16*i+180);//Les añade sprites vaciós a las celdas
      }
    }

    currentPill = new Pill(this.game, 3,0, 'red','yellow');//Crea píldota nueva
    currentPill.startPill(3,1,'red','yellow');
    currentPill.scale.setTo(2,2);
    currentPill.anchor.setTo(0,0);
    this.game.add.existing(currentPill);//La añade al game

    timer = this.game.time.events;//Temporizador
    fallLoop = timer.loop(fallDelay, currentPill.fall, currentPill);//Bucle de caída
    timer.start();
  }

GameScene.update = function() {
    inputManager();
    currentPill.move(keyInput);

    paintMap();
  }

function inputManager(){
    if(cursors.right.isDown){
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
    else if(cursors.left.isDown){
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
    if(XKey.isDown && XKey.duration<1) {//Clockwise
      rotDir=1;
      currentPill.rotate(rotDir);
    }
    else if(ZKey.isDown && ZKey.duration<1){//Anticlockwise
      rotDir=-1;
      currentPill.rotate(rotDir);
    }
    else {
      rotDir=0;
    }

    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       fallLoop.delay=100;
    }
    else{
       fallLoop.delay=fallDelay;
    }
  }
      //Método que devuelve un booleano dependiendo de si la celda contiene algún color
    global.availableCell = function(x,y){
          if(cells[y][x]=='none'){
            return true;
          }
          else return false;
        }

    global.changePill =function(){
      var auxY = currentPill.cellPosition[0];
      var auxX = currentPill.cellPosition[1];
      cells[auxX][auxY] = currentPill.color;

      auxY = currentPill.attachedPill.cellPosition[0];
      auxX = currentPill.attachedPill.cellPosition[1];
      cells[auxX][auxY] = currentPill.attachedPill.color;//Marca el color de las píldoras en la celda correspondiente

      currentPill.startPill(3,1,colors[game.rnd.integerInRange(0, 2)],colors[game.rnd.integerInRange(0, 2)]);
    }
    function paintMap(){
      for(var i=0; i<17;i++){
        for(var j=0; j<8;j++){
          if(cells[i][j]=='yellow'){
            cellsSprites[i][j].loadTexture('yellow');
            cellsSprites[i][j].scale.setTo(2,2);
            cellsSprites[i][j].anchor.setTo(0,0);
          }
          else if(cells[i][j]=='red'){
            cellsSprites[i][j].loadTexture('red');
            cellsSprites[i][j].scale.setTo(2,2);
            cellsSprites[i][j].anchor.setTo(0,0);
          }
          else if(cells[i][j]=='blue'){
            cellsSprites[i][j].loadTexture('blue');
            cellsSprites[i][j].scale.setTo(2,2);
            cellsSprites[i][j].anchor.setTo(0,0);
          }
        }
      }
    }


module.exports = GameScene;
