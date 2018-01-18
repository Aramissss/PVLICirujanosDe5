(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var item = require('./item.js');
var gameBoard = require('./game_board.js');
var options1 = require ('./options1.js');
var Pill = item.Pill;

var GameBoard = gameBoard.gameBoard;
var Cell= gameBoard.cell;
var GameScene1 = {};
var moveFX;
var rotationFX;


GameScene1.preload = function(){

}
GameScene1.create = function(){
    this.level;
    this.cursors;
    this.ZKey;
    this.XKey;
    this.enterKey;
    this.board;
    this.currentPill;
    this.glass;
    this.background;
    this.game;
    moveFX = this.game.add.audio('misc1');
    rotationFX = this.game.add.audio('misc3');

    this.maxY;//Altura máxima a la que puede aparecer un virus

    this.lowSpeed=500;
    this.mediumSpeed=400;
    this.highSpeed=250;
    this.fallDelay;
    this.timer, this.fallLoop, this.moveLoop;
    this.level;
    this.DrMariano;
    this.keyInput='';
    this.DrMarianoShrug;
    this.DrMarianoBackground;
    this.scoreWindow1;
    this.scoreWindow2;
    this.rotDir=0;//0=null 1=clockwise -1=anticlockwise


    this.levelText1;
    this.levelText2;
    this.speedText1;
    this.speedText2;
    this.scoreText1;
    this.scoreText2;
    this.virusText1;
    this.virusText2;
    this.nextPill1;
    this.nextPill2;
    this.speedString;
    this.score;
    this.DrMarianoTitle;
    this.paused;
    this.advertWindow;
    this.advertText1;
    this.advertText2;
    this.advertString1='';
    this.advertString2='';
    this.mainLoop;
    this.pressEntertext;
    this.paused=false;
    this.score=0;
    this.level = options1.level;
    this.setSpeed();
    this.game=this.game;
    this.board = new GameBoard(this.game,244,138);
    this.setGUI();

    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.ZKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.XKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores

    this.currentPill = new Pill(this.game, 3,0, 'red','yellow', this.board,244,138);//Crea píldota nueva
    this.currentPill.setFallDelay(500-options1.speed*150)
    this.game.add.existing(this.currentPill);//La añade al game
    this.setLevel();
    this.mainLoop = this.game.time.events.loop(0, this.runLoop, this);
    this.mainLoop.timer.start();

  }
  GameScene1.moveFX = function(){
    moveFX.play();
  }
  GameScene1.rotationFX = function(){
    rotationFX.play();
  }
GameScene1.update = function() {
    this.inputManager();
  }
  GameScene1.runLoop = function(){

    this.currentPill.move(this.keyInput);
    this.checkGameEnd();
    this.updateGUI();
  }
GameScene1.redVirusDeath = function(){
    this.redVirusAnim.loadTexture('redVirusDeath');
    this.redVirusAnim.animations.add('die');
    this.redVirusAnim.play('die',6,false);
}
GameScene1.blueVirusDeath = function(){
    this.blueVirusAnim.loadTexture('blueVirusDeath');
    this.blueVirusAnim.animations.add('die');
    this.blueVirusAnim.play('die',6,false);
}
GameScene1.yellowVirusDeath = function(){
    this.yellowVirusAnim.loadTexture('yellowVirusDeath');
    this.yellowVirusAnim.animations.add('die');
    this.yellowVirusAnim.play('die',6,false);
}
GameScene1.setVirusGUI = function(){
  this.redVirusAnim=this.game.add.sprite(90,265,'redVirusAnim');
  this.redVirusAnim.scale.setTo(0.7,0.7);
  this.redVirusAnim.animations.add('idle');
  this.redVirusAnim.play('idle',3,true);

  this.blueVirusAnim=this.game.add.sprite(55,335,'blueVirusAnim');
  this.blueVirusAnim.scale.setTo(0.7,0.7);
  this.blueVirusAnim.animations.add('idle');
  this.blueVirusAnim.play('idle',6,true);

  this.yellowVirusAnim=this.game.add.sprite(135,335,'yellowVirusAnim');
  this.yellowVirusAnim.scale.setTo(0.7,0.7);
  this.yellowVirusAnim.animations.add('idle');
  this.yellowVirusAnim.play('idle',6,true);
}
GameScene1.setGUI = function(){
    this.background = this.game.add.sprite(0,0, 'background1');
    this.glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    this.glass.x =this.game.world.centerX-this.glass.width/2;
    this.glass.y =this.game.world.centerY-this.glass.height/2;
    this.advertWindow = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'advertWindow');
    this.advertWindow.x =this.glass.x;
    this.advertWindow.y =this.glass.y;
    this.advertWindow.visible=false;
    this.advertText1 = this.game.add.bitmapText(257,210,'pixel',this.advertString1,45);
    this.advertText2 = this.game.add.bitmapText(257,235,'pixel',this.advertString2,45);
    this.advertText1.tint = this.advertText2.tint =0;
    this.advertText1.visible = this.advertText2.visible = false;
    this.DrMarianoBackground = this.game.add.sprite(425,115,'optionsWindow');
    this.DrMarianoBackground.scale.setTo(0.25,0.25);
    this.DrMarianoTitle = this.game.add.sprite(86,0,'DrMarianoTitle');
    this.pressEntertext = this.game.add.bitmapText(25,450,'pixel','PRESS ENTER',55);
    this.pressEntertext.visible =false;
    this.lens = this.game.add.sprite(10,250, 'lens');
    this.lens.scale.setTo(0.9,0.9);

    this.scoreWindow1 = this.game.add.sprite(410,250,'scoreWindow');
    this.levelText1 = this.game.add.bitmapText(430,280,'pixel','LEVEL',45);
    this.levelText2 = this.game.add.bitmapText(500,310,'pixel',this.level,45);
    this.speedText1 = this.game.add.bitmapText(430,340,'pixel','SPEED',45);
    this.speedText2 = this.game.add.bitmapText(480,370,'pixel',this.speedString,45);
    this.virusText1 = this.game.add.bitmapText(430,400,'pixel','VIRUS',45);
    this.virusText2 = this.game.add.bitmapText(500,430,'pixel',this.board.virus,45);

    this.scoreWindow2 = this.game.add.sprite(30,115,'scoreWindow2');
    this.scoreText1 = this.game.add.bitmapText(55,140,'pixel','SCORE',45);
    this.scoreText2 = this.game.add.bitmapText(55,165,'pixel',this.board.score,45);

    this.levelText1.tint = this.levelText2.tint = this.speedText1.tint = this.speedText2.tint = 0;
    this.virusText1.tint = this.virusText2.tint = this.scoreText1.tint = this.scoreText2.tint = 0;
    this.nextPill1 = this.game.add.sprite(455,135,'');
    this.nextPill2 = this.game.add.sprite(487,135,'');
    this.nextPill2.scale.setTo(-1,1);
    this.DrMariano = this.game.add.sprite(450, 150, 'DrMariano');
    this.DrMarianoShrug = this.game.add.sprite(450, 150, 'DrMarianoShrug');
    this.DrMarianoShrug.visible=false;
  }
