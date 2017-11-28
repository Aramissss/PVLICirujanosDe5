'use strict';
/*var item = require('./item.js');
var Item = item.Item;
var Pill = item.Pill;
*/
var cursors;
var currentPill;
var glass;
var game;

//'none' 'blue' 'yellow' 'red'
var cells = [];//Array que contiene las casillas
var cellsSprites = [];//Array que contiene los sprites de las casillas
var fallDelay=500;
var timer, fallLoop, moveLoop;
var inputStartTime;
var moveDelay=fallDelay/4;
var keyInput='';
var cellWidth, cellHeight;
var movable;
var colors = ['blue', 'yellow', 'red'];

var GameScene = {};
GameScene.preload = function(){//Carga los sprites
  this.game.load.image('blue', 'images/blue.png');
  this.game.load.image('yellow', 'images/yellow.png');
  this.game.load.image('red', 'images/red.png');
  this.game.load.image('glass', 'images/glass.png');
}
GameScene.create = function(){
    //Añade el sprite de fondo
    glass = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'glass');
    game=this.game;
    glass.scale.setTo(2,2);
    glass.x =this.game.world.centerX-glass.width/2;
    glass.y =this.game.world.centerY-glass.height/2;
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
    currentPill.startPill(3,0,'red','yellow');
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
    if(cursors.down.isDown){//Cuando se pulsa hacia abajo el delay es menor
       fallLoop.delay=200;
    }
    else{
       fallLoop.delay=500;
    }
  }


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
        self.cellPosition[0]=x;
        self.cellPosition[1]=y;
        self.loadTexture(color1);//Cambia el sprite
        self.color = color1;
        self.attachedPill = {
          color: color2,//'blue' 'red' 'yellow' 'none'
          cellPosition : [self.cellPosition[0]+1,self.cellPosition[1]],//La píldora adherida aparece a la derecha
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
    Pill.prototype.rotate = function(dir){
        if(dir=='right'){

        }
        else {
          
        }
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
      //Método que devuelve un booleano dependiendo de si la celda contiene algún color
      function availableCell(x,y){
          if(cells[y][x]=='none'){
            return true;
          }
          else return false;
        }

    function changePill(){
      var auxY = currentPill.cellPosition[0];
      var auxX = currentPill.cellPosition[1];
      cells[auxX][auxY] = currentPill.color;

      auxY = currentPill.attachedPill.cellPosition[0];
      auxX = currentPill.attachedPill.cellPosition[1];
      cells[auxX][auxY] = currentPill.attachedPill.color;//Marca el color de las píldoras en la celda correspondiente
      //var rnd = game.rnd.integerInRange(0, 2);
      //console.log(rnd);
      currentPill.startPill(3,0,colors[game.rnd.integerInRange(0, 2)],colors[game.rnd.integerInRange(0, 2)]);
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
