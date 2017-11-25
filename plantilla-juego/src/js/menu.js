'use strict'
var Button;
var MenuScene = {
  create: function () {
    Button = this.add.button(this.game.world.centerX-100,
      this.game.world.centerY-100,
       'menuButton',this.start,this);
    Button.scale.setTo(0.2,0.2);
  },
  start: function(menuButton) {
    this.game.state.start('playGame')
  }
};

module.exports = MenuScene;
