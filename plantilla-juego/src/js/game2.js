'use strict';
var item = require('./item.js');
var gameBoard = require('./game_board.js');
var options2 = require ('./options2.js');
var Item = item.Item;
var Pill = item.Pill;

var GameBoard = gameBoard.gameBoard;
var Cell= gameBoard.cell;

var GameScene2 = {};
GameScene2.preload = function(){

}
GameScene2.create = function(){
    this.aKey;//Teclas para el jugador 2
    this.dKey;
    this.wKey;
    this.sKey;
    this.vKey;
    this.bKey;
    this.cursors;
    this.oKey;
    this.pKey;

    this.board1;
    this.board2;
    this.pillP1;
    this.pillP2;
    this.glass1;
    this.glass2;
    this.background;
    this.game;

    this.maxY1;//Altura máxima a la que puede aparecer un virus
    this.maxY2;
    this.paused=false;

    this.lowSpeed=500;
    this.mediumSpeed=400;
    this.highSpeed=250;
    this.fallDelay;
    this.timer, this.fallLoop, this.moveLoop;

    this.speed1;
    this.speed2;

    this.keyInput1='';
    this.keyInput2='';

    this.rotDir1=0;//0=null 1=clockwise -1=anticlockwise
    this.rotDir2=0;


    this.levelText1;
    this.levelText2;
    this.speedText1;
    this.speedText2;

    this.virusText1;
    this.virusText2;

    this.nextPill11;
    this.nextPill12;
    this.nextPill21;
    this.nextPill22;

    this.P1text;
    this.P2text;
    this.levelText;
    this.P2levelText;
    this.P1levelText;
    this.P1speedText;
    this.P2speedText;
    this.P1virusText;
    this.P2virusText;
    this.virusText;
    this.scoreFrame;
    this.P1score;
    this.P2score;
    this.pressEntertext;

    this.crown11;
    this.crown12;
    this.crown13;
    this.crown21;
    this.crown22;
    this.crown23;
    this.gameOver;

    this.advertWindow1;
    this.advertWindow2;
    this.advertText1;
    this.advertText2;
    this.scoreWindow;
    this.levelWindow;
    this.advertString1;
    this.advertString2;
    this.mainLoop;
    this.enterKey;

    this.speedString1;
    this.speedString2;
    this.gameOver=false;
    //Añade el sprite de fondo
    this.P1score=0;
    this.P2score=0;
    this.level1 = options2.level1;
    this.level2 = options2.level2;
    this.setSpeedString();
    this.game=this.game;

    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.oKey = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
    this.pKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
    this.vKey = this.game.input.keyboard.addKey(Phaser.Keyboard.V);
    this.bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
    this.cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores

    this.board1 = new GameBoard(this.game,74,165);

    this.board2 = new GameBoard(this.game,424,165);

    this.setGUI();

    this.pillP1 = new Pill(this.game, 3,0, 'red','yellow', this.board1,74,165);//Crea píldota nueva
    this.pillP1.setFallDelay(500-options2.speed1*150)
    this.setLevel1();

    this.pillP2 = new Pill(this.game, 3,0, 'blue','yellow', this.board2,424,165);//Crea píldota nueva
    this.pillP2.setFallDelay(500-options2.speed2*150)
    this.setLevel2();

    this.game.add.existing(this.pillP1);//La añade al game
    this.game.add.existing(this.pillP2);//La añade al game

    this.mainLoop = this.game.time.events.loop(0, this.runLoop, this);
    this.mainLoop.timer.start();

  }
GameScene2.update = function() {
    this.inputManager();
  }
