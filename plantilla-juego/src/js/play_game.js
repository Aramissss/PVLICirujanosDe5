'use strict';
var cursors;
var currentPill;
var glass;


//0=vacío 1=azul 2=amarillo 3=rojo
var cells = [];//Array que contiene las casillas
var fallDelay=500;
var timer, fallLoop, moveLoop;
var inputStartTime;
var moveDelay=fallDelay/4;
var keyInput='';
var cellWidth, cellHeight;


var GameScene = {};
GameScene.preload = function(){
  this.game.load.image('blue', 'images/blue.png');
  this.game.load.image('glass', 'images/glass.png');
}
var Pill = function(game,x,y){
    Phaser.Sprite.call(this, game, x, y, 'blue');
    this.xOffset=(glass.x)+16;//la diferencia que hay entre el punto 0 y la posición en pantalla del frasco
    this.yOffset=(glass.y)+42;
    this.color='blue';//1 azul
    this.cellPosition = [0,0];
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;

    this.game.add.existing(this);
  };
  Pill.prototype = Object.create(Phaser.Sprite.prototype);
  Pill.prototype.constructor = Pill;

  Pill.prototype.update=function(){
    currentPill.x=cellWidth*currentPill.cellPosition[0]+currentPill.xOffset;
    currentPill.y=cellHeight*currentPill.cellPosition[1]+currentPill.yOffset;
  };
GameScene.create = function(){
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    glass.scale.setTo(2,2);
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
    cursors = this.game.input.keyboard.createCursorKeys();
    cellWidth=16;
    cellHeight=16;
    for(var i=0; i<16;i++){//Crea array vacío
      cells[i]=[];
      for(var j=0; j<8;j++){
        cells[i][j]=0;
      }
    }
    currentPill = new Pill(this.game, 0,0);
    currentPill.scale.setTo(2,2);
    currentPill.anchor.setTo(0,0);
    this.game.add.existing(currentPill);
    cells[0][2]=1;//En la fila dos hay un azul
    inputStartTime = this.game.time.now;
    timer = this.game.time.events;
    fallLoop = timer.loop(fallDelay, fall, this);

    //moveLoop = timer.loop(moveDelay, this.move,this);

    timer.start();

  }

GameScene.update = function() {
    inputManager();
    move();
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
function move(){
    if(keyInput=='r'){
      currentPill.cellPosition[0]++;
      if(currentPill.cellPosition[0]>=8){
        currentPill.cellPosition[0]=7;
      }
    }
    else if(keyInput=='l'){
      currentPill.cellPosition[0]--;
      if(currentPill.cellPosition[0]<0){
        currentPill.cellPosition[0]=0;
      }
    }
  }
function fall(){
    //currentPill.y+=cellHeight;//Caida automática
    currentPill.cellPosition[1]++;
    if(currentPill.cellPosition[1]>=17){
      currentPill.cellPosition[1]=16;
    }
  }
module.exports = GameScene;
