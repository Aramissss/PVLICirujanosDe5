'use strict';


var IniciaJuego = require('./play_game.js');
	var spaceKey;
	 var logo;
	 var x;
var PlayScene = {

  create: function () {
   logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);


    spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.state.add('juego', 'IniciaJuego');
  },
    update: function () {
	  	if (spaceKey.isDown)
	  	{
	  		//this.game.state.start('juego');
	  		    logo.x = logo.x+0.5;
	  		
	  		    
	  	}

   }	
  }
  




module.exports = PlayScene;
