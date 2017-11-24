'use strict';
var PlayGame = require('./play_game.js');
var spaceButton;
var logo;
var green;
var temporizador;
var timerCheck=0;
var cells = [[]];
var PlayScene = {

  create: function () {
  
    green = this.game.add.sprite(0, 0, 'green');
    spaceButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    cells[0][0]=0;
    temporizador= this.game.time.events.loop(500, this.bucle, this);

  }
   bucle: function() {
  	
	console.log(cells[0][0]);  	
  	cells[0][0]++;	
  	green.y=cells[0][0]*10;
  
  },
 
};

module.exports = PlayScene;
