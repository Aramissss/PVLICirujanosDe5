'use strict';
var cursors;
var green;
var glass;


//0=vacío 1=azul 2=amarillo 3=rojo
var cells = [];//Array que contiene las casillas
var fallDelay=500;
var timer, fallLoop, moveLoop;
var inputDelay=fallDelay/4;
var keyInput='';
var cellWidth, cellHeight;
var GameScene = {
  create: function(){
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    green = this.game.add.sprite(400, 300, 'green');
    glass.scale.setTo(2,2);
    green.scale.setTo(2,2);
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
    cells[0][0]=0;
    inputStartTime = this.game.time.now;
    timer = this.game.time.events;
    fallLoop = timer.loop(fallDelay, this.fall, this);
    moveLoop = timer.loop(inputDelay, this.move,this);

    timer.start();

  },
  update: function() {
    this.inputManager();
  },
  move: function(){
    if(keyInput=='r'){
      green.x+=cellWidth;
    }
    else if(keyInput=='l'){
      green.x-=cellWidth;
    }
    keyInput='';
  },
  inputManager: function(){
    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       fallLoop.delay=200;
    }
    else{
       fallLoop.delay=500;
    }
    if(cursors.right.isDown && cursors.right.duration<1){
      keyInput='r';
      console.log(cursors.right.duration);
    }
    else if(cursors.left.isDown){
      keyInput='l';
    }
  },  
  fall: function(){
    green.y+=cellHeight;//Caida automática
  },
}
module.exports = GameScene;
