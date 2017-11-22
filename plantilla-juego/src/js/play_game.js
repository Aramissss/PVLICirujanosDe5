'use strict';
var sprite;
var IniciaJuego = {


  create: function () {
   game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'logo');
    sprite.anchor.setTo(0.5, 0.5);

    //  Enable Arcade Physics for the sprite
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    sprite.body.allowRotation = false;
  },

  update: function () {
  	
	sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 500);
  },

  render: function() {

    game.debug.spriteInfo(sprite, 32, 32);

}
};