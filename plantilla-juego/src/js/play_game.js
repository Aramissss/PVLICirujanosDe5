'use strict';
var item = require('./item.js');
var gameBoard = require('./game_board.js');
var Item = item.Item;
var Pill = item.Pill;
var HalfPill = item.HalfPill;
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
  this.game.load.image('bluePill', 'images/blue.png');
  this.game.load.image('yellowPill', 'images/yellow.png');
  this.game.load.image('redPill', 'images/red.png');
  this.game.load.image('blueVirus', 'images/blueVirus.png');
  this.game.load.image('yellowVirus', 'images/yellowVirus.png');
  this.game.load.image('redVirus', 'images/redVirus.png');
  this.game.load.image('glass', 'images/glass.png');
  this.game.load.image('blank', 'images/blank.png');
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

    board = new GameBoard(game);
    level=1;
    if(level>=15){
      maxY=4;
    }
    else if(level>=10){
      maxY=7;
    }
    else maxY=10;
    board.createVirus(level*4+4,maxY);
    currentPill = new Pill(game, 3,0, 'red','yellow', board);//Crea píldota nueva
    currentPill.startPill(3,1,'red','yellow');   
    
    this.game.add.existing(currentPill);//La añade al game
    
    /*timer = this.game.time.events;//Temporizador
    fallLoop = timer.loop(fallDelay, currentPill.fall, currentPill);//Bucle de caída
    timer.start();*/
  }

GameScene.update = function() {
    inputManager();
    currentPill.move(keyInput);

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
      currentPill.setRotation(rotDir);
    }
    else if(ZKey.isDown && ZKey.duration<1){//Anticlockwise
      rotDir=-1;
      currentPill.setRotation(rotDir);
    }
    else {
      rotDir=0;
    }

    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       //fallLoop.delay=100;
       currentPill.setFallSpeed(100);
    }
    else{
      // fallLoop.delay=fallDelay;
      currentPill.setFallSpeed(currentPill.fallDelay);
    }
  }



module.exports = GameScene;
