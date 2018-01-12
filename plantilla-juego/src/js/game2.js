'use strict';
var item = require('./item.js');
var gameBoard = require('./game_board.js');
var options2 = require ('./options2.js');
var Item = item.Item;
var Pill = item.Pill;

var GameBoard = gameBoard.gameBoard;
var Cell= gameBoard.cell;

var aKey;//Teclas para el jugador 2
var dKey;
var wKey;
var sKey;
var vKey;
var bKey;
var cursors;
var oKey;
var pKey;

var board1;
var board2;
var pillP1;
var pillP2;
var glass1;
var glass2;
var background;
var game;

var maxY1;//Altura máxima a la que puede aparecer un virus
var maxY2;

var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
var fallDelay;
var timer, fallLoop, moveLoop;

var level1;
var level2;

var speed1;
var speed2;

var keyInput1='';
var keyInput2='';

var rotDir1=0;//0=null 1=clockwise -1=anticlockwise
var rotDir2=0;
var GameScene2 = {};

var levelText1;
var levelText2;
var speedText1;
var speedText2;

var virusText1;
var virusText2;

var nextPill11;
var nextPill12;
var nextPill21;
var nextPill22;

var speedString;

GameScene2.preload = function(){

}
GameScene2.create = function(){

    //Añade el sprite de fondo
    level1 = options2.level1;
    level2 = options2.level2;
    setSpeed();
    game=this.game;

    aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    oKey = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
    pKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    vKey = this.game.input.keyboard.addKey(Phaser.Keyboard.V);
    bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
    cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores

    board1 = new GameBoard(game,50,100);   
    
    board2 = new GameBoard(game,400,100);
   
    this.setGUI();

    pillP1 = new Pill(game, 3,0, 'red','yellow', board1,50,100);//Crea píldota nueva
    setLevel1();
   
    pillP2 = new Pill(game, 3,0, 'blue','yellow', board2,400,100);//Crea píldota nueva  
    setLevel2();

    game.add.existing(pillP1);//La añade al game
    game.add.existing(pillP2);//La añade al game
    

  }
GameScene2.update = function() {
    inputManager();
    pillP1.move(keyInput1);
    pillP2.move(keyInput2);
    checkGameEnd();
    updateGUI();
  }
GameScene2.setGUI = function(){
    background = this.game.add.sprite(0,0, 'background3');
    glass1 = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    glass1.x =50;
    glass1.y =50;
    glass2 = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    glass2.x =400;
    glass2.y =50;

    levelText1 = this.game.add.bitmapText(430,280,'pixel','LEVEL',45);
    levelText2 = this.game.add.bitmapText(500,310,'pixel',level1,45);
    speedText1 = this.game.add.bitmapText(430,340,'pixel','SPEED',45);
    speedText2 = this.game.add.bitmapText(480,370,'pixel',speedString,45);
    virusText1 = this.game.add.bitmapText(430,400,'pixel','VIRUS',45);
    virusText2 = this.game.add.bitmapText(500,430,'pixel',board1.virus,45);

    levelText1.tint = levelText2.tint = speedText1.tint = speedText2.tint = 0;

    nextPill11 = this.game.add.sprite(100,100,'');
    nextPill12 = this.game.add.sprite(132,100,'');
    nextPill12.scale.setTo(-1,1);
    nextPill21 = this.game.add.sprite(400,100,'');
    nextPill22 = this.game.add.sprite(432,100,'');
    nextPill22.scale.setTo(-1,1);

  }
function setSpeed(){
  if(options2.speed1==0){
    speedString='LOW';
  }
  else if( options2.speed1==1){
    speedString='MED';
  }
  else speedString='HI';
}
function updateGUI(){
    levelText2.text = level1;
    virusText2.text = board1.virus;

    nextPill11.loadTexture(pillP1.nextPill.color1 + 'Pill');
    nextPill12.loadTexture(pillP1.nextPill.color2 + 'Pill');
    nextPill21.loadTexture(pillP2.nextPill.color1 + 'Pill');
    nextPill22.loadTexture(pillP2.nextPill.color2 + 'Pill');
  }
function checkGameEnd(){
  if(board1.virus<=0){

    board1.clearBoard();
    pillP1.attachedPill.sprite.destroy();
    setLevel();
  }
  else if(board1.checkGameOver()){

    board1.clearBoard();
    pillP1.attachedPill.sprite.destroy();
    setLevel();
  }
}
function setLevel1(){
  board1.createBoard(level1);
  pillP1.startPill(3,1,'red','yellow');
}
function setLevel2(){
  board2.createBoard(level2);
  pillP2.startPill(3,1,'blue','yellow');
}
function inputP2(){
  if(dKey.isDown && !board2.pillBroken){
      if(dKey.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput2='r';
      }
      else if(dKey.duration>250){
        keyInput2='r';
      }
      else {
        keyInput2='';
      }
    }
    else if(aKey.isDown && !board2.pillBroken){
      if(aKey.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput2='l';
      }
      else if(aKey.duration>250){
        keyInput2='l';
      }
      else {
        keyInput2='';
      }
    }
    else{
      keyInput2='';
    }
    if(bKey.isDown && bKey.duration<1 && !board2.pillBroken) {//Clockwise
      rotDir2=1;
      pillP2.setRotation(rotDir2);
    }
    else if(vKey.isDown && vKey.duration<1 && !board2.pillBroken){//Anticlockwise
      rotDir2=-1;
      pillP2.setRotation(rotDir2);
    }
    else {
      rotDir2=0;
    }

    if(sKey.isDown){//Cuando se pulsa hacia abajo el delay es menor
       pillP2.setFallSpeed(100);
    }
    else{
      pillP2.setFallSpeed(pillP2.fallDelay);
    }
}
function inputP1(){
   if(cursors.right.isDown && !board1.pillBroken){
      if(cursors.right.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput1='r';
      }
      else if(cursors.right.duration>250){
        keyInput1='r';
      }
      else {
        keyInput1='';
      }
    }
    else if(cursors.left.isDown && !board1.pillBroken){
      if(cursors.left.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput1='l';
      }
      else if(cursors.left.duration>250){
        keyInput1='l';
      }
      else {
        keyInput1='';
      }
    }
    else{
      keyInput1='';
    }
    if(pKey.isDown && pKey.duration<1 && !board1.pillBroken) {//Clockwise
      rotDir1=1;
      pillP1.setRotation(rotDir1);
    }
    else if(oKey.isDown && oKey.duration<1 && !board1.pillBroken){//Anticlockwise
      rotDir1=-1;
      pillP1.setRotation(rotDir1);
    }
    else {
      rotDir1=0;
    }

    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
      pillP1.setFallSpeed(100);
    }
    else{
      pillP1.setFallSpeed(pillP1.fallDelay);
    }
}
function inputManager(){
    inputP1();
    inputP2();
  }
module.exports = GameScene2;
