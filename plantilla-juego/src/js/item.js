'use strict'
var board;
var colors = ['blue', 'yellow', 'red'];
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


  function Pill(game,x,y,color1, color2, Board){//Píldoras, heredan de Item
      board = Board;
      var self=this;
      this.game = game;
      Item.call(self, game, x, y, color1)
      this.startPill = function(x,y,color1,color2){
          self.rotationState=0;//Hay 4 estados 0=0º 1=270º 2=180º 3=90º
          //self.clockRotOffset = [[0,0],[0,-1],[1,1],[-1,0]];//La distancia al centro en celdas respecto a la rotación
          //self.aclockRotOffset = [[0,1],[-1,-1],[1,0],[0,0]]

          self.cellPosition[0]=x;
          self.cellPosition[1]=y;
          self.loadTexture(color1 + 'Pill');//Cambia el sprite
          self.color = color1;
          self.attachedPill = {
            color: color2,//'blue' 'red' 'yellow' 'none'
            cellPosition : [self.cellPosition[0]+1,self.cellPosition[1]],//La píldora adherida aparece a la derecha
            //clockRotOffset : [[1,1],[-1,0],[0,0],[0,-1]],
            //aclockRotOffset : [[1,0],[0,0],[0,1],[-1,-1]],
            rotOffset : [[1,0],[0,1],[-1,0],[0,-1]],//Offset respecto a la píldora principal
            sprite : game.add.sprite(game.world.centerX,game.world.centerY, color2 + 'Pill'),
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
      this.cellPosition[1]++;
      this.attachedPill.cellPosition[1]++;
      if(!this.availableCell(this.cellPosition[0], this.cellPosition[1])//Comprueba que no haya una celda ocupada debajo
        || !this.availableCell(this.attachedPill.cellPosition[0], this.attachedPill.cellPosition[1])){
              this.cellPosition[1]--;
              this.attachedPill.cellPosition[1]--;
              var color1 = this.color;
              var color2 = this.attachedPill.color;
              var auxX1=this.cellPosition[0];
              var auxY1=this.cellPosition[1];
              var auxX2=this.attachedPill.cellPosition[0];
              var auxY2=this.attachedPill.cellPosition[1];

              this.changePill();
              board.checkAdjacentColors(color1, auxX1, auxY1);
              board.checkAdjacentColors(color2, auxX2, auxY2);


      }
    }
  Pill.prototype.availableCell = function(x,y){
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

  Pill.prototype.changePill =function(){
      var auxY = this.cellPosition[0];
      var auxX = this.cellPosition[1];
      board.cells[auxX][auxY].changeCell(this.color, 'Pill');

      auxY = this.attachedPill.cellPosition[0];
      auxX = this.attachedPill.cellPosition[1];
      board.cells[auxX][auxY].changeCell(this.attachedPill.color, 'Pill');//Marca el color de las píldoras en la celda correspondiente

      this.startPill(3,1,colors[this.game.rnd.integerInRange(0, 2)],colors[this.game.rnd.integerInRange(0, 2)]);
    }
module.exports = {
  Item : Item,
  Pill : Pill,
}
