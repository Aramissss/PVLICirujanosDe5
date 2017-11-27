'use strict';
var item = require('./item.js');
var Item = item.Item;
var Pill = item.Pill;

var cursors;
var currentPill;
var glass;


//'none' 'blue' 'yellow' 'red'
var cells = [];//Array que contiene las casillas
var fallDelay=500;
var timer, fallLoop, moveLoop;
var inputStartTime;
var moveDelay=fallDelay/4;
var keyInput='';
var cellWidth, cellHeight;
var movable;

var GameScene = {};
GameScene.preload = function(){//Carga los sprites
  this.game.load.image('blue', 'images/blue.png');
  this.game.load.image('yellow', 'images/yellow.png');
  this.game.load.image('red', 'images/red.png');
  this.game.load.image('glass', 'images/glass.png');
}
GameScene.create = function(){
    //Añade el sprite de fondo
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    glass.scale.setTo(2,2);
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
    cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
    cellWidth=16;//Medidas de las celdas
    cellHeight=16;
    for(var i=0; i<16;i++){//Crea array vacío
      cells[i]=[];
      for(var j=0; j<8;j++){
        cells[i][j]='none';
      }
    }
    currentPill = new Pill(this.game, 3,0, 'red','yellow');//Crea píldota nueva
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
  }

//Método que devuelve un booleano dependiendo de si la celda contiene algún color
function availableCell(x,y){
    if(cells[y][x]=='none'){
      return true;
    }
    else return false;
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
    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       fallLoop.delay=200;
    }
    else{
       fallLoop.delay=500;
    }
  }

module.exports = GameScene;
