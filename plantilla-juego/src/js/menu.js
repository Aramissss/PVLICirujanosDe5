'use strict'
var Button;
var cursors;
var enterKey;
var background;
var playerSelection;
var heartIcon;
var MenuScene={};
var P1text;
var P2text;
MenuScene.create = function () {
  cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
  enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);



  //Colocación de sprites en pantalla
  background = this.game.add.sprite(0,0, 'background1');
  playerSelection = this.game.add.sprite(75,300, 'playerSelection');
  heartIcon = this.game.add.sprite(175,310, 'heartIcon');
  P1text = this.game.add.bitmapText(210, 310, 'pixel','1 Player',50);
  P2text = this.game.add.bitmapText(210, 345, 'pixel','2 Players',50);
  }
  MenuScene.update = function(){
    inputManager();
  }
function inputManager(){
  if(cursors.down.isDown){//Cambia la posición del icono de slección
    heartIcon.y=345;
  }
  else if(cursors.up.isDown){
    heartIcon.y=310;
  }
  if(enterKey.isDown){
    if( heartIcon.y==310){//Controla el acceso a los modos de juego según la posición del icono
      MenuScene.game.state.start('options1');
    }
    else if (heartIcon.y==345){
      MenuScene.game.state.start('options2');
    }
  }
}

module.exports = MenuScene;