GameScene1.setSpeed = function(){
  if(options1.speed==0){
    this.speedString='LOW';
  }
  else if( options1.speed==1){
    this.speedString='MED';
  }
  else this.speedString='HI';
}
GameScene1.updateGUI = function(){
    this.levelText2.text = this.level;
    this.virusText2.text = this.board.virus;
    this.scoreText2.text = this.board.score;
    this.advertText1.text = this.advertString1;
    this.advertText2.text = this.advertString2;
    this.nextPill1.loadTexture(this.currentPill.nextPill.color1 + 'Pill');
    this.nextPill2.loadTexture(this.currentPill.nextPill.color2 + 'Pill');
    if(this.board.zeroYellowVirus()){
      this.yellowVirusDeath();
    }
    if(this.board.zeroBlueVirus()){
      this.blueVirusDeath();
    }
    if(this.board.zeroRedVirus()){
      this.redVirusDeath();
    }
  }
GameScene1.checkGameEnd = function(){
  if(this.board.virus<=0){
    this.level++;
    this.advertString1='NEXT';
    this.advertString2='LEVEL';
    this.pauseGame();

  }
  else if(this.board.checkGameOver()){
    //level=0;
    this.DrMariano.visible=false;
    this.nextPill1.visible=false;
    this.nextPill2.visible=false;
    this.DrMarianoShrug.visible=true;
    this.advertString1='GAME';
    this.advertString2='OVER!';
    this.pauseGame();
  }
}
GameScene1.pauseGame = function(){
  this.board.clearBoard();
  this.currentPill.attachedPill.sprite.destroy();
  this.mainLoop.timer.pause();
  this.setAdvert();
  this.paused=true;
}
GameScene1.resumeGame = function(){
  this.setLevel();
  this.mainLoop.timer.resume();
  this.quitAdvert();
  this.paused=false;

}
GameScene1.goToMenu = function(){
  this.game.state.start('menu');
}
GameScene1.setAdvert = function(){
  this.currentPill.visible=false;
  this.advertWindow.visible=true;
  this.advertText1.visible=true;
  this.advertText2.visible =true;
  this.pressEntertext.visible =true;
}
GameScene1.quitAdvert = function(){
  this.currentPill.visible=true;
  this.advertWindow.visible=false;
  this.advertText1.visible=false;
  this.advertText2.visible =false;
  this.pressEntertext.visible =false;
}
GameScene1.setLevel = function(){
  this.board.createBoard(this.level);
  this.setVirusGUI();
  this.currentPill.startPill(3,1,'red','yellow');
}
GameScene1.inputManager = function(){
    this.cursors.down.onDown.add(this.moveFX,this);
    this.cursors.right.onDown.add(this.moveFX,this);
    this.cursors.left.onDown.add(this.moveFX,this);
    this.XKey.onDown.add(this.rotationFX,this);
    this.ZKey.onDown.add(this.rotationFX,this);
    if(this.cursors.right.isDown && !this.board.pillBroken){
      if(this.cursors.right.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        this.keyInput='r';
      }
      else if(this.cursors.right.duration>250){
        this.keyInput='r';
      }
      else {
        this.keyInput='';
      }
    }
    else if(this.cursors.left.isDown && !this.board.pillBroken){
      if(this.cursors.left.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        this.keyInput='l';
      }
      else if(this.cursors.left.duration>250){
        this.keyInput='l';
      }
      else {
        this.keyInput='';
      }
    }
    else{
      this.keyInput='';
    }
    if(this.XKey.isDown && this.XKey.duration<1 && !this.board.pillBroken) {//Clockwise
      this.rotDir=1;
      this.currentPill.setRotation(this.rotDir);
    }
    else if(this.ZKey.isDown && this.ZKey.duration<1 && !this.board.pillBroken){//Anticlockwise
      this.rotDir=-1;
      this.currentPill.setRotation(this.rotDir);
    }
    else {
      this.rotDir=0;
    }

    if(this.cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       this.currentPill.setFallSpeed(100);
    }
    else{
      this.currentPill.setFallSpeed(this.currentPill.fallDelay);
    }
    if(this.enterKey.isDown && this.paused){
      if(this.board.virus<=0){
        this.resumeGame();
      }
      else
        {
          this.resumeGame();
          this.goToMenu();
      }
    }
  }
