'use strict'

var background;
var cursors;
var enterKey;
var backspaceKey;
var optionsWindow;
var Player2text;
var P1text;
var P2text;
var levelSelecText;
var level1Text;
var level2Text;
var speedSelecText;
var speedText;
var musicText;
var musicSelecText;
var levelMeter;
var optionSelec;
var selecIcon1p1;//Icono para el nivel del j1
var selecIcon1p2;//Icono para el nivel del j2
var selecIcon2p1;//Icono para la velocidad del j1
var selecIcon2p2;//Icono para la velocidad del j2
var selecIcon3;//Icono para la música
var levelFrame;
var aKey;//Teclas para el jugador 2
var dKey;
var wKey;
var sKey;

var OptionsScene2={};
var sound2;
OptionsScene2.create = function () {
  sound2 = this.game.add.audio('misc2');
  this.option=1;//Variable que indica en qué opción está posado el icono
  this.speed1=0;
  this.level1=0;
  this.speed2=0;//Opciones del jugador 2
  this.level2=0;
  this.music=0;
  aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
  enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  backspaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
  //Colocación de sprites
  background = this.game.add.sprite(0,0, 'background2');
  optionsWindow = this.game.add.sprite(50,0, 'optionsWindow');
  levelMeter = this.game.add.sprite(150,160,'levelMeter');
  optionSelec = this.game.add.sprite(80,100, 'heartIcon');
  selecIcon1p1 = this.game.add.sprite(140,125, 'arrowIcon');//Level P1
  selecIcon1p2 = this.game.add.sprite(140,235, 'arrowIcon');//Level P2
  selecIcon2p1 = this.game.add.sprite(195,280, 'arrowIcon');//Speed P1
  selecIcon2p2 = this.game.add.sprite(195,365, 'arrowIcon');//Speed P2
  selecIcon1p2.scale.setTo(1,-1);
  selecIcon2p2.scale.setTo(1,-1);
  selecIcon3 = this.game.add.sprite(235,400, 'arrowIcon');
  //Colocación de texto
  Player2text = this.game.add.bitmapText(210, 30, 'pixel','2 Players',50);
  P1text = this.game.add.bitmapText(112, 155, 'pixel','P1',50);
  P2text = this.game.add.bitmapText(112, 180, 'pixel','P2',50);
  levelSelecText = this.game.add.bitmapText(115,100,'pixel','VIRUS LEVEL',50);
  level1Text = this.game.add.bitmapText(450,155,'pixel','VIRUS LEVEL',60);
  level2Text = this.game.add.bitmapText(450,180,'pixel','VIRUS LEVEL',60);
  levelFrame = this.game.add.sprite(445,152,'levelFrame');
  levelFrame.scale.setTo(1,1.5);
  speedSelecText = this.game.add.bitmapText(115,250,'pixel','SPEED',50);
  speedText = this.game.add.bitmapText(175,310,'pixel','LOW   MED    HI',50);
  musicSelecText = this.game.add.bitmapText(115,375,'pixel','MUSIC',50);
  musicText = this.game.add.bitmapText(225,430,'pixel','ON    OFF',50);

}
OptionsScene2.update = function () {
  inputManager();
}
function playFx(){
  sound2.play();
}
function iconManager(){//Pone los iconos en su lugar
  if(OptionsScene2.option==1){
    optionSelec.y=100;
  }
  else if(OptionsScene2.option==2){
    optionSelec.y=250;
  }
  else if(OptionsScene2.option==3){
    optionSelec.y=375;
  }

  selecIcon1p1.x = 140+14*OptionsScene2.level1;
  selecIcon1p2.x= 140+14*OptionsScene2.level2;
  selecIcon2p1.x = 195+115*OptionsScene2.speed1;
  selecIcon2p2.x= 195+115*OptionsScene2.speed2;
  selecIcon3.x=235+115*OptionsScene2.music;
  level1Text.text = OptionsScene2.level1;
  level2Text.text = OptionsScene2.level2;

}
function optionDown(){
  playFx();
  OptionsScene2.option++;
  if(OptionsScene2.option>3){
    OptionsScene2.option=3;
  }
}
function optionUp(){
  playFx();
  OptionsScene2.option--;
  if(OptionsScene2.option<1){
    OptionsScene2.option=1;
  }
}
function addOption1(){
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level1++;
    if(OptionsScene2.level1>20){
      OptionsScene2.level1=20;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed1++;
    if(OptionsScene2.speed1>2){
      OptionsScene2.speed1=2;
    }
  }
  else if(OptionsScene2.option==3){
    OptionsScene2.music++;
    if(OptionsScene2.music>1){
      OptionsScene2.music=1;
    }
  }
}
function substractOption1(){
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level1--;
    if(OptionsScene2.level1<0){
      OptionsScene2.level1=0;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed1--;
    if(OptionsScene2.speed1<0){
      OptionsScene2.speed1=0;
    }
  }
  else if(OptionsScene2.option==3){
    OptionsScene2.music--;
    if(OptionsScene2.music<0){
      OptionsScene2.music=0;
    }
  }
}
function addOption2(){//Para el jugador 2
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level2++;
    if(OptionsScene2.level2>20){
      OptionsScene2.level2=20;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed2++;
    if(OptionsScene2.speed2>2){
      OptionsScene2.speed2=2;
    }
  }
}

function substractOption2(){// J2
  playFx();
  if(OptionsScene2.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene2.level2--;
    if(OptionsScene2.level2<0){
      OptionsScene2.level2=0;
    }
  }
  else if(OptionsScene2.option==2){//Selector en velocidad
    OptionsScene2.speed2--;
    if(OptionsScene2.speed2<0){
      OptionsScene2.speed2=0;
    }
  }
}
function inputManager(){
  cursors.down.onDown.add(optionDown,this)
  cursors.up.onDown.add(optionUp,this);
  sKey.onDown.add(optionDown,this);
  wKey.onDown.add(optionUp,this);
  cursors.right.onDown.add(addOption2,this);
  cursors.left.onDown.add(substractOption2,this);
  dKey.onDown.add(addOption1,this);
  aKey.onDown.add(substractOption1,this);
  iconManager();
  if(backspaceKey.isDown){
      OptionsScene2.game.state.start('menu');
  }

  if(enterKey.isDown){
      OptionsScene2.game.state.start('2pGame');
    }

  }
module.exports = OptionsScene2;
