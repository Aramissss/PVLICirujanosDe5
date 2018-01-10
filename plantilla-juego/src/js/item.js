'use strict'
var options1 = require ('./options1.js');
var board;
var colors = ['blue', 'yellow', 'red'];
//Contiene Item, Pills
function Item(game,x,y,color){
    Phaser.Sprite.call(this, game, x, y, color);//Se le asigna un sprite
    this.xOffset=244;//la diferencia que hay entre el punto 0 y la posición en pantalla del frasco
    this.yOffset=138;
    this.color=color;
    this.cellPosition = [0,0];
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
    this.anchor.setTo(0.5,0.5);
    this.scale.setTo(1,1);

    this.game.add.existing(this);
  };
  Item.prototype = Object.create(Phaser.Sprite.prototype);//Asignación de constructora
  Item.prototype.constructor = Item;
  Item.prototype.availableCell = function(x,y){
        if(x>=8 || y>=17){
          return false;
        }
        else if(x<0 || y<0){
          return false;
        }
        else if(board.cells[y][x].color=='none'){
          return true;
        }
      }
var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
function Pill(game, x,y,color1, color2, Board){//Píldoras, heredan de Item

       if(options1.speed==0){
         this.fallDelay=lowSpeed;
       }
       else if( options1.speed==1){
         this.fallDelay=mediumSpeed;
       }
       else {
         this.fallDelay=highSpeed;
       }
       this.fallLoop = game.time.events.loop(this.fallDelay, this.fall, this);//Bucle de caída
      Item.call(this, game, x, y, color1);
      this.game = game;
      board = Board;
      var self=this;
      this.fallLoop.timer.start();
      this.startPill = function(x,y,color1,color2){
          self.rotationState=0;//Hay 4 estados 0=0º 1=270º 2=180º 3=90º
          self.cellPosition[0]=x;
          self.cellPosition[1]=y;
          self.loadTexture(color1 + 'Pill');//Cambia el sprite
          self.color = color1;
          this.createNextPill();
          self.attachedPill = {
            color: color2,//'blue' 'red' 'yellow' 'none'
            cellPosition : [self.cellPosition[0]+1,self.cellPosition[1]],//La píldora adherida aparece a la derecha

            rotOffset : [[1,0],[0,1],[-1,0],[0,-1]],//Offset respecto a la píldora principal
            sprite : game.add.sprite(game.world.centerX,game.world.centerY, color2 + 'Pill'),
          }
          self.attachedPill.sprite.anchor.setTo(0.5,0.5);
          self.attachedPill.sprite.scale.setTo(-1,1);
          this.setRotation(0);
        }
  };
  Pill.prototype = Object.create(Item.prototype);//Asignación de constructora
  Pill.prototype.constructor = Pill;
  Pill.prototype.update=function(){//Se hace un update a la posición en la que aparece en pantalla
    this.setPosition();
  };
  Pill.prototype.setPosition=function(){
    this.x=16*this.cellPosition[0]+this.xOffset;
    this.y=16*this.cellPosition[1]+this.yOffset;
    this.attachedPill.sprite.x=16*this.attachedPill.cellPosition[0]+this.xOffset;
    this.attachedPill.sprite.y=16*this.attachedPill.cellPosition[1]+this.yOffset;
  }
  Pill.prototype.setFallSpeed = function(fallSpeed)
  {
    this.fallLoop.delay= fallSpeed;
  }
  Pill.prototype.move = function(keyInput){//Recibe una tecla del inputManager y mueve su posición
      if(keyInput=='r'){//Derecha
        this.cellPosition[0]++;
        this.attachedPill.cellPosition[0]++;
        if(this.cellPosition[0]>=8 || this.attachedPill.cellPosition[0]>=8){//Recoloca las píldoras dependiendo de quién esté a la derecha
          this.cellPosition[0]--;
          this.attachedPill.cellPosition[0]--;
        }
        else if(!this.availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada a la derecha
          || !this.availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
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
        else if(!this.availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada a la izquierda
          || !this.availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
            this.cellPosition[0]++;
            this.attachedPill.cellPosition[0]++;
        }
      }
    }
    Pill.prototype.setRotation = function(rotDir){
      //Coloca la píldora según el estado actual de la rotación
        this.rotationState+=rotDir;
        if(this.rotationState>=4){
          this.rotationState=0;
        }
        else if(this.rotationState<0){
          this.rotationState=3;
        }

        if(this.canRotate(this.cellPosition[0],this.cellPosition[1],this.attachedPill.cellPosition[0],this.attachedPill.cellPosition[1],this.attachedPill.rotOffset, rotDir)){
          this.attachedPill.cellPosition[0]=this.cellPosition[0]+this.attachedPill.rotOffset[this.rotationState][0];
          this.attachedPill.cellPosition[1]=this.cellPosition[1]+this.attachedPill.rotOffset[this.rotationState][1];
        }
        this.angle = this.rotationState*90;//Rota el sprite
        this.attachedPill.sprite.angle = this.rotationState*90;
 }
    Pill.prototype.canRotate = function (auxX1,auxY1,auxX2,auxY2,rotOffset, rotDir){
      //Comprueba que al rotar las nuevas posiciones estarán disponibles
      auxX1 +=rotOffset[this.rotationState][0];
      auxY1 +=rotOffset[this.rotationState][1];
      auxX2 +=rotOffset[this.rotationState][0];
      auxY2 +=rotOffset[this.rotationState][1];
      if(this.availableCell(auxX1,auxY1) && this.availableCell(auxX2, auxY2)){
        return true;
      }
      else {
        if(rotDir>0){
        this.rotationState--;
        }
        else if(rotDir<0) this.rotationState++;
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

    if(board.pillBroken){
      var arrayHalfPills = board.checkBrothers();
      board.pillBroken=false;
      board.collapsePills();
      if(arrayHalfPills.length>0){
        board.pillBroken=true;

      }
      else {//Cuando hayan colapsado todas comprueba sus adyacentes
        board.checkAdjacentInBoard();
      }
    }
    else{
      this.cellPosition[1]++;
      this.attachedPill.cellPosition[1]++;
      if(!this.availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada debajo
        || !this.availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
          this.cellPosition[1]--;
          this.attachedPill.cellPosition[1]--;
          this.copyPill();
          board.checkAdjacentColors(this.color, this.cellPosition[0], this.cellPosition[1]);
          board.checkAdjacentColors(this.attachedPill.color, this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1]);
          this.attachedPill.sprite.destroy();
          this.changePill();

          }
      }
    }
  Pill.prototype.createNextPill = function(){
      this.nextPill  = {
        color1: colors[this.game.rnd.integerInRange(0, 2)],
        color2: colors[this.game.rnd.integerInRange(0, 2)],
      }
    }
  Pill.prototype.copyPill = function(){//Copia los valores de la píldora al tablero
    board.cells[this.cellPosition[1]][this.cellPosition[0]].setBrother(this.attachedPill.cellPosition[0],this.attachedPill.cellPosition[1]);
    board.cells[this.cellPosition[1]][this.cellPosition[0]].changeCell(this.color, 'Pill', this.rotationState,false);
    board.cells[this.attachedPill.cellPosition[1]][this.attachedPill.cellPosition[0]].setBrother(this.cellPosition[0],this.cellPosition[1]);
    board.cells[this.attachedPill.cellPosition[1]][this.attachedPill.cellPosition[0]].changeCell(this.attachedPill.color, 'Pill', this.rotationState, true);
  }
  Pill.prototype.changePill =function(){//Asigna el color a la píldora y crea la siguiente
      this.startPill(3,1,this.nextPill.color1,this.nextPill.color2);
      this.createNextPill();
    }
module.exports = {
  Item : Item,
  Pill : Pill,
}