module.exports = GameScene1;

},{"./game_board.js":3,"./item.js":4,"./options1.js":7}],2:[function(require,module,exports){
'use strict';
var item = require('./item.js');
var gameBoard = require('./game_board.js');
var options2 = require ('./options2.js');
var Pill = item.Pill;

var GameBoard = gameBoard.gameBoard;
var Cell= gameBoard.cell;
var moveFX;
var rotationFX;

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
    moveFX = this.game.add.audio('misc1');
    rotationFX = this.game.add.audio('misc3');

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
GameScene2.moveFX = function(){
  moveFX.play();
}
GameScene2.rotationFX = function(){
  rotationFX.play();
}
GameScene2.inputP1 = function(){
  this.sKey.onDown.add(this.moveFX,this);
  this.dKey.onDown.add(this.moveFX,this);
  this.aKey.onDown.add(this.moveFX,this);
  this.bKey.onDown.add(this.rotationFX,this);
  this.vKey.onDown.add(this.rotationFX,this);
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
  this.cursors.down.onDown.add(this.moveFX,this);
  this.cursors.right.onDown.add(this.moveFX,this);
  this.cursors.left.onDown.add(this.moveFX,this);
  this.oKey.onDown.add(this.rotationFX,this);
  this.pKey.onDown.add(this.rotationFX,this);
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

},{"./game_board.js":3,"./item.js":4,"./options2.js":8}],3:[function(require,module,exports){
'use strict'
//'none' 'blue' 'yellow' 'red'
var cellWidth, cellHeight;
var game;
var colors = ['blue', 'yellow', 'red'];
var destroyablePills = [];//Array con las posiciones de las píldoras a destruir
var cont=0;//Contador del array
var color;
var destroySound;
function gameBoard(Game,xOffset,yOffset){

  game =Game;
  destroySound = game.add.audio('misc4');
  this.pillBroken=false;
  this.xOffset = xOffset;
  this.yOffset = yOffset;
  this.halfPills=[];
  this.cellWidth =  16;//Medidas de las celdas
  this.cellHeight = 16;
  this.virus =0;
  this.yellowVirus=0;
  this.blueVirus=0;
  this.redVirus=0;
  this.score=0;
  this.maxY=0;//Altura máxima a la que puede aparecer un virus

  this.createBoard=function(level){//Creación de la matriz del tablero
    this.cells = [];
    for(var i=0; i<17;i++){//Crea array vacío
        this.cells[i]=[];
      for(var j=0; j<8;j++){
        this.cells[i][j]= new cell(Game, 'none', j , i,this.xOffset,this.yOffset);//Crea una celda en cada posición
      }
    }
    if(level>=15){//Se ponen los virus a una altura distinta según el nivel
      this.maxY=4;
    }
    else if(level>=10){
      this.maxY=7;
    }
    else this.maxY=10;
    this.createVirus(level*4+4,this.maxY);
  }
  this.clearBoard=function(){//Vacía la matriz de celdas
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        this.getCell(j,i).sprite.destroy();
        this.cells[i][j]=undefined;
      }
    }
  }
  this.createVirus = function(number, maxY){//maxY es la altura maxima donde puede aparecer un virus
    this.yellowVirus=0;
    this.redVirus=0;
    this.blueVirus=0;
    this.virus=0;
    for(this.virus=0;this.virus<number;this.virus++){//Crea virus en posiciones aleatorias
        var rndY=game.rnd.integerInRange(maxY, 16);
        var rndX=game.rnd.integerInRange(0, 7);
        var color=colors[game.rnd.integerInRange(0, 2)];
      while(this.isVirus(rndX,rndY)){//Prueba posiciones distintas si hay un virus en la casilla
          rndY=game.rnd.integerInRange(maxY, 16);
          rndX=game.rnd.integerInRange(0, 7);
          color=colors[game.rnd.integerInRange(0, 2)];
      }//Si no hay ya 3 virus adyacentes crea uno
      this.getCell(rndX,rndY).changeCell(color, 'Virus', 0,false);
      this.addVirus(color);
      this.checkAdjacentVirus(color, rndX, rndY);//Comprueba si se han juntado 4 virus
    }
  }
  this.addVirus = function(color){
    if(color=='yellow'){
      this.yellowVirus++;
    }
    else if(color=='blue'){
      this.blueVirus++;
    }
    else if(color=='red'){
      this.redVirus++;
    }
  }
  this.checkGameOver = function(){//Comprueba si hay alguna píldora obstruyendo la entrada
    if(this.getCell(3,1).kind=='Pill' || this.getCell(4,1).kind=='Pill'){
      return true;
    }
    else return false;
  }
  this.checkAdjacentVirus = function(color, posX, posY){//Comprueba si hay colores 4 colores adyacentes
    destroyablePills = [];//Este método se usa solo en la creación de virus para que no aparezcan 4 juntos
    cont = 0;
      if(this.checkHorizontal(color,posX,posY) || this.checkVertical(color,posX,posY)){
        this.destroyAdjacentVirus();
        destroyablePills = [];//Vacía el arrayHalfPills
        cont = 0;
        return true;
      }
      else false;
  }
  this.checkAdjacentColors = function(color, posX, posY){//Comprueba si hay colores 4 colores adyacentes
    destroyablePills = [];//Vacía el arrayHalfPills
    cont = 0;
      if(this.checkHorizontal(color,posX,posY) || this.checkVertical(color,posX,posY)){
        this.destroyAdjacentCells();
        this.pillBroken=true;
        destroyablePills = [];//Vacía el arrayHalfPills
        cont = 0;
        return true;
      }
      else false;
  }
  this.getColor=function(x,y){
    return this.getCell(x,y).color;
  }
  this.isEntirePill = function(x,y){//Devuelve si es una píldora entera o no
    if(this.isPill(x,y)&&this.getBrotherX(x,y)!=-1&&this.getColor(x,y)!='none'){
      return true;
    }
    else return false;
  }
  this.isHalfPill = function(x,y){//Devuelve si es una píldora entera o no
    if(this.isPill(x,y)&&this.getBrotherX(x,y)==-1&&this.getColor(x,y)!='none'){
      return true;
    }
    else return false;
  }
  this.isPill = function(x,y){
    if(this.getKind(x,y)=='Pill'){
      return true;
    }
    else return false;
  }
  this.getKind=function(x,y){
    return this.cells[y][x].kind;
  }
  this.isVirus = function(x,y){
    if(this.getKind(x,y) == 'Virus'){
      return true;
    }
    else false;
  }
  this.checkHorizontal = function(color, posX, posY){//Comprueba si hay 4 colores adyacentes en horizontal
    var auxX=posX;
    var auxY=posY;
    while(this.sameColor(auxX,posY,color)){
      destroyablePills[cont]=[auxX, posY];//Almacena la posición
      auxX--;//La auxiliar recorre X a la izquierda
      cont++;//El contador aumenta
    }
    auxX=posX+1;
    while(this.sameColor(auxX,posY,color)){
      destroyablePills[cont]=[auxX, posY];
      auxX++;//Ahora el auxiliar recorre a la derecha
      cont++;
    }
    if(cont>=4){
      return true;
    }
    else {
      destroyablePills=[];
      cont=0;
      return false;
    }
  }
  this.checkVertical = function(color, posX, posY){
    //Vertical
    var auxY=posY;
    var auxX=posX;
//    var auxY=posY;
    while( this.sameColor(posX,auxY,color)){
      destroyablePills[cont]=[posX,auxY];//Almacena la posición
      auxY--;//La auxiliar recorre Y hacia arriba
      cont++;//El contador aumenta
    }
    auxY=posY+1;
    while( this.sameColor(posX,auxY,color)){
      destroyablePills[cont]=[posX,auxY];
      auxY++;//Ahora el auxiliar recorre hacia abajo
      cont++;
    }
    if(cont>=4){
      return true;
    }
    else {
      destroyablePills=[];
      cont=0;
      return false;
    }
  }
  this.sameColor = function(x,y,color){
    if(this.availableCell(x, y) && this.getColor(x,y)==color){
      return true;
    }
    else false;
  }
  this.destroyFX = function(){
    destroySound.play();
  }
  this.destroyAdjacentCells = function(){//Destruye las celdas que están adyacentes
    for(var i =0;i<cont;i++){
      var auxX = destroyablePills[i][0];
      var auxY = destroyablePills[i][1];
      if(this.isEntirePill(auxX,auxY)){//Si era una píldora entera la deja sin hermanos
        this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).setBrother(-1,-1);//Deja sin hermano a la otra píldora
        this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).changeCell(this.getColor(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)), 'Pill',this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).rotationState,this.getCell(this.getBrotherX(auxX,auxY),this.getBrotherY(auxX,auxY)).attached);
      }
      else if(this.isVirus(auxX,auxY)){
        this.substractVirus(auxX,auxY);
      }
      this.getCell(auxX,auxY).destroyAnim();
      this.addScore(25);
    }
    this.destroyFX();
  }
  this.destroyAdjacentVirus = function(){//Este método solo se usa para destruir virus en la creación del tablero
    for(var i =0;i<cont;i++){
      var auxX = destroyablePills[i][0];
      var auxY = destroyablePills[i][1];
      this.substractVirus(auxX,auxY);
      this.getCell(auxX,auxY).destroyCell();//A diferencia del método anterior este no tiene animaciones
    }
  }
  this.substractVirus = function(auxX,auxY){
    this.virus--;
    if(this.getColor(auxX,auxY)=='yellow'){
        this.yellowVirus--;
    }
    else if(this.getColor(auxX,auxY)=='blue'){
        this.blueVirus--;
      }
    else if(this.getColor(auxX,auxY)=='red'){
        this.redVirus--;
      }
  }
  this.countColoredVirus = function(){//Método que cuenta los virus de cada color que hay en el tablero
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        if(this.getColor(j,i)=='yellow' && this.isVirus(j,i)){
          this.yellowVirus++;
        }
        else if(this.getColor(j,i)=='blue' && this.isVirus(j,i)){
          this.blueVirus++;
        }
        else if(this.getColor(j,i)=='red' && this.isVirus(j,i)){
          this.redVirus++;
        }
      }
    }

  }
  this.zeroYellowVirus = function(){
    if(this.yellowVirus==0){
      this.yellowVirus--;
      return true;
    }
    else return false;
  }
  this.zeroBlueVirus = function(){
    if(this.blueVirus==0){
      this.blueVirus--;
      return true;
    }
    else return false;
  }
  this.zeroRedVirus = function(){
    if(this.redVirus==0){
      this.redVirus--;
      return true;
    }
    else return false;
  }
  this.getCell = function(x,y){
    return this.cells[y][x];
  }
  this.getBrotherX = function(x,y){
    return this.getCell(x,y).brotherX;
  }
  this.getBrotherY = function(x,y){
    return this.getCell(x,y).brotherY;
  }
  this.addScore = function(score){//Añade puntuación
    this.score+=score;
  }
  this.checkAdjacentInBoard = function(){//Comprueba si hay colores adyacentes en el tablero, se usa cuando varias píldoras se han movido o cuando se crean virus
    for(var i=0;i<17;i++){
      for(var j=0;j<8;j++){
        if(this.getColor(j,i)!='none')
          this.checkAdjacentColors(this.getColor(j,i), j,i);
      }
    }
  }
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
this.checkBrothers = function()//Busca y guarda la posición de todas las píldoras que se han roto
  {
    this.halfPills =[];//Array que contiene la información de las píldoras que van a caer
    var z=0;
    for(var i=16; i>=0;i--){//Crea array vacío
      for(var j=7; j>=0;j--){//Las recorre de abajo hacia arriba para que no haya conflicto
        if(this.isHalfPill(j,i)){//Si la píldora está sola
            if(this.availableVoidCell(j,i+1)){//La celda de abajo tiene que estar libre
              this.pillBroken=true;
              this.setHalfPills(z,this.getCell(j,i).posY,this.getCell(j,i).posX,this.getColor(j,i),this.getBrotherY(j,i),this.getBrotherX(j,i),this.getCell(j,i).rotationState,this.getCell(j,i).attached);
              z++;
            }
        }
        //Comprueba si hay píldoras enteras flotando
        else  if(this.verticalPillFloating(j,i) || this.horizontalPillFloating(j,i)) {//Attached arriba
              this.pillBroken=true;
              this.setHalfPills(z,this.getCell(j,i).posY,this.getCell(j,i).posX,this.getColor(j,i),this.getBrotherY(j,i),this.getBrotherX(j,i),this.getCell(j,i).rotationState,this.getCell(j,i).attached);
              z++;
              this.setHalfPills(z,this.getBrotherY(j,i),this.getBrotherX(j,i),this.getColor(this.getBrotherX(j,i),this.getBrotherY(j,i)),this.getCell(j,i).posY,
              this.getCell(j,i).posX,this.getCell(this.getBrotherX(j,i),this.getBrotherY(j,i)).rotationState,this.getCell(this.getBrotherX(j,i),this.getBrotherY(j,i)).attached);
              z++;
            }
          }
    }
    return this.halfPills;
  }

  this.horizontalPillFloating = function(x,y){//Comprueba si es una píldora horizontal sin apoyo debajo
    if(this.isEntirePill(x,y)){
      if(this.availableVoidCell(x,y+1) && this.availableVoidCell(this.getBrotherX(x,y),this.getBrotherY(x,y)+1)){
        return true;
      }
    }
    else return false;
  }
  this.verticalPillFloating = function(x,y){//Comprueba si es una píldora vertical sin apoyo debajo
    if(this.isEntirePill(x,y)){
      if(this.availableCell(x,y+1) && this.availableCell(this.getBrotherX(x,y),this.getBrotherY(x,y)+1)){
        if((this.getBrotherY(x,y)>y) && (this.getColor(this.getBrotherX(x,y),this.getBrotherY(x,y)+1)=='none')//Attached abajo
        || (this.getBrotherY(x,y)<y && (this.getColor(x,y+1)=='none')))
        {
          return true;
        }
      }
    }
    else return false;
  }
  this.moveEntirePill=function(i){
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]+1).setBrother(this.halfPills[i][4], this.halfPills[i][3]+1);
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]+1).changeCell(this.halfPills[i][2], 'Pill',this.halfPills[i][5], this.halfPills[i][6]);
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]).destroyCell();
  }
  this.moveHalfPill=function(i){
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]+1).changeCell(this.halfPills[i][2], 'Pill',this.halfPills[i][5], this.halfPills[i][6]);
    this.getCell(this.halfPills[i][1],this.halfPills[i][0]).destroyCell();
  }
 this.collapsePills = function(){//Junta todas las píldoras que puedan haber quedado sueltas
    for(var i=0; i<this.halfPills.length;i++){
      if(this.halfPills[i][3]!=-1){//Aquí entran las píldoras enteras
        if(this.availableVoidCell(this.halfPills[i][1], this.halfPills[i][0]+1) && this.availableVoidCell(this.halfPills[i+1][4], this.halfPills[i+1][3]+1))
          {//Comprueba si la celda de abajo de su 'brother' está libre
          if(i+1<this.halfPills.length){
              this.moveEntirePill(i);
              i++;
              this.moveEntirePill(i);
          }
        }
      }
      else if(this.availableVoidCell(this.halfPills[i][1], this.halfPills[i][0]+1)){//Comprueba si pueden caer
        this.moveHalfPill(i);
      }
    }
  }

  this.availableCell = function(x,y){
    if(x>=8 || y>=17 || x<0 || y<0){
      return false;
    }
    else{
      return true;
    }
  }
  this.availableVoidCell = function(x,y){
    if(this.availableCell(x,y) && this.getColor(x,y)=='none'){
      return true;
    }
    else return false;
  }
}
function cell (game, color, posX, posY , xOffset, yOffset){//Celdas que componen la matriz
    this.kind = 'none';//Puede ser Virus o Pill
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
    this.changeCell = function(color, kind, rotState, at){//Cambia una celda determinada
        this.rotationState=rotState;
        this.attached=at;
        this.sprite.angle = this.rotationState*90;//Rota el sprite
        this.kind = kind;
        this.color = color;
        if(this.attached){//Booleano que indica si es la píldora auxiliar
          this.sprite.scale.setTo(-1,1);//La píldora auxiliar está girada
        }
        else {
          this.sprite.scale.setTo(1,1);
        }
        if(this.kind!='none'){//Si no está vacía pinta el sprite correspondiente
          this.sprite.loadTexture(color + kind);
          if(this.kind=='Virus'){//Si es un virus ejecuta la animación
            this.anim = this.sprite.animations.add('idle');
            this.anim.play(6,true);

          }
        }
        if(this.kind=='Pill' && (this.brotherX==-1) && this.color!='none'){//Si la píldora está sola el sprite es distinto
          this.sprite.loadTexture(color);
        }
    }
    this.setBrother = function(x, y)//Asigna una píldora hermana
    {
      this.brother=true;
      this.brotherX=x;
      this.brotherY=y;
    }
    this.clearCell = function(){//Reinicia los valores de una celda
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

},{}],4:[function(require,module,exports){
'use strict'
var options1 = require ('./options1.js');
var colors = ['blue', 'yellow', 'red'];
//Contiene Item, Pills

  Pill.prototype = Object.create(Phaser.Sprite.prototype);//Asignación de constructora
  Pill.prototype.constructor = Pill;

var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
function Pill(game, x,y,color1, color2, Board, xOffset, yOffset){//Píldoras, heredan de Item
      this.game=game;
      Phaser.Sprite.call(this, game, x, y, color1);//Se le asigna un sprite
      this.anchor.setTo(0.5,0.5);
      this.cellPosition = [0,0];
      this.cellPosition[0]=x;
      this.cellPosition[1]=y;

      this.xOffset=xOffset;//Diferencia que hay hasta su posición de dibujado
      this.yOffset=yOffset;

      this.board = Board;
      this.fallDelay=lowSpeed;
      this.fallLoop = game.time.events.loop(this.fallDelay, this.fall, this);//Bucle de caída
      this.fallLoop.timer.start();
      this.game.add.existing(this);
  };
  Pill.prototype.startPill = function(x,y,color1,color2){
    this.rotationState=0;//Hay 4 estados 0=0º 1=270º 2=180º 3=90º
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
    this.loadTexture(color1 + 'Pill');//Cambia el sprite
    this.color = color1;
    this.createNextPill();
    this.attachedPill = {
      color: color2,//'blue' 'red' 'yellow' 'none'
      cellPosition : [this.cellPosition[0]+1,this.cellPosition[1]],//La píldora adherida aparece a la derecha
      rotOffset : [[1,0],[0,1],[-1,0],[0,-1]],//Offset respecto a la píldora principal
      sprite : this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, color2 + 'Pill'),
      getPosX(){
        return this.cellPosition[0];
      },
      getPosY(){
        return this.cellPosition[1];
      },
      changePos(x,y){//Cambia los valores de la posición
        this.cellPosition[0]=x;
        this.cellPosition[1]=y;
      },
    }
    this.attachedPill.sprite.anchor.setTo(0.5,0.5);
    this.attachedPill.sprite.scale.setTo(-1,1);
    this.setRotation(0);
  }

  //BUCLE PRINCIPAL
  Pill.prototype.fall = function(){//Función de caída que se repite en bucle
    if(this.board.pillBroken){//Si hay alguna píldora rota cae
      var arrayHalfPills = this.board.checkBrothers();
      this.board.pillBroken=false;
      this.board.collapsePills();
      if(arrayHalfPills.length>0){
        this.board.pillBroken=true;
      }
      else {//Cuando hayan colapsado todas comprueba sus adyacentes
        this.board.checkAdjacentInBoard();
      }
    }
    else if (!this.displaceEntirePill(0,1)){//Si no consigue caer
      this.copyPill();//Copia los valores de la píldora en la matriz
      this.board.checkAdjacentColors(this.color, this.getPosX(), this.getPosY());//Comprueba adyacencias
      this.board.checkAdjacentColors(this.attachedPill.color, this.attachedPill.getPosX(), this.attachedPill.getPosY());
      this.attachedPill.sprite.destroy();
      this.changePill();//Crea otra píldora
      }
    }

    Pill.prototype.update=function(){//Se hace un update a la posición en la que aparece en pantalla
      this.setPosition();
    }

    Pill.prototype.setPosition=function(){//Coloca el sprite donde corresponde en el tablero
      this.x=16*this.getPosX()+this.xOffset;
      this.y=16*this.getPosY()+this.yOffset;
      this.attachedPill.sprite.x=16*this.attachedPill.getPosX()+this.xOffset;
      this.attachedPill.sprite.y=16*this.attachedPill.getPosY()+this.yOffset;
    }

    Pill.prototype.copyPill = function(){//Copia los valores de la píldora al tablero
      this.board.cells[this.getPosY()][this.getPosX()].setBrother(this.attachedPill.getPosX(),this.attachedPill.getPosY());
      this.board.cells[this.getPosY()][this.getPosX()].changeCell(this.color, 'Pill', this.rotationState,false);
      this.board.cells[this.attachedPill.getPosY()][this.attachedPill.getPosX()].setBrother(this.getPosX(),this.getPosY());
      this.board.cells[this.attachedPill.getPosY()][this.attachedPill.getPosX()].changeCell(this.attachedPill.color, 'Pill', this.rotationState, true);
    }

    Pill.prototype.changePill =function(){//Asigna el color a la píldora y crea la siguiente
        this.startPill(3,1,this.nextPill.color1,this.nextPill.color2);
        this.createNextPill();
      }

    Pill.prototype.createNextPill = function(){
        this.nextPill  = {
          color1: colors[this.game.rnd.integerInRange(0, 2)],
          color2: colors[this.game.rnd.integerInRange(0, 2)],
        }
      }


  Pill.prototype.changePos=function(x,y){//Cambia los valores de la posición
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
  }
  Pill.prototype.getPosX=function(){
    return this.cellPosition[0];
  }
  Pill.prototype.getPosY=function(){
    return this.cellPosition[1];
  }

  Pill.prototype.setFallSpeed = function(fallSpeed)
  {
    this.fallLoop.delay= fallSpeed;
  }

  Pill.prototype.freePosition= function(dirX,dirY)
  {//Comprueba si la píldora entera puede colocarse en la posición a la que apunta la dirección
    if(this.availableCell(this.getPosX()+dirX, this.getPosY()+dirY)
      && this.availableCell(this.attachedPill.getPosX()+dirX, this.attachedPill.getPosY()+dirY))
      {
        return true;
      }
      else return false;
  }
  Pill.prototype.availableCell = function(x,y){
    if(x>=8 || y>=17 || x<0 || y<0){
      return false;
    }
    else if(this.board.cells[y][x].color=='none'){
      return true;
    }
  }
  Pill.prototype.displaceEntirePill = function(dirX,dirY){//Mueve la píldora entera según la dirección
    if(this.freePosition(dirX,dirY)){//Si hay espacio donde indica la dirección
      this.changePos(this.getPosX()+dirX,this.getPosY()+dirY);
      this.attachedPill.changePos(this.attachedPill.getPosX()+dirX,this.attachedPill.getPosY()+dirY);
      return true;
    }
    else return false;
  }
  Pill.prototype.move = function(keyInput){//Recibe una tecla del inputManager y mueve su posición
      if(keyInput=='r'){//Derecha
        this.displaceEntirePill(1,0);
      }
      else if(keyInput=='l'){//Izquierda
        this.displaceEntirePill(-1,0);
      }
    }
    Pill.prototype.setFallDelay = function (speed){//Asigna la velocidad de caída
        this.fallDelay=speed;
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

        if(this.canRotate(this.getPosX(),this.getPosY(),this.attachedPill.getPosX(),this.attachedPill.getPosY(),this.attachedPill.rotOffset, rotDir)){
          this.attachedPill.changePos(this.getPosX()+this.attachedPill.rotOffset[this.rotationState][0], this.getPosY()+this.attachedPill.rotOffset[this.rotationState][1]);
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
    var auxX = this.getPosX();
    var auxY = this.getPosY();
    this.changePos(this.attachedPill.getPosX(),this.attachedPill.getPosY())
    this.attachedPill.changePos(auxX,auxY);
  }


module.exports = {
  Pill : Pill,
}

},{"./options1.js":7}],5:[function(require,module,exports){
'use strict';

var GameScene1 = require('./game1.js');
var GameScene2 = require('./game2.js');
var MenuScene = require('./menu.js');
var OptionsScene1 = require('./options1.js');
var OptionsScene2 = require('./options2.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
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

    this.load.image('blue', 'images/blue.png');
    this.load.image('lens', 'images/lens.png');
    this.load.image('yellow', 'images/yellow.png');
    this.load.image('red', 'images/red.png');
    this.load.image('bluePill', 'images/bluePill.png');
    this.load.image('yellowPill', 'images/yellowPill.png');
    this.load.image('redPill', 'images/redPill.png');
    this.load.spritesheet('blueVirus', 'images/blueVirus.png',16,16,2);
    this.load.spritesheet('DrMariano', 'images/DrMariano.png',80,80,3);
    this.load.spritesheet('yellowVirus', 'images/yellowVirus.png',16,16,2);
    this.load.spritesheet('redVirus', 'images/redVirus.png',16,16,2);
    this.load.spritesheet('redVirusAnim', 'images/redVirusAnim.png',80,80,2);
    this.load.spritesheet('blueVirusAnim', 'images/blueVirusAnim.png',80,80,4);
    this.load.spritesheet('yellowVirusAnim', 'images/yellowVirusAnim.png',80,80,4);
    this.load.spritesheet('redVirusDeath', 'images/redVirusDeath.png',80,80,8);
    this.load.spritesheet('blueVirusDeath', 'images/blueVirusDeath.png',80,80,8);
    this.load.spritesheet('yellowVirusDeath', 'images/yellowVirusDeath.png',80,80,8);
    this.load.spritesheet('redExplosion', 'images/redExplosion.png',16,16,4);
    this.load.spritesheet('blueExplosion', 'images/blueExplosion.png',16,16,4);
    this.load.spritesheet('yellowExplosion', 'images/yellowExplosion.png',16,16,4);
    this.load.spritesheet('DrMarianoFront', 'images/DrMarianoFront.png',82,80,2);
    this.load.image('DrMarianoShrug', 'images/DrMarianoShrug.png');
    this.load.audio('misc1','sound/misc1.mp3');
    this.load.audio('misc2','sound/misc2.mp3');
    this.load.audio('misc3','sound/misc3.mp3');
    this.load.audio('misc4','sound/destroy.mp3');
    this.load.image('scoreWindow', 'images/scoreWindow.png');
    this.load.image('scoreWindow2', 'images/scoreWindow2.png');
    this.load.image('scoreFrame','images/ScoreFrame.png');
    this.load.image('crown','images/Crown.png');
    this.load.image('levelFrame', 'images/levelFrame.png');
    this.load.image('DrMarianoTitle','images/DrMarianoTitle.png');
    this.load.image('DrMarianoMainTitle','images/DrMarianoMainTitle.png');
    this.load.image('glass', 'images/glass.png');
    this.load.image('background1', 'images/background.png');
    this.load.image('background2', 'images/background2.png');
    this.load.image('background3', 'images/background3.png');
    this.load.image('heartIcon', 'images/heartIcon.png');
    this.load.image('playerSelection', 'images/playerSelection.png');
    this.load.image('arrowIcon', 'images/arrowIcon.png');
    this.load.image('optionsWindow', 'images/optionsWindow.png');
    this.load.image('levelMeter', 'images/levelMeter.png');
    this.load.image('advertWindow','images/advertWindow.png');
    this.load.bitmapFont('pixel', 'fonts/pixel.png', 'fonts/pixel.fnt');
  },

  create: function () {
    this.game.state.start('menu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(600, 500, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('1pGame', GameScene1);
  game.state.add('2pGame', GameScene2);
  game.state.add('menu', MenuScene);
  game.state.add('options1', OptionsScene1);
  game.state.add('options2', OptionsScene2);
  game.state.start('boot');
};

},{"./game1.js":1,"./game2.js":2,"./menu.js":6,"./options1.js":7,"./options2.js":8}],6:[function(require,module,exports){
'use strict'
var Button;
var cursors;
var enterKey;
var background;
var playerSelection;
var heartIcon;
var MenuScene={};
var DrMarianoFront;
var P1text;
var P2text;
var rnd;
var DrMarianoTitle;
var redVirusAnim;
var yellowVirusAnim;
var blueVirusAnim;
var sound2;
MenuScene.create = function () {
  sound2 = this.game.add.audio('misc2');
  cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
  enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);



  //Colocación de sprites en pantalla
  background = this.game.add.sprite(0,0, 'background1');
  DrMarianoTitle = this.game.add.sprite(75,50,'DrMarianoMainTitle');
  playerSelection = this.game.add.sprite(75,300, 'playerSelection');
  heartIcon = this.game.add.sprite(175,335, 'heartIcon');
  DrMarianoFront = this.game.add.sprite(90,330,'DrMarianoFront');
  DrMarianoFront.animations.add('idle');
  DrMarianoFront.play('idle',3,true);

  rnd=this.game.rnd.integerInRange(0, 2);
  //El virus del menú se selecciona de manera aleatoria
  if(rnd==0){
    redVirusAnim=this.game.add.sprite(420,330,'redVirusAnim');
    redVirusAnim.animations.add('idle');
    redVirusAnim.play('idle',3,true);
  }
  else if(rnd==1){
    yellowVirusAnim=this.game.add.sprite(420,330,'yellowVirusAnim');
    yellowVirusAnim.animations.add('idle');
    yellowVirusAnim.play('idle',6,true);
  }
  else if(rnd==2){
    blueVirusAnim=this.game.add.sprite(420,330,'blueVirusAnim');
    blueVirusAnim.animations.add('idle');
    blueVirusAnim.play('idle',6,true);
  }

  P1text = this.game.add.bitmapText(210, 335, 'pixel','1 Player',50);
  P2text = this.game.add.bitmapText(210, 370, 'pixel','2 Players',50);
  }
  MenuScene.update = function(){
    inputManager();
  }
  function playFx(){
    sound2.play();
  }
function inputManager(){
  cursors.down.onDown.add(playFx,this)
  cursors.up.onDown.add(playFx,this)
  enterKey.onDown.add(playFx,this);
  if(cursors.down.isDown){//Cambia la posición del icono de slección
    heartIcon.y=370;
  }
  else if(cursors.up.isDown){
    heartIcon.y=335;
  }
  if(enterKey.isDown){
    if( heartIcon.y==335){//Controla el acceso a los modos de juego según la posición del icono
      MenuScene.game.state.start('options1');
    }
    else if (heartIcon.y==370){
      MenuScene.game.state.start('options2');
    }
  }
}

module.exports = MenuScene;

},{}],7:[function(require,module,exports){
'use strict'

var background;
var cursors;
var enterKey;
var backspaceKey;
var optionsWindow;
var Player1text;
var P1text;
var levelSelecText;
var levelText;
var speedSelecText;
var speedText;
var musicText;
var musicSelecText;
var levelMeter;
var optionSelec;
var selecIcon1;//Icono para el nivel
var selecIcon2;//Icono para la velocidad
var selecIcon3;//Icono para la música
var levelFrame;
var sound2;

var OptionsScene1={};

OptionsScene1.create = function () {
  sound2 = this.game.add.audio('misc2');
  this.option=1;//Variable que indica en qué opción está posado el icono
  this.speed=0;
  this.music=0;
  this.level=0;
  cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
  enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  backspaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
  //Colocación de sprites
  background = this.game.add.sprite(0,0, 'background2');
  optionsWindow = this.game.add.sprite(50,0, 'optionsWindow');
  levelMeter = this.game.add.sprite(150,160,'levelMeter');
  optionSelec = this.game.add.sprite(80,100, 'heartIcon');
  selecIcon1 = this.game.add.sprite(142,125, 'arrowIcon');
  selecIcon2 = this.game.add.sprite(195,280, 'arrowIcon');
  selecIcon3 = this.game.add.sprite(235,400, 'arrowIcon');
  //Colocación de texto
  Player1text = this.game.add.bitmapText(210, 30, 'pixel','1 Player',50);
  P1text = this.game.add.bitmapText(112, 167, 'pixel','P1',50);
  levelSelecText = this.game.add.bitmapText(115,100,'pixel','VIRUS LEVEL',50);
  levelText = this.game.add.bitmapText(450,165,'pixel','VIRUS LEVEL',60);
  levelFrame = this.game.add.sprite(445,160,'levelFrame');
  speedSelecText = this.game.add.bitmapText(115,250,'pixel','SPEED',50);
  speedText = this.game.add.bitmapText(175,310,'pixel','LOW   MED    HI',50);
  musicSelecText = this.game.add.bitmapText(115,375,'pixel','MUSIC',50);
  musicText = this.game.add.bitmapText(225,430,'pixel','ON    OFF',50);

}
OptionsScene1.update = function () {
  inputManager();
}
function iconManager(){//Pone los iconos en su lugar
  if(OptionsScene1.option==1){
    optionSelec.y=100;
  }
  else if(OptionsScene1.option==2){
    optionSelec.y=250;
  }
  else if(OptionsScene1.option==3){
    optionSelec.y=375;
  }

  selecIcon1.x = 140+14*OptionsScene1.level;
  selecIcon2.x= 195+115*OptionsScene1.speed;
  selecIcon3.x=235+115*OptionsScene1.music;
  levelText.text = OptionsScene1.level;

}
function optionDown(){
    playFx();
  OptionsScene1.option++;
  if(OptionsScene1.option>3){
    OptionsScene1.option=3;
  }
}
function optionUp(){
    playFx();
  OptionsScene1.option--;
  if(OptionsScene1.option<1){
    OptionsScene1.option=1;
  }
}
function addOption(){
    playFx();
  if(OptionsScene1.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene1.level++;
    if(OptionsScene1.level>20){
      OptionsScene1.level=20;
    }
  }
  else if(OptionsScene1.option==2){//Selector en velocidad
    OptionsScene1.speed++;
    if(OptionsScene1.speed>2){
      OptionsScene1.speed=2;
    }
  }
  else if(OptionsScene1.option==3){
    OptionsScene1.music++;
    if(OptionsScene1.music>1){
      OptionsScene1.music=1;
    }
  }
}
function substractOption(){
  playFx();
  if(OptionsScene1.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene1.level--;
    if(OptionsScene1.level<0){
      OptionsScene1.level=0;
    }
  }
  else if(OptionsScene1.option==2){//Selector en velocidad
    OptionsScene1.speed--;
    if(OptionsScene1.speed<0){
      OptionsScene1.speed=0;
    }
  }
  else if(OptionsScene1.option==3){
    OptionsScene1.music--;
    if(OptionsScene1.music<0){
      OptionsScene1.music=0;
    }
  }
}
function playFx(){
  sound2.play();
}
function inputManager(){
  cursors.down.onDown.add(optionDown,this)
  cursors.up.onDown.add(optionUp,this);
  cursors.right.onDown.add(addOption,this);
  cursors.left.onDown.add(substractOption,this);
  if(backspaceKey.isDown){
      OptionsScene1.game.state.start('menu');
  }
  if(enterKey.isDown){
      OptionsScene1.game.state.start('1pGame');
  }
  iconManager();
  }
module.exports = OptionsScene1;

},{}],8:[function(require,module,exports){
'use strict'

var background;
var cursors;
var enterKey;
var backspaceKey;
var optionsWindow;
var Player2text;
var P1text;
var P2text;
var levelSelecText;
var level1Text;
var level2Text;
var speedSelecText;
var speedText;
var musicText;
var musicSelecText;
var levelMeter;
var optionSelec;
var selecIcon1p1;//Icono para el nivel del j1
var selecIcon1p2;//Icono para el nivel del j2
var selecIcon2p1;//Icono para la velocidad del j1
var selecIcon2p2;//Icono para la velocidad del j2
var selecIcon3;//Icono para la música
var levelFrame;
var aKey;//Teclas para el jugador 2
var dKey;
var wKey;
var sKey;

var OptionsScene2={};
var sound2;
OptionsScene2.create = function () {
  sound2 = this.game.add.audio('misc2');
  this.option=1;//Variable que indica en qué opción está posado el icono
  this.speed1=0;
  this.level1=0;
  this.speed2=0;//Opciones del jugador 2
  this.level2=0;
  this.music=0;
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
  enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  backspaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
  //Colocación de sprites
  background = this.game.add.sprite(0,0, 'background2');
  optionsWindow = this.game.add.sprite(50,0, 'optionsWindow');
  levelMeter = this.game.add.sprite(150,160,'levelMeter');
  optionSelec = this.game.add.sprite(80,100, 'heartIcon');
  selecIcon1p1 = this.game.add.sprite(140,125, 'arrowIcon');//Level P1
  selecIcon1p2 = this.game.add.sprite(140,235, 'arrowIcon');//Level P2
  selecIcon2p1 = this.game.add.sprite(195,280, 'arrowIcon');//Speed P1
  selecIcon2p2 = this.game.add.sprite(195,365, 'arrowIcon');//Speed P2
  selecIcon1p2.scale.setTo(1,-1);
  selecIcon2p2.scale.setTo(1,-1);
  selecIcon3 = this.game.add.sprite(235,400, 'arrowIcon');
  //Colocación de texto
  Player2text = this.game.add.bitmapText(210, 30, 'pixel','2 Players',50);
  P1text = this.game.add.bitmapText(112, 155, 'pixel','P1',50);
  P2text = this.game.add.bitmapText(112, 180, 'pixel','P2',50);
  levelSelecText = this.game.add.bitmapText(115,100,'pixel','VIRUS LEVEL',50);
  level1Text = this.game.add.bitmapText(450,155,'pixel','VIRUS LEVEL',60);
  level2Text = this.game.add.bitmapText(450,180,'pixel','VIRUS LEVEL',60);
  levelFrame = this.game.add.sprite(445,152,'levelFrame');
  levelFrame.scale.setTo(1,1.5);
  speedSelecText = this.game.add.bitmapText(115,250,'pixel','SPEED',50);
  speedText = this.game.add.bitmapText(175,310,'pixel','LOW   MED    HI',50);
  musicSelecText = this.game.add.bitmapText(115,375,'pixel','MUSIC',50);
  musicText = this.game.add.bitmapText(225,430,'pixel','ON    OFF',50);

}
OptionsScene2.update = function () {
  inputManager();
}
function playFx(){
  sound2.play();
}
function iconManager(){//Pone los iconos en su lugar
  if(OptionsScene2.option==1){
    optionSelec.y=100;
  }
  else if(OptionsScene2.option==2){
    optionSelec.y=250;
  }
  else if(OptionsScene2.option==3){
    optionSelec.y=375;
  }

  selecIcon1p1.x = 140+14*OptionsScene2.level1;
  selecIcon1p2.x= 140+14*OptionsScene2.level2;
  selecIcon2p1.x = 195+115*OptionsScene2.speed1;
  selecIcon2p2.x= 195+115*OptionsScene2.speed2;
  selecIcon3.x=235+115*OptionsScene2.music;
  level1Text.text = OptionsScene2.level1;
  level2Text.text = OptionsScene2.level2;

}
function optionDown(){
  playFx();
  OptionsScene2.option++;
  if(OptionsScene2.option>3){
    OptionsScene2.option=3;
  }
}
function optionUp(){
  playFx();
  OptionsScene2.option--;
  if(OptionsScene2.option<1){
    OptionsScene2.option=1;
  }
}
function addOption1(){
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level1++;
    if(OptionsScene2.level1>20){
      OptionsScene2.level1=20;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed1++;
    if(OptionsScene2.speed1>2){
      OptionsScene2.speed1=2;
    }
  }
  else if(OptionsScene2.option==3){
    OptionsScene2.music++;
    if(OptionsScene2.music>1){
      OptionsScene2.music=1;
    }
  }
}
function substractOption1(){
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level1--;
    if(OptionsScene2.level1<0){
      OptionsScene2.level1=0;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed1--;
    if(OptionsScene2.speed1<0){
      OptionsScene2.speed1=0;
    }
  }
  else if(OptionsScene2.option==3){
    OptionsScene2.music--;
    if(OptionsScene2.music<0){
      OptionsScene2.music=0;
    }
  }
}
function addOption2(){//Para el jugador 2
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level2++;
    if(OptionsScene2.level2>20){
      OptionsScene2.level2=20;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed2++;
    if(OptionsScene2.speed2>2){
      OptionsScene2.speed2=2;
    }
  }
}

function substractOption2(){// J2
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level2--;
    if(OptionsScene2.level2<0){
      OptionsScene2.level2=0;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed2--;
    if(OptionsScene2.speed2<0){
      OptionsScene2.speed2=0;
    }
  }
}
function inputManager(){
  cursors.down.onDown.add(optionDown,this)
  cursors.up.onDown.add(optionUp,this);
  sKey.onDown.add(optionDown,this);
  wKey.onDown.add(optionUp,this);
  cursors.right.onDown.add(addOption2,this);
  cursors.left.onDown.add(substractOption2,this);
  dKey.onDown.add(addOption1,this);
  aKey.onDown.add(substractOption1,this);
  iconManager();
  if(backspaceKey.isDown){
      OptionsScene2.game.state.start('menu');
  }

  if(enterKey.isDown){
      OptionsScene2.game.state.start('2pGame');
    }

  }
module.exports = OptionsScene2;

},{}]},{},[5]);
