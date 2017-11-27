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


  function Pill(game,x,y,color1,color2){//Píldoras, heredan de Item
    var self=this;
    Item.call(self, game, x, y, color1)
    self.vertical=false;//Posición vertical u horizontal

    if(color2!='none'){

      self.attachedPill = {
        color: color2,//'blue' 'red' 'yellow' 'none'
        cellPosition : [self.cellPosition[0]++,self.cellPosition[1]],//La píldora adherida aparece a la derecha
        sprite: game.add.sprite(this.game.world.centerX,this.game.world.centerY, color2),
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
    if(this.attachedPill.color!='none'){
      this.attachedPill.sprite.x=16*this.attachedPill.cellPosition[0]+this.xOffset;
      this.attachedPill.sprite.y=16*this.attachedPill.cellPosition[1]+this.yOffset;
    }
    console.log(this.attachedPill.cellPosition[0]);
    console.log(this.attachedPill.cellPosition[1]);
  };
  Pill.prototype.move = function(keyInput){//Recibe una tecla del inputManager y mueve su posición
      if(keyInput=='r'){//Derecha
        this.cellPosition[0]++;
        this.attachedPill.cellPosition[0]++;
        if(this.cellPosition[0]>=8){//Recoloca las píldoras dependiendo de quién esté a la derecha
          this.cellPosition[0]=7;
          this.attachedPill.cellPosition[0]=6;
        }
        if(this.attachedPill.cellPosition[0]>=8){
          this.attachedPill.cellPosition[0]=7;
          this.cellPosition[0]=6;
        }
      }
      else if(keyInput=='l'){//Izquierda
        this.cellPosition[0]--;
        this.attachedPill.cellPosition[0]--;
        if(this.cellPosition[0]<0){//Recoloca las píldoras dependiendo de quién esté a la izquierda
          if(this.vertical){//Los coloca de forma distinta dependiendo de si están en vertical u horizontal

          }
          else{
            this.cellPosition[0]=0;
            this.attachedPill.cellPosition[0]=1;
          }
        }
        if(this.attachedPill.cellPosition[0]<0){
          if(this.vertical){

          }
          else{
            this.attachedPill.cellPosition[0]=0;
            this.cellPosition[0]=1;
          }
        }
      }
    }
  Pill.prototype.fall = function(){//Función de caída que se repite en bucle
      this.cellPosition[1]++;
      this.attachedPill.cellPosition[1]++;
      if(this.cellPosition[1]>=17){
        this.cellPosition[1]=16;
        this.attachedPill.cellPosition[1]=16;
      }
      if(this.attachedPill.cellPosition[1]>=17){
        this.cellPosition[1]=16;
        this.attachedPill.cellPosition[1]=16;
      }
    }

module.exports = {
  Item : Item,
  Pill : Pill,
}
