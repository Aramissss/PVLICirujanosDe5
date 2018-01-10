'use strict';
var item = require('./item.js');
var gameBoard = require('./game_board.js');
var options1 = require ('./options1.js');
var Item = item.Item;
var Pill = item.Pill;

var GameBoard = gameBoard.gameBoard;
var Cell= gameBoard.cell;

var level;
var cursors;
var ZKey;
var XKey;
var board;
var currentPill;
var glass;
var background;
var game;

var maxY;//Altura máxima a la que puede aparecer un virus

var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
var fallDelay;
var timer, fallLoop, moveLoop;
var level;
var DrMariano;
var keyInput='';
var DrMarianoBackground;
var scoreWindow1;
var scoreWindow2;
var rotDir=0;//0=null 1=clockwise -1=anticlockwise
var GameScene = {};
var levelText1;
var levelText2;
var speedText1;
var speedText2;
var scoreText1;
var scoreText2;
var virusText1;
var virusText2;
var nextPill1;
var nextPill2;
var speedString;
var score;
var DrMarianoTitle;
GameScene.preload = function(){

}
GameScene.create = function(){
    score=0;
    //Añade el sprite de fondo
    level = options1.level;
    setSpeed();
    game=this.game;
    board = new GameBoard(game);
    this.setGUI();

    ZKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    XKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores

    currentPill = new Pill(game, 3,0, 'red','yellow', board);//Crea píldota nueva
    game.add.existing(currentPill);//La añade al game
    setLevel();

  }
GameScene.update = function() {
    inputManager();
    currentPill.move(keyInput);
    checkGameEnd();
    updateGUI();
  }
GameScene.setGUI = function(){
    background = this.game.add.sprite(0,0, 'background1');
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
    DrMarianoBackground = this.game.add.sprite(425,115,'optionsWindow');
    DrMarianoBackground.scale.setTo(0.25,0.25);
    DrMarianoTitle = this.game.add.sprite(86,0,'DrMarianoTitle');

    scoreWindow1 = this.game.add.sprite(410,250,'scoreWindow');
    levelText1 = this.game.add.bitmapText(430,280,'pixel','LEVEL',45);
    levelText2 = this.game.add.bitmapText(500,310,'pixel',level,45);
    speedText1 = this.game.add.bitmapText(430,340,'pixel','SPEED',45);
    speedText2 = this.game.add.bitmapText(480,370,'pixel',speedString,45);
    virusText1 = this.game.add.bitmapText(430,400,'pixel','VIRUS',45);
    virusText2 = this.game.add.bitmapText(500,430,'pixel',board.virus,45);

    scoreWindow2 = this.game.add.sprite(30,115,'scoreWindow2');
    scoreText1 = this.game.add.bitmapText(55,140,'pixel','SCORE',45);
    scoreText2 = this.game.add.bitmapText(55,165,'pixel',board.score,45);

    levelText1.tint = levelText2.tint = speedText1.tint = speedText2.tint = 0;
    virusText1.tint = virusText2.tint = scoreText1.tint = scoreText2.tint = 0;
    nextPill1 = this.game.add.sprite(455,135,'');
    nextPill2 = this.game.add.sprite(487,135,'');
    nextPill2.scale.setTo(-1,1);
    DrMariano = this.game.add.sprite(450, 150, 'DrMariano');
  }
function setSpeed(){
  if(options1.speed==0){
    speedString='LOW';
  }
  else if( options1.speed==1){
    speedString='MED';
  }
  else speedString='HI';
}
function updateGUI(){
    levelText2.text = level;
    virusText2.text = board.virus;
    scoreText2.text = board.score;
    nextPill1.loadTexture(currentPill.nextPill.color1 + 'Pill');
    nextPill2.loadTexture(currentPill.nextPill.color2 + 'Pill');
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
