'use strict'

var background;
var cursors;
var enterKey;
var optionsWindow;
var Player1text;
var P1text;
var levelSelecText;
var levelText;
var speedSelecText;
var speedText;
var musicText;
var musicSelecText;
var levelMeter;
var optionSelec;
var selecIcon1;//Icono para el nivel
var selecIcon2;//Icono para la velocidad
var selecIcon3;//Icono para la música
var levelFrame;

var OptionsScene1={};

OptionsScene1.create = function () {
  this.option=1;//Variable que indica en qué opción está posado el icono
  this.speed=0;
  this.music=0;
  this.level=0;
  cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
  enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  //Colocación de sprites
  background = this.game.add.sprite(0,0, 'background2');
  optionsWindow = this.game.add.sprite(50,0, 'optionsWindow');
  levelMeter = this.game.add.sprite(150,160,'levelMeter');
  optionSelec = this.game.add.sprite(80,100, 'heartIcon');
  selecIcon1 = this.game.add.sprite(142,125, 'arrowIcon');
  selecIcon2 = this.game.add.sprite(195,280, 'arrowIcon');
  selecIcon3 = this.game.add.sprite(235,400, 'arrowIcon');
  //Colocación de texto
  Player1text = this.game.add.bitmapText(210, 30, 'pixel','1 Player',50);
  P1text = this.game.add.bitmapText(112, 167, 'pixel','P1',50);
  levelSelecText = this.game.add.bitmapText(115,100,'pixel','VIRUS LEVEL',50);
  levelText = this.game.add.bitmapText(450,165,'pixel','VIRUS LEVEL',60);
  levelFrame = this.game.add.sprite(445,160,'levelFrame');
  speedSelecText = this.game.add.bitmapText(115,250,'pixel','SPEED',50);
  speedText = this.game.add.bitmapText(175,310,'pixel','LOW   MED    HI',50);
  musicSelecText = this.game.add.bitmapText(115,375,'pixel','MUSIC',50);
  musicText = this.game.add.bitmapText(225,430,'pixel','ON    OFF',50);

}
OptionsScene1.update = function () {
  inputManager();
}
function iconManager(){//Pone los iconos en su lugar
  if(OptionsScene1.option==1){
    optionSelec.y=100;
  }
  else if(OptionsScene1.option==2){
    optionSelec.y=250;
  }
  else if(OptionsScene1.option==3){
    optionSelec.y=375;
  }

  selecIcon1.x = 140+14*OptionsScene1.level;
  selecIcon2.x= 195+115*OptionsScene1.speed;
  selecIcon3.x=235+115*OptionsScene1.music;
  levelText.text = OptionsScene1.level;

}
function optionDown(){
  OptionsScene1.option++;
  if(OptionsScene1.option>3){
    OptionsScene1.option=3;
  }
}
function optionUp(){
  OptionsScene1.option--;
  if(OptionsScene1.option<1){
    OptionsScene1.option=1;
  }
}
function addOption(){
  if(OptionsScene1.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene1.level++;
    if(OptionsScene1.level>20){
      OptionsScene1.level=20;
    }
  }
  else if(OptionsScene1.option==2){//Selector en velocidad
    OptionsScene1.speed++;
    if(OptionsScene1.speed>2){
      OptionsScene1.speed=2;
    }
  }
  else if(OptionsScene1.option==3){
    OptionsScene1.music++;
    if(OptionsScene1.music>1){
      OptionsScene1.music=1;
    }
  }
}
function substractOption(){
  if(OptionsScene1.option==1){//Cuando el selector está en la opción de nivel este aumenta
    OptionsScene1.level--;
    if(OptionsScene1.level<0){
      OptionsScene1.level=0;
    }
  }
  else if(OptionsScene1.option==2){//Selector en velocidad
    OptionsScene1.speed--;
    if(OptionsScene1.speed<0){
      OptionsScene1.speed=0;
    }
  }
  else if(OptionsScene1.option==3){
    OptionsScene1.music--;
    if(OptionsScene1.music<0){
      OptionsScene1.music=0;
    }
  }
}
function inputManager(){
  cursors.down.onDown.add(optionDown,this)
  cursors.up.onDown.add(optionUp,this);
  cursors.right.onDown.add(addOption,this);
  cursors.left.onDown.add(substractOption,this);
  if(enterKey.isDown){
      OptionsScene1.game.state.start('playGame');
    }
    iconManager();
  }
module.exports = OptionsScene1;
