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
