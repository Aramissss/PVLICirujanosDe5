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
