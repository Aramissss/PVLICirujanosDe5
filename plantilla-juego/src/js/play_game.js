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

var GameScene = {

  create: function(){
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    glass.scale.setTo(2,2);
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
    cursors = this.game.input.keyboard.createCursorKeys();
    cellWidth=16;
    cellHeight=16;
    for(var i=0; i<17;i++){//Crea array vacío
      cells[i]=[];
      for(var j=0; j<9;j++){
        cells[i][j]=0;
      }
    }
    currentPill = new this.pill(0,1);
    currentPill = this.game.add.sprite(cellWidth*currentPill.cellPosition[0],
       cellHeight*currentPill.cellPosition[1], currentPill.color);
    currentPill.scale.setTo(2,2);
    cells[0][2]=1;//En la fila dos hay un azul
    inputStartTime = this.game.time.now;
    timer = this.game.time.events;
    fallLoop = timer.loop(fallDelay, this.fall, this);
    //moveLoop = timer.loop(moveDelay, this.move,this);

    timer.start();

  },
  pill: function(x,y){
    this.xOffset=(glass.x-glass.width/2)+8;//la diferencia que hay entre el punto 0 y la posición en pantalla del frasco
    this.color='blue';//1 azul
    this.cellPosition = [0,0];
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
  },
  update: function() {
    this.inputManager();
    this.move();
    console.log(currentPill.color);
  },
  inputManager: function(){
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
  },
  move: function(){
    if(keyInput=='r'){
      //currentPill.x=currentPill.cellPosition[0]*cellWidth+currentPill.xOffset;
      currentPill.x+=cellWidth;
    }
    else if(keyInput=='l'){
      currentPill.x-=cellWidth;
    }
  },
  fall: function(){
    currentPill.y+=cellHeight;//Caida automática
  },
}
module.exports = GameScene;