GameScene2.runLoop = function(){
  if(!this.paused){
    this.pillP1.move(this.keyInput1);
    this.pillP2.move(this.keyInput2);
    this.checkGameEnd();
    this.updateGUI();
  }
}
GameScene2.setGUI = function(){
    this.background = this.game.add.sprite(0,0, 'background3');
    this.glass1 = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    this.glass1.x =50;
    this.glass1.y =110;
    this.glass2 = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    this.glass2.x =400;
    this.glass2.y =110;
    this.advertWindow1 = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'advertWindow');
    this.advertWindow1.x =this.glass1.x;
    this.advertWindow1.y =this.glass1.y;
    this.advertWindow2 = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'advertWindow');
    this.advertWindow2.x =this.glass2.x;
    this.advertWindow2.y =this.glass2.y;
    this.advertWindow1.visible = this.advertWindow2.visible = false;
    this.advertString1='';
    this.advertString2='';
    this.pressEntertext = this.game.add.bitmapText(175,450,'pixel','PRESS ENTER',55);
    this.advertText1 = this.game.add.bitmapText(77,250,'pixel',this.advertString1,45);
    this.advertText2 = this.game.add.bitmapText(430,250,'pixel',this.advertString2,45);
    this.advertText1.tint = this.advertText2.tint =0;
    this.advertText1.visible = this.advertText2.visible = this.pressEntertext.visible =false;

    this.levelWindow = this.game.add.sprite(192,20,'scoreWindow2');
    this.levelWindow.scale.setTo(1.5,1.4)
    this.scoreWindow = this.game.add.sprite(210,170,'scoreWindow');
    this.scoreWindow.scale.setTo(1.27,1);
    this.scoreFrame = this.game.add.sprite(255,195,'scoreFrame');

    this.P1text = this.game.add.bitmapText(220,40,'pixel','P1',40);
    this.P2text = this.game.add.bitmapText(360,40,'pixel','P2',40);
    this.P1speedText = this.game.add.bitmapText(220,100,'pixel',this.speedString1,50);
    this.P2speedText = this.game.add.bitmapText(327,100,'pixel',this.speedString2,50);
    this.levelText1 = this.game.add.bitmapText(270,50,'pixel','LEVEL',35);
    this.P1levelText = this.game.add.bitmapText(265,70,'pixel',this.level1,45);
    this.P2levelText = this.game.add.bitmapText(340,70,'pixel',this.level2,45);
    this.virusText = this.game.add.bitmapText(260,320,'pixel','VIRUS',50);
    this.P1virusText = this.game.add.bitmapText(245,350,'pixel',this.board1.virus,50);
    this.P2virusText = this.game.add.bitmapText(340,350,'pixel',this.board2.virus,50);

    this.levelText1.tint = this.P1levelText.tint = this.P2levelText.tint=  0;
    this.virusText.tint = this.P1virusText.tint = this.P2virusText.tint = 0 ;
    this.P1text.tint = this.P2text.tint = 0;
    this.P1speedText.tint = this.P2speedText.tint = 0;

    this.nextPill11 = this.game.add.sprite(114,122,'');
    this.nextPill12 = this.game.add.sprite(146,122,'');
    this.nextPill12.scale.setTo(-1,1);
    this.nextPill21 = this.game.add.sprite(464,122,'');
    this.nextPill22 = this.game.add.sprite(496,122,'');
    this.nextPill22.scale.setTo(-1,1);

  }
GameScene2.endGame = function(){
    this.board1.clearBoard();
    this.pillP1.visible=false;
    this.pillP1.attachedPill.sprite.destroy();
    this.board2.clearBoard();
    this.pillP2.visible=false;
    this.pillP2.attachedPill.sprite.destroy();
    this.gameOver=true;
    this.advertWindow1.visible = this.advertWindow2.visible=true;
    if(this.P1score==3){
      this.advertString1='Winner';
      this.advertString2='Loser';
    }
    else {
      this.advertString1='Loser';
      this.advertString2='Winner';
    }
    this.advertText1.text = this.advertString1;
    this.advertText2.text = this.advertString2;
    this.advertText1.visible = this.advertText2.visible = this.pressEntertext.visible =true;
  }
GameScene2.setSpeedString = function(){

  if(options2.speed1==0){
    this.speedString1='LOW';
  }
  else if( options2.speed1==1){
    this.speedString1='MED';
  }
  else this.speedString1='HI';
  if(options2.speed2==0){
    this.speedString2='LOW';
  }
  else if( options2.speed2==1){
    this.speedString2='MED';
  }
  else this.speedString2='HI';
}
GameScene2.updateGUI = function(){
    this.P1levelText.text = this.level1;
    this.P2levelText.text = this.level2;
    this.P1virusText.text = this.board1.virus;
    this.P2virusText.text = this.board2.virus;
    this.advertText1.text = this.advertString1;
    this.advertText2.text = this.advertString2;

    this.nextPill11.loadTexture(this.pillP1.nextPill.color1 + 'Pill');
    this.nextPill12.loadTexture(this.pillP1.nextPill.color2 + 'Pill');
    this.nextPill21.loadTexture(this.pillP2.nextPill.color1 + 'Pill');
    this.nextPill22.loadTexture(this.pillP2.nextPill.color2 + 'Pill');
    this.setCrowns();
  }
GameScene2.pauseGame = function(){
    this.pressEntertext.visible = true;
    this.mainLoop.timer.pause();
    this.paused=true;
  }
