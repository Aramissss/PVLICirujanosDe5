(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
//Contiene Item, Pills y Virus
function Item(game,x,y,color){
    Phaser.Sprite.call(this, game, x, y, color);//Se le asigna un sprite
    this.xOffset=336;//la diferencia que hay entre el punto 0 y la posición en pantalla del frasco
    this.yOffset=180;
    this.color=color;
    this.cellPosition = [0,0];
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
    game.add.existing(this);
  };
  Item.prototype = Object.create(Phaser.Sprite.prototype);//Asignación de constructora
  Item.prototype.constructor = Item;


  function Pill(game,x,y,color1, color2){//Píldoras, heredan de Item
      var self=this;
      Item.call(self, game, x, y, color1)
      this.startPill = function(x,y,color1,color2){
          self.rotationState=0;//Hay 4 estados 0=0º 1=270º 2=180º 3=90º
          self.clockRotOffset = [[0,0],[0,-1],[1,1],[-1,0]];//La distancia al centro en celdas respecto a la rotación
          self.aclockRotOffset = [[0,1],[-1,-1],[1,0],[0,0]]
          self.cellPosition[0]=x;
          self.cellPosition[1]=y;
          self.loadTexture(color1);//Cambia el sprite
          self.color = color1;
          self.attachedPill = {
            color: color2,//'blue' 'red' 'yellow' 'none'
            cellPosition : [self.cellPosition[0]+1,self.cellPosition[1]],//La píldora adherida aparece a la derecha
            clockRotOffset : [[1,1],[-1,0],[0,0],[0,-1]],
            aclockRotOffset : [[1,0],[0,0],[0,1],[-1,-1]],
            sprite: game.add.sprite(game.world.centerX,game.world.centerY, color2),
          }
          self.attachedPill.sprite.scale.setTo(2,2);
          self.attachedPill.sprite.anchor.setTo(0,0);
        }
    self.game.add.existing(this);
  };
  Pill.prototype = Object.create(Item.prototype);//Asignación de constructora
  Pill.prototype.constructor = Pill;

  Pill.prototype.update=function(){//Se hace un update a la posición en la que aparece en pantalla

    this.x=16*this.cellPosition[0]+this.xOffset;
    this.y=16*this.cellPosition[1]+this.yOffset;
    this.attachedPill.sprite.x=16*this.attachedPill.cellPosition[0]+this.xOffset;
    this.attachedPill.sprite.y=16*this.attachedPill.cellPosition[1]+this.yOffset;


  };
  Pill.prototype.move = function(keyInput){//Recibe una tecla del inputManager y mueve su posición
      if(keyInput=='r'){//Derecha
        this.cellPosition[0]++;
        this.attachedPill.cellPosition[0]++;
        if(this.cellPosition[0]>=8 || this.attachedPill.cellPosition[0]>=8){//Recoloca las píldoras dependiendo de quién esté a la derecha
          this.cellPosition[0]--;
          this.attachedPill.cellPosition[0]--;
        }
        else if(!availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada a la derecha
          || !availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
          this.cellPosition[0]--;
          this.attachedPill.cellPosition[0]--;

        }
      }
      else if(keyInput=='l'){//Izquierda
        this.cellPosition[0]--;
        this.attachedPill.cellPosition[0]--;
        if(this.cellPosition[0]<0 || this.attachedPill.cellPosition[0]<0){//Recoloca las píldoras dependiendo de quién esté a la izquierda
            this.cellPosition[0]++;
            this.attachedPill.cellPosition[0]++;
        }
        else if(!availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada a la izquierda
          || !availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
            this.cellPosition[0]++;
            this.attachedPill.cellPosition[0]++;

        }
      }
    }
  Pill.prototype.rotate = function(rotDir){
    this.rotationState+=rotDir;
    if(this.rotationState>=4){
      this.rotationState=0;
    }
    else if(this.rotationState<0){
      this.rotationState=3;
    }
    //Si está en el límite derecho del mapa y no hay celdas a la izquierda la píldora se movera para facilitar la rotación
    if(!availableCell(this.cellPosition[0]+1, this.cellPosition[1]) && !availableCell(this.attachedPill.cellPosition[0]+1, this.cellPosition[1])){
      if(availableCell(this.cellPosition[0]-1, this.cellPosition[1]) && availableCell(this.attachedPill.cellPosition[0]-1, this.cellPosition[1])){
        if(this.canRotate(this.cellPosition[0]-1,this.cellPosition[1],this.attachedPill.cellPosition[0]-1 ,this.attachedPill.cellPosition[1],this.clockRotOffset, this.attachedPill.clockRotOffset, rotDir)){
          this.cellPosition[0]--;
          this.attachedPill.cellPosition[0]--;
        }
      }
    }
    //Comprueba que puede rotar hacia la derecha
    if(rotDir>0 && this.canRotate(this.cellPosition[0],this.cellPosition[1],this.attachedPill.cellPosition[0] ,this.attachedPill.cellPosition[1],this.clockRotOffset, this.attachedPill.clockRotOffset, rotDir)){//Clockwise offset

      this.cellPosition[0]+=this.clockRotOffset[this.rotationState][0];
      this.cellPosition[1]+=this.clockRotOffset[this.rotationState][1];
      this.attachedPill.cellPosition[0]+=this.attachedPill.clockRotOffset[this.rotationState][0];
      this.attachedPill.cellPosition[1]+=this.attachedPill.clockRotOffset[this.rotationState][1];
    }
    //Comprueba que puede rotar hacia la izquierda
    else if(rotDir<0 && this.canRotate(this.cellPosition[0],this.cellPosition[1],this.attachedPill.cellPosition[0] ,this.attachedPill.cellPosition[1] ,this.aclockRotOffset, this.attachedPill.aclockRotOffset,rotDir)) {//Anticlockwise offset
      this.cellPosition[0]+=this.aclockRotOffset[this.rotationState][0];
      this.cellPosition[1]+=this.aclockRotOffset[this.rotationState][1];
      this.attachedPill.cellPosition[0]+=this.attachedPill.aclockRotOffset[this.rotationState][0];
      this.attachedPill.cellPosition[1]+=this.attachedPill.aclockRotOffset[this.rotationState][1];
    }
  }
  Pill.prototype.canRotate = function (auxX1,auxY1,auxX2,auxY2,rotOffset1, rotOffset2, rotDir){
    auxX1 +=rotOffset1[this.rotationState][0];
    auxY1 +=rotOffset1[this.rotationState][1];
    auxX2 +=rotOffset2[this.rotationState][0];
    auxY2 +=rotOffset2[this.rotationState][1];
    if(availableCell(auxX1,auxY1) && availableCell(auxX2, auxY2)){
      return true;
    }
    else {
      if(rotDir>0){
      this.rotationState--;
      }
    else this.rotationState++;
    return false;
    }

  }

  Pill.prototype.switchPillSides = function(){//Intercambia las posiciones de los dos lados de la píldora
    var auxX = this.cellPosition[0];
    var auxY = this.cellPosition[1];
    this.cellPosition[0] = this.attachedPill.cellPosition[0];
    this.cellPosition[1] = this.attachedPill.cellPosition[1];
    this.attachedPill.cellPosition[0] = auxX;
    this.attachedPill.cellPosition[1] = auxY;
  }

  Pill.prototype.fall = function(){//Función de caída que se repite en bucle
      this.cellPosition[1]++;
      this.attachedPill.cellPosition[1]++;
      if(this.cellPosition[1]>=17 || this.attachedPill.cellPosition[1]>=17){//Comprueba que no llegue al final del mapa
              this.cellPosition[1]--;
              this.attachedPill.cellPosition[1]--;
              changePill();
      }
      else if(!availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada debajo
        || !availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
              this.cellPosition[1]--;
              this.attachedPill.cellPosition[1]--;
              changePill();
      }
    }

module.exports = {
  Item : Item,
  Pill : Pill,
}

},{}],2:[function(require,module,exports){
'use strict';

var GameScene = require('./play_game.js');
var MenuScene = require('./menu.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.baseURL = 'https://aramissss.github.io/PVLICirujanosDe5/plantilla-juego/src/';
    this.game.load.crossOrigin = 'anonymous';
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.image('menuButton','images/menuButton.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    
  },

  create: function () {
    this.game.state.start('menu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('playGame', GameScene);
  game.state.add('menu', MenuScene)

  game.state.start('boot');
};

},{"./menu.js":3,"./play_game.js":4}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
(function (global){
'use strict';
var item = require('./item.js');
var Item = item.Item;
var Pill = item.Pill;

var cursors;
var ZKey;
var XKey;
var currentPill;
var glass;
var game;

//'none' 'blue' 'yellow' 'red'
var cells = [];//Array que contiene las casillas
var cellsSprites = [];//Array que contiene los sprites de las casillas
var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
var fallDelay;
var timer, fallLoop, moveLoop;
var inputStartTime;
var moveDelay=fallDelay/4;
var keyInput='';
var cellWidth, cellHeight;
var movable;
var colors = ['blue', 'yellow', 'red'];
var rotDir=0;//0=null 1=clockwise -1=anticlockwise

var GameScene = {};
GameScene.preload = function(){//Carga los sprites
  this.game.load.image('blue', 'images/blue.png');
  this.game.load.image('yellow', 'images/yellow.png');
  this.game.load.image('red', 'images/red.png');
  this.game.load.image('glass', 'images/glass.png');
}
GameScene.create = function(){
    //Añade el sprite de fondo
    fallDelay=lowSpeed;
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    game=this.game;
    glass.scale.setTo(2,2);
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
    ZKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    XKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    cursors = this.game.input.keyboard.createCursorKeys();//Asigna los cursores
    cellWidth=16;//Medidas de las celdas
    cellHeight=16;
    for(var i=0; i<17;i++){//Crea array vacío
        cells[i]=[];
      for(var j=0; j<8;j++){
        cells[i][j]='none';
      }
    }
    for(var i=0; i<17;i++){//Crea array vacío
      cellsSprites[i]=[];
      for(var j=0; j<8;j++){
        cellsSprites[i][j]='none';
        cellsSprites[i][j] = game.add.sprite(16*j+336,16*i+180);//Les añade sprites vaciós a las celdas
      }
    }

    currentPill = new Pill(this.game, 3,0, 'red','yellow');//Crea píldota nueva
    currentPill.startPill(3,1,'red','yellow');
    currentPill.scale.setTo(2,2);
    currentPill.anchor.setTo(0,0);
    this.game.add.existing(currentPill);//La añade al game

    timer = this.game.time.events;//Temporizador
    fallLoop = timer.loop(fallDelay, currentPill.fall, currentPill);//Bucle de caída
    timer.start();
  }

GameScene.update = function() {
    inputManager();
    currentPill.move(keyInput);

    paintMap();
  }

function inputManager(){
    if(cursors.right.isDown){
      if(cursors.right.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput='r';
      }
      else if(cursors.right.duration>250){
        keyInput='r';
      }
      else {
        keyInput='';
      }
    }
    else if(cursors.left.isDown){
      if(cursors.left.duration<1){//Simula aumento de velocidad si se mantiene pulsado
        keyInput='l';
      }
      else if(cursors.left.duration>250){
        keyInput='l';
      }
      else {
        keyInput='';
      }
    }
    else{
      keyInput='';
    }
    if(XKey.isDown && XKey.duration<1) {//Clockwise
      rotDir=1;
      currentPill.rotate(rotDir);
    }
    else if(ZKey.isDown && ZKey.duration<1){//Anticlockwise
      rotDir=-1;
      currentPill.rotate(rotDir);
    }
    else {
      rotDir=0;
    }

    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       fallLoop.delay=100;
    }
    else{
       fallLoop.delay=fallDelay;
    }
  }
      //Método que devuelve un booleano dependiendo de si la celda contiene algún color
    global.availableCell = function(x,y){
          if(cells[y][x]=='none'){
            return true;
          }
          else return false;
        }

    global.changePill =function(){
      var auxY = currentPill.cellPosition[0];
      var auxX = currentPill.cellPosition[1];
      cells[auxX][auxY] = currentPill.color;

      auxY = currentPill.attachedPill.cellPosition[0];
      auxX = currentPill.attachedPill.cellPosition[1];
      cells[auxX][auxY] = currentPill.attachedPill.color;//Marca el color de las píldoras en la celda correspondiente

      currentPill.startPill(3,1,colors[game.rnd.integerInRange(0, 2)],colors[game.rnd.integerInRange(0, 2)]);
    }
    function paintMap(){
      for(var i=0; i<17;i++){
        for(var j=0; j<8;j++){
          if(cells[i][j]=='yellow'){
            cellsSprites[i][j].loadTexture('yellow');
            cellsSprites[i][j].scale.setTo(2,2);
            cellsSprites[i][j].anchor.setTo(0,0);
          }
          else if(cells[i][j]=='red'){
            cellsSprites[i][j].loadTexture('red');
            cellsSprites[i][j].scale.setTo(2,2);
            cellsSprites[i][j].anchor.setTo(0,0);
          }
          else if(cells[i][j]=='blue'){
            cellsSprites[i][j].loadTexture('blue');
            cellsSprites[i][j].scale.setTo(2,2);
            cellsSprites[i][j].anchor.setTo(0,0);
          }
        }
      }
    }


module.exports = GameScene;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./item.js":1}]},{},[2]);
