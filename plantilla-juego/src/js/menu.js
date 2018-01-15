'use strict'
var Button;
var cursors;
var enterKey;
var background;
var playerSelection;
var heartIcon;
var MenuScene={};
var DrMarianoFront;
var P1text;
var P2text;
var rnd;
var DrMarianoTitle;
var redVirusAnim;
var yellowVirusAnim;
var blueVirusAnim;
var sound2;
MenuScene.create = function () {
  sound2 = this.game.add.audio('misc2');
  cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
  enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);



  //Colocación de sprites en pantalla
  background = this.game.add.sprite(0,0, 'background1');
  DrMarianoTitle = this.game.add.sprite(75,50,'DrMarianoMainTitle');
  playerSelection = this.game.add.sprite(75,300, 'playerSelection');
  heartIcon = this.game.add.sprite(175,335, 'heartIcon');
  DrMarianoFront = this.game.add.sprite(90,330,'DrMarianoFront');
  DrMarianoFront.animations.add('idle');
  DrMarianoFront.play('idle',3,true);

  rnd=this.game.rnd.integerInRange(0, 2);
  //El virus del menú se selecciona de manera aleatoria
  if(rnd==0){
    redVirusAnim=this.game.add.sprite(420,330,'redVirusAnim');
    redVirusAnim.animations.add('idle');
    redVirusAnim.play('idle',3,true);
  }
  else if(rnd==1){
    yellowVirusAnim=this.game.add.sprite(420,330,'yellowVirusAnim');
    yellowVirusAnim.animations.add('idle');
    yellowVirusAnim.play('idle',6,true);
  }
  else if(rnd==2){
    blueVirusAnim=this.game.add.sprite(420,330,'blueVirusAnim');
    blueVirusAnim.animations.add('idle');
    blueVirusAnim.play('idle',6,true);
  }

  P1text = this.game.add.bitmapText(210, 335, 'pixel','1 Player',50);
  P2text = this.game.add.bitmapText(210, 370, 'pixel','2 Players',50);
  }
  MenuScene.update = function(){
    inputManager();
  }
  function playFx(){
    sound2.play();
  }
function inputManager(){
  cursors.down.onDown.add(playFx,this)
  cursors.up.onDown.add(playFx,this)
  enterKey.onDown.add(playFx,this);
  if(cursors.down.isDown){//Cambia la posición del icono de slección
    heartIcon.y=370;
  }
  else if(cursors.up.isDown){
    heartIcon.y=335;
  }
  if(enterKey.isDown){
    if( heartIcon.y==335){//Controla el acceso a los modos de juego según la posición del icono
      MenuScene.game.state.start('options1');
    }
    else if (heartIcon.y==370){
      MenuScene.game.state.start('options2');
    }
  }
}

module.exports = MenuScene;