GameScene2.resumeGame = function(){
    this.pressEntertext.visible = false;
    this.resetBoards();
    this.mainLoop.timer.resume();
    this.paused=false;
}
GameScene2.checkGameEnd = function(){
  if(this.board1.virus<=0){
    this.P1score++;
    this.pauseGame();
  }
  else if(this.board1.checkGameOver()){
    this.P2score++;
    this.pauseGame();
  }
  else if(this.board2.virus<=0){
    this.P2score++;
    this.pauseGame();
  }
  else if(this.board2.checkGameOver()){
    this.P1score++;
    this.pauseGame();
  }
}
GameScene2.resetBoards = function(){
  this.board1.clearBoard();
  this.pillP1.attachedPill.sprite.destroy();
  this.setLevel1();
  this.board2.clearBoard();
  this.pillP2.attachedPill.sprite.destroy();
  this.setLevel2();
  this.setCrowns();
}
GameScene2.setLevel1 = function(){
  this.board1.createBoard(this.level1);
  this.pillP1.startPill(3,1,'red','yellow');
}
GameScene2.setLevel2 = function(){
  this.board2.createBoard(this.level2);
  this.pillP2.startPill(3,1,'blue','yellow');
}
GameScene2.goToMenu = function(){
  this.game.state.start('menu');
}
GameScene2.setCrowns = function(){
  if(this.P1score==1){
    this.crown11 = GameScene2.game.add.sprite(257,280,'crown');
  }
  else if(this.P1score==2){
    this.crown12 = GameScene2.game.add.sprite(257,240,'crown');
  }
  else if(this.P1score==3){
    this.crown13 = GameScene2.game.add.sprite(257,200,'crown');
    this.endGame();
  }
  if(this.P2score==1){
    this.crown21 = GameScene2.game.add.sprite(305,280,'crown');
  }
  else if(this.P2score==2){
    this.crown22 = GameScene2.game.add.sprite(305,240,'crown');
  }
  else if(this.P2score==3){
    this.crown23 = GameScene2.game.add.sprite(305,200,'crown');
    this.endGame();
  }
}
GameScene2.inputP1 = function(){
  if(this.dKey.isDown && !this.board1.pillBroken){
      if(this.dKey.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        this.keyInput1='r';
      }
      else if(this.dKey.duration>250){
        this.keyInput1='r';
      }
      else {
        this.keyInput1='';
      }
    }
    else if(this.aKey.isDown && !this.board1.pillBroken){
      if(this.aKey.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        this.keyInput1='l';
      }
      else if(this.aKey.duration>250){
        this.keyInput1='l';
      }
      else {
        this.keyInput1='';
      }
    }
    else{
      this.keyInput1='';
    }
    if(this.bKey.isDown && this.bKey.duration<1 && !this.board1.pillBroken) {//Clockwise
      this.rotDir1=1;
      this.pillP1.setRotation(this.rotDir1);
    }
    else if(this.vKey.isDown && this.vKey.duration<1 && !this.board1.pillBroken){//Anticlockwise
      this.rotDir1=-1;
      this.pillP1.setRotation(this.rotDir1);
    }
    else {
      this.rotDir1=0;
    }

    if(this.sKey.isDown){//Cuando se pulsa hacia abajo el delay es menor
       this.pillP1.setFallSpeed(100);
    }
    else{
      this.pillP1.setFallSpeed(this.pillP1.fallDelay);
    }
}
GameScene2.inputP2 = function(){
   if(this.cursors.right.isDown && !this.board2.pillBroken){
      if(this.cursors.right.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        this.keyInput2='r';
      }
      else if(this.cursors.right.duration>250){
        this.keyInput2='r';
      }
      else {
        this.keyInput2='';
      }
    }
    else if(this.cursors.left.isDown && !this.board2.pillBroken){
      if(this.cursors.left.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        this.keyInput2='l';
      }
      else if(this.cursors.left.duration>250){
        this.keyInput2='l';
      }
      else {
        this.keyInput2='';
      }
    }
    else{
      this.keyInput2='';
    }
    if(this.pKey.isDown && this.pKey.duration<1 && !this.board2.pillBroken) {//Clockwise
      this.rotDir2=1;
      this.pillP2.setRotation(this.rotDir2);
    }
    else if(this.oKey.isDown && this.oKey.duration<1 && !this.board2.pillBroken){//Anticlockwise
      this.rotDir2=-1;
      this.pillP2.setRotation(this.rotDir2);
    }
    else {
      this.rotDir2=0;
    }

    if(this.cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
      this.pillP2.setFallSpeed(100);
    }
    else{
      this.pillP2.setFallSpeed(this.pillP2.fallDelay);
    }
}
GameScene2.inputManager = function(){
    this.inputP1();
    this.inputP2();
    if(this.enterKey.isDown && this.paused && !this.gameOver){
        this.resumeGame();
    }
    if(this.enterKey.isDown && this.gameOver){
      this.mainLoop.timer.resume();
      this.goToMenu();
    }
  }
module.exports = GameScene2;
