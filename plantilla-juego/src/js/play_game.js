'use strict';
var cursors;
var green;

//var temporizador;
var inputStartTime;
var inputDelay=250;
var fallStartTime;
var cells = [[]];
var fallDelay=500;
var GameScene = {
  create: function(){
    green = this.game.add.sprite(0, 0, 'green');
    cursors = this.game.input.keyboard.createCursorKeys();
    cells[0][0]=0;
    fallStartTime = this.game.time.now;
    inputStartTime = this.game.time.now;
    //temporizador= this.game.time.events.loop(delay, this.mainLoop , this);
  },
  update: function() {
    if(this.game.time.now-inputStartTime>inputDelay){
      inputStartTime=this.game.time.now;
      this.move();
    }

    if(this.game.time.now-fallStartTime>fallDelay){//Contador para simular un delay
       fallStartTime=this.game.time.now;
       this.fall();
    }
  },

  move: function(){
    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       fallDelay=200;
    }
    else{
       fallDelay=500;
    }
    if(cursors.right.isDown){
      green.x+=10;
    }
    else if(cursors.left.isDown){
      green.x-=10;
    }
  },
  fall: function(){
    cells[0][0]++;
    green.y=cells[0][0]*10;//Caida automática
  },
}
module.exports = GameScene;
