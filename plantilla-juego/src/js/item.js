'use strict'
var options1 = require ('./options1.js');
var colors = ['blue', 'yellow', 'red'];
//Contiene Item, Pills

  Pill.prototype = Object.create(Phaser.Sprite.prototype);//Asignación de constructora
  Pill.prototype.constructor = Pill;

var lowSpeed=500;
var mediumSpeed=400;
var highSpeed=250;
function Pill(game, x,y,color1, color2, Board, xOffset, yOffset){//Píldoras, heredan de Item
      this.game=game;
      Phaser.Sprite.call(this, game, x, y, color1);//Se le asigna un sprite
      this.anchor.setTo(0.5,0.5);
      this.cellPosition = [0,0];
      this.cellPosition[0]=x;
      this.cellPosition[1]=y;

      this.xOffset=xOffset;//Diferencia que hay hasta su posición de dibujado
      this.yOffset=yOffset;

      this.board = Board;
      this.fallDelay=lowSpeed;
      this.fallLoop = game.time.events.loop(this.fallDelay, this.fall, this);//Bucle de caída
      this.fallLoop.timer.start();
      this.game.add.existing(this);
  };
  Pill.prototype.startPill = function(x,y,color1,color2){
    this.rotationState=0;//Hay 4 estados 0=0º 1=270º 2=180º 3=90º
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
    this.loadTexture(color1 + 'Pill');//Cambia el sprite
    this.color = color1;
    this.createNextPill();
    this.attachedPill = {
      color: color2,//'blue' 'red' 'yellow' 'none'
      cellPosition : [this.cellPosition[0]+1,this.cellPosition[1]],//La píldora adherida aparece a la derecha
      rotOffset : [[1,0],[0,1],[-1,0],[0,-1]],//Offset respecto a la píldora principal
      sprite : this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, color2 + 'Pill'),
      getPosX(){
        return this.cellPosition[0];
      },
      getPosY(){
        return this.cellPosition[1];
      },
      changePos(x,y){//Cambia los valores de la posición
        this.cellPosition[0]=x;
        this.cellPosition[1]=y;
      },
    }
    this.attachedPill.sprite.anchor.setTo(0.5,0.5);
    this.attachedPill.sprite.scale.setTo(-1,1);
    this.setRotation(0);
  }

  //BUCLE PRINCIPAL
  Pill.prototype.fall = function(){//Función de caída que se repite en bucle
    if(this.board.pillBroken){//Si hay alguna píldora rota cae
      var arrayHalfPills = this.board.checkBrothers();
      this.board.pillBroken=false;
      this.board.collapsePills();
      if(arrayHalfPills.length>0){
        this.board.pillBroken=true;
      }
      else {//Cuando hayan colapsado todas comprueba sus adyacentes
        this.board.checkAdjacentInBoard();
      }
    }
    else if (!this.displaceEntirePill(0,1)){//Si no consigue caer
      this.copyPill();//Copia los valores de la píldora en la matriz
      this.board.checkAdjacentColors(this.color, this.getPosX(), this.getPosY());//Comprueba adyacencias
      this.board.checkAdjacentColors(this.attachedPill.color, this.attachedPill.getPosX(), this.attachedPill.getPosY());
      this.attachedPill.sprite.destroy();
      this.changePill();//Crea otra píldora
      }
    }

    Pill.prototype.update=function(){//Se hace un update a la posición en la que aparece en pantalla
      this.setPosition();
    }

    Pill.prototype.setPosition=function(){//Coloca el sprite donde corresponde en el tablero
      this.x=16*this.getPosX()+this.xOffset;
      this.y=16*this.getPosY()+this.yOffset;
      this.attachedPill.sprite.x=16*this.attachedPill.getPosX()+this.xOffset;
      this.attachedPill.sprite.y=16*this.attachedPill.getPosY()+this.yOffset;
    }

    Pill.prototype.copyPill = function(){//Copia los valores de la píldora al tablero
      this.board.cells[this.getPosY()][this.getPosX()].setBrother(this.attachedPill.getPosX(),this.attachedPill.getPosY());
      this.board.cells[this.getPosY()][this.getPosX()].changeCell(this.color, 'Pill', this.rotationState,false);
      this.board.cells[this.attachedPill.getPosY()][this.attachedPill.getPosX()].setBrother(this.getPosX(),this.getPosY());
      this.board.cells[this.attachedPill.getPosY()][this.attachedPill.getPosX()].changeCell(this.attachedPill.color, 'Pill', this.rotationState, true);
    }

    Pill.prototype.changePill =function(){//Asigna el color a la píldora y crea la siguiente
        this.startPill(3,1,this.nextPill.color1,this.nextPill.color2);
        this.createNextPill();
      }

    Pill.prototype.createNextPill = function(){
        this.nextPill  = {
          color1: colors[this.game.rnd.integerInRange(0, 2)],
          color2: colors[this.game.rnd.integerInRange(0, 2)],
        }
      }


  Pill.prototype.changePos=function(x,y){//Cambia los valores de la posición
    this.cellPosition[0]=x;
    this.cellPosition[1]=y;
  }
  Pill.prototype.getPosX=function(){
    return this.cellPosition[0];
  }
  Pill.prototype.getPosY=function(){
    return this.cellPosition[1];
  }

  Pill.prototype.setFallSpeed = function(fallSpeed)
  {
    this.fallLoop.delay= fallSpeed;
  }

  Pill.prototype.freePosition= function(dirX,dirY)
  {//Comprueba si la píldora entera puede colocarse en la posición a la que apunta la dirección
    if(this.availableCell(this.getPosX()+dirX, this.getPosY()+dirY)
      && this.availableCell(this.attachedPill.getPosX()+dirX, this.attachedPill.getPosY()+dirY))
      {
        return true;
      }
      else return false;
  }
  Pill.prototype.availableCell = function(x,y){
    if(x>=8 || y>=17 || x<0 || y<0){
      return false;
    }
    else if(this.board.cells[y][x].color=='none'){
      return true;
    }
  }
  Pill.prototype.displaceEntirePill = function(dirX,dirY){//Mueve la píldora entera según la dirección
    if(this.freePosition(dirX,dirY)){//Si hay espacio donde indica la dirección
      this.changePos(this.getPosX()+dirX,this.getPosY()+dirY);
      this.attachedPill.changePos(this.attachedPill.getPosX()+dirX,this.attachedPill.getPosY()+dirY);
      return true;
    }
    else return false;
  }
  Pill.prototype.move = function(keyInput){//Recibe una tecla del inputManager y mueve su posición
      if(keyInput=='r'){//Derecha
        this.displaceEntirePill(1,0);
      }
      else if(keyInput=='l'){//Izquierda
        this.displaceEntirePill(-1,0);
      }
    }
    Pill.prototype.setFallDelay = function (speed){//Asigna la velocidad de caída
        this.fallDelay=speed;
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

        if(this.canRotate(this.getPosX(),this.getPosY(),this.attachedPill.getPosX(),this.attachedPill.getPosY(),this.attachedPill.rotOffset, rotDir)){
          this.attachedPill.changePos(this.getPosX()+this.attachedPill.rotOffset[this.rotationState][0], this.getPosY()+this.attachedPill.rotOffset[this.rotationState][1]);
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
    var auxX = this.getPosX();
    var auxY = this.getPosY();
    this.changePos(this.attachedPill.getPosX(),this.attachedPill.getPosY())
    this.attachedPill.changePos(auxX,auxY);
  }


module.exports = {
  Pill : Pill,
}
